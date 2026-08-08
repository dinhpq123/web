// ── INCIDENTS & WORK ORDERS ───────────────────────────────────────
let incidentsViewMode = 'table'; // 'table' | 'kanban'
let incidentTab = 'incidents'; // 'incidents' | 'tasks'
let incidentPage = 1;
let taskPage = 1;
const incPageSize = 10;

function renderIncidents() {
  // Calculations
  const doneIncidents = DATA.incidents.filter(i => i.status === 'done' && i.resolvedAt);
  let avgSeconds = 0;
  if (doneIncidents.length > 0) {
    const totalDiff = doneIncidents.reduce((acc, i) => {
      const start = new Date(i.report.replace(' ', 'T')).getTime();
      const end = new Date(i.resolvedAt.replace(' ', 'T')).getTime();
      return acc + (end - start);
    }, 0);
    avgSeconds = totalDiff / doneIncidents.length / 1000;
  }
  const avgHours = (avgSeconds / 3600).toFixed(1);

  const typeCounts = DATA.incidents.reduce((acc, i) => {
    acc[i.type] = (acc[i.type] || 0) + 1;
    return acc;
  }, {});
  const commonType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  return `
  <div class="page-header">
    <div class="page-title"><h1>Sự cố &amp; Lệnh Công tác</h1><p>Quản lý và theo dõi tiến độ xử lý sự cố</p></div>
    <div class="page-actions">
      <!-- View toggle (Only for Incidents Table) -->
      ${incidentTab === 'incidents' ? `
      <div style="display:flex;gap:4px;background:var(--segmented-bg);border:1px solid var(--border);border-radius:8px;padding:3px">
        <button onclick="switchIncidentView('table')" id="incBtn_table"
          style="display:flex;align-items:center;gap:5px;font-size:12px;padding:4px 12px;border-radius:6px;border:none;cursor:pointer;transition:all .2s;
          background:${incidentsViewMode === 'table' ? 'var(--segmented-active-bg)' : 'transparent'};
          color:${incidentsViewMode === 'table' ? 'var(--primary-text)' : 'var(--muted)'}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg> Bảng
        </button>
        <button onclick="switchIncidentView('kanban')" id="incBtn_kanban"
          style="display:flex;align-items:center;gap:5px;font-size:12px;padding:4px 12px;border-radius:6px;border:none;cursor:pointer;transition:all .2s;
          background:${incidentsViewMode === 'kanban' ? 'var(--segmented-active-bg)' : 'transparent'};
          color:${incidentsViewMode === 'kanban' ? 'var(--primary-text)' : 'var(--muted)'}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="18" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg> Kanban
        </button>
      </div>` : ''}
      <button class="btn btn-primary" onclick="${incidentTab === 'incidents' ? 'openNewIncident()' : 'openNewTask()'}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> ${incidentTab === 'incidents' ? 'Tạo sự cố mới' : 'Tạo lệnh mới'}
      </button>
    </div>
  </div>

  <!-- Summary KPI -->
  <div class="kpi-grid" style="margin-bottom:16px">
    <div class="kpi-card" style="--accent-color:var(--primary)"><div class="kpi-label">Tổng sự cố</div><div class="kpi-value">${DATA.incidents.length}</div><div class="kpi-sub">Sự vụ</div></div>
    <div class="kpi-card" style="--accent-color:var(--info)"><div class="kpi-label">Mới</div><div class="kpi-value">${DATA.incidents.filter(i => i.status === 'new').length}</div><div class="kpi-sub">Chờ phân công</div></div>
    <div class="kpi-card" style="--accent-color:var(--warning)"><div class="kpi-label">Đang xử lý</div><div class="kpi-value">${DATA.incidents.filter(i => i.status === 'processing').length}</div><div class="kpi-sub">Đang xử lý</div></div>
    <div class="kpi-card" style="--accent-color:var(--success)"><div class="kpi-label">Hoàn thành</div><div class="kpi-value">${DATA.incidents.filter(i => i.status === 'done').length}</div><div class="kpi-sub">Đã đóng</div></div>
    <div class="kpi-card" style="--accent-color:var(--purple)"><div class="kpi-label">Thời gian xử lý TB</div><div class="kpi-value">${avgHours}<span style="font-size:16px;color:var(--muted)">h</span></div><div class="kpi-sub">Mỗi sự vụ</div></div>
    <div class="kpi-card" style="--accent-color:var(--primary)"><div class="kpi-label">Loại phổ biến</div><div class="kpi-value" style="font-size:18px;padding-top:10px">${commonType}</div><div class="kpi-sub">Nhiều nhất</div></div>
  </div>

  <div class="tabs">
    <button class="tab-btn ${incidentTab === 'incidents' ? 'active' : ''}" onclick="switchIncidentTab('incidents')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Danh sách Sự cố
    </button>
    <button class="tab-btn ${incidentTab === 'tasks' ? 'active' : ''}" onclick="switchIncidentTab('tasks')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg> Lệnh công tác (Tasks)
    </button>
  </div>

  <div id="incidentViewContainer" style="margin-top:20px">
    ${getIncidentTabContent()}
  </div>`;
}

