// ── PRODUCTION MANAGEMENT ─────────────────────────────────────────
// Tabs: Nhà máy | Vật tư | Hóa chất | Thiết bị & Bảo trì | AI Dự báo
let prodTab = 'material';

function renderProduction() {
  return `
  <div class="page-header">
    <div class="page-title"><h1>Sản xuất &amp; Vật tư</h1><p>Quản lý vật tư, hóa chất và thiết bị kỹ thuật</p></div>
    <div class="page-actions" id="prodActions"></div>
  </div>
  <div class="tabs">
    <button class="tab-btn ${prodTab === 'material' ? 'active' : ''}" onclick="switchProdTab('material')" style="display:inline-flex;align-items:center;gap:6px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> Vật tư</button>
    <button class="tab-btn ${prodTab === 'chemical' ? 'active' : ''}" onclick="switchProdTab('chemical')" style="display:inline-flex;align-items:center;gap:6px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11m0 0a2 2 0 002 2h4a2 2 0 002-2V3M9 14l-3 7h12l-3-7"/></svg> Hóa chất</button>
    <button class="tab-btn ${prodTab === 'equipment' ? 'active' : ''}" onclick="switchProdTab('equipment')" style="display:inline-flex;align-items:center;gap:6px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg> Thiết bị &amp; Bảo trì</button>
    <button class="tab-btn ${prodTab === 'aipredict' ? 'active' : ''}" onclick="switchProdTab('aipredict')" style="display:inline-flex;align-items:center;gap:6px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg> AI Dự báo bảo trì</button>
  </div>
  <div id="prodContent">${getProdTabContent()}</div>`;
}

function switchProdTab(tab) {
  prodTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('prodContent').innerHTML = getProdTabContent();
}

function getProdTabContent() {
  if (prodTab === 'material') return renderMaterials();
  if (prodTab === 'chemical') return renderChemicals();
  if (prodTab === 'equipment') return renderEquipment();
  if (prodTab === 'aipredict') return renderAiPredict();
  return '';
}

