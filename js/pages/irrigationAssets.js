// ── HADIWA IOC — IRRIGATION ASSETS (CÔNG TRÌNH THỦY LỢI) ──────────
// Quản lý hồ sơ hồ chứa, trạm bơm, cống thủy lợi

function renderAssets() {
  const assets = [
    ...(window.RESERVOIR_DATA || []).map(r => ({
      ...r,
      category: 'reservoir', typeLabel: 'Hồ chứa',
      capacity: r.capacity, unit: 'm³',
      manager: r.manager || 'Chi cục',
    })),
    { id: 'TB-01', name: 'Trạm bơm tiêu Cổ Nhuế', district: 'H. Bắc Từ Liêm', capacity: 16.5, unit: 'm³/s', typeLabel: 'Trạm bơm', category: 'pump', status: 'ok', manager: 'Lê Hùng Cường', irrigates: 850, yearBuilt: 1989, lastInspect: '08/02/2026', issues: 1 },
    { id: 'TB-02', name: 'Trạm bơm tưới Đan Hoài', district: 'H. Đan Phượng', capacity: 12.0, unit: 'm³/s', typeLabel: 'Trạm bơm', category: 'pump', status: 'warning', manager: 'Đỗ Mạnh Tuân', irrigates: 420, yearBuilt: 1995, lastInspect: '12/02/2026', issues: 2 },
    { id: 'TB-03', name: 'Trạm bơm tiêu Yên Sở', district: 'Q. Hoàng Mai', capacity: 45.0, unit: 'm³/s', typeLabel: 'Trạm bơm', category: 'pump', status: 'ok', manager: 'Lý Thị Thảo', irrigates: 2200, yearBuilt: 1985, lastInspect: '20/01/2026', issues: 0 },
    { id: 'CO-01', name: 'Cống Liên Mạc', district: 'Q. Bắc Từ Liêm', capacity: 85.2, unit: 'm³/s', typeLabel: 'Cống tiêu', category: 'sluice', status: 'ok', manager: 'Phạm Thị Ngọc', irrigates: 0, yearBuilt: 1978, lastInspect: '05/03/2026', issues: 1 },
    { id: 'CO-02', name: 'Cống Cẩm Đình', district: 'H. Phúc Thọ', capacity: 42.5, unit: 'm³/s', typeLabel: 'Cống lấy nước', category: 'sluice', status: 'critical', manager: 'Hoàng Văn Bình', irrigates: 3800, yearBuilt: 1970, lastInspect: '10/03/2026', issues: 5 },
    { id: 'CO-03', name: 'Cống Hà Bình', district: 'H. Thường Tín', capacity: 28.6, unit: 'm³/s', typeLabel: 'Cống tiêu', category: 'sluice', status: 'ok', manager: 'Nguyễn Thị Vân', irrigates: 0, yearBuilt: 1982, lastInspect: '14/02/2026', issues: 0 },
  ];

  const byStatus = s => assets.filter(a => a.status === s).length;

  return `
  <div class="page-header">
    <div class="page-title">
      <h1>Hồ sơ Công trình Thủy lợi</h1>
      <p>Quản lý ${assets.length} công trình: Hồ chứa, Trạm bơm, Cống tiêu/tưới</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-ghost btn-sm" onclick="exportAssetsExcel()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Xuất Excel
      </button>
      <button class="btn btn-primary btn-sm" onclick="openAddAssetModal()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Thêm công trình
      </button>
    </div>
  </div>

  <div class="tabs" style="margin-bottom:16px">
    <button class="tab-btn ${(window._assetTab||'list')==='list'?'active':''}" onclick="switchAssetTab('list')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      Hồ sơ CTTL (${assets.length})
    </button>
    <button class="tab-btn ${(window._assetTab||'list')==='invest'?'active':''}" onclick="switchAssetTab('invest')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 00 0 7h5a3.5 3.5 0 010 7H6"/></svg>
      Đầu tư &amp; Nâng cấp CTTL
    </button>
  </div>

  <div id="assetTabContent">${(window._assetTab||'list')==='invest' ? _renderInvestTab() : _renderAssetListTab(assets, byStatus)}</div>`;
}

