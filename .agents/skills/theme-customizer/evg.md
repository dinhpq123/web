---
name: evgcms-theme-customizer
description: Tự động tổng hợp, bổ sung và áp dụng màu sắc/theme mới cho dự án EVG CSMS (Quản lý Trạm Sạc Xe Điện) theo chuẩn CSS Variables, AppColors Token Matrix và 7 Brand Presets.
---

# Skill Custom Theme & Color Palette cho EVG CSMS

Skill này giúp Agent và lập trình viên dễ dàng mở rộng, tùy biến hoặc tái sử dụng toàn bộ hệ thống màu sắc (Color Palette / Brand Presets) của dự án **EVG CMS (Electric Vehicle Green CSMS)** cho các ứng dụng web khác một cách nhất quán, chuyên nghiệp và chuẩn hóa.

---

## 1. BẢNG MÀU DỰ ÁN HIỆN TẠI (EVG CMS COLOR SYSTEM)

Dự án EVG CMS xây dựng hệ thống màu sắc dựa trên sự kết hợp giữa **`AppColors.js` Constant Matrix**, **CSS Variables** và thiết kế hiện đại tối ưu cho hệ sinh thái Năng Lượng Xanh / Trạm Sạc Xe Điện.

### 1.1 AppColors & CSS Variables Token Matrix (`AppColors.js` & `index.css` / `custom.style.scss`)

| Semantic Token | Mã màu (Hex / RGBA) | State Variant (Active / Light) | Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| **`primary`** | `#30BD6F` / `#20B970` | Active: `#1BA05C`<br>Light: `#BDFF9F` / `#E8F8F0` | Màu thương hiệu EVG Emerald Green, nút bấm chính, active state, trạm đang chạy |
| **`info`** | `#2984EE` / `#3699FF` | Active: `#1877E7`<br>Light: `#ECF8FF` | Xanh lam thông tin, trạng thái đang sạc (Charging), tiến trình, thông báo |
| **`warning`** | `#F6C000` | Active: `#E9B500`<br>Light: `#FFF8DD` | Vàng cảnh báo, thiết bị đang chuẩn bị (Preparing), chờ duyệt hợp đồng |
| **`danger`** | `#E14E54` | Active: `#D43B41`<br>Light: `#FFF5F8` | Đỏ báo động / lỗi (Fault), dừng khẩn cấp, từ chối, xóa dữ liệu |
| **`green` (Success)**| `rgba(52, 199, 89, 1)` | Active: `#34C759` | Trạng thái an toàn, thành công, công tắc iOS Switch Active |
| **`bg-app`** | `#F6F8F5` / `#EEF1FA` | Content Container: `rgba(238, 241, 250, 1)` | Nền tổng thể ứng dụng (App Background) |
| **`bg-surface`** | `#FFFFFF` | Hover: `#F3F6F9` | Nền Card, Modal, Panel, Table row background |
| **`border-base`** | `#DBDFF1` / `#E4E6EF` | Active: `#20B970` | Đường viền thẻ, phân cách ô nhập liệu, divider |
| **`gray-0`** | `rgba(24, 24, 62, 1)` | Base overlay | Màu tối sâu base |
| **`gray-100`** | `#F9F9F9` | Surface light | Nền ô input, background phụ |
| **`gray-200`** | `#EEF1FA` | Element bg | Background khối thông số, badge light |
| **`gray-300`** | `#DBDFF1` | Border light | Đường phân cách nhẹ, border input |
| **`gray-400`** | `#B6BBD0` / `#B5B5C3` | Muted border | Icon vô hiệu hóa, placeholder |
| **`gray-500`** | `#9CA2B8` | Sub-label | Nhãn form phụ, text muted |
| **`gray-600`** | `#7E8299` | Secondary text | Chữ phụ, mô tả, ngày tháng |
| **`gray-700`** | `#72728B` | Sub-header | Tiêu đề phụ, label form chính |
| **`gray-800`** | `#494968` / `#3F4254` | Primary text | Chữ chính, tiêu đề bảng, thông số nổi bật |
| **`gray-900`** | `#18183E` | Header / Sidebar Dark | Nền Topbar / Sidebar chế độ tối |

---

### 1.2 Danh mục 7 Brand Presets gợi ý mở rộng (MULTI-BRAND THEME PRESETS)

Dựa trên bảng màu gốc của EVG CMS, dưới đây là 7 bộ màu Presets chuẩn hóa cho các mảng Năng Lượng Xanh & Công Nghệ Trạm Sạc:

