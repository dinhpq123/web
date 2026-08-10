/**
 * Master Multi-Brand Theme Engine & Adaptive Semantic Token Resolver
 * System Flow: Brand Seed -> Mode Resolver -> Semantic Theme Tokens -> Component Tokens -> UI
 */

const LOCKED_BRAND_PRESET = 'evg-classic-navy';

const BRAND_SEEDS = {
  'evg-emerald': {
    id: 'evg-emerald',
    name: 'EVG Hadiwa / Primary Green',
    sidebarNavy: '#0B5034',
    sidebarTop: '#137A43',
    sidebarBottom: '#0B5034',
    sidebarCyan: '#8FDEB1',
    sidebarBorder: 'rgba(48, 189, 111, 0.34)',
    successLight: '#30BD6F',
    successDark: '#45D483',
    successTextLight: '#137A43',
    successTextDark: '#83E8AD',
    activeBlue: '#2984EE',
    activeBlueHover: '#1877E7',
    primaryDark: '#45D483',
    primaryDarkHover: '#62DE97',
    navActiveStart: '#30BD6F',
    navActiveEnd: '#27A962',
    navActiveBorder: '#8FDEB1',
    navActiveShadow: '0 0 20px rgba(48,189,111,0.26) inset',
    headerDark: '#0F5B42',
    workspaceDark: 'linear-gradient(180deg, #0C4635 0%, #13553F 100%)',
    brandGreen: '#30BD6F',
    brandGreenHover: '#1BA05C',
    brandGreenActive: '#168B50',
    appBgLight: '#F3F6F9',
    appBgDark: '#0C4635',
    backgroundSecondaryDark: '#11513C',
    backgroundTertiaryDark: '#155E45',
    surfaceDark: '#13553F',
    surfaceSecondaryDark: '#17644A',
    surfaceMutedDark: '#104B39',
    cardDark: '#176348',
    cardAltDark: '#1A6E50',
    cardSelectedDark: '#207A59',
    elevatedDark: '#1E7756',
    inputDark: '#145D45',
    tableHeaderDark: '#145D45',
    tableHoverDark: '#1C7052',
    tableSelectedDark: '#23805D',
    borderDark: 'rgba(176, 235, 205, 0.30)',
    chartGridDark: 'rgba(176, 235, 205, 0.14)',
    tooltipDark: '#0B3D2F',
    textSecondaryDark: '#D9EDE5',
    textMutedDark: '#A9CBBE',
    textDisabledDark: '#769E90'
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
    navActiveStart: '#30BD6F',
    navActiveEnd: '#27A962',
    navActiveText: '#06101F',
    navActiveBorder: '#8FDEB1',
    navActiveShadow: '0 0 20px rgba(48,189,111,0.26) inset',
    sidebarBrandText: '#FFFFFF',
    sidebarControlAccent: '#45D483',
    tickerTextLight: '#137A43',
    tickerTextDark: '#83E8AD',
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
  const darkRatio = getContrastRatio('#06101F', bgHex);
  return whiteRatio >= darkRatio ? '#FFFFFF' : '#06101F';
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

function normalizeThemeHex(value, fallback = '#30BD6F') {
  const raw = String(value || '').trim();
  const short = /^#([0-9a-f]{3})$/i.exec(raw);
  const full = /^#([0-9a-f]{6})$/i.exec(raw);
  if (full) return `#${full[1].toUpperCase()}`;
  if (short) return `#${short[1].split('').map(char => char + char).join('').toUpperCase()}`;
  return fallback;
}

function themeHexToHsl(value) {
  const hex = normalizeThemeHex(value).slice(1);
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;

  if (delta) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta ? delta / (1 - Math.abs(2 * l - 1)) : 0;
  return { h, s: s * 100, l: l * 100 };
}

function themeHslToHex(h, s, l) {
  const hue = ((Number(h) % 360) + 360) % 360;
  const saturation = Math.max(0, Math.min(100, Number(s))) / 100;
  const lightness = Math.max(0, Math.min(100, Number(l))) / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs((hue / 60) % 2 - 1));
  const m = lightness - chroma / 2;
  let rgb = [0, 0, 0];

  if (hue < 60) rgb = [chroma, x, 0];
  else if (hue < 120) rgb = [x, chroma, 0];
  else if (hue < 180) rgb = [0, chroma, x];
  else if (hue < 240) rgb = [0, x, chroma];
  else if (hue < 300) rgb = [x, 0, chroma];
  else rgb = [chroma, 0, x];

  return `#${rgb.map(channel => Math.round((channel + m) * 255).toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

function createCustomBrandSeed(primary = '#30BD6F', darkBrightness = 32, overrides = {}) {
  const brand = normalizeThemeHex(primary);
  const base = themeHexToHsl(brand);
  const hue = base.h;
  const saturation = Math.max(38, Math.min(78, base.s));
  const level = Math.max(22, Math.min(44, Number(darkBrightness) || 32));
  const shade = (lightness, saturationOffset = 0) => themeHslToHex(
    hue,
    Math.max(24, Math.min(82, saturation + saturationOffset)),
    Math.max(8, Math.min(68, lightness))
  );
  const darkSurface = (lightness, saturationOffset = 0) => {
    let candidateLightness = lightness;
    let candidate = shade(candidateLightness, saturationOffset);
    while (candidateLightness > 12 && getContrastRatio('#F8FBFF', candidate) < 4.5) {
      candidateLightness -= 1;
      candidate = shade(candidateLightness, saturationOffset);
    }
    return candidate;
  };
  const hover = shade(Math.max(24, base.l - 7), 2);
  const active = shade(Math.max(20, base.l - 12), 4);
  const darkPrimary = shade(Math.max(58, base.l + 8), -4);
  const customColor = (key, fallback) => overrides[key]
    ? normalizeThemeHex(overrides[key], fallback)
    : fallback;
  const sidebarTop = customColor('sidebarTop', shade(level + 1, 1));
  const sidebarBottom = customColor('sidebarBottom', shade(level - 7, 3));
  const backgroundDark = customColor('backgroundDark', darkSurface(level - 10, -14));
  const surfaceDark = customColor('backgroundDark', darkSurface(level - 3, -16));
  const cardDark = customColor('cardDark', darkSurface(level + 1, -18));
  const elevatedDark = customColor('elevatedDark', darkSurface(level + 8, -22));

  return {
    id: 'custom-brand',
    name: 'Màu thương hiệu tùy chỉnh',
    sidebarNavy: sidebarBottom,
    sidebarTop,
    sidebarBottom,
    sidebarCyan: shade(Math.max(68, level + 34), -18),
    sidebarBorder: themeHexToRgba(brand, 0.34),
    successLight: '#30BD6F',
    successDark: '#45D483',
    successTextLight: '#137A43',
    successTextDark: '#83E8AD',
    activeBlue: '#2984EE',
    activeBlueHover: '#1877E7',
    primaryDark: darkPrimary,
    primaryDarkHover: shade(Math.max(64, base.l + 14), -8),
    navActiveStart: brand,
    navActiveEnd: hover,
    navActiveText: getReadableTextColor(brand),
    navActiveBorder: shade(Math.max(70, level + 38), -18),
    navActiveShadow: `0 0 20px ${themeHexToRgba(brand, 0.26)} inset`,
    headerDark: darkSurface(level - 5, -3),
    workspaceDark: overrides.backgroundDark
      ? backgroundDark
      : `linear-gradient(180deg, ${darkSurface(level - 10, -12)} 0%, ${darkSurface(level - 4, -14)} 100%)`,
    brandGreen: brand,
    brandGreenHover: hover,
    brandGreenActive: active,
    appBgLight: '#F3F6F9',
    appBgDark: backgroundDark,
    backgroundSecondaryDark: darkSurface(level - 6, -14),
    backgroundTertiaryDark: darkSurface(level - 2, -16),
    surfaceDark,
    surfaceSecondaryDark: darkSurface(level + 1, -18),
    surfaceMutedDark: darkSurface(level - 6, -18),
    cardDark,
    cardAltDark: overrides.cardDark ? cardDark : darkSurface(level + 4, -20),
    cardSelectedDark: overrides.elevatedDark ? elevatedDark : darkSurface(level + 7, -18),
    elevatedDark,
    inputDark: darkSurface(level - 1, -20),
    tableHeaderDark: darkSurface(level - 1, -20),
    tableHoverDark: darkSurface(level + 5, -20),
    tableSelectedDark: darkSurface(level + 9, -18),
    borderDark: themeHexToRgba(shade(78, -28), 0.30),
    chartGridDark: themeHexToRgba(shade(78, -28), 0.14),
    tooltipDark: darkSurface(Math.max(14, level - 14), -18),
    textSecondaryDark: '#E1EAE7',
    textMutedDark: '#B6C8C2',
    textDisabledDark: '#849B93'
  };
}

function getCustomPaletteConfig() {
  const defaults = { primary: '#30BD6F', darkBrightness: 32 };
  if (typeof localStorage === 'undefined') return defaults;
  try {
    const stored = JSON.parse(localStorage.getItem('ioc_custom_palette') || '{}');
    const config = {
      primary: normalizeThemeHex(stored.primary, defaults.primary),
      darkBrightness: Math.max(22, Math.min(44, Number(stored.darkBrightness) || defaults.darkBrightness))
    };
    ['sidebarTop', 'sidebarBottom', 'backgroundDark', 'cardDark', 'elevatedDark'].forEach(key => {
      if (stored[key]) config[key] = normalizeThemeHex(stored[key]);
    });
    return config;
  } catch (error) {
    return defaults;
  }
}

function setCustomPaletteConfig(config = {}) {
  const current = getCustomPaletteConfig();
  const next = {
    primary: normalizeThemeHex(config.primary, current.primary),
    darkBrightness: Math.max(22, Math.min(44, Number(config.darkBrightness) || current.darkBrightness))
  };
  ['sidebarTop', 'sidebarBottom', 'backgroundDark', 'cardDark', 'elevatedDark'].forEach(key => {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      if (config[key]) next[key] = normalizeThemeHex(config[key]);
    } else if (current[key]) {
      next[key] = current[key];
    }
  });
  BRAND_SEEDS['custom-brand'] = createCustomBrandSeed(next.primary, next.darkBrightness, next);
  if (typeof localStorage !== 'undefined') localStorage.setItem('ioc_custom_palette', JSON.stringify(next));
  return next;
}

{
  const customPalette = getCustomPaletteConfig();
  BRAND_SEEDS['custom-brand'] = createCustomBrandSeed(
    customPalette.primary,
    customPalette.darkBrightness,
    customPalette
  );
}

// ── ADAPTIVE SEMANTIC TOKEN RESOLVER ─────────────────────────────────

function resolveSemanticTokens(presetId = LOCKED_BRAND_PRESET, isDark = false) {
  presetId = LOCKED_BRAND_PRESET;
  const seed = BRAND_SEEDS[LOCKED_BRAND_PRESET];
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

    const brandPrimary = seed.brandGreen || '#30BD6F';
    // Light mode follows EVG's restrained white navigation rail. The navy
    // sidebar remains intact in the dark preset below.
    const sidebarLightBg = '#FFFFFF';
    const sidebarLightBorder = '#E4E6EF';
    const sidebarGroupLabel = '#168A4B';
    const sidebarItemHover = '#F4FBF7';
    const sidebarItemActive = '#EAF8F0';
    const sidebarLightActiveBorder = '#C8EFD8';
    const sidebarLightActiveShadow = `inset 3px 0 0 ${brandPrimary}`;
    const sidebarText = '#494968';
    const sidebarTextActive = '#137A43';
    const sidebarBrandText = '#18183E';
    const sidebarControlAccent = brandPrimary;
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

      '--color-sidebar-background': sidebarLightBg,
      '--color-sidebar-border': sidebarLightBorder,
      '--color-sidebar-item-hover': sidebarItemHover,
      '--color-sidebar-item-active': sidebarItemActive,
      '--color-sidebar-text': sidebarText,
      '--color-sidebar-text-active': sidebarTextActive,
      '--color-sidebar-group-label': sidebarGroupLabel,
      '--color-sidebar-brand-text': sidebarBrandText,
      '--color-sidebar-control-accent': sidebarControlAccent,

      '--color-text-primary': textPrimary,
      '--color-text-secondary': textSecondary,
      '--color-text-muted': textMuted,
      '--color-text-disabled': textDisabled,
      '--color-text-inverse': '#FFFFFF',

      '--color-primary': brandPrimary,
      '--color-primary-hover': primaryHover,
      '--color-primary-pressed': primaryPressed,
      '--color-primary-soft': primarySoft,

      '--color-tab-list-border': '#DBDFF1',
      '--color-tab-background': '#EEF1F6',
      '--color-tab-hover-background': '#E4E9F1',
      '--color-tab-text': '#7E8299',
      '--color-tab-hover-text': '#494968',
      '--color-tab-active-background': buttonPrimaryBackground,
      '--color-tab-active-text': buttonPrimaryText,
      '--color-tab-focus': brandPrimary,
      '--color-tab-active-shadow': `0 4px 12px ${themeHexToRgba(buttonPrimaryBackground, 0.24)}`,

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
      '--ticker-text': seed.tickerTextLight || textSecondary,
      '--bg-sidebar': sidebarLightBg,
      '--bg-dropdown': '#FFFFFF',
      '--bg-dropdown2': '#F9F9F9',
      '--sidebar-background': sidebarLightBg,
      '--sidebar-border': sidebarLightBorder,
      '--sidebar-item-hover': sidebarItemHover,
      '--sidebar-item-active': sidebarItemActive,
      '--sidebar-active-border': sidebarLightActiveBorder,
      '--sidebar-active-shadow': sidebarLightActiveShadow,
      '--sidebar-text': sidebarText,
      '--sidebar-text-active': sidebarTextActive,
      '--sidebar-section-accent': sidebarGroupLabel,
      '--sidebar-brand-text': sidebarBrandText,
      '--sidebar-control-accent': sidebarControlAccent,
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
    const backgroundSecondary = seed.backgroundSecondaryDark || '#102743';
    const backgroundTertiary = seed.backgroundTertiaryDark || '#163157';
    const surfaceSecondary = seed.surfaceSecondaryDark || '#18355F';
    const surfaceMuted = seed.surfaceMutedDark || '#122A4A';
    const cardAlt = seed.cardAltDark || '#1D4076';
    const cardSelected = seed.cardSelectedDark || '#244C87';
    const inputBg = seed.inputDark || '#15345F';
    const tableHeader = seed.tableHeaderDark || '#173762';
    const tableHover = seed.tableHoverDark || '#1E447B';
    const tableSelected = seed.tableSelectedDark || '#254F8D';
    const cardBorder = seed.borderDark || 'rgba(91, 169, 255, 0.24)';
    const chartGrid = seed.chartGridDark || 'rgba(91, 169, 255, 0.10)';
    const tooltipBg = seed.tooltipDark || '#071629';
    const textPrimary = '#F8FBFF';
    const textSecondary = seed.textSecondaryDark || '#D1E2F4';
    const textMuted = seed.textMutedDark || '#A4B8CD';
    const textDisabled = seed.textDisabledDark || '#71849A';

    const sidebarGroupLabel = seed.sidebarCyan;
    const sidebarItemActive = sidebarActive;

    const brandPrimary = seed.primaryDark || seed.brandGreen || '#45D483';
    const sidebarBrandText = seed.sidebarBrandText || '#FFFFFF';
    const sidebarControlAccent = seed.sidebarControlAccent || seed.sidebarBrandAccent || sidebarGroupLabel || brandPrimary;
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
      '--color-background-secondary': backgroundSecondary,
      '--color-background-tertiary': backgroundTertiary,
      '--color-surface': surface,
      '--color-surface-secondary': surfaceSecondary,
      '--color-surface-elevated': elevated,
      '--color-surface-muted': surfaceMuted,
      '--color-surface-selected': themeHexToRgba(seed.brandGreen || '#30BD6F', 0.18),

      '--color-card-background': cardBg,
      '--color-card-background-alt': cardAlt,
      '--color-card-selected-background': cardSelected,
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
      '--color-sidebar-text-active': seed.navActiveText || '#FFFFFF',
      '--color-sidebar-group-label': sidebarGroupLabel,
      '--color-sidebar-brand-text': sidebarBrandText,
      '--color-sidebar-control-accent': sidebarControlAccent,

      '--color-text-primary': textPrimary,
      '--color-text-secondary': textSecondary,
      '--color-text-muted': textMuted,
      '--color-text-disabled': textDisabled,
      '--color-text-inverse': '#18183E',

      '--color-primary': brandPrimary,
      '--color-primary-hover': primaryHover,
      '--color-primary-pressed': primaryPressed,
      '--color-primary-soft': primarySoft,

      '--color-tab-list-border': cardBorder,
      '--color-tab-background': surfaceMuted,
      '--color-tab-hover-background': cardAlt,
      '--color-tab-text': textMuted,
      '--color-tab-hover-text': textPrimary,
      '--color-tab-active-background': buttonPrimaryBackground,
      '--color-tab-active-text': buttonPrimaryText,
      '--color-tab-focus': brandPrimary,
      '--color-tab-active-shadow': `0 4px 14px ${themeHexToRgba(buttonPrimaryBackground, 0.28)}`,

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
      '--color-button-secondary-background': cardAlt,
      '--color-button-secondary-text': textPrimary,

      '--color-input-background': inputBg,
      '--color-input-text': textPrimary,
      '--color-input-placeholder': textMuted,
      '--color-input-border': cardBorder,
      '--color-input-border-focus': brandPrimary,

      '--color-table-background': surface,
      '--color-table-header-background': tableHeader,
      '--color-table-row-background': surface,
      '--color-table-row-hover': tableHover,
      '--color-table-row-selected': tableSelected,

      '--color-dialog-background': surface,
      '--color-dialog-title': textPrimary,
      '--color-dialog-message': textSecondary,

      '--color-chart-grid': chartGrid,
      '--color-chart-axis': textMuted,
      '--color-chart-tooltip-background': tooltipBg,
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
      '--bg-secondary': surfaceSecondary,
      '--bg-tertiary': cardAlt,
      '--bg-hover': themeHexToRgba(seed.brandGreen || '#30BD6F', 0.10),
      '--bg-selected': themeHexToRgba(seed.brandGreen || '#30BD6F', 0.18),
      '--bg-header': surface,
      '--header-background': headerBackground,
      '--ticker-background': tickerBackground,
      '--ticker-border': cardBorder,
      '--ticker-text': seed.tickerTextDark || textSecondary,
      '--bg-sidebar': sidebarBg,
      '--bg-dropdown': elevated,
      '--bg-dropdown2': surfaceSecondary,
      '--sidebar-background': sidebarBg,
      '--sidebar-border': sidebarBorder,
      '--sidebar-item-hover': sidebarActive,
      '--sidebar-item-active': sidebarItemActive,
      '--sidebar-active-border': sidebarActiveBorder,
      '--sidebar-active-shadow': sidebarActiveShadow,
      '--sidebar-text': textPrimary,
      '--sidebar-text-active': seed.navActiveText || '#FFFFFF',
      '--sidebar-section-accent': sidebarGroupLabel,
      '--sidebar-brand-text': sidebarBrandText,
      '--sidebar-control-accent': sidebarControlAccent,
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
  const currentPreset = LOCKED_BRAND_PRESET;
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
  localStorage.removeItem('ioc_custom_palette');
  localStorage.removeItem('ioc_palette_position');
  localStorage.removeItem('ioc_login_palette_position');
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
    normalizeThemeHex,
    createCustomBrandSeed,
    getCustomPaletteConfig,
    setCustomPaletteConfig,
    resolveSemanticTokens,
    applyGlobalTheme
  };
}
