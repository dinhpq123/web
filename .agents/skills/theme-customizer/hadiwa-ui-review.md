# Review UI — Hadiwa IOC (prototype tl-pctt)

**Phạm vi:** `https://store.iclever.vn/prototype/tl-pctt/hadiwa/` — 76 file, 2.619 dòng CSS, ~35.000 dòng JS, 7 phân hệ / ~50 trang.
**Đối chiếu:** design system của `evg-cms` (Keen/Metronic + Bootstrap 5, brand xanh lá `#30BD6F`, Inter 13px).
**Ngày review:** 07/08/2026

---

## 1. Đánh giá tổng quan

Prototype này **tốt hơn mặt bằng chung** của một bản demo: ngôn ngữ thị giác "trung tâm điều hành" rất nhất quán, phân cấp thông tin rõ, luồng đăng nhập 2FA chỉn chu, và phần lớn control dùng `<button>` thật (1.176 button vs chỉ 75 `div/span` gắn `onclick`) — nghĩa là nền tảng HTML không tệ.

Vấn đề không nằm ở gu thẩm mỹ, mà ở **ba chỗ**:

| | Vấn đề | Mức |
|---|---|---|
| A | Một số lỗi render/logic thấy được ngay trên màn hình chính | P0 |
| B | Không có design system thật — token bị bypass ở ~6.700 chỗ | P1 |
| C | Các trang quản trị dữ liệu thiếu chuẩn CMS (search/sort/filter/bulk) — đây chính là chỗ evg-cms đã giải xong | P1 |

---

## 2. P0 — Lỗi phải sửa trước khi demo

### 2.1. Biểu đồ "Mực nước các trạm" render sai màu (đen kịt)

`js/pages/dashboard.js:353` chuyển hex → rgba bằng một chuỗi `.replace()` chắp vá:

```js
backgroundColor: alertColors[i]
  .replace(')', ',.08)')      // hex không có ')' → không làm gì cả
  .replace('rgb', 'rgba')     // hex không có 'rgb' → không làm gì cả
  .replace('#', 'rgba(')
  .replace('rgba(00', 'rgba(0,0,')
  .replace(/rgba\(([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/, ...)
```

Kết quả thực tế của cả 6 màu — **không màu nào hợp lệ**:

```
#ff1744  ->  rgba(255,23,68      (thiếu alpha + thiếu dấu đóng ngoặc)
#00c8ff  ->  rgba(0,0,c8ff       (rác)
#ffca28  ->  rgba(255,202,40
#00e676  ->  rgba(0,0,e676       (rác)
#7c4dff  ->  rgba(124,77,255
#ff6d00  ->  rgba(255,109,0
```

Chart.js không parse được → fallback về đen. Đây là lý do biểu đồ lớn nhất trên Dashboard bị một mảng đen phủ kín, che 4 đường dữ liệu.

**Sửa:** bỏ toàn bộ chuỗi replace, dùng một helper duy nhất:

