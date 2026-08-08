# Web Theme Component Inventory

Source of truth: shared selectors in `css/main.css`, layout markup in `app.html`, and render helpers under `js/`.

| Component group | Source | Hard-coded color audit | Portal | Theme status |
| --- | --- | --- | --- | --- |
| App canvas and content area | `css/main.css` | Semantic variables | No | completed |
| Sidebar, logo, groups, navigation states | `app.html`, `css/main.css`, `js/app.js` | Semantic navigation variables | No | completed |
| Header, user controls, clock, theme toggle | `app.html`, `css/main.css` | Semantic shell variables | No | completed |
| Cards and KPI cards | `css/main.css` | Semantic surface/status variables | No | completed |
| Buttons and icon buttons | `css/main.css` | Semantic action/status variables | No | completed |
| Inputs, selects, filters, search | `css/main.css`, `js/filterbar.js` | Semantic form variables | No | completed |
| Tables and pagination | `css/main.css`, page renderers | Semantic table/text variables | No | completed |
| Tabs, badges, chips and status dots | `css/main.css`, page renderers | Semantic brand/status/domain variables | No | completed |
| Modal, drawer, dropdown and popover | `css/main.css`, modal helpers | Semantic elevated/overlay variables | Yes, `document.body` | completed |
| Toast and notifications | `js/app.js`, `js/notification_helper.js` | Semantic surface/status variables | Yes, `document.body` | completed |
| Chart.js wrappers and palettes | `js/utils/chartColors.js`, page renderers | Runtime CSS variables | No | completed |
| Leaflet maps, markers, popups and tooltips | `js/pages/gis.js`, `js/pages/scada.js`, `js/pages/plants.js` | Semantic status and data-viz colors | Leaflet panes | completed |
| AI/chatbot surfaces | `app.html`, `js/pages/chatbot.js`, `js/pages/aiagent.js` | Semantic surfaces; purple kept as functional AI accent | Yes | completed |
| Loading, empty and error states | `css/main.css`, page renderers | Semantic text/status variables | No | completed |
| Scrollbars, focus, hover, selected, disabled | `css/main.css` | Semantic interaction variables | No | completed |

Legacy names such as `--cyan`, `--green`, `--red`, and `--muted` remain compatibility aliases for existing render templates. New styling uses role-based tokens.
