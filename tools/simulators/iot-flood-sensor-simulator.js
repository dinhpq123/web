'use strict';
/**
 * Hadiwa IOC — IoT Flood Sensor Simulator
 * REST API giả lập 20 cảm biến ngập lụt thời gian thực
 * Port: 7104 (HTTP) — cũng publish qua MQTT topic hadiwa/flood/sensor/+
 *
 * Endpoints:
 *   GET  /health
 *   GET  /api/sensors
 *   GET  /api/sensor/:id
 *   GET  /api/sensor/:id/history
 *   GET  /api/sensors/alerts
 *   GET  /api/summary
 *   POST /api/scenario
 *   GET|PUT /api/mode
 *   GET  /api/devices        CRUD
 *   POST /api/devices
 *   PUT  /api/devices/:id
 *   DELETE /api/devices/:id
 */

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const HTTP_PORT = parseInt(process.env.FLOOD_SENSOR_PORT || '7104');

class IotFloodSensorSimulator {
  constructor(config, scenarioEngine) {
    this.config   = config;
    this.scenario = scenarioEngine;
    this.app      = express();
    this._server  = null;
    this._mode    = 'auto';
    this._state   = {};
    this._history = {};

    const dataPath = path.join(__dirname, '../data/flood-sensors.json');
    const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    this._thresholds = raw._meta?.thresholds || { watch: 0.3, warning: 0.5, danger: 0.8, critical: 1.0 };

    for (const s of raw.sensors) {
      this._state[s.id] = {
        ...s,
        currentLevel_m: s.baseLevel_m * 0.5,
        status:         'normal',
        trend_m_h:      0,
        lastSync:       new Date().toISOString(),
      };
      this._history[s.id] = this._genHistory(s);
    }

    this._setupRoutes();
  }

  _tick() {
    if (this._mode !== 'auto') return;
    const mult  = this._getMultiplier();
    const now   = new Date().toISOString();
    for (const s of Object.values(this._state)) {
      const prev = s.currentLevel_m;
      const noise = (Math.random() - 0.45) * 0.04 * mult;
      s.currentLevel_m = Math.max(0, Math.min(s.maxLevel_m, +(prev + noise).toFixed(3)));
      s.trend_m_h      = +(((s.currentLevel_m - prev) * 360).toFixed(3));  // extrapolated per hr
      s.battery_pct    = Math.max(5, +(s.battery_pct - 0.001).toFixed(1));
      s.lastSync       = now;

      const lvl = s.currentLevel_m;
      if (lvl >= this._thresholds.critical)       s.status = 'critical';
      else if (lvl >= this._thresholds.danger)    s.status = 'danger';
      else if (lvl >= this._thresholds.warning)   s.status = 'warning';
      else if (lvl >= this._thresholds.watch)     s.status = 'watch';
      else                                          s.status = 'normal';

      // Push to history
      if (!this._history[s.id]) this._history[s.id] = [];
      this._history[s.id].push({ time: now, level_m: s.currentLevel_m, status: s.status });
      if (this._history[s.id].length > 288) this._history[s.id].shift();  // 24h @ 5min
    }
  }

  _genHistory(sensor) {
    const now = Date.now();
    return Array.from({ length: 289 }, (_, i) => {
      const t    = new Date(now - (288 - i) * 5 * 60000).toISOString();
      const lvl  = Math.max(0, sensor.baseLevel_m * (0.3 + Math.random() * 0.5));
      return { time: t, level_m: +lvl.toFixed(3), status: lvl >= sensor.threshold_warn ? 'warning' : 'normal' };
    });
  }

  _getMultiplier() {
    const s = this.scenario.getScenario?.() || 'normal';
    const scenarios = { normal: 0.5, rain_watch: 1.0, flood: 2.2, storm: 3.5, typhoon: 5.0, drought: 0.1 };
    return scenarios[s] || 0.5;
  }

  _format(s) {
    return {
      sensor_id:       s.id,
      name:            s.name,
      district:        s.district,
      lat:             s.lat,
      lng:             s.lng,
      type:            s.type,
      currentLevel_m:  s.currentLevel_m,
      baseLevel_m:     s.baseLevel_m,
      maxLevel_m:      s.maxLevel_m,
      threshold_warn:  s.threshold_warn,
      threshold_crit:  s.threshold_crit,
      trend_m_h:       s.trend_m_h,
      battery_pct:     s.battery_pct,
      status:          s.status,
      transmitInterval_s: s.transmitInterval_s,
      lastSync:        s.lastSync,
    };
  }

  // ── CRUD ──────────────────────────────────────────────────────────
  _addSensor(data) {
    const id = data.id || `FS-${String(Object.keys(this._state).length + 1).padStart(3, '0')}`;
    this._state[id] = { ...data, id, currentLevel_m: data.baseLevel_m || 0, status: 'normal', lastSync: new Date().toISOString() };
    this._history[id] = [];
    this._persist();
    return { success: true, id };
  }
  _updateSensor(id, data) {
    if (!this._state[id]) return { success: false, error: 'Not found' };
    Object.assign(this._state[id], data, { id });
    this._persist();
    return { success: true, id };
  }
  _deleteSensor(id) {
    if (!this._state[id]) return { success: false, error: 'Not found' };
    delete this._state[id]; delete this._history[id];
    this._persist();
    return { success: true, id };
  }
  _persist() {
    try {
      const dp = path.join(__dirname, '../data/flood-sensors.json');
      const raw = JSON.parse(fs.readFileSync(dp, 'utf8'));
      raw.sensors = Object.values(this._state);
      fs.writeFileSync(dp, JSON.stringify(raw, null, 2));
    } catch (e) { console.warn('[FLOOD-SIM] Persist:', e.message); }
  }

