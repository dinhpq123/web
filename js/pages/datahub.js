// ── DATA HUB PAGE ──────────────────────────────────────────────────
let datahubTab = 'scada';

function renderDataHub() {
  return `
  <div class="page-header">
    <div class="page-title"><h1>Data Hub – Tích hợp & Quản lý AI</h1><p>Kết nối API, đồng bộ dữ liệu, nhập liệu KPI và cấu hình AI/RAG cho hệ thống</p></div>
    <div class="page-actions">
      <button class="btn btn-primary" onclick="openNewApiKey()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
        Tạo API Key
      </button>
    </div>
  </div>

  <!-- System Connection Status -->
  <div class="grid-auto" style="margin-bottom:16px">
    ${[
      { name: 'IoT / SCADA Thủy văn', protocol: 'MQTT + Modbus TCP', host: '192.168.10.100', status: 'connected', latency: '12ms', lastSync: '22:45' },
      { name: 'HLab Cảnh báo sớm (VNDMS)', protocol: 'REST API', host: 'canhbao.phongchongthientai.vn', status: 'connected', latency: '95ms', lastSync: '22:30' },
      { name: 'Dự báo thời tiết (NCHMF)', protocol: 'REST API', host: 'api.vnmha.gov.vn', status: 'connected', latency: '180ms', lastSync: '21:00' },
      { name: 'GIS Thủy lợi – Quốc gia', protocol: 'WMS/WFS (OGC)', host: 'gis.mard.gov.vn', status: 'partial', latency: '220ms', lastSync: '18:00' },
      { name: 'Hệ thống PCTT Quốc gia', protocol: 'REST API', host: 'pctt.mard.gov.vn', status: 'connected', latency: '145ms', lastSync: '20:30' },
      { name: 'Camera giám sát (CCTV)', protocol: 'RTSP / WebSocket', host: '192.168.50.10', status: 'error', latency: '—', lastSync: '19:45' },
    ].map(s => {
      const c = { connected: 'green', error: 'red', partial: 'yellow' }[s.status];
      const l = { connected: 'Kết nối', error: 'Lỗi kết nối', partial: 'Một phần' }[s.status];
      return `<div class="card" style="padding:16px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
          <div style="font-size:14px;font-weight:600">${s.name}</div>
          <span class="badge badge-${c === 'green' ? 'green' : c === 'red' ? 'red' : 'yellow'}">${l}</span>
        </div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:4px">Protocol: <span style="color:var(--text-2)">${s.protocol}</span></div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:8px">Host: <code style="color:var(--cyan);font-size:11px">${s.host}</code></div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted)">
          <span>Latency: <span class="mono" style="color:${s.latency === '—' ? 'var(--red)' : 'var(--green)'}">${s.latency}</span></span>
          <span>Sync: ${s.lastSync}</span>
        </div>
        <div style="margin-top:10px;display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" style="flex:1" onclick="showToast('Đang kiểm tra kết nối...')">Ping</button>
          <button class="btn btn-outline btn-sm" style="flex:1" onclick="showToast('Đang đồng bộ dữ liệu...')">Sync ngay</button>
        </div>
      </div>`;
    }).join('')}
  </div>

  <!-- Tabs -->
  ${(function() {
    const _dhTabs = [
      { id: 'apikeys',    label: 'Quản lý API Key',    icon: '<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>',  extra: '' },
      { id: 'templates',  label: 'Template Nhập liệu', icon: '<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>',                                       extra: '' },
      { id: 'synclog',    label: 'Lịch sử đồng bộ',  icon: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',  extra: '' },
      { id: 'kpiimport',  label: 'Nhập liệu KPI',    icon: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',          extra: ' <span style="background:#0066ff;color:#fff;font-size:9px;padding:1px 5px;border-radius:4px;margin-left:4px;font-weight:700">Mới</span>' },
      { id: 'kpihistory', label: 'Lịch sử Import KPI', icon: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>',                                                       extra: '' },
      { id: 'rag',        label: 'AI Chatbot & RAG',  icon: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>',  extra: '' },
      { id: 'aimodels',   label: 'AI & Mô hình',      icon: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',       extra: '' },
    ].filter(t => typeof isTabVisible === 'function' ? isTabVisible('datahub', t.id) : true);
    return `<div class="tabs">${_dhTabs.map((t, i) => `
      <button class="tab-btn${i === 0 ? ' active' : ''}" onclick="switchDhTab(this,'${t.id}')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle">${t.icon}</svg> ${t.label}${t.extra}</button>`).join('')}</div>`;
  })()}
  <div id="dhContent">${renderApiKeys()}</div>`;
}

function switchDhTab(btn, tab) {
  document.querySelectorAll('.tabs .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const renders = {
    apikeys: renderApiKeys, templates: renderTemplates, synclog: renderSyncLog,
    kpiimport: renderKpiImport, kpihistory: renderKpiHistory,
    rag: typeof renderSettingsRag === 'function' ? renderSettingsRag : () => '<div class="empty-state">RAG module not loaded</div>',
    aimodels: typeof renderSettingsAi === 'function' ? renderSettingsAi : () => '<div class="empty-state">AI Models module not loaded</div>',
  };
  document.getElementById('dhContent').innerHTML = (renders[tab] || renders.apikeys)();
}

function renderApiKeys() {
  const keys = [
    { key: 'hdw_live_aK7x...3nPm', name: 'SCADA & IoT Integration Key', scope: 'read:scada,write:alerts', created: '01/01/2026', lastUsed: '13/03/2026 22:30', status: 'active' },
    { key: 'hdw_live_bR2y...8qLs', name: 'VNDMS Cảnh báo sớm Key', scope: 'read:vndms,read:forecasts', created: '15/01/2026', lastUsed: '13/03/2026 20:00', status: 'active' },
    { key: 'hdw_live_cT5w...1kFz', name: 'NCHMF Dự báo thời tiết Key', scope: 'read:weather,read:hydrology', created: '01/02/2026', lastUsed: '13/03/2026 21:00', status: 'active' },
    { key: 'hdw_live_dU9v...6mBn', name: 'Hadiwa Mobile App Key', scope: 'read:pctt,write:reports', created: '10/02/2026', lastUsed: '13/03/2026 18:00', status: 'active' },
    { key: 'hdw_test_eW3x...9pRq', name: 'Test Key (DEV)', scope: '*', created: '15/02/2026', lastUsed: '10/03/2026', status: 'inactive' },
  ];
  return `
  <div class="card"><div class="table-wrap"><table>
    <thead><tr><th>API Key</th><th>Tên</th><th>Scope</th><th>Ngày tạo</th><th>Dùng lần cuối</th><th>Trạng thái</th><th></th></tr></thead>
    <tbody>
      ${keys.map(k => `<tr>
        <td class="mono" style="font-size:12px;color:var(--cyan)">${k.key}</td>
        <td style="font-weight:500">${k.name}</td>
        <td><code style="font-size:11px;background:rgba(0,200,255,.08);padding:2px 7px;border-radius:4px;color:var(--text-2)">${k.scope}</code></td>
        <td class="mono" style="font-size:12px;color:var(--muted)">${k.created}</td>
        <td class="mono" style="font-size:12px;color:var(--muted)">${k.lastUsed}</td>
        <td>${k.status === 'active' ? '<span class="badge badge-green">Hoạt động</span>' : '<span class="badge badge-gray">Tắt</span>'}</td>
        <td style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" onclick="showToast('Đã sao chép API Key!')">Copy</button>
          <button class="btn btn-danger btn-sm" onclick="showToast('Đã thu hồi key!')">Thu hồi</button>
        </td>
      </tr>`).join('')}
    </tbody>
  </table></div></div>`;
}