// ── MOCK HISTORY DATA ─────────────────────────────────────────────
const PROD_HISTORY = {
  'VT-001': [
    { date: '2026-02-20', type: 'Nhập kho', qty: 500, unit: 'cái', note: 'Nhập từ NCC Phước Sơn', user: 'Admin' },
    { date: '2026-02-15', type: 'Xuất kho', qty: 120, unit: 'cái', note: 'Xuất cho đội lắp đặt ST01', user: 'Kỹ thuật' },
    { date: '2026-01-28', type: 'Nhập kho', qty: 300, unit: 'cái', note: 'Nhập khẩn cấp bổ sung', user: 'Admin' },
  ],
  'VT-002': [
    { date: '2026-02-22', type: 'Nhập kho', qty: 50, unit: 'm', note: 'Nhập theo hợp đồng Q1', user: 'Mua sắm' },
    { date: '2026-02-10', type: 'Xuất kho', qty: 30, unit: 'm', note: 'Xuất sửa tuyến ống P5', user: 'Kỹ thuật' },
  ],
  'VT-003': [
    { date: '2026-02-25', type: 'Nhập kho', qty: 200, unit: 'kg', note: 'Nhập kho theo kế hoạch tháng 2', user: 'Mua sắm' },
    { date: '2026-02-18', type: 'Xuất kho', qty: 60, unit: 'kg', note: 'Xuất cho bộ phận xử lý nước', user: 'SX' },
    { date: '2026-01-15', type: 'Nhập kho', qty: 150, unit: 'kg', note: 'Nhập kho đầu năm', user: 'Mua sắm' },
  ],
  'HC-001': [
    { date: '2026-02-19', type: 'Nhập kho', qty: 500, unit: 'kg', note: 'Nhà cung cấp Chemtech', user: 'HC' },
    { date: '2026-02-10', type: 'Xuất kho', qty: 150, unit: 'kg', note: 'Xuất dùng khử trùng tuần 6', user: 'SX' },
    { date: '2026-01-20', type: 'Nhập kho', qty: 400, unit: 'kg', note: 'Nhập kho lại tháng 1', user: 'HC' },
  ],
  'HC-002': [
    { date: '2026-02-20', type: 'Nhập kho', qty: 200, unit: 'kg', note: 'Bổ sung thêm theo yêu cầu SX', user: 'HC' },
    { date: '2026-01-25', type: 'Xuất kho', qty: 80, unit: 'kg', note: 'Xuất xử lý mẻ nước thô', user: 'SX' },
  ],
  'HC-003': [
    { date: '2026-02-18', type: 'Nhập kho', qty: 300, unit: 'lit', note: 'Nhập từ NCC Hòa Phát', user: 'HC' },
    { date: '2026-02-01', type: 'Xuất kho', qty: 100, unit: 'lit', note: 'Xuất theo yêu cầu phòng KĐ', user: 'KĐ' },
  ],
  'EQ-001': [
    { date: '2026-02-23', type: 'Bảo dưỡng định kỳ', note: 'Thay nhớt, kiểm tra cánh bơm', user: 'Đội BT1', result: 'Bình thường' },
    { date: '2026-01-10', type: 'Sửa chữa', note: 'Thay phớt cơ khí bơm trục', user: 'Đội BT1', result: 'Hoàn thành' },
    { date: '2025-11-15', type: 'Bảo dưỡng định kỳ', note: 'Vệ sinh tổng thể, đo rung động', user: 'Đội BT1', result: 'Bình thường' },
  ],
  'EQ-002': [
    { date: '2026-02-15', type: 'Kiểm tra', note: 'Kiểm tra hệ thống điện điều khiển tự động', user: 'Điện', result: 'Bình thường' },
    { date: '2025-12-01', type: 'Bảo dưỡng định kỳ', note: 'Sơn lại tủ điện, kiểm tra tiếp địa', user: 'Điện', result: 'Hoàn thành' },
  ],
  'EQ-003': [
    { date: '2026-02-28', type: 'Sửa chữa khẩn cấp', note: 'Thay thế van bi bị kẹt', user: 'Đội BT2', result: 'Hoàn thành' },
    { date: '2026-02-01', type: 'Bảo dưỡng định kỳ', note: 'Vệ sinh van, kiểm tra actuator', user: 'Đội BT2', result: 'Bình thường' },
  ],
};

