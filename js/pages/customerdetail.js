// ── CUSTOMER DETAIL PAGE ─────────────────────────────────────────
// Navigate here via viewCustomerDetail(id) — sets global currentCustomerId
let currentCustomerId = null;
let cdTab = 'overview';

function viewCustomerDetail(id) {
  currentCustomerId = id;
  cdTab = 'overview';
  navigate('customerdetail');
}

function renderCustomerDetail() {
  const id = currentCustomerId;
  const c = DATA.customers.find(x => x.id === id);
  if (!c) return `<div class="empty-state"><p>Không tìm thấy khách hàng. <a style="color:var(--primary);cursor:pointer" onclick="navigate('business')">← Quay lại</a></p></div>`;

  const inv = DATA.invoices.filter(i => i.customer === id);
  const meter = DATA.meterReadings.filter(r => r.customer === id);
  const tickets = DATA.callTickets.slice(0, 2); // mock related tickets
  const calls = DATA.callLogs.filter(l => l.customer.includes(c.name.split(' ')[0])).slice(0, 3);

  // Consumption sparkline data (mock 12 months)
  const consumeHistory = [
    { month: 'T3/25', val: 19.2 }, { month: 'T4/25', val: 20.1 }, { month: 'T5/25', val: 22.4 }, { month: 'T6/25', val: 24.5 },
    { month: 'T7/25', val: 23.8 }, { month: 'T8/25', val: 25.1 }, { month: 'T9/25', val: 22.0 }, { month: 'T10/25', val: 20.3 },
    { month: 'T11/25', val: 19.8 }, { month: 'T12/25', val: 18.9 }, { month: 'T1/26', val: 17.5 }, { month: 'T2/26', val: c.consumption || 18.5 }
  ];
  const avgConsume = (consumeHistory.reduce((s, m) => s + m.val, 0) / consumeHistory.length).toFixed(1);
  const lastMonth = consumeHistory[consumeHistory.length - 2];
  const trend = c.consumption > lastMonth.val ? 'up' : 'down';

  return `
  <!-- Breadcrumb back -->
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px">
    <button class="btn btn-ghost btn-sm" onclick="navigate('business')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Khách hàng & HĐ
    </button>
    <span style="color:var(--muted);font-size:13px">/</span>
    <span style="font-size:13px;color:var(--text)">${c.name}</span>
  </div>

  <!-- Header -->
  <div style="display:flex;align-items:flex-start;gap:20px;margin-bottom:20px;flex-wrap:wrap">
    <div style="width:60px;height:60px;border-radius:16px;background:linear-gradient(135deg,#0050cc22,#00c8ff22);border:1px solid rgba(0,200,255,.25);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:var(--primary);flex-shrink:0">
      ${c.type === 'household' ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>'}
    </div>
    <div style="flex:1">
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <h1 style="font-size:22px;font-weight:700">${c.name}</h1>
        ${c.type === 'household' ? '<span class="badge badge-blue">Hộ dân</span>' : '<span class="badge" style="background:rgba(41,132,238,.12);color:#8CC5FF;border:1px solid rgba(41,132,238,.3)">Doanh nghiệp</span>'}
        ${statusBadge(c.status)}
      </div>
      <div style="display:flex;gap:16px;margin-top:8px;flex-wrap:wrap;align-items:center">
        <span style="font-size:13px;color:var(--muted)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> <span style="color:var(--muted);font-size:11px">Lắp đặt:</span> ${c.address}</span>
        ${(() => { const dma = DATA.dmaZones.find(d => d.id === c.dmaZone); return dma ? `<span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;padding:3px 9px;border-radius:6px;background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.25);color:var(--primary)"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg> ${dma.name}</span>` : ''; })()}
        <span style="font-size:13px;color:var(--muted)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> HĐ: <span style="color:var(--primary);font-family:'Roboto Mono',monospace">${c.contract}</span></span>
        <span style="font-size:13px;color:var(--muted)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> <span style="color:var(--primary);font-family:'Roboto Mono',monospace">${c.id}</span></span>
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-shrink:0">
      <button class="btn btn-ghost btn-sm" onclick="showToast('Đang mở chỉnh sửa HĐ...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Sửa HĐ</button>
      <button class="btn btn-ghost btn-sm" onclick="showToast('Đang tạo hóa đơn thủ công...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Tạo HĐ</button>
      <button class="btn btn-danger btn-sm" onclick="showToast('Đã tạm khóa dịch vụ KH!')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> Khóa DV</button>
    </div>
  </div>

  <!-- KPI summary -->
  <div class="kpi-grid" style="margin-bottom:18px">
    <div class="kpi-card" style="--accent-color:var(--primary)">
      <div class="kpi-label">Tiêu thụ tháng 2</div>
      <div class="kpi-value">${c.consumption}<span style="font-size:14px;color:var(--muted)"> m³</span></div>
      <div class="kpi-sub"><span class="${trend === 'up' ? 'kpi-trend-up' : 'kpi-trend-down'}">${trend === 'up' ? '▲' : '▼'} ${Math.abs(c.consumption - lastMonth.val).toFixed(1)} m³</span> so với T1/2026</div>
    </div>
    <div class="kpi-card" style="--accent-color:var(--success)">
      <div class="kpi-label">Tiêu thụ TB / tháng</div>
      <div class="kpi-value">${avgConsume}<span style="font-size:14px;color:var(--muted)"> m³</span></div>
      <div class="kpi-sub">12 tháng gần nhất</div>
    </div>
    <div class="kpi-card" style="--accent-color:${c.debt > 0 ? 'var(--danger)' : 'var(--success)'}">
      <div class="kpi-label">Công nợ hiện tại</div>
      <div class="kpi-value" style="color:${c.debt > 0 ? 'var(--danger)' : 'var(--success)'}${c.debt > 0 ? '' : ''}">${c.debt > 0 ? formatNum(c.debt) + 'đ' : '0 đ'}</div>
      <div class="kpi-sub">${c.debt > 0 ? 'Chưa thanh toán' : 'Không nợ'}</div>
    </div>
    <div class="kpi-card" style="--accent-color:var(--info)">
      <div class="kpi-label">Khách hàng từ</div>
      <div class="kpi-value" style="font-size:18px">T3/2021</div>
      <div class="kpi-sub">~5 năm sử dụng dịch vụ</div>
    </div>
  </div>

  <!-- Tabs -->
  <div class="tabs">
    <button class="tab-btn ${cdTab === 'overview' ? 'active' : ''}" onclick="switchCdTab(this,'overview')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Tổng quan</button>
    <button class="tab-btn ${cdTab === 'usage' ? 'active' : ''}" onclick="switchCdTab(this,'usage')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 2C12 2 4 10 4 14a8 8 0 0016 0C20 10 12 2 12 2z"/></svg> Lịch sử tiêu thụ</button>
    <button class="tab-btn ${cdTab === 'billing' ? 'active' : ''}" onclick="switchCdTab(this,'billing')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Hóa đơn & Thanh toán</button>
    <button class="tab-btn ${cdTab === 'meter' ? 'active' : ''}" onclick="switchCdTab(this,'meter')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> Ghi chỉ số</button>
    <button class="tab-btn ${cdTab === 'tickets' ? 'active' : ''}" onclick="switchCdTab(this,'tickets')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> Ticket & CSKH</button>
    <button class="tab-btn ${cdTab === 'notes' ? 'active' : ''}" onclick="switchCdTab(this,'notes')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Ghi chú</button>
  </div>
  <div id="cdContent">${getCdTabContent(c, inv, meter, tickets, calls, consumeHistory)}</div>`;
}

function switchCdTab(btn, tab) {
  cdTab = tab;
  document.querySelectorAll('.tabs .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const c = DATA.customers.find(x => x.id === currentCustomerId);
  const inv = DATA.invoices.filter(i => i.customer === currentCustomerId);
  const meter = DATA.meterReadings.filter(r => r.customer === currentCustomerId);
  const calls = DATA.callLogs.filter(l => l.customer.includes(c?.name?.split(' ')[0] || '')).slice(0, 3);
  const consumeHistory = [
    { month: 'T3/25', val: 19.2 }, { month: 'T4/25', val: 20.1 }, { month: 'T5/25', val: 22.4 }, { month: 'T6/25', val: 24.5 },
    { month: 'T7/25', val: 23.8 }, { month: 'T8/25', val: 25.1 }, { month: 'T9/25', val: 22.0 }, { month: 'T10/25', val: 20.3 },
    { month: 'T11/25', val: 19.8 }, { month: 'T12/25', val: 18.9 }, { month: 'T1/26', val: 17.5 }, { month: 'T2/26', val: c?.consumption || 18.5 }
  ];
  document.getElementById('cdContent').innerHTML = getCdTabContent(c, inv, meter, DATA.callTickets.slice(0, 2), calls, consumeHistory);
  if (tab === 'usage') setTimeout(renderCdUsageChart, 60);
}

window.afterRender_customerdetail = function () {
  if (cdTab === 'usage') setTimeout(renderCdUsageChart, 60);
};

function getCdTabContent(c, inv, meter, tickets, calls, ch) {
  if (cdTab === 'overview') return renderCdOverview(c, inv, meter, calls, ch);
  if (cdTab === 'usage') return renderCdUsage(c, ch);
  if (cdTab === 'billing') return renderCdBilling(c, inv);
  if (cdTab === 'meter') return renderCdMeter(c, meter);
  if (cdTab === 'tickets') return renderCdTickets(c, tickets, calls);
  if (cdTab === 'notes') return renderCdNotes(c);
  return '';
}

function renderCdOverview(c, inv, meter, calls, ch) {
  const latestMeter = meter[meter.length - 1];
  return `
  <div class="grid-2" style="margin-bottom:16px">
    <!-- Contract info -->
    <div class="card">
      <div class="card-header"><span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Thông tin hợp đồng</span></div>
      <div class="card-body" style="padding:16px">
        ${(() => {
      const dma = DATA.dmaZones.find(d => d.id === c.dmaZone);
      const dmaStatusColor = dma ? (dma.status === 'ok' ? 'var(--success)' : dma.status === 'warning' ? 'var(--warning)' : 'var(--danger)') : 'var(--muted)';
      const dmaDisplay = dma ? `<span style="font-weight:600;color:var(--primary)">${dma.id} — ${dma.name}</span> <span style="font-size:11px;padding:1px 6px;border-radius:4px;background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.2);color:var(--primary);margin-left:4px">${dma.district}</span> ${statusBadge(dma.status)}` : '<span style="color:var(--muted)">—</span>';
      return [
        ['Mã khách hàng', c.id],
        ['Mã hợp đồng', c.contract],
        ['Loại khách hàng', c.type === 'household' ? 'Hộ dân' : 'Doanh nghiệp'],
        ['Biểu giá áp dụng', c.type === 'household' ? 'Sinh hoạt – thang lũy kế' : 'Sản xuất kinh doanh'],
        ['Địa chỉ lắp đặt', `<span style="color:var(--text)">${c.address}</span>`],
        ['Địa chỉ thường trú / LH', `<span style="color:var(--text)">${c.contactAddress || c.address}</span>`],
        ['Vùng DMA', dmaDisplay],
        ['Ngày ký HĐ', '15/03/2021'],
        ['Ngày hết hạn HĐ', '15/03/2026'],
        ['Trạng thái', statusBadge(c.status)],
      ].map(([k, v]) => `<div style="padding:9px 0;border-bottom:1px solid var(--border);display:flex;gap:10px;align-items:flex-start"><span style="min-width:180px;color:var(--muted);font-size:12px;padding-top:2px;flex-shrink:0">${k}</span><span style="font-size:13px;flex:1">${v}</span></div>`).join('');
    })()}
      </div>
    </div>

    <!-- Contact + meter info -->
    <div class="card">
      <div class="card-header"><span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.03 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg> Liên hệ & Đồng hồ</span></div>
      <div class="card-body" style="padding:16px">
        ${[
      ['SĐT liên hệ', '0912 xxx 678'],
      ['Email', `${c.name.replace(/\s+/g, '').toLowerCase()}@gmail.com`],
      ['Người liên hệ', c.name],
      ['Mã đồng hồ', latestMeter?.meter || 'DH-230001'],
      ['Loại đồng hồ', c.consumption > 100 ? 'Đồng hồ điện tử (Class C)' : 'Đồng hồ cơ học'],
      ['Chỉ số hiện tại', latestMeter ? `${latestMeter.currReading} m³` : 'N/A'],
      ['Lần đọc gần nhất', latestMeter?.readDate || 'N/A'],
      ['Người đọc', latestMeter?.reader || 'N/A'],
    ].map(([k, v]) => `<div style="padding:9px 0;border-bottom:1px solid var(--border);display:flex;gap:10px"><span style="min-width:180px;color:var(--muted);font-size:12px">${k}</span><span style="font-size:13px">${v}</span></div>`).join('')}
      </div>
    </div>
  </div>

  <!-- Mini consumption chart + recent calls -->
  <div class="grid-2" style="margin-bottom:16px">
    <div class="card">
      <div class="card-header"><span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 2C12 2 4 10 4 14a8 8 0 0016 0C20 10 12 2 12 2z"/></svg> Xu hướng tiêu thụ 6 tháng</span></div>
      <div class="card-body"><div class="chart-wrap"><canvas id="cdMiniChart"></canvas></div></div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.03 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg> Cuộc gọi CSKH gần nhất</span></div>
      <div class="card-body" style="padding:14px">
        ${calls.length ? calls.map(l => `
        <div style="padding:10px;border:1px solid var(--border);border-radius:8px;margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div style="font-size:12px;font-weight:600">${l.topic}</div>
            ${l.status === 'resolved' ? '<span class="badge badge-green" style="font-size:10px">Đã giải quyết</span>' : '<span class="badge badge-yellow" style="font-size:10px">Đang xử lý</span>'}
          </div>
          <div style="font-size:11px;color:var(--muted);margin-top:4px">${l.time} · Agent: ${l.agent} · ${l.duration}</div>
        </div>`).join('') : `<div style="color:var(--muted);font-size:13px;text-align:center;padding:20px">Chưa có cuộc gọi nào</div>`}
      </div>
    </div>
  </div>

  <!-- DMA Zone info card -->
  ${(() => {
      const dma = DATA.dmaZones.find(d => d.id === c.dmaZone);
      if (!dma) return '';
      const lossColor = dma.loss > 18 ? 'var(--danger)' : dma.loss > 12 ? 'var(--warning)' : 'var(--success)';
      const statusColor = dma.status === 'ok' ? 'var(--success)' : dma.status === 'warning' ? '#ffca28' : '#ff1744';
      const statusGlow = dma.status === 'ok' ? 'rgba(41,132,238,.15)' : dma.status === 'warning' ? 'rgba(255,202,40,.15)' : 'rgba(255,23,68,.15)';
      return `
    <div class="card">
      <div class="card-header">
        <span class="card-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
          Thông tin Vùng DMA
        </span>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;padding:3px 9px;border-radius:6px;background:${statusGlow};border:1px solid ${statusColor}33;color:${statusColor}">
            <span style="width:7px;height:7px;border-radius:50%;background:${statusColor};display:inline-block"></span>
            ${dma.status === 'ok' ? 'Bình thường' : dma.status === 'warning' ? 'Cảnh báo' : 'Nghiêm trọng'}
          </span>
          <button class="btn btn-ghost btn-sm" onclick="navigate('nrw')" style="font-size:11px">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="9 18 15 12 9 6"/></svg>
            Xem phân tích NRW
          </button>
        </div>
      </div>
      <div class="card-body" style="padding:16px">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:14px">
          <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:12px 16px">
            <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Mã / Tên vùng</div>
            <div style="font-size:14px;font-weight:700;color:var(--primary)">${dma.id}</div>
            <div style="font-size:12px;color:var(--text-2);margin-top:2px">${dma.name}</div>
          </div>
          <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:12px 16px">
            <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Khu vực</div>
            <div style="font-size:14px;font-weight:700">${dma.district}</div>
          </div>
          <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:12px 16px">
            <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Lưu lượng cấp</div>
            <div style="font-size:14px;font-weight:700;color:var(--info)">${dma.supplyFlow.toLocaleString('vi-VN')} <span style="font-size:11px;font-weight:400">m³/ngày</span></div>
          </div>
          <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:12px 16px">
            <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Lưu lượng tiêu thụ</div>
            <div style="font-size:14px;font-weight:700;color:var(--success)">${dma.consumptionFlow.toLocaleString('vi-VN')} <span style="font-size:11px;font-weight:400">m³/ngày</span></div>
          </div>
          <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:12px 16px">
            <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Tỷ lệ thất thoát</div>
            <div style="font-size:14px;font-weight:700;color:${lossColor}">${dma.loss}%</div>
            <div style="margin-top:6px;height:4px;border-radius:2px;background:var(--border);overflow:hidden"><div style="height:100%;width:${dma.loss}%;background:${lossColor};border-radius:2px;transition:width .4s"></div></div>
          </div>
          <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:12px 16px">
            <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Tổng KH trong vùng</div>
            <div style="font-size:14px;font-weight:700">${dma.customers.toLocaleString('vi-VN')} <span style="font-size:11px;font-weight:400">khách hàng</span></div>
          </div>
        </div>
        ${dma.status !== 'ok' ? `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:${statusGlow};border:1px solid ${statusColor}33;border-radius:8px;font-size:12px;color:${statusColor}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span>${dma.status === 'critical' ? `Vùng DMA này đang ở mức <strong>NGHIÊM TRỌNG</strong> — tỷ lệ thất thoát ${dma.loss}% vượt ngưỡng an toàn (18%). Cần kiểm tra tuyến ống và áp lực khu vực sớm.` : `Vùng DMA này đang ở mức <strong>CẢNH BÁO</strong> — tỷ lệ thất thoát ${dma.loss}% đang tăng, cần theo dõi chặt.`}</span>
        </div>` : ''}
      </div>
    </div>`;
    })()}`;
}

window.afterRender_customerdetail_overview = function () {
  const ctx = document.getElementById('cdMiniChart');
  const ch = [
    { month: 'T9/25', val: 22.0 }, { month: 'T10/25', val: 20.3 }, { month: 'T11/25', val: 19.8 },
    { month: 'T12/25', val: 18.9 }, { month: 'T1/26', val: 17.5 }, { month: 'T2/26', val: 18.5 }
  ];
  const cdPalette = getChartPalette();
  const cdGrid = hexToRgba(cdPalette.cyan, .05);
  if (ctx) new Chart(ctx, { type: 'line', data: { labels: ch.map(x => x.month), datasets: [{ label: 'Tiêu thụ (m³)', data: ch.map(x => x.val), borderColor: cdPalette.cyan, backgroundColor: hexToRgba(cdPalette.cyan, .06), fill: true, tension: .4, borderWidth: 2, pointRadius: 4, pointBackgroundColor: cdPalette.cyan }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: cdPalette.textSecondary, font: { size: 11 } } } }, scales: { x: { ticks: { color: cdPalette.textMuted }, grid: { color: cdGrid } }, y: { ticks: { color: cdPalette.textMuted }, grid: { color: cdGrid } } } } });
};

function renderCdUsage(c, ch) {
  const max = Math.max(...ch.map(x => x.val));
  return `
  <div class="card" style="margin-bottom:16px">
    <div class="card-header"><span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Biểu đồ tiêu thụ 12 tháng</span><span style="font-size:12px;color:var(--muted)">TB: ${(ch.reduce((s, x) => s + x.val, 0) / ch.length).toFixed(1)} m³/tháng</span></div>
    <div class="card-body"><div class="chart-wrap" style="height:260px"><canvas id="cdUsageChart"></canvas></div></div>
  </div>
  <div class="grid-2">
    <div class="card"><div class="card-header"><span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Chi tiết theo tháng</span></div>
      <div class="table-wrap"><table>
        <thead><tr><th>Tháng</th><th>Tiêu thụ (m³)</th><th>So TB</th><th>Ước tính tiền</th></tr></thead>
        <tbody>
          ${ch.map(m => {
    const diff = (m.val - 20.9).toFixed(1);
    const est = Math.round(m.val * c.consumption / 20 * 5200);
    return `<tr>
              <td style="font-weight:600">${m.month}</td>
              <td class="mono">${m.val}</td>
              <td><span style="color:${diff > 0 ? 'var(--danger)' : 'var(--success)'};font-size:12px">${diff > 0 ? '+' : ''}${diff} m³</span></td>
              <td class="mono" style="color:var(--primary)">${formatNum(est)} đ</td>
            </tr>`;
  }).join('')}
        </tbody>
      </table></div>
    </div>
    <div class="card"><div class="card-header"><span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Thống kê tiêu thụ</span></div>
      <div class="card-body">
        ${[
      ['Cao nhất', `${max} m³ (${ch.find(x => x.val === max)?.month})`, 'var(--danger)'],
      ['Thấp nhất', `${Math.min(...ch.map(x => x.val))} m³`, 'var(--success)'],
      ['Trung bình', `${(ch.reduce((s, x) => s + x.val, 0) / ch.length).toFixed(1)} m³/tháng`, 'var(--primary)'],
      ['Tổng 12 tháng', `${ch.reduce((s, x) => s + x.val, 0).toFixed(1)} m³`, 'var(--text)'],
      ['Xu hướng', 'Tương đối ổn định ±10%', 'var(--warning)'],
    ].map(([k, v, col]) => `<div style="padding:10px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between"><span style="color:var(--muted);font-size:13px">${k}</span><span style="font-size:13px;font-weight:600;color:${col}">${v}</span></div>`).join('')}
      </div>
    </div>
  </div>`;
}

function renderCdUsageChart() {
  const c = DATA.customers.find(x => x.id === currentCustomerId);
  const ch = [{ month: 'T3/25', val: 19.2 }, { month: 'T4/25', val: 20.1 }, { month: 'T5/25', val: 22.4 }, { month: 'T6/25', val: 24.5 }, { month: 'T7/25', val: 23.8 }, { month: 'T8/25', val: 25.1 }, { month: 'T9/25', val: 22.0 }, { month: 'T10/25', val: 20.3 }, { month: 'T11/25', val: 19.8 }, { month: 'T12/25', val: 18.9 }, { month: 'T1/26', val: 17.5 }, { month: 'T2/26', val: c?.consumption || 18.5 }];
  const ctx = document.getElementById('cdUsageChart');
  if (!ctx) return;
  const mini = document.getElementById('cdMiniChart');
  if (mini) window.afterRender_customerdetail_overview();
  const cuPalette = getChartPalette();
  const cuGrid = hexToRgba(cuPalette.cyan, .05);
  new Chart(ctx, { type: 'bar', data: { labels: ch.map(x => x.month), datasets: [{ label: 'Tiêu thụ (m³)', data: ch.map(x => x.val), backgroundColor: ch.map(x => x.val > 22 ? hexToRgba(cuPalette.danger, .5) : hexToRgba(cuPalette.cyan, .45)), borderColor: ch.map(x => x.val > 22 ? cuPalette.danger : cuPalette.cyan), borderWidth: 1.5, borderRadius: 5 }, { label: 'Mức TB', data: Array(12).fill((ch.reduce((s, x) => s + x.val, 0) / 12).toFixed(1)), borderColor: hexToRgba(cuPalette.warning, .6), borderWidth: 1.5, type: 'line', pointRadius: 0, fill: false }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: cuPalette.textSecondary, font: { size: 11 } } } }, scales: { x: { ticks: { color: cuPalette.textMuted }, grid: { color: cuGrid } }, y: { ticks: { color: cuPalette.textMuted }, grid: { color: cuGrid } } } } });
}

function renderCdBilling(c, inv) {
  const total = inv.reduce((s, i) => s + i.amount, 0);
  const paid = inv.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  return `
  <div style="display:flex;gap:12px;margin-bottom:14px;flex-wrap:wrap">
    ${[['Tổng phát hành', formatNum(total) + ' đ', 'var(--text)'], ['Đã thu', formatNum(paid) + ' đ', 'var(--success)'], ['Còn nợ', formatNum(total - paid) + ' đ', 'var(--danger)']].map(([k, v, c]) => `
    <div class="card" style="padding:14px 20px;flex:1;min-width:160px"><div style="font-size:11px;color:var(--muted)">${k}</div><div style="font-size:20px;font-weight:700;color:${c};margin-top:4px">${v}</div></div>`).join('')}
  </div>
  <div class="card"><div class="table-wrap"><table>
    <thead><tr><th>Số HĐ</th><th>Kỳ</th><th>Tiêu thụ</th><th>Số tiền</th><th>Trạng thái</th><th>Phát hành</th><th>Thanh toán</th><th>Phương thức</th></tr></thead>
    <tbody>
      ${inv.length ? inv.map(i => `<tr>
        <td class="mono text-cyan" style="font-size:11px">${i.id}</td>
        <td>${i.period}</td>
        <td class="mono">${i.consumption} m³</td>
        <td class="mono" style="font-weight:600;color:${i.status === 'paid' ? 'var(--success)' : 'var(--warning)'}">${formatNum(i.amount)} đ</td>
        <td>${i.status === 'paid' ? '<span class="badge badge-green">Đã thu</span>' : i.status === 'partial' ? '<span class="badge badge-yellow">Một phần</span>' : '<span class="badge badge-red">Chưa thu</span>'}</td>
        <td class="mono" style="font-size:11px;color:var(--muted)">${i.issuedDate}</td>
        <td class="mono" style="font-size:11px;color:${i.paidDate !== '—' ? 'var(--success)' : 'var(--muted)'}">${i.paidDate}</td>
        <td style="font-size:12px;color:var(--muted)">${i.method}</td>
      </tr>`).join('') : `<tr><td colspan="8" style="text-align:center;color:var(--muted);padding:30px">Chưa có hóa đơn nào</td></tr>`}
    </tbody>
  </table></div></div>`;
}

function renderCdMeter(c, meter) {
  return `
  <div style="background:rgba(0,200,255,.06);border:1px solid rgba(0,200,255,.18);border-radius:10px;padding:13px 18px;margin-bottom:14px;font-size:13px">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> Dữ liệu ghi chỉ số từ ứng dụng Mobile — ảnh chụp đồng hồ lưu trữ tự động · AI kiểm tra dị thường
  </div>
  <div class="card"><div class="table-wrap"><table>
    <thead><tr><th>Mã đợt</th><th>Mã đồng hồ</th><th>Chỉ số cũ</th><th>Chỉ số mới</th><th>Tiêu thụ</th><th>Ngày đọc</th><th>Người đọc</th><th>Ảnh</th><th>Tình trạng</th></tr></thead>
    <tbody>
      ${meter.length ? meter.map(r => `<tr>
        <td class="mono text-cyan" style="font-size:11px">${r.id}</td>
        <td class="mono" style="font-size:11px;color:var(--muted)">${r.meter}</td>
        <td class="mono">${r.prevReading.toFixed(1)}</td>
        <td class="mono">${r.currReading.toFixed(1)}</td>
        <td class="mono" style="font-weight:700;color:${r.status === 'suspect' ? 'var(--danger)' : 'var(--success)'}">${r.consumption.toFixed(1)} m³</td>
        <td class="mono" style="font-size:12px;color:var(--muted)">${r.readDate}</td>
        <td style="font-size:12px;color:var(--muted)">${r.reader}</td>
        <td style="text-align:center">${r.photo ? '<span style="color:var(--success)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg></span>' : '<span style="color:var(--danger)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2.5" style="vertical-align:middle"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>'}</td>
        <td>${r.status === 'confirmed' ? '<span class="badge badge-green">Xác nhận</span>' : '<span class="badge badge-red">Nghi vấn <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>'}</td>
      </tr>`).join('') : `<tr><td colspan="9" style="text-align:center;color:var(--muted);padding:30px">Chưa có dữ liệu ghi chỉ số</td></tr>`}
    </tbody>
  </table></div></div>`;
}

function renderCdTickets(c, tickets, calls) {
  return `
  <div class="grid-2">
    <div class="card">
      <div class="card-header"><span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> Ticket hỗ trợ liên quan</span><button class="btn btn-ghost btn-sm" onclick="openNewTicket()">+ Tạo mới</button></div>
      <div class="card-body" style="padding:14px">
        ${tickets.map(t => `
        <div style="padding:12px;border:1px solid var(--border);border-radius:8px;margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
            <span style="font-size:13px;font-weight:600;flex:1">${t.title}</span>
            ${t.status === 'open' ? '<span class="badge badge-blue" style="font-size:10px">Mở</span>' : t.status === 'inprogress' ? '<span class="badge badge-yellow" style="font-size:10px">Xử lý</span>' : '<span class="badge badge-green" style="font-size:10px">Đóng</span>'}
          </div>
          <div style="font-size:11px;color:var(--muted)">${t.category} · Phụ trách: ${t.assignee}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:3px">${t.created}</div>
        </div>`).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.03 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg> Lịch sử cuộc gọi CSKH</span></div>
      <div class="card-body" style="padding:14px">
        ${calls.length ? calls.map(l => `
        <div style="padding:10px;border:1px solid var(--border);border-radius:8px;margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div style="font-size:12px;font-weight:600">${l.topic}</div>
            ${l.type === 'inbound' ? '<span class="badge badge-blue" style="font-size:10px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Đến</span>' : '<span class="badge badge-gray" style="font-size:10px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Đi</span>'}
          </div>
          <div style="font-size:11px;color:var(--muted);margin-top:4px">${l.agent} · ${l.duration} · ${l.time}</div>
        </div>`).join('') : `<div style="color:var(--muted);font-size:13px;text-align:center;padding:20px">Chưa có lịch sử cuộc gọi</div>`}
      </div>
    </div>
  </div>`;
}

function renderCdNotes(c) {
  const notes = [
    { date: '27/02/2026', author: 'Admin', content: 'Khách hàng phản ánh áp lực nước yếu vào buổi sáng. Đã chuyển đội kỹ thuật kiểm tra tuyến phân phối.' },
    { date: '15/01/2026', author: 'NV Phương (CSKH)', content: 'KH gọi hỏi về hóa đơn T12/2025, đã giải thích đủ. KH hài lòng.' },
    { date: '05/12/2025', author: 'Admin', content: 'Hợp đồng sắp hết hạn T3/2026. Cần liên hệ gia hạn trước 60 ngày.' },
  ];
  return `
  <div class="card" style="margin-bottom:14px">
    <div class="card-header"><span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Ghi chú lịch sử</span>
      <button class="btn btn-primary btn-sm" onclick="showToast('Đã lưu ghi chú mới!')">+ Thêm ghi chú</button>
    </div>
    <div class="card-body" style="padding:16px">
      <div style="margin-bottom:14px">
        <textarea class="form-control" rows="3" placeholder="Nhập ghi chú mới..."></textarea>
      </div>
      ${notes.map(n => `
      <div style="padding:12px 0;border-bottom:1px solid var(--border)">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:12px;font-weight:600;color:var(--primary)">${n.author}</span>
          <span style="font-size:11px;color:var(--muted);font-family:'Roboto Mono',monospace">${n.date}</span>
        </div>
        <p style="font-size:13px;color:var(--text-2);line-height:1.6">${n.content}</p>
      </div>`).join('')}
    </div>
  </div>

  <!-- Alert: contract expiry warning -->
  <div style="background:rgba(255,202,40,.08);border:1px solid rgba(255,202,40,.25);border-radius:10px;padding:14px 18px;display:flex;align-items:center;gap:14px">
    <div style="font-size:22px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
    <div>
      <div style="font-size:14px;font-weight:600;color:var(--warning)">Hợp đồng sắp hết hạn</div>
      <div style="font-size:13px;color:var(--muted);margin-top:3px">Hợp đồng ${c.contract} hết hạn ngày <strong>15/03/2026</strong> (còn 15 ngày). Cần liên hệ gia hạn.</div>
    </div>
    <button class="btn btn-ghost btn-sm" style="margin-left:auto;flex-shrink:0" onclick="showToast('Đang mở mẫu gia hạn hợp đồng...')">Gia hạn HĐ</button>
  </div>`;
}
