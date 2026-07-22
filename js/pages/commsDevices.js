// ── COMMS DEVICES — Hệ thống Thông tin Liên lạc ─────────────────
let commsTab = 'speakers';

// ── Mock data ──────────────────────────────────────────────────────
window.NOTIFY_SPEAKERS = window.NOTIFY_SPEAKERS || [
  { id:'sp1', name:'Loa phòng IOC - Tầng 3',  location:'Phòng IOC, Tầng 3 Trụ sở Chi cục', type:'indoor',  status:'online',  endpoint:'http://192.168.1.10/api/broadcast', lastPing:'07:45' },
  { id:'sp2', name:'Loa hành lang Tầng 1',     location:'Hành lang, Tầng 1 Trụ sở Chi cục', type:'indoor',  status:'online',  endpoint:'http://192.168.1.11/api/broadcast', lastPing:'07:45' },
  { id:'sp3', name:'Loa sân trụ sở',           location:'Sân vườn phía trước trụ sở',        type:'public',  status:'online',  endpoint:'http://192.168.1.12/api/broadcast', lastPing:'07:40' },
  { id:'sp4', name:'Loa Đê Hữu Đáy Km14',     location:'Chốt trực Đê Hữu Đáy, Km 14+200',  type:'public',  status:'offline', endpoint:'http://10.0.2.14/api/broadcast',    lastPing:'06:12' },
  { id:'sp5', name:'Loa cơ động Đội ƯCSC',    location:'Xe cơ động số 1',                   type:'mobile',  status:'online',  endpoint:'http://10.0.3.1/api/broadcast',     lastPing:'07:30' },
  { id:'sp6', name:'Loa điểm công cộng Ba Vì', location:'UBND xã Tản Đà, Huyện Ba Vì',      type:'public',  status:'online',  endpoint:'http://10.0.4.1/api/broadcast',     lastPing:'07:42' },
];

const COMMS_RADIOS = [
  { id:'r1', name:'Bộ đàm BĐ-001', model:'Kenwood TK-2402', team:'Ban Chỉ huy PCTT', assignee:'Nguyễn Văn An',   channel:'CH-1 (156.000 MHz)', battery:92, status:'active'   },
  { id:'r2', name:'Bộ đàm BĐ-002', model:'Kenwood TK-2402', team:'Đội ƯCSC số 1',    assignee:'Trần Thị Bình',   channel:'CH-2 (156.025 MHz)', battery:67, status:'active'   },
  { id:'r3', name:'Bộ đàm BĐ-003', model:'Motorola XT660d', team:'Đội ƯCSC số 2',    assignee:'Lê Văn Cường',    channel:'CH-2 (156.025 MHz)', battery:45, status:'active'   },
  { id:'r4', name:'Bộ đàm BĐ-004', model:'Motorola XT660d', team:'Đội tuần tra đê',  assignee:'Phạm Minh Đức',   channel:'CH-3 (156.050 MHz)', battery:88, status:'active'   },
  { id:'r5', name:'Bộ đàm BĐ-005', model:'Icom IC-F3003',   team:'Dự phòng',         assignee:'—',               channel:'—',                  battery:100,status:'standby'  },
  { id:'r6', name:'Bộ đàm BĐ-006', model:'Icom IC-F3003',   team:'Dự phòng',         assignee:'—',               channel:'—',                  battery:100,status:'standby'  },
  { id:'r7', name:'Bộ đàm BĐ-007', model:'Kenwood TK-2402', team:'Đội khảo sát Đê',  assignee:'Hoàng Thị Oanh',  channel:'CH-1 (156.000 MHz)', battery:23, status:'low_bat'  },
  { id:'r8', name:'Bộ đàm BĐ-008', model:'Motorola XT660d', team:'—',               assignee:'—',               channel:'—',                  battery:0,  status:'charging' },
];

const COMMS_PHONES = [
  { id:'ph1', ext:'101', name:'Ban Giám đốc',          user:'Nguyễn Văn Đức',   ip:'192.168.10.101', model:'Yealink T54W', status:'online',  lastCall:'07:12' },
  { id:'ph2', ext:'102', name:'Phòng IOC — Điều hành', user:'Lê Thị Hà',        ip:'192.168.10.102', model:'Yealink T46U', status:'online',  lastCall:'07:45' },
  { id:'ph3', ext:'103', name:'Phòng Kỹ thuật PCTT',   user:'Trần Văn Bình',    ip:'192.168.10.103', model:'Yealink T46U', status:'online',  lastCall:'06:30' },
  { id:'ph4', ext:'104', name:'Phòng Quản lý Đê điều', user:'Phạm Quang Hùng',  ip:'192.168.10.104', model:'Yealink T31G', status:'offline', lastCall:'hôm qua 17:00' },
  { id:'ph5', ext:'105', name:'Phòng HC - NS',          user:'Võ Thị Mai',       ip:'192.168.10.105', model:'Yealink T31G', status:'online',  lastCall:'07:20' },
  { id:'ph6', ext:'201', name:'Chốt Đê Hữu Đáy',       user:'—',                ip:'10.0.2.201',     model:'Cisco SPA504G',status:'online', lastCall:'06:55' },
  { id:'ph7', ext:'202', name:'Chốt Đê Hữu Hồng',      user:'—',                ip:'10.0.2.202',     model:'Cisco SPA504G',status:'offline', lastCall:'hôm qua 20:00' },
  { id:'ph8', ext:'1800',name:'Đường dây nóng',         user:'Operator',         ip:'192.168.10.200', model:'Sangoma S705', status:'online',  lastCall:'07:50' },
];