function switchIncidentTab(tab) {
  incidentTab = tab;
  document.querySelectorAll('.tabs .tab-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('incidentViewContainer').innerHTML = getIncidentTabContent();
  // We may need to update page header actions if needed, but for now just refresh
  renderIncidents();
  navigate('incidents');
}

function getIncidentTabContent() {
  if (incidentTab === 'incidents') {
    return incidentsViewMode === 'kanban' ? renderIncidentKanban() : renderIncidentTable();
  } else {
    return renderTaskTable();
  }
}

function renderIncidentTable() {
  const search = document.getElementById('fbSearch_incidents')?.value || '';
  const sev = document.getElementById('ff-severity_incidents')?.value || '';
  const status = document.getElementById('ff-status_incidents')?.value || '';

  const filtered = DATA.incidents.filter(i => {
    const mSearch = !search || i.id.toLowerCase().includes(search.toLowerCase()) || i.location.toLowerCase().includes(search.toLowerCase()) || i.type.toLowerCase().includes(search.toLowerCase());
    const mSev = !sev || (sev === 'Nghiêm trọng' && i.severity === 'critical') || (sev === 'Cảnh báo' && i.severity === 'warning');
    const mStatus = !status || (status === 'Mới' && i.status === 'new') || (status === 'Đang xử lý' && i.status === 'processing') || (status === 'Hoàn thành' && i.status === 'done');
    return mSearch && mSev && mStatus;
  });

  const totalPages = Math.ceil(filtered.length / incPageSize);
  const start = (incidentPage - 1) * incPageSize;
  const pageItems = filtered.slice(start, start + incPageSize);

  return `
  <div class="card">
    <div class="table-wrap">
      <table>
        <thead><tr>
          <th>Mã SC</th><th>Loại sự cố</th><th>Địa điểm</th>
          <th>Mức độ</th><th>Trạng thái</th><th>Báo cáo lúc</th>
          <th>Đội phụ trách</th><th>Thao tác</th>
        </tr></thead>
        <tbody>
          ${pageItems.map(i => renderIncidentRow(i)).join('')}
          ${pageItems.length === 0 ? '<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--muted)">Không có dữ liệu phù hợp</td></tr>' : ''}
        </tbody>
      </table>
    </div>
    ${renderPagination(filtered.length, incidentPage, 'changeIncidentPage')}
  </div>`;
}

function renderTaskTable() {
  const search = document.getElementById('fbSearch_incidents')?.value || '';

  const filtered = (DATA.workOrders || []).filter(t => {
    const mSearch = !search || t.id.toLowerCase().includes(search.toLowerCase()) || t.title.toLowerCase().includes(search.toLowerCase()) || t.assignedTo.toLowerCase().includes(search.toLowerCase());
    return mSearch;
  });

  const totalPages = Math.ceil(filtered.length / incPageSize);
  const start = (taskPage - 1) * incPageSize;
  const pageItems = filtered.slice(start, start + incPageSize);

  return `
  <div class="card">
    <div class="table-wrap">
      <table>
        <thead><tr>
          <th>Mã Lệnh</th><th>Nội dung công việc</th><th>Loại</th>
          <th>Ưu tiên</th><th>Trạng thái</th><th>Hạn chót</th>
          <th>Người phụ trách</th><th>Thao tác</th>
        </tr></thead>
        <tbody>
          ${pageItems.map(t => `
          <tr>
            <td class="mono text-cyan">${t.id}</td>
            <td style="font-weight:600">${t.title}</td>
            <td><span class="badge badge-gray">${t.category}</span></td>
            <td>${priorityBadge(t.priority)}</td>
            <td>${statusBadge(t.status)}</td>
            <td class="mono" style="font-size:12px;color:var(--muted)">${t.deadline}</td>
            <td style="font-size:12px;color:var(--text-2)">${t.assignedTo}</td>
            <td>
              <button class="btn btn-ghost btn-sm" onclick="viewWorkOrder('${t.id}')">Xem</button>
            </td>
          </tr>`).join('')}
          ${pageItems.length === 0 ? '<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--muted)">Không có dữ liệu phù hợp</td></tr>' : ''}
        </tbody>
      </table>
    </div>
    ${renderPagination(filtered.length, taskPage, 'changeTaskPage')}
  </div>`;
}

function renderPagination(total, current, onPageChange) {
  const totalPages = Math.ceil(total / incPageSize);
  if (totalPages <= 1) return '';

  const start = (current - 1) * incPageSize;

  return `
  <div class="pagination-bar" style="margin-top:10px;padding:16px;border-top:1px solid var(--border)">
    <div style="font-size:12px;color:var(--muted)">Hiển thị ${start + 1}–${Math.min(start + incPageSize, total)} / ${total} mục</div>
    <div class="pagination-btns">
      <button class="btn btn-ghost btn-sm" ${current === 1 ? 'disabled' : ''} onclick="${onPageChange}(${current - 1})">Trước</button>
      ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
        <button class="btn btn-sm" style="min-width:32px;border:1px solid ${p === current ? 'var(--primary)' : 'var(--border)'};background:${p === current ? 'rgba(0,200,255,.15)' : 'transparent'};color:${p === current ? 'var(--primary)' : 'var(--muted)'}" onclick="${onPageChange}(${p})">${p}</button>
      `).join('')}
      <button class="btn btn-ghost btn-sm" ${current === totalPages ? 'disabled' : ''} onclick="${onPageChange}(${current + 1})">Sau</button>
    </div>
  </div>`;
}

function changeIncidentPage(p) { incidentPage = p; document.getElementById('incidentViewContainer').innerHTML = getIncidentTabContent(); }
function changeTaskPage(p) { taskPage = p; document.getElementById('incidentViewContainer').innerHTML = getIncidentTabContent(); }

function priorityBadge(p) {
  const cfg = { high: ['badge-red', 'Cao'], medium: ['badge-yellow', 'Trung bình'], low: ['badge-blue', 'Thấp'] };
  const [c, l] = cfg[p] || ['badge-gray', p];
  return `<span class="badge ${c}">${l}</span>`;
}

function renderIncidentKanban() {
  const columns = [
    { id: 'new', label: 'Mới', color: 'var(--info)', bg: 'var(--info-soft)', border: 'var(--border)' },
    { id: 'processing', label: 'Đang xử lý', color: 'var(--warning)', bg: 'var(--warning-soft)', border: 'var(--border)' },
    { id: 'done', label: 'Hoàn thành', color: 'var(--success)', bg: 'var(--success-soft)', border: 'var(--border)' },
  ];
  return `
  <div class="kanban-board">
    ${columns.map(col => {
    const cards = DATA.incidents.filter(i => i.status === col.id);
    return `
      <div class="kanban-col" data-colid="${col.id}"
        ondragover="kanbanDragOver(event)" ondrop="kanbanDrop(event,'${col.id}')"
        style="border-color:${col.border};background:${col.bg}">
        <div class="kanban-col-header" style="border-bottom-color:${col.color}">
          <span style="font-size:14px;font-weight:700;color:${col.color}">${col.label}</span>
          <span style="background:${col.color};color:var(--bg-surface);font-size:11px;font-weight:700;padding:2px 10px;border-radius:20px" id="kanban_count_${col.id}">${cards.length}</span>
        </div>
        <div class="kanban-cards" id="kanban_col_${col.id}">
          ${cards.map(i => renderKanbanCard(i, col.color)).join('')}
          ${cards.length === 0 ? `<div style="text-align:center;padding:24px;color:var(--muted);font-size:12px">Không có sự cố</div>` : ''}
        </div>
      </div>`;
  }).join('')}
  </div>`;
}

function renderKanbanCard(i, accentColor) {
  const sevColor = i.severity === 'critical' ? 'var(--danger)' : 'var(--warning)';
  const slaBar = typeof incSlaBar === 'function' && i.status !== 'done' ? incSlaBar(i) : '';
  return `
  <div class="kanban-card" draggable="true" data-incid="${i.id}"
    ondragstart="kanbanDragStart(event,'${i.id}')"
    style="border-left-color:${sevColor}"
    onclick="viewIncident('${i.id}')">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
      <span style="font-family:'Roboto Mono',monospace;font-size:11px;color:var(--primary);font-weight:700">${i.id}</span>
      ${severityBadge(i.severity)}
    </div>
    <div style="font-size:13px;font-weight:600;margin-bottom:4px">${i.type}</div>
    <div style="font-size:11px;color:var(--muted);margin-bottom:8px;line-height:1.4">${i.location}</div>
    ${slaBar}
    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px">
      <span style="font-size:10px;color:var(--muted)">${i.report.split(' ')[0]}</span>
      ${i.assignedTo
      ? `<span style="font-size:10px;background:rgba(0,200,255,.1);color:var(--primary);padding:2px 8px;border-radius:4px">${i.assignedTo.substring(0, 15)}</span>`
      : `<span style="font-size:10px;color:var(--danger)">Chưa phân công</span>`}
    </div>
  </div>`;
}

// ── Kanban Drag & Drop ────────────────────────────────────────────
let _kanbanDragId = null;

function kanbanDragStart(event, incId) {
  _kanbanDragId = incId;
  event.dataTransfer.effectAllowed = 'move';
  event.currentTarget.style.opacity = '0.5';
}

function kanbanDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  event.currentTarget.style.outline = '2px dashed rgba(0,200,255,.4)';
}

function kanbanDrop(event, newStatus) {
  event.preventDefault();
  event.currentTarget.style.outline = '';
  if (!_kanbanDragId) return;
  const inc = DATA.incidents.find(i => i.id === _kanbanDragId);
  if (!inc || inc.status === newStatus) { _kanbanDragId = null; return; }
  const oldStatus = inc.status;
  inc.status = newStatus;
  _kanbanDragId = null;

  // Refresh kanban view
  document.getElementById('incidentViewContainer').innerHTML = renderIncidentKanban();
  showToast(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> ${inc.id} đã chuyển sang "${newStatus === 'new' ? 'Mới' : newStatus === 'processing' ? 'Đang xử lý' : 'Hoàn thành'}"`);
}

