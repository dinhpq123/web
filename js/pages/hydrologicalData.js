// ── HADIWA IOC — Nhập liệu Quan trắc Thủy văn v6.3.1 ─────────────
// Mực nước · Lưu lượng · Lượng mưa — Chuẩn KTTV & VNDMS
// REWRITE: unified tab switch, no patch overrides

let hydTab = 'waterlevel';

const HYD_STATIONS = [
  { id:'TV-HN', name:'Hà Nội (Long Biên)', river:'Sông Hồng', type:'waterlevel',
    BĐ1:9.5, BĐ2:10.5, BĐ3:11.0, morning:8.42, evening:8.51, max:8.54, min:8.38, trend:'up', unit:'m' },
  { id:'TV-ST', name:'Sơn Tây', river:'Sông Hồng', type:'waterlevel',
    BĐ1:8.5, BĐ2:9.5, BĐ3:10.5, morning:6.82, evening:6.95, max:6.99, min:6.80, trend:'up', unit:'m' },
  { id:'TV-TC', name:'Thượng Cát', river:'Sông Hồng', type:'waterlevel',
    BĐ1:8.9, BĐ2:9.9, BĐ3:10.5, morning:7.22, evening:7.30, max:7.33, min:7.18, trend:'stable', unit:'m' },
  { id:'TV-LM', name:'Liên Mạc', river:'Sông Hồng', type:'waterlevel',
    BĐ1:9.0, BĐ2:10.0, BĐ3:10.5, morning:7.65, evening:7.71, max:7.74, min:7.60, trend:'up', unit:'m' },
  { id:'TV-HMG', name:'Hưng Mục Giang', river:'Sông Đà', type:'waterlevel',
    BĐ1:14.0, BĐ2:16.0, BĐ3:18.0, morning:12.30, evening:12.41, max:12.45, min:12.28, trend:'stable', unit:'m' },
  { id:'TV-ĐĐ', name:'Đa Độ', river:'Sông Đáy', type:'waterlevel',
    BĐ1:3.0, BĐ2:4.0, BĐ3:4.5, morning:2.15, evening:2.18, max:2.20, min:2.12, trend:'stable', unit:'m' },
  { id:'TV-MS', name:'Mai Sơn', river:'Sông Bùi', type:'waterlevel',
    BĐ1:3.8, BĐ2:4.5, BĐ3:5.0, morning:3.22, evening:3.28, max:3.31, min:3.20, trend:'up', unit:'m' },
  { id:'TV-TE', name:'Tế Tiêu', river:'Sông Đáy', type:'waterlevel',
    BĐ1:5.0, BĐ2:6.0, BĐ3:7.0, morning:4.11, evening:4.15, max:4.18, min:4.09, trend:'stable', unit:'m' },
];

const HYD_RAIN_STATIONS = [
  { id:'DM-HN', name:'Hà Nội (Láng)', district:'Đống Đa', h24:0, h3d:12.5, h7d:45.2 },
  { id:'DM-ST', name:'Sơn Tây', district:'Sơn Tây', h24:2.3, h3d:18.1, h7d:52.0 },
  { id:'DM-BV', name:'Ba Vì', district:'Ba Vì', h24:5.8, h3d:28.4, h7d:68.5 },
  { id:'DM-PX', name:'Phú Xuyên', district:'Phú Xuyên', h24:0, h3d:8.2, h7d:32.1 },
  { id:'DM-MD', name:'Mỹ Đức', district:'Mỹ Đức', h24:3.1, h3d:22.6, h7d:58.4 },
  { id:'DM-CM', name:'Chương Mỹ', district:'Chương Mỹ', h24:1.5, h3d:15.3, h7d:44.8 },
  { id:'DM-DA', name:'Đông Anh', district:'Đông Anh', h24:0, h3d:9.8, h7d:38.2 },
  { id:'DM-SS', name:'Sóc Sơn', district:'Sóc Sơn', h24:0, h3d:6.4, h7d:28.0 },
];

