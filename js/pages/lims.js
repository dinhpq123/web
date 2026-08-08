// ── LIMS – LABORATORY INFORMATION MANAGEMENT SYSTEM ──────────────
// Tabs: Tổng quan | Quản lý mẫu | Kết quả XN | Lịch kiểm định | AI Dự báo
let limsTab = 'overview';
const limsPageState = {
  samples: 1,
  inspection: 1,
  calib: 1,
  pageSize: 8
};
let limsSearchQuery = '';
let limsFilterPlant = 'all';
let limsFilterStatus = 'all';

// ── MOCK DATA ─────────────────────────────────────────────────────
const LIMS_DATA = {
  // Water quality thresholds (QCVN 01-1:2018/BYT)
  limits: {
    pH: { min: 6.5, max: 8.5, unit: '' },
    turbidity: { min: 0, max: 2, unit: 'NTU' },
    chlorine: { min: 0.2, max: 1.0, unit: 'mg/l' },
    coliform: { min: 0, max: 0, unit: 'CFU/100ml' },
    arsenic: { min: 0, max: 0.01, unit: 'mg/l' },
    nitrate: { min: 0, max: 50, unit: 'mg/l' },
    conductivity: { min: 0, max: 1500, unit: 'µS/cm' },
    hardness: { min: 0, max: 350, unit: 'mg/l' },
  },

  // Sampling sites (thí nghiệm tại nhà máy)
  sites: [
    { id: 'NM-01-IN', name: 'Hồ Suối Hai – Đầu vào', lat: 21.135, lng: 105.375, zone: 'PLANT' },
    { id: 'NM-01-OUT', name: 'Hồ Suối Hai – Đầu ra', lat: 21.136, lng: 105.376, zone: 'PLANT' },
    { id: 'NM-02-IN', name: 'Hồ Đồng Mô – Đầu vào', lat: 21.085, lng: 105.452, zone: 'PLANT' },
    { id: 'NM-02-OUT', name: 'Hồ Đồng Mô – Đầu ra', lat: 21.086, lng: 105.453, zone: 'PLANT' },
    { id: 'NM-03-IN', name: 'Trạm bơm Xuân Canh – Đầu vào', lat: 21.095, lng: 105.873, zone: 'PLANT' },
    { id: 'NM-03-OUT', name: 'Trạm bơm Xuân Canh – Đầu ra', lat: 21.096, lng: 105.874, zone: 'PLANT' },
  ],

  // Recent sample batches (tại nhà máy, phục vụ điều chỉnh hoá chất)
  samples: [
    { id: 'SM-2026031101', siteId: 'NM-01-OUT', siteName: 'Hồ Suối Hai – Đầu ra', time: '2026-03-01 08:00', collector: 'Nguyễn Văn An', status: 'alert', results: { pH: 7.2, turbidity: 0.8, chlorine: 0.1, coliform: 0, arsenic: 0.005, nitrate: 12, conductivity: 480, hardness: 185 } },
    { id: 'SM-2026031102', siteId: 'NM-01-IN', siteName: 'Hồ Suối Hai – Đầu vào', time: '2026-03-01 08:15', collector: 'Trần Thị Bình', status: 'ok', results: { pH: 7.0, turbidity: 2.8, chlorine: 0.0, coliform: 2, arsenic: 0.006, nitrate: 22, conductivity: 600, hardness: 220 } },
    { id: 'SM-2026031103', siteId: 'NM-02-OUT', siteName: 'Hồ Đồng Mô – Đầu ra', time: '2026-03-01 09:00', collector: 'Lê Minh Cường', status: 'ok', results: { pH: 7.4, turbidity: 0.5, chlorine: 0.55, coliform: 0, arsenic: 0.003, nitrate: 9, conductivity: 430, hardness: 165 } },
    { id: 'SM-2026031104', siteId: 'NM-02-IN', siteName: 'Hồ Đồng Mô – Đầu vào', time: '2026-03-01 09:20', collector: 'Phạm Quốc Hùng', status: 'pending', results: null },
    { id: 'SM-2026031105', siteId: 'NM-03-OUT', siteName: 'Trạm bơm Xuân Canh – Đầu ra', time: '2026-03-01 10:30', collector: 'Hoàng Thi Mai', status: 'ok', results: { pH: 7.3, turbidity: 0.6, chlorine: 0.48, coliform: 0, arsenic: 0.004, nitrate: 14, conductivity: 460, hardness: 178 } },
    { id: 'SM-2026030901', siteId: 'NM-01-OUT', siteName: 'Hồ Suối Hai – Đầu ra', time: '2026-02-28 08:00', collector: 'Nguyễn Văn An', status: 'ok', results: { pH: 7.3, turbidity: 0.7, chlorine: 0.52, coliform: 0, arsenic: 0.004, nitrate: 11, conductivity: 455, hardness: 172 } },
    { id: 'SM-2026030902', siteId: 'NM-01-IN', siteName: 'Hồ Suối Hai – Đầu vào', time: '2026-02-28 08:30', collector: 'Nguyễn Văn An', status: 'ok', results: { pH: 7.1, turbidity: 1.5, chlorine: 0.0, coliform: 1, arsenic: 0.005, nitrate: 15, conductivity: 490, hardness: 190 } },
    { id: 'SM-2026030903', siteId: 'NM-02-OUT', siteName: 'Hồ Đồng Mô – Đầu ra', time: '2026-02-28 09:00', collector: 'Trần Thị Bình', status: 'ok', results: { pH: 7.2, turbidity: 0.6, chlorine: 0.5, coliform: 0, arsenic: 0.004, nitrate: 10, conductivity: 440, hardness: 170 } },
    { id: 'SM-2026030904', siteId: 'NM-03-OUT', siteName: 'Trạm bơm Xuân Canh – Đầu ra', time: '2026-02-28 10:00', collector: 'Lê Minh Cường', status: 'ok', results: { pH: 7.4, turbidity: 0.5, chlorine: 0.45, coliform: 0, arsenic: 0.003, nitrate: 12, conductivity: 450, hardness: 175 } },
    { id: 'SM-2026030801', siteId: 'NM-01-OUT', siteName: 'Hồ Suối Hai – Đầu ra', time: '2026-02-27 08:00', collector: 'Phạm Quốc Hùng', status: 'ok', results: { pH: 7.3, turbidity: 0.7, chlorine: 0.6, coliform: 0, arsenic: 0.004, nitrate: 11, conductivity: 460, hardness: 180 } },
    { id: 'SM-2026030802', siteId: 'NM-02-OUT', siteName: 'Hồ Đồng Mô – Đầu ra', time: '2026-02-27 09:00', collector: 'Hoàng Thi Mai', status: 'ok', results: { pH: 7.2, turbidity: 0.5, chlorine: 0.55, coliform: 0, arsenic: 0.003, nitrate: 9, conductivity: 440, hardness: 170 } },
    { id: 'SM-2026030701', siteId: 'NM-01-OUT', siteName: 'Hồ Suối Hai – Đầu ra', time: '2026-02-26 08:00', collector: 'Nguyễn Văn An', status: 'ok', results: { pH: 7.3, turbidity: 0.6, chlorine: 0.58, coliform: 0, arsenic: 0.004, nitrate: 11, conductivity: 450, hardness: 175 } },
    { id: 'SM-2026030702', siteId: 'NM-03-OUT', siteName: 'Trạm bơm Xuân Canh – Đầu ra', time: '2026-02-26 10:00', collector: 'Trần Thị Bình', status: 'ok', results: { pH: 7.4, turbidity: 0.6, chlorine: 0.48, coliform: 0, arsenic: 0.003, nitrate: 12, conductivity: 460, hardness: 180 } },
    { id: 'SM-2026030601', siteId: 'NM-01-OUT', siteName: 'Hồ Suối Hai – Đầu ra', time: '2026-02-25 08:00', collector: 'Lê Minh Cường', status: 'ok', results: { pH: 7.2, turbidity: 0.8, chlorine: 0.52, coliform: 0, arsenic: 0.005, nitrate: 13, conductivity: 470, hardness: 185 } },
    { id: 'SM-2026030602', siteId: 'NM-02-OUT', siteName: 'Hồ Đồng Mô – Đầu ra', time: '2026-02-25 09:00', collector: 'Phạm Quốc Hùng', status: 'ok', results: { pH: 7.3, turbidity: 0.5, chlorine: 0.55, coliform: 0, arsenic: 0.004, nitrate: 10, conductivity: 445, hardness: 172 } },
    { id: 'SM-2026030501', siteId: 'NM-01-OUT', siteName: 'Hồ Suối Hai – Đầu ra', time: '2026-02-24 08:00', collector: 'Hoàng Thi Mai', status: 'ok', results: { pH: 7.3, turbidity: 0.9, chlorine: 0.5, coliform: 0, arsenic: 0.005, nitrate: 14, conductivity: 485, hardness: 190 } },
    { id: 'SM-2026030502', siteId: 'NM-03-OUT', siteName: 'Trạm bơm Xuân Canh – Đầu ra', time: '2026-02-24 10:00', collector: 'Nguyễn Văn An', status: 'ok', results: { pH: 7.4, turbidity: 0.6, chlorine: 0.46, coliform: 0, arsenic: 0.004, nitrate: 12, conductivity: 465, hardness: 182 } },
    { id: 'SM-2026030401', siteId: 'NM-01-OUT', siteName: 'Hồ Suối Hai – Đầu ra', time: '2026-02-23 08:00', collector: 'Trần Thị Bình', status: 'ok', results: { pH: 7.2, turbidity: 0.7, chlorine: 0.58, coliform: 0, arsenic: 0.004, nitrate: 11, conductivity: 450, hardness: 175 } },
    { id: 'SM-2026030402', siteId: 'NM-02-OUT', siteName: 'Hồ Đồng Mô – Đầu ra', time: '2026-02-23 09:00', collector: 'Lê Minh Cường', status: 'ok', results: { pH: 7.3, turbidity: 0.4, chlorine: 0.62, coliform: 0, arsenic: 0.003, nitrate: 8, conductivity: 420, hardness: 165 } },
    { id: 'SM-2026030301', siteId: 'NM-01-OUT', siteName: 'Hồ Suối Hai – Đầu ra', time: '2026-02-22 08:00', collector: 'Phạm Quốc Hùng', status: 'ok', results: { pH: 7.3, turbidity: 0.8, chlorine: 0.55, coliform: 0, arsenic: 0.004, nitrate: 12, conductivity: 470, hardness: 180 } },
  ],

  // Calibration/accreditation schedule
  calibrations: [
    { id: 'CAL-001', equipment: 'Máy đo pH (Orion 5-Star)', lastDate: '2025-12-10', nextDate: '2026-06-10', agency: 'VMI – Viện Đo lường', status: 'ok', cert: 'VMI-2025-1234' },
    { id: 'CAL-002', equipment: 'Máy đo độ đục (HACH 2100Q)', lastDate: '2025-11-15', nextDate: '2026-05-15', agency: 'Sở NN&PTNT Hà Nội', status: 'warning', cert: 'SHN-2025-887' },
    { id: 'CAL-003', equipment: 'Máy phân tích Clo dư', lastDate: '2026-01-20', nextDate: '2026-07-20', agency: 'Viện Vệ sinh Dịch tễ', status: 'ok', cert: 'VVDT-2026-021' },
    { id: 'CAL-004', equipment: 'ICP-MS (phân tích kim loại)', lastDate: '2025-09-05', nextDate: '2026-03-05', agency: 'Quatest 1', status: 'overdue', cert: 'Q1-2025-456' },
    { id: 'CAL-005', equipment: 'Tủ cấy vi sinh', lastDate: '2026-02-01', nextDate: '2026-08-01', agency: 'Chi cục Thú y & PCTT Hà Nội', status: 'ok', cert: 'CCHN-2026-099' },
    { id: 'CAL-006', equipment: 'Máy đo nồng độ Nitrat', lastDate: '2025-10-12', nextDate: '2026-04-12', agency: 'Quatest 1', status: 'ok', cert: 'Q1-2025-667' },
    { id: 'CAL-007', equipment: 'Máy đo độ dẫn điện', lastDate: '2025-08-20', nextDate: '2026-02-20', agency: 'VMI', status: 'warning', cert: 'VMI-2025-998' },
    { id: 'CAL-008', equipment: 'Bể ổn nhiệt PTN', lastDate: '2026-01-05', nextDate: '2027-01-05', agency: 'Sở KH&CN', status: 'ok', cert: 'SQN-2026-012' },
    { id: 'CAL-009', equipment: 'Cân phân tích điện tử', lastDate: '2025-12-15', nextDate: '2026-12-15', agency: 'VMI', status: 'ok', cert: 'VMI-2025-004' },
    { id: 'CAL-010', equipment: 'Máy ly tâm cao tốc', lastDate: '2025-07-10', nextDate: '2026-07-10', agency: 'Trung tâm Thiết bị', status: 'ok', cert: 'TB-2025-554' },
    { id: 'CAL-011', equipment: 'Máy quang phổ UV-VIS', lastDate: '2025-06-20', nextDate: '2026-06-20', agency: 'Quatest 1', status: 'ok', cert: 'Q1-2025-112' },
    { id: 'CAL-012', equipment: 'Máy đo Oxy hòa tan (DO)', lastDate: '2026-02-15', nextDate: '2026-08-15', agency: 'Chi cục Thủy lợi Hà Nội', status: 'ok', cert: 'CCTL-2026-443' },
    { id: 'CAL-013', equipment: 'Bộ chưng cất Kjeldahl', lastDate: '2025-09-30', nextDate: '2026-09-30', agency: 'VMI', status: 'ok', cert: 'VMI-2025-789' },
    { id: 'CAL-014', equipment: 'Máy đo nhu cầu Oxy (BOD)', lastDate: '2025-08-11', nextDate: '2026-02-11', agency: 'Sở Y tế', status: 'warning', cert: 'SYT-2025-332' },
    { id: 'CAL-015', equipment: 'Kính hiển vi điện tử', lastDate: '2025-05-05', nextDate: '2026-05-05', agency: 'Quatest 1', status: 'ok', cert: 'Q1-2025-001' },
  ],

  // Trend data (turbidity last 7 days)
  trends: {
    dates: ['24/02', '25/02', '26/02', '27/02', '28/02', '01/03'],
    turbidity: [0.6, 0.7, 0.9, 1.1, 0.8, 0.8],
    chlorine: [0.55, 0.50, 0.45, 0.40, 0.42, 0.10],
    pH: [7.3, 7.2, 7.4, 7.3, 7.3, 7.2],
  },

  // AI recommendations (Dosing Optimization focus)
  aiRecommendations: [
    {
      level: 'critical',
      title: 'Tối ưu hóa Clo dư đầu ra Hồ Suối Hai',
      detail: 'Độ đục đầu vào tăng (2.8 NTU) kèm nhu cầu xử lý vi sinh cao. Mô hình AI nhận thấy Clo dư hiện tại 0.1 mg/l có nguy cơ tái nhiễm.',
      action: 'AI gợi ý: Tăng liều lượng Clo lỏng từ 1.2kg/h lên 1.5kg/h. Tần suất thí nghiệm kiểm chứng: 30 phút/lần trong 4h tới.',
      input: 'Turb: 2.8, pH: 7.0',
      dosing: 'PAC: 15ppm, Clo: 1.5kg/h',
      predictedOutput: 'Clo dư: 0.55 mg/l, Coliform: 0',
      savings: 'Giảm 5% Clo so với phương pháp thử/sai truyền thống',
      date: '2026-03-01 08:15', site: 'NM-01'
    },
    {
      level: 'warning',
      title: 'Điều chỉnh keo tụ PAC tại Hồ Đồng Mô',
      detail: 'Độ đục đầu vào ổn định nhưng thời gian lắng chậm hơn bình thường. Cần điều chỉnh để tránh lãng phí hóa chất PAC.',
      action: 'AI gợi ý: Giảm liều lượng PAC xuống 12ppm thay vì 15ppm. Kéo dài thời gian khuấy chậm thêm 2 phút.',
      input: 'Turb: 0.8, pH: 7.4',
      dosing: 'PAC: 12ppm (-3ppm)',
      predictedOutput: 'Turbidity: 0.4 NTU',
      savings: 'Tiết kiệm 20kg PAC/ngày',
      date: '2026-03-01 09:00', site: 'NM-02'
    },
    {
      level: 'info',
      title: 'Phân tích hiệu quả hóa chất Trạm bơm Xuân Canh',
      detail: 'Dữ liệu vận hành tháng 2 cho thấy tiềm năng tối ưu hóa pH đầu vào để tăng hiệu quả keo tụ.',
      action: 'AI gợi ý: Duy trì pH đầu vào ở mức 7.2 bằng vôi bột để tối ưu hóa hiệu quả PAC. Tăng độ tin cậy kết quả lên 92%.',
      input: 'pH: 7.4 -> AI đề xuất 7.2',
      dosing: 'Vôi: +2kg/h, PAC: -2ppm',
      predictedOutput: 'Chất lượng ổn định hơn, giảm cặn lơ lửng',
      savings: 'Tối ưu hóa quy trình xử lý 10%',
      date: '2026-03-01 10:30', site: 'NM-03'
    },
  ],
  // Water authority inspections
  waterInspections: {
    history: [
      { id: 'WI-2026-003', plant: 'Hồ Suối Hai', agency: 'Sở NN&PTNT Hà Nội', date: '2026-02-20', result: 'pass', numSamples: 15, numFail: 0, report: 'BKD-HL1-2026-02', note: 'Kiểm định đột xuất – Đạt QCVN' },
      { id: 'WI-2026-002', plant: 'Hồ Đồng Mô', agency: 'Chi cục Thủy lợi Hà Nội', date: '2026-01-21', result: 'pass', numSamples: 10, numFail: 0, report: 'BKD-HL2-2026-01', note: '' },
      { id: 'WI-2026-001', plant: 'Hồ Suối Hai', agency: 'Chi cục Thủy lợi Hà Nội', date: '2026-01-20', result: 'pass', numSamples: 12, numFail: 0, report: 'BKD-HL1-2026-01', note: '' },
      { id: 'WI-2025-004', plant: 'Trạm bơm Xuân Canh', agency: 'Sở NN&PTNT Hà Nội', date: '2025-10-05', result: 'pass', numSamples: 10, numFail: 0, report: 'BKD-UB-2025-10', note: 'Tái kiểm sau sự cố tháng 9 – đạt yêu cầu.' },
      { id: 'WI-2025-003', plant: 'Trạm bơm Xuân Canh', agency: 'Sở NN&PTNT Hà Nội', date: '2025-09-10', result: 'fail', numSamples: 10, numFail: 2, report: 'BKD-UB-2025-09', note: 'Chỉ số không đạt 2 mẫu cuối nguồn.' },
      { id: 'WI-2025-002', plant: 'Hồ Đồng Mô', agency: 'Chi cục Thủy lợi Hà Nội', date: '2025-08-16', result: 'pass', numSamples: 10, numFail: 0, report: 'BKD-HL2-2025-08', note: '' },
      { id: 'WI-2025-001', plant: 'Hồ Suối Hai', agency: 'Chi cục Thủy lợi Hà Nội', date: '2025-08-15', result: 'pass', numSamples: 12, numFail: 0, report: 'BKD-HL1-2025-08', note: '' },
      { id: 'WI-2025-OLD-1', plant: 'Hồ Suối Hai', agency: 'Chi cục Thủy lợi', date: '2025-06-10', result: 'pass', numSamples: 10, numFail: 0, report: 'R06', note: '' },
      { id: 'WI-2025-OLD-2', plant: 'Hồ Đồng Mô', agency: 'Chi cục Thủy lợi', date: '2025-06-11', result: 'pass', numSamples: 8, numFail: 0, report: 'R07', note: '' },
      { id: 'WI-2025-OLD-3', plant: 'Trạm bơm Xuân Canh', agency: 'Chi cục Thủy lợi', date: '2025-05-20', result: 'pass', numSamples: 10, numFail: 0, report: 'R08', note: '' },
    ],
    upcoming: [
      { id: 'WI-UP-003', plant: 'Trạm bơm Xuân Canh', agency: 'Sở NN&PTNT Hà Nội', plannedDate: '2026-04-10', period: 'Quý 2/2026', note: 'Báo cáo giải trình sự cố 2025 kèm hồ sơ PCCC.' },
      { id: 'WI-UP-001', plant: 'Hồ Suối Hai', agency: 'Chi cục Thủy lợi Hà Nội', plannedDate: '2026-06-15', period: 'Bán niên 1/2026', note: 'Chuẩn bị đầy đủ sổ nhật ký vận hành.' },
      { id: 'WI-UP-002', plant: 'Hồ Đồng Mô', agency: 'Chi cục Thủy lợi Hà Nội', plannedDate: '2026-06-16', period: 'Bán niên 1/2026', note: 'Duy trì đạt chuẩn để giảm tần suất kiểm định.' },
      { id: 'WI-UP-004', plant: 'Hồ Suối Hai', agency: 'Tổng cục Thủy lợi', plannedDate: '2026-09-20', period: 'Hàng năm 2026', note: 'Kiểm tra toàn diện cấp Bộ.' },
    ],
  },
};