```js
const withAlpha = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16 & 255}, ${n >> 8 & 255}, ${n & 255}, ${a})`;
};
// backgroundColor: withAlpha(alertColors[i], 0.08)
```

Đồng thời cân nhắc `fill: false` cho biểu đồ 4 series chồng nhau — kể cả khi màu đúng, 4 vùng fill vẫn che nhau.

### 2.2. Light mode gãy — chữ gần như vô hình

Đo trên Dashboard ở chế độ sáng: **234/250 text node không đạt WCAG AA**, trong đó **112/184 lỗi unique đến từ `style=""` inline** có màu hardcode.

Ví dụ điển hình — dải ticker LIVE:

| Nội dung | Màu | Tương phản | Chuẩn AA |
|---|---|---|---|
| "Hồ Tuy Lai: Mực nước 19.2m — tiệm cận BĐ2…" | `rgb(192,216,240)` | **1.36:1** | 4.5:1 |
| dấu phân cách `\|` | `rgba(0,200,255,.3)` | **1.82:1** | 4.5:1 |
| "7 ngày" / "Tháng" (tab không active) | | ~2:1 | 4.5:1 |

Nguyên nhân gốc: `:root` có bộ token đầy đủ và `body.light` override đúng 59 rule — **nhưng mọi màu viết inline đều không đổi theo theme**. CSS làm đúng, JS phá.

### 2.3. Vào phân hệ không có quyền → kẹt "Đang tải…" vĩnh viễn

Chuỗi nhân quả (đã reproduce được với user `VIEWER`):

1. `js/hub.js:357` — `groupIsAccessible()` dùng `g.features.some(...)`: chỉ cần xem được **1** feature là cả phân hệ mở khóa.
2. `js/hub.js:359` — `return key ? canView(key) : true` — feature không có trong `MENU_TO_RBAC` thì **mặc định cho phép**. `pcttOperations` (thuộc nhóm "Điều hành Tập trung") không được map → nhóm này **luôn mở khóa cho mọi role**.
3. `js/hub.js:376` — `bestPage()` chọn trang theo `isFeatureEnabled()` (feature flag), **không kiểm tra RBAC**.
4. `js/app.js:362` — `navigate()` phát toast "Bạn không có quyền truy cập trang này" rồi `return` — **không khôi phục vùng nội dung**, spinner "Đang tải…" đứng mãi.

Ảnh chụp `repro_denied.png`: user VIEWER (sidebar chỉ có đúng 1 mục) nhưng hub mở khóa 6/7 phân hệ, và phía sau overlay là "Đang tải…" treo.

**Sửa:** (a) `navigate()` khi bị chặn phải render trang 403 thay vì `return`; (b) `bestPage()` lọc thêm `canView()`; (c) đổi `: true` thành `: false` ở dòng 359 — access control phải fail-closed.

### 2.4. `MENU_TO_RBAC` vô hiệu hóa `ROLE_CONFIG`

`js/app.js:7-9`:

```js
videowall: 'dashboard',
camera:    'dashboard',
```

Video Wall và Camera CCTV bị gác bởi quyền `dashboard`, không phải quyền của chính nó. Trong khi `ROLE_CONFIG` khai báo rõ `VIEWER: { videowall: false, camera: false }`. Vì mọi role đều có `dashboard`, **mọi role đều mở được Video Wall và Camera** — trái hoàn toàn với cấu hình phân quyền.

### 2.5. Lỗi nhỏ hơn nhưng nên dọn

| Chỗ | Vấn đề |
|---|---|
| `js/app.js:41` vs `:1339` | Theme lưu ở 2 key khác nhau: `currentTheme` đọc `qwc_theme` (**không nơi nào ghi**), thực tế dùng `ioc_theme`. Biến chết. |
| `js/app.js:449` | `roleBadgeColors` dùng key cũ (`DIRECTOR`, `DISPATCHER`, `TECHNICIAN`, `BUSINESS`) không tồn tại trong `ROLES`. 6/8 role rơi về xám mặc định — badge "Super Admin" đo được **3.66:1**. |
| `css/main.css:114,122` | `.sidebar` khai báo `background` 2 lần, dòng đầu bị đè. |
| `login.html:863` | Ô OTP **rớt ký tự khi gõ nhanh** — `oninput` chuyển focus nhưng không xử lý paste/gõ liên tiếp. Gõ "483920" chỉ nhận "4". Cần hỗ trợ paste 6 số và `onpaste` phân bổ vào 6 ô. |
| `login.html:865` | Nhập đủ 6 số không tự submit — bắt người dùng bấm thêm 1 nút không cần thiết. |
| toàn app | Còn 7 chỗ dùng `alert()` / `confirm()` native, lệch hoàn toàn với hệ modal riêng. |

---

## 3. P1 — Design system: token có, nhưng không ai dùng

Con số đo được:

| Chỉ số | Giá trị | Nhận xét |
|---|---|---|
| Lượt dùng `var(--token)` | 2.956 | tốt |
| Thuộc tính `style=""` inline | **6.676** | quá nhiều |
| Mã hex khác nhau trong JS | **164** | `:root` chỉ định nghĩa ~20 |
| `rgba()` hardcode trong JS | **2.036** | |
| Rule `body.light` | 59 | không với tới inline style |

164 mã màu cho một hệ thống có 6 màu ngữ nghĩa. Riêng nhóm "đỏ/cảnh báo" đã có `#ef4444`, `#f87171`, `#ff1744`, `#ff5252`, `#ff3d57` — 5 sắc đỏ khác nhau. **Với hệ thống điều hành thiên tai, màu chính là mức độ nguy hiểm** — 5 sắc đỏ nghĩa là người trực không phân biệt được đâu là BĐ2, đâu là BĐ3.

**Đề xuất:** khóa lại thành một bảng ngữ nghĩa duy nhất, đúng như `evg-cms` đang làm ở [AppColors.js](src/general/constants/AppColors.js):

