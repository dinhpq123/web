# Source Map

Repository-relative paths, commit `ffae7e5` (branch `uat`). Every row below was opened and read directly — nothing here is inferred from a screenshot.

## Legend

- **Canonical** = the value that actually wins at runtime (later CSS load order / more specific selector / `!important`).
- **Legacy/alias** = a competing definition that exists in source but is overridden or unused in the active render path.

## Brand & status color sources

| Area | Canonical source | Line | Consumer examples | Notes |
|---|---|---|---|---|
| Brand palette (single source of truth for JS-driven color) | `src/general/constants/AppColors.js` | 1-34 | `src/general/helpers/UIHelper.js`, `src/general/helpers/AgencyUIHelper.js`, `KTBSCard/index.js:61-83`, `KTFormInput` error styling | `primary #30BD6F`, `danger #E14E54`, `warning #F6C000`, `info #2984EE`, `gray[0..900]`. **No `success` key exists** — `primary` is overloaded as both brand and success. |
| Vendor Bootstrap theme palette (legacy, still live via CSS) | `src/assets/styles/keen/theme01/style.bundle.css` | 23-30 (`:root` block) | Every raw `btn-primary`/`btn-danger`/`.form-control:focus` element that isn't re-themed by project overrides | `--primary:#3699ff; --danger:#F64E60; --success:#2EC573; --warning:#FFA800; --info:#3699ff;` — a **second, conflicting palette** loaded globally via `src/index.js:18-19`. |
| Ad hoc third green | `src/assets/styles/custom.style.scss` | 39 | `.dropdown-item.active` (partially overridden, see below), form-control focus | `#20b970` — neither `AppColors.primary` (#30BD6F) nor vendor `#3699ff`. |
| Effective (winning) focus-ring color | `src/assets/styles/custom.style.scss` | 42-44 | All `KTFormInput`/`.form-control` instances | `.form-control:focus { border-color: #20b970; }` — overrides vendor `#69b3ff` (`style.bundle.css:2940-2945`) because it loads after the bundle. **Canonical.** |
| Effective (winning) invalid border color | `src/assets/styles/custom.style.scss` | 51-54 | All invalid form fields | `.form-control.is-invalid { border-color: rgba(225,78,84,1) !important; }` = `AppColors.danger`. Overrides vendor `#F64E60` (`style.bundle.css:3300-3308`). **Canonical.** |
| `.dropdown-item.active`/`:active` background | `src/assets/styles/app.style.scss` | 322-330 | `KTBSDropdown` menu items | `background-color: rgba(238,241,250,1) !important; color: rgba(73,73,104,1) !important;` — wins over `custom.style.scss:37-40`'s `#20b970` because it also uses `!important` and loads later. **Canonical**; the green rule is **legacy/dead**. |

## Typography

| Area | Canonical source | Line | Consumer examples | Notes |
|---|---|---|---|---|
| Brand font family + weights | `src/assets/fonts/SVN-Gilroy/fonts.css` | 1-94 | global body text | 10 `@font-face` blocks, weights 100-700 + italics, `.otf` only (no woff/woff2). |
| Body font stack | `src/index.css` | 28 | entire app | `'SVN-Gilroy', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', ... sans-serif` |
| Divergent fallback stack (legacy inconsistency) | `src/assets/styles/app.style.scss` | 40 | Bootstrap-derived elements only | `"SVN-Gilroy", Poppins, Helvetica, sans-serif` — different fallback chain than `index.css:28`; flagged, not resolved. |
| Rich-text editor forced font | `src/assets/styles/custom.style.scss` | 112,119,127 | CKEditor surfaces | `font-family: 'SVN-Gilroy','Inter',sans-serif !important;` |

## Sidebar

| Area | Canonical source | Line | Consumer examples | Notes |
|---|---|---|---|---|
| Sidebar JS component | `src/general/components/Sidebars/KT01Sidebar/index.js` | whole file; imports styles at 14 | `KT01BaseLayout/index.js:8,29` | Only sidebar component in the repo; no legacy duplicate. |
| Sidebar background | `src/general/components/Sidebars/KT01Sidebar/style2.scss` | 8-14 | `.aside` | `linear-gradient(180deg, #1E3883 0%, #192B54 100%)` via CSS var `--evg-main-sidebar-background`. |
| Sidebar active menu item | `.../style2.scss` | 42-53 | top-level `menu-item-active` | gradient `rgba(77,191,252,.05)→rgba(77,179,252,.5)`, inset shadow `#4C76D6B2`, border `1px solid #41A7FF`, radius `8px`. |
| Sidebar hover state | `.../style2.scss` | 63-70 | any `.menu-link:hover` | identical visual treatment to active state. |
| Sidebar submenu active/hover | `.../style2.scss` | 72-108 | nested `menu-submenu` items | same tokens, `padding: 0 30px` instead of `0 15px`. |
| Sidebar section title | `.../style2.scss` | 115-117 | `.menu-section .menu-text` | `#1EF5DF` (mint, distinct from any other token — used nowhere else). |
| Sidebar menu text (non-active) | `.../style2.scss` | 111-113, 119-121 | menu labels | `#FFFFFF`. |
| Sidebar brand/logo divider | `.../style2.scss` | 24-27 | `.aside > .brand` | `border-bottom: 1px dashed #346AA8`. |
| Sidebar item icon color | `src/general/components/Sidebars/KT01Sidebar/index.js` | 187 | menu item icons | inline `style={{ color: '#DBDFF1' }}` — **not** a CSS token, set per render; matches `AppColors.gray[300]`. |
| Sidebar expanded width | `src/assets/styles/keen/theme01/style.bundle.css` | ~98275 (`.aside { width: 326px; }`) | `#kt_aside` | vendor rule, unmodified by project CSS. |
| Sidebar collapsed width | `.../style.bundle.css` | ~98301 | `.aside-minimize:not(.aside-minimize-hover) .aside` | `width: 70px` inside `@media (min-width: 992px)`. |
| Collapse toggle mechanism | `src/assets/plugins/aside/aside-toggle.js` | 11-30 | `#kt_aside_toggle` (`KT01Sidebar/index.js:99-134`) | toggles `aside-minimize` class on `<body>`; persists via cookie `kt_aside_toggle_state`. |
| Active-route matching logic | `src/general/components/Sidebars/KT01Sidebar/index.js` | 154-165 (L1), 213-232 (L2), 279-299 (L3), 348-368 (L4) | — | regex `/^(|\/\d.*|\/add.*|\/edit.*)$/` against path suffix decides `menu-item-active`. |
| Menu data | `src/general/components/Sidebars/MenuItemsList.js` | 1-1516 | `KT01Sidebar/index.js:24` (`useGetMenuItemsList`) | role-keyed (`admin`, `operator`, sale/group/investor/landlord variants). |
| Permission filtering | `src/general/components/Sidebars/SidebarHelper.js` | `checkPermissionList` | `KT01Sidebar` render | business logic — read for context only, not modified. |

## Header

| Area | Canonical source | Line | Consumer examples | Notes |
|---|---|---|---|---|
| Header JS component | `src/general/components/Headers/KT01Header2/index.js` | whole file | `KT01BaseLayout/index.js:4,33` | desktop header; mobile variant is `KT01HeaderMobile` (`BaseLayout/index.js:5,24`). |
| Header background | `.../KT01Header2/index.js` | 90 | `#kt_header` | inline `backgroundColor: '#FFFFFF'` — **not** in `style.scss`, set in JS. |
| Header bottom border | `.../KT01Header2/index.js` | 91-94 | `#kt_header` | conditional: `1px solid ${AppColors.gray[200]}` when breadcrumb depth > 1, else `AppColors.gray[300]`. |
| Header shadow | `.../KT01Header2/index.js` | 95 | `#kt_header` | `0px 7px 8px -3px #0000000D` when no breadcrumb. |
| Header icon color filter | `src/general/components/Headers/KT01Header2/style.scss` | 7-10 | `.topbar-item .btn-icon > img` | CSS `filter: invert(59%) sepia(68%) saturate(3862%) hue-rotate(189deg) brightness(100%) contrast(102%)` approximates blue `#3699ff` — **icons are raster/SVG `<img>` recolored via filter, not currentColor.** |
| Header submenu icon (muted) | `.../style.scss` | 23-25 | inactive submenu icons | different filter producing a muted navy. |
| Account dropdown panel | `src/features/System/Account/components/ButtonAccountDropdownInfo/index.js` | 111 (trigger), 164-183 (panel) | rendered from `KT01Header2/index.js:133` | **in-tree absolutely-positioned `<div>`, not a portal** — `bg-white`, `boxShadow`, `borderRadius:5px`, colors via `AppColors.gray[800]`/`[900]`/`primary`. |
| Notification drawer | `.../KT01Header2/index.js` | 181-210 | header notification bell | in-tree `position-absolute` panel, width `326px`, backdrop `rgba(var(--bs-dark-rgb),var(--bs-bg-opacity))`. |

## BaseLayout

| Area | Canonical source | Line | Consumer examples | Notes |
|---|---|---|---|---|
| Layout shell | `src/general/components/BaseLayout/KT01BaseLayout/index.js` | 17-48 | ~80+ feature screens, e.g. `src/features/System/Staff/index.js:1,9,16`, `src/features/ManageDealer/index.js:4,13,41` | Only layout component in the repo. Composes `KT01HeaderMobile` → `KT01Sidebar` + `KT01Header2` + `KT01Content` + `KT01Footer`. |
| Page content wrapper | `src/general/components/BaseLayout/KT01Content` (referenced at `index.js:39`) | — | all screens | delegates its own padding/background — not inlined in BaseLayout. |

## Shared UI components

| Area | Canonical source | Line | Consumer examples | Notes |
|---|---|---|---|---|
| Button | `src/general/components/OtherKeenComponents/KTBSButton/index.js` | 63-155 | 59 files, e.g. `DealerReconciliationReportDetailScreen/index.js:12` | renders raw Bootstrap `btn-{color}` classes — colors come from vendor bundle (`#3699ff`/`#F64E60`), **not** `AppColors`, unless caller passes explicit `bgColor`. |
| Button default/hover (vendor) | `style.bundle.css` | 60521-60525 (default), 60546-60552 (hover) | primary buttons | `#3699ff` bg/border default, `#187de4` hover. |
| Table-action icon button | `src/assets/styles/custom.style.scss` | 90-101 | row action buttons | icon `rgba(126,130,153,1)`, hover icon `#20b970`, hover bg `#f3f6f9`. |
| Text input | `src/general/components/OtherKeenComponents/Forms/KTFormInput/index.js` | whole file | 87 files, e.g. `ModalInvestorGroupFilter/index.js:7` | plain `<input class="form-control">`; embeds antd `DatePicker` (line 704) and `CurrencyInput` (line 727). |
| Input default (vendor) | `style.bundle.css` | 2902-2921 | `.form-control` | height 42px, border `#E4E6EF`, radius `0.42rem`. |
| Checkbox | `.../KTFormControls/KTCheckbox/index.js` | 38-119 | 9 files, e.g. `SignUpForm/index.js:6` | border `#9CA2B8` default (`style.bundle.css:75241-75255`). |
| Radio | `.../KTFormControls/KTRadio/index.js` | whole file | 27 files | base rule `style.bundle.css:75923`. |
| Switch | `.../KTFormControls/KTSwitch/index.js` | 81-168 | 4 files | off track `#EBEDF3`; on/primary thumb white on `#3699ff` track. |
| Dropdown (dominant) | `src/general/components/OtherKeenComponents/KTBSDropdown/index.js` | whole file | 111 files, e.g. `TransactionHistoryView/index.js:4` | Bootstrap `dropdown-menu`, in-tree (not portaled to `document.body`). |
| Dropdown (minor/legacy-adjacent) | `src/general/components/Others/CustomDropdown/index.js` | 37-119 | 3 files | not the primary pattern. |
| Date picker — closed input | antd `DatePicker`, wrapped by `KTFormInput/index.js:704-724`; input-box override at `src/assets/styles/keen/theme01/style.bundle.css:100149-100177` | 704-724; 100149-100177 | anywhere `type="date/month/year/datetime"` | **Themed, deliberately** — `.ant-picker` restyled to exactly match `.form-control` (height `42px`, border `#E4E6EF`, radius `0.42rem`, hover/focus bg `#F3F6F9`). Does **not** adopt the brand focus-ring `#20b970` that plain inputs get — a narrower, separate gap. |
| Date picker — open calendar panel | none — no `.ant-picker-dropdown`/`.ant-picker-cell`/`.ant-picker-header` rule exists anywhere in `src` | — | same | **Unthemed, raw antd v5 default** (`#1677ff`-family blue). Confirmed via `rg -c "ant-picker" src/assets/styles/keen/theme01/style.bundle.css` = 3 (all three are the input-box rules above) and zero matches for any `-dropdown`/`-cell`/`-header` selector repo-wide. This is a genuine gap, not a styling decision — see `component-contracts.md` for proposed (not-yet-real) sync tokens. |
| Tabs | `src/general/components/AppTabs/index.js` + `index.scss` | scss 26-93 | 18 files, e.g. `InvestorGroupDetailScreen/index.js:17` | default bg `#fcfcfc` color `#7E8299`; hover `#20b970`; active bg `#fff` color `#30BD6F` weight 600. |
| Breadcrumb | `src/general/components/CustomBreadcrumb/style.scss` | 1-9 | 26 files via `BreadcrumbHelper` | border `#DBDFF1`, hover `#20B970`. |
| Card | `src/general/components/OtherKeenComponents/KTBSCard/index.js` | 26-140 | 20 files | border `rgba(219,223,241,1)`, title color `AppColors.gray[800]` size 18. |
| Badge/label | `src/general/components/OtherKeenComponents/KTLabel/index.js` | 32-77 | 92 files | color entirely caller-supplied; no fixed semantic mapping baked in. |
| Alert | `src/general/components/Others/CustomAlert/index.js` | 13-51 | 6 files | effectively danger-only: title forced to `AppColors.danger` regardless of `color` prop (line 32). |
| Table | `src/general/components/OtherKeenComponents/KTTable/index.js` | 30-159 | 72 files | wraps `react-data-table-component` (default) or antd `Table` (groupHeader mode, 98-126, unthemed). |
| Table styles | `src/general/components/OtherKeenComponents/KTTable/tableStyle.js` | 9-86 | — | row `AppColors.gray[700]`; header bg `rgba(249,249,249,1)`; active sort `#3699FF`; hover `#F3F6F9` defined but **dead** — `KTTable/index.js:154` sets `highlightOnHover={false}`. |
| Pagination | `src/general/components/OtherKeenComponents/KTPagination/index.js` | 59-228 | 69 files | separate from table; `btn-icon btn-sm btn-light` page buttons + `KTBSDropdown` page-size selector. |
| Modal (helper A) | `src/general/components/AppDialog/index.js` | 117-203 | 32 files via `AppDialogHelper` | wraps `react-bootstrap` `Modal`; footer buttons via `KTBSButton` (183-195). |
| Modal (helper B) | `src/general/components/AppDialogCustom/index.js` + `style.css` | style.css 1-14 | 81 files via `AppCustomDialogHelper` | `overflow: visible !important` on modal body/content/dialog; `.custom-modal-xxl { max-width: 90% }`. |
| Tooltip | `src/general/components/OtherKeenComponents/KTTooltip/index.js` | whole file | 75 files | overrides on `app.style.scss:1-16, 297-304` (arrow color white, shadow `0 0 20px rgba(0,0,0,.15)`). |
| Toast | `src/general/components/AppToast/index.js` + `src/general/helpers/ToastHelper.js` | AppToast 3-17, Helper 3-20 | 142 files | react-toastify, **zero project color overrides** — renders library-default colors (a third, unmapped palette). No `toast.info` helper exists. |

## Routes & screens

| Area | Canonical source | Line | Notes |
|---|---|---|---|
| Route table | `src/App.js` | ~50 top-level `<Route>` (100 incl. nested) | path values from `src/general/constants/AppRoute.js` (184 lines). |
| Sidebar menu data | `src/general/components/Sidebars/MenuItemsList.js` | 1-1516 | role-keyed (`admin` 9-439, `operator` 440-1495, plus sale/group/investor/landlord variants). |
| Auth shell | `src/features/Auth/screens/AuthBaseScreen/index.js` | 159-273 | own layout (`login.login-1`), **not** `KT01BaseLayout`. |
| Auth sub-routes | `src/features/Auth/screens/AuthBaseScreen/index.js` | 195-267 | sign-in/sign-up (×5 role variants)/forgot/reset password. |

See `screen-inventory.md` and `component-contracts.md` for the full breakdown of the two tables above.