window.switchAssetTab = function(tab) {
  window._assetTab = tab;
  // Update tab button active states
  document.querySelectorAll('.tabs .tab-btn').forEach(b => {
    const onclick = b.getAttribute('onclick') || '';
    b.classList.toggle('active', onclick.includes(`'${tab}'`));
  });
  // Only update content area, not the whole page
  const content = document.getElementById('assetTabContent');
  if (content) {
    const assets = [
      ...(window.RESERVOIR_DATA || []).map(r => ({...r, category:'reservoir', typeLabel:'Hồ chứa', capacity:r.capacity, unit:'m³', manager:r.manager||'Chi cục'})),
      { id:'TB-01', name:'Trạm bơm tiêu Cổ Nhuế', district:'H. Bắc Từ Liêm', capacity:16.5, unit:'m³/s', typeLabel:'Trạm bơm', category:'pump', status:'ok', manager:'Lê Hùng Cường', irrigates:850, yearBuilt:1989, lastInspect:'08/02/2026', issues:1 },
      { id:'TB-02', name:'Trạm bơm tưới Đan Hoài', district:'H. Đan Phượng', capacity:12.0, unit:'m³/s', typeLabel:'Trạm bơm', category:'pump', status:'warning', manager:'Đỗ Mạnh Tuân', irrigates:420, yearBuilt:1995, lastInspect:'12/02/2026', issues:2 },
      { id:'TB-03', name:'Trạm bơm tiêu Yên Sở', district:'Q. Hoàng Mai', capacity:45.0, unit:'m³/s', typeLabel:'Trạm bơm', category:'pump', status:'ok', manager:'Lý Thị Thảo', irrigates:2200, yearBuilt:1985, lastInspect:'20/01/2026', issues:0 },
      { id:'CO-01', name:'Cống Liên Mạc', district:'Q. Bắc Từ Liêm', capacity:85.2, unit:'m³/s', typeLabel:'Cống tiêu', category:'sluice', status:'ok', manager:'Phạm Thị Ngọc', irrigates:0, yearBuilt:1978, lastInspect:'05/03/2026', issues:1 },
      { id:'CO-02', name:'Cống Cẩm Đình', district:'H. Phúc Thọ', capacity:42.5, unit:'m³/s', typeLabel:'Cống lấy nước', category:'sluice', status:'critical', manager:'Hoàng Văn Bình', irrigates:3800, yearBuilt:1970, lastInspect:'10/03/2026', issues:5 },
      { id:'CO-03', name:'Cống Hà Bình', district:'H. Thường Tín', capacity:28.6, unit:'m³/s', typeLabel:'Cống tiêu', category:'sluice', status:'ok', manager:'Nguyễn Thị Vân', irrigates:0, yearBuilt:1982, lastInspect:'14/02/2026', issues:0 },
    ];
    const byStatus = s => assets.filter(a => a.status === s).length;
    content.innerHTML = tab === 'invest' ? _renderInvestTab() : _renderAssetListTab(assets, byStatus);
  }
};

window.rerenderAssets = function() {
  // Deprecated: use switchAssetTab instead. Kept for backward compat.
  switchAssetTab(window._assetTab || 'list');
};


