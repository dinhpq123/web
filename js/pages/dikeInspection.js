// ── HADIWA IOC — Phân Loại Đê & Giám Sát Hiện Trạng (PLDGHT) v6.1 ──
// Biểu mẫu chuẩn Chi cục TL & PCTT Hà Nội — Kiểm tra, phân loại đê điều

let diTab = 'overview'; // overview | matrix | form | history

// ── DATA: 15 tuyến đê chính Hà Nội ──────────────────────────────────
const DIKE_INVENTORY = [
  { id:'DD-HH', name:'Đê Hữu Hồng', from_km:'K0+000', to_km:'K99+500', length:99.5, level:1,
    districts:['Ba Đình','Tây Hồ','Bắc Từ Liêm','Đan Phượng','Phúc Thọ','Ba Vì'],
    unit:'Hạt QL Đê Hữu Hồng',
    score:82, grade:'B', repairPct:65, status:'warning',
    items:{ top:'Trung bình', slope_up:'Tốt', slope_down:'Trung bình', berm:'Kém', revetment:'Tốt', culvert:'Trung bình' }
  },
  { id:'DD-TH', name:'Đê Tả Hồng', from_km:'K0+000', to_km:'K44+200', length:44.2, level:1,
    districts:['Hoàn Kiếm','Hoàng Mai','Long Biên','Gia Lâm'],
    unit:'Hạt QL Đê Tả Hồng',
    score:91, grade:'A', repairPct:88, status:'ok',
    items:{ top:'Tốt', slope_up:'Tốt', slope_down:'Tốt', berm:'Trung bình', revetment:'Tốt', culvert:'Tốt' }
  },
  { id:'DD-HD', name:'Đê Hữu Đáy', from_km:'K0+000', to_km:'K82+600', length:82.6, level:2,
    districts:['Đan Phượng','Hoài Đức','Hà Đông','Thanh Oai','Ứng Hòa','Mỹ Đức'],
    unit:'Hạt QL Đê Hữu Đáy',
    score:71, grade:'C', repairPct:42, status:'warning',
    items:{ top:'Kém', slope_up:'Trung bình', slope_down:'Kém', berm:'Kém', revetment:'Trung bình', culvert:'Kém' }
  },
  { id:'DD-TD', name:'Đê Tả Đáy', from_km:'K0+000', to_km:'K61+300', length:61.3, level:2,
    districts:['Thanh Trì','Thường Tín','Phú Xuyên'],
    unit:'Hạt QL Đê Tả Đáy',
    score:78, grade:'B', repairPct:55, status:'warning',
    items:{ top:'Trung bình', slope_up:'Trung bình', slope_down:'Tốt', berm:'Trung bình', revetment:'Kém', culvert:'Trung bình' }
  },
  { id:'DD-HĐ', name:'Đê Hữu Đuống', from_km:'K0+000', to_km:'K38+900', length:38.9, level:1,
    districts:['Long Biên','Gia Lâm'],
    unit:'Hạt QL Đê Hữu Đuống',
    score:88, grade:'A', repairPct:80, status:'ok',
    items:{ top:'Tốt', slope_up:'Tốt', slope_down:'Tốt', berm:'Tốt', revetment:'Tốt', culvert:'Trung bình' }
  },
  { id:'DD-TĐ', name:'Đê Tả Đuống', from_km:'K0+000', to_km:'K46+100', length:46.1, level:1,
    districts:['Đông Anh','Sóc Sơn'],
    unit:'Hạt QL Đê Tả Đuống',
    score:85, grade:'B', repairPct:70, status:'ok',
    items:{ top:'Tốt', slope_up:'Tốt', slope_down:'Trung bình', berm:'Tốt', revetment:'Trung bình', culvert:'Tốt' }
  },
  { id:'DD-LK', name:'Đê La Khê', from_km:'K0+000', to_km:'K18+500', length:18.5, level:3,
    districts:['Hà Đông'],
    unit:'Hạt QL Đê Hà Đông',
    score:66, grade:'C', repairPct:30, status:'danger',
    items:{ top:'Kém', slope_up:'Kém', slope_down:'Kém', berm:'Kém', revetment:'Trung bình', culvert:'Kém' }
  },
  { id:'DD-NH', name:'Đê Nhuệ', from_km:'K0+000', to_km:'K38+200', length:38.2, level:3,
    districts:['Bắc Từ Liêm','Nam Từ Liêm','Hà Đông','Thanh Trì'],
    unit:'Hạt QL Đê Nhuệ',
    score:74, grade:'C', repairPct:48, status:'warning',
    items:{ top:'Trung bình', slope_up:'Kém', slope_down:'Trung bình', berm:'Kém', revetment:'Kém', culvert:'Trung bình' }
  },
  { id:'DD-KD', name:'Đê Kim Đôi', from_km:'K0+000', to_km:'K22+400', length:22.4, level:3,
    districts:['Đông Anh'],
    unit:'Hạt QL Đê Đông Anh',
    score:80, grade:'B', repairPct:60, status:'warning',
    items:{ top:'Trung bình', slope_up:'Tốt', slope_down:'Trung bình', berm:'Trung bình', revetment:'Tốt', culvert:'Trung bình' }
  },
  { id:'DD-CL', name:'Đê Cà Lồ', from_km:'K0+000', to_km:'K29+800', length:29.8, level:3,
    districts:['Sóc Sơn','Mê Linh'],
    unit:'Hạt QL Đê Sóc Sơn',
    score:76, grade:'B', repairPct:52, status:'warning',
    items:{ top:'Trung bình', slope_up:'Trung bình', slope_down:'Tốt', berm:'Trung bình', revetment:'Kém', culvert:'Trung bình' }
  },
];

// ── INSPECTION RECORDS (lịch sử kiểm tra) ────────────────────────
const DIKE_INSPECTIONS = [
  { id:'INS-001', dikeId:'DD-HD', date:'10/03/2026', inspector:'Nguyễn Văn Bình', score:71, grade:'C',
    findings:'Mái đê hạ lưu đoạn K32-K35 bị sạt nhẹ. Cơ đê K40-K42 bị ngập úng sau mưa.',
    repairNeeded:'Gia cố mái đê hạ K32-K35 (450m), thoát nước cơ đê K40-K42', urgency:'high',
    photos:3, approved:true },
  { id:'INS-002', dikeId:'DD-LK', date:'08/03/2026', inspector:'Trần Thị Hương', score:66, grade:'C',
    findings:'Nhiều đoạn mặt đê bị rạn nứt. Mái thượng lưu K5-K8 bị sói lở.',
    repairNeeded:'Xử lý khẩn cơ đê K5-K8, vá mặt đê toàn tuyến', urgency:'critical',
    photos:6, approved:false },
  { id:'INS-003', dikeId:'DD-HH', date:'12/03/2026', inspector:'Phạm Quốc Tuấn', score:82, grade:'B',
    findings:'Tuyến đê nhìn chung ổn định. Một số đoạn cơ đê bị sụt lún nhẹ.',
    repairNeeded:'Theo dõi định kỳ, sửa chữa nhỏ cơ đê K22-K24', urgency:'normal',
    photos:4, approved:true },
];

