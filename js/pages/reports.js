// ── PCTT REPORTS & ANALYTICS ─────────────────────────────────────────────
let reportTab = 'disaster';
let reportPeriod = 'Q1-2026';

const RPT = {
  periods: ['Hôm nay', 'Tuần này', 'T3/2026', 'Q1-2026', 'Năm 2025'],

  disaster: {
    'Hôm nay':  { incidents:[0,0,0,1,2,3,3,3], labels:['0h','3h','6h','9h','12h','15h','18h','21h'], types:{flood:1,landslide:0,storm:1,other:1}, resolved:1, total:3, dmg:0.8 },
    'Tuần này': { incidents:[2,3,5,4,6,8,7,5], labels:['T2','T3','T4','T5','T6','T7','CN','Tổng'], types:{flood:3,landslide:2,storm:6,other:5}, resolved:24, total:40, dmg:4.5 },
    'T3/2026':  { incidents:[8,15,22,18,12,9,14,20], labels:['T1','T2','T3','T4','T5','T6','T7','T8'], types:{flood:12,landslide:8,storm:25,other:18}, resolved:50, total:63, dmg:28.4 },
    'Q1-2026':  { incidents:[45,62,38,51,48,55,42,36], labels:['T1','T2','T3','T4','T5','T6','T7','T8'], types:{flood:35,landslide:22,storm:80,other:45}, resolved:158, total:182, dmg:125.6 },
    'Năm 2025': { incidents:[85,92,45,28,30,65,120,150,135,112,78,68], labels:['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'], types:{flood:180,landslide:95,storm:380,other:225}, resolved:820, total:880, dmg:485.2 },
  },

  rainfall: {
    stations: ['Cổ Nhuế','Yên Sở','Ba Thá','Phủ Lỗ','Sơn Tây','Ba Vì','Chương Mỹ','Ứng Hoà'],
    'Hôm nay':  { values:[12.5,28.0,42.8,8.2,16.5,22.1,35.6,9.4], max:42.8, avg:21.9 },
    'Tuần này': { values:[45,82,125,30,58,95,142,38], max:142, avg:77 },
    'T3/2026':  { values:[148,210,318,94,168,225,380,112], max:380, avg:207 },
    'Q1-2026':  { values:[320,418,608,215,358,512,810,290], max:810, avg:441 },
    'Năm 2025': { values:[1250,1680,2350,980,1420,1890,3100,1150], max:3100, avg:1728 },
  },

  waterLevel: {
    labels: ['01/03','05/03','09/03','13/03','17/03','21/03','25/03','29/03'],
    sHong:  [8.2,8.4,9.1,9.8,10.2,9.6,8.9,8.5],
    sDuong: [3.1,3.4,4.0,4.8,5.2,4.6,4.0,3.6],
    sDay:   [2.1,2.3,2.8,3.5,4.1,3.8,3.2,2.8],
    bd1: 10.5, bd2: 11.0,
  },

  budget: {
    districts: ['Ba Vì','Sơn Tây','Phúc Thọ','Đông Anh','Gia Lâm','Hoài Đức','Chương Mỹ','Mỹ Đức'],
    planned:   [45,38,52,65,58,35,72,41],
    collected: [32.5,38,21,62,52,30,60,38],
    year2024:  [40,35,48,60,55,32,65,38],
    categories: { infrastructure:220, training:45, equipment:85, emergency:75 },
    total: 425, collected_total: 334,
  },

  // ── Báo cáo Thủy lợi
  irrigation: {
    reportTypes: ['Hiện trạng CTTL', 'Cấp phép Thủy lợi', 'Vi phạm Thủy lợi', 'Kiểm định An toàn', 'Đầu tư & Nâng cấp'],
    levels: ['Thành phố', 'Công ty Thủy lợi', 'Xã / Huyện'],
    // Per level mock summary data
    summary: {
      'Thành phố': {
        'Hiện trạng CTTL':   { total:1248, good:892, degraded:318, critical:38, kpi:[{l:'Tổng CTTL',v:'1.248',c:'#00c8ff'},{l:'Trạng thái tốt',v:'892',c:'#00e676'},{l:'Xuống cấp',v:'318',c:'#ffca28'},{l:'Hư hỏng nặng',v:'38',c:'#ff5252'}] },
        'Cấp phép Thủy lợi': { total:284, approved:198, pending:62, rejected:24, kpi:[{l:'Tổng hồ sơ',v:'284',c:'#00c8ff'},{l:'Đã cấp',v:'198',c:'#00e676'},{l:'Đang xử lý',v:'62',c:'#ffca28'},{l:'Từ chối',v:'24',c:'#ff5252'}] },
        'Vi phạm Thủy lợi':  { total:142, resolved:98, processing:32, unresolved:12, kpi:[{l:'Tổng vi phạm',v:'142',c:'#ff5252'},{l:'Đã xử lý',v:'98',c:'#00e676'},{l:'Đang xử lý',v:'32',c:'#ffca28'},{l:'Chưa xử lý',v:'12',c:'#ff5252'}] },
        'Kiểm định An toàn':  { total:42, ok:28, warning:8, overdue:6, kpi:[{l:'Tổng đập/hồ',v:'42',c:'#00c8ff'},{l:'An toàn',v:'28',c:'#00e676'},{l:'Cần theo dõi',v:'8',c:'#ffca28'},{l:'Quá hạn KĐ',v:'6',c:'#ff5252'}] },
        'Đầu tư & Nâng cấp': { total:38, budget:'856 tỷ', completed:22, ongoing:12, planned:4, kpi:[{l:'Tổng dự án',v:'38',c:'#00c8ff'},{l:'Hoàn thành',v:'22',c:'#00e676'},{l:'Đang thi công',v:'12',c:'#ffca28'},{l:'Kế hoạch',v:'4',c:'#546e7a'}] },
      },
      'Công ty Thủy lợi': {
        'Hiện trạng CTTL':   { total:312, good:228, degraded:72, critical:12, kpi:[{l:'Tổng CTTL quản lý',v:'312',c:'#00c8ff'},{l:'Trạng thái tốt',v:'228',c:'#00e676'},{l:'Xuống cấp',v:'72',c:'#ffca28'},{l:'Hư hỏng nặng',v:'12',c:'#ff5252'}] },
        'Cấp phép Thủy lợi': { total:71, approved:52, pending:14, rejected:5, kpi:[{l:'Tổng hồ sơ',v:'71',c:'#00c8ff'},{l:'Đã cấp',v:'52',c:'#00e676'},{l:'Đang xử lý',v:'14',c:'#ffca28'},{l:'Từ chối',v:'5',c:'#ff5252'}] },
        'Vi phạm Thủy lợi':  { total:36, resolved:25, processing:8, unresolved:3, kpi:[{l:'Tổng vi phạm',v:'36',c:'#ff5252'},{l:'Đã xử lý',v:'25',c:'#00e676'},{l:'Đang xử lý',v:'8',c:'#ffca28'},{l:'Chưa xử lý',v:'3',c:'#ff5252'}] },
        'Kiểm định An toàn':  { total:12, ok:8, warning:3, overdue:1, kpi:[{l:'Tổng đập/hồ',v:'12',c:'#00c8ff'},{l:'An toàn',v:'8',c:'#00e676'},{l:'Cần theo dõi',v:'3',c:'#ffca28'},{l:'Quá hạn KĐ',v:'1',c:'#ff5252'}] },
        'Đầu tư & Nâng cấp': { total:10, budget:'215 tỷ', completed:6, ongoing:3, planned:1, kpi:[{l:'Tổng dự án',v:'10',c:'#00c8ff'},{l:'Hoàn thành',v:'6',c:'#00e676'},{l:'Đang thi công',v:'3',c:'#ffca28'},{l:'Kế hoạch',v:'1',c:'#546e7a'}] },
      },
      'Xã / Huyện': {
        'Hiện trạng CTTL':   { total:52, good:38, degraded:11, critical:3, kpi:[{l:'Tổng CTTL xã/huyện',v:'52',c:'#00c8ff'},{l:'Trạng thái tốt',v:'38',c:'#00e676'},{l:'Xuống cấp',v:'11',c:'#ffca28'},{l:'Hư hỏng nặng',v:'3',c:'#ff5252'}] },
        'Cấp phép Thủy lợi': { total:18, approved:12, pending:4, rejected:2, kpi:[{l:'Tổng hồ sơ',v:'18',c:'#00c8ff'},{l:'Đã cấp',v:'12',c:'#00e676'},{l:'Đang xử lý',v:'4',c:'#ffca28'},{l:'Từ chối',v:'2',c:'#ff5252'}] },
        'Vi phạm Thủy lợi':  { total:8, resolved:5, processing:2, unresolved:1, kpi:[{l:'Tổng vi phạm',v:'8',c:'#ff5252'},{l:'Đã xử lý',v:'5',c:'#00e676'},{l:'Đang xử lý',v:'2',c:'#ffca28'},{l:'Chưa xử lý',v:'1',c:'#ff5252'}] },
        'Kiểm định An toàn':  { total:3, ok:2, warning:1, overdue:0, kpi:[{l:'Tổng đập/hồ',v:'3',c:'#00c8ff'},{l:'An toàn',v:'2',c:'#00e676'},{l:'Cần theo dõi',v:'1',c:'#ffca28'},{l:'Quá hạn KĐ',v:'0',c:'#546e7a'}] },
        'Đầu tư & Nâng cấp': { total:5, budget:'38 tỷ', completed:3, ongoing:2, planned:0, kpi:[{l:'Tổng dự án',v:'5',c:'#00c8ff'},{l:'Hoàn thành',v:'3',c:'#00e676'},{l:'Đang thi công',v:'2',c:'#ffca28'},{l:'Kế hoạch',v:'0',c:'#546e7a'}] },
      },
    },
    // Table rows phân theo cấp báo cáo: Thành phố / Công ty TL / Xã – Huyện
    tableRowsByLevel: {
      'Thành phố': {
        'Hiện trạng CTTL': [
          { don_vi:'Hà Nội (TP)', kenh_tuoi:482, kenh_tieu:318, ho_chua:42, tram_bom:128, cong_dk:215, tong:1248, tot_pct:71.5, xuong_cap_pct:25.5, hu_hong_pct:3.0, nam_bc:2026 },
          { don_vi:'Khu vực Tây Nam', kenh_tuoi:185, kenh_tieu:122, ho_chua:18, tram_bom:48, cong_dk:82, tong:472, tot_pct:68.2, xuong_cap_pct:27.8, hu_hong_pct:4.0, nam_bc:2026 },
          { don_vi:'Khu vực Bắc Sông Hồng', kenh_tuoi:142, kenh_tieu:98, ho_chua:12, tram_bom:38, cong_dk:68, tong:358, tot_pct:76.0, xuong_cap_pct:21.5, hu_hong_pct:2.5, nam_bc:2026 },
          { don_vi:'Khu vực Nam – Đông Nam', kenh_tuoi:155, kenh_tieu:98, ho_chua:12, tram_bom:42, cong_dk:65, tong:418, tot_pct:70.3, xuong_cap_pct:26.1, hu_hong_pct:3.6, nam_bc:2026 },
        ],
        'Cấp phép Thủy lợi': [
          { loai_hoat_dong:'Xây dựng ven kênh/hồ', so_hs_nhan:98, da_cap:72, dang_xlý:18, tu_choi:8, ty_le_cap:'73.5%', ghi_chu:'Cần thẩm tra thực địa' },
          { loai_hoat_dong:'Đặt đường ống, cáp qua CT', so_hs_nhan:62, da_cap:51, dang_xlý:9, tu_choi:2, ty_le_cap:'82.3%', ghi_chu:'' },
          { loai_hoat_dong:'Khai thác cát, sỏi', so_hs_nhan:34, da_cap:18, dang_xlý:11, tu_choi:5, ty_le_cap:'52.9%', ghi_chu:'Kiểm soát chặt' },
          { loai_hoat_dong:'Xây cầu qua kênh', so_hs_nhan:52, da_cap:41, dang_xlý:8, tu_choi:3, ty_le_cap:'78.8%', ghi_chu:'' },
          { loai_hoat_dong:'Nuôi thủy sản trên hồ', so_hs_nhan:28, da_cap:16, dang_xlý:12, tu_choi:0, ty_le_cap:'57.1%', ghi_chu:'Đang rà soát quy hoạch' },
          { loai_hoat_dong:'Các hoạt động khác', so_hs_nhan:10, da_cap:0, dang_xlý:6, tu_choi:4, ty_le_cap:'—', ghi_chu:'Chờ hướng dẫn' },
        ],
        'Vi phạm Thủy lợi': [
          { loai_vp:'Lấn chiếm hành lang bảo vệ', quy:'1', so_vu:52, da_xlý:38, chua_xlý:14, tong_phat:'285 tr', xu_huong:'Tăng 12% so 2025' },
          { loai_vp:'Xây dựng trái phép ven kênh', quy:'2', so_vu:35, da_xlý:28, chua_xlý:7, tong_phat:'196 tr', xu_huong:'Ổn định' },
          { loai_vp:'Khai thác cát trái phép', quy:'2', so_vu:18, da_xlý:15, chua_xlý:3, tong_phat:'812 tr', xu_huong:'Giảm 8%' },
          { loai_vp:'Đổ rác thải vào kênh mương', quy:'2', so_vu:28, da_xlý:17, chua_xlý:11, tong_phat:'42 tr', xu_huong:'Tăng 5%' },
          { loai_vp:'Xây kè, đập trái phép', quy:'1', so_vu:9, da_xlý:0, chua_xlý:9, tong_phat:'—', xu_huong:'Mới phát sinh' },
        ],
        'Kiểm định An toàn': [
          { id:'KD-TP-001', ten_ct:'Hồ Tuy Lai', loai:'Hồ chứa lớn', cty:'TL Ba Vì', dung_tich:'14.5 tr m³', kd_gan_nhat:'20/11/2025', ket_qua:'An toàn', kd_tiep:'11/2028', status:'ok' },
          { id:'KD-TP-002', ten_ct:'Hồ Đồng Mô', loai:'Hồ chứa lớn', cty:'TL Hà Tây', dung_tich:'19.3 tr m³', kd_gan_nhat:'10/08/2024', ket_qua:'Cần theo dõi', kd_tiep:'08/2027', status:'warning' },
          { id:'KD-TP-003', ten_ct:'Hồ Suối Hai', loai:'Hồ chứa lớn', cty:'TL Ba Vì', dung_tich:'46.5 tr m³', kd_gan_nhat:'12/09/2021', ket_qua:'An toàn', kd_tiep:'04/2026', status:'overdue' },
          { id:'KD-TP-004', ten_ct:'Hồ Quan Sơn', loai:'Hồ chứa vừa', cty:'TL Hà Tây', dung_tich:'8.7 tr m³', kd_gan_nhat:'20/06/2024', ket_qua:'An toàn', kd_tiep:'06/2027', status:'ok' },
          { id:'KD-TP-005', ten_ct:'Hồ Vai Người', loai:'Hồ chứa nhỏ', cty:'TL Hà Tây', dung_tich:'1.2 tr m³', kd_gan_nhat:'10/05/2022', ket_qua:'Cảnh báo', kd_tiep:'11/2022', status:'overdue' },
          { id:'KD-TP-006', ten_ct:'Hồ Tiên Sa', loai:'Hồ chứa nhỏ', cty:'TL Ba Vì', dung_tich:'0.8 tr m³', kd_gan_nhat:'15/03/2025', ket_qua:'An toàn', kd_tiep:'03/2030', status:'ok' },
        ],
        'Đầu tư & Nâng cấp': [
          { id:'DA-TP-001', ten:'Nâng cấp hệ thống tưới Sông Nhuệ giai đoạn 2', loai:'Kênh tưới', cap:'Trung ương', kp:'385 tỷ', tien_do:62, trang_thai:'Đang thi công', chu_dau_tu:'Bộ NN&PTNT' },
          { id:'DA-TP-002', ten:'Sửa chữa, nâng cấp hồ Tuy Lai', loai:'Hồ chứa', cap:'Thành phố', kp:'125 tỷ', tien_do:100, trang_thai:'Hoàn thành', chu_dau_tu:'Sở NN&PTNT HN' },
          { id:'DA-TP-003', ten:'Cải tạo hệ thống tiêu Thanh Điền', loai:'Kênh tiêu', cap:'Thành phố', kp:'68 tỷ', tien_do:35, trang_thai:'Đang thi công', chu_dau_tu:'Sở NN&PTNT HN' },
          { id:'DA-TP-004', ten:'Xây mới trạm bơm Phù Sa công suất 45m³/s', loai:'Trạm bơm', cap:'Thành phố', kp:'210 tỷ', tien_do:18, trang_thai:'Triển khai', chu_dau_tu:'Sở NN&PTNT HN' },
          { id:'DA-TP-005', ten:'Gia cố đê tả Đáy đoạn Mỹ Đức–Ứng Hòa', loai:'Đê điều', cap:'Trung ương', kp:'156 tỷ', tien_do:80, trang_thai:'Sắp hoàn thành', chu_dau_tu:'Bộ NN&PTNT' },
        ],
      },

      'Công ty Thủy lợi': {
        'Hiện trạng CTTL': [
          { id:'CTTL-C01', ten:'Kênh N2-2 (đoạn km0-km12)', loai:'Kênh tưới cấp 1', cty:'TL Hà Tây', dai_km:12.4, chieu_rong:'8–12m', nam_xd:1992, hien_trang:'Xuống cấp', xu_ly:'Đang lập DA sửa chữa', kd_tiep:'06/2026' },
          { id:'CTTL-C02', ten:'Trạm bơm Cổ Nhuế (45m³/s)', loai:'Trạm bơm', cty:'TL Sông Nhuệ', dai_km:0, chieu_rong:'—', nam_xd:2005, hien_trang:'Tốt', xu_ly:'Bảo dưỡng định kỳ', kd_tiep:'04/2027' },
          { id:'CTTL-C03', ten:'Cống Liên Mạc', loai:'Cống điều tiết', cty:'TL Sông Đáy', dai_km:0, chieu_rong:'B=8m', nam_xd:1998, hien_trang:'Tốt', xu_ly:'', kd_tiep:'01/2028' },
          { id:'CTTL-C04', ten:'Kênh La Khê (đoạn 1–3)', loai:'Kênh tiêu', cty:'TL Sông Nhuệ', dai_km:6.8, chieu_rong:'5–8m', nam_xd:1975, hien_trang:'Hư hỏng nặng', xu_ly:'Ưu tiên sửa chữa khẩn', kd_tiep:'02/2026' },
          { id:'CTTL-C05', ten:'Hồ Quan Sơn (đập chính+phụ)', loai:'Hồ chứa', cty:'TL Hà Tây', dai_km:0, chieu_rong:'—', nam_xd:1998, hien_trang:'Tốt', xu_ly:'', kd_tiep:'06/2027' },
          { id:'CTTL-C06', ten:'Trạm bơm Yên Sở (90m³/s)', loai:'Trạm bơm', cty:'TL Sông Nhuệ', dai_km:0, chieu_rong:'—', nam_xd:2001, hien_trang:'Tốt', xu_ly:'Thay máy 1-3 năm 2027', kd_tiep:'09/2026' },
        ],
        'Cấp phép Thủy lợi': [
          { id:'CP-C01', chu_hs:'Nguyễn Văn An', loai:'Xây dựng ven kênh', pham_vi:'Kênh N2-2 km3+200', cty_xl:'TL Hà Tây', ngay_nop:'15/01/2026', ngay_cap:'28/01/2026', hieu_luc:'28/01/2028', trang_thai:'Đã cấp' },
          { id:'CP-C02', chu_hs:'Công ty TNHH XD Minh Trí', loai:'Đặt ống qua kênh', pham_vi:'Kênh N3 km5+600', cty_xl:'TL Sông Nhuệ', ngay_nop:'28/01/2026', ngay_cap:'—', hieu_luc:'—', trang_thai:'Đang xử lý' },
          { id:'CP-C03', chu_hs:'Trần Thị Bình', loai:'Khai thác cát', pham_vi:'Đoạn sông Đáy–Ba Thá', cty_xl:'TL Ba Vì', ngay_nop:'10/02/2026', ngay_cap:'25/02/2026', hieu_luc:'25/02/2027', trang_thai:'Đã cấp' },
          { id:'CP-C04', chu_hs:'HTX NN Đồng Tâm', loai:'Xây cầu qua kênh', pham_vi:'Kênh N5', cty_xl:'TL Sông Đáy', ngay_nop:'22/02/2026', ngay_cap:'10/03/2026', hieu_luc:'10/09/2026', trang_thai:'Đã cấp' },
          { id:'CP-C05', chu_hs:'Lê Đức Cường', loai:'Xây dựng ven hồ chứa', pham_vi:'Hồ Tuy Lai – phía Đông', cty_xl:'TL Ba Vì', ngay_nop:'05/03/2026', ngay_cap:'—', hieu_luc:'—', trang_thai:'Đang xử lý' },
          { id:'CP-C06', chu_hs:'CTCP Địa ốc Phú Cường', loai:'Bơm cát', pham_vi:'Khu vực hồ Đồng Mô', cty_xl:'TL Hà Tây', ngay_nop:'18/03/2026', ngay_cap:'—', hieu_luc:'—', trang_thai:'Từ chối' },
        ],
        'Vi phạm Thủy lợi': [
          { id:'VP-C01', doi_tuong:'Trần Văn Xuân', loai_vp:'Lấn chiếm hành lang kênh', vi_tri:'Kênh Vân Canh km2+100', cty:'TL Hà Tây', ngay_ph:'05/01/2026', bien_ban:'BB-01/2026', muc_phat:'12.5 tr', trang_thai:'Đã xử phạt' },
          { id:'VP-C02', doi_tuong:'Nguyễn Thị Yến', loai_vp:'Xây chuồng trại trên bờ kênh', vi_tri:'Kênh Đại Mỗ km1+500', cty:'TL Sông Nhuệ', ngay_ph:'12/01/2026', bien_ban:'BB-02/2026', muc_phat:'8.0 tr', trang_thai:'Đang khắc phục' },
          { id:'VP-C03', doi_tuong:'Lê Văn Zẩm', loai_vp:'Khai thác cát trái phép', vi_tri:'Sông Đáy đoạn Ba Vì', cty:'TL Ba Vì', ngay_ph:'20/02/2026', bien_ban:'BB-03/2026', muc_phat:'45.0 tr', trang_thai:'Đã xử phạt' },
          { id:'VP-C04', doi_tuong:'HTX SX Thịnh An', loai_vp:'Xây kè trái phép', vi_tri:'Kênh N4 km8+200', cty:'TL Sông Đáy', ngay_ph:'15/03/2026', bien_ban:'BB-04/2026', muc_phat:'—', trang_thai:'Chưa xử lý' },
          { id:'VP-C05', doi_tuong:'Phùng Văn Nam', loai_vp:'Đổ phế thải xuống kênh', vi_tri:'Kênh tiêu La Khê', cty:'TL Sông Nhuệ', ngay_ph:'22/03/2026', bien_ban:'BB-05/2026', muc_phat:'3.5 tr', trang_thai:'Đang khắc phục' },
        ],
        'Kiểm định An toàn': [
          { id:'KD-C01', ten_ct:'Hồ Tuy Lai (đập chính)', loai:'Hồ chứa lớn', cty:'TL Ba Vì', nam_xd:1985, dung_tich:'14.5M m³', kd_lan_1:'2015', kd_gan_nhat:'11/2025', ket_qua:'An toàn', kd_tiep:'11/2028', status:'ok' },
          { id:'KD-C02', ten_ct:'Hồ Đồng Mô', loai:'Hồ chứa lớn', cty:'TL Hà Tây', nam_xd:1970, dung_tich:'19.3M m³', kd_lan_1:'2010', kd_gan_nhat:'08/2024', ket_qua:'Cần theo dõi thấm mái', kd_tiep:'08/2027', status:'warning' },
          { id:'KD-C03', ten_ct:'Hồ Suối Hai (đập chính)', loai:'Hồ chứa lớn', cty:'TL Ba Vì', nam_xd:1958, dung_tich:'46.5M m³', kd_lan_1:'2005', kd_gan_nhat:'09/2021', ket_qua:'An toàn', kd_tiep:'04/2026', status:'overdue' },
          { id:'KD-C04', ten_ct:'Đập Đá Dựng', loai:'Đập dâng', cty:'TL Sông Đáy', nam_xd:1988, dung_tich:'—', kd_lan_1:'2012', kd_gan_nhat:'07/2023', ket_qua:'Cần sửa cống đáy', kd_tiep:'07/2026', status:'warning' },
          { id:'KD-C05', ten_ct:'Hồ Vai Người', loai:'Hồ chứa nhỏ', cty:'TL Hà Tây', nam_xd:1975, dung_tich:'1.2M m³', kd_lan_1:'2007', kd_gan_nhat:'05/2022', ket_qua:'Cảnh báo nứt đỉnh đập', kd_tiep:'11/2022', status:'overdue' },
        ],
        'Đầu tư & Nâng cấp': [
          { id:'DA-C01', ten:'Nâng cấp kênh N2-2 đoạn km3–km8', loai:'Kênh tưới', cty:'TL Hà Tây', kp:'48.5 tỷ', nguon:'NS TP', tien_do:92, trang_thai:'Sắp hoàn thành' },
          { id:'DA-C02', ten:'Sửa chữa hồ Tuy Lai – đập phụ số 2', loai:'Hồ chứa', cty:'TL Ba Vì', kp:'125.0 tỷ', nguon:'NS TW', tien_do:100, trang_thai:'Hoàn thành' },
          { id:'DA-C03', ten:'Cải tạo trạm bơm Yên Sở – tổ máy 1,2,3', loai:'Trạm bơm', cty:'TL Sông Nhuệ', kp:'38.2 tỷ', nguon:'NS TP', tien_do:65, trang_thai:'Đang thi công' },
          { id:'DA-C04', ten:'Xây mới cống tiêu Đại Áng', loai:'Cống', cty:'TL Sông Đáy', kp:'22.8 tỷ', nguon:'NS TP', tien_do:100, trang_thai:'Hoàn thành' },
          { id:'DA-C05', ten:'Nâng cấp kênh La Khê đoạn 1 (km0–km3)', loai:'Kênh tiêu', cty:'TL Sông Nhuệ', kp:'31.5 tỷ', nguon:'NS TP', tien_do:15, trang_thai:'Kế hoạch' },
          { id:'DA-C06', ten:'Gia cố mái đập hồ Suối Hai', loai:'Hồ chứa', cty:'TL Ba Vì', kp:'85.0 tỷ', nguon:'NS TW', tien_do:42, trang_thai:'Đang thi công' },
        ],
      },

      'Xã / Huyện': {
        'Hiện trạng CTTL': [
          { id:'XH-001', ten_ct:'Kênh nội đồng N5-2', xa:'Hòa Thạch', huyen:'Quốc Oai', loai:'Kênh tưới nội đồng', chieu_dai:'2.8 km', nam_xd:2008, don_vi_ql:'HTX NN Hòa Thạch', trang_thai:'Tốt', ghi_chu:'' },
          { id:'XH-002', ten_ct:'Mương tiêu thôn Đoài', xa:'Đại Mỗ', huyen:'Nam Từ Liêm', loai:'Mương tiêu', chieu_dai:'1.2 km', nam_xd:1988, don_vi_ql:'UBND xã Đại Mỗ', trang_thai:'Xuống cấp', ghi_chu:'Bờ mương sạt lở cục bộ' },
          { id:'XH-003', ten_ct:'Hồ điều hòa Yên Nghĩa', xa:'Yên Nghĩa', huyen:'Hà Đông', loai:'Hồ điều hòa', chieu_dai:'—', nam_xd:2016, don_vi_ql:'UBND quận Hà Đông', trang_thai:'Tốt', ghi_chu:'Sinh thái đô thị' },
          { id:'XH-004', ten_ct:'Cống tưới Thôn Ba', xa:'Thụy An', huyen:'Ba Vì', loai:'Cống lấy nước', chieu_dai:'—', nam_xd:1992, don_vi_ql:'HTX NN Thụy An', trang_thai:'Xuống cấp', ghi_chu:'Cần thay cánh van' },
          { id:'XH-005', ten_ct:'Kênh B5 đoạn qua xã', xa:'Đồng Tâm', huyen:'Mỹ Đức', loai:'Kênh tưới cấp 2', chieu_dai:'3.4 km', nam_xd:2002, don_vi_ql:'HTX NN Đồng Tâm', trang_thai:'Tốt', ghi_chu:'' },
          { id:'XH-006', ten_ct:'Mương thoát nước TDP 5', xa:'Phú Lãm', huyen:'Hà Đông', loai:'Mương thoát', chieu_dai:'0.6 km', nam_xd:2010, don_vi_ql:'UBND phường Phú Lãm', trang_thai:'Hư hỏng', ghi_chu:'Tắc nghẽn rác thải' },
        ],
        'Cấp phép Thủy lợi': [
          { id:'CP-X01', xa_huyen:'Hòa Thạch – Quốc Oai', chu_hs:'Nguyễn Văn Tuấn', loai:'Xây dựng ven kênh', ct_lq:'Kênh N2-2', ngay_nop:'02/01/2026', ket_qua_xa:'Đề nghị cấp', ghi_chu:'Giao cty TL xử lý', trang_thai:'Đã chuyển' },
          { id:'CP-X02', xa_huyen:'Đại Mỗ – Nam Từ Liêm', chu_hs:'Bùi Thị Lan', loai:'Đặt ống dẫn nước', ct_lq:'Mương tiêu thôn Đoài', ngay_nop:'15/01/2026', ket_qua_xa:'Không thuộc thẩm quyền', ghi_chu:'Hướng dẫn lên Sở', trang_thai:'Đang xử lý' },
          { id:'CP-X03', xa_huyen:'Thụy An – Ba Vì', chu_hs:'HTX Thụy An', loai:'Khai thác cát bãi sông', ct_lq:'Sông Đà đoạn qua xã', ngay_nop:'20/01/2026', ket_qua_xa:'Đề nghị không cấp', ghi_chu:'Vi phạm quy hoạch', trang_thai:'Từ chối' },
          { id:'CP-X04', xa_huyen:'Yên Nghĩa – Hà Đông', chu_hs:'CTCP Xây dựng Hùng Vương', loai:'Lấn hồ điều hòa', ct_lq:'Hồ Yên Nghĩa', ngay_nop:'10/02/2026', ket_qua_xa:'Không đồng ý', ghi_chu:'Yêu cầu trả lại hành lang', trang_thai:'Chưa xử lý' },
        ],
        'Vi phạm Thủy lợi': [
          { id:'VP-X01', xa_huyen:'Vân Canh – Hoài Đức', doi_tuong:'Nhóm hộ TDP 3', loai_vp:'Đổ đất lấp mương tiêu', ngay_ph:'08/01/2026', co_quan_xlý:'UBND xã', ket_qua:'Yêu cầu phục hồi', trang_thai:'Đang xử lý' },
          { id:'VP-X02', xa_huyen:'Phú Sơn – Ba Vì', doi_tuong:'Lê Văn Tùng', loai_vp:'Trồng cây trong lòng kênh', ngay_ph:'15/02/2026', co_quan_xlý:'UBND xã', ket_qua:'Yêu cầu chặt bỏ', trang_thai:'Đã xử lý' },
          { id:'VP-X03', xa_huyen:'Đồng Tâm – Mỹ Đức', doi_tuong:'Hộ bà Nguyễn Thị Hoa', loai_vp:'Xây hàng rào lấn bờ kênh', ngay_ph:'22/02/2026', co_quan_xlý:'UBND xã + TL Sông Đáy', ket_qua:'Phạt 5 triệu, yêu cầu tháo dỡ', trang_thai:'Đang thực hiện' },
          { id:'VP-X04', xa_huyen:'Phú Lãm – Hà Đông', doi_tuong:'Ban quản lý chợ Phú Lãm', loai_vp:'Đổ rác vào mương thoát', ngay_ph:'10/03/2026', co_quan_xlý:'UBND phường', ket_qua:'Nhắc nhở, lập biên bản', trang_thai:'Đã xử lý' },
          { id:'VP-X05', xa_huyen:'Thụy An – Ba Vì', doi_tuong:'Công ty CP Vật tư NT', loai_vp:'Khai thác cát trái phép sông Đà', ngay_ph:'18/03/2026', co_quan_xlý:'UBND huyện + CA huyện', ket_qua:'Đang điều tra', trang_thai:'Chưa xử lý' },
        ],
        'Kiểm định An toàn': [
          { id:'KD-X01', ten_ct:'Đập điều tiết Khe Sắn', xa:'Khánh Thượng', huyen:'Ba Vì', loai:'Đập tràn đá xây', nam_xd:1978, kd_gan_nhat:'06/2023', ket_qua:'Cần sửa thân đập', kd_tiep:'06/2028', status:'warning' },
          { id:'KD-X02', ten_ct:'Hồ Đồng Sương', xa:'Chương Mỹ', huyen:'Chương Mỹ', loai:'Hồ nhỏ cấp xã', nam_xd:1990, kd_gan_nhat:'10/2022', ket_qua:'Bình thường', kd_tiep:'10/2027', status:'ok' },
          { id:'KD-X03', ten_ct:'Hồ Văn Sơn', xa:'Lương Sơn', huyen:'Thạch Thất', loai:'Hồ nhỏ cấp xã', nam_xd:1985, kd_gan_nhat:'03/2021', ket_qua:'Thấm mái hạ lưu', kd_tiep:'06/2026', status:'overdue' },
          { id:'KD-X04', ten_ct:'Bờ bao Đồng Bùi', xa:'Bình Phú', huyen:'Thạch Thất', loai:'Bờ bao cánh đồng', nam_xd:2000, kd_gan_nhat:'—', ket_qua:'Chưa kiểm định', kd_tiep:'—', status:'overdue' },
        ],
        'Đầu tư & Nâng cấp': [
          { id:'DA-X01', ten:'Kiên cố hóa kênh mương nội đồng xã Hòa Thạch', xa:'Hòa Thạch', huyen:'Quốc Oai', loai:'Kênh nội đồng', kp:'3.8 tỷ', nguon:'Chương trình NTM', tien_do:100, trang_thai:'Hoàn thành' },
          { id:'DA-X02', ten:'Nâng cấp mương tiêu thôn Đoài', xa:'Đại Mỗ', huyen:'Nam Từ Liêm', loai:'Mương tiêu', kp:'1.2 tỷ', nguon:'NS huyện', tien_do:45, trang_thai:'Đang thi công' },
          { id:'DA-X03', ten:'Sửa chữa thay van cống tưới Thôn Ba', xa:'Thụy An', huyen:'Ba Vì', loai:'Cống lấy nước', kp:'0.35 tỷ', nguon:'NS xã', tien_do:0, trang_thai:'Đề xuất' },
          { id:'DA-X04', ten:'Nạo vét kênh mương HTX Đồng Tâm', xa:'Đồng Tâm', huyen:'Mỹ Đức', loai:'Kênh tưới cấp 2', kp:'0.8 tỷ', nguon:'NS xã + vốn dân', tien_do:70, trang_thai:'Đang thực hiện' },
          { id:'DA-X05', ten:'Xây mới cống điều tiết Khe Sắn', xa:'Khánh Thượng', huyen:'Ba Vì', loai:'Cống', kp:'2.1 tỷ', nguon:'Dự phòng huyện', tien_do:20, trang_thai:'Chuẩn bị đầu tư' },
        ],
      },
    },
    // Keep old tableRows for backward compat (unused)
    tableRows: {
      'Hiện trạng CTTL': [
        { id:'CTTL-001', name:'Hồ Tuy Lai', type:'Hồ chứa', company:'TL Ba Vì', district:'H. Ba Vì', status:'Tốt', yearBuilt:1985, nextInspect:'11/2028' },
        { id:'CTTL-002', name:'Kênh N2-2', type:'Kênh tưới', company:'TL Hà Tây', district:'H. Chương Mỹ', status:'Xuống cấp', yearBuilt:1992, nextInspect:'06/2026' },
        { id:'CTTL-003', name:'Trạm bơm Cổ Nhuế', type:'Trạm bơm', company:'TL Sông Nhuệ', district:'Q. Bắc Từ Liêm', status:'Tốt', yearBuilt:2005, nextInspect:'04/2027' },
        { id:'CTTL-004', name:'Cống Liên Mạc', type:'Cống điều tiết', company:'TL Sông Đáy', district:'Q. Bắc Từ Liêm', status:'Tốt', yearBuilt:1998, nextInspect:'01/2028' },
        { id:'CTTL-005', name:'Hồ Quan Sơn', type:'Hồ chứa', company:'TL Hà Tây', district:'H. Mỹ Đức', status:'Tốt', yearBuilt:1998, nextInspect:'06/2027' },
        { id:'CTTL-006', name:'Kênh La Khê', type:'Kênh tiêu', company:'TL Sông Nhuệ', district:'Q. Hà Đông', status:'Hư hỏng nặng', yearBuilt:1975, nextInspect:'02/2026' },
      ],
      'Cấp phép Thủy lợi': [
        { id:'CP-TL-001', name:'Nguyễn Văn A', type:'Xây dựng ven kênh', company:'TL Hà Tây', commune:'Hòa Thạch – Quốc Oai', date:'15/01/2026', status:'Hoàn thành' },
        { id:'CP-TL-002', name:'Công ty TNHH XD Minh Trí', type:'Đặt ống qua kênh', company:'TL Sông Nhuệ', commune:'Phú Lãm – Hà Đông', date:'28/01/2026', status:'Đang xử lý' },
        { id:'CP-TL-003', name:'Trần Thị B', type:'Khai thác cát CTTL', company:'TL Ba Vì', commune:'Thụy An – Ba Vì', date:'10/02/2026', status:'Hoàn thành' },
        { id:'CP-TL-004', name:'HTX Nông nghiệp Đồng Tâm', type:'Xây cầu qua kênh', company:'TL Sông Đáy', commune:'Đồng Tâm – Mỹ Đức', date:'22/02/2026', status:'Hoàn thành' },
        { id:'CP-TL-005', name:'Lê Văn C', type:'Xây dựng ven hồ chứa', company:'TL Hà Tây', commune:'Tuy Lai – Mỹ Đức', date:'05/03/2026', status:'Đang xử lý' },
        { id:'CP-TL-006', name:'CTCP Địa ốc Phú Cường', type:'Bơm cát khu vực CTTL', company:'TL Ba Vì', commune:'Cổ Đô – Ba Vì', date:'18/03/2026', status:'Từ chối' },
      ],
      'Vi phạm Thủy lợi': [
        { id:'VP-TL-001', name:'Trần Văn X', type:'Lấn chiếm kênh mương', company:'TL Hà Tây', commune:'Vân Canh – Hoài Đức', discovered:'05/01/2026', penalty:'12.5 triệu', status:'Đã xử phạt' },
        { id:'VP-TL-002', name:'Nguyễn Thị Y', type:'Xây chuồng trại trên bờ kênh', company:'TL Sông Nhuệ', commune:'Đại Mỗ – Nam Từ Liêm', discovered:'12/01/2026', penalty:'8.0 triệu', status:'Đang khắc phục' },
        { id:'VP-TL-003', name:'Lê Văn Z', type:'Khai thác cát trái phép', company:'TL Ba Vì', commune:'Phú Sơn – Ba Vì', discovered:'20/02/2026', penalty:'45.0 triệu', status:'Đã xử phạt' },
        { id:'VP-TL-004', name:'HTX sản xuất Thịnh An', type:'Xây kè trái phép', company:'TL Sông Đáy', commune:'Thịnh An – Mỹ Đức', discovered:'15/03/2026', penalty:'—', status:'Chưa xử lý' },
      ],
      'Kiểm định An toàn': [
        { id:'KD-001', name:'Hồ Tuy Lai', type:'Hồ chứa lớn', company:'TL Ba Vì', lastInspect:'20/11/2025', result:'An toàn', nextInspect:'11/2028', status:'ok' },
        { id:'KD-002', name:'Hồ Đồng Mô', type:'Hồ chứa lớn', company:'TL Hà Tây', lastInspect:'10/08/2024', result:'Cần theo dõi', nextInspect:'08/2027', status:'warning' },
        { id:'KD-003', name:'Hồ Suối Hai', type:'Hồ chứa lớn', company:'TL Ba Vì', lastInspect:'12/09/2021', result:'An toàn', nextInspect:'04/2026', status:'overdue' },
        { id:'KD-004', name:'Hồ Quan Sơn', type:'Hồ chứa vừa', company:'TL Hà Tây', lastInspect:'20/06/2024', result:'An toàn', nextInspect:'06/2027', status:'ok' },
        { id:'KD-005', name:'Hồ Vai Người', type:'Hồ chứa nhỏ', company:'TL Hà Tây', lastInspect:'10/05/2022', result:'Cảnh báo', nextInspect:'11/2022', status:'overdue' },
      ],
      'Đầu tư & Nâng cấp': [
        { id:'DA-001', name:'Nâng cấp kênh N2-2 đoạn km3-km8', type:'Kênh tưới', company:'TL Hà Tây', budget:'48.5 tỷ', progress:92, status:'Đang thi công' },
        { id:'DA-002', name:'Sửa chữa hồ Tuy Lai – đập phụ', type:'Hồ chứa', company:'TL Ba Vì', budget:'125.0 tỷ', progress:100, status:'Hoàn thành' },
        { id:'DA-003', name:'Cải tạo trạm bơm Yên Sở', type:'Trạm bơm', company:'TL Sông Nhuệ', budget:'38.2 tỷ', progress:65, status:'Đang thi công' },
        { id:'DA-004', name:'Xây mới cống tiêu Đại Áng', type:'Cống điều tiết', company:'TL Sông Đáy', budget:'22.8 tỷ', progress:100, status:'Hoàn thành' },
        { id:'DA-005', name:'Nâng cấp kênh La Khê đoạn 1', type:'Kênh tiêu', company:'TL Sông Nhuệ', budget:'31.5 tỷ', progress:15, status:'Kế hoạch' },
        { id:'DA-006', name:'Gia cố mái đập hồ Suối Hai', type:'Hồ chứa', company:'TL Ba Vì', budget:'85.0 tỷ', progress:42, status:'Đang thi công' },
      ],
    },
  },

  pump: {
    stations: ['Cổ Nhuế','Yên Sở','Đan Hoài','Tiên Tân','Phù Sa'],
    opHours:  [24,24,18,20,22],
    energy:   [67.2,134.4,13.5,24,37.6],
    capacity: [45,90,12,18.5,28],
    efficiency:[92,95,75,88,91],
  },
};

