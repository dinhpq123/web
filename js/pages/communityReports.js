// ── COMMUNITY REPORTS — Phản ánh từ App Cộng đồng ────────────────
let crTab = 'pending';

const CR_TYPES = {
  flooding:          { label: 'Ngập đường / ngõ',                   color: 'var(--info)', badge: 'badge-blue'   },
  landslide:         { label: 'Sạt lở đất',                         color: '#d97706', badge: 'badge-orange' },
  tree_fall:         { label: 'Cây đổ nguy hiểm',                   color: 'var(--success)', badge: 'badge-green'  },
  dike_risk:         { label: 'Đê có dấu hiệu nguy hiểm',           color: '#dc2626', badge: 'badge-red'    },
  drain_blocked:     { label: 'Cống thoát nước bị tắc',             color: 'var(--purple)', badge: 'badge-purple' },
  infra_damage:      { label: 'Công trình bị hư hại',               color: '#f59e0b', badge: 'badge-yellow' },
  vi_pham_hanh_lang: { label: 'Vi phạm hành lang đê / PCTT',        color: '#c2410c', badge: 'badge-red'    },
  other:             { label: 'Sự cố khác',                         color: '#64748b', badge: 'badge-gray'   },
};

// Simulated image URLs per report (placeholder gradient tiles)
const CR_IMAGES = {
  'RP-240312-001': ['https://picsum.photos/seed/de1/800/600','https://picsum.photos/seed/de2/800/600','https://picsum.photos/seed/de3/800/600'],
  'RP-240312-002': ['https://picsum.photos/seed/flood1/800/600','https://picsum.photos/seed/flood2/800/600'],
  'RP-240312-003': ['https://picsum.photos/seed/land1/800/600','https://picsum.photos/seed/land2/800/600','https://picsum.photos/seed/land3/800/600','https://picsum.photos/seed/land4/800/600','https://picsum.photos/seed/land5/800/600'],
  'RP-240312-004': ['https://picsum.photos/seed/drain1/800/600'],
  'RP-240312-005': ['https://picsum.photos/seed/vp1/800/600','https://picsum.photos/seed/vp2/800/600','https://picsum.photos/seed/vp3/800/600','https://picsum.photos/seed/vp4/800/600'],
  'RP-240312-006': ['https://picsum.photos/seed/tree1/800/600','https://picsum.photos/seed/tree2/800/600'],
  'RP-240312-007': ['https://picsum.photos/seed/kl1/800/600','https://picsum.photos/seed/kl2/800/600','https://picsum.photos/seed/kl3/800/600'],
};

const CR_REPORTS = [
  { id: 'RP-240312-001', type: 'dike_risk',          citizen: 'Nguyễn Thị Lan',   phone: '0912 345 678', district: 'Ba Vì',     address: 'Đê Hữu Đáy, đoạn Km 14+200 xã Tản Đà',    desc: 'Thân đê có vết nứt dọc dài khoảng 3m, rộng 2cm. Nước thấm ứa ra phía đồng. Rất nguy hiểm!',                                                                      time: '13/03/2026 07:22', status: 'pending',    priority: 'high',     images: 3, assignee: null,    note: '' },
  { id: 'RP-240312-002', type: 'flooding',            citizen: 'Trần Văn Bình',    phone: '0978 234 567', district: 'Chương Mỹ', address: 'Đường Cầu Am, thị trấn Chúc Sơn',           desc: 'Đường ngập sâu khoảng 40cm từ đêm qua. Học sinh không đến trường được, phương tiện tắc nghẽn.',                                                                     time: '13/03/2026 06:05', status: 'processing', priority: 'high',     images: 2, assignee: 'NV004', note: 'Đã cử đội ƯCSC kiểm tra, đang lắp bơm tiêu.' },
  { id: 'RP-240312-003', type: 'landslide',           citizen: 'Phạm Quang Hùng',  phone: '0965 111 222', district: 'Ba Vì',     address: 'Sườn núi Ba Vì, gần khu dân cư Tản Lĩnh',  desc: 'Mái taluy bên đường vào thôn bị sạt mạnh sau đêm mưa, đất đá đổ xuống chắn ngang đường, ô tô không qua được.',                                                    time: '13/03/2026 05:50', status: 'processing', priority: 'critical', images: 5, assignee: 'NV005', note: 'Phối hợp UBND huyện, đang thi công khơi thông.' },
  { id: 'RP-240312-004', type: 'drain_blocked',       citizen: 'Lê Thị Mai',       phone: '0988 321 111', district: 'Hoàng Mai', address: 'Ngõ 72, Trần Điền, phường Định Công',       desc: 'Cống rãnh cuối ngõ bị tắc. Nước ứ đọng từ hôm qua. Bùn nặng mùi, muỗi nhiều.',                                                                                      time: '12/03/2026 16:40', status: 'pending',    priority: 'medium',   images: 1, assignee: null,    note: '' },
  { id: 'RP-240312-005', type: 'vi_pham_hanh_lang',  citizen: 'Võ Đức Thành',     phone: '0901 444 555', district: 'Đông Anh',  address: 'Đê Hữu Hồng, Km 32+500, xã Xuân Canh',    desc: 'Có đơn vị đổ đất san lấp, xây dựng công trình sát chân đê. Xe tải ra vào suốt ngày, không thấy biển phép.',                                                       time: '12/03/2026 14:15', status: 'pending',    priority: 'high',     images: 4, assignee: null,    note: '' },
  { id: 'RP-240312-006', type: 'tree_fall',           citizen: 'Hoàng Thị Oanh',   phone: '0934 567 890', district: 'Sóc Sơn',  address: 'Đường Vân Xuân, xã Bắc Phú',               desc: 'Cây cổ thụ bị bật gốc sau mưa lớn, đổ chắn ngang 2/3 lòng đường, có dây điện vương vào tán cây.',                                                                 time: '12/03/2026 20:05', status: 'resolved',   priority: 'high',     images: 2, assignee: 'NV006', note: 'Đã phối hợp QLGT và Điện lực xử lý xong 23h 12/3.' },
  { id: 'RP-240312-007', type: 'infra_damage',        citizen: 'Nguyễn Minh Tuấn', phone: '0945 678 901', district: 'Ứng Hòa',  address: 'Kênh tưới trục chính Bắc, xã Hồng Quang',  desc: 'Bờ kênh bị sụt trồi dài khoảng 8m. Nước kênh đang tràn ra ruộng lúa đang giai đoạn đẻ nhánh.',                                                                     time: '12/03/2026 08:50', status: 'processing', priority: 'medium',   images: 3, assignee: 'NV007', note: 'Phòng TL đã cử người xuống khảo sát, lên phương án sửa chữa.' },
  { id: 'RP-240311-008', type: 'flooding',            citizen: 'Bùi Thanh Hà',     phone: '0966 777 888', district: 'Mê Linh',  address: 'Ngã tư Văn Khê, TT Quang Minh',            desc: 'Thoát nước không kịp sau cơn mưa chiều, ngập khoảng 20cm tại ngã tư, kéo dài khoảng 2 tiếng.',                                                                     time: '11/03/2026 17:30', status: 'resolved',   priority: 'low',      images: 0, assignee: 'NV004', note: 'Đã thông cống, nước rút sau 2 giờ.' },
];

