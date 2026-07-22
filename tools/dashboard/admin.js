/**
 * Hadiwa IOC — Admin Dashboard JavaScript v2.0.0
 * Kết nối tới Admin Server tại port 7200 qua REST + SSE
 */
'use strict';

const API   = (() => {
  const p = window.location.pathname;
  return p.endsWith('/') ? p.slice(0, -1) : p.substring(0, p.lastIndexOf('/'));
})();
let   _currentPanel   = 'status';
let   _currentScenario= 'normal';
let   _sseSource      = null;
let   _modalType      = null;
let   _modalEditId    = null;
let   _deviceDataCache = {};

// ── Panel navigation ──────────────────────────────────────────────
function showPanel(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + name)?.classList.add('active');
  document.querySelector(`.nav-btn[data-panel="${name}"]`)?.classList.add('active');
  _currentPanel = name;

  const titles = { status: 'Tổng quan hệ thống', scenario: 'Kịch bản giả lập', devices: 'Quản lý thiết bị', manual: 'Điều khiển thủ công', mode: 'Chế độ Auto / Manual' };
  document.getElementById('panelTitle').textContent = titles[name] || name;

  if (name === 'status')   loadStatus();
  if (name === 'scenario') loadScenarios();
  if (name === 'devices')  loadDevices();
  if (name === 'manual')   loadManualSelects();
  if (name === 'mode')     loadModes();
}

function refreshAll() { showPanel(_currentPanel); }

// ── SSE Connection ────────────────────────────────────────────────
function connectSSE() {
  if (_sseSource) _sseSource.close();
  _sseSource = new EventSource(`${API}/api/admin/stream`);

  _sseSource.addEventListener('connected', () => setConn(true));
  _sseSource.addEventListener('status', e => {
    const data = JSON.parse(e.data);
    if (_currentPanel === 'status') renderStatus(data);
    _currentScenario = data.scenario;
    updateScenarioBadge(data.scenario);
  });
  _sseSource.addEventListener('scenario', e => {
    const { scenario } = JSON.parse(e.data);
    _currentScenario = scenario;
    updateScenarioBadge(scenario);
    if (_currentPanel === 'scenario') loadScenarios();
    toast(`Kịch bản → ${scenario}`, 'info');
  });
  _sseSource.addEventListener('mode', e => {
    const { type, mode } = JSON.parse(e.data);
    toast(`${type} mode → ${mode}`, 'info');
    if (_currentPanel === 'mode') loadModes();
  });
  _sseSource.onerror = () => {
    setConn(false);
    setTimeout(connectSSE, 5000);
  };
}

function setConn(ok) {
  const dot   = document.querySelector('.conn-dot');
  const label = document.getElementById('connLabel');
  dot.className  = 'conn-dot ' + (ok ? 'ok' : 'err');
  label.textContent = ok ? 'Đã kết nối' : 'Mất kết nối';
}

function updateScenarioBadge(sc) {
  const el = document.getElementById('currentScenarioBadge');
  if (el) el.textContent = sc || '—';
}

// ── STATUS ────────────────────────────────────────────────────────
async function loadStatus() {
  try {
    const res  = await fetch(`${API}/api/admin/status`);
    const json = await res.json();
    renderStatus(json.data);
  } catch {
    document.getElementById('kpiGrid').innerHTML = '<div class="kpi-loading" style="color:#ff5252">Không kết nối được Admin Server. Hãy chạy node index.js trong thư mục tools/</div>';
    setConn(false);
  }
}

