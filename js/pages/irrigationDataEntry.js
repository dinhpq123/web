// ── HADIWA IOC — Nhập liệu Công trình Thủy lợi v6.2 ───────────────
// Hồ chứa · Trạm bơm · Cống thủy lợi — Chi cục TL & PCTT Hà Nội

let irdTab = 'reservoir';

const IRD_RESERVOIRS = [
  { id:'HC-TL', name:'Hồ Tuy Lai', district:'Mỹ Đức', capacity:14.1, MNDBT:19.0, MNLKT:20.5, MNTTK:21.0, MNCN:17.0,
    area:270, operator:'XN Thủy lợi Mỹ Đức', currentH:18.4, currentW:11.2, spillQ:0, bottomQ:0, inQ:2.1, status:'normal', lastUpdate:'14/03/2026 06:00' },
  { id:'HC-QS', name:'Hồ Quan Sơn', district:'Mỹ Đức', capacity:32.0, MNDBT:6.45, MNLKT:7.40, MNTTK:8.0, MNCN:4.5,
    area:850, operator:'XN Thủy lợi Mỹ Đức', currentH:5.8, currentW:18.4, spillQ:0, bottomQ:1.2, inQ:0.8, status:'normal', lastUpdate:'14/03/2026 06:00' },
  { id:'HC-DM', name:'Hồ Đồng Mô – Ngải Sơn', district:'Sơn Tây', capacity:81.0, MNDBT:14.2, MNLKT:15.2, MNTTK:15.7, MNCN:11.0,
    area:1372, operator:'Cty CP Du lịch – Thủy lợi', currentH:13.5, currentW:62.0, spillQ:0, bottomQ:0, inQ:1.5, status:'normal', lastUpdate:'14/03/2026 06:00' },
  { id:'HC-SH', name:'Hồ Suối Hai', district:'Ba Vì', capacity:47.5, MNDBT:21.4, MNLKT:22.4, MNTTK:23.0, MNCN:18.5,
    area:1040, operator:'XN Thủy lợi Ba Vì', currentH:20.1, currentW:38.2, spillQ:0, bottomQ:2.0, inQ:1.2, status:'normal', lastUpdate:'14/03/2026 06:00' },
  { id:'HC-DX', name:'Hồ Đồng Xương', district:'Ba Vì', capacity:5.2, MNDBT:17.5, MNLKT:18.5, MNTTK:19.2, MNCN:14.0,
    area:82, operator:'XN Thủy lợi Ba Vì', currentH:17.2, currentW:4.8, spillQ:0, bottomQ:0, inQ:0.3, status:'normal', lastUpdate:'14/03/2026 05:30' },
  { id:'HC-TS', name:'Hồ Tiên Sa', district:'Đông Anh', capacity:3.1, MNDBT:8.2, MNLKT:9.0, MNTTK:9.5, MNCN:6.5,
    area:65, operator:'XN Thủy lợi Đông Anh', currentH:7.9, currentW:2.7, spillQ:0, bottomQ:0, inQ:0.2, status:'warning', lastUpdate:'14/03/2026 05:30' },
];

const IRD_PUMPS = [
  { id:'TB-YS', name:'Trạm bơm Yên Sở', district:'Hoàng Mai', type:'tiêu', capacity:45.0, pumps:9, pumpsRunning:7, flowActual:38.2, power:180, runtime:14.5, status:'ok' },
  { id:'TB-DC', name:'Trạm bơm Đông Cổ Điển', district:'Chương Mỹ', type:'tưới', capacity:12.0, pumps:4, pumpsRunning:3, flowActual:9.5, power:55, runtime:8.0, status:'ok' },
  { id:'TB-LM', name:'Trạm bơm Liên Mạc', district:'Bắc Từ Liêm', type:'tiêu', capacity:18.0, pumps:6, pumpsRunning:5, flowActual:15.2, power:90, runtime:12.0, status:'ok' },
  { id:'TB-CN', name:'Trạm bơm Cổ Nhuế', district:'Bắc Từ Liêm', type:'tiêu', capacity:22.0, pumps:5, pumpsRunning:4, flowActual:17.8, power:110, runtime:16.0, status:'ok' },
  { id:'TB-DM', name:'Trạm bơm Đồng Mẻ', district:'Hà Đông', type:'tiêu', capacity:8.5, pumps:3, pumpsRunning:3, flowActual:8.2, power:42, runtime:10.0, status:'ok' },
  { id:'TB-QT', name:'Trạm bơm Quán Toan', district:'Ứng Hòa', type:'tưới', capacity:6.0, pumps:3, pumpsRunning:2, flowActual:3.8, power:30, runtime:6.0, status:'warning' },
];

