// ── HADIWA IOC — Operations Command Center (v5.0) ─────────────────
// Page id: pcttOperations
// Trung tâm điều hành tích hợp: real-time status, resource dispatch,
// cross-module quick-actions, and shift briefing.

let opsTab = 'overview';   // 'overview' | 'resources' | 'dispatch' | 'comms'
let opsShiftBrief = false;

// ── Simulated live data ────────────────────────────────────────────
const OPS_RESOURCES = [
  { id:'ĐP-01', name:'Đội ứng phó 01 — Hà Đông', type:'response', status:'deployed', location:'Đê sông Đáy K+8', strength:12, vehicles:2, lead:'Nguyễn Văn Hùng', lastUpdate:'22:48' },
  { id:'ĐP-02', name:'Đội ứng phó 02 — Chương Mỹ', type:'response', status:'standby', location:'UBND huyện Chương Mỹ', strength:8, vehicles:1, lead:'Trần Thị Vân', lastUpdate:'22:50' },
  { id:'ĐP-03', name:'Đội xung kích Ba Vì', type:'response', status:'deployed', location:'Đê hữu Đáy K+22', strength:15, vehicles:3, lead:'Phạm Quang Đức', lastUpdate:'22:45' },
  { id:'MN-01', name:'Máy bơm dã chiến #1', type:'pump', status:'active', location:'Chương Mỹ — Tân Tiến', strength:0, vehicles:0, output:'1200 m³/h', lastUpdate:'22:51' },
  { id:'MN-02', name:'Máy bơm dã chiến #2', type:'pump', status:'transit', location:'Đang di chuyển → Mỹ Đức', strength:0, vehicles:1, output:'800 m³/h', lastUpdate:'22:49' },
  { id:'TH-01', name:'Trực thăng EC-225 (Vùng 3 HQ)', type:'heli', status:'standby', location:'Gia Lâm', strength:4, vehicles:0, lead:'Đ/c Minh (Quân khu)', lastUpdate:'21:30' },
  { id:'QĐ-01', name:'Quân đội huyện Ba Vì (Trung đội)', type:'military', status:'standby', location:'Thao trường Ba Vì', strength:30, vehicles:5, lead:'Thiếu tá Bình', lastUpdate:'20:00' },
];

const OPS_COMMS_LOG = [
  { time:'22:51', from:'Đội ĐP-01', to:'CHTT IOC', msg:'Điểm sạt K+8+200 đã gia cố xong phần 1, đang nhồi bao cát đoạn 2, cần thêm 500 bao cát.', type:'request' },
  { time:'22:48', from:'CHTT IOC', to:'Kho vật tư Ba Vì', msg:'Cấp phát khẩn 500 bao cát + 20m vải địa kỹ thuật cho Đội ĐP-01, xe tải giao ngay tại K+8.', type:'order' },
  { time:'22:45', from:'Đội ĐP-03', to:'CHTT IOC', msg:'Phát hiện tổ mối lớn tại K+22+800, đề nghị khoan phụt vữa gia cố gấp.', type:'alert' },
  { time:'22:40', from:'UBND Chương Mỹ', to:'CHTT IOC', msg:'Đã sơ tán 240 hộ dân thôn 4, thôn 5 xã Tân Tiến lên điểm tập kết trường THCS. Cần thêm xe vận chuyển.', type:'report' },
  { time:'22:35', from:'CHTT IOC', to:'Tất cả Đội', msg:'NƯỚC SÔN ĐÁY TIẾP TỤC DÂNG — dự kiến đỉnh lũ 05h30 sáng mai. Tăng cường tuần tra đêm.', type:'broadcast' },
  { time:'22:20', from:'Sở Xây dựng HN', to:'CHTT IOC', msg:'Điều 2 xe cẩu + 1 xe thang hỗ trợ khu vực Chương Mỹ. ETA 23:15.', type:'report' },
];

