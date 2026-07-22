// ── HADIWA IOC — Reservoir Monitoring v5.4 ───────────────────────
// Full reservoir dashboard: water levels, capacity %, gate control,
// release events history, safety inspection, water storage plans

let rsvTab = 'overview';

// ── Mock data: Kiểm định An toàn Đập / Hồ chứa ─────────────────────
const RSV_INSPECTIONS = [
  {
    reservoir: 'Hồ Tuy Lai', id: 'HT-001',
    inspections: [
      { cycle: 'Lần 3 (2025)', date: '20/11/2025', unit: 'Viện Thủy lợi VN', result: 'An toàn', conclusion: 'Công trình an toàn, được phép tch nước lên cao trình thiết kế.', qdDate: '05/12/2025', qdNum: 'QD-2025-118', nextCycle: '11/2028', status: 'ok' },
      { cycle: 'Lần 2 (2020)', date: '15/10/2020', unit: 'Công ty Kiểm định C1', result: 'An toàn', conclusion: 'An toàn, không phát hiện vết nứt hay thấm lận.', qdDate: '30/10/2020', qdNum: 'QD-2020-87', nextCycle: '10/2025', status: 'ok' },
    ]
  },
  {
    reservoir: 'Hồ Đồng Mô', id: 'HT-002',
    inspections: [
      { cycle: 'Lần 4 (2024)', date: '10/08/2024', unit: 'Viện Thủy lợi VN', result: 'Cần theo dõi', conclusion: 'Phát hiện thấm nhẹ tại thân đập phụ, cần đo kiểm tra định kỳ.', qdDate: '25/08/2024', qdNum: 'QD-2024-203', nextCycle: '08/2027', status: 'warning' },
      { cycle: 'Lần 3 (2019)', date: '05/07/2019', unit: 'Công ty Tư vấn TL Trung Nam', result: 'An toàn', conclusion: 'Kết cấu công trình tốt, đầy đủ điều kiện tch nước.', qdDate: '20/07/2019', qdNum: 'QD-2019-156', nextCycle: '07/2024', status: 'ok' },
    ]
  },
  {
    reservoir: 'Hồ Suối Hai', id: 'HT-003',
    inspections: [
      { cycle: 'Lần 5 (2026 — sắp tới)', date: '—', unit: '—', result: 'Chưa thực hiện', conclusion: 'Đến hạn kiểm định tháng 04/2026.', qdDate: '—', qdNum: '—', nextCycle: '04/2026', status: 'overdue' },
      { cycle: 'Lần 4 (2021)', date: '12/09/2021', unit: 'Viện Thủy lợi VN', result: 'An toàn', conclusion: 'Hồ chứa lớn, cần tăng cường giám sát trong mùa lũ.', qdDate: '28/09/2021', qdNum: 'QD-2021-244', nextCycle: '09/2026', status: 'ok' },
    ]
  },
  {
    reservoir: 'Hồ Quan Sơn', id: 'HT-004',
    inspections: [
      { cycle: 'Lần 3 (2024)', date: '20/06/2024', unit: 'Công ty Kiểm định C1', result: 'An toàn', conclusion: 'Công trình vẫn giữ tốt. Không có dấu hiệu xuống cấp.', qdDate: '05/07/2024', qdNum: 'QD-2024-178', nextCycle: '06/2027', status: 'ok' },
    ]
  },
  {
    reservoir: 'Hồ Vài Người', id: 'HT-005',
    inspections: [
      { cycle: 'Lần 2 (2022 — quá hạn!)', date: '10/05/2022', unit: 'Công ty Tư vấn ĐH Thủy lợi', result: 'Cánh báo nguy hiểm', conclusion: 'Phát hiện lún, lếch tại mặt đập phụ. KIẾN NGHỊ: Sửa chữa khẩn cấp và kiểm định lại trong vòng 6 tháng.', qdDate: '25/05/2022', qdNum: 'QD-2022-95', nextCycle: '11/2022', status: 'overdue' },
    ]
  },
];

