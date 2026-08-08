---
name: hadiwa-evg-theme-migration-v2
description: Migration toàn bộ Color Design System của Hadiwa IOC sang EVG Emerald theo semantic tokens, Light-first, tách brand/status/text colors, xử lý CSS/JS/inline/chart/GIS/SVG và loại bỏ màu Hadiwa legacy sau khi demo-stabilization đã PASS.
---

# HADIWA → EVG THEME MIGRATION V2

## 0. PRECONDITION

Skill này CHỈ chạy sau khi:

```text
hadiwa-demo-stabilization
```

đã xử lý xong các blocker P0.

Không dùng skill này để chữa:
- chart conversion bug;
- RBAC;
- navigation spinner;
- OTP;
- lỗi business logic.

Nếu phát hiện blocker P0 chưa được xử lý:
- báo rõ;
- chỉ sửa technical theme/rendering issue nếu trực tiếp cản migration;
- không trộn toàn bộ stabilization vào scope này.

---

# 1. MỤC TIÊU

Chuyển toàn bộ visual color system của Hadiwa IOC từ:
```text
Cyan / Blue Neon / Dark IOC
```

sang:
```text
EVG Emerald / Enterprise / Clean / Light-first
```

Nhưng không được biến tất cả UI thành màu xanh.

Phải phân biệt:
```text
Brand
Success
Information
Warning
Danger
PCTT Alert Levels
AI Accent
Neutral
Disabled
```

---

# 2. CANONICAL TOKEN POLICY

Chỉ có một hệ semantic token chính.

Code mới PHẢI ưu tiên:
```text
--primary
--success
--info
--warning
--danger

--*-text
--*-soft

--bg-*
--text-*
--border-*
```

KHÔNG tạo namespace song song:
```text
--evg-primary
--evg-info
...
```

KHÔNG viết code mới dựa vào:
```text
--cyan
--blue
--green
--yellow
--red
```

Legacy aliases chỉ được tồn tại tạm thời để migration không làm vỡ UI.

---

# 3. LIGHT MODE LÀ DEFAULT

Canonical behavior:

```text
body không class → LIGHT
body.light       → LIGHT
body.dark        → DARK
```

Không dùng:
```css
body:not(.light)
```

cho dark mode.

---

# 4. LIGHT TOKEN MATRIX

```css
:root,
body.light {
  /* =========================================
     BRAND
     ========================================= */

  --primary: #30BD6F;
  --primary-hover: #20B970;
  --primary-active: #1BA05C;
  --primary-soft: #E8F8F0;
  --primary-text: #126B3A;

  --accent-soft: #BDFF9F;

  /* =========================================
     SEMANTIC STATUS
     ========================================= */

  --success: #34C759;
  --success-soft: #EAF8EE;
  --success-text: #137333;

  --info: #2984EE;
  --info-soft: #ECF8FF;
  --info-text: #0B5CAD;

  --warning: #F6C000;
  --warning-soft: #FFF8DD;
  --warning-text: #7A5C00;

  --danger: #E14E54;
  --danger-soft: #FFF5F8;
  --danger-text: #B4232A;

  /* =========================================
     PCTT DOMAIN ALERT LEVELS
     ========================================= */

  --alert-bd1: #F6C000;
  --alert-bd2: #F28C28;
  --alert-bd3: #E14E54;
  --alert-critical: #B4232A;

  /* =========================================
     BACKGROUND
     ========================================= */

  --bg-app: #F6F8F5;
  --bg-base: var(--bg-app);

  --bg-surface: #FFFFFF;
  --bg-card: #FFFFFF;
  --bg-elevated: #FFFFFF;

  --bg-secondary: #EEF1FA;
  --bg-tertiary: #F9F9F9;

  --bg-hover: #F3F6F9;
  --bg-selected: #E8F8F0;

  --bg-header: #FFFFFF;
  --bg-sidebar: #FFFFFF;

  --glass: rgba(255,255,255,.92);

  /* =========================================
     TEXT
     ========================================= */

  --text-primary: #18183E;
  --text: var(--text-primary);

  --text-secondary: #494968;
  --text-2: var(--text-secondary);

  --text-muted: #5F6678;
  --muted: var(--text-muted);

  --text-subtle: #6B7280;
  --label: var(--text-subtle);

  --text-disabled: #9CA2B8;
  --text-on-primary: #FFFFFF;

  /* =========================================
     BORDER
     ========================================= */

  --border: #DBDFF1;
  --border-light: #E4E6EF;
  --border-active: #30BD6F;
  --border-focus: #30BD6F;

  /* =========================================
     SHADOW / FOCUS
     ========================================= */

  --shadow-card:
    0 2px 12px rgba(24,24,62,.06);

  --shadow-dropdown:
    0 8px 30px rgba(24,24,62,.10);

  --focus-ring:
    0 0 0 3px rgba(48,189,111,.16);

  /* =========================================
     TEMPORARY LEGACY COMPATIBILITY
     DO NOT USE IN NEW CODE
     ========================================= */

  --cyan: var(--primary);
  --blue: var(--info);
  --green: var(--success);
  --yellow: var(--warning);
  --red: var(--danger);

  --secondary: var(--info);
}
```

