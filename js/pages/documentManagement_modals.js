// ── HADIWA IOC — Document Management Modals (v5.2+) ───────────────
// Implements: dmDocView, dmDocNew, dmDocExport, dmDocSign, dmDocSubmit, dmDocDownload
// Shared modal overlay reused across all doc modals

function _dmDocModal(html) {
  let el = document.getElementById('dmDocOverlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'dmDocOverlay';
    el.style.cssText = 'position:fixed;inset:0;z-index:9100;background:rgba(0,0,0,.72);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:20px';
    el.addEventListener('click', e => { if (e.target === el) _dmDocClose(); });
    document.body.appendChild(el);
  }
  el.innerHTML = html;
  el.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function _dmDocClose() {
  const el = document.getElementById('dmDocOverlay');
  if (el) { el.style.display = 'none'; el.innerHTML = ''; }
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') _dmDocClose(); });

// ──────────────────────────────────────────────────────────────────
// dmDocView(id) — Full document detail modal
// ──────────────────────────────────────────────────────────────────
function dmDocView(id) {
  const docs = typeof DM_DOCUMENTS !== 'undefined' ? DM_DOCUMENTS : [];
  const cats = typeof DM_CATEGORIES !== 'undefined' ? DM_CATEGORIES : {};
  const d = docs.find(x => x.id === id);
  if (!d) return;
  const cat = cats[d.type] || { label: d.type, color: 'var(--text-subtle)' };
  const sc = { signed:'var(--success)', pending:'#f59e0b', draft:'var(--text-subtle)' }[d.status];
  const sl = { signed:'Đã ký ban hành', pending:'Chờ ký duyệt', draft:'Bản nháp' }[d.status];

  // Increment downloads counter on view
  d.downloads = (d.downloads || 0) + 1;

  _dmDocModal(`
<div style="background:#0e1220;border:1px solid rgba(255,255,255,.1);border-radius:18px;width:720px;max-width:100%;max-height:90vh;overflow:hidden;display:flex;flex-direction:column">
  <!-- Header -->
  <div style="padding:20px 24px 16px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;gap:12px;align-items:flex-start">
    <div style="width:42px;height:42px;border-radius:10px;background:${cat.color}20;border:1px solid ${cat.color}44;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${cat.color}" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    </div>
    <div style="flex:1;min-width:0">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">
        <span style="font-family:monospace;font-size:12px;color:#5BA9FF;font-weight:700">${d.id}</span>
        <span style="padding:1px 8px;border-radius:20px;font-size:10px;font-weight:800;background:${cat.color}20;color:${cat.color};border:1px solid ${cat.color}40">${cat.label}</span>
        <span style="padding:1px 8px;border-radius:20px;font-size:10px;font-weight:800;background:${sc}20;color:${sc};border:1px solid ${sc}40">${sl}</span>
        ${d.urgent ? `<span style="font-size:10px;font-weight:800;color:#ef4444;padding:1px 8px;border-radius:20px;background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.4)">KHẨN</span>` : ''}
      </div>
      <h2 style="font-size:15px;font-weight:800;color:#fff;margin:0;line-height:1.4">${d.title}</h2>
      <div style="font-size:12px;color:rgba(255,255,255,.38);margin-top:4px">${d.issuer} · ${d.date}</div>
    </div>
    <button onclick="_dmDocClose()" style="background:transparent;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:20px;flex-shrink:0;padding:0 4px">✕</button>
  </div>

  <!-- Body -->
  <div style="overflow-y:auto;flex:1;padding:20px 24px">
    <!-- Meta grid -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px">
      ${[
        ['Phiên bản', 'v' + d.version, '#38bdf8'],
        ['Người ký', d.signer || '— chưa ký —', d.signer ? 'var(--success)' : 'var(--text-subtle)'],
        ['Lượt xem/tải', d.downloads, '#5BA9FF'],
      ].map(([l,v,c]) => `<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:10px 12px">
        <div style="font-size:9px;font-weight:700;color:rgba(255,255,255,.32);text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px">${l}</div>
        <div style="font-size:14px;font-weight:800;color:${c};font-family:monospace">${v}</div>
      </div>`).join('')}
    </div>

    <!-- Mock document preview -->
    <div style="background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:20px;font-size:12px;line-height:1.8;color:rgba(255,255,255,.65)">
      <div style="text-align:center;margin-bottom:14px">
        <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.4);letter-spacing:.06em">ỦY BAN NHÂN DÂN THÀNH PHỐ HÀ NỘI</div>
        <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.4);letter-spacing:.06em">CHI CỤC THỦY LỢI VÀ PHÒNG CHỐNG THIÊN TAI</div>
        <div style="width:80px;height:1px;background:rgba(255,255,255,.15);margin:8px auto"></div>
        <div style="font-size:14px;font-weight:900;color:#fff;margin:8px 0">${cat.label.toUpperCase()}</div>
        <div style="font-weight:700;color:rgba(255,255,255,.7)">Số: ${d.id}</div>
        <div style="font-size:11px;color:rgba(255,255,255,.38)">Hà Nội, ngày ${d.date}</div>
      </div>
      <div style="font-weight:800;font-size:13px;color:#fff;text-align:center;margin:14px 0 10px">V/v: ${d.title}</div>
      <p style="margin-bottom:8px">Căn cứ Luật Phòng, chống thiên tai số 33/2013/QH13 và các văn bản hướng dẫn thi hành; Căn cứ chức năng, nhiệm vụ, quyền hạn của Chi cục Thủy lợi và PCTT Hà Nội;</p>
      <p style="margin-bottom:8px">Xét tình hình thực tế công tác phòng, chống thiên tai trên địa bàn Thành phố Hà Nội;</p>
      <p style="margin-bottom:16px"><strong style="color:#fff">CHI CỤC TRƯỞNG CHI CỤC THỦY LỢI VÀ PHÒNG CHỐNG THIÊN TAI HÀ NỘI</strong></p>
      <p style="font-style:italic;margin-bottom:8px">Nội dung chi tiết của văn bản "${d.title}" được lưu trữ trong hệ thống tài liệu điện tử của Chi cục TT-PCTT Hà Nội.</p>
      ${d.status === 'signed' ? `<div style="text-align:right;margin-top:20px;padding-top:12px;border-top:1px solid rgba(255,255,255,.07)">
        <div style="font-size:11px;color:rgba(255,255,255,.4)">Đã ký và đóng dấu</div>
        <div style="font-size:13px;font-weight:800;color:var(--success);margin-top:4px">${d.signer}</div>
        <div style="font-size:10px;color:rgba(255,255,255,.3);margin-top:2px">Ngày ký: ${d.date}</div>
      </div>` : ''}
    </div>
  </div>

  <!-- Footer -->
  <div style="padding:14px 24px;border-top:1px solid rgba(255,255,255,.07);display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap">
    ${d.status === 'draft'    ? `<button onclick="_dmDocClose();dmDocSubmit('${d.id}')" style="padding:7px 14px;border-radius:8px;border:none;background:#38bdf8;color:#0e1220;font-size:12px;font-weight:800;cursor:pointer">Trình ký duyệt</button>` : ''}
    ${d.status === 'pending'  ? `<button onclick="_dmDocClose();dmDocSign('${d.id}')"   style="padding:7px 14px;border-radius:8px;border:none;background:var(--success);color:#fff;font-size:12px;font-weight:800;cursor:pointer">Ký ban hành</button>` : ''}
    ${d.status === 'signed'   ? `<button onclick="dmDocDownload('${d.id}')" style="padding:7px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:#fff;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Tải về</button>` : ''}
    <button onclick="dmDocEditVersion('${d.id}')" style="padding:7px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);color:rgba(255,255,255,.7);font-size:12px;cursor:pointer">Chỉnh sửa</button>
    <button onclick="_dmDocClose()" style="padding:7px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:transparent;color:rgba(255,255,255,.5);font-size:12px;cursor:pointer">Đóng</button>
  </div>
</div>`);
}

// ──────────────────────────────────────────────────────────────────
// dmDocNew() — Create new document form
// ──────────────────────────────────────────────────────────────────
function dmDocNew() {
  const cats = typeof DM_CATEGORIES !== 'undefined' ? DM_CATEGORIES : {};
  _dmDocModal(`
<div style="background:#0e1220;border:1px solid rgba(255,255,255,.1);border-radius:16px;width:600px;max-width:100%;max-height:92vh;overflow:hidden;display:flex;flex-direction:column">
  <div style="padding:18px 22px 14px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between">
    <h3 style="font-size:15px;font-weight:800;color:#fff;margin:0;display:flex;align-items:center;gap:8px">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Tạo văn bản mới
    </h3>
    <button onclick="_dmDocClose()" style="background:transparent;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:20px">✕</button>
  </div>
  <form onsubmit="dmDocSaveNew(event)" style="overflow-y:auto;padding:20px 22px">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Loại văn bản *</label>
        <select id="docNewType" class="form-control" style="width:100%">
          ${Object.entries(cats).map(([k,v]) => `<option value="${k}">${v.label}</option>`).join('')}
        </select>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Số/Mã văn bản *</label>
        <input id="docNewId" class="form-control" placeholder="VD: QĐ-128/2026" required/>
      </div>
    </div>
    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Trích yếu nội dung *</label>
      <textarea id="docNewTitle" class="form-control" rows="3" placeholder="Nhập trích yếu/tiêu đề văn bản..." required style="resize:vertical;width:100%"></textarea>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Đơn vị ban hành *</label>
        <input id="docNewIssuer" class="form-control" value="Chi cục TT-PCTT HN" required/>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Ngày ký / ban hành</label>
        <input id="docNewDate" class="form-control" type="date" value="${new Date().toISOString().substring(0,10)}"/>
      </div>
    </div>
    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:8px">Tình trạng</label>
      <div style="display:flex;gap:8px">
        ${[['draft','Bản nháp','var(--text-subtle)'],['pending','Trình ký ngay','#38bdf8']].map(([v,l,c]) =>
          `<label style="display:flex;align-items:center;gap:6px;font-size:12px;color:${c};cursor:pointer;padding:6px 12px;border-radius:8px;border:1px solid ${c}44;background:${c}12">
            <input type="radio" name="docNewStatus" value="${v}" ${v==='draft'?'checked':''} style="accent-color:${c}"/> ${l}
          </label>`).join('')}
      </div>
    </div>
    <div style="margin-bottom:18px">
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:rgba(255,255,255,.6);cursor:pointer">
        <input type="checkbox" id="docNewUrgent" style="accent-color:#ef4444;width:14px;height:14px"/>
        <span>Đánh dấu là <strong style="color:#ef4444">văn bản KHẨN CẤP</strong></span>
      </label>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button type="button" onclick="_dmDocClose()" style="padding:8px 16px;border-radius:8px;border:1px solid rgba(255,255,255,.12);background:transparent;color:rgba(255,255,255,.6);font-size:12px;cursor:pointer">Hủy</button>
      <button type="submit" style="padding:8px 18px;border-radius:8px;border:none;background:var(--purple);color:#fff;font-size:12px;font-weight:800;cursor:pointer">Tạo văn bản</button>
    </div>
  </form>
</div>`);
}

function dmDocSaveNew(e) {
  e.preventDefault();
  const docs = typeof DM_DOCUMENTS !== 'undefined' ? DM_DOCUMENTS : [];
  const dateVal = document.getElementById('docNewDate').value;
  const dateStr = dateVal ? new Date(dateVal).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' }) : '—';
  const status  = document.querySelector('input[name="docNewStatus"]:checked')?.value || 'draft';
  const newDoc = {
    id:      document.getElementById('docNewId').value.trim(),
    type:    document.getElementById('docNewType').value,
    title:   document.getElementById('docNewTitle').value.trim(),
    date:    dateStr,
    issuer:  document.getElementById('docNewIssuer').value,
    status,
    signer:  null,
    version: '0.1',
    downloads: 0,
    urgent:  document.getElementById('docNewUrgent').checked,
  };
  if (!newDoc.id || !newDoc.title) return;
  docs.unshift(newDoc);
  _dmDocClose();
  if (typeof showToast === 'function') showToast(`Đã tạo văn bản ${newDoc.id}!`, 'success');
  if (typeof dmDocSetTab === 'function') dmDocSetTab('all');
}

// ──────────────────────────────────────────────────────────────────
// dmDocSign(id) — Signing confirmation modal with PIN
// ──────────────────────────────────────────────────────────────────
function dmDocSign(id) {
  const docs = typeof DM_DOCUMENTS !== 'undefined' ? DM_DOCUMENTS : [];
  const d = docs.find(x => x.id === id);
  if (!d) return;
  _dmDocModal(`
<div style="background:#0e1220;border:1px solid rgba(255,255,255,.1);border-radius:16px;width:460px;max-width:100%">
  <div style="padding:20px 24px 16px;border-bottom:1px solid rgba(255,255,255,.07)">
    <div style="text-align:center;margin-bottom:14px">
      <div style="width:50px;height:50px;border-radius:14px;background:rgba(41,132,238,.15);border:1px solid rgba(41,132,238,.3);margin:0 auto 10px;display:flex;align-items:center;justify-content:center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/></svg>
      </div>
      <h3 style="font-size:15px;font-weight:800;color:#fff;margin:0 0 4px">Xác nhận Ký ban hành</h3>
      <p style="font-size:12px;color:rgba(255,255,255,.45);margin:0">Văn bản sẽ có hiệu lực ngay sau khi ký</p>
    </div>
    <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:12px 14px;margin-bottom:14px">
      <div style="font-size:10px;color:rgba(255,255,255,.35);margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em">Văn bản</div>
      <div style="font-size:12px;font-weight:700;color:#fff;line-height:1.4">${d.title}</div>
      <div style="font-size:11px;color:rgba(255,255,255,.38);margin-top:4px">Số: ${d.id} · ${d.date}</div>
    </div>
    <div style="margin-bottom:16px">
      <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:6px">Người ký</label>
      <select id="docSignerName" class="form-control" style="width:100%">
        <option>Chi cục trưởng Lê Văn Nam</option>
        <option>PCC Nguyễn Thị Hà</option>
        <option>PCC Trần Văn Đức</option>
      </select>
    </div>
    <div style="margin-bottom:6px">
      <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:6px">Mã xác nhận (PIN) *</label>
      <input id="docSignPin" class="form-control" type="password" maxlength="6" placeholder="Nhập mã PIN 6 số" style="width:100%;letter-spacing:4px;font-size:18px;text-align:center" oninput="this.value=this.value.replace(/\\D/g,'').slice(0,6)"/>
      <div style="font-size:10px;color:rgba(255,255,255,.3);margin-top:4px">Nhập 123456 để xác nhận (demo)</div>
    </div>
  </div>
  <div style="padding:14px 22px;display:flex;gap:8px;justify-content:flex-end;">
    <button onclick="_dmDocClose()" style="padding:8px 16px;border-radius:8px;border:1px solid rgba(255,255,255,.12);background:transparent;color:rgba(255,255,255,.5);font-size:12px;cursor:pointer">Hủy</button>
    <button onclick="_doSign('${id}')" style="padding:8px 18px;border-radius:8px;border:none;background:var(--success);color:#fff;font-size:12px;font-weight:800;cursor:pointer">Ký ban hành</button>
  </div>
</div>`);
}

function _doSign(id) {
  const pin = document.getElementById('docSignPin')?.value;
  if (pin !== '123456') { if(typeof showToast==='function') showToast('Mã PIN không đúng!', 'error'); return; }
  const d = (typeof DM_DOCUMENTS !== 'undefined' ? DM_DOCUMENTS : []).find(x => x.id === id);
  if (d) {
    d.status = 'signed';
    d.signer = document.getElementById('docSignerName').value;
  }
  _dmDocClose();
  if (typeof showToast === 'function') showToast(`Đã ký ban hành văn bản ${id}!`, 'success');
  if (typeof dmDocSetTab === 'function') dmDocSetTab(typeof dmDocTab !== 'undefined' ? dmDocTab : 'all');
}

// ──────────────────────────────────────────────────────────────────
// dmDocSubmit(id) — Submit draft for approval confirmation
// ──────────────────────────────────────────────────────────────────
function dmDocSubmit(id) {
  const d = (typeof DM_DOCUMENTS !== 'undefined' ? DM_DOCUMENTS : []).find(x => x.id === id);
  if (!d) return;
  _dmDocModal(`
<div style="background:#0e1220;border:1px solid rgba(255,255,255,.1);border-radius:16px;width:420px;max-width:100%;padding:24px">
  <div style="text-align:center;margin-bottom:18px">
    <div style="width:48px;height:48px;border-radius:14px;background:rgba(56,189,248,.12);border:1px solid rgba(56,189,248,.3);margin:0 auto 10px;display:flex;align-items:center;justify-content:center">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
    </div>
    <h3 style="font-size:15px;font-weight:800;color:#fff;margin:0 0 6px">Trình ký văn bản</h3>
    <p style="font-size:12px;color:rgba(255,255,255,.45);margin:0">Văn bản sẽ được gửi đến lãnh đạo để phê duyệt</p>
  </div>
  <div style="background:rgba(56,189,248,.06);border:1px solid rgba(56,189,248,.2);border-radius:10px;padding:12px;margin-bottom:16px;font-size:12px;color:rgba(255,255,255,.65);line-height:1.5">
    <strong style="color:#38bdf8">${d.id}</strong> — ${d.title.substring(0,60)}${d.title.length>60?'…':''}
  </div>
  <div style="margin-bottom:16px">
    <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:6px">Trình cho</label>
    <select id="docSubmitTo" class="form-control" style="width:100%">
      <option>Chi cục trưởng Lê Văn Nam</option>
      <option>PCC Nguyễn Thị Hà</option>
    </select>
  </div>
  <div style="margin-bottom:18px">
    <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:6px">Ghi chú (tuỳ chọn)</label>
    <textarea id="docSubmitNote" class="form-control" rows="2" placeholder="Thêm ghi chú cho lãnh đạo..." style="resize:none;width:100%"></textarea>
  </div>
  <div style="display:flex;gap:8px;justify-content:flex-end">
    <button onclick="_dmDocClose()" style="padding:8px 16px;border-radius:8px;border:1px solid rgba(255,255,255,.12);background:transparent;color:rgba(255,255,255,.5);font-size:12px;cursor:pointer">Hủy</button>
    <button onclick="_doSubmit('${id}')" style="padding:8px 18px;border-radius:8px;border:none;background:#38bdf8;color:#0e1220;font-size:12px;font-weight:800;cursor:pointer">Gửi trình ký</button>
  </div>
</div>`);
}

function _doSubmit(id) {
  const d = (typeof DM_DOCUMENTS !== 'undefined' ? DM_DOCUMENTS : []).find(x => x.id === id);
  if (d) d.status = 'pending';
  _dmDocClose();
  const to = document.getElementById('docSubmitTo')?.value || 'lãnh đạo';
  if (typeof showToast === 'function') showToast(`Đã trình ký văn bản ${id} đến ${to}`, 'success');
  if (typeof dmDocSetTab === 'function') dmDocSetTab(typeof dmDocTab !== 'undefined' ? dmDocTab : 'all');
}

// ──────────────────────────────────────────────────────────────────
// dmDocDownload(id) — Download with counter update
// ──────────────────────────────────────────────────────────────────
function dmDocDownload(id) {
  const d = (typeof DM_DOCUMENTS !== 'undefined' ? DM_DOCUMENTS : []).find(x => x.id === id);
  if (d) d.downloads = (d.downloads || 0) + 1;
  if (typeof showToast === 'function') showToast(`Đang tải xuống: ${id}.pdf`, 'info');
  // Trigger a simulated re-render to update download counts in the table
  setTimeout(() => {
    const area = document.getElementById('contentArea') || document.querySelector('.page-content');
    if (area && typeof renderDocManagement === 'function') area.innerHTML = renderDocManagement();
  }, 800);
}

// ──────────────────────────────────────────────────────────────────
// dmDocExport() — Export Excel (CSV download)
// ──────────────────────────────────────────────────────────────────
function dmDocExport() {
  const docs = typeof DM_DOCUMENTS !== 'undefined' ? DM_DOCUMENTS : [];
  const cats = typeof DM_CATEGORIES !== 'undefined' ? DM_CATEGORIES : {};
  const rows = [['Số/Mã', 'Loại', 'Trích yếu', 'Ngày', 'Đơn vị ban hành', 'Người ký', 'Trạng thái', 'Phiên bản', 'Lượt tải', 'Khẩn']];
  docs.forEach(d => {
    const stLabel = { signed:'Đã ký', pending:'Chờ ký', draft:'Bản nháp' }[d.status] || d.status;
    rows.push([d.id, (cats[d.type]||{label:d.type}).label, d.title, d.date, d.issuer, d.signer||'—', stLabel, 'v'+d.version, d.downloads, d.urgent?'Khẩn':'']);
  });
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a'); a.href = url; a.download = `vanban_pctt_${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
  if (typeof showToast === 'function') showToast('Đã xuất danh sách văn bản!', 'success');
}

// ──────────────────────────────────────────────────────────────────
// dmDocEditVersion(id) — Edit document metadata / bump version
// ──────────────────────────────────────────────────────────────────
function dmDocEditVersion(id) {
  const d = (typeof DM_DOCUMENTS !== 'undefined' ? DM_DOCUMENTS : []).find(x => x.id === id);
  if (!d) return;
  _dmDocModal(`
<div style="background:#0e1220;border:1px solid rgba(255,255,255,.1);border-radius:16px;width:500px;max-width:100%">
  <div style="padding:18px 22px 14px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between">
    <h3 style="font-size:14px;font-weight:800;color:#fff;margin:0">Chỉnh sửa văn bản — ${d.id}</h3>
    <button onclick="_dmDocClose()" style="background:transparent;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:20px">✕</button>
  </div>
  <form onsubmit="dmDocSaveEdit(event,'${id}')" style="padding:20px 22px">
    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Trích yếu nội dung</label>
      <textarea id="editDocTitle" class="form-control" rows="3" style="resize:vertical;width:100%">${d.title}</textarea>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Đơn vị ban hành</label>
        <input id="editDocIssuer" class="form-control" value="${d.issuer}"/>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Phiên bản mới</label>
        <input id="editDocVersion" class="form-control" value="${d.version}" placeholder="VD: 1.1"/>
      </div>
    </div>
    <div style="margin-bottom:18px">
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:rgba(255,255,255,.6);cursor:pointer">
        <input type="checkbox" id="editDocUrgent" ${d.urgent?'checked':''} style="accent-color:#ef4444;width:14px;height:14px"/>
        <span>Đánh dấu <strong style="color:#ef4444">văn bản KHẨN CẤP</strong></span>
      </label>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button type="button" onclick="_dmDocClose()" style="padding:8px 16px;border-radius:8px;border:1px solid rgba(255,255,255,.12);background:transparent;color:rgba(255,255,255,.6);font-size:12px;cursor:pointer">Hủy</button>
      <button type="submit" style="padding:8px 18px;border-radius:8px;border:none;background:var(--purple);color:#fff;font-size:12px;font-weight:800;cursor:pointer">Lưu</button>
    </div>
  </form>
</div>`);
}

function dmDocSaveEdit(e, id) {
  e.preventDefault();
  const d = (typeof DM_DOCUMENTS !== 'undefined' ? DM_DOCUMENTS : []).find(x => x.id === id);
  if (!d) return;
  d.title   = document.getElementById('editDocTitle').value;
  d.issuer  = document.getElementById('editDocIssuer').value;
  d.version = document.getElementById('editDocVersion').value;
  d.urgent  = document.getElementById('editDocUrgent').checked;
  _dmDocClose();
  if (typeof showToast === 'function') showToast(`Đã cập nhật văn bản ${id} v${d.version}`, 'success');
  if (typeof dmDocSetTab === 'function') dmDocSetTab(typeof dmDocTab !== 'undefined' ? dmDocTab : 'all');
}