let _rptCharts = {};

function destroyRptCharts() {
  Object.values(_rptCharts).forEach(c => { try { c.destroy(); } catch(e){} });
  _rptCharts = {};
}

function renderReports() {
  destroyRptCharts();

  // Tab visibility — computed before the template literal
  const _visibleReportTabs = [
    { id: 'disaster',   label: 'Thiên tai & Thiệt hại', iconPath: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>' },
    { id: 'rainfall',   label: 'Thủy văn & Mưa lũ',    iconPath: '<path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 15.25"/>' },
    { id: 'waterlevel', label: 'Mực nước sông',          iconPath: '<path d="M2 12h20M2 19c2-2 4-3 6-2s4 2 6 0 4-2 6 0"/>' },
    { id: 'pump',       label: 'Vận hành Trạm bơm',     iconPath: '<circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>' },
    { id: 'budget',     label: 'Quỹ PCTT & Ngân sách',  iconPath: '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>' },
    { id: 'irrigation', label: 'Báo cáo Thủy lợi',      iconPath: '<path d="M12 2a7 7 0 017 7c0 4-3 6-7 12C8 15 5 13 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2"/>' },
  ].filter(t => typeof isTabVisible === 'function' ? isTabVisible('reports', t.id) : true);

  // Ensure reportTab is a currently-visible tab
  if (_visibleReportTabs.length && !_visibleReportTabs.find(t => t.id === reportTab)) {
    reportTab = _visibleReportTabs[0].id;
  }

  return `
  <div class="page-header">
    <div class="page-title">
      <h1>Báo cáo & Thống kê PCTT</h1>
      <p>Tổng hợp dữ liệu thiên tai, thủy văn, vận hành và ngân sách Hà Nội ${reportPeriod}</p>
    </div>
    <div class="page-actions">
      <select class="form-control" style="width:130px;font-size:13px" onchange="window.reportPeriod=this.value;navigate('reports')">
        ${RPT.periods.map(p=>`<option value="${p}" ${p===reportPeriod?'selected':''}>${p}</option>`).join('')}
      </select>
      <button class="btn btn-ghost btn-sm" onclick="exportReportPdf()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
        Xuất PDF
      </button>
      <button class="btn btn-primary btn-sm" onclick="exportReportExcel()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
        Xuất Excel
      </button>
    </div>
  </div>

  <div class="tabs" style="margin-bottom:20px">
    ${_visibleReportTabs.map(t => `
    <button class="tab-btn ${reportTab === t.id ? 'active' : ''}" onclick="switchReportTab('${t.id}')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle">${t.iconPath}</svg>
      ${t.label}
    </button>`).join('')}
  </div>

  <div id="reportContent">${getReportTabHtml()}</div>`;
}


function switchReportTab(tab) {
  reportTab = tab;
  destroyRptCharts();
  const el = document.getElementById('reportContent');
  if (el) { el.innerHTML = getReportTabHtml(); scheduleReportCharts(); }
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  event?.target?.classList?.add('active');
}

window.afterRender_reports = function() { scheduleReportCharts(); };

function scheduleReportCharts() { setTimeout(renderReportCharts, 60); }

function getReportTabHtml() {
  const d = RPT.disaster[reportPeriod] || RPT.disaster['Q1-2026'];
  const rf = RPT.rainfall[reportPeriod] || RPT.rainfall['Q1-2026'];

  if (reportTab === 'disaster') {
    const pct = Math.round(d.resolved / d.total * 100);
    return `
    <!-- KPIs row -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px">
      ${[
        { label:'Tổng sự cố', val:d.total, color:'var(--cyan)', sub:'trong kỳ báo cáo' },
        { label:'Đã xử lý', val:d.resolved, color:'var(--green)', sub:`Tỷ lệ: ${pct}%` },
        { label:'Đang xử lý', val:d.total-d.resolved, color:'var(--yellow)', sub:'Cần theo dõi' },
        { label:'Thiệt hại ước tính', val:`${d.dmg} tỷ`, color:'var(--red)', sub:'Giảm 15% so cùng kỳ' },
      ].map(k=>`<div class="card kpi-card"><div class="kpi-label">${k.label}</div><div class="kpi-value" style="color:${k.color}">${k.val}</div><div class="kpi-sub">${k.sub}</div></div>`).join('')}
    </div>

    <div style="display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-bottom:16px">
      <!-- Line/Bar chart - incidents over time -->
      <div class="card">
        <div class="card-header"><span class="card-title">Diễn biến sự cố theo thời gian</span></div>
        <div style="padding:16px"><canvas id="rptDisasterChart" height="180"></canvas></div>
      </div>
      <!-- Doughnut - disaster types -->
      <div class="card">
        <div class="card-header"><span class="card-title">Phân loại thiên tai</span></div>
        <div style="padding:16px"><canvas id="rptTypeChart" height="180"></canvas></div>
      </div>
    </div>

    <!-- Disaster table -->
    <div class="card" style="padding:0">
      <div class="card-header"><span class="card-title">Danh sách sự cố gần đây</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Mã</th><th>Loại thiên tai</th><th>Địa điểm</th><th>Cấp độ</th><th>Ngày ghi nhận</th><th>Trạng thái</th><th>Thiệt hại</th></tr></thead>
          <tbody>
            ${[
              { id:'SC-2026-042', type:'Bão số 3', loc:'H. Ba Vì', level:'Cấp độ 3', date:'22/03/2026', status:'resolved', dmg:'8.5 tỷ' },
              { id:'SC-2026-041', type:'Lũ quét', loc:'H. Chương Mỹ', level:'Cấp độ 2', date:'20/03/2026', status:'resolved', dmg:'5.2 tỷ' },
              { id:'SC-2026-040', type:'Ngập úng', loc:'Q. Hoàng Mai', level:'Cấp độ 1', date:'18/03/2026', status:'processing', dmg:'1.8 tỷ' },
              { id:'SC-2026-039', type:'Sạt mái đê', loc:'H. Phúc Thọ', level:'Cấp độ 2', date:'15/03/2026', status:'resolved', dmg:'3.1 tỷ' },
              { id:'SC-2026-038', type:'Mưa đá', loc:'H. Sóc Sơn', level:'Cấp độ 1', date:'12/03/2026', status:'closed', dmg:'0.6 tỷ' },
            ].map(r=>`<tr>
              <td class="mono text-cyan">${r.id}</td>
              <td style="font-weight:600">${r.type}</td>
              <td style="font-size:12px">${r.loc}</td>
              <td><span class="badge ${r.level.includes('3')?'badge-red':r.level.includes('2')?'badge-yellow':'badge-gray'}">${r.level}</span></td>
              <td style="font-size:12px">${r.date}</td>
              <td>${statusBadge(r.status)}</td>
              <td class="mono" style="color:var(--red);font-size:13px">${r.dmg}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  if (reportTab === 'rainfall') {
    return `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:20px">
      ${[
        { label:'Lượng mưa TB', val:`${rf.avg}mm`, color:'var(--cyan)', sub:`Kỳ: ${reportPeriod}` },
        { label:'Lượng mưa cực đại', val:`${rf.max}mm`, color:'var(--yellow)', sub:'Trạm Chương Mỹ' },
        { label:'Số trạm vượt ngưỡng', val:'3/8', color:'var(--red)', sub:'BĐ1: >100mm/24h' },
      ].map(k=>`<div class="card kpi-card"><div class="kpi-label">${k.label}</div><div class="kpi-value" style="color:${k.color}">${k.val}</div><div class="kpi-sub">${k.sub}</div></div>`).join('')}
    </div>

    <div style="display:grid;grid-template-columns:3fr 2fr;gap:16px;margin-bottom:16px">
      <div class="card">
        <div class="card-header"><span class="card-title">Lượng mưa từng trạm đo</span></div>
        <div style="padding:16px"><canvas id="rptRainfallBarChart" height="200"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Phân phối mưa theo cường độ</span></div>
        <div style="padding:16px"><canvas id="rptRainfallPieChart" height="200"></canvas></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">Bảng số liệu mưa theo trạm</span><span style="font-size:11px;color:var(--muted)">Đơn vị: mm | Kỳ: ${reportPeriod}</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Trạm đo mưa</th><th>Lượng mưa (mm)</th><th>So TB cùng kỳ</th><th>Mức cảnh báo</th><th>Trạng thái</th></tr></thead>
          <tbody>
            ${RPT.rainfall.stations.map((s,i) => {
              const v = rf.values[i];
              const pct = ((v - rf.avg) / rf.avg * 100).toFixed(1);
              const alert = v > rf.avg * 1.5 ? 'Vượt ngưỡng' : v > rf.avg * 1.2 ? 'Cao' : 'Bình thường';
              const alertColor = v > rf.avg * 1.5 ? 'badge-red' : v > rf.avg * 1.2 ? 'badge-yellow' : 'badge-green';
              return `<tr>
                <td style="font-weight:600">${s}</td>
                <td class="mono" style="font-size:14px;font-weight:700;color:var(--cyan)">${v}</td>
                <td style="font-size:12px;color:${pct>0?'var(--red)':'var(--green)'}">${pct>0?'+':''}${pct}%</td>
                <td><span class="badge ${alertColor}">${alert}</span></td>
                <td>
                  <div class="progress-bar" style="max-width:120px">
                    <div class="progress-fill" style="width:${Math.min(v/rf.max*100,100)}%;background:${v>rf.avg*1.5?'var(--red)':v>rf.avg*1.2?'var(--yellow)':'var(--cyan)'}"></div>
                  </div>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  if (reportTab === 'waterlevel') {
    const wl = RPT.waterLevel;
    return `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:20px">
      ${[
        { label:'Sông Hồng (tại Hà Nội)', val:`${wl.sHong[wl.sHong.length-1]}m`, bd:`BĐ1: ${wl.bd1}m / BĐ2: ${wl.bd2}m`, color:'var(--cyan)' },
        { label:'Sông Đuống', val:`${wl.sDuong[wl.sDuong.length-1]}m`, bd:'BĐ1: 5.5m / BĐ2: 6.0m', color:'var(--yellow)' },
        { label:'Sông Đáy', val:`${wl.sDay[wl.sDay.length-1]}m`, bd:'BĐ1: 4.5m / BĐ2: 5.0m', color:'var(--green)' },
      ].map(k=>`<div class="card kpi-card"><div class="kpi-label">${k.label}</div><div class="kpi-value" style="color:${k.color}">${k.val}</div><div class="kpi-sub">${k.bd}</div></div>`).join('')}
    </div>

    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><span class="card-title">Diễn biến mực nước các sông chính — Tháng 3/2026</span></div>
      <div style="padding:16px"><canvas id="rptWaterLevelChart" height="200"></canvas></div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="card">
        <div class="card-header"><span class="card-title">Phân tích mực nước theo giờ (hôm nay)</span></div>
        <div style="padding:16px"><canvas id="rptWaterHourlyChart" height="180"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Vùng có nguy cơ ngập theo cấp lũ</span></div>
        <div style="padding:16px">
          ${[
            { level:'Lũ BĐ1 (10.5m)', areas:'65 xã/phường', hectares:'12,500ha', risk:'badge-yellow' },
            { level:'Lũ BĐ2 (11.0m)', areas:'120 xã/phường', hectares:'28,800ha', risk:'badge-orange' },
            { level:'Lũ BĐ3 (11.5m)', areas:'195 xã/phường', hectares:'48,200ha', risk:'badge-red' },
          ].map(r=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border)">
            <div><div style="font-size:13px;font-weight:600">${r.level}</div><div style="font-size:11px;color:var(--muted)">${r.areas} bị ảnh hưởng</div></div>
            <div style="text-align:right"><div style="font-size:14px;font-weight:700;color:var(--yellow)">${r.hectares}</div><span class="badge ${r.risk}" style="font-size:10px">Diện tích ngập</span></div>
          </div>`).join('')}
        </div>
      </div>
    </div>`;
  }

  if (reportTab === 'pump') {
    const p = RPT.pump;
    return `
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px">
      ${[
        { label:'Trạm bơm hoạt động', val:'5/5', color:'var(--green)', sub:'Tất cả đang vận hành' },
        { label:'Tổng giờ bơm', val:`${p.opHours.reduce((a,b)=>a+b,0)}h`, color:'var(--cyan)', sub:'Trong 24h' },
        { label:'Điện tiêu thụ', val:`${p.energy.reduce((a,b)=>a+b,0).toFixed(1)} MWh`, color:'var(--yellow)', sub:'Chi phí ước tính' },
        { label:'Hiệu suất TB', val:`${Math.round(p.efficiency.reduce((a,b)=>a+b,0)/p.efficiency.length)}%`, color:'var(--purple)', sub:'Công suất thực/thiết kế' },
      ].map(k=>`<div class="card kpi-card"><div class="kpi-label">${k.label}</div><div class="kpi-value" style="color:${k.color}">${k.val}</div><div class="kpi-sub">${k.sub}</div></div>`).join('')}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:16px">
      <div class="card">
        <div class="card-header"><span class="card-title">Giờ vận hành theo trạm</span></div>
        <div style="padding:16px"><canvas id="rptPumpHoursChart" height="200"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Tiêu thụ điện (MWh)</span></div>
        <div style="padding:16px"><canvas id="rptEnergyChart" height="200"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Hiệu suất vận hành (%)</span></div>
        <div style="padding:16px"><canvas id="rptEfficiencyChart" height="200"></canvas></div>
      </div>
    </div>

    <div class="card" style="padding:0">
      <div class="card-header"><span class="card-title">Báo cáo chi tiết trạm bơm</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Trạm</th><th>Công suất TK</th><th>Giờ vận hành</th><th>Sản lượng bơm</th><th>Điện tiêu thụ</th><th>Hiệu suất</th><th>Trạng thái</th></tr></thead>
          <tbody>
            ${p.stations.map((s,i)=>`<tr>
              <td style="font-weight:600">${s}</td>
              <td class="mono">${p.capacity[i]} m³/s</td>
              <td class="mono" style="color:var(--cyan)">${p.opHours[i]}h</td>
              <td class="mono">${(p.capacity[i]*p.opHours[i]*3600/10000).toFixed(1)}M m³</td>
              <td class="mono" style="color:var(--yellow)">${p.energy[i].toFixed(1)} MWh</td>
              <td>
                <div style="display:flex;align-items:center;gap:8px">
                  <div class="progress-bar" style="flex:1;max-width:80px"><div class="progress-fill" style="width:${p.efficiency[i]}%;background:${p.efficiency[i]>85?'var(--green)':p.efficiency[i]>70?'var(--yellow)':'var(--red)'}"></div></div>
                  <span style="font-size:12px;font-weight:700">${p.efficiency[i]}%</span>
                </div>
              </td>
              <td>${statusBadge(p.efficiency[i]<80?'warning':'ok')}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  if (reportTab === 'budget') {
    const b = RPT.budget;
    const totalCollected = b.collected.reduce((a,c)=>a+c,0);
    const pct = Math.round(totalCollected / b.planned.reduce((a,c)=>a+c,0) * 100);
    return `
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px">
      ${[
        { label:'Kế hoạch thu', val:`${b.total} tỷ`, color:'var(--cyan)', sub:'Năm 2026' },
        { label:'Đã thu', val:`${b.collected_total} tỷ`, color:'var(--green)', sub:`Đạt ${pct}% kế hoạch` },
        { label:'Còn thiếu', val:`${b.total - b.collected_total} tỷ`, color:'var(--red)', sub:`${100-pct}% cần hoàn thành` },
        { label:'Số đơn vị đạt KH', val:`${b.collected.filter((c,i)=>c>=b.planned[i]).length}/${b.districts.length}`, color:'var(--yellow)', sub:'Quận/huyện' },
      ].map(k=>`<div class="card kpi-card"><div class="kpi-label">${k.label}</div><div class="kpi-value" style="color:${k.color}">${k.val}</div><div class="kpi-sub">${k.sub}</div></div>`).join('')}
    </div>

    <div style="display:grid;grid-template-columns:3fr 2fr;gap:16px;margin-bottom:16px">
      <div class="card">
        <div class="card-header"><span class="card-title">Kế hoạch vs Thực thu theo quận/huyện</span></div>
        <div style="padding:16px"><canvas id="rptBudgetGroupChart" height="240"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Phân bổ ngân sách theo hạng mục</span></div>
        <div style="padding:16px"><canvas id="rptBudgetPieChart" height="240"></canvas></div>
      </div>
    </div>

    <div class="card" style="padding:0">
      <div class="card-header">
        <span class="card-title">Chi tiết thu quỹ PCTT theo đơn vị</span>
        <button class="btn btn-ghost btn-sm" onclick="exportReportExcel()">Xuất Excel</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Quận/Huyện</th><th>Kế hoạch (tỷ)</th><th>Đã thu (tỷ)</th><th>Năm 2024 (tỷ)</th><th>So năm trước</th><th>Tiến độ</th></tr></thead>
          <tbody>
            ${b.districts.map((d,i)=>{
              const pct2 = Math.round(b.collected[i]/b.planned[i]*100);
              const diff = b.collected[i] - b.year2024[i];
              return `<tr>
                <td style="font-weight:600">${d}</td>
                <td class="mono">${b.planned[i]}</td>
                <td class="mono" style="font-weight:700;color:${pct2>=100?'var(--green)':pct2<60?'var(--red)':'var(--yellow)'}">${b.collected[i]}</td>
                <td class="mono" style="color:var(--muted)">${b.year2024[i]}</td>
                <td style="font-size:12px;color:${diff>=0?'var(--green)':'var(--red)'}">${diff>=0?'+':''}${diff.toFixed(1)} tỷ (${diff>=0?'+':''}${Math.round(diff/b.year2024[i]*100)}%)</td>
                <td style="min-width:140px">
                  <div style="display:flex;align-items:center;gap:8px">
                    <div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${Math.min(pct2,100)}%;background:${pct2>=100?'var(--green)':pct2<60?'var(--red)':'var(--yellow)'}"></div></div>
                    <span style="font-size:12px;font-weight:700;width:32px;text-align:right">${pct2}%</span>
                  </div>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  if (reportTab === 'irrigation') {
    const irr = RPT.irrigation;
    const selType = window._irrReportType || irr.reportTypes[0];
    const selLevel = window._irrReportLevel || irr.levels[0];
    const summaryData = irr.summary[selLevel]?.[selType] || {};
    const rows = (irr.tableRowsByLevel?.[selLevel]?.[selType]) || irr.tableRows[selType] || [];

    // Build table HTML per report type × level
    let thead = '', tbody = '';
    const isTP = selLevel === 'Thành phố';
    const isCty = selLevel === 'Công ty Thủy lợi';
    const isXH = selLevel === 'Xã / Huyện';

    if (selType === 'Hiện trạng CTTL') {
      if (isTP) {
        thead = '<tr><th>Đơn vị/Khu vực</th><th>Kênh tưới</th><th>Kênh tiêu</th><th>Hồ chứa</th><th>Trạm bơm</th><th>Cống ĐK</th><th>Tổng CTTL</th><th>Tốt (%)</th><th>Xuống cấp (%)</th><th>Hư hỏng (%)</th></tr>';
        tbody = rows.map(r => `<tr>
          <td style="font-weight:600;color:var(--cyan)">${r.don_vi}</td>
          <td class="mono">${r.kenh_tuoi}</td><td class="mono">${r.kenh_tieu}</td>
          <td class="mono">${r.ho_chua}</td><td class="mono">${r.tram_bom}</td><td class="mono">${r.cong_dk}</td>
          <td class="mono" style="font-weight:700;color:var(--cyan)">${r.tong}</td>
          <td><span class="badge badge-green">${r.tot_pct}%</span></td>
          <td><span class="badge badge-yellow">${r.xuong_cap_pct}%</span></td>
          <td><span class="badge badge-red">${r.hu_hong_pct}%</span></td>
        </tr>`).join('');
      } else if (isCty) {
        thead = '<tr><th>Mã CT</th><th>Tên công trình</th><th>Loại</th><th>Công ty TL</th><th>Dài (km)</th><th>Năm XD</th><th>Hiện trạng</th><th>Hướng xử lý</th><th>KĐ tiếp</th><th></th></tr>';
        tbody = rows.map(r => {
          const sc = r.hien_trang === 'Tốt' ? 'badge-green' : r.hien_trang === 'Xuống cấp' ? 'badge-yellow' : 'badge-red';
          return `<tr><td class="mono text-cyan">${r.id}</td><td style="font-weight:600">${r.ten}</td><td style="font-size:12px">${r.loai}</td><td style="font-size:12px">${r.cty}</td><td class="mono">${r.dai_km||'—'}</td><td style="font-size:12px">${r.nam_xd}</td><td><span class="badge ${sc}">${r.hien_trang}</span></td><td style="font-size:12px;color:var(--muted)">${r.xu_ly||'—'}</td><td style="font-size:12px">${r.kd_tiep}</td><td><button class="btn btn-ghost btn-sm" style="font-size:11px;padding:3px 8px;white-space:nowrap" onclick='showIrrDetailReport("hien_trang",${JSON.stringify(r).replace(/'/g,"&#39;")})'><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Chi tiết</button></td></tr>`;
        }).join('');
      } else {
        thead = '<tr><th>Mã</th><th>Tên công trình</th><th>Xã</th><th>Huyện</th><th>Loại</th><th>Chiều dài</th><th>Đơn vị QL</th><th>Trạng thái</th><th>Ghi chú</th><th></th></tr>';
        tbody = rows.map(r => {
          const sc = r.trang_thai === 'Tốt' ? 'badge-green' : r.trang_thai === 'Xuống cấp' ? 'badge-yellow' : 'badge-red';
          return `<tr><td class="mono text-cyan">${r.id}</td><td style="font-weight:600">${r.ten_ct}</td><td style="font-size:12px">${r.xa}</td><td style="font-size:12px">${r.huyen}</td><td style="font-size:12px">${r.loai}</td><td class="mono">${r.chieu_dai}</td><td style="font-size:12px">${r.don_vi_ql}</td><td><span class="badge ${sc}">${r.trang_thai}</span></td><td style="font-size:12px;color:var(--muted)">${r.ghi_chu||'—'}</td><td><button class="btn btn-ghost btn-sm" style="font-size:11px;padding:3px 8px;white-space:nowrap" onclick='showIrrDetailReport("hien_trang",${JSON.stringify(r).replace(/'/g,"&#39;")})'><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Chi tiết</button></td></tr>`;
        }).join('');
      }
    } else if (selType === 'Cấp phép Thủy lợi') {
      if (isTP) {
        thead = '<tr><th>Loại hoạt động</th><th>HS nhận</th><th>Đã cấp</th><th>Đang XL</th><th>Từ chối</th><th>Tỷ lệ cấp</th><th>Ghi chú</th></tr>';
        tbody = rows.map(r => {
          const rate = parseFloat(r.ty_le_cap) || 0;
          const rc = rate >= 75 ? 'badge-green' : rate >= 50 ? 'badge-yellow' : 'badge-red';
          return `<tr><td style="font-weight:600">${r.loai_hoat_dong}</td><td class="mono">${r.so_hs_nhan}</td><td class="mono" style="color:var(--green)">${r.da_cap}</td><td class="mono" style="color:var(--yellow)">${r.dang_xlý}</td><td class="mono" style="color:var(--red)">${r.tu_choi}</td><td><span class="badge ${rc}">${r.ty_le_cap}</span></td><td style="font-size:12px;color:var(--muted)">${r.ghi_chu||'—'}</td></tr>`;
        }).join('');
      } else if (isCty) {
        thead = '<tr><th>Mã HS</th><th>Chủ hồ sơ</th><th>Loại hoạt động</th><th>Phạm vi</th><th>Công ty XL</th><th>Ngày nộp</th><th>Ngày cấp</th><th>Hiệu lực</th><th>Trạng thái</th><th></th></tr>';
        tbody = rows.map(r => {
          const sc = r.trang_thai === 'Đã cấp' ? 'badge-green' : r.trang_thai === 'Đang xử lý' ? 'badge-yellow' : 'badge-red';
          return `<tr><td class="mono text-cyan">${r.id}</td><td style="font-weight:600">${r.chu_hs}</td><td style="font-size:12px">${r.loai}</td><td style="font-size:12px">${r.pham_vi}</td><td style="font-size:12px">${r.cty_xl}</td><td style="font-size:12px">${r.ngay_nop}</td><td style="font-size:12px">${r.ngay_cap}</td><td style="font-size:12px">${r.hieu_luc}</td><td><span class="badge ${sc}">${r.trang_thai}</span></td><td><button class="btn btn-ghost btn-sm" style="font-size:11px;padding:3px 8px;white-space:nowrap" onclick='showIrrDetailReport("cap_phep",${JSON.stringify(r).replace(/'/g,"&#39;")})'><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Chi tiết</button></td></tr>`;
        }).join('');
      } else {
        thead = '<tr><th>Mã</th><th>Xã/Huyện</th><th>Chủ hồ sơ</th><th>Loại</th><th>CT liên quan</th><th>Ngày nộp</th><th>KQ xã</th><th>Ghi chú</th><th>TT</th><th></th></tr>';
        tbody = rows.map(r => {
          const sc = r.trang_thai === 'Đã chuyển' ? 'badge-green' : r.trang_thai === 'Đang xử lý' ? 'badge-yellow' : 'badge-red';
          return `<tr><td class="mono text-cyan">${r.id}</td><td style="font-size:12px">${r.xa_huyen}</td><td style="font-weight:600">${r.chu_hs}</td><td style="font-size:12px">${r.loai}</td><td style="font-size:12px">${r.ct_lq}</td><td style="font-size:12px">${r.ngay_nop}</td><td style="font-size:12px">${r.ket_qua_xa}</td><td style="font-size:12px;color:var(--muted)">${r.ghi_chu||'—'}</td><td><span class="badge ${sc}">${r.trang_thai}</span></td><td><button class="btn btn-ghost btn-sm" style="font-size:11px;padding:3px 8px;white-space:nowrap" onclick='showIrrDetailReport("cap_phep",${JSON.stringify(r).replace(/'/g,"&#39;")})'><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Chi tiết</button></td></tr>`;
        }).join('');
      }
    } else if (selType === 'Vi phạm Thủy lợi') {
      if (isTP) {
        thead = '<tr><th>Loại vi phạm</th><th>Mức độ</th><th>Số vụ</th><th>Đã XL</th><th>Chưa XL</th><th>Tổng phạt</th><th>Xu hướng</th></tr>';
        tbody = rows.map(r => {
          const chua = r.chua_xlý || 0;
          const rc = chua === 0 ? 'badge-green' : chua <= 5 ? 'badge-yellow' : 'badge-red';
          return `<tr><td style="font-weight:600">${r.loai_vp}</td><td><span class="badge badge-gray">Mức ${r.quy}</span></td><td class="mono" style="font-weight:700">${r.so_vu}</td><td class="mono" style="color:var(--green)">${r.da_xlý}</td><td><span class="badge ${rc}">${chua}</span></td><td class="mono" style="color:var(--red)">${r.tong_phat}</td><td style="font-size:12px;color:var(--muted)">${r.xu_huong}</td></tr>`;
        }).join('');
      } else if (isCty) {
        thead = '<tr><th>Mã VP</th><th>Đối tượng VP</th><th>Loại vi phạm</th><th>Vị trí</th><th>Cty TL</th><th>Ngày PH</th><th>Biên bản</th><th>Mức phạt</th><th>Trạng thái</th><th></th></tr>';
        tbody = rows.map(r => {
          const sc = r.trang_thai === 'Đã xử phạt' ? 'badge-green' : r.trang_thai === 'Đang khắc phục' ? 'badge-yellow' : 'badge-red';
          return `<tr><td class="mono text-cyan">${r.id}</td><td style="font-weight:600">${r.doi_tuong}</td><td style="font-size:12px">${r.loai_vp}</td><td style="font-size:12px">${r.vi_tri}</td><td style="font-size:12px">${r.cty}</td><td style="font-size:12px">${r.ngay_ph}</td><td style="font-size:12px">${r.bien_ban}</td><td class="mono" style="color:var(--red)">${r.muc_phat}</td><td><span class="badge ${sc}">${r.trang_thai}</span></td><td><button class="btn btn-ghost btn-sm" style="font-size:11px;padding:3px 8px;white-space:nowrap" onclick='showIrrDetailReport("vi_pham",${JSON.stringify(r).replace(/'/g,"&#39;")})'><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Chi tiết</button></td></tr>`;
        }).join('');
      } else {
        thead = '<tr><th>Mã</th><th>Xã/Huyện</th><th>Đối tượng</th><th>Loại vi phạm</th><th>Ngày PH</th><th>Cơ quan XL</th><th>Kết quả</th><th>Trạng thái</th><th></th></tr>';
        tbody = rows.map(r => {
          const sc = r.trang_thai === 'Đã xử lý' ? 'badge-green' : r.trang_thai === 'Đang xử lý' || r.trang_thai === 'Đang thực hiện' ? 'badge-yellow' : 'badge-red';
          return `<tr><td class="mono text-cyan">${r.id}</td><td style="font-size:12px">${r.xa_huyen}</td><td style="font-weight:600">${r.doi_tuong}</td><td style="font-size:12px">${r.loai_vp}</td><td style="font-size:12px">${r.ngay_ph}</td><td style="font-size:12px">${r.co_quan_xlý}</td><td style="font-size:12px">${r.ket_qua}</td><td><span class="badge ${sc}">${r.trang_thai}</span></td><td><button class="btn btn-ghost btn-sm" style="font-size:11px;padding:3px 8px;white-space:nowrap" onclick='showIrrDetailReport("vi_pham",${JSON.stringify(r).replace(/'/g,"&#39;")})'><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Chi tiết</button></td></tr>`;
        }).join('');
      }
    } else if (selType === 'Kiểm định An toàn') {
      if (isTP) {
        thead = '<tr><th>Mã</th><th>Công trình</th><th>Loại</th><th>Cty TL</th><th>Dung tích</th><th>KĐ gần nhất</th><th>Kết quả</th><th>KĐ tiếp</th><th>Tình trạng</th></tr>';
        tbody = rows.map(r => {
          const sc = r.status === 'ok' ? 'badge-green' : r.status === 'warning' ? 'badge-yellow' : 'badge-red';
          const sl = r.status === 'ok' ? 'An toàn' : r.status === 'warning' ? 'Cần theo dõi' : 'Quá hạn';
          return `<tr><td class="mono text-cyan">${r.id}</td><td style="font-weight:600">${r.ten_ct}</td><td style="font-size:12px">${r.loai}</td><td style="font-size:12px">${r.cty}</td><td class="mono">${r.dung_tich}</td><td style="font-size:12px">${r.kd_gan_nhat}</td><td style="font-size:12px">${r.ket_qua}</td><td style="font-size:12px;color:${r.status==='overdue'?'var(--red)':'inherit'}">${r.kd_tiep}</td><td><span class="badge ${sc}">${sl}</span></td></tr>`;
        }).join('');
      } else if (isCty) {
        thead = '<tr><th>Mã</th><th>Công trình</th><th>Loại</th><th>Cty TL</th><th>Năm XD</th><th>Dung tích</th><th>KĐ lần 1</th><th>KĐ gần nhất</th><th>Kết quả</th><th>KĐ tiếp</th><th>TT</th><th></th></tr>';
        tbody = rows.map(r => {
          const sc = r.status === 'ok' ? 'badge-green' : r.status === 'warning' ? 'badge-yellow' : 'badge-red';
          const sl = r.status === 'ok' ? 'An toàn' : r.status === 'warning' ? 'Cần theo dõi' : 'Quá hạn';
          return `<tr><td class="mono text-cyan">${r.id}</td><td style="font-weight:600">${r.ten_ct}</td><td style="font-size:12px">${r.loai}</td><td style="font-size:12px">${r.cty}</td><td class="mono">${r.nam_xd}</td><td class="mono">${r.dung_tich}</td><td style="font-size:12px">${r.kd_lan_1}</td><td style="font-size:12px">${r.kd_gan_nhat}</td><td style="font-size:12px">${r.ket_qua}</td><td style="font-size:12px;color:${r.status==='overdue'?'var(--red)':'inherit'}">${r.kd_tiep}</td><td><span class="badge ${sc}">${sl}</span></td><td><button class="btn btn-ghost btn-sm" style="font-size:11px;padding:3px 8px;white-space:nowrap" onclick='showIrrDetailReport("kiem_dinh",${JSON.stringify(r).replace(/'/g,"&#39;")})'><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Chi tiết</button></td></tr>`;
        }).join('');
      } else {
        thead = '<tr><th>Mã</th><th>Công trình</th><th>Xã</th><th>Huyện</th><th>Loại</th><th>Năm XD</th><th>KĐ gần nhất</th><th>Kết quả</th><th>KĐ tiếp</th><th>TT</th><th></th></tr>';
        tbody = rows.map(r => {
          const sc = r.status === 'ok' ? 'badge-green' : r.status === 'warning' ? 'badge-yellow' : 'badge-red';
          const sl = r.status === 'ok' ? 'An toàn' : r.status === 'warning' ? 'Cần theo dõi' : 'Quá hạn';
          return `<tr><td class="mono text-cyan">${r.id}</td><td style="font-weight:600">${r.ten_ct}</td><td style="font-size:12px">${r.xa}</td><td style="font-size:12px">${r.huyen}</td><td style="font-size:12px">${r.loai}</td><td class="mono">${r.nam_xd}</td><td style="font-size:12px">${r.kd_gan_nhat}</td><td style="font-size:12px">${r.ket_qua}</td><td style="font-size:12px;color:${r.status==='overdue'?'var(--red)':'inherit'}">${r.kd_tiep}</td><td><span class="badge ${sc}">${sl}</span></td><td><button class="btn btn-ghost btn-sm" style="font-size:11px;padding:3px 8px;white-space:nowrap" onclick='showIrrDetailReport("kiem_dinh",${JSON.stringify(r).replace(/'/g,"&#39;")})'><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Chi tiết</button></td></tr>`;
        }).join('');
      }
    } else if (selType === 'Đầu tư & Nâng cấp') {
      if (isTP) {
        thead = '<tr><th>Mã DA</th><th>Tên dự án</th><th>Loại CT</th><th>Cấp</th><th>Kinh phí</th><th>Chủ đầu tư</th><th>Tiến độ</th><th>Trạng thái</th></tr>';
        tbody = rows.map(r => {
          const pct = r.tien_do;
          const bc = pct >= 100 ? 'var(--green)' : pct >= 50 ? 'var(--cyan)' : pct >= 20 ? 'var(--yellow)' : 'var(--muted)';
          const sc = pct >= 100 ? 'badge-green' : pct >= 50 ? 'badge-yellow' : pct > 0 ? 'badge-gray' : 'badge-gray';
          const sl = r.trang_thai;
          return `<tr><td class="mono text-cyan">${r.id}</td><td style="font-weight:600">${r.ten}</td><td style="font-size:12px">${r.loai}</td><td><span class="badge badge-gray" style="font-size:10px">${r.cap}</span></td><td class="mono" style="color:var(--cyan)">${r.kp}</td><td style="font-size:12px">${r.chu_dau_tu}</td><td style="min-width:120px"><div style="display:flex;align-items:center;gap:8px"><div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${pct}%;background:${bc}"></div></div><span style="font-size:12px;font-weight:700">${pct}%</span></div></td><td><span class="badge ${sc}">${sl}</span></td></tr>`;
        }).join('');
      } else if (isCty) {
        thead = '<tr><th>Mã DA</th><th>Tên dự án</th><th>Loại CT</th><th>Công ty TL</th><th>Kinh phí</th><th>Nguồn vốn</th><th>Tiến độ</th><th>Trạng thái</th><th></th></tr>';
        tbody = rows.map(r => {
          const pct = r.tien_do;
          const bc = pct >= 100 ? 'var(--green)' : pct >= 50 ? 'var(--cyan)' : pct >= 20 ? 'var(--yellow)' : 'var(--muted)';
          const sc = r.trang_thai === 'Hoàn thành' ? 'badge-green' : r.trang_thai === 'Đang thi công' || r.trang_thai === 'Sắp hoàn thành' ? 'badge-yellow' : 'badge-gray';
          return `<tr><td class="mono text-cyan">${r.id}</td><td style="font-weight:600">${r.ten}</td><td style="font-size:12px">${r.loai}</td><td style="font-size:12px">${r.cty}</td><td class="mono" style="color:var(--cyan)">${r.kp}</td><td style="font-size:12px">${r.nguon}</td><td style="min-width:120px"><div style="display:flex;align-items:center;gap:8px"><div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${pct}%;background:${bc}"></div></div><span style="font-size:12px;font-weight:700">${pct}%</span></div></td><td><span class="badge ${sc}">${r.trang_thai}</span></td><td><button class="btn btn-ghost btn-sm" style="font-size:11px;padding:3px 8px;white-space:nowrap" onclick='showIrrDetailReport("dau_tu",${JSON.stringify(r).replace(/'/g,"&#39;")})'><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Chi tiết</button></td></tr>`;
        }).join('');
      } else {
        thead = '<tr><th>Mã DA</th><th>Tên dự án</th><th>Xã</th><th>Huyện</th><th>Loại CT</th><th>Kinh phí</th><th>Nguồn vốn</th><th>Tiến độ</th><th>Trạng thái</th><th></th></tr>';
        tbody = rows.map(r => {
          const pct = r.tien_do;
          const bc = pct >= 100 ? 'var(--green)' : pct >= 50 ? 'var(--cyan)' : pct >= 20 ? 'var(--yellow)' : 'var(--muted)';
          const sc = r.trang_thai === 'Hoàn thành' ? 'badge-green' : r.trang_thai === 'Đang thi công' || r.trang_thai === 'Đang thực hiện' ? 'badge-yellow' : 'badge-gray';
          return `<tr><td class="mono text-cyan">${r.id}</td><td style="font-weight:600">${r.ten}</td><td style="font-size:12px">${r.xa}</td><td style="font-size:12px">${r.huyen}</td><td style="font-size:12px">${r.loai}</td><td class="mono" style="color:var(--cyan)">${r.kp}</td><td style="font-size:12px">${r.nguon}</td><td style="min-width:110px"><div style="display:flex;align-items:center;gap:6px"><div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${pct}%;background:${bc}"></div></div><span style="font-size:12px;font-weight:700">${pct}%</span></div></td><td><span class="badge ${sc}">${r.trang_thai}</span></td><td><button class="btn btn-ghost btn-sm" style="font-size:11px;padding:3px 8px;white-space:nowrap" onclick='showIrrDetailReport("dau_tu",${JSON.stringify(r).replace(/'/g,"&#39;")})'><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Chi tiết</button></td></tr>`;
        }).join('');
      }
    }

    return `
    <!-- Filters -->
    <div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap">
      <div>
        <label style="font-size:11px;font-weight:600;color:var(--muted);display:block;margin-bottom:4px">LOẠI BÁO CÁO</label>
        <select class="form-control" style="min-width:200px" onchange="window._irrReportType=this.value;switchReportTab('irrigation')">
          ${irr.reportTypes.map(t => `<option value="${t}" ${t===selType?'selected':''}>${t}</option>`).join('')}
        </select>
      </div>
      <div>
        <label style="font-size:11px;font-weight:600;color:var(--muted);display:block;margin-bottom:4px">CẤP BÁO CÁO</label>
        <select class="form-control" style="min-width:180px" onchange="window._irrReportLevel=this.value;switchReportTab('irrigation')">
          ${irr.levels.map(l => `<option value="${l}" ${l===selLevel?'selected':''}>${l}</option>`).join('')}
        </select>
      </div>
      <div style="flex:1"></div>
      <button class="btn btn-ghost btn-sm" onclick="exportReportPdf()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg> Xuất PDF</button>
      <button class="btn btn-primary btn-sm" onclick="exportReportExcel()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg> Xuất Excel</button>
    </div>

    <!-- KPI Cards -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px">
      ${(summaryData.kpi || []).map(k => `<div class="card kpi-card"><div class="kpi-label">${k.l}</div><div class="kpi-value" style="color:${k.c}">${k.v}</div><div class="kpi-sub">${selLevel} · ${selType}</div></div>`).join('')}
    </div>

    <!-- Data table -->
    <div class="card" style="padding:0">
      <div class="card-header">
        <span class="card-title">${selType} — ${selLevel}</span>
        <span style="font-size:11px;color:var(--muted)">${rows.length} bản ghi</span>
      </div>
      <div class="table-wrap">
        <table><thead>${thead}</thead><tbody>${tbody}</tbody></table>
      </div>
    </div>`;
  }

  return '';
}