---

# 5. DARK TOKEN MATRIX

Dark mode chỉ chạy khi có `body.dark`.

```css
body.dark {
  --primary: #30BD6F;
  --primary-hover: #27C06C;
  --primary-active: #20A961;
  --primary-soft: rgba(48,189,111,.14);
  --primary-text: #7EE2A8;

  --accent-soft: rgba(189,255,159,.15);

  --success: #34C759;
  --success-soft: rgba(52,199,89,.14);
  --success-text: #80E39A;

  --info: #3699FF;
  --info-soft: rgba(54,153,255,.14);
  --info-text: #8CC5FF;

  --warning: #F6C000;
  --warning-soft: rgba(246,192,0,.14);
  --warning-text: #FFE27A;

  --danger: #E14E54;
  --danger-soft: rgba(225,78,84,.14);
  --danger-text: #FF9AA0;

  --alert-bd1: #F6C000;
  --alert-bd2: #F28C28;
  --alert-bd3: #E14E54;
  --alert-critical: #FF6B73;

  --bg-app: #0E1A14;
  --bg-base: var(--bg-app);

  --bg-surface: #13251B;
  --bg-card: #15291F;
  --bg-elevated: #182D22;

  --bg-secondary: #1A3025;
  --bg-tertiary: #20382C;

  --bg-hover: rgba(48,189,111,.08);
  --bg-selected: rgba(48,189,111,.14);

  --bg-header: #13251B;
  --bg-sidebar: #13251B;

  --glass: rgba(19,37,27,.92);

  --text-primary: #F4FBF7;
  --text: var(--text-primary);

  --text-secondary: #CFDED5;
  --text-2: var(--text-secondary);

  --text-muted: #A7B9AE;
  --muted: var(--text-muted);

  --text-subtle: #90A398;
  --label: var(--text-subtle);

  --text-disabled: #687B70;
  --text-on-primary: #FFFFFF;

  --border: rgba(167,185,174,.20);
  --border-light: rgba(167,185,174,.12);
  --border-active: #30BD6F;
  --border-focus: #30BD6F;

  --shadow-card:
    0 3px 14px rgba(0,0,0,.18);

  --shadow-dropdown:
    0 12px 40px rgba(0,0,0,.28);

  --focus-ring:
    0 0 0 3px rgba(48,189,111,.20);

  --cyan: var(--primary);
  --blue: var(--info);
  --green: var(--success);
  --yellow: var(--warning);
  --red: var(--danger);

  --secondary: var(--info);
}
```

---

# 6. BRAND ≠ SUCCESS