// ── SVG ICON HELPERS ─────────────────────────────────────────────
const LIMS_ICON = {
  flask: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11m0 0a2 2 0 002 2h4a2 2 0 002-2V3M9 14l-3 7h12l-3-7"/></svg>`,
  droplet: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C12 2 4 10 4 14a8 8 0 0016 0C20 10 12 2 12 2z"/></svg>`,
  qrcode: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/></svg>`,
  calendar: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  alert: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  cpu: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>`,
  trending: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  download: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  refresh: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>`,
  printer: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`,
  map: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
  bulb: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z"/></svg>`,
  stamp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 13H5a2 2 0 00-2 2v3h18v-3a2 2 0 00-2-2h-4"/><path d="M12 3a4 4 0 014 4c0 1.6-.7 3-1.8 4H9.8A5 5 0 018 7a4 4 0 014-4z"/><line x1="3" y1="21" x2="21" y2="21"/></svg>`,
};

function limsStatusColor(v, key) {
  const lim = LIMS_DATA.limits[key];
  if (!lim) return 'var(--text)';
  if (key === 'coliform') return v > 0 ? 'var(--danger)' : 'var(--success)';
  if (v < lim.min || v > lim.max) return 'var(--danger)';
  const rangePct = (v - lim.min) / (lim.max - lim.min);
  return rangePct < 0.2 || rangePct > 0.8 ? 'var(--warning)' : 'var(--success)';
}

