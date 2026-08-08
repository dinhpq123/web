# Component Contracts

Every state below cites `file:line` from `source-map.md`. "Demo" pointers refer to the matching section in `theme-lab/index.html`. Light mode only — dark mode is not implemented in source.

## AppShell (Sidebar + Header + BaseLayout)

**Source**: `KT01BaseLayout/index.js:17-48` composes `KT01HeaderMobile` → `KT01Sidebar` + `KT01Header2` + `KT01Content` + `KT01Footer`.

| State | Sidebar | Header |
|---|---|---|
| Default | gradient bg `#1E3883→#192B54` (`style2.scss:9`), width `326px` (vendor bundle) | white bg (`KT01Header2/index.js:90`), border `1px solid gray300` when no breadcrumb |
| With breadcrumb path (depth > 1) | — | border switches to `gray200`, shadow removed (`index.js:91-95`) |
| Collapsed | width `70px` (`@media (min-width:992px)`, vendor bundle ~98301); toggled via `aside-minimize` class on `<body>` (`aside-toggle.js:11-30`), state persisted in cookie `kt_aside_toggle_state` | unaffected |
| Collapsed + hover | width re-expands to `326px`, `.wrapper` gets `padding-left:70px` (vendor bundle ~98320-98326) | — |
| Mobile | `KT01HeaderMobile` renders instead/above (`BaseLayout/index.js:24`) — separate component, not covered by this contract | — |

**Demo**: Theme Lab §2 (Sidebar) and §3 (Header) reproduce both expanded/collapsed and breadcrumb/no-breadcrumb variants side by side.

## Sidebar menu item

**Source**: `KT01Sidebar/style2.scss`, active/route logic `KT01Sidebar/index.js:154-368`.

| State | Value | Source |
|---|---|---|
| Default | text `#FFFFFF`, no border/bg, transition `all 0.3s ease` | `style2.scss:56-60, 112` |
| Hover | gradient bg, inset shadow `#4C76D6B2`, border `1px solid #41A7FF`, radius `8px` | `style2.scss:63-70` |
| Active (route match) | identical visual to hover (same gradient/border/shadow) + text stays `#FFFFFF !important` | `style2.scss:42-53` |
| Active determination | top-level: no submenu → `pathName.startsWith(item.path)` AND suffix matches `/^(|\/\d.*|\/add.*|\/edit.*)$/`; with submenu → `menu-item-open` if path is a substring of `pathName` | `KT01Sidebar/index.js:154-165` |
| Submenu nesting (L2-L4) | same active/hover treatment, `padding: 0 30px` instead of `0 15px` | `style2.scss:72-108`, logic at `index.js:213-368` |
| Section header (non-interactive) | text `#1EF5DF`, no hover/active state (not a link) | `style2.scss:115-117`, render at `index.js:437-445` |
| Disabled/hidden | items filtered out entirely via `show`/permission check — never rendered, no visual "disabled" state exists | `SidebarHelper.js` `checkPermissionList` |
| Focus-visible | **not defined** — no `:focus-visible` rule exists on `.menu-link` in source; keyboard-focus styling is a gap to fix during migration, not to invent as if it existed | — |

**Demo**: Theme Lab §2, hover/active toggled via CSS `:hover`/`.is-active` class matching the same selectors.

## Header — Account dropdown & Notification drawer

**Source**: `ButtonAccountDropdownInfo/index.js`, `KT01Header2/index.js:181-210`. **Not portals** — both are in-tree absolutely-positioned `<div>`s using `useOnClickOutside`, so no `document.body` portal-CSS risk exists for these two, unlike a typical antd/MUI dropdown.

| State | Account dropdown | Notification drawer |
|---|---|---|
| Closed | not rendered / `display` toggled off | `translateX(100%)` off-screen |
| Open | `bg-white`, `border-radius:5px`, `box-shadow`, `min-width:240px` | slides to `translateX(0)`, width `326px`, backdrop `rgba(var(--bs-dark-rgb), var(--bs-bg-opacity))` |
| Item hover | no dedicated CSS rule found — relies on default Bootstrap link/hover, not a custom token | — |
| Colors used inside | `AppColors.gray[800]`, `AppColors.gray[900]`, `AppColors.primary` (`ButtonAccountDropdownInfo/index.js:119,123,134,190,196`) | — |

**Demo**: Theme Lab §3 includes a static "open" state snapshot of both (no live JS state machine needed — the source itself is a simple boolean toggle).

## Button (`KTBSButton`)

