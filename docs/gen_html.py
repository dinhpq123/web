#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate Quawaco IOC Feature Spec HTML"""
import os, glob
from pathlib import Path

IMGD = Path(r"C:\Users\Administrator\.gemini\antigravity\brain\cdb40122-0c21-4711-9e66-579d10052980")
OUT  = Path(r"D:\Daddy Workspace\Projects\IOC Quawaco\docs\Quawaco_IOC_Feature_Spec.html")

def ss(base):
    hits = sorted(IMGD.glob(f"{base}_*.png"))
    if hits: return str(hits[-1])
    p = IMGD / f"{base}.png"
    return str(p) if p.exists() else ""

def img(base, caption, w="100%"):
    path = ss(base)
    if not path: return f'<div class="no-img">[ {base} — not captured ]</div>'
    return f'''<figure><img src="file:///{path.replace(chr(92),"/")}\" alt=\"{caption}\" style=\"width:{w};border-radius:10px;box-shadow:0 4px 24px rgba(0,0,0,.5)\"><figcaption>{caption}</figcaption></figure>'''

def sec(id_, icon, num, title, content):
    return f'''<section id="{id_}"><div class="sec-header"><span class="sec-icon">{icon}</span><div><span class="sec-num">{num}</span><h2>{title}</h2></div></div>{content}</section>'''

def rbac_row(module, sa, di, dp, te, bu, hr, vi):
    def cell(v):
        c = "full" if "Full" in v else ("edit" if "Edit" in v else ("view" if "View" in v else "none"))
        return f'<td class="rb {c}">{v}</td>'
    return f'<tr><td class="mod">{module}</td>{cell(sa)}{cell(di)}{cell(dp)}{cell(te)}{cell(bu)}{cell(hr)}{cell(vi)}</tr>'

CSS = """
:root{--bg:#030e1c;--bg2:#0d1f35;--bg3:#1e2d3d;--cyan:#00c8ff;--blue:#0050cc;--green:#00e676;--yellow:#ffca28;--red:#ff1744;--text:#e2eaf4;--muted:#546e7a;--border:rgba(0,200,255,.15)}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);font-size:14px;line-height:1.6}
h1{font-size:2.4rem;font-weight:800;background:linear-gradient(135deg,#fff,var(--primary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:.5rem}
h2{font-size:1.5rem;font-weight:700;color:#fff;margin:0}
h3{font-size:1.1rem;font-weight:600;color:var(--primary);margin:1.5rem 0 .6rem}
p{color:#b0c8e0;margin:.6rem 0 1rem;line-height:1.7}
ul{padding-left:1.4rem;color:#b0c8e0}
li{margin:.3rem 0}
a{color:var(--primary);text-decoration:none}
a:hover{text-decoration:underline}

/* Layout */
.cover{background:linear-gradient(135deg,#030e1c 0%,#051a35 60%,#0a1f3e 100%);padding:80px 60px 60px;border-bottom:2px solid var(--primary);position:relative;overflow:hidden}
.cover::before{content:'';position:absolute;right:-100px;top:-100px;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(0,200,255,.08),transparent 70%)}
.cover-meta{display:flex;gap:10px;flex-wrap:wrap;margin-top:2rem}
.tag{display:inline-block;padding:4px 14px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.5px}

main{max-width:1200px;margin:0 auto;padding:40px 40px 80px}
section{margin-bottom:60px;padding-bottom:40px;border-bottom:1px solid var(--border)}

.sec-header{display:flex;align-items:center;gap:18px;margin-bottom:24px;padding:20px 24px;background:var(--bg2);border-radius:12px;border-left:4px solid var(--primary)}
.sec-icon{font-size:2rem}
.sec-num{font-size:10px;font-weight:700;color:var(--primary);letter-spacing:2px;text-transform:uppercase;display:block}

/* TOC */
#toc{position:fixed;top:20px;right:20px;width:230px;background:rgba(13,31,53,.95);border:1px solid var(--border);border-radius:12px;padding:16px;z-index:9999;max-height:calc(100vh - 40px);overflow-y:auto;backdrop-filter:blur(12px)}
#toc h4{font-size:10px;letter-spacing:2px;color:var(--primary);text-transform:uppercase;margin-bottom:10px;font-weight:700}
#toc a{display:block;font-size:11px;color:#b0c8e0;padding:4px 8px;border-radius:6px;transition:.2s}
#toc a:hover{background:rgba(0,200,255,.1);color:var(--primary);text-decoration:none}
#toc .toc-group{font-size:9px;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin:8px 0 2px 8px}

/* Cards */
.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;margin:20px 0}
.card{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:20px}
.card-title{font-weight:700;font-size:13px;color:#fff;margin-bottom:8px}
.card-body{font-size:12px;color:#b0c8e0;line-height:1.6}
.card-icon{font-size:1.5rem;margin-bottom:8px}

/* Screenshots */
figure{margin:20px 0}
figcaption{margin-top:10px;font-size:12px;color:var(--muted);font-style:italic;text-align:center;padding:6px;background:var(--bg2);border-radius:0 0 8px 8px}
.no-img{padding:40px;border:2px dashed var(--border);border-radius:10px;text-align:center;color:var(--muted);font-size:12px}
.img-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:20px 0}
.img-row figure{margin:0}

/* RBAC Table */
.rbac-table{width:100%;border-collapse:collapse;font-size:12px;margin:20px 0}
.rbac-table th{background:var(--bg3);color:var(--primary);font-weight:700;padding:10px 8px;text-align:center;border:1px solid var(--border)}
.rbac-table td{padding:8px 10px;border:1px solid var(--border);text-align:center}
.rbac-table tr:nth-child(even) td{background:rgba(0,200,255,.03)}
.rbac-table td.mod{text-align:left;font-weight:600;color:#fff;background:var(--bg2)}
.rb.full{color:#00e676;font-weight:700}
.rb.edit{color:#ffca28;font-weight:600}
.rb.view{color:#90caf9}
.rb.none{color:var(--muted)}
.role-header{padding:8px 4px;font-size:11px}

/* Badges */
.badge{display:inline-block;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700;margin:2px}
.badge-red{background:#ff1744;color:#fff}
.badge-purple{background:#7c3aed;color:#fff}
.badge-yellow{background:#ffca28;color:#111}
.badge-blue{background:#0050cc;color:#fff}
.badge-cyan{background:#00b4d8;color:#fff}
.badge-green{background:#00a86b;color:#fff}
.badge-gray{background:#546e7a;color:#fff}

/* Feature list */
.feat-list{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}
.feat{background:rgba(0,200,255,.08);border:1px solid rgba(0,200,255,.2);border-radius:6px;padding:4px 12px;font-size:12px;color:var(--primary)}

/* Info box */
.info-box{background:rgba(0,80,204,.15);border:1px solid rgba(0,80,204,.4);border-radius:10px;padding:16px 20px;margin:16px 0}
.warn-box{background:rgba(255,193,7,.08);border:1px solid rgba(255,193,7,.3);border-radius:10px;padding:16px 20px;margin:16px 0;color:#ffca28}

/* Scrollbar */
::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:var(--bg2)}::-webkit-scrollbar-thumb{background:var(--bg3);border-radius:3px}
"""

