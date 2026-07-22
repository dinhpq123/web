/**
 * Hadiwa IOC — Flood Alert MQTT Publisher
 * Publish dữ liệu thủy văn, cảnh báo lũ, hồ chứa qua MQTT
 * (Clone Quawaco mqtt-publisher.js — topic schema & payload khác hoàn toàn)
 *
 * Port Broker: 1884 / WS: 9002  (Quawaco dùng 1883/9001)
 *
 * Topics:
 *   hadiwa/station/{id}/waterLevel   — Mực nước mỗi 10s
 *   hadiwa/station/{id}/rainfall     — Lượng mưa tích lũy
 *   hadiwa/reservoir/{id}/level      — Mức hồ
 *   hadiwa/reservoir/{id}/gate       — Trạng thái cổng xả
 *   hadiwa/alert/{severity}          — Cảnh báo BĐ1/BĐ2/BĐ3
 *   hadiwa/system/status             — Tổng quan hệ thống
 */
'use strict';

require('dotenv').config();
const aedes  = require('aedes');
const net    = require('net');
const ws     = require('ws');
const http   = require('http');

const MQTT_PORT    = parseInt(process.env.FLOOD_MQTT_PORT       || '1884');
const WS_PORT      = parseInt(process.env.FLOOD_MQTT_WS_PORT    || '9002');
const PUB_INTERVAL = parseInt(process.env.FLOOD_MQTT_PUBLISH_INTERVAL_MS || '10000');

class HadiwaFloodMQTTPublisher {
  constructor(config, hydroEngine, reservoirEngine) {
    this.config    = config;
    this.hydro     = hydroEngine;
    this.reservoir = reservoirEngine;
    this._broker   = aedes();
    this._tcpServer = net.createServer(this._broker.handle);
    this._wsServer  = null;
    this._timer     = null;
    this._clients   = 0;

    this._broker.on('client',       () => { this._clients++; console.log(`[FLOOD-MQTT] 🔌 Client connected  (${this._clients})`); });
    this._broker.on('clientDisconnect', () => { this._clients = Math.max(0, this._clients - 1); console.log(`[FLOOD-MQTT]    Client disconnected (${this._clients})`); });
    this._broker.on('publish', (p) => {
      if (p.topic && !p.topic.startsWith('$')) {
        // Minimal log — avoid flood
      }
    });
  }

  _pub(topic, payload) {
    this._broker.publish({
      topic,
      payload: JSON.stringify(payload),
      qos: 0,
      retain: true,
    }, () => {});
  }

