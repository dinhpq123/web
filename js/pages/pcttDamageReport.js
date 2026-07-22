// ── HADIWA IOC — Báo cáo Thiệt hại PCTT v6.4 ────────────────────
// Chuẩn Bộ NN&PTNT — Người · Nhà · Nông nghiệp · Đê · Hạ tầng

let drTab = 'form';
const DR_RECORDS = [
  { id:'DR-001', date:'12/03/2026', event:'Mưa lớn', district:'Chương Mỹ',
    dead:0, missing:0, injured:2, evacuated:450,
    houseCollapsed:0, houseDamaged:38, houseValue:850,
    riceDamaged:120, cropDamaged:45, fishDamaged:8,
    dikeIncidents:2, dikeDamageLen:180, dikeRepairCost:1200,
    roadDamaged:2.5, bridgeDamaged:1, electricDamaged:0,
    totalEstimate:4.2, approved:true, reporter:'Phòng PCTT Chương Mỹ' },
  { id:'DR-002', date:'10/03/2026', event:'Lốc xoáy', district:'Đông Anh',
    dead:0, missing:0, injured:1, evacuated:80,
    houseCollapsed:2, houseDamaged:12, houseValue:420,
    riceDamaged:0, cropDamaged:15, fishDamaged:0,
    dikeIncidents:0, dikeDamageLen:0, dikeRepairCost:0,
    roadDamaged:0, bridgeDamaged:0, electricDamaged:1,
    totalEstimate:0.9, approved:false, reporter:'Phòng PCTT Đông Anh' },
];

function renderPcttDamageReport() {
  const totalDead = DR_RECORDS.reduce((s,r)=>s+r.dead,0);
  const totalEvac = DR_RECORDS.reduce((s,r)=>s+r.evacuated,0);
  const totalDmg = DR_RECORDS.reduce((s,r)=>s+r.totalEstimate,0).toFixed(1);
  return `
  <div class="page-header">
    <div class="page-title"><h1>Báo cáo Thiệt hại PCTT</h1>
      <p>Chuẩn Bộ NN&amp;PTNT · Thống kê thiệt hại theo vụ việc · Tổng hợp thành phố</p></div>
    <div class="page-actions">
      <button class="btn btn-ghost btn-sm" onclick="drExportReport()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Xuất Excel
      </button>
      <button class="btn btn-outline btn-sm" onclick="drDownloadTemplate()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="12" y2="18"/><line x1="15" y1="15" x2="12" y2="18"/></svg>Template CSV
      </button>
      <button class="btn btn-outline btn-sm" style="border-color:rgba(0,200,255,.4);color:var(--cyan)" onclick="drImportExcel()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>Nhập từ Excel
      </button>
      <button class="btn btn-primary btn-sm" onclick="drOpenForm()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Nhập thiệt hại mới
      </button>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px">
    ${[['Thiệt hại về người',totalDead+' người',totalDead>0?'var(--red)':'var(--green)','tử vong năm 2026'],
       ['Sơ tán',totalEvac,totalEvac>500?'var(--yellow)':'var(--cyan)','người đã sơ tán'],
       ['Tổng thiệt hại',totalDmg+' tỷ','var(--yellow)','ước tính năm 2026'],
       ['Vụ thiệt hại',DR_RECORDS.length,'var(--cyan)',`${DR_RECORDS.filter(r=>r.approved).length} đã duyệt`]].map(([l,v,c,s])=>`
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:16px 18px">
      <div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">${l}</div>
      <div style="font-size:26px;font-weight:800;color:${c}">${v}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:3px">${s}</div>
    </div>`).join('')}
  </div>
  <div class="tabs" style="margin-bottom:18px">
    <button class="tab-btn ${drTab==='form'?'active':''}" onclick="drSwitchTab('form')">Nhập liệu</button>
    <button class="tab-btn ${drTab==='records'?'active':''}" onclick="drSwitchTab('records')">Hồ sơ thiệt hại (${DR_RECORDS.length})</button>
    <button class="tab-btn ${drTab==='summary'?'active':''}" onclick="drSwitchTab('summary')">Tổng hợp thành phố</button>
  </div>
  <div id="drTabContent">${_renderDrTab()}</div>`;
}

function _renderDrTab() {
  if (drTab==='form')    return _drForm();
  if (drTab==='records') return _drRecords();
  if (drTab==='summary') return _drSummary();
  return '';
}

