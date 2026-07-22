// ── HADIWA IOC — Cảnh báo sớm & Hỗ trợ ra quyết định ───────────────
// Page: earlyWarning  (registered in app.js as renderEarlyWarning)
// v4.1 — Full rule engine, live alert feed, risk matrix, multi-channel

// ── State ──────────────────────────────────────────────────────────
let ewState = {
  tab: 'alerts',   // 'alerts' | 'rules' | 'matrix' | 'channels'
};

// ── Data ───────────────────────────────────────────────────────────
const EW_ALERTS = [
  { id:'a1', time:'06:45', station:'Sông Hồng (Hà Nội)',  param:'Mực nước',   value:'9.82m', threshold:'BĐ I (9.5m)',  severity:'warning',  status:'new',   desc:'Mực nước đang tăng nhanh, có xu hướng đạt BĐ II trong 3-4h tới' },
  { id:'a2', time:'05:12', station:'Hồ Tuy Lai',          param:'Mực nước hồ', value:'19.73m', threshold:'19.5m',      severity:'critical', status:'handling', desc:'Vượt ngưỡng xả lũ an toàn. Đã kích hoạt lệnh xả cống điều tiết' },
  { id:'a3', time:'04:30', station:'Ba Thá (Ứng Hòa)',    param:'Lượng mưa',  value:'124mm',  threshold:'100mm/24h',   severity:'critical', status:'handling', desc:'Mưa cực lớn đầu nguồn sông Đáy, nguy cơ ngập úng vùng hạ lưu' },
  { id:'a4', time:'03:55', station:'Sông Đáy (Hà Đông)', param:'Mực nước',   value:'6.21m',  threshold:'BĐ I (6.0m)', severity:'warning',  status:'new',   desc:'Mực nước tăng nhanh sau mưa lớn thượng nguồn' },
  { id:'a5', time:'02:10', station:'Đanh Đà',             param:'Lượng mưa',  value:'87mm',   threshold:'80mm/6h',     severity:'warning',  status:'done',  desc:'Đã xử lý. Lượng mưa giảm, mực nước ổn định' },
  { id:'a6', time:'01:30', station:'Cầu Giẽ',             param:'Mực nước',   value:'4.45m',  threshold:'BĐ I (4.5m)', severity:'info',     status:'done',  desc:'Xấp xỉ ngưỡng, tiếp tục theo dõi' },
];

const EW_RULES = [
  { id:1, name:'Lũ Sông Hồng – Hà Nội', station:'TV01 (Hà Nội)',   param:'Mực nước',    op:'>',  val:'9.50m',   severity:'warning',  active:true,  channels:['app','sms','zalo'] },
  { id:2, name:'Lũ Sông Hồng – Sơn Tây', station:'TV02 (Sơn Tây)', param:'Mực nước',    op:'>',  val:'13.50m',  severity:'critical', active:true,  channels:['app','sms','email','zalo','tts'] },
  { id:3, name:'Ngập úng Ba Thá',         station:'TV04 (Ba Thá)',   param:'Lượng mưa',   op:'>',  val:'100mm/24h', severity:'critical', active:true, channels:['app','sms','zalo'] },
  { id:4, name:'Hồ Tuy Lai vượt ngưỡng', station:'TV07 (Tuy Lai)', param:'Mực nước hồ', op:'>',  val:'19.50m',  severity:'critical', active:true,  channels:['app','sms','email','zalo','scada'] },
  { id:5, name:'Mưa lớn đầu nguồn',       station:'TV06 (Hòa Bình)', param:'Lượng mưa',  op:'>',  val:'50mm/3h', severity:'warning',  active:true,  channels:['app','zalo'] },
  { id:6, name:'Sông Đáy – Hà Đông',      station:'TV05 (Hà Đông)', param:'Mực nước',    op:'>',  val:'6.00m',   severity:'warning',  active:false, channels:['app'] },
];

