// ══════════════════════════════════════════════════════════════════
// GIS DATA — ĐÊ ĐIỀU & THỦY LỢI TP. HÀ NỘI
// Tuyến đê sông Hồng, Đáy, Đuống, Nhuệ, Cầu + vùng hành lang bảo vệ
// ══════════════════════════════════════════════════════════════════

// ── VÙNG HÀNH LANG BẢO VỆ ĐÊ / VÙNG PHÂN LŨ ─────────────────────
// id, name, coords = polygon vùng hành lang an toàn hoặc vùng phân lũ
window.GIS_DMA_ZONES = [
  {
    id: 'HL01', name: 'Hành lang bảo vệ Đê Tả Hồng', district: 'Long Biên – Gia Lâm',
    color: '#00c8ff', fillOpacity: 0.07,
    status: 'ok', loss: 0, customers: 0, supplyFlow: 0, consumptionFlow: 0,
    coords: [
      [21.0700, 105.8500], [21.0720, 105.8700], [21.0580, 105.9100],
      [21.0420, 105.9300], [21.0300, 105.9200], [21.0200, 105.9000],
      [21.0280, 105.8700], [21.0450, 105.8500], [21.0700, 105.8500]
    ],
    dikeLength: 72.5, grade: 1, condition: 'Đạt tiêu chuẩn', alertLevel: 0,
    note: 'Hành lang bảo vệ 50m mỗi bên đê Tả Hồng'
  },
  {
    id: 'HL02', name: 'Hành lang bảo vệ Đê Hữu Hồng', district: 'Tây Hồ – Bắc Từ Liêm',
    color: '#ffca28', fillOpacity: 0.08,
    status: 'warning', loss: 0, customers: 0, supplyFlow: 0, consumptionFlow: 0,
    coords: [
      [21.0850, 105.7400], [21.0900, 105.7600], [21.0750, 105.8000],
      [21.0600, 105.8200], [21.0480, 105.8100], [21.0380, 105.7900],
      [21.0450, 105.7600], [21.0620, 105.7400], [21.0850, 105.7400]
    ],
    dikeLength: 58.3, grade: 1, condition: 'Cần gia cố mái K22+300', alertLevel: 1,
    note: 'Sạt lở mái đê phía sông K22+300 — đang xử lý'
  },
  {
    id: 'HL03', name: 'Vùng phân lũ Đồng bằng sông Đáy', district: 'Chương Mỹ – Mỹ Đức',
    color: '#ff1744', fillOpacity: 0.12,
    status: 'critical', loss: 0, customers: 0, supplyFlow: 0, consumptionFlow: 0,
    coords: [
      [20.9200, 105.5800], [20.9300, 105.6500], [20.8800, 105.7200],
      [20.8000, 105.7500], [20.7400, 105.7200], [20.7200, 105.6500],
      [20.7600, 105.5800], [20.8400, 105.5500], [20.9200, 105.5800]
    ],
    dikeLength: 55.2, grade: 2, condition: 'Thẩm lậu K18+500 – ứng cứu khẩn', alertLevel: 2,
    note: 'Vùng phân lũ dự phòng khi lũ sông Hồng vượt BĐ3'
  },
  {
    id: 'HL04', name: 'Hành lang bảo vệ Đê Tả Đuống', district: 'Gia Lâm – Đông Anh',
    color: '#2984EE', fillOpacity: 0.06,
    status: 'ok', loss: 0, customers: 0, supplyFlow: 0, consumptionFlow: 0,
    coords: [
      [21.0700, 105.9500], [21.0800, 105.9800], [21.0850, 106.0100],
      [21.0750, 106.0300], [21.0550, 106.0100], [21.0480, 105.9800],
      [21.0550, 105.9500], [21.0700, 105.9500]
    ],
    dikeLength: 38.9, grade: 1, condition: 'Đạt tiêu chuẩn', alertLevel: 0,
    note: 'Hành lang bảo vệ đê Tả Đuống 50m hai bên'
  },
  {
    id: 'HL05', name: 'Vùng lưu vực hồ Suối Hai', district: 'H. Ba Vì',
    color: '#2984EE', fillOpacity: 0.08,
    status: 'ok', loss: 0, customers: 0, supplyFlow: 0, consumptionFlow: 0,
    coords: [
      [21.1500, 105.2800], [21.1600, 105.3200], [21.1450, 105.3800],
      [21.1150, 105.4000], [21.1000, 105.3700], [21.1050, 105.3100],
      [21.1300, 105.2900], [21.1500, 105.2800]
    ],
    dikeLength: 0, grade: 0, condition: 'Hồ điều tiết – mực nước 20.8m', alertLevel: 0,
    note: 'Vùng lưu vực bảo vệ hồ Suối Hai – tưới 7500 ha'
  },
  {
    id: 'HL06', name: 'Vùng lưu vực hồ Tuy Lai', district: 'H. Mỹ Đức',
    color: '#ff6d00', fillOpacity: 0.14,
    status: 'critical', loss: 0, customers: 0, supplyFlow: 0, consumptionFlow: 0,
    coords: [
      [20.6100, 105.7500], [20.6300, 105.7800], [20.6100, 105.8200],
      [20.5700, 105.8300], [20.5500, 105.8000], [20.5600, 105.7600],
      [20.5900, 105.7400], [20.6100, 105.7500]
    ],
    dikeLength: 0, grade: 0, condition: 'Mực nước 19.2m – sắp vượt BĐ2 – đang xả tràn', alertLevel: 2,
    note: 'Hồ Tuy Lai đang vượt ngưỡng báo động – xả 3 khoang tràn'
  },
  {
    id: 'HL07', name: 'Hành lang bảo vệ Đê Ngọc Tảo – Ba Vì', district: 'H. Ba Vì',
    color: '#ff1744', fillOpacity: 0.10,
    status: 'critical', loss: 0, customers: 0, supplyFlow: 0, consumptionFlow: 0,
    coords: [
      [21.1300, 105.3900], [21.1400, 105.4100], [21.1250, 105.4400],
      [21.1100, 105.4300], [21.1050, 105.4000], [21.1150, 105.3800],
      [21.1300, 105.3900]
    ],
    dikeLength: 18.5, grade: 2, condition: 'Lún nứt đỉnh đê K5+100 – đang gia cố khẩn', alertLevel: 2,
    note: 'Đê Ngọc Tảo K5+100 nứt dọc đỉnh dài 180m — nguy cơ cao'
  },
];