const OPS_SITUATION = {
  alertLevel: 3,
  dikeStatus: { critical: 1, danger: 1, warning: 2, ok: 2 },
  flooded: 1850, // ha
  evacuated: 620, // people
  casualties: 0,
  rainfall6h: 95, // mm
  riverPeak: '05:30 ngày 14/3',
  activePumps: 24,
  lastUpdate: '22:51',
};

const OPS_QUICKACTIONS = [
  { id:'dispatch',  label:'Điều động lực lượng', icon:'M20 10.34V14a8 8 0 01-16 0v-3.66M12 2v6M9 5l3-3 3 3', color:'#f97316' },
  { id:'evacuate',  label:'Phát lệnh sơ tán',    icon:'M17 8l4 4-4 4M3 12h18 M3 6h6M3 18h6', color:'#ef4444' },
  { id:'broadcast', label:'Phát thông báo khẩn', icon:'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z', color:'#a78bfa' },
  { id:'supplies',  label:'Yêu cầu vật tư khẩn', icon:'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12', color:'#10b981' },
  { id:'workorder', label:'Tạo lệnh công tác',    icon:'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z', color:'#38bdf8' },
  { id:'report',    label:'Tạo báo cáo nhanh',   icon:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8', color:'#fbbf24' },
];

// ── Render main ───────────────────────────────────────────────────
function renderPcttOperations() {
  const s = OPS_SITUATION;
  const deployed = OPS_RESOURCES.filter(r => r.status === 'deployed' || r.status === 'active').length;
  const alertColor = s.alertLevel >= 3 ? '#ef4444' : s.alertLevel >= 2 ? '#f59e0b' : '#10b981';

  return `
<style>
.ops-page{padding:16px 20px;max-width:1440px;margin:0 auto}
.ops-status-bar{display:flex;gap:10px;align-items:center;padding:10px 16px;border-radius:12px;margin-bottom:14px;
  background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);flex-wrap:wrap}
.ops-kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:14px}
.ops-kpi{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:12px 14px;text-align:center}
.ops-kpi-val{font-size:26px;font-weight:900;line-height:1}
.ops-kpi-lbl{font-size:10px;color:rgba(255,255,255,.38);font-weight:600;margin-top:3px;text-transform:uppercase;letter-spacing:.05em}
.ops-tabs{display:flex;gap:4px;margin-bottom:14px;background:rgba(255,255,255,.04);border-radius:10px;padding:4px;width:fit-content}
.ops-tab{padding:7px 16px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;color:rgba(255,255,255,.45);border:none;background:transparent;transition:all .2s;display:flex;align-items:center;gap:6px}
.ops-tab.active{background:rgba(255,255,255,.1);color:#fff}
.ops-grid2{display:grid;grid-template-columns:1fr 320px;gap:12px}
.ops-grid3{display:grid;grid-template-columns:2fr 1fr;gap:12px}
.ops-comms-msg{padding:10px 14px;border-bottom:1px solid rgba(255,255,255,.05);font-size:11px}
.ops-comms-msg:last-child{border-bottom:none}
.ops-qa-btn{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 10px;
  border-radius:12px;cursor:pointer;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);
  transition:all .2s;font-size:11px;font-weight:600;color:rgba(255,255,255,.6);text-align:center}
.ops-qa-btn:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.15);transform:translateY(-2px)}
.ops-res-badge{padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700}
@keyframes pulseBadge{0%,100%{opacity:1}50%{opacity:.6}}
.ops-pulse{animation:pulseBadge 2s infinite}
</style>

<div class="ops-page">
  <!-- Alert Status Bar -->
  <div class="ops-status-bar">
    <div class="pulse-dot red ops-pulse"></div>
    <span style="font-size:13px;font-weight:800;color:#ef4444">CẤP ĐỘ ${s.alertLevel} — THIÊN TAI ĐANG XẢY RA</span>
    <span style="background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.3);padding:2px 10px;border-radius:20px;font-size:11px;color:#fca5a5">MỰC NƯỚC SÔNG ĐÁY VƯỢT MD-2</span>
    <span style="background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.3);padding:2px 10px;border-radius:20px;font-size:11px;color:#fca5a5">LŨ QUÉT NGUY CƠ HUYỆN CHƯƠNG MỸ</span>
    <div style="flex:1"></div>
    <span style="font-size:11px;color:rgba(255,255,255,.35)">Cập nhật: ${s.lastUpdate} · Đỉnh lũ: ${s.riverPeak}</span>
  </div>

  <!-- KPI Grid -->
  <div class="ops-kpis">
    <div class="ops-kpi"><div class="ops-kpi-val" style="color:#ef4444">${s.alertLevel}</div><div class="ops-kpi-lbl">Cấp độ thiên tai</div></div>
    <div class="ops-kpi"><div class="ops-kpi-val" style="color:#f97316">${deployed}</div><div class="ops-kpi-lbl">Đơn vị đang triển khai</div></div>
    <div class="ops-kpi"><div class="ops-kpi-val" style="color:#fbbf24">${s.flooded.toLocaleString('vi-VN')}</div><div class="ops-kpi-lbl">Diện tích ngập (ha)</div></div>
    <div class="ops-kpi"><div class="ops-kpi-val" style="color:#a78bfa">${s.evacuated}</div><div class="ops-kpi-lbl">Dân đã sơ tán</div></div>
    <div class="ops-kpi"><div class="ops-kpi-val" style="color:#38bdf8">${s.activePumps}</div><div class="ops-kpi-lbl">Máy bơm hoạt động</div></div>
    <div class="ops-kpi"><div class="ops-kpi-val" style="color:#10b981">${s.casualties}</div><div class="ops-kpi-lbl">Thương vong</div></div>
  </div>

  <!-- Quick Actions -->
  <div style="margin-bottom:14px">
    <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Hành động nhanh</div>
    <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px">
      ${OPS_QUICKACTIONS.map(qa => `
      <button class="ops-qa-btn" onclick="opsQuickAction('${qa.id}')">
        <div style="width:36px;height:36px;border-radius:10px;background:${qa.color}20;border:1px solid ${qa.color}44;display:flex;align-items:center;justify-content:center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${qa.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="${qa.icon}"/>
          </svg>
        </div>
        ${qa.label}
      </button>`).join('')}
    </div>
  </div>

  <!-- Tabs -->
  <div class="ops-tabs">
    <button class="ops-tab ${opsTab==='overview'?'active':''}" onclick="opsSetTab('overview')">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
      Tổng quan
    </button>
    <button class="ops-tab ${opsTab==='resources'?'active':''}" onclick="opsSetTab('resources')">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
      Lực lượng & Phương tiện
    </button>
    <button class="ops-tab ${opsTab==='comms'?'active':''}" onclick="opsSetTab('comms')">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      Nhật ký Thông tin liên lạc
    </button>
    <button class="ops-tab ${opsTab==='briefing'?'active':''}" onclick="opsSetTab('briefing')">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      Giao ban & Chỉ đạo
    </button>
  </div>

  <div id="opsContent">${opsRenderTab()}</div>
</div>`;
}

function opsSetTab(tab) { opsTab = tab; document.getElementById('opsContent').innerHTML = opsRenderTab(); }

function opsRenderTab() {
  if (opsTab === 'overview')   return opsOverview();
  if (opsTab === 'resources')  return opsResources();
  if (opsTab === 'comms')      return opsComms();
  if (opsTab === 'briefing')   return opsBriefing();
  return '';
}

// ── Tab 1: Overview ───────────────────────────────────────────────
function opsOverview() {
  const s = OPS_SITUATION;
  return `
  <div class="ops-grid2">
    <div style="display:flex;flex-direction:column;gap:12px">
      <!-- Dike situation -->
      <div class="card" style="padding:14px">
        <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px">Tình trạng Đê điều</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
          ${[['Khẩn cấp',s.dikeStatus.critical,'#ef4444'],['Nguy hiểm',s.dikeStatus.danger,'#f97316'],
             ['Cảnh báo',s.dikeStatus.warning,'#f59e0b'],['An toàn',s.dikeStatus.ok,'#10b981']].map(([l,v,c])=>`
          <div style="text-align:center;padding:10px;border-radius:10px;background:${c}12;border:1px solid ${c}30">
            <div style="font-size:24px;font-weight:900;color:${c}">${v}</div>
            <div style="font-size:10px;color:${c};font-weight:600;margin-top:2px">${l}</div>
          </div>`).join('')}
        </div>
      </div>
      <!-- Rainfall + Flood status -->
      <div class="card" style="padding:14px">
        <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px">Số liệu thủy văn hiện tại</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:12px">
          ${[['Lượng mưa 6h','#4fc3f7',`${s.rainfall6h} mm`,'Vượt ngưỡng'],['Diện tích ngập','#f59e0b',`${s.flooded.toLocaleString()} ha`,'Chương Mỹ, Mỹ Đức'],['Thời điểm đỉnh lũ','#ef4444',s.riverPeak,'Dự báo sông Đáy']].map(([l,c,v,sub])=>`
          <div style="padding:10px 12px;background:${c}10;border:1px solid ${c}25;border-radius:10px">
            <div style="font-size:10px;color:${c}aa;font-weight:600;margin-bottom:3px">${l}</div>
            <div style="font-size:16px;font-weight:800;color:${c}">${v}</div>
            <div style="font-size:10px;color:rgba(255,255,255,.35);margin-top:2px">${sub}</div>
          </div>`).join('')}
        </div>
      </div>
      <!-- Active incidents summary -->
      <div class="card" style="padding:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.07em">Sự cố đang xử lý</div>
          <button class="btn btn-ghost btn-sm" onclick="navigate('incidents')" style="font-size:11px">Xem tất cả</button>
        </div>
        ${(DATA.incidents||[]).filter(i=>i.status!=='done').slice(0,4).map(i=>`
        <div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05);align-items:flex-start">
          <div class="pulse-dot ${i.severity==='critical'?'red':'yellow'}" style="margin-top:5px;flex-shrink:0"></div>
          <div style="flex:1">
            <div style="font-size:12px;font-weight:600">${i.type}</div>
            <div style="font-size:10px;color:rgba(255,255,255,.4)">${i.location}</div>
          </div>
          <span style="font-size:10px;padding:2px 8px;border-radius:20px;background:${i.status==='processing'?'rgba(245,158,11,.15)':'rgba(239,68,68,.15)'};color:${i.status==='processing'?'#fbbf24':'#f87171'};flex-shrink:0">${i.status==='processing'?'Đang xử lý':'Mới'}</span>
        </div>`).join('')}
      </div>
    </div>
    <!-- Right: comms log preview + resource summary -->
    <div style="display:flex;flex-direction:column;gap:12px">
      <div class="card" style="flex:1;overflow:hidden;display:flex;flex-direction:column">
        <div class="card-header"><span class="card-title">Liên lạc gần đây</span>
          <button class="btn btn-ghost btn-sm" onclick="opsSetTab('comms')" style="font-size:11px">Tất cả</button>
        </div>
        <div style="overflow-y:auto;flex:1">
          ${OPS_COMMS_LOG.slice(0,4).map(m=>{
            const typeColor = {alert:'#ef4444',order:'#38bdf8',request:'#fbbf24',broadcast:'#a78bfa',report:'#10b981'}[m.type]||'#6b7280';
            return `<div class="ops-comms-msg">
              <div style="display:flex;gap:6px;align-items:center;margin-bottom:3px">
                <span style="font-size:9px;font-family:monospace;color:rgba(255,255,255,.35)">${m.time}</span>
                <span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:20px;background:${typeColor}20;color:${typeColor}">${{alert:'CẢNH BÁO',order:'CHỈ ĐẠO',request:'YÊU CẦU',broadcast:'PHÁT SÓNG',report:'BÁO CÁO'}[m.type]}</span>
                <span style="font-size:10px;color:rgba(255,255,255,.5)">${m.from}</span>
              </div>
              <div style="font-size:11px;color:rgba(255,255,255,.7);line-height:1.4">${m.msg.substring(0,80)}${m.msg.length>80?'…':''}</div>
            </div>`;
          }).join('')}
        </div>
      </div>
      <div class="card" style="padding:14px">
        <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.07em;margin-bottom:8px">Tóm tắt lực lượng</div>
        ${[['Đang triển khai','deployed','#f97316'],['Chờ sẵn','standby','#38bdf8'],['Đang di chuyển','transit','#fbbf24'],['Đang hoạt động','active','#10b981']].map(([l,st,c])=>{
          const cnt = OPS_RESOURCES.filter(r=>r.status===st).length;
          return cnt > 0 ? `<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.05)">
            <div style="display:flex;align-items:center;gap:6px">
              <div style="width:8px;height:8px;border-radius:50%;background:${c}"></div>
              <span style="font-size:12px">${l}</span>
            </div>
            <span style="font-size:14px;font-weight:800;color:${c}">${cnt}</span>
          </div>` : '';
        }).join('')}
      </div>
    </div>
  </div>`;
}

