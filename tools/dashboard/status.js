/**
 * Hadiwa IOC — Status Dashboard JS
 * Kết nối Admin Server, hiển thị live data theo các sections
 */
'use strict';

// Auto-detect API base: empty when at root, '/hadiwa-simulator' when behind nginx subfolder
const API = (() => {
  const p = window.location.pathname;
  return p.endsWith('/') ? p.slice(0, -1) : p.substring(0, p.lastIndexOf('/'));
})();
let _sse   = null;
let _timer = null;

const SCENARIO_LABELS = {
  normal:     'Bình thường',
  rain_watch: 'Theo dõi mưa',
  flood:      'Lũ lụt',
  storm:      'Bão',
  typhoon:    'Siêu bão',
  drought:    'Hạn hán',
};

// ── Helpers ───────────────────────────────────────────────────────
function fmtNum(v, dec = 1) { return v != null ? (+v).toFixed(dec) : '—'; }
function fmtTime(iso) {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
  catch { return iso.slice(11, 19); }
}

function statusClass(s) {
  if (!s) return 'status-offline';
  const l = s.toLowerCase();
  if (['running','open','stable'].includes(l)) return 'status-running';
  if (['idle','standby','closed','normal'].includes(l)) return 'status-idle';
  if (['fault','critical','alarm'].includes(l)) return 'status-fault';
  if (['warning','watch','partial'].includes(l)) return 'status-warning';
  if (l === 'offline') return 'status-offline';
  return 'status-idle';
}

function statusLabel(s) {
  const map = { running: 'Đang chạy', idle: 'Chờ', open: 'Đang mở', closed: 'Đóng', fault: 'Sự cố', warning: 'Cảnh báo', critical: 'Nguy hiểm', alarm: 'Báo động', watch: 'Theo dõi', offline: 'Ngoại tuyến', standby: 'Dự phòng', stable: 'Ổn định', normal: 'Bình thường', partial: 'Mở một phần' };
  return map[(s || '').toLowerCase()] || s || '—';
}

function progressBar(pct, alertPct = 80, dangerPct = 90) {
  const cls = pct >= dangerPct ? 'fill-red' : pct >= alertPct ? 'fill-amber' : 'fill-green';
  return `<div class="dc-progress">
    <div class="dc-progress-label"><span>Mức nước</span><span>${pct.toFixed(1)}%</span></div>
    <div class="dc-progress-bar"><div class="dc-progress-fill ${cls}" style="width:${Math.min(pct,100)}%"></div></div>
  </div>`;
}

