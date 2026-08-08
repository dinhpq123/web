---
name: adaptive-semantic-theme
description: >-
  Apply a coherent, accessible, adaptive (light/dark, multi-brand) theme to ANY
  web codebase — Vanilla HTML/CSS/JS, React, Vue, Angular, Svelte, or mixed —
  from a Brand Seed. Use this whenever someone wants to apply, migrate, unify, or
  refactor colors/theme/dark-mode/brand presets on an existing project, gives you
  brand colors and wants the whole app to adopt them, or reports that light mode
  is broken / text is invisible / the app is tinted one color. Runs four phases:
  discover the source, generate semantic tokens, migrate components to tokens,
  validate coverage + WCAG. A brand color is a SEED, not a coat of paint — this
  skill enforces that so the app never turns one color and no screen is left
  un-themed. Strictly scoped to styling: never changes business logic, routes,
  auth, or component behavior.
---

# Adaptive Semantic Theme

A Brand Seed is a few colors. A theme is ~180 semantic decisions per mode. This
skill does the translation for any web project, correctly:

```
Brand Seed  →  Mode Resolver  →  Semantic Tokens  →  Component Tokens  →  UI
```

**The one rule that prevents every ugly outcome:** a component never reads a
brand color; it reads a *semantic role* (`surface`, `textPrimary`,
`sidebarItemActive`, `danger`, …). This discipline stops the three failures this
skill exists to prevent:

1. **Brand tint** — `primary` is green, so the whole app becomes green.
2. **Navigation tint** — the sidebar is navy, so cards and content become navy.
3. **Broken light mode** — the background turns light but foreground tokens stay
   from dark mode, so text disappears.

Run the four phases in order. Each has its own FORBIDDEN and ACCEPTANCE lists;
respect them phase by phase.

---

## GLOBAL SCOPE BOUNDARY (applies to every phase)

Change the **theme/style layer only**. Do **not** change:
- business logic, or approval/monitoring/alerting/account/dashboard/AI behavior;
- routes, URLs, or screen names;
- auth/authentication/authorization/permission architecture (if theme
  permissions are needed, add only `theme.view` / `theme.publish` /
  `theme.rollback` through the project's EXISTING permission mechanism — never
  build a new auth/permission system);
- non-theme API request/response shapes, or business data structures;
- Root App, Router, or global state management, under the banner of theming.

Database changes must be additive theme-only tables/columns with a rollback
script; never alter/drop business tables/columns or mutate business data. Prefer
minimal change: keep components and logic, swap hard-coded style for tokens, and
split a shared component only when required for the theme to apply consistently.
Pre-existing FUNCTIONAL bugs found along the way (a broken color-conversion
helper, a hanging route, an auth defect) are **reported, not fixed** inside this
scope — only fix a rendering issue if it directly blocks token adoption.

---

## INPUT

1. **Repository path** (required).
2. **Brand Seed** — minimum useful shape:
   ```ts
   interface BrandSeed {
     primary: string;         // brand identity / primary CTA
     info?: string;           // information / navigation-selected / links
     accent?: string;         // section accent (e.g. sidebar group labels)
     navigationBase?: string; // structural nav surface (e.g. sidebar/header dark)
     success?: string; warning?: string; danger?: string; // status overrides
   }
   ```
   If only `primary` is given, derive sensible defaults but keep status colors
   distinct from `primary`.
3. **Mode default** — default to **light-first** unless told otherwise.
4. Optional: screens the person cares about — treat as *hints for where to look*,
   never as the allowlist of what gets themed.

---

# PHASE 1 — DISCOVERY (read-only)

Audit the real repository so the theme reaches **every** screen, not just named
ones. This phase changes no code. Prefer real tooling (ripgrep/grep, the router
config, AST tools if available) over eyeballing.

### 1A. Framework & style architecture
From evidence in the repo, determine:
- Framework(s): Vanilla / React / Vue / Angular / Svelte / Next/Nuxt / mixed.
- Styling: plain CSS, CSS Modules, SCSS/LESS, Tailwind, styled-components/emotion,
  inline `style=`, JS-generated styles, a vendor kit (Bootstrap/Material/Ant/etc.).
