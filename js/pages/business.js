// ── BUSINESS & CRM (NÂNG CAO) ─────────────────────────────────────
let bizTab = 'customers';
let custPage = 1;
const custPageSize = 10;

function renderBusiness() {
  return `
  <div class="page-header">
    <div class="page-title"><h1>Kinh doanh & Khách hàng</h1><p>Hợp đồng, Hóa đơn, Ghi chỉ số và Công nợ</p></div>
    <div class="page-actions">
      <button class="btn btn-ghost btn-sm" onclick="importCustomerData()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Import File</button>
      <button class="btn btn-ghost btn-sm" onclick="showToast('Đang tải file mẫu (template)...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Template</button>
      <button class="btn btn-primary" onclick="openAddCustomer()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Thêm KH</button>
    </div>
  </div>

  <div class="tabs">
    <button class="tab-btn ${bizTab === 'customers' ? 'active' : ''}" onclick="switchBizTab('customers')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> Khách hàng & HĐ</button>
    <button class="tab-btn ${bizTab === 'billing' ? 'active' : ''}" onclick="switchBizTab('billing')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Hóa đơn & Thanh toán</button>
    <button class="tab-btn ${bizTab === 'metering' ? 'active' : ''}" onclick="switchBizTab('metering')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> Ghi chỉ số đồng hồ</button>
  </div>
  <div id="bizContent">${getBizTabContent()}</div>`;
}

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
    const y = height - ((d - min) / range) * height + 2; // Offset by 2 for padding
    return `${x},${y}`;
  }).join(' ');

  return `
  <svg class="sparkline" viewBox="0 0 ${width} ${height + 4}">
    <path d="M ${points.split(' ')[0]} L ${points.split(' ').slice(1).join(' L ')}" style="stroke: ${color}" />
  </svg>`;
}

function switchBizTab(tab) {
  bizTab = tab;
  custPage = 1; // Reset page when switching tabs
  document.querySelectorAll('.tabs .tab-btn').forEach(b => b.classList.remove('active'));
  const targetBtn = event.currentTarget || event.target.closest('.tab-btn');
  if (targetBtn) targetBtn.classList.add('active');
  document.getElementById('bizContent').innerHTML = getBizTabContent();
}

function getBizTabContent() {
  if (bizTab === 'customers') return renderCustomers();
  if (bizTab === 'billing') return renderBilling();
  if (bizTab === 'metering') return renderMetering();
  return '';
}

