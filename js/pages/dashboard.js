// ── DASHBOARD PCTT — HADIWA IOC ────────────────────────────────────
let dashTicker = null;
let dashRefreshTimer = null;
let dashRefreshCount = 30;
let dashTimeRange = 'today'; // 'today' | 'week' | 'month'

// ── Chart data theo time range ─────────────────────────────────────
const DASH_CHART_DATA = {
  today: {
    outputLabels: ['00h', '02h', '04h', '06h', '08h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'],
    outputDatasets: [
      { label: 'Hà Nội (Sông Hồng)', data: [4.1, 4.1, 4.2, 4.3, 4.5, 4.6, 4.7, 4.75, 4.8, 4.8, 4.82, 4.82] },
      { label: 'Sơn Tây (Sông Hồng)', data: [6.2, 6.3, 6.4, 6.5, 6.7, 6.8, 7.0, 7.05, 7.1, 7.1, 7.15, 7.15] },
      { label: 'Thượng Cát (Sông Đuống)', data: [5.0, 5.0, 5.1, 5.2, 5.3, 5.35, 5.38, 5.38, 5.38, 5.38, 5.38, 5.38] },
      { label: 'Ba Thá (Sông Đáy)', data: [3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.85, 3.9, 3.92, 3.95, 3.95] },
    ],
    monthlyData: [18, 35, 22, 8, 42, 88, 125, 210, 172, 95, 42, 18],
    monthlyLabels: ['00h', '02h', '04h', '06h', '08h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'],
    monthlyLabel: 'Lượng mưa theo giờ (mm)',
  },
  week: {
    outputLabels: ['T5 06/3', 'T6 07/3', 'T7 08/3', 'CN 09/3', 'T2 10/3', 'T3 11/3', 'T4 12/3'],
    outputDatasets: [
      { label: 'Hà Nội (Sông Hồng)', data: [3.1, 3.4, 3.8, 4.1, 4.4, 4.6, 4.82] },
      { label: 'Sơn Tây (Sông Hồng)', data: [5.2, 5.6, 6.0, 6.3, 6.7, 7.0, 7.15] },
      { label: 'Thượng Cát (Sông Đuống)', data: [4.2, 4.5, 4.8, 5.0, 5.1, 5.3, 5.38] },
      { label: 'Ba Thá (Sông Đáy)', data: [2.8, 3.0, 3.2, 3.5, 3.7, 3.85, 3.95] },
    ],
    monthlyData: [18, 35, 88, 145, 172, 135, 62],
    monthlyLabels: ['06/3', '07/3', '08/3', '09/3', '10/3', '11/3', '12/3'],
    monthlyLabel: 'Tổng lượng mưa (mm/ngày)',
  },
  month: {
    outputLabels: ['T9/25', 'T10/25', 'T11/25', 'T12/25', 'T1/26', 'T2/26', 'T3/26'],
    outputDatasets: [
      { label: 'Hà Nội (Sông Hồng)', data: [3.2, 2.8, 1.5, 0.8, 1.0, 1.8, 4.82] },
      { label: 'Sơn Tây (Sông Hồng)', data: [5.0, 4.2, 2.5, 1.2, 1.5, 2.8, 7.15] },
      { label: 'Thượng Cát (Sông Đuống)', data: [4.0, 3.5, 2.0, 1.0, 1.2, 2.2, 5.38] },
      { label: 'Ba Thá (Sông Đáy)', data: [2.5, 2.0, 1.2, 0.8, 0.9, 1.5, 3.95] },
    ],
    monthlyLabels: ['T9/25', 'T10/25', 'T11/25', 'T12/25', 'T1/26', 'T2/26', 'T3/26'],
    monthlyData: [285, 215, 98, 52, 72, 185, 490],
    monthlyLabel: 'Lượng mưa tháng (mm)',
  },
};