- Existing theme mechanism: CSS custom properties (`:root`, `body.light`/`.dark`,
  `[data-theme]`), a ThemeProvider/context, a token package, SCSS maps. Record how
  mode is toggled and where it's stored (localStorage key, cookie, html/body class).
- **Portal / overlay roots** (modals, dialogs, drawers, tooltips, dropdowns,
  toasts) — where they mount in the DOM. They frequently escape a naive scope.
- **Chart libs** (Chart.js, ApexCharts, ECharts, Recharts, D3, Highcharts) and
  **map libs** (Leaflet, Mapbox, Google Maps, OpenLayers) — colored via JS, not CSS.
- Third-party UI whose internals you cannot restyle with a class.

### 1B. Route inventory → `WEB_THEME_ROUTE_INVENTORY.md`
Discover routes from the project's own truth: router config, route registry,
menu/nav config, lazy/dynamic imports, role/permission guards, feature flags,
page directories, file-system routing. One record per route:
```ts
interface ThemeRouteInventoryItem {
  routePattern: string; sourceFile: string; moduleName: string;
  isDynamic: boolean; requiredParams?: string[];
  requiredPermission?: string[]; requiredFeatureFlags?: string[]; layout?: string;
  themeStatus: 'not-started' | 'in-progress' | 'completed' | 'exception';
  exceptionReason?: string;
}
```
Include static, dynamic, nested, lazy, role-gated, flag-gated, tenant-specific
routes. Set all `themeStatus` to `not-started`.

### 1C. Component inventory → `WEB_THEME_COMPONENT_INVENTORY.md`
Enumerate shared/reusable components (buttons, inputs, tables, cards, dialogs,
tabs, badges, chips, toasts, chart/map wrappers, layout shells). Record name,
source file, whether it hard-codes color, whether it renders through a portal.

### 1D. Color-usage audit (evidence base — classify, don't replace)
Search `*.css *.scss *.sass *.less *.html *.js *.jsx *.ts *.tsx *.vue *.svelte
*.svg` for `#[0-9a-fA-F]{3,8}`, `rgba?\([^)]+\)`, `hsla?\([^)]+\)`, inline
`style=`, JS `element.style.*` / `setAttribute('style', …)`, and gradient/shadow
literals. Classify each distinct color (or near-duplicate cluster) by MEANING:
`brand/primary · success · info · warning · danger · domain-level ·
chart/data-viz · neutral/surface · text · border · disabled/decorative ·
unknown-needs-review`. Quantify: distinct-hex count vs. number of real semantic
roles; inline + JS color occurrence counts; the highest-density offender files
(migration priority); near-duplicate clusters (e.g. five reds) — these usually
mean one semantic role got forked, a correctness problem when color carries
meaning.

### Phase 1 — FORBIDDEN
Edit/add/move/rename/delete any file except the three inventories. Change routes,
logic, or behavior. Decide a screen is out of scope because it wasn't named — the
only valid exclusions go in `WEB_THEME_EXCEPTIONS.md` with a concrete technical
reason (external-domain content you can't style, third-party iframe with no theme
API, static non-app artifact, or explicitly signed-off). "Not mentioned" is never
valid.

### Phase 1 — ACCEPTANCE
Inventories generated from source, not a fixed list • every route + shared
component present with a `themeStatus` • every color classified or flagged
`unknown-needs-review` • chart/map libs, portal roots, third-party UI listed • no
source file modified.

---

# PHASE 2 — SEMANTIC ENGINE (install the token system)

Turn the Brand Seed into full light+dark semantic tokens, a resolver, CSS
variables, and a provider. Install the three code blocks below into the project's
token location (e.g. `src/theme/` or a shared `design-tokens` package); adjust
only the module system.

### 2A. Adopt the token schema + resolver