function renderCommunityReports() {
  const tabs = [
    { id: 'pending',    label: 'Chờ xử lý',    count: CR_REPORTS.filter(r => r.status === 'pending').length },
    { id: 'processing', label: 'Đang xử lý',   count: CR_REPORTS.filter(r => r.status === 'processing').length },
    { id: 'resolved',   label: 'Hoàn thành',   count: CR_REPORTS.filter(r => r.status === 'resolved').length },
    { id: 'all',        label: 'Tất cả',        count: CR_REPORTS.length },
    { id: 'analytics',  label: 'Phân tích AI',  count: null },
  ];

  if (crTab === 'analytics') {
    // Analytics tab renders its own section below
  }
  const filtered = (crTab === 'all' || crTab === 'analytics') ? CR_REPORTS : CR_REPORTS.filter(r => r.status === crTab);

  const priorityBadge = p => ({
    critical: '<span class="badge badge-red"    style="font-size:9px">KHẨN</span>',
    high:     '<span class="badge badge-orange" style="font-size:9px">CAO</span>',
    medium:   '<span class="badge badge-yellow" style="font-size:9px">TB</span>',
    low:      '<span class="badge badge-gray"   style="font-size:9px">THẤP</span>',
  }[p] || '');

  const statusBadge = s => ({
    pending:    '<span class="badge badge-yellow" style="font-size:9px">Chờ xử lý</span>',
    processing: '<span class="badge badge-blue"   style="font-size:9px">Đang xử lý</span>',
    resolved:   '<span class="badge badge-green"  style="font-size:9px">Hoàn thành</span>',
  }[s] || '');

  const pending  = CR_REPORTS.filter(r => r.status === 'pending').length;
  const proc     = CR_REPORTS.filter(r => r.status === 'processing').length;
  const resolved = CR_REPORTS.filter(r => r.status === 'resolved').length;
  const critical = CR_REPORTS.filter(r => r.priority === 'critical').length;

  const byType = Object.entries(CR_TYPES).map(([id, t]) => ({
    id, ...t, count: CR_REPORTS.filter(r => r.type === id).length,
  })).filter(x => x.count > 0).sort((a, b) => b.count - a.count);

  return `
  <div class="page-header">
    <div class="page-title">
      <h1>Phản ánh Cộng đồng</h1>
      <p>Tiếp nhận và xử lý các báo cáo sự cố từ App Hadiwa Cộng đồng</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-ghost" onclick="exportCrReport()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Xuất Excel
      </button>
      <button class="btn btn-outline" onclick="openNotifyTargetModal({title:'Thông báo kết quả xử lý phản ánh'})">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Gửi thông báo
      </button>
    </div>
  </div>

  <!-- KPI Row -->
  <div class="grid-auto" style="margin-bottom:16px">
    <div class="card kpi-card" style="border-top:2px solid var(--warning)">
      <div class="kpi-label">Chờ xử lý</div>
      <div class="kpi-value" style="color:var(--warning)">${pending}</div>
      <div class="kpi-sub">Cần phân công</div>
    </div>
    <div class="card kpi-card" style="border-top:2px solid var(--info)">
      <div class="kpi-label">Đang xử lý</div>
      <div class="kpi-value" style="color:var(--info)">${proc}</div>
      <div class="kpi-sub">Đã phân công</div>
    </div>
    <div class="card kpi-card" style="border-top:2px solid var(--danger)">
      <div class="kpi-label">Khẩn cấp</div>
      <div class="kpi-value" style="color:var(--danger)">${critical}</div>
      <div class="kpi-sub">Ưu tiên cao nhất</div>
    </div>
    <div class="card kpi-card" style="border-top:2px solid var(--success)">
      <div class="kpi-label">Hoàn thành</div>
      <div class="kpi-value" style="color:var(--success)">${resolved}</div>
      <div class="kpi-sub">Trong 7 ngày</div>
    </div>
  </div>

  <!-- Main layout: narrow left sidebar + fluid right -->
  <div style="display:grid;grid-template-columns:220px minmax(0,1fr);gap:14px;align-items:start">

    <!-- Left sidebar: category + source breakdown -->
    <div class="card" style="padding:14px;flex-shrink:0">
      <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Theo loại sự cố</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${byType.map(t => `
        <div style="display:flex;align-items:center;gap:7px;cursor:pointer;padding:5px 7px;border-radius:6px;transition:.15s" onmouseover="this.style.background='rgba(255,255,255,.04)'" onmouseout="this.style.background=''" onclick="crFilterType('${t.id}')">
          <div style="width:7px;height:7px;border-radius:50%;background:${t.color};flex-shrink:0"></div>
          <div style="flex:1;font-size:11px;line-height:1.3">${t.label}</div>
          <span class="badge ${t.badge}" style="font-size:9px">${t.count}</span>
        </div>`).join('')}
      </div>
      <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border)">
        <div style="font-size:11px;color:var(--muted);margin-bottom:7px">Nguồn tiếp nhận</div>
        ${[
          { ch: 'App Hadiwa', val: CR_REPORTS.length, color: 'var(--primary)' },
          { ch: 'Đường dây 1800', val: 3,             color: 'var(--success)' },
          { ch: 'Zalo OA',    val: 1,                 color: '#0068ff' },
        ].map(c => `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">
          <span style="font-size:11px;color:var(--muted)">${c.ch}</span>
          <strong style="font-size:12px;color:${c.color}">${c.val}</strong>
        </div>`).join('')}
      </div>
    </div>

    <!-- Right: tab bar + table (fluid, scrollable internally) -->
    <div style="min-width:0">
      <!-- Tabs + search -->
      <div class="tabs" style="margin-bottom:12px">
        ${tabs.map(t => `
        <button class="tab-btn ${crTab === t.id ? 'active' : ''}" onclick="switchCrTab('${t.id}')">
          ${t.label}
          ${t.count > 0 ? `<span style="margin-left:5px;padding:1px 6px;border-radius:9px;font-size:9px;font-weight:700;background:${crTab===t.id?'rgba(255,255,255,.22)':'rgba(255,255,255,.07)'}">${t.count}</span>` : ''}
        </button>`).join('')}
        <div style="margin-left:auto">
          <input type="text" class="form-control form-control-sm" placeholder="Tìm kiếm..." style="width:150px" oninput="filterCrTable(this.value)">
        </div>
      </div>

      <!-- Table — scrolls horizontally inside the card if needed, or Analytics panel -->
      ${crTab === 'analytics'
        ? renderCrAnalytics()
        : `<div class="card" style="padding:0;overflow:hidden">
        <div class="table-wrap" style="overflow-x:auto">
          <table id="crTable" style="min-width:640px">
            <thead>
              <tr>
                <th style="width:90px">Mã</th>
                <th>Loại sự cố</th>
                <th style="width:54px">Độ ưu tiên</th>
                <th>Địa điểm</th>
                <th>Người báo</th>
                <th style="width:90px">Thời gian</th>
                <th style="width:100px">Trạng thái</th>
                <th style="width:110px">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(r => {
                const t = CR_TYPES[r.type] || { label: r.type, badge: 'badge-gray', color: 'var(--muted)' };
                const assigneeName = r.assignee ? (DATA.employees.find(e => e.id === r.assignee)?.name?.split(' ').pop() || r.assignee) : '';
                return `<tr style="cursor:pointer" onclick="viewCrReport('${r.id}')">
                  <td class="mono" style="font-size:10px;color:var(--muted)">${r.id.replace('RP-240312-','#').replace('RP-240311-','#')}</td>
                  <td><span class="badge ${t.badge}" style="font-size:9px;white-space:nowrap">${t.label}</span></td>
                  <td style="text-align:center">${priorityBadge(r.priority)}</td>
                  <td style="max-width:160px">
                    <div style="font-size:12px;font-weight:500">${r.district}</div>
                    <div style="font-size:10px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:155px" title="${r.address}">${r.address}</div>
                  </td>
                  <td>
                    <div style="font-size:12px">${r.citizen}</div>
                    <div style="font-size:10px;color:var(--muted)">${r.phone}</div>
                  </td>
                  <td style="font-size:10px;color:var(--muted);white-space:nowrap">${r.time.replace(' ','<br>')}</td>
                  <td>
                    <div>${statusBadge(r.status)}</div>
                    ${assigneeName ? `<div style="font-size:10px;color:var(--muted);margin-top:2px">${assigneeName}</div>` : ''}
                    ${r.images > 0 ? `<div style="font-size:10px;color:var(--primary);margin-top:2px;display:flex;align-items:center;gap:3px">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>${r.images} ảnh</div>` : ''}
                  </td>
                  <td onclick="event.stopPropagation()">
                    <div style="display:flex;gap:3px;flex-wrap:wrap">
                      <button class="btn btn-ghost btn-xs" title="Xem chi tiết" onclick="viewCrReport('${r.id}')">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                      ${r.images > 0 ? `<button class="btn btn-ghost btn-xs" title="Xem ảnh" onclick="openCrGallery('${r.id}',0)">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </button>` : ''}
                      ${r.status === 'pending' ? `<button class="btn btn-primary btn-xs" onclick="assignCrReport('${r.id}')">Phân công</button>` : ''}
                      ${r.status === 'processing' ? `<button class="btn btn-ghost btn-xs" style="color:var(--success);border-color:var(--success)" onclick="resolveCrReport('${r.id}')">✓ Xong</button>` : ''}
                    </div>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>`}
    </div>
  </div>`;
}

// ── Navigation helpers ─────────────────────────────────────────────
function switchCrTab(tab) {
  crTab = tab;
  const area = document.getElementById('contentArea');
  if (area) area.innerHTML = renderCommunityReports();
}

function filterCrTable(q) {
  document.querySelectorAll('#crTable tbody tr').forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none';
  });
}

function crFilterType(type) {
  crTab = 'all';
  const area = document.getElementById('contentArea');
  if (area) area.innerHTML = renderCommunityReports();
  setTimeout(() => filterCrTable(CR_TYPES[type]?.label || type), 50);
}

function exportCrReport() {
  showToast('Đang xuất báo cáo Excel phản ánh cộng đồng...');
}

// ── Image Gallery Modal ────────────────────────────────────────────
let _crGalleryId  = null;
let _crGalleryIdx = 0;

function openCrGallery(reportId, startIdx) {
  const imgs = CR_IMAGES[reportId];
  if (!imgs || !imgs.length) { showToast('Báo cáo này chưa có ảnh đính kèm.'); return; }
  _crGalleryId  = reportId;
  _crGalleryIdx = startIdx || 0;
  _renderGallery();
}

function _renderGallery() {
  const imgs   = CR_IMAGES[_crGalleryId] || [];
  const total  = imgs.length;
  const idx    = _crGalleryIdx;
  const src    = imgs[idx];

  // Remove existing gallery overlay
  const existing = document.getElementById('crGalleryOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'crGalleryOverlay';
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.92);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    animation:fadeIn .15s ease;
  `;

  overlay.innerHTML = `
    <style>
      @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      #crGalleryOverlay .gal-btn {
        position:absolute;top:50%;transform:translateY(-50%);
        width:44px;height:44px;border-radius:50%;border:none;cursor:pointer;
        background:rgba(255,255,255,.12);color:#fff;font-size:20px;
        display:flex;align-items:center;justify-content:center;
        transition:.15s;backdrop-filter:blur(4px);
      }
      #crGalleryOverlay .gal-btn:hover { background:rgba(255,255,255,.24); }
      #crGalleryOverlay .gal-btn:disabled { opacity:.25;cursor:default; }
      #crGalleryOverlay .thumb {
        width:56px;height:40px;border-radius:5px;object-fit:cover;cursor:pointer;
        border:2px solid transparent;opacity:.55;transition:.15s;flex-shrink:0;
      }
      #crGalleryOverlay .thumb.active { border-color:#fff;opacity:1; }
      #crGalleryOverlay .thumb:hover { opacity:.85; }
    </style>

    <!-- Top bar -->
    <div style="position:absolute;top:0;left:0;right:0;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(to bottom,rgba(0,0,0,.7),transparent)">
      <div style="color:rgba(255,255,255,.7);font-size:13px">
        <span style="color:#fff;font-weight:600">${_crGalleryId}</span>
        &nbsp;·&nbsp; Ảnh ${idx + 1} / ${total}
      </div>
      <button onclick="closeCrGallery()" style="background:rgba(255,255,255,.12);border:none;color:#fff;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <!-- Prev -->
    <button class="gal-btn" id="galPrev" style="left:16px" onclick="crGalleryNav(-1)" ${idx === 0 ? 'disabled' : ''}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
    </button>

    <!-- Main image -->
    <img id="galMainImg" src="${src}" alt="Ảnh hiện trường ${idx+1}"
      style="max-width:min(90vw,960px);max-height:calc(100vh - 160px);object-fit:contain;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,.5);user-select:none">

    <!-- Next -->
    <button class="gal-btn" id="galNext" style="right:16px" onclick="crGalleryNav(1)" ${idx === total - 1 ? 'disabled' : ''}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
    </button>

    <!-- Thumbnails strip -->
    ${total > 1 ? `
    <div style="position:absolute;bottom:0;left:0;right:0;padding:12px 20px;background:linear-gradient(to top,rgba(0,0,0,.7),transparent);display:flex;justify-content:center;gap:8px;flex-wrap:wrap">
      ${imgs.map((img, i) => `
      <img src="${img}" class="thumb ${i === idx ? 'active' : ''}" onclick="crGalleryGoTo(${i})"
        alt="Thumb ${i+1}" title="Ảnh ${i+1}">
      `).join('')}
    </div>` : ''}

    <!-- Click outside / escape hint -->
    <div style="position:absolute;bottom:${total > 1 ? '70px' : '20px'};left:50%;transform:translateX(-50%);color:rgba(255,255,255,.35);font-size:11px;pointer-events:none">
      ← → để chuyển ảnh &nbsp;·&nbsp; Esc để đóng
    </div>
  `;

  // Close on backdrop click (not on image or buttons)
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeCrGallery();
  });

  document.body.appendChild(overlay);

  // Keyboard handler
  if (!window._crGalleryKeyHandler) {
    window._crGalleryKeyHandler = e => {
      if (!document.getElementById('crGalleryOverlay')) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  crGalleryNav(1);
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')    crGalleryNav(-1);
      if (e.key === 'Escape')  closeCrGallery();
    };
    document.addEventListener('keydown', window._crGalleryKeyHandler);
  }
}