function renderTemplates() {
  const tmpls = [
    { name: 'Template_SuCo_DeDieu.xlsx', desc: 'Nhập liệu sự cố đê điều, vi phạm hành lang', updated: '15/02/2026', rows: 'Tối đa 500 dòng' },
    { name: 'Template_MucNuoc_MuaNgay.xlsx', desc: 'Nhập số liệu mực nước, lượng mưa 24h các trạm', updated: '10/02/2026', rows: 'Hàng ngày (mỗi trạm)' },
    { name: 'Template_VatTuDuPhong.xlsx', desc: 'Nhập liệu kho vật tư dự phòng PCTT (bao cát, rọ đá, cọc tre...)', updated: '01/02/2026', rows: 'Tối đa 200 dòng' },
    { name: 'Template_ThietBi_TramBom.xlsx', desc: 'Nhập liệu danh sách thiết bị trạm bơm, cống', updated: '20/01/2026', rows: 'Tối đa 300 dòng' },
    { name: 'Template_LichVanHanh_Ho.xlsx', desc: 'Nhập kịch bản vận hành hồ chứa theo mùa lũ', updated: '01/01/2026', rows: 'Theo hồ / mùa' },
    { name: 'Template_DuBaoLu.xlsx', desc: 'Nhập số liệu dự báo lũ từ NCHMF / VNDMS', updated: '01/01/2026', rows: 'Theo bản tin' },
    { name: 'Template_NhanSu_TrucLe.xlsx', desc: 'Nhập danh sách nhân sự trực lễ, trực đêm mùa bão lũ', updated: '05/02/2026', rows: 'Tối đa 100 dòng' },
  ];
  return `
  <div class="grid-auto">
    ${tmpls.map(t => `
    <div class="card" style="padding:16px;cursor:pointer" onclick="showToast('Đang tải xuống ${t.name}...')">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
        <div style="width:40px;height:40px;background:rgba(0,230,118,.1);border:1px solid rgba(0,230,118,.2);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:18px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>
        <div>
          <div style="font-size:13px;font-weight:600">${t.name}</div>
          <div style="font-size:11px;color:var(--muted)">${t.rows}</div>
        </div>
      </div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:10px">${t.desc}</div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:11px;color:var(--muted)">Cập nhật: ${t.updated}</span>
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();showToast('Đang tải xuống...')">⬇ Tải về</button>
      </div>
    </div>`).join('')}
  </div>`;
}

function renderSyncLog() {
  const logs = [
    { source: 'SCADA/PLC', action: 'Đồng bộ dữ liệu áp lực & lưu lượng', records: 256, status: 'success', time: '22:30 27/02' },
    { source: 'Kế toán ERP', action: 'Đồng bộ dữ liệu doanh thu tháng 2', records: 1842, status: 'success', time: '22:00 27/02' },
    { source: 'Ngân hàng VietinBank', action: 'Đối soát thanh toán thu hộ', records: 0, status: 'error', time: '20:15 27/02' },
    { source: 'SCADA/PLC', action: 'Đồng bộ dữ liệu trạm Vân Đồn', records: 0, status: 'partial', time: '20:00 27/02' },
    { source: 'GIS Server', action: 'Cập nhật tọa độ tuyến ống mới', records: 45, status: 'success', time: '18:00 27/02' },
    { source: 'Kế toán ERP', action: 'Đồng bộ danh sách hợp đồng', records: 12, status: 'success', time: '08:00 27/02' },
  ];
  return `
  <div class="card"><div class="table-wrap"><table>
    <thead><tr><th>Nguồn</th><th>Hành động</th><th>Số bản ghi</th><th>Trạng thái</th><th>Thời gian</th></tr></thead>
    <tbody>
      ${logs.map(l => `<tr>
        <td style="font-weight:500">${l.source}</td>
        <td style="font-size:13px">${l.action}</td>
        <td class="mono">${l.records.toLocaleString()}</td>
        <td>${l.status === 'success' ? '<span class="badge badge-green">Thành công</span>' : l.status === 'error' ? '<span class="badge badge-red">Lỗi</span>' : '<span class="badge badge-yellow">Một phần</span>'}</td>
        <td class="mono" style="font-size:12px;color:var(--muted)">${l.time}</td>
      </tr>`).join('')}
    </tbody>
  </table></div></div>`;
}