function renderStatus(data) {
  if (!data) return;
  setConn(true);
  _currentScenario = data.scenario || 'normal';
  updateScenarioBadge(_currentScenario);

  const { summary = {}, services = {} } = data;

  // KPI Cards
  const kpis = [
    { label: 'Kịch bản HT', value: _currentScenario.toUpperCase(), sub: 'Scenario', cls: 'ok' },
    { label: 'Trạm bơm chạy', value: summary.pump?.running ?? '—', sub: `/ ${summary.pump?.total ?? '—'} trạm`, cls: summary.pump?.offline > 0 ? 'warn' : 'ok' },
    { label: 'Lưu lượng bơm', value: summary.pump?.totalFlow_m3s ?? '—', sub: 'm³/s tổng', cls: 'primary' },
    { label: 'Cống đang mở', value: summary.sluice?.open ?? '—', sub: `/ ${summary.sluice?.total ?? '—'} cống`, cls: '' },
    { label: 'Lưu lượng cống', value: summary.sluice?.totalFlow_m3s ?? '—', sub: 'm³/s qua cống', cls: 'primary' },
    { label: 'Trạm bơm Offline', value: summary.pump?.offline ?? '—', sub: 'cần xử lý', cls: summary.pump?.offline > 0 ? 'danger' : 'ok' },
  ];

  document.getElementById('kpiGrid').innerHTML = kpis.map(k => `
    <div class="kpi-card">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value ${k.cls}">${k.value}</div>
      <div class="kpi-sub">${k.sub}</div>
    </div>`).join('');

  // Services
  document.getElementById('servicesGrid').innerHTML = Object.entries(services).map(([key, svc]) => `
    <div class="service-card">
      <div class="svc-dot running"></div>
      <div>
        <div class="svc-name">${key}</div>
        <div class="svc-desc">${svc.desc}</div>
      </div>
      <div class="svc-port">:${svc.port}</div>
    </div>`).join('');

  // Update time badge
  document.getElementById('timeBadge').textContent = new Date().toLocaleTimeString('vi-VN');
}

// ── SCENARIOS ─────────────────────────────────────────────────────
const SCENARIO_COLORS = {
  normal:     '#00e676', rain_watch: '#00c8ff', flood: '#ffca28',
  storm:      '#ff9500', typhoon:    '#ff3d57', drought: '#ff9500',
};

async function loadScenarios() {
  try {
    const res  = await fetch(`${API}/api/admin/scenario`);
    const json = await res.json();
    _currentScenario = json.current;
    updateScenarioBadge(json.current);
    renderScenarios(json.scenarios, json.current);
  } catch {
    document.getElementById('scenarioGrid').innerHTML = '<div style="color:#ff5252">Không tải được danh sách kịch bản.</div>';
  }
}

function renderScenarios(scenarios, current) {
  document.getElementById('scenarioGrid').innerHTML = Object.entries(scenarios).map(([key, sc]) => {
    const color    = SCENARIO_COLORS[key] || '#00d2ff';
    const isActive = key === current;
    return `
      <div class="scenario-card ${isActive ? 'active' : ''}" style="--s-color:${color}">
        ${isActive ? '<span class="scenario-active-badge">Đang chạy</span>' : ''}
        <h3>${sc.label}</h3>
        <p>${sc.description}</p>
        <button class="scenario-apply-btn" onclick="applyScenario('${key}')" ${isActive ? 'disabled' : ''}>
          ${isActive ? '✓ Đang áp dụng' : '▶ Áp dụng kịch bản này'}
        </button>
      </div>`;
  }).join('');
}

async function applyScenario(scenario) {
  try {
    const res  = await fetch(`${API}/api/admin/scenario`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scenario }) });
    const json = await res.json();
    if (json.success) {
      _currentScenario = scenario;
      loadScenarios();
      const resEl = document.getElementById('scenarioResult');
      resEl.style.display = 'block';
      resEl.textContent = `✅ Đã áp dụng kịch bản "${scenario}" cho toàn bộ hệ thống (${new Date().toLocaleTimeString('vi-VN')})`;
      toast(`Kịch bản → ${scenario}`, 'success');
    } else {
      toast(`Lỗi: ${json.error}`, 'error');
    }
  } catch (e) {
    toast('Lỗi kết nối admin server', 'error');
  }
}

// ── DEVICES ───────────────────────────────────────────────────────
const DEVICE_COLS = {
  pump:        { id: 'station_id', name: 'name', area: 'district', status: 'status' },
  sluice:      { id: 'sluice_id',  name: 'name', area: 'district', status: 'status' },
  floodSensor: { id: 'sensor_id',  name: 'name', area: 'district', status: 'status' },
  landslide:   { id: 'sensor_id',  name: 'name', area: 'lat',    status: 'status' },
  weather:     { id: 'station_id', name: 'name', area: 'district', status: 'weatherCode' },
};