```js
const AppColors = {
  primary: '#30BD6F', primaryActive: '#1BA05C', primaryLight: '#BDFF9F',
  danger:  '#E14E54', dangerActive:  '#D43B41', dangerLight:  '#FFF5F8',
  warning: '#F6C000', warningActive: '#E9B500', warningLight: '#FFF8DD',
  info:    '#2984EE', infoActive:    '#1877E7', infoLight:    '#ECF8FF',
  gray: { 100:'#F9F9F9', 200:'#EEF1FA', 300:'#DBDFF1', 400:'#B6BBD0',
          500:'#9CA2B8', 600:'#7E8299', 700:'#72728B', 800:'#494968', 900:'#18183E' },
};
```

Với Hadiwa nên map theo **cấp báo động** thay vì theo cảm quan: `--alert-bd1 / --alert-bd2 / --alert-bd3 / --alert-critical`, cộng thang xám 9 bậc. Sau đó chạy codemod thay 164 hex → token; light mode sẽ tự đúng.

### 3.1. Responsive: gần như không có

Toàn bộ CSS chỉ có **2 media query**:

```css
@media (max-width: 1200px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width:  900px) { .kanban-board { grid-template-columns: 1fr; } }
```

Ảnh `mobile_dash.png` (390×844): sidebar 250px vẫn mở full chiếm 64% màn hình, nội dung bị nén còn ~140px, KPI card rộng ~50px với mỗi dòng một chữ cái.

Nếu chỉ chạy trên màn hình lớn phòng điều hành thì chấp nhận được — nhưng các nghiệp vụ **"Nhật ký tuần tra", "Quản lý 4 tại chỗ", "Phản ánh cộng đồng"** vốn là nghiệp vụ hiện trường, cán bộ dùng điện thoại. Ít nhất phải: sidebar auto-collapse < 1024px, chuyển thành drawer < 768px, grid về 1 cột, bảng cuộn ngang trong container riêng.

### 3.2. Accessibility

| Chỉ số | Giá trị |
|---|---|
| Thuộc tính `aria-*` trong toàn bộ app | **1** (một `aria-hidden`) |
| Rule `:focus` / `:focus-visible` | 9 |
| `outline: none` | 6 |
| `prefers-reduced-motion` | **0** |
| `tabindex` | 0 |

Cụ thể:
- 4 thẻ chọn phương thức 2FA và 8 chip tài khoản demo ở màn login là `<div onclick>` — screen reader đọc ra `generic`, không bấm được bằng bàn phím.
- App đầy hiệu ứng pulse/glow/marquee chạy liên tục. Với ca trực 24/7 đây là vấn đề mỏi mắt thật, không chỉ là chuẩn. Cần `@media (prefers-reduced-motion: reduce)` tắt animation.
- Ticker LIVE chạy marquee không có nút tạm dừng — nội dung cảnh báo quan trọng mà không đọc kịp.

### 3.3. Không có i18n

Trang Cài đặt có mục "Ngôn ngữ mặc định: Tiếng Việt (vi-VN)" nhưng **100% chuỗi hardcode tiếng Việt trong JS**. Thiết lập này hiện chỉ để trưng bày.

evg-cms đã làm đúng: [vi.json](src/assets/languages/vi.json) 941 key, [en.json](src/assets/languages/en.json) 681 key, dùng qua `useTranslation()`. Nếu Hadiwa có kế hoạch bàn giao cho đơn vị khác hoặc có yêu cầu song ngữ, tách chuỗi càng sớm càng rẻ.

---

## 4. Đối chiếu evg-cms — nên bê nguyên cái gì

Đây là phần trả lời trực tiếp cho "tham khảo thiết kế UI của evg-cms". Không phải bê **giao diện** (evg-cms sáng/xanh lá, Hadiwa tối/xanh cyan — giữ nguyên bản sắc IOC), mà bê **bộ khung component cho các trang quản trị dữ liệu**.

So sánh trang danh sách. Ảnh `dikeMgmt.png` — trang "Quản lý Đê điều" của Hadiwa:

| Tính năng | Hadiwa | evg-cms | Component evg-cms |
|---|:---:|:---:|---|
| Ô tìm kiếm | ✗ | ✓ | `KTFormSearch` |
| Sort theo cột | ✗ | ✓ | `KTTable` (react-data-table) |
| Bộ lọc nâng cao | ✗ | ✓ | `DropdownFilterTable` |
| Ẩn/hiện + sắp xếp cột | ✗ | ✓ | `DropdownTableConfigColumn` + `useConfigTableColumn` |
| Chọn nhiều dòng / thao tác hàng loạt | ✗ | ✓ | `KTTable selectableRows` |
| Menu thao tác trên dòng | 1 nút "Chi tiết" | ✓ | `MenuActionDropdown` |
| Chọn số dòng/trang | ✗ (cố định 8) | ✓ 5/10/20/30/50/100 | `KTPagination` |
| Lọc theo khoảng ngày | ✗ | ✓ | `CustomDateRangePicker` |
| Empty state có minh họa | 10 chỗ / ~50 trang | ✓ | `EmptyView` |
| Loading state | spinner text | ✓ | `KTTable loading` |
| Xuất Excel | ✓ | ✓ | — |

Ngoài ra evg-cms có sẵn các helper tập trung đáng học: `ToastHelper`, `AppDialogHelper`, `UIHelper`, `BreadcrumbHelper` — thay cho việc Hadiwa còn rải rác `alert()`/`confirm()`.

### Ba thứ nên làm trước

1. **Một `<DataTable>` dùng chung** cho ~20 trang danh sách của Hadiwa, có sẵn: search + sort + filter + chọn cột + chọn dòng + pagination + empty + loading. Hiện Hadiwa dùng `class="table-wrap"` khá nhất quán (89 chỗ) → refactor một lần là hưởng toàn hệ thống.
2. **Bảng màu ngữ nghĩa + thang xám** theo mô hình `AppColors.js`, rồi codemod 164 hex.
3. **Chuẩn hóa số liệu trong bảng:** căn phải cột số, dùng `Roboto Mono` cho số đo (Hadiwa đã làm ở vài chỗ, chưa nhất quán), thống nhất cách hiển thị đơn vị (`12/16`, `1/6`, `5/10 tuyến` đang mỗi chỗ một kiểu).

---

## 5. Nhận xét theo từng màn hình

### Đăng nhập / 2FA — tốt
Bố cục sạch, luồng 3 bước rõ, QR TOTP + đếm ngược + đổi phương thức đầy đủ, có `autocomplete="username"/"current-password"` đúng chuẩn.
Cần sửa: ô OTP rớt ký tự khi gõ nhanh (2.5); chưa hỗ trợ paste mã 6 số; nhập đủ không auto-submit; 4 thẻ phương thức 2FA và 8 chip demo không truy cập được bằng bàn phím; thiếu nút hiện/ẩn mật khẩu; chip demo có bề rộng so le gây răng cưa mép phải.

### Module Hub — ý tưởng tốt, logic sai
Màn hình khởi chạy đẹp và định hướng tốt. Nhưng logic khóa/mở sai (2.3, 2.4) khiến nó hứa nhiều hơn khả năng thật của role. Ngoài ra `hub-grid-label` đo được **3.47:1** — nhãn dưới icon dùng màu có alpha `.667` nên chìm.

### Dashboard PCTT
Điểm mạnh: lưới KPI 6 ô rõ ràng, sparkline hợp lý, ticker LIVE đúng tinh thần IOC.
Cần sửa:
- Biểu đồ mực nước hỏng màu (2.1).
- **Hai bộ lọc thời gian cạnh nhau**: filter bar toàn cục (HỒ CHỨA / KHU VỰC / **THỜI GIAN**) và filter cấp trang (Hôm nay / 7 ngày / Tháng). Không rõ cái nào thắng.
- **Hai cơ chế làm mới**: đếm ngược "Làm mới sau 22s" + nút "Làm mới" thủ công.
- Header nhồi 11 phần tử; ở trang "Điều hành & Phê duyệt" dòng "Hệ thống hoạt động bình thường" đã xuống 2 dòng.
- Icon góc phải mỗi KPI card mang tính trang trí và sai ngữ nghĩa (ngôi sao ★ cho "Sự cố đang xử lý", ngôi nhà cho "Đê cần theo dõi").
- Nhãn sidebar bị cắt cụt: "Nhập liệu Vận hành TI", "Phân Loại Đê (PLDGH…" — badge NEW đẩy chữ ra ngoài, không có tooltip.
- FAB chatbot che góc dưới phải, đè lên link "Xem tất cả" của card "Cảnh báo gần đây".

