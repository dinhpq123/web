/**
 * Hadiwa IOC — Admin Management JS v2.0
 * Quản lý thiết bị: CRUD, Grid/Table view, Search, Scenario, Mode, Control
 */
'use strict';

const API = (() => {
  const p = window.location.pathname;
  return p.endsWith('/') ? p.slice(0, -1) : p.substring(0, p.lastIndexOf('/'));
})();

let _currentType    = 'pump';
let _currentView    = 'grid';
let _allDevices     = [];
let _filteredDevices= [];
let _currentScenario= 'normal';
let _modalEditId    = null;
let _catalogByType  = {}; // cache: deviceType → array of catalog items

// ── Type Metadata ──────────────────────────────────────────────────
const TYPE_META = {
  pump: {
    label: 'Trạm bơm', badge: 'badge-pump',
    idField: 'station_id', nameField: 'name', areaField: 'district',
    statusField: 'status',
    specs: s => [`${s.pumps_total||3} tổ máy`, `${s.designFlow_m3s||0} m³/s TK`, s.river||''].filter(Boolean),
    tableHeaders: ['ID','Tên','Khu vực','Tổ máy','Lưu lượng TK','Trạng thái',''],
    tableRow: s => [
      `<span class="tbl-id">${s.station_id}</span>`,
      s.name,
      s.district || '—',
      `${s.pumps_total||'—'} máy`,
      `${s.designFlow_m3s||'—'} m³/s`,
      statusBadge(s.status),
    ],
  },
  sluice: {
    label: 'Cống điều tiết', badge: 'badge-sluice',
    idField: 'sluice_id', nameField: 'name', areaField: 'district',
    statusField: 'status',
    specs: s => [`${s.gates_total||1} cửa van`, `${s.maxFlow_m3s||0} m³/s max`, s.controlType||'Electric'].filter(Boolean),
    tableHeaders: ['ID','Tên','Khu vực','Cửa van','Lưu lượng max','Trạng thái',''],
    tableRow: s => [
      `<span class="tbl-id">${s.sluice_id}</span>`,
      s.name, s.district||'—',
      `${s.gates_total||1} cửa`,
      `${s.maxFlow_m3s||'—'} m³/s`,
      statusBadge(s.status),
    ],
  },
  floodSensor: {
    label: 'Cảm biến ngập', badge: 'badge-floodsensor',
    idField: 'sensor_id', nameField: 'name', areaField: 'district',
    statusField: 'status',
    specs: s => [s.type||'ultrasonic', `max ${s.maxLevel_m||3} m`, `warn >${s.threshold_warn||1} m`],
    tableHeaders: ['ID','Tên','Khu vực','Loại','Ngưỡng warn','Trạng thái',''],
    tableRow: s => [
      `<span class="tbl-id">${s.sensor_id}</span>`,
      s.name, s.district||'—',
      s.type||'ultrasonic',
      `${s.threshold_warn||1} m`,
      statusBadge(s.status),
    ],
  },
  landslide: {
    label: 'Cảm biến sạt lở', badge: 'badge-landslide',
    idField: 'sensor_id', nameField: 'name', areaField: 'lat',
    statusField: 'status',
    specs: s => [s.type||'tilt_inclinometer', `base ${s.baseDisplacement_mm||0} mm`],
    tableHeaders: ['ID','Tên','Tọa độ','Loại','Chuyển vị cơ bản','Trạng thái',''],
    tableRow: s => [
      `<span class="tbl-id">${s.sensor_id}</span>`,
      s.name,
      `${s.lat||'—'}, ${s.lng||'—'}`,
      s.type||'—',
      `${s.baseDisplacement_mm||0} mm`,
      statusBadge(s.status),
    ],
  },
  weather: {
    label: 'Trạm khí tượng', badge: 'badge-weather',
    idField: 'station_id', nameField: 'name', areaField: 'district',
    statusField: 'weatherCode',
    specs: s => [s.district||'', `${s.baseTemp_C||25}°C TB`, `${s.baseHumidity_pct||75}% ẩm`].filter(Boolean),
    tableHeaders: ['ID','Tên','Khu vực','Nhiệt độ TB','Độ ẩm TB','Trạng thái',''],
    tableRow: s => [
      `<span class="tbl-id">${s.station_id}</span>`,
      s.name, s.district||'—',
      `${s.baseTemp_C||25}°C`,
      `${s.baseHumidity_pct||75}%`,
      statusBadge(s.weatherCode || 'clear'),
    ],
  },
};