function openNewApiKey() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Tạo API Key mới</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-group" style="margin-bottom:16px"><label class="form-label">Tên API Key</label><input class="form-control" placeholder="VD: Mobile App Integration Key"></div>
    <div class="form-group" style="margin-bottom:16px"><label class="form-label">Môi trường</label>
      <select class="form-control"><option>Production (live)</option><option>Staging</option><option>Development (test)</option></select>
    </div>
    <div class="form-group" style="margin-bottom:16px"><label class="form-label">Quyền truy cập (Scope)</label>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px">
        ${['read:scada', 'write:scada', 'read:customers', 'write:customers', 'read:revenue', 'read:hrm', 'write:alerts', 'read:reports'].map(s => `
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px">
          <input type="checkbox" style="accent-color:var(--cyan)"> ${s}
        </label>`).join('')}
      </div>
    </div>
    <div class="form-group"><label class="form-label">Hết hạn sau</label>
      <select class="form-control"><option>30 ngày</option><option>90 ngày</option><option>1 năm</option><option>Không giới hạn</option></select>
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Hủy</button><button class="btn btn-primary" onclick="closeModal();showToast('API Key đã được tạo thành công!')">Tạo API Key</button></div>`);
}

// ══════════════════════════════════════════════════════════
// KPI BUSINESS DATA IMPORT
// ══════════════════════════════════════════════════════════
let kpiUploadedFiles = [];

function renderKpiImport() {
  return `
  <div style="background:linear-gradient(135deg,rgba(0,102,255,.12),rgba(0,200,255,.06));border:1px solid rgba(0,102,255,.25);border-radius:12px;padding:18px 22px;margin-bottom:20px;display:flex;align-items:flex-start;gap:16px">
    <div style="width:44px;height:44px;background:linear-gradient(135deg,#0050cc,#00c8ff);border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 14px rgba(0,102,255,.35)">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    </div>
    <div style="flex:1">
      <div style="font-size:15px;font-weight:700;color:#e2e8f0;margin-bottom:5px">Nhập liệu KPI / Báo cáo PCTT</div>
      <div style="font-size:13px;color:var(--muted);line-height:1.6">Upload file báo cáo, bảng số liệu từ các nguồn (Excel, PDF, CSV, DOCX, ảnh...). AI tự động bóc tách chỉ số PCTT, chuẩn hóa và cho bạn xác nhận trước khi import vào Dashboard và báo cáo định kỳ.</div>
    </div>
    <button onclick="kpiGuideModal()" style="flex-shrink:0;padding:8px 14px;background:rgba(0,102,255,.15);border:1px solid rgba(0,102,255,.3);border-radius:8px;color:#60a5fa;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;display:flex;align-items:center;gap:6px">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      Hướng dẫn &amp; Template
    </button>
  </div>

  <div class="card" style="margin-bottom:16px">
    <div class="card-header">
      <span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2" style="vertical-align:middle"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Bước 1 — Chọn kỳ báo cáo &amp; chỉ số KPI</span>
      <span style="font-size:11px;color:var(--muted);background:rgba(0,200,255,.08);padding:3px 9px;border-radius:5px">Bắt buộc</span>
    </div>
    <div class="card-body" style="display:grid;grid-template-columns:220px 1fr;gap:24px">
      <div>
        <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.8px;text-transform:uppercase;margin-bottom:10px">Kỳ báo cáo</div>
        ${[['day', 'Theo ngày', 'Hàng ngày'], ['week', 'Theo tuần', '7 ngày'], ['month', 'Theo tháng', 'Phổ biến'], ['quarter', 'Theo quý', 'Q1–Q4'], ['year', 'Cả năm', 'Tổng kết']].map(([v, label, sub]) => `
        <label style="display:flex;align-items:center;gap:10px;padding:8px 11px;border-radius:8px;cursor:pointer;border:1px solid ${v === 'month' ? 'rgba(0,200,255,.35)' : 'rgba(255,255,255,.06)'};background:${v === 'month' ? 'rgba(0,200,255,.07)' : 'rgba(0,0,0,.12)'};margin-bottom:5px;transition:.2s" id="kpiPeriodLbl_${v}" onclick="kpiSetPeriod('${v}')">
          <input type="radio" name="kpiPeriod" value="${v}" ${v === 'month' ? 'checked' : ''} style="accent-color:var(--cyan)">
          <div><div style="font-size:12px;font-weight:500">${label}</div><div style="font-size:10px;color:var(--muted)">${sub}</div></div>
        </label>`).join('')}
        <div style="display:flex;gap:6px;margin-top:10px">
          <div style="flex:1"><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:3px">Năm</label>
            <select class="form-control" id="kpiYear" style="font-size:12px">${[2026, 2025, 2024, 2023].map(y => `<option ${y === 2026 ? 'selected' : ''}>${y}</option>`).join('')}</select></div>
          <div style="flex:1" id="kpiMonthWrap"><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:3px">Tháng</label>
            <select class="form-control" id="kpiMonth" style="font-size:12px">${Array.from({ length: 12 }, (_, i) => `<option ${i === 1 ? 'selected' : ''}>Tháng ${i + 1}</option>`).join('')}</select></div>
        </div>
      </div>
      <div>
        <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.8px;text-transform:uppercase;margin-bottom:10px">Chỉ số KPI cần nhập</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px">
          ${[['su_co', 'Số vụ sự cố đê', 'Vụ ghi nhận', true], ['muc_nuoc', 'Mực nước max (sông Hồng)', 'm (tại Hà Nội)', true], ['luong_mua', 'Lượng mưa tích lũy', 'mm/24h (bình quân)', true], ['ho_di_doi', 'Số hộ phải di dời', 'Hộ', true], ['thiet_hai', 'Thiệt hại ước tính', 'Triệu VNĐ', false], ['luc_luong', 'Tổng lực lượng tham gia', 'Người', false], ['cong_trinh', 'Công trình xử lý khẩn', 'Điểm xử lý', false], ['chi_phi', 'Chi phí ƯCSC', 'Triệu VNĐ', false], ['van_ban', 'Văn bản chỉ đạo ban hành', 'Văn bản', false], ['nhan_su', 'Nhân sự trực ban', 'Người/ca', false]].map(([id, name, hint, checked]) => `
          <label style="display:flex;align-items:flex-start;gap:8px;padding:9px;border-radius:8px;cursor:pointer;border:1px solid rgba(255,255,255,.06);background:rgba(0,0,0,.12);transition:.2s" onmouseover="this.style.borderColor='rgba(0,200,255,.2)'" onmouseout="this.style.borderColor='rgba(255,255,255,.06)'">
            <input type="checkbox" id="kpick_${id}" ${checked ? 'checked' : ''} style="accent-color:var(--cyan);margin-top:2px">
            <div><div style="font-size:12px;font-weight:600">${name}</div><div style="font-size:10px;color:var(--muted)">${hint}</div></div>
          </label>`).join('')}
        </div>
        <div style="margin-top:10px;padding:9px 13px;background:rgba(255,202,40,.05);border:1px solid rgba(255,202,40,.14);border-radius:8px;font-size:11px;color:rgba(255,202,40,.85);line-height:1.6">
          AI sẽ đọc file và cố gắng bóc tách <b>tất cả chỉ số được chọn</b>. Chỉ số không tìm thấy sẽ để trống để nhập thủ công.
        </div>
      </div>
    </div>
  </div>

  <div class="card" style="margin-bottom:16px">
    <div class="card-header">
      <span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2" style="vertical-align:middle"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Bước 2 — Upload file dữ liệu</span>
      <div style="display:flex;gap:4px;flex-wrap:wrap">${['Excel', 'CSV', 'PDF', 'Word', 'Ảnh JPG/PNG'].map(f => `<span style="font-size:10px;background:rgba(0,200,255,.07);border:1px solid rgba(0,200,255,.14);padding:2px 7px;border-radius:4px;color:var(--muted)">${f}</span>`).join('')}</div>
    </div>
    <div class="card-body">
      <div id="kpiDropZone" style="border:2px dashed rgba(0,102,255,.3);border-radius:12px;padding:36px 24px;text-align:center;background:rgba(0,102,255,.04);cursor:pointer;transition:.2s"
        onclick="document.getElementById('kpiFileInput').click()"
        ondragover="event.preventDefault();this.style.borderColor='var(--cyan)';this.style.background='rgba(0,200,255,.08)'"
        ondragleave="this.style.borderColor='rgba(0,102,255,.3)';this.style.background='rgba(0,102,255,.04)'"
        ondrop="kpiHandleDrop(event)">
        <input type="file" id="kpiFileInput" multiple accept=".xlsx,.xls,.csv,.pdf,.docx,.doc,.jpg,.jpeg,.png" style="display:none" onchange="kpiHandleFiles(this.files)">
        <div style="width:52px;height:52px;background:linear-gradient(135deg,rgba(0,102,255,.2),rgba(0,200,255,.1));border-radius:13px;display:flex;align-items:center;justify-content:center;margin:0 auto 12px">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="1.8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        </div>
        <div style="font-size:14px;font-weight:600;color:#e2e8f0;margin-bottom:5px">Kéo &amp; thả file vào đây</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:10px">hoặc click để chọn từ máy tính</div>
        <div style="font-size:11px;color:rgba(96,165,250,.7)">Excel, CSV, PDF, Word, JPG, PNG · Tối đa 20 MB · Nhiều file cùng lúc</div>
      </div>
      <div id="kpiFileList" style="margin-top:10px;display:flex;flex-direction:column;gap:5px"></div>
      <div style="margin-top:14px;display:flex;gap:10px;align-items:center">
        <button onclick="kpiStartAiProcess()" style="padding:10px 22px;background:linear-gradient(135deg,#0050cc,#00c8ff);color:#fff;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:8px;box-shadow:0 4px 16px rgba(0,102,255,.35);transition:opacity .2s" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          Phân tích &amp; Trích xuất bằng AI
        </button>
        <span style="font-size:11px;color:var(--muted)">AI đọc nội dung file và tự động điền các chỉ số KPI</span>
      </div>
    </div>
  </div>
  <div id="kpiAiResult"></div>`;
}

function kpiSetPeriod(v) {
  document.querySelectorAll('[id^="kpiPeriodLbl_"]').forEach(el => {
    const on = el.id === 'kpiPeriodLbl_' + v;
    el.style.borderColor = on ? 'rgba(0,200,255,.35)' : 'rgba(255,255,255,.06)';
    el.style.background = on ? 'rgba(0,200,255,.07)' : 'rgba(0,0,0,.12)';
  });
  const mw = document.getElementById('kpiMonthWrap');
  if (mw) mw.style.display = ['day', 'week', 'month'].includes(v) ? '' : 'none';
}

function kpiHandleDrop(e) {
  e.preventDefault();
  const z = document.getElementById('kpiDropZone');
  if (z) { z.style.borderColor = 'rgba(0,102,255,.3)'; z.style.background = 'rgba(0,102,255,.04)'; }
  kpiHandleFiles(e.dataTransfer.files);
}

function kpiHandleFiles(files) {
  const list = document.getElementById('kpiFileList');
  if (!list) return;
  const colors = { xlsx: '#00e676', xls: '#00e676', csv: '#00e676', pdf: '#ff6d00', docx: '#60a5fa', doc: '#60a5fa', jpg: '#ff4081', jpeg: '#ff4081', png: '#ff4081' };
  Array.from(files).forEach(f => {
    if (kpiUploadedFiles.find(x => x.name === f.name)) return;
    kpiUploadedFiles.push(f);
    const ext = f.name.split('.').pop().toLowerCase();
    const c = colors[ext] || 'var(--cyan)';
    const sz = f.size < 1048576 ? (f.size / 1024).toFixed(0) + ' KB' : (f.size / 1048576).toFixed(1) + ' MB';
    const id = 'kf_' + Date.now() + Math.random().toString(36).slice(2, 5);
    const fn = f.name.replace(/'/g, "\\'");
    const el = document.createElement('div');
    el.id = id;
    el.style.cssText = 'display:flex;align-items:center;gap:10px;padding:9px 13px;background:rgba(0,0,0,.2);border:1px solid rgba(255,255,255,.07);border-radius:8px';
    el.innerHTML = `<div style="width:32px;height:32px;background:${c}18;border:1px solid ${c}33;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;color:${c}">${ext.toUpperCase()}</div>
      <div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${f.name}</div><div style="font-size:10px;color:var(--muted)">${sz}</div></div>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <button onclick="document.getElementById('${id}').remove();kpiUploadedFiles=kpiUploadedFiles.filter(x=>x.name!=='${fn}')" style="background:none;border:none;color:var(--muted);cursor:pointer;padding:3px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`;
    list.appendChild(el);
  });
}

