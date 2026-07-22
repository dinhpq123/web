// ══════════════════════════════════════════════════════════════════
// GIS BẢN ĐỒ THỦY LỢI & ĐÊ ĐIỀU — HADIWA IOC
// Features: Vùng đê điều, kênh tưới/tiêu, cống/trạm thủy văn,
//           toggle panel, layer controls, khu vực filter
// ══════════════════════════════════════════════════════════════════
let gisMap = null;
let gisLayers = {
  stations: [],     // Trạm thủy văn / đo mưa
  factories: [],    // Trạm bơm / Hồ chứa
  incidents: [],    // Vị trí sự cố đê điều
  dikes: [],        // Tuyến đê / kênh chính
  dmaPolygons: {},  // Vùng bảo vệ đê
  flood: [],        // GIS-1: Điểm cảm biến ngập lụt
  floodPolygons: [], // GIS-1: Vùng ngập lụt
  landslide: [],    // GIS-2: Điểm/vùng sạt lở
  resources: [],    // GIS-3: 4 Tại chỗ (kho, sở chỉ huy, phương tiện)
};

// ── GIS LAYER: NGẬP LỤT THỜI GIAN THỰC ─────────────────────────
const GIS_FLOOD_SENSORS = [
  { id:'FL-01', name:'Cảm biến Hà Đông – KCN', lat:20.974, lng:105.780, level:0.45, unit:'m', trend:'up', status:'warning', timestamp:'25/03 12:30', history:[0.1,0.2,0.35,0.45] },
  { id:'FL-02', name:'Cảm biến Chương Mỹ – TT', lat:20.615, lng:105.625, level:1.20, unit:'m', trend:'up', status:'danger', timestamp:'25/03 12:28', history:[0.5,0.8,1.0,1.2] },
  { id:'FL-03', name:'Cảm biến Quốc Oai – Chợ cũ', lat:20.840, lng:105.615, level:0.25, unit:'m', trend:'stable', status:'ok', timestamp:'25/03 12:25', history:[0.2,0.22,0.24,0.25] },
  { id:'FL-04', name:'Cảm biến Ba Vì – Tt. Tây Đằng', lat:21.015, lng:105.370, level:0.65, unit:'m', trend:'up', status:'warning', timestamp:'25/03 12:20', history:[0.3,0.45,0.55,0.65] },
  { id:'FL-05', name:'Cảm biến Đan Phượng – Đồng Tháp', lat:21.085, lng:105.645, level:0.12, unit:'m', trend:'down', status:'ok', timestamp:'25/03 12:35', history:[0.3,0.22,0.18,0.12] },
  { id:'FL-06', name:'Cảm biến Mỹ Đức – Hương Sơn', lat:20.545, lng:105.765, level:0.88, unit:'m', trend:'up', status:'danger', timestamp:'25/03 12:15', history:[0.4,0.6,0.75,0.88] },
  { id:'FL-07', name:'Cảm biến Phúc Thọ – Thọ Lộc', lat:21.065, lng:105.545, level:0.32, unit:'m', trend:'stable', status:'ok', timestamp:'25/03 12:10', history:[0.28,0.3,0.32,0.32] },
  { id:'FL-08', name:'Cảm biến Hoài Đức – La Phù', lat:20.985, lng:105.720, level:0.55, unit:'m', trend:'up', status:'warning', timestamp:'25/03 12:05', history:[0.2,0.35,0.45,0.55] },
  { id:'FL-09', name:'Cảm biến Ứng Hòa – Hòa Lâm', lat:20.530, lng:105.860, level:0.95, unit:'m', trend:'up', status:'danger', timestamp:'25/03 12:00', history:[0.5,0.65,0.8,0.95] },
  { id:'FL-10', name:'Cảm biến Sơn Tây – Cổ Đông', lat:21.125, lng:105.520, level:0.18, unit:'m', trend:'stable', status:'ok', timestamp:'25/03 11:55', history:[0.15,0.17,0.18,0.18] },
  { id:'FL-11', name:'Cảm biến Thường Tín – Hà Hồi', lat:20.800, lng:105.885, level:0.72, unit:'m', trend:'up', status:'warning', timestamp:'25/03 11:50', history:[0.35,0.5,0.62,0.72] },
  { id:'FL-12', name:'Cảm biến Phú Xuyên – Tri Trung', lat:20.680, lng:105.895, level:0.42, unit:'m', trend:'down', status:'warning', timestamp:'25/03 11:45', history:[0.6,0.55,0.48,0.42] },
  { id:'FL-13', name:'Cảm biến Thanh Oai – Kim Thư', lat:20.720, lng:105.755, level:0.28, unit:'m', trend:'stable', status:'ok', timestamp:'25/03 11:40', history:[0.25,0.27,0.28,0.28] },
  { id:'FL-14', name:'Cảm biến Gia Lâm – Đa Tốn', lat:21.010, lng:105.970, level:0.15, unit:'m', trend:'stable', status:'ok', timestamp:'25/03 11:35', history:[0.12,0.14,0.15,0.15] },
  { id:'FL-15', name:'Cảm biến Long Biên – Bát Tràng', lat:20.995, lng:105.940, level:0.08, unit:'m', trend:'down', status:'ok', timestamp:'25/03 11:30', history:[0.15,0.12,0.1,0.08] },
];

// Vùng ngập (polygon) - màu theo cấp cảnh báo
const GIS_FLOOD_ZONES = [
  { id:'FZ-01', name:'Vùng ngập Chương Mỹ', level:'danger', coords:[[20.60,105.60],[20.63,105.60],[20.63,105.65],[20.60,105.65]], affectedHa:2500, affectedPeople:8500, maxDepth:1.35 },
  { id:'FZ-02', name:'Vùng ngập Hà Đông', level:'warning', coords:[[20.96,105.76],[20.99,105.76],[20.99,105.80],[20.96,105.80]], affectedHa:580, affectedPeople:2100, maxDepth:0.6 },
  { id:'FZ-03', name:'Vùng ngập Mỹ Đức', level:'danger', coords:[[20.53,105.75],[20.56,105.75],[20.56,105.79],[20.53,105.79]], affectedHa:1800, affectedPeople:5200, maxDepth:1.0 },
  { id:'FZ-04', name:'Vùng ngập Ứng Hòa', level:'warning', coords:[[20.52,105.85],[20.55,105.85],[20.55,105.89],[20.52,105.89]], affectedHa:920, affectedPeople:3100, maxDepth:0.95 },
];

// ── GIS LAYER: SẠT LỞ ──────────────────────────────────────────
const GIS_LANDSLIDE_ZONES = [
  { id:'LS-01', name:'Sạt lở bờ sông Đà – Ba Vì', lat:21.040, lng:105.355, level:'high', type:'river_bank', affectedPeople:450, affectedArea:'12.5 ha', discoveredDate:'15/03/2026', status:'monitoring', note:'Sạt lở bờ phải sông Đà, đoạn dài ~350m. Đã cắm biển cảnh báo, di dời 12 hộ dân.' },
  { id:'LS-02', name:'Sạt trượt đất Khoắn – Chương Mỹ', lat:20.638, lng:105.583, level:'critical', type:'slope', affectedPeople:820, affectedArea:'8.2 ha', discoveredDate:'22/03/2026', status:'emergency', note:'Sạt trượt đất mái taluy dương QL6. Nguy cơ cao ảnh hưởng khu dân cư. Đang xử lý khẩn.' },
  { id:'LS-03', name:'Sạt lở đê Tả Đáy – Hà Đông', lat:20.952, lng:105.776, level:'medium', type:'dike', affectedPeople:180, affectedArea:'3.1 ha', discoveredDate:'10/03/2026', status:'repairing', note:'Sạt lở mái đê. Đang tiến hành gia cố, dự kiến hoàn thành 30/03/2026.' },
  { id:'LS-04', name:'Sạt lở bờ sông Tích – Sơn Tây', lat:21.042, lng:105.518, level:'high', type:'river_bank', affectedPeople:320, affectedArea:'5.8 ha', discoveredDate:'18/03/2026', status:'monitoring', note:'Sạt lở bờ trái sông Tích, đoạn ~200m. Cắm mốc quan trắc, chờ phương án xử lý.' },
  { id:'LS-05', name:'Sạt lở bờ sông Đáy – Mỹ Đức', lat:20.545, lng:105.660, level:'medium', type:'river_bank', affectedPeople:95, affectedArea:'2.4 ha', discoveredDate:'05/03/2026', status:'monitoring', note:'Sạt lở nhỏ, đang theo dõi định kỳ hàng tuần.' },
  { id:'LS-06', name:'Sạt bờ kênh thủy lợi – Ứng Hòa', lat:20.518, lng:105.855, level:'medium', type:'canal', affectedPeople:60, affectedArea:'1.2 ha', discoveredDate:'20/03/2026', status:'monitoring', note:'Sạt lở mái kênh dẫn nước. Chưa ảnh hưởng dân cư.' },
  { id:'LS-07', name:'Sạt trượt đất – Quốc Oai', lat:20.855, lng:105.600, level:'low', type:'slope', affectedPeople:0, affectedArea:'0.8 ha', discoveredDate:'28/02/2026', status:'resolved', note:'Đã xử lý xong. Trồng cỏ gia cố mái dốc.' },
  { id:'LS-08', name:'Sạt lở bờ sông Hồng – Long Biên', lat:21.020, lng:105.930, level:'high', type:'river_bank', affectedPeople:240, affectedArea:'4.5 ha', discoveredDate:'21/03/2026', status:'monitoring', note:'Sạt lở bờ phải sông Hồng đoạn Bát Tràng. Theo dõi liên tục.' },
];

