// ── ORG CHART ─────────────────────────────────────────────────────
// Static org structure for Chi cục TT-PCTT Hà Nội
const ORG_STRUCTURE = {
    id: 'root', type: 'company', name: 'Chi cục Thủy lợi & PCTT Hà Nội', position: 'Chi cục',
    head: { name: 'Nguyễn Văn Sơn', title: 'Chi cục trưởng', initials: 'NS' },
    children: [
        {
            id: 'd1', type: 'dept', name: 'Phòng Điều hành PCTT', color: '#ef4444',
            head: { name: 'Trần Thị Hương', title: 'Trưởng phòng', initials: 'TH' },
            deputies: [{ name: 'Trần Văn Minh', title: 'Phó Chi cục trưởng 1', initials: 'VM' }],
            children: [
                { id: 'd1a', type: 'team', name: 'TT Dự báo & Cảnh báo sớm', color: '#ef4444', headName: 'Đinh Văn Quân', staff: 5 },
            ]
        },
        {
            id: 'd2', type: 'dept', name: 'Phòng Quản lý Đê điều', color: '#8b5cf6',
            head: { name: 'Phạm Thị Ngọc', title: 'Trưởng phòng', initials: 'PN' },
            deputies: [],
            children: [
                { id: 'd2a', type: 'team', name: 'Đội Tuần tra Đê Hữu Hồng', color: '#8b5cf6', headName: 'Vũ Quang Khải', staff: 16 },
                { id: 'd2b', type: 'team', name: 'Đội Tuần tra Đê Hữu Đáy', color: '#8b5cf6', headName: 'Ngô Văn Hải', staff: 16 },
            ]
        },
        {
            id: 'd3', type: 'dept', name: 'Phòng Quản lý Thủy lợi', color: '#06b6d4',
            head: { name: 'Lê Hùng Cường', title: 'Trưởng phòng', initials: 'LC' },
            deputies: [],
            children: [
                { id: 'd3a', type: 'team', name: 'Tổ Hồ chứa & Cống đầu mối', color: '#06b6d4', headName: 'Đinh Bá Lợi', staff: 6 },
                { id: 'd3b', type: 'team', name: 'Tổ Trạm bơm & Kênh tưới', color: '#06b6d4', headName: 'Hoàng Anh Vũ', staff: 7 },
            ]
        },
        {
            id: 'd4', type: 'dept', name: 'Phòng Kỹ thuật & CNTT', color: '#10b981',
            head: { name: 'Đỗ Mạnh Tuân', title: 'Trưởng phòng', initials: 'DT' },
            deputies: [],
            children: [
                { id: 'd4a', type: 'team', name: 'Tổ IoT/SCADA & Hadiwa IOC', color: '#10b981', headName: 'Lâm Văn Phúc', staff: 5 },
            ]
        },
        {
            id: 'd5', type: 'dept', name: 'Đội ƯCSC & Xung kích', color: '#f97316',
            head: { name: 'Bùi Anh Tuấn', title: 'Đội trưởng', initials: 'BT' },
            deputies: [{ name: 'Lý Thị Thảo', title: 'Phó Chi cục trưởng 2', initials: 'LT' }],
            children: []
        },
        {
            id: 'd6', type: 'dept', name: 'Phòng Hành chính - TC', color: '#94a3b8',
            head: { name: 'Hoàng Văn Bình', title: 'Trưởng phòng', initials: 'HB' },
            deputies: [],
            children: []
        },
    ]
};

function orgNode(dept) {
    const c = dept.color || '#00c8ff';
    const staff = DATA.employees.filter(e => e.dept && e.dept.includes(dept.name.replace('Phòng ', '').replace('Ban ', '').split(' ')[0])).length;
    const deputyHtml = (dept.deputies || []).map(d => `
    <div style="display:flex;align-items:center;gap:6px;padding:4px 8px;border-radius:6px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);margin-top:4px">
      <div style="width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:${c};flex-shrink:0">${d.initials}</div>
      <div><div style="font-size:10px;font-weight:600">${d.name}</div><div style="font-size:9px;color:rgba(255,255,255,.4)">${d.title}</div></div>
    </div>`).join('');

    const childrenHtml = (dept.children || []).length > 0 ? `
    <div class="org-children">
      ${dept.children.map(ch => `
        <div class="org-team-node" style="border-color:${ch.color}33;background:rgba(255,255,255,.02)">
          <div style="width:8px;height:8px;border-radius:50%;background:${ch.color};flex-shrink:0;margin-top:2px"></div>
          <div style="flex:1;min-width:0">
            <div style="font-size:11px;font-weight:600">${ch.name}</div>
            <div style="font-size:10px;color:rgba(255,255,255,.4)">TL: ${ch.headName} · ${ch.staff} NV</div>
          </div>
        </div>`).join('')}
    </div>` : '';

    return `
    <div class="org-dept-card" style="--dept-color:${c}">
      <div class="org-dept-header">
        <div class="org-dept-icon" style="background:${c}22;border-color:${c}44;color:${c}">${dept.head?.initials || '??'}</div>
        <div class="org-dept-info">
          <div class="org-dept-name">${dept.name}</div>
          <div class="org-dept-head">${dept.head?.name} — <span style="color:${c}">${dept.head?.title}</span></div>
        </div>
        <div class="org-dept-count">${staff || '—'}<span>NV</span></div>
      </div>
      ${deputyHtml ? `<div style="padding:0 12px 8px">${deputyHtml}</div>` : ''}
      ${childrenHtml}
    </div>`;
}

