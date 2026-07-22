// ── HADIWA IOC — Quản lý Đê điều (v5.0) ───────────────────────────
// Tabs: Danh mục tuyến đê | Nhật ký tuần tra | Điểm xung yếu | Vi phạm hành lang
// Features: Pagination, View chi tiết tuần tra, Lập phiếu + View điểm xung yếu

// ── Page State ─────────────────────────────────────────────────────
let dikeState = { tab: 'registry' };
const DM_PAGE_SIZE = 8;
let dmPages = { registry: 1, patrol: 1, vulnerable: 1, violations: 1 };

// ── Helpers ────────────────────────────────────────────────────────
const DIKE_TYPE_LABEL = { cap1:'Đê cấp I', cap2:'Đê cấp II', local:'Đê địa phương' };
const DIKE_TYPE_COLOR = { cap1:'#ef4444', cap2:'#f59e0b', local:'#3b82f6' };
const DIKE_STATUS_COLOR = { ok:'#10b981', warning:'#f59e0b', danger:'#ef4444', critical:'#ef4444' };
const SEV_COLOR = { emergency:'#ef4444', critical:'#ef4444', warning:'#f59e0b', info:'#3b82f6' };
const SEV_LABEL = { emergency:'Khẩn cấp', critical:'Nghiêm trọng', warning:'Cảnh báo', info:'Thông tin' };
const VULN_STATUS_LABEL = { monitoring:'Đang theo dõi', fixing:'Đang xử lý', emergency_response:'Ứng phó khẩn cấp', pending_violation:'Chờ xử phạt', resolved:'Đã xử lý' };
const VULN_STATUS_COLOR = { monitoring:'#f59e0b', fixing:'#38bdf8', emergency_response:'#ef4444', pending_violation:'#a78bfa', resolved:'#10b981' };

function _sv(sev) {
  const c = SEV_COLOR[sev] || '#6b7280';
  return `<span style="padding:2px 9px;border-radius:20px;font-size:10px;font-weight:700;background:${c}22;color:${c};border:1px solid ${c}44">${SEV_LABEL[sev]||sev}</span>`;
}

// ── Mock Data: Danh mục tuyến đê ───────────────────────────────────
const DIKE_REGISTRY = [
  { id:'DK-001', name:'Đê hữu Hồng (Bắc Từ Liêm – Hoàn Kiếm)', river:'Sông Hồng', type:'cap1', length:22.3, elevation:'+13.5m', status:'ok', condition:'Tốt', district:'Bắc Từ Liêm → Hoàn Kiếm', lastInspect:'05/03/2026', issues:0 },
  { id:'DK-002', name:'Đê tả Hồng (Đông Anh)', river:'Sông Hồng', type:'cap1', length:18.7, elevation:'+13.2m', status:'warning', condition:'Cảnh báo', district:'H. Đông Anh', lastInspect:'10/03/2026', issues:3 },
  { id:'DK-003', name:'Đê hữu Đuống (Long Biên – Gia Lâm)', river:'Sông Đuống', type:'cap2', length:15.1, elevation:'+11.8m', status:'ok', condition:'Tốt', district:'Long Biên → Gia Lâm', lastInspect:'01/03/2026', issues:0 },
  { id:'DK-004', name:'Đê sông Đáy (Hà Đông – Mỹ Đức)', river:'Sông Đáy', type:'cap2', length:12.4, elevation:'+8.5m', status:'danger', condition:'Nguy hiểm', district:'Hà Đông → Mỹ Đức', lastInspect:'12/03/2026', issues:7 },
  { id:'DK-005', name:'Đê nội đồng Ứng Hòa', river:'Sông Đáy (chi lưu)', type:'local', length:8.6, elevation:'+5.2m', status:'ok', condition:'Tốt', district:'H. Ứng Hòa', lastInspect:'20/02/2026', issues:1 },
  { id:'DK-006', name:'Đê bao Chương Mỹ (Sông Bùi)', river:'Sông Bùi', type:'local', length:11.2, elevation:'+6.1m', status:'critical', condition:'Khẩn cấp', district:'H. Chương Mỹ', lastInspect:'13/03/2026', issues:12 },
  { id:'DK-007', name:'Đê tả Đáy (Phúc Thọ)', river:'Sông Đáy', type:'cap2', length:9.8, elevation:'+7.8m', status:'ok', condition:'Tốt', district:'H. Phúc Thọ', lastInspect:'08/03/2026', issues:0 },
  { id:'DK-008', name:'Đê hữu Hồng (Thạch Thất – Quốc Oai)', river:'Sông Hồng', type:'cap1', length:14.5, elevation:'+12.0m', status:'warning', condition:'Cảnh báo', district:'Thạch Thất → Quốc Oai', lastInspect:'11/03/2026', issues:2 },
  { id:'DK-009', name:'Đê sông Nhuệ (Hà Đông)', river:'Sông Nhuệ', type:'local', length:7.3, elevation:'+6.5m', status:'ok', condition:'Tốt', district:'Q. Hà Đông', lastInspect:'15/02/2026', issues:0 },
  { id:'DK-010', name:'Đê bối sông Hồng (Thường Tín)', river:'Sông Hồng', type:'local', length:6.9, elevation:'+4.8m', status:'warning', condition:'Cần theo dõi', district:'H. Thường Tín', lastInspect:'14/03/2026', issues:2 },
];