  _publishAll() {
    const hydroState = this.hydro.getState();
    const rsvState   = this.reservoir.getState();
    const now        = new Date().toISOString();

    // ── Stations ──────────────────────────────────────────────────────────
    for (const s of Object.values(hydroState)) {
      const base = `hadiwa/station/${s.id}`;
      this._pub(`${base}/waterLevel`, {
        station_id:    s.id,
        station_name:  s.name,
        river:         s.river,
        waterLevel_m:  s.waterLevel,
        trend_m_h:     s.trend,
        alertLevel1_m: s.alertLevel1,
        alertLevel2_m: s.alertLevel2,
        status:        s.status,
        time:          now,
      });
      this._pub(`${base}/rainfall`, {
        station_id:   s.id,
        station_name: s.name,
        rainfall_mm:  s.rainfall,
        type:         s.type,
        time:         now,
      });
    }

    // ── Reservoirs ────────────────────────────────────────────────────────
    for (const r of Object.values(rsvState)) {
      const base = `hadiwa/reservoir/${r.id}`;
      this._pub(`${base}/level`, {
        reservoir_id:  r.id,
        name:          r.name,
        currentLevel:  r.currentLevel,
        designLevel:   r.designLevel,
        capacityPct:   r.capacityPct,
        inflowQ_m3s:   r.inflowQ,
        outflowQ_m3s:  r.outflowQ,
        status:        r.status,
        time:          now,
      });
      this._pub(`${base}/gate`, {
        reservoir_id: r.id,
        gatesOpen:    r.gatesOpen,
        gatesTotal:   r.gates,
        gateFlow_m3s: r.gateFlow,
        time:         now,
      });
    }

    // ── Alerts (BĐ1/BĐ2 violations) ──────────────────────────────────────
    const stations = Object.values(hydroState);
    const criticals = stations.filter(s => s.waterLevel > 0 && s.waterLevel >= s.alertLevel2);
    const warnings  = stations.filter(s => s.waterLevel > 0 && s.waterLevel >= s.alertLevel1 && s.waterLevel < s.alertLevel2);

    if (criticals.length > 0) {
      this._pub('hadiwa/alert/critical', {
        level:    'critical',
        count:    criticals.length,
        stations: criticals.map(s => ({ id: s.id, name: s.name, waterLevel: s.waterLevel, threshold: s.alertLevel2 })),
        time:     now,
      });
    }
    if (warnings.length > 0) {
      this._pub('hadiwa/alert/warning', {
        level:    'warning',
        count:    warnings.length,
        stations: warnings.map(s => ({ id: s.id, name: s.name, waterLevel: s.waterLevel, threshold: s.alertLevel1 })),
        time:     now,
      });
    }

    // ── System summary ───────────────────────────────────────────────────
    this._pub('hadiwa/system/status', {
      scenario:       this.hydro.getScenario(),
      total_stations: stations.length,
      online:         stations.filter(s => s.status === 'online').length,
      warning:        stations.filter(s => s.status === 'warning').length,
      offline:        stations.filter(s => s.status === 'offline').length,
      alerts_critical: criticals.length,
      alerts_warning:  warnings.length,
      clients_mqtt:   this._clients,
      time:           now,
    });
  }

  start() {
    return new Promise((resolve) => {
      this._tcpServer.listen(MQTT_PORT, () => {
        console.log(`[FLOOD-MQTT] ✅ MQTT Broker (TCP)  — port ${MQTT_PORT}`);

        // WebSocket bridge
        const httpServer = http.createServer();
        this._wsServer   = new ws.WebSocketServer({ server: httpServer });
        this._wsServer.on('connection', (socket) => {
          const duplex = ws.createWebSocketStream(socket);
          this._broker.handle(duplex);
        });
        httpServer.listen(WS_PORT, () => {
          console.log(`[FLOOD-MQTT] ✅ MQTT Broker (WS)   — port ${WS_PORT}`);
          console.log(`[FLOOD-MQTT]    Topics: hadiwa/station/+/waterLevel | hadiwa/alert/#`);

          // Start publishing
          this._timer = setInterval(() => this._publishAll(), PUB_INTERVAL);
          this._publishAll(); // immediate first publish
          resolve();
        });
      });
    });
  }

  stop() {
    if (this._timer) clearInterval(this._timer);
    this._broker.close();
    this._tcpServer.close();
    console.log('[FLOOD-MQTT] Stopped');
  }
}

// ── Standalone run ────────────────────────────────────────────────────────────
if (require.main === module) {
  const config           = require('../config/hadiwa-config.json');
  const HydroEngine      = require('../engines/hydro-engine');
  const ReservoirEngine  = require('../engines/reservoir-engine');
  const hydro            = new HydroEngine(config);
  const reservoir        = new ReservoirEngine(config);
  const publisher        = new HadiwaFloodMQTTPublisher(config, hydro, reservoir);

  publisher.start().catch(console.error);

  const interval = parseInt(process.env.SCADA_INTERVAL_MS || '5000');
  setInterval(() => { hydro.tick(); reservoir.tick(hydro.getState()); }, interval);
  process.on('SIGINT', () => { publisher.stop(); process.exit(0); });
}

module.exports = HadiwaFloodMQTTPublisher;