### Điều hành & Phê duyệt — thiết kế tốt nhất trong bộ
Card phê duyệt giàu thông tin, có trích xuất AI kèm độ tin cậy, đính kèm file, badge "đã xác thực OTP" — rất đúng nghiệp vụ.
Cần sửa:
- **"Phê duyệt nhanh" đang là nút primary nổi nhất**, còn "Xem chi tiết & Phê duyệt" lại là ghost button. Với hành động không thể hoàn tác trên hệ thống chỉ đạo thiên tai, thứ tự này nên đảo lại: xem chi tiết là hành động chính, phê duyệt nhanh là thứ cấp.
- Nút "Từ chối" (đỏ) và "Phê duyệt nhanh" (xanh) cùng kích thước, cách nhau ~8px → rủi ro bấm nhầm. Nên tăng khoảng cách hoặc thêm bước xác nhận.
- Độ tin cậy AI 78% hiển thị y hệt 99%. Nên có ngưỡng cảnh báo (< 85% thì đổi màu / gắn cờ "cần kiểm tra thủ công").
- Mỗi card rất cao, chỉ thấy ~1,2 mục/màn hình. Nên có chế độ xem rút gọn.

### Quản lý Đê điều (đại diện nhóm trang danh sách)
Bảng sạch, badge trạng thái rõ. Thiếu toàn bộ công cụ CMS ở bảng mục 4.
Thêm: cột số (`DÀI (KM)`, `CAO TRÌNH`, `ĐIỂM XL`) đang căn trái, nên căn phải. Header `ĐIỂM XL` viết tắt không có tooltip. Badge cấp đê dùng **đỏ** cho "Đê cấp I" trùng với màu nguy hiểm của cột Tình trạng ("Nguy hiểm", "Khẩn cấp") → đỏ mang 2 nghĩa. 4 ô KPI phía trên không bấm được, lẽ ra là bộ lọc nhanh tự nhiên.

### Cài đặt hệ thống
Toggle switch nhất quán, đẹp. Nhưng:
- Dùng `<select>` native, style lệch hẳn so với dropdown tùy biến ở filter bar — và 2 select trên cùng màn hình còn khác nhau.
- Nút "Lưu thay đổi" luôn bật, không theo dõi dirty state, lại nằm xa các trường.
- Nhãn không nhất quán: field dùng CHỮ HOA mono ("MÚI GIỜ HỆ THỐNG"), toggle dùng câu thường.
- Ô "Tìm cài đặt, phân quyền..." nằm trong khay filter toàn cục, phần còn lại của khay trống hoác.

---

## 6. Thứ tự đề xuất

**Đợt 1 — trước buổi demo tiếp theo (0,5–1 ngày)**
1. Sửa hàm màu biểu đồ (2.1) — 5 dòng, sửa được lỗi thấy rõ nhất.
2. `navigate()` render trang 403 thay vì treo spinner (2.3d).
3. `groupIsAccessible` fail-closed + `bestPage` lọc theo `canView` (2.3b,c).
4. Sửa `videowall`/`camera` map đúng quyền của chính nó (2.4).
5. Ô OTP: nhận paste + không rớt ký tự + auto-submit (2.5).

**Đợt 2 — design system (3–5 ngày)**
6. Chốt bảng màu ngữ nghĩa theo cấp báo động + thang xám 9 bậc (mô hình `AppColors.js`).
7. Codemod 164 hex → token; ưu tiên các file inline nhiều nhất: `app.js` (547), `hrm.js` (297), `pcttMedia.js` (254), `lims.js` (251), `datahub.js` (231).
8. Kiểm lại light mode bằng script đo tương phản (mục tiêu: 0 lỗi AA).
9. Thêm `prefers-reduced-motion`, khôi phục `:focus-visible`, nút tạm dừng ticker.

**Đợt 3 — chuẩn CMS (1–2 tuần)**
10. Xây `<DataTable>` dùng chung theo mô hình `KTTable` + `KTPagination` + `EmptyView`, áp cho ~20 trang danh sách.
11. Responsive: sidebar drawer < 768px, grid 1 cột, bảng cuộn ngang có container.
12. Tách chuỗi ra file ngôn ngữ (nếu có nhu cầu song ngữ / bàn giao).

---

## Phụ lục — ảnh chụp

| File | Nội dung |
|---|---|
| `dashboard.png` | Dashboard PCTT, dark — thấy rõ biểu đồ đen |
| `dashboard_light.png` | Dashboard, light — ticker và tab chìm |
| `dikeMgmt.png` | Trang danh sách tiêu biểu |
| `dieuhanh.png` | Điều hành & Phê duyệt |
| `settings.png` | Cài đặt hệ thống |
| `mobile_dash.png` | Dashboard ở 390×844 — layout vỡ |
| `repro_denied.png` | Reproduce lỗi kẹt "Đang tải…" với role VIEWER |
