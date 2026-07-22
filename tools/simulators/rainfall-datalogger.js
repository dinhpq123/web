/**
 * Hadiwa IOC — Rainfall Datalogger Simulator
 * Giả lập chuỗi thời gian lượng mưa từ 68 trạm đo mưa TP. Hà Nội
 * (Clone Quawaco datalogger-simulator.js — thông số thủy lợi hoàn toàn khác)
 *
 * Port: 7102 (Quawaco không có port này)
 *
 * Endpoints:
 *   GET  /health                           → Health check
 *   GET  /api/loggers                      → Danh sách tất cả logger
 *   GET  /api/logger/:id                   → Chi tiết logger
 *   GET  /api/logger/:id/latest            → Bản ghi mới nhất
 *   GET  /api/logger/:id/data?hours=N      → Chuỗi thời gian N giờ
 *   GET  /api/rainfall/summary             → Tổng quan toàn TP (max/avg/alert)
 *   GET  /api/rainfall/heatmap             → Dữ liệu heatmap 24h × quận/huyện
 *   POST /api/logger/:id/calibrate         → Hiệu chuẩn giả lập
 */
'use strict';

require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const HTTP_PORT = parseInt(process.env.RAINFALL_DATALOGGER_PORT || '7102');

// ── 24 quận/huyện TP. Hà Nội (đơn giản hóa, 1 logger/khu vực) ──────────────
const DISTRICTS = [
  { id: 'RL-HK',  name: 'Q. Hoàn Kiếm',    baseRF: 22.5, lat: 21.0285, lng: 105.8542 },
  { id: 'RL-DĐ',  name: 'Q. Đống Đa',      baseRF: 28.2, lat: 21.0278, lng: 105.8387 },
  { id: 'RL-HBT', name: 'Q. Hai Bà Trưng', baseRF: 24.8, lat: 21.0064, lng: 105.8624 },
  { id: 'RL-BĐ',  name: 'Q. Ba Đình',      baseRF: 20.5, lat: 21.0426, lng: 105.8397 },
  { id: 'RL-TH',  name: 'Q. Tây Hồ',       baseRF: 18.9, lat: 21.0817, lng: 105.8190 },
  { id: 'RL-LB',  name: 'Q. Long Biên',    baseRF: 25.3, lat: 21.0420, lng: 105.8890 },
  { id: 'RL-HM',  name: 'Q. Hoàng Mai',    baseRF: 30.1, lat: 20.9819, lng: 105.8528 },
  { id: 'RL-TL',  name: 'Q. Thanh Xuân',   baseRF: 32.5, lat: 20.9966, lng: 105.8228 },
  { id: 'RL-HD',  name: 'Q. Hà Đông',      baseRF: 35.8, lat: 20.9643, lng: 105.7793 },
  { id: 'RL-BTL', name: 'Q. Bắc Từ Liêm',  baseRF: 19.2, lat: 21.0682, lng: 105.7777 },
  { id: 'RL-NTL', name: 'Q. Nam Từ Liêm',  baseRF: 22.4, lat: 21.0122, lng: 105.7640 },
  { id: 'RL-ĐA',  name: 'H. Đông Anh',     baseRF: 14.5, lat: 21.1484, lng: 105.8455 },
  { id: 'RL-GN',  name: 'H. Gia Lâm',      baseRF: 18.6, lat: 21.0050, lng: 106.0017 },
  { id: 'RL-SS',  name: 'H. Sóc Sơn',      baseRF: 16.2, lat: 21.2518, lng: 105.8440 },
  { id: 'RL-MĐ',  name: 'H. Mê Linh',      baseRF: 15.8, lat: 21.1897, lng: 105.7229 },
  { id: 'RL-TT',  name: 'H. Thường Tín',   baseRF: 38.5, lat: 20.8672, lng: 105.8636 },
  { id: 'RL-PX',  name: 'H. Phú Xuyên',    baseRF: 42.0, lat: 20.7428, lng: 105.9131 },
  { id: 'RL-UH',  name: 'H. Ứng Hòa',      baseRF: 45.2, lat: 20.6932, lng: 105.7906 },
  { id: 'RL-MY',  name: 'H. Mỹ Đức',       baseRF: 52.8, lat: 20.6083, lng: 105.7517 },
  { id: 'RL-CM',  name: 'H. Chương Mỹ',    baseRF: 60.5, lat: 20.8922, lng: 105.6867 },
  { id: 'RL-TO',  name: 'H. Thanh Oai',    baseRF: 40.3, lat: 20.8778, lng: 105.7753 },
  { id: 'RL-PT',  name: 'H. Phúc Thọ',     baseRF: 28.9, lat: 21.0792, lng: 105.5664 },
  { id: 'RL-DP',  name: 'H. Đan Phượng',   baseRF: 22.6, lat: 21.0931, lng: 105.6669 },
  { id: 'RL-HĐ',  name: 'H. Hoài Đức',     baseRF: 26.4, lat: 21.0061, lng: 105.7211 },
  { id: 'RL-QO',  name: 'H. Quốc Oai',     baseRF: 33.2, lat: 20.9625, lng: 105.6344 },
  { id: 'RL-TT2', name: 'H. Thạch Thất',   baseRF: 38.7, lat: 21.0036, lng: 105.5300 },
  { id: 'RL-BV',  name: 'H. Ba Vì',        baseRF: 88.5, lat: 21.0714, lng: 105.3669 },
  { id: 'RL-ST',  name: 'TX. Sơn Tây',     baseRF: 28.2, lat: 21.1330, lng: 105.5040 },
];

