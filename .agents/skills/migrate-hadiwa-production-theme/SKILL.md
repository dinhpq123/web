---
name: migrate-hadiwa-production-theme
description: Migrate a real Hadiwa IOC web application to the approved EVG-derived visual system, using an EVG-compatible teal/green navigation shell, EVG green for brand actions, blue for information, and semantic status colors only where they carry meaning. Preserve the exact extracted EVG navy shell as an optional backup preset. Use when Codex must audit, implement, repair, or validate Hadiwa light/dark themes and every routed or role-gated screen without changing production business logic, auth, RBAC, APIs, routes, or workflows.
---

# Migrate Hadiwa Production Theme

Apply the approved prototype visual language to the real application as a controlled styling migration. Treat this as production work, not a palette search-and-replace.

## Read The References

Read only what the task phase needs:

- Read [palette-and-semantics.md](references/palette-and-semantics.md) before authoring tokens or choosing any color.
- Read [component-migration.md](references/component-migration.md) before editing shared components, icons, generated markup, charts, maps, login, or the module hub.
- Read [screen-inventory.md](references/screen-inventory.md) while building route coverage and before claiming all screens are complete.
- Read [prototype-acceptance-ledger.md](references/prototype-acceptance-ledger.md) before visual sign-off; it records the concrete failures already rejected in the prototype.
- Read [production-validation.md](references/production-validation.md) before browser validation or the final report.

Run `scripts/audit-theme-coverage.sh <repo-root>` during discovery and after migration. Classify every result; do not blindly replace every literal.

When `evg-theme-export/` exists at the repository root, treat it as verified source evidence and read, in order:

1. `README-HANDOFF.md` for provenance and limitations;
2. `tokens/evg-theme.tokens.json` for exact extracted values and `status: proposed` markers;
3. `source-map.md` and `component-contracts.md` before changing a shared component;
4. `validation-report.md` before claiming parity.

Do not copy licensed EVG source, vendor bundles, fonts, logos, application code, mock data, routes, or business behavior. Import semantic facts and reproduce them through the target application's existing architecture.

## Non-Negotiable Boundary

Change styling and theme plumbing only:

- CSS/SCSS/Less variables, theme providers, style modules, classes, safe style props;
- icon color inheritance and visual assets only when needed for theme consistency;
- chart/map/canvas palette configuration without changing data;
- visual spacing required to prevent overlap or broken presentation.

Do not change:

- API calls, payloads, database code, authentication, authorization, RBAC, route behavior, business calculations, state transitions, approval flows, realtime behavior, fullscreen behavior, or event ownership;
- labels, values, data ordering, pagination behavior, form validation, or feature visibility;
- framework, component architecture, or design library unless the user explicitly expands scope.

If a production behavior bug blocks visual validation, report it separately. Do not hide a behavior change inside the theme diff.

## Canonical Direction

Use the approved Hadiwa adaptation by default:

- Default preset ID: `evg-emerald`.
- Sidebar parent: `linear-gradient(180deg, #0F5B55 0%, #123D42 100%)`.
- Sidebar section labels: `#8BE7B5`.
- Sidebar active/hover item: `linear-gradient(180deg, rgba(48,189,111,0.12) 0%, rgba(48,189,111,0.30) 100%)`, border `#58CB89`, inset shadow `0 0 22px rgba(48,189,111,0.28)`.
- Light brand/action primary: `#30BD6F`; hover `#1BA05C`; form focus border `#20B970`.
- Information/neutral processing: `#2984EE`; never substitute it for success or primary action without an explicit component contract.
- Hadiwa dark extension primary: `#45D483`; this is target-designed because EVG source has no dark mode.
- Dark workspace and header keep navy/blue surfaces; do not extend the teal sidebar across the content canvas.
- Green is not a generic highlight. Use it for primary actions, selected controls defined by the contract, and true success/online states. Do not color every KPI, chart series, border, icon, or row green.
- Red, amber, and orange are status/domain colors, not decoration.
- Purple is allowed only for documented AI/category/role identity.

