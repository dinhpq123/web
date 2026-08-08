// ── HADIWA IOC — Cổng Báo cáo Cấp Xã (communeReporting.js) ───────
let _crTab = 'fund';

// ── Mock data ─────────────────────────────────────────────────────
const CR_COMMUNES = [
  { id:'XA-BV-01', name:'Xã Ba Vì',      district:'H. Ba Vì',    pop:4820, contact:'Nguyễn Văn An',    phone:'0912.345.678' },
  { id:'XA-BV-02', name:'Xã Chu Minh',   district:'H. Ba Vì',    pop:5310, contact:'Trần Thị Bình',    phone:'0912.456.789' },
  { id:'XA-BV-03', name:'Xã Tản Hồng',   district:'H. Ba Vì',    pop:3980, contact:'Lê Văn Cường',     phone:'0913.567.890' },
  { id:'XA-MY-01', name:'Xã Đại Nghĩa',  district:'H. Mỹ Đức',  pop:6200, contact:'Phạm Thị Dung',    phone:'0914.678.901' },
  { id:'XA-MY-02', name:'Xã Hương Sơn',  district:'H. Mỹ Đức',  pop:7100, contact:'Hoàng Văn Em',     phone:'0915.789.012' },
  { id:'XA-CM-01', name:'Xã Chương Dương',district:'H. Chương Mỹ',pop:4500, contact:'Vũ Thị Phương',  phone:'0916.890.123' },
  { id:'XA-PT-01', name:'Xã Vĩnh Tường', district:'H. Phúc Thọ', pop:3200, contact:'Đỗ Minh Quân',    phone:'0917.901.234' },
];

const CR_FUND_DATA = [
  { communeId:'XA-BV-01', year:2026, quota: 72.3, collected: 68.4, status:'partial'  },
  { communeId:'XA-BV-02', year:2026, quota: 79.7, collected: 79.7, status:'complete' },
  { communeId:'XA-BV-03', year:2026, quota: 59.7, collected: 42.1, status:'partial'  },
  { communeId:'XA-MY-01', year:2026, quota: 93.0, collected: 93.0, status:'complete' },
  { communeId:'XA-MY-02', year:2026, quota:106.5, collected: 85.3, status:'partial'  },
  { communeId:'XA-CM-01', year:2026, quota: 67.5, collected:  0,   status:'pending'  },
  { communeId:'XA-PT-01', year:2026, quota: 48.0, collected: 48.0, status:'complete' },
];

const CR_DAMAGE_REPORTS = [
  { id:'BC-TH-001', communeId:'XA-BV-01', date:'24/03/2026', event:'Lũ sông Đà cấp 2', housesDamaged:12, crops:8.5, livestockDead:24, infra:'Sạt 30m đê bờ kênh', totalEstimate:285, status:'submitted' },
  { id:'BC-TH-002', communeId:'XA-MY-01', date:'23/03/2026', event:'Mưa lớn ngập úng', housesDamaged:5,  crops:3.2, livestockDead:0,  infra:'Hư hỏng 1km đường liên thôn', totalEstimate:95, status:'approved' },
  { id:'BC-TH-003', communeId:'XA-BV-02', date:'22/03/2026', event:'Lũ cục bộ', housesDamaged:8, crops:5.8, livestockDead:12, infra:'Ngập 2 cầu tràn', totalEstimate:156, status:'submitted' },
  { id:'BC-TH-004', communeId:'XA-CM-01', date:'20/03/2026', event:'Lốc xoáy', housesDamaged:3,  crops:1.1, livestockDead:0,  infra:'Sập 1 nhà kho', totalEstimate:42, status:'draft' },
];