function crGalleryNav(dir) {
  const imgs = CR_IMAGES[_crGalleryId] || [];
  const next = _crGalleryIdx + dir;
  if (next < 0 || next >= imgs.length) return;
  _crGalleryIdx = next;
  _renderGallery();
}

function crGalleryGoTo(idx) {
  _crGalleryIdx = idx;
  _renderGallery();
}

function closeCrGallery() {
  const el = document.getElementById('crGalleryOverlay');
  if (el) el.remove();
  if (window._crGalleryKeyHandler) {
    document.removeEventListener('keydown', window._crGalleryKeyHandler);
    window._crGalleryKeyHandler = null;
  }
}

// ── Report Detail Modal ────────────────────────────────────────────
function viewCrReport(id) {
  const r = CR_REPORTS.find(x => x.id === id);
  if (!r) return;
  const t = CR_TYPES[r.type] || { label: r.type, badge: 'badge-gray', color: 'var(--muted)' };
  const priorityLabel = { critical: 'KHẨN CẤP', high: 'Cao', medium: 'Trung bình', low: 'Thấp' }[r.priority] || '';
  const priorityColor = { critical: 'var(--danger)', high: 'var(--orange)', medium: 'var(--warning)', low: 'var(--muted)' }[r.priority];
  const assigneeName  = r.assignee ? (DATA.employees.find(e => e.id === r.assignee)?.name || r.assignee) : 'Chưa phân công';
  const imgs = CR_IMAGES[r.id] || [];

  openModal(`
    <div class="modal-header">
      <span class="modal-title">Chi tiết Phản ánh — ${r.id}</span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <!-- Meta strip -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px">
        <div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:9px;padding:10px 12px">
          <div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px">Loại sự cố</div>
          <span class="badge ${t.badge}" style="margin-top:5px;display:inline-block">${t.label}</span>
        </div>
        <div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:9px;padding:10px 12px">
          <div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px">Ưu tiên</div>
          <div style="font-size:14px;font-weight:700;margin-top:4px;color:${priorityColor}">${priorityLabel}</div>
        </div>
        <div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:9px;padding:10px 12px">
          <div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px">Trạng thái</div>
          <div style="margin-top:5px">${r.status==='pending'?'<span class="badge badge-yellow">Chờ xử lý</span>':r.status==='processing'?'<span class="badge badge-blue">Đang xử lý</span>':'<span class="badge badge-green">Hoàn thành</span>'}</div>
        </div>
        <div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:9px;padding:10px 12px">
          <div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px">Cán bộ xử lý</div>
          <div style="font-size:13px;font-weight:600;margin-top:4px;color:${r.assignee?'var(--primary)':'var(--muted)'}">${assigneeName}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 250px;gap:14px">
        <!-- Left -->
        <div style="display:flex;flex-direction:column;gap:12px">
          <div class="card" style="padding:14px">
            <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Mô tả sự cố</div>
            <div style="font-size:13px;line-height:1.75">${r.desc}</div>
          </div>
          <div class="card" style="padding:14px">
            <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Địa điểm xảy ra</div>
            <div style="display:flex;align-items:flex-start;gap:8px">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" style="flex-shrink:0;margin-top:2px"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 016.93 12L12 22 5.07 14A8 8 0 0112 2z"/></svg>
              <div>
                <div style="font-size:13px;font-weight:600">${r.district}</div>
                <div style="font-size:12px;color:var(--muted);margin-top:2px">${r.address}</div>
              </div>
            </div>
          </div>
          ${r.note ? `<div class="card" style="padding:14px;border-left:3px solid var(--primary)">
            <div style="font-size:10px;font-weight:700;color:var(--muted);margin-bottom:6px;text-transform:uppercase">Ghi chú xử lý</div>
            <div style="font-size:13px;color:var(--primary)">${r.note}</div>
          </div>` : ''}

          <!-- Images strip -->
          ${imgs.length > 0 ? `
          <div class="card" style="padding:14px">
            <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Ảnh hiện trường (${imgs.length})</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              ${imgs.map((img, i) => `
              <div onclick="closeModal();setTimeout(()=>openCrGallery('${r.id}',${i}),100)"
                style="width:80px;height:58px;border-radius:7px;overflow:hidden;cursor:pointer;flex-shrink:0;position:relative;border:2px solid var(--border);transition:.15s"
                onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--border)'">
                <img src="${img}" style="width:100%;height:100%;object-fit:cover" alt="Ảnh ${i+1}">
                <div style="position:absolute;inset:0;background:rgba(0,0,0,0);display:flex;align-items:center;justify-content:center;transition:.15s"
                  onmouseover="this.style.background='rgba(0,200,255,.18)'" onmouseout="this.style.background='rgba(0,0,0,0)'">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="2.5" style="opacity:0;transition:.15s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                </div>
              </div>`).join('')}
              <div onclick="closeModal();setTimeout(()=>openCrGallery('${r.id}',0),100)"
                style="width:80px;height:58px;border-radius:7px;border:1.5px dashed var(--border);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;font-size:10px;color:var(--muted);gap:3px"
                onmouseover="this.style.borderColor='var(--primary)';this.style.color='var(--primary)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--muted)'">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                Xem tất cả
              </div>
            </div>
          </div>` : ''}
        </div>

        <!-- Right: citizen + assign -->
        <div style="display:flex;flex-direction:column;gap:10px">
          <div class="card" style="padding:14px">
            <div style="font-size:10px;font-weight:700;color:var(--muted);margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px">Người phản ánh</div>
            <div style="font-size:14px;font-weight:700;margin-bottom:6px">${r.citizen}</div>
            <div style="font-size:12px;color:var(--muted);display:flex;align-items:center;gap:5px;margin-bottom:4px">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              ${r.phone}
            </div>
            <div style="font-size:12px;color:var(--muted)">Gửi lúc: ${r.time}</div>
          </div>
          <div class="card" style="padding:14px">
            <div style="font-size:10px;font-weight:700;color:var(--muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Phân công xử lý</div>
            <div id="vcrAssignName" style="font-size:13px;font-weight:600;margin-bottom:8px;color:${r.assignee?'var(--primary)':'var(--muted)'}">${assigneeName}</div>
            <div class="form-group" style="margin-bottom:8px">
              <label class="form-label" style="font-size:11px">Ghi chú</label>
              <textarea id="vcrNote" class="form-control" rows="3" style="font-size:12px" placeholder="Tiến độ xử lý...">${r.note}</textarea>
            </div>
            <select id="vcrAssignSel" class="form-control form-control-sm" style="margin-bottom:6px">
              <option value="">Phân công cho...</option>
              ${DATA.employees.filter(e => ['KY_THUAT','DIEU_HANH','DISPATCHER'].includes(e.role)).map(e =>
                `<option value="${e.id}" ${r.assignee===e.id?'selected':''}>${e.name}</option>`).join('')}
            </select>
            <button class="btn btn-primary btn-sm" style="width:100%" onclick="saveVcrAssign('${r.id}')">Lưu phân công</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
      ${imgs.length > 0 ? `<button class="btn btn-ghost" onclick="closeModal();setTimeout(()=>openCrGallery('${r.id}',0),80)">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        Xem ${imgs.length} ảnh
      </button>` : ''}
      <button class="btn btn-outline" onclick="closeModal();openNotifyTargetModal({title:'Phản hồi phản ánh ${r.id}',content:'Báo cáo của ${r.citizen} đã được xử lý.'})">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Phản hồi người dân
      </button>
      ${r.status !== 'resolved' ? `<button class="btn btn-primary" onclick="closeModal();resolveCrReport('${r.id}')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        Đánh dấu hoàn thành
      </button>` : ''}
    </div>
  `, { width: '820px' });
}