// ── HISTORY MODAL ────────────────────────────────────────────────
window.openProdHistory = function (id, name, type) {
  const history = PROD_HISTORY[id] || [];
  const isEquip = type === 'equipment';

  const typeColor = { 'Nhập kho': 'badge-green', 'Xuất kho': 'badge-red', 'Bảo dưỡng định kỳ': 'badge-blue', 'Sửa chữa': 'badge-yellow', 'Kiểm tra': 'badge-gray', 'Sửa chữa khẩn cấp': 'badge-red' };

  openModal(`
    <div class="modal-header">
      <div>
        <span class="modal-title" style="display:inline-flex;align-items:center;gap:6px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Lịch sử: ${name}</span>
        <div style="font-size:11px; color:var(--muted); margin-top:2px">ID: ${id} &nbsp;|&nbsp; ${history.length} bản ghi</div>
      </div>
      <button class="modal-close" onclick="closeModal(event)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body" style="padding:0; max-height:70vh; overflow-y:auto; overflow-x:hidden">
      ${history.length === 0 ? '<div style="text-align:center; padding:48px; color:var(--muted)">Chưa có lịch sử</div>' : `
      <table style="width:100%; border-collapse:collapse">
        <thead style="position:sticky; top:0; background:var(--bg-elevated); z-index:2">
          <tr>
            <th style="padding:12px 16px; font-size:11px; color:var(--muted); text-align:left; border-bottom:1px solid var(--border); white-space:nowrap">Ngày</th>
            <th style="padding:12px 16px; font-size:11px; color:var(--muted); text-align:left; border-bottom:1px solid var(--border); white-space:nowrap">Loại</th>
            ${!isEquip ? '<th style="padding:12px 16px; font-size:11px; color:var(--muted); text-align:left; border-bottom:1px solid var(--border); white-space:nowrap">Số lượng</th>' : ''}
            <th style="padding:12px 16px; font-size:11px; color:var(--muted); text-align:left; border-bottom:1px solid var(--border)">Ghi chú</th>
            ${isEquip ? '<th style="padding:12px 16px; font-size:11px; color:var(--muted); text-align:left; border-bottom:1px solid var(--border); white-space:nowrap">Kết quả</th>' : ''}
            <th style="padding:12px 16px; font-size:11px; color:var(--muted); text-align:left; border-bottom:1px solid var(--border); white-space:nowrap">Thực hiện</th>
          </tr>
        </thead>
        <tbody>
          ${history.map((h, i) => `
          <tr style="background:${i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'}; border-bottom:1px solid var(--border)">
            <td style="padding:12px 16px; font-family:'Roboto Mono',monospace; font-size:12px; color:var(--muted); white-space:nowrap">${h.date}</td>
            <td style="padding:12px 16px"><span class="badge ${typeColor[h.type] || 'badge-gray'}">${h.type}</span></td>
            ${!isEquip ? `<td style="padding:12px 16px; font-family:'Roboto Mono',monospace; font-size:13px; font-weight:600; white-space:nowrap">${h.qty} ${h.unit}</td>` : ''}
            <td style="padding:12px 16px; font-size:12px; color:var(--text)">${h.note}</td>
            ${isEquip ? `<td style="padding:12px 16px; font-size:12px; color:var(--success); font-weight:500; white-space:nowrap">${h.result}</td>` : ''}
            <td style="padding:12px 16px; font-size:12px; color:var(--muted); white-space:nowrap">${h.user}</td>
          </tr>`).join('')}
        </tbody>
      </table>`}
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal(event)">Đóng</button>
    </div>
  `);
};

