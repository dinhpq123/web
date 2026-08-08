// ── PCTT FUND — QUỸ PHÒNG CHỐNG THIÊN TAI ───────────────────────────
let fundTab = 'overview';

const FUND_DATA = {
  year: 2026,
  target: 185.0,  // tỷ VNĐ
  collected: 145.8,
  spent: 28.6,
  reserved: 12.4,
  balance: 104.8,
  prevYear: 168.5,

  districts: [
    { name: 'Ba Vì',       target: 18.5, collected: 15.8, spent: 3.2, lat: 21.12, lng: 105.40 },
    { name: 'Sơn Tây',    target: 12.0, collected: 11.8, spent: 1.5, lat: 21.13, lng: 105.50 },
    { name: 'Phúc Thọ',   target: 14.0, collected: 10.2, spent: 2.8, lat: 21.09, lng: 105.55 },
    { name: 'Đan Phượng', target: 10.5, collected: 9.8,  spent: 1.2, lat: 21.09, lng: 105.65 },
    { name: 'Hoài Đức',   target: 11.0, collected: 8.5,  spent: 0.8, lat: 20.99, lng: 105.69 },
    { name: 'Thạch Thất', target: 13.5, collected: 10.1, spent: 1.9, lat: 21.01, lng: 105.52 },
    { name: 'Quốc Oai',   target: 12.0, collected: 8.9,  spent: 1.4, lat: 20.95, lng: 105.58 },
    { name: 'Chương Mỹ',  target: 16.0, collected: 12.5, spent: 4.5, lat: 20.89, lng: 105.68 },
    { name: 'Thanh Oai',  target: 10.0, collected: 7.8,  spent: 1.0, lat: 20.88, lng: 105.77 },
    { name: 'Thường Tín', target: 9.5,  collected: 8.2,  spent: 0.9, lat: 20.86, lng: 105.86 },
    { name: 'Phú Xuyên',  target: 8.5,  collected: 6.4,  spent: 0.8, lat: 20.74, lng: 105.91 },
    { name: 'Ứng Hoà',    target: 8.0,  collected: 5.5,  spent: 1.1, lat: 20.69, lng: 105.80 },
    { name: 'Mỹ Đức',     target: 7.5,  collected: 5.2,  spent: 2.8, lat: 20.61, lng: 105.73 },
    { name: 'Đông Anh',   target: 18.0, collected: 18.0, spent: 3.0, lat: 21.15, lng: 105.86 },
    { name: 'Gia Lâm',    target: 16.0, collected: 14.2, spent: 2.5, lat: 21.00, lng: 105.94 },
  ],

  expenditures: [
    { id: 'CHI-001', category: 'infrastructure', desc: 'Gia cố mặt đê Hữu Đáy K22-K28', unit: 'Hạt QL Đê Mỹ Đức', amount: 8.5, date: '08/03/2026', status: 'approved', approvedBy: 'Chi cục trưởng' },
    { id: 'CHI-002', category: 'emergency',      desc: 'Hỗ trợ khẩn cấp thiệt hại bão số 2 H. Ba Vì', unit: 'UBND H. Ba Vì', amount: 5.2, date: '25/02/2026', status: 'approved', approvedBy: 'Chi cục trưởng' },
    { id: 'CHI-003', category: 'equipment',      desc: 'Mua rọ đá, bao tải dự phòng mùa lũ', unit: 'Phòng QLCT', amount: 2.8, date: '02/03/2026', status: 'approved', approvedBy: 'Phó Chi cục trưởng' },
    { id: 'CHI-004', category: 'training',       desc: 'Tập huấn hộ đê xung kích 30 xã Ba Vì', unit: 'Phòng Kỹ thuật', amount: 0.8, date: '15/02/2026', status: 'approved', approvedBy: 'Phó Chi cục trưởng' },
    { id: 'CHI-005', category: 'infrastructure', desc: 'Bảo dưỡng cống điều tiết Liên Mạc', unit: 'Đội vận hành', amount: 1.2, date: '10/03/2026', status: 'pending', approvedBy: '—' },
    { id: 'CHI-006', category: 'emergency',      desc: 'Mua xuồng cứu hộ dự phòng', unit: 'Phòng Vật tư', amount: 3.5, date: '12/03/2026', status: 'pending', approvedBy: '—' },
    { id: 'CHI-007', category: 'infrastructure', desc: 'Kè lát mái đê Ngọc Tảo K5-K8', unit: 'Hạt QL Đê Ba Vì', amount: 6.8, date: '05/03/2026', status: 'processing', approvedBy: 'Chi cục trưởng' },
  ],

  collections: [
    { id: 'THU-001', source: 'Ngân sách TP. Hà Nội', amount: 80.0, date: 'Q1/2026', type: 'budget' },
    { id: 'THU-002', source: 'Đóng góp doanh nghiệp Nhà nước', amount: 35.2, date: 'Q1/2026', type: 'enterprise' },
    { id: 'THU-003', source: 'Đóng góp hộ dân, hộ kinh doanh', amount: 18.4, date: 'Q1/2026', type: 'citizen' },
    { id: 'THU-004', source: 'Hỗ trợ Trung ương — Chương trình PCTT', amount: 12.2, date: '15/02/2026', type: 'central' },
  ],

  monthlyTrend: {
    labels: ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'],
    collected2026: [18.5, 22.4, 28.6, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    target2026:    [15.4, 15.4, 15.4, 15.4, 15.4, 15.4, 15.4, 15.4, 15.4, 15.4, 15.4, 15.4],
    spent2026:     [5.2, 8.1, 15.3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },

  categoryBudget: { infrastructure: 120.0, emergency: 30.0, equipment: 20.0, training: 8.0, other: 7.0 },
};

const FUND_CAT = {
  infrastructure: { label: 'Hạ tầng đê điều', color: '#00c8ff', badge: 'badge-blue' },
  emergency:      { label: 'Hỗ trợ khẩn cấp', color: '#ff3c50', badge: 'badge-red' },
  equipment:      { label: 'Trang thiết bị',   color: '#ff9800', badge: 'badge-yellow' },
  training:       { label: 'Tập huấn, đào tạo',color: 'var(--success)', badge: 'badge-green' },
  other:          { label: 'Khác',              color: '#2984EE', badge: 'badge-gray' },
};

let _fundCharts = {};
function _destroyFundCharts() {
  Object.values(_fundCharts).forEach(c => { try { c.destroy(); } catch(e){} });
  _fundCharts = {};
}

function renderPcttFund() {
  _destroyFundCharts();
  const f = FUND_DATA;
  const pct = (f.collected / f.target * 100).toFixed(1);
  const spentPct = (f.spent / f.collected * 100).toFixed(1);

  return `
  <div class="page-header">
    <div class="page-title">
      <h1>Quỹ Phòng chống Thiên tai</h1>
      <p>Quản lý thu nộp, tồn quỹ, kế hoạch chi và quyết toán khắc phục hậu quả thiên tai TP. Hà Nội</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-ghost btn-sm" onclick="exportFundPdf()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
        Báo cáo PDF
      </button>
      <button class="btn btn-ghost btn-sm" onclick="exportFundExcel()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/></svg>
        Xuất Excel
      </button>
      <button class="btn btn-outline btn-sm" onclick="openFundSpendModal()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Lập kế hoạch chi
      </button>
      <button class="btn btn-primary btn-sm" onclick="openFundCollectModal()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/></svg>
        Ghi nhận thu quỹ
      </button>
    </div>
  </div>

  <!-- KPI Row -->
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:20px">
    ${[
      { label:'Tổng tồn quỹ', val:`${f.balance.toFixed(1)} tỷ`, sub:`/năm ${f.year}`, color:'var(--primary)' },
      { label:'Đã thu (YTD)', val:`${f.collected.toFixed(1)} tỷ`, sub:`${pct}% kế hoạch`, color:'var(--success)' },
      { label:'Đã chi (YTD)', val:`${f.spent.toFixed(1)} tỷ`, sub:`${spentPct}% số thu`, color:'var(--warning)' },
      { label:'Dự phòng khẩn cấp', val:`${f.reserved.toFixed(1)} tỷ`, sub:'Sẵn sàng điều động', color:'var(--orange)' },
      { label:'Kế hoạch năm', val:`${f.target.toFixed(1)} tỷ`, sub:`Còn thiếu: ${(f.target-f.collected).toFixed(1)} tỷ`, color:'var(--muted)' },
    ].map(k=>`
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:16px 18px">
      <div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">${k.label}</div>
      <div style="font-size:24px;font-weight:800;color:${k.color}">${k.val}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:4px">${k.sub}</div>
    </div>`).join('')}
  </div>

  <!-- Tabs -->
  <div class="tabs" style="margin-bottom:20px">
    <button class="tab-btn ${fundTab==='overview'?'active':''}" onclick="switchFundTab('overview')">Tổng quan</button>
    <button class="tab-btn ${fundTab==='districts'?'active':''}" onclick="switchFundTab('districts')">Tiến độ địa bàn</button>
    <button class="tab-btn ${fundTab==='expenditure'?'active':''}" onclick="switchFundTab('expenditure')">Kế hoạch chi</button>
    <button class="tab-btn ${fundTab==='collection'?'active':''}" onclick="switchFundTab('collection')">Nguồn thu</button>
  </div>

  <div id="fundTabContent">${_renderFundTab()}</div>`;
}

function _renderFundTab() {
  const f = FUND_DATA;
  if (fundTab === 'overview') {
    return `
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-bottom:20px">
      <div class="card">
        <div class="card-header"><span class="card-title">Thu - Chi Quỹ PCTT theo tháng (tỷ VNĐ)</span></div>
        <div style="padding:16px"><canvas id="fundMonthlyChart" height="220"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Cơ cấu Kế hoạch Chi</span></div>
        <div style="padding:16px"><canvas id="fundCatChart" height="220"></canvas></div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div class="card" style="padding:0">
        <div class="card-header"><span class="card-title">Tiến độ thu theo địa bàn (Top 8)</span></div>
        <div style="padding:16px">
          ${f.districts.slice(0,8).map(d => {
            const pct = Math.round(d.collected/d.target*100);
            const color = pct>=95?'var(--success)':pct>=70?'var(--primary)':pct>=50?'var(--warning)':'var(--danger)';
            return `<div style="margin-bottom:12px">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <span style="font-size:12px;font-weight:600">${d.name}</span>
                <span style="font-size:11px;color:${color}">${d.collected}/${d.target} tỷ (${pct}%)</span>
              </div>
              <div class="progress-bar" style="height:7px"><div class="progress-fill" style="width:${pct}%;background:${color}"></div></div>
            </div>`;
          }).join('')}
        </div>
      </div>
      <div class="card" style="padding:0">
        <div class="card-header"><span class="card-title">Chi phí khẩn cấp gần đây</span></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Mô tả</th><th>Đơn vị</th><th>Số tiền (tỷ)</th><th>Trạng thái</th></tr></thead>
            <tbody>
              ${f.expenditures.slice(0,5).map(e=>`<tr>
                <td style="font-size:12px">${e.desc}</td>
                <td style="font-size:11px;color:var(--muted)">${e.unit}</td>
                <td class="mono" style="color:var(--warning);font-weight:700">${e.amount.toFixed(1)}</td>
                <td>${statusBadge(e.status)}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
  }

  if (fundTab === 'districts') {
    return `
    <div class="card" style="padding:0">
      <div class="card-header">
        <span class="card-title">Tiến độ thu nộp Quỹ PCTT theo Quận/Huyện — Năm ${f.year}</span>
        <button class="btn btn-ghost btn-sm" onclick="exportFundExcel()">Xuất Excel</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Quận/Huyện</th><th>KH Thu (tỷ)</th><th>Đã thu (tỷ)</th><th>Đã chi (tỷ)</th><th>Tồn (tỷ)</th><th>Tiến độ</th><th>Trạng thái</th></tr></thead>
          <tbody>
            ${f.districts.map(d=>{
              const pct=Math.round(d.collected/d.target*100);
              const bal=(d.collected-d.spent).toFixed(1);
              const color=pct>=95?'var(--success)':pct>=70?'var(--primary)':pct>=50?'var(--warning)':'var(--danger)';
              const badge=pct>=95?'badge-green':pct>=70?'badge-blue':pct>=50?'badge-yellow':'badge-red';
              return `<tr>
                <td style="font-weight:600">${d.name}</td>
                <td class="mono">${d.target}</td>
                <td class="mono" style="color:var(--success);font-weight:700">${d.collected}</td>
                <td class="mono" style="color:var(--warning)">${d.spent}</td>
                <td class="mono" style="color:var(--primary)">${bal}</td>
                <td style="min-width:140px">
                  <div style="display:flex;align-items:center;gap:8px">
                    <div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${pct}%;background:${color}"></div></div>
                    <span style="font-size:12px;font-weight:700;width:34px">${pct}%</span>
                  </div>
                </td>
                <td><span class="badge ${badge}">${pct>=100?'Đạt KH':pct>=70?'Đang thu':pct>=50?'Chậm':'Thiếu nhiều'}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card-header"><span class="card-title">Biểu đồ so sánh thu theo địa bàn</span></div>
      <div style="padding:16px"><canvas id="fundDistrictChart" height="200"></canvas></div>
    </div>`;
  }

  if (fundTab === 'expenditure') {
    const totalApproved = f.expenditures.filter(e=>e.status==='approved').reduce((s,e)=>s+e.amount,0);
    const totalPending  = f.expenditures.filter(e=>e.status==='pending').reduce((s,e)=>s+e.amount,0);
    return `
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px">
      ${[
        { label:'Tổng dự toán', val:`${Object.values(f.categoryBudget).reduce((a,b)=>a+b,0).toFixed(0)} tỷ`, color:'var(--primary)' },
        { label:'Đã phê duyệt', val:`${totalApproved.toFixed(1)} tỷ`, color:'var(--success)' },
        { label:'Chờ phê duyệt', val:`${totalPending.toFixed(1)} tỷ`, color:'var(--warning)' },
        { label:'Số khoản chi', val:f.expenditures.length, color:'var(--muted)' },
      ].map(k=>`<div class="card kpi-card"><div class="kpi-label">${k.label}</div><div class="kpi-value" style="color:${k.color}">${k.val}</div></div>`).join('')}
    </div>
    <div class="card" style="padding:0">
      <div class="card-header">
        <span class="card-title">Danh sách khoản chi Quỹ PCTT</span>
        <button class="btn btn-primary btn-sm" onclick="openFundSpendModal()">+ Thêm khoản chi</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Mã</th><th>Nội dung</th><th>Hạng mục</th><th>Đơn vị</th><th>Số tiền (tỷ)</th><th>Ngày</th><th>Người duyệt</th><th>Trạng thái</th><th></th></tr></thead>
          <tbody>
            ${f.expenditures.map(e=>`<tr>
              <td class="mono" style="color:var(--primary);font-size:11px">${e.id}</td>
              <td style="font-size:12px;max-width:200px">${e.desc}</td>
              <td><span class="badge ${FUND_CAT[e.category]?.badge||'badge-gray'}" style="font-size:10px">${FUND_CAT[e.category]?.label||e.category}</span></td>
              <td style="font-size:11px;color:var(--muted)">${e.unit}</td>
              <td class="mono" style="font-weight:700;color:var(--warning)">${e.amount.toFixed(1)}</td>
              <td style="font-size:12px">${e.date}</td>
              <td style="font-size:11px;color:var(--muted)">${e.approvedBy}</td>
              <td>${statusBadge(e.status)}</td>
              <td>
                ${e.status==='pending'?`<div style="display:flex;gap:4px">
                  <button class="btn btn-sm" style="font-size:10px;background:rgba(41,132,238,.1);color:var(--success);border:1px solid rgba(41,132,238,.25)" onclick="approveFundItem('${e.id}')">Duyệt</button>
                  <button class="btn btn-ghost btn-xs" style="color:var(--danger)" onclick="rejectFundItem('${e.id}')">Từ chối</button>
                </div>`:`<button class="btn btn-ghost btn-xs" onclick="viewFundExpDetail('${e.id}')">Xem</button>`}
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  if (fundTab === 'collection') {
    return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div class="card" style="padding:0">
        <div class="card-header">
          <span class="card-title">Nguồn thu Quỹ PCTT năm ${f.year}</span>
          <button class="btn btn-primary btn-sm" onclick="openFundCollectModal()">+ Ghi nhận thu</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Nguồn đóng góp</th><th>Số tiền (tỷ)</th><th>Thời điểm</th><th>Loại</th></tr></thead>
            <tbody>
              ${f.collections.map(c=>`<tr>
                <td style="font-weight:600;font-size:13px">${c.source}</td>
                <td class="mono" style="color:var(--success);font-weight:700">${c.amount.toFixed(1)}</td>
                <td style="font-size:12px;color:var(--muted)">${c.date}</td>
                <td><span class="badge ${c.type==='budget'?'badge-blue':c.type==='enterprise'?'badge-cyan':c.type==='central'?'badge-green':'badge-gray'}" style="font-size:10px">
                  ${c.type==='budget'?'NSNN':c.type==='enterprise'?'Doanh nghiệp':c.type==='central'?'Trung ương':'Hộ dân'}
                </span></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div style="padding:14px 16px;border-top:1px solid var(--border);display:flex;justify-content:space-between">
          <span style="font-size:13px;color:var(--muted)">Tổng thu</span>
          <span style="font-size:16px;font-weight:800;color:var(--success)">${f.collected.toFixed(1)} tỷ VNĐ</span>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Cơ cấu nguồn thu</span></div>
        <div style="padding:16px"><canvas id="fundSourceChart" height="240"></canvas></div>
      </div>
    </div>`;
  }
  return '';
}

window.afterRender_pcttFund = function() { setTimeout(_renderFundCharts, 80); };

function switchFundTab(tab) {
  fundTab = tab;
  _destroyFundCharts();
  const el = document.getElementById('fundTabContent');
  if (el) { el.innerHTML = _renderFundTab(); setTimeout(_renderFundCharts, 80); }
  document.querySelectorAll('.tab-btn').forEach(b=>{
    b.classList.toggle('active', b.textContent.trim() === {overview:'Tổng quan',districts:'Tiến độ địa bàn',expenditure:'Kế hoạch chi',collection:'Nguồn thu'}[tab]);
  });
}

function _renderFundCharts() {
  if (typeof Chart === 'undefined') return;
  const f = FUND_DATA;
  const palette = getChartPalette();
  const def = { color: palette.textMuted, grid: hexToRgba(palette.cyan, .06), font:"'Inter',sans-serif" };
  const ax = () => ({ ticks:{color:def.color,font:{family:def.font,size:10}}, grid:{color:def.grid} });

  const mk = (id, cfg) => {
    const el = document.getElementById(id); if (!el) return;
    try { if(_fundCharts[id]) _fundCharts[id].destroy(); _fundCharts[id] = new Chart(el.getContext('2d'), cfg); } catch(e){}
  };

  if (fundTab==='overview') {
    mk('fundMonthlyChart', { type:'bar', data:{
      labels: f.monthlyTrend.labels,
      datasets:[
        { type:'bar', label:'Đã thu (tỷ)', data:f.monthlyTrend.collected2026, backgroundColor:hexToRgba(palette.cyan,.5), borderColor:palette.cyan, borderWidth:1.5, borderRadius:4 },
        { type:'bar', label:'Đã chi (tỷ)', data:f.monthlyTrend.spent2026, backgroundColor:hexToRgba(palette.warning,.4), borderColor:palette.warning, borderWidth:1.5, borderRadius:4 },
        { type:'line', label:'Kế hoạch thu (tỷ/tháng)', data:f.monthlyTrend.target2026, borderColor:hexToRgba(palette.success,.6), borderWidth:1.5, borderDash:[5,4], pointRadius:0, fill:false },
      ]
    }, options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{labels:{color:def.color,font:{family:def.font,size:11}}}}, scales:{x:ax(),y:{...ax(),beginAtZero:true}} } });

    mk('fundCatChart', { type:'doughnut', data:{
      labels: Object.values(FUND_CAT).map(c=>c.label),
      datasets:[{ data:Object.values(f.categoryBudget), backgroundColor:Object.values(FUND_CAT).map(c=>c.color+'cc'), borderWidth:0, hoverOffset:8 }]
    }, options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom',labels:{color:def.color,font:{family:def.font,size:10},padding:8}}} } });
  }

  if (fundTab==='districts') {
    mk('fundDistrictChart', { type:'bar', data:{
      labels: f.districts.map(d=>d.name),
      datasets:[
        { label:'Kế hoạch (tỷ)', data:f.districts.map(d=>d.target), backgroundColor:hexToRgba(palette.border,.3), borderColor:palette.border, borderWidth:1, borderRadius:3 },
        { label:'Đã thu (tỷ)', data:f.districts.map(d=>d.collected), backgroundColor:f.districts.map(d=>d.collected>=d.target?hexToRgba(palette.success,.6):hexToRgba(palette.cyan,.55)), borderColor:f.districts.map(d=>d.collected>=d.target?palette.success:palette.cyan), borderWidth:1.5, borderRadius:3 },
      ]
    }, options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{labels:{color:def.color,font:{family:def.font,size:11}}}}, scales:{x:{...ax(),ticks:{...ax().ticks,maxRotation:40}},y:{...ax(),beginAtZero:true}} } });
  }

  if (fundTab==='collection') {
    mk('fundSourceChart', { type:'pie', data:{
      labels: ['Ngân sách TP','Doanh nghiệp NN','Hộ dân/KD','Hỗ trợ Trung ương'],
      datasets:[{ data:f.collections.map(c=>c.amount), backgroundColor:['#00c8ff','#ff9800','var(--success)','#2984EE'], borderWidth:0, hoverOffset:8 }]
    }, options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom',labels:{color:def.color,font:{family:def.font,size:11},padding:12}}} } });
  }
}

// ── MODALS ─────────────────────────────────────────────────────────
window.openFundSpendModal = function() {
  openModal(`
  <div class="modal-header">
    <span class="modal-title">Lập kế hoạch chi Quỹ PCTT</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body">
    <div class="form-group"><label class="form-label">Nội dung chi <span style="color:var(--danger)">*</span></label>
      <textarea id="fSpendDesc" class="form-control" rows="2" placeholder="Mô tả chi tiết khoản chi..."></textarea></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Hạng mục</label>
        <select id="fSpendCat" class="form-control">
          ${Object.entries(FUND_CAT).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}
        </select></div>
      <div class="form-group"><label class="form-label">Số tiền (tỷ VNĐ) <span style="color:var(--danger)">*</span></label>
        <input id="fSpendAmt" type="number" step="0.1" min="0" class="form-control" placeholder="0.0"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Đơn vị thụ hưởng</label>
        <input id="fSpendUnit" class="form-control" placeholder="Tên đơn vị"></div>
      <div class="form-group"><label class="form-label">Ngày dự kiến</label>
        <input id="fSpendDate" type="date" class="form-control" value="${new Date().toISOString().slice(0,10)}"></div>
    </div>
    <div class="form-group"><label class="form-label">Căn cứ / Ghi chú</label>
      <textarea id="fSpendNote" class="form-control" rows="2" placeholder="Điều khoản pháp lý, quyết định UBND..."></textarea></div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="saveFundSpend()">Trình phê duyệt</button>
  </div>`);
};

window.saveFundSpend = function() {
  const desc = document.getElementById('fSpendDesc')?.value?.trim();
  const amt  = parseFloat(document.getElementById('fSpendAmt')?.value);
  if (!desc || isNaN(amt) || amt <= 0) { showToast('⚠ Vui lòng điền đầy đủ thông tin!'); return; }
  const newId = 'CHI-' + String(FUND_DATA.expenditures.length + 1).padStart(3,'0');
  FUND_DATA.expenditures.push({
    id: newId, category: document.getElementById('fSpendCat')?.value || 'other',
    desc, unit: document.getElementById('fSpendUnit')?.value || '—', amount: amt,
    date: document.getElementById('fSpendDate')?.value || new Date().toLocaleDateString('vi-VN'),
    status: 'pending', approvedBy: '—',
  });
  closeModal(); navigate('pcttFund'); showToast(`✅ Đã tạo khoản chi ${newId} — đang chờ phê duyệt!`);
};

window.openFundCollectModal = function() {
  openModal(`
  <div class="modal-header">
    <span class="modal-title">Ghi nhận thu Quỹ PCTT</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body">
    <div class="form-group"><label class="form-label">Nguồn đóng góp <span style="color:var(--danger)">*</span></label>
      <input id="fColSrc" class="form-control" placeholder="Tên tổ chức/cá nhân đóng góp"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Loại nguồn</label>
        <select id="fColType" class="form-control">
          <option value="budget">Ngân sách nhà nước</option>
          <option value="enterprise">Doanh nghiệp Nhà nước</option>
          <option value="citizen">Hộ dân / Hộ kinh doanh</option>
          <option value="central">Hỗ trợ Trung ương</option>
          <option value="other">Khác</option>
        </select></div>
      <div class="form-group"><label class="form-label">Số tiền (tỷ VNĐ) <span style="color:var(--danger)">*</span></label>
        <input id="fColAmt" type="number" step="0.01" min="0" class="form-control" placeholder="0.00"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Địa bàn thu</label>
        <select id="fColDistrict" class="form-control">
          <option value="">-- Toàn TP --</option>
          ${FUND_DATA.districts.map(d=>`<option value="${d.name}">${d.name}</option>`).join('')}
        </select></div>
      <div class="form-group"><label class="form-label">Ngày nhận</label>
        <input id="fColDate" type="date" class="form-control" value="${new Date().toISOString().slice(0,10)}"></div>
    </div>
    <div class="form-group"><label class="form-label">Ghi chú / Biên lai</label>
      <input id="fColNote" class="form-control" placeholder="Số biên lai, tài khoản ngân hàng..."></div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="saveFundCollect()">Ghi nhận</button>
  </div>`);
};

window.saveFundCollect = function() {
  const src = document.getElementById('fColSrc')?.value?.trim();
  const amt = parseFloat(document.getElementById('fColAmt')?.value);
  if (!src || isNaN(amt) || amt <= 0) { showToast('⚠ Vui lòng điền đầy đủ!'); return; }
  FUND_DATA.collected += amt; FUND_DATA.balance += amt;
  const newId = 'THU-' + String(FUND_DATA.collections.length + 1).padStart(3,'0');
  FUND_DATA.collections.unshift({ id:newId, source:src, amount:amt, date:new Date().toLocaleDateString('vi-VN'), type:document.getElementById('fColType')?.value||'other' });
  closeModal(); navigate('pcttFund'); showToast(`✅ Đã ghi nhận thu ${amt.toFixed(2)} tỷ từ ${src}!`);
};

window.approveFundItem = function(id) {
  const item = FUND_DATA.expenditures.find(e=>e.id===id);
  if (item) { item.status='approved'; item.approvedBy='Chi cục trưởng'; navigate('pcttFund'); showToast(`✅ Đã phê duyệt khoản chi ${id}!`); }
};
window.rejectFundItem = function(id) {
  const item = FUND_DATA.expenditures.find(e=>e.id===id);
  if (item) { item.status='rejected'; navigate('pcttFund'); showToast(`❌ Đã từ chối khoản chi ${id}!`); }
};
window.viewFundExpDetail = function(id) {
  const e = FUND_DATA.expenditures.find(x=>x.id===id); if (!e) return;
  openModal(`
  <div class="modal-header"><span class="modal-title">${e.id} — Chi tiết khoản chi</span>
  <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      ${[{l:'Mã khoản chi',v:e.id},{l:'Hạng mục',v:FUND_CAT[e.category]?.label||e.category},{l:'Số tiền',v:e.amount.toFixed(2)+' tỷ VNĐ'},{l:'Ngày',v:e.date},{l:'Đơn vị',v:e.unit},{l:'Người phê duyệt',v:e.approvedBy}].map(f=>`
      <div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px;padding:12px">
        <div style="font-size:10px;color:var(--muted)">${f.l}</div>
        <div style="font-size:13px;font-weight:600;margin-top:4px">${f.v}</div>
      </div>`).join('')}
    </div>
    <div class="form-group" style="margin-top:14px"><label class="form-label">Nội dung chi</label>
      <div style="padding:12px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px;font-size:13px">${e.desc}</div></div>
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Đóng</button></div>`);
};

window.exportFundPdf = function() {
  showToast('📄 Đang tạo báo cáo PDF Quỹ PCTT...');
  setTimeout(() => {
    const f = FUND_DATA;
    window.HADIWA_EXPORT?.print('BÁO CÁO QUỸ PHÒNG CHỐNG THIÊN TAI',
      `<h2>I. TỔNG QUAN QUỸ PCTT NĂM ${f.year}</h2>
      <table><thead><tr><th>Chỉ tiêu</th><th>Giá trị</th></tr></thead><tbody>
        <tr><td>Kế hoạch thu</td><td>${f.target.toFixed(1)} tỷ VNĐ</td></tr>
        <tr><td>Đã thu (YTD)</td><td>${f.collected.toFixed(1)} tỷ VNĐ (${(f.collected/f.target*100).toFixed(1)}%)</td></tr>
        <tr><td>Đã chi (YTD)</td><td>${f.spent.toFixed(1)} tỷ VNĐ</td></tr>
        <tr><td>Tồn quỹ</td><td>${f.balance.toFixed(1)} tỷ VNĐ</td></tr>
      </tbody></table>
      <h2>II. TIẾN ĐỘ THU THEO ĐỊA BÀN</h2>
      <table><thead><tr><th>Quận/Huyện</th><th>KH Thu (tỷ)</th><th>Đã thu (tỷ)</th><th>Tỷ lệ</th></tr></thead><tbody>
        ${f.districts.map(d=>`<tr><td>${d.name}</td><td>${d.target}</td><td>${d.collected}</td><td>${Math.round(d.collected/d.target*100)}%</td></tr>`).join('')}
      </tbody></table>`, 'Chi cục Thủy lợi & PCTT Hà Nội — Năm ' + f.year);
  }, 600);
};

window.exportFundExcel = function() {
  showToast('📊 Đang xuất Excel Quỹ PCTT...');
  setTimeout(() => {
    const f = FUND_DATA;
    window.HADIWA_EXPORT?.csv(`QuyCPCTT_${f.year}_${new Date().toISOString().slice(0,10)}.csv`, [
      ['BÁO CÁO QUỸ PCTT — NĂM ' + f.year],
      ['KH Thu (tỷ)', 'Đã thu (tỷ)', 'Đã chi (tỷ)', 'Tồn quỹ (tỷ)'],
      [f.target, f.collected, f.spent, f.balance],
      [],
      ['TIẾN ĐỘ THU THEO ĐỊA BÀN'],
      ['Quận/Huyện','KH Thu (tỷ)','Đã thu (tỷ)','Đã chi (tỷ)','Tỷ lệ (%)'],
      ...f.districts.map(d=>[d.name, d.target, d.collected, d.spent, Math.round(d.collected/d.target*100)+'%']),
      [],
      ['DANH SÁCH KHOẢN CHI'],
      ['Mã','Nội dung','Hạng mục','Đơn vị','Số tiền (tỷ)','Ngày','Trạng thái'],
      ...f.expenditures.map(e=>[e.id, e.desc, FUND_CAT[e.category]?.label||e.category, e.unit, e.amount, e.date, e.status]),
    ]);
  }, 400);
};