TOC = """
<nav id="toc">
<h4>Mục lục</h4>
<a href="#cover">Tổng quan</a>
<div class="toc-group">Hệ thống IOC</div>
<a href="#s01">01 · Đăng nhập & RBAC</a>
<a href="#s02">02 · Dashboard</a>
<a href="#s03">03 · GIS Bản đồ</a>
<a href="#s04">04 · SCADA</a>
<a href="#s05">05 · Sự cố & Lệnh CT</a>
<a href="#s06">06 · Chất lượng nước</a>
<a href="#s07">07 · Sản xuất & Vật tư</a>
<a href="#s08">08 · Kinh doanh & KH</a>
<a href="#s09">09 · Tổng đài CSKH</a>
<a href="#s10">10 · NRW Thất thoát</a>
<a href="#s11">11 · Nhân sự (HRM)</a>
<a href="#s12">12 · AI Agent & Chatbot</a>
<a href="#s13">13 · Báo cáo</a>
<a href="#s14">14 · Cài đặt & RBAC</a>
<div class="toc-group">Ứng dụng KH</div>
<a href="#s15">15 · Smart Water Care</a>
<a href="#s15-login">· Đăng nhập</a>
<a href="#s15-home">· Trang chủ</a>
<a href="#s15-consumption">· Tiêu thụ</a>
<a href="#s15-bills">· Hóa đơn & TT</a>
<a href="#s15-incident">· Báo sự cố</a>
<a href="#s15-quality">· Chất lượng</a>
<a href="#s15-services">· Dịch vụ</a>
<a href="#s15-chatbot">· AI Chatbot</a>
<a href="#s15-profile">· Hồ sơ</a>
<div class="toc-group">Phụ lục</div>
<a href="#rbac-matrix">Ma trận RBAC</a>
<a href="#tech">Kiến trúc KT</a>
</nav>
"""

def section_login():
    return f"""
<section id="s01">
<div class="sec-header"><span class="sec-icon">🔐</span><div><span class="sec-num">Phân hệ 01</span><h2>Đăng nhập & Xác thực đa yếu tố</h2></div></div>
<p>Màn hình đăng nhập Quawaco IOC Center áp dụng xác thực 2 lớp (2FA) với các phương thức: TOTP (Google Authenticator), SMS OTP và Email OTP. Hệ thống cung cấp 7 tài khoản demo theo vai trò để thuận tiện trong việc kiểm thử và thuyết trình.</p>
<div class="feat-list">
<span class="feat">2FA – TOTP / SMS / Email / Zalo</span>
<span class="feat">7 Role Demo Cards</span>
<span class="feat">Auto-fill credentials</span>
<span class="feat">OTP 6 chữ số, đếm ngược 5 phút</span>
<span class="feat">Ghi nhớ đăng nhập</span>
<span class="feat">Bảo vệ brute-force</span>
</div>
{img("login_main_page","Màn hình đăng nhập IOC Center — 7 thẻ chọn vai trò nhanh, xác thực 2FA với OTP")}
<h3>Các bước xác thực</h3>
<ol style="padding-left:1.4rem;color:#b0c8e0;line-height:2">
<li><strong>Bước 1 – Nhập tài khoản:</strong> Email + mật khẩu (hoặc chọn nhanh từ thẻ demo role)</li>
<li><strong>Bước 2 – Chọn phương thức 2FA:</strong> TOTP / SMS / Email / Zalo OTP</li>
<li><strong>Bước 3 – Nhập OTP 6 chữ số:</strong> 6 ô tự động nhảy, bộ đếm 5 phút</li>
<li><strong>Kết quả:</strong> Lưu phiên vào localStorage, điều hướng sang app.html, sidebar lọc theo role</li>
</ol>
</section>"""