// ── Mock Data: Nhật ký tuần tra ─────────────────────────────────────
const DIKE_PATROLS = [
  { id:'PT-001', dikeId:'DK-001', officer:'Nguyễn Văn Dũng', post:'Điếm K+5.0', shift:'Ca sáng', date:'15/03/2026 06:00', weather:'Nắng, gió nhẹ', waterLevel:'8.45m', result:'Bình thường. Không phát hiện bất thường trên toàn đoạn tuần tra.', hasAlert:false, action:'Không cần xử lý', note:'Tuần tra theo quy trình định kỳ.' },
  { id:'PT-002', dikeId:'DK-002', officer:'Trần Thị Lan', post:'Điếm K+3.0', shift:'Ca sáng', date:'15/03/2026 07:30', weather:'Âm u, có mưa nhỏ', waterLevel:'9.20m', result:'Phát hiện vết nứt dọc mặt đê ~3m, sâu khoảng 5cm tại K+3+450. Đã báo cáo cấp trên, cắm biển cảnh báo.', hasAlert:true, action:'Báo cáo lên Chi cục, cắm biển, lập hồ sơ điểm xung yếu XV-001', note:'Vết nứt xuất hiện sau đợt mưa lớn 14/03.' },
  { id:'PT-003', dikeId:'DK-004', officer:'Lê Quang Minh', post:'Điếm K+8.0', shift:'Ca sáng', date:'15/03/2026 08:00', weather:'Có mưa vừa', waterLevel:'6.80m', result:'Phát hiện hiện tượng thẩm lậu chân đê phía đồng tại K+8+200. Đã liên hệ đội xử lý khẩn.', hasAlert:true, action:'Điều đội ứng cứu, đắp bao cát tạm thời, lập phiếu xung yếu XV-002', note:'Lưu lượng thẩm lậu ước ~0.5 lít/giây.' },
  { id:'PT-004', dikeId:'DK-006', officer:'Phạm Văn Tuấn', post:'Điếm K+12.0', shift:'Ca đêm', date:'15/03/2026 02:00', weather:'Mưa to, gió mạnh', waterLevel:'4.95m (vượt đỉnh 0.05m)', result:'Mực nước tràn qua mặt đê tại K+12+500. Kích hoạt phương án khẩn cấp, báo cáo lên UBND huyện.', hasAlert:true, action:'Kích hoạt PA khẩn cấp B, sơ tán 43 hộ dân, điều 2 máy bơm tiêu úng', note:'Tình huống nghiêm trọng nhất từ 2023 đến nay.' },
  { id:'PT-005', dikeId:'DK-003', officer:'Đinh Thị Hoa', post:'Điếm K+1.0', shift:'Ca chiều', date:'14/03/2026 14:00', weather:'Nắng nhẹ', waterLevel:'5.10m', result:'Bình thường. Mực nước sông 5.1m, cách BĐI 1.9m. Mái đê và thân đê không có bất thường.', hasAlert:false, action:'Không cần xử lý', note:'Ghi chép đầy đủ cho hồ sơ định kỳ.' },
  { id:'PT-006', dikeId:'DK-001', officer:'Hoàng Minh Khải', post:'Điếm K+12.5', shift:'Ca chiều', date:'14/03/2026 16:00', weather:'Nắng, nóng', waterLevel:'8.02m', result:'Phát hiện một đoạn mái đê phía sông có hiện tượng sụt lún nhẹ ~8cm tại K+18+100. Cắm mốc theo dõi.', hasAlert:true, action:'Cắm 3 mốc theo dõi, báo cáo cấp trên, kiểm định lại mốc sau 7 ngày', note:'Có thể do thấm sâu lâu dài.' },
  { id:'PT-007', dikeId:'DK-008', officer:'Vũ Thị Ngân', post:'Điếm K+7.0', shift:'Ca sáng', date:'14/03/2026 07:00', weather:'Mưa rào', waterLevel:'7.15m', result:'Bình thường. Kiểm tra đoạn K+6 đến K+9. Không phát hiện vấn đề gì đáng lo ngại.', hasAlert:false, action:'Không cần xử lý', note:'' },
  { id:'PT-008', dikeId:'DK-005', officer:'Nguyễn Thị Hằng', post:'Điếm K+2.0', shift:'Ca sáng', date:'13/03/2026 06:30', weather:'Âm u', waterLevel:'3.20m', result:'Phát hiện hộ dân Nguyễn Văn Bình đổ vật liệu xây dựng vào hành lang bảo vệ đê tại K+2+700.', hasAlert:true, action:'Lập biên bản vi phạm VF-001, yêu cầu dọn dẹp trong 3 ngày', note:'Đây là lần vi phạm lần 2 của hộ này.' },
  { id:'PT-009', dikeId:'DK-002', officer:'Trần Văn Lợi', post:'Điếm K+6.0', shift:'Ca tối', date:'13/03/2026 20:00', weather:'Có sương mù', waterLevel:'8.90m', result:'Bình thường. Kiểm tra đoạn K+5 đến K+8 theo quy trình. Ghi nhận đèn tín hiệu điếm K+6 bị hỏng, cần thay.', hasAlert:false, action:'Ghi yêu cầu sửa chữa đèn điếm K+6', note:'Sự cố nhỏ. Không ảnh hưởng an toàn đê.' },
  { id:'PT-010', dikeId:'DK-007', officer:'Đặng Quốc Hùng', post:'Điếm K+4.5', shift:'Ca sáng', date:'12/03/2026 06:00', weather:'Bầu trời quang', waterLevel:'4.60m', result:'Bình thường. Mực nước dưới báo động 1 là 1.40m. Mái đê cả hai phía bình thường.', hasAlert:false, action:'Không cần xử lý', note:'' },
  { id:'PT-011', dikeId:'DK-004', officer:'Ngô Thị Phượng', post:'Điếm K+11.0', shift:'Ca chiều', date:'12/03/2026 15:00', weather:'Mưa nhỏ', waterLevel:'6.45m', result:'Phát hiện vết nứt ngang mặt đê khoảng 1.5m tại K+11+200. Độ sâu chưa xác định. Đã cắm biển và báo cáo.', hasAlert:true, action:'Cắm biển cảnh báo, báo cáo lên Chi cục, chờ đội khảo sát', note:'Cần khảo sát sâu hơn.' },
  { id:'PT-012', dikeId:'DK-010', officer:'Bùi Thị Ánh', post:'Điếm K+3.0', shift:'Ca sáng', date:'11/03/2026 07:00', weather:'Nắng', waterLevel:'2.95m', result:'Bình thường. Kiểm tra đoạn K+1 đến K+4. Có 2 hố mối mọt nhỏ trên mái đê được phát hiện.', hasAlert:false, action:'Ghi nhận, phối hợp đơn vị phòng chống mối mọt xử lý', note:'Khu vực này thường xuất hiện mối mọt vào mùa xuân.' },
];

// ── Mock Data: Điểm xung yếu ───────────────────────────────────────
const DIKE_VULNERABLE = [
  { id:'XV-001', dikeId:'DK-002', type:'Nứt mặt đê', location:'K+3+450, Đông Anh', severity:'warning', found:'10/03/2026', status:'monitoring', desc:'Vết nứt dọc 3m, sâu 5cm. Chưa ảnh hưởng thân đê. Theo dõi bằng mốc biến dạng.', inspector:'Trần Thị Lan', action:'Cắm 2 mốc biến dạng. Kiểm tra lại sau 7 ngày.', lastUpdate:'15/03/2026', lat:21.12, lng:105.86 },
  { id:'XV-002', dikeId:'DK-004', type:'Thẩm lậu chân đê', location:'K+8+200, Hà Đông', severity:'critical', found:'12/03/2026', status:'fixing', desc:'Thẩm lậu phía đồng, lưu lượng ~0.5l/s. Đội đang đắp đất bịt tiếp giáp. Giảm so với đỉnh 1.2l/s.', inspector:'Lê Quang Minh', action:'Đã đắp 50 bao cát, đặt rọ đá tạm. Tiếp tục bơm vữa xi măng vào lỗ thẩm.', lastUpdate:'15/03/2026', lat:20.97, lng:105.76 },
  { id:'XV-003', dikeId:'DK-006', type:'Tràn mặt đê', location:'K+12+500, Chương Mỹ', severity:'emergency', found:'15/03/2026', status:'emergency_response', desc:'Tràn cục bộ ~15m. Kích hoạt PA khẩn cấp B. Đã sơ tán 43 hộ. Đang tôn cao đê tạm bằng bao cát.', inspector:'Phạm Văn Tuấn', action:'Kích hoạt PA B, sơ tán 43 hộ dân. Huy động 120 người + 3 máy bơm. Tôn cao 0.5m bằng bao cát.', lastUpdate:'15/03/2026 04:30', lat:20.61, lng:105.73 },
  { id:'XV-004', dikeId:'DK-001', type:'Sụt lún mái thượng lưu', location:'K+18+100, Bắc Từ Liêm', severity:'warning', found:'14/03/2026', status:'monitoring', desc:'Lún nhẹ ~8cm. Cắm 3 mốc theo dõi. Nguyên nhân nghi do thấm sâu lâu dài. Cần khảo sát địa kỹ thuật.', inspector:'Hoàng Minh Khải', action:'Cắm mốc biến dạng, lên kế hoạch khảo sát đầy đủ trong tuần tới.', lastUpdate:'14/03/2026', lat:21.09, lng:105.84 },
  { id:'XV-005', dikeId:'DK-005', type:'San lấp hành lang', location:'K+2+700, Ứng Hòa', severity:'info', found:'13/03/2026', status:'pending_violation', desc:'Hộ dân đổ ~15m³ vật liệu xây dựng vào hành lang bảo vệ đê. Đã lập biên bản vi phạm VF-001.', inspector:'Nguyễn Thị Hằng', action:'Lập biên bản vi phạm. Yêu cầu dọn dẹp trong 3 ngày (trước 16/03/2026).', lastUpdate:'13/03/2026', lat:20.52, lng:105.85 },
  { id:'XV-006', dikeId:'DK-004', type:'Nứt ngang mặt đê', location:'K+11+200, Hà Đông', severity:'warning', found:'12/03/2026', status:'monitoring', desc:'Nứt ngang ~1.5m. Chưa rõ độ sâu. Đang chờ đội khảo sát đến đánh giá kỹ thuật.', inspector:'Ngô Thị Phượng', action:'Cắm biển cảnh báo, báo cáo Chi cục, lịch khảo sát 17/03/2026.', lastUpdate:'12/03/2026', lat:20.97, lng:105.77 },
  { id:'XV-007', dikeId:'DK-008', type:'Sạt mái hạ lưu', location:'K+5+300, Thạch Thất', severity:'critical', found:'08/03/2026', status:'fixing', desc:'Sạt mái đê phía đồng, diện tích ~36m². Đội đang thi công gia cố bằng đá hộc và bê tông lát.', inspector:'Vũ Thị Ngân', action:'Đã thi công 60% khối lượng gia cố. Dự kiến hoàn thành 20/03/2026.', lastUpdate:'15/03/2026', lat:21.10, lng:105.47 },
  { id:'XV-008', dikeId:'DK-010', type:'Tổ mối mọt', location:'K+3+100, Thường Tín', severity:'info', found:'11/03/2026', status:'monitoring', desc:'Phát hiện 2 tổ mối nhỏ trên mái đê. Chưa ảnh hưởng cấu trúc. Đã thông báo đơn vị phòng chống mối.', inspector:'Bùi Thị Ánh', action:'Yêu cầu đơn vị phòng chống mối đến xử lý trong tuần này.', lastUpdate:'11/03/2026', lat:20.79, lng:105.88 },
  { id:'XV-009', dikeId:'DK-003', type:'Xói lở mái thượng lưu', location:'K+9+600, Gia Lâm', severity:'warning', found:'05/03/2026', status:'resolved', desc:'Xói lở cục bộ mái đê phía sông do sóng tàu thuyền. Đã gia cố xong bằng đá hộc.', inspector:'Đinh Thị Hoa', action:'Đã thi công gia cố xong ngày 10/03/2026. Kiểm tra nghiệm thu đạt yêu cầu.', lastUpdate:'10/03/2026', lat:21.02, lng:105.96 },
  { id:'XV-010', dikeId:'DK-001', type:'Thẩm lậu thân đê cũ', location:'K+7+800, Hoàn Kiếm', severity:'warning', found:'28/02/2026', status:'monitoring', desc:'Thẩm lậu thân đê tại vị trí có ống cống cũ bị hở mối nối. Lưu lượng nhỏ ~0.1l/s.', inspector:'Nguyễn Văn Dũng', action:'Đang khảo sát để vá mối nối ống cống. Theo dõi lưu lượng hàng ngày.', lastUpdate:'15/03/2026', lat:21.03, lng:105.85 },
];

