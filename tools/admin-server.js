'use strict';
/**
 * Hadiwa IOC — Admin Server (Unified Control API)
 * Cổng trung tâm điều phối tất cả 9 simulators
 * Port: 7200
 *
 * Cho phép admin:
 *   - Xem trạng thái tất cả services
 *   - Chuyển kịch bản toàn hệ thống 1 lần bấm
 *   - Toggle Auto/Manual mode cho từng loại simulator
 *   - Override thủ công từng thông số
 *   - CRUD thiết bị (proxy tới từng simulator)
 *   - SSE stream để dashboard cập nhật real-time
 *
 * Endpoints:
 *   GET  /health
 *   GET  /api/admin/status              → Tổng quan tất cả services
 *   GET  /api/admin/scenario            → Kịch bản hiện tại + danh sách
 *   POST /api/admin/scenario            → Đổi kịch bản toàn hệ thống
 *   GET  /api/admin/mode                → Mode của từng simulator
 *   PUT  /api/admin/mode/:type          → Đổi mode (auto|manual)
 *   GET  /api/admin/devices/:type       → Danh sách thiết bị theo loại
 *   POST /api/admin/devices/:type       → Thêm thiết bị
 *   PUT  /api/admin/devices/:type/:id   → Sửa thiết bị
 *   DELETE /api/admin/devices/:type/:id → Xoá thiết bị
 *   PUT  /api/admin/override/:type/:id  → Manual override thông số
 *   GET  /api/admin/stream              → SSE real-time events
 *   POST /api/admin/control/:type/:id   → Control command (pump/sluice)
 */

require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const fs       = require('fs');
const path     = require('path');
const http     = require('http');

// ── Simulator port map (reads from .env, fallback to local defaults) ──────────
const SIM_PORTS = {
  hydro:     parseInt(process.env.HYDRO_HTTP_PORT       || '7100'),
  reservoir: parseInt(process.env.RESERVOIR_SCADA_PORT  || '7101'),
  datalogger:parseInt(process.env.RAINFALL_DATALOGGER_PORT || '7102'),
  pump:      parseInt(process.env.PUMP_SIM_PORT         || '7103'),
  flood:     parseInt(process.env.FLOOD_SENSOR_PORT     || '7104'),
  sluice:    parseInt(process.env.SLUICE_SIM_PORT       || '7105'),
  weather:   parseInt(process.env.WEATHER_SIM_PORT      || '7106'),
  landslide: parseInt(process.env.LANDSLIDE_SIM_PORT    || '7107'),
};

// ── Simple HTTP proxy helper ──────────────────────────────────────────────────
function proxyGet(port, simPath, res) {
  const req = http.get({ hostname: '127.0.0.1', port, path: simPath }, proxyRes => {
    res.status(proxyRes.statusCode).set('Content-Type', 'application/json');
    proxyRes.pipe(res);
  });
  req.on('error', () => res.status(502).json({ error: 'Simulator not available' }));
}

// Proxy POST (for gate control, scenario change via dashboard.js)
function proxyPost(port, simPath, body, res) {
  const bodyStr = JSON.stringify(body);
  const opts = { hostname: '127.0.0.1', port, path: simPath, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyStr) } };
  const req = http.request(opts, proxyRes => {
    res.status(proxyRes.statusCode).set('Content-Type', 'application/json');
    proxyRes.pipe(res);
  });
  req.on('error', () => res.status(502).json({ error: 'Simulator not available' }));
  req.write(bodyStr);
  req.end();
}

const HTTP_PORT = parseInt(process.env.ADMIN_PORT || '7200');

class AdminServer {
  /**
   * @param {object} engines  — { hydro, reservoir, pump, sluice }
   * @param {object} simulators — { hydroHTTP, floodMQTT, rsvSCADA, datalogger, pumpSim, floodSensor, sluiceSim, weather, landslide }
   */
  constructor(engines, simulators) {
    this.engines    = engines;
    this.simulators = simulators;
    this.app        = express();
    this._server    = null;
    this._sseClients = [];

    // Load scenarios definition
    const scenPath = path.join(__dirname, 'data/scenarios.json');
    this._scenarioDef = JSON.parse(fs.readFileSync(scenPath, 'utf8'));

    this._setupRoutes();
  }