function limsParamBadge(v, key) {
  const lim = LIMS_DATA.limits[key];
  if (v === undefined || v === null || !lim) return '<span class="badge badge-gray">—</span>';
  const isAlert = key === 'coliform' ? v > 0 : (v < lim.min || v > lim.max);
  const isWarning = !isAlert && (() => {
    const rangePct = (v - lim.min) / (lim.max - lim.min);
    return rangePct < 0.2 || rangePct > 0.8;
  })();
  const cls = isAlert ? 'badge-red' : isWarning ? 'badge-yellow' : 'badge-green';
  return `<span class="badge ${cls}" style="font-family:'Roboto Mono',monospace;font-size:11px">${v} ${lim.unit}</span>`;
}

// ── MAIN RENDER ──────────────────────────────────────────────────
function renderLims() {
  const criticalAlerts = LIMS_DATA.samples.filter(s => s.status === 'alert').length;
  return `
  <div class="page-header">
    <div class="page-title">
      <h1>Phòng thí nghiệm – LIMS</h1>
      <p>Hệ thống Quản lý Thông tin Phòng thí nghiệm &nbsp;|&nbsp; ISO/IEC 17025</p>
    </div>
    <div class="page-actions">
      ${criticalAlerts > 0 ? `<span class="badge badge-red" style="display:inline-flex;align-items:center;gap:4px;font-size:13px;padding:6px 12px">${LIMS_ICON.alert} ${criticalAlerts} cảnh báo chất lượng</span>` : ''}
      <button class="btn btn-outline" style="display:inline-flex;align-items:center;gap:5px" onclick="showToast('Đang tạo phiếu lấy mẫu ...')">${LIMS_ICON.plus} Tạo phiếu lấy mẫu</button>
      <button class="btn btn-primary" style="display:inline-flex;align-items:center;gap:5px" onclick="showToast('Đang xuất E-CoA ...')">${LIMS_ICON.download} Xuất E-CoA</button>
    </div>
  </div>

  <!-- Global LIMS Filters -->
  <div class="card" style="padding:16px; margin-bottom:16px; display:flex; gap:16px; align-items:center; background:var(--bg-card); border:1px solid var(--border)">
    <div style="position:relative; flex:1">
      <input        <input class="form-control" placeholder="Vd: Quận Hà Đông">kiếm theo mã mẫu, thiết bị, kết quả..."
        style="padding-left:36px; height:38px; background:var(--bg-card); border-radius:10px"
        onkeyup="updateLimsGlobalFilter('search', this.value)" value="${limsSearchQuery}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2" style="position:absolute; left:12px; top:11px"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    </div>
    <div style="width:180px">
      <select class="form-control" style="height:38px; background:var(--bg-card); border-radius:10px" onchange="updateLimsGlobalFilter('plant', this.value)">
        <option value="all" ${limsFilterPlant === 'all' ? 'selected' : ''}>Tất cả nhà máy</option>
        <option value="NM-01" ${limsFilterPlant === 'NM-01' ? 'selected' : ''}>Hồ Suối Hai</option>
        <option value="NM-02" ${limsFilterPlant === 'NM-02' ? 'selected' : ''}>Hồ Đồng Mô</option>
        <option value="NM-03" ${limsFilterPlant === 'NM-03' ? 'selected' : ''}>Trạm bơm Xuân Canh</option>
      </select>
    </div>
    <div style="width:160px">
      <select class="form-control" style="height:38px; background:var(--bg-card); border-radius:10px" onchange="updateLimsGlobalFilter('status', this.value)">
        <option value="all" ${limsFilterStatus === 'all' ? 'selected' : ''}>Mọi trạng thái</option>
        <option value="ok" ${limsFilterStatus === 'ok' ? 'selected' : ''}>Đạt chuẩn</option>
        <option value="alert" ${limsFilterStatus === 'alert' ? 'selected' : ''}>Cảnh báo</option>
        <option value="pending" ${limsFilterStatus === 'pending' ? 'selected' : ''}>Đang xử lý</option>
      </select>
    </div>
    <button class="btn btn-ghost btn-icon" title="Làm mới bộ lọc" onclick="resetLimsFilters()" style="height:38px; width:38px">
      ${LIMS_ICON.refresh}
    </button>
  </div>

  <div class="tabs">
    <button class="tab-btn ${limsTab === 'overview' ? 'active' : ''}" onclick="switchLimsTab('overview')"    style="display:inline-flex;align-items:center;gap:6px">${LIMS_ICON.droplet} Tổng quan</button>
    <button class="tab-btn ${limsTab === 'samples' ? 'active' : ''}" onclick="switchLimsTab('samples')"    style="display:inline-flex;align-items:center;gap:6px">${LIMS_ICON.qrcode} Quản lý mẫu</button>
    <button class="tab-btn ${limsTab === 'results' ? 'active' : ''}" onclick="switchLimsTab('results')"    style="display:inline-flex;align-items:center;gap:6px">${LIMS_ICON.flask} Kết quả xét nghiệm</button>
    <button class="tab-btn ${limsTab === 'calib' ? 'active' : ''}" onclick="switchLimsTab('calib')"      style="display:inline-flex;align-items:center;gap:6px">${LIMS_ICON.calendar} Kiểm định thiết bị</button>
    <button class="tab-btn ${limsTab === 'inspection' ? 'active' : ''}" onclick="switchLimsTab('inspection')" style="display:inline-flex;align-items:center;gap:6px">${LIMS_ICON.stamp} Kiểm định nước</button>
    <button class="tab-btn ${limsTab === 'aipredict' ? 'active' : ''}" onclick="switchLimsTab('aipredict')"  style="display:inline-flex;align-items:center;gap:6px">${LIMS_ICON.cpu} AI Khuyến nghị</button>
  </div>
  <div id="limsContent">${getLimsTabContent()}</div>`;
}

