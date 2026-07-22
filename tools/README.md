## Hadiwa IOC — Simulator Tools Suite

**Bộ công cụ giả lập thiết bị thủy lợi & đê điều** dành riêng cho dự án **Hadiwa IOC** (Chi cục Thủy lợi & PCTT TP. Hà Nội).

> ⚠️ **Lưu ý:** Tool này hoàn toàn độc lập với Quawaco IOC Tools. Không dùng chung port, config hay endpoint.

---

### Cài đặt

```bash
cd "/Users/huanpv/Desktop/Wip/Projects/Chi cục TT-PCTT/Hadiwa IOC/tools"
cp .env.example .env
npm install
```

### Khởi động tất cả services

```bash
npm start
```

### Hoặc khởi động từng service riêng lẻ

```bash
npm run start:http        # Hydro HTTP Simulator :7100
npm run start:mqtt        # Flood MQTT Publisher :1884/:9002
npm run start:reservoir   # Reservoir SCADA :7101
npm run start:datalogger  # Rainfall Datalogger :7102
npm run start:dashboard   # Dashboard Server :8200
```

---

### Danh sách Services

| Service | Port | Mô tả |
|--|--|--|
| Hydro HTTP | `7100` | REST API — 16 trạm thủy văn TV01-TV16 |
| Flood MQTT | `1884` / `9002` | MQTT Broker — cảnh báo lũ, mực nước, hồ chứa |
| Reservoir SCADA | `7101` | REST API — điều khiển 6 hồ chứa HO01-HO06 |
| Rainfall Datalogger | `7102` | REST API — chuỗi thời gian mưa 28 quận/huyện |
| Dashboard UI | `8200` | Web dashboard giám sát & scenario injection |

---

### Endpoints quan trọng

```
GET  http://localhost:7100/api/stations          ← Tất cả 16 trạm thủy văn
GET  http://localhost:7100/api/alerts            ← Cảnh báo BĐ1/BĐ2 active
POST http://localhost:7100/api/scenario          ← Kích hoạt kịch bản lũ

GET  http://localhost:7101/api/reservoirs        ← 6 hồ chứa (level, gates)
POST http://localhost:7101/api/reservoir/:id/gate   ← Điều khiển cổng van

GET  http://localhost:7102/api/rainfall/summary  ← Tổng quan mưa toàn TP
GET  http://localhost:7102/api/loggers           ← 28 quận/huyện

Dashboard: http://localhost:8200  (hoặc mở file dashboard/index.html)
```

---

### Dashboard Features

- 📊 **Live Station Cards** — 16 trạm TV01-TV16: mực nước, lượng mưa, thanh % BĐ2
- 🏞 **Reservoir Status** — 6 hồ HO01-HO06: dung tích, cổng xả, nút điều khiển
- ⚡ **Flood Scenario Injection** — bình thường / lũ lớn / bão / hạn hán / khẩn cấp
- 🔔 **Alert Log** — nhật ký cảnh báo BĐ1/BĐ2 realtime
- 🔌 **Protocol Guide** — hướng dẫn kết nối với Hadiwa IOC App

---

### Kịch bản giả lập

| Kịch bản | ID | Mô tả |
|--|--|--|
| Bình thường | `normal` | Dữ liệu vận hành thông thường |
| Lũ lớn sông Hồng | `flood` | MN tăng nhanh, mưa lớn thượng nguồn |
| Bão / Áp thấp | `storm` | Mưa cường độ cao toàn khu vực |
| Hạn hán | `drought` | Mực nước & lượng mưa thấp, hồ giảm |
| Khẩn cấp | `emergency` | MN vượt BĐ3, hồ gần tràn |

```bash
# Kích hoạt kịch bản lũ qua API
curl -X POST http://localhost:7100/api/scenario \
  -H "Content-Type: application/json" \
  -d '{"scenario":"flood"}'
```

---

### Kết nối MQTT

```bash
# Subscribe cảnh báo lũ
mosquitto_sub -h localhost -p 1884 -t "hadiwa/alert/#" -v
# Subscribe mực nước tất cả trạm
mosquitto_sub -h localhost -p 1884 -t "hadiwa/station/+/waterLevel" -v
# Subscribe tất cả hồ chứa
mosquitto_sub -h localhost -p 1884 -t "hadiwa/reservoir/#" -v
```

---

### Chuyển sang Production

Thay các URL localhost bằng IP/port thật của thiết bị hiện trường:
- HTTP API → IP của RTU/thiết bị thủy văn thật
- MQTT → IP MQTT broker Hadiwa backend
- Datalogger → IP datalogger HOBO/Campbell thật
