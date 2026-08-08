# Web Theme Exceptions

| Artifact | Reason | Approval status |
| --- | --- | --- |
| `docs/*.html` | Standalone generated documentation, not loaded by `app.html` or `login.html`; it owns an independent documentation palette. | Documented exception |
| External Leaflet map tiles | Third-party raster tiles cannot inherit application CSS variables. Hadiwa controls markers, overlays, popups and controls only. | Documented exception |
| Domain/scientific chart series | Rainfall, water level, hydrology and heat-map series intentionally remain multi-color so distinct measurements and alert thresholds are not collapsed into the brand color. | Documented exception |
| Hadiwa logo and mascot artwork | Brand artwork keeps authored SVG colors; surrounding controls and surfaces are themed. | Documented exception |

There are no route-level application exceptions.
