'use strict';
/**
 * Hadiwa IOC — Pump Station Simulator
 * REST API giả lập 12 trạm bơm tiêu úng TP. Hà Nội
 * Port: 7103
 *
 * Endpoints:
 *   GET  /health
 *   GET  /api/stations
 *   GET  /api/station/:id
 *   GET  /api/station/:id/history
 *   POST /api/station/:id/control    { action, count?, flow_m3s?, operator }
 *   GET  /api/station/:id/log
 *   GET  /api/summary
 *   POST /api/scenario               { scenario }
 *   GET  /api/mode                   → { mode: 'auto'|'manual' }
 *   PUT  /api/mode                   { mode }
 *   GET  /api/devices                → CRUD listing
 *   POST /api/devices                → Add device
 *   PUT  /api/devices/:id            → Update device
 *   DELETE /api/devices/:id          → Remove device
 */

require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const HTTP_PORT = parseInt(process.env.PUMP_SIM_PORT || '7103');

class PumpStationSimulator {
  constructor(config, pumpEngine, scenarioEngine) {
    this.config    = config;
    this.pump      = pumpEngine;
    this.scenario  = scenarioEngine;
    this.app       = express();
    this._server   = null;
    this._history  = {};   // { id: [{time, flow, headWater, status}] }
    this._setupRoutes();
  }

  _setupRoutes() {
    this.app.use(cors());
    this.app.use(express.json());

    // ── Health ──────────────────────────────────────────────────────
    this.app.get('/health', (req, res) => {
      const state    = this.pump.getState();
      const stations = Object.values(state);
      res.json({
        status:    'ok',
        simulator: 'hadiwa-pump-station',
        version:   '2.0.0',
        scenario:  this.scenario.getScenario(),
        mode:      this.pump.getMode(),
        stations:  stations.length,
        running:   stations.filter(s => s.status === 'running').length,
        offline:   stations.filter(s => s.status === 'offline').length,
        uptime_s:  Math.round(process.uptime()),
        time:      new Date().toISOString(),
      });
    });

    // ── All stations ────────────────────────────────────────────────
    this.app.get('/api/stations', (req, res) => {
      res.json({
        success:  true,
        scenario: this.scenario.getScenario(),
        mode:     this.pump.getMode(),
        count:    this.pump.formatAll().length,
        data:     this.pump.formatAll(),
        time:     new Date().toISOString(),
      });
    });

    // ── Single station ──────────────────────────────────────────────
    this.app.get('/api/station/:id', (req, res) => {
      const s = this.pump.getState()[req.params.id.toUpperCase()];
      if (!s) return res.status(404).json({ success: false, error: 'Station not found' });
      res.json({ success: true, data: this.pump.formatAll().find(x => x.station_id === req.params.id.toUpperCase()), time: new Date().toISOString() });
    });

    // ── History ─────────────────────────────────────────────────────
    this.app.get('/api/station/:id/history', (req, res) => {
      const id = req.params.id.toUpperCase();
      const s  = this.pump.getState()[id];
      if (!s) return res.status(404).json({ success: false, error: 'Station not found' });
      const hours  = Math.min(72, parseInt(req.query.hours || '24'));
      const pts    = (this._history[id] || []).slice(-hours);
      res.json({ success: true, station_id: id, points: pts.length, data: pts });
    });

    // ── Control ─────────────────────────────────────────────────────
    this.app.post('/api/station/:id/control', (req, res) => {
      const id   = req.params.id.toUpperCase();
      const body = req.body || {};
      const result = this.pump.controlStation(id, body.action, {
        count:     body.count,
        flow_m3s:  body.flow_m3s,
        operator:  body.operator || req.headers['x-operator'] || 'API',
      });
      if (!result.success) return res.status(400).json(result);
      console.log(`[PUMP-SIM] 🔧 ${id} — ${body.action} by ${body.operator || 'API'}`);
      res.json(result);
    });

    // ── Operation log ────────────────────────────────────────────────
    this.app.get('/api/station/:id/log', (req, res) => {
      const id  = req.params.id.toUpperCase();
      const log = this.pump.getCommandLog(id, 50);
      res.json({ success: true, station_id: id, count: log.length, data: log });
    });

    // ── Summary ─────────────────────────────────────────────────────
    this.app.get('/api/summary', (req, res) => {
      const stations = this.pump.formatAll();
      const totalFlow    = stations.reduce((s, x) => s + (x.currentFlow_m3s || 0), 0);
      const totalPower   = stations.reduce((s, x) => s + (x.powerConsumption_kW || 0), 0);
      const offlineCount = stations.filter(s => s.status === 'offline').length;
      const critCount    = stations.filter(s => s.status === 'critical').length;
      res.json({
        success: true,
        scenario: this.scenario.getScenario(),
        total_stations:      stations.length,
        total_flow_m3s:      +totalFlow.toFixed(1),
        total_power_kW:      +totalPower.toFixed(0),
        stations_offline:    offlineCount,
        stations_critical:   critCount,
        time: new Date().toISOString(),
      });
    });

    // ── Scenario ─────────────────────────────────────────────────────
    this.app.post('/api/scenario', (req, res) => {
      const { scenario } = req.body;
      if (!scenario) return res.status(400).json({ success: false, error: 'scenario required' });
      const result = this.scenario.setScenario(scenario);
      if (!result.success) return res.status(400).json(result);
      console.log(`[PUMP-SIM] 📋 Kịch bản → ${scenario}`);
      res.json(result);
    });

    // ── Mode toggle ──────────────────────────────────────────────────
    this.app.get('/api/mode', (req, res) => {
      res.json({ success: true, mode: this.pump.getMode() });
    });
    this.app.put('/api/mode', (req, res) => {
      const { mode } = req.body;
      if (!['auto', 'manual'].includes(mode)) return res.status(400).json({ success: false, error: 'mode must be auto|manual' });
      res.json(this.pump.setMode(mode));
    });

    // ── CRUD: Devices ────────────────────────────────────────────────
    this.app.get('/api/devices', (req, res) => {
      res.json({ success: true, data: this.pump.formatAll() });
    });
    this.app.post('/api/devices', (req, res) => {
      const result = this.pump.addStation(req.body);
      res.status(result.success ? 201 : 400).json(result);
    });
    this.app.put('/api/devices/:id', (req, res) => {
      res.json(this.pump.updateStation(req.params.id.toUpperCase(), req.body));
    });
    this.app.delete('/api/devices/:id', (req, res) => {
      res.json(this.pump.deleteStation(req.params.id.toUpperCase()));
    });
  }