Không map:
```text
primary == success
```

Canonical:
```text
Brand Primary = #30BD6F
Success       = #34C759
```

Hai semantic này phải giữ quan hệ nhất quán ở Light và Dark.

Ngoài màu sắc, status quan trọng phải có:
- label;
- icon;
- text;
- context.

Không chỉ dựa vào màu.

---

# 7. VISUAL COLOR ≠ TEXT COLOR

Không dùng trực tiếp mọi brand/status color làm text trên nền trắng.

Dùng:

```text
--primary-text
--success-text
--info-text
--warning-text
--danger-text
```

Ví dụ:

```css
.status-success {
  color: var(--success-text);
  background: var(--success-soft);
}
```

Không mặc định:

```css
.status-success {
  color: var(--success);
}
```

nếu contrast không đạt.

---

# 8. MUTED ≠ DISABLED

Không dùng cùng một token cho:
```text
muted text
disabled text
decorative gray
```

Canonical:
```text
--text-muted
--text-subtle
--text-disabled
```

`#9CA2B8` được phép dùng cho disabled/decorative, không mặc định dùng cho normal secondary text.

---

# 9. PCTT ALERT COLORS

Không ép toàn bộ cảnh báo vào `--danger`.

Dùng domain tokens:

```text
--alert-bd1
--alert-bd2
--alert-bd3
--alert-critical
```

Mọi màn liên quan:
- thủy văn;
- đê điều;
- hồ chứa;
- sự cố;
- cảnh báo;
- GIS;
- ticker LIVE;

phải map theo cấp báo động nghiệp vụ thật.

Không sử dụng một màu đỏ cho hai meaning không liên quan.

---

# 10. LEGACY COLOR MIGRATION

Audit toàn bộ:

```text
*.css
*.scss
*.sass
*.less
*.html
*.js
*.jsx
*.ts
*.tsx
*.vue
*.svg
```

Search:
```regex
#[0-9a-fA-F]{3,8}
```

và:
```regex
rgba?\([^)]+\)
```

Phân loại từng occurrence:
```text
brand
success
info
warning
danger
PCTT alert level
AI
chart
scientific visualization
neutral
disabled
```

Không search/replace mù quáng.

---

# 11. PRIORITY FILES

Ưu tiên audit các file có lượng hardcode lớn:

```text
js/app.js
js/hrm.js
js/pcttMedia.js
js/lims.js
js/datahub.js
```

Sau đó mới mở rộng toàn repo.

---

# 12. INLINE STYLE

Mục tiêu:
- loại bỏ hard-coded colors khỏi inline style;
- dùng class hoặc CSS variable.

Sai:
```html
<div style="color:#00d2ff">
```

Đúng:
```html
<div class="text-primary">
```

hoặc tối thiểu:
```html
<div style="color:var(--primary)">
```

Ưu tiên class.

---

# 13. JS GENERATED STYLE

Search các đoạn:
```js
style="..."
element.style.color = ...
element.style.background = ...
setAttribute('style', ...)
```

Nếu màu được generate từ JS:
- dùng semantic constant;
- hoặc đọc CSS variable;
- tránh hard-code rải rác.

---

# 14. CHART PALETTE

Chart bug P0 phải được sửa từ stabilization trước.

Theme migration chỉ thay palette semantic.

Canonical:

```js
const CHART_COLORS = {
  primary: '#30BD6F',
  success: '#34C759',
  info: '#2984EE',
  warning: '#F6C000',
  danger: '#E14E54',
  ai: '#7C3AED'
};
```

Nếu có helper lấy CSS variable thì ưu tiên:

```js
const css = getComputedStyle(document.documentElement);
const primary = css.getPropertyValue('--primary').trim();
```

Không tự tạo thêm palette Cyan legacy.

---

# 15. GIS / MAP

Map phải được audit độc lập.

