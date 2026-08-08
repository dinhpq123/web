// ── HADIWA IOC — IOT MONITORING (GIÁM SÁT IOT) ──────────────────────
let iotTab = 'overview';
let _iotCharts = {};

function _destroyIotCharts() {
  Object.values(_iotCharts).forEach(c => { try { c.destroy(); } catch(e){} });
  _iotCharts = {};
}

function renderIotMonitor() {
  _destroyIotCharts();
  const stations = window.DATA?.stations || [];
  const maxRain  = Math.max(...stations.map(s => s.rainfall || 0), 1);
  const maxRainSt = stations.find(s => s.rainfall === maxRain);
  const online   = stations.filter(s => s.status === 'online').length;
  const warning  = stations.filter(s => s.status === 'warning').length;
  const offline  = stations.filter(s => s.status === 'offline').length;
  const alertCnt = stations.filter(s => {
    const wl = s.waterLevel || 0;
    return s.alertLevel1 && wl >= s.alertLevel1;
  }).length;
  const totalSensors = stations.reduce((s,t) => s + (t.sensorCount || (t.devices?.length || 0)), 0);
  const sH = stations.find(s => s.river==='Sông Hồng' && s.waterLevel > 0);

  return `
  <div class="page-header">
    <div class="page-title">
      <h1>Giám sát IoT & Cảnh báo sớm</h1>
      <p>Theo dõi realtime từ <strong>${stations.length}</strong> trạm đo · <strong>${totalSensors}</strong> cảm biến · Cập nhật tự động mỗi 5 phút</p>
    </div>
    <div class="page-actions">
      <div style="display:flex;align-items:center;gap:8px;padding:6px 14px;border-radius:20px;background:rgba(41,132,238,.1);border:1px solid rgba(41,132,238,.25)">
        <div class="pulse-dot green"></div>
        <span style="color:var(--success);font-size:12px;font-weight:600">IoT: ${online} trạm online</span>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="exportIotExcel()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/></svg> Xuất Excel
      </button>
      <button class="btn btn-ghost btn-sm" onclick="refreshIotData()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
        Làm mới
      </button>
    </div>
  </div>

  <!-- KPI Cards -->
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:20px">
    <div style="background:var(--bg-card);border:1px solid rgba(0,200,255,.2);border-radius:12px;padding:16px;text-align:center">
      <div style="font-size:10px;color:var(--muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em">MN Sông Hồng</div>
      <div style="font-size:28px;font-weight:800;color:var(--primary)">${sH?.waterLevel?.toFixed(2) || '4.82'}<span style="font-size:13px;color:var(--muted)">m</span></div>
      <div style="font-size:10px;margin-top:6px;color:var(--success)">▲ Dưới BĐ1</div>
    </div>
    <div style="background:var(--bg-card);border:1px solid rgba(255,202,40,.2);border-radius:12px;padding:16px;text-align:center">
      <div style="font-size:10px;color:var(--muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em">Mưa cao nhất/24h</div>
      <div style="font-size:28px;font-weight:800;color:var(--warning)">${maxRain.toFixed(0)}<span style="font-size:13px;color:var(--muted)">mm</span></div>
      <div style="font-size:10px;margin-top:6px;color:var(--muted)">${maxRainSt?.name?.replace('Trạm ','') || '—'}</div>
    </div>
    <div style="background:var(--bg-card);border:1px solid rgba(41,132,238,.2);border-radius:12px;padding:16px;text-align:center">
      <div style="font-size:10px;color:var(--muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em">Trạm Online</div>
      <div style="font-size:28px;font-weight:800;color:var(--success)">${online}<span style="font-size:13px;color:var(--muted)">/${stations.length}</span></div>
      <div style="font-size:10px;margin-top:6px;color:var(--muted)">${Math.round(online/stations.length*100)}% hoạt động</div>
    </div>
    <div style="background:var(--bg-card);border:1px solid rgba(255,202,40,.2);border-radius:12px;padding:16px;text-align:center">
      <div style="font-size:10px;color:var(--muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em">Cảnh báo mức nước</div>
      <div style="font-size:28px;font-weight:800;color:var(--warning)">${warning + alertCnt}</div>
      <div style="font-size:10px;margin-top:6px;color:var(--warning)">${warning} cảnh báo · ${alertCnt} vượt BĐ1</div>
    </div>
    <div style="background:var(--bg-card);border:1px solid rgba(255,23,68,.2);border-radius:12px;padding:16px;text-align:center">
      <div style="font-size:10px;color:var(--muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em">Trạm Offline/Lỗi</div>
      <div style="font-size:28px;font-weight:800;color:var(--danger)">${offline}</div>
      <div style="font-size:10px;margin-top:6px;color:var(--danger)">${offline > 0 ? 'Cần kiểm tra thiết bị!' : 'Không có lỗi'}</div>
    </div>
  </div>

  <!-- Tabs -->
  <div class="tabs" style="margin-bottom:20px">
    <button class="tab-btn ${iotTab==='overview'?'active':''}" onclick="switchIotTab('overview')">Tổng quan & Biểu đồ</button>
    <button class="tab-btn ${iotTab==='table'?'active':''}" onclick="switchIotTab('table')">Bảng dữ liệu (${stations.length} trạm)</button>
    <button class="tab-btn ${iotTab==='alerts'?'active':''}" onclick="switchIotTab('alerts')">Cảnh báo & Lịch sử</button>
  </div>

  <div id="iotTabContent">${_renderIotTab(stations)}</div>`;
}

