// ── HADIWA IOC — MODULE HUB (Post-Login Launcher) ─────────────────
// Shown once after login. Shows role-filtered module groups in an
// animated orbital ring. Click → navigate to first page of group.

// ══════════════════════════════════════════════════════════════════
// HUB_CONFIG — chỉnh các thông số giao diện Hub tại đây
// ══════════════════════════════════════════════════════════════════
const HUB_CONFIG = {
  // Độ dày border của mỗi icon (px). Mặc định 2.5. Thử: 1 → 4
  borderWidth: 1,

  // Border màu nền (opacity hex 00-ff). Mặc định '55' (~33%).
  borderOpacity: '55',

  // Tỉ lệ phóng to khi hover (scale). Mặc định 1.28. Thử: 1.1 → 1.5
  hoverScale: 1.06,

  // ── IC O N SH A PE ──────────────────────────────────────────────
  // 'circle' = Hình tròn | 'square' = Squircle (iOS style)
  // Cấu hình tại APP_CONFIG.hub.iconShape trong config.js
  iconShape: 'circle',

  // ── LA YO UT ────────────────────────────────────────────────────
  // 'ring' = Vòng quỹ đạo (mặc định trước đây)
  // 'grid' = Lưới 2 hàng — tất cả phân hệ hiện cùng lúc
  // Cấu hình tại APP_CONFIG.hub.layout trong config.js
  layout: 'grid',

  // ── IC O N SI ZE ─────────────────────────────────────────────────
  // % so với kích thước cơ sở (100%). 110 = to hơn 10% so với mặc định
  // Cấu hình tại APP_CONFIG.hub.iconSize trong config.js
  iconSize: 110,

  // Phát âm thanh (đọc tên phân hệ) khi hover qua icon
  sound: {
    enabled: true,       // true = bật, false = tắt
    lang: 'vi-VN',       // Ngôn ngữ TTS: 'vi-VN' | 'en-US'
    rate: 1.0,           // Tốc độ đọc: 0.5 (chậm) → 2.0 (nhanh)
    pitch: 1.0,          // Cao độ: 0.5 → 2.0
    volume: 0.85,        // Âm lượng: 0.0 → 1.0
  },
};

// Sync from APP_CONFIG at runtime (called before showModuleHub)
function _syncHubConfigFromApp() {
  if (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.hub) {
    if (APP_CONFIG.hub.iconShape !== undefined) HUB_CONFIG.iconShape = APP_CONFIG.hub.iconShape;
    if (APP_CONFIG.hub.layout    !== undefined) HUB_CONFIG.layout    = APP_CONFIG.hub.layout;
    if (APP_CONFIG.hub.iconSize  !== undefined) HUB_CONFIG.iconSize  = APP_CONFIG.hub.iconSize;
  }
}
// ══════════════════════════════════════════════════════════════════


