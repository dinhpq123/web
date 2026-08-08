# Component Migration Patterns

## Contents

1. Token plumbing
2. Shell and controls
3. Icons
4. KPI and charts
5. Maps and media
6. Login and launcher
7. Tailwind CSS projects
8. Next.js App Router specifics
9. Generated UI

## 1. Token Plumbing

Prefer the production framework's theme system. Publish semantic CSS variables at the root for legacy and visualization consumers.

```css
.component {
  color: var(--text-primary);
  background: var(--bg-card);
  border: 1px solid var(--border);
}

.component.is-selected {
  color: var(--primary-text);
  background: var(--primary-soft);
  border-color: var(--border-active);
}
```

Do not create duplicate namespaces such as `--evg-primary` and `--hadiwa-primary`. Keep one canonical runtime token and temporary aliases only for migration.

Resolve canvas-only colors:

```js
function themeColor(name, fallback) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name).trim() || fallback;
}
```

Rebuild or update charts/maps after a theme-change event.

## 2. Shell And Controls

- Apply sidebar gradient to the parent sidebar/aside container, not each child section.
- Keep sidebar active gradient separate from the parent gradient.
- Keep header, ticker, filter panel, and workspace on different surface levels.
- Use a compact primary/neutral segmented control. Avoid black-gray selected segments.
- Use soft status backgrounds, not saturated fills, except small badges and critical commands.
- Keep cards at the existing product radius; avoid nested cards and decorative card bands.
- Use `:focus-visible` with the approved focus ring. Do not remove focus outlines without replacement.
- Keep tables neutral. Selected rows use primary soft; warning rows use semantic severity only when the row state warrants it.
- Ensure disabled controls use disabled tokens, not opacity alone.

## 3. Icons

Prefer the existing icon library. For inline SVG:

```html
<svg fill="none" stroke="currentColor" aria-hidden="true">...</svg>
```

Use semantic wrappers only when needed:

```css
.icon-shell {
  --icon-color: var(--primary);
  color: var(--icon-color);
  background: color-mix(in srgb, var(--bg-card) 92%, var(--icon-color) 8%);
  border: 1px solid color-mix(in srgb, var(--icon-color) 26%, var(--border));
}

.icon-shell.is-danger { --icon-color: var(--danger); }
.icon-shell.is-warning { --icon-color: var(--warning-text); }
```

Rules:

- Generic tools and neutral KPI icons use primary blue.
- Alert/bell icon uses danger only when an actual alert exists.
- Warning icons use warning only for warning state.
- Online dots use `--status-online`.
- Do not add a different decorative hue to each KPI.
- Do not color the icon and label differently when they form one identity control.
- Verify `fill`, `stroke`, pseudo-elements, masks, icon fonts, and raster assets independently.

## 4. KPI And Charts

KPI cards need a stable layout:

```css
.kpi-card { position: relative; min-height: 118px; }
.kpi-card.has-sparkline .kpi-content { padding-right: 104px; }
.kpi-sparkline {
  position: absolute;
  right: 14px;
  bottom: 13px;
  width: 92px;
  height: 34px;
}
```

- Keep number, label, supporting status, icon, and sparkline in separate stable regions.
- Replace awkward trend text such as `▲75% tỷ lệ hoạt động` with a readable status phrase such as `75% trạm đang hoạt động`.
- Do not use six unrelated accent colors across six KPI cards. Use primary/neutral decoration and semantic status colors only where values require them.
- Keep chart series multi-color when series identity matters.
- Put crowded legends in a compact legend row outside the plotting canvas. Disable the library legend after providing an accessible replacement.
- Use restrained grid lines and readable axis text from theme tokens.
- Ensure canvas has a stable parent height and is nonblank after theme changes.

## 5. Maps And Media

- Keep real imagery and camera video unfiltered unless the product explicitly requires a monitoring filter.
- Theme camera chrome, titles, controls, status labels, pagination, and empty/error states.
- GIS selected feature uses primary; online/offline/risk layers retain domain meaning.
- Do not recolor satellite tiles, maps, photographs, logos, or scientific imagery as brand decoration.
- Avoid near-black Video Wall panel headers when the approved navy surface hierarchy is available.
- Theme same-origin iframe content separately; document cross-origin limitations.