// ── GIS LAYER: 4 TẠI CHỖ ────────────────────────────────────────
const GIS_RESOURCES_4TC = [
  // Kho vật tư (type:'warehouse')
  { id:'KVT-01', name:'Kho vật tư PCTT Mỹ Đức', type:'warehouse', commune:'Huyện Mỹ Đức', lat:20.542, lng:105.745, items:[{name:'Bao cát',qty:8000,unit:'bao'},{name:'Máy bơm nước',qty:3,unit:'máy'},{name:'Cọc tiêu',qty:200,unit:'cái'}], lastCheck:'20/03/2026' },
  { id:'KVT-02', name:'Kho vật tư PCTT Chương Mỹ', type:'warehouse', commune:'Huyện Chương Mỹ', lat:20.622, lng:105.624, items:[{name:'Bao cát',qty:12000,unit:'bao'},{name:'Xuồng cao su',qty:5,unit:'chiếc'},{name:'Áo phao',qty:80,unit:'cái'}], lastCheck:'22/03/2026' },
  { id:'KVT-03', name:'Kho vật tư TL Ba Vì', type:'warehouse', commune:'Huyện Ba Vì', lat:21.022, lng:105.368, items:[{name:'Bao cát',qty:5000,unit:'bao'},{name:'Cừ thép',qty:50,unit:'thanh'},{name:'Đá hộc',qty:100,unit:'m³'}], lastCheck:'18/03/2026' },
  { id:'KVT-04', name:'Kho vật tư Hoài Đức', type:'warehouse', commune:'Huyện Hoài Đức', lat:20.990, lng:105.730, items:[{name:'Bao cát',qty:6000,unit:'bao'},{name:'Máy bơm',qty:2,unit:'máy'}], lastCheck:'19/03/2026' },
  { id:'KVT-05', name:'Kho PCTT Thanh Oai', type:'warehouse', commune:'Huyện Thanh Oai', lat:20.715, lng:105.748, items:[{name:'Bao cát',qty:4500,unit:'bao'},{name:'Phao bơi',qty:30,unit:'cái'}], lastCheck:'21/03/2026' },
  { id:'KVT-06', name:'Kho PCTT Ứng Hòa', type:'warehouse', commune:'Huyện Ứng Hòa', lat:20.530, lng:105.852, items:[{name:'Bao cát',qty:7000,unit:'bao'},{name:'Bạt che',qty:100,unit:'tấm'}], lastCheck:'23/03/2026' },
  { id:'KVT-07', name:'Kho PCTT Phú Xuyên', type:'warehouse', commune:'Huyện Phú Xuyên', lat:20.675, lng:105.890, items:[{name:'Bao cát',qty:3500,unit:'bao'},{name:'Máy bơm',qty:1,unit:'máy'}], lastCheck:'20/03/2026' },
  { id:'KVT-08', name:'Kho PCTT Thường Tín', type:'warehouse', commune:'Huyện Thường Tín', lat:20.798, lng:105.878, items:[{name:'Bao cát',qty:4200,unit:'bao'},{name:'Xuồng',qty:2,unit:'chiếc'}], lastCheck:'22/03/2026' },
  // Sở chỉ huy (type:'command')
  { id:'SCH-01', name:'SCH PCTT Huyện Ba Vì', type:'command', commune:'Huyện Ba Vì', lat:21.030, lng:105.415, personnel:45, contact:'0243.xxx.001', established:'10/03/2026' },
  { id:'SCH-02', name:'SCH PCTT Huyện Chương Mỹ', type:'command', commune:'Huyện Chương Mỹ', lat:20.615, lng:105.630, personnel:52, contact:'0243.xxx.002', established:'14/03/2026' },
  { id:'SCH-03', name:'SCH PCTT Huyện Mỹ Đức', type:'command', commune:'Huyện Mỹ Đức', lat:20.545, lng:105.765, personnel:38, contact:'0243.xxx.003', established:'12/03/2026' },
  { id:'SCH-04', name:'SCH PCTT Huyện Ứng Hòa', type:'command', commune:'Huyện Ứng Hòa', lat:20.540, lng:105.850, personnel:41, contact:'0243.xxx.004', established:'15/03/2026' },
  { id:'SCH-05', name:'SCH PCTT Huyện Thanh Oai', type:'command', commune:'Huyện Thanh Oai', lat:20.720, lng:105.755, personnel:35, contact:'0243.xxx.005', established:'13/03/2026' },
  { id:'SCH-06', name:'SCH PCTT Huyện Hoài Đức', type:'command', commune:'Huyện Hoài Đức', lat:20.985, lng:105.728, personnel:30, contact:'0243.xxx.006', established:'16/03/2026' },
  { id:'SCH-07', name:'SCH PCTT Huyện Phúc Thọ', type:'command', commune:'Huyện Phúc Thọ', lat:21.065, lng:105.540, personnel:28, contact:'0243.xxx.007', established:'17/03/2026' },
  { id:'SCH-08', name:'SCH PCTT Huyện Quốc Oai', type:'command', commune:'Huyện Quốc Oai', lat:20.845, lng:105.605, personnel:33, contact:'0243.xxx.008', established:'18/03/2026' },
  // Bãi tập kết phương tiện (type:'vehicle')
  { id:'PT-01', name:'Bãi tập kết PT Ba Vì', type:'vehicle', commune:'Huyện Ba Vì', lat:21.010, lng:105.390, vehicles:[{name:'Xe chuyên dụng cứu hộ',qty:3},{name:'Xuồng máy',qty:8},{name:'Xe tải vật tư',qty:5}] },
  { id:'PT-02', name:'Bãi tập kết PT Chương Mỹ', type:'vehicle', commune:'Huyện Chương Mỹ', lat:20.630, lng:105.610, vehicles:[{name:'Xe cứu hộ lội nước',qty:2},{name:'Xuồng cao su',qty:12},{name:'Xe tải',qty:4}] },
  { id:'PT-03', name:'Bãi tập kết PT Mỹ Đức', type:'vehicle', commune:'Huyện Mỹ Đức', lat:20.555, lng:105.755, vehicles:[{name:'Xuồng máy',qty:6},{name:'Xe tải vật tư',qty:3}] },
  { id:'PT-04', name:'Bãi tập kết PT Ứng Hòa', type:'vehicle', commune:'Huyện Ứng Hòa', lat:20.522, lng:105.840, vehicles:[{name:'Xuồng cao su',qty:8},{name:'Xe tải',qty:2}] },
  { id:'PT-05', name:'Bãi tập kết PT Hoài Đức', type:'vehicle', commune:'Huyện Hoài Đức', lat:20.975, lng:105.715, vehicles:[{name:'Xe chuyên dụng',qty:2},{name:'Xuồng',qty:4},{name:'Xe tải',qty:3}] },
  { id:'PT-06', name:'Bãi tập kết PT Phú Xuyên', type:'vehicle', commune:'Huyện Phú Xuyên', lat:20.685, lng:105.880, vehicles:[{name:'Xuồng máy',qty:5},{name:'Xe tải',qty:2}] },
  { id:'PT-07', name:'Bãi tập kết PT Thường Tín', type:'vehicle', commune:'Huyện Thường Tín', lat:20.808, lng:105.866, vehicles:[{name:'Xuồng cao su',qty:7},{name:'Xe tải',qty:3}] },
  { id:'PT-08', name:'Bãi tập kết PT Quốc Oai', type:'vehicle', commune:'Huyện Quốc Oai', lat:20.858, lng:105.588, vehicles:[{name:'Xe chuyên dụng',qty:1},{name:'Xuồng',qty:5}] },
  { id:'PT-09', name:'Bãi tập kết PT Sơn Tây', type:'vehicle', commune:'Thị xã Sơn Tây', lat:21.118, lng:105.508, vehicles:[{name:'Xe cứu hộ',qty:2},{name:'Xuồng',qty:6}] },
  { id:'PT-10', name:'Bãi tập kết PT Phúc Thọ', type:'vehicle', commune:'Huyện Phúc Thọ', lat:21.058, lng:105.535, vehicles:[{name:'Xuồng máy',qty:4},{name:'Xe tải',qty:2}] },
];
let gisFactoryFilter = 'all';

let gisDmaVisibility = {};  // { dmaId: bool }
let gisLayerFlags = {
  stations: true, factories: true, incidents: true,
  dikes: true, dmaZones: true, dmaLabels: true, sluices: true,
  flood: true, landslide: true, resources4tc: true,
};

// ── DIKE COLOR MAPPING ────────────────────────────────────────────
function getDikeStyle(dike) {
  const isMajor = dike.type === 'major' || dike.type === 'transmission';
  const isMinor = dike.type === 'minor' || dike.type === 'meter';
  const statusColors = {
    active: '#00f080',   // An toàn
    warning: '#ffdb4d',  // Cảnh báo
    danger: '#ff9500',   // Nguy hiểm
    emergency: '#ff3d57', // Khẩn cấp
    closed: '#546e7a',
  };
  const color = statusColors[dike.status] || '#00f080';
  return {
    color,
    weight: isMajor ? 5 : isMinor ? 3 : 4,
    opacity: isMajor ? 0.85 : 0.72,
    dashArray: dike.status === 'closed' ? '8 6' : null,
    lineCap: 'round',
    lineJoin: 'round',
  };
}

