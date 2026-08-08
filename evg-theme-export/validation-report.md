# Validation Report

## 1. Build / lint

- `CI=true npx react-scripts build` was run against the unmodified repository (this handoff package makes zero changes to `src/`) to confirm the theme extraction was read against a codebase that actually compiles. See the note at the end of this section for the run's outcome — captured after this report was drafted, since the build takes several minutes on this app.
- No dedicated `.eslintrc*` file exists in the repo root; CRA's built-in `eslint-config-react-app` (via `react-scripts`) runs as part of `build`/`start`. No separate standalone lint script exists in `package.json` beyond what `react-scripts` runs internally.
- No test suite assertions were run beyond CRA's default `react-scripts test` harness being present — this pass did not add or run new automated tests, since the task is a documentation/token-extraction handoff, not a code change.

**Outcome**: `npm run build` (`react-scripts build`, `CI=true`) — see the addendum below for pass/fail and any warnings/errors, appended once the background run completed.

## 2. Screenshot verification — Theme Lab, 4 breakpoints

All four required breakpoints were opened in a real browser (Chrome via the in-app Browser pane) against `theme-lab/index.html`, not guessed from CSS alone:

| Breakpoint | Result |
|---|---|
| 375px (mobile) | Sidebar correctly hidden off-canvas by default (`transform: translateX(-100%)`), revealed via a "☰ Menu" toggle + backdrop, matching the real app's separate `KT01HeaderMobile` pattern. Buttons/inputs/badges stack in single column, no text overlap or horizontal overflow observed. |
| 768px (tablet) | Sidebar renders full-width expanded alongside content (matches source's `@media (min-width: 992px)` collapse threshold being *above* 768px — i.e. at 768px the real app would also still show a full/mobile-adjacent sidebar; this demo's simplified 767px cutoff is documented as a simplification in this report, see §5). No overflow or clipping observed at this width. |
| 1440px (desktop) | Full layout renders as intended — sidebar, header, all ten sections legible, no overlap. |
| 1920px (wide) | Same as 1440px with more horizontal breathing room; token swatches wrap correctly via flexbox, no stretching artifacts. |

**Bug found and fixed during this pass**: the first draft of Theme Lab set the sidebar to `position: fixed` at mobile width with no way to dismiss it, permanently covering all content below 767px. This was caught by actually opening the page at 375px (not by reading the CSS), then fixed by adding an off-canvas transform + toggle + backdrop (`theme-lab/index.html`, mobile-only CSS block and `openMobileAside`/`closeMobileAside` JS). Recorded here per the brief's requirement to report validation truthfully rather than claim a first-pass success.

**Second bug found and fixed** (during the follow-up request to capture real screenshot files): a hardcoded `width: 400px` on the tabs demo (§6) overflowed the 375px viewport, pushing `document.documentElement.scrollWidth` to 424px. Found by diffing `scrollWidth` vs `innerWidth` via injected JS at 375px, not by eyeballing — confirmed with `theme-lab/index.html`'s own `.tabs` rule. Fixed by switching to `max-width:400px; width:100%` and adding a `overflow-x:hidden; max-width:100%` safety net on `html, body`. Re-verified `scrollWidth === innerWidth === 375` after the fix, then re-captured all four breakpoint screenshots — see `theme-lab/screenshots/`:

| File | Pixel dimensions (verified via `sips -g pixelWidth -g pixelHeight`) |
|---|---|
| `theme-lab-375.png` | 375 × 1650 |
| `theme-lab-768.png` | 768 × 2450 |
| `theme-lab-1440.png` | 1440 × 2050 |
| `theme-lab-1920.png` | 1920 × 2050 |

Captured with real headless Chrome (`Google Chrome 151.0.7922.108 --headless=new --window-size=<w>,<h> --screenshot=...`) against the actual `theme-lab/index.html` file — not resized, cropped, or upscaled after the fact, and not mocked/drawn by hand.

## 3. Interaction verification (not screenshot-only)

Performed live in-browser, not just visually inspected:

- **Sidebar collapse toggle** — clicked; verified width animates `326px → 70px` and menu text hides, matching `--evg-sidebar-width-expanded`/`-collapsed`.
- **Account dropdown** (in-tree, not portaled) — opened via click; verified panel position, background, and item list render correctly, matching `ButtonAccountDropdownInfo` behavior.
- **KTBSDropdown-style filter dropdown** — opened; verified active-item background matches `--evg-surface-dropdown-active` (the canonical winning rule from `app.style.scss:322-330`, not the legacy `#20b970` rule from `custom.style.scss:37-40`).
- **antd DatePicker** — re-verified with a second, more targeted source read after the first pass understated this component (see §7 below for the correction). Theme Lab §6b now shows three live states: the closed input using the *real* extracted theming (`style.bundle.css:100149-100177`, matches `.form-control`), the open calendar panel exactly as unthemed in production (antd default blue, zero `.ant-picker-dropdown` overrides exist in source — confirmed, not assumed), and a third panel using this package's new *proposed* `datepicker.panel*` tokens as a recommended fix. All three were opened live via click, not screenshotted from a static mockup.
- **Modal** — opened via button; verified backdrop, surface, header/body/footer regions, and footer button styling.
- **Toasts** — fired success/error/warning toasts; verified they stack top-right, auto-remove, and use distinguishable left-border colors per type.
- **Tooltip** — hovered the notification bell icon; verified tooltip bubble appears above the trigger with the documented shadow (`--evg-shadow-tooltip`).

