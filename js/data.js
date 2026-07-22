// ── HADIWA IOC — MOCK DATA (PCTT — Thủy lợi & Đê điều TP. Hà Nội) ──────────
// Chi cục Thủy lợi & Phòng chống Thiên tai TP. Hà Nội

// ── TỔNG QUAN PCTT HÀ NỘI ──────────────────────────────────────────
const BIZ_STATS = {
  // Đê điều (hệ thống đê sông Hồng, Đáy, Đuống, Nhuệ, Cầu...)
  totalDikeLength: 626.1,        // km tổng chiều dài đê (TP. Hà Nội)
  dikeLengthUnit: 'km',
  grade1Dike: 150.8,             // km đê cấp I (đê sông Hồng)
  grade2Dike: 213.5,             // km đê cấp II
  grade3Dike: 261.8,             // km đê cấp III+
  dikeConditionOk: 70,           // % đê đạt tiêu chuẩn
  dikeConditionWarning: 22,      // % cần gia cố
  dikeConditionCritical: 8,      // % xung yếu

  // Công trình thủy lợi
  totalReservoirs: 8,            // hồ chứa trong địa bàn
  totalSluices: 2436,            // cống thủy lợi
  totalPumpStations: 1085,       // trạm bơm tiêu
  totalIrrigationArea: 85900,    // ha diện tích tưới
  totalDrainageArea: 76300,      // ha diện tích tiêu úng

  // Trạm thủy văn & cảnh báo
  totalHydroStations: 42,        // trạm thủy văn
  onlineHydroStations: 38,       // trạm online
  rainStations: 68,              // trạm đo mưa
  onlineRainStations: 62,        // trạm đo mưa online

  // Thiên tai (Năm 2025)
  totalDisasterEvents: 18,       // sự kiện thiên tai
  affectedPeople: 8720,          // người bị ảnh hưởng
  evacuatedPeople: 2150,         // người được sơ tán
  damageEstimate: 425000000000,  // VND thiệt hại ước tính

  // Sự cố & xử lý
  activeAlerts: 3,               // cảnh báo đang hoạt động
  pendingApprovals: 4,           // phê duyệt chờ
  openIncidents: 20,             // sự cố đang xử lý
  resolvedIncidents: 1248,       // sự cố đã xử lý (YTD)

  // Nhân lực
  totalStaff: 312,
  fieldTeams: 24,
  onDutyStaff: 68,

  // Xu hướng
  alertsTrend: [1, 2, 3, 5, 4, 3, 3],
  incidentsTrend: [32, 28, 24, 26, 28, 22, 20],
  rainfallTrend: [18, 35, 88, 145, 210, 172, 62],
};

// ── DỮ LIỆU ĐÊ ĐIỀU HÀ NỘI ─────────────────────────────────────────
const DIKE_DATA = [
  { id: 'D01', name: 'Đê Tả Hồng (Hà Nội)', grade: 1, length: 72.5, district: 'Long Biên – Gia Lâm – Đông Anh', condition: 'ok', lat: 21.0450, lng: 105.9200, heightDesign: 14.5, heightCurrent: 14.4, material: 'Đất có áp trúc', yearBuilt: 1965, lastInspect: '15/01/2026', issues: 2, alerts: 0, manager: 'Nguyễn Văn Đại' },
  { id: 'D02', name: 'Đê Hữu Hồng (Hà Nội)', grade: 1, length: 58.3, district: 'Tây Hồ – Bắc Từ Liêm – Hoài Đức', condition: 'warning', lat: 21.0680, lng: 105.7800, heightDesign: 14.0, heightCurrent: 13.5, material: 'Đất, gia cố mái', yearBuilt: 1960, lastInspect: '10/01/2026', issues: 5, alerts: 1, manager: 'Trần Thị Bích' },
  { id: 'D03', name: 'Đê Tả Đuống', grade: 1, length: 38.9, district: 'Gia Lâm – Đông Anh', condition: 'ok', lat: 21.0750, lng: 105.9800, heightDesign: 12.5, heightCurrent: 12.5, material: 'Đất cấp phối', yearBuilt: 1970, lastInspect: '20/01/2026', issues: 1, alerts: 0, manager: 'Lê Đình Cường' },
  { id: 'D04', name: 'Đê Hữu Đuống', grade: 1, length: 32.7, district: 'Đông Anh – Sóc Sơn', condition: 'ok', lat: 21.1050, lng: 105.9500, heightDesign: 12.0, heightCurrent: 11.8, material: 'Đất đầm nén', yearBuilt: 1970, lastInspect: '05/02/2026', issues: 0, alerts: 0, manager: 'Phạm Xuân Minh' },
  { id: 'D05', name: 'Đê Hữu Đáy (Hà Nội)', grade: 2, length: 55.2, district: 'Phúc Thọ – Thạch Thất – Quốc Oai', condition: 'critical', lat: 21.0000, lng: 105.5200, heightDesign: 7.5, heightCurrent: 6.8, material: 'Đất', yearBuilt: 1975, lastInspect: '12/02/2026', issues: 8, alerts: 2, manager: 'Hoàng Văn Bảo' },
  { id: 'D06', name: 'Đê Tả Đáy (Hà Nội)', grade: 2, length: 48.6, district: 'Chương Mỹ – Thường Tín – Phú Xuyên', condition: 'warning', lat: 20.8800, lng: 105.7200, heightDesign: 7.0, heightCurrent: 6.5, material: 'Đất + kè đá', yearBuilt: 1978, lastInspect: '08/02/2026', issues: 4, alerts: 1, manager: 'Đỗ Văn Hùng' },
  { id: 'D07', name: 'Đê Tả Nhuệ', grade: 3, length: 27.8, district: 'Hà Đông – Thanh Oai', condition: 'warning', lat: 20.9450, lng: 105.7600, heightDesign: 5.5, heightCurrent: 5.1, material: 'Đất', yearBuilt: 1985, lastInspect: '14/02/2026', issues: 3, alerts: 1, manager: 'Vũ Thị Thúy' },
  { id: 'D08', name: 'Đê Hữu Nhuệ', grade: 3, length: 24.3, district: 'Từ Liêm – Hà Đông', condition: 'ok', lat: 20.9600, lng: 105.7400, heightDesign: 5.0, heightCurrent: 5.0, material: 'Đất', yearBuilt: 1985, lastInspect: '17/02/2026', issues: 0, alerts: 0, manager: 'Trần Minh Tâm' },
  { id: 'D09', name: 'Đê Ngọc Tảo (sông Hồng – Ba Vì)', grade: 2, length: 18.5, district: 'Ba Vì – Phúc Thọ', condition: 'critical', lat: 21.1200, lng: 105.4100, heightDesign: 9.0, heightCurrent: 8.2, material: 'Đất', yearBuilt: 1972, lastInspect: '03/02/2026', issues: 6, alerts: 2, manager: 'Bùi Quang Thành' },
  { id: 'D10', name: 'Đê Cầu (Đông Anh – Sóc Sơn)', grade: 3, length: 19.8, district: 'Sóc Sơn – Đông Anh', condition: 'ok', lat: 21.2000, lng: 105.8800, heightDesign: 6.0, heightCurrent: 5.9, material: 'Đất', yearBuilt: 1990, lastInspect: '20/02/2026', issues: 1, alerts: 0, manager: 'Nguyễn Thị Lan' },
];

