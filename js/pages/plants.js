// ── PLANTS MANAGEMENT ─────────────────────────────────────────────
let plantsViewMode = 'grid'; // grid | list
let plantSearchQuery = '';

function renderPlants() {
  const canEdit = canManage('plants');
  const filteredPlants = DATA.factories.filter(f =>
    f.name.toLowerCase().includes(plantSearchQuery.toLowerCase()) ||
    f.location.toLowerCase().includes(plantSearchQuery.toLowerCase()) ||
    f.address.toLowerCase().includes(plantSearchQuery.toLowerCase())
  );

  return `
  <div class="page-header">
    <div class="page-title">
      <h1>Quản lý Nhà máy</h1>
      <p>Hệ thống quản lý, giám sát và vận hành các nhà máy nước & trạm bơm</p>
    </div>
    <div class="page-actions">
      <!-- Search Bar -->
      <div style="position:relative; margin-right:12px">
        <input type="text" class="form-control" placeholder="Tìm tên nhà máy, địa điểm..." 
          style="width:280px; padding-left:36px; height:36px; background:rgba(255,255,255,0.04); border:1px solid var(--border); border-radius:10px"
          onkeyup="handlePlantSearch(this.value)" value="${plantSearchQuery}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2" style="position:absolute; left:12px; top:10px"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </div>

      <!-- Export Button -->
      <button class="btn btn-ghost" onclick="exportPlantsToExcel()" style="margin-right:12px">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Xuất Excel
      </button>

      <div style="display:flex; background:rgba(255,255,255,0.05); padding:4px; border-radius:10px; margin-right:12px; border:1px solid var(--border)">
        <button class="btn btn-icon btn-sm" onclick="switchPlantsView('grid')" title="Dạng lưới" 
          style="border:none; border-radius:7px; background:${plantsViewMode === 'grid' ? 'var(--cyan)' : 'transparent'}; color:${plantsViewMode === 'grid' ? '#fff' : 'var(--muted)'}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        </button>
        <button class="btn btn-icon btn-sm" onclick="switchPlantsView('list')" title="Dạng danh sách" 
          style="border:none; border-radius:7px; background:${plantsViewMode === 'list' ? 'var(--cyan)' : 'transparent'}; color:${plantsViewMode === 'list' ? '#fff' : 'var(--muted)'}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        </button>
      </div>
      ${canEdit ? `<button class="btn btn-primary" onclick="openAddFactory()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Thêm nhà máy</button>` : ''}
    </div>
  </div>
  <div id="plantsContent">${plantsViewMode === 'grid' ? renderPlantsGrid(filteredPlants, canEdit) : renderPlantsList(filteredPlants, canEdit)}</div>`;
}

function handlePlantSearch(val) {
  plantSearchQuery = val;
  const content = document.getElementById('plantsContent');
  if (content) {
    const canEdit = canManage('plants');
    const filteredPlants = DATA.factories.filter(f =>
      f.name.toLowerCase().includes(plantSearchQuery.toLowerCase()) ||
      f.location.toLowerCase().includes(plantSearchQuery.toLowerCase()) ||
      f.address.toLowerCase().includes(plantSearchQuery.toLowerCase())
    );
    content.innerHTML = plantsViewMode === 'grid' ? renderPlantsGrid(filteredPlants, canEdit) : renderPlantsList(filteredPlants, canEdit);
  }
}

function exportPlantsToExcel() {
  showToast('Đang chuẩn bị dữ liệu xuất Excel...');
  setTimeout(() => {
    showToast('Đang tạo file báo cáo danh sách nhà máy (9 bản ghi)...');
    setTimeout(() => {
      showToast('Đã tải xuống file: QUAN_LY_NHA_MAY_' + new Date().toISOString().slice(0, 10) + '.xlsx', 'success');
    }, 1500);
  }, 1000);
}

function switchPlantsView(mode) {
  plantsViewMode = mode;
  const content = document.getElementById('plantsContent');
  if (content) {
    const canEdit = canManage('plants');
    const filteredPlants = DATA.factories.filter(f =>
      f.name.toLowerCase().includes(plantSearchQuery.toLowerCase()) ||
      f.location.toLowerCase().includes(plantSearchQuery.toLowerCase()) ||
      f.address.toLowerCase().includes(plantSearchQuery.toLowerCase())
    );
    content.innerHTML = plantsViewMode === 'grid' ? renderPlantsGrid(filteredPlants, canEdit) : renderPlantsList(filteredPlants, canEdit);
    // Refresh page header to update toggle button states
    const header = document.querySelector('.page-header');
    if (header) {
      // Re-render whole page to update header UI
      navigate('plants');
    }
  }
}

function renderPlantsGrid(filteredPlants, canEdit) {
  if (filteredPlants.length === 0) {
    return `<div style="text-align:center; padding:100px 20px">
      <div style="font-size:48px; color:rgba(255,255,255,0.05); margin-bottom:16px">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </div>
      <div style="font-size:16px; color:var(--muted)">Không tìm thấy nhà máy nào khớp với từ khóa "${plantSearchQuery}"</div>
      <button class="btn btn-ghost" onclick="handlePlantSearch(''); renderPlants();" style="margin-top:16px">Xóa lọc</button>
    </div>`;
  }
  return `
  <div class="grid-auto">
  ${filteredPlants.map(f => `
  <div class="card" style="padding:20px; transition: transform 0.2s; cursor: pointer" onclick="openPlantDetail(${f.id})" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px">
      <div>
        <div style="font-size:15px;font-weight:700;color:var(--text)">${f.name}</div>
        <div style="font-size:12px;color:var(--muted);display:flex;align-items:center;gap:4px">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${f.location}
        </div>
      </div>
      ${statusBadge(f.status)}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      <div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px;padding:10px">
        <div style="font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px">Công suất TK</div>
        <div style="font-size:16px;font-weight:700;font-family:'Roboto Mono',monospace;color:var(--cyan)">${formatNum(f.capacity)} <span style="font-size:10px;font-weight:400;color:var(--muted)">m³/n</span></div>
      </div>
      <div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px;padding:10px">
        <div style="font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px">Thực tế</div>
        <div style="font-size:16px;font-weight:700;font-family:'Roboto Mono',monospace;color:var(--green)">${formatNum(f.output)} <span style="font-size:10px;font-weight:400;color:var(--muted)">m³/n</span></div>
      </div>
    </div>
    <div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-bottom:4px">
        <span>Hiệu suất vận hành</span><span>${Math.round(f.output / f.capacity * 100)}%</span>
      </div>
      <div class="progress-bar" style="height:6px; background:rgba(255,255,255,0.05)">
        <div class="progress-fill" style="width:${f.output / f.capacity * 100}%;background:linear-gradient(90deg, var(--cyan), var(--green))"></div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px;color:var(--muted)">
       <div style="display:flex;align-items:center;gap:4px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${f.manager}</div>
       <div style="display:flex;align-items:center;gap:4px;justify-content:flex-end"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${f.established}</div>
    </div>
    <div style="display:flex;gap:8px;margin-top:16px;border-top:1px solid var(--border);padding-top:12px">
      <button class="btn btn-ghost btn-sm" style="flex:1" onclick="event.stopPropagation(); openPlantDetail(${f.id})">Chi tiết</button>
      ${canEdit ? `<button class="btn btn-outline btn-sm" style="flex:1" onclick="event.stopPropagation(); openEditPlant(${f.id})">Sửa</button>` : ''}
    </div>
  </div>`).join('')}
  </div>`;
}

function renderPlantsList(filteredPlants, canEdit) {
  if (filteredPlants.length === 0) {
    return `<div style="text-align:center; padding:100px 20px">
      <div style="font-size:48px; color:rgba(255,255,255,0.05); margin-bottom:16px">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </div>
      <div style="font-size:16px; color:var(--muted)">Không tìm thấy nhà máy nào khớp với từ khóa "${plantSearchQuery}"</div>
      <button class="btn btn-ghost" onclick="handlePlantSearch(''); renderPlants();" style="margin-top:16px">Xóa lọc</button>
    </div>`;
  }
  return `
  <div class="card" style="padding:0; overflow:hidden">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Nhà máy / Trạm bơm</th>
            <th>Địa chỉ / GIS</th>
            <th class="text-right">Công suất TK</th>
            <th class="text-right">Sản lượng TT</th>
            <th>Hiệu suất</th>
            <th>Chỉ số vận hành</th>
            <th>Trạng thái</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${filteredPlants.map(f => `
          <tr class="hover-row" onclick="openPlantDetail(${f.id})">
            <td>
              <div style="font-weight:600; color:var(--text)">${f.name}</div>
              <div style="font-size:11px; color:var(--muted)">ID: NM-${f.id.toString().padStart(2, '0')} | QL: ${f.manager}</div>
            </td>
            <td>
              <a href="https://maps.google.com/?q=${encodeURIComponent(f.address)}" target="_blank" class="gis-link" onclick="event.stopPropagation()" style="display:flex; align-items:center; gap:5px; color:var(--cyan); font-size:12px; text-decoration:none">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
                ${f.address}
              </a>
            </td>
            <td class="text-right mono" style="font-weight:600">${formatNum(f.capacity)}</td>
            <td class="text-right mono" style="font-weight:600; color:var(--green)">${formatNum(f.output)}</td>
            <td>
              <div style="display:flex; align-items:center; gap:8px">
                 <div class="progress-bar" style="width:60px; height:5px; background:rgba(255,255,255,0.05)">
                   <div class="progress-fill" style="width:${f.output / f.capacity * 100}%; background:var(--cyan)"></div>
                 </div>
                 <span class="mono" style="font-size:11px">${Math.round(f.output / f.capacity * 100)}%</span>
              </div>
            </td>
            <td>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:x-large; font-size:11px">
                <div title="Điện năng tiêu thụ (kWh/m³)">⚡ ${f.powerUsage} <span style="color:var(--muted)">kWh</span></div>
                <div title="Tỷ lệ thất thoát (%)">💧 ${f.loss}% <span style="color:var(--muted)">loss</span></div>
                <div title="Chi phí hóa chất (đ/m³)">🧪 ${formatNum(f.chemicalCost)} <span style="color:var(--muted)">đ</span></div>
                <div title="Tỷ lệ đạt chuẩn (%)">✅ ${f.compliance}% <span style="color:var(--muted)">std</span></div>
              </div>
            </td>
            <td>${statusBadge(f.status)}</td>
            <td class="text-center">
              <div style="display:flex; gap:5px; justify-content:center">
                <button class="btn btn-ghost btn-icon btn-sm" onclick="event.stopPropagation(); openPlantDetail(${f.id})" title="Chi tiết">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                ${canEdit ? `<button class="btn btn-ghost btn-icon btn-sm" onclick="event.stopPropagation(); openEditPlant(${f.id})" title="Chỉnh sửa">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>` : ''}
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

// ── MODALS ───────────────────────────────────────────────────────

function openPlantDetail(id) {
  const f = DATA.factories.find(x => x.id == id);
  if (!f) return;
  openModal(`
  <div class="modal-header">
    <span class="modal-title">Chi tiết Nhà máy: ${f.name}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body">
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:20px">
      <div class="card" style="padding:16px; background:rgba(255,255,255,0.02)">
        <h4 style="margin:0 0 12px 0; color:var(--cyan); font-size:13px; text-transform:uppercase">Thông tin cơ bản</h4>
        <div style="display:grid; gap:8px; font-size:13px">
          <div style="display:flex; justify-content:space-between"><span style="color:var(--muted)">Địa bàn:</span> <span>${f.location}</span></div>
          <div style="display:flex; justify-content:space-between"><span style="color:var(--muted)">Địa chỉ:</span> <span style="text-align:right">${f.address}</span></div>
          <div style="display:flex; justify-content:space-between"><span style="color:var(--muted)">Năm thành lập:</span> <span>${f.established}</span></div>
          <div style="display:flex; justify-content:space-between"><span style="color:var(--muted)">Quản lý:</span> <span>${f.manager}</span></div>
          <div style="display:flex; justify-content:space-between"><span style="color:var(--muted)">Trạng thái:</span> ${statusBadge(f.status)}</div>
        </div>
      </div>
      <div class="card" style="padding:16px; background:rgba(255,255,255,0.02)">
        <h4 style="margin:0 0 12px 0; color:var(--green); font-size:13px; text-transform:uppercase">Hiệu suất & Sản lượng</h4>
        <div style="display:grid; gap:8px; font-size:13px">
          <div style="display:flex; justify-content:space-between"><span style="color:var(--muted)">Công suất TK:</span> <span class="mono">${formatNum(f.capacity)} m³/n</span></div>
          <div style="display:flex; justify-content:space-between"><span style="color:var(--muted)">Sản lượng TT:</span> <span class="mono">${formatNum(f.output)} m³/n</span></div>
          <div style="display:flex; justify-content:space-between"><span style="color:var(--muted)">Hiệu suất NM:</span> <span class="mono">${Math.round(f.output / f.capacity * 100)}%</span></div>
          <div style="display:flex; justify-content:space-between"><span style="color:var(--muted)">Tỷ lệ thất thoát:</span> <span class="mono" style="color:var(--red)">${f.loss}%</span></div>
        </div>
      </div>
    </div>
    
    <div class="card" style="padding:16px; background:rgba(255,255,255,0.02); margin-bottom:20px">
      <h4 style="margin:0 0 12px 0; color:var(--yellow); font-size:13px; text-transform:uppercase">Chỉ số vận hành & Kinh doanh</h4>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px">
        <div style="display:grid; gap:10px">
          <div style="padding:10px; background:rgba(0,200,255,0.05); border-radius:8px">
            <div style="font-size:11px; color:var(--muted)">Điện năng tiêu thụ</div>
            <div style="font-size:18px; font-weight:700; color:var(--cyan)">${f.powerUsage} <span style="font-size:12px; font-weight:400">kWh/m³</span></div>
          </div>
          <div style="padding:10px; background:rgba(76,175,80,0.05); border-radius:8px">
            <div style="font-size:11px; color:var(--muted)">Tuân thủ chất lượng</div>
            <div style="font-size:18px; font-weight:700; color:var(--green)">${f.compliance}%</div>
          </div>
        </div>
        <div style="display:grid; gap:10px">
          <div style="padding:10px; background:rgba(255,193,7,0.05); border-radius:8px">
            <div style="font-size:11px; color:var(--muted)">Chi phí hóa chất</div>
            <div style="font-size:18px; font-weight:700; color:var(--yellow)">${formatNum(f.chemicalCost)} <span style="font-size:12px; font-weight:400">đ/m³</span></div>
          </div>
          <div style="padding:10px; background:rgba(156,39,176,0.05); border-radius:8px">
            <div style="font-size:11px; color:var(--muted)">Doanh thu dự kiến (24h)</div>
            <div style="font-size:18px; font-weight:700; color:#ba68c8">${formatNum(f.output * 8500)} <span style="font-size:12px; font-weight:400">VND</span></div>
          </div>
        </div>
      </div>
    </div>
    
    <div style="display:flex; justify-content:center; gap:12px">
        <button class="btn btn-ghost" onclick="openPlantGIS(${f.id})">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/></svg> Xem trên bản đồ GIS
        </button>
        <button class="btn btn-ghost" onclick="openPlantCamera(${f.id})">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Xem Camera Nhà máy
        </button>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-primary" onclick="closeModal()">Đóng</button>
  </div>`);
}

// ── GIS MAP MODAL ────────────────────────────────────────────────
function openPlantGIS(id) {
  const f = DATA.factories.find(x => x.id == id);
  if (!f) return;
  // Find related stations
  const shortName = f.name.replace('Nhà máy ', '').replace('Trạm ', '');
  const relatedStations = DATA.stations.filter(s => s.factory === shortName || f.name.includes(s.factory));

  openModal(`
  <div class="modal-header">
    <span class="modal-title" style="display:flex;align-items:center;gap:8px">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
      Bản đồ GIS — ${f.name}
    </span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body" style="padding:0; overflow:hidden">
    <div id="plantGISMap" style="width:100%; height:420px; border-radius:0 0 12px 12px"></div>
    <div style="padding:14px 20px; display:flex; gap:20px; align-items:center; flex-wrap:wrap; border-top:1px solid var(--border)">
      <div style="display:flex; align-items:center; gap:6px; font-size:12px">
        <div style="width:12px;height:12px;border-radius:50%;background:var(--cyan);border:2px solid rgba(0,200,255,.4)"></div>
        <span style="color:var(--muted)">Nhà máy</span>
      </div>
      <div style="display:flex; align-items:center; gap:6px; font-size:12px">
        <div style="width:12px;height:12px;border-radius:50%;background:var(--green);border:2px solid rgba(0,230,118,.4)"></div>
        <span style="color:var(--muted)">Trạm bơm Online</span>
      </div>
      <div style="display:flex; align-items:center; gap:6px; font-size:12px">
        <div style="width:12px;height:12px;border-radius:50%;background:var(--yellow);border:2px solid rgba(255,202,40,.4)"></div>
        <span style="color:var(--muted)">Cảnh báo</span>
      </div>
      <div style="display:flex; align-items:center; gap:6px; font-size:12px">
        <div style="width:12px;height:12px;border-radius:50%;background:var(--red);border:2px solid rgba(239,83,80,.4)"></div>
        <span style="color:var(--muted)">Offline / Sự cố</span>
      </div>
      <div style="margin-left:auto; font-size:11px; color:var(--muted)">
        <span class="mono">${f.lat.toFixed(4)}, ${f.lng.toFixed(4)}</span> · ${f.address}
      </div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="window.open('https://maps.google.com/?q=${f.lat},${f.lng}', '_blank')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      Mở Google Maps
    </button>
    <button class="btn btn-primary" onclick="closeModal()">Đóng</button>
  </div>`);

  // Init Leaflet map after modal renders
  setTimeout(() => {
    const mapEl = document.getElementById('plantGISMap');
    if (!mapEl || !window.L) return;
    const map = L.map(mapEl, { zoomControl: true, attributionControl: false }).setView([f.lat, f.lng], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map);

    // Factory marker (cyan)
    const factoryIcon = L.divIcon({
      className: 'custom-div-icon',
      html: '<div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#0050cc,#00c8ff);border:3px solid rgba(0,200,255,.5);box-shadow:0 0 16px rgba(0,200,255,.4);display:flex;align-items:center;justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M2 20V9l4-2 4 2V5l4-2 4 2v15"/></svg></div>',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
    L.marker([f.lat, f.lng], { icon: factoryIcon })
      .addTo(map)
      .bindPopup('<b>' + f.name + '</b><br>' + f.address + '<br>Công suất: ' + formatNum(f.capacity) + ' m³/n');

    // Station markers
    relatedStations.forEach(s => {
      const color = s.status === 'online' ? '#00e676' : s.status === 'warning' ? '#ffca28' : '#ef5350';
      const stIcon = L.divIcon({
        className: 'custom-div-icon',
        html: '<div style="width:20px;height:20px;border-radius:50%;background:' + color + ';border:2px solid rgba(255,255,255,.5);box-shadow:0 0 10px ' + color + '60;"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      L.marker([s.lat, s.lng], { icon: stIcon })
        .addTo(map)
        .bindPopup('<b>' + s.name + '</b><br>Áp suất: ' + s.pressure + ' ' + s.pressureUnit + '<br>Lưu lượng: ' + s.flow + ' m³/h');
    });

    // Fit bounds if there are stations
    if (relatedStations.length > 0) {
      const allPoints = [[f.lat, f.lng], ...relatedStations.map(s => [s.lat, s.lng])];
      map.fitBounds(allPoints, { padding: [40, 40], maxZoom: 14 });
    }

    setTimeout(() => map.invalidateSize(), 200);
  }, 150);
}

// ── CAMERA VIEWER — Navigate to CCTV page with site filter ──────
function openPlantCamera(id) {
  const f = DATA.factories.find(x => x.id == id);
  if (!f) return;
  // Close any open modal first
  if (typeof closeModal === 'function') closeModal();
  // Use setTimeout to ensure modal is fully closed before navigating
  setTimeout(() => {
    // Set the camera page filter to this factory's site name, then navigate
    camFilterSite = f.name;
    camFilterStatus = 'all';
    camFilterNvr = 'all';
    camFilterLocType = 'all';
    camFilterSubLoc = 'all';
    camActivePage = 'live';
    navigate('camera');
    showToast('Đang hiển thị camera tại ' + f.name);
  }, 180);
}

/* ── [COMMENTED OUT] Standalone Camera Modal ────────────────────
   Kept for potential future reuse as an embedded camera viewer.
const PLANT_CAMERAS = { ... };
function _openPlantCameraModal(id) { ... }
── END COMMENTED OUT ── */

function openEditPlant(id) {
  const f = DATA.factories.find(x => x.id == id);
  if (!f) return;
  openModal(`
  <div class="modal-header">
    <span class="modal-title">Sửa thông tin nhà máy: ${f.name}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body" style="display:flex; flex-direction:column; gap:16px">
    <div class="form-group" style="margin:0">
      <label class="form-label">Tên nhà máy</label>
      <input class="form-control" value="${f.name}">
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px">
      <div class="form-group" style="margin:0">
        <label class="form-label">Công suất thiết kế (m³/ngày)</label>
        <input class="form-control" type="number" value="${f.capacity}">
      </div>
      <div class="form-group" style="margin:0">
        <label class="form-label">Sản lượng thực tế (m³/ngày)</label>
        <input class="form-control" type="number" value="${f.output}">
      </div>
    </div>
    <div class="form-group" style="margin:0">
      <label class="form-label">Địa chỉ</label>
      <input class="form-control" value="${f.address}">
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px">
      <div class="form-group" style="margin:0">
        <label class="form-label">Vĩ độ (Latitude)</label>
        <input class="form-control" type="number" step="0.0001" value="${f.lat}" placeholder="Vd: 20.9595">
      </div>
      <div class="form-group" style="margin:0">
        <label class="form-label">Kinh độ (Longitude)</label>
        <input class="form-control" type="number" step="0.0001" value="${f.lng}" placeholder="Vd: 107.0700">
      </div>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px">
      <div class="form-group" style="margin:0">
        <label class="form-label">Người quản lý</label>
        <input class="form-control" value="${f.manager}">
      </div>
      <div class="form-group" style="margin:0">
        <label class="form-label">Trạng thái</label>
        <select class="form-control">
          <option value="active" ${f.status === 'active' ? 'selected' : ''}>Hoạt động bình thường</option>
          <option value="warning" ${f.status === 'warning' ? 'selected' : ''}>Cảnh báo vận hành</option>
          <option value="fault" ${f.status === 'fault' ? 'selected' : ''}>Sự cố / Bảo trì</option>
        </select>
      </div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('Đã lưu thay đổi cho nhà máy ${f.name}!')">Lưu thay đổi</button>
  </div>`);
}

function openAddFactory() {
  openModal(`
  <div class="modal-header">
    <span class="modal-title">Thêm nhà máy mới</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body" style="display:flex; flex-direction:column; gap:16px">
    <div class="form-group" style="margin:0">
      <label class="form-label">Tên nhà máy / Trạm bơm</label>
      <input class="form-control" placeholder="Nhập tên nhà máy...">
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px">
      <div class="form-group" style="margin:0">
        <label class="form-label">Công suất thiết kế (m³/ngày)</label>
        <input class="form-control" type="number" placeholder="Vd: 25000">
      </div>
      <div class="form-group" style="margin:0">
        <label class="form-label">Sản lượng thực tế (m³/ngày)</label>
        <input class="form-control" type="number" placeholder="Vd: 22000">
      </div>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px">
      <div class="form-group" style="margin:0">
        <label class="form-label">Địa bàn quản lý</label>
        <input class="form-control" placeholder="Vd: Ba Vì">
      </div>
      <div class="form-group" style="margin:0">
        <label class="form-label">Năm thành lập</label>
        <input class="form-control" type="number" placeholder="Vd: 2005">
      </div>
    </div>
    <div class="form-group" style="margin:0">
      <label class="form-label">Địa chỉ chi tiết</label>
      <input class="form-control" placeholder="Số nhà, đường, phường/xã...">
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px">
      <div class="form-group" style="margin:0">
        <label class="form-label">Vĩ độ (Latitude)</label>
        <input class="form-control" type="number" step="0.0001" placeholder="Vd: 20.9595">
      </div>
      <div class="form-group" style="margin:0">
        <label class="form-label">Kinh độ (Longitude)</label>
        <input class="form-control" type="number" step="0.0001" placeholder="Vd: 107.0700">
      </div>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px">
      <div class="form-group" style="margin:0">
        <label class="form-label">Người quản lý</label>
        <input class="form-control" placeholder="Nhập tên...">
      </div>
      <div class="form-group" style="margin:0">
        <label class="form-label">Trạng thái</label>
        <select class="form-control">
          <option value="active" selected>Hoạt động bình thường</option>
          <option value="warning">Cảnh báo vận hành</option>
          <option value="fault">Sự cố / Bảo trì</option>
        </select>
      </div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('Đã gửi yêu cầu thêm nhà máy mới. Đang chờ phê duyệt!')">Tạo mới</button>
  </div>`);
}