// ── Mock Data: Vi phạm hành lang ────────────────────────────────────
const DIKE_VIOLATIONS = [
  { id:'VF-001', dikeId:'DK-005', type:'Đổ vật liệu vào hành lang', violator:'Hộ ông Nguyễn Văn Bình – thôn 3, xã Tảo Dương, Ứng Hòa', date:'13/03/2026', fine:'Cảnh cáo + Yêu cầu dọn dẹp trong 3 ngày', status:'pending', officer:'Nguyễn Thị Hằng', location:'K+2+700 Đê Ứng Hòa', fine_vnd:0, notes:'Vi phạm lần 2 của đối tượng này. Cần theo dõi chặt.' },
  { id:'VF-002', dikeId:'DK-003', type:'Khai thác đất mặt đê trái phép', violator:'Công ty TNHH XD Phúc Lai', date:'15/02/2026', fine:'2.000.000 VNĐ + Hoàn trả hiện trạng', status:'fined', officer:'Lê Minh Trang', location:'K+6+200 Đê tả Đuống', fine_vnd:2000000, notes:'Đã nộp phạt. Đang hoàn trả mặt đê.' },
  { id:'VF-003', dikeId:'DK-002', type:'Nuôi trồng thủy sản trong hành lang', violator:'Hộ ông Đỗ Văn Cường – xã Kim Nỗ, Đông Anh', date:'10/01/2026', fine:'1.000.000 VNĐ + Phá bỏ công trình', status:'resolved', officer:'Phạm Thị Ngọc', location:'K+4+800 Đê tả Hồng', fine_vnd:1000000, notes:'Đã dỡ bỏ lồng cá. Hoàn trả hành lang. Đóng hồ sơ.' },
  { id:'VF-004', dikeId:'DK-004', type:'Xây dựng nhà ở tạm trái phép', violator:'Hộ bà Lê Thị Minh – phường Dương Nội, Hà Đông', date:'20/02/2026', fine:'15.000.000 VNĐ + Tháo dỡ công trình', status:'fined', officer:'Ngô Thị Phượng', location:'K+9+100 Đê hữu Đáy', fine_vnd:15000000, notes:'QĐ xử phạt số 45/QĐ-UBND. Đang trong thời hạn tháo dỡ.' },
  { id:'VF-005', dikeId:'DK-008', type:'Đào đất mái đê trái phép', violator:'Ông Trần Văn Toản – xã Yên Bình, Thạch Thất', date:'01/03/2026', fine:'3.000.000 VNĐ + Hoàn trả mặt đê', status:'pending', officer:'Vũ Thị Ngân', location:'K+3+500 Đê hữu Hồng Thạch Thất', fine_vnd:3000000, notes:'Đang trong quá trình lập biên bản, chưa có QĐ xử phạt.' },
  { id:'VF-006', dikeId:'DK-001', type:'Trồng cây lấy gỗ trên mái đê', violator:'Hộ ông Bùi Xuân Lộc – phường Phú Diễn, Bắc Từ Liêm', date:'05/03/2026', fine:'Cảnh cáo + Nhố bỏ cây', status:'resolved', officer:'Nguyễn Văn Dũng', location:'K+14+200 Đê hữu Hồng Bắc Từ Liêm', fine_vnd:0, notes:'Đã nhổ 18 gốc bạch đàn. Hoàn thành. Đóng hồ sơ.' },
  { id:'VF-007', dikeId:'DK-006', type:'Để vật tư, phương tiện trên mặt đê', violator:'Hợp tác xã Nông nghiệp Tân Tiến, Chương Mỹ', date:'08/03/2026', fine:'500.000 VNĐ + Di dời ngay trong ngày', status:'fined', officer:'Phạm Văn Tuấn', location:'K+8+300 Đê bao Chương Mỹ', fine_vnd:500000, notes:'Đã di dời 2 máy cày, 1 xe tải. Nộp phạt đủ.' },
  { id:'VF-008', dikeId:'DK-010', type:'Chăn thả gia súc phá hoại mái đê', violator:'Hộ ông Đinh Văn An – xã Hà Hồi, Thường Tín', date:'12/03/2026', fine:'Cảnh cáo + Cam kết không tái phạm', status:'pending', officer:'Bùi Thị Ánh', location:'K+5+700 Đê bối Thường Tín', fine_vnd:0, notes:'Đối tượng đã ký cam kết không tái phạm.' },
  { id:'VF-009', dikeId:'DK-007', type:'Lấy đất hành lang bảo vệ đê làm ao', violator:'Hộ ông Nguyễn Tiến Thành – xã Vân Hà, Phúc Thọ', date:'18/02/2026', fine:'8.000.000 VNĐ + San lấp ao', status:'fined', officer:'Đặng Quốc Hùng', location:'K+2+100 Đê tả Đáy Phúc Thọ', fine_vnd:8000000, notes:'Đã nộp phạt. Đang trong thời hạn san lấp ao là 30/03/2026.' },
];