// ── HỒ CHỨA NỘI ĐỊA TP. HÀ NỘI ──────────────────────────────────────
const RESERVOIR_DATA = [
  { id: 'HO01', name: 'Hồ Suối Hai', district: 'H. Ba Vì', capacity: 47600000, currentLevel: 20.8, designLevel: 23.5, deadLevel: 16.5, lat: 21.1350, lng: 105.3250, status: 'ok', spillwayFlow: 0, inflowQ: 3.2, outflowQ: 2.1, area: 1050, irrigates: 7500, floods: false },
  { id: 'HO02', name: 'Hồ Đồng Mô', district: 'TX. Sơn Tây', capacity: 90000000, currentLevel: 18.2, designLevel: 21.5, deadLevel: 13.0, lat: 21.0050, lng: 105.4350, status: 'ok', spillwayFlow: 0, inflowQ: 4.8, outflowQ: 3.2, area: 1250, irrigates: 0, floods: false },
  { id: 'HO03', name: 'Hồ Quan Sơn', district: 'H. Mỹ Đức', capacity: 23500000, currentLevel: 8.9, designLevel: 10.8, deadLevel: 5.5, lat: 20.6250, lng: 105.7450, status: 'warning', spillwayFlow: 15, inflowQ: 5.8, outflowQ: 4.2, area: 850, irrigates: 4800, floods: false },
  { id: 'HO04', name: 'Hồ Tuy Lai', district: 'H. Mỹ Đức', capacity: 15000000, currentLevel: 19.2, designLevel: 20.5, deadLevel: 13.0, lat: 20.5900, lng: 105.7900, status: 'critical', spillwayFlow: 28, inflowQ: 18.4, outflowQ: 12.5, area: 420, irrigates: 3200, floods: true },
  { id: 'HO05', name: 'Hồ Văn Sơn', district: 'H. Chương Mỹ', capacity: 8200000, currentLevel: 14.3, designLevel: 15.0, deadLevel: 9.0, lat: 20.8100, lng: 105.6300, status: 'ok', spillwayFlow: 0, inflowQ: 1.8, outflowQ: 1.4, area: 280, irrigates: 2100, floods: false },
  { id: 'HO06', name: 'Hồ Tiên Sa', district: 'H. Ba Vì', capacity: 5800000, currentLevel: 12.1, designLevel: 14.0, deadLevel: 8.5, lat: 21.0700, lng: 105.3800, status: 'ok', spillwayFlow: 0, inflowQ: 1.2, outflowQ: 0.9, area: 185, irrigates: 1400, floods: false },
];
window.RESERVOIR_DATA = RESERVOIR_DATA; // expose for iotMonitor charts