function kpiStartAiProcess() {
  const result = document.getElementById('kpiAiResult');
  if (!result) return;
  const steps = [
    ['<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>', 'Đọc và giải mã định dạng file...'],
    ['<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>', 'Phân tích cấu trúc dữ liệu PCTT...'],
    ['<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>', 'Nhận diện các chỉ số KPI bằng NLP...'],
    ['<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>', 'Làm sạch và chuẩn hóa đơn vị đo...'],
    ['<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>', 'Ánh xạ vào schema hệ thống Hadiwa...'],
    ['<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00e676" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>', 'Kiểm tra tính nhất quán &amp; phát hiện ngoại lệ...'],
  ];
  result.innerHTML = `<div class="card"><div class="card-header"><span class="card-title" style="color:var(--cyan)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> Bước 3 — AI đang phân tích dữ liệu PCTT...</span></div>
    <div class="card-body"><div id="kpiAiSteps" style="display:flex;flex-direction:column;gap:8px;margin-bottom:18px"></div>
    <div style="background:rgba(0,0,0,.2);border-radius:8px;height:8px;overflow:hidden;margin-bottom:6px"><div id="kpiAiProg" style="height:100%;width:0%;background:linear-gradient(90deg,#0050cc,#00c8ff);border-radius:8px;transition:width .5s ease"></div></div>
    <div id="kpiAiPct" style="font-size:11px;color:var(--muted);text-align:center">0%</div></div></div>`;
  let i = 0;
  function next() {
    if (i >= steps.length) { setTimeout(kpiShowExtractedData, 500); return; }
    const [icon, text] = steps[i];
    const d = document.createElement('div');
    d.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 12px;background:rgba(0,200,255,.05);border:1px solid rgba(0,200,255,.12);border-radius:8px;font-size:12px;opacity:0;transition:opacity .3s';
    d.innerHTML = `<span style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;background:rgba(0,200,255,.1);border-radius:5px;flex-shrink:0;color:var(--cyan)">${icon}</span><span style="color:var(--text-2)">${text}</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" style="margin-left:auto"><polyline points="20 6 9 17 4 12"/></svg>`;
    document.getElementById('kpiAiSteps').appendChild(d);
    requestAnimationFrame(() => { d.style.opacity = '1'; });
    i++;
    const pct = Math.round(i / steps.length * 100);
    const p = document.getElementById('kpiAiProg'), t = document.getElementById('kpiAiPct');
    if (p) p.style.width = pct + '%'; if (t) t.textContent = pct + '%';
    setTimeout(next, 620 + Math.random() * 380);
  }
  next();
}

function kpiShowExtractedData() {
  const year = document.getElementById('kpiYear')?.value || '2026';
  const month = document.getElementById('kpiMonth')?.value || 'Tháng 2';
  const ROWS = [
    { kpi: 'Số vụ sự cố đê', unit: 'Vụ', raw: '3', clean: '3', conf: 98, st: 'ok' },
    { kpi: 'Mực nước max (sông Hồng)', unit: 'm', raw: '9.28', clean: '9.28', conf: 97, st: 'ok' },
    { kpi: 'Lượng mưa tích lũy', unit: 'mm/24h', raw: '128.5', clean: '128.5', conf: 95, st: 'ok' },
    { kpi: 'Số hộ phải di dời', unit: 'Hộ', raw: '124', clean: '124', conf: 91, st: 'ok' },
    { kpi: 'Chi phí ƯCSC', unit: 'Triệu đ', raw: '2850', clean: '2,850', conf: 84, st: 'warn' },
    { kpi: 'Công trình xử lý khẩn', unit: 'Điểm', raw: '7', clean: '7', conf: 82, st: 'ok' },
    { kpi: 'Văn bản chỉ đạo ban hành', unit: 'Văn bản', raw: '12', clean: '12', conf: 75, st: 'warn' },
    { kpi: 'Nhân sự trực ban', unit: 'Người/ca', raw: '', clean: '', conf: 0, st: 'missing' },
  ];
  const result = document.getElementById('kpiAiResult');
  if (!result) return;
  result.innerHTML = `<div class="card" style="margin-top:16px">
    <div class="card-header" style="background:linear-gradient(135deg,rgba(0,230,118,.06),transparent);border-bottom:1px solid rgba(0,230,118,.15)">
      <span class="card-title" style="color:var(--green)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Bước 3 — Dữ liệu đã trích xuất — Kiểm tra &amp; xác nhận</span>
      <div style="display:flex;gap:8px;align-items:center">
        <span style="font-size:11px;color:var(--muted)">Kỳ: <b style="color:var(--text)">${month}/${year}</b></span>
        <button onclick="kpiConfirmImport()" style="padding:6px 16px;background:var(--green);color:#071629;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer">✓ Xác nhận &amp; Import</button>
      </div>
    </div>
    <div style="background:rgba(255,202,40,.05);border-bottom:1px solid rgba(255,202,40,.12);padding:9px 18px;font-size:12px;color:rgba(255,202,40,.9)">Kiểm tra chỉ số có độ tin cậy thấp. Bạn có thể chỉnh sửa trực tiếp trước khi xác nhận.</div>
    <div class="table-wrap"><table><thead><tr><th>Chỉ số KPI</th><th>Đơn vị</th><th>Giá trị gốc</th><th>Giá trị chuẩn hóa</th><th>Kỳ</th><th>Độ tin cậy AI</th><th>Trạng thái</th></tr></thead><tbody>
      ${ROWS.map((r, idx) => `<tr>
        <td style="font-weight:600">${r.kpi}</td>
        <td><code style="font-size:11px;color:var(--muted)">${r.unit}</code></td>
        <td class="mono" style="font-size:12px;color:var(--muted)">${r.raw || '<span style="color:var(--red)">Không tìm thấy</span>'}</td>
        <td><input value="${r.clean}" id="kpiVal_${idx}" style="background:rgba(0,200,255,.07);border:1px solid rgba(0,200,255,.18);border-radius:6px;padding:4px 9px;font-size:12px;color:var(--text);font-family:monospace;width:120px" ${r.st === 'missing' ? 'placeholder="Nhập thủ công..."' : ''}></td>
        <td style="font-size:12px;color:var(--muted)">${month}/${year}</td>
        <td><div style="display:flex;align-items:center;gap:6px"><div style="flex:1;height:5px;background:rgba(255,255,255,.08);border-radius:3px;min-width:54px"><div style="height:100%;width:${r.conf}%;background:${r.conf >= 90 ? 'var(--green)' : r.conf >= 70 ? 'var(--yellow)' : 'var(--red)'};border-radius:3px"></div></div><span style="font-size:11px;font-family:monospace;color:${r.conf >= 90 ? 'var(--green)' : r.conf >= 70 ? 'var(--yellow)' : 'var(--red)'}">${r.conf}%</span></div></td>
        <td>${r.st === 'ok' ? '<span class="badge badge-green">Đã trích xuất</span>' : r.st === 'warn' ? '<span class="badge badge-yellow">Cần kiểm tra</span>' : '<span class="badge badge-red">Thiếu – Nhập tay</span>'}</td>
      </tr>`).join('')}
    </tbody></table></div>
    <div class="card-body" style="padding-top:0;display:flex;justify-content:flex-end;gap:10px">
      <button onclick="kpiStartAiProcess()" class="btn btn-ghost"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Phân tích lại</button>
      <button onclick="kpiConfirmImport()" style="padding:9px 22px;background:var(--green);color:#071629;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer">✓ Xác nhận &amp; Import vào hệ thống</button>
    </div>
  </div>`;
}