```ts
// semantic-token-schema.ts — the shared vocabulary every component consumes.
export const SCHEMA_VERSION = 7;

export interface SemanticThemeTokens {
  // Backgrounds — the app canvas, never a brand color
  background: string; backgroundSecondary: string; backgroundTertiary: string;
  backgroundGradientStart: string; backgroundGradientEnd: string;
  // Surfaces & Cards — sit ON the background; distinct from navigation surfaces
  surface: string; surfaceSecondary: string; surfaceElevated: string;
  surfaceMuted: string; surfaceSelected: string; surfacePressed: string;
  surfaceOverlay: string; cardBackground: string; cardBackgroundAlt: string;
  cardSelectedBackground: string; cardBorder: string; cardBorderStrong: string;
  cardSelectedBorder: string; cardShadow: string; cardHighlight: string;
  // Header & Sidebar — navigation has its OWN palette
  headerBackground: string; headerGradientStart: string; headerGradientEnd: string;
  headerBorder: string; headerTextPrimary: string; headerTextSecondary: string;
  sidebarBackground: string; sidebarBorder: string; sidebarItemHover: string;
  sidebarItemActive: string; sidebarText: string; sidebarTextActive: string;
  sidebarSectionAccent: string;
  // Typography & Brand
  textPrimary: string; textSecondary: string; textMuted: string;
  textDisabled: string; textInverse: string; textOnPrimary: string;
  textOnAccent: string; link: string; linkHover: string;
  primary: string; primaryHover: string; primaryPressed: string;
  primarySoft: string; primaryBorder: string; primaryGlow: string;
  primaryText: string; // accessible text variant of primary, for text-on-light
  secondary: string; secondarySoft: string;
  accent: string; accentSoft: string; accentGlow: string;
  // Status & Borders — status is SEMANTICALLY distinct from brand primary
  success: string; successSoft: string; successBorder: string; successText: string;
  warning: string; warningSoft: string; warningBorder: string; warningText: string;
  danger: string; dangerSoft: string; dangerBorder: string; dangerText: string;
  info: string; infoSoft: string; infoBorder: string; infoText: string;
  border: string; borderSoft: string; borderStrong: string; divider: string;
  focusRing: string;
  // Buttons & Forms
  buttonPrimaryBackground: string; buttonPrimaryHover: string;
  buttonPrimaryPressed: string; buttonPrimaryText: string; buttonPrimaryBorder: string;
  buttonSecondaryBackground: string; buttonSecondaryText: string;
  buttonSecondaryBorder: string; buttonSecondaryHover: string;
  buttonDangerBackground: string; buttonDangerText: string; buttonDangerBorder: string;
  buttonDisabledBackground: string; buttonDisabledText: string;
  inputBackground: string; inputText: string; inputPlaceholder: string;
  inputBorder: string; inputBorderHover: string; inputBorderFocus: string;
  inputErrorBorder: string; inputDisabledBackground: string;
  checkboxBackground: string; checkboxBorder: string; checkboxCheckedBackground: string;
  radioBorder: string; radioSelected: string;
  // Navigation, Dialog, Toast, Switch & Chips
  tabBarBackground: string; tabBarBorder: string; tabActiveBackground: string;
  tabActiveText: string; tabInactiveBackground: string; tabInactiveText: string;
  dialogBackground: string; dialogBorder: string; dialogOverlay: string;
  dialogTitle: string; dialogMessage: string; dialogShadow: string;
  toastBackground: string; toastText: string; toastBorder: string;
  switchTrackActive: string; switchTrackInactive: string;
  switchThumbActive: string; switchThumbInactive: string;
  chipBackground: string; chipSelectedBackground: string; chipText: string;
  chipSelectedText: string; chipBorder: string; chipSelectedBorder: string;
  badgeBackground: string; badgeText: string; badgeBorder: string;
  // Table, Charts, Maps & States
  tableBackground: string; tableHeaderBackground: string; tableHeaderText: string;
  tableRowBackground: string; tableRowHover: string; tableRowSelected: string;
  tableBorder: string; tableText: string; tableMutedText: string;
  chartSeries1: string; chartSeries2: string; chartSeries3: string;
  chartSeries4: string; chartSeries5: string; chartGrid: string; chartAxis: string;
  chartTooltipBackground: string; chartTooltipText: string;
  mapBackground: string; mapMarkerActive: string; mapMarkerInactive: string;
  mapMarkerWarning: string; mapMarkerDanger: string; mapPopupBackground: string;
  mapPopupText: string; skeletonBackground: string; skeletonHighlight: string;
  loadingIndicator: string; emptyStateIcon: string; emptyStateText: string;
  errorStateIcon: string; errorStateText: string;
}

export interface BrandThemePreset {
  id: string; displayName: string; version: number;
  light: SemanticThemeTokens; dark: SemanticThemeTokens;
}
export type ThemeModePreference = 'light' | 'dark' | 'system';
export type ResolvedThemeMode = 'light' | 'dark';
export interface ResolvedTheme {
  id: string; displayName: string; version: number;
  mode: ResolvedThemeMode; preference: ThemeModePreference; colors: SemanticThemeTokens;
}
export interface RuntimeThemeResolveInput {
  tenantPreset: BrandThemePreset; userPreference: ThemeModePreference;
  systemMode: ResolvedThemeMode; previewMode?: ResolvedThemeMode;
}

// Pick the mode ONCE and hand components a fully-resolved token set.
// Light/dark is NOT "background swap + let components guess their foreground".
export function resolveRuntimeTheme(input: RuntimeThemeResolveInput): ResolvedTheme {
  const { tenantPreset, userPreference, systemMode, previewMode } = input;
  const effectiveMode: ResolvedThemeMode =
    previewMode ?? (userPreference === 'system' ? systemMode : userPreference);
  const colors = effectiveMode === 'dark' ? tenantPreset.dark : tenantPreset.light;
  return {
    id: tenantPreset.id, displayName: tenantPreset.displayName,
    version: tenantPreset.version, mode: effectiveMode,
    preference: userPreference, colors,
  };
}
```