function _drForm() {
  return `
  <div class="card">
    <!-- Import toolbar -->
    <div style="display:flex;align-items:center;gap:8px;padding:12px 20px;border-bottom:1px solid var(--border);background:rgba(0,200,255,.03)">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      <span style="font-size:12px;font-weight:600;color:var(--text);flex:1">Nhập liệu hàng loạt từ file Excel / CSV</span>
      <button class="btn btn-ghost btn-xs" onclick="drDownloadTemplate()"
        style="display:inline-flex;align-items:center;gap:5px">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/></svg>
        Tải template
      </button>
      <button class="btn btn-primary btn-xs" onclick="drImportExcel()"
        style="display:inline-flex;align-items:center;gap:5px">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        Chọn file & Import
      </button>
      <span style="font-size:10px;color:var(--muted);white-space:nowrap">Hỗ trợ .csv · .xlsx</span>
    </div>
    <div class="card-header"><span class="card-title">Form báo cáo thiệt hại — Chuẩn Bộ NN&amp;PTNT</span></div>
    <div style="padding:0 20px 20px">

      <div style="font-size:11px;font-weight:700;color:var(--cyan);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--border)">I. Thông tin chung</div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Loại thiên tai / sự kiện *</label>
          <select id="drEvent" class="form-control">
            <option>Mưa lớn</option><option>Lũ sông</option><option>Lốc xoáy</option>
            <option>Sạt lở đất</option><option>Hạn hán</option><option>Ngập úng đô thị</option>
          </select></div>
        <div class="form-group"><label class="form-label">Địa bàn bị thiệt hại *</label>
          <select id="drDistrict" class="form-control">
            ${['Ba Vì','Chương Mỹ','Đan Phượng','Đông Anh','Gia Lâm','Hoài Đức','Mê Linh','Mỹ Đức',
               'Phú Xuyên','Phúc Thọ','Quốc Oai','Sóc Sơn','Thạch Thất','Thanh Oai','Thanh Trì','Thường Tín','Ứng Hòa',
               'Ba Đình','Cầu Giấy','Đống Đa','Hà Đông','Hai Bà Trưng','Hoàn Kiếm','Hoàng Mai','Long Biên','Tây Hồ','Thanh Xuân'].map(d=>`<option>${d}</option>`).join('')}
          </select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Thời điểm xảy ra</label>
          <input id="drDate" class="form-control" type="date" value="${new Date().toISOString().slice(0,10)}"></div>
        <div class="form-group"><label class="form-label">Đơn vị báo cáo</label>
          <input id="drReporter" class="form-control" placeholder="Phòng PCTT quận/huyện — tên người báo cáo"></div>
      </div>

      <div style="font-size:11px;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:.06em;margin:16px 0 10px;padding-bottom:6px;border-bottom:1px solid var(--border)">II. Thiệt hại về người</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
        ${[['drDead','Chết (người)','0'],['drMissing','Mất tích (người)','0'],['drInjured','Bị thương (người)','0'],['drEvacuated','Di dời/sơ tán (người)','0']].map(([id,l,p])=>`
        <div class="form-group"><label class="form-label">${l}</label>
          <input id="${id}" class="form-control" type="number" min="0" placeholder="${p}" value="0"></div>`).join('')}
      </div>

      <div style="font-size:11px;font-weight:700;color:var(--yellow);text-transform:uppercase;letter-spacing:.06em;margin:16px 0 10px;padding-bottom:6px;border-bottom:1px solid var(--border)">III. Nhà ở</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
        ${[['drHouseC','Nhà sập hoàn toàn (cái)'],['drHouseD','Nhà bị hư hỏng (cái)'],['drHouseV','Ước giá trị thiệt hại (triệu đ)']].map(([id,l])=>`
        <div class="form-group"><label class="form-label">${l}</label>
          <input id="${id}" class="form-control" type="number" min="0" value="0"></div>`).join('')}
      </div>

      <div style="font-size:11px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:.06em;margin:16px 0 10px;padding-bottom:6px;border-bottom:1px solid var(--border)">IV. Nông nghiệp</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
        ${[['drRice','DT lúa ngập/hỏng (ha)'],['drCrop','DT hoa màu (ha)'],['drFish','Thủy sản (ha)']].map(([id,l])=>`
        <div class="form-group"><label class="form-label">${l}</label>
          <input id="${id}" class="form-control" type="number" min="0" step="0.1" value="0"></div>`).join('')}
      </div>

      <div style="font-size:11px;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:.06em;margin:16px 0 10px;padding-bottom:6px;border-bottom:1px solid var(--border)">V. Đê điều</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
        ${[['drDikeN','Số vị trí sự cố (điểm)'],['drDikeL','Chiều dài sạt trượt (m)'],['drDikeCost','Kinh phí xử lý (triệu đ)']].map(([id,l])=>`
        <div class="form-group"><label class="form-label">${l}</label>
          <input id="${id}" class="form-control" type="number" min="0" value="0"></div>`).join('')}
      </div>

      <div style="font-size:11px;font-weight:700;color:var(--purple);text-transform:uppercase;letter-spacing:.06em;margin:16px 0 10px;padding-bottom:6px;border-bottom:1px solid var(--border)">VI. Hạ tầng</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
        ${[['drRoad','Đường hư hỏng (km)'],['drBridge','Cầu/Cống hư (cái)'],['drElec','Trạm điện sự cố (trạm)']].map(([id,l])=>`
        <div class="form-group"><label class="form-label">${l}</label>
          <input id="${id}" class="form-control" type="number" min="0" step="0.1" value="0"></div>`).join('')}
      </div>

      <div style="font-size:11px;font-weight:700;color:var(--cyan);text-transform:uppercase;letter-spacing:.06em;margin:16px 0 10px;padding-bottom:6px;border-bottom:1px solid var(--border)">VII. Tổng hợp</div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Tổng thiệt hại ước tính (tỷ đồng) *</label>
          <input id="drTotal" class="form-control" type="number" step="0.01" min="0" placeholder="Tổng ước tính"></div>
        <div class="form-group"><label class="form-label">Ghi chú / Bổ sung</label>
          <input id="drNote" class="form-control" placeholder="Thông tin bổ sung..."></div>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px">
        <button class="btn btn-ghost" onclick="drSwitchTab('records')">Xem hồ sơ đã lưu</button>
        <button class="btn btn-outline" onclick="drSaveRecord(true)">Lưu nháp</button>
        <button class="btn btn-primary" onclick="drSaveRecord(false)">Lưu & Gửi duyệt</button>
      </div>
    </div>
  </div>`;
}