// ── RENDER MAIN PAGE ─────────────────────────────────────────────
function renderDikeInspection() {
  const total = DIKE_INVENTORY.length;
  const gradeA = DIKE_INVENTORY.filter(d=>d.grade==='A').length;
  const gradeB = DIKE_INVENTORY.filter(d=>d.grade==='B').length;
  const gradeC = DIKE_INVENTORY.filter(d=>d.grade==='C').length;
  const danger = DIKE_INVENTORY.filter(d=>d.status==='danger').length;
  const totalLen = DIKE_INVENTORY.reduce((s,d)=>s+d.length,0).toFixed(1);

  return `
  <div class="page-header">
    <div class="page-title">
      <h1>Phân Loại Đê & Giám Sát Hiện Trạng</h1>
      <p>Biểu mẫu PLDGHT — Chi cục Thủy lợi & PCTT Hà Nội · ${total} tuyến đê · ${totalLen} km</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-ghost btn-sm" onclick="diImportPLDGHT()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Nhập từ Excel
      </button>
      <button class="btn btn-ghost btn-sm" onclick="diDownloadPLDGHTTemplate()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Template CSV
      </button>
      <button class="btn btn-ghost btn-sm" onclick="diExportPLDGHT()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Xuất PLDGHT (Excel)
      </button>
      <button class="btn btn-outline btn-sm" onclick="diOpenNewInspection()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Thêm biên bản kiểm tra
      </button>
      <button class="btn btn-sm" style="background:rgba(139,92,246,.15);color:#a78bfa;border:1px solid rgba(139,92,246,.3)" onclick="diAIRiskAnalysis()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        AI Phân tích Rủi ro
      </button>
    </div>
  </div>

  <!-- KPI Cards -->
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:18px">
    ${[
      { label:'Loại A (Tốt)', val:gradeA, color:'var(--green)', sub:'Đảm bảo an toàn' },
      { label:'Loại B (Khá)', val:gradeB, color:'var(--cyan)', sub:'Cần duy tu định kỳ' },
      { label:'Loại C (Yếu)', val:gradeC, color:'var(--yellow)', sub:'Cần sửa chữa gấp' },
      { label:'Nguy hiểm', val:danger, color:'var(--red)', sub:'Xử lý khẩn cấp' },
      { label:'Tổng chiều dài', val:totalLen+'km', color:'var(--purple)', sub:`${total} tuyến` },
    ].map(k=>`
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:16px 18px">
      <div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">${k.label}</div>
      <div style="font-size:26px;font-weight:800;color:${k.color}">${k.val}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:3px">${k.sub}</div>
    </div>`).join('')}
  </div>

  <!-- Tabs -->
  <div class="tabs" style="margin-bottom:18px">
    <button class="tab-btn ${diTab==='overview'?'active':''}" onclick="diSwitchTab('overview')">Tổng quan tuyến đê</button>
    <button class="tab-btn ${diTab==='matrix'?'active':''}" onclick="diSwitchTab('matrix')">Ma trận Phân loại</button>
    <button class="tab-btn ${diTab==='history'?'active':''}" onclick="diSwitchTab('history')">Lịch sử Kiểm tra (${DIKE_INSPECTIONS.length})</button>
  </div>
  <div id="diTabContent">${_renderDiTab()}</div>`;
}

function _renderDiTab() {
  if (diTab === 'overview') return _renderDiOverview();
  if (diTab === 'matrix')   return _renderDiMatrix();
  if (diTab === 'history')  return _renderDiHistory();
  return '';
}