Never recreate the old cyan-neon Hadiwa coat of paint. Never turn the entire application into one blue slab. Preserve surface, text, border, information, warning, danger, and domain distinctions.

Preserve the exact extracted EVG shell as preset `evg-classic-navy` for rollback or reuse. It uses `#1E3883 -> #192B54`, section label `#1EF5DF`, active edge `#41A7FF`, and inset shadow `0 0 25px #4C76D6B2`. Do not silently make this backup the Hadiwa default, and do not rewrite its values when adapting the approved default preset.

## Theme Lab Gate

Before broad screen migration, create or update a target-native `theme-lab.html` (or a dev-only route) using fake data and no production API. It must exercise AppShell, typography, buttons, forms, tabs, dropdowns, tables, pagination, semantic statuses, modal, drawer, toast and tooltip in light and dark modes. Verify real interactions and 375px, 768px, 1440px and 1920px viewports. A source-faithful EVG Theme Lab is evidence; it is not a substitute for the target-native lab.

## Phase 0: Production Preflight

1. Read repository instructions and inspect `git status`.
2. Identify the framework, build command, test command, dev command, style entry points, theme provider, icon library, chart libraries, map libraries, route definitions, menu definitions, RBAC visibility, portals, iframes, and generated HTML.
3. Record the current branch and existing dirty files. Never overwrite or revert user changes.
4. Determine how light/dark mode and brand choice persist. Identify SSR/hydration constraints and CSP restrictions.
5. Start no migration until the application builds or the pre-existing blocker is documented.
6. Do not deploy. Do not touch production data. Use local or approved staging validation.
7. If the approved HTML prototype is available, use its tokens and screenshots as visual evidence. Do not copy its mock data, route logic, auth, RBAC, event handlers, or static DOM into production.

## Phase 1: Exhaustive Discovery

Build a coverage table from code, not screenshots alone:

```text
route/screen | renderer/component | roles | light | dark | interactive states | dynamic visuals | status
```

Inventory all of the following:

- public routes: login, forgot password, 2FA/OTP, errors;
- post-login launcher and role-filtered modules;
- every route in router, menu, lazy import, route registry, deep link, modal route, drawer, tab, and legacy fallback;
- all role-gated screens, including screens inaccessible to the current test account;
- shared shell: sidebar, header, breadcrumbs, ticker, filter bar, notifications, user menu, chatbot;
- component states: default, hover, focus-visible, active, selected, disabled, loading, empty, error, offline, warning, danger;
- JS-generated styles, inline styles, SVG `fill`/`stroke`, Chart.js/Apex/ECharts options, Leaflet/Mapbox styles, canvas drawing, iframes, and third-party widgets.

Run the audit script and classify literals as:

```text
brand | interaction | surface | text | border | status | PCTT domain | data visualization | category identity | accidental residue
```

Do not edit during discovery unless a file cannot be parsed without a minimal repair.

## Phase 2: Install One Semantic Theme

1. Adopt the matrices in `palette-and-semantics.md` as the approved seed.
2. Map them into the production app's existing theme API. Prefer the framework's established provider and token mechanism.
3. Maintain one canonical semantic layer. Compatibility aliases may temporarily bridge legacy code but must point to canonical tokens.
4. Separate:
   - primary interaction from success;
   - online status from generic success/brand;
   - visual color from accessible text color;
   - muted text from disabled text;
   - sidebar/navigation tokens from workspace surface tokens;
   - PCTT alert levels from generic warning/danger;
   - chart series colors from component interaction colors.
5. Apply theme before first paint to avoid flashes and hydration mismatch.
6. Preserve stored appearance and brand settings across refresh.

## Phase 3: Migrate Shared Shell First

Migrate in this order:

1. application background and root text;
2. sidebar parent, logo, section headings, item default/hover/active, badges, collapse control, footer;
3. header, status indicator, weather, clock, profile, mode toggle, fullscreen and logout controls;
4. filter bars, LIVE ticker, breadcrumbs, page headers and action groups;
5. cards, dividers, tabs, segmented controls, buttons, inputs, selects, checkboxes, radios, toggles;
6. tables, pagination, tooltips, dropdowns, popovers, modals, drawers, toasts, loading and empty states;
7. shared icon wrappers and focus-visible rings.

Use familiar icons from the existing library. Make SVGs inherit `currentColor` where safe. Do not use a colored rounded box around every icon. Decorative icon color defaults to primary blue; semantic icon color follows its actual meaning.

## Phase 4: Migrate Every Screen Family

Use `screen-inventory.md` as the minimum list, then extend it with routes found in production.

For each screen:

1. Open it through normal navigation and, when supported, through its direct URL.
2. Validate all roles that can render materially different content.
3. Migrate the page shell, controls, cards, tables, charts/maps/media, dialogs, and all states.
4. Mark the coverage row complete only after visual inspection in both appearances.

Do not assume a shared CSS change covers a screen. Camera, Video Wall, GIS, dashboard charts, login, launcher, and generated approval/report screens require independent inspection.

## Phase 5: Preserve Intentional Color Exceptions

Use multi-color only when it communicates stable identity or data meaning:

- Module launcher: preserve the seven approved category colors exactly.
- Login quick accounts: preserve approved role colors for icon, badge, border, and selected state.
- Online/healthy indicator: use `--status-online`, not generic brand green.
- PCTT warning levels: use BD1/BD2/BD3/critical tokens.
- Charts, rainfall, hydrology, heatmaps, risk matrices, and GIS layers may be multi-series.
- AI identity may use approved purple in AI-specific surfaces only.

Every other unexplained green, purple, orange, red, or black/gray block is suspect. Replace decorative rainbow accents with restrained primary, neutral, or semantic status styling.

## Phase 6: Dynamic And Visualization Surfaces

Follow `component-migration.md` for implementation patterns.

- Resolve CSS variables to concrete colors when a canvas/chart/map API cannot consume `var(...)`.
- Recompute visualization palettes after appearance changes.
- Keep chart legends compact and outside the plotting canvas when internal legends create wasted space.
- Keep KPI sparklines in stable fixed-size regions and reserve content space so text cannot overlap.
- Preserve camera footage, map imagery, product assets, logos, and domain media colors.
- Theme iframe contents only when same-origin and in scope; otherwise theme the containing chrome and document the limitation.

## Phase 7: Validate Before Completion

Follow every gate in `production-validation.md`:

1. Build, lint, typecheck, and focused tests.
2. Run the color audit again and explain all remaining literals.
3. Browser-test every route and role in the coverage table.
4. Capture desktop and mobile screenshots in light and dark modes.
5. Inspect computed colors, text contrast, overflow, overlap, blank charts, invisible text, focus states, and theme persistence.
6. Compare production screenshots with the approved prototype direction, not pixel-for-pixel DOM structure.
7. Confirm the theme diff did not alter route/auth/business behavior.

Do not claim “all screens” when any route is unvisited, inaccessible without an untested role, or blocked by external state. Report exact gaps.

## Completion Report

Return a concise report containing:

```markdown
## Scope
- Repository/branch:
- Theme source:
- Behavior changes: none / list approved exceptions

## Coverage
- Routes discovered:
- Routes validated light/dark:
- Roles validated:
- Blocked routes:

## Theme
- Canonical token files:
- Shared components migrated:
- Intentional color exceptions:
- Remaining hardcoded colors and reasons:

## Verification
- Build/lint/typecheck/tests:
- Screenshot viewports:
- Contrast:
- Theme persistence:
- Final result: PASS / NEEDS REVIEW
```

Only mark `PASS` when the route table has no unexplained gaps and all mandatory gates pass.