function _drRecords() {
  return `
  <div class="card" style="padding:0">
    <div class="card-header"><span class="card-title">Hồ sơ báo cáo thiệt hại năm 2026</span></div>
    <div class="table-wrap"><table>
      <thead><tr><th>Mã BC</th><th>Ngày</th><th>Loại TT</th><th>Địa bàn</th><th>Người (chết/sơ tán)</th><th>Nhà (sập/hỏng)</th><th>Lúa (ha)</th><th>Đê (điểm SC)</th><th>Tổng TH (tỷ)</th><th>Trạng thái</th><th></th></tr></thead>
      <tbody>${DR_RECORDS.map(r=>`<tr>
        <td class="mono" style="color:var(--cyan);font-size:12px">${r.id}</td>
        <td class="mono" style="font-size:11px;color:var(--muted)">${r.date}</td>
        <td style="font-size:12px;font-weight:600">${r.event}</td>
        <td style="font-size:12px">${r.district}</td>
        <td><span style="color:${r.dead>0?'#f87171':'var(--muted)'}" class="mono">${r.dead}</span>/<span class="mono" style="color:var(--yellow)">${r.evacuated}</span></td>
        <td class="mono">${r.houseCollapsed}/${r.houseDamaged}</td>
        <td class="mono">${r.riceDamaged}</td>
        <td class="mono">${r.dikeIncidents}</td>
        <td><span style="font-size:14px;font-weight:700;color:${r.totalEstimate>2?'var(--yellow)':'var(--muted)'}">${r.totalEstimate.toFixed(2)}</span></td>
        <td><span class="badge ${r.approved?'badge-green':'badge-gray'}" style="font-size:10px">${r.approved?'Đã duyệt':'Chờ duyệt'}</span></td>
        <td><div style="display:flex;gap:4px">
          <button class="btn btn-ghost btn-xs" onclick="drViewRecord('${r.id}')">Xem</button>
          <button class="btn btn-ghost btn-xs" onclick="drExportRecord('${r.id}')">PDF</button>
        </div></td>
      </tr>`).join('')}</tbody>
    </table></div>
  </div>`;
}

