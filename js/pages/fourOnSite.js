// ── QUẢN LÝ 4 TẠI CHỖ (PCTT) ─────────────────────────────────────
let fosTab = 'lucluong';
let fosAlertLevel = 'normal'; // normal | warning | emergency

function renderCrm() {
  const d = DATA.fourOnSite;
  const totalForce = d.lucluong.reduce((s, u) => s + u.total, 0);
  const onCallForce = d.lucluong.reduce((s, u) => s + u.onCall, 0);
  const totalVehicles = d.phuongtien.reduce((s, v) => s + v.count, 0);
  const readyVehicles = d.phuongtien.reduce((s, v) => s + v.ready, 0);

  const alertColors = { normal: 'var(--green)', warning: 'var(--yellow)', emergency: 'var(--red)' };
  const alertLabels = { normal: 'Bình thường', warning: 'Cảnh báo lũ', emergency: 'Khẩn cấp' };
  const alertColor = alertColors[fosAlertLevel];

  return `
  <div class="page-header">
    <div class="page-title">
      <h1>Chuẩn bị 4 Tại chỗ</h1>
      <p>Quản lý lực lượng, phương tiện, vật tư và hậu cần tại chỗ ứng phó thiên tai</p>
    </div>
    <div class="page-actions">
      <div style="display:flex;align-items:center;gap:10px;padding:6px 14px;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid var(--border)">
        <div class="pulse-dot ${fosAlertLevel === 'normal' ? 'green' : fosAlertLevel === 'warning' ? 'yellow' : 'red'}"></div>
        <span style="font-size:13px;font-weight:600;color:${alertColor}">${alertLabels[fosAlertLevel]}</span>
      </div>
      <select class="form-control" style="max-width:180px;font-size:13px" onchange="window.fosSetLevel(this.value)">
        <option value="normal" ${fosAlertLevel==='normal'?'selected':''}>Chế độ Bình thường</option>
        <option value="warning" ${fosAlertLevel==='warning'?'selected':''}>Chế độ Cảnh báo lũ</option>
        <option value="emergency" ${fosAlertLevel==='emergency'?'selected':''}>Chế độ Khẩn cấp</option>
      </select>
      <button class="btn btn-primary btn-sm" onclick="fosTrieuTap()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
        Triệu tập
      </button>
    </div>
  </div>

  <!-- KPI Overview -->
  <div class="kpi-grid" style="margin-bottom:20px">
    <div class="kpi-card" style="--accent-color:var(--cyan)">
      <div class="kpi-label">Tổng lực lượng đăng ký</div>
      <div class="kpi-value">${totalForce.toLocaleString()}</div>
      <div class="kpi-sub">${onCallForce.toLocaleString()} người đang sẵn sàng trực chiến</div>
    </div>
    <div class="kpi-card" style="--accent-color:var(--green)">
      <div class="kpi-label">Phương tiện sẵn sàng</div>
      <div class="kpi-value">${readyVehicles}<span style="font-size:14px;color:var(--muted)">/${totalVehicles}</span></div>
      <div class="kpi-sub">${((readyVehicles/totalVehicles)*100).toFixed(0)}% phương tiện hoạt động tốt</div>
    </div>
    <div class="kpi-card" style="--accent-color:var(--yellow)">
      <div class="kpi-label">Lương thực dự trữ</div>
      <div class="kpi-value">${(d.haugian.food_packs/1000).toFixed(0)}k</div>
      <div class="kpi-sub">suất ăn · ${(d.haugian.water_liters/1000).toFixed(0)}k lít nước sạch</div>
    </div>
    <div class="kpi-card" style="--accent-color:var(--purple)">
      <div class="kpi-label">Điểm sơ tán an toàn</div>
      <div class="kpi-value">${d.haugian.evacuation_sites}</div>
      <div class="kpi-sub">${d.haugian.temporary_shelters} lều bạt, ${d.haugian.medical_kits} bộ y tế</div>
    </div>
  </div>

  <!-- Tabs -->
  <div class="tabs" style="margin-bottom:16px">
    <button class="tab-btn ${fosTab==='lucluong'?'active':''}" onclick="fosSwitchTab('lucluong')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
      Lực lượng tại chỗ
    </button>
    <button class="tab-btn ${fosTab==='phuongtien'?'active':''}" onclick="fosSwitchTab('phuongtien')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="2" y="7" width="17" height="13" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><path d="M22 11l-3-3H2"/></svg>
      Phương tiện
    </button>
    <button class="tab-btn ${fosTab==='vattu'?'active':''}" onclick="fosSwitchTab('vattu')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
      Vật tư & Hậu cần
    </button>
    <button class="tab-btn ${fosTab==='haugian'?'active':''}" onclick="fosSwitchTab('haugian')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      Y tế & Sơ tán
    </button>
  </div>

  <div id="fosContent">${getFosTabContent()}</div>`;
}

