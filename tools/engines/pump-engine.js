'use strict';
/**
 * Hadiwa IOC — Pump Engine
 * Mô phỏng vận hành 12 trạm bơm tiêu úng TP. Hà Nội
 * Hỗ trợ: Auto tick / Manual override / Scenario multipliers
 */

const fs   = require('fs');
const path = require('path');

class PumpEngine {
  constructor(config, scenarioEngine) {
    this._scenario = scenarioEngine;
    this._mode     = 'auto';          // 'auto' | 'manual'
    this._state    = {};              // { id: { ...station, currentFlow, status, ... } }
    this._cmdLog   = {};              // { id: [{time, action, operator}] }
    this._overrides = {};             // { id: { field: value } } — manual overrides

    // Load data file
    const dataPath = path.join(__dirname, '../data/pump-stations.json');
    const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    for (const s of raw.stations) {
      this._state[s.id] = {
        ...s,
        currentFlow_m3s: s.currentFlow_m3s ?? s.designFlow_m3s * 0.7,
        headWater_m:     s.headWater_m ?? 3.0,
        tailWater_m:     s.tailWater_m ?? 1.0,
        powerConsumption_kW: s.powerConsumption_kW ?? 0,
        failureRisk_pct: 0,
        lastUpdated:     new Date().toISOString(),
      };
      this._cmdLog[s.id] = [];
    }
  }

  // ── Tick (auto mode) ─────────────────────────────────────────────
  tick() {
    if (this._mode !== 'auto') return;
    const mult = this._getMultiplier();
    for (const s of Object.values(this._state)) {
      if (Object.keys(this._overrides[s.id] || {}).length > 0) continue; // manual overridden

      if (s.status === 'offline') {
        // Chance of coming back online
        if (Math.random() < 0.01) {
          s.status = 'running';
          s.pumps_active = 1;
        }
        s.currentFlow_m3s = 0;
        s.powerConsumption_kW = 0;
      } else {
        // Fluctuate flow based on scenario
        const targetLoad  = Math.min(1.0, mult * (0.5 + Math.random() * 0.5));
        const activePumps = s.pumps_active || s.pumps_total;
        const noise       = (Math.random() - 0.5) * 0.05 * s.designFlow_m3s;
        s.currentFlow_m3s = Math.max(0, +(s.designFlow_m3s * (activePumps / s.pumps_total) * targetLoad + noise).toFixed(1));
        s.powerConsumption_kW = +(s.currentFlow_m3s / s.designFlow_m3s * (s.powerConsumption_kW || s.currentFlow_m3s * 6.5)).toFixed(0);

        // Water levels respond to scenario
        const wlNoise = (Math.random() - 0.5) * 0.1;
        s.headWater_m = Math.max(0, +(s.headWater_m + wlNoise * mult).toFixed(2));

        // Failure risk
        const age = new Date().getFullYear() - (s.commissionYear || 2000);
        s.failureRisk_pct = Math.min(100, Math.round(age * 0.8 + (1 - activePumps / s.pumps_total) * 30));

        // Status logic
        if (s.headWater_m >= s.criticalThresholdH_m) {
          s.status = 'critical';
        } else if (s.headWater_m >= s.alertThresholdH_m) {
          s.status = 'warning';
        } else if (s.pumps_active < s.pumps_total) {
          s.status = 'warning';
        } else {
          s.status = 'running';
        }

        // Random pump failure (rare)
        if (Math.random() < 0.0005 && s.pumps_active > 0) {
          s.pumps_active = Math.max(0, s.pumps_active - 1);
          this._log(s.id, 'pump_failure', 'AUTO_SYSTEM');
        }
      }
      s.lastUpdated = new Date().toISOString();
    }
  }