// Risk matrix: rows = districts, cols = hazard types
const EW_RISK = [
  { district:'Ứng Hòa',   flood:5, waterlog:4, landslide:1, drought:2 },
  { district:'Mỹ Đức',    flood:4, waterlog:3, landslide:3, drought:1 },
  { district:'Chương Mỹ', flood:3, waterlog:5, landslide:2, drought:1 },
  { district:'Ba Vì',     flood:4, waterlog:2, landslide:4, drought:2 },
  { district:'Hà Đông',   flood:2, waterlog:4, landslide:1, drought:1 },
  { district:'Thanh Oai', flood:3, waterlog:3, landslide:1, drought:2 },
  { district:'Phú Xuyên', flood:2, waterlog:4, landslide:1, drought:3 },
  { district:'Thường Tín', flood:3, waterlog:3, landslide:1, drought:1 },
];

// ── Entry point ────────────────────────────────────────────────────
function renderEarlyWarning() {
  const activeCount  = EW_ALERTS.filter(a => a.status === 'new').length;
  const criticalCount= EW_ALERTS.filter(a => a.severity === 'critical' && a.status !== 'done').length;
  const handlingCount= EW_ALERTS.filter(a => a.status === 'handling').length;

  return `
<style>
/* ── EW Page layout ── */
.ew-page{padding:20px 24px;max-width:1280px;margin:0 auto}
.ew-topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:12px}
.ew-title{font-size:21px;font-weight:800;background:linear-gradient(135deg,#fff 30%,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;display:flex;align-items:center;gap:9px}
.ew-subtitle{font-size:12px;color:rgba(255,255,255,.38);margin-top:3px}

/* KPI row */
.ew-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px}
.ew-kpi{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px 16px;position:relative;overflow:hidden;transition:border-color .2s}
.ew-kpi:hover{border-color:rgba(255,255,255,.16)}
.ew-kpi::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--kc,.1) 0%,transparent 60%);opacity:.5;pointer-events:none}
.ew-kpi-val{font-size:32px;font-weight:900;line-height:1;margin-bottom:4px}
.ew-kpi-lbl{font-size:11px;color:rgba(255,255,255,.4);font-weight:500}
.ew-kpi-sub{font-size:10px;color:rgba(255,255,255,.28);margin-top:4px}

/* Tabs */
.ew-tabs{display:flex;gap:4px;margin-bottom:16px;background:rgba(255,255,255,.04);border-radius:10px;padding:4px;width:fit-content}
.ew-tab{padding:7px 16px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;color:rgba(255,255,255,.45);border:none;background:transparent;transition:all .2s;display:flex;align-items:center;gap:6px}
.ew-tab.active{background:rgba(255,255,255,.1);color:#fff}
.ew-tab-badge{background:rgba(239,68,68,.7);color:#fff;font-size:9px;border-radius:20px;padding:1px 5px;font-weight:800}

/* Live alerts */
.ew-alert-item{display:flex;gap:14px;padding:14px 16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:12px;margin-bottom:8px;transition:all .2s;align-items:flex-start}
.ew-alert-item:hover{border-color:rgba(255,255,255,.14);background:rgba(255,255,255,.05)}
.ew-alert-item.sev-critical{border-left:3px solid #ef4444}
.ew-alert-item.sev-warning{border-left:3px solid #f59e0b}
.ew-alert-item.sev-info{border-left:3px solid #3b82f6}
.ew-alert-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;margin-top:5px}
.ew-alert-dot.critical{background:#ef4444;box-shadow:0 0 8px #ef444488;animation:bk 1.5s infinite}
.ew-alert-dot.warning{background:#f59e0b;box-shadow:0 0 6px #f59e0b66}
.ew-alert-dot.info{background:#3b82f6}
.ew-alert-dot.done{background:#374151}
.ew-alert-station{font-size:11px;font-weight:700;color:rgba(255,255,255,.7);margin-bottom:2px}
.ew-alert-desc{font-size:11px;color:rgba(255,255,255,.42);line-height:1.5}
.ew-alert-meta{display:flex;gap:8px;margin-top:5px;flex-wrap:wrap;align-items:center}
.ew-alert-val{font-size:13px;font-weight:800;color:#fff}
.ew-alert-thresh{font-size:10px;color:rgba(255,255,255,.35)}
.ew-alert-time{font-size:10px;color:rgba(255,255,255,.3);margin-left:auto}

/* Rule engine table */
.ew-rules-table{width:100%;border-collapse:collapse}
.ew-rules-table th{font-size:10px;font-weight:700;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.07em;padding:8px 12px;text-align:left;border-bottom:1px solid rgba(255,255,255,.07)}
.ew-rules-table td{padding:10px 12px;font-size:12px;border-bottom:1px solid rgba(255,255,255,.05);vertical-align:middle}
.ew-rules-table tr:hover td{background:rgba(255,255,255,.03)}
.ew-channel-chip{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:20px;font-size:10px;font-weight:600;margin:1px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.6)}

/* Risk matrix */
.ew-matrix-wrap{overflow-x:auto}
.ew-matrix{border-collapse:collapse;min-width:600px;width:100%}
.ew-matrix th{font-size:11px;font-weight:700;color:rgba(255,255,255,.45);padding:8px 16px;text-align:center;border-bottom:1px solid rgba(255,255,255,.07)}
.ew-matrix th:first-child{text-align:left}
.ew-matrix td{padding:9px 16px;text-align:center;border-bottom:1px solid rgba(255,255,255,.05);font-size:12px;font-weight:700}
.ew-matrix td:first-child{text-align:left;font-weight:500;color:rgba(255,255,255,.7)}
.ew-risk-cell{display:inline-flex;align-items:center;justify-content:center;width:38px;height:24px;border-radius:6px;font-size:12px;font-weight:800}
.risk-1{background:rgba(16,185,129,.18);color:#34d399}
.risk-2{background:rgba(234,179,8,.12);color:#facc15}
.risk-3{background:rgba(251,146,60,.18);color:#fb923c}
.risk-4{background:rgba(239,68,68,.22);color:#f87171}
.risk-5{background:rgba(239,68,68,.4);color:#fff;animation:bk 2s infinite}

/* Channels */
.ew-channel-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:16px;margin-bottom:12px}
.ew-channel-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.ew-channel-name{font-size:13px;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px}
.ew-toggle{width:38px;height:22px;border-radius:11px;border:none;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0}
.ew-toggle.on{background:rgba(16,185,129,.7)}
.ew-toggle.off{background:rgba(100,116,139,.4)}
.ew-toggle::after{content:'';position:absolute;width:16px;height:16px;background:#fff;border-radius:50%;top:3px;transition:left .2s}
.ew-toggle.on::after{left:19px}
.ew-toggle.off::after{left:3px}

/* Trend mini spark */
.ew-spark{display:flex;align-items:flex-end;gap:2px;height:32px}
.ew-spark-bar{width:6px;border-radius:2px 2px 0 0;background:rgba(139,92,246,.5);transition:height .3s}

/* Decision panel */
.ew-decision-card{background:linear-gradient(135deg,rgba(239,68,68,.08) 0%,rgba(139,92,246,.08) 100%);border:1px solid rgba(239,68,68,.25);border-radius:14px;padding:16px;margin-bottom:12px}
.ew-decision-title{font-size:13px;font-weight:800;color:#f87171;margin-bottom:8px;display:flex;align-items:center;gap:7px}
.ew-decision-step{display:flex;align-items:flex-start;gap:10px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.05)}
.ew-decision-step:last-child{border:none}
.ew-step-num{width:20px;height:20px;border-radius:50%;background:rgba(139,92,246,.3);color:#a78bfa;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ew-step-text{font-size:12px;color:rgba(255,255,255,.7);line-height:1.5}
.ew-step-action{display:inline-block;padding:2px 8px;border-radius:5px;font-size:10px;font-weight:700;margin-top:3px;background:rgba(139,92,246,.2);color:#a78bfa}
</style>

<div class="ew-page">
  <!-- Header -->
  <div class="ew-topbar">
    <div>
      <div class="ew-title">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="rgba(239,68,68,.15)"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        Cảnh báo sớm & Hỗ trợ quyết định
      </div>
      <div class="ew-subtitle">Hệ thống giám sát ngưỡng tự động — Cảnh báo đa kênh — AI hỗ trợ phán quyết</div>
    </div>
    <button class="btn btn-primary" onclick="ewOpenNewRule()">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Thiết lập ngưỡng mới
    </button>
  </div>

  <!-- KPIs -->
  <div class="ew-kpis">
    <div class="ew-kpi" style="--kc:rgba(239,68,68,.12)">
      <div class="ew-kpi-val" style="color:#f87171">${activeCount}</div>
      <div class="ew-kpi-lbl">Cảnh báo chưa xử lý</div>
      <div class="ew-kpi-sub">Cần xử lý ngay</div>
    </div>
    <div class="ew-kpi" style="--kc:rgba(239,68,68,.08)">
      <div class="ew-kpi-val" style="color:#fca5a5">${criticalCount}</div>
      <div class="ew-kpi-lbl">Mức Nghiêm trọng</div>
      <div class="ew-kpi-sub">Đang xử lý: ${handlingCount} sự cố</div>
    </div>
    <div class="ew-kpi" style="--kc:rgba(139,92,246,.08)">
      <div class="ew-kpi-val" style="color:#a78bfa">${EW_RULES.filter(r=>r.active).length}</div>
      <div class="ew-kpi-lbl">Quy tắc đang giám sát</div>
      <div class="ew-kpi-sub">${EW_RULES.length} quy tắc tổng cộng</div>
    </div>
    <div class="ew-kpi" style="--kc:rgba(14,165,233,.08)">
      <div class="ew-kpi-val" style="color:#38bdf8">1.2s</div>
      <div class="ew-kpi-lbl">Độ trễ truyền tin</div>
      <div class="ew-kpi-sub">Sensor → Trung tâm</div>
    </div>
  </div>

  <!-- Tabs -->
  <div class="ew-tabs">
    <button class="ew-tab ${ewState.tab==='alerts'?'active':''}" onclick="ewTab('alerts')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      Cảnh báo hiện hành
      ${activeCount>0?`<span class="ew-tab-badge">${activeCount}</span>`:''}
    </button>
    <button class="ew-tab ${ewState.tab==='rules'?'active':''}" onclick="ewTab('rules')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      Cài đặt Cảnh báo
    </button>
    <button class="ew-tab ${ewState.tab==='matrix'?'active':''}" onclick="ewTab('matrix')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
      Ma trận rủi ro
    </button>
    <button class="ew-tab ${ewState.tab==='channels'?'active':''}" onclick="ewTab('channels')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.91 5.91l.72-.72a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      Kênh cảnh báo
    </button>
  </div>

  <!-- Content -->
  <div id="ewContent">${ewRenderTab()}</div>
</div>`;
}

