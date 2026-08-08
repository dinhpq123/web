// ── AI AGENT PAGE ─────────────────────────────────────────────────
let agentJobs = [
  {
    id: 'JB-001', name: 'Báo cáo thủy văn ngày', schedule: 'Mỗi ngày 06:00', channel: 'Email + Zalo', recipients: 'Ban Chỉ huy PCTT', status: 'active', lastRun: '11/03/2026 06:00', nextRun: '12/03/2026 06:00',
    history: [
      { time: '11/03/2026 06:00', action: 'Gửi báo cáo mực nước', status: 'success', target: 'BCH PCTT', detail: 'Đã gửi qua Email và Zalo Chi cục' },
      { time: '10/03/2026 06:00', action: 'Gửi báo cáo mực nước', status: 'success', target: 'BCH PCTT', detail: 'Đã gửi thành công' }
    ]
  },
  {
    id: 'JB-002', name: 'Cảnh báo mực nước khẩn cấp', schedule: 'Mỗi 15 phút', channel: 'SMS + Notification', recipients: 'GĐ Chi cục, Kỹ thuật đê', status: 'active', lastRun: '11/03/2026 22:00', nextRun: '11/03/2026 22:15',
    history: [
      { time: '11/03/2026 22:00', action: 'Quét mực nước sông', status: 'success', target: 'GĐ, KT Đê', detail: 'Phát hiện mực nước dâng nhanh tại Trạm Hà Nội' }
    ]
  },
  { id: 'JB-003', name: 'Tổng hợp Sự cố Đê điều tuần', schedule: 'Thứ Hai 08:00', channel: 'Email', recipients: 'Phòng Kỹ thuật QL Đê', status: 'active', lastRun: '09/03/2026 08:00', nextRun: '16/03/2026 08:00', history: [] },
  { id: 'JB-004', name: 'Báo cáo tình hình Hồ chứa tháng', schedule: 'Ngày 1 mỗi tháng', channel: 'Email', recipients: 'Lãnh đạo Chi cục', status: 'active', lastRun: '01/03/2026 07:00', nextRun: '01/04/2026 07:00', history: [] },
  { id: 'JB-005', name: 'Phát hiện sụt lún bằng GeoAI', schedule: 'Mỗi ngày (tự động)', channel: 'Notification nội bộ', recipients: 'Đội Tuần tra', status: 'active', lastRun: '11/03/2026 22:30', nextRun: '12/03/2026 22:30', history: [] },
];

let anomalies = [
  { id: 'AN-001', customer: 'Tuyến đê Hữu Hồng', address: 'K22+300, Ba Vì', prevMonth: 0, thisMonth: 12, change: 'Mới', risk: 'Sạt mái đê hạ lưu', action: 'Cắm biển cảnh báo + Theo dõi', time: '11/03/2026 22:00' },
  { id: 'AN-002', customer: 'Đê Hữu Đáy', address: 'K18+500, Mỹ Đức', prevMonth: 1.2, thisMonth: 3.2, change: '+166%', risk: 'Thảm lậu / Mạch sủi tăng', action: 'Điều động Đội ƯCSC số 3', time: '11/03/2026 20:00' },
  { id: 'AN-003', customer: 'Đê Ngọc Tảo', address: 'K5+100, Phúc Thọ', prevMonth: 0, thisMonth: 180, change: 'Nghiêm trọng', risk: 'Nứt dọc đỉnh đê (180m)', action: 'Khoanh vùng + Xử lý khẩn', time: '11/03/2026 18:00' },
];

function renderAiAgent() {
  return `
  <div class="page-header">
    <div class="page-title"><h1>AI Agent – Nhân viên số</h1><p>Tự động hóa báo cáo, giám sát bất thường và cảnh báo thông minh</p></div>
    <div class="page-actions">
      <button class="btn btn-primary" onclick="openNewJob()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Tạo tác vụ mới
      </button>
    </div>
  </div>

  <div class="kpi-grid" style="margin-bottom:16px">
    <div class="kpi-card" style="--accent-color:var(--primary)"><div class="kpi-label">Tác vụ đang chạy</div><div class="kpi-value">${agentJobs.filter(j => j.status === 'active').length}</div><div class="kpi-sub">/ ${agentJobs.length} tổng</div></div>
    <div class="kpi-card" style="--accent-color:var(--warning)"><div class="kpi-label">Bất thường phát hiện</div><div class="kpi-value">${anomalies.length}</div><div class="kpi-sub">tháng này cần kiểm tra</div></div>
    <div class="kpi-card" style="--accent-color:var(--success)"><div class="kpi-label">Báo cáo đã gửi</div><div class="kpi-value">38</div><div class="kpi-sub">trong tháng 3/2026</div></div>
    <div class="kpi-card" style="--accent-color:var(--info)"><div class="kpi-label">Cảnh báo thông minh</div><div class="kpi-value">12</div><div class="kpi-sub">đã gửi SMS/Zalo</div></div>
    <div class="kpi-card" style="--accent-color:var(--purple)"><div class="kpi-label">Chi phí tiết kiệm</div><div class="kpi-value">145<span style="font-size:14px;color:var(--muted);margin-left:4px">Triệu</span></div><div class="kpi-sub">Ước tính hàng tháng</div></div>
    <div class="kpi-card" style="--accent-color:var(--primary)"><div class="kpi-label">Hiệu suất vận hành</div><div class="kpi-value" style="color:var(--success)">+32<span style="font-size:14px;color:var(--muted);margin-left:4px">%</span></div><div class="kpi-sub">Cải thiện quy trình</div></div>
  </div>

  <div class="tabs">
    <button class="tab-btn active" onclick="switchAgentTab(this,'scheduled')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Tác vụ lập lịch</button>
    <button class="tab-btn" onclick="switchAgentTab(this,'anomaly')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Giám sát bất thường</button>
    <button class="tab-btn" onclick="switchAgentTab(this,'alerts')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> Cảnh báo thông minh</button>
    <button class="tab-btn" onclick="switchAgentTab(this,'specialized')" style="background:rgba(41,132,238,.1);border-color:rgba(41,132,238,.3);color:#5BA9FF"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> AI Agent Chuyên biệt <span style="background:var(--purple);color:#fff;font-size:9px;padding:1px 5px;border-radius:4px;margin-left:4px;font-weight:700">Mới</span></button>
    <button class="tab-btn" onclick="switchAgentTab(this,'aistats')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Thống kê</button>
  </div>
  <div id="agentTabContent">${renderScheduledJobs()}</div>`;
}

