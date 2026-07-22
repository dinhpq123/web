// ── HADIWA SHARED EXPORT UTILITIES ────────────────────────────────
// Provides exportToCsv() and exportToPrintWindow() for all pages.
// Usage:
//   window.HADIWA_EXPORT.csv('filename.csv', rows2d)
//   window.HADIWA_EXPORT.print(title, htmlBodyContent)
// ─────────────────────────────────────────────────────────────────

window.HADIWA_EXPORT = {

  /** Download a CSV file with BOM (Excel-UTF8 compatible) */
  csv: function(filename, rows) {
    try {
      const bom = '\uFEFF';
      const content = rows.map(r => r.map(c => {
        const s = String(c === null || c === undefined ? '' : c).replace(/"/g, '""');
        return /[,\n\r"]/.test(s) ? `"${s}"` : s;
      }).join(',')).join('\n');
      const blob = new Blob([bom + content], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`✅ Đã tải xuống: ${filename}`);
    } catch(e) {
      showToast('⚠ Xuất Excel thất bại: ' + e.message);
    }
  },

  /** Open a print-ready HTML window for PDF printing */
  print: function(title, bodyHtml, subtitle) {
    const dateStr = new Date().toLocaleDateString('vi-VN');
    const w = window.open('', '_blank', 'width=960,height=750');
    if (!w) { showToast('⚠ Cho phép popup để xuất PDF!'); return; }
    w.document.write(`<!DOCTYPE html><html lang="vi"><head>
    <meta charset="UTF-8"><title>${title}</title>
    <style>
      *{box-sizing:border-box}
      body{font-family:Arial,sans-serif;padding:28px 36px;color:#222;max-width:900px;margin:0 auto;font-size:13px}
      h1{color:#1a237e;font-size:20px;margin-bottom:2px}
      .subtitle{color:#555;font-size:12px;margin-bottom:20px}
      h2{color:#0d47a1;font-size:14px;margin-top:22px;border-bottom:1px solid #ccc;padding-bottom:4px}
      table{width:100%;border-collapse:collapse;margin-top:8px;font-size:12px}
      th{background:#1a237e;color:#fff;padding:7px 10px;text-align:left}
      td{padding:6px 10px;border-bottom:1px solid #e8e8e8}
      tr:nth-child(even){background:#f7f7f7}
      .badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700}
      .badge-green{background:#e8f5e9;color:#2e7d32}
      .badge-red{background:#ffebee;color:#c62828}
      .badge-yellow{background:#fff8e1;color:#e65100}
      .footer{font-size:10px;color:#999;text-align:center;margin-top:28px;border-top:1px solid #eee;padding-top:10px}
      @media print{.no-print{display:none}body{padding:15px}}
    </style></head><body>
    <h1>${title}</h1>
    <div class="subtitle">${subtitle || `Chi cục Thủy lợi & PCTT Hà Nội`} — Ngày xuất: ${dateStr}</div>
    ${bodyHtml}
    <div class="footer">Tài liệu được tạo tự động bởi Hệ thống HADIWA IOC — ${dateStr}</div>
    <script>setTimeout(()=>window.print(),350);</script>
    </body></html>`);
    w.document.close();
    showToast('✅ Đã mở cửa sổ in!');
  },
};

// ── IRRIGATION ASSETS EXPORT ───────────────────────────────────────
window.exportAssetsExcel = function() {
  showToast('📊 Đang chuẩn bị...');
  setTimeout(() => {
    const assets = window._irrigationAssets || [];
    const rows = [
      ['BÁO CÁO HỒ SƠ CÔNG TRÌNH THỦY LỢI'],
      ['Kỳ báo cáo: ' + new Date().toLocaleDateString('vi-VN')],
      [],
      ['Mã CT', 'Tên Công trình', 'Loại', 'Địa bàn', 'Đơn vị QL', 'Năm XD', 'Công suất', 'Kiểm tra cuối', 'Trạng thái'],
      ...assets.map(a => [a.id, a.name, a.type, a.district || '—', a.unit || '—', a.yearBuilt || '—', a.capacity || '—', a.lastInspect || '—', a.status]),
    ];
    window.HADIWA_EXPORT.csv(`HoSo_CongTrinhThuyLoi_${new Date().toISOString().slice(0,10)}.csv`, rows);
  }, 400);
};

window.exportAssetsPdf = function() {
  showToast('📄 Đang tạo PDF...');
  const assets = window._irrigationAssets || [];
  const rows = assets.map(a => `<tr><td>${a.id}</td><td>${a.name}</td><td>${a.type}</td><td>${a.district||'—'}</td><td>${a.capacity||'—'}</td><td>${a.status}</td></tr>`).join('');
  setTimeout(() => window.HADIWA_EXPORT.print(
    'HỒ SƠ CÔNG TRÌNH THỦY LỢI',
    `<h2>Danh sách công trình</h2>
    <table><thead><tr><th>Mã CT</th><th>Tên công trình</th><th>Loại</th><th>Địa bàn</th><th>Công suất</th><th>Trạng thái</th></tr></thead>
    <tbody>${rows}</tbody></table>`
  ), 500);
};

// ── LOG PAGE EXPORT ─────────────────────────────────────────────────
window.exportLogExcel = function() {
  showToast('📊 Đang xuất nhật ký...');
  setTimeout(() => {
    const logs = DATA.auditLog || DATA.logs || [];
    const rows = [
      ['NHẬT KÝ THAO TÁC HỆ THỐNG — ' + new Date().toLocaleDateString('vi-VN')],
      [],
      ['Thời gian', 'Người thực hiện', 'Hành động', 'Đối tượng', 'Trạng thái', 'IP'],
      ...logs.slice(0,200).map(l => [l.time || l.timestamp || '—', l.user || l.by || '—', l.action || '—', l.target || l.module || '—', l.status || 'ok', l.ip || '—']),
    ];
    window.HADIWA_EXPORT.csv(`NhatKy_ThaoTac_${new Date().toISOString().slice(0,10)}.csv`, rows);
  }, 400);
};

window.exportLogPdf = function() {
  showToast('📄 Đang tạo PDF nhật ký...');
  const logs = (DATA.auditLog || DATA.logs || []).slice(0,50);
  const rows = logs.map(l => `<tr><td>${l.time||l.timestamp||'—'}</td><td>${l.user||l.by||'—'}</td><td>${l.action||'—'}</td><td>${l.status||'ok'}</td></tr>`).join('');
  setTimeout(() => window.HADIWA_EXPORT.print(
    'NHẬT KÝ THAO TÁC HỆ THỐNG',
    `<h2>Danh sách nhật ký (50 gần nhất)</h2>
    <table><thead><tr><th>Thời gian</th><th>Người dùng</th><th>Hành động</th><th>Trạng thái</th></tr></thead>
    <tbody>${rows}</tbody></table>`
  ), 500);
};

// ── HRM EXPORT ──────────────────────────────────────────────────────
window.exportHrmExcel = function(type) {
  showToast('📊 Đang xuất...');
  setTimeout(() => {
    if (type === 'attendance') {
      const rows = [
        ['BẢNG CHẤM CÔNG THÁNG 3/2026'],
        [],
        ['Mã NV', 'Họ tên', 'Phòng ban', 'Ngày công', 'Công chuẩn', 'Tỷ lệ', 'Ca trực đặc biệt'],
        ...(DATA.employees || []).map(e => [e.id, e.name, e.dept, e.attendance || 22, 26, Math.round((e.attendance||22)/26*100)+'%', e.nightShifts || 0]),
      ];
      window.HADIWA_EXPORT.csv(`ChamCong_T3-2026_${new Date().toISOString().slice(0,10)}.csv`, rows);
    } else if (type === 'kpi') {
      const rows = [
        ['BÁO CÁO KPI NHÂN VIÊN THÁNG 3/2026'],
        [],
        ['Mã NV', 'Họ tên', 'Phòng ban', 'Điểm KPI', 'Xếp loại', 'Ghi chú'],
        ...(DATA.employees || []).map(e => [e.id, e.name, e.dept, e.kpi || 85, e.kpi>=90?'Xuất sắc':e.kpi>=80?'Tốt':'Đạt', '']),
      ];
      window.HADIWA_EXPORT.csv(`KPI_NhanVien_T3-2026_${new Date().toISOString().slice(0,10)}.csv`, rows);
    }
  }, 400);
};

window.exportHrmPdf = function(type) {
  showToast('📄 Đang tạo PDF...');
  const employees = DATA.employees || [];
  const rows = employees.slice(0,30).map(e => `<tr><td>${e.id}</td><td>${e.name}</td><td>${e.dept}</td><td>${e.position||'—'}</td><td class="badge ${e.status==='active'?'badge-green':e.status==='leave'?'badge-yellow':'badge-red'}">${e.status==='active'?'Đang làm':'Nghỉ phép'}</td></tr>`).join('');
  setTimeout(() => window.HADIWA_EXPORT.print(
    'DANH SÁCH CÁN BỘ CÔNG NHÂN VIÊN',
    `<h2>Danh sách CBCNV</h2>
    <table><thead><tr><th>Mã NV</th><th>Họ tên</th><th>Phòng ban</th><th>Chức vụ</th><th>Trạng thái</th></tr></thead>
    <tbody>${rows}</tbody></table>`
  ), 500);
};

// ── FOUR-ON-SITE EXPORT ─────────────────────────────────────────────
window.exportFourOnSiteExcel = function() {
  showToast('📊 Đang xuất phương án 4 tại chỗ...');
  setTimeout(() => {
    const data = window._fourOnSiteData || [];
    const rows = [
      ['PHƯƠNG ÁN 4 TẠI CHỖ — ' + new Date().toLocaleDateString('vi-VN')],
      ['Chi cục Thủy lợi & PCTT Hà Nội'],
      [],
      ['Hạng mục', 'Chỉ tiêu', 'Hiện có', 'Cần bổ sung', 'Ghi chú'],
      ['Chỉ huy tại chỗ', 'BCH PCTT cơ sở', '125 ban', '—', 'Đã kiện toàn'],
      ['Nhân lực tại chỗ', 'Lực lượng xung kích', '18,500 người', '—', 'Đã huấn luyện'],
      ['Vật tư tại chỗ', 'Bao cát', '850,000 bao', '150,000 bao', 'Cần bổ sung Q2'],
      ['Phương tiện tại chỗ', 'Xuồng cứu hộ', '245 chiếc', '20 chiếc', 'Huyện Ba Vì'],
      ['Hậu cần tại chỗ', 'Lương thực dự trữ', '2,500 tấn', '—', 'Đủ 30 ngày'],
    ];
    window.HADIWA_EXPORT.csv(`PhuongAn4TaiCho_${new Date().toISOString().slice(0,10)}.csv`, rows);
  }, 400);
};

// ── DATAHUB EXPORT ─────────────────────────────────────────────────
window.exportDatahubExcel = function() {
  showToast('📊 Đang xuất dữ liệu...');
  setTimeout(() => {
    const stations = DATA.stations || [];
    const rows = [
      ['DỮ LIỆU TRẠM ĐO — ' + new Date().toLocaleDateString('vi-VN')],
      [],
      ['Mã trạm', 'Tên trạm', 'Loại', 'Mực nước (m)', 'Lượng mưa (mm)', 'Trạng thái', 'Cập nhật'],
      ...stations.map(s => [s.id, s.name, s.type, s.level||'—', s.rainfall||'—', s.status, s.lastUpdate||'—']),
    ];
    window.HADIWA_EXPORT.csv(`DataHub_TramDo_${new Date().toISOString().slice(0,10)}.csv`, rows);
  }, 400);
};

// ── PLANTS EXPORT ───────────────────────────────────────────────────
window.exportPlantsExcel = function() {
  showToast('📊 Đang xuất danh sách nhà máy...');
  setTimeout(() => {
    const rows = [
      ['DANH SÁCH NHÀ MÁY / CƠ SỞ SẢN XUẤT — ' + new Date().toLocaleDateString('vi-VN')],
      [],
      ['Mã', 'Tên nhà máy', 'Địa điểm', 'Công suất', 'Sản lượng', 'Trạng thái'],
    ];
    window.HADIWA_EXPORT.csv(`DanhSach_NhaMay_${new Date().toISOString().slice(0,10)}.csv`, rows);
  }, 400);
};

// ── SCHEDULER EXPORT (supplement exportSchedulerPdf) ────────────────
window.exportSchedulerExcel = function() {
  showToast('📊 Đang xuất lịch vận hành...');
  setTimeout(() => {
    const stations = DATA.pumpStations || [];
    const profiles = DATA.pumpProfiles || [];
    const rows = [
      ['LỊCH VẬN HÀNH CỐNG/BƠM — ' + new Date().toLocaleDateString('vi-VN')],
      [],
      ['Kịch bản', 'Trạm', 'Ca vận hành'],
      ...profiles.flatMap(p => stations.map(s => {
        const sched = (p.schedules[s.id]||[]).map(iv=>`${iv[0]}h-${iv[1]}h`).join('; ') || 'Không vận hành';
        return [p.name, s.name, sched];
      })),
    ];
    window.HADIWA_EXPORT.csv(`LichVanHanh_${new Date().toISOString().slice(0,10)}.csv`, rows);
  }, 400);
};