| Preset ID | Tên Tiếng Việt | Primary (Màu chính) | Secondary (Màu phụ) | Accent (Điểm nhấn) | App BG Light | App BG Dark |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `evg-emerald` | EVG Emerald Xanh Lá (Gốc) | `#30BD6F` | `#2984EE` | `#BDFF9F` | `#F6F8F5` | `#0E1A14` |
| `vin-cyan` | Xanh Cyan Xe Điện Tech | `#00D2FF` | `#0066FF` | `#00F080` | `#F0F8FF` | `#031326` |
| `solar-gold` | Năng Lượng Mặt Trời | `#F6C000` | `#FF9900` | `#30BD6F` | `#FFFDF0` | `#1C180A` |
| `charge-cobalt` | Hạ Tầng Trụ Sạc Cobalt | `#2563EB` | `#3B82F6` | `#10B981` | `#F8FAFC` | `#0F172A` |
| `eco-mint` | Sinh Thái Mint Green | `#059669` | `#10B981` | `#34D399` | `#F0FDF4` | `#062319` |
| `cyber-volt` | Điện Áp Cao Cyber | `#A855F7` | `#EC4899` | `#22C55E` | `#FAF5FF` | `#12091F` |
| `midnight-ioc` | Giám Sát IOC Đêm | `#10B981` | `#0EA5E9` | `#F59E0B` | `#F1F5F9` | `#0B1320` |

---

### 1.3 Chi tiết mảng màu sử dụng theo từng Màn hình (Screen-by-Screen Color Mapping)

Dưới đây là mapping chi tiết màu sắc theo từng module / tính năng trong dự án **EVG CMS**:

| Màn hình / Sub-system | Thành phần UI (Element) | Mã màu / Palette đang dùng | Ý nghĩa / Semantic Token |
| :--- | :--- | :--- | :--- |
| **1. Đăng nhập & Xác thực (`Auth/Login`)** | Card Form Đăng nhập | Nền `#FFFFFF`, Viền `#DBDFF1` | Khối form sạch sẽ, hiện đại |
| | Nút Đăng nhập (Submit) | Nền `#30BD6F`, Hover `#1BA05C`, Text `#FFFFFF` | Button thao tác chính |
| | Input Username / Password | Focus border `#20B970`, Invalid `#E14E54` | Trạng thái ô nhập dữ liệu |
| **2. Quản lý Trạm Sạc (`ManageChargeStation`)** | Trạng thái Trạm Bình thường (NORMAL) | Badge Nền `#E8F8F0`, Text `#30BD6F` | Trạm đang mở & hoạt động ổn định |
| | Trạng thái Bảo trì (MAINTAINING) | Badge Nền `#FFF8DD`, Text `#F6C000` | Trạm đang tạm dừng kỹ thuật |
| | Trạng thái Dừng / Ẩn (STOPPED/HIDDEN)| Badge Nền `#FFF5F8`, Text `#E14E54` | Trạm bị ngắt hoặc dừng phục vụ |
| **3. Quản lý Trụ Sạc & Vòi Sạc (`ChargePoint` & `ChargeConnector`)** | Trụ sẵn sàng (AVAILABLE) | Card Status indicator `#30BD6F` | Trụ sạc rảnh, sẵn sàng cắm sạc |
| | Trụ đang sạc / bận (BUSY) | Card Status indicator `#2984EE` | Trụ sạc đang có xe sạc điện |
| | Trụ bị lỗi (FAULT) | Card Status indicator `#E14E54` | Trụ bị sự cố kết nối / phần cứng |
| | Trụ ngắt kết nối (NOT_CONNECTED) | Card Status indicator `#9CA2B8` | Trụ offline mất tín hiệu |
| | Vòi sạc Chuẩn bị (PREPARING) | Status text `#F6C000` | Vòi sạc đã cắm, chờ cấp dòng |
| **4. Quản lý Phiên Sạc (`ManageChargeTransaction`)** | Phiên Đang sạc (CHARGING) | Badge `#2984EE`, Highlight line `#ECF8FF` | Tiến trình nạp điện thực tế |
| | Phiên Hoàn thành (FINISHED) | Badge `#30BD6F` | Phiên sạc kết thúc thành công |
| | Phiên Hủy / Lỗi (CANCELLED/FAILED)| Badge `#E14E54` | Phiên bị dừng đột ngột / sự cố |
| | Lượng điện tiêu thụ (kWh) | Text bold `#494968` (`gray-800`) | Chỉ số điện nạp nổi bật |
| **5. Giao dịch & Thanh toán (`ManagePaymentTransactions`)** | Giao dịch thành công (COMPLETED) | Badge Icon `#30BD6F`, Text `#30BD6F` | Tiền nạp/thanh toán thành công |
| | Giao dịch chờ (PENDING) | Badge Icon `#F6C000`, Text `#F6C000` | Đang xử lý cổng thanh toán |
| | Giao dịch thất bại (FAILED) | Badge Icon `#E14E54`, Text `#E14E54` | Thanh toán bị từ chối |
| **6. Đại lý & Đối tác (`ManageAgency`, `ManageInvestor`, `ManageLandowner`)** | Thẻ Ngân hàng Mặc định (Bank Card)| Border bottom `#30BD6F`, Nền `#F9F9F9` | Tài khoản nhận doanh thu chính |
| | Trạng thái Đã ký hợp đồng (SIGNED) | Badge `#30BD6F` | Đối tác đã kích hoạt kinh doanh |
| | Trạng thái Chờ duyệt (REGISTERED) | Badge `#F6C000` | Hồ sơ đối tác mới đăng ký |
| | Trạng thái Đóng / Khóa (SUSPENDED) | Badge `#E14E54` | Đại lý bị đóng băng tài khoản |
| **7. Báo cáo Đối soát & Tài chính (`ReconciliationReport`)** | Tổng doanh thu / Tổng sản lượng | Text `#30BD6F` / Icon `#30BD6F` | Chỉ số tăng trưởng tích cực |
| | Chi phí điện năng / Hoa hồng chia sẻ| Text `#2984EE` | Khoản chi phí / chi trả đại lý |
| | Công nợ / Cảnh báo vượt ngưỡng | Text `#E14E54` / `#F6C000` | Chỉ số tài chính cần lưu ý |
| **8. Bảng Dữ Liệu (`Data Table` & UI Controls)** | Header Bảng Dữ Liệu | Nền `#EEF1FA`, Text `#494968` | Thanh tiêu đề cột rõ ràng |
| | Dòng được chọn (Selected Row) | Nền `#F3F6F9`, Text `#20B970` | Row active khi thao tác |
| | Nút Thao tác Bảng (Action Buttons)| Hover Background `#F3F6F9`, Icon `#20B970` | Nút Sửa/Xóa/Xem chi tiết |
| | Thanh cuộn (Custom Scrollbar) | Thumb `rgba(32, 185, 112, 0.6)`, Hover `rgba(36, 184, 49, 1)` | Hiệu ứng thanh cuộn xanh mượt |