function saveVcrAssign(id) {
  const r = CR_REPORTS.find(x => x.id === id);
  if (!r) return;
  const sel  = document.getElementById('vcrAssignSel')?.value;
  const note = document.getElementById('vcrNote')?.value || '';
  if (sel) { r.assignee = sel; r.status  = r.status === 'pending' ? 'processing' : r.status; }
  r.note = note;
  closeModal();
  showToast('Đã lưu phân công cho ' + id);
  const area = document.getElementById('contentArea');
  if (area) area.innerHTML = renderCommunityReports();
}

// ── Assign modal ───────────────────────────────────────────────────
function assignCrReport(id) {
  const r = CR_REPORTS.find(x => x.id === id);
  if (!r) return;
  openModal(`
    <div class="modal-header">
      <span class="modal-title">Phân công xử lý — ${id}</span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <div style="font-size:13px;margin-bottom:12px;padding:10px 14px;background:rgba(255,255,255,.03);border-radius:8px;border:1px solid var(--border)">${r.desc.substring(0,140)}${r.desc.length > 140 ? '...' : ''}</div>
      <div class="form-group">
        <label class="form-label">Phân công cho cán bộ</label>
        <select class="form-control" id="crAssignPerson">
          <option value="">— Chọn cán bộ xử lý —</option>
          ${DATA.employees.filter(e => ['KY_THUAT','DIEU_HANH','DISPATCHER'].includes(e.role)).map(e =>
            `<option value="${e.id}">${e.name} — ${e.dept}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Ghi chú / Hướng xử lý</label>
        <textarea class="form-control" rows="3" id="crAssignNote" placeholder="Hướng dẫn xử lý, ưu tiên, kế hoạch cụ thể..."></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Hạn xử lý</label>
        <input type="datetime-local" class="form-control" id="crAssignDeadline">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="doAssignCr('${id}')">Xác nhận phân công</button>
    </div>
  `);
}

function doAssignCr(id) {
  const r      = CR_REPORTS.find(x => x.id === id);
  const person = document.getElementById('crAssignPerson')?.value;
  const note   = document.getElementById('crAssignNote')?.value || '';
  if (r && person) {
    r.status   = 'processing';
    r.assignee = person;
    r.note     = note;
    closeModal();
    showToast('Đã phân công xử lý báo cáo ' + id + ' thành công!');
    const area = document.getElementById('contentArea');
    if (area) area.innerHTML = renderCommunityReports();
  } else {
    showToast('Vui lòng chọn cán bộ xử lý!');
  }
}

function resolveCrReport(id) {
  const r = CR_REPORTS.find(x => x.id === id);
  if (r) {
    r.status = 'resolved';
    showToast('Đã đánh dấu hoàn thành: ' + id);
    const area = document.getElementById('contentArea');
    if (area) area.innerHTML = renderCommunityReports();
  }
}

// ── AI ANALYTICS TAB ───────────────────────────────────────────────
function renderCrAnalytics() {
  const reports = CR_REPORTS;
  const byDistrict = {};
  const byType     = {};
  reports.forEach(r => {
    byDistrict[r.district] = (byDistrict[r.district]||0)+1;
    byType[r.type]         = (byType[r.type]||0)+1;
  });
  const districtRanked = Object.entries(byDistrict).sort((a,b)=>b[1]-a[1]);
  const typeRanked     = Object.entries(byType).sort((a,b)=>b[1]-a[1]);

  // Severity score: critical=4, high=3, medium=2, low=1
  const sevMap = {critical:4,high:3,medium:2,low:1};
  const sevByDistrict = {};
  reports.forEach(r => {
    sevByDistrict[r.district] = (sevByDistrict[r.district]||0) + (sevMap[r.priority]||1);
  });
  const sevRanked = Object.entries(sevByDistrict).sort((a,b)=>b[1]-a[1]);
  const maxSev = sevRanked[0]?.[1] || 1;

  // Trend mock (week-on-week categories)
  const trendData = [
    { label:'Đê điều', prev:2, curr:4, up:true },
    { label:'Ngập úng', prev:5, curr:3, up:false },
    { label:'Sạt lở',  prev:1, curr:3, up:true },
    { label:'Vi phạm', prev:3, curr:2, up:false },
    { label:'Kết cấu', prev:1, curr:2, up:true },
  ];

  // AI Response suggestions per top issue
  const topType = typeRanked[0]?.[0];
  const suggestions = {
    dike_risk:       ['Cử tổ kỹ thuật kiểm tra và chụp ảnh hiện trạng trong 2h','Đặt biển cảnh báo tạm thời','Lập phương án đắp bao tải khẩn cấp nếu có thấm','Báo cáo ngay lên Ban chỉ huy PCTT huyện'],
    flooding:        ['Kiểm tra khả năng tiêu thoát nước tại cống đầu mối','Điều động máy bơm dã chiến','Cảnh báo người dân tránh khu vực ngập','Phối hợp UBND phường/xã hỗ trợ học sinh'],
    landslide:       ['Phong tỏa khu vực, cắm biển cấm đường','Đánh giá nguy cơ sạt tiếp','Liên hệ đơn vị thi công khơi thông đất đá','Rà soát hộ dân trong vùng nguy hiểm'],
    drain_blocked:   ['Điều phối đội công trình thông cống trong ngày','Kiểm tra nguyên nhân gốc rễ','Lên kế hoạch nạo vét định kỳ','Thông báo kết quả xử lý cho người phản ánh'],
    vi_pham_hanh_lang:['Kiểm tra thực địa, lập biên bản vi phạm','Điều tra chủ đầu tư công trình','Gửi văn bản yêu cầu đình chỉ thi công','Báo cáo Sở NN&PTNT nếu vi phạm nghiêm trọng'],
    infra_damage:    ['Khảo sát hiện trạng và chụp ảnh tài liệu','Lập dự toán sửa chữa khẩn cấp','Bố trí vật tư và nhân lực trong 24h','Theo dõi diễn biến tình trạng thoát nước'],
    tree_fall:       ['Phối hợp QLGT và Điện lực xử lý','Cắt cành/hạ cây an toàn','Kiểm tra cây khác trong khu vực','Ghi nhập biên bản và chụp ảnh lưu hồ sơ'],
  };
  const sugg = suggestions[topType] || suggestions.flooding;
  const topTypeName = CR_TYPES[topType]?.label || topType;

  // Hotspot: districts with >=2 reports
  const hotspots = districtRanked.filter(([d,n])=>n>=2);

  return `
  <div style="display:flex;flex-direction:column;gap:16px">

    <!-- Row 1: severity ranking + trend -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">

      <!-- Xếp hạng mức độ nghiêm trọng -->
      <div class="card" style="padding:16px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span style="font-size:12px;font-weight:700">Xếp hạng mức độ nghiêm trọng theo khu vực</span>
        </div>
        ${sevRanked.map(([d,s],i)=>`
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <div style="width:20px;text-align:center;font-size:11px;font-weight:700;color:${i===0?'var(--danger)':i===1?'var(--warning)':'var(--muted)'}">#${i+1}</div>
          <div style="font-size:12px;font-weight:${i<2?600:400};flex:1">${d}</div>
          <div style="flex:2;height:8px;background:rgba(255,255,255,.07);border-radius:4px;overflow:hidden">
            <div style="width:${Math.round(s/maxSev*100)}%;height:100%;background:${i===0?'var(--danger)':i===1?'var(--warning)':'var(--primary)'};border-radius:4px;transition:.4s"></div>
          </div>
          <div style="font-size:11px;color:var(--muted);min-width:28px;text-align:right">${s}đ</div>
        </div>`).join('')}
        <div style="font-size:10px;color:var(--muted);margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">Điểm = Khẩn×4 + Cao×3 + TB×2 + Thấp×1</div>
      </div>

      <!-- Dự báo xu hướng ngắn hạn -->
      <div class="card" style="padding:16px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span style="font-size:12px;font-weight:700">Dự báo xu hướng ngắn hạn (7 ngày tới)</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${trendData.map(t=>`
          <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;background:${t.up?'rgba(239,68,68,.05)':'rgba(22,163,74,.05)'}">
            <div style="font-size:12px;flex:1;font-weight:500">${t.label}</div>
            <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:${t.up?'var(--danger)':'var(--success)'}">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                ${t.up?'<polyline points="18 15 12 9 6 15"/>':'<polyline points="6 9 12 15 18 9"/>'}
              </svg>
              ${t.up?'Tăng':'Giảm'}: ${t.prev}→${t.curr} phản ánh/tuần
            </div>
            <div style="padding:2px 7px;border-radius:5px;font-size:9px;background:${t.up?'rgba(239,68,68,.12)':'rgba(22,163,74,.12)'};color:${t.up?'var(--danger)':'var(--success)'}">
              ${t.up?'⚠ Chú ý':'✓ Ổn định'}
            </div>
          </div>`).join('')}
        </div>
        <div style="font-size:10px;color:var(--muted);margin-top:10px;padding-top:8px;border-top:1px solid var(--border)">
          Dự báo dựa trên xu hướng 4 tuần gần nhất + điều kiện thời tiết dự báo
        </div>
      </div>
    </div>

    <!-- Row 2: hotspot + AI suggestions -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">

      <!-- Phân tích điểm nóng lặp lại -->
      <div class="card" style="padding:16px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>
          <span style="font-size:12px;font-weight:700">Điểm nóng phản ánh lặp lại</span>
        </div>
        ${hotspots.length===0?'<p style="color:var(--muted);font-size:12px">Không có điểm nóng lặp lại trong kỳ này</p>':`
        <div style="display:flex;flex-direction:column;gap:8px">
          ${hotspots.map(([d,n],i)=>`
          <div style="padding:10px 12px;border-radius:9px;background:rgba(${i===0?'239,68,68':'234,179,8'},.07);border:1px solid rgba(${i===0?'239,68,68':'234,179,8'},.2)">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="${i===0?'rgba(239,68,68,.8)':'rgba(234,179,8,.8)'}" stroke="none"><circle cx="12" cy="12" r="10"/></svg>
              <span style="font-size:12px;font-weight:700">${d}</span>
              <span style="font-size:11px;color:var(--muted);margin-left:auto">${n} phản ánh</span>
            </div>
            <div style="font-size:11px;color:var(--muted)">
              ${CR_REPORTS.filter(r=>r.district===d).map(r=>CR_TYPES[r.type]?.label||r.type).join(' · ')}
            </div>
          </div>`).join('')}
        </div>`}
        <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border)">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px">Phân bổ theo loại phản ánh</div>
          ${typeRanked.slice(0,5).map(([t,n])=>`
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
            <div style="font-size:11px;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${CR_TYPES[t]?.label||t}</div>
            <div style="flex:2;height:5px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden">
              <div style="width:${Math.round(n/reports.length*100)}%;height:100%;background:var(--primary);border-radius:3px"></div>
            </div>
            <div style="font-size:10px;color:var(--muted);min-width:18px;text-align:right">${n}</div>
          </div>`).join('')}
        </div>
      </div>

      <!-- Gợi ý phương án ứng phó -->
      <div class="card" style="padding:16px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <div style="display:flex;align-items:center;gap:8px">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            <span style="font-size:12px;font-weight:700">Gợi ý phương án ứng phó AI</span>
          </div>
          <span style="font-size:10px;padding:2px 7px;background:rgba(41,132,238,.15);color:#5BA9FF;border-radius:5px">AI</span>
        </div>
        <div style="font-size:11px;color:var(--muted);margin-bottom:10px;padding:7px 10px;background:rgba(41,132,238,.06);border-radius:7px;border-left:3px solid var(--purple)">
          Dựa trên loại phản ánh nhiều nhất: <strong style="color:white">${topTypeName}</strong> (${typeRanked[0]?.[1]||0} báo cáo)
        </div>
        <div style="display:flex;flex-direction:column;gap:7px">
          ${sugg.map((s,i)=>`
          <div style="display:flex;align-items:flex-start;gap:9px;padding:8px 10px;border-radius:8px;background:rgba(41,132,238,.05);border:1px solid rgba(41,132,238,.12)">
            <div style="width:20px;height:20px;border-radius:50%;background:rgba(41,132,238,.2);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:#5BA9FF;flex-shrink:0">${i+1}</div>
            <div style="font-size:12px;line-height:1.5">${s}</div>
          </div>`).join('')}
        </div>
        <button class="btn btn-outline btn-sm" style="width:100%;margin-top:12px;color:#5BA9FF;border-color:rgba(41,132,238,.3)" onclick="showToast('Tạo lệnh chỉ đạo từ gợi ý AI...')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          Chuyển thành lệnh chỉ đạo
        </button>
      </div>
    </div>

  </div>`;
}
