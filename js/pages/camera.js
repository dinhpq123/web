// ══════════════════════════════════════════════════════════════════
// CAMERA SURVEILLANCE MODULE – Hadiwa IOC
// 130 cameras · 4 NVRs · 700 Mbps đường truyền riêng
// Chi cục Thủy lợi & PCTT TP. Hà Nội
// ══════════════════════════════════════════════════════════════════

// ── IMAGE REGISTRY ─────────────────────────────────────────────────
// ── Mock camera feed images (relative path — safe for any server deployment) ──
// 16 unique AI-generated CCTV images for realistic demo
const CAM_IMAGES = {
  // Original 6
  gate_online: 'assets/mock-images/cctv_gate_online_1772284484245.png',
  pump_room: 'assets/mock-images/cctv_pump_room_1772284518940.png',
  reservoir: 'assets/mock-images/cctv_reservoir_1772284541732.png',
  control_room: 'assets/mock-images/cctv_control_room_1772284570329.png',
  chemical: 'assets/mock-images/cctv_chemical_storage_1772284632893.png',
  perimeter: 'assets/mock-images/cctv_perimeter_fence_1772284669824.png',
  // 10 additional unique images
  entrance_hall: 'assets/mock-images/cctv_entrance_hall.png',
  outdoor_yard: 'assets/mock-images/cctv_outdoor_yard.png',
  filter_room: 'assets/mock-images/cctv_filter_room.png',
  lab_room: 'assets/mock-images/cctv_lab_room.png',
  server_room: 'assets/mock-images/cctv_server_room.png',
  water_tower: 'assets/mock-images/cctv_water_tower.png',
  loading_dock: 'assets/mock-images/cctv_loading_dock.png',
  sedimentation_basin: 'assets/mock-images/cctv_sedimentation_basin.png',
  electrical_room: 'assets/mock-images/cctv_electrical_room.png',
  main_gate: 'assets/mock-images/cctv_main_gate.png',
};

// Position type → unique image key mapping (16 distinct images)
const CAM_POSITION_IMAGE = {
  'Cổng vào': 'main_gate',
  'Sân trước': 'outdoor_yard',
  'Bảo vệ': 'gate_online',
  'Cổng ra': 'entrance_hall',
  'Bơm chính': 'pump_room',
  'Khu vực xử lý': 'filter_room',
  'Xưởng bơm': 'outdoor_yard',
  'Bể nước': 'reservoir',
  'Bể chứa': 'sedimentation_basin',
  'Hồ lắng': 'sedimentation_basin',
  'Phòng điều khiển': 'control_room',
  'Phòng kỹ thuật': 'server_room',
  'Hành lang': 'entrance_hall',
  'Khu vực hóa chất': 'chemical',
  'Kho hóa chất': 'loading_dock',
  'Tường rào': 'perimeter',
  'Cầu thang': 'water_tower',
  // Extra positions round-robin through remaining unique images
  'Khu A – Xử lý thô': 'filter_room',
  'Khu B – Lọc': 'filter_room',
  'Khu C – Khử trùng': 'lab_room',
  'Khu D – Bể chứa': 'reservoir',
  'Khu vực trọng điểm': 'perimeter',
  'Phòng SCADA': 'server_room',
  'Khu hóa chất': 'chemical',
  'Khu lọc': 'filter_room',
  'Nhà bơm chính': 'pump_room',
  'Bể điều hòa': 'sedimentation_basin',
  'Nhà bơm': 'pump_room',
  'Khu van điều áp': 'electrical_room',
  'Vành đai ngoài': 'perimeter',
  'Cổng trung tâm SCC': 'main_gate',
  'Vành đai phía Bắc': 'water_tower',
  'Vành đai phía Nam': 'outdoor_yard',
};