function _renderIotTab(stations) {
  if (!stations) stations = window.DATA?.stations || [];

  if (iotTab === 'overview') {
    const hydro = stations.filter(s => s.type === 'hydro');
    const rain  = stations.filter(s => s.type === 'rain');
    const rsv   = stations.filter(s => s.type === 'reservoir');

    const stationCards = stations.map(s => {
      const wl = s.waterLevel || 0;
      const alertLvl = s.alertLevel2 && wl >= s.alertLevel2 ? 'critical'
                     : s.alertLevel1 && wl >= s.alertLevel1 ? 'warning' : 'ok';
      const alertColor = { ok:'var(--success)', warning:'var(--warning)', critical:'var(--danger)' }[alertLvl];
      const borderColor = { ok:'rgba(41,132,238,.25)', warning:'rgba(255,202,40,.4)', critical:'rgba(255,23,68,.5)' }[alertLvl];
      const stColor = { online:'var(--success)', warning:'var(--warning)', offline:'var(--danger)' }[s.status] || 'var(--muted)';
      const typeIcon = { hydro:'~', rain:'≈', reservoir:'▣' }[s.type] || '◈';
      const trend = s.trend || '—';
      const tUp = trend.startsWith('+');
      const tDn = trend.startsWith('-');
      const pct = s.alertLevel2 && wl > 0 ? Math.min(100, Math.round(wl / s.alertLevel2 * 100)) : 0;
      const barColor = pct >= 90 ? 'var(--danger)' : pct >= 70 ? 'var(--warning)' : 'var(--primary)';
      return `
      <div style="background:var(--bg-card);border:1px solid ${borderColor};border-radius:12px;padding:14px;cursor:pointer;transition:transform .18s,box-shadow .18s" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(0,0,0,.3)'" onmouseout="this.style.transform='';this.style.boxShadow=''" onclick="viewIotStationDetail('${s.id}')">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
          <div style="display:flex;align-items:center;gap:7px">
            <span style="font-size:16px">${typeIcon}</span>
            <div>
              <div style="font-size:12px;font-weight:700;line-height:1.2">${s.name.replace('Trạm ','')}</div>
              <div style="font-size:10px;color:var(--muted)">${s.river || s.factory}</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:4px">
            <div style="width:7px;height:7px;border-radius:50%;background:${stColor};${s.status==='online'?'animation:pulse-dot 2s infinite':''}"></div>
            <span style="font-size:10px;color:${stColor};font-weight:600">${{online:'Online',warning:'CB',offline:'Offline'}[s.status]||s.status}</span>
          </div>
        </div>
        ${wl > 0 ? `
        <div style="margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
            <span style="font-size:22px;font-weight:800;color:${alertColor}">${wl.toFixed(2)}</span>
            <span style="font-size:10px;color:var(--muted)">m</span>
          </div>
          <div style="height:4px;background:rgba(255,255,255,.08);border-radius:2px">
            <div style="height:100%;width:${pct}%;background:${barColor};border-radius:2px;transition:width .5s"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--muted);margin-top:2px">
            <span>BĐ1: ${s.alertLevel1||'—'}m</span><span>${pct}% BĐ2</span>
          </div>
        </div>`: `
        <div style="font-size:18px;font-weight:700;color:var(--primary);margin-bottom:8px">${s.rainfall||0}<span style="font-size:11px;color:var(--muted)"> mm</span></div>`}
        <div style="display:flex;justify-content:space-between;font-size:10px;border-top:1px solid var(--border);padding-top:8px;margin-top:4px">
          <span style="color:var(--muted)">Mưa: <b style="color:${(s.rainfall||0)>=50?'var(--warning)':'var(--text)'}">${s.rainfall||0}mm</b></span>
          <span style="color:${tUp?'var(--danger)':tDn?'var(--primary)':'var(--muted)'}">
            ${tUp?'↑':tDn?'↓':'→'} ${trend} m/h
          </span>
        </div>
      </div>`;
    }).join('');

    return `
    <!-- Station Cards Grid -->
    <div style="margin-bottom:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="font-size:13px;font-weight:700">
          📡 Tất cả trạm đo
          <span style="font-size:11px;font-weight:400;color:var(--muted);margin-left:8px">${hydro.length} thủy văn · ${rain.length} đo mưa · ${rsv.length} hồ chứa</span>
        </div>
        <div style="display:flex;gap:10px;font-size:11px">
          <span style="color:var(--success)">● ${stations.filter(s=>s.status==='online').length} Online</span>
          <span style="color:var(--warning)">● ${stations.filter(s=>s.status==='warning').length} Cảnh báo</span>
          <span style="color:var(--danger)">● ${stations.filter(s=>s.status==='offline').length} Offline</span>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">
        ${stationCards}
      </div>
    </div>
    <!-- Charts -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
      <div class="card">
        <div class="card-header"><span class="card-title">Lượng mưa theo trạm (mm/24h)</span></div>
        <div style="padding:16px"><canvas id="iotRainChart" height="220"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Mực nước so báo động (Sông Hồng & Sông Đáy)</span></div>
        <div style="padding:16px"><canvas id="iotLevelChart" height="220"></canvas></div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div class="card">
        <div class="card-header"><span class="card-title">Trạng thái hồ chứa (%)</span></div>
        <div style="padding:16px"><canvas id="iotReservoirChart" height="200"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Phân loại trạm theo trạng thái</span></div>
        <div style="padding:16px"><canvas id="iotStatusChart" height="200"></canvas></div>
      </div>
    </div>`;
  }


  if (iotTab === 'table') {
    return `
    <div class="card" style="padding:0">
      <div class="card-header">
        <span class="card-title">Dữ liệu trạm thủy văn — Thời gian thực</span>
        <span style="font-size:11px;color:var(--muted)" id="iotLastUpdate">Cập nhật: ${new Date().toLocaleTimeString('vi-VN')}</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>Mã</th><th>Tên Trạm</th><th>Sông/Hồ</th><th>Địa bàn</th><th>Loại</th>
            <th>MN hiện tại (m)</th><th>Mưa/24h (mm)</th><th>Xu hướng</th>
            <th>BĐ1 / BĐ2</th><th>Mức độ</th><th>Trạng thái</th><th></th>
          </tr></thead>
          <tbody>
            ${stations.map(s => {
              const wl = s.waterLevel || 0;
              const alert = s.alertLevel2 && wl >= s.alertLevel2 ? 'critical' :
                            s.alertLevel1 && wl >= s.alertLevel1 ? 'warning' : 'ok';
              const alertLabel = { ok:'Bình thường', warning:'CẢnh báo BĐ1', critical:'Vượt BĐ2 !' }[alert];
              const alertColor = { ok:'var(--success)', warning:'var(--warning)', critical:'var(--danger)' }[alert];
              const typeLabel = { hydro:'Thủy văn', rain:'Đo mưa', reservoir:'Hồ chứa' }[s.type] || s.type;
              const trend = s.trend || '—';
              const trendColor = trend.startsWith('+') ? 'var(--danger)' : trend.startsWith('-') ? 'var(--primary)' : 'var(--muted)';
              return `<tr style="${alert==='critical'?'background:rgba(255,23,68,.04)':alert==='warning'?'background:rgba(255,202,40,.03)':''}">
                <td class="mono" style="color:var(--primary);font-size:11px">${s.id}</td>
                <td style="font-weight:600">${s.name}</td>
                <td style="font-size:12px;color:var(--muted)">${s.river||'—'}</td>
                <td style="font-size:12px;color:var(--muted)">${s.factory}</td>
                <td><span class="badge badge-gray" style="font-size:9px">${typeLabel}</span></td>
                <td style="font-weight:700;color:${alertColor};font-size:13px">${wl > 0 ? wl.toFixed(2) : s.type==='rain'?'—':'—'}</td>
                <td style="color:${(s.rainfall||0)>=50?'var(--warning)':'var(--muted)'};font-weight:${(s.rainfall||0)>=50?'700':'400'}">${s.rainfall || 0}</td>
                <td style="color:${trendColor};font-size:12px;font-weight:600">${trend} m/h</td>
                <td class="mono" style="font-size:11px;color:var(--muted)">${s.alertLevel1||'—'} / ${s.alertLevel2||'—'}</td>
                <td><span style="font-size:11px;color:${alertColor};font-weight:700">${alertLabel}</span></td>
                <td>${statusBadge(s.status)}</td>
                <td><button class="btn btn-ghost btn-xs" onclick="viewIotStationDetail('${s.id}')">Chi tiết</button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  if (iotTab === 'alerts') {
    const alarms = (window.DATA?.alarms || []);
    const unacked = alarms.filter(a => !a.ack);
    return `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:16px">
      ${[
        { label:'Cảnh báo chưa xử lý', val:unacked.length, color:'var(--danger)' },
        { label:'Đã xác nhận', val:alarms.filter(a=>a.ack).length, color:'var(--success)' },
        { label:'Tổng cảnh báo hôm nay', val:alarms.length, color:'var(--primary)' },
      ].map(k=>`<div class="card kpi-card"><div class="kpi-label">${k.label}</div><div class="kpi-value" style="color:${k.color}">${k.val}</div></div>`).join('')}
    </div>
    <div class="card" style="padding:0;margin-bottom:20px">
      <div class="card-header"><span class="card-title">Danh sách cảnh báo hiện tại</span></div>
      <div style="display:flex;flex-direction:column;gap:0">
        ${alarms.map(a => `
        <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--border);background:${a.ack?'transparent':'rgba(255,23,68,.02)'}">
          <div style="width:10px;height:10px;border-radius:50%;background:${{critical:'var(--danger)',high:'var(--danger)',warning:'var(--warning)'}[a.severity]||'var(--muted)'};flex-shrink:0;${!a.ack?'animation:pulse-dot 1.5s infinite':''}"></div>
          <div style="flex:1">
            <div style="font-size:13px;${a.ack?'opacity:.55':''}">${a.msg}</div>
            <div style="font-size:11px;color:var(--muted);margin-top:3px">${a.time} · Nguồn: ${a.source}</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            ${statusBadge(a.severity)}
            ${a.ack
              ? `<span class="badge badge-green" style="font-size:10px">✓ Đã xác nhận</span>`
              : `<button class="btn btn-sm" style="font-size:10px;background:rgba(41,132,238,.1);color:var(--success);border:1px solid rgba(41,132,238,.25)" onclick="ackIotAlert('${a.id}')">Xác nhận</button>`
            }
          </div>
        </div>`).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">Lịch sử mực nước 24h — Sông Hồng (Hà Nội)</span></div>
      <div style="padding:16px"><canvas id="iotHistory24h" height="200"></canvas></div>
    </div>`;
  }
  return '';
}

