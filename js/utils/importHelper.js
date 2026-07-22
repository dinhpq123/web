// ── HADIWA IOC — Import Helper Utility v6.1 ──────────────────────
// Shared Excel/CSV import flow: Template → Upload → AI Validate → Confirm → Apply

// ─────────────────────────────────────────────────────────────────
// 1. DOWNLOAD CSV TEMPLATE
// ─────────────────────────────────────────────────────────────────
window.downloadImportTemplate = function(filename, headers, sampleRows) {
  // Build a proper Excel-compatible HTML table (no 3rd party library needed).
  // Excel opens .xls HTML files natively with full column/row structure.
  const xlsFilename = filename.replace(/\.csv$/i, '.xls');

  const headerCells = headers.map(h =>
    `<th style="background:#1a56b0;color:#fff;font-weight:bold;padding:7px 10px;border:1px solid #1040a0;white-space:nowrap;font-size:12px">${h}</th>`
  ).join('');

  const dataRows = sampleRows.map((row, ri) => {
    const bg = ri % 2 === 0 ? '#f0f6ff' : '#ffffff';
    const cells = headers.map((_, ci) => {
      const val = (row[ci] !== undefined && row[ci] !== null) ? String(row[ci]) : '';
      return `<td style="padding:6px 10px;border:1px solid #c8d8ee;background:${bg};font-size:11px">${val}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  const html = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="ProgId" content="Excel.Sheet">
  <title>HADIWA IOC — Template Nhập liệu</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; }
    .header-note { color: #555; font-size: 11px; margin-bottom: 10px; background: #fffbe6; border-left: 4px solid #f5a623; padding: 8px 12px; }
    table { border-collapse: collapse; width: 100%; }
  </style>
</head>
<body>
  <p class="header-note">
    ⚠️ <b>HADIWA IOC — Chi cục Thủy lợi &amp; PCTT Hà Nội</b><br>
    Hướng dẫn: Điền dữ liệu vào các hàng bên dưới hàng tiêu đề màu xanh. Không xóa hoặc đổi thứ tự cột.<br>
    Sau khi điền xong, lưu file rồi upload lên hệ thống để import.
  </p>
  <table>
    <thead><tr>${headerCells}</tr></thead>
    <tbody>${dataRows}</tbody>
  </table>
</body>
</html>`;

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = xlsFilename;
  a.click();
  URL.revokeObjectURL(url);
  if (typeof showToast === 'function') showToast(`📥 Đã tải template Excel: ${xlsFilename}`);
};


// ─────────────────────────────────────────────────────────────────
// 2. TRIGGER FILE PICKER
// ─────────────────────────────────────────────────────────────────
window.triggerImportFilePicker = function(onFileReady) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv,.xlsx,.xls';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext)) {
      showToast('⚠ Chỉ hỗ trợ file CSV hoặc Excel (.xlsx/.xls)!');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      // Strip BOM if present
      const content = text.replace(/^\uFEFF/, '');
      const parsed = _parseCSV(content);
      onFileReady(file.name, parsed);
    };
    reader.readAsText(file, 'UTF-8');
  };
  input.click();
};

// ─────────────────────────────────────────────────────────────────
// 3. PARSE CSV → Array of row arrays (skip comment lines starting with #)
// ─────────────────────────────────────────────────────────────────
function _parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim() && !l.trim().startsWith('#'));
  return lines.map(line => {
    const row = [];
    let inQ = false, cell = '';
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i+1] === '"') { cell += '"'; i++; }
        else { inQ = !inQ; }
      } else if (ch === ',' && !inQ) {
        row.push(cell.trim()); cell = '';
      } else {
        cell += ch;
      }
    }
    row.push(cell.trim());
    return row;
  });
}