def section_dashboard():
    return f"""
<section id="s02">
<div class="sec-header"><span class="sec-icon">📊</span><div><span class="sec-num">Phân hệ 02</span><h2>Dashboard – Bảng điều khiển trung tâm</h2></div></div>
<p>Dashboard cung cấp cái nhìn tổng quan toàn bộ hệ thống cấp nước trong thời gian thực. Tất cả KPI chính được hiển thị trực quan, cùng với ticker cảnh báo cuộn ngang và biểu đồ xu hướng 6 tháng.</p>
<div class="feat-list">
<span class="feat">KPI Cards real-time</span><span class="feat">Ticker cảnh báo cuộn ngang</span>
<span class="feat">Biểu đồ sản lượng 12h</span><span class="feat">Biểu đồ cột 6 tháng</span>
<span class="feat">Trạng thái trạm bơm</span><span class="feat">Bản đồ tiêu thụ theo giờ</span>
<span class="feat">Panel cảnh báo chi tiết</span><span class="feat">Lọc theo nhà máy / khu vực / thời gian</span>
</div>
{img("dashboard_main","Dashboard tổng quan: sản lượng 75.800m³, 6/8 trạm online, 4 sự cố đang xử lý, NRW 14.4%, 49.100 khách hàng")}
<h3>Panel cảnh báo (Alarm Panel)</h3>
<p>Nhấn biểu tượng chuông góc phải trên cùng để mở panel cảnh báo với danh sách các cảnh báo theo mức độ ưu tiên (CRITICAL / HIGH / MEDIUM). Mỗi cảnh báo có thể được xác nhận (ACK) hoặc chuyển thành lệnh công tác.</p>
{img("dashboard_alarm_panel","Panel cảnh báo real-time — phân loại ưu tiên, xác nhận (ACK) từng cảnh báo, liên kết đến sự cố")}
</section>"""

def section_gis():
    return f"""
<section id="s03">
<div class="sec-header"><span class="sec-icon">🗺️</span><div><span class="sec-num">Phân hệ 03</span><h2>GIS – Bản đồ mạng lưới cấp nước</h2></div></div>
<p>Tích hợp OpenStreetMap (Leaflet.js) hiển thị toàn bộ hạ tầng đường ống, trạm bơm, van khóa, đồng hồ tổng và các DMA (District Metered Area) của Quawaco. Sự cố được hiển thị trực tiếp trên bản đồ theo màu mức độ.</p>
<div class="feat-list">
<span class="feat">OpenStreetMap + Leaflet.js</span><span class="feat">Lớp đường ống (Pipeline layers)</span>
<span class="feat">Popup chi tiết tài sản</span><span class="feat">DMA zones màu sắc</span>
<span class="feat">Sự cố pin theo mức độ</span><span class="feat">Bộ lọc theo loại tài sản</span>
<span class="feat">Tọa độ GPS thực</span><span class="feat">Full-screen mode</span>
</div>
{img("gis_map_main","Bản đồ GIS: đường ống, trạm bơm, van, DMA — click vào pin để xem chi tiết tài sản và liên kết sự cố")}
</section>"""

def section_scada():
    return f"""
<section id="s04">
<div class="sec-header"><span class="sec-icon">⚡</span><div><span class="sec-num">Phân hệ 04</span><h2>SCADA – Giám sát & Điều khiển thời gian thực</h2></div></div>
<p>Hệ thống SCADA giám sát các trạm bơm, thu thập dữ liệu cảm biến áp lực, lưu lượng, mực nước liên tục. Biểu đồ xu hướng 24h và so sánh liên trạm giúp phát hiện bất thường sớm.</p>
<div class="feat-list">
<span class="feat">Áp lực (bar) real-time</span><span class="feat">Lưu lượng m³/h</span>
<span class="feat">Mực nước bể chứa</span><span class="feat">Điện năng tiêu thụ</span>
<span class="feat">Trend chart 24h</span><span class="feat">Ngưỡng cảnh báo ON/OFF</span>
<span class="feat">Trạng thái máy bơm</span><span class="feat">Xuất dữ liệu CSV</span>
</div>
{img("scada_overview","SCADA: áp lực, lưu lượng, mực nước 3 trạm (Hồng Gai, Bãi Cháy, Cẩm Phả) — biểu đồ xu hướng 24h")}
</section>"""

