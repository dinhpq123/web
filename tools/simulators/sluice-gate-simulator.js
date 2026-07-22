'use strict';
/**
 * Hadiwa IOC — Sluice Gate Simulator (SIM-3)
 * REST API giả lập điều khiển 18 cống điều tiết
 * Port: 7105
 *
 * Endpoints:
 *   GET  /health
 *   GET  /api/sluices
 *   GET  /api/sluice/:id
 *   POST /api/sluice/:id/control    { action, pct?, openPct?, operator }
 *   GET  /api/sluice/:id/log
 *   GET  /api/summary
 *   POST /api/scenario
 *   GET|PUT /api/mode
 *   CRUD /api/devices
 */

require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const HTTP_PORT = parseInt(process.env.SLUICE_SIM_PORT || '7105');

class SluiceGateSimulator {
  constructor(config, sluiceEngine, scenarioEngine) {
    this.config   = config;
    this.sluice   = sluiceEngine;
    this.scenario = scenarioEngine;
    this.app      = express();
    this._server  = null;
    this._setupRoutes();
  }

  _setupRoutes() {
    this.app.use(cors());
    this.app.use(express.json());

    this.app.get('/health', (req, res) => {
      const sluices = this.sluice.formatAll();
      const open = sluices.filter(s => s.status === 'open').length;
      const totalFlow = sluices.reduce((t, s) => t + (s.currentFlow_m3s || 0), 0);
      res.json({ status: 'ok', simulator: 'hadiwa-sluice-gate', version: '2.0.0',
        sluices: sluices.length, open, totalFlow_m3s: +totalFlow.toFixed(1),
        mode: this.sluice.getMode(), scenario: this.scenario.getScenario(),
        uptime_s: Math.round(process.uptime()), time: new Date().toISOString() });
    });

    this.app.get('/api/sluices', (req, res) => {
      res.json({ success: true, scenario: this.scenario.getScenario(), mode: this.sluice.getMode(),
        count: this.sluice.formatAll().length, data: this.sluice.formatAll(), time: new Date().toISOString() });
    });

    this.app.get('/api/sluice/:id', (req, res) => {
      const g = this.sluice.getState()[req.params.id.toUpperCase()];
      if (!g) return res.status(404).json({ success: false, error: 'Sluice gate not found' });
      res.json({ success: true, data: this.sluice.formatAll().find(x => x.sluice_id === req.params.id.toUpperCase()), time: new Date().toISOString() });
    });

    this.app.post('/api/sluice/:id/control', (req, res) => {
      const id  = req.params.id.toUpperCase();
      const b   = req.body || {};
      const result = this.sluice.controlGate(id, b.action, { pct: b.pct, openPct: b.openPct, operator: b.operator || req.headers['x-operator'] || 'API' });
      if (!result.success) return res.status(400).json(result);
      console.log(`[SLUICE-SIM] 🚪 ${id} — ${b.action} | pct: ${result.openPct}%`);
      res.json(result);
    });

    this.app.get('/api/sluice/:id/log', (req, res) => {
      const id = req.params.id.toUpperCase();
      res.json({ success: true, sluice_id: id, data: this.sluice.getCommandLog(id, 50) });
    });

    this.app.get('/api/summary', (req, res) => {
      const sluices   = this.sluice.formatAll();
      const totalFlow = sluices.reduce((t, s) => t + (s.currentFlow_m3s || 0), 0);
      const open      = sluices.filter(s => s.status === 'open').length;
      const fullyOpen = sluices.filter(s => s.openPct >= 100).length;
      res.json({ success: true, scenario: this.scenario.getScenario(), total: sluices.length,
        open, closed: sluices.length - open, fully_open: fullyOpen,
        total_flow_m3s: +totalFlow.toFixed(1), time: new Date().toISOString() });
    });

    this.app.post('/api/scenario', (req, res) => {
      const { scenario } = req.body;
      if (!scenario) return res.status(400).json({ success: false, error: 'scenario required' });
      const result = this.scenario.setScenario(scenario);
      // Flood auto: open major gates
      if (scenario === 'flood' || scenario === 'storm' || scenario === 'typhoon') {
        for (const id of Object.keys(this.sluice.getState())) {
          this.sluice.controlGate(id, 'set_pct', { openPct: scenario === 'typhoon' ? 100 : 70, operator: 'SCENARIO_AUTO' });
        }
      } else if (scenario === 'normal' || scenario === 'drought') {
        for (const id of Object.keys(this.sluice.getState())) {
          this.sluice.controlGate(id, 'release', { operator: 'SCENARIO_AUTO' });
        }
      }
      res.json(result);
    });

    this.app.get('/api/mode',  (req, res) => res.json({ success: true, mode: this.sluice.getMode() }));
    this.app.put('/api/mode',  (req, res) => {
      const { mode } = req.body;
      if (!['auto','manual'].includes(mode)) return res.status(400).json({ success: false, error: 'mode must be auto|manual' });
      res.json(this.sluice.setMode(mode));
    });

    // CRUD
    this.app.get('/api/devices',     (req, res) => res.json({ success: true, data: this.sluice.formatAll() }));
    this.app.post('/api/devices',    (req, res) => { const r = this.sluice.addGate(req.body); res.status(r.success ? 201 : 400).json(r); });
    this.app.put('/api/devices/:id', (req, res) => res.json(this.sluice.updateGate(req.params.id.toUpperCase(), req.body)));
    this.app.delete('/api/devices/:id', (req, res) => res.json(this.sluice.deleteGate(req.params.id.toUpperCase())));
  }

  start() {
    return new Promise((resolve, reject) => {
      this._server = this.app.listen(HTTP_PORT, '0.0.0.0', () => {
        console.log(`[SLUICE-SIM] ✅ Sluice Gate Simulator — port ${HTTP_PORT}`);
        console.log(`[SLUICE-SIM]    http://localhost:${HTTP_PORT}/api/sluices`);
        resolve();
      });
      this._server.on('error', reject);
    });
  }

  stop() { if (this._server) this._server.close(); }
}

if (require.main === module) {
  const config        = require('../config/hadiwa-config.json');
  const HydroEngine   = require('../engines/hydro-engine');
  const SluiceEngine  = require('../engines/sluice-engine');
  const hydro         = new HydroEngine(config);
  const sluice        = new SluiceEngine(config, hydro);
  const sim           = new SluiceGateSimulator(config, sluice, hydro);
  sim.start().catch(console.error);
  const interval = parseInt(process.env.SCADA_INTERVAL_MS || '5000');
  setInterval(() => { hydro.tick(); sluice.tick(); }, interval);
  process.on('SIGINT', () => { sim.stop(); process.exit(0); });
}

module.exports = SluiceGateSimulator;