class HadiwaRainfallDatalogger {
  constructor(config, hydroEngine) {
    this.config = config;
    this.hydro  = hydroEngine;
    this.app    = express();
    this._server = null;
    this._loggers = {};   // { id: { currentRF, history[] } }

    for (const d of DISTRICTS) {
      this._loggers[d.id] = {
        ...d,
        currentRF:   +(d.baseRF * (0.9 + Math.random() * 0.2)).toFixed(1),
        status:      'online',
        history:     this._generateHistory(d.baseRF),
        lastSync:    new Date().toISOString(),
      };
    }
    this._setupRoutes();
  }

  _generateHistory(baseRF) {
    const now = Date.now();
    return Array.from({ length: 25 }, (_, i) => {
      const hrsAgo = 24 - i;
      const peak   = i > 8 && i < 16 ? 1.4 : 0.7;  // simulated daily peak
      return {
        time:     new Date(now - hrsAgo * 3600000).toISOString(),
        rainfall: Math.max(0, +(baseRF * peak * (0.5 + Math.random() * 1.0)).toFixed(1)),
      };
    });
  }

  _tick() {
    const scenarioName = this.hydro.getScenario();
    const rfMult = { normal: 1.0, flood: 4.5, storm: 6.0, drought: 0.1, emergency: 8.0 }[scenarioName] || 1.0;

    for (const lg of Object.values(this._loggers)) {
      const delta    = (Math.random() - 0.45) * lg.baseRF * rfMult * 0.15;
      lg.currentRF   = Math.max(0, +(lg.currentRF + delta).toFixed(1));
      lg.lastSync    = new Date().toISOString();
      const entry    = { time: lg.lastSync, rainfall: lg.currentRF };
      lg.history.push(entry);
      if (lg.history.length > 200) lg.history.shift();
    }
  }