// ── SLUICE GATE SVG ICONS ─────────────────────────────────────────
function makeSluiceIcon(sluice) {
  const statusColors = { open: '#00e676', closed: '#ff1744', warning: '#ffca28', active: '#00c8ff' };
  const c = statusColors[sluice.status] || '#00e676';

  let svgInner = '';
  if (sluice.type === 'gate') {
    // Gate valve — rectangular body with lines
    svgInner = `
      <rect x="5" y="9" width="14" height="10" rx="2" fill="${c}22" stroke="${c}" stroke-width="1.5"/>
      <line x1="12" y1="4" x2="12" y2="9" stroke="${c}" stroke-width="2" stroke-linecap="round"/>
      <line x1="9" y1="4" x2="15" y2="4" stroke="${c}" stroke-width="2" stroke-linecap="round"/>
      <line x1="8" y1="13" x2="16" y2="13" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>
      ${sluice.status === 'closed' ? `<line x1="7" y1="11" x2="17" y2="17" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>` : ''}`;
  } else if (sluice.type === 'butterfly') {
    // Butterfly valve — circle with cross
    svgInner = `
      <circle cx="12" cy="14" r="6" fill="${c}22" stroke="${c}" stroke-width="1.5"/>
      <ellipse cx="12" cy="14" rx="2.5" ry="5.5" fill="${c}55" stroke="${c}" stroke-width="1"
        transform="rotate(${sluice.status === 'closed' ? 90 : 0} 12 14)"/>
      <line x1="12" y1="4" x2="12" y2="8" stroke="${c}" stroke-width="2" stroke-linecap="round"/>
      <line x1="9" y1="4" x2="15" y2="4" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`;
  } else if (sluice.type === 'check') {
    // Check valve — arrow shape
    svgInner = `
      <rect x="5" y="9" width="14" height="10" rx="2" fill="${c}22" stroke="${c}" stroke-width="1.5"/>
      <polyline points="9,19 14,14 9,9" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  } else if (sluice.type === 'meter') {
    // Flow meter — circular gauge
    svgInner = `
      <circle cx="12" cy="14" r="7" fill="${c}22" stroke="${c}" stroke-width="1.5"/>
      <circle cx="12" cy="14" r="3" fill="${c}55" stroke="${c}" stroke-width="1"/>
      <line x1="12" y1="7" x2="12" y2="5" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="17" y1="9" x2="18.5" y2="7.5" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="19" y1="14" x2="21" y2="14" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
      <text x="12" y="22" text-anchor="middle" font-size="5" fill="${c}" font-family="monospace">m³</text>`;
  }

  const outerRing = sluice.status === 'closed'
    ? `<circle cx="12" cy="14" r="11" fill="none" stroke="${c}" stroke-width="1" stroke-dasharray="3 2" opacity="0.5"/>`
    : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="28" viewBox="0 0 24 28">
    <circle cx="12" cy="14" r="11.5" fill="rgba(3,14,28,0.88)" stroke="${c}" stroke-width="1.5"/>
    ${outerRing}
    ${svgInner}
  </svg>`;

  return L.divIcon({
    html: svg,
    className: 'gis-sluice-icon',
    iconSize: [24, 28],
    iconAnchor: [12, 14],
    popupAnchor: [0, -14],
  });
}

// ── STATION DOT ICON ─────────────────────────────────────────────
function makeStationIcon(status) {
  const c = { online: '#00e676', warning: '#ffca28', offline: '#ff1744' }[status] || '#546e7a';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">
    <circle cx="13" cy="13" r="10" fill="rgba(3,14,28,.9)" stroke="${c}" stroke-width="2"/>
    <circle cx="13" cy="13" r="5" fill="${c}" opacity=".8"/>
    <circle cx="13" cy="13" r="5" fill="none" stroke="${c}" stroke-width="8" opacity=".12"/>
  </svg>`;
  return L.divIcon({ html: svg, className: '', iconSize: [26, 26], iconAnchor: [13, 13] });
}

// ── FACTORY ICON ─────────────────────────────────────────────────
function makeFactoryIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
    <rect x="3" y="3" width="24" height="24" rx="5" fill="rgba(3,14,28,.92)" stroke="#00c8ff" stroke-width="1.8"/>
    <rect x="8" y="14" width="4" height="9" fill="#00c8ff" opacity=".8"/>
    <rect x="13" y="12" width="4" height="11" fill="#00c8ff" opacity=".9"/>
    <rect x="18" y="16" width="4" height="7" fill="#00c8ff" opacity=".7"/>
    <line x1="7" y1="22" x2="23" y2="22" stroke="#00c8ff" stroke-width="1.2" opacity=".5"/>
    <line x1="8" y1="9" x2="8" y2="14" stroke="#00c8ff" stroke-width="1.5"/>
    <line x1="13" y1="8" x2="13" y2="12" stroke="#00c8ff" stroke-width="1.5"/>
    <line x1="18" y1="10" x2="18" y2="16" stroke="#00c8ff" stroke-width="1.5"/>
  </svg>`;
  return L.divIcon({ html: svg, className: '', iconSize: [30, 30], iconAnchor: [15, 15] });
}

// ── INCIDENT ICON ─────────────────────────────────────────────────
function makeIncidentIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">
    <polygon points="13,3 24,23 2,23" fill="rgba(255,23,68,.18)" stroke="#ff1744" stroke-width="2" stroke-linejoin="round"/>
    <line x1="13" y1="10" x2="13" y2="17" stroke="#ff5252" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="13" cy="20" r="1.5" fill="#ff5252"/>
  </svg>`;
  return L.divIcon({ html: svg, className: '', iconSize: [26, 26], iconAnchor: [13, 23] });
}

// ── DIKE POPUP BUILDER ────────────────────────────────────────────
function buildDikePopup(dike) {
  const statusLabel = {
    active: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--green);vertical-align:middle"></span> An toàn',
    warning: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--yellow);vertical-align:middle"></span> Cảnh báo',
    danger: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--orange);vertical-align:middle"></span> Nguy hiểm',
    emergency: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--red);vertical-align:middle"></span> Khẩn cấp',
  }[dike.status] || dike.status;
  const typeLabel = { major: 'Đê cấp I (Trung ương)', transmission: 'Đê cấp II', minor: 'Đê địa phương', meter: 'Kênh dẫn' }[dike.type] || dike.type;
  return `<div class="gis-popup-inner">
    <div class="gis-popup-title">${dike.label || dike.id}</div>
    <div class="gis-popup-sub">${typeLabel} · ${dike.id}</div>
    <div class="gis-popup-grid">
      <div><div class="gis-popup-key">Chiều dài</div><div class="gis-popup-val">${dike.length || '2.4'} km</div></div>
      <div><div class="gis-popup-key">Cao trình đỉnh</div><div class="gis-popup-val">+12.5 m</div></div>
      <div><div class="gis-popup-key">Mực nước</div><div class="gis-popup-val" style="color:#00c8ff">${dike.waterLevel || '8.2'} m</div></div>
      <div><div class="gis-popup-key">Độ an toàn</div><div class="gis-popup-val" style="color:#00f080">Đảm bảo</div></div>
    </div>
    <div class="gis-popup-status">${statusLabel}</div>
    ${dike.sluices?.length ? `<div class="gis-popup-key" style="margin-top:6px">Cống trên đoạn: <b>${dike.sluices.length}</b></div>` : ''}
    <div style="margin-top:10px">
      <button class="btn btn-primary btn-xs" style="width:100%" onclick="alert('Xem mặt cắt đê...')">Xem mặt cắt chi tiết</button>
    </div>
  </div>`;
}

// ── SLUICE POPUP ────────────────────────────────────────────────
function buildSluicePopup(sluice) {
  const typeLabel = { gate: 'Cống ngăn triều', butterfly: 'Cống tiêu úng', check: 'Cống 1 chiều', meter: 'Trạm hydrology' }[sluice.type] || sluice.type;
  const statusLabel = { open: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--green);vertical-align:middle"></span> Đang mở', closed: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--red);vertical-align:middle"></span> Đã đóng', warning: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--yellow);vertical-align:middle"></span> Cảnh báo', active: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--green);vertical-align:middle"></span> Hoạt động' }[sluice.status] || sluice.status;
  return `<div class="gis-popup-inner">
    <div class="gis-popup-title">${sluice.id}</div>
    <div class="gis-popup-sub">${typeLabel}</div>
    <div class="gis-popup-status">${statusLabel}</div>
    <div style="margin-top:8px;display:flex;gap:8px">
      <button onclick="this.closest('.leaflet-popup').remove()" style="flex:1;padding:5px;background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.3);color:#00c8ff;border-radius:6px;cursor:pointer;font-size:11px">Đóng</button>
      ${sluice.status === 'open' ? `<button onclick="this.closest('.leaflet-popup').remove()" style="flex:1;padding:5px;background:rgba(255,23,68,.1);border:1px solid rgba(255,23,68,.3);color:#ff5252;border-radius:6px;cursor:pointer;font-size:11px">Vận hành đóng</button>` : ''}
    </div>
  </div>`;
}

// ══════════════════════════════════════════════════════════════════
// PANEL VISIBILITY STATE
// ══════════════════════════════════════════════════════════════════
let gisPanelLeft = true;   // show left panel
let gisPanelRight = true;   // show right panel
let gisLegendVisible = false; // toggle pipe legend (default hidden)

function gisToggleLegend() {
  gisLegendVisible = !gisLegendVisible;
  const content = document.getElementById('gisLegendContent');
  const btn = document.getElementById('gisBtnToggleLegend');
  const header = document.getElementById('gisLegendHeader');
  if (content) content.style.display = gisLegendVisible ? 'block' : 'none';
  if (btn) btn.innerHTML = gisLegendVisible ? 'Ẩn' : 'Hiện';
  if (header) header.style.marginBottom = gisLegendVisible ? '10px' : '0';
}

function gisTogglePanel(side) {
  if (side === 'left') gisPanelLeft = !gisPanelLeft;
  if (side === 'right') gisPanelRight = !gisPanelRight;

  const grid = document.getElementById('gisMainGrid');
  const leftPanel = document.getElementById('gisPanelLeft');
  const rightPanel = document.getElementById('gisPanelRight');
  const hBar = document.getElementById('gisLayerHBar');
  if (!grid || !leftPanel || !rightPanel) return;

  // Toggle classes or direct styles for smooth transition
  if (side === 'left') {
    leftPanel.style.width = gisPanelLeft ? '220px' : '0';
    leftPanel.style.opacity = gisPanelLeft ? '1' : '0';
    leftPanel.style.pointerEvents = gisPanelLeft ? 'auto' : 'none';
    leftPanel.style.minWidth = gisPanelLeft ? '220px' : '0'; // Ensure min-width also transitions
    if (hBar) hBar.style.display = gisPanelLeft ? 'none' : 'flex';
  } else {
    rightPanel.style.width = gisPanelRight ? '290px' : '0';
    rightPanel.style.opacity = gisPanelRight ? '1' : '0';
    rightPanel.style.pointerEvents = gisPanelRight ? 'auto' : 'none';
    rightPanel.style.minWidth = gisPanelRight ? '290px' : '0'; // Ensure min-width also transitions
  }

  // Update toggle button icons
  const btnL = document.getElementById('gisBtnToggleLeft');
  const btnR = document.getElementById('gisBtnToggleRight');
  if (btnL) {
    btnL.innerHTML = gisPanelLeft ? '&#9664;' : '&#9654;';
    btnL.style.left = gisPanelLeft ? '0' : '-10px';
  }
  if (btnR) {
    btnR.innerHTML = gisPanelRight ? '&#9654;' : '&#9664;';
    btnR.style.right = gisPanelRight ? '0' : '-10px';
  }

  // Invalidate map size
  setTimeout(() => { if (gisMap) gisMap.invalidateSize(); }, 320);
}

function gisZoomToIncident(lat, lng, id) {
  if (!gisMap) return;
  gisMap.flyTo([lat, lng], 18, { duration: 1.5 });

  // Find the incident marker and open its popup
  const layerId = 'incident-' + id;
  const match = gisLayers.incidents.find(m => m.options && m.options.id === layerId);
  if (match) {
    setTimeout(() => match.openPopup(), 1600);
  }
}

// ══════════════════════════════════════════════════════════════════
// RENDER FUNCTION
// ══════════════════════════════════════════════════════════════════
function renderGis() {
  // Init visibility states from data
  if (Object.keys(gisDmaVisibility).length === 0) {
    (window.GIS_DMA_ZONES || []).forEach(d => { gisDmaVisibility[d.id] = true; });
  }

  const onlineCount = DATA.stations.filter(s => s.status === 'online').length;
  const warnCount = DATA.stations.filter(s => s.status === 'warning').length;
  const offlineCount = DATA.stations.filter(s => s.status === 'offline').length;

  const dmaList = window.GIS_DMA_ZONES || [];
  const pipeNet = window.GIS_PIPE_NETWORK || [];
  const totalValves = pipeNet.reduce((sum, p) => sum + (p.valves?.length || 0), 0);
  const totalPipeLen = pipeNet.length;

  // Horizontal layer bar — shown only when left panel is hidden
  const LAYER_ITEMS = [
    ['stations', 'Trạm thủy văn', '#00d2ff'],
    ['factories', 'Trạm bơm / Hồ chứa', '#00f080'],
    ['incidents', 'Sự cố đê điều', '#ff3d57'],
    ['dikes', 'Tuyến đê', '#ff9500'],
    ['dmaZones', 'Vùng đê bảo vệ', 'rgba(0,210,255,.5)'],
    ['sluices', 'Cống / Đập', '#00d2ff'],
    ['flood', 'Ngập lụt RT', '#00b4ff'],
    ['landslide', 'Sạt lở', '#ff6b00'],
    ['resources4tc', '4 Tại chỗ', '#a855f7'],
  ];

  return `
  <div class="page-header" style="margin-bottom:10px">
    <div class="page-title">
      <h1>Bản đồ GIS Thủy lợi & Đê điều</h1>
      <p>Hà Nội · ${dmaList.length} vùng đê bảo vệ · ${totalPipeLen} tuyến đê · ${totalValves} cống/đập</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-ghost btn-sm" onclick="gisResetView()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8"/>
          <path d="M21 3v5h-5"/>
        </svg> Về trung tâm
      </button>
    </div>
  </div>

  <!-- Status bar -->
  <div style="display:flex;gap:12px;margin-bottom:12px;align-items:center;flex-wrap:wrap">
    <div style="display:flex;align-items:center;gap:7px;padding:7px 14px;background:rgba(0,240,128,.08);border:1px solid rgba(0,240,128,.22);border-radius:10px">
      <div class="pulse-dot green"></div><span style="font-size:13px;font-weight:600;color:var(--green)">${onlineCount} Trạm bình thường</span>
    </div>
    <div style="display:flex;align-items:center;gap:7px;padding:7px 14px;background:rgba(255,149,0,.08);border:1px solid rgba(255,149,0,.22);border-radius:10px">
      <div class="pulse-dot yellow"></div><span style="font-size:13px;font-weight:600;color:var(--yellow)">${warnCount} Cảnh báo</span>
    </div>
    <div style="display:flex;align-items:center;gap:7px;padding:7px 14px;background:rgba(255,23,68,.08);border:1px solid rgba(255,23,68,.22);border-radius:10px">
      <div class="pulse-dot red"></div><span style="font-size:13px;font-weight:600;color:var(--red)">${offlineCount} Sự cố khẩn cấp</span>
    </div>
    <div style="flex:1"></div>
    <select class="form-control" style="max-width:200px" onchange="gisFilterFactory(this.value)">
      <option value="all">Tất cả khu vực</option>
      ${[...new Set(DATA.stations.map(s => s.factory))].map(f => `<option value="${f}">${f}</option>`).join('')}
    </select>
  </div>

  <!-- Horizontal layer bar — shown only when left panel is hidden -->
  <div id="gisLayerHBar" style="display:none;gap:6px;align-items:center;padding:8px 12px;margin-bottom:8px;background:rgba(7,22,41,.85);border:1px solid rgba(0,200,255,.12);border-radius:10px;flex-wrap:wrap">
    <span style="font-size:10px;font-weight:700;color:var(--muted);letter-spacing:.8px;text-transform:uppercase;margin-right:4px">Lớp:</span>
    ${LAYER_ITEMS.map(([key, label, color]) => `
    <label style="display:flex;align-items:center;gap:5px;cursor:pointer;padding:4px 10px;border-radius:6px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.03);transition:background .15s"
      onmouseover="this.style.background='rgba(0,200,255,.06)'" onmouseout="this.style.background='rgba(255,255,255,.03)'">
      <input type="checkbox" ${gisLayerFlags[key] ? 'checked' : ''} onchange="toggleGisLayerGroup('${key}',this.checked)"
        style="accent-color:${color};width:13px;height:13px;cursor:pointer">
      <span style="width:10px;height:2.5px;background:${color};border-radius:2px;display:inline-block"></span>
      <span style="font-size:11px;font-weight:500;color:#cfd8e3">${label}</span>
    </label>`).join('')}
    <!-- DMA quick toggles in hbar -->
    <span style="font-size:10px;font-weight:700;color:var(--muted);letter-spacing:.8px;text-transform:uppercase;margin-left:8px;margin-right:4px">Khu vực:</span>
    <button onclick="gisToggleAllDma(true)" style="font-size:10px;padding:3px 10px;background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.25);color:var(--cyan);border-radius:5px;cursor:pointer">Bật tất cả</button>
    <button onclick="gisToggleAllDma(false)" style="font-size:10px;padding:3px 10px;background:rgba(84,110,122,.1);border:1px solid rgba(84,110,122,.25);color:var(--muted);border-radius:5px;cursor:pointer">Tắt tất cả</button>
  </div>

  <!-- Main layout: flex-based to allow easy expansion -->
  <div id="gisMainGrid" style="display:flex;gap:12px;height:calc(100vh - 240px);min-height:560px;position:relative;overflow:hidden">


    <!-- LEFT PANEL -->
    <div id="gisPanelLeft" style="display:flex;flex-direction:column;gap:10px;width:220px;min-width:0;height:100%;padding-right:2px;transition:all .3s ease">

      <!-- Layer controls -->
      <div class="card" style="padding:14px">
        <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:12px">Lớp hiển thị</div>
        ${LAYER_ITEMS.map(([key, label, color]) => `
        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:7px 0;border-bottom:1px solid rgba(0,200,255,.06)">
          <input type="checkbox" ${gisLayerFlags[key] ? 'checked' : ''} onchange="toggleGisLayerGroup('${key}',this.checked)"
            style="accent-color:${color};width:15px;height:15px;cursor:pointer">
          <span style="display:flex;align-items:center;gap:6px;font-size:12px">
            <span style="width:12px;height:3px;background:${color};border-radius:2px;display:inline-block"></span>
            ${label}
          </span>
        </label>`).join('')}
      </div>

      <!-- Dike protection zone panel -->
      <div class="card" style="padding:14px;overflow-y:auto;max-height:none;flex:1;min-height:0">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:1px;text-transform:uppercase">Vùng bảo vệ đê</div>
          <div style="display:flex;gap:4px">
            <button onclick="gisToggleAllDma(true)" style="font-size:10px;padding:2px 7px;background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.25);color:var(--cyan);border-radius:4px;cursor:pointer">Bật</button>
            <button onclick="gisToggleAllDma(false)" style="font-size:10px;padding:2px 7px;background:rgba(84,110,122,.1);border:1px solid rgba(84,110,122,.25);color:var(--muted);border-radius:4px;cursor:pointer">Tắt</button>
          </div>
        </div>
        ${dmaList.map(dma => {
    const vis = gisDmaVisibility[dma.id] !== false;
    const statusDot = { ok: 'green', warning: 'yellow', critical: 'red' }[dma.status] || 'gray';
    const safetyLevel = dma.loss >= 18 ? 'Nguy hiểm' : dma.loss >= 13 ? 'Cảnh báo' : 'An toàn';
    const safetyColor = dma.loss >= 18 ? '#ff1744' : dma.loss >= 13 ? '#ffca28' : '#00f080';
    return `
          <div style="padding:8px 0;border-bottom:1px solid rgba(0,200,255,.06)">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
              <input type="checkbox" ${vis ? 'checked' : ''} onchange="gisDmaToggle('${dma.id}',this.checked)"
                style="accent-color:${dma.color};width:14px;height:14px;cursor:pointer">
              <div style="flex:1;min-width:0">
                <div style="display:flex;align-items:center;gap:6px">
                  <span style="width:10px;height:10px;border-radius:2px;background:${dma.color};flex-shrink:0"></span>
                  <span style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${dma.name}</span>
                </div>
                <div style="display:flex;gap:8px;margin-top:3px">
                  <span style="font-size:10px;color:var(--muted)">${dma.id}</span>
                  <span style="font-size:10px;color:${safetyColor};font-weight:600">${safetyLevel}</span>
                </div>
              </div>
              <div class="pulse-dot ${statusDot}" style="flex-shrink:0"></div>
            </label>
          </div>`;
  }).join('')}
      </div>

      <!-- Legend (compact, collapsible) -->
      <div class="card" style="padding:12px;flex-shrink:0">
        <div id="gisLegendHeader" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:${gisLegendVisible ? '10px' : '0'}">
          <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:1px;text-transform:uppercase">Chú giải Đê điều</div>
          <button id="gisBtnToggleLegend" onclick="gisToggleLegend()" style="background:none;border:none;color:var(--cyan);cursor:pointer;font-size:10px;font-weight:600;padding:2px 6px;border-radius:4px;background:rgba(0,200,255,.05)">
            ${gisLegendVisible ? 'Ẩn' : 'Hiện'}
          </button>
        </div>
        
        <div id="gisLegendContent" style="display:${gisLegendVisible ? 'block' : 'none'}">
        ${[
    ['#ff9500', 5, null, 'Đê cấp I (Quốc gia)'],
    ['#ffdb4d', 4, null, 'Đê cấp II / Đê sông'],
    ['#ff7043', 3, null, 'Đê địa phương / Đê bao'],
    ['#ff1744', 4, '8 6', 'Sạt lở / Sự cố đê'],
    ['#546e7a', 3, '8 6', 'Đê đang thi công'],
  ].map(([c, w, dash, label]) => `
        <div style="display:flex;align-items:center;gap:8px;padding:4px 0">
          <svg width="28" height="6" viewBox="0 0 28 6">
            <line x1="0" y1="3" x2="28" y2="3" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${dash ? `stroke-dasharray="${dash}"` : ''}/>
          </svg>
          <span style="font-size:11px;color:var(--muted)">${label}</span>
        </div>`).join('')}
        <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(0,200,255,.08)">
          ${[
    ['#00f080', 'Cống vận hành BT'],
    ['#ff3d57', 'Cống đóng (Khẩn cấp)'],
    ['#ffdb4d', 'Cống đang sửa chữa'],
    ['#00d2ff', 'Trạm thủy văn / Đo mưa'],
  ].map(([c, l]) => `
          <div style="display:flex;align-items:center;gap:7px;padding:3px 0">
            <div style="width:14px;height:14px;border-radius:50%;border:1.5px solid ${c};background:${c}22;flex-shrink:0"></div>
            <span style="font-size:11px;color:var(--muted)">${l}</span>
          </div>`).join('')}
        </div>
        </div>
      </div>
    </div>

    <!-- CENTER: Map (with absolute toggle tabs) -->
    <div class="card" style="flex:1;height:100%;min-height:0;overflow:hidden;padding:0;position:relative;min-width:0;display:flex;flex-direction:column">
      <div id="gisMapContainer" style="width:100%;flex:1;min-height:300px"></div>
      
      <!-- Toggle tab LEFT -->
      <button id="gisBtnToggleLeft" onclick="gisTogglePanel('left')"
        title="Ẩn/hiện panel trái"
        style="position:absolute;top:50%;left:0;transform:translateY(-50%);z-index:1000;width:16px;height:56px;border-radius:0 8px 8px 0;background:rgba(7,22,41,.92);border:1px solid rgba(0,200,255,.25);border-left:none;color:var(--cyan);cursor:pointer;font-size:9px;display:flex;align-items:center;justify-content:center;transition:all .2s"
        onmouseover="this.style.background='rgba(0,200,255,.2)'" onmouseout="this.style.background='rgba(7,22,41,.92)'">&#9664;</button>

      <!-- Toggle tab RIGHT -->
      <button id="gisBtnToggleRight" onclick="gisTogglePanel('right')"
        title="Ẩn/hiện panel phải"
        style="position:absolute;top:50%;right:0;transform:translateY(-50%);z-index:1000;width:16px;height:56px;border-radius:8px 0 0 8px;background:rgba(7,22,41,.92);border:1px solid rgba(0,200,255,.25);border-right:none;color:var(--cyan);cursor:pointer;font-size:9px;display:flex;align-items:center;justify-content:center;transition:all .2s"
        onmouseover="this.style.background='rgba(0,200,255,.2)'" onmouseout="this.style.background='rgba(7,22,41,.92)'">&#9654;</button>
    </div>

    <!-- RIGHT PANEL -->
    <div id="gisPanelRight" style="display:flex;flex-direction:column;gap:10px;width:290px;min-width:0;height:100%;transition:all .3s ease">
      <!-- Station list -->
      <div class="card" style="flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column">
        <div class="card-header"><span class="card-title">Trạm bơm & Hồ chứa</span>
          <span style="font-size:11px;color:var(--muted)">${DATA.stations.length} điểm</span>
        </div>
        <div style="overflow-y:auto;flex:1">
          ${DATA.stations.map(s => `
          <div onclick="gisZoomTo(${s.lat},${s.lng},'${s.id}')"
            style="display:flex;justify-content:space-between;align-items:center;padding:9px 14px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .15s"
            onmouseover="this.style.background='rgba(0,200,255,.04)'" onmouseout="this.style.background=''">
            <div style="display:flex;align-items:center;gap:8px">
              <div class="pulse-dot ${s.status === 'online' ? 'green' : s.status === 'warning' ? 'yellow' : 'red'}"></div>
              <div>
                <div style="font-size:12px;font-weight:600">${s.name}</div>
                <div style="font-size:10px;color:var(--muted)">${s.factory} · ${s.id}</div>
              </div>
            </div>
            <div style="text-align:right;flex-shrink:0">
              <div style="font-size:12px;font-family:'Roboto Mono',monospace;color:var(--cyan)">${s.status !== 'offline' ? s.pressure + ' m' : '—'}</div>
              <div style="font-size:10px;color:var(--muted)">${s.status !== 'offline' ? s.flow + ' m³/s' : 'Sự cố'}</div>
            </div>
          </div>`).join('')}
        </div>
      </div>

      <!-- DMA NRW summary — NO card-header bar, clean title only -->
      <div class="card" style="flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden">
        <div style="padding:12px 14px 6px 14px;flex-shrink:0">
          <span style="font-size:13px;font-weight:700;color:var(--text)">Độ an toàn đê theo vùng</span>
        </div>
        <div style="padding:4px 0;overflow-y:auto;flex:1">
          ${dmaList.slice(0, 6).map(dma => {
    const pct = dma.loss;
    const safetyMsg = pct >= 18 ? 'Nguy hiểm' : pct >= 13 ? 'Cảnh báo' : 'An toàn';
    const c = pct >= 18 ? 'var(--red)' : pct >= 13 ? 'var(--yellow)' : 'var(--green)';
    return `
            <div style="padding:6px 14px" onclick="gisZoomToDma('${dma.id}')" class="gis-dma-row">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <span style="font-size:12px;font-weight:500">${dma.name}</span>
                <span style="font-size:12px;font-weight:700;color:${c}">${safetyMsg}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width:${Math.min((pct / 20) * 100, 100)}%;background:${c}"></div>
              </div>
            </div>`;
  }).join('')}
        </div>
      </div>

      <!-- Open incidents — scrollable -->
      <div class="card" style="flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden">
        <div class="card-header" style="flex-shrink:0"><span class="card-title">Sự cố đang mở</span></div>
        <div style="padding:6px 0;overflow-y:auto;flex:1">
          ${DATA.incidents.filter(i => i.status !== 'done').map((i, idx) => {
      // Use the same coordinate generation as the map markers
      const incidentLL = [[20.955, 107.065], [20.945, 107.053], [21.005, 107.265], [21.038, 106.790]];
      const pos = incidentLL[idx] || [20.96 + idx * 0.01, 107.08 + idx * 0.01];
      return `
          <div class="alarm-item ${i.severity}" style="margin:5px 10px;border-radius:7px;cursor:pointer" 
               onclick="gisZoomToIncident(${pos[0]},${pos[1]},'${i.id}')">
            <div class="alarm-dot ${i.severity}"></div>
            <div class="alarm-msg" style="font-size:11px">
              <div style="font-weight:600">${i.type} – ${i.id}</div>
              <div style="color:var(--muted)">${i.location.substring(0, 30)}…</div>
            </div>
          </div>`;
    }).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

// ══════════════════════════════════════════════════════════════════
// afterRender — Initialize Leaflet map with all layers
// ══════════════════════════════════════════════════════════════════
window.afterRender_gis = function () {
  setTimeout(() => {
    if (gisMap) { gisMap.remove(); gisMap = null; }
    const container = document.getElementById('gisMapContainer');
    if (!container) return;

    gisLayers = { stations: [], factories: [], incidents: [], dikes: [], dmaPolygons: {} };

    gisMap = L.map('gisMapContainer', {
      center: [21.02, 105.84], zoom: 11, zoomControl: true,
      preferCanvas: true,
    });

    // Dark tile
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap · © CARTO',
      subdomains: 'abcd', maxZoom: 19
    }).addTo(gisMap);

    // Inject custom styles
    if (!document.getElementById('gisV2Styles')) {
      const s = document.createElement('style');
      s.id = 'gisV2Styles';
      s.textContent = `
        .gis-popup .leaflet-popup-content-wrapper{background:transparent!important;box-shadow:none!important;padding:0!important}
        .gis-popup .leaflet-popup-content{margin:0!important}
        .gis-popup .leaflet-popup-tip{background:#071629}
        .gis-popup-inner{background:#071629;border:1px solid rgba(0,200,255,.2);border-radius:12px;padding:14px;min-width:200px;max-width:260px;font-family:Inter,sans-serif;color:#e3f2fd}
        .gis-popup-title{font-size:13px;font-weight:700;color:#00c8ff;margin-bottom:3px}
        .gis-popup-sub{font-size:11px;color:#546e7a;margin-bottom:10px}
        .gis-popup-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}
        .gis-popup-key{font-size:10px;color:#546e7a}
        .gis-popup-val{font-size:13px;font-weight:700}
        .gis-popup-status{font-size:11px;padding:4px 10px;border-radius:20px;display:inline-block;background:rgba(0,200,255,.08);border:1px solid rgba(0,200,255,.2);color:#90caf9}
        .gis-valve-icon{background:none!important;border:none!important}
        .gis-dma-label{background:none!important;border:none!important;font-family:Inter,sans-serif}
        .leaflet-control-zoom{border:1px solid rgba(0,200,255,.2)!important;background:rgba(7,22,41,.9)!important;border-radius:8px!important;overflow:hidden}
        .leaflet-control-zoom a{background:transparent!important;color:#00c8ff!important;border-color:rgba(0,200,255,.15)!important;font-size:18px!important;line-height:28px!important}
        .leaflet-control-zoom a:hover{background:rgba(0,200,255,.1)!important}
        .gis-dma-row{cursor:pointer;transition:background .15s}
        .gis-dma-row:hover{background:rgba(0,200,255,.04)}
        .gis-pipe-glow{filter:drop-shadow(0 0 3px currentColor)}
      `;
      document.head.appendChild(s);
    }

    // ── 1. DMA Polygons ─────────────────────────────────────────
    const dmaList = window.GIS_DMA_ZONES || [];
    dmaList.forEach(dma => {
      const vis = gisDmaVisibility[dma.id] !== false;
      const latlngs = dma.coords.map(c => [c[0], c[1]]);
      const polygon = L.polygon(latlngs, {
        color: dma.color, weight: 2,
        opacity: vis ? 0.8 : 0,
        fillColor: dma.color, fillOpacity: vis ? dma.fillOpacity : 0,
        dashArray: '6 4',
      });
      polygon.bindPopup(`<div class="gis-popup-inner">
        <div class="gis-popup-title">${dma.name} · ${dma.id}</div>
        <div class="gis-popup-sub">${dma.district}</div>
        <div class="gis-popup-grid">
          <div><div class="gis-popup-key">Cao trình TB</div><div class="gis-popup-val">${(dma.avgElevation || 12.5).toLocaleString('vi-VN')} m</div></div>
          <div><div class="gis-popup-key">Mức an toàn</div><div class="gis-popup-val" style="color:${dma.loss >= 18 ? '#ff1744' : dma.loss >= 13 ? '#ffca28' : '#00e676'}">${dma.loss >= 18 ? 'Nguy hiểm' : dma.loss >= 13 ? 'Cảnh báo' : 'An toàn'}</div></div>
          <div><div class="gis-popup-key">Lưu lượng xả</div><div class="gis-popup-val" style="color:#00c8ff">${dma.supplyFlow} m³/s</div></div>
          <div><div class="gis-popup-key">Tuyến đê</div><div class="gis-popup-val" style="color:#00e676">${dma.consumptionFlow} km</div></div>
        </div>
        <div class="gis-popup-status">${{ ok: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--green);vertical-align:middle"></span> Bình thường', warning: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--yellow);vertical-align:middle"></span> Cảnh báo rủi ro', critical: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--red);vertical-align:middle"></span> Sự cố/Xung yếu' }[dma.status] || dma.status}</div>
      </div>`, { className: 'gis-popup', maxWidth: 280 });

      if (vis) polygon.addTo(gisMap);

      // DMA label
      const center = L.polygon(latlngs).getBounds().getCenter();
      const labelIcon = L.divIcon({
        html: `<div class="gis-dma-label" style="color:${dma.color};font-size:11px;font-weight:700;text-shadow:0 0 8px rgba(0,0,0,.8),0 0 4px rgba(0,0,0,.9);white-space:nowrap;pointer-events:none">${dma.name}</div>`,
        className: 'gis-dma-label', iconAnchor: [40, 8],
      });
      const labelMarker = L.marker(center, { icon: labelIcon, interactive: false });
      if (vis) labelMarker.addTo(gisMap);

      gisLayers.dmaPolygons[dma.id] = { polygon, labelMarker, dikes: [], sluices: [] };
    });

    // ── 2. Dike Network ──────────────────────────────────────────
    const dikeNet = window.GIS_PIPE_NETWORK || [];
    dikeNet.forEach(dike => {
      const isTransmission = dike.type === 'transmission';
      const style = getDikeStyle(dike);
      const isDmaVisible = !dike.dmaId || gisDmaVisibility[dike.dmaId] !== false;
      const isLayerVisible = isTransmission ? gisLayerFlags.dikes : gisLayerFlags.dmaZones;

      // Dike outline (glow effect)
      const glowLine = L.polyline(dike.coords, {
        color: style.color, weight: style.weight + 3,
        opacity: 0.12, dashArray: style.dashArray,
        lineCap: 'round', lineJoin: 'round',
      });

      // Dike core
      const coreLine = L.polyline(dike.coords, {
        color: style.color, weight: style.weight,
        opacity: style.opacity, dashArray: style.dashArray,
        lineCap: 'round', lineJoin: 'round',
      });
      const popupContent = buildDikePopup(dike);
      coreLine.bindPopup(popupContent, { className: 'gis-popup', maxWidth: 280 });
      coreLine.bindTooltip(dike.label || dike.id, {
        sticky: true, className: 'gis-pipe-tooltip',
        direction: 'top', offset: [0, -3]
      });

      if (isDmaVisible && isLayerVisible) {
        glowLine.addTo(gisMap);
        coreLine.addTo(gisMap);
      }

      // Store in correct bucket
      if (isTransmission) {
        gisLayers.dikes.push(glowLine, coreLine);
      } else if (dike.dmaId && gisLayers.dmaPolygons[dike.dmaId]) {
        gisLayers.dmaPolygons[dike.dmaId].dikes.push(glowLine, coreLine);
      }

      // ── Sluices on this dike segment ─────────────────────────
      (dike.valves || []).forEach(sluice => {
        const icon = makeSluiceIcon(sluice);
        const marker = L.marker(sluice.pos, { icon, zIndexOffset: 200 });
        marker.bindPopup(buildSluicePopup(sluice), { className: 'gis-popup', maxWidth: 240 });
        marker.bindTooltip(`${sluice.id} · ${{ gate: 'Gate', butterfly: 'Butterfly', check: 'Check', meter: 'Meter' }[sluice.type] || sluice.type}`, {
          direction: 'top', offset: [0, -14], className: 'gis-pipe-tooltip'
        });

        if (gisLayerFlags.sluices && isDmaVisible) marker.addTo(gisMap);

        if (isTransmission) {
          gisLayers.dikes.push(marker);
        } else if (dike.dmaId && gisLayers.dmaPolygons[dike.dmaId]) {
          gisLayers.dmaPolygons[dike.dmaId].sluices.push(marker);
        }
      });
    });

    // ── 3. Station markers ──────────────────────────────────────
    gisLayers.stations = DATA.stations.map(s => {
      const marker = L.marker([s.lat, s.lng], { icon: makeStationIcon(s.status), zIndexOffset: 500 });
      marker.bindPopup(`<div class="gis-popup-inner">
        <div class="gis-popup-title">${s.name}</div>
        <div class="gis-popup-sub">${s.factory} · ${s.id}</div>
        <div class="gis-popup-grid">
          <div><div class="gis-popup-key">Mực nước</div><div class="gis-popup-val" style="color:#00c8ff">${s.status !== 'offline' ? s.pressure + ' m' : '—'}</div></div>
          <div><div class="gis-popup-key">Lưu lượng</div><div class="gis-popup-val" style="color:#00e676">${s.status !== 'offline' ? s.flow + ' m³/s' : '—'}</div></div>
          <div><div class="gis-popup-key">Mực nước hồ</div><div class="gis-popup-val">${s.status !== 'offline' ? s.level + '%' : '—'}</div></div>
          <div><div class="gis-popup-key">Trạng thái TB</div><div class="gis-popup-val">${s.status !== 'offline' ? 'Hoạt động' : '—'}</div></div>
        </div>
        <div class="gis-popup-status">${{ online: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--green);vertical-align:middle"></span> Bình thường', warning: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--yellow);vertical-align:middle"></span> Cảnh báo', offline: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--red);vertical-align:middle"></span> Sự cố/Mất tin' }[s.status]}</div>
        <div style="margin-top:8px;font-size:10px;color:#546e7a">${s.lat}°N · ${s.lng}°E</div>
      </div>`, { className: 'gis-popup', maxWidth: 280 });
      if (gisLayerFlags.stations) marker.addTo(gisMap);
      return marker;
    });

    // ── 4. Factory markers ──────────────────────────────────────
    const factoryLL = window.GIS_FACTORY_LATLNG || [
      { lat: 21.015, lng: 105.815 }, { lat: 21.025, lng: 105.845 }, { lat: 21.045, lng: 105.825 }
    ];
    gisLayers.factories = DATA.factories.map((f, i) => {
      const pos = factoryLL[i] || { lat: 21.02 + i * 0.02, lng: 105.84 + i * 0.02 };
      const marker = L.marker([pos.lat, pos.lng], { icon: makeFactoryIcon(), zIndexOffset: 400 });
      marker.bindPopup(`<div class="gis-popup-inner">
        <div class="gis-popup-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg> ${f.name}</div>
        <div class="gis-popup-sub">${f.location} · Quản lý: ${f.manager}</div>
        <div class="gis-popup-grid">
        <div class="gis-popup-grid">
          <div><div class="gis-popup-key">Dung tích TK</div><div class="gis-popup-val" style="color:#00c8ff">${f.capacity.toLocaleString('vi-VN')} m³</div></div>
          <div><div class="gis-popup-key">Hiện tại</div><div class="gis-popup-val" style="color:#00e676">${f.output.toLocaleString('vi-VN')} m³</div></div>
        </div>
        <div class="gis-popup-status">${Math.round(f.output / f.capacity * 100)}% dung tích hồ</div>
      </div>`, { className: 'gis-popup', maxWidth: 280 });
      if (gisLayerFlags.factories) marker.addTo(gisMap);
      return marker;
    });

    // ── 5. Incident markers ─────────────────────────────────────
    const incidentLL = [
      [21.018, 105.825], [21.035, 105.855], [21.005, 105.795], [21.058, 105.890],
    ];
    gisLayers.incidents = DATA.incidents.filter(i => i.status !== 'done').map((inc, idx) => {
      const marker = L.marker(incidentLL[idx] || [20.96 + idx * 0.01, 107.08 + idx * 0.01], {
        icon: makeIncidentIcon(), zIndexOffset: 600, id: 'incident-' + inc.id
      });
      const isAssigned = !!(inc.assignedTo);
      const isProcessing = inc.status === 'processing';
      const statusLabel = { new: 'Mới – Chưa phân công', processing: 'Đang xử lý' }[inc.status] || inc.status;
      const statusColor = isProcessing ? 'rgba(255,202,40,.1)' : 'rgba(255,23,68,.1)';
      const statusBorderColor = isProcessing ? 'rgba(255,202,40,.3)' : 'rgba(255,23,68,.3)';
      const statusTextColor = isProcessing ? '#ffca28' : '#ff5252';

      const actionBtns = isAssigned || isProcessing
        ? `<button onclick="gisViewIncident('${inc.id}')" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:7px 10px;background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.3);color:#00c8ff;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;transition:.15s" onmouseover="this.style.background='rgba(0,200,255,.2)'" onmouseout="this.style.background='rgba(0,200,255,.1)'">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Xem chi tiết
          </button>`
        : `<button onclick="gisCreateWorkOrder('${inc.id}','${inc.location.replace(/'/g, "&apos;")}')" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:7px 10px;background:rgba(255,202,40,.1);border:1px solid rgba(255,202,40,.35);color:#ffca28;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;transition:.15s" onmouseover="this.style.background='rgba(255,202,40,.2)'" onmouseout="this.style.background='rgba(255,202,40,.1)'">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tạo lệnh CT
          </button>`;

      marker.bindPopup(`<div class="gis-popup-inner" style="border-color:rgba(255,23,68,.3);min-width:230px">
        <div class="gis-popup-title" style="color:#ff5252"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> ${inc.id}</div>
        <div class="gis-popup-sub">${inc.type}</div>
        <div style="font-size:12px;margin-bottom:8px;color:#cfd8e3">${inc.location}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;font-size:11px">
          <div><div style="color:#546e7a;font-size:10px">Mức độ</div><div style="font-weight:700;color:${inc.severity === 'critical' ? '#ff1744' : inc.severity === 'high' ? '#ff5252' : '#ffca28'}">${inc.severity}</div></div>
          <div><div style="color:#546e7a;font-size:10px">Phân công</div><div style="font-weight:700;color:${isAssigned ? '#00c8ff' : '#546e7a'}">${inc.assignedTo || 'Chưa có'}</div></div>
        </div>
        <div style="padding:4px 10px;border-radius:20px;display:inline-block;background:${statusColor};border:1px solid ${statusBorderColor};color:${statusTextColor};font-size:11px;margin-bottom:10px">${statusLabel}</div>
        <div style="font-size:10px;color:#546e7a;margin-bottom:10px">Báo cáo: ${inc.report}</div>
        <div style="display:flex;gap:7px">${actionBtns}</div>
      </div>`, { className: 'gis-popup', maxWidth: 280 });
      if (gisLayerFlags.incidents) marker.addTo(gisMap);
      return marker;
    });

    // ── GIS-1: FLOOD SENSORS & ZONES ────────────────────────────
    gisLayers.flood = [];
    gisLayers.floodPolygons = [];

    // Flood zones (polygons)
    GIS_FLOOD_ZONES.forEach(fz => {
      const levelColors = { danger: '#ff3d57', warning: '#ffca28', ok: '#00e676' };
      const c = levelColors[fz.level] || '#ffca28';
      const poly = L.polygon(fz.coords, {
        color: c, weight: 2, opacity: 0.7,
        fillColor: c, fillOpacity: 0.18, dashArray: '5 4',
      });
      poly.bindPopup(`<div class="gis-popup-inner" style="border-color:${c}55">
        <div class="gis-popup-title" style="color:${c}">${fz.name}</div>
        <div class="gis-popup-sub">${fz.id}</div>
        <div class="gis-popup-grid">
          <div><div class="gis-popup-key">Diện tích ngập</div><div class="gis-popup-val" style="color:${c}">${fz.affectedHa.toLocaleString('vi-VN')} ha</div></div>
          <div><div class="gis-popup-key">Dân bị ảnh hưởng</div><div class="gis-popup-val">${fz.affectedPeople.toLocaleString('vi-VN')} người</div></div>
          <div><div class="gis-popup-key">Độ ngập cực đại</div><div class="gis-popup-val" style="color:${c}">${fz.maxDepth} m</div></div>
          <div><div class="gis-popup-key">Mức cảnh báo</div><div class="gis-popup-val">${{danger:'Nguy hiểm',warning:'Cảnh báo',ok:'Bình thường'}[fz.level]}</div></div>
        </div>
      </div>`, { className: 'gis-popup', maxWidth: 280 });
      if (gisLayerFlags.flood) poly.addTo(gisMap);
      gisLayers.floodPolygons.push(poly);
    });

    // Flood sensors (circle markers)
    GIS_FLOOD_SENSORS.forEach(s => {
      const c = s.status === 'danger' ? '#ff3d57' : s.status === 'warning' ? '#ffca28' : '#00e676';
      const trendArrow = s.trend === 'up' ? '↑' : s.trend === 'down' ? '↓' : '→';
      const trendColor = s.trend === 'up' ? '#ff5252' : s.trend === 'down' ? '#00e676' : '#ffca28';
      const circle = L.circleMarker([s.lat, s.lng], {
        radius: 8 + (s.level > 1 ? 4 : s.level > 0.5 ? 2 : 0),
        color: c, weight: 2, opacity: 0.9,
        fillColor: c, fillOpacity: 0.35,
      });
      const histHtml = s.history.map((v,i) => `<span style="display:inline-block;width:22px;height:${Math.round(v*40+4)}px;background:${c}66;border-radius:2px 2px 0 0;vertical-align:bottom;margin:0 1px" title="${v}m"></span>`).join('');
      circle.bindPopup(`<div class="gis-popup-inner" style="border-color:${c}55">
        <div class="gis-popup-title" style="color:${c}">${s.name}</div>
        <div class="gis-popup-sub">${s.id} · Cập nhật: ${s.timestamp}</div>
        <div class="gis-popup-grid">
          <div><div class="gis-popup-key">Mực nước</div><div class="gis-popup-val" style="color:${c};font-size:22px;font-weight:900">${s.level} m</div></div>
          <div><div class="gis-popup-key">Xu hướng</div><div class="gis-popup-val" style="color:${trendColor};font-size:18px">${trendArrow}</div></div>
        </div>
        <div style="margin:8px 0 4px;font-size:10px;color:rgba(255,255,255,.4)">LỊCH SỬ 4 KỲ G�ần NHẤT</div>
        <div style="display:flex;align-items:flex-end;height:48px;margin-bottom:4px">${histHtml}</div>
        <div style="font-size:10px;color:rgba(255,255,255,.4)">← Cũ hơn · Mới nhất →</div>
        <div class="gis-popup-status" style="margin-top:8px">${{danger:'<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ff3d57;vertical-align:middle"></span> Nguy hiểm',warning:'<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ffca28;vertical-align:middle"></span> Cảnh báo',ok:'<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#00e676;vertical-align:middle"></span> Bình thường'}[s.status]}</div>
      </div>`, { className: 'gis-popup', maxWidth: 280 });
      if (gisLayerFlags.flood) circle.addTo(gisMap);
      gisLayers.flood.push(circle);
    });

    // ── GIS-2: LANDSLIDE ZONES ───────────────────────────────────
    gisLayers.landslide = [];
    GIS_LANDSLIDE_ZONES.forEach(ls => {
      const levelCfg = {
        critical: { color:'#ff1744', size:20, label:'Khẩn cấp' },
        high:     { color:'#ff6b00', size:17, label:'Nguy cơ cao' },
        medium:   { color:'#ffca28', size:14, label:'Theo dõi' },
        low:      { color:'#546e7a', size:11, label:'Đã xử lý' },
      }[ls.level] || { color:'#ffca28', size:14, label:'Theo dõi' };

      const typeCfg = { river_bank:'Sạt lở bờ sông', slope:'Sạt trượt đất', dike:'Sạt lở đê', canal:'Sạt lở kênh' };
      const statusCfg = { emergency:'⚡ Khẩn cấp', monitoring:'◎ Đang theo dõi', repairing:'⚙ Đang sửa chữa', resolved:'✓ Đã xử lý' };

      // Triangle SVG icon for landslide
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${levelCfg.size+4}" height="${levelCfg.size+4}" viewBox="0 0 24 24">
        <polygon points="12,2 23,22 1,22" fill="${levelCfg.color}33" stroke="${levelCfg.color}" stroke-width="2" stroke-linejoin="round"/>
        <line x1="12" y1="9" x2="12" y2="15" stroke="${levelCfg.color}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="18" r="1.5" fill="${levelCfg.color}"/>
      </svg>`;
      const icon = L.divIcon({ html: svg, className: '', iconSize:[levelCfg.size+4,levelCfg.size+4], iconAnchor:[(levelCfg.size+4)/2,levelCfg.size+4] });
      const marker = L.marker([ls.lat, ls.lng], { icon, zIndexOffset: 700 });
      marker.bindPopup(`<div class="gis-popup-inner" style="border-color:${levelCfg.color}55">
        <div class="gis-popup-title" style="color:${levelCfg.color}">${ls.name}</div>
        <div class="gis-popup-sub">${ls.id} · ${typeCfg[ls.type] || ls.type}</div>
        <div class="gis-popup-grid">
          <div><div class="gis-popup-key">Mức nguy cơ</div><div class="gis-popup-val" style="color:${levelCfg.color}">${levelCfg.label}</div></div>
          <div><div class="gis-popup-key">Dân bị ảnh hưởng</div><div class="gis-popup-val">${ls.affectedPeople} người</div></div>
          <div><div class="gis-popup-key">Diện tích</div><div class="gis-popup-val">${ls.affectedArea}</div></div>
          <div><div class="gis-popup-key">Phát hiện</div><div class="gis-popup-val">${ls.discoveredDate}</div></div>
        </div>
        <div style="padding:6px 10px;border-radius:8px;background:rgba(255,255,255,.04);font-size:11px;color:rgba(255,255,255,.65);margin:8px 0;line-height:1.5">${ls.note}</div>
        <div class="gis-popup-status">${statusCfg[ls.status] || ls.status}</div>
      </div>`, { className: 'gis-popup', maxWidth: 300 });
      if (gisLayerFlags.landslide) marker.addTo(gisMap);
      gisLayers.landslide.push(marker);
    });

    // ── GIS-3: 4 TẠI CHỖ RESOURCES ──────────────────────────────
    gisLayers.resources = [];
    const resourceCfg = {
      warehouse: { color:'#a855f7', label:'Kho vật tư', shape:'square' },
      command:   { color:'#f59e0b', label:'Sở chỉ huy', shape:'star' },
      vehicle:   { color:'#06b6d4', label:'Tập kết PT', shape:'diamond' },
    };
    GIS_RESOURCES_4TC.forEach(r => {
      const cfg = resourceCfg[r.type] || resourceCfg.warehouse;
      let shapeSvg;
      if (r.type === 'warehouse') {
        shapeSvg = `<rect x="4" y="4" width="16" height="16" rx="3" fill="${cfg.color}33" stroke="${cfg.color}" stroke-width="2"/><rect x="9" y="10" width="6" height="10" fill="${cfg.color}99"/><line x1="5" y1="10" x2="19" y2="10" stroke="${cfg.color}" stroke-width="1.5"/>`;
      } else if (r.type === 'command') {
        shapeSvg = `<polygon points="12,2 14.5,8.5 21,9 16,14 17.5,21 12,17.5 6.5,21 8,14 3,9 9.5,8.5" fill="${cfg.color}33" stroke="${cfg.color}" stroke-width="2"/>`;
      } else {
        shapeSvg = `<polygon points="12,2 22,12 12,22 2,12" fill="${cfg.color}33" stroke="${cfg.color}" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="${cfg.color}"/>`;
      }
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">${shapeSvg}</svg>`;
      const icon = L.divIcon({ html: svg, className: '', iconSize:[24,24], iconAnchor:[12,12] });
      const marker = L.marker([r.lat, r.lng], { icon, zIndexOffset: 300 });

      let detailHtml = '';
      if (r.type === 'warehouse') {
        detailHtml = `<div style="margin-top:8px"><div style="font-size:10px;color:rgba(255,255,255,.4);margin-bottom:4px">VẬT TƯ DỰ TRỮ</div>${r.items.map(it=>`<div style="display:flex;justify-content:space-between;font-size:11px;padding:3px 0;border-bottom:1px solid rgba(255,255,255,.05)"><span style="color:rgba(255,255,255,.7)">${it.name}</span><span style="font-weight:700;color:${cfg.color}">${it.qty.toLocaleString('vi-VN')} ${it.unit}</span></div>`).join('')}<div style="font-size:10px;color:rgba(255,255,255,.35);margin-top:6px">Kiểm kê: ${r.lastCheck}</div></div>`;
      } else if (r.type === 'command') {
        detailHtml = `<div class="gis-popup-grid" style="margin-top:8px"><div><div class="gis-popup-key">Quân số</div><div class="gis-popup-val" style="color:${cfg.color}">${r.personnel} người</div></div><div><div class="gis-popup-key">Liên hệ</div><div class="gis-popup-val" style="font-size:11px">${r.contact}</div></div><div><div class="gis-popup-key">Thành lập</div><div class="gis-popup-val" style="font-size:11px">${r.established}</div></div></div>`;
      } else {
        detailHtml = `<div style="margin-top:8px">${r.vehicles.map(v=>`<div style="display:flex;justify-content:space-between;font-size:11px;padding:3px 0;border-bottom:1px solid rgba(255,255,255,.05)"><span style="color:rgba(255,255,255,.7)">${v.name}</span><span style="font-weight:700;color:${cfg.color}">${v.qty} cái</span></div>`).join('')}</div>`;
      }
      marker.bindPopup(`<div class="gis-popup-inner" style="border-color:${cfg.color}55">
        <div class="gis-popup-title" style="color:${cfg.color}">${r.name}</div>
        <div class="gis-popup-sub">${r.id} · ${r.commune} · ${cfg.label}</div>
        ${detailHtml}
      </div>`, { className: 'gis-popup', maxWidth: 300 });
      if (gisLayerFlags.resources4tc) marker.addTo(gisMap);
      gisLayers.resources.push(marker);
    });

    injectPipeTooltipStyles();
  }, 60);
};

