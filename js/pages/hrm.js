// ── HRM PAGE (NÂNG CAO) ───────────────────────────────────────────
let hrmTab = 'employees';

const PCTT_ROLE_LABELS = {
  'CHI_CUC_TRUONG': 'Chi cục trưởng',
  'DIEU_HANH': 'Điều hành PCTT',
  'KY_THUAT': 'Kỹ thuật viên',
  'QUAN_LY_DE': 'Quản lý Đê điều',
  'HR': 'Nhân sự - HC',
  'SYSADMIN': 'Quản trị IT',
  'VIEWER': 'Thanh tra - PC',
  'DISPATCHER': 'Điều phối viên',
};

const PCTT_ROLE_BADGE = {
  'CHI_CUC_TRUONG': 'badge-role',
  'DIEU_HANH': 'badge-role',
  'KY_THUAT': 'badge-role',
  'QUAN_LY_DE': 'badge-role',
  'HR': 'badge-role',
  'SYSADMIN': 'badge-role',
  'VIEWER': 'badge-gray',
};

function renderHrm() {
  const roles = { admin: 'Admin', dispatcher: 'Dispatcher', operator: 'Operator', viewer: 'Viewer' };

  // Pagination & Filter initialization
  if (typeof window.hrmEmpPage === 'undefined') window.hrmEmpPage = 1;
  if (typeof window.hrmSearchQuery === 'undefined') window.hrmSearchQuery = '';
  if (typeof window.hrmFactoryFilter === 'undefined') window.hrmFactoryFilter = '';
  if (typeof window.hrmDeptFilter === 'undefined') window.hrmDeptFilter = '';

  const avgAge = Math.round(DATA.employees.reduce((acc, e) => acc + (e.age || 0), 0) / DATA.employees.length);
  const avgExp = (DATA.employees.reduce((acc, e) => acc + (e.exp || 0), 0) / DATA.employees.length).toFixed(1);

  return `
  <div class="page-header">
    <div class="page-title"><h1>Quản lý Nhân sự</h1><p>Hồ sơ CBCNV, phân quyền, chấm công và KPI</p></div>
    <div class="page-actions">
      <button class="btn btn-ghost btn-sm" onclick="showToast('Đang xuất template nhập liệu...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Template</button>
      <button class="btn btn-primary" onclick="openAddEmployee()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Thêm nhân viên</button>
    </div>
  </div>
  <div class="kpi-grid" style="margin-bottom:16px">
    <div class="kpi-card" style="--accent-color:var(--primary)"><div class="kpi-label">Tổng CBCNV</div><div class="kpi-value">${DATA.employees.length}</div></div>
    <div class="kpi-card" style="--accent-color:var(--success)"><div class="kpi-label">Đang làm việc</div><div class="kpi-value">${DATA.employees.filter(e => e.status === 'active').length}</div></div>
    <div class="kpi-card" style="--accent-color:var(--primary)"><div class="kpi-label">Ca 24/7 hôm nay</div><div class="kpi-value">3</div><div class="kpi-sub">Sáng · Chiều · Đêm</div></div>
    <div class="kpi-card" style="--accent-color:var(--info)"><div class="kpi-label">Tuổi trung bình</div><div class="kpi-value">${avgAge}</div><div class="kpi-sub">Năm tuổi</div></div>
    <div class="kpi-card" style="--accent-color:var(--primary)"><div class="kpi-label">KN trung bình</div><div class="kpi-value">${avgExp}</div><div class="kpi-sub">Năm kinh nghiệm</div></div>
    <div class="kpi-card" style="--accent-color:var(--primary)"><div class="kpi-label">KPI TB tháng 2</div><div class="kpi-value">92<span style="font-size:16px;color:var(--muted)">%</span></div></div>
  </div>
  <div class="tabs">
    <button class="tab-btn ${hrmTab === 'employees' ? 'active' : ''}" onclick="switchHrmTab('employees')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Danh sách CBCNV</button>
    <button class="tab-btn ${hrmTab === 'attendance' ? 'active' : ''}" onclick="switchHrmTab('attendance')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Chấm công & Phân ca</button>
    <button class="tab-btn ${hrmTab === 'kpi' ? 'active' : ''}" onclick="switchHrmTab('kpi')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> KPI Nhân viên</button>
    <button class="tab-btn ${hrmTab === 'orgchart' ? 'active' : ''}" onclick="switchHrmTab('orgchart')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg> Sơ đồ tổ chức</button>
    <button class="tab-btn ${hrmTab === 'departments' ? 'active' : ''}" onclick="switchHrmTab('departments')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg> Phòng ban</button>
    <button class="tab-btn ${hrmTab === 'contacts' ? 'active' : ''}" onclick="switchHrmTab('contacts')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg> Liên hệ &amp; Thông báo</button>
    <button class="tab-btn ${hrmTab === 'notifgroups' ? 'active' : ''}" onclick="switchHrmTab('notifgroups')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> Nhóm Thông báo</button>
    <!-- Cụm Loa đã chuyển sang trang Hệ thống Liên lạc -->
  </div>
  <div id="hrmContent">${getHrmTabContent()}</div>`;
}

function switchHrmTab(tab) {
  hrmTab = tab;
  document.querySelectorAll('.tabs .tab-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('hrmContent').innerHTML = getHrmTabContent();
  if (tab === 'kpi') setTimeout(renderKpiCharts, 60);
}

function getHrmTabContent() {
  if (hrmTab === 'employees')   return renderEmployeeList();
  if (hrmTab === 'attendance')  return renderAttendance();
  if (hrmTab === 'kpi')        return renderKpiBoard();
  if (hrmTab === 'orgchart')   return renderOrgChart();
  if (hrmTab === 'departments') return renderDeptManagement();
  if (hrmTab === 'contacts')    return renderContactsTab();
  if (hrmTab === 'notifgroups') return renderNotifGroupsTab();
  if (hrmTab === 'speakers')    return renderSpeakersTab();
  return '';
}

window.afterRender_hrm = function () { if (hrmTab === 'kpi') setTimeout(renderKpiCharts, 60); };

function renderEmployeeList() {
  const pageSize = 10;

  // Apply data-level filtering
  const filtered = DATA.employees.filter(e => {
    const matchSearch = !window.hrmSearchQuery ||
      e.name.toLowerCase().includes(window.hrmSearchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(window.hrmSearchQuery.toLowerCase());
    const matchFactory = !window.hrmFactoryFilter || e.factory === window.hrmFactoryFilter;
    const matchDept = !window.hrmDeptFilter || e.dept === window.hrmDeptFilter;
    return matchSearch && matchFactory && matchDept;
  });

  const start = (window.hrmEmpPage - 1) * pageSize;
  const paginated = filtered.slice(start, Math.min(start + pageSize, filtered.length));
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;

  return `
  <div class="card"><div class="table-wrap"><table>
    <thead><tr><th>Mã NV</th><th>Họ tên</th><th>Chức vụ</th><th>Role</th><th>Nhà máy</th><th>Phòng ban</th><th>Trạng thái</th><th>Email</th><th>Thao tác</th></tr></thead>
    <tbody id="empBody">
      ${paginated.map(e => {
    return `<tr>
          <td class="mono text-cyan">${e.id}</td>
          <td style="font-weight:600">${e.name}</td>
          <td style="font-size:13px">${e.position || e.dept}</td>
          <td><span class="badge ${PCTT_ROLE_BADGE[e.role] || 'badge-gray'}">${PCTT_ROLE_LABELS[e.role] || e.role}</span></td>
          <td style="font-size:12px">${e.factory || '—'}</td>
          <td style="font-size:12px;color:var(--muted)">${e.dept}</td>
          <td>${statusBadge(e.status)}</td>
          <td style="font-size:12px;color:var(--muted)">${e.email}</td>
          <td style="display:flex;gap:5px;align-items:center">
            <button class="btn btn-ghost btn-sm" onclick="editEmployee('${e.id}')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Sửa</button>
            <button class="btn btn-sm btn-icon" title="Xóa" style="color:var(--danger);background:transparent;border:none" onclick="confirmDeleteEmployee('${e.id}','${e.name}')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg></button>
          </td>
        </tr>`;
  }).join('')}
    </tbody>
  </table></div>
  <div class="pagination-bar" style="margin-top:10px;padding:10px;border-top:1px solid var(--border)">
    <div style="font-size:12px;color:var(--muted)">Hiển thị ${start + 1}-${Math.min(start + pageSize, filtered.length)} / ${filtered.length} nhân viên</div>
    <div class="pagination-btns">
      <button class="btn btn-ghost btn-sm" ${window.hrmEmpPage === 1 ? 'disabled' : ''} onclick="changeHrmEmpPage(${window.hrmEmpPage - 1})"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="15 18 9 12 15 6"/></svg> Trước</button>
      ${renderPageNumbersHrm(totalPages, window.hrmEmpPage)}
      <button class="btn btn-ghost btn-sm" ${window.hrmEmpPage === totalPages ? 'disabled' : ''} onclick="changeHrmEmpPage(${window.hrmEmpPage + 1})"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="9 18 15 12 9 6"/></svg> Sau</button>
    </div>
  </div>
  </div>`;
}

function changeHrmEmpPage(p) {
  window.hrmEmpPage = p;
  document.getElementById('hrmContent').innerHTML = renderEmployeeList();
}



function renderPageNumbersHrm(total, current) {
  let html = '';
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      html += `<button class="btn btn-sm ${i === current ? 'btn-primary' : 'btn-ghost'}" onclick="changeHrmEmpPage(${i})">${i}</button>`;
    } else if (i === current - 2 || i === current + 2) {
      html += `<span style="padding:0 4px;color:var(--muted)">...</span>`;
    }
  }
  return html;
}

