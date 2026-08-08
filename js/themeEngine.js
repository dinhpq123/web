/**
 * Master Multi-Brand Theme Engine & Adaptive Semantic Token Resolver
 * System Flow: Brand Seed -> Mode Resolver -> Semantic Theme Tokens -> Component Tokens -> UI
 */

const BRAND_SEEDS = {
  'evg-emerald': {
    id: 'evg-emerald',
    name: 'EVG Hadiwa / Teal Green',
    sidebarNavy: '#123D42',
    sidebarTop: '#0F5B55',
    sidebarBottom: '#123D42',
    sidebarCyan: '#8BE7B5',
    sidebarBorder: 'rgba(139, 231, 181, 0.22)',
    successLight: '#30BD6F',
    successDark: '#45D483',
    successTextLight: '#137A43',
    successTextDark: '#83E8AD',
    activeBlue: '#2984EE',
    activeBlueHover: '#1877E7',
    primaryDark: '#45D483',
    primaryDarkHover: '#62DE97',
    navActiveStart: 'rgba(48,189,111,0.12)',
    navActiveEnd: 'rgba(48,189,111,0.30)',
    navActiveBorder: '#58CB89',
    navActiveShadow: '0 0 22px rgba(48,189,111,0.28) inset',
    headerDark: '#192B54',
    workspaceDark: 'linear-gradient(180deg, #0B1D33 0%, #142D52 100%)',
    brandGreen: '#30BD6F',
    brandGreenHover: '#1BA05C',
    brandGreenActive: '#168B50',
    appBgLight: '#F3F6F9',
    appBgDark: '#0B1D33',
    surfaceDark: '#142D52',
    cardDark: '#193A6D',
    elevatedDark: '#20457E'
  },
  'evg-classic-navy': {
    id: 'evg-classic-navy',
    name: 'EVG Classic Navy (Backup)',
    sidebarNavy: '#192B54',
    sidebarTop: '#1E3883',
    sidebarBottom: '#192B54',
    sidebarCyan: '#1EF5DF',
    sidebarBorder: 'rgba(113, 166, 255, 0.28)',
    successLight: '#30BD6F',
    successDark: '#45D483',
    successTextLight: '#137A43',
    successTextDark: '#83E8AD',
    activeBlue: '#2984EE',
    activeBlueHover: '#1877E7',
    primaryDark: '#45D483',
    primaryDarkHover: '#62DE97',
    navActiveStart: 'rgba(77,191,252,0.05)',
    navActiveEnd: 'rgba(77,179,252,0.50)',
    navActiveBorder: '#41A7FF',
    navActiveShadow: '0 0 25px #4C76D6B2 inset',
    headerDark: '#192B54',
    workspaceDark: 'linear-gradient(180deg, #1E3883 0%, #192B54 100%)',
    brandGreen: '#30BD6F',
    brandGreenHover: '#1BA05C',
    brandGreenActive: '#168B50',
    appBgLight: '#F3F6F9',
    appBgDark: '#0B1D33',
    surfaceDark: '#142D52',
    cardDark: '#193A6D',
    elevatedDark: '#20457E'
  },
  'hadiwa-original': {
    id: 'hadiwa-original',
    name: 'Hadiwa Nguyên bản',
    sidebarNavy: '#071629',
    sidebarCyan: '#00F2FF',
    activeBlue: '#2984EE',
    brandGreen: '#2DD4BF',
    appBgLight: '#F0F4F8',
    appBgDark: '#030E1C'
  },
  'violet-intelligence': {
    id: 'violet-intelligence',
    name: 'Trí tuệ Xanh AI',
    sidebarNavy: '#130924',
    sidebarCyan: '#3699FF',
    activeBlue: '#2984EE',
    brandGreen: '#10B981',
    appBgLight: '#F5F3FF',
    appBgDark: '#0B0F19'
  },
  'ocean-technology': {
    id: 'ocean-technology',
    name: 'Hạ tầng Đại dương',
    sidebarNavy: '#0A182E',
    sidebarCyan: '#0EA5E9',
    activeBlue: '#0369A1',
    brandGreen: '#10B981',
    appBgLight: '#F0F6FA',
    appBgDark: '#08142C'
  },
  'emerald-water': {
    id: 'emerald-water',
    name: 'Nước Ngọc lục ESG',
    sidebarNavy: '#062017',
    sidebarCyan: '#34D399',
    activeBlue: '#059669',
    brandGreen: '#10B981',
    appBgLight: '#F0FDF4',
    appBgDark: '#041C15'
  },
  'sunset-operations': {
    id: 'sunset-operations',
    name: 'Vận hành Hoàng hôn',
    sidebarNavy: '#1E120D',
    sidebarCyan: '#F59E0B',
    activeBlue: '#EA580C',
    brandGreen: '#10B981',
    appBgLight: '#FFFBEB',
    appBgDark: '#181210'
  },
  'graphite-gold': {
    id: 'graphite-gold',
    name: 'Lãnh đạo Than chì',
    sidebarNavy: '#17181C',
    sidebarCyan: '#F59E0B',
    activeBlue: '#B45309',
    brandGreen: '#10B981',
    appBgLight: '#F8FAFC',
    appBgDark: '#121316'
  },
  'arctic-corporate': {
    id: 'arctic-corporate',
    name: 'Doanh nghiệp Bắc cực',
    sidebarNavy: '#0F172A',
    sidebarCyan: '#38BDF8',
    activeBlue: '#1D4ED8',
    brandGreen: '#10B981',
    appBgLight: '#F1F5F9',
    appBgDark: '#0F172A'
  }
};