function injectPipeTooltipStyles() {
  if (document.getElementById('gisPipeTooltipCss')) return;
  const s = document.createElement('style');
  s.id = 'gisPipeTooltipCss';
  s.textContent = `.gis-pipe-tooltip{background:rgba(7,22,41,.95)!important;border:1px solid rgba(0,200,255,.25)!important;color:#00c8ff!important;font-size:11px!important;padding:4px 10px!important;border-radius:7px!important;font-family:Inter,sans-serif!important;box-shadow:0 4px 12px rgba(0,0,0,.4)!important}`;
  document.head.appendChild(s);
}

// ══════════════════════════════════════════════════════════════════
// LAYER TOGGLE FUNCTIONS
// ══════════════════════════════════════════════════════════════════
function toggleGisLayerGroup(key, visible) {
  gisLayerFlags[key] = visible;
  if (!gisMap) return;

  const toggleMarkers = (arr, show) => arr.forEach(m => show ? m.addTo(gisMap) : gisMap.removeLayer ? gisMap.removeLayer(m) : m.remove());

  if (key === 'stations') toggleMarkers(gisLayers.stations, visible);
  if (key === 'factories') toggleMarkers(gisLayers.factories, visible);
  if (key === 'incidents') toggleMarkers(gisLayers.incidents, visible);
  if (key === 'dikes') toggleMarkers(gisLayers.dikes, visible);
  if (key === 'dmaZones') {
    // Toggle protection zones + their dike networks
    Object.values(gisLayers.dmaPolygons).forEach(({ polygon, labelMarker, dikes, sluices }) => {
      visible ? polygon.addTo(gisMap) : gisMap.removeLayer(polygon);
      visible ? labelMarker.addTo(gisMap) : gisMap.removeLayer(labelMarker);
      dikes.forEach(p => visible ? p.addTo(gisMap) : gisMap.removeLayer(p));
      if (gisLayerFlags.sluices) sluices.forEach(v => visible ? v.addTo(gisMap) : gisMap.removeLayer(v));
    });
  }
  if (key === 'sluices') {
    // Toggle all sluices
    gisLayers.dikes.filter(m => m instanceof L.Marker).forEach(m => visible ? m.addTo(gisMap) : gisMap.removeLayer(m));
    Object.values(gisLayers.dmaPolygons).forEach(({ sluices }) => {
      sluices.forEach(v => visible ? v.addTo(gisMap) : gisMap.removeLayer(v));
    });
  }
  if (key === 'flood') {
    toggleMarkers(gisLayers.flood, visible);
    (gisLayers.floodPolygons || []).forEach(p => visible ? p.addTo(gisMap) : gisMap.removeLayer(p));
  }
  if (key === 'landslide') toggleMarkers(gisLayers.landslide, visible);
  if (key === 'resources4tc') toggleMarkers(gisLayers.resources, visible);
}

