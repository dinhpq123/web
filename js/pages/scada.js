// ── SCADA MONITORING PAGE ─────────────────────────────────────────
let scadaLiveTimer = null;
let activeStationTab = 'info';

function renderScada() {
  return `
  <div class="page-header">
    <div class="page-title"><h1>Giám sát SCADA</h1><p>Dữ liệu thời gian thực từ các trạm đo</p></div>
    <div class="page-actions">
      <div style="display:flex;align-items:center;gap:8px;padding:5px 12px;background:rgba(0,200,255,.06);border:1px solid rgba(0,200,255,.15);border-radius:8px">
        <div class="pulse-dot green"></div>
        <span style="font-size:12px;color:var(--muted)">LIVE</span>
        <span id="scadaRefresh" style="font-size:12px;font-family:'Roboto Mono',monospace;color:var(--primary)"></span>
      </div>
      <button class="btn btn-outline btn-sm" onclick="refreshScada()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Làm mới
      </button>
    </div>
  </div>

  <div class="station-grid" style="margin-bottom:24px">
    ${DATA.stations.map(s => {
    const pressColor = s.status === 'offline' ? 'var(--muted)' : s.pressure < 2 ? 'var(--danger)' : s.pressure < 2.5 ? 'var(--warning)' : 'var(--success)';
    const levelColor = s.status === 'offline' ? 'var(--muted)' : s.level > 60 ? 'var(--success)' : s.level > 30 ? 'var(--warning)' : 'var(--danger)';
    const pressurePct = s.status !== 'offline' ? Math.min(Math.round(s.pressure / 6 * 100), 100) : 0;
    return `
    <div class="card kpi-card ${s.status}" onclick="openStationDetail('${s.id}')" style="cursor:pointer; padding:16px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div style="font-weight:700; color:var(--text)">${s.name}</div>
        ${statusBadge(s.status)}
      </div>

      <div class="station-metrics" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div class="metric">
          <div style="font-size:10px; color:var(--muted); text-transform:uppercase">Áp lực</div>
          <div style="font-size:18px; font-weight:700; color:${pressColor}">${s.status !== 'offline' ? s.pressure : '—'} <span style="font-size:11px; font-weight:400; color:var(--muted)">bar</span></div>
        </div>
        <div class="metric">
          <div style="font-size:10px; color:var(--muted); text-transform:uppercase">Lưu lượng</div>
          <div style="font-size:18px; font-weight:700; color:var(--primary)">${s.status !== 'offline' ? s.flow : '—'} <span style="font-size:11px; font-weight:400; color:var(--muted)">m³/h</span></div>
        </div>
      </div>
      
      <div style="margin-top:12px">
        <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--muted); margin-bottom:4px">
          <span>Mực nước bể</span>
          <span>${s.status !== 'offline' ? s.level + '%' : '—'}</span>
        </div>
        <div style="height:4px; background:var(--bg-card); border-radius:2px; overflow:hidden">
          <div style="height:100%; width:${s.level}%; background:${levelColor}; border-radius:2px"></div>
        </div>
      </div>
    </div>`;
  }).join('')}
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center">
        <span class="card-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> Dữ liệu chi tiết</span>
        <button class="btn btn-sm btn-ghost" onclick="navigate('scadastations')">Xem tất cả</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>Trạm</th><th>Áp lực</th><th>Lưu lượng</th><th>Trạng thái</th><th>Thao tác</th>
          </tr></thead>
          <tbody>
            ${DATA.stations.map(s => `
            <tr>
              <td><div style="font-weight:600">${s.name}</div><div style="font-size:10px;color:var(--muted)">${s.id}</div></td>
              <td class="mono">${s.status !== 'offline' ? `<span style="color:${s.pressure < 2 ? 'var(--danger)' : s.pressure < 2.5 ? 'var(--warning)' : 'var(--success)'}">${s.pressure}</span>` : '—'}</td>
              <td class="mono">${s.status !== 'offline' ? s.flow : '—'}</td>
              <td>${statusBadge(s.status)}</td>
              <td><button class="btn btn-ghost btn-sm" onclick="openStationDetail('${s.id}')">Chi tiết</button></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center">
        <span class="card-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Nhật ký điều khiển mới nhất</span>
        <button class="btn btn-sm btn-ghost" onclick="navigate('scadalogs')">Xem tất cả</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>
             <th>Thời gian</th><th>Thiết bị</th><th>Lệnh</th><th>Người thực hiện</th>
          </tr></thead>
           <tbody>
            ${DATA.commandLogs.slice(-5).reverse().map(log => {
    let fullTimeStr = log.time;
    if (fullTimeStr.split(':').length === 2) fullTimeStr += ':00'; // add seconds if missing (for mock data)
    return `
            <tr>
              <td style="font-size:11px;color:var(--text);font-family:'Roboto Mono',monospace">${fullTimeStr}</td>
              <td><div style="font-weight:500">${log.device}</div><div style="font-size:10px;color:var(--muted)">${DATA.stations.find(st => st.id === log.station)?.name}</div></td>
              <td>
                <span class="badge ${log.action === 'Bật' || log.action === 'Mở' ? 'badge-green' : 'badge-red'}">${log.action}</span>
                <div style="font-size:10px;color:${log.status === 'success' ? 'var(--success)' : 'var(--danger)'};margin-top:4px">${log.status === 'success' ? 'Thành công' : 'Thất bại'}</div>
              </td>
              <td style="font-size:12px">${log.user}</td>
            </tr>`;
  }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

function openStationDetail(id, tab = 'info') {
  const s = DATA.stations.find(st => st.id === id);
  if (!s) return;
  activeStationTab = tab;

  openModal(`
  <div class="modal-header" style="border-bottom:none; padding-bottom:0">
    <div style="display:flex; flex-direction:column; gap:4px">
      <span class="modal-title">${s.name}</span>
      <div style="display:flex; gap:8px; align-items:center">
         ${statusBadge(s.status)}
         <span style="font-size:11px; color:var(--muted); font-family:'Roboto Mono',monospace">ID: ${s.id}</span>
      </div>
    </div>
    <button class="modal-close" onclick="closeModal(event)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  
  <div class="modal-tabs" style="display:flex; gap:20px; padding:0 24px; border-bottom:1px solid var(--border); margin-top:16px">
     <div class="modal-tab ${tab === 'info' ? 'active' : ''}" onclick="openStationDetail('${id}', 'info')" style="padding:10px 0; font-size:13px; font-weight:600; cursor:pointer; color:${tab === 'info' ? 'var(--primary)' : 'var(--muted)'}; border-bottom:2px solid ${tab === 'info' ? 'var(--primary)' : 'transparent'}; transition:.2s">Thông tin trạm</div>
     <div class="modal-tab ${tab === 'control' ? 'active' : ''}" onclick="openStationDetail('${id}', 'control')" style="padding:10px 0; font-size:13px; font-weight:600; cursor:pointer; color:${tab === 'control' ? 'var(--primary)' : 'var(--muted)'}; border-bottom:2px solid ${tab === 'control' ? 'var(--primary)' : 'transparent'}; transition:.2s">Điều khiển SCADA</div>
  </div>

  <div class="modal-body" style="padding:24px">
    ${tab === 'info' ? renderStationInfo(s) : renderStationControl(s)}
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Đóng</button></div>`);

  if (tab === 'info') initStationMap(s);
}

function renderStationInfo(s) {
  return `
    <div class="grid-2" style="margin-bottom:24px">
      ${[['Áp lực', s.pressure, 'bar', 'var(--primary)'], ['Lưu lượng', s.flow, 'm³/h', 'var(--success)'], ['Mực nước', s.level, '%', 'var(--warning)'], ['Công suất', s.power, 'kW', 'var(--purple)']].map(([l, v, u, c]) => `
      <div style="background:var(--bg-elevated); border:1px solid var(--border); border-radius:12px; padding:16px;">
        <div style="font-size:11px; color:var(--muted); text-transform:uppercase; margin-bottom:8px">${l}</div>
        <div style="font-size:24px; font-weight:700; color:${c}; font-family:'Roboto Mono',monospace">${s.status !== 'offline' ? v : '—'}<span style="font-size:13px; margin-left:4px; font-weight:400; color:var(--muted)">${u}</span></div>
      </div>`).join('')}
    </div>
    
    <div style="background:var(--bg-elevated); border:1px solid var(--border); border-radius:12px; padding:16px;">
       <div style="font-size:13px; font-weight:600; color:var(--text); margin-bottom:12px; display:flex; justify-content:space-between; align-items:center">
         <span>Bản đồ vị trí</span>
         <span style="font-size:11px; color:var(--muted); font-family:'Roboto Mono',monospace">${s.lat}, ${s.lng}</span>
       </div>
       <div id="stationScadaMap" style="height:200px; border-radius:8px; z-index:1"></div>
    </div>`;
}

function initStationMap(s) {
  setTimeout(() => {
    const mapEl = document.getElementById('stationScadaMap');
    if (!mapEl) return;

    // Create map
    const map = L.map('stationScadaMap', {
      zoomControl: false,
      attributionControl: false
    }).setView([s.lat, s.lng], 16);

    // Add dark theme tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    // Marker styling based on status
    const isError = s.status === 'offline' || s.pressure < 2 || s.level < 30;
    const color = isError ? 'var(--danger)' : 'var(--success)';
    const pulseClass = isError ? 'pulse-red' : 'pulse-green';

    // Create custom marker with animation
    const icon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="position:relative; width:40px; height:40px; display:flex; align-items:center; justify-content:center">
          <div class="${pulseClass}" style="position:absolute; width:100%; height:100%; border-radius:50%; opacity:0.6; z-index:1"></div>
          <div style="width:16px; height:16px; background:${color}; border:2px solid white; border-radius:50%; box-shadow:0 0 10px ${color}; z-index:2"></div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    L.marker([s.lat, s.lng], { icon }).addTo(map);
  }, 100);
}

function renderStationControl(s) {
  if (s.status === 'offline') return `<div style="text-align:center; padding:40px 0; color:var(--muted)">Trạm đang Offline. Không thể thực hiện điều khiển.</div>`;

  return `
    <div style="margin-bottom:20px; padding:12px; background:rgba(255,190,0,0.05); border:1px solid rgba(255,190,0,0.1); border-radius:8px; display:flex; gap:12px; align-items:flex-start">
       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
       <div style="font-size:12px; color:var(--text-2)">Cảnh báo: Lệnh điều khiển trực tiếp sẽ tác động ngay lập tức đến vận hành mạng lưới. Yêu cầu xác nhận 2 bước.</div>
    </div>

    <div style="display:grid; gap:12px">
      ${(s.devices || []).map(dev => `
      <div style="background:var(--bg-elevated); border:1px solid var(--border); border-radius:12px; padding:16px; display:flex; justify-content:space-between; align-items:center">
        <div style="display:flex; gap:12px; align-items:center">
          <div style="width:40px; height:40px; border-radius:10px; background:var(--bg-card); display:flex; align-items:center; justify-content:center; color:${dev.type === 'pump' ? 'var(--primary)' : 'var(--success)'}">
            ${dev.type === 'pump'
      ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v9"/><path d="M12 12l6 6"/></svg>`
      : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`}
          </div>
          <div>
            <div style="font-weight:600; font-size:14px">${dev.name}</div>
            <div style="display:flex; align-items:center; gap:6px; margin-top:2px">
              <div class="pulse-dot ${dev.status === 'running' || dev.status === 'open' ? 'green' : dev.status === 'fault' ? 'red' : 'yellow'}"></div>
              <span style="font-size:11px; color:var(--muted)">${dev.status === 'running' ? 'Đang chạy' : dev.status === 'open' ? 'Đang mở' : dev.status === 'fault' ? 'Sự cố' : 'Đang dừng'}</span>
            </div>
          </div>
        </div>
        <div style="display:flex; gap:8px; align-items:center">
          <a href="#" onclick="openDeviceHistory('${s.id}', '${dev.name}'); return false;" style="font-size:12px; color:var(--primary); margin-right:12px; text-decoration:none">Lịch sử</a>
          ${dev.type === 'pump' ? `
            <button class="btn btn-sm ${dev.status === 'running' ? 'btn-ghost' : 'btn-primary'}" ${dev.status === 'running' ? 'disabled' : ''} onclick="controlDevice('${s.id}', '${dev.id}', 'start')">Bật</button>
            <button class="btn btn-sm ${dev.status === 'running' ? 'btn-red' : 'btn-ghost'}" ${dev.status !== 'running' ? 'disabled' : ''} onclick="controlDevice('${s.id}', '${dev.id}', 'stop')">Dừng</button>
          ` : `
            <button class="btn btn-sm ${dev.status === 'open' ? 'btn-ghost' : 'btn-primary'}" ${dev.status === 'open' ? 'disabled' : ''} onclick="controlDevice('${s.id}', '${dev.id}', 'open')">Mở</button>
            <button class="btn btn-sm ${dev.status === 'closed' ? 'btn-red' : 'btn-ghost'}" ${dev.status === 'closed' ? 'disabled' : ''} onclick="controlDevice('${s.id}', '${dev.id}', 'close')">Đóng</button>
          `}
        </div>
      </div>`).join('')}
    </div>`;
}

function openDeviceHistory(stationId, deviceName) {
  const logs = DATA.commandLogs.filter(l => l.station === stationId && l.device === deviceName).reverse();
  openModal(`
    <div class="modal-header">
      <span class="modal-title">Lịch sử điều khiển - ${deviceName}</span>
      <button class="modal-close" onclick="openStationDetail('${stationId}', 'control')"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body" style="padding:20px; max-height:400px; overflow-y:auto">
      ${logs.length === 0 ? '<div style="text-align:center; color:var(--muted); padding:20px">Chưa có lịch sử điều khiển</div>' : `
      <div class="table-wrap">
        <table>
          <thead><tr><th>Thời gian</th><th>Lệnh</th><th>Kết quả</th><th>Người thực hiện</th></tr></thead>
          <tbody>
            ${logs.map(log => {
    let timeSplit = log.time.split(' ');
    let dateStr = timeSplit[0];
    let timeStr = timeSplit[1];
    if (timeStr.split(':').length === 2) timeStr += ':00'; // add seconds if missing
    return `
              <tr>
                <td style="font-size:11px;color:var(--muted);font-family:'Roboto Mono',monospace">${dateStr} ${timeStr}</td>
                <td><span class="badge ${log.action === 'Bật' || log.action === 'Mở' ? 'badge-green' : 'badge-red'}">${log.action}</span></td>
                <td><div style="font-size:11px;color:${log.status === 'success' ? 'var(--success)' : 'var(--danger)'}">${log.status === 'success' ? 'Thành công' : 'Thất bại'}</div></td>
                <td style="font-size:12px">${log.user}</td>
              </tr>`;
  }).join('')}
          </tbody>
        </table>
      </div>`}
    </div>
    <div class="modal-footer"><button class="btn btn-primary" onclick="openStationDetail('${stationId}', 'control')">Quay lại</button></div>
  `);
}

function controlDevice(stationId, deviceId, action) {
  const s = DATA.stations.find(st => st.id === stationId);
  const dev = s.devices.find(d => d.id === deviceId);
  const actionText = { start: 'Bật', stop: 'Dừng', open: 'Mở', close: 'Đóng' }[action];

  openModal(`
    <div class="modal-header">
      <span class="modal-title">Xác nhận điều khiển</span>
      <button class="modal-close" onclick="openStationDetail('${stationId}', 'control')"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="modal-body" style="padding:24px; text-align:center">
      <div style="width:60px; height:60px; border-radius:50%; background:var(--primary-soft); display:flex; align-items:center; justify-content:center; margin:0 auto 20px; color:var(--primary)">
         <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <div style="font-size:16px; font-weight:600; margin-bottom:12px">Xác nhận lệnh ${actionText}</div>
      <div style="font-size:13px; color:var(--text-2); margin-bottom:24px">Bạn có chắc chắn muốn thực hiện lệnh <strong>${actionText.toUpperCase()}</strong> cho <strong>${dev.name}</strong> tại <strong>${s.name}</strong>?</div>
      
      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:12px; margin-bottom:20px">
         <div style="font-size:11px; color:var(--muted); margin-bottom:8px">Mã xác thực 2 bước (Giả lập)</div>
         <div style="display:flex; gap:8px; justify-content:center">
            ${[0, 0, 0, 0, 0, 0].map(() => `<div style="width:36px; height:44px; background:var(--bg-elevated); border:1px solid var(--border-active); border-radius:6px; display:flex; align-items:center; justify-content:center; font-family:'Roboto Mono',monospace; font-size:20px; font-weight:700">•</div>`).join('')}
         </div>
      </div>
    </div>
    <div class="modal-footer" style="display:flex; gap:12px">
      <button class="btn btn-ghost" style="flex:1" onclick="openStationDetail('${s.id}', 'control')">Hủy</button>
      <button class="btn btn-primary" style="flex:1" onclick="confirmControl('${s.id}', '${dev.id}', '${action}')">Xác nhận thực hiện</button>
    </div>
  `);
}

function confirmControl(stationId, deviceId, action) {
  const s = DATA.stations.find(st => st.id === stationId);
  const dev = s.devices.find(d => d.id === deviceId);
  const actionText = { start: 'Bật', stop: 'Dừng', open: 'Mở', close: 'Đóng' }[action];

  // Map action to state
  const newState = { start: 'running', stop: 'standby', open: 'open', close: 'closed' }[action];

  // Update UI to loading
  openModal(`
    <div class="modal-body" style="padding:60px 24px; text-align:center">
      <div class="spinner" style="width:40px; height:40px; border:3px solid var(--border); border-top-color:var(--primary); border-radius:50%; animation:spin 1s linear infinite; margin:0 auto 20px"></div>
      <div style="font-size:15px; font-weight:600">Đang gửi lệnh...</div>
      <div style="font-size:12px; color:var(--muted); margin-top:8px">Đang kết nối đến gateway trạm ${s.id}</div>
    </div>
    <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
  `);

  setTimeout(() => {
    // Actually update the data
    dev.status = newState;

    // Add to command log
    const now = new Date();
    DATA.commandLogs.push({
      id: DATA.commandLogs.length + 1,
      time: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`,
      station: stationId,
      device: dev.name,
      action: actionText,
      user: 'Trần Đình Dũng', // Mock current user
      status: 'success'
    });

    // Show success
    openModal(`
      <div class="modal-body" style="padding:40px 24px; text-align:center">
      <div style="width:60px; height:60px; border-radius:50%; background:var(--success-soft); display:flex; align-items:center; justify-content:center; margin:0 auto 20px; color:var(--success)">
           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div style="font-size:18px; font-weight:700; margin-bottom:8px">Lệnh đã thực thi!</div>
        <div style="font-size:13px; color:var(--text-2); margin-bottom:24px">Thiết bị <strong>${dev.name}</strong> đã được <strong>${actionText.toLowerCase()}</strong> thành công.</div>
        <button class="btn btn-primary" onclick="openStationDetail('${stationId}', 'control')">Xong</button>
      </div>
    `);

    // Refresh scada page if visible
    if (window.currentPage === 'scada') {
      // Manual reload of the page content
      document.getElementById('content').innerHTML = renderScada();
      afterRender_scada();
    }
  }, 1500);
}