If the project genuinely never renders a group (e.g. maps), you may narrow the
interface — but never leave a declared token undefined at runtime.

### 2B. Color & contrast helpers

```ts
// color-helpers.ts — framework-agnostic. NOTE: ensureContrast is a SAFETY NET /
// one-time precompute, NOT a per-render color picker (per-channel stepping shifts
// hue and makes presets look inconsistent). Author token values by hand; let
// ensureContrast / validateTheme only rescue and catch edge cases.
export interface RGBA { r: number; g: number; b: number; a: number; }

export function parseColor(colorStr: string): RGBA {
  if (!colorStr) return { r: 0, g: 0, b: 0, a: 1 };
  if (colorStr.startsWith('rgba') || colorStr.startsWith('rgb')) {
    const m = colorStr.match(/rgba?\(([^)]+)\)/);
    if (m && m[1]) {
      const p = m[1].split(',').map((n) => parseFloat(n.trim()));
      return { r: Math.min(255, Math.max(0, p[0] || 0)), g: Math.min(255, Math.max(0, p[1] || 0)),
        b: Math.min(255, Math.max(0, p[2] || 0)), a: p[3] !== undefined ? Math.min(1, Math.max(0, p[3])) : 1 };
    }
  }
  let h = colorStr.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  if (isNaN(n)) return { r: 0, g: 0, b: 0, a: 1 };
  if (h.length === 8) return { r: (n >> 24) & 255, g: (n >> 16) & 255, b: (n >> 8) & 255, a: (n & 255) / 255 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
}
export function compositeColor(fg: RGBA, bg: RGBA): RGBA {
  const a = fg.a;
  return { r: Math.round(fg.r * a + bg.r * (1 - a)), g: Math.round(fg.g * a + bg.g * (1 - a)),
    b: Math.round(fg.b * a + bg.b * (1 - a)), a: 1 };
}
function srgbToLinear(c: number): number { const v = c / 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
export function getRelativeLuminance(colorStr: string, bgContextStr = '#FFFFFF'): number {
  const fg = parseColor(colorStr), bg = parseColor(bgContextStr);
  const e = fg.a < 1 ? compositeColor(fg, bg) : fg;
  return 0.2126 * srgbToLinear(e.r) + 0.7152 * srgbToLinear(e.g) + 0.0722 * srgbToLinear(e.b);
}
export function getContrastRatio(fgStr: string, bgStr: string): number {
  const l1 = getRelativeLuminance(fgStr, bgStr), l2 = getRelativeLuminance(bgStr, bgStr);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
export function getReadableTextColor(bgHex: string): string {
  const w = getContrastRatio('#FFFFFF', bgHex), d = getContrastRatio('#101828', bgHex);
  return w >= 4.5 && w >= d ? '#FFFFFF' : '#101828';
}
export function adjustBrightness(hex: string, amount: number): string { // shifts hue; see note
  const { r, g, b } = parseColor(hex);
  const t = (v: number) => Math.min(255, Math.max(0, v + amount)).toString(16).padStart(2, '0');
  return `#${t(r)}${t(g)}${t(b)}`;
}
export function ensureContrast(fgHex: string, bgHex: string, minRatio = 4.5): string {
  let fg = fgHex, ratio = getContrastRatio(fg, bgHex), i = 0;
  const strat = getRelativeLuminance(bgHex) < 0.5 ? 'lighten' : 'darken';
  while (ratio < minRatio && i < 20) { fg = adjustBrightness(fg, strat === 'lighten' ? 12 : -12); ratio = getContrastRatio(fg, bgHex); i++; }
  return ratio < minRatio ? getReadableTextColor(bgHex) : fg;
}
export function toKebabCase(s: string): string { return s.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase(); }
export function toCssVariables(tokens: Record<string, string>, prefix = '--color-'): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.keys(tokens)) out[`${prefix}${toKebabCase(k)}`] = tokens[k];
  return out;
}
```

### 2C. Publish / CI contrast guard

```ts
// contrast-validation.ts — the intended home for contrast enforcement.
// Wire into the publish path AND CI. NOT the render path.
import { getContrastRatio } from './color-helpers';
import type { ResolvedTheme } from './semantic-token-schema';