  // ── SSE push to all dashboard clients ──────────────────────────
  _broadcast(event, data) {
    const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const res of this._sseClients) {
      try { res.write(msg); } catch (_) {}
    }
  }

  // ── Apply scenario to ALL engines ──────────────────────────────
  _applyScenarioAll(scenario) {
    const result = this.engines.hydro.setScenario(scenario);
    if (!result.success) return result;

    // Update scenarios.json current field
    try {
      const dp  = path.join(__dirname, 'data/scenarios.json');
      const raw = JSON.parse(fs.readFileSync(dp, 'utf8'));
      raw.current = scenario;
      fs.writeFileSync(dp, JSON.stringify(raw, null, 2));
    } catch (e) { /* non-fatal */ }

    this._broadcast('scenario', { scenario, time: new Date().toISOString() });
    console.log(`[ADMIN] 🎬 Kịch bản toàn hệ thống → ${scenario}`);
    return { success: true, scenario };
  }

  _getScenarioInfo() {
    const current   = this.engines.hydro.getScenario?.() || this.engines.hydro._scenario || 'normal';
    const scenarios = this._scenarioDef.scenarios || {};
    return { current, scenarios };
  }

  _buildStatus() {
    const hydro     = this.engines.hydro;
    const reservoir = this.engines.reservoir;
    const pump      = this.engines.pump;
    const sluice    = this.engines.sluice;

    const scenInfo = this._getScenarioInfo();
    const pumpAll  = pump?.formatAll() || [];
    const sluiceAll = sluice?.formatAll() || [];

    return {
      time:     new Date().toISOString(),
      scenario: scenInfo.current,
      services: {
        'hydro-http':     { port: 7100, type: 'HTTP', status: 'running', desc: '16 trạm thủy văn' },
        'reservoir-scada':{ port: 7101, type: 'HTTP', status: 'running', desc: '6 hồ chứa' },
        'rainfall-logger':{ port: 7102, type: 'HTTP', status: 'running', desc: '28 logger đo mưa' },
        'flood-mqtt':     { port: '1884/9002', type: 'MQTT', status: 'running', desc: 'MQTT broker' },
        'pump-station':   { port: 7103, type: 'HTTP', status: 'running', desc: `${pumpAll.length} trạm bơm` },
        'flood-sensor':   { port: 7104, type: 'HTTP', status: 'running', desc: '20 cảm biến ngập' },
        'sluice-gate':    { port: 7105, type: 'HTTP', status: 'running', desc: `${sluiceAll.length} cống điều tiết` },
        'weather':        { port: 7106, type: 'HTTP', status: 'running', desc: '5 trạm KT + dự báo' },
        'landslide':      { port: 7107, type: 'HTTP', status: 'running', desc: '10 cảm biến sạt lở' },
      },
      summary: {
        hydro:     { stations: Object.keys(hydro.getState()).length, scenario: scenInfo.current },
        reservoir: { reservoirs: Object.keys(reservoir?.getState() || {}).length },
        pump:      { total: pumpAll.length, running: pumpAll.filter(s => s.status === 'running').length, offline: pumpAll.filter(s => s.status === 'offline').length, totalFlow_m3s: +pumpAll.reduce((t, s) => t + (s.currentFlow_m3s || 0), 0).toFixed(1) },
        sluice:    { total: sluiceAll.length, open: sluiceAll.filter(s => s.status === 'open').length, totalFlow_m3s: +sluiceAll.reduce((t, s) => t + (s.currentFlow_m3s || 0), 0).toFixed(1) },
      },
    };
  }

  _setupRoutes() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, 'dashboard')));

    // ── Simulator API proxy (for browser clients behind nginx) ───────────────
    // Routes /api/sim/<type>/* → individual simulator ports
    // --- Hydro HTTP ---
    this.app.get('/api/sim/hydro/stations',        (req, res) => proxyGet(SIM_PORTS.hydro,      '/api/stations', res));
    this.app.get('/api/sim/hydro/health',          (req, res) => proxyGet(SIM_PORTS.hydro,      '/health', res));
    this.app.get('/api/sim/hydro/alerts',          (req, res) => proxyGet(SIM_PORTS.hydro,      '/api/alerts', res));
    this.app.post('/api/sim/hydro/scenario',       (req, res) => proxyPost(SIM_PORTS.hydro,     '/api/scenario', req.body, res));
    // --- Reservoir SCADA ---
    this.app.get('/api/sim/reservoir/reservoirs',  (req, res) => proxyGet(SIM_PORTS.reservoir,  '/api/reservoirs', res));
    this.app.get('/api/sim/reservoir/summary',     (req, res) => proxyGet(SIM_PORTS.reservoir,  '/api/summary', res));
    this.app.get('/api/sim/reservoir/health',      (req, res) => proxyGet(SIM_PORTS.reservoir,  '/health', res));
    this.app.post('/api/sim/reservoir/scenario',   (req, res) => proxyPost(SIM_PORTS.reservoir, '/api/scenario', req.body, res));
    this.app.post('/api/sim/reservoir/gate/:id',   (req, res) => proxyPost(SIM_PORTS.reservoir, `/api/reservoir/${req.params.id}/gate`, req.body, res));
    // --- Datalogger ---
    this.app.get('/api/sim/datalogger/rainfall/summary', (req, res) => proxyGet(SIM_PORTS.datalogger, '/api/rainfall/summary', res));
    this.app.get('/api/sim/datalogger/loggers',    (req, res) => proxyGet(SIM_PORTS.datalogger,  '/api/loggers', res));
    this.app.get('/api/sim/datalogger/health',     (req, res) => proxyGet(SIM_PORTS.datalogger,  '/health', res));
    // --- Pump / Flood / Sluice / Weather / Landslide ---
    this.app.get('/api/sim/pump/stations',         (req, res) => proxyGet(SIM_PORTS.pump,        '/api/stations', res));
    this.app.get('/api/sim/flood/sensors',         (req, res) => proxyGet(SIM_PORTS.flood,       '/api/sensors', res));
    this.app.get('/api/sim/sluice/sluices',        (req, res) => proxyGet(SIM_PORTS.sluice,      '/api/sluices', res));
    this.app.get('/api/sim/weather/current',       (req, res) => proxyGet(SIM_PORTS.weather,     '/api/weather/current', res));
    this.app.get('/api/sim/landslide/sensors',     (req, res) => proxyGet(SIM_PORTS.landslide,   '/api/sensors', res));

    // ── Health ──────────────────────────────────────────────────────
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', service: 'hadiwa-admin-server', port: HTTP_PORT, uptime_s: Math.round(process.uptime()), time: new Date().toISOString() });
    });

    // ── Device Catalog ───────────────────────────────────────────────
    this.app.get('/api/catalog', (req, res) => {
      try {
        const catalog = require('./data/device-catalog.js');
        const { type } = req.query;
        const devices = type ? catalog.getByType(type) : catalog.getAll();
        res.json({ success: true, count: devices.length, devices });
      } catch (e) {
        res.status(500).json({ success: false, error: e.message });
      }
    });

    // ── Status tổng hợp ──────────────────────────────────────────────
    this.app.get('/api/admin/status', (req, res) => {
      res.json({ success: true, data: this._buildStatus() });
    });

    // ── Scenario ─────────────────────────────────────────────────────
    this.app.get('/api/admin/scenario', (req, res) => {
      const info = this._getScenarioInfo();
      res.json({ success: true, ...info });
    });

    this.app.post('/api/admin/scenario', (req, res) => {
      const { scenario } = req.body;
      if (!scenario) return res.status(400).json({ success: false, error: 'scenario required' });
      if (!this._scenarioDef.scenarios[scenario]) return res.status(400).json({ success: false, error: `Unknown scenario: ${scenario}. Options: ${Object.keys(this._scenarioDef.scenarios).join(', ')}` });
      const result = this._applyScenarioAll(scenario);
      res.json(result);
    });

    // ── Mode ─────────────────────────────────────────────────────────
    this.app.get('/api/admin/mode', (req, res) => {
      res.json({
        success: true,
        modes: {
          pump:      this.engines.pump?.getMode() || 'auto',
          sluice:    this.engines.sluice?.getMode() || 'auto',
          floodSensor: this.simulators.floodSensor?._mode || 'auto',
          weather:   this.simulators.weather?._mode || 'auto',
          landslide: this.simulators.landslide?._mode || 'auto',
        },
      });
    });

    this.app.put('/api/admin/mode/:type', (req, res) => {
      const { type } = req.params;
      const { mode } = req.body;
      if (!['auto','manual'].includes(mode)) return res.status(400).json({ success: false, error: 'mode must be auto|manual' });

      const map = {
        pump:       () => this.engines.pump?.setMode(mode),
        sluice:     () => this.engines.sluice?.setMode(mode),
        floodSensor:() => { if (this.simulators.floodSensor) this.simulators.floodSensor._mode = mode; return { success: true, mode }; },
        weather:    () => { if (this.simulators.weather) this.simulators.weather._mode = mode; return { success: true, mode }; },
        landslide:  () => { if (this.simulators.landslide) this.simulators.landslide._mode = mode; return { success: true, mode }; },
        all:        () => {
          this.engines.pump?.setMode(mode);
          this.engines.sluice?.setMode(mode);
          if (this.simulators.floodSensor) this.simulators.floodSensor._mode = mode;
          if (this.simulators.weather) this.simulators.weather._mode = mode;
          if (this.simulators.landslide) this.simulators.landslide._mode = mode;
          return { success: true, mode, applied: 'all' };
        },
      };

      const fn = map[type];
      if (!fn) return res.status(400).json({ success: false, error: `Unknown type: ${type}` });
      const result = fn();
      this._broadcast('mode', { type, mode, time: new Date().toISOString() });
      res.json(result);
    });

    // ── CRUD Devices ─────────────────────────────────────────────────
    const deviceMap = () => ({
      pump:        this.engines.pump,
      sluice:      this.engines.sluice,
      floodSensor: this.simulators.floodSensor,
      weather:     this.simulators.weather,
      landslide:   this.simulators.landslide,
      hydro:       this.engines.hydro,
      reservoir:   this.engines.reservoir,
    });

    this.app.get('/api/admin/devices/:type', (req, res) => {
      const eng = deviceMap()[req.params.type];
      if (!eng) return res.status(404).json({ success: false, error: 'Unknown type' });
      const data = eng.formatAll?.() || Object.values(eng.getState?.() || {});
      res.json({ success: true, type: req.params.type, count: data.length, data });
    });

    this.app.post('/api/admin/devices/:type', (req, res) => {
      const eng = deviceMap()[req.params.type];
      if (!eng) return res.status(404).json({ success: false, error: 'Unknown type' });
      const addFn = eng.addStation || eng.addGate || eng._addSensor?.bind(eng);
      if (!addFn) return res.status(405).json({ success: false, error: 'CRUD not supported for this type' });
      const result = addFn(req.body);
      if (result.success) this._broadcast('device_added', { type: req.params.type, id: result.id });
      res.status(result.success ? 201 : 400).json(result);
    });

    this.app.put('/api/admin/devices/:type/:id', (req, res) => {
      const eng = deviceMap()[req.params.type];
      if (!eng) return res.status(404).json({ success: false, error: 'Unknown type' });
      const updateFn = eng.updateStation || eng.updateGate || eng._updateSensor?.bind(eng);
      if (!updateFn) return res.status(405).json({ success: false, error: 'CRUD not supported for this type' });
      const result = updateFn(req.params.id.toUpperCase(), req.body);
      if (result.success) this._broadcast('device_updated', { type: req.params.type, id: req.params.id });
      res.json(result);
    });

    this.app.delete('/api/admin/devices/:type/:id', (req, res) => {
      const eng = deviceMap()[req.params.type];
      if (!eng) return res.status(404).json({ success: false, error: 'Unknown type' });
      const delFn = eng.deleteStation || eng.deleteGate || eng._deleteSensor?.bind(eng);
      if (!delFn) return res.status(405).json({ success: false, error: 'CRUD not supported for this type' });
      const result = delFn(req.params.id.toUpperCase());
      if (result.success) this._broadcast('device_deleted', { type: req.params.type, id: req.params.id });
      res.json(result);
    });

    // ── Manual override thông số ──────────────────────────────────────
    this.app.put('/api/admin/override/:type/:id', (req, res) => {
      const { type, id } = req.params;
      const eng = deviceMap()[type];
      if (!eng) return res.status(404).json({ success: false, error: 'Unknown type' });
      const state = eng.getState?.();
      const item  = state?.[id.toUpperCase()];
      if (!item) return res.status(404).json({ success: false, error: 'Device not found' });
      Object.assign(item, req.body, { lastUpdated: new Date().toISOString() });
      this._broadcast('override', { type, id, fields: Object.keys(req.body) });
      res.json({ success: true, type, id, updated: req.body });
    });

    // ── Control command ─────────────────────────────────────────────
    this.app.post('/api/admin/control/:type/:id', (req, res) => {
      const { type, id } = req.params;
      let result;
      if (type === 'pump') {
        result = this.engines.pump?.controlStation(id.toUpperCase(), req.body.action, req.body);
      } else if (type === 'sluice') {
        result = this.engines.sluice?.controlGate(id.toUpperCase(), req.body.action, req.body);
      } else {
        return res.status(400).json({ success: false, error: `Control not supported for type: ${type}` });
      }
      if (!result) return res.status(500).json({ success: false, error: 'Engine not available' });
      if (!result.success) return res.status(400).json(result);
      this._broadcast('control', { type, id, action: req.body.action });
      res.json(result);
    });

    // ── SSE Real-time stream ──────────────────────────────────────────
    this.app.get('/api/admin/stream', (req, res) => {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.flushHeaders();

      // Send initial status
      res.write(`event: connected\ndata: ${JSON.stringify({ time: new Date().toISOString() })}\n\n`);

      this._sseClients.push(res);
      console.log(`[ADMIN] 📡 SSE client connected (${this._sseClients.length} total)`);

      req.on('close', () => {
        this._sseClients = this._sseClients.filter(c => c !== res);
        console.log(`[ADMIN] SSE client disconnected (${this._sseClients.length} remaining)`);
      });
    });
  }

  start() {
    return new Promise((resolve, reject) => {
      this._server = this.app.listen(HTTP_PORT, '0.0.0.0', () => {
        console.log(`[ADMIN] ✅ Admin Server — port ${HTTP_PORT}`);
        console.log(`[ADMIN]    http://localhost:${HTTP_PORT}/api/admin/status`);
        console.log(`[ADMIN]    http://localhost:${HTTP_PORT}/api/admin/scenario`);
        console.log(`[ADMIN]    http://localhost:${HTTP_PORT}/  (Dashboard UI)`);

        // Broadcast status every 10s
        this._broadcastTimer = setInterval(() => {
          this._broadcast('status', this._buildStatus());
        }, 10000);

        resolve();
      });
      this._server.on('error', reject);
    });
  }

  stop() {
    if (this._broadcastTimer) clearInterval(this._broadcastTimer);
    if (this._server) this._server.close();
    console.log('[ADMIN] Stopped');
  }
}

module.exports = AdminServer;