def section_incidents():
    return f"""
<section id="s05">
<div class="sec-header"><span class="sec-icon">🚨</span><div><span class="sec-num">Phân hệ 05</span><h2>Sự cố & Lệnh công tác</h2></div></div>
<p>Quản lý toàn bộ vòng đời sự cố từ tiếp nhận → phân công → xử lý → đóng. Hỗ trợ lệnh công tác (Work Order) và tích hợp trực tiếp với bản đồ GIS để xác định vị trí sự cố.</p>
<div class="feat-list">
<span class="feat">Vòng đời sự cố đầy đủ</span><span class="feat">Phân loại theo mức độ (Critical/High/Medium/Low)</span>
<span class="feat">Lệnh công tác tự động</span><span class="feat">Phân công đội kỹ thuật</span>
<span class="feat">Vị trí GPS trên GIS</span><span class="feat">Ảnh đính kèm</span>
<span class="feat">SLA theo dõi tự động</span><span class="feat">Báo cáo sự cố tổng hợp</span>
</div>
<div class="img-row">
{img("incidents_overview","Danh sách sự cố: phân loại mức độ, trạng thái xử lý, thời gian phản hồi và đội phụ trách")}
{img("incidents_create_modal","Modal tạo sự cố mới: loại sự cố, GPS, mô tả chi tiết, ảnh đính kèm, phân công đội KT")}
</div>
</section>"""

def section_quality():
    return f"""
<section id="s06">
<div class="sec-header"><span class="sec-icon">💧</span><div><span class="sec-num">Phân hệ 06</span><h2>Chất lượng nước</h2></div></div>
<p>Giám sát 6 chỉ tiêu chất lượng nước theo QCVN 01:2009/BYT: pH, Độ đục, Clo dư, Coliform, Kim loại nặng, TDS. Dữ liệu được so sánh với ngưỡng quy chuẩn và hiển thị xu hướng 30 ngày.</p>
<div class="feat-list">
<span class="feat">pH 6.5–8.5</span><span class="feat">Độ đục ≤ 2 NTU</span>
<span class="feat">Clo dư 0.3–0.5 mg/L</span><span class="feat">Coliform = 0 CFU/100mL</span>
<span class="feat">QCVN 01:2009 compliance</span><span class="feat">Trend 30 ngày</span>
<span class="feat">Cảnh báo vượt ngưỡng</span><span class="feat">Xuất báo cáo lab</span>
</div>
{img("quality_overview","Chất lượng nước: 6 chỉ tiêu với gauge trực quan, so sánh QCVN, xu hướng lịch sử 30 ngày")}
</section>"""

def section_production():
    return f"""
<section id="s07">
<div class="sec-header"><span class="sec-icon">🏭</span><div><span class="sec-num">Phân hệ 07</span><h2>Sản xuất & Vật tư</h2></div></div>
<p>Theo dõi sản lượng nước sản xuất hàng ngày từ các nhà máy nước (NMN Hồng Gai, Bãi Cháy, Cẩm Phả), quản lý tồn kho hóa chất xử lý nước và lập kế hoạch mua sắm.</p>
<div class="feat-list">
<span class="feat">Sản lượng theo NMN</span><span class="feat">Kế hoạch vs Thực tế</span>
<span class="feat">Tồn kho hóa chất</span><span class="feat">Cảnh báo hàng tồn thấp</span>
<span class="feat">Nhật ký sản xuất</span><span class="feat">Biểu đồ so sánh chu kỳ</span>
</div>
{img("production_overview","Sản xuất & Vật tư: nhật ký hàng ngày theo NMN, tồn kho hóa chất (Clo, Phèn, vôi), cảnh báo mức tồn thấp")}
</section>"""

def section_business():
    return f"""
<section id="s08">
<div class="sec-header"><span class="sec-icon">👥</span><div><span class="sec-num">Phân hệ 08</span><h2>Kinh doanh & Quản lý khách hàng</h2></div></div>
<p>Quản lý toàn diện 49.100+ khách hàng: hợp đồng, đồng hồ nước, lịch sử tiêu thụ, hóa đơn và chỉ số ghi thu. Tích hợp với tổng đài CSKH và ứng dụng khách hàng.</p>
<div class="feat-list">
<span class="feat">49.100+ khách hàng</span><span class="feat">Quản lý hợp đồng</span>
<span class="feat">Lịch sử tiêu thụ 12 tháng</span><span class="feat">Hóa đơn điện tử</span>
<span class="feat">Tìm kiếm nhanh</span><span class="feat">Lọc đa chiều</span>
<span class="feat">Chi tiết 360° khách hàng</span><span class="feat">Xuất danh sách Excel</span>
</div>
<div class="img-row">
{img("business_customers_overview","Danh sách khách hàng: tìm kiếm, lọc theo trạng thái/khu vực, thao tác nhanh trên hàng")}
{img("customer_detail_view","Hồ sơ KH 360°: thông tin cá nhân, hợp đồng, lịch sử tiêu thụ, hóa đơn, yêu cầu dịch vụ")}
</div>
</section>"""