const CHECKS = [ // WCAG AA: 4.5 normal text, 3.0 large/placeholder. Add project-critical pairs.
  ['textPrimary','background',4.5],['textPrimary','surface',4.5],['textSecondary','surface',4.5],
  ['textPrimary','cardBackground',4.5],['textOnPrimary','primary',4.5],
  ['headerTextPrimary','headerBackground',4.5],['sidebarText','sidebarBackground',4.5],
  ['sidebarTextActive','sidebarItemActive',4.5],['buttonPrimaryText','buttonPrimaryBackground',4.5],
  ['buttonSecondaryText','buttonSecondaryBackground',4.5],['buttonDangerText','buttonDangerBackground',4.5],
  ['inputText','inputBackground',4.5],['inputPlaceholder','inputBackground',3.0],
  ['successText','successSoft',4.5],['warningText','warningSoft',4.5],['dangerText','dangerSoft',4.5],
  ['infoText','infoSoft',4.5],['tabActiveText','tabActiveBackground',4.5],['tabInactiveText','tabBarBackground',3.0],
  ['dialogTitle','dialogBackground',4.5],['toastText','toastBackground',4.5],
  ['chipText','chipBackground',4.5],['chipSelectedText','chipSelectedBackground',4.5],
  ['tableText','tableRowBackground',4.5],['tableHeaderText','tableHeaderBackground',4.5],
  ['mapPopupText','mapPopupBackground',4.5],['chartTooltipText','chartTooltipBackground',4.5],
  ['emptyStateText','background',4.5],['errorStateText','background',4.5],
] as const;

