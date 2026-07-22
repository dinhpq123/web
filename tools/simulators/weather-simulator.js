'use strict';
/**
 * Hadiwa IOC — Weather Simulator (SIM-4)
 * REST API giả lập dữ liệu khí tượng thủy văn cho Dashboard ticker + Cảnh báo sớm
 * Port: 7106
 *
 * Endpoints:
 *   GET  /health
 *   GET  /api/weather/current           → Thời tiết hiện tại (tất cả trạm)
 *   GET  /api/weather/station/:id       → Chi tiết 1 trạm
 *   GET  /api/weather/forecast/24h      → Dự báo 24h
 *   GET  /api/weather/forecast/72h      → Dự báo 72h
 *   GET  /api/weather/typhoon           → Thông tin bão đang hoạt động
 *   GET  /api/weather/bulletin          → Bản tin cảnh báo thiên tai
 *   POST /api/scenario
 *   GET|PUT /api/mode
 *   CRUD /api/devices
 */

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const HTTP_PORT = parseInt(process.env.WEATHER_SIM_PORT || '7106');

const WIND_DIRS = ['Bắc','ĐB','Đông','ĐN','Nam','TN','Tây','TB'];

class WeatherSimulator {
  constructor(config, scenarioEngine) {
    this.config   = config;
    this.scenario = scenarioEngine;
    this.app      = express();
    this._server  = null;
    this._mode    = 'auto';
    this._state   = {};
    this._typhoon = null;
    this._history = {};

    const dataPath = path.join(__dirname, '../data/weather-stations.json');
    const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    this._tmpl = raw.typhoon_template;

    for (const s of raw.stations) {
      this._state[s.id] = {
        ...s,
        temp_C:       s.baseTemp_C,
        humidity_pct: s.baseHumidity_pct,
        windSpeed_ms: s.baseWindSpeed_ms,
        windDir_deg:  s.baseWindDir_deg,
        windDirLabel: WIND_DIRS[Math.round(s.baseWindDir_deg / 45) % 8],
        pressure_hPa: s.basePressure_hPa,
        rainfall_mm:  0,
        visibility_km: 10,
        uvIndex:      3,
        weatherCode:  'clear',   // clear | cloud | rain | storm | typhoon
        lastUpdated:  new Date().toISOString(),
      };
      this._history[s.id] = [];
    }

    this._setupRoutes();
  }

  _tick() {
    if (this._mode !== 'auto') return;
    const sc   = this.scenario.getScenario?.() || 'normal';
    const mult = { normal: 1.0, rain_watch: 1.5, flood: 2.0, storm: 3.0, typhoon: 4.5, drought: 0.3 }[sc] || 1.0;
    const now  = new Date().toISOString();

    for (const s of Object.values(this._state)) {
      // Temperature
      const tempNoise = (Math.random() - 0.5) * 0.3;
      s.temp_C        = Math.max(10, Math.min(42, +(s.baseTemp_C + tempNoise + (mult > 1.5 ? -1.5 : 0)).toFixed(1)));

      // Humidity
      s.humidity_pct = Math.max(30, Math.min(100, Math.round(s.baseHumidity_pct * Math.min(2, mult) + (Math.random() - 0.5) * 5)));

      // Wind
      const windMult   = sc === 'typhoon' ? 8 : sc === 'storm' ? 5 : sc === 'flood' ? 2.5 : 1;
      const windNoise  = (Math.random() - 0.5) * 1.5;
      s.windSpeed_ms   = Math.max(0, +(s.baseWindSpeed_ms * windMult + windNoise).toFixed(1));
      s.windDir_deg    = (s.windDir_deg + (Math.random() - 0.5) * 10 + 360) % 360;
      s.windDirLabel   = WIND_DIRS[Math.round(s.windDir_deg / 45) % 8];

      // Pressure
      const pressureNoise = (Math.random() - 0.5) * 0.3;
      s.pressure_hPa = Math.max(960, Math.min(1025, +(s.basePressure_hPa - (mult - 1) * 8 + pressureNoise).toFixed(1)));

      // Rainfall
      const rfMult = { normal: 0.05, rain_watch: 2.5, flood: 6.0, storm: 12.0, typhoon: 20.0, drought: 0.01 }[sc] || 0.05;
      s.rainfall_mm = Math.max(0, +(s.baseHumidity_pct * 0.1 * rfMult * Math.random()).toFixed(1));

      // Visibility
      s.visibility_km = Math.max(0.2, Math.min(20, +(10 - s.rainfall_mm * 0.5 + (Math.random() - 0.5) * 1).toFixed(1)));

      // Weather code
      if (sc === 'typhoon') s.weatherCode = 'typhoon';
      else if (sc === 'storm')  s.weatherCode = 'storm';
      else if (s.rainfall_mm > 20) s.weatherCode = 'heavy_rain';
      else if (s.rainfall_mm > 5)  s.weatherCode = 'rain';
      else if (s.humidity_pct > 85) s.weatherCode = 'cloud';
      else s.weatherCode = 'clear';

      s.lastUpdated = now;

      // Push to history
      this._history[s.id].push({ time: now, temp_C: s.temp_C, rainfall_mm: s.rainfall_mm, windSpeed_ms: s.windSpeed_ms });
      if (this._history[s.id].length > 288) this._history[s.id].shift();
    }

    // Typhoon object
    if (sc === 'typhoon' || sc === 'storm') {
      this._typhoon = {
        active:      true,
        name:        sc === 'typhoon' ? 'Bão số 4 (Yagi)' : 'Áp thấp nhiệt đới',
        category:    sc === 'typhoon' ? 4 : 2,
        centerLat:   20.8 + (Math.random() - 0.5) * 0.1,
        centerLng:   106.5 + (Math.random() - 0.5) * 0.2,
        maxWind_ms:  sc === 'typhoon' ? 45 : 20,
        radius_km:   sc === 'typhoon' ? 250 : 120,
        pressure_hPa: sc === 'typhoon' ? 950 : 990,
        movement:    'WNW 20km/h',
        landfall:    sc === 'typhoon' ? 'Dự kiến sau 8-12h' : null,
        time:        now,
      };
    } else {
      this._typhoon = { active: false, time: now };
    }
  }