function kpiConfirmImport() {
  const year = document.getElementById('kpiYear')?.value || '2026';
  const month = document.getElementById('kpiMonth')?.value || 'Tháng 2';
  openModal(`<div class="modal-header"><span class="modal-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Xác nhận Import KPI vào hệ thống</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div style="background:rgba(0,230,118,.06);border:1px solid rgba(0,230,118,.2);border-radius:10px;padding:15px;margin-bottom:16px;font-size:13px;line-height:1.7">
      <b style="color:var(--green)">Tóm tắt dữ liệu sẽ được import:</b><br>
      <span style="color:var(--muted)">· <b>7 chỉ số KPI</b> đã trích xuất thành công<br>· <b>1 chỉ số</b> cần nhập thủ công (Cuộc gọi CSKH)<br>· Kỳ báo cáo: <b>${month}/${year}</b><br>· Dùng cho: Dashboard KPI, Báo cáo định kỳ, Đánh giá mục tiêu</span>
    </div>
    <div style="padding:10px 14px;background:rgba(255,202,40,.05);border:1px solid rgba(255,202,40,.15);border-radius:8px;font-size:12px;color:rgba(255,202,40,.9);margin-bottom:16px">Hành động này sẽ <b>ghi đè</b> dữ liệu KPI hiện tại cho ${month}/${year}. Dữ liệu cũ được lưu vào lịch sử phiên bản.</div>
    <div class="form-group"><label class="form-label">Ghi chú nhập liệu (tuỳ chọn)</label><textarea class="form-control" rows="2" placeholder="VD: Số liệu từ báo cáo tài chính nội bộ ${month}/${year}, phê duyệt bởi Ban Giám đốc..."></textarea></div>
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Hủy, kiểm tra lại</button><button class="btn btn-primary" onclick="closeModal();showKpiOtpModal()" style="background:var(--green);border-color:var(--green)">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    Tiếp tục & Xác thực OTP
  </button></div>`);
}

function showKpiOtpModal() {
  openModal(`<div class="modal-header">
    <span class="modal-title">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2" style="vertical-align:middle"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      Xác thực 2 lớp — Nhập OTP
    </span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body">
    <!-- Shield icon + context -->
    <div style="text-align:center;margin-bottom:20px">
      <div style="width:60px;height:60px;background:linear-gradient(135deg,rgba(0,102,255,.2),rgba(0,200,255,.1));border:2px solid rgba(0,102,255,.3);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 12px">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <div style="font-size:14px;font-weight:700;color:#e2e8f0;margin-bottom:5px">Xác thực 2 lớp bắt buộc</div>
      <div style="font-size:12px;color:var(--muted);line-height:1.6">Hành động <b style="color:var(--yellow)">Import KPI vào hệ thống</b> yêu cầu xác thực 2FA.<br>Mã OTP đã được gửi đến:</div>
    </div>
    <!-- Method selector -->
    <div style="display:flex;gap:8px;margin-bottom:18px;justify-content:center">
      ${[['totp', 'Authenticator App', 'TOTP', true], ['sms', 'SMS', '****1234', false], ['email', 'Email', 'lb***@pctt.hanoi.gov.vn', false]].map(([id, label, dest, active]) => `
      <button id="kpiOtpMethod_${id}" onclick="kpiSelectOtpMethod('${id}')" style="padding:7px 13px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid ${active ? 'rgba(0,200,255,.4)' : 'rgba(255,255,255,.1)'};background:${active ? 'rgba(0,200,255,.1)' : 'transparent'};color:${active ? 'var(--cyan)' : 'var(--muted)'};transition:.2s">
        ${label}<br><span style="font-size:10px;font-weight:400;opacity:.7">${dest}</span>
      </button>`).join('')}
    </div>
    <!-- OTP input boxes -->
    <div style="display:flex;gap:10px;justify-content:center;margin-bottom:8px" id="kpiOtpBoxes">
      ${Array.from({ length: 6 }, (_, i) => `<input id="kpiOtp${i}" type="text" maxlength="1" inputmode="numeric"
        style="width:44px;height:52px;text-align:center;font-size:22px;font-weight:700;font-family:'Roboto Mono',monospace;background:rgba(0,0,0,.25);border:2px solid rgba(0,200,255,.2);border-radius:10px;color:var(--cyan);outline:none;transition:.2s"
        onfocus="this.style.borderColor='rgba(0,200,255,.7)';this.style.background='rgba(0,200,255,.06)'"
        onblur="this.style.borderColor='rgba(0,200,255,.2)';this.style.background='rgba(0,0,0,.25)'"
        oninput="kpiOtpInput(this,${i})"
        onkeydown="kpiOtpKeydown(this,${i},event)">`).join('')}
    </div>
    <div style="text-align:center;font-size:11px;color:var(--muted);margin-bottom:6px">Nhập mã 6 chữ số từ ứng dụng Authenticator</div>
    <!-- Error msg -->
    <div id="kpiOtpError" style="text-align:center;font-size:12px;color:var(--red);min-height:18px;margin-bottom:4px"></div>
    <!-- Resend -->
    <div style="text-align:center">
      <span style="font-size:12px;color:var(--muted)">Không nhận được mã? </span>
      <button id="kpiOtpResend" onclick="kpiResendOtp()" style="background:none;border:none;color:var(--cyan);font-size:12px;cursor:pointer;font-weight:600" disabled>Gửi lại (<span id="kpiOtpTimer">60</span>s)</button>
    </div>
  </div>
  <div class="modal-footer" style="flex-direction:column;gap:10px">
    <div style="display:flex;gap:10px;width:100%">
      <button class="btn btn-ghost" onclick="closeModal()" style="flex:1">Hủy</button>
      <button onclick="kpiVerifyOtp()" style="flex:2;padding:10px;background:linear-gradient(135deg,#0050cc,#00c8ff);color:#fff;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg>
        Xác nhận OTP & Import
      </button>
    </div>
    <div style="font-size:11px;color:var(--muted);text-align:center;width:100%">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      Action Import KPI được bảo vệ theo cài đặt tại <b>Settings → Bảo mật → Actions 2FA</b>
    </div>
  </div>`);

  // Focus first box and start timer
  setTimeout(() => {
    const f = document.getElementById('kpiOtp0');
    if (f) f.focus();
    kpiStartOtpTimer();
  }, 100);
}