// ── Pagination Helper ───────────────────────────────────────────────
function dmPagination(total, current, tabKey) {
  const totalPages = Math.ceil(total / DM_PAGE_SIZE);
  if (totalPages <= 1) return '';
  const start = (current - 1) * DM_PAGE_SIZE;
  const nums = Array.from({ length: totalPages }, (_, i) => i + 1).map(p =>
    `<button onclick="dmSetPage('${tabKey}',${p})" style="min-width:30px;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;border:1px solid ${p===current?'var(--cyan)':'rgba(255,255,255,.12)'};background:${p===current?'rgba(0,200,255,.15)':'transparent'};color:${p===current?'var(--cyan)':'rgba(255,255,255,.5)'};cursor:pointer">${p}</button>`
  ).join('');
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-top:1px solid rgba(255,255,255,.07);margin-top:4px">
    <span style="font-size:11px;color:rgba(255,255,255,.35)">Hiển thị ${start+1}–${Math.min(start+DM_PAGE_SIZE,total)} / ${total} mục</span>
    <div style="display:flex;gap:4px">
      <button onclick="dmSetPage('${tabKey}',${current-1})" ${current===1?'disabled':''} style="padding:4px 10px;border-radius:6px;font-size:12px;border:1px solid rgba(255,255,255,.12);background:transparent;color:rgba(255,255,255,.5);cursor:pointer;opacity:${current===1?0.4:1}">‹</button>
      ${nums}
      <button onclick="dmSetPage('${tabKey}',${current+1})" ${current===totalPages?'disabled':''} style="padding:4px 10px;border-radius:6px;font-size:12px;border:1px solid rgba(255,255,255,.12);background:transparent;color:rgba(255,255,255,.5);cursor:pointer;opacity:${current===totalPages?0.4:1}">›</button>
    </div>
  </div>`;
}

window.dmSetPage = function(tab, page) {
  const total = { registry: DIKE_REGISTRY, patrol: DIKE_PATROLS, vulnerable: DIKE_VULNERABLE, violations: DIKE_VIOLATIONS }[tab]?.length || 0;
  const maxPage = Math.ceil(total / DM_PAGE_SIZE);
  dmPages[tab] = Math.max(1, Math.min(page, maxPage));
  const el = document.getElementById('dmContent');
  if (el) el.innerHTML = dmRenderTab();
};

// ── Page Entry ─────────────────────────────────────────────────────
function renderDikeManagement() {
  const issues    = DIKE_REGISTRY.reduce((s,d)=>s+d.issues,0);
  const emergency = DIKE_VULNERABLE.filter(v=>v.severity==='emergency').length;
  const openViol  = DIKE_VIOLATIONS.filter(v=>v.status==='pending').length;
  const alertPts  = DIKE_VULNERABLE.filter(v=>v.severity==='emergency'||v.severity==='critical').length;
  return `
<style>
.dm-page{padding:20px 24px;max-width:1280px;margin:0 auto}
.dm-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px}
.dm-kpi{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px 16px}
.dm-kpi-val{font-size:30px;font-weight:900;line-height:1;margin-bottom:4px}
.dm-kpi-lbl{font-size:11px;color:rgba(255,255,255,.4);font-weight:500}
.dm-tabs{display:flex;gap:4px;margin-bottom:16px;background:rgba(255,255,255,.04);border-radius:10px;padding:4px;width:fit-content}
.dm-tab{padding:7px 16px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;color:rgba(255,255,255,.45);border:none;background:transparent;transition:all .2s;display:flex;align-items:center;gap:6px}
.dm-tab.active{background:rgba(255,255,255,.1);color:#fff}
.dm-badge{background:rgba(239,68,68,.7);color:#fff;font-size:9px;border-radius:20px;padding:1px 5px;font-weight:800}
.dm-table{width:100%;border-collapse:collapse}
.dm-table th{font-size:10px;font-weight:700;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.07em;padding:8px 12px;text-align:left;border-bottom:1px solid rgba(255,255,255,.07)}
.dm-table td{padding:10px 12px;font-size:12px;border-bottom:1px solid rgba(255,255,255,.05);vertical-align:middle}
.dm-table tr:hover td{background:rgba(255,255,255,.025)}
.dm-vuln-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:14px;margin-bottom:8px;transition:all .2s;cursor:pointer}
.dm-vuln-card:hover{border-color:rgba(255,255,255,.14);background:rgba(255,255,255,.05)}
</style>
<div class="dm-page">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;flex-wrap:wrap;gap:12px">
    <div>
      <h1 style="font-size:21px;font-weight:800;color:#fff;margin:0 0 4px;display:flex;align-items:center;gap:9px">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
        Quản lý Đê điều
      </h1>
      <div style="font-size:12px;color:rgba(255,255,255,.38)">${DIKE_REGISTRY.length} tuyến đê · Tổng ${DIKE_REGISTRY.reduce((s,d)=>s+d.length,0).toFixed(1)} km · ${issues} điểm cần xử lý</div>
    </div>
    <button class="btn btn-primary" onclick="dmOpenPatrolLog()">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      Ghi nhật ký tuần tra
    </button>
  </div>
  <div class="dm-kpis">
    <div class="dm-kpi"><div class="dm-kpi-val" style="color:#a78bfa">${DIKE_REGISTRY.length}</div><div class="dm-kpi-lbl">Tuyến đê quản lý</div></div>
    <div class="dm-kpi"><div class="dm-kpi-val" style="color:#ef4444">${emergency}</div><div class="dm-kpi-lbl">Điểm khẩn cấp</div></div>
    <div class="dm-kpi"><div class="dm-kpi-val" style="color:#f59e0b">${DIKE_VULNERABLE.filter(v=>v.status!=='resolved').length}</div><div class="dm-kpi-lbl">Điểm xung yếu</div></div>
    <div class="dm-kpi"><div class="dm-kpi-val" style="color:#3b82f6">${openViol}</div><div class="dm-kpi-lbl">Vi phạm chưa xử lý</div></div>
  </div>
  <div class="dm-tabs">
    <button class="dm-tab ${dikeState.tab==='registry'?'active':''}" onclick="dmTab('registry')">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7h18M3 12h18M3 17h18"/></svg>Danh mục tuyến đê</button>
    <button class="dm-tab ${dikeState.tab==='patrol'?'active':''}" onclick="dmTab('patrol')">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Nhật ký tuần tra</button>
    <button class="dm-tab ${dikeState.tab==='vulnerable'?'active':''}" onclick="dmTab('vulnerable')">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>Điểm xung yếu
      ${alertPts>0?`<span class="dm-badge">${alertPts}</span>`:''}</button>
    <button class="dm-tab ${dikeState.tab==='violations'?'active':''}" onclick="dmTab('violations')">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M9 8v1a3 3 0 0 1-3 3H3v2h3a5 5 0 0 0 4-2 5 5 0 0 0 4 2h3v-2h-3a3 3 0 0 1-3-3V8"/><path d="M9 20h6M12 14v6"/></svg>Vi phạm hành lang
      ${openViol>0?`<span class="dm-badge">${openViol}</span>`:''}</button>
  </div>
  <div id="dmContent">${dmRenderTab()}</div>
</div>`;
}

function dmTab(tab) {
  dikeState.tab = tab;
  const el = document.getElementById('dmContent');
  if (el) el.innerHTML = dmRenderTab();
  document.querySelectorAll('.dm-tab').forEach((btn,i) => {
    btn.classList.toggle('active',['registry','patrol','vulnerable','violations'][i]===tab);
  });
}

function dmRenderTab() {
  if (dikeState.tab==='registry')   return dmRegistry();
  if (dikeState.tab==='patrol')     return dmPatrol();
  if (dikeState.tab==='vulnerable') return dmVulnerable();
  if (dikeState.tab==='violations') return dmViolations();
  return '';
}

// ── Tab 1: Danh mục tuyến đê ───────────────────────────────────────
function dmRegistry() {
  const pg=dmPages.registry, data=DIKE_REGISTRY;
  const rows=data.slice((pg-1)*DM_PAGE_SIZE,pg*DM_PAGE_SIZE);
  return `<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;overflow:hidden">
    <div style="overflow-x:auto"><table class="dm-table">
      <thead><tr><th>Mã</th><th>Tên tuyến đê</th><th>Cấp</th><th>Sông</th><th>Dài (km)</th><th>Cao trình</th><th>Tình trạng</th><th>Điểm XL</th><th>Kiểm tra gần nhất</th><th></th></tr></thead>
      <tbody>${rows.map(d=>`<tr>
        <td style="font-family:monospace;color:#a78bfa;font-weight:700;font-size:11px">${d.id}</td>
        <td style="font-weight:600;color:#fff">${d.name}<br><span style="font-size:10px;color:rgba(255,255,255,.35)">${d.district}</span></td>
        <td><span style="padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;background:${DIKE_TYPE_COLOR[d.type]}22;color:${DIKE_TYPE_COLOR[d.type]}">${DIKE_TYPE_LABEL[d.type]}</span></td>
        <td style="font-size:11px;color:rgba(255,255,255,.5)">${d.river}</td>
        <td style="font-weight:700;color:#38bdf8">${d.length}</td>
        <td style="font-family:monospace;color:#a3e635;font-size:11px">${d.elevation}</td>
        <td><div style="display:flex;align-items:center;gap:6px">
          <div class="pulse-dot ${d.status==='ok'?'green':d.status==='warning'?'yellow':'red'}"></div>
          <span style="font-size:11px;color:${DIKE_STATUS_COLOR[d.status]||'#6b7280'}">${d.condition}</span>
        </div></td>
        <td style="text-align:center"><span style="font-size:15px;font-weight:900;color:${d.issues>5?'#ef4444':d.issues>0?'#f59e0b':'#10b981'}">${d.issues}</span></td>
        <td style="font-size:11px;color:rgba(255,255,255,.45)">${d.lastInspect}</td>
        <td><button class="btn btn-ghost btn-sm" onclick="dmViewDike('${d.id}')">Chi tiết</button></td>
      </tr>`).join('')}</tbody>
    </table></div>
    ${dmPagination(data.length,pg,'registry')}</div>`;
}

// ── Tab 2: Nhật ký tuần tra ────────────────────────────────────────
function dmPatrol() {
  const pg=dmPages.patrol, data=DIKE_PATROLS;
  const rows=data.slice((pg-1)*DM_PAGE_SIZE,pg*DM_PAGE_SIZE);
  const alertSvg=`<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.5" style="vertical-align:middle;margin-right:3px"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>`;
  return `<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;overflow:hidden">
    <div style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:13px;font-weight:700;color:#fff">Nhật ký Tuần tra Kiểm tra Đê (${data.length} bản ghi)</span>
      <button class="btn btn-primary btn-sm" onclick="dmOpenPatrolLog()">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Ghi nhật ký mới
      </button>
    </div>
    <div style="overflow-x:auto"><table class="dm-table">
      <thead><tr><th>Mã</th><th>Tuyến đê</th><th>Cán bộ</th><th>Điếm canh</th><th>Ca</th><th>Thời gian</th><th>Kết quả</th><th></th></tr></thead>
      <tbody>${rows.map(p=>{
        const dk=DIKE_REGISTRY.find(d=>d.id===p.dikeId)||{};
        const preview=p.result.length>75?p.result.substring(0,75)+'…':p.result;
        return `<tr style="${p.hasAlert?'background:rgba(251,191,36,.025)':''}">
          <td style="font-family:monospace;font-size:11px;color:#a78bfa">${p.id}</td>
          <td style="font-size:11px;font-weight:600;max-width:150px">${dk.name||p.dikeId}</td>
          <td style="font-size:12px">${p.officer}</td>
          <td style="font-size:11px;color:rgba(255,255,255,.5)">${p.post}</td>
          <td><span style="padding:2px 7px;border-radius:20px;font-size:10px;font-weight:700;background:rgba(167,139,250,.15);color:#a78bfa">${p.shift}</span></td>
          <td style="font-size:11px;color:rgba(255,255,255,.4);white-space:nowrap">${p.date}</td>
          <td style="font-size:11px;line-height:1.5;max-width:230px;color:${p.hasAlert?'#fbbf24':'rgba(255,255,255,.6)'}">${p.hasAlert?alertSvg:''}${preview}</td>
          <td><button class="btn btn-ghost btn-sm" onclick="dmViewPatrol('${p.id}')">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Xem
          </button></td>
        </tr>`;
      }).join('')}</tbody>
    </table></div>
    ${dmPagination(data.length,pg,'patrol')}</div>`;
}
// ── Tab 3: Điểm xung yếu ──────────────────────────────────────────
function dmVulnerable() {
  const pg=dmPages.vulnerable, data=DIKE_VULNERABLE;
  const rows=data.slice((pg-1)*DM_PAGE_SIZE,pg*DM_PAGE_SIZE);
  return `<div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <div style="font-size:13px;font-weight:700;color:#fff">Điểm xung yếu Đê điều (${data.length} điểm)</div>
      <button class="btn btn-primary btn-sm" onclick="dmCreateVulnerable()">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Thêm điểm xung yếu
      </button>
    </div>
    ${rows.map(v=>{
      const dk=DIKE_REGISTRY.find(d=>d.id===v.dikeId)||{};
      const sc=SEV_COLOR[v.severity]||'#6b7280';
      const stc=VULN_STATUS_COLOR[v.status]||'#6b7280';
      return `<div class="dm-vuln-card" style="border-left:3px solid ${sc}">
        <div style="display:flex;align-items:flex-start;gap:14px">
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap">
              ${_sv(v.severity)}
              <span style="font-size:12px;font-weight:700;color:#fff">${v.type}</span>
              <span style="font-size:11px;color:rgba(255,255,255,.4)">· ${v.id}</span>
            </div>
            <div style="font-size:12px;color:rgba(255,255,255,.7);margin-bottom:4px;display:flex;align-items:center;gap:5px">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ${v.location}
            </div>
            <div style="font-size:11px;color:rgba(255,255,255,.45);line-height:1.5;margin-bottom:8px">${v.desc}</div>
            <div style="display:flex;gap:14px;font-size:11px;color:rgba(255,255,255,.35)">
              <span>Tuyến: <b style="color:rgba(255,255,255,.6)">${dk.name||v.dikeId}</b></span>
              <span>Phát hiện: <b style="color:rgba(255,255,255,.6)">${v.found}</b></span>
              <span>CB phụ trách: <b style="color:rgba(255,255,255,.6)">${v.inspector}</b></span>
            </div>
          </div>
          <div style="flex-shrink:0;text-align:right;display:flex;flex-direction:column;gap:6px">
            <div style="font-size:10px;font-weight:700;color:${stc};padding:4px 10px;border-radius:20px;border:1px solid ${stc}44;background:${stc}15;white-space:nowrap">${VULN_STATUS_LABEL[v.status]||v.status}</div>
            <div style="display:flex;gap:6px;justify-content:flex-end">
              <button class="btn btn-ghost btn-sm" onclick="dmViewVulnerable('${v.id}')">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Xem
              </button>
              ${v.status!=='resolved'?`<button class="btn btn-ghost btn-sm" style="color:#fbbf24;border-color:rgba(251,191,36,.3)" onclick="dmCreateTicket('${v.id}')">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                Lập phiếu
              </button>`:''}
            </div>
          </div>
        </div>
      </div>`;
    }).join('')}
    <div style="margin-top:4px">${dmPagination(data.length,pg,'vulnerable')}</div>
  </div>`;
}