All of the above were exercised through the Browser pane's click/hover/JS-execution tools against the live static file — not inferred from reading the HTML/CSS source alone.

## 3b. Correction: antd DatePicker theming was mis-stated in the first pass

The first pass of this handoff described the antd `DatePicker` as "completely unthemed," citing zero `.ant-picker-dropdown`/`.ant-select-dropdown` selectors in source. That absence check was correct, but incomplete — it missed that `src/assets/styles/keen/theme01/style.bundle.css:100149-100177` contains **exactly 3** project-authored `.ant-picker*` rules, all scoped to the *closed input box* (`.ant-picker` base rule, `.ant-picker-outlined:hover`, `.ant-picker-outlined:focus/:focus-within`), restyling it to precisely match `.form-control` (height `42px`, border `#E4E6EF`, radius `0.42rem`, hover/focus background `#F3F6F9`).

Re-verified with:
```
rg -c "ant-picker" src/assets/styles/keen/theme01/style.bundle.css        → 3
rg -n "ant-picker-dropdown|ant-picker-cell|ant-picker-header" \
   src/assets/styles/keen/theme01/style.bundle.css                       → 0 matches
```

Corrected, precise statement (now reflected in `component-contracts.md` and `source-map.md`): **the closed DatePicker input is genuinely themed** (a deliberate EVG customization, not noise) — **the open calendar panel is genuinely unthemed** (a real, unaddressed gap, confirmed by exhaustive absence of any `.ant-picker-dropdown`-scoped rule anywhere in `src`). Both facts are now in the token/contract docs with their own citations rather than being collapsed into one inaccurate "unthemed" label. `tokens/evg-theme.tokens.json` gained a `datepicker.*` group: three extracted tokens (`inputBorder`, `inputBackground`, `inputHoverBackground`) plus four tokens explicitly marked `"status":"proposed"` (`inputFocusBorder`, `panelAccent`, `panelSelectedBg`, `panelTodayBorder`) that recommend closing the panel gap using the existing brand palette — never presented as if they were already true of EVG.

## 4. Hard-coded color audit (repo-wide)

Ran `rg -o "#[0-9A-Fa-f]{3,8}\b" src -g '*.js'` and the SCSS/CSS equivalent across the full repository (not just the AppShell/component set already documented) to check for anything the earlier targeted searches might have missed.

### Finding: a third, previously-undocumented palette exists

142 JS files contain inline hex colors. The overwhelming majority of high-frequency values (`#16a34a`, `#22c55e`, `#64748b`, `#ebedfe`, `#f8fafc`, `#475569`, `#0f172a`, `#e5e7eb`, `#334155`, `#dcfce7`, `#f0fdf4` — a Tailwind-slate/green-style palette) trace almost entirely to **one file**: `src/features/FE/screens/CustomerHomeScreen/index.js` (9,714 lines — a public, customer-facing marketing/home page, confirmed earlier as `CustomerRoute`-guarded, **not** part of the CMS `KT01BaseLayout` shell), plus smaller amounts in `CustomerProductDetailScreen/index.js` and `MarketingDocsScreen.js` (also customer/marketing-facing), and two isolated occurrences in `ButtonAccountDropdownInfo/index.js` (line 256, `color: '#16a34a'` — one line, inside an otherwise `AppColors`-driven component).

**Classification**: This Tailwind-style palette is a **legitimate, separate design system for public/marketing screens**, explicitly out of scope for this task (the brief scopes Sidebar/Header/BaseLayout/CMS shared components — all of which sit behind `KT01BaseLayout`, which these screens do not use). It is flagged here, not silently ignored, but **not included** in `tokens/evg-theme.*` — importing it would misrepresent the CMS admin theme this package documents. If a future task needs the public-site theme, it should be extracted as its own package.

### Remaining CMS-scope (`KT01BaseLayout`-reachable) hardcoded colors — classification