const HUB_GROUPS = [
  {
    id: 'command',
    label: 'Điều hành\nTập trung',
    page: 'dieuhanh',
    fallback: 'dashboard',
    features: ['dieuhanh', 'videowall', 'camera', 'pcttOperations', 'gis'],
    color: '#7c3aed',
    glow: 'rgba(124,58,237,.55)',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>`,
  },
  {
    id: 'hydraulic',
    label: 'Thủy lợi\n& Đê điều',
    page: 'irrigationAssets',
    fallback: 'dashboard',
    features: ['irrigationAssets', 'irrigationDataEntry', 'hydrologicalData', 'dikeManagement', 'dikeInspection', 'dikePermit', 'reservoirMonitor'],
    color: '#0891b2',
    glow: 'rgba(8,145,178,.55)',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>
    </svg>`,
  },
  {
    id: 'pctt',
    label: 'Chỉ đạo\nPCTT',
    page: 'pcttCommand',
    fallback: 'dashboard',
    features: ['pcttCommand', 'pcttDocuments', 'fourOnSite', 'pcttFund', 'pcttDamageReport', 'communeReporting', 'communityReports'],
    color: '#dc2626',
    glow: 'rgba(220,38,38,.55)',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>`,
  },
  {
    id: 'iot',
    label: 'IoT &\nCảnh báo',
    page: 'iotMonitor',
    fallback: 'dashboard',
    features: ['iotMonitor', 'earlyWarning', 'weatherBulletin', 'commsDevices', 'scheduler'],
    color: '#059669',
    glow: 'rgba(5,150,105,.55)',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/>
      <path d="M8.53 16.11a6 6 0 016.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/>
    </svg>`,
  },
  {
    id: 'reports',
    label: 'Báo cáo\n& Truyền thông',
    page: 'reports',
    fallback: 'dashboard',
    features: ['reports', 'pcttMedia'],
    color: '#d97706',
    glow: 'rgba(217,119,6,.55)',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>`,
  },
  {
    id: 'ai',
    label: 'Trung tâm\nAI',
    page: 'aiagent',
    fallback: 'chatbot',
    features: ['aiagent', 'chatbot', 'datahub'],
    color: '#a78bfa',
    glow: 'rgba(167,139,250,.55)',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>`,
  },
  {
    id: 'settings',
    label: 'Quản trị\nHệ thống',
    page: 'settings',
    fallback: 'log',
    features: ['workflows', 'hrm', 'log', 'settings'],
    color: '#64748b',
    glow: 'rgba(100,116,139,.55)',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>`,
  },
];

// ── CSS ────────────────────────────────────────────────────────────
const HUB_CSS = `
#moduleHub {
  --hub-surface: #142D52;
  --hub-elevated: #20457E;
  --hub-text: #F8FBFF;
  --hub-text-secondary: #D1E2F4;
  --hub-muted: #A4B8CD;
  --hub-border: rgba(91,169,255,.24);
  --hub-primary: #5BA9FF;
  --hub-primary-soft: rgba(91,169,255,.14);
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(7, 18, 38, .94);
  backdrop-filter: blur(8px);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  opacity: 0; transition: opacity .5s ease;
  overflow: hidden;
}
#moduleHub.visible { opacity: 1; }
#moduleHub.hiding  { opacity: 0; pointer-events: none; }

#moduleHub::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(30,56,131,.12), rgba(25,43,84,.06));
}

.hub-header {
  text-align: center; margin-bottom: 32px; position: relative; z-index: 2;
}
.hub-header h1 {
  font-size: clamp(20px, 3vw, 30px); font-weight: 750; letter-spacing: 0;
  color: var(--hub-text);
  margin: 0 0 6px;
}
.hub-header p {
  font-size: 13px; color: rgba(255,255,255,.45); margin: 0;
}
.hub-header .hub-user-badge {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 5px 14px; border-radius: 20px;
  background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
  font-size: 12px; color: rgba(255,255,255,.7);
  margin-top: 10px;
}

/* ── Orbital ring ─────────────────────────────────────────────── */
.hub-orbit-wrapper {
  position: relative; z-index: 2;
  width: clamp(320px, 52vw, 640px);
  height: clamp(320px, 52vw, 640px);
}
.hub-orbit-track {
  position: absolute; inset: 0; border-radius: 50%;
  border: 1px solid var(--hub-border);
}
.hub-orbit-track::after {
  content: ''; position: absolute; inset: 20px; border-radius: 50%;
  border: 1px dashed var(--hub-border);
}

/* Center logo */
.hub-center {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  flex-direction: column; gap: 6px; pointer-events: none;
}
.hub-center-logo {
  width: 80px; height: 80px; border-radius: 50%;
  background: var(--hub-surface);
  border: 1px solid var(--hub-border);
  display: flex; align-items: center; justify-content: center;
  box-shadow: none;
}
.hub-center-logo svg { width: 38px; height: 38px; color: var(--hub-primary); }
.hub-center-label {
  font-size: 10px; font-weight: 700; letter-spacing: .12em;
  text-transform: uppercase; color: rgba(255,255,255,.35);
}