```text
Normal        → success
Warning       → warning / alert-bd1
Alarm         → alert-bd3 / danger
Critical      → alert-critical
Selected      → primary
Offline       → neutral/disabled
```

Selected polygon/pin:
```text
stroke = primary
fill   = primary soft alpha
```

Không để selected state Cyan Hadiwa.

---

# 16. SCADA / IOT

```text
Running     → success
Stopped     → neutral
Fault       → danger
Realtime    → primary
Information → info
```

Không dùng green brand cho mọi thiết bị đang active nếu semantic là success.

---

# 17. WEATHER / HYDROLOGY

Scientific/data visualization colors được phép giữ multi-color.

Không ép:
```text
temperature
rainfall
heatmap
water level scales
```

về EVG Green.

Nhưng navigation, selected state và control vẫn dùng brand token.

---

# 18. INCIDENT / ALERT

Ví dụ:

```css
.alert-critical {
  color: var(--danger-text);
  background: var(--danger-soft);
}

.alert-warning {
  color: var(--warning-text);
  background: var(--warning-soft);
}

.alert-resolved {
  color: var(--success-text);
  background: var(--success-soft);
}
```

Nếu nghiệp vụ có BD1/BD2/BD3 thì dùng domain token thay vì generic warning/danger.

---

# 19. AI AGENT

AI identity có thể giữ:
```text
#7C3AED
```

như functional accent.

Không biến toàn bộ AI Purple thành Green.

Brand interaction:
```text
primary
```

AI-specific identity:
```text
purple
```

---

# 20. LOGIN

Light default:

```text
Page BG     → bg-app
Card        → bg-surface
Input       → white / bg-tertiary
Focus       → primary
Submit      → primary
Error       → danger
```

Không còn Cyan/Blue neon gradient làm brand chính.

---

# 21. SIDEBAR / HEADER

Light:

```text
Sidebar BG      → #FFFFFF
Header BG       → #FFFFFF
Active BG       → primary-soft
Active Text     → primary-text hoặc primary nếu contrast/context cho phép
Default Text    → text-secondary
Muted Icon      → neutral
Border          → border
```

Dark:
dùng token dark tương ứng.

---

# 22. BUTTON SYSTEM

Primary:
```css
background: var(--primary);
color: var(--text-on-primary);
```

Hover:
```css
background: var(--primary-hover);
```

Danger:
```css
background: var(--danger);
```

Không đổi Delete thành Green.

Disabled:
```css
background: var(--bg-secondary);
color: var(--text-disabled);
```

---

# 23. FORM SYSTEM

Input:
```text
background       → bg-surface
border           → border
text             → text-primary
placeholder      → text-muted/subtle
focus border     → border-focus
focus ring       → focus-ring
invalid          → danger
disabled text    → text-disabled
```

---

# 24. TABLE

```text
Header       → bg-secondary
Text         → text-secondary
Row          → bg-surface
Hover        → bg-hover
Selected     → bg-selected
Selected UI  → primary
Divider      → border
```

Numeric columns phải giữ alignment hiện tại; không refactor DataTable trong skill này.

---

# 25. SVG

Search:
```text
fill=
stroke=
```

Nếu SVG có thể inherit:
```html
fill="currentColor"
```

Sau đó control bằng CSS.

Không hard-code brand Cyan cũ trong SVG.

---

# 26. GRADIENT / GLOW

Loại bỏ Neon Cyan-heavy.

Primary gradient nếu thực sự cần:

```css
linear-gradient(
  135deg,
  #30BD6F,
  #20B970
)
```

Không lạm dụng.

Focus nên ưu tiên ring nhẹ:

```css
box-shadow: var(--focus-ring);
```

EVG direction:
```text
clean
enterprise
low-noise shadow
green-energy
```

---

# 27. ACCESSIBILITY CONTRAST

Mọi normal text phải được kiểm tra contrast trên background thực tế.

Không giả định:
```text
"màu EVG gốc" = đủ contrast cho text
```