function renderOrgChart() {
    const ceo = ORG_STRUCTURE;
    return `
  <div style="overflow-x:auto;padding:4px 0">
    <!-- CEO Box -->
    <div style="display:flex;justify-content:center;margin-bottom:0">
      <div class="org-ceo-card">
        <div class="org-ceo-avatar">
          <img src="assets/admin_avatar.png" alt="GĐ" style="width:100%;height:100%;object-fit:cover;border-radius:50%">
        </div>
        <div>
          <div style="font-size:15px;font-weight:700">${ceo.head.name}</div>
          <div style="font-size:12px;color:rgba(255,80,80,.8);margin-top:2px">${ceo.head.title}</div>
          <div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:2px">${ceo.name}</div>
        </div>
        <div style="margin-left:auto;text-align:right">
          <div style="font-size:20px;font-weight:700;color:var(--cyan)">${DATA.employees.length}</div>
          <div style="font-size:10px;color:rgba(255,255,255,.4)">Tổng NV</div>
        </div>
      </div>
    </div>

    <!-- Connector line -->
    <div style="display:flex;justify-content:center">
      <div style="width:2px;height:24px;background:rgba(0,200,255,.25)"></div>
    </div>
    <div style="display:flex;justify-content:center">
      <div style="width:90%;height:1px;background:rgba(0,200,255,.15);position:relative">
        <div style="position:absolute;top:-4px;left:50%;transform:translateX(-50%);width:8px;height:8px;border-radius:50%;background:rgba(0,200,255,.4)"></div>
      </div>
    </div>

    <!-- Department cards grid -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;padding:16px 0">
      ${ORG_STRUCTURE.children.map(d => orgNode(d)).join('')}
    </div>
  </div>`;
}

// ── DEPARTMENT MANAGEMENT ─────────────────────────────────────────
if (!window.deptList) {
    window.deptList = [
        { id: 'd1', name: 'Phòng Điều hành PCTT', code: 'PCTT', head: 'Trần Thị Hương', deputies: ['Trần Văn Minh (Phó CCT)'], staff: 14, color: '#ef4444', desc: 'Điều phối kịch bản PCTT, ứng cứu sự cố, BCH PCTT' },
        { id: 'd2', name: 'Phòng Quản lý Đê điều', code: 'PĐĐ', head: 'Phạm Thị Ngọc', deputies: [], staff: 18, color: '#8b5cf6', desc: 'Kiểm tra, tuần tra, bảo trì hệ thống đê; cấp phép' },
        { id: 'd3', name: 'Phòng Quản lý Thủy lợi', code: 'PTL', head: 'Lê Hùng Cường', deputies: [], staff: 16, color: '#06b6d4', desc: 'Quản lý hồ chứa, cống, trạm bơm tiêu, hệ thống tưới' },
        { id: 'd4', name: 'Phòng Kỹ thuật & CNTT', code: 'PKT', head: 'Đỗ Mạnh Tuân', deputies: [], staff: 10, color: '#10b981', desc: 'Giám sát kỹ thuật, IoT/SCADA, vận hành Hadiwa IOC' },
        { id: 'd5', name: 'Phòng Hành chính - TC', code: 'PHC', head: 'Hoàng Văn Bình', deputies: [], staff: 8, color: '#94a3b8', desc: 'Văn thư, nhân sự, tài chính, quản lý Quỹ PCTT' },
        { id: 'd6', name: 'Đội Tuần tra Đê (HH+HĐ)', code: 'ĐTT', head: 'Vũ Quang Khải', deputies: [], staff: 32, color: '#f97316', desc: 'Tuần tra thường xuyên tuyến đê Hữu Hồng, Hữu Đáy' },
        { id: 'd7', name: 'Đội ƯCSC & Xung kích', code: 'ĐUC', head: 'Bùi Anh Tuấn', deputies: ['Lý Thị Thảo (Phó CCT)'], staff: 24, color: '#f43f5e', desc: 'Ứng cứu sự cố khẩn cấp, xung kích phòng chống lụt bão' },
    ];
}