// ── COLOR & CONTRAST UTILITIES ─────────────────────────────────────

function getLuminance(hex) {
  if (!hex || typeof hex !== 'string') return 0;
  let c = hex.replace('#', '').trim();
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  if (c.length !== 6) return 0;
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  const a = [r, g, b].map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const max = Math.max(l1, l2);
  const min = Math.min(l1, l2);
  return (max + 0.05) / (min + 0.05);
}

function getReadableTextColor(bgHex) {
  const whiteRatio = getContrastRatio('#FFFFFF', bgHex);
  const darkRatio = getContrastRatio('#18183E', bgHex);
  return whiteRatio >= darkRatio ? '#FFFFFF' : '#18183E';
}

function ensureContrast(textColor, bgHex, minRatio = 4.5) {
  const ratio = getContrastRatio(textColor, bgHex);
  if (ratio >= minRatio) return textColor;
  return getReadableTextColor(bgHex);
}

function themeHexToRgba(hex, alpha) {
  const clean = hex.replace('#', '');
  const value = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
  if (Number.isNaN(value)) return `rgba(41, 132, 238, ${alpha})`;
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
}

// ── ADAPTIVE SEMANTIC TOKEN RESOLVER ─────────────────────────────────

function resolveSemanticTokens(presetId = 'evg-emerald', isDark = false) {
  const seed = BRAND_SEEDS[presetId] || BRAND_SEEDS['evg-emerald'];
  const sidebarBg = `linear-gradient(180deg, ${seed.sidebarTop || seed.sidebarNavy} 0%, ${seed.sidebarBottom || seed.sidebarNavy} 100%)`;
  const sidebarActive = `linear-gradient(180deg, ${seed.navActiveStart || seed.activeBlue} 0%, ${seed.navActiveEnd || seed.activeBlueEnd || seed.activeBlue} 100%)`;
  const sidebarBorder = seed.sidebarBorder || 'rgba(255, 255, 255, 0.16)';
  const sidebarActiveBorder = seed.navActiveBorder || seed.activeBlue || '#2984EE';
  const sidebarActiveShadow = seed.navActiveShadow || `0 0 22px ${themeHexToRgba(seed.activeBlue || '#2984EE', 0.28)} inset`;

  if (!isDark) {
    // ── LIGHT MODE VISUAL HIERARCHY ──
    const appBg = seed.appBgLight || '#F6F8F5';
    const surface = '#FFFFFF';
    const cardBg = '#FFFFFF';
    const cardBorder = '#DBDFF1';
    const textPrimary = '#18183E';
    const textSecondary = '#494968';
    const textMuted = '#5F6678';
    const textDisabled = '#9CA2B8';

    // Sidebar stays Navy in Light Mode for EVG CMS!
    const sidebarGroupLabel = seed.sidebarCyan;
    const sidebarItemActive = sidebarActive;
    const sidebarText = '#FFFFFF';
    const sidebarTextActive = '#FFFFFF';

    const brandPrimary = seed.brandGreen || '#30BD6F';
    const primaryHover = seed.brandGreenHover || '#1BA05C';
    const primaryPressed = seed.brandGreenActive || '#168B50';
    const primarySoft = themeHexToRgba(brandPrimary, 0.12);
    const success = seed.successLight || '#34C759';
    const successText = seed.successTextLight || ensureContrast(success, surface, 4.5);
    const successSoft = themeHexToRgba(success, 0.12);
    const buttonPrimaryBackground = brandPrimary;
    const buttonPrimaryHover = primaryHover;
    const buttonPrimaryText = ensureContrast('#FFFFFF', buttonPrimaryBackground, 4.5);
    const primaryText = seed.successTextLight || ensureContrast(primaryPressed, surface, 4.5);
    const headerBackground = '#FFFFFF';
    const tickerBackground = '#EEF1FA';

    return {
      '--color-background': appBg,
      '--color-background-secondary': '#EEF1FA',
      '--color-background-tertiary': '#F9F9F9',
      '--color-surface': surface,
      '--color-surface-secondary': '#F0F4F8',
      '--color-surface-elevated': '#FFFFFF',
      '--color-surface-muted': '#F4F6F9',
      '--color-surface-selected': 'rgba(41, 132, 238, 0.12)',

      '--color-card-background': cardBg,
      '--color-card-background-alt': '#F8FAFC',
      '--color-card-selected-background': '#F0F7FF',
      '--color-card-border': cardBorder,
      '--color-card-selected-border': seed.activeBlue,
      '--color-card-shadow': '0 2px 12px rgba(24, 24, 62, 0.06)',

      '--color-header-background': '#FFFFFF',
      '--color-header-border': cardBorder,
      '--color-header-text-primary': textPrimary,
      '--color-header-text-secondary': textSecondary,

      '--color-sidebar-background': sidebarBg,
      '--color-sidebar-border': sidebarBorder,
      '--color-sidebar-item-hover': sidebarActive,
      '--color-sidebar-item-active': sidebarItemActive,
      '--color-sidebar-text': sidebarText,
      '--color-sidebar-text-active': sidebarTextActive,
      '--color-sidebar-group-label': sidebarGroupLabel,

      '--color-text-primary': textPrimary,
      '--color-text-secondary': textSecondary,
      '--color-text-muted': textMuted,
      '--color-text-disabled': textDisabled,
      '--color-text-inverse': '#FFFFFF',

      '--color-primary': brandPrimary,
      '--color-primary-hover': primaryHover,
      '--color-primary-pressed': primaryPressed,
      '--color-primary-soft': primarySoft,

      '--color-success': success,
      '--color-success-soft': successSoft,
      '--color-warning': '#946200',
      '--color-warning-soft': '#FFF8DD',
      '--color-danger': '#E14E54',
      '--color-danger-soft': '#FFF5F8',
      '--color-info': seed.activeBlue,
      '--color-info-soft': 'rgba(41, 132, 238, 0.12)',

      '--color-button-primary-background': buttonPrimaryBackground,
      '--color-button-primary-hover': buttonPrimaryHover,
      '--color-button-primary-text': buttonPrimaryText,
      '--color-button-secondary-background': '#EEF1FA',
      '--color-button-secondary-text': textPrimary,

      '--color-input-background': '#FFFFFF',
      '--color-input-text': textPrimary,
      '--color-input-placeholder': textMuted,
      '--color-input-border': cardBorder,
      '--color-input-border-focus': '#20B970',

      '--color-table-background': '#FFFFFF',
      '--color-table-header-background': '#F8FAFC',
      '--color-table-row-background': '#FFFFFF',
      '--color-table-row-hover': '#F0F7FF',
      '--color-table-row-selected': '#E0F0FF',

      '--color-dialog-background': '#FFFFFF',
      '--color-dialog-title': textPrimary,
      '--color-dialog-message': textSecondary,

      '--color-chart-grid': 'rgba(24, 24, 62, 0.08)',
      '--color-chart-axis': textMuted,
      '--color-chart-tooltip-background': '#18183E',
      '--color-chart-tooltip-text': '#FFFFFF',

      '--color-map-popup-background': '#FFFFFF',
      '--color-map-popup-text': textPrimary,

      '--color-loading-indicator': brandPrimary,
      '--color-empty-state-text': textMuted,
      '--color-error-state-text': '#E14E54',

      // Backward compatibility aliases
      '--bg-app': appBg,
      '--bg-base': appBg,
      '--workspace-background': appBg,
      '--bg-surface': surface,
      '--bg-card': cardBg,
      '--bg-elevated': '#FFFFFF',
      '--bg-secondary': '#EEF1FA',
      '--bg-tertiary': '#F9F9F9',
      '--bg-hover': 'rgba(41, 132, 238, 0.08)',
      '--bg-selected': 'rgba(41, 132, 238, 0.12)',
      '--bg-header': '#FFFFFF',
      '--header-background': headerBackground,
      '--ticker-background': tickerBackground,
      '--ticker-border': cardBorder,
      '--ticker-text': textSecondary,
      '--bg-sidebar': sidebarBg,
      '--bg-dropdown': '#FFFFFF',
      '--bg-dropdown2': '#F9F9F9',
      '--sidebar-background': sidebarBg,
      '--sidebar-border': sidebarBorder,
      '--sidebar-item-hover': sidebarActive,
      '--sidebar-item-active': sidebarItemActive,
      '--sidebar-active-border': sidebarActiveBorder,
      '--sidebar-active-shadow': sidebarActiveShadow,
      '--sidebar-text': sidebarText,
      '--sidebar-text-active': sidebarTextActive,
      '--sidebar-section-accent': sidebarGroupLabel,
      '--text': textPrimary,
      '--text-primary': textPrimary,
      '--text-2': textSecondary,
      '--text-secondary': textSecondary,
      '--muted': textMuted,
      '--text-muted': textMuted,
      '--border': cardBorder,
      '--primary': brandPrimary,
      '--primary-hover': primaryHover,
      '--primary-active': primaryPressed,
      '--primary-soft': primarySoft,
      '--primary-text': primaryText,
      '--button-primary-background': buttonPrimaryBackground,
      '--button-primary-hover': buttonPrimaryHover,
      '--button-primary-text': buttonPrimaryText,
      '--border-focus': '#20B970',
      '--focus-ring': '0 0 0 3px rgba(32, 185, 112, 0.18)',
      '--info': seed.activeBlue,
      '--purple': seed.activeBlue,
      '--cyan': seed.sidebarCyan,
      '--success': success,
      '--success-hover': seed.successTextLight || success,
      '--success-soft': successSoft,
      '--success-text': successText,
      '--warning': '#946200',
      '--danger': '#E14E54'
    };
  } else {
    // ── DARK MODE VISUAL HIERARCHY ──
    const appBg = seed.appBgDark || '#0D1B2A';
    const surface = seed.surfaceDark || '#172844';
    const cardBg = seed.cardDark || '#1B3153';
    const elevated = seed.elevatedDark || '#223B61';
    const cardBorder = 'rgba(91, 169, 255, 0.24)';
    const textPrimary = '#F8FBFF';
    const textSecondary = '#D1E2F4';
    const textMuted = '#A4B8CD';
    const textDisabled = '#71849A';

    const sidebarGroupLabel = seed.sidebarCyan;
    const sidebarItemActive = sidebarActive;

    const brandPrimary = seed.primaryDark || seed.brandGreen || '#45D483';
    const primaryHover = seed.primaryDarkHover || '#62DE97';
    const primaryPressed = seed.brandGreenActive || '#32BA70';
    const primarySoft = themeHexToRgba(brandPrimary, 0.16);
    const success = seed.successDark || '#34C759';
    const successText = seed.successTextDark || ensureContrast(success, surface, 4.5);
    const successSoft = themeHexToRgba(success, 0.16);
    const buttonPrimaryBackground = seed.brandGreen || '#30BD6F';
    const buttonPrimaryHover = seed.brandGreenHover || '#1BA05C';
    const buttonPrimaryText = ensureContrast('#FFFFFF', buttonPrimaryBackground, 4.5);
    const primaryText = seed.successTextDark || ensureContrast(brandPrimary, surface, 4.5);
    const navigationBase = seed.headerDark || seed.sidebarBottom || seed.sidebarNavy;
    const headerBackground = `linear-gradient(90deg, ${navigationBase} 0%, ${surface} 100%)`;
    const tickerBackground = `linear-gradient(90deg, ${surface} 0%, ${navigationBase} 50%, ${surface} 100%)`;
    const workspaceBackground = seed.workspaceDark || `linear-gradient(180deg, ${appBg} 0%, ${surface} 100%)`;

    return {
      '--color-background': appBg,
      '--color-background-secondary': '#102743',
      '--color-background-tertiary': '#163157',
      '--color-surface': surface,
      '--color-surface-secondary': '#18355F',
      '--color-surface-elevated': elevated,
      '--color-surface-muted': '#122A4A',
      '--color-surface-selected': 'rgba(75, 145, 241, 0.22)',

      '--color-card-background': cardBg,
      '--color-card-background-alt': '#1D4076',
      '--color-card-selected-background': '#244C87',
      '--color-card-border': cardBorder,
      '--color-card-selected-border': seed.sidebarCyan,
      '--color-card-shadow': '0 10px 28px rgba(2, 10, 24, 0.28)',

      '--color-header-background': surface,
      '--color-header-border': cardBorder,
      '--color-header-text-primary': textPrimary,
      '--color-header-text-secondary': textSecondary,

      '--color-sidebar-background': sidebarBg,
      '--color-sidebar-border': sidebarBorder,
      '--color-sidebar-item-hover': sidebarActive,
      '--color-sidebar-item-active': sidebarItemActive,
      '--color-sidebar-text': textPrimary,
      '--color-sidebar-text-active': '#FFFFFF',
      '--color-sidebar-group-label': sidebarGroupLabel,

      '--color-text-primary': textPrimary,
      '--color-text-secondary': textSecondary,
      '--color-text-muted': textMuted,
      '--color-text-disabled': textDisabled,
      '--color-text-inverse': '#18183E',

      '--color-primary': brandPrimary,
      '--color-primary-hover': primaryHover,
      '--color-primary-pressed': primaryPressed,
      '--color-primary-soft': primarySoft,

      '--color-success': success,
      '--color-success-soft': successSoft,
      '--color-warning': '#F6C000',
      '--color-warning-soft': 'rgba(246, 192, 0, 0.16)',
      '--color-danger': '#E14E54',
      '--color-danger-soft': 'rgba(225, 78, 84, 0.16)',
      '--color-info': seed.activeBlue,
      '--color-info-soft': 'rgba(41, 132, 238, 0.16)',

      '--color-button-primary-background': buttonPrimaryBackground,
      '--color-button-primary-hover': buttonPrimaryHover,
      '--color-button-primary-text': buttonPrimaryText,
      '--color-button-secondary-background': '#1D4076',
      '--color-button-secondary-text': textPrimary,

      '--color-input-background': '#15345F',
      '--color-input-text': textPrimary,
      '--color-input-placeholder': textMuted,
      '--color-input-border': cardBorder,
      '--color-input-border-focus': brandPrimary,

      '--color-table-background': surface,
      '--color-table-header-background': '#173762',
      '--color-table-row-background': surface,
      '--color-table-row-hover': '#1E447B',
      '--color-table-row-selected': '#254F8D',

      '--color-dialog-background': surface,
      '--color-dialog-title': textPrimary,
      '--color-dialog-message': textSecondary,

      '--color-chart-grid': 'rgba(91, 169, 255, 0.10)',
      '--color-chart-axis': textMuted,
      '--color-chart-tooltip-background': '#071629',
      '--color-chart-tooltip-text': '#FFFFFF',

      '--color-map-popup-background': surface,
      '--color-map-popup-text': textPrimary,

      '--color-loading-indicator': brandPrimary,
      '--color-empty-state-text': textMuted,
      '--color-error-state-text': '#FF6B73',

      // Backward compatibility aliases
      '--bg-app': appBg,
      '--bg-base': appBg,
      '--workspace-background': workspaceBackground,
      '--bg-surface': surface,
      '--bg-card': cardBg,
      '--bg-elevated': elevated,
      '--bg-secondary': '#18355F',
      '--bg-tertiary': '#1D4076',
      '--bg-hover': 'rgba(75, 145, 241, 0.13)',
      '--bg-selected': 'rgba(75, 145, 241, 0.22)',
      '--bg-header': surface,
      '--header-background': headerBackground,
      '--ticker-background': tickerBackground,
      '--ticker-border': cardBorder,
      '--ticker-text': textSecondary,
      '--bg-sidebar': sidebarBg,
      '--bg-dropdown': elevated,
      '--bg-dropdown2': '#18355F',
      '--sidebar-background': sidebarBg,
      '--sidebar-border': sidebarBorder,
      '--sidebar-item-hover': sidebarActive,
      '--sidebar-item-active': sidebarItemActive,
      '--sidebar-active-border': sidebarActiveBorder,
      '--sidebar-active-shadow': sidebarActiveShadow,
      '--sidebar-text': textPrimary,
      '--sidebar-text-active': '#FFFFFF',
      '--sidebar-section-accent': sidebarGroupLabel,
      '--text': textPrimary,
      '--text-primary': textPrimary,
      '--text-2': textSecondary,
      '--text-secondary': textSecondary,
      '--muted': textMuted,
      '--text-muted': textMuted,
      '--border': cardBorder,
      '--primary': brandPrimary,
      '--primary-hover': primaryHover,
      '--primary-active': primaryPressed,
      '--primary-soft': primarySoft,
      '--primary-text': primaryText,
      '--button-primary-background': buttonPrimaryBackground,
      '--button-primary-hover': buttonPrimaryHover,
      '--button-primary-text': buttonPrimaryText,
      '--border-focus': brandPrimary,
      '--focus-ring': `0 0 0 3px ${themeHexToRgba(brandPrimary, 0.22)}`,
      '--info': seed.activeBlue,
      '--purple': seed.activeBlue,
      '--cyan': seed.sidebarCyan,
      '--success': success,
      '--success-soft': successSoft,
      '--success-text': successText,
      '--warning': '#F6C000',
      '--danger': '#E14E54'
    };
  }
}

