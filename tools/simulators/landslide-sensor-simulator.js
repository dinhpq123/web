'use strict';
/**
 * Hadiwa IOC — Landslide Sensor Simulator (SIM-5)
 * REST API giả lập 10 cảm biến tilt/displacement tại điểm sạt lở
 * Port: 7107
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
 *   PUT  /api/sensor/:id/value     → Manual override
 *   CRUD /api/devices
 */

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const HTTP_PORT = parseInt(process.env.LANDSLIDE_SIM_PORT || '7107');

class LandslideSensorSimulator {
  constructor(config, scenarioEngine) {
    this.config   = config;
    this.scenario = scenarioEngine;
    this.app      = express();
    this._server  = null;
    this._mode    = 'auto';
    this._state   = {};
    this._history = {};

    const dataPath = path.join(__dirname, '../data/landslide-sensors.json');
    const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    this._thresholds = raw._meta?.thresholds_mm || { watch: 5, warning: 15, critical: 30 };

    for (const s of raw.sensors) {
      this._state[s.id] = { ...s, lastSync: new Date().toISOString() };
      this._history[s.id] = this._genHistory(s);
    }

    this._setupRoutes();
  }

  _tick() {
    if (this._mode !== 'auto') return;
    const sc   = this.scenario.getScenario?.() || 'normal';
    const mult = { normal: 0.5, rain_watch: 1.0, flood: 2.0, storm: 3.0, typhoon: 4.5, drought: 0.2 }[sc] || 0.5;
    const now  = new Date().toISOString();

    for (const s of Object.values(this._state)) {
      // Displacement creep
      const delta = Math.random() * 0.05 * mult;
      s.displacement_mm = +(s.displacement_mm + delta).toFixed(2);

      // Soil moisture reacts to rainfall
      const moistDelta = (Math.random() - 0.4) * 1.5 * mult;
      s.soilMoisture_pct = Math.max(10, Math.min(100, Math.round(s.soilMoisture_pct + moistDelta)));

      // Groundwater
      const gwDelta = -(Math.random() * 0.02 * mult);
      s.groundwater_m = Math.max(0.1, +(s.groundwater_m + gwDelta).toFixed(2));

      // Tilt angle
      s.tiltAngle_deg = +(s.displacement_mm * 0.06).toFixed(3);

      // Status
      const d = s.displacement_mm;
      if (d >= this._thresholds.critical)       s.status = 'critical';
      else if (d >= this._thresholds.warning)   s.status = 'warning';
      else if (d >= this._thresholds.watch)     s.status = 'watch';
      else                                        s.status = 'stable';

      s.lastSync = now;

      // Push history
      this._history[s.id].push({ time: now, displacement_mm: s.displacement_mm, soilMoisture_pct: s.soilMoisture_pct, status: s.status });
      if (this._history[s.id].length > 288) this._history[s.id].shift();
    }
  }

  _genHistory(sensor) {
    const now  = Date.now();
    const base = sensor.baseDisplacement_mm || sensor.displacement_mm || 1;
    return Array.from({ length: 289 }, (_, i) => {
      const t  = new Date(now - (288 - i) * 5 * 60000).toISOString();
      const d  = Math.max(0, +(base * (0.8 + Math.random() * 0.4)).toFixed(2));
      const th = (sensor._meta?.thresholds_mm || { watch: 5, warning: 15 });
      return { time: t, displacement_mm: d, soilMoisture_pct: Math.round(50 + Math.random() * 30), status: d >= 15 ? 'warning' : d >= 5 ? 'watch' : 'stable' };
    });
  }

  _format(s) {
    return {
      sensor_id:         s.id,
      name:              s.name,
      linkedZone:        s.linkedZone,
      lat:               s.lat,
      lng:               s.lng,
      type:              s.type,
      displacement_mm:   s.displacement_mm,
      baseDisplacement_mm: s.baseDisplacement_mm,
      tiltAngle_deg:     s.tiltAngle_deg,
      soilMoisture_pct:  s.soilMoisture_pct,
      groundwater_m:     s.groundwater_m,
      status:            s.status,
      battery_pct:       s.battery_pct,
      installed:         s.installed,
      lastSync:          s.lastSync,
    };
  }

  _persist() {
    try {
      const dp  = path.join(__dirname, '../data/landslide-sensors.json');
      const raw = JSON.parse(fs.readFileSync(dp, 'utf8'));
      raw.sensors = Object.values(this._state);
      fs.writeFileSync(dp, JSON.stringify(raw, null, 2));
    } catch (e) { console.warn('[LANDSLIDE-SIM] Persist:', e.message); }
  }