function switchLimsTab(tab) {
  limsTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  event.target.closest('.tab-btn').classList.add('active');
  document.getElementById('limsContent').innerHTML = getLimsTabContent();
}

function getLimsTabContent() {
  if (limsTab === 'overview') return renderLimsOverview();
  if (limsTab === 'samples') return renderLimsSamples();
  if (limsTab === 'results') return renderLimsResults();
  if (limsTab === 'calib') return renderLimsCalib();
  if (limsTab === 'inspection') return renderLimsInspection();
  if (limsTab === 'aipredict') return renderLimsAi();
  return '';
}

// ── PAGINATION HELPER ──────────────────────────────────────────
function renderLimsPagination(totalItems, type) {
  const page = limsPageState[type];
  const totalPages = Math.ceil(totalItems / limsPageState.pageSize);
  if (totalPages <= 1) return '';

  return `
  <div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-top:20px;padding:10px">
    <button class="btn btn-ghost btn-sm" ${page === 1 ? 'disabled' : ''} onclick="changeLimsPage('${type}', ${page - 1})">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <span style="font-size:13px;color:var(--muted)">Trang <strong>${page}</strong> / ${totalPages}</span>
    <button class="btn btn-ghost btn-sm" ${page === totalPages ? 'disabled' : ''} onclick="changeLimsPage('${type}', ${page + 1})">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  </div>`;
}

window.changeLimsPage = function (type, newPage) {
  limsPageState[type] = newPage;
  document.getElementById('limsContent').innerHTML = getLimsTabContent();
};

window.updateLimsGlobalFilter = function (key, val) {
  if (key === 'search') limsSearchQuery = val;
  if (key === 'plant') limsFilterPlant = val;
  if (key === 'status') limsFilterStatus = val;
  // Trigger update after a small delay for search
  const delay = key === 'search' ? 300 : 0;
  clearTimeout(window._limsFilterTimer);
  window._limsFilterTimer = setTimeout(() => {
    document.getElementById('limsContent').innerHTML = getLimsTabContent();
  }, delay);
};

window.resetLimsFilters = function () {
  limsSearchQuery = '';
  limsFilterPlant = 'all';
  limsFilterStatus = 'all';
  navigate('lims'); // Full re-render to update inputs
};


// ── OVERVIEW TAB ─────────────────────────────────────────────────
function renderLimsOverview() {
  const filteredSamples = LIMS_DATA.samples.filter(s => {
    const matchesPlant = limsFilterPlant === 'all' || s.siteId.includes(limsFilterPlant);
    const matchesStatus = limsFilterStatus === 'all' || s.status === limsFilterStatus;
    return matchesPlant && matchesStatus;
  });

  const total = filteredSamples.length;
  const okCount = filteredSamples.filter(s => s.status === 'ok').length;
  const alertCnt = filteredSamples.filter(s => s.status === 'alert').length;
  const pendCnt = filteredSamples.filter(s => s.status === 'pending').length;

  const filteredCalib = LIMS_DATA.calibrations.filter(c => {
    const matchesStatus = limsFilterStatus === 'all' ||
      (limsFilterStatus === 'ok' && c.status === 'ok') ||
      (limsFilterStatus === 'alert' && c.status === 'overdue');
    return matchesStatus;
  });
  const calibOk = filteredCalib.filter(c => c.status === 'ok').length;
  const calibBad = filteredCalib.filter(c => c.status !== 'ok').length;

  // Sparkline helper
  const spark = (vals, color) => {
    const max = Math.max(...vals, 0.001);
    return vals.map((v, i) => {
      const h = Math.max(4, Math.round((v / max) * 36));
      const op = (0.35 + (i / vals.length) * 0.65).toFixed(2);
      return `<div style="flex:1;display:flex;align-items:flex-end"><div style="width:100%;height:${h}px;background:${color};border-radius:2px 2px 0 0;opacity:${op}"></div></div>`;
    }).join('');
  };

  const latestAlert = LIMS_DATA.samples.find(s => s.status === 'alert');

  return `
  <!-- KPI Cards -->
  <div class="grid-auto" style="margin-bottom:16px">
    ${[
      { label: 'Tổng mẫu hôm nay', value: total, sub: `${okCount} đạt / ${pendCnt} chờ kết quả`, color: 'var(--primary)', icon: LIMS_ICON.flask },
      { label: 'Cảnh báo chất lượng', value: alertCnt, sub: alertCnt > 0 ? 'Yêu cầu xử lý ngay' : 'Không có cảnh báo', color: alertCnt > 0 ? 'var(--danger)' : 'var(--success)', icon: LIMS_ICON.alert },
      { label: 'Thiết bị kiểm định', value: `${calibOk}/${LIMS_DATA.calibrations.length}`, sub: calibBad > 0 ? `${calibBad} cần gia hạn` : 'Tất cả còn hiệu lực', color: calibBad > 0 ? 'var(--warning)' : 'var(--success)', icon: LIMS_ICON.check },
      { label: 'Điểm lấy mẫu aktif', value: LIMS_DATA.sites.length, sub: 'Tuần hoàn 24h', color: 'var(--primary)', icon: LIMS_ICON.map },
    ].map(card => `
    <div class="card" style="padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div style="font-size:12px;color:var(--muted);font-weight:500">${card.label}</div>
        <div style="color:${card.color};opacity:.8">${card.icon}</div>
      </div>
      <div style="font-size:30px;font-weight:800;font-family:'Roboto Mono',monospace;color:${card.color};margin-bottom:4px">${card.value}</div>
      <div style="font-size:11px;color:var(--muted)">${card.sub}</div>
    </div>`).join('')}
  </div>

  <!-- Alert banner -->
  ${latestAlert ? `
  <div style="background:rgba(255,71,87,.1);border:1px solid rgba(255,71,87,.4);border-radius:10px;padding:14px 18px;margin-bottom:16px;display:flex;align-items:flex-start;gap:12px">
    <div style="color:var(--danger);margin-top:2px;flex-shrink:0">${LIMS_ICON.alert}</div>
    <div style="flex:1">
      <div style="font-weight:700;color:var(--danger);margin-bottom:2px">CẢNH BÁO: Clo dư thấp tại ${latestAlert.siteName}</div>
      <div style="font-size:13px;color:var(--text)">Mẫu <strong>${latestAlert.id}</strong> &nbsp;|&nbsp; Clo dư: <strong style="color:var(--danger)">0.1 mg/l</strong> (Yêu cầu 0.2 – 1.0 mg/l) &nbsp;|&nbsp; Nguy cơ tái nhiễm vi khuẩn cuối nguồn nước.</div>
    </div>
    <button class="btn btn-primary btn-sm" onclick="showToast('Đã gửi lệnh xử lý đến Trưởng ca!')" style="flex-shrink:0">Xử lý ngay</button>
  </div>` : ''}

  <!-- Charts row -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">

    <!-- Turbidity trend -->
    <div class="card" style="padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div>
          <div style="font-weight:700;margin-bottom:2px">Xu hướng Độ đục (NTU)</div>
          <div style="font-size:11px;color:var(--muted)">7 ngày gần nhất – đầu vào NM</div>
        </div>
        <div style="display:inline-flex;align-items:center;gap:4px;font-size:11px;color:var(--muted)">${LIMS_ICON.trending}</div>
      </div>
      <div style="display:flex;height:60px;gap:4px;align-items:flex-end;margin-bottom:10px">
        ${spark(LIMS_DATA.trends.turbidity, 'var(--primary)')}
      </div>
      <div style="display:flex;justify-content:space-between">
        ${LIMS_DATA.trends.dates.map((d, i) => `<div style="font-size:10px;color:var(--muted);flex:1;text-align:center">${d}</div>`).join('')}
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
        ${LIMS_DATA.trends.turbidity.map((v, i, a) => i === a.length - 1 ? `<span style="font-size:12px;color:var(--muted)">Mới nhất: <strong style="color:${limsStatusColor(v, 'turbidity')}">${v} NTU</strong></span>` : '').join('')}
        <span style="font-size:12px;color:var(--muted)">Ngưỡng: &le; 2 NTU</span>
      </div>
    </div>

    <!-- Chlorine trend -->
    <div class="card" style="padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div>
          <div style="font-weight:700;margin-bottom:2px">Xu hướng Clo dư (mg/l)</div>
          <div style="font-size:11px;color:var(--muted)">7 ngày – điểm cuối nguồn DMA-08</div>
        </div>
        <div style="display:inline-flex;align-items:center;gap:4px;font-size:11px;color:var(--muted)">${LIMS_ICON.trending}</div>
      </div>
      <div style="display:flex;height:60px;gap:4px;align-items:flex-end;margin-bottom:10px">
        ${spark(LIMS_DATA.trends.chlorine, 'var(--success)')}
      </div>
      <div style="display:flex;justify-content:space-between">
        ${LIMS_DATA.trends.dates.map(d => `<div style="font-size:10px;color:var(--muted);flex:1;text-align:center">${d}</div>`).join('')}
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
        ${LIMS_DATA.trends.chlorine.map((v, i, a) => i === a.length - 1 ? `<span style="font-size:12px;color:var(--muted)">Mới nhất: <strong style="color:${limsStatusColor(v, 'chlorine')}">${v} mg/l</strong></span>` : '').join('')}
        <span style="font-size:12px;color:var(--muted)">Ngưỡng: 0.2 – 1.0 mg/l</span>
      </div>
    </div>
  </div>

  <!-- Sites status map (table-based since no mapbox key) -->
  <div class="card" style="padding:20px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <div style="font-weight:700">Bản đồ chất lượng nước – điểm lấy mẫu</div>
      <button class="btn btn-ghost btn-sm" style="display:inline-flex;align-items:center;gap:5px" onclick="navigate('gis')">${LIMS_ICON.map} Xem trên GIS</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px">
      ${LIMS_DATA.sites.map(site => {
      const s = LIMS_DATA.samples.find(sm => sm.siteId === site.id);
      const dotColor = !s ? 'var(--muted)' : s.status === 'alert' ? 'var(--danger)' : s.status === 'pending' ? 'var(--warning)' : 'var(--success)';
      const label = !s ? 'Chưa lấy mẫu' : s.status === 'alert' ? 'Cảnh báo' : s.status === 'pending' ? 'Đang phân tích' : 'Đạt chuẩn';
      return `
        <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--bg-secondary);border-radius:8px;border-left:3px solid ${dotColor}">
          <div style="width:10px;height:10px;border-radius:50%;background:${dotColor};box-shadow:0 0 8px ${dotColor};flex-shrink:0;${s?.status === 'alert' ? 'animation:pulse 1.5s infinite' : ''};"></div>
          <div>
            <div style="font-size:13px;font-weight:600">${site.name}</div>
            <div style="font-size:11px;color:var(--muted)">${site.id} &nbsp;·&nbsp; <span style="color:${dotColor}">${label}</span></div>
          </div>
        </div>`;
    }).join('')}
    </div>
  </div>`;
}

