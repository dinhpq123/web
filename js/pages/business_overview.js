/**
 * Business Overview Dashboard Page
 */

function renderBusinessOverview() {
  const stats = [
    { label: 'Doanh thu tháng', value: '59.95 tỉ', unit: 'VND', trend: '+5.2%', data: BIZ_STATS.revenueTrend, color: 'var(--primary)' },
    { label: 'Sản lượng tiêu thụ', value: '5.45M', unit: 'm³', trend: '+1.8%', data: BIZ_STATS.consumptionTrend, color: 'var(--primary)' },
    { label: 'Khách hàng mới', value: '+350', unit: 'KH', trend: '+12%', data: BIZ_STATS.customersTrend, color: 'var(--info)' },
    { label: 'Tỷ lệ thu tiền', value: '94%', unit: '%', trend: '+0.5%', data: BIZ_STATS.collectionTrend, color: 'var(--primary)' },
    { label: 'Nợ khó đòi', value: '2.45 tỉ', unit: 'VND', trend: '-15%', data: BIZ_STATS.debtTrend, color: 'var(--danger)' },
    { label: 'Yêu cầu hỗ trợ', value: '4,870', unit: 'Cuộc', trend: '+3.5%', data: BIZ_STATS.callsTrend, color: 'var(--info)' },
  ];

  const kpiCards = stats.map(s => `
    <div class="kpi-card" onclick="navigate('business_history')" style="cursor:pointer">
      <div class="kpi-content">
        <div class="kpi-label">${s.label}</div>
        <div class="kpi-value-wrap">
          <span class="kpi-value">${s.value}</span>
          <span class="kpi-unit">${s.unit}</span>
        </div>
        <div class="kpi-trend ${s.trend.startsWith('+') ? 'up' : 'down'}">
          ${s.trend.startsWith('+') ? '↑' : '↓'} ${s.trend} <span style="color:var(--muted);font-weight:400;margin-left:4px">vs tháng trước</span>
        </div>
      </div>
      <div class="kpi-chart-mini">
        ${generateSparkline(s.data, s.color)}
      </div>
    </div>
  `).join('');

  return `
    <div class="page-header">
      <div class="page-title">
        <h1>Tổng quan Kinh doanh</h1>
        <p>Thống kê hiệu quả kinh doanh toàn hệ thống Hadiwa</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-ghost" onclick="showToast('Đang tạo báo cáo...')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Xuất báo cáo
        </button>
      </div>
    </div>

    <div class="kpi-grid" style="margin-bottom:24px">
      ${kpiCards}
    </div>

    <div class="grid-2">
      <!-- Main Trend Chart -->
      <div class="card glass">
        <div class="card-header">
          <span class="card-title">Xu hướng Doanh thu & Sản lượng</span>
          <div class="card-actions">
            <select class="form-control form-control-sm" style="width:120px">
              <option>6 tháng gần nhất</option>
              <option>Năm nay</option>
            </select>
          </div>
        </div>
        <div class="card-body">
          <canvas id="bizOverviewTrendChart" style="height:320px; width:100%"></canvas>
        </div>
      </div>

      <!-- Factory Comparison -->
      <div class="card glass">
        <div class="card-header">
          <span class="card-title">Doanh thu & Sản lượng theo Nhà máy</span>
        </div>
        <div class="card-body">
          <canvas id="bizFactoryRankChart" style="height:320px; width:100%"></canvas>
        </div>
      </div>
    </div>

    <div class="grid-3" style="margin-top:24px">
      <!-- Customer Type Dist -->
      <div class="card glass">
        <div class="card-header">
          <span class="card-title">Cơ cấu Khách hàng</span>
        </div>
        <div class="card-body" style="display:flex; flex-direction:column; align-items:center">
          <div style="width:180px; height:180px; margin-bottom:20px">
            <canvas id="customerTypeChart"></canvas>
          </div>
          <div class="dist-list" style="width:100%">
            ${BIZ_OVERVIEW_DATA.customerTypeDist.map(d => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid rgba(255,255,255,.05)">
                <div style="display:flex; align-items:center; gap:8px; font-size:13px">
                  <span style="width:8px; height:8px; border-radius:50%; background:${d.color}"></span>
                  ${d.type}
                </div>
                <div style="font-weight:600; font-size:13px">${formatNum(d.count)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Quick Actions / Links -->
      <div class="card glass" style="grid-column: span 2">
        <div class="card-header">
          <span class="card-title">Dữ liệu gần đây & Lối tắt</span>
          <button class="btn btn-ghost btn-sm" onclick="navigate('business_history')">Xem tất cả</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Khu vực / Nhà máy</th>
                <th>Doanh thu</th>
                <th>Sản lượng</th>
                <th>Khách hàng mới</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              ${BIZ_OVERVIEW_DATA.historyData.slice(0, 7).map(d => `
                <tr>
                  <td class="mono" style="font-size:12px">${d.date}</td>
                  <td style="font-weight:600">${d.factory}</td>
                  <td class="mono">${formatNum(d.revenue / 1000000)} Tr</td>
                  <td class="mono">${formatNum(d.consumption)} m³</td>
                  <td style="color:var(--primary)">+${d.newCustomers}</td>
                  <td>${statusBadge(d.status)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

/**
 * Charts Initialization
 */
function afterRender_business_overview() {
  initBizTrendChart();
  initBizFactoryRankChart();
  initCustomerTypeChart();
}

function initBizTrendChart() {
  const ctx = document.getElementById('bizOverviewTrendChart');
  if (!ctx) return;

  const data = BIZ_OVERVIEW_DATA.consumptionTrendMonthly;
  const palette = getChartPalette();

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'Doanh thu (Triệu VND)',
          data: data.revenue,
          borderColor: palette.cyan,
          backgroundColor: hexToRgba(palette.cyan, 0.1),
          fill: true,
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Sản lượng (Triệu m³)',
          data: data.consumption.map(v => v * 10), // Scale for visual
          borderColor: palette.success,
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { color: palette.textMuted, font: { size: 11 } } }
      },
      scales: {
        y: {
          ticks: { color: palette.textMuted },
          grid: { color: palette.gridLine }
        },
        y1: {
          position: 'right',
          ticks: { color: palette.textMuted, callback: v => (v / 10) + 'M' },
          grid: { display: false }
        },
        x: {
          ticks: { color: palette.textMuted },
          grid: { display: false }
        }
      }
    }
  });
}

