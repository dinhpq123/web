/**
 * Hadiwa IOC — Hydro HTTP Simulator
 * REST API giả lập dữ liệu thời gian thực từ 16 trạm thủy văn TV01-TV16
 * (Clone từ Quawaco http-simulator.js — thông số Hadiwa hoàn toàn khác)
 *
 * Port: 7100 (Quawaco dùng 7000, Hadiwa dùng port riêng)
 *
 * Endpoints:
 *   GET  /health                          → Health check
 *   GET  /api/stations                    → Tất cả trạm (waterLevel, rainfall, alert)
 *   GET  /api/station/:id                 → Chi tiết 1 trạm
 *   GET  /api/station/:id/history         → Lịch sử 24h mực nước
 *   GET  /api/alerts                      → Danh sách cảnh báo đang kích hoạt
 *   GET  /api/summary                     → Tổng quan toàn thành phố
 *   POST /api/scenario                    → Kích hoạt kịch bản (flood/storm/drought...)
 *   GET  /api/scenarios                   → Danh sách kịch bản
 */
'use strict';

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');

const HTTP_PORT  = parseInt(process.env.HYDRO_HTTP_PORT || '7100');

class HadiwHydroHTTPSimulator {
  constructor(config, hydroEngine) {
    this.config  = config;
    this.hydro   = hydroEngine;
    this.app     = express();
    this._server = null;
    this._setupRoutes();
  }

  _setupRoutes() {
    this.app.use(cors());
    this.app.use(express.json());

    // ── Health ──────────────────────────────────────────────────────────
    this.app.get('/health', (req, res) => {
      res.json({
        status:    'ok',
        simulator: 'hadiwa-hydro-http-sim',
        version:   '1.0.0',
        scenario:  this.hydro.getScenario(),
        stations:  Object.keys(this.hydro.getState()).length,
        uptime_s:  Math.round(process.uptime()),
        time:      new Date().toISOString(),
      });
    });

    // ── Tất cả trạm ─────────────────────────────────────────────────────
    this.app.get('/api/stations', (req, res) => {
      const state = this.hydro.getState();
      const result = Object.values(state).map(s => this._formatStation(s));
      res.json({ success: true, count: result.length, scenario: this.hydro.getScenario(), data: result, time: new Date().toISOString() });
    });

    // ── Chi tiết 1 trạm ─────────────────────────────────────────────────
    this.app.get('/api/station/:id', (req, res) => {
      const s = this.hydro.getState()[req.params.id.toUpperCase()];
      if (!s) return res.status(404).json({ success: false, error: 'Station not found' });
      res.json({ success: true, data: this._formatStation(s), time: new Date().toISOString() });
    });

    // ── Lịch sử 24h ─────────────────────────────────────────────────────
    this.app.get('/api/station/:id/history', (req, res) => {
      const s = this.hydro.getState()[req.params.id.toUpperCase()];
      if (!s) return res.status(404).json({ success: false, error: 'Station not found' });

      // Tạo chuỗi thời gian giả lập 24 điểm (mỗi giờ 1 điểm)
      const base = s.waterLevel;
      const now  = Date.now();
      const history = Array.from({ length: 25 }, (_, i) => {
        const hrsAgo  = 24 - i;
        const t       = new Date(now - hrsAgo * 3600 * 1000).toISOString();
        const noise   = (Math.random() - 0.5) * 0.3;
        const drift   = (i / 24) * (s.waterLevel - base * 0.92); // trend toward current
        return {
          time:       t,
          waterLevel: Math.max(0, +(base * 0.92 + drift + noise).toFixed(2)),
          rainfall:   Math.max(0, +(s.rainfall * (0.8 + Math.random() * 0.4)).toFixed(1)),
        };
      });

      res.json({ success: true, station_id: req.params.id.toUpperCase(), points: history.length, data: history });
    });

    // ── Cảnh báo active ──────────────────────────────────────────────────
    this.app.get('/api/alerts', (req, res) => {
      const state = this.hydro.getState();
      const alerts = Object.values(state)
        .filter(s => s.waterLevel > 0 && (s.waterLevel >= s.alertLevel1 || s.status === 'warning'))
        .map(s => {
          const al = s.waterLevel >= s.alertLevel3 ? 'critical'
                   : s.waterLevel >= s.alertLevel2 ? 'high'
                   : s.waterLevel >= s.alertLevel1 ? 'warning' : 'watch';
          return {
            station_id:   s.id,
            station_name: s.name,
            river:        s.river,
            alertLevel:   al,
            waterLevel:   s.waterLevel,
            alertLevel1:  s.alertLevel1,
            alertLevel2:  s.alertLevel2,
            alertLevel3:  s.alertLevel3,
            trend:        s.trend,
            time:         s.lastUpdated,
          };
        });
      res.json({ success: true, count: alerts.length, data: alerts, time: new Date().toISOString() });
    });

    // ── Tổng quan toàn TP ────────────────────────────────────────────────
    this.app.get('/api/summary', (req, res) => {
      const state    = this.hydro.getState();
      const stations = Object.values(state);
      const online   = stations.filter(s => s.status === 'online').length;
      const warning  = stations.filter(s => s.status === 'warning').length;
      const offline  = stations.filter(s => s.status === 'offline').length;
      const maxRain  = Math.max(...stations.map(s => s.rainfall || 0));
      const maxWL    = stations.reduce((m, s) => s.waterLevel > m.waterLevel ? s : m, stations[0]);
      res.json({
        success:   true,
        scenario:  this.hydro.getScenario(),
        total:     stations.length,
        online, warning, offline,
        max_rainfall_mm: maxRain,
        highest_water_level: { station_id: maxWL?.id, station_name: maxWL?.name, waterLevel: maxWL?.waterLevel, river: maxWL?.river },
        time:      new Date().toISOString(),
      });
    });

    // ── Kịch bản ────────────────────────────────────────────────────────
    this.app.get('/api/scenarios', (req, res) => {
      res.json({ success: true, current: this.hydro.getScenario(), data: this.hydro.getScenarios() });
    });

    this.app.post('/api/scenario', (req, res) => {
      const { scenario } = req.body;
      if (!scenario) return res.status(400).json({ success: false, error: 'scenario required' });
      const result = this.hydro.setScenario(scenario);
      if (!result.success) return res.status(400).json(result);
      console.log(`[HYDRO-HTTP] 📋 Kịch bản → ${scenario} (${result.label})`);
      res.json(result);
    });
  }