// ── MAIN RENDER ───────────────────────────────────────────────────
function renderHydrologicalData() {
  const alertStations = HYD_STATIONS.filter(s => s.morning >= s.BĐ1).length;
  const maxRain = Math.max(...HYD_RAIN_STATIONS.map(r => r.h24));
  const totalRain = HYD_RAIN_STATIONS.filter(r => r.h24 > 0).length;
  return `
  <div class="page-header">
    <div class="page-title"><h1>Nhập liệu Quan trắc Thủy văn</h1>
      <p>Mực nước · Lưu lượng · Lượng mưa — Chuẩn KTTV · ${HYD_STATIONS.length} trạm thủy văn · ${HYD_RAIN_STATIONS.length} trạm đo mưa</p></div>
    <div class="page-actions">
      <button class="btn btn-ghost btn-sm" onclick="hydImportData()">Nhập từ Excel</button>
      <button class="btn btn-ghost btn-sm" onclick="hydDownloadTemplate()">Template CSV</button>
      <button class="btn btn-ghost btn-sm" onclick="hydExportReport()">Xuất báo cáo</button>
      <button class="btn btn-primary btn-sm" onclick="hydOpenEntryForm()">+ Nhập số liệu</button>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px">
    ${[['Trạm quan trắc', HYD_STATIONS.length, 'var(--cyan)', '8 trạm thủy văn'],
       ['Đang vượt BĐ1', alertStations, 'var(--yellow)', 'Cần theo dõi'],
       ['Có mưa hôm nay', totalRain, 'var(--blue)', `Max ${maxRain.toFixed(1)} mm`],
       ['Đợt quan trắc', '06:00', 'var(--green)', 'Cập nhật sáng']].map(([l,v,c,s]) => `
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:16px 18px">
      <div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">${l}</div>
      <div style="font-size:26px;font-weight:800;color:${c}">${v}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:3px">${s}</div>
    </div>`).join('')}
  </div>
  <div class="tabs" id="hydTabs" style="margin-bottom:18px">
    <button class="tab-btn ${hydTab==='waterlevel'?'active':''}" onclick="hydSwitchTab('waterlevel')">Mực nước (${HYD_STATIONS.length})</button>
    <button class="tab-btn ${hydTab==='rain'?'active':''}" onclick="hydSwitchTab('rain')">Lượng mưa (${HYD_RAIN_STATIONS.length})</button>
    <button class="tab-btn ${hydTab==='report'?'active':''}" onclick="hydSwitchTab('report')">Tổng hợp báo cáo</button>
  </div>
  <div id="hydTabContent">${_hydRenderTab()}</div>`;
}

// ── TAB SWITCH ────────────────────────────────────────────────────
window.hydSwitchTab = function(tab) {
  hydTab = tab;
  // Update content
  const contentEl = document.getElementById('hydTabContent');
  if (contentEl) contentEl.innerHTML = _hydRenderTab();
  // Update only THIS page's tab buttons (inside #hydTabs)
  const tabsEl = document.getElementById('hydTabs');
  if (tabsEl) {
    tabsEl.querySelectorAll('.tab-btn').forEach(b => {
      const labels = { waterlevel:'Mực nước', rain:'Lượng mưa', report:'Tổng hợp' };
      b.classList.toggle('active', b.textContent.trim().startsWith(labels[tab]?.substring(0,6) || '__'));
    });
  }
};

function _hydRenderTab() {
  if (hydTab === 'waterlevel') return _hydWaterLevel();
  if (hydTab === 'rain')       return _hydRain();
  if (hydTab === 'report')     return _hydReport();
  return '';
}