// ── Form field definitions per device type ─────────────────────────
const FORM_FIELDS = {
  pump: [
    { group: 'Thông tin cơ bản' },
    { name:'id',        label:'ID Trạm',      placeholder:'TB-001',   hint:'Mã định danh duy nhất' },
    { name:'name',      label:'Tên trạm',      placeholder:'Trạm bơm Yên Sở' },
    { name:'district',  label:'Quận/Huyện',    placeholder:'Hoàng Mai' },
    { name:'river',     label:'Sông/Kênh',     placeholder:'Sông Tô Lịch' },
    { name:'lat',       label:'Vĩ độ (lat)',   placeholder:'20.9876', type:'number' },
    { name:'lng',       label:'Kinh độ (lng)', placeholder:'105.8456', type:'number' },
    { group: 'Thông số kỹ thuật' },
    { name:'pumps_total',          label:'Số tổ máy',        placeholder:'3', type:'number' },
    { name:'designFlow_m3s',       label:'Lưu lượng TK (m³/s)', placeholder:'15.5', type:'number' },
    { name:'motorPower_kW',        label:'Công suất tổ máy (kW)',placeholder:'220', type:'number' },
    { name:'alertThresholdH_m',    label:'Ngưỡng cảnh báo H (m)', placeholder:'2.5', type:'number' },
    { name:'targetDewatering_area', label:'Diện tích tiêu (ha)', placeholder:'1500', type:'number' },
  ],
  sluice: [
    { group: 'Thông tin cơ bản' },
    { name:'id',     label:'ID Cống',    placeholder:'CG-001' },
    { name:'name',   label:'Tên cống',   placeholder:'Cống Liên Mạc' },
    { name:'district',label:'Khu vực',  placeholder:'Từ Liêm' },
    { name:'river',  label:'Vị trí sông',placeholder:'Sông Hồng' },
    { name:'lat',    label:'Vĩ độ',      placeholder:'21.0456', type:'number' },
    { name:'lng',    label:'Kinh độ',    placeholder:'105.7234', type:'number' },
    { group: 'Thông số kỹ thuật' },
    { name:'gates_total',   label:'Số cửa van', placeholder:'2', type:'number' },
    { name:'maxFlow_m3s',   label:'Lưu lượng tối đa (m³/s)', placeholder:'50', type:'number' },
    { name:'maxOpening_m',  label:'Khẩu độ (m)', placeholder:'4.5', type:'number' },
    { name:'controlType',   label:'Kiểu điều khiển', type:'select', options:['Electric','Hydraulic','Manual','SCADA'] },
    { name:'designH_m',     label:'Cột nước thiết kế (m)', placeholder:'3.5', type:'number' },
  ],
  floodSensor: [
    { group: 'Thông tin cơ bản' },
    { name:'id',      label:'ID Cảm biến', placeholder:'FS-001' },
    { name:'name',    label:'Tên điểm đo', placeholder:'Ngã tư Kim Ngưu' },
    { name:'district',label:'Quận/Huyện',  placeholder:'Hoàng Mai' },
    { name:'address', label:'Địa chỉ cụ thể', placeholder:'142 Kim Ngưu, phường Thanh Lương', full:true },
    { name:'lat',     label:'Vĩ độ', placeholder:'20.9987', type:'number' },
    { name:'lng',     label:'Kinh độ', placeholder:'105.8532', type:'number' },
    { group: 'Thông số đo lường' },
    { name:'type',    label:'Loại cảm biến', type:'select', options:['ultrasonic','radar','pressure','capacitive'] },
    { name:'maxLevel_m',      label:'Thang đo tối đa (m)', placeholder:'3', type:'number' },
    { name:'threshold_warn',  label:'Ngưỡng cảnh báo (m)', placeholder:'0.5', type:'number' },
    { name:'threshold_crit',  label:'Ngưỡng nguy hiểm (m)', placeholder:'1.2', type:'number' },
    { name:'installElev_m',   label:'Cao độ lắp đặt (m)', placeholder:'5.8', type:'number' },
  ],
  landslide: [
    { group: 'Thông tin điểm quan trắc' },
    { name:'id',     label:'ID Cảm biến', placeholder:'LS-001' },
    { name:'name',   label:'Tên điểm quan trắc', placeholder:'Mái taluy đường HCM km 12' },
    { name:'lat',    label:'Vĩ độ', placeholder:'20.8756', type:'number' },
    { name:'lng',    label:'Kinh độ', placeholder:'105.4321', type:'number' },
    { name:'elevation_m', label:'Cao độ (m)', placeholder:'125', type:'number' },
    { name:'slopeAngle_deg', label:'Góc nghiêng mái (°)', placeholder:'35', type:'number', full:true },
    { group: 'Thông số cảm biến' },
    { name:'type', label:'Loại cảm biến', type:'select', options:['tilt_inclinometer','extensometer','piezometer','gps_displacement','crackometer'] },
    { name:'baseDisplacement_mm', label:'Chuyển vị cơ sở (mm)', placeholder:'0', type:'number' },
    { name:'threshold_watch',   label:'Ngưỡng theo dõi (mm)', placeholder:'5', type:'number' },
    { name:'threshold_warning', label:'Ngưỡng cảnh báo (mm)', placeholder:'10', type:'number' },
    { name:'threshold_critical',label:'Ngưỡng nguy hiểm (mm)', placeholder:'20', type:'number' },
  ],
  weather: [
    { group: 'Thông tin trạm' },
    { name:'id',      label:'ID Trạm', placeholder:'WS-001' },
    { name:'name',    label:'Tên trạm', placeholder:'Trạm KT Láng' },
    { name:'district',label:'Khu vực', placeholder:'Đống Đa' },
    { name:'lat',     label:'Vĩ độ', placeholder:'21.0245', type:'number' },
    { name:'lng',     label:'Kinh độ', placeholder:'105.7987', type:'number' },
    { name:'elevation_m', label:'Cao độ (m)', placeholder:'12', type:'number' },
    { group: 'Thông số cơ sở (dùng cho Auto mode)' },
    { name:'baseTemp_C',       label:'Nhiệt độ cơ sở (°C)', placeholder:'27', type:'number' },
    { name:'baseHumidity_pct', label:'Độ ẩm cơ sở (%)', placeholder:'78', type:'number' },
    { name:'baseRainfall_mm_h',label:'Lượng mưa nền (mm/h)', placeholder:'0', type:'number' },
    { name:'baseWindSpeed_kmh', label:'Tốc độ gió (km/h)', placeholder:'10', type:'number' },
  ],
};