// ── Mock data: Phương án Tích nước ────────────────────────────────────
const RSV_WATER_PLANS = [
  {
    id:'HT-001', name:'Hồ Tuy Lai', qdNum:'QD-2025-88', qdDate:'15/05/2025',
    designLevel:21.8, deadLevel:16.0, normalLevel:21.0,
    monthly: [
      {m:'T1',max:20.8,safe:21.0},{m:'T2',max:20.5,safe:20.8},{m:'T3',max:20.2,safe:20.5},
      {m:'T4',max:20.0,safe:20.2},{m:'T5',max:20.5,safe:21.0},{m:'T6',max:21.0,safe:21.3},
      {m:'T7',max:21.3,safe:21.5},{m:'T8',max:21.5,safe:21.8},{m:'T9',max:21.8,safe:21.8},
      {m:'T10',max:21.5,safe:21.8},{m:'T11',max:21.2,safe:21.5},{m:'T12',max:21.0,safe:21.2},
    ]
  },
  {
    id:'HT-002', name:'Hồ Đồng Mô', qdNum:'QD-2024-142', qdDate:'10/06/2024',
    designLevel:16.5, deadLevel:10.5, normalLevel:15.0,
    monthly: [
      {m:'T1',max:14.8,safe:15.0},{m:'T2',max:14.5,safe:14.8},{m:'T3',max:14.2,safe:14.5},
      {m:'T4',max:14.0,safe:14.5},{m:'T5',max:14.8,safe:15.5},{m:'T6',max:15.5,safe:16.0},
      {m:'T7',max:16.0,safe:16.2},{m:'T8',max:16.2,safe:16.5},{m:'T9',max:16.3,safe:16.5},
      {m:'T10',max:16.0,safe:16.3},{m:'T11',max:15.5,safe:16.0},{m:'T12',max:15.0,safe:15.5},
    ]
  },
  {
    id:'HT-003', name:'Hồ Suối Hai', qdNum:'QD-2023-201', qdDate:'20/04/2023',
    designLevel:18.7, deadLevel:12.0, normalLevel:17.5,
    monthly:[
      {m:'T1',max:17.2,safe:17.5},{m:'T2',max:16.8,safe:17.2},{m:'T3',max:16.5,safe:17.0},
      {m:'T4',max:16.8,safe:17.5},{m:'T5',max:17.5,safe:18.0},{m:'T6',max:18.0,safe:18.5},
      {m:'T7',max:18.3,safe:18.6},{m:'T8',max:18.5,safe:18.7},{m:'T9',max:18.6,safe:18.7},
      {m:'T10',max:18.2,safe:18.5},{m:'T11',max:17.8,safe:18.2},{m:'T12',max:17.5,safe:17.8},
    ]
  },
];

const RSV_DATA = [
  {
    id:'HT-001', name:'Hồ Tuy Lai', district:'H. Ba Vì',
    capacity:4.2, current:3.95, designLevel:21.8, currentLevel:21.45,
    normalLevel:21.0, warnL1:21.5, warnL2:22.0, warnL3:22.5,
    gates:3, gatesOpen:1, gateFlow:85, // m³/s
    status:'warning', manager:'Nguyễn Minh Tân',
    inflow:120, outflow:85, downstreamRiver:'Suối Ba Vì',
    lastRelease:'12/03/2026 05:00', catchment:42.5, // km²
    purpose:'Tưới tiêu + Cắt lũ',
    yearBuilt:1985,
  },
  {
    id:'HT-002', name:'Hồ Đồng Mô', district:'Thị xã Sơn Tây',
    capacity:8.6, current:7.2, designLevel:16.5, currentLevel:15.8,
    normalLevel:15.0, warnL1:16.0, warnL2:16.5, warnL3:17.0,
    gates:2, gatesOpen:0, gateFlow:0,
    status:'ok', manager:'Trần Thị Lan',
    inflow:45, outflow:20, downstreamRiver:'Sông Tích',
    lastRelease:'08/03/2026 14:00', catchment:88, purpose:'Du lịch + Tưới tiêu',
    yearBuilt:1974,
  },
  {
    id:'HT-003', name:'Hồ Suối Hai', district:'H. Ba Vì',
    capacity:47.5, current:43.2, designLevel:18.7, currentLevel:18.1,
    normalLevel:17.5, warnL1:18.0, warnL2:18.5, warnL3:19.0,
    gates:4, gatesOpen:2, gateFlow:145,
    status:'danger', manager:'Phạm Văn Đức',
    inflow:185, outflow:145, downstreamRiver:'Sông Tích',
    lastRelease:'13/03/2026 02:00', catchment:122, purpose:'Tưới tiêu + Cắt lũ',
    yearBuilt:1963,
  },
  {
    id:'HT-004', name:'Hồ Quan Sơn', district:'H. Mỹ Đức',
    capacity:19.8, current:16.4, designLevel:12.5, currentLevel:11.8,
    normalLevel:11.0, warnL1:11.5, warnL2:12.0, warnL3:12.5,
    gates:2, gatesOpen:0, gateFlow:0,
    status:'ok', manager:'Vũ Thị Hoa',
    inflow:60, outflow:25, downstreamRiver:'Sông Đáy (chi lưu)',
    lastRelease:'05/03/2026 10:00', catchment:56, purpose:'Tưới tiêu + Sinh thái',
    yearBuilt:1998,
  },
  {
    id:'HT-005', name:'Hồ Vai Người', district:'H. Chương Mỹ',
    capacity:2.1, current:2.08, designLevel:8.4, currentLevel:8.38,
    normalLevel:7.8, warnL1:8.0, warnL2:8.2, warnL3:8.4,
    gates:1, gatesOpen:0, gateFlow:0,
    status:'critical', manager:'Trần Quang Hải',
    inflow:38, outflow:0, downstreamRiver:'Sông Bùi',
    lastRelease:'—', catchment:18, purpose:'Tưới tiêu',
    yearBuilt:1990,
  },
];