function switchAgentTab(btn, tab) {
  document.querySelectorAll('.tabs .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const content = {
    scheduled: renderScheduledJobs,
    anomaly: renderAnomalyDetection,
    alerts: renderSmartAlerts,
    specialized: renderSpecializedAgents,
    aistats: renderAgentStats
  }[tab];
  document.getElementById('agentTabContent').innerHTML = content();

}

function renderScheduledJobs() {
  return `
  <div class="card">
    <div class="table-wrap"><table>
      <thead><tr><th>Mã</th><th>Tên tác vụ</th><th>Lịch chạy</th><th>Kênh gửi</th><th>Người nhận</th><th>Lần chạy cuối</th><th>Lần kế tiếp</th><th>Trạng thái</th><th></th></tr></thead>
      <tbody>
        ${agentJobs.map(j => `<tr>
          <td class="mono text-cyan">${j.id}</td>
          <td style="font-weight:500">${j.name}</td>
          <td style="font-size:12px;color:var(--muted)">${j.schedule}</td>
          <td><span class="badge badge-blue" style="font-size:10px">${j.channel}</span></td>
          <td style="font-size:12px;color:var(--muted)">${j.recipients}</td>
          <td class="mono" style="font-size:11px;color:var(--muted)">${j.lastRun}</td>
          <td class="mono" style="font-size:11px;color:var(--primary)">${j.nextRun}</td>
          <td>${j.status === 'active' ? '<span class="badge badge-green">Đang chạy</span>' : '<span class="badge badge-gray">Tạm dừng</span>'}</td>
          <td>
            <div style="display:flex;gap:4px">
              <button class="btn btn-ghost btn-xs" title="Xem chi tiết & lịch sử" onclick="viewJobDetail('${j.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
              <button class="btn btn-ghost btn-xs" title="Chỉnh sửa" onclick="editJob('${j.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="btn btn-ghost btn-xs" title="Chạy ngay" onclick="runAgentJobNow('${j.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </button>
              <button class="btn btn-ghost btn-xs" title="${j.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'}" onclick="toggleJob('${j.id}')">
                ${j.status === 'active'
      ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
      : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>'}
              </button>
            </div>
          </td>
        </tr>`).join('')}
      </tbody>
    </table></div>
  </div>`;
}

function renderAnomalyDetection() {
  return `
  <div style="padding:10px 0;margin-bottom:12px;display:flex;align-items:center;gap:12px">
    <div style="background:rgba(255,202,40,.1);border:1px solid rgba(255,202,40,.3);border-radius:8px;padding:10px 16px;font-size:13px;color:var(--warning)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> AI đã phát hiện <strong>${anomalies.length} bất thường</strong> trên các tuyến đê trong tháng 3/2026. Cần kiểm tra hiện trường.
    </div>
    <button class="btn btn-ghost btn-sm" onclick="aiAgentExportAnomalies()">Xuất danh sách</button>
  </div>
  <div class="card">
    <div class="table-wrap"><table>
      <thead><tr><th>Mã phát hiện</th><th>Tuyến đê</th><th>Vị trí (K)</th><th>Chỉ số cũ</th><th>Chỉ số mới</th><th>Biến động</th><th>Nguy cơ / Sự cố</th><th>Hành động đề xuất</th><th>Thời điểm</th></tr></thead>
      <tbody>
        ${anomalies.map(a => `<tr>
          <td class="mono text-cyan">${a.id}</td>
          <td style="font-weight:500;font-size:12px">${a.customer}</td>
          <td style="font-size:11px;color:var(--muted)">${a.address}</td>
          <td class="mono">${a.prevMonth}</td>
          <td class="mono" style="color:${a.thisMonth === 0 ? 'var(--muted)' : a.thisMonth > a.prevMonth ? 'var(--danger)' : 'var(--muted)'}">${a.thisMonth}</td>
          <td class="mono" style="font-weight:700;color:${a.change.startsWith('-') ? 'var(--danger)' : 'var(--warning)'}">${a.change}</td>
          <td style="font-size:12px;color:var(--warning)">${a.risk}</td>
          <td style="font-size:12px;color:var(--primary)">${a.action}</td>
          <td class="mono" style="font-size:11px;color:var(--muted)">${a.time}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>
  </div>`;
}

function renderSmartAlerts() {
  const smartAlerts = [
    { msg: 'Hồ Tuy Lai – Mực nước 19.2m vượt ngưỡng cảnh báo 1 (19.0m)', sent: 'SMS + Zalo → Ban Chỉ huy', time: '11/03/2026 18:55', status: 'ok' },
    { msg: 'Trạm thủy văn Hà Nội (Long Biên) cập nhật chậm > 10 phút', sent: 'Notification → Kỹ thuật viên', time: '11/03/2026 20:58', status: 'ok' },
    { msg: 'Vật tư kho Mỹ Đức: Bao tải cát xuống dưới 5.000 bao', sent: 'Email → Phòng Vật tư', time: '11/03/2026 19:30', status: 'ok' },
    { msg: 'Cống Liên Mạc – Phát hiện vật cản kẹt tại khoang số 2', sent: 'SMS + Zalo + Email → Đội vận hành', time: '11/03/2026 21:45', status: 'ok' },
  ];
  return `
  <div style="margin-bottom:14px">
    <div style="display:flex;align-items:center;justify-content:space-between">
      <div>
        <p style="color:var(--muted);font-size:13px">Hệ thống tự động gửi khi phát hiện chỉ số vượt ngưỡng. Tổng tháng 3: <strong style="color:var(--primary)">8 cảnh báo</strong> đã gửi.</p>
      </div>
      <button class="btn btn-primary btn-sm" onclick="openAlertConfig()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> Cấu hình ngưỡng</button>
    </div>
  </div>
  <div class="alarm-list">
    ${smartAlerts.map(a => `
    <div class="alarm-item warning" style="border-radius:9px">
      <div class="alarm-dot warning"></div>
      <div class="alarm-msg" style="flex:1">
        <div style="font-size:13px;font-weight:500">${a.msg}</div>
        <div style="font-size:11px;color:var(--muted);margin-top:4px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Gửi qua: <span style="color:var(--primary)">${a.sent}</span></div>
        <div class="alarm-time">${a.time}</div>
      </div>
      <span class="badge badge-green" style="flex-shrink:0">Đã gửi</span>
    </div>`).join('')}
  </div>`;
}

function openNewJob() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Tạo tác vụ AI Agent mới</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-group" style="margin-bottom:16px"><label class="form-label">Tên tác vụ</label><input class="form-control" placeholder="VD: Báo cáo sản lượng tuần"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Loại tác vụ</label>
        <select class="form-control"><option>Báo cáo thủy văn</option><option>Báo cáo mực nước/mưa</option><option>Báo cáo Sự cố Đê</option><option>Giám sát sụt lún (AI)</option><option>Cảnh báo thiết bị trạm bơm</option></select>
      </div>
      <div class="form-group"><label class="form-label">Lịch chạy</label>
        <select class="form-control"><option>Mỗi giờ</option><option>Mỗi ngày</option><option>Mỗi tuần</option><option>Mỗi tháng</option></select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Thời điểm chạy</label><input class="form-control" type="time" value="07:00"></div>
      <div class="form-group"><label class="form-label">Kênh gửi</label>
        <div style="display:flex;gap:12px;margin-top:8px">
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer"><input type="checkbox" checked style="accent-color:var(--primary)"> Email</label>
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer"><input type="checkbox" style="accent-color:var(--primary)"> Zalo</label>
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer"><input type="checkbox" style="accent-color:var(--primary)"> SMS</label>
        </div>
      </div>
    </div>
    <div class="form-group"><label class="form-label">Người nhận</label>
      <input class="form-control" placeholder="VD: Ban Điều hành, Giám đốc IOC,..."></div>
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Hủy</button><button class="btn btn-primary" onclick="closeModal();showToast('Tác vụ AI Agent đã được tạo!')">Kích hoạt tác vụ</button></div>`);
}

function openAlertConfig() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Cấu hình ngưỡng cảnh báo thông minh</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    ${[['Mực nước vượt', '9.5', 'm (BĐ1)'], ['Mực nước hồ vượt', '21.0', 'm (MNDBT)'], ['Lượng mưa vượt', '100', 'mm/24h'], ['Dòng rò đê vượt', '5.0', 'l/s'], ['Sự cố mới phát hiện', 'Khẩn cấp', '']].map(([l, v, u]) => `
    <div class="form-row" style="margin-bottom:10px">
      <div class="form-group"><label class="form-label">${l}</label>
        <div style="display:flex;gap:8px;align-items:center">
          <input class="form-control" value="${v}" style="max-width:120px">
          <span style="color:var(--muted);font-size:12px">${u}</span>
        </div>
      </div>
    </div>`).join('')}
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Hủy</button><button class="btn btn-primary" onclick="closeModal();showToast('Đã lưu cấu hình ngưỡng cảnh báo!')">Lưu cấu hình</button></div>`);
}

function toggleJob(id) {
  const j = agentJobs.find(x => x.id === id);
  if (j) { j.status = j.status === 'active' ? 'paused' : 'active'; document.getElementById('agentTabContent').innerHTML = renderScheduledJobs(); showToast(j.status === 'active' ? 'Tác vụ đã kích hoạt!' : 'Tác vụ đã tạm dừng!'); }
}

function viewJobDetail(id) {
  const j = agentJobs.find(x => x.id === id);
  if (!j) return;

  const historyHtml = j.history && j.history.length > 0
    ? j.history.map(h => `
            <div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.05)">
                <div style="width:10px;height:10px;border-radius:50%;background:${h.status === 'success' ? 'var(--success)' : 'var(--danger)'};margin-top:4px;flex-shrink:0"></div>
                <div style="flex:1">
                    <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                        <span style="font-size:12px;font-weight:600">${h.action}</span>
                        <span style="font-size:11px;color:var(--muted)">${h.time}</span>
                    </div>
                    <div style="font-size:12px;color:var(--text)">Đối tượng: <span style="color:var(--primary)">${h.target}</span></div>
                    <div style="font-size:11px;color:var(--muted);margin-top:2px">${h.detail}</div>
                </div>
            </div>
        `).join('')
    : '<div style="text-align:center;padding:20px;color:var(--muted);font-size:13px">Chưa có lịch sử chạy</div>';

  openModal(`
        <div class="modal-header"><span class="modal-title">Chi tiết tác vụ: ${j.id}</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
        <div class="modal-body" style="max-height:80vh;overflow-y:auto">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
                <div class="info-item"><label class="form-label" style="font-size:11px;color:var(--muted)">Tên tác vụ</label><div style="font-weight:600">${j.name}</div></div>
                <div class="info-item"><label class="form-label" style="font-size:11px;color:var(--muted)">Trạng thái</label><div>${j.status === 'active' ? '<span class="badge badge-green">Đang chạy</span>' : '<span class="badge badge-gray">Tạm dừng</span>'}</div></div>
                <div class="info-item"><label class="form-label" style="font-size:11px;color:var(--muted)">Lịch trình</label><div>${j.schedule}</div></div>
                <div class="info-item"><label class="form-label" style="font-size:11px;color:var(--muted)">Kênh gửi</label><div><span class="badge badge-blue">${j.channel}</span></div></div>
                <div class="info-item"><label class="form-label" style="font-size:11px;color:var(--muted)">Lần cuối</label><div class="mono" style="font-size:13px">${j.lastRun}</div></div>
                <div class="info-item"><label class="form-label" style="font-size:11px;color:var(--muted)">Lần tới</label><div class="mono" style="font-size:13px;color:var(--primary)">${j.nextRun}</div></div>
            </div>
            
            <div style="margin-top:20px">
                <h4 style="font-size:14px;margin-bottom:12px;display:flex;align-items:center;gap:8px">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Lịch sử thực thi gần đây
                </h4>
                <div style="background:var(--bg-secondary);border-radius:12px;padding:4px 16px;border:1px solid var(--border)">
                    ${historyHtml}
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
            <button class="btn btn-primary" onclick="editJob('${j.id}')">Chỉnh sửa cấu hình</button>
        </div>
    `, { width: '600px' });
}

function editJob(id) {
  const j = agentJobs.find(x => x.id === id);
  if (!j) return;

  // Close detail modal if open
  closeModal();

  setTimeout(() => {
    openModal(`
            <div class="modal-header"><span class="modal-title">Chỉnh sửa tác vụ: ${j.id}</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
            <div class="modal-body">
                <div class="form-group" style="margin-bottom:16px"><label class="form-label">Tên tác vụ</label><input id="editJobName" class="form-control" value="${j.name}"></div>
                <div class="form-row">
                    <div class="form-group"><label class="form-label">Lịch chạy</label>
                        <input id="editJobSchedule" class="form-control" value="${j.schedule}">
                    </div>
                </div>
                <div class="form-group"><label class="form-label">Người nhận</label>
                    <input id="editJobRecipients" class="form-control" value="${j.recipients}">
                </div>
                <div class="form-group"><label class="form-label">Loại kênh</label>
                    <div style="display:flex;gap:12px;margin-top:8px">
                        <label style="display:flex;align-items:center;gap:6px;cursor:pointer"><input type="checkbox" ${j.channel.includes('Email') ? 'checked' : ''} style="accent-color:var(--primary)"> Email</label>
                        <label style="display:flex;align-items:center;gap:6px;cursor:pointer"><input type="checkbox" ${j.channel.includes('Zalo') ? 'checked' : ''} style="accent-color:var(--primary)"> Zalo</label>
                        <label style="display:flex;align-items:center;gap:6px;cursor:pointer"><input type="checkbox" ${j.channel.includes('SMS') ? 'checked' : ''} style="accent-color:var(--primary)"> SMS</label>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
                <button class="btn btn-primary" onclick="saveAgentJob('${j.id}')">Lưu thay đổi</button>
            </div>
        `);
  }, 10);
}

function saveAgentJob(id) {
  const j = agentJobs.find(x => x.id === id);
  if (j) {
    j.name = document.getElementById('editJobName').value;
    j.schedule = document.getElementById('editJobSchedule').value;
    j.recipients = document.getElementById('editJobRecipients').value;
    document.getElementById('agentTabContent').innerHTML = renderScheduledJobs();
    closeModal();
    showToast('Đã cập nhật cấu hình tác vụ!');
  }
}

// ── SPECIALIZED AI AGENTS ──────────────────────────────────────────
function renderSpecializedAgents() {
  const agents = [
    {
      icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z', icon2: 'M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
      name: 'GeoAI Cảnh báo Sụt lún', badge: 'Địa kỹ thuật', badgeColor: '#3b82f6',
      desc: 'Phân tích dữ liệu InSAR vệ tinh + IoT cảm biến để phát hiện nguy cơ sụt lún, lún đê và biến dạng công trình theo thời gian thực.',
      status: 'active', tasks: 3, accuracy: '94.2%', lastRun: '22:00',
      caps: ['Phân tích ảnh SAR', 'So sánh DEM đa thời kỳ', 'Dự báo vùng nguy hiểm', 'Xuất bản đồ nguy cơ'],
    },
    {
      icon: 'M12 2.69l5.66 5.66a8 8 0 11-11.31 0z', icon2: '',
      name: 'Flood Forecast Agent', badge: 'Thủy văn', badgeColor: '#06b6d4',
      desc: 'Kết hợp dữ liệu NCHMF, mực nước thực đo và mô hình HEC-RAS/MIKE để dự báo lũ lụt, đỉnh lũ, vùng ngập trước 24-72h.',
      status: 'active', tasks: 2, accuracy: '91.7%', lastRun: '20:00',
      caps: ['Tích hợp NCHMF/VNDMS', 'Mô hình thuỷ lực MIKE', 'Dự báo đỉnh lũ 72h', 'Vẽ bản đồ ngập lụt'],
    },
    {
      icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', icon2: 'M14 2v6h6M16 13H8M16 17H8M10 9H8',
      name: 'Document AI — Pháp lý', badge: 'Văn bản', badgeColor: '#f59e0b',
      desc: 'Tự động phân loại, trích xuất và tóm tắt văn bản pháp quy: thông tư, chỉ thị, quyết định, biên bản sự cố từ Bộ NN&PTNT, UBND HN...',
      status: 'active', tasks: 8, accuracy: '96.1%', lastRun: '14:30',
      caps: ['OCR + NLP tiếng Việt', 'Phân loại văn bản', 'Trích xuất deadline', 'Tóm tắt tự động'],
    },
    {
      icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z', icon2: '',
      name: 'Alert Composer AI', badge: 'Truyền thông', badgeColor: 'var(--primary)',
      desc: 'Tự động soạn bản tin cảnh báo PCTT cho dân cư theo vùng, kênh phát (SMS, loa phát thanh, MXH) dựa trên mức độ sự cố.',
      status: 'idle', tasks: 0, accuracy: '89.5%', lastRun: 'Chưa chạy',
      caps: ['Sinh bản tin tự động', 'Cá nhân hóa theo địa bàn', 'Đa kênh: SMS/MXH/Loa', 'Dịch sang tiếng dân tộc'],
    },
    {
      icon: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z', icon2: 'M12 9v4M12 17h.01',
      name: 'Damage Assessment AI', badge: 'Thiệt hại', badgeColor: '#ef4444',
      desc: 'Phân tích ảnh drone/vệ tinh sau thiên tai để đánh giá thiệt hại nhà cửa, hạ tầng, diện tích lúa ngập. Tự động tạo báo cáo thiệt hại.',
      status: 'idle', tasks: 0, accuracy: '87.3%', lastRun: 'Chưa chạy',
      caps: ['Phân tích ảnh drone/SAR', 'Phân loại mức hư hại', 'Ước tính thiệt hại (VNĐ)', 'Xuất báo cáo PDF TBT'],
    },
    {
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2', icon2: 'M13 5a2 2 0 00-4 0H7v4h10V5h-4',
      name: 'Field Inspector AI', badge: 'Tuần tra', badgeColor: 'var(--purple)',
      desc: 'Hỗ trợ đội tuần tra đê qua mobile: nhận ảnh hiện trường, phân loại sự cố (sụt đê, tổ mối, rò rỉ...), đề xuất biện pháp, mức ưu tiên xử lý.',
      status: 'active', tasks: 5, accuracy: '92.8%', lastRun: '21:30',
      caps: ['Nhận diện loại sự cố', 'Phân loại ưu tiên A/B/C', 'Đề xuất biện pháp', 'Tự động tạo phiếu SC'],
    },
  ];
  const statusBadge = (s, t) => s === 'active'
    ? `<span class="badge badge-green" style="font-size:10px">● Đang chạy (${t} task)</span>`
    : `<span class="badge badge-gray" style="font-size:10px">○ Chờ kích hoạt</span>`;
  return `
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px">
    ${[['6','Agents đã cấu hình','var(--primary)'],['3','Đang hoạt động','var(--success)'],['18','Tasks hôm nay','var(--warning)'],['93.1%','Độ chính xác TB','var(--purple)']].map(([v,l,c]) => `
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:14px 16px">
      <div style="font-size:22px;font-weight:800;color:${c}">${v}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:2px">${l}</div>
    </div>`).join('')}
  </div>
  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px">
    ${agents.map(a => `
    <div class="card" style="padding:20px;border-left:3px solid ${a.badgeColor}">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:42px;height:42px;border-radius:10px;background:${a.badgeColor}18;border:1.5px solid ${a.badgeColor}40;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${a.badgeColor}" stroke-width="2"><path d="${a.icon}"/>${a.icon2 ? `<path d="${a.icon2}"/>` : ''}</svg>
          </div>
          <div>
            <div style="font-size:13px;font-weight:700">${a.name}</div>
            <div style="margin-top:3px">${statusBadge(a.status, a.tasks)}</div>
          </div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" onclick="agentConfigure('${a.name}','${a.badgeColor}')">Cài đặt</button>
          ${a.status === 'active'
            ? `<button class="btn btn-sm" style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#f87171" onclick="agentStop('${a.name}')">Dừng</button>`
            : `<button class="btn btn-primary btn-sm" onclick="agentActivate('${a.name}')">Kích hoạt</button>`}
        </div>
      </div>
      <p style="font-size:12px;color:var(--muted);line-height:1.55;margin-bottom:12px">${a.desc}</p>
      <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px">
        ${a.caps.map(c => `<span style="font-size:10px;padding:2px 8px;border-radius:4px;background:${a.badgeColor}15;color:${a.badgeColor};border:1px solid ${a.badgeColor}30">${c}</span>`).join('')}
      </div>
      <div style="display:flex;justify-content:space-between;padding-top:10px;border-top:1px solid var(--border);font-size:11px;color:var(--muted)">
        <span>Độ chính xác: <strong style="color:var(--success)">${a.accuracy}</strong></span>
        <span>Lần cuối: <strong>${a.lastRun}</strong></span>
        <button class="btn btn-ghost btn-sm" style="padding:2px 8px;font-size:10px" onclick="agentHistory('${a.name}','${a.accuracy}','${a.lastRun}')">Lịch sử</button>
      </div>
    </div>`).join('')}
  </div>
  <div style="margin-top:16px;display:flex;justify-content:center">
    <button class="btn btn-outline" onclick="agentMarketplace()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Thêm AI Agent từ Marketplace
    </button>
  </div>`;
}