// ── MATERIALS ────────────────────────────────────────────────────
function renderMaterials() {
  return `
  <div style="display:flex;justify-content:space-between;margin-bottom:12px;align-items:center">
    <div>${DATA.materials.filter(m => m.stock <= m.minStock).length > 0 ? `<span class="badge badge-red" style="display:inline-flex;align-items:center;gap:4px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> ${DATA.materials.filter(m => m.stock <= m.minStock).length} vật tư dưới mức tối thiểu</span>` : ''}</div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-ghost btn-sm" style="display:inline-flex;align-items:center;gap:5px" onclick="showToast('Đang xuất phiếu...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Phiếu xuất</button>
      <button class="btn btn-primary" style="display:inline-flex;align-items:center;gap:5px" onclick="showToast('Đang tạo phiếu nhập...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Nhập kho</button>
    </div>
  </div>
  <div class="card"><div class="table-wrap"><table>
    <thead><tr><th>Mã</th><th>Tên vật tư</th><th>Đơn vị</th><th>Tồn kho</th><th>Tối thiểu</th><th>Tiêu hao/ngày</th><th>Tình trạng</th><th style="text-align:center">Lịch sử</th></tr></thead>
    <tbody>
      ${DATA.materials.map(m => `
      <tr>
        <td class="mono text-cyan">${m.id}</td>
        <td style="font-weight:500">${m.name}</td>
        <td style="color:var(--muted)">${m.unit}</td>
        <td class="mono" style="color:${m.stock <= m.minStock ? 'var(--danger)' : 'var(--success)'}">${formatNum(m.stock)}</td>
        <td class="mono" style="color:var(--muted)">${formatNum(m.minStock)}</td>
        <td class="mono" style="color:var(--muted)">${formatNum(m.used)}</td>
        <td>${m.stock <= m.minStock ? '<span class="badge badge-red">Dưới mức tối thiểu</span>' : '<span class="badge badge-green">Đủ</span>'}</td>
        <td style="text-align:center"><button class="btn btn-ghost btn-sm" style="display:inline-flex;align-items:center;gap:4px;font-size:12px" onclick="openProdHistory('${m.id}','${m.name}','material')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/><polyline points="12 7 12 12 15 15"/></svg> Lịch sử</button></td>
      </tr>`).join('')}
    </tbody>
  </table></div></div>`;
}

// ── CHEMICALS ────────────────────────────────────────────────────
function renderChemicals() {
  return `
  <div style="display:flex;justify-content:flex-end;margin-bottom:12px;gap:8px">
    <button class="btn btn-ghost btn-sm" style="display:inline-flex;align-items:center;gap:5px" onclick="showToast('Đang xuất phiếu hóa chất...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Xuất kho</button>
    <button class="btn btn-primary" style="display:inline-flex;align-items:center;gap:5px" onclick="showToast('Đang tạo phiếu nhập hóa chất...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Nhập kho</button>
  </div>
  <div class="card"><div class="table-wrap"><table>
    <thead><tr><th>Mã</th><th>Tên hóa chất</th><th>Nhóm</th><th>Đơn vị</th><th>Tồn kho</th><th>Tiêu hao/ngày</th><th>Dự trữ</th><th>Tình trạng</th><th style="text-align:center">Lịch sử</th></tr></thead>
    <tbody>
      ${DATA.chemicals.map(c => {
    const days = Math.floor(c.stock / c.dailyUsage);
    const ok = c.stock > c.minStock;
    return `<tr>
          <td class="mono text-cyan">${c.id}</td>
          <td style="font-weight:500">${c.name}</td>
          <td><span class="badge badge-blue">${c.category}</span></td>
          <td style="color:var(--muted)">${c.unit}</td>
          <td class="mono" style="color:${ok ? 'var(--success)' : 'var(--danger)'}">${formatNum(c.stock)}</td>
          <td class="mono" style="color:var(--muted)">${c.dailyUsage} ${c.unit}/ng</td>
          <td class="mono" style="color:${days > 7 ? 'var(--success)' : days > 3 ? 'var(--warning)' : 'var(--danger)'}">${days} ngày</td>
          <td>${ok ? '<span class="badge badge-green">Đủ</span>' : '<span class="badge badge-red">Thiếu</span>'}</td>
          <td style="text-align:center"><button class="btn btn-ghost btn-sm" style="display:inline-flex;align-items:center;gap:4px;font-size:12px" onclick="openProdHistory('${c.id}','${c.name}','chemical')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/><polyline points="12 7 12 12 15 15"/></svg> Lịch sử</button></td>
        </tr>`;
  }).join('')}
    </tbody>
  </table></div></div>`;
}

// ── EQUIPMENT ────────────────────────────────────────────────────
function renderEquipment() {
  return `
  <div style="display:flex;justify-content:flex-end;margin-bottom:12px">
    <button class="btn btn-primary" onclick="showToast('Đang thêm thiết bị mới...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Thêm thiết bị</button>
  </div>
  <div class="card"><div class="table-wrap"><table>
    <thead><tr><th>Mã</th><th>Thiết bị</th><th>Nhà máy</th><th>Model</th><th>Trạng thái</th><th>Bảo dưỡng cuối</th><th>Bảo dưỡng tiếp theo</th><th>Giờ chạy</th><th style="text-align:center">Lịch sử</th></tr></thead>
    <tbody>
      ${DATA.equipment.map(e => `
      <tr>
        <td class="mono text-cyan">${e.id}</td>
        <td style="font-weight:500">${e.name}</td>
        <td style="color:var(--muted)">${e.factory}</td>
        <td style="font-size:12px;color:var(--muted)">${e.model}</td>
        <td>${statusBadge(e.status)}</td>
        <td class="mono" style="font-size:12px;color:var(--muted)">${e.lastMaint}</td>
        <td class="mono" style="font-size:12px;color:${e.status === 'fault' ? 'var(--danger)' : 'var(--warning)'}">${e.nextMaint}</td>
        <td class="mono" style="color:var(--muted)">${formatNum(e.hoursRun)} h</td>
        <td style="text-align:center"><button class="btn btn-ghost btn-sm" style="display:inline-flex;align-items:center;gap:4px;font-size:12px" onclick="openProdHistory('${e.id}','${e.name}','equipment')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/><polyline points="12 7 12 12 15 15"/></svg> Lịch sử</button></td>
      </tr>`).join('')}
    </tbody>
  </table></div></div>`;
}

// ── AI PREDICT ────────────────────────────────────────────────────
const AI_PREDICTIONS = [
  { id: 'EQ-001', name: 'Bơm ly tâm 1 – Hồ Suối Hai', risk: 'high', score: 88, nextFail: '~14 ngày', reason: 'Rung động bất thường tăng 40% trong 2 tuần gần đây. Nhiệt độ ổ trục vượt ngưỡng cảnh báo 3 lần.', recommendation: 'Lên lịch bảo dưỡng khẩn trong vòng 7 ngày. Kiểm tra cân bằng động cánh bơm, thay bạc đạn.', hoursLeft: 220, totalHours: 8420, lastFix: '2026-02-23', trend: [60, 62, 65, 70, 74, 80, 85, 88] },
  { id: 'EQ-003', name: 'Van điều tiết tuyến A', risk: 'medium', score: 54, nextFail: '~45 ngày', reason: 'Thời gian đóng/mở van tăng thêm 2.3 giây so với baseline. Actuator xuất hiện rung nhẹ.', recommendation: 'Kiểm tra actuator trong lần bảo dưỡng định kỳ tiếp theo. Bôi trơn trục van.', hoursLeft: 1200, totalHours: 5100, lastFix: '2026-02-28', trend: [40, 42, 45, 47, 50, 51, 53, 54] },
  { id: 'EQ-002', name: 'Tủ điều khiển tự động', risk: 'low', score: 22, nextFail: '> 180 ngày', reason: 'Hệ thống hoạt động ổn định. Điện áp và dòng điện trong mức giới hạn. Không có cảnh báo.', recommendation: 'Tiếp tục giám sát theo lịch định kỳ. Không cần can thiệp ngay.', hoursLeft: 4500, totalHours: 6200, lastFix: '2026-02-15', trend: [25, 24, 23, 22, 22, 22, 21, 22] },
];

// ── AI PREDICT SVG ICONS ──────────────────────────────────────────
const SVGI = {
  danger: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  alert: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  shieldOk: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
  cpu: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>`,
  wrench: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>`,
  calendar: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  bell: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`,
  clock: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  history: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/><polyline points="12 7 12 12 15 15"/></svg>`,
  refresh: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>`,
  trending: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  bulb: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z"/></svg>`,
};