// ── Tab 4: Vi phạm hành lang ───────────────────────────────────────
function dmViolations() {
  const pg=dmPages.violations, data=DIKE_VIOLATIONS;
  const rows=data.slice((pg-1)*DM_PAGE_SIZE,pg*DM_PAGE_SIZE);
  const stColor={pending:'#f59e0b',fined:'#a78bfa',resolved:'#10b981'};
  const stLabel={pending:'Chờ xử lý',fined:'Đã xử phạt',resolved:'Đã giải quyết'};
  return `<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;overflow:hidden">
    <div style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:13px;font-weight:700;color:#fff">Biên bản Vi phạm Hành lang Bảo vệ Đê (${data.length} hồ sơ)</span>
      <button class="btn btn-sm" style="background:rgba(239,68,68,.1);color:#f87171;border:1px solid rgba(239,68,68,.3)" onclick="dmNewViolation()">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Tạo biên bản
      </button>
    </div>
    <div style="overflow-x:auto"><table class="dm-table">
      <thead><tr><th>Mã BB</th><th>Loại vi phạm</th><th>Tuyến đê / Vị trí</th><th>Đối tượng vi phạm</th><th>Ngày lập</th><th>Hình thức xử lý</th><th>Trạng thái</th><th>Cán bộ</th><th></th></tr></thead>
      <tbody>${rows.map(v=>{
        const dk=DIKE_REGISTRY.find(d=>d.id===v.dikeId)||{};
        const sc=stColor[v.status]||'#6b7280';
        return `<tr>
          <td style="font-family:monospace;font-size:11px;color:#a78bfa;font-weight:700">${v.id}</td>
          <td style="font-size:11px;font-weight:600;color:#fff;max-width:140px">${v.type}</td>
          <td style="font-size:11px;color:rgba(255,255,255,.5)">${dk.name||v.dikeId}<br><span style="font-size:10px;color:rgba(255,255,255,.35)">${v.location}</span></td>
          <td style="font-size:11px;max-width:180px">${v.violator}</td>
          <td style="font-size:11px;color:rgba(255,255,255,.4);white-space:nowrap">${v.date}</td>
          <td style="font-size:11px;color:#fbbf24;max-width:160px">${v.fine}</td>
          <td><span style="padding:2px 10px;border-radius:20px;font-size:10px;font-weight:700;background:${sc}20;color:${sc};border:1px solid ${sc}44">${stLabel[v.status]||v.status}</span></td>
          <td style="font-size:11px;color:rgba(255,255,255,.5)">${v.officer}</td>
          <td><button class="btn btn-ghost btn-sm" onclick="dmViewViolation('${v.id}')">Xem BB</button></td>
        </tr>`;
      }).join('')}</tbody>
    </table></div>
    ${dmPagination(data.length,pg,'violations')}</div>`;
}

