/**
 * Business History Detail Page
 */

let bh_currentPage = 1;
const bh_itemsPerPage = 10;
let bh_filteredData = [...BIZ_OVERVIEW_DATA.historyData];

function renderBusinessHistory() {
  const start = (bh_currentPage - 1) * bh_itemsPerPage;
  const end = start + bh_itemsPerPage;
  const pageData = bh_filteredData.slice(start, end);
  const totalPages = Math.ceil(bh_filteredData.length / bh_itemsPerPage);

  const rows = pageData.map(d => `
    <tr>
      <td class="mono">${d.id}</td>
      <td>${d.date}</td>
      <td style="font-weight:600">${d.factory}</td>
      <td class="mono" style="text-align:right">${formatNum(d.revenue)}</td>
      <td class="mono" style="text-align:right">${formatNum(d.consumption)}</td>
      <td style="text-align:center; color:var(--primary)">+${d.newCustomers}</td>
      <td style="text-align:center">${d.incidents}</td>
      <td>${statusBadge(d.status)}</td>
      <td>
        <button class="btn btn-ghost btn-xs" onclick="viewBizHistoryDetail('${d.id}')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="page-header">
      <div class="page-title">
        <h1>Lịch sử Kinh doanh chi tiết</h1>
        <p>Tra cứu dữ liệu kinh doanh lịch sử theo khu vực và thời gian</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-ghost" onclick="navigate('business_overview')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          Quay lại Tổng quan
        </button>
        <button class="btn btn-primary" onclick="showToast('Đang xuất Excel...')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Xuất dữ liệu
        </button>
      </div>
    </div>

    <div class="card glass">
      <div class="table-wrap">
        <table id="businessHistoryTable">
          <thead>
            <tr>
              <th>Mã BK</th>
              <th>Ngày</th>
              <th>Nhà máy / Khu vực</th>
              <th style="text-align:right">Doanh thu (VND)</th>
              <th style="text-align:right">Sản lượng (m³)</th>
              <th style="text-align:center">KH mới</th>
              <th style="text-align:center">Sự cố</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${rows.length ? rows : '<tr><td colspan="9" style="text-align:center; padding:40px; color:var(--muted)">Không tìm thấy dữ liệu phù hợp</td></tr>'}
          </tbody>
        </table>
      </div>

      <div style="display:flex;justify-content:center;align-items:center;gap:24px;padding:16px 20px;padding-right:80px;border-top:1px solid var(--border)">
        <div class="page-info" style="font-size:13px;color:var(--muted)">
          Hiển thị <strong>${bh_filteredData.length > 0 ? start + 1 : 0}–${Math.min(end, bh_filteredData.length)}</strong> trong <strong>${bh_filteredData.length}</strong> bản ghi
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <button class="btn btn-ghost btn-sm" ${bh_currentPage === 1 ? 'disabled' : ''} onclick="bh_changePage(${bh_currentPage - 1})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span style="font-size:13px;color:var(--muted)">Trang <strong>${bh_currentPage}</strong> / ${totalPages}</span>
          <button class="btn btn-ghost btn-sm" ${bh_currentPage === totalPages || totalPages === 0 ? 'disabled' : ''} onclick="bh_changePage(${bh_currentPage + 1})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

function bh_changePage(p) {
  bh_currentPage = p;
  navigate('business_history');
}

/**
 * Filter Synchronization for Business History
 */
function afterRender_business_history() {
  // Logic to handle search and filters from filterbar
  const fbSearch = document.getElementById('fbSearch');
  if (fbSearch) {
    fbSearch.oninput = (e) => {
      const q = e.target.value.toLowerCase();
      bh_filteredData = BIZ_OVERVIEW_DATA.historyData.filter(d =>
        d.id.toLowerCase().includes(q) ||
        d.factory.toLowerCase().includes(q)
      );
      bh_currentPage = 1;
      updateBH_Table();
    };
  }
}

function updateBH_Table() {
  const area = document.getElementById('contentArea');
  // Re-run render to update table and pagination
  const pageHtml = renderBusinessHistory();
  const filterBar = renderFilterBar('business_history');
  area.innerHTML = `<div class="fade-in">${filterBar}${pageHtml}</div>`;
}

// Reuse existing pagination helper if possible, or define locally if needed
function generatePaginationButtons(current, total, callback) {
  let html = '';
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      html += `<button class="page-btn ${i === current ? 'active' : ''}" onclick="${callback}(${i})">${i}</button>`;
    } else if (i === current - 2 || i === current + 2) {
      html += `<span class="page-dots">...</span>`;
    }
  }
  return html;
}

function viewBizHistoryDetail(id) {
  const d = BIZ_OVERVIEW_DATA.historyData.find(x => x.id === id);
  if (!d) return;

  const prevIdx = BIZ_OVERVIEW_DATA.historyData.indexOf(d) - 1;
  const prev = prevIdx >= 0 ? BIZ_OVERVIEW_DATA.historyData[prevIdx] : null;
  const revDiff = prev ? ((d.revenue - prev.revenue) / prev.revenue * 100).toFixed(1) : null;
  const conDiff = prev ? ((d.consumption - prev.consumption) / prev.consumption * 100).toFixed(1) : null;

  const trendArrow = (val) => {
    if (val === null) return '';
    const v = parseFloat(val);
    const color = v >= 0 ? 'var(--success)' : 'var(--danger)';
    const icon = v >= 0
      ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>'
      : '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>';
    return `<span style="color:${color};font-size:11px;display:inline-flex;align-items:center;gap:2px">${icon}${Math.abs(v)}%</span>`;
  };

  const kpiItem = (label, value, unit, trend) => `
    <div style="background:var(--bg-secondary);border-radius:10px;padding:14px 16px;border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--muted);margin-bottom:6px">${label}</div>
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:6px">
        <div style="font-family:'Roboto Mono',monospace;font-size:20px;font-weight:700;color:var(--primary)">${formatNum(value)}<span style="font-size:12px;color:var(--muted);margin-left:4px">${unit}</span></div>
        ${trendArrow(trend)}
      </div>
      ${trend !== null ? `<div style="font-size:10px;color:var(--muted);margin-top:4px">So v\u1edbi k\u1ef3 tr\u01b0\u1edbc</div>` : ''}
    </div>`;

  openModal(`
  <div class="modal-header">
    <span class="modal-title">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle">
        <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="9" y1="21" x2="9" y2="9"/>
      </svg>
      Chi ti\u1ebft b\u1ea3n ghi ${d.id}
    </span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body" style="max-height:78vh;overflow-y:auto">

    <!-- Header -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:16px;border-bottom:1px dashed var(--border)">
      <div>
        <div style="font-size:18px;font-weight:700;color:var(--text);margin-bottom:4px">${d.factory}</div>
        <div style="font-size:13px;color:var(--muted)">${d.date}</div>
      </div>
      <div style="text-align:right">
        ${statusBadge(d.status)}
        <div style="font-size:11px;color:var(--muted);margin-top:4px">M\u00e3: <span style="font-family:'Roboto Mono',monospace;color:var(--primary)">${d.id}</span></div>
      </div>
    </div>

    <!-- KPI Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
      ${kpiItem('Doanh thu', d.revenue, 'VND', revDiff)}
      ${kpiItem('S\u1ea3n l\u01b0\u1ee3ng', d.consumption, 'm\u00b3', conDiff)}
      ${kpiItem('Kh\u00e1ch h\u00e0ng m\u1edbi', d.newCustomers, 'KH', null)}
      <div style="background:var(--bg-secondary);border-radius:10px;padding:14px 16px;border:1px solid var(--border)">
        <div style="font-size:11px;color:var(--muted);margin-bottom:6px">S\u1ef1 c\u1ed1 ph\u00e1t sinh</div>
        <div style="font-family:'Roboto Mono',monospace;font-size:20px;font-weight:700;color:${d.incidents > 0 ? 'var(--warning)' : 'var(--success)'}">
          ${d.incidents}
          <span style="font-size:12px;color:var(--muted);margin-left:4px">s\u1ef1 v\u1ee5</span>
        </div>
      </div>
    </div>

    <!-- Detail rows -->
    <div style="font-size:12px;color:var(--muted);margin-bottom:8px;font-weight:600;text-transform:uppercase;letter-spacing:.5px">Th\u00f4ng tin chi ti\u1ebft</div>
    <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:16px">
      ${[['Nh\u00e0 m\u00e1y / Khu v\u1ef1c', d.factory], ['Ng\u00e0y ghi nh\u1eadn', d.date],
         ['Doanh thu', formatNum(d.revenue) + ' VND'],
         ['S\u1ea3n l\u01b0\u1ee3ng n\u01b0\u1edbc', formatNum(d.consumption) + ' m\u00b3'],
         ['Kh\u00e1ch h\u00e0ng m\u1edbi', '+' + d.newCustomers + ' h\u1ee3p \u0111\u1ed3ng'],
         ['S\u1ef1 c\u1ed1 ph\u00e1t sinh', d.incidents + ' s\u1ef1 v\u1ee5'],
         ['Tr\u1ea1ng th\u00e1i k\u1ef3', (d.status === 'ok' ? 'B\u00ecnh th\u01b0\u1eddng' : d.status === 'warning' ? 'C\u1ea3nh b\u00e1o' : 'Nghi\u00eam tr\u1ecdng')]]
        .map(([k, v], i) => `
        <div style="display:flex;gap:12px;padding:10px 14px;${i % 2 === 0 ? '' : 'background:var(--bg-secondary)'}">
          <span style="min-width:160px;color:var(--muted);font-size:13px">${k}</span>
          <span style="font-size:13px;font-weight:500">${v}</span>
        </div>`).join('')}
    </div>

    ${d.status === 'warning' ? `
    <div style="background:rgba(255,202,40,.08);border:1px solid rgba(255,202,40,.25);border-radius:8px;padding:12px 16px;font-size:13px;color:var(--warning)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      K\u1ef3 n\u00e0y c\u00f3 ch\u1ec9 s\u1ed1 c\u1ea7n ch\u00fa \u00fd. \u0110\u1ec1 ngh\u1ecb ki\u1ec3m tra chi ti\u1ebft b\u00e1o c\u00e1o v\u1eadn h\u00e0nh t\u01b0\u01a1ng \u1ee9ng.
    </div>` : ''}
  </div>
  <div class="modal-footer" style="justify-content:space-between">
    <div style="font-size:11px;color:var(--muted)">Nguồn: Hệ thống IOC Hadiwa · ${d.date}</div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-ghost" onclick="closeModal()">\u0110\u00f3ng</button>
      <button class="btn btn-outline btn-sm" onclick="showToast('\u0110ang xu\u1ea5t b\u1ea3n ghi ${d.id}...')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Xu\u1ea5t Excel
      </button>
    </div>
  </div>`);
}
