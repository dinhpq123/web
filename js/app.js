// ── APP ROUTER & CORE LOGIC (Hadiwa IOC — PCTT) ──────────────────

// [TDZ Fix]: Move MENU_TO_RBAC to the very top and use var to ensure it's hoisted
// and available even if some scripts trigger early DOMContentLoaded or navigation.
var MENU_TO_RBAC = {
  dashboard: 'dashboard',
  dieuhanh: 'pcttCommand',
  videowall: 'videowall',
  gis: 'gis',
  camera: 'camera',
  irrigationAssets: 'irrigationAssets',
  irrigationDataEntry: 'irrigationAssets',
  hydrologicalData: 'iotMonitor',
  pcttDamageReport: 'pcttCommand',
  dikeManagement: 'dikeManagement',
  dikeInspection: 'dikeManagement',
  dikePermit: 'dikePermit',
  pcttDocuments: 'pcttDocuments',
  fourOnSite: 'pcttCommand',
  pcttCommand: 'pcttCommand',
  pcttFund: 'pcttFund',
  iotMonitor: 'iotMonitor',
  earlyWarning: 'earlyWarning',
  weatherBulletin: 'weatherBulletin',
  scheduler: 'scheduler',
  reports: 'reports',
  pcttMedia: 'pcttMedia',
  aiagent: 'aiagent',
  chatbot: 'chatbot',
  datahub: 'datahub',
  hrm: 'hrm',
  log: 'log',
  workflows: 'workflows',
  settings: 'settings',
  communeReporting: 'pcttCommand',
};


// [TDZ Fix]: Initialize state at the top
let currentPage = 'dashboard';
let currentTheme = localStorage.getItem('ioc_theme') || 'light';

