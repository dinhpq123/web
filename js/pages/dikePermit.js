// ── HADIWA IOC — CẤP PHÉP & VI PHẠM (ĐÊ ĐIỀU + THỦY LỢI) ──────────
// Quản lý cấp phép & vi phạm trong hành lang bảo vệ đê và phạm vi bảo vệ CTTL

// ── Mock data: Cấp phép Thủy lợi (CTTL) ───────────────────────────
const TL_PERMITS_DATA = [
  { id:'TGP-2026-001', entity:'Công ty TNHH Xây dựng Minh Phát', activity:'Xây dựng nhà xưởng sát kênh N41', location:'Kênh N41, xã Đồng Phú', commune:'Đồng Phú', companyTL:'Công ty TL Sông Nhuệ', issuedDate:'05/01/2026', expiryDate:'05/07/2026', status:'approved', inspector:'Nguyễn Minh Tân', type:'Xây dựng', lat:20.98, lng:105.72 },
  { id:'TGP-2026-002', entity:'Hộ ông Trần Văn Hải', activity:'Đặt ống dẫn nước qua kênh', location:'Kênh dẫn chính, xã Phú Nghĩa', commune:'Phú Nghĩa', companyTL:'Công ty TL Sông Đáy', issuedDate:'12/02/2026', expiryDate:'12/05/2026', status:'expiring', inspector:'Lê Thị Hoa', type:'Đặt ống', lat:20.76, lng:105.63 },
  { id:'TGP-2026-003', entity:'BQL Dự án Quốc lộ 6 mở rộng', activity:'Thi công cầu vượt qua cống Cẩm Đình', location:'Cống Cẩm Đình, H. Phúc Thọ', commune:'Cẩm Đình', companyTL:'Công ty TL Hà Nội', issuedDate:'20/02/2026', expiryDate:'20/11/2026', status:'approved', inspector:'Phạm Quốc Bình', type:'Thi công CT', lat:21.10, lng:105.55 },
  { id:'TGP-2026-004', entity:'HTX Nông nghiệp Xuân Mai', activity:'Khai thác cát sỏi có kiểm soát', location:'Hồ Xuân Khanh, H. Sơn Tây', commune:'Xuân Khanh', companyTL:'Công ty TL Mê Linh', issuedDate:'01/03/2026', expiryDate:'01/06/2026', status:'approved', inspector:'Vũ Đình Toàn', type:'Khai thác', lat:21.12, lng:105.47 },
  { id:'TGP-2026-005', entity:'Công ty CP Viễn thông HN', activity:'Lắp cáp ngầm qua đáy kênh Chiến Thắng', location:'Kênh Chiến Thắng, Q. Hà Đông', commune:'Dương Nội', companyTL:'Công ty TL Sông Nhuệ', issuedDate:'10/03/2026', expiryDate:'10/09/2026', status:'pending', inspector:'Đỗ Mạnh Tuân', type:'Đặt cáp ngầm', lat:20.97, lng:105.74 },
  { id:'TGP-2026-006', entity:'UBND xã Bình Phú', activity:'Nâng cấp đường quản lý kênh N8', location:'Kênh N8, xã Bình Phú', commune:'Bình Phú', companyTL:'Công ty TL Sông Đáy', issuedDate:'15/03/2026', expiryDate:'15/12/2026', status:'approved', inspector:'Nguyễn Thị Vân', type:'Xây dựng', lat:20.83, lng:105.61 },
  { id:'TGP-2026-007', entity:'Công ty SX Gạch Vĩnh Tường', activity:'Xây tường rào sát mương tiêu', location:'Mương tiêu Vĩnh Tường, H. Phúc Thọ', commune:'Vĩnh Tường', companyTL:'Công ty TL Hà Nội', issuedDate:'20/03/2026', expiryDate:'20/09/2026', status:'approved', inspector:'Lê Hùng Cường', type:'Xây dựng', lat:21.06, lng:105.58 },
];