const IRD_SLUICES = [
  { id:'CG-LM', name:'Cống Liên Mạc', river:'Sông Hồng', district:'Bắc Từ Liêm', spans:3, width:6.0, capacity:120, currentQ:85, openPct:70, status:'ok', lastOp:'14/03/2026 06:00' },
  { id:'CG-TN', name:'Cống Thanh Nê', river:'Sông Đuống', district:'Đông Anh', spans:2, width:4.5, capacity:60, currentQ:42, openPct:65, status:'ok', lastOp:'14/03/2026 05:00' },
  { id:'CG-VN', name:'Cống Vân Nội', river:'Sông Cà Lồ', district:'Đông Anh', spans:1, width:3.0, capacity:28, currentQ:0, openPct:0, status:'closed', lastOp:'13/03/2026 18:00' },
  { id:'CG-MY', name:'Cống Mỹ Hà', river:'Sông Đáy', district:'Mỹ Đức', spans:2, width:5.0, capacity:80, currentQ:55, openPct:60, status:'ok', lastOp:'14/03/2026 04:30' },
];

function renderIrrigationDataEntry() {
  const runningPumps = IRD_PUMPS.reduce((s,p)=>s+p.pumpsRunning,0);
  const totalPumps   = IRD_PUMPS.reduce((s,p)=>s+p.pumps,0);
  const totalFlow    = IRD_PUMPS.reduce((s,p)=>s+p.flowActual,0).toFixed(1);
  const lowRes       = IRD_RESERVOIRS.filter(r=>r.status==='warning').length;
  return `
  <div class="page-header">
    <div class="page-title"><h1>Nhập liệu Công trình Thủy lợi</h1>
      <p>Hồ chứa · Trạm bơm · Cống điều tiết — Cập nhật số liệu vận hành thực tế</p></div>
    <div class="page-actions">
      <button class="btn btn-ghost btn-sm" onclick="irdExportData()">Xuất số liệu</button>
      <button class="btn btn-primary btn-sm" onclick="irdOpenEntryForm()">+ Nhập số liệu mới</button>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px">
    ${[['Hồ chứa theo dõi',IRD_RESERVOIRS.length,'var(--cyan)','Tổng 183.9 triệu m³'],
       ['Hồ cảnh báo thấp',lowRes,'var(--yellow)','Cần bổ sung nguồn'],
       ['Máy bơm hoạt động',`${runningPumps}/${totalPumps}`,'var(--green)',`Lưu lượng ${totalFlow} m³/s`],
       ['Cống điều tiết',IRD_SLUICES.length,'var(--purple)',`${IRD_SLUICES.filter(c=>c.status==='ok').length} đang mở`]].map(([l,v,c,s])=>`
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:16px 18px">
      <div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">${l}</div>
      <div style="font-size:26px;font-weight:800;color:${c}">${v}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:3px">${s}</div>
    </div>`).join('')}
  </div>
  <div class="tabs" style="margin-bottom:18px">
    <button class="tab-btn ${irdTab==='reservoir'?'active':''}" onclick="irdSwitchTab('reservoir')">Hồ chứa (${IRD_RESERVOIRS.length})</button>
    <button class="tab-btn ${irdTab==='pump'?'active':''}" onclick="irdSwitchTab('pump')">Trạm bơm (${IRD_PUMPS.length})</button>
    <button class="tab-btn ${irdTab==='sluice'?'active':''}" onclick="irdSwitchTab('sluice')">Cống điều tiết (${IRD_SLUICES.length})</button>
  </div>
  <div id="irdTabContent">${_renderIrdTab()}</div>`;
}

function _renderIrdTab() {
  if (irdTab==='reservoir') return _irdReservoirs();
  if (irdTab==='pump')      return _irdPumps();
  if (irdTab==='sluice')    return _irdSluices();
  return '';
}

function _irdReservoirs() {
  return `<div class="card" style="padding:0">
    <div class="card-header"><span class="card-title">Số liệu hồ chứa — ${new Date().toLocaleDateString('vi-VN')}</span></div>
    <div class="table-wrap"><table>
      <thead><tr><th>Hồ chứa</th><th>Huyện</th><th>H hiện tại</th><th>MNDBT</th><th>Dung tích hiện tại</th><th>Q ra (m³/s)</th><th>Q vào</th><th>Tình trạng</th><th></th></tr></thead>
      <tbody>${IRD_RESERVOIRS.map(r=>{
        const pct=Math.round(r.currentW/r.capacity*100);
        const hc=r.currentH>=r.MNDBT?'var(--green)':r.currentH>=r.MNCN+0.5?'var(--yellow)':'#f87171';
        const sc=r.status==='normal'?'badge-green':'badge-yellow';
        const sl=r.status==='normal'?'Bình thường':'Cảnh báo';
        return `<tr>
          <td style="font-weight:700;font-size:13px">${r.name}</td>
          <td style="font-size:11px;color:var(--muted)">${r.district}</td>
          <td><span style="font-size:16px;font-weight:800;color:${hc}">${r.currentH.toFixed(2)}</span><span style="font-size:10px;color:var(--muted)"> m</span></td>
          <td class="mono" style="font-size:12px">${r.MNDBT} m</td>
          <td>
            <div style="display:flex;align-items:center;gap:6px">
              <div style="width:50px;height:5px;background:rgba(255,255,255,.08);border-radius:3px">
                <div style="width:${Math.min(pct,100)}%;height:100%;background:${pct>=70?'var(--green)':pct>=40?'var(--yellow)':'#f87171'};border-radius:3px"></div>
              </div>
              <span style="font-size:11px;color:var(--muted)">${r.currentW.toFixed(1)}/${r.capacity} Tr.m³ (${pct}%)</span>
            </div></td>
          <td class="mono" style="color:var(--cyan)">${(r.spillQ+r.bottomQ).toFixed(1)}</td>
          <td class="mono" style="color:var(--green)">${r.inQ.toFixed(1)}</td>
          <td><span class="badge ${sc}" style="font-size:10px">${sl}</span></td>
          <td><div style="display:flex;gap:4px">
            <button class="btn btn-ghost btn-xs" onclick="irdUpdateReservoir('${r.id}')">Cập nhật</button>
            <button class="btn btn-ghost btn-xs" onclick="irdViewReservoir('${r.id}')">Chi tiết</button>
          </div></td></tr>`;}).join('')}
      </tbody></table></div></div>`;
}

