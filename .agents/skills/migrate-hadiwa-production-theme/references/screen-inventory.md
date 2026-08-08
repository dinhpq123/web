# Screen And State Inventory

## Contents

1. Inventory rule
2. Public and shell surfaces
3. Current Hadiwa module minimum
4. Shared overlays and states
5. Coverage table

## 1. Inventory Rule

This list is the minimum inherited from the approved prototype. Production is authoritative. Discover additional routes from router configuration, menu definitions, lazy imports, RBAC tables, direct links, settings tabs, modal registries, and legacy fallbacks.

Never delete an inventory row because the current role cannot see it. Obtain an appropriate safe test role or mark it blocked.

## 2. Public And Shell Surfaces

- Login credential form
- Login quick-account selector
- Invalid credentials and loading state
- Forgot-password steps and success
- 2FA method selector
- OTP input, expiry, resend, error and success
- Module launcher: accessible, hover, selected, locked
- Application sidebar: expanded and collapsed
- Header: status, notifications, weather, clock, profile, appearance, fullscreen, logout
- Filter bar, LIVE ticker, breadcrumbs, page actions
- Chatbot collapsed button and expanded panel
- 404/403/500, loading, empty, offline and reconnect states when present

## 3. Current Hadiwa Module Minimum

### Core

- `dashboard` - Dashboard PCTT
- `dieuhanh` - Điều hành & Phê duyệt
- `videowall` - Video Wall
- `gis` - Bản đồ GIS Thủy lợi
- `camera` - Camera CCTV

### PH2: CSDL Thủy lợi & Đê điều

- `irrigationAssets` - Công trình Thủy lợi
- `irrigationDataEntry` - Nhập liệu Vận hành Thủy lợi
- `hydrologicalData` - Quan trắc & Thủy văn
- `dikeManagement` - Quản lý Đê điều
- `dikeInspection` - Phân loại Đê
- `dikePermit` - Cấp phép & Vi phạm
- `reservoirMonitor` - Giám sát Hồ chứa

### PH3: Chỉ đạo PCTT

- `pcttDocuments` and `documentManagement` - Văn bản & Quyết định PCTT
- `fourOnSite` - Quản lý 4 Tại chỗ
- `pcttCommand` - Kịch bản Chỉ đạo
- `pcttOperations` - Trung tâm Điều hành
- `pcttFund` - Quỹ PCTT
- `pcttDamageReport` - Báo cáo Thiệt hại
- `communeReporting` - Cổng Báo cáo cấp Xã
- `communityReports` - Phản ánh Cộng đồng

### PH4: IoT, cảnh báo và liên lạc

- `iotMonitor` - Giám sát IoT
- `earlyWarning` - Cảnh báo sớm
- `weatherBulletin` - Bản tin Cảnh báo
- `commsDevices` - Hệ thống Liên lạc & Loa
- `scheduler` - Lịch vận hành Cống/Bơm

### PH5-6: Báo cáo và truyền thông

- `reports` - Báo cáo & Thống kê
- report detail/export/print views found in production
- `pcttMedia` - Truyền thông PCTT

### AI and data

- `aiagent` - AI Agent / Nhân viên số
- `chatbot` - Trợ lý AI
- `datahub` - Data Hub

### PH7: Quản trị

- `workflows` - Workflow Builder, list and runner
- `hrm` - Nhân sự & Tổ chức
- `log` - Nhật ký thao tác
- `settings` - Cài đặt hệ thống
- Settings tabs: system, security, roles, dashboard, notifications, integrations, UI/appearance

### Legacy or production-only fallbacks

- `scada`
- `plants`
- incidents, business, call center, NRW, LIMS, production and other registered renderers found in production

## 4. Shared Overlays And States

For every applicable screen, test:

- default, hover, focus-visible, active, selected and disabled controls;
- open dropdown/select, tooltip, popover, user menu and notification panel;
- modal, confirm dialog, drawer and toast;
- table header, row hover, row selected, pagination, empty and loading;
- form placeholder, focus, invalid, disabled and read-only;
- chart tooltip, legend, axis, series and no-data;
- map popup, selected marker/polygon, layer control and offline layer;
- camera online/offline/REC, broken media and full-screen control appearance;
- status chips: normal, online, warning, danger, approved, rejected, pending;
- responsive sidebar and mobile overflow.

## 5. Coverage Table

Create and maintain this artifact during migration:

```markdown
| Route/Surface | Renderer | Roles | Light | Dark | Mobile | States | Notes |
|---|---|---|---|---|---|---|---|
| login | LoginPage | public | PASS | N/A dark-auth | PASS | error/loading/forgot/OTP | |
| dashboard | DashboardPage | ... | PASS | PASS | PASS | filters/charts/KPI | |
```

Allowed statuses: `TODO`, `IN PROGRESS`, `PASS`, `BLOCKED`. A route is `PASS` only after browser inspection, not merely because it inherits shared tokens.