const MENUS = [
  // Dashboard: standalone (always visible, above all groups – no group label)
  { id: 'dashboard', label: 'Dashboard PCTT', icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },

  { group: 'Điều hành Tập trung' },
  { id: 'dieuhanh', label: 'Điều hành & Phê duyệt', icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', badge: 4, badgeDesc: 'Có 4 yêu cầu đang chờ phê duyệt' },
  { id: 'videowall', label: 'Video Wall', icon: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/>' },
  { id: 'gis', label: 'Bản đồ GIS Thủy lợi', icon: '<circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 016.93 12L12 22 5.07 14A8 8 0 0112 2z"/>' },
  { id: 'camera', label: 'Camera CCTV', icon: '<path d="M23 7L16 12 23 17 23 7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>' },

  { group: 'PH2 · CSDL Thủy lợi & Đê điều' },
  { id: 'irrigationAssets', label: 'Công trình Thủy lợi', icon: '<path d="M2 20V9l4-2 4 2V5l4-2 4 2v15h2v2H0v-2h2zm2-1h2v-2H4v2zm0-4h2v-2H4v2zm0-4h2V9H4v2zm4 8h2v-2H8v2zm0-4h2v-2H8v2zm0-4h2v-2H8v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V5h-2v2z"/>' },
  { id: 'irrigationDataEntry', label: 'Nhập liệu Vận hành TL', icon: '<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>', badge:'NEW' },
  { id: 'hydrologicalData', label: 'Quan trắc & Thủy văn', icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>', badge:'NEW' },
  { id: 'dikeManagement', label: 'Quản lý Đê điều', icon: '<path d="M3 17h18M5 17V9l7-5 7 5v8"/><line x1="9" y1="17" x2="9" y2="12"/><line x1="15" y1="17" x2="15" y2="12"/>' },
  { id: 'dikeInspection', label: 'Phân Loại Đê (PLDGHT)', icon: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>', badge:'NEW' },
  { id: 'dikePermit', label: 'Cấp phép & Vi phạm', icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' },
  { id: 'reservoirMonitor', label: 'Giám sát Hồ chứa', icon: '<path d="M3 6h18M3 12h18M3 18h18"/><path d="M12 2v4M12 18v4"/>', badge:'NEW' },

  { group: 'PH3 · Chỉ đạo PCTT' },
  { id: 'pcttDocuments', label: 'Văn bản & QĐ PCTT', icon: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>' },
  { id: 'fourOnSite', label: 'Quản lý 4 Tại chỗ', icon: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>' },
  { id: 'pcttCommand', label: 'Kịch bản Chỉ đạo', icon: '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' },
  { id: 'pcttFund', label: 'Quỹ PCTT', icon: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>' },
  { id: 'pcttDamageReport', label: 'Báo cáo Thiệt hại', icon: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>', badge:'NEW' },
  { id: 'communeReporting', label: 'Cổng Báo cáo cấp Xã', icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>', badge:'NEW' },
  { id: 'communityReports', label: 'Phản ánh Cộng đồng', icon: '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><circle cx="8" cy="10" r="1.5"/><circle cx="12" cy="10" r="1.5"/><circle cx="16" cy="10" r="1.5"/>', badge: 3, badgeDesc: 'Có 3 phản ánh chờ xử lý' },

  { group: 'PH4 · IoT & Cảnh báo sớm & Liên lạc' },
  { id: 'iotMonitor', label: 'Giám sát IoT', icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' },
  { id: 'earlyWarning', label: 'Cảnh báo sớm', icon: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>', badge: 3, badgeDesc: 'Có 3 cảnh báo chưa xử lý' },
  { id: 'weatherBulletin', label: 'Bản tin Cảnh báo', icon: '<path d="M12 2C12 2 4 10 4 14a8 8 0 0016 0C20 10 12 2 12 2z"/>' },
  { id: 'commsDevices', label: 'Hệ thống Liên lạc & Loa', icon: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M15.54 8.46a5 5 0 010 7.07"/>' },
  { id: 'scheduler', label: 'Lịch vận hành Cống/Bơm', icon: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>' },

  { group: 'PH5-6 · Báo cáo & Truyền thông' },
  { id: 'reports', label: 'Báo cáo & Thống kê', icon: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>' },
  { id: 'pcttMedia', label: 'Truyền thông PCTT', icon: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>' },

  { group: 'Trung tâm AI' },
  { id: 'aiagent', label: 'AI Agent — Nhân viên số', icon: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>' },
  { id: 'chatbot', label: 'Trợ lý AI', icon: '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>' },

  { id: 'datahub', label: 'Data Hub', icon: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>' },

  { group: 'PH7 · Quản trị Hệ thống' },
  { id: 'workflows', label: 'Workflow Builder', badge:'NEW', icon: '<path d="M5 3a2 2 0 00-2 2"/><path d="M19 3a2 2 0 012 2"/><path d="M21 19a2 2 0 01-2 2"/><path d="M5 21a2 2 0 01-2-2"/><path d="M9 3h1M9 21h1M14 3h1M14 21h1M3 9v1M21 9v1M3 14v1M21 14v1"/>' },
  { id: 'hrm', label: 'Nhân sự & Tổ chức', icon: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
  { id: 'log', label: 'Nhật ký thao tác', icon: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>' },
  { id: 'settings', label: 'Cài đặt hệ thống', icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>' },
];



const PAGE_RENDERS = {
  // Điều hành Tập trung
  dashboard: renderDashboard,
  dieuhanh: typeof renderDieuhanhPage === 'function' ? renderDieuhanhPage : () => renderDevPage('Điều hành & Phê duyệt', 'Tổng hợp yêu cầu phê duyệt, lệnh vận hành, chỉ đạo PCTT.'),
  videowall: typeof renderVideoWall === 'function' ? renderVideoWall : () => renderDevPage('Video Wall', 'Hiển thị đa màn hình: camera, bản đồ ngập lụt, dashboard realtime.'),
  gis: renderGis,
  camera: renderCamera,
  // PH2: CSDL Thủy lợi & Đê điều
  irrigationAssets: renderAssets,
  irrigationDataEntry: () => (typeof renderIrrigationDataEntry === 'function' ? renderIrrigationDataEntry() : renderDevPage('Nhập liệu Thủy lợi', 'Đang tải...')),
  hydrologicalData: () => (typeof renderHydrologicalData === 'function' ? renderHydrologicalData() : renderDevPage('Quan trắc Thủy văn', 'Đang tải...')),
  pcttDamageReport: () => (typeof renderPcttDamageReport === 'function' ? renderPcttDamageReport() : renderDevPage('Báo cáo Thiệt hại', 'Đang tải...')),
  reservoirMonitor: () => (typeof renderReservoirMonitor === 'function' ? renderReservoirMonitor() : renderDevPage('Giám sát Hồ chứa', 'Đang tải...')),
  dikeManagement: () => (typeof renderDikeManagement === 'function' ? renderDikeManagement() : renderDevPage('Quản lý Đê điều', 'Đang tải...')),
  dikeInspection: () => (typeof renderDikeInspection === 'function' ? renderDikeInspection() : renderDevPage('Phân Loại Đê PLDGHT', 'Đang tải...')),
  dikePermit: renderDikePermit,
  // PH3: Chỉ đạo PCTT
  pcttDocuments: () => (typeof renderPcttDocuments === 'function' ? renderPcttDocuments() : renderDevPage('Văn bản PCTT', 'Đang tải...')),
  documentManagement: () => (typeof renderPcttDocuments === 'function' ? renderPcttDocuments() : renderDevPage('Văn bản PCTT', 'Đang tải...')),
  communeReporting: () => (typeof renderCommuneReporting === 'function' ? renderCommuneReporting() : renderDevPage('Cổng Báo cáo cấp Xã', 'Đang tải...')),
  fourOnSite: typeof renderCrm === 'function' ? renderCrm : () => renderDevPage('Quản lý 4 Tại chỗ', 'Thống kê lực lượng, phương tiện, vật tư, hậu cần tại chỗ.'),
  pcttCommand: renderPcttCommand,
  pcttOperations: () => (typeof renderPcttOperations === 'function' ? renderPcttOperations() : renderDevPage('Trung tâm Điều hành', 'Đang tải...')),
  pcttFund: renderPcttFund,
  // PH4: IoT & Cảnh báo sớm
  iotMonitor: renderIotMonitor,
  earlyWarning: renderEarlyWarning,
  weatherBulletin: renderWeatherBulletin,
  commsDevices: typeof renderCommsDevices === 'function' ? renderCommsDevices : () => renderDevPage('Hệ thống Liên lạc & Loa', 'Quản lý cụm loa phát thanh, bộ đàm, điện thoại IP và màn hình LED.'),
  scheduler: renderScheduler,
  // PH5-6: Báo cáo & Truyền thông
  reports: renderReports,
  communityReports: typeof renderCommunityReports === 'function' ? renderCommunityReports : () => renderDevPage('Phản ánh Cộng đồng', 'Tiếp nhận và xử lý các báo cáo từ App Hadiwa Cộng đồng.'),
  pcttMedia: renderPcttMedia,
  // Trung tâm AI
  aiagent: typeof renderAiAgent === 'function' ? renderAiAgent : () => renderDevPage('AI Agent — Nhân viên số', 'Trợ lý AI đa năng hỗ trợ ra quyết định, phân tích dữ liệu PCTT.'),
  chatbot: renderChatbot,
  datahub: typeof renderDataHub === 'function' ? renderDataHub : () => renderDevPage('Data Hub', 'Kết nối và tích hợp dữ liệu từ các nguồn IoT, VNDMS, KTTV.'),
  // PH7: Quản trị
  workflows: typeof renderWorkflows === 'function' ? renderWorkflows : () => renderDevPage('Workflow Builder', 'Quản lý và tạo các quy trình tự động.'),
  hrm: renderHrm,
  log: renderLog,
  settings: renderSettings,
  // Legacy fallbacks
  scada: typeof renderScada === 'function' ? renderScada : null,
  plants: typeof renderPlants === 'function' ? renderPlants : null,
};

function renderDevPage(title, desc) {
  return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:50vh;gap:16px;text-align:center">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M10 16l4-4-4-4"/></svg>
    <div><div style="font-size:18px;font-weight:700;margin-bottom:8px">${title}</div>
    <div style="color:var(--muted);font-size:14px;max-width:400px">${desc}</div>
    <div style="margin-top:12px"><span class="badge badge-yellow">Đang phát triển</span></div></div>
  </div>`;
}

// [NOTE]: MENU_TO_RBAC and current state moved to top for initialization safety.

function buildSidebar() {
  // Apply preset once before rendering (idempotent if already applied)
  if (typeof applyPreset === 'function') applyPreset();

  const nav = document.getElementById('sidebarNav');
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

  // ── Determine if sidebar should be hub-filtered ──────────────────
  // Only SUPERADMIN sees the full sidebar. All others see only the
  // menus belonging to the hub group they selected.
  const isSuperAdmin = user?.role === 'SUPERADMIN';
  let activeHubId = isSuperAdmin ? null : (localStorage.getItem('qwc_active_hub') || null);

  // Validate saved hub ID — if it no longer exists (e.g. hub redesign), clear it
  if (activeHubId && typeof HUB_GROUPS !== 'undefined') {
    const validHubIds = HUB_GROUPS.map(g => g.id);
    if (!validHubIds.includes(activeHubId)) {
      localStorage.removeItem('qwc_active_hub');
      activeHubId = null;
    }
  }

  // Build a Set of allowed page IDs from the active hub group.
  // CRITICAL: for non-SUPERADMIN, we ALWAYS filter — never pass null (which shows everything).
  let hubAllowedPages = null;
  if (!isSuperAdmin) {
    if (activeHubId && typeof HUB_GROUPS !== 'undefined') {
      const hubGroup = HUB_GROUPS.find(g => g.id === activeHubId);
      if (hubGroup) {
        // Allow: all features in the group + dashboard + log (always useful)
        hubAllowedPages = new Set([...hubGroup.features, 'dashboard']);
      }
    }
    // If no hub is active yet (first load, no selection made), show only dashboard
    // and force the hub to open so user must pick a module.
    if (!hubAllowedPages) {
      hubAllowedPages = new Set(['dashboard']);
      // Open hub automatically after a short delay so sidebar renders first
      setTimeout(() => {
        if (typeof showModuleHub === 'function' && !document.getElementById('moduleHub')) {
          showModuleHub(page => { buildSidebar(); navigate(page); });
        }
      }, 350);
    }
  }

  const visibleGroups = new Set();
  // Pre-pass: find which groups have at least one visible item
  let lastGroup = null;
  const decisions = MENUS.map(m => {
    if (m.group) { lastGroup = m.group; return { m, show: null }; } // determined later
    const rbacKey = MENU_TO_RBAC[m.id];
    const featureOn = typeof isFeatureEnabled === 'function' ? isFeatureEnabled(m.id) : true;
    const rbacOk = !rbacKey || canView(rbacKey);
    // Hub filter: if we have an allowed set, restrict to it
    const hubOk = !hubAllowedPages || hubAllowedPages.has(m.id);
    const visible = featureOn && rbacOk && hubOk;
    if (visible) visibleGroups.add(lastGroup);
    return { m, show: visible };
  });

  nav.innerHTML = decisions.map(({ m, show }) => {
    if (m.group) {
      if (!visibleGroups.has(m.group)) return ''; // hide empty groups
      return `<div class="nav-group-label">${m.group}</div>`;
    }
    if (!show) return '';
    const badge = m.badge ? `<span class="nav-badge">${m.badge}</span>` : '';
    const badgeDot = m.badge ? `<span class="nav-badge-dot">${m.badge}</span>` : '';
    const badgeDescAttr = m.badgeDesc ? ` data-badge-desc="${m.badgeDesc}"` : '';
    return `<div class="nav-item${m.id === currentPage ? ' active' : ''}" id="nav-${m.id}" onclick="navigate('${m.id}')" data-tooltip="${m.label}"${badgeDescAttr}>
      <div style="position:relative;display:flex;align-items:center;justify-content:center;width:20px;height:20px;min-width:20px">
        <svg class="nav-icon" style="width:20px;height:20px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${m.icon}</svg>
        ${badgeDot}
      </div>
      <span class="nav-label">${m.label}</span>${badge}
    </div>`;
  }).join('');

  // ── Show active hub group label at bottom of sidebar ──────────────
  let hubBar = document.getElementById('sidebarHubBar');
  if (!isSuperAdmin && hubAllowedPages && typeof HUB_GROUPS !== 'undefined') {
    const hubGroup = HUB_GROUPS.find(g => g.id === activeHubId);
    if (!hubBar) {
      hubBar = document.createElement('div');
      hubBar.id = 'sidebarHubBar';
      hubBar.style.cssText = 'position:absolute;bottom:0;left:0;right:0;padding:10px 14px;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border-top:1px solid rgba(255,255,255,.06);display:flex;align-items:center;gap:8px;cursor:pointer;transition:background .2s';
      hubBar.title = 'Nhấn để chọn phân hệ khác';
      hubBar.onclick = () => { if (typeof showModuleHub === 'function') showModuleHub(page => { buildSidebar(); navigate(page); }); };
      document.getElementById('sidebar').style.paddingBottom = '46px';
      document.getElementById('sidebar').appendChild(hubBar);
    }
    if (hubGroup) {
      hubBar.style.color = hubGroup.color;
      hubBar.innerHTML = `<span style="opacity:.5;color:rgba(255,255,255,.4)">⊕</span> ${hubGroup.label.replace('\n',' ')}`;
    }
  } else if (hubBar) {
    hubBar.remove();
    document.getElementById('sidebar').style.paddingBottom = '';
  }

  initNavTooltips();
}


function initNavTooltips() {
  // Create or reuse tooltip div — appended to body, escapes overflow clipping
  let tip = document.getElementById('navTooltip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'navTooltip';
    tip.style.cssText = [
      'position:fixed', 'z-index:99999', 'pointer-events:none',
      'background:#1e293b', 'color:#fff',
      'border:1px solid rgba(0,200,255,.25)', 'border-radius:8px',
      'box-shadow:0 6px 24px rgba(0,0,0,.6)',
      'padding:7px 13px', 'font-size:12px', 'font-weight:500',
      "white-space:nowrap", 'display:none',
      "font-family:'Inter',sans-serif",
      'opacity:0', 'transition:opacity .15s ease'
    ].join(';');
    document.body.appendChild(tip);
  }

  const nav = document.getElementById('sidebarNav');
  if (!nav) return;

  // Use event delegation — one listener on the parent container
  // Remove previous delegated listeners to avoid double-binding on rebuild
  if (nav._tipOver) nav.removeEventListener('mouseover', nav._tipOver);
  if (nav._tipOut) nav.removeEventListener('mouseout', nav._tipOut);
  if (nav._tipClick) nav.removeEventListener('click', nav._tipClick);

  let hideTimer = null;

  nav._tipOver = (e) => {
    const item = e.target.closest('.nav-item[data-tooltip]');
    if (!item) return;
    const sidebar = document.getElementById('sidebar');
    if (!sidebar || !sidebar.classList.contains('collapsed')) { tip.style.display = 'none'; return; }

    // Cancel any pending hide
    clearTimeout(hideTimer);

    const rect = item.getBoundingClientRect();
    const label = item.dataset.tooltip || '';
    const badgeDesc = item.dataset.badgeDesc || '';

    tip.innerHTML = `<div style="font-weight:600;color:#e2e8f0;letter-spacing:.2px">${label}</div>${badgeDesc
      ? `<div style="font-size:10px;color:rgba(255,210,60,.95);margin-top:4px;display:flex;align-items:center;gap:5px">
             <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
             ${badgeDesc}</div>`
      : ''
      }`;

    tip.style.display = 'block';
    tip.style.opacity = '0';

    // Position after rendering so offsetHeight is accurate
    requestAnimationFrame(() => {
      const tipH = tip.offsetHeight;
      const top = rect.top + rect.height / 2 - tipH / 2;
      tip.style.left = (rect.right + 10) + 'px';
      tip.style.top = Math.max(8, top) + 'px';
      tip.style.opacity = '1';
    });
  };

  nav._tipOut = (e) => {
    const item = e.target.closest('.nav-item[data-tooltip]');
    if (!item) return;
    // If mouse moved to a child element of the same item, do NOT hide
    if (item.contains(e.relatedTarget)) return;
    hideTimer = setTimeout(() => {
      tip.style.opacity = '0';
      setTimeout(() => { tip.style.display = 'none'; }, 150);
    }, 80);
  };

  nav._tipClick = () => {
    tip.style.opacity = '0';
    tip.style.display = 'none';
  };

  nav.addEventListener('mouseover', nav._tipOver);
  nav.addEventListener('mouseout', nav._tipOut);
  nav.addEventListener('click', nav._tipClick);
}

function navigate(page) {
  // Safety check for initialization timing
  if (typeof MENU_TO_RBAC === 'undefined') {
    console.warn(`[Hadiwa] Navigate called for '${page}' before MENU_TO_RBAC initialization. Retrying...`);
    setTimeout(() => navigate(page), 50);
    return;
  }

  // Feature guard: redirect disabled features to dashboard
  if (typeof isFeatureEnabled === 'function' && !isFeatureEnabled(page)) {
    if (page !== 'dashboard') navigate('dashboard');
    return;
  }

  // RBAC guard: check if current user can view this page
  const rbacKey = MENU_TO_RBAC[page];
  if (rbacKey && !canView(rbacKey)) {
    showToast('Bạn không có quyền truy cập trang này', 'error');
    const container = document.getElementById('pageContent') || document.getElementById('mainContent');
    if (container) {
      container.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:50vh;text-align:center;padding:32px 16px;">
          <div style="width:64px;height:64px;border-radius:50%;background:var(--danger-soft, rgba(225,78,84,0.12));color:var(--danger, var(--danger));display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          </div>
          <h2 style="font-size:20px;font-weight:700;color:var(--text);margin-bottom:8px;">403 — Truy cập bị từ chối</h2>
          <p style="font-size:14px;color:var(--muted);max-width:440px;margin-bottom:24px;line-height:1.6;">Tài khoản của bạn không có quyền xem phân hệ hoặc trang này. Vui lòng liên hệ Quản trị viên để được cấp quyền.</p>
          <button onclick="navigate('dashboard')" style="padding:10px 24px;border-radius:8px;background:var(--primary);color:#fff;border:none;font-weight:600;cursor:pointer;box-shadow:var(--shadow);">Quay lại Dashboard</button>
        </div>
      `;
    }
    return;
  }
  currentPage = page;
  localStorage.setItem('qwc_last_page', page);
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const nav = document.getElementById('nav-' + page);
  if (nav) nav.classList.add('active');
  const menu = MENUS.find(m => m.id === page);
  document.getElementById('breadcrumb').innerHTML = `<strong>${menu ? menu.label : page}</strong>`;

  // Hide sticky chatbot on Chatbot page
  const floatingChat = document.getElementById('qwcChatbot');
  if (floatingChat) {
    if (page === 'chatbot') {
      floatingChat.style.display = 'none';
      const win = document.getElementById('qwcChatWindow');
      if (win) win.style.display = 'none';
    } else {
      floatingChat.style.display = 'flex';
    }
  }

  // Per-page full-width mode (from UI Settings)
  // NOTE: We only force-collapse when the page is explicitly in fullWidthPages.
  // We do NOT auto-expand — the sidebar state is ALWAYS driven by the user's
  // last manual choice (stored in localStorage), except for forced-full-width pages.
  try {
    const uiCfg = JSON.parse(localStorage.getItem('qwc_ui_settings') || '{}');
    const fullWidthPages = uiCfg.fullWidthPages || [];
    const sidebar = document.getElementById('sidebar');
    const mainWrapper = document.querySelector('.main-wrapper');
    if (sidebar) {
      if (fullWidthPages.includes(page)) {
        // Force collapsed for this page regardless of user setting
        sidebar.classList.add('collapsed');
        if (mainWrapper) mainWrapper.classList.add('sidebar-collapsed');
      } else {
        // Restore user's saved preference — do NOT force expand
        const userCollapsed = localStorage.getItem('qwc_sidebar_collapsed') !== 'false';
        if (userCollapsed) {
          sidebar.classList.add('collapsed');
          if (mainWrapper) mainWrapper.classList.add('sidebar-collapsed');
        } else {
          sidebar.classList.remove('collapsed');
          if (mainWrapper) mainWrapper.classList.remove('sidebar-collapsed');
        }
      }
    }
  } catch (e) { }

  const area = document.getElementById('contentArea');
  // A newly selected page must always open at its own beginning. Keeping the
  // previous page's scroll position can hide headers and primary controls.
  area.scrollTop = 0;
  area.innerHTML = '<div class="empty-state"><div class="spinner"></div><p>Đang tải...</p></div>';
  setTimeout(() => {
    const render = PAGE_RENDERS[page];
    const pageHtml = render ? render() : renderSettings();
    const filterBar = typeof renderFilterBar === 'function' ? renderFilterBar(page) : '';
    area.innerHTML = `<div class="fade-in page-view page-${page}">${filterBar}${pageHtml}</div>`;
    area.scrollTop = 0;
    if (typeof window['afterRender_' + page] === 'function') window['afterRender_' + page]();

    // ── Onboarding: track visit count and auto-start tour on first visit ──
    if (typeof OB !== 'undefined') {
      OB.trackVisit(page);
      const cfg = window.OB_CONFIG || {};
      // Check both the static config AND the per-user localStorage setting
      const autoStartEnabled = cfg.tourAutoStart !== false && localStorage.getItem('qwc_ob_autostart') !== '0';
      if (autoStartEnabled && !OB.hasSeenPage(page)) {
        setTimeout(() => {
          OB.startTour(page);
          OB.markPageSeen(page); // mark now to avoid re-triggering on re-render
        }, cfg.tourStartDelay || 700);
      }
    }
  }, 120);
  // Refresh sticky chatbot suggestions to match current page context
  if (typeof updateStickySuggestions === 'function') updateStickySuggestions('');
  // Inject contextual help chip for first N visits (onboarding)
  if (typeof OB !== 'undefined') {
    setTimeout(() => OB.injectHelpSuggestion(page), 150);
  }
}

// Initialise RBAC: populate user info in header & sidebar, guard auth
function initRbac() {
  const user = getCurrentUser();
  if (!user) { window.location.href = 'login.html'; return; }

  const roleBadgeColors = {
    SUPERADMIN: 'var(--danger)',
    SYSADMIN: 'var(--danger)',
    CHI_CUC_TRUONG: 'var(--purple)',
    DIEU_HANH: '#f59e0b',
    KY_THUAT: 'var(--info)',
    QUAN_LY_DE: 'var(--primary)',
    HR: 'var(--success)',
    VIEWER: '#718096'
  };
  const roleLabel = ROLE_LABELS[user.role] || user.role;
  const color = roleBadgeColors[user.role] || 'var(--muted)';

  // Sidebar user card
  const sAvatar = document.getElementById('sidebarAvatar');
  const sName = document.getElementById('sidebarUserName');
  const sRole = document.getElementById('sidebarUserRole');
  if (sAvatar) sAvatar.innerHTML = user.avatar || '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  if (sName) sName.textContent = user.name;
  if (sRole) {
    sRole.innerHTML = `<span style="display:inline-block;padding:1px 7px;border-radius:4px;font-size:10px;font-weight:600;color:#fff;background:${color}">${roleLabel}</span>`;
  }

  // Header user display
  const hAvatar = document.getElementById('headerAvatar');
  const hName = document.getElementById('headerUserName');
  const hRole = document.getElementById('headerUserRole');
  if (hAvatar) hAvatar.innerHTML = user.avatar || '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  if (hName) hName.textContent = user.name;
  if (hRole) {
    hRole.innerHTML = `<span style="display:inline-block;padding:1px 6px;border-radius:3px;font-size:9px;font-weight:600;color:#fff;background:${color}">${roleLabel}</span>`;
  }
}


function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('collapsed');
  const isCollapsed = sidebar.classList.contains('collapsed');
  // Persist user's manual choice so navigate() respects it
  localStorage.setItem('qwc_sidebar_collapsed', isCollapsed ? 'true' : 'false');
  const mainWrapper = document.querySelector('.main-wrapper');
  if (mainWrapper) {
    if (isCollapsed) mainWrapper.classList.add('sidebar-collapsed');
    else mainWrapper.classList.remove('sidebar-collapsed');
  }
}

// Apply sidebar state on boot — default collapsed unless user previously expanded
function initSidebarState() {
  // Default: collapsed ('true'). Only expand if user explicitly set it to 'false'.
  const userCollapsed = localStorage.getItem('qwc_sidebar_collapsed') !== 'false';
  const sidebar = document.getElementById('sidebar');
  const mainWrapper = document.querySelector('.main-wrapper');
  if (sidebar) {
    if (userCollapsed) {
      sidebar.classList.add('collapsed');
      if (mainWrapper) mainWrapper.classList.add('sidebar-collapsed');
    } else {
      sidebar.classList.remove('collapsed');
      if (mainWrapper) mainWrapper.classList.remove('sidebar-collapsed');
    }
  }
}

// Clock
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString('vi-VN');
  document.getElementById('date').textContent = now.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Alarms panel
function showAlarms() {
  const overlay = document.getElementById('alarmOverlay');
  overlay.style.display = 'block';
  document.getElementById('alarmPanelList').innerHTML = DATA.alarms.map(a => `
    <div class="alarm-item ${a.severity}">
      <div class="alarm-dot ${a.severity}"></div>
      <div class="alarm-msg">
        <div>${a.msg}</div>
        <div class="alarm-time">${a.time} — ${a.ack ? '<span style="color:var(--muted)">Đã xác nhận</span>' : '<span style="color:var(--primary);cursor:pointer" onclick="ackAlarm(\'' + a.id + '\')">Xác nhận</span>'}</div>
      </div>
    </div>`).join('');
}

function ackAlarm(id) {
  const alarm = DATA.alarms.find(a => a.id === id);
  if (alarm) { alarm.ack = true; showAlarms(); updateBadge(); }
}
function updateBadge() {
  const count = DATA.alarms.filter(a => !a.ack).length;
  document.getElementById('alarmBadge').textContent = count;
  if (count === 0) document.getElementById('alarmBadge').style.display = 'none';
}

// Modal helpers
function openModal(html, options = {}) {
  const div = document.createElement('div');
  div.className = 'modal-overlay'; div.id = 'modalMain';
  div.innerHTML = `<div class="modal-box"${options.width ? ` style="width:${options.width};max-width:min(${options.width},95vw)"` : ''}>${html}</div>`;
  // Use setTimeout to prevent the opening click event from immediately triggering the close handler
  setTimeout(() => {
    div.addEventListener('click', e => { if (e.target === div) closeModal(); });
  }, 10);
  document.body.appendChild(div);
}
function closeModal(e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const m = document.getElementById('modalMain');
  if (m) m.remove();
}

// Toast
function showToast(msg, type = 'success') {
  const icon = type === 'success'
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

  const container = document.getElementById('toast-container') || (() => {
    const c = document.createElement('div');
    c.id = 'toast-container';
    c.style.cssText = 'position:fixed;top:80px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none';
    document.body.appendChild(c);
    return c;
  })();

  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.style.cssText = 'position:relative;bottom:auto;right:auto;margin-left:auto;pointer-events:all';
  t.innerHTML = icon + '<span>' + msg + '</span>';
  container.appendChild(t);

  const duration = 4000;
  const fadeOutTime = 300;

  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(20px)';
    t.style.transition = `all ${fadeOutTime}ms ease`;
    setTimeout(() => {
      t.remove();
      if (container.children.length === 0) container.remove();
    }, fadeOutTime);
  }, duration);
}

// Shared helper functions
function statusBadge(s) {
  const m = {
    // General
    active: '<span class="badge badge-green">Đang HĐ</span>',
    inactive: '<span class="badge badge-gray">Không HĐ</span>',
    suspended: '<span class="badge badge-red">Tạm khóa</span>',
    // Incidents & Work Orders
    new: '<span class="badge badge-blue">Mới</span>',
    processing: '<span class="badge badge-yellow">Đang xử lý</span>',
    done: '<span class="badge badge-green">Hoàn thành</span>',
    pending: '<span class="badge badge-yellow">Chờ xử lý</span>',
    // Quality / business history
    ok: '<span class="badge badge-green">Bình thường</span>',
    warning: '<span class="badge badge-yellow">Cảnh báo</span>',
    critical: '<span class="badge badge-red">Nghiêm trọng</span>',
    // Stations / devices
    running: '<span class="badge badge-green">Đang chạy</span>',
    fault: '<span class="badge badge-red">Sự cố</span>',
    offline: '<span class="badge badge-gray">Ngoại tuyến</span>',
    online: '<span class="badge badge-green">Trực tuyến</span>',
    closed: '<span class="badge badge-gray">Đã đóng</span>',
  };
  return m[s] || `<span class="badge badge-gray">${s}</span>`;
}
function formatNum(n) {
  return Number(n).toLocaleString('vi-VN');
}

// Settings page
let settingsTab = 'system';
function renderSettings() {
  const allowedTabs = allowedSettingsTabs();
  const allTabs = [
    { id: 'system', label: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:5px"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>Hệ thống' },
    { id: 'security', label: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:5px"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Bảo mật' },
    { id: 'roles', label: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:5px"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>Phân quyền' },
    { id: 'dashboard', label: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:5px"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>Dashboard' },
    { id: 'notifications', label: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:5px"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>Thông báo' },
    { id: 'integrations', label: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:5px"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>Tích hợp' },
    { id: 'ui', label: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:5px"><circle cx="12" cy="12" r="10"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Giao diện' },
  ].filter(t => allowedTabs.includes(t.id));

  // Reset settingsTab if current tab no longer allowed
  if (!allowedTabs.includes(settingsTab) && allTabs.length > 0) settingsTab = allTabs[0].id;

  return `
  <div class="page-header">
    <div class="page-title"><h1>Cài đặt hệ thống</h1><p>Cấu hình, bảo mật, phân quyền và tích hợp</p></div>
    <div class="page-actions">
      <button class="btn btn-ghost btn-sm" style="display:inline-flex;align-items:center;gap:5px" onclick="showToast('Đang xuất cấu hình...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Xuất cấu hình</button>
      <button class="btn btn-primary btn-sm" style="display:inline-flex;align-items:center;gap:5px" onclick="showToast('Đã lưu toàn bộ thay đổi!')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Lưu thay đổi</button>
    </div>
  </div>
  <div class="tabs" style="margin-bottom:0">
    ${allTabs.map(t => `<button class="tab-btn ${settingsTab === t.id ? 'active' : ''}" onclick="switchSettingsTab('${t.id}')">${t.label}</button>`).join('')}
  </div>
  <div id="settingsContent" style="margin-top:16px">${getSettingsTabContent()}</div>`;
}

function switchSettingsTab(tab) {
  settingsTab = tab;
  document.querySelectorAll('.tabs .tab-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('settingsContent').innerHTML = getSettingsTabContent();
}

function getSettingsTabContent() {
  if (settingsTab === 'system') return renderSettingsSystem();
  if (settingsTab === 'security') return renderSettingsSecurity();
  if (settingsTab === 'roles') return renderSettingsRoles();
  if (settingsTab === 'dashboard') return renderSettingsDashboard();
  if (settingsTab === 'notifications') return renderSettingsNotifications();
  if (settingsTab === 'integrations') return renderSettingsIntegrations();
  if (settingsTab === 'rag') return renderSettingsRag();
  if (settingsTab === 'ui') return renderSettingsUi();
  if (settingsTab === 'aimodels') return renderSettingsAi();
  return '';
}

// ── Tab 1: HỆ THỐNG ────────────────────────────────────────────────
function renderSettingsSystem() {
  const toggle = (id, on, label) => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">
      <div><div style="font-size:13px;font-weight:500">${label}</div></div>
      <label style="position:relative;display:inline-block;width:40px;height:22px;cursor:pointer">
        <input type="checkbox" ${on ? 'checked' : ''} style="opacity:0;width:0;height:0" onchange="showToast('Cài đặt đã cập nhật!')">
        <span style="position:absolute;inset:0;background:${on ? 'var(--primary)' : 'rgba(255,255,255,.1)'};border-radius:22px;transition:.3s"><span style="position:absolute;width:16px;height:16px;background:#fff;border-radius:50%;top:3px;left:${on ? '21px' : '3px'};transition:.3s"></span></span>
      </label>
    </div>`;
  return `
  <div class="grid-2" style="margin-bottom:16px">
    <div class="card">
      <div class="card-header"><span class="card-title" style="display:inline-flex;align-items:center;gap:6px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> Thông tin hệ thống</span></div>
      <div class="card-body">
        ${[['Phiên bản', 'Hadiwa IOC v1.1.2'], ['Môi trường', 'Production'], ['Máy chủ', 'ioc.hadiwa.vn'], ['Cổng HTTPS', '443'], ['Cơ sở dữ liệu', 'PostgreSQL 15.2'], ['Bộ nhớ cache', 'Redis 7.0 (Cluster)'], ['Cập nhật lần cuối', '26/03/2026 13:00'], ['Trạng thái', '<span class="badge badge-green">Trực tuyến</span>']].map(([k, v]) => `
        <div style="display:flex;align-items:center;padding:9px 0;border-bottom:1px solid var(--border)">
          <span style="min-width:160px;color:var(--muted);font-size:12px">${k}</span>
          <span style="font-size:13px">${v}</span>
        </div>`).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title" style="display:inline-flex;align-items:center;gap:6px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> Hiệu suất realtime</span></div>
      <div class="card-body">
        ${[['CPU Server', '34%', 'var(--success)'], ['RAM sử dụng', '2.1 / 8 GB', 'var(--primary)'], ['Disk I/O', '12 MB/s', 'var(--primary)'], ['Kết nối DB', '18 / 100', 'var(--success)'], ['Uptime', '99.94% (30 ngày)', 'var(--success)'], ['Latency API', '28 ms', 'var(--success)'], ['WebSocket clients', '7 kết nối', 'var(--primary)'], ['Hàng đợi job', '0 pending', 'var(--success)']].map(([k, v, c]) => `
        <div style="display:flex;align-items:center;padding:9px 0;border-bottom:1px solid var(--border)">
          <span style="min-width:160px;color:var(--muted);font-size:12px">${k}</span>
          <span style="font-size:13px;font-family:'Roboto Mono',monospace;color:${c}">${v}</span>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <div class="grid-2" style="margin-bottom:16px">
    <div class="card">
      <div class="card-header"><span class="card-title" style="display:inline-flex;align-items:center;gap:6px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg> Chế độ vận hành</span></div>
      <div class="card-body">
        ${toggle('maintenance', false, 'Chế độ bảo trì — Khóa toàn bộ người dùng trừ Admin')}
        ${toggle('debugMode', false, 'Debug mode — Ghi log chi tiết (tăng disk I/O)')}
        ${toggle('devBanner', false, 'Hiện banner môi trường Dev/Test')}
        ${toggle('autoBackup', true, 'Tự động backup cơ sở dữ liệu hàng ngày lúc 02:00')}
        ${toggle('auditLog', true, 'Ghi nhật ký thao tác người dùng (Audit Log)')}
        ${toggle('rateLimit', true, 'Rate Limiting API — giới hạn 1000 req/phút/IP')}
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title" style="display:inline-flex;align-items:center;gap:6px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> Cấu hình chung</span></div>
      <div class="card-body">
        <div class="form-group" style="margin-bottom:12px">
          <label class="form-label">Múi giờ hệ thống</label>
          <select class="form-control">
            <option selected>Asia/Ho_Chi_Minh (GMT+7)</option>
            <option>Asia/Bangkok (GMT+7)</option>
            <option>UTC (GMT+0)</option>
          </select>
        </div>
        <div class="form-group" style="margin-bottom:12px">
          <label class="form-label">Ngôn ngữ mặc định</label>
          <select class="form-control">
            <option selected>Tiếng Việt (vi-VN)</option>
            <option>English (en-US)</option>
          </select>
        </div>
        <div class="form-group" style="margin-bottom:12px">
          <label class="form-label">Chu kỳ làm mới dữ liệu (giây)</label>
          <input class="form-control" type="number" value="30" min="5" max="300">
        </div>
        <div class="form-group">
          <label class="form-label">Giới hạn phiên đăng nhập (phút)</label>
          <input class="form-control" type="number" value="480" min="30" max="1440">
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header"><span class="card-title" style="display:inline-flex;align-items:center;gap:6px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Nhật ký hệ thống gần đây</span><button class="btn btn-ghost btn-sm" style="display:inline-flex;align-items:center;gap:5px" onclick="showToast('Đang tải file log...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Tải xuống log</button></div>
    <div style="background:rgba(0,0,0,.3);border-radius:8px;padding:12px 16px;margin:0 16px 16px;font-family:'Roboto Mono',monospace;font-size:11px;line-height:2;max-height:160px;overflow-y:auto">
      <div><span style="color:var(--success)">[INFO]</span> <span style="color:var(--muted)">28/02 02:00:01</span> Database backup completed — 243 MB</div>
      <div><span style="color:var(--primary)">[INFO]</span> <span style="color:var(--muted)">28/02 01:45:12</span> SCADA sync: 12 stations refreshed OK</div>
      <div><span style="color:var(--warning)">[WARN]</span> <span style="color:var(--muted)">28/02 01:30:55</span> DMA-03 flow sensor packet timeout (retry OK)</div>
      <div><span style="color:var(--primary)">[INFO]</span> <span style="color:var(--muted)">28/02 00:00:00</span> System v1.1.2 deployed successfully — Hadiwa IOC</div>
      <div><span style="color:var(--success)">[INFO]</span> <span style="color:var(--muted)">26/03 09:55:03</span> User admin@hadiwa.vn logged in (2FA: TOTP)</div>
      <div><span style="color:var(--danger)">[ERROR]</span> <span style="color:var(--muted)">27/02 22:10:18</span> SMS OTP gateway timeout for +84912xxx — retried OK</div>
    </div>
  </div>`;
}

// ── Tab 2: BẢO MẬT ────────────────────────────────────────────────
function renderSettingsSecurity() {
  const toggle = (id, on) => `
    <label style="position:relative;display:inline-block;width:40px;height:22px;cursor:pointer">
      <input type="checkbox" ${on ? 'checked' : ''} style="opacity:0;width:0;height:0" onchange="showToast('Cài đặt bảo mật đã cập nhật!')">
      <span style="position:absolute;inset:0;background:${on ? 'var(--primary)' : 'rgba(255,255,255,.1)'};border-radius:22px;transition:.3s"><span style="position:absolute;width:16px;height:16px;background:#fff;border-radius:50%;top:3px;left:${on ? '21px' : '3px'};transition:.3s"></span></span>
    </label>`;
  return `
  <!-- 2FA header card -->
  <div class="card" style="margin-bottom:16px">
    <div class="card-header">
      <span class="card-title" style="display:inline-flex;align-items:center;gap:6px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Bảo mật 2 lớp (2FA)</span>
      <div style="display:flex;align-items:center;gap:10px"><span style="font-size:12px;color:var(--muted)">Bắt buộc với Admin</span><span class="badge badge-green">Đang bật</span></div>
    </div>
    <div class="card-body">
      <div style="background:rgba(0,200,255,.06);border:1px solid rgba(0,200,255,.18);border-radius:10px;padding:12px 16px;margin-bottom:16px;font-size:13px">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Xác thực 2 lớp bảo vệ tài khoản ngay cả khi mật khẩu bị lộ. Hệ thống hỗ trợ <strong>4 phương thức 2FA</strong>.
      </div>
      <div class="grid-2" style="margin-bottom:16px">
        ${[{ id: 'totp', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>', name: 'Authenticator App (TOTP)', desc: 'Google/Microsoft/Authy — Mã 6 chữ số mỗi 30 giây. Không cần internet.', badge: 'Khuyến nghị', bc: 'badge-green', on: true }, { id: 'sms', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>', name: 'SMS OTP', desc: 'Gửi OTP tới SĐT đăng ký. Phụ thuộc mạng di động.', badge: 'Phổ biến', bc: 'badge-blue', on: true }, { id: 'email', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>', name: 'Email OTP', desc: 'Gửi OTP tới email công ty. Hiệu lực 5 phút.', badge: 'Dự phòng', bc: 'badge-yellow', on: true }, { id: 'zalo', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>', name: 'Zalo ZNS OTP', desc: 'Gửi qua Zalo Notification Service. Phù hợp thực tế Việt Nam.', badge: 'Mới', bc: 'badge-blue', on: false }].map(m => `
        <div style="padding:16px;border:1px solid ${m.on ? 'rgba(0,200,255,.2)' : 'var(--border)'};border-radius:10px;background:${m.on ? 'rgba(0,200,255,.04)' : 'rgba(0,0,0,.1)'}">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:22px">${m.icon}</span>
              <div><div style="font-size:13px;font-weight:600">${m.name}</div><span class="badge ${m.bc}" style="font-size:10px;margin-top:3px">${m.badge}</span></div>
            </div>
            ${toggle(m.id, m.on)}
          </div>
          <p style="font-size:12px;color:var(--muted);line-height:1.5;margin:0">${m.desc}</p>
          ${m.id === 'totp' && m.on ? `<button class="btn btn-ghost btn-sm" style="margin-top:10px;width:100%;display:inline-flex;align-items:center;justify-content:center;gap:6px" onclick="showTotpSetup()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> Xem mã QR / Cấu hình lại TOTP</button>` : ''}
        </div>`).join('')}
      </div>

      <!-- Per-user 2FA table (paginated 10/page) -->
      <div class="card" style="border:1px solid var(--border);margin-bottom:16px">
        <div class="card-header">
          <span class="card-title" style="font-size:13px">Trạng thái 2FA theo nhân viên</span>
          <span id="twoFaCount" style="font-size:12px;color:var(--muted)"></span>
        </div>
        <div class="table-wrap"><table>
          <thead><tr><th>Nhân viên</th><th>Role</th><th>Phương thức</th><th>Lần cuối</th><th>Trạng thái</th><th></th></tr></thead>
          <tbody id="twoFaTableBody"></tbody>
        </table></div>
        <div id="twoFaPagination" style="padding:10px 16px;border-top:1px solid var(--border)"></div>
      </div>

      <!-- Backup codes + Trusted devices -->
      <div class="grid-2" style="margin-bottom:0">
        <div style="padding:16px;border:1px solid var(--border);border-radius:10px">
          <div style="font-size:14px;font-weight:600;margin-bottom:8px;display:flex;align-items:center;gap:6px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> Mã khôi phục dự phòng</div>
          <p style="font-size:12px;color:var(--muted);margin-bottom:10px">Dùng khi mất thiết bị 2FA. Mỗi mã chỉ dùng 1 lần.</p>
          <div style="background:rgba(0,0,0,.3);border-radius:8px;padding:10px;font-family:'Roboto Mono',monospace;font-size:11px;color:var(--primary);margin-bottom:10px;line-height:2">8G4K-MXNQ<br>3JTW-PVHR<br>7CDB-LFAE<br>2YZS-KNQX<br>5RTU-WGJM</div>
          <button class="btn btn-ghost btn-sm" style="display:inline-flex;align-items:center;gap:5px" onclick="showToast('Đã tạo bộ mã mới!')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Tạo bộ mã mới</button>
        </div>
        <div style="padding:16px;border:1px solid var(--border);border-radius:10px">
          <div style="font-size:14px;font-weight:600;margin-bottom:8px;display:flex;align-items:center;gap:6px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> Thiết bị đã tin cậy</div>
          ${[{ name: 'Chrome / Windows 11 – PC Admin', last: '27/02/2026 22:10', cur: true }, { name: 'Chrome / Android – Mobile', last: '25/02/2026 10:30', cur: false }].map(d => `
          <div style="padding:10px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
            <div><div style="font-size:12px;font-weight:500">${d.name} ${d.cur ? '<span class="badge badge-green" style="font-size:9px">Hiện tại</span>' : ''}</div><div style="font-size:11px;color:var(--muted)">Lần cuối: ${d.last}</div></div>
            <button class="btn btn-danger btn-sm" onclick="showToast('Đã xóa thiết bị!')">Xóa</button>
          </div>`).join('')}
          <button class="btn btn-danger btn-sm" style="margin-top:10px;width:100%" onclick="showToast('Đã thu hồi tất cả!')">Xóa tất cả thiết bị</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Password Policy -->
  <div class="card">
    <div class="card-header"><span class="card-title" style="display:inline-flex;align-items:center;gap:6px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> Chính sách mật khẩu</span></div>
    <div class="card-body">
      <div class="grid-2">
        <div>
          <div class="form-group" style="margin-bottom:12px"><label class="form-label">Độ dài tối thiểu</label><input class="form-control" type="number" value="8" min="6" max="32"></div>
          <div class="form-group" style="margin-bottom:12px"><label class="form-label">Thời hạn đổi mật khẩu (ngày)</label><input class="form-control" type="number" value="90" min="30" max="365"></div>
          <div class="form-group"><label class="form-label">Số lần thử sai tối đa trước khi khóa</label><input class="form-control" type="number" value="5" min="3" max="10"></div>
        </div>
        <div>
          ${[['Bắt buộc chữ HOA', true], ['Bắt buộc chữ số', true], ['Bắt buộc ký tự đặc biệt (!@#...)', true], ['Không trùng 5 mật khẩu cũ', true], ['Khóa IP sau 10 lần thất bại', false]].map(([l, on]) => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--border)">
            <span style="font-size:13px">${l}</span>
            <label style="position:relative;display:inline-block;width:40px;height:22px;cursor:pointer">
              <input type="checkbox" ${on ? 'checked' : ''} style="opacity:0;width:0;height:0" onchange="showToast('Chính sách đã cập nhật!')">
              <span style="position:absolute;inset:0;background:${on ? 'var(--primary)' : 'rgba(255,255,255,.1)'};border-radius:22px;transition:.3s"><span style="position:absolute;width:16px;height:16px;background:#fff;border-radius:50%;top:3px;left:${on ? '21px' : '3px'};transition:.3s"></span></span>
            </label>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>

  <!-- 2FA Protected Actions -->
  <div class="card" style="margin-top:0">
    <div class="card-header" style="background:linear-gradient(135deg,rgba(0,102,255,.08),transparent);border-bottom:1px solid rgba(0,102,255,.2)">
      <span class="card-title" style="display:inline-flex;align-items:center;gap:8px;color:#60a5fa">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Actions yêu cầu Xác thực 2 lớp (2FA)
      </span>
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-size:11px;color:var(--muted)">Bật tất cả</span>
        <label style="position:relative;display:inline-block;width:40px;height:22px;cursor:pointer" title="Bật 2FA cho toàn bộ action nguy hiểm">
          <input type="checkbox" checked style="opacity:0;width:0;height:0" onchange="showToast(this.checked?'Đã bật 2FA cho tất cả actions!':'Đã tắt 2FA tổng thể — không khuyến nghị!')">
          <span style="position:absolute;inset:0;background:var(--primary);border-radius:22px;transition:.3s"><span style="position:absolute;width:16px;height:16px;background:#fff;border-radius:50%;top:3px;left:21px;transition:.3s"></span></span>
        </label>
      </div>
    </div>
    <div class="card-body" style="padding:0">
      <div style="padding:12px 18px;background:rgba(0,102,255,.06);border-bottom:1px solid rgba(0,102,255,.12);font-size:12px;color:rgba(96,165,250,.9);line-height:1.6;display:flex;gap:10px;align-items:flex-start">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;margin-top:1px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>Cấu hình các action hệ thống nào sẽ yêu cầu người dùng nhập OTP (từ Authenticator App / SMS / Email) trước khi thực thi. Áp dụng cho tất cả role được liệt kê hoặc có thể giới hạn theo role cụ thể.</span>
      </div>
      ${[
      { id: 'kpi_import', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>', name: 'Import dữ liệu KPI', desc: 'Nhập liệu chỉ số KPI kinh doanh vào hệ thống', risk: 'high', on: true, roles: 'Admin, Lãnh đạo' },
      { id: 'data_export', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>', name: 'Xuất / Export dữ liệu lớn', desc: 'Export >1000 bản ghi, báo cáo toàn hệ thống', risk: 'high', on: true, roles: 'Admin' },
      { id: 'api_key', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>', name: 'Tạo / Thu hồi API Key', desc: 'Quản lý API Key tích hợp bên ngoài', risk: 'high', on: true, roles: 'Admin' },
      { id: 'scada_ctrl', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>', name: 'Điều khiển SCADA / Van bơm', desc: 'Mở/đóng van, bật/tắt máy bơm trực tiếp', risk: 'high', on: true, roles: 'Admin, SCADA Operator' },
      { id: 'user_mgmt', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', name: 'Thêm / Xoá / Đặt lại tài khoản', 'desc': 'Quản lý tài khoản và đặt lại mật khẩu', risk: 'med', on: true, roles: 'Admin, HR' },
      { id: 'role_change', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', name: 'Thay đổi phân quyền Role', desc: 'Cập nhật quyền truy cập người dùng', risk: 'med', on: true, roles: 'Admin' },
      { id: 'settings_save', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>', name: 'Lưu cài đặt hệ thống', desc: 'Thay đổi cài đặt bảo mật, thông báo, tích hợp', risk: 'med', on: false, roles: 'Admin' },
      { id: 'alert_ack', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>', name: 'Xác nhận cảnh báo nghiêm trọng', 'desc': 'Đóng/xử lý alert mức CRITICAL', risk: 'low', on: false, roles: 'Admin, Operator' },
      { id: 'report_sign', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>', name: 'Ký duyệt báo cáo chính thức', desc: 'Phê duyệt báo cáo gửi cơ quan nhà nước', risk: 'med', on: false, roles: 'Lãnh đạo, Admin' },
    ].map(a => {
      const riskColor = a.risk === 'high' ? '#ff4444' : a.risk === 'med' ? 'var(--warning)' : 'var(--muted)';
      const riskLabel = a.risk === 'high' ? 'Rủi ro cao' : a.risk === 'med' ? 'Trung bình' : 'Thấp';
      return `<div style="padding:14px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:14px">
          <div style="font-size:20px;flex-shrink:0;width:28px;text-align:center">${a.icon}</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
              <span style="font-size:13px;font-weight:600">${a.name}</span>
              <span style="font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;background:${riskColor}22;color:${riskColor};border:1px solid ${riskColor}33">${riskLabel}</span>
            </div>
            <div style="font-size:11px;color:var(--muted)">${a.desc}</div>
            <div style="font-size:10px;color:rgba(0,200,255,.6);margin-top:3px">Áp dụng cho: <b>${a.roles}</b></div>
          </div>
          <div style="display:flex;align-items:center;gap:10px;flex-shrink:0">
            <select style="background:rgba(0,0,0,.2);border:1px solid var(--border);border-radius:6px;padding:4px 8px;font-size:11px;color:var(--muted);cursor:pointer" onchange="showToast('Đã cập nhật role cho action!')">
              <option>Tất cả roles</option>
              <option>Admin</option>
              <option>Lãnh đạo</option>
              <option>Admin, Lãnh đạo</option>
              <option>Admin, SCADA Operator</option>
            </select>
            <label style="position:relative;display:inline-block;width:40px;height:22px;cursor:pointer">
              <input type="checkbox" ${a.on ? 'checked' : ''} id="twofa_${a.id}" style="opacity:0;width:0;height:0" onchange="toggleTwofaAction('${a.id}',this)">
              <span id="twofa_track_${a.id}" style="position:absolute;inset:0;background:${a.on ? 'var(--primary)' : 'rgba(255,255,255,.1)'};border-radius:22px;transition:.3s">
                <span id="twofa_thumb_${a.id}" style="position:absolute;width:16px;height:16px;background:#fff;border-radius:50%;top:3px;left:${a.on ? '21px' : '3px'};transition:.3s"></span>
              </span>
            </label>
          </div>
        </div>`;
    }).join('')}
      <div style="padding:12px 18px;display:flex;justify-content:flex-end;gap:10px">
        <button class="btn btn-ghost btn-sm" onclick="showToast('Đã đặt lại về mặc định khuyến nghị!')">Đặt lại mặc định</button>
        <button class="btn btn-primary btn-sm" onclick="showToast('Đã lưu cài đặt Actions 2FA!')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg>
          Lưu cài đặt
        </button>
      </div>
    </div>
  </div>`;
}

function toggleTwofaAction(id, cb) {
  const track = document.getElementById('twofa_track_' + id);
  const thumb = document.getElementById('twofa_thumb_' + id);
  if (track) track.style.background = cb.checked ? 'var(--primary)' : 'rgba(255,255,255,.1)';
  if (thumb) thumb.style.left = cb.checked ? '21px' : '3px';
  showToast((cb.checked ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> Đã bật' : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0"/></svg> Đã tắt') + ' xác thực 2FA cho action này!');
}


// ── Tab 3: PHÂN QUYỀN ─────────────────────────────────────────────
function renderSettingsRoles() {
  const perms = [
    { label: 'Xem Dashboard', admin: true, dispatcher: true, operator: true, viewer: true },
    { label: 'Xem SCADA realtime', admin: true, dispatcher: true, operator: true, viewer: true },
    { label: 'Điều chỉnh van / bơm', admin: true, dispatcher: true, operator: false, viewer: false },
    { label: 'Tạo lệnh công việc', admin: true, dispatcher: true, operator: false, viewer: false },
    { label: 'Xem báo cáo', admin: true, dispatcher: true, operator: true, viewer: true },
    { label: 'Xuất dữ liệu / Excel', admin: true, dispatcher: true, operator: false, viewer: false },
    { label: 'Quản lý nhân sự', admin: true, dispatcher: false, operator: false, viewer: false },
    { label: 'Quản lý khách hàng', admin: true, dispatcher: true, operator: false, viewer: false },
    { label: 'Xem GIS bản đồ', admin: true, dispatcher: true, operator: true, viewer: true },
    { label: 'Truy cập NRW / Thất thoát', admin: true, dispatcher: true, operator: true, viewer: false },
    { label: 'Cài đặt hệ thống', admin: true, dispatcher: false, operator: false, viewer: false },
    { label: 'Quản lý phân quyền', admin: true, dispatcher: false, operator: false, viewer: false },
  ];
  return `
  <div class="grid-2" style="margin-bottom:16px">
    ${[['Admin', 'badge-red', 'Toàn quyền. Truy cập mọi tính năng, quản lý người dùng và cấu hình hệ thống.'], ['Dispatcher', 'badge-yellow', 'Điều phối vận hành. Tạo lệnh, xem SCADA, quản lý khách hàng và báo cáo.'], ['Operator', 'badge-blue', 'Vận hành. Xem dữ liệu realtime, cập nhật trạng thái nhưng không thay đổi cấu hình.'], ['Viewer', 'badge-gray', 'Chỉ xem. Truy cập dashboard và báo cáo, không thể tương tác hay tạo lệnh.']].map(([r, b, d]) => `
    <div class="card" style="padding:16px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <span class="badge ${b}" style="font-size:12px;padding:5px 14px">${r}</span>
      </div>
      <p style="font-size:13px;color:var(--muted);line-height:1.6;margin:0">${d}</p>
      <div style="margin-top:10px;font-size:12px;color:var(--muted)">${DATA.employees.filter(e => e.role === r.toLowerCase()).length} nhân viên được gán role này</div>
    </div>`).join('')}
  </div>

  <div class="card">
    <div class="card-header">
      <span class="card-title" style="display:inline-flex;align-items:center;gap:6px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg> Ma trận phân quyền</span>
      <span style="font-size:12px;color:var(--muted)">Click ô để thay đổi quyền</span>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>Tính năng</th><th style="text-align:center"><span class="badge badge-red">Admin</span></th><th style="text-align:center"><span class="badge badge-yellow">Dispatcher</span></th><th style="text-align:center"><span class="badge badge-blue">Operator</span></th><th style="text-align:center"><span class="badge badge-gray">Viewer</span></th></tr></thead>
      <tbody>${perms.map(p => `<tr>
        <td style="font-size:13px">${p.label}</td>
        ${['admin', 'dispatcher', 'operator', 'viewer'].map(r => `<td style="text-align:center"><span style="font-size:16px;cursor:pointer" onclick="showToast('Quyền ${p.label} — ${r} đã cập nhật!')" title="Click để thay đổi">${p[r] ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>'}</span></td>`).join('')}
      </tr>`).join('')}
      </tbody>
    </table></div>
  </div>`;
}

// ── Tab 4: DASHBOARD ──────────────────────────────────────────────
function renderSettingsDashboard() {
  return `
  <div class="card">
    <div class="card-header">
      <span class="card-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> Cấu hình Dashboard — Ẩn/Hiện &amp; Sắp xếp Panel</span>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost btn-sm" onclick="resetDashPanels()">↺ Mặc định</button>
        <button class="btn btn-primary btn-sm" style="display:inline-flex;align-items:center;gap:5px" onclick="saveDashPanels()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg> Lưu cấu hình</button>
      </div>
    </div>
    <div class="card-body">
      <div style="font-size:12px;color:var(--muted);margin-bottom:14px">Kéo thả để thay đổi thứ tự. Bật/tắt để ẩn hoặc hiện panel trên Dashboard.</div>
      
      <!-- Toggle Toast Notification -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:rgba(0,200,255,.04);border:1px solid rgba(0,200,255,.15);border-radius:10px;margin-bottom:16px">
        <div style="flex:1"><div style="font-size:13px;font-weight:600">Hiển thị thông báo khi làm mới</div><div style="font-size:11px;color:var(--muted)">Hiển thị "Dữ liệu Dashboard đã được cập nhật" mỗi 30s.</div></div>
        <label style="position:relative;display:inline-block;width:40px;height:22px;cursor:pointer;flex-shrink:0">
          <input type="checkbox" id="dashToastOpt" onchange="localStorage.setItem('hadiwa_dash_toast', this.checked)" style="opacity:0;width:0;height:0" ${localStorage.getItem('hadiwa_dash_toast') === 'true' ? 'checked' : ''}>
          <span style="position:absolute;inset:0;background:var(--primary);border-radius:22px;transition:.3s;background-color:inherit"><span style="position:absolute;width:16px;height:16px;background:#fff;border-radius:50%;top:3px;left:3px;transition:.3s" id="dashToastThumb"></span></span>
        </label>
        <script>
          document.getElementById('dashToastOpt').addEventListener('change', function() {
            this.nextElementSibling.style.background = this.checked ? 'var(--primary)' : 'rgba(255,255,255,.1)';
            document.getElementById('dashToastThumb').style.left = this.checked ? '21px' : '3px';
          });
          // Initial state
          document.getElementById('dashToastOpt').nextElementSibling.style.background = document.getElementById('dashToastOpt').checked ? 'var(--primary)' : 'rgba(255,255,255,.1)';
          document.getElementById('dashToastThumb').style.left = document.getElementById('dashToastOpt').checked ? '21px' : '3px';
        </script>
      </div>

      <div id="dashPanelList" style="display:flex;flex-direction:column;gap:8px">
        ${(window.dashPanelConfig || getDashPanelDefaults()).map((p, i) => `
        <div class="dash-panel-item" data-panel-id="${p.id}" draggable="true"
          ondragstart="dashDragStart(event,${i})" ondragover="dashDragOver(event)" ondrop="dashDrop(event,${i})"
          style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:${p.visible ? 'rgba(0,200,255,.04)' : 'rgba(0,0,0,.1)'};border:1px solid ${p.visible ? 'rgba(0,200,255,.15)' : 'var(--border)'};border-radius:10px;cursor:grab;transition:all .2s">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="2" style="flex-shrink:0"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          <span style="width:22px;height:22px;border-radius:6px;background:rgba(0,200,255,.12);font-size:11px;font-weight:700;color:var(--primary);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:'Roboto Mono',monospace">${i + 1}</span>
          <span style="font-size:18px;flex-shrink:0">${p.icon}</span>
          <div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:600">${p.name}</div><div style="font-size:11px;color:var(--muted)">${p.desc}</div></div>
          ${p.required ? '<span class="badge badge-gray" style="font-size:10px;flex-shrink:0">Bắt buộc</span>' : ''}
          <label style="position:relative;display:inline-block;width:40px;height:22px;cursor:pointer;flex-shrink:0">
            <input type="checkbox" ${p.visible ? 'checked' : ''} ${p.required ? 'disabled' : ''} onchange="toggleDashPanel('${p.id}',this)" style="opacity:0;width:0;height:0">
            <span style="position:absolute;inset:0;background:${p.visible ? 'var(--primary)' : 'rgba(255,255,255,.1)'};border-radius:22px;transition:.3s;opacity:${p.required ? '.5' : '1'}"><span style="position:absolute;width:16px;height:16px;background:#fff;border-radius:50%;top:3px;left:${p.visible ? '21px' : '3px'};transition:.3s"></span></span>
          </label>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}

// ── Tab 5: THÔNG BÁO ─────────────────────────────────────────────
function renderSettingsNotifications() {
  const toggle = (on) => `
    <label style="position:relative;display:inline-block;width:40px;height:22px;cursor:pointer">
      <input type="checkbox" ${on ? 'checked' : ''} style="opacity:0;width:0;height:0" onchange="showToast('Cài đặt thông báo đã cập nhật!')">
      <span style="position:absolute;inset:0;background:${on ? 'var(--primary)' : 'rgba(255,255,255,.1)'};border-radius:22px;transition:.3s"><span style="position:absolute;width:16px;height:16px;background:#fff;border-radius:50%;top:3px;left:${on ? '21px' : '3px'};transition:.3s"></span></span>
    </label>`;
  return `
  <div class="grid-2" style="margin-bottom:16px">
    <div class="card">
      <div class="card-header"><span class="card-title" style="display:inline-flex;align-items:center;gap:6px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> Kênh gửi thông báo</span></div>
      <div class="card-body">
        ${[['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> Email (SMTP)', 'smtp.hadiwa.vn:587', true], ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> SMS (VNPT BSS)', 'Gateway: api.sms.vn', true], ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> Zalo ZNS', 'OA ID: 3702xxx', false], ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> Push Web (WebSocket)', 'Native browser push', true], ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg> Webhook POST', 'Nhận sự kiện qua HTTP', false]].map(([name, desc, on]) => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--border)">
          <div><div style="font-size:13px;font-weight:500">${name}</div><div style="font-size:11px;color:var(--muted)">${desc}</div></div>
          ${toggle(on)}
        </div>`).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title" style="display:inline-flex;align-items:center;gap:6px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> Cấu hình Email (SMTP)</span></div>
      <div class="card-body">
        <div class="form-group" style="margin-bottom:10px"><label class="form-label">SMTP Host</label><input class="form-control" value="smtp.hadiwa.vn"></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Cổng</label><input class="form-control" type="number" value="587"></div>
          <div class="form-group"><label class="form-label">Mã hóa</label><select class="form-control"><option>TLS</option><option>SSL</option><option>None</option></select></div>
        </div>
        <div class="form-group" style="margin-bottom:10px"><label class="form-label">Địa chỉ gửi</label><input class="form-control" value="ioc-noreply@hadiwa.vn"></div>
        <div class="form-group" style="margin-bottom:10px"><label class="form-label">Tên hiển thị</label><input class="form-control" value="Hadiwa IOC System"></div>
        <button class="btn btn-ghost btn-sm" onclick="showToast('Đang kiểm tra kết nối SMTP...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M5 12H2"/><path d="M22 12h-3"/><path d="M12 5V2"/><path d="M12 22v-3"/><circle cx="12" cy="12" r="4"/></svg> Kiểm tra kết nối</button>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header"><span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Quy tắc gửi thông báo</span><button class="btn btn-ghost btn-sm" onclick="showToast('Đã thêm quy tắc mới!')">+ Thêm quy tắc</button></div>
    <div class="table-wrap"><table>
      <thead><tr><th>Sự kiện</th><th>Kênh</th><th>Đối tượng nhận</th><th>Ưu tiên</th><th>Trạng thái</th></tr></thead>
      <tbody>
        ${[
      ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg> Cảnh báo nghiêm trọng (Critical)', 'Email + SMS + Push', 'Admin + Dispatcher', '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--danger);vertical-align:middle"></span> Cao', true],
      ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Cảnh báo thường (Warning)', 'Email + Push', 'Dispatcher + Operator', '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--warning);vertical-align:middle"></span> TB', true],
      ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 2C12 2 4 10 4 14a8 8 0 0016 0C20 10 12 2 12 2z"/></svg> Phát hiện rò rỉ NRW', 'Email + SMS', 'Admin + Dispatcher', '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--danger);vertical-align:middle"></span> Cao', true],
      ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> Xuất hiện sự cố mới', 'Push + Email', 'Tất cả team', '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--warning);vertical-align:middle"></span> TB', true],
      ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="2" y="7" width="16" height="11" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/></svg> Mất điện trạm bơm', 'SMS + Email', 'Admin + Dispatcher', '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--danger);vertical-align:middle"></span> Cao', true],
      ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Báo cáo ngày', 'Email', 'Admin', '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--success);vertical-align:middle"></span> Thấp', true],
      ['<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 2C12 2 4 10 4 14a8 8 0 0016 0C20 10 12 2 12 2z"/></svg> Chất lượng nước vượt ngưỡng', 'Email + SMS', 'QC + Admin', '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--danger);vertical-align:middle"></span> Cao', false],
    ].map(([ev, ch, to, pri, on]) => `<tr>
          <td style="font-size:13px">${ev}</td>
          <td style="font-size:12px;color:var(--muted)">${ch}</td>
          <td style="font-size:12px">${to}</td>
          <td style="font-size:12px">${pri}</td>
          <td><span class="badge ${on ? 'badge-green' : 'badge-gray'}">${on ? 'Bật' : 'Tắt'}</span></td>
        </tr>`).join('')}
      </tbody>
    </table></div>
  </div>`;
}

// ── Tab 6: TÍCH HỢP ──────────────────────────────────────────────
function renderSettingsIntegrations() {
  return `
  <div class="grid-2" style="margin-bottom:16px">
    <div class="card">
      <div class="card-header"><span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg> API Keys</span><button class="btn btn-ghost btn-sm" onclick="showToast('Đã tạo API key mới!')">+ Tạo key</button></div>
      <div class="card-body">
        ${[
      { name: 'Dashboard Public API', key: 'qwc_pub_a7f3...d91c', scope: 'read:all', exp: 'Không hết hạn', on: true },
      { name: 'SCADA Integration Key', key: 'qwc_int_b2e8...5f0a', scope: 'read:scada write:scada', exp: '31/12/2026', on: true },
      { name: 'Webhook Signature Key', key: 'qwc_whk_c4d1...88b2', scope: 'webhook', exp: '28/08/2026', on: true },
      { name: 'Mobile App Key (deprecated)', key: 'qwc_mob_xxx...xxx', scope: 'read:basic', exp: '01/01/2026', on: false },
    ].map(k => `
        <div style="padding:12px;${k.on ? '' : 'opacity:.5'}border:1px solid ${k.on ? 'rgba(0,200,255,.18)' : 'var(--border)'};border-radius:8px;margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <div style="font-size:13px;font-weight:600">${k.name}</div>
              <div style="font-family:'Roboto Mono',monospace;font-size:11px;color:var(--primary);margin:4px 0">${k.key}</div>
              <div style="font-size:11px;color:var(--muted)">Scope: ${k.scope} · Hết hạn: ${k.exp}</div>
            </div>
            <div style="display:flex;gap:6px">
              <button class="btn btn-ghost btn-sm" onclick="showToast('Đã sao chép API key!')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></button>
              <button class="btn btn-sm" style="background:rgba(239,154,154,.08);color:#ef9a9a;border:1px solid rgba(239,154,154,.2);background:none;border:none;color:rgba(144,164,174,.45);padding:4px" onclick="showToast('Đã thu hồi key!')" title="Thu hồi"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg></button>
            </div>
          </div>
        </div>`).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> Dịch vụ bên ngoài</span></div>
      <div class="card-body">
        ${[
      { name: 'GIS / Leaflet Tiles', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>', url: 'tile.openstreetmap.org', status: 'connected', latency: '45ms' },
      { name: 'SCADA Gateway', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>', url: 'scada.hadiwa.local:8080', status: 'connected', latency: '8ms' },
      { name: 'SMS Gateway (Viettel)', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>', url: 'api.viettel-sms.vn', status: 'connected', latency: '120ms' },
      { name: 'Zalo ZNS Gateway', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>', url: 'business.openapi.zalo.me', status: 'disconnected', latency: '—' },
      { name: 'SMTP Mail Server', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>', url: 'smtp.hadiwa.vn:587', status: 'connected', latency: '25ms' },
      { name: 'Backup Storage (SFTP)', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>', url: 'backup.hadiwa.vn:22', status: 'connected', latency: '15ms' },
    ].map(s => `
        <div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border)">
          <span style="font-size:18px">${s.icon}</span>
          <div style="flex:1">
            <div style="font-size:13px;font-weight:500">${s.name}</div>
            <div style="font-size:11px;color:var(--muted);font-family:'Roboto Mono',monospace">${s.url}</div>
          </div>
          <div style="text-align:right">
            <span class="badge ${s.status === 'connected' ? 'badge-green' : 'badge-gray'}" style="font-size:10px">${s.status === 'connected' ? '● Kết nối' : '○ Mất kết nối'}</span>
            <div style="font-size:10px;color:var(--muted);margin-top:2px">${s.latency}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header"><span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg> Sao lưu &amp; Khôi phục</span><button class="btn btn-primary btn-sm" onclick="showToast('Đang tạo backup ngay...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Backup ngay</button></div>
    <div class="card-body">
      <div class="grid-2" style="margin-bottom:16px">
        <div>
          <div class="form-group" style="margin-bottom:12px"><label class="form-label">Lịch backup tự động</label><select class="form-control"><option>Hàng ngày lúc 02:00</option><option>Hàng tuần (Chủ nhật)</option><option>4 giờ/lần</option><option>Thủ công</option></select></div>
          <div class="form-group" style="margin-bottom:12px"><label class="form-label">Lưu giữ tối đa (bản)</label><input class="form-control" type="number" value="30" min="7" max="365"></div>
          <div class="form-group"><label class="form-label">Đích lưu trữ</label><select class="form-control"><option>SFTP Server nội bộ</option><option>AWS S3</option><option>Google Cloud Storage</option><option>Local Disk</option></select></div>
        </div>
        <div>
          <label class="form-label" style="margin-bottom:8px;display:block">5 bản backup gần nhất</label>
          ${[['backup_20260228_020001.sql.gz', '243 MB', '28/02/2026 02:00', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg>'], ['backup_20260227_020001.sql.gz', '241 MB', '27/02/2026 02:00', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg>'], ['backup_20260226_020001.sql.gz', '239 MB', '26/02/2026 02:00', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg>'], ['backup_20260225_020001.sql.gz', '237 MB', '25/02/2026 02:00', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg>'], ['backup_20260224_020001.sql.gz', '236 MB', '24/02/2026 02:00', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg>']].map(([name, size, date, st]) => `
          <div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--border)">
            <span style="font-size:10px;font-family:'Roboto Mono',monospace;flex:1;color:var(--muted)">${name}</span>
            <span style="font-size:10px;color:var(--muted)">${size}</span>
            <button class="btn btn-ghost btn-sm" style="font-size:10px;padding:3px 8px" onclick="showToast('Đang tải backup...')"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}



// ── Dashboard Panel Config helpers ────────────────────────────────
function getDashPanelDefaults() {
  return [
    { id: 'kpi', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>', name: 'KPI Cards', desc: '6 thẻ thống kê chính (sản lượng, trạm, sự cố...)', visible: true, required: true },
    { id: 'charts', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>', name: 'Biểu đồ sản lượng', desc: 'Sản lượng 12h + 6 tháng (2 chart)', visible: true, required: false },
    { id: 'stations', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>', name: 'Trạng thái Trạm bơm', desc: 'Danh sách trạm bơm + trạng thái realtime', visible: true, required: false },
    { id: 'heatmap', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2" style="vertical-align:middle"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>', name: 'Heatmap sự cố', desc: 'Bản đồ nhiệt sự cố theo giờ / ngày trong tuần', visible: true, required: false },
    { id: 'alarms', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>', name: 'Cảnh báo hệ thống', desc: 'Danh sách cảnh báo chưa xử lý', visible: true, required: false },
    { id: 'factories', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>', name: 'Nhà máy & Công suất', desc: 'Bảng công suất sử dụng từng nhà máy', visible: true, required: false },
    { id: 'ticker', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M1 6l7.5 7.5"/><path d="M1 1l5 5"/><circle cx="10" cy="13" r="2"/><path d="M3 21l7-7"/><path d="M9 21l3-3 3 3"/><path d="M12 21V14"/></svg>', name: 'LIVE Ticker', desc: 'Dải thông tin sự kiện realtime phía trên trang', visible: true, required: false },
  ];
}

if (!window.dashPanelConfig) window.dashPanelConfig = getDashPanelDefaults();

let dashDragSrc = null;
function dashDragStart(e, i) { dashDragSrc = i; e.dataTransfer.effectAllowed = 'move'; }
function dashDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }
function dashDrop(e, i) {
  e.preventDefault();
  if (dashDragSrc === null || dashDragSrc === i) return;
  const arr = window.dashPanelConfig;
  const [moved] = arr.splice(dashDragSrc, 1);
  arr.splice(i, 0, moved);
  dashDragSrc = null;
  document.getElementById('reportContent') ? null : navigate('settings');
}

function toggleDashPanel(id, cb) {
  const p = window.dashPanelConfig.find(x => x.id === id);
  if (p) { p.visible = cb.checked; }
  const span = cb.nextElementSibling;
  const dot = span?.querySelector('span');
  if (span) span.style.background = cb.checked ? 'var(--primary)' : 'rgba(255,255,255,.1)';
  if (dot) dot.style.left = cb.checked ? '21px' : '3px';
  const item = cb.closest('.dash-panel-item');
  if (item) {
    item.style.background = cb.checked ? 'rgba(0,200,255,.04)' : 'rgba(0,0,0,.1)';
    item.style.borderColor = cb.checked ? 'rgba(0,200,255,.15)' : 'var(--border)';
  }
}

function resetDashPanels() {
  window.dashPanelConfig = getDashPanelDefaults();
  navigate('settings');
  showToast('Đã khôi phục cấu hình Dashboard mặc định!');
}

function saveDashPanels() {
  showToast('<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Đã lưu cấu hình Dashboard! Vào Dashboard để xem thay đổi.');
}

function toggleTfa(method, checkbox) {
  showToast(`${checkbox.checked ? 'Đã bật' : 'Đã tắt'} 2FA phương thức ${method.toUpperCase()}!`);
  const span = checkbox.nextElementSibling;
  const dot = span?.querySelector('span');
  if (span) span.style.background = checkbox.checked ? 'var(--primary)' : 'rgba(255,255,255,.1)';
  if (dot) dot.style.left = checkbox.checked ? '21px' : '3px';
}

function showTotpSetup() {
  openModal(`
  <div class="modal-header"><span class="modal-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> Cấu hình TOTP – Authenticator App</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <p style="font-size:13px;color:var(--muted);margin-bottom:16px">Quét mã QR bên dưới bằng Google/Microsoft/Authy Authenticator:</p>
    <div style="text-align:center;margin:16px 0">
      <div style="width:150px;height:150px;background:#fff;border-radius:12px;margin:0 auto;padding:10px;display:flex;align-items:center;justify-content:center">
        <svg viewBox="0 0 21 21" width="130" height="130"><rect width="21" height="21" fill="white"/><rect x="1" y="1" width="7" height="7" fill="var(--bg-base)"/><rect x="2" y="2" width="5" height="5" fill="white"/><rect x="3" y="3" width="3" height="3" fill="var(--bg-base)"/><rect x="13" y="1" width="7" height="7" fill="var(--bg-base)"/><rect x="14" y="2" width="5" height="5" fill="white"/><rect x="15" y="3" width="3" height="3" fill="var(--bg-base)"/><rect x="1" y="13" width="7" height="7" fill="var(--bg-base)"/><rect x="2" y="14" width="5" height="5" fill="white"/><rect x="3" y="15" width="3" height="3" fill="var(--bg-base)"/></svg>
      </div>
      <div style="font-size:11px;color:var(--muted);margin-top:8px">Hoặc nhập thủ công:</div>
      <div style="font-family:'Roboto Mono',monospace;font-size:14px;color:var(--primary);letter-spacing:2px;margin-top:4px">JBSWY3DP EHPK3PXP</div>
    </div>
    <div style="margin-top:16px"><label class="form-label">Nhập mã xác nhận từ app để kích hoạt</label>
      <div style="display:flex;gap:8px;justify-content:center;margin-top:8px">
        ${Array(6).fill(0).map(() => `<input style="width:42px;height:50px;background:rgba(0,200,255,.04);border:1.5px solid rgba(0,200,255,.2);border-radius:8px;text-align:center;font-size:20px;font-weight:700;font-family:'Roboto Mono',monospace;color:var(--primary);outline:none;color:var(--primary)" maxlength="1" inputmode="numeric">`).join('')}
      </div>
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Hủy</button><button class="btn btn-primary" onclick="closeModal();showToast('TOTP đã được kích hoạt thành công!')">Kích hoạt TOTP</button></div>`);
}


// ── Tab: AI CHATBOT & RAG ──────────────────────────────────────────
function renderSettingsRag() {
  return `
  <div class="grid-2" style="margin-bottom:16px">
    <div class="card">
      <div class="card-header"><span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> Quản lý Tri thức (RAG Document)</span></div>
      <div class="card-body">
        <p style="font-size:13px;color:var(--muted);margin-bottom:16px">
          Tải lên tài liệu hoặc nhập đường dẫn Web để AI Chatbot học thông tin vận hành hệ thống. Hỗ trợ PDF, DOCX, CSV và URL.
        </p>
        <div style="display:flex;gap:10px">
          <button class="btn btn-primary btn-sm" onclick="showToast('Mở hộp thoại tải file...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Chọn File Upload</button>
          <button class="btn btn-ghost btn-sm" onclick="showToast('Đang quét URL...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> Nhập URL Website</button>
        </div>
        <div style="margin-top:16px;padding:16px;border:1px dashed var(--border);border-radius:8px;text-align:center;background:rgba(255,255,255,.02)">
          <div style="font-size:24px;margin-bottom:8px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg></div>
          <div style="font-size:13px;font-weight:600">Kéo thả tài liệu vào đây</div>
          <div style="font-size:11px;color:var(--muted)">Max 50MB/file. Tối đa 10,000 trang.</div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header"><span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="3" y="11" width="18" height="10" rx="2" ry="2"/><circle cx="12" cy="5" r="2"/><line x1="12" y1="7" x2="12" y2="11"/><line x1="8" y1="15" x2="8" y2="15"/><line x1="16" y1="15" x2="16" y2="15"/></svg> Cấu hình Trợ lý AI</span></div>
      <div class="card-body">
         <div class="form-group" style="margin-bottom:12px">
            <label class="form-label">Tên hiển thị Chatbot</label>
            <input type="text" class="form-control" value="Hadiwa AI">
         </div>
         <div class="form-group" style="margin-bottom:12px">
            <label class="form-label">Mô hình AI (LLM)</label>
            <select class="form-control">
              <option>Gemini 1.5 Pro (Google)</option>
              <option selected>GPT-4o (OpenAI)</option>
              <option>Claude 3.5 Sonnet (Anthropic)</option>
            </select>
         </div>
         <div class="form-group">
            <label class="form-label">System Prompt (Câu lệnh hệ thống)</label>
            <textarea class="form-control" rows="3" style="resize:vertical">Bạn là trợ lý AI thông minh của Hadiwa IOC – Chi cục Thủy lợi &amp; PCTT TP. Hà Nội. Hãy dùng thái độ chuyên nghiệp, thân thiện. Ưu tiên cung cấp số liệu giám sát thủy văn, cảnh báo thiên tai và tài liệu kỹ thuật từ RAG Database.</textarea>
         </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg> Danh sách Tài liệu đào tạo (2,104 trang)</span>
      <div style="display:flex;gap:10px">
        <input type="text" class="form-control form-control-sm" placeholder="Tìm kiếm tài liệu..." style="width:200px">
        <button class="btn btn-primary btn-sm" onclick="showToast('Đang quét và Sync dữ liệu...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Sync Data</button>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Tên tài liệu</th>
            <th>Loại</th>
            <th>Kích thước</th>
            <th>Ngày cập nhật</th>
            <th>Vector Embed</th>
            <th>Trạng thái</th>
            <th style="width:100px;text-align:right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${[
      { name: 'Quy_trinh_Xu_ly_Su_co_2026.pdf', type: 'PDF', size: '2.4 MB', date: '28/02/2026', vecs: '1,450', status: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Sẵn sàng', c: 'green' },
      { name: 'Huong_dan_SD_SCADA_Trung_tam.docx', type: 'DOCX', size: '1.1 MB', date: '25/02/2026', vecs: '840', status: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Sẵn sàng', c: 'green' },
      { name: 'https://hadiwa.vn/gioi-thieu', type: 'WEB', size: '32 KB', date: '15/03/2026', vecs: '120', status: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2" style="vertical-align:middle"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Đang quét', c: 'yellow' },
      { name: 'Quy_chuan_Nuoc_Sich.pdf', type: 'PDF', size: '8.5 MB', date: '01/01/2026', vecs: '4,200', status: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Sẵn sàng', c: 'green' }
    ].map(d => `
          <tr>
            <td style="font-weight:600;font-size:13px"><a href="#" style="color:var(--primary);text-decoration:none">${d.name}</a></td>
            <td><span class="badge badge-gray" style="font-size:10px">${d.type}</span></td>
            <td style="font-size:12px">${d.size}</td>
            <td style="font-size:12px;color:var(--muted)">${d.date}</td>
            <td style="font-size:12px;font-family:'Roboto Mono',monospace">${d.vecs} chunks</td>
            <td><span class="badge ${d.c === 'green' ? 'badge-green' : 'badge-yellow'}" style="font-size:10px">${d.status}</span></td>
            <td style="text-align:right">
              <button class="btn btn-ghost btn-sm" title="Tạo lại vector" onclick="showToast('Đang tạo lại vector embeddings...')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg></button>
              <button class="btn btn-ghost btn-sm" title="Xóa tài liệu" onclick="if(confirm('Xóa tài liệu này khỏi cơ sở dữ liệu tri thức?')) showToast('Đã xóa thành công!')"><span style="color:var(--danger)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg></span></button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

// ── THEME (DARK / LIGHT & BRAND PRESET) ───────────────────────────
function initTheme() {
  const t = localStorage.getItem('ioc_theme') || 'light';
  const brand = localStorage.getItem('ioc_brand_preset') || 'evg-emerald';

  if (window.ThemeEngine && typeof window.ThemeEngine.applyGlobalTheme === 'function') {
    window.ThemeEngine.applyGlobalTheme(brand, t);
  } else {
    if (t === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }
  updateThemeUI(t);
}

function initBrandPreset(presetId) {
  const t = localStorage.getItem('ioc_theme') || 'light';
  if (window.ThemeEngine && typeof window.ThemeEngine.applyGlobalTheme === 'function') {
    window.ThemeEngine.applyGlobalTheme(presetId, t);
  } else {
    document.body.setAttribute('data-brand-preset', presetId);
    localStorage.setItem('ioc_brand_preset', presetId);
  }
}

function setBrandPreset(presetId) {
  initBrandPreset(presetId);
}

function toggleTheme() {
  const isDarkNow = document.body.classList.contains('dark');
  const t = isDarkNow ? 'light' : 'dark';
  const brand = localStorage.getItem('ioc_brand_preset') || 'evg-emerald';

  if (window.ThemeEngine && typeof window.ThemeEngine.applyGlobalTheme === 'function') {
    window.ThemeEngine.applyGlobalTheme(brand, t);
  } else {
    if (t === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
    localStorage.setItem('ioc_theme', t);
  }
  updateThemeUI(t);
}

function updateThemeUI(t) {
  const lbl = document.getElementById('themeLabel');
  const icon = document.getElementById('themeIcon');
  if (!lbl || !icon) return;
  if (t === 'light') {
    lbl.textContent = 'Tối';
    icon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`; // moon
  } else {
    lbl.textContent = 'Sáng';
    icon.innerHTML = `
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`; // sun
  }
}

// ── MOCK WEBSOCKET SERVICE (Real-time Readiness) ───────────────────
class MockWebSocket {
  constructor() {
    this.connected = false;
    this.interval = null;
  }
  connect() {
    this.connected = true;
    this.updateUI();
    // Simulate incoming data every 5 seconds if we wanted to
    this.interval = setInterval(() => {
      // console.log("WS Data received");
    }, 5000);
  }
  disconnect() {
    this.connected = false;
    clearInterval(this.interval);
    this.updateUI();
  }
  updateUI() {
    const dot = document.getElementById('wsStatusDot');
    const txt = document.getElementById('wsStatusText');
    if (!dot || !txt) return;
    if (this.connected) {
      dot.className = 'pulse-dot green';
      dot.style.boxShadow = '0 0 8px var(--success)';
      txt.style.color = 'var(--success)';
      txt.textContent = 'WS: Connected';
    } else {
      dot.className = 'pulse-dot red';
      dot.style.boxShadow = '0 0 8px var(--danger)';
      txt.style.color = 'var(--danger)';
      txt.textContent = 'WS: Disconnected';
      showToast('<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Mất kết nối thời gian thực (WebSocket)', 4000);
    }
  }
}
window.appWS = new MockWebSocket();
function toggleMockWebSocket() {
  if (window.appWS.connected) window.appWS.disconnect();
  else {
    showToast('<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Đang kết nối lại...', 2000);
    setTimeout(() => window.appWS.connect(), 1500);
  }
}

// ── INITIALIZATION ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  try {
    // 1. Core Services
    initRbac();
    initTheme();
    console.log('[Hadiwa] Services ready');

    // 2. UI Components
    buildSidebar();
    initSidebarState();
    console.log('[Hadiwa] UI components ready');

    // 3. Routing
    const savedPage = localStorage.getItem('qwc_last_page');
    const validIds = MENUS.filter(m => m.id).map(m => m.id);
    const startPage = (savedPage && validIds.includes(savedPage)) ? savedPage : 'dashboard';

    // Show module hub on fresh login (sessionStorage flag set by login.html) or if no savedPage
    const freshLogin = sessionStorage.getItem('qwc_fresh_login') === '1';
    if (freshLogin) sessionStorage.removeItem('qwc_fresh_login'); // consume immediately
    const showHub = typeof showModuleHub === 'function' && (freshLogin || !savedPage);
    console.log('[Hadiwa] Navigating to:', startPage, '| Hub:', showHub);
    if (showHub) {
      showModuleHub((page) => navigate(page));
    } else {
      navigate(startPage);
    }
    
    // 4. Background Tasks
    updateBadge();
    updateClock();
    setInterval(updateClock, 1000);
    
    if (window.appWS) window.appWS.connect();

  } catch (err) {
    console.error('[Hadiwa] Initialization Exception:', err);
    window.onerror(err.message, 'app.js', 0, 0, err);
  }

  // Sync fullscreen button icon on external change (e.g. user presses Esc)
  document.addEventListener('fullscreenchange', _syncFsIcon);
  document.addEventListener('webkitfullscreenchange', _syncFsIcon);
});

function _syncFsIcon() {
  const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
  const exp = document.getElementById('fsIconExpand');
  const col = document.getElementById('fsIconCollapse');
  if (exp) exp.style.display = isFs ? 'none' : '';
  if (col) col.style.display = isFs ? '' : 'none';
}

function toggleFullscreen() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    const el = document.documentElement;
    try {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } catch (e) { }
  } else {
    try {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    } catch (e) { }
  }
}

// ── 2FA table paginator ────────────────────────────────────────────
let _2faPage = 1;
const _2faPerPage = 10;
const _2faMethods = ['TOTP', 'SMS', 'Email', 'Zalo', 'TOTP', 'SMS', 'TOTP', 'TOTP', 'SMS', 'Email', 'Zalo', 'TOTP', 'SMS', 'TOTP', 'SMS', 'Email', 'TOTP', 'SMS', 'Email', 'Zalo', '—', '—', '—'];
const _2faLastLogin = ['27/02 22:10', '27/02 21:45', '27/02 20:30', '27/02 19:00', '27/02 18:30', '27/02 17:00', '27/02 15:00', '27/02 14:30', '27/02 13:00', '27/02 12:00', '26/02 22:00', '26/02 20:00', '26/02 18:00', '26/02 16:00', '26/02 14:00', '26/02 12:00', '25/02 22:00', '25/02 20:00', '25/02 18:00', '25/02 16:00', '—', '—', '—'];

function render2FaTable(page) {
  _2faPage = page;
  const emps = DATA.employees;
  const total = emps.length;
  const totalPages = Math.ceil(total / _2faPerPage);
  const start = (page - 1) * _2faPerPage;
  const pageEmps = emps.slice(start, start + _2faPerPage);
  const roleBadge = { admin: 'badge-red', dispatcher: 'badge-yellow', operator: 'badge-blue', viewer: 'badge-gray' };

  const tbody = document.getElementById('twoFaTableBody');
  const countEl = document.getElementById('twoFaCount');
  const pagination = document.getElementById('twoFaPagination');
  if (!tbody) return;

  tbody.innerHTML = pageEmps.map((e, i) => {
    const idx = start + i;
    const on = e.status === 'active' && idx < 18;
    const method = on ? _2faMethods[idx] : '—';
    const last = on ? (_2faLastLogin[idx] || '—') : '—';
    const rb = roleBadge[e.role] || 'badge-gray';
    return `<tr>
      <td style="font-weight:600">${e.name}</td>
      <td><span class="badge ${rb}">${e.role}</span></td>
      <td>${on ? `<span class="badge badge-blue" style="font-size:10px">${method}</span>` : '<span class="badge badge-gray" style="font-size:10px">Chưa cài</span>'}</td>
      <td class="mono" style="font-size:11px;color:var(--muted)">${last}</td>
      <td>${on ? '<span class="badge badge-green">Đã bật</span>' : '<span class="badge badge-gray">Chưa bật</span>'}</td>
      <td><button class="btn btn-ghost btn-sm" onclick="showToast('Đã gửi yêu cầu cài 2FA!')">Yêu cầu</button></td>
    </tr>`;
  }).join('');

  if (countEl) countEl.textContent = `${start + 1}–${Math.min(start + _2faPerPage, total)} / ${total} nhân viên`;

  if (pagination) {
    const prevDisabled = page <= 1;
    const nextDisabled = page >= totalPages;
    pagination.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <span style="font-size:12px;color:var(--muted)">Trang ${page} / ${totalPages}</span>
        <div style="display:flex;gap:6px;">
          ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p =>
      `<button onclick="render2FaTable(${p})" style="min-width:30px;height:30px;border-radius:6px;border:1px solid ${p === page ? 'var(--primary)' : 'var(--border)'};background:${p === page ? 'rgba(0,200,255,.15)' : 'transparent'};color:${p === page ? 'var(--primary)' : 'var(--muted)'};font-size:12px;cursor:pointer;padding:0 6px;transition:.2s">${p}</button>`
    ).join('')}
        </div>
        <div style="display:flex;gap:6px;">
          <button onclick="render2FaTable(${page - 1})" ${prevDisabled ? 'disabled' : ''} style="padding:6px 12px;font-size:12px;border-radius:6px;border:1px solid var(--border);background:transparent;color:${prevDisabled ? 'rgba(255,255,255,.2)' : 'var(--muted)'};cursor:${prevDisabled ? 'not-allowed' : 'pointer'}">← Trước</button>
          <button onclick="render2FaTable(${page + 1})" ${nextDisabled ? 'disabled' : ''} style="padding:6px 12px;font-size:12px;border-radius:6px;border:1px solid var(--border);background:transparent;color:${nextDisabled ? 'rgba(255,255,255,.2)' : 'var(--muted)'};cursor:${nextDisabled ? 'not-allowed' : 'pointer'}">Tiếp →</button>
        </div>
      </div>`;
  }
}

// Auto-init 2FA table when switching to the security tab
const _origSwitchSettingsTab = window.switchSettingsTab;
function switchSettingsTab(tab) {
  settingsTab = tab;
  document.querySelectorAll('.tabs .tab-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('settingsContent').innerHTML = getSettingsTabContent();
  if (tab === 'security') setTimeout(() => render2FaTable(1), 50);
}

// Also auto-init when security is the default first-load tab
const _origAfterRender_settings = window.afterRender_settings;
window.afterRender_settings = function () {
  if (settingsTab === 'security') setTimeout(() => render2FaTable(1), 50);
  if (_origAfterRender_settings) _origAfterRender_settings();
};

// ── Tab: GIAO DIỆN ────────────────────────────────────────────────
function renderSettingsUi() {
  const uiCfg = JSON.parse(localStorage.getItem('qwc_ui_settings') || '{}');
  const fullWidthPages = uiCfg.fullWidthPages || [];
  const tickerSpeed = uiCfg.tickerSpeed || 'normal';
  const animEnabled = uiCfg.animEnabled !== false;

  const PAGES = [
    { id: 'dashboard', label: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> Dashboard' },
    { id: 'gis', label: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg> Bản đồ GIS' },
    { id: 'scada', label: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> SCADA' },
    { id: 'camera', label: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> Camera CCTV' },
    { id: 'videowall', label: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> Video Wall' },
    { id: 'plants', label: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg> Nhà máy' },
    { id: 'alerts', label: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> Cảnh báo' },
    { id: 'incidents', label: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Sự cố' },
    { id: 'reports', label: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Báo cáo' },
    { id: 'business', label: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Khách hàng' },
    { id: 'callcenter', label: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10a19.8 19.8 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14h0v2.92z"/></svg> Tổng đài CSKH' },
    { id: 'hrm', label: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> Nhân sự' },
    { id: 'nrw', label: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 2C12 2 4 10 4 14a8 8 0 0016 0C20 10 12 2 12 2z"/></svg> NRW Thất thoát' },
    { id: 'chatbot', label: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="3" y="11" width="18" height="10" rx="2" ry="2"/><circle cx="12" cy="5" r="2"/><line x1="12" y1="7" x2="12" y2="11"/><line x1="8" y1="15" x2="8" y2="15"/><line x1="16" y1="15" x2="16" y2="15"/></svg> AI Trợ lý' },
    { id: 'datahub', label: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg> Data Hub' },
  ];

  const FONTS = ['Inter', 'Roboto', 'Open Sans', 'Nunito', 'IBM Plex Sans', 'DM Sans'];
  const PALETTES = [
    { label: 'Ocean Blue (Mặc định)', accent: '#00c8ff', primary: '#0050cc' },
    { label: 'Emerald Green', accent: '#00e676', primary: '#00897b' },
    { label: 'Blue Intelligence', accent: '#3699FF', primary: 'var(--purple)' },
    { label: 'Sunset Orange', accent: '#ff6d00', primary: '#f59e0b' },
    { label: 'Crimson Red', accent: '#ff1744', primary: '#c62828' },
    { label: 'Monochrome', accent: '#b0bec5', primary: 'var(--muted)' },
  ];

  const curFont = uiCfg.font || 'Inter';
  const curFontSize = uiCfg.fontSize || 14;
  const curPalette = uiCfg.palette || 0;
  const sidebarOpacity = uiCfg.sidebarOpacity || 100;
  const showWsBar = uiCfg.showWsBar !== false;
  const borderRadius = uiCfg.borderRadius || 10;

  return `
  <!-- 1. Logo & Brand -->
  <div class="card" style="margin-bottom:16px">
    <div class="card-header"><span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:5px"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> Logo &amp; Thương hiệu</span></div>
    <div class="card-body">
      <div class="grid-2">
        <div>
          <div class="form-group" style="margin-bottom:12px"><label class="form-label">Tên ứng dụng</label><input class="form-control" id="uiAppName" value="Hadiwa IOC Center"></div>
          <div class="form-group" style="margin-bottom:12px"><label class="form-label">Slogan / Mô tả ngắn</label><input class="form-control" id="uiAppSlogan" value="Integrated Operations Center"></div>
          <div class="form-group"><label class="form-label">Upload Logo mới</label>
            <input type="file" id="uiLogoInput" accept="image/*" style="display:none" onchange="previewUiLogo(this)">
            <button class="btn btn-ghost btn-sm" onclick="document.getElementById('uiLogoInput').click()" style="display:inline-flex;align-items:center;gap:6px">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Chọn file logo
            </button>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px">
          <div id="uiLogoPreview" style="width:80px;height:80px;background:rgba(0,200,255,.08);border:1px solid rgba(0,200,255,.2);border-radius:12px;display:flex;align-items:center;justify-content:center;overflow:hidden">
            <img src="assets/hadiwa_logo.svg?v=20260326" style="width:100%;height:100%;object-fit:contain" onerror="this.style.display='none'">
          </div>
          <span style="font-size:11px;color:var(--muted)">Preview logo hiện tại</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 2. Color Palette (mock demo) -->
  <div class="card" style="margin-bottom:16px">
    <div class="card-header">
      <span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:5px"><circle cx="13.5" cy="6.5" r="2.5"/><path d="M17.89 17.707A7.5 7.5 0 016.5 9c0-.818.132-1.604.373-2.34M22 22l-6-6"/><path d="M2 2l20 20"/></svg> Màu sắc chủ đề</span>
      <span class="badge badge-blue" style="font-size:10px">Demo UI</span>
    </div>
    <div class="card-body">
      <p style="font-size:12px;color:var(--muted);margin-bottom:14px">Chọn bộ màu để thay đổi giao diện toàn bộ ứng dụng. Áp dụng sau khi nhấn Lưu thay đổi.</p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px">
        ${PALETTES.map((p, i) => `
        <div onclick="selectUiPalette(${i})" id="uiPalette${i}" style="padding:12px;border-radius:10px;border:2px solid ${i === curPalette ? p.accent : 'var(--border)'};background:rgba(0,0,0,.2);cursor:pointer;transition:.2s">
          <div style="display:flex;gap:8px;margin-bottom:8px">
            <div style="width:20px;height:20px;border-radius:50%;background:${p.primary}"></div>
            <div style="width:20px;height:20px;border-radius:50%;background:${p.accent}"></div>
            <div style="width:20px;height:20px;border-radius:50%;background:linear-gradient(135deg,${p.primary},${p.accent})"></div>
          </div>
          <div style="font-size:11px;color:var(--text)">${p.label}</div>
          ${i === curPalette ? '<div style="font-size:10px;color:var(--primary);margin-top:3px"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="3" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Đang dùng</div>' : ''}
        </div>`).join('')}
      </div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Màu Primary (Accent)</label><div style="display:flex;gap:8px;align-items:center"><input type="color" value="${PALETTES[curPalette].accent}" class="form-control" style="width:60px;height:38px;padding:2px;cursor:pointer" onchange="showToast('Demo: Màu accent đã thay đổi!')"><span style="font-size:12px;color:var(--muted)">${PALETTES[curPalette].accent}</span></div></div>
        <div class="form-group"><label class="form-label">Màu Sidebar</label><div style="display:flex;gap:8px;align-items:center"><input type="color" value="#040e24" class="form-control" style="width:60px;height:38px;padding:2px;cursor:pointer" onchange="showToast('Demo: Màu sidebar đã thay đổi!')"><span style="font-size:12px;color:var(--muted)">#040e24</span></div></div>
      </div>
    </div>
  </div>

  <!-- 3. Typography (mock demo) -->
  <div class="card" style="margin-bottom:16px">
    <div class="card-header">
      <span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:5px"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg> Typography &amp; Font</span>
      <span class="badge badge-blue" style="font-size:10px">Demo UI</span>
    </div>
    <div class="card-body">
      <div class="grid-2">
        <div>
          <div class="form-group" style="margin-bottom:12px">
            <label class="form-label">Font chữ chính</label>
            <select class="form-control" id="uiFontFamily" onchange="previewFont(this.value)">
              ${FONTS.map(f => `<option value="${f}" ${f === curFont ? 'selected' : ''}>${f}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Cỡ chữ cơ bản: <strong id="uiFontSizeLabel">${curFontSize}px</strong></label>
            <input type="range" min="12" max="18" value="${curFontSize}" style="width:100%" id="uiFontSize" oninput="document.getElementById('uiFontSizeLabel').textContent=this.value+'px'; showToast('Demo: Cỡ chữ '+this.value+'px')">
          </div>
        </div>
        <div style="padding:16px;background:rgba(0,0,0,.2);border-radius:10px;border:1px solid var(--border)">
          <div id="uiFontPreview" style="font-family:'${curFont}',sans-serif">
            <div style="font-size:18px;font-weight:700;margin-bottom:6px">Hadiwa IOC Center</div>
            <div style="font-size:14px;margin-bottom:4px;color:var(--muted)">Hệ thống điều hành tích hợp</div>
            <div style="font-size:12px;color:var(--muted)">Abcdefghijklmnopqrstuvwxyz 0123456789</div>
          </div>
        </div>
      </div>
      <div class="form-group" style="margin-top:12px">
        <label class="form-label">Bo góc (Border Radius): <strong id="uiBorderRadiusLabel">${borderRadius}px</strong></label>
        <input type="range" min="0" max="20" value="${borderRadius}" style="width:100%" oninput="document.getElementById('uiBorderRadiusLabel').textContent=this.value+'px'; showToast('Demo: Bo góc '+this.value+'px')">
      </div>
    </div>
  </div>

  <!-- 4. Per-page Layout (FUNCTIONAL) -->
  <div class="card" style="margin-bottom:16px">
    <div class="card-header">
      <span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:5px"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg> Layout mặc định theo trang</span>
      <span class="badge badge-green" style="font-size:10px">Functional</span>
    </div>
    <div class="card-body">
      <p style="font-size:12px;color:var(--muted);margin-bottom:14px">Chọn các trang sẽ tự động thu gọn sidebar khi mở để có nhiều không gian hiển thị hơn.</p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
        ${PAGES.map(p => {
    const isOn = fullWidthPages.includes(p.id);
    return `<label style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;border:1px solid ${isOn ? 'rgba(0,200,255,.3)' : 'var(--border)'};background:${isOn ? 'rgba(0,200,255,.05)' : 'transparent'};cursor:pointer;transition:.2s" onclick="toggleFullWidthPage('${p.id}', this)">
            <input type="checkbox" ${isOn ? 'checked' : ''} style="display:none">
            <div style="width:16px;height:16px;border-radius:4px;background:${isOn ? 'var(--primary)' : 'rgba(255,255,255,.1)'};border:1px solid ${isOn ? 'var(--primary)' : 'rgba(255,255,255,.2)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:.2s">
              ${isOn ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
            </div>
            <span style="font-size:12px">${p.label}</span>
          </label>`;
  }).join('')}
      </div>
    </div>
  </div>

  <!-- 5. Other UI Settings -->
  <div class="card">
    <div class="card-header"><span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:5px"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> Các cài đặt giao diện khác</span></div>
    <div class="card-body">
      <div class="grid-2">
        <div>
          <div style="font-size:13px;font-weight:600;margin-bottom:12px;color:var(--muted)">Live Ticker & Animations</div>
          <div style="margin-bottom:16px">
            <label class="form-label">Tốc độ Live Ticker</label>
            <div style="display:flex;gap:8px;margin-top:8px">
              ${[['slow', '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Chậm'], ['normal', '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Bình thường'], ['fast', '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg> Nhanh']].map(([v, l]) => `
              <button onclick="setTickerSpeed('${v}', this)" style="flex:1;padding:8px;font-size:12px;border-radius:8px;border:1px solid ${tickerSpeed === v ? 'var(--primary)' : 'var(--border)'};background:${tickerSpeed === v ? 'rgba(0,200,255,.1)' : 'transparent'};color:${tickerSpeed === v ? 'var(--primary)' : 'var(--muted)'};cursor:pointer;transition:.2s">${l}</button>`).join('')}
            </div>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">
            <span style="font-size:13px">Bật micro-animations</span>
            <label style="position:relative;display:inline-block;width:40px;height:22px;cursor:pointer">
              <input type="checkbox" ${animEnabled ? 'checked' : ''} style="opacity:0;width:0;height:0" onchange="saveUiSetting('animEnabled',this.checked);showToast('Cài đặt animations đã cập nhật!')">
              <span style="position:absolute;inset:0;background:${animEnabled ? 'var(--primary)' : 'rgba(255,255,255,.1)'};border-radius:22px;transition:.3s"><span style="position:absolute;width:16px;height:16px;background:#fff;border-radius:50%;top:3px;left:${animEnabled ? '21px' : '3px'};transition:.3s"></span></span>
            </label>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">
            <span style="font-size:13px">Hiển thị WebSocket status bar</span>
            <label style="position:relative;display:inline-block;width:40px;height:22px;cursor:pointer">
              <input type="checkbox" ${showWsBar ? 'checked' : ''} style="opacity:0;width:0;height:0" onchange="saveUiSetting('showWsBar',this.checked); document.querySelector('.sys-status:nth-child(2)')&&(document.querySelector('.sys-status:nth-child(2)').style.display=this.checked?'flex':'none'); showToast('WS bar '+(this.checked?'đã hiện':'đã ẩn'))">
              <span style="position:absolute;inset:0;background:${showWsBar ? 'var(--primary)' : 'rgba(255,255,255,.1)'};border-radius:22px;transition:.3s"><span style="position:absolute;width:16px;height:16px;background:#fff;border-radius:50%;top:3px;left:${showWsBar ? '21px' : '3px'};transition:.3s"></span></span>
            </label>
          </div>
        </div>
        <div>
          <div style="font-size:13px;font-weight:600;margin-bottom:12px;color:var(--muted)">Sidebar & Layout</div>
          <div class="form-group" style="margin-bottom:12px">
            <label class="form-label">Độ mờ Sidebar: <strong id="sidebarOpacityLabel">${sidebarOpacity}%</strong></label>
            <input type="range" min="70" max="100" value="${sidebarOpacity}" style="width:100%" oninput="document.getElementById('sidebarOpacityLabel').textContent=this.value+'%'; document.getElementById('sidebar').style.opacity=this.value/100; saveUiSetting('sidebarOpacity', parseInt(this.value))">
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">
            <span style="font-size:13px">Compact mode (smaller nav)</span>
            <label style="position:relative;display:inline-block;width:40px;height:22px;cursor:pointer">
              <input type="checkbox" style="opacity:0;width:0;height:0" onchange="showToast('Demo: Compact mode '+(this.checked?'bật':'tắt'))">
              <span style="position:absolute;inset:0;background:rgba(255,255,255,.1);border-radius:22px;transition:.3s"><span style="position:absolute;width:16px;height:16px;background:#fff;border-radius:50%;top:3px;left:3px;transition:.3s"></span></span>
            </label>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0">
            <span style="font-size:13px">Sticky header khi scroll</span>
            <label style="position:relative;display:inline-block;width:40px;height:22px;cursor:pointer">
              <input type="checkbox" checked style="opacity:0;width:0;height:0" onchange="showToast('Demo: Sticky header '+(this.checked?'bật':'tắt'))">
              <span style="position:absolute;inset:0;background:var(--primary);border-radius:22px;transition:.3s"><span style="position:absolute;width:16px;height:16px;background:#fff;border-radius:50%;top:3px;left:21px;transition:.3s"></span></span>
            </label>
          </div>
        </div>
      </div>

  <!-- ANIMATION SETTINGS CARD -->
  <div class="card" style="margin-bottom:16px">
    <div class="card-header">
      <span class="card-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        Hiệu ứng chuyển động
      </span>
      <span class="badge badge-blue" style="font-size:10px">Mới</span>
    </div>
    <div class="card-body">
      <p style="font-size:12px;color:var(--muted);margin-bottom:16px">Chọn kiểu animation khi chuyển giữa các yêu cầu trong modal phê duyệt. Sẽ mở rộng cho các trang khác trong phiên sau.</p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px" id="animPickerGrid">
        ${(() => {
      const cur = JSON.parse(localStorage.getItem('qwc_ui_settings') || '{}').modalAnim || 'fade';
      const ANIMS = [
        { id: 'fade', label: 'Fade', desc: 'Mờ dần nhẹ nhàng', icon: '<circle cx="12" cy="12" r="8" opacity=".4"/><circle cx="12" cy="12" r="4"/>' },
        { id: 'flip', label: 'Flip Book', desc: 'Lật trang 3D', icon: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 9h6M9 13h6M9 17h4"/>' },
        { id: 'slide', label: 'Slide ←', desc: 'Trượt sang trái', icon: '<polyline points="15 18 9 12 15 6"/><line x1="20" y1="12" x2="9" y2="12"/>' },
        { id: 'slideup', label: 'Slide ↑', desc: 'Trượt lên trên', icon: '<polyline points="18 15 12 9 6 15"/><line x1="12" y1="20" x2="12" y2="9"/>' },
        { id: 'zoom', label: 'Zoom', desc: 'Phóng to/thu nhỏ', icon: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>' },
        { id: 'none', label: 'Không', desc: 'Chuyển ngay tức', icon: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>' },
      ];
      return ANIMS.map(a => {
        const sel = a.id === cur;
        return `<div id="animOpt_${a.id}" onclick="selectModalAnim('${a.id}')" style="padding:14px;border-radius:10px;border:2px solid ${sel ? 'var(--primary)' : 'rgba(255,255,255,.1)'};background:${sel ? 'rgba(0,200,255,.08)' : 'rgba(0,0,0,.2)'};cursor:pointer;transition:.2s;text-align:center">
              <div style="width:40px;height:40px;background:${sel ? 'rgba(0,200,255,.12)' : 'rgba(255,255,255,.05)'};border-radius:10px;display:flex;align-items:center;justify-content:center;margin:0 auto 8px">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${sel ? 'var(--primary)' : 'var(--muted)'}" stroke-width="2">${a.icon}</svg>
              </div>
              <div style="font-size:12px;font-weight:700;color:${sel ? 'var(--primary)' : 'var(--text)'}">${a.label}</div>
              <div style="font-size:10px;color:var(--muted);margin-top:3px">${a.desc}</div>
              ${sel ? '<div style="font-size:9px;color:var(--primary);margin-top:4px;font-weight:700"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="3" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Đang dùng</div>' : ''}
            </div>`;
      }).join('');
    })()}
      </div>
      <div style="padding:10px 14px;background:rgba(0,102,255,.06);border:1px solid rgba(0,102,255,.15);border-radius:8px;font-size:12px;color:rgba(96,165,250,.9);display:flex;align-items:center;gap:8px">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        Chọn animation áp dụng ngay, không cần nhấn Lưu.
      </div>
    </div>
  </div>
  <!-- 6. ONBOARDING SETTINGS CARD (FUNCTIONAL) -->
  ${(() => {
      const obEnabled = localStorage.getItem('qwc_ob_enabled') !== '0';
      const obAutoStart = localStorage.getItem('qwc_ob_autostart') !== '0';
      const obVisits = parseInt(localStorage.getItem('qwc_ob_visits') || (window.OB_CONFIG && window.OB_CONFIG.chatbotHelpVisits) || '5', 10);
      const helpToggle = (id, checked, onLabel, offLabel, onChange) => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border)">
        <div>
          <div style="font-size:13px;font-weight:600">${onLabel}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">${offLabel}</div>
        </div>
        <label style="position:relative;display:inline-block;width:40px;height:22px;cursor:pointer">
          <input type="checkbox" id="${id}" ${checked ? 'checked' : ''} style="opacity:0;width:0;height:0" onchange="${onChange}">
          <span style="position:absolute;inset:0;border-radius:22px;transition:.3s;background:${checked ? 'var(--primary)' : 'rgba(255,255,255,.12)'}">
            <span style="position:absolute;width:16px;height:16px;background:#fff;border-radius:50%;top:3px;transition:.3s;left:${checked ? '21px' : '3px'}"></span>
          </span>
        </label>
      </div>`;
      return `
    <div class="card" style="margin-bottom:16px;border:1px solid rgba(0,200,255,.15)">
      <div class="card-header" style="background:rgba(0,200,255,.04)">
        <span class="card-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle">
            <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
          </svg>
          Onboarding &amp; Hướng dẫn sử dụng
        </span>
        <span class="badge badge-green" style="font-size:10px">Functional</span>
      </div>
      <div class="card-body">
        <p style="font-size:12px;color:var(--muted);margin-bottom:4px">Kiểm soát tính năng hướng dẫn tự động khi người dùng lần đầu vào mỗi trang.</p>

        <!-- Master toggle -->
        ${helpToggle('obMasterToggle', obEnabled,
        'Bật tính năng Onboarding',
        'Hiển thị tour hướng dẫn và chip chatbot hỗ trợ khi vào trang mới',
        "obApplySetting('qwc_ob_enabled', this.checked ? '1' : '0', 'obMasterToggle', 'obSubSettings')"
      )}

        <!-- Sub-settings: only active when master is ON -->
        <div id="obSubSettings" style="opacity:${obEnabled ? 1 : 0.38};pointer-events:${obEnabled ? 'all' : 'none'};transition:.2s">
          <!-- Auto-start tour -->
          ${helpToggle('obAutoStart', obAutoStart,
        'Tự động khởi chạy tour khi vào trang lần đầu',
        'Nếu tắt, tour vẫn có thể bắt đầu từ chip chatbot',
        "obApplySetting('qwc_ob_autostart', this.checked ? '1' : '0')"
      )}

          <!-- Chatbot help visits -->
          <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border)">
            <div>
              <div style="font-size:13px;font-weight:600">Số lần hiển thị chip "Hướng dẫn trang này"</div>
              <div style="font-size:11px;color:var(--muted);margin-top:2px">Chip xuất hiện trong <strong id="obVisitsLabel">${obVisits}</strong> lần vào đầu tiên mỗi trang</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <button onclick="obAdjustVisits(-1)" style="width:28px;height:28px;border-radius:6px;border:1px solid var(--border);background:rgba(255,255,255,.05);color:var(--text);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center">−</button>
              <span style="font-size:15px;font-weight:700;color:var(--primary);min-width:24px;text-align:center" id="obVisitsCounter">${obVisits}</span>
              <button onclick="obAdjustVisits(1)" style="width:28px;height:28px;border-radius:6px;border:1px solid var(--border);background:rgba(255,255,255,.05);color:var(--text);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center">+</button>
            </div>
          </div>

          <!-- Reset tour history -->
          <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0">
            <div>
              <div style="font-size:13px;font-weight:600">Xóa lịch sử đã xem hướng dẫn</div>
              <div style="font-size:11px;color:var(--muted);margin-top:2px">Tour và chip sẽ hiển thị lại như lần đầu sử dụng</div>
            </div>
            <button onclick="obResetHistory()" class="btn btn-ghost btn-sm" style="display:inline-flex;align-items:center;gap:6px;border-color:rgba(255,202,40,.3);color:var(--warning)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
              </svg>
              Đặt lại
            </button>
          </div>
        </div>
      </div>
    </div>`;
    })()}

      <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border);display:flex;gap:10px">

        <button class="btn btn-primary btn-sm" onclick="saveAllUiSettings()" style="display:inline-flex;align-items:center;gap:6px">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Lưu & Áp dụng
        </button>
        <button class="btn btn-ghost btn-sm" onclick="resetUiSettings()">Đặt lại mặc định</button>
      </div>
    </div>
  </div>`;
}

// ── UI Settings helper JS ─────────────────────────────────────────
let _uiSettingsCache = JSON.parse(localStorage.getItem('qwc_ui_settings') || '{}');

// ── Modal Animation Engine ────────────────────────────────────────
function getModalAnim() {
  return JSON.parse(localStorage.getItem('qwc_ui_settings') || '{}').modalAnim || 'fade';
}

function selectModalAnim(id) {
  const cfg = JSON.parse(localStorage.getItem('qwc_ui_settings') || '{}');
  cfg.modalAnim = id;
  localStorage.setItem('qwc_ui_settings', JSON.stringify(cfg));
  // Re-highlight grid
  document.querySelectorAll('[id^="animOpt_"]').forEach(el => {
    const sel = el.id === 'animOpt_' + id;
    el.style.borderColor = sel ? 'var(--primary)' : 'rgba(255,255,255,.1)';
    el.style.background = sel ? 'rgba(0,200,255,.08)' : 'rgba(0,0,0,.2)';
  });
  // Preview the chosen animation on the grid item
  const preview = document.getElementById('animOpt_' + id);
  if (preview) { preview.style.transform = 'scale(1.04)'; setTimeout(() => preview.style.transform = '', 200); }
  showToast('Hiệu ứng đã chọn: ' + id.toUpperCase());
}

/**
 * Apply modal anim style to a .modal-box element when swapping its content.
 * @param {HTMLElement} box   — the .modal-box DOM element
 * @param {Function}    swap  — callback that updates box.innerHTML
 */
function applyModalAnimation(box, swap) {
  const anim = getModalAnim();
  box.style.transition = '';
  if (anim === 'none') { swap(); return; }
  if (anim === 'fade') {
    box.style.transition = 'opacity .15s ease';
    box.style.opacity = '0';
    setTimeout(() => { swap(); requestAnimationFrame(() => { box.style.opacity = '1'; }); }, 150);
  } else if (anim === 'flip') {
    box.style.transition = 'transform .18s ease, opacity .18s ease';
    box.style.transform = 'perspective(900px) rotateY(90deg)';
    box.style.opacity = '0.3';
    setTimeout(() => {
      swap();
      requestAnimationFrame(() => {
        box.style.transform = 'perspective(900px) rotateY(0deg)';
        box.style.opacity = '1';
      });
    }, 180);
  } else if (anim === 'slide') {
    box.style.transition = 'transform .16s ease, opacity .16s ease';
    box.style.transform = 'translateX(-40px)';
    box.style.opacity = '0';
    setTimeout(() => {
      swap();
      box.style.transition = '';
      box.style.transform = 'translateX(40px)';
      box.style.opacity = '0';
      requestAnimationFrame(() => {
        box.style.transition = 'transform .18s ease, opacity .18s ease';
        box.style.transform = 'translateX(0)';
        box.style.opacity = '1';
      });
    }, 160);
  } else if (anim === 'slideup') {
    box.style.transition = 'transform .16s ease, opacity .16s ease';
    box.style.transform = 'translateY(-30px)';
    box.style.opacity = '0';
    setTimeout(() => {
      swap();
      box.style.transition = '';
      box.style.transform = 'translateY(20px)';
      box.style.opacity = '0';
      requestAnimationFrame(() => {
        box.style.transition = 'transform .18s ease, opacity .18s ease';
        box.style.transform = 'translateY(0)';
        box.style.opacity = '1';
      });
    }, 160);
  } else if (anim === 'zoom') {
    box.style.transition = 'transform .15s ease, opacity .15s ease';
    box.style.transform = 'scale(0.92)';
    box.style.opacity = '0';
    setTimeout(() => {
      swap();
      box.style.transform = 'scale(1.04)';
      box.style.opacity = '0';
      requestAnimationFrame(() => {
        box.style.transition = 'transform .18s cubic-bezier(.34,1.56,.64,1), opacity .18s ease';
        box.style.transform = 'scale(1)';
        box.style.opacity = '1';
      });
    }, 150);
  } else {
    // fallback
    box.style.transition = 'opacity .12s ease';
    box.style.opacity = '0';
    setTimeout(() => { swap(); requestAnimationFrame(() => { box.style.opacity = '1'; }); }, 120);
  }
}

function saveUiSetting(key, val) {
  _uiSettingsCache[key] = val;
  localStorage.setItem('qwc_ui_settings', JSON.stringify(_uiSettingsCache));
}

function saveAllUiSettings() {
  const appName = document.getElementById('uiAppName')?.value;
  const font = document.getElementById('uiFontFamily')?.value;
  const fontSize = document.getElementById('uiFontSize')?.value;
  if (appName) saveUiSetting('appName', appName);
  if (font) { saveUiSetting('font', font); document.body.style.fontFamily = `'${font}', sans-serif`; }
  if (fontSize) saveUiSetting('fontSize', parseInt(fontSize));
  showToast('✅ Đã lưu & áp dụng cài đặt giao diện!');
}

function resetUiSettings() {
  localStorage.removeItem('qwc_ui_settings');
  _uiSettingsCache = {};
  document.getElementById('settingsContent').innerHTML = getSettingsTabContent();
  showToast('Đã đặt lại toàn bộ cài đặt giao diện về mặc định');
}

function previewUiLogo(input) {
  if (!input.files?.[0]) return;
  const url = URL.createObjectURL(input.files[0]);
  const preview = document.getElementById('uiLogoPreview');
  if (preview) preview.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:contain">`;
  showToast('Logo preview đã cập nhật. Nhấn Lưu để áp dụng.');
}

function previewFont(fontName) {
  const p = document.getElementById('uiFontPreview');
  if (p) p.style.fontFamily = `'${fontName}', sans-serif`;
  showToast(`Demo: Font đang xem trước — ${fontName}`);
}

function selectUiPalette(idx) {
  document.querySelectorAll('[id^="uiPalette"]').forEach((el, i) => {
    el.style.borderColor = i === idx ? 'var(--primary)' : 'var(--border)';
  });
  saveUiSetting('palette', idx);
  showToast('Demo: Bộ màu đã chọn. Nhấn Lưu để áp dụng.');
}

function setTickerSpeed(speed, btn) {
  saveUiSetting('tickerSpeed', speed);
  document.querySelectorAll('[onclick^="setTickerSpeed"]').forEach(b => {
    b.style.borderColor = 'var(--border)';
    b.style.color = 'var(--muted)';
    b.style.background = 'transparent';
  });
  btn.style.borderColor = 'var(--primary)';
  btn.style.color = 'var(--primary)';
  btn.style.background = 'rgba(0,200,255,.1)';
  showToast('Tốc độ Ticker: ' + speed);
}

function toggleFullWidthPage(pageId, labelEl) {
  let cfg = JSON.parse(localStorage.getItem('qwc_ui_settings') || '{}');
  let fw = cfg.fullWidthPages || [];
  const idx = fw.indexOf(pageId);
  if (idx >= 0) fw.splice(idx, 1);
  else fw.push(pageId);
  cfg.fullWidthPages = fw;
  localStorage.setItem('qwc_ui_settings', JSON.stringify(cfg));
  _uiSettingsCache = cfg;
  // Visual update
  const isOn = fw.includes(pageId);
  const cb = labelEl.querySelector('input[type="checkbox"]');
  if (cb) cb.checked = isOn;
  const box = labelEl.querySelector('div');
  if (box) {
    box.style.background = isOn ? 'var(--primary)' : 'rgba(255,255,255,.1)';
    box.style.borderColor = isOn ? 'var(--primary)' : 'rgba(255,255,255,.2)';
    box.innerHTML = isOn ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : '';
  }
  labelEl.style.borderColor = isOn ? 'rgba(0,200,255,.3)' : 'var(--border)';
  labelEl.style.background = isOn ? 'rgba(0,200,255,.05)' : 'transparent';
  showToast(`${isOn ? '✅' : '❌'} Full-width ${isOn ? 'bật' : 'tắt'} cho trang này`);
}


function viewEmployeeDetail(id) {
  const e = DATA.employees.find(x => x.id === id);
  if (!e) {
    showToast('Không tìm thấy thông tin nhân viên!', 'error');
    return;
  }

  openModal(`
    <div class="modal-header">
      <span class="modal-title">Hồ sơ nhân viên: ${e.id}</span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body">
      <div style="display:flex;gap:20px;align-items:center;margin-bottom:20px">
        <div style="width:80px;height:80px;border-radius:50%;background:rgba(0,200,255,.1);display:flex;align-items:center;justify-content:center;font-size:32px;color:var(--primary);border:2px solid var(--border);flex-shrink:0">
          ${e.name.charAt(0)}
        </div>
        <div style="flex:1">
          <div style="font-size:20px;font-weight:700;color:var(--text)">${e.name}</div>
          <div style="font-size:14px;color:var(--primary);margin-top:4px">${e.position}</div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px">${e.dept} — ${e.factory}</div>
        </div>
      </div>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;background:rgba(0,0,0,.15);padding:16px;border-radius:12px;border:1px solid var(--border)">
        <div class="info-item"><label class="form-label" style="font-size:11px;color:var(--muted);margin-bottom:4px">Mã nhân viên</label><div class="mono" style="font-size:14px">${e.id}</div></div>
        <div class="info-item"><label class="form-label" style="font-size:11px;color:var(--muted);margin-bottom:4px">Trạng thái</label><div><span class="badge ${e.status === 'active' ? 'badge-green' : 'badge-gray'}">${e.status === 'active' ? 'Đang làm việc' : 'Nghỉ phép'}</span></div></div>
        <div class="info-item"><label class="form-label" style="font-size:11px;color:var(--muted);margin-bottom:4px">Điện thoại</label><div style="font-size:14px">${e.phone}</div></div>
        <div class="info-item"><label class="form-label" style="font-size:11px;color:var(--muted);margin-bottom:4px">Email</label><div style="font-size:14px;overflow:hidden;text-overflow:ellipsis">${e.email}</div></div>
      </div>
      
      <div style="margin-top:20px;padding-top:16px;border-top:1px dashed var(--border)">
         <div style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--muted)">Chứng chỉ & Kỹ năng</div>
         <div style="display:flex;flex-wrap:wrap;gap:6px">
            <span class="badge badge-blue">Quản lý mạng lưới</span>
            <span class="badge badge-blue">Kỹ thuật rò rỉ</span>
            <span class="badge badge-blue">An toàn lao động</span>
         </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="showToast('Gửi tin nhắn cho ${e.name}...')">💬 Chat</button>
      <button class="btn btn-primary" onclick="closeModal()">Đóng</button>
    </div>
  `, { width: '480px' });
}

// ── Onboarding Settings Helpers ───────────────────────────────────────────────
function obApplySetting(key, value, toggleId, subId) {
  localStorage.setItem(key, value);
  const chk = document.getElementById(toggleId);
  if (chk) {
    const span = chk.nextElementSibling;
    if (span) {
      span.style.background = (value === '1') ? 'var(--primary)' : 'rgba(255,255,255,.12)';
      const thumb = span.firstElementChild;
      if (thumb) thumb.style.left = (value === '1') ? '21px' : '3px';
    }
  }
  if (subId) {
    const sub = document.getElementById(subId);
    if (sub) {
      sub.style.opacity = (value === '1') ? '1' : '0.38';
      sub.style.pointerEvents = (value === '1') ? 'all' : 'none';
    }
  }
  showToast('Onboarding: ' + (value === '1' ? 'Đã bật ✓' : 'Đã tắt'));
}

function obAdjustVisits(delta) {
  const cur = parseInt(localStorage.getItem('qwc_ob_visits') || '5', 10);
  const next = Math.max(0, Math.min(20, cur + delta));
  localStorage.setItem('qwc_ob_visits', String(next));
  if (window.OB_CONFIG) window.OB_CONFIG.chatbotHelpVisits = next;
  ['obVisitsCounter', 'obVisitsLabel'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.textContent = next;
  });
  showToast('Chip hướng dẫn: ' + next + ' lần đầu mỗi trang');
}

function obResetHistory() {
  const keysToDelete = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && (k.startsWith('qwc_ob_page_') || k.startsWith('qwc_visits_') || k === 'qwc_ob_first_login')) {
      keysToDelete.push(k);
    }
  }
  keysToDelete.forEach(function (k) { localStorage.removeItem(k); });
  showToast('✅ Đã xóa lịch sử onboarding (' + keysToDelete.length + ' mục). Tour sẽ hiện lại khi vào trang.');
}

// ── Tab: AI & MÔ HÌNH ──────────────────────────────────────────────
function renderSettingsAi() {
  const providers = [
    { id:'openai',    name:'OpenAI',         logo:'🟢', models:['gpt-4o','gpt-4o-mini','gpt-4-turbo','gpt-3.5-turbo'], color:'rgba(16,163,127,.15)', border:'rgba(16,163,127,.3)' },
    { id:'google',    name:'Google AI',      logo:'🔵', models:['gemini-2.0-flash','gemini-1.5-pro','gemini-1.5-flash','gemini-1.0-pro'], color:'rgba(66,133,244,.12)', border:'rgba(66,133,244,.3)' },
    { id:'anthropic', name:'Anthropic',      logo:'🟤', models:['claude-3-5-sonnet','claude-3-opus','claude-3-sonnet','claude-3-haiku'], color:'rgba(210,140,100,.12)', border:'rgba(210,140,100,.3)' },
    { id:'ollama',    name:'Ollama (Local)',  logo:'⚫', models:['llama3.1:8b','llama3.1:70b','mistral:7b','qwen2.5:14b'], color:'rgba(255,255,255,.04)', border:'rgba(255,255,255,.12)' },
  ];

  const features = [
    { id:'chatbot',   label:'Trợ lý AI Chatbot',       desc:'Hội thoại tự nhiên, hỏi đáp nghiệp vụ PCTT', provider:'openai',   model:'gpt-4o' },
    { id:'content',   label:'Tạo nội dung truyền thông', desc:'Soạn thông báo, bài viết, script video PCTT', provider:'openai',   model:'gpt-4o-mini' },
    { id:'kpi',       label:'Trích xuất KPI từ văn bản', desc:'Đọc báo cáo, trích xuất số liệu tự động',     provider:'google',   model:'gemini-1.5-pro' },
    { id:'warning',   label:'Phân tích cảnh báo sớm',   desc:'Phân tích dữ liệu IoT, nhận diện nguy cơ',    provider:'google',   model:'gemini-2.0-flash' },
    { id:'rag',       label:'RAG Chatbot — Văn bản PCTT', desc:'Hỏi đáp dựa trên văn bản quy phạm nội bộ', provider:'openai',   model:'gpt-4o-mini' },
    { id:'summary',   label:'Tóm tắt báo cáo tự động',  desc:'Tóm tắt tài liệu dài, ghi chú điều hành',    provider:'anthropic','model':'claude-3-5-sonnet' },
  ];

  const providerCards = providers.map(p => `
  <div style="background:${p.color};border:1px solid ${p.border};border-radius:12px;padding:16px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:20px">${p.logo}</span>
        <div>
          <div style="font-size:13px;font-weight:700">${p.name}</div>
          <div style="font-size:10px;color:var(--muted)">${p.models.length} mô hình có sẵn</div>
        </div>
      </div>
      <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px">
        <div style="position:relative;width:34px;height:18px">
          <input type="checkbox" checked style="opacity:0;position:absolute;width:0;height:0">
          <div style="position:absolute;inset:0;background:var(--primary);border-radius:9px;"></div>
          <div style="position:absolute;top:2px;left:18px;width:14px;height:14px;background:#fff;border-radius:7px;transition:.2s"></div>
        </div>
        Kích hoạt
      </label>
    </div>
    <div class="form-group" style="margin-bottom:10px">
      <label class="form-label" style="font-size:10px">API Key</label>
      <div style="display:flex;gap:6px">
        <input type="password" class="form-control" style="font-family:monospace;font-size:11px;flex:1"
          placeholder="${p.id==='ollama'?'http://localhost:11434 (không cần key)':'sk-••••••••••••••••••••••••••••••••'}"
          value="${p.id==='openai'?'sk-proj-••••••••••••':p.id==='google'?'AIza••••••••••••':p.id==='anthropic'?'sk-ant-••••••••':''}">
        <button class="btn btn-ghost btn-sm" onclick="showToast('API Key hợp lệ ✅')" style="flex-shrink:0">Kiểm tra</button>
      </div>
    </div>
    <div class="form-group" style="margin:0">
      <label class="form-label" style="font-size:10px">Mô hình mặc định</label>
      <select class="form-control" style="font-size:11px">
        ${p.models.map((m,i) => `<option${i===0?' selected':''}>${m}</option>`).join('')}
      </select>
    </div>
  </div>`).join('');

  const featureRows = features.map(f => `
  <tr>
    <td style="font-size:12px;font-weight:600">${f.label}
      <div style="font-size:10px;color:var(--muted);font-weight:400;margin-top:2px">${f.desc}</div>
    </td>
    <td>
      <select class="form-control" style="font-size:11px;width:140px">
        ${providers.map(p => `<option value="${p.id}"${p.id===f.provider?' selected':''}>${p.name}</option>`).join('')}
      </select>
    </td>
    <td>
      <select class="form-control" style="font-size:11px;width:180px">
        ${providers.find(p=>p.id===f.provider)?.models.map((m,i)=>`<option${m===f.model?' selected':''}>${m}</option>`).join('')||''}
      </select>
    </td>
    <td>
      <label style="display:flex;align-items:center;gap:5px;cursor:pointer">
        <div style="position:relative;width:32px;height:17px">
          <input type="checkbox" checked style="opacity:0;position:absolute">
          <div style="position:absolute;inset:0;background:var(--primary);border-radius:9px"></div>
          <div style="position:absolute;top:2px;left:16px;width:13px;height:13px;background:#fff;border-radius:50%;transition:.2s"></div>
        </div>
      </label>
    </td>
  </tr>`).join('');

  return `
  <!-- AI Header -->
  <div style="background:linear-gradient(135deg,rgba(0,80,204,.15),rgba(0,200,255,.06));border:1px solid rgba(0,80,204,.25);border-radius:14px;padding:20px;margin-bottom:24px;display:flex;gap:16px;align-items:center">
    <div style="width:52px;height:52px;background:linear-gradient(135deg,#0050cc,#00c8ff);border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
    </div>
    <div>
      <div style="font-size:16px;font-weight:800;margin-bottom:4px">Cấu hình AI & Mô hình ngôn ngữ</div>
      <div style="font-size:12px;color:var(--muted);max-width:600px;line-height:1.6">Quản lý các nhà cung cấp AI, API key, chọn mô hình phù hợp cho từng tính năng. Hệ thống hỗ trợ đa nền tảng: OpenAI, Google Gemini, Anthropic Claude và mô hình Local (Ollama).</div>
    </div>
    <div style="margin-left:auto;display:flex;gap:10px;flex-direction:column;align-items:flex-end;flex-shrink:0">
      <div style="display:flex;align-items:center;gap:6px">
        <div class="pulse-dot green"></div>
        <span style="font-size:12px;color:var(--success);font-weight:600">3/4 nhà cung cấp hoạt động</span>
      </div>
      <div style="font-size:11px;color:var(--muted)">Phiên bản API: v1.2.4</div>
    </div>
  </div>

  <!-- Provider API Keys -->
  <div style="font-size:13px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:8px">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
    API Keys & Nhà cung cấp
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:28px">
    ${providerCards}
  </div>

  <!-- Per-feature model assignment -->
  <div style="font-size:13px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:8px">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
    Gán mô hình cho từng tính năng
  </div>
  <div class="card" style="padding:0;margin-bottom:24px;overflow:hidden">
    <table style="width:100%">
      <thead><tr style="background:rgba(255,255,255,.04)">
        <th style="text-align:left;padding:10px 16px;font-size:11px;font-weight:700;color:var(--muted)">TÍNH NĂNG</th>
        <th style="text-align:left;padding:10px 16px;font-size:11px;font-weight:700;color:var(--muted)">NHÀ CUNG CẤP</th>
        <th style="text-align:left;padding:10px 16px;font-size:11px;font-weight:700;color:var(--muted)">MÔ HÌNH</th>
        <th style="text-align:center;padding:10px 16px;font-size:11px;font-weight:700;color:var(--muted)">KÍCH HOẠT</th>
      </tr></thead>
      <tbody>${featureRows}</tbody>
    </table>
  </div>

  <!-- Global AI params -->
  <div style="font-size:13px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:8px">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
    Tham số toàn cục
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
    ${[
      {l:'Temperature (Sáng tạo)', id:'temp', val:'0.7', min:0, max:1, step:0.1, hint:'0 = xác định, 1 = sáng tạo cao'},
      {l:'Max Tokens (Độ dài tối đa)', id:'tokens', val:'2048', min:256, max:8192, step:256, hint:'Số token tối đa mỗi phản hồi AI'},
      {l:'Top-P (Sampling)', id:'topp', val:'0.9', min:0.1, max:1, step:0.05, hint:'Kiểm soát tính đa dạng ngôn ngữ'},
      {l:'Frequency Penalty', id:'freqpen', val:'0.2', min:0, max:2, step:0.1, hint:'Giảm lặp từ trong câu trả lời'},
    ].map(s=>`
    <div class="card" style="padding:14px 16px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <label class="form-label" style="margin:0">${s.l}</label>
        <span style="font-size:12px;color:var(--primary);font-weight:700" id="ai_${s.id}_lbl">${s.val}</span>
      </div>
      <input type="range" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.val}" style="width:100%;accent-color:var(--primary)"
        oninput="document.getElementById('ai_${s.id}_lbl').textContent=this.value">
      <div style="font-size:10px;color:var(--muted);margin-top:6px">${s.hint}</div>
    </div>`).join('')}
  </div>

  <!-- Safety & Logging -->
  <div class="card" style="padding:16px 20px">
    <div style="font-size:13px;font-weight:700;margin-bottom:14px">An toàn & Ghi nhật ký AI</div>
    <div style="display:flex;flex-direction:column;gap:12px">
      ${[
        {l:'Lọc nội dung không phù hợp (Content Moderation)', on:true},
        {l:'Ghi log toàn bộ lượt gọi AI (AI Call Audit Log)', on:true},
        {l:'Giới hạn số lượt gọi AI / người dùng / ngày (Rate Limit)', on:true},
        {l:'Hiển thị tên mô hình AI trên giao diện người dùng', on:false},
        {l:'Cho phép AI tự động gửi thông báo khẩn cấp', on:false},
      ].map((t,i)=>`
      <label style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;padding:8px 0;${i>0?'border-top:1px solid var(--border)':''}">
        <span style="font-size:12px">${t.l}</span>
        <div style="position:relative;width:34px;height:18px;flex-shrink:0">
          <input type="checkbox" ${t.on?'checked':''} style="opacity:0;position:absolute">
          <div style="position:absolute;inset:0;background:${t.on?'var(--primary)':'rgba(255,255,255,.12)'};border-radius:9px;transition:.2s"></div>
          <div style="position:absolute;top:2px;left:${t.on?'18':'2'}px;width:14px;height:14px;background:#fff;border-radius:7px;transition:.2s"></div>
        </div>
      </label>`).join('')}
    </div>
  </div>

  <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px">
    <button class="btn btn-ghost" onclick="showToast('Đã đặt lại cấu hình AI về mặc định')">Đặt lại mặc định</button>
    <button class="btn btn-primary" onclick="showToast('✅ Đã lưu cấu hình AI & mô hình!')">Lưu cấu hình AI</button>
  </div>`;
}