function kpiSelectOtpMethod(id) {
  ['totp', 'sms', 'email'].forEach(m => {
    const b = document.getElementById('kpiOtpMethod_' + m);
    if (!b) return;
    const on = m === id;
    b.style.borderColor = on ? 'rgba(0,200,255,.4)' : 'rgba(255,255,255,.1)';
    b.style.background = on ? 'rgba(0,200,255,.1)' : 'transparent';
    b.style.color = on ? 'var(--cyan)' : 'var(--muted)';
  });
  if (id !== 'totp') showToast('Đã gửi lại OTP qua ' + (id === 'sms' ? 'SMS' : 'Email') + '!');
}

let _kpiOtpTimerRef = null;
function kpiStartOtpTimer() {
  let s = 60;
  const btn = document.getElementById('kpiOtpResend');
  const span = document.getElementById('kpiOtpTimer');
  if (!btn || !span) return;
  _kpiOtpTimerRef = setInterval(() => {
    s--;
    if (span) span.textContent = s;
    if (s <= 0) {
      clearInterval(_kpiOtpTimerRef);
      if (btn) { btn.disabled = false; btn.textContent = 'Gửi lại'; }
    }
  }, 1000);
}

function kpiResendOtp() {
  const btn = document.getElementById('kpiOtpResend');
  if (btn) { btn.disabled = true; btn.innerHTML = 'Gửi lại (<span id="kpiOtpTimer">60</span>s)'; }
  // Reset all inputs
  for (let i = 0; i < 6; i++) { const b = document.getElementById('kpiOtp' + i); if (b) b.value = ''; }
  const f = document.getElementById('kpiOtp0'); if (f) f.focus();
  showToast('Đã gửi lại mã OTP!');
  kpiStartOtpTimer();
}

function kpiOtpInput(el, idx) {
  el.value = el.value.replace(/[^0-9]/g, '').slice(-1);
  if (el.value && idx < 5) {
    const next = document.getElementById('kpiOtp' + (idx + 1));
    if (next) next.focus();
  }
  // Auto-submit when all 6 filled
  const code = Array.from({ length: 6 }, (_, i) => document.getElementById('kpiOtp' + i)?.value || '').join('');
  if (code.length === 6) kpiVerifyOtp();
}

function kpiOtpKeydown(el, idx, e) {
  if (e.key === 'Backspace' && !el.value && idx > 0) {
    const prev = document.getElementById('kpiOtp' + (idx - 1));
    if (prev) { prev.value = ''; prev.focus(); }
  }
}

function kpiVerifyOtp() {
  const code = Array.from({ length: 6 }, (_, i) => document.getElementById('kpiOtp' + i)?.value || '').join('');
  const errEl = document.getElementById('kpiOtpError');
  if (code.length < 6) {
    if (errEl) errEl.textContent = '⚠ Vui lòng nhập đủ 6 chữ số.';
    return;
  }
  // Demo: accept "123456" or any 6-digit code starting with 1
  if (code === '000000') {
    if (errEl) { errEl.textContent = '✕ Mã OTP không đúng. Vui lòng thử lại.'; errEl.style.color = 'var(--red)'; }
    for (let i = 0; i < 6; i++) { const b = document.getElementById('kpiOtp' + i); if (b) { b.value = ''; b.style.borderColor = 'rgba(255,23,68,.5)'; } }
    const f = document.getElementById('kpiOtp0'); if (f) f.focus();
    return;
  }
  // Success
  clearInterval(_kpiOtpTimerRef);
  closeModal();
  kpiImportSuccess();
}


function kpiImportSuccess() {
  showToast('<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Import KPI thành công! Dashboard đã được cập nhật.');
  kpiUploadedFiles = [];
  const r = document.getElementById('kpiAiResult');
  if (r) r.innerHTML = `<div style="text-align:center;padding:40px;background:rgba(0,230,118,.05);border:1px solid rgba(0,230,118,.15);border-radius:12px;margin-top:16px">
    <div style="width:52px;height:52px;background:rgba(0,230,118,.15);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 12px"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>
    <div style="font-size:16px;font-weight:700;color:var(--green);margin-bottom:5px">Import hoàn tất!</div>
    <div style="font-size:13px;color:var(--muted)">7 chỉ số KPI đã được lưu vào hệ thống.<br>Dashboard KPI và báo cáo đã được cập nhật tự động.</div>
    <button onclick="navigate('dashboard')" style="margin-top:16px;padding:9px 22px;background:var(--green);color:#071629;border:none;border-radius:9px;font-weight:700;cursor:pointer">Xem Dashboard KPI</button>
  </div>`;
}

function kpiGuideModal() {
  openModal(`<div class="modal-header"><span class="modal-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2" style="vertical-align:middle"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Hướng dẫn & Template Nhập liệu KPI</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body" style="max-height:70vh;overflow-y:auto">
    <div style="background:rgba(0,102,255,.08);border:1px solid rgba(0,102,255,.2);border-radius:10px;padding:15px;margin-bottom:18px">
      <div style="font-size:13px;font-weight:700;color:#60a5fa;margin-bottom:7px">Tại sao cần nhập liệu KPI?</div>
      <p style="font-size:12px;color:var(--muted);line-height:1.7;margin:0">Hệ thống Hadiwa IOC cần dữ liệu KPI thiên tai thực tế để hiển thị chính xác trên Dashboard lãnh đạo, tạo báo cáo định kỳ và đánh giá tiến độ mục tiêu PCTT. Upload trực tiếp từ nguồn dữ liệu hiện có, không cần nhập tay từng chỉ số.</p>
    </div>
    <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:12px">Quy trình 3 bước</div>
    ${[['1', '#0066ff', 'Chọn kỳ & chỉ số', 'Chọn tháng/quý/năm và đánh dấu các chỉ số KPI cần nhập.'], ['2', '#00c8ff', 'Upload file', 'Excel, CSV, PDF, Word, ảnh chụp màn hình. Không cần chuyển đổi định dạng.'], ['3', '#00e676', 'AI xử lý & xác nhận', 'AI tự đọc file, nhận diện và chuẩn hóa. Bạn kiểm tra rồi xác nhận import.']].map(([n, c, t, d]) => `<div style="display:flex;gap:12px;margin-bottom:12px"><div style="width:30px;height:30px;background:${c}22;border:2px solid ${c}44;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:${c};flex-shrink:0">${n}</div><div><div style="font-size:13px;font-weight:600;margin-bottom:2px">${t}</div><div style="font-size:12px;color:var(--muted);line-height:1.6">${d}</div></div></div>`).join('')}
    <div style="background:rgba(255,202,40,.06);border:1px solid rgba(255,202,40,.15);border-radius:10px;padding:13px;margin-bottom:18px">
      <div style="font-size:12px;font-weight:700;color:rgba(255,202,40,.9);margin-bottom:7px">Mẹo để AI nhận diện chính xác hơn</div>
      <ul style="font-size:12px;color:var(--muted);line-height:1.8;padding-left:14px;margin:0"><li>Ưu tiên Excel có cấu trúc bảng rõ ràng, tên cột tiếng Việt kèm đơn vị</li><li>Không gộp ô (merge cell) ở hàng tiêu đề</li><li>PDF/ảnh: chụp rõ nét, không bị nhòe</li><li>Nếu file nhiều sheet, AI tự tìm sheet liên quan nhất</li></ul>
    </div>
    <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:12px">Tải về file mẫu chuẩn</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      ${[['Template_KPI_Thang.xlsx', 'KPI theo tháng', 'Doanh thu, sản lượng, NRW', '#00e676', 'XLS'], ['Template_KPI_Quy.xlsx', 'KPI theo quý', 'Tổng hợp Q1–Q4', '#00e676', 'XLS'], ['Template_KPI_Nam.xlsx', 'KPI cả năm', 'Tổng kết & mục tiêu', '#00e676', 'XLS'], ['Template_KPI_Ngay.xlsx', 'KPI theo ngày', 'Sản lượng, áp lực', '#00e676', 'XLS'], ['Huong_Dan_Nhap_KPI.pdf', 'Hướng dẫn PDF', 'Chi tiết có hình ảnh', '#ff6d00', 'PDF'], ['Mau_KPI_Chup.png', 'Ảnh màn hình mẫu', 'Ví dụ báo cáo chụp', '#ff4081', 'IMG']].map(([name, title, desc, color, lbl]) => `
      <div style="border:1px solid rgba(255,255,255,.08);border-radius:9px;padding:11px;cursor:pointer;transition:.2s" onclick="showToast('Đang tải về ${name}...')" onmouseover="this.style.borderColor='rgba(0,200,255,.2)'" onmouseout="this.style.borderColor='rgba(255,255,255,.08)'">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px"><div style="width:28px;height:28px;background:${color}18;border:1px solid ${color}33;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;color:${color}">${lbl}</div><div style="font-size:12px;font-weight:600">${title}</div></div>
        <div style="font-size:11px;color:var(--muted);margin-bottom:7px">${desc}</div>
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();showToast('Đang tải về ${name}...')" style="width:100%;font-size:11px">⬇ Tải về</button>
      </div>`).join('')}
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Đóng</button><button class="btn btn-primary" onclick="closeModal()">Bắt đầu nhập liệu</button></div>`);
}