function renderReportCharts() {
  if (typeof Chart === 'undefined') return;
  const d = RPT.disaster[reportPeriod] || RPT.disaster['Q1-2026'];
  const rf = RPT.rainfall[reportPeriod] || RPT.rainfall['Q1-2026'];
  const wl = RPT.waterLevel;
  const p = RPT.pump;
  const b = RPT.budget;

  const PALETTE = { cyan:'#00c8ff', green:'#00e676', yellow:'#ffca28', red:'#ff3c50', purple:'#9c27b0', orange:'#ff9800', muted:'rgba(255,255,255,0.2)' };
  const defaults = { color: 'rgba(255,255,255,0.7)', grid: 'rgba(255,255,255,0.06)', font: "'Inter', sans-serif" };

  const mkAxis = () => ({
    ticks: { color: defaults.color, font: { family: defaults.font, size: 11 } },
    grid: { color: defaults.grid },
  });

  function mkChart(id, config) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
      if (_rptCharts[id]) _rptCharts[id].destroy();
      _rptCharts[id] = new Chart(el.getContext('2d'), config);
    } catch(e) {}
  }

  // ── DISASTER TAB ──────────────────────────────────────────────────
  if (reportTab === 'disaster') {
    mkChart('rptDisasterChart', {
      type: 'bar',
      data: {
        labels: d.labels,
        datasets: [
          { type:'bar', label:'Sự cố', data: d.incidents, backgroundColor: PALETTE.red+'44', borderColor: PALETTE.red, borderWidth:1.5, borderRadius:4 },
          { type:'line', label:'Xu hướng', data: d.incidents, borderColor: PALETTE.cyan, borderWidth:2, pointRadius:3, pointBackgroundColor: PALETTE.cyan, tension:.35, fill:false, yAxisID:'y' },
        ],
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{labels:{color:defaults.color, font:{family:defaults.font,size:11}}} }, scales:{ x: mkAxis(), y: { ...mkAxis(), beginAtZero:true } } },
    });
    mkChart('rptTypeChart', {
      type: 'doughnut',
      data: {
        labels: ['Lũ lụt','Sạt lở','Bão/Áp thấp','Khác'],
        datasets: [{ data: Object.values(d.types), backgroundColor: [PALETTE.cyan, PALETTE.yellow, PALETTE.red, PALETTE.purple], borderWidth:0, hoverOffset:8 }],
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{position:'bottom',labels:{color:defaults.color, font:{family:defaults.font,size:11}, padding:12}}, tooltip:{callbacks:{label:ctx=>`${ctx.label}: ${ctx.parsed} sự cố`}} } },
    });
  }

  // ── RAINFALL TAB ─────────────────────────────────────────────────
  if (reportTab === 'rainfall') {
    mkChart('rptRainfallBarChart', {
      type: 'bar',
      data: {
        labels: RPT.rainfall.stations,
        datasets: [
          { label:'Lượng mưa (mm)', data: rf.values, backgroundColor: rf.values.map(v => v > rf.avg*1.5 ? PALETTE.red+'99' : v > rf.avg*1.2 ? PALETTE.yellow+'99' : PALETTE.cyan+'99'), borderColor: rf.values.map(v => v > rf.avg*1.5 ? PALETTE.red : v > rf.avg*1.2 ? PALETTE.yellow : PALETTE.cyan), borderWidth:1.5, borderRadius:5 },
          { type:'line', label:'Trung bình kỳ', data: rf.values.map(()=>rf.avg), borderColor: PALETTE.green, borderWidth:2, borderDash:[6,4], pointRadius:0, fill:false },
        ],
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{labels:{color:defaults.color,font:{family:defaults.font,size:11}}} }, scales:{ x: mkAxis(), y: { ...mkAxis(), beginAtZero:true } } },
    });
    mkChart('rptRainfallPieChart', {
      type: 'pie',
      data: {
        labels: ['< 20mm','20-50mm','50-100mm','> 100mm'],
        datasets: [{ data: [rf.values.filter(v=>v<20).length, rf.values.filter(v=>v>=20&&v<50).length, rf.values.filter(v=>v>=50&&v<100).length, rf.values.filter(v=>v>=100).length], backgroundColor:[PALETTE.green, PALETTE.cyan, PALETTE.yellow, PALETTE.red], borderWidth:0, hoverOffset:6 }],
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{position:'bottom',labels:{color:defaults.color,font:{family:defaults.font,size:11},padding:10}}, tooltip:{callbacks:{label:ctx=>`${ctx.label}: ${ctx.parsed} trạm`}} } },
    });
  }

  // ── WATER LEVEL TAB ──────────────────────────────────────────────
  if (reportTab === 'waterlevel') {
    mkChart('rptWaterLevelChart', {
      type: 'line',
      data: {
        labels: wl.labels,
        datasets: [
          { label:'Sông Hồng (m)', data: wl.sHong, borderColor: PALETTE.cyan, backgroundColor: PALETTE.cyan+'18', borderWidth:2.5, tension:.4, fill:true, pointRadius:4, pointBackgroundColor: PALETTE.cyan },
          { label:'Sông Đuống (m)', data: wl.sDuong, borderColor: PALETTE.yellow, borderWidth:2, tension:.4, fill:false, pointRadius:3, pointBackgroundColor: PALETTE.yellow },
          { label:'Sông Đáy (m)', data: wl.sDay, borderColor: PALETTE.green, borderWidth:2, tension:.4, fill:false, pointRadius:3, pointBackgroundColor: PALETTE.green },
          { label:`BĐ1 Sông Hồng (${wl.bd1}m)`, data: wl.labels.map(()=>wl.bd1), borderColor: PALETTE.yellow, borderWidth:1.5, borderDash:[6,4], pointRadius:0, fill:false },
          { label:`BĐ2 Sông Hồng (${wl.bd2}m)`, data: wl.labels.map(()=>wl.bd2), borderColor: PALETTE.red, borderWidth:1.5, borderDash:[6,4], pointRadius:0, fill:false },
        ],
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{labels:{color:defaults.color,font:{family:defaults.font,size:11}}, position:'bottom'} }, scales:{ x: mkAxis(), y: { ...mkAxis(), beginAtZero:false } } },
    });
    mkChart('rptWaterHourlyChart', {
      type: 'line',
      data: {
        labels: ['0h','2h','4h','6h','8h','10h','12h','14h','16h','18h','20h','22h'],
        datasets: [{ label:'Mực nước SH (m)', data:[9.8,9.9,10.0,10.1,10.2,10.15,10.05,9.95,9.85,9.8,9.75,9.7], borderColor:PALETTE.cyan, backgroundColor:PALETTE.cyan+'18', borderWidth:2, fill:true, tension:.5, pointRadius:2 }],
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{labels:{color:defaults.color,font:{family:defaults.font,size:11}}} }, scales:{ x: mkAxis(), y: { ...mkAxis(), beginAtZero:false } } },
    });
  }

  // ── PUMP TAB ─────────────────────────────────────────────────────
  if (reportTab === 'pump') {
    mkChart('rptPumpHoursChart', { type:'bar', data:{ labels:p.stations, datasets:[{ label:'Giờ vận hành (h)', data:p.opHours, backgroundColor:PALETTE.cyan+'88', borderColor:PALETTE.cyan, borderWidth:1.5, borderRadius:5 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{labels:{color:defaults.color,font:{family:defaults.font,size:11}}}}, scales:{ x:mkAxis(), y:{...mkAxis(),beginAtZero:true,max:24} } } });
    mkChart('rptEnergyChart', { type:'bar', data:{ labels:p.stations, datasets:[{ label:'Điện tiêu thụ (MWh)', data:p.energy, backgroundColor:PALETTE.yellow+'88', borderColor:PALETTE.yellow, borderWidth:1.5, borderRadius:5 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{labels:{color:defaults.color,font:{family:defaults.font,size:11}}}}, scales:{ x:mkAxis(), y:{...mkAxis(),beginAtZero:true} } } });
    mkChart('rptEfficiencyChart', { type:'radar', data:{ labels:p.stations, datasets:[{ label:'Hiệu suất (%)', data:p.efficiency, borderColor:PALETTE.green, backgroundColor:PALETTE.green+'22', borderWidth:2, pointBackgroundColor:PALETTE.green, pointRadius:4 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{labels:{color:defaults.color,font:{family:defaults.font,size:11}}}}, scales:{ r:{ angleLines:{color:defaults.grid}, grid:{color:defaults.grid}, ticks:{color:defaults.color,font:{family:defaults.font,size:10},backdropColor:'transparent'}, pointLabels:{color:defaults.color,font:{family:defaults.font,size:11}}, min:50, max:100 } } } });
  }

  // ── BUDGET TAB ────────────────────────────────────────────────────
  if (reportTab === 'budget') {
    mkChart('rptBudgetGroupChart', {
      type: 'bar',
      data: {
        labels: b.districts,
        datasets: [
          { label:'Kế hoạch (tỷ)', data:b.planned, backgroundColor:PALETTE.muted, borderColor:'rgba(255,255,255,.2)', borderWidth:1, borderRadius:3 },
          { label:'Thực thu (tỷ)', data:b.collected, backgroundColor: b.collected.map((c,i)=>c>=b.planned[i]?PALETTE.green+'bb':PALETTE.yellow+'bb'), borderColor: b.collected.map((c,i)=>c>=b.planned[i]?PALETTE.green:PALETTE.yellow), borderWidth:1.5, borderRadius:3 },
          { label:'Năm 2024 (tỷ)', data:b.year2024, backgroundColor:PALETTE.cyan+'44', borderColor:PALETTE.cyan, borderWidth:1, borderRadius:3 },
        ],
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{labels:{color:defaults.color,font:{family:defaults.font,size:11}}} }, scales:{ x: mkAxis(), y: { ...mkAxis(), beginAtZero:true } } },
    });
    mkChart('rptBudgetPieChart', {
      type: 'doughnut',
      data: {
        labels: ['Hạ tầng','Tập huấn','Trang thiết bị','Dự phòng khẩn cấp'],
        datasets: [{ data: Object.values(b.categories), backgroundColor:[PALETTE.cyan, PALETTE.green, PALETTE.yellow, PALETTE.red], borderWidth:0, hoverOffset:8 }],
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{position:'bottom',labels:{color:defaults.color,font:{family:defaults.font,size:11},padding:10}}, tooltip:{callbacks:{label:ctx=>`${ctx.label}: ${ctx.parsed} tỷ VNĐ`}} } },
    });
  }
}