const RSV_EVENTS = [
  { time:'13/03/2026 02:00', reservoir:'Hồ Suối Hai', type:'release', action:'Mở 2 cửa van xả bổ sung', flow:'145 m³/s', trigger:'Mực nước vượt MN điều tiết 0.6m', operator:'KTV Nguyễn Văn Bảo' },
  { time:'12/03/2026 05:00', reservoir:'Hồ Tuy Lai',  type:'release', action:'Mở cửa van xả lũ số 1',   flow:'85 m³/s',  trigger:'Mực nước 21.45m, dự báo tiếp tục tăng', operator:'KTV Trần Minh Dũng' },
  { time:'10/03/2026 18:00', reservoir:'Hồ Suối Hai', type:'close',   action:'Đóng 1 cửa van xả',      flow:'80 m³/s',  trigger:'Mưa ngừng, mực nước giảm', operator:'KTV Lê Thị Mai' },
  { time:'08/03/2026 14:00', reservoir:'Hồ Đồng Mô',  type:'release', action:'Xả điều tiết qua tràn',  flow:'45 m³/s',  trigger:'Kiểm định định kỳ', operator:'KTV Phạm Văn An' },
  { time:'05/03/2026 10:00', reservoir:'Hồ Quan Sơn', type:'close',   action:'Đóng toàn bộ van xả',    flow:'0 m³/s',   trigger:'Mực nước về mức bình thường', operator:'KTV Vũ Thị Hoa' },
];