const SCENARIO_COLORS = {
  normal:'#22c55e', rain_watch:'#22d3ee', flood:'#f59e0b',
  storm:'#f97316', typhoon:'#ef4444', drought:'#a78bfa',
};
const SCENARIO_LABELS = {
  normal:'Bình thường', rain_watch:'Theo dõi mưa', flood:'Lũ lụt',
  storm:'Bão', typhoon:'Siêu bão', drought:'Hạn hán',
};
const MODE_LABELS = { pump:'Trạm bơm', sluice:'Cống điều tiết', floodSensor:'Cảm biến ngập', weather:'Khí tượng', landslide:'Sạt lở' };

// ── Status badge helper ───────────────────────────────────────────
function statusBadge(s) {
  if (!s) return '<span class="tbl-status status-offline">Offline</span>';
  const l = s.toLowerCase();
  const cls = ['running','open','stable','normal'].includes(l) ? 'status-running' :
              ['idle','standby','closed','clear'].includes(l)   ? 'status-idle' :
              ['fault','critical','alarm'].includes(l)           ? 'status-fault' :
              ['warning','watch','partial'].includes(l)           ? 'status-warning' : 'status-offline';
  const labels = { running:'Đang chạy', idle:'Chờ', open:'Đang mở', closed:'Đóng', fault:'Sự cố', warning:'Cảnh báo', critical:'Nguy hiểm', alarm:'Báo động', watch:'Theo dõi', offline:'Offline', standby:'Dự phòng', stable:'Ổn định', normal:'Bình thường', partial:'Mở một phần', clear:'Không mưa' };
  return `<span class="tbl-status ${cls}">${labels[l] || s}</span>`;
}

function toast(msg, type = 'ok') {
  const c = document.getElementById('toastWrap');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}
function setConn(ok) {
  document.querySelector('.conn-dot')?.classList.toggle('ok', ok);
  document.querySelector('.conn-dot')?.classList.toggle('err', !ok);
  const lbl = document.getElementById('connLabel');
  if (lbl) lbl.textContent = ok ? 'Đã kết nối' : 'Mất kết nối';
}

// ── Select device type ─────────────────────────────────────────────
function selectType(type) {
  _currentType = type;
  document.querySelectorAll('.type-item').forEach(b => b.classList.toggle('active', b.dataset.type === type));
  const meta = TYPE_META[type] || TYPE_META.pump;
  document.getElementById('adminSectionTitle').textContent = meta.label;
  document.getElementById('searchInput').value = '';
  loadDevices();
}