function switchIncidentView(mode) {
  incidentsViewMode = mode;
  document.getElementById('incidentViewContainer').innerHTML = getIncidentTabContent();
}

function renderIncidentRow(i) {
  return `<tr data-id="${i.id}" data-status="${i.status}" data-severity="${i.severity}">
    <td class="mono text-cyan">${i.id}</td>
    <td style="font-weight:500">${i.type}</td>
    <td style="color:var(--text-2);font-size:12px">${i.location}</td>
    <td>${severityBadge(i.severity)}</td>
    <td>${statusBadge(i.status)}${typeof incSlaInfo==='function'&&i.status!=='done'?`<div style="font-size:9px;color:${incSlaInfo(i).overdue?'#f87171':incSlaInfo(i).pct>=80?'#fbbf24':'var(--success-text)'};font-weight:700;margin-top:2px">${incSlaInfo(i).overdue?'QUÁ HẠN':'SLA OK'}</div>`:''}</td>
    <td class="mono" style="font-size:12px;color:var(--muted)">${i.report}</td>
    <td style="font-size:12px;color:var(--muted)">${i.assignedTo || '<span style="color:var(--danger)">Chưa phân công</span>'}</td>
    <td style="display:flex;gap:6px">
      <button class="btn btn-ghost btn-sm" onclick="viewIncident('${i.id}')" style="display:flex;align-items:center;gap:4px">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        Chi tiết
      </button>
      ${i.status !== 'done' ? `<button class="btn btn-outline btn-sm" onclick="updateIncidentStatus('${i.id}')">Cập nhật</button>` : ''}
    </td>
  </tr>`;
}