function confirmDeleteEmployee(id, name) {
  openModal(`
  <div class="modal-header">
    <span class="modal-title">Xóa nhân viên</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body" style="text-align:center;padding:24px 16px">
    <div style="width:52px;height:52px;border-radius:50%;background:rgba(239,154,154,.1);border:1.5px solid rgba(239,154,154,.25);display:flex;align-items:center;justify-content:center;margin:0 auto 14px">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
    </div>
    <div style="font-size:15px;font-weight:600;margin-bottom:8px">Xóa tài khoản "<span style="color:var(--primary)">${name}</span>"?</div>
    <p style="font-size:13px;color:var(--muted);line-height:1.6;max-width:320px;margin:0 auto">Hành động này <strong style="color:#ef9a9a">không thể hoàn tác</strong>. Toàn bộ dữ liệu chấm công, KPI và lịch sử của nhân viên sẽ bị xóa vĩnh viễn.</p>
  </div>
  <div class="modal-footer" style="justify-content:center;gap:12px">
    <button class="btn btn-ghost" onclick="closeModal()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Hủy, giữ lại</button>
    <button class="btn btn-sm" style="background:rgba(239,154,154,.1);color:#ef9a9a;border:1px solid rgba(239,154,154,.25)" onmouseover="this.style.background='rgba(239,154,154,.2)'" onmouseout="this.style.background='rgba(239,154,154,.1)'" onclick="closeModal();showToast('<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg> Đã xóa tài khoản ${name}')">Xác nhận xóa</button>
  </div>`);
}

function renderAttendance() {
  const days = Array.from({ length: 27 }, (_, i) => i + 1);
  const shiftColors = {
    'CA1': 'rgba(0,200,255,.18)', 'CA2': 'rgba(255,202,40,.18)', 'CA3': 'rgba(41,132,238,.18)',
    'CAN': 'rgba(41,132,238,.18)', 'CAP': 'rgba(33,150,243,.18)', 'CAO': 'rgba(255,109,0,.18)',
    'CAL': 'rgba(255,23,68,.18)', 'CA-': 'rgba(144,164,174,.18)', 'CA0': 'transparent'
  };
  const shiftText = {
    'CA1': 'S', 'CA2': 'C', 'CA3': 'Đ', 'CAN': 'N',
    'CAP': 'P', 'CAO': 'Ô', 'CAL': 'L', 'CA-': 'V', 'CA0': '–'
  };
  const shiftFg = {
    'CA1': 'var(--primary)', 'CA2': 'var(--warning)', 'CA3': '#8CC5FF', 'CAN': 'var(--success)',
    'CAP': 'var(--info)', 'CAO': '#ff6d00', 'CAL': '#ff1744', 'CA-': 'var(--muted)', 'CA0': 'var(--muted)'
  };

  return `
  <div style="display:flex;align-items:center;gap:20px;margin-bottom:14px;flex-wrap:wrap">
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      ${DATA.shifts.map(s => `
      <div style="display:flex;align-items:center;gap:6px;font-size:11px">
        <div style="width:22px;height:22px;background:${shiftColors[s.id] || 'transparent'};border:1px solid;border-color:${shiftFg[s.id] || 'var(--border)'};border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:${shiftFg[s.id]}">${shiftText[s.id]}</div>
        <span style="color:var(--muted);white-space:nowrap">${s.name}</span>
      </div>`).join('')}
    </div>
    <div style="margin-left:auto;display:flex;gap:8px">
      <button class="btn btn-ghost btn-sm" onclick="exportHrmExcel('attendance')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Xuất Excel</button>
      <button class="btn btn-primary btn-sm" onclick="showToast('Đang lưu phân ca...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg> Lưu phân ca</button>
    </div>
  </div>

  <div class="card" style="overflow-x:auto">
    <table style="min-width:900px">
      <thead>
        <tr>
          <th style="min-width:160px;position:sticky;left:0;background:var(--bg-elevated);z-index:2">Nhân viên</th>
          <th style="min-width:100px">Phòng ban</th>
          ${days.map(d => `<th style="min-width:36px;text-align:center;font-size:11px">${d}/2</th>`).join('')}
          <th style="min-width:80px;text-align:center">Tổng công</th>
        </tr>
      </thead>
      <tbody>
        ${DATA.employees.map(e => {
    const sched = DATA.attendanceSchedule[e.id] || [];
    const workDays = sched.filter(s => s !== 'CA0').length;
    return `<tr>
            <td style="font-weight:600;position:sticky;left:0;background:var(--bg-elevated);z-index:1">${e.name}</td>
            <td style="font-size:11px;color:var(--muted)">${e.dept.substring(0, 18)}</td>
            ${days.map((d, i) => {
      const s = sched[i] || 'CA0';
      return `<td style="text-align:center;padding:4px 2px">
                <div style="width:28px;height:28px;margin:auto;background:${shiftColors[s]};border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:${shiftFg[s]};cursor:pointer" title="${DATA.shifts.find(sh => sh.id === s)?.name || 'Nghỉ'}">${shiftText[s]}</div>
              </td>`;
    }).join('')}
            <td style="text-align:center;font-weight:700;color:${workDays >= 20 ? 'var(--success)' : workDays > 10 ? 'var(--warning)' : 'var(--danger)'}">
              ${workDays}<span style="font-size:10px;color:var(--muted);font-weight:400"> ngày</span>
            </td>
          </tr>`;
  }).join('')}
      </tbody>
    </table>
  </div>`;
}