// ── Load devices from API ──────────────────────────────────────────
async function loadDevices() {
  try {
    const res  = await fetch(`${API}/api/admin/devices/${_currentType}`);
    const json = await res.json();
    _allDevices = json.data || [];
    const ct = document.getElementById(`count-${_currentType}`);
    if (ct) ct.textContent = _allDevices.length;
    document.getElementById('adminCountBadge').textContent = `${_allDevices.length} thiết bị`;
    applyFilter();
    setConn(true);
  } catch {
    document.getElementById('adminGrid').innerHTML = `<div class="admin-empty" style="color:#f87171">Không thể kết nối Admin Server.<br><small style="color:#6b7280">Đảm bảo node index.js đang chạy tại port 7200.</small></div>`;
    setConn(false);
  }
}

// ── Filter + Render ────────────────────────────────────────────────
function applyFilter() {
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase();
  _filteredDevices = q
    ? _allDevices.filter(d => JSON.stringify(d).toLowerCase().includes(q))
    : _allDevices;
  document.getElementById('adminCountBadge').textContent = `${_filteredDevices.length}/${_allDevices.length} thiết bị`;
  if (_currentView === 'grid') renderGrid();
  else renderTable();
}

function setView(v) {
  _currentView = v;
  document.getElementById('btnViewGrid').classList.toggle('active', v === 'grid');
  document.getElementById('btnViewTable').classList.toggle('active', v === 'table');
  document.getElementById('adminGrid').style.display = v === 'grid' ? '' : 'none';
  document.getElementById('adminTableWrap').style.display = v === 'table' ? '' : 'none';
  if (v === 'grid') renderGrid(); else renderTable();
}

// ── Grid render ────────────────────────────────────────────────────
function renderGrid() {
  const el = document.getElementById('adminGrid');
  const meta = TYPE_META[_currentType] || TYPE_META.pump;
  if (!_filteredDevices.length) {
    el.innerHTML = '<div class="admin-empty"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(100,116,139,.3)" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg><div>Không tìm thấy thiết bị nào</div></div>';
    return;
  }
  el.innerHTML = _filteredDevices.map(d => {
    const id   = d[meta.idField] || d.id;
    const name = d[meta.nameField] || '—';
    const area = d[meta.areaField] || '';
    const specs = meta.specs(d);
    const st   = d[meta.statusField] || 'idle';
    return `<div class="admin-device-card">
      <div class="adc-header">
        <div>
          <span class="adc-type-badge ${meta.badge}">${meta.label}</span>
          <div class="adc-id">${id}</div>
          <div class="adc-name">${name}</div>
          ${area ? `<div class="adc-area"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${area}</div>` : ''}
        </div>
        ${statusBadge(st)}
      </div>
      ${specs.length ? `<div class="adc-specs">${specs.map(s => `<span class="adc-spec">${s}</span>`).join('')}</div>` : ''}
      <div class="adc-actions">
        <button class="btn-edit-dev" onclick="openEdit('${id}')">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Chỉnh sửa
        </button>
        <button class="btn-del-dev" onclick="confirmDelete('${id}','${name.replace(/'/g,"\\'")}')">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          Xóa
        </button>
      </div>
    </div>`;
  }).join('');
}

// ── Table render ───────────────────────────────────────────────────
function renderTable() {
  const meta = TYPE_META[_currentType] || TYPE_META.pump;
  const headEl = document.getElementById('adminTableHead');
  const bodyEl = document.getElementById('adminTableBody');

  headEl.innerHTML = `<tr>${meta.tableHeaders.map(h => `<th>${h}</th>`).join('')}</tr>`;

  if (!_filteredDevices.length) {
    bodyEl.innerHTML = '<tr><td colspan="10" style="text-align:center;color:#6b7280;padding:24px">Không tìm thấy thiết bị nào</td></tr>';
    return;
  }
  bodyEl.innerHTML = _filteredDevices.map(d => {
    const id   = d[meta.idField] || d.id;
    const name = d[meta.nameField] || '—';
    const cells= meta.tableRow(d);
    return `<tr>
      ${cells.map(c => `<td>${c}</td>`).join('')}
      <td><div class="tbl-actions">
        <button class="btn-tbl-edit" onclick="openEdit('${id}')">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Sửa
        </button>
        <button class="btn-tbl-del" onclick="confirmDelete('${id}','${name.replace(/'/g,"\\'")}')">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>Xóa
        </button>
      </div></td>
    </tr>`;
  }).join('');
}

