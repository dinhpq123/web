// ── DIKE MANAGEMENT & SAFETY PAGE (Refactored from NRW) ──────────────────
let dikeTab = 'overview';

function renderNrw() {
  return `
  <div class="page-header">
    <div class="page-title"><h1>Quản lý Đê điều & An toàn</h1><p>Hồ sơ đê điều, cao trình và giám sát thẩm lậu</p></div>
    <div class="page-actions">
      <button class="btn btn-primary" onclick="showToast('Đang mở form thêm tuyến đê mới...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Thêm tuyến đê</button>
    </div>
  </div>
  <div class="kpi-grid" style="margin-bottom:16px">
    <div class="kpi-card" style="--accent-color:var(--warning)"><div class="kpi-label">Tỷ lệ an toàn trung bình</div><div class="kpi-value" style="color:var(--warning)">${(BIZ_STATS.dikeConditionOk)}<span style="font-size:16px;color:var(--muted)">%</span></div><div class="kpi-sub">Mục tiêu: >95% an toàn</div></div>
    <div class="kpi-card" style="--accent-color:var(--danger)"><div class="kpi-label">Đê xung yếu (Cấp I)</div><div class="kpi-value" style="color:var(--danger)">${DIKE_DATA.filter(d => d.grade === 1 && d.condition === 'critical').length}</div><div class="kpi-sub">cần gia cố khẩn cấp</div></div>
    <div class="kpi-card" style="--accent-color:var(--primary)"><div class="kpi-label">Mực nước Trạm Hà Nội</div><div class="kpi-value">4.82<span style="font-size:14px;color:var(--muted)"> m</span></div><div class="kpi-sub">lúc 14:00 – Sông Hồng</div></div>
    <div class="kpi-card" style="--accent-color:var(--danger)"><div class="kpi-label">Sự cố đê điều (YTD)</div><div class="kpi-value" style="color:var(--danger)">${BIZ_STATS.openIncidents}</div><div class="kpi-sub">Hiện tại đang xử lý</div></div>
  </div>
  <div class="tabs">
    <button class="tab-btn ${dikeTab === 'overview' ? 'active' : ''}" onclick="switchDikeTab('overview')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M3 17h18M5 17V9l7-5 7 5v8"/></svg> Tổng quan Tuyến đê</button>
    <button class="tab-btn ${dikeTab === 'seepage' ? 'active' : ''}" onclick="switchDikeTab('seepage')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 2v20M17 5H7M17 19H7"/></svg> Giám sát Thẩm lậu</button>
    <button class="tab-btn ${dikeTab === 'incidents' ? 'active' : ''}" onclick="switchDikeTab('incidents')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg> Sự cố & Vi phạm</button>
    <button class="tab-btn ${dikeTab === 'maintenance' ? 'active' : ''}" onclick="switchDikeTab('maintenance')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Lịch sử Tuần tra</button>
  </div>
  <div id="nrwContent">${getDikeTabContent()}</div>`;
}

function switchDikeTab(tab) {
  dikeTab = tab;
  document.querySelectorAll('.tabs .tab-btn').forEach(b => b.classList.remove('active'));
  // Re-find and activate
  const btns = document.querySelectorAll('.tabs .tab-btn');
  const target = tab === 'overview' ? btns[0] : tab === 'seepage' ? btns[1] : tab === 'incidents' ? btns[2] : btns[3];
  if (target) target.classList.add('active');
  
  document.getElementById('nrwContent').innerHTML = getDikeTabContent();
}

function getDikeTabContent() {
  if (dikeTab === 'overview') return renderDikeOverview();
  if (dikeTab === 'seepage') return renderSeepageMonitoring();
  if (dikeTab === 'incidents') return renderDikeIncidents();
  if (dikeTab === 'maintenance') return renderDikeMaintenance();
  return '';
}

window.afterRender_nrw = function () { };

function renderDikeOverview() {
  return `
  <div class="grid-auto" style="margin-bottom:16px">
    ${DIKE_DATA.map((d) => {
    const pct = Math.round((d.heightCurrent / d.heightDesign) * 100);
    const c = d.condition === 'critical' ? 'var(--danger)' : d.condition === 'warning' ? 'var(--warning)' : 'var(--success)';
    const statusLabel = d.condition === 'critical' ? 'Xung yếu' : d.condition === 'warning' ? 'Cảnh báo' : 'An toàn';
    
    return `<div class="card" style="padding:18px">
        <div style="display:flex;justify-content:space-between;margin-bottom:10px">
          <div><div style="font-size:14px;font-weight:600">${d.name}</div><div style="font-size:12px;color:var(--muted)">${d.district}</div></div>
          <span class="badge ${d.condition === 'critical' ? 'badge-red' : d.condition === 'warning' ? 'badge-yellow' : 'badge-green'}">${statusLabel}</span>
        </div>
        <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:8px">
          <div style="font-size:32px;font-weight:700;font-family:'Roboto Mono',monospace;color:${c}">${d.heightCurrent}</div>
          <div style="font-size:16px;color:var(--muted)">m</div>
          <div style="font-size:12px;color:var(--muted);margin-left:4px">cao trình thực tế</div>
        </div>
        <div class="progress-bar" style="height:7px;margin-bottom:12px"><div class="progress-fill" style="width:${pct}%;background:${c}"></div></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px">
          <div><span style="color:var(--muted)">Cao trình TK: </span><span class="mono">${d.heightDesign} m</span></div>
          <div><span style="color:var(--muted)">Chiều dài: </span><span class="mono">${d.length} km</span></div>
          <div><span style="color:var(--muted)">Phân cấp: </span><span class="mono">Cấp ${d.grade}</span></div>
          <div><span style="color:var(--muted)">Người QL: </span><span class="mono">${d.manager}</span></div>
        </div>
        <div style="margin-top:10px">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
            <button class="btn btn-ghost btn-sm" onclick="gisZoomTo(${d.lat}, ${d.lng}, 15)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg> Xem GIS</button>
            <button class="btn btn-primary btn-sm" onclick="showToast('Đang tải hồ sơ kỹ thuật đê...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Chi tiết</button>
          </div>
        </div>
      </div>`;
  }).join('')}
  </div>`;
}

