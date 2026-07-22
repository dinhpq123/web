/**
 * Hadiwa IOC — Reservoir Gate SCADA Simulator
 * REST API giả lập điều khiển cổng xả 6 hồ chứa HO01-HO06
 * (Clone Quawaco http-simulator với domain hồ chứa thủy lợi)
 *
 * Port: 7101 (Quawaco dùng 7000)
 *
 * Endpoints:
 *   GET  /health                            → Health check
 *   GET  /api/reservoirs                    → Danh sách 6 hồ chứa
 *   GET  /api/reservoir/:id                 → Chi tiết hồ chứa
 *   POST /api/reservoir/:id/gate            → Điều khiển cổng van
 *   GET  /api/reservoir/:id/events          → Nhật ký điều tiết
 *   GET  /api/reservoir/:id/history         → Lịch sử mực hồ 24h
 *   POST /api/scenario                      → Kích hoạt kịch bản lũ
 *   GET  /api/summary                       → Tổng quan tất cả hồ
 */
'use strict';

require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const HTTP_PORT = parseInt(process.env.RESERVOIR_SCADA_PORT || '7101');

class HadiwaReservoirSCADA {
  constructor(config, hydroEngine, reservoirEngine) {
    this.config    = config;
    this.hydro     = hydroEngine;
    this.reservoir = reservoirEngine;
    this.app       = express();
    this._server   = null;
    this._setupRoutes();
  }

  _statusColor(r) {
    if (r.status === 'critical')  return 'critical';
    if (r.status === 'danger')    return 'danger';
    if (r.status === 'warning')   return 'warning';
    if (r.status === 'releasing') return 'releasing';
    return 'ok';
  }

  _formatReservoir(r) {
    return {
      reservoir_id:    r.id,
      name:            r.name,
      district:        r.district,
      lat:             r.lat,
      lng:             r.lng,
      capacity_m3:     r.capacity * 1e6,
      capacity_million_m3: r.capacity,
      designLevel_m:   r.designLevel,
      deadLevel_m:     r.deadLevel,
      currentLevel_m:  r.currentLevel,
      capacityPct:     r.capacityPct,
      warnL1_m:        r.warnL1,
      warnL2_m:        r.warnL2,
      warnL3_m:        r.warnL3,
      gates:           r.gates,
      gatesOpen:       r.gatesOpen,
      gateFlow_m3s:    r.gateFlow,
      maxGateFlow_m3s: r.maxGateFlow,
      inflowQ_m3s:     r.inflowQ,
      outflowQ_m3s:    r.outflowQ,
      status:          this._statusColor(r),
      lastUpdated:     r.lastUpdated,
    };
  }