// ── AGENT STATISTICS ──────────────────────────────────────────────
function renderAgentStats() {
  const rows = [
    { name: 'GeoAI Sụt lún', runs: 42, ok: 40, avg: '3.2 phút', credits: 1260 },
    { name: 'Flood Forecast Agent', runs: 31, ok: 29, avg: '8.7 phút', credits: 2170 },
    { name: 'Document AI', runs: 184, ok: 181, avg: '0.8 phút', credits: 920 },
    { name: 'Alert Composer AI', runs: 0, ok: 0, avg: '—', credits: 0 },
    { name: 'Damage Assessment AI', runs: 0, ok: 0, avg: '—', credits: 0 },
    { name: 'Field Inspector AI', runs: 67, ok: 62, avg: '1.4 phút', credits: 670 },
    { name: 'Anomaly Detection', runs: 720, ok: 718, avg: '0.3 phút', credits: 1080 },
    { name: 'Smart Alert Engine', runs: 215, ok: 212, avg: '0.5 phút', credits: 645 },
  ];
  return `
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px">
    ${[['1,259','Lần chạy tháng này','var(--primary)'],['1,242','Thành công','var(--success)'],['6,745','AI Credits dùng','var(--warning)'],['98.6%','Tỷ lệ thành công','var(--purple)']].map(([v,l,c]) => `
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:14px 16px">
      <div style="font-size:22px;font-weight:800;color:${c}">${v}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:2px">${l}</div>
    </div>`).join('')}
  </div>
  <div class="card">
    <div class="card-header"><span class="card-title">Báo cáo sử dụng AI Agent — Tháng 3/2026</span></div>
    <div class="table-wrap"><table>
      <thead><tr><th>Agent</th><th>Số lần chạy</th><th>Thành công</th><th>Tỷ lệ</th><th>Thời gian TB</th><th>Credits</th></tr></thead>
      <tbody>${rows.map(r => `<tr>
        <td style="font-weight:600;font-size:13px">${r.name}</td>
        <td class="mono">${r.runs}</td>
        <td class="mono" style="color:var(--success)">${r.ok}</td>
        <td>${r.runs > 0 ? `<span class="badge badge-${r.ok/r.runs >= 0.95 ? 'green' : 'yellow'}">${(r.ok/r.runs*100).toFixed(0)}%</span>` : '<span class="badge badge-gray">—</span>'}</td>
        <td style="font-size:12px;color:var(--muted)">${r.avg}</td>
        <td class="mono" style="color:var(--warning)">${r.credits.toLocaleString()}</td>
      </tr>`).join('')}
      </tbody>
    </table></div>
  </div>`;
}


