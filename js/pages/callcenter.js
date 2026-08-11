// ── TỔNG ĐÀI CSKH 1900 545 520 ───────────────────────────────────
function generateSparkline(data, color) {
  if (!data || data.length === 0) return '';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 40;
  const step = width / (data.length - 1);

  const points = data.map((d, i) => {
    const x = i * step;
    const y = height - ((d - min) / range) * height + 2;
    return `${x},${y}`;
  }).join(' ');

  return `<svg class="sparkline" viewBox="0 0 ${width} ${height + 4}" preserveAspectRatio="none" style="width:100%;height:100%"><path d="M ${points.split(' ')[0]} L ${points.split(' ').slice(1).join(' L ')}" style="stroke:${color};stroke-width:2;fill:none"/></svg>`;
}

function renderCallCenter() {
  const inbound = DATA.callLogs.filter(c => c.type === 'inbound').length;
  const resolved = DATA.callLogs.filter(c => c.status === 'resolved').length;
  const openTickets = DATA.callTickets.filter(t => t.status !== 'closed').length;

  const marchTickets = DATA.callTickets.filter(t => t.created.includes('/03/2026'));
  const resolvedMarch = marchTickets.filter(t => t.status === 'closed').length;
  const openMarch = marchTickets.filter(t => t.status !== 'closed').length;

  // Find most complained factory
  const factoryCounts = {};
  DATA.callTickets.forEach(t => {
    if (t.factory) factoryCounts[t.factory] = (factoryCounts[t.factory] || 0) + 1;
  });
  let topFactory = '—';
  let maxCount = 0;
  for (const f in factoryCounts) {
    if (factoryCounts[f] > maxCount && f !== '—') {
      maxCount = factoryCounts[f];
      topFactory = f;
    }
  }

  // Pagination state initialization
  if (typeof window.ccLogsPage === 'undefined') window.ccLogsPage = 1;
  if (typeof window.ccTicketsPage === 'undefined') window.ccTicketsPage = 1;

  return `
  <div class="page-header">
    <div class="page-title">
      <h1>Tổng đài CSKH</h1>
      <p>Quản lý cuộc gọi và ticket hỗ trợ khách hàng — <span style="color:var(--primary)">1900 545 520</span></p>
    </div>
    <div class="page-actions">
      <button class="btn btn-ghost btn-sm" onclick="openNewTicket()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Tạo ticket
      </button>
      <button class="btn btn-primary" onclick="showToast('<svg width=\'14\' height=\'14\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' style=\'vertical-align:middle\'><path d=\'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.03 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z\'/></svg> Đang mở phần mềm tổng đài...')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.03 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
        Bắt đầu ca trực
      </button>
    </div>
  </div>

  <!-- Consolidated KPIs (2 rows of 3) -->
  <div class="kpi-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom:16px">
    <div class="kpi-card" style="--accent-color:var(--primary); display:flex; flex-direction:row; align-items:center; gap:12px; padding:16px 20px">
      <div style="flex:1">
        <div class="kpi-label">Cuộc gọi hôm nay</div>
        <div class="kpi-value">${DATA.callLogs.length}</div>
        <div class="kpi-sub">${inbound} đến · ${DATA.callLogs.length - inbound} đi</div>
      </div>
      <div style="width:60%; height:50px; flex-shrink:0">
        ${generateSparkline(DATA.ccTrends.calls, 'var(--primary)')}
      </div>
    </div>

    <div class="kpi-card" style="--accent-color:var(--success); display:flex; flex-direction:row; align-items:center; gap:12px; padding:16px 20px">
      <div style="flex:1">
        <div class="kpi-label">Đã giải quyết</div>
        <div class="kpi-value">${resolved}</div>
        <div class="kpi-sub">Tỷ lệ 94.5%</div>
      </div>
      <div style="width:60%; height:50px; flex-shrink:0">
        ${generateSparkline(DATA.ccTrends.resolved, 'var(--success)')}
      </div>
    </div>

    <div class="kpi-card" style="--accent-color:var(--primary); display:flex; flex-direction:row; align-items:center; gap:12px; padding:16px 20px">
      <div style="flex:1">
        <div class="kpi-label">Phản ánh nhiều nhất</div>
        <div class="kpi-value" style="font-size:16px;line-height:1.4">
          <div>${['Hóa đơn', 'Nước đục', 'Áp lực yếu', 'Hợp đồng'][Math.floor(Math.random() * 4)]}</div>
          <div style="color:var(--primary)">Nhà máy: ${topFactory}</div>
        </div>
        <div class="kpi-sub">${maxCount} lượt phản ánh</div>
      </div>
      <!-- No sparkline for this card as requested -->
    </div>

    <div class="kpi-card" style="--accent-color:var(--primary); display:flex; flex-direction:row; align-items:center; gap:12px; padding:16px 20px">
      <div style="flex:1">
        <div class="kpi-label">Ticket tháng này</div>
        <div class="kpi-value">${marchTickets.length}</div>
        <div class="kpi-sub"><span style="color:var(--success)">${resolvedMarch} xong</span> · <span style="color:var(--warning)">${openMarch} chờ</span></div>
      </div>
      <div style="width:60%; height:50px; flex-shrink:0">
        ${generateSparkline(DATA.ccTrends.tickets, 'var(--primary)')}
      </div>
    </div>

    <div class="kpi-card" style="--accent-color:var(--info); display:flex; flex-direction:row; align-items:center; gap:12px; padding:16px 20px">
      <div style="flex:1">
        <div class="kpi-label">Thời gian TB</div>
        <div class="kpi-value">5:09</div>
        <div class="kpi-sub">phút / cuộc gọi</div>
      </div>
      <div style="width:60%; height:50px; flex-shrink:0">
        ${generateSparkline(DATA.ccTrends.duration, 'var(--info)')}
      </div>
    </div>

    <div class="kpi-card" style="--accent-color:var(--primary); display:flex; flex-direction:row; align-items:center; gap:12px; padding:16px 20px">
      <div style="flex:1">
        <div class="kpi-label">Điểm hài lòng CSAT</div>
        <div class="kpi-value">4.4<span style="font-size:12px;color:var(--muted)">/5</span></div>
        <div class="kpi-sub">1,250 đánh giá</div>
      </div>
      <div style="width:60%; height:50px; flex-shrink:0">
        ${generateSparkline(DATA.ccTrends.csat, 'var(--primary)')}
      </div>
    </div>
  </div>

  <!-- Agent Status Bar -->
  <div class="card" style="padding:14px 20px;margin-bottom:14px;display:flex;align-items:center;gap:20px">
    <span style="font-size:12px;color:var(--muted);font-weight:600">AGENT ONLINE:</span>
    ${[{ name: 'NV Phương', status: 'available' }, { name: 'NV Tuấn', status: 'busy' }, { name: 'NV Hoa', status: 'break' }].map(a => `
    <div style="display:flex;align-items:center;gap:8px">
      <div style="width:8px;height:8px;border-radius:50%;background:${a.status === 'available' ? 'var(--success)' : a.status === 'busy' ? 'var(--danger)' : 'var(--warning)'};box-shadow:0 0 6px currentColor"></div>
      <span style="font-size:13px">${a.name}</span>
      <span style="font-size:11px;color:var(--muted)">(${a.status === 'available' ? 'Sẵn sàng' : a.status === 'busy' ? 'Đang gọi' : 'Nghỉ giải lao'})</span>
    </div>`).join('')}
  </div>

  <div class="tabs">
    <button class="tab-btn active" onclick="switchCcTab(this,'stats')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Thống kê CSKH</button>
    <button class="tab-btn" onclick="switchCcTab(this,'calls')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.03 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg> Lịch sử cuộc gọi</button>
    <button class="tab-btn" onclick="switchCcTab(this,'tickets')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> Ticket hỗ trợ</button>
  </div>
  <div id="ccContent">${renderCskhStats()}</div>`;
}

