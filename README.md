# HADIWA iOC Prototype

Phiên bản này là mã nguồn prototype giao diện web cho hệ thống HADIWA iOC (điều hành PCTT/thuỷ lợi). Mục tiêu của repo:

- Lưu trữ baseline prototype đã chạy thực tế.
- Giúp dev mới dựng môi trường local để test nhanh.
- Làm nền để tiếp tục phát triển production theo hướng module hoá, tách API và chuẩn hoá build/deploy.

## 1) Tổng quan kiến trúc hiện tại (Prototype)

Đây là frontend tĩnh kiểu SPA đơn giản, không dùng bundler framework hiện đại.

- `app.html`: entry chính của ứng dụng.
- `login.html`: màn hình đăng nhập giao diện.
- `css/`: stylesheet chính.
- `js/`: toàn bộ logic client, gồm:
  - `js/pages/`: từng module/trang nghiệp vụ (dashboard, cảnh báo, vận hành, GIS, SCADA, ...)
  - các file helper/config/data ở cấp `js/`
- `assets/`: hình ảnh/logo/tài nguyên tĩnh.
- `docs/`: tài liệu nội bộ, ghi chú, script tạo tài liệu.

Lưu ý: code prototype có thể chứa dữ liệu mock, file backup `.bak`, và cấu trúc chưa tối ưu cho scale production.

## 2) Yêu cầu môi trường local

Cần một static web server bất kỳ. Khuyến nghị:

- Node.js 18+ (để dùng `serve`), hoặc
- Python 3 (dùng `http.server`).

## 3) Chạy local để test nhanh

### Cách A: dùng Node.js

```bash
# tại thư mục gốc project
npx serve . -l 8080
```

Mở trình duyệt:

- `http://localhost:8080/app.html`
- `http://localhost:8080/login.html`

### Cách B: dùng Python

```bash
# tại thư mục gốc project
python3 -m http.server 8080
```

Mở:

- `http://localhost:8080/app.html`
- `http://localhost:8080/login.html`

## 4) Cách deploy prototype (staging/VM) dạng static

Ví dụ với Nginx:

1. Copy source lên server, ví dụ `/var/www/html/prototype/tl-pctt/hadiwa/`.
2. Tạo `location` trỏ vào thư mục này.
3. Cấu hình fallback về `app.html` cho route dạng SPA.

Ví dụ location:

```nginx
location /prototype/tl-pctt/hadiwa/ {
    alias /var/www/html/prototype/tl-pctt/hadiwa/;
    index app.html;
    try_files $uri $uri/ /prototype/tl-pctt/hadiwa/app.html;
}

location = /prototype/tl-pctt/hadiwa {
    return 301 /prototype/tl-pctt/hadiwa/;
}
```

## 5) Định hướng nâng cấp từ prototype lên production

Nên triển khai theo từng bước để giảm rủi ro:

1. Chuẩn hoá cấu trúc source
2. Tách config theo môi trường
3. Tách dữ liệu mock khỏi code runtime
4. Chuẩn hoá chất lượng code
5. Thiết lập CI/CD
6. Chuẩn bị backend API thật

Chi tiết đề xuất:

### 5.1 Chuẩn hoá cấu trúc

- Tách rõ:
  - `src/` (mã nguồn)
  - `public/` (asset tĩnh)
  - `docs/` (tài liệu)
- Gom các module trong `js/pages/` theo domain nghiệp vụ để dễ ownership.

### 5.2 Quản lý config môi trường

- Tạo lớp config tập trung (ví dụ `config.dev.js`, `config.staging.js`, `config.prod.js`).
- Không hard-code URL API, token, thông số hạ tầng trong file page logic.

### 5.3 Chuẩn hoá dữ liệu và tích hợp API

- Tách dữ liệu giả lập ra thư mục riêng (`mock/`).
- Định nghĩa adapter/service layer để gọi API, tránh gọi trực tiếp rải rác ở UI.
- Chuẩn hoá contract request/response bằng tài liệu OpenAPI hoặc tài liệu nội bộ.

### 5.4 Quality gate

- Bổ sung lint + format (ESLint/Prettier).
- Thêm test tối thiểu cho logic quan trọng.
- Thiết lập checklist review cho các module nghiệp vụ chính.

### 5.5 CI/CD

- Pipeline cơ bản:
  - lint
  - test
  - build/package
  - deploy staging
- Có cơ chế version/tag để rollback khi cần.

## 6) Quy ước làm việc cho đội dev

- Mỗi tính năng tạo branch riêng từ `main`.
- Commit message rõ scope nghiệp vụ.
- PR cần mô tả:
  - mục tiêu
  - ảnh hưởng module nào
  - cách test local
  - ảnh chụp màn hình (nếu đổi UI)

## 7) Ghi chú quan trọng

- Đây là mã prototype, ưu tiên tốc độ dựng và trình diễn.
- Trước khi đưa production chính thức, cần rà soát bảo mật, hiệu năng, logging, monitoring và kiểm thử dữ liệu thực tế.

---

Nếu cần, có thể tạo thêm tài liệu `MIGRATION_PLAN.md` để chia backlog nâng cấp production thành milestone theo tuần.