function applyGlobalTheme(presetId = null, mode = null) {
  const currentPreset = presetId || localStorage.getItem('ioc_brand_preset') || 'evg-emerald';
  const currentMode = mode || localStorage.getItem('ioc_theme') || 'light';
  const isDark = currentMode === 'dark';

  if (isDark) {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
  } else {
    document.body.classList.add('light');
    document.body.classList.remove('dark');
  }

  document.body.setAttribute('data-brand-preset', currentPreset);
  localStorage.setItem('ioc_brand_preset', currentPreset);
  localStorage.setItem('ioc_theme', currentMode);

  const tokens = resolveSemanticTokens(currentPreset, isDark);
  const root = document.documentElement;

  for (const [prop, val] of Object.entries(tokens)) {
    root.style.setProperty(prop, val);
    document.body.style.setProperty(prop, val);
  }

  // Mode classes on body are static no-JS fallbacks. Runtime tokens must also
  // live on body so descendants do not inherit stale fallback values.

  console.log(`[ThemeEngine] Applied Preset: ${currentPreset} | Mode: ${currentMode}`);
}

// Global Export
if (typeof window !== 'undefined') {
  window.BRAND_SEEDS = BRAND_SEEDS;
  window.ThemeEngine = {
    getContrastRatio,
    getReadableTextColor,
    ensureContrast,
    resolveSemanticTokens,
    applyGlobalTheme
  };
}
