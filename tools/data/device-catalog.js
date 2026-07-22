'use strict';
/**
 * Hadiwa IOC — Device Catalog
 * Thư viện thiết bị hãng phổ biến dùng trong thủy lợi, chống ngập, khí tượng thủy văn
 * Brand → Model → Specs
 */

// ── TRẠM BƠM (Pump Stations) ─────────────────────────────────────────────────
const PUMP_STATIONS = {
  'GF-NB65-250': {
    brand: 'Grundfos', model: 'NB 65-250/219', type: 'pump',
    desc: 'Máy bơm ly tâm nằm ngang, tiêu chuẩn EN733, dùng cho trạm bơm tiêu úng',
    flow_m3h: 65, head_m: 62, power_kW: 15, efficiency: 0.78,
    rpm: 1450, dn_inlet_mm: 65, dn_outlet_mm: 50,
    weight_kg: 68, material: 'Cast Iron / SS304 impeller',
    ip_rating: 'IP55', voltage_v: '380V/3Ph/50Hz',
    certifications: ['CE', 'ISO 9001'],
  },
  'GF-SE110-200': {
    brand: 'Grundfos', model: 'SE1.110.200.4.50E', type: 'pump',
    desc: 'Máy bơm chìm thoát nước, phù hợp bơm tiêu ngập đô thị và khu dân cư',
    flow_m3h: 200, head_m: 14, power_kW: 11, efficiency: 0.73,
    rpm: 960, dn_outlet_mm: 200, max_depth_m: 20,
    weight_kg: 115, material: 'Cast Iron / Stainless Steel',
    ip_rating: 'IP68', voltage_v: '380V/3Ph/50Hz',
    certifications: ['CE', 'ATEX optional'],
  },
  'GF-AP50-50B': {
    brand: 'Grundfos', model: 'AP 50.50.B.1', type: 'pump',
    desc: 'Bơm chìm nhỏ gọn cho giếng thu nước, cống rãnh, drain pit',
    flow_m3h: 18, head_m: 8, power_kW: 0.55, efficiency: 0.65,
    dn_outlet_mm: 50, max_depth_m: 10, weight_kg: 14,
    ip_rating: 'IP68', voltage_v: '220V/1Ph/50Hz',
    certifications: ['CE'],
  },
  'KSB-ETN100-315': {
    brand: 'KSB', model: 'Etanorm 100-315', type: 'pump',
    desc: 'Máy bơm chuẩn EN733, đầu hút trực tiếp, dùng cho hệ thống tưới tiêu',
    flow_m3h: 100, head_m: 80, power_kW: 30, efficiency: 0.81,
    rpm: 1450, dn_inlet_mm: 100, dn_outlet_mm: 100,
    weight_kg: 95, material: 'GG25 / PX-Impeller',
    ip_rating: 'IP55', voltage_v: '380V/3Ph/50Hz',
    certifications: ['CE', 'DIN EN ISO 9001'],
  },
  'KSB-AMA-KRT-D200': {
    brand: 'KSB', model: 'Amarex KRT D 200', type: 'pump',
    desc: 'Máy bơm chìm trục đứng kiểu hướng trục, lý tưởng cho trạm bơm lớn',
    flow_m3h: 1800, head_m: 7, power_kW: 55, efficiency: 0.86,
    rpm: 750, dn_outlet_mm: 200, max_depth_m: 15,
    material: 'EN-GJL-250 / Chromium Steel', ip_rating: 'IP68',
    voltage_v: '380V/3Ph/50Hz', certifications: ['CE', 'DVGW'],
  },
  'FLY-NP3202': {
    brand: 'Xylem Flygt', model: 'NP 3202.183', type: 'pump',
    desc: 'Бoм chìm Flygt kinh điển cho trạm bơm tiêu đô thị, chống tắc nghẽn',
    flow_m3h: 250, head_m: 20, power_kW: 22, efficiency: 0.79,
    rpm: 980, dn_outlet_mm: 200, max_depth_m: 20,
    material: 'Cast Iron / SS impeller', ip_rating: 'IP68',
    voltage_v: '380V/3Ph/50Hz', certifications: ['CE', 'CSA', 'UL'],
  },
  'FLY-CB3201': {
    brand: 'Xylem Flygt', model: 'CB 3201.180', type: 'pump',
    desc: 'Máy bơm hỗn hợp submersible dòng CB cho trạm bơm nước thải đô thị',
    flow_m3h: 310, head_m: 18, power_kW: 26, efficiency: 0.80,
    rpm: 980, dn_outlet_mm: 200, max_depth_m: 20,
    ip_rating: 'IP68', voltage_v: '380V/3Ph/50Hz',
    certifications: ['CE', 'ATEX D'],
  },
  'EBA-FSA150': {
    brand: 'Ebara', model: 'A-Series 150×125 FSA', type: 'pump',
    desc: 'Máy bơm đầu hút nằm ngang, phổ biến tại các trạm bơm tưới tiêu Việt Nam',
    flow_m3h: 120, head_m: 55, power_kW: 22, efficiency: 0.80,
    rpm: 1450, dn_inlet_mm: 150, dn_outlet_mm: 125,
    material: 'Cast Iron', ip_rating: 'IP55',
    voltage_v: '380V/3Ph/50Hz', certifications: ['CE'],
  },
  'TSU-LH221': {
    brand: 'Tsurumi', model: 'LH221', type: 'pump',
    desc: 'Máy bơm chìm thoát nước thải dân dụng và công nghiệp nhẹ',
    flow_m3h: 21, head_m: 22, power_kW: 2.2, efficiency: 0.71,
    rpm: 1420, dn_outlet_mm: 65, max_depth_m: 10,
    ip_rating: 'IP68', voltage_v: '380V/3Ph/50Hz',
    certifications: ['CE'],
  },
};

