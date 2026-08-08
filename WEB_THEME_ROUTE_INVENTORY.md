# Web Theme Route Inventory

Source of truth: `js/app.js` (`MENUS`, `PAGE_RENDERS`) and script registry in `app.html`.
This prototype uses an in-page router (`navigate(pageId)`), so route patterns below are page IDs rather than URL paths.

| Route pattern | Source file | Module | Guard | Layout | Theme status |
| --- | --- | --- | --- | --- | --- |
| `login.html` | `login.html` | Authentication UI | Public | Auth | completed |
| `dashboard` | `js/pages/dashboard.js` | Dashboard PCTT | `dashboard` | App shell | completed |
| `dieuhanh` | `js/pages/dieuhanhPage.js` | Dieu hanh & Phe duyet | `pcttCommand` | App shell | completed |
| `videowall` | `js/pages/videowall.js` | Video Wall | `videowall` | App shell | completed |
| `gis` | `js/pages/gis.js` | GIS Thuy loi | `gis` | App shell | completed |
| `camera` | `js/pages/camera.js` | Camera CCTV | `camera` | App shell | completed |
| `irrigationAssets` | `js/pages/irrigationAssets.js` | Cong trinh Thuy loi | `irrigationAssets` | App shell | completed |
| `irrigationDataEntry` | `js/pages/irrigationDataEntry.js` | Nhap lieu van hanh | `irrigationAssets` | App shell | completed |
| `hydrologicalData` | `js/pages/hydrologicalData.js` | Quan trac Thuy van | `iotMonitor` | App shell | completed |
| `reservoirMonitor` | `js/pages/reservoirMonitor.js` | Giam sat Ho chua | Feature flag | App shell | completed |
| `dikeManagement` | `js/pages/dikeManagement.js` | Quan ly De dieu | `dikeManagement` | App shell | completed |
| `dikeInspection` | `js/pages/dikeInspection.js` | Phan loai De | `dikeManagement` | App shell | completed |
| `dikePermit` | `js/pages/dikePermit.js` | Cap phep & Vi pham | `dikePermit` | App shell | completed |
| `pcttDocuments` | `js/pages/pcttDocuments.js` | Van ban PCTT | `pcttDocuments` | App shell | completed |
| `fourOnSite` | `js/pages/fourOnSite.js` | Bon tai cho | `pcttCommand` | App shell | completed |
| `pcttCommand` | `js/pages/pcttCommand.js` | Kich ban chi dao | `pcttCommand` | App shell | completed |
| `pcttFund` | `js/pages/pcttFund.js` | Quy PCTT | `pcttFund` | App shell | completed |
| `pcttDamageReport` | `js/pages/pcttDamageReport.js` | Bao cao thiet hai | `pcttCommand` | App shell | completed |
| `communeReporting` | `js/pages/communeReporting.js` | Bao cao cap xa | `pcttCommand` | App shell | completed |
| `communityReports` | `js/pages/communityReports.js` | Phan anh cong dong | Feature flag | App shell | completed |
| `pcttOperations` | `js/pages/pcttOperations.js` | Trung tam dieu hanh | Feature flag | App shell | completed |
| `iotMonitor` | `js/pages/iotMonitor.js` | Giam sat IoT | `iotMonitor` | App shell | completed |
| `earlyWarning` | `js/pages/alerts.js` | Canh bao som | `earlyWarning` | App shell | completed |
| `weatherBulletin` | `js/pages/weatherBulletin.js` | Ban tin canh bao | `weatherBulletin` | App shell | completed |
| `commsDevices` | `js/pages/commsDevices.js` | Lien lac & Loa | Feature flag | App shell | completed |
| `scheduler` | `js/pages/scheduler.js` | Lich van hanh | `scheduler` | App shell | completed |
| `reports` | `js/pages/reports.js` | Bao cao & Thong ke | `reports` | App shell | completed |
| `pcttMedia` | `js/pages/pcttMedia.js` | Truyen thong PCTT | `pcttMedia` | App shell | completed |
| `aiagent` | `js/pages/aiagent.js` | AI Agent | `aiagent` | App shell | completed |
| `chatbot` | `js/pages/chatbot.js` | Tro ly AI | `chatbot` | App shell | completed |
| `datahub` | `js/pages/datahub.js` | Data Hub | `datahub` | App shell | completed |
| `workflows` | `js/pages/workflows.js` | Workflow Builder | `workflows` | App shell | completed |
| `hrm` | `js/pages/hrm.js` | Nhan su & To chuc | `hrm` | App shell | completed |
| `log` | `js/pages/log.js` | Nhat ky thao tac | `log` | App shell | completed |
| `settings` | `js/app.js` | Cai dat he thong | `settings` | App shell | completed |
| `scada` / `scadastations` / `scadalogs` | `js/pages/scada.js` | SCADA legacy/detail | Feature flag | App shell | completed |
| `plants` | `js/pages/plants.js` | Nha may legacy | Feature flag | App shell | completed |

All application routes inherit the canonical variables from `:root` and the explicit `body.dark` override. Dynamic modal/detail states inherit from `document.body`.
