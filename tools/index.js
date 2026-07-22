'use strict';
/**
 * Hadiwa IOC — Simulator Suite — Main Entry Point v2.0.0
 * Khởi động toàn bộ 9 simulators + Admin Dashboard cùng lúc
 *
 *   Run:  node index.js       hoặc  npm start
 *   Docs: http://localhost:7200/
 *
 * Port map:
 *   1884/9002  — MQTT Broker (Flood + alerts)
 *   7100       — Hydro HTTP (16 trạm thủy văn)
 *   7101       — Reservoir SCADA (6 hồ chứa)
 *   7102       — Rainfall Datalogger (28 loggers)
 *   7103       — Pump Station (12 trạm bơm)       ← NEW
 *   7104       — IoT Flood Sensor (20 sensors)    ← NEW
 *   7105       — Sluice Gate SCADA (18 cống)      ← NEW
 *   7106       — Weather Simulator (5 trạm KT)    ← NEW
 *   7107       — Landslide Sensor (10 cảm biến)   ← NEW
 *   7200       — Admin Server + Dashboard UI       ← NEW
 */
'use strict';

require('dotenv').config();

// ── Engines ──────────────────────────────────────────────────────────────────
const config           = require('./config/hadiwa-config.json');
const HydroEngine      = require('./engines/hydro-engine');
const ReservoirEngine  = require('./engines/reservoir-engine');
const PumpEngine       = require('./engines/pump-engine');
const SluiceEngine     = require('./engines/sluice-engine');

// ── Simulators (existing) ─────────────────────────────────────────────────────
const HydroHTTPSim     = require('./simulators/hydro-http-simulator');
const FloodMQTT        = require('./simulators/flood-mqtt-publisher');
const ReservoirSCADA   = require('./simulators/reservoir-scada');
const RainfallDatalog  = require('./simulators/rainfall-datalogger');

// ── Simulators (new v2) ───────────────────────────────────────────────────────
const PumpSim          = require('./simulators/pump-station-simulator');
const FloodSensorSim   = require('./simulators/iot-flood-sensor-simulator');
const SluiceSim        = require('./simulators/sluice-gate-simulator');
const WeatherSim       = require('./simulators/weather-simulator');
const LandslideSim     = require('./simulators/landslide-sensor-simulator');

// ── Admin Server ──────────────────────────────────────────────────────────────
const AdminServer      = require('./admin-server');

const SCADA_INTERVAL   = parseInt(process.env.SCADA_INTERVAL_MS || '5000');
const DEFAULT_SCENARIO = process.env.DEFAULT_SCENARIO || 'normal';

async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║   HADIWA IOC — Simulator Tools Suite v2.0.0                       ║');
  console.log('║   Chi cục Thủy lợi & PCTT TP. Hà Nội                             ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝');
  console.log('');

  // ── Engines ────────────────────────────────────────────────────────────────
  console.log('[MAIN] Khởi tạo engines...');
  const hydro     = new HydroEngine(config);
  const reservoir = new ReservoirEngine(config);
  const pump      = new PumpEngine(config, hydro);
  const sluice    = new SluiceEngine(config, hydro);

  // ── Simulators ─────────────────────────────────────────────────────────────
  console.log('[MAIN] Khởi tạo simulators...');
  const hydroHTTP     = new HydroHTTPSim(config, hydro);
  const floodMQTT     = new FloodMQTT(config, hydro, reservoir);
  const rsvSCADA      = new ReservoirSCADA(config, hydro, reservoir);
  const datalogger    = new RainfallDatalog(config, hydro);
  const pumpSim       = new PumpSim(config, pump, hydro);
  const floodSensor   = new FloodSensorSim(config, hydro);
  const sluiceSim     = new SluiceSim(config, sluice, hydro);
  const weather       = new WeatherSim(config, hydro);
  const landslide     = new LandslideSim(config, hydro);

  // ── Admin Server ────────────────────────────────────────────────────────────
  const admin = new AdminServer(
    { hydro, reservoir, pump, sluice },
    { hydroHTTP, floodMQTT, rsvSCADA, datalogger, pumpSim, floodSensor, sluiceSim, weather, landslide }
  );

  // ── Start tất cả services ──────────────────────────────────────────────────
  console.log('[MAIN] Khởi động tất cả services...');
  await Promise.all([
    hydroHTTP.start(),
    floodMQTT.start(),
    rsvSCADA.start(),
    datalogger.start(),
    pumpSim.start(),
    floodSensor.start(),
    sluiceSim.start(),
    weather.start(),
    landslide.start(),
    admin.start(),
  ]);

  // ── Apply default scenario ─────────────────────────────────────────────────
  if (DEFAULT_SCENARIO !== 'normal') {
    hydro.setScenario(DEFAULT_SCENARIO);
    console.log(`[MAIN] ✅ Kịch bản mặc định: ${DEFAULT_SCENARIO}`);
  }

  // ── Global tick loop ────────────────────────────────────────────────────────
  setInterval(() => {
    hydro.tick();
    reservoir.tick(hydro.getState());
    pump.tick();
    sluice.tick();
  }, SCADA_INTERVAL);

  // ── Print port map ──────────────────────────────────────────────────────────
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('  🚀 TẤT CẢ SERVICES ĐÃ CHẠY THÀNH CÔNG');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('');
  console.log('  📊 Admin Dashboard        → http://localhost:7200/');
  console.log('  ℹ️  Admin API Status       → http://localhost:7200/api/admin/status');
  console.log('  🎬 Đổi kịch bản           → POST http://localhost:7200/api/admin/scenario');
  console.log('');
  console.log('  ─── Simulators ────────────────────────────────────────────────');
  console.log('  🌊 Hydro HTTP             → http://localhost:7100/api/stations');
  console.log('  📶 Flood MQTT Broker      → mqtt://localhost:1884 | ws://localhost:9002');
  console.log('  🏞  Reservoir SCADA        → http://localhost:7101/api/reservoirs');
  console.log('  🌧  Rainfall Datalogger    → http://localhost:7102/api/rainfall/summary');
  console.log('  ⚡ Pump Station          → http://localhost:7103/api/stations');
  console.log('  📡 IoT Flood Sensors     → http://localhost:7104/api/sensors');
  console.log('  🚪 Sluice Gate SCADA     → http://localhost:7105/api/sluices');
  console.log('  🌩️  Weather              → http://localhost:7106/api/weather/current');
  console.log('  ⚠️  Landslide Sensors    → http://localhost:7107/api/sensors');
  console.log('');
  console.log(`  Kịch bản mặc định: ${DEFAULT_SCENARIO}   |   Tick: ${SCADA_INTERVAL}ms`);
  console.log('  Nhấn Ctrl+C để dừng tất cả services.');
  console.log('');

  // ── Graceful shutdown ───────────────────────────────────────────────────────
  process.on('SIGINT', () => {
    console.log('\n[MAIN] Đang dừng tất cả services...');
    [hydroHTTP, floodMQTT, rsvSCADA, datalogger, pumpSim, floodSensor, sluiceSim, weather, landslide, admin]
      .forEach(s => { try { s.stop(); } catch (e) {} });
    process.exit(0);
  });
}

main().catch(err => {
  console.error('[MAIN] ❌ Lỗi khởi động:', err.message);
  console.error(err.stack);
  process.exit(1);
});