function renderDeptManagement() {
    return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
    <p style="color:var(--muted);font-size:13px">Quản lý cơ cấu phòng ban, trưởng/phó phòng và nhân sự trực thuộc.</p>
    <button class="btn btn-primary btn-sm" onclick="openAddDept()">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Thêm phòng ban
    </button>
  </div>
  <div style="display:flex;flex-direction:column;gap:10px">
    ${window.deptList.map(d => `
    <div class="card" style="padding:16px 20px">
      <div style="display:flex;align-items:center;gap:14px">
        <!-- Color badge -->
        <div style="width:44px;height:44px;border-radius:12px;background:${d.color}18;border:1.5px solid ${d.color}44;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <span style="font-size:11px;font-weight:700;color:${d.color};font-family:'Roboto Mono',monospace">${d.code}</span>
        </div>
        <!-- Info -->
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span style="font-size:14px;font-weight:700">${d.name}</span>
            <span style="font-size:11px;color:var(--muted)">${d.desc}</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;margin-top:6px;flex-wrap:wrap">
            <span style="font-size:12px"><span style="color:var(--muted)">Trưởng phòng: </span><strong>${d.head}</strong></span>
            ${d.deputies.length > 0 ? `<span style="font-size:12px"><span style="color:var(--muted)">Phó phòng: </span>${d.deputies.join(', ')}</span>` : ''}
            <span class="badge badge-blue" style="font-size:10px">${d.staff} nhân viên</span>
          </div>
        </div>
        <!-- Actions -->
        <div style="display:flex;gap:6px;flex-shrink:0">
          <button class="btn btn-ghost btn-sm" onclick="openEditDept('${d.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Sửa</button>
          <button class="btn btn-danger btn-sm" onclick="deleteDept('${d.id}','${d.name}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg> Xóa</button>
        </div>
      </div>
    </div>`).join('')}
  </div>`;
}

function openAddDept() {
    const colors = ['#00c8ff', '#00e676', '#0066ff', '#7c4dff', '#ffca28', '#ff6d00', '#e91e63', '#00bcd4'];
    openModal(`
  <div class="modal-header"><span class="modal-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Thêm phòng ban mới</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-row">
      <div class="form-group"><label class="form-label">Tên phòng ban</label><input id="nd_name" class="form-control" placeholder="Phòng Kỹ thuật"></div>
      <div class="form-group"><label class="form-label">Mã phòng</label><input id="nd_code" class="form-control" placeholder="PKT" style="text-transform:uppercase"></div>
    </div>
    <div class="form-group"><label class="form-label">Mô tả</label><input id="nd_desc" class="form-control" placeholder="Mô tả chức năng phòng ban..."></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Trưởng phòng</label><input id="nd_head" class="form-control" placeholder="Họ tên trưởng phòng"></div>
      <div class="form-group"><label class="form-label">Số NV (ước tính)</label><input id="nd_staff" class="form-control" type="number" value="1" min="1"></div>
    </div>
    <div class="form-group">
      <label class="form-label">Phó phòng (cách nhau bởi dấu phẩy)</label>
      <input id="nd_deputies" class="form-control" placeholder="Nguyễn Văn A, Trần Thị B">
    </div>
    <div class="form-group">
      <label class="form-label">Màu nhận diện</label>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
        ${colors.map(c => `<div onclick="selectDeptColor(this,'${c}')" style="width:28px;height:28px;border-radius:8px;background:${c};cursor:pointer;border:2px solid transparent;transition:all .2s" data-color="${c}"></div>`).join('')}
      </div>
      <input id="nd_color" type="hidden" value="${colors[0]}">
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="saveDept()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg> Tạo phòng ban</button>
  </div>`);
    setTimeout(() => document.querySelector('[data-color="${colors[0]}"]')?.style.setProperty('border-color', 'white'), 50);
}

function selectDeptColor(el, color) {
    document.querySelectorAll('[data-color]').forEach(d => d.style.borderColor = 'transparent');
    el.style.borderColor = 'white';
    const inp = document.getElementById('nd_color');
    if (inp) inp.value = color;
}

function saveDept() {
    const name = document.getElementById('nd_name')?.value?.trim();
    if (!name) { showToast('Vui lòng nhập tên phòng ban!'); return; }
    const newDept = {
        id: 'nd_' + Date.now(),
        name,
        code: (document.getElementById('nd_code')?.value || name.slice(0, 3)).toUpperCase(),
        head: document.getElementById('nd_head')?.value || '(Chưa phân công)',
        deputies: (document.getElementById('nd_deputies')?.value || '').split(',').map(x => x.trim()).filter(Boolean),
        staff: parseInt(document.getElementById('nd_staff')?.value) || 1,
        color: document.getElementById('nd_color')?.value || '#00c8ff',
        desc: document.getElementById('nd_desc')?.value || '',
    };
    window.deptList.push(newDept);
    closeModal();
    showToast(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Đã tạo phòng ban "${newDept.name}" thành công!`);
    document.getElementById('hrmContent').innerHTML = renderDeptManagement();
}