Đặc biệt kiểm:
```text
primary
success
info
warning
danger
muted
secondary
```

Khi màu UI không đạt cho text:
- dùng `*-text`;
- không tự ý đổi brand base token.

Mục tiêu:
```text
0 lỗi WCAG AA đối với normal text thuộc phạm vi migration
```

---

# 28. PRIMARY/INFO/SUCCESS CONSISTENCY

Không để:

```text
Light:
primary == success

Dark:
primary != success
```

Không để:
```text
secondary và info là hai nguồn độc lập cùng value
```

Canonical:
```text
--info
```

Legacy:
```text
--secondary: var(--info)
```

---

# 29. ACCENT POLICY

`--accent-soft: #BDFF9F`

chỉ dùng nếu có use case rõ:
- decorative energy highlight;
- soft illustration;
- non-text accent.

Không dùng cho:
- normal text;
- warning;
- success;
- alert levels.

Nếu không có consumer thật, được phép bỏ khỏi runtime tokens.

---

# 30. THEME PRESETS

Default:
```text
evg-emerald
```

Preset metadata có thể chứa:
```text
primary
info/secondary
accent
lightBg
darkBg
```

Nhưng runtime UI phải resolve về semantic tokens.

Không để mỗi component đọc trực tiếp raw preset color nếu semantic token đã có.

---

# 31. THEME + APPEARANCE

Tách riêng:

```text
Brand Theme:
evg-emerald

Appearance:
light | dark
```

Persistence đề xuất:

```js
const STORAGE_KEYS = {
  brandTheme: 'hadiwa_brand_theme',
  appearance: 'hadiwa_appearance'
};
```

Default:
```text
brandTheme = evg-emerald
appearance = light
```

---

# 32. LEGACY ALIAS LIFECYCLE

Temporary block:

```css
--cyan: var(--primary);
--blue: var(--info);
--green: var(--success);
--yellow: var(--warning);
--red: var(--danger);
--secondary: var(--info);
```

Quy tắc:
1. không dùng trong code mới;
2. codemod component cũ sang semantic token;
3. search usage;
4. khi usage ngoài compatibility block = 0;
5. xóa compatibility aliases.

---

# 33. COLOR RESIDUE AUDIT

Search toàn project:

```text
#00d2ff
#00D2FF
#00f2ff
#00F2FF
#0066ff
#0066FF
#00f080
#00F080
#9d70ff
#9D70FF

rgba(0,210,255
rgba(0, 210, 255
rgba(0,242,255
rgba(0, 242, 255
```

Mọi occurrence còn lại phải được giải thích.

Chỉ cho phép nếu:
- nằm trong preset historical/optional có chủ đích;
- visualization khoa học cần màu đó;
- AI accent được xác nhận.

Không cho phép accidental residue.

---

# 34. COMPONENT CHECKLIST

Audit:
- Login
- Header
- Sidebar
- Hub
- Dashboard
- KPI
- Charts
- GIS
- SCADA
- IoT
- Weather
- Hydrology
- Incidents
- Alerts
- AI Agent
- Chatbot
- HRM
- Business
- Reports
- Data Hub
- Camera
- Videowall
- Table
- Form
- Button
- Modal
- Drawer
- Popover
- Dropdown
- Tooltip
- Checkbox
- Radio
- Toggle
- Tabs
- Pagination
- Toast
- Loading
- Empty state
- SVG
- Scrollbar
- Hover
- Focus
- Active
- Selected
- Disabled

---

# 35. KHÔNG ĐƯỢC LÀM

Trong skill này không:
- sửa RBAC;
- xây DataTable framework;
- refactor responsive toàn app;
- triển khai i18n;
- thay API;
- thay business workflow;
- thay layout lớn;
- cleanup toàn repo không liên quan màu;
- search/replace HEX một cách mù quáng.

---

# 36. EXECUTION ORDER

