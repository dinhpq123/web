// ── PCTT SLUICE & PUMP SCHEDULER — MULTI-PROFILE SYSTEM ──────────────
let currentProfileId = null;

function renderScheduler() {
  if (!currentProfileId) {
    const active = DATA.pumpProfiles.find(p => p.isActive);
    currentProfileId = active ? active.id : DATA.pumpProfiles[0]?.id;
  }
  const currentProfile = DATA.pumpProfiles.find(p => p.id === currentProfileId) || DATA.pumpProfiles[0];
  const stations = DATA.pumpStations || [];

  const PROFILE_ICON = {
    flood:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20M2 19h20M6 12V8m4 4V5m4 4V7m4 4V3"/></svg>`,
    storm:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
    dry:      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/></svg>`,
    normal:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    drainage: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 16.9A5 5 0 0018 7h-1.26A8 8 0 104 15.25"/></svg>`,
    holiday:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    test:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><path d="M21 12A9 9 0 1112 3a9 9 0 019 9z"/></svg>`,
  };
  const TYPE_LABEL = { flood:'Mùa Lũ', storm:'Bão/Áp thấp', dry:'Mùa Hạn', normal:'Bình thường', drainage:'Tiêu úng', holiday:'Ngày lễ', test:'Kiểm tra' };

  // Compute stats for current profile
  const totalHours = stations.reduce((sum, s) => {
    const sched = currentProfile.schedules[s.id] || [];
    return sum + sched.reduce((a, iv) => {
      const dur = iv[1] > iv[0] ? iv[1] - iv[0] : (24 - iv[0]) + iv[1];
      return a + dur;
    }, 0);
  }, 0);
  const activeStations = stations.filter(s => (currentProfile.schedules[s.id]||[]).length > 0).length;
  const totalPower = stations.reduce((sum, s) => {
    const sched = currentProfile.schedules[s.id] || [];
    const h = sched.reduce((a, iv) => {
      const dur = iv[1] > iv[0] ? iv[1] - iv[0] : (24 - iv[0]) + iv[1];
      return a + dur;
    }, 0);
    return sum + (s.power || 0) * h / 1000;
  }, 0);

  // GANTT render
  const HOURS = ['00','04','08','12','16','20','24'];
  const ganttRows = stations.map(s => {
    const sched = currentProfile.schedules[s.id] || [];
    const stationHours = sched.reduce((a,iv)=>{ const d=iv[1]>iv[0]?iv[1]-iv[0]:(24-iv[0])+iv[1]; return a+d; },0);
    const bars = sched.map(iv => {
      const pct = (iv[1] > iv[0]) ? (iv[1]-iv[0])/24*100 : ((24-iv[0])+iv[1])/24*100;
      const left = (iv[0]/24)*100;
      return `<div style="position:absolute;left:${left}%;width:${Math.max(pct,1)}%;top:3px;bottom:3px;background:${currentProfile.color};opacity:.88;border-radius:4px;z-index:2;cursor:pointer;display:flex;align-items:center;padding-left:6px;overflow:hidden" title="${s.name}: ${stationHours}h">
        <span style="font-size:9px;color:#fff;white-space:nowrap;font-weight:600">${stationHours > 1 ? stationHours+'h' : ''}</span>
      </div>`;
    }).join('');

    const stIcon = s.type === 'pump' ? '⚙' : '🚧';
    const stColor = { ok:'var(--green)', warning:'var(--yellow)', critical:'var(--red)' }[s.status] || 'var(--muted)';
    return `
    <div style="display:grid;grid-template-columns:180px 1fr 44px 60px;align-items:center;gap:8px;margin-bottom:10px">
      <div style="font-size:12px;font-weight:600;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">
        <span style="color:${stColor};margin-right:4px">●</span>${s.name}
      </div>
      <div style="height:26px;background:rgba(255,255,255,.03);border-radius:4px;position:relative;overflow:hidden;border:1px solid var(--border)">
        ${bars || `<div style="position:absolute;inset:0;display:flex;align-items:center;padding-left:8px"><span style="font-size:10px;color:var(--muted)">Không vận hành</span></div>`}
      </div>
      <div style="text-align:right;font-size:11px;color:${stationHours>0?currentProfile.color:'var(--muted)'};font-weight:700;font-family:'Roboto Mono',monospace">${stationHours}h</div>
      <button class="btn btn-ghost btn-xs" onclick="openEditStationSchedule('${s.id}','${currentProfile.id}')">Cấu hình</button>
    </div>`;
  }).join('');

  return `
  <div class="page-header">
    <div class="page-title">
      <h1>Lịch vận hành Cống/Bơm</h1>
      <p>Quản lý đa kịch bản vận hành cho ${stations.length} trạm bơm và cống điều tiết theo điều kiện KTTV</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-ghost btn-sm" onclick="exportSchedulerPdf()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        Xuất PDF
      </button>
      <button class="btn btn-outline btn-sm" onclick="activateAllScheduler()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        Kích hoạt hàng loạt
      </button>
      <button class="btn btn-primary btn-sm" onclick="openAddProfileModal()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Thêm kịch bản
      </button>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:300px 1fr;gap:20px;align-items:start">
    <!-- Side: Profile List -->
    <div class="card" style="padding:0;overflow:hidden">
      <div class="card-header" style="padding:12px 16px">
        <span class="card-title">Kịch bản vận hành (${DATA.pumpProfiles.length})</span>
      </div>
      <div style="display:flex;flex-direction:column;max-height:680px;overflow-y:auto">
        ${DATA.pumpProfiles.map(p => `
        <div onclick="switchSchProfile('${p.id}')" style="padding:14px 16px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .15s;background:${p.id===currentProfileId?'rgba(0,200,255,.07)':'transparent'};border-left:3px solid ${p.id===currentProfileId?p.color:'transparent'}">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:38px;height:38px;border-radius:10px;background:${p.color}22;color:${p.color};display:flex;align-items:center;justify-content:center;flex-shrink:0">
              ${PROFILE_ICON[p.type] || PROFILE_ICON.normal}
            </div>
            <div style="flex:1;min-width:0">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:4px">
                <span style="font-size:13px;font-weight:700;color:${p.id===currentProfileId?p.color:'inherit'};overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${p.name}</span>
                ${p.isActive ? '<span class="badge badge-green" style="font-size:9px;flex-shrink:0">Active</span>' : ''}
              </div>
              <div style="font-size:10px;color:var(--muted);margin-top:3px;line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${p.desc}</div>
              <div style="margin-top:5px;font-size:10px;color:${p.color}">${TYPE_LABEL[p.type] || 'Tùy chỉnh'} · ${Object.values(p.schedules).filter(s=>s.length>0).length} trạm</div>
            </div>
          </div>
        </div>`).join('')}
      </div>
    </div>

    <!-- Main: GANTT + Details -->
    <div style="display:flex;flex-direction:column;gap:16px">
      <!-- Profile header card -->
      <div class="card" style="padding:0">
        <div style="padding:14px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:42px;height:42px;border-radius:12px;background:${currentProfile.color}22;color:${currentProfile.color};display:flex;align-items:center;justify-content:center">
              ${PROFILE_ICON[currentProfile.type] || PROFILE_ICON.normal}
            </div>
            <div>
              <div style="font-size:16px;font-weight:800">${currentProfile.name}</div>
              <div style="font-size:12px;color:var(--muted)">${currentProfile.desc}</div>
            </div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-ghost btn-sm" onclick="openCloneProfileModal('${currentProfile.id}')">Nhân bản</button>
            <button class="btn btn-ghost btn-sm" style="color:var(--red)" onclick="confirmDeleteProfile('${currentProfile.id}')">Xóa</button>
            ${currentProfile.isActive
              ? `<button class="btn btn-sm" style="background:rgba(0,230,118,.12);color:var(--green);border:1px solid rgba(0,230,118,.3)" disabled>✓ Đang hoạt động</button>`
              : `<button class="btn btn-primary btn-sm" onclick="activateProfile('${currentProfile.id}')">Kích hoạt</button>`}
          </div>
        </div>

        <!-- KPIs -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid var(--border)">
          ${[
            { label: 'Trạm vận hành', val: `${activeStations}/${stations.length}`, color: 'var(--cyan)' },
            { label: 'Tổng giờ bơm/ngày', val: `${totalHours}h`, color: 'var(--yellow)' },
            { label: 'Điện tiêu thụ/ngày', val: `${Math.round(totalPower).toLocaleString()} kWh`, color: 'var(--orange)' },
            { label: 'Điều kiện áp dụng', val: '...' , color: 'var(--muted)' },
          ].map((k,i) => `
          <div style="padding:12px 16px;${i<3?'border-right:1px solid var(--border)':''}">
            <div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">${k.label}</div>
            <div style="font-size:${i===3?'11px':'18px'};font-weight:${i===3?'400':'700'};color:${k.color};line-height:1.3">${i===3?(currentProfile.conditions||'—'):k.val}</div>
          </div>`).join('')}
        </div>

        <!-- GANTT Chart -->
        <div style="padding:16px 20px">
          <div style="display:grid;grid-template-columns:180px 1fr 44px 60px;gap:8px;margin-bottom:10px;border-bottom:1px solid var(--border);padding-bottom:8px">
            <div style="font-size:10px;color:var(--muted);font-weight:700">TRẠM BƠM / CỐNG</div>
            <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);font-family:'Roboto Mono',monospace">
              ${HOURS.map(h=>`<span>${h}h</span>`).join('')}
            </div>
            <div style="font-size:10px;color:var(--muted)">GIỜ</div>
            <div></div>
          </div>
          ${ganttRows}
        </div>

        <div style="padding:12px 20px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,.01)">
          <div style="font-size:11px;color:var(--muted)">* Click "Cấu hình" để điều chỉnh thời gian vận hành từng trạm</div>
          <button class="btn btn-primary btn-sm" onclick="saveProfileChanges('${currentProfile.id}')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
            Lưu thay đổi
          </button>
        </div>
      </div>

      <!-- Station Status Table -->
      <div class="card" style="padding:0">
        <div class="card-header"><span class="card-title">Trạng thái trạm bơm & cống trong kịch bản</span></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Trạm</th><th>Loại</th><th>Địa bàn</th><th>Công suất</th><th>Tổ máy/Cửa</th><th>Giờ vận hành</th><th>Trạng thái</th></tr></thead>
            <tbody>
              ${stations.map(s => {
                const sched = currentProfile.schedules[s.id] || [];
                const h = sched.reduce((a,iv)=>{ const d=iv[1]>iv[0]?iv[1]-iv[0]:(24-iv[0])+iv[1]; return a+d; },0);
                const schedStr = sched.length ? sched.map(iv=>`${String(iv[0]).padStart(2,'0')}h-${String(iv[1]).padStart(2,'0')}h`).join(', ') : '—';
                return `<tr>
                  <td><strong class="mono" style="color:var(--cyan);font-size:12px">${s.id}</strong><br><span style="font-size:12px">${s.name}</span></td>
                  <td><span class="badge ${s.type==='pump'?'badge-blue':'badge-gray'}" style="font-size:10px">${s.type==='pump'?'Trạm bơm':'Cống TL'}</span></td>
                  <td style="font-size:12px;color:var(--muted)">${s.district}</td>
                  <td class="mono" style="font-size:12px">${s.capacity} ${s.unit}</td>
                  <td style="font-size:12px">${s.type==='pump'?`${s.activePumps}/${s.pumps} tổ`:`${s.openGates}/${s.gates} cửa`}</td>
                  <td style="font-size:12px">
                    <div style="font-weight:700;color:${h>0?currentProfile.color:'var(--muted)'}">${h > 0 ? h+'h/ngày' : 'Không vận hành'}</div>
                    <div style="font-size:10px;color:var(--muted)">${schedStr}</div>
                  </td>
                  <td>${statusBadge(s.status)}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>`;
}

window.switchSchProfile = function(id) {
  currentProfileId = id;
  navigate('scheduler');
};

// ── ADD PROFILE MODAL ───────────────────────────────────────────────
window.openAddProfileModal = function() {
  const stations = DATA.pumpStations || [];
  openModal(`
  <div class="modal-header">
    <span class="modal-title">Thêm kịch bản vận hành mới</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body" style="max-height:78vh;overflow-y:auto">
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Tên kịch bản <span style="color:var(--red)">*</span></label>
        <input id="newProfileName" class="form-control" placeholder="VD: Kịch bản Lũ đặc biệt lớn" required>
      </div>
      <div class="form-group">
        <label class="form-label">Loại kịch bản</label>
        <select id="newProfileType" class="form-control">
          <option value="flood">Mùa Lũ / Tiêu thoát khẩn cấp</option>
          <option value="storm">Bão / Áp thấp nhiệt đới</option>
          <option value="dry">Mùa Hạn / Tưới tiêu</option>
          <option value="normal" selected>Vận hành Bình thường</option>
          <option value="drainage">Tiêu úng nội đồng</option>
          <option value="holiday">Ngày lễ / Tết</option>
          <option value="test">Kiểm tra / Thử tải</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Mô tả kịch bản</label>
      <textarea id="newProfileDesc" class="form-control" rows="2" placeholder="Mô tả mục đích và phạm vi áp dụng của kịch bản..."></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Điều kiện kích hoạt</label>
      <input id="newProfileConditions" class="form-control" placeholder="VD: Mực nước Sông Hồng ≥ BĐ3 hoặc mưa 24h > 200mm">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Màu nhận diện</label>
        <div style="display:flex;gap:8px;align-items:center">
          <input id="newProfileColor" type="color" value="#00c8ff" style="width:50px;height:38px;border:1px solid var(--border);border-radius:8px;cursor:pointer;background:none;padding:2px">
          <div style="display:flex;gap:6px">
            ${['#ff3c50','#ff9800','#00e676','#00c8ff','#9c27b0','#e91e63','#607d8b'].map(c=>`
            <div style="width:24px;height:24px;border-radius:6px;background:${c};cursor:pointer;border:2px solid transparent" onclick="document.getElementById('newProfileColor').value='${c}'" title="${c}"></div>`).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Station Schedule Grid -->
    <div style="margin-top:6px">
      <label class="form-label">Thời gian vận hành từng trạm</label>
      <div style="font-size:11px;color:var(--muted);margin-bottom:10px">Nhập khoảng giờ vận hành (VD: 6-18 nghĩa là từ 6h đến 18h). Để trống nếu không vận hành.</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        ${stations.map(s => `
        <div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px;padding:10px 12px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <span style="font-size:12px;font-weight:600">${s.name}</span>
            <span class="badge ${s.type==='pump'?'badge-blue':'badge-gray'}" style="font-size:10px">${s.type==='pump'?'Bơm':'Cống'}</span>
          </div>
          <div style="display:flex;gap:6px;align-items:center">
            <input type="number" id="sch_${s.id}_start" placeholder="Bắt đầu (h)" min="0" max="23" class="form-control" style="flex:1;font-size:12px;padding:6px 8px">
            <span style="color:var(--muted);font-size:12px">→</span>
            <input type="number" id="sch_${s.id}_end" placeholder="Kết thúc (h)" min="1" max="24" class="form-control" style="flex:1;font-size:12px;padding:6px 8px">
          </div>
          <div style="font-size:10px;color:var(--muted);margin-top:5px">Công suất: ${s.capacity} ${s.unit}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-ghost btn-sm" onclick="loadTemplateSchedule()">Dùng mẫu bình thường</button>
    <button class="btn btn-primary" onclick="saveNewProfile()">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
      Tạo kịch bản
    </button>
  </div>`);
};

window.saveNewProfile = function() {
  const name = document.getElementById('newProfileName')?.value?.trim();
  if (!name) { showToast('⚠ Vui lòng nhập tên kịch bản!'); return; }
  const stations = DATA.pumpStations || [];
  const schedules = {};
  stations.forEach(s => {
    const start = parseInt(document.getElementById(`sch_${s.id}_start`)?.value);
    const end = parseInt(document.getElementById(`sch_${s.id}_end`)?.value);
    if (!isNaN(start) && !isNaN(end)) schedules[s.id] = [[start, end]];
  });
  const newId = 'P' + String(DATA.pumpProfiles.length + 1).padStart(2, '0');
  DATA.pumpProfiles.push({
    id: newId,
    name,
    type: document.getElementById('newProfileType')?.value || 'normal',
    isActive: false,
    color: document.getElementById('newProfileColor')?.value || '#00c8ff',
    desc: document.getElementById('newProfileDesc')?.value || '',
    conditions: document.getElementById('newProfileConditions')?.value || '',
    schedules,
  });
  currentProfileId = newId;
  closeModal();
  navigate('scheduler');
  showToast(`✅ Đã tạo kịch bản "${name}" thành công!`);
};

window.loadTemplateSchedule = function() {
  const template = { TV07:[6,10], TV08:[6,10], TB01:[7,9], TB02:[7,9], TB03:[7,9], CO01:[8,12], CO02:[8,12], CO03:[8,12] };
  Object.entries(template).forEach(([id,[s,e]]) => {
    const si = document.getElementById(`sch_${id}_start`);
    const ei = document.getElementById(`sch_${id}_end`);
    if (si) si.value = s;
    if (ei) ei.value = e;
  });
};

window.activateProfile = function(id) {
  DATA.pumpProfiles.forEach(p => p.isActive = false);
  const p = DATA.pumpProfiles.find(x => x.id === id);
  if (p) p.isActive = true;
  navigate('scheduler');
  showToast(`✅ Đã kích hoạt kịch bản "${p?.name}"!`);
};

window.saveProfileChanges = function(id) {
  showToast(`✅ Đã lưu thay đổi kịch bản!`);
};

window.activateAllScheduler = function() {
  showToast('⚡ Đã gửi lệnh vận hành hàng loạt theo kịch bản đang active!');
};

window.openEditStationSchedule = function(stationId, profileId) {
  const s = (DATA.pumpStations || []).find(x => x.id === stationId);
  const profile = DATA.pumpProfiles.find(x => x.id === profileId);
  if (!s || !profile) return;
  const sched = profile.schedules[stationId] || [];
  openModal(`
  <div class="modal-header">
    <span class="modal-title">Cấu hình: ${s.name}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      ${[
        { label: 'Loại', val: s.type === 'pump' ? 'Trạm bơm' : 'Cống điều tiết' },
        { label: 'Địa bàn', val: s.district },
        { label: 'Công suất thiết kế', val: `${s.capacity} ${s.unit}` },
        { label: 'Số tổ máy/Cửa', val: s.type === 'pump' ? `${s.pumps} tổ` : `${s.gates} cửa` },
      ].map(f=>`<div style="padding:10px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px"><div style="font-size:10px;color:var(--muted)">${f.label}</div><div style="font-size:13px;font-weight:600;margin-top:3px">${f.val}</div></div>`).join('')}
    </div>
    <label class="form-label">Khoảng thời gian vận hành (trong kịch bản "${profile.name}")</label>
    <div id="intervalsList" style="display:flex;flex-direction:column;gap:8px">
      ${sched.length ? sched.map((iv,i)=>`
      <div style="display:flex;gap:8px;align-items:center">
        <input type="number" value="${iv[0]}" min="0" max="23" class="form-control" style="flex:1;font-size:12px" placeholder="Bắt đầu (h)">
        <span style="color:var(--muted)">→</span>
        <input type="number" value="${iv[1]}" min="1" max="24" class="form-control" style="flex:1;font-size:12px" placeholder="Kết thúc (h)">
        <button class="btn btn-ghost btn-xs" style="color:var(--red)" onclick="this.parentElement.remove()">✕</button>
      </div>`).join('') : '<div style="font-size:12px;color:var(--muted);padding:12px;background:rgba(255,255,255,.03);border:1px dashed var(--border);border-radius:8px;text-align:center">Không có lịch vận hành trong kịch bản này</div>'}
    </div>
    <button class="btn btn-ghost btn-sm" style="margin-top:10px" onclick="addIntervalRow()">+ Thêm khoảng thời gian</button>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('✅ Đã lưu lịch vận hành cho ${s.name}!')">Lưu</button>
  </div>`);
};

window.addIntervalRow = function() {
  const list = document.getElementById('intervalsList');
  if (!list) return;
  const div = document.createElement('div');
  div.style.cssText = 'display:flex;gap:8px;align-items:center';
  div.innerHTML = `<input type="number" min="0" max="23" class="form-control" style="flex:1;font-size:12px" placeholder="Bắt đầu (h)"><span style="color:var(--muted)">→</span><input type="number" min="1" max="24" class="form-control" style="flex:1;font-size:12px" placeholder="Kết thúc (h)"><button class="btn btn-ghost btn-xs" style="color:var(--red)" onclick="this.parentElement.remove()">✕</button>`;
  list.appendChild(div);
};

window.openCloneProfileModal = function(id) {
  const p = DATA.pumpProfiles.find(x => x.id === id);
  if (!p) return;
  const newId = 'P' + String(DATA.pumpProfiles.length + 1).padStart(2,'0');
  DATA.pumpProfiles.push({ ...p, id: newId, name: `${p.name} (bản sao)`, isActive: false, schedules: JSON.parse(JSON.stringify(p.schedules)) });
  currentProfileId = newId;
  navigate('scheduler');
  showToast(`✅ Đã nhân bản thành "${p.name} (bản sao)"!`);
};

window.confirmDeleteProfile = function(id) {
  const p = DATA.pumpProfiles.find(x => x.id === id);
  if (!p) return;
  if (p.isActive) { showToast('⚠ Không thể xóa kịch bản đang active!'); return; }
  openModal(`
  <div class="modal-header"><span class="modal-title" style="color:var(--red)">Xóa kịch bản</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body"><p>Bạn có chắc muốn xóa kịch bản <strong>"${p.name}"</strong>? Hành động này không thể hoàn tác.</p></div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-sm" style="background:rgba(255,23,68,.15);color:var(--red);border:1px solid rgba(255,23,68,.3)" onclick="doDeleteProfile('${id}')">Xóa kịch bản</button>
  </div>`);
};

window.doDeleteProfile = function(id) {
  DATA.pumpProfiles = DATA.pumpProfiles.filter(p => p.id !== id);
  currentProfileId = DATA.pumpProfiles[0]?.id || null;
  closeModal();
  navigate('scheduler');
  showToast('🗑 Đã xóa kịch bản!');
};

window.exportSchedulerPdf = function() {
  showToast('📄 Đang xuất lịch vận hành PDF...');
  setTimeout(() => showToast('✅ Lịch vận hành đã xuất thành công!'), 1200);
};
