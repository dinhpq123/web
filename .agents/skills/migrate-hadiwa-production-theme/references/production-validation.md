# Production Validation Gates

## Contents

1. Static gates
2. Browser matrix
3. Visual checks
4. Contrast and semantics
5. Regression boundary
6. Completion evidence

## 1. Static Gates

Run the repository's established commands:

```text
build
lint
typecheck
focused tests
```

Run:

```bash
scripts/audit-theme-coverage.sh <repo-root>
```

Review every remaining literal. Literals are acceptable only for:

- canonical seed definitions;
- approved launcher/role identity values;
- PCTT domain thresholds;
- chart/map scientific series;
- logos, media, or external library requirements;
- documented compatibility aliases scheduled for removal.

Fail if unexplained purple, green, gray/black panels, neon cyan, or old hardcoded theme colors remain in rendered UI.

## 2. Browser Matrix

At minimum validate:

```text
Desktop wide     1600x1000 or production standard
Desktop compact  1280x800
Tablet           768x1024
Mobile           390x844
```

For each route in the coverage table:

- light appearance;
- dark appearance;
- one normal role and every role that materially changes content;
- direct URL/reload where supported;
- navigation into and out of the screen.

Use a staging-safe account. Do not execute destructive production actions.

## 3. Visual Checks

Inspect screenshots and computed styles for:

- no invisible text or low-contrast secondary text;
- no purple tint in generic navy surfaces;
- no accidental green generic highlights;
- no dirty gray/black patches replacing themed surfaces;
- no decorative rainbow KPI/card accents;
- correct sidebar parent and active gradients;
- correct launcher and login identity colors, scoped locally;
- icons inherit intended colors and remain recognizable;
- no text/icon/button overlap;
- no clipped labels, badges, legends, menus, or dialogs;
- no layout shift caused by icons, loading text, or dynamic counts;
- charts and canvases are nonblank and correctly framed;
- map tiles, markers, popups and layer controls render;
- camera/media assets render or show a themed error state;
- sidebar collapsed/expanded and mobile navigation remain usable;
- focus-visible is clear on keyboard navigation.

For 3D/canvas/media, include pixel checks where automation supports them; a nonzero element size is not proof of visible rendering.

## 4. Contrast And Semantics

Target WCAG 2.1 AA:

```text
Normal text    >= 4.5:1
Large text     >= 3:1
UI boundaries >= 3:1 when required
```

Validate actual computed foreground/background pairs. Alpha colors must be composited against the real surface.

Confirm semantic meaning:

- primary = interaction/selection;
- online green = actual online/healthy;
- success = completed/approved;
- warning/danger = actual severity;
- PCTT level = domain threshold;
- purple = AI or approved identity only;
- neutral = nonsemantic structure.

## 5. Regression Boundary

Compare before/after behavior:

- same routes and redirects;
- same role visibility;
- same form values and validation;
- same data, calculations, sorting and pagination;
- same modal and action ownership;
- same fullscreen behavior;
- same theme/brand persistence after reload;
- no new console errors or failed requests caused by theme code.

Review the final diff for non-style changes. Any behavior change requires explicit user approval and separate testing.

## 6. Completion Evidence

Collect:

- route coverage table;
- changed token/component files;
- audit output summary and justified exceptions;
- build/lint/typecheck/test results;
- screenshot list by route, mode and viewport;
- blocked screens with exact reason;
- contrast failures and fixes;
- residual risks.

Do not report `PASS` with blocked or unvisited routes. Use `NEEDS REVIEW` and name the missing evidence.