def section_callcenter():
    return f"""
<section id="s09">
<div class="sec-header"><span class="sec-icon">📞</span><div><span class="sec-num">Phân hệ 09</span><h2>Tổng đài CSKH</h2></div></div>
<p>Hệ thống tổng đài tích hợp CRM: tiếp nhận cuộc gọi, tạo ticket, theo dõi SLA và báo cáo hiệu suất. Mỗi cuộc gọi được liên kết tự động với hồ sơ khách hàng.</p>
<div class="feat-list">
<span class="feat">Ticket quản lý yêu cầu</span><span class="feat">SLA theo dõi tự động</span>
<span class="feat">CRM tích hợp</span><span class="feat">Phân loại: Sự cố / TT / Dịch vụ</span>
<span class="feat">Leo thang tự động</span><span class="feat">Báo cáo hiệu suất</span>
</div>
{img("10_call_center_1772220649086","Tổng đài CSKH: tiếp nhận cuộc gọi, tạo ticket hỗ trợ, theo dõi SLA, báo cáo hiệu suất nhân viên CSKH")}
</section>"""

def section_nrw():
    return f"""
<section id="s10">
<div class="sec-header"><span class="sec-icon">📉</span><div><span class="sec-num">Phân hệ 10</span><h2>NRW – Quản lý thất thoát nước</h2></div></div>
<p>Non-Revenue Water (NRW) Dashboard theo dõi tỷ lệ thất thoát theo từng DMA, phân tích cân bằng nước (Water Balance) và hỗ trợ chiến lược giảm NRW.</p>
<div class="feat-list">
<span class="feat">NRW % theo DMA</span><span class="feat">Water Balance tự động</span>
<span class="feat">So sánh chu kỳ</span><span class="feat">Ước tính lãng phí m³/ngày</span>
<span class="feat">Phát hiện rò rỉ AI</span><span class="feat">Xu hướng NRW 12 tháng</span>
</div>
{img("08_nrw_loss_1772220632263","NRW Dashboard: tỷ lệ thất thoát 14.4% tổng hệ thống, phân tích theo DMA, so sánh tháng trước")}
</section>"""

def section_hrm():
    return f"""
<section id="s11">
<div class="sec-header"><span class="sec-icon">👤</span><div><span class="sec-num">Phân hệ 11</span><h2>Nhân sự (HRM)</h2></div></div>
<p>Quản lý nhân sự toàn diện: hồ sơ nhân viên, chấm công, KPI theo bộ phận, nghỉ phép và đào tạo. Tích hợp với bộ phận Kỹ thuật để theo dõi nhân lực trực ca.</p>
<div class="feat-list">
<span class="feat">Danh sách CBNV</span><span class="feat">Chấm công tự động</span>
<span class="feat">KPI bộ phận</span><span class="feat">Đơn nghỉ phép online</span>
<span class="feat">Lịch làm việc</span><span class="feat">Đào tạo & chứng chỉ</span>
</div>
{img("09_hrm_employees_1772220646352","HRM: danh sách CBNV với bộ phận, chức vụ, trạng thái; chấm công, KPI, đơn nghỉ phép tự động")}
</section>"""

def section_ai():
    return f"""
<section id="s12">
<div class="sec-header"><span class="sec-icon">🤖</span><div><span class="sec-num">Phân hệ 12</span><h2>AI Agent & Chatbot nội bộ</h2></div></div>
<p>AI Agent phân tích dữ liệu bằng ngôn ngữ tự nhiên tiếng Việt, phát hiện bất thường tự động và đưa ra khuyến nghị hành động. Chatbot nội bộ hỗ trợ tra cứu thông tin nhanh.</p>
<div class="feat-list">
<span class="feat">NLP tiếng Việt</span><span class="feat">Phát hiện bất thường</span>
<span class="feat">Dự báo sự cố</span><span class="feat">Khuyến nghị hành động</span>
<span class="feat">Truy vấn dữ liệu tự nhiên</span><span class="feat">Báo cáo tự động</span>
</div>
<div class="img-row">
{img("12_ai_assistant_1772220660860","AI Agent: phân tích bất thường, dự báo sự cố, truy vấn dữ liệu bằng ngôn ngữ tự nhiên tiếng Việt")}
{img("chatbot_internal_page","AI Trợ lý nội bộ: giao diện chat với gợi ý truy vấn, tra cứu nhanh thông tin hệ thống")}
</div>
</section>"""

def section_reports():
    return f"""
<section id="s13">
<div class="sec-header"><span class="sec-icon">📋</span><div><span class="sec-num">Phân hệ 13</span><h2>Báo cáo & Phân tích</h2></div></div>
<p>Hơn 20 mẫu báo cáo định sẵn theo chu kỳ (ngày/tuần/tháng/quý/năm) và tùy chỉnh. Báo cáo xuất được định dạng Excel, PDF và chia sẻ qua email tự động.</p>
<div class="feat-list">
<span class="feat">20+ mẫu báo cáo</span><span class="feat">Lọc theo khoảng thời gian tùy ý</span>
<span class="feat">Xuất Excel / PDF</span><span class="feat">Gửi email tự động</span>
<span class="feat">Biểu đồ tương tác</span><span class="feat">So sánh đa chu kỳ</span>
</div>
{img("11_reports_analysis_1772220651788","Báo cáo & Phân tích: sản lượng, doanh thu, NRW, chất lượng, nhân sự — xuất Excel/PDF, gửi email tự động")}
</section>"""