---

## 2. QUY TRÌNH TẠO & ÁP DỤNG MÀU MỚI SANG WEB KHÁC (HOW TO APPLY)

Khi bạn muốn áp dụng hệ thống màu EVG CMS này sang một trang web khác hoặc muốn thay đổi bộ màu mới (VD: Cyan Tech, Gold Solar,...), hãy làm theo 3 bước chuẩn hóa dưới đây:

### Bước 1: Khai báo CSS Variables Matrix trong file CSS chính (vd: `main.css` hoặc `styles.css`)

```css
/* ── EVG CSMS BRAND COLOR SYSTEM MATRIX ────────────────── */
:root {
  /* Brand Primary Colors */
  --evg-primary: #30BD6F;
  --evg-primary-active: #1BA05C;
  --evg-primary-light: #BDFF9F;
  
  /* Semantic Status Colors */
  --evg-info: #2984EE;
  --evg-info-light: #ECF8FF;
  --evg-warning: #F6C000;
  --evg-warning-light: #FFF8DD;
  --evg-danger: #E14E54;
  --evg-danger-light: #FFF5F8;
  --evg-success: #34C759;

  /* App Backgrounds & Surface */
  --evg-bg-app: #F6F8F5;
  --evg-bg-surface: #FFFFFF;
  --evg-bg-card: #FFFFFF;
  --evg-bg-hover: #F3F6F9;
  
  /* Grayscale Palette */
  --evg-gray-100: #F9F9F9;
  --evg-gray-200: #EEF1FA;
  --evg-gray-300: #DBDFF1;
  --evg-gray-400: #B6BBD0;
  --evg-gray-500: #9CA2B8;
  --evg-gray-600: #7E8299;
  --evg-gray-700: #72728B;
  --evg-gray-800: #494968;
  --evg-gray-900: #18183E;
  
  /* Border & Shadows */
  --evg-border: #DBDFF1;
  --evg-border-active: #20B970;
  --evg-shadow: 0px 4px 16px rgba(0, 0, 0, 0.06);
}

/* ── THEME VARIATION EXAMPLE: VIN-CYAN ────────────────── */
body.theme-vin-cyan {
  --evg-primary: #00D2FF;
  --evg-primary-active: #0088DD;
  --evg-primary-light: #E0F7FF;
  --evg-border-active: #00D2FF;
  --evg-bg-app: #F0F8FF;
}