async function loadDevices() {
  const type = document.getElementById('deviceType').value;
  document.getElementById('deviceTableBody').innerHTML = '<tr><td colspan="5" class="tbl-loading">Đang tải...</td></tr>';
  try {
    const res  = await fetch(`${API}/api/admin/devices/${type}`);
    const json = await res.json();
    _deviceDataCache[type] = json.data || [];
    renderDeviceTable(type, json.data || []);
  } catch {
    document.getElementById('deviceTableBody').innerHTML = '<tr><td colspan="5" class="tbl-loading" style="color:#ff5252">Không tải được dữ liệu.</td></tr>';
  }
}

function renderDeviceTable(type, data) {
  const cols = DEVICE_COLS[type] || DEVICE_COLS.pump;
  const html = data.map(d => {
    const statusBadge = `<span class="badge badge-${(d[cols.status] || '').toLowerCase()}">${d[cols.status] || '—'}</span>`;
    return `<tr>
      <td><code style="font-size:11px;color:#00d2ff">${d[cols.id] || '—'}</code></td>
      <td>${d[cols.name] || '—'}</td>
      <td style="color:#8899aa">${d[cols.area] || '—'}</td>
      <td>${statusBadge}</td>
      <td style="display:flex;gap:6px">
        <button class="btn-sm" onclick="openEditDevice('${type}','${d[cols.id]}')">Sửa</button>
        <button class="btn-sm del" onclick="deleteDevice('${type}','${d[cols.id]}')">Xoá</button>
      </td>
    </tr>`;
  }).join('');
  document.getElementById('deviceTableBody').innerHTML = html || '<tr><td colspan="5" class="tbl-loading">Không có dữ liệu.</td></tr>';
}

function openAddDevice() {
  _modalType   = document.getElementById('deviceType').value;
  _modalEditId = null;
  document.getElementById('modalTitle').textContent = 'Thêm thiết bị mới';
  document.getElementById('modalSaveBtn').textContent = 'Tạo mới';
  document.getElementById('deviceForm').innerHTML = buildForm(_modalType, null);
  document.getElementById('deviceModal').style.display = 'flex';
}

function openEditDevice(type, id) {
  const cache = _deviceDataCache[type] || [];
  const cols  = DEVICE_COLS[type] || DEVICE_COLS.pump;
  const item  = cache.find(d => d[cols.id] === id);
  _modalType   = type;
  _modalEditId = id;
  document.getElementById('modalTitle').textContent = `Sửa thiết bị — ${id}`;
  document.getElementById('modalSaveBtn').textContent = 'Cập nhật';
  document.getElementById('deviceForm').innerHTML = buildForm(type, item);
  document.getElementById('deviceModal').style.display = 'flex';
}

function buildForm(type, data) {
  const fields = {
    pump:        [['id','ID'],['name','Tên trạm'],['district','Quận/huyện'],['river','Sông/kênh'],['lat','Latitude'],['lng','Longitude'],['pumps_total','Tổng tổ máy'],['designFlow_m3s','Lưu lượng TK (m³/s)'],['alertThresholdH_m','Ngưỡng cảnh báo H (m)']],
    sluice:      [['id','ID'],['name','Tên cống'],['district','Khu vực'],['river','Sông/kênh'],['lat','Latitude'],['lng','Longitude'],['gates_total','Tổng cửa van'],['maxFlow_m3s','Lưu lượng tối đa (m³/s)'],['controlType','Kiểu điều khiển']],
    floodSensor: [['id','ID'],['name','Tên cảm biến'],['district','Khu vực'],['lat','Latitude'],['lng','Longitude'],['type','Loại (ultrasonic/radar/pressure)'],['maxLevel_m','Độ sâu tối đa (m)'],['threshold_warn','Ngưỡng cảnh báo (m)'],['threshold_crit','Ngưỡng nguy hiểm (m)']],
    landslide:   [['id','ID'],['name','Tên cảm biến'],['lat','Latitude'],['lng','Longitude'],['type','Loại (tilt_inclinometer/extensometer)'],['baseDisplacement_mm','Chuyển vị ban đầu (mm)']],
    weather:     [['id','ID'],['name','Tên trạm'],['district','Khu vực'],['lat','Latitude'],['lng','Longitude'],['baseTemp_C','Nhiệt độ cơ sở (°C)'],['baseHumidity_pct','Độ ẩm cơ sở (%)']],
  };
  const flds = fields[type] || fields.pump;
  return flds.map(([key, lbl]) => `
    <div class="form-row">
      <label>${lbl}</label>
      <input class="inp" name="${key}" placeholder="${lbl}" value="${data ? (data[key] ?? '') : ''}" style="width:100%">
    </div>`).join('');
}

