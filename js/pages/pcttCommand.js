// ── PCTT COMMAND & CONTROL — KỊCH BẢN & CHỈ ĐẠO ──────────────────────
let pcttCmdTab = 'tasks';
let _activeScenarioId = null;
let cmdLogPage = 1;
const CMD_LOG_PAGE_SIZE = 10;

const CMD_SCENARIOS = [
  { id:'SC-01', name:'Lũ lớn Sông Hồng — Báo động 3', level:'critical', color:'#ff3c50',
    trigger:'Mực nước SH > 11.5m (BĐ3) tại trạm Hà Nội', phase:'Giai đoạn ứng phó khẩn cấp',
    tasks:[
      { id:'T-01', t:'Kiểm tra mực nước sông Hồng mỗi 30 phút', s:'done', assignee:'Đội quan trắc TV01', deadline:'Liên tục', priority:'critical' },
      { id:'T-02', t:'Phát lệnh sơ tán 12 xã hạ du vùng lũ Ba Vì', s:'processing', assignee:'UBND H. Ba Vì', deadline:'Trước 15h hôm nay', priority:'critical' },
      { id:'T-03', t:'Chuẩn bị vật tư hộ đê kho Mỹ Đức (km12)', s:'pending', assignee:'Phạm Thị Ngọc', deadline:'Trong 4h', priority:'high' },
      { id:'T-04', t:'Kích hoạt trạm bơm Yên Sở 100% công suất', s:'pending', assignee:'Đội vận hành', deadline:'Ngay tức thì', priority:'critical' },
      { id:'T-05', t:'Điều động đội ƯCSC số 3 đến vị trí tập kết', s:'processing', assignee:'Hoàng Văn Bình', deadline:'Trước 14h', priority:'high' },
      { id:'T-06', t:'Báo cáo tình hình lên UBND TP mỗi 2 tiếng', s:'done', assignee:'Nguyễn Quản Trị', deadline:'Định kỳ', priority:'high' },
      { id:'T-07', t:'Kiểm tra tình trạng đê xung yếu K22-K28 Hữu Đáy', s:'pending', assignee:'Hạt QL Đê Mỹ Đức', deadline:'Trước 16h', priority:'critical' },
      { id:'T-08', t:'Phối hợp CSGT điều tiết giao thông vùng ngập', s:'pending', assignee:'Trần Thị Hương', deadline:'Khi cần', priority:'normal' },
    ],
    forces:{ total:2450, ready:1820, alert:'Trực chiến 24/24', units:'6 đội ƯCSC, 14 đội xung kích' },
    resources:{ sandbags:'850,000 bao', boats:'245 chiếc', pumps:'42 máy bơm', food:'Đủ 30 ngày' },
  },
  { id:'SC-02', name:'Bão mạnh (Cấp 12+) đổ bộ nội thành', level:'critical', color:'#ff9800',
    trigger:'Tin bão khẩn cấp, bão cấp 12+ dự báo đổ bộ trong 24h', phase:'Giai đoạn phòng ngừa',
    tasks:[
      { id:'T-09', t:'Triệu tập BCH PCTT TP. Hà Nội họp khẩn', s:'done', assignee:'Chi cục trưởng', deadline:'Ngay lập tức', priority:'critical' },
      { id:'T-10', t:'Thông báo sơ tán nhà tạm bợ, ven sông', s:'processing', assignee:'Các UBND quận/huyện', deadline:'Trước 18h', priority:'high' },
      { id:'T-11', t:'Cắt tỉa cây nguy hiểm hai bên đường', s:'pending', assignee:'Sở Xây dựng phối hợp', deadline:'Trước 20h', priority:'high' },
      { id:'T-12', t:'Hạ thấp mực nước kênh, hồ đô thị', s:'pending', assignee:'Đội vận hành bơm', deadline:'Trước 22h', priority:'critical' },
    ],
    forces:{ total:1800, ready:1200, alert:'Trực ban tăng cường', units:'4 đội ƯCSC, 30 xã xung kích' },
    resources:{ sandbags:'500,000 bao', boats:'120 chiếc', pumps:'28 máy bơm', food:'Đủ 15 ngày' },
  },
  { id:'SC-03', name:'Sự cố vỡ/sạt đê cục bộ', level:'critical', color:'#e91e63',
    trigger:'Phát hiện nứt, sụt lún hoặc vỡ đê đột ngột', phase:'Ứng phó khẩn cấp tức thì',
    tasks:[
      { id:'T-13', t:'Phong tỏa ngay đoạn đê sự cố bán kính 500m', s:'done', assignee:'Công an địa phương', deadline:'Ngay lập tức', priority:'critical' },
      { id:'T-14', t:'Điều đội ƯCSC chuyên ngành đến hiện trường', s:'processing', assignee:'Hạt QL Đê', deadline:'Trong 30 phút', priority:'critical' },
      { id:'T-15', t:'Tổ chức sơ tán khẩn cấp khu dân cư hạ du', s:'pending', assignee:'UBND xã', deadline:'Trong 1 giờ', priority:'critical' },
      { id:'T-16', t:'Triển khai vật tư hộ đê khẩn cấp', s:'pending', assignee:'Phòng Vật tư', deadline:'Trong 2 giờ', priority:'critical' },
    ],
    forces:{ total:850, ready:650, alert:'Khẩn cấp 24/24', units:'2 đội chuyên ngành, 5 đội xung kích' },
    resources:{ sandbags:'200,000 bao', boats:'50 chiếc', pumps:'12 máy bơm', food:'Đủ 7 ngày' },
  },
  { id:'SC-04', name:'Ngập úng đô thị diện rộng', level:'warning', color:'#00c8ff',
    trigger:'Mưa > 100mm/6h gây ngập úng > 20 điểm nội thành', phase:'Xử lý thông thường',
    tasks:[
      { id:'T-17', t:'Kích hoạt tất cả trạm bơm tiêu nội đô', s:'done', assignee:'Trung tâm điều độ', deadline:'Ngay tức thì', priority:'high' },
      { id:'T-18', t:'Cảnh báo qua hệ thống loa phường, SMS dân', s:'done', assignee:'Sở TT&TT', deadline:'Ngay tức thì', priority:'high' },
      { id:'T-19', t:'Điều hướng giao thông tránh điểm ngập', s:'processing', assignee:'Sở GTVT', deadline:'Liên tục', priority:'normal' },
      { id:'T-20', t:'Cử đội dọn rác, khơi thông miệng cống', s:'pending', assignee:'Công ty Thoát nước', deadline:'Trong 2h', priority:'high' },
    ],
    forces:{ total:1200, ready:980, alert:'Trực ban tăng cường 16/24', units:'8 đội, 18 xã/phường' },
    resources:{ sandbags:'150,000 bao', boats:'80 chiếc', pumps:'65 máy bơm', food:'Đủ 5 ngày' },
  },
  { id:'SC-05', name:'Hạn hán nghiêm trọng — Thiếu nước tưới', level:'warning', color:'var(--success)',
    trigger:'Mực nước hồ chứa < 30% dung tích, thiếu nước tưới > 3 tuần', phase:'Ứng phó hạn chế',
    tasks:[
      { id:'T-21', t:'Điều phối tưới luân phiên các vùng ưu tiên lúa', s:'done', assignee:'Phòng kỹ thuật', deadline:'Hàng ngày', priority:'high' },
      { id:'T-22', t:'Tổ chức khoan giếng dự phòng tại Ba Vì', s:'processing', assignee:'UBND H. Ba Vì', deadline:'Trong 1 tuần', priority:'high' },
      { id:'T-23', t:'Xin điều tiết nước từ hệ thống Sông Đà', s:'pending', assignee:'Chi cục trưởng', deadline:'Trong 3 ngày', priority:'critical' },
    ],
    forces:{ total:600, ready:500, alert:'Hoạt động bình thường', units:'Các đội quản lý tưới tiêu' },
    resources:{ sandbags:'—', boats:'20 chiếc', pumps:'85 máy bơm', food:'—' },
  },
];