// ── AI AGENT SPECIALIZED TAB — Modal implementations ──────────────
window.runAgentJobNow = function(id) {
  const j = agentJobs.find(x => x.id === id);
  if (!j) return;
  j.lastRun = new Date().toLocaleString('vi-VN', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
  j.history = j.history || [];
  j.history.unshift({ time: j.lastRun, action: 'Chạy thủ công', status:'success', target: j.recipients, detail: 'Kích hoạt thủ công bởi người dùng' });
  document.getElementById('agentTabContent').innerHTML = renderScheduledJobs();
  if (typeof showToast === 'function') showToast(`Đã chạy tác vụ ${id} — ${j.name}!`, 'success');
};

window.aiAgentExportAnomalies = function() {
  const rows = [['Mã', 'Tuyến đê', 'Vị trí', 'Chỉ số cũ', 'Chỉ số mới', 'Biến động', 'Nguy cơ', 'Hành động', 'Thời điểm']];
  (typeof anomalies !== 'undefined' ? anomalies : []).forEach(a =>
    rows.push([a.id, a.customer, a.address, a.prevMonth, a.thisMonth, a.change, a.risk, a.action, a.time]));
  const csv = rows.map(r => r.map(c => `"${String(c||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF'+csv], { type:'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=`bat_thuong_de_${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
  if (typeof showToast === 'function') showToast('Đã xuất danh sách bất thường!', 'success');
};

window.agentConfigure = function(name, color) {
  if (typeof openModal !== 'function') return;
  openModal(`
  <div class="modal-header"><span class="modal-title" style="color:${color}">Cài đặt — ${name}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-group"><label class="form-label">Mức độ ưu tiên xử lý</label>
      <select class="form-control"><option>Khẩn cấp (real-time)</option><option selected>Cao (mỗi giờ)</option><option>Trung bình (mỗi ngày)</option></select></div>
    <div class="form-group"><label class="form-label">Ngưỡng kích hoạt cảnh báo</label>
      <div style="display:flex;gap:8px;align-items:center">
        <input class="form-control" type="number" value="80" style="max-width:100px"> <span style="color:var(--muted);font-size:12px">% độ tin cậy tối thiểu</span></div></div>
    <div class="form-group"><label class="form-label">Kênh thông báo kết quả</label>
      <div style="display:flex;gap:10px;margin-top:6px">
        <label style="display:flex;align-items:center;gap:5px;cursor:pointer"><input type="checkbox" checked style="accent-color:${color}"> Email</label>
        <label style="display:flex;align-items:center;gap:5px;cursor:pointer"><input type="checkbox" checked style="accent-color:${color}"> Notification</label>
        <label style="display:flex;align-items:center;gap:5px;cursor:pointer"><input type="checkbox" style="accent-color:${color}"> Zalo</label>
      </div></div>
    <div class="form-group"><label class="form-label">Người nhận kết quả</label>
      <input class="form-control" placeholder="VD: Đội kỹ thuật, Giám đốc Chi cục" value="Phòng Kỹ thuật QL Đê"></div>
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('Đã lưu cài đặt!')">Lưu cài đặt</button></div>`);
};

window.agentStop = function(name) {
  if (typeof openModal !== 'function') return;
  openModal(`
  <div class="modal-header"><span class="modal-title" style="color:#f87171">Dừng Agent — ${name}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div style="padding:14px;background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.2);border-radius:10px;margin-bottom:16px">
      <div style="font-size:13px;font-weight:700;margin-bottom:6px;color:#f87171">Xác nhận dừng agent?</div>
      <div style="font-size:12px;color:var(--muted)">Agent <strong>${name}</strong> sẽ ngừng chạy tất cả các tác vụ tự động. Dữ liệu đã xử lý không bị xóa.</div>
    </div>
    <div class="form-group"><label class="form-label">Lý do dừng (tùy chọn)</label>
      <textarea class="form-control" rows="2" placeholder="VD: Bảo trì hệ thống, cập nhật mô hình AI..."></textarea></div>
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-sm" style="background:rgba(239,68,68,.15);color:#f87171;border:1px solid rgba(239,68,68,.3)" onclick="closeModal();showToast('Đã dừng agent: ${name}')">Xác nhận dừng</button></div>`);
};

window.agentActivate = function(name) {
  if (typeof openModal !== 'function') return;
  openModal(`
  <div class="modal-header"><span class="modal-title" style="color:var(--success)">Kích hoạt — ${name}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div style="background:rgba(41,132,238,.06);border:1px solid rgba(41,132,238,.2);border-radius:10px;padding:12px 14px;margin-bottom:14px;font-size:12px;color:rgba(255,255,255,.6)">
      Agent sẽ bắt đầu hoạt động ngay sau khi kích hoạt và tiêu thụ AI Credits.
    </div>
    <div class="form-group"><label class="form-label">Lịch chạy</label>
      <select class="form-control">
        <option>Real-time (liên tục)</option>
        <option selected>Mỗi giờ</option><option>Mỗi 6 giờ</option>
        <option>Mỗi ngày</option>
      </select></div>
    <div class="form-group"><label class="form-label">Người nhận thông báo</label>
      <input class="form-control" placeholder="Nhập email / số điện thoại" value="Phòng Kỹ thuật QL Đê"></div>
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('Đã kích hoạt agent: ${name}!', 'success')">Kích hoạt ngay</button></div>`);
};

window.agentHistory = function(name, accuracy, lastRun) {
  const mockLog = [
    { time: '14/03/2026 00:15', action: 'Xử lý tự động', status:'success', detail: 'Hoàn thành phân tích, không phát hiện bất thường.' },
    { time: '13/03/2026 22:00', action: 'Phát hiện bất thường', status:'warn', detail: 'Xác định 1 khu vực nguy cơ cao — đã gửi cảnh báo.' },
    { time: '13/03/2026 08:00', action: 'Xử lý tự động', status:'success', detail: 'Hoàn thành phân tích toàn bộ dữ liệu đầu vào.' },
    { time: '12/03/2026 22:00', action: 'Xử lý tự động', status:'success', detail: 'Báo cáo đã gửi cho 3 người nhận.' },
    { time: '12/03/2026 08:00', action: 'Bảo trì', status:'info', detail: 'Cập nhật mô hình AI v2.3.1 thành công.' },
  ];
  const sc = { success:'var(--success)', warn:'var(--warning)', info:'var(--primary)' };
  openModal(`
  <div class="modal-header"><span class="modal-title">Lịch sử — ${name}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body" style="max-height:75vh;overflow-y:auto">
    <div style="display:flex;gap:12px;margin-bottom:16px">
      <div style="background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:8px;padding:10px 14px;flex:1">
        <div style="font-size:10px;color:var(--muted);margin-bottom:3px">Độ chính xác</div>
        <div style="font-size:18px;font-weight:800;color:var(--success)">${accuracy}</div>
      </div>
      <div style="background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:8px;padding:10px 14px;flex:1">
        <div style="font-size:10px;color:var(--muted);margin-bottom:3px">Lần chạy gần nhất</div>
        <div style="font-size:14px;font-weight:700;color:var(--primary)">${lastRun}</div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${mockLog.map(l => `
      <div style="display:flex;gap:10px;padding:10px 12px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:8px;align-items:flex-start">
        <div style="width:8px;height:8px;border-radius:50%;background:${sc[l.status]||'var(--text-subtle)'};margin-top:5px;flex-shrink:0"></div>
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;margin-bottom:3px">
            <span style="font-size:12px;font-weight:600">${l.action}</span>
            <span style="font-size:10px;color:var(--muted)">${l.time}</span>
          </div>
          <div style="font-size:11px;color:var(--muted)">${l.detail}</div>
        </div>
      </div>`).join('')}
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Đóng</button></div>`);
};

window.agentMarketplace = function() {
  const agents = [
    { name:'Water Quality Predictor', badge:'Chất lượng nước', color:'#06b6d4', price:'Free', desc:'Dự báo chất lượng nước dựa trên pH, DO, độ đục.' },
    { name:'CCTV Intrusion AI', badge:'An ninh', color:'#f59e0b', price:'Credits', desc:'Phát hiện xâm nhập trái phép qua camera CCTV.' },
    { name:'Pump Failure Predictor', badge:'Cơ điện', color:'var(--purple)', price:'Credits', desc:'Dự báo sự cố máy bơm dựa trên rung động, nhiệt độ.' },
    { name:'Rainfall Nowcasting', badge:'Thủy văn', color:'#3b82f6', price:'Free', desc:'Dự báo mưa siêu ngắn hạn (0-6h) từ radar VDMS.' },
  ];
  openModal(`
  <div class="modal-header"><span class="modal-title">Marketplace AI Agent</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body" style="max-height:75vh;overflow-y:auto">
    <div style="display:flex;gap:8px;margin-bottom:14px">
      <input class="form-control" placeholder="Tìm kiếm agent..." style="flex:1">
      <select class="form-control" style="max-width:140px"><option>Tất cả danh mục</option><option>Thủy văn</option><option>Địa kỹ thuật</option><option>An ninh</option></select>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      ${agents.map(a => `
      <div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:10px;padding:14px">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <span style="font-size:10px;padding:2px 8px;border-radius:4px;background:${a.color}18;color:${a.color};border:1px solid ${a.color}30">${a.badge}</span>
          <span style="font-size:10px;color:${a.price==='Free'?'var(--success)':'var(--warning)'};font-weight:700">${a.price}</span>
        </div>
        <div style="font-size:13px;font-weight:700;margin-bottom:5px">${a.name}</div>
        <div style="font-size:11px;color:var(--muted);margin-bottom:10px;line-height:1.5">${a.desc}</div>
        <button class="btn btn-outline btn-sm" style="width:100%;font-size:11px" onclick="closeModal();showToast('Đã thêm ${a.name} vào hệ thống!','success')">Thêm Agent</button>
      </div>`).join('')}
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Đóng</button></div>`, { width:'640px' });
};