// ── EXPORT FUNCTIONS ───────────────────────────────────────────────
window.exportReportPdf = function() {
  showToast('📄 Đang tạo file PDF báo cáo...');
  setTimeout(() => {
    try {
      const now = new Date();
      const dateStr = `${now.getDate().toString().padStart(2,'0')}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getFullYear()}`;
      const w = window.open('', '_blank', 'width=900,height=700');
      if (!w) { showToast('⚠ Trình duyệt đã chặn popup. Cho phép popup để xuất PDF.'); return; }
      const d = RPT.disaster[reportPeriod] || RPT.disaster['Q1-2026'];
      w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>BC PCTT ${reportPeriod}</title><style>
        body{font-family:Arial,sans-serif;padding:30px;color:#333;max-width:800px;margin:0 auto}
        h1{color:#1a237e;font-size:22px;margin-bottom:4px}
        .subtitle{color:#666;font-size:13px;margin-bottom:24px}
        h2{color:#0d47a1;font-size:16px;margin-top:24px}
        table{width:100%;border-collapse:collapse;margin-top:10px}
        th{background:#1a237e;color:#fff;padding:8px 10px;text-align:left;font-size:13px}
        td{padding:7px 10px;border-bottom:1px solid #e0e0e0;font-size:13px}
        tr:nth-child(even){background:#f5f5f5}
        .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
        .kpi{background:#e3f2fd;border-radius:8px;padding:12px;text-align:center}
        .kpi-val{font-size:20px;font-weight:700;color:#1a237e}
        .kpi-lbl{font-size:11px;color:#666;margin-top:4px}
        @media print{body{padding:15px}}
      </style></head><body>
        <h1>BÁO CÁO THỐNG KÊ PHÒNG CHỐNG THIÊN TAI</h1>
        <div class="subtitle">Chi cục Thủy lợi & PCTT Hà Nội — Kỳ báo cáo: ${reportPeriod} — Ngày xuất: ${dateStr}</div>
        <h2>I. THIÊN TAI & THIỆT HẠI</h2>
        <div class="kpi-grid">
          <div class="kpi"><div class="kpi-val">${d.total}</div><div class="kpi-lbl">Tổng sự cố</div></div>
          <div class="kpi"><div class="kpi-val" style="color:#2e7d32">${d.resolved}</div><div class="kpi-lbl">Đã xử lý</div></div>
          <div class="kpi"><div class="kpi-val" style="color:#c62828">${d.dmg} tỷ</div><div class="kpi-lbl">Thiệt hại</div></div>
          <div class="kpi"><div class="kpi-val">${Math.round(d.resolved/d.total*100)}%</div><div class="kpi-lbl">Tỷ lệ xử lý</div></div>
        </div>
        <h2>II. THỦY VĂN</h2>
        <table><thead><tr><th>Trạm đo</th><th>Lượng mưa (mm)</th></tr></thead><tbody>
          ${RPT.rainfall.stations.map((s,i)=>`<tr><td>${s}</td><td>${(RPT.rainfall[reportPeriod]||RPT.rainfall['Q1-2026']).values[i]}</td></tr>`).join('')}
        </tbody></table>
        <h2>III. QUỸ PCTT</h2>
        <table><thead><tr><th>Quận/Huyện</th><th>Kế hoạch (tỷ)</th><th>Đã thu (tỷ)</th><th>Tỷ lệ</th></tr></thead><tbody>
          ${RPT.budget.districts.map((d2,i)=>`<tr><td>${d2}</td><td>${RPT.budget.planned[i]}</td><td>${RPT.budget.collected[i]}</td><td>${Math.round(RPT.budget.collected[i]/RPT.budget.planned[i]*100)}%</td></tr>`).join('')}
        </tbody></table>
        <br><div style="font-size:11px;color:#999;text-align:center;margin-top:24px">Tài liệu được tạo tự động bởi Hệ thống HADIWA IOC — ${dateStr}</div>
        <script>setTimeout(()=>window.print(),400);</script>
      </body></html>`);
      w.document.close();
      showToast('✅ Đã mở cửa sổ in PDF!');
    } catch(e) { showToast('⚠ Xuất PDF thất bại: ' + e.message); }
  }, 800);
};

window.exportReportExcel = function() {
  showToast('📊 Đang tạo file Excel...');
  setTimeout(() => {
    try {
      const d = RPT.disaster[reportPeriod] || RPT.disaster['Q1-2026'];
      const rf = RPT.rainfall[reportPeriod] || RPT.rainfall['Q1-2026'];
      const b = RPT.budget;
      const rows = [
        ['BÁO CÁO THỐNG KÊ PHÒNG CHỐNG THIÊN TAI'],
        [`Kỳ báo cáo: ${reportPeriod}`],
        [],
        ['I. THIÊN TAI'],
        ['Chỉ tiêu','Giá trị'],
        ['Tổng sự cố', d.total],
        ['Đã xử lý', d.resolved],
        ['Thiệt hại ước tính (tỷ VNĐ)', d.dmg],
        [],
        ['II. LƯỢNG MƯA'],
        ['Trạm', 'Lượng mưa (mm)'],
        ...RPT.rainfall.stations.map((s,i)=>[s, rf.values[i]]),
        [],
        ['III. QUỸ PCTT'],
        ['Quận/Huyện', 'Kế hoạch (tỷ)', 'Đã thu (tỷ)', 'Tỷ lệ (%)'],
        ...b.districts.map((district,i)=>[district, b.planned[i], b.collected[i], Math.round(b.collected[i]/b.planned[i]*100)+'%']),
      ];
      const csv = rows.map(r => r.join(',')).join('\n');
      const bom = '\uFEFF';
      const blob = new Blob([bom + csv], { type:'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `BC_PCTT_${reportPeriod.replace('/','-')}.csv`;
      a.click(); URL.revokeObjectURL(url);
      showToast('✅ Đã tải xuống file Excel (CSV)!');
    } catch(e) { showToast('⚠ Xuất Excel thất bại!'); }
  }, 600);
};


// ── BÁO CÁO CHI TIẾT 01 HỒ SƠ ─────────────────────────────────────────────