// ── Mock data: Vi phạm Thủy lợi (CTTL) ────────────────────────────
const TL_VIOLATIONS_DATA = [
  { id:'TVP-2026-018', entity:'Chưa xác định', type:'Lấn chiếm bờ kênh đổ đất', location:'Kênh N11, xã Hòa Thạch, H. Quốc Oai', commune:'Hòa Thạch', companyTL:'Công ty TL Sông Đáy', reportedDate:'14/03/2026', severity:'critical', status:'new', fine:0, inspector:'Đỗ Mạnh Tuân', lat:20.92, lng:105.56, bbDate:'14/03/2026', qdDate:'—', khDate:'—', notes:'Đổ khoảng 45m³ đất lấn chiếm bờ kênh. Đang điều tra chủ vi phạm. Phát hiện qua tuần tra định kỳ.' },
  { id:'TVP-2026-015', entity:'Ông Nguyễn Văn Sơn', type:'Xây dựng chuồng trại lấn mương tiêu', location:'Mương tiêu số 3, xã Đại Nghĩa, H. Mỹ Đức', commune:'Đại Nghĩa', companyTL:'Công ty TL Sông Đáy', reportedDate:'08/03/2026', severity:'high', status:'processing', fine:20000000, inspector:'Nguyễn Thị Vân', lat:20.71, lng:105.68, bbDate:'09/03/2026', qdDate:'18/03/2026', khDate:'—', notes:'Xây chuồng lợn quy mô 60m² lấn vào mương tiêu 2.5m. Lập biên bản ngày 09/03. QĐ xử phạt 20 triệu.' },
  { id:'TVP-2026-012', entity:'Công ty VLXD Đại Thành', type:'Khai thác cát trái phép', location:'Hồ Quan Sơn, H. Mỹ Đức', commune:'Mỹ Đức', companyTL:'Công ty TL Sông Đáy', reportedDate:'25/02/2026', severity:'critical', status:'processing', fine:80000000, inspector:'Vũ Đình Toàn', lat:20.73, lng:105.63, bbDate:'26/02/2026', qdDate:'10/03/2026', khDate:'—', notes:'Khai thác cát quy mô lớn không có giấy phép. Đã tạm giữ 2 xà lan và phương tiện. QĐ xử phạt 80 triệu.' },
  { id:'TVP-2026-009', entity:'Hộ bà Lê Thị Mai', type:'Đặt cống hộp trái phép ngang kênh', location:'Kênh Cẩm Đình, xã Xuân Phú, H. Phúc Thọ', commune:'Xuân Phú', companyTL:'Công ty TL Hà Nội', reportedDate:'15/02/2026', severity:'high', status:'pending', fine:12000000, inspector:'Phạm Quốc Bình', lat:21.08, lng:105.53, bbDate:'16/02/2026', qdDate:'01/03/2026', khDate:'—', notes:'Đặt cống hộp 1m×1m ngang kênh dẫn để mở lối đi. QĐ xử phạt 12 triệu. Chờ tháo dỡ cống.' },
  { id:'TVP-2026-006', entity:'HTX Vật liệu xây dựng Sơn Tây', type:'Chứa VLXD trong hành lang kênh', location:'Kênh chính hệ Sông Tích, H. Thạch Thất', commune:'Đại Đình', companyTL:'Công ty TL Mê Linh', reportedDate:'05/02/2026', severity:'medium', status:'processing', fine:8000000, inspector:'Lê Thị Hoa', lat:20.97, lng:105.45, bbDate:'06/02/2026', qdDate:'20/02/2026', khDate:'—', notes:'Để bãi cát sỏi ~120m³ trong hành lang bảo vệ kênh. QĐ xử phạt 8 triệu. Đang di dời vật liệu.' },
  { id:'TVP-2025-098', entity:'Ông Trần Đình Phúc', type:'Xây nhà ở trong hành lang hồ chứa', location:'Hồ Tuy Lai, H. Ba Vì', commune:'Ba Vì', companyTL:'Công ty TL Hà Nội', reportedDate:'10/12/2025', severity:'high', status:'done', fine:35000000, inspector:'Nguyễn Minh Tân', lat:21.15, lng:105.38, bbDate:'11/12/2025', qdDate:'25/12/2025', khDate:'15/02/2026', notes:'Xây nhà cấp 4 diện tích 42m² trong hành lang hồ chứa. Đã tháo dỡ hoàn toàn. Nộp phạt đủ 35 triệu. Đóng hồ sơ.' },
];

const PERMITS_DATA = [
  { id: 'GP-2026-001', entity: 'Công ty XD Thăng Long', activity: 'Xây dựng trạm biến áp 110kV', location: 'K22+300 Đê Hữu Hồng', issuedDate: '10/01/2026', expiryDate: '10/08/2026', status: 'approved', inspector: 'Lê Hùng Cường', conditions: 'Không đào, đắp; hoàn trả mặt đê sau khi thi công.' },
  { id: 'GP-2026-002', entity: 'Hộ kinh doanh Nguyễn Văn X', activity: 'Sửa chữa nhà ở tạm', location: 'K42+150 Đê Tả Hồng', issuedDate: '15/02/2026', expiryDate: '15/05/2026', status: 'expiring', inspector: 'Đỗ Mạnh Tuân', conditions: 'Chỉ sửa chữa, không xây dựng thêm; tháo dỡ sau khi hết hạn.' },
  { id: 'GP-2026-003', entity: 'Viễn thông Hà Nội', activity: 'Lắp đặt cáp ngầm qua đê', location: 'K1+500 Đê Tả Đuống', issuedDate: '01/03/2026', expiryDate: '01/09/2026', status: 'approved', inspector: 'Nguyễn Thị Vân', conditions: 'Thi công bằng phương pháp khoan ngang; bảo vệ thân đê tuyệt đối.' },
  { id: 'GP-2026-004', entity: 'BQL Dự án cầu Thượng Cát', activity: 'Thi công móng cầu', location: 'K31+800 Đê Hữu Hồng', issuedDate: '20/03/2026', expiryDate: '20/12/2026', status: 'approved', inspector: 'Phạm Thị Ngọc', conditions: 'Giám sát 24/7; báo cáo tuần; không thi công trong mùa lũ.' },
];

const VIOLATIONS_DATA = [
  { id: 'VP-2026-012', entity: 'Chưa xác định', type: 'Đổ phế thải xây dựng', location: 'Mái đê phía sông K15 Đê Hữu Đáy', reportedDate: '10/03/2026', severity: 'high', status: 'new', fine: 0, inspector: 'Đỗ Mạnh Tuân', notes: 'Phát hiện qua camera giám sát. Đang điều tra tổ chức vi phạm.' },
  { id: 'VP-2026-010', entity: 'Công ty Gạch ngói Minh Tân', type: 'Để vật liệu trên mặt đê', location: 'K4+200 Đê Ngọc Tảo', reportedDate: '05/03/2026', severity: 'medium', status: 'processing', fine: 15000000, inspector: 'Lê Hùng Cường', notes: 'Đã lập biên bản. Đang xử phạt theo Điều 15 Nghị định 03/2022.' },
  { id: 'VP-2026-008', entity: 'Cửa hàng VLXD Thành Công', type: 'Xây dựng công trình tạm không phép', location: 'Chân đê Tả Đuống, K8+500', reportedDate: '25/02/2026', severity: 'critical', status: 'pending', fine: 50000000, inspector: 'Phạm Thị Ngọc', notes: 'Đã có quyết định xử phạt 50 triệu. Đang chờ tháo dỡ công trình.' },
  { id: 'VP-2026-005', entity: 'Hộ ông Trần Văn B', type: 'Đào đất mái đê trái phép', location: 'K67+400 Đê Tả Hồng', reportedDate: '05/02/2026', severity: 'high', status: 'done', fine: 25000000, inspector: 'Đỗ Mạnh Tuân', notes: 'Đã gia cố lại mái đê. Nộp phạt đầy đủ. Đóng hồ sơ.' },
];

