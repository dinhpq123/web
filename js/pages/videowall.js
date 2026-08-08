// ══════════════════════════════════════════════════════════════════
// VIDEO WALL & KIOSK MODE MODULE – Hadiwa IOC
// ══════════════════════════════════════════════════════════════════

// ── STATE ──────────────────────────────────────────────────────────
let vwLayoutMode = '1p4'; // '2x2', '3x2', '1p4' (1 main + 4 side), '1p3'
let vwScenario = 'overview'; // 'overview', 'security', 'scada', 'water'
let vwIsKiosk = false;
let vwTimer = null;

const VW_LAYOUTS = [
  { id: '1p4', label: '1 Chính + 4 Phụ', cols: 3, rows: 2, css: 'grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 1fr 1fr;', firstSpan: 'grid-row: 1 / span 2;' },
  { id: '2x2', label: 'Lưới 2×2', cols: 2, rows: 2, css: 'grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr;', firstSpan: '' },
  { id: '3x2', label: 'Lưới 3×2', cols: 3, rows: 2, css: 'grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr;', firstSpan: '' },
  { id: '1p3', label: '1 Chính + 3 Phụ', cols: 2, rows: 3, css: 'grid-template-columns: 2fr 1fr; grid-template-rows: 1fr 1fr 1fr;', firstSpan: 'grid-row: 1 / span 3;' },
];