function initBizFactoryRankChart() {
  const ctx = document.getElementById('bizFactoryRankChart');
  if (!ctx) return;

  const data = BIZ_OVERVIEW_DATA.revenueByFactory;
  const revenues = data.map(d => +(d.revenue / 1e9).toFixed(2));
  const outputs = data.map(d => Math.round((d.revenue / 1e9) * 28.5 + (Math.random() * 20 - 10)));
  const palette = getChartPalette();

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.name),
      datasets: [
        {
          label: 'Doanh thu (Tỷ VND)',
          data: revenues,
          backgroundColor: hexToRgba(palette.cyan, 0.65),
          borderColor: hexToRgba(palette.cyan, 0.9),
          borderWidth: 1,
          borderRadius: 4,
          xAxisID: 'xRevenue'
        },
        {
          label: 'Sản lượng (Ngàn m³)',
          data: outputs,
          backgroundColor: 'var(--success-soft)',
          borderColor: 'var(--success-soft)',
          borderWidth: 1,
          borderRadius: 4,
          xAxisID: 'xOutput'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: true,
          position: 'right',
          labels: { color: palette.textMuted, font: { size: 11 }, boxWidth: 12, padding: 16 }
        },
        tooltip: {
          enabled: false,
          external: function(context) {
            const FACTORY_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;margin-right:5px"><path d="M2 20V9l4-2 4 2V5l4-2 4 2v15h2v2H0v-2h2zm2-1h2v-2H4v2zm0-4h2v-2H4v2zm0-4h2V9H4v2zm4 8h2v-2H8v2zm0-4h2v-2H8v2zm0-4h2v-2H8v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V5h-2v2z"/></svg>';
            let el = document.getElementById('bizFactoryTooltip');
            const {chart, tooltip} = context;
            if (tooltip.opacity === 0) { if (el) el.style.opacity = '0'; return; }
            if (!el) {
              el = document.createElement('div');
              el.id = 'bizFactoryTooltip';
              el.style.cssText = 'position:absolute;pointer-events:none;transition:opacity .15s ease;z-index:200;padding:10px 14px;border-radius:10px;background:rgba(15,25,45,.95);border:1px solid rgba(0,200,255,.25);box-shadow:0 8px 24px rgba(0,0,0,.5);font-size:12px;min-width:210px;backdrop-filter:blur(8px)';
              document.body.appendChild(el);
            }
            const items = tooltip.dataPoints || [];
            const label = items[0]?.label || '';
            const rows = items.map(p => {
              const isRev = p.dataset.xAxisID === 'xRevenue';
              const color = isRev ? palette.cyan : palette.success;
              const val   = isRev ? `${p.parsed.x} Tỷ VND` : `${p.parsed.x.toLocaleString()} Ngàn m³`;
              const name  = isRev ? 'Doanh thu' : 'Sản lượng';
              return '<div style="display:flex;align-items:center;gap:8px;margin-top:6px">'
                + '<span style="width:8px;height:8px;border-radius:50%;background:' + color + ';flex-shrink:0"></span>'
                + '<span style="color:' + palette.textMuted + '">' + name + ':</span>'
                + '<span style="color:' + color + ';font-weight:700;margin-left:auto;padding-left:12px">' + val + '</span>'
                + '</div>';
            }).join('');
            el.innerHTML = '<div style="display:flex;align-items:center;font-weight:700;font-size:13px;color:' + palette.cyan + ';border-bottom:1px solid ' + hexToRgba(palette.cyan, .15) + ';padding-bottom:7px;margin-bottom:2px">'
              + FACTORY_SVG + label + '</div>' + rows;
            const pos = chart.canvas.getBoundingClientRect();
            el.style.opacity = '1';
            el.style.left = (pos.left + window.scrollX + tooltip.caretX + 14) + 'px';
            el.style.top  = (pos.top  + window.scrollY + tooltip.caretY - 10) + 'px';
          }
        }
      },
      interaction: {
        mode: 'index',
        axis: 'y',
        intersect: false
      },
      scales: {
        y: {
          ticks: { color: palette.textMuted, font: { size: 11 } },
          grid: { display: false }
        },
        xRevenue: {
          position: 'top',
          ticks: {
            color: palette.cyan,
            font: { size: 10 },
            callback: v => v + ' Tỷ'
          },
          grid: { color: hexToRgba(palette.cyan, 0.06) },
          title: {
            display: true,
            text: 'Doanh thu (Tỷ VND)',
            color: palette.cyan,
            font: { size: 10, weight: '600' }
          }
        },
        xOutput: {
          position: 'bottom',
          ticks: {
            color: palette.success,
            font: { size: 10 },
            callback: v => v + 'K'
          },
          grid: { color: hexToRgba(palette.success, 0.08) },
          title: {
            display: true,
            text: 'Sản lượng (Ngàn m³)',
            color: palette.success,
            font: { size: 10, weight: '600' }
          }
        }
      }
    }
  });
}

function initCustomerTypeChart() {
  const ctx = document.getElementById('customerTypeChart');
  if (!ctx) return;

  const data = BIZ_OVERVIEW_DATA.customerTypeDist;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.type),
      datasets: [{
        data: data.map(d => d.count),
        backgroundColor: data.map(d => d.color),
        borderWidth: 0,
        hoverOffset: 10
      }]
    },
    options: {
      cutout: '70%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  });
}
