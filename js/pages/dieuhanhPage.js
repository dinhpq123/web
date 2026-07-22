// ── ĐIỀU HÀNH PAGE (LEADER / ADMIN ONLY) ─────────────────────────────
let dieuhanhTab = 'pending';

// Demo approval queue data
const APPROVAL_QUEUE = [
  {
    id: 'APR-2026-0047', type: 'kpi_import', risk: 'high',
    title: 'Import KPI Thiên tai — Tháng 2/2026',
    desc: 'Nhập liệu 8 chỉ số KPI phòng chống thiên tai từ báo cáo định kỳ T2/2026',
    submitter: 'Nguyễn Thị Lan', submitterRole: 'Chuyên viên Phòng PCTT', submitterAvatar: 'NL',
    submittedAt: '2026-03-13 14:52:30',
    files: ['BaoCaoPCTT_T2_2026.xlsx', 'TongHopKPI_ThienTai_Feb2026.pdf'],
    note: 'Số liệu từ báo cáo tổng hợp tình hình thiên tai T2/2026, đã được Phòng PCTT xác nhận. Cần Chi cục trưởng duyệt trước 17:00 hôm nay.',
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
    otp: true, status: 'pending', urgency: 'high',
  },
  {
    id: 'APR-2026-0046', type: 'data_export', risk: 'high',
    title: 'Xuất báo cáo thiệt hại lũ lụt gửi Sở NN&PTNT',
    desc: 'Xuất toàn bộ dữ liệu thiệt hại, sự cố, lực lượng tháng 2/2026 → file báo cáo chính thức',
    submitter: 'Trần Văn Hùng', submitterRole: 'Trưởng phòng Kế hoạch - Tổng hợp', submitterAvatar: 'TH',
    submittedAt: '2026-03-13 13:10:15',
    files: [],
    note: 'Xuất báo cáo thiệt hại để trình Sở NN&PTNT Hà Nội theo yêu cầu công văn số 215/SNN. File đã được kiểm tra nội dung trước khi xuất.',
    data: [],
    otp: true, status: 'pending', urgency: 'med',
  },
  {
    id: 'APR-2026-0045', type: 'scada_ctrl', risk: 'high',
    title: 'Vận hành khẩn trạm bơm tiêu Phú Diễn — Mức độ 2',
    desc: 'Kích hoạt toàn bộ 4 máy bơm tiêu tại Trạm bơm Phú Diễn ứng phó ngập úng khu Từ Liêm',
    submitter: 'Lê Văn Minh', submitterRole: 'Kỹ sư vận hành — Phòng Thủy lợi', submitterAvatar: 'LM',
    submittedAt: '2026-03-13 11:30:00',
    files: ['LenhVanHanh_PhuDien_20260313.pdf'],
    note: 'Mưa lớn từ 03:00, lưu lượng đỉnh ước 4,200 m³/h. Khu vực Nam Từ Liêm nguy cơ ngập úng nếu không bơm khẩn. Thời gian vận hành dự kiến 8 tiếng.',
    data: [],
    otp: true, status: 'pending', urgency: 'high',
  },
  {
    id: 'APR-2026-0044', type: 'role_change', risk: 'med',
    title: 'Cấp quyền Điều hành trực ban cho Phạm Thị Mai',
    desc: 'Thêm quyền điều hành ca trực và phê duyệt cảnh báo cho cán bộ mới',
    submitter: 'Hoàng Văn Thắng', submitterRole: 'Trưởng phòng Hành chính - Tổ chức', submitterAvatar: 'HT',
    submittedAt: '2026-03-13 09:15:00',
    files: ['QuyetDinh_PhamThiMai_TrucBan.pdf'],
    note: 'Quyết định bổ nhiệm cán bộ trực ban theo Quyết định số 2026/QD-CCT-045. Cán bộ đã hoàn thành khóa tập huấn PCTT cơ sở.',
    data: [],
    otp: false, status: 'pending', urgency: 'low',
  },
];

const APPROVAL_HISTORY = [
  { id: 'APR-2026-0043', type: 'kpi_import', title: 'Import KPI Thiên tai Tháng 1/2026', submitter: 'Nguyễn Thị Lan', approver: 'Nguyễn Văn Sơn (Chi cục trưởng)', approvedAt: '2026-02-03 16:30', status: 'approved', note: 'Đã duyệt. Số liệu khớp với báo cáo tổng hợp PCTT tháng 1.' },
  { id: 'APR-2026-0042', type: 'data_export', title: 'Xuất báo cáo thiệt hại lũ lụt Q4/2025 gửi Bộ', submitter: 'Trần Văn Hùng', approver: 'Lê Thị Hương (Phó Chi cục trưởng)', approvedAt: '2026-01-15 09:10', status: 'approved', note: 'Duyệt. Báo cáo đã được ký số theo quy định.' },
  { id: 'APR-2026-0041', type: 'scada_ctrl', title: 'Vận hành 6 trạm bơm tiêu ứng phó mưa lớn ngày 10/01', submitter: 'Lê Văn Minh', approver: 'Nguyễn Văn Sơn (Chi cục trưởng)', approvedAt: '2026-01-10 14:00', status: 'approved', note: 'Duyệt khẩn. Đã vận hành đúng quy trình, thoát nước hiệu quả.' },
  { id: 'APR-2026-0040', type: 'user_mgmt', title: 'Cấp thêm quyền truy cập dữ liệu GIS cho cán bộ huyện', submitter: 'Hoàng Văn Thắng', approver: 'Nguyễn Văn Sơn (Chi cục trưởng)', approvedAt: '2026-01-05 10:30', status: 'rejected', note: 'Từ chối — chưa có công văn phối hợp từ UBND huyện. Yêu cầu bổ sung hồ sơ.' },
  { id: 'APR-2026-0039', type: 'kpi_import', title: 'Import KPI Thiên tai Tháng 12/2025', submitter: 'Nguyễn Thị Lan', approver: 'Lê Thị Hương (Phó Chi cục trưởng)', approvedAt: '2026-01-03 15:45', status: 'approved', note: 'Duyệt. Số liệu khớp báo cáo tổng kết năm 2025 đã trình Sở.' },
];

