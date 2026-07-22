// ── HADIWA IOC — Workflow Data ─────────────────────────────────────
// Block definitions, category metadata, and sample workflow library.
// Edit this file to add new block types or sample workflows.
// No UI code here — pure data.

// ── SVG icon helper ───────────────────────────────────────────────
function _wfSvg(paths, w, h) {
  return `<svg width="${w||16}" height="${h||16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

// ── Block Definitions ─────────────────────────────────────────────
const WF_BLOCK_DEFS = [
  // TRIGGERS — red
  { id:'trigger_iot',      cat:'trigger',     color:'#ef4444', label:'IoT Cảnh báo',     desc:'Kích hoạt khi ngưỡng IoT vượt mức',     icon:_wfSvg('<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/>') },
  { id:'trigger_schedule', cat:'trigger',     color:'#ef4444', label:'Lịch hẹn',          desc:'Kích hoạt theo lịch cron/ngày giờ',      icon:_wfSvg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>') },
  { id:'trigger_report',   cat:'trigger',     color:'#ef4444', label:'Báo cáo nộp',       desc:'Khi có báo cáo mới từ cộng đồng',        icon:_wfSvg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>') },
  { id:'trigger_webhook',  cat:'trigger',     color:'#ef4444', label:'API Webhook',        desc:'HTTP POST từ hệ thống ngoài',             icon:_wfSvg('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>') },
  { id:'trigger_manual',   cat:'trigger',     color:'#ef4444', label:'Thủ công',           desc:'Kích hoạt bằng tay bởi người dùng',      icon:_wfSvg('<path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>') },
  { id:'trigger_alert',    cat:'trigger',     color:'#ef4444', label:'Cảnh báo hệ thống', desc:'Khi có alert mức BĐ2/BĐ3',               icon:_wfSvg('<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>') },
  // CONDITIONS — amber
  { id:'cond_if',          cat:'condition',   color:'#f59e0b', label:'Điều kiện If/Else', desc:'Rẽ nhánh theo điều kiện',                icon:_wfSvg('<polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/>') },
  { id:'cond_threshold',   cat:'condition',   color:'#f59e0b', label:'So sánh ngưỡng',   desc:'So sánh giá trị với ngưỡng',             icon:_wfSvg('<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>') },
  { id:'cond_time',        cat:'condition',   color:'#f59e0b', label:'Thời gian',         desc:'Kiểm tra giờ/ngày trong tuần',           icon:_wfSvg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>') },
  { id:'cond_role',        cat:'condition',   color:'#f59e0b', label:'Kiểm tra Role',     desc:'Theo role/bộ phận',                      icon:_wfSvg('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>') },
  { id:'cond_and',         cat:'condition',   color:'#f59e0b', label:'AND / OR',          desc:'Kết hợp nhiều điều kiện',                icon:_wfSvg('<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/>') },
  // ACTIONS — green
  { id:'act_notify',       cat:'action',      color:'#10b981', label:'Gửi thông báo',    desc:'Push notification / in-app',             icon:_wfSvg('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>') },
  { id:'act_email',        cat:'action',      color:'#10b981', label:'Gửi Email',         desc:'Email qua SMTP',                         icon:_wfSvg('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>') },
  { id:'act_sms',          cat:'action',      color:'#10b981', label:'Gửi SMS',           desc:'SMS qua nhà mạng',                       icon:_wfSvg('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="10" x2="9.01" y2="10"/><line x1="12" y1="10" x2="12.01" y2="10"/><line x1="15" y1="10" x2="15.01" y2="10"/>') },
  { id:'act_tts',          cat:'action',      color:'#10b981', label:'Phát loa TTS',      desc:'Đọc thông báo qua hệ thống loa',         icon:_wfSvg('<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>') },
  { id:'act_report',       cat:'action',      color:'#10b981', label:'Tạo báo cáo',       desc:'Sinh file báo cáo tự động',              icon:_wfSvg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>') },
  { id:'act_update_data',  cat:'action',      color:'#10b981', label:'Cập nhật dữ liệu', desc:'Ghi dữ liệu vào hệ thống',               icon:_wfSvg('<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>') },
  { id:'act_zalo',         cat:'action',      color:'#10b981', label:'Zalo ZNS',          desc:'Gửi tin Zalo tới nhóm/cá nhân',          icon:_wfSvg('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="14" y2="14"/>') },
  { id:'act_gis_mark',     cat:'action',      color:'#10b981', label:'Đánh dấu GIS',     desc:'Tạo marker trên bản đồ GIS',             icon:_wfSvg('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>') },
  // AI BLOCKS — purple
  { id:'ai_analyze',       cat:'ai',          color:'#8b5cf6', label:'Phân tích AI',     desc:'GPT phân tích dữ liệu đầu vào',          icon:_wfSvg('<path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 12l4-4"/><circle cx="12" cy="12" r="2" fill="currentColor"/>') },
  { id:'ai_forecast',      cat:'ai',          color:'#8b5cf6', label:'Dự báo xu hướng', desc:'Mô hình ML dự báo ngắn hạn',             icon:_wfSvg('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>') },
  { id:'ai_anomaly',       cat:'ai',          color:'#8b5cf6', label:'Bất thường',       desc:'Phát hiện outlier trong chuỗi thời gian', icon:_wfSvg('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/>') },
  { id:'ai_classify',      cat:'ai',          color:'#8b5cf6', label:'Phân loại AI',     desc:'Tự động gán mức độ/loại sự kiện',        icon:_wfSvg('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>') },
  { id:'ai_generate_text', cat:'ai',          color:'#8b5cf6', label:'Tạo văn bản AI',  desc:'Sinh nội dung báo cáo, thông báo',        icon:_wfSvg('<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>') },
  { id:'ai_summarize',     cat:'ai',          color:'#8b5cf6', label:'Tóm tắt AI',       desc:'Tóm tắt tài liệu/dữ liệu dài',           icon:_wfSvg('<line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/>') },
  // CONTROL — slate
  { id:'ctrl_delay',       cat:'control',     color:'#64748b', label:'Delay',             desc:'Chờ N giây/phút/giờ',                    icon:_wfSvg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>') },
  { id:'ctrl_loop',        cat:'control',     color:'#64748b', label:'Lặp lại',           desc:'Lặp N lần hoặc foreach',                 icon:_wfSvg('<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>') },
  { id:'ctrl_parallel',    cat:'control',     color:'#64748b', label:'Song song',          desc:'Chạy nhiều nhánh cùng lúc',              icon:_wfSvg('<line x1="12" y1="2" x2="12" y2="22"/><path d="M2 7h20"/><path d="M2 17h20"/>') },
  { id:'ctrl_end',         cat:'control',     color:'#64748b', label:'Kết thúc',           desc:'Hoàn thành workflow',                    icon:_wfSvg('<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/>') },
  // INTEGRATION — cyan
  { id:'int_scada',        cat:'integration', color:'#0891b2', label:'SCADA',             desc:'Gửi lệnh tới hệ thống SCADA',            icon:_wfSvg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>') },
  { id:'int_api',          cat:'integration', color:'#0891b2', label:'Gọi API',           desc:'HTTP GET/POST tới API ngoài',             icon:_wfSvg('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>') },
  { id:'int_db',           cat:'integration', color:'#0891b2', label:'Truy vấn DB',       desc:'SQL query / NoSQL lookup',               icon:_wfSvg('<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>') },
];

const WF_CATS = [
  { id:'trigger',     label:'Trigger',    color:'#ef4444' },
  { id:'condition',   label:'Điều kiện',  color:'#f59e0b' },
  { id:'action',      label:'Hành động',  color:'#10b981' },
  { id:'ai',          label:'AI Blocks',  color:'#8b5cf6' },
  { id:'control',     label:'Điều phối',  color:'#64748b' },
  { id:'integration', label:'Tích hợp',   color:'#0891b2' },
];

const WF_CAT_LABELS = {
  emergency:'Khẩn cấp', report:'Báo cáo', forecast:'Dự báo',
  scada:'SCADA', citizen:'Công dân', maintenance:'Bảo trì', ai:'AI Agent',
};

// ── Property fields per block type ────────────────────────────────
function wfGetPropFields(defId) {
  const m = {
    trigger_iot:      [{ key:'station',label:'Trạm IoT',type:'select',options:[{v:'all',l:'Tất cả'},{v:'tv01',l:'Hà Nội (TV01)'},{v:'tv04',l:'Ba Thá (TV04)'},{v:'tv07',l:'Hồ Tuy Lai (TV07)'}] },{ key:'level',label:'Mức cảnh báo',type:'select',options:[{v:'bd1',l:'BĐ1'},{v:'bd2',l:'BĐ2'},{v:'bd3',l:'BĐ3'}] }],
    trigger_schedule: [{ key:'cron',label:'Lịch (cron)',type:'text',placeholder:'0 8 * * *',hint:'VD: 0 8 * * * = 8h sáng mỗi ngày' },{ key:'tz',label:'Timezone',type:'text',placeholder:'Asia/Ho_Chi_Minh' }],
    trigger_webhook:  [{ key:'method',label:'HTTP Method',type:'select',options:[{v:'POST',l:'POST'},{v:'GET',l:'GET'}] },{ key:'secret',label:'Webhook Secret',type:'text',placeholder:'Bearer token...' }],
    cond_threshold:   [{ key:'field',label:'Trường dữ liệu',type:'text',placeholder:'water_level' },{ key:'op',label:'Toán tử',type:'select',options:[{v:'>',l:'> Lớn hơn'},{v:'<',l:'< Nhỏ hơn'},{v:'>=',l:'>= Lớn hơn hoặc bằng'},{v:'=',l:'= Bằng'}] },{ key:'value',label:'Giá trị ngưỡng',type:'number',placeholder:'9.5' }],
    cond_time:        [{ key:'days',label:'Ngày',type:'text',placeholder:'Mon-Fri' },{ key:'from',label:'Từ',type:'text',placeholder:'07:00' },{ key:'to',label:'Đến',type:'text',placeholder:'17:00' }],
    act_notify:       [{ key:'title',label:'Tiêu đề',type:'text',placeholder:'Cảnh báo!' },{ key:'body',label:'Nội dung',type:'text',placeholder:'Mực nước vượt BĐ2...' },{ key:'roles',label:'Gửi tới',type:'select',options:[{v:'all',l:'Tất cả'},{v:'DIRECTOR',l:'Lãnh đạo'},{v:'DISPATCHER',l:'Điều phối'},{v:'TECHNICIAN',l:'Kỹ thuật'}] }],
    act_email:        [{ key:'to',label:'Email',type:'text',placeholder:'lanh_dao@pctt.gov.vn' },{ key:'subject',label:'Tiêu đề',type:'text' },{ key:'bodyTpl',label:'Template',type:'select',options:[{v:'flood_alert',l:'Cảnh báo lũ'},{v:'daily_report',l:'Báo cáo ngày'},{v:'custom',l:'Tùy chỉnh'}] }],
    act_tts:          [{ key:'msg',label:'Nội dung phát',type:'text',placeholder:'Cảnh báo...' },{ key:'zones',label:'Khu vực loa',type:'select',options:[{v:'all',l:'Toàn bộ'},{v:'z1',l:'Khu vực 1'},{v:'z2',l:'Khu vực 2'}] },{ key:'repeat',label:'Lặp (lần)',type:'number',placeholder:'3' }],
    act_zalo:         [{ key:'groupId',label:'Nhóm Zalo',type:'text',placeholder:'Group ID' },{ key:'template',label:'Template ZNS',type:'text',placeholder:'flood_warning_v1' }],
    ai_analyze:       [{ key:'model',label:'AI Model',type:'select',options:[{v:'gpt4o',l:'GPT-4o'},{v:'gemini',l:'Gemini 1.5 Pro'},{v:'local',l:'Local LLM'}] },{ key:'prompt',label:'System prompt',type:'text',placeholder:'Phân tích dữ liệu...' },{ key:'input',label:'Input field',type:'text',placeholder:'{{trigger.data}}' }],
    ai_forecast:      [{ key:'horizon',label:'Dự báo (giờ)',type:'number',placeholder:'24' },{ key:'model',label:'Mô hình',type:'select',options:[{v:'lstm',l:'LSTM'},{v:'arima',l:'ARIMA'},{v:'prophet',l:'Prophet'}] }],
    ai_generate_text: [{ key:'model',label:'AI Model',type:'select',options:[{v:'gpt4o',l:'GPT-4o'},{v:'gemini',l:'Gemini Pro'}] },{ key:'template',label:'Prompt template',type:'text',placeholder:'Viết thông báo: {{data}}' },{ key:'maxLen',label:'Độ dài tối đa',type:'number',placeholder:'300' }],
    ctrl_delay:       [{ key:'amount',label:'Thời gian chờ',type:'number',placeholder:'5' },{ key:'unit',label:'Đơn vị',type:'select',options:[{v:'s',l:'Giây'},{v:'m',l:'Phút'},{v:'h',l:'Giờ'}] }],
    ctrl_loop:        [{ key:'times',label:'Số lần lặp',type:'number',placeholder:'3' },{ key:'interval',label:'Khoảng cách (s)',type:'number',placeholder:'60' }],
    int_api:          [{ key:'url',label:'URL',type:'text',placeholder:'https://api.example.com/...' },{ key:'method',label:'Method',type:'select',options:[{v:'POST',l:'POST'},{v:'GET',l:'GET'},{v:'PUT',l:'PUT'}] },{ key:'auth',label:'Auth token',type:'text',placeholder:'Bearer ...' }],
    int_scada:        [{ key:'device',label:'Thiết bị SCADA',type:'text',placeholder:'PUMP_01' },{ key:'cmd',label:'Lệnh',type:'select',options:[{v:'ON',l:'BẬT'},{v:'OFF',l:'TẮT'},{v:'STATUS',l:'Đọc trạng thái'}] }],
    int_db:           [{ key:'query',label:'SQL Query',type:'text',placeholder:'SELECT * FROM sensors...' },{ key:'limit',label:'Limit rows',type:'number',placeholder:'100' }],
  };
  return m[defId] || [{ key:'note',label:'Ghi chú',type:'text',placeholder:'...' }];
}

// ── Sample Workflow Library (12 PCTT scenarios) ───────────────────
let WF_LIST = [
  { id:'wf1',  cat:'emergency',   active:true,  runs:142, lastRun:'2026-03-13 18:30', created:'2026-01-05',
    name:'Cảnh báo lũ tự động',
    desc:'IoT BĐ2 → AI phân tích → Phát loa + Zalo + Báo cáo',
    nodes:[{id:'n1',defId:'trigger_iot',x:60,y:180,label:'IoT BĐ2',params:{station:'all',level:'bd2'}},{id:'n2',defId:'ai_classify',x:290,y:180,label:'Phân loại AI',params:{model:'gpt4o'}},{id:'n3',defId:'act_tts',x:510,y:90,label:'Phát loa',params:{zones:'all',repeat:'3'}},{id:'n4',defId:'act_zalo',x:510,y:250,label:'Zalo ZNS',params:{groupId:'g01'}},{id:'n5',defId:'act_report',x:510,y:390,label:'Báo cáo',params:{bodyTpl:'flood_alert'}}],
    edges:[{id:'e1',fromId:'n1',toId:'n2'},{id:'e2',fromId:'n2',toId:'n3'},{id:'e3',fromId:'n2',toId:'n4'},{id:'e4',fromId:'n2',toId:'n5'}] },

  { id:'wf2',  cat:'report',      active:true,  runs:62,  lastRun:'2026-03-13 08:00', created:'2026-01-10',
    name:'Báo cáo hàng ngày 8h',
    desc:'8h sáng → AI tóm tắt → Email lãnh đạo + PDF',
    nodes:[{id:'n1',defId:'trigger_schedule',x:60,y:180,label:'8h sáng',params:{cron:'0 8 * * *'}},{id:'n2',defId:'int_db',x:270,y:180,label:'Lấy dữ liệu',params:{}},{id:'n3',defId:'ai_summarize',x:470,y:180,label:'Tóm tắt AI',params:{model:'gemini'}},{id:'n4',defId:'act_report',x:670,y:90,label:'Tạo PDF',params:{bodyTpl:'daily_report'}},{id:'n5',defId:'act_email',x:670,y:280,label:'Gửi lãnh đạo',params:{to:'lanh_dao@pctt.gov.vn'}}],
    edges:[{id:'e1',fromId:'n1',toId:'n2'},{id:'e2',fromId:'n2',toId:'n3'},{id:'e3',fromId:'n3',toId:'n4'},{id:'e4',fromId:'n3',toId:'n5'}] },

  { id:'wf3',  cat:'citizen',     active:false, runs:8,   lastRun:'2026-03-12 11:15', created:'2026-02-01',
    name:'Phân loại phản ánh cộng đồng',
    desc:'Báo cáo mới → AI phân loại → Giao việc tự động',
    nodes:[{id:'n1',defId:'trigger_report',x:60,y:180,label:'Báo cáo mới',params:{}},{id:'n2',defId:'ai_classify',x:270,y:180,label:'Phân loại AI',params:{model:'gpt4o'}},{id:'n3',defId:'cond_if',x:470,y:180,label:'Ưu tiên cao?',params:{}},{id:'n4',defId:'act_notify',x:670,y:90,label:'Alert khẩn',params:{roles:'DISPATCHER'}},{id:'n5',defId:'act_update_data',x:670,y:280,label:'Cập nhật DB',params:{}}],
    edges:[{id:'e1',fromId:'n1',toId:'n2'},{id:'e2',fromId:'n2',toId:'n3'},{id:'e3',fromId:'n3',toId:'n4'},{id:'e4',fromId:'n3',toId:'n5'}] },

  { id:'wf4',  cat:'scada',       active:true,  runs:31,  lastRun:'2026-03-11 03:45', created:'2026-02-10',
    name:'Điều tiết hồ chứa tự động',
    desc:'IoT BĐ3 → SCADA đóng cống → Cảnh báo lãnh đạo',
    nodes:[{id:'n1',defId:'trigger_iot',x:60,y:180,label:'IoT hồ chứa',params:{station:'tv07',level:'bd3'}},{id:'n2',defId:'cond_threshold',x:270,y:180,label:'Vượt BĐ3?',params:{field:'water_level',op:'>',value:'11.5'}},{id:'n3',defId:'int_scada',x:470,y:90,label:'Đóng cống',params:{device:'GATE_01',cmd:'OFF'}},{id:'n4',defId:'act_tts',x:470,y:280,label:'Phát loa BĐ3',params:{zones:'all',repeat:'5'}},{id:'n5',defId:'act_notify',x:670,y:180,label:'SMS lãnh đạo',params:{roles:'DIRECTOR'}}],
    edges:[{id:'e1',fromId:'n1',toId:'n2'},{id:'e2',fromId:'n2',toId:'n3'},{id:'e3',fromId:'n2',toId:'n4'},{id:'e4',fromId:'n4',toId:'n5'}] },

  { id:'wf5',  cat:'forecast',    active:true,  runs:45,  lastRun:'2026-03-13 09:00', created:'2026-02-15',
    name:'Dự báo lũ 24h trước',
    desc:'9h sáng → KTTV API → AI dự báo → Cảnh báo sớm',
    nodes:[{id:'n1',defId:'trigger_schedule',x:60,y:180,label:'9h sáng',params:{cron:'0 9 * * *'}},{id:'n2',defId:'int_api',x:260,y:180,label:'API KTTV',params:{url:'https://kttv.gov.vn/api',method:'GET'}},{id:'n3',defId:'ai_forecast',x:460,y:180,label:'Dự báo 24h',params:{horizon:'24',model:'lstm'}},{id:'n4',defId:'cond_threshold',x:660,y:180,label:'Nguy cơ cao?',params:{field:'forecast_level',op:'>',value:'7.0'}},{id:'n5',defId:'act_notify',x:860,y:90,label:'Cảnh báo sớm',params:{roles:'all'}},{id:'n6',defId:'act_email',x:860,y:280,label:'Email ban chỉ đạo',params:{to:'pctt@hanoi.gov.vn'}}],
    edges:[{id:'e1',fromId:'n1',toId:'n2'},{id:'e2',fromId:'n2',toId:'n3'},{id:'e3',fromId:'n3',toId:'n4'},{id:'e4',fromId:'n4',toId:'n5'},{id:'e5',fromId:'n4',toId:'n6'}] },

  { id:'wf6',  cat:'emergency',   active:true,  runs:3,   lastRun:'2026-03-08 14:22', created:'2026-02-20',
    name:'Xử lý tín hiệu cứu hộ SOS',
    desc:'Webhook SOS → GIS đánh dấu → Điều phối song song',
    nodes:[{id:'n1',defId:'trigger_webhook',x:60,y:220,label:'SOS Webhook',params:{method:'POST'}},{id:'n2',defId:'act_gis_mark',x:260,y:220,label:'Đánh dấu GIS',params:{}},{id:'n3',defId:'ctrl_parallel',x:460,y:220,label:'Song song',params:{}},{id:'n4',defId:'act_tts',x:660,y:90,label:'Loa khu vực',params:{zones:'all'}},{id:'n5',defId:'act_sms',x:660,y:220,label:'SMS đội cứu hộ',params:{}},{id:'n6',defId:'act_notify',x:660,y:360,label:'Alert toàn hệ',params:{roles:'all'}}],
    edges:[{id:'e1',fromId:'n1',toId:'n2'},{id:'e2',fromId:'n2',toId:'n3'},{id:'e3',fromId:'n3',toId:'n4'},{id:'e4',fromId:'n3',toId:'n5'},{id:'e5',fromId:'n3',toId:'n6'}] },

  { id:'wf7',  cat:'maintenance', active:true,  runs:92,  lastRun:'2026-03-13 00:00', created:'2026-01-20',
    name:'Kiểm tra IoT định kỳ 0h',
    desc:'0h hàng ngày → Ping sensor → Cảnh báo mất kết nối',
    nodes:[{id:'n1',defId:'trigger_schedule',x:60,y:200,label:'0h hàng ngày',params:{cron:'0 0 * * *'}},{id:'n2',defId:'int_api',x:260,y:200,label:'Kiểm tra sensor',params:{url:'https://iot.hadiwa.vn/ping',method:'GET'}},{id:'n3',defId:'cond_if',x:460,y:200,label:'Lỗi?',params:{}},{id:'n4',defId:'act_notify',x:660,y:100,label:'Alert IT',params:{roles:'TECHNICIAN'}},{id:'n5',defId:'act_email',x:660,y:300,label:'Báo cáo lỗi',params:{to:'it@hadiwa.vn'}}],
    edges:[{id:'e1',fromId:'n1',toId:'n2'},{id:'e2',fromId:'n2',toId:'n3'},{id:'e3',fromId:'n3',toId:'n4'},{id:'e4',fromId:'n3',toId:'n5'}] },

  { id:'wf8',  cat:'report',      active:true,  runs:12,  lastRun:'2026-03-07 17:00', created:'2026-01-25',
    name:'Tổng hợp cuối tuần',
    desc:'Thứ 6 17h → 7 ngày dữ liệu → AI phân tích → Lãnh đạo',
    nodes:[{id:'n1',defId:'trigger_schedule',x:60,y:200,label:'Thứ 6 17h',params:{cron:'0 17 * * 5'}},{id:'n2',defId:'int_db',x:260,y:200,label:'Query 7 ngày',params:{}},{id:'n3',defId:'ai_analyze',x:460,y:200,label:'Phân tích AI',params:{model:'gemini'}},{id:'n4',defId:'act_report',x:660,y:200,label:'Tạo báo cáo',params:{bodyTpl:'weekly_report'}},{id:'n5',defId:'act_email',x:860,y:100,label:'Gửi lãnh đạo',params:{}},{id:'n6',defId:'act_update_data',x:860,y:300,label:'Lưu trữ',params:{}}],
    edges:[{id:'e1',fromId:'n1',toId:'n2'},{id:'e2',fromId:'n2',toId:'n3'},{id:'e3',fromId:'n3',toId:'n4'},{id:'e4',fromId:'n4',toId:'n5'},{id:'e5',fromId:'n4',toId:'n6'}] },

  { id:'wf9',  cat:'ai',          active:false, runs:0,   lastRun:'-',               created:'2026-03-01',
    name:'Nhân viên số trả lời tự động',
    desc:'Câu hỏi đến → AI hiểu → Sinh trả lời → Zalo/Email',
    nodes:[{id:'n1',defId:'trigger_webhook',x:60,y:200,label:'Câu hỏi đến',params:{method:'POST'}},{id:'n2',defId:'ai_analyze',x:260,y:200,label:'Hiểu câu hỏi',params:{model:'gpt4o'}},{id:'n3',defId:'ai_generate_text',x:460,y:200,label:'Sinh trả lời',params:{model:'gpt4o'}},{id:'n4',defId:'cond_role',x:660,y:200,label:'Kênh phản hồi',params:{}},{id:'n5',defId:'act_zalo',x:860,y:100,label:'Zalo reply',params:{}},{id:'n6',defId:'act_email',x:860,y:300,label:'Email reply',params:{}}],
    edges:[{id:'e1',fromId:'n1',toId:'n2'},{id:'e2',fromId:'n2',toId:'n3'},{id:'e3',fromId:'n3',toId:'n4'},{id:'e4',fromId:'n4',toId:'n5'},{id:'e5',fromId:'n4',toId:'n6'}] },

  { id:'wf10', cat:'forecast',    active:true,  runs:288, lastRun:'2026-03-13 21:00', created:'2026-02-28',
    name:'Theo dõi khí tượng 30 phút',
    desc:'Mỗi 30ph → API KTTV → AI phát hiện bất thường → Alert',
    nodes:[{id:'n1',defId:'trigger_schedule',x:60,y:200,label:'Mỗi 30ph',params:{cron:'*/30 * * * *'}},{id:'n2',defId:'int_api',x:260,y:200,label:'API KTTV',params:{url:'https://kttv.gov.vn/api',method:'GET'}},{id:'n3',defId:'ai_anomaly',x:460,y:200,label:'Phát hiện bất thường',params:{}},{id:'n4',defId:'cond_threshold',x:660,y:200,label:'Mức cao?',params:{field:'anomaly_score',op:'>',value:'0.75'}},{id:'n5',defId:'act_notify',x:860,y:200,label:'Cảnh báo',params:{roles:'DISPATCHER'}}],
    edges:[{id:'e1',fromId:'n1',toId:'n2'},{id:'e2',fromId:'n2',toId:'n3'},{id:'e3',fromId:'n3',toId:'n4'},{id:'e4',fromId:'n4',toId:'n5'}] },

  { id:'wf11', cat:'scada',       active:true,  runs:730, lastRun:'2026-03-13 06:00', created:'2026-01-01',
    name:'Lịch vận hành bơm nước',
    desc:'6h sáng → SCADA bật bơm → Chờ 8h → Tắt → Nhật ký',
    nodes:[{id:'n1',defId:'trigger_schedule',x:60,y:200,label:'6h sáng',params:{cron:'0 6 * * *'}},{id:'n2',defId:'int_scada',x:260,y:200,label:'Bật bơm',params:{device:'PUMP_01',cmd:'ON'}},{id:'n3',defId:'ctrl_delay',x:460,y:200,label:'Chờ 8 giờ',params:{amount:'8',unit:'h'}},{id:'n4',defId:'int_scada',x:660,y:200,label:'Tắt bơm',params:{device:'PUMP_01',cmd:'OFF'}},{id:'n5',defId:'act_update_data',x:860,y:200,label:'Ghi nhật ký',params:{}}],
    edges:[{id:'e1',fromId:'n1',toId:'n2'},{id:'e2',fromId:'n2',toId:'n3'},{id:'e3',fromId:'n3',toId:'n4'},{id:'e4',fromId:'n4',toId:'n5'}] },

  { id:'wf12', cat:'emergency',   active:true,  runs:17,  lastRun:'2026-03-12 09:30', created:'2026-02-05',
    name:'Cảnh báo chất lượng nước',
    desc:'Sensor → Vượt ngưỡng → Phân loại AI → TTS + GIS + SMS',
    nodes:[{id:'n1',defId:'trigger_iot',x:60,y:200,label:'Sensor CL nước',params:{station:'tv01'}},{id:'n2',defId:'cond_threshold',x:260,y:200,label:'Vượt ngưỡng?',params:{field:'turbidity',op:'>',value:'5.0'}},{id:'n3',defId:'ai_classify',x:460,y:200,label:'Phân loại',params:{model:'gemini'}},{id:'n4',defId:'act_tts',x:660,y:90,label:'Cảnh báo loa',params:{zones:'all',repeat:'3'}},{id:'n5',defId:'act_gis_mark',x:660,y:280,label:'Đánh dấu bản đồ',params:{}},{id:'n6',defId:'act_sms',x:860,y:200,label:'SMS cơ quan y tế',params:{}}],
    edges:[{id:'e1',fromId:'n1',toId:'n2'},{id:'e2',fromId:'n2',toId:'n3'},{id:'e3',fromId:'n3',toId:'n4'},{id:'e4',fromId:'n3',toId:'n5'},{id:'e5',fromId:'n4',toId:'n6'}] },
];