// ── ASSET LIST TAB ────────────────────────────────────────────────
function _renderAssetListTab(assets, byStatus) {
  return `
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">
    <div class="kpi-card" style="--accent-color:var(--cyan)">
      <div class="kpi-label">Tổng số công trình</div>
      <div class="kpi-value">${assets.length}</div>
      <div class="kpi-sub">${(window.RESERVOIR_DATA||[]).length} hồ chứa · ${assets.filter(a=>a.category==='pump').length} trạm bơm · ${assets.filter(a=>a.category==='sluice').length} cống</div>
    </div>
    <div class="kpi-card" style="--accent-color:var(--green)">
      <div class="kpi-label">Đang vận hành tốt</div>
      <div class="kpi-value">${byStatus('ok')}</div>
      <div class="kpi-sub">${Math.round(byStatus('ok')/assets.length*100)}% tổng số công trình</div>
    </div>
    <div class="kpi-card" style="--accent-color:var(--yellow)">
      <div class="kpi-label">Cần bảo trì / Cảnh báo</div>
      <div class="kpi-value">${byStatus('warning')}</div>
      <div class="kpi-sub">Theo dõi đặc biệt</div>
    </div>
    <div class="kpi-card" style="--accent-color:var(--red)">
      <div class="kpi-label">Xung yếu / Sự cố</div>
      <div class="kpi-value">${byStatus('critical')}</div>
      <div class="kpi-sub">Ưu tiên xử lý khẩn cấp</div>
    </div>
  </div>

  <div class="card" style="padding:0;overflow:hidden">
    <div style="padding:14px 16px;border-bottom:1px solid var(--border);display:flex;gap:12px;align-items:center">
      <div style="position:relative;flex:1">
        <input type="text" id="assetSearchInput" class="form-control" placeholder="Tìm kiếm công trình, địa bàn, người quản lý..." style="padding-left:36px" oninput="filterAssetTable(this.value)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2" style="position:absolute;left:12px;top:12px"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </div>
      <select class="form-control" style="width:160px" onchange="filterAssetByType(this.value)">
        <option value="">Tất cả loại hình</option>
        <option value="reservoir">Hồ chứa</option>
        <option value="pump">Trạm bơm</option>
        <option value="sluice">Cống thủy lợi</option>
      </select>
      <select class="form-control" style="width:160px" onchange="filterAssetByStatus(this.value)">
        <option value="">Tất cả trạng thái</option>
        <option value="ok">Bình thường</option>
        <option value="warning">Cảnh báo</option>
        <option value="critical">Sự cố</option>
      </select>
    </div>
    <div class="table-wrap">
      <table id="assetTable">
        <thead>
          <tr>
            <th>Mã CT</th>
            <th>Tên công trình</th>
            <th>Loại hình</th>
            <th>Địa bàn</th>
            <th>Công suất</th>
            <th>Người QL</th>
            <th>Kiểm tra cuối</th>
            <th>Sự cố</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="assetTableBody">
          ${assets.map(a => `
            <tr>
              <td><span class="mono" style="font-size:12px;color:var(--cyan)">${a.id}</span></td>
              <td><strong>${a.name}</strong></td>
              <td><span class="badge badge-gray" style="font-size:10px">${a.typeLabel}</span></td>
              <td style="font-size:12px">${a.district}</td>
              <td class="mono" style="font-size:13px">${a.capacity ? (a.category==='reservoir' ? (a.capacity/1000000).toFixed(1)+'M m³' : a.capacity.toFixed(1)+' m³/s') : '—'}</td>
              <td style="font-size:12px;color:var(--muted)">${a.manager || '—'}</td>
              <td style="font-size:12px;color:var(--muted)">${a.lastInspect || '—'}</td>
              <td style="text-align:center">
                ${(a.issues||0) > 0
                  ? `<span style="color:var(--red);font-weight:700">${a.issues}</span>`
                  : `<span style="color:var(--green)">0</span>`}
              </td>
              <td>${statusBadge(a.status)}</td>
              <td>
                <button class="btn btn-ghost btn-sm" onclick="viewAssetDetail('${a.id}')">Hồ sơ</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>`
  + (typeof renderRiskMatrix === 'function' ? renderRiskMatrix() : '');
}

// ── INVESTMENT TAB ────────────────────────────────────────────────
const INVEST_PROJECTS = [
  { id:'DA-2026-01', name:'Nâng cấp Hồ Tuy Lai — Đảm bảo an toàn chống lũ', type:'Hồ đập', district:'H. Mỹ Đức', budget:85.4, spent:32.1, progress:38, phase:'Thiết kế kỹ thuật', start:'01/2026', end:'12/2027', investor:'Sở NN&PTNT HN', status:'ontrack' },
  { id:'DA-2025-07', name:'Sửa chữa Cống Cẩm Đình — Khôi phục năng lực tưới', type:'Cống', district:'H. Phúc Thọ', budget:12.8, spent:12.1, progress:95, phase:'Hoàn thiện & Nghiệm thu', start:'06/2025', end:'03/2026', investor:'Chi cục Thủy lợi HN', status:'nearclose' },
  { id:'DA-2026-02', name:'Xây mới Trạm bơm Phú Xuyên 2 — Công suất 25m³/s', type:'Trạm bơm', district:'H. Phú Xuyên', budget:42.5, spent:8.5, progress:20, phase:'Khởi công', start:'02/2026', end:'06/2028', investor:'Sở NN&PTNT HN', status:'ontrack' },
  { id:'DA-2025-03', name:'Kiên cố hóa kênh dẫn N41 — Chương Mỹ', type:'Kênh mương', district:'H. Chương Mỹ', budget:18.6, spent:18.6, progress:100, phase:'Đã hoàn thành', start:'01/2025', end:'11/2025', investor:'UBND H. Chương Mỹ', status:'done' },
  { id:'DA-2026-03', name:'Mở rộng hồ chứa Quan Sơn — Tăng dung tích 30%', type:'Hồ đập', district:'H. Mỹ Đức', budget:155.0, spent:0, progress:0, phase:'Chuẩn bị đầu tư', start:'06/2026', end:'12/2029', investor:'Bộ NN&PTNT', status:'pending' },
  { id:'DA-2025-11', name:'Tự động hóa vận hành 8 cống đầu mối', type:'Tự động hóa', district:'Toàn TP', budget:22.3, spent:14.5, progress:65, phase:'Lắp đặt thiết bị', start:'09/2025', end:'08/2026', investor:'Chi cục Thủy lợi HN', status:'delayed' },
];

function _renderInvestTab() {
  const totalBudget = INVEST_PROJECTS.reduce((s,p)=>s+p.budget,0);
  const totalSpent  = INVEST_PROJECTS.reduce((s,p)=>s+p.spent,0);
  const done   = INVEST_PROJECTS.filter(p=>p.status==='done').length;
  const active = INVEST_PROJECTS.filter(p=>['ontrack','delayed','nearclose'].includes(p.status)).length;
  const statusCfg = {
    ontrack:   { label:'Đúng tiến độ', color:'#10b981', bg:'rgba(16,185,129,.1)' },
    nearclose: { label:'Sắp hoàn thành', color:'#38bdf8', bg:'rgba(56,189,248,.1)' },
    done:      { label:'Đã hoàn thành', color:'#6b7280', bg:'rgba(107,114,128,.1)' },
    delayed:   { label:'Chậm tiến độ', color:'#ef4444', bg:'rgba(239,68,68,.1)' },
    pending:   { label:'Chuẩn bị', color:'#a855f7', bg:'rgba(168,85,247,.1)' },
  };
  return `
  <!-- KPI row -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px">
    ${[
      [`${INVEST_PROJECTS.length}`, 'Tổng dự án', '#38bdf8'],
      [`${active}`, 'Đang triển khai', '#f59e0b'],
      [`${done}`, 'Đã hoàn thành', '#10b981'],
      [`${totalBudget.toFixed(1)} tỷ`, 'Tổng vốn đầu tư', '#a855f7'],
    ].map(([v,l,c])=>`<div class="rsv-kpi"><div class="rsv-kpi-val" style="color:${c}">${v}</div><div class="rsv-kpi-lbl">${l}</div></div>`).join('')}
  </div>
  <!-- Budget used bar -->
  <div class="card" style="padding:12px 16px;margin-bottom:14px">
    <div style="display:flex;justify-content:space-between;margin-bottom:6px">
      <span style="font-size:12px;font-weight:600">Tổng vốn đã giải ngân</span>
      <span style="font-size:12px;font-weight:800;color:#38bdf8">${totalSpent.toFixed(1)} / ${totalBudget.toFixed(1)} tỷ đồng (${Math.round(totalSpent/totalBudget*100)}%)</span>
    </div>
    <div style="height:8px;background:rgba(255,255,255,.08);border-radius:4px;overflow:hidden">
      <div style="height:100%;width:${Math.round(totalSpent/totalBudget*100)}%;background:linear-gradient(90deg,#38bdf8,#818cf8);border-radius:4px"></div>
    </div>
  </div>
  <!-- Project list -->
  <div style="display:flex;flex-direction:column;gap:10px">
    ${INVEST_PROJECTS.map(p=>{
      const cfg = statusCfg[p.status]||statusCfg.pending;
      return `
      <div class="card" style="padding:14px 16px;border-left:3px solid ${cfg.color}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span class="mono" style="font-size:11px;color:var(--cyan)">${p.id}</span>
              <span class="badge badge-gray" style="font-size:10px">${p.type}</span>
              <span style="padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;background:${cfg.bg};color:${cfg.color}">${cfg.label}</span>
            </div>
            <div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:3px">${p.name}</div>
            <div style="font-size:11px;color:rgba(255,255,255,.4)">${p.district} · ${p.investor} · ${p.start} → ${p.end}</div>
          </div>
          <div style="text-align:right;flex-shrink:0;margin-left:14px">
            <div style="font-size:18px;font-weight:800;color:${cfg.color}">${p.progress}%</div>
            <div style="font-size:10px;color:rgba(255,255,255,.4)">Tiến độ</div>
          </div>
        </div>
        <div style="display:flex;gap:14px;align-items:center">
          <div style="flex:1">
            <div style="font-size:10px;color:rgba(255,255,255,.4);margin-bottom:4px">Giai đoạn: <strong style="color:rgba(255,255,255,.7)">${p.phase}</strong></div>
            <div style="height:6px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden">
              <div style="height:100%;width:${p.progress}%;background:${cfg.color};border-radius:3px;transition:width .3s"></div>
            </div>
          </div>
          <div style="font-size:11px;color:rgba(255,255,255,.5);white-space:nowrap">${p.spent.toFixed(1)} / ${p.budget.toFixed(1)} tỷ</div>
          <button class="btn btn-ghost btn-sm" onclick="showToast('Mở hồ sơ dự án ${p.id}...')">Chi tiết</button>
        </div>
      </div>`; }).join('')}
  </div>
  <div style="text-align:center;margin-top:14px">
    <button class="btn btn-primary btn-sm" onclick="openAddInvestModal()">+ Thêm dự án đầu tư</button>
  </div>`;
}

window.openAddInvestModal = function() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Thêm Dự án Đầu tư CTTL</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-group"><label class="form-label">Tên dự án</label><input class="form-control" placeholder="Tên đầy đủ của dự án đầu tư"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Loại công trình</label>
        <select class="form-control"><option>Hồ đập</option><option>Trạm bơm</option><option>Cống</option><option>Kênh mương</option><option>Tự động hóa</option></select>
      </div>
      <div class="form-group"><label class="form-label">Địa bàn</label><input class="form-control" placeholder="VD: H. Đan Phượng"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Tổng mức đầu tư (tỷ đồng)</label><input class="form-control" type="number" step="0.1"></div>
      <div class="form-group"><label class="form-label">Chủ đầu tư</label><input class="form-control" placeholder="VD: Chi cục Thủy lợi HN"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Ngày khởi công</label><input class="form-control" type="month"></div>
      <div class="form-group"><label class="form-label">Ngày hoàn thành dự kiến</label><input class="form-control" type="month"></div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('✅ Đã thêm dự án đầu tư!')">Lưu dự án</button>
  </div>`, {width:'620px'});
};

