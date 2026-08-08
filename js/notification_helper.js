// ── NOTIFICATION HELPER — Shared multi-channel send modal ──────────
// Shared data store (referenced by hrm.js tabs)
window.NOTIFY_GROUPS = [
  { id: 'g1', name: 'Ban Chỉ huy PCTT', desc: 'Lãnh đạo + Điều hành PCTT', channels: ['zalo','email','ioc'], members: ['NV001','NV002','NV003'], color: 'var(--danger)' },
  { id: 'g2', name: 'Nhóm Trực ban 24/7', desc: 'Cán bộ trực ca tại IOC', channels: ['ioc','app','speaker'], members: ['NV004','NV005','NV006'], color: 'var(--primary)' },
  { id: 'g3', name: 'Nhóm Kỹ thuật hiện trường', desc: 'Kỹ sư vận hành + tuần tra', channels: ['zalo','app'], members: ['NV004','NV007'], color: 'var(--info)' },
  { id: 'g4', name: 'Toàn cơ quan', desc: 'Tất cả CBCNV Chi cục TT-PCTT', channels: ['email','ioc','app'], members: [], color: 'var(--success)' },
  { id: 'g5', name: 'Đội Tuần tra Đê', desc: 'Tuần tra Hữu Hồng + Hữu Đáy', channels: ['zalo','telegram'], members: ['NV005','NV006'], color: 'var(--warning)' },
  { id: 'g6', name: 'BCH Quận/Huyện', desc: 'Liên hệ liên đơn vị', channels: ['email','zalo'], members: [], color: 'var(--purple)' },
];

window.NOTIFY_SPEAKERS = [
  { id: 'sp1', name: 'Loa IOC — Phòng điều hành', location: 'Tầng 3, Trụ sở Chi cục', type: 'indoor', status: 'online', endpoint: 'http://192.168.1.50/api/broadcast', lastPing: '16:45' },
  { id: 'sp2', name: 'Loa sảnh tầng 1', location: 'Sảnh chính, Trụ sở Chi cục', type: 'indoor', status: 'online', endpoint: 'http://192.168.1.51/api/broadcast', lastPing: '16:45' },
  { id: 'sp3', name: 'Điểm phát thanh Quận Ba Đình', location: 'UBND Quận Ba Đình', type: 'public', status: 'online', endpoint: 'https://pa.badinhhn.vn/api/broadcast', lastPing: '16:30' },
  { id: 'sp4', name: 'Điểm phát thanh Huyện Ba Vì', location: 'UBND Huyện Ba Vì', type: 'public', status: 'offline', endpoint: 'https://pa.bavi.hanoi.gov.vn/api/broadcast', lastPing: '08:12' },
  { id: 'sp5', name: 'Điểm phát thanh Huyện Chương Mỹ', location: 'UBND Ch. Mỹ', type: 'public', status: 'online', endpoint: 'https://pa.chuongmy.hanoi.gov.vn/api/broadcast', lastPing: '16:40' },
  { id: 'sp6', name: 'Loa cơ động đội ƯCSC', location: 'Xe cơ động đội ƯCSC', type: 'mobile', status: 'online', endpoint: 'http://10.10.0.22/api/broadcast', lastPing: '16:42' },
];