function renderAiPredict() {
  const highC = AI_PREDICTIONS.filter(p => p.risk === 'high').length;
  const medC = AI_PREDICTIONS.filter(p => p.risk === 'medium').length;
  const lowC = AI_PREDICTIONS.filter(p => p.risk === 'low').length;

  return `
  <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid var(--border)">
    <div>
      <div style="font-size:17px; font-weight:700; margin:0 0 4px">Dự báo bảo trì thiết bị</div>
      <div style="font-size:12px; color:var(--muted)">Phân tích rủi ro bằng AI &amp; dữ liệu cảm biến thời gian thực</div>
    </div>
    <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap">
      <div style="display:flex; align-items:center; gap:6px; padding:6px 12px; border-radius:20px; background:rgba(255,71,87,.12); border:1px solid rgba(255,71,87,.3); color:var(--danger)">
        ${SVGI.danger}<span style="font-size:12px; font-weight:600">${highC} Rủi ro cao</span>
      </div>
      <div style="display:flex; align-items:center; gap:6px; padding:6px 12px; border-radius:20px; background:rgba(255,190,0,.1); border:1px solid rgba(255,190,0,.3); color:var(--warning)">
        ${SVGI.alert}<span style="font-size:12px; font-weight:600">${medC} Theo dõi</span>
      </div>
      <div style="display:flex; align-items:center; gap:6px; padding:6px 12px; border-radius:20px; background:var(--success-soft); border:1px solid var(--border-active); color:var(--success-text)">
        ${SVGI.shieldOk}<span style="font-size:12px; font-weight:600">${lowC} Bình thường</span>
      </div>
      <button class="btn btn-primary btn-sm" style="display:inline-flex; align-items:center; gap:6px" onclick="showToast('Đang phân tích lại dữ liệu...')">
        ${SVGI.refresh} Phân tích lại
      </button>
    </div>
  </div>

  <div style="display:flex; flex-direction:column; gap:16px">
    ${AI_PREDICTIONS.map(p => {
    const rc = p.risk === 'high' ? 'var(--danger)' : p.risk === 'medium' ? 'var(--warning)' : 'var(--success)';
    const rAlpha = p.risk === 'high' ? 'rgba(255,71,87,' : p.risk === 'medium' ? 'rgba(255,190,0,' : 'rgba(41,132,238,';
    const sc = p.score >= 75 ? 'var(--danger)' : p.score >= 50 ? 'var(--warning)' : 'var(--success)';
    const sAlpha = p.score >= 75 ? 'rgba(255,71,87,' : p.score >= 50 ? 'rgba(255,190,0,' : 'rgba(41,132,238,';
    const rIcon = p.risk === 'high' ? SVGI.danger : p.risk === 'medium' ? SVGI.alert : SVGI.shieldOk;
    const rLabel = p.risk === 'high' ? 'Rủi ro cao' : p.risk === 'medium' ? 'Cần theo dõi' : 'Bình thường';

    // Sparkline bars
    const maxT = Math.max(...p.trend);
    const sparks = p.trend.map((v, i) => {
      const h = Math.max(3, Math.round((v / maxT) * 40));
      const op = (0.35 + (i / p.trend.length) * 0.65).toFixed(2);
      return `<div style="flex:1;display:flex;align-items:flex-end"><div style="width:100%;height:${h}px;background:${sc};border-radius:2px 2px 0 0;opacity:${op}"></div></div>`;
    }).join('');

    // Arc gauge: circumference = π × r where r=50 → ~157 for semicircle: use 157
    const gaugeLen = 157;
    const gaugeOffset = (gaugeLen * (1 - p.score / 100)).toFixed(1);

    return `
      <div class="card" style="border-left:4px solid ${rc}; overflow:hidden; padding:0">

        <!-- Header -->
        <div style="padding:16px 20px 12px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px">
          <div>
            <div style="font-size:15px; font-weight:700; margin-bottom:4px">${p.name}</div>
            <div style="display:flex; gap:14px; font-size:11px; color:var(--muted); flex-wrap:wrap">
              <span style="display:inline-flex; align-items:center; gap:4px">${SVGI.clock} ID: ${p.id}</span>
              <span style="display:inline-flex; align-items:center; gap:4px">${SVGI.history} Bảo dưỡng cuối: ${p.lastFix}</span>
              <span style="font-family:'Roboto Mono',monospace">${formatNum(p.totalHours)} h tích lũy</span>
            </div>
          </div>
          <div style="display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:20px; background:${rAlpha}.1); border:1px solid ${rAlpha}.3); color:${rc}">
            ${rIcon}<span style="font-size:13px; font-weight:700">${rLabel}</span>
          </div>
        </div>

        <!-- Body: 3-column grid -->
        <div style="padding:16px 20px; display:grid; grid-template-columns:160px 1fr 1fr; gap:16px; align-items:start">

          <!-- LEFT: Gauge + sparkline -->
          <div style="display:flex; flex-direction:column; align-items:center; gap:10px">
            <div style="font-size:10px; font-weight:700; letter-spacing:.08em; color:var(--muted); text-transform:uppercase">Chỉ số rủi ro</div>
            <!-- SVG arc gauge -->
            <div style="position:relative; width:120px; height:72px">
              <svg width="120" height="72" viewBox="0 0 120 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Track -->
                <path d="M10 66 A50 50 0 0 1 110 66" stroke="rgba(255,255,255,0.07)" stroke-width="14" stroke-linecap="round"/>
                <!-- Fill -->
                <path d="M10 66 A50 50 0 0 1 110 66" stroke="${sc}" stroke-width="14" stroke-linecap="round"
                      stroke-dasharray="${gaugeLen}" stroke-dashoffset="${gaugeOffset}"
                      style="transition: stroke-dashoffset 0.6s ease"/>
              </svg>
              <div style="position:absolute; bottom:0; left:0; right:0; text-align:center; line-height:1">
                <div style="font-size:28px; font-weight:900; font-family:'Roboto Mono',monospace; color:${sc}">${p.score}</div>
                <div style="font-size:10px; color:var(--muted)">/100</div>
              </div>
            </div>
            <div style="text-align:center">
              <div style="font-size:10px; color:var(--muted)">Dự kiến hỏng</div>
              <div style="font-size:13px; font-weight:700; color:${rc}">${p.nextFail}</div>
            </div>
            <!-- Sparkline -->
            <div style="width:100%">
              <div style="font-size:10px; color:var(--muted); display:inline-flex; align-items:center; gap:4px; margin-bottom:4px">${SVGI.trending} Xu hướng</div>
              <div style="display:flex; height:40px; gap:3px; align-items:flex-end; background:var(--bg-secondary); border-radius:6px; padding:4px 6px">${sparks}</div>
            </div>
            <!-- Hours left bar -->
            <div style="width:100%">
              <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--muted); margin-bottom:4px">
                <span>Còn lại</span>
                <span style="font-family:'Roboto Mono',monospace; color:${sc}">${formatNum(p.hoursLeft)} h</span>
              </div>
              <div class="progress-bar" style="height:5px; border-radius:3px">
                <div class="progress-fill" style="width:${Math.round(p.hoursLeft / p.totalHours * 100)}%; background:${sc}; border-radius:3px"></div>
              </div>
            </div>
          </div>

          <!-- MIDDLE: AI Analysis -->
          <div style="background:var(--bg-secondary); border-radius:10px; padding:14px; border:1px solid var(--border); height:100%; box-sizing:border-box">
            <div style="display:inline-flex; align-items:center; gap:6px; font-size:10px; font-weight:700; letter-spacing:.08em; color:var(--primary); text-transform:uppercase; margin-bottom:10px">
              ${SVGI.cpu} Phân tích AI
            </div>
            <p style="font-size:13px; line-height:1.7; color:var(--text); margin:0">${p.reason}</p>
          </div>

          <!-- RIGHT: Recommendation + Actions -->
          <div style="background:${rAlpha}.06); border-radius:10px; padding:14px; border:1px solid ${rAlpha}.2); height:100%; box-sizing:border-box; display:flex; flex-direction:column">
            <div style="display:inline-flex; align-items:center; gap:6px; font-size:10px; font-weight:700; letter-spacing:.08em; color:${rc}; text-transform:uppercase; margin-bottom:10px">
              ${SVGI.bulb} Khuyến nghị
            </div>
            <p style="font-size:13px; line-height:1.7; color:var(--text); margin:0; flex:1">${p.recommendation}</p>
            <div style="display:flex; gap:8px; margin-top:14px; flex-wrap:wrap">
              <button class="btn btn-ghost btn-sm" style="display:inline-flex; align-items:center; gap:5px; font-size:12px" onclick="openProdHistory('${p.id}','${p.name}','equipment')">
                ${SVGI.history} Lịch sử bảo trì
              </button>
              <button class="btn btn-outline btn-sm" style="display:inline-flex; align-items:center; gap:5px; font-size:12px" onclick="showToast('Đã tạo lịch bảo dưỡng!')">
                ${SVGI.calendar} Lên lịch BT
              </button>
              ${p.risk === 'high' ? `<button class="btn btn-primary btn-sm" style="display:inline-flex; align-items:center; gap:5px; font-size:12px; background:var(--danger); border-color:var(--danger)" onclick="showToast('Đã gửi yêu cầu bảo dưỡng khẩn!')">
                ${SVGI.bell} BT Khẩn cấp
              </button>` : ''}
            </div>
          </div>

        </div>
      </div>`;
  }).join('')}
  </div>`;
}