function renderKpiBoard() {
  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
    <p style="color:var(--muted);font-size:13px">KPI tự động tổng hợp từ dữ liệu hệ thống – Tháng 2/2026</p>
    <button class="btn btn-ghost btn-sm" onclick="exportHrmExcel('kpi')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Xuất Excel</button>
  </div>

  <div class="grid-2" style="margin-bottom:16px">
    <div class="card"><div class="card-header"><span class="card-title">Phân bổ điểm KPI</span></div>
      <div class="card-body"><div class="chart-wrap"><canvas id="kpiChart"></canvas></div></div>
    </div>
    <div class="card"><div class="card-header"><span class="card-title">Top nhân viên tháng 2</span></div>
      <div class="card-body">
        ${DATA.employeeKpi.filter(k => k.score > 0).sort((a, b) => b.score - a.score).slice(0, 5).map((k, idx) => {
    const e = DATA.employees.find(x => x.id === k.id);
    return `<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
            <div style="width:28px;height:28px;background:linear-gradient(135deg,${['#ffd700', '#c0c0c0', '#cd7f32', 'var(--info)', 'var(--primary)'][idx]},${['#ff9900', '#909090', '#8b4513', '#1877e7', 'var(--primary-hover)'][idx]});border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700">${idx + 1}</div>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:600">${e?.name || k.id}</div>
              <div style="font-size:11px;color:var(--muted)">${e?.dept}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:18px;font-weight:700;color:${k.score >= 95 ? 'var(--success)' : k.score >= 85 ? 'var(--primary)' : 'var(--warning)'}">${k.score}<span style="font-size:11px;color:var(--muted)">%</span></div>
              <div style="font-size:10px;color:var(--muted)">${k.done}/${k.tasks} task</div>
            </div>
          </div>`;
  }).join('')}
      </div>
    </div>
  </div>

  <div class="card"><div class="card-header"><span class="card-title">Bảng KPI chi tiết</span></div>
  <div class="table-wrap"><table>
    <thead><tr><th>Nhân viên</th><th>Nhà máy</th><th>Chỉ số chính</th><th>Điểm</th><th>Xếp loại</th><th>Thao tác</th></tr></thead>
    <tbody>
      ${DATA.employeeKpi.map(k => {
    const e = DATA.employees.find(x => x.id === k.id);
    const metricsHtml = Object.entries(k.metrics || {}).map(([key, val]) => `
      <div style="display:flex;justify-content:space-between;font-size:10px">
        <span style="color:var(--muted)">${key}:</span>
        <span style="font-weight:600">${val}%</span>
      </div>
    `).join('');

    const rank = k.score >= 95 ? 'Xuất sắc' : k.score >= 85 ? 'Tốt' : k.score >= 70 ? 'Khá' : k.score > 0 ? 'Trung bình' : '—';
    const rc = k.score >= 95 ? 'badge-green' : k.score >= 85 ? 'badge-blue' : k.score >= 70 ? 'badge-yellow' : k.score > 0 ? 'badge-gray' : 'badge-gray';
    return `<tr>
          <td style="font-weight:600">
            <div>${e?.name || k.id}</div>
            <div style="font-size:10px;color:var(--muted);font-weight:400">${e?.position}</div>
          </td>
          <td style="font-size:12px">${e?.factory || '—'}</td>
          <td style="min-width:120px">${metricsHtml}</td>
          <td>
            <div style="display:flex;align-items:center;gap:8px">
              <div class="progress-bar" style="flex:1;height:6px"><div class="progress-fill" style="width:${k.score}%;background:${k.score >= 95 ? 'var(--success)' : k.score >= 85 ? 'var(--primary)' : 'var(--warning)'}"></div></div>
              <span class="mono" style="min-width:36px;font-size:12px;font-weight:700;color:${k.score >= 95 ? 'var(--success)' : k.score >= 85 ? 'var(--primary)' : 'var(--warning)'}">${k.score || '—'}%</span>
            </div>
          </td>
          <td><span class="badge ${rc}">${rank}</span></td>
          <td><button class="btn btn-ghost btn-sm" onclick="showToast('Chi tiết KPI ${e?.name}')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> Chi tiết</button></td>
        </tr>`;
  }).join('')}
    </tbody>
  </table></div></div>`;
}

function renderKpiCharts() {
  const c = document.getElementById('kpiChart');
  if (!c) return;
  const palette = getChartPalette();
  const gridColor = hexToRgba(palette.cyan, .05);
  const data = DATA.employeeKpi.filter(k => k.score > 0);
  new Chart(c, {
    type: 'bar',
    data: {
      labels: data.map(k => DATA.employees.find(e => e.id === k.id)?.name || k.id),
      datasets: [{
        label: 'Điểm KPI (%)', data: data.map(k => k.score),
        backgroundColor: data.map(k => k.score >= 95 ? hexToRgba(palette.success, .5) : k.score >= 85 ? hexToRgba(palette.cyan, .5) : hexToRgba(palette.warning, .5)),
        borderColor: data.map(k => k.score >= 95 ? palette.success : k.score >= 85 ? palette.cyan : palette.warning),
        borderWidth: 1.5, borderRadius: 5
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: palette.textSecondary, font: { size: 11 } } } },
      scales: {
        x: { ticks: { color: palette.textMuted, font: { size: 10 } }, grid: { color: gridColor } },
        y: { min: 0, max: 100, ticks: { color: palette.textMuted }, grid: { color: gridColor } }
      }
    }
  });
}

function openAddEmployee() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Thêm nhân viên mới</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <!-- Avatar upload -->
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;padding:14px;background:rgba(0,200,255,.04);border:1px solid rgba(0,200,255,.12);border-radius:10px">
      <div id="empAvatarPreview" style="width:72px;height:72px;border-radius:50%;background:rgba(0,200,255,.1);border:2px dashed rgba(0,200,255,.3);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(0,200,255,.5)" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
      <div>
        <div style="font-size:13px;font-weight:600;margin-bottom:4px">Ảnh đại diện</div>
        <div style="font-size:11px;color:var(--muted);margin-bottom:8px">JPG, PNG · Tối đa 2MB · Tỷ lệ 1:1</div>
        <label style="cursor:pointer;display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:rgba(0,200,255,.08);border:1px solid rgba(0,200,255,.2);border-radius:7px;font-size:12px;color:var(--primary)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Chọn ảnh
          <input type="file" accept="image/*" style="display:none" onchange="previewEmpAvatar(this)">
        </label>
      </div>
    </div>
    <div class="form-row"><div class="form-group"><label class="form-label">Họ và tên</label><input class="form-control" placeholder="Nguyễn Văn A"></div><div class="form-group"><label class="form-label">Chức vụ</label><input class="form-control" placeholder="Kỹ sư vận hành"></div></div>
    <div class="form-row"><div class="form-group"><label class="form-label">Phòng ban</label><input class="form-control" placeholder="Phòng Kỹ thuật"></div><div class="form-group"><label class="form-label">Role hệ thống</label><select class="form-control"><option value="viewer">Viewer</option><option value="operator">Operator</option><option value="dispatcher">Dispatcher</option><option value="admin">Admin</option></select></div></div>
    <div class="form-row"><div class="form-group"><label class="form-label">Email đăng nhập</label><input class="form-control" type="email" placeholder="name@hadiwa.vn"></div><div class="form-group"><label class="form-label">Mật khẩu tạm</label><input class="form-control" type="password" placeholder="Mật khẩu tạm thời"></div></div>
    <div class="form-row"><div class="form-group"><label class="form-label">SĐT</label><input class="form-control" placeholder="0912..."></div><div class="form-group"><label class="form-label">Ngày vào làm</label><input class="form-control" type="date"></div></div>
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Hủy</button><button class="btn btn-primary" onclick="closeModal();showToast('Nhân viên đã được thêm thành công!')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Tạo tài khoản</button></div>`);
}

function previewEmpAvatar(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const prev = document.getElementById('empAvatarPreview');
    if (prev) prev.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
  };
  reader.readAsDataURL(file);
}


function editEmployee(id) {
  const e = DATA.employees.find(x => x.id === id);
  if (!e) return;
  const initials = e.name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
  const roleLabel = { admin: 'Admin', dispatcher: 'Dispatcher', operator: 'Operator', viewer: 'Viewer' };

  openModal(`
  <div class="modal-header">
    <span class="modal-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Chỉnh sửa hồ sơ nhân viên</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body" style="max-height:78vh;overflow-y:auto">

    <!-- Employee ID badge -->
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;padding:8px 12px;background:rgba(0,200,255,.04);border:1px solid rgba(0,200,255,.12);border-radius:8px">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
      <span style="font-size:11px;color:var(--muted)">Mã nhân viên:</span>
      <span style="font-family:'Roboto Mono',monospace;font-size:13px;font-weight:600;color:var(--primary)">${e.id}</span>
      <span style="margin-left:auto"><span class="badge ${e.status === 'active' ? 'badge-green' : 'badge-gray'}">${e.status === 'active' ? 'Đang làm việc' : e.status === 'leave' ? 'Nghỉ phép' : 'Ngừng HĐ'}</span></span>
    </div>

    <!-- Avatar section — same as Add new -->
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;padding:14px;background:rgba(0,200,255,.04);border:1px solid rgba(0,200,255,.12);border-radius:10px">
      <div id="editAvatarPreview" style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#0050cc,#00c8ff);border:2px solid rgba(0,200,255,.35);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;font-size:22px;font-weight:700;color:white">
        ${initials}
      </div>
      <div>
        <div style="font-size:13px;font-weight:600;margin-bottom:2px">${e.name}</div>
        <div style="font-size:11px;color:var(--muted);margin-bottom:8px">${roleLabel[e.role] || e.role} · ${e.dept}</div>
        <label style="cursor:pointer;display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:rgba(0,200,255,.08);border:1px solid rgba(0,200,255,.2);border-radius:7px;font-size:12px;color:var(--primary)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Đổi ảnh
          <input type="file" accept="image/*" style="display:none" onchange="previewEditAvatar(this)">
        </label>
      </div>
    </div>

    <!-- Họ tên + Chức vụ -->
    <div class="form-row">
      <div class="form-group"><label class="form-label">Họ và tên</label><input class="form-control" value="${e.name}"></div>
      <div class="form-group"><label class="form-label">Chức vụ</label><input class="form-control" value="${e.position}"></div>
    </div>

    <!-- Phòng ban + Role -->
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Phòng ban</label>
        <input class="form-control" value="${e.dept}">
      </div>
      <div class="form-group">
        <label class="form-label">Role hệ thống</label>
        <select class="form-control">
          <option value="viewer" ${e.role === 'viewer' ? 'selected' : ''}>Viewer</option>
          <option value="operator" ${e.role === 'operator' ? 'selected' : ''}>Operator</option>
          <option value="dispatcher" ${e.role === 'dispatcher' ? 'selected' : ''}>Dispatcher</option>
          <option value="admin" ${e.role === 'admin' ? 'selected' : ''}>Admin</option>
        </select>
      </div>
    </div>

    <!-- Email + SĐT -->
    <div class="form-row">
      <div class="form-group"><label class="form-label">Email đăng nhập</label><input class="form-control" type="email" value="${e.email}"></div>
      <div class="form-group"><label class="form-label">Số điện thoại</label><input class="form-control" type="tel" value="${e.phone || ''}" placeholder="0912 345 678"></div>
    </div>

    <!-- Ngày vào làm + Trạng thái -->
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Ngày vào làm</label>
        <input class="form-control" type="date" value="${e.startDate || ''}">
      </div>
      <div class="form-group">
        <label class="form-label">Trạng thái</label>
        <select class="form-control">
          <option value="active" ${e.status === 'active' ? 'selected' : ''}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Đang làm việc</option>
          <option value="leave" ${e.status === 'leave' ? 'selected' : ''}><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--warning);vertical-align:middle"></span> Nghỉ phép</option>
          <option value="inactive" ${e.status === 'inactive' ? 'selected' : ''}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2" style="vertical-align:middle"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> Ngừng hợp đồng</option>
        </select>
      </div>
    </div>

    <!-- Đổi mật khẩu — optional -->
    <div class="form-group">
      <label class="form-label" style="display:flex;align-items:center;gap:6px">
        Đổi mật khẩu
        <span style="font-size:10px;color:var(--muted);font-weight:400;text-transform:none;letter-spacing:0">(để trống nếu không thay đổi)</span>
      </label>
      <input class="form-control" type="password" placeholder="••••••••">
    </div>

  </div>
  <div class="modal-footer" style="justify-content:space-between">
    <button class="btn btn-sm" style="background:rgba(255,202,40,.08);color:var(--warning);border:1px solid rgba(255,202,40,.2)" onmouseover="this.style.background='rgba(255,202,40,.16)'" onmouseout="this.style.background='rgba(255,202,40,.08)'" onclick="closeModal();showToast('Đã tạm ngưng tài khoản ${e.name}')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Tạm ngưng</button>
    <div style="display:flex;gap:8px">
      <button class="btn btn-ghost" onclick="closeModal()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Hủy</button>
      <button class="btn btn-primary" onclick="closeModal();showToast('<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Đã cập nhật hồ sơ ${e.name}!')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg> Lưu thay đổi</button>
    </div>
  </div>`);
}

