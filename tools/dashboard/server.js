/**
 * Hadiwa IOC — Simulator Dashboard Server
 * Phục vụ dashboard UI và proxy WebSocket đến các simulator
 * Port: 8200
 */
'use strict';

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const path       = require('path');

const DASHBOARD_PORT = parseInt(process.env.DASHBOARD_PORT || '8200');
const HYDRO_PORT     = parseInt(process.env.HYDRO_HTTP_PORT || '7100');
const RESERVOIR_PORT = parseInt(process.env.RESERVOIR_SCADA_PORT || '7101');
const DATALOGGER_PORT = parseInt(process.env.RAINFALL_DATALOGGER_PORT || '7102');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname)));

// Proxy health checks để dashboard check service status
app.get('/proxy/health/:service', async (req, res) => {
  const portMap = { hydro: HYDRO_PORT, reservoir: RESERVOIR_PORT, datalogger: DATALOGGER_PORT };
  const port = portMap[req.params.service];
  if (!port) return res.status(404).json({ error: 'Unknown service' });
  try {
    const r = await fetch(`http://localhost:${port}/health`);
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(503).json({ status: 'offline', error: e.message });
  }
});

app.listen(DASHBOARD_PORT, () => {
  console.log(`[DASHBOARD] ✅ Hadiwa Simulator Dashboard — http://localhost:${DASHBOARD_PORT}`);
});