// ══════════════════════════════════════════════════════════
// KPI IMPORT HISTORY TAB
// ══════════════════════════════════════════════════════════
const KPI_IMPORT_HISTORY = [
  {
    id: 'IMP-2026-0023', period: 'Tháng 2/2026', importedAt: '2026-03-13 14:52:30',
    submitter: 'Nguyễn Thị Lan', submitterRole: 'Chuyên viên Phòng PCTT', avatar: 'NL',
    approver: 'Nguyễn Văn Sơn', approverRole: 'Chi cục trưởng', approvedAt: '2026-03-13 16:28:44',
    files: ['BaoCaoPCTT_T2_2026.xlsx', 'TongHopKPI_ThienTai_Feb2026.pdf'],
    note: 'Số liệu từ báo cáo tổng hợp tình hình thiên tai T2/2026. Được phê duyệt bởi Chi cục trưởng Nguyễn Văn Sơn.',
    otpVerified: true, status: 'approved',
    kpiCount: 8, missingCount: 1, avgConf: 91,
    data: [
      { kpi: 'Số vụ sự cố đê điều', val: '3 vụ', conf: 99 },
      { kpi: 'Mực nước max (sông Hồng)', val: '8.42 m', conf: 97 },
      { kpi: 'Lượng mưa tích lũy', val: '124.5 mm/24h', conf: 96 },
      { kpi: 'Số hộ phải di dời', val: '1,240 hộ', conf: 91 },
      { kpi: 'Thiệt hại ước tính', val: '4,280 triệu đ', conf: 84 },
      { kpi: 'Tổng lực lượng tham gia', val: '3,560 người', conf: 90 },
      { kpi: 'Công trình xử lý khẩn', val: '7 điểm', conf: 95 },
      { kpi: 'Chi phí ƯCSC', val: '1,720 triệu đ', conf: 78 },
    ],
  },
  {
    id: 'IMP-2026-0022', period: 'Tháng 1/2026', importedAt: '2026-02-03 10:44:30',
    submitter: 'Nguyễn Thị Lan', submitterRole: 'Chuyên viên Phòng PCTT', avatar: 'NL',
    approver: 'Lê Thị Hương', approverRole: 'Phó Chi cục trưởng', approvedAt: '2026-02-03 11:20:22',
    files: ['KPI_PCTT_T1_2026_Final.xlsx'],
    note: 'Số liệu đã được Phòng PCTT kiểm tra và xác nhận.',
    otpVerified: true, status: 'approved',
    kpiCount: 8, missingCount: 0, avgConf: 93,
    data: [],
  },
  {
    id: 'IMP-2026-0021', period: 'Tháng 12/2025', importedAt: '2026-01-05 14:22:00',
    submitter: 'Trần Văn Hùng', submitterRole: 'Trưởng phòng Kế hoạch - Tổng hợp', avatar: 'TH',
    approver: 'Nguyễn Văn Sơn', approverRole: 'Chi cục trưởng', approvedAt: '2026-01-05 16:00:58',
    files: ['TongKetThienTai_2025.xlsx', 'BaoCao_PCTT_Q4_2025.pdf'],
    note: 'Import tổng kết thiên tai năm 2025. Dữ liệu đã được BCH PCTT TP xác nhận.',
    otpVerified: true, status: 'approved',
    kpiCount: 10, missingCount: 0, avgConf: 96,
    data: [],
  },
  {
    id: 'IMP-2026-0020', period: 'Tháng 11/2025', importedAt: '2025-12-04 09:15:45',
    submitter: 'Nguyễn Thị Lan', submitterRole: 'Chuyên viên Phòng PCTT', avatar: 'NL',
    approver: '—', approverRole: '—', approvedAt: '—',
    files: ['KPI_PCTT_T11_2025_Draft.xlsx'],
    note: 'Bị từ chối — số liệu thiệt hại chưa khớp với báo cáo hiện trường. Yêu cầu bổ sung số liệu thực tế.',
    otpVerified: true, status: 'rejected',
    kpiCount: 6, missingCount: 2, avgConf: 74,
    data: [],
  },
  {
    id: 'IMP-2026-0019', period: 'Tháng 10/2025', importedAt: '2025-11-03 16:05:10',
    submitter: 'Trần Văn Hùng', submitterRole: 'Trưởng phòng Kế hoạch - Tổng hợp', avatar: 'TH',
    approver: 'Lê Thị Hương', approverRole: 'Phó Chi cục trưởng', approvedAt: '2025-11-03 17:30:00',
    files: ['KPI_PCTT_T10_2025.xlsx'],
    note: '',
    otpVerified: true, status: 'approved',
    kpiCount: 7, missingCount: 1, avgConf: 88,
    data: [],
  },
];