  _setupRoutes() {
    this.app.use(cors());
    this.app.use(express.json());

    // ── Health ──────────────────────────────────────────────────────────
    this.app.get('/health', (req, res) => {
      const state = this.reservoir.getState();
      const releasing = Object.values(state).filter(r => r.gatesOpen > 0).length;
      res.json({
        status:    'ok',
        simulator: 'hadiwa-reservoir-scada',
        reservoirs: Object.keys(state).length,
        releasing,
        scenario:  this.hydro.getScenario(),
        uptime_s:  Math.round(process.uptime()),
        time:      new Date().toISOString(),
      });
    });

    // ── Tất cả hồ chứa ──────────────────────────────────────────────────
    this.app.get('/api/reservoirs', (req, res) => {
      const state = this.reservoir.getState();
      res.json({
        success:  true,
        count:    Object.keys(state).length,
        scenario: this.hydro.getScenario(),
        data:     Object.values(state).map(r => this._formatReservoir(r)),
        time:     new Date().toISOString(),
      });
    });

    // ── Chi tiết hồ chứa ────────────────────────────────────────────────
    this.app.get('/api/reservoir/:id', (req, res) => {
      const r = this.reservoir.getState()[req.params.id.toUpperCase()];
      if (!r) return res.status(404).json({ success: false, error: 'Reservoir not found' });
      res.json({ success: true, data: this._formatReservoir(r), time: new Date().toISOString() });
    });

    // ── Điều khiển cổng van ──────────────────────────────────────────────
    // POST /api/reservoir/:id/gate
    // Body: { action: 'open' | 'close' | 'open_all' | 'close_all', gateCount?: number, operator?: string }
    this.app.post('/api/reservoir/:id/gate', (req, res) => {
      const { action, gateCount, operator } = req.body;
      if (!action) return res.status(400).json({ success: false, error: 'action required' });

      const result = this.reservoir.controlGate(
        req.params.id.toUpperCase(),
        action,
        { gateCount: gateCount || 1, operator: operator || req.headers['x-operator'] || 'API' }
      );
      if (!result.success) return res.status(400).json(result);

      const r = this.reservoir.getState()[req.params.id.toUpperCase()];
      console.log(`[RSV-SCADA] 🚪 ${result.reservoir_id} — ${action} | gatesOpen: ${r.gatesOpen}/${r.gates} | flow: ${r.gateFlow.toFixed(0)} m³/s`);
      res.json({ ...result, reservoir: this._formatReservoir(r) });
    });

    // ── Nhật ký điều tiết ────────────────────────────────────────────────
    this.app.get('/api/reservoir/:id/events', (req, res) => {
      const r = this.reservoir.getState()[req.params.id.toUpperCase()];
      if (!r) return res.status(404).json({ success: false, error: 'Reservoir not found' });
      const log = this.reservoir.getCommandLog(req.params.id.toUpperCase(), 50);
      res.json({ success: true, reservoir_id: req.params.id.toUpperCase(), count: log.length, data: log });
    });

    // ── Lịch sử mực hồ 24h ──────────────────────────────────────────────
    this.app.get('/api/reservoir/:id/history', (req, res) => {
      const r = this.reservoir.getState()[req.params.id.toUpperCase()];
      if (!r) return res.status(404).json({ success: false, error: 'Reservoir not found' });
      const now  = Date.now();
      const base = r.currentLevel;
      const history = Array.from({ length: 25 }, (_, i) => {
        const hrsAgo = 24 - i;
        const t      = new Date(now - hrsAgo * 3600 * 1000).toISOString();
        const drift  = (i / 24) * (r.currentLevel - base * 0.96);
        const noise  = (Math.random() - 0.5) * 0.08;
        return {
          time:         t,
          currentLevel: Math.max(r.deadLevel, +(base * 0.96 + drift + noise).toFixed(2)),
          gateFlow:     r.gateFlow > 0 ? +(r.gateFlow * (0.7 + Math.random() * 0.6)).toFixed(0) : 0,
        };
      });
      res.json({ success: true, reservoir_id: req.params.id.toUpperCase(), points: history.length, data: history });
    });

    // ── Kịch bản ────────────────────────────────────────────────────────
    this.app.post('/api/scenario', (req, res) => {
      const { scenario } = req.body;
      if (!scenario) return res.status(400).json({ success: false, error: 'scenario required' });
      const result = this.hydro.setScenario(scenario);
      if (!result.success) return res.status(400).json(result);

      // Kịch bản lũ → tự động mở van xả
      if (scenario === 'flood' || scenario === 'emergency') {
        for (const id of Object.keys(this.reservoir.getState())) {
          this.reservoir.controlGate(id, 'open', { gateCount: 2, operator: 'SCENARIO_AUTO' });
        }
        console.log(`[RSV-SCADA] ⚠️  Kịch bản ${scenario} — Tự động mở van xả lũ`);
      } else if (scenario === 'normal' || scenario === 'drought') {
        for (const id of Object.keys(this.reservoir.getState())) {
          this.reservoir.controlGate(id, 'close_all', { operator: 'SCENARIO_AUTO' });
        }
      }

      res.json(result);
    });

    // ── Tổng quan ────────────────────────────────────────────────────────
    this.app.get('/api/summary', (req, res) => {
      const state      = this.reservoir.getState();
      const reservoirs = Object.values(state);
      const releasing  = reservoirs.filter(r => r.gatesOpen > 0);
      const totalFlow  = releasing.reduce((s, r) => s + r.gateFlow, 0);
      const criticals  = reservoirs.filter(r => r.status === 'critical' || r.status === 'danger');
      res.json({
        success:          true,
        scenario:         this.hydro.getScenario(),
        total_reservoirs: reservoirs.length,
        releasing:        releasing.length,
        critical_danger:  criticals.length,
        total_gate_flow_m3s: +totalFlow.toFixed(1),
        time:             new Date().toISOString(),
      });
    });
  }

  start() {
    return new Promise((resolve, reject) => {
      this._server = this.app.listen(HTTP_PORT, '0.0.0.0', () => {
        console.log(`[RSV-SCADA] ✅ Reservoir SCADA Simulator — port ${HTTP_PORT}`);
        console.log(`[RSV-SCADA]    http://localhost:${HTTP_PORT}/api/reservoirs`);
        resolve();
      });
      this._server.on('error', reject);
    });
  }

  stop() {
    if (this._server) this._server.close();
  }
}

// ── Standalone run ────────────────────────────────────────────────────────────
if (require.main === module) {
  const config           = require('../config/hadiwa-config.json');
  const HydroEngine      = require('../engines/hydro-engine');
  const ReservoirEngine  = require('../engines/reservoir-engine');
  const hydro            = new HydroEngine(config);
  const reservoir        = new ReservoirEngine(config);
  const sim              = new HadiwaReservoirSCADA(config, hydro, reservoir);

  sim.start().catch(console.error);

  const interval = parseInt(process.env.SCADA_INTERVAL_MS || '5000');
  setInterval(() => { hydro.tick(); reservoir.tick(hydro.getState()); }, interval);
  process.on('SIGINT', () => { sim.stop(); process.exit(0); });
}

module.exports = HadiwaReservoirSCADA;