  _setupRoutes() {
    this.app.use(cors());
    this.app.use(express.json());

    this.app.get('/health', (req, res) => {
      const sensors = Object.values(this._state);
      res.json({ status: 'ok', simulator: 'hadiwa-landslide-sensor', version: '2.0.0',
        sensors: sensors.length, alerts: sensors.filter(s => s.status !== 'stable').length,
        mode: this._mode, scenario: this.scenario.getScenario(), uptime_s: Math.round(process.uptime()), time: new Date().toISOString() });
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
      const id = req.params.id.toUpperCase();
      if (!this._state[id]) return res.status(404).json({ success: false, error: 'Not found' });
      const pts = Math.min(288, parseInt(req.query.points || '144'));
      res.json({ success: true, sensor_id: id, points: pts, data: (this._history[id] || []).slice(-pts) });
    });

    this.app.get('/api/sensors/alerts', (req, res) => {
      const alerts = Object.values(this._state)
        .filter(s => s.status !== 'stable').map(s => this._format(s))
        .sort((a, b) => b.displacement_mm - a.displacement_mm);
      res.json({ success: true, count: alerts.length, data: alerts, time: new Date().toISOString() });
    });

    this.app.get('/api/summary', (req, res) => {
      const sensors = Object.values(this._state);
      const byStatus = { critical: 0, warning: 0, watch: 0, stable: 0 };
      for (const s of sensors) byStatus[s.status] = (byStatus[s.status] || 0) + 1;
      const maxD = sensors.reduce((m, s) => s.displacement_mm > m.displacement_mm ? s : m, sensors[0]);
      res.json({ success: true, scenario: this.scenario.getScenario(), mode: this._mode,
        total: sensors.length, ...byStatus,
        max_displacement: { sensor_id: maxD?.id, mm: maxD?.displacement_mm, location: maxD?.name }, time: new Date().toISOString() });
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
      if (!['auto','manual'].includes(mode)) return res.status(400).json({ success: false, error: 'mode must be auto|manual' });
      this._mode = mode; res.json({ success: true, mode });
    });

    this.app.put('/api/sensor/:id/value', (req, res) => {
      const id = req.params.id.toUpperCase();
      if (!this._state[id]) return res.status(404).json({ success: false, error: 'Not found' });
      if (req.body.displacement_mm !== undefined) this._state[id].displacement_mm = parseFloat(req.body.displacement_mm);
      if (req.body.status !== undefined) this._state[id].status = req.body.status;
      res.json({ success: true, sensor_id: id, data: this._format(this._state[id]) });
    });

    // CRUD
    this.app.get('/api/devices',        (req, res) => res.json({ success: true, data: Object.values(this._state).map(s => this._format(s)) }));
    this.app.post('/api/devices',       (req, res) => {
      const id = req.body.id || `LS-S${String(Object.keys(this._state).length + 1).padStart(2, '0')}`;
      this._state[id] = { ...req.body, id, lastSync: new Date().toISOString() };
      this._history[id] = [];
      this._persist();
      res.status(201).json({ success: true, id });
    });
    this.app.put('/api/devices/:id',    (req, res) => {
      const id = req.params.id.toUpperCase();
      if (!this._state[id]) return res.status(404).json({ success: false, error: 'Not found' });
      Object.assign(this._state[id], req.body, { id });
      this._persist();
      res.json({ success: true, id });
    });
    this.app.delete('/api/devices/:id', (req, res) => {
      const id = req.params.id.toUpperCase();
      if (!this._state[id]) return res.status(404).json({ success: false, error: 'Not found' });
      delete this._state[id]; delete this._history[id];
      this._persist();
      res.json({ success: true, id });
    });
  }

  start() {
    return new Promise((resolve, reject) => {
      this._server = this.app.listen(HTTP_PORT, '0.0.0.0', () => {
        console.log(`[LANDSLIDE-SIM] ✅ Landslide Sensor Simulator — port ${HTTP_PORT}`);
        console.log(`[LANDSLIDE-SIM]    http://localhost:${HTTP_PORT}/api/sensors`);
        console.log(`[LANDSLIDE-SIM]    http://localhost:${HTTP_PORT}/api/sensors/alerts`);
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
  const sim         = new LandslideSensorSimulator(config, hydro);
  sim.start().catch(console.error);
  const interval = parseInt(process.env.SCADA_INTERVAL_MS || '5000');
  setInterval(() => hydro.tick(), interval);
  process.on('SIGINT', () => { sim.stop(); process.exit(0); });
}

module.exports = LandslideSensorSimulator;