// ── TRẠM ĐO THỦY VĂN / IOT HÀ NỘI ──────────────────────────────────
const DATA = {
  stations: [
    { id:'TV01', name:'Trạm Hà Nội (SH)',    river:'Sông Hồng',  factory:'Nội thành',       type:'hydro',     flow:285,  rainfall:12.5, waterLevel:4.82,  alertLevel1:9.5,  alertLevel2:11.5, alertLevel3:13.3, trend:'+0.05', status:'online',   lat:21.0415, lng:105.8479, sensorCount:3, lastMaintain:'05/01/2026', devices:[{id:'WL01',name:'Cảm biến MN sông Hồng',type:'sensor',status:'running'},{id:'CL01',name:'Cảm biến lưu lượng',type:'sensor',status:'running'},{id:'CAM01',name:'Camera giám sát',type:'camera',status:'running'}] },
    { id:'TV02', name:'Trạm Sơn Tây',        river:'Sông Hồng',  factory:'TX. Sơn Tây',     type:'hydro',     flow:620,  rainfall:28.0, waterLevel:7.15,  alertLevel1:11.8, alertLevel2:13.5, alertLevel3:15.0, trend:'+0.12', status:'online',   lat:21.1330, lng:105.5040, sensorCount:2, lastMaintain:'10/01/2026', devices:[{id:'WL02',name:'Cảm biến MN sông Hồng',type:'sensor',status:'running'},{id:'CAM02',name:'Camera giám sát',type:'camera',status:'running'}] },
    { id:'TV03', name:'Trạm Thượng Cát',     river:'Sông Đuống', factory:'H. Đông Anh',      type:'hydro',     flow:195,  rainfall:18.2, waterLevel:5.38,  alertLevel1:8.0,  alertLevel2:10.0, alertLevel3:12.5, trend:'-0.03', status:'online',   lat:21.0820, lng:105.8150, sensorCount:2, lastMaintain:'08/02/2026', devices:[{id:'WL03',name:'Cảm biến MN sông Đuống',type:'sensor',status:'running'},{id:'RL03',name:'Radar lưu lượng',type:'sensor',status:'running'}] },
    { id:'TV04', name:'Trạm Ba Thá',         river:'Sông Đáy',   factory:'H. Ứng Hòa',       type:'hydro',     flow:58,   rainfall:42.8, waterLevel:3.95,  alertLevel1:4.5,  alertLevel2:5.5,  alertLevel3:6.5,  trend:'+0.08', status:'warning',  lat:20.7500, lng:105.7750, sensorCount:3, lastMaintain:'20/01/2026', devices:[{id:'WL04',name:'Cảm biến MN sông Đáy',type:'sensor',status:'running'},{id:'RL04',name:'Radar lưu lượng',type:'sensor',status:'running'},{id:'CAM04',name:'Camera',type:'camera',status:'running'}] },
    { id:'TV05', name:'Trạm Liên Mạc',       river:'Sông Hồng',  factory:'H. Bắc Từ Liêm',  type:'hydro',     flow:245,  rainfall:15.4, waterLevel:4.61,  alertLevel1:9.5,  alertLevel2:11.5, alertLevel3:13.3, trend:'+0.02', status:'online',   lat:21.0710, lng:105.7800, sensorCount:2, lastMaintain:'12/02/2026', devices:[{id:'WL05',name:'Cảm biến MN sông Hồng',type:'sensor',status:'running'},{id:'CAM05',name:'Camera',type:'camera',status:'running'}] },
    { id:'TV06', name:'Trạm Phủ Lỗ',        river:'Sông Cầu',   factory:'H. Sóc Sơn',       type:'hydro',     flow:32,   rainfall:8.2,  waterLevel:2.85,  alertLevel1:5.0,  alertLevel2:6.5,  alertLevel3:8.0,  trend:'0.00', status:'online',   lat:21.2050, lng:105.8650, sensorCount:2, lastMaintain:'15/02/2026', devices:[{id:'WL06',name:'Cảm biến MN sông Cầu',type:'sensor',status:'running'},{id:'RL06',name:'Radar LLQ',type:'sensor',status:'running'}] },
    { id:'TV07', name:'Trạm Hồ Tuy Lai',    river:'—',          factory:'H. Mỹ Đức',        type:'reservoir', flow:12.5, rainfall:55.2, waterLevel:19.2,  alertLevel1:18.5, alertLevel2:19.5, alertLevel3:20.5, trend:'+0.18', status:'warning',  lat:20.5900, lng:105.7900, sensorCount:4, lastMaintain:'01/03/2026', devices:[{id:'WL07',name:'Cảm biến mực hồ',type:'sensor',status:'running'},{id:'SP07',name:'Tràn xả lũ',type:'spillway',status:'open'},{id:'CAM07a',name:'Camera thượng lưu',type:'camera',status:'running'},{id:'CAM07b',name:'Camera hạ lưu',type:'camera',status:'running'}] },
    { id:'TV08', name:'Trạm Nhuệ Giang',    river:'Sông Nhuệ',  factory:'H. Hà Đông',        type:'rain',      flow:0,    rainfall:22.4, waterLevel:0,     alertLevel1:50,   alertLevel2:100,  alertLevel3:150,  trend:'—',    status:'offline',  lat:20.9750, lng:105.7550, sensorCount:1, lastMaintain:'25/11/2025', devices:[{id:'R08',name:'Vũ lượng kế tự ghi',type:'sensor',status:'fault'}] },
    { id:'TV09', name:'Trạm Chương Mỹ',     river:'Sông Đáy',   factory:'H. Chương Mỹ',     type:'hydro',     flow:72,   rainfall:62.5, waterLevel:3.18,  alertLevel1:4.0,  alertLevel2:5.2,  alertLevel3:6.5,  trend:'+0.15', status:'online',   lat:20.8900, lng:105.6900, sensorCount:3, lastMaintain:'01/02/2026', devices:[{id:'WL09',name:'Cảm biến MN',type:'sensor',status:'running'},{id:'RL09',name:'Radar LLQ',type:'sensor',status:'running'},{id:'R09',name:'Vũ lượng kế',type:'sensor',status:'running'}] },
    { id:'TV10', name:'Trạm Ba Vì',         river:'Sông Đà',    factory:'H. Ba Vì',          type:'hydro',     flow:1240, rainfall:88.5, waterLevel:15.40, alertLevel1:18.0, alertLevel2:21.0, alertLevel3:24.0, trend:'+0.22', status:'online',   lat:21.0800, lng:105.3500, sensorCount:3, lastMaintain:'05/02/2026', devices:[{id:'WL10',name:'Cảm biến MN sông Đà',type:'sensor',status:'running'},{id:'RL10',name:'Radar LLQ',type:'sensor',status:'running'},{id:'R10',name:'Vũ lượng kế',type:'sensor',status:'running'}] },
    { id:'TV11', name:'Trạm Quan Sơn',      river:'—',          factory:'H. Mỹ Đức',        type:'reservoir', flow:4.2,  rainfall:38.2, waterLevel:8.9,   alertLevel1:10.0, alertLevel2:10.5, alertLevel3:10.8, trend:'+0.08', status:'warning',  lat:20.6250, lng:105.7450, sensorCount:3, lastMaintain:'20/02/2026', devices:[{id:'WL11',name:'Cảm biến mực Quan Sơn',type:'sensor',status:'running'},{id:'SP11',name:'Tràn',type:'spillway',status:'partial'},{id:'R11',name:'Vũ lượng kế',type:'sensor',status:'running'}] },
    { id:'TV12', name:'Trạm Mỹ Đức (mưa)',  river:'—',          factory:'H. Mỹ Đức',        type:'rain',      flow:0,    rainfall:45.0, waterLevel:0,     alertLevel1:50,   alertLevel2:80,   alertLevel3:120,  trend:'—',    status:'online',   lat:20.6100, lng:105.7600, sensorCount:1, lastMaintain:'10/01/2026', devices:[{id:'R12',name:'Vũ lượng kế tự động',type:'sensor',status:'running'}] },
    { id:'TV13', name:'Trạm Cầu Đuống',     river:'Sông Đuống', factory:'H. Gia Lâm',        type:'hydro',     flow:165,  rainfall:14.0, waterLevel:4.92,  alertLevel1:7.5,  alertLevel2:9.0,  alertLevel3:11.0, trend:'+0.04', status:'online',   lat:21.0200, lng:106.0200, sensorCount:2, lastMaintain:'28/01/2026', devices:[{id:'WL13',name:'Cảm biến MN',type:'sensor',status:'running'},{id:'RL13',name:'Radar LLQ',type:'sensor',status:'running'}] },
    { id:'TV14', name:'Trạm Vân Cốc (mưa)', river:'—',          factory:'H. Phúc Thọ',      type:'rain',      flow:0,    rainfall:32.8, waterLevel:0,     alertLevel1:50,   alertLevel2:80,   alertLevel3:120,  trend:'—',    status:'online',   lat:21.0900, lng:105.6200, sensorCount:1, lastMaintain:'15/01/2026', devices:[{id:'R14',name:'Vũ lượng kế',type:'sensor',status:'running'}] },
    { id:'TV15', name:'Trạm Đa Phúc',       river:'Sông Cà Lồ', factory:'H. Sóc Sơn',       type:'hydro',     flow:28,   rainfall:10.5, waterLevel:2.12,  alertLevel1:4.0,  alertLevel2:5.5,  alertLevel3:7.0,  trend:'+0.01', status:'online',   lat:21.1800, lng:105.8200, sensorCount:2, lastMaintain:'20/02/2026', devices:[{id:'WL15',name:'Cảm biến MN',type:'sensor',status:'running'},{id:'R15',name:'Vũ lượng kế',type:'sensor',status:'running'}] },
    { id:'TV16', name:'Trạm Đan Phượng',    river:'Sông Đáy',   factory:'H. Đan Phượng',    type:'hydro',     flow:48,   rainfall:20.8, waterLevel:2.95,  alertLevel1:4.2,  alertLevel2:5.5,  alertLevel3:7.0,  trend:'+0.06', status:'online',   lat:21.0800, lng:105.6700, sensorCount:2, lastMaintain:'15/02/2026', devices:[{id:'WL16',name:'Cảm biến MN sông Đáy',type:'sensor',status:'running'},{id:'R16',name:'Vũ lượng kế',type:'sensor',status:'running'}] },
  ],

  // "factories" → hồ chứa chính
  factories: RESERVOIR_DATA,

  // ── SỰ CỐ ĐÊ ĐIỀU / THIÊN TAI HÀ NỘI ─────────────────────────────
  incidents: [
    { id: 'SC-001', type: 'Thẩm lậu thân đê', location: 'Đê Hữu Đáy K18+500 – K18+750, H. Phúc Thọ', severity: 'critical', status: 'processing', report: '2026-03-10 06:30', assignedTo: 'Đội ƯCSC số 3', note: 'Phát hiện mạch sủi nghiêm trọng dưới chân đê phía đồng, chiều dài 250m', lat: 21.1050, lng: 105.5180 },
    { id: 'SC-002', type: 'Lún nứt mặt đê', location: 'Đê Ngọc Tảo K5+100 – K5+280, H. Ba Vì', severity: 'critical', status: 'processing', report: '2026-03-10 09:15', assignedTo: 'BCH PCTT huyện Ba Vì', note: 'Lún vết nứt dọc đỉnh đê dài 180m, chiều sâu 30–50 cm', lat: 21.1200, lng: 105.4100 },
    { id: 'SC-003', type: 'Sạt lở mái đê phía sông', location: 'Đê Hữu Hồng K22+300, Q. Bắc Từ Liêm', severity: 'high', status: 'new', report: '2026-03-11 14:20', assignedTo: '', note: 'Sạt mái đê phía sông 80m, HLAT bảo vệ bị đe dọa', lat: 21.0700, lng: 105.7900 },
    { id: 'SC-004', type: 'Cống hộp bị sụt lún', location: 'Cống Liên Mạc, Q. Bắc Từ Liêm', severity: 'warning', status: 'processing', report: '2026-03-11 08:00', assignedTo: 'Đội Vận hành', note: 'Sụt lún cửa cống thượng lưu, cống vẫn hoạt động một phần', lat: 21.0710, lng: 105.7810 },
    { id: 'SC-005', type: 'Hồ vượt mức báo động 2', location: 'Hồ Tuy Lai, H. Mỹ Đức', severity: 'critical', status: 'processing', report: '2026-03-12 04:00', assignedTo: 'BCH PCTT TP.Hà Nội', note: 'Mực nước đạt 19.2m (BĐ2=19.5m đang tiệm cận), mở tràn xả lũ', lat: 20.5900, lng: 105.7900 },
    { id: 'SC-006', type: 'Máy bơm tiêu úng bị hỏng', location: 'Trạm bơm Cổ Nhuế, H. Bắc Từ Liêm', severity: 'warning', status: 'new', report: '2026-03-12 07:30', assignedTo: '', note: 'Motor máy bơm số 2 bị cháy cuộn dây, chờ sửa chữa', lat: 21.0500, lng: 105.7900 },
    { id: 'SC-007', type: 'Ngập úng đồng ruộng', location: 'Xã Đại Thắng, H. Phú Xuyên', severity: 'warning', status: 'processing', report: '2026-03-11 18:00', assignedTo: 'UBND xã', note: 'Khoảng 220 ha lúa bị úng, chiều sâu nước 20-40cm', lat: 20.7200, lng: 105.8500 },
    { id: 'SC-008', type: 'Sạt lở taluy đường', location: 'ĐT 422, Km12+400, H. Ba Vì', severity: 'high', status: 'done', report: '2026-03-10 11:00', assignedTo: 'Sở GTVT Hà Nội', note: 'Đã xử lý thông đường, nguyên nhân mưa lớn kéo dài', lat: 21.0800, lng: 105.3900 },
  ],

  // ── CẢNH BÁO ──────────────────────────────────────────────────────
  alarms: [
    { id: 'A001', msg: 'Hồ Tuy Lai: Mực nước tiệm cận BĐ2 (19.2m/19.5m)', severity: 'critical', time: '04:05 12/3', ack: false, source: 'IoT' },
    { id: 'A002', msg: 'Đê Hữu Đáy K18+500: Mạch sủi thẩm lậu — cần ứng cứu ngay', severity: 'critical', time: '06:32 12/3', ack: false, source: 'Báo cáo' },
    { id: 'A003', msg: 'Đê Ngọc Tảo K5+100: Lún nứt đỉnh đê — đang gia cố', severity: 'high', time: '09:18 12/3', ack: false, source: 'Báo cáo' },
    { id: 'A004', msg: 'Trạm Ba Thá: Mực nước sông Đáy vượt BĐ1 (3.95m→4.5m)', severity: 'warning', time: '07:00 12/3', ack: true, source: 'IoT' },
    { id: 'A005', msg: 'Trạm Nhuệ Giang mất kết nối — kiểm tra thiết bị', severity: 'warning', time: '08:45 12/3', ack: true, source: 'Hệ thống' },
    { id: 'A006', msg: 'Máy bơm Cổ Nhuế #2 sự cố — chờ phân công xử lý', severity: 'warning', time: '07:32 12/3', ack: false, source: 'SCADA' },
    { id: 'A007', msg: 'Cống Liên Mạc: Phát hiện sụt lún — đang theo dõi', severity: 'warning', time: '08:10 12/3', ack: true, source: 'Báo cáo' },
  ],

  // ── LỊCH VẬN HÀNH ──────────────────────────────────────────────────
  schedules: [
    { id: 'SCH-001', station: 'Cống Liên Mạc', type: 'sluice', action: 'Đóng cống điều tiết, ngăn mặn', plannedTime: '2026-03-12 05:00', status: 'done', operator: 'Nguyễn Tuấn Dũng', note: 'Thao tác theo QT vận hành lũ' },
    { id: 'SCH-002', station: 'Trạm bơm Cổ Nhuế', type: 'pump', action: 'Khởi động tổ bơm số 1, 3, 5', plannedTime: '2026-03-12 06:00', status: 'done', operator: 'Lê Thị Hoa', note: 'Bơm tiêu úng nội đồng' },
    { id: 'SCH-003', station: 'Hồ Tuy Lai — Tràn xả lũ', type: 'spillway', action: 'Mở tràn xả lũ 3 khoang', plannedTime: '2026-03-12 05:30', status: 'done', operator: 'Quản đập Đinh Minh', note: 'Duy trì mực hồ theo quy trình lũ 5%' },
    { id: 'SCH-004', station: 'Trạm bơm Đan Hoài', type: 'pump', action: 'Bơm tiêu úng đồng Đan Phượng', plannedTime: '2026-03-12 08:00', status: 'processing', operator: 'Đội vận hành', note: '220ha lúa bị úng cần tiêu gấp' },
    { id: 'SCH-005', station: 'Cống Hà Đông', type: 'sluice', action: 'Kiểm tra vận hành định kỳ Q1', plannedTime: '2026-03-13 08:00', status: 'pending', operator: 'Kỹ thuật viên', note: 'Bảo dưỡng quý 1/2026' },
    { id: 'SCH-006', station: 'Đê Tả Hồng K42+500', type: 'sluice', action: 'Kiểm tra hộ đê đột xuất', plannedTime: '2026-03-12 18:00', status: 'pending', operator: 'Tổ hộ đê số 4', note: 'Sau mưa lớn, kiểm tra kè lát mái' },
  ],

  // ── NHÂN SỰ CHI CỤC THỦY LỢI & PCTT HÀ NỘI ────────────────────────
  employees: [
    { id: 'E001', name: 'Nguyễn Văn Sơn', role: 'CHI_CUC_TRUONG', position: 'Chi cục trưởng', dept: 'Lãnh đạo Chi cục', factory: 'Chi cục', email: 'son@hadiwa.vn', phone: '0241234501', avatar: '', status: 'active', join: '2012-04-01', age: 52, exp: 28 },
    { id: 'E002', name: 'Trần Thị Hương', role: 'DIEU_HANH', position: 'Trưởng phòng Điều hành', dept: 'Phòng Điều hành PCTT', factory: 'Chi cục', email: 'huong@hadiwa.vn', phone: '0241234502', avatar: '', status: 'active', join: '2015-06-15', age: 45, exp: 20 },
    { id: 'E003', name: 'Lê Hùng Cường', role: 'KY_THUAT', position: 'Kỹ sư thủy lợi', dept: 'Phòng Quản lý Thủy lợi', factory: 'Chi cục', email: 'cuong@hadiwa.vn', phone: '0241234503', avatar: '', status: 'active', join: '2016-02-01', age: 38, exp: 12 },
    { id: 'E004', name: 'Phạm Thị Ngọc', role: 'QUAN_LY_DE', position: 'Chuyên viên đê điều', dept: 'Phòng Quản lý Đê điều', factory: 'Chi cục', email: 'ngoc@hadiwa.vn', phone: '0241234504', avatar: '', status: 'active', join: '2014-09-01', age: 41, exp: 16 },
    { id: 'E005', name: 'Vũ Thị Mai', role: 'HR', position: 'Chuyên viên tổ chức', dept: 'Phòng Tổ chức – Hành chính', factory: 'Chi cục', email: 'mai@hadiwa.vn', phone: '0241234505', avatar: '', status: 'active', join: '2018-03-15', age: 35, exp: 8 },
    { id: 'E006', name: 'Nguyễn Thị Vân', role: 'VIEWER', position: 'Thanh tra viên', dept: 'Thanh tra - Pháp chế', factory: 'Chi cục', email: 'van@hadiwa.vn', phone: '0241234506', avatar: '', status: 'active', join: '2020-07-01', age: 32, exp: 5 },
    { id: 'E007', name: 'Đỗ Mạnh Tuân', role: 'KY_THUAT', position: 'Kỹ sư vận hành', dept: 'Phòng Quản lý Thủy lợi', factory: 'Chi cục', email: 'tuan@hadiwa.vn', phone: '0241234507', avatar: '', status: 'active', join: '2019-01-10', age: 36, exp: 10 },
    { id: 'E008', name: 'Hoàng Văn Bình', role: 'QUAN_LY_DE', position: 'Cán bộ hộ đê', dept: 'Phòng Quản lý Đê điều', factory: 'Chi cục', email: 'binh@hadiwa.vn', phone: '0241234508', avatar: '', status: 'active', join: '2017-11-01', age: 40, exp: 14 },
    { id: 'E009', name: 'Lý Thị Thảo', role: 'KY_THUAT', position: 'Kỹ sư công trình', dept: 'Phòng Quản lý Thủy lợi', factory: 'Chi cục', email: 'thao@hadiwa.vn', phone: '0241234509', avatar: '', status: 'active', join: '2021-04-01', age: 29, exp: 4 },
    { id: 'E010', name: 'Nguyễn Quản Trị', role: 'SYSADMIN', position: 'Quản trị hệ thống', dept: 'Phòng CNTT – Chuyển đổi số', factory: 'Chi cục', email: 'admin@hadiwa.vn', phone: '0241234500', avatar: '', status: 'active', join: '2013-01-01', age: 38, exp: 13 },
  ],

  // ── PHÂN CA TRỰC ──────────────────────────────────────────────────
  shifts: [
    { id: 'CA1', name: 'Ca Sáng (06:00–14:00)' }, { id: 'CA2', name: 'Ca Chiều (14:00–22:00)' },
    { id: 'CA3', name: 'Ca Đêm (22:00–06:00)' },  { id: 'CAN', name: 'Nghỉ bù' },
    { id: 'CAP', name: 'Phép' },                  { id: 'CAO', name: 'Nghỉ Ốm' },
    { id: 'CAL', name: 'Nghỉ Lễ' },              { id: 'CA-', name: 'Công tác xa' },
    { id: 'CA0', name: 'Ngày nghỉ' },
  ],

  // ── BẢNG CHẤM CÔNG (27 ngày tháng 2) ─────────────────────────────
  attendanceSchedule: {
    'E001': ['CA1','CA0','CA0','CA1','CA1','CA2','CA0','CA0','CA1','CA1','CA1','CA0','CA0','CA1','CA-','CA-','CA0','CA0','CA1','CA1','CA2','CA0','CA0','CA1','CA1','CA0','CA0'],
    'E002': ['CA1','CA1','CA0','CA0','CA2','CA2','CA3','CA0','CA0','CA1','CA1','CA2','CA0','CA0','CA1','CA1','CAN','CA0','CA0','CA2','CA2','CA1','CA0','CA0','CA1','CA1','CA0'],
    'E003': ['CA2','CA2','CA0','CA0','CA1','CA1','CA3','CA0','CA0','CA2','CA2','CA1','CA0','CA0','CA3','CA3','CA2','CA0','CA0','CA1','CA1','CA2','CA0','CA0','CA3','CA0','CA0'],
    'E004': ['CA3','CA3','CA0','CA0','CA2','CA2','CA1','CA0','CA0','CA3','CA3','CA2','CA0','CA0','CA1','CA1','CA3','CA0','CA0','CA2','CA2','CA3','CA0','CA0','CA1','CA0','CA0'],
    'E005': ['CA1','CA1','CA0','CA0','CA1','CAP','CAP','CA0','CA0','CA1','CA1','CA1','CA0','CA0','CA1','CA1','CA1','CA0','CA0','CA1','CA1','CA1','CA0','CA0','CA1','CA1','CA0'],
    'E006': ['CA1','CA1','CA0','CA0','CA1','CA1','CA1','CA0','CA0','CA1','CA1','CA1','CA0','CA0','CA1','CA1','CA1','CA0','CA0','CA1','CA1','CA1','CA0','CA0','CA1','CA1','CA0'],
    'E007': ['CA2','CA2','CA0','CA0','CA2','CA2','CA2','CA0','CA0','CA2','CA2','CA2','CA0','CA0','CA2','CA2','CA2','CA0','CA0','CA2','CA2','CA2','CA0','CA0','CA2','CA2','CA0'],
    'E008': ['CA3','CA0','CA3','CA0','CA3','CA3','CA0','CA3','CA0','CA3','CA3','CA0','CA3','CA0','CA3','CA3','CA0','CA3','CA0','CA3','CA3','CA0','CA3','CA0','CA3','CA0','CA0'],
    'E009': ['CA1','CA2','CA0','CA0','CA1','CA2','CA3','CA0','CA0','CA1','CA2','CA3','CA0','CA0','CA1','CA2','CA0','CA0','CA0','CA1','CA2','CA3','CA0','CA0','CA1','CA0','CA0'],
    'E010': ['CA1','CA1','CA0','CA0','CA1','CA1','CA1','CA0','CA0','CA1','CA1','CA1','CA0','CA0','CA1','CA1','CA1','CA0','CA0','CA1','CA1','CA1','CA0','CA0','CA1','CA1','CA0'],
  },

  // ── KPI NHÂN VIÊN ─────────────────────────────────────────────────
  employeeKpi: [
    { id: 'E001', score: 98, tasks: 12, done: 12, metrics: { 'Báo cáo đúng hạn': 100, 'Kiểm tra hiện trường': 96, 'Phòng chống thiên tai': 98 } },
    { id: 'E002', score: 95, tasks: 18, done: 17, metrics: { 'Xử lý lệnh điều hành': 97, 'Điều phối ƯCSC': 93, 'Báo cáo BCH': 96 } },
    { id: 'E003', score: 88, tasks: 22, done: 20, metrics: { 'Kiểm tra kỹ thuật': 90, 'Báo cáo sự cố': 88, 'Hỗ trợ vận hành': 86 } },
    { id: 'E004', score: 92, tasks: 20, done: 19, metrics: { 'Tuần tra đê điều': 95, 'Xử lý vi phạm': 88, 'Lập hồ sơ': 93 } },
    { id: 'E005', score: 85, tasks: 15, done: 13, metrics: { 'Quản lý nhân sự': 88, 'Hành chính': 82, 'Chấm công': 86 } },
    { id: 'E006', score: 78, tasks: 10, done: 8,  metrics: { 'Thanh tra': 80, 'Lập biên bản': 76, 'Pháp chế': 78 } },
    { id: 'E007', score: 91, tasks: 25, done: 23, metrics: { 'Vận hành cống bơm': 94, 'Bảo dưỡng thiết bị': 88, 'An toàn vận hành': 91 } },
    { id: 'E008', score: 87, tasks: 28, done: 25, metrics: { 'Hộ đê mùa lũ': 90, 'Giám sát sự cố': 85, 'Báo cáo': 87 } },
    { id: 'E009', score: 82, tasks: 16, done: 14, metrics: { 'Thiết kế kỹ thuật': 85, 'Tính toán': 80, 'Báo cáo': 82 } },
    { id: 'E010', score: 96, tasks: 20, done: 20, metrics: { 'Uptime hệ thống': 99, 'Bảo mật': 95, 'Hỗ trợ kỹ thuật': 94 } },
  ],

  // ── NHẬT KÝ THAO TÁC ──────────────────────────────────────────────
  activityLog: [
    { id: 1, time: '2026-03-12 10:45:22', user: 'huong@hadiwa.vn', type: 'CREATE', action: 'Tạo lệnh điều hành khẩn', target: 'CMD-007', ip: '192.168.1.15', details: '{"cmd":"CMD-007","priority":"critical","target":"Ba Vì"}' },
    { id: 2, time: '2026-03-12 09:30:11', user: 'tuan@hadiwa.vn', type: 'UPDATE', action: 'Cập nhật trạng thái sự cố', target: 'SC-006', ip: '192.168.1.22', details: '{"incident":"SC-006","oldStatus":"new","newStatus":"processing"}' },
    { id: 3, time: '2026-03-12 08:15:05', user: 'admin@hadiwa.vn', type: 'SYSTEM', action: 'Backup dữ liệu hệ thống', target: 'DB_HADIWA', ip: '127.0.0.1', details: '{"size":"2.4GB","duration":"00:08:12","status":"success"}' },
    { id: 4, time: '2026-03-12 07:00:33', user: 'ngoc@hadiwa.vn', type: 'CREATE', action: 'Nộp báo cáo hộ đê tuần', target: 'RPT-2026-03-W2', ip: '192.168.1.31', details: '{"report":"RPT-2026-03-W2","pages":8,"sections":["D01","D02","D05"]}' },
    { id: 5, time: '2026-03-12 06:45:00', user: 'son@hadiwa.vn', type: 'UPDATE', action: 'Kích hoạt chế độ khẩn cấp PCTT', target: 'SYSTEM_STATUS', ip: '192.168.1.10', details: '{"level":"emergency","trigger":"flood_alert","stations":["TV01","TV02"]}' },
    { id: 6, time: '2026-03-11 22:10:14', user: 'admin@hadiwa.vn', type: 'UPDATE', action: 'Đổi mật khẩu tài khoản', target: 'E003 – Lê Hùng Cường', ip: '192.168.1.1', details: '{"uid":"E003","reason":"scheduled_rotation"}' },
    { id: 7, time: '2026-03-11 18:30:00', user: 'binh@hadiwa.vn', type: 'CREATE', action: 'Ghi nhận vị trí kiểm tra đê', target: 'D05 – Hữu Đáy K18+500', ip: '10.0.0.45', details: '{"gps":"21.105,105.518","photo":true,"findings":"Mạch sủi nghiêm trọng"}' },
    { id: 8, time: '2026-03-11 14:00:22', user: 'huong@hadiwa.vn', type: 'EXPORT', action: 'Xuất báo cáo thiệt hại tháng 3', target: 'EXPORT_RPT_202603', ip: '192.168.1.15', details: '{"format":"PDF","rows":124,"requestedBy":"BCH PCTT TP"}' },
    { id: 9, time: '2026-03-11 11:25:00', user: 'cuong@hadiwa.vn', type: 'UPDATE', action: 'Cập nhật thông số trạm TV04', target: 'TV04 – Ba Thá', ip: '192.168.1.23', details: '{"field":"alertLevel2","old":5.0,"new":5.5}' },
    { id: 10, time: '2026-03-11 09:00:11', user: 'van@hadiwa.vn', type: 'CREATE', action: 'Tạo biên bản vi phạm hành lang đê', target: 'BB-2026-03-042', ip: '10.0.0.12', details: '{"location":"D01 K42+200","type":"construction_violation","fineAmount":25000000}' },
    { id: 11, time: '2026-03-10 16:45:00', user: 'admin@hadiwa.vn', type: 'CREATE', action: 'Thêm tài khoản nhân viên mới', target: 'E009 – Lý Thị Thảo', ip: '192.168.1.1', details: '{"uid":"E009","role":"KY_THUAT","dept":"Phòng QLTL"}' },
    { id: 12, time: '2026-03-10 08:00:00', user: 'admin@hadiwa.vn', type: 'SYSTEM', action: 'Cập nhật phần mềm hệ thống v2.4.1', target: 'HADIWA_IOC', ip: '127.0.0.1', details: '{"version":"2.4.1","modules":["GIS","IoT","Reports"],"duration":"00:05:30"}' },
  ],

  // ── VĂN BẢN PCTT HÀ NỘI ──────────────────────────────────────────
  pcttDocuments: [
    { id: 'VB-001', title: 'Phương án hộ đê năm 2026 – Chi cục Thủy lợi & PCTT TP. Hà Nội', type: 'plan', issuer: 'Chi cục Thủy lợi & PCTT', date: '15/01/2026', status: 'approved', file: 'PA_hode_HaNoi_2026.pdf' },
    { id: 'VB-002', title: 'Phương án phòng chống lũ lụt, úng ngập TP. Hà Nội 2026', type: 'plan', issuer: 'BCH PCTT TP. Hà Nội', date: '20/12/2025', status: 'approved', file: 'PA_PCL_HaNoi.pdf' },
    { id: 'VB-003', title: 'Quyết định phân công trực hộ đê mùa mưa lũ 2026', type: 'decision', issuer: 'Sở NN&PTNT Hà Nội', date: '01/03/2026', status: 'active', file: 'QD_truc_hode_2026.pdf' },
    { id: 'VB-004', title: 'Công văn kiểm tra công trình thủy lợi, hồ đập trước mùa mưa lũ', type: 'dispatch', issuer: 'UBND TP. Hà Nội', date: '10/02/2026', status: 'active', file: 'CV_KT_CT.pdf' },
    { id: 'VB-005', title: 'Kế hoạch diễn tập phòng chống thiên tai cấp thành phố 2026', type: 'plan', issuer: 'BCH PCTT TP. Hà Nội', date: '25/01/2026', status: 'pending', file: 'KH_dientap_2026.pdf' },
    { id: 'VB-006', title: 'Báo cáo tổng kết PCTT – tìm kiếm cứu nạn năm 2025', type: 'report', issuer: 'Chi cục Thủy lợi & PCTT', date: '31/12/2025', status: 'approved', file: 'BC_tongket_PCTT_2025.pdf' },
    { id: 'VB-007', title: 'Quy trình vận hành liên hồ chứa trên lưu vực sông Hồng mùa lũ', type: 'decision', issuer: 'Bộ NN&PTNT', date: '05/01/2026', status: 'approved', file: 'QT_van_hanh_lien_ho.pdf' },
  ],

  // ── 4 TẠI CHỖ ─────────────────────────────────────────────────────
  fourOnSite: {
    lucluong: [
      { unit: 'Q. Long Biên – Gia Lâm', total: 3200, onCall: 960, trained: 2200 },
      { unit: 'H. Đông Anh – Sóc Sơn', total: 4100, onCall: 1230, trained: 2900 },
      { unit: 'H. Đan Phượng – Phúc Thọ', total: 2800, onCall: 840, trained: 1950 },
      { unit: 'H. Chương Mỹ – Thường Tín', total: 3500, onCall: 1050, trained: 2400 },
      { unit: 'H. Mỹ Đức – Ứng Hòa', total: 2600, onCall: 780, trained: 1800 },
      { unit: 'H. Ba Vì – Thạch Thất', total: 3800, onCall: 1140, trained: 2650 },
    ],
    phuongtien: [
      { type: 'Xe cứu thương', count: 28, ready: 26 },
      { type: 'Xuồng máy', count: 185, ready: 172 },
      { type: 'Máy bơm nước', count: 120, ready: 112 },
      { type: 'Máy phát điện', count: 95, ready: 88 },
      { type: 'Ô tô tải công trình', count: 65, ready: 60 },
      { type: 'Máy xúc/ủi', count: 35, ready: 32 },
    ],
    vattu: [
      { item: 'Cừ thép (m)', quantity: 35000, allocated: 12000, unit: 'm' },
      { item: 'Đá hộc (m³)', quantity: 18500, allocated: 6800, unit: 'm³' },
      { item: 'Bao cát', quantity: 850000, allocated: 280000, unit: 'bao' },
      { item: 'Rọ đá (m³)', quantity: 12500, allocated: 4200, unit: 'm³' },
      { item: 'Vải địa kỹ thuật (m²)', quantity: 85000, allocated: 28000, unit: 'm²' },
      { item: 'Cọc tre (cây)', quantity: 120000, allocated: 40000, unit: 'cây' },
    ],
    haugian: {
      food_packs: 180000,
      water_liters: 850000,
      medical_kits: 2400,
      temporary_shelters: 125,
      evacuation_sites: 58,
    }
  },

  // ── CHARTS DATA ──────────────────────────────────────────────────
  hourlyHeatmap: Array.from({ length: 7 }, () =>
    Array.from({ length: 24 }, () => Math.random() * 250)
  ),

  // ── LỆNH ĐIỀU HÀNH ──────────────────────────────────────────────
  commandLogs: [
    { id: 'CMD-001', action: 'Phát lệnh sơ tán dân vùng ven hồ Tuy Lai', by: 'Trần Thị Hương', time: '2026-03-12 05:15', status: 'executed', priority: 'critical' },
    { id: 'CMD-002', action: 'Điều động đội ƯCSC số 3 đến Đê Hữu Đáy K18+500', by: 'Nguyễn Văn Sơn', time: '2026-03-12 06:45', status: 'executed', priority: 'critical' },
    { id: 'CMD-003', action: 'Mở tràn xả lũ hồ Tuy Lai – 3 khoang', by: 'Trần Thị Hương', time: '2026-03-12 05:30', status: 'executed', priority: 'high' },
    { id: 'CMD-004', action: 'Phê duyệt phương án gia cố đê Hữu Đáy đoạn K18+500', by: '', time: '', status: 'pending_approval', priority: 'high', requestedBy: 'Phạm Thị Ngọc', requestedAt: '2026-03-12 08:00' },
    { id: 'CMD-005', action: 'Điều động máy bơm dự phòng đến Cổ Nhuế', by: '', time: '', status: 'pending_approval', priority: 'high', requestedBy: 'Đỗ Mạnh Tuân', requestedAt: '2026-03-12 09:30' },
    { id: 'CMD-006', action: 'Phát cảnh báo lũ cấp độ 1 sông Đáy đến các xã ven sông', by: '', time: '', status: 'pending_approval', priority: 'critical', requestedBy: 'Trần Thị Hương', requestedAt: '2026-03-12 10:00' },
    { id: 'CMD-007', action: 'Ban bố tình trạng khẩn cấp vùng H. Ba Vì', by: '', time: '', status: 'pending_approval', priority: 'critical', requestedBy: 'Nguyễn Văn Sơn', requestedAt: '2026-03-12 10:45' },
    { id: 'CMD-008', action: 'Kiểm tra đột xuất đê Hữu Hồng đoạn K22 sau sự cố sạt mái', by: 'Hoàng Văn Bình', time: '2026-03-11 16:00', status: 'executed', priority: 'high' },
  ],

  // ── TRUYỀN THÔNG PCTT ──────────────────────────────────────────
  mediaContent: [
    { id: 'M001', title: 'Hướng dẫn sơ tán khẩn cấp khi vỡ đê sông Hồng', type: 'video', views: 48200, date: '2026-02-28' },
    { id: 'M002', title: 'Các vùng ngập lụt khi lũ sông Hồng ≥ BĐ3 tại Hà Nội', type: 'article', views: 35800, date: '2026-03-01' },
    { id: 'M003', title: 'Kỹ thuật bồi trúc đê bằng bao cát khẩn cấp', type: 'video', views: 22400, date: '2026-03-05' },
    { id: 'M004', title: 'Tin tức: Tập huấn hộ đê cho xung kích địa phương', type: 'news', views: 18500, date: '2026-03-10' },
  ],

  // ── KỊCH BẢN VẬN HÀNH CỐNG/BƠM ──────────────────────────────────
  pumpProfiles: [
    { id: 'P01', name: 'Kịch bản Mùa Lũ', type: 'flood', isActive: true, color: '#ff3c50', desc: 'Ưu tiên tiêu thoát nước khẩn cấp, vận hành 100% công suất.', conditions: 'Mực nước Sông Hồng ≥ BĐ2 (10.5m) hoặc mưa 24h > 150mm', schedules: { 'TV07': [[0,24]], 'TV08': [[0,24]], 'TB01': [[0,24]], 'TB02': [[0,20],[22,24]], 'TB03': [[4,24]], 'CO01': [[0,12]], 'CO02': [[12,24]], 'CO03': [[6,18]] } },
    { id: 'P02', name: 'Kịch bản Bão/Áp thấp', type: 'storm', isActive: false, color: '#ff9800', desc: 'Vận hành đón bão, hạ thấp mực nước đệm, chuẩn bị dung tích trữ.', conditions: 'Trước 24h khi bão cấp ≥ 8 ảnh hưởng đến Hà Nội', schedules: { 'TV07': [[4,12],[20,24]], 'TV08': [[0,8],[16,24]], 'TB01': [[6,14]], 'TB02': [[8,16]], 'TB03': [[0,6],[18,24]], 'CO01': [[0,24]], 'CO02': [[4,20]], 'CO03': [[0,10]] } },
    { id: 'P03', name: 'Kịch bản Mùa Hạn', type: 'dry', isActive: false, color: '#00e676', desc: 'Tưới luân phiên, tiết kiệm nước và điện năng, ưu tiên sinh hoạt.', conditions: 'Mực nước hồ < 60% dung tích hữu ích liên tiếp 7 ngày', schedules: { 'TV07': [[22,4]], 'TV08': [[0,4]], 'TB01': [[20,24]], 'TB02': [[0,2],[22,24]], 'TB03': [], 'CO01': [[6,10]], 'CO02': [[14,18]], 'CO03': [] } },
    { id: 'P04', name: 'Vận hành Bình thường', type: 'normal', isActive: false, color: '#00c8ff', desc: 'Duy trì mực nước ổn định phục vụ sản xuất và môi trường.', conditions: 'Thời tiết bình thường, không có cảnh báo thiên tai', schedules: { 'TV07': [[4,8],[16,20]], 'TV08': [[6,10],[18,22]], 'TB01': [[5,9]], 'TB02': [[6,10],[17,21]], 'TB03': [[7,11]], 'CO01': [[8,12]], 'CO02': [[8,16]], 'CO03': [[9,13]] } },
    { id: 'P05', name: 'Tiêu úng nội đồng', type: 'drainage', isActive: false, color: '#9c27b0', desc: 'Tập trung tiêu úng ruộng khi lúa ngập > 24h sau mưa lớn.', conditions: 'Mưa 50–150mm/24h, diện tích lúa bị úng > 500ha', schedules: { 'TV07': [[6,18]], 'TV08': [[6,18]], 'TB01': [[8,20]], 'TB02': [[8,22]], 'TB03': [[6,20]], 'CO01': [[10,16]], 'CO02': [], 'CO03': [[12,20]] } },
    { id: 'P06', name: 'Vận hành Tết / Lễ', type: 'holiday', isActive: false, color: '#e91e63', desc: 'Chế độ trực rút gọn ngày lễ, vận hành tự động tối thiểu.', conditions: 'Ngày nghỉ lễ Tết Nguyên Đán và các kỳ nghỉ dài ngày', schedules: { 'TV07': [[0,6],[18,24]], 'TV08': [[0,6]], 'TB01': [[4,8]], 'TB02': [], 'TB03': [], 'CO01': [], 'CO02': [[8,12]], 'CO03': [] } },
    { id: 'P07', name: 'Kiểm tra Tải đỉnh', type: 'test', isActive: false, color: '#607d8b', desc: 'Kiểm tra năng lực tải đỉnh toàn hệ thống định kỳ hàng quý.', conditions: 'Thực hiện Q1/Q3 hàng năm, trong 2 giờ liên tục ban ngày', schedules: { 'TV07': [[10,12]], 'TV08': [[10,12]], 'TB01': [[10,12]], 'TB02': [[10,12]], 'TB03': [[10,12]], 'CO01': [[10,12]], 'CO02': [[10,12]], 'CO03': [[10,12]] } },
  ],

  pumpStations: [
    { id: 'TV07', name: 'Trạm bơm Cổ Nhuế', type: 'pump', capacity: 45.0, unit: 'm³/s', district: 'Q. Bắc Từ Liêm', status: 'ok', pumps: 6, activePumps: 6, power: 2800 },
    { id: 'TV08', name: 'Trạm bơm Yên Sở', type: 'pump', capacity: 90.0, unit: 'm³/s', district: 'Q. Hoàng Mai', status: 'ok', pumps: 8, activePumps: 8, power: 5600 },
    { id: 'TB01', name: 'Trạm bơm Đan Hoài', type: 'pump', capacity: 12.0, unit: 'm³/s', district: 'H. Đan Phượng', status: 'warning', pumps: 4, activePumps: 3, power: 750 },
    { id: 'TB02', name: 'Trạm bơm Tiên Tân', type: 'pump', capacity: 18.5, unit: 'm³/s', district: 'H. Chương Mỹ', status: 'ok', pumps: 5, activePumps: 5, power: 1200 },
    { id: 'TB03', name: 'Trạm bơm Phù Sa', type: 'pump', capacity: 28.0, unit: 'm³/s', district: 'H. Phúc Thọ', status: 'ok', pumps: 6, activePumps: 6, power: 1680 },
    { id: 'CO01', name: 'Cống Liên Mạc', type: 'sluice', capacity: 85.2, unit: 'm³/s', district: 'Q. Bắc Từ Liêm', status: 'ok', gates: 4, openGates: 4, power: 0 },
    { id: 'CO02', name: 'Cống Cẩm Đình', type: 'sluice', capacity: 42.5, unit: 'm³/s', district: 'H. Phúc Thọ', status: 'critical', gates: 3, openGates: 1, power: 0 },
    { id: 'CO03', name: 'Cống Hà Bình', type: 'sluice', capacity: 28.6, unit: 'm³/s', district: 'H. Thường Tín', status: 'ok', gates: 2, openGates: 2, power: 0 },
  ],
}; 
window.DATA = DATA; // expose globally for all page modules


