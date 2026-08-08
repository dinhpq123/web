// ══════════════════════════════════════════════════════════════════
// APP_CONFIG — Central configuration for Hadiwa IOC
// Hệ thống IOC Thủy lợi & Phòng chống Thiên tai
//
// ── QUICK GUIDE FOR PARTNERS ────────────────────────────────────
// 1. Chọn preset phù hợp:  APP_CONFIG.preset = 'pctt_hanoi'
// 2. Hoặc tuỳ chỉnh riêng: APP_CONFIG.features.xxx = false
// 3. Ẩn tab cụ thể:        APP_CONFIG.tabs.reports = ['disaster','rainfall']
// ══════════════════════════════════════════════════════════════════

const APP_CONFIG = {

  // ── ACTIVE PRESET ────────────────────────────────────────────────
  // Đổi giá trị này để áp dụng cấu hình cho từng khách hàng/đối tác.
  // Các preset được định nghĩa trong section `presets` bên dưới.
  // Giá trị: 'pctt_hanoi' | 'pctt_basic' | 'pctt_command' | 'iot_only' | 'custom'
  // Khi preset = 'custom', dùng trực tiếp section `features` và `tabs` bên dưới.
  preset: 'pctt_hanoi',

  // ── SYSTEM TYPE ──────────────────────────────────────────────────
  system: {
    type: 'flood',
    name: 'HADIWA',
    fullName: 'Chi cục Thủy lợi — Phòng chống Thiên tai TP. Hà Nội',
    shortName: 'Hadiwa',
    region: 'TP. Hà Nội',
    logo: 'assets/hadiwa_logo.svg?v=20260326',
    systemLogo: 'assets/system-logo.png',
    systemLogoSmall: 'assets/system-logo-small.png',
    subtitle: 'IOC Thủy lợi & PCTT',
    version: 'Hadiwa IOC v1.1',
    serverName: 'ioc.hadiwa.vn',
  },

  // ── THEME PALETTES ───────────────────────────────────────────────
  theme: {
    default: 'dark',

    palettes: {
      dark: {
        bgBase: '#020b16',
        bgSurface: '#051121',
        bgElevated: '#0a182b',
        bgCard: 'rgba(10,24,43,0.7)',
        bgHover: 'rgba(0,200,255,.06)',
        bgHeader: 'rgba(5,17,33,0.75)',
        bgDropdown: 'rgba(5,17,33,0.95)',
        bgDropdown2: 'rgba(5,17,33,.6)',
        primary: 'var(--primary)',
        info: 'var(--info)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        cyan: 'var(--primary)',
        blue: 'var(--info)',
        green: 'var(--success)',
        yellow: 'var(--warning)',
        red: 'var(--danger)',
        purple: 'var(--purple)',
        orange: '#f28c28',
        text: 'var(--text-primary)',
        text2: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        label: 'var(--text-subtle)',
        border: 'var(--border)',
        borderActive: 'var(--primary)',
        glass: 'rgba(255,255,255,0.92)',
        blur: 'blur(16px)',
        shadow: '0 2px 12px rgba(24,24,62,0.06)',
        glow: '0 0 20px rgba(41,132,238,0.20)',
        gridLine: 'rgba(41,132,238,0.05)',
      },
      light: {
        bgBase: '#f4f7f9',
        bgSurface: '#ffffff',
        bgElevated: '#ebf1f5',
        bgCard: 'rgba(255,255,255,0.85)',
        bgHover: 'rgba(0,110,210,.08)',
        bgHeader: 'rgba(255,255,255,0.85)',
        bgDropdown: 'rgba(255,255,255,0.98)',
        bgDropdown2: 'rgba(244,247,249,.95)',
        cyan: '#0088dd',
        blue: 'var(--info)',
        green: '#00b060',
        yellow: '#e68a00',
        red: '#e53935',
        purple: '#285CAA',
        orange: '#e07000',
        text: '#0a1a2f',
        text2: '#1c3d5d',
        muted: '#74889c',
        label: '#8fa1b3',
        border: 'rgba(0,110,210,.18)',
        borderActive: 'rgba(0,136,221,.6)',
        glass: 'rgba(255,255,255,0.7)',
        blur: 'blur(16px)',
        shadow: '0 8px 32px rgba(0,0,0,.08)',
        glow: '0 0 25px rgba(0,136,221,.18)',
        gridLine: 'rgba(0,110,210,.05)',
      },
    },
  },

  // ── TYPOGRAPHY ──────────────────────────────────────────────────
  typography: {
    fontBody: "'Inter', sans-serif",
    fontMono: "'Roboto Mono', monospace",
    fontDisplay: "'Inter', sans-serif",
    sizeBase: '14px',
    sizeH1: '22px',
    sizeH2: '18px',
    sizeH3: '15px',
    sizeSmall: '12px',
    sizeXSmall: '11px',
    weightNormal: '400',
    weightMedium: '500',
    weightSemi: '600',
    weightBold: '700',
    lineHeight: '1.5',
  },

  // ── MAP CONFIG ──────────────────────────────────────────────────
  map: {
    center: [21.02, 105.84],  // TP. Hà Nội
    zoom: 12,
    minZoom: 8,
    maxZoom: 20,

    tiles: {
      dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    },

    colors: {
      dike: '#f28c28',           // Tuyến đê
      seaDike: 'var(--danger)',        // Đê biển
      riverDike: 'var(--warning)',      // Đê sông
      sluiceGate: 'var(--info)',     // Cống thủy lợi
      pumpStation: 'var(--primary)',    // Trạm bơm thủy lợi
      reservoir: 'var(--info)',      // Hồ chứa
      floodZone: 'rgba(225,78,84,.25)',  // Vùng ngập
      waterLevel: 'var(--primary)',     // Trạm đo mực nước
      rainfall: 'var(--purple)',       // Trạm đo mưa
      irrigationCanal: 'var(--info)', // Kênh mương
      crossSection: 'var(--warning)',   // Mặt cắt đê
    },
  },

  // ── FEATURES TOGGLE (Module-level) ──────────────────────────────
  // true  = hiện menu và cho phép truy cập trang
  // false = ẩn menu + chặn navigate()
  // Khi dùng preset != 'custom', các giá trị này sẽ bị ghi đè bởi preset.
  features: {
    // Phân hệ 1: Điều hành Tập trung
    dashboard: true,
    dieuhanh: true,
    videowall: true,
    camera: true,
    gis: true,
    // Phân hệ 2: CSDL Thủy lợi & Đê điều
    irrigationAssets: true,   // Hồ sơ công trình thủy lợi
    dikeManagement: true,     // Quản lý đê điều
    dikePermit: true,         // Cấp phép & Vi phạm
    // Phân hệ 3: PCTT
    pcttDocuments: true,      // Văn bản/QĐ PCTT
    fourOnSite: true,         // 4 tại chỗ
    pcttCommand: true,        // Kịch bản chỉ đạo
    pcttFund: true,           // Quỹ PCTT
    communityReports: true,    // Phản ánh Cộng đồng (từ App Hadiwa)
    // Phân hệ 4: IoT & Cảnh báo
    iotMonitor: true,         // Giám sát IoT
    earlyWarning: true,       // Cảnh báo sớm
    weatherBulletin: true,    // Bản tin cảnh báo
    scheduler: true,          // Lịch vận hành
    // Phân hệ 5-6: Báo cáo & Truyền thông
    reports: true,
    pcttMedia: true,          // Truyền thông PCTT
    // Trung tâm AI
    aiagent: true,
    chatbot: true,
    // Data Hub
    datahub: true,
    // Phân hệ 7: Quản trị
    hrm: true,
    log: true,
    settings: true,
  },

  // ── TABS CONFIG (Tab-level) ──────────────────────────────────────
  // Danh sách tab-id được phép hiển thị trong từng trang.
  // Nếu page không có entry ở đây → hiện tất cả tab (mặc định).
  // Khi dùng preset != 'custom', các giá trị này sẽ bị ghi đè bởi preset.
  tabs: {
    // reports.js — tab IDs: disaster, rainfall, waterlevel, pump, budget, irrigation
    reports: ['disaster', 'rainfall', 'waterlevel', 'pump', 'budget', 'irrigation'],
    // pcttMedia.js — tab IDs: library, social, tts
    pcttMedia: ['library', 'social', 'tts'],
    // datahub.js — tab IDs: apikeys, templates, synclog, kpiimport, kpihistory, rag, aimodels
    datahub: ['apikeys', 'templates', 'synclog', 'kpiimport', 'kpihistory', 'rag', 'aimodels'],
    // app.js Settings — tab IDs: system, security, roles, dashboard, notifications, integrations, ui
    settings: ['system', 'security', 'roles', 'dashboard', 'notifications',
      'integrations', 'ui'],
  },

  // ── PRESET DEFINITIONS ──────────────────────────────────────────
  // Mỗi preset định nghĩa features + tabs riêng để ghi đè defaults bên trên.
  // Preset 'custom' không có entry ở đây → app dùng trực tiếp features/tabs bên trên.
  presets: {

    // Gói đầy đủ — Chi cục PCTT TP. Hà Nội (Full Package)
    pctt_hanoi: {
      label: 'Chi cục PCTT TP. Hà Nội — Full Package',
      features: {
        dashboard: true, dieuhanh: true, videowall: true, camera: true, gis: true,
        irrigationAssets: true, irrigationDataEntry: true, hydrologicalData: true,
        dikeManagement: true, dikeInspection: true, dikePermit: true, reservoirMonitor: true,
        pcttDocuments: true, fourOnSite: true, pcttCommand: true, pcttFund: true,
        pcttDamageReport: true, communeReporting: true, communityReports: true,
        iotMonitor: true, earlyWarning: true, weatherBulletin: true,
        commsDevices: true, scheduler: true,
        reports: true, pcttMedia: true,
        aiagent: true, chatbot: true, datahub: true,
        workflows: true, hrm: true, log: true, settings: true,
      },
      tabs: {
        reports: ['disaster', 'rainfall', 'waterlevel', 'pump', 'budget', 'irrigation'],
        pcttMedia: ['library', 'social', 'tts'],
        datahub: ['apikeys', 'templates', 'synclog', 'kpiimport', 'kpihistory', 'rag', 'aimodels'],
        settings: ['system', 'security', 'roles', 'dashboard', 'notifications',
          'integrations', 'ui'],
      },
    },

    // Gói Quan trắc & Cảnh báo sớm — Dành cho đối tác/địa phương nhỏ
    pctt_basic: {
      label: 'Gói Quan trắc & Cảnh báo sớm',
      features: {
        dashboard: true, dieuhanh: false, videowall: false, camera: true, gis: true,
        irrigationAssets: false, dikeManagement: false, dikePermit: false,
        pcttDocuments: false, fourOnSite: false, pcttCommand: false, pcttFund: false,
        communityReports: false,
        iotMonitor: true, earlyWarning: true, weatherBulletin: true, scheduler: false,
        reports: true, pcttMedia: false,
        aiagent: false, chatbot: true, datahub: false,
        hrm: false, log: true, settings: true,
      },
      tabs: {
        reports: ['disaster', 'rainfall', 'waterlevel', 'irrigation'],
        datahub: ['apikeys', 'synclog', 'rag', 'aimodels'],
        settings: ['system', 'security', 'notifications', 'ui'],
      },
    },

    // Gói Chỉ đạo PCTT — Tập trung vào điều hành & phê duyệt
    pctt_command: {
      label: 'Gói Chỉ đạo PCTT',
      features: {
        dashboard: true, dieuhanh: true, videowall: true, camera: true, gis: true,
        irrigationAssets: false, dikeManagement: false, dikePermit: false,
        pcttDocuments: true, fourOnSite: true, pcttCommand: true, pcttFund: true,
        communityReports: true,
        iotMonitor: true, earlyWarning: true, weatherBulletin: true, scheduler: true,
        reports: true, pcttMedia: true,
        aiagent: true, chatbot: true, datahub: false,
        hrm: false, log: true, settings: true,
      },
      tabs: {
        reports: ['disaster', 'rainfall', 'waterlevel', 'pump', 'irrigation'],
        pcttMedia: ['library', 'social', 'tts'],
        settings: ['system', 'security', 'roles', 'notifications', 'ui'],
      },
    },

    // Gói IoT — Chỉ giám sát thiết bị & cảnh báo
    iot_only: {
      label: 'Gói IoT & Giám sát thiết bị',
      features: {
        dashboard: true, dieuhanh: false, videowall: false, camera: true, gis: true,
        irrigationAssets: false, dikeManagement: false, dikePermit: false,
        pcttDocuments: false, fourOnSite: false, pcttCommand: false, pcttFund: false,
        communityReports: false,
        iotMonitor: true, earlyWarning: true, weatherBulletin: true, scheduler: true,
        reports: false, pcttMedia: false,
        aiagent: false, chatbot: false, datahub: false,
        hrm: false, log: true, settings: true,
      },
      tabs: {
        settings: ['system', 'security', 'ui'],
      },
    },

  },

  // ── SYSTEM TYPE LABELS ──────────────────────────────────────────
  labels: {
    flood: {
      product: 'Lũ / Triều',
      network: 'Hệ thống đê điều',
      station: 'Trạm quan trắc',
      plant: 'Cống tiêu úng',
      pipe: 'Đê / Kênh',
      nrw: 'An toàn đê điều',
      quality: 'Mực nước & Lưu lượng',
    },
    water_clean: {
      product: 'Nước sạch',
      network: 'Mạng lưới cấp nước',
      station: 'Trạm bơm',
      plant: 'Nhà máy nước',
      pipe: 'Đường ống cấp nước',
      nrw: 'Thất thoát nước (NRW)',
      quality: 'Chất lượng nước',
    },
  },

  // ── FLOOD ALERT THRESHOLDS ─────────────────────────────────────
  floodAlert: {
    levels: [
      { level: 1, label: 'Báo động I', color: '#ffdb4d', description: 'Cảnh giác — Theo dõi sát mực nước' },
      { level: 2, label: 'Báo động II', color: '#ff9500', description: 'Chuẩn bị — Sẵn sàng sơ tán' },
      { level: 3, label: 'Báo động III', color: '#ff3d57', description: 'Khẩn cấp — Sơ tán ngay lập tức' },
    ],
  },

  // ── DIKE CONFIG ────────────────────────────────────────────────
  dike: {
    safetyZones: [
      { label: 'An toàn', color: 'var(--success)', minDelta: 1.0 },
      { label: 'Cảnh báo', color: '#ffdb4d', minDelta: 0.5 },
      { label: 'Nguy hiểm', color: '#ff9500', minDelta: 0.2 },
      { label: 'Khẩn cấp', color: '#ff3d57', minDelta: 0.0 },
    ],
  },

  // ── IoT REFRESH ──────────────────────────────────────────────
  iot: {
    refreshIntervalSec: 30,
  },

  // ── HUB LAUNCHER APPEARANCE ─────────────────────────────────────
  // Cấu hình giao diện màn hình Hub Module (chọn phân hệ sau đăng nhập).
  //
  //   iconShape: 'circle'  → Icon hình tròn (mặc định)
  //   iconShape: 'square'  → Icon hình vuông bo góc kiểu iOS (squircle)
  //
  // Thay đổi tại đây sẽ tự động được áp dụng cho HUB_CONFIG trong hub.js.
  hub: {
    iconShape: 'square',   // 'circle' | 'square'
    layout: 'grid',        // 'ring' = vòng quỹ đạo | 'grid' = lưới 2 hàng
    iconSize: 110,         // % so với size mặc định (100 = mặc định, 110 = to hơn 10%)
  },
};

