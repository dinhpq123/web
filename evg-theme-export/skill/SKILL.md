---
name: migrate-evg-visual-system
description: Apply the verified EVG visual system to an existing web application while preserving business logic, routes, auth, RBAC, APIs, and workflows.
---

# Migrate EVG visual system

This skill applies the EVG CMS design tokens and component contracts (captured in this same `evg-theme-export/` package — `tokens/`, `component-contracts.md`, `source-map.md`) to a **different** codebase's UI layer, without touching that codebase's business logic. It does not assume the target app is React, Bootstrap, or antd — it only assumes the target has *some* AppShell + shared UI components you can retheme.

Do not run this skill against the EVG source repo itself unless the task explicitly asks to change EVG's own visuals — its default job is porting the theme **out** to another application.

## Ground rules (read before touching anything)

1. **Never change business logic.** No route changes, no auth/RBAC changes, no API client changes, no state-management changes, no data-shape changes. If a component mixes visual JSX with logic (common in this era of code), touch only className/style/token usage — leave props, handlers, and data flow untouched.
2. **No blanket green.** `AppColors.primary` (`#30BD6F`) is brand, not a universal accent. Do not apply it to every button, badge, or icon "because it's the brand color." Apply status colors (success/info/warning/danger) only where the target component already conveys that specific meaning.
3. **Preserve documented gaps, don't silently fix them.** Source has real inconsistencies (vendor blue `#3699ff` competing with brand green `#30BD6F`; two different invalid-red values; dead hover CSS; a danger-only Alert component; unthemed antd DatePicker). `component-contracts.md` and `source-map.md` flag each one. When migrating, either (a) explicitly resolve the inconsistency and say so in your change description, or (b) preserve it as-is. Never resolve it silently and claim you "matched EVG" — you didn't match EVG, you invented a cleaner EVG that doesn't exist.
4. **Dark mode is not implemented in source.** If the target app has a dark mode, do not invent an "EVG dark theme" — either leave the target's existing dark theme untouched, or explicitly tell the requester that a dark palette must be designed fresh, sourced from nothing in this handoff.

## Step 1 — Discover the target before changing anything

