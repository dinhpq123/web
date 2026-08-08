# EVG CMS Visual System — Handoff Package

## Source snapshot

- Repository: `evgcms` (CRA React app, internal name `csms-cms`)
- Branch extracted from: `uat`
- Commit: `ffae7e54dad9416142969238d78d82032155178f` (2026-08-06 15:54:38 +0700)
- Extraction date: 2026-08-08

This package was produced by reading the **live, actively-imported** source only. Every token below cites `file:line`. No color was invented or guessed from a screenshot. Where the codebase itself is inconsistent (multiple competing "primary" colors, unthemed antd defaults, dead CSS), that inconsistency is documented rather than silently resolved — resolving it is a decision for whoever migrates the theme, not something this package should hide.

## How to run Theme Lab

Theme Lab in this package is a **static, dependency-free HTML demo** (`theme-lab/index.html`), not a new route added to the running CRA app — the brief requires "dev-only" and this repo has no dev-only route gate (see `validation-report.md`). It uses only the exact hex/gradient/shadow values captured in `tokens/evg-theme.css`, so it renders the true production palette without needing the app's build pipeline, Redux store, or API.

```bash
open evg-theme-export/theme-lab/index.html
```

or serve it so you can resize the viewport realistically:

```bash
npx serve evg-theme-export/theme-lab
```

No `npm install`, no dev server, no login required — it is a demo, not a feature branch of the real app.

## Framework & dependencies actually driving the visuals

From `package.json` (repo root):

- React 18 + `react-scripts` 5 (Create React App) — no Vite/Next.
- `antd` `^5.24.7` — but used in exactly **two** places (`Table` groupHeader mode, `DatePicker`), always with **default antd theme** — no `ConfigProvider`/`theme.token` override exists anywhere in `src`. See `source-map.md`.
- `bootstrap` `^5.2.3` + `react-bootstrap` `^2.7.0` — the actual UI substrate. Buttons, modals, tooltips, dropdowns, form controls are all Bootstrap classes wrapped in thin custom components (`KTBSButton`, `KTBSDropdown`, `AppDialog`, `KTTooltip`, …).
- `sass` `^1.53.0` — SCSS compiled by CRA's built-in sass-loader; no CSS-in-JS design system despite `styled-components` being present in deps (grep shows negligible real usage against the Keen/Bootstrap surface).
- A vendored **Keen/Metronic** admin theme bundle (`src/assets/styles/keen/theme01/style.bundle.css`, ~100k lines) supplies most base component CSS (buttons, forms, sidebar width behavior, switches). Project code overrides pieces of it via `src/assets/styles/custom.style.scss` and `src/assets/styles/app.style.scss`, loaded after the bundle.
- Icons: Font Awesome 5 Pro classes + a bundled Font Awesome 6 CSS, plus a Keenthemes "Ki" icon font and a Flaticon2 icon font. **`@ant-design/icons` and `react-icons` are not used.** Custom SVG assets under `src/assets/icons/` are `<img>`-rendered with hardcoded fills — **not currentColor-tintable**.
- Fonts: self-hosted **SVN-Gilroy** (`.otf` only, 10 weights) with `Inter` and system-sans fallback (`src/assets/fonts/SVN-Gilroy/fonts.css`, `src/index.css:28`).

## Scope verified vs. not verified

**Verified by direct source read + citation** (see `source-map.md`, `component-contracts.md`):
- Sidebar, Header, BaseLayout structure and colors.
- Brand/status color source (`AppColors.js`) and every place it conflicts with vendor CSS.
- Button, input/checkbox/radio/switch, dropdown, tabs, breadcrumb, card, badge, alert, table, pagination, modal, tooltip, toast — default/hover/focus/disabled/invalid states, with file:line for each value that exists in source.
- Route list (`src/App.js`) and sidebar menu config (`MenuItemsList.js`) for the screen inventory.
- Login/Auth screen shell (`AuthBaseScreen`), confirmed **not** wrapped by `KT01BaseLayout`.

**Explicitly NOT verified / not implemented in source (do not fabricate on migration):**
- **Dark Mode: not implemented.** No dark theme, no `prefers-color-scheme` handling, no theme-switch mechanism exists anywhere in `src`. Theme Lab therefore ships light-mode only, labeled as such. Any dark palette a downstream team wants must be designed fresh — it is not "the EVG dark theme," because none exists.
- Live interactive verification (actually opening dropdowns/modals/tooltips in a running browser session) was **not** performed in this pass — see `validation-report.md` for exactly what was and wasn't clicked.
- Screenshot capture at 375/768/1440/1920px of the *running app* (as opposed to the static Theme Lab) was not performed — the production app is a login-gated internal CMS and this pass did not authenticate against it.
- KPI/stat widget: no reusable component exists in source (built ad hoc per screen) — Theme Lab's KPI section is a token-faithful composition, not a lift of one specific screen's markup.
- Segmented control and Popover: no such components exist in source at all — omitted from the contract doc rather than invented.

## Files that must NOT be carried into a target system

- `src/assets/styles/keen/theme01/**` — vendored, licensed Keen/Metronic theme bundle (~100k line CSS + fonts). Do not relicense/redistribute; the *values* extracted from it are documented here, the bundle itself is not part of this handoff.
- Anything under `src/assets/fontawesome6/**`, `src/assets/keenthemes-icons/**`, `src/assets/flaticon2/**` — third-party icon font packages; re-license/re-source them independently in the target system rather than copying the files.
- Any `.env*`, API base URLs, auth tokens, or files under `src/config` / `src/general/constants/AppApi*` — out of scope for a visual-system handoff and were not read for token extraction.
- Business logic, Redux slices, API clients, RBAC/permission logic (`RoleUtils`, `SidebarHelper.checkPermissionList`, route guards) — referenced only to explain *why* a component renders a given state, never modified or exported.
- No customer data, no real screenshots of authenticated screens, no credentials were captured or included anywhere in this package.