// ══════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════

/** Apply the active preset — merges preset.features & preset.tabs into APP_CONFIG.
 *  Called once on boot by app.js (DOMContentLoaded). */
function applyPreset() {
  const presetKey = APP_CONFIG.preset;
  if (!presetKey || presetKey === 'custom') return; // use config directly
  const preset = APP_CONFIG.presets[presetKey];
  if (!preset) {
    console.warn(`[Hadiwa] Preset "${presetKey}" không tồn tại. Dùng config mặc định.`);
    return;
  }
  if (preset.features) Object.assign(APP_CONFIG.features, preset.features);
  if (preset.tabs) Object.assign(APP_CONFIG.tabs, preset.tabs);
  console.info(`[Hadiwa] Preset áp dụng: "${preset.label}"`);
}

/** Check whether a menu/module is enabled.
 *  @param {string} moduleId — key trong APP_CONFIG.features
 *  @returns {boolean} */
function isFeatureEnabled(moduleId) {
  return APP_CONFIG.features[moduleId] !== false;
}

/** Check whether a tab should be shown inside a given page.
 *  @param {string} page  — page key, e.g. 'reports', 'datahub', 'pcttMedia'
 *  @param {string} tabId — tab identifier string
 *  @returns {boolean} */
function isTabVisible(page, tabId) {
  const allowed = APP_CONFIG.tabs?.[page];
  if (!allowed) return true; // không config → hiện hết
  return allowed.includes(tabId);
}

function getSysLabel(key) {
  const type = APP_CONFIG.system.type;
  return (APP_CONFIG.labels[type] || APP_CONFIG.labels.flood)[key] || key;
}

function getCurrentPalette() {
  const mode = document.body.classList.contains('light') ? 'light' : 'dark';
  return APP_CONFIG.theme.palettes[mode];
}