// ── Device Catalog Picker ──────────────────────────────────────────
async function _ensureCatalog(type) {
  if (_catalogByType[type]) return _catalogByType[type];
  try {
    const r = await fetch(`${API}/api/catalog?type=${type}`);
    const d = await r.json();
    _catalogByType[type] = d.devices || [];
  } catch { _catalogByType[type] = []; }
  return _catalogByType[type];
}

async function _initCatalogPicker(type, currentCatalogCode) {
  const devices = await _ensureCatalog(type);
  const brands  = [...new Set(devices.map(d => d.brand))].sort();
  const brandSel = document.getElementById('catBrand');
  if (!brandSel) return;
  brandSel.innerHTML = '<option value="">— Chọn hãng —</option>' +
    brands.map(b => `<option value="${b}">${b}</option>`).join('');
  if (currentCatalogCode) {
    const item = devices.find(d => d.code === currentCatalogCode);
    if (item) {
      brandSel.value = item.brand;
      _onCatBrand(type);
      setTimeout(() => {
        const ms = document.getElementById('catModel');
        if (ms) { ms.value = currentCatalogCode; _onCatModel(type); }
      }, 30);
    }
  }
}

function _onCatBrand(type) {
  const brand = document.getElementById('catBrand')?.value;
  const ms    = document.getElementById('catModel');
  const prev  = document.getElementById('catPreview');
  if (!ms) return;
  if (!brand) { ms.disabled = true; ms.innerHTML = '<option>— Chọn hãng trước —</option>'; if (prev) prev.style.display = 'none'; return; }
  const items = (_catalogByType[type] || []).filter(d => d.brand === brand);
  ms.disabled = false;
  ms.innerHTML = '<option value="">— Chọn model —</option>' +
    items.map(d => `<option value="${d.code}">${d.model}</option>`).join('');
  if (prev) prev.style.display = 'none';
}

function _onCatModel(type) {
  const code  = document.getElementById('catModel')?.value;
  const prev  = document.getElementById('catPreview');
  const chips = document.getElementById('catChips');
  const desc  = document.getElementById('catDesc');
  if (!prev || !code) { if (prev) prev.style.display = 'none'; return; }
  const item  = (_catalogByType[type] || []).find(d => d.code === code);
  if (!item) return;
  const arr = [];
  if (item.flow_m3h)    arr.push(`Q ${item.flow_m3h} m³/h`);
  if (item.head_m)      arr.push(`H ${item.head_m} m`);
  if (item.power_kW)    arr.push(`P ${item.power_kW} kW`);
  if (item.efficiency)  arr.push(`η ${Math.round(item.efficiency * 100)}%`);
  if (item.range_m)     arr.push(`0–${item.range_m} m`);
  if (item.accuracy_mm) arr.push(`±${item.accuracy_mm} mm`);
  if (item.torque_Nm)   arr.push(`T ${item.torque_Nm} Nm`);
  if (item.ip_rating)   arr.push(item.ip_rating);
  if (item.protocol)    arr.push(item.protocol.split(',')[0].trim());
  if (item.range_deg)   arr.push(`±${item.range_deg}°`);
  if (item.parameters)  arr.push(...item.parameters.slice(0, 3));
  if (item.voltage_v)   arr.push(item.voltage_v);
  if (chips) chips.innerHTML = arr.map(c => `<span class="cat-chip">${c}</span>`).join('');
  if (desc)  desc.textContent = item.desc || '';
  if (prev)  prev.style.display = '';
}

function _applyCatalog(type) {
  const code = document.getElementById('catModel')?.value;
  if (!code) { toast('Chọn model trước', 'warn'); return; }
  const item = (_catalogByType[type] || []).find(d => d.code === code);
  if (!item) return;
  const maps = {
    pump:        { designFlow_m3s: item.flow_m3h ? +(item.flow_m3h / 3.6).toFixed(2) : null, motorPower_kW: item.power_kW || null },
    sluice:      {},
    floodSensor: { maxLevel_m: item.range_m || null },
    flood:       { maxLevel_m: item.range_m || null },
    landslide:   { slopeAngle_deg: item.range_deg || null },
    weather:     {},
  };
  const map = maps[type] || {};
  let filled = 0;
  for (const [name, val] of Object.entries(map)) {
    if (val === null || val === undefined) continue;
    const inp = document.querySelector(`[name="${name}"]`);
    if (inp) { inp.value = val; filled++; }
  }
  toast(`✓ Áp dụng thông số ${item.brand} ${item.model}${filled ? ` (${filled} trường)` : ''}`, 'ok');
}