function openNewIncident() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Tạo sự cố mới</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-row">
      <div class="form-group"><label class="form-label">Loại sự cố</label>
        <select class="form-control"><option>Vỡ ống</option><option>Tụt áp</option><option>Máy bơm sự cố</option><option>Chất lượng nước</option><option>Mất điện</option></select>
      </div>
      <div class="form-group"><label class="form-label">Mức độ</label>
        <select class="form-control"><option value="critical"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--danger);vertical-align:middle"></span> Nghiêm trọng</option><option value="warning"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--warning);vertical-align:middle"></span> Cảnh báo</option></select>
      </div>
    </div>
    <div class="form-group" style="margin-bottom:16px"><label class="form-label">Địa điểm</label>
      <input class="form-control" placeholder="Nhập địa điểm xảy ra sự cố...">
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Phân công đội</label>
        <select class="form-control"><option>Đội 1 – Quận Hà Đông</option><option>Đội 2 – Huyện Ba Vì</option><option>Đội 3 – Huyện Mỹ Đức</option><option>Đội 4 – Huyện Đông Anh</option></select>
      </div>
      <div class="form-group"><label class="form-label">Nhà máy liên quan</label>
        <select class="form-control">${DATA.factories.map(f => `<option>${f.name}</option>`).join('')}</select>
      </div>
    </div>
    <div class="form-group"><label class="form-label">Ghi chú</label>
      <textarea class="form-control" rows="3" placeholder="Mô tả chi tiết sự cố..."></textarea>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="saveNewIncident()">Tạo lệnh công tác</button>
  </div>`);
}

function openNewTask(prefill) {
  prefill = prefill || {};
  openModal(`
  <div class="modal-header"><span class="modal-title">Tạo Lệnh công tác mới</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-row">
      <div class="form-group"><label class="form-label">Tên lệnh công tác</label>
        <input id="taskTitle" class="form-control" placeholder="Nhập tiêu đề lệnh CT..." value="${prefill.title || ''}">
      </div>
      <div class="form-group"><label class="form-label">Loại công việc</label>
        <select id="taskCategory" class="form-control">
          <option>Sửa chữa</option><option>Kiểm tra</option><option>Bảo trì</option><option>Khẩn cấp</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Mức độ ưu tiên</label>
        <select id="taskPriority" class="form-control">
          <option value="high">Cao</option><option value="medium" selected>Trung bình</option><option value="low">Thấp</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Hạn chót</label>
        <input id="taskDeadline" type="date" class="form-control" value="${new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10)}">
      </div>
    </div>
    <div class="form-group" style="margin-bottom:16px"><label class="form-label">Địa điểm</label>
      <input id="taskLocation" class="form-control" placeholder="Địa điểm thực hiện CT..." value="${prefill.location || ''}">
    </div>
    <div class="form-group"><label class="form-label">Phân công</label>
      <select id="taskAssignee" class="form-control">
        <option>Đội 1 – Quận Hà Đông</option><option>Đội 2 – Huyện Ba Vì</option>
        <option>Đội 3 – Huyện Mỹ Đức</option><option>Đội 4 – Huyện Đông Anh</option>
      </select>
    </div>
    <div class="form-group"><label class="form-label">Ghi chú</label>
      <textarea id="taskNote" class="form-control" rows="3" placeholder="Mô tả chi tiết công việc...">${prefill.note || ''}</textarea>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="saveNewTask()">Tạo lệnh công tác</button>
  </div>`);
}

function saveNewTask() {
  const title = document.getElementById('taskTitle')?.value || 'Lệnh CT mới';
  closeModal();
  showToast(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Đã tạo lệnh công tác: ${title}`);
}