// ── ASSET DETAIL MODAL ─────────────────────────────────────────────
window.viewAssetDetail = function(id) {
  // Build combined asset list
  const assets = [
    ...(window.RESERVOIR_DATA || []).map(r => ({ ...r, category: 'reservoir', typeLabel: 'Hồ chứa', unit: 'm³' })),
    { id: 'TB-01', name: 'Trạm bơm tiêu Cổ Nhuế', district: 'H. Bắc Từ Liêm', capacity: 16.5, unit: 'm³/s', typeLabel: 'Trạm bơm', category: 'pump', status: 'ok', manager: 'Lê Hùng Cường', irrigates: 850, yearBuilt: 1989, lastInspect: '08/02/2026', issues: 1, area: 0, inflowQ: 0, outflowQ: 16.5 },
    { id: 'TB-02', name: 'Trạm bơm tưới Đan Hoài', district: 'H. Đan Phượng', capacity: 12.0, unit: 'm³/s', typeLabel: 'Trạm bơm', category: 'pump', status: 'warning', manager: 'Đỗ Mạnh Tuân', irrigates: 420, yearBuilt: 1995, lastInspect: '12/02/2026', issues: 2, area: 0, inflowQ: 0, outflowQ: 12.0 },
    { id: 'TB-03', name: 'Trạm bơm tiêu Yên Sở', district: 'Q. Hoàng Mai', capacity: 45.0, unit: 'm³/s', typeLabel: 'Trạm bơm', category: 'pump', status: 'ok', manager: 'Lý Thị Thảo', irrigates: 2200, yearBuilt: 1985, lastInspect: '20/01/2026', issues: 0, area: 0, inflowQ: 0, outflowQ: 45.0 },
    { id: 'CO-01', name: 'Cống Liên Mạc', district: 'Q. Bắc Từ Liêm', capacity: 85.2, unit: 'm³/s', typeLabel: 'Cống tiêu', category: 'sluice', status: 'ok', manager: 'Phạm Thị Ngọc', irrigates: 0, yearBuilt: 1978, lastInspect: '05/03/2026', issues: 1, area: 0, inflowQ: 85.2, outflowQ: 85.2 },
    { id: 'CO-02', name: 'Cống Cẩm Đình', district: 'H. Phúc Thọ', capacity: 42.5, unit: 'm³/s', typeLabel: 'Cống lấy nước', category: 'sluice', status: 'critical', manager: 'Hoàng Văn Bình', irrigates: 3800, yearBuilt: 1970, lastInspect: '10/03/2026', issues: 5, area: 0, inflowQ: 42.5, outflowQ: 38.0 },
    { id: 'CO-03', name: 'Cống Hà Bình', district: 'H. Thường Tín', capacity: 28.6, unit: 'm³/s', typeLabel: 'Cống tiêu', category: 'sluice', status: 'ok', manager: 'Nguyễn Thị Vân', irrigates: 0, yearBuilt: 1982, lastInspect: '14/02/2026', issues: 0, area: 0, inflowQ: 28.6, outflowQ: 28.6 },
  ];
  const a = assets.find(x => x.id === id);
  if (!a) return;

  const statusLabel = { ok: 'Bình thường', warning: 'Cảnh báo', critical: 'Xung yếu / Sự cố', offline: 'Ngừng hoạt động' }[a.status] || a.status;
  const statusColor = { ok: 'var(--green)', warning: 'var(--yellow)', critical: 'var(--red)', offline: 'var(--muted)' }[a.status] || 'var(--muted)';

  openModal(`
  <div class="modal-header">
    <span class="modal-title">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
      Hồ sơ Công trình: ${a.name}
    </span>
    <button class="modal-close" onclick="closeModal()">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
  <div class="modal-body" style="max-height:78vh;overflow-y:auto">

    <!-- Status Banner -->
    <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:10px;margin-bottom:18px">
      <div style="width:10px;height:10px;border-radius:50%;background:${statusColor};box-shadow:0 0 6px ${statusColor}"></div>
      <span style="font-size:13px;font-weight:600;color:${statusColor}">${statusLabel}</span>
      <span class="badge badge-gray" style="margin-left:auto;font-size:11px">${a.typeLabel}</span>
      <span class="mono" style="font-size:12px;color:var(--muted)">${a.id}</span>
    </div>

    <!-- Info Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px">
      ${[
        { label: 'Địa bàn quản lý', val: a.district },
        { label: 'Người quản lý', val: a.manager || 'Chi cục' },
        { label: 'Năm xây dựng', val: a.yearBuilt || '—' },
        { label: 'Kiểm tra cuối', val: a.lastInspect || '—' },
        { label: 'Công suất / Dung tích', val: a.capacity ? (a.category==='reservoir' ? (a.capacity/1000000).toFixed(1)+' triệu m³' : a.capacity+' m³/s') : '—' },
        { label: 'Diện tích tưới/tiêu', val: a.irrigates ? `${a.irrigates.toLocaleString()} ha` : '—' },
        { label: 'Lưu lượng vào', val: a.inflowQ ? `${a.inflowQ} m³/s` : '—' },
        { label: 'Lưu lượng ra', val: a.outflowQ ? `${a.outflowQ} m³/s` : '—' },
      ].map(f => `
      <div style="padding:12px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px">
        <div style="font-size:11px;color:var(--muted);margin-bottom:4px">${f.label}</div>
        <div style="font-size:14px;font-weight:600">${f.val}</div>
      </div>`).join('')}
    </div>

    <!-- Sự cố đang mở -->
    ${(a.issues||0) > 0 ? `
    <div style="padding:12px 14px;background:rgba(255,23,68,.06);border:1px solid rgba(255,23,68,.2);border-radius:10px;margin-bottom:16px">
      <div style="font-size:12px;font-weight:700;color:var(--red);margin-bottom:8px">⚠ ${a.issues} sự cố đang theo dõi</div>
      <div style="font-size:12px;color:var(--muted)">Tham chiếu trang <strong>Sự cố &amp; Báo cáo</strong> để xem chi tiết và cập nhật trạng thái xử lý.</div>
    </div>` : ''}

    <!-- Ghi chú kỹ thuật -->
    <div style="padding:14px;background:rgba(0,200,255,.04);border:1px solid rgba(0,200,255,.12);border-radius:10px">
      <div style="font-size:12px;font-weight:700;color:var(--cyan);margin-bottom:8px">Ghi chú kỹ thuật</div>
      <div style="font-size:12px;color:var(--muted);line-height:1.7">
        ${a.category === 'reservoir'
          ? `Hồ chứa nội địa. Tổng dung tích: ${(a.capacity/1000000).toFixed(1)} triệu m³. Mực nước thiết kế: ${a.designLevel || '—'} m. Mực nước chết: ${a.deadLevel || '—'} m.`
          : a.category === 'pump'
          ? `Trạm bơm điện ${a.capacity} m³/s. Hệ thống vận hành 24/7 mùa lũ. Bảo dưỡng định kỳ hàng quý.`
          : `Cống điều tiết nước. Công suất thiết kế ${a.capacity} m³/s. Vận hành theo quyết định của Chi cục trưởng.`}
      </div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-ghost btn-sm" onclick="closeModal();showToast('Đang tải hồ sơ PDF...')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Tải hồ sơ PDF
    </button>
    <button class="btn btn-primary" onclick="closeModal();showToast('Đang tạo lệnh kiểm tra công trình ${a.name}...')">Lệnh kiểm tra</button>
  </div>`);
};