function previewEditAvatar(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const prev = document.getElementById('editAvatarPreview');
    if (prev) prev.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
  };
  reader.readAsDataURL(file);
}

// ── ORG CHART ─────────────────────────────────────────────────────
function renderOrgChart() {
  const phongBans = [
    { name:'Lê Hùng Cường', title:'Trưởng phòng QL Thủy lợi', color:'var(--primary)' },
    { name:'Trần Thị Hương', title:'Trưởng phòng Điều hành PCTT', color:'var(--primary)' },
    { name:'Phạm Thị Ngọc', title:'Trưởng phòng QL Đê điều', color:'var(--primary)' },
    { name:'Đỗ Mạnh Tuân', title:'Trưởng phòng Kỹ thuật & CNTT', color:'var(--primary)' },
    { name:'Hoàng Văn Bình', title:'Trưởng phòng Hành chính-TC', color:'var(--muted)' },
  ];
  const donViTT = [
    { name:'Đội Tuần tra Đê Hữu Hồng', color:'var(--primary)' },
    { name:'Đội Tuần tra Đê Hữu Đáy', color:'var(--primary)' },
    { name:'TT Dự báo & Cảnh báo sớm', color:'var(--primary)' },
    { name:'Đội ƯCSC & Xung kích', color:'var(--primary)' },
  ];
  return `
  <div class="card">
    <div class="card-header">
      <span class="card-title">Sơ đồ Tổ chức Chi cục TT-PCTT Hà Nội</span>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost btn-sm" onclick="showToast('Đang xuất sơ đồ PNG...')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> Xuất PNG</button>
        <button class="btn btn-ghost btn-sm" onclick="showToast('Đang xuất PDF...')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> Xuất PDF</button>
      </div>
    </div>
    <div style="padding:24px 16px;overflow-x:auto">
      <div style="display:flex;flex-direction:column;align-items:center;min-width:860px">
        <!-- Chi cục trưởng -->
        <div style="min-width:230px;padding:14px 20px;background:var(--primary-soft);border:2px solid var(--primary);border-radius:12px;text-align:center;box-shadow:var(--shadow-sm)">
          <div style="font-size:14px;font-weight:800">Nguyễn Văn Sơn</div>
          <div style="font-size:11px;color:var(--muted);margin-top:3px">Chi cục trưởng</div>
          <div style="margin-top:6px"><span class="badge badge-role" style="font-size:10px">CHI CỤC TRƯỞNG</span></div>
        </div>
        <div style="width:2px;height:18px;background:var(--border)"></div>
        <div style="width:480px;height:2px;background:var(--border)"></div>
        <!-- Phó Chi cục trưởng -->
        <div style="display:flex;gap:100px">
          ${[['Trần Văn Minh','Phó Chi cục trưởng 1','Phụ trách ĐĐ &amp; TL'],['Lý Thị Thảo','Phó Chi cục trưởng 2','Phụ trách PCTT &amp; HC']].map(([n,t,r]) => `
          <div style="display:flex;flex-direction:column;align-items:center">
            <div style="width:2px;height:18px;background:var(--border)"></div>
            <div style="min-width:185px;padding:11px 14px;background:var(--bg-card);border:1.5px solid var(--primary);border-radius:10px;text-align:center">
              <div style="font-size:12px;font-weight:700">${n}</div>
              <div style="font-size:10px;color:var(--muted);margin-top:2px">${t}</div>
              <div style="margin-top:4px"><span class="badge badge-role" style="font-size:9px">${r}</span></div>
            </div>
          </div>`).join('')}
        </div>
        <div style="width:2px;height:18px;background:var(--border)"></div>
        <!-- Horizontal connector for phong ban -->
        <div style="position:relative;width:820px;height:2px;background:var(--border)"></div>
        <!-- Phòng ban chức năng -->
        <div style="display:flex;align-items:flex-start;gap:4px">
          ${phongBans.map(d => `
          <div style="display:flex;flex-direction:column;align-items:center;padding:0 4px">
            <div style="width:2px;height:18px;background:var(--border)"></div>
            <div style="min-width:148px;padding:10px 10px;background:var(--bg-card);border:1.5px solid ${d.color};border-radius:8px;text-align:center">
              <div style="font-size:11px;font-weight:700">${d.name}</div>
              <div style="font-size:9px;color:var(--muted);margin-top:2px;line-height:1.35">${d.title}</div>
            </div>
          </div>`).join('')}
        </div>
        <!-- Divider: Đơn vị trực thuộc -->
        <div style="margin:16px 0 4px;font-size:10px;font-weight:700;color:var(--muted);letter-spacing:1px;text-transform:uppercase;padding:3px 14px;border:1px solid var(--border);border-radius:5px;background:rgba(255,255,255,.03)">Đơn vị trực thuộc</div>
        <div style="width:2px;height:6px;background:var(--border)"></div>
        <div style="width:640px;height:2px;background:var(--border)"></div>
        <!-- Đơn vị trực thuộc -->
        <div style="display:flex;align-items:flex-start;gap:8px">
          ${donViTT.map(d => `
          <div style="display:flex;flex-direction:column;align-items:center;padding:0 5px">
            <div style="width:2px;height:16px;background:var(--border)"></div>
            <div style="min-width:152px;padding:9px 10px;background:var(--bg-card);border:1px dashed ${d.color};border-radius:8px;text-align:center;opacity:.9">
              <div style="font-size:10px;font-weight:600;color:${d.color};line-height:1.4">${d.name}</div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>
    <!-- Legend -->
    <div style="padding:10px 18px;border-top:1px solid var(--border);display:flex;gap:14px;flex-wrap:wrap">
      ${[['var(--primary)','Lãnh đạo'],['var(--primary)','Phó Chi cục trưởng'],['var(--primary)','Phòng chuyên môn'],['var(--muted)','Phòng hành chính'],['var(--primary)','Đơn vị trực thuộc']].map(([c,l]) =>
        `<div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--muted)"><div style="width:9px;height:9px;border-radius:2px;background:${c};flex-shrink:0"></div>${l}</div>`
      ).join('')}
    </div>
  </div>`;
}

// ── DEPARTMENT MANAGEMENT ──────────────────────────────────────────
function renderDeptManagement() {
  const depts = [
    { name: 'Lãnh đạo Chi cục', head: 'Nguyễn Văn Sơn', count: 3, email: 'lanhDao@hadiwa.vn', budget: 0, desc: 'Ban Lãnh đạo Chi cục TT-PCTT Hà Nội' },
    { name: 'Phòng Điều hành PCTT', head: 'Trần Thị Hương', count: 14, email: 'pctt@hadiwa.vn', budget: 650, desc: 'Điều phối kịch bản PCTT, ứng cứu sự cố, BCH PCTT' },
    { name: 'Phòng Quản lý Thủy lợi', head: 'Lê Hùng Cường', count: 16, email: 'thuyLoi@hadiwa.vn', budget: 480, desc: 'Quản lý hồ chứa, cống, trạm bơm tiêu, hệ thống tưới' },
    { name: 'Phòng Quản lý Đê điều', head: 'Phạm Thị Ngọc', count: 18, email: 'deDieu@hadiwa.vn', budget: 720, desc: 'Kiểm tra, tuần tra, bảo trì hệ thống đê; cấp phép các hoạt động liên quan đê' },
    { name: 'Phòng Kỹ thuật & CNTT', head: 'Đỗ Mạnh Tuân', count: 10, email: 'kyThuat@hadiwa.vn', budget: 350, desc: 'Giám sát kỹ thuật, IoT/SCADA, vận hành Hadiwa IOC' },
    { name: 'Phòng Hành chính - Tài chính', head: 'Hoàng Văn Bình', count: 8, email: 'hcTc@hadiwa.vn', budget: 180, desc: 'Văn thư, nhân sự, tài chính, quản lý Quỹ PCTT' },
    { name: 'Đội Tuần tra Đê (HH + HĐ)', head: 'Vũ Quang Khải', count: 32, email: 'tuanTra@hadiwa.vn', budget: 890, desc: 'Tuần tra thường xuyên và cơ động tuyến đê Hữu Hồng, Hữu Đáy' },
    { name: 'Đội ƯCSC & Xung kích', head: 'Bùi Anh Tuấn', count: 24, email: 'ucsc@hadiwa.vn', budget: 560, desc: 'Ứng cứu sự cố khẩn cấp, xung kích phòng chống lụt bão' },
  ];
  return `
  <div class="card" style="padding:0">
    <div class="card-header">
      <span class="card-title">Danh sách Phòng ban & Đơn vị</span>
      <button class="btn btn-primary btn-sm" onclick="showToast('Mở form thêm phòng ban...')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Thêm phòng ban
      </button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Phòng ban / Đơn vị</th><th>Mô tả</th><th>Trưởng phòng</th><th>Biên chế</th><th>Email liên hệ</th><th>NS Chi (tr./năm)</th><th></th></tr></thead>
        <tbody>
          ${depts.map(d => `
          <tr>
            <td><strong style="font-size:13px">${d.name}</strong></td>
            <td style="font-size:11px;color:var(--muted);max-width:220px">${d.desc}</td>
            <td style="font-size:13px">${d.head}</td>
            <td>
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-size:16px;font-weight:700;color:var(--primary)">${d.count}</span>
                <span style="font-size:11px;color:var(--muted)">người</span>
              </div>
            </td>
            <td style="font-size:11px;color:var(--muted)">${d.email}</td>
            <td class="mono" style="font-size:13px">${d.budget > 0 ? d.budget : '—'}</td>
            <td><button class="btn btn-ghost btn-sm" onclick="showToast('Chi tiết phòng ban ${d.name}')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> Chi tiết</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
  <!-- Summary -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:16px">
    ${[
      { label: 'Tổng biên chế', val: depts.reduce((s,d)=>s+d.count,0)+' người', color: 'var(--primary)' },
      { label: 'Ngân sách ước tính', val: (depts.reduce((s,d)=>s+d.budget,0)/1000).toFixed(2)+' Tỷ/năm', color: 'var(--text)' },
      { label: 'Phòng ban & Đơn vị', val: depts.length+' đơn vị', color: 'var(--text)' },
      { label: 'Lực lượng tuần tra & ƯCSC', val: '56 người', color: 'var(--text)' },
    ].map(k => `
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:14px 16px">
      <div style="font-size:11px;color:var(--muted)">${k.label}</div>
      <div style="font-size:18px;font-weight:700;color:${k.color};margin-top:4px">${k.val}</div>
    </div>`).join('')}
  </div>`;
}

// ── TAB: LIÊN HỆ & THÔNG BÁO ─────────────────────────────────────
function renderContactsTab() {
  const channels = [
    { id: 'email',    label: 'Email',      color: 'var(--primary)' },
    { id: 'zalo',     label: 'Zalo',       color: '#0068ff' },
    { id: 'telegram', label: 'Telegram',   color: '#29b6f6' },
    { id: 'ioc',      label: 'IOC Push',   color: 'var(--success)' },
    { id: 'app',      label: 'App Mobile', color: 'var(--info)' },
  ];
  const contacts = DATA.employees.map((e, i) => ({
    ...e,
    zaloNum:  e.phone || '0' + (900000000 + i * 7).toString(),
    telegram: '@' + e.name.toLowerCase().replace(/\s/g, '_') + '_pctt',
    notifCh:  { email: true, zalo: i % 3 !== 0, telegram: i % 5 === 0, ioc: true, app: i % 2 === 0 },
  }));
  return `
  <div class="card">
    <div class="card-header">
      <span class="card-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
        Thông tin Liên hệ &amp; Kênh thông báo CBCNV
      </span>
      <div class="card-tools" style="display:flex;gap:8px">
        <input type="text" id="contactSearchInput" class="form-control form-control-sm"
          placeholder="Tìm nhân viên / bộ phận..." style="width:200px"
          oninput="filterContactsTable(this.value)">
        <button class="btn btn-ghost btn-sm" onclick="showToast('Đang xuất danh sách liên hệ...')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Xuất Excel
        </button>
        <button class="btn btn-primary btn-sm" onclick="openNotifyTargetModal({title:'Thông báo toàn cơ quan'})">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          Gửi thông báo
        </button>
      </div>
    </div>
    <div class="table-wrap" style="overflow-x:auto">
      <table id="contactsTable" style="min-width:900px">
        <thead>
          <tr>
            <th>Mã NV</th><th>Họ tên / Chức vụ</th><th>Email</th>
            <th>SĐT / Zalo</th><th>Telegram ID</th>
            ${channels.map(c => `<th style="text-align:center;min-width:68px"><span style="color:${c.color};font-size:11px">${c.label}</span></th>`).join('')}
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${contacts.map(e => `
          <tr class="contact-row" data-search="${e.name.toLowerCase()} ${(e.dept||'').toLowerCase()}">
            <td class="mono" style="font-size:11px;color:var(--muted)">${e.id}</td>
            <td>
              <div style="font-weight:600;font-size:13px">${e.name}</div>
              <div style="font-size:10px;color:var(--muted)">${e.position||e.dept}</div>
            </td>
            <td style="font-size:12px;color:var(--muted)">${e.email}</td>
            <td style="font-size:12px">
              <div>${e.phone||e.zaloNum}</div>
              <div style="font-size:10px;color:#0068ff">${e.zaloNum}</div>
            </td>
            <td style="font-size:12px;color:#29b6f6">${e.telegram}</td>
            ${channels.map(c => {
              const on = e.notifCh[c.id];
              return `<td style="text-align:center">
                <div style="width:28px;height:15px;background:${on?c.color:'rgba(255,255,255,.12)'};border-radius:8px;margin:0 auto;position:relative;cursor:pointer;transition:.2s"
                  onclick="toggleContactCh(this,'${c.color}','${c.label}','${e.name}')">
                  <div style="position:absolute;top:2px;${on?'right':'left'}:2px;width:11px;height:11px;background:#fff;border-radius:50%;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.3)"></div>
                </div>
              </td>`;
            }).join('')}
            <td>
              <div style="display:flex;gap:4px">
                <button class="btn btn-ghost btn-xs" title="Chỉnh sửa" onclick="openEditContact('${e.id}','${e.name}','${e.email}','${e.phone||e.zaloNum}','${e.zaloNum}','${e.telegram}')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="btn btn-ghost btn-xs" title="Gửi thông báo" onclick="openNotifyTargetModal({title:'Gửi cho ${e.name}'})">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function filterContactsTable(q) {
  document.querySelectorAll('.contact-row').forEach(r => {
    r.style.display = r.dataset.search.includes(q.toLowerCase()) ? '' : 'none';
  });
}

function toggleContactCh(el, color, label, name) {
  const dot = el.querySelector('div');
  const nowOn = !(dot.style.right === '2px');
  if (nowOn) {
    el.style.background = color;
    dot.style.left = ''; dot.style.right = '2px';
    showToast('Đã bật ' + label + ' cho ' + name);
  } else {
    el.style.background = 'rgba(255,255,255,.12)';
    dot.style.right = ''; dot.style.left = '2px';
    showToast('Đã tắt ' + label + ' cho ' + name);
  }
}

function openEditContact(id, name, email, phone, zalo, telegram) {
  openModal(`
    <div class="modal-header">
      <span class="modal-title">Chỉnh sửa liên hệ — ${name}</span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Email công vụ <span style="color:var(--danger)">*</span></label>
          <input id="ec_email" type="email" class="form-control" value="${email}">
        </div>
        <div class="form-group">
          <label class="form-label">Số điện thoại</label>
          <input id="ec_phone" type="tel" class="form-control" value="${phone}" placeholder="09xx xxx xxx">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Zalo (SĐT liên kết)</label>
          <input id="ec_zalo" type="text" class="form-control" value="${zalo}">
          <div style="font-size:11px;color:var(--muted);margin-top:3px">Dùng gửi tin Zalo OA hoặc trực tiếp</div>
        </div>
        <div class="form-group">
          <label class="form-label">Telegram Username / Chat ID</label>
          <input id="ec_telegram" type="text" class="form-control" value="${telegram}" placeholder="@username hoặc Chat ID">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Ghi chú</label>
        <input id="ec_note" type="text" class="form-control" placeholder="VD: Chỉ liên hệ giờ hành chính...">
      </div>
      <div style="padding:10px 14px;background:rgba(0,200,255,.05);border:1px solid rgba(0,200,255,.14);border-radius:8px;font-size:11px;color:var(--muted)">
        Thông tin lưu nội bộ, chỉ dùng cho mục đích thông báo PCTT.
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Hủy</button>
      <button class="btn btn-primary" onclick="saveContactEdit('${id}','${name}')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Lưu thay đổi</button>
    </div>
  `);
}

function saveContactEdit(id, name) {
  const email = document.getElementById('ec_email')?.value?.trim();
  const phone = document.getElementById('ec_phone')?.value?.trim();
  if (!email) { showToast('Email là bắt buộc!', 'error'); return; }
  const emp = DATA.employees.find(e => e.id === id);
  if (emp) { emp.email = email; if (phone) emp.phone = phone; }
  closeModal();
  showToast('Đã cập nhật liên hệ cho ' + name + '!');
  const area = document.getElementById('hrmContent');
  if (area) area.innerHTML = renderContactsTab();
}

// ── TAB: NHÓM THÔNG BÁO ──────────────────────────────────────────
function renderNotifGroupsTab() {
  const groups = window.NOTIFY_GROUPS || [];
  const CM = typeof NOTIFY_CHANNEL_META !== 'undefined' ? NOTIFY_CHANNEL_META : {};
  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
    <div style="font-size:13px;color:var(--muted)">Định nghĩa nhóm để gửi thông báo đa kênh nhanh</div>
    <button class="btn btn-primary btn-sm" onclick="openCreateNotifGroup()">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Tạo nhóm mới
    </button>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px">
    ${groups.map(g => {
      const mc = g.id === 'g4' ? DATA.employees.length : g.members.length;
      return `
    <div class="card" style="padding:16px">
      <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px">
        <div style="width:40px;height:40px;border-radius:10px;background:${g.color};opacity:.15;flex-shrink:0;position:relative;display:flex;align-items:center;justify-content:center">
          <div style="position:absolute;inset:0;border-radius:10px;border:2px solid ${g.color};opacity:.6"></div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${g.color}" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
        </div>
        <div style="flex:1">
          <div style="font-size:14px;font-weight:700">${g.name}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">${g.desc}</div>
        </div>
        <span style="font-size:22px;font-weight:800;color:${g.color}">${mc||'∞'}</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px">
        ${g.channels.map(ch => { const m = CM[ch]||{label:ch,color:'var(--muted)'}; return `<span style="padding:2px 8px;border-radius:5px;font-size:10px;font-weight:600;border:1px solid var(--border);color:${m.color}">${m.label}</span>`; }).join('')}
      </div>
      <div style="display:flex;gap:5px">
        <button class="btn btn-ghost btn-sm" style="flex:1" onclick="openNotifyTargetModal({title:'Gửi: ${g.name}'})">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Gửi
        </button>
        <button class="btn btn-ghost btn-sm" onclick="openEditNotifGroup('${g.id}')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Sửa
        </button>
        <button class="btn btn-ghost btn-sm" onclick="openGroupHistory('${g.id}','${g.name}')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
        </button>
        <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="deleteNotifGroup('${g.id}','${g.name}')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
        </button>
      </div>
    </div>`;
    }).join('')}
    <div class="card" style="padding:16px;border-style:dashed;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:140px;cursor:pointer;opacity:.55" onclick="openCreateNotifGroup()">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      <div style="font-size:12px;color:var(--muted);margin-top:8px">Tạo nhóm mới</div>
    </div>
  </div>`;
}

function openEditNotifGroup(id) {
  const g = (window.NOTIFY_GROUPS||[]).find(x => x.id === id);
  if (!g) return;
  const CM = typeof NOTIFY_CHANNEL_META !== 'undefined' ? NOTIFY_CHANNEL_META : {};
  const emps = DATA.employees;
  openModal(`
    <div class="modal-header">
      <span class="modal-title">Chỉnh sửa nhóm — ${g.name}</span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div style="display:flex;flex-direction:column;gap:12px">
          <div class="form-group">
            <label class="form-label">Tên nhóm <span style="color:var(--danger)">*</span></label>
            <input id="eg_name" type="text" class="form-control" value="${g.name}">
          </div>
          <div class="form-group">
            <label class="form-label">Mô tả</label>
            <input id="eg_desc" type="text" class="form-control" value="${g.desc}">
          </div>
          <div class="form-group">
            <label class="form-label">Màu nhóm</label>
            <div style="display:flex;gap:8px;flex-wrap:wrap" id="eg_color_row">
              ${['var(--danger)','var(--primary)','var(--info)','var(--success)','var(--warning)','var(--purple)'].map(c =>
                `<div style="width:26px;height:26px;border-radius:8px;background:${c};cursor:pointer;border:3px solid ${c==g.color?'rgba(255,255,255,.9)':'transparent'};transition:.15s" onclick="this.parentElement.querySelectorAll('div').forEach(d=>d.style.borderColor='transparent');this.style.borderColor='rgba(255,255,255,.9)';document.getElementById('eg_color').value='${c}'"></div>`
              ).join('')}
              <input type="hidden" id="eg_color" value="${g.color}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Kênh gửi mặc định</label>
            <div id="eg_channels_wrap" style="display:flex;flex-wrap:wrap;gap:6px">
              ${Object.entries(CM).map(([chId, m]) =>
                `<label style="display:flex;align-items:center;gap:5px;padding:5px 10px;border:1px solid var(--border);border-radius:7px;cursor:pointer;font-size:12px">
                  <input type="checkbox" id="eg_ch_${chId}" ${g.channels.includes(chId)?'checked':''} style="accent-color:${m.color}">
                  <span style="color:${m.color}">${m.label}</span>
                </label>`).join('')}
            </div>
          </div>
        </div>
        <div>
          <label class="form-label">Thành viên — đã chọn: <strong id="eg_count">${g.members.length}</strong></label>
          <input type="text" class="form-control form-control-sm" placeholder="Tìm..." style="margin-bottom:6px"
            oninput="this.nextElementSibling.querySelectorAll('label').forEach(l=>l.style.display=l.dataset.n.includes(this.value.toLowerCase())?'':'none')">
          <div style="height:270px;overflow-y:auto;border:1px solid var(--border);border-radius:8px;padding:6px">
            ${emps.map(e =>
              `<label style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer" data-n="${e.name.toLowerCase()}">
                <input type="checkbox" id="eg_m_${e.id}" ${g.members.includes(e.id) ? 'checked' : ''} style="accent-color:var(--primary)"
                  onchange="document.getElementById('eg_count').textContent=[...document.querySelectorAll('[id^=eg_m_]:checked')].length">
                <span style="font-size:12px;font-weight:500">${e.name}</span>
                <span style="font-size:10px;color:var(--muted);margin-left:4px">${e.dept}</span>
              </label>`).join('')}
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Hủy</button>
      <button class="btn btn-primary" onclick="saveEditNotifGroup('${g.id}')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Lưu thay đổi</button>
    </div>
  `, { width: '780px' });
  // Render channel checkboxes properly after openModal
  setTimeout(() => {
    const container = document.querySelector('[id^=eg_ch_]')?.parentElement;
    if (container) {
      container.innerHTML = Object.entries(CM).map(([chId, m]) =>
        `<label style="display:flex;align-items:center;gap:5px;padding:5px 10px;border:1px solid var(--border);border-radius:7px;cursor:pointer;font-size:12px">
          <input type="checkbox" id="eg_ch_${chId}" ${g.channels.includes(chId)?'checked':''} style="accent-color:${m.color}">
          <span style="color:${m.color}">${m.label}</span>
        </label>`).join('');
    }
    // Render member checkboxes with correct 'checked' state
    DATA.employees.forEach(e => {
      const cb = document.getElementById('eg_m_' + e.id);
      if (cb) cb.checked = g.members.includes(e.id);
    });
  }, 60);
}

function saveEditNotifGroup(id) {
  const g = (window.NOTIFY_GROUPS||[]).find(x => x.id === id);
  if (!g) return;
  const name = document.getElementById('eg_name')?.value?.trim();
  if (!name) { showToast('Tên nhóm không được để trống!', 'error'); return; }
  g.name  = name;
  g.desc  = document.getElementById('eg_desc')?.value?.trim() || g.desc;
  g.color = document.getElementById('eg_color')?.value || g.color;
  const CM = typeof NOTIFY_CHANNEL_META !== 'undefined' ? NOTIFY_CHANNEL_META : {};
  g.channels = Object.keys(CM).filter(c => document.getElementById('eg_ch_' + c)?.checked);
  g.members  = DATA.employees.map(e => e.id).filter(eid => document.getElementById('eg_m_' + eid)?.checked);
  closeModal();
  showToast('Đã cập nhật nhóm: ' + name + '!');
  const area = document.getElementById('hrmContent');
  if (area) area.innerHTML = renderNotifGroupsTab();
}

function deleteNotifGroup(id, name) {
  if (!confirm('Xoá nhóm "' + name + '"?')) return;
  const idx = (window.NOTIFY_GROUPS||[]).findIndex(x => x.id === id);
  if (idx >= 0) { window.NOTIFY_GROUPS.splice(idx, 1); showToast('Đã xoá nhóm: ' + name); }
  const area = document.getElementById('hrmContent');
  if (area) area.innerHTML = renderNotifGroupsTab();
}

function openGroupHistory(id, name) {
  const CM = typeof NOTIFY_CHANNEL_META !== 'undefined' ? NOTIFY_CHANNEL_META : {};
  const hist = [
    { time:'13/03/2026 07:45', msg:'Cảnh báo mưa lớn cấp 3 — Bản tin PCTT số 12', channels:['zalo','email'], sent:14 },
    { time:'12/03/2026 22:10', msg:'Nước lũ dâng cao tại Ba Vì — Yêu cầu trực 24/7', channels:['ioc','app'], sent:11 },
    { time:'12/03/2026 15:00', msg:'Họp khẩn Ban Chỉ huy PCTT lúc 16:00', channels:['zalo'], sent:14 },
    { time:'11/03/2026 06:00', msg:'Bản tin dự báo thủy văn tuần 11', channels:['email'], sent:14 },
    { time:'10/03/2026 14:30', msg:'Thông báo lịch trực phòng chống lụt bão', channels:['ioc','zalo','email'], sent:14 },
  ];
  openModal(`
    <div class="modal-header">
      <span class="modal-title">Lịch sử gửi — ${name}</span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <div style="display:flex;flex-direction:column;gap:8px">
        ${hist.map(h => `
        <div style="display:flex;align-items:flex-start;gap:12px;padding:12px 14px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px">
          <div style="color:var(--muted);font-size:11px;white-space:nowrap;padding-top:2px">${h.time}</div>
          <div style="flex:1">
            <div style="font-size:12px;font-weight:500">${h.msg}</div>
            <div style="display:flex;gap:5px;margin-top:5px">
              ${h.channels.map(c => `<span style="font-size:10px;padding:2px 7px;border-radius:4px;border:1px solid var(--border);color:${CM[c]?.color||'var(--muted)'}">${CM[c]?.label||c}</span>`).join('')}
            </div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div style="font-size:16px;font-weight:700;color:var(--success)">${h.sent}</div>
            <div style="font-size:10px;color:var(--muted)">nhận</div>
          </div>
        </div>`).join('')}
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Đóng</button></div>
  `, { width: '620px' });
}

function openCreateNotifGroup() {
  const CM = typeof NOTIFY_CHANNEL_META !== 'undefined' ? NOTIFY_CHANNEL_META : {};
  const emps = DATA.employees;
  openModal(`
    <div class="modal-header">
      <span class="modal-title">Tạo Nhóm Thông báo mới</span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div style="display:flex;flex-direction:column;gap:12px">
          <div class="form-group">
            <label class="form-label">Tên nhóm <span style="color:var(--danger)">*</span></label>
            <input id="ng_name" type="text" class="form-control" placeholder="VD: Nhóm Trực ban tuần 12">
          </div>
          <div class="form-group">
            <label class="form-label">Mô tả</label>
            <input id="ng_desc" type="text" class="form-control" placeholder="Mô tả ngắn...">
          </div>
          <div class="form-group">
            <label class="form-label">Màu nhóm</label>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              ${['var(--danger)','var(--primary)','var(--info)','var(--success)','var(--warning)','var(--purple)'].map((c,i) =>
                `<div style="width:26px;height:26px;border-radius:8px;background:${c};cursor:pointer;border:3px solid ${i===1?'rgba(255,255,255,.9)':'transparent'};transition:.15s" onclick="this.parentElement.querySelectorAll('div').forEach(d=>d.style.borderColor='transparent');this.style.borderColor='rgba(255,255,255,.9)';document.getElementById('ng_color').value='${c}'"></div>`
              ).join('')}
              <input type="hidden" id="ng_color" value="var(--primary)">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Kênh gửi mặc định</label>
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              ${Object.entries(CM).map(([chId, m]) =>
                `<label style="display:flex;align-items:center;gap:5px;padding:5px 10px;border:1px solid var(--border);border-radius:7px;cursor:pointer;font-size:12px">
                  <input type="checkbox" id="ng_ch_${chId}" style="accent-color:${m.color}">
                  <span style="color:${m.color}">${m.label}</span>
                </label>`).join('')}
            </div>
          </div>
        </div>
        <div>
          <label class="form-label">Thành viên — đã chọn: <strong id="ng_count">0</strong></label>
          <input type="text" class="form-control form-control-sm" placeholder="Tìm..." style="margin-bottom:6px"
            oninput="this.nextElementSibling.querySelectorAll('label').forEach(l=>l.style.display=l.dataset.n.includes(this.value.toLowerCase())?'':'none')">
          <div style="height:270px;overflow-y:auto;border:1px solid var(--border);border-radius:8px;padding:6px">
            ${emps.map(e =>
              `<label style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer" data-n="${e.name.toLowerCase()}">
                <input type="checkbox" id="ng_m_${e.id}" style="accent-color:var(--primary)"
                  onchange="document.getElementById('ng_count').textContent=[...document.querySelectorAll('[id^=ng_m_]:checked')].length">
                <span style="font-size:12px;font-weight:500">${e.name}</span>
                <span style="font-size:10px;color:var(--muted);margin-left:4px">${e.dept}</span>
              </label>`).join('')}
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Hủy</button>
      <button class="btn btn-primary" onclick="saveNewNotifGroup()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Tạo nhóm</button>
    </div>
  `, { width: '780px' });
}

function saveNewNotifGroup() {
  const name = document.getElementById('ng_name')?.value?.trim();
  if (!name) { showToast('Tên nhóm là bắt buộc!', 'error'); return; }
  const CM = typeof NOTIFY_CHANNEL_META !== 'undefined' ? NOTIFY_CHANNEL_META : {};
  const channels = Object.keys(CM).filter(c => document.getElementById('ng_ch_' + c)?.checked);
  const members  = DATA.employees.map(e => e.id).filter(eid => document.getElementById('ng_m_' + eid)?.checked);
  const newId    = 'g' + Date.now();
  window.NOTIFY_GROUPS = window.NOTIFY_GROUPS || [];
  window.NOTIFY_GROUPS.push({
    id: newId, name,
    desc: document.getElementById('ng_desc')?.value?.trim() || '',
    color: document.getElementById('ng_color')?.value || 'var(--primary)',
    channels, members,
  });
  closeModal();
  showToast('Đã tạo nhóm: ' + name + '!');
  const area = document.getElementById('hrmContent');
  if (area) area.innerHTML = renderNotifGroupsTab();
}

// ── TAB: CỤM LOA PHÁT THANH ──────────────────────────────────────
function renderSpeakersTab() {
  const sp = window.NOTIFY_SPEAKERS || [];
  const typeLabel = { indoor:'Trong tòa nhà', public:'Điểm công cộng', mobile:'Cơ động' };
  const typeColor = { indoor:'var(--primary)', public:'var(--primary)', mobile:'var(--primary)' };
  const online = sp.filter(s => s.status === 'online').length;
  return `
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px">
    ${[{label:'Tổng cụm loa',val:sp.length,color:'var(--text)'},{label:'Online',val:online,color:'var(--success)'},{label:'Offline',val:sp.length-online,color:'var(--danger)'},{label:'Công cộng',val:sp.filter(s=>s.type==='public').length,color:'var(--text)'}].map(k=>`
    <div class="card" style="padding:14px 16px"><div style="font-size:11px;color:var(--muted)">${k.label}</div><div style="font-size:22px;font-weight:800;color:${k.color}">${k.val}</div></div>`).join('')}
  </div>
  <div class="card" style="padding:0">
    <div class="card-header">
      <span class="card-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>
        Danh sách Cụm Loa
      </span>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost btn-sm" onclick="broadcastAllSpeakers()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>
          Phát toàn bộ
        </button>
        <button class="btn btn-primary btn-sm" onclick="openAddSpeaker()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Thêm cụm loa
        </button>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr>
          <th>Tên cụm loa</th><th>Vị trí</th><th>Loại</th>
          <th>API Endpoint</th><th>Trạng thái</th><th>Last ping</th><th>Thao tác</th>
        </tr></thead>
        <tbody>
          ${sp.map(s => `
          <tr>
            <td><strong>${s.name}</strong></td>
            <td style="font-size:12px;color:var(--muted)">${s.location}</td>
            <td><span class="badge" style="background:rgba(255,255,255,.05);color:${typeColor[s.type]||'var(--muted)'};font-size:10px">${typeLabel[s.type]||s.type}</span></td>
            <td><code style="font-size:11px;color:var(--primary)">${s.endpoint}</code></td>
            <td>
              <div style="display:flex;align-items:center;gap:6px">
                <div style="width:7px;height:7px;border-radius:50%;background:${s.status==='online'?'var(--success)':'var(--danger)'};${s.status==='online'?'box-shadow:0 0 6px var(--success)':''}"></div>
                <span class="badge ${s.status==='online'?'badge-green':'badge-gray'}" style="font-size:10px">${s.status==='online'?'Online':'Offline'}</span>
              </div>
            </td>
            <td id="lastping_${s.id}" style="font-size:12px;color:var(--muted)">${s.lastPing}</td>
            <td>
              <div style="display:flex;gap:3px">
                <button class="btn btn-ghost btn-xs" title="Phát thử" ${s.status==='offline'?'disabled':''} onclick="testBroadcast('${s.id}','${s.name}')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>
                </button>
                <button class="btn btn-ghost btn-xs" title="Ping" onclick="pingSpeaker('${s.id}','${s.endpoint}')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </button>
                <button class="btn btn-ghost btn-xs" title="Chỉnh sửa" onclick="openEditSpeaker('${s.id}')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="btn btn-ghost btn-xs" style="color:var(--danger)" title="Xoá" onclick="deleteSpeaker('${s.id}','${s.name}')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                </button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function pingSpeaker(id, endpoint) {
  const el = document.getElementById('lastping_' + id);
  if (el) el.innerHTML = '<span style="color:var(--muted)">Đang ping...</span>';
  const ms = 60 + Math.floor(Math.random() * 150);
  setTimeout(() => {
    const now = new Date();
    const ts  = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
    if (el) el.textContent = ts;
    const s = (window.NOTIFY_SPEAKERS||[]).find(x => x.id === id);
    if (s) s.lastPing = ts;
    showToast('Ping ' + endpoint + ' OK — ' + ms + 'ms');
  }, ms + 200);
}

function testBroadcast(id, name) {
  showToast('Đang phát âm thanh thử tại: ' + name + '...');
  setTimeout(() => showToast('Phát thử thành công: ' + name + '!'), 1800);
}

function broadcastAllSpeakers() {
  const online = (window.NOTIFY_SPEAKERS||[]).filter(s => s.status === 'online');
  if (!online.length) { showToast('Không có cụm loa nào đang online!', 'error'); return; }
  openModal(`
    <div class="modal-header">
      <span class="modal-title">Phát thông báo toàn bộ — ${online.length} cụm loa online</span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Nội dung phát thanh</label>
        <textarea id="bc_text" class="form-control" rows="4" placeholder="Nhập nội dung thông báo cần phát..."></textarea>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">
        ${online.map(s => `<span class="badge badge-green" style="font-size:10px">${s.name}</span>`).join('')}
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Hủy</button>
      <button class="btn btn-primary" onclick="closeModal();showToast('Đã phát đến ' + ${online.length} + ' cụm loa!')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg> Phát ngay</button>
    </div>
  `);
}

function openEditSpeaker(id) {
  const s = (window.NOTIFY_SPEAKERS||[]).find(x => x.id === id);
  if (!s) return;
  openModal(`
    <div class="modal-header">
      <span class="modal-title">Chỉnh sửa cụm loa — ${s.name}</span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group"><label class="form-label">Tên cụm loa <span style="color:var(--danger)">*</span></label>
          <input id="es_name" type="text" class="form-control" value="${s.name}"></div>
        <div class="form-group"><label class="form-label">Loại</label>
          <select id="es_type" class="form-control">
            <option value="indoor" ${s.type==='indoor'?'selected':''}>Trong tòa nhà</option>
            <option value="public" ${s.type==='public'?'selected':''}>Điểm công cộng</option>
            <option value="mobile" ${s.type==='mobile'?'selected':''}>Cơ động</option>
          </select></div>
      </div>
      <div class="form-group"><label class="form-label">Vị trí</label>
        <input id="es_location" type="text" class="form-control" value="${s.location}"></div>
      <div class="form-group"><label class="form-label">API Endpoint <span style="color:var(--danger)">*</span></label>
        <input id="es_endpoint" type="text" class="form-control" value="${s.endpoint}" style="font-family:monospace;font-size:13px"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Trạng thái</label>
          <select id="es_status" class="form-control">
            <option value="online" ${s.status==='online'?'selected':''}>Online</option>
            <option value="offline" ${s.status==='offline'?'selected':''}>Offline / Bảo trì</option>
          </select></div>
        <div class="form-group"><label class="form-label">API Token (để trống = giữ nguyên)</label>
          <input id="es_token" type="password" class="form-control" placeholder="..." style="font-family:monospace;font-size:12px"></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Hủy</button>
      <button class="btn btn-outline btn-sm" onclick="pingSpeaker('${s.id}','${s.endpoint}')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> Ping thử</button>
      <button class="btn btn-primary" onclick="saveEditSpeaker('${s.id}')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Lưu thay đổi</button>
    </div>
  `);
}

function saveEditSpeaker(id) {
  const s    = (window.NOTIFY_SPEAKERS||[]).find(x => x.id === id);
  const name = document.getElementById('es_name')?.value?.trim();
  if (!s || !name) { showToast('Tên cụm loa là bắt buộc!', 'error'); return; }
  s.name     = name;
  s.type     = document.getElementById('es_type')?.value    || s.type;
  s.location = document.getElementById('es_location')?.value|| s.location;
  s.endpoint = document.getElementById('es_endpoint')?.value|| s.endpoint;
  s.status   = document.getElementById('es_status')?.value  || s.status;
  closeModal();
  showToast('Đã cập nhật cụm loa: ' + name + '!');
  const area = document.getElementById('hrmContent');
  if (area) area.innerHTML = renderSpeakersTab();
}

function deleteSpeaker(id, name) {
  if (!confirm('Xoá cụm loa "' + name + '"?')) return;
  const idx = (window.NOTIFY_SPEAKERS||[]).findIndex(x => x.id === id);
  if (idx >= 0) { window.NOTIFY_SPEAKERS.splice(idx, 1); showToast('Đã xoá: ' + name); }
  const area = document.getElementById('hrmContent');
  if (area) area.innerHTML = renderSpeakersTab();
}

function openAddSpeaker() {
  openModal(`
    <div class="modal-header">
      <span class="modal-title">Thêm Cụm Loa Phát Thanh</span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group"><label class="form-label">Tên cụm loa <span style="color:var(--danger)">*</span></label>
          <input id="as_name" type="text" class="form-control" placeholder="VD: Loa tầng 2 trụ sở"></div>
        <div class="form-group"><label class="form-label">Loại</label>
          <select id="as_type" class="form-control">
            <option value="indoor">Trong tòa nhà</option>
            <option value="public">Điểm công cộng</option>
            <option value="mobile">Cơ động</option>
          </select></div>
      </div>
      <div class="form-group"><label class="form-label">Vị trí / Địa điểm</label>
        <input id="as_location" type="text" class="form-control" placeholder="VD: Tầng 2, Phòng họp lớn, Trụ sở Chi cục"></div>
      <div class="form-group"><label class="form-label">API Endpoint <span style="color:var(--danger)">*</span></label>
        <input id="as_endpoint" type="text" class="form-control" placeholder="http://192.168.1.xx/api/broadcast" style="font-family:monospace;font-size:13px">
        <div style="font-size:11px;color:var(--muted);margin-top:4px">Địa chỉ API REST. Hệ thống sẽ POST payload văn bản/âm thanh.</div></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">API Token / Key</label>
          <input id="as_token" type="password" class="form-control" placeholder="Bearer token hoặc API key" style="font-family:monospace;font-size:12px"></div>
        <div class="form-group"><label class="form-label">Ghi chú</label>
          <input id="as_note" type="text" class="form-control" placeholder="Ghi chú thêm..."></div>
      </div>
      <div id="as_ping_result" style="display:none;padding:8px 12px;border-radius:7px;font-size:12px;margin-top:4px;border:1px solid var(--border)"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Hủy</button>
      <button class="btn btn-outline btn-sm" onclick="pingNewSpeaker()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        Ping thử
      </button>
      <button class="btn btn-primary" onclick="saveNewSpeaker()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Thêm cụm loa</button>
    </div>
  `);
}

function pingNewSpeaker() {
  const ep  = document.getElementById('as_endpoint')?.value?.trim();
  const res = document.getElementById('as_ping_result');
  if (!ep || !res) { showToast('Nhập endpoint trước!', 'error'); return; }
  res.style.display = 'block';
  res.style.color   = 'var(--muted)';
  res.textContent   = 'Đang ping ' + ep + '...';
  const ms = 60 + Math.floor(Math.random() * 150);
  setTimeout(() => {
    res.style.color = 'var(--success)';
    res.textContent = 'OK — kết nối thành công — ' + ms + 'ms';
  }, ms + 300);
}

function saveNewSpeaker() {
  const name     = document.getElementById('as_name')?.value?.trim();
  const endpoint = document.getElementById('as_endpoint')?.value?.trim();
  if (!name || !endpoint) { showToast('Tên và Endpoint là bắt buộc!', 'error'); return; }
  const now = new Date();
  const ts  = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
  window.NOTIFY_SPEAKERS = window.NOTIFY_SPEAKERS || [];
  window.NOTIFY_SPEAKERS.push({
    id: 'sp' + Date.now(),
    name,
    location: document.getElementById('as_location')?.value?.trim() || '',
    type:     document.getElementById('as_type')?.value || 'indoor',
    status:   'online',
    endpoint,
    lastPing: ts,
  });
  closeModal();
  showToast('Đã thêm cụm loa: ' + name + '!');
  const area = document.getElementById('hrmContent');
  if (area) area.innerHTML = renderSpeakersTab();
}