def section_settings():
    return f"""
<section id="s14">
<div class="sec-header"><span class="sec-icon">⚙️</span><div><span class="sec-num">Phân hệ 14</span><h2>Cài đặt hệ thống & Phân quyền RBAC</h2></div></div>
<p>Cấu hình toàn diện hệ thống qua 6 tab: hệ thống, bảo mật, phân quyền, dashboard, thông báo và tích hợp. Phân quyền theo module và hành động cho từng vai trò.</p>
<div class="img-row">
{img("settings_system_tab","Cài đặt Hệ thống: thông số ngưỡng cảnh báo, cấu hình đơn vị đo, tích hợp SCADA/GIS")}
{img("settings_security_tab","Cài đặt Bảo mật: cấu hình 2FA (TOTP/SMS), session timeout, log đăng nhập")}
</div>
<div class="img-row">
{img("settings_roles_tab","Phân quyền RBAC: ma trận vai trò × module, thay đổi quyền real-time không cần reload")}
{img("settings_dashboard_tab","Cài đặt Dashboard: tuỳ chỉnh widget, layout panel, KPI hiển thị theo người dùng")}
</div>
<div class="img-row">
{img("settings_notifications_tab","Cài đặt Thông báo: SMTP, Zalo OA, webhook, quy tắc cảnh báo tự động")}
{img("settings_integrations_tab","Tích hợp: API keys SCADA, GIS, SMS gateway, e-payment, push notification")}
</div>
</section>"""

def section_rbac():
    return f"""
<section id="rbac-matrix">
<div class="sec-header"><span class="sec-icon">🔑</span><div><span class="sec-num">Phụ lục A</span><h2>Ma trận phân quyền RBAC đầy đủ</h2></div></div>
<p>Hệ thống áp dụng 7 vai trò (roles) với quyền truy cập khác nhau trên 14 module chức năng. Mỗi role được gán ở cấp module với 3 mức: <span class="badge badge-green">Full</span> toàn quyền, <span class="badge badge-yellow" style="color:#111">Edit</span> xem+sửa, <span class="badge" style="background:#90caf9;color:#111">View</span> chỉ xem.</p>

<h3>Mô tả 7 vai trò</h3>
<div class="card-grid">
<div class="card"><div class="card-icon">👨‍💻</div><div class="card-title"><span class="badge badge-red">SYSADMIN</span> Quản trị hệ thống</div><div class="card-body">Toàn quyền tất cả phân hệ, quản lý phân quyền, cấu hình hệ thống</div></div>
<div class="card"><div class="card-icon">👔</div><div class="card-title"><span class="badge badge-purple">DIRECTOR</span> Lãnh đạo</div><div class="card-body">Xem tất cả báo cáo tổng hợp, dashboard điều hành, không chỉnh sửa dữ liệu vận hành</div></div>
<div class="card"><div class="card-icon">🎯</div><div class="card-title"><span class="badge badge-yellow" style="color:#111">DISPATCHER</span> Điều phối viên</div><div class="card-body">Tiếp nhận, phân công sự cố; quản lý lệnh công tác; theo dõi tiến độ</div></div>
<div class="card"><div class="card-icon">🔧</div><div class="card-title"><span class="badge badge-blue">TECHNICIAN</span> Kỹ thuật viên</div><div class="card-body">Vận hành SCADA, xử lý sự cố, cập nhật chất lượng nước, sản xuất</div></div>
<div class="card"><div class="card-icon">💼</div><div class="card-title"><span class="badge badge-cyan">BUSINESS</span> Kinh doanh</div><div class="card-body">Quản lý khách hàng, hợp đồng, hóa đơn, tổng đài CSKH</div></div>
<div class="card"><div class="card-icon">🧑‍🤝‍🧑</div><div class="card-title"><span class="badge badge-green">HR</span> Nhân sự</div><div class="card-body">Quản lý nhân sự, chấm công, KPI, đào tạo và hành chính</div></div>
<div class="card"><div class="card-icon">👁</div><div class="card-title"><span class="badge badge-gray">VIEWER</span> Quan sát viên</div><div class="card-body">Xem dashboard và báo cáo, không chỉnh sửa dữ liệu</div></div>
</div>

<h3>Ma trận quyền 7 Role × 14 Module</h3>
<div style="overflow-x:auto">
<table class="rbac-table">
<thead><tr>
<th class="role-header" style="text-align:left;min-width:160px">Module</th>
<th class="role-header"><span class="badge badge-red">👨‍💻 SYSADMIN</span></th>
<th class="role-header"><span class="badge badge-purple">👔 DIRECTOR</span></th>
<th class="role-header"><span class="badge badge-yellow" style="color:#111">🎯 DISPATCHER</span></th>
<th class="role-header"><span class="badge badge-blue">🔧 TECHNICIAN</span></th>
<th class="role-header"><span class="badge badge-cyan">💼 BUSINESS</span></th>
<th class="role-header"><span class="badge badge-green">🧑 HR</span></th>
<th class="role-header"><span class="badge badge-gray">👁 VIEWER</span></th>
</tr></thead>
<tbody>
{rbac_row("📊 Dashboard","✅ Full","👁 View","👁 View","👁 View","👁 View","👁 View","👁 View")}
{rbac_row("🗺️ GIS Bản đồ","✅ Full","👁 View","👁 View","✏️ Edit","—","—","👁 View")}
{rbac_row("⚡ SCADA","✅ Full","👁 View","👁 View","✅ Full","—","—","—")}
{rbac_row("🚨 Sự cố & Lệnh CT","✅ Full","👁 View","✅ Full","✏️ Update","✏️ Create","—","—")}
{rbac_row("💧 Chất lượng nước","✅ Full","👁 View","👁 View","✅ Full","—","—","👁 View")}
{rbac_row("🏭 Sản xuất & Vật tư","✅ Full","👁 View","👁 View","✅ Full","—","—","—")}
{rbac_row("👥 Kinh doanh & KH","✅ Full","👁 View","👁 Basic","—","✅ Full","—","—")}
{rbac_row("📉 NRW Thất thoát","✅ Full","👁 View","✏️ Order","✅ Full","—","—","—")}
{rbac_row("📞 Tổng đài CSKH","✅ Full","—","✅ Full","—","✅ Full","—","—")}
{rbac_row("👤 Nhân sự (HRM)","✅ Full","👁 Summary","—","—","—","✅ Full","—")}
{rbac_row("🤖 AI Agent / Chatbot","✅ Full","✅ Full","✅ Full","✅ Full","✅ Full","✅ Full","—")}
{rbac_row("🗄️ Data Hub / Logs","✅ Full","—","—","—","—","—","—")}
{rbac_row("📋 Báo cáo Phân tích","✅ Full","✅ Full","👁 View","👁 View","✅ Full","👁 HR Rpt","👁 View")}
{rbac_row("⚙️ Cài đặt Hệ thống","✅ Full","📊 Dash","—","—","—","—","—")}
</tbody>
</table>
</div>

<h3>Ví dụ sidebar theo vai trò</h3>
<div class="img-row" style="grid-template-columns:1fr 1fr 1fr">
{img("sidebar_sysadmin","SYSADMIN — hiển thị đầy đủ 14 phân hệ")}
{img("sidebar_business","BUSINESS — Dashboard, Kinh doanh, Sự cố, CSKH, AI")}
{img("sidebar_hr","HR — Dashboard, Nhân sự, AI")}
</div>
</section>"""