function renderKpiHistory() {
  return `
  <!-- Stats row -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px">
    ${[
      { label: 'Tổng lần import', val: KPI_IMPORT_HISTORY.length, color: 'var(--cyan)' },
      { label: 'Thành công', val: KPI_IMPORT_HISTORY.filter(h => h.status === 'approved').length, color: 'var(--green)' },
      { label: 'Bị từ chối', val: KPI_IMPORT_HISTORY.filter(h => h.status === 'rejected').length, color: 'var(--red)' },
      { label: 'Import gần nhất', val: KPI_IMPORT_HISTORY[0]?.period || '—', color: 'var(--yellow)', small: true },
    ].map(s => `<div class="card" style="padding:14px;border-top:2px solid ${s.color}">
      <div style="font-size:${s.small ? '14px' : '22px'};font-weight:800;color:${s.color};margin-bottom:4px">${s.val}</div>
      <div style="font-size:11px;color:var(--muted)">${s.label}</div>
    </div>`).join('')}
  </div>

  <!-- History table -->
  <div class="card">
    <div class="card-header">
      <span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2" style="vertical-align:middle"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Lịch sử Import KPI Thiên tai</span>
      <button class="btn btn-ghost btn-sm" onclick="showToast('Đang xuất lịch sử...')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Xuất Excel</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Mã</th><th>Kỳ báo cáo</th><th>Ngày giờ import</th>
            <th>Người thực hiện</th><th>Người duyệt</th><th>Thời gian duyệt</th>
            <th>File đính kèm</th><th>KPI</th><th>OTP</th><th>Kết quả</th><th></th>
          </tr>
        </thead>
        <tbody>
          ${KPI_IMPORT_HISTORY.map((h, idx) => `
          <tr style="${idx === 0 ? 'background:rgba(0,230,118,.04)' : ''}">
            <td><code style="font-size:11px;color:var(--muted)">${h.id}</code></td>
            <td><b style="font-size:13px">${h.period}</b>${idx === 0 ? '<br><span class="badge badge-green" style="font-size:9px;margin-top:2px">Gần nhất</span>' : ''}</td>
            <td class="mono" style="font-size:11px;color:var(--muted)">${h.importedAt}</td>
            <td>
              <div style="display:flex;align-items:center;gap:7px">
                <div style="width:28px;height:28px;background:linear-gradient(135deg,#0050cc,#00c8ff);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0">${h.avatar}</div>
                <div><div style="font-size:12px;font-weight:600">${h.submitter}</div><div style="font-size:10px;color:var(--muted)">${h.submitterRole}</div></div>
              </div>
            </td>
            <td>
              ${h.approver !== '—' ? `<div style="font-size:12px;font-weight:600;color:var(--cyan)">${h.approver}</div><div style="font-size:10px;color:var(--muted)">${h.approverRole}</div>` : '<span style="color:var(--muted);font-size:12px">—</span>'}
            </td>
            <td class="mono" style="font-size:11px;color:var(--muted)">${h.approvedAt}</td>
            <td>
              ${h.files.map(f => {
      const ext = f.split('.').pop().toUpperCase();
      const fc = { XLSX: '#00e676', XLS: '#00e676', PDF: '#ff6d00', PNG: '#ff4081', JPG: '#ff4081' }[ext] || 'var(--cyan)';
      return `<div style="display:flex;align-items:center;gap:5px;margin-bottom:3px;cursor:pointer" onclick="showToast('Đang mở ${f}...')">
                  <span style="font-size:8px;font-weight:800;color:${fc};background:${fc}18;padding:1px 4px;border-radius:3px">${ext}</span>
                  <span style="font-size:11px;color:var(--text-2);white-space:nowrap;max-width:140px;overflow:hidden;text-overflow:ellipsis">${f}</span>
                </div>`;
    }).join('')}
            </td>
            <td style="text-align:center">
              <div style="font-size:13px;font-weight:700;color:var(--text)">${h.kpiCount}</div>
              <div style="font-size:10px;color:var(--muted)">TB ${h.avgConf}%</div>
              ${h.missingCount ? `<div style="font-size:10px;color:var(--yellow)">${h.missingCount} thiếu</div>` : ''}
            </td>
            <td style="text-align:center">${h.otpVerified ? '<span style="color:var(--green)">✓</span>' : '<span style="color:var(--muted)">—</span>'}</td>
            <td>${h.status === 'approved' ? '<span class="badge badge-green">Đã duyệt</span>' : h.status === 'rejected' ? '<span class="badge badge-red">Từ chối</span>' : '<span class="badge badge-yellow">Chờ duyệt</span>'}</td>
            <td>
              <button onclick="kpiHistoryDetail(${idx})" class="btn btn-ghost btn-sm" title="Xem chi tiết">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </button>
            </td>
          </tr>
          ${h.note ? `<tr><td colspan="11" style="padding:0 18px 10px;font-size:11px;color:var(--muted);font-style:italic">📝 ${h.note}</td></tr>` : ''}`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function kpiHistoryDetail(idx) {
  const h = KPI_IMPORT_HISTORY[idx];
  if (!h) return;
  openModal(`<div class="modal-header">
    <span class="modal-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2" style="vertical-align:middle"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Chi tiết Import — ${h.id}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body" style="max-height:70vh;overflow-y:auto">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <div style="background:rgba(0,0,0,.15);border-radius:10px;padding:14px">
        <div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Thông tin chung</div>
        ${[['Kỳ báo cáo', h.period], ['Ngày giờ import', h.importedAt], ['Người thực hiện', h.submitter + ' · ' + h.submitterRole], ['Người duyệt', h.approver !== '—' ? h.approver + ' · ' + h.approverRole : 'Chưa duyệt'], ['Thời gian duyệt', h.approvedAt], ['OTP xác thực', h.otpVerified ? '✓ Đã xác thực' : 'Không'], ['Kết quả', h.status === 'approved' ? '✓ Đã duyệt & import' : h.status === 'rejected' ? '✕ Từ chối' : '⏳ Chờ duyệt']].map(([l, v]) => `
        <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
          <span style="color:var(--muted)">${l}</span>
          <span style="color:var(--text);font-weight:500;text-align:right;max-width:200px">${v}</span>
        </div>`).join('')}
      </div>
      <div style="background:rgba(0,0,0,.15);border-radius:10px;padding:14px">
        <div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">File đính kèm</div>
        ${h.files.map(f => {
    const ext = f.split('.').pop().toUpperCase();
    const fc = { XLSX: '#00e676', XLS: '#00e676', PDF: '#ff6d00', PNG: '#ff4081', JPG: '#ff4081' }[ext] || 'var(--cyan)';
    return `<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:rgba(0,0,0,.2);border-radius:7px;margin-bottom:6px;cursor:pointer" onclick="showToast('Đang mở ${f}...')">
            <span style="font-size:9px;font-weight:800;color:${fc};background:${fc}18;padding:2px 5px;border-radius:4px">${ext}</span>
            <span style="font-size:12px;color:var(--text-2)">${f}</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2" style="margin-left:auto"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/></svg>
          </div>`;
  }).join('')}
        ${h.note ? `<div style="margin-top:10px;padding:10px;background:rgba(0,200,255,.05);border-radius:7px;border-left:2px solid rgba(0,200,255,.3);font-size:12px;color:var(--muted);line-height:1.6">${h.note}</div>` : ''}
      </div>
    </div>
    ${h.data.length ? `
    <div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Dữ liệu KPI đã import</div>
    <div style="border:1px solid var(--border);border-radius:10px;overflow:hidden">
      ${h.data.map((d, di) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 14px;${di ? 'border-top:1px solid var(--border)' : ''}">
        <span style="font-size:13px;color:var(--muted)">${d.kpi}</span>
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:13px;font-weight:700;color:var(--text)">${d.val}</span>
          <div style="display:flex;align-items:center;gap:4px">
            <div style="width:40px;height:4px;background:rgba(255,255,255,.1);border-radius:2px"><div style="height:100%;width:${d.conf}%;background:${d.conf >= 90 ? 'var(--green)' : d.conf >= 75 ? 'var(--yellow)' : 'var(--red)'};border-radius:2px"></div></div>
            <span style="font-size:10px;color:var(--muted)">AI ${d.conf}%</span>
          </div>
        </div>
      </div>`).join('')}
    </div>`: ''}</div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="showToast('Đang xuất PDF...')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Xuất biên bản</button>
    <button class="btn btn-primary" onclick="closeModal()">Đóng</button>
  </div>`);
}