  _formatStation(s) {
    return {
      station_id:   s.id,
      name:         s.name,
      district:     s.district,
      lat:          s.lat,
      lng:          s.lng,
      temp_C:       s.temp_C,
      humidity_pct: s.humidity_pct,
      windSpeed_ms: s.windSpeed_ms,
      windDir_deg:  Math.round(s.windDir_deg),
      windDirLabel: s.windDirLabel,
      pressure_hPa: s.pressure_hPa,
      rainfall_mm:  s.rainfall_mm,
      visibility_km: s.visibility_km,
      weatherCode:  s.weatherCode,
      lastUpdated:  s.lastUpdated,
    };
  }

  _genForecast(hours) {
    const sc   = this.scenario.getScenario?.() || 'normal';
    const rfMult = { normal: 1, rain_watch: 3, flood: 6, storm: 10, typhoon: 18, drought: 0.1 }[sc] || 1;
    const now  = Date.now();
    return Array.from({ length: hours + 1 }, (_, i) => {
      const t  = new Date(now + i * 3600000).toISOString();
      const rf = Math.max(0, +(Math.random() * 8 * rfMult).toFixed(1));
      const wnd = Math.max(0, +(4 * rfMult * (0.5 + Math.random())).toFixed(1));
      return {
        time: t,
        hour_offset: i,
        temp_C:       +(24.5 - rf * 0.1 + (Math.random() - 0.5) * 2).toFixed(1),
        rainfall_mm:  rf,
        windSpeed_ms: wnd,
        weatherCode:  rf > 20 ? 'heavy_rain' : rf > 5 ? 'rain' : 'cloud',
        alertLevel:   rf > 50 ? 'critical' : rf > 20 ? 'warning' : rf > 5 ? 'watch' : 'none',
      };
    });
  }

  _genBulletin() {
    const sc  = this.scenario.getScenario?.() || 'normal';
    const now = new Date();
    const bulletins = {
      normal:     { title: 'Bản tin thời tiết thông thường', level: 'none', body: 'Thời tiết TP. Hà Nội trong những ngày tới nhìn chung ổn định. Mưa nhỏ rải rác tại một số khu vực ngoại thành.' },
      rain_watch: { title: 'Bản tin theo dõi mưa lớn', level: 'watch', body: 'Từ đêm nay đến ngày mai, TP. Hà Nội có mưa to đến rất to, lượng mưa phổ biến 50-100mm. Đề nghị các đơn vị theo dõi sát mực nước các sông.' },
      flood:      { title: 'Bản tin cảnh báo lũ lụt — Cấp độ 2', level: 'warning', body: 'MỰC NƯỚC TRÊN CÁC SÔNG CHÍNH ĐANG TIẾP TỤC LÊN CAO. Một số khu vực trũng thấp tại H. Chương Mỹ, H. Mỹ Đức đã có ngập úng. Sẵn sàng sơ tán dân.' },
      storm:      { title: 'BẢN TIN KHẨN — GIÓ BÃO CẤP 9-10', level: 'danger', body: 'BÃO ĐANG TIẾN VÀO BỜ. Gió mạnh cấp 9-10, giật cấp 12. Toàn bộ lực lượng ứng trực 24/24. Cấm tàu thuyền ra khơi. Sẵn sàng di dân ở vùng nguy hiểm.' },
      typhoon:    { title: '🚨 KHẨN CẤP — SIÊU BÃO ĐỔ BỘ', level: 'critical', body: 'SIÊU BÃO ĐANG ĐỔ BỘ. Tất cả cấp ủy, chính quyền, LLVT thực hiện ngay phương án ứng phó khẩn cấp. Di dân khỏi vùng nguy hiểm NGAY LẬP TỨC. Mực nước vượt báo động 3.' },
      drought:    { title: 'Bản tin cảnh báo hạn hán', level: 'watch', body: 'Tình trạng thiếu nước tiếp tục kéo dài tại một số huyện ngoại thành. Đề nghị điều tiết hợp lý nguồn nước tưới tiêu.' },
    };
    const b = bulletins[sc] || bulletins.normal;
    return { ...b, issued_at: now.toISOString(), valid_until: new Date(now.getTime() + 12 * 3600000).toISOString(), issued_by: 'Đài KTTV TP. Hà Nội', scenario: sc };
  }

