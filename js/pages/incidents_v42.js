// ── HADIWA IOC — Incidents v4.2 Supplement ─────────────────────────
// Adds: SLA tracking, 7-step workflow detail modal, digital field
// report generator, check-in/out, escalation logic.
// Loaded AFTER incidents.js — extends existing functions.

// ── SLA Config (minutes) by severity ──────────────────────────────
const INC_SLA = {
  critical: 60,   // 1 hour
  high:     240,  // 4 hours
  medium:   1440, // 24 hours
  low:      4320, // 3 days
};

// 7-step workflow steps
const INC_STEPS = [
  { id: 'receive',   label: 'Tiếp nhận',      icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22,6L12,13,2,6' },
  { id: 'verify',    label: 'Xác minh',        icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' },
  { id: 'classify',  label: 'Phân loại',       icon: 'M3 6l9-4 9 4v6c0 5.5-3.8 10.7-9 12-5.2-1.3-9-6.5-9-12V6z' },
  { id: 'assign',    label: 'Giao xử lý',      icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' },
  { id: 'update',    label: 'Cập nhật',        icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' },
  { id: 'accept',    label: 'Nghiệm thu',      icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3' },
  { id: 'report',    label: 'Báo cáo',         icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14,2v6h6 M16,13H8 M16,17H8 M10,9H8' },
];

const STEP_STATUS = {
  receive:  { new:'done', processing:'done', done:'done' },
  verify:   { new:'pending', processing:'done', done:'done' },
  classify: { new:'pending', processing:'done', done:'done' },
  assign:   { new:'pending', processing:'in-progress', done:'done' },
  update:   { new:'pending', processing:'in-progress', done:'done' },
  accept:   { new:'pending', processing:'pending', done:'done' },
  report:   { new:'pending', processing:'pending', done:'done' },
};

// ── Extended incident data for detailed view ───────────────────────
const INC_DETAILS = {
  'INC-001': {
    checkins: [{ user:'Nguyễn Văn A', time:'2026-03-12 08:15', lat:21.02, lng:105.84, note:'Có mặt tại hiện trường' }],
    materials: [{ name:'Đất đắp', qty:15, unit:'m³' }, { name:'Cừ thép', qty:20, unit:'cây' }],
    field_note: 'Điểm sạt nhỏ tại K+250, mái thượng lưu, chiều dài ~8m, sâu 0.5m.',
  },
};

// ── Helper: compute SLA info ───────────────────────────────────────
function incSlaInfo(inc) {
  const sla = INC_SLA[inc.severity] || INC_SLA.medium;
  const start = new Date(inc.report.replace(' ', 'T'));
  const now   = new Date();
  const elapsed = (now - start) / 60000; // minutes elapsed
  const pct = Math.min(100, Math.round((elapsed / sla) * 100));
  const remaining = Math.max(0, sla - elapsed);
  const overdue = elapsed > sla && inc.status !== 'done';
  return { sla, elapsed, remaining, pct, overdue };
}

function incSlaBar(inc) {
  const s = incSlaInfo(inc);
  const color = s.overdue ? '#ef4444' : s.pct >= 80 ? '#f59e0b' : '#10b981';
  const label = s.overdue
    ? `Quá hạn ${Math.round(s.elapsed - s.sla)}ph`
    : `Còn ${Math.round(s.remaining / 60)}h${Math.round(s.remaining % 60)}ph`;
  return `
    <div style="margin-top:5px">
      <div style="display:flex;justify-content:space-between;font-size:9px;color:rgba(255,255,255,.38);margin-bottom:2px">
        <span>SLA: ${s.sla/60}h</span>
        <span style="color:${color};font-weight:700">${label}</span>
      </div>
      <div style="height:3px;background:rgba(255,255,255,.08);border-radius:2px">
        <div style="height:100%;width:${s.pct}%;background:${color};border-radius:2px;transition:width .3s"></div>
      </div>
    </div>`;
}

// ── Detail Modal: 7-step workflow view ─────────────────────────────
function incOpenDetail(id) {
  const inc = DATA.incidents.find(i => i.id === id);
  if (!inc) return;
  const extra = INC_DETAILS[id] || { checkins:[], materials:[], field_note:'' };
  const sla = incSlaInfo(inc);

  const stepHtml = INC_STEPS.map((step, i) => {
    const status = STEP_STATUS[step.id]?.[inc.status] || 'pending';
    const color = status === 'done' ? '#10b981' : status === 'in-progress' ? '#f59e0b' : '#374151';
    return `
    <div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;${i < INC_STEPS.length-1?'border-bottom:1px solid rgba(255,255,255,.05)':''}">
      <div style="width:28px;height:28px;border-radius:50%;border:2px solid ${color};display:flex;align-items:center;justify-content:center;flex-shrink:0;background:${color}20">
        ${status === 'done'
          ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
          : status === 'in-progress'
          ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
          : `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`}
      </div>
      <div style="flex:1">
        <div style="font-size:12px;font-weight:700;color:${status==='pending'?'rgba(255,255,255,.35)':'#fff'}">${i+1}. ${step.label}</div>
        ${status === 'in-progress' ? '<div style="font-size:10px;color:#f59e0b">Đang thực hiện</div>' : ''}
        ${status === 'done' ? '<div style="font-size:10px;color:#10b981">Hoàn tất</div>' : ''}
      </div>
      ${status !== 'done' && inc.status !== 'done'
        ? `<button class="btn btn-ghost btn-sm" onclick="incAdvanceStep('${id}','${step.id}')">Xác nhận</button>`
        : ''}
    </div>`;
  }).join('');

  const timelineHtml = (inc.timeline || []).map(t => `
    <div style="display:flex;gap:10px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.05)">
      <div style="width:7px;height:7px;border-radius:50%;background:#8b5cf6;flex-shrink:0;margin-top:5px"></div>
      <div>
        <div style="font-size:11px;color:rgba(255,255,255,.7)">${t.event}</div>
        <div style="font-size:10px;color:rgba(255,255,255,.3);margin-top:1px">${t.time} · ${t.user||'Hệ thống'}</div>
      </div>
    </div>`).join('') || '<div style="font-size:12px;color:rgba(255,255,255,.3)">Chưa có nhật ký</div>';

  const modal = `
  <div class="modal-header">
    <span class="modal-title" style="display:flex;align-items:center;gap:8px">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      ${id} — ${inc.type}
    </span>
    <button class="modal-close" onclick="closeModal()">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
  <div class="modal-body" style="display:grid;grid-template-columns:1fr 1fr;gap:18px;max-height:70vh;overflow-y:auto">
    <!-- Left: info + 7-step -->
    <div>
      <div style="background:rgba(255,255,255,.04);border-radius:10px;padding:12px;margin-bottom:12px">
        <div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:8px">${inc.location}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px">
          <div><div style="color:rgba(255,255,255,.35)">Mức độ</div><div style="font-weight:700;color:${inc.severity==='critical'?'#f87171':inc.severity==='high'?'#fb923c':'#fbbf24'}">${inc.severity}</div></div>
          <div><div style="color:rgba(255,255,255,.35)">Phân công</div><div style="font-weight:700;color:#38bdf8">${inc.assignedTo||'Chưa phân công'}</div></div>
          <div><div style="color:rgba(255,255,255,.35)">Báo cáo lúc</div><div>${inc.report}</div></div>
          <div><div style="color:rgba(255,255,255,.35)">SLA</div><div style="color:${sla.overdue?'#f87171':sla.pct>=80?'#fbbf24':'#34d399'};font-weight:700">${sla.overdue?'QUÁ HẠN':'Đúng hạn'}</div></div>
        </div>
        <div style="margin-top:8px;height:4px;background:rgba(255,255,255,.06);border-radius:2px">
          <div style="height:100%;width:${sla.pct}%;background:${sla.overdue?'#ef4444':sla.pct>=80?'#f59e0b':'#10b981'};border-radius:2px"></div>
        </div>
      </div>

      <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Quy trình 7 bước</div>
      ${stepHtml}

      ${inc.status !== 'done' ? `
      <button class="btn btn-primary" style="width:100%;margin-top:12px" onclick="incCheckIn('${id}')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        Check-in Hiện trường
      </button>` : `
      <button class="btn btn-ghost" style="width:100%;margin-top:12px" onclick="incGenReport('${id}')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        Xuất biên bản điện tử
      </button>`}
    </div>

    <!-- Right: timeline + materials -->
    <div>
      <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Nhật ký xử lý</div>
      <div style="max-height:220px;overflow-y:auto;padding-right:4px;margin-bottom:14px">
        ${timelineHtml}
      </div>

      <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Vật tư đã dùng</div>
      ${extra.materials.length ? `
      <table style="width:100%;font-size:11px;border-collapse:collapse">
        <thead><tr><th style="text-align:left;color:rgba(255,255,255,.35);padding:4px 0;border-bottom:1px solid rgba(255,255,255,.06)">Vật tư</th><th style="color:rgba(255,255,255,.35);padding:4px 0">SL</th><th style="color:rgba(255,255,255,.35)">Đơn vị</th></tr></thead>
        <tbody>${extra.materials.map(m=>`<tr><td style="padding:5px 0;color:rgba(255,255,255,.7)">${m.name}</td><td style="text-align:center;font-weight:700">${m.qty}</td><td style="text-align:center;color:rgba(255,255,255,.4)">${m.unit}</td></tr>`).join('')}</tbody>
      </table>` : '<div style="font-size:12px;color:rgba(255,255,255,.3)">Chưa ghi nhận</div>'}

      ${extra.field_note ? `
      <div style="margin-top:12px;padding:10px;background:rgba(255,255,255,.04);border-radius:8px;font-size:12px;color:rgba(255,255,255,.6);line-height:1.6">
        <div style="font-size:10px;font-weight:700;color:rgba(255,255,255,.35);text-transform:uppercase;margin-bottom:4px">Ghi chú hiện trường</div>
        ${extra.field_note}
      </div>` : ''}

      ${extra.checkins.length ? `
      <div style="margin-top:12px">
        <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">Check-in</div>
        ${extra.checkins.map(c=>`
        <div style="display:flex;gap:8px;font-size:11px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.05)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" style="flex-shrink:0;margin-top:2px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <div><div style="color:rgba(255,255,255,.7)">${c.user}</div><div style="color:rgba(255,255,255,.35)">${c.time} · ${c.note}</div></div>
        </div>`).join('')}
      </div>` : ''}
    </div>
  </div>`;

  if (typeof openModal === 'function') openModal(modal, 'large');
}

// ── Actions ────────────────────────────────────────────────────────
function incAdvanceStep(id, stepId) {
  const inc = DATA.incidents.find(i => i.id === id);
  if (!inc) return;
  const stepLabel = INC_STEPS.find(s => s.id === stepId)?.label || stepId;
  inc.timeline = inc.timeline || [];
  inc.timeline.push({ time: new Date().toLocaleString('vi-VN'), event: `✓ ${stepLabel}`, user: 'Admin' });
  if (stepId === 'accept' || stepId === 'report') inc.status = 'done';
  else if (['assign','update','verify','classify'].includes(stepId)) inc.status = 'processing';
  if (typeof showToast === 'function') showToast(`Cập nhật: ${stepLabel}`, 'success');
  incOpenDetail(id);
}

function incCheckIn(id) {
  const inc = DATA.incidents.find(i => i.id === id);
  if (!inc) return;
  inc.timeline = inc.timeline || [];
  const now = new Date().toLocaleString('vi-VN');
  inc.timeline.push({ time: now, event: 'Check-in hiện trường (GPS tự động)', user: 'Admin' });
  if (!INC_DETAILS[id]) INC_DETAILS[id] = { checkins:[], materials:[], field_note:'' };
  INC_DETAILS[id].checkins.push({ user:'Admin', time:now, lat:21.02, lng:105.84, note:'Check-in qua ứng dụng' });
  if (typeof showToast === 'function') showToast('Đã check-in hiện trường', 'success');
  incOpenDetail(id);
}

function incGenReport(id) {
  const inc = DATA.incidents.find(i => i.id === id);
  if (!inc) return;
  const extra = INC_DETAILS[id] || {};
  const content = `BIÊN BẢN XỬ LÝ SỰ CỐ\n============================\nMã sự cố: ${id}\nLoại: ${inc.type}\nĐịa điểm: ${inc.location}\nMức độ: ${inc.severity}\nBáo cáo: ${inc.report}\nPhân công: ${inc.assignedTo||'—'}\n\nGhi chú hiện trường:\n${extra.field_note||'(không có)'}\n\nNhật ký:\n${(inc.timeline||[]).map(t=>`- ${t.time}: ${t.event}`).join('\n')}\n\nVật tư sử dụng:\n${(extra.materials||[]).map(m=>`- ${m.name}: ${m.qty} ${m.unit}`).join('\n')||'(không có)'}\n\nKý xác nhận: ___________________________\nNgày: ${new Date().toLocaleDateString('vi-VN')}`;
  const blob = new Blob([content], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `bienban_${id}.txt`; a.click();
  URL.revokeObjectURL(url);
  if (typeof showToast === 'function') showToast('Đã xuất biên bản sự cố', 'success');
}

// Expose incSlaBar so incidents.js kanban cards can call it
window.incSlaBar = incSlaBar;
window.incOpenDetail = incOpenDetail;