function renderCustomers() {
  // Simple internal filtering
  const searchInput = document.getElementById('fbSearch_business');
  const searchVal = searchInput ? searchInput.value.toLowerCase() : '';
  const filterDistrict = document.getElementById('ff-district_business');
  const districtVal = filterDistrict ? filterDistrict.value : '';
  const filterFactory = document.getElementById('ff-factory_business');
  const factoryVal = filterFactory ? filterFactory.value : '';
  const filterType = document.getElementById('ff-type_business');
  const typeVal = filterType ? filterType.value : '';

  const filtered = DATA.customers.filter(c => {
    const matchesSearch = !searchVal ||
      c.name.toLowerCase().includes(searchVal) ||
      c.id.toLowerCase().includes(searchVal) ||
      c.address.toLowerCase().includes(searchVal);
    const matchesDistrict = !districtVal || c.address.includes(districtVal);
    const matchesFactory = !factoryVal || c.address.includes(factoryVal);
    const matchesType = !typeVal || (typeVal === 'Hộ dân' ? c.type === 'household' : c.type === 'enterprise');
    return matchesSearch && matchesDistrict && matchesFactory && matchesType;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / custPageSize);
  const startIdx = (custPage - 1) * custPageSize;
  const pageData = filtered.slice(startIdx, startIdx + custPageSize);

  return `
  <div class="card" style="margin-bottom:24px">
    <div class="card-header">
      <span class="card-title">Danh sách khách hàng (${formatNum(total)})</span>
      <div class="page-actions">
        <button class="btn btn-ghost btn-sm" onclick="exportCustomersToExcel()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Export</button>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Mã KH</th><th>Tên khách hàng</th><th>Địa chỉ</th><th>Loại</th><th>Trạng thái</th><th>Sản lượng</th><th>Công nợ</th><th style="text-align:right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${pageData.map(c => `
          <tr onclick="viewCustomerDetail('${c.id}')">
            <td class="mono" style="color:var(--cyan)">${c.id}</td>
            <td style="font-weight:600">${c.name}</td>
            <td style="font-size:12px;color:var(--muted)">${c.address}</td>
            <td><span class="badge ${c.type === 'household' ? 'badge-blue' : 'badge-gray'}">${c.type === 'household' ? 'Hộ dân' : 'DN'}</span></td>
            <td>${statusBadge(c.status)}</td>
            <td class="mono">${c.consumption > 0 ? c.consumption + ' m³' : '—'}</td>
            <td class="mono" style="color:${c.debt > 0 ? 'var(--red)' : 'var(--green)'}">${c.debt > 0 ? formatNum(c.debt) + ' đ' : 'Không nợ'}</td>
            <td style="text-align:right">
              <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();viewCustomerDetail('${c.id}')">Chi tiết</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>

    <div class="pagination-bar">
      <div class="page-info">Hiển thị <strong>${total > 0 ? startIdx + 1 : 0} - ${Math.min(startIdx + custPageSize, total)}</strong> trong tổng số <strong>${formatNum(total)}</strong></div>
      <div class="page-nav">
        <button class="page-link" onclick="changeCustPage(1)" ${custPage === 1 ? 'disabled' : ''} title="Trang đầu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg></button>
        <button class="page-link" onclick="changeCustPage(${custPage - 1})" ${custPage === 1 ? 'disabled' : ''} title="Trang trước"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg></button>
        ${renderPageNumbers(custPage, totalPages, 'changeCustPage')}
        <button class="page-link" onclick="changeCustPage(${custPage + 1})" ${custPage === totalPages || totalPages === 0 ? 'disabled' : ''} title="Trang tiếp"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg></button>
        <button class="page-link" onclick="changeCustPage(${totalPages})" ${custPage === totalPages || totalPages === 0 ? 'disabled' : ''} title="Trang cuối"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg></button>
      </div>
    </div>
  </div>`;
}

function renderPageNumbers(current, total, callback = 'changeCustPage') {
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

window.changeCustPage = function (p) {
  custPage = p;
  document.getElementById('bizContent').innerHTML = renderCustomers();
};

function renderBilling() {
  const totalPaid = DATA.invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalUnpaid = DATA.invoices.filter(i => i.status !== 'paid' && i.amount > 0).reduce((s, i) => s + i.amount, 0);
  const total = DATA.invoices.length;
  const totalPages = Math.ceil(total / custPageSize);
  const startIdx = (custPage - 1) * custPageSize;
  const pageData = DATA.invoices.slice(startIdx, startIdx + custPageSize);

  return `
  <div style="display:flex;gap:14px;margin-bottom:14px;flex-wrap:wrap">
    <div class="card" style="padding:14px 20px;flex:1;display:flex;align-items:center;gap:16px">
      <div style="font-size:12px;color:var(--muted)">Tháng 2/2026</div>
      <div style="flex:1;display:flex;gap:24px;justify-content:center">
        <div style="text-align:center"><div style="font-size:11px;color:var(--muted)">Đã thu (mẫu)</div><div style="font-size:20px;font-weight:700;color:var(--green)">${formatNum(totalPaid)} đ</div></div>
        <div style="text-align:center"><div style="font-size:11px;color:var(--muted)">Còn nợ (mẫu)</div><div style="font-size:20px;font-weight:700;color:var(--red)">${formatNum(totalUnpaid)} đ</div></div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="exportInvoicesToExcel()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg> Xuất Excel</button>
    </div>
  </div>
  <div class="card" style="margin-bottom:24px">
    <div class="table-wrap"><table>
      <thead><tr><th>Số HĐ</th><th>Khách hàng</th><th>Địa chỉ</th><th>Kỳ</th><th>T.thụ (m³)</th><th>Số tiền</th><th>Trạng thái</th><th>Ngày phát hành</th><th>Ngày thanh toán</th><th>Phương thức</th><th></th></tr></thead>
      <tbody>
        ${pageData.map(i => `<tr>
          <td class="mono text-cyan" style="font-size:11px">${i.id}</td>
          <td style="font-size:12px;font-weight:500">${i.name}</td>
          <td style="font-size:11px;color:var(--muted)">${i.address}</td>
          <td style="font-size:12px">${i.period}</td>
          <td class="mono" style="font-size:12px">${i.consumption > 0 ? i.consumption : '-'}</td>
          <td class="mono" style="font-size:12px;font-weight:600;color:${i.status === 'paid' ? 'var(--green)' : i.amount > 0 ? 'var(--yellow)' : 'var(--muted)'}">${i.amount > 0 ? formatNum(i.amount) + ' đ' : '—'}</td>
          <td>${i.status === 'paid' ? '<span class="badge badge-green">Đã thu</span>' : i.status === 'partial' ? '<span class="badge badge-yellow">Một phần</span>' : i.status === 'unpaid' ? '<span class="badge badge-red">Chưa thu</span>' : '<span class="badge badge-gray">Tạm khóa</span>'}</td>
          <td class="mono" style="font-size:11px;color:var(--muted)">${i.issuedDate}</td>
          <td class="mono" style="font-size:11px;color:${i.paidDate !== '—' ? 'var(--green)' : 'var(--muted)'}">${i.paidDate}</td>
          <td style="font-size:11px;color:var(--muted)">${i.method}</td>
          <td><button class="btn btn-ghost btn-sm" onclick="showToast('Xem hóa đơn ${i.id}')">Xem</button></td>
        </tr>`).join('')}
      </tbody>
    </table></div>
    <div class="pagination-bar">
      <div class="page-info">Hiển thị <strong>${total > 0 ? startIdx + 1 : 0} - ${Math.min(startIdx + custPageSize, total)}</strong> trong tổng số <strong>${formatNum(total)}</strong></div>
      <div class="page-nav">
        <button class="page-link" onclick="changeInvoicesPage(1)" ${custPage === 1 ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg></button>
        <button class="page-link" onclick="changeInvoicesPage(${custPage - 1})" ${custPage === 1 ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg></button>
        ${renderPageNumbers(custPage, totalPages, 'changeInvoicesPage')}
        <button class="page-link" onclick="changeInvoicesPage(${custPage + 1})" ${custPage === totalPages || totalPages === 0 ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg></button>
        <button class="page-link" onclick="changeInvoicesPage(${totalPages})" ${custPage === totalPages || totalPages === 0 ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg></button>
      </div>
    </div>
  </div>`;
}

window.changeInvoicesPage = function (p) {
  custPage = p;
  document.getElementById('bizContent').innerHTML = renderBilling();
};

function renderMetering() {
  const total = DATA.meterReadings.length;
  const totalPages = Math.ceil(total / custPageSize);
  const startIdx = (custPage - 1) * custPageSize;
  const pageData = DATA.meterReadings.slice(startIdx, startIdx + custPageSize);

  return `
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
    <div style="background:rgba(0,200,255,.08);border:1px solid rgba(0,200,255,.2);border-radius:10px;padding:12px 16px;flex:1;font-size:13px">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> <strong>Ghi chỉ số Mobile App</strong> — Nhân viên ghi chỉ số bằng điện thoại, ảnh chụp đồng hồ đính kèm tự động. Hệ thống AI phân tích ảnh và phát hiện bất thường.
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-ghost btn-sm" onclick="showToast('Đang tải ảnh chụp đồng hồ...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> Xem ảnh</button>
      <button class="btn btn-primary btn-sm" onclick="showToast('Đang xuất kết quả ghi chỉ số...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Xuất Excel</button>
    </div>
  </div>
  <div class="card" style="margin-bottom:24px">
    <div class="table-wrap"><table>
      <thead><tr><th>Mã đọc</th><th>Khách hàng</th><th>Mã đồng hồ</th><th>Chỉ số cũ</th><th>Chỉ số mới</th><th>Tiêu thụ (m³)</th><th>Ngày đọc</th><th>Người đọc</th><th>Ảnh</th><th>Tình trạng</th></tr></thead>
      <tbody>
        ${pageData.map(r => `<tr>
          <td class="mono text-cyan" style="font-size:11px">${r.id}</td>
          <td style="font-size:12px;font-weight:500">${r.name}</td>
          <td class="mono" style="font-size:11px;color:var(--muted)">${r.meter}</td>
          <td class="mono">${r.prevReading.toFixed(1)}</td>
          <td class="mono">${r.currReading.toFixed(1)}</td>
          <td class="mono" style="font-weight:700;color:${r.status === 'suspect' ? 'var(--red)' : r.consumption > 1000 ? 'var(--yellow)' : 'var(--green)'}">${r.consumption.toFixed(1)}</td>
          <td class="mono" style="font-size:12px;color:var(--muted)">${r.readDate}</td>
          <td style="font-size:12px;color:var(--muted)">${r.reader}</td>
          <td style="text-align:center">${r.photo ? '<span style="color:var(--green);font-size:14px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg></span>' : '<span style="color:var(--red);font-size:14px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2.5" style="vertical-align:middle"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>'}</td>
          <td>${r.status === 'confirmed' ? '<span class="badge badge-green">Xác nhận</span>' : '<span class="badge badge-red">Nghi vấn <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>'}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>
    <div class="pagination-bar">
      <div class="page-info">Hiển thị <strong>${total > 0 ? startIdx + 1 : 0} - ${Math.min(startIdx + custPageSize, total)}</strong> trong tổng số <strong>${formatNum(total)}</strong></div>
      <div class="page-nav">
        <button class="page-link" onclick="changeMeteringPage(1)" ${custPage === 1 ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg></button>
        <button class="page-link" onclick="changeMeteringPage(${custPage - 1})" ${custPage === 1 ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg></button>
        ${renderPageNumbers(custPage, totalPages, 'changeMeteringPage')}
        <button class="page-link" onclick="changeMeteringPage(${custPage + 1})" ${custPage === totalPages || totalPages === 0 ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg></button>
        <button class="page-link" onclick="changeMeteringPage(${totalPages})" ${custPage === totalPages || totalPages === 0 ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg></button>
      </div>
    </div>
  </div>`;
}

window.changeMeteringPage = function (p) {
  custPage = p;
  document.getElementById('bizContent').innerHTML = renderMetering();
};

function openAddCustomer() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Thêm khách hàng mới</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-row"><div class="form-group"><label class="form-label">Loại khách hàng</label><select class="form-control"><option>Hộ dân</option><option>Doanh nghiệp</option></select></div><div class="form-group"><label class="form-label">Họ và tên / Tên tổ chức</label><input class="form-control" placeholder="Nhập tên..."></div></div>
    <div class="form-group" style="margin-bottom:16px"><label class="form-label">Địa chỉ lắp đặt đồng hồ</label><input class="form-control" placeholder="Số nhà, đường, phường/xã, thành phố..."></div>
    <div class="form-row"><div class="form-group"><label class="form-label">Số điện thoại</label><input class="form-control" placeholder="09xx..."></div><div class="form-group"><label class="form-label">Loại biểu giá</label><select class="form-control"><option>Sinh hoạt (thang lũy kế)</option><option>Sản xuất kinh doanh</option><option>Cơ quan hành chính</option></select></div></div>
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Hủy</button><button class="btn btn-primary" onclick="closeModal();showToast('Khách hàng đã được thêm thành công!')">Tạo hợp đồng</button></div>`);
}

function viewCustomerDetail(id) {
  const c = DATA.customers.find(x => x.id === id);
  if (!c) return;
  const inv = DATA.invoices.find(i => i.customer === id);
  openModal(`
  <div class="modal-header"><span class="modal-title">Chi tiết: ${c.name}</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    ${[['Mã KH', c.id], ['Loại', c.type === 'household' ? 'Hộ dân' : 'Doanh nghiệp'], ['Địa chỉ', c.address], ['Mã hợp đồng', c.contract], ['Trạng thái', c.status], ['Tiêu thụ/tháng', c.consumption + ' m³'], ['Công nợ', c.debt > 0 ? formatNum(c.debt) + ' đ' : 'Không nợ'], ['Hóa đơn T2', inv ? formatNum(inv.amount) + ' đ (' + inv.status + ')' : '—']].map(([k, v]) => `
    <div style="padding:10px 0;border-bottom:1px solid var(--border);display:flex;gap:12px">
      <span style="min-width:160px;color:var(--muted);font-size:13px">${k}</span>
      <span style="font-size:13px">${v}</span>
    </div>`).join('')}
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Đóng</button><button class="btn btn-primary" onclick="showToast('Đang mở chỉnh sửa hợp đồng...');closeModal()">Chỉnh sửa HĐ</button></div>`);
}

window.exportCustomersToExcel = function () {
  showToast('Đang chuẩn bị dữ liệu 302,450 khách hàng...');
  setTimeout(() => {
    showToast('Đang tạo file Excel: Danh_sach_KH_Hadiwa.xlsx');
    setTimeout(() => {
      showToast('Đã tải xuống thành công!');
    }, 1500);
  }, 1000);
};

window.exportInvoicesToExcel = function () {
  showToast('Đang kết xuất dữ liệu hóa đơn kỳ T2/2026...');
  setTimeout(() => {
    showToast('Đã tạo file: Bao_cao_doanh_thu_T2.xlsx');
    setTimeout(() => {
      showToast('Đã tải xuống thành công!');
    }, 1500);
  }, 1000);
};

window.importCustomerData = function () {
  openModal(`
  <div class="modal-header"><span class="modal-title">Import dữ liệu khách hàng</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div style="border:2px dashed var(--border); border-radius:12px; padding:40px; text-align:center; background:rgba(255,255,255,0.02); cursor:pointer" onclick="this.querySelector('input').click()">
      <input type="file" style="display:none" onchange="closeModal(); showToast('Đang tải lên file ' + this.files[0].name + '...'); setTimeout(()=>showToast('Import thành công 1,240 bản ghi!'), 2000)">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="1.5" style="margin-bottom:12px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      <div style="font-weight:600">Kéo thả file Excel/CSV vào đây</div>
      <div style="font-size:12px; color:var(--muted); margin-top:4px">Dung lượng tối đa 20MB. Sử dụng file mẫu để tránh lỗi định dạng.</div>
    </div>
    <div style="margin-top:20px">
      <div style="font-size:13px; font-weight:600; margin-bottom:8px">Hướng dẫn nhanh:</div>
      <ul style="font-size:12px; color:var(--muted); padding-left:16px">
        <li>Cột A: Mã khách hàng (bắt buộc)</li>
        <li>Cột B: Loại khách hàng (household/enterprise)</li>
        <li>Cột C: Chỉ số đồng hồ mới</li>
      </ul>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy bỏ</button>
    <button class="btn btn-primary" onclick="showToast('Vui lòng chọn file trước!')">Bắt đầu Import</button>
  </div>`);
};