function toast(msg, type = 'ok') {
  const c = document.getElementById('toastWrap');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

// ── Connection ─────────────────────────────────────────────────────
function setConn(ok) {
  document.querySelector('.conn-dot')?.classList.toggle('ok', ok);
  document.querySelector('.conn-dot')?.classList.toggle('err', !ok);
  document.getElementById('connLabel').textContent = ok ? 'Đã kết nối' : 'Mất kết nối';
}

function connectSSE() {
  if (_sse) _sse.close();
  _sse = new EventSource(`${API}/api/admin/stream`);
  _sse.addEventListener('connected', () => setConn(true));
  _sse.addEventListener('status', e => applyStatus(JSON.parse(e.data)));
  _sse.addEventListener('scenario', e => {
    const { scenario } = JSON.parse(e.data);
    updateScenarioUI(scenario);
    toast(`Kịch bản chuyển → ${SCENARIO_LABELS[scenario] || scenario}`, 'ok');
  });
  _sse.onerror = () => { setConn(false); setTimeout(connectSSE, 6000); };
}

// ── Fetch all data ─────────────────────────────────────────────────
async function fetchAll() {
  try {
    const [statusRes, pumpRes, floodRes, sluiceRes, weatherRes, landslideRes] = await Promise.allSettled([
      fetch(`${API}/api/admin/status`).then(r => r.json()),
      fetch(`${API}/api/sim/pump/stations`).then(r => r.json()),
      fetch(`${API}/api/sim/flood/sensors`).then(r => r.json()),
      fetch(`${API}/api/sim/sluice/sluices`).then(r => r.json()),
      fetch(`${API}/api/sim/weather/current`).then(r => r.json()),
      fetch(`${API}/api/sim/landslide/sensors`).then(r => r.json()),
    ]);

    if (statusRes.status === 'fulfilled') applyStatus(statusRes.value.data);
    if (pumpRes.status  === 'fulfilled') renderPumps(pumpRes.value.stations || pumpRes.value.data || []);
    if (floodRes.status === 'fulfilled') renderFloodSensors(floodRes.value.sensors || floodRes.value.data || []);
    if (sluiceRes.status === 'fulfilled') renderSluices(sluiceRes.value.sluices || sluiceRes.value.data || []);
    if (weatherRes.status === 'fulfilled') renderWeather(weatherRes.value.stations || weatherRes.value.data || []);
    if (landslideRes.status === 'fulfilled') renderLandslide(landslideRes.value.sensors || landslideRes.value.data || []);

    setConn(true);
  } catch (e) {
    setConn(false);
  }
}

// ── Apply status to service chips + KPI ───────────────────────────
function applyStatus(data) {
  if (!data) return;
  updateScenarioUI(data.scenario);

  const sum = data.summary || {};
  // KPI updates
  if (sum.pump) {
    document.getElementById('kpiPumpRunning').textContent = `${sum.pump.running}/${sum.pump.total}`;
    document.getElementById('kpiPumpFlow').textContent    = fmtNum(sum.pump.totalFlow_m3s);
  }
  if (sum.sluice) document.getElementById('kpiSluiceOpen').textContent = `${sum.sluice.open}/${sum.sluice.total}`;

  // Service chips
  const chips = { 'pump': 'svc-pump', 'sluice': 'svc-sluice', 'floodSensor': 'svc-flood', 'weather': 'svc-weather', 'landslide': 'svc-landslide', 'hydro': 'svc-hydro', 'reservoir': 'svc-reservoir' };
  Object.entries(chips).forEach(([, id]) => {
    const el = document.getElementById(id);
    if (el) { el.classList.add('ok'); }
  });
}

function updateScenarioUI(scenario) {
  const label = SCENARIO_LABELS[scenario] || scenario || '—';
  const badgeEl = document.getElementById('badge-scenario');
  if (badgeEl) badgeEl.textContent = label;
  const kpiEl = document.getElementById('kpiScenario');
  if (kpiEl) kpiEl.textContent = label;
}

// ── Render Pumps ──────────────────────────────────────────────────
function renderPumps(stations) {
  const el = document.getElementById('grid-pump');
  if (!stations.length) { el.innerHTML = '<div class="loading-card"><p>Chưa có dữ liệu trạm bơm.</p></div>'; return; }

  let running = 0;
  let totalFlow = 0;

  el.innerHTML = stations.map(s => {
    const st = s.status || 'idle';
    const isRunning = st === 'running';
    if (isRunning) running++;
    const flow = s.currentFlow_m3s || s.flow_m3s || 0;
    totalFlow += flow;
    const power = s.totalPower_kW || s.power_kW || 0;
    const pumpsRun = s.pumps_running || s.pumpsRunning || 0;
    const pumpsTotal = s.pumps_total || s.pumpsTotal || 3;
    const levelPct = s.upstreamLevel_pct || s.levelPct || 0;
    const cardClass = ['fault','critical','alarm'].includes(st.toLowerCase()) ? 'alert' : ['warning','watch'].includes(st.toLowerCase()) ? 'warn' : '';
    return `<div class="device-card ${cardClass}">
      <div class="dc-header">
        <div>
          <div class="dc-id">${s.station_id || s.id}</div>
          <div class="dc-name">${s.name}</div>
          <div class="dc-area">${s.district || s.area || ''}</div>
        </div>
        <span class="dc-status-badge ${statusClass(st)}">${statusLabel(st)}</span>
      </div>
      <div class="dc-metrics">
        <div class="dc-metric"><div class="dc-metric-label">Lưu lượng</div><div class="dc-metric-val ${flow>0?'green':''}">${fmtNum(flow)} m³/s</div></div>
        <div class="dc-metric"><div class="dc-metric-label">Tổ máy</div><div class="dc-metric-val">${pumpsRun}/${pumpsTotal}</div></div>
        <div class="dc-metric"><div class="dc-metric-label">Công suất</div><div class="dc-metric-val">${fmtNum(power,0)} kW</div></div>
        <div class="dc-metric"><div class="dc-metric-label">Cập nhật</div><div class="dc-metric-val" style="font-size:11px">${fmtTime(s.lastUpdated)}</div></div>
      </div>
      ${levelPct ? progressBar(levelPct) : ''}
    </div>`;
  }).join('');

  document.getElementById('kpiPumpRunning').textContent = `${running}/${stations.length}`;
  document.getElementById('kpiPumpFlow').textContent = fmtNum(totalFlow);
}

// ── Render Flood Sensors ──────────────────────────────────────────
function renderFloodSensors(sensors) {
  const el = document.getElementById('grid-flood');
  if (!sensors.length) { el.innerHTML = '<div class="loading-card"><p>Chưa có dữ liệu.</p></div>'; return; }

  let alerts = 0;
  el.innerHTML = sensors.map(s => {
    const st = s.status || 'stable';
    const isAlert = ['critical','alarm','warning','watch'].includes(st.toLowerCase());
    if (['critical','alarm'].includes(st.toLowerCase())) alerts++;
    const lvl = s.currentLevel_m || 0;
    const maxLvl = s.maxLevel_m || 3;
    const pct = Math.min((lvl / maxLvl) * 100, 100);
    return `<div class="device-card ${isAlert ? (st === 'critical' || st === 'alarm' ? 'alert' : 'warn') : ''}">
      <div class="dc-header">
        <div>
          <div class="dc-id">${s.sensor_id || s.id}</div>
          <div class="dc-name">${s.name}</div>
          <div class="dc-area">${s.district || ''}</div>
        </div>
        <span class="dc-status-badge ${statusClass(st)}">${statusLabel(st)}</span>
      </div>
      <div class="dc-metrics">
        <div class="dc-metric"><div class="dc-metric-label">Mực nước</div><div class="dc-metric-val ${pct>80?(pct>90?'red':'amber'):'green'}">${fmtNum(lvl)} m</div></div>
        <div class="dc-metric"><div class="dc-metric-label">Ngưỡng nguy</div><div class="dc-metric-val amber">${fmtNum(s.threshold_crit || s.thresholdCrit || 1.5)} m</div></div>
      </div>
      ${progressBar(pct, 70, 85)}
    </div>`;
  }).join('');

  document.getElementById('kpiFloodAlerts').textContent = alerts;
  const alertEl = document.getElementById('alert-flood');
  if (alertEl) { alertEl.textContent = `${alerts} cảnh báo`; alertEl.style.display = alerts > 0 ? '' : 'none'; }
}

// ── Render Sluices ────────────────────────────────────────────────
function renderSluices(sluices) {
  const el = document.getElementById('grid-sluice');
  if (!sluices.length) { el.innerHTML = '<div class="loading-card"><p>Chưa có dữ liệu.</p></div>'; return; }

  let openCount = 0;
  el.innerHTML = sluices.map(s => {
    const st = s.status || 'closed';
    if (st === 'open' || st === 'partial') openCount++;
    const openPct = s.openPct ?? s.open_pct ?? 0;
    const flow = s.currentFlow_m3s || 0;
    return `<div class="device-card">
      <div class="dc-header">
        <div>
          <div class="dc-id">${s.sluice_id || s.id}</div>
          <div class="dc-name">${s.name}</div>
          <div class="dc-area">${s.district || ''}</div>
        </div>
        <span class="dc-status-badge ${statusClass(st)}">${statusLabel(st)}</span>
      </div>
      <div class="dc-metrics">
        <div class="dc-metric"><div class="dc-metric-label">Độ mở van</div><div class="dc-metric-val ${openPct>50?'green':''}">${fmtNum(openPct, 0)}%</div></div>
        <div class="dc-metric"><div class="dc-metric-label">Lưu lượng</div><div class="dc-metric-val">${fmtNum(flow)} m³/s</div></div>
      </div>
    </div>`;
  }).join('');

  document.getElementById('kpiSluiceOpen').textContent = `${openCount}/${sluices.length}`;
}

// ── Render Weather ─────────────────────────────────────────────────
function renderWeather(stations) {
  const el = document.getElementById('grid-weather');
  if (!stations.length) { el.innerHTML = '<div class="loading-card"><p>Chưa có dữ liệu.</p></div>'; return; }

  el.innerHTML = stations.map(s => {
    const rain = s.rainfall_mm_h || s.rainfallIntensity_mm_h || 0;
    const temp = s.temperature_C || s.temp_C || 0;
    const humidity = s.humidity_pct || 0;
    const wind = s.windSpeed_kmh || 0;
    const st = s.weatherCode || s.status || 'clear';
    return `<div class="device-card">
      <div class="dc-header">
        <div>
          <div class="dc-id">${s.station_id || s.id}</div>
          <div class="dc-name">${s.name}</div>
          <div class="dc-area">${s.district || ''}</div>
        </div>
        <span class="dc-status-badge ${rain > 50 ? 'status-warning' : 'status-idle'}">${rain > 50 ? 'Mưa lớn' : rain > 10 ? 'Có mưa' : 'Khô ráo'}</span>
      </div>
      <div class="dc-metrics">
        <div class="dc-metric"><div class="dc-metric-label">Nhiệt độ</div><div class="dc-metric-val">${fmtNum(temp, 1)}°C</div></div>
        <div class="dc-metric"><div class="dc-metric-label">Lượng mưa</div><div class="dc-metric-val ${rain>50?'amber':''}">${fmtNum(rain)} mm/h</div></div>
        <div class="dc-metric"><div class="dc-metric-label">Độ ẩm</div><div class="dc-metric-val">${fmtNum(humidity, 0)}%</div></div>
        <div class="dc-metric"><div class="dc-metric-label">Gió</div><div class="dc-metric-val">${fmtNum(wind, 0)} km/h</div></div>
      </div>
    </div>`;
  }).join('');
}

// ── Render Landslide ──────────────────────────────────────────────
function renderLandslide(sensors) {
  const el = document.getElementById('grid-landslide');
  if (!sensors.length) { el.innerHTML = '<div class="loading-card"><p>Chưa có dữ liệu.</p></div>'; return; }

  let alerts = 0;
  el.innerHTML = sensors.map(s => {
    const st = s.status || 'stable';
    const disp = s.totalDisplacement_mm || s.displacement_mm || 0;
    const tilt = s.tiltAngle_deg || s.tilt_deg || 0;
    const isAlert = ['critical','alarm','warning'].includes(st.toLowerCase());
    if (['critical','alarm'].includes(st.toLowerCase())) alerts++;
    return `<div class="device-card ${isAlert ? (st==='critical'||st==='alarm'?'alert':'warn') : ''}">
      <div class="dc-header">
        <div>
          <div class="dc-id">${s.sensor_id || s.id}</div>
          <div class="dc-name">${s.name}</div>
          <div class="dc-area">${s.lat ? `${s.lat}, ${s.lng}` : ''}</div>
        </div>
        <span class="dc-status-badge ${statusClass(st)}">${statusLabel(st)}</span>
      </div>
      <div class="dc-metrics">
        <div class="dc-metric"><div class="dc-metric-label">Chuyển vị</div><div class="dc-metric-val ${disp>10?'red':disp>5?'amber':''}">${fmtNum(disp)} mm</div></div>
        <div class="dc-metric"><div class="dc-metric-label">Góc nghiêng</div><div class="dc-metric-val ${tilt>3?'red':tilt>1?'amber':''}">${fmtNum(tilt, 2)}°</div></div>
      </div>
    </div>`;
  }).join('');

  document.getElementById('kpiLandslideAlerts').textContent = alerts;
  const alertEl = document.getElementById('alert-landslide');
  if (alertEl) { alertEl.textContent = `${alerts} cảnh báo`; alertEl.style.display = alerts > 0 ? '' : 'none'; }
}

// ── Init ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Clock
  setInterval(() => {
    document.getElementById('timePill').textContent = new Date().toLocaleTimeString('vi-VN');
  }, 1000);

  // Initial load
  fetchAll();

  // Auto refresh every 5s
  _timer = setInterval(fetchAll, 5000);

  // SSE for instant scenario change
  connectSSE();
});