window.afterRender_callcenter = function () {
  renderCskhCharts();
};

function switchCcTab(btn, tab) {
  document.querySelectorAll('.tabs .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const renders = { calls: renderCallLogs, tickets: renderCallTickets, stats: renderCskhStats };
  document.getElementById('ccContent').innerHTML = renders[tab]();
  if (tab === 'stats') setTimeout(renderCskhCharts, 50);
}

function renderCallLogs() {
  const total = DATA.callLogs.length;
  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (window.ccLogsPage - 1) * pageSize;
  const pageData = DATA.callLogs.slice(startIdx, startIdx + pageSize);

  return `
  <div class="filter-bar">
    <div class="search-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input class="search-input" placeholder="Tìm theo tên KH, chủ đề..." oninput="filterTable('callBody',this.value)">
    </div>
    <select class="form-control" style="max-width:150px"><option>Tất cả loại</option><option>Inbound</option><option>Outbound</option></select>
    <select class="form-control" style="max-width:150px"><option>Tất cả trạng thái</option><option>resolved</option><option>pending</option><option>escalated</option></select>
  </div>
  <div class="card">
    <div class="table-wrap"><table>
      <thead><tr><th>Mã CC</th><th>Khách hàng</th><th>SĐT</th><th>Loại</th><th>Chủ đề</th><th>Ghi chú</th><th>Ticket</th><th>Agent</th><th>Trạng thái</th><th>Thời gian</th></tr></thead>
      <tbody id="callBody">
        ${pageData.map(c => `<tr>
          <td class="mono text-cyan" style="font-size:12px">${c.id}</td>
          <td style="font-size:12px;font-weight:500">${c.customer}</td>
          <td class="mono" style="font-size:11px;color:var(--muted)">${c.phone}</td>
          <td>${c.type === 'inbound' ? '<span class="badge badge-blue">Đến</span>' : '<span class="badge badge-gray">Đi</span>'}</td>
          <td style="font-size:12px">${c.topic}</td>
          <td style="font-size:11px;color:var(--muted);max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${c.note}">${c.note || '—'}</td>
          <td>${c.ticketId ? `<a href="javascript:void(0)" onclick="viewTicket('${c.ticketId}')" class="text-cyan mono" style="font-size:11px">${c.ticketId}</a>` : '—'}</td>
          <td style="font-size:12px;color:var(--muted)">${c.agent}</td>
          <td>${statusBadge(c.status)}</td>
          <td class="mono" style="font-size:11px;color:var(--muted)">${c.time}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>
    <div class="pagination-bar">
      <div class="page-info">Hiển thị <strong>${total > 0 ? startIdx + 1 : 0} - ${Math.min(startIdx + pageSize, total)}</strong> trong tổng số <strong>${formatNum(total)}</strong></div>
      <div class="page-nav">
        <button class="page-link" onclick="changeCcLogsPage(1)" ${window.ccLogsPage === 1 ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg></button>
        <button class="page-link" onclick="changeCcLogsPage(${window.ccLogsPage - 1})" ${window.ccLogsPage === 1 ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg></button>
        ${renderPageNumbersCc(window.ccLogsPage, totalPages, 'changeCcLogsPage')}
        <button class="page-link" onclick="changeCcLogsPage(${window.ccLogsPage + 1})" ${window.ccLogsPage === totalPages || totalPages === 0 ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg></button>
        <button class="page-link" onclick="changeCcLogsPage(${totalPages})" ${window.ccLogsPage === totalPages || totalPages === 0 ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg></button>
      </div>
    </div>
  </div>`;
}

window.changeCcLogsPage = function (p) {
  window.ccLogsPage = p;
  document.getElementById('ccContent').innerHTML = renderCallLogs();
};

function renderCallTickets() {
  const total = DATA.callTickets.length;
  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (window.ccTicketsPage - 1) * pageSize;
  const pageData = DATA.callTickets.slice(startIdx, startIdx + pageSize);

  return `
  <div class="card">
    <div style="display:flex;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border)">
      <div style="display:flex;gap:8px">
        <select class="form-control" style="max-width:150px"><option>Tất cả ưu tiên</option><option>Cao</option><option>Trung bình</option><option>Thấp</option></select>
        <select class="form-control" style="max-width:150px"><option>Tất cả trạng thái</option><option>Mới</option><option>Đang xử lý</option><option>Đã đóng</option></select>
      </div>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>Mã TK</th><th>Tiêu đề</th><th>Danh mục</th><th>Ưu tiên</th><th>Trạng thái</th><th>Phụ trách</th><th>Cuộc gọi</th><th>Ngày tạo</th><th></th></tr></thead>
      <tbody>
        ${pageData.map(t => `<tr>
          <td class="mono text-cyan" style="font-size:12px">${t.id}</td>
          <td style="font-size:12px;font-weight:500;max-width:250px">${t.title}</td>
          <td><span class="badge badge-blue" style="font-size:10px">${t.category}</span></td>
          <td>${statusBadge(t.priority)}</td>
          <td>${statusBadge(t.status)}</td>
          <td style="font-size:12px;color:var(--muted)">${t.assignee}</td>
          <td class="mono" style="font-size:12px">${t.calls}</td>
          <td class="mono" style="font-size:11px;color:var(--muted)">${t.created}</td>
          <td><button class="btn btn-ghost btn-sm" onclick="viewTicket('${t.id}')">Xem</button></td>
        </tr>`).join('')}
      </tbody>
    </table></div>
    <div class="pagination-bar">
      <div class="page-info">Hiển thị <strong>${total > 0 ? startIdx + 1 : 0} - ${Math.min(startIdx + pageSize, total)}</strong> trong tổng số <strong>${formatNum(total)}</strong></div>
      <div class="page-nav">
        <button class="page-link" onclick="changeCcTicketsPage(1)" ${window.ccTicketsPage === 1 ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg></button>
        <button class="page-link" onclick="changeCcTicketsPage(${window.ccTicketsPage - 1})" ${window.ccTicketsPage === 1 ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg></button>
        ${renderPageNumbersCc(window.ccTicketsPage, totalPages, 'changeCcTicketsPage')}
        <button class="page-link" onclick="changeCcTicketsPage(${window.ccTicketsPage + 1})" ${window.ccTicketsPage === totalPages || totalPages === 0 ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg></button>
        <button class="page-link" onclick="changeCcTicketsPage(${totalPages})" ${window.ccTicketsPage === totalPages || totalPages === 0 ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg></button>
      </div>
    </div>
  </div>`;
}

window.changeCcTicketsPage = function (p) {
  window.ccTicketsPage = p;
  document.getElementById('ccContent').innerHTML = renderCallTickets();
};

function renderPageNumbersCc(current, total, callback) {
  let html = '';
  const range = 2;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - range && i <= current + range)) {
      html += `<button class="page-link ${i === current ? 'active' : ''}" onclick="${callback}(${i})">${i}</button>`;
    } else if (i === current - range - 1 || i === current + range + 1) {
      if (i < current || (i > current && i < total)) {
        if (!html.endsWith('<span class="page-dots">...</span>')) html += `<span class="page-dots">...</span>`;
      }
    }
  }
  return html;
}

function renderCskhStats() {
  return `
  <div class="grid-2">
    <div class="card"><div class="card-header"><span class="card-title">Cuộc gọi theo ngày (tháng 2)</span></div>
      <div class="card-body"><div class="chart-wrap"><canvas id="ccCallChart"></canvas></div></div>
    </div>
    <div class="card"><div class="card-header"><span class="card-title">Phân loại phản ánh</span></div>
      <div class="card-body"><div class="chart-wrap"><canvas id="ccTopicChart"></canvas></div></div>
    </div>
  </div>`;
}

function renderCskhCharts() {
  const palette = getChartPalette();
  const ccGrid = hexToRgba(palette.cyan, .05);
  const ccPurple = getThemeColor('--purple', '#2984EE');
  const c1 = document.getElementById('ccCallChart');
  if (c1) new Chart(c1, {
    type: 'bar',
    data: {
      labels: Array.from({ length: 27 }, (_, i) => `${i + 1}/2`),
      datasets: [
        { label: 'Inbound', data: [122, 185, 140, 168, 95, 82, 204, 221, 155, 182, 128, 174, 252, 145, 192, 215, 138, 164, 185, 222, 105, 142, 178, 205, 198, 235, 155], backgroundColor: hexToRgba(palette.cyan, .5), borderColor: palette.cyan, borderWidth: 1, borderRadius: 3 },
        { label: 'Outbound', data: [52, 85, 64, 72, 45, 38, 82, 95, 68, 75, 52, 68, 105, 52, 75, 82, 58, 62, 75, 95, 42, 55, 72, 85, 78, 92, 65], backgroundColor: hexToRgba(ccPurple, .4), borderColor: ccPurple, borderWidth: 1, borderRadius: 3 }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: palette.textSecondary, font: { size: 11 } } } }, scales: { x: { ticks: { color: palette.textMuted, font: { size: 9 } }, grid: { color: ccGrid } }, y: { ticks: { color: palette.textMuted }, grid: { color: ccGrid } } } }
  });
  const c2 = document.getElementById('ccTopicChart');
  if (c2) new Chart(c2, {
    type: 'doughnut',
    data: {
      labels: ['Chất lượng nước', 'Hóa đơn', 'Áp lực yếu', 'Lắp đặt mới', 'Vỡ ống/rò rỉ', 'Khác'],
      datasets: [{ data: [1420, 985, 842, 625, 580, 418], backgroundColor: [palette.info, palette.warning, '#F28C28', palette.success, palette.danger, ccPurple], borderColor: palette.surface, borderWidth: 2 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: palette.textSecondary, font: { size: 11 }, padding: 10 } } } }
  });
}

function openNewTicket() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Tạo Ticket hỗ trợ mới</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-group" style="margin-bottom:16px"><label class="form-label">Tiêu đề vấn đề</label><input class="form-control" placeholder="Mô tả ngắn gọn..."></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Danh mục</label>
        <select class="form-control"><option>Chất lượng nước</option><option>Hóa đơn</option><option>Áp lực yếu</option><option>Vỡ ống/rò rỉ</option><option>Lắp đặt mới</option><option>Hợp đồng</option><option>Khác</option></select>
      </div>
      <div class="form-group"><label class="form-label">Mức ưu tiên</label>
        <select class="form-control"><option value="high">Cao</option><option value="medium" selected>Trung bình</option><option value="low">Thấp</option></select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Khách hàng liên quan</label><input class="form-control" placeholder="Mã KH hoặc tên..."></div>
      <div class="form-group"><label class="form-label">Phân công</label>
        <select class="form-control">${DATA.employees.map(e => `<option>${e.name} – ${e.dept}</option>`).join('')}</select>
      </div>
    </div>
    <div class="form-group"><label class="form-label">Mô tả chi tiết</label><textarea class="form-control" rows="3" placeholder="Ghi chép nội dung cuộc gọi..."></textarea></div>
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Hủy</button><button class="btn btn-primary" onclick="closeModal();showToast('Ticket đã được tạo thành công!')">Tạo ticket</button></div>`);
}

function viewTicket(id) {
  const t = DATA.callTickets.find(x => x.id === id);
  if (!t) return;

  // Build timeline HTML
  const timelineHtml = (t.timeline || []).map(item => `
    <div style="display:flex;gap:12px;margin-bottom:14px;position:relative">
      <div style="width:10px;height:10px;border-radius:50%;background:var(--primary);margin-top:4px;flex-shrink:0;z-index:2"></div>
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px">
          <span style="font-weight:600;font-size:13px">${item.action}</span>
          <span style="font-size:11px;color:var(--muted)">${item.time}</span>
        </div>
        <div style="font-size:12px;color:var(--muted)">Thực hiện bởi: <span style="color:var(--primary)">${item.user}</span></div>
        <div style="font-size:12px;margin-top:4px;color:#cbd5e1">${item.note}</div>
      </div>
    </div>`).join('');

  // Rating section
  let ratingHtml = '';
  if (t.status === 'closed') {
    if (t.rating) {
      const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
      ratingHtml = `
      <div style="margin-top:20px;padding:16px;background:rgba(0,200,255,0.05);border-radius:8px;border:1px solid rgba(0,200,255,0.1)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span style="font-weight:600;font-size:13px">Đánh giá của khách hàng</span>
          <span style="color:var(--warning);font-size:16px">${stars}</span>
        </div>
        <div style="font-style:italic;font-size:12px;color:#94a3b8">"${t.feedback}"</div>
      </div>`;
    } else {
      ratingHtml = `
      <div style="margin-top:20px;padding:12px;background:var(--bg-card);border-radius:8px;text-align:center;font-size:12px;color:var(--muted);border:1px dashed var(--border)">
        Khách hàng chưa để lại feedback/rating
      </div>`;
    }
  }

  openModal(`
  <div class="modal-header"><span class="modal-title">${t.id} – ${t.title}</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="grid-2" style="gap:24px">
      <div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:12px;font-weight:600;letter-spacing:0.5px">THÔNG TIN CHUNG</div>
        ${[['Danh mục', t.category], ['Ưu tiên', statusBadge(t.priority)], ['Trạng thái', statusBadge(t.status)], ['Phụ trách', t.assignee], ['Cuộc gọi liên quan', t.calls + ' cuộc'], ['Ngày tạo', t.created]].map(([k, v]) => `
        <div style="padding:10px 0;border-bottom:1px solid var(--border);display:flex;gap:12px">
          <span style="min-width:120px;color:var(--muted);font-size:12px">${k}</span>
          <span style="font-size:13px;font-weight:500">${v}</span>
        </div>`).join('')}
        ${ratingHtml}
      </div>
      <div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:12px;font-weight:600;letter-spacing:0.5px">LỊCH SỬ XỬ LÝ (TIMELINE)</div>
        <div style="position:relative;padding-left:4px">
          <div style="position:absolute;left:8.5px;top:10px;bottom:10px;width:1px;background:var(--border);z-index:1"></div>
          ${timelineHtml || '<div style="font-size:12px;color:var(--muted)">Chưa có dữ liệu timeline</div>'}
        </div>
        <div style="margin-top:20px">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Thêm ghi chú xử lý</div>
          <div style="display:flex;gap:8px">
            <input class="form-control form-control-sm" placeholder="Nhập tiến độ...">
            <button class="btn btn-primary btn-sm" onclick="showToast('Đã lưu ghi chú!')">Gửi</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Đóng</button><button class="btn btn-primary" onclick="closeModal();showToast('Đã chuyển trạng thái ticket!')">Cập nhật trạng thái</button></div>`, { width: '850px' });
}