## 6. Login And Launcher

Login remains a stable dark authentication surface in both app appearances unless the production requirement says otherwise.

- Use approved login background and surface tokens.
- Use primary blue for inputs, links, checkbox, focus, and submit action.
- Use `--status-online` for the TLS connection dot.
- Apply role colors from `palette-and-semantics.md` only to quick-account identity controls.
- Check login, submit/loading, invalid credentials, forgot password steps, OTP method selection, OTP entry, expiry, resend, and success.

Launcher:

- Apply the seven exact category colors via per-item custom properties.
- Use one category color consistently for icon, label, border, and subtle hover glow.
- Scope selectors under the launcher root to prevent leakage.
- Keep inaccessible modules muted and visibly locked.
- Keep the launcher background dark and low-noise; do not add neon orbs or global glow.

## 7. Tailwind CSS Projects

When the production app is Tailwind-based (no AntD/MUI/Chakra), color lives in two places the generic token approach does not reach by default: utility classes in JSX/HTML, and `tailwind.config.*`.

- Map the approved semantic palette into `tailwind.config.js` under `theme.extend.colors` (Tailwind v3) or an `@theme` block in the global CSS (Tailwind v4), e.g. `primary`, `primary-soft`, `bg-card`, `text-primary`, `border`, `status-online`, `danger`, `warning`, `pctt-bd1/2/3`. Do not rely on Tailwind's default palette names (`blue-500`, `emerald-400`) as the semantic layer — they carry no meaning and drift silently.
- Replace raw utility colors (`bg-blue-500`, `text-emerald-400`, `border-red-600`) with the semantic classes (`bg-primary`, `text-status-online`, `border-danger`) as components are migrated. Grep for the Tailwind color-word pattern (see `scripts/audit-theme-coverage.sh`) — a clean hex/rgb scan does not mean the theme is clean in a Tailwind app.
- Support dark mode via Tailwind's `darkMode: 'class'` (or `'selector'`) strategy so the same `dark:` variants respond to the app's existing theme toggle; do not introduce a second, conflicting dark-mode mechanism.
- `@apply` inside CSS Modules/global CSS is fine for repeated combinations, but keep the source of truth in the token config, not duplicated hex values inside `@apply` rules.
- Component libraries built on Tailwind (shadcn/ui, Radix + Tailwind, headlessui) style through the same utility classes — migrate them the same way, do not special-case them as a "framework theme provider."

## 8. Next.js App Router Specifics

When the production app is Next.js (App Router), theme setup interacts with server rendering and hydration in ways a plain SPA does not:

- Read the persisted theme/brand preference (cookie, not localStorage, if it must be available during server render) in the root `app/layout.tsx` and set `data-theme`/`class` on the `<html>` element server-side so there is no flash of the wrong theme.
- If a small inline bootstrap script is needed to sync `localStorage` before paint, add it as a `<script>` in `app/layout.tsx` and supply the CSP `nonce` from `next.config`/middleware if the app enforces a script-src CSP — an un-nonced inline script will be silently blocked, not merely warned.
- Server Components cannot use theme React Context directly; keep the theme provider as a small Client Component wrapping `children`, and keep the class/attribute set on `<html>` (server-rendered) independent from that provider so first paint is already correct before the client component hydrates.
- Verify Tailwind's JIT content globs (`content: [...]` in `tailwind.config.*`) include every `app/**` and shared `components/**` path that receives new semantic classes, or the classes will be purged from the production build silently.
- Re-check hydration warnings in the console after theme changes — a mismatch between server-rendered `data-theme` and the client's resolved preference is a common regression source specific to SSR frameworks and must be treated as a bug, not ignored.

## 9. Generated UI

Audit template strings, render functions, portals, notifications, Chart.js configs, Leaflet styles, and direct DOM updates.

Bad:

```js
element.style.background = '#333';
element.style.color = '#00f080';
```

Preferred DOM styling:

```js
element.classList.add('is-selected');
```

Preferred visualization styling:

```js
const primary = themeColor('--primary', '#2984EE');
dataset.borderColor = primary;
```

Inline styles that depend on runtime values may remain, but their colors must resolve from semantic tokens or approved domain constants.