**Source**: `KTBSButton/index.js:63-155`. Renders a `<div>` with Bootstrap `btn btn-{color}` classes.

| Variant | Default | Hover | Active/press | Disabled | Loading |
|---|---|---|---|---|---|
| Primary (vendor, unstyled callers) | bg/border `#3699ff` text `#fff` (`style.bundle.css:60521-60525`) | bg/border `#187de4` (`:60546-60552`) | `border-color:transparent!important` (`app.style.scss:27-29`) | `.disabled` class, base Bootstrap opacity rule (`style.bundle.css:3536`) — no custom disabled token | no built-in spinner; callers pass `iconElement` manually, e.g. `AppDialog/index.js:194` `spinner spinner-white` |
| Danger (vendor) | bg/border `#F64E60` (`:65525-65529`) | bg/border `#EE2D41` (`:65550-65554`) | same as above | same | same pattern |
| Icon-only / circle | `.btn-icon` sizing `calc(1.5em + 1.3rem + 2px)`, `.btn-circle` → `border-radius:50%` | inherits variant hover | inherits | inherits | — |
| Table row action | icon `rgba(126,130,153,1)` | bg `#f3f6f9`, icon `#20b970` | — | — | — |

**Gap flagged**: `KTBSButton` never reads `AppColors` unless a screen explicitly passes `bgColor`/`hoverColor` props — the button's "brand primary" as rendered today is the **vendor blue `#3699ff`**, not `AppColors.primary` (`#30BD6F`). A migration must decide whether to recolor buttons to the green brand token or preserve the blue as-is; this package does not decide that for you (see `skill/SKILL.md` step 5).

**Demo**: Theme Lab §5 shows both the "as-rendered today" (vendor blue/red) and a "green-brand" swap for comparison, clearly labeled.

## Text input (`KTFormInput`) / Checkbox / Radio / Switch

**Source**: `KTFormInput/index.js`, `KTCheckbox/index.js:38-119`, `KTRadio/index.js`, `KTSwitch/index.js:81-168`.

| State | Input | Checkbox | Radio | Switch |
|---|---|---|---|---|
| Default | h `42px`, border `#E4E6EF`, radius `0.42rem`, text `#3F4254` (`style.bundle.css:2902-2921`) | border `#9CA2B8`, radius `0.22rem` (`:75241-75255`) | base rule `:75923` | off track `#EBEDF3` (`~76998`) |
| Placeholder | `#B5B5C3` (`:2957-2979`) | — | — | — |
| Focus | border `#20b970` — **canonical, overrides vendor `#69b3ff`** (`custom.style.scss:42-44` over `style.bundle.css:2940-2945`) | no dedicated focus ring found | no dedicated focus ring found | no dedicated focus ring found |
| Disabled/readonly | bg `#F3F6F9`, opacity 1 (`:2982-2986`) | `.checkbox-disabled { opacity:.6 }` (`:75285-75288`) | — | — |
| Checked/On | — | `.checkbox-primary` checked style (`:75402-75450`) | — | thumb white on `#3699ff` track (`~77007-77020`) — **vendor blue, not AppColors.primary** |
| Invalid | border `#E14E54 !important` — **canonical, overrides vendor `#F64E60`** (`custom.style.scss:51-54` over `:3300-3308`); invalid+focus shadow `0 0 0 .2rem rgba(246,78,96,.25)` still uses the **legacy** red tint (`:3316-3321`, not patched) | — | — | — |
| Error message | white bg, `AppColors.gray[700]` text, `box-shadow: 0 2px 6px rgba(0,0,0,.2)` (`KTFormInput/index.js:758-788`, inline) | — | — | — |

**Gap flagged**: invalid *border* color is patched to brand red (`#E14E54`) but the invalid *focus box-shadow* tint is not — a partial fix left in source. Migration should either finish this consistently or explicitly preserve the inconsistency; don't silently "fix" it without noting the change (see `skill/SKILL.md`).

**Demo**: Theme Lab §5 (form controls), all four inputs shown default/focus/disabled/invalid side-by-side.

## Select / Dropdown / Date picker

**Source**: `KTBSDropdown/index.js` (dominant, 111 consumers), `CustomDropdown/index.js` (minor), antd `DatePicker` wrapped by `KTFormInput/index.js:704-724`.