// ── LOCATION TAXONOMY ──────────────────────────────────────────────
const CAM_LOCATION_TYPES = {
  'Cổng & Bảo vệ': { positions: ['Cổng vào', 'Cổng ra', 'Sân trước', 'Bảo vệ'], icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M13 4h3a2 2 0 012 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4l-8 2v14l8 4V4z"/></svg>', color: '#00c8ff' },
  'Khu xử lý & Bơm': { positions: ['Bơm chính', 'Khu vực xử lý', 'Xưởng bơm'], icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>', color: '#00e676' },
  'Bể chứa & Hồ lắng': { positions: ['Bể nước', 'Bể chứa', 'Hồ lắng'], icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 2C12 2 4 10 4 14a8 8 0 0016 0C20 10 12 2 12 2z"/></svg>', color: '#0055dd' },
  'Phòng điều khiển': { positions: ['Phòng điều khiển', 'Phòng kỹ thuật', 'Hành lang'], icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>', color: '#7c4dff' },
  'Khu hóa chất': { positions: ['Khu vực hóa chất', 'Kho hóa chất'], icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11m0 0a2 2 0 002 2h4a2 2 0 002-2V3M9 14l-3 7h12l-3-7"/></svg>', color: '#ffca28' },
  'Vành đai & An ninh': { positions: ['Tường rào', 'Cầu thang'], icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>', color: '#ff5722' },
};

// Full sub-location catalog per site — Hadiwa IOC (Chi cục TL & PCTT Hà Nội)
const CAM_SITE_SUBLOCATIONS = {
  'Hồ chứa Suối Hai': ['Đập chính', 'Tràn xả lũ', 'Nhà bơm tưới', 'Cổng vào hồ', 'Trạm quan trắc', 'Vành đai bảo vệ'],
  'Trạm bơm Yên Nghĩa': ['Tổ máy bơm 1-3', 'Tổ máy bơm 4-6', 'Phòng điều khiển SCADA', 'Cửa vào/ra kênh', 'Bể hút'],
  'Trạm bơm Tây Tựu': ['Nhà máy bơm chính', 'Bể điều hòa', 'Cổng công trình', 'Khu kỹ thuật điện'],
  'Trạm bơm Đan Hoài': ['Tổ hợp bơm tiêu', 'Kênh đầu mối', 'Phòng vận hành', 'Cổng bảo vệ'],
  'Đê sông Hồng (Hà Nội)': ['Km 0–12 đoạn Chèm', 'Km 12–25 đoạn Long Biên', 'Cửa khẩu K3', 'Trạm quan trắc Chương Dương', 'Kè gia cố Tứ Liên'],
  'Hồ Tây – Hồ điều hòa': ['Cống Thụy Khuê', 'Cống Hoàng Hoa Thám', 'Vành đai ven hồ', 'Trạm đo mực nước'],
  'Trạm bơm Bộ Đầu': ['Nhà bơm chính', 'Khu van điều áp', 'Vành đai ngoài'],
  'Trung tâm IOC – SCC': ['Phòng điều hành chính', 'Vành đai phía Bắc', 'Vành đai phía Nam', 'Cổng chính trung tâm'],
};

// ── MOCK DATA ──────────────────────────────────────────────────────
(function () {
  const LOCATIONS = [
    { site: 'Hồ chứa Suối Hai', short: 'SH', count: 28 },
    { site: 'Trạm bơm Yên Nghĩa', short: 'YN', count: 26 },
    { site: 'Trạm bơm Tây Tựu', short: 'TT', count: 22 },
    { site: 'Trạm bơm Đan Hoài', short: 'DH', count: 18 },
    { site: 'Đê sông Hồng (Hà Nội)', short: 'SH', count: 14 },
    { site: 'Hồ Tây – Hồ điều hòa', short: 'HT', count: 10 },
    { site: 'Trạm bơm Bộ Đầu', short: 'BD', count: 6 },
    { site: 'Trung tâm IOC – SCC', short: 'SCC', count: 6 },
  ];

  const TYPES = ['PTZ Dome', 'Fixed Bullet', 'Fixed Dome', 'PTZ Speed'];
  const RESOLUTIONS = ['4K (8MP)', '4K (8MP)', '1080P (2MP)', '2K (4MP)'];
  const STATUSES = ['online', 'online', 'online', 'online', 'online', 'warning', 'offline'];

  // All positions across all types
  const ALL_POSITIONS = Object.values(CAM_LOCATION_TYPES).flatMap(lt => lt.positions);

  let camIdx = 1;
  window.CAM_DATA = { nvrs: [], cameras: [] };

  const NVR_SITES = [
    { id: 'NVR-01', name: 'NVR-01 — Suối Hai + Yên Nghĩa', channels: 32, hdd: 16, hdUsed: 12.4, bandwidth: 198, cams: [] },
    { id: 'NVR-02', name: 'NVR-02 — Tây Tựu + Đan Hoài', channels: 32, hdd: 16, hdUsed: 11.1, bandwidth: 176, cams: [] },
    { id: 'NVR-03', name: 'NVR-03 — Đê sông Hồng + Hồ Tây', channels: 16, hdd: 8, hdUsed: 5.8, bandwidth: 142, cams: [] },
    { id: 'NVR-04', name: 'NVR-04 — Bộ Đầu + Trung tâm SCC (Dự phòng)', channels: 32, hdd: 16, hdUsed: 9.7, bandwidth: 184, cams: [] },
  ];

  LOCATIONS.forEach((loc, li) => {
    const nvrIdx = li < 2 ? 0 : li < 4 ? 1 : 2;
    const subLocs = CAM_SITE_SUBLOCATIONS[loc.site] || ['Khu vực chung'];
    for (let i = 0; i < loc.count; i++) {
      const pos = ALL_POSITIONS[i % ALL_POSITIONS.length];
      const locType = Object.entries(CAM_LOCATION_TYPES).find(([, lt]) => lt.positions.includes(pos))?.[0] || 'Vành đai & An ninh';
      const statusWeight = STATUSES[Math.floor(Math.random() * STATUSES.length)];
      const imgKey = CAM_POSITION_IMAGE[pos] || 'gate_online';
      const cam = {
        id: `CAM-${String(camIdx).padStart(3, '0')}`,
        name: `${loc.short}-${String(i + 1).padStart(2, '0')}`,
        site: loc.site,
        siteShort: loc.short,
        position: pos,
        locationType: locType,
        subLocation: subLocs[i % subLocs.length],
        type: TYPES[i % TYPES.length],
        resolution: RESOLUTIONS[i % RESOLUTIONS.length],
        fps: [15, 20, 25, 30][i % 4],
        status: statusWeight,
        nvr: NVR_SITES[nvrIdx].id,
        channel: i + 1,
        uptime: statusWeight === 'offline' ? 0 : Math.floor(Math.random() * 1440 * 30),
        lastEvent: statusWeight === 'online' ? null : 'Mất tín hiệu video',
        bitrate: statusWeight === 'offline' ? 0 : (1.5 + Math.random() * 4).toFixed(1),
        ip: `192.168.${10 + li}.${20 + i}`,
        imageKey: imgKey,
      };
      NVR_SITES[nvrIdx].cams.push(cam.id);
      window.CAM_DATA.cameras.push(cam);
      camIdx++;
    }
  });

  // Fill NVR-04 with cross-assigned cameras
  window.CAM_DATA.cameras.filter(c => c.siteShort === 'SCC').slice(0, 6).forEach(c => {
    if (!NVR_SITES[3].cams.includes(c.id)) { NVR_SITES[3].cams.push(c.id); c.nvr = 'NVR-04'; }
  });

  window.CAM_DATA.nvrs = NVR_SITES;
  window.CAM_DATA.totalBandwidth = 700;
  window.CAM_DATA.storageRetentionDays = 15;
  window.CAM_DATA.displayScreens = { tv65: 4, tv55: 1 };
})();

// ── STATE ──────────────────────────────────────────────────────────
let camFilterSite = 'all';
let camFilterStatus = 'all';
let camFilterNvr = 'all';
let camFilterLocType = 'all';   // NEW: location type (Cổng & Bảo vệ, ...)
let camFilterSubLoc = 'all';   // NEW: specific sub-location within site/type
let camGridMode = '3x4';
let camCurrentPage = 1;         // NEW: Current page for pagination
let camActivePage = 'live';
let camLiveTimer = null;

// ── HELPERS ────────────────────────────────────────────────────────
const camStatusColor = s => ({ online: '#00e676', warning: '#ffca28', offline: '#ff1744' }[s] || '#546e7a');
const camStatusLabel = s => ({ online: 'Trực tuyến', warning: 'Cảnh báo', offline: 'Ngoại tuyến' }[s] || s);
const camStatusClass = s => ({ online: 'green', warning: 'yellow', offline: 'red' }[s] || 'gray');
function camUptimeStr(mins) {
  if (!mins) return '—';
  const d = Math.floor(mins / 1440), h = Math.floor((mins % 1440) / 60);
  return d > 0 ? `${d}n ${h}h` : `${h}h`;
}

function camGetItemsPerPage() {
  if (camGridMode === 'list') return 50;
  const [cols, rows] = camGridMode.split('x').map(Number);
  return (cols || 3) * (rows || 4);
}

function camGetFilteredCameras() {
  return window.CAM_DATA.cameras.filter(c => {
    if (camFilterSite !== 'all' && c.site !== camFilterSite) return false;
    if (camFilterStatus !== 'all' && c.status !== camFilterStatus) return false;
    if (camFilterNvr !== 'all' && c.nvr !== camFilterNvr) return false;
    if (camFilterLocType !== 'all' && c.locationType !== camFilterLocType) return false;
    if (camFilterSubLoc !== 'all' && c.subLocation !== camFilterSubLoc) return false;
    return true;
  });
}

// Get available sub-locations given current site+locType filter
function camGetAvailableSubLocs() {
  if (camFilterSite === 'all' && camFilterLocType === 'all') return [];
  return [...new Set(
    window.CAM_DATA.cameras
      .filter(c => {
        if (camFilterSite !== 'all' && c.site !== camFilterSite) return false;
        if (camFilterLocType !== 'all' && c.locationType !== camFilterLocType) return false;
        return true;
      })
      .map(c => c.subLocation)
  )];
}

// ── CAMERA FRAME RENDERER ──────────────────────────────────────────
function camRenderFrame(cam, mode = 'tile') {
  const imgPath = cam.status !== 'offline' ? CAM_IMAGES[cam.imageKey] : null;
  const isDetail = mode === 'detail';
  const imgStyle = `position:absolute;inset:0;width:100%;height:100%;object-fit:cover;${cam.status === 'warning' ? 'filter:saturate(0.3) brightness(0.7) contrast(1.2);' : ''}`;

  if (cam.status === 'offline') {
    return `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${isDetail ? '10px' : '5px'};background:rgba(10,10,20,1)">
      <svg width="${isDetail ? 40 : 24}" height="${isDetail ? 40 : 24}" viewBox="0 0 24 24" fill="none" stroke="#ff1744" stroke-width="1.5"><path d="M17 9.5v4.5L22 17V7L17 9.5z"/><line x1="1" y1="1" x2="23" y2="23" stroke="#ff1744"/><path d="M9.78 9.78A6.97 6.97 0 007 14H2V8h5.78M16 16H2a2 2 0 01-2-2V8a2 2 0 012-2h3"/></svg>
      <span style="font-size:${isDetail ? '12' : '9'}px;color:#ff1744;letter-spacing:.5px;text-align:center">MẤT TÍN HIỆU<br><span style="font-size:9px;opacity:.6">${cam.lastEvent || ''}</span></span>
    </div>`;
  }

  const warningBadge = cam.status === 'warning'
    ? `<div style="position:absolute;top:6px;right:6px;background:rgba(255,202,40,.2);border:1px solid rgba(255,202,40,.5);color:#ffca28;font-size:9px;padding:2px 7px;border-radius:4px;backdrop-filter:blur(4px)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> CHẤT LƯỢNG KÉM</div>`
    : `<div style="position:absolute;top:6px;left:6px;display:flex;align-items:center;gap:4px">
         <div style="width:7px;height:7px;background:#ff1744;border-radius:50%;animation:pd 1s ease-in-out infinite"></div>
         <span style="font-size:9px;color:#ff1744;font-weight:700;font-family:'Roboto Mono',monospace">REC</span>
       </div>`;

  return `
    <img src="${imgPath}" style="${imgStyle}" onerror="this.style.display='none'">
    ${warningBadge}
    <div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,.75));padding:6px 8px;display:flex;justify-content:space-between;align-items:flex-end">
      <span style="font-size:9px;color:rgba(255,255,255,.85);font-family:'Roboto Mono',monospace" class="cam-ts-${cam.id}">${new Date().toLocaleTimeString('vi-VN')}</span>
      <span style="font-size:9px;color:rgba(255,255,255,.5)">${cam.resolution}</span>
    </div>`;
}

// ── FILTER BAR ─────────────────────────────────────────────────────
function camRenderFilterBar() {
  const camData = window.CAM_DATA;
  const sites = [...new Set(camData.cameras.map(c => c.site))];
  const availSubLocs = camGetAvailableSubLocs();
  const totalCams = camData.cameras.length;
  const filteredCams = camGetFilteredCameras();
  const filteredCount = filteredCams.length;

  const itemsPerPage = camGetItemsPerPage();
  const totalPages = Math.ceil(filteredCount / itemsPerPage) || 1;
  if (camCurrentPage > totalPages) camCurrentPage = totalPages;

  const startIdx = (camCurrentPage - 1) * itemsPerPage;
  const endIdx = Math.min(startIdx + itemsPerPage, filteredCount);

  return `
  <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;align-items:center">
    <!-- Filters Row -->
    <select class="form-control" style="max-width:175px" id="camSelSite" onchange="camFilterSite=this.value;camFilterSubLoc='all';camCurrentPage=1;camRefresh()">
      <option value="all">Tất cả địa điểm</option>
      ${sites.map(s => `<option value="${s}" ${camFilterSite === s ? 'selected' : ''}>${s}</option>`).join('')}
    </select>

    <select class="form-control" style="max-width:190px" id="camSelLocType" onchange="camFilterLocType=this.value;camFilterSubLoc='all';camCurrentPage=1;camRefresh()">
      <option value="all">Tất cả loại vị trí</option>
      ${Object.entries(CAM_LOCATION_TYPES).map(([name, lt]) => `
        <option value="${name}" ${camFilterLocType === name ? 'selected' : ''}>${name}</option>`).join('')}
    </select>

    <select class="form-control" style="max-width:220px" id="camSelSubLoc"
      ${availSubLocs.length === 0 ? 'disabled' : ''} onchange="camFilterSubLoc=this.value;camCurrentPage=1;camRefresh()">
      <option value="all">${availSubLocs.length === 0 ? '(Chọn địa điểm trước)' : 'Tất cả khu vực'}</option>
      ${availSubLocs.map(sl => `<option value="${sl}" ${camFilterSubLoc === sl ? 'selected' : ''}>${sl}</option>`).join('')}
    </select>

    <select class="form-control" style="max-width:145px" onchange="camFilterStatus=this.value;camCurrentPage=1;camRefresh()">
      <option value="all">Tất cả trạng thái</option>
      <option value="online"  ${camFilterStatus === 'online' ? 'selected' : ''}>Trực tuyến</option>
      <option value="warning" ${camFilterStatus === 'warning' ? 'selected' : ''}>Cảnh báo</option>
      <option value="offline" ${camFilterStatus === 'offline' ? 'selected' : ''}>Ngoại tuyến</option>
    </select>

    <select class="form-control" style="max-width:135px" onchange="camFilterNvr=this.value;camCurrentPage=1;camRefresh()">
      <option value="all">Tất cả NVR</option>
      ${camData.nvrs.map(n => `<option value="${n.id}" ${camFilterNvr === n.id ? 'selected' : ''}>${n.id}</option>`).join('')}
    </select>

    <div style="flex:1"></div>

    <!-- Count Row / Grid / Pagination Container -->
    <div style="width:100%; display:flex; justify-content:space-between; align-items:center; margin-top:10px; padding-top:10px; border-top:1px solid rgba(255,255,255,.05)">
      
      <div style="display:flex; align-items:center; gap:12px">
        <!-- Grid Icons -->
        <div style="display:flex;gap:4px;background:rgba(255,255,255,.04);border-radius:8px;padding:3px">
          ${[
      ['2x2', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>', '2×2'],
      ['3x2', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="5" height="7"/><rect x="9.5" y="3" width="5" height="7"/><rect x="17" y="3" width="5" height="7"/><rect x="2" y="14" width="5" height="7"/><rect x="9.5" y="14" width="5" height="7"/><rect x="17" y="14" width="5" height="7"/></svg>', '3×2'],
      ['3x4', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="5" height="4"/><rect x="9.5" y="2" width="5" height="4"/><rect x="17" y="2" width="5" height="4"/><rect x="2" y="8" width="5" height="4"/><rect x="9.5" y="8" width="5" height="4"/><rect x="17" y="8" width="5" height="4"/><rect x="2" y="14" width="5" height="4"/><rect x="9.5" y="14" width="5" height="4"/><rect x="17" y="14" width="5" height="4"/><rect x="2" y="20" width="5" height="2"/><rect x="9.5" y="20" width="5" height="2"/><rect x="17" y="20" width="5" height="2"/></svg>', '3×4'],
      ['4x4', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="3.5" height="3.5"/><rect x="7.5" y="2" width="3.5" height="3.5"/><rect x="13" y="2" width="3.5" height="3.5"/><rect x="18.5" y="2" width="3.5" height="3.5"/><rect x="2" y="7.5" width="3.5" height="3.5"/><rect x="7.5" y="7.5" width="3.5" height="3.5"/><rect x="13" y="7.5" width="3.5" height="3.5"/><rect x="18.5" y="7.5" width="3.5" height="3.5"/></svg>', '4×4'],
      ['list', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>', 'List']
    ].map(([v, icon, tooltip]) => `
            <button onclick="camGridMode='${v}';camCurrentPage=1;camRefresh()" title="${tooltip}" style="width:32px;height:32px;border-radius:6px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;${camGridMode === v ? 'background:rgba(0,200,255,.2);color:var(--cyan);box-shadow:0 0 0 1px var(--cyan)' : 'background:transparent;color:var(--muted)'}">
              ${icon}
            </button>`).join('')}
        </div>

        <!-- Count info -->
        <div style="font-size:12px; color:var(--muted)">
          Đang hiển thị <span style="color:var(--text);font-weight:600">${filteredCount === 0 ? 0 : startIdx + 1}-${endIdx}</span> trên <span style="color:var(--cyan);font-weight:700">${filteredCount}</span> camera 
          ${camFilterSite !== 'all' || camFilterLocType !== 'all' ? `<span style="opacity:0.6">(Tổng ${totalCams})</span>` : ''}
        </div>
      </div>

      <!-- Pagination Controls -->
      <div style="display:flex; align-items:center; gap:4px">
        <button onclick="if(camCurrentPage>1){camCurrentPage--;camRefresh()}" ${camCurrentPage === 1 ? 'disabled' : ''} class="btn btn-ghost btn-sm" style="padding:4px 8px; font-size:11px">Trước</button>
        ${camRenderPageNumbers(totalPages)}
        <button onclick="if(camCurrentPage<${totalPages}){camCurrentPage++;camRefresh()}" ${camCurrentPage === totalPages ? 'disabled' : ''} class="btn btn-ghost btn-sm" style="padding:4px 8px; font-size:11px">Sau</button>
      </div>

    </div>
  </div>`;
}

function camRenderPageNumbers(totalPages) {
  if (totalPages <= 1) return '';
  let html = '';
  for (let i = 1; i <= totalPages; i++) {
    if (totalPages > 5 && i > 3 && i < totalPages - 1) {
      if (i === 4) html += '<span style="color:var(--muted)">...</span>';
      continue;
    }
    html += `<button onclick="camCurrentPage=${i};camRefresh()" style="width:26px;height:26px;border-radius:6px;border:none;cursor:pointer;font-size:11px;font-weight:600;transition:.2s;${camCurrentPage === i ? 'background:var(--cyan);color:#000' : 'background:rgba(255,255,255,.05);color:var(--text)'}">${i}</button>`;
  }
  return html;
}

function camRenderActiveFilterTags() {
  return `
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
    ${camFilterLocType !== 'all' ? `<div style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;background:rgba(0,200,255,.08);border:1px solid rgba(0,200,255,.22);border-radius:20px;font-size:11px;color:var(--cyan)">${CAM_LOCATION_TYPES[camFilterLocType]?.icon} ${camFilterLocType} <span onclick="camFilterLocType='all';camFilterSubLoc='all';camRefresh()" style="cursor:pointer;margin-left:3px;opacity:.7">×</span></div>` : ''}
    ${camFilterSite !== 'all' ? `<div style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;background:rgba(124,77,255,.08);border:1px solid rgba(124,77,255,.22);border-radius:20px;font-size:11px;color:var(--purple)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg> ${camFilterSite} <span onclick="camFilterSite='all';camFilterSubLoc='all';camRefresh()" style="cursor:pointer;margin-left:3px;opacity:.7">×</span></div>` : ''}
    ${camFilterSubLoc !== 'all' ? `<div style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;background:rgba(0,230,118,.08);border:1px solid rgba(0,230,118,.22);border-radius:20px;font-size:11px;color:var(--green)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> ${camFilterSubLoc} <span onclick="camFilterSubLoc='all';camRefresh()" style="cursor:pointer;margin-left:3px;opacity:.7">×</span></div>` : ''}
    ${camFilterStatus !== 'all' ? `<div style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;background:rgba(255,202,40,.08);border:1px solid rgba(255,202,40,.22);border-radius:20px;font-size:11px;color:var(--yellow)">${camStatusLabel(camFilterStatus)} <span onclick="camFilterStatus='all';camRefresh()" style="cursor:pointer;margin-left:3px;opacity:.7">×</span></div>` : ''}
  </div>`;
}

// ── LIVE VIEW ──────────────────────────────────────────────────────
function camViewLive() {
  const allFiltered = camGetFilteredCameras();
  const itemsPerPage = camGetItemsPerPage();
  const cameras = allFiltered.slice((camCurrentPage - 1) * itemsPerPage, camCurrentPage * itemsPerPage);

  // Extract number of columns from grid mode: e.g., '3x2' -> 3
  const [gridCols] = camGridMode.split('x').map(Number);
  const cols = gridCols || 3;

  if (camGridMode === 'list') {
    return `
    <div class="card" style="overflow:hidden">
      <div style="overflow-x:auto">
        <table>
          <thead><tr>
            <th>ID</th><th>Tên</th><th>Loại vị trí</th><th>Khu vực cụ thể</th><th>NVR</th>
            <th>Loại cam</th><th>Độ phân giải</th><th>Uptime</th><th>Trạng thái</th>
          </tr></thead>
          <tbody>
            ${cameras.map(c => `
            <tr onclick="camOpenDetail('${c.id}')" style="cursor:pointer">
              <td class="mono">${c.id}</td>
              <td><strong>${c.name}</strong><div style="font-size:10px;color:var(--muted)">${c.position}</div></td>
              <td style="font-size:12px">${CAM_LOCATION_TYPES[c.locationType]?.icon || ''} ${c.locationType}</td>
              <td style="font-size:12px;color:var(--muted)">${c.subLocation}</td>
              <td class="mono" style="font-size:11px">${c.nvr}</td>
              <td style="font-size:12px">${c.type}</td>
              <td style="font-size:12px">${c.resolution}</td>
              <td style="font-size:12px">${camUptimeStr(c.uptime)}</td>
              <td><span class="badge badge-${camStatusClass(c.status)}">${camStatusLabel(c.status)}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  const cw = `calc(${100 / cols}% - ${10 * (cols - 1) / cols}px)`;
  return `
  <div style="display:flex;flex-wrap:wrap;gap:10px">
    ${cameras.map(c => {
    const borderColor = c.status === 'online' ? 'rgba(0,200,255,.15)' : c.status === 'warning' ? 'rgba(255,202,40,.35)' : 'rgba(255,23,68,.3)';
    const locType = CAM_LOCATION_TYPES[c.locationType];
    return `
      <div onclick="camOpenDetail('${c.id}')" style="flex:0 0 ${cw};cursor:pointer;background:rgba(3,14,28,.96);border:1px solid ${borderColor};border-radius:10px;overflow:hidden;transition:all .2s"
        onmouseover="this.style.borderColor='rgba(0,200,255,.5)';this.style.transform='scale(1.012)'"
        onmouseout="this.style.borderColor='${borderColor}';this.style.transform='scale(1)'">
        <!-- Video frame -->
        <div style="aspect-ratio:16/9;overflow:hidden;position:relative;background:#030e1c">
          ${camRenderFrame(c, 'tile')}
        </div>
        <!-- Info bar -->
        <div style="padding:8px 10px">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:6px">
            <div style="min-width:0">
              <div style="font-size:11px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.name} · ${c.site}</div>
              <div style="display:flex;align-items:center;gap:5px;margin-top:2px">
                <span style="font-size:9px;padding:1px 6px;border-radius:10px;background:rgba(255,255,255,.06);color:${locType?.color || 'var(--muted)'};">${locType?.icon || ''} ${c.locationType}</span>
                <span style="font-size:9px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.position} · ${c.subLocation}</span>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:4px;flex-shrink:0">
              <div class="pulse-dot ${camStatusClass(c.status)}" style="width:6px;height:6px"></div>
              <span style="font-size:10px;color:${camStatusColor(c.status)}">${camStatusLabel(c.status)}</span>
            </div>
          </div>
        </div>
      </div>`;
  }).join('')}
  </div>`;
}

// ── NVR VIEW ───────────────────────────────────────────────────────
function camViewNvr() {
  return `
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
    ${window.CAM_DATA.nvrs.map(nvr => {
    const usedPct = Math.round(nvr.hdUsed / nvr.hdd * 100);
    const bwPct = Math.round(nvr.bandwidth / window.CAM_DATA.totalBandwidth * 100);
    const bwColor = bwPct > 85 ? 'var(--red)' : bwPct > 65 ? 'var(--yellow)' : 'var(--green)';
    const diskColor = usedPct > 85 ? 'var(--red)' : usedPct > 65 ? 'var(--yellow)' : 'var(--cyan)';
    const online = window.CAM_DATA.cameras.filter(c => nvr.cams.includes(c.id) && c.status === 'online').length;
    const warn = window.CAM_DATA.cameras.filter(c => nvr.cams.includes(c.id) && c.status === 'warning').length;
    const offline = window.CAM_DATA.cameras.filter(c => nvr.cams.includes(c.id) && c.status === 'offline').length;
    const retentionDays = Math.round(window.CAM_DATA.storageRetentionDays * (1 - usedPct / 100 * 0.3));
    return `
      <div class="card">
        <div class="card-header" style="padding:14px 18px">
          <span class="card-title" style="font-size:13px">${nvr.name}</span>
          <span class="badge badge-green" style="font-size:10px">${online + warn + offline} kênh</span>
        </div>
        <div style="padding:14px 18px">
          <div style="display:flex;gap:12px;margin-bottom:14px">
            ${[['green', online, 'Trực tuyến'], ['yellow', warn, 'Cảnh báo'], ['red', offline, 'Ngoại tuyến']].map(([c, n, l]) => `
            <div style="text-align:center;flex:1;background:rgba(${c === 'green' ? '0,230,118' : c === 'yellow' ? '255,202,40' : '255,23,68'},.06);border:1px solid rgba(${c === 'green' ? '0,230,118' : c === 'yellow' ? '255,202,40' : '255,23,68'},.18);border-radius:8px;padding:10px 6px">
              <div style="font-size:20px;font-weight:700;color:var(--${c});font-family:'Roboto Mono',monospace">${n}</div>
              <div style="font-size:10px;color:var(--muted);margin-top:2px">${l}</div>
            </div>`).join('')}
          </div>
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px">
              <span style="color:var(--muted)">Lưu trữ HDD</span>
              <span style="color:${diskColor};font-family:'Roboto Mono',monospace">${nvr.hdUsed} / ${nvr.hdd} TB (${usedPct}%)</span>
            </div>
            <div class="progress-bar" style="height:7px"><div class="progress-fill" style="width:${usedPct}%;background:${diskColor}"></div></div>
            <div style="font-size:10px;color:var(--muted);margin-top:4px">Thời gian lưu còn lại ~${retentionDays} ngày</div>
          </div>
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px">
              <span style="color:var(--muted)">Băng thông sử dụng</span>
              <span style="color:${bwColor};font-family:'Roboto Mono',monospace">${nvr.bandwidth} Mbps (${bwPct}%)</span>
            </div>
            <div class="progress-bar" style="height:7px"><div class="progress-fill" style="width:${bwPct}%;background:${bwColor}"></div></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted);padding-top:10px;border-top:1px solid var(--border)">
            <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M5 12H2"/><path d="M22 12h-3"/><path d="M12 5V2"/><path d="M12 22v-3"/><circle cx="12" cy="12" r="4"/></svg> ${nvr.channels} kênh</span><span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg> ${nvr.hdd}TB</span><span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M1 6l7.5 7.5"/><path d="M1 1l5 5"/><circle cx="10" cy="13" r="2"/><path d="M3 21l7-7"/><path d="M9 21l3-3 3 3"/><path d="M12 21V14"/></svg> ${nvr.bandwidth} Mbps</span>
          </div>
        </div>
      </div>`;
  }).join('')}
  </div>
  <div class="card" style="margin-top:16px;padding:16px 20px">
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
      <div>
        <div style="font-size:13px;font-weight:700;color:var(--text)">Tổng băng thông hệ thống camera</div>
        <div style="font-size:12px;color:var(--muted);margin-top:3px">Đường truyền riêng · Tách biệt với mạng CNTT dùng chung</div>
      </div>
      <div style="display:flex;align-items:baseline;gap:6px">
        <span style="font-size:30px;font-weight:700;color:var(--cyan);font-family:'Roboto Mono',monospace">${window.CAM_DATA.nvrs.reduce((s, n) => s + n.bandwidth, 0)}</span>
        <span style="color:var(--muted)">/</span>
        <span style="font-size:24px;color:var(--green);font-family:'Roboto Mono',monospace">${window.CAM_DATA.totalBandwidth} Mbps</span>
      </div>
    </div>
    <div class="progress-bar" style="margin-top:12px;height:8px">
      <div class="progress-fill" style="width:${Math.round(window.CAM_DATA.nvrs.reduce((s, n) => s + n.bandwidth, 0) / window.CAM_DATA.totalBandwidth * 100)}%;background:linear-gradient(90deg,var(--cyan),#0055dd)"></div>
    </div>
  </div>`;
}

// ── STORAGE VIEW ───────────────────────────────────────────────────
function camViewStorage() {
  const totalHdd = window.CAM_DATA.nvrs.reduce((s, n) => s + n.hdd, 0);
  const usedHdd = window.CAM_DATA.nvrs.reduce((s, n) => s + n.hdUsed, 0);
  const freeHdd = (totalHdd - usedHdd).toFixed(1);
  const usedPct = Math.round(usedHdd / totalHdd * 100);
  const totalCams = window.CAM_DATA.cameras.length;
  const onlineCams = window.CAM_DATA.cameras.filter(c => c.status === 'online').length;
  const avgBitrate = (window.CAM_DATA.cameras.reduce((s, c) => s + parseFloat(c.bitrate || 0), 0) / onlineCams).toFixed(1);
  const dailyGB = Math.round(parseFloat(avgBitrate) * onlineCams * 3600 * 24 / 8 / 1024);
  return `
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:16px">
      ${[{ label: 'Tổng HDD', value: `${totalHdd} TB`, sub: `${freeHdd} TB trống`, color: 'var(--cyan)' },
    { label: 'Đã dùng', value: `${usedHdd.toFixed(1)} TB`, sub: `${usedPct}% dung lượng`, color: usedPct > 80 ? 'var(--red)' : 'var(--yellow)' },
    { label: 'Lưu trữ TB', value: `${window.CAM_DATA.storageRetentionDays} ngày`, sub: 'Theo cấu hình hiện tại', color: 'var(--green)' },
    { label: 'Ghi hình/ngày', value: `~${dailyGB} GB`, sub: `${avgBitrate} Mbps avg`, color: 'var(--purple)' }
    ].map(c => `
    <div class="kpi-card" style="--accent-color:${c.color}">
      <div class="kpi-label">${c.label}</div>
      <div class="kpi-value" style="font-size:24px;color:${c.color}">${c.value}</div>
      <div class="kpi-sub">${c.sub}</div>
    </div>`).join('')}
  </div>
  <div class="card" style="margin-bottom:16px">
    <div class="card-header"><span class="card-title">Lưu trữ theo NVR</span></div>
    <div style="padding:16px;display:flex;flex-direction:column;gap:16px">
      ${window.CAM_DATA.nvrs.map(nvr => {
      const pct = Math.round(nvr.hdUsed / nvr.hdd * 100);
      const color = pct > 85 ? 'var(--red)' : pct > 65 ? 'var(--yellow)' : 'var(--cyan)';
      const retDays = Math.round(window.CAM_DATA.storageRetentionDays * nvr.hdd / 16 * (1 - pct / 100 * 0.3));
      return `<div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <div><span style="font-size:13px;font-weight:600">${nvr.id}</span><span style="font-size:11px;color:var(--muted);margin-left:8px">${nvr.cams.length} cam · ${nvr.hdd}TB</span></div>
            <div><span style="font-size:12px;font-family:'Roboto Mono',monospace;color:${color}">${nvr.hdUsed}/${nvr.hdd}TB</span><span style="font-size:10px;color:var(--muted);margin-left:8px">~${retDays}d</span></div>
          </div>
          <div class="progress-bar" style="height:10px;border-radius:5px"><div class="progress-fill" style="width:${pct}%;background:${color};border-radius:5px"></div></div>
          <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);margin-top:4px"><span>${pct}% đã dùng</span><span>${(nvr.hdd - nvr.hdUsed).toFixed(1)}TB trống</span></div>
        </div>`;
    }).join('')}
    </div>
  </div>
  <div class="card" style="padding:16px 20px">
    <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:12px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Thông tin lưu trữ hệ thống</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13px">
      ${[['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>', 'rgba(0,200,255,.04)', 'rgba(0,200,255,.08)', 'Ghi hình liên tục 24/7', `Toàn bộ ${totalCams} camera`],
    ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>', 'rgba(124,77,255,.04)', 'rgba(124,77,255,.08)', 'Tự động ghi đè khi đầy', 'Vòng lặp tự động theo NVR'],
    ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>', 'rgba(0,230,118,.04)', 'rgba(0,230,118,.08)', '04 đầu ghi NVR', `${totalHdd}TB · ${window.CAM_DATA.nvrs.reduce((s, n) => s + n.channels, 0)} kênh`],
    ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>', 'rgba(255,202,40,.04)', 'rgba(255,202,40,.08)', 'Màn hình hiển thị', '4× TV 65" + 1× TV 55"']
    ].map(([em, bg, bd, t, s]) => `
      <div style="display:flex;gap:10px;align-items:center;padding:10px;background:${bg};border-radius:8px;border:1px solid ${bd}">
        <span style="font-size:20px">${em}</span>
        <div><div style="font-weight:600">${t}</div><div style="color:var(--muted);font-size:11px">${s}</div></div>
      </div>`).join('')}
    </div>
  </div>`;
}

// ── MAIN RENDER ────────────────────────────────────────────────────
function renderCamera() {
  const camData = window.CAM_DATA;
  const totalCams = camData.cameras.length;
  const onlineCams = camData.cameras.filter(c => c.status === 'online').length;
  const warnCams = camData.cameras.filter(c => c.status === 'warning').length;
  const offlineCams = camData.cameras.filter(c => c.status === 'offline').length;

  return `
  <div class="page-header" style="margin-bottom:12px">
    <div class="page-title">
      <h1>Hệ thống Camera CCTV</h1>
      <p>Hadiwa IOC · ${totalCams} điểm camera · 04 NVR · 700 Mbps đường truyền riêng · Chi cục TL &amp; PCTT Hà Nội</p>
    </div>
    <div class="page-actions">
      <div style="display:flex;align-items:center;gap:8px;padding:5px 12px;background:rgba(0,200,255,.06);border:1px solid rgba(0,200,255,.15);border-radius:8px">
        <div class="pulse-dot green"></div>
        <span style="font-size:12px;color:var(--muted)">LIVE</span>
        <span id="camLiveClock" style="font-size:12px;font-family:'Roboto Mono',monospace;color:var(--cyan)"></span>
      </div>
    </div>
  </div>

  <!-- KPI pills -->
  <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap">
    <div style="display:flex;align-items:center;gap:7px;padding:7px 14px;background:rgba(0,230,118,.07);border:1px solid rgba(0,230,118,.2);border-radius:10px">
      <div class="pulse-dot green"></div><span style="font-size:13px;font-weight:600;color:var(--green)">${onlineCams} Online</span>
    </div>
    <div style="display:flex;align-items:center;gap:7px;padding:7px 14px;background:rgba(255,202,40,.07);border:1px solid rgba(255,202,40,.2);border-radius:10px">
      <div class="pulse-dot yellow"></div><span style="font-size:13px;font-weight:600;color:var(--yellow)">${warnCams} Cảnh báo</span>
    </div>
    <div style="display:flex;align-items:center;gap:7px;padding:7px 14px;background:rgba(255,23,68,.07);border:1px solid rgba(255,23,68,.2);border-radius:10px">
      <div class="pulse-dot red"></div><span style="font-size:13px;font-weight:600;color:var(--red)">${offlineCams} Offline</span>
    </div>
    <div style="flex:1"></div>
    <div style="display:flex;align-items:center;gap:8px;padding:7px 14px;background:rgba(124,77,255,.07);border:1px solid rgba(124,77,255,.2);border-radius:10px">
      <span style="font-size:14px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></span>
      <span style="font-size:12px;color:var(--purple);font-weight:600">${camData.displayScreens.tv65}× TV 65" + ${camData.displayScreens.tv55}× TV 55"</span>
    </div>
  </div>

  <!-- Location type quick-filters -->
  <!-- <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
    <button onclick="camFilterLocType='all';camFilterSubLoc='all';camRefresh()"
      style="padding:5px 12px;border-radius:20px;border:1px solid ${camFilterLocType === 'all' ? 'rgba(0,200,255,.4)' : 'rgba(255,255,255,.1)'};background:${camFilterLocType === 'all' ? 'rgba(0,200,255,.1)' : 'rgba(255,255,255,.03)'};color:${camFilterLocType === 'all' ? 'var(--cyan)' : 'var(--muted)'};cursor:pointer;font-size:11px;font-family:'Inter',sans-serif;transition:all .15s">
      Tất cả
    </button>
    ${Object.entries(CAM_LOCATION_TYPES).map(([name, lt]) => `
    <button onclick="camFilterLocType='${name}';camFilterSubLoc='all';camRefresh()"
      style="padding:5px 12px;border-radius:20px;border:1px solid ${camFilterLocType === name ? lt.color + '88' : 'rgba(255,255,255,.1)'};background:${camFilterLocType === name ? lt.color + '18' : 'rgba(255,255,255,.03)'};color:${camFilterLocType === name ? lt.color : 'var(--muted)'};cursor:pointer;font-size:11px;font-family:'Inter',sans-serif;transition:all .15s">
      ${lt.icon} ${name}
    </button>`).join('')}
  </div>
  -->

  <!--Tabs -->
  <div style="display:flex;align-items:center;gap:4px;margin-bottom:14px;background:rgba(255,255,255,.03);border:1px solid rgba(0,200,255,.08);border-radius:10px;padding:4px;width:fit-content">
    ${[{ id: 'live', label: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> Hình ảnh Live' }, { id: 'nvr', label: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg> Đầu ghi NVR' }, { id: 'storage', label: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg> Lưu trữ' }].map(t => `
    <button onclick="camSwitchTab('${t.id}')"
      style="padding:7px 16px;border-radius:7px;border:none;cursor:pointer;font-size:12px;font-weight:600;font-family:'Inter',sans-serif;transition:all .2s;${camActivePage === t.id ? 'background:rgba(0,200,255,.15);color:var(--cyan);border:1px solid rgba(0,200,255,.3)' : 'background:transparent;color:var(--muted);border:1px solid transparent'}">
      ${t.label}
    </button>`).join('')}
  </div>

  <!--Filters(live only) -->
  ${camActivePage === 'live' ? camRenderFilterBar() : ''}
  ${camActivePage === 'live' ? camRenderActiveFilterTags() : ''}

  <!--Content -->
  <div id="camTabContent">
    ${camActivePage === 'live' ? camViewLive() : camActivePage === 'nvr' ? camViewNvr() : camViewStorage()}
  </div>

  <!-- Detail panel -->
  <div id="camDetailModal" style="display:none;position:fixed;inset:0;z-index:600;background:rgba(0,0,0,.65);backdrop-filter:blur(6px)"
    onclick="if(event.target===this)document.getElementById('camDetailModal').style.display='none'">
    <div style="position:absolute;right:0;top:0;bottom:0;width:440px;background:var(--bg-elevated);border-left:1px solid var(--border);overflow-y:auto;animation:slideRight .25s ease">
      <div id="camDetailContent" style="padding:20px"></div>
    </div>
  </div>`;
}

window.afterRender_camera = function () {
  if (camLiveTimer) clearInterval(camLiveTimer);
  camLiveTimer = setInterval(() => {
    const el = document.getElementById('camLiveClock');
    if (el) el.textContent = new Date().toLocaleTimeString('vi-VN');
    document.querySelectorAll('[class^="cam-ts-"]').forEach(el => {
      el.textContent = new Date().toLocaleTimeString('vi-VN');
    });
  }, 1000);
};

// ── INTERACTION ────────────────────────────────────────────────────
function camSwitchTab(tab) {
  camActivePage = tab;
  const area = document.getElementById('contentArea');
  if (area) { area.innerHTML = `<div class="fade-in">${renderCamera()}</div>`; window.afterRender_camera?.(); }
}
function camRefresh() {
  const area = document.getElementById('contentArea');
  if (area) { area.innerHTML = `<div class="fade-in">${renderCamera()}</div>`; window.afterRender_camera?.(); }
}
function camResetFilters() {
  camFilterSite = 'all'; camFilterStatus = 'all'; camFilterNvr = 'all'; camFilterLocType = 'all'; camFilterSubLoc = 'all';
  camRefresh();
}

function camOpenDetail(camId) {
  const cam = window.CAM_DATA.cameras.find(c => c.id === camId);
  if (!cam) return;
  const modal = document.getElementById('camDetailModal');
  const content = document.getElementById('camDetailContent');
  if (!modal || !content) return;
  const statusColor = camStatusColor(cam.status);
  const nvrObj = window.CAM_DATA.nvrs.find(n => n.id === cam.nvr);
  const locType = CAM_LOCATION_TYPES[cam.locationType];

  content.innerHTML = `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
      <div>
        <h3 style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:3px">${cam.id} – ${cam.name}</h3>
        <div style="font-size:11px;color:var(--muted)">${cam.site} · <span style="color:${locType?.color || 'var(--muted)'}">${locType?.icon || ''} ${cam.locationType}</span> · ${cam.subLocation}</div>
      </div>
      <button onclick="document.getElementById('camDetailModal').style.display='none'"
        style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:22px;line-height:1;">&times;</button>
    </div>

    <!--Feed -->
    <div style="aspect-ratio:16/9;background:#030e1c;border-radius:10px;overflow:hidden;margin-bottom:16px;border:1px solid rgba(0,200,255,.15);position:relative">
      ${camRenderFrame(cam, 'detail')}
    </div>

    <!--Status -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding:10px 14px;background:rgba(255,255,255,.03);border-radius:9px;border:1px solid rgba(0,200,255,.07)">
      <span style="font-size:12px;color:var(--muted)">Trạng thái hiện tại</span>
      <div style="display:flex;align-items:center;gap:6px">
        <div class="pulse-dot ${camStatusClass(cam.status)}" style="width:8px;height:8px"></div>
        <span style="font-size:13px;font-weight:700;color:${statusColor}">${camStatusLabel(cam.status)}</span>
      </div>
    </div>

    <!--Details -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">
      ${[['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> Vị trí chi tiết', cam.position], ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg> Địa điểm', cam.site], ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg> Loại vị trí', `${locType?.icon || ''} ${cam.locationType}`],
    ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> Khu vực cụ thể', cam.subLocation], ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg> Loại camera', cam.type], ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="2" y1="17" x2="7" y2="17"/></svg> Độ phân giải', cam.resolution],
    ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> FPS', cam.fps + ' fps'], ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M1 6l7.5 7.5"/><path d="M1 1l5 5"/><circle cx="10" cy="13" r="2"/><path d="M3 21l7-7"/><path d="M9 21l3-3 3 3"/><path d="M12 21V14"/></svg> Bitrate', cam.bitrate + ' Mbps'], ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> IP Address', cam.ip],
    ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M5 12H2"/><path d="M22 12h-3"/><path d="M12 5V2"/><path d="M12 22v-3"/><circle cx="12" cy="12" r="4"/></svg> Kênh NVR', `${cam.nvr} Ch.${cam.channel}`], ['⏱ Uptime', camUptimeStr(cam.uptime)],
    ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg> Storage', nvrObj ? `${nvrObj.id} (${Math.round(nvrObj.hdUsed / nvrObj.hdd * 100)}% full)` : '—']
    ].map(([k, v]) => `
      <div style="padding:9px 12px;background:rgba(255,255,255,.025);border-radius:8px;border:1px solid rgba(0,200,255,.06)">
        <div style="font-size:10px;color:var(--muted);margin-bottom:3px">${k}</div>
        <div style="font-size:12px;font-weight:600;color:var(--text)">${v}</div>
      </div>`).join('')}
    </div>

    <!--Actions -->
  <div style="display:flex;gap:8px">
    <button class="btn btn-ghost btn-sm" style="flex:1" onclick="camOpenPlayback('${cam.id}')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
      Xem lại
    </button>
    <button class="btn btn-ghost btn-sm" style="flex:1" onclick="camTakePhoto('${cam.id}')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
      Chụp ảnh
    </button>
  </div>
`;
  modal.style.display = 'block';
}

function camOpenPlayback(camId) {
  const cam = window.CAM_DATA.cameras.find(c => c.id === camId);
  if (!cam) return;

  const html = `
  <div style="padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px">
        <h3 style="font-size:16px;font-weight:700">Xem lại: ${cam.name} (${cam.id})</h3>
        <button onclick="closeModal()" style="background:none;border:none;color:var(--muted);font-size:20px;cursor:pointer">&times;</button>
      </div>
      
      <!--Video Player Placeholder-->
      <div style="aspect-ratio:16/9;background:#000;border-radius:10px;position:relative;overflow:hidden;margin-bottom:15px;border:1px solid rgba(0,200,255,.2)">
        <img src="${CAM_IMAGES[cam.imageKey]}" style="width:100%;height:100%;object-fit:cover;opacity:0.6;filter:grayscale(0.5)">
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
          <div style="width:60px;height:60px;background:rgba(0,200,255,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid var(--cyan)">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--cyan)"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
        <div style="position:absolute;top:10px;left:10px;background:rgba(0,0,0,.6);padding:4px 8px;border-radius:4px;font-size:10px;font-family:'Roboto Mono',monospace">HISTORY - 01/03/2026 14:20:33</div>
      </div>

      <!--Timeline Slider-->
      <div style="margin-bottom:15px">
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);margin-bottom:5px">
          <span>14:00:00</span>
          <span style="color:var(--cyan)">14:20:33</span>
          <span>15:00:00</span>
        </div>
        <input type="range" style="width:100%;accent-color:var(--cyan);cursor:pointer">
      </div>

      <!--Controls -->
  <div style="display:flex;align-items:center;justify-content:center;gap:12px">
    <button class="btn btn-ghost btn-sm" title="Lùi 10 phút"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></svg></button>
    <button class="btn btn-ghost btn-sm" style="width:40px;height:40px;border-radius:50%;padding:0;display:flex;align-items:center;justify-content:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg></button>
    <button class="btn btn-ghost btn-sm" title="Tiếp 10 phút"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg></button>
    <div style="width:1px;height:24px;background:var(--border);margin:0 10px"></div>
    <select class="form-control" style="width:70px;height:32px;font-size:11px;padding:0 5px">
      <option>1.0x</option>
      <option>2.0x</option>
      <option>4.0x</option>
      <option>8.0x</option>
    </select>
    <button class="btn btn-primary btn-sm" onclick="showToast('Đang trích xuất video...')">Trích xuất</button>
  </div>
    </div>
  `;
  openModal(html, { width: '500px' });
}

function camTakePhoto(camId) {
  showToast(`Đã lưu ảnh chụp từ camera ${camId} vào thư viện hệ thống`);
}
