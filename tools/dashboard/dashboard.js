/**
 * Hadiwa IOC — Simulator Dashboard JS
 * Polls the 3 HTTP simulators (Hydro :7100, Reservoir :7101, Datalogger :7102)
 * and renders live station cards, reservoir status, and alert log.
 */
'use strict';

// Auto-detect base path (works local and behind nginx subfolder)
const _BASE = (() => {
  const p = window.location.pathname;
  return p.endsWith('/') ? p.slice(0, -1) : p.substring(0, p.lastIndexOf('/'));
})();
const BASE_HYDRO      = `${_BASE}/api/sim/hydro`;
const BASE_RESERVOIR  = `${_BASE}/api/sim/reservoir`;
const BASE_DATALOGGER = `${_BASE}/api/sim/datalogger`;

let _startTime  = Date.now();
let _alertsData = [];

// ── Helpers ────────────────────────────────────────────────────────────────
async function apiGet(url) {
  try {
    const r = await fetch(url);
    return await r.json();
  } catch { return null; }
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3200);
}

function updateUptime() {
  const s = Math.round((Date.now() - _startTime) / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  const el = document.getElementById('uptimeValue');
  if (el) el.textContent = `${h}:${m}:${sec}`;
}

// ── Service Status ─────────────────────────────────────────────────────────
async function checkServices() {
  const services = [
    { id: 'hydro',      url: `${BASE_HYDRO}/health`,      chip: 'svc-hydro',      badge: 'badge-hydro' },
    { id: 'reservoir',  url: `${BASE_RESERVOIR}/health`,  chip: 'svc-reservoir',  badge: 'badge-reservoir' },
    { id: 'datalogger', url: `${BASE_DATALOGGER}/health`, chip: 'svc-datalogger', badge: 'badge-datalogger' },
  ];
  for (const svc of services) {
    const data = await apiGet(svc.url);
    const chip  = document.getElementById(svc.chip);
    const badge = document.getElementById(svc.badge);
    if (data && data.status === 'ok') {
      if (chip)  chip.className  = 'service-chip online';
      if (badge) { badge.textContent = 'Online'; badge.className = 'svc-badge'; }
    } else {
      if (chip)  chip.className  = 'service-chip offline';
      if (badge) { badge.textContent = 'Offline'; badge.className = 'svc-badge offline'; }
    }
  }
  // MQTT has no HTTP health but show as online if hydro is up
  const mqttBadge = document.getElementById('badge-mqtt');
  const hydroUp   = document.getElementById('svc-hydro')?.classList.contains('online');
  if (mqttBadge) { mqttBadge.textContent = hydroUp ? 'Online' : 'Offline'; mqttBadge.className = hydroUp ? 'svc-badge' : 'svc-badge offline'; }
  const mqttChip  = document.getElementById('svc-mqtt');
  if (mqttChip) mqttChip.className = hydroUp ? 'service-chip online' : 'service-chip offline';
}

// ── KPIs ───────────────────────────────────────────────────────────────────
async function loadKpis(summary, rsvSummary, rfSummary) {
  const grid = document.getElementById('kpiGrid');
  if (!grid) return;

  const online  = summary?.online  ?? '—';
  const warning = summary?.warning ?? '—';
  const offline = summary?.offline ?? '—';
  const maxRf   = rfSummary?.max_rainfall?.value_mm ?? '—';
  const releasing = rsvSummary?.releasing ?? '—';

  const kpis = [
    { val: online,    lbl: 'Trạm Online',    color: 'var(--green)' },
    { val: warning,   lbl: 'Đang cảnh báo',  color: 'var(--yellow)' },
    { val: offline,   lbl: 'Trạm Offline',   color: 'var(--red)' },
    { val: maxRf !== '—' ? maxRf + ' mm' : '—', lbl: 'Mưa lớn nhất/24h', color: 'var(--yellow)' },
    { val: releasing, lbl: 'Hồ đang xả lũ', color: 'var(--cyan)' },
  ];

  grid.innerHTML = kpis.map(k => `
    <div class="kpi-card">
      <div class="kpi-val" style="color:${k.color}">${k.val}</div>
      <div class="kpi-lbl">${k.lbl}</div>
    </div>`).join('');
}

// ── Stations ───────────────────────────────────────────────────────────────
function alertLabel(al) {
  return { normal: 'Bình thường', warning: '⚠ Vượt BĐ1', high: '🔴 Vượt BĐ2', critical: '🚨 Vượt BĐ3!' }[al] || al;
}

function renderStationCards(stations) {
  const grid = document.getElementById('stationsGrid');
  if (!grid) return;
  if (!stations || stations.length === 0) {
    grid.innerHTML = '<div class="loading-card"><span style="color:var(--red)">⚠ Không kết nối được Hydro HTTP Simulator (:7100)</span></div>';
    return;
  }

  grid.innerHTML = stations.map(s => {
    const al      = s.alertLevel || 'normal';
    const wl      = s.waterLevel_m;
    const rf      = s.rainfall_mm;
    const al2     = s.alertLevel2_m;
    const pct     = al2 && wl > 0 ? Math.min(110, Math.round(wl / al2 * 100)) : 0;
    const barColor = al === 'critical' ? 'var(--red)' : al === 'high' ? 'var(--orange)' : al === 'warning' ? 'var(--yellow)' : 'var(--green)';
    const metricColor = al === 'critical' ? 'var(--red)' : al === 'high' ? 'var(--orange)' : al === 'warning' ? 'var(--yellow)' : 'var(--cyan)';
    const typeIcon = { hydro: '〰', rain: '☔', reservoir: '▣' }[s.type] || '◈';

    return `
      <div class="station-card ${s.status === 'warning' ? 'warning' : al === 'critical' || al === 'high' ? 'critical' : s.status === 'offline' ? 'offline' : ''}">
        <div class="sc-header">
          <div>
            <div class="sc-id">${typeIcon} ${s.station_id}</div>
            <div class="sc-name">${s.station_name.replace('Trạm ', '')}</div>
            <div class="sc-river">${s.river || s.district}</div>
          </div>
          <div class="sc-status-dot ${s.status}"></div>
        </div>
        <div class="sc-metrics">
          ${wl > 0 ? `
          <div>
            <div class="sc-metric-lbl">Mực nước</div>
            <div><span class="sc-metric-val" style="color:${metricColor}">${wl.toFixed(2)}</span><span class="sc-metric-unit">m</span></div>
          </div>` : `
          <div>
            <div class="sc-metric-lbl">Lượng mưa</div>
            <div><span class="sc-metric-val" style="color:var(--yellow)">${rf.toFixed(0)}</span><span class="sc-metric-unit">mm</span></div>
          </div>`}
          <div>
            <div class="sc-metric-lbl">Mưa/24h</div>
            <div><span class="sc-metric-val" style="color:${rf >= 50 ? 'var(--yellow)' : 'var(--text-2)'}">${rf.toFixed(0)}</span><span class="sc-metric-unit">mm</span></div>
          </div>
        </div>
        ${wl > 0 && al2 ? `
        <div>
          <div class="sc-bar-labels"><span>MN hiện tại</span><span>${pct}% BĐ2</span></div>
          <div class="sc-bar"><div class="sc-bar-fill" style="width:${Math.min(100,pct)}%;background:${barColor}"></div></div>
        </div>` : ''}
        <div><span class="sc-alert-badge ${al}">${alertLabel(al)}</span></div>
      </div>`;
  }).join('');
}

// ── Reservoirs ─────────────────────────────────────────────────────────────
function renderReservoirs(reservoirs) {
  const grid = document.getElementById('reservoirGrid');
  if (!grid) return;
  if (!reservoirs || reservoirs.length === 0) {
    grid.innerHTML = '<div class="loading-card"><span style="color:var(--red)">⚠ Không kết nối được Reservoir SCADA (:7101)</span></div>';
    return;
  }

  const statusLabel = { ok: 'Bình thường', warning: 'Cảnh báo', danger: 'Nguy hiểm', critical: 'Khẩn cấp', releasing: 'Đang xả lũ' };
  const fillColors  = { ok: 'var(--green)', warning: 'var(--yellow)', danger: 'var(--orange)', critical: 'var(--red)', releasing: 'var(--cyan)' };

  grid.innerHTML = reservoirs.map(r => {
    const pct   = r.capacityPct;
    const fc    = fillColors[r.status] || 'var(--green)';
    return `
      <div class="rsv-card ${r.status}">
        <div class="rsv-header">
          <div>
            <div class="rsv-name">${r.name}</div>
            <div class="rsv-dist">${r.district}</div>
          </div>
          <span class="rsv-status-pill ${r.status}">${statusLabel[r.status] || r.status}</span>
        </div>
        <div class="rsv-capacity-label">
          <span>Dung tích</span>
          <span style="color:${fc};font-weight:700">${r.currentLevel_m?.toFixed(2)}m / ${r.designLevel_m}m (${pct}%)</span>
        </div>
        <div class="rsv-capacity-bar"><div class="rsv-capacity-fill" style="width:${Math.min(100,pct)}%;background:${fc}"></div></div>
        <div class="rsv-stats">
          <div class="rsv-stat-box">
            <div class="rsv-stat-lbl">Cổng xả</div>
            <div class="rsv-stat-val" style="color:${r.gatesOpen > 0 ? 'var(--orange)' : 'var(--green)'}">${r.gatesOpen}/${r.gates}</div>
            <div class="rsv-stat-unit">${r.gatesOpen > 0 ? r.gateFlow_m3s?.toFixed(0) + ' m³/s' : 'Đóng'}</div>
          </div>
          <div class="rsv-stat-box">
            <div class="rsv-stat-lbl">Vào/Ra</div>
            <div class="rsv-stat-val" style="color:${r.inflowQ_m3s > r.outflowQ_m3s ? 'var(--yellow)' : 'var(--green)'}">${r.inflowQ_m3s?.toFixed(0)}</div>
            <div class="rsv-stat-unit">m³/s vào</div>
          </div>
          <div class="rsv-stat-box">
            <div class="rsv-stat-lbl">BĐ2</div>
            <div class="rsv-stat-val" style="color:var(--muted)">${r.warnL2_m}m</div>
            <div class="rsv-stat-unit">ngưỡng</div>
          </div>
        </div>
        <button class="rsv-gate-btn" onclick="controlGate('${r.reservoir_id}', ${r.gatesOpen > 0 ? "'close'" : "'open'"})">
          ${r.gatesOpen > 0 ? '🔒 Đóng cổng van' : '🔓 Mở cổng xả'}
        </button>
      </div>`;
  }).join('');
}

// ── Gate Control ───────────────────────────────────────────────────────────
async function controlGate(reservoirId, action) {
  toast(`⏳ Đang gửi lệnh ${action === 'open' ? 'mở' : 'đóng'} cổng van ${reservoirId}…`);
  const res = await fetch(`${BASE_RESERVOIR}/api/reservoir/${reservoirId}/gate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, operator: 'Dashboard User' }),
  }).catch(() => null);
  if (!res || !res.ok) { toast('❌ Lỗi kết nối Reservoir SCADA'); return; }
  const data = await res.json();
  if (data.success) {
    toast(`✅ ${reservoirId}: ${data.action} — ${data.after?.gatesOpen || 0} cổng đang mở`);
    await loadReservoirs();
  }
}

// ── Alerts ─────────────────────────────────────────────────────────────────
async function loadAlerts() {
  const data = await apiGet(`${BASE_HYDRO}/api/alerts`);
  const log  = document.getElementById('alertLog');
  if (!log) return;

  if (!data || !data.data || data.data.length === 0) {
    log.innerHTML = '<div class="log-placeholder">✅ Không có cảnh báo — Tất cả trong ngưỡng bình thường</div>';
    return;
  }

  _alertsData = data.data;
  log.innerHTML = data.data.map(a => `
    <div class="alert-item">
      <div class="alert-dot ${a.alertLevel}"></div>
      <div class="alert-msg">
        <span style="font-weight:600">${a.station_name}</span> — ${a.river || '—'}
        <div style="font-size:10px;color:var(--muted);margin-top:2px">MN ${a.waterLevel?.toFixed(2)} m | BĐ1: ${a.alertLevel1} m | Xu hướng: ${a.trend} m/h</div>
      </div>
      <span class="alert-level-badge ${a.alertLevel}">${alertLabel(a.alertLevel)}</span>
    </div>`).join('');
}

// ── Scenario ───────────────────────────────────────────────────────────────
async function setScenario(scenario) {
  const labels = { normal: 'Bình thường', flood: 'Lũ lớn sông Hồng', storm: 'Bão / Áp thấp', drought: 'Hạn hán', emergency: 'Khẩn cấp' };
  toast(`⏳ Đang kích hoạt kịch bản: ${labels[scenario]}…`);

  const [h, r] = await Promise.all([
    fetch(`${BASE_HYDRO}/api/scenario`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scenario }) }).catch(() => null),
    fetch(`${BASE_RESERVOIR}/api/scenario`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scenario }) }).catch(() => null),
  ]);

  // Update active button
  document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`btn-${scenario}`)?.classList.add('active');

  // Update header badge
  const badge = document.getElementById('scenarioLabel');
  if (badge) badge.textContent = labels[scenario];

  // Show result
  const resultEl = document.getElementById('scenarioResult');
  if (resultEl) {
    const color = { normal: 'var(--green)', flood: 'var(--cyan)', storm: 'var(--purple)', drought: 'var(--yellow)', emergency: 'var(--red)' }[scenario];
    resultEl.style.display = 'block';
    resultEl.style.borderColor = color + '33';
    resultEl.style.background  = color + '09';
    resultEl.style.color       = color;
    resultEl.textContent = `✅ Đã kích hoạt kịch bản "${labels[scenario]}" — Dữ liệu sẽ cập nhật ở chu kỳ tiếp theo (5s)`;
  }

  toast(`✅ Kịch bản "${labels[scenario]}" đã được kích hoạt!`);
  setTimeout(() => loadAll(), 1500);
}

// ── Main Load Loops ────────────────────────────────────────────────────────
async function loadStations() {
  const data = await apiGet(`${BASE_HYDRO}/api/stations`);
  renderStationCards(data?.data || null);
  return data;
}

async function loadReservoirs() {
  const data = await apiGet(`${BASE_RESERVOIR}/api/reservoirs`);
  renderReservoirs(data?.data || null);
  return data;
}

async function loadAll() {
  const [stData, rsvData, rfData] = await Promise.all([
    apiGet(`${BASE_HYDRO}/api/stations`),
    apiGet(`${BASE_RESERVOIR}/api/reservoirs`),
    apiGet(`${BASE_DATALOGGER}/api/rainfall/summary`),
  ]);

  renderStationCards(stData?.data || null);
  renderReservoirs(rsvData?.data || null);
  await loadKpis(stData, await apiGet(`${BASE_RESERVOIR}/api/summary`), rfData);
  await loadAlerts();

  const lastEl = document.getElementById('lastRefreshTime');
  if (lastEl) lastEl.textContent = 'Cập nhật: ' + new Date().toLocaleTimeString('vi-VN');
}

// ── Init ───────────────────────────────────────────────────────────────────
(async function init() {
  await loadAll();
  await checkServices();

  // Auto-refresh every 5s
  setInterval(() => loadAll(), 5000);
  setInterval(() => checkServices(), 15000);
  setInterval(() => updateUptime(), 1000);
})();