// ── TAB: MỰC NƯỚC ────────────────────────────────────────────────
function _hydWaterLevel() {
  const trendIcon  = { up:'↑', down:'↓', stable:'→' };
  const trendColor = { up:'var(--yellow)', down:'var(--cyan)', stable:'var(--muted)' };
  return `
  <div class="card" style="padding:0">
    <div class="card-header">
      <span class="card-title">Mực nước sông — Đợt quan trắc sáng ${new Date().toLocaleDateString('vi-VN')}</span>
      <div style="display:flex;gap:6px">
        <button class="btn btn-ghost btn-sm" onclick="hydImportData('waterlevel')">Nhập từ Excel</button>
        <button class="btn btn-outline btn-sm" onclick="hydOpenEntryForm('waterlevel')">+ Nhập số liệu</button>
      </div>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>Trạm</th><th>Sông</th><th>H sáng (m)</th><th>H chiều (m)</th><th>H max</th><th>H min</th><th>Xu hướng</th><th>BĐ1</th><th>Trạng thái</th><th></th></tr></thead>
      <tbody>${HYD_STATIONS.map(s => {
        const overBĐ1 = s.morning >= s.BĐ1;
        const overBĐ2 = s.morning >= s.BĐ2;
        const overBĐ3 = s.morning >= s.BĐ3;
        const hColor  = overBĐ3?'#f87171':overBĐ2?'var(--red)':overBĐ1?'var(--yellow)':'var(--green)';
        const badge   = overBĐ3?['badge-red','Trên BĐ3']:overBĐ2?['badge-red','Trên BĐ2']:overBĐ1?['badge-yellow','Trên BĐ1']:['badge-green','Bình thường'];
        return `<tr>
          <td style="font-weight:700;font-size:12px">${s.name}</td>
          <td style="font-size:11px;color:var(--muted)">${s.river}</td>
          <td><span style="font-size:16px;font-weight:800;color:${hColor}">${s.morning.toFixed(2)}</span></td>
          <td class="mono" style="font-size:12px">${s.evening.toFixed(2)}</td>
          <td class="mono" style="font-size:11px;color:var(--red)">${s.max.toFixed(2)}</td>
          <td class="mono" style="font-size:11px;color:var(--cyan)">${s.min.toFixed(2)}</td>
          <td style="font-size:16px;color:${trendColor[s.trend]}">${trendIcon[s.trend]}</td>
          <td class="mono" style="font-size:11px;color:var(--muted)">${s.BĐ1}</td>
          <td><span class="badge ${badge[0]}" style="font-size:10px">${badge[1]}</span></td>
          <td><button class="btn btn-ghost btn-xs" onclick="hydUpdateStation('${s.id}')">Cập nhật</button></td>
        </tr>`;}).join('')}
      </tbody>
    </table></div>
  </div>`;
}

// ── TAB: LƯỢNG MƯA ───────────────────────────────────────────────
function _hydRain() {
  return `
  <div class="card" style="padding:0">
    <div class="card-header">
      <span class="card-title">Lượng mưa theo trạm — ${new Date().toLocaleDateString('vi-VN')}</span>
      <div style="display:flex;gap:6px">
        <button class="btn btn-ghost btn-sm" onclick="hydImportData('rain')">Nhập từ Excel</button>
        <button class="btn btn-ghost btn-sm" onclick="hydDlRainTemplate()">Template CSV</button>
        <button class="btn btn-outline btn-sm" onclick="hydOpenRainForm()">+ Nhập mưa</button>
      </div>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>Trạm đo mưa</th><th>Huyện/TP</th><th>Mưa 24h (mm)</th><th>Lũy kế 3 ngày</th><th>Lũy kế 7 ngày</th><th>Mức độ</th><th></th></tr></thead>
      <tbody>${HYD_RAIN_STATIONS.map(r => {
        const level = r.h24>=100?['badge-red','Đặc biệt lớn']:r.h24>=50?['badge-yellow','Rất to']:r.h24>=25?['badge-blue','To']:r.h24>=10?['badge-gray','Vừa']:['badge-gray','Nhỏ/Không'];
        const barW  = Math.min(r.h24/150*100, 100);
        const barC  = r.h24>=50?'#f87171':r.h24>=25?'var(--yellow)':'var(--cyan)';
        return `<tr>
          <td style="font-weight:700;font-size:12px">${r.name}</td>
          <td style="font-size:11px;color:var(--muted)">${r.district}</td>
          <td>
            <div style="display:flex;align-items:center;gap:8px">
              <div style="width:60px;height:6px;background:rgba(255,255,255,.08);border-radius:3px">
                <div style="width:${barW}%;height:100%;background:${barC};border-radius:3px"></div>
              </div>
              <span style="font-size:13px;font-weight:700;color:${r.h24>0?barC:'var(--muted)'}">${r.h24.toFixed(1)}</span>
            </div></td>
          <td class="mono" style="font-size:12px">${r.h3d.toFixed(1)}</td>
          <td class="mono" style="font-size:12px;color:var(--muted)">${r.h7d.toFixed(1)}</td>
          <td><span class="badge ${level[0]}" style="font-size:10px">${level[1]}</span></td>
          <td><button class="btn btn-ghost btn-xs" onclick="hydUpdateRainStation('${r.id}')">Cập nhật</button></td>
        </tr>`;}).join('')}
      </tbody>
    </table></div>
  </div>`;
}