// ── SAMPLES TAB ──────────────────────────────────────────────────
function renderLimsSamples() {
  let allSamples = LIMS_DATA.samples.filter(s => {
    const matchesSearch = s.id.toLowerCase().includes(limsSearchQuery.toLowerCase()) ||
      s.siteName.toLowerCase().includes(limsSearchQuery.toLowerCase()) ||
      s.collector.toLowerCase().includes(limsSearchQuery.toLowerCase());
    const matchesPlant = limsFilterPlant === 'all' || s.siteId.includes(limsFilterPlant);
    const matchesStatus = limsFilterStatus === 'all' || s.status === limsFilterStatus;
    return matchesSearch && matchesPlant && matchesStatus;
  });

  const start = (limsPageState.samples - 1) * limsPageState.pageSize;
  const pageSamples = allSamples.slice(start, start + limsPageState.pageSize);

  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:10px">
    <div style="font-size:13px;color:var(--muted)">${allSamples.length} phiếu lấy mẫu &nbsp;|&nbsp; Ngày 01/03/2026</div>
    <div style="display:flex;gap:12px;align-items:center;flex:1;justify-content:flex-end">
      <button class="btn btn-ghost btn-sm" style="display:inline-flex;align-items:center;gap:5px" onclick="limsExportPage('excel')">${LIMS_ICON.download} Xuất Excel</button>
      <button class="btn btn-primary" style="display:inline-flex;align-items:center;gap:5px" onclick="openLimsCreateSampleModal()">${LIMS_ICON.plus} Tạo phiếu mới</button>
    </div>
  </div>
  <div class="card"><div class="table-wrap"><table>
    <thead><tr>
      <th>Mã mẫu</th><th>Điểm lấy mẫu</th><th>Thời gian</th><th>Nhân viên</th><th>Trạng thái</th><th style="text-align:center">Kết quả</th>
    </tr></thead>
    <tbody>
      ${pageSamples.map(s => {
    const st = s.status === 'alert' ? ['badge-red', 'Cảnh báo'] : s.status === 'pending' ? ['badge-yellow', 'Chờ kết quả'] : ['badge-green', 'Đạt chuẩn'];
    return `<tr>
          <td class="mono text-cyan" style="font-size:12px">${s.id}</td>
          <td><div style="font-weight:500">${s.siteName}</div><div style="font-size:11px;color:var(--muted)">${s.siteId}</div></td>
          <td class="mono" style="font-size:12px;color:var(--muted)">${s.time}</td>
          <td style="font-size:13px">${s.collector}</td>
          <td><span class="badge ${st[0]}">${st[1]}</span></td>
          <td style="text-align:center">
            ${s.results ? `<button class="btn btn-ghost btn-sm" onclick="openLimsSampleDetail('${s.id}')">Xem chi tiết</button>` : '<span style="color:var(--muted);font-size:12px">—</span>'}
          </td>
        </tr>`;
  }).join('')}
    </tbody>
  </table></div></div>
  ${renderLimsPagination(allSamples.length, 'samples')}`;
}

// ── RESULTS TAB ──────────────────────────────────────────────────
function renderLimsResults() {
  const paramLabels = { pH: 'pH', turbidity: 'Độ đục', chlorine: 'Clo dư', coliform: 'Coliform', arsenic: 'Asen', nitrate: 'Nitrat', conductivity: 'Độ dẫn điện', hardness: 'Độ cứng' };
  const completedSamples = LIMS_DATA.samples.filter(s => {
    if (!s.results) return false;
    const matchesSearch = s.id.toLowerCase().includes(limsSearchQuery.toLowerCase()) ||
      s.siteName.toLowerCase().includes(limsSearchQuery.toLowerCase());
    const matchesPlant = limsFilterPlant === 'all' || s.siteId.includes(limsFilterPlant);

    let matchesStatus = true;
    if (limsFilterStatus === 'ok') {
      matchesStatus = !Object.entries(s.results).some(([k, v]) => {
        const lim = LIMS_DATA.limits[k];
        return lim && (k === 'coliform' ? v > 0 : v < lim.min || v > lim.max);
      });
    } else if (limsFilterStatus === 'alert') {
      matchesStatus = Object.entries(s.results).some(([k, v]) => {
        const lim = LIMS_DATA.limits[k];
        return lim && (k === 'coliform' ? v > 0 : v < lim.min || v > lim.max);
      });
    }
    return matchesSearch && matchesPlant && matchesStatus;
  });

  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:12px;flex-wrap:wrap">
    <div style="font-size:13px;color:var(--muted)">Hiển thị ${completedSamples.length} kết quả xét nghiệm</div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-ghost btn-sm" style="display:inline-flex;align-items:center;gap:5px" onclick="openLimsImportOcrModal()">${LIMS_ICON.cpu} Import AI (OCR)</button>
      <button class="btn btn-ghost btn-sm" style="display:inline-flex;align-items:center;gap:5px" onclick="openLimsImportExcelModal()">${LIMS_ICON.download} Import Excel</button>
      <button class="btn btn-outline" style="display:inline-flex;align-items:center;gap:5px" onclick="limsExportPage('pdf')">${LIMS_ICON.download} Báo cáo QCVN</button>
      <button class="btn btn-primary" style="display:inline-flex;align-items:center;gap:5px" onclick="limsExportPage('excel')">${LIMS_ICON.printer} Xuất E-CoA</button>
    </div>
  </div>
  <div class="card"><div class="table-wrap"><table style="min-width:900px">
    <thead><tr>
      <th>Mã mẫu / Điểm</th>
      ${Object.keys(paramLabels).map(k => `<th style="text-align:center">${paramLabels[k]}</th>`).join('')}
      <th>Kết luận</th>
    </tr></thead>
    <thead style="background:var(--bg-secondary)"><tr>
      <td style="font-size:10px;color:var(--muted);padding:4px 16px">QCVN 01-1:2018/BYT</td>
      ${Object.entries(LIMS_DATA.limits).map(([k, lim]) => `<td style="text-align:center;font-size:10px;color:var(--muted);padding:4px 8px">${lim.min > 0 ? lim.min + '–' : '≤ '}${lim.max} ${lim.unit}</td>`).join('')}
      <td></td>
    </tr></thead>
    <tbody>
      ${completedSamples.map(s => {
    const hasAlert = Object.entries(s.results).some(([k, v]) => {
      const lim = LIMS_DATA.limits[k];
      if (!lim) return false;
      return k === 'coliform' ? v > 0 : v < lim.min || v > lim.max;
    });
    return `<tr>
          <td><div class="mono text-cyan" style="font-size:11px">${s.id}</div><div style="font-size:12px;font-weight:500">${s.siteName}</div><div style="font-size:10px;color:var(--muted)">${s.time}</div></td>
          ${Object.keys(paramLabels).map(k => `<td style="text-align:center">${limsParamBadge(s.results[k], k)}</td>`).join('')}
          <td><span class="badge ${hasAlert ? 'badge-red' : 'badge-green'}">${hasAlert ? 'Không đạt' : 'Đạt chuẩn'}</span></td>
        </tr>`;
  }).join('')}
    </tbody>
  </table></div></div>`;
}