  // ── History recording ─────────────────────────────────────────────
  _recordHistory() {
    for (const s of Object.values(this.pump.getState())) {
      if (!this._history[s.id]) this._history[s.id] = [];
      this._history[s.id].push({
        time:          new Date().toISOString(),
        currentFlow_m3s: s.currentFlow_m3s,
        headWater_m:    s.headWater_m,
        pumps_active:   s.pumps_active,
        status:         s.status,
      });
      if (this._history[s.id].length > 300) this._history[s.id].shift();
    }
  }

  start() {
    return new Promise((resolve, reject) => {
      this._server = this.app.listen(HTTP_PORT, '0.0.0.0', () => {
        console.log(`[PUMP-SIM] ✅ Pump Station Simulator — port ${HTTP_PORT}`);
        console.log(`[PUMP-SIM]    http://localhost:${HTTP_PORT}/api/stations`);
        console.log(`[PUMP-SIM]    http://localhost:${HTTP_PORT}/api/summary`);
        this._histTimer = setInterval(() => this._recordHistory(), 60000);
        resolve();
      });
      this._server.on('error', reject);
    });
  }

  stop() {
    if (this._histTimer) clearInterval(this._histTimer);
    if (this._server) this._server.close();
  }
}

// ── Standalone run ─────────────────────────────────────────────────────────
if (require.main === module) {
  const config        = require('../config/hadiwa-config.json');
  const HydroEngine   = require('../engines/hydro-engine');
  const PumpEngine    = require('../engines/pump-engine');
  const hydro         = new HydroEngine(config);
  const pump          = new PumpEngine(config, hydro);
  const sim           = new PumpStationSimulator(config, pump, hydro);

  sim.start().catch(console.error);

  const interval = parseInt(process.env.SCADA_INTERVAL_MS || '5000');
  setInterval(() => { hydro.tick(); pump.tick(); }, interval);
  process.on('SIGINT', () => { sim.stop(); process.exit(0); });
}

module.exports = PumpStationSimulator;