// ── TAB: TỔNG HỢP ────────────────────────────────────────────────
function _hydReport() {
  const today    = new Date().toLocaleDateString('vi-VN');
  const overBD1  = HYD_STATIONS.filter(s => s.morning >= s.BĐ1);
  const rainList = HYD_RAIN_STATIONS.filter(r => r.h24 > 0);
  return `
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
    <div class="card">
      <div class="card-header"><span class="card-title">Bản tin thủy văn — ${today}</span></div>
      <div style="padding:0 20px 16px">
        ${overBD1.length > 0 ? `
        <div style="background:rgba(255,202,40,.08);border:1px solid rgba(255,202,40,.25);border-radius:8px;padding:12px 14px;margin-bottom:12px;font-size:12px;color:var(--yellow)">
          ⚠ <strong>${overBD1.length} trạm</strong> đang ở mực nước trên BĐ1: ${overBD1.map(s=>s.name).join(', ')}
        </div>` : ''}
        <div style="font-size:12px;line-height:1.8;color:rgba(255,255,255,.75)">
          Mực nước sông Hồng tại Hà Nội hiện là <strong style="color:var(--cyan)">${HYD_STATIONS[0].morning.toFixed(2)} m</strong>, 
          thấp hơn BĐ1 là ${(HYD_STATIONS[0].BĐ1 - HYD_STATIONS[0].morning).toFixed(2)} m.
          ${rainList.length > 0 ? `Lượng mưa trong ngày: ${rainList.slice(0,3).map(r=>`${r.name} (${r.h24.toFixed(1)}mm)`).join(', ')}.` : 'Không có mưa đáng kể.'}
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">Xuất báo cáo quan trắc</span></div>
      <div style="padding:0 20px 16px;display:flex;flex-direction:column;gap:10px">
        ${[['Báo cáo mực nước ngày','Tổng hợp H sáng-chiều, max/min, xu hướng','var(--cyan)'],
           ['Báo cáo lượng mưa ngày','Lượng mưa 24h toàn bộ trạm đo','var(--blue)'],
           ['Bản tin cảnh báo sớm','Tổng hợp tình hình + cảnh báo vùng ngập','var(--yellow)'],
           ['Báo cáo tháng tổng hợp','KPI thủy văn tháng + so sánh năm trước','var(--purple)']].map(([t,d,c]) => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:8px;cursor:pointer" onclick="hydExportReport('${t}')">
          <div>
            <div style="font-size:12px;font-weight:700;color:${c}">${t}</div>
            <div style="font-size:11px;color:var(--muted);margin-top:2px">${d}</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}

// ── NHẬP SỐ LIỆU MỰC NƯỚC (single station) ───────────────────────
window.hydUpdateStation = function(id) {
  const s = HYD_STATIONS.find(x => x.id === id); if (!s) return;
  openModal(`
  <div class="modal-header"><span class="modal-title">Nhập số liệu — ${s.name}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">
      ${[['BĐ1',s.BĐ1],['BĐ2',s.BĐ2],['BĐ3',s.BĐ3]].map(([l,v]) => `
      <div style="background:rgba(255,202,40,.08);border:1px solid rgba(255,202,40,.2);border-radius:8px;padding:8px 10px;text-align:center">
        <div style="font-size:10px;color:var(--muted)">${l}</div>
        <div style="font-size:14px;font-weight:700;color:var(--yellow)">${v} m</div>
      </div>`).join('')}
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">H sáng 06:00 (m) *</label>
        <input id="hydM" class="form-control" type="number" step="0.01" value="${s.morning}"></div>
      <div class="form-group"><label class="form-label">H chiều 18:00 (m)</label>
        <input id="hydE" class="form-control" type="number" step="0.01" value="${s.evening}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">H max ngày</label>
        <input id="hydMax" class="form-control" type="number" step="0.01" value="${s.max}"></div>
      <div class="form-group"><label class="form-label">H min ngày</label>
        <input id="hydMin" class="form-control" type="number" step="0.01" value="${s.min}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Xu hướng</label>
        <select id="hydTrend" class="form-control">
          <option value="up" ${s.trend==='up'?'selected':''}>↑ Dâng</option>
          <option value="stable" ${s.trend==='stable'?'selected':''}>→ Ổn định</option>
          <option value="down" ${s.trend==='down'?'selected':''}>↓ Giảm</option>
        </select></div>
      <div class="form-group"><label class="form-label">Người quan trắc</label>
        <input id="hydObs" class="form-control" placeholder="Họ tên"></div>
    </div>
    <div class="form-group"><label class="form-label">Ghi chú</label>
      <input id="hydNote" class="form-control" placeholder="Thông tin bất thường..."></div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="hydSaveStation('${s.id}')">Lưu số liệu</button>
  </div>`);
};

window.hydSaveStation = function(id) {
  const s = HYD_STATIONS.find(x => x.id === id); if (!s) return;
  const m = parseFloat(document.getElementById('hydM')?.value);
  if (isNaN(m)) { showToast('⚠ Nhập mực nước hợp lệ!'); return; }
  s.morning = m;
  s.evening = parseFloat(document.getElementById('hydE')?.value) || s.evening;
  s.max     = parseFloat(document.getElementById('hydMax')?.value) || m;
  s.min     = parseFloat(document.getElementById('hydMin')?.value) || m;
  s.trend   = document.getElementById('hydTrend')?.value || 'stable';
  closeModal();
  const warn = m>=s.BĐ3?'🔴 Vượt BĐ3!':m>=s.BĐ2?'⚠ Vượt BĐ2!':m>=s.BĐ1?'⚠ Vượt BĐ1!':'';
  showToast(`✅ Trạm ${s.name}: H=${m.toFixed(2)}m${warn?' · '+warn:''}`);
  const el = document.getElementById('hydTabContent');
  if (el) el.innerHTML = _hydRenderTab();
};

// ── NHẬP SỐ LIỆU FORM — opens per context ────────────────────────
window.hydOpenEntryForm = function(type) {
  if (type === 'rain' || hydTab === 'rain') {
    hydOpenRainForm();
  } else {
    // Open quick-entry for all water-level stations
    openModal(`
    <div class="modal-header"><span class="modal-title">Nhập nhanh Mực nước — Đợt sáng ${new Date().toLocaleDateString('vi-VN')}</span>
      <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
    <div class="modal-body" style="max-height:72vh;overflow-y:auto">
      <div style="font-size:11px;color:var(--muted);margin-bottom:12px">Nhập mực nước H sáng 06:00 cho tất cả trạm. Để trống nếu chưa có số liệu.</div>
      <table style="width:100%;border-collapse:collapse">
        <thead><tr style="background:rgba(255,255,255,.04)">
          <th style="padding:8px 10px;font-size:11px;text-align:left">Trạm</th>
          <th style="padding:8px 10px;font-size:11px;text-align:left">Sông</th>
          <th style="padding:8px 10px;font-size:11px;text-align:left">BĐ1</th>
          <th style="padding:8px 10px;font-size:11px;text-align:left">H hiện tại</th>
          <th style="padding:8px 10px;font-size:11px;text-align:left">H sáng mới (m)</th>
          <th style="padding:8px 10px;font-size:11px;text-align:left">Xu hướng</th>
        </tr></thead>
        <tbody>${HYD_STATIONS.map(s => {
          const hc = s.morning>=s.BĐ2?'#f87171':s.morning>=s.BĐ1?'var(--yellow)':'var(--green)';
          return `<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
            <td style="padding:7px 10px;font-size:12px;font-weight:600">${s.name}</td>
            <td style="padding:7px 10px;font-size:11px;color:var(--muted)">${s.river}</td>
            <td style="padding:7px 10px;font-size:11px;color:var(--yellow)">${s.BĐ1}m</td>
            <td style="padding:7px 10px;font-size:13px;font-weight:700;color:${hc}">${s.morning.toFixed(2)}</td>
            <td style="padding:5px 10px"><input id="hwl_${s.id}" class="form-control" type="number" step="0.01" placeholder="${s.morning}" style="width:90px"></td>
            <td style="padding:5px 10px">
              <select id="htr_${s.id}" class="form-control" style="width:100px">
                <option value="up" ${s.trend==='up'?'selected':''}>↑ Dâng</option>
                <option value="stable" ${s.trend==='stable'?'selected':''}>→ Ổn định</option>
                <option value="down" ${s.trend==='down'?'selected':''}>↓ Giảm</option>
              </select>
            </td>
          </tr>`;}).join('')}
        </tbody>
      </table>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="hydSaveAllWaterLevel()">Lưu tất cả</button>
    </div>`);
  }
};

window.hydSaveAllWaterLevel = function() {
  let count = 0;
  HYD_STATIONS.forEach(s => {
    const el = document.getElementById('hwl_' + s.id);
    const tr = document.getElementById('htr_' + s.id);
    if (el && el.value !== '') {
      const v = parseFloat(el.value);
      if (!isNaN(v)) { s.morning = v; s.max = Math.max(v, s.max); s.min = Math.min(v, s.min); count++; }
    }
    if (tr) s.trend = tr.value;
  });
  closeModal();
  const alertC = HYD_STATIONS.filter(s => s.morning >= s.BĐ1).length;
  showToast(`✅ Đã lưu mực nước cho ${count} trạm.${alertC>0?' ⚠ '+alertC+' trạm vượt BĐ1!':''}`);
  const el = document.getElementById('hydTabContent');
  if (el) el.innerHTML = _hydRenderTab();
};

// ── NHẬP LƯỢNG MƯA (single station) ──────────────────────────────
window.hydUpdateRainStation = function(id) {
  const r = HYD_RAIN_STATIONS.find(x => x.id === id); if (!r) return;
  openModal(`
  <div class="modal-header"><span class="modal-title">Nhập lượng mưa — Trạm ${r.name}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-row">
      <div class="form-group"><label class="form-label">Lượng mưa 24h (mm) *</label>
        <input id="rainH24" class="form-control" type="number" step="0.1" min="0" value="${r.h24}"></div>
      <div class="form-group"><label class="form-label">Lũy kế 3 ngày (mm)</label>
        <input id="rainH3" class="form-control" type="number" step="0.1" value="${r.h3d}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Lũy kế 7 ngày (mm)</label>
        <input id="rainH7" class="form-control" type="number" step="0.1" value="${r.h7d}"></div>
      <div class="form-group"><label class="form-label">Ngày quan trắc</label>
        <input id="rainDate" class="form-control" value="${new Date().toLocaleDateString('vi-VN')}"></div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="hydSaveRain('${r.id}')">Lưu</button>
  </div>`);
};

window.hydSaveRain = function(id) {
  const r = HYD_RAIN_STATIONS.find(x => x.id === id); if (!r) return;
  r.h24 = parseFloat(document.getElementById('rainH24')?.value) || 0;
  r.h3d = parseFloat(document.getElementById('rainH3')?.value)  || 0;
  r.h7d = parseFloat(document.getElementById('rainH7')?.value)  || 0;
  closeModal();
  const warn = r.h24>=100?'⚠ Mưa đặc biệt lớn!':r.h24>=50?'Mưa rất to.':'';
  showToast(`✅ Trạm ${r.name}: ${r.h24}mm/24h. ${warn}`);
  const el = document.getElementById('hydTabContent');
  if (el) el.innerHTML = _hydRenderTab();
};

// ── NHẬP NHANH LƯỢNG MƯA TOÀN BỘ TRẠM ───────────────────────────
window.hydOpenRainForm = function() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Nhập lượng mưa — Đợt quan trắc ${new Date().toLocaleDateString('vi-VN')}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body" style="max-height:72vh;overflow-y:auto">
    <div style="font-size:11px;color:var(--muted);margin-bottom:12px">Nhập nhanh lượng mưa 24h cho tất cả trạm. Để trống nếu không có số liệu.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      ${HYD_RAIN_STATIONS.map(r => `
      <div style="padding:10px 12px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:8px">
        <div style="font-size:12px;font-weight:700;margin-bottom:2px">${r.name}</div>
        <div style="font-size:10px;color:var(--muted);margin-bottom:6px">${r.district} · 3 ngày: ${r.h3d.toFixed(1)}mm</div>
        <div style="display:flex;align-items:center;gap:6px">
          <input id="hrn_${r.id}" class="form-control" type="number" step="0.1" min="0" placeholder="0.0" value="${r.h24 || ''}" style="width:80px">
          <span style="font-size:11px;color:var(--muted)">mm/24h</span>
        </div>
      </div>`).join('')}
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="hydSaveAllRain()">Lưu tất cả</button>
  </div>`);
};