function renderReservoirMonitor() {
  const totalCap = RSV_DATA.reduce((s,r)=>s+r.capacity,0);
  const totalCur = RSV_DATA.reduce((s,r)=>s+r.current,0);
  const releasing = RSV_DATA.filter(r=>r.gatesOpen>0).length;
  const dangerous = RSV_DATA.filter(r=>r.status==='danger'||r.status==='critical').length;

  return `
<style>
.rsv-page{padding:18px 22px;max-width:1280px;margin:0 auto}
.rsv-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}
.rsv-kpi{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:12px 16px}
.rsv-kpi-val{font-size:28px;font-weight:900;line-height:1}
.rsv-kpi-lbl{font-size:10px;color:rgba(255,255,255,.37);font-weight:600;margin-top:3px;text-transform:uppercase;letter-spacing:.05em}
.rsv-tabs{display:flex;gap:4px;margin-bottom:14px;background:rgba(255,255,255,.04);border-radius:10px;padding:4px;width:fit-content}
.rsv-tab{padding:7px 16px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;color:rgba(255,255,255,.45);border:none;background:transparent;transition:all .2s}
.rsv-tab.active{background:rgba(255,255,255,.1);color:#fff}
.rsv-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:16px;margin-bottom:10px;transition:border-color .2s}
.rsv-card:hover{border-color:rgba(255,255,255,.13)}
.rsv-level-bar{height:8px;border-radius:4px;background:rgba(255,255,255,.08);overflow:hidden;margin-top:6px}
.rsv-level-fill{height:100%;border-radius:4px;transition:width .5s}
</style>

<div class="rsv-page">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;flex-wrap:wrap;gap:10px">
    <div>
      <h1 style="font-size:20px;font-weight:800;color:#fff;margin:0 0 4px;display:flex;align-items:center;gap:8px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>
        </svg>
        Giám sát Hồ chứa Thủy lợi
      </h1>
      <div style="font-size:12px;color:rgba(255,255,255,.37)">${RSV_DATA.length} hồ chứa · Tổng dung tích ${totalCap.toFixed(1)} triệu m³ · Đang xả: ${releasing} hồ</div>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-ghost btn-sm" onclick="showToast('Đang tải báo cáo hồ chứa...','info')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Xuất báo cáo
      </button>
    </div>
  </div>

  <div class="rsv-kpis">
    ${[
      ['Tổng dung tích', totalCap.toFixed(1)+' tr.m³', '#38bdf8'],
      ['Đang tích nước', (totalCur/totalCap*100).toFixed(0)+'%', '#10b981'],
      ['Hồ đang xả lũ', releasing, '#f59e0b'],
      ['Hồ nguy hiểm', dangerous, '#ef4444'],
    ].map(([l,v,c])=>`
    <div class="rsv-kpi"><div class="rsv-kpi-val" style="color:${c}">${v}</div><div class="rsv-kpi-lbl">${l}</div></div>`).join('')}
  </div>

  <div class="rsv-tabs">
    <button class="rsv-tab ${rsvTab==='overview'?'active':''}" onclick="rsvSetTab('overview')">Tổng quan</button>
    <button class="rsv-tab ${rsvTab==='events'?'active':''}" onclick="rsvSetTab('events')">Nhật ký điều tiết</button>
    <button class="rsv-tab ${rsvTab==='inspect'?'active':''}" onclick="rsvSetTab('inspect')">
      Kiểm định An toàn
      ${RSV_INSPECTIONS.some(r=>r.inspections.some(i=>i.status==='overdue'))?'<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ef4444;margin-left:4px;vertical-align:middle"></span>':''}
    </button>
    <button class="rsv-tab ${rsvTab==='waterplan'?'active':''}" onclick="rsvSetTab('waterplan')">Phương án Tích nước</button>
  </div>

  <div id="rsvContent">${rsvRenderTab()}</div>
</div>`;
}

function rsvSetTab(tab) {
  rsvTab = tab;
  const el = document.getElementById('rsvContent');
  if (el) el.innerHTML = rsvRenderTab();
  // Update active class on all rsv-tab buttons
  document.querySelectorAll('.rsv-tab').forEach(b => {
    const tabId = b.getAttribute('onclick')?.match(/rsvSetTab\('(\w+)'\)/)?.[1];
    b.classList.toggle('active', tabId === tab);
  });
}

function rsvRenderTab() {
  if (rsvTab === 'overview')  return rsvOverview();
  if (rsvTab === 'events')    return rsvEvents();
  if (rsvTab === 'inspect')   return rsvInspections();
  if (rsvTab === 'waterplan') return rsvWaterPlan();
  return '';
}