function _irdPumps() {
  return `<div class="card" style="padding:0">
    <div class="card-header"><span class="card-title">Trạm bơm — Trạng thái vận hành</span></div>
    <div class="table-wrap"><table>
      <thead><tr><th>Trạm bơm</th><th>Loại</th><th>Huyện</th><th>Máy bơm</th><th>Q thực tế</th><th>Q thiết kế</th><th>Điện (kWh)</th><th>Vận hành</th><th>TT</th><th></th></tr></thead>
      <tbody>${IRD_PUMPS.map(p=>`<tr>
        <td style="font-weight:700;font-size:12px">${p.name}</td>
        <td><span class="badge ${p.type==='tiêu'?'badge-blue':'badge-green'}" style="font-size:10px">${p.type}</span></td>
        <td style="font-size:11px;color:var(--muted)">${p.district}</td>
        <td><span style="font-size:14px;font-weight:700;color:${p.pumpsRunning===p.pumps?'var(--green)':'var(--yellow)'}">${p.pumpsRunning}</span><span style="font-size:11px;color:var(--muted)">/${p.pumps}</span></td>
        <td class="mono" style="color:var(--cyan)">${p.flowActual.toFixed(1)} m³/s</td>
        <td class="mono" style="font-size:11px;color:var(--muted)">${p.capacity.toFixed(1)}</td>
        <td class="mono" style="font-size:11px">${p.power}</td>
        <td class="mono" style="font-size:11px;color:var(--muted)">${p.runtime}h</td>
        <td><span class="badge ${p.status==='ok'?'badge-green':'badge-yellow'}" style="font-size:10px">${p.status==='ok'?'OK':'Cảnh báo'}</span></td>
        <td><button class="btn btn-ghost btn-xs" onclick="irdUpdatePump('${p.id}')">Cập nhật</button></td>
      </tr>`).join('')}</tbody></table></div></div>`;
}

function _irdSluices() {
  return `<div class="card" style="padding:0">
    <div class="card-header"><span class="card-title">Cống điều tiết — Trạng thái vận hành</span></div>
    <div class="table-wrap"><table>
      <thead><tr><th>Cống</th><th>Sông</th><th>Huyện</th><th>Khoang</th><th>Q thiết kế</th><th>Q thực tế</th><th>Độ mở</th><th>TT</th><th>Lần cuối</th><th></th></tr></thead>
      <tbody>${IRD_SLUICES.map(c=>`<tr>
        <td style="font-weight:700;font-size:12px">${c.name}</td>
        <td style="font-size:11px;color:var(--muted)">${c.river}</td>
        <td style="font-size:11px;color:var(--muted)">${c.district}</td>
        <td class="mono" style="font-size:11px">${c.spans}×${c.width}m</td>
        <td class="mono" style="font-size:11px;color:var(--muted)">${c.capacity}</td>
        <td class="mono" style="color:${c.currentQ>0?'var(--cyan)':'var(--muted)'}">${c.currentQ}</td>
        <td>
          <div style="display:flex;align-items:center;gap:6px">
            <div style="width:40px;height:5px;background:rgba(255,255,255,.08);border-radius:3px">
              <div style="width:${c.openPct}%;height:100%;background:${c.openPct>0?'var(--cyan)':'var(--muted)'};border-radius:3px"></div>
            </div>
            <span style="font-size:11px">${c.openPct}%</span>
          </div></td>
        <td><span class="badge ${c.status==='ok'?'badge-green':c.status==='closed'?'badge-gray':'badge-yellow'}" style="font-size:10px">${c.status==='ok'?'Đang mở':c.status==='closed'?'Đóng':'Cảnh báo'}</span></td>
        <td class="mono" style="font-size:10px;color:var(--muted)">${c.lastOp}</td>
        <td><button class="btn btn-ghost btn-xs" onclick="irdUpdateSluice('${c.id}')">Điều tiết</button></td>
      </tr>`).join('')}</tbody></table></div></div>`;
}

window.irdSwitchTab = function(tab) {
  irdTab = tab;
  const el = document.getElementById('irdTabContent');
  if (el) el.innerHTML = _renderIrdTab();
  document.querySelectorAll('.tab-btn').forEach(b => {
    const map = { reservoir:'Hồ chứa', pump:'Trạm bơm', sluice:'Cống' };
    b.classList.toggle('active', b.textContent.trim().startsWith(map[tab]?.substring(0,5)||'__'));
  });
};