/* Module node items — scale/border driven by HUB_CONFIG at runtime via JS */
.hub-node {
  position: absolute; transform-origin: 50% 50%;
}
.hub-icon-btn {
  width: clamp(60px, 7.5vw, 86px); height: clamp(60px, 7.5vw, 86px);
  /* border-radius is set dynamically in JS based on HUB_CONFIG.iconShape */
  border-radius: 50%;
  background: var(--hub-surface);
  border-style: solid; border-color: var(--hub-border);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  cursor: pointer; position: relative;
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s, border-radius .2s ease;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(8px);
}
/* iOS-style squircle shape (applied by JS when iconShape='square') */
.hub-icon-btn.hub-shape-square {
  border-radius: 22% !important;
}
/* Extra subtle inner-shadow for squircle to enhance premium depth */
.hub-icon-btn.hub-shape-square::after {
  content: '';
  position: absolute; inset: 0;
  border-radius: inherit;
  box-shadow: none;
  pointer-events: none;
}
.hub-icon-btn svg {
  width: clamp(22px, 2.8vw, 32px); height: clamp(22px, 2.8vw, 32px);
  transition: stroke .3s, filter .3s;
}
.hub-icon-btn .hub-node-label {
  position: absolute; bottom: -38px; left: 50%; transform: translateX(-50%);
  font-size: clamp(9px, 1.1vw, 11px); font-weight: 700; text-align: center; white-space: pre;
  color: rgba(255,255,255,.5); line-height: 1.3; pointer-events: none;
  transition: color .3s, text-shadow .3s;
}
/* hover scale is applied via JS using HUB_CONFIG.hoverScale */
.hub-icon-btn:hover { z-index: 10; }
.hub-icon-btn:hover .hub-node-label {
  text-shadow: none;
}

/* skip button */
.hub-skip {
  position: relative; z-index: 2; margin-top: 40px;
  padding: 8px 24px; border-radius: 20px;
  font-size: 12px; font-weight: 600; cursor: pointer;
  background: transparent; border: 1px solid rgba(255,255,255,.15);
  color: rgba(255,255,255,.4); letter-spacing: .05em;
  transition: all .2s;
}
.hub-skip:hover {
  background: rgba(255,255,255,.05); color: rgba(255,255,255,.7);
  border-color: rgba(255,255,255,.3);
}