def section_tech():
    return """
<section id="tech">
<div class="sec-header"><span class="sec-icon">🏗️</span><div><span class="sec-num">Phụ lục B</span><h2>Kiến trúc kỹ thuật</h2></div></div>
<div class="card-grid">
<div class="card"><div class="card-icon">🌐</div><div class="card-title">Frontend</div><div class="card-body">HTML5 · Vanilla JavaScript (ES2022)<br>CSS Custom Properties Design System<br>SPA Router (hash-based)<br>Chart.js 4.4 · Leaflet.js 1.9</div></div>
<div class="card"><div class="card-icon">🔐</div><div class="card-title">Bảo mật</div><div class="card-body">RBAC 7 roles client-side<br>2FA: TOTP / SMS / Email<br>Session localStorage + token<br>TLS 1.3 (production)</div></div>
<div class="card"><div class="card-icon">🗺️</div><div class="card-title">GIS</div><div class="card-body">OpenStreetMap tiles<br>Leaflet.js vector layers<br>GeoJSON pipelines<br>Marker clustering</div></div>
<div class="card"><div class="card-icon">📡</div><div class="card-title">SCADA</div><div class="card-body">WebSocket real-time data<br>Polling fallback (30s)<br>Modbus TCP adapter ready<br>Historical CSV import</div></div>
<div class="card"><div class="card-icon">🤖</div><div class="card-title">AI Layer</div><div class="card-body">Leak detection algorithm<br>Time-series anomaly (Z-score)<br>NLP intent classifier<br>Rule-based recommendation</div></div>
<div class="card"><div class="card-icon">📱</div><div class="card-title">Customer App</div><div class="card-body">Mobile-first SPA (500px)<br>CSS Variable dark theme<br>6 phương thức thanh toán<br>PWA-ready (offline cache)</div></div>
</div>
<div class="info-box">
<strong>Lộ trình phát triển:</strong> Giai đoạn 2 bổ sung REST API backend (Node.js/FastAPI), WebSocket SCADA gateway, mobile native app (React Native), và tích hợp AI cloud (GPT-4/Gemini) cho phân tích nâng cao.
</div>
</section>"""