  _setupRoutes() {
    this.app.use(cors());
    this.app.use(express.json());

    this.app.get('/health', (req, res) => {
      const sensors = Object.values(this._state);
      res.json({ status: 'ok', simulator: 'hadiwa-iot-flood-sensor', sensors: sensors.length,
        alerts: sensors.filter(s => s.status !== 'normal').length, mode: this._mode,
        scenario: this.scenario.getScenario(), uptime_s: Math.round(process.uptime()), time: new Date().toISOString() });
    });

    this.app.get('/api/sensors', (req, res) => {
      res.json({ success: true, mode: this._mode, scenario: this.scenario.getScenario(),
        count: Object.keys(this._state).length, data: Object.values(this._state).map(s => this._format(s)), time: new Date().toISOString() });
    });

    this.app.get('/api/sensor/:id', (req, res) => {
      const s = this._state[req.params.id.toUpperCase()];
      if (!s) return res.status(404).json({ success: false, error: 'Sensor not found' });
      res.json({ success: true, data: this._format(s), time: new Date().toISOString() });
    });

    this.app.get('/api/sensor/:id/history', (req, res) => {
      const id   = req.params.id.toUpperCase();
      if (!this._state[id]) return res.status(404).json({ success: false, error: 'Sensor not found' });
      const points = Math.min(288, parseInt(req.query.points || '288'));
      const data   = (this._history[id] || []).slice(-points);
      res.json({ success: true, sensor_id: id, points: data.length, data });
    });

    this.app.get('/api/sensors/alerts', (req, res) => {
      const alerts = Object.values(this._state)
        .filter(s => s.status !== 'normal')
        .map(s => this._format(s))
        .sort((a, b) => ['critical','danger','warning','watch'].indexOf(a.status) - ['critical','danger','warning','watch'].indexOf(b.status));
      res.json({ success: true, count: alerts.length, data: alerts, time: new Date().toISOString() });
    });

    this.app.get('/api/summary', (req, res) => {
      const sensors = Object.values(this._state);
      const byStatus = { critical: 0, danger: 0, warning: 0, watch: 0, normal: 0 };
      for (const s of sensors) byStatus[s.status] = (byStatus[s.status] || 0) + 1;
      const maxLvl = sensors.reduce((m, s) => s.currentLevel_m > m.currentLevel_m ? s : m, sensors[0]);
      res.json({ success: true, scenario: this.scenario.getScenario(), mode: this._mode,
        total: sensors.length, ...byStatus,
        highest: { sensor_id: maxLvl?.id, level_m: maxLvl?.currentLevel_m, location: maxLvl?.name }, time: new Date().toISOString() });
    });

    this.app.post('/api/scenario', (req, res) => {
      const { scenario } = req.body;
      if (!scenario) return res.status(400).json({ success: false, error: 'scenario required' });
      const result = this.scenario.setScenario(scenario);
      if (!result.success) return res.status(400).json(result);
      res.json(result);
    });

    this.app.get('/api/mode',  (req, res) => res.json({ success: true, mode: this._mode }));
    this.app.put('/api/mode',  (req, res) => {
      const { mode } = req.body;
      if (!['auto', 'manual'].includes(mode)) return res.status(400).json({ success: false, error: 'mode must be auto|manual' });
      this._mode = mode;
      res.json({ success: true, mode });
    });

    // Manual override sensor value
    this.app.put('/api/sensor/:id/value', (req, res) => {
      const id = req.params.id.toUpperCase();
      if (!this._state[id]) return res.status(404).json({ success: false, error: 'Not found' });
      if (req.body.level_m !== undefined) this._state[id].currentLevel_m = parseFloat(req.body.level_m);
      if (req.body.status  !== undefined) this._state[id].status = req.body.status;
      res.json({ success: true, sensor_id: id, data: this._format(this._state[id]) });
    });

    // CRUD
    this.app.get('/api/devices', (req, res) => res.json({ success: true, data: Object.values(this._state).map(s => this._format(s)) }));
    this.app.post('/api/devices', (req, res) => { const r = this._addSensor(req.body); res.status(r.success ? 201 : 400).json(r); });
    this.app.put('/api/devices/:id', (req, res) => res.json(this._updateSensor(req.params.id.toUpperCase(), req.body)));
    this.app.delete('/api/devices/:id', (req, res) => res.json(this._deleteSensor(req.params.id.toUpperCase())));
  }

  start() {
    return new Promise((resolve, reject) => {
      this._server = this.app.listen(HTTP_PORT, '0.0.0.0', () => {
        console.log(`[FLOOD-SENSOR] ✅ IoT Flood Sensor Simulator — port ${HTTP_PORT}`);
        console.log(`[FLOOD-SENSOR]    http://localhost:${HTTP_PORT}/api/sensors`);
        console.log(`[FLOOD-SENSOR]    http://localhost:${HTTP_PORT}/api/sensors/alerts`);
        this._timer = setInterval(() => this._tick(), 5000);
        resolve();
      });
      this._server.on('error', reject);
    });
  }

  stop() {
    if (this._timer) clearInterval(this._timer);
    if (this._server) this._server.close();
  }
}

if (require.main === module) {
  const config      = require('../config/hadiwa-config.json');
  const HydroEngine = require('../engines/hydro-engine');
  const hydro       = new HydroEngine(config);
  const sim         = new IotFloodSensorSimulator(config, hydro);
  sim.start().catch(console.error);
  const interval = parseInt(process.env.SCADA_INTERVAL_MS || '5000');
  setInterval(() => hydro.tick(), interval);
  process.on('SIGINT', () => { sim.stop(); process.exit(0); });
}

module.exports = IotFloodSensorSimulator;