window.hydSaveAllRain = function() {
  let count = 0;
  HYD_RAIN_STATIONS.forEach(r => {
    const el = document.getElementById('hrn_' + r.id);
    if (el && el.value !== '') {
      const v = parseFloat(el.value);
      if (!isNaN(v) && v >= 0) { r.h24 = v; count++; }
    }
  });
  closeModal();
  const max = Math.max(...HYD_RAIN_STATIONS.map(r => r.h24));
  showToast(`✅ Đã lưu số liệu mưa cho ${count} trạm.${max>=50?' ⚠ Có trạm mưa rất to!':''}`);
  const el = document.getElementById('hydTabContent');
  if (el) el.innerHTML = _hydRenderTab();
};

// ── EXPORT REPORT ─────────────────────────────────────────────────
window.hydExportReport = function(reportName) {
  if (reportName) {
    const isRain = reportName.toLowerCase().includes('mưa');
    if (isRain) {
      const headers = ['Trạm', 'Huyện', 'Mưa 24h (mm)', 'Lũy kế 3 ngày', 'Lũy kế 7 ngày'];
      const rows = HYD_RAIN_STATIONS.map(r => [r.name, r.district, r.h24.toFixed(1), r.h3d.toFixed(1), r.h7d.toFixed(1)]);
      const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
      const blob = new Blob(['\uFEFF'+csv], {type:'text/csv;charset=utf-8;'});
      const url = URL.createObjectURL(blob); const a = document.createElement('a');
      a.href=url; a.download=`LuongMua_${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
    } else {
      const headers = ['Trạm','Sông','H sáng','H chiều','H max','H min','Xu hướng','Trạng thái'];
      const rows = HYD_STATIONS.map(s => [s.name, s.river, s.morning.toFixed(2), s.evening.toFixed(2), s.max.toFixed(2), s.min.toFixed(2),
        {up:'Dâng',down:'Giảm',stable:'Ổn định'}[s.trend],
        s.morning>=s.BĐ3?'Trên BĐ3':s.morning>=s.BĐ2?'Trên BĐ2':s.morning>=s.BĐ1?'Trên BĐ1':'Bình thường']);
      const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
      const blob = new Blob(['\uFEFF'+csv], {type:'text/csv;charset=utf-8;'});
      const url = URL.createObjectURL(blob); const a = document.createElement('a');
      a.href=url; a.download=`MucNuoc_${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
    }
    showToast(`✅ Đã xuất: ${reportName}`);
    return;
  }
  hydSwitchTab('report');
};

// ── IMPORT (delegate to importHelper.js) ─────────────────────────
const HYD_WL_HEADERS   = ['Mã trạm','Tên trạm','Sông','H sáng (m)','H chiều (m)','H max','H min','Xu hướng (up/down/stable)'];
const HYD_RAIN_HEADERS = ['Mã trạm','Tên trạm','Huyện','Mưa 24h (mm)','Lũy kế 3 ngày (mm)','Lũy kế 7 ngày (mm)'];

window.hydDownloadTemplate = function() {
  if (typeof downloadImportTemplate !== 'function') { showToast('⚠ Chưa tải helper!'); return; }
  if (hydTab === 'rain') {
    const rows = HYD_RAIN_STATIONS.map(r => [r.id, r.name, r.district, r.h24.toFixed(1), r.h3d.toFixed(1), r.h7d.toFixed(1)]);
    downloadImportTemplate(`Template_LuongMua_${new Date().toISOString().slice(0,10)}.csv`, HYD_RAIN_HEADERS, rows);
  } else {
    const rows = HYD_STATIONS.map(s => [s.id, s.name, s.river, s.morning.toFixed(2), s.evening.toFixed(2), s.max.toFixed(2), s.min.toFixed(2), s.trend]);
    downloadImportTemplate(`Template_MucNuoc_${new Date().toISOString().slice(0,10)}.csv`, HYD_WL_HEADERS, rows);
  }
};

window.hydDlRainTemplate = function() {
  if (typeof downloadImportTemplate !== 'function') { showToast('⚠ Chưa tải helper!'); return; }
  const rows = HYD_RAIN_STATIONS.map(r => [r.id, r.name, r.district, r.h24.toFixed(1), r.h3d.toFixed(1), r.h7d.toFixed(1)]);
  downloadImportTemplate(`Template_LuongMua_${new Date().toISOString().slice(0,10)}.csv`, HYD_RAIN_HEADERS, rows);
};

window.hydImportData = function(forceType) {
  if (typeof triggerImportFilePicker !== 'function') { showToast('⚠ Chưa tải helper!'); return; }
  const type = forceType || hydTab;
  if (type === 'rain') { hydImportRain(); return; }
  // Water level import
  triggerImportFilePicker((fileName, parsedRows) => {
    const dataRows = parsedRows.length > 0 && parsedRows[0][0] === HYD_WL_HEADERS[0] ? parsedRows.slice(1) : parsedRows;
    if (!dataRows.length) { showToast('⚠ File không có dữ liệu!'); return; }
    showImportConfirmModal({
      title: 'Quan trắc Mực nước', fileName, headers: HYD_WL_HEADERS, rows: dataRows,
      validators: [IV.required, IV.required, IV.any, IV.numRange(-5,30), IV.numRange(-5,30), IV.numRange(-5,30), IV.numRange(-5,30), IV.oneOf('up','down','stable')],
      displayCols: ['Tên trạm','Sông','H sáng (m)','H chiều (m)','H max','Xu hướng (up/down/stable)'],
      onConfirm: (validRows) => {
        let updated = 0;
        validRows.forEach(row => {
          const s = HYD_STATIONS.find(x => x.id === row[0]?.trim() || x.name === row[1]?.trim());
          if (!s) return;
          s.morning = parseFloat(row[3]) || s.morning;
          s.evening = parseFloat(row[4]) || s.evening;
          s.max     = parseFloat(row[5]) || s.max;
          s.min     = parseFloat(row[6]) || s.min;
          s.trend   = row[7]?.trim() || s.trend;
          updated++;
        });
        const el = document.getElementById('hydTabContent'); if (el) el.innerHTML = _hydRenderTab();
        showToast(`✅ Import: Cập nhật ${updated} trạm quan trắc!`);
      }
    });
  });
};

window.hydImportRain = function() {
  if (typeof triggerImportFilePicker !== 'function') { showToast('⚠ Chưa tải helper!'); return; }
  triggerImportFilePicker((fileName, parsedRows) => {
    const dataRows = parsedRows.length > 0 && parsedRows[0][0] === HYD_RAIN_HEADERS[0] ? parsedRows.slice(1) : parsedRows;
    if (!dataRows.length) { showToast('⚠ File không có dữ liệu!'); return; }
    showImportConfirmModal({
      title: 'Quan trắc Lượng mưa', fileName, headers: HYD_RAIN_HEADERS, rows: dataRows,
      validators: [IV.required, IV.required, IV.any, IV.numRange(0,1000), IV.numRange(0,2000), IV.numRange(0,5000)],
      displayCols: ['Tên trạm','Huyện','Mưa 24h (mm)','Lũy kế 3 ngày (mm)','Lũy kế 7 ngày (mm)'],
      onConfirm: (validRows) => {
        let updated = 0;
        validRows.forEach(row => {
          const r = HYD_RAIN_STATIONS.find(x => x.id === row[0]?.trim() || x.name === row[1]?.trim());
          if (!r) return;
          r.h24 = parseFloat(row[3]) || 0;
          r.h3d = parseFloat(row[4]) || r.h3d;
          r.h7d = parseFloat(row[5]) || r.h7d;
          updated++;
        });
        const el = document.getElementById('hydTabContent'); if (el) el.innerHTML = _hydRenderTab();
        showToast(`✅ Import: Cập nhật ${updated} trạm đo mưa!`);
      }
    });
  });
};
