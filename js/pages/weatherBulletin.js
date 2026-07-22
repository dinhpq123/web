// ── WEATHER & DISASTER BULLETIN PAGE ────────────────────────────────
// Tab state
let wbTab = 'all';

const WB_BULLETINS = [
  { id: 'BL-001', type: 'lu', typeLabel: 'Cảnh báo Lũ', level: 2, title: 'Cảnh báo lũ sông Đáy — Cấp độ 2, đoạn qua Ba Vì và Chương Mỹ', time: '13/03/2026 09:00', issued: '13/03/2026 09:00', validUntil: '14/03/2026 18:00', status: 'published', author: 'Phòng Dự báo PCTT', reach: { web: 5200, app: 2100, sms: 1200, zalo: 0 }, districts: ['Ba Vì', 'Chương Mỹ', 'Mỹ Đức', 'Thanh Oai'], content: 'Mực nước sông Đáy tại trạm Quốc Oai hiện ở mức 5,12m, vượt MD Cấp 1 là 0,62m và đang có xu hướng tiếp tục dâng trong 12 – 18h tới. Theo dự báo, do ảnh hưởng của hoàn lưu sau bão số 2, khu vực thượng lưu tiếp tục có mưa vừa đến mưa to.\n\nChi cục TT-PCTT TP. Hà Nội yêu cầu UBND các huyện Ba Vì, Chương Mỹ, Mỹ Đức và Thanh Oai:\n• Tăng cường tuần tra, canh gác đê điều 24/24;\n• Sẵn sàng phương án di dân khẩn cấp vùng thấp trũng;\n• Kiểm tra, vận hành các cống tiêu thoát nước.\n\nMực nước dự báo đỉnh lũ: 5,45 – 5,65m vào sáng 14/03.' },
  { id: 'BL-002', type: 'bao', typeLabel: 'Tin bão', level: 3, title: 'Tin bão khẩn cấp (Cơn bão số 1) — Hướng di chuyển về Vịnh Bắc Bộ', time: '12/03/2026 06:00', issued: '12/03/2026 06:00', validUntil: '13/03/2026 23:59', status: 'published', author: 'Trung tâm KTTV Quốc gia', reach: { web: 7400, app: 3800, sms: 1200, zalo: 0 }, districts: ['Toàn thành phố'], content: 'Hồi 04 giờ ngày 12/03, vị trí tâm bão ở khoảng 20,5°N; 115,8°E, cách bờ biển các tỉnh Quảng Ninh – Hải Phòng khoảng 380km về phía Đông Đông Nam. Sức gió mạnh nhất vùng gần tâm bão mạnh cấp 11 (≈ 103 km/h), giật cấp 13.\n\nBão di chuyển theo hướng Tây Tây Bắc với tốc độ 15–20km/h. Dự báo trong 24h tới bão tiếp tục di chuyển theo hướng Tây Tây Bắc.\n\nKhu vực Hà Nội có khả năng chịu ảnh hưởng từ chiều 13/03: mưa to, gió giật cấp 6-7.' },
  { id: 'BL-003', type: 'mua', typeLabel: 'Cảnh báo Mưa lớn', level: 1, title: 'Cảnh báo mưa lớn diện rộng khu vực Bắc Bộ từ 13-15/3', time: '11/03/2026 16:30', issued: '11/03/2026 16:30', validUntil: '15/03/2026 12:00', status: 'archived', author: 'Phòng Dự báo PCTT', reach: { web: 4200, app: 2100, sms: 900, zalo: 0 }, districts: ['Sóc Sơn', 'Đông Anh', 'Mê Linh', 'Gia Lâm', 'Long Biên'], content: 'Từ đêm 13/03 đến ngày 15/03, do ảnh hưởng của dải hội tụ nhiệt đới, khu vực Bắc Bộ có mưa vừa, mưa to, riêng vùng núi và trung du có nơi mưa rất to. Tổng lượng mưa phổ biến 80-150mm, có nơi trên 200mm.' },
  { id: 'BL-004', type: 'ho', typeLabel: 'Thông tin Hồ chứa', level: 1, title: 'Thông tin vận hành xả lũ hồ Tuy Lai (Ba Vì) — Lưu lượng 85 m³/s', time: '12/03/2026 05:00', issued: '12/03/2026 05:00', validUntil: '13/03/2026 08:00', status: 'published', author: 'BCH PCTT huyện Ba Vì', reach: { web: 2100, app: 980, sms: 420, zalo: 0 }, districts: ['Ba Vì'], content: 'Hồ Tuy Lai (xã Tuy Lai, huyện Ba Vì) hiện có mực nước: 21,45m (cao hơn MNDBT 0,45m). Ban Chỉ huy PCTT huyện Ba Vì thông báo:\n• Kể từ 05h00 ngày 12/03/2026, hồ sẽ xả lũ qua tràn với lưu lượng 85 m³/s;\n• Người dân hạ lưu hồ cần chú ý, không đến gần dòng chảy;\n• Các hộ canh tác tại bãi bồi ven suối cần di dời tài sản lên cao.' },
  { id: 'BL-005', type: 'han', typeLabel: 'Tin hạn hán', level: 1, title: 'Dự báo tình hình hạn hán và xâm nhập mặn tháng 3/2026', time: '01/03/2026 08:00', issued: '01/03/2026 08:00', validUntil: '31/03/2026 23:59', status: 'archived', author: 'Chi cục Thủy lợi Hà Nội', reach: { web: 2600, app: 1100, sms: 400, zalo: 0 }, districts: ['Phú Xuyên', 'Ứng Hòa', 'Thường Tín'], content: 'Theo số liệu quan trắc, lưu lượng sông Hồng tại trạm Hà Nội đạt 750-850 m³/s, thấp hơn trung bình nhiều năm. Dự báo trong tháng 3, thiếu hụt ~15% so với cùng kỳ. Đề nghị các địa phương:\n• Vận hành tiết kiệm nguồn nước tưới;\n• Ưu tiên nước cho sinh hoạt;\n• Không để ruộng khô hạn kéo dài.' },
  { id: 'BL-006', type: 'lu', typeLabel: 'Cảnh báo Lũ', level: 1, title: 'Bản nháp: Cảnh báo lũ quét khu vực sườn dốc Ba Vì sau mưa lớn', time: '13/03/2026 08:00', issued: '', validUntil: '', status: 'draft', author: 'Phòng Dự báo PCTT', reach: { web: 0, app: 0, sms: 0, zalo: 0 }, districts: ['Ba Vì', 'Quốc Oai'], content: '[Bản nháp đang soạn thảo]' },
];