## Phase 1 — Audit
- token;
- hardcode;
- inline;
- JS dynamic styles;
- chart;
- map;
- SVG;
- gradient;
- shadow.

## Phase 2 — Foundation
- Light canonical tokens;
- Dark explicit tokens;
- brand/status split;
- accessible text tokens;
- PCTT alert tokens.

## Phase 3 — Global UI
- body;
- header;
- sidebar;
- navigation;
- card;
- form;
- button;
- table;
- modal.

## Phase 4 — Modules
- Dashboard;
- GIS;
- SCADA;
- IoT;
- Weather;
- Hydrology;
- Incidents;
- AI;
- HRM;
- Reports;
- Camera.

## Phase 5 — JS/Visualization
- dynamic HTML;
- Chart.js/ApexCharts/ECharts;
- Leaflet/Map;
- SVG;
- Canvas.

## Phase 6 — Light/Dark Validation
- contrast;
- hover;
- focus;
- selected;
- disabled;
- first load;
- reload.

## Phase 7 — Legacy Removal
- old token usage → 0;
- old colors audited;
- compatibility aliases removed when safe.

---

# 37. ACCEPTANCE CRITERIA

- [ ] Default no-class state là Light.
- [ ] Dark chỉ chạy với `body.dark`.
- [ ] Không có `--evg-*` namespace runtime song song.
- [ ] Primary khác Success.
- [ ] Primary/Success relationship nhất quán ở Light và Dark.
- [ ] `secondary` không còn là canonical duplicate của `info`.
- [ ] Muted khác Disabled.
- [ ] Semantic UI color và semantic text color được tách.
- [ ] Light Mode text thuộc phạm vi migration đạt AA.
- [ ] Primary CTA dùng EVG brand.
- [ ] Success/Info/Warning/Danger giữ đúng nghĩa.
- [ ] PCTT alert levels có semantic riêng.
- [ ] Charts không còn palette Cyan-heavy accidental.
- [ ] GIS selected state không còn Cyan Hadiwa.
- [ ] Inline hardcoded colors giảm về mức chỉ còn justified exceptions.
- [ ] Legacy color residue được giải thích hoặc loại bỏ.
- [ ] Không thay business logic ngoài technical theme rendering.
- [ ] Brand theme và appearance persistence tách riêng.
- [ ] Refresh giữ đúng brand + appearance.

---

# 38. OUTPUT REPORT

```markdown
# Hadiwa EVG Theme Migration V2 Report

## Preconditions
- Demo stabilization: PASS / FAIL

## Files Changed
- ...

## Canonical Tokens
- ...

## Legacy Tokens Remaining
- ...

## Hardcoded Colors Replaced
- ...

## Accessible Text Tokens
- ...

## PCTT Alert Mapping
- ...

## Charts
- PASS / FAIL

## GIS
- PASS / FAIL

## Light Mode
- PASS / FAIL

## Dark Mode
- PASS / FAIL

## Contrast
- PASS / FAIL

## Theme Persistence
- PASS / FAIL

## Old Hadiwa Color Residue
- None
or
- file:line — reason

## Final Result
- PASS / NEEDS REVIEW
```

---

# 39. FINAL RULE

Không thực hiện migration theo kiểu:

```text
#00D2FF → #30BD6F
```

một cách máy móc.

Luôn map theo semantic:

```text
Brand         → Primary
Normal state  → Success
Information   → Info
Warning       → Warning
Danger        → Danger
PCTT level    → BD1/BD2/BD3/Critical
AI identity   → Purple
Disabled      → Neutral
Text          → Accessible text token
```

Mục tiêu cuối:

```text
ONE CANONICAL COLOR SYSTEM
ZERO ACCIDENTAL HADIWA COLOR RESIDUE
LIGHT-FIRST
ACCESSIBLE TEXT
STABLE LIGHT/DARK SEMANTICS
```
