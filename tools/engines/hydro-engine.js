/**
 * Hadiwa IOC — Hydro Engine (Động cơ vật lý thủy văn)
 * Mô phỏng biến động mực nước sông, lưu lượng và lượng mưa
 * theo các kịch bản: bình thường / lũ / bão / hạn hán / khẩn cấp
 *
 * Thông số đặc thù Hadiwa (khác Quawaco):
 *   - waterLevel (m) so với ngưỡng BĐ1/BĐ2/BĐ3
 *   - rainfall (mm/24h) — lượng mưa tích lũy
 *   - riverFlow (m³/s) — lưu lượng tại trạm
 *   - trend (+/-m/h) — xu hướng nước đang tăng/giảm
 */
'use strict';

const EventEmitter = require('events');

const SCENARIOS = {
  normal:     { label: 'Bình thường',              wlMult: 1.00, rfMult: 1.00, trendBias:  0.000, noise: 0.02  },
  rain_watch: { label: 'Theo dõi mưa',             wlMult: 1.10, rfMult: 2.50, trendBias:  0.060, noise: 0.04  },
  flood:      { label: 'Lũ lớn sông Hồng',         wlMult: 1.35, rfMult: 4.50, trendBias:  0.250, noise: 0.08  },
  storm:      { label: 'Bão / Áp thấp nhiệt đới',  wlMult: 1.15, rfMult: 6.00, trendBias:  0.180, noise: 0.12  },
  typhoon:    { label: 'Siêu bão / Khẩn cấp',      wlMult: 1.60, rfMult: 8.00, trendBias:  0.500, noise: 0.15  },
  drought:    { label: 'Hạn hán',                  wlMult: 0.55, rfMult: 0.10, trendBias: -0.100, noise: 0.005 },
  emergency:  { label: 'Khẩn cấp — Nguy cơ vỡ đê', wlMult: 1.60, rfMult: 8.00, trendBias: 0.500, noise: 0.15  },
};

class HydroEngine extends EventEmitter {
  /**
   * @param {object} config — nội dung hadiwa-config.json
   */
  constructor(config) {
    super();
    this.config   = config;
    this.scenario = 'normal';
    this._state   = {};   // { stationId: { waterLevel, rainfall, riverFlow, trend, status, ... } }
    this._commandLog = [];

    // Khởi tạo state ban đầu từ config
    for (const st of config.hydrologicalStations) {
      this._state[st.id] = this._initStation(st);
    }
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  _initStation(cfg) {
    const wl = +(cfg.baseWaterLevel * (1 + (Math.random() - 0.5) * 0.04)).toFixed(2);
    const rf = +(cfg.baseRainfall  * (1 + (Math.random() - 0.5) * 0.10)).toFixed(1);
    return {
      id:           cfg.id,
      name:         cfg.name,
      river:        cfg.river,
      district:     cfg.district,
      type:         cfg.type,
      lat:          cfg.lat,
      lng:          cfg.lng,
      alertLevel1:  cfg.alertLevel1,
      alertLevel2:  cfg.alertLevel2,
      alertLevel3:  cfg.alertLevel3,
      waterLevel:   wl,
      rainfall:     rf,
      riverFlow:    cfg.type === 'rain' ? 0 : +(rf * 3.5 + Math.random() * 20).toFixed(1),
      trend:        '+0.00',
      status:       'online',
      lastUpdated:  new Date().toISOString(),
    };
  }

  _alertLevel(st) {
    const wl = st.waterLevel;
    if (wl >= st.alertLevel3) return 'critical';
    if (wl >= st.alertLevel2) return 'high';
    if (wl >= st.alertLevel1) return 'warning';
    return 'normal';
  }

  _rand(min, max) { return min + Math.random() * (max - min); }

  // ── Public API ───────────────────────────────────────────────────────────

  getState() { return this._state; }

  getScenario() { return this.scenario; }

  getScenarios() {
    return Object.entries(SCENARIOS).map(([key, v]) => ({ id: key, label: v.label }));
  }

  setScenario(scenario) {
    if (!SCENARIOS[scenario]) return { success: false, error: `Unknown scenario: ${scenario}` };
    this.scenario = scenario;
    this.emit('scenario', scenario);
    return { success: true, scenario, label: SCENARIOS[scenario].label };
  }

  getCommandLog(stationId = null, limit = 50) {
    let log = [...this._commandLog].reverse();
    if (stationId) log = log.filter(l => l.station_id === stationId);
    return log.slice(0, limit);
  }

  /**
   * Tick — Gọi định kỳ (mỗi SCADA_INTERVAL_MS) để cập nhật dữ liệu
   */
  tick() {
    const scen = SCENARIOS[this.scenario] || SCENARIOS.normal;
    const now  = new Date().toISOString();
    const alerts = [];

    for (const id of Object.keys(this._state)) {
      const st  = this._state[id];
      const cfg = this.config.hydrologicalStations.find(x => x.id === id);
      if (!cfg) continue;

      // ── Rainfall biến động ──────────────────────────────────────────
      const rfBase = cfg.baseRainfall * scen.rfMult;
      const rfDelta = (Math.random() - 0.48) * scen.noise * rfBase;
      st.rainfall = Math.max(0, +(st.rainfall + rfDelta).toFixed(1));

      // ── Water level biến động ───────────────────────────────────────
      if (st.type !== 'rain') {
        const wlBase  = cfg.baseWaterLevel * scen.wlMult;
        const noise   = scen.noise;
        // drift dần về target + random walk
        const delta   = (wlBase - st.waterLevel) * 0.08
                      + scen.trendBias * (this._rand(0.5, 1.5))
                      + (Math.random() - 0.5) * noise;
        const newWL   = Math.max(0.1, +(st.waterLevel + delta).toFixed(2));
        const trend   = +(newWL - st.waterLevel).toFixed(2);
        st.waterLevel = newWL;
        st.trend      = (trend >= 0 ? '+' : '') + trend.toFixed(2);
      }

      // ── River flow (tương quan mực nước) ────────────────────────────
      if (st.type === 'hydro') {
        st.riverFlow = Math.max(0, +(st.waterLevel * 18.5 * scen.wlMult + this._rand(-10, 10)).toFixed(1));
      }

      // ── Status ──────────────────────────────────────────────────────
      const al = this._alertLevel(st);
      if (al === 'critical' || al === 'high')  st.status = 'warning';
      else if (st.type !== 'rain' || st.rainfall > 0) st.status = 'online';

      // Giữ TV08 offline (mô phỏng thiết bị lỗi) trừ kịch bản flood/emergency
      if (id === 'TV08' && this.scenario === 'normal') st.status = 'offline';

      st.lastUpdated = now;

      // ── Alerts ──────────────────────────────────────────────────────
      if (al !== 'normal') {
        alerts.push({
          stationId: id,
          name:      st.name,
          alertLevel: al,
          waterLevel: st.waterLevel,
          threshold:  al === 'critical' ? st.alertLevel3
                    : al === 'high'     ? st.alertLevel2
                    :                     st.alertLevel1,
          time:      now,
        });
      }
    }

    if (alerts.length > 0) this.emit('alerts', alerts);
    this.emit('tick', this._state);
  }
}

module.exports = HydroEngine;