export interface ValidationResult {
  isValid: boolean; canPublish: boolean;
  errors: Array<{ pair: string; ratio: number; required: number; message: string }>;
}
export function validateTheme(theme: ResolvedTheme): ValidationResult {
  const errors = [];
  for (const [fgKey, bgKey, min] of CHECKS) {
    const fg = (theme.colors as any)[fgKey], bg = (theme.colors as any)[bgKey];
    if (fg == null || bg == null) continue;
    const ratio = getContrastRatio(fg, bg);
    if (ratio < min) errors.push({ pair: `${fgKey} / ${bgKey}`, ratio, required: min,
      message: `Pair ${fgKey}/${bgKey} only reaches ${ratio.toFixed(2)}:1 (needs >= ${min}:1) in ${theme.id}/${theme.mode}` });
  }
  return { isValid: errors.length === 0, canPublish: errors.length === 0, errors };
}
```

### 2D. Author values — enforce role separation
Fill the full token set for BOTH modes. While authoring, keep these separations —
this is where implementations go wrong:
- **Navigation ≠ Surface** — sidebar/header use `sidebar*`/`header*`; cards/content
  use `surface*`/`card*`. A dark nav color must not leak into card/app background.
- **Brand ≠ Background** — `primary` drives CTAs/active/focus/accents, never the
  canvas or default card fill. Neutrals stay neutral (don't tint them with brand).
- **Brand ≠ Success** — keep `primary` and `success` visually distinct in both modes.
- **Visual color ≠ Text color** — use `primaryText`/`successText`/`warningText`/
  `dangerText`/`infoText` for text-on-light; base colors for fills/borders.
- **Muted ≠ Disabled ≠ Decorative** — distinct `textMuted`/`textDisabled`/decorative.

Light-first: no-class / `body.light` / `[data-theme=light]` → light set; dark only
under an explicit dark signal (never gate dark on `:not(.light)`). Dark derives its
OWN background/surface/card/text/muted/border/hover/selected/overlay, preserving the
same visual hierarchy — not just a repainted page background.

### 2E. Wire resolver, CSS variables, provider
Emit tokens as `--color-<kebab>` via `toCssVariables()` on `:root`/`<html>` so
portals/modals/dropdowns/tooltips/toasts inherit the scope (confirm it reaches the
portal roots found in Phase 1). Provide the framework-appropriate ThemeProvider
(React/Vue/Angular) or, for Vanilla, a module that writes the variables and flips
the mode class/attribute. Run `validateTheme()` on every preset × mode; fix
failures by adjusting the specific `*Text` token, not by changing a structural
background. Multiple brands: each preset fills the same schema; the SAME resolver
serves all — no brand-prefixed parallel token namespace (`--evg-primary`).

### Phase 2 — FORBIDDEN
Derive backgrounds/surfaces/cards/borders by tinting the brand color • use a
navigation-structural color as card/content/background fill • make components
branch on route/screen name to pick colors • introduce a brand-prefixed token
namespace parallel to the semantic set • ship a token undefined for any supported
mode • use `ensureContrast()` as a per-render picker.

### Phase 2 — ACCEPTANCE
Navigation/surface/brand/status/text/form/table/chart/map/state tokens all present
and distinct • `primary` ≠ `success` both modes • brand doesn't tint
background/surface • nav color doesn't fill cards/content • light and dark each
authored in full; light is the no-class default • components resolve color from
tokens/CSS variables only • `validateTheme()` passes for every preset × mode •
portals inherit the scope.

---

# PHASE 3 — MIGRATION (styling only)

Rewire the source to consume tokens, by MEANING, touching nothing but style.

- **A. Foundation** — tokens wired at `:root`/`<html>` and reaching portal roots.
  If legacy CSS variables exist, keep them TEMPORARILY as aliases pointing at the
  new tokens (`--old-cyan: var(--primary)`) so the UI doesn't break mid-migration;
  record for removal. New code must not consume aliases.
- **B. Global shell** — migrate the always-visible layer first: body/app
  background→`background`; containers→`surface*`/`card*`; nav chrome→
  `sidebar*`/`header*` (never surface/card tokens); actions→`buttonPrimary*`/
  `buttonSecondary*`/`buttonDanger*`; text→`textPrimary`/`textSecondary`/
  `textMuted`; text-on-fill→matching `*Text` variant.
- **C. Modules/screens** — walk the ROUTE inventory (not remembered names). Per
  route: `in-progress`→remove hard-coded colors, map by meaning, keep route/URL/
  DOM/behavior→verify hover/focus/active/selected/disabled/loading/empty/error
  states pick up tokens→`completed`. Domain meanings get domain tokens (e.g. staged
  severity → `alert-level-*`), never collapse into `danger`; one color must not
  carry two meanings.
- **D. Inline & JS-generated** — replace `style="color:#xxx"` with a themed class
  (best) or `var(--color-…)`. For JS-produced colors, read the CSS variable at
  runtime or reference a semantic constant.
- **E. Charts/maps/SVG** — feed charts a semantic palette read from tokens
  (`getComputedStyle(document.documentElement).getPropertyValue('--color-primary')`
  or a shared chart-color constant); map series by meaning; legit data-viz scales
  may stay multi-color. Map markers/states semantic (normal→success, warning→
  warning/level, alarm→danger/level, selected→primary, offline→neutral); popups→
  `mapPopup*`; selected geometry→`primary` stroke + soft primary fill. SVG: use
  `fill="currentColor"`/`stroke="currentColor"` where it can inherit; replace
  embedded brand hexes with tokens.
- **F. Third-party & portals** — wrap in a theme adapter/scope override; confirm
  portal output stays inside the variable scope.
- **G. Legacy removal** — when a search shows zero consumers of a temporary alias
  outside its compatibility block, delete it. Any remaining known off-brand color
  must be justified or removed.

### Phase 3 — FORBIDDEN
Blind find-and-replace of hex values (always map by role) • change business
logic/routes/URLs/screen names/non-theme API behavior/business data shape • alter
auth/permission architecture • rewrite Root App/Router/state or mass-move/rename
files under the theming banner • rewrite a whole component just to recolor it •
turn a semantic action the wrong color (a delete button stays in the danger role).

### Phase 3 — ACCEPTANCE
Every inventoried route/component `completed` or justified exception; 100% shared
components on tokens • no hard-coded color outside the allowed token/preset
location (bar justified exceptions) • charts don't fall back to default/black;
map/selected uses tokens; SVG inherits • portals themed • domain meanings use
dedicated tokens • behavior/routes/URLs/business data/non-theme API unchanged •
temporary aliases gone or scheduled with zero new consumers.

---

# PHASE 4 — VALIDATION & GATES

Prove correctness and stop regressions. Measure against inventories from source,
never a fixed screen list.

- **Tier 1 — Static/coverage (100%, no render).** Gate the build if: any route/
  page/shared component isn't `completed` or a documented exception; any color
  literal sits outside the allowed location; any preset misses a token for either
  mode; `validateTheme()` fails for any preset × mode; a route/component in source
  is absent from the inventory (new-route guard — this forces future screens
  through the theme); a portal renders outside the token scope; an excluded route
  lacks a reason in `WEB_THEME_EXCEPTIONS.md`.
- **Tier 2 — Full visual snapshot** across `presets × modes × viewports ×
  browsers` for: all shared UI-kit components; global layout (root/sidebar/header/
  footer/nav); 1–2 representative routes per group; routes with distinctive states
  (empty/error/loading/permission-denied); global modals/drawers/portals/popovers.
  Config: Desktop 1440×900 + Mobile 375×812; Chromium + WebKit; fixed font; mocked
  timestamps/data; fixed locale + timezone; animations off, caret hidden; baselines
  committed; baseline updates REVIEWED, never auto-accepted.
- **Tier 3 — Smoke** on remaining routes (no pixel diff): tokens resolve to CSS
  variables, no illegal hard-coded color, renders with fixture data, no crash.
  Dynamic/role-gated routes use fixtures (routePattern, resolvedPath,
  mockDataFixture, tier, authRole?, featureFlags?, states?).
- **Wire the gates** into CI on every PR: typecheck · color-literal lint · token
  schema/completeness/contrast tests · route/component discovery + coverage ·
  new-route guard · visual regression.
- **Manual light/dark sweep** on representative screens: no light-mode text
  disappears on light surfaces; no dark-mode text disappears on dark surfaces; nav
  keeps its structural color; active nav / brand CTA / status read as intended;
  cards not tinted by nav/brand. Check first load AND reload (pre-hydration must
  not flash the wrong theme and must fall back safely if cache is missing/corrupt).

### Phase 4 — FORBIDDEN
Lower a contrast threshold or delete a failing pair to pass the gate (fix the
token) • auto-accept new visual baselines • measure coverage against a hard-coded
screen list • exempt a screen without a documented, approved exception.

### Phase 4 — ACCEPTANCE (report must show PASS on each)
Inventories from real source • 100% existing routes/pages + 100% shared components
themed • dynamic/role-gated routes verified via fixtures • modals/portals/drawers/
tooltips/popovers themed • new screens inherit theme via shared architecture;
new-route guard blocks un-themed additions • no theme conditional keyed on route/
screen name • no un-justified hard-coded colors / accidental residue • no
unapproved exceptions • WCAG AA passes across every preset × mode • light default
no-class, dark only on explicit signal, first-load + reload correct • business
logic/data/routes/non-theme API unchanged.

---

## ON REFERENCE CASES

Any brand, palette, or domain concept you may have seen while this skill was
created (a specific emerald/navy brand, a specific dashboard's staged alert
levels) is a **case study only** — it illustrates semantic role separation. It is
NOT baked in: no brand IDs are hard-coded, no project must use a navy sidebar or
green primary, nothing depends on a specific project's route/component names. When
you apply this skill, the Brand Seed comes from the CURRENT project and every
decision resolves through the semantic engine — never from a reference case.