function _drSummary() {
  const totalDead = DR_RECORDS.reduce((s,r)=>s+r.dead,0);
  const totalMissing = DR_RECORDS.reduce((s,r)=>s+r.missing,0);
  const totalInjured = DR_RECORDS.reduce((s,r)=>s+r.injured,0);
  const totalEvac = DR_RECORDS.reduce((s,r)=>s+r.evacuated,0);
  const totalHouseC = DR_RECORDS.reduce((s,r)=>s+r.houseCollapsed,0);
  const totalHouseD = DR_RECORDS.reduce((s,r)=>s+r.houseDamaged,0);
  const totalRice = DR_RECORDS.reduce((s,r)=>s+r.riceDamaged,0);
  const totalCrop = DR_RECORDS.reduce((s,r)=>s+r.cropDamaged,0);
  const totalDike = DR_RECORDS.reduce((s,r)=>s+r.dikeIncidents,0);
  const totalDmg = DR_RECORDS.reduce((s,r)=>s+r.totalEstimate,0);

  const rows = [
    ['I. NGƯỜI','',''],
    ['1. Chết', totalDead, 'người'],
    ['2. Mất tích', totalMissing, 'người'],
    ['3. Bị thương', totalInjured, 'người'],
    ['4. Di dời / Sơ tán', totalEvac, 'người'],
    ['II. NHÀ Ở','',''],
    ['1. Nhà sập hoàn toàn', totalHouseC, 'cái'],
    ['2. Nhà bị hư hỏng', totalHouseD, 'cái'],
    ['III. NÔNG NGHIỆP','',''],
    ['1. DT lúa ngập/hỏng', totalRice, 'ha'],
    ['2. Hoa màu', totalCrop, 'ha'],
    ['IV. ĐÊ ĐIỀU','',''],
    ['1. Số vị trí sự cố', totalDike, 'điểm'],
    ['V. TỔNG THIỆT HẠI', totalDmg.toFixed(2), 'tỷ đồng'],
  ];

  return `
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
    <div class="card">
      <div class="card-header"><span class="card-title">Tổng hợp thiệt hại PCTT — ${new Date().getFullYear()}</span></div>
      <div style="padding:0 16px 16px">
        <table style="width:100%;border-collapse:collapse">
          <tbody>
            ${rows.map(([label,val,unit])=>val===''?`
            <tr><td colspan="3" style="padding:10px 0 4px;font-size:11px;font-weight:700;color:var(--cyan);text-transform:uppercase;letter-spacing:.05em">${label}</td></tr>`:`
            <tr style="border-bottom:1px solid rgba(255,255,255,.05)">
              <td style="padding:7px 0;font-size:12px;padding-left:12px;color:rgba(255,255,255,.7)">${label}</td>
              <td style="font-size:14px;font-weight:700;text-align:right;color:${Number(val)>0?'var(--yellow)':'var(--muted)'}">${val}</td>
              <td style="font-size:11px;color:var(--muted);padding-left:6px">${unit}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">AI Soạn thảo báo cáo</span></div>
      <div style="padding:0 16px 16px">
        <div style="font-size:12px;color:var(--muted);line-height:1.7;margin-bottom:14px">
          AI có thể tự động soạn thảo <strong style="color:var(--text)">báo cáo thiệt hại chính thức</strong> gửi Sở NN&amp;PTNT / UBND TP từ dữ liệu đã nhập, theo đúng mẫu quy định.
        </div>
        ${[['Báo cáo nhanh (tóm tắt)','Gửi ngay trong ngày xảy ra sự cố','var(--cyan)'],
           ['Báo cáo chi tiết','Đầy đủ theo mẫu Bộ NN&PTNT','var(--yellow)'],
           ['Báo cáo tháng PCTT','Tổng hợp thiệt hại trong tháng','var(--green)']].map(([t,d,c])=>`
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:8px;margin-bottom:8px">
          <div>
            <div style="font-size:12px;font-weight:700;color:${c}">${t}</div>
            <div style="font-size:11px;color:var(--muted);margin-top:2px">${d}</div>
          </div>
          <button class="btn btn-ghost btn-xs" onclick="drAIGenerateReport('${t}')">AI soạn</button>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}

window.drSwitchTab = function(tab) {
  drTab = tab;
  const el = document.getElementById('drTabContent');
  if (el) el.innerHTML = _renderDrTab();
  document.querySelectorAll('.tab-btn').forEach(b => {
    const map={form:'Nhập liệu',records:'Hồ sơ',summary:'Tổng hợp'};
    b.classList.toggle('active', b.textContent.trim().startsWith(map[tab]?.substring(0,6)||'__'));
  });
};

window.drSaveRecord = function(draft) {
  const event = document.getElementById('drEvent')?.value;
  const district = document.getElementById('drDistrict')?.value;
  if (!event || !district) { showToast('⚠ Vui lòng chọn loại thiên tai và địa bàn!'); return; }
  const newRec = {
    id: 'DR-' + String(DR_RECORDS.length+1).padStart(3,'0'),
    date: new Date().toLocaleDateString('vi-VN'),
    event, district,
    dead: parseInt(document.getElementById('drDead')?.value)||0,
    missing: parseInt(document.getElementById('drMissing')?.value)||0,
    injured: parseInt(document.getElementById('drInjured')?.value)||0,
    evacuated: parseInt(document.getElementById('drEvacuated')?.value)||0,
    houseCollapsed: parseInt(document.getElementById('drHouseC')?.value)||0,
    houseDamaged: parseInt(document.getElementById('drHouseD')?.value)||0,
    houseValue: parseFloat(document.getElementById('drHouseV')?.value)||0,
    riceDamaged: parseFloat(document.getElementById('drRice')?.value)||0,
    cropDamaged: parseFloat(document.getElementById('drCrop')?.value)||0,
    fishDamaged: parseFloat(document.getElementById('drFish')?.value)||0,
    dikeIncidents: parseInt(document.getElementById('drDikeN')?.value)||0,
    dikeDamageLen: parseFloat(document.getElementById('drDikeL')?.value)||0,
    dikeRepairCost: parseFloat(document.getElementById('drDikeCost')?.value)||0,
    roadDamaged: parseFloat(document.getElementById('drRoad')?.value)||0,
    bridgeDamaged: parseInt(document.getElementById('drBridge')?.value)||0,
    electricDamaged: parseInt(document.getElementById('drElec')?.value)||0,
    totalEstimate: parseFloat(document.getElementById('drTotal')?.value)||0,
    approved: !draft,
    reporter: document.getElementById('drReporter')?.value||'—',
  };
  DR_RECORDS.unshift(newRec);
  showToast(draft?`📝 Đã lưu nháp báo cáo ${newRec.id}`:`✅ Báo cáo ${newRec.id} — ${event} tại ${district} đã gửi duyệt!`);
  drSwitchTab('records');
};

window.drViewRecord = function(id) {
  const r = DR_RECORDS.find(x=>x.id===id); if(!r) return;
  openModal(`
  <div class="modal-header"><span class="modal-title">Báo cáo thiệt hại ${r.id}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body" style="max-height:75vh;overflow-y:auto">
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px">
      ${[['Ngày xảy ra',r.date],['Loại thiên tai',r.event],['Địa bàn',r.district],['Trạng thái',r.approved?'✅ Đã duyệt':'⏳ Chờ duyệt'],['Người báo cáo',r.reporter],['Tổng thiệt hại',r.totalEstimate.toFixed(2)+' tỷ đồng']].map(([l,v])=>`
      <div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px;padding:10px">
        <div style="font-size:10px;color:var(--muted)">${l}</div>
        <div style="font-size:13px;font-weight:600;margin-top:2px">${v}</div>
      </div>`).join('')}
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <tbody>
        ${[['Người chết',r.dead,'người'],['Mất tích',r.missing,'người'],['Bị thương',r.injured,'người'],['Di dời',r.evacuated,'người'],
           ['Nhà sập',r.houseCollapsed,'cái'],['Nhà hỏng',r.houseDamaged,'cái'],
           ['Lúa ngập',r.riceDamaged,'ha'],['Hoa màu',r.cropDamaged,'ha'],
           ['Sự cố đê',r.dikeIncidents,'điểm'],['Sạt trượt',r.dikeDamageLen,'m'],
           ['Đường hỏng',r.roadDamaged,'km'],['Cầu/cống',r.bridgeDamaged,'cái']].map(([l,v,u])=>`
        <tr style="border-bottom:1px solid rgba(255,255,255,.05)">
          <td style="padding:6px 4px;color:var(--muted)">${l}</td>
          <td style="font-weight:700;color:${Number(v)>0?'var(--yellow)':'var(--muted)'};text-align:right">${v}</td>
          <td style="color:var(--muted);padding-left:6px">${u}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-outline" onclick="closeModal();drExportRecord('${r.id}')">Xuất PDF</button>
    ${!r.approved?`<button class="btn btn-primary" onclick="r.approved=true;closeModal();showToast('✅ Đã phê duyệt!')">Phê duyệt</button>`:''}
  </div>`);
};

window.drExportRecord = function(id) {
  showToast(`📄 Xuất PDF báo cáo thiệt hại ${id}...`);
};

window.drExportReport = function() {
  const headers = ['Mã BC','Ngày','Loại thiên tai','Địa bàn','Chết','Mất tích','Sơ tán','Nhà sập','Nhà hỏng','Lúa (ha)','Đê (điểm)','Tổng TH (tỷ)','Trạng thái'];
  const rows = DR_RECORDS.map(r=>[r.id,r.date,r.event,r.district,r.dead,r.missing,r.evacuated,r.houseCollapsed,r.houseDamaged,r.riceDamaged,r.dikeIncidents,r.totalEstimate.toFixed(2),r.approved?'Duyệt':'Nháp']);
  const csv = [headers,...rows].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href=url; a.download=`ThietHai_PCTT_${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
  showToast('✅ Đã xuất báo cáo thiệt hại!');
};

window.drOpenForm = function() { drSwitchTab('form'); };

window.drAIGenerateReport = function(type) {
  const totalDead = DR_RECORDS.reduce((s,r)=>s+r.dead,0);
  const totalEvac = DR_RECORDS.reduce((s,r)=>s+r.evacuated,0);
  const totalDmg = DR_RECORDS.reduce((s,r)=>s+r.totalEstimate,0).toFixed(2);
  openModal(`
  <div class="modal-header"><span class="modal-title" style="color:#a78bfa">AI Soạn thảo — ${type}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:10px;padding:16px;font-size:12px;line-height:1.8;color:rgba(255,255,255,.75);white-space:pre-line">
<strong style="color:var(--text);font-size:13px">BÁO CÁO TÌNH HÌNH THIỆT HẠI DO THIÊN TAI</strong>
<span style="color:var(--muted);font-size:11px">Chi cục Thủy lợi & PCTT Hà Nội — Năm ${new Date().getFullYear()}</span>

Căn cứ số liệu tổng hợp từ các quận, huyện, Chi cục Thủy lợi & PCTT Hà Nội báo cáo tình hình thiệt hại do thiên tai như sau:

1. TÌNH HÌNH CHUNG:
Trong thời gian qua, trên địa bàn thành phố Hà Nội đã xảy ra ${DR_RECORDS.length} vụ thiên tai tại các địa bàn: ${[...new Set(DR_RECORDS.map(r=>r.district))].join(', ')}.

2. THIỆT HẠI VỀ NGƯỜI:
- Chết: ${totalDead} người
- Sơ tán/Di dời: ${totalEvac} người

3. TỔNG THIỆT HẠI ƯỚC TÍNH: <strong style="color:var(--yellow)">${totalDmg} tỷ đồng</strong>

4. CÁC BIỆN PHÁP ĐÃ THỰC HIỆN:
Chi cục đã chỉ đạo các đơn vị triển khai phương án ứng phó, huy động lực lượng 4 tại chỗ, xử lý các điểm sự cố đê điều.

(Nội dung báo cáo được AI tổng hợp từ dữ liệu hệ thống. Cán bộ nghiệp vụ cần kiểm tra và chỉnh sửa trước khi phát hành chính thức.)
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('✅ Đã sao chép nội dung báo cáo!')">Sao chép</button>
  </div>`);
};

// ── PATCH: drExportRecord — Real print preview + PDF modal ────────

window.drExportRecord = function(id) {
  const r = DR_RECORDS.find(x=>x.id===id); if(!r) return;
  openModal(`
  <div class="modal-header">
    <span class="modal-title">In / Xuất báo cáo thiệt hại — ${r.id}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body" style="max-height:80vh;overflow-y:auto">
    <!-- letterhead -->
    <div style="text-align:center;padding:12px;border-bottom:2px solid var(--border);margin-bottom:14px">
      <div style="font-size:11px;color:var(--muted)">ỦY BAN NHÂN DÂN THÀNH PHỐ HÀ NỘI</div>
      <div style="font-size:11px;color:var(--muted)">CHI CỤC THỦY LỢI & PHÒNG CHỐNG THIÊN TAI</div>
      <div style="font-size:15px;font-weight:800;color:var(--text);margin:6px 0">BÁO CÁO THIỆT HẠI DO THIÊN TAI</div>
      <div style="font-size:11px;color:var(--muted)">Mã: ${r.id} — Ngày: ${r.date}</div>
    </div>

    <!-- Summary grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      ${[['Loại thiên tai',r.event],['Địa bàn',r.district],['Ngày xảy ra',r.date],
         ['Đơn vị báo cáo',r.reporter],['Tổng thiệt hại',r.totalEstimate.toFixed(2)+' tỷ đồng'],
         ['Trạng thái',r.approved?'✅ Đã phê duyệt':'⏳ Chờ duyệt']].map(([l,v])=>`
      <div style="padding:8px 10px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:6px">
        <div style="font-size:10px;color:var(--muted)">${l}</div>
        <div style="font-size:12px;font-weight:600;margin-top:2px">${v}</div>
      </div>`).join('')}
    </div>

    <!-- Damage breakdown table -->
    <div style="font-size:11px;font-weight:700;color:var(--cyan);margin-bottom:8px">BẢNG TỔNG HỢP THIỆT HẠI:</div>
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <thead><tr style="background:rgba(255,255,255,.04)">
        <th style="padding:7px 10px;text-align:left;border:1px solid var(--border)">Hạng mục</th>
        <th style="padding:7px 10px;text-align:right;border:1px solid var(--border)">Số lượng</th>
        <th style="padding:7px 10px;text-align:left;border:1px solid var(--border)">Đơn vị</th>
      </thead>
      <tbody>
        ${[['I. VỀ NGƯỜI','',''],
           ['Chết',r.dead,'người'],['Mất tích',r.missing,'người'],['Bị thương',r.injured,'người'],['Di dời/Sơ tán',r.evacuated,'người'],
           ['II. NHÀ Ở','',''],
           ['Nhà sập hoàn toàn',r.houseCollapsed,'cái'],['Nhà bị hư hỏng',r.houseDamaged,'cái'],['Giá trị thiệt hại về nhà',r.houseValue,'triệu đồng'],
           ['III. NÔNG NGHIỆP','',''],
           ['Diện tích lúa ngập/hỏng',r.riceDamaged,'ha'],['Diện tích hoa màu',r.cropDamaged,'ha'],['Thủy sản',r.fishDamaged,'ha'],
           ['IV. ĐÊ ĐIỀU','',''],
           ['Số vị trí sự cố',r.dikeIncidents,'điểm'],['Chiều dài sạt trượt',r.dikeDamageLen,'m'],['Kinh phí xử lý đê',r.dikeRepairCost,'triệu đồng'],
           ['V. HẠ TẦNG','',''],
           ['Đường hư hỏng',r.roadDamaged,'km'],['Cầu/cống hư',r.bridgeDamaged,'cái'],['Trạm điện sự cố',r.electricDamaged,'trạm'],
           ['VI. TỔNG THIỆT HẠI ƯỚC TÍNH',r.totalEstimate.toFixed(2),'tỷ đồng']
        ].map(([l,v,u])=>v===''?`
        <tr style="background:rgba(0,200,255,.06)"><td colspan="3" style="padding:6px 10px;font-size:11px;font-weight:700;color:var(--cyan);border:1px solid var(--border)">${l}</td></tr>`:`
        <tr style="border-bottom:1px solid rgba(255,255,255,.05)">
          <td style="padding:6px 10px;border:1px solid var(--border);padding-left:16px">${l}</td>
          <td style="padding:6px 10px;text-align:right;font-weight:700;color:${Number(v)>0?'var(--yellow)':'var(--muted)'};border:1px solid var(--border)">${v}</td>
          <td style="padding:6px 10px;color:var(--muted);font-size:11px;border:1px solid var(--border)">${u}</td>
        </tr>`).join('')}
      </tbody>
    </table>

    <!-- Sign area -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:18px;text-align:center">
      <div style="padding:12px 16px;border:1px solid var(--border);border-radius:8px">
        <div style="font-size:10px;color:var(--muted);margin-bottom:24px">Người lập báo cáo</div>
        <div style="font-size:11px;font-weight:600">${r.reporter}</div>
      </div>
      <div style="padding:12px 16px;border:1px solid var(--border);border-radius:8px">
        <div style="font-size:10px;color:var(--muted);margin-bottom:24px">Chi cục trưởng phê duyệt</div>
        <div style="font-size:11px;color:var(--muted)">${r.approved?'Đã ký duyệt':'(Chờ ký)'}</div>
      </div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    ${!r.approved?`<button class="btn btn-outline" onclick="DR_RECORDS.find(x=>x.id==='${r.id}')&&(DR_RECORDS.find(x=>x.id==='${r.id}').approved=true);closeModal();showToast('✅ Đã phê duyệt báo cáo ${r.id}!')">Phê duyệt</button>`:''}
    <button class="btn btn-primary" onclick="drPrintRecord('${r.id}')">In / Lưu PDF</button>
  </div>`, 'modal-wide');
};

window.drPrintRecord = function(id) {
  const r = DR_RECORDS.find(x=>x.id===id); if(!r) return;
  const w = window.open('','_blank','width=800,height=1000');
  w.document.write(`<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8">
    <title>BC Thiệt hại ${r.id}</title>
    <style>body{font-family:Arial,sans-serif;padding:24px;color:#111;font-size:13px}
    h2{text-align:center;font-size:17px;margin:6px 0}
    table{width:100%;border-collapse:collapse;margin:10px 0}td,th{border:1px solid #ccc;padding:7px 10px;font-size:12px}
    th{background:#f5f5f5;text-align:left}.section-header{background:#e8f4fd;font-weight:bold}
    .sign{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:30px}
    .sign-box{border:1px solid #ccc;padding:16px;text-align:center;min-height:80px}
    @media print{button{display:none}}</style></head><body>
    <div style="text-align:center">
    <p>ỦY BAN NHÂN DÂN THÀNH PHỐ HÀ NỘI<br>CHI CỤC THỦY LỢI &amp; PHÒNG CHỐNG THIÊN TAI</p>
    <h2>BÁO CÁO THIỆT HẠI DO THIÊN TAI</h2>
    <p><small>Mã: ${r.id} — Ngày báo cáo: ${r.date} — Đơn vị: ${r.reporter}</small></p></div>
    <table><tr><td><b>Loại thiên tai:</b> ${r.event}</td><td><b>Địa bàn:</b> ${r.district}</td></tr>
    <tr><td colspan="2"><b>Ước tính tổng thiệt hại: ${r.totalEstimate.toFixed(2)} tỷ đồng</b></td></tr></table>
    <h3>BẢNG TỔNG HỢP THIỆT HẠI</h3>
    <table><thead><tr><th>Hạng mục</th><th style="text-align:right">Số lượng</th><th>Đơn vị</th></tr></thead><tbody>
    <tr class="section-header"><td colspan="3">I. Về người</td></tr>
    <tr><td style="padding-left:16px">Chết</td><td style="text-align:right">${r.dead}</td><td>người</td></tr>
    <tr><td style="padding-left:16px">Mất tích</td><td style="text-align:right">${r.missing}</td><td>người</td></tr>
    <tr><td style="padding-left:16px">Bị thương</td><td style="text-align:right">${r.injured}</td><td>người</td></tr>
    <tr><td style="padding-left:16px">Di dời/Sơ tán</td><td style="text-align:right">${r.evacuated}</td><td>người</td></tr>
    <tr class="section-header"><td colspan="3">II. Nhà ở</td></tr>
    <tr><td style="padding-left:16px">Nhà sập</td><td style="text-align:right">${r.houseCollapsed}</td><td>cái</td></tr>
    <tr><td style="padding-left:16px">Nhà hư hỏng</td><td style="text-align:right">${r.houseDamaged}</td><td>cái</td></tr>
    <tr class="section-header"><td colspan="3">III. Nông nghiệp</td></tr>
    <tr><td style="padding-left:16px">Lúa ngập/hỏng</td><td style="text-align:right">${r.riceDamaged}</td><td>ha</td></tr>
    <tr><td style="padding-left:16px">Hoa màu</td><td style="text-align:right">${r.cropDamaged}</td><td>ha</td></tr>
    <tr class="section-header"><td colspan="3">IV. Đê điều</td></tr>
    <tr><td style="padding-left:16px">Sự cố đê</td><td style="text-align:right">${r.dikeIncidents}</td><td>điểm</td></tr>
    <tr><td style="padding-left:16px">Sạt trượt</td><td style="text-align:right">${r.dikeDamageLen}</td><td>m</td></tr>
    <tr class="section-header"><td colspan="3">V. Hạ tầng</td></tr>
    <tr><td style="padding-left:16px">Đường hỏng</td><td style="text-align:right">${r.roadDamaged}</td><td>km</td></tr>
    <tr><td style="padding-left:16px">Cầu/cống</td><td style="text-align:right">${r.bridgeDamaged}</td><td>cái</td></tr>
    <tr style="background:#fff3cd;font-weight:bold"><td>TỔNG THIỆT HẠI ƯỚC TÍNH</td><td style="text-align:right">${r.totalEstimate.toFixed(2)}</td><td>tỷ đồng</td></tr>
    </tbody></table>
    <div class="sign">
    <div class="sign-box"><small>Người lập báo cáo</small><br><br><b>${r.reporter}</b></div>
    <div class="sign-box"><small>Chi cục trưởng phê duyệt</small><br><br>${r.approved?'Đã ký duyệt':'(Chờ ký)'}</div>
    </div>
    <script>window.print();</scr`+'ipt></body></html>');
  w.document.close();
};

// ── EXCEL / CSV IMPORT ────────────────────────────────────────────

// Column definitions (must match template order)
const DR_IMPORT_HEADERS = [
  'Loại thiên tai',      // 0
  'Địa bàn',             // 1
  'Thời điểm xảy ra',   // 2 (dd/mm/yyyy or yyyy-mm-dd)
  'Đơn vị báo cáo',     // 3
  'Chết (người)',        // 4
  'Mất tích (người)',    // 5
  'Bị thương (người)',   // 6
  'Di dời/Sơ tán (người)', // 7
  'Nhà sập hoàn toàn (cái)', // 8
  'Nhà bị hư hỏng (cái)',    // 9
  'Giá trị nhà hỏng (triệu đ)', // 10
  'Lúa ngập/hỏng (ha)',  // 11
  'Hoa màu (ha)',         // 12
  'Thủy sản (ha)',        // 13
  'Sự cố đê (điểm)',     // 14
  'Sạt trượt đê (m)',    // 15
  'Sửa chữa đê (triệu đ)', // 16
  'Đường hỏng (km)',     // 17
  'Cầu/Cống hỏng (cái)', // 18
  'Điện sự cố (trạm)',   // 19
  'Tổng thiệt hại (tỷ đ)', // 20
  'Ghi chú',              // 21
];

const DR_IMPORT_EVENTS = ['Mưa lớn','Lũ sông','Lốc xoáy','Sạt lở đất','Hạn hán','Ngập úng đô thị'];
const DR_IMPORT_DISTRICTS = ['Ba Vì','Chương Mỹ','Đan Phượng','Đông Anh','Gia Lâm','Hoài Đức','Mê Linh','Mỹ Đức',
  'Phú Xuyên','Phúc Thọ','Quốc Oai','Sóc Sơn','Thạch Thất','Thanh Oai','Thanh Trì','Thường Tín','Ứng Hòa',
  'Ba Đình','Cầu Giấy','Đống Đa','Hà Đông','Hai Bà Trưng','Hoàn Kiếm','Hoàng Mai','Long Biên','Tây Hồ','Thanh Xuân'];

/** Download template CSV */
window.drDownloadTemplate = function() {
  const sampleRows = [
    ['Mưa lớn', 'Chương Mỹ', '12/03/2026', 'Phòng PCTT Chương Mỹ',
     '0','0','2','450',
     '0','38','850',
     '120','45','8',
     '2','180','1200',
     '2.5','1','0',
     '4.2', ''],
    ['Lốc xoáy', 'Đông Anh', '10/03/2026', 'Phòng PCTT Đông Anh',
     '0','0','1','80',
     '2','12','420',
     '0','15','0',
     '0','0','0',
     '0','0','1',
     '0.9', 'Tập trung tại xã Vân Hà'],
  ];
  downloadImportTemplate(
    `Template_BaoCaoThietHai_PCTT_${new Date().toISOString().slice(0,10)}.csv`,
    DR_IMPORT_HEADERS,
    sampleRows
  );
};

/** Trigger file picker → parse → validate → preview → apply */
window.drImportExcel = function() {
  triggerImportFilePicker(function(fileName, parsedRows) {
    if (!parsedRows || parsedRows.length < 2) {
      showToast('⚠ File không có dữ liệu hoặc định dạng không đúng!');
      return;
    }

    // First row = header, remaining = data
    const headerRow = parsedRows[0];
    const dataRows  = parsedRows.slice(1).filter(r => r.some(c => c.trim() !== ''));

    if (dataRows.length === 0) {
      showToast('⚠ Không tìm thấy hàng dữ liệu trong file!');
      return;
    }

    // Per-column validators (index matches DR_IMPORT_HEADERS)
    const validators = DR_IMPORT_HEADERS.map((_, ci) => {
      if (ci === 0) return (v) => {
        if (!v || !v.trim()) return 'Bắt buộc';
        // Accept any value including ones not in list
        return null;
      };
      if (ci === 1) return (v) => {
        if (!v || !v.trim()) return 'Bắt buộc';
        return null;
      };
      if (ci === 2) return (v) => {
        if (!v || !v.trim()) return null; // optional
        return null;
      };
      if ([4,5,6,7,8,9,14,18,19].includes(ci)) return (v) => {
        if (v === '' || v === undefined) return null;
        if (isNaN(Number(v)) || Number(v) < 0) return 'Phải là số nguyên ≥ 0';
        return null;
      };
      if ([10,11,12,13,15,16,17,20].includes(ci)) return (v) => {
        if (v === '' || v === undefined) return null;
        if (isNaN(Number(v)) || Number(v) < 0) return 'Phải là số thực ≥ 0';
        return null;
      };
      return null;
    });

    showImportConfirmModal({
      title: 'Xác nhận nhập liệu — Báo cáo Thiệt hại PCTT',
      fileName,
      headers: DR_IMPORT_HEADERS,
      rows: dataRows,
      validators,
      displayCols: [
        'Loại thiên tai', 'Địa bàn', 'Thời điểm xảy ra', 'Đơn vị báo cáo',
        'Chết (người)', 'Di dời/Sơ tán (người)', 'Lúa ngập/hỏng (ha)',
        'Sự cố đê (điểm)', 'Tổng thiệt hại (tỷ đ)',
      ],
      onConfirm: function(rows) {
        drApplyImportedRows(rows);
      },
      width: '92vw',
    });
  });
};

/** Convert validated CSV row arrays → DR_RECORDS objects and prepend */
window.drApplyImportedRows = function(rows) {
  let added = 0;
  rows.forEach((row) => {
    const n = (i, def = 0) => {
      const v = parseFloat(String(row[i] || '').replace(',','.'));
      return isNaN(v) ? def : v;
    };
    const ni = (i, def = 0) => Math.round(n(i, def));

    // Parse date — accept dd/mm/yyyy, dd-mm-yyyy, yyyy-mm-dd
    let dateStr = (row[2] || '').trim();
    if (!dateStr) dateStr = new Date().toLocaleDateString('vi-VN');
    // Normalize yyyy-mm-dd → dd/mm/yyyy
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [y, mo, d] = dateStr.split('-');
      dateStr = `${d}/${mo}/${y}`;
    }

    const rec = {
      id: 'DR-' + String(DR_RECORDS.length + added + 1).padStart(3,'0'),
      date: dateStr,
      event: (row[0] || 'Mưa lớn').trim(),
      district: (row[1] || '').trim(),
      dead: ni(4),
      missing: ni(5),
      injured: ni(6),
      evacuated: ni(7),
      houseCollapsed: ni(8),
      houseDamaged: ni(9),
      houseValue: n(10),
      riceDamaged: n(11),
      cropDamaged: n(12),
      fishDamaged: n(13),
      dikeIncidents: ni(14),
      dikeDamageLen: n(15),
      dikeRepairCost: n(16),
      roadDamaged: n(17),
      bridgeDamaged: ni(18),
      electricDamaged: ni(19),
      totalEstimate: n(20),
      approved: false,
      reporter: (row[3] || '—').trim(),
    };
    DR_RECORDS.unshift(rec);
    added++;
  });

  // Refresh view
  drSwitchTab('records');
  showToast(
    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg>` +
    ` Đã nhập thành công <b>${added}</b> báo cáo thiệt hại từ file Excel!`
  );
};