// ── CỐNG ĐIỀU TIẾT (Sluice / Valve Actuators) ───────────────────────────────
const SLUICE_GATES = {
  'ROT-IQ3-F10': {
    brand: 'Rotork', model: 'IQ3 F10 (1-Phase)', type: 'sluice',
    desc: 'Cơ cấu điều khiển điện đa vòng, tiêu chuẩn F10, cho van đến DN400',
    torque_Nm: 1000, turns_full_travel: 60, power_W: 300,
    operating_time_s: 45, ip_rating: 'IP68', weight_kg: 18,
    protocol: 'Profibus DP, HART, Modbus RTU',
    voltage_v: '220V/1Ph/50Hz', certifications: ['CE', 'ATEX'],
  },
  'ROT-IQ32-F14': {
    brand: 'Rotork', model: 'IQ3 F14 (3-Phase)', type: 'sluice',
    desc: 'Cơ cấu điều khiển điện công suất lớn cho van đến DN800, IP68, ATEX',
    torque_Nm: 4000, turns_full_travel: 90, power_W: 750,
    operating_time_s: 90, ip_rating: 'IP68', weight_kg: 42,
    protocol: 'Profibus DP, HART, Foundation Fieldbus',
    voltage_v: '380V/3Ph/50Hz', certifications: ['CE', 'ATEX', 'IECEx'],
  },
  'ROT-CML100': {
    brand: 'Rotork', model: 'CML 100/190', type: 'sluice',
    desc: 'Bộ truyền động tuyến tính điện cho van cổng, van cửa phai thủy lợi',
    thrust_N: 100000, stroke_mm: 190, power_W: 550,
    operating_time_s: 60, ip_rating: 'IP67', weight_kg: 32,
    protocol: 'Digital link / Modbus RTU',
    voltage_v: '380V/3Ph/50Hz', certifications: ['CE'],
  },
  'AUMA-SAR7-6': {
    brand: 'AUMA', model: 'SAR 7.6 AM 01.1', type: 'sluice',
    desc: 'Bộ truyền động điện quay AUMA, tiêu chuẩn EN ISO 5210, cho van bướm',
    torque_Nm: 750, operating_time_s: 30, ip_rating: 'IP67',
    weight_kg: 15, protocol: 'AUMA COM, Profibus PA',
    voltage_v: '380V/3Ph/50Hz', certifications: ['CE', 'ATEX'],
  },
  'AUMA-SA142-1': {
    brand: 'AUMA', model: 'SA 14.2 AM 01.1', type: 'sluice',
    desc: 'Bộ truyền động điện quay cỡ lớn, dùng cho van gate và van hộp lớn',
    torque_Nm: 4000, operating_time_s: 120, ip_rating: 'IP68',
    weight_kg: 105, protocol: 'PROFIBUS, HART, Modbus',
    voltage_v: '380V/3Ph/50Hz', certifications: ['CE', 'ATEX IIc'],
  },
  'BIFFI-ICON2000': {
    brand: 'Biffi (Emerson)', model: 'ICON 2000 EH', type: 'sluice',
    desc: 'Bộ truyền động khí nén thông minh với ICON controller, cho van cầu ngập lớn',
    torque_Nm: 2000, operating_time_s: 20, ip_rating: 'IP67',
    protocol: 'HART 7, Foundation Fieldbus, Profibus',
    certifications: ['CE', 'ATEX', 'SIL 2'],
  },
  'SMD-HYD-1000': {
    brand: 'Smedmans', model: 'HYD-1000 Hydraulic', type: 'sluice',
    desc: 'Bộ truyền động thủy lực cho cửa phai, đập tràn, cống quy mô lớn tại Việt Nam',
    thrust_N: 1000000, stroke_mm: 500, power_W: 2200,
    operating_time_s: 300, ip_rating: 'IP65',
    protocol: 'Local + Remote 4-20mA', certifications: ['CE'],
  },
};