const _activeScenario = () => CMD_SCENARIOS.find(s => s.id === _activeScenarioId) || CMD_SCENARIOS[0];

function renderPcttCommand() {
  const cmdLogs  = DATA.commandLogs || [];
  const pending  = cmdLogs.filter(c => c.status === 'pending_approval').length;
  const executed = cmdLogs.filter(c => c.status === 'executed').length;
  const fosData  = DATA.fourOnSite?.lucluong || [];
  const totalForce = fosData.length > 0 ? fosData.reduce((s,u) => s+u.onCall, 0) : 68;
  const totalMax   = fosData.length > 0 ? fosData.reduce((s,u) => s+u.total, 0) : 312;
  const activeScn  = cmd_activeScenario();

  return `
  <div class="page-header">
    <div class="page-title">
      <h1>Kịch bản & Chỉ đạo Điều hành</h1>
      <p>Trung tâm chỉ huy PCTT: ${CMD_SCENARIOS.length} kịch bản sẵn sàng · Điều hành lực lượng ${totalForce.toLocaleString()} người</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-ghost btn-sm" onclick="exportCmdReport()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
        Xuất báo cáo
      </button>
      <button class="btn btn-outline btn-sm" onclick="openAddTaskModal()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Thêm nhiệm vụ
      </button>
      <button class="btn btn-sm" style="background:rgba(255,23,68,.12);color:#ff5252;border:1px solid rgba(255,23,68,.3)" onclick="openEmergencyModal()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        Kích hoạt Khẩn cấp
      </button>
    </div>
  </div>

  <!-- Status Cards -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px">
    ${[
      { label:'Lệnh đã thực hiện', val:executed, color:'var(--success)' },
      { label:'Chờ phê duyệt', val:pending, color:'var(--warning)' },
      { label:'Kịch bản chuẩn bị', val:CMD_SCENARIOS.length, color:'var(--primary)' },
      { label:'Lực lượng trực ban', val:`${totalForce}/${totalMax}`, color:'var(--text)' },
    ].map(s=>`
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:16px 20px">
      <div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">${s.label}</div>
      <div style="font-size:28px;font-weight:800;color:${s.color}">${s.val}</div>
    </div>`).join('')}
  </div>

  <!-- Tabs -->
  <div class="tabs" style="margin-bottom:20px">
    <button class="tab-btn ${pcttCmdTab==='tasks'?'active':''}" onclick="switchCmdTab('tasks')">Nhiệm vụ chỉ đạo</button>
    <button class="tab-btn ${pcttCmdTab==='scenarios'?'active':''}" onclick="switchCmdTab('scenarios')">Kịch bản ứng phó (${CMD_SCENARIOS.length})</button>
    <button class="tab-btn ${pcttCmdTab==='forces'?'active':''}" onclick="switchCmdTab('forces')">Lực lượng & Vật tư</button>
    <button class="tab-btn ${pcttCmdTab==='log'?'active':''}" onclick="switchCmdTab('log')">Nhật ký lệnh</button>
    <button class="tab-btn ${pcttCmdTab==='liencap'?'active':''}" onclick="switchCmdTab('liencap')">Chỉ đạo Liên cấp <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#f59e0b;margin-left:4px;vertical-align:middle"></span></button>
  </div>

  <div id="cmdTabContent">${_renderCmdTab(cmdLogs, activeScn, totalForce, totalMax)}</div>`;
}