// ── Modal CRUD ─────────────────────────────────────────────────────
function buildModalForm(type, data) {
  const fields = FORM_FIELDS[type] || FORM_FIELDS.pump;
  // Catalog picker section at top
  let html = `
  <div class="catalog-picker">
    <div class="catalog-picker-title">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      Từ thư viện hãng thiết bị
      <span style="font-weight:400;color:var(--text2);margin-left:4px">(tùy chọn — tự động điền thông số)</span>
    </div>
    <div class="catalog-picker-row">
      <select id="catBrand" class="form-sel" onchange="_onCatBrand('${type}')" style="flex:1">
        <option value="">Đang tải…</option>
      </select>
      <select id="catModel" class="form-sel" onchange="_onCatModel('${type}')" style="flex:1.5" disabled>
        <option>— Chọn hãng trước —</option>
      </select>
      <button type="button" onclick="_applyCatalog('${type}')" class="btn-cat-apply">Áp dụng</button>
    </div>
    <div id="catPreview" style="display:none;margin-top:8px">
      <div id="catChips" class="cat-chips"></div>
      <div id="catDesc" class="cat-desc"></div>
    </div>
  </div>`;
  // Regular form fields
  html += '<div class="form-grid">';
  fields.forEach(f => {
    if (f.group) {
      html += `</div><div style="font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--text2);margin:14px 0 2px;grid-column:1/-1">${f.group}</div><div class="form-grid">`;
      return;
    }
    const val    = data ? (data[f.name] !== undefined ? data[f.name] : '') : '';
    const colCls = f.full ? 'form-field full' : 'form-field';
    if (f.type === 'select') {
      html += `<div class="${colCls}">
        <label class="form-label">${f.label}</label>
        <select class="form-sel" name="${f.name}">
          ${f.options.map(o => `<option value="${o}" ${val===o?'selected':''}>${o}</option>`).join('')}
        </select>
      </div>`;
    } else {
      html += `<div class="${colCls}">
        <label class="form-label">${f.label}</label>
        <input class="form-inp" name="${f.name}" type="${f.type||'text'}" placeholder="${f.placeholder||''}" value="${val}">
        ${f.hint ? `<div class="form-hint">${f.hint}</div>` : ''}
      </div>`;
    }
  });
  html += '</div>';
  return html;
}


function openAdd() {
  _modalEditId = null;
  const meta = TYPE_META[_currentType] || TYPE_META.pump;
  document.getElementById('modalTitle').textContent = `Thêm ${meta.label} mới`;
  document.getElementById('modalSubtitle').textContent = 'Điền đầy đủ thông tin thiết bị';
  document.getElementById('modalBody').innerHTML = buildModalForm(_currentType, null);
  document.getElementById('deviceModal').classList.add('open');
  _initCatalogPicker(_currentType, null);
}

function openEdit(id) {
  const meta = TYPE_META[_currentType] || TYPE_META.pump;
  const item = _allDevices.find(d => (d[meta.idField] || d.id) === id);
  if (!item) return toast('Không tìm thấy thiết bị', 'err');
  _modalEditId = id;
  document.getElementById('modalTitle').textContent = `Chỉnh sửa — ${id}`;
  document.getElementById('modalSubtitle').textContent = item.name || '';
  document.getElementById('modalBody').innerHTML = buildModalForm(_currentType, item);
  document.getElementById('deviceModal').classList.add('open');
  _initCatalogPicker(_currentType, item.catalog_ref || null);
}

async function saveDevice() {
  const form   = document.getElementById('modalBody');
  const inputs = form.querySelectorAll('input[name],select[name]');
  const payload = {};
  inputs.forEach(inp => {
    const v = inp.value.trim();
    if (v !== '') payload[inp.name] = isNaN(v) ? v : Number(v);
  });

  const method  = _modalEditId ? 'PUT' : 'POST';
  const url     = _modalEditId
    ? `${API}/api/admin/devices/${_currentType}/${_modalEditId}`
    : `${API}/api/admin/devices/${_currentType}`;

  try {
    const res  = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    const json = await res.json();
    if (json.success) {
      toast(_modalEditId ? 'Đã cập nhật thiết bị' : 'Đã thêm thiết bị mới', 'ok');
      closeModal();
      await loadDevices();
      await loadCounts();
    } else {
      toast(`Lỗi: ${json.error}`, 'err');
    }
  } catch {
    toast('Lỗi kết nối đến Admin Server', 'err');
  }
}

function closeModal() {
  document.getElementById('deviceModal').classList.remove('open');
  _modalEditId = null;
}

