# Approved Prototype Acceptance Ledger

## Contents

1. Purpose
2. Global shell
3. Color discipline
4. Login and launcher
5. Dashboard
6. Operational screens
7. Icons and states
8. Rejected outcomes

## 1. Purpose

Use this ledger as a regression checklist. These problems were found and rejected while stabilizing the HTML prototype. Production must not reintroduce them.

The approved prototype implementation is typically represented by:

```text
theme engine/provider
global semantic stylesheet
application shell/sidebar/header
login and 2FA
module launcher
dashboard renderer and chart palette helper
route-specific renderers for GIS, Camera, Video Wall, PCTT and IoT
```

Find production equivalents by ownership and behavior. Do not assume identical filenames.

## 2. Global Shell

- The approved default sidebar uses the compatible teal `#0F5B55 -> #123D42` vertical gradient. The exact source `#1E3883 -> #192B54` gradient remains available only in the `evg-classic-navy` backup preset.
- Active navigation uses the separate `#3371C6 -> #285CAA` gradient.
- Default section labels are soft green `#8BE7B5`; the backup preset retains source cyan `#1EF5DF`. Normal sidebar text is cool white in both presets.
- Header and ticker use approved light/dark surfaces, not purple or near-black substitutes.
- Hamburger/collapse control sits inside the sidebar logo row.
- Logo opens the module launcher; no faint “click logo” instruction strip wastes space below it.
- Workspace, header, ticker, filter bar, cards and elevated surfaces remain visually distinct.
- Appearance persistence survives reload without a flash of the wrong theme.

## 3. Color Discipline

- Generic active/selected/highlight state is blue, never green.
- Generic dark surfaces are navy/blue, never purple-tinted.
- Missing surfaces do not fall back to dirty gray or black blocks.
- KPI cards do not receive arbitrary red/green/purple/yellow decorative top borders.
- Green appears only for true online/healthy status, approved IoT category identity, or approved HR role identity.
- Purple appears only for command/AI/leadership identity where explicitly mapped.
- Warning, danger and PCTT alert colors correspond to real data meaning.
- Scientific charts and map layers may remain multi-color; surrounding UI remains semantic.

## 4. Login And Launcher

Login:

- Keeps a coherent dark auth surface with readable muted text.
- Inputs, checkbox, links, focus and submit action use primary blue.
- TLS status dot uses online green.
- Quick-account icons are not white/default and badges are not all blue.
- Each quick account uses the exact role color for icon, badge, border and selected tint.
- Forgot password and all OTP steps receive the same token coverage.

Launcher:

- Seven module icons are not collapsed to one default blue.
- Each category uses its exact approved identity color for icon, label and border.
- Hover uses the same category color with a restrained tint/glow.
- Category colors remain scoped to the launcher and do not leak into dashboards.
- Locked modules remain muted and visually distinct from enabled modules.

## 5. Dashboard

- Page order remains deliberate: page header/actions, filter bar, ticker, KPI grid, charts, supporting panels.
- Random decorative highlights are removed; severity colors remain only where data requires them.
- KPI icons use recognizable glyphs and semantic color wrappers.
- KPI supporting text is readable and professionally phrased.
- Sparklines occupy fixed, aligned regions and never overlap values or supporting text.
- Sparklines use restrained primary/data colors rather than one arbitrary color per card.
- Chart legends do not create a large empty band inside the canvas.
- Crowded legends move to a compact external row aligned with the chart.
- Charts are nonblank in both modes; axes, grid, tooltip and labels remain readable.
- Dashboard resets to the top when navigated to and does not inherit stale scroll position.
- Desktop, compact desktop and mobile layouts do not clip long Vietnamese labels.

## 6. Operational Screens

### Điều hành & Phê duyệt

- Notes, attachments, AI extraction areas and empty previews use themed surfaces, not gray slabs.
- Approve/reject actions retain semantic meaning without turning the whole card green/red.
- AI confidence and status accents remain readable and restrained.

### Video Wall

- Scenario selection uses primary selected styling; “Thủy văn & Hồ chứa” is not green by accident.
- Tile headers use approved navy surfaces, not black strips with invisible text.
- KPI tiles inside Video Wall preserve readable data colors without rainbow decoration.
- Broken media placeholders and camera tiles use themed chrome.

### Camera CCTV

- The large top workspace area has the correct workspace surface instead of an unexplained dark rectangle.
- Filters, view modes, pagination, REC, online/offline and camera cards retain semantic states.
- Images remain natural; theme only the surrounding chrome.

### Cảnh báo sớm / IoT / thủy văn / hồ chứa

- Light mode does not render white text on white cards.
- Dark mode does not become a one-note blue sheet without hierarchy.
- Warning and critical rows use real severity colors; normal rows remain neutral.
- Green is not used as a generic active tab or action.

### GIS

- Selected markers/polygons use primary blue.
- Risk and alert layers keep domain colors.
- Popup, layer control and legend are themed independently.

### Tables, reports, permits and administration

- Header, body, hover, selected row, pagination, badges and actions all use tokens.
- No black/gray fallback blocks appear in empty or generated sections.
- Tabs and primary actions use blue; success green appears only after successful state.

## 7. Icons And States

- Generic icons inherit `currentColor` and default to primary/neutral according to function.
- Icon wrappers are not all identical blue boxes when semantic meaning differs.
- Conversely, decorative icons do not form an arbitrary rainbow.
- Online status dots in login and header use `--status-online`.
- Alert, warning, approved and rejected icons use their semantic tokens.
- Hover cannot override an approved launcher/role identity color with generic primary.
- SVG child `stroke`/`fill`, pseudo-elements and icon fonts are inspected, not just the parent `color`.
- Every control has default, hover, focus-visible, active, selected and disabled coverage.

## 8. Rejected Outcomes

Reject the migration if any screenshot shows:

```text
purple generic surfaces
green generic highlights
unexplained gray/black blocks
all launcher icons blue
all login quick-account icons default-colored
rainbow decorative KPI borders
blank or black charts
invisible light-mode text
black Video Wall headers
misaligned KPI sparklines
oversized chart legend whitespace
sidebar control outside the logo row
overlapping text, icons or dynamic values
```

Do not patch a rejected outcome with another hardcoded literal. Trace it back to token ownership, selector specificity, generated markup, visualization configuration, or missing state coverage.