// ══════════════════════════════════════════════════════════════════
// MODALS
// ══════════════════════════════════════════════════════════════════
const _mcls = `<button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`;

// ── Modal: Xem Chi tiết Nhật ký Tuần tra ──────────────────────────
window.dmViewPatrol = function(id) {
  const p=DIKE_PATROLS.find(x=>x.id===id); if(!p) return;
  const dk=DIKE_REGISTRY.find(d=>d.id===p.dikeId)||{};
  const fields=[
    ['Tuyến đê',dk.name||p.dikeId],['Điếm canh',p.post],
    ['Ca trực',`<span style="padding:2px 8px;border-radius:20px;font-size:11px;background:rgba(167,139,250,.15);color:#a78bfa">${p.shift}</span>`],
    ['Cán bộ tuần tra',p.officer],['Thời gian',p.date],
    ['Thời tiết',p.weather],['Mực nước ghi nhận',`<span style="font-weight:700;color:#38bdf8">${p.waterLevel}</span>`],
  ];
  openModal(`
  <div class="modal-header">
    <span class="modal-title" style="display:flex;align-items:center;gap:8px">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      Nhật ký Tuần tra: ${p.id}
    </span>${_mcls}
  </div>
  <div class="modal-body">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
      ${fields.map(([l,v])=>`<div style="padding:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:8px">
        <div style="font-size:10px;color:rgba(255,255,255,.4);margin-bottom:3px;text-transform:uppercase;letter-spacing:.05em">${l}</div>
        <div style="font-size:13px;font-weight:600">${v}</div>
      </div>`).join('')}
    </div>
    <div style="padding:14px;background:${p.hasAlert?'rgba(251,191,36,.06)':'rgba(255,255,255,.03)'};border:1px solid ${p.hasAlert?'rgba(251,191,36,.25)':'rgba(255,255,255,.08)'};border-radius:10px;margin-bottom:12px">
      <div style="font-size:11px;font-weight:700;color:${p.hasAlert?'#fbbf24':'rgba(255,255,255,.5)'};margin-bottom:6px;display:flex;align-items:center;gap:6px">
        ${p.hasAlert?`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg> CÓ CẢNH BÁO`:`GHI NHẬN`}
      </div>
      <div style="font-size:13px;line-height:1.7;color:rgba(255,255,255,.85)">${p.result}</div>
    </div>
    ${p.action?`<div style="padding:12px 14px;background:rgba(56,189,248,.05);border:1px solid rgba(56,189,248,.15);border-radius:8px;margin-bottom:10px">
      <div style="font-size:10px;font-weight:700;color:#38bdf8;margin-bottom:5px;text-transform:uppercase">BIỆN PHÁP ĐÃ XỬ LÝ</div>
      <div style="font-size:12px;line-height:1.6;color:rgba(255,255,255,.75)">${p.action}</div>
    </div>`:''}
    ${p.note?`<div style="font-size:12px;color:rgba(255,255,255,.4);padding:8px 12px;background:rgba(255,255,255,.02);border-radius:6px;border-left:2px solid rgba(255,255,255,.1)">Ghi chú: ${p.note}</div>`:''}
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    ${p.hasAlert?`<button class="btn btn-ghost btn-sm" onclick="closeModal();showToast('Đang in nhật ký tuần tra...')">In nhật ký</button>
    <button class="btn btn-primary" onclick="closeModal();dmTab('vulnerable')">Xem điểm xung yếu</button>`:`<button class="btn btn-ghost btn-sm" onclick="closeModal();showToast('Đang in nhật ký tuần tra...')">In nhật ký</button>`}
  </div>`, {width:'760px'});
};

// ── Modal: Xem Chi tiết Điểm xung yếu ────────────────────────────
window.dmViewVulnerable = function(id) {
  const v=DIKE_VULNERABLE.find(x=>x.id===id); if(!v) return;
  const dk=DIKE_REGISTRY.find(d=>d.id===v.dikeId)||{};
  const sc=SEV_COLOR[v.severity]||'#6b7280';
  const stc=VULN_STATUS_COLOR[v.status]||'#6b7280';
  const fields=[
    ['Mã điểm xung yếu',v.id],['Loại sự cố',`<strong>${v.type}</strong>`],
    ['Tuyến đê',dk.name||v.dikeId],['CB phụ trách',v.inspector],
    ['Vị trí cụ thể',v.location],['Ngày phát hiện',v.found],
    ['Mức độ',_sv(v.severity)],
    ['Trạng thái',`<span style="color:${stc};font-weight:700">${VULN_STATUS_LABEL[v.status]||v.status}</span>`],
  ];
  openModal(`
  <div class="modal-header">
    <span class="modal-title" style="display:flex;align-items:center;gap:8px">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${sc}" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
      Điểm xung yếu: ${v.id}
    </span>${_mcls}
  </div>
  <div class="modal-body">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      ${fields.map(([l,val])=>`<div style="padding:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:8px">
        <div style="font-size:10px;color:rgba(255,255,255,.4);margin-bottom:3px;text-transform:uppercase;letter-spacing:.05em">${l}</div>
        <div style="font-size:13px;font-weight:600">${val}</div>
      </div>`).join('')}
    </div>
    <div style="padding:12px 14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;margin-bottom:12px">
      <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);margin-bottom:6px;text-transform:uppercase">MÔ TẢ HIỆN TRẠNG</div>
      <div style="font-size:13px;line-height:1.7;color:rgba(255,255,255,.85)">${v.desc}</div>
    </div>
    <div style="padding:12px 14px;background:rgba(56,189,248,.05);border:1px solid rgba(56,189,248,.15);border-radius:10px;margin-bottom:12px">
      <div style="font-size:11px;font-weight:700;color:#38bdf8;margin-bottom:6px;text-transform:uppercase">BIỆN PHÁP XỬ LÝ</div>
      <div style="font-size:13px;line-height:1.7;color:rgba(255,255,255,.75)">${v.action}</div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;font-size:12px;color:rgba(255,255,255,.4)">
      <span>Cập nhật lần cuối: <b style="color:rgba(255,255,255,.6)">${v.lastUpdate||'—'}</b></span>
      ${v.lat?`<a style="color:#a78bfa;cursor:pointer" onclick="window.open('https://maps.google.com/?q=${v.lat},${v.lng}','_blank')">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" style="vertical-align:middle;margin-right:3px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        Xem trên bản đồ</a>`:''}
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-ghost btn-sm" onclick="showToast('Đang xuất phiếu điểm xung yếu...')">Xuất phiếu</button>
    ${v.status!=='resolved'?`<button class="btn btn-primary" onclick="closeModal();dmCreateTicket('${v.id}')">Lập phiếu xử lý</button>`:''}
  </div>`, {width:'780px'});
};