const COMMS_DISPLAYS = [
  { id:'d1', name:'Màn hình IOC Wall 1',       location:'Phòng IOC — Màn hình tổng',   size:'55"', type:'led_wall', status:'online',  content:'Dashboard PCTT + Camera',   rotation:0  },
  { id:'d2', name:'Màn hình IOC Wall 2',       location:'Phòng IOC — Màn hình phụ',    size:'43"', type:'led_wall', status:'online',  content:'Bản đồ GIS + IoT',           rotation:30 },
  { id:'d3', name:'Màn hình hành lang T1',     location:'Hành lang tầng 1',             size:'32"', type:'signage',  status:'online',  content:'Thông báo nội bộ + Thời tiết',rotation:0  },
  { id:'d4', name:'Bảng LED cổng trụ sở',      location:'Cổng vào trụ sở',              size:'P6 3×1m', type:'outdoor_led', status:'online', content:'Cảnh báo mưa lũ khu vực HN', rotation:0 },
  { id:'d5', name:'Bảng LED Đê Hữu Đáy',      location:'Km 14+200 Đê Hữu Đáy',        size:'P8 2×1m', type:'outdoor_led', status:'offline', content:'—',                         rotation:0 },
  { id:'d6', name:'Màn hình phòng họp',        location:'Phòng họp lớn, Tầng 2',        size:'75"', type:'smarttv', status:'standby', content:'Standby — chờ lịch họp',     rotation:0  },
];

function renderCommsDevices() {
  const tabs = [
    { id:'speakers',  label:'Cụm Loa Phát Thanh', icon:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M15.54 8.46a5 5 0 010 7.07"/>' },
    { id:'radios',    label:'Thiết bị Bộ đàm',    icon:'<rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 13 16 13 16 8"/><line x1="5" y1="7" x2="5" y2="10"/><line x1="8" y1="7" x2="8" y2="10"/><line x1="5" y1="12" x2="5.01" y2="12"/><line x1="8" y1="12" x2="8.01" y2="12"/>' },
    { id:'phones',    label:'Điện thoại IP',       icon:'<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>' },
    { id:'displays',  label:'Màn hình & Bảng LED', icon:'<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>' },
  ];

  const sp = window.NOTIFY_SPEAKERS || [];
  const spOnline = sp.filter(s => s.status === 'online').length;
  const radOnline = COMMS_RADIOS.filter(r => r.status === 'active').length;
  const phOnline  = COMMS_PHONES.filter(p => p.status === 'online').length;
  const dispOn    = COMMS_DISPLAYS.filter(d => d.status === 'online').length;

  return `
  <div class="page-header">
    <div class="page-title">
      <h1>Hệ thống Thông tin Liên lạc</h1>
      <p>Quản lý tập trung thiết bị phát thanh, bộ đàm, điện thoại và màn hình hiển thị phục vụ PCTT</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-ghost btn-sm" onclick="showToast('Đang kiểm tra toàn bộ thiết bị...');setTimeout(()=>showToast('Kiểm tra xong: '+${sp.length + COMMS_RADIOS.length + COMMS_PHONES.length + COMMS_DISPLAYS.length}+' thiết bị'),2000)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        Ping tất cả
      </button>
      <button class="btn btn-primary" onclick="openCdBroadcastAll()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>
        Phát thông báo khẩn
      </button>
    </div>
  </div>

  <!-- KPI row -->
  <div class="grid-auto" style="margin-bottom:16px">
    <div class="card kpi-card" style="border-top:2px solid var(--cyan);cursor:pointer" onclick="switchCommsTab('speakers')">
      <div class="kpi-label">Cụm Loa</div>
      <div class="kpi-value" style="color:var(--cyan)">${sp.length}</div>
      <div class="kpi-sub" style="color:${spOnline===sp.length?'var(--green)':'var(--yellow)'}">${spOnline}/${sp.length} Online</div>
    </div>
    <div class="card kpi-card" style="border-top:2px solid var(--blue);cursor:pointer" onclick="switchCommsTab('radios')">
      <div class="kpi-label">Bộ đàm</div>
      <div class="kpi-value" style="color:var(--blue)">${COMMS_RADIOS.length}</div>
      <div class="kpi-sub" style="color:var(--green)">${radOnline} đang sử dụng</div>
    </div>
    <div class="card kpi-card" style="border-top:2px solid var(--green);cursor:pointer" onclick="switchCommsTab('phones')">
      <div class="kpi-label">Điện thoại IP</div>
      <div class="kpi-value" style="color:var(--green)">${COMMS_PHONES.length}</div>
      <div class="kpi-sub" style="color:${phOnline>=COMMS_PHONES.length-1?'var(--green)':'var(--yellow)'}">${phOnline} Online</div>
    </div>
    <div class="card kpi-card" style="border-top:2px solid var(--purple);cursor:pointer" onclick="switchCommsTab('displays')">
      <div class="kpi-label">Màn hình & LED</div>
      <div class="kpi-value" style="color:var(--purple)">${COMMS_DISPLAYS.length}</div>
      <div class="kpi-sub" style="color:var(--green)">${dispOn} đang hoạt động</div>
    </div>
  </div>

  <div class="tabs" style="margin-bottom:14px">
    ${tabs.map(t => `
    <button class="tab-btn ${commsTab===t.id?'active':''}" onclick="switchCommsTab('${t.id}')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px">${t.icon}</svg>
      ${t.label}
    </button>`).join('')}
  </div>
  <div id="commsContent">${getCommsTabContent()}</div>`;
}

function switchCommsTab(tab) {
  commsTab = tab;
  const area = document.getElementById('commsContent');
  if (area) area.innerHTML = getCommsTabContent();
  document.querySelectorAll('#contentArea .tab-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.trim().startsWith(
      {speakers:'Cụm', radios:'Thiết bị', phones:'Điện thoại', displays:'Màn hình'}[tab]||''));
  });
}