function renderDashboard() {
  const onlineStations = DATA.stations.filter(s => s.status === 'online').length;
  const warnStations = DATA.stations.filter(s => s.status === 'warning').length;
  const openIncidents = DATA.incidents.filter(i => i.status !== 'done').length;
  const critAlarms = DATA.alarms.filter(a => !a.ack && a.severity === 'critical').length;
  const pendingCmds = DATA.commandLogs.filter(c => c.status === 'pending_approval').length;
  // Hồ báo động
  const critReservoirs = RESERVOIR_DATA.filter(r => r.status === 'critical').length;
  // Đê xung yếu
  const critDikes = DIKE_DATA.filter(d => d.condition === 'critical').length;

  const cfg = window.dashPanelConfig || getDashPanelDefaults();
  const isVisible = (id) => { const p = cfg.find(x => x.id === id); return !p || p.visible; };

  return `
  <!-- Live Ticker -->
  ${isVisible('ticker') ? `
  <div id="dashTicker" style="background:var(--ticker-background);border-bottom:1px solid var(--ticker-border);padding:0;overflow:hidden;display:flex;align-items:center;height:36px;margin:0 -24px 20px -24px">
    <div class="dashboard-live-label" style="font-size:11px;padding:0 14px;white-space:nowrap;flex-shrink:0;z-index:2;align-self:stretch;display:flex;align-items:center;letter-spacing:.5px">LIVE</div>
    <div id="tickerTrack" style="display:flex;gap:32px;padding-left:24px;animation:tickerScroll 40s linear infinite;white-space:nowrap;align-items:center;line-height:1">
      ${[
        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg> Hồ Tuy Lai: Mực nước <b>19.2m</b> — tiệm cận BĐ2 (19.5m), đang mở tràn xả lũ`,
        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg> Đê Hữu Đáy K18+500: <b>Mạch sủi thẩm lậu</b> — Đội ƯCSC số 3 đang ứng cứu`,
        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> Trạm Hà Nội (sông Hồng): Mực nước <b>4.82m</b> — đang tăng`,
        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2" style="vertical-align:middle"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> <b>${critAlarms} cảnh báo khẩn</b> chưa xử lý · ${openIncidents} sự cố đang theo dõi`,
        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 2C12 2 4 10 4 14a8 8 0 0016 0C20 10 12 2 12 2z"/></svg> Lượng mưa 12h qua: <b>210mm</b> tại Ba Thá/Đáy — vượt ngưỡng báo động`,
        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> Lực lượng ứng trực: <b>${BIZ_STATS.onDutyStaff} cán bộ</b> · ${BIZ_STATS.fieldTeams} đội hiện trường`,
        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> <b>${pendingCmds}</b> lệnh đang chờ phê duyệt — vào Điều hành để xử lý`,
        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M3 17h18M5 17V9l7-5 7 5v8"/></svg> Đê điều TP. Hà Nội: <b>${DIKE_DATA.length}</b> tuyến đê · ${critDikes} tuyến xung yếu — Đê Hữu Đáy & Ngọc Tảo cần ưu tiên`,
      ].map(t => `<span style="font-size:12px;color:var(--ticker-text);line-height:1;vertical-align:middle">${t}</span>`).join('<span style="color:var(--ticker-border);padding:0 8px;vertical-align:middle">|</span>')}
    </div>
  </div>` : ''}


  <div class="page-header" style="margin-bottom:16px">
    <div class="page-title"><h1>Tổng quan PCTT</h1><p>Dữ liệu cập nhật lúc ${new Date().toLocaleString('vi-VN')}</p></div>
    <div class="page-actions" style="gap:10px;flex-wrap:wrap">
      <!-- Time range filter -->
      <div class="dashboard-range">
        ${[['today', 'Hôm nay'], ['week', '7 ngày'], ['month', 'Tháng']].map(([k, l]) => `
        <button class="dashboard-range-btn ${dashTimeRange === k ? 'active' : ''}" onclick="dashSetRange('${k}')" id="dashRange_${k}">${l}</button>`).join('')}
      </div>
      <!-- Auto-refresh countdown -->
      <div class="dashboard-refresh-state">
        <div class="pulse-dot green" style="flex-shrink:0"></div>
        <span style="font-size:12px;color:var(--muted)">Làm mới sau</span>
        <span id="dashCountdown" style="font-size:13px;font-weight:700;font-family:'Roboto Mono',monospace;color:var(--primary)">${dashRefreshCount}s</span>
      </div>
      <button class="btn btn-outline btn-sm" onclick="navigate('dashboard')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Làm mới
      </button>
    </div>
  </div>

  <!-- KPI Grid — PCTT -->
  ${isVisible('kpi') ? `
  <div class="kpi-grid" style="margin-bottom:16px">
    <!-- Card 1: Cảnh báo khẩn -->
    <div class="kpi-card kpi-card-critical kpi-card-urgent" style="--accent-color:var(--danger)">
      <div class="kpi-card-content">
        <div class="kpi-label">Cảnh báo chưa xử lý</div>
        <div class="kpi-value kpi-val-alarms" style="color:var(--danger)">${critAlarms}</div>
        <div class="kpi-sub" style="color:var(--danger)">Yêu cầu xử lý ngay</div>
      </div>
      <div class="kpi-icon icon-danger">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/><path d="M2 8c0-2.2.8-4.2 2.1-5.7M22 8c0-2.2-.8-4.2-2.1-5.7"/></svg>
      </div>
    </div>

    <!-- Card 2: Trạm IoT Online -->
    <div class="kpi-card kpi-card-positive has-sparkline" style="--accent-color:var(--evg-accent)">
      <div class="kpi-card-content">
        <div class="kpi-label">Trạm IoT đang hoạt động</div>
        <div class="kpi-value" id="kpiStations">${onlineStations}/${DATA.stations.length}</div>
        <div class="kpi-sub kpi-status"><span class="kpi-status-dot"></span><strong>${Math.round(onlineStations / DATA.stations.length * 100)}%</strong><span>trạm đang hoạt động</span></div>
      </div>
      <canvas id="spk2" class="kpi-sparkline" width="92" height="34"></canvas>
      <div class="kpi-icon icon-positive">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 17 6-6 4 4 8-9"/><path d="M15 6h6v6"/></svg>
      </div>
    </div>

    <!-- Card 3: Sự cố đang xử lý -->
    <div class="kpi-card has-sparkline" style="--accent-color:var(--primary)">
      <div class="kpi-card-content">
        <div class="kpi-label">Sự cố đang xử lý</div>
        <div class="kpi-value" id="kpiIncidents">${openIncidents}</div>
        <div class="kpi-sub"><span class="kpi-trend-improving">▼ 2</span> so với tuần trước</div>
      </div>
      <canvas id="spk3" class="kpi-sparkline" width="92" height="34"></canvas>
      <div class="kpi-icon icon-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.4 2.4-3-3 2.4-2.4z"/></svg>
      </div>
    </div>

    <!-- Card 4: Chờ phê duyệt -->
    <div class="kpi-card kpi-card-info" style="--accent-color:var(--info)">
      <div class="kpi-card-content">
        <div class="kpi-label">Lệnh chờ phê duyệt</div>
        <div class="kpi-value" id="kpiPending" style="color:var(--info)">${pendingCmds}</div>
        <div class="kpi-sub">Yêu cầu xem xét</div>
      </div>
      <div class="kpi-icon icon-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M8 9h8M8 13h4"/><circle cx="16" cy="16" r="3"/><path d="M16 14.5V16l1 1"/></svg>
      </div>
    </div>

    <!-- Card 5: Hồ chứa báo động -->
    <div class="kpi-card ${critReservoirs > 0 ? 'kpi-card-critical' : 'kpi-card-positive'} has-sparkline" style="--accent-color:var(--info)">
      <div class="kpi-card-content">
        <div class="kpi-label">Hồ chứa báo động</div>
        <div class="kpi-value">${critReservoirs}<span style="font-size:14px;color:var(--muted)">/6</span></div>
        <div class="kpi-sub ${critReservoirs > 0 ? 'kpi-alert-detail' : ''}">hồ vượt BĐ2</div>
      </div>
      <canvas id="spk5" class="kpi-sparkline" width="92" height="34"></canvas>
      <div class="kpi-icon ${critReservoirs > 0 ? 'icon-danger' : 'icon-primary'}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.2 6 11a6 6 0 0 1-12 0c0-4.8 6-11 6-11z"/><path d="M8 15c1.5 1 2.5 1 4 0s2.5-1 4 0"/><path d="M12 8v3"/><path d="M12 13h.01"/></svg>
      </div>
    </div>

    <!-- Card 6: Đê xung yếu -->
    <div class="kpi-card has-sparkline" style="--accent-color:var(--primary)">
      <div class="kpi-card-content">
        <div class="kpi-label">Đê cần theo dõi</div>
        <div class="kpi-value">${DIKE_DATA.filter(d => d.condition !== 'ok').length}<span style="font-size:14px;color:var(--muted)">/${DIKE_DATA.length} tuyến</span></div>
        <div class="kpi-sub"><span class="kpi-alert-count">${critDikes}</span> xung yếu · ${DIKE_DATA.filter(d => d.condition === 'warning').length} cảnh báo</div>
      </div>
      <canvas id="spk6" class="kpi-sparkline" width="92" height="34"></canvas>
      <div class="kpi-icon icon-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 20 7v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z"/><path d="M12 8v5"/><path d="M12 16h.01"/></svg>
      </div>
    </div>
  </div>` : ''}

  <!-- Charts Row -->
  ${isVisible('charts') ? `
  <div class="grid-2" style="margin-bottom:16px">
    <div class="card dashboard-chart-card"><div class="card-header"><span class="card-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>Mực nước các trạm (m)</span>
      <div style="display:flex;gap:4px">
        <span id="chartRangeLabel" style="font-size:11px;color:var(--muted);align-self:center">${dashTimeRange === 'today' ? 'Hôm nay' : dashTimeRange === 'week' ? '7 ngày' : '6 tháng'}</span>
      </div>
    </div>
      <div class="dashboard-chart-legend" id="chartOutputLegend" aria-label="Chú giải mực nước"></div>
      <div class="card-body dashboard-chart-body"><div class="chart-wrap"><canvas id="chartOutput"></canvas></div></div>
    </div>
    <div class="card dashboard-chart-card"><div class="card-header"><span class="card-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C12 2 4 10 4 14a8 8 0 0016 0C20 10 12 2 12 2z"/></svg>Lượng mưa (mm)</span></div>
      <div class="dashboard-chart-legend" id="chartMonthlyLegend" aria-label="Chú giải lượng mưa"></div>
      <div class="card-body dashboard-chart-body"><div class="chart-wrap"><canvas id="chartMonthly"></canvas></div></div>
    </div>
  </div>` : ''}

  <!-- Bottom Row: IoT Stations + Reservoir Levels + Alarms -->
  <div class="dashboard-bottom-grid">
    <!-- Station status -->
    ${isVisible('stations') ? `
    <div class="card"><div class="card-header"><span class="card-title">Trạm Thủy văn / IoT</span></div>
      <div class="card-body" style="padding:8px">
        ${DATA.stations.map(s => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 8px;border-bottom:1px solid var(--border)">
          <div style="display:flex;align-items:center;gap:8px">
            <div class="pulse-dot ${s.status === 'online' ? 'green' : s.status === 'warning' ? 'yellow' : 'red'}"></div>
            <div><div style="font-size:13px;font-weight:500">${s.name}</div><div style="font-size:11px;color:var(--muted)">${s.factory}</div></div>
          </div>
          <div style="text-align:right">
            <div style="font-size:13px;font-family:'Roboto Mono',monospace;color:${s.status === 'offline' ? 'var(--muted)' : s.waterLevel >= s.alertLevel2 ? 'var(--danger)' : s.waterLevel >= s.alertLevel1 ? 'var(--warning)' : 'var(--evg-accent-text)'}">
              ${s.status !== 'offline' ? s.waterLevel + 'm' : '—'}
            </div>
            <div style="font-size:11px;color:var(--muted)">${s.status !== 'offline' ? '🌧 ' + s.rainfall + 'mm' : 'Offline'}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>` : '<div></div>'}

    <!-- Reservoir Levels Chart -->
    ${isVisible('heatmap') ? `
    <div class="card"><div class="card-header"><span class="card-title">Mực nước Hồ chứa</span></div>
      <div class="card-body" style="padding:12px">
        ${RESERVOIR_DATA.map(r => {
          const pct = Math.round((r.currentLevel - r.deadLevel) / (r.designLevel - r.deadLevel) * 100);
          const alertPct = Math.round((r.designLevel * 1.0 - r.deadLevel) / (r.designLevel - r.deadLevel) * 100);
          const barColor = r.status === 'critical' ? 'var(--danger)' : r.status === 'warning' ? 'var(--warning)' : 'var(--evg-accent)';
          return `
          <div style="padding:8px 0;border-bottom:1px solid var(--border)">
            <div style="display:flex;justify-content:space-between;margin-bottom:5px">
              <span style="font-size:12px;font-weight:600">${r.name}</span>
              <span style="font-size:12px;font-family:'Roboto Mono',monospace;color:${barColor}">${r.currentLevel}m <span style="color:var(--muted);font-size:11px">/ ${r.designLevel}m</span></span>
            </div>
            <div style="position:relative;height:8px;background:rgba(255,255,255,.06);border-radius:4px;overflow:hidden">
              <div style="position:absolute;left:0;top:0;height:100%;width:${Math.min(pct, 100)}%;background:${barColor};border-radius:4px;transition:width .6s"></div>
              <div style="position:absolute;top:-2px;height:12px;width:2px;background:var(--danger);left:${alertPct}%;opacity:.7" title="Mức thiết kế"></div>
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:3px">
              <span style="font-size:10px;color:var(--muted)">${r.district}</span>
              <span style="font-size:10px;color:${barColor}">${pct}% dung tích ${r.floods ? '· ⚠ Đang xả lũ' : ''}</span>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>` : '<div></div>'}

    <!-- Recent Alarms -->
    ${isVisible('alarms') ? `
    <div class="card"><div class="card-header"><span class="card-title">Cảnh báo gần đây</span><button class="btn btn-ghost btn-sm" onclick="showAlarms()">Xem tất cả</button></div>
      <div class="card-body">
        <div class="alarm-list">
          ${DATA.alarms.slice(0, 5).map(a => `
          <div class="alarm-item ${a.severity}">
            <div class="alarm-dot ${a.severity}"></div>
            <div class="alarm-msg"><div style="font-size:12px">${a.msg}</div><div class="alarm-time">${a.time} ${a.ack ? '<span style="color:var(--muted)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg></span>' : ''}</div></div>
          </div>`).join('')}
        </div>
      </div>
    </div>` : '<div></div>'}
  </div>

  <!-- Dike Status Panel -->
  ${isVisible('factories') ? `
  <div class="card" style="margin-bottom:16px">
    <div class="card-header">
      <span class="card-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M3 17h18M5 17V9l7-5 7 5v8"/></svg> Tình trạng Đê điều</span>
      <button class="btn btn-ghost btn-sm" onclick="navigate('dikeManagement')">Xem chi tiết</button>
    </div>
    <div style="padding:0 16px 16px">
      ${DIKE_DATA.map(d => {
        const condColor = d.condition === 'critical' ? 'var(--danger)' : d.condition === 'warning' ? 'var(--warning)' : 'var(--evg-accent)';
        const condLabel = d.condition === 'critical' ? 'Xung yếu' : d.condition === 'warning' ? 'Cảnh báo' : 'Đạt tiêu chuẩn';
        const pct = Math.round((d.heightCurrent / d.heightDesign) * 100);
        return `
        <div style="padding:10px 0;border-bottom:1px solid var(--border)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <div>
              <span style="font-size:13px;font-weight:600">${d.name}</span>
              <span style="font-size:11px;color:var(--muted);margin-left:8px">${d.district} · Cấp ${d.grade > 0 ? d.grade : 'HB'}</span>
              ${d.alerts > 0 ? `<span class="badge badge-red" style="margin-left:6px">${d.alerts} cảnh báo</span>` : ''}
            </div>
            <div style="text-align:right">
              <span style="font-family:'Roboto Mono',monospace;font-size:13px;color:${condColor}">${d.heightCurrent}m</span>
              <span style="font-size:11px;color:var(--muted)"> / ${d.heightDesign}m thiết kế</span>
              <span style="font-size:12px;font-weight:700;border:1px solid ${condColor};color:${condColor};padding:1px 8px;border-radius:20px;margin-left:8px">${condLabel}</span>
            </div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${pct}%;background:${condColor};transition:width .6s ease"></div>
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>` : ''}`;
}

window.afterRender_dashboard = function () {
  // Counter animations
  animateCounter('kpiPending', BIZ_STATS.pendingApprovals, '');

  // Sparklines
  function sparkline(id, data, color) {
    const c = document.getElementById(id);
    if (!c) return;
    new Chart(c, {
      type: 'line',
      data: { labels: data.map((_, i) => i), datasets: [{ data, borderColor: color, backgroundColor: hexToRgba(color, .08), borderWidth: 1.5, fill: true, tension: .4, pointRadius: 0 }] },
      options: {
        responsive: false, animation: false, plugins: { legend: { display: false }, tooltip: { enabled: false } },
        layout: { padding: 1 },
        scales: { x: { display: false }, y: { display: false } }
      }
    });
  }
  sparkline('spk2', [7, 7, 8, 8, 7, 8, 6], getThemeColor('--evg-accent', '#2FBF71'));
  sparkline('spk3', [25, 22, 18, 20, 24, 21, 20], getThemeColor('--warning', '#946200'));
  sparkline('spk5', [0, 0, 0, 0, 1, 1, 1], getThemeColor('--danger', '#E14E54'));
  sparkline('spk6', [1, 2, 2, 2, 3, 3, 3], getThemeColor('--warning', '#946200'));

  // Draw charts based on selected range
  drawDashCharts();

  // Inject ticker CSS animation
  if (!document.getElementById('tickerCss')) {
    const s = document.createElement('style');
    s.id = 'tickerCss';
    s.textContent = '@keyframes tickerScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.kpi-card{position:relative;overflow:hidden}';
    document.head.appendChild(s);
    const track = document.getElementById('tickerTrack');
    if (track) track.innerHTML += track.innerHTML;
  }

  // Start auto-refresh countdown
  startDashRefresh();
};

function drawDashCharts() {
  const d = DASH_CHART_DATA[dashTimeRange] || DASH_CHART_DATA.today;
  const palette = getChartPalette();
  const gridColor = hexToRgba(palette.primary, .07);
  // Data-series colors stay independent from the selected brand theme. This
  // prevents a green preset from collapsing every station into one hue.
  const stationColors = ['#30BD6F', '#FF4D57', '#FFC400', '#00D4FF'];
  const stationLineStyles = [
    { borderDash: [], pointStyle: 'circle' },
    { borderDash: [8, 4], pointStyle: 'rect' },
    { borderDash: [3, 3], pointStyle: 'triangle' },
    { borderDash: [12, 4, 3, 4], pointStyle: 'rectRot' }
  ];

  function renderLegend(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.replaceChildren(...items.map(item => {
      const entry = document.createElement('span');
      entry.className = 'dashboard-chart-legend-item';
      const swatch = document.createElement('i');
      swatch.className = 'dashboard-chart-legend-swatch';
      swatch.style.background = item.color;
      const label = document.createElement('span');
      label.textContent = item.label;
      entry.append(swatch, label);
      return entry;
    }));
  }

  renderLegend('chartOutputLegend', d.outputDatasets.map((ds, i) => ({
    label: ds.label,
    color: stationColors[i % stationColors.length]
  })));
  renderLegend('chartMonthlyLegend', [{ label: d.monthlyLabel, color: palette.info }]);

  // Water level line chart
  const ctx1 = document.getElementById('chartOutput');
  if (ctx1) {
    if (ctx1._chartInstance) ctx1._chartInstance.destroy();
    ctx1._chartInstance = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: d.outputLabels,
        datasets: d.outputDatasets.map((ds, i) => ({
          label: ds.label, data: ds.data,
          borderColor: stationColors[i % stationColors.length],
          backgroundColor: hexToRgba(stationColors[i % stationColors.length], 0.08),
          pointBackgroundColor: stationColors[i % stationColors.length],
          pointBorderColor: stationColors[i % stationColors.length],
          borderDash: stationLineStyles[i % stationLineStyles.length].borderDash,
          pointStyle: stationLineStyles[i % stationLineStyles.length].pointStyle,
          fill: false, tension: .4, pointRadius: 3, borderWidth: 2
        }))
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        layout: { padding: { top: 4 } },
        scales: { x: { ticks: { color: palette.textMuted, font: { size: 11 } }, grid: { color: gridColor } }, y: { ticks: { color: palette.textMuted, font: { size: 11 } }, grid: { color: gridColor } } }
      }
    });
  }

  // Rainfall bar chart
  const ctx2 = document.getElementById('chartMonthly');
  if (ctx2) {
    if (ctx2._chartInstance) ctx2._chartInstance.destroy();
    ctx2._chartInstance = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: d.monthlyLabels,
        datasets: [{
          label: d.monthlyLabel,
          data: d.monthlyData,
          backgroundColor: d.monthlyData.map(v => v >= 200 ? hexToRgba(palette.danger, .52) : v >= 100 ? hexToRgba(palette.warning, .45) : hexToRgba(palette.info, .42)),
          borderColor: d.monthlyData.map(v => v >= 200 ? palette.danger : v >= 100 ? palette.warning : palette.info),
          borderWidth: 1.5, borderRadius: 4
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        layout: { padding: { top: 4 } },
        scales: { x: { ticks: { color: palette.textMuted, font: { size: 11 } }, grid: { color: gridColor } }, y: { ticks: { color: palette.textMuted, font: { size: 11 } }, grid: { color: gridColor } } }
      }
    });
  }
}

function dashSetRange(range) {
  dashTimeRange = range;
  navigate('dashboard');
}

// Auto-refresh countdown
function startDashRefresh() {
  if (dashRefreshTimer) clearInterval(dashRefreshTimer);
  dashRefreshCount = 30;
  dashRefreshTimer = setInterval(() => {
    dashRefreshCount--;
    const el = document.getElementById('dashCountdown');
    if (el) el.textContent = dashRefreshCount + 's';
    if (dashRefreshCount <= 0) {
      clearInterval(dashRefreshTimer);
      dashRefreshTimer = null;
      dashRefreshCount = 30;
      startDashRefresh();
      if (localStorage.getItem('hadiwa_dash_toast') === 'true') {
        showToast('<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Dữ liệu PCTT đã được cập nhật!');
      }
    }
  }, 1000);
}

function animateCounter(id, target, suffix) {
  const el = document.getElementById(id);
  if (!el) return;
  let start = 0, dur = 1200, step = 16;
  const inc = target / (dur / step);
  const t = setInterval(() => {
    start = Math.min(start + inc, target);
    el.textContent = Math.floor(start).toLocaleString('vi-VN') + suffix;
    if (start >= target) clearInterval(t);
  }, step);
}