def section_customer():
    return f"""
<section id="s15">
<div class="sec-header"><span class="sec-icon">📱</span><div><span class="sec-num">Phân hệ 15</span><h2>Smart Water Care – Ứng dụng khách hàng</h2></div></div>
<p>Ứng dụng di động (mobile-first SPA) dành cho khách hàng sử dụng nước của Quawaco. Giao diện tối hiện đại, 10 màn hình chức năng, thanh toán trực tuyến và AI tư vấn tiết kiệm nước.</p>

<h3 id="s15-login">Đăng nhập</h3>
{img("customer_login_page","Đăng nhập ứng dụng khách hàng: SĐT/Mã hợp đồng + OTP 6 chữ số tự động nhảy ô")}

<h3 id="s15-home">Trang chủ & Tổng quan</h3>
{img("customer_home_page","Trang chủ: thẻ thông tin KH, cảnh báo rò rỉ AI, số liệu tổng quan, phím tắt dịch vụ")}

<h3 id="s15-consumption">Tiêu thụ nước</h3>
{img("customer_consumption_chart","Tiêu thụ nước: biểu đồ so sánh tháng, AI phân tích hành vi dùng nước, gợi ý tiết kiệm")}

<h3 id="s15-bills">Hóa đơn & Thanh toán</h3>
<div class="img-row">
{img("customer_bills_overview","Hóa đơn: chi tiết bậc thang giá nước, số tiền theo từng bậc, lịch sử 6 tháng")}
{img("customer_bills_payment_modal","Thanh toán: 6 phương thức (VNPay, MoMo, Zalo, ATM, Internet Banking, Trả tiền mặt), QR code")}
</div>

<h3 id="s15-incident">Báo sự cố</h3>
{img("customer_incident_form","Báo sự cố: form với ảnh + GPS tự động, AI phân loại mức độ, theo dõi trạng thái xử lý")}

<h3 id="s15-quality">Chất lượng nước</h3>
{img("customer_quality_page","Chất lượng nước tại địa chỉ KH: 6 chỉ tiêu với gauge trực quan, so sánh QCVN 01:2009")}

<h3 id="s15-services">Dịch vụ trực tuyến</h3>
{img("customer_services_page","Dịch vụ: đăng ký lắp mới, chuyển địa điểm, thay đồng hồ — e-form nộp online 24/7")}

<h3 id="s15-chatbot">AI Trợ lý khách hàng</h3>
{img("customer_chatbot_page","AI Chatbot: trả lời tự động câu hỏi về hóa đơn, lịch đọc chỉ số, quy trình đăng ký")}

<h3>Thông báo</h3>
{img("customer_notifications_page","Thông báo: lịch cúp nước, cảnh báo tiêu thụ bất thường, nhắc nộp hóa đơn")}

<h3 id="s15-profile">Hồ sơ & Tài khoản</h3>
{img("customer_profile_page","Hồ sơ KH: thông tin cá nhân, hợp đồng, đổi mật khẩu, cài đặt thông báo, đăng xuất")}
</section>"""

def build_html():
    body = f"""
<div id="cover" class="cover">
<div class="cover-inner">
<p style="font-size:11px;letter-spacing:2px;color:var(--primary);font-family:'Roboto Mono',monospace;margin-bottom:12px">QUAWACO · IOC CENTER · V1.0 · 2026</p>
<h1>Đặc tả Tính năng & Giới thiệu Hệ thống</h1>
<p style="font-size:1.1rem;color:#b0c8e0;max-width:720px;margin:.5rem 0 1.5rem">Trung tâm Điều hành Thông minh – Công ty Cổ phần Nước sạch Quảng Ninh (Quawaco). Tài liệu này trình bày đầy đủ các tính năng, phân hệ, kiến trúc và phân quyền của hệ thống IOC Center và ứng dụng khách hàng Smart Water Care.</p>
<div class="cover-meta">
<span class="tag" style="background:#ff1744;color:#fff">🔴 14 Phân hệ IOC</span>
<span class="tag" style="background:#0050cc;color:#fff">🔵 7 Vai trò RBAC</span>
<span class="tag" style="background:#00e676;color:#111">🟢 Smart Water Care App</span>
<span class="tag" style="background:#ffca28;color:#111">🟡 AI-Powered Analytics</span>
<span class="tag" style="background:#7c3aed;color:#fff">🟣 Real-time SCADA/GIS</span>
</div>
<p style="margin-top:1.5rem;font-size:11px;color:var(--muted)">Phiên bản 1.0 · Tháng 02/2026 · <em>Tài liệu nội bộ – Bảo mật</em></p>
</div>
</div>
{TOC}
<main>
{section_login()}
{section_dashboard()}
{section_gis()}
{section_scada()}
{section_incidents()}
{section_quality()}
{section_production()}
{section_business()}
{section_callcenter()}
{section_nrw()}
{section_hrm()}
{section_ai()}
{section_reports()}
{section_settings()}
{section_customer()}
{section_rbac()}
{section_tech()}
<footer style="text-align:center;padding:40px 0;color:var(--muted);font-size:12px;border-top:1px solid var(--border)">
<p>© 2026 Công ty Cổ phần Nước sạch Quảng Ninh (Quawaco) · IOC Center v1.0</p>
<p style="margin-top:4px">Tài liệu bảo mật – Chỉ sử dụng nội bộ và thuyết trình cho đối tác</p>
</footer>
</main>
"""
    return f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Quawaco IOC Center – Đặc tả Tính năng v1.0</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>{CSS}</style>
</head>
<body>{body}</body>
</html>"""

html = build_html()
OUT.write_text(html, encoding="utf-8")
print(f"DONE: {OUT}")
print(f"Size: {OUT.stat().st_size // 1024} KB")