| Pattern | Example file:line | Classification |
|---|---|---|
| `AppColors.gray[...]`/`AppColors.primary` etc. passed as inline `style={{color: ...}}` | `src/general/helpers/UIHelper.js:18,30-38,70,100,...` | **Valid — token usage, just not centralized in CSS.** These already route through the canonical `AppColors` module; migrating them means importing the equivalent semantic token, not replacing a hardcoded value. |
| Vendor bundle `:root` overrides (`--primary:#3699ff` etc.) | `src/assets/styles/keen/theme01/style.bundle.css:23-30` | **Legacy/dead-relative-to-brand** — superseded by `AppColors` wherever a project override exists, but still the *only* definition wherever no override was written (raw `KTBSButton`, antd DatePicker accents). Documented as "legacy" in `tokens/evg-theme.tokens.json`, not deleted (deleting vendor CSS is out of scope and would break unrelated Bootstrap behavior). |
| One-off hex literals matching no token (`#1EF5DF` sidebar section title, `#41A7FF` sidebar active border, `#346AA8` sidebar divider, `#4C76D6B2` inset shadow) | `KT01Sidebar/style2.scss:44-46,116,26` | **Valid, intentional domain color** — these are the sidebar's own accent palette, distinct from `AppColors`, used consistently and only in the sidebar. Captured as their own tokens (`sidebar.itemActiveBorder`, `sidebar.sectionTitle`, etc.) rather than forced into the brand/status buckets, since they don't carry brand or status meaning. |
| CSS `filter()` recoloring of raster/SVG `<img>` icons | `KT01Header2/style.scss:7-10,23-25` | **Needs migration attention, not a simple token swap** — a `filter()` hack can't be expressed as a swappable color; migrating this properly means re-exporting the icon as `currentColor` SVG, not copying the filter value. |
| Static SVG assets with baked-in `fill`/`stroke` | `src/assets/icons/ic_light.svg`, `ic_total_energy.svg`, ~38 files total | **Asset/logo — do not touch.** These are illustrative icon assets, not theme-driven; recoloring them is an asset-authoring task, not a CSS/token task. Listed in `README-HANDOFF.md` scope notes. |
| Third-party vendor CSS (Font Awesome, Flaticon2, Keenthemes-icons, CKEditor skin) | `src/assets/fontawesome6/**`, `src/assets/flaticon2/**` | **Vendor/third-party — excluded from handoff entirely** per `README-HANDOFF.md`. |

No purple, decorative gradients, or colors outside the ones cited in `source-map.md`/`component-contracts.md` were found anywhere in the CMS-scope sweep — the only surprises were the out-of-scope public-marketing palette (handled above) and the two isolated hex literals in `ButtonAccountDropdownInfo/index.js`.

## 5. Known simplifications in Theme Lab (documented, not hidden)

- The real app's sidebar collapse breakpoint is `@media (min-width: 992px)` (vendor bundle). Theme Lab's mobile-drawer behavior switches at `767px` instead, matching common responsive convention and the brief's four required test widths (375/768/1440/1920) rather than the source's exact `992px` cutoff. This means Theme Lab's 768px screenshot shows the "expanded" sidebar as a full in-flow panel, whereas the real app at exactly 768px would still be in its sub-992px mobile-header mode. Flagged so nobody mistakes Theme Lab's breakpoint choice for an extracted fact — it is a demo-authoring decision, not a source citation.
- Icon glyphs in Theme Lab are plain Unicode characters (☰ ◆ ▤ etc.), not the real Font Awesome 5 Pro / Ki / Flaticon2 glyphs, since those are licensed vendor fonts not redistributed in this package (see `README-HANDOFF.md`). Colors, sizing, and layout around icons are accurate; the specific glyph shapes are not.
- The KPI/stat card and the success/info/warning/danger badge mapping in Theme Lab §7 are labeled in-page as illustrative compositions/recommendations, because no such shared component or mapping exists in source (see `component-contracts.md`, Card/KPI/Badge/Alert section).

## 6. Components/states not verifiable in this pass

- **Live production app screens were not opened or authenticated against.** All verification is against `theme-lab/index.html`, a static reproduction built strictly from cited token values — not against the running CMS with real data. Anyone continuing this work should spot-check at least the Dashboard, Sidebar, and one list+detail screen pair in the actual running app to catch anything a static demo can't reveal (real data length overflow, real API loading states, etc.).
- **WCAG AA** was spot-checked on 2-3 high-visibility combinations (see `component-contracts.md` accessibility note) — not audited exhaustively across every component/state pair.
- **Segmented control and Popover**: confirmed absent from source entirely (not a missed extraction) — no demo exists for them because there is nothing to extract.
- **Full antd Table (groupHeader mode) states** (row hover/sort in that specific code path) were documented from source reading only — this pass did not locate a live screen using `groupHeader=true` to interact with directly; Theme Lab's table section demonstrates the default `react-data-table-component` path instead, which is the dominant one (72 vs. a handful of groupHeader usages).
- **Automated visual regression / pixel-diff against the live app** was not performed — out of scope for a one-time extraction pass.

---

### Build addendum

`CI=true npx react-scripts build` completed against the unmodified repository:

```
Compiled successfully.
File sizes after gzip:
  2.37 MB (+3.15 kB)  build/static/js/main.63f74b95.js
  337.23 kB (+33 B)   build/static/css/main.c6146a4e.css
  1.76 kB             build/static/js/453.d23a8b36.chunk.js
```

**Result: PASS, no compiler errors, no ESLint errors.** (CRA's `CI=true` mode treats ESLint warnings as build-breaking errors, so a clean exit confirms no lint violations either — this repo was not modified by this extraction pass; the `build/` output was deleted immediately after this check since it is not part of the handoff.) The "bundle size is significantly larger than recommended" note is CRA's standard advisory for any bundle over ~500KB gzipped and is a pre-existing condition of the app, unrelated to this task.