window.irdUpdateReservoir = function(id) {
  const r = IRD_RESERVOIRS.find(x=>x.id===id); if(!r) return;
  openModal(`
  <div class="modal-header"><span class="modal-title">Cập nhật số liệu — ${r.name}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">
      ${[['MNDBT',r.MNDBT],['MNLKT',r.MNLKT],['MNTTK',r.MNTTK]].map(([l,v])=>`
      <div style="background:rgba(0,200,255,.06);border:1px solid rgba(0,200,255,.15);border-radius:8px;padding:8px 10px">
        <div style="font-size:10px;color:var(--muted)">${l}</div>
        <div style="font-size:13px;font-weight:700;color:var(--cyan)">${v} m</div>
      </div>`).join('')}
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Mực nước H (m) *</label>
        <input id="irdH" class="form-control" type="number" step="0.01" value="${r.currentH}"></div>
      <div class="form-group"><label class="form-label">Thời điểm đo</label>
        <input id="irdTime" class="form-control" value="${new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Q xả tràn (m³/s)</label>
        <input id="irdSpillQ" class="form-control" type="number" step="0.1" value="${r.spillQ}"></div>
      <div class="form-group"><label class="form-label">Q xả đáy (m³/s)</label>
        <input id="irdBottomQ" class="form-control" type="number" step="0.1" value="${r.bottomQ}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Q đến hồ (m³/s)</label>
        <input id="irdInQ" class="form-control" type="number" step="0.1" value="${r.inQ}"></div>
      <div class="form-group"><label class="form-label">Ghi chú</label>
        <input id="irdNote" class="form-control" placeholder="Ghi chú vận hành..."></div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="irdSaveReservoir('${r.id}')">Lưu số liệu</button>
  </div>`);
};

window.irdSaveReservoir = function(id) {
  const r = IRD_RESERVOIRS.find(x=>x.id===id); if(!r) return;
  const H = parseFloat(document.getElementById('irdH')?.value);
  if (isNaN(H)) { showToast('⚠ Nhập mực nước hợp lệ!'); return; }
  r.currentH = H; r.spillQ = parseFloat(document.getElementById('irdSpillQ')?.value)||0;
  r.bottomQ = parseFloat(document.getElementById('irdBottomQ')?.value)||0;
  r.inQ = parseFloat(document.getElementById('irdInQ')?.value)||0;
  r.currentW = parseFloat((r.capacity*(H-r.MNCN)/(r.MNTTK-r.MNCN)).toFixed(2));
  r.lastUpdate = new Date().toLocaleString('vi-VN');
  closeModal();
  showToast(H>=r.MNLKT?`⚠ H=${H}m vượt MNLKT! Đã lưu.`:`✅ Cập nhật hồ ${r.name}: H=${H}m`);
  const el = document.getElementById('irdTabContent'); if (el) el.innerHTML = _renderIrdTab();
};

window.irdUpdatePump = function(id) {
  const p = IRD_PUMPS.find(x=>x.id===id); if(!p) return;
  openModal(`
  <div class="modal-header"><span class="modal-title">Cập nhật — ${p.name}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-row">
      <div class="form-group"><label class="form-label">Số máy chạy / ${p.pumps}</label>
        <input id="pmpR" class="form-control" type="number" min="0" max="${p.pumps}" value="${p.pumpsRunning}"></div>
      <div class="form-group"><label class="form-label">Q thực tế (m³/s)</label>
        <input id="pmpF" class="form-control" type="number" step="0.1" value="${p.flowActual}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Điện tiêu thụ (kWh)</label>
        <input id="pmpP" class="form-control" type="number" value="${p.power}"></div>
      <div class="form-group"><label class="form-label">Thời gian vận hành (h)</label>
        <input id="pmpRt" class="form-control" type="number" step="0.5" value="${p.runtime}"></div>
    </div>
    <div class="form-group"><label class="form-label">Tình trạng</label>
      <select id="pmpSt" class="form-control">
        <option value="ok" ${p.status==='ok'?'selected':''}>Bình thường</option>
        <option value="warning" ${p.status==='warning'?'selected':''}>Cảnh báo</option>
        <option value="error">Sự cố</option>
      </select></div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="irdSavePump('${p.id}')">Lưu</button>
  </div>`);
};

window.irdSavePump = function(id) {
  const p = IRD_PUMPS.find(x=>x.id===id); if(!p) return;
  p.pumpsRunning = parseInt(document.getElementById('pmpR')?.value)||0;
  p.flowActual = parseFloat(document.getElementById('pmpF')?.value)||0;
  p.power = parseInt(document.getElementById('pmpP')?.value)||0;
  p.runtime = parseFloat(document.getElementById('pmpRt')?.value)||0;
  p.status = document.getElementById('pmpSt')?.value||'ok';
  closeModal(); showToast(`✅ Đã cập nhật trạm bơm ${p.name}`);
  const el = document.getElementById('irdTabContent'); if (el) el.innerHTML = _renderIrdTab();
};