const VW_SCENARIOS = [
  { id: 'overview', title: 'Tổng quan Điều hành PCTT', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>', desc: 'Bản đồ Đê điều + Biểu đồ Thủy văn + Camera Trực PCTT + KPI Cảnh báo' },
  { id: 'security', title: 'Giám sát Xung yếu', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', desc: 'Camera CCTV Đê điều (Trọng điểm) + Nhật ký Sự cố Hiện trường' },
  { id: 'scada', title: 'Thủy văn & Hồ chứa', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>', desc: 'Mực nước + Lưu lượng xả + Hiện trạng các hồ Mỹ Đức, Ba Vì' },
  { id: 'water', title: 'Tác nghiệp Ưng trực', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 2C12 2 4 10 4 14a8 8 0 0016 0C20 10 12 2 12 2z"/></svg>', desc: 'Điều động nhân lực + Phương tiện + Vật tư kho + Camera Đội ƯCSC' }
];

// Blocks generation based on layout and scenario
function vwGetBlocks(layoutId, scenarioId) {
  const layout = VW_LAYOUTS.find(l => l.id === layoutId);
  const count = layout.id === '1p4' ? 5 : layout.id === '1p3' ? 4 : layout.cols * layout.rows;
  const blocks = [];

  const addBlock = (type, title) => blocks.push({ type, title });

  if (scenarioId === 'overview') {
    addBlock('map', 'Bản đồ Giám sát Đê điều (Live)');
    addBlock('kpi', 'Chỉ số PCTT Tổng hợp');
    addBlock('camera_rand', 'Camera – Trạm trực PCTT');
    addBlock('scada_chart', 'Biểu đồ Mực nước & Lượng mưa');
    addBlock('incidents', 'Cảnh báo Lũ & Sự cố Đê');
    addBlock('camera_rand', 'Camera – Cống / Trạm bơm');
  } else if (scenarioId === 'security') {
    addBlock('camera_gate', 'Camera – Điểm xung yếu #1');
    addBlock('camera_perimeter', 'Camera – Hành lang bảo vệ đê');
    addBlock('camera_chemical', 'Camera – Kho Vật tư PCTT');
    addBlock('camera_pump', 'Camera – Trạm Bơm Tiêu');
    addBlock('incidents', 'Nhật ký Hiện trường (Live)');
    addBlock('camera_rand', 'Camera – UAV Giám sát');
  } else if (scenarioId === 'scada') {
    addBlock('scada_iframe', 'Giám sát Thủy văn Hà Nội');
    addBlock('scada_kpi', 'Hồ Tuy Lai (Mỹ Đức)');
    addBlock('scada_kpi_2', 'Hồ Suối Hai (Ba Vì)');
    addBlock('map', 'Bản đồ Ngập lụt (GIS)');
    addBlock('camera_pump', 'Camera – Trạm Bơm Đầu mối');
    addBlock('incidents', 'Lịch sử Mực nước');
  } else {
    // water -> Logistics/Response
    addBlock('kpi_nrw', 'Lực lượng & Phương tiện');
    addBlock('water_quality', 'Vật tư Kho (Bao cát, Rọ đá)');
    addBlock('map', 'Bản đồ Hiệp đồng Ứng cứu');
    addBlock('camera_lab', 'Camera – Đội ƯCSC số 3');
    addBlock('incidents', 'Lệnh Điều động Khẩn');
    addBlock('camera_rand', 'Camera – Tuyến đê Hữu Hồng');
  }

  // trim or pad to fit layout
  return blocks.slice(0, count).concat(Array(Math.max(0, count - blocks.length)).fill({ type: 'empty', title: 'Trống' }));
}

// ── RENDER BLOCKS ──────────────────────────────────────────────────
function vwRenderContent(block) {
  const t = block.type;
  if (t === 'map') {
    return `<iframe src="https://gis.hadiwa.com.vn/Home/Gis" style="width:100%;height:100%;border:none;background:var(--bg-base)" allowfullscreen></iframe>`;
  }
  if (t === 'scada_iframe') {
    return `<iframe src="https://gis.hadiwa.com.vn/Home/Index" style="width:100%;height:100%;border:none;background:var(--bg-base)" allowfullscreen></iframe>`;
  }
  if (t.startsWith('camera')) {
    let imgKey = 'gate_online';
    if (t === 'camera_perimeter') imgKey = 'perimeter';
    else if (t === 'camera_chemical') imgKey = 'chemical';
    else if (t === 'camera_pump' || t === 'camera_lab') imgKey = 'pump_room';
    else imgKey = ['gate_online', 'pump_room', 'reservoir', 'control_room'][Math.floor(Math.random() * 4)];
    const imgUrl = CAM_IMAGES ? CAM_IMAGES[imgKey] : '';
    return `<div style="width:100%;height:100%;position:relative;background:var(--bg-base)">
      <img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover;opacity:0.8">
      <div style="position:absolute;top:8px;left:8px;display:flex;align-items:center;gap:5px"><div class="pulse-dot red" style="width:8px;height:8px"></div><span style="color:#ff1744;font-size:10px;font-weight:700">REC</span></div>
      <div style="position:absolute;bottom:8px;left:8px;color:rgba(255,255,255,.8);font-size:10px;font-family:monospace" class="vw-time">20:26:00</div>
    </div>`;
  }
  if (t === 'kpi' || t === 'scada_kpi' || t === 'scada_kpi_2' || t === 'water_quality') {
    const vals = [
      { l: 'Mực nước S.Hồng', v: '4.82 m', c: 'var(--primary)' },
      { l: 'Lượng mưa 24h', v: '42 mm', c: 'var(--success)' },
      { l: 'Hồ Tuy Lai', v: '19.2 m', c: 'var(--warning)' },
      { l: 'Cảnh báo Đê', v: '2 Đang mở', c: 'var(--danger)' }
    ];
    return `<div style="padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:15px;height:100%;align-content:center;background:var(--bg-card)">
      ${vals.map(x => `<div style="background:var(--bg-secondary);padding:15px;border-radius:8px;border:1px solid var(--border);text-align:center">
        <div style="font-size:12px;color:var(--muted);margin-bottom:5px">${x.l}</div>
        <div style="font-size:24px;font-weight:700;color:${x.c}">${x.v}</div>
      </div>`).join('')}
    </div>`;
  }
  if (t === 'incidents') {
    return `<div style="padding:15px;height:100%;display:flex;flex-direction:column;gap:10px;overflow:hidden">
      ${[1, 2, 3, 4, 5].map(i => `
      <div style="display:flex;align-items:center;padding:10px;background:rgba(255,23,68,.05);border-left:3px solid var(--danger);border-radius:4px">
        <div style="font-size:11px;color:var(--muted);width:50px">10:${50 - i}</div>
        <div style="font-size:12px;color:var(--text);flex:1">Cảnh báo mực nước cao - Trạm ${i}</div>
      </div>`).join('')}
    </div>`;
  }
  if (t === 'scada_chart' || t === 'kpi_nrw') {
    return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;background:var(--bg-card)">
      <div style="width:80%;height:60%;border-bottom:1px solid var(--border);border-left:1px solid var(--border);position:relative">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%;overflow:visible">
          <polyline points="0,80 20,70 40,75 60,40 80,45 100,20" fill="none" stroke="var(--primary)" stroke-width="2"/>
          <polyline points="0,90 20,85 40,88 60,60 80,70 100,50" fill="none" stroke="var(--success)" stroke-width="2"/>
        </svg>
      </div>
      <div style="display:flex;gap:15px;margin-top:10px">
        <span style="font-size:10px;color:var(--primary)">● Mực nước</span>
        <span style="font-size:10px;color:var(--success)">● Lượng mưa</span>
      </div>
    </div>`;
  }
  return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--muted)">Empty Block</div>`;
}

// ── FULLSCREEN TOGGLE ──────────────────────────────────────────────
function vwToggleKiosk() {
  vwIsKiosk = !vwIsKiosk;
  const layout = VW_LAYOUTS.find(l => l.id === vwLayoutMode);

  if (vwIsKiosk) {
    if (!document.documentElement.requestFullscreen) {
      alert("Trình duyệt không hỗ trợ Fullscreen API");
    } else {
      document.documentElement.requestFullscreen().catch(e => console.log(e));
    }
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
  vwRefresh();
}

// Listen for escape key or native exiting
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && vwIsKiosk) {
    vwIsKiosk = false;
    vwRefresh();
  }
});

// ── MAIN RENDER ────────────────────────────────────────────────────
function vwRefresh() {
  const area = document.getElementById('contentArea');
  if (area) {
    area.innerHTML = `<div class="fade-in" style="${vwIsKiosk ? 'height:100vh;margin:-20px' : ''}">${renderVideoWall()}</div>`;
    window.afterRender_videowall?.();
  }
}

function renderVideoWall() {
  const layout = VW_LAYOUTS.find(l => l.id === vwLayoutMode);
  const blocks = vwGetBlocks(vwLayoutMode, vwScenario);

  // Custom styles for kiosk mode dynamically applied to body
  if (vwIsKiosk) {
    document.body.classList.add('vw-kiosk-active');
  } else {
    document.body.classList.remove('vw-kiosk-active');
  }

  const kioskStyles = `
    <style>
      body.vw-kiosk-active .sidebar { display: none !important; }
      body.vw-kiosk-active .app-header { display: none !important; }
      body.vw-kiosk-active .main-content { margin-left: 0 !important; width: 100vw !important; height: 100vh !important; padding: 0 !important; }
      body.vw-kiosk-active #contentArea { height: 100vh !important; border-radius: 0 !important; margin: 0 !important; max-width: 100% !important; }
      .vw-grid { display: grid; gap: ${vwIsKiosk ? '8px' : '12px'}; height: ${vwIsKiosk ? '100vh' : 'calc(100vh - 280px)'}; background: ${vwIsKiosk ? '#0B1D33' : 'transparent'}; padding: ${vwIsKiosk ? '8px' : '0'}; }
      .vw-block { background: var(--bg-card); border: 1px solid var(--border); border-radius: 6px; overflow: hidden; display: flex; flex-direction: column; position: relative; }
      .vw-block-header { padding: 8px 12px; background: ${vwIsKiosk ? 'rgba(20,45,82,.94)' : 'var(--bg-secondary)'}; color: ${vwIsKiosk ? '#EAF2FF' : 'var(--text)'}; border-bottom: 1px solid var(--border); font-size: 13px; font-weight: 600; display: flex; justify-content: space-between; align-items: center; z-index: 10; position: absolute; top:0; left:0; right:0; backdrop-filter: blur(8px); }
      .vw-block-content { flex: 1; min-height: 0; }
    </style>
  `;

  // UI for normal mode
  const builderUI = !vwIsKiosk ? `
  <div class="page-header" style="margin-bottom:16px">
    <div class="page-title">
      <h1>Video Wall & Kiosk Mode</h1>
      <p>Trình duyệt đa màn hình điều hành trung tâm (Hỗ trợ ghép màn lớn: 4× TV 65" + 1× TV 55")</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-primary" onclick="vwToggleKiosk()" style="gap:8px">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
        Bật Chế Độ Kiosk (Fullscreen)
      </button>
    </div>
  </div>

  <div class="card" style="margin-bottom:20px">
    <div style="padding:16px;display:flex;gap:24px;flex-wrap:wrap">
      
      <!-- Layout Selector -->
      <div style="flex:1;min-width:300px">
        <label style="display:block;font-size:12px;color:var(--muted);margin-bottom:10px;font-weight:600;text-transform:uppercase">1. Chọn Layout (Bố cục)</label>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          ${VW_LAYOUTS.map(l => `
          <div onclick="vwLayoutMode='${l.id}';vwRefresh()" 
               style="cursor:pointer;padding:12px 16px;border-radius:8px;border:1px solid ${vwLayoutMode === l.id ? 'var(--primary)' : 'var(--border)'};background:${vwLayoutMode === l.id ? 'var(--primary-soft)' : 'var(--bg-card)'};transition:all .2s">
            <div style="font-weight:600;color:${vwLayoutMode === l.id ? 'var(--primary)' : 'var(--text)'};margin-bottom:4px">${l.label}</div>
            <div style="font-size:11px;color:var(--muted)">${l.cols} cột × ${l.rows} hàng</div>
          </div>`).join('')}
        </div>
      </div>

      <!-- Scenario Selector -->
      <div style="flex:1.5;min-width:400px">
        <label style="display:block;font-size:12px;color:var(--muted);margin-bottom:10px;font-weight:600;text-transform:uppercase">2. Chọn Kịch bản hiển thị</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          ${VW_SCENARIOS.map(s => `
          <div onclick="vwScenario='${s.id}';vwRefresh()" 
               style="cursor:pointer;display:flex;gap:12px;padding:12px;border-radius:8px;border:1px solid ${vwScenario === s.id ? 'var(--border-active)' : 'var(--border)'};background:${vwScenario === s.id ? 'var(--sidebar-item-active)' : 'var(--bg-card)'};transition:all .2s">
            <div style="font-size:24px;color:${vwScenario === s.id ? 'var(--sidebar-text-active)' : 'var(--text)'}">${s.icon}</div>
            <div>
              <div style="font-weight:600;color:${vwScenario === s.id ? 'var(--sidebar-text-active)' : 'var(--text)'};margin-bottom:2px">${s.title}</div>
              <div style="font-size:11px;color:${vwScenario === s.id ? 'var(--sidebar-text)' : 'var(--muted)'};line-height:1.4;opacity:${vwScenario === s.id ? '.86' : '1'}">${s.desc}</div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>
  ` : '';

  // Grid wrapper
  let gridUI = `<div class="vw-grid" style="${layout.css}">`;
  blocks.forEach((block, idx) => {
    const isFirst = idx === 0;
    gridUI += `
    <div class="vw-block fade-in" style="${isFirst ? layout.firstSpan : ''}">
      <div class="vw-block-header">
        <span>${block.title}</span>
        <button style="background:${vwIsKiosk ? 'rgba(255,255,255,.08)' : 'var(--bg-tertiary)'};border:1px solid var(--border);color:${vwIsKiosk ? '#EAF2FF' : 'var(--muted)'};border-radius:4px;width:20px;height:20px;cursor:pointer">⋮</button>
      </div>
      <div class="vw-block-content" style="padding-top: ${block.type.startsWith('camera') || block.type === 'map' || block.type === 'scada_iframe' ? '0' : '36px'}">
        ${vwRenderContent(block)}
      </div>
    </div>`;
  });
  gridUI += `</div>`;

  // Kiosk mode exit button (overlay)
  const exitBtn = vwIsKiosk ? `
  <button onclick="vwToggleKiosk()" style="position:fixed;top:10px;right:10px;z-index:10000;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.2);color:#fff;padding:8px 12px;border-radius:4px;cursor:pointer;font-size:11px;backdrop-filter:blur(4px);display:flex;align-items:center;gap:6px">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3h13M8 21v-3h13M3 8h3V3m-3 13h3v5"/></svg>
    Thoát Kiosk Mode (ESC)
  </button>` : '';

  return kioskStyles + builderUI + gridUI + exitBtn;
}

window.afterRender_videowall = function () {
  if (vwTimer) clearInterval(vwTimer);
  vwTimer = setInterval(() => {
    document.querySelectorAll('.vw-time').forEach(el => {
      el.textContent = new Date().toLocaleTimeString('vi-VN');
    });
  }, 1000);
};