// ── Mock: Liên cấp directives ──────────────────────────────────────────
const LIEN_CAP_DIRECTIVES = [
  { id:'LC-001', time:'07:45 25/03/2026', from:'BCH PCTT Thành phố', to:'all', level:'urgent',
    content:'Cảnh báo lũ cấp 2 trên Sông Hồng. Yêu cầu tất cả các xã ven sông kiểm tra đê và báo cáo trước 10h00.',
    communes: [
      { name:'xã Phương Thanh', status:'confirmed', confTime:'08:12', note:'Xác nhận, đã có đội kiểm tra.' },
      { name:'xã Tân Phong', status:'confirmed', confTime:'08:31', note:'Đang kiểm tra đoạn K22-K28.' },
      { name:'xã Hồng Vân', status:'pending', confTime:null, note:'' },
      { name:'xã Chương Dương', status:'pending', confTime:null, note:'' },
      { name:'xã Mỹ Đình', status:'no_response', confTime:null, note:'' },
    ]
  },
  { id:'LC-002', time:'09:00 25/03/2026', from:'BCH PCTT H. Ba Vì', to:'district', level:'normal',
    content:'Yêu cầu 8 xã kiểm tra hồ Suối Hai, cập nhật mực nước tới 12h00. Phận công đội trực vào ban đêm.',
    communes: [
      { name:'xã Chu Minh', status:'confirmed', confTime:'09:22', note:'Xác nhận, mực nước đang 17.8m.' },
      { name:'xã Tăng Tiến', status:'confirmed', confTime:'09:45', note:'Đã phân công 5 cán bộ trực.' },
      { name:'xã Vạn Thắng', status:'pending', confTime:null, note:'' },
      { name:'xã Đớng Tâm', status:'pending', confTime:null, note:'' },
    ]
  },
  { id:'LC-003', time:'14:00 24/03/2026', from:'BCH PCTT Thành phố', to:'all', level:'normal',
    content:'Triển khai đợt kiểm định vận hành cống đầu mối 30 công trình trước ngày 30/3/2026.',
    communes: [
      { name:'xã Hòa Bình', status:'confirmed', confTime:'14:30', note:'Hoàn thành.' },
      { name:'xã Mỹ Lương', status:'confirmed', confTime:'15:10', note:'Hoàn thành.' },
      { name:'xã Xuân Mai', status:'confirmed', confTime:'16:00', note:'Hoàn thành.' },
    ]
  },
];