window.irdUpdateSluice = function(id) {
  const c = IRD_SLUICES.find(x=>x.id===id); if(!c) return;
  openModal(`
  <div class="modal-header"><span class="modal-title">Điều tiết cống — ${c.name}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-row">
      <div class="form-group"><label class="form-label">Độ mở (%)</label>
        <input id="slcO" class="form-control" type="number" min="0" max="100" value="${c.openPct}"></div>
      <div class="form-group"><label class="form-label">Q qua cống (m³/s)</label>
        <input id="slcQ" class="form-control" type="number" step="0.5" value="${c.currentQ}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Trạng thái</label>
        <select id="slcSt" class="form-control">
          <option value="ok" ${c.status==='ok'?'selected':''}>Đang mở</option>
          <option value="closed" ${c.status==='closed'?'selected':''}>Đóng hoàn toàn</option>
          <option value="warning">Cảnh báo</option>
        </select></div>
      <div class="form-group"><label class="form-label">Người vận hành</label>
        <input id="slcOp" class="form-control" placeholder="Họ tên người vận hành"></div>
    </div>
    <div class="form-group"><label class="form-label">Lý do điều tiết</label>
      <textarea id="slcReason" class="form-control" rows="2" placeholder="Tiêu úng, tưới ruộng..."></textarea></div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="irdSaveSluice('${c.id}')">Lưu & Cập nhật</button>
  </div>`);
};

window.irdSaveSluice = function(id) {
  const c = IRD_SLUICES.find(x=>x.id===id); if(!c) return;
  c.openPct = parseInt(document.getElementById('slcO')?.value)||0;
  c.currentQ = parseFloat(document.getElementById('slcQ')?.value)||0;
  c.status = document.getElementById('slcSt')?.value||'ok';
  c.lastOp = new Date().toLocaleString('vi-VN');
  closeModal(); showToast(`✅ Đã cập nhật vận hành cống ${c.name}`);
  const el = document.getElementById('irdTabContent'); if (el) el.innerHTML = _renderIrdTab();
};

window.irdViewReservoir = function(id) {
  const r = IRD_RESERVOIRS.find(x=>x.id===id); if(!r) return;
  const pct = Math.round(r.currentW/r.capacity*100);
  openModal(`
  <div class="modal-header"><span class="modal-title">${r.name}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">
      ${[['Huyện',r.district],['Diện tích',r.area+' ha'],['Đơn vị QL',r.operator],
         ['Dung tích TK',r.capacity+' triệu m³'],['Cập nhật lần cuối',r.lastUpdate],['Khu tưới',r.irrigArea+' ha']].map(([l,v])=>`
      <div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px;padding:10px">
        <div style="font-size:10px;color:var(--muted)">${l}</div>
        <div style="font-size:12px;font-weight:600;margin-top:2px">${v}</div>
      </div>`).join('')}
    </div>
    <div style="background:rgba(0,200,255,.06);border:1px solid rgba(0,200,255,.2);border-radius:10px;padding:14px;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="font-size:13px;font-weight:700">H = <span style="color:var(--cyan)">${r.currentH.toFixed(2)} m</span></span>
        <span style="font-size:12px;color:var(--muted)">${r.currentW.toFixed(1)}/${r.capacity} triệu m³ (${pct}%)</span>
      </div>
      <div style="height:10px;background:rgba(255,255,255,.08);border-radius:5px;overflow:hidden">
        <div style="width:${pct}%;height:100%;background:${pct>=70?'var(--green)':pct>=40?'var(--yellow)':'#f87171'};border-radius:5px"></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:5px;font-size:10px;color:var(--muted)">
        <span>MNCN: ${r.MNCN}m</span><span>MNDBT: ${r.MNDBT}m</span><span>MNLKT: ${r.MNLKT}m</span><span>MNTTK: ${r.MNTTK}m</span>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
      ${[['Q xả tràn',(r.spillQ).toFixed(1)+' m³/s','var(--yellow)'],['Q xả đáy',r.bottomQ.toFixed(1)+' m³/s','var(--cyan)'],['Q đến hồ',r.inQ.toFixed(1)+' m³/s','var(--green)']].map(([l,v,c])=>`
      <div style="text-align:center;padding:10px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px">
        <div style="font-size:10px;color:var(--muted);margin-bottom:4px">${l}</div>
        <div style="font-size:16px;font-weight:700;color:${c}">${v}</div>
      </div>`).join('')}
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-primary" onclick="closeModal();irdUpdateReservoir('${r.id}')">Cập nhật số liệu</button>
  </div>`);
};