const CR_RESOURCES_4TC = [
  { communeId:'XA-BV-01', forces:85, forceReady:72, boats:4, pumps:3, food:15, funds:180 },
  { communeId:'XA-BV-02', forces:92, forceReady:80, boats:3, pumps:2, food:12, funds:210 },
  { communeId:'XA-BV-03', forces:60, forceReady:48, boats:2, pumps:1, food:8,  funds:95  },
  { communeId:'XA-MY-01', forces:110, forceReady:95, boats:6, pumps:4, food:20, funds:290 },
  { communeId:'XA-MY-02', forces:125, forceReady:108, boats:7, pumps:5, food:25, funds:340 },
  { communeId:'XA-CM-01', forces:72, forceReady:60, boats:3, pumps:2, food:10, funds:128 },
  { communeId:'XA-PT-01', forces:55, forceReady:44, boats:2, pumps:1, food:7,  funds:80  },
];

// ── Main render ──────────────────────────────────────────────────
function renderCommuneReporting() {
  const totalPop = CR_COMMUNES.reduce((s,c)=>s+c.pop,0);
  const fundComplete = CR_FUND_DATA.filter(f=>f.status==='complete').length;
  const fundTotal    = CR_FUND_DATA.length;
  const totalQuota   = CR_FUND_DATA.reduce((s,f)=>s+f.quota,0);
  const totalCollect = CR_FUND_DATA.reduce((s,f)=>s+f.collected,0);
  const pendingDamage = CR_DAMAGE_REPORTS.filter(r=>r.status==='submitted').length;

  return `
  <div class="page-header">
    <div class="page-title">
      <h1>Cổng Báo cáo PCTT cấp Xã</h1>
      <p>${CR_COMMUNES.length} xã/phường · ${totalPop.toLocaleString()} dân · Quỹ PCTT, Thiệt hại, Nguồn lực 4TC</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-ghost btn-sm" onclick="showToast('Xuất báo cáo tổng hợp đa cấp...')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Xuất tổng hợp
      </button>
      <button class="btn btn-primary btn-sm" onclick="openNewReportModal()">+ Nhập báo cáo mới</button>
    </div>
  </div>

  <!-- Tabs -->
  <div class="tabs" style="margin-bottom:16px">
    <button class="tab-btn ${_crTab==='fund'?'active':''}" onclick="switchCrTab('fund')">
      Quỹ PCTT ${fundComplete===fundTotal?'<span style="color:var(--success);margin-left:4px">✓</span>':'<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#f59e0b;margin-left:4px;vertical-align:middle"></span>'}
    </button>
    <button class="tab-btn ${_crTab==='damage'?'active':''}" onclick="switchCrTab('damage')">
      Báo cáo Thiệt hại
      ${pendingDamage>0?`<span style="display:inline-block;background:#ef4444;color:#fff;border-radius:10px;font-size:9px;font-weight:700;padding:1px 5px;margin-left:4px">${pendingDamage}</span>`:''}
    </button>
    <button class="tab-btn ${_crTab==='resources'?'active':''}" onclick="switchCrTab('resources')">Nguồn lực 4 Tại chỗ</button>
  </div>

  <div id="crTabContent">${_crRenderTab()}</div>`;
}

function _crRenderTab() {
  if (_crTab === 'fund')      return _crFundTab();
  if (_crTab === 'damage')    return _crDamageTab();
  if (_crTab === 'resources') return _crResourcesTab();
  return '';
}

window.switchCrTab = function(tab) {
  _crTab = tab;
  const el = document.getElementById('crTabContent');
  if (el) el.innerHTML = _crRenderTab();
  document.querySelectorAll('.tabs .tab-btn').forEach((b,i) => {
    b.classList.toggle('active', ['fund','damage','resources'].indexOf(tab) === i);
  });
};