function gisDmaToggle(dmaId, visible) {
  gisDmaVisibility[dmaId] = visible;
  if (!gisMap || !gisLayers.dmaPolygons[dmaId]) return;
  const { polygon, labelMarker, dikes, sluices } = gisLayers.dmaPolygons[dmaId];
  visible ? polygon.addTo(gisMap) : gisMap.removeLayer(polygon);
  visible ? labelMarker.addTo(gisMap) : gisMap.removeLayer(labelMarker);
  dikes.forEach(p => visible ? p.addTo(gisMap) : gisMap.removeLayer(p));
  if (gisLayerFlags.sluices) sluices.forEach(v => visible ? v.addTo(gisMap) : gisMap.removeLayer(v));
}

function gisToggleAllDma(state) {
  (window.GIS_DMA_ZONES || []).forEach(dma => {
    gisDmaVisibility[dma.id] = state;
    const el = document.querySelector(`input[onchange="gisDmaToggle('${dma.id}',this.checked)"]`);
    if (el) el.checked = state;
    gisDmaToggle(dma.id, state);
  });
}

function gisZoomTo(lat, lng, stationId) {
  if (gisMap) {
    gisMap.flyTo([lat, lng], 15, { duration: 1.2 });
    const idx = DATA.stations.findIndex(s => s.id === stationId);
    if (idx >= 0 && gisLayers.stations[idx]) setTimeout(() => gisLayers.stations[idx].openPopup(), 1300);
  }
}