async function saveDevice() {
  const form    = document.getElementById('deviceForm');
  const inputs  = form.querySelectorAll('input[name]');
  const payload = {};
  inputs.forEach(inp => {
    const v = inp.value.trim();
    if (v !== '') payload[inp.name] = isNaN(v) ? v : parseFloat(v);
  });

  const method = _modalEditId ? 'PUT' : 'POST';
  const url    = _modalEditId
    ? `${API}/api/admin/devices/${_modalType}/${_modalEditId}`
    : `${API}/api/admin/devices/${_modalType}`;

  try {
    const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const json = await res.json();
    if (json.success) {
      toast(_modalEditId ? 'Đã cập nhật thiết bị' : 'Đã thêm thiết bị mới', 'success');
      closeModal();
      loadDevices();
    } else {
      toast(`Lỗi: ${json.error}`, 'error');
    }
  } catch {
    toast('Lỗi kết nối', 'error');
  }
}

async function deleteDevice(type, id) {
  if (!confirm(`Xoá thiết bị "${id}" khỏi loại "${type}"?\nHành động này sẽ xoá khỏi data file.`)) return;
  try {
    const res  = await fetch(`${API}/api/admin/devices/${type}/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) { toast(`Đã xoá ${id}`, 'success'); loadDevices(); }
    else toast(`Lỗi: ${json.error}`, 'error');
  } catch { toast('Lỗi kết nối', 'error'); }
}

function closeModal() { document.getElementById('deviceModal').style.display = 'none'; }

// ── MANUAL CONTROL ────────────────────────────────────────────────
async function loadManualSelects() {
  try {
    // Pump
    const pRes  = await fetch(`${API}/api/admin/devices/pump`);
    const pJson = await pRes.json();
    const pSel  = document.getElementById('pumpCtrlId');
    pSel.innerHTML = (pJson.data || []).map(s => `<option value="${s.station_id}">${s.station_id} — ${s.name}</option>`).join('');

    // Sluice
    const sRes  = await fetch(`${API}/api/admin/devices/sluice`);
    const sJson = await sRes.json();
    const sSel  = document.getElementById('sluiceCtrlId');
    sSel.innerHTML = (sJson.data || []).map(s => `<option value="${s.sluice_id}">${s.sluice_id} — ${s.name}</option>`).join('');

    loadOverrideIds();
  } catch {}
}

async function loadOverrideIds() {
  const type = document.getElementById('overrideType').value;
  try {
    const res  = await fetch(`${API}/api/admin/devices/${type}`);
    const json = await res.json();
    const cols = DEVICE_COLS[type] || DEVICE_COLS.pump;
    const sel  = document.getElementById('overrideId');
    sel.innerHTML = (json.data || []).map(d => `<option value="${d[cols.id]}">${d[cols.id]} — ${d[cols.name] || ''}</option>`).join('');
  } catch {}
}

async function controlDevice(type) {
  const id     = document.getElementById('pumpCtrlId').value;
  const action = document.getElementById('pumpCtrlAction').value;
  if (!id) return;
  try {
    const res  = await fetch(`${API}/api/admin/control/${type}/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, operator: 'ADMIN_DASHBOARD' }) });
    const json = await res.json();
    const el = document.getElementById('pumpCtrlResult');
    el.textContent = json.success ? `✅ ${action} → ${id} | Trạng thái: ${json.state?.status || 'OK'}` : `❌ ${json.error}`;
    el.style.color = json.success ? '#00e676' : '#ff5252';
    toast(json.success ? `Điều khiển thành công: ${id} — ${action}` : json.error, json.success ? 'success' : 'error');
  } catch { document.getElementById('pumpCtrlResult').textContent = '❌ Lỗi kết nối'; }
}