function getFosTabContent() {
  if (fosTab === 'lucluong') return renderFosLucLuong();
  if (fosTab === 'phuongtien') return renderFosPhuongTien();
  if (fosTab === 'vattu') return renderFosVatTu();
  if (fosTab === 'haugian') return renderFosHauGian();
  return '';
}

function fosSwitchTab(tab) {
  fosTab = tab;
  document.querySelectorAll('.tabs .tab-btn').forEach(b => b.classList.remove('active'));
  if (event && event.target) event.target.classList.add('active');
  document.getElementById('fosContent').innerHTML = getFosTabContent();
  if (tab === 'phuongtien') setTimeout(renderFosCharts, 60);
}

window.fosSetLevel = function(level) {
  fosAlertLevel = level;
  const el = document.getElementById('fosContent');
  if (el) el.innerHTML = getFosTabContent();
};

function renderFosLucLuong() {
  const d = DATA.fourOnSite;
  const totalAll = d.lucluong.reduce((s, u) => s + u.total, 0);
  return `
  <div class="card">
    <div class="card-header">
      <span class="card-title">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
        Lực lượng tại chỗ theo địa bàn
      </span>
      <button class="btn btn-ghost btn-sm" onclick="fosExportForce()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Xuất Excel
      </button>
    </div>
    <div style="padding:16px">
      ${d.lucluong.map(u => {
        const pct = Math.round((u.onCall / u.total) * 100);
        const trainedPct = Math.round((u.trained / u.total) * 100);
        return `
        <div style="padding:14px;border:1px solid var(--border);border-radius:10px;margin-bottom:10px;background:rgba(0,200,255,.02)">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
            <div style="width:36px;height:36px;border-radius:8px;background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.2);display:flex;align-items:center;justify-content:center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
            </div>
            <div style="flex:1">
              <div style="font-weight:600;font-size:14px">${u.unit}</div>
              <div style="font-size:12px;color:var(--muted);margin-top:2px">${u.total.toLocaleString()} người đăng ký · ${u.trained.toLocaleString()} đã huấn luyện PCTT</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:20px;font-weight:700;color:var(--cyan)">${u.onCall.toLocaleString()}</div>
              <div style="font-size:11px;color:var(--muted)">đang sẵn sàng</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div>
              <div style="font-size:11px;color:var(--muted);margin-bottom:5px">Tỷ lệ sẵn sàng: <span style="color:${pct>=30?'var(--green)':'var(--yellow)'}">  ${pct}%</span></div>
              <div class="progress-bar" style="height:6px"><div class="progress-fill" style="width:${pct}%;background:${pct>=30?'var(--green)':'var(--yellow)'}"></div></div>
            </div>
            <div>
              <div style="font-size:11px;color:var(--muted);margin-bottom:5px">Đã huấn luyện: <span style="color:var(--cyan)">${trainedPct}%</span></div>
              <div class="progress-bar" style="height:6px"><div class="progress-fill" style="width:${trainedPct}%;background:var(--cyan)"></div></div>
            </div>
          </div>
        </div>`;
      }).join('')}
      <div style="padding:12px 16px;background:rgba(0,200,255,.04);border:1px solid rgba(0,200,255,.15);border-radius:10px;display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:13px;color:var(--muted)">Tổng cộng toàn thành phố</span>
        <span style="font-size:18px;font-weight:700;color:var(--cyan)">${totalAll.toLocaleString()} người</span>
      </div>
    </div>
  </div>`;
}