window.irdOpenEntryForm = function() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Nhập số liệu vận hành</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-group"><label class="form-label">Loại công trình</label>
      <select class="form-control">
        <option>Hồ chứa</option><option>Trạm bơm</option><option>Cống điều tiết</option>
      </select></div>
    <div class="form-group"><label class="form-label">Công trình</label>
      <select class="form-control">
        ${[...IRD_RESERVOIRS.map(r=>`<option>${r.name}</option>`),
           ...IRD_PUMPS.map(p=>`<option>${p.name}</option>`),
           ...IRD_SLUICES.map(c=>`<option>${c.name}</option>`)].join('')}
      </select></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Chỉ số chính</label>
        <input class="form-control" placeholder="Mực nước / Q chạy / Độ mở..."></div>
      <div class="form-group"><label class="form-label">Thời điểm</label>
        <input class="form-control" type="datetime-local"></div>
    </div>
    <div class="form-group"><label class="form-label">Ghi chú</label>
      <input class="form-control" placeholder="Ghi chú vận hành..."></div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="irdOpenEntryFormSave()">Mở form nhập liệu</button>
  </div>`);
};

window.irdExportData = function() {
  const rows = [['Loại','Tên','Huyện','Chỉ số 1','Chỉ số 2','TT'],
    ...IRD_RESERVOIRS.map(r=>['Hồ chứa',r.name,r.district,`H=${r.currentH}m`,`${Math.round(r.currentW/r.capacity*100)}%`,r.status]),
    ...IRD_PUMPS.map(p=>['Trạm bơm',p.name,p.district,`${p.pumpsRunning}/${p.pumps} máy`,`Q=${p.flowActual}m³/s`,p.status]),
    ...IRD_SLUICES.map(c=>['Cống',c.name,c.district,`Mở ${c.openPct}%`,`Q=${c.currentQ}m³/s`,c.status]),
  ];
  const csv = rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href=url; a.download=`SoLieu_CongTrinh_ThuLoi_${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
  showToast('✅ Đã xuất số liệu công trình thủy lợi!');
};

// ── EXCEL / CSV IMPORT — CÔNG TRÌNH THỦY LỢI ────────────────────

const _origRenderIRD = renderIrrigationDataEntry;
renderIrrigationDataEntry = function() {
  const html = _origRenderIRD();
  return html.replace(
    '<button class="btn btn-ghost btn-sm" onclick="irdExportData()">Xuất số liệu</button>',
    `<button class="btn btn-ghost btn-sm" onclick="irdImportData()">Nhập từ Excel</button>
     <button class="btn btn-ghost btn-sm" onclick="irdDownloadTemplate()">Template CSV</button>
     <button class="btn btn-ghost btn-sm" onclick="irdExportData()">Xuất số liệu</button>`
  );
};

const IRD_RES_HEADERS  = ['Mã hồ','Tên hồ','Huyện','H hiện tại (m)','Q xả tràn (m³/s)','Q xả đáy (m³/s)','Q đến hồ (m³/s)','Ghi chú'];
const IRD_PUMP_HEADERS = ['Mã trạm','Tên trạm','Số máy đang chạy','Q thực tế (m³/s)','Điện (kWh)','Thời gian vận hành (h)','Tình trạng (ok/warning/error)'];
const IRD_SLC_HEADERS  = ['Mã cống','Tên cống','Độ mở (%)','Q qua cống (m³/s)','Trạng thái (ok/closed/warning)','Người vận hành'];

window.irdDownloadTemplate = function() {
  if (typeof downloadImportTemplate !== 'function') { showToast('⚠ Chưa tải helper!'); return; }
  const templates = {
    reservoir: { headers: IRD_RES_HEADERS, rows: IRD_RESERVOIRS.map(r=>[r.id,r.name,r.district,r.currentH,'0','0',r.inQ,'']), name: 'Template_HoChua' },
    pump:      { headers: IRD_PUMP_HEADERS, rows: IRD_PUMPS.map(p=>[p.id,p.name,p.pumpsRunning,p.flowActual,p.power,p.runtime,'ok']), name: 'Template_TramBom' },
    sluice:    { headers: IRD_SLC_HEADERS, rows: IRD_SLUICES.map(c=>[c.id,c.name,c.openPct,c.currentQ,'ok','']), name: 'Template_CongDieuTiet' },
  };
  const t = templates[irdTab] || templates.reservoir;
  downloadImportTemplate(`${t.name}_${new Date().toISOString().slice(0,10)}.csv`, t.headers, t.rows);
};

