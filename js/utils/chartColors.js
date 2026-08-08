// ── HADIWA IOC — Chart Color Helper v1.0 ──────────────────────────
// Reads the live CSS custom properties (set on :root / body.light / body.dark
// in css/main.css) so Chart.js charts adapt to the active brand preset and
// light/dark mode. Call getChartPalette() fresh each time a chart is
// (re)rendered — do NOT cache the result at module load time, since the
// theme can change at runtime.

window.getThemeColor = function(varName, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v || fallback;
};

// Convert a '#rrggbb' (or 'rgb(...)') theme color into an 'rgba(r,g,b,a)'
// string, for chart fills that need alpha blending under a line.
window.hexToRgba = function(color, alpha) {
  let r, g, b;
  const hexMatch = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color.replace('#', ''));
  if (hexMatch) {
    r = parseInt(hexMatch[1], 16);
    g = parseInt(hexMatch[2], 16);
    b = parseInt(hexMatch[3], 16);
  } else {
    const rgbMatch = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(color);
    if (rgbMatch) {
      r = +rgbMatch[1]; g = +rgbMatch[2]; b = +rgbMatch[3];
    } else {
      return color;
    }
  }
  return `rgba(${r},${g},${b},${alpha})`;
};

window.getChartPalette = function() {
  return {
    primary: getThemeColor('--primary', '#2984EE'),
    info: getThemeColor('--info', '#2984EE'),
    cyan: getThemeColor('--cyan', '#4DE9DC'),
    success: getThemeColor('--success', '#285CAA'),
    warning: getThemeColor('--warning', '#F6C000'),
    danger: getThemeColor('--danger', '#E14E54'),
    text: getThemeColor('--text', '#18183E'),
    textSecondary: getThemeColor('--text-2', '#494968'),
    textMuted: getThemeColor('--muted', '#5F6678'),
    surface: getThemeColor('--bg-surface', '#FFFFFF'),
    border: getThemeColor('--border', '#DBDFF1'),
    gridLine: getThemeColor('--border', '#DBDFF1'),
  };
};
