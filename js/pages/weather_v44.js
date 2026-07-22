// ── HADIWA IOC — Weather Intelligence v4.4 ─────────────────────────
// Supplements weatherBulletin.js with: 7-day forecast, hourly rain
// bars, district flood-risk matrix, and forecast API mock.
// Loaded AFTER weatherBulletin.js

// ── Data ───────────────────────────────────────────────────────────
const WX_7DAY = [
  { day:'T2 13/3',  icon:'rain',    high:28, low:22, rain:45, wind:25, desc:'Mưa vừa đến mưa to' },
  { day:'T3 14/3',  icon:'storm',   high:26, low:21, rain:80, wind:35, desc:'Mưa to, giông mạnh' },
  { day:'T4 15/3',  icon:'storm',   high:24, low:20, rain:95, wind:40, desc:'Bão gần bờ, nguy hiểm' },
  { day:'T5 16/3',  icon:'rain',    high:23, low:19, rain:60, wind:30, desc:'Mưa to rải rác' },
  { day:'T6 17/3',  icon:'cloudy',  high:27, low:21, rain:20, wind:18, desc:'Nhiều mây, mưa nhỏ' },
  { day:'T7 18/3',  icon:'partly',  high:30, low:23, rain:5,  wind:12, desc:'Nắng gián đoạn' },
  { day:'CN 19/3',  icon:'sunny',   high:33, low:24, rain:0,  wind:10, desc:'Nắng đẹp, ít mây' },
];

const WX_HOURLY_RAIN = [0,0,2,5,18,32,45,38,22,15,8,3,0,0,12,28,40,35,20,8,2,0,0,0];

const WX_DISTRICT_RISK = [
  { name:'H. Chương Mỹ',   rainfall:120, riverLevel:6.2, tlevel:'Vượt MD2', floodArea:2800, risk:95, riskLabel:'Cực cao',   color:'#dc2626' },
  { name:'H. Mỹ Đức',      rainfall:98,  riverLevel:5.4, tlevel:'Vượt MD1', floodArea:1600, risk:82, riskLabel:'Rất cao',   color:'#ea580c' },
  { name:'H. Thanh Oai',   rainfall:88,  riverLevel:4.8, tlevel:'Vượt MD1', floodArea:920,  risk:74, riskLabel:'Cao',       color:'#ca8a04' },
  { name:'H. Ba Vì',       rainfall:75,  riverLevel:4.1, tlevel:'Cận MD1',  floodArea:540,  risk:58, riskLabel:'Trung bình',color:'#d97706' },
  { name:'H. Phúc Thọ',    rainfall:62,  riverLevel:3.6, tlevel:'Bình thường', floodArea:120, risk:35, riskLabel:'Thấp',    color:'#16a34a' },
  { name:'H. Đan Phượng',  rainfall:55,  riverLevel:3.2, tlevel:'Bình thường', floodArea:0,   risk:22, riskLabel:'Thấp',    color:'#16a34a' },
  { name:'H. Đông Anh',    rainfall:48,  riverLevel:3.0, tlevel:'Bình thường', floodArea:80,  risk:30, riskLabel:'Thấp',    color:'#16a34a' },
  { name:'Q. Hà Đông',     rainfall:40,  riverLevel:2.8, tlevel:'Bình thường', floodArea:0,   risk:18, riskLabel:'Rất thấp',color:'#0891b2' },
];