// ── CALIBRATION TAB ──────────────────────────────────────────────
function renderLimsCalib() {
  const allCalibs = LIMS_DATA.calibrations.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(limsSearchQuery.toLowerCase()) ||
      c.equipment.toLowerCase().includes(limsSearchQuery.toLowerCase()) ||
      c.agency.toLowerCase().includes(limsSearchQuery.toLowerCase());
    const matchesStatus = limsFilterStatus === 'all' ||
      (limsFilterStatus === 'ok' && c.status === 'ok') ||
      (limsFilterStatus === 'alert' && c.status === 'overdue');
    return matchesSearch && matchesStatus;
  });
  const start = (limsPageState.calib - 1) * limsPageState.pageSize;
  const pageCalibs = allCalibs.slice(start, start + limsPageState.pageSize);
  const statusMap = { ok: ['badge-green', 'Còn hiệu lực'], warning: ['badge-yellow', 'Sắp hết hạn'], overdue: ['badge-red', 'Hết hạn'] };

  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:10px">
    <div style="display:flex;align-items:center;gap:12px;flex:1">
      <div style="font-size:13px;color:var(--muted);white-space:nowrap">${allCalibs.length} thiết bị PTN</div>
      ${allCalibs.filter(c => c.status === 'overdue').length > 0 ? `<span class="badge badge-red" style="display:inline-flex;align-items:center;gap:4px">${LIMS_ICON.alert} ${allCalibs.filter(c => c.status === 'overdue').length} thiết bị hết hạn</span>` : ''}
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-ghost btn-sm" onclick="limsExportPage('excel')">${LIMS_ICON.download} Xuất Excel</button>
      <button class="btn btn-primary" style="display:inline-flex;align-items:center;gap:5px" onclick="showToast('Đang thêm thiết bị ...')">${LIMS_ICON.plus} Thêm thiết bị</button>
    </div>
  </div>
  <div class="card"><div class="table-wrap"><table>
    <thead><tr>
      <th>Mã</th><th>Tên thiết bị / Máy phân tích</th><th>Kiểm định cuối</th><th>Hiệu lực đến</th><th>Cơ quan kiểm định</th><th>Số chứng nhận</th><th>Trạng thái</th><th>Thao tác</th>
    </tr></thead>
    <tbody>
      ${pageCalibs.map(c => {
    const [cls, label] = statusMap[c.status];
    return `<tr>
          <td class="mono text-cyan" style="font-size:12px">${c.id}</td>
          <td style="font-weight:500">${c.equipment}</td>
          <td class="mono" style="font-size:12px;color:var(--muted)">${c.lastDate}</td>
          <td class="mono" style="font-size:12px;color:${c.status === 'overdue' ? 'var(--danger)' : c.status === 'warning' ? 'var(--warning)' : 'var(--success)'}">${c.nextDate}</td>
          <td style="font-size:13px">${c.agency}</td>
          <td class="mono" style="font-size:11px;color:var(--muted)">${c.cert}</td>
          <td><span class="badge ${cls}">${label}</span></td>
          <td style="display:flex;gap:6px;flex-wrap:nowrap">
            <button class="btn btn-ghost btn-sm" onclick="showToast('Đang gia hạn ...')">Gia hạn</button>
            <button class="btn btn-ghost btn-sm" onclick="showToast('Đang tải chứng chỉ ...')">${LIMS_ICON.download}</button>
          </td>
        </tr>`;
  }).join('')}
    </tbody>
  </table></div></div>
  ${renderLimsPagination(allCalibs.length, 'calib')}
  
  <!-- Timeline -->
  <div class="card" style="padding:20px;margin-top:16px">
    <div style="font-weight:700;margin-bottom:14px">${LIMS_ICON.calendar} Lịch kiểm định tiếp theo (Dự kiến)</div>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${[...LIMS_DATA.calibrations].sort((a, b) => a.nextDate.localeCompare(b.nextDate)).slice(0, 5).map(c => {
    const [cls] = statusMap[c.status];
    return `<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--bg-secondary);border-radius:8px;border-left:3px solid ${c.status === 'overdue' ? 'var(--danger)' : c.status === 'warning' ? 'var(--warning)' : 'var(--success)'}">
          <div style="font-family:'Roboto Mono',monospace;font-size:12px;color:var(--muted);min-width:80px">${c.nextDate}</div>
          <div style="flex:1;font-size:13px;font-weight:500">${c.equipment}</div>
          <div style="font-size:12px;color:var(--muted)">${c.agency}</div>
          <span class="badge ${cls}" style="flex-shrink:0">${statusMap[c.status][1]}</span>
        </div>`;
  }).join('')}
    </div>
  </div>`;
}

// ── WATER INSPECTION TAB ─────────────────────────────────────────
function renderLimsInspection() {
  const { history, upcoming } = LIMS_DATA.waterInspections;

  const filteredHistory = history.filter(h => {
    const matchesSearch = h.plant.toLowerCase().includes(limsSearchQuery.toLowerCase()) ||
      h.agency.toLowerCase().includes(limsSearchQuery.toLowerCase()) ||
      h.note.toLowerCase().includes(limsSearchQuery.toLowerCase());
    const matchesPlant = limsFilterPlant === 'all' ||
      (limsFilterPlant === 'NM-01' && h.plant.includes('Suối Hai')) ||
      (limsFilterPlant === 'NM-02' && h.plant.includes('Đồng Mô')) ||
      (limsFilterPlant === 'NM-03' && h.plant.includes('Xuân Canh'));
    const matchesStatus = limsFilterStatus === 'all' ||
      (limsFilterStatus === 'ok' && h.result === 'pass') ||
      (limsFilterStatus === 'alert' && h.result === 'fail');
    return matchesSearch && matchesPlant && matchesStatus;
  });

  const start = (limsPageState.inspection - 1) * limsPageState.pageSize;
  const pageHistory = filteredHistory.slice(start, start + limsPageState.pageSize);

  return `
    <div style="display:grid;grid-template-columns:14fr 10fr;gap:16px;margin-bottom:16px">
      <!-- History -->
      <div class="card" style="padding:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px">
          <div style="font-weight:700">Lịch sử kết quả kiểm định (${filteredHistory.length})</div>
          <div style="display:flex;gap:10px;align-items:center">
            <button class="btn btn-ghost btn-sm" onclick="showToast('Đang tải báo cáo tổng hợp ...')">${LIMS_ICON.download} Tải báo cáo</button>
          </div>
        </div>
        <div class="table-wrap" style="background:transparent;padding:0;overflow-y:auto">
          <table style="width:100%;font-size:13px">
            <thead style="position:sticky;top:0;background:var(--bg-elevated);z-index:2">
              <tr>
                <th style="text-align:left;padding:8px 0;color:var(--muted);font-size:11px">Ngày / NM / Cơ quan</th>
                <th style="text-align:center;padding:8px 0;color:var(--muted);font-size:11px">Mẫu</th>
                <th style="text-align:center;padding:8px 0;color:var(--muted);font-size:11px">Kết quả</th>
              </tr>
            </thead>
            <tbody>
              ${pageHistory.map(h => `
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:12px 0">
                  <div style="font-weight:600">${h.plant}</div>
                  <div style="font-size:11px;color:var(--muted)">${h.date} &nbsp;·&nbsp; ${h.agency}</div>
                  ${h.note ? `<div style="font-size:11px;color:var(--warning);margin-top:4px;font-style:italic">Note: ${h.note}</div>` : ''}
                </td>
                <td style="text-align:center;padding:12px 0">
                  <div style="font-family:'Roboto Mono',monospace;font-size:12px">${h.numSamples} mẫu</div>
                  <div style="font-size:10px;color:${h.numFail > 0 ? 'var(--danger)' : 'var(--muted)'}">${h.numFail > 0 ? h.numFail + ' lỗi' : '0 lỗi'}</div>
                </td>
                <td style="text-align:center;padding:12px 0">
                  <span class="badge ${h.result === 'pass' ? 'badge-green' : 'badge-red'}" style="cursor:pointer" onclick="showToast('Xem báo cáo ${h.report}')">${h.result === 'pass' ? 'ĐẠT' : 'CHƯA ĐẠT'}</span>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        ${renderLimsPagination(filteredHistory.length, 'inspection')}
      </div>

      <!-- Upcoming Schedule -->
      <div class="card" style="padding:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <div>
            <div style="font-weight:700;margin-bottom:2px">Lịch kiểm định nước liên ngành sắp tới</div>
            <div style="font-size:11px;color:var(--muted)">Dựa trên kế hoạch của Sở NN&PTNT Hà Nội</div>
          </div>
          <div style="color:var(--primary)">${LIMS_ICON.calendar}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${upcoming.map(u => `
          <div style="padding:14px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:10px">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px">
              <span class="badge badge-blue" style="font-size:10px">${u.period}</span>
              <span style="font-family:'Roboto Mono',monospace;font-size:12px;font-weight:600;color:var(--warning)">${u.plannedDate}</span>
            </div>
            <div style="font-weight:700;font-size:14px;margin-bottom:4px;display:flex;align-items:center;gap:6px">${u.plant}</div>
            <div style="font-size:12px;color:var(--muted);margin-bottom:10px">${u.agency}</div>
            <div style="background:rgba(255,190,0,.08);padding:10px;border-radius:6px;border-left:3px solid var(--warning);font-size:12px;line-height:1.6;color:var(--text-dim)">
              <strong style="color:var(--warning)">Ghi chú:</strong> ${u.note}
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>`;
}

// ── AI RECOMMENDATIONS TAB ───────────────────────────────────────
function renderLimsAi() {
  const filteredRecs = LIMS_DATA.aiRecommendations.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(limsSearchQuery.toLowerCase()) ||
      r.detail.toLowerCase().includes(limsSearchQuery.toLowerCase());
    const matchesPlant = limsFilterPlant === 'all' || r.site.includes(limsFilterPlant);
    const matchesStatus = limsFilterStatus === 'all' ||
      (limsFilterStatus === 'alert' && r.level === 'critical') ||
      (limsFilterStatus === 'ok' && r.level === 'info');
    return matchesSearch && matchesPlant && matchesStatus;
  });

  const levelCfg = {
    critical: { color: 'var(--danger)', alpha: 'rgba(255,71,87,', label: 'Khẩn cấp', icon: LIMS_ICON.alert },
    warning: { color: 'var(--warning)', alpha: 'rgba(255,190,0,', label: 'Cảnh báo', icon: LIMS_ICON.alert },
    info: { color: 'var(--primary)', alpha: 'rgba(0,200,255,', label: 'Thông tin', icon: LIMS_ICON.bulb },
  };

  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border);flex-wrap:wrap;gap:12px">
    <div>
      <div style="font-size:17px;font-weight:700;margin-bottom:4px">Khuyến nghị AI – Chất lượng nước</div>
      <div style="font-size:12px;color:var(--muted)">Phân tích từ dữ liệu LIMS &amp; SCADA Online – cập nhật mỗi 1 giờ</div>
    </div>
    <div style="display:flex;gap:8px">
      ${['critical', 'warning', 'info'].map(l => {
    const cnt = filteredRecs.filter(r => r.level === l).length;
    const { color, alpha, label } = levelCfg[l];
    return `<div style="display:flex;align-items:center;gap:6px;padding:5px 12px;border-radius:20px;background:${alpha}.1);border:1px solid ${alpha}.3);color:${color}"><span style="font-size:11px;font-weight:600">${cnt} ${label}</span></div>`;
  }).join('')}
      <button class="btn btn-primary btn-sm" style="display:inline-flex;align-items:center;gap:5px" onclick="showToast('Đang phân tích lại ...')">${LIMS_ICON.refresh} Phân tích lại</button>
    </div>
  </div>

  <div style="display:flex;flex-direction:column;gap:14px">
    ${filteredRecs.length === 0 ? `<div style="text-align:center; padding:60px; color:var(--muted)">Không có khuyến nghị nào khớp với bộ lọc</div>` : filteredRecs.map(r => {
    const { color, alpha, label, icon } = levelCfg[r.level];
    return `
      <div class="card" style="border-left:4px solid ${color};padding:0;overflow:hidden">
        <div style="padding:14px 18px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="color:${color}">${icon}</span>
            <div>
              <div style="font-size:15px;font-weight:700">${r.title}</div>
              <div style="font-size:11px;color:var(--muted)">Địa điểm: ${r.site} &nbsp;·&nbsp; ${r.date}</div>
            </div>
          </div>
          <span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:20px;background:${alpha}.1);border:1px solid ${alpha}.3);font-size:12px;font-weight:700;color:${color}">${label}</span>
        </div>
        <div style="padding:16px 18px;display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:8px;padding:12px;display:flex;flex-direction:column;gap:10px">
            <div style="font-size:10px;font-weight:700;letter-spacing:.08em;color:var(--primary);text-transform:uppercase;display:flex;align-items:center;gap:4px">${LIMS_ICON.cpu} Hiện trạng & Dự báo</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <div style="font-size:12px;color:var(--muted)">Đầu vào:<br><strong style="color:var(--text)">${r.input || '—'}</strong></div>
              <div style="font-size:12px;color:var(--muted)">Dự báo đầu ra:<br><strong style="color:var(--success)">${r.predictedOutput || '—'}</strong></div>
            </div>
            <div style="font-size:13px;line-height:1.7;color:var(--text);border-top:1px solid rgba(255,255,255,.05);padding-top:8px">${r.detail}</div>
          </div>
          <div style="background:${alpha}.06);border-radius:8px;padding:12px;border:1px solid ${alpha}.2);display:flex;flex-direction:column;gap:10px">
            <div style="font-size:10px;font-weight:700;letter-spacing:.08em;color:${color};text-transform:uppercase;display:flex;align-items:center;gap:4px">${LIMS_ICON.bulb} Liều lượng hóa chất tối ưu</div>
            <div style="font-size:13px;font-weight:700;color:${color};background:var(--bg-tertiary);padding:8px 12px;border-radius:6px;border:1px dashed ${alpha}.4)">${r.dosing || '—'}</div>
            <div style="font-size:13px;line-height:1.7;color:var(--text)">${r.action}</div>
            <div style="font-size:11px;color:var(--success);font-weight:600;display:flex;align-items:center;gap:4px">${LIMS_ICON.check} ${r.savings || 'Tiết kiệm chi phí'}</div>
          </div>
        </div>
        <div style="padding:0 18px 14px;display:flex;justify-content:flex-end;gap:8px">
          ${r.level === 'critical' ? `<button class="btn btn-primary btn-sm" style="display:inline-flex;align-items:center;gap:5px;background:var(--danger);border-color:var(--danger)" onclick="showToast('Đã gửi lệnh xử lý khẩn!')">Xử lý khẩn cấp</button>` : ''}
          <button class="btn btn-outline btn-sm" onclick="showToast('Đã giao việc cho Trưởng ca!')">Giao việc</button>
          <button class="btn btn-ghost btn-sm" onclick="showToast('Đã đánh dấu hoàn thành!')">Đánh dấu xử lý</button>
        </div>
      </div>`;
  }).join('')}
  </div>

  <!-- Prediction card -->
  <div class="card" style="margin-top:16px;padding:20px">
    <div style="font-weight:700;margin-bottom:4px">Dự báo xu hướng Độ đục mùa mưa 2026</div>
    <div style="font-size:12px;color:var(--muted);margin-bottom:14px">Mô hình ARIMA + dữ liệu lịch sử 3 năm – Độ tin cậy 84%</div>
    <div style="background:rgba(0,200,255,.06);border:1px solid rgba(0,200,255,.2);border-radius:8px;padding:14px">
      <div style="font-size:13px;line-height:1.8;color:var(--text)">
        Dự báo trong <strong>tháng 5–9/2026</strong>, độ đục tại đầu vào nhà máy có thể vượt ngưỡng <strong>5 NTU</strong> vào các đợt mưa lớn, tần suất ước tính <strong>3–5 lần/tháng</strong>. <br>
        Khuyến nghị: <strong>Tăng cường hóa chất keo tụ PAC thêm 15%</strong>, kiểm tra van thu nước lắng và chuẩn bị bùn thải.
      </div>
    </div>
  </div>`;
}

