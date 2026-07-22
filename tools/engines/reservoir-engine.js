/**
 * Hadiwa IOC — Reservoir Engine (Động cơ hồ chứa)
 * Mô phỏng dung tích hồ, lưu lượng xả, và điều khiển cổng van
 */
'use strict';

const EventEmitter = require('events');

class ReservoirEngine extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this._state = {};
    this._commandLog = [];

    for (const r of config.reservoirs) {
      this._state[r.id] = this._initReservoir(r);
    }
  }

  _initReservoir(cfg) {
    const pct = (cfg.baseLevel - cfg.deadLevel) / (cfg.designLevel - cfg.deadLevel);
    return {
      id:           cfg.id,
      name:         cfg.name,
      district:     cfg.district,
      lat:          cfg.lat,
      lng:          cfg.lng,
      capacity:     cfg.capacity,  // triệu m³
      designLevel:  cfg.designLevel,
      deadLevel:    cfg.deadLevel,
      warnL1:       cfg.warnL1,
      warnL2:       cfg.warnL2,
      warnL3:       cfg.warnL3,
      currentLevel: cfg.baseLevel,
      capacityPct:  Math.round(pct * 100),
      gates:        cfg.gates,
      gatesOpen:    0,
      gateFlow:     0,
      maxGateFlow:  cfg.maxGateFlow,
      inflowQ:      +(cfg.maxGateFlow * 0.15 + Math.random() * 10).toFixed(1),
      outflowQ:     0,
      status:       'ok',
      lastUpdated:  new Date().toISOString(),
    };
  }

  getState() { return this._state; }

  getCommandLog(reservoirId = null, limit = 50) {
    let log = [...this._commandLog].reverse();
    if (reservoirId) log = log.filter(l => l.reservoir_id === reservoirId);
    return log.slice(0, limit);
  }

  /**
   * Điều khiển cổng van
   * @param {string} reservoirId
   * @param {string} action — open | close | open_all | close_all
   * @param {object} opts — { operator, gateCount? }
   */
  controlGate(reservoirId, action, opts = {}) {
    const r = this._state[reservoirId];
    if (!r) return { success: false, error: 'Reservoir not found' };

    const before = { gatesOpen: r.gatesOpen, gateFlow: r.gateFlow };
    const op = opts.operator || 'anonymous';

    switch (action) {
      case 'open':
        r.gatesOpen = Math.min(r.gates, r.gatesOpen + (opts.gateCount || 1));
        break;
      case 'close':
        r.gatesOpen = Math.max(0, r.gatesOpen - (opts.gateCount || 1));
        break;
      case 'open_all':
        r.gatesOpen = r.gates;
        break;
      case 'close_all':
        r.gatesOpen = 0;
        break;
      default:
        return { success: false, error: `Unknown action: ${action}` };
    }

    r.gateFlow  = (r.gatesOpen / r.gates) * r.maxGateFlow;
    r.outflowQ  = r.gateFlow;
    r.status    = r.gatesOpen > 0 ? 'releasing' : 'ok';
    r.lastUpdated = new Date().toISOString();

    const log = {
      id:           `RSV-CMD-${Date.now()}`,
      reservoir_id: reservoirId,
      name:         r.name,
      action,
      before,
      after:        { gatesOpen: r.gatesOpen, gateFlow: r.gateFlow },
      operator:     op,
      time:         new Date().toISOString(),
    };
    this._commandLog.unshift(log);
    if (this._commandLog.length > 200) this._commandLog.pop();
    this.emit('gate_control', log);

    return { success: true, reservoir_id: reservoirId, action, delta: { before, after: log.after } };
  }

  /**
   * Tick — cập nhật mực hồ (inflow/outflow)
   * @param {object} hydroState — state từ HydroEngine để lấy lượng mưa
   */
  tick(hydroState = {}) {
    const now = new Date().toISOString();
    for (const id of Object.keys(this._state)) {
      const r   = this._state[id];
      const cfg = this.config.reservoirs.find(x => x.id === id);
      if (!cfg) continue;

      // Inflow tăng theo lượng mưa (giả lập)
      const rainEffect = Object.values(hydroState).reduce((sum, st) => sum + (st.rainfall || 0), 0) / 400;
      r.inflowQ = Math.max(0.5, +(cfg.maxGateFlow * 0.15 + rainEffect + (Math.random() - 0.4) * 2).toFixed(1));

      // Cập nhật mực hồ: net = inflow - outflow
      const netM3s   = r.inflowQ - r.outflowQ;
      const dtHours  = 5 / 3600;                   // tick interval 5s → giờ
      const deltaM   = netM3s * dtHours * 3600 / (cfg.capacity * 1e6 / (cfg.designLevel - cfg.deadLevel));
      r.currentLevel = Math.max(
        cfg.deadLevel + 0.1,
        Math.min(cfg.designLevel + 0.3, +(r.currentLevel + deltaM * 0.5).toFixed(2))
      );

      const pct = (r.currentLevel - cfg.deadLevel) / (cfg.designLevel - cfg.deadLevel);
      r.capacityPct = Math.round(Math.max(0, Math.min(110, pct * 100)));

      // Alert status
      if (r.currentLevel >= cfg.warnL3)     r.status = 'critical';
      else if (r.currentLevel >= cfg.warnL2) r.status = 'danger';
      else if (r.currentLevel >= cfg.warnL1) r.status = r.gatesOpen > 0 ? 'releasing' : 'warning';
      else                                    r.status = r.gatesOpen > 0 ? 'releasing' : 'ok';

      r.lastUpdated = now;
    }
    this.emit('tick', this._state);
  }
}

module.exports = ReservoirEngine;