// ── Modal: Lập phiếu xử lý Điểm xung yếu ────────────────────────
window.dmCreateTicket = function(id) {
  const v=DIKE_VULNERABLE.find(x=>x.id===id)||{};
  const dk=DIKE_REGISTRY.find(d=>d.id===v.dikeId)||{};
  openModal(`
  <div class="modal-header">
    <span class="modal-title" style="display:flex;align-items:center;gap:8px">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
      Lập phiếu xử lý: ${v.id||'Điểm xung yếu'}
    </span>${_mcls}
  </div>
  <div class="modal-body">
    <div style="padding:10px 14px;background:rgba(251,191,36,.06);border:1px solid rgba(251,191,36,.2);border-radius:8px;margin-bottom:16px;font-size:12px">
      <b style="color:#fbbf24">${v.type||''}</b> · ${v.location||''} · Tuyến: <b>${dk.name||v.dikeId||''}</b>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group"><label class="form-label">Mã điểm xung yếu</label>
        <input class="form-control" value="${v.id||''}" readonly></div>
      <div class="form-group"><label class="form-label">Loại xử lý</label>
        <select class="form-control">
          <option>Gia cố khẩn cấp</option>
          <option>Theo dõi thường xuyên</option>
          <option>Xử lý kỹ thuật</option>
          <option>Cắm biển cảnh báo</option>
          <option>Sửa chữa lớn</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Đơn vị thực hiện</label>
        <select class="form-control">
          <option>Đội tuần tra đê điều huyện</option>
          <option>Đội ứng cứu khẩn cấp Chi cục</option>
          <option>Đơn vị thi công thuê ngoài</option>
          <option>Phối hợp Quân sự địa phương</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Mức độ ưu tiên</label>
        <select class="form-control">
          <option>Khẩn cấp — xử lý ngay trong 24h</option>
          <option>Cao — xử lý trong 3 ngày</option>
          <option>Trung bình — xử lý trong 7 ngày</option>
          <option>Thấp — theo dõi định kỳ</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Ngày bắt đầu</label>
        <input class="form-control" type="date" value="${new Date().toISOString().slice(0,10)}">
      </div>
      <div class="form-group"><label class="form-label">Hạn hoàn thành</label>
        <input class="form-control" type="date" value="${new Date(Date.now()+86400000*7).toISOString().slice(0,10)}">
      </div>
      <div class="form-group"><label class="form-label">Kinh phí dự kiến (triệu VNĐ)</label>
        <input class="form-control" type="number" placeholder="VD: 50">
      </div>
      <div class="form-group"><label class="form-label">Cán bộ phụ trách</label>
        <input class="form-control" value="${v.inspector||''}" placeholder="Tên cán bộ">
      </div>
    </div>
    <div class="form-group" style="margin-top:4px"><label class="form-label">Mô tả chi tiết biện pháp xử lý</label>
      <textarea class="form-control" rows="3" placeholder="Mô tả giải pháp kỹ thuật, phương án thi công...">${v.action||''}</textarea>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-ghost btn-sm" onclick="showToast('Đã lưu bản nháp phiếu xử lý!')">Lưu nháp</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('Đã lập phiếu xử lý cho ${v.id}!')">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
      Xác nhận lập phiếu
    </button>
  </div>`, {width:'760px'});
};

// ── Modal: Thêm Điểm xung yếu mới ────────────────────────────────
window.dmCreateVulnerable = function() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Thêm Điểm xung yếu mới</span>${_mcls}</div>
  <div class="modal-body">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group"><label class="form-label">Tuyến đê</label>
        <select class="form-control">${DIKE_REGISTRY.map(d=>`<option value="${d.id}">${d.name}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">Loại sự cố</label>
        <select class="form-control">
          <option>Nứt mặt đê</option><option>Thẩm lậu chân đê</option>
          <option>Sụt lún mái đê</option><option>Sạt mái hạ lưu</option>
          <option>Tràn mặt đê</option><option>San lấp hành lang</option>
          <option>Tổ mối mọt</option><option>Xói lở mái thượng lưu</option>
          <option>Khác</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Vị trí cụ thể</label>
        <input class="form-control" placeholder="VD: K+8+200, Đoạn Hà Đông"></div>
      <div class="form-group"><label class="form-label">Mức độ nguy hiểm</label>
        <select class="form-control">
          <option value="emergency">Khẩn cấp</option>
          <option value="critical">Nghiêm trọng</option>
          <option value="warning" selected>Cảnh báo</option>
          <option value="info">Thông tin</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Ngày phát hiện</label>
        <input class="form-control" type="date" value="${new Date().toISOString().slice(0,10)}"></div>
      <div class="form-group"><label class="form-label">Cán bộ phụ trách</label>
        <input class="form-control" placeholder="Họ tên cán bộ"></div>
    </div>
    <div class="form-group" style="margin-top:4px"><label class="form-label">Mô tả hiện trạng</label>
      <textarea class="form-control" rows="3" placeholder="Mô tả chi tiết tình trạng điểm xung yếu..."></textarea></div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('Đã thêm điểm xung yếu mới!')">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
      Lưu điểm xung yếu
    </button>
  </div>`, {width:'720px'});
};

// ── Modal: Ghi nhật ký tuần tra mới ──────────────────────────────
window.dmOpenPatrolLog = function() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Ghi nhật ký Tuần tra Kiểm tra Đê</span>${_mcls}</div>
  <div class="modal-body">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group"><label class="form-label">Tuyến đê tuần tra</label>
        <select class="form-control">${DIKE_REGISTRY.map(d=>`<option value="${d.id}">${d.name}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">Điếm canh / Vị trí</label>
        <input class="form-control" placeholder="VD: Điếm K+5.0"></div>
      <div class="form-group"><label class="form-label">Ca trực</label>
        <select class="form-control"><option>Ca sáng (06:00–12:00)</option><option>Ca chiều (12:00–18:00)</option><option>Ca tối (18:00–24:00)</option><option>Ca đêm (00:00–06:00)</option></select></div>
      <div class="form-group"><label class="form-label">Cán bộ tuần tra</label>
        <input class="form-control" placeholder="Họ tên cán bộ tuần tra"></div>
      <div class="form-group"><label class="form-label">Mực nước ghi nhận (m)</label>
        <input class="form-control" type="number" step="0.01" placeholder="VD: 8.45"></div>
      <div class="form-group"><label class="form-label">Thời tiết</label>
        <select class="form-control"><option>Nắng, gió nhẹ</option><option>Âm u</option><option>Có mưa nhỏ</option><option>Mưa vừa</option><option>Mưa to, gió mạnh</option><option>Có sương mù</option></select></div>
    </div>
    <div class="form-group" style="margin-top:4px"><label class="form-label">Kết quả ghi nhận</label>
      <textarea class="form-control" rows="3" placeholder="Mô tả tình hình đê, những bất thường phát hiện (nếu có)..."></textarea></div>
    <div class="form-group"><label class="form-label">Biện pháp đã xử lý</label>
      <textarea class="form-control" rows="2" placeholder="Ghi rõ biện pháp xử lý tại chỗ (nếu có)..."></textarea></div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('Đã ghi nhật ký tuần tra đê thành công!')">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
      Lưu nhật ký
    </button>
  </div>`, {width:'760px'});
};