function getCommsTabContent() {
  if (commsTab === 'speakers') return renderCdSpeakers();
  if (commsTab === 'radios')   return renderCdRadios();
  if (commsTab === 'phones')   return renderCdPhones();
  if (commsTab === 'displays') return renderCdDisplays();
  return '';
}

// ── TAB: CỤM LOA (reuse hrm.js functions) ─────────────────────────
function renderCdSpeakers() {
  // Delegates to the speaker functions already defined in hrm.js
  return renderSpeakersTab();
}

// ── TAB: BỘ ĐÀM ──────────────────────────────────────────────────
function renderCdRadios() {
  const statusLabel = { active:'Đang dùng', standby:'Dự phòng', low_bat:'Pin yếu', charging:'Đang sạc' };
  const statusColor = { active:'var(--green)', standby:'var(--cyan)', low_bat:'var(--red)', charging:'var(--yellow)' };
  const active   = COMMS_RADIOS.filter(r => r.status === 'active').length;
  const lowBat   = COMMS_RADIOS.filter(r => r.status === 'low_bat').length;

  return `
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px">
    ${[{l:'Tổng bộ đàm',v:COMMS_RADIOS.length,c:'var(--cyan)'},{l:'Đang sử dụng',v:active,c:'var(--green)'},{l:'Pin yếu',v:lowBat,c:'var(--red)'},{l:'Đang sạc',v:COMMS_RADIOS.filter(r=>r.status==='charging').length,c:'var(--yellow)'}].map(k=>`
    <div class="card" style="padding:14px 16px"><div style="font-size:11px;color:var(--muted)">${k.l}</div><div style="font-size:22px;font-weight:800;color:${k.c}">${k.v}</div></div>`).join('')}
  </div>
  ${lowBat>0?`<div style="padding:10px 14px;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:9px;margin-bottom:14px;font-size:12px;color:var(--red)">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:5px"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    <strong>${lowBat} bộ đàm có pin yếu</strong> — cần sạc hoặc thay pin trước ca trực tiếp theo.
  </div>`:''}
  <div class="card" style="padding:0">
    <div class="card-header">
      <span class="card-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 13 16 13 16 8"/></svg>
        Danh sách Bộ đàm
      </span>
      <div style="display:flex;gap:8px">
        <input type="text" class="form-control form-control-sm" placeholder="Tìm..." style="width:150px" oninput="this.closest('.card').querySelectorAll('tbody tr').forEach(r=>r.style.display=r.textContent.toLowerCase().includes(this.value.toLowerCase())?'':'none')">
        <button class="btn btn-primary btn-sm" onclick="openAddRadio()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Thêm bộ đàm
        </button>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Mã / Tên</th><th>Model</th><th>Đội / Nhóm</th><th>Người giữ</th><th>Kênh</th><th>Pin</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
        <tbody>
          ${COMMS_RADIOS.map(r => `
          <tr>
            <td><strong style="font-size:12px">${r.name}</strong></td>
            <td style="font-size:12px;color:var(--muted)">${r.model}</td>
            <td style="font-size:12px">${r.team}</td>
            <td style="font-size:12px">${r.assignee}</td>
            <td><code style="font-size:10px;color:var(--cyan)">${r.channel}</code></td>
            <td>
              <div style="display:flex;align-items:center;gap:6px">
                <div style="width:50px;height:6px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden">
                  <div style="width:${r.battery}%;height:100%;background:${r.battery>50?'var(--green)':r.battery>20?'var(--yellow)':'var(--red)'};transition:.3s"></div>
                </div>
                <span style="font-size:11px;color:${r.battery>50?'var(--green)':r.battery>20?'var(--yellow)':'var(--red)'}">${r.battery}%</span>
              </div>
            </td>
            <td><span class="badge" style="font-size:9px;color:${statusColor[r.status]};border:1px solid ${statusColor[r.status]};background:rgba(0,0,0,.2)">${statusLabel[r.status]}</span></td>
            <td>
              <div style="display:flex;gap:3px">
                <button class="btn btn-ghost btn-xs" title="Phân công" onclick="assignRadio('${r.id}','${r.name}')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </button>
                <button class="btn btn-ghost btn-xs" title="Chỉnh sửa" onclick="editRadio('${r.id}')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

// ── TAB: ĐIỆN THOẠI IP ────────────────────────────────────────────
function renderCdPhones() {
  const online = COMMS_PHONES.filter(p => p.status === 'online').length;
  return `
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px">
    ${[{l:'Tổng máy',v:COMMS_PHONES.length,c:'var(--green)'},{l:'Online',v:online,c:'var(--green)'},{l:'Offline',v:COMMS_PHONES.length-online,c:'var(--red)'},{l:'Đường dây nóng',v:1,c:'var(--yellow)'}].map(k=>`
    <div class="card" style="padding:14px 16px"><div style="font-size:11px;color:var(--muted)">${k.l}</div><div style="font-size:22px;font-weight:800;color:${k.c}">${k.v}</div></div>`).join('')}
  </div>
  <div class="card" style="padding:0">
    <div class="card-header">
      <span class="card-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
        Danh bạ Điện thoại IP
      </span>
      <div style="display:flex;gap:8px">
        <input type="text" class="form-control form-control-sm" placeholder="Tìm số máy..." style="width:150px" oninput="this.closest('.card').querySelectorAll('tbody tr').forEach(r=>r.style.display=r.textContent.toLowerCase().includes(this.value.toLowerCase())?'':'none')">
        <button class="btn btn-primary btn-sm" onclick="showToast('Mở form thêm máy điện thoại IP...')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Thêm máy
        </button>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Ext</th><th>Tên / Vị trí</th><th>Người dùng</th><th>IP Address</th><th>Model</th><th>Trạng thái</th><th>Cuộc gọi cuối</th><th>Thao tác</th></tr></thead>
        <tbody>
          ${COMMS_PHONES.map(p => `
          <tr>
            <td><strong style="font-size:14px;color:${p.ext==='1800'?'var(--yellow)':'var(--cyan)'}">${p.ext}</strong></td>
            <td style="font-size:12px;font-weight:500">${p.name}</td>
            <td style="font-size:12px;color:var(--muted)">${p.user}</td>
            <td><code style="font-size:11px;color:var(--muted)">${p.ip}</code></td>
            <td style="font-size:11px;color:var(--muted)">${p.model}</td>
            <td>
              <div style="display:flex;align-items:center;gap:5px">
                <div style="width:7px;height:7px;border-radius:50%;background:${p.status==='online'?'var(--green)':'var(--muted)'};${p.status==='online'?'box-shadow:0 0 5px var(--green)':''}"></div>
                <span style="font-size:11px;color:${p.status==='online'?'var(--green)':'var(--muted)'}">${p.status==='online'?'Online':'Offline'}</span>
              </div>
            </td>
            <td style="font-size:11px;color:var(--muted)">${p.lastCall}</td>
            <td>
              <div style="display:flex;gap:3px">
                <button class="btn btn-ghost btn-xs" title="Gọi" onclick="showToast('Đang kết nối tới máy lẻ ${p.ext}...')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                </button>
                <button class="btn btn-ghost btn-xs" title="Cài đặt" onclick="showToast('Cài đặt máy ${p.ext}...')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                </button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

// ── TAB: MÀN HÌNH & BẢNG LED ──────────────────────────────────────
function renderCdDisplays() {
  const typeLabel = { led_wall:'LED Wall', signage:'Digital Signage', outdoor_led:'Bảng LED ngoài trời', smarttv:'Smart TV' };
  const typeColor = { led_wall:'var(--cyan)', signage:'var(--blue)', outdoor_led:'var(--green)', smarttv:'var(--purple)' };
  return `
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px">
    ${[{l:'Tổng thiết bị',v:COMMS_DISPLAYS.length,c:'var(--purple)'},{l:'Đang hiển thị',v:COMMS_DISPLAYS.filter(d=>d.status==='online').length,c:'var(--green)'},{l:'Standby',v:COMMS_DISPLAYS.filter(d=>d.status==='standby').length,c:'var(--muted)'},{l:'Offline',v:COMMS_DISPLAYS.filter(d=>d.status==='offline').length,c:'var(--red)'}].map(k=>`
    <div class="card" style="padding:14px 16px"><div style="font-size:11px;color:var(--muted)">${k.l}</div><div style="font-size:22px;font-weight:800;color:${k.c}">${k.v}</div></div>`).join('')}
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">
    ${COMMS_DISPLAYS.map(d => `
    <div class="card" style="padding:16px">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px">
        <div>
          <div style="font-size:13px;font-weight:700">${d.name}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">${d.location}</div>
        </div>
        <div style="display:flex;align-items:center;gap:5px">
          <div style="width:7px;height:7px;border-radius:50%;background:${d.status==='online'?'var(--green)':d.status==='standby'?'var(--yellow)':'var(--muted)'};${d.status==='online'?'box-shadow:0 0 5px var(--green)':''}"></div>
          <span style="font-size:10px;color:${d.status==='online'?'var(--green)':d.status==='standby'?'var(--yellow)':'var(--muted)'}">${d.status==='online'?'Online':d.status==='standby'?'Standby':'Offline'}</span>
        </div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
        <span style="padding:2px 8px;border-radius:5px;font-size:10px;border:1px solid var(--border);color:${typeColor[d.type]}">${typeLabel[d.type]||d.type}</span>
        <span style="padding:2px 8px;border-radius:5px;font-size:10px;border:1px solid var(--border);color:var(--muted)">${d.size}</span>
      </div>
      <div style="padding:8px 10px;background:rgba(255,255,255,.03);border-radius:7px;font-size:11px;color:var(--muted);margin-bottom:12px">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        ${d.content}
      </div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-ghost btn-sm" style="flex:1" onclick="openDisplayContent('${d.id}','${d.name}')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Nội dung
        </button>
        <button class="btn btn-ghost btn-sm" onclick="showToast('${d.status==='standby'?'Đang bật màn hình '+d.name+'...':'Đang tắt màn hình '+d.name+'...'}')">${d.status==='standby'?'Bật':'Tắt'}</button>
      </div>
    </div>`).join('')}
    <div class="card" style="padding:16px;border-style:dashed;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:180px;cursor:pointer;opacity:.55" onclick="showToast('Mở form thêm màn hình / bảng LED...')">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      <div style="font-size:12px;color:var(--muted);margin-top:8px">Thêm thiết bị</div>
    </div>
  </div>`;
}

// ── Actions ────────────────────────────────────────────────────────
function openCdBroadcastAll() {
  const sp = window.NOTIFY_SPEAKERS || [];
  const online = sp.filter(s => s.status === 'online');
  openModal(`
    <div class="modal-header">
      <span class="modal-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>
        Phát thông báo khẩn — ${online.length} cụm loa online
      </span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Loại thông báo</label>
        <select class="form-control" id="bcType">
          <option>Cảnh báo mưa lũ</option><option>Sạt lở đất</option>
          <option>Ngập đường / cầu</option><option>Dâng nước khẩn cấp</option>
          <option>Thông báo chung</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Nội dung phát thanh <span style="color:var(--red)">*</span></label>
        <textarea id="bcText" class="form-control" rows="4" placeholder="Nhập nội dung thông báo cần phát..."></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Chọn cụm loa</label>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${online.map(s => `<label style="display:flex;align-items:center;gap:5px;padding:4px 10px;border:1px solid var(--border);border-radius:7px;font-size:12px;cursor:pointer">
            <input type="checkbox" checked style="accent-color:var(--cyan)"> ${s.name}
          </label>`).join('')}
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Số lần lặp</label>
        <select class="form-control" id="bcRepeat" style="width:120px">
          <option value="1">1 lần</option><option value="2">2 lần</option>
          <option value="3" selected>3 lần</option><option value="5">5 lần</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Hủy
      </button>
      <button class="btn btn-primary" onclick="closeModal();showToast('Đang phát thông báo khẩn đến ${online.length} cụm loa...');setTimeout(()=>showToast('Đã phát thành công!'),2500)">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>
        Phát ngay
      </button>
    </div>
  `);
}

function openDisplayContent(id, name) {
  const d = COMMS_DISPLAYS.find(x => x.id === id);
  openModal(`
    <div class="modal-header">
      <span class="modal-title">Quản lý nội dung — ${name}</span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Nội dung hiện tại</label>
        <div style="padding:10px 14px;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:8px;font-size:13px">${d?.content||'—'}</div>
      </div>
      <div class="form-group">
        <label class="form-label">Nguồn nội dung</label>
        <select class="form-control">
          <option>Dashboard PCTT + Camera</option>
          <option>Bản đồ GIS + IoT</option>
          <option>Thông báo nội bộ + Thời tiết</option>
          <option>Cảnh báo mưa lũ khu vực</option>
          <option>Tùy chỉnh (URL)...</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Chu kỳ xoay nội dung (giây)</label>
        <input type="number" class="form-control" value="${d?.rotation||30}" style="width:120px" min="0" max="300">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Hủy</button>
      <button class="btn btn-primary" onclick="closeModal();showToast('Đã cập nhật nội dung màn hình: ${name}!')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Lưu</button>
    </div>
  `);
}

function openAddRadio() {
  openModal(`
    <div class="modal-header">
      <span class="modal-title">Thêm Bộ đàm</span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group"><label class="form-label">Tên / Mã thiết bị</label><input id="ar_name" type="text" class="form-control" placeholder="BĐ-009"></div>
        <div class="form-group"><label class="form-label">Model</label><input id="ar_model" type="text" class="form-control" placeholder="Kenwood TK-2402"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Đội / Nhóm</label><input id="ar_team" type="text" class="form-control" placeholder="Đội ƯCSC số 1"></div>
        <div class="form-group"><label class="form-label">Kênh mặc định</label>
          <select id="ar_ch" class="form-control">
            <option>CH-1 (156.000 MHz)</option><option>CH-2 (156.025 MHz)</option>
            <option>CH-3 (156.050 MHz)</option><option>Khẩn cấp (156.800 MHz)</option>
          </select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Hủy</button>
      <button class="btn btn-primary" onclick="saveNewRadio()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Thêm</button>
    </div>
  `);
}

function saveNewRadio() {
  const name = document.getElementById('ar_name')?.value?.trim();
  if (!name) { showToast('Nhập tên thiết bị!', 'error'); return; }
  COMMS_RADIOS.push({ id:'r'+Date.now(), name, model:document.getElementById('ar_model')?.value||'', team:document.getElementById('ar_team')?.value||'Dự phòng', assignee:'—', channel:document.getElementById('ar_ch')?.value||'CH-1', battery:100, status:'standby' });
  closeModal();
  showToast('Đã thêm bộ đàm: ' + name + '!');
  document.getElementById('commsContent').innerHTML = getCommsTabContent();
}

function assignRadio(id, name) {
  openModal(`
    <div class="modal-header">
      <span class="modal-title">Phân công bộ đàm — ${name}</span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <div class="form-group"><label class="form-label">Phân công cho cán bộ</label>
        <select id="ra_person" class="form-control">
          <option value="">— Chọn cán bộ —</option>
          ${DATA.employees.map(e=>`<option value="${e.name}">${e.name} — ${e.dept}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Đội / Nhiệm vụ</label>
        <input id="ra_team" type="text" class="form-control" placeholder="Đội tuần tra đê...">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Hủy</button>
      <button class="btn btn-primary" onclick="doAssignRadio('${id}')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Phân công</button>
    </div>
  `);
}

function doAssignRadio(id) {
  const r = COMMS_RADIOS.find(x => x.id === id);
  const person = document.getElementById('ra_person')?.value;
  const team   = document.getElementById('ra_team')?.value;
  if (r && person) { r.assignee = person; r.team = team || r.team; r.status = 'active'; }
  closeModal();
  showToast('Đã phân công bộ đàm cho ' + person);
  document.getElementById('commsContent').innerHTML = getCommsTabContent();
}

function editRadio(id) {
  const r = COMMS_RADIOS.find(x => x.id === id);
  if (!r) return;
  showToast('Chỉnh sửa: ' + r.name + ' (đang phát triển)');
}

// ── ENHANCED: Edit Radio Modal ─────────────────────────────────────
function editRadio(id) {
  const r = COMMS_RADIOS.find(x => x.id === id);
  if (!r) return;
  openModal(`
    <div class="modal-header">
      <span class="modal-title">Chỉnh sửa bộ đàm — ${r.name}</span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Tên / Mã thiết bị</label>
          <input id="er_name" type="text" class="form-control" value="${r.name}">
        </div>
        <div class="form-group">
          <label class="form-label">Model</label>
          <input id="er_model" type="text" class="form-control" value="${r.model}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Đội / Nhóm</label>
          <input id="er_team" type="text" class="form-control" value="${r.team}">
        </div>
        <div class="form-group">
          <label class="form-label">Kênh liên lạc</label>
          <select id="er_ch" class="form-control">
            ${['CH-1 (156.000 MHz)','CH-2 (156.025 MHz)','CH-3 (156.050 MHz)','Khẩn cấp (156.800 MHz)'].map(c=>`<option ${r.channel===c?'selected':''}>${c}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Người giữ</label>
          <select id="er_person" class="form-control">
            <option value="—" ${r.assignee==='—'?'selected':''}>— Chưa phân công —</option>
            ${DATA.employees.map(e=>`<option value="${e.name}" ${r.assignee===e.name?'selected':''}>${e.name} — ${e.dept}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Trạng thái</label>
          <select id="er_status" class="form-control">
            <option value="active" ${r.status==='active'?'selected':''}>Đang sử dụng</option>
            <option value="standby" ${r.status==='standby'?'selected':''}>Dự phòng</option>
            <option value="charging" ${r.status==='charging'?'selected':''}>Đang sạc</option>
            <option value="repair" ${r.status==='repair'?'selected':''}>Bảo trì / Sửa chữa</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Pin hiện tại (%)</label>
        <div style="display:flex;align-items:center;gap:10px">
          <input type="range" id="er_bat" min="0" max="100" value="${r.battery}" style="flex:1;accent-color:var(--cyan)"
            oninput="document.getElementById('er_bat_val').textContent=this.value+'%'">
          <span id="er_bat_val" style="font-size:13px;color:var(--cyan);min-width:36px">${r.battery}%</span>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost btn-sm" style="color:var(--red);margin-right:auto" onclick="if(confirm('Xoá bộ đàm ${r.name}?')){COMMS_RADIOS.splice(COMMS_RADIOS.indexOf(COMMS_RADIOS.find(x=>x.id==='${r.id}')),1);closeModal();showToast('Đã xoá bộ đàm: ${r.name}');document.getElementById('commsContent').innerHTML=getCommsTabContent();}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg> Xoá
      </button>
      <button class="btn btn-ghost" onclick="closeModal()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Hủy
      </button>
      <button class="btn btn-primary" onclick="saveEditRadio('${r.id}')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Lưu thay đổi
      </button>
    </div>
  `);
}

function saveEditRadio(id) {
  const r = COMMS_RADIOS.find(x => x.id === id); if (!r) return;
  r.name     = document.getElementById('er_name')?.value?.trim()   || r.name;
  r.model    = document.getElementById('er_model')?.value?.trim()  || r.model;
  r.team     = document.getElementById('er_team')?.value?.trim()   || r.team;
  r.channel  = document.getElementById('er_ch')?.value             || r.channel;
  r.assignee = document.getElementById('er_person')?.value         || r.assignee;
  r.status   = document.getElementById('er_status')?.value         || r.status;
  r.battery  = parseInt(document.getElementById('er_bat')?.value)  || r.battery;
  closeModal();
  showToast('Đã lưu thay đổi bộ đàm: ' + r.name);
  document.getElementById('commsContent').innerHTML = getCommsTabContent();
}

// ── ENHANCED: Phone Call Log + Settings ────────────────────────────
const PHONE_CALL_LOGS = [
  { ext:'102', to:'101', dur:'4:22', time:'07:45', type:'internal', dir:'out' },
  { ext:'1800',to:'0985-123-456', dur:'2:11', time:'07:50', type:'external', dir:'in' },
  { ext:'102', to:'201', dur:'1:05', time:'06:55', type:'internal', dir:'out' },
  { ext:'105', to:'103', dur:'3:40', time:'07:20', type:'internal', dir:'in' },
  { ext:'103', to:'0912-999-111', dur:'8:15', time:'06:30', type:'external', dir:'out' },
  { ext:'101', to:'104', dur:'0:43', time:'05:55', type:'internal', dir:'out' },
];

window.openPhoneCallLog = function(extId) {
  const p = COMMS_PHONES.find(x => x.id === extId);
  if (!p) return;
  const logs = PHONE_CALL_LOGS.filter(l => l.ext === p.ext);
  openModal(`
    <div class="modal-header">
      <span class="modal-title">Lịch sử cuộc gọi — Máy lẻ ${p.ext}: ${p.name}</span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      ${logs.length === 0 ? '<p style="color:var(--muted);text-align:center;padding:20px">Không có lịch sử cuộc gọi hôm nay</p>' : `
      <div class="table-wrap">
        <table>
          <thead><tr><th>Thời gian</th><th>Loại</th><th>Đến / Từ</th><th>Thời lượng</th><th>Chiều</th></tr></thead>
          <tbody>
            ${logs.map(l=>`<tr>
              <td style="font-size:12px;color:var(--muted)">${l.time}</td>
              <td><span style="font-size:10px;padding:2px 7px;border-radius:4px;background:rgba(${l.type==='external'?'239,68,68':'0,200,255'},.1);color:${l.type==='external'?'var(--red)':'var(--cyan)'};">${l.type==='external'?'Ngoại tuyến':'Nội bộ'}</span></td>
              <td style="font-size:12px">${l.to}</td>
              <td style="font-size:12px;color:var(--cyan)">${l.dur}</td>
              <td>
                <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:${l.dir==='in'?'var(--green)':'var(--blue)'}">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${l.dir==='in'?'<polyline points="23 7 13 17 8 12 2 18"/><polyline points="17 7 23 7 23 13"/>':'<polyline points="1 17 11 7 16 12 22 6"/><polyline points="7 6 1 6 1 12"/>'}</svg>
                  ${l.dir==='in'?'Đến':'Đi'}
                </div>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>`}
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Đóng</button>
    </div>
  `, { width:'620px' });
};

window.openPhoneSettings = function(extId) {
  const p = COMMS_PHONES.find(x => x.id === extId);
  if (!p) return;
  openModal(`
    <div class="modal-header">
      <span class="modal-title">Cài đặt máy lẻ ${p.ext} — ${p.name}</span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Tên / Vị trí</label>
          <input type="text" class="form-control" value="${p.name}">
        </div>
        <div class="form-group">
          <label class="form-label">Người phụ trách</label>
          <input type="text" class="form-control" value="${p.user}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">IP Address</label>
          <input type="text" class="form-control" value="${p.ip}" style="font-family:monospace">
        </div>
        <div class="form-group">
          <label class="form-label">Số máy lẻ (Extension)</label>
          <input type="text" class="form-control" value="${p.ext}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Model thiết bị</label>
        <input type="text" class="form-control" value="${p.model}" readonly style="opacity:.6">
      </div>
      <div class="form-group">
        <label class="form-label">Chế độ</label>
        <select class="form-control">
          <option selected>Hoạt động bình thường</option>
          <option>Chỉ nhận cuộc gọi</option>
          <option>Chuyển tiếp cuộc gọi</option>
          <option>Không làm phiền</option>
        </select>
      </div>
      <div class="form-group" style="margin-bottom:0">
        <label class="form-label">Nhạc chuông</label>
        <select class="form-control">
          <option selected>Chuẩn (Default)</option>
          <option>Cảnh báo khẩn cấp</option>
          <option>Nhạc chuông 1</option>
          <option>Nhạc chuông 2</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Hủy</button>
      <button class="btn btn-primary" onclick="closeModal();showToast('Đã lưu cài đặt máy lẻ ${p.ext}')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Lưu</button>
    </div>
  `);
};

// ── ENHANCED: Display Content Scheduler ───────────────────────────
const DISPLAY_PLAYLISTS = {
  d1: [
    { type:'live', content:'Dashboard PCTT realtime', dur:'—' },
    { type:'live', content:'Camera CCTV (4 góc)', dur:'—' },
  ],
  d2: [
    { type:'live', content:'Bản đồ GIS + lớp IoT', dur:'—' },
    { type:'slide', content:'Biểu đồ mưa 24h', dur:'30s' },
  ],
  d3: [
    { type:'slide', content:'Thông báo nội bộ tháng 3', dur:'15s' },
    { type:'slide', content:'Dự báo thời tiết 7 ngày', dur:'15s' },
    { type:'slide', content:'Lịch trực tuần này', dur:'10s' },
  ],
  d4: [
    { type:'text',  content:'⚠️ CẢNH BÁO MƯA LỚN — Ba Vì — Mỹ Đức ngày 13/3', dur:'10s' },
  ],
  d5: [], d6: [],
};

window.openDisplayContent = function(id, name) {
  const d = COMMS_DISPLAYS.find(x => x.id === id);
  const pl = DISPLAY_PLAYLISTS[id] || [];
  openModal(`
    <div class="modal-header">
      <span class="modal-title">Nội dung & Playlist — ${name}</span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
        <div>
          <div class="form-group">
            <label class="form-label">Nguồn nội dung chính</label>
            <select class="form-control" id="dc_source">
              <option ${d?.content?.includes('Dashboard')?'selected':''}>Dashboard PCTT + Camera</option>
              <option ${d?.content?.includes('GIS')?'selected':''}>Bản đồ GIS + IoT</option>
              <option ${d?.content?.includes('Thông báo')?'selected':''}>Thông báo nội bộ + Thời tiết</option>
              <option ${d?.content?.includes('Cảnh báo')?'selected':''}>Cảnh báo mưa lũ khu vực</option>
              <option>Lịch trực & Sự kiện</option>
              <option>Tùy chỉnh URL...</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Chu kỳ xoay nội dung (giây, 0 = không xoay)</label>
            <input type="number" class="form-control" id="dc_rotation" value="${d?.rotation||0}" min="0" max="300">
          </div>
          <div class="form-group">
            <label class="form-label">Độ sáng màn hình (%)</label>
            <div style="display:flex;align-items:center;gap:8px">
              <input type="range" min="10" max="100" value="80" style="flex:1;accent-color:var(--cyan)"
                oninput="document.getElementById('dc_bri_val').textContent=this.value+'%'">
              <span id="dc_bri_val" style="font-size:12px;color:var(--cyan);min-width:36px">80%</span>
            </div>
          </div>
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Lịch tắt màn hình</label>
            <div style="display:flex;gap:8px">
              <div>
                <div style="font-size:10px;color:var(--muted);margin-bottom:4px">Tắt lúc</div>
                <input type="time" class="form-control" value="22:00" style="width:100px">
              </div>
              <div>
                <div style="font-size:10px;color:var(--muted);margin-bottom:4px">Bật lại</div>
                <input type="time" class="form-control" value="07:00" style="width:100px">
              </div>
            </div>
          </div>
        </div>
        <div>
          <label class="form-label">Playlist nội dung</label>
          <div id="dc_playlist" style="display:flex;flex-direction:column;gap:5px;max-height:220px;overflow-y:auto;margin-bottom:10px">
            ${pl.length===0?'<div style="color:var(--muted);font-size:12px;text-align:center;padding:20px">Chưa có playlist</div>':pl.map((item,i)=>`
            <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:7px;background:rgba(255,255,255,.04);border:1px solid var(--border)">
              <div style="width:20px;height:20px;border-radius:4px;background:${item.type==='live'?'rgba(0,200,255,.15)':item.type==='slide'?'rgba(99,102,241,.15)':'rgba(239,68,68,.15)'};display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${item.type==='live'?'var(--cyan)':item.type==='slide'?'var(--blue)':'var(--red)'}" stroke-width="2">${item.type==='live'?'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>':'<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>'}</svg>
              </div>
              <div style="flex:1;min-width:0">
                <div style="font-size:11px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${item.content}</div>
                <div style="font-size:10px;color:var(--muted)">${item.type==='live'?'LIVE':'Slide'} · ${item.dur}</div>
              </div>
              <button onclick="DISPLAY_PLAYLISTS['${id}'].splice(${i},1);openDisplayContent('${id}','${name}')" style="width:20px;height:20px;border-radius:4px;border:none;background:transparent;cursor:pointer;color:var(--muted);display:flex;align-items:center;justify-content:center">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>`).join('')}
          </div>
          <div style="display:flex;gap:6px">
            <select id="dc_add_type" class="form-control" style="width:90px;font-size:11px">
              <option value="live">Live</option>
              <option value="slide">Slide</option>
              <option value="text">Text LED</option>
            </select>
            <input type="text" id="dc_add_content" class="form-control" placeholder="Nội dung / URL..." style="flex:1;font-size:11px">
            <button class="btn btn-ghost btn-sm" onclick="
              const c=document.getElementById('dc_add_content').value.trim();
              const t=document.getElementById('dc_add_type').value;
              if(!c){showToast('Nhập nội dung!');return;}
              if(!DISPLAY_PLAYLISTS['${id}'])DISPLAY_PLAYLISTS['${id}']=[];
              DISPLAY_PLAYLISTS['${id}'].push({type:t,content:c,dur:'30s'});
              openDisplayContent('${id}','${name}');">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Hủy</button>
      <button class="btn btn-outline btn-sm" onclick="showToast('Đang xem trước trên: ${name}...')">Xem trước</button>
      <button class="btn btn-primary" onclick="closeModal();showToast('Đã lưu cài đặt màn hình: ${name}!')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Lưu cài đặt</button>
    </div>
  `, { width:'800px' });
};

// ── Patch renderCdPhones to add call log & settings buttons ────────
// Override the original renderCdPhones with enhanced version
function renderCdPhones() {
  const online = COMMS_PHONES.filter(p => p.status === 'online').length;
  const hotline = COMMS_PHONES.find(p => p.ext === '1800');
  return `
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px">
    ${[
      {l:'Tổng máy',v:COMMS_PHONES.length,c:'var(--green)'},
      {l:'Online',v:online,c:'var(--green)'},
      {l:'Offline',v:COMMS_PHONES.length-online,c:'var(--red)'},
      {l:'Đường dây nóng',v:hotline?hotline.ext:'N/A',c:'var(--yellow)'}
    ].map(k=>`<div class="card" style="padding:14px 16px"><div style="font-size:11px;color:var(--muted)">${k.l}</div><div style="font-size:22px;font-weight:800;color:${k.c}">${k.v}</div></div>`).join('')}
  </div>
  ${COMMS_PHONES.filter(p=>p.status==='offline').length>0?`
  <div style="padding:10px 14px;background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.2);border-radius:9px;font-size:12px;color:var(--red);margin-bottom:14px">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:5px"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    <strong>${COMMS_PHONES.filter(p=>p.status==='offline').length} máy điện thoại đang offline</strong> — kiểm tra kết nối mạng hoặc nguồn điện.
  </div>`:''} 
  <div class="card" style="padding:0">
    <div class="card-header">
      <span class="card-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
        Danh bạ Điện thoại IP / VOIP
      </span>
      <div style="display:flex;gap:8px">
        <input type="text" class="form-control form-control-sm" placeholder="Tìm số máy / tên..." style="width:160px"
          oninput="this.closest('.card').querySelectorAll('tbody tr').forEach(r=>r.style.display=r.textContent.toLowerCase().includes(this.value.toLowerCase())?'':'none')">
        <button class="btn btn-ghost btn-sm" onclick="showToast('Đang đồng bộ danh bạ từ IP PBX...')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
          Đồng bộ PBX
        </button>
        <button class="btn btn-primary btn-sm" onclick="showToast('Mở form thêm máy điện thoại IP...')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Thêm máy
        </button>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Ext</th><th>Tên / Vị trí</th><th>Người dùng</th><th>IP Address</th><th>Model</th><th>Trạng thái</th><th>Cuộc gọi cuối</th><th>Thao tác</th></tr></thead>
        <tbody>
          ${COMMS_PHONES.map(p => `
          <tr>
            <td><strong style="font-size:14px;color:${p.ext==='1800'?'var(--yellow)':'var(--cyan)'}">${p.ext}</strong>${p.ext==='1800'?'<div style="font-size:9px;color:var(--yellow)">HOTLINE</div>':''}</td>
            <td style="font-size:12px;font-weight:500">${p.name}</td>
            <td style="font-size:12px;color:var(--muted)">${p.user}</td>
            <td><code style="font-size:10px;color:var(--muted)">${p.ip}</code></td>
            <td style="font-size:11px;color:var(--muted)">${p.model}</td>
            <td>
              <div style="display:flex;align-items:center;gap:5px">
                <div style="width:7px;height:7px;border-radius:50%;background:${p.status==='online'?'var(--green)':'var(--muted)'};${p.status==='online'?'box-shadow:0 0 5px var(--green)':''}"></div>
                <span style="font-size:11px;color:${p.status==='online'?'var(--green)':'var(--muted)'}">${p.status==='online'?'Online':'Offline'}</span>
              </div>
            </td>
            <td style="font-size:11px;color:var(--muted)">${p.lastCall}</td>
            <td>
              <div style="display:flex;gap:3px">
                <button class="btn btn-ghost btn-xs" title="Gọi" onclick="showToast('Đang kết nối tới máy lẻ ${p.ext}...')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                </button>
                <button class="btn btn-ghost btn-xs" title="Lịch sử cuộc gọi" onclick="openPhoneCallLog('${p.id}')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
                </button>
                <button class="btn btn-ghost btn-xs" title="Cài đặt" onclick="openPhoneSettings('${p.id}')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                </button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}