- Map the target's own AppShell: find its sidebar/nav, header/topbar, and root layout component(s) — equivalent to `KT01BaseLayout` + `KT01Sidebar` + `KT01Header2` here.
- Map its shared UI primitives: button, input/checkbox/radio/switch, select/dropdown/date-picker, tabs, card, badge, alert, table+pagination, modal/drawer, tooltip, toast. Note which are custom components vs. a UI library's defaults (antd/MUI/Chakra/etc.) — this determines whether you theme via a config object (e.g. antd `ConfigProvider`) or via CSS overrides.
- Identify the target's own route list and confirm which routes render through the AppShell vs. standalone (login, public/guest flows) — mirror the EVG split documented in `screen-inventory.md` (CMS screens vs. Auth screens vs. public payment/QR screens).
- Do not start editing component files during discovery. Discovery output should be a short map (which file is the target's Sidebar, Header, Button, etc.) before any diff is written.

## Step 2 — Import semantic tokens first

- Bring in `tokens/evg-theme.css` (or `.scss`/`.tokens.json`, whichever matches the target's stack) as a new file, additive — do not delete the target's existing token file.
- Map each EVG semantic token to the *purpose* it serves, not just the hex value: brand vs. success vs. info vs. warning vs. danger vs. neutral, per the definitions in the task brief and `tokens/evg-theme.tokens.json`. If the target already has its own semantic tokens, this step is a **remapping exercise** (old token name → EVG value), not a wholesale CSS variable renaming across every file.
- Resolve the "which primary wins" question explicitly and once: EVG has three candidate primaries (`AppColors.primary #30BD6F` canonical brand, legacy vendor `#3699ff` still rendering on unstyled buttons, ad hoc `#20b970` focus ring). Pick one as *the* target-app primary and record that decision — do not let all three leak into the target.
- Do not import raw hex literals scattered through component files as you find them — always route through the token file so a future rebrand is a one-file change.

## Step 3 — Migrate in this order: AppShell → shared controls → overlays → data display → screens

1. **AppShell**: sidebar background/active/hover states, header background/border/shadow, collapse/expand behavior and widths. Use `component-contracts.md` §AppShell/Sidebar/Header for exact values and the collapse-width mechanism (class toggle on a root element, not per-item state).
2. **Shared controls**: buttons (decide vendor-blue vs. brand-green per Step 2's decision), inputs/checkbox/radio/switch (focus ring, invalid border), tabs/breadcrumbs, card/badge/alert.
3. **Overlays**: dropdown, date picker, modal/drawer, tooltip, toast. This is the highest-risk phase — see Step 6 before touching any of these.
4. **Data display**: table header/row/hover/selected/sort/empty/pagination.
5. **Screens**: only after 1-4 are stable, sweep individual screens for any remaining hardcoded colors that bypass the shared components (EVG itself has plenty — see `validation-report.md`'s hardcoded-color audit for the pattern to search for in the target too).

Do not jump straight to screens. Screens inherit correctness from AppShell + shared controls; retheming screens first just means redoing the work once the shared layer changes.

## Step 4 — Do not change business logic

Concretely, this means: don't touch Redux/Zustand/Context state shapes, don't touch API call signatures or response parsing, don't touch route guards or permission-check logic (`RoleUtils`/`checkPermissionList`-equivalent in the target), don't touch form validation *rules* (only their visual error presentation), don't rename props that are read by logic (only ones that are purely presentational, and only with a clear commit message noting the rename).

## Step 5 — Don't paint every component brand-green

Concrete check before styling any component: "does this element represent the primary CTA/brand action, or does it represent a status (success/info/warning/danger) or a neutral UI chrome element (border, disabled text, table header)?" Only the first category gets `brand.primary`. A save button = brand. A "delivered" badge = success (which in EVG's source is the *same* value as brand — that's a source gap, not a rule to imitate if the target has a real distinct success color available).

## Step 6 — Use status colors by meaning, not decoration

- success: completed, active/online, approved, healthy.
- info: informational, in-progress, neutral processing state.
- warning: needs attention, expiring soon, pending action.
- danger: error, destructive action, rejected, critical/offline.
- neutral (gray scale): all body text, all default borders, disabled states, table chrome — never load-bearing for meaning.

If a target component currently uses a status color decoratively (e.g., a random badge colored red with no error meaning), migrating it to the EVG palette is the right moment to fix that — flag it in your change notes rather than quietly perpetuating decorative misuse.

## Step 7 — Verify Light/Dark, responsive, and portal overlays

- **Dark mode**: EVG has none. If the target has dark mode, run your full checklist in both modes on the target's existing dark palette — do not source dark values from this handoff.
- **Responsive**: check your changes at 375px, 768px, 1440px, 1920px — this handoff's own `theme-lab/index.html` demonstrates the expected breakpoints for the EVG components; use it as a visual reference, not as literal markup to paste into the target (the target's DOM structure will differ).
- **Portal overlays**: any dropdown/modal/tooltip/date-picker in the target that renders into `document.body` (portals) needs *global, unscoped* CSS selectors for its theme — scoped/CSS-module selectors silently fail to reach portaled content. `component-contracts.md`'s "Select / Dropdown / Date picker" section documents exactly this failure mode for antd's `DatePicker` in EVG source (it's currently unthemed because no global override was ever written) — don't repeat that gap in the target if the target also uses a portal-based library.

## Step 8 — Report coverage per route/component, not just "done"

At the end of a migration pass, produce a table: route or component name → migrated / partially migrated / not started → any deliberate gaps preserved (per Step "ground rules" #3) → any WCAG AA concerns spotted. Do not report "theme migrated" as a single boolean — the EVG source itself is inconsistent across ~50+ routes and 15+ shared components; the target's migration status should be tracked at the same granularity so nothing is silently skipped.