// ── Forecast Widget (injected into weatherBulletin page extra section) ──
function renderWeatherForecastWidget() {
  const iconMap = {
    sunny:  `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    partly: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="1.8"><circle cx="10" cy="10" r="4"/><path d="M2 20a5 5 0 1 1 7.42-6.72A5 5 0 0 1 17 20z" stroke="#94a3b8"/></svg>`,
    cloudy: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.8"><path d="M3 12a5 5 0 1 1 8.34-3.72A5 5 0 0 1 21 14a5 5 0 0 1-5 5H6a5 5 0 0 1-3-9"/></svg>`,
    rain:   `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="1.8"><path d="M3 12a5 5 0 1 1 8.34-3.72A5 5 0 0 1 21 14a5 5 0 0 1-5 5H6a5 5 0 0 1-3-9"/><line x1="8" y1="19" x2="8" y2="21"/><line x1="12" y1="19" x2="12" y2="21"/><line x1="16" y1="19" x2="16" y2="21"/></svg>`,
    storm:  `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.8"><path d="M3 12a5 5 0 1 1 8.34-3.72A5 5 0 0 1 21 14a5 5 0 0 1-5 5H6a5 5 0 0 1-3-9"/><polyline points="13 11 9 17 15 17 11 23" stroke="#fbbf24"/></svg>`,
  };

  // Hourly rain chart bars
  const maxRain = Math.max(...WX_HOURLY_RAIN, 1);
  const hourlyBars = WX_HOURLY_RAIN.map((r, h) => {
    const pct = Math.round((r / maxRain) * 100);
    const isNow = h === 13; // current hour demo
    return `
    <div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1">
      <div style="width:100%;height:80px;display:flex;align-items:flex-end;justify-content:center">
        <div style="width:${h%2===0?'7px':'5px'};background:${r>30?'#ef4444':r>10?'#f59e0b':'#38bdf8'};border-radius:2px 2px 0 0;height:${pct}%;transition:height .3s;${isNow?'outline:1.5px solid #fff;':''}"></div>
      </div>
      ${h%3===0?`<div style="font-size:9px;color:rgba(255,255,255,.3);font-family:monospace">${String(h).padStart(2,'0')}h</div>`:'<div style="font-size:9px;color:transparent">x</div>'}
    </div>`;
  }).join('');

  return `
<div style="margin-top:20px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
  <!-- 7-day forecast -->
  <div class="card" style="padding:14px">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:rgba(255,255,255,.4);letter-spacing:.07em;margin-bottom:12px">Dự báo 7 ngày</div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px">
      ${WX_7DAY.map((d, i) => {
        const isToday = i === 0;
        return `
      <div style="text-align:center;padding:10px 4px;border-radius:10px;background:${isToday?'rgba(0,200,255,.1)':'rgba(255,255,255,.03)'};border:1px solid ${isToday?'rgba(0,200,255,.25)':'rgba(255,255,255,.06)'}">
        <div style="font-size:9px;font-weight:700;color:${isToday?'#38bdf8':'rgba(255,255,255,.4)'};margin-bottom:6px">${d.day}</div>
        <div style="margin:0 auto 6px;width:32px;height:32px">${iconMap[d.icon]||iconMap.cloudy}</div>
        <div style="font-size:11px;font-weight:800;color:#fff">${d.high}°</div>
        <div style="font-size:10px;color:rgba(255,255,255,.35)">${d.low}°</div>
        <div style="margin-top:5px;font-size:9px;color:${d.rain>50?'#ef4444':d.rain>20?'#f59e0b':'#38bdf8'};font-weight:700">${d.rain}mm</div>
        ${d.rain > 50 ? `<div style="margin-top:3px;width:6px;height:6px;border-radius:50%;background:#ef4444;animation:pulseAnim 1.5s infinite;margin:4px auto 0"></div>` : ''}
      </div>`;
      }).join('')}
    </div>
  </div>

  <!-- Hourly rainfall 24h -->
  <div class="card" style="padding:14px">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:rgba(255,255,255,.4);letter-spacing:.07em;margin-bottom:4px">Lượng mưa theo giờ (hôm nay)</div>
    <div style="font-size:11px;color:rgba(255,255,255,.4);margin-bottom:8px">Tổng ngày: <b style="color:#38bdf8">${WX_HOURLY_RAIN.reduce((a,b)=>a+b,0)}mm</b> · Đỉnh: <b style="color:#ef4444">${Math.max(...WX_HOURLY_RAIN)}mm lúc 16h</b></div>
    <div style="display:flex;gap:1px;height:100px;align-items:flex-end">
      ${hourlyBars}
    </div>
    <div style="margin-top:10px;display:flex;gap:12px;font-size:10px">
      <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:4px;background:#38bdf8;border-radius:2px;display:inline-block"></span>Ít (0–10mm)</span>
      <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:4px;background:#f59e0b;border-radius:2px;display:inline-block"></span>Vừa (10–30mm)</span>
      <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:4px;background:#ef4444;border-radius:2px;display:inline-block"></span>To (>30mm)</span>
    </div>
  </div>
</div>

<!-- District Flood Risk Matrix -->
<div class="card" style="margin-top:16px;padding:0">
  <div class="card-header">
    <span class="card-title">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" style="vertical-align:middle;margin-right:6px"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      Ma trận nguy cơ ngập lụt theo địa bàn
    </span>
    <span style="font-size:11px;color:rgba(255,255,255,.4)">Cập nhật: ${new Date().toLocaleString('vi-VN')}</span>
  </div>
  <div class="table-wrap">
    <table style="width:100%;border-collapse:collapse">
      <thead><tr>
        <th style="font-size:10px;font-weight:700;color:rgba(255,255,255,.35);padding:8px 14px;text-align:left;border-bottom:1px solid rgba(255,255,255,.07)">Địa bàn</th>
        <th style="font-size:10px;font-weight:700;color:rgba(255,255,255,.35);padding:8px 14px;text-align:right;border-bottom:1px solid rgba(255,255,255,.07)">Lượng mưa (mm)</th>
        <th style="font-size:10px;font-weight:700;color:rgba(255,255,255,.35);padding:8px 14px;text-align:right;border-bottom:1px solid rgba(255,255,255,.07)">Mực nước (m)</th>
        <th style="font-size:10px;font-weight:700;color:rgba(255,255,255,.35);padding:8px 14px;text-align:left;border-bottom:1px solid rgba(255,255,255,.07)">Tình trạng sông</th>
        <th style="font-size:10px;font-weight:700;color:rgba(255,255,255,.35);padding:8px 14px;text-align:right;border-bottom:1px solid rgba(255,255,255,.07)">Diện tích ngập dự báo</th>
        <th style="font-size:10px;font-weight:700;color:rgba(255,255,255,.35);padding:8px 14px;border-bottom:1px solid rgba(255,255,255,.07)">Chỉ số nguy cơ</th>
      </tr></thead>
      <tbody>
        ${WX_DISTRICT_RISK.map(d => `
        <tr style="transition:background .15s" onmouseover="this.style.background='rgba(255,255,255,.025)'" onmouseout="this.style.background=''">
          <td style="padding:10px 14px;font-weight:600;font-size:12px">${d.name}</td>
          <td style="padding:10px 14px;text-align:right;font-family:monospace;font-size:12px;color:${d.rainfall>80?'#f87171':d.rainfall>50?'#fbbf24':'#34d399'}">${d.rainfall}</td>
          <td style="padding:10px 14px;text-align:right;font-family:monospace;font-size:12px;color:${d.riverLevel>5?'#f87171':d.riverLevel>4?'#fbbf24':'rgba(255,255,255,.6)'}">${d.riverLevel}</td>
          <td style="padding:10px 14px;font-size:11px;color:${d.tlevel.includes('Vượt')?'#fbbf24':d.tlevel.includes('Cận')?'#fed7aa':'rgba(255,255,255,.4)'}">${d.tlevel}</td>
          <td style="padding:10px 14px;text-align:right;font-size:11px;color:${d.floodArea>500?'#f87171':'rgba(255,255,255,.5)'}">${d.floodArea > 0 ? d.floodArea.toLocaleString('vi-VN') + ' ha' : '—'}</td>
          <td style="padding:10px 14px">
            <div style="display:flex;align-items:center;gap:8px">
              <div style="flex:1;height:5px;background:rgba(255,255,255,.07);border-radius:3px">
                <div style="height:100%;width:${d.risk}%;background:${d.color};border-radius:3px"></div>
              </div>
              <span style="font-size:11px;font-weight:800;color:${d.color};min-width:52px;text-align:right">${d.risk}% ${d.riskLabel}</span>
            </div>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>`;
}

// ── Inject forecast widget into weather page afterRender ───────────
window.afterRender_weatherBulletin = function () {
  // Look for an injection point container
  const container = document.getElementById('wbForecastContainer');
  if (container) {
    container.innerHTML = renderWeatherForecastWidget();
    return;
  }
  // Append to last card in the bulletin page
  const page = document.querySelector('.page-content') || document.querySelector('[data-page="weatherBulletin"]');
  if (page) {
    const wrapper = document.createElement('div');
    wrapper.id = 'wbForecastWidget';
    wrapper.innerHTML = renderWeatherForecastWidget();
    page.appendChild(wrapper);
  }
};

// Allow direct render for embedding in other views
window.renderWeatherForecastWidget = renderWeatherForecastWidget;