function renderDieuhanhPage() {
  const pending = APPROVAL_QUEUE.filter(x => x.status === 'pending').length;
  const urgent = APPROVAL_QUEUE.filter(x => x.status === 'pending' && x.urgency === 'high').length;

  return `
  <div class="page-header">
    <div class="page-title">
      <h1>Điều hành & Phê duyệt</h1>
      <p>Quản lý và phê duyệt các tác vụ quan trọng của hệ thống — dành riêng cho Lãnh đạo & Quản lý</p>
    </div>
    <div class="page-actions">
      <span style="font-size:12px;color:var(--muted);align-self:center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Chỉ hiển thị với Lãnh đạo & Admin
      </span>
    </div>
  </div>

  <!-- Summary cards -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px">
    ${[
      { label: 'Chờ phê duyệt', val: pending, sub: '', color: '#ff6d00', icon: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
      { label: 'Ưu tiên cao', val: urgent, sub: 'Cần xử lý hôm nay', color: '#ff4444', icon: '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' },
      { label: 'Đã duyệt tháng này', val: 12, sub: 'Tháng 3/2026', color: 'var(--green)', icon: '<polyline points="20 6 9 17 4 12"/>' },
      { label: 'Từ chối tháng này', val: 1, sub: 'Tháng 3/2026', color: 'var(--muted)', icon: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' },
    ].map(c => `
    <div class="card" style="padding:16px;border-left:3px solid ${c.color}">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <div style="width:36px;height:36px;background:${c.color}18;border-radius:9px;display:flex;align-items:center;justify-content:center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${c.color}" stroke-width="2">${c.icon}</svg>
        </div>
        <div style="font-size:24px;font-weight:800;color:${c.color}">${c.val}</div>
      </div>
      <div style="font-size:13px;font-weight:600;color:var(--text)">${c.label}</div>
      ${c.sub ? `<div style="font-size:11px;color:var(--muted);margin-top:2px">${c.sub}</div>` : ''}
    </div>`).join('')}
  </div>

  <!-- Tabs -->
  <div class="tabs">
    <button class="tab-btn ${dieuhanhTab === 'pending' ? 'active' : ''}" onclick="switchDieuhanhTab(this,'pending')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      Chờ phê duyệt <span style="background:var(--red);color:#fff;font-size:9px;padding:1px 5px;border-radius:4px;margin-left:4px;font-weight:700">${pending}</span>
    </button>
    <button class="tab-btn ${dieuhanhTab === 'history' ? 'active' : ''}" onclick="switchDieuhanhTab(this,'history')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
      Lịch sử phê duyệt
    </button>
    <button class="tab-btn ${dieuhanhTab === 'settings' ? 'active' : ''}" onclick="switchDieuhanhTab(this,'settings')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
      Cài đặt quy trình duyệt
    </button>
  </div>
  <div id="dieuhanhContent">${getDieuhanhContent()}</div>`;
}