// ── TUYẾN ĐÊ CHÍNH & KÊNH TƯỚI TIÊU HÀ NỘI ─────────────────────
window.GIS_PIPE_NETWORK = [
  // ── ĐÊ TẢ HỒNG (cấp I) ──────────────────────────────────────────
  {
    id: 'DE01', label: 'Đê Tả Hồng – Đoạn Long Biên', type: 'transmission', dmaId: 'HL01',
    status: 'active', diameter: 400, material: 'Đất áp trúc', pressure: 0, flow: 0,
    coords: [[21.0455, 105.8480], [21.0520, 105.8650], [21.0620, 105.8850], [21.0700, 105.9100], [21.0750, 105.9400]],
    valves: [
      { id: 'CG01', type: 'gate', pos: [21.0520, 105.8650], status: 'open' },
      { id: 'CG02', type: 'butterfly', pos: [21.0700, 105.9100], status: 'open' },
    ]
  },
  {
    id: 'DE02', label: 'Đê Tả Hồng – Đoạn Gia Lâm', type: 'transmission', dmaId: 'HL01',
    status: 'active', diameter: 400, material: 'Đất áp trúc', pressure: 0, flow: 0,
    coords: [[21.0750, 105.9400], [21.0800, 105.9600], [21.0850, 105.9900], [21.0880, 106.0200]],
    valves: [
      { id: 'CG03', type: 'gate', pos: [21.0830, 106.0000], status: 'open' },
    ]
  },
  // ── ĐÊ HỮU HỒNG (cấp I – cảnh báo) ─────────────────────────────
  {
    id: 'DE03', label: 'Đê Hữu Hồng – Đoạn Tây Hồ – Bắc Từ Liêm', type: 'transmission', dmaId: 'HL02',
    status: 'warning', diameter: 350, material: 'Đất gia cố mái', pressure: 0, flow: 0,
    coords: [[21.0660, 105.7800], [21.0700, 105.8000], [21.0720, 105.8200], [21.0680, 105.8400]],
    valves: [
      { id: 'CG04', type: 'gate', pos: [21.0700, 105.8000], status: 'open' },
    ]
  },
  {
    id: 'DE04', label: 'Đê Hữu Hồng – K22+300 (Sạt lở mái)', type: 'distribution', dmaId: 'HL02',
    status: 'leaking', diameter: 350, material: 'Đất', pressure: 0, flow: 0,
    coords: [[21.0680, 105.8400], [21.0720, 105.8550], [21.0750, 105.8700]],
    valves: []
  },
  // ── ĐÊ TẢ ĐUỐNG (cấp I) ─────────────────────────────────────────
  {
    id: 'DE05', label: 'Đê Tả Đuống – Đoạn Gia Lâm – Đông Anh', type: 'transmission', dmaId: 'HL04',
    status: 'active', diameter: 300, material: 'Đất cấp phối', pressure: 0, flow: 0,
    coords: [[21.0720, 105.9500], [21.0780, 105.9700], [21.0850, 106.0000], [21.0900, 106.0250]],
    valves: [
      { id: 'CG05', type: 'gate', pos: [21.0820, 105.9900], status: 'open' },
    ]
  },
  // ── ĐÊ HỮU ĐÁY (cấp II – xung yếu) ─────────────────────────────
  {
    id: 'DE06', label: 'Đê Hữu Đáy – K18+500 (Thẩm lậu khẩn cấp)', type: 'distribution', dmaId: 'HL03',
    status: 'leaking', diameter: 250, material: 'Đất', pressure: 0, flow: 0,
    coords: [[21.1050, 105.5180], [21.0900, 105.5300], [21.0750, 105.5400], [21.0600, 105.5500]],
    valves: []
  },
  {
    id: 'DE07', label: 'Đê Hữu Đáy – Đoạn Phúc Thọ', type: 'distribution', dmaId: 'HL03',
    status: 'active', diameter: 250, material: 'Đất', pressure: 0, flow: 0,
    coords: [[21.1400, 105.4800], [21.1200, 105.5000], [21.1050, 105.5180]],
    valves: [
      { id: 'CG06', type: 'gate', pos: [21.1200, 105.5000], status: 'open' },
    ]
  },
  // ── ĐÊ NGỌC TẢO – BA VÌ (cấp II – sự cố) ───────────────────────
  {
    id: 'DE08', label: 'Đê Ngọc Tảo K5+100 (Lún nứt đỉnh – gia cố khẩn)', type: 'distribution', dmaId: 'HL07',
    status: 'leaking', diameter: 200, material: 'Đất', pressure: 0, flow: 0,
    coords: [[21.1350, 105.3900], [21.1250, 105.4100], [21.1150, 105.4300]],
    valves: []
  },
  // ── KÊNH TIÊU SỐ 1 – HÀ ĐÔNG ────────────────────────────────────
  {
    id: 'KT01', label: 'Kênh tiêu Hà Đông – Nhuệ Giang', type: 'distribution', dmaId: null,
    status: 'active', diameter: 150, material: 'Bê tông cốt thép', pressure: 0, flow: 42,
    coords: [
      [20.9800, 105.7800], [20.9700, 105.7700], [20.9600, 105.7600],
      [20.9450, 105.7500], [20.9300, 105.7400]
    ],
    valves: [
      { id: 'CG07', type: 'butterfly', pos: [20.9650, 105.7650], status: 'open' },
      { id: 'CG08', type: 'gate', pos: [20.9400, 105.7450], status: 'open' },
    ]
  },
  // ── KÊNH CHÍNH HỒ SUỐI HAI ───────────────────────────────────────
  {
    id: 'KT02', label: 'Kênh chính hồ Suối Hai – tưới nội đồng Ba Vì', type: 'transmission', dmaId: 'HL05',
    status: 'active', diameter: 200, material: 'Bê tông', pressure: 0, flow: 18,
    coords: [[21.1350, 105.3250], [21.1200, 105.3600], [21.1050, 105.3900], [21.0900, 105.4200]],
    valves: [
      { id: 'CG09', type: 'meter', pos: [21.1150, 105.3700], status: 'active' },
    ]
  },
  // ── TRÀN XẢ LŨ HỒ TUY LAI ───────────────────────────────────────
  {
    id: 'KT03', label: 'Tràn xả lũ hồ Tuy Lai (đang mở 3 khoang)', type: 'transmission', dmaId: 'HL06',
    status: 'leaking', diameter: 300, material: 'Bê tông cốt thép', pressure: 0, flow: 28,
    coords: [[20.5900, 105.7900], [20.5950, 105.8000], [20.6050, 105.8100], [20.6200, 105.8200]],
    valves: [
      { id: 'SP01', type: 'gate', pos: [20.5950, 105.7950], status: 'open' },
    ]
  },
  // ── KÊNH TIÊU ĐAN PHƯỢNG – HOÀI ĐỨC ────────────────────────────
  {
    id: 'KT04', label: 'Kênh tiêu Đan Phượng – Hoài Đức', type: 'distribution', dmaId: null,
    status: 'warning', diameter: 120, material: 'Đất + đá hộc', pressure: 0, flow: 15,
    coords: [[21.0000, 105.6800], [21.0100, 105.6600], [21.0050, 105.6400], [20.9900, 105.6200]],
    valves: [
      { id: 'CG10', type: 'gate', pos: [21.0050, 105.6600], status: 'closed' },
    ]
  },
];

// ── VỊ TRÍ HỒ CHỨA (markers trên GIS — Hà Nội) ──────────────────
window.GIS_FACTORY_LATLNG = [
  { lat: 21.1350, lng: 105.3250 }, // Hồ Suối Hai – Ba Vì
  { lat: 21.0050, lng: 105.4350 }, // Hồ Đồng Mô – Sơn Tây
  { lat: 20.6250, lng: 105.7450 }, // Hồ Quan Sơn – Mỹ Đức
  { lat: 20.5900, lng: 105.7900 }, // Hồ Tuy Lai – Mỹ Đức
  { lat: 20.8100, lng: 105.6300 }, // Hồ Văn Sơn – Chương Mỹ
  { lat: 21.0700, lng: 105.3800 }, // Hồ Tiên Sa – Ba Vì
];