function renderSeepageMonitoring() {
  return `
  <div style="background:rgba(0,200,255,.08);border:1px solid rgba(0,200,255,.25);border-radius:10px;padding:14px 18px;margin-bottom:14px;font-size:13px">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> <strong>Giám sát Thẩm lậu & Mạch sủi</strong> — Theo dõi dữ liệu từ các cảm biến áp lực kẽ rỗng và các điểm quan trắc thực địa để phát hiện sớm nguy cơ mất an toàn thân đê.
  </div>
  <div class="card">
    <div class="card-header"><span class="card-title">Các điểm có nguy cơ thẩm lậu (Real-time)</span></div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Tên điểm / Tuyến</th>
            <th>Vị trí (Lý trình)</th>
            <th>Áp lực (kPa)</th>
            <th>Ngưỡng an toàn</th>
            <th>Trạng thái</th>
            <th>Cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><b>Đê Hữu Đáy</b></td>
            <td>K18+500</td>
            <td class="text-red">85.2</td>
            <td>75.0</td>
            <td><span class="badge badge-red">Nguy hiểm</span></td>
            <td>10 phút trước</td>
            <td><button class="btn btn-primary btn-sm" onclick="showToast('Đã phát lệnh ứng cứu khẩn cấp!')">Ứng cứu ngay</button></td>
          </tr>
          <tr>
            <td><b>Đê Ngọc Tảo</b></td>
            <td>K5+200</td>
            <td class="text-yellow">68.5</td>
            <td>70.0</td>
            <td><span class="badge badge-yellow">Cảnh báo</span></td>
            <td>15 phút trước</td>
            <td><button class="btn btn-ghost btn-sm">Theo dõi</button></td>
          </tr>
          <tr>
            <td><b>Đê Tả Hồng</b></td>
            <td>K42+100</td>
            <td class="text-green">42.0</td>
            <td>75.0</td>
            <td><span class="badge badge-green">An toàn</span></td>
            <td>30 phút trước</td>
            <td><button class="btn btn-ghost btn-sm">Chi tiết</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`;
}

function renderDikeIncidents() {
  const incidents = DATA.incidents.filter(i => i.status !== 'done');
  return `
  <div style="display:flex;flex-direction:column;gap:12px">
    ${incidents.map(i => `
    <div class="card" style="padding:18px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div>
          <div style="font-size:15px;font-weight:700">${i.type} <span class="badge badge-blue" style="font-size:10px">${i.id}</span></div>
          <div style="font-size:12px;color:var(--muted);margin-top:4px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="21 10 21 6 17 6"/><polyline points="3 14 3 18 7 18"/></svg> Vị trí: ${i.location}</div>
        </div>
        <span class="badge ${i.severity === 'critical' ? 'badge-red' : 'badge-yellow'}">${i.severity.toUpperCase()}</span>
      </div>
      <div style="font-size:13px;color:var(--text2);line-height:1.5;margin-bottom:12px;background:var(--bg-secondary);padding:10px;border-radius:6px;border:1px solid var(--border)">
        ${i.note}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13px">
        <div><span style="color:var(--muted)">Đơn vị xử lý: </span>${i.assignedTo || 'Chưa phân công'}</div>
        <div><span style="color:var(--muted)">Thời gian báo: </span>${i.report}</div>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn btn-ghost btn-sm" style="flex:1" onclick="gisZoomTo(${i.lat}, ${i.lng}, 16)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/></svg> Xem trên GIS</button>
        <button class="btn btn-primary btn-sm" style="flex:1" onclick="showToast('Đang cập nhật tiến độ xử lý...')">Cập nhật tiến độ</button>
      </div>
    </div>`).join('')}
  </div>`;
}

function renderDikeMaintenance() {
  return `
  <div class="card">
    <div class="card-header"><span class="card-title">Nhật ký Tuần tra & Kiểm tra (7 ngày qua)</span></div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Tuyến đê</th>
            <th>Cán bộ phụ trách</th>
            <th>Nội dung thực hiện</th>
            <th>Kết quả</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>12/03/2026</td>
            <td>Đê Hữu Đáy</td>
            <td>Nguyễn Văn Sơn</td>
            <td>Kiểm tra sạt lở K18-K20</td>
            <td><span class="badge badge-red">Sự cố mới</span></td>
            <td>Phát hiện thẩm lậu cục bộ</td>
          </tr>
          <tr>
            <td>11/03/2026</td>
            <td>Đê Tả Hồng</td>
            <td>Trần Thị Hương</td>
            <td>Kiểm tra định kỳ quý I</td>
            <td><span class="badge badge-green">Bình thường</span></td>
            <td>—</td>
          </tr>
          <tr>
            <td>10/03/2026</td>
            <td>Đê Ngọc Tảo</td>
            <td>Lê Hùng Cường</td>
            <td>Khảo sát cao trình mặt đê</td>
            <td><span class="badge badge-yellow">Cảnh báo</span></td>
            <td>Có dấu hiệu lún nhẹ chân đê</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`;
}