const NOTIFY_CHANNEL_META = {
  zalo:     { label: 'Zalo OA',        icon: '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>',                                       color: '#0068ff' },
  email:    { label: 'Email',           icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',  color: 'var(--primary)' },
  ioc:      { label: 'IOC Push',        icon: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',  color: 'var(--success)' },
  speaker:  { label: 'Phát Loa',        icon: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M15.54 8.46a5 5 0 010 7.07"/>',  color: 'var(--warning)' },
  app:      { label: 'App Mobile',      icon: '<rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',         color: 'var(--info)' },
  telegram: { label: 'Telegram',        icon: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',                          color: '#29b6f6' },
  sms:      { label: 'SMS Brandname',   icon: '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>',                                        color: 'var(--muted)' },
};

/**
 * Open the multi-channel notification target selector modal.
 * @param {Object} ctx - { title, content, type } context of the alert/bulletin
 */
function openNotifyTargetModal(ctx = {}) {
  const { title = 'Thông báo', content = '', type = '' } = ctx;
  const employees = (typeof DATA !== 'undefined' && DATA.employees) ? DATA.employees : [];
  const groups    = window.NOTIFY_GROUPS;
  const speakers  = window.NOTIFY_SPEAKERS;

  openModal(`
    <div class="modal-header">
      <span class="modal-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
        Gửi Thông báo
      </span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body" style="max-height:78vh;overflow-y:auto">

      <!-- Context pill -->
      ${title ? `<div style="background:rgba(0,200,255,.06);border:1px solid rgba(0,200,255,.18);border-radius:8px;padding:10px 14px;margin-bottom:16px;font-size:12px">
        <span style="color:var(--muted)">Nội dung gửi:</span>
        <strong style="margin-left:6px">${title}</strong>
      </div>` : ''}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">

        <!-- LEFT: channels + groups + individuals -->
        <div style="display:flex;flex-direction:column;gap:14px">

          <!-- Kênh gửi -->
          <div>
            <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px">Kênh gửi</div>
            <div id="notifyChannels" style="display:flex;flex-wrap:wrap;gap:8px">
              ${Object.entries(NOTIFY_CHANNEL_META).map(([id, m]) => `
              <label id="ch_label_${id}" style="display:flex;align-items:center;gap:6px;padding:7px 12px;border:1.5px solid var(--border);border-radius:8px;cursor:pointer;background:transparent;transition:.15s" onclick="toggleNotifyChannel('${id}')">
                <input type="checkbox" id="ch_${id}" style="display:none" onchange="syncNotifyChannelStyle('${id}')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${m.color}" stroke-width="2">${m.icon}</svg>
                <span style="font-size:12px;font-weight:500">${m.label}</span>
              </label>`).join('')}
            </div>
          </div>

          <!-- Nhóm -->
          <div>
            <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px">Gửi đến Nhóm</div>
            <div style="max-height:180px;overflow-y:auto;display:flex;flex-direction:column;gap:6px" id="notifyGroupList">
              ${groups.map(g => `
              <label style="display:flex;align-items:center;gap:10px;padding:9px 12px;border:1px solid var(--border);border-radius:8px;cursor:pointer;background:rgba(255,255,255,.02)" id="grp_label_${g.id}" onclick="toggleNotifyGroup('${g.id}')">
                <input type="checkbox" id="grp_${g.id}" style="accent-color:${g.color}">
                <div style="width:8px;height:8px;border-radius:50%;background:${g.color};flex-shrink:0"></div>
                <div style="flex:1;min-width:0">
                  <div style="font-size:12px;font-weight:600">${g.name}</div>
                  <div style="font-size:10px;color:var(--muted)">${g.desc}</div>
                </div>
                <div style="font-size:10px;color:var(--muted);flex-shrink:0">
                  ${g.channels.map(c => `<span style="color:${NOTIFY_CHANNEL_META[c]?.color || 'var(--muted)'}">${NOTIFY_CHANNEL_META[c]?.label || c}</span>`).join(' · ')}
                </div>
              </label>`).join('')}
            </div>
          </div>

          <!-- Cá nhân -->
          <div>
            <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px">Gửi đến Cá nhân</div>
            <input type="text" class="form-control form-control-sm" placeholder="Tìm tên nhân viên..." style="margin-bottom:8px" oninput="filterNotifyPersons(this.value)">
            <div id="notifyPersonList" style="max-height:160px;overflow-y:auto;display:flex;flex-direction:column;gap:4px">
              ${employees.map(e => `
              <label style="display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:6px;cursor:pointer" class="notify-person-row" data-name="${e.name.toLowerCase()}">
                <input type="checkbox" id="per_${e.id}" style="accent-color:var(--primary)">
                <div style="flex:1">
                  <span style="font-size:12px;font-weight:500">${e.name}</span>
                  <span style="font-size:10px;color:var(--muted);margin-left:6px">${e.dept}</span>
                </div>
                <div style="font-size:10px;color:var(--muted)">${e.email || ''}</div>
              </label>`).join('')}
            </div>
          </div>
        </div>

        <!-- RIGHT: Cụm loa + preview -->
        <div style="display:flex;flex-direction:column;gap:14px">

          <!-- Cụm loa (conditionally shown) -->
          <div id="notifySpeakersSection">
            <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2" style="vertical-align:middle;margin-right:4px"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>
              Cụm Loa Phát Thanh
            </div>
            <div style="display:flex;flex-direction:column;gap:6px">
              ${speakers.map(s => `
              <label style="display:flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid var(--border);border-radius:8px;cursor:pointer;background:rgba(255,255,255,.02);${s.status==='offline'?'opacity:.5':''}">
                <input type="checkbox" id="spk_${s.id}" ${s.status==='offline'?'disabled':''} style="accent-color:var(--warning)">
                <div style="flex:1">
                  <div style="font-size:12px;font-weight:600">${s.name}</div>
                  <div style="font-size:10px;color:var(--muted)">${s.location}</div>
                </div>
                <span class="badge ${s.status==='online'?'badge-green':'badge-gray'}" style="font-size:9px">${s.status==='online'?'Online':'Offline'}</span>
              </label>`).join('')}
            </div>
          </div>

          <!-- Send summary preview -->
          <div style="background:rgba(0,200,255,.04);border:1px solid rgba(0,200,255,.14);border-radius:10px;padding:14px">
            <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px">Xem trước / Thống kê</div>
            <div id="notifySummary" style="font-size:13px;color:var(--text-2);line-height:1.8">
              <div style="color:var(--muted);font-size:12px">Chưa chọn đối tượng gửi</div>
            </div>
          </div>

          <!-- Message override -->
          <div class="form-group">
            <label class="form-label">Nội dung tùy chỉnh <span style="color:var(--muted);font-weight:400;font-size:10px">(tùy chọn)</span></label>
            <textarea class="form-control" rows="4" id="notifyMsgOverride" style="font-size:12px">${content}</textarea>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer" style="justify-content:space-between">
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost btn-sm" onclick="selectAllNotifyGroups()">Chọn tất cả nhóm</button>
        <button class="btn btn-ghost btn-sm" onclick="clearAllNotifySelections()">Bỏ chọn tất cả</button>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
        <button class="btn btn-outline btn-sm" onclick="sendNotifyTest()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Gửi Test
        </button>
        <button class="btn btn-primary" onclick="sendNotifyNow()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          Gửi ngay
        </button>
      </div>
    </div>
  `, { width: '900px' });

  // Init event hooks after render
  setTimeout(() => {
    document.querySelectorAll('[id^="ch_"]').forEach(cb => {
      cb.addEventListener('change', updateNotifySummary);
    });
    document.querySelectorAll('[id^="grp_"]').forEach(cb => {
      cb.addEventListener('change', updateNotifySummary);
    });
    document.querySelectorAll('[id^="per_"]').forEach(cb => {
      cb.addEventListener('change', updateNotifySummary);
    });
    document.querySelectorAll('[id^="spk_"]').forEach(cb => {
      cb.addEventListener('change', updateNotifySummary);
    });
  }, 80);
}

function toggleNotifyChannel(id) {
  const cb = document.getElementById('ch_' + id);
  if (cb) { cb.checked = !cb.checked; syncNotifyChannelStyle(id); updateNotifySummary(); }
}
function syncNotifyChannelStyle(id) {
  const cb = document.getElementById('ch_' + id);
  const label = document.getElementById('ch_label_' + id);
  const m = NOTIFY_CHANNEL_META[id];
  if (!cb || !label || !m) return;
  if (cb.checked) {
    label.style.borderColor = m.color;
    label.style.background = `rgba(${id==='zalo'?'0,104,255':id==='email'?'0,200,255':id==='ioc'?'0,230,118':id==='speaker'?'255,202,40':id==='app'?'33,150,243':id==='telegram'?'41,182,246':'128,128,128'},.1)`;
  } else {
    label.style.borderColor = 'var(--border)';
    label.style.background = 'transparent';
  }
}
function toggleNotifyGroup(id) {
  const cb = document.getElementById('grp_' + id);
  if (cb) { cb.checked = !cb.checked; updateNotifySummary(); }
}
function filterNotifyPersons(q) {
  document.querySelectorAll('.notify-person-row').forEach(row => {
    row.style.display = row.dataset.name.includes(q.toLowerCase()) ? '' : 'none';
  });
}
function selectAllNotifyGroups() {
  document.querySelectorAll('[id^="grp_"]').forEach(cb => { cb.checked = true; });
  updateNotifySummary();
}
function clearAllNotifySelections() {
  document.querySelectorAll('[id^="grp_"],[id^="per_"],[id^="ch_"],[id^="spk_"]').forEach(cb => {
    cb.checked = false; 
  });
  Object.keys(NOTIFY_CHANNEL_META).forEach(id => syncNotifyChannelStyle(id));
  updateNotifySummary();
}
function updateNotifySummary() {
  const channels  = [...document.querySelectorAll('[id^="ch_"]:checked')].map(c => NOTIFY_CHANNEL_META[c.id.replace('ch_','')]?.label || c.id);
  const groups    = [...document.querySelectorAll('[id^="grp_"]:checked')].map(c => window.NOTIFY_GROUPS.find(g=>g.id===c.id.replace('grp_',''))?.name || c.id);
  const persons   = [...document.querySelectorAll('[id^="per_"]:checked')].length;
  const speakers  = [...document.querySelectorAll('[id^="spk_"]:checked')].map(c => window.NOTIFY_SPEAKERS.find(s=>s.id===c.id.replace('spk_',''))?.name || c.id);

  const el = document.getElementById('notifySummary');
  if (!el) return;
  if (!channels.length && !groups.length && !persons && !speakers.length) {
    el.innerHTML = '<div style="color:var(--muted);font-size:12px">Chưa chọn đối tượng gửi</div>'; return;
  }
  el.innerHTML = [
    channels.length  ? `<div><span style="color:var(--muted)">Kênh:</span> <strong>${channels.join(' · ')}</strong></div>` : '',
    groups.length    ? `<div><span style="color:var(--muted)">Nhóm (${groups.length}):</span> <strong>${groups.join(', ')}</strong></div>` : '',
    persons          ? `<div><span style="color:var(--muted)">Cá nhân:</span> <strong>${persons} người</strong></div>` : '',
    speakers.length  ? `<div><span style="color:var(--warning)">Cụm loa (${speakers.length}):</span> <strong>${speakers.join(', ')}</strong></div>` : '',
  ].filter(Boolean).join('');
}
function sendNotifyNow() {
  const channels = [...document.querySelectorAll('[id^="ch_"]:checked')].length;
  const groups   = [...document.querySelectorAll('[id^="grp_"]:checked')].length;
  const persons  = [...document.querySelectorAll('[id^="per_"]:checked')].length;
  const speakers = [...document.querySelectorAll('[id^="spk_"]:checked')].length;
  if (!channels && !groups && !persons && !speakers) { showToast('Vui lòng chọn ít nhất một kênh hoặc đối tượng!', 'error'); return; }
  closeModal();
  showToast(`Đã gửi thông báo: ${groups} nhóm · ${persons} cá nhân · ${speakers} cụm loa`);
}
function sendNotifyTest() {
  closeModal();
  showToast('Đã gửi tin nhắn TEST thành công!');
}