// ── FUND TAB ──────────────────────────────────────────────────────
function _crFundTab() {
  const total      = CR_FUND_DATA.length;
  const complete   = CR_FUND_DATA.filter(d=>d.status==='complete').length;
  const totalQ     = CR_FUND_DATA.reduce((s,d)=>s+d.quota,0);
  const totalC     = CR_FUND_DATA.reduce((s,d)=>s+d.collected,0);
  const pct        = Math.round(totalC/totalQ*100);
  const statusCfg  = {
    complete:{ label:'Nộp đủ',  color:'var(--success)', bg:'rgba(41,132,238,.1)' },
    partial: { label:'Đang thu', color:'#f59e0b', bg:'rgba(245,158,11,.1)' },
    pending: { label:'Chưa thu', color:'#ef4444', bg:'rgba(239,68,68,.1)' },
  };
  return `
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:16px">
    ${[
      [complete+'/'+total, 'Xã nộp đủ', 'var(--success)'],
      [totalQ.toFixed(1)+' tr', 'Tổng chỉ tiêu (triệu)', '#38bdf8'],
      [totalC.toFixed(1)+' tr', 'Đã thu được', '#3699FF'],
      [pct+'%', 'Tỷ lệ hoàn thành', pct>=80?'var(--success)':'#f59e0b'],
    ].map(([v,l,c])=>`<div class="rsv-kpi"><div class="rsv-kpi-val" style="color:${c}">${v}</div><div class="rsv-kpi-lbl">${l}</div></div>`).join('')}
  </div>
  <div class="card" style="padding:10px 16px;margin-bottom:14px">
    <div style="display:flex;justify-content:space-between;margin-bottom:5px">
      <span style="font-size:12px;font-weight:600">Tổng thu Quỹ PCTT toàn địa bàn 2026</span>
      <span style="font-size:13px;font-weight:800;color:var(--success)">${totalC.toFixed(1)} / ${totalQ.toFixed(1)} triệu đồng</span>
    </div>
    <div style="height:8px;background:rgba(255,255,255,.08);border-radius:4px;overflow:hidden">
      <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--success),#38bdf8);border-radius:4px"></div>
    </div>
  </div>
  <div class="card" style="padding:0">
    <div class="card-header"><span class="card-title">Chi tiết thu Quỹ PCTT theo xã</span>
      <button class="btn btn-primary btn-sm" onclick="openFundEntryModal()">Nhập kết quả thu</button>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>Xã/Phường</th><th>Quận/Huyện</th><th>Hạn mức (tr.đ)</th><th>Đã thu (tr.đ)</th><th>Tiến độ</th><th>Trạng thái</th></tr></thead>
      <tbody>
        ${CR_FUND_DATA.map(f => {
          const commune = CR_COMMUNES.find(c=>c.id===f.communeId);
          const cfg = statusCfg[f.status]||statusCfg.pending;
          const fpct = f.quota>0 ? Math.round(f.collected/f.quota*100) : 0;
          return `<tr>
            <td style="font-weight:600">${commune?.name||'—'}</td>
            <td style="font-size:12px;color:var(--muted)">${commune?.district||'—'}</td>
            <td class="mono">${f.quota.toFixed(1)}</td>
            <td class="mono" style="font-weight:700;color:${cfg.color}">${f.collected.toFixed(1)}</td>
            <td>
              <div style="display:flex;align-items:center;gap:7px">
                <div style="flex:1;height:5px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden">
                  <div style="height:100%;width:${fpct}%;background:${cfg.color}"></div>
                </div>
                <span style="font-size:11px;color:${cfg.color};font-weight:700;width:32px">${fpct}%</span>
              </div>
            </td>
            <td><span style="padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;background:${cfg.bg};color:${cfg.color}">${cfg.label}</span></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table></div>
  </div>`;
}

window.openFundEntryModal = function() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Nhập kết quả thu Quỹ PCTT</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-row">
      <div class="form-group"><label class="form-label">Xã/Phường báo cáo</label>
        <select class="form-control">${CR_COMMUNES.map(c=>`<option value="${c.id}">${c.name} — ${c.district}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label class="form-label">Năm thu</label>
        <select class="form-control"><option>2026</option><option>2025</option></select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Số tiền đã thu (triệu đồng)</label><input class="form-control" type="number" step="0.1"></div>
      <div class="form-group"><label class="form-label">Số đối tượng đã thu</label><input class="form-control" type="number"></div>
    </div>
    <div class="form-group"><label class="form-label">Ghi chú</label><textarea class="form-control" rows="2" placeholder="Lý do chưa thu đủ, danh sách miễn giảm..."></textarea></div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('✅ Đã cập nhật kết quả thu Quỹ PCTT!')">Lưu</button>
  </div>`, {width:'600px'});
};

// ── DAMAGE TAB ────────────────────────────────────────────────────
function _crDamageTab() {
  const pending  = CR_DAMAGE_REPORTS.filter(r=>r.status==='submitted').length;
  const approved = CR_DAMAGE_REPORTS.filter(r=>r.status==='approved').length;
  const totalDmg = CR_DAMAGE_REPORTS.reduce((s,r)=>s+r.totalEstimate,0);
  const statusCfg = {
    draft:     { label:'Bản nháp',    color:'var(--text-subtle)', bg:'rgba(107,114,128,.1)' },
    submitted: { label:'Chờ duyệt',   color:'#f59e0b', bg:'rgba(245,158,11,.1)' },
    approved:  { label:'Đã duyệt',    color:'var(--success)', bg:'rgba(41,132,238,.1)' },
    rejected:  { label:'Trả về',      color:'#ef4444', bg:'rgba(239,68,68,.1)' },
  };
  return `
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:16px">
    ${[
      [CR_DAMAGE_REPORTS.length, 'Tổng báo cáo', '#38bdf8'],
      [pending+'', 'Chờ phê duyệt', '#f59e0b'],
      [approved+'', 'Đã phê duyệt', 'var(--success)'],
      [totalDmg.toFixed(0)+' tr.đ', 'Tổng thiệt hại ước tính', '#ef4444'],
    ].map(([v,l,c])=>`<div class="rsv-kpi"><div class="rsv-kpi-val" style="color:${c}">${v}</div><div class="rsv-kpi-lbl">${l}</div></div>`).join('')}
  </div>
  ${pending>0?`<div style="padding:10px 14px;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);border-radius:10px;margin-bottom:14px;display:flex;align-items:center;gap:10px">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    <span style="font-size:13px;font-weight:600;color:#ef4444">${pending} báo cáo thiệt hại đang chờ phê duyệt cấp huyện/TP!</span>
  </div>`:``}
  <div class="card" style="padding:0">
    <div class="card-header"><span class="card-title">Danh sách báo cáo thiệt hại</span>
      <button class="btn btn-primary btn-sm" onclick="openDamageReportModal()">+ Nhập báo cáo thiệt hại</button>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>Mã BC</th><th>Xã/Phường</th><th>Ngày</th><th>Sự kiện</th><th>Nhà HH</th><th>Cây trồng (ha)</th><th>Gia súc (con)</th><th>Ước tính (tr.đ)</th><th>Trạng thái</th><th></th></tr></thead>
      <tbody>
        ${CR_DAMAGE_REPORTS.map(r => {
          const commune = CR_COMMUNES.find(c=>c.id===r.communeId);
          const cfg = statusCfg[r.status]||statusCfg.draft;
          return `<tr>
            <td class="mono" style="font-size:11px;color:var(--primary)">${r.id}</td>
            <td style="font-weight:600">${commune?.name||'—'}</td>
            <td style="font-size:12px;white-space:nowrap">${r.date}</td>
            <td style="font-size:12px;max-width:180px">${r.event}</td>
            <td class="mono">${r.housesDamaged}</td>
            <td class="mono">${r.crops}</td>
            <td class="mono">${r.livestockDead}</td>
            <td class="mono" style="font-weight:700;color:#ef4444">${r.totalEstimate}</td>
            <td><span style="padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;background:${cfg.bg};color:${cfg.color}">${cfg.label}</span></td>
            <td>
              <div style="display:flex;gap:4px">
                <button class="btn btn-ghost btn-sm" onclick="viewDamageDetail('${r.id}')">Chi tiết</button>
                ${r.status==='submitted'?`<button class="btn btn-sm" style="background:rgba(41,132,238,.1);color:var(--success);border:1px solid rgba(41,132,238,.3);font-size:10px" onclick="showToast('Phê duyệt ${r.id}...')">Duyệt</button>`:''}
              </div>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table></div>
  </div>`;
}

window.openDamageReportModal = function() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Nhập Báo cáo Thiệt hại</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-row">
      <div class="form-group"><label class="form-label">Xã/Phường</label>
        <select class="form-control">${CR_COMMUNES.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label class="form-label">Ngày xảy ra</label><input class="form-control" type="date"></div>
    </div>
    <div class="form-group"><label class="form-label">Loại sự kiện thiên tai</label><input class="form-control" placeholder="VD: Lũ lụt, Lốc xoáy, Sạt lở..."></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Nhà hư hỏng (căn)</label><input class="form-control" type="number" value="0"></div>
      <div class="form-group"><label class="form-label">Cây trồng thiệt hại (ha)</label><input class="form-control" type="number" step="0.1" value="0"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Gia súc chết/mất (con)</label><input class="form-control" type="number" value="0"></div>
      <div class="form-group"><label class="form-label">Tổng ước tính (triệu đồng)</label><input class="form-control" type="number" step="1"></div>
    </div>
    <div class="form-group"><label class="form-label">Thiệt hại cơ sở hạ tầng</label><textarea class="form-control" rows="2" placeholder="Mô tả cụ thể đường, cầu, kênh mương bị hư hỏng..."></textarea></div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Lưu nháp</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('✅ Đã gửi báo cáo thiệt hại lên cấp huyện!')">Gửi báo cáo</button>
  </div>`, {width:'700px'});
};

window.viewDamageDetail = function(id) {
  const r = CR_DAMAGE_REPORTS.find(x=>x.id===id);
  if (!r) return;
  const commune = CR_COMMUNES.find(c=>c.id===r.communeId);
  openModal(`
  <div class="modal-header"><span class="modal-title">Chi tiết thiệt hại — ${r.id}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      ${[
        ['Xã/Phường', commune?.name||'—'],['Ngày', r.date],['Sự kiện', r.event],
        ['Nhà hư hỏng', r.housesDamaged+' căn'],['Cây trồng', r.crops+' ha'],['Gia súc', r.livestockDead+' con'],
      ].map(([l,v])=>`<div style="padding:10px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px">
        <div style="font-size:11px;color:var(--muted);margin-bottom:3px">${l}</div>
        <div style="font-size:13px;font-weight:600">${v}</div>
      </div>`).join('')}
    </div>
    <div style="padding:12px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.15);border-radius:8px;margin-bottom:14px">
      <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Hạ tầng thiệt hại</div>
      <div style="font-size:13px;font-weight:500">${r.infra}</div>
    </div>
    <div style="text-align:center;padding:12px;background:rgba(239,68,68,.06);border-radius:8px">
      <div style="font-size:11px;color:var(--muted)">Tổng thiệt hại ước tính</div>
      <div style="font-size:24px;font-weight:800;color:#ef4444">${r.totalEstimate.toLocaleString()} triệu đồng</div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-ghost btn-sm" onclick="showToast('Tải báo cáo PDF...')">Tải PDF</button>
    ${r.status==='submitted'?`<button class="btn btn-primary" onclick="closeModal();showToast('✅ Phê duyệt thành công!')">Phê duyệt</button>`:``}
  </div>`);
};

// ── RESOURCES TAB ─────────────────────────────────────────────────
function _crResourcesTab() {
  const totalForce = CR_RESOURCES_4TC.reduce((s,r)=>s+r.forces,0);
  const totalBoats = CR_RESOURCES_4TC.reduce((s,r)=>s+r.boats,0);
  const totalPumps = CR_RESOURCES_4TC.reduce((s,r)=>s+r.pumps,0);
  const totalFunds = CR_RESOURCES_4TC.reduce((s,r)=>s+r.funds,0);
  return `
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:16px">
    ${[
      [totalForce+' người', 'Tổng lực lượng', '#38bdf8'],
      [totalBoats+' chiếc', 'Phương tiện thủy', 'var(--success)'],
      [totalPumps+' máy', 'Máy bơm', '#f59e0b'],
      [totalFunds+' tr.đ', 'Quỹ dự phòng', '#3699FF'],
    ].map(([v,l,c])=>`<div class="rsv-kpi"><div class="rsv-kpi-val" style="color:${c}">${v}</div><div class="rsv-kpi-lbl">${l}</div></div>`).join('')}
  </div>
  <div class="card" style="padding:0">
    <div class="card-header"><span class="card-title">Nguồn lực 4 Tại chỗ theo xã</span>
      <button class="btn btn-primary btn-sm" onclick="openResourceEntryModal()">Cập nhật nguồn lực</button>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>Xã/Phường</th><th>Lực lượng (sẵn sàng/tổng)</th><th>Ghe thuyền</th><th>Máy bơm</th><th>Lương thực (ngày)</th><th>Quỹ dự phòng (tr.đ)</th><th>Đánh giá</th></tr></thead>
      <tbody>
        ${CR_RESOURCES_4TC.map(r => {
          const commune = CR_COMMUNES.find(c=>c.id===r.communeId);
          const readyPct = Math.round(r.forceReady/r.forces*100);
          const scoreColor = readyPct>=80?'var(--success)':readyPct>=60?'#f59e0b':'#ef4444';
          return `<tr>
            <td style="font-weight:600">${commune?.name||r.communeId}</td>
            <td>
              <div style="display:flex;align-items:center;gap:7px">
                <div style="flex:1;height:4px;background:rgba(255,255,255,.08);border-radius:2px;overflow:hidden">
                  <div style="height:100%;width:${readyPct}%;background:${scoreColor}"></div>
                </div>
                <span style="font-size:11px;color:${scoreColor};font-weight:700;white-space:nowrap">${r.forceReady}/${r.forces}</span>
              </div>
            </td>
            <td class="mono" style="text-align:center">${r.boats}</td>
            <td class="mono" style="text-align:center">${r.pumps}</td>
            <td class="mono" style="text-align:center">${r.food}</td>
            <td class="mono" style="font-weight:600;color:#3699FF">${r.funds}</td>
            <td>
              <span style="padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;background:${scoreColor}18;color:${scoreColor};border:1px solid ${scoreColor}40">
                ${readyPct>=80?'Đủ năng lực':readyPct>=60?'Cần bổ sung':'Thiếu hụt'}
              </span>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table></div>
  </div>`;
}

window.openResourceEntryModal = function() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Cập nhật Nguồn lực 4 Tại chỗ</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-group"><label class="form-label">Xã/Phường</label>
      <select class="form-control">${CR_COMMUNES.map(c=>`<option value="${c.id}">${c.name} — ${c.district}</option>`).join('')}</select>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Tổng lực lượng (người)</label><input class="form-control" type="number"></div>
      <div class="form-group"><label class="form-label">Sẵn sàng ứng phó (người)</label><input class="form-control" type="number"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Ghe/thuyền (chiếc)</label><input class="form-control" type="number"></div>
      <div class="form-group"><label class="form-label">Máy bơm chìm (chiếc)</label><input class="form-control" type="number"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Lương thực dự trữ (ngày)</label><input class="form-control" type="number"></div>
      <div class="form-group"><label class="form-label">Quỹ dự phòng (triệu đồng)</label><input class="form-control" type="number" step="1"></div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('✅ Đã cập nhật nguồn lực 4 tại chỗ!')">Lưu</button>
  </div>`, {width:'620px'});
};

window.openNewReportModal = function() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Nhập báo cáo mới</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
      ${[
        ['Quỹ PCTT','Thu Quỹ PCTT hàng năm','var(--success)','fund'],
        ['Thiệt hại','Báo cáo thiệt hại thiên tai','#ef4444','damage'],
        ['Nguồn lực','Cập nhật 4 tại chỗ','#f59e0b','resources'],
      ].map(([t,d,c,tab])=>`<div class="card" style="padding:20px;text-align:center;cursor:pointer;border:2px solid ${c}22" onclick="closeModal();switchCrTab('${tab}')">
        <div style="font-size:16px;font-weight:800;color:${c};margin-bottom:6px">${t}</div>
        <div style="font-size:12px;color:var(--muted)">${d}</div>
      </div>`).join('')}
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Đóng</button></div>`);
};