function renderFosPhuongTien() {
  const d = DATA.fourOnSite;
  const vehicleIcons = {
    'Xe cứu thương': '<path d="M10 2h4l4 8H6l4-8z"/><rect x="2" y="10" width="20" height="8" rx="1"/><line x1="12" y1="14" x2="12" y2="14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    'Xuồng máy': '<path d="M2 16s2-4 10-4 10 4 10 4"/><path d="M4 16V8l4-4h8l4 4v8"/>',
    'Máy bơm nước': '<path d="M2 9h20M2 15h20"/><circle cx="12" cy="12" r="7"/><path d="M8 12h8"/>',
    'Máy phát điện': '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 2l-4 5-4-5"/>',
    'Ô tô tải công trình': '<rect x="2" y="8" width="20" height="12" rx="1"/><path d="M14 8V4H8v4"/><circle cx="6" cy="20" r="2"/><circle cx="18" cy="20" r="2"/>',
    'Máy xúc/ủi': '<path d="M2 16h16v4H2z"/><path d="M18 16l4-8H14l-4 8"/><path d="M6 16V10"/><path d="M10 16V10"/>',
  };
  return `
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">
    ${d.phuongtien.map(v => {
      const pct = Math.round((v.ready/v.count)*100);
      const color = pct===100?'var(--green)':pct>=85?'var(--cyan)':pct>=60?'var(--yellow)':'var(--red)';
      const svgPath = vehicleIcons[v.type] || '<rect x="3" y="3" width="18" height="18" rx="2"/>';
      return `
      <div class="card" style="cursor:default">
        <div class="card-body" style="padding:20px">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
            <div style="width:44px;height:44px;border-radius:10px;background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="1.8">${svgPath}</svg>
            </div>
            <div>
              <div style="font-weight:600;font-size:14px">${v.type}</div>
              <div style="font-size:12px;color:var(--muted);margin-top:2px">${v.ready}/${v.count} sẵn sàng</div>
            </div>
            <div style="margin-left:auto;text-align:right">
              <div style="font-size:24px;font-weight:700;color:${color}">${pct}<span style="font-size:13px;color:var(--muted)">%</span></div>
            </div>
          </div>
          <div class="progress-bar" style="height:8px;border-radius:4px">
            <div class="progress-fill" style="width:${pct}%;background:${color};border-radius:4px;transition:width .4s ease"></div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:10px;font-size:11px;color:var(--muted)">
            <span>Đang sửa chữa: ${v.count-v.ready}</span>
            <button class="btn btn-ghost btn-sm" style="font-size:11px;padding:2px 8px" onclick="fosDetailVehicle('${v.type}')">Chi tiết</button>
          </div>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

function renderFosVatTu() {
  const d = DATA.fourOnSite;
  return `
  <div class="card">
    <div class="card-header">
      <span class="card-title">Kho vật tư ứng phó thiên tai</span>
      <button class="btn btn-primary btn-sm" onclick="fosXuatKhoKhan()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Xuất kho khẩn cấp
      </button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr>
          <th>Vật tư / Vật liệu</th>
          <th>Tổng dự trữ</th>
          <th>Đã phân bổ</th>
          <th>Còn lại</th>
          <th>Tỷ lệ phân bổ</th>
          <th>Thao tác</th>
        </tr></thead>
        <tbody>
          ${d.vattu.map(v => {
            const remaining = v.quantity - v.allocated;
            const pct = Math.round((v.allocated/v.quantity)*100);
            const color = pct>=80?'var(--yellow)':pct>=50?'var(--cyan)':'var(--green)';
            return `
            <tr>
              <td style="font-weight:600">${v.item}</td>
              <td class="mono">${v.quantity.toLocaleString()}</td>
              <td class="mono" style="color:var(--yellow)">${v.allocated.toLocaleString()}</td>
              <td class="mono" style="color:var(--green)">${remaining.toLocaleString()} ${v.unit}</td>
              <td style="min-width:140px">
                <div style="display:flex;align-items:center;gap:8px">
                  <div class="progress-bar" style="flex:1;height:6px">
                    <div class="progress-fill" style="width:${pct}%;background:${color}"></div>
                  </div>
                  <span class="mono" style="font-size:11px;color:${color}">${pct}%</span>
                </div>
              </td>
              <td style="display:flex;gap:6px">
                <button class="btn btn-ghost btn-sm" onclick="fosUpdateVatTu('${v.item}')">Cập nhật</button>
                <button class="btn btn-ghost btn-sm" onclick="fosXuatPhieu('${v.item}')">Xuất kho</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function renderFosHauGian() {
  const d = DATA.fourOnSite;
  const items = [
    { label: 'Suất ăn dự trữ', value: d.haugian.food_packs.toLocaleString(), unit: 'suất', icon: '<path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>', color: 'var(--yellow)' },
    { label: 'Nước uống sạch', value: (d.haugian.water_liters/1000).toFixed(0)+'k', unit: 'lít', icon: '<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/><path d="M12 8v4l3 3"/>', color: 'var(--cyan)' },
    { label: 'Bộ y tế cấp cứu', value: d.haugian.medical_kits.toLocaleString(), unit: 'bộ', icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>', color: 'var(--red)' },
    { label: 'Lều bạt tạm thời', value: d.haugian.temporary_shelters.toLocaleString(), unit: 'lều', icon: '<polyline points="23 7 13 17 8 12 1 19"/><polyline points="17 7 23 7 23 13"/>', color: 'var(--purple)' },
    { label: 'Điểm sơ tán an toàn', value: d.haugian.evacuation_sites.toLocaleString(), unit: 'điểm', icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', color: 'var(--green)' },
  ];

  return `
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;margin-bottom:20px">
    ${items.map(item => `
    <div class="card" style="cursor:default">
      <div class="card-body" style="padding:20px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
          <div style="width:44px;height:44px;border-radius:10px;background:${item.color.replace('var(','rgba(').replace(')',',.15)')};border:1px solid ${item.color.replace('var(','rgba(').replace(')',', .3)')};display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${item.color}" stroke-width="1.8">${item.icon}</svg>
          </div>
          <div style="font-size:13px;color:var(--muted)">${item.label}</div>
        </div>
        <div style="font-size:32px;font-weight:700;color:${item.color}">${item.value}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:4px">${item.unit}</div>
      </div>
    </div>`).join('')}
  </div>

  <!-- Evacuation map placeholder -->
  <div class="card">
    <div class="card-header">
      <span class="card-title">Điểm sơ tán & Cung ứng khẩn cấp theo huyện</span>
      <button class="btn btn-ghost btn-sm" onclick="fosViewOnGis()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        Xem 4 Tại chỗ trên GIS
      </button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Địa bàn</th><th>Điểm sơ tán</th><th>Lều bạt</th><th>Suất ăn phân bổ</th><th>Trạng thái</th></tr></thead>
        <tbody>
          ${DATA.fourOnSite.lucluong.map(u => `
          <tr>
            <td style="font-weight:600">${u.unit}</td>
            <td class="mono" style="color:var(--green)">${Math.floor(u.onCall/180) + 5}</td>
            <td class="mono">${Math.floor(u.onCall/50)}</td>
            <td class="mono" style="color:var(--yellow)">${(u.onCall * 3).toLocaleString()}</td>
            <td><span class="badge ${fosAlertLevel==='emergency'?'badge-red':fosAlertLevel==='warning'?'badge-yellow':'badge-green'}">${fosAlertLevel==='emergency'?'Kích hoạt toàn bộ':fosAlertLevel==='warning'?'Cảnh báo':'Dự phòng'}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

window.afterRender_fourOnSite = function() {
  if (fosTab === 'phuongtien') setTimeout(renderFosCharts, 60);
};

function renderFosCharts() { /* Charts can be added here if needed */ }

// ── GIS Bridge: navigate → auto-bật layer 4 Tại chỗ ───────────
window.fosViewOnGis = function() {
  navigate('gis');
  setTimeout(() => {
    // Bật layer 4TC nếu chưa bật
    if (typeof gisLayerFlags !== 'undefined' && typeof toggleGisLayerGroup === 'function') {
      if (!gisLayerFlags.resources4tc) {
        gisLayerFlags.resources4tc = true;
        toggleGisLayerGroup('resources4tc', true);
        // Sync checkbox trong panel
        const cb = document.querySelector('input[onchange*="resources4tc"]');
        if (cb) cb.checked = true;
      }
    }
    if (typeof showToast === 'function') {
      showToast('<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> Đã bật layer "4 Tại chỗ" trên bản đồ GIS');
    }
  }, 850);
};