function renderWeatherBulletin() {
  const tabs = [
    { id: 'all',  label: 'Tất cả bản tin' },
    { id: 'lu',   label: 'Cảnh báo Lũ' },
    { id: 'bao',  label: 'Tin bão' },
    { id: 'mua',  label: 'Mưa lớn' },
    { id: 'ho',   label: 'Hồ chứa' },
    { id: 'draft',label: 'Bản nháp' },
  ];

  const filtered = WB_BULLETINS.filter(b => {
    if (wbTab === 'all')   return b.status !== 'draft';
    if (wbTab === 'draft') return b.status === 'draft';
    return b.type === wbTab;
  });

  // KPIs
  const pub     = WB_BULLETINS.filter(b => b.status === 'published');
  const active  = pub.filter(b => b.level >= 2);
  const totalReach = pub.reduce((s, b) => s + b.reach.web + b.reach.app + b.reach.sms + b.reach.zalo, 0);

  const levelBadge = (lvl) => {
    const cfg = { 1: ['badge-yellow','Cấp 1'], 2: ['badge-orange','Cấp 2'], 3: ['badge-red','Cấp 3 — Khẩn cấp'] };
    const [cls, lab] = cfg[lvl] || ['badge-gray', 'N/A'];
    return `<span class="badge ${cls}" style="font-size:10px">${lab}</span>`;
  };

  const typeBadge = (b) => {
    const cls = b.type === 'lu' || b.type === 'bao' ? 'badge-red' : b.type === 'mua' ? 'badge-blue' : 'badge-yellow';
    return `<span class="badge ${cls}" style="font-size:10px">${b.typeLabel}</span>`;
  };

  const statusBadge = (s) => {
    const m = { published: ['badge-green','Đã phát hành'], archived: ['badge-gray','Lưu trữ'], draft: ['badge-yellow','Bản nháp'] };
    const [cls, lab] = m[s] || ['badge-gray', s];
    return `<span class="badge ${cls}" style="font-size:10px">${lab}</span>`;
  };

  return `
  <div class="page-header">
    <div class="page-title">
      <h1>Bản tin Cảnh báo</h1>
      <p>Soạn thảo, phát hành và quản lý các bản tin dự báo, cảnh báo thiên tai TP. Hà Nội</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-ghost" onclick="showWbHistory()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
        Lịch sử lưu trữ
      </button>
      <button class="btn btn-outline" onclick="openNotifyTargetModal({title:'Gửi thông báo cảnh báo',content:'Chọn nội dung bản tin cần gửi...'})">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Gửi thông báo
      </button>
      <button class="btn btn-primary" onclick="openCreateBulletin()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Soạn bản tin mới
      </button>
    </div>
  </div>

  <!-- KPI cards -->
  <div class="grid-auto" style="margin-bottom:20px">
    <div class="card kpi-card">
      <div class="kpi-label">Bản tin hôm nay</div>
      <div class="kpi-value">04</div>
      <div class="kpi-sub">Đã phát: Web · App · SMS</div>
    </div>
    <div class="card kpi-card">
      <div class="kpi-label">Tổng lượt tiếp cận</div>
      <div class="kpi-value">${(totalReach / 1000).toFixed(1)}k</div>
      <div class="kpi-sub kpi-trend-up">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
        +12% so với hôm qua
      </div>
    </div>
    <div class="card kpi-card">
      <div class="kpi-label">Cảnh báo đang hiệu lực</div>
      <div class="kpi-value" style="color:var(--red)">${active.length}</div>
      <div class="kpi-sub">Cấp độ 2 trở lên</div>
    </div>
    <div class="card kpi-card">
      <div class="kpi-label">Tỷ lệ tin xác minh</div>
      <div class="kpi-value">98.5%</div>
      <div class="kpi-sub">Nguồn: KTTV Quốc gia</div>
    </div>
  </div>

  <!-- Channel distribution -->
  <div class="card" style="margin-bottom:20px;padding:16px 20px">
    <div style="font-size:13px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:6px">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
      Phân phối theo kênh hôm nay
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
      ${[
        { ch: 'Website Hadiwa', icon: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>', val: '14,600', pct: 46, color: 'var(--cyan)' },
        { ch: 'App Hadiwa Mobile', icon: '<rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>', val: '8,720', pct: 28, color: 'var(--blue)' },
        { ch: 'SMS Brandname', icon: '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>', val: '4,120', pct: 13, color: 'var(--green)' },
        { ch: 'Zalo OA (Coming)', icon: '<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>', val: '—', pct: 0, color: 'var(--muted)' },
      ].map(c => `
      <div style="text-align:center;padding:12px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:10px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${c.color}" stroke-width="1.8" style="margin-bottom:8px">${c.icon}</svg>
        <div style="font-size:18px;font-weight:800;color:${c.color}">${c.val}</div>
        <div style="font-size:10px;color:var(--muted);margin-top:4px">${c.ch}</div>
        ${c.pct > 0 ? `<div style="margin-top:8px;height:3px;background:rgba(255,255,255,.08);border-radius:2px"><div style="height:3px;width:${c.pct}%;background:${c.color};border-radius:2px"></div></div>` : ''}
      </div>`).join('')}
    </div>
  </div>

  <!-- Tab nav -->
  <div class="tabs" style="margin-bottom:20px">
    ${tabs.map(t => `<button class="tab-btn ${wbTab === t.id ? 'active' : ''}" onclick="switchWbTab('${t.id}')">${t.label}</button>`).join('')}
  </div>

  <!-- Bulletin list -->
  <div class="card">
    <div class="card-header">
      <span class="card-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        Danh sách Bản tin ${wbTab === 'all' ? '(tất cả)' : wbTab === 'draft' ? '(bản nháp)' : '(' + tabs.find(t=>t.id===wbTab)?.label + ')'}
      </span>
      <div class="card-tools">
        <input type="text" class="form-control form-control-sm" placeholder="Tìm kiếm bản tin..." style="width:200px"
          oninput="filterWbTable(this.value)">
      </div>
    </div>
    <div class="table-wrap">
      <table id="wbTable">
        <thead>
          <tr>
            <th>Mã tin</th>
            <th>Loại tin</th>
            <th>Cấp độ</th>
            <th>Tiêu đề bản tin</th>
            <th>Thời gian phát</th>
            <th>Hiệu lực đến</th>
            <th>Tiếp cận</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(b => {
            const total = b.reach.web + b.reach.app + b.reach.sms + b.reach.zalo;
            return `<tr>
              <td class="mono" style="font-size:11px;color:var(--muted)">${b.id}</td>
              <td>${typeBadge(b)}</td>
              <td>${levelBadge(b.level)}</td>
              <td style="font-weight:600;max-width:280px;line-height:1.4">${b.title}</td>
              <td style="font-size:12px;color:var(--muted);white-space:nowrap">${b.issued || '—'}</td>
              <td style="font-size:12px;color:var(--muted);white-space:nowrap">${b.validUntil || '—'}</td>
              <td class="mono" style="color:var(--cyan)">${total > 0 ? total.toLocaleString('vi-VN') : '—'}</td>
              <td>${statusBadge(b.status)}</td>
              <td>
                <div style="display:flex;gap:4px">
                  <button class="btn btn-ghost btn-xs" title="Xem chi tiết" onclick="viewBulletin('${b.id}')">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <button class="btn btn-ghost btn-xs" title="Chỉnh sửa" onclick="openCreateBulletin('${b.id}')">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  ${b.status === 'published' ? `
                  <button class="btn btn-ghost btn-xs" title="Phát lại" onclick="showToast('Đang phát lại bản tin ${b.id}...')">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </button>` : ''}
                  ${b.status === 'draft' ? `
                  <button class="btn btn-primary btn-xs" onclick="publishBulletin('${b.id}')">Phát hành</button>` : ''}
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function switchWbTab(tab) {
  wbTab = tab;
  const area = document.getElementById('contentArea');
  if (area) area.innerHTML = renderWeatherBulletin();
}

function filterWbTable(q) {
  const rows = document.querySelectorAll('#wbTable tbody tr');
  rows.forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none';
  });
}