function _renderDiOverview() {
  const gradeCfg = {
    A:{color:'var(--green)',bg:'rgba(0,230,118,.12)',border:'rgba(0,230,118,.3)',label:'Loại A'},
    B:{color:'var(--cyan)',bg:'rgba(0,200,255,.1)',border:'rgba(0,200,255,.25)',label:'Loại B'},
    C:{color:'var(--yellow)',bg:'rgba(255,202,40,.1)',border:'rgba(255,202,40,.3)',label:'Loại C'},
    D:{color:'var(--red)',bg:'rgba(255,68,68,.1)',border:'rgba(255,68,68,.3)',label:'Loại D'},
  };
  const statusIcon = {ok:'✓',warning:'⚠',danger:'🔴'};
  return `
  <div class="card" style="padding:0">
    <div class="card-header">
      <span class="card-title">Danh sách tuyến đê — Kết quả đánh giá 2025</span>
      <div style="display:flex;gap:8px">
        <input class="form-control" style="width:200px;font-size:12px" placeholder="Tìm tuyến đê..." oninput="diFilterTable(this.value)">
      </div>
    </div>
    <div class="table-wrap">
      <table id="diOverviewTable">
        <thead><tr>
          <th>Tuyến đê</th><th>Từ – Đến Km</th><th>Chiều dài</th><th>Cấp</th>
          <th>Đơn vị QL</th><th>Điểm ĐG</th><th>Phân loại</th><th>Sửa chữa (%)</th><th>Thao tác</th>
        </tr></thead>
        <tbody>
          ${DIKE_INVENTORY.map(d=>{
            const g = gradeCfg[d.grade]||gradeCfg.C;
            const pctColor = d.repairPct>=80?'var(--green)':d.repairPct>=50?'var(--yellow)':'var(--red)';
            return `<tr>
              <td style="font-weight:700;font-size:13px">${statusIcon[d.status]||''} ${d.name}</td>
              <td class="mono" style="font-size:11px">${d.from_km} – ${d.to_km}</td>
              <td class="mono">${d.length} km</td>
              <td><span style="font-size:11px;font-weight:700;color:var(--cyan)">Cấp ${d.level}</span></td>
              <td style="font-size:11px;color:var(--muted)">${d.unit}</td>
              <td><span style="font-size:16px;font-weight:800;color:${d.score>=85?'var(--green)':d.score>=75?'var(--cyan)':d.score>=65?'var(--yellow)':'var(--red)'}">${d.score}</span>/100</td>
              <td><span style="padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700;background:${g.bg};color:${g.color};border:1px solid ${g.border}">${g.label}</span></td>
              <td>
                <div style="display:flex;align-items:center;gap:8px">
                  <div style="flex:1;height:6px;background:rgba(255,255,255,.08);border-radius:3px;min-width:60px">
                    <div style="width:${d.repairPct}%;height:100%;background:${pctColor};border-radius:3px"></div>
                  </div>
                  <span style="font-size:11px;color:${pctColor};font-weight:700;min-width:32px">${d.repairPct}%</span>
                </div>
              </td>
              <td>
                <div style="display:flex;gap:4px">
                  <button class="btn btn-ghost btn-xs" onclick="diViewDike('${d.id}')">Chi tiết</button>
                  <button class="btn btn-ghost btn-xs" onclick="diOpenInspectionForm('${d.id}')">Kiểm tra</button>
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function _renderDiMatrix() {
  const items = ['top','slope_up','slope_down','berm','revetment','culvert'];
  const itemLabels = { top:'Mặt đê', slope_up:'Mái thượng', slope_down:'Mái hạ lưu', berm:'Cơ đê', revetment:'Kè bảo vệ', culvert:'Cống qua đê' };
  const scoreMap = { 'Tốt':3, 'Trung bình':2, 'Kém':1 };
  const colorMap = { 'Tốt':'rgba(0,230,118,.2)','Trung bình':'rgba(255,202,40,.18)','Kém':'rgba(239,68,68,.2)' };
  const textMap  = { 'Tốt':'var(--green)','Trung bình':'var(--yellow)','Kém':'#f87171' };

  return `
  <div class="card" style="padding:0;overflow:hidden">
    <div class="card-header">
      <span class="card-title">Ma trận Phân loại hiện trạng đê — Năm 2025</span>
      <div style="display:flex;gap:10px;align-items:center;font-size:11px">
        ${[['Tốt','var(--green)'],['Trung bình','var(--yellow)'],['Kém','#f87171']].map(([l,c])=>`
        <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:2px;background:${c};opacity:.5"></span>${l}</span>`).join('')}
      </div>
    </div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;min-width:900px">
        <thead>
          <tr style="background:rgba(255,255,255,.04)">
            <th style="padding:10px 14px;text-align:left;font-size:12px;border-bottom:1px solid var(--border);position:sticky;left:0;background:var(--bg-card)">Tuyến đê</th>
            <th style="padding:10px 12px;font-size:11px;border-bottom:1px solid var(--border);text-align:center;width:48px">Điểm</th>
            <th style="padding:10px 12px;font-size:11px;border-bottom:1px solid var(--border);text-align:center;width:58px">Loại</th>
            ${items.map(it=>`<th style="padding:10px 12px;font-size:11px;border-bottom:1px solid var(--border);text-align:center;white-space:nowrap">${itemLabels[it]}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${DIKE_INVENTORY.map((d,i)=>`
          <tr style="border-bottom:1px solid rgba(255,255,255,.04);background:${i%2===0?'transparent':'rgba(255,255,255,.015)'}">
            <td style="padding:9px 14px;font-size:12px;font-weight:600;position:sticky;left:0;background:var(--bg-card)">${d.name}</td>
            <td style="padding:9px 12px;text-align:center;font-weight:700;color:${d.score>=85?'var(--green)':d.score>=75?'var(--cyan)':d.score>=65?'var(--yellow)':'#f87171'};font-size:13px">${d.score}</td>
            <td style="padding:9px 12px;text-align:center"><span style="padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;background:${{A:'rgba(0,230,118,.15)',B:'rgba(0,200,255,.12)',C:'rgba(255,202,40,.15)',D:'rgba(239,68,68,.15)'}[d.grade]};color:${{A:'var(--green)',B:'var(--cyan)',C:'var(--yellow)',D:'#f87171'}[d.grade]}">${d.grade}</span></td>
            ${items.map(it=>`
            <td style="padding:9px 12px;text-align:center;background:${colorMap[d.items[it]]||'transparent'}">
              <span style="font-size:11px;font-weight:600;color:${textMap[d.items[it]]||'var(--muted)'}">${d.items[it]||'—'}</span>
            </td>`).join('')}
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <div style="margin-top:14px;padding:14px 16px;background:var(--bg-card);border:1px solid var(--border);border-radius:12px;font-size:12px;color:var(--muted)">
    <strong style="color:var(--text)">Tiêu chí phân loại (theo TT09/2021/TT-BNN&PTNT):</strong>
    <span style="margin-left:8px">Loại A (≥85đ): An toàn</span> ·
    <span>Loại B (70-84đ): Duy tu định kỳ</span> ·
    <span>Loại C (55-69đ): Sửa chữa trước mùa lũ</span> ·
    <span>Loại D (&lt;55đ): Xử lý khẩn cấp</span>
  </div>`;
}

function _renderDiHistory() {
  const urgCfg = { critical:['badge-red','Khẩn cấp'], high:['badge-yellow','Ưu tiên cao'], normal:['badge-gray','Bình thường'] };
  return `
  <div class="card" style="padding:0">
    <div class="card-header">
      <span class="card-title">Lịch sử biên bản kiểm tra ${new Date().getFullYear()}</span>
      <button class="btn btn-outline btn-sm" onclick="diOpenNewInspection()">+ Biên bản mới</button>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>Mã BB</th><th>Tuyến đê</th><th>Ngày KT</th><th>Kiểm tra viên</th><th>Điểm / Loại</th><th>Phát hiện</th><th>Mức độ</th><th>Ảnh</th><th>Thao tác</th></tr></thead>
      <tbody>
        ${DIKE_INSPECTIONS.map(ins=>{
          const dike = DIKE_INVENTORY.find(d=>d.id===ins.dikeId)||{name:'—'};
          const [urgClass,urgLabel] = urgCfg[ins.urgency]||urgCfg.normal;
          return `<tr>
            <td class="mono" style="color:var(--cyan);font-size:12px">${ins.id}</td>
            <td style="font-weight:600;font-size:12px">${dike.name}</td>
            <td class="mono" style="font-size:11px;color:var(--muted)">${ins.date}</td>
            <td style="font-size:12px">${ins.inspector}</td>
            <td><span style="font-size:16px;font-weight:800;color:${ins.score>=80?'var(--green)':'var(--yellow)'}">${ins.score}</span><span style="font-size:11px;color:var(--muted)"> / ${ins.grade}</span></td>
            <td style="font-size:11px;color:var(--muted);max-width:220px">${ins.findings.substring(0,80)}${ins.findings.length>80?'...':''}</td>
            <td><span class="badge ${urgClass}" style="font-size:10px">${urgLabel}</span></td>
            <td style="font-size:12px;color:var(--muted)">${ins.photos} ảnh</td>
            <td>
              <div style="display:flex;gap:4px">
                <button class="btn btn-ghost btn-xs" onclick="diViewInspection('${ins.id}')">Xem</button>
                <button class="btn btn-ghost btn-xs" onclick="diExportBienBan('${ins.id}')">PDF</button>
              </div>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table></div>
  </div>`;
}

// ── TAB SWITCH ───────────────────────────────────────────────────
window.diSwitchTab = function(tab) {
  diTab = tab;
  document.querySelectorAll('#diTabContent').forEach(el=>{ if(el) el.innerHTML = _renderDiTab(); });
  const el = document.getElementById('diTabContent');
  if (el) el.innerHTML = _renderDiTab();
  document.querySelectorAll('.tab-btn').forEach(b => {
    const map = { overview:'Tổng quan', matrix:'Ma trận', history:'Lịch sử' };
    b.classList.toggle('active', b.textContent.trim().startsWith(map[tab]?.substring(0,6)||'__'));
  });
};

// ── FILTER ───────────────────────────────────────────────────────
window.diFilterTable = function(q) {
  const rows = document.querySelectorAll('#diOverviewTable tbody tr');
  rows.forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none';
  });
};

// ── VIEW DIKE DETAIL ─────────────────────────────────────────────
window.diViewDike = function(id) {
  const d = DIKE_INVENTORY.find(x=>x.id===id); if(!d) return;
  const itemLabels = { top:'Mặt đê', slope_up:'Mái thượng', slope_down:'Mái hạ lưu', berm:'Cơ đê', revetment:'Kè bảo vệ', culvert:'Cống qua đê' };
  const textMap = { 'Tốt':'var(--green)','Trung bình':'var(--yellow)','Kém':'#f87171' };
  openModal(`
  <div class="modal-header"><span class="modal-title">${d.name}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body" style="max-height:75vh;overflow-y:auto">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px">
      ${[['Từ – Đến Km',`${d.from_km} – ${d.to_km}`],['Chiều dài',`${d.length} km`],['Cấp đê',`Cấp ${d.level}`],
         ['Điểm đánh giá',`${d.score}/100`],['Phân loại',`Loại ${d.grade}`],['Tiến độ SC',`${d.repairPct}%`]].map(([l,v])=>`
      <div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px;padding:10px">
        <div style="font-size:10px;color:var(--muted);margin-bottom:3px">${l}</div>
        <div style="font-size:13px;font-weight:700">${v}</div>
      </div>`).join('')}
    </div>
    <div style="font-size:12px;color:var(--muted);margin-bottom:14px">
      <strong style="color:var(--text)">Địa bàn:</strong> ${d.districts.join(', ')} &nbsp;·&nbsp;
      <strong style="color:var(--text)">Đơn vị QL:</strong> ${d.unit}
    </div>
    <div style="font-size:13px;font-weight:700;margin-bottom:10px">Đánh giá từng hạng mục</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      ${Object.entries(d.items).map(([k,v])=>`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:8px">
        <span style="font-size:12px">${itemLabels[k]}</span>
        <span style="font-size:12px;font-weight:700;color:${textMap[v]||'var(--muted)'}">${v}</span>
      </div>`).join('')}
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-primary" onclick="closeModal();diOpenInspectionForm('${d.id}')">Tạo phiếu kiểm tra</button>
  </div>`);
};

// ── OPEN INSPECTION FORM ─────────────────────────────────────────
window.diOpenInspectionForm = function(dikeId) {
  const d = DIKE_INVENTORY.find(x=>x.id===dikeId)||{name:'Chọn tuyến đê',id:''};
  const today = new Date().toLocaleDateString('vi-VN');
  openModal(`
  <div class="modal-header"><span class="modal-title">Biên bản Kiểm tra Đê — ${d.name}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body" style="max-height:80vh;overflow-y:auto">

    <div style="background:rgba(0,200,255,.06);border:1px solid rgba(0,200,255,.2);border-radius:10px;padding:12px 14px;margin-bottom:16px;font-size:12px;color:var(--muted)">
      Biểu mẫu PLDGHT — Phân Loại Đê & Giám Sát Hiện Trạng (TT09/2021/TT-BNN&PTNT)
    </div>

    <div style="font-size:12px;font-weight:700;color:var(--cyan);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">I. Thông tin chung</div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Tuyến đê <span style="color:var(--red)">*</span></label>
        <select id="diInsDike" class="form-control">
          ${DIKE_INVENTORY.map(x=>`<option value="${x.id}" ${x.id===dikeId?'selected':''}>${x.name}</option>`).join('')}
        </select></div>
      <div class="form-group"><label class="form-label">Ngày kiểm tra</label>
        <input id="diInsDate" class="form-control" value="${today}" placeholder="DD/MM/YYYY"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Đoạn kiểm tra (Km – Km)</label>
        <input id="diInsFromKm" class="form-control" placeholder="${d.from_km||'K0+000'}"></div>
      <div class="form-group"><label class="form-label">Đến Km</label>
        <input id="diInsToKm" class="form-control" placeholder="${d.to_km||'K0+000'}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Cán bộ kiểm tra <span style="color:var(--red)">*</span></label>
        <input id="diInsInsp" class="form-control" placeholder="Họ tên cán bộ"></div>
      <div class="form-group"><label class="form-label">Chức vụ</label>
        <input id="diInsRole" class="form-control" placeholder="Kỹ sư / Cán bộ kỹ thuật"></div>
    </div>

    <div style="font-size:12px;font-weight:700;color:var(--cyan);text-transform:uppercase;letter-spacing:.05em;margin:16px 0 10px">II. Đánh giá từng hạng mục</div>
    ${[
      ['diInsMat','Mặt đê','Bề mặt đê có bằng phẳng, thoát nước tốt? Có nứt nẻ, lún sụt?'],
      ['diInsMaiTren','Mái đê thượng lưu','Mái dốc ổn định? Có sạt, xói lở, rò rỉ?'],
      ['diInsMaiDuoi','Mái đê hạ lưu','Dấu hiệu thẩm lậu, mạch đùn, mạch sủi?'],
      ['diInsCo','Cơ đê','Cơ đê có bị lún, ngập, xói gót?'],
      ['diInsKe','Kè bảo vệ','Kè đá/bê tông ổn định? Có hư hỏng, sụt khối?'],
      ['diInsCong','Cống qua đê','Cống hoạt động tốt? Rò rỉ xung quanh thân cống?'],
    ].map(([id,label,hint])=>`
    <div style="margin-bottom:10px;padding:12px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:8px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
        <div>
          <div style="font-size:12px;font-weight:600">${label}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">${hint}</div>
        </div>
        <div style="display:flex;gap:6px;flex-shrink:0">
          ${['Tốt','Trung bình','Kém'].map((v,i)=>`
          <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:11px">
            <input type="radio" name="${id}" value="${v}" ${i===0?'checked':''} style="accent-color:${i===0?'var(--green)':i===1?'var(--yellow)':'#f87171'}">
            <span style="color:${i===0?'var(--green)':i===1?'var(--yellow)':'#f87171'}">${v}</span>
          </label>`).join('')}
        </div>
      </div>
    </div>`).join('')}

    <div style="font-size:12px;font-weight:700;color:var(--cyan);text-transform:uppercase;letter-spacing:.05em;margin:16px 0 10px">III. Phát hiện & Kiến nghị</div>
    <div class="form-group"><label class="form-label">Những phát hiện bất thường</label>
      <textarea id="diInsFindings" class="form-control" rows="3" placeholder="Mô tả cụ thể vị trí, tình trạng sự cố / bất thường phát hiện..."></textarea></div>
    <div class="form-group"><label class="form-label">Kiến nghị xử lý</label>
      <textarea id="diInsAction" class="form-control" rows="2" placeholder="Biện pháp xử lý đề xuất, khối lượng, thời hạn..."></textarea></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Mức độ ưu tiên</label>
        <select id="diInsUrgency" class="form-control">
          <option value="normal">Bình thường</option>
          <option value="high">Ưu tiên cao</option>
          <option value="critical">Khẩn cấp</option>
        </select></div>
      <div class="form-group"><label class="form-label">Tiến độ sửa chữa hiện tại (%)</label>
        <input id="diInsRepairPct" class="form-control" type="number" min="0" max="100" placeholder="0 – 100"></div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-outline" onclick="diSaveInspection('${d.id}',true)">Lưu nháp</button>
    <button class="btn btn-primary" onclick="diSaveInspection('${d.id}',false)">Lưu & Duyệt</button>
  </div>`);
};

// ── SAVE INSPECTION ──────────────────────────────────────────────
window.diSaveInspection = function(dikeId, draft) {
  const dike = document.getElementById('diInsDike')?.value || dikeId;
  const insp = document.getElementById('diInsInsp')?.value?.trim();
  if (!insp) { showToast('⚠ Vui lòng nhập tên cán bộ kiểm tra!'); return; }
  const ratings = ['diInsMat','diInsMaiTren','diInsMaiDuoi','diInsCo','diInsKe','diInsCong'].map(id => {
    const el = document.querySelector(`input[name="${id}"]:checked`);
    return el ? el.value : 'Trung bình';
  });
  const scoreMap = { 'Tốt':3, 'Trung bình':2, 'Kém':1 };
  const rawScore = ratings.reduce((s,r)=>s+scoreMap[r],0);
  const score = Math.round(rawScore / 18 * 100 * 0.6 + 40);
  const grade = score>=85?'A':score>=70?'B':score>=55?'C':'D';
  const newIns = {
    id: 'INS-' + String(DIKE_INSPECTIONS.length+1).padStart(3,'0'),
    dikeId: dike,
    date: document.getElementById('diInsDate')?.value || new Date().toLocaleDateString('vi-VN'),
    inspector: insp,
    score, grade,
    findings: document.getElementById('diInsFindings')?.value || '—',
    repairNeeded: document.getElementById('diInsAction')?.value || '—',
    urgency: document.getElementById('diInsUrgency')?.value || 'normal',
    repairPct: parseInt(document.getElementById('diInsRepairPct')?.value)||0,
    photos: 0,
    approved: !draft,
  };
  DIKE_INSPECTIONS.unshift(newIns);
  // Update dike score
  const d = DIKE_INVENTORY.find(x=>x.id===dike);
  if (d) { d.score=score; d.grade=grade; d.repairPct=newIns.repairPct; }
  closeModal();
  showToast(draft ? '📝 Đã lưu nháp biên bản kiểm tra!' : `✅ Biên bản ${newIns.id} đã duyệt! Điểm: ${score}/100 — Loại ${grade}`);
  const tabEl = document.getElementById('diTabContent');
  if (tabEl) tabEl.innerHTML = _renderDiTab();
};

// ── VIEW INSPECTION ──────────────────────────────────────────────
window.diViewInspection = function(id) {
  const ins = DIKE_INSPECTIONS.find(x=>x.id===id); if(!ins) return;
  const dike = DIKE_INVENTORY.find(d=>d.id===ins.dikeId)||{name:'—'};
  const urg = {critical:'Khẩn cấp',high:'Ưu tiên cao',normal:'Bình thường'}[ins.urgency]||'—';
  openModal(`
  <div class="modal-header"><span class="modal-title">Biên bản ${ins.id} — ${dike.name}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      ${[['Tuyến đê',dike.name],['Ngày kiểm tra',ins.date],['Cán bộ KT',ins.inspector],
         ['Điểm / Loại',`${ins.score}/100 — Loại ${ins.grade}`],['Mức độ',urg],['Trạng thái',ins.approved?'Đã duyệt':'Nháp']].map(([l,v])=>
      `<div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px;padding:10px">
        <div style="font-size:10px;color:var(--muted)">${l}</div>
        <div style="font-size:13px;font-weight:600;margin-top:2px">${v}</div>
      </div>`).join('')}
    </div>
    <div class="form-group"><label class="form-label">Phát hiện</label>
      <div style="padding:10px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:8px;font-size:12px">${ins.findings}</div></div>
    <div class="form-group"><label class="form-label">Kiến nghị xử lý</label>
      <div style="padding:10px;background:rgba(0,200,255,.04);border:1px solid rgba(0,200,255,.15);border-radius:8px;font-size:12px;color:var(--cyan)">${ins.repairNeeded}</div></div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-outline" onclick="closeModal();diExportBienBan('${ins.id}')">Xuất PDF</button>
  </div>`);
};

window.diOpenNewInspection = function() { diOpenInspectionForm(DIKE_INVENTORY[0]?.id||''); };

// ── OPEN INSPECTION FORM (from overview) ────────────────────────
window.diExportBienBan = function(id) {
  const ins = DIKE_INSPECTIONS.find(x=>x.id===id);
  const dike = DIKE_INVENTORY.find(d=>d.id===ins?.dikeId)||{name:'—'};
  if (typeof window.HADIWA_EXPORT?.print === 'function') {
    window.HADIWA_EXPORT.print(`Biên bản kiểm tra đê — ${dike.name}`,
      `<h2>${dike.name} — ${ins?.date}</h2>
       <p>Cán bộ kiểm tra: <b>${ins?.inspector}</b></p>
       <p>Điểm đánh giá: <b>${ins?.score}/100 — Loại ${ins?.grade}</b></p>
       <p>Phát hiện: ${ins?.findings}</p>
       <p>Kiến nghị: ${ins?.repairNeeded}</p>`);
  } else {
    showToast(`📄 Xuất biên bản ${id} — ${dike.name}`);
  }
};

// ── EXPORT PLDGHT TABLE ──────────────────────────────────────────
window.diExportPLDGHT = function() {
  const headers = ['Tuyến đê','Từ Km','Đến Km','Chiều dài (km)','Cấp đê','Đơn vị QL','Điểm ĐG','Phân loại','Tiến độ SC (%)','Mặt đê','Mái thượng','Mái hạ','Cơ đê','Kè','Cống'];
  const rows = DIKE_INVENTORY.map(d=>[
    d.name, d.from_km, d.to_km, d.length, `Cấp ${d.level}`, d.unit, d.score, `Loại ${d.grade}`, d.repairPct+'%',
    d.items.top, d.items.slope_up, d.items.slope_down, d.items.berm, d.items.revetment, d.items.culvert
  ]);
  const csv = [headers, ...rows].map(r=>r.map(c=>`"${String(c||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url;
  a.download=`PLDGHT_Ha_Noi_${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
  showToast('✅ Đã xuất bảng PLDGHT (Excel-compatible)!','success');
};

// ── AI RISK ANALYSIS ─────────────────────────────────────────────
window.diAIRiskAnalysis = function() {
  const danger = DIKE_INVENTORY.filter(d=>d.status==='danger');
  const gradeC = DIKE_INVENTORY.filter(d=>d.grade==='C');
  const gradeD = DIKE_INVENTORY.filter(d=>d.grade==='D');
  const lowRepair = DIKE_INVENTORY.filter(d=>d.repairPct<50);

  openModal(`
  <div class="modal-header"><span class="modal-title" style="color:#a78bfa">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    AI Phân tích Rủi ro Đê điều — Mùa lũ 2026
  </span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body" style="max-height:80vh;overflow-y:auto">

    <!-- Risk Summary -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px">
      ${[
        ['Nguy hiểm',danger.length,'var(--red)'],
        ['Cần SC gấp',gradeC.length+gradeD.length,'var(--yellow)'],
        ['Tiến độ chậm',lowRepair.length,'#f97316'],
        ['Độ an toàn TB',`${Math.round(DIKE_INVENTORY.reduce((s,d)=>s+d.score,0)/DIKE_INVENTORY.length)}%`,'var(--cyan)'],
      ].map(([l,v,c])=>`
      <div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center">
        <div style="font-size:22px;font-weight:800;color:${c}">${v}</div>
        <div style="font-size:11px;color:var(--muted);margin-top:3px">${l}</div>
      </div>`).join('')}
    </div>

    <!-- AI Analysis Text -->
    <div style="padding:14px 16px;background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.2);border-radius:10px;margin-bottom:14px;border-left:3px solid #7c3aed">
      <div style="font-size:12px;font-weight:700;color:#a78bfa;margin-bottom:8px">Phân tích AI — Đánh giá rủi ro mùa lũ 2026</div>
      <div style="font-size:12px;color:var(--muted);line-height:1.7">
        Dựa trên dữ liệu PLDGHT hiện tại, hệ thống AI xác định <strong style="color:#f87171">${danger.length} tuyến đê nguy hiểm</strong> cần xử lý khẩn cấp trước mùa lũ 2026.<br>
        Tuyến đê <strong style="color:var(--yellow)">${gradeC.map(d=>d.name).join(', ')}</strong> có điểm đánh giá thấp (Loại C) và tiến độ sửa chữa dưới 50%, tiềm ẩn nguy cơ sự cố khi mực nước lên cao.<br>
        AI dự báo với xác suất <strong style="color:var(--red)">72%</strong> rằng đê Hữu Đáy đoạn K32-K40 có thể xảy ra sạt lở mái nếu lũ đạt BĐ2 trở lên.
      </div>
    </div>

    <!-- Recommendations -->
    <div style="font-size:12px;font-weight:700;margin-bottom:10px">Khuyến nghị ưu tiên:</div>
    ${[
      {priority:'Khẩn cấp', dike:'Đê La Khê (K0-K18)', action:'Gia cố mái thượng lưu, khơi thông thoát nước mặt đê. Hạn: trước 01/05/2026', color:'#f87171'},
      {priority:'Ưu tiên cao', dike:'Đê Hữu Đáy (K32-K40)', action:'Xử lý sạt mái hạ lưu, lắp đặt cảm biến theo dõi dịch chuyển. Hạn: trước 15/05/2026', color:'var(--yellow)'},
      {priority:'Ưu tiên cao', dike:'Đê Nhuệ (toàn tuyến)', action:'Kiểm tra và gia cố mái kè, thay thế cống cũ. Hạn: trước 30/04/2026', color:'var(--yellow)'},
      {priority:'Theo dõi', dike:'Đê Tả Đáy (K15-K30)', action:'Tăng cường tuần tra 2 lần/ngày, lắp biển cảnh báo khu vực xung yếu', color:'var(--cyan)'},
    ].map(r=>`
    <div style="display:flex;gap:12px;padding:10px 12px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:8px;margin-bottom:8px">
      <span style="font-size:10px;font-weight:700;padding:3px 8px;border-radius:4px;background:${r.color}18;color:${r.color};border:1px solid ${r.color}40;flex-shrink:0;height:fit-content;white-space:nowrap;margin-top:1px">${r.priority}</span>
      <div>
        <div style="font-size:12px;font-weight:700;margin-bottom:3px">${r.dike}</div>
        <div style="font-size:11px;color:var(--muted)">${r.action}</div>
      </div>
    </div>`).join('')}
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-primary" onclick="closeModal();diExportPLDGHT()">Xuất báo cáo</button>
  </div>`);
};

// ── EXCEL / CSV IMPORT — PLDGHT ──────────────────────────────────

const PLDGHT_IMPORT_HEADERS = [
  'Tuyến đê','Từ Km','Đến Km','Chiều dài (km)','Cấp đê','Đơn vị QL',
  'Điểm ĐG','Phân loại','Tiến độ SC (%)','Mặt đê','Mái thượng','Mái hạ','Cơ đê','Kè bảo vệ','Cống qua đê'
];
const PLDGHT_SAMPLE_ROWS = [
  ['Đê Hữu Hồng','K0+000','K99+500','99.5','1','Hạt QL Đê Hữu Hồng','82','B','65','Trung bình','Tốt','Trung bình','Kém','Tốt','Trung bình'],
  ['Đê Tả Hồng','K0+000','K44+200','44.2','1','Hạt QL Đê Tả Hồng','91','A','88','Tốt','Tốt','Tốt','Trung bình','Tốt','Tốt'],
];
window.diDownloadPLDGHTTemplate = function() {
  if (typeof downloadImportTemplate === 'function') {
    downloadImportTemplate(`PLDGHT_Template_HaNoi_${new Date().toISOString().slice(0,10)}.csv`, PLDGHT_IMPORT_HEADERS, PLDGHT_SAMPLE_ROWS);
  } else { showToast('⚠ Import helper chưa được tải!'); }
};
window.diImportPLDGHT = function() {
  if (typeof triggerImportFilePicker !== 'function') { showToast('⚠ Import helper chưa được tải!'); return; }
  triggerImportFilePicker((fileName, parsedRows) => {
    const dataRows = parsedRows.length > 0 && parsedRows[0][0] === PLDGHT_IMPORT_HEADERS[0] ? parsedRows.slice(1) : parsedRows;
    if (!dataRows.length) { showToast('⚠ File không có dữ liệu!'); return; }
    const validators = [
      IV.required, IV.any, IV.any, IV.numRange(0.1,500), IV.numRange(1,5), IV.required,
      IV.numRange(0,100), IV.oneOf('A','B','C','D'), IV.numRange(0,100),
      IV.oneOf('Tốt','Trung bình','Kém'), IV.oneOf('Tốt','Trung bình','Kém'),
      IV.oneOf('Tốt','Trung bình','Kém'), IV.oneOf('Tốt','Trung bình','Kém'),
      IV.oneOf('Tốt','Trung bình','Kém'), IV.oneOf('Tốt','Trung bình','Kém'),
    ];
    showImportConfirmModal({
      title: 'PLDGHT — Phân Loại Đê', fileName, headers: PLDGHT_IMPORT_HEADERS, rows: dataRows, validators,
      displayCols: ['Tuyến đê','Chiều dài (km)','Cấp đê','Điểm ĐG','Phân loại','Tiến độ SC (%)'],
      onConfirm: (validRows) => {
        let updated = 0, added = 0;
        validRows.forEach(row => {
          const name = row[0]?.trim(); if (!name) return;
          const score = parseInt(row[6])||70, grade = row[7]?.trim()||'B', repairPct = parseInt(row[8])||0;
          const existing = DIKE_INVENTORY.find(d => d.name === name);
          const items = { top:row[9]||'Trung bình', slope_up:row[10]||'Trung bình', slope_down:row[11]||'Trung bình', berm:row[12]||'Trung bình', revetment:row[13]||'Trung bình', culvert:row[14]||'Trung bình' };
          if (existing) {
            Object.assign(existing, { from_km:row[1]||existing.from_km, to_km:row[2]||existing.to_km, length:parseFloat(row[3])||existing.length, level:parseInt(row[4])||existing.level, unit:row[5]||existing.unit, score, grade, repairPct, status:score>=85?'ok':score>=65?'warning':'danger', items });
            updated++;
          } else {
            DIKE_INVENTORY.push({ id:'DD-IMP'+added, name, from_km:row[1]||'K0+000', to_km:row[2]||'K0+000', length:parseFloat(row[3])||0, level:parseInt(row[4])||3, unit:row[5]||'—', districts:[], score, grade, repairPct, status:score>=85?'ok':score>=65?'warning':'danger', items });
            added++;
          }
        });
        const tabEl = document.getElementById('diTabContent'); if (tabEl) tabEl.innerHTML = _renderDiTab();
        showToast(`✅ Import PLDGHT: Cập nhật ${updated} tuyến, thêm mới ${added} tuyến!`);
      }
    });
  });
};

// ── PATCH: diExportBienBan — Real print preview modal ────────────

window.diExportBienBan = function(id) {
  const ins = DIKE_INSPECTIONS.find(x=>x.id===id); if(!ins) return;
  const dike = DIKE_INVENTORY.find(d=>d.id===ins.dikeId)||{name:'—', level:'—', unit:'—'};
  const urgLabel = {critical:'Khẩn cấp', high:'Ưu tiên cao', normal:'Bình thường'}[ins.urgency]||'—';
  const gradeColor = {A:'var(--green)',B:'var(--cyan)',C:'var(--yellow)',D:'#f87171'}[ins.grade]||'var(--muted)';
  const itemLabels = {top:'Mặt đê',slope_up:'Mái thượng',slope_down:'Mái hạ lưu',berm:'Cơ đê',revetment:'Kè bảo vệ',culvert:'Cống qua đê'};
  const textMap  = {'Tốt':'var(--green)','Trung bình':'var(--yellow)','Kém':'#f87171'};

  openModal(`
  <div class="modal-header">
    <span class="modal-title">Biên bản Kiểm tra Đê — ${ins.id}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body" style="max-height:80vh;overflow-y:auto">
    <!-- Header -->
    <div style="text-align:center;padding:14px;border-bottom:2px solid var(--border);margin-bottom:14px">
      <div style="font-size:11px;color:var(--muted)">CHI CỤC THỦY LỢI & PCTT HÀ NỘI</div>
      <div style="font-size:16px;font-weight:800;color:var(--text);margin:4px 0">BIÊN BẢN KIỂM TRA ĐÊ ĐIỀU</div>
      <div style="font-size:12px;color:var(--muted)">(Theo Thông tư 09/2021/TT-BNN&PTNT)</div>
    </div>

    <!-- Info grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      ${[['Mã biên bản', ins.id],['Ngày kiểm tra', ins.date],['Tuyến đê', dike.name],
         ['Cấp đê', `Cấp ${dike.level}`],['Đơn vị quản lý', dike.unit||'—'],
         ['Cán bộ kiểm tra', ins.inspector],['Điểm đánh giá', `${ins.score}/100`],
         ['Phân loại', `Loại ${ins.grade}`],['Mức độ ưu tiên', urgLabel],
         ['Trạng thái duyệt', ins.approved?'Đã phê duyệt':'Chờ duyệt']].map(([l,v])=>`
      <div style="padding:8px 10px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:6px">
        <div style="font-size:10px;color:var(--muted)">${l}</div>
        <div style="font-size:12px;font-weight:600;margin-top:2px">${v}</div>
      </div>`).join('')}
    </div>

    <!-- Grade badge -->
    <div style="text-align:center;padding:10px;margin-bottom:12px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:8px">
      <span style="font-size:32px;font-weight:900;color:${gradeColor}">Loại ${ins.grade}</span>
      <span style="font-size:14px;color:var(--muted);margin-left:8px">${ins.score}/100 điểm</span>
    </div>

    <!-- Hạng mục nếu có -->
    ${dike.items ? `
    <div style="font-size:12px;font-weight:700;margin-bottom:8px;color:var(--cyan)">Đánh giá từng hạng mục:</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px">
      ${Object.entries(dike.items).map(([k,v])=>`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:6px">
        <span style="font-size:11px">${itemLabels[k]||k}</span>
        <span style="font-size:11px;font-weight:700;color:${textMap[v]||'var(--muted)'}">${v}</span>
      </div>`).join('')}
    </div>` : ''}

    <!-- Phát hiện + kiến nghị -->
    <div style="margin-bottom:10px">
      <div style="font-size:11px;font-weight:700;color:var(--cyan);margin-bottom:5px">PHÁT HIỆN BẤT THƯỜNG:</div>
      <div style="padding:10px;background:rgba(255,202,40,.05);border:1px solid rgba(255,202,40,.15);border-radius:6px;font-size:12px">${ins.findings||'Không có'}</div>
    </div>
    <div style="margin-bottom:10px">
      <div style="font-size:11px;font-weight:700;color:var(--green);margin-bottom:5px">KIẾN NGHỊ XỬ LÝ:</div>
      <div style="padding:10px;background:rgba(0,230,118,.05);border:1px solid rgba(0,230,118,.15);border-radius:6px;font-size:12px">${ins.repairNeeded||'Không có'}</div>
    </div>

    <!-- Ký tên -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px;text-align:center">
      <div style="padding:16px;border:1px solid var(--border);border-radius:8px">
        <div style="font-size:11px;color:var(--muted);margin-bottom:30px">Cán bộ kiểm tra</div>
        <div style="font-size:12px;font-weight:700;color:var(--text)">${ins.inspector}</div>
      </div>
      <div style="padding:16px;border:1px solid var(--border);border-radius:8px">
        <div style="font-size:11px;color:var(--muted);margin-bottom:30px">Lãnh đạo phê duyệt</div>
        <div style="font-size:12px;color:var(--muted)">${ins.approved?'Đã ký duyệt':'(Chờ ký)' }</div>
      </div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    ${!ins.approved?`<button class="btn btn-outline" onclick="ins&&(ins.approved=true);closeModal();showToast('✅ Đã phê duyệt biên bản '+ins.id)">Phê duyệt</button>`:''}
    <button class="btn btn-primary" onclick="diPrintBienBan('${ins.id}')">In / Lưu PDF</button>
  </div>`, 'modal-wide');
};

window.diPrintBienBan = function(id) {
  const ins = DIKE_INSPECTIONS.find(x=>x.id===id); if(!ins) return;
  const dike = DIKE_INVENTORY.find(d=>d.id===ins.dikeId)||{name:'—'};
  const w = window.open('','_blank','width=800,height=900');
  w.document.write(`<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8">
    <title>Biên bản ${ins.id}</title>
    <style>body{font-family:Arial,sans-serif;padding:24px;color:#111;font-size:13px}
    h2{text-align:center;font-size:18px}h3{font-size:13px;color:#333;border-bottom:1px solid #ddd;padding-bottom:4px}
    table{width:100%;border-collapse:collapse;margin:10px 0}td,th{border:1px solid #ccc;padding:7px 10px;font-size:12px}
    .grade{font-size:36px;font-weight:900;text-align:center;padding:10px}
    .sign{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:30px}
    .sign-box{border:1px solid #ccc;padding:16px;text-align:center;min-height:80px;border-radius:4px}
    @media print{button{display:none}}</style></head><body>
    <div style="text-align:center"><small>CHI CỤC THỦY LỢI & PCTT HÀ NỘI</small>
    <h2>BIÊN BẢN KIỂM TRA ĐÊ ĐIỀU<br><small style="font-size:13px;font-weight:normal">(Mã: ${ins.id} — ${ins.date})</small></h2></div>
    <h3>I. Thông tin chung</h3>
    <table><tr><td><b>Tuyến đê:</b> ${dike.name}</td><td><b>Ngày KT:</b> ${ins.date}</td></tr>
    <tr><td><b>Cán bộ KT:</b> ${ins.inspector}</td><td><b>Điểm ĐG:</b> ${ins.score}/100 — Loại ${ins.grade}</td></tr>
    <tr><td><b>Mức độ ưu tiên:</b> ${{critical:'Khẩn cấp',high:'Ưu tiên cao',normal:'Bình thường'}[ins.urgency]}</td>
    <td><b>Trạng thái:</b> ${ins.approved?'Đã duyệt':'Chờ duyệt'}</td></tr></table>
    <div class="grade">Phân loại: ${ins.grade}</div>
    <h3>II. Phát hiện bất thường</h3><p>${ins.findings||'Không có'}</p>
    <h3>III. Kiến nghị xử lý</h3><p>${ins.repairNeeded||'Không có'}</p>
    <div class="sign"><div class="sign-box"><small>Cán bộ kiểm tra</small><br><br><b>${ins.inspector}</b></div>
    <div class="sign-box"><small>Lãnh đạo phê duyệt</small><br><br>${ins.approved?'Đã ký duyệt':'(Chờ ký)'}</div></div>
    <script>window.print();</scr`+'ipt></body></html>');
  w.document.close();
};