window.afterRender_scada = function () {
  document.getElementById('scadaRefresh').textContent = new Date().toLocaleTimeString('vi-VN');
  if (scadaLiveTimer) clearInterval(scadaLiveTimer);
  scadaLiveTimer = setInterval(scadaLiveTick, 5000);
};

function scadaLiveTick() {
  if (!document.getElementById('scadaRefresh')) {
    clearInterval(scadaLiveTimer);
    return;
  }

  DATA.stations.forEach(s => {
    if (s.status === 'offline') return;
    s.pressure = Math.max(0.5, Math.min(6.0, +(s.pressure + (Math.random() - 0.5) * 0.1).toFixed(2)));
    s.flow = Math.max(50, Math.round(s.flow + (Math.random() - 0.5) * 20));
    s.level = Math.max(5, Math.min(98, Math.round(s.level + (Math.random() - 0.5) * 2)));
    s.power = Math.max(20, Math.round(s.power + (Math.random() - 0.5) * 5));
  });

  // Re-render only parts that need updating if not in modal
  const ts = document.getElementById('scadaRefresh');
  if (ts) ts.textContent = new Date().toLocaleTimeString('vi-VN');
}

function refreshScada() {
  if (scadaLiveTimer) { clearInterval(scadaLiveTimer); scadaLiveTimer = null; }
  navigate('scada');
}