/* ── Grid layout ──────────────────────────────────────────────── */
.hub-grid-wrapper {
  position: relative; z-index: 2;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 20px; padding: 8px 0;
}
.hub-grid-row {
  display: flex; flex-wrap: wrap;
  gap: var(--hub-icon-gap, 20px);
  align-items: center; justify-content: center;
}
.hub-grid-btn {
  width:  var(--hub-icon-size, 104px);
  height: var(--hub-icon-size, 104px);
  background: var(--hub-surface);
  border-style: solid; border-color: var(--hub-border);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  cursor: pointer; position: relative;
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s, background .2s;
  backdrop-filter: blur(8px);
}
.hub-grid-btn.hub-shape-square { border-radius: 22% !important; }
.hub-grid-btn.hub-shape-circle { border-radius: 50%; }
.hub-grid-btn.hub-shape-square::after {
  content: ''; position: absolute; inset: 0; border-radius: inherit;
  box-shadow: none;
  pointer-events: none;
}
.hub-grid-btn svg { transition: stroke .3s, filter .3s; }
.hub-grid-btn .hub-grid-label {
  font-size: clamp(9px, 1.1vw, 11px); font-weight: 700;
  text-align: center; white-space: pre; line-height: 1.3;
  pointer-events: none; margin-top: 6px;
  transition: color .3s, text-shadow .3s;
}
.hub-grid-btn:hover { z-index: 10; }
.hub-grid-btn:hover .hub-grid-label { text-shadow: none; }
`;

// ── Main entry (called from app.js DOMContentLoaded) ──────────────
window.showModuleHub = function(onSelect) {
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const roleLabel = user ? (ROLE_LABELS?.[user.role] || user.role || '') : '';

  // Filter by feature access (feature flag must be on)
  const visible = HUB_GROUPS.filter(g =>
    g.features.some(f =>
      typeof isFeatureEnabled === 'function' ? isFeatureEnabled(f) : true
    )
  );

  // RBAC check: which visible groups does this user actually have access to?
  // canView() checks the RBAC matrix. If no RBAC system, default to all accessible.
  function groupIsAccessible(g) {
    if (typeof canView !== 'function') return true;
    // Map hub feature ids to RBAC keys (same as MENU_TO_RBAC)
    const rbac = typeof MENU_TO_RBAC !== 'undefined' ? MENU_TO_RBAC : {};
    return g.features.some(f => {
      const key = rbac[f] || f;
      return canView(key);
    });
  }

  // ── Inject CSS ────────────────────────────────────────────────
  if (!document.getElementById('hubCSS')) {
    const style = document.createElement('style');
    style.id = 'hubCSS'; style.textContent = HUB_CSS;
    document.head.appendChild(style);
  }

  // ── Build DOM ─────────────────────────────────────────────────
  const hub = document.createElement('div');
  hub.id = 'moduleHub';

  // Pick best page for a group (first enabled & permitted feature's page)
  function bestPage(g) {
    const rbac = typeof MENU_TO_RBAC !== 'undefined' ? MENU_TO_RBAC : {};
    for (const f of g.features) {
      const enabled = typeof isFeatureEnabled === 'function' ? isFeatureEnabled(f) : true;
      const rbacKey = rbac[f] || f;
      const allowed = typeof canView === 'function' ? canView(rbacKey) : true;
      if (enabled && allowed) {
        return f;
      }
    }
    return g.fallback || 'dashboard';
  }

  // ── Icon shape & layout config ──────────────────────────────
  _syncHubConfigFromApp();
  const isSquare = HUB_CONFIG.iconShape === 'square';
  const iconBorderRadius = isSquare ? '22%' : '50%';
  const useGrid = HUB_CONFIG.layout === 'grid';

  // ── Compute icon pixel size from HUB_CONFIG.iconSize (%) ───
  // Ring base: clamp(60,7.5vw,86)px → use 86px as reference at desktop
  // Grid base: 100px. iconSize 110 → 110px
  const BASE_GRID_SIZE = 100;
  const iconPx   = Math.round(BASE_GRID_SIZE * (HUB_CONFIG.iconSize / 100));
  const svgPx    = Math.round(iconPx * 0.42);
  const gapPx    = Math.max(12, Math.round(iconPx * 0.18));

  // Shared: locked state helpers
  function lockIcon() {
    return `<span style="position:absolute;top:-4px;right:-4px;width:18px;height:18px;border-radius:50%;background:#1e293b;border:1.5px solid #64748b;display:flex;align-items:center;justify-content:center">
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
    </span>`;
  }

  // ── GRID VIEW ─────────────────────────────────────────────────
  let contentHTML;
  if (useGrid) {
    const itemsPerRow = 4; // 7 items → row1: 4, row2: 3
    const rows = [];
    for (let i = 0; i < visible.length; i += itemsPerRow) {
      rows.push(visible.slice(i, i + itemsPerRow));
    }
    const gridRows = rows.map(row => {
      const items = row.map(g => {
        const accessible = groupIsAccessible(g);
        const lockedStyle = accessible ? '' : 'opacity:.38;filter:grayscale(.85);cursor:not-allowed;';
        return `
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
          <button class="hub-grid-btn hub-shape-${isSquare ? 'square' : 'circle'}" id="hub-btn-${g.id}"
            style="
              --hub-item-color:${accessible ? g.color : 'var(--hub-muted)'};
              --hub-item-glow:${accessible ? g.glow : 'transparent'};
              width:${iconPx}px; height:${iconPx}px;
              border-radius:${iconBorderRadius};
              border-width:${HUB_CONFIG.borderWidth}px;
              border-color:${accessible ? g.color : 'var(--hub-border)'};
              ${isSquare ? `background:color-mix(in srgb, var(--hub-surface) 94%, ${g.color} 6%);` : ''}
              ${lockedStyle}
            "
            onclick="window._hubSelect('${g.id}')"
            onmouseenter="window._hubHover('${g.id}', true)"
            onmouseleave="window._hubHover('${g.id}', false)"
            title="${g.label.replace(/\n/, ' ')}${accessible ? '' : ' (Không có quyền truy cập)'}"
            data-accessible="${accessible}">
            <span style="color:var(--hub-item-color);display:flex;align-items:center;justify-content:center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
                stroke-linecap="round" stroke-linejoin="round"
                width="${svgPx}" height="${svgPx}" style="display:block">
                ${g.icon.replace(/<svg[^>]*>/,'').replace('</svg>','')}
              </svg>
            </span>
            <div class="hub-grid-label" style="color:var(--hub-item-color)">${g.label}</div>
            ${accessible ? '' : lockIcon()}
          </button>
        </div>`;
      }).join('');
      return `<div class="hub-grid-row" style="gap:${gapPx}px">${items}</div>`;
    }).join('');

    contentHTML = `<div class="hub-grid-wrapper">${gridRows}</div>`;

  } else {
    // ── RING VIEW (original) ───────────────────────────────────
    const n = visible.length;
    const orbitR = 47;
    const nodesHTML = visible.map((g, i) => {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      const cx = 50 + orbitR * Math.cos(angle);
      const cy = 50 + orbitR * Math.sin(angle);
      const accessible = groupIsAccessible(g);
      const lockedStyle = accessible ? '' : 'opacity:.38;filter:grayscale(.85);cursor:not-allowed;';
      return `
      <div class="hub-node" style="left:${cx}%;top:${cy}%;">
        <button class="hub-icon-btn${isSquare ? ' hub-shape-square' : ''}" id="hub-btn-${g.id}"
          style="
            --hub-item-color:${accessible ? g.color : 'var(--hub-muted)'};
            --hub-item-glow:${accessible ? g.glow : 'transparent'};
            border-radius: ${iconBorderRadius};
            border-width: ${HUB_CONFIG.borderWidth}px;
            border-color: ${accessible ? g.color : 'var(--hub-border)'};
            box-shadow: 0 0 0 0 ${g.glow};
            ${isSquare ? `background:color-mix(in srgb, var(--hub-surface) 94%, ${g.color} 6%);` : ''}
            ${lockedStyle}
          "
          onclick="window._hubSelect('${g.id}')"
          onmouseenter="window._hubHover('${g.id}', true)"
          onmouseleave="window._hubHover('${g.id}', false)"
          title="${g.label.replace(/\n/,' ')}${accessible ? '' : ' (Không có quyền truy cập)'}"
          data-accessible="${accessible}">
          <span style="color:var(--hub-item-color)">${g.icon}</span>
          <div class="hub-node-label" style="color:var(--hub-item-color)">${g.label}</div>
          ${accessible ? '' : lockIcon()}
        </button>
      </div>`;
    }).join('');

    contentHTML = `
    <div class="hub-orbit-wrapper">
      <div class="hub-orbit-track"></div>
      <div class="hub-center">
        <div class="hub-center-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div class="hub-center-label">Chọn phân hệ</div>
      </div>
      ${nodesHTML}
    </div>`;
  }

  hub.innerHTML = `
  <div class="hub-header">
    <h1>HADIWA IOC</h1>
    <p>Trung tâm Điều hành Tích hợp — Chi cục TT-PCTT Hà Nội</p>
    ${user ? `<div class="hub-user-badge">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      ${user.name || user.username}
      <span style="padding:1px 7px;border-radius:4px;font-size:10px;font-weight:700;background:var(--hub-primary-soft);color:var(--hub-primary);border:1px solid var(--hub-border)">${roleLabel}</span>
    </div>` : ''}
  </div>

  ${contentHTML}

  <button class="hub-skip" onclick="window._hubSkip()">
    Vào Dashboard mặc định
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left:4px;vertical-align:middle"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
  </button>`;

  document.body.appendChild(hub);

  // Fade in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => hub.classList.add('visible'));
  });

  // ── Hover effects ─────────────────────────────────────────────
  // TTS: speak module label on hover
  let _hubSpeaking = false;
  function _hubSpeak(text) {
    if (!HUB_CONFIG.sound.enabled) return;
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text.replace(/\n/g, ' '));
    utt.lang   = HUB_CONFIG.sound.lang;
    utt.rate   = HUB_CONFIG.sound.rate;
    utt.pitch  = HUB_CONFIG.sound.pitch;
    utt.volume = HUB_CONFIG.sound.volume;
    window.speechSynthesis.speak(utt);
  }

  window._hubHover = function(id, on) {
    const g = visible.find(x => x.id === id);
    if (!g) return;
    const btn = document.getElementById('hub-btn-' + id);
    if (!btn) return;
    const scale = HUB_CONFIG.hoverScale;
    // Grid buttons: simple scale; Ring buttons: need translate(-50%,-50%) to stay centered
    const isGridBtn = btn.classList.contains('hub-grid-btn');
    if (on) {
      btn.style.transform = isGridBtn
        ? `scale(${scale})`
        : `translate(-50%, -50%) scale(${scale})`;
      btn.style.boxShadow = `0 8px 24px ${g.glow}`;
      btn.style.borderColor = g.color;
      btn.style.borderWidth  = '1px';
      if (isSquare) {
        btn.style.background = `color-mix(in srgb, var(--hub-elevated) 88%, ${g.color} 12%)`;
      } else {
        btn.style.background = `color-mix(in srgb, var(--hub-elevated) 88%, ${g.color} 12%)`;
      }
      _hubSpeak(g.label);
    } else {
      btn.style.transform   = isGridBtn ? 'scale(1)' : 'translate(-50%, -50%) scale(1)';
      btn.style.boxShadow   = '';
      btn.style.borderColor = g.color;
      btn.style.borderWidth = '1px';
      btn.style.background  = `color-mix(in srgb, var(--hub-surface) 94%, ${g.color} 6%)`;
      if (HUB_CONFIG.sound.enabled && window.speechSynthesis) window.speechSynthesis.cancel();
    }
  };

  // ── Toast helper (reuse app's showToast if available) ──────────────
  function _hubToast(msg, type) {
    if (typeof showToast === 'function') { showToast(msg, type || 'warning'); return; }
    // Inline fallback toast
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;top:70px;right:20px;z-index:99999;padding:12px 18px;border-radius:12px;font-size:13px;font-weight:600;background:#1e293b;border:1px solid #f59e0b;color:#fbbf24;box-shadow:0 8px 24px rgba(0,0,0,.5);max-width:340px;transition:opacity .4s';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, 3500);
  }

  // ── Select & dismiss ─────────────────────────────────────────
  window._hubSelect = function(id) {
    const g = visible.find(x => x.id === id);
    if (!g) return;
    // RBAC gate: block if user has no access to this group
    if (!groupIsAccessible(g)) {
      _hubToast(`⛔ Bạn không có quyền truy cập phân hệ "${g.label.replace('\n', ' ')}". Liên hệ Super Admin để được hỗ trợ.`, 'error');
      return;
    }
    // Persist selected hub group — sidebar will filter to this group's menus
    localStorage.setItem('qwc_active_hub', id);
    const targetPage = bestPage(g);
    dismissHub(() => onSelect(targetPage));
  };

  window._hubSkip = function() {
    const saved = localStorage.getItem('qwc_last_page');
    const validIds = typeof MENUS !== 'undefined' ? MENUS.filter(m => m.id).map(m => m.id) : [];
    const dest = (saved && validIds.includes(saved)) ? saved : 'dashboard';
    dismissHub(() => onSelect(dest));
  };

  function dismissHub(cb) {
    hub.classList.add('hiding');
    setTimeout(() => {
      hub.remove();
      delete window._hubSelect;
      delete window._hubHover;
      delete window._hubSkip;
      if (cb) cb();
    }, 520);
  }
};