function ewTab(tab) { ewState.tab = tab; document.getElementById('ewContent').innerHTML = ewRenderTab(); }

function ewRenderTab() {
  if (ewState.tab === 'alerts')   return ewRenderAlerts();
  if (ewState.tab === 'rules')    return ewRenderRules();
  if (ewState.tab === 'matrix')   return ewRenderMatrix();
  if (ewState.tab === 'channels') return ewRenderChannels();
  return '';
}

// ── Tab: Live Alerts ───────────────────────────────────────────────
function ewRenderAlerts() {
  const statusLabel = { new:'<span style="color:#f87171;font-weight:700;font-size:10px">MỚI</span>', handling:'<span style="color:#fbbf24;font-weight:700;font-size:10px">ĐANG XỬ LÝ</span>', done:'<span style="color:#6b7280;font-weight:700;font-size:10px">XONG</span>' };
  return `
  <div style="display:grid;grid-template-columns:1fr 300px;gap:16px;align-items:start">
    <div>
      <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.38);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">
        Phiên trực hôm nay — ${new Date().toLocaleDateString('vi-VN')}
      </div>
      ${EW_ALERTS.map(a => `
      <div class="ew-alert-item sev-${a.severity}">
        <div class="ew-alert-dot ${a.status==='done'?'done':a.severity}"></div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
            <div class="ew-alert-station">${a.station}</div>
            ${statusLabel[a.status]||''}
            <div class="ew-alert-time">${a.time}</div>
          </div>
          <div class="ew-alert-meta">
            <span class="ew-alert-val">${a.value}</span>
            <span class="ew-alert-thresh">/ Ngưỡng: ${a.threshold}</span>
            ${a.severity==='critical'?'<span style="background:rgba(239,68,68,.2);color:#f87171;padding:1px 7px;border-radius:20px;font-size:10px;font-weight:700">Nghiêm trọng</span>':''}
            ${a.severity==='warning'?'<span style="background:rgba(245,158,11,.15);color:#fbbf24;padding:1px 7px;border-radius:20px;font-size:10px;font-weight:700">Cảnh báo</span>':''}
          </div>
          <div class="ew-alert-desc">${a.desc}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:5px;flex-shrink:0">
          ${a.status!=='done'?`<button class="btn btn-ghost btn-sm" onclick="ewAckAlert('${a.id}')">Xử lý</button>`:''}
          <button class="btn btn-ghost btn-sm" onclick="ewDetailAlert('${a.id}')">Chi tiết</button>
        </div>
      </div>`).join('')}
    </div>

    <!-- Decision panel -->
    <div>
      <div class="ew-decision-card">
        <div class="ew-decision-title">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 12l4-4"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>
          AI khuyến nghị ứng phó
        </div>
        <div class="ew-decision-step">
          <div class="ew-step-num">1</div>
          <div class="ew-step-text">Kích hoạt <b>Phương án lũ Sông Hồng mức BĐ I</b> tại các huyện ven sông
            <button class="ew-step-action" style="border:none;cursor:pointer" onclick="navigate('pctt_command')">Đã có phương án → mở PCTT</button>
          </div>
        </div>
        <div class="ew-decision-step">
          <div class="ew-step-num">2</div>
          <div class="ew-step-text">Điều tiết hồ chứa Tuy Lai: <b>tăng lưu lượng xả</b> xuống hạ lưu
            <button class="ew-step-action" style="border:none;cursor:pointer" onclick="navigate('scada')">Giao SCADA → lệnh xả</button>
          </div>
        </div>
        <div class="ew-decision-step">
          <div class="ew-step-num">3</div>
          <div class="ew-step-text">Phát cảnh báo qua <b>loa truyền thanh + Zalo</b> tại Ứng Hòa, Mỹ Đức
            <button class="ew-step-action" style="border:none;cursor:pointer" onclick="navigate('workflows')">Kích hoạt Workflow TTS</button>
          </div>
        </div>
        <div class="ew-decision-step">
          <div class="ew-step-num">4</div>
          <div class="ew-step-text">Điều phối <b>Đội ứng cứu số 2</b> đến Ba Thá — ETA ~45 phút
            <button class="ew-step-action" style="border:none;cursor:pointer" onclick="navigate('gis')">Xem GIS định vị</button>
          </div>
        </div>
        <div class="ew-decision-step">
          <div class="ew-step-num">5</div>
          <div class="ew-step-text">Dự báo: Mực nước Sông Hồng đạt <b>BĐ II trong ~4h</b> nếu mưa tiếp tục
            <span class="ew-step-action">Xem biểu đồ xu hướng</span>
          </div>
        </div>
      </div>

      <!-- Trend spark mini chart (9h qua) -->
      <div class="card" style="padding:14px">
        <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);margin-bottom:10px;display:flex;align-items:center;gap:6px">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          Xu hướng mực nước — Sông Hồng (9h)
        </div>
        <div class="ew-spark" style="align-items:flex-end;padding:4px 0">
          ${[35,38,42,41,48,52,58,65,72,78,85,89,91,95,98].map((v,i) => `
            <div class="ew-spark-bar" style="height:${v*0.3}px;width:${100/15}%;background:${v>=90?'rgba(239,68,68,.7)':v>=60?'rgba(245,158,11,.6)':'rgba(139,92,246,.45)'}"></div>
          `).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;font-size:9px;color:rgba(255,255,255,.25);margin-top:4px">
          <span>−9h</span><span>−6h</span><span>−3h</span><span>Hiện tại: <b style="color:#f87171">9.82m</b></span>
        </div>
        <div style="font-size:10px;color:rgba(255,255,255,.35);margin-top:8px">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
          Ngưỡng BĐ I: 9.5m — Ngưỡng BĐ II: 11.5m
        </div>
      </div>
    </div>
  </div>`;
}