function gisZoomToDma(dmaId) {
  const dma = (window.GIS_DMA_ZONES || []).find(d => d.id === dmaId);
  if (!dma || !gisMap) return;
  const l = L.polygon(dma.coords.map(c => [c[0], c[1]]));
  gisMap.flyToBounds(l.getBounds(), { padding: [30, 30], duration: 1.2 });
}

function gisResetView() {
  if (gisMap) gisMap.flyTo([21.02, 105.84], 11, { duration: 1.0 });
  gisFactoryFilter = 'all';
}

function gisFilterFactory(factory) {
  gisFactoryFilter = factory;
  if (!gisMap) return;
  DATA.stations.forEach((s, idx) => {
    if (!gisLayers.stations[idx]) return;
    if (factory === 'all' || s.factory === factory) {
      gisLayerFlags.stations && gisLayers.stations[idx].addTo(gisMap);
    } else {
      gisMap.removeLayer(gisLayers.stations[idx]);
    }
  });
}

// ── NRW → GIS highlight (called from NRW page) ────────────────────
let _gisNrwLayer = null;
function viewNrwOnGis(dmaId, dmaName, lat, lng, lossPercent, lossM3, riskLevel) {
  navigate('gis');
  setTimeout(() => gisHighlightNrw(dmaId, dmaName, lat, lng, lossPercent, lossM3, riskLevel), 700);
}
function gisHighlightNrw(dmaId, dmaName, lat, lng, safetyPercent, lossM3, riskLevel) {
  if (!gisMap) { setTimeout(() => gisHighlightNrw(dmaId, dmaName, lat, lng, safetyPercent, lossM3, riskLevel), 400); return; }
  if (_gisNrwLayer) { gisMap.removeLayer(_gisNrwLayer); _gisNrwLayer = null; }
  const riskColor = riskLevel === 'Rất cao' ? '#ff1744' : riskLevel === 'Cao' ? '#ffca28' : '#00e676';
  _gisNrwLayer = L.circle([lat, lng], {
    radius: 2000, color: riskColor, fillColor: riskColor, fillOpacity: 0.1, weight: 2.5, dashArray: '8 5',
  }).addTo(gisMap);
  gisMap.flyTo([lat, lng], 13, { duration: 1.5 });
  showToast(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> Đã tới Vùng đê: ${dmaName} — Rủi ro: ${riskLevel}`);
}

// ── GIS → Incidents page bridge functions ──────────────────────
function gisViewIncident(incId) {
  if (gisMap) gisMap.closePopup();
  navigate('incidents');
  setTimeout(() => {
    if (typeof viewIncident === 'function') viewIncident(incId);
  }, 380);
}

function gisCreateWorkOrder(incId, location) {
  if (gisMap) gisMap.closePopup();
  navigate('incidents');
  setTimeout(() => {
    if (typeof openNewTask === 'function') {
      openNewTask({
        title: 'Xử lý sự cố ' + incId,
        location: location,
        note: 'Tạo từ GIS – Lệnh công tác cho sự cố ' + incId
      });
    }
  }, 380);
}