// ── CẢM BIẾN NGẬP (Flood / Water Level Sensors) ─────────────────────────────
const FLOOD_SENSORS = {
  'OTT-PLS': {
    brand: 'OTT HydroMet', model: 'OTT PLS (Pressure Level Sensor)', type: 'flood',
    desc: 'Cảm biến áp lực mực nước cho giếng, kênh, sông — bảo vệ IP68, dây cáp SS316',
    range_m: 10, accuracy_mm: 5, resolution_mm: 1,
    output: '4-20mA, SDI-12', cable_m: 10, ip_rating: 'IP68',
    material: 'Titanium diaphragm', voltage_v: '9-30V DC',
    certifications: ['CE', 'RoHS'],
  },
  'OTT-STS-DL': {
    brand: 'OTT HydroMet', model: 'OTT STS DL', type: 'flood',
    desc: 'Sensor đo mực nước kỹ thuật số tích hợp datalogger, kết nối SDI-12/RS-485',
    range_m: 20, accuracy_mm: 3, resolution_mm: 0.5,
    output: 'SDI-12, RS-485 Modbus', ip_rating: 'IP68',
    certifications: ['CE'],
  },
  'INSU-LT500': {
    brand: 'In-Situ', model: 'Level TROLL 500', type: 'flood',
    desc: 'Transducer đo áp lực mực nước chính xác cao, calibration tự động bù áp khí',
    range_m: 30, accuracy_mm: 2, resolution_mm: 0.1,
    output: 'TROLL COM, Modbus RS-485', ip_rating: 'IP68',
    material: 'Hastelloy sensor', certifications: ['CE', 'FCC'],
  },
  'KEL-36XW': {
    brand: 'Keller', model: '36XW Digital Transmitter', type: 'flood',
    desc: 'Transducer kỹ thuật số chuẩn IP68 cho theo dõi mực nước sông, hồ, kênh',
    range_bar: 0.3, accuracy_mm: 1, resolution_mm: 0.1,
    output: 'RS-485 Modbus RTU, 4-20mA', ip_rating: 'IP68',
    voltage_v: '8-30V DC', certifications: ['CE', 'RoHS'],
  },
  'VEGA-WL61': {
    brand: 'VEGA', model: 'VEGAPULS WL 61', type: 'flood',
    desc: 'Radar đo mực nước không chạm kiểu phao — phù hợp sông có bèo tảo, rác',
    range_m: 30, accuracy_mm: 2, angle_deg: 15,
    output: '4-20mA HART, Bluetooth', ip_rating: 'IP68',
    protocol: 'HART 5/7, Bluetooth LE',
    certifications: ['CE', 'ATEX', 'SIL 2'],
  },
  'SEBA-MDS': {
    brand: 'SEBA Hydrometrie', model: 'MDS Diver', type: 'flood',
    desc: 'Miniature Data Station chìm kết hợp đo mực nước + datalogger GSM tích hợp',
    range_m: 5, accuracy_mm: 2,
    output: 'SDI-12, RS-232, 4G LTE', ip_rating: 'IP68',
    certifications: ['CE', 'RED'],
  },
};