window.afterRender_iotMonitor = function() { setTimeout(_renderIotCharts, 80); };

function switchIotTab(tab) {
  iotTab = tab;
  _destroyIotCharts();
  const stations = window.DATA?.stations || [];
  const el = document.getElementById('iotTabContent');
  if (el) { el.innerHTML = _renderIotTab(stations); setTimeout(_renderIotCharts, 80); }
  document.querySelectorAll('.tab-btn').forEach(b => {
    const map = { overview:'Tổng quan', table:'Bảng dữ liệu', alerts:'Cảnh báo' };
    b.classList.toggle('active', b.textContent.trim().startsWith(map[tab]||'__'));
  });
}

function _renderIotCharts() {
  if (typeof Chart === 'undefined') return;
  const stations = window.DATA?.stations || [];
  const palette = getChartPalette();
  const DEF = { color: palette.textMuted, grid: hexToRgba(palette.cyan, .06), font:"'Inter',sans-serif" };
  const ax = () => ({ ticks:{color:DEF.color,font:{family:DEF.font,size:10}}, grid:{color:DEF.grid} });
  const mk = (id, cfg) => {
    const el = document.getElementById(id); if (!el) return;
    try { if(_iotCharts[id]) _iotCharts[id].destroy(); _iotCharts[id] = new Chart(el.getContext('2d'), cfg); } catch(e){}
  };

  if (iotTab === 'overview') {
    // Chart 1: Rainfall
    const rainSt = stations.filter(s => (s.rainfall||0) > 0).slice(0, 12);
    mk('iotRainChart', { type:'bar', data:{
      labels: rainSt.map(s => s.name.replace('Trạm ','').substring(0,14)),
      datasets:[{
        label:'Mưa (mm/24h)', data:rainSt.map(s=>s.rainfall||0),
        backgroundColor:rainSt.map(s=>(s.rainfall||0)>=50?hexToRgba(palette.warning,.65):hexToRgba(palette.cyan,.5)),
        borderColor:rainSt.map(s=>(s.rainfall||0)>=50?palette.warning:palette.cyan), borderWidth:1.5, borderRadius:5,
      }],
    }, options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false},
      annotation:{annotations:{ line1:{ type:'line', yMin:50, yMax:50, borderColor:hexToRgba(palette.warning,.5), borderWidth:1.5, borderDash:[5,5] } }}},
      scales:{ x:{...ax(),ticks:{...ax().ticks,maxRotation:40}}, y:{...ax(),beginAtZero:true} } } });

    // Chart 2: Water level vs alert thresholds (hydro only)
    const hydroSt = stations.filter(s => s.type==='hydro' && (s.waterLevel||0)>0).slice(0,8);
    mk('iotLevelChart', { type:'bar', data:{
      labels: hydroSt.map(s => s.name.replace('Trạm ','').substring(0,12)),
      datasets:[
        { label:'MN hiện tại (m)', data:hydroSt.map(s=>s.waterLevel),
          backgroundColor:hydroSt.map(s=>s.waterLevel>=(s.alertLevel2||999)?hexToRgba(palette.danger,.6):s.waterLevel>=(s.alertLevel1||999)?hexToRgba(palette.warning,.6):hexToRgba(palette.success,.5)),
          borderWidth:1.5, borderRadius:4 },
        { label:'Báo động 1', data:hydroSt.map(s=>s.alertLevel1), type:'line', borderColor:hexToRgba(palette.warning,.7), borderWidth:1.5, borderDash:[5,4], pointRadius:0, fill:false },
        { label:'Báo động 2', data:hydroSt.map(s=>s.alertLevel2), type:'line', borderColor:hexToRgba(palette.danger,.7), borderWidth:1.5, borderDash:[5,4], pointRadius:0, fill:false },
      ],
    }, options:{ responsive:true, maintainAspectRatio:false,
      plugins:{legend:{labels:{color:DEF.color,font:{family:DEF.font,size:10}}}},
      scales:{ x:{...ax(),ticks:{...ax().ticks,maxRotation:40}}, y:{...ax(),beginAtZero:true} } } });

    // Chart 3: Reservoir levels
    const RESERVOIR_DATA = window.RESERVOIR_DATA || [];
    if (RESERVOIR_DATA.length > 0) {
      const rPct = RESERVOIR_DATA.map(r => Math.round((r.currentLevel - r.deadLevel) / (r.designLevel - r.deadLevel) * 100));
      mk('iotReservoirChart', { type:'bar', data:{
        labels: RESERVOIR_DATA.map(r => r.name.replace('Hồ ','')),
        datasets:[{
          label:'Dung tích hiện tại (%)',
          data: rPct,
          backgroundColor:rPct.map(p=>p>=90?hexToRgba(palette.danger,.6):p>=70?hexToRgba(palette.warning,.5):hexToRgba(palette.cyan,.5)),
          borderWidth:1.5, borderRadius:4,
        }],
      }, options:{ responsive:true, maintainAspectRatio:false,
        plugins:{legend:{display:false}},
        scales:{ x:{...ax()}, y:{...ax(),beginAtZero:true,max:120, ticks:{...ax().ticks,callback:v=>v+'%'}} } } });
    } else {
      const el = document.getElementById('iotReservoirChart');
      if (el) el.closest('.card').querySelector('.card-header').insertAdjacentHTML('afterend','<div style="padding:20px;color:var(--muted);font-size:13px">Không có dữ liệu hồ chứa.</div>');
    }

    // Chart 4: Status doughnut
    const online = stations.filter(s=>s.status==='online').length;
    const warn = stations.filter(s=>s.status==='warning').length;
    const off = stations.filter(s=>s.status==='offline').length;
    mk('iotStatusChart', { type:'doughnut', data:{
      labels:['Online','Cảnh báo','Offline/Lỗi'],
      datasets:[{ data:[online,warn,off], backgroundColor:[hexToRgba(palette.success,.7),hexToRgba(palette.warning,.7),hexToRgba(palette.danger,.7)], borderWidth:0, hoverOffset:8 }],
    }, options:{ responsive:true, maintainAspectRatio:false,
      plugins:{legend:{position:'bottom',labels:{color:DEF.color,font:{family:DEF.font,size:11},padding:12}}},
      cutout:'60%' } });
  }

  if (iotTab === 'alerts') {
    // 24h history: simulated sine-wave around current level
    const baseLevel = 4.82;
    const hours = Array.from({length:25},(_,i)=>i+'h');
    const levels = hours.map((_,i) => +(baseLevel - 0.3*Math.sin(i/4) + 0.02*i).toFixed(2));
    mk('iotHistory24h', { type:'line', data:{
      labels: hours,
      datasets:[{
        label:'Mực nước sông Hồng (m)', data:levels,
        borderColor:palette.cyan, backgroundColor:hexToRgba(palette.cyan,.08), borderWidth:2,
        pointRadius:0, pointHoverRadius:4, fill:true, tension:0.4,
      },{
        label:'BĐ1 (9.5m)', data:Array(25).fill(9.5),
        borderColor:hexToRgba(palette.warning,.5), borderWidth:1.5, borderDash:[5,4], pointRadius:0, fill:false,
      }],
    }, options:{ responsive:true, maintainAspectRatio:false,
      plugins:{legend:{labels:{color:DEF.color,font:{family:DEF.font,size:10}}}},
      scales:{x:{...ax()},y:{...ax(),min:4,max:11}} } });
  }
}