// ── DETAIL MODAL ─────────────────────────────────────────────────
window.openLimsSampleDetail = function (id) {
  const s = LIMS_DATA.samples.find(sm => sm.id === id);
  if (!s || !s.results) return;

  const paramLabels = { pH: 'pH', turbidity: 'Độ đục (NTU)', chlorine: 'Clo dư (mg/l)', coliform: 'Coliform (CFU/100ml)', arsenic: 'Asen (mg/l)', nitrate: 'Nitrat (mg/l)', conductivity: 'Độ dẫn điện (µS/cm)', hardness: 'Độ cứng (mg/l)' };
  const hasAlert = Object.entries(s.results).some(([k, v]) => {
    const lim = LIMS_DATA.limits[k];
    if (!lim) return false;
    return k === 'coliform' ? v > 0 : v < lim.min || v > lim.max;
  });

  openModal(`
    <div class="modal-header">
      <div>
        <span class="modal-title" style="display:inline-flex;align-items:center;gap:6px">${LIMS_ICON.flask} Kết quả xét nghiệm: ${s.id}</span>
        <div style="font-size:11px;color:var(--muted);margin-top:2px">${s.siteName} &nbsp;·&nbsp; ${s.time} &nbsp;·&nbsp; ${s.collector}</div>
      </div>
      <button class="modal-close" onclick="closeModal(event)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body" style="padding:0;max-height:70vh;overflow-y:auto;overflow-x:hidden">
      <div style="padding:16px 20px;background:${hasAlert ? 'rgba(255,71,87,.08)' : 'rgba(41,132,238,.06)'};border-bottom:1px solid var(--border)">
        <span class="badge ${hasAlert ? 'badge-red' : 'badge-green'}" style="font-size:13px;padding:6px 14px">${hasAlert ? 'KHÔNG ĐẠT – Có chỉ tiêu vượt ngưỡng QCVN' : 'ĐẠT CHUẨN – QCVN 01-1:2018/BYT'}</span>
      </div>
      <table style="width:100%;border-collapse:collapse">
        <thead style="position:sticky;top:0;background:var(--bg-elevated);z-index:2">
          <tr>
            <th style="padding:10px 16px;font-size:11px;color:var(--muted);text-align:left;border-bottom:1px solid var(--border)">Chỉ tiêu</th>
            <th style="padding:10px 16px;font-size:11px;color:var(--muted);text-align:center;border-bottom:1px solid var(--border)">Kết quả</th>
            <th style="padding:10px 16px;font-size:11px;color:var(--muted);text-align:center;border-bottom:1px solid var(--border)">Giới hạn QCVN</th>
            <th style="padding:10px 16px;font-size:11px;color:var(--muted);text-align:center;border-bottom:1px solid var(--border)">Đánh giá</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(paramLabels).map(([k, label], i) => {
    const v = s.results[k];
    const lim = LIMS_DATA.limits[k];
    const isAlert = lim && (k === 'coliform' ? v > 0 : v < lim.min || v > lim.max);
    return `<tr style="background:${i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.02)'};border-bottom:1px solid var(--border)">
              <td style="padding:11px 16px;font-size:13px;font-weight:500">${label}</td>
              <td style="padding:11px 16px;text-align:center;font-family:'Roboto Mono',monospace;font-size:13px;font-weight:700;color:${limsStatusColor(v, k)}">${v}</td>
              <td style="padding:11px 16px;text-align:center;font-size:12px;color:var(--muted)">${lim ? (lim.min > 0 ? lim.min + ' – ' : '≤ ') + lim.max : '—'}</td>
              <td style="padding:11px 16px;text-align:center">${isAlert ? '<span class="badge badge-red">Vượt ngưỡng</span>' : '<span class="badge badge-green">Đạt</span>'}</td>
            </tr>`;
  }).join('')}
        </tbody>
      </table>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal(event)">Đóng</button>
      <button class="btn btn-outline" onclick="showToast('Đang xuất E-CoA ...');closeModal(event)">${LIMS_ICON.download} Xuất E-CoA</button>
      ${hasAlert ? `<button class="btn btn-primary" style="background:var(--danger);border-color:var(--danger)" onclick="showToast('Đã gửi cảnh báo đến Lãnh đạo!');closeModal(event)">Gửi cảnh báo</button>` : ''}
    </div>
  `);
};