function saveNewIncident() {
  closeModal();
  showToast('Lệnh công tác đã được tạo thành công!');
}

function viewIncident(id) {
  if (typeof incOpenDetail === 'function') { incOpenDetail(id); return; }
  const i = DATA.incidents.find(x => x.id === id);
  if (!i) return;
  openModal(`
  <div class="modal-header"><span class="modal-title">${i.id} — ${i.type}</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    ${[['Địa điểm', i.location], ['Mức độ', severityBadge(i.severity)], ['Trạng thái', statusBadge(i.status)], ['Thời gian báo cáo', i.report], ['Đội phụ trách', i.assignedTo || 'Chưa phân công'], ['Ghi chú', i.note]].map(([k, v]) => `
    <div style="padding:10px 0;border-bottom:1px solid var(--border);display:flex;gap:12px">
      <span style="min-width:160px;color:var(--muted);font-size:13px">${k}</span>
      <span style="font-size:13px">${v}</span>
    </div>`).join('')}
    <div style="margin-top:16px">
      <div style="font-size:12px;color:var(--muted);margin-bottom:8px">Timeline xử lý</div>
      ${[
      { t: 'Tiếp nhận sự cố', ts: i.report, c: 'cyan' },
      { t: i.assignedTo ? 'Phân công: ' + i.assignedTo : 'Chưa phân công đội', ts: i.assignedTo ? i.report : '—', c: i.assignedTo ? 'blue' : 'gray' },
      { t: i.status === 'done' ? 'Hoàn thành xử lý' : 'Đang xử lý...', ts: '—', c: i.status === 'done' ? 'green' : 'yellow' }
    ].map(x => `
      <div style="display:flex;gap:12px;padding:8px 0;align-items:flex-start">
        <div style="width:8px;height:8px;border-radius:50%;background:var(--${x.c});margin-top:5px;flex-shrink:0;box-shadow:0 0 6px var(--${x.c})"></div>
        <div><div style="font-size:13px">${x.t}</div><div style="font-size:11px;color:var(--muted)">${x.ts}</div></div>
      </div>`).join('')}
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Đóng</button>${i.status !== 'done' ? `<button class="btn btn-primary" onclick="markDone('${i.id}')">Đánh dấu hoàn thành</button>` : ''}</div>`);
}