// ── CẢM BIẾN SẠT LỞ (Landslide / Slope Monitoring Sensors) ─────────────────
const LANDSLIDE_SENSORS = {
  'RST-MEMS-BX': {
    brand: 'RST Instruments', model: 'MEMS Biaxial Tiltmeter', type: 'landslide',
    desc: 'Cảm biến nghiêng MEMS 2 trục — đo độ dịch chuyển góc mái taluy',
    range_deg: 15, accuracy_deg: 0.005, resolution_deg: 0.001,
    output: 'RS-485 Modbus, 4-20mA', ip_rating: 'IP67',
    voltage_v: '9-30V DC', certifications: ['CE', 'RoHS'],
  },
  'RST-IN2': {
    brand: 'RST Instruments', model: 'In-Place Inclinometer Probe', type: 'landslide',
    desc: 'Hệ thống inclinometer đặt cố định đo chuyển vị ngang của khối đất',
    range_mm: 100, accuracy_mm: 0.5,
    output: 'RS-232, 0-5V', ip_rating: 'IP67',
    certifications: ['CE'],
  },
  'GEO-INK32': {
    brand: 'Geotechnical Instruments (UK)', model: 'Inclinometer Casing K80', type: 'landslide',
    desc: 'Hệ thống casing inclinometer ABS/aluminium đo biến dạng sâu trong lòng đất',
    range_mm: 300, accuracy_mm: 1, depth_m: 50,
    output: 'Manual probe / in-place probes', certifications: ['CE'],
  },
  'GEO-PKK3': {
    brand: 'Geotechnical Instruments (UK)', model: 'Piezometer KPN-K (Vibrating Wire)', type: 'landslide',
    desc: 'Piezometer dây rung đo áp lực lỗ rỗng — cảnh báo sạt lở do mưa',
    range_bar: 2, accuracy_pct: 0.1, resolution_kPa: 0.1,
    output: 'Vibrating Wire + NTC thermistor', ip_rating: 'IP68',
    certifications: ['CE'],
  },
  'GEOKON-4427': {
    brand: 'Geokon', model: '4427 Vibrating Wire Tiltmeter', type: 'landslide',
    desc: 'Tiltmeter dây rung độ chính xác cao cho taluy đường, đê điều, bờ kênh',
    range_deg: 10, accuracy_deg: 0.002, resolution_deg: 0.0005,
    output: 'Vibrating Wire (2 channels) + temp', ip_rating: 'IP67',
    certifications: ['CE', 'RoHS'],
  },
  'MINE-SHIELD': {
    brand: 'Mine Safety Appliances (MSA)', model: 'SHIELD Tilt Node', type: 'landslide',
    desc: 'Nút IoT đo nghiêng + gia tốc kế + nhiệt độ, truyền LoRaWAN tích hợp',
    range_deg: 30, accuracy_deg: 0.1,
    output: 'LoRaWAN, BLE 5', ip_rating: 'IP65', battery_life_y: 5,
    certifications: ['CE', 'FCC', 'IC'],
  },
};