**Correction from an earlier pass of this handoff**: the first draft of this document said the antd `DatePicker` was "completely unthemed." That was imprecise. A second, targeted read of `src/assets/styles/keen/theme01/style.bundle.css:100149-100177` found exactly 3 project-authored `.ant-picker*` rules — and zero rules for `.ant-picker-dropdown`/`.ant-picker-cell`/`.ant-picker-header`/`.ant-picker-today` anywhere in the repo (`rg -c "ant-picker" src/assets/styles/keen/theme01/style.bundle.css` → 3; `rg -n "ant-picker-dropdown|ant-picker-cell|ant-picker-header" src/assets/styles/keen/theme01/style.bundle.css` → 0 matches). The real, precise state is a **split contract**:

| Surface | Themed? | Evidence |
|---|---|---|
| **Closed input box** (`.ant-picker`, the trigger the user clicks) | **YES — themed to match `.form-control`** | `style.bundle.css:100149-100160`: `height:42px; padding:.65rem 1rem; color:#3F4254; background-color:#ffffff; border:1px solid #E4E6EF; border-radius:0.42rem;` — identical values to the plain text input contract above. Hover/focus (`:100169-100177`, scoped `:where(.css-dev-only-do-not-override-...)`) set `background-color:#F3F6F9`, matching `.form-control[disabled]`'s bg, `border-color:#E4E6EF` (unchanged — **note this does NOT switch to the brand focus-ring `#20b970` that plain text inputs get**, a second, narrower gap). |
| **Open calendar panel** (`.ant-picker-dropdown` and everything inside it — cells, header, "today" marker, selected-date highlight), rendered into a **real antd portal at `document.body`** | **NO — raw antd v5 default theme**, blue accents (`#1677ff`-family) | Zero overrides found anywhere in `src` for any `.ant-picker-dropdown`-scoped class. This is the part that visually clashes with the rest of the green/gray UI. |

So: the input box is genuine, deliberate EVG visual (someone specifically reskinned it to match Bootstrap) — **do not discard it as noise during migration**. The dropdown panel is a real, unaddressed gap — not a decision, an omission.

| State | KTBSDropdown | antd DatePicker (closed input) | antd DatePicker (open panel, portal) |
|---|---|---|---|
| Default | Bootstrap `dropdown-menu`, in-tree (not portaled) | `.form-control`-matched: border `#E4E6EF`, radius `0.42rem`, height `42px`, text `#3F4254` (`style.bundle.css:100149-100160`) | raw antd default — unthemed |
| Hover | default Bootstrap `.dropdown-item:hover` (no project override found) | bg `#F3F6F9` (`:100169-100174`) | n/a |
| Focus | n/a | bg `#F3F6F9`, border stays `#E4E6EF` — **does not adopt the brand focus ring `#20b970`** (`:100175-100177`) | n/a |
| Item active/selected | canonical: bg `rgba(238,241,250,1)`, text `rgba(73,73,104,1)` (`app.style.scss:322-330`); a competing legacy rule sets bg `#20b970` (`custom.style.scss:37-40`) but loses to the `!important` rule above | n/a | **unthemed** — antd default selected-cell blue |
| Calendar open | clipped by ancestor `overflow:hidden` if any (in-tree, not `document.body`-portaled) — a real but different risk than antd-portal clipping | n/a | renders into a **real antd portal** at `document.body`; zero `.ant-picker-dropdown` overrides exist, so it renders in unthemed antd blue, clashing with the green UI around it |

**Portal-safety verdict for migration**: `KTBSDropdown` menus are NOT portaled (DOM-child), so global class selectors targeting `.dropdown-menu`/`.dropdown-item` are safe to carry over as-is. The antd `DatePicker`'s calendar panel **is** portaled — any migration that adds `.ant-picker-dropdown` theming must use a **global, unscoped** selector (not a CSS-module/scoped style) or it will silently fail to apply, exactly the risk the brief warns about. (The existing `.ant-picker` input-box override already proves the team knows how to write a global, portal-safe-by-virtue-of-not-needing-a-portal rule for the *input*; the same discipline was simply never applied to the *panel*.)

### Recommended synchronization (proposed, not extracted — do not present as source fact)

To close this gap, `tokens/evg-theme.tokens.json`/`.css`/`.scss` add a `datepicker.*` token group under a `"status": "proposed"` marker:

- `datepicker.inputBorder` / `datepicker.inputBackground` / `datepicker.inputHoverBackground` — these three mirror the **real, existing** `.ant-picker` override 1:1 (not proposed, extracted) so the token set has a name for what's already there.
- `datepicker.inputFocusBorder` (proposed = `border.focus` / `#20b970`) — closes the "input box doesn't adopt the brand focus ring" gap noted above.
- `datepicker.panelAccent` (proposed = `brand.primary` / `#30BD6F`), `datepicker.panelSelectedBg` (proposed = `brand.primaryLight` / `#BDFF9F`), `datepicker.panelTodayBorder` (proposed = `brand.primary`) — a minimal set to theme `.ant-picker-dropdown .ant-picker-cell-selected`, `.ant-picker-today .ant-picker-cell-inner::before`, and the panel header's active-month accent, replacing antd's default blue with the brand green so the open panel stops clashing with the rest of the UI.

These proposed values are a **recommendation for visual consistency**, chosen to match the brand token already governing every other "selected/active" state in the app (sidebar active border aside, which intentionally uses its own distinct `#41A7FF` accent per the Sidebar contract above). They are marked `"status": "proposed"` in the token JSON specifically so a consumer of this package can tell them apart from extracted facts at a glance — accepting them means making a small, deliberate visual decision, not "matching what EVG already does."

**Demo**: Theme Lab §6 now shows three things side by side: the open `KTBSDropdown` panel (in-tree), the antd DatePicker's calendar panel exactly as it renders in production today (unthemed antd blue, clearly labeled "as-shipped, unthemed"), and a second calendar mock using the proposed `datepicker.panelAccent` tokens (clearly labeled "proposed sync, not source fact") — so the gap and the fix are both visible, not just described in prose.

## Tabs / Breadcrumbs

**Source**: `AppTabs/index.js` + `index.scss:26-93`; `CustomBreadcrumb/style.scss:1-9`.

| State | Tabs | Breadcrumb |
|---|---|---|
| Default | bg `#fcfcfc`, text `#7E8299`, border-top/left `1px solid #dbe3ef` | border-bottom `1px solid #DBDFF1`, shadow `0px 7px 8px -3px #0000000D` |
| Hover | text `rgba(32,185,112,1)` | clickable crumb hover: `#20B970 !important` |
| Active | bg `#fff`, text `#30BD6F`, weight `600` | n/a (breadcrumb has no "active" state beyond hover) |
| Rounded variant | `border-radius: 10px 10px 0 0` | — |

**No Segmented control exists in source** — omitted rather than invented.

**Demo**: Theme Lab §6.

## Card / KPI / Badge / Alert

**Source**: `KTBSCard/index.js:26-140`; `KTLabel/index.js:32-77`; `CustomAlert/index.js:13-51`.

| Component | Default | Notes |
|---|---|---|
| Card | border `1px solid rgba(219,223,241,1)`, header padding `15px 15px 10px 15px`, title color `gray800` size `18`, body/footer padding `10px 15px 10px 15px` | no shadow by default |
| KPI/stat widget | **no reusable component exists** — built ad hoc per screen | Theme Lab §7 composes one from card + typography tokens only, explicitly labeled "illustrative composition, not a lifted component" |
| Badge (`KTLabel`) | variants `label-pill`/`label-rounded`/`label-square`/`label-dot`; color **entirely caller-supplied**, no semantic mapping baked into the component | Theme Lab §7 demonstrates the component with the four semantic status colors applied via props, to show intended usage — the mapping is a **recommendation**, not an extracted fact, and is labeled as such |
| Alert (`CustomAlert`) | `border: 1px dashed ${color}`, default `color=AppColors.danger`, `bgColor` default `rgba(225,78,84,0.1)`, title forced to `AppColors.danger` regardless of `color` prop (line 32) | **Effectively danger-only today.** Theme Lab §7 shows the real default (danger) plus what passing `color=AppColors.primary/info/warning` looks like structurally — again labeled as a demonstration of the prop surface, not a claim that success/info/warning alerts exist as first-class variants in source |

## Table / Filter bar / Pagination

**Source**: `KTTable/index.js:30-159`, `tableStyle.js:9-86`, `KTPagination/index.js:59-228`.