window.irdImportData = function() {
  if (typeof triggerImportFilePicker !== 'function') { showToast('⚠ Chưa tải helper!'); return; }
  const configs = {
    reservoir: {
      headers: IRD_RES_HEADERS,
      validators: [IV.required, IV.required, IV.any, IV.numRange(-5,50), IV.numRange(0,9999), IV.numRange(0,9999), IV.numRange(0,9999), IV.any],
      displayCols: ['Mã hồ','Tên hồ','H hiện tại (m)','Q xả tràn (m³/s)','Q đến hồ (m³/s)'],
      onConfirm: (rows) => {
        let updated = 0;
        rows.forEach(row => {
          const r = IRD_RESERVOIRS.find(x => x.id === row[0]?.trim() || x.name === row[1]?.trim());
          if (!r) return;
          const H = parseFloat(row[3]);
          if (!isNaN(H)) {
            r.currentH = H;
            r.currentW = parseFloat((r.capacity*(H-r.MNCN)/(r.MNTTK-r.MNCN)).toFixed(2));
          }
          r.spillQ  = parseFloat(row[4]) || 0;
          r.bottomQ = parseFloat(row[5]) || 0;
          r.inQ     = parseFloat(row[6]) || r.inQ;
          r.lastUpdate = new Date().toLocaleString('vi-VN');
          updated++;
        });
        const el = document.getElementById('irdTabContent'); if(el) el.innerHTML = _renderIrdTab();
        showToast(`✅ Import hồ chứa: Cập nhật ${updated} hồ!`);
      }
    },
    pump: {
      headers: IRD_PUMP_HEADERS,
      validators: [IV.required, IV.required, IV.numRange(0,20), IV.numRange(0,999), IV.numRange(0,99999), IV.numRange(0,24), IV.oneOf('ok','warning','error')],
      displayCols: ['Mã trạm','Tên trạm','Số máy đang chạy','Q thực tế (m³/s)','Tình trạng (ok/warning/error)'],
      onConfirm: (rows) => {
        let updated = 0;
        rows.forEach(row => {
          const p = IRD_PUMPS.find(x => x.id === row[0]?.trim() || x.name === row[1]?.trim());
          if (!p) return;
          p.pumpsRunning = parseInt(row[2]) || p.pumpsRunning;
          p.flowActual   = parseFloat(row[3]) || p.flowActual;
          p.power        = parseInt(row[4]) || p.power;
          p.runtime      = parseFloat(row[5]) || p.runtime;
          p.status       = row[6]?.trim() || p.status;
          updated++;
        });
        const el = document.getElementById('irdTabContent'); if(el) el.innerHTML = _renderIrdTab();
        showToast(`✅ Import trạm bơm: Cập nhật ${updated} trạm!`);
      }
    },
    sluice: {
      headers: IRD_SLC_HEADERS,
      validators: [IV.required, IV.required, IV.numRange(0,100), IV.numRange(0,9999), IV.oneOf('ok','closed','warning'), IV.any],
      displayCols: ['Mã cống','Tên cống','Độ mở (%)','Q qua cống (m³/s)','Trạng thái (ok/closed/warning)'],
      onConfirm: (rows) => {
        let updated = 0;
        rows.forEach(row => {
          const c = IRD_SLUICES.find(x => x.id === row[0]?.trim() || x.name === row[1]?.trim());
          if (!c) return;
          c.openPct  = parseInt(row[2]) || 0;
          c.currentQ = parseFloat(row[3]) || 0;
          c.status   = row[4]?.trim() || c.status;
          c.lastOp   = new Date().toLocaleString('vi-VN');
          updated++;
        });
        const el = document.getElementById('irdTabContent'); if(el) el.innerHTML = _renderIrdTab();
        showToast(`✅ Import cống: Cập nhật ${updated} cống điều tiết!`);
      }
    }
  };
  const cfg = configs[irdTab] || configs.reservoir;
  triggerImportFilePicker((fileName, parsedRows) => {
    const dataRows = parsedRows.length > 0 && parsedRows[0][0] === cfg.headers[0] ? parsedRows.slice(1) : parsedRows;
    if (!dataRows.length) { showToast('⚠ File không có dữ liệu!'); return; }
    const typeNames = { reservoir:'Hồ chứa', pump:'Trạm bơm', sluice:'Cống điều tiết' };
    showImportConfirmModal({
      title: typeNames[irdTab] || 'Công trình Thủy lợi',
      fileName, headers: cfg.headers, rows: dataRows, validators: cfg.validators,
      displayCols: cfg.displayCols, onConfirm: cfg.onConfirm
    });
  });
};

// ── PATCH: Fix irdOpenEntryForm save + irdViewReservoir irrigArea ─

