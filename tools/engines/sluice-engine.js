'use strict';
/**
 * Hadiwa IOC — Sluice Gate Engine
 * Mô phỏng 18 cống điều tiết: vị trí van, lưu lượng, mực nước thượng/hạ lưu
 * Hỗ trợ: Auto tick / Manual control / CRUD / Scenario multipliers
 */

const fs   = require('fs');
const path = require('path');

class SluiceEngine {
  constructor(config, scenarioEngine) {
    this._scenario  = scenarioEngine;
    this._mode      = 'auto';
    this._state     = {};
    this._cmdLog    = {};
    this._overrides = {};

    const dataPath = path.join(__dirname, '../data/sluice-gates.json');
    const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    for (const g of raw.sluices) {
      this._state[g.id] = {
        ...g,
        openPct:           g.openPct ?? 0,
        currentFlow_m3s:   g.currentFlow_m3s ?? 0,
        upstreamLevel_m:   g.upstreamLevel_m ?? 3.0,
        downstreamLevel_m: g.downstreamLevel_m ?? 1.0,
        lastUpdated:       new Date().toISOString(),
      };
      this._cmdLog[g.id] = [];
    }
  }

  // ── Auto tick ────────────────────────────────────────────────────
  tick() {
    if (this._mode !== 'auto') return;
    const mult = this._getMultiplier();
    for (const g of Object.values(this._state)) {
      if (this._overrides[g.id]?.locked) continue;

      // Upstream level reacts to scenario
      const wlNoise = (Math.random() - 0.5) * 0.08;
      g.upstreamLevel_m   = Math.max(0.1, +(g.upstreamLevel_m + wlNoise * mult).toFixed(2));
      g.downstreamLevel_m = Math.max(0.0, +(g.upstreamLevel_m * (0.25 + Math.random() * 0.15)).toFixed(2));

      // Auto-adjust open % in flood scenario
      if (this._mode === 'auto') {
        const target = Math.min(100, g.openPct + (mult > 1.3 ? 5 : mult < 0.5 ? -3 : 0) + (Math.random() - 0.5) * 2);
        g.openPct = Math.max(0, Math.min(100, Math.round(target)));
      }

      // Calculate flow: Q = Cd * A * sqrt(2g * dH)
      const dH = Math.max(0, g.upstreamLevel_m - g.downstreamLevel_m);
      const Cd = 0.65;
      const area = (g.openPct / 100) * g.gates_total * 3.0; // ~3m² per gate fully open
      const Q = Cd * area * Math.sqrt(2 * 9.81 * dH);
      g.currentFlow_m3s = Math.min(g.maxFlow_m3s, +Q.toFixed(1));
      g.gates_open = Math.round(g.gates_total * (g.openPct / 100));

      g.status = g.openPct > 0 ? 'open' : 'closed';
      g.lastUpdated = new Date().toISOString();
    }
  }

  // ── Manual control ───────────────────────────────────────────────
  controlGate(id, action, params = {}) {
    const g = this._state[id];
    if (!g) return { success: false, error: 'Sluice gate not found' };
    if (!this._overrides[id]) this._overrides[id] = {};

    switch (action) {
      case 'open':
        g.openPct = Math.min(100, g.openPct + (params.pct || 25));
        break;
      case 'close':
        g.openPct = Math.max(0, g.openPct - (params.pct || 25));
        break;
      case 'set_pct':
        g.openPct = Math.max(0, Math.min(100, params.openPct ?? g.openPct));
        this._overrides[id].locked = true;
        break;
      case 'open_full':
        g.openPct = 100;
        this._overrides[id].locked = true;
        break;
      case 'close_full':
        g.openPct = 0;
        this._overrides[id].locked = true;
        break;
      case 'release':
        delete this._overrides[id];
        break;
      default:
        return { success: false, error: `Unknown action: ${action}` };
    }

    g.gates_open = Math.round(g.gates_total * (g.openPct / 100));
    g.status     = g.openPct > 0 ? 'open' : 'closed';
    g.lastUpdated = new Date().toISOString();
    this._log(id, `${action} → ${g.openPct}%`, params.operator || 'API');
    return { success: true, sluice_id: id, action, openPct: g.openPct, state: this._format(g) };
  }

  // ── CRUD ──────────────────────────────────────────────────────────
  addGate(data)      {
    const id = data.id || `CG-${String(Object.keys(this._state).length + 1).padStart(2, '0')}`;
    this._state[id]  = { ...data, id, lastUpdated: new Date().toISOString() };
    this._cmdLog[id] = [];
    this._persist();
    return { success: true, id };
  }
  updateGate(id, data) {
    if (!this._state[id]) return { success: false, error: 'Not found' };
    Object.assign(this._state[id], data, { id });
    this._persist();
    return { success: true, id };
  }
  deleteGate(id) {
    if (!this._state[id]) return { success: false, error: 'Not found' };
    delete this._state[id];
    delete this._cmdLog[id];
    this._persist();
    return { success: true, id };
  }

  // ── Getters ──────────────────────────────────────────────────────
  getState()   { return this._state; }
  getMode()    { return this._mode; }
  setMode(m)   { this._mode = m; return { success: true, mode: m }; }

  getCommandLog(id, limit = 30) {
    return (this._cmdLog[id] || []).slice(-limit).reverse();
  }

  formatAll() {
    return Object.values(this._state).map(g => this._format(g));
  }

  // ── Helpers ──────────────────────────────────────────────────────
  _persist() {
    try {
      const dataPath = path.join(__dirname, '../data/sluice-gates.json');
      const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      raw.sluices = Object.values(this._state);
      fs.writeFileSync(dataPath, JSON.stringify(raw, null, 2));
    } catch (e) { console.warn('[SLUICE-ENGINE] Persist warn:', e.message); }
  }

  _log(id, action, operator) {
    if (!this._cmdLog[id]) this._cmdLog[id] = [];
    this._cmdLog[id].push({ time: new Date().toISOString(), action, operator });
    if (this._cmdLog[id].length > 200) this._cmdLog[id].shift();
  }

  _getMultiplier() {
    const s = this._scenario?.getScenario?.() || 'normal';
    return { normal: 1.0, rain_watch: 1.2, flood: 1.6, storm: 1.9, typhoon: 2.2, drought: 0.4 }[s] || 1.0;
  }

  _format(g) {
    return {
      sluice_id:         g.id,
      name:              g.name,
      river:             g.river,
      district:          g.district,
      lat:               g.lat,
      lng:               g.lng,
      gates_total:       g.gates_total,
      gates_open:        g.gates_open,
      openPct:           g.openPct,
      upstreamLevel_m:   g.upstreamLevel_m,
      downstreamLevel_m: g.downstreamLevel_m,
      maxFlow_m3s:       g.maxFlow_m3s,
      currentFlow_m3s:   g.currentFlow_m3s,
      controlType:       g.controlType,
      status:            g.status,
      operator:          g.operator,
      lastOperated:      g.lastOperated,
      lastUpdated:       g.lastUpdated,
    };
  }
}

module.exports = SluiceEngine;
