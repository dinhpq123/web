// ── ACTIVITY LOG PAGE ─────────────────────────────────────────────
function renderLog() {
  return `
  <div class="page-header">
    <div class="page-title"><h1>Lịch sử thay đổi</h1><p>Audit log toàn bộ thao tác trong hệ thống</p></div>
    <div class="page-actions">
      <button class="btn btn-ghost btn-sm" onclick="exportLogExcel()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Xuất Excel
      </button>
    </div>
  </div>

  <div class="filter-bar">
    <div class="search-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input class="search-input" placeholder="Tìm theo user, hành động, đối tượng..." oninput="filterTable('logBody',this.value)">
    </div>
    <select class="form-control" style="max-width:160px">
      <option>Hôm nay</option><option>7 ngày qua</option><option>30 ngày qua</option><option>Tất cả</option>
    </select>
    <select class="form-control" style="max-width:160px" onchange="filterTable('logBody',this.value)">
      <option value="">Tất cả người dùng</option>
      ${[...new Set(DATA.activityLog.map(l => l.user))].map(u => `<option value="${u}">${u}</option>`).join('')}
    </select>
  </div>

  <div class="card">
    <div class="table-wrap">
      <table>
        <thead><tr>
          <th>#</th><th>Thời gian</th><th>Tài khoản</th>
          <th>Loại</th><th>Hành động</th><th>Đối tượng</th>
          <th>IP</th><th style="text-align:right">Chi tiết</th>
        </tr></thead>
        <tbody id="logBody">
          ${DATA.activityLog.map(l => {
    const typeColors = { 'UPDATE': 'blue', 'CREATE': 'green', 'DELETE': 'red', 'SYSTEM': 'gray', 'EXPORT': 'yellow' };
    const typeClass = 'badge-' + (typeColors[l.type] || 'gray');
    return `
          <tr>
            <td class="mono" style="color:var(--muted)">${l.id}</td>
            <td class="mono" style="font-size:12px;color:var(--muted)">${l.time}</td>
            <td>
              <div style="display:flex;align-items:center;gap:8px">
                <div style="width:26px;height:26px;background:linear-gradient(135deg,#0050cc,#00c8ff);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700">${l.user.charAt(0)}</div>
                <span style="font-size:13px;font-weight:500">${l.user}</span>
              </div>
            </td>
            <td><span class="badge ${typeClass}" style="font-size:10px">${l.type || 'INFO'}</span></td>
            <td style="color:var(--text-2)">${l.action}</td>
            <td style="font-size:12px;color:var(--cyan)">${l.target}</td>
            <td class="mono" style="font-size:11px;color:var(--muted)">${l.ip}</td>
            <td style="text-align:right">
              <button class="btn btn-ghost btn-sm" onclick="openLogDetails(${l.id})" style="padding:4px 8px" title="Xem JSON Data">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </button>
            </td>
          </tr>`}).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function openLogDetails(id) {
  const l = DATA.activityLog.find(x => x.id === id);
  if (!l) return;
  const jsonStr = l.details ? JSON.stringify(JSON.parse(l.details), null, 2) : '{}';
  openModal(`
    <div class="modal-header">
      <h3 class="modal-title">Chi tiết Audit Log #${id}</h3>
      <button class="modal-close" onclick="closeModal()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body" style="padding:20px;max-width:500px">
      <div style="display:grid;grid-template-columns:100px 1fr;gap:12px;margin-bottom:16px;font-size:13px">
        <div style="color:var(--muted)">Tài khoản:</div><div style="font-weight:600">${l.user}</div>
        <div style="color:var(--muted)">Hành động:</div><div>${l.action}</div>
        <div style="color:var(--muted)">Đối tượng:</div><div style="color:var(--cyan)">${l.target}</div>
        <div style="color:var(--muted)">Thời gian:</div><div class="mono">${l.time}</div>
        <div style="color:var(--muted)">IP Address:</div><div class="mono">${l.ip}</div>
      </div>
      <div style="font-size:12px;font-weight:600;margin-bottom:8px;color:var(--muted)">PAYLOAD (JSON)</div>
      <pre style="background:var(--bg-card);padding:12px;border-radius:8px;border:1px solid var(--border);color:var(--green);font-family:'Roboto Mono',monospace;font-size:12px;margin:0;overflow-x:auto">${jsonStr}</pre>
    </div>
  `);
}