// ── TRẠM KHÍ TƯỢNG (Weather Stations) ──────────────────────────────────────
const WEATHER_STATIONS = {
  'DAVIS-VP2': {
    brand: 'Davis Instruments', model: 'Vantage Pro2 Plus', type: 'weather',
    desc: 'Trạm khí tượng tích hợp đầy đủ tham số cho vùng đồng bằng và đồi núi',
    parameters: ['temperature', 'humidity', 'pressure', 'rainfall', 'wind_speed', 'wind_dir', 'solar', 'UV'],
    accuracy_temp_C: 0.5, accuracy_rh_pct: 2, rainfall_resolution_mm: 0.2,
    wind_speed_ms: '0–89 m/s', anemometer_self_emptying: true,
    output: 'Davis WeatherLink, RS-232', ip_rating: 'IP44',
    certifications: ['CE', 'FCC'],
  },
  'VAISALA-WXT536': {
    brand: 'Vaisala', model: 'WXT536', type: 'weather',
    desc: 'Bộ đo thời tiết compact 6-in-1: gió, mưa, T/RH, áp lực — không bộ phận cơ học',
    parameters: ['temperature', 'humidity', 'pressure', 'rainfall', 'wind_speed', 'wind_dir'],
    accuracy_temp_C: 0.3, accuracy_rh_pct: 3, rainfall_resolution_mm: 0.01,
    wind_speed_ms: '0–60 m/s', ip_rating: 'IP66',
    output: 'RS-232, RS-485, SDI-12, ASCII', voltage_v: '6-30V DC',
    certifications: ['CE', 'FCC', 'ROHS'],
  },
  'CAMPBELL-CLIM200': {
    brand: 'Campbell Scientific', model: 'CLIM200 AWS', type: 'weather',
    desc: 'Trạm quan trắc tự động Campbell với CR300 datalogger, kết nối mạng di động',
    parameters: ['temperature', 'humidity', 'pressure', 'rainfall', 'wind_speed', 'wind_dir', 'solar', 'soil_moisture'],
    accuracy_temp_C: 0.2, accuracy_rh_pct: 1.5, rainfall_resolution_mm: 0.1,
    output: 'LoggerNet, NL240 Ethernet, CS I/O', ip_rating: 'IP67',
    certifications: ['CE', 'FCC', 'ICES-003'],
  },
  'RMY-32500': {
    brand: 'R.M. Young', model: '32500 Remote Weather Station', type: 'weather',
    desc: 'Trạm thời tiết xách tay cho hiện trường, phù hợp vùng sâu không có điện lưới',
    parameters: ['temperature', 'humidity', 'wind_speed', 'wind_dir', 'rainfall'],
    accuracy_temp_C: 0.3, accuracy_rh_pct: 2, ip_rating: 'IP67',
    output: 'SDI-12, RS-232', power: 'Solar + Battery back-up',
    certifications: ['CE'],
  },
  'LUFFT-WS200': {
    brand: 'Lufft', model: 'WS200-UMB Smart Weather Sensor', type: 'weather',
    desc: 'Cảm biến thời tiết compact không cơ học, truyền thông UMB protocol, phù hợp IoT',
    parameters: ['temperature', 'humidity', 'pressure', 'wind_speed', 'wind_dir', 'precipitation'],
    accuracy_temp_C: 0.2, ip_rating: 'IP67',
    output: 'UMB, RS-485 Modbus, SDI-12',
    voltage_v: '8-30V DC', certifications: ['CE', 'RoHS'],
  },
};

// ── Export ────────────────────────────────────────────────────────────────────
module.exports = {
  PUMP_STATIONS,
  SLUICE_GATES,
  FLOOD_SENSORS,
  LANDSLIDE_SENSORS,
  WEATHER_STATIONS,

  // Flat array by device type for API
  getAll() {
    const all = [];
    const sections = [
      { key: 'pump', data: PUMP_STATIONS },
      { key: 'sluice', data: SLUICE_GATES },
      { key: 'flood', data: FLOOD_SENSORS },
      { key: 'landslide', data: LANDSLIDE_SENSORS },
      { key: 'weather', data: WEATHER_STATIONS },
    ];
    for (const { key, data } of sections) {
      for (const [code, spec] of Object.entries(data)) {
        all.push({ code, deviceType: key, ...spec });
      }
    }
    return all;
  },

  getByType(type) {
    const map = {
      pump: PUMP_STATIONS,
      sluice: SLUICE_GATES,
      flood: FLOOD_SENSORS,
      floodSensor: FLOOD_SENSORS,
      landslide: LANDSLIDE_SENSORS,
      weather: WEATHER_STATIONS,
    };
    const data = map[type] || {};
    return Object.entries(data).map(([code, spec]) => ({ code, deviceType: type, ...spec }));
  },
};