// ── ADD ASSET MODAL ────────────────────────────────────────────────
window.openAddAssetModal = function() {
  openModal(`
  <div class="modal-header">
    <span class="modal-title">Thêm công trình thủy lợi mới</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body">
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Tên công trình</label>
        <input class="form-control" placeholder="VD: Trạm bơm tiêu Liên Mạc 2">
      </div>
      <div class="form-group">
        <label class="form-label">Loại hình</label>
        <select class="form-control">
          <option>Hồ chứa</option>
          <option>Trạm bơm tưới</option>
          <option>Trạm bơm tiêu</option>
          <option>Cống lấy nước</option>
          <option>Cống tiêu</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Địa bàn (Quận/Huyện)</label>
        <input class="form-control" placeholder="VD: H. Đan Phượng">
      </div>
      <div class="form-group">
        <label class="form-label">Công suất / Dung tích</label>
        <input class="form-control" type="number" placeholder="VD: 12.5">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Năm xây dựng</label>
        <input class="form-control" type="number" placeholder="VD: 1995">
      </div>
      <div class="form-group">
        <label class="form-label">Người quản lý</label>
        <input class="form-control" placeholder="Họ tên người quản lý">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Ghi chú kỹ thuật</label>
      <textarea class="form-control" rows="3" placeholder="Mô tả kỹ thuật, hiện trạng..."></textarea>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('✅ Đã thêm công trình mới vào hệ thống!')">Lưu công trình</button>
  </div>`);
};