// ── DEDICATED PAGES: SCADA STATIONS & LOGS ──────────────────────────────
let scadaFullState = { type: 'stations', query: '', page: 1, limit: 15 };

function renderScadaStations() {
  scadaFullState.type = 'stations';
  if (currentPage !== 'scadastations') scadaFullState = { type: 'stations', query: '', page: 1, limit: 15 };
  return renderScadaLayout('Dữ liệu chi tiết tất cả các trạm', 'Quản lý thông số theo thời gian thực', 'stations');
}

function renderScadaLogs() {
  scadaFullState.type = 'logs';
  if (currentPage !== 'scadalogs') scadaFullState = { type: 'logs', query: '', page: 1, limit: 15 };
  return renderScadaLayout('Nhật ký điều khiển toàn hệ thống', 'Lịch sử thao tác thiết bị SCADA trên toàn mạng lưới', 'logs');
}

function renderScadaLayout(title, subtitle, type) {
  // Ensure state matches the current view initially before returning HTML.
  scadaFullState.type = type;

  return `
  <div class="page-header">
    <div style="display:flex; align-items:center; gap:12px">
      <button class="btn btn-ghost" style="padding:8px" onclick="navigate('scada')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      </button>
      <div class="page-title">
        <h1>${title}</h1>
        <p>${subtitle}</p>
      </div>
    </div>
    <div class="page-actions">
      <button class="btn btn-outline" onclick="exportDataSimulation()">Xuất báo cáo</button>
    </div>
  </div>

  <div class="card content-area" style="min-height: calc(100vh - 160px); display:flex; flex-direction:column; padding:0">
    <div class="card-header" style="padding:16px 24px; display:flex; gap:16px; background:var(--bg-elevated); border-bottom:1px solid var(--border)">
      <div style="position:relative; width:350px">
        <svg style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--muted)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Tìm kiếm theo ID, tên trạm, thiết bị..." value="${scadaFullState.query}" oninput="filterScadaFullView(this.value)" style="width:100%; pl:36px; background:var(--bg-base); border:1px solid var(--border); color:var(--text); padding:10px 16px 10px 40px; border-radius:8px; font-size:14px" autocomplete="off">
      </div>
    </div>
    
    <div class="table-wrap" style="flex:1; border:none" id="scadaFullTableContainer">
       <!-- Table rendered via JS -->
    </div>
    
    <div id="scadaFullPagination" style="padding:16px 24px; border-top:1px solid var(--border); background:var(--bg-elevated); display:flex; justify-content:space-between; align-items:center">
       <!-- Pagination rendered via JS -->
    </div>
  </div>
  `;
}