async function controlSluice() {
  const id      = document.getElementById('sluiceCtrlId').value;
  const action  = document.getElementById('sluiceCtrlAction').value;
  const openPct = parseInt(document.getElementById('sluiceOpenPct').value) || undefined;
  if (!id) return;
  try {
    const res  = await fetch(`${API}/api/admin/control/sluice/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, openPct, pct: 25, operator: 'ADMIN_DASHBOARD' }) });
    const json = await res.json();
    const el = document.getElementById('sluiceCtrlResult');
    el.textContent = json.success ? `✅ ${action} → ${id} | Mở: ${json.openPct}%` : `❌ ${json.error}`;
    el.style.color = json.success ? '#00e676' : '#ff5252';
    toast(json.success ? `Cống ${id}: ${action} → ${json.openPct}%` : json.error, json.success ? 'success' : 'error');
  } catch { document.getElementById('sluiceCtrlResult').textContent = '❌ Lỗi kết nối'; }
}

async function overrideValue() {
  const type  = document.getElementById('overrideType').value;
  const id    = document.getElementById('overrideId').value;
  const field = document.getElementById('overrideField').value.trim();
  const value = document.getElementById('overrideValue').value.trim();
  if (!id || !field || value === '') return toast('Vui lòng nhập đầy đủ', 'warn');

  const payload = { [field]: isNaN(value) ? value : parseFloat(value) };
  try {
    const res  = await fetch(`${API}/api/admin/override/${type}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const json = await res.json();
    const el = document.getElementById('overrideResult');
    el.textContent = json.success ? `✅ ${type}/${id}.${field} = ${value}` : `❌ ${json.error}`;
    el.style.color = json.success ? '#00e676' : '#ff5252';
    toast(json.success ? `Override: ${id} → ${field} = ${value}` : json.error, json.success ? 'success' : 'error');
  } catch { document.getElementById('overrideResult').textContent = '❌ Lỗi kết nối'; }
}

// ── MODE CONTROL ──────────────────────────────────────────────────
const MODE_TYPES = [
  { type: 'pump',        label: 'Trạm bơm' },
  { type: 'sluice',      label: 'Cống điều tiết' },
  { type: 'floodSensor', label: 'Cảm biến ngập' },
  { type: 'weather',     label: 'Khí tượng' },
  { type: 'landslide',   label: 'Sạt lở' },
];

async function loadModes() {
  try {
    const res  = await fetch(`${API}/api/admin/mode`);
    const json = await res.json();
    const modes = json.modes || {};
    document.getElementById('modeGrid').innerHTML = MODE_TYPES.map(({ type, label }) => {
      const mode = modes[type] || 'auto';
      return `
        <div class="mode-card">
          <h4>${label}</h4>
          <div class="mode-toggle">
            <button class="mode-btn auto ${mode === 'auto' ? 'active' : ''}" onclick="setMode('${type}','auto')">AUTO</button>
            <button class="mode-btn manual ${mode === 'manual' ? 'active' : ''}" onclick="setMode('${type}','manual')">MANUAL</button>
          </div>
        </div>`;
    }).join('');
  } catch {}
}

async function setMode(type, mode) {
  try {
    const res  = await fetch(`${API}/api/admin/mode/${type}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode }) });
    const json = await res.json();
    if (json.success) { toast(`${type} → ${mode.toUpperCase()}`, 'info'); loadModes(); }
    else toast(`Lỗi: ${json.error}`, 'error');
  } catch { toast('Lỗi kết nối', 'error'); }
}

async function setAllMode(mode) {
  try {
    const res = await fetch(`${API}/api/admin/mode/all`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode }) });
    const json = await res.json();
    if (json.success) {
      toast(`Tất cả simulator → ${mode.toUpperCase()}`, 'info');
      document.getElementById('modeResult').textContent = `✅ Đã đặt tất cả sang ${mode.toUpperCase()} (${new Date().toLocaleTimeString('vi-VN')})`;
      loadModes();
    }
  } catch { toast('Lỗi kết nối', 'error'); }
}

// ── TOAST ─────────────────────────────────────────────────────────
function toast(msg, type = 'info') {
  const cont = document.getElementById('toastContainer');
  const el   = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  cont.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

// ── INIT ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  connectSSE();
  loadStatus();
  // Update clock
  setInterval(() => {
    document.getElementById('timeBadge').textContent = new Date().toLocaleTimeString('vi-VN');
  }, 1000);
  // Refresh active panel every 15s
  setInterval(() => {
    if (_currentPanel === 'status') loadStatus();
  }, 15000);
});