// ── Delete confirm ────────────────────────────────────────────────
let _pendingDeleteId = null;
function confirmDelete(id, name) {
  _pendingDeleteId = id;
  document.getElementById('confirmMsg').textContent = `Bạn có chắc chắn muốn xóa thiết bị "${id} — ${name}" không? Hành động này sẽ xóa vĩnh viễn khỏi dữ liệu.`;
  document.getElementById('confirmModal').classList.add('open');
}
function closeConfirm() {
  document.getElementById('confirmModal').classList.remove('open');
  _pendingDeleteId = null;
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnDeleteConfirm').addEventListener('click', async () => {
    if (!_pendingDeleteId) return;
    try {
      const res  = await fetch(`${API}/api/admin/devices/${_currentType}/${_pendingDeleteId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) { toast(`Đã xóa ${_pendingDeleteId}`, 'ok'); closeConfirm(); await loadDevices(); await loadCounts(); }
      else toast(`Lỗi: ${json.error}`, 'err');
    } catch { toast('Lỗi kết nối', 'err'); }
  });
});

// ── Load counts for sidebar ────────────────────────────────────────
async function loadCounts() {
  const types = ['pump','sluice','floodSensor','landslide','weather'];
  for (const t of types) {
    try {
      const res  = await fetch(`${API}/api/admin/devices/${t}`);
      const json = await res.json();
      const el = document.getElementById(`count-${t}`);
      if (el) el.textContent = (json.data || []).length;
    } catch {}
  }
}

// ── Scenarios ──────────────────────────────────────────────────────
async function loadScenarios() {
  try {
    const res  = await fetch(`${API}/api/admin/scenario`);
    const json = await res.json();
    _currentScenario = json.current || 'normal';
    renderScenarios(json.scenarios || {}, json.current);
    renderScenarioMini(json.scenarios || {}, json.current);
  } catch {}
}

function renderScenarios(scenarios, current) {
  const el = document.getElementById('scenarioCards');
  el.innerHTML = Object.entries(scenarios).map(([key, sc]) => {
    const color = SCENARIO_COLORS[key] || '#22d3ee';
    const isActive = key === current;
    return `<div class="sc-card ${isActive ? 'active' : ''}" style="--sc-color:${color}">
      ${isActive ? `<span class="sc-active-badge">Đang chạy</span>` : ''}
      <div class="sc-card-name">${sc.label || SCENARIO_LABELS[key] || key}</div>
      <div class="sc-card-desc">${sc.description || ''}</div>
      <button class="sc-card-btn" onclick="applyScenario('${key}')" ${isActive ? 'disabled' : ''}>
        ${isActive ? '✓ Đang áp dụng' : 'Áp dụng'}
      </button>
    </div>`;
  }).join('');
}

function renderScenarioMini(scenarios, current) {
  const el = document.getElementById('scenarioMini');
  if (!el) return;
  const MINI_COLORS = { normal:'#22c55e', rain_watch:'#22d3ee', flood:'#f59e0b', storm:'#f97316', typhoon:'#ef4444', drought:'#a78bfa' };
  el.innerHTML = Object.entries(scenarios).map(([key, sc]) => {
    const color = MINI_COLORS[key] || '#22d3ee';
    const isActive = key === current;
    return `<div class="scenario-mini-item ${isActive ? 'active' : ''}" onclick="applyScenario('${key}')" title="${sc.description||''}">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div class="s-mini-name">${sc.label || SCENARIO_LABELS[key] || key}</div>
        ${isActive ? `<span class="s-mini-badge" style="background:${color};color:#000">ON</span>` : ''}
      </div>
    </div>`;
  }).join('');
}

async function applyScenario(scenario) {
  try {
    const res  = await fetch(`${API}/api/admin/scenario`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ scenario }) });
    const json = await res.json();
    if (json.success) { toast(`Kịch bản → ${SCENARIO_LABELS[scenario] || scenario}`, 'ok'); loadScenarios(); }
    else toast(`Lỗi: ${json.error}`, 'err');
  } catch { toast('Lỗi kết nối', 'err'); }
}

// ── Modes ──────────────────────────────────────────────────────────
async function loadModes() {
  try {
    const res  = await fetch(`${API}/api/admin/mode`);
    const json = await res.json();
    const modes = json.modes || {};
    renderModeCards(modes);
    renderModeMini(modes);
  } catch {}
}

function renderModeCards(modes) {
  const el = document.getElementById('modeCards');
  el.innerHTML = Object.entries(MODE_LABELS).map(([type, label]) => {
    const mode = modes[type] || 'auto';
    return `<div class="mc-card">
      <span class="mc-label">${label}</span>
      <div class="mc-btns">
        <button class="mc-btn auto ${mode==='auto'?'on':''}" onclick="setMode('${type}','auto')">Auto</button>
        <button class="mc-btn manual ${mode==='manual'?'on':''}" onclick="setMode('${type}','manual')">Manual</button>
      </div>
    </div>`;
  }).join('');
}

function renderModeMini(modes) {
  const el = document.getElementById('modeMini');
  if (!el) return;
  el.innerHTML = Object.entries(MODE_LABELS).map(([type, label]) => {
    const mode = modes[type] || 'auto';
    return `<div class="mode-mini-row">
      <span class="mode-mini-label">${label}</span>
      <div class="mode-mini-toggle">
        <button class="mode-mini-btn auto ${mode==='auto'?'on':''}" onclick="setMode('${type}','auto')">A</button>
        <button class="mode-mini-btn manual ${mode==='manual'?'on':''}" onclick="setMode('${type}','manual')">M</button>
      </div>
    </div>`;
  }).join('');
}

async function setMode(type, mode) {
  try {
    const res  = await fetch(`${API}/api/admin/mode/${type}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ mode }) });
    const json = await res.json();
    if (json.success) { toast(`${MODE_LABELS[type]||type} → ${mode.toUpperCase()}`, 'ok'); loadModes(); }
    else toast(`Lỗi: ${json.error}`, 'err');
  } catch { toast('Lỗi kết nối', 'err'); }
}