  _setupRoutes() {
    this.app.use(cors());
    this.app.use(express.json());

    // ── Health ──────────────────────────────────────────────────────────
    this.app.get('/health', (req, res) => {
      res.json({
        status:    'ok',
        simulator: 'hadiwa-rainfall-datalogger',
        loggers:   Object.keys(this._loggers).length,
        scenario:  this.hydro.getScenario(),
        uptime_s:  Math.round(process.uptime()),
        time:      new Date().toISOString(),
      });
    });

    // ── Danh sách loggers ────────────────────────────────────────────────
    this.app.get('/api/loggers', (req, res) => {
      const list = Object.values(this._loggers).map(lg => ({
        id:          lg.id,
        name:        lg.name,
        lat:         lg.lat,
        lng:         lg.lng,
        rainfall_mm: lg.currentRF,
        status:      lg.status,
        lastSync:    lg.lastSync,
        alert:       lg.currentRF >= 150 ? 'critical' : lg.currentRF >= 100 ? 'warning' : lg.currentRF >= 50 ? 'watch' : 'normal',
      }));
      res.json({ success: true, count: list.length, scenario: this.hydro.getScenario(), data: list, time: new Date().toISOString() });
    });

    // ── Chi tiết 1 logger ────────────────────────────────────────────────
    this.app.get('/api/logger/:id', (req, res) => {
      const lg = this._loggers[req.params.id.toUpperCase()];
      if (!lg) return res.status(404).json({ success: false, error: 'Logger not found' });
      res.json({ success: true, data: { ...lg, history: undefined }, time: new Date().toISOString() });
    });

    // ── Latest reading ───────────────────────────────────────────────────
    this.app.get('/api/logger/:id/latest', (req, res) => {
      const lg = this._loggers[req.params.id.toUpperCase()];
      if (!lg) return res.status(404).json({ success: false, error: 'Logger not found' });
      res.json({
        success:     true,
        logger_id:   lg.id,
        name:        lg.name,
        rainfall_mm: lg.currentRF,
        time:        lg.lastSync,
      });
    });

    // ── Chuỗi thời gian ──────────────────────────────────────────────────
    this.app.get('/api/logger/:id/data', (req, res) => {
      const lg    = this._loggers[req.params.id.toUpperCase()];
      if (!lg) return res.status(404).json({ success: false, error: 'Logger not found' });
      const hours = Math.min(72, parseInt(req.query.hours || '24'));
      const pts   = lg.history.slice(-hours - 1);
      res.json({ success: true, logger_id: lg.id, hours, points: pts.length, data: pts });
    });

    // ── Tổng quan toàn TP ────────────────────────────────────────────────
    this.app.get('/api/rainfall/summary', (req, res) => {
      const loggers = Object.values(this._loggers);
      const rfs     = loggers.map(lg => lg.currentRF);
      const maxRF   = Math.max(...rfs);
      const avgRF   = rfs.reduce((a, b) => a + b, 0) / rfs.length;
      const maxLg   = loggers.find(lg => lg.currentRF === maxRF);
      const critical = loggers.filter(lg => lg.currentRF >= 150).length;
      const warning  = loggers.filter(lg => lg.currentRF >= 100 && lg.currentRF < 150).length;
      const watch    = loggers.filter(lg => lg.currentRF >= 50 && lg.currentRF < 100).length;
      res.json({
        success:        true,
        scenario:       this.hydro.getScenario(),
        total_loggers:  loggers.length,
        max_rainfall:   { value_mm: +maxRF.toFixed(1), location: maxLg?.name },
        avg_rainfall_mm: +avgRF.toFixed(1),
        alert_critical: critical,
        alert_warning:  warning,
        alert_watch:    watch,
        time:           new Date().toISOString(),
      });
    });

    // ── Heatmap 24h × khu vực ────────────────────────────────────────────
    this.app.get('/api/rainfall/heatmap', (req, res) => {
      const data = Object.values(this._loggers).slice(0, 12).map(lg => ({
        name:    lg.name,
        lat:     lg.lat,
        lng:     lg.lng,
        values:  lg.history.slice(-25).map(h => h.rainfall),
      }));
      res.json({ success: true, hours: 24, districts: data.length, data });
    });

    // ── Hiệu chuẩn ──────────────────────────────────────────────────────
    this.app.post('/api/logger/:id/calibrate', (req, res) => {
      const lg = this._loggers[req.params.id.toUpperCase()];
      if (!lg) return res.status(404).json({ success: false, error: 'Logger not found' });
      const { offset_mm } = req.body;
      if (offset_mm !== undefined) {
        lg.currentRF = Math.max(0, +(lg.currentRF + parseFloat(offset_mm)).toFixed(1));
      }
      console.log(`[DATALOGGER] ⚙️  Calibrate ${lg.id}: offset=${offset_mm} → ${lg.currentRF}mm`);
      res.json({ success: true, logger_id: lg.id, rainfall_mm: lg.currentRF, time: new Date().toISOString() });
    });
  }

  start() {
    return new Promise((resolve, reject) => {
      this._server = this.app.listen(HTTP_PORT, '0.0.0.0', () => {
        console.log(`[DATALOGGER] ✅ Rainfall Datalogger — port ${HTTP_PORT}`);
        console.log(`[DATALOGGER]    http://localhost:${HTTP_PORT}/api/loggers`);
        console.log(`[DATALOGGER]    http://localhost:${HTTP_PORT}/api/rainfall/summary`);
        resolve();
      });
      this._server.on('error', reject);

      // Tick every 5s
      this._timer = setInterval(() => this._tick(), 5000);
    });
  }

  stop() {
    if (this._timer) clearInterval(this._timer);
    if (this._server) this._server.close();
  }
}

// ── Standalone run ────────────────────────────────────────────────────────────
if (require.main === module) {
  const config      = require('../config/hadiwa-config.json');
  const HydroEngine = require('../engines/hydro-engine');
  const hydro       = new HydroEngine(config);
  const sim         = new HadiwaRainfallDatalogger(config, hydro);

  sim.start().catch(console.error);

  const interval = parseInt(process.env.SCADA_INTERVAL_MS || '5000');
  setInterval(() => hydro.tick(), interval);
  process.on('SIGINT', () => { sim.stop(); process.exit(0); });
}

module.exports = HadiwaRainfallDatalogger;