  _persist() {
    try {
      const dp  = path.join(__dirname, '../data/weather-stations.json');
      const raw = JSON.parse(fs.readFileSync(dp, 'utf8'));
      raw.stations = Object.values(this._state).map(({ temp_C, humidity_pct, windSpeed_ms, windDir_deg, windDirLabel, pressure_hPa, rainfall_mm, visibility_km, weatherCode, lastUpdated, history, ...s }) => s);
      fs.writeFileSync(dp, JSON.stringify(raw, null, 2));
    } catch (e) { console.warn('[WEATHER-SIM] Persist:', e.message); }
  }

  _setupRoutes() {
    this.app.use(cors());
    this.app.use(express.json());

    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', simulator: 'hadiwa-weather', version: '2.0.0', scenario: this.scenario.getScenario(), mode: this._mode, stations: Object.keys(this._state).length, uptime_s: Math.round(process.uptime()), time: new Date().toISOString() });
    });

    this.app.get('/api/weather/current', (req, res) => {
      res.json({ success: true, scenario: this.scenario.getScenario(), mode: this._mode, count: Object.keys(this._state).length, data: Object.values(this._state).map(s => this._formatStation(s)), time: new Date().toISOString() });
    });

    this.app.get('/api/weather/station/:id', (req, res) => {
      const s = this._state[req.params.id.toUpperCase()];
      if (!s) return res.status(404).json({ success: false, error: 'Station not found' });
      const hist = (this._history[req.params.id.toUpperCase()] || []).slice(-48);
      res.json({ success: true, data: { ...this._formatStation(s), history: hist }, time: new Date().toISOString() });
    });

    this.app.get('/api/weather/forecast/24h',  (req, res) => res.json({ success: true, hours: 24, scenario: this.scenario.getScenario(), data: this._genForecast(24), time: new Date().toISOString() }));
    this.app.get('/api/weather/forecast/72h',  (req, res) => res.json({ success: true, hours: 72, scenario: this.scenario.getScenario(), data: this._genForecast(72), time: new Date().toISOString() }));
    this.app.get('/api/weather/typhoon',        (req, res) => res.json({ success: true, data: this._typhoon || { active: false }, time: new Date().toISOString() }));
    this.app.get('/api/weather/bulletin',       (req, res) => res.json({ success: true, data: this._genBulletin(), time: new Date().toISOString() }));

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
    this.app.put('/api/weather/station/:id/value', (req, res) => {
      const id = req.params.id.toUpperCase();
      if (!this._state[id]) return res.status(404).json({ success: false, error: 'Not found' });
      Object.assign(this._state[id], req.body);
      res.json({ success: true, station_id: id, data: this._formatStation(this._state[id]) });
    });

    // CRUD
    this.app.get('/api/devices',        (req, res) => res.json({ success: true, data: Object.values(this._state).map(s => this._formatStation(s)) }));
    this.app.post('/api/devices',       (req, res) => {
      const id = req.body.id || `KT-${String(Object.keys(this._state).length + 1).padStart(2, '0')}`;
      this._state[id] = { ...req.body, id, lastUpdated: new Date().toISOString() };
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
        console.log(`[WEATHER-SIM] ✅ Weather Simulator — port ${HTTP_PORT}`);
        console.log(`[WEATHER-SIM]    http://localhost:${HTTP_PORT}/api/weather/current`);
        console.log(`[WEATHER-SIM]    http://localhost:${HTTP_PORT}/api/weather/bulletin`);
        this._timer = setInterval(() => this._tick(), 5000);
        this._tick(); // immediate
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
  const sim         = new WeatherSimulator(config, hydro);
  sim.start().catch(console.error);
  const interval = parseInt(process.env.SCADA_INTERVAL_MS || '5000');
  setInterval(() => hydro.tick(), interval);
  process.on('SIGINT', () => { sim.stop(); process.exit(0); });
}

module.exports = WeatherSimulator;