window.afterRender_scadastations = function () {
  document.getElementById('scadaFullTableContainer').innerHTML = renderScadaFullTable();
  updateScadaPaginationUI();
};

window.afterRender_scadalogs = function () {
  document.getElementById('scadaFullTableContainer').innerHTML = renderScadaFullTable();
  updateScadaPaginationUI();
};

window.filterScadaFullView = function (val) {
  scadaFullState.query = val.toLowerCase();
  scadaFullState.page = 1; // reset on search
  document.getElementById('scadaFullTableContainer').innerHTML = renderScadaFullTable();
  updateScadaPaginationUI();
};

window.changeScadaFullPage = function (dir) {
  scadaFullState.page += dir;
  document.getElementById('scadaFullTableContainer').innerHTML = renderScadaFullTable();
  updateScadaPaginationUI();
};

function renderScadaFullTable() {
  const { type, query, page, limit } = scadaFullState;

  if (type === 'stations') {
    let list = DATA.stations.filter(s => s.name.toLowerCase().includes(query) || s.id.toLowerCase().includes(query));
    scadaFullState.total = list.length;
    const paginated = list.slice((page - 1) * limit, page * limit);

    return `
      <table style="width:100%; min-width:800px">
        <thead style="position:sticky; top:0; background:var(--bg-elevated); z-index:2"><tr>
          <th style="padding-left:24px">ID Trạm</th><th>Tên trạm</th><th>Trạng thái</th><th>Áp lực (bar)</th><th>Lưu lượng (m³/h)</th><th>Mực nước (%)</th><th>Công suất (kW)</th><th style="padding-right:24px">Thao tác</th>
        </tr></thead>
        <tbody>
          ${paginated.length === 0 ? '<tr><td colspan="8" style="text-align:center; padding:40px; color:var(--muted)">Không tìm thấy dữ liệu</td></tr>' : paginated.map(s => `
          <tr>
            <td class="mono" style="padding-left:24px; font-size:12px">${s.id}</td>
            <td style="font-weight:600">${s.name}</td>
            <td>${statusBadge(s.status)}</td>
            <td class="mono ${s.pressure < 2 ? 'text-red' : ''}">${s.status !== 'offline' ? s.pressure : '—'}</td>
            <td class="mono">${s.status !== 'offline' ? s.flow : '—'}</td>
            <td class="mono">${s.status !== 'offline' ? s.level : '—'}</td>
            <td class="mono">${s.status !== 'offline' ? s.power : '—'}</td>
            <td style="padding-right:24px"><button class="btn btn-ghost btn-sm" onclick="openStationDetail('${s.id}')">Chi tiết</button></td>
          </tr>`).join('')}
        </tbody>
      </table>`;
  } else {
    // Logs
    let list = [...DATA.commandLogs].reverse().filter(l =>
      l.device.toLowerCase().includes(query) ||
      l.station.toLowerCase().includes(query) ||
      l.user.toLowerCase().includes(query) ||
      l.time.includes(query)
    );
    scadaFullState.total = list.length;
    const paginated = list.slice((page - 1) * limit, page * limit);

    return `
      <table style="width:100%; min-width:1000px">
        <thead style="position:sticky; top:0; background:var(--bg-elevated); z-index:2"><tr>
          <th style="padding-left:24px">Thời gian</th><th>ID Trạm</th><th>Tên trạm</th><th>Thiết bị</th><th>Lệnh</th><th>Kết quả</th><th style="padding-right:24px">Người thực hiện</th>
        </tr></thead>
        <tbody>
          ${paginated.length === 0 ? '<tr><td colspan="7" style="text-align:center; padding:40px; color:var(--muted)">Không tìm thấy lịch sử</td></tr>' : paginated.map(l => {
      let stName = DATA.stations.find(st => st.id === l.station)?.name || 'Unknown';
      return `
            <tr>
              <td class="mono" style="padding-left:24px; font-size:12px; color:var(--text)">${l.time}</td>
              <td class="mono" style="font-size:12px">${l.station}</td>
              <td style="font-weight:500">${stName}</td>
              <td>${l.device}</td>
              <td><span class="badge ${l.action === 'Bật' || l.action === 'Mở' ? 'badge-green' : 'badge-red'}">${l.action}</span></td>
              <td><span style="font-weight:600; color:${l.status === 'success' ? 'var(--success)' : 'var(--danger)'}; font-size:12px">${l.status === 'success' ? 'Thành công' : 'Thất bại'}</span></td>
              <td style="padding-right:24px; font-size:13px">${l.user}</td>
            </tr>`;
    }).join('')}
        </tbody>
      </table>`;
  }
}

function updateScadaPaginationUI() {
  const container = document.getElementById('scadaFullPagination');
  if (!container) return;

  const { page, limit, total } = scadaFullState;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startIdx = total === 0 ? 0 : (page - 1) * limit + 1;
  const endIdx = Math.min(page * limit, total);

  container.innerHTML = `
    <div style="font-size:13px; color:var(--muted)">Đang hiển thị <strong>${startIdx}-${endIdx}</strong> trong tổng số <strong>${total}</strong> bản ghi</div>
    <div style="display:flex; gap:8px">
      <button class="btn btn-outline" ${page === 1 ? 'disabled' : ''} onclick="changeScadaFullPage(-1)">Trang trước</button>
      <div style="display:flex; align-items:center; padding:0 8px; font-size:14px; font-weight:600">Trang ${page} / ${totalPages}</div>
      <button class="btn btn-outline" ${page >= totalPages ? 'disabled' : ''} onclick="changeScadaFullPage(1)">Trang sau</button>
    </div>
  `;
}