function renderDikePermit() {
  const pTab = window._dikeTab || 'permits';
  const allPermits  = PERMITS_DATA.filter(p => p.status === 'approved' || p.status === 'expiring').length;
  const tlPermits   = TL_PERMITS_DATA.filter(p => p.status === 'approved' || p.status === 'expiring').length;
  const ddViol      = VIOLATIONS_DATA.filter(v => v.status !== 'done').length;
  const tlViol      = TL_VIOLATIONS_DATA.filter(v => v.status !== 'done').length;
  const allFines    = Math.round([...VIOLATIONS_DATA, ...TL_VIOLATIONS_DATA].filter(v => v.status === 'done').reduce((s,v) => s + v.fine, 0) / 1000000);

  return `
  <div class="page-header">
    <div class="page-title">
      <h1>Cấp phép &amp; Vi phạm Thủy lợi &amp; Đê điều</h1>
      <p>Quản lý cấp phép và xử lý vi phạm Luật Đê điều và Luật Thủy lợi</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-ghost btn-sm" onclick="openAddPermitModal()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Cấp phép mới
      </button>
      <button class="btn btn-sm" style="background:rgba(255,23,68,.1);color:#ff5252;border:1px solid rgba(255,23,68,.3)" onclick="openReportViolationModal()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        Báo cáo vi phạm
      </button>
    </div>
  </div>

  <!-- Summary KPIs -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px">
    ${
      [
      { label: 'GP Đê điều còn HLực', val: allPermits, color: 'var(--green)', sub: 'giấy phép hoạt động' },
      { label: 'CP Thủy lợi còn HLực', val: tlPermits, color: 'var(--cyan)', sub: 'hồ sơ cấp phép CTTL' },
      { label: 'Vi phạm đang xử lý', val: ddViol + tlViol, color: 'var(--red)', sub: `${ddViol} đê · ${tlViol} thủy lợi` },
      { label: 'Tiền phạt đã thu (tr.)', val: allFines, color: 'var(--yellow)', sub: 'triệu VNĐ tổng hợp' },
    ].map(k => `
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:16px 20px">
      <div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">${k.label}</div>
      <div style="font-size:28px;font-weight:800;color:${k.color}">${k.val}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:4px">${k.sub}</div>
    </div>`).join('')}
  </div>

  <div class="tabs" style="margin-bottom:16px">
    <button class="tab-btn ${pTab==='permits'?'active':''}" onclick="switchDikeTab('permits',this)">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      Giấy phép hoạt động (${PERMITS_DATA.length})
    </button>
    <button class="tab-btn ${pTab==='violations'?'active':''}" onclick="switchDikeTab('violations',this)">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
      Vi phạm Đê điều (${VIOLATIONS_DATA.filter(v=>v.status!=='done').length} đang xử lý)
    </button>
    <button class="tab-btn ${pTab==='tlPermits'?'active':''}" onclick="switchDikeTab('tlPermits',this)">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
      Cấp phép Thủy lợi (${TL_PERMITS_DATA.length})
    </button>
    <button class="tab-btn ${pTab==='tlViolations'?'active':''}" onclick="switchDikeTab('tlViolations',this)">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      Vi phạm Thủy lợi (${TL_VIOLATIONS_DATA.filter(v=>v.status!=='done').length} đang xử lý)
    </button>
  </div>

  <div id="dikeContentArea">
    ${pTab==='violations' ? _renderViolationTable() : pTab==='tlPermits' ? _renderTLPermitTable() : pTab==='tlViolations' ? _renderTLViolationTable() : _renderPermitTable()}
  </div>`;
}