| State | Value | Source |
|---|---|---|
| Header row | bg `rgba(249,249,249,1)`, border-bottom `rgba(219,223,241,1)`, cell text `12px/600/gray700` | `tableStyle.js:26-29,47-65` |
| Row | min-height `44px`, text `gray700`, border-bottom `rgba(219,223,241,1)` | `tableStyle.js:9-19` |
| Row hover | style defined as bg `#F3F6F9` (`tableStyle.js:21-23`) but **DEAD** — `KTTable/index.js:154` passes `highlightOnHover={false}` | flagged, not silently dropped |
| Selected row | `selectableRowsHighlight={true}` is the actually-active visual instead of hover (`KTTable/index.js:155`) — exact highlight color comes from react-data-table-component's internal default, not a project token | — |
| Sort indicator active | `#3699FF` (vendor blue) | `tableStyle.js:66-77` |
| Sort indicator inactive/hover | `#B5B5C3` → `#3699FF` on hover | `tableStyle.js:78-86` |
| Empty state | `EmptyView` component passed as `noDataComponent` | `KTTable/index.js:1,149` |
| Pagination | separate `KTPagination` component, `.btn.btn-icon.btn-sm.btn-light` page buttons + `KTBSDropdown` page-size selector — not react-data-table-component's built-in pager | `KTPagination/index.js:59-228` |
| antd Table path (groupHeader mode) | raw antd default header/row/sort — **unthemed** | `KTTable/index.js:98-126` |

**Demo**: Theme Lab §8 reproduces header/row/selected/empty states with the real (currently dead) hover style shown *disabled by default* with a toggle to preview it, so the demo doesn't misrepresent current behavior.

## Modal / Drawer / Toast / Tooltip

**Source**: `AppDialog/index.js:117-203`, `AppDialogCustom/index.js` + `style.css`, `KTTooltip/index.js`, `AppToast/index.js` + `ToastHelper.js`. **No antd Modal/Popover/Tooltip anywhere** — everything is `react-bootstrap` + `react-toastify`.

| Component | Surface | Overlay | Notes |
|---|---|---|---|
| `AppDialog` | Bootstrap `.modal-content` white, `rounded-lg` | `backdrop='static'` or `true` per `canClickOutsideToDismiss` prop; default Bootstrap `.modal-backdrop{opacity:.5}` unmodified | footer buttons are `KTBSButton` (`index.js:183-195`) |
| `AppDialogCustom` | same Bootstrap surface | same default backdrop | `overflow:visible !important` on body/content/dialog (`style.css:1-7`); `.custom-modal-xxl{max-width:90%!important}` (`:12-14`) |
| Tooltip (`KTTooltip`) | Bootstrap `.tooltip`, arrow forced white (`app.style.scss:1-16`), shadow `0 0 20px rgba(0,0,0,.15)` (`:297-300`) | react-overlays portal, but override is class-based so it's portal-safe | — |
| Toast (`AppToast`) | react-toastify default container, `position="top-right"`, `autoClose=5000` | — | **zero project color overrides** — success/error/warning render in react-toastify's own default palette, a third unmapped palette; **no `toast.info` helper exists** in `ToastHelper.js` |

**Demo**: Theme Lab §9 triggers a real modal, a real tooltip (hover), and a real toast (via the page's own JS, not a screenshot) to satisfy "verify by interaction, not just static screenshot."

## Icons

**Source**: Font Awesome 5 Pro classes + bundled FA6 CSS, Keenthemes "Ki" font, Flaticon2 font, and static SVG/PNG under `src/assets/icons/` rendered via `<img>`.

- Font icons (`<i className="fa...">`) inherit `color` from CSS (`currentColor`-equivalent behavior since font glyphs paint with `color`) — these ARE themeable via the neutral/text tokens.
- Static SVG assets are **not** themeable — they carry hardcoded `fill`/`stroke` values baked into the file (confirmed on `ic_light.svg`, `ic_total_energy.svg`). A migration must either re-export these assets with `fill="currentColor"` or accept they stay fixed-color.
- Header topbar icons use a CSS `filter()` hack to recolor raster/SVG `<img>` icons (`KT01Header2/style.scss:7-10`) rather than currentColor — documented in `evg-theme.tokens.json` under `header.iconFilter` as a non-token effect, since it can't be expressed as a swappable color value.

## Accessibility note (WCAG AA, as observed — not audited exhaustively)

- Sidebar item text `#FFFFFF` on the darkest gradient stop `#192B54` → contrast ratio ≈ 10.7:1 (passes AA/AAA for normal text).
- Header border/shadow-only distinctions (no color-only state that fails contrast was found on header chrome).
- `CustomAlert` danger text `AppColors.danger #E14E54` on `bgColor rgba(225,78,84,0.1)` (effectively a very light pink-white) → contrast ≈ 4.6:1, passes AA for normal text (≥4.5:1) but is close to the threshold — worth re-checking if bgColor opacity changes during migration.
- Full WCAG audit (every component × every state) was **not** performed — this is a spot-check, not a certification. See `validation-report.md`.