// ── Tab: Alert Settings (Rule Engine) ─────────────────────────────
function ewRenderRules() {
  const chanIcons = {
    app:   `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/></svg>`,
    sms:   `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    email: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    zalo:  `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>`,
    tts:   `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
    scada: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06"/></svg>`,
  };
  return `
  <div class="card">
    <div class="card-header">
      <span class="card-title">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        Ma trận Ngưỡng & Quy tắc Cảnh báo
      </span>
    </div>
    <div class="table-wrap">
      <table class="ew-rules-table">
        <thead><tr>
          <th>Tên quy tắc</th><th>Trạm</th><th>Thông số</th><th>Điều kiện</th><th>Mức độ</th><th>Kênh gửi</th><th>Trạng thái</th><th></th>
        </tr></thead>
        <tbody>
          ${EW_RULES.map(r=>`
          <tr>
            <td style="font-weight:600;color:#fff">${r.name}</td>
            <td><span class="badge badge-gray" style="font-size:10px">${r.station}</span></td>
            <td style="font-size:11px;color:rgba(255,255,255,.6)">${r.param}</td>
            <td style="font-family:monospace;color:var(--cyan);font-size:12px;font-weight:700">${r.op} ${r.val}</td>
            <td>${r.severity==='critical'?'<span class="badge badge-red">Nghiêm trọng</span>':'<span class="badge badge-yellow">Cảnh báo</span>'}</td>
            <td>${r.channels.map(c=>`<span class="ew-channel-chip">${chanIcons[c]||''} ${c}</span>`).join('')}</td>
            <td>
              <div style="display:flex;align-items:center;gap:6px">
                <div class="pulse-dot ${r.active?'green':'gray'}"></div>
                <span style="font-size:11px;color:${r.active?'var(--text)':'var(--muted)'}">${r.active?'Đang chạy':'Tắt'}</span>
              </div>
            </td>
            <td>
              <button class="btn btn-ghost btn-sm" onclick="ewOpenNewRule('${r.id}')">Sửa</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

// ── Tab: Risk Matrix ───────────────────────────────────────────────
function ewRenderMatrix() {
  function cell(v) {
    return `<td><span class="ew-risk-cell risk-${v}">${v}</span></td>`;
  }
  const legend = [1,2,3,4,5].map(v=>`<span class="ew-risk-cell risk-${v}" style="margin-right:8px">${v}</span>`).join('');
  return `
  <div class="card">
    <div class="card-header">
      <span class="card-title">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        Ma trận Rủi ro theo Quận/Huyện × Loại thiên tai
      </span>
      <div style="font-size:11px;color:rgba(255,255,255,.35)">
        ${legend}
        <span style="color:rgba(255,255,255,.35);font-size:10px"> 1=Thấp → 5=Rất cao</span>
      </div>
    </div>
    <div class="ew-matrix-wrap">
      <table class="ew-matrix">
        <thead><tr>
          <th>Quận / Huyện</th>
          <th>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" style="vertical-align:middle;margin-right:4px"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>
            Lũ lụt
          </th>
          <th>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" style="vertical-align:middle;margin-right:4px"><path d="M12 2v20M2 8h20M2 16h20"/></svg>
            Ngập úng
          </th>
          <th>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="2" style="vertical-align:middle;margin-right:4px"><path d="M2.5 21l19-9L2.5 3v7l15 2-15 2v7z"/></svg>
            Sạt lở
          </th>
          <th>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2" style="vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
            Hạn hán
          </th>
          <th style="text-align:center;font-size:10px">Tổng điểm rủi ro</th>
        </tr></thead>
        <tbody>
          ${EW_RISK.map(r=>{
            const total = r.flood+r.waterlog+r.landslide+r.drought;
            const totalColor = total>=14?'#f87171':total>=10?'#fbbf24':'#34d399';
            return `<tr>
              <td>${r.district}</td>
              ${cell(r.flood)}${cell(r.waterlog)}${cell(r.landslide)}${cell(r.drought)}
              <td><span style="font-weight:900;color:${totalColor};font-size:15px">${total}</span><span style="font-size:10px;color:rgba(255,255,255,.3)">/20</span></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    <div style="padding:12px 16px;font-size:11px;color:rgba(255,255,255,.35);border-top:1px solid rgba(255,255,255,.06)">
      Cập nhật theo dữ liệu lịch sử 10 năm và dự báo khí tượng thủy văn. Màu đỏ blink = mức rất cao, ưu tiên bố trí lực lượng.
    </div>
  </div>`;
}

// ── Tab: Alert Channels ────────────────────────────────────────────
function ewRenderChannels() {
  const channels = [
    { id:'app',   name:'Ứng dụng (Push notification)', on:true,  icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>', desc:'Gửi thông báo đến ứng dụng di động của toàn bộ cán bộ thuộc role được cấu hình', extra:'Target: DIRECTOR, DISPATCHER, TECHNICIAN' },
    { id:'sms',   name:'SMS (Tin nhắn điện thoại)', on:true,  icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>', desc:'Gửi SMS qua cổng Viettel/VNPT tới danh sách số điện thoại đã cấu hình', extra:'Cổng: Viettel — Giới hạn 160 ký tự' },
    { id:'email', name:'Email (SMTP)', on:true,  icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>', desc:'Email HTML đầy đủ thông tin kèm biểu đồ. Gửi cho lãnh đạo khi mức Nghiêm trọng', extra:'SMTP: smtp.gov.vn — TLS port 587' },
    { id:'zalo',  name:'Zalo ZNS (Nhóm zalo thông báo)', on:true,  icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>', desc:'ZNS Template gửi vào nhóm Zalo Ban chỉ đạo PCTT Hà Nội', extra:'Group ID: pctt_hanoi_2026 — Template: flood_alert_v2' },
    { id:'tts',   name:'Loa truyền thanh (TTS)', on:false, icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>', desc:'Phát qua hệ thống loa truyền thanh cấp xã/phường. Chỉ áp dụng cảnh báo mức Nghiêm trọng', extra:'Vùng phát: Cấu hình theo quận/huyện' },
    { id:'scada', name:'SCADA (Lệnh tự động)', on:false, icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06"/></svg>', desc:'Tự động gửi lệnh điều khiển sang SCADA khi vượt BĐ III. Cần phê duyệt từ lãnh đạo', extra:'⚠️ Cần kích hoạt thủ công — Chưa tự động hoá' },
  ];
  return channels.map(ch=>`
  <div class="ew-channel-card">
    <div class="ew-channel-header">
      <div class="ew-channel-name">
        <span style="color:rgba(255,255,255,.6)">${ch.icon}</span>
        ${ch.name}
      </div>
      <button class="ew-toggle ${ch.on?'on':'off'}" onclick="ewToggleChan(this)" title="Bật/tắt kênh cảnh báo này"></button>
    </div>
    <div style="font-size:12px;color:rgba(255,255,255,.45);margin-bottom:6px;line-height:1.6">${ch.desc}</div>
    <div style="font-size:11px;color:rgba(255,255,255,.3);font-family:monospace">${ch.extra}</div>
  </div>`).join('');
}

// ── Actions ────────────────────────────────────────────────────────
function ewToggleChan(btn) {
  btn.classList.toggle('on'); btn.classList.toggle('off');
  if (typeof showToast === 'function') showToast('Đã cập nhật kênh cảnh báo', 'success');
}
function ewAckAlert(id) {
  const a = EW_ALERTS.find(x=>x.id===id); if (!a) return;
  a.status = 'handling';
  document.getElementById('ewContent').innerHTML = ewRenderTab();
  if (typeof showToast === 'function') showToast('Đã nhận xử lý cảnh báo', 'success');
}
function ewDetailAlert(id) {
  const a = EW_ALERTS.find(x=>x.id===id); if (!a) return;
  if (typeof showToast === 'function') showToast(`Chi tiết: ${a.station} — ${a.value}`, 'info');
}
function ewOpenNewRule() {
  if (typeof showToast === 'function') showToast('Mở form thiết lập ngưỡng mới...', 'info');
}