// ── TABLE FILTER ───────────────────────────────────────────────────
window.filterAssetTable = function(q) {
  document.querySelectorAll('#assetTableBody tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none';
  });
};
window.filterAssetByType = function(type) {
  document.querySelectorAll('#assetTableBody tr').forEach(row => {
    if (!type) { row.style.display = ''; return; }
    const typeCell = row.cells[2]?.textContent || '';
    const map = { reservoir: 'Hồ chứa', pump: 'Trạm bơm', sluice: 'Cống' };
    row.style.display = typeCell.includes(map[type]||type) ? '' : 'none';
  });
};
window.filterAssetByStatus = function(status) {
  document.querySelectorAll('#assetTableBody tr').forEach(row => {
    if (!status) { row.style.display = ''; return; }
    const statusCell = row.cells[8]?.textContent || '';
    row.style.display = statusCell.toLowerCase().includes(status) ? '' : 'none';
  });
};

// ── MA TRẬN RỦI RO ─────────────────────────────────────────────────
const RISK_MATRIX_DATA = [
  { area:'Đê Hữu Hồng — Km 28–36', type:'Đê điều', prob:4, impact:5, issues:['Thấm lũy kế cao','Mái đê xuống cấp','3 điểm sụt trượt'], lastInsp:'10/03/2026' },
  { area:'Đê Hữu Đáy — Km 12–18', type:'Đê điều', prob:4, impact:4, issues:['Vết nứt dọc 3m tại Km 14+200','Vi phạm hành lang'], lastInsp:'13/03/2026' },
  { area:'Hồ chứa Đồng Mô', type:'Hồ đập', prob:2, impact:5, issues:['Tràn thiếu cửa van chủ động','Bùn lắng thượng lưu'], lastInsp:'05/03/2026' },
  { area:'Cống Liên Mạc', type:'Công trình cống', prob:3, impact:4, issues:['Mái cánh đồng thượng lưu nứt','Cơ đê bị xói'], lastInsp:'08/03/2026' },
  { area:'Kênh N41 — Chương Mỹ', type:'Kênh mương', prob:3, impact:3, issues:['Sụt lún bờ kênh 8m','Thoát nước chậm'], lastInsp:'12/03/2026' },
  { area:'Hệ thống bơm Phù Sa', type:'Trạm bơm', prob:2, impact:3, issues:['Máy bơm 2/4 hỏng','Thiếu điện dự phòng'], lastInsp:'11/03/2026' },
  { area:'Đê Tả Hồng — Km 40–50', type:'Đê điều', prob:2, impact:5, issues:['Quy mô lớn','Cần theo dõi cẩn thận'], lastInsp:'09/03/2026' },
  { area:'Cống Yên Sở', type:'Công trình cống', prob:1, impact:4, issues:['Tình trạng tốt','Định kỳ bảo trì'], lastInsp:'13/03/2026' },
];