function openEditDept(id) {
    const d = window.deptList.find(x => x.id === id);
    if (!d) return;
    const colors = ['#00c8ff', '#00e676', '#0066ff', '#7c4dff', '#ffca28', '#ff6d00', '#e91e63', '#00bcd4'];
    openModal(`
  <div class="modal-header"><span class="modal-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Sửa: ${d.name}</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-row">
      <div class="form-group"><label class="form-label">Tên phòng ban</label><input id="ed_name" class="form-control" value="${d.name}"></div>
      <div class="form-group"><label class="form-label">Mã phòng</label><input id="ed_code" class="form-control" value="${d.code}"></div>
    </div>
    <div class="form-group"><label class="form-label">Mô tả</label><input id="ed_desc" class="form-control" value="${d.desc}"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Trưởng phòng</label><input id="ed_head" class="form-control" value="${d.head}"></div>
      <div class="form-group"><label class="form-label">Số NV</label><input id="ed_staff" class="form-control" type="number" value="${d.staff}"></div>
    </div>
    <div class="form-group">
      <label class="form-label">Phó phòng (phân cách bởi dấu phẩy)</label>
      <input id="ed_deputies" class="form-control" value="${d.deputies.join(', ')}">
    </div>
    <div class="form-group">
      <label class="form-label">Màu nhận diện</label>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
        ${colors.map(c => `<div onclick="selectDeptColor(this,'${c}')" style="width:28px;height:28px;border-radius:8px;background:${c};cursor:pointer;border:2px solid ${c === d.color ? 'white' : 'transparent'};transition:all .2s" data-color="${c}"></div>`).join('')}
      </div>
      <input id="ed_color" type="hidden" value="${d.color}">
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="updateDept('${id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Lưu thay đổi</button>
  </div>`);
}

function updateDept(id) {
    const d = window.deptList.find(x => x.id === id);
    if (!d) return;
    d.name = document.getElementById('ed_name')?.value || d.name;
    d.code = (document.getElementById('ed_code')?.value || d.code).toUpperCase();
    d.head = document.getElementById('ed_head')?.value || d.head;
    d.deputies = (document.getElementById('ed_deputies')?.value || '').split(',').map(x => x.trim()).filter(Boolean);
    d.staff = parseInt(document.getElementById('ed_staff')?.value) || d.staff;
    d.color = document.getElementById('ed_color')?.value || d.color;
    d.desc = document.getElementById('ed_desc')?.value || d.desc;
    closeModal();
    showToast(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Đã cập nhật phòng ban "${d.name}"!`);
    document.getElementById('hrmContent').innerHTML = renderDeptManagement();
}

function deleteDept(id, name) {
    openModal(`
  <div class="modal-header"><span class="modal-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg> Xóa phòng ban</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div style="text-align:center;padding:20px 0">
      <div style="font-size:42px;margin-bottom:12px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
      <div style="font-size:15px;font-weight:600;margin-bottom:8px">Xóa phòng ban "${name}"?</div>
      <p style="font-size:13px;color:var(--muted)">Hành động này không thể hoàn tác. Nhân viên thuộc phòng ban này sẽ không bị ảnh hưởng.</p>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-danger" onclick="confirmDeleteDept('${id}','${name}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg> Xác nhận xóa</button>
  </div>`);
}

function confirmDeleteDept(id, name) {
    window.deptList = window.deptList.filter(x => x.id !== id);
    closeModal();
    showToast(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg> Đã xóa phòng ban "${name}"!`);
    document.getElementById('hrmContent').innerHTML = renderDeptManagement();
}