function _renderCmdTab(cmdLogs, activeScn, totalForce, totalMax) {
  const scn = cmd_activeScenario();

  if (pcttCmdTab === 'liencap') return _renderLienCapTab();
  if (pcttCmdTab === 'tasks') {
    const tasks = scn.tasks;
    const done  = tasks.filter(t=>t.s==='done').length;
    return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="padding:6px 14px;border-radius:20px;background:${scn.color}18;border:1px solid ${scn.color}44;font-size:12px;font-weight:700;color:${scn.color}">${scn.name}</div>
        <span style="font-size:12px;color:var(--muted)">Hoàn thành ${done}/${tasks.length} nhiệm vụ</span>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="openAddTaskModal()">+ Thêm nhiệm vụ</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${tasks.map((task,i) => {
        const colors={done:'var(--success)',processing:'var(--primary)',pending:'var(--muted)'};
        const labels={done:'Hoàn thành',processing:'Đang thực hiện',pending:'Chờ thực hiện'};
        const badges={done:'badge-green',processing:'badge-blue',pending:'badge-gray'};
        const pColor={critical:'var(--danger)',high:'var(--warning)',normal:'var(--muted)'}[task.priority]||'var(--muted)';
        return `
        <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:10px;transition:background .2s" onmouseover="this.style.background='rgba(255,255,255,.04)'" onmouseout="this.style.background='rgba(255,255,255,.02)'">
          <div style="width:24px;height:24px;border-radius:6px;border:1.5px solid ${colors[task.s]};background:${task.s==='done'?colors[task.s]:'transparent'};display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer" onclick="toggleCmdTask('${scn.id}','${task.id}')">
            ${task.s==='done'?'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>':task.s==='processing'?`<div style="width:8px;height:8px;border-radius:50%;background:var(--primary)"></div>`:''}
          </div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;${task.s==='done'?'text-decoration:line-through;opacity:.5':''}">${task.t}</div>
            <div style="font-size:11px;color:var(--muted);margin-top:3px">👤 ${task.assignee} · ⏰ ${task.deadline}</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:6px;height:6px;border-radius:50%;background:${pColor}" title="${task.priority}"></div>
            <span class="badge ${badges[task.s]}" style="font-size:10px">${labels[task.s]}</span>
            <button class="btn btn-ghost btn-xs" onclick="viewTaskDetail('${scn.id}','${task.id}')">Chi tiết</button>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  }

  if (pcttCmdTab === 'scenarios') {
    return `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px">
      ${CMD_SCENARIOS.map(s => {
        const done=s.tasks.filter(t=>t.s==='done').length;
        const pct=Math.round(done/s.tasks.length*100);
        const isActive=s.id===_activeScenarioId;
        return `
        <div style="background:var(--bg-card);border:1.5px solid ${isActive?s.color:'var(--border)'};border-radius:14px;padding:18px;transition:border-color .2s">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
            <div>
              <div style="font-size:14px;font-weight:800;margin-bottom:4px">${s.name}</div>
              <div style="font-size:11px;color:var(--muted)">${s.trigger}</div>
            </div>
            ${statusBadge(s.level)}
          </div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:10px">${done}/${s.tasks.length} nhiệm vụ · ${s.phase}</div>
          <div style="height:5px;background:rgba(255,255,255,.06);border-radius:3px;margin-bottom:12px;overflow:hidden">
            <div style="width:${pct}%;height:100%;background:${s.color};border-radius:3px"></div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-ghost btn-sm" style="flex:1" onclick="viewScenarioDetail('${s.id}')">Xem kịch bản</button>
            ${isActive
              ? `<button class="btn btn-sm" style="flex:1;background:rgba(41,132,238,.1);color:var(--success);border:1px solid rgba(41,132,238,.3)" disabled>✓ Đang kích hoạt</button>`
              : `<button class="btn btn-sm" style="flex:1;background:${s.color}22;color:${s.color};border:1px solid ${s.color}44" onclick="activateScenario('${s.id}')">Kích hoạt</button>`}
          </div>
        </div>`;
      }).join('')}
    </div>
    ${typeof renderAiScenarioPanel === 'function' ? renderAiScenarioPanel(_activeScenarioId) : ''}` + '';
  }

  if (pcttCmdTab === 'forces') {
    const s = cmd_activeScenario();
    return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
      <div class="card">
        <div class="card-header"><span class="card-title">Lực lượng — ${s.name}</span></div>
        <div style="padding:16px">
          ${[
            { label:'Lực lượng sẵn sàng', val:`${s.forces.ready.toLocaleString()} người`, icon:'👤' },
            { label:'Tổng quân số', val:`${s.forces.total.toLocaleString()} người`, icon:'👥' },
            { label:'Chế độ trực', val:s.forces.alert, icon:'⏰' },
            { label:'Đơn vị tham gia', val:s.forces.units, icon:'🏛' },
          ].map(f=>`
          <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)">
            <span style="font-size:20px">${f.icon}</span>
            <div><div style="font-size:11px;color:var(--muted)">${f.label}</div><div style="font-size:13px;font-weight:600;margin-top:2px">${f.val}</div></div>
          </div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Vật tư, phương tiện</span></div>
        <div style="padding:16px">
          ${[
            { label:'Bao cát dự phòng', val:s.resources.sandbags, icon:'📦' },
            { label:'Xuồng cứu hộ', val:s.resources.boats, icon:'🚤' },
            { label:'Máy bơm di động', val:s.resources.pumps, icon:'⚙' },
            { label:'Lương thực dự trữ', val:s.resources.food, icon:'🌾' },
          ].map(f=>`
          <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)">
            <span style="font-size:20px">${f.icon}</span>
            <div><div style="font-size:11px;color:var(--muted)">${f.label}</div><div style="font-size:13px;font-weight:600;margin-top:2px">${f.val}</div></div>
          </div>`).join('')}
        </div>
      </div>
    </div>
    <div class="card" style="padding:0">
      <div class="card-header"><span class="card-title">Phân bổ lực lượng theo đơn vị</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Đơn vị</th><th>Nhiệm vụ</th><th>Quân số</th><th>Trạng thái</th><th>Liên hệ</th></tr></thead>
          <tbody>
            ${[
              { unit:'Đội ƯCSC số 1 (Hạt QL Đê Mỹ Đức)', task:'Tuần tra, hộ đê 24/24', count:45, status:'ok', contact:'0912-234-567' },
              { unit:'Đội ƯCSC số 2 (Ba Vì)', task:'Sơ tán dân, hộ đê', count:38, status:'ok', contact:'0923-456-789' },
              { unit:'Đội ƯCSC số 3 (Chương Mỹ)', task:'Cứu hộ cứu nạn', count:42, status:'processing', contact:'0934-567-890' },
              { unit:'Lực lượng xung kích xã Phúc Thọ', task:'Hỗ trợ địa phương', count:120, status:'ok', contact:'0281-234-567' },
              { unit:'Đội kỹ thuật máy bơm Cổ Nhuế', task:'Vận hành trạm bơm 24/24', count:18, status:'ok', contact:'0398-765-432' },
            ].map(r=>`<tr>
              <td style="font-weight:600;font-size:12px">${r.unit}</td>
              <td style="font-size:12px;color:var(--muted)">${r.task}</td>
              <td class="mono" style="font-weight:700">${r.count}</td>
              <td>${statusBadge(r.status)}</td>
              <td class="mono" style="font-size:12px;color:var(--primary)">${r.contact}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  if (pcttCmdTab === 'log') {
    const total      = cmdLogs.length;
    const totalPages = Math.max(1, Math.ceil(total / CMD_LOG_PAGE_SIZE));
    const start      = (cmdLogPage - 1) * CMD_LOG_PAGE_SIZE;
    const paged      = cmdLogs.slice(start, start + CMD_LOG_PAGE_SIZE);
    return `
    <div class="card" style="padding:0">
      <div class="card-header">
        <span class="card-title">Nhật ký lệnh điều hành</span>
        <span style="font-size:11px;color:var(--muted)">${total} lệnh · Trang ${cmdLogPage}/${totalPages}</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Mã lệnh</th><th>Nội dung</th><th>Người yêu cầu</th><th>Ưu tiên</th><th>Trạng thái</th><th>Phê duyệt</th></tr></thead>
          <tbody>
            ${paged.map(c => {
              const pColor={critical:'badge-red',high:'badge-yellow',normal:'badge-gray'}[c.priority]||'badge-gray';
              const pLabel={critical:'Khẩn cấp',high:'Ưu tiên cao',normal:'Bình thường'}[c.priority]||c.priority;
              const sColor=c.status==='executed'?'badge-green':'badge-yellow';
              const sLabel=c.status==='executed'?'Đã thực hiện':'Chờ phê duyệt';
              return `<tr>
                <td class="mono" style="color:var(--primary);font-size:12px">${c.id}</td>
                <td style="font-size:12px;max-width:280px">${c.action}</td>
                <td style="font-size:12px;color:var(--muted)">${c.requestedBy||c.by||'—'}</td>
                <td><span class="badge ${pColor}" style="font-size:10px">${pLabel}</span></td>
                <td><span class="badge ${sColor}" style="font-size:10px">${sLabel}</span></td>
                <td>${c.status==='pending_approval'?`<div style="display:flex;gap:4px">
                  <button class="btn btn-sm" style="font-size:10px;background:rgba(41,132,238,.1);color:var(--success);border:1px solid rgba(41,132,238,.25);padding:3px 8px" onclick="approveCmdLog('${c.id}')">Duyệt</button>
                  <button class="btn btn-ghost btn-xs" style="font-size:10px;color:var(--danger)" onclick="rejectCmdLog('${c.id}')">Từ chối</button>
                </div>`:`<span style="font-size:11px;color:var(--muted)">${c.time||c.requestedAt||'—'}</span>`}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
      ${totalPages > 1 ? `
      <div class="pagination-bar" style="margin-top:0;padding:14px 16px;border-top:1px solid var(--border)">
        <div style="font-size:12px;color:var(--muted)">Hiển thị ${start+1}–${Math.min(start+CMD_LOG_PAGE_SIZE,total)} / ${total} lệnh</div>
        <div class="pagination-btns">
          <button class="btn btn-ghost btn-sm" ${cmdLogPage===1?'disabled':''} onclick="changeCmdLogPage(${cmdLogPage-1})">Trước</button>
          ${Array.from({length:Math.min(totalPages,7)},(_,i)=>{
            const p = totalPages<=7 ? i+1 : cmdLogPage<=4 ? i+1 : Math.min(cmdLogPage+i-3,totalPages);
            return `<button class="pagination-page ${p===cmdLogPage?'active':''}" onclick="changeCmdLogPage(${p})">${p}</button>`;
          }).join('')}
          <button class="btn btn-ghost btn-sm" ${cmdLogPage===totalPages?'disabled':''} onclick="changeCmdLogPage(${cmdLogPage+1})">Sau</button>
        </div>
      </div>` : ''}
    </div>`;
  }
  return '';
}

function cmd_activeScenario() {
  return CMD_SCENARIOS.find(s => s.id === _activeScenarioId) || CMD_SCENARIOS[0];
}

window.switchCmdTab = function(tab) {
  pcttCmdTab = tab;
  if (tab !== 'log') cmdLogPage = 1; // reset page when leaving log tab
  const cmdLogs = DATA.commandLogs || [];
  const el = document.getElementById('cmdTabContent');
  if (el) el.innerHTML = _renderCmdTab(cmdLogs, cmd_activeScenario(), 68, 312);
  document.querySelectorAll('.tab-btn').forEach(b => {
    const map={tasks:'Nhiệm vụ chỉ đạo',scenarios:'Kịch bản ứng phó',forces:'Lực lượng & Vật tư',log:'Nhật ký lệnh'};
    b.classList.toggle('active', b.textContent.trim().startsWith(map[tab]?.substring(0,8)||'__'));
  });
};

window.changeCmdLogPage = function(p) {
  const cmdLogs = DATA.commandLogs || [];
  const totalPages = Math.max(1, Math.ceil(cmdLogs.length / CMD_LOG_PAGE_SIZE));
  cmdLogPage = Math.max(1, Math.min(p, totalPages));
  const el = document.getElementById('cmdTabContent');
  if (el) el.innerHTML = _renderCmdTab(cmdLogs, cmd_activeScenario(), 68, 312);
};

window.activateScenario = function(id) {
  const s = CMD_SCENARIOS.find(x=>x.id===id); if (!s) return;
  openModal(`
  <div class="modal-header"><span class="modal-title" style="color:${s.color}">Kích hoạt kịch bản: ${s.name}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div style="padding:14px;background:rgba(255,23,68,.06);border:1px solid rgba(255,23,68,.2);border-radius:10px;margin-bottom:16px">
      <div style="font-size:13px;font-weight:700;margin-bottom:6px">⚠ Xác nhận kích hoạt kịch bản ứng phó</div>
      <div style="font-size:12px;color:var(--muted)">Hành động này sẽ: Gửi thông báo tới tất cả các đội ƯCSC, Tạo danh sách nhiệm vụ và chỉ định người thực hiện, Báo cáo tự động lên BCH PCTT TP.</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
      ${[{l:'Cấp độ',v:s.level},{l:'Giai đoạn',v:s.phase},{l:'Điều kiện kích hoạt',v:s.trigger},{l:'Tổng nhiệm vụ',v:s.tasks.length+' nhiệm vụ'}].map(f=>
      `<div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px;padding:10px"><div style="font-size:10px;color:var(--muted)">${f.l}</div><div style="font-size:12px;font-weight:600;margin-top:3px">${f.v}</div></div>`).join('')}
    </div>
    <div class="form-group"><label class="form-label">Ghi chú lệnh kích hoạt</label>
      <textarea id="scnNote" class="form-control" rows="2" placeholder="Lý do kích hoạt, tình hình cụ thể..."></textarea></div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-sm" style="background:rgba(255,23,68,.15);color:var(--danger);border:1px solid rgba(255,23,68,.3)" onclick="doActivateScenario('${id}')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      Xác nhận Kích hoạt
    </button>
  </div>`);
};

window.doActivateScenario = function(id) {
  _activeScenarioId = id;
  const s = CMD_SCENARIOS.find(x=>x.id===id);
  closeModal(); navigate('pcttCommand'); showToast(`🚨 Đã kích hoạt kịch bản: "${s?.name}"! Thông báo đã gửi tới tất cả đơn vị.`);
};

window.viewScenarioDetail = function(id) {
  const s = CMD_SCENARIOS.find(x=>x.id===id); if (!s) return;
  const done = s.tasks.filter(t=>t.s==='done').length;
  openModal(`
  <div class="modal-header"><span class="modal-title">${s.name}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body" style="max-height:70vh;overflow-y:auto">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      ${[{l:'Mức độ',v:s.level},{l:'Giai đoạn',v:s.phase},{l:'Tiến độ',v:`${done}/${s.tasks.length} nhiệm vụ (${Math.round(done/s.tasks.length*100)}%)`},{l:'Điều kiện kích hoạt',v:s.trigger}].map(f=>
      `<div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px;padding:10px"><div style="font-size:10px;color:var(--muted)">${f.l}</div><div style="font-size:12px;font-weight:600;margin-top:3px">${f.v}</div></div>`).join('')}
    </div>
    <div style="font-size:13px;font-weight:700;margin-bottom:8px">Danh sách nhiệm vụ (${s.tasks.length})</div>
    ${s.tasks.map(t=>`
    <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:8px;margin-bottom:6px">
      <div style="width:18px;height:18px;border-radius:4px;background:${{done:'var(--success)',processing:'var(--primary)',pending:'rgba(255,255,255,.15)'}[t.s]};flex-shrink:0"></div>
      <div style="flex:1"><div style="font-size:12px">${t.t}</div><div style="font-size:10px;color:var(--muted)">${t.assignee}</div></div>
      <span class="badge ${{done:'badge-green',processing:'badge-blue',pending:'badge-gray'}[t.s]}" style="font-size:9px">${{done:'Xong',processing:'Đang làm',pending:'Chờ'}[t.s]}</span>
    </div>`).join('')}
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-primary" onclick="closeModal();activateScenario('${s.id}')">Kích hoạt kịch bản</button>
  </div>`);
};

window.openAddTaskModal = function() {
  const scn = cmd_activeScenario();
  openModal(`
  <div class="modal-header"><span class="modal-title">Thêm nhiệm vụ chỉ đạo</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-group"><label class="form-label">Nội dung nhiệm vụ <span style="color:var(--danger)">*</span></label>
      <textarea id="tDesc" class="form-control" rows="2" placeholder="Mô tả nhiệm vụ cụ thể..."></textarea></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Người phụ trách</label>
        <input id="tAssignee" class="form-control" placeholder="Tên / Đơn vị phụ trách"></div>
      <div class="form-group"><label class="form-label">Hạn hoàn thành</label>
        <input id="tDeadline" class="form-control" placeholder="VD: Trong 2 giờ"></div>
    </div>
    <div class="form-group"><label class="form-label">Mức ưu tiên</label>
      <select id="tPriority" class="form-control">
        <option value="critical">Khẩn cấp</option>
        <option value="high" selected>Ưu tiên cao</option>
        <option value="normal">Bình thường</option>
      </select></div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="saveCmdTask()">Thêm nhiệm vụ</button>
  </div>`);
};

window.saveCmdTask = function() {
  const t = document.getElementById('tDesc')?.value?.trim();
  if (!t) { showToast('⚠ Vui lòng nhập nội dung nhiệm vụ!'); return; }
  const scn = cmd_activeScenario();
  const newId = 'T-' + String(scn.tasks.length + 20).padStart(2,'0');
  scn.tasks.push({ id:newId, t, s:'pending', assignee:document.getElementById('tAssignee')?.value||'Chưa phân công', deadline:document.getElementById('tDeadline')?.value||'—', priority:document.getElementById('tPriority')?.value||'normal' });
  closeModal(); navigate('pcttCommand'); showToast('✅ Đã thêm nhiệm vụ mới!');
};

window.toggleCmdTask = function(scnId, taskId) {
  const scn = CMD_SCENARIOS.find(s=>s.id===scnId); if (!scn) return;
  const task = scn.tasks.find(t=>t.id===taskId); if (!task) return;
  task.s = task.s==='done'?'pending':task.s==='processing'?'done':'processing';
  const el = document.getElementById('cmdTabContent');
  const cmdLogs = DATA.commandLogs||[];
  if (el) el.innerHTML = _renderCmdTab(cmdLogs, cmd_activeScenario(), 68, 312);
  showToast('✅ Đã cập nhật trạng thái nhiệm vụ!');
};

window.viewTaskDetail = function(scnId, taskId) {
  const scn = CMD_SCENARIOS.find(s=>s.id===scnId);
  const task = scn?.tasks.find(t=>t.id===taskId); if (!task) return;
  openModal(`
  <div class="modal-header"><span class="modal-title">${task.id} — Chi tiết nhiệm vụ</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div style="padding:14px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:10px;margin-bottom:14px;font-size:14px;font-weight:600">${task.t}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      ${[{l:'Người phụ trách',v:task.assignee},{l:'Hạn hoàn thành',v:task.deadline},{l:'Mức ưu tiên',v:task.priority},{l:'Trạng thái',v:task.s}].map(f=>
      `<div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px;padding:10px"><div style="font-size:10px;color:var(--muted)">${f.l}</div><div style="font-size:13px;font-weight:600;margin-top:3px">${f.v}</div></div>`).join('')}
    </div>
    <div class="form-group" style="margin-top:14px"><label class="form-label">Ghi chú xử lý</label>
      <textarea id="taskNote" class="form-control" rows="2" placeholder="Nhập ghi chú tiến độ..."></textarea></div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-primary" onclick="closeModal();toggleCmdTask('${scnId}','${taskId}');showToast('✅ Đã cập nhật!')">Cập nhật tiến độ</button>
  </div>`);
};

window.openEmergencyModal = function() {
  openModal(`
  <div class="modal-header"><span class="modal-title" style="color:var(--danger)">🚨 Kích hoạt Chế độ Khẩn cấp</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div style="padding:16px;background:rgba(255,23,68,.08);border:1px solid rgba(255,23,68,.3);border-radius:10px;margin-bottom:16px">
      <div style="font-size:14px;font-weight:800;color:var(--danger);margin-bottom:8px">⚠ CẢNH BÁO: Hành động không thể hoàn tác trong 24h</div>
      <div style="font-size:12px;color:var(--muted)">Kích hoạt chế độ khẩn cấp sẽ:<br>• Triệu tập TOÀN BỘ lực lượng (312 người)<br>• Gửi SMS khẩn cấp tới 29 quận/huyện<br>• Phát cảnh báo qua loa phát thanh tự động<br>• Báo cáo tự động lên Bộ NN&PTNT</div>
    </div>
    <div class="form-group"><label class="form-label">Lý do kích hoạt <span style="color:var(--danger)">*</span></label>
      <textarea id="emergReason" class="form-control" rows="3" placeholder="Mô tả tình huống khẩn cấp..."></textarea></div>
    <div class="form-group"><label class="form-label">Người ra lệnh</label>
      <input class="form-control" value="${typeof currentUser !== 'undefined' ? currentUser?.name : 'Chi cục trưởng'}" readonly style="opacity:.7"></div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-sm" style="background:rgba(255,23,68,.2);color:var(--danger);border:1px solid rgba(255,23,68,.4);font-weight:700" onclick="doEmergency()">XÁC NHẬN KHẨN CẤP</button>
  </div>`);
};

window.doEmergency = function() {
  const r = document.getElementById('emergReason')?.value?.trim();
  if (!r) { showToast('⚠ Vui lòng nhập lý do!'); return; }
  closeModal(); showToast('🚨 CHẾ ĐỘ KHẨN CẤP ĐÃ KÍCH HOẠT! Đã thông báo tất cả lực lượng!');
};

window.approveCmdLog = function(id) {
  const c = (DATA.commandLogs||[]).find(x=>x.id===id);
  if (c) { c.status='executed'; c.time=new Date().toLocaleString('vi-VN'); navigate('pcttCommand'); showToast(`✅ Đã phê duyệt lệnh ${id}!`); }
};
window.rejectCmdLog = function(id) {
  const c = (DATA.commandLogs||[]).find(x=>x.id===id);
  if (c) { c.status='rejected'; navigate('pcttCommand'); showToast(`❌ Đã từ chối lệnh ${id}!`); }
};

window.exportCmdReport = function() {
  showToast('📄 Đang xuất báo cáo chỉ đạo...');
  setTimeout(() => {
    const scn = cmd_activeScenario();
    window.HADIWA_EXPORT?.print('BÁO CÁO CHỈ ĐẠO ĐIỀU HÀNH PCTT',
      `<h2>Kịch bản đang kích hoạt: ${scn.name}</h2>
      <table><thead><tr><th>STT</th><th>Nhiệm vụ</th><th>Phụ trách</th><th>Hạn</th><th>Trạng thái</th></tr></thead><tbody>
        ${scn.tasks.map((t,i)=>`<tr><td>${i+1}</td><td>${t.t}</td><td>${t.assignee}</td><td>${t.deadline}</td><td>${t.s}</td></tr>`).join('')}
      </tbody></table>`);
  }, 600);
};

// ── AI Response Suggestions in Scenarios tab ───────────────────────
const CMD_AI_SUGGESTIONS = {
  'SC-01': {
    risk: 'Cao',
    trend: 'Mực nước sông Hồng tăng 0.3m/6h — dự báo chạm BĐ3 trong 18-24h nếu mưa tiếp diễn.',
    suggestions: [
      'Kích hoạt sớm kịch bản từ Giai đoạn chuẩn bị sang Ứng phó khẩn cấp',
      'Thông báo di dân 3 xã ven sông trước 20:00 hôm nay',
      'Điều động thêm 2 máy bơm dã chiến về Km 14+200',
      'Phối hợp UBND huyện Ba Vì mở trạm tiếp nhận dân sơ tán',
    ],
    aiScore: 92
  },
  'SC-02': {
    risk: 'Trung bình',
    trend: 'Lượng mưa tích lũy 180mm/48h tại ba Huyện — xu hướng tăng trong 12h tới.',
    suggestions: [
      'Kiểm tra và thông cống tại 5 điểm úng ngập lịch sử',
      'Cảnh báo người dân vùng trũng thấp qua hệ thống loa',
      'Tăng cường tuần tra đê ven sông từ 22:00',
    ],
    aiScore: 76
  },
  'SC-03': {
    risk: 'Cao',
    trend: 'Cảnh báo sạt lở từ KTTV: 3 điểm có nguy cơ cao tại Ba Vì và Sóc Sơn.',
    suggestions: [
      'Phong tỏa 3 tuyến đường có nguy cơ sạt lở cao',
      'Cút bộ hộ dân trong vùng 100m tính từ mái taluy',
      'Triển khai lực lượng xung kích 24/7 tại các điểm nguy hiểm',
      'Phối hợp Sở GTVT kiểm tra taluy đường tỉnh lộ 419',
    ],
    aiScore: 88
  },
};

function renderAiScenarioPanel(scnId) {
  const ai = CMD_AI_SUGGESTIONS[scnId];
  if (!ai) return `<div style="padding:14px;font-size:12px;color:var(--muted)">Chưa có phân tích AI cho kịch bản này.</div>`;
  const riskColor = ai.risk==='Cao'?'var(--danger)':ai.risk==='Trung bình'?'var(--warning)':'var(--success)';
  return `
  <div class="card" style="padding:16px;margin-top:14px;border-left:3px solid var(--purple)">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <div style="display:flex;align-items:center;gap:8px">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/></svg>
        <span style="font-size:12px;font-weight:700">Phân tích AI — Gợi ý ứng phó</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="font-size:11px;color:var(--muted)">Độ tin cậy:</div>
        <div style="padding:2px 9px;border-radius:10px;background:rgba(41,132,238,.15);color:#5BA9FF;font-size:11px;font-weight:700">${ai.aiScore}%</div>
        <div style="padding:2px 9px;border-radius:10px;background:rgba(${ai.risk==='Cao'?'239,68,68':'234,179,8'},.12);color:${riskColor};font-size:10px;font-weight:700">Rủi ro: ${ai.risk}</div>
      </div>
    </div>
    <div style="padding:9px 12px;background:rgba(41,132,238,.06);border-radius:8px;font-size:12px;color:var(--muted);margin-bottom:12px;border-left:2px solid var(--purple)">
      <strong style="color:#5BA9FF">Dự báo xu hướng:</strong> ${ai.trend}
    </div>
    <div style="font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Gợi ý phương án ứng phó</div>
    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px">
      ${ai.suggestions.map((s,i)=>`
      <div style="display:flex;align-items:flex-start;gap:9px;padding:8px 10px;border-radius:8px;background:rgba(41,132,238,.05);border:1px solid rgba(41,132,238,.12)">
        <div style="width:18px;height:18px;border-radius:50%;background:rgba(41,132,238,.2);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:#5BA9FF;flex-shrink:0">${i+1}</div>
        <div style="font-size:12px;line-height:1.5">${s}</div>
      </div>`).join('')}
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-sm" style="background:rgba(41,132,238,.15);color:#5BA9FF;border:1px solid rgba(41,132,238,.3)" onclick="showToast('Đang tạo lệnh chỉ đạo từ gợi ý AI...')">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Tạo lệnh từ gợi ý AI
      </button>
      <button class="btn btn-ghost btn-sm" onclick="showToast('Làm mới phân tích AI...')">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
        Làm mới
      </button>
    </div>
  </div>`;
}

// ── LIÊN CẤP DIRECTIVE TAB ─────────────────────────────────────────
function _renderLienCapTab() {
  const levelColors = { urgent:'#ef4444', normal:'#38bdf8' };
  const statusCfg = {
    confirmed:   { label:'Đã xác nhận', color:'var(--success)', bg:'rgba(41,132,238,.1)' },
    pending:     { label:'Chờ xác nhận', color:'#f59e0b', bg:'rgba(245,158,11,.1)' },
    no_response: { label:'Không phản hồi', color:'#ef4444', bg:'rgba(239,68,68,.1)' },
  };
  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
    <div>
      <div style="font-size:14px;font-weight:800;color:#fff">Hệ thống Chỉ đạo Liên cấp TP ↔ Huyện ↔ Xã</div>
      <div style="font-size:12px;color:rgba(255,255,255,.4);margin-top:2px">${LIEN_CAP_DIRECTIVES.length} lệnh chỉ đạo đã phát hành · Theo dõi phản hồi theo thời gian thực</div>
    </div>
    <button class="btn btn-primary btn-sm" onclick="openNewDirectiveModal()">+ Phát lệnh chỉ đạo mới</button>
  </div>
  <div style="display:flex;flex-direction:column;gap:12px">
    ${LIEN_CAP_DIRECTIVES.map(d => {
      const confirmed = d.communes.filter(c=>c.status==='confirmed').length;
      const total = d.communes.length;
      const pct = Math.round(confirmed/total*100);
      const lvlColor = levelColors[d.level] || '#38bdf8';
      return `
      <div class="card" style="border-left:3px solid ${lvlColor};padding:14px 16px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
              <span class="mono" style="font-size:11px;color:${lvlColor}">${d.id}</span>
              <span style="padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;background:${lvlColor}18;color:${lvlColor};border:1px solid ${lvlColor}44">${d.level==='urgent'?'🚨 Khẩn cấp':'📋 Thông thường'}</span>
              <span style="font-size:11px;color:rgba(255,255,255,.4)">${d.time}</span>
            </div>
            <div style="font-size:12px;font-weight:600;color:rgba(255,255,255,.85);line-height:1.5">${d.content}</div>
            <div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:4px">Từ: <strong style="color:rgba(255,255,255,.7)">${d.from}</strong></div>
          </div>
          <div style="text-align:center;flex-shrink:0;margin-left:20px">
            <div style="font-size:22px;font-weight:800;color:${pct===100?'var(--success)':pct>50?'#f59e0b':'#ef4444'}">${pct}%</div>
            <div style="font-size:10px;color:rgba(255,255,255,.4)">${confirmed}/${total} xã xác nhận</div>
            <div style="width:80px;height:4px;background:rgba(255,255,255,.08);border-radius:2px;margin-top:6px;overflow:hidden">\
              <div style="height:100%;width:${pct}%;background:${pct===100?'var(--success)':pct>50?'#f59e0b':'#ef4444'};border-radius:2px"></div>
            </div>
          </div>
        </div>
        <!-- Communes -->
        <div style="display:flex;flex-wrap:wrap;gap:6px">\
          ${d.communes.map(c => {
            const cfg = statusCfg[c.status] || statusCfg.pending;
            return `<div style="display:flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;background:${cfg.bg};border:1px solid ${cfg.color}40;cursor:pointer" title="${c.note||cfg.label}" onclick="showToast('${c.name}: ${c.note||cfg.label}')">\
              <div style="width:5px;height:5px;border-radius:50%;background:${cfg.color}"></div>
              <span style="font-size:11px;color:${cfg.color};font-weight:600">${c.name}</span>\
              ${c.confTime?`<span style="font-size:10px;color:rgba(255,255,255,.4)">${c.confTime}</span>`:''}\
            </div>`;
          }).join('')}\
        </div>
      </div>`;
    }).join('')}\
  </div>`;
}

window.openNewDirectiveModal = function() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Phát lệnh Chỉ đạo Liên cấp</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-row">
      <div class="form-group"><label class="form-label">Cấp phát lệnh</label>
        <select class="form-control"><option>BCH PCTT Thành phố</option><option>BCH PCTT Quận/Huyện</option><option>Ban CHQS địa phương</option></select>
      </div>
      <div class="form-group"><label class="form-label">Mức độ ưu tiên</label>
        <select class="form-control"><option value="urgent">🚨 Khẩn cấp</option><option value="normal">📋 Thông thường</option></select>
      </div>
    </div>
    <div class="form-group"><label class="form-label">Nội dung lệnh chỉ đạo</label>
      <textarea class="form-control" rows="4" placeholder="Nội dung lệnh chỉ đạo cụ thể..."></textarea>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Hạn phản hồi</label><input class="form-control" type="datetime-local"></div>
      <div class="form-group"><label class="form-label">Gửi đến</label>
        <select class="form-control"><option>Tất cả xã/phường</option><option>Xã ven sông Hồng</option><option>Xã hạ du hồ chứa</option><option>Chọn xã cụ thể...</option></select>
      </div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('✅ Đã phát lệnh chỉ đạo tới các xã!')">Phát lệnh ngay</button>
  </div>`, {width:'640px'});
};