// ─────────────────────────────────────────────────────────────────
// 4. AI VALIDATE + CONFIRM MODAL
// ─────────────────────────────────────────────────────────────────
// config = {
//   title: string,
//   fileName: string,
//   headers: string[],          // expected headers to match
//   rows: string[][],           // parsed data rows (after header row)
//   validators: function[],     // per-column validators, return error string or null
//   displayCols: string[],      // subset of headers to show in preview
//   onConfirm: function(rows),  // called with cleaned rows if user confirms
// }
window.showImportConfirmModal = function(config) {
  const { title, fileName, headers, rows, validators, displayCols, onConfirm } = config;

  // Run AI validation
  const validationResults = rows.map((row, ri) => {
    const errors = [];
    validators.forEach((validate, ci) => {
      if (validate) {
        const err = validate(row[ci], row, ri);
        if (err) errors.push(`Cột "${headers[ci]}": ${err}`);
      }
    });
    return errors;
  });

  const errorCount = validationResults.filter(e => e.length > 0).length;
  const validCount = rows.length - errorCount;
  const showCols = displayCols || headers.slice(0, 6);

  const tableHeaders = showCols.map(h => `<th style="white-space:nowrap">${h}</th>`).join('');
  const tableRows = rows.map((row, ri) => {
    const errs = validationResults[ri];
    const hasErr = errs.length > 0;
    const cells = showCols.map(h => {
      const ci = headers.indexOf(h);
      const val = ci>=0 ? (row[ci]||'—') : '—';
      return `<td style="font-size:11px;${hasErr?'color:var(--yellow)':''}">${val}</td>`;
    }).join('');
    return `<tr style="border-bottom:1px solid rgba(255,255,255,.05);background:${hasErr?'rgba(255,202,40,.06)':'transparent'}">
      <td style="font-size:11px;color:var(--muted);text-align:center">${ri+1}</td>
      ${cells}
      <td style="max-width:200px">
        ${hasErr
          ? `<span style="font-size:10px;color:var(--yellow)">${errs.join('; ')}</span>`
          : `<span class="badge badge-green" style="font-size:9px">OK</span>`}
      </td>
    </tr>`;
  }).join('');

  openModal(`
  <div class="modal-header">
    <span class="modal-title" style="display:flex;align-items:center;gap:8px">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      AI Kiểm tra dữ liệu — ${title}
    </span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body" style="max-height:68vh;overflow-y:auto">

    <!-- File + summary -->
    <div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.2);border-radius:10px;margin-bottom:14px">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      <div style="flex:1">
        <div style="font-size:12px;font-weight:700;color:var(--text)">${fileName}</div>
        <div style="font-size:11px;color:var(--muted);margin-top:2px">${rows.length} hàng dữ liệu được tìm thấy</div>
      </div>
      <div style="display:flex;gap:10px">
        <div style="text-align:center;padding:8px 16px;background:rgba(0,230,118,.1);border:1px solid rgba(0,230,118,.25);border-radius:8px">
          <div style="font-size:20px;font-weight:800;color:var(--green)">${validCount}</div>
          <div style="font-size:10px;color:var(--muted)">Hợp lệ</div>
        </div>
        <div style="text-align:center;padding:8px 16px;background:rgba(255,202,40,.08);border:1px solid rgba(255,202,40,.25);border-radius:8px">
          <div style="font-size:20px;font-weight:800;color:var(--yellow)">${errorCount}</div>
          <div style="font-size:10px;color:var(--muted)">Lỗi</div>
        </div>
      </div>
    </div>

    <!-- AI analysis -->
    <div style="padding:10px 14px;background:rgba(139,92,246,.05);border-left:3px solid #7c3aed;border-radius:0 8px 8px 0;margin-bottom:14px;font-size:12px;color:rgba(255,255,255,.7)">
      ${errorCount===0
        ? `<strong style="color:var(--green)">&#x2705; AI xác nhận:</strong> Toàn bộ ${rows.length} hàng dữ liệu hợp lệ. Có thể nhập vào hệ thống.`
        : `<strong style="color:var(--yellow)">&#x26a0; AI phát hiện ${errorCount} hàng có lỗi.</strong> Bạn có thể nhập ${validCount} hàng hợp lệ hoặc sửa file và upload lại.`
      }
    </div>

    <!-- Preview table -->
    <div style="font-size:12px;font-weight:700;margin-bottom:8px">Xem trước dữ liệu (${rows.length} hàng):</div>
    <div style="overflow-x:auto;border:1px solid var(--border);border-radius:8px">
      <table style="width:100%;border-collapse:collapse;min-width:700px">
        <thead>
          <tr style="background:rgba(255,255,255,.04)">
            <th style="padding:8px 10px;font-size:11px;width:36px">#</th>
            ${tableHeaders}
            <th style="padding:8px 10px;font-size:11px;min-width:120px">Kết quả AI</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    ${errorCount > 0 && validCount > 0
      ? `<button class="btn btn-outline" onclick="_importOnlyValid()">Nhập ${validCount} hàng hợp lệ</button>`
      : ''}
    <button class="btn btn-primary" onclick="_confirmImport()" ${errorCount > 0 && validCount === 0 ? 'disabled' : ''}>
      ${errorCount === 0 ? `&#x2705; Xác nhận nhập ${rows.length} hàng` : `Nhập ${validCount}/${rows.length} hàng hợp lệ`}
    </button>
  </div>`, { width: '92vw' });


  // Store callback for confirm button
  window._pendingImportRows = rows;
  window._pendingImportValidation = validationResults;
  window._pendingImportOnConfirm = onConfirm;
};

window._confirmImport = function() {
  const allRows = window._pendingImportRows || [];
  const validation = window._pendingImportValidation || [];
  const validRows = allRows.filter((_, i) => validation[i]?.length === 0);
  if (window._pendingImportOnConfirm) {
    window._pendingImportOnConfirm(validRows.length > 0 ? validRows : allRows);
  }
  closeModal();
};

window._importOnlyValid = function() {
  const allRows = window._pendingImportRows || [];
  const validation = window._pendingImportValidation || [];
  const validRows = allRows.filter((_, i) => validation[i]?.length === 0);
  if (window._pendingImportOnConfirm) window._pendingImportOnConfirm(validRows);
  closeModal();
};

// ─────────────────────────────────────────────────────────────────
// 5. COMMON VALIDATORS
// ─────────────────────────────────────────────────────────────────
window.IV = {
  // Required non-empty string
  required: (v) => (!v || v.trim() === '' || v.trim() === '—') ? 'Ô bắt buộc không được để trống' : null,

  // Numeric in range [min, max]
  numRange: (min, max) => (v) => {
    const n = parseFloat(v);
    if (isNaN(n)) return `Phải là số`;
    if (min !== undefined && n < min) return `Phải ≥ ${min}`;
    if (max !== undefined && n > max) return `Phải ≤ ${max}`;
    return null;
  },

  // One of allowed values
  oneOf: (...opts) => (v) =>
    opts.includes(v?.trim()) ? null : `Phải là một trong: ${opts.join(', ')}`,

  // Valid date DD/MM/YYYY
  date: (v) => {
    if (!v) return 'Phải nhập ngày';
    const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return 'Định dạng ngày: DD/MM/YYYY';
    return null;
  },

  // No-op
  any: () => null,
};