function markDone(id) {
  const i = DATA.incidents.find(x => x.id === id);
  if (i) { i.status = 'done'; closeModal(); navigate('incidents'); showToast('Đã cập nhật trạng thái hoàn thành!'); }
}
function updateIncidentStatus(id) { viewIncident(id); }

function viewWorkOrder(id) {
  const t = (DATA.workOrders || []).find(x => x.id === id);
  if (!t) return;
  openModal(`
  <div class="modal-header"><span class="modal-title">${t.id} — ${t.title}</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body" style="max-height:80vh;overflow-y:auto">
    ${[['Loại công việc', t.category], ['Mức độ ưu tiên', priorityBadge(t.priority)], ['Trạng thái', statusBadge(t.status)], ['Hạn chót', t.deadline], ['Người phụ trách', t.assignedTo]].map(([k, v]) => `
    <div style="padding:10px 0;border-bottom:1px solid var(--border);display:flex;gap:12px">
      <span style="min-width:160px;color:var(--muted);font-size:13px">${k}</span>
      <span style="font-size:13px">${v}</span>
    </div>`).join('')}
    
    <div style="margin-top:16px">
      <div style="font-size:12px;color:var(--muted);margin-bottom:6px">Ghi chú / Mô tả:</div>
      <div style="font-size:13px;color:var(--text-2);line-height:1.6;background:var(--bg-secondary);padding:12px;border-radius:8px;border:1px solid var(--border)">
        ${t.note || 'Không có ghi chú thêm.'}
      </div>
    </div>

    <div style="margin-top:16px">
      <div style="font-size:12px;color:var(--muted);margin-bottom:8px">Tiến độ thực hiện</div>
      ${(t.timeline || []).map(x => `
      <div style="display:flex;gap:12px;padding:8px 0;align-items:flex-start">
        <div style="width:8px;height:8px;border-radius:50%;background:var(--primary);margin-top:5px;flex-shrink:0;box-shadow:0 0 6px var(--primary)"></div>
        <div>
          <div style="font-size:13px;font-weight:600">${x.event}</div>
          <div style="font-size:11px;color:var(--muted)">${x.time} — Thực hiện bởi: <span style="color:var(--primary)">${x.user}</span></div>
        </div>
      </div>`).join('')}
      ${t.status !== 'done' ? `
      <div style="display:flex;gap:12px;padding:8px 0;align-items:flex-start">
        <div style="width:8px;height:8px;border-radius:50%;background:var(--muted);margin-top:5px;flex-shrink:0"></div>
        <div><div style="font-size:13px;color:var(--muted)">Chờ hoàn thành...</div></div>
      </div>` : ''}
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Đóng</button>${t.status !== 'done' ? `<button class="btn btn-primary" onclick="markTaskDone('${t.id}')">Đánh dấu hoàn thành</button>` : ''}</div>`);
}

function markTaskDone(id) {
  const t = (DATA.workOrders || []).find(x => x.id === id);
  if (t) {
    t.status = 'done';
    t.timeline.push({ time: new Date().toLocaleString('vi-VN'), event: 'Hoàn thành công việc', user: 'Admin' });
    closeModal();
    document.getElementById('incidentViewContainer').innerHTML = getIncidentTabContent();
    showToast('Đã cập nhật trạng thái hoàn thành Lệnh công tác!');
  }
}