// ── Tab 2: Resources ──────────────────────────────────────────────
function opsResources() {
  const statusColor = { deployed:'#f97316', standby:'#38bdf8', active:'#10b981', transit:'#fbbf24' };
  const statusLabel = { deployed:'Đang triển khai', standby:'Chờ sẵn', active:'Đang hoạt động', transit:'Di chuyển' };
  const typeIcon = {
    response:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
    pump:'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
    heli:'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    military:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  };
  return `
  <div class="card">
    <div class="card-header">
      <span class="card-title">Lực lượng & Phương tiện — Đang huy động</span>
      <button class="btn btn-primary btn-sm" onclick="opsDispatch()">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10.34V14a8 8 0 01-16 0v-3.66M12 2v6M9 5l3-3 3 3"/></svg>
        Điều động thêm
      </button>
    </div>
    <div class="table-wrap">
      <table style="width:100%;border-collapse:collapse">
        <thead><tr>
          <th style="font-size:10px;font-weight:700;color:rgba(255,255,255,.35);padding:8px 12px;text-align:left;border-bottom:1px solid rgba(255,255,255,.07)">Đơn vị</th>
          <th style="font-size:10px;font-weight:700;color:rgba(255,255,255,.35);padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.07)">Loại</th>
          <th style="font-size:10px;font-weight:700;color:rgba(255,255,255,.35);padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.07)">Trạng thái</th>
          <th style="font-size:10px;font-weight:700;color:rgba(255,255,255,.35);padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.07)">Vị trí</th>
          <th style="font-size:10px;font-weight:700;color:rgba(255,255,255,.35);padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.07)">Quân số / Công suất</th>
          <th style="font-size:10px;font-weight:700;color:rgba(255,255,255,.35);padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.07)">Chỉ huy</th>
          <th style="font-size:10px;font-weight:700;color:rgba(255,255,255,.35);padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.07)">Cập nhật</th>
          <th style="font-size:10px;font-weight:700;color:rgba(255,255,255,.35);padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.07)"></th>
        </tr></thead>
        <tbody>
          ${OPS_RESOURCES.map(r=>{
            const sc = statusColor[r.status]||'#6b7280';
            const sl = statusLabel[r.status]||r.status;
            const icon = typeIcon[r.type]||typeIcon.response;
            return `<tr style="transition:background .15s" onmouseover="this.style.background='rgba(255,255,255,.025)'" onmouseout="this.style.background=''">
              <td style="padding:10px 12px">
                <div style="font-size:12px;font-weight:700;color:#fff">${r.name}</div>
                <div style="font-size:10px;color:rgba(255,255,255,.35);font-family:monospace">${r.id}</div>
              </td>
              <td style="padding:10px 12px;text-align:center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="1.8">
                  <path d="${icon}"/>
                </svg>
              </td>
              <td style="padding:10px 12px">
                <span class="ops-res-badge" style="background:${sc}22;color:${sc};border:1px solid ${sc}44">${sl}</span>
              </td>
              <td style="padding:10px 12px;font-size:11px;color:rgba(255,255,255,.6)">${r.location}</td>
              <td style="padding:10px 12px;font-size:12px;font-weight:700;color:${sc}">${r.strength>0?r.strength+' người':''}${r.output||''}</td>
              <td style="padding:10px 12px;font-size:11px;color:rgba(255,255,255,.5)">${r.lead||'—'}</td>
              <td style="padding:10px 12px;font-size:10px;font-family:monospace;color:rgba(255,255,255,.35)">${r.lastUpdate}</td>
              <td style="padding:10px 12px">
                <button class="btn btn-ghost btn-sm" onclick="opsContactUnit('${r.id}')" style="font-size:11px">Liên lạc</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

// ── Tab 3: Communications Log ─────────────────────────────────────
function opsComms() {
  const typeColor = {alert:'#ef4444',order:'#38bdf8',request:'#fbbf24',broadcast:'#a78bfa',report:'#10b981'};
  const typeLabel = {alert:'CẢNH BÁO',order:'CHỈ ĐẠO',request:'YÊU CẦU',broadcast:'PHÁT SÓNG',report:'BÁO CÁO'};
  return `
  <div class="card" style="padding:0">
    <div class="card-header">
      <span class="card-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        Nhật ký Thông tin liên lạc
      </span>
      <button class="btn btn-primary btn-sm" onclick="opsNewMessage()">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Phát lệnh mới
      </button>
    </div>
    ${OPS_COMMS_LOG.map(m=>{
      const tc = typeColor[m.type]||'#6b7280';
      const tl = typeLabel[m.type]||m.type;
      return `<div class="ops-comms-msg" style="border-left:3px solid ${tc}">
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:4px;flex-wrap:wrap">
          <span style="font-family:monospace;font-size:10px;color:rgba(255,255,255,.35)">${m.time}</span>
          <span style="font-size:10px;font-weight:800;padding:1px 8px;border-radius:20px;background:${tc}20;color:${tc}">${tl}</span>
          <span style="font-size:11px;font-weight:700;color:rgba(255,255,255,.7)">${m.from}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          <span style="font-size:11px;color:rgba(255,255,255,.4)">${m.to}</span>
        </div>
        <div style="font-size:12px;color:rgba(255,255,255,.75);line-height:1.5">${m.msg}</div>
      </div>`;
    }).join('')}
  </div>`;
}

// ── Tab 4: Briefing ───────────────────────────────────────────────
function opsBriefing() {
  const s = OPS_SITUATION;
  return `
  <div class="card" style="padding:20px;max-width:780px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div>
        <div style="font-size:16px;font-weight:800;color:#fff;margin-bottom:2px">Bản giao ban trực chiến — Đêm 13/03/2026</div>
        <div style="font-size:12px;color:rgba(255,255,255,.4)">Cấp có thẩm quyền: Chi cục trưởng Chi cục TT-PCTT Hà Nội</div>
      </div>
      <button class="btn btn-primary" onclick="opsPrintBriefing()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        In / Xuất PDF
      </button>
    </div>
    ${[
      ['1. TÌNH HÌNH THIÊN TAI', `• Cơn bão số 1 gây mưa lớn diện rộng\n• Mực nước sông Đáy tại Quốc Oai: 5.45m (vượt MD-2 0.95m)\n• Lượng mưa 24h: 250mm tại Ba Thá — kỷ lục 50 năm\n• Dự báo đỉnh lũ: 5.65m vào 05:30 ngày 14/3`,'#ef4444'],
      ['2. VỊ TRÍ XỬ LÝ TRỌNG ĐIỂM', `• ĐÊ HỮU ĐÁY K+8+200: Thẩm lậu chân đê — Đội ĐP-01 đang xử lý\n• ĐÊ CỐNG LIÊN MẠC: Hoạt động bình thường\n• CHƯƠNG MỸ (2800ha): Ngập úng, đang vận hành 12 máy bơm tiêu\n• BA VÌ — TẢN LĨNH: Sạt mái taluy — Đội ĐP-03 giải phóng đường`,'#f97316'],
      ['3. LỰC LƯỢNG ĐÃ HUY ĐỘNG', `• 3 đội ứng phó cơ sở (35 người)\n• 24 máy bơm tiêu (13.500 m³/h)\n• 1 xe cẩu + 1 xe thang (Sở Xây dựng, ETA 23:15)\n• Trung đội quân đội Ba Vì: Chờ lệnh điều động`,'#38bdf8'],
      ['4. SƠ TÁN & AN SINH', `• 620 người đã sơ tán (240 hộ Chương Mỹ + các nơi khác)\n• Điểm tập kết: Trường THCS Tân Tiến (đủ lều bạt, nước uống, thuốc)\n• Chưa có thương vong`,'#10b981'],
      ['5. CHỈ ĐẠO TIẾP THEO (Ca đêm)', `• Tăng cường tuần tra đê điều mỗi 30 phút\n• Sẵn sàng phương án B sơ tán thêm nếu mực nước vượt 5.6m\n• Duy trì liên lạc với UBND 4 huyện mỗi giờ\n• Kiểm tra vật tư kho cấp nguồn bổ sung trước 02:00`,'#fbbf24'],
    ].map(([title,content,color])=>`
    <div style="margin-bottom:16px;padding:14px;background:${color}08;border:1px solid ${color}20;border-radius:10px;border-left:3px solid ${color}">
      <div style="font-size:11px;font-weight:800;color:${color};text-transform:uppercase;letter-spacing:.07em;margin-bottom:8px">${title}</div>
      <div style="font-size:12px;color:rgba(255,255,255,.7);white-space:pre-line;line-height:1.7">${content}</div>
    </div>`).join('')}
    <div style="font-size:11px;color:rgba(255,255,255,.3);text-align:center;margin-top:8px">Bản giao ban sinh ra tự động từ dữ liệu hệ thống — ${new Date().toLocaleString('vi-VN')}</div>
  </div>`;
}

// ── Action handlers ────────────────────────────────────────────────
function opsQuickAction(id) {
  const labels = {
    dispatch: 'Mở form điều động lực lượng...',
    evacuate: 'Phát lệnh sơ tán khẩn cấp — đang mở...',
    broadcast: 'Soạn thông báo khẩn gửi đa kênh...',
    supplies: 'Yêu cầu cấp phát vật tư khẩn cấp...',
    workorder: 'Tạo lệnh công tác mới...',
    report: 'Tạo báo cáo nhanh tình hình...',
  };
  if (typeof showToast === 'function') showToast(labels[id] || id, 'info');
}
function opsDispatch() { opsQuickAction('dispatch'); }
function opsContactUnit(id) { if (typeof showToast === 'function') showToast(`Gọi liên lạc ${id}...`, 'info'); }
function opsNewMessage() { if (typeof showToast === 'function') showToast('Soạn thông điệp liên lạc...', 'info'); }
function opsPrintBriefing() {
  if (typeof showToast === 'function') showToast('Đang chuẩn bị bản giao ban PDF...', 'success');
}