function _renderPermitTable() {

  return `
  <div class="card" style="padding:0">
    <div class="table-wrap">
      <table>
        <thead><tr>
          <th>Số hiệu GP</th><th>Đơn vị / Cá nhân</th><th>Nội dung cấp phép</th>
          <th>Vị trí</th><th>Ngày cấp</th><th>Hết hạn</th><th>Trạng thái</th><th></th>
        </tr></thead>
        <tbody>
          ${PERMITS_DATA.map(p => `
          <tr>
            <td class="mono" style="color:var(--cyan);font-size:12px">${p.id}</td>
            <td><strong>${p.entity}</strong></td>
            <td style="font-size:12px;max-width:200px">${p.activity}</td>
            <td style="font-size:12px;color:var(--muted)">${p.location}</td>
            <td style="font-size:12px">${p.issuedDate}</td>
            <td style="font-size:12px;color:${p.status==='expiring'?'var(--yellow)':'inherit'}">${p.expiryDate}</td>
            <td>${p.status === 'approved' ? '<span class="badge badge-green">Còn hiệu lực</span>' : '<span class="badge badge-yellow">⚠ Sắp hết hạn</span>'}</td>
            <td><button class="btn btn-ghost btn-sm" onclick="viewPermitDetail('${p.id}')">Xem GP</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function _renderViolationTable() {
  return `
  <div class="card" style="padding:0">
    <div class="table-wrap">
      <table>
        <thead><tr>
          <th>Mã VP</th><th>Đối tượng vi phạm</th><th>Hành vi vi phạm</th>
          <th>Vị trí</th><th>Ngày phát hiện</th><th>Tiền phạt (tr.)</th><th>Mức độ</th><th>Xử lý</th><th></th>
        </tr></thead>
        <tbody>
          ${VIOLATIONS_DATA.map(v => `
          <tr style="${v.status==='new'?'background:rgba(255,23,68,.03)':''}">
            <td class="mono" style="color:var(--red);font-size:12px">${v.id}</td>
            <td style="font-size:12px">${v.entity}</td>
            <td style="font-size:12px;font-weight:600">${v.type}</td>
            <td style="font-size:12px;color:var(--muted)">${v.location}</td>
            <td style="font-size:12px">${v.reportedDate}</td>
            <td class="mono" style="font-size:12px;color:${v.fine>0?'var(--yellow)':'var(--muted)'}">${v.fine>0?Math.round(v.fine/1000000):'—'}</td>
            <td>${statusBadge(v.severity)}</td>
            <td>${statusBadge(v.status)}</td>
            <td><button class="btn btn-ghost btn-sm" onclick="viewViolationDetail('${v.id}')">Hồ sơ</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function _renderDikeTabContent(tab) {
  if (tab === 'violations')   return _renderViolationTable();
  if (tab === 'tlPermits')    return _renderTLPermitTable();
  if (tab === 'tlViolations') return _renderTLViolationTable();
  return _renderPermitTable();
}

window.switchDikeTab = function(tab, btn) {
  window._dikeTab = tab;
  document.querySelectorAll('.tabs .tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const area = document.getElementById('dikeContentArea');
  if (area) area.innerHTML = _renderDikeTabContent(tab);
};

// ── TL PERMIT TABLE ───────────────────────────────────────────────
function _renderTLPermitTable() {
  const statusBadgeTL = s => ({
    approved: '<span class="badge badge-green">Còn hiệu lực</span>',
    expiring: '<span class="badge badge-yellow">⚠ Sắp hết hạn</span>',
    pending:  '<span class="badge badge-gray">Chờ phê duyệt</span>',
  }[s] || `<span class="badge">${s}</span>`);

  return `
  <div class="card" style="padding:0;margin-bottom:16px">
    <div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <input id="tlpSearch" class="form-control" style="flex:1;min-width:180px" placeholder="Tìm theo tên, địa điểm..." oninput="filterTLPermit()"/>
      <select id="tlpFilterComp" class="form-control" style="width:200px" onchange="filterTLPermit()">
        <option value="">Tất cả Công ty TL</option>
        ${[...new Set(TL_PERMITS_DATA.map(p=>p.companyTL))].map(c=>`<option>${c}</option>`).join('')}
      </select>
      <select id="tlpFilterType" class="form-control" style="width:160px" onchange="filterTLPermit()">
        <option value="">Tất cả loại CP</option>
        ${[...new Set(TL_PERMITS_DATA.map(p=>p.type))].map(t=>`<option>${t}</option>`).join('')}
      </select>
      <button class="btn btn-primary btn-sm" onclick="openAddTLPermitModal()">+ Cấp phép mới</button>
    </div>
    <div class="table-wrap"><table id="tlpTable">
      <thead><tr>
        <th>Số hiệu</th><th>Đơn vị / Cá nhân</th><th>Loại CP</th>
        <th>Công trình TL</th><th>Xã</th><th>Ngày cấp</th><th>Hết hạn</th><th>Trạng thái</th><th></th>
      </tr></thead>
      <tbody>
        ${TL_PERMITS_DATA.map(p => `
        <tr data-comp="${p.companyTL}" data-type="${p.type}" data-text="${(p.entity+p.location+p.commune).toLowerCase()}">
          <td class="mono" style="color:var(--cyan);font-size:12px">${p.id}</td>
          <td><strong>${p.entity}</strong></td>
          <td><span class="badge badge-gray" style="font-size:10px">${p.type}</span></td>
          <td style="font-size:12px;color:var(--muted)">${p.companyTL}</td>
          <td style="font-size:12px">${p.commune}</td>
          <td style="font-size:12px">${p.issuedDate}</td>
          <td style="font-size:12px;color:${p.status==='expiring'?'var(--yellow)':'inherit'}">${p.expiryDate}</td>
          <td>${statusBadgeTL(p.status)}</td>
          <td><button class="btn btn-ghost btn-sm" onclick="viewTLPermitDetail('${p.id}')">Xem GP</button></td>
        </tr>`).join('')}
      </tbody>
    </table></div>
    <div style="padding:10px 16px;font-size:12px;color:var(--muted);border-top:1px solid var(--border)">
      Báo cáo theo cấp:
      ${['Thành phố','Công ty TL','Xã'].map(lvl=>`<button class="btn btn-ghost btn-sm" style="margin-left:8px" onclick="showTLPermitReport('${lvl}')">${lvl}</button>`).join('')}
    </div>
  </div>`;
}

window.filterTLPermit = function() {
  const q    = document.getElementById('tlpSearch')?.value.toLowerCase()||'';
  const comp = document.getElementById('tlpFilterComp')?.value||'';
  const type = document.getElementById('tlpFilterType')?.value||'';
  document.querySelectorAll('#tlpTable tbody tr').forEach(row => {
    const ok = (!q || row.dataset.text?.includes(q))
            && (!comp || row.dataset.comp===comp)
            && (!type || row.dataset.type===type);
    row.style.display = ok ? '' : 'none';
  });
};

window.viewTLPermitDetail = function(id) {
  const p = TL_PERMITS_DATA.find(x=>x.id===id); if (!p) return;
  openModal(`
  <div class="modal-header">
    <span class="modal-title">Hồ sơ Cấp phép TL: ${p.id}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      ${[
        {label:'Chủ hồ sơ', val:p.entity},
        {label:'Loại hoạt động', val:p.type},
        {label:'Vị trí', val:p.location},
        {label:'Cán bộ phụ trách', val:p.inspector},
        {label:'Công ty TL quản lý', val:p.companyTL},
        {label:'Xã', val:p.commune},
        {label:'Ngày cấp', val:p.issuedDate},
        {label:'Hết hạn', val:`<span style="color:${p.status==='expiring'?'var(--yellow)':'inherit'}">${p.expiryDate}</span>`},
      ].map(f=>`<div style="padding:10px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px"><div style="font-size:11px;color:var(--muted);margin-bottom:3px">${f.label}</div><div style="font-size:13px;font-weight:600">${f.val}</div></div>`).join('')}
    </div>
    <div style="padding:10px 14px;background:rgba(0,200,255,.05);border:1px solid rgba(0,200,255,.15);border-radius:8px;margin-bottom:12px">
      <div style="font-size:11px;font-weight:700;color:var(--cyan);margin-bottom:4px">Tọa độ vị trí</div>
      <div style="font-size:13px">Lat: ${p.lat}°N · Lng: ${p.lng}°E
        <a style="color:var(--cyan);cursor:pointer;margin-left:12px" onclick="window.open('https://maps.google.com/?q=${p.lat},${p.lng}','_blank')">📍 Xem Google Maps</a>
      </div>
    </div>
    <div style="padding:10px 14px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px">
      <div style="font-size:11px;font-weight:700;color:var(--muted);margin-bottom:4px">Điều kiện hoạt động</div>
      <div style="font-size:12px;color:var(--muted)">Tuân thủ quy định Luật Thủy lợi 2017 và Nghị định 67/2018/NĐ-CP. Không làm thay đổi dòng chảy, ảnh hưởng kết cấu công trình thủy lợi.</div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-ghost btn-sm" onclick="showToast('Đang tải hồ sơ PDF...')">Tải PDF</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('Đang gia hạn giấy phép...')">Gia hạn</button>
  </div>`, {width:'760px'});
};

window.openAddTLPermitModal = function() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Cấp phép Thủy lợi mới</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-row">
      <div class="form-group"><label class="form-label">Chủ hồ sơ</label><input class="form-control" placeholder="Tên cá nhân/tổ chức"></div>
      <div class="form-group"><label class="form-label">Loại hoạt động</label>
        <select class="form-control"><option>Xây dựng</option><option>Đặt ống</option><option>Đặt cáp ngầm</option><option>Khai thác</option><option>Thi công CT</option><option>Khác</option></select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Công ty TL quản lý</label>
        <select class="form-control"><option>Công ty TL Hà Nội</option><option>Công ty TL Sông Nhuệ</option><option>Công ty TL Sông Đáy</option><option>Công ty TL Mê Linh</option></select>
      </div>
      <div class="form-group"><label class="form-label">Xã</label><input class="form-control" placeholder="Tên xã/phường"></div>
    </div>
    <div class="form-group"><label class="form-label">Vị trí công trình</label><input class="form-control" placeholder="Tên kênh/hồ, địa chỉ cụ thể"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Tọa độ Lat</label><input class="form-control" type="number" placeholder="21.02"></div>
      <div class="form-group"><label class="form-label">Tọa độ Lng</label><input class="form-control" type="number" placeholder="105.80"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Thời hạn (tháng)</label><input class="form-control" type="number" placeholder="6"></div>
      <div class="form-group"><label class="form-label">Cán bộ phụ trách</label><input class="form-control" value="Nguyễn Quản Trị" readonly></div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('✅ Đã tạo hồ sơ cấp phép thủy lợi mới!')">Cấp phép</button>
  </div>`, {width:'680px'});
};

window.showTLPermitReport = function(level) {
  const byComp = {};
  TL_PERMITS_DATA.forEach(p => { byComp[p.companyTL] = (byComp[p.companyTL]||0)+1; });
  openModal(`
  <div class="modal-header"><span class="modal-title">Báo cáo Cấp phép TL — Cấp ${level}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div style="margin-bottom:12px;font-size:13px;color:var(--muted)">Tổng hợp hồ sơ cấp phép trong phạm vi bảo vệ CTTL — Cấp: <strong style="color:#fff">${level}</strong></div>
    <div class="table-wrap"><table>
      <thead><tr><th>${level==='Xã'?'Xã':'Đơn vị'}</th><th>Số GP còn HLực</th><th>Sắp HHạn</th><th>Chờ duyệt</th><th>Tổng</th></tr></thead>
      <tbody>
        ${Object.entries(byComp).map(([k,v])=>`<tr><td><strong>${k}</strong></td><td style="color:var(--green)">${Math.floor(v*.7)}</td><td style="color:var(--yellow)">${Math.floor(v*.15)}</td><td style="color:var(--muted)">${Math.floor(v*.15)}</td><td style="font-weight:700">${v}</td></tr>`).join('')}
        <tr style="border-top:2px solid var(--border);font-weight:700"><td>TỔNG CỘNG</td><td style="color:var(--green)">${TL_PERMITS_DATA.filter(p=>p.status==='approved').length}</td><td style="color:var(--yellow)">${TL_PERMITS_DATA.filter(p=>p.status==='expiring').length}</td><td style="color:var(--muted)">${TL_PERMITS_DATA.filter(p=>p.status==='pending').length}</td><td>${TL_PERMITS_DATA.length}</td></tr>
      </tbody>
    </table></div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-primary" onclick="showToast('Đang xuất báo cáo Excel...')">Xuất Excel</button>
  </div>`, {width:'680px'});
};

// ── TL VIOLATION TABLE ────────────────────────────────────────────
function _renderTLViolationTable() {
  return `
  <div class="card" style="padding:0;margin-bottom:16px">
    <div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <input id="tlvSearch" class="form-control" style="flex:1;min-width:180px" placeholder="Tìm theo tên, địa điểm..." oninput="filterTLViol()"/>
      <select id="tlvFilterComp" class="form-control" style="width:200px" onchange="filterTLViol()">
        <option value="">Tất cả Công ty TL</option>
        ${[...new Set(TL_VIOLATIONS_DATA.map(v=>v.companyTL))].map(c=>`<option>${c}</option>`).join('')}
      </select>
      <select id="tlvFilterStatus" class="form-control" style="width:160px" onchange="filterTLViol()">
        <option value="">Tất cả trạng thái</option>
        <option value="new">Mới</option>
        <option value="processing">Đang xử lý</option>
        <option value="pending">Chờ xử lý</option>
        <option value="done">Hoàn thành</option>
      </select>
      <button class="btn btn-sm" style="background:rgba(255,23,68,.1);color:#ff5252;border:1px solid rgba(255,23,68,.3)" onclick="openReportTLViolModal()">+ Lập biên bản</button>
    </div>
    <div class="table-wrap"><table id="tlvTable">
      <thead><tr>
        <th>Mã VP</th><th>Chủ vi phạm</th><th>Loại vi phạm</th>
        <th>Công ty TL</th><th>Xã</th><th>Ngày PH</th><th>Tiền phạt</th><th>Trạng thái</th><th></th>
      </tr></thead>
      <tbody>
        ${TL_VIOLATIONS_DATA.map(v => `
        <tr data-comp="${v.companyTL}" data-status="${v.status}" data-text="${(v.entity+v.location+v.commune).toLowerCase()}" style="${v.status==='new'?'background:rgba(255,23,68,.03)':''}">
          <td class="mono" style="color:var(--red);font-size:12px">${v.id}</td>
          <td style="font-size:12px">${v.entity}</td>
          <td style="font-size:12px;font-weight:600">${v.type}</td>
          <td style="font-size:12px;color:var(--muted)">${v.companyTL}</td>
          <td style="font-size:12px">${v.commune}</td>
          <td style="font-size:12px">${v.reportedDate}</td>
          <td class="mono" style="font-size:12px;color:${v.fine>0?'var(--yellow)':'var(--muted)'}">${v.fine>0?(v.fine/1000000).toFixed(0)+' tr.':'—'}</td>
          <td>${statusBadge(v.status)}</td>
          <td><button class="btn btn-ghost btn-sm" onclick="viewTLViolDetail('${v.id}')">Hồ sơ</button></td>
        </tr>`).join('')}
      </tbody>
    </table></div>
  </div>`;
}

window.filterTLViol = function() {
  const q    = document.getElementById('tlvSearch')?.value.toLowerCase()||'';
  const comp = document.getElementById('tlvFilterComp')?.value||'';
  const st   = document.getElementById('tlvFilterStatus')?.value||'';
  document.querySelectorAll('#tlvTable tbody tr').forEach(row => {
    const ok = (!q || row.dataset.text?.includes(q))
            && (!comp || row.dataset.comp===comp)
            && (!st   || row.dataset.status===st);
    row.style.display = ok ? '' : 'none';
  });
};

window.viewTLViolDetail = function(id) {
  const v = TL_VIOLATIONS_DATA.find(x=>x.id===id); if(!v) return;
  const steps = [
    {label:'Phát hiện',    date:v.reportedDate, done:true},
    {label:'Lập biên bản', date:v.bbDate,  done:v.bbDate!=='—'},
    {label:'QĐ Xử phạt',  date:v.qdDate,  done:v.qdDate!=='—'},
    {label:'Khắc phục',   date:v.khDate,  done:v.khDate!=='—'},
  ];
  openModal(`
  <div class="modal-header">
    <span class="modal-title" style="color:var(--red)">VP Thủy lợi: ${v.id}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      ${[
        {label:'Chủ vi phạm', val:v.entity},
        {label:'Loại vi phạm', val:`<strong>${v.type}</strong>`},
        {label:'Vị trí', val:v.location},
        {label:'Cán bộ lập BB', val:v.inspector},
        {label:'Công ty TL', val:v.companyTL},
        {label:'Xã', val:v.commune},
        {label:'Tiền phạt', val:`<span style="color:var(--yellow);font-weight:700">${v.fine>0?(v.fine/1000000).toFixed(0)+' triệu VNĐ':'Chưa xác định'}</span>`},
        {label:'Mức độ', val:statusBadge(v.severity)},
      ].map(f=>`<div style="padding:10px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px"><div style="font-size:11px;color:var(--muted);margin-bottom:3px">${f.label}</div><div style="font-size:13px">${f.val}</div></div>`).join('')}
    </div>
    <div style="padding:10px 14px;background:rgba(0,200,255,.05);border:1px solid rgba(0,200,255,.15);border-radius:8px;margin-bottom:12px">
      <div style="font-size:11px;font-weight:700;color:var(--cyan);margin-bottom:4px">Tọa độ vi phạm</div>
      <div style="font-size:13px">Lat: ${v.lat}°N · Lng: ${v.lng}°E
        <a style="color:var(--cyan);cursor:pointer;margin-left:12px" onclick="window.open('https://maps.google.com/?q=${v.lat},${v.lng}','_blank')">📍 Xem Google Maps</a>
      </div>
    </div>
    <div style="font-size:12px;font-weight:700;color:var(--muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Timeline xử lý</div>
    <div style="display:flex;gap:0;margin-bottom:14px">
      ${steps.map((s,i)=>`
      <div style="flex:1;text-align:center;position:relative">
        ${i<steps.length-1?`<div style="position:absolute;top:16px;left:50%;width:100%;height:2px;background:${s.done&&steps[i+1].done?'var(--green)':'rgba(255,255,255,.1)'}"></div>`:''}
        <div style="width:32px;height:32px;border-radius:50%;background:${s.done?'var(--green)':'rgba(255,255,255,.08)'};border:2px solid ${s.done?'var(--green)':'rgba(255,255,255,.15)'};margin:0 auto;display:flex;align-items:center;justify-content:center;z-index:1;position:relative">
          ${s.done?'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>':'<div style="width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.2)"></div>'}
        </div>
        <div style="font-size:11px;font-weight:600;margin-top:6px;color:${s.done?'#fff':'rgba(255,255,255,.35)'}">${s.label}</div>
        <div style="font-size:10px;color:var(--muted);margin-top:2px">${s.date}</div>
      </div>`).join('')}
    </div>
    <div style="padding:12px 14px;background:rgba(255,23,68,.04);border:1px solid rgba(255,23,68,.15);border-radius:8px">
      <div style="font-size:11px;font-weight:700;color:var(--red);margin-bottom:5px">Ghi chú xử lý</div>
      <div style="font-size:12px;line-height:1.7">${v.notes}</div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-ghost btn-sm" onclick="showToast('Đang in biên bản...')">In BB</button>
    ${v.status!=='done'?`<button class="btn btn-primary" onclick="closeModal();showToast('✅ Đã cập nhật tiến độ xử lý vi phạm!')">Cập nhật xử lý</button>`:''}
  </div>`, {width:'760px'});
};

window.openReportTLViolModal = function() {
  openModal(`
  <div class="modal-header"><span class="modal-title" style="color:var(--red)">Lập biên bản Vi phạm Thủy lợi</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-row">
      <div class="form-group"><label class="form-label">Chủ vi phạm</label><input class="form-control" placeholder="Tên cá nhân/tổ chức"></div>
      <div class="form-group"><label class="form-label">Loại vi phạm</label>
        <select class="form-control"><option>Lấn chiếm bờ kênh</option><option>Xây dựng trái phép</option><option>Khai thác cát trái phép</option><option>Đặt cống trái phép</option><option>Chứa VLXD</option><option>Khác</option></select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Công ty TL quản lý</label>
        <select class="form-control"><option>Công ty TL Hà Nội</option><option>Công ty TL Sông Nhuệ</option><option>Công ty TL Sông Đáy</option><option>Công ty TL Mê Linh</option></select>
      </div>
      <div class="form-group"><label class="form-label">Xã vi phạm</label><input class="form-control" placeholder="Tên xã/phường"></div>
    </div>
    <div class="form-group"><label class="form-label">Vị trí vi phạm cụ thể</label><input class="form-control" placeholder="Kênh, hồ, cống... và địa chỉ"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Mức độ nghiêm trọng</label>
        <select class="form-control"><option value="critical">Nghiêm trọng</option><option value="high">Cao</option><option value="medium">Trung bình</option></select>
      </div>
      <div class="form-group"><label class="form-label">Tọa độ Lat/Lng</label><input class="form-control" placeholder="21.02, 105.80"></div>
    </div>
    <div class="form-group"><label class="form-label">Mô tả chi tiết hành vi vi phạm</label><textarea class="form-control" rows="3" placeholder="Quy mô vi phạm, bằng chứng phát hiện..."></textarea></div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-sm" style="background:rgba(255,23,68,.1);color:#ff5252;border:1px solid rgba(255,23,68,.3)" onclick="closeModal();showToast('✅ Đã lập biên bản vi phạm Thủy lợi!')">Lập biên bản</button>
  </div>`, {width:'680px'});
};

// ── PERMIT DETAIL MODAL ─────────────────────────────────────────────
window.viewPermitDetail = function(id) {
  const p = PERMITS_DATA.find(x => x.id === id);
  if (!p) return;
  openModal(`
  <div class="modal-header">
    <span class="modal-title">Giấy phép: ${p.id}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      ${[
        { label: 'Đơn vị / Cá nhân', val: p.entity },
        { label: 'Nội dung hoạt động', val: p.activity },
        { label: 'Vị trí trên đê', val: p.location },
        { label: 'Cán bộ phụ trách', val: p.inspector },
        { label: 'Ngày cấp phép', val: p.issuedDate },
        { label: 'Ngày hết hạn', val: `<span style="color:${p.status==='expiring'?'var(--yellow)':'inherit'}">${p.expiryDate}</span>` },
      ].map(f => `
      <div style="padding:10px 14px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px">
        <div style="font-size:11px;color:var(--muted);margin-bottom:3px">${f.label}</div>
        <div style="font-size:13px;font-weight:600">${f.val}</div>
      </div>`).join('')}
    </div>
    <div style="padding:12px 14px;background:rgba(0,200,255,.04);border:1px solid rgba(0,200,255,.15);border-radius:8px">
      <div style="font-size:11px;font-weight:700;color:var(--cyan);margin-bottom:6px">Điều kiện cấp phép</div>
      <div style="font-size:13px;line-height:1.7">${p.conditions}</div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-ghost btn-sm" onclick="closeModal();showToast('Đang tải hồ sơ PDF...')">Tải PDF</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('Đang gia hạn giấy phép ${p.id}...')">Gia hạn</button>
  </div>`);
};

// ── VIOLATION DETAIL MODAL ─────────────────────────────────────────
window.viewViolationDetail = function(id) {
  const v = VIOLATIONS_DATA.find(x => x.id === id);
  if (!v) return;
  const fineStr = v.fine > 0 ? `${(v.fine/1000000).toFixed(0)} triệu VNĐ` : 'Chưa xác định';
  openModal(`
  <div class="modal-header">
    <span class="modal-title" style="color:var(--red)">Biên bản Vi phạm: ${v.id}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      ${[
        { label: 'Đối tượng vi phạm', val: v.entity },
        { label: 'Hành vi vi phạm', val: `<strong>${v.type}</strong>` },
        { label: 'Vị trí vi phạm', val: v.location },
        { label: 'Cán bộ lập biên bản', val: v.inspector },
        { label: 'Ngày phát hiện', val: v.reportedDate },
        { label: 'Tiền phạt', val: `<span style="color:var(--yellow);font-weight:700">${fineStr}</span>` },
      ].map(f => `
      <div style="padding:10px 14px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px">
        <div style="font-size:11px;color:var(--muted);margin-bottom:3px">${f.label}</div>
        <div style="font-size:13px">${f.val}</div>
      </div>`).join('')}
    </div>
    <div style="padding:12px 14px;background:rgba(255,23,68,.04);border:1px solid rgba(255,23,68,.15);border-radius:8px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--red);margin-bottom:6px">Ghi chú xử lý</div>
      <div style="font-size:13px;line-height:1.7">${v.notes}</div>
    </div>
    <div style="display:flex;gap:8px;align-items:center">
      <span style="font-size:12px;color:var(--muted)">Trạng thái xử lý:</span>
      ${statusBadge(v.status)}
      ${statusBadge(v.severity)}
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-ghost btn-sm" onclick="closeModal();showToast('Đang in biên bản vi phạm...')">In BB</button>
    ${v.status !== 'done'
      ? `<button class="btn btn-primary" onclick="closeModal();showToast('✅ Đã cập nhật trạng thái xử lý!')">Cập nhật xử lý</button>`
      : `<button class="btn btn-ghost" style="color:var(--green)"  onclick="closeModal()">✅ Đã hoàn thành</button>`}
  </div>`);
};

// ── ADD PERMIT MODAL ───────────────────────────────────────────────
window.openAddPermitModal = function() {
  openModal(`
  <div class="modal-header">
    <span class="modal-title">Cấp giấy phép hoạt động mới</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body">
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Đơn vị / Cá nhân đề nghị</label>
        <input class="form-control" placeholder="Tên tổ chức hoặc cá nhân">
      </div>
      <div class="form-group">
        <label class="form-label">Loại hoạt động</label>
        <select class="form-control">
          <option>Xây dựng công trình</option>
          <option>Sửa chữa nhà ở</option>
          <option>Lắp đặt cáp/đường ống</option>
          <option>Khai thác cát, sỏi</option>
          <option>Hoạt động khác</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Mô tả nội dung hoạt động</label>
      <textarea class="form-control" rows="2" placeholder="Mô tả chi tiết hoạt động xin phép..."></textarea>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Vị trí trên đê (km)</label>
        <input class="form-control" placeholder="VD: K22+300 Đê Hữu Hồng">
      </div>
      <div class="form-group">
        <label class="form-label">Thời hạn (tháng)</label>
        <input class="form-control" type="number" placeholder="VD: 6">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Điều kiện & Ràng buộc khi cấp phép</label>
      <textarea class="form-control" rows="2" placeholder="Các điều kiện bắt buộc tuân thủ..."></textarea>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('✅ Đã cấp giấy phép mới thành công!')">Cấp giấy phép</button>
  </div>`);
};

// ── REPORT VIOLATION MODAL ─────────────────────────────────────────
window.openReportViolationModal = function() {
  openModal(`
  <div class="modal-header">
    <span class="modal-title" style="color:var(--red)">Báo cáo vi phạm hành lang đê</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body">
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Đối tượng vi phạm</label>
        <input class="form-control" placeholder="Tên cá nhân / tổ chức vi phạm">
      </div>
      <div class="form-group">
        <label class="form-label">Mức độ nghiêm trọng</label>
        <select class="form-control">
          <option value="critical">Nghiêm trọng (ảnh hưởng thân đê)</option>
          <option value="high">Cao (vi phạm lớn)</option>
          <option value="medium">Trung bình</option>
          <option value="low">Thấp (nhắc nhở)</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Hành vi vi phạm</label>
      <select class="form-control">
        <option>Đổ phế thải, rác thải</option>
        <option>Xây dựng công trình không phép</option>
        <option>Đào đất mái đê</option>
        <option>Để vật liệu trên mặt đê</option>
        <option>Khoan, đóng cọc trái phép</option>
        <option>Hành vi vi phạm khác</option>
      </select>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Vị trí vi phạm</label>
        <input class="form-control" placeholder="VD: Mái đê phía sông K15+200 Đê Hữu Đáy">
      </div>
      <div class="form-group">
        <label class="form-label">Cán bộ lập biên bản</label>
        <input class="form-control" value="${window.currentUser?.name || 'Nguyễn Quản Trị'}" readonly>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Ghi chú, mô tả chi tiết</label>
      <textarea class="form-control" rows="3" placeholder="Mô tả tình huống, bằng chứng phát hiện..."></textarea>
    </div>
    <div style="padding:10px 12px;background:rgba(255,202,40,.06);border:1px solid rgba(255,202,40,.2);border-radius:8px;font-size:12px;color:var(--muted)">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Ảnh bằng chứng: <a style="color:var(--cyan);cursor:pointer" onclick="showToast('Upload ảnh sẽ được tích hợp sau.')">Đính kèm ảnh</a>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-sm" style="background:rgba(255,23,68,.1);color:#ff5252;border:1px solid rgba(255,23,68,.3)" onclick="closeModal();showToast('✅ Đã lập biên bản vi phạm và gửi thông báo!')">Lập biên bản</button>
  </div>`);
};