window.viewIotStationDetail = function(id) {
  const s = (window.DATA?.stations||[]).find(x=>x.id===id); if (!s) return;
  const wl = s.waterLevel||0;
  const alert = s.alertLevel2 && wl>=s.alertLevel2?'critical':s.alertLevel1 && wl>=s.alertLevel1?'warning':'ok';
  const pct = s.alertLevel2 ? Math.round(wl/s.alertLevel2*100) : 0;
  openModal(`
  <div class="modal-header"><span class="modal-title">${s.id} — ${s.name}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px">
      ${[
        {l:'Sông/Hồ', v:s.river||'—'}, {l:'Địa bàn', v:s.factory}, {l:'Loại trạm', v:{hydro:'Thủy văn',rain:'Đo mưa',reservoir:'Hồ chứa'}[s.type]||s.type},
        {l:'Mực nước', v:wl>0?wl.toFixed(2)+'m':'—'}, {l:'Lượng mưa/24h', v:(s.rainfall||0)+'mm'}, {l:'Xu hướng', v:(s.trend||'—')+' m/h'},
        {l:'Báo động 1', v:(s.alertLevel1||'—')+'m'}, {l:'Báo động 2', v:(s.alertLevel2||'—')+'m'}, {l:'Bảo trì cuối', v:s.lastMaintain||'—'},
      ].map(f=>`<div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px;padding:10px"><div style="font-size:10px;color:var(--muted)">${f.l}</div><div style="font-size:13px;font-weight:600;margin-top:3px">${f.v}</div></div>`).join('')}
    </div>
    ${wl > 0 ? `<div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px">
        <span>Mức độ báo động</span><span style="color:${{ok:'var(--success)',warning:'var(--warning)',critical:'var(--danger)'}[alert]}">${pct}% đến BĐ2</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${Math.min(pct,100)}%;background:${{ok:'var(--success)',warning:'var(--warning)',critical:'var(--danger)'}[alert]}"></div></div>
    </div>`:''}
    <div style="font-size:12px;font-weight:700;margin-bottom:8px">Thiết bị (${s.devices?.length||0})</div>
    <div style="display:flex;flex-direction:column;gap:6px">
      ${(s.devices||[]).map(d=>`
      <div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px">
        <div style="width:8px;height:8px;border-radius:50%;background:${{running:'var(--success)',fault:'var(--danger)',open:'var(--warning)',partial:'var(--orange)'}[d.status]||'var(--muted)'}"></div>
        <span style="flex:1;font-size:12px">${d.name}</span>
        <span class="badge badge-gray" style="font-size:9px">${d.type}</span>
        ${statusBadge(d.status)}
      </div>`).join('')}
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('📡 Đang đồng bộ dữ liệu trạm ${s.id}...')">Đồng bộ dữ liệu</button>
  </div>`);
};

window.ackIotAlert = function(id) {
  const a = (window.DATA?.alarms||[]).find(x=>x.id===id);
  if (a) { a.ack = true; const el = document.getElementById('iotTabContent'); if(el) el.innerHTML = _renderIotTab(); setTimeout(_renderIotCharts,80); showToast(`✅ Đã xác nhận cảnh báo ${id}!`); }
};

window.refreshIotData = function() {
  // Simulate small level changes
  (window.DATA?.stations||[]).forEach(s => {
    if (s.waterLevel > 0) s.waterLevel = +(s.waterLevel + (Math.random()*0.1-0.04)).toFixed(2);
    if (s.rainfall >= 0) s.rainfall = +(s.rainfall + (Math.random()*2-0.5)).toFixed(1);
  });
  navigate('iotMonitor'); showToast('✅ Đã làm mới dữ liệu IoT thời gian thực!');
};

window.exportIotExcel = function() {
  showToast('📊 Đang xuất dữ liệu trạm IoT...');
  setTimeout(() => {
    const stations = window.DATA?.stations || [];
    window.HADIWA_EXPORT?.csv(`IoT_TramThuyVan_${new Date().toISOString().slice(0,10)}.csv`, [
      ['DỮ LIỆU TRẠM ĐO IOT — Hà Nội — ' + new Date().toLocaleString('vi-VN')],
      [],
      ['Mã','Tên trạm','Sông/Hồ','Địa bàn','Loại','Mực nước (m)','Mưa/24h (mm)','BĐ1 (m)','BĐ2 (m)','Xu hướng','Trạng thái','Bảo trì cuối'],
      ...stations.map(s=>[ s.id, s.name, s.river||'—', s.factory, s.type, s.waterLevel||'—', s.rainfall||0, s.alertLevel1||'—', s.alertLevel2||'—', s.trend||'—', s.status, s.lastMaintain||'—' ]),
    ]);
  }, 400);
};