function riskScore(p, i) { return p * i; }
function riskLabel(s) {
  if (s >= 16) return { label:'Rất cao', color:'#dc2626', bg:'rgba(220,38,38,.12)' };
  if (s >= 12) return { label:'Cao', color:'#ea580c', bg:'rgba(234,88,12,.1)' };
  if (s >=  6) return { label:'Trung bình', color:'#ca8a04', bg:'rgba(202,138,4,.1)' };
  return         { label:'Thấp', color:'#16a34a', bg:'rgba(22,163,74,.1)' };
}

function renderRiskMatrix() {
  const sorted = [...RISK_MATRIX_DATA].sort((a,b) => riskScore(b.prob,b.impact) - riskScore(a.prob,a.impact));
  const cells5x5 = Array.from({length:5},(_,pi)=>Array.from({length:5},(_,ii)=>{
    const p=5-pi, i=ii+1;
    const matches = RISK_MATRIX_DATA.filter(r=>r.prob===p&&r.impact===i);
    const s=p*i;
    const {color,bg} = riskLabel(s);
    return `<div style="position:relative;min-height:56px;border-radius:6px;background:${bg};border:1px solid ${color}22;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:4px">
      <div style="font-size:9px;color:${color};font-weight:700;opacity:.5">${s}</div>
      ${matches.map(m=>`<div title="${m.area}" style="width:22px;height:22px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;color:white;cursor:pointer" onclick="showToast('${m.area.substring(0,30)}...')">${m.area.charAt(0)}</div>`).join('')}
    </div>`;
  }).join('')).join('');

  return `
  <div class="card" style="padding:0;margin-top:18px">
    <div class="card-header" style="align-items:center">
      <span class="card-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        Ma trận rủi ro theo khu vực / công trình
      </span>
      <div style="display:flex;gap:8px;align-items:center">
        ${[['Rất cao','#dc2626'],['Cao','#ea580c'],['Trung bình','#ca8a04'],['Thấp','#16a34a']].map(([l,c])=>`
        <div style="display:flex;align-items:center;gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:${c}"></div><span style="font-size:10px;color:var(--muted)">${l}</span></div>`).join('')}
      </div>
    </div>
    <div style="padding:16px;display:grid;grid-template-columns:minmax(280px,1fr) auto;gap:20px;align-items:start">

      <!-- Ranked list -->
      <div>
        <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Xếp hạng theo mức độ rủi ro</div>
        <div style="display:flex;flex-direction:column;gap:7px">
          ${sorted.map((r,i)=>{
            const s=riskScore(r.prob,r.impact);
            const {label,color,bg}=riskLabel(s);
            return `
            <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:9px;background:${bg};border:1px solid ${color}22">
              <div style="width:22px;text-align:center;font-size:12px;font-weight:700;color:${i<2?color:'var(--muted)'}">#${i+1}</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:12px;font-weight:600;display:flex;align-items:center;gap:7px">
                  ${r.area}
                  <span class="badge badge-gray" style="font-size:9px">${r.type}</span>
                </div>
                <div style="font-size:10px;color:var(--muted);margin-top:2px">${r.issues.slice(0,2).join(' · ')}${r.issues.length>2?' · +'+( r.issues.length-2):''}</div>
              </div>
              <div style="text-align:center;flex-shrink:0">
                <div style="font-size:16px;font-weight:800;color:${color}">${s}</div>
                <div style="font-size:9px;padding:2px 6px;border-radius:4px;background:${color}22;color:${color};font-weight:600">${label}</div>
              </div>
              <div style="text-align:right;font-size:10px;color:var(--muted)">
                <div>P:${r.prob} × I:${r.impact}</div>
                <div style="margin-top:2px">Kiểm tra: ${r.lastInsp}</div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- 5×5 matrix grid -->
      <div style="flex-shrink:0;min-width:260px">
        <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:8px;text-align:center">Ma trận 5×5 (P × I)</div>
        <div style="display:flex;gap:4px;margin-bottom:4px;padding-left:24px">
          ${[1,2,3,4,5].map(i=>`<div style="flex:1;text-align:center;font-size:10px;color:var(--muted)">I${i}</div>`).join('')}
        </div>
        ${Array.from({length:5},(_,pi)=>`
        <div style="display:flex;gap:4px;margin-bottom:4px">
          <div style="width:18px;font-size:9px;color:var(--muted);display:flex;align-items:center;justify-content:center">P${5-pi}</div>
          ${Array.from({length:5},(_,ii)=>{
            const p=5-pi, i=ii+1, s=p*i;
            const {color,bg}=riskLabel(s);
            const matches=RISK_MATRIX_DATA.filter(r=>r.prob===p&&r.impact===i);
            return `<div title="${matches.map(m=>m.area).join(', ')||'Không có'}" style="flex:1;aspect-ratio:1;border-radius:5px;background:${bg};border:1px solid ${color}33;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:2px;padding:2px">
              ${matches.map(m=>`<div style="width:14px;height:14px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;color:white;cursor:pointer" title="${m.area}">${m.area.charAt(0)}</div>`).join('')}
              ${matches.length===0?`<div style="font-size:9px;color:${color}55">${s}</div>`:''}
            </div>`;
          }).join('')}
        </div>`).join('')}
        <div style="font-size:9px;color:var(--muted);text-align:center;margin-top:4px">P = Xác suất (1-5) · I = Tác động (1-5)</div>
      </div>
    </div>
  </div>`;
}