// Override irdOpenEntryForm with smart routing-based version
window.irdOpenEntryForm = function() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Nhập số liệu vận hành</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-group"><label class="form-label">Loại công trình *</label>
      <select id="irdEType" class="form-control" onchange="irdEntryTypeChanged()">
        <option value="reservoir">Hồ chứa</option>
        <option value="pump">Trạm bơm</option>
        <option value="sluice">Cống điều tiết</option>
      </select></div>
    <div class="form-group"><label class="form-label">Công trình *</label>
      <select id="irdEObj" class="form-control">
        ${IRD_RESERVOIRS.map(r=>`<option value="res:${r.id}">${r.name} (Hồ chứa)</option>`).join('')}
        ${IRD_PUMPS.map(p=>`<option value="pmp:${p.id}">${p.name} (Trạm bơm)</option>`).join('')}
        ${IRD_SLUICES.map(c=>`<option value="slc:${c.id}">${c.name} (Cống)</option>`).join('')}
      </select></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label" id="irdELabel1">Chỉ số chính</label>
        <input id="irdEVal1" class="form-control" type="number" step="0.01" placeholder="Nhập giá trị..."></div>
      <div class="form-group"><label class="form-label" id="irdELabel2">Chỉ số phụ</label>
        <input id="irdEVal2" class="form-control" type="number" step="0.1" placeholder="Nhập giá trị..."></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Thời điểm</label>
        <input id="irdETime" class="form-control" value="${new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}"></div>
      <div class="form-group"><label class="form-label">Người nhập</label>
        <input id="irdEUser" class="form-control" placeholder="Họ tên..."></div>
    </div>
    <div class="form-group"><label class="form-label">Ghi chú</label>
      <input id="irdENote" class="form-control" placeholder="Ghi chú vận hành..."></div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="irdSaveEntryForm()">Lưu số liệu</button>
  </div>`);
};

window.irdEntryTypeChanged = function() {
  const t = document.getElementById('irdEType')?.value;
  const l1 = document.getElementById('irdELabel1');
  const l2 = document.getElementById('irdELabel2');
  if (t === 'reservoir' && l1 && l2) { l1.textContent = 'Mực nước H (m)'; l2.textContent = 'Q đến hồ (m³/s)'; }
  else if (t === 'pump'  && l1 && l2) { l1.textContent = 'Số máy chạy'; l2.textContent = 'Q thực tế (m³/s)'; }
  else if (t === 'sluice'&& l1 && l2) { l1.textContent = 'Độ mở (%)'; l2.textContent = 'Q qua cống (m³/s)'; }
};

window.irdSaveEntryForm = function() {
  const objVal = document.getElementById('irdEObj')?.value;
  const v1 = parseFloat(document.getElementById('irdEVal1')?.value);
  const v2 = parseFloat(document.getElementById('irdEVal2')?.value)||0;
  if (!objVal || isNaN(v1)) { showToast('⚠ Vui lòng chọn công trình và nhập giá trị!'); return; }
  const [type, id] = objVal.split(':');
  if (type === 'res') {
    const r = IRD_RESERVOIRS.find(x=>x.id===id); if(!r) return;
    r.currentH = v1; r.inQ = v2;
    r.currentW = parseFloat((r.capacity*(v1-r.MNCN)/(r.MNTTK-r.MNCN)).toFixed(2));
    r.lastUpdate = new Date().toLocaleString('vi-VN');
    showToast(v1>=r.MNLKT?`⚠ H=${v1}m vượt MNLKT! Đã lưu ${r.name}.`:`✅ Cập nhật ${r.name}: H=${v1}m`);
  } else if (type === 'pmp') {
    const p = IRD_PUMPS.find(x=>x.id===id); if(!p) return;
    p.pumpsRunning = parseInt(v1)||0; p.flowActual = v2;
    showToast(`✅ Cập nhật ${p.name}: ${p.pumpsRunning}/${p.pumps} máy, Q=${v2}m³/s`);
  } else if (type === 'slc') {
    const c = IRD_SLUICES.find(x=>x.id===id); if(!c) return;
    c.openPct = Math.min(100,Math.max(0,parseInt(v1)||0)); c.currentQ = v2;
    c.status = c.openPct===0?'closed':'ok'; c.lastOp = new Date().toLocaleString('vi-VN');
    showToast(`✅ Cập nhật cống ${c.name}: Mở ${c.openPct}%, Q=${v2}m³/s`);
  }
  closeModal();
  irdSwitchTab(irdTab);
};

// Override irdViewReservoir to fix missing irrigArea
window.irdViewReservoir = function(id) {
  const r = IRD_RESERVOIRS.find(x=>x.id===id); if(!r) return;
  const pct = Math.round(r.currentW/r.capacity*100);
  openModal(`
  <div class="modal-header"><span class="modal-title">${r.name}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">
      ${[['Huyện',r.district],['Diện tích lòng hồ',r.area+' ha'],['Đơn vị QL',r.operator],
         ['Dung tích TK',r.capacity+' triệu m³'],['Cập nhật lần cuối',r.lastUpdate],['Mã hồ',r.id]].map(([l,v])=>`
      <div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px;padding:10px">
        <div style="font-size:10px;color:var(--muted)">${l}</div>
        <div style="font-size:12px;font-weight:600;margin-top:2px">${v||'—'}</div>
      </div>`).join('')}
    </div>
    <div style="background:rgba(0,200,255,.06);border:1px solid rgba(0,200,255,.2);border-radius:10px;padding:14px;margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="font-size:13px;font-weight:700">H = <span style="color:var(--cyan)">${r.currentH.toFixed(2)} m</span></span>
        <span style="font-size:12px;color:var(--muted)">${r.currentW.toFixed(1)}/${r.capacity} triệu m³ (${pct}%)</span>
      </div>
      <div style="height:10px;background:rgba(255,255,255,.08);border-radius:5px;overflow:hidden">
        <div style="width:${pct}%;height:100%;background:${pct>=70?'var(--green)':pct>=40?'var(--yellow)':'#f87171'};border-radius:5px"></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:5px;font-size:10px;color:var(--muted)">
        <span>MNCN: ${r.MNCN}m</span><span>MNDBT: ${r.MNDBT}m</span><span>MNLKT: ${r.MNLKT}m</span><span>MNTTK: ${r.MNTTK}m</span>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
      ${[['Q xả tràn',r.spillQ.toFixed(1)+' m³/s','var(--yellow)'],['Q xả đáy',r.bottomQ.toFixed(1)+' m³/s','var(--cyan)'],['Q đến hồ',r.inQ.toFixed(1)+' m³/s','var(--green)']].map(([l,v,c])=>`
      <div style="text-align:center;padding:10px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px">
        <div style="font-size:10px;color:var(--muted);margin-bottom:4px">${l}</div>
        <div style="font-size:16px;font-weight:700;color:${c}">${v}</div>
      </div>`).join('')}
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-primary" onclick="closeModal();irdUpdateReservoir('${r.id}')">Cập nhật số liệu</button>
  </div>`);
};