async function setAllMode(mode) {
  try {
    await fetch(`${API}/api/admin/mode/all`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ mode }) });
    toast(`Tất cả → ${mode.toUpperCase()}`, 'ok');
    loadModes();
  } catch { toast('Lỗi kết nối', 'err'); }
}

// ── Direct Control ─────────────────────────────────────────────────
async function loadCtrlIds() {
  const type = document.getElementById('ctrlType').value;
  const isPump = type === 'pump';
  document.getElementById('ctrlPctGroup').style.display = isPump ? 'none' : '';
  const actionSel = document.getElementById('ctrlAction');
  actionSel.innerHTML = isPump
    ? ['<option value="start_pump">Khởi động tổ máy</option>','<option value="stop_pump">Dừng tổ máy</option>','<option value="shutdown">Tắt hoàn toàn</option>','<option value="restore">Khôi phục</option>'].join('')
    : ['<option value="open">Mở thêm 25%</option>','<option value="close">Đóng bớt 25%</option>','<option value="set_pct">Đặt % tuỳ chỉnh</option>','<option value="open_full">Mở hoàn toàn</option>','<option value="close_full">Đóng hoàn toàn</option>','<option value="release">Về chế độ Auto</option>'].join('');
  try {
    const res  = await fetch(`${API}/api/admin/devices/${type}`);
    const json = await res.json();
    const meta = TYPE_META[type] || TYPE_META.pump;
    const idField = meta.idField;
    document.getElementById('ctrlId').innerHTML = (json.data || []).map(d => `<option value="${d[idField]}">${d[idField]} — ${d.name}</option>`).join('');
  } catch {}
}

async function applyDirectControl() {
  const type   = document.getElementById('ctrlType').value;
  const id     = document.getElementById('ctrlId').value;
  const action = document.getElementById('ctrlAction').value;
  const pct    = parseInt(document.getElementById('ctrlPct')?.value) || 50;
  if (!id) return toast('Chọn thiết bị', 'warn');

  try {
    const res  = await fetch(`${API}/api/admin/control/${type}/${id}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action, openPct: pct, pct: 25, operator: 'ADMIN_V2' }) });
    const json = await res.json();
    const el = document.getElementById('ctrlResult');
    el.textContent = json.success ? `Thành công: ${id} → ${action} | Status: ${json.state?.status || 'OK'}` : `Lỗi: ${json.error}`;
    el.style.color = json.success ? 'var(--green)' : 'var(--red)';
    toast(json.success ? `${id}: ${action} thành công` : json.error, json.success ? 'ok' : 'err');
  } catch { toast('Lỗi kết nối', 'err'); }
}

// ── Init ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  setConn(false);
  try {
    await Promise.all([ loadScenarios(), loadModes(), loadCounts() ]);
    selectType('pump');
    loadCtrlIds();
    setConn(true);
  } catch { setConn(false); }

  // SSE for real-time
  const sse = new EventSource(`${API}/api/admin/stream`);
  sse.addEventListener('connected', () => setConn(true));
  sse.addEventListener('scenario', e => { _currentScenario = JSON.parse(e.data).scenario; loadScenarios(); });
  sse.addEventListener('mode', () => loadModes());
  sse.onerror = () => setConn(false);
});
