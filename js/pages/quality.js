// ── WATER QUALITY PAGE ────────────────────────────────────────────
function renderQuality() {
  const L = DATA.qualityLimits;
  function ck(val, min, max) {
    if (val === undefined) return 'ok';
    if (min !== undefined && val < min) return 'low';
    if (max !== undefined && val > max) return 'high';
    return 'ok';
  }
  function cell(val, min, max, decs = 2) {
    const s = ck(val, min, max);
    const c = s === 'ok' ? 'var(--success)' : 'var(--danger)';
    return `<td class="mono" style="color:${c}">${val.toFixed(decs)} ${s !== 'ok' ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' : ''}</td>`;
  }

  return `
  <div class="page-header">
    <div class="page-title"><h1>Chất lượng nước</h1><p>Theo chuẩn QCVN 01-1:2024/BYT</p></div>
    <div class="page-actions">
      <button class="btn btn-primary" onclick="openAddQuality()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Nhập chỉ số mới
      </button>
    </div>
  </div>

  ${renderQualityMonitoringGrid(L)}

  <!-- Limits reference -->
  <div class="card" style="margin-bottom:16px">
    <div class="card-header"><span class="card-title">Giới hạn QCVN 01-1:2024/BYT</span></div>
    <div class="card-body" style="padding:12px">
      <div style="display:flex;flex-wrap:wrap;gap:10px">
        ${[
      ['pH', '6.5 – 8.5', ''],
      ['Clo dư', '0.1 – 0.5 mg/L', ''],
      ['Độ đục', '≤ 2.0 NTU', ''],
      ['TDS', '≤ 500 mg/L', ''],
      ['Arsenic', '≤ 0.01 mg/L', ''],
      ['Coliform', '= 0 CFU/100mL', '']
    ].map(([k, v]) => `
        <div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:8px;padding:10px 14px;min-width:130px">
          <div style="font-size:11px;color:var(--muted)">${k}</div>
          <div style="font-size:13px;font-weight:600;color:var(--primary)">${v}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- Data table -->
  <div class="card">
    <div class="card-header"><span class="card-title">Kết quả kiểm nghiệm mới nhất</span></div>
    <div class="table-wrap">
      <table>
        <thead><tr>
          <th>Nhà máy</th><th>pH</th><th>Clo dư (mg/L)</th>
          <th>Độ đục (NTU)</th><th>TDS (mg/L)</th><th>Arsenic (mg/L)</th>
          <th>Coliform</th><th>Thời gian</th><th>Đánh giá</th>
        </tr></thead>
        <tbody>
          ${DATA.waterQuality.map(q => {
      const pHok = ck(q.pH, L.pH.min, L.pH.max) === 'ok';
      const Clok = ck(q.chlorine, L.chlorine.min, L.chlorine.max) === 'ok';
      const Tok = ck(q.turbidity, undefined, L.turbidity.max) === 'ok';
      const TDSok = ck(q.TDS, undefined, L.TDS.max) === 'ok';
      const Aok = ck(q.arsenic, undefined, L.arsenic.max) === 'ok';
      const overall = pHok && Clok && Tok && TDSok && Aok;
      return `<tr>
              <td style="font-weight:600">${q.factory}</td>
              ${cell(q.pH, L.pH.min, L.pH.max, 1)}
              ${cell(q.chlorine, L.chlorine.min, L.chlorine.max, 2)}
              ${cell(q.turbidity, undefined, L.turbidity.max, 1)}
              ${cell(q.TDS, undefined, L.TDS.max, 0)}
              ${cell(q.arsenic, undefined, L.arsenic.max, 3)}
              <td class="mono" style="color:${q.coliform === 0 ? 'var(--success)' : 'var(--danger)'}">${q.coliform === 0 ? '0 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg>' : 'Phát hiện <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'}</td>
              <td style="font-size:12px;color:var(--muted)">${q.time}</td>
              <td>${overall ? '<span class="badge badge-green">Đạt chuẩn</span>' : '<span class="badge badge-red">Vượt ngưỡng</span>'}</td>
            </tr>`;
    }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function openAddQuality() {
  openModal(`
  <div class="modal-header"><span class="modal-title">Nhập chỉ số chất lượng nước</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
  <div class="modal-body">
    <div class="form-row">
      <div class="form-group"><label class="form-label">Nhà máy</label>
        <select class="form-control">${DATA.factories.map(f => `<option>${f.name}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label class="form-label">Thời gian lấy mẫu</label>
        <input class="form-control" type="datetime-local"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">pH</label><input class="form-control" type="number" step="0.1" min="0" max="14" placeholder="7.0"></div>
      <div class="form-group"><label class="form-label">Clo dư (mg/L)</label><input class="form-control" type="number" step="0.01" placeholder="0.30"></div>
      <div class="form-group"><label class="form-label">Độ đục (NTU)</label><input class="form-control" type="number" step="0.1" placeholder="1.5"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">TDS (mg/L)</label><input class="form-control" type="number" placeholder="150"></div>
      <div class="form-group"><label class="form-label">Arsenic (mg/L)</label><input class="form-control" type="number" step="0.001" placeholder="0.002"></div>
      <div class="form-group"><label class="form-label">Coliform (CFU/100mL)</label><input class="form-control" type="number" placeholder="0"></div>
    </div>
    <div class="form-group"><label class="form-label">Người lấy mẫu</label>
      <select class="form-control">${DATA.employees.map(e => `<option>${e.name}</option>`).join('')}</select>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('Đã lưu chỉ số chất lượng nước!')">Lưu kết quả</button>
  </div>`);
}
function renderQualityMonitoringGrid(L) {
  return `
    <div class="grid-auto" style="margin-bottom:16px">
    ${DATA.waterQuality.map(q => {
    const pHok = ckLocal(q.pH, L.pH.min, L.pH.max) === 'ok';
    const Clok = ckLocal(q.chlorine, L.chlorine.min, L.chlorine.max) === 'ok';
    const Tok = ckLocal(q.turbidity, undefined, L.turbidity.max) === 'ok';
    const TDSok = ckLocal(q.TDS, undefined, L.TDS.max) === 'ok';
    const Colok = q.coliform === 0;
    const overall = pHok && Clok && Tok && TDSok && Colok;

    const cardStyle = !overall ? 'border:1px solid rgba(255,71,87,0.4); background:rgba(255,71,87,0.05); animation: alertPulse 2s infinite' : '';
    const badgeCls = overall ? 'badge-green' : 'badge-red';
    const statusLabel = overall ? 'ĐẠT CHUẨN' : 'CẢNH BÁO';

    return `
        <div class="card" style="padding:16px; position:relative; overflow:hidden; ${cardStyle}">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px">
                <div>
                   <div style="font-size:14px; font-weight:700; color:var(--text)">${q.factory}</div>
                   <div style="font-size:10px; color:var(--muted); margin-top:2px">${q.time}</div>
                </div>
                <span class="badge ${badgeCls}" style="font-size:10px">${statusLabel}</span>
            </div>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px">
                <div style="background:var(--bg-card); border-radius:6px; padding:8px; border:1px solid var(--border)">
                    <div style="font-size:10px; color:var(--muted); margin-bottom:2px">pH</div>
                    <div style="font-size:14px; font-weight:700; font-family:'Roboto Mono',monospace; color:${pHok ? 'var(--success)' : 'var(--danger)'}">${q.pH.toFixed(1)}</div>
                </div>
                <div style="background:var(--bg-card); border-radius:6px; padding:8px; border:1px solid var(--border)">
                    <div style="font-size:10px; color:var(--muted); margin-bottom:2px">Clo dư</div>
                    <div style="font-size:14px; font-weight:700; font-family:'Roboto Mono',monospace; color:${Clok ? 'var(--success)' : 'var(--danger)'}">${q.chlorine.toFixed(2)} <span style="font-size:9px; font-weight:400">mg/L</span></div>
                </div>
                <div style="background:var(--bg-card); border-radius:6px; padding:8px; border:1px solid var(--border)">
                    <div style="font-size:10px; color:var(--muted); margin-bottom:2px">Độ đục</div>
                    <div style="font-size:14px; font-weight:700; font-family:'Roboto Mono',monospace; color:${Tok ? 'var(--success)' : 'var(--danger)'}">${q.turbidity.toFixed(1)} <span style="font-size:9px; font-weight:400">NTU</span></div>
                </div>
                <div style="background:var(--bg-card); border-radius:6px; padding:8px; border:1px solid var(--border)">
                    <div style="font-size:10px; color:var(--muted); margin-bottom:2px">TDS</div>
                    <div style="font-size:14px; font-weight:700; font-family:'Roboto Mono',monospace; color:${TDSok ? 'var(--success)' : 'var(--danger)'}">${q.TDS} <span style="font-size:9px; font-weight:400">mg/L</span></div>
                </div>
            </div>
            
            ${!overall ? `
            <div style="position:absolute; bottom:-10px; right:-10px; opacity:0.1; color:var(--danger)">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>` : ''}
        </div>`;
  }).join('')}
    </div>
    <style>
        @keyframes alertPulse {
            0% { border-color: rgba(255,71,87,0.4); box-shadow: 0 0 0 0 rgba(255,71,87,0.2); }
            50% { border-color: rgba(255,71,87,0.8); box-shadow: 0 0 10px 2px rgba(255,71,87,0.3); }
            100% { border-color: rgba(255,71,87,0.4); box-shadow: 0 0 0 0 rgba(255,71,87,0.2); }
        }
    </style>`;
}

function ckLocal(val, min, max) {
  if (val === undefined) return 'ok';
  if (min !== undefined && val < min) return 'low';
  if (max !== undefined && val > max) return 'high';
  return 'ok';
}