// ── Modal: Xem chi tiết tuyến đê ─────────────────────────────────
window.dmViewDike = function(id) {
  const d=DIKE_REGISTRY.find(x=>x.id===id); if(!d) return;
  const patrolCount=DIKE_PATROLS.filter(p=>p.dikeId===id).length;
  const vulnList=DIKE_VULNERABLE.filter(v=>v.dikeId===id);
  const sc=DIKE_STATUS_COLOR[d.status]||'#6b7280';
  openModal(`
  <div class="modal-header">
    <span class="modal-title">${d.id} — ${d.name}</span>${_mcls}
  </div>
  <div class="modal-body">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      ${[['Loại đê',`<span style="padding:2px 8px;border-radius:20px;font-size:11px;background:${DIKE_TYPE_COLOR[d.type]}22;color:${DIKE_TYPE_COLOR[d.type]}">${DIKE_TYPE_LABEL[d.type]}</span>`],['Sông',d.river],['Chiều dài',`<b style="color:#38bdf8">${d.length} km</b>`],['Cao trình thiết kế',`<b style="color:#a3e635">${d.elevation}</b>`],['Địa bàn quản lý',d.district],['Kiểm tra gần nhất',d.lastInspect],['Tình trạng',`<span style="color:${sc};font-weight:700">${d.condition}</span>`],['Lịch sử tuần tra',`${patrolCount} lần ghi nhận`]].map(([l,v])=>`<div style="padding:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:8px"><div style="font-size:10px;color:rgba(255,255,255,.4);margin-bottom:3px;text-transform:uppercase;letter-spacing:.05em">${l}</div><div style="font-size:13px;font-weight:600">${v}</div></div>`).join('')}
    </div>
    ${vulnList.length?`<div style="margin-top:8px"><div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);margin-bottom:8px;text-transform:uppercase">Điểm xung yếu trên tuyến (${vulnList.length})</div>
    ${vulnList.map(v=>`<div style="display:flex;justify-content:space-between;padding:8px 12px;background:rgba(255,255,255,.03);border-radius:8px;margin-bottom:6px">
      <div><span style="font-size:11px;font-weight:700;color:#fff">${v.type}</span> <span style="font-size:11px;color:rgba(255,255,255,.5)">· ${v.location}</span></div>
      <div style="display:flex;gap:8px;align-items:center">${_sv(v.severity)}</div>
    </div>`).join('')}</div>`:''}
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-ghost btn-sm" onclick="showToast('Đang xuất hồ sơ tuyến đê...')">Xuất hồ sơ</button>
    <button class="btn btn-primary" onclick="closeModal();dikeState.tab='patrol';dmTab('patrol')">Xem nhật ký tuần tra</button>
  </div>`, {width:'780px'});
};

// ── Modal: Tạo biên bản vi phạm mới ──────────────────────────────
window.dmNewViolation = function() {
  openModal(`
  <div class="modal-header"><span class="modal-title" style="color:#f87171">Tạo biên bản Vi phạm Hành lang Đê điều</span>${_mcls}</div>
  <div class="modal-body">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group"><label class="form-label">Tuyến đê</label>
        <select class="form-control">${DIKE_REGISTRY.map(d=>`<option value="${d.id}">${d.name}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">Loại vi phạm</label>
        <select class="form-control">
          <option>Đổ vật liệu vào hành lang</option><option>Xây dựng công trình trái phép</option>
          <option>Khai thác đất mặt đê</option><option>Nuôi trồng thủy sản hành lang</option>
          <option>Trồng cây lấy gỗ trên mái đê</option><option>Chăn thả gia súc</option><option>Khác</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Đối tượng vi phạm</label>
        <input class="form-control" placeholder="Tên cá nhân / tổ chức vi phạm"></div>
      <div class="form-group"><label class="form-label">Vị trí vi phạm</label>
        <input class="form-control" placeholder="VD: K+2+700 Đê Ứng Hòa"></div>
      <div class="form-group"><label class="form-label">Ngày lập biên bản</label>
        <input class="form-control" type="date" value="${new Date().toISOString().slice(0,10)}"></div>
      <div class="form-group"><label class="form-label">Cán bộ lập biên bản</label>
        <input class="form-control" placeholder="Họ tên cán bộ"></div>
    </div>
    <div class="form-group" style="margin-top:4px"><label class="form-label">Hình thức xử lý đề xuất</label>
      <textarea class="form-control" rows="2" placeholder="VD: Cảnh cáo + yêu cầu dọn dẹp trong 3 ngày..."></textarea></div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-sm" style="background:rgba(239,68,68,.1);color:#f87171;border:1px solid rgba(239,68,68,.3)" onclick="closeModal();showToast('Đã tạo biên bản vi phạm thành công!')">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
      Lập biên bản
    </button>
  </div>`, {width:'720px'});
};

// ── Modal: Xem biên bản vi phạm ───────────────────────────────────
window.dmViewViolation = function(id) {
  const v=DIKE_VIOLATIONS.find(x=>x.id===id); if(!v) return;
  const dk=DIKE_REGISTRY.find(d=>d.id===v.dikeId)||{};
  const stColor={pending:'#f59e0b',fined:'#a78bfa',resolved:'#10b981'};
  const stLabel={pending:'Chờ xử lý',fined:'Đã xử phạt',resolved:'Đã giải quyết'};
  const sc=stColor[v.status]||'#6b7280';
  openModal(`
  <div class="modal-header">
    <span class="modal-title" style="color:#f87171">Biên bản Vi phạm: ${v.id}</span>${_mcls}
  </div>
  <div class="modal-body">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      ${[['Đối tượng vi phạm',`<b>${v.violator}</b>`],['Loại vi phạm',`<b>${v.type}</b>`],['Tuyến đê',dk.name||v.dikeId],['Vị trí vi phạm',v.location],['Ngày lập BB',v.date],['Cán bộ lập BB',v.officer],['Hình thức xử lý',`<span style="color:#fbbf24">${v.fine}</span>`],['Trạng thái',`<span style="color:${sc};font-weight:700">${stLabel[v.status]||v.status}</span>`]].map(([l,val])=>`<div style="padding:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:8px"><div style="font-size:10px;color:rgba(255,255,255,.4);margin-bottom:3px;text-transform:uppercase;letter-spacing:.05em">${l}</div><div style="font-size:13px">${val}</div></div>`).join('')}
    </div>
    ${v.notes?`<div style="padding:12px 14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:8px;font-size:12px;color:rgba(255,255,255,.6);line-height:1.7"><b style="color:rgba(255,255,255,.5);font-size:10px;text-transform:uppercase;display:block;margin-bottom:5px">Ghi chú xử lý</b>${v.notes}</div>`:''}
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-ghost btn-sm" onclick="showToast('Đang in biên bản vi phạm...')">In BB</button>
    ${v.status!=='resolved'?`<button class="btn btn-primary" onclick="closeModal();showToast('Đã cập nhật trạng thái biên bản!')">Cập nhật xử lý</button>`:''}
  </div>`, {width:'760px'});
};