// ── INSPECTION TAB ─────────────────────────────────────────────────
function rsvInspections() {
  const statusCfg = {
    ok:      {label:'An toàn',    color:'#10b981', bg:'rgba(16,185,129,.1)'},
    warning: {label:'Cần theo dõi', color:'#f59e0b', bg:'rgba(245,158,11,.1)'},
    overdue: {label:'Quá hạn / Khôi khản', color:'#ef4444', bg:'rgba(239,68,68,.1)'},
  };
  const overdueCount = RSV_INSPECTIONS.reduce((n,r)=>n+r.inspections.filter(i=>i.status==='overdue').length,0);
  return `
  ${overdueCount>0?`<div style="padding:10px 14px;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);border-radius:10px;margin-bottom:14px;display:flex;align-items:center;gap:10px">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    <span style="font-size:13px;font-weight:600;color:#ef4444">${overdueCount} kỳ kiểm định quá hạn — cần xử lý khẩn!</span>
  </div>`:''}
  ${RSV_INSPECTIONS.map(r => {
    const latestInsp = r.inspections[0];
    const cfg = statusCfg[latestInsp.status] || statusCfg.ok;
    return `
    <div class="rsv-card" style="border-left:3px solid ${cfg.color};margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
        <div>
          <div style="font-size:14px;font-weight:800;color:#fff">${r.reservoir}</div>
          <div style="font-size:11px;color:rgba(255,255,255,.4)">${r.id} · Kế hoạch kiểm định tiếp: <span style="color:${latestInsp.status==='overdue'?'#ef4444':'#f59e0b'};font-weight:700">${latestInsp.nextCycle}</span></div>
        </div>
        <span style="padding:3px 10px;border-radius:20px;font-size:10px;font-weight:800;background:${cfg.bg};color:${cfg.color};border:1px solid ${cfg.color}40">${cfg.label}</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${r.inspections.map((insp,i) => {
          const ic = statusCfg[insp.status] || statusCfg.ok;
          return `
          <div style="display:flex;gap:10px;align-items:center;padding:8px 12px;background:rgba(255,255,255,.03);border-radius:8px;border:1px solid rgba(255,255,255,.06)">
            <div style="width:6px;height:6px;border-radius:50%;background:${ic.color};flex-shrink:0"></div>
            <div style="flex:1;min-width:0">
              <div style="font-size:12px;font-weight:600;color:#fff">${insp.cycle}</div>
              <div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:1px">${insp.unit === '—' ? 'Chưa có đơn vị kiểm định' : insp.unit} · ${insp.date === '—' ? 'Chưa thực hiện' : insp.date}</div>
              <div style="font-size:11px;color:rgba(255,255,255,.55);margin-top:2px;line-height:1.4">${insp.conclusion}</div>
            </div>
            <div style="text-align:right;flex-shrink:0">
              ${insp.qdNum !== '—' ? `
              <div style="font-size:10px;color:rgba(255,255,255,.4)">QĐ: ${insp.qdNum}</div>
              <div style="font-size:10px;color:rgba(255,255,255,.3)">${insp.qdDate}</div>
              <button class="btn btn-ghost btn-sm" style="font-size:10px;margin-top:4px" onclick="showToast('Tải QĐ ${insp.qdNum}...')">Tải QĐ</button>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('')}
  <div style="text-align:center;margin-top:14px">
    <button class="btn btn-primary" onclick="openAddInspectionModal()">+ Thêm kế quả kiểm định</button>
  </div>`;
}

window.openAddInspectionModal = function() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Nhập kết quả Kiểm định An toàn Đập</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-row">
      <div class="form-group"><label class="form-label">Hồ chứa / Đập</label>
        <select class="form-control">${RSV_DATA.map(r=>`<option>${r.name}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label class="form-label">Đơn vị kiểm định</label>
        <input class="form-control" placeholder="Tên đơn vị thực hiện">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Ngày kiểm định</label><input class="form-control" type="date"></div>
      <div class="form-group"><label class="form-label">Kết luận</label>
        <select class="form-control"><option>An toàn</option><option>Cần theo dõi</option><option>Cảnh báo nguy hiểm</option></select>
      </div>
    </div>
    <div class="form-group"><label class="form-label">Nội dung kết luận chi tiết</label><textarea class="form-control" rows="3" placeholder="Mô tả tình trạng, các vấn đề phát hiện, kiến nghị..."></textarea></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Số QD phê duyệt</label><input class="form-control" placeholder="QD-2026-XXX"></div>
      <div class="form-group"><label class="form-label">Kỳ kiểm định tiếp (tháng/năm)</label><input class="form-control" placeholder="MM/YYYY"></div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('✅ Đã lưu kết quả kiểm định an toàn đập!')">Lưu kết quả</button>
  </div>`, {width:'680px'});
};

// ── WATER PLAN TAB ──────────────────────────────────────────────
function rsvWaterPlan() {
  const selId = window._rsvWPSel || RSV_WATER_PLANS[0]?.id;
  const plan = RSV_WATER_PLANS.find(p=>p.id===selId) || RSV_WATER_PLANS[0];
  if (!plan) return '<p style="color:var(--muted)">Chưa có dữ liệu.</p>';
  const maxBar = plan.designLevel;
  const months = plan.monthly;
  return `
  <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap">
    <select class="form-control" style="width:220px" onchange="window._rsvWPSel=this.value;rsvSetTab('waterplan')">
      ${RSV_WATER_PLANS.map(p=>`<option value="${p.id}" ${p.id===selId?'selected':''}>${p.name}</option>`).join('')}
    </select>
    <div style="font-size:12px;color:rgba(255,255,255,.45)">QĐ phê duyệt: <strong style="color:#fff">${plan.qdNum}</strong> ngày ${plan.qdDate}</div>
    <button class="btn btn-ghost btn-sm" onclick="showToast('Tải phương án tích nước...')">Tải PDF QĐ</button>
  </div>
  <!-- Info grid -->
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px">
    ${[
      ['Cao trình thiết kế',`${plan.designLevel} m`,'#38bdf8'],
      ['Mực nước bình thường',`${plan.normalLevel} m`,'#10b981'],
      ['Mực nước chết',`${plan.deadLevel} m`,'#6b7280'],
    ].map(([l,v,c])=>`<div class="rsv-kpi"><div class="rsv-kpi-val" style="color:${c}">${v}</div><div class="rsv-kpi-lbl">${l}</div></div>`).join('')}
  </div>
  <!-- Monthly table -->
  <div class="rsv-card">
    <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.5);margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px">Mực nước an toàn theo tháng</div>
    <div style="display:grid;grid-template-columns:repeat(12,1fr);gap:6px">
      ${months.map(m => {
        const pctMax  = Math.round((m.max  - plan.deadLevel)/(plan.designLevel - plan.deadLevel)*100);
        const pctSafe = Math.round((m.safe - plan.deadLevel)/(plan.designLevel - plan.deadLevel)*100);
        return `<div style="text-align:center">
          <div style="font-size:10px;color:rgba(255,255,255,.4);margin-bottom:4px">${m.m}</div>
          <div style="height:80px;background:rgba(255,255,255,.05);border-radius:4px;position:relative;overflow:hidden">
            <div style="position:absolute;bottom:0;left:0;right:0;height:${pctMax}%;background:rgba(56,189,248,.2);border-radius:4px"></div>
            <div style="position:absolute;bottom:0;left:0;right:0;height:${pctSafe}%;background:#38bdf8;border-radius:4px"></div>
          </div>
          <div style="font-size:9px;color:#38bdf8;margin-top:3px;font-weight:700">${m.safe}m</div>
        </div>`;
      }).join('')}
    </div>
    <div style="display:flex;gap:16px;margin-top:10px;font-size:11px;color:rgba(255,255,255,.4)">
      <div><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#38bdf8;margin-right:5px"></span>Mực nước tích an toàn</div>
      <div><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:rgba(56,189,248,.2);margin-right:5px"></span>Mực nước tối đa cho phép</div>
    </div>
  </div>
  <div style="margin-top:12px;text-align:right">
    <button class="btn btn-primary btn-sm" onclick="openAddWaterPlanModal()">+ Cập nhật phương án</button>
  </div>`;
}

window.openAddWaterPlanModal = function() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Cập nhật Phương án Tích nước</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-row">
      <div class="form-group"><label class="form-label">Hồ chứa</label>
        <select class="form-control">${RSV_DATA.map(r=>`<option>${r.name}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label class="form-label">Số QD phê duyệt</label><input class="form-control" placeholder="QD-2026-XXX"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Cao trình thiết kế (m)</label><input class="form-control" type="number"></div>
      <div class="form-group"><label class="form-label">Mực nước bình thường (m)</label><input class="form-control" type="number"></div>
    </div>
    <div style="font-size:12px;color:var(--muted);padding:10px;background:rgba(255,255,255,.03);border-radius:8px">
      Mực nước an toàn theo từng tháng sẽ được nhập đầy đủ trong form chi tiết (12 tháng).
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('✅ Đã cập nhật phương án tích nước!')">Lưu</button>
  </div>`, {width:'600px'});
};

function rsvOverview() {
  return `<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px">
    ${RSV_DATA.map(r=>{
      const pct = Math.round(r.current/r.capacity*100);
      const fillColor = r.status==='critical'?'#ef4444':r.status==='danger'?'#f59e0b':r.status==='warning'?'#fbbf24':'#10b981';
      const statusLabel = {ok:'Bình thường',warning:'Cảnh báo',danger:'Nguy hiểm',critical:'Khẩn cấp'}[r.status];
      const levelAbove = r.currentLevel - r.normalLevel;
      return `
    <div class="rsv-card" style="border-left:3px solid ${fillColor}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div>
          <div style="font-size:14px;font-weight:800;color:#fff">${r.name}</div>
          <div style="font-size:11px;color:rgba(255,255,255,.4)">${r.district} · ${r.purpose}</div>
        </div>
        <span style="padding:3px 10px;border-radius:20px;font-size:10px;font-weight:800;background:${fillColor}20;color:${fillColor};border:1px solid ${fillColor}40">${statusLabel}</span>
      </div>
      <!-- Capacity bar -->
      <div style="display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,.5);margin-bottom:3px">
        <span>Dung tích hiện tại</span>
        <span style="font-weight:700;color:${fillColor}">${r.current.toFixed(1)} / ${r.capacity} tr.m³ (${pct}%)</span>
      </div>
      <div class="rsv-level-bar">
        <div class="rsv-level-fill" style="width:${pct}%;background:${fillColor}"></div>
      </div>
      <!-- Stats grid -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px;font-size:11px">
        <div style="text-align:center;padding:6px;background:rgba(255,255,255,.03);border-radius:8px">
          <div style="color:rgba(255,255,255,.4);font-size:9px;margin-bottom:2px">Cao trình</div>
          <div style="font-weight:700;color:${levelAbove>0?fillColor:'#fff'};font-family:monospace">${r.currentLevel}m</div>
          ${levelAbove > 0 ? `<div style="font-size:9px;color:${fillColor}">+${levelAbove.toFixed(2)}m MNDBT</div>` : ''}
        </div>
        <div style="text-align:center;padding:6px;background:rgba(255,255,255,.03);border-radius:8px">
          <div style="color:rgba(255,255,255,.4);font-size:9px;margin-bottom:2px">Cổng xả</div>
          <div style="font-weight:700;color:${r.gatesOpen>0?'#f59e0b':'#10b981'};font-family:monospace">${r.gatesOpen}/${r.gates}</div>
          <div style="font-size:9px;color:rgba(255,255,255,.4)">${r.gatesOpen>0?r.gateFlow+' m³/s':'Đóng'}</div>
        </div>
        <div style="text-align:center;padding:6px;background:rgba(255,255,255,.03);border-radius:8px">
          <div style="color:rgba(255,255,255,.4);font-size:9px;margin-bottom:2px">Lưu lượng vào</div>
          <div style="font-weight:700;font-family:monospace;color:${r.inflow>r.outflow?'#f59e0b':'#10b981'}">${r.inflow}</div>
          <div style="font-size:9px;color:rgba(255,255,255,.4)">m³/s</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.05)">
        <span style="font-size:10px;color:rgba(255,255,255,.35)">Hạ lưu: ${r.downstreamRiver}</span>
        <button class="btn btn-ghost btn-sm" onclick="rsvGateControl('${r.id}')" style="font-size:11px">Điều tiết cửa van</button>
      </div>
    </div>`;
    }).join('')}
  </div>`;
}

function rsvEvents() {
  const typeColor = { release:'#f59e0b', close:'#10b981', alert:'#ef4444' };
  const typeLabel = { release:'Mở xả', close:'Đóng van', alert:'Cảnh báo' };
  return `<div class="card" style="padding:0">
    <div class="card-header">
      <span class="card-title">Nhật ký điều tiết & Vận hành</span>
      <button class="btn btn-primary btn-sm" onclick="showToast('Ghi nhật ký điều tiết...','info')">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Ghi nhật ký
      </button>
    </div>
    ${RSV_EVENTS.map(e=>{
      const tc = typeColor[e.type]||'#6b7280';
      return `<div style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.05);border-left:3px solid ${tc}">
        <div style="display:flex;gap:10px;align-items:flex-start;flex-wrap:wrap">
          <div style="flex:1">
            <div style="display:flex;gap:8px;align-items:center;margin-bottom:4px">
              <span style="font-size:10px;font-weight:800;padding:1px 8px;border-radius:20px;background:${tc}20;color:${tc}">${typeLabel[e.type]}</span>
              <span style="font-size:11px;font-weight:700;color:#fff">${e.reservoir}</span>
              <span style="font-size:10px;font-family:monospace;color:rgba(255,255,255,.35)">${e.time}</span>
            </div>
            <div style="font-size:12px;color:rgba(255,255,255,.7);margin-bottom:3px">${e.action}</div>
            <div style="font-size:11px;color:rgba(255,255,255,.4);line-height:1.4">Lý do: ${e.trigger}</div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div style="font-size:14px;font-weight:800;color:${tc};font-family:monospace">${e.flow}</div>
            <div style="font-size:10px;color:rgba(255,255,255,.35);margin-top:2px">${e.operator}</div>
          </div>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

function rsvGateControl(id) {
  const r = RSV_DATA.find(x=>x.id===id);
  if (r && typeof showToast==='function') showToast(`Mở bảng điều khiển cửa van: ${r.name}`, 'info');
}