  _formatStation(s) {
    const al = s.waterLevel >= s.alertLevel3 ? 'critical'
             : s.waterLevel >= s.alertLevel2 ? 'high'
             : s.waterLevel >= s.alertLevel1 ? 'warning' : 'normal';
    return {
      station_id:   s.id,
      station_name: s.name,
      river:        s.river,
      district:     s.district,
      type:         s.type,
      lat:          s.lat,
      lng:          s.lng,
      status:       s.status,
      waterLevel_m: s.waterLevel,
      rainfall_mm:  s.rainfall,
      riverFlow_m3s: s.riverFlow,
      trend_m_h:    s.trend,
      alertLevel:   al,
      alertLevel1_m: s.alertLevel1,
      alertLevel2_m: s.alertLevel2,
      alertLevel3_m: s.alertLevel3,
      lastUpdated:  s.lastUpdated,
    };
  }

  start() {
    return new Promise((resolve, reject) => {
      this._server = this.app.listen(HTTP_PORT, '0.0.0.0', () => {
        console.log(`[HYDRO-HTTP] ✅ Hadiwa Hydro HTTP Simulator — port ${HTTP_PORT}`);
        console.log(`[HYDRO-HTTP]    http://localhost:${HTTP_PORT}/api/stations`);
        console.log(`[HYDRO-HTTP]    http://localhost:${HTTP_PORT}/api/alerts`);
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
  const config      = require('../config/hadiwa-config.json');
  const HydroEngine = require('../engines/hydro-engine');
  const hydro       = new HydroEngine(config);
  const sim         = new HadiwHydroHTTPSimulator(config, hydro);

  sim.start().catch(console.error);

  const interval = parseInt(process.env.SCADA_INTERVAL_MS || '5000');
  setInterval(() => hydro.tick(), interval);
  process.on('SIGINT', () => { sim.stop(); process.exit(0); });
}

module.exports = HadiwHydroHTTPSimulator;