function switchDieuhanhTab(btn, tab) {
  document.querySelectorAll('#dieuhanhContent').length; // ensure rendered
  dieuhanhTab = tab;
  document.querySelectorAll('.tabs .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('dieuhanhContent').innerHTML = getDieuhanhContent();
}

function getDieuhanhContent() {
  if (dieuhanhTab === 'pending') return renderPendingApprovals();
  if (dieuhanhTab === 'history') return renderApprovalHistory();
  if (dieuhanhTab === 'settings') return renderApprovalSettings();
  return '';
}

// ── Pending approvals ──────────────────────────────────────
function renderPendingApprovals() {
  const pending = APPROVAL_QUEUE.filter(x => x.status === 'pending');
  if (!pending.length) return `<div style="text-align:center;padding:60px;color:var(--muted)">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="1.5" style="margin-bottom:14px"><polyline points="20 6 9 17 4 12"/></svg>
    <div style="font-size:16px;font-weight:600;color:var(--green)">Không có yêu cầu nào đang chờ</div>
  </div>`;

  return pending.map((a, qi) => {
    const typeLabels = { kpi_import: 'Import KPI', data_export: 'Export Dữ liệu', scada_ctrl: 'Điều khiển SCADA', role_change: 'Phân quyền', user_mgmt: 'Quản lý TK' };
    const typeColors = { kpi_import: '#0066ff', data_export: '#ff6d00', scada_ctrl: '#ff4444', role_change: '#9c27b0', user_mgmt: '#00c8ff' };
    const urgColors = { high: 'var(--red)', med: 'var(--yellow)', low: 'var(--muted)' };
    const urgLabels = { high: 'Ưu tiên cao', med: 'Bình thường', low: 'Thấp' };
    const tc = typeColors[a.type] || 'var(--cyan)';
    const tl = typeLabels[a.type] || a.type;
    return `
    <div class="card" style="margin-bottom:16px;border-left:3px solid ${tc}">
      <div class="card-header">
        <div style="display:flex;align-items:flex-start;gap:12px;flex:1">
          <div style="padding:4px 9px;background:${tc}22;border:1px solid ${tc}44;border-radius:6px;font-size:10px;font-weight:700;color:${tc};white-space:nowrap">${tl}</div>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:3px">${a.title}</div>
            <div style="font-size:12px;color:var(--muted)">${a.desc}</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
          <span style="font-size:10px;font-weight:700;padding:3px 8px;border-radius:5px;background:${urgColors[a.urgency]}22;color:${urgColors[a.urgency]};border:1px solid ${urgColors[a.urgency]}44">${urgLabels[a.urgency]}</span>
          <code style="font-size:10px;color:var(--muted)">${a.id}</code>
        </div>
      </div>
      <div class="card-body" style="padding-top:0">
        <!-- Submitter + time -->
        <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);margin-bottom:14px">
          <div style="width:34px;height:34px;background:linear-gradient(135deg,#0050cc,#00c8ff);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0">${a.submitterAvatar}</div>
          <div>
            <div style="font-size:12px;font-weight:600">${a.submitter}</div>
            <div style="font-size:11px;color:var(--muted)">${a.submitterRole} · Gửi lúc ${a.submittedAt}</div>
          </div>
          ${a.otp ? `<div style="margin-left:auto;font-size:10px;padding:3px 8px;background:rgba(0,200,255,.08);border:1px solid rgba(0,200,255,.2);border-radius:5px;color:var(--cyan)">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Người thực hiện đã xác thực OTP
          </div>` : ''}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
          <!-- Left: note + files -->
          <div>
            ${a.note ? `<div style="margin-bottom:12px">
              <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px">Ghi chú người gửi</div>
              <div style="font-size:12px;color:var(--text-2);line-height:1.7;padding:10px 13px;background:rgba(0,0,0,.15);border-radius:8px;border-left:2px solid ${tc}">${a.note}</div>
            </div>` : ''}
            ${a.files.length ? `<div>
              <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px">File đính kèm</div>
              ${a.files.map(f => {
      const ext = f.split('.').pop().toUpperCase();
      const fc = { XLSX: '#00e676', XLS: '#00e676', PDF: '#ff6d00', PNG: '#ff4081', JPG: '#ff4081' }[ext] || 'var(--cyan)';
      return `<div style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:rgba(0,0,0,.15);border-radius:7px;margin-bottom:5px;cursor:pointer" onclick="showToast('Đang mở ${f}...')">
                  <span style="font-size:8px;font-weight:800;color:${fc};background:${fc}18;padding:2px 5px;border-radius:4px">${ext}</span>
                  <span style="font-size:12px;color:var(--text-2)">${f}</span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2" style="margin-left:auto"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </div>`;
    }).join('')}
            </div>` : ''}
          </div>
          <!-- Right: extracted data preview (if KPI import) -->
          <div>
            ${a.data.length ? `
            <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px">Dữ liệu trích xuất bởi AI</div>
            <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden">
              ${a.data.map((d, di) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 12px;${di ? 'border-top:1px solid var(--border)' : ''}">
                <span style="font-size:12px;color:var(--muted)">${d.kpi}</span>
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="font-size:12px;font-weight:600;color:var(--text)">${d.val}</span>
                  <span style="font-size:10px;color:${d.conf >= 90 ? 'var(--green)' : d.conf >= 75 ? 'var(--yellow)' : 'var(--red)'}">AI ${d.conf}%</span>
                </div>
              </div>`).join('')}
            </div>` : `<div style="padding:20px;text-align:center;color:var(--muted);font-size:12px;background:rgba(0,0,0,.1);border-radius:8px;border:1px dashed var(--border)">
              Không có dữ liệu xem trước cho tác vụ này
            </div>`}
          </div>
        </div>

        <!-- Action row -->
        <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border);display:flex;gap:10px;justify-content:space-between;align-items:center">
          <button onclick="dieuhanhViewDetail(${qi})" style="padding:9px 18px;background:rgba(0,102,255,.1);border:1px solid rgba(0,102,255,.3);border-radius:9px;color:#60a5fa;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:7px;transition:.2s" onmouseover="this.style.background='rgba(0,102,255,.2)'" onmouseout="this.style.background='rgba(0,102,255,.1)'">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Xem chi tiết &amp; Phê duyệt
          </button>
          <div style="display:flex;gap:8px">
            <button onclick="dieuhanhReject('${a.id}',${qi})" style="padding:8px 16px;background:rgba(255,68,68,.1);border:1px solid rgba(255,68,68,.3);border-radius:9px;color:var(--red);font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px" onmouseover="this.style.background='rgba(255,68,68,.2)'" onmouseout="this.style.background='rgba(255,68,68,.1)'">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Từ chối
            </button>
            <button onclick="dieuhanhApprove('${a.id}',${qi})" style="padding:8px 18px;background:linear-gradient(135deg,var(--green),#00a854);color:#071629;border:none;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px;box-shadow:0 4px 12px rgba(0,230,118,.25)" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Phê duyệt nhanh
            </button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── Approval History ───────────────────────────────────────
function renderApprovalHistory() {
  const typeIcons = {
    kpi_import: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    data_export: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    scada_ctrl: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    role_change: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    user_mgmt: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  };
  return `
  <div class="card">
    <div class="card-header">
      <span class="card-title">Lịch sử phê duyệt</span>
      <div style="display:flex;gap:8px">
        <select class="form-control" style="font-size:12px;padding:4px 9px" id="ahFilter" onchange="document.getElementById('dieuhanhContent').innerHTML=getDieuhanhContent()">
          <option value="">Tất cả loại</option>
          <option value="kpi_import">Import KPI</option>
          <option value="data_export">Export Dữ liệu</option>
          <option value="scada_ctrl">SCADA</option>
          <option value="role_change">Phân quyền</option>
        </select>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Mã yêu cầu</th><th>Tác vụ</th><th>Người gửi</th><th>Người duyệt</th><th>Thời gian duyệt</th><th>Ghi chú</th><th>Kết quả</th></tr></thead>
        <tbody>
          ${APPROVAL_HISTORY.map(h => {
    const ic = typeIcons[h.type] || '';
    return `<tr>
              <td><code style="font-size:11px;color:var(--muted)">${h.id}</code></td>
              <td>
                <div style="display:flex;align-items:center;gap:7px">
                  <div style="width:26px;height:26px;background:rgba(0,200,255,.08);border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2">${ic}</svg>
                  </div>
                  <div>
                    <div style="font-size:12px;font-weight:600">${h.title}</div>
                  </div>
                </div>
              </td>
              <td style="font-size:12px">${h.submitter}</td>
              <td style="font-size:12px;color:var(--cyan)">${h.approver}</td>
              <td class="mono" style="font-size:11px;color:var(--muted)">${h.approvedAt}</td>
              <td style="font-size:11px;color:var(--muted);max-width:180px">${h.note || '—'}</td>
              <td>${h.status === 'approved'
        ? '<span class="badge badge-green">Đã duyệt</span>'
        : '<span class="badge badge-red">Từ chối</span>'}</td>
            </tr>`;
  }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

// ── Approval Settings ──────────────────────────────────────
function renderApprovalSettings() {
  // SVG path strings for each action type
  const ACTION_SVG = {
    kpi_import: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    data_export: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    scada_ctrl: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    role_change: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    user_mgmt: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    api_key: '<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>',
    report_sign: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    alert_ack: '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  };
  const ACTIONS = [
    { id: 'kpi_import', name: 'Import dữ liệu KPI Thiên tai', desc: 'Nhập liệu chỉ số PCTT định kỳ', needApproval: true, approver: 'Chi cục trưởng', minApprovers: 1, notify: true },
    { id: 'data_export', name: 'Xuất báo cáo PCTT', desc: 'Export báo cáo gửi cơ quan cấp trên', needApproval: true, approver: 'Phó Chi cục trưởng hoặc Chi cục trưởng', minApprovers: 1, notify: true },
    { id: 'scada_ctrl', name: 'Vận hành trạm bơm / cống', desc: 'Kích hoạt, tạm dừng thiết bị thủy lợi', needApproval: true, approver: 'Trưởng phòng Thủy lợi', minApprovers: 1, notify: true },
    { id: 'role_change', name: 'Thay đổi phân quyền', desc: 'Cập nhật quyền truy cập người dùng', needApproval: true, approver: 'Phó Chi cục trưởng', minApprovers: 1, notify: false },
    { id: 'user_mgmt', name: 'Quản lý tài khoản', desc: 'Thêm/xóa/đặt lại tài khoản hệ thống', needApproval: false, approver: 'Giám đốc', minApprovers: 1, notify: false },
    { id: 'api_key', name: 'Tạo/Thu hồi API Key', desc: 'Quản lý API Key tích hợp IoT/SCADA', needApproval: false, approver: 'Admin hệ thống', minApprovers: 1, notify: false },
    { id: 'report_sign', name: 'Ký duyệt báo cáo', desc: 'Phê duyệt báo cáo PCTT gửi Sở/Bộ', needApproval: true, approver: 'Chi cục trưởng', minApprovers: 1, notify: true },
    { id: 'alert_ack', name: 'Đóng cảnh báo KHẨN CẤP', desc: 'Xác nhận xử lý xong cảnh báo mức 2/3', needApproval: false, approver: 'Trưởng ca trực ban', minApprovers: 1, notify: true },
  ];
  return `
  <div style="background:rgba(0,102,255,.07);border:1px solid rgba(0,102,255,.2);border-radius:10px;padding:14px 18px;margin-bottom:16px;font-size:12px;color:rgba(96,165,250,.9);line-height:1.7;display:flex;gap:10px">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;margin-top:1px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    <span>Cấu hình các tác vụ hệ thống nào cần được lãnh đạo/quản lý phê duyệt trước khi thực thi. Khi một tác vụ được bật yêu cầu duyệt, người thực hiện sẽ gửi yêu cầu và người có quyền duyệt sẽ nhận thông báo qua hệ thống + Zalo ZNS.</span>
  </div>
  <div class="card">
    <div class="card-header">
      <span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Quy trình Phê duyệt theo Tác vụ</span>
      <button class="btn btn-primary btn-sm" onclick="showToast('Đã lưu cài đặt quy trình duyệt!')">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg>
        Lưu cài đặt
      </button>
    </div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px">
            <th style="padding:10px 18px;text-align:left;border-bottom:1px solid var(--border)">Tác vụ</th>
            <th style="padding:10px 16px;text-align:center;border-bottom:1px solid var(--border)">Cần duyệt</th>
            <th style="padding:10px 16px;text-align:left;border-bottom:1px solid var(--border)">Người có quyền duyệt</th>
            <th style="padding:10px 16px;text-align:center;border-bottom:1px solid var(--border)">Số người duyệt tối thiểu</th>
            <th style="padding:10px 16px;text-align:center;border-bottom:1px solid var(--border)">Thông báo Zalo</th>
          </tr>
        </thead>
        <tbody>
          ${ACTIONS.map(a => `<tr style="border-bottom:1px solid var(--border)">
            <td style="padding:13px 18px">
              <div style="display:flex;align-items:center;gap:10px">
                <div style="width:32px;height:32px;background:rgba(0,200,255,.07);border:1px solid rgba(0,200,255,.14);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2">${ACTION_SVG[a.id] || ''}</svg>
                </div>
                <div>
                  <div style="font-size:13px;font-weight:600">${a.name}</div>
                  <div style="font-size:11px;color:var(--muted)">${a.desc}</div>
                </div>
              </div>
            </td>
            <td style="padding:10px 16px;text-align:center">
              <label style="position:relative;display:inline-block;width:40px;height:22px;cursor:pointer">
                <input type="checkbox" ${a.needApproval ? 'checked' : ''} style="opacity:0;width:0;height:0" onchange="showToast(this.checked?'Đã bật yêu cầu duyệt cho tác vụ này!':'Đã tắt yêu cầu duyệt!')">
                <span style="position:absolute;inset:0;background:${a.needApproval ? 'var(--cyan)' : 'rgba(255,255,255,.1)'};border-radius:22px;transition:.3s"><span style="position:absolute;width:16px;height:16px;background:#fff;border-radius:50%;top:3px;left:${a.needApproval ? '21px' : '3px'};transition:.3s"></span></span>
              </label>
            </td>
            <td style="padding:10px 16px">
              <select class="form-control" style="font-size:12px;padding:5px 9px;min-width:160px" onchange="showToast('Đã cập nhật người duyệt!')">
                <option ${a.approver === 'Chi cục trưởng' ? 'selected' : ''}>Chi cục trưởng</option>
                <option ${a.approver === 'Phó Chi cục trưởng hoặc Chi cục trưởng' ? 'selected' : ''}>Phó CCT hoặc Chi cục trưởng</option>
                <option ${a.approver === 'Phó Chi cục trưởng' ? 'selected' : ''}>Phó Chi cục trưởng</option>
                <option ${a.approver === 'Trưởng phòng Thủy lợi' ? 'selected' : ''}>Trưởng phòng Thủy lợi</option>
                <option ${a.approver === 'Trưởng phòng Hành chính' ? 'selected' : ''}>Trưởng phòng Hành chính</option>
                <option ${a.approver === 'Admin hệ thống' ? 'selected' : ''}>Admin hệ thống</option>
                <option ${a.approver === 'Trưởng ca trực ban' ? 'selected' : ''}>Trưởng ca trực ban</option>
              </select>
            </td>
            <td style="padding:10px 16px;text-align:center">
              <select class="form-control" style="font-size:12px;padding:5px 9px;width:70px;margin:0 auto" onchange="showToast('Đã cập nhật!')">
                <option ${a.minApprovers === 1 ? 'selected' : ''}>1</option>
                <option ${a.minApprovers === 2 ? 'selected' : ''}>2</option>
                <option ${a.minApprovers === 3 ? 'selected' : ''}>3</option>
              </select>
            </td>
            <td style="padding:10px 16px;text-align:center">
              <label style="position:relative;display:inline-block;width:40px;height:22px;cursor:pointer">
                <input type="checkbox" ${a.notify ? 'checked' : ''} style="opacity:0;width:0;height:0" onchange="showToast(this.checked?'Đã bật Zalo ZNS!':'Đã tắt Zalo ZNS!')">
                <span style="position:absolute;inset:0;background:${a.notify ? 'var(--cyan)' : 'rgba(255,255,255,.1)'};border-radius:22px;transition:.3s"><span style="position:absolute;width:16px;height:16px;background:#fff;border-radius:50%;top:3px;left:${a.notify ? '21px' : '3px'};transition:.3s"></span></span>
              </label>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div style="padding:12px 18px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border)">
      <span style="font-size:11px;color:var(--muted)">Thay đổi sẽ áp dụng ngay cho toàn hệ thống. Các yêu cầu đang chờ không bị ảnh hưởng hồi tố.</span>
      <button class="btn btn-primary btn-sm" onclick="showToast('Đã lưu cài đặt quy trình duyệt!')">Lưu cài đặt</button>
    </div>
  </div>`;
}

// ── Detail View ────────────────────────────────────────────
function dieuhanhViewDetail(qi) {
  const html = buildApprovalDetailHtml(qi);
  if (!html) return;
  openModal(html, { width: '1100px' });
}

function buildApprovalDetailHtml(qi) {
  const a = APPROVAL_QUEUE[qi];
  if (!a) return '';
  const typeColors = { kpi_import: '#0066ff', data_export: '#ff6d00', scada_ctrl: '#ff4444', role_change: '#9c27b0', user_mgmt: '#00c8ff' };
  const typeLabels = { kpi_import: 'Import KPI', data_export: 'Export Dữ liệu', scada_ctrl: 'Điều khiển SCADA', role_change: 'Phân quyền', user_mgmt: 'Quản lý TK' };
  const urgColors = { high: 'var(--red)', med: 'var(--yellow)', low: 'var(--muted)' };
  const urgLabels = { high: 'Ưu tiên cao — cần xử lý hôm nay', med: 'Bình thường', low: 'Thấp' };
  const tc = typeColors[a.type] || 'var(--cyan)';

  // Impact description per type
  const impactMap = {
    kpi_import: { title: 'Tác động Import KPI', items: ['Ghi đè dữ liệu KPI cho kỳ được chọn', 'Cập nhật Dashboard lãnh đạo ngay lập tức', 'Dữ liệu cũ được lưu vào lịch sử phiên bản', 'Các báo cáo định kỳ sẽ dùng số liệu mới này'] },
    data_export: { title: 'Tác động Export Dữ liệu', items: ['Tạo file Excel chứa toàn bộ dữ liệu được chọn', 'File sẽ được mã hóa AES-256 trước khi giao', 'Ghi log truy xuất dữ liệu theo quy định PDPA', 'Đường link tải về hết hạn sau 24 giờ'] },
    scada_ctrl: { title: 'Tác động Điều khiển SCADA', items: ['Thay đổi trạng thái van/bơm ngay lập tức', 'Ảnh hưởng đến nguồn cấp nước khu vực liên quan', 'Ghi log điều khiển với timestamp và định danh người duyệt', 'Hệ thống SCADA gửi cảnh báo xác nhận sau 30 giây'] },
    role_change: { title: 'Tác động Phân quyền', items: ['Cập nhật quyền truy cập ngay lập tức', 'Phiên làm việc hiện tại của người dùng không bị ảnh hưởng', 'Quyền mới áp dụng từ lần đăng nhập tiếp theo', 'Ghi log thay đổi quyền kèm lý do theo quy định'] },
    user_mgmt: { title: 'Tác động Quản lý Tài khoản', items: ['Thực thi hành động trên tài khoản được chỉ định', 'Gửi email thông báo đến người dùng liên quan', 'Ghi log hành động theo quy định kiểm toán', 'Phiên đăng nhập hiện tại sẽ bị thu hồi nếu tình trạng thay đổi'] },
  };
  const impact = impactMap[a.type] || { title: 'Tác động', items: ['Thực thi tác vụ và ghi log vào hệ thống.'] };

  return `<div class="modal-header" style="background:linear-gradient(135deg,${tc}22,transparent);border-bottom:1px solid ${tc}33">
    <span class="modal-title" style="color:${tc}">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      Chi tiết yêu cầu — ${a.id}
    </span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body" style="max-height:72vh;overflow-y:auto;padding:0">

    <!-- Title bar -->
    <div style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:flex-start;gap:12px">
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
          <span style="padding:3px 9px;background:${tc}22;border:1px solid ${tc}44;border-radius:5px;font-size:10px;font-weight:700;color:${tc}">${typeLabels[a.type] || a.type}</span>
          <span style="font-size:10px;font-weight:700;padding:3px 8px;border-radius:5px;background:${urgColors[a.urgency]}22;color:${urgColors[a.urgency]};border:1px solid ${urgColors[a.urgency]}33">${urgLabels[a.urgency]}</span>
        </div>
        <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:4px">${a.title}</div>
        <div style="font-size:12px;color:var(--muted)">${a.desc}</div>
      </div>
    </div>

    <!-- Submitter info -->
    <div style="padding:12px 20px;background:rgba(0,0,0,.15);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px">
      <div style="width:38px;height:38px;background:linear-gradient(135deg,#0050cc,#00c8ff);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0">${a.submitterAvatar}</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600">${a.submitter}</div>
        <div style="font-size:11px;color:var(--muted)">${a.submitterRole} · Gửi lúc <b>${a.submittedAt}</b></div>
      </div>
      ${a.otp ? `<div style="font-size:11px;padding:5px 10px;background:rgba(0,200,255,.08);border:1px solid rgba(0,200,255,.2);border-radius:7px;color:var(--cyan);display:flex;align-items:center;gap:6px">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Người gửi đã xác thực OTP
      </div>` : ''}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;border-bottom:1px solid var(--border)">
      <!-- Left: Note + Files -->
      <div style="padding:16px 20px;border-right:1px solid var(--border)">
        ${a.note ? `<div style="margin-bottom:14px">
          <div style="font-size:10px;font-weight:700;color:var(--muted);letter-spacing:.6px;text-transform:uppercase;margin-bottom:7px">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            Ghi chú người gửi
          </div>
          <div style="font-size:12px;color:var(--text-2);line-height:1.7;padding:10px 13px;background:rgba(0,0,0,.15);border-radius:8px;border-left:3px solid ${tc}">${a.note}</div>
        </div>` : ''}

        <div style="font-size:10px;font-weight:700;color:var(--muted);letter-spacing:.6px;text-transform:uppercase;margin-bottom:8px">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          File đính kèm (${a.files.length})
        </div>
        ${a.files.length ? a.files.map(f => {
    const ext = f.split('.').pop().toUpperCase();
    const fc = { XLSX: '#00e676', XLS: '#00e676', PDF: '#ff6d00', PNG: '#ff4081', JPG: '#ff4081', DOCX: '#60a5fa', DOC: '#60a5fa' }[ext] || 'var(--cyan)';
    const isPdf = ext === 'PDF';
    const isImg = ['PNG', 'JPG', 'JPEG'].includes(ext);
    const isXls = ['XLS', 'XLSX'].includes(ext);
    return `<div style="background:rgba(0,0,0,.18);border:1px solid rgba(255,255,255,.07);border-radius:9px;overflow:hidden;margin-bottom:8px">
            <div style="padding:10px 13px;display:flex;align-items:center;gap:9px">
              <div style="width:34px;height:34px;background:${fc}18;border:1px solid ${fc}33;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:${fc};flex-shrink:0">${ext}</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${f}</div>
                <div style="font-size:10px;color:var(--muted)">Đã tải lên · ${a.submittedAt.split(' ')[0]}</div>
              </div>
              <button onclick="showToast('Đang mở ${f}...')" style="background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.25);border-radius:6px;color:var(--cyan);font-size:11px;font-weight:600;cursor:pointer;padding:5px 10px;display:flex;align-items:center;gap:5px;white-space:nowrap">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                ${isPdf ? 'Mở PDF' : isImg ? 'Xem ảnh' : isXls ? 'Mở Excel' : 'Mở file'}
              </button>
            </div>
            ${isImg ? `<div style="padding:0 13px 12px"><div style="background:rgba(0,0,0,.3);border-radius:6px;height:80px;display:flex;align-items:center;justify-content:center;border:1px dashed rgba(255,255,255,.1)">
              <div style="text-align:center;color:var(--muted);font-size:11px">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="display:block;margin:0 auto 5px"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                Xem trước ảnh
              </div>
            </div></div>` : ''}
          </div>`;
  }).join('') : `<div style="padding:20px;text-align:center;color:var(--muted);font-size:12px;background:rgba(0,0,0,.1);border-radius:8px;border:1px dashed var(--border)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="display:block;margin:0 auto 8px;opacity:.4"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Không có file đính kèm
        </div>`}
      </div>

      <!-- Right: Data output / Impact -->
      <div style="padding:16px 20px">
        ${a.data.length ? `
        <div style="font-size:10px;font-weight:700;color:var(--muted);letter-spacing:.6px;text-transform:uppercase;margin-bottom:8px">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2" style="vertical-align:middle"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          Đầu ra AI — Dữ liệu sẽ được import
        </div>
        <div style="border:1px solid var(--border);border-radius:9px;overflow:hidden;margin-bottom:14px">
          <div style="padding:7px 12px;background:rgba(0,102,255,.08);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;font-size:10px;color:var(--muted)">
            <span>Chỉ số KPI</span><span>Giá trị · Độ tin cậy AI</span>
          </div>
          ${a.data.map((d, di) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;${di ? 'border-top:1px solid var(--border)' : ''}">
            <span style="font-size:12px;color:var(--muted)">${d.kpi}</span>
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:13px;font-weight:700;color:var(--text)">${d.val}</span>
              <div style="display:flex;align-items:center;gap:4px">
                <div style="width:40px;height:4px;background:rgba(255,255,255,.1);border-radius:2px"><div style="height:100%;width:${d.conf}%;background:${d.conf >= 90 ? 'var(--green)' : d.conf >= 75 ? 'var(--yellow)' : 'var(--red)'};border-radius:2px"></div></div>
                <span style="font-size:10px;color:${d.conf >= 90 ? 'var(--green)' : d.conf >= 75 ? 'var(--yellow)' : 'var(--red)'}">AI ${d.conf}%</span>
              </div>
              ${d.conf < 80 ? '<span style="font-size:9px;padding:1px 5px;background:rgba(255,202,40,.1);color:var(--yellow);border-radius:3px">Cần kiểm tra</span>' : ''}
            </div>
          </div>`).join('')}
        </div>` : ''}

        <div style="font-size:10px;font-weight:700;color:var(--muted);letter-spacing:.6px;text-transform:uppercase;margin-bottom:8px">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--yellow)" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          ${impact.title}
        </div>
        <div style="border:1px solid rgba(255,202,40,.15);border-radius:9px;overflow:hidden">
          ${impact.items.map((item, ii) => `<div style="padding:8px 13px;${ii ? 'border-top:1px solid rgba(255,202,40,.1)' : ''}";display:flex;align-items:flex-start;gap:8px">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,202,40,.7)" stroke-width="2" style="flex-shrink:0;margin-top:1px"><polyline points="20 6 9 17 4 12"/></svg>
            <span style="font-size:12px;color:var(--text-2)">${item}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>

  <div class="modal-footer" style="justify-content:space-between;align-items:center">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>

    <!-- Center nav -->
    <div style="display:flex;align-items:center;gap:10px">
      <button onclick="dieuhanhNavigateDetail(${qi}-1)" ${qi === 0 ? 'disabled' : ''} style="width:34px;height:34px;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:${qi === 0 ? 'rgba(255,255,255,.25)' : 'var(--text)'};cursor:${qi === 0 ? 'not-allowed' : 'pointer'};display:flex;align-items:center;justify-content:center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div style="text-align:center;min-width:110px">
        <div style="font-size:13px;font-weight:700;color:var(--cyan)">${qi + 1} / ${APPROVAL_QUEUE.filter(x => x.status === 'pending').length}</div>
        <div style="font-size:10px;color:var(--muted)">yêu cầu chờ duyệt</div>
      </div>
      <button onclick="dieuhanhNavigateDetail(${qi}+1)" ${qi >= APPROVAL_QUEUE.filter(x => x.status === 'pending').length - 1 ? 'disabled' : ''} style="width:34px;height:34px;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:${qi >= APPROVAL_QUEUE.filter(x => x.status === 'pending').length - 1 ? 'rgba(255,255,255,.25)' : 'var(--text)'};cursor:${qi >= APPROVAL_QUEUE.filter(x => x.status === 'pending').length - 1 ? 'not-allowed' : 'pointer'};display:flex;align-items:center;justify-content:center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>

    <!-- Right actions -->
    <div style="display:flex;gap:10px">
      <button onclick="closeModal();dieuhanhReject('${a.id}',${qi})" style="padding:9px 18px;background:rgba(255,68,68,.1);border:1px solid rgba(255,68,68,.3);border-radius:9px;color:var(--red);font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:7px">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        Từ chối
      </button>
      <button onclick="closeModal();dieuhanhApprove('${a.id}',${qi})" style="padding:9px 22px;background:linear-gradient(135deg,var(--green),#00a854);color:#071629;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:7px;box-shadow:0 4px 14px rgba(0,230,118,.3)">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        Phê duyệt &amp; OTP
      </button>
    </div>
  </div>`;
}

function dieuhanhNavigateDetail(qi) {
  const pending = APPROVAL_QUEUE.filter(x => x.status === 'pending');
  if (qi < 0 || qi >= pending.length) return;
  const box = document.querySelector('#modalMain .modal-box');
  if (!box) { closeModal(); setTimeout(() => dieuhanhViewDetail(qi), 80); return; }
  applyModalAnimation(box, () => { box.innerHTML = buildApprovalDetailHtml(qi); });
}


// ── Approve / Reject actions ───────────────────────────────
let _dieuhanhPendingQi = -1;
let _dieuhanhApproveNote = '';

function dieuhanhApprove(id, qi) {
  openModal(`<div class="modal-header">
    <span class="modal-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Phê duyệt yêu cầu ${id}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body">
    <div style="background:rgba(0,230,118,.06);border:1px solid rgba(0,230,118,.2);border-radius:10px;padding:14px;margin-bottom:14px;font-size:13px;color:var(--muted);line-height:1.7">
      Bạn đang phê duyệt yêu cầu <b style="color:var(--text)">${APPROVAL_QUEUE[qi]?.title || id}</b>.<br>
      Sau bước này, hệ thống sẽ yêu cầu <b style="color:var(--cyan)">xác thực OTP 2 lớp</b> trước khi thực thi.
    </div>
    <div class="form-group"><label class="form-label">Ý kiến phê duyệt (tuỳ chọn)</label>
      <textarea class="form-control" rows="2" id="approveNote" placeholder="VD: Đã kiểm tra số liệu, phê duyệt..."></textarea>
    </div>
    <div style="padding:10px 14px;background:rgba(0,102,255,.06);border:1px solid rgba(0,102,255,.18);border-radius:8px;font-size:12px;color:rgba(96,165,250,.9);display:flex;align-items:center;gap:8px">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      Hành động phê duyệt được bảo vệ bởi xác thực 2 lớp (2FA) theo chính sách bảo mật hệ thống.
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="_dieuhanhApproveNote=document.getElementById('approveNote')?.value||'';closeModal();showDieuhanhOtpModal(${qi})" style="background:var(--green);border-color:var(--green)">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      Tiếp tục &amp; Xác thực OTP
    </button>
  </div>`);
}

function showDieuhanhOtpModal(qi) {
  _dieuhanhPendingQi = qi;
  const title = APPROVAL_QUEUE[qi]?.title || '';
  openModal(`<div class="modal-header">
    <span class="modal-title">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2" style="vertical-align:middle"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      Xác thực Lãnh đạo — Nhập OTP
    </span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body">
    <div style="text-align:center;margin-bottom:20px">
      <div style="width:60px;height:60px;background:linear-gradient(135deg,rgba(0,200,118,.15),rgba(0,102,255,.1));border:2px solid rgba(0,200,118,.3);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 12px">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <div style="font-size:14px;font-weight:700;color:#e2e8f0;margin-bottom:5px">Xác thực 2 lớp — Quyền Lãnh đạo</div>
      <div style="font-size:12px;color:var(--muted);line-height:1.6">Phê duyệt: <b style="color:var(--text)">${title}</b><br>Nhập mã OTP để xác nhận danh tính và ký duyệt.</div>
    </div>
    <div style="display:flex;gap:8px;margin-bottom:18px;justify-content:center">
      ${[['totp', 'Authenticator', 'TOTP', true], ['sms', 'SMS', '****5678', false], ['email', 'Email', 'lb***@pctt.hanoi.gov.vn', false]].map(([id, label, dest, active]) => `
      <button id="dhOtpMethod_${id}" onclick="dhSelectOtpMethod('${id}')" style="padding:7px 13px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid ${active ? 'rgba(0,200,255,.4)' : 'rgba(255,255,255,.1)'};background:${active ? 'rgba(0,200,255,.1)' : 'transparent'};color:${active ? 'var(--cyan)' : 'var(--muted)'};transition:.2s">
        ${label}<br><span style="font-size:10px;font-weight:400;opacity:.7">${dest}</span>
      </button>`).join('')}
    </div>
    <div style="display:flex;gap:10px;justify-content:center;margin-bottom:8px">
      ${Array.from({ length: 6 }, (_, i) => `<input id="dhOtp${i}" type="text" maxlength="1" inputmode="numeric"
        style="width:44px;height:52px;text-align:center;font-size:22px;font-weight:700;font-family:'Roboto Mono',monospace;background:rgba(0,0,0,.25);border:2px solid rgba(0,200,255,.2);border-radius:10px;color:var(--cyan);outline:none;transition:.2s"
        onfocus="this.style.borderColor='rgba(0,200,255,.7)';this.style.background='rgba(0,200,255,.06)'"
        onblur="this.style.borderColor='rgba(0,200,255,.2)';this.style.background='rgba(0,0,0,.25)'"
        oninput="dhOtpInput(this,${i})" onkeydown="dhOtpKeydown(this,${i},event)">`).join('')}
    </div>
    <div style="text-align:center;font-size:11px;color:var(--muted);margin-bottom:6px">Nhập mã 6 chữ số từ ứng dụng Authenticator</div>
    <div id="dhOtpError" style="text-align:center;font-size:12px;color:var(--red);min-height:18px;margin-bottom:4px"></div>
    <div style="text-align:center">
      <span style="font-size:12px;color:var(--muted)">Không nhận được mã? </span>
      <button id="dhOtpResend" onclick="dhResendOtp()" style="background:none;border:none;color:var(--cyan);font-size:12px;cursor:pointer;font-weight:600" disabled>Gửi lại (<span id="dhOtpTimer">60</span>s)</button>
    </div>
  </div>
  <div class="modal-footer" style="flex-direction:column;gap:10px">
    <div style="display:flex;gap:10px;width:100%">
      <button class="btn btn-ghost" onclick="closeModal()" style="flex:1">Hủy</button>
      <button onclick="dhVerifyOtp()" style="flex:2;padding:10px;background:linear-gradient(135deg,var(--green),#00a854);color:#071629;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg>
        Xác nhận OTP &amp; Ký duyệt
      </button>
    </div>
    <div style="font-size:11px;color:var(--muted);text-align:center">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      Hành vi phê duyệt được ghi log đầy đủ kèm timestamp và OTP hash
    </div>
  </div>`);
  setTimeout(() => { const f = document.getElementById('dhOtp0'); if (f) f.focus(); dhStartOtpTimer(); }, 100);
}

function dhSelectOtpMethod(id) {
  ['totp', 'sms', 'email'].forEach(m => {
    const b = document.getElementById('dhOtpMethod_' + m);
    if (!b) return;
    const on = m === id;
    b.style.borderColor = on ? 'rgba(0,200,255,.4)' : 'rgba(255,255,255,.1)';
    b.style.background = on ? 'rgba(0,200,255,.1)' : 'transparent';
    b.style.color = on ? 'var(--cyan)' : 'var(--muted)';
  });
  if (id !== 'totp') showToast('Đã gửi OTP qua ' + (id === 'sms' ? 'SMS' : 'Email') + '!');
}

let _dhOtpTimer = null;
function dhStartOtpTimer() {
  let s = 60;
  const btn = document.getElementById('dhOtpResend'), span = document.getElementById('dhOtpTimer');
  if (!btn || !span) return;
  _dhOtpTimer = setInterval(() => {
    s--; if (span) span.textContent = s;
    if (s <= 0) { clearInterval(_dhOtpTimer); if (btn) { btn.disabled = false; btn.textContent = 'Gửi lại'; } }
  }, 1000);
}
function dhResendOtp() {
  const btn = document.getElementById('dhOtpResend');
  if (btn) { btn.disabled = true; btn.innerHTML = 'Gửi lại (<span id="dhOtpTimer">60</span>s)'; }
  for (let i = 0; i < 6; i++) { const b = document.getElementById('dhOtp' + i); if (b) b.value = ''; }
  const f = document.getElementById('dhOtp0'); if (f) f.focus();
  showToast('Đã gửi lại mã OTP!'); dhStartOtpTimer();
}
function dhOtpInput(el, idx) {
  el.value = el.value.replace(/[^0-9]/g, '').slice(-1);
  if (el.value && idx < 5) { const n = document.getElementById('dhOtp' + (idx + 1)); if (n) n.focus(); }
  const code = Array.from({ length: 6 }, (_, i) => document.getElementById('dhOtp' + i)?.value || '').join('');
  if (code.length === 6) dhVerifyOtp();
}
function dhOtpKeydown(el, idx, e) {
  if (e.key === 'Backspace' && !el.value && idx > 0) { const p = document.getElementById('dhOtp' + (idx - 1)); if (p) { p.value = ''; p.focus(); } }
}
function dhVerifyOtp() {
  const code = Array.from({ length: 6 }, (_, i) => document.getElementById('dhOtp' + i)?.value || '').join('');
  const err = document.getElementById('dhOtpError');
  if (code.length < 6) { if (err) err.textContent = '⚠ Vui lòng nhập đủ 6 chữ số.'; return; }
  if (code === '000000') {
    if (err) { err.textContent = '✕ Mã OTP không đúng. Vui lòng thử lại.'; err.style.color = 'var(--red)'; }
    for (let i = 0; i < 6; i++) { const b = document.getElementById('dhOtp' + i); if (b) { b.value = ''; b.style.borderColor = 'rgba(255,23,68,.5)'; } }
    const f = document.getElementById('dhOtp0'); if (f) f.focus(); return;
  }
  clearInterval(_dhOtpTimer);
  closeModal();
  dieuhanhApproveConfirm(_dieuhanhPendingQi);
}

function dieuhanhApproveConfirm(qi) {
  if (APPROVAL_QUEUE[qi]) APPROVAL_QUEUE[qi].status = 'approved';
  showToast('<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Đã phê duyệt thành công! Tác vụ đang được thực thi...');
  setTimeout(() => {
    const c = document.getElementById('dieuhanhContent');
    if (c) c.innerHTML = getDieuhanhContent();
  }, 600);
}

function dieuhanhReject(id, qi) {
  openModal(`<div class="modal-header">
    <span class="modal-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Từ chối yêu cầu ${id}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body">
    <div style="background:rgba(255,68,68,.06);border:1px solid rgba(255,68,68,.2);border-radius:10px;padding:14px;margin-bottom:14px;font-size:13px;color:var(--muted)">
      Bạn đang từ chối yêu cầu <b style="color:var(--text)">${APPROVAL_QUEUE[qi]?.title || id}</b>.<br>
      Người gửi sẽ được thông báo lý do từ chối.
    </div>
    <div class="form-group"><label class="form-label">Lý do từ chối <span style="color:var(--red)">*</span></label>
      <textarea class="form-control" rows="3" id="rejectNote" placeholder="Nêu rõ lý do từ chối để người gửi có thể chỉnh sửa và gửi lại..."></textarea>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-danger" onclick="dieuhanhRejectConfirm(${qi})">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      Xác nhận Từ chối
    </button>
  </div>`);
}

function dieuhanhRejectConfirm(qi) {
  const note = document.getElementById('rejectNote')?.value || '';
  if (!note.trim()) { showToast('<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--yellow)" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg> Vui lòng nhập lý do từ chối!'); return; }
  if (APPROVAL_QUEUE[qi]) APPROVAL_QUEUE[qi].status = 'rejected';
  closeModal();
  showToast('<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Đã từ chối yêu cầu. Người gửi sẽ nhận thông báo.');
  setTimeout(() => {
    const c = document.getElementById('dieuhanhContent');
    if (c) c.innerHTML = getDieuhanhContent();
  }, 600);
}