  // ── Manual control ───────────────────────────────────────────────
  /**
   * Control a pump station manually.
   * action: 'start_pump' | 'stop_pump' | 'set_flow' | 'shutdown' | 'restore'
   */
  controlStation(id, action, params = {}) {
    const s = this._state[id];
    if (!s) return { success: false, error: 'Station not found' };

    if (!this._overrides[id]) this._overrides[id] = {};

    switch (action) {
      case 'start_pump':
        s.pumps_active = Math.min(s.pumps_total, (s.pumps_active || 0) + (params.count || 1));
        if (s.status === 'offline') s.status = 'running';
        break;
      case 'stop_pump':
        s.pumps_active = Math.max(0, (s.pumps_active || 0) - (params.count || 1));
        if (s.pumps_active === 0) s.status = 'warning';
        break;
      case 'set_flow':
        s.currentFlow_m3s = Math.min(s.designFlow_m3s, Math.max(0, params.flow_m3s || 0));
        this._overrides[id].currentFlow_m3s = s.currentFlow_m3s;
        break;
      case 'shutdown':
        s.status = 'offline';
        s.pumps_active = 0;
        s.currentFlow_m3s = 0;
        s.powerConsumption_kW = 0;
        this._overrides[id].status = 'offline';
        break;
      case 'restore':
        delete this._overrides[id];
        s.status = 'running';
        s.pumps_active = s.pumps_total;
        break;
      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
    s.lastUpdated = new Date().toISOString();
    this._log(id, action, params.operator || 'API');
    return { success: true, station_id: id, action, state: this._format(s) };
  }

  // ── CRUD ──────────────────────────────────────────────────────────
  addStation(data) {
    const id = data.id || `TBP-${String(Object.keys(this._state).length + 1).padStart(2, '0')}`;
    this._state[id] = { ...data, id, lastUpdated: new Date().toISOString() };
    this._cmdLog[id] = [];
    this._overrides[id] = {};
    this._persist();
    return { success: true, id };
  }

  updateStation(id, data) {
    if (!this._state[id]) return { success: false, error: 'Not found' };
    Object.assign(this._state[id], data, { id, lastUpdated: new Date().toISOString() });
    this._persist();
    return { success: true, id };
  }

  deleteStation(id) {
    if (!this._state[id]) return { success: false, error: 'Not found' };
    delete this._state[id];
    delete this._cmdLog[id];
    delete this._overrides[id];
    this._persist();
    return { success: true, id };
  }

  // ── State / Getters ──────────────────────────────────────────────
  getState()    { return this._state; }
  getMode()     { return this._mode; }
  setMode(m)    { this._mode = m; return { success: true, mode: m }; }

  getCommandLog(id, limit = 30) {
    return (this._cmdLog[id] || []).slice(-limit).reverse();
  }

  // ── Persist data file ────────────────────────────────────────────
  _persist() {
    try {
      const dataPath = path.join(__dirname, '../data/pump-stations.json');
      const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      raw.stations = Object.values(this._state);
      fs.writeFileSync(dataPath, JSON.stringify(raw, null, 2));
    } catch (e) { console.warn('[PUMP-ENGINE] Persist warn:', e.message); }
  }

  _log(id, action, operator) {
    if (!this._cmdLog[id]) this._cmdLog[id] = [];
    this._cmdLog[id].push({ time: new Date().toISOString(), action, operator });
    if (this._cmdLog[id].length > 200) this._cmdLog[id].shift();
  }

  _getMultiplier() {
    const s = this._scenario?.getScenario?.() || 'normal';
    return { normal: 0.7, rain_watch: 0.85, flood: 1.0, storm: 1.0, typhoon: 1.0, drought: 0.9 }[s] || 0.7;
  }

  _format(s) {
    const design = s.designFlow_m3s || 1;
    return {
      station_id:    s.id,
      name:          s.name,
      district:      s.district,
      river:         s.river,
      lat:           s.lat,
      lng:           s.lng,
      capacity_m3h:  s.capacity_m3h,
      pumps_total:   s.pumps_total,
      pumps_active:  s.pumps_active,
      designFlow_m3s: s.designFlow_m3s,
      currentFlow_m3s: s.currentFlow_m3s,
      loadPct:       Math.round((s.currentFlow_m3s / design) * 100),
      headWater_m:   s.headWater_m,
      tailWater_m:   s.tailWater_m,
      powerConsumption_kW: s.powerConsumption_kW,
      failureRisk_pct: s.failureRisk_pct,
      status:        s.status,
      operatorName:  s.operatorName,
      alertThresholdH_m:    s.alertThresholdH_m,
      criticalThresholdH_m: s.criticalThresholdH_m,
      lastMaintained: s.lastMaintained,
      lastUpdated:   s.lastUpdated,
    };
  }

  formatAll() {
    return Object.values(this._state).map(s => this._format(s));
  }
}

module.exports = PumpEngine;