// ── ADVANCED FEATURES: IMPORT / EXCEL / OCR ───────────────────────

window.limsExportPage = function (format) {
  const tabName = limsTab === 'samples' ? 'Danh_sach_mau' : limsTab === 'results' ? 'Ket_qua_xet_nghiem' : 'Kiem_dinh_thiet_bi';
  showToast(`Đang tạo file ${format.toUpperCase()} cho ${tabName}...`);
  setTimeout(() => {
    showToast(`Đã xuất file ${tabName}.${format === 'excel' ? 'xlsx' : 'pdf'} thành công!`, 'success');
  }, 1500);
};

window.openLimsImportOcrModal = function () {
  openModal(`
    <div class="modal-header">
      <span class="modal-title" style="display:inline-flex;align-items:center;gap:8px">${LIMS_ICON.cpu} Nhập kết quả bằng AI OCR</span>
    </div>
    <div class="modal-body" id="ocrModalBody">
      <div style="text-align:center;padding:30px;border:2px dashed var(--border);border-radius:12px;background:rgba(255,255,255,.02)">
        <div style="font-size:40px;margin-bottom:15px">📄</div>
        <div style="font-weight:600;margin-bottom:8px">Kéo thả hoặc chọn file ảnh/PDF kết quả thí nghiệm</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:20px">Hệ thống AI sẽ tự động bóc tách các chỉ số pH, Độ đục, Clo dư...</div>
        <input type="file" id="ocrFileInput" style="display:none" onchange="processLimsOcr()">
        <button class="btn btn-primary" onclick="document.getElementById('ocrFileInput').click()">Chọn File</button>
      </div>
    </div>
  `);
};

window.processLimsOcr = function () {
  const body = document.getElementById('ocrModalBody');
  body.innerHTML = `
    <div style="text-align:center;padding:40px">
      <div class="spinner" style="margin:0 auto 20px"></div>
      <div style="font-weight:600;margin-bottom:5px">Đang xử lý bằng AI OCR...</div>
      <div style="font-size:12px;color:var(--muted)">Đang nhận diện các trường dữ liệu và bóc tách giá trị...</div>
      <div style="width:200px;height:4px;background:rgba(255,255,255,.1);border-radius:2px;margin:20px auto;overflow:hidden">
        <div id="ocrProgress" style="width:0;height:100%;background:var(--primary);transition:width 0.3s"></div>
      </div>
    </div>
  `;

  let progress = 0;
  const interval = setInterval(() => {
    progress += 20;
    const bar = document.getElementById('ocrProgress');
    if (bar) bar.style.width = progress + '%';
    if (progress >= 100) {
      clearInterval(interval);
      showOcrResults();
    }
  }, 400);
};

function showOcrResults() {
  const body = document.getElementById('ocrModalBody');
  const mockData = {
    id: 'SM-OCR-' + Math.floor(Math.random() * 1000),
    siteId: 'NM-01-OUT',
    siteName: 'Hồ Suối Hai – Đầu ra',
    time: new Date().toISOString().slice(0, 16).replace('T', ' '),
    results: { pH: 7.25, turbidity: 0.65, chlorine: 0.45, coliform: 0, arsenic: 0.002, nitrate: 10, conductivity: 440, hardness: 160 }
  };

  body.innerHTML = `
    <div style="margin-bottom:15px;padding:12px;background:var(--success-soft);border:1px solid var(--border-active);border-radius:8px;font-size:13px;color:var(--success-text)">
      ${LIMS_ICON.check} AI đã nhận diện thành công các chỉ số từ tài liệu. Vui lòng kiểm tra lại trước khi lưu.
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:15px">
       <div><label style="font-size:11px;color:var(--muted)">Mã phiếu (AI gợi ý)</label><input class="input" value="${mockData.id}"></div>
       <div><label style="font-size:11px;color:var(--muted)">Điểm lấy mẫu</label><input class="input" value="${mockData.siteName}"></div>
    </div>
    <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden">
      <table style="width:100%;font-size:12px">
        <thead style="background:rgba(255,255,255,.05)">
          <tr><th style="padding:8px">Chỉ số</th><th style="padding:8px">Giá trị nhận diện</th><th style="padding:8px">Đơn vị</th></tr>
        </thead>
        <tbody>
          ${Object.entries(mockData.results).map(([k, v]) => `
            <tr style="border-top:1px solid var(--border)">
              <td style="padding:8px">${k}</td>
              <td style="padding:4px"><input class="input" style="height:28px;text-align:center" value="${v}"></td>
              <td style="padding:8px;color:var(--muted)">${LIMS_DATA.limits[k]?.unit || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="modal-footer" style="margin-top:20px;padding:0">
      <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="confirmLimsOcrImport(${JSON.stringify(mockData).replace(/"/g, '&quot;')})">Xác nhận & Lưu vào hệ thống</button>
    </div>
  `;
}

window.confirmLimsOcrImport = function (data) {
  LIMS_DATA.samples.unshift({
    ...data,
    collector: 'AI System (OCR)',
    status: 'ok'
  });
  closeModal();
  showToast('Đã nhập dữ liệu từ file thành công!', 'success');
  if (limsTab === 'samples' || limsTab === 'results') {
    document.getElementById('limsContent').innerHTML = getLimsTabContent();
  }
};

window.openLimsImportExcelModal = function () {
  openModal(`
    <div class="modal-header">
      <span class="modal-title" style="display:inline-flex;align-items:center;gap:8px">${LIMS_ICON.download} Import dữ liệu từ Excel</span>
    </div>
    <div class="modal-body" style="text-align:center;padding:30px">
      <div style="font-size:40px;margin-bottom:15px">📊</div>
      <div style="font-weight:600;margin-bottom:8px">Chọn file Excel (.xlsx, .csv)</div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:20px">Dữ liệu sẽ được import hàng loạt vào hệ thống. Tải file mẫu <a href="#" style="color:var(--primary)">tại đây</a>.</div>
      <input type="file" id="excelFileInput" style="display:none" onchange="simulateExcelImport()">
      <button class="btn btn-primary" onclick="document.getElementById('excelFileInput').click()">Chọn File</button>
    </div>
  `);
};

window.simulateExcelImport = function () {
  closeModal();
  showToast('Đang xử lý file Excel...');
  setTimeout(() => {
    showToast('Đã import thành công 12 bản ghi từ file Excel!', 'success');
  }, 2000);
}

window.openLimsCreateSampleModal = function () {
  const now = new Date().toISOString().slice(0, 16);
  openModal(`
    <div class="modal-header">
      <span class="modal-title" style="display:inline-flex;align-items:center;gap:8px">${LIMS_ICON.plus} Tạo phiếu lấy mẫu mới</span>
    </div>
    <div class="modal-body">
      <div style="display:grid;grid-template-columns:1fr;gap:16px">
        <div>
          <label class="label">Nhà máy / Điểm lấy mẫu</label>
          <select class="input" id="newSampleSite" style="appearance:auto">
            ${LIMS_DATA.sites.map(s => `<option value="${s.id}" data-name="${s.name}">${s.name} (${s.id})</option>`).join('')}
          </select>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div>
            <label class="label">Thời gian lấy mẫu</label>
            <input type="datetime-local" class="input" id="newSampleTime" value="${now}">
          </div>
          <div>
            <label class="label">Nhân viên lấy mẫu</label>
            <input type="text" class="input" id="newSampleCollector" value="Nguyễn Văn An" placeholder="Nhập tên nhân viên...">
          </div>
        </div>
        <div>
          <label class="label">Ghi chú / Yêu cầu xét nghiệm</label>
          <textarea class="input" id="newSampleNote" style="height:80px;resize:none" placeholder="Ví dụ: Kiểm tra định kỳ, yêu cầu ưu tiên xét nghiệm Clo dư..."></textarea>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Hủy bỏ</button>
      <button class="btn btn-primary" onclick="confirmCreateLimsSample()">Tạo phiếu & In QR Code</button>
    </div>
  `);
};

window.confirmCreateLimsSample = function () {
  const siteSelect = document.getElementById('newSampleSite');
  const selectedSite = siteSelect.options[siteSelect.selectedIndex];
  const siteId = siteSelect.value;
  const siteName = selectedSite.getAttribute('data-name');
  const time = document.getElementById('newSampleTime').value.replace('T', ' ');
  const collector = document.getElementById('newSampleCollector').value;
  const note = document.getElementById('newSampleNote').value;

  if (!collector) return showToast('Vui lòng nhập tên nhân viên lấy mẫu', 'error');

  const newId = 'SM-' + new Date().getTime().toString().slice(-8);

  LIMS_DATA.samples.unshift({
    id: newId,
    siteId,
    siteName,
    time,
    collector,
    status: 'pending',
    results: null,
    note
  });

  closeModal();
  showToast(`Đã tạo phiếu ${newId} thành công!`, 'success');
  setTimeout(() => showToast('Đang kết nối máy in QR Code...'), 800);

  if (limsTab === 'samples') {
    document.getElementById('limsContent').innerHTML = getLimsTabContent();
  }
};