function publishBulletin(id) {
  const b = WB_BULLETINS.find(x => x.id === id);
  if (b) {
    b.status = 'published';
    b.issued = new Date().toLocaleString('vi-VN');
    showToast('Đã phát hành bản tin ' + id + ' thành công!');
    const area = document.getElementById('contentArea');
    if (area) area.innerHTML = renderWeatherBulletin();
  }
}

function showWbHistory() {
  const archived = WB_BULLETINS.filter(b => b.status === 'archived');
  openModal(`
    <div class="modal-header">
      <span class="modal-title">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
        Lịch sử bản tin đã lưu trữ
      </span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Mã</th><th>Tiêu đề</th><th>Thời gian</th><th>Tiếp cận</th></tr></thead>
          <tbody>
            ${archived.map(b => {
              const t = b.reach.web + b.reach.app + b.reach.sms;
              return `<tr>
                <td class="mono" style="font-size:11px;color:var(--muted)">${b.id}</td>
                <td style="font-size:13px;font-weight:500">${b.title}</td>
                <td style="font-size:12px;color:var(--muted)">${b.issued}</td>
                <td class="mono" style="color:var(--cyan)">${t.toLocaleString('vi-VN')}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    </div>
  `, { width: '780px' });
}

function viewBulletin(id) {
  const b = WB_BULLETINS.find(x => x.id === id);
  if (!b) return;
  const total = b.reach.web + b.reach.app + b.reach.sms + b.reach.zalo;
  const levelColor = { 1: 'var(--yellow)', 2: 'var(--orange)', 3: 'var(--red)' }[b.level] || 'var(--muted)';

  openModal(`
    <div class="modal-header">
      <span class="modal-title">Chi tiết Bản tin — ${b.id}</span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <!-- Header strip -->
      <div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:10px;padding:16px;margin-bottom:16px">
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">
          <span class="badge ${b.type==='lu'||b.type==='bao'?'badge-red':'badge-yellow'}">${b.typeLabel}</span>
          <span class="badge ${b.level===3?'badge-red':b.level===2?'badge-orange':'badge-yellow'}">Cấp độ ${b.level}</span>
          <span class="badge ${b.status==='published'?'badge-green':b.status==='draft'?'badge-yellow':'badge-gray'}">${b.status==='published'?'Đã phát hành':b.status==='draft'?'Bản nháp':'Lưu trữ'}</span>
        </div>
        <div style="font-size:16px;font-weight:700;line-height:1.4;margin-bottom:10px">${b.title}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;font-size:12px">
          <div><span style="color:var(--muted)">Phát hành:</span> <strong>${b.issued || '—'}</strong></div>
          <div><span style="color:var(--muted)">Hiệu lực đến:</span> <strong>${b.validUntil || '—'}</strong></div>
          <div><span style="color:var(--muted)">Người soạn:</span> <strong>${b.author}</strong></div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 220px;gap:16px;margin-bottom:16px">
        <!-- Content -->
        <div class="card" style="padding:16px">
          <div style="font-size:12px;font-weight:700;color:var(--muted);margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px">Nội dung bản tin</div>
          <div style="font-size:13px;line-height:1.7;white-space:pre-wrap">${b.content}</div>
        </div>
        <!-- Side info -->
        <div style="display:flex;flex-direction:column;gap:12px">
          <div class="card" style="padding:14px">
            <div style="font-size:11px;font-weight:700;color:var(--muted);margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px">Khu vực ảnh hưởng</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              ${b.districts.map(d => `<span class="badge badge-blue" style="font-size:11px">${d}</span>`).join('')}
            </div>
          </div>
          <div class="card" style="padding:14px">
            <div style="font-size:11px;font-weight:700;color:var(--muted);margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px">Thống kê tiếp cận</div>
            ${[
              { label: 'Website', val: b.reach.web, color: 'var(--cyan)' },
              { label: 'App Mobile', val: b.reach.app, color: 'var(--blue)' },
              { label: 'SMS', val: b.reach.sms, color: 'var(--green)' },
              { label: 'Zalo OA', val: b.reach.zalo, color: 'var(--muted)' },
            ].map(r => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
              <span style="font-size:12px;color:var(--muted)">${r.label}</span>
              <span style="font-size:13px;font-weight:700;color:${r.color}">${r.val > 0 ? r.val.toLocaleString('vi-VN') : '—'}</span>
            </div>`).join('')}
            <div style="display:flex;justify-content:space-between;margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">
              <span style="font-size:12px;font-weight:700">Tổng cộng</span>
              <span style="font-size:14px;font-weight:800;color:var(--cyan)">${total > 0 ? total.toLocaleString('vi-VN') : '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
      <button class="btn btn-outline" onclick="closeModal();openCreateBulletin('${b.id}')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        Chỉnh sửa
      </button>
      ${b.status === 'published' ? `<button class="btn btn-primary" onclick="closeModal();showToast('Đang phát lại bản tin...')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        Phát lại
      </button>` : ''}
    </div>
  `, { width: '900px' });
}

function openCreateBulletin(editId) {
  const b = editId ? WB_BULLETINS.find(x => x.id === editId) : null;
  const isEdit = !!b;

  const hnDistricts = [
    'Ba Đình','Hoàn Kiếm','Tây Hồ','Long Biên','Cầu Giấy','Đống Đa','Hai Bà Trưng',
    'Hoàng Mai','Thanh Xuân','Nam Từ Liêm','Bắc Từ Liêm','Hà Đông','Sơn Tây','Ba Vì',
    'Phúc Thọ','Đan Phượng','Hoài Đức','Quốc Oai','Thạch Thất','Chương Mỹ','Thanh Oai',
    'Thường Tín','Phú Xuyên','Ứng Hòa','Mỹ Đức','Mê Linh','Gia Lâm','Đông Anh','Sóc Sơn',
    'Thanh Trì'
  ];

  openModal(`
    <div class="modal-header">
      <span class="modal-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        ${isEdit ? 'Chỉnh sửa Bản tin — ' + b.id : 'Soạn thảo Bản tin PCTT mới'}
      </span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <!-- Left -->
        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="form-group">
            <label class="form-label">Loại bản tin <span style="color:var(--red)">*</span></label>
            <select class="form-control" id="wbCreateType">
              <option value="lu" ${b?.type==='lu'?'selected':''}>Cảnh báo Lũ</option>
              <option value="bao" ${b?.type==='bao'?'selected':''}>Tin bão khẩn cấp</option>
              <option value="mua" ${b?.type==='mua'?'selected':''}>Cảnh báo Mưa lớn</option>
              <option value="han" ${b?.type==='han'?'selected':''}>Tin hạn hán / xâm nhập mặn</option>
              <option value="ho" ${b?.type==='ho'?'selected':''}>Thông tin điều tiết hồ chứa</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Cấp độ nguy hiểm <span style="color:var(--red)">*</span></label>
            <div style="display:flex;gap:8px">
              ${[1,2,3].map(lvl => {
                const col = lvl===3?'#ff3d57':lvl===2?'#ff9500':'#ffdb4d';
                const sel = b?.level === lvl;
                return `<label style="flex:1;display:flex;align-items:center;gap:6px;padding:8px 12px;border:1.5px solid ${sel?col:'var(--border)'};border-radius:8px;cursor:pointer;background:${sel?`rgba(${lvl===3?'255,61,87':lvl===2?'255,149,0':'255,219,77'},.08)`:'transparent'}">
                  <input type="radio" name="wbLevel" value="${lvl}" ${sel?'checked':''} style="accent-color:${col}">
                  <span style="font-size:12px;font-weight:600;color:${col}">Cấp ${lvl}${lvl===3?' — Khẩn cấp':''}</span>
                </label>`;
              }).join('')}
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Tiêu đề bản tin <span style="color:var(--red)">*</span></label>
            <input type="text" class="form-control" id="wbCreateTitle" value="${b?.title || ''}" placeholder="VD: Cảnh báo lũ sông Hồng rạng sáng 13/3 — Cấp độ 2">
          </div>
          <div class="form-group">
            <label class="form-label">Nội dung chi tiết <span style="color:var(--red)">*</span></label>
            <textarea class="form-control" rows="7" id="wbCreateContent" style="resize:vertical;font-size:13px;line-height:1.6" placeholder="Nhập nội dung chi tiết bản tin, dự báo diễn biến, khu vực ảnh hưởng và khuyến cáo người dân...">${b?.content !== '[Bản nháp đang soạn thảo]' ? (b?.content || '') : ''}</textarea>
          </div>
        </div>
        <!-- Right -->
        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="form-group">
            <label class="form-label">Khu vực ảnh hưởng</label>
            <div style="max-height:180px;overflow-y:auto;padding:10px;border:1px solid var(--border);border-radius:8px;background:rgba(255,255,255,.02)">
              ${hnDistricts.map(d => `
              <label style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:12px;cursor:pointer">
                <input type="checkbox" ${b?.districts?.includes(d)?'checked':''} style="accent-color:var(--cyan)">
                <span>${d}</span>
              </label>`).join('')}
            </div>
            <div style="font-size:11px;color:var(--muted);margin-top:4px">Chọn các quận/huyện bị ảnh hưởng</div>
          </div>
          <div class="form-group">
            <label class="form-label">Hiệu lực đến</label>
            <input type="datetime-local" class="form-control" value="${b?.validUntil ? '' : ''}" style="font-size:13px">
          </div>
          <div class="form-group">
            <label class="form-label">Kênh phát hành</label>
            <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px">
              ${[
                { id:'ch_web', label:'Website Hadiwa', checked: true, icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9' },
                { id:'ch_app', label:'App Hadiwa Mobile', checked: true, icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
                { id:'ch_sms', label:'SMS Brandname (có phí)', checked: false, icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
                { id:'ch_zalo', label:'Zalo OA (sắp ra mắt)', checked: false, icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
              ].map(ch => `
              <label style="display:flex;align-items:center;gap:10px;padding:8px 12px;border:1px solid var(--border);border-radius:8px;cursor:pointer;background:rgba(255,255,255,.02)">
                <input type="checkbox" id="${ch.id}" ${ch.checked?'checked':''} style="accent-color:var(--cyan)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2"><path d="${ch.icon}"/></svg>
                <span style="font-size:12px">${ch.label}</span>
              </label>`).join('')}
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Lên lịch phát hành</label>
            <div style="display:flex;gap:8px">
              <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer">
                <input type="radio" name="wbSchedule" value="now" checked style="accent-color:var(--cyan)"> Phát ngay
              </label>
              <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer">
                <input type="radio" name="wbSchedule" value="schedule" style="accent-color:var(--cyan)"> Đặt lịch
              </label>
            </div>
            <input type="datetime-local" class="form-control" style="margin-top:8px;display:none" id="wbScheduleTime">
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
      <button class="btn btn-outline" onclick="closeModal();showToast('Đã lưu bản nháp thành công!')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        Lưu bản nháp
      </button>
      <button class="btn btn-primary" onclick="closeModal();showToast('Đã phát hành bản tin thành công!')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        ${isEdit ? 'Cập nhật & Phát hành' : 'Phát hành ngay'}
      </button>
    </div>
  `, { width: '960px' });

  // Toggle schedule input
  setTimeout(() => {
    document.querySelectorAll('input[name="wbSchedule"]').forEach(r => {
      r.addEventListener('change', () => {
        const t = document.getElementById('wbScheduleTime');
        if (t) t.style.display = r.value === 'schedule' ? '' : 'none';
      });
    });
  }, 100);
}
