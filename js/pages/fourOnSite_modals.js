// ── HADIWA IOC — 4 Tại chỗ Modals (fourOnSite supplement) ─────────
// Implements: fosDetailVehicle, fosExportForce, fosXuatKho,
//             fosUpdateVatTu, fosXuatPhieu — all previously toast-only stubs

// Shared modal helper for 4TT page (separate overlay from dike/doc)
function _fosModal(html) {
  let el = document.getElementById('fosModalOverlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'fosModalOverlay';
    el.style.cssText = 'position:fixed;inset:0;z-index:9200;background:rgba(0,0,0,.72);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:20px';
    el.addEventListener('click', e => { if (e.target === el) _fosClose(); });
    document.body.appendChild(el);
  }
  el.innerHTML = html;
  el.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function _fosClose() {
  const el = document.getElementById('fosModalOverlay');
  if (el) { el.style.display = 'none'; el.innerHTML = ''; }
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') _fosClose(); });

// ──────────────────────────────────────────────────────────────────
// Patch: replace toast-only onclick handlers by overriding functions
// after fourOnSite.js loads (called via onclick="fosDetailVehicle(v)")
// ──────────────────────────────────────────────────────────────────

// ── 1. Vehicle / unit detail modal ────────────────────────────────
// Called from Phương tiện tab row: onclick="fosDetailVehicle(v.type)"
window.fosDetailVehicle = function(typeName) {
  // Pull vehicle record from FOS_PHUONGTIEN if available
  const vehicles = (typeof FOS_PHUONGTIEN !== 'undefined') ? FOS_PHUONGTIEN : [];
  const v = vehicles.find(x => x.type === typeName) || { type: typeName, total: '—', deployed: '—', ready:'—', unit:'—', note:'—' };
  const pct = (v.deployed && v.total && !isNaN(v.deployed) && !isNaN(v.total))
    ? Math.min(100, Math.round(v.deployed / v.total * 100)) : 0;
  _fosModal(`
<div style="background:#0e1220;border:1px solid rgba(255,255,255,.1);border-radius:16px;width:480px;max-width:100%">
  <div style="padding:18px 22px 14px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between">
    <h3 style="font-size:15px;font-weight:800;color:#fff;margin:0;display:flex;align-items:center;gap:8px">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
      ${typeName}
    </h3>
    <button onclick="_fosClose()" style="background:transparent;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:20px">✕</button>
  </div>
  <div style="padding:20px 22px">
    <!-- Deployment gauge -->
    <div style="text-align:center;margin-bottom:18px">
      <div style="font-size:40px;font-weight:900;color:${pct>80?'#ef4444':pct>50?'#f59e0b':'#10b981'}">${v.deployed}<span style="font-size:16px;color:rgba(255,255,255,.4)">/${v.total}</span></div>
      <div style="font-size:11px;color:rgba(255,255,255,.38);margin-bottom:8px">Đang triển khai / Tổng số</div>
      <div style="height:6px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${pct>80?'#ef4444':pct>50?'#f59e0b':'#10b981'};border-radius:3px;transition:width .5s"></div>
      </div>
      <div style="font-size:10px;color:rgba(255,255,255,.3);margin-top:4px">${pct}% năng lực đang hoạt động</div>
    </div>
    <!-- Detail fields -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">
      ${[
        ['Tổng số', v.total, '#38bdf8'],
        ['Sẵn sàng', v.ready, '#10b981'],
        ['Đang triển khai', v.deployed, '#f59e0b'],
        ['Đơn vị quản lý', v.unit, '#a78bfa'],
      ].map(([l,val,c]) => `<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:10px 12px">
        <div style="font-size:9px;font-weight:700;color:rgba(255,255,255,.32);text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px">${l}</div>
        <div style="font-size:16px;font-weight:900;color:${c};font-family:monospace">${val??'—'}</div>
      </div>`).join('')}
    </div>
    ${v.note ? `<div style="background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.2);border-radius:8px;padding:10px 12px;font-size:12px;color:rgba(255,255,255,.65);margin-bottom:14px"><strong style="color:#fbbf24">Ghi chú:</strong> ${v.note}</div>` : ''}
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button onclick="fosDeployUnit('${typeName}')" style="padding:7px 14px;border-radius:8px;border:none;background:#f59e0b;color:#0e1220;font-size:12px;font-weight:800;cursor:pointer">Điều động thêm</button>
      <button onclick="_fosClose()" style="padding:7px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:transparent;color:rgba(255,255,255,.5);font-size:12px;cursor:pointer">Đóng</button>
    </div>
  </div>
</div>`);
};

window.fosDeployUnit = function(typeName) {
  _fosClose();
  if (typeof showToast === 'function') showToast(`Đã gửi lệnh điều động: ${typeName}`, 'success');
};

// ── 2. Export force list (CSV) ─────────────────────────────────────
// Replaces: onclick="showToast('Đang xuất danh sách lực lượng...')"
window.fosExportForce = function() {
  const forces = (typeof FOS_LUC_LUONG !== 'undefined') ? FOS_LUC_LUONG : [];
  if (forces.length === 0) { if(typeof showToast === 'function') showToast('Không có dữ liệu để xuất', 'info'); return; }
  const rows = [['Đơn vị', 'Tổng quân số', 'Có mặt', 'Đã triển khai', 'Liên hệ', 'Chỉ huy', 'Trạng thái']];
  forces.forEach(f => rows.push([f.unit||'', f.total||'', f.present||'', f.deployed||'', f.contact||'', f.commander||'', f.status||'']));
  const csv = rows.map(r => r.map(c => `"${String(c||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF'+csv], { type:'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=`lucluong_4taicho_${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
  if (typeof showToast === 'function') showToast('Đã xuất danh sách lực lượng!', 'success');
};

// ── 3. Xuất kho khẩn cấp modal ────────────────────────────────────
window.fosXuatKhoKhan = function() {
  const vattu = (typeof FOS_VAT_TU !== 'undefined') ? FOS_VAT_TU : [];
  _fosModal(`
<div style="background:#0e1220;border:1px solid rgba(255,255,255,.1);border-radius:16px;width:540px;max-width:100%">
  <div style="padding:18px 22px 14px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between">
    <h3 style="font-size:15px;font-weight:800;color:#fff;margin:0;display:flex;align-items:center;gap:8px">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
      Phiếu Xuất kho Khẩn cấp
    </h3>
    <button onclick="_fosClose()" style="background:transparent;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:20px">✕</button>
  </div>
  <form onsubmit="fosSaveXuatKho(event)" style="padding:20px 22px">
    <div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);border-radius:10px;padding:10px 14px;font-size:12px;color:#fca5a5;margin-bottom:14px">
      Xuất kho khẩn cấp — phiếu này không cần duyệt thông thường. Ghi rõ lý do.
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Vật tư cần xuất *</label>
        <select id="fosXkItem" class="form-control" style="width:100%">
          ${vattu.length > 0
            ? vattu.map(v => `<option value="${v.item}">${v.item}</option>`).join('')
            : `<option>Bao tải cát</option><option>Đất sét</option><option>Rọ đá</option><option>Cừ thép</option><option>Phao cứu sinh</option>`}
        </select>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Số lượng *</label>
        <input id="fosXkQty" class="form-control" type="number" min="1" placeholder="Nhập số lượng" required/>
      </div>
    </div>
    <div style="margin-bottom:12px">
      <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Đơn vị nhận *</label>
      <input id="fosXkUnit" class="form-control" placeholder="Tên đội/đơn vị nhận vật tư" required style="width:100%"/>
    </div>
    <div style="margin-bottom:12px">
      <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Địa điểm triển khai</label>
      <input id="fosXkLoc" class="form-control" placeholder="VD: Đê Hữu Đáy K+8+200" style="width:100%"/>
    </div>
    <div style="margin-bottom:16px">
      <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Lý do xuất khẩn cấp *</label>
      <textarea id="fosXkReason" class="form-control" rows="2" placeholder="Mô tả tình huống khẩn cấp..." required style="resize:none;width:100%"></textarea>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button type="button" onclick="_fosClose()" style="padding:8px 16px;border-radius:8px;border:1px solid rgba(255,255,255,.12);background:transparent;color:rgba(255,255,255,.5);font-size:12px;cursor:pointer">Hủy</button>
      <button type="submit" style="padding:8px 18px;border-radius:8px;border:none;background:#ef4444;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Xuất kho ngay</button>
    </div>
  </form>
</div>`);
};

window.fosSaveXuatKho = function(e) {
  e.preventDefault();
  const item = document.getElementById('fosXkItem').value;
  const qty  = document.getElementById('fosXkQty').value;
  const unit = document.getElementById('fosXkUnit').value;
  _fosClose();
  if (typeof showToast === 'function')
    showToast(`Đã xuất ${qty} ${item} cho ${unit}!`, 'success');
};

// ── 4. Cập nhật số liệu vật tư modal ─────────────────────────────
window.fosUpdateVatTu = function(item) {
  _fosModal(`
<div style="background:#0e1220;border:1px solid rgba(255,255,255,.1);border-radius:16px;width:420px;max-width:100%">
  <div style="padding:17px 22px 13px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between">
    <h3 style="font-size:14px;font-weight:800;color:#fff;margin:0">Cập nhật số liệu — ${item}</h3>
    <button onclick="_fosClose()" style="background:transparent;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:20px">✕</button>
  </div>
  <form onsubmit="fosSaveVatTu(event,'${item}')" style="padding:18px 22px">
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px">
      <div>
        <label style="font-size:10px;font-weight:700;color:rgba(255,255,255,.4);display:block;margin-bottom:4px">Tồn kho</label>
        <input id="vtStock" class="form-control" type="number" min="0" placeholder="0" required/>
      </div>
      <div>
        <label style="font-size:10px;font-weight:700;color:rgba(255,255,255,.4);display:block;margin-bottom:4px">Đã dùng</label>
        <input id="vtUsed" class="form-control" type="number" min="0" placeholder="0"/>
      </div>
      <div>
        <label style="font-size:10px;font-weight:700;color:rgba(255,255,255,.4);display:block;margin-bottom:4px">Đặt thêm</label>
        <input id="vtOrdered" class="form-control" type="number" min="0" placeholder="0"/>
      </div>
    </div>
    <div style="margin-bottom:14px">
      <label style="font-size:10px;font-weight:700;color:rgba(255,255,255,.4);display:block;margin-bottom:4px">Kho lưu trữ</label>
      <input id="vtLocation" class="form-control" placeholder="VD: Kho Chi cục Q. Hà Đông" style="width:100%"/>
    </div>
    <div style="margin-bottom:16px">
      <label style="font-size:10px;font-weight:700;color:rgba(255,255,255,.4);display:block;margin-bottom:4px">Ghi chú</label>
      <input id="vtNote" class="form-control" placeholder="Tình trạng, hạn sử dụng..." style="width:100%"/>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button type="button" onclick="_fosClose()" style="padding:7px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:transparent;color:rgba(255,255,255,.5);font-size:12px;cursor:pointer">Hủy</button>
      <button type="submit" style="padding:7px 16px;border-radius:8px;border:none;background:#10b981;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Lưu số liệu</button>
    </div>
  </form>
</div>`);
};

window.fosSaveVatTu = function(e, item) {
  e.preventDefault();
  _fosClose();
  if (typeof showToast === 'function') showToast(`Đã cập nhật số liệu: ${item}`, 'success');
};

// ── 5. Xuất phiếu vật tư ─────────────────────────────────────────
window.fosXuatPhieu = function(item) {
  _fosModal(`
<div style="background:#0e1220;border:1px solid rgba(255,255,255,.1);border-radius:16px;width:480px;max-width:100%">
  <div style="padding:17px 22px 13px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between">
    <h3 style="font-size:14px;font-weight:800;color:#fff;margin:0">Phiếu Xuất kho — ${item}</h3>
    <button onclick="_fosClose()" style="background:transparent;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:20px">✕</button>
  </div>
  <form onsubmit="fosSavePhieu(event,'${item}')" style="padding:18px 22px">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
      <div>
        <label style="font-size:10px;font-weight:700;color:rgba(255,255,255,.4);display:block;margin-bottom:4px">Số lượng xuất *</label>
        <input id="phQty" class="form-control" type="number" min="1" placeholder="Số lượng" required/>
      </div>
      <div>
        <label style="font-size:10px;font-weight:700;color:rgba(255,255,255,.4);display:block;margin-bottom:4px">Đơn vị tính</label>
        <select id="phUnit2" class="form-control">
          <option>cái</option><option>bao</option><option>tấn</option><option>m³</option><option>chiếc</option><option>bộ</option>
        </select>
      </div>
    </div>
    <div style="margin-bottom:12px">
      <label style="font-size:10px;font-weight:700;color:rgba(255,255,255,.4);display:block;margin-bottom:4px">Đơn vị/người nhận *</label>
      <input id="phReceiver" class="form-control" placeholder="Họ tên / đơn vị nhận" required style="width:100%"/>
    </div>
    <div style="margin-bottom:12px">
      <label style="font-size:10px;font-weight:700;color:rgba(255,255,255,.4);display:block;margin-bottom:4px">Mục đích sử dụng</label>
      <input id="phPurpose" class="form-control" placeholder="Ứng phó lũ / Gia cố đê / Thoát úng..." style="width:100%"/>
    </div>
    <div style="margin-bottom:16px">
      <label style="font-size:10px;font-weight:700;color:rgba(255,255,255,.4);display:block;margin-bottom:4px">Người phê duyệt</label>
      <select id="phApprover" class="form-control" style="width:100%">
        <option>Chi cục trưởng Lê Văn Nam</option>
        <option>PCC Nguyễn Thị Hà</option>
        <option>Trưởng phòng Kế hoạch</option>
      </select>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button type="button" onclick="_fosClose()" style="padding:7px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:transparent;color:rgba(255,255,255,.5);font-size:12px;cursor:pointer">Hủy</button>
      <button type="submit" style="padding:7px 16px;border-radius:8px;border:none;background:#a78bfa;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Tạo phiếu xuất kho</button>
    </div>
  </form>
</div>`);
};

window.fosSavePhieu = function(e, item) {
  e.preventDefault();
  const phieuId = 'PXK-' + String(Date.now()).slice(-6);
  const qty = document.getElementById('phQty').value;
  const unit2 = document.getElementById('phUnit2').value;
  _fosClose();
  if (typeof showToast === 'function') showToast(`Đã tạo phiếu ${phieuId}: xuất ${qty} ${unit2} ${item}`, 'success');
};

// ── 6. Triệu tập lực lượng (confirmation modal) ───────────────────
window.fosTrieuTap = function() {
  _fosModal(`
<div style="background:#0e1220;border:1px solid rgba(255,255,255,.1);border-radius:16px;width:440px;max-width:100%;padding:24px">
  <div style="text-align:center;margin-bottom:18px">
    <div style="width:52px;height:52px;border-radius:14px;background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.3);margin:0 auto 12px;display:flex;align-items:center;justify-content:center">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
    </div>
    <h3 style="font-size:16px;font-weight:800;color:#fff;margin:0 0 6px">Lệnh Triệu tập Lực lượng</h3>
    <p style="font-size:12px;color:rgba(255,255,255,.45);margin:0">Thông báo sẽ được gửi đa kênh đến tất cả đơn vị</p>
  </div>
  <div style="margin-bottom:14px">
    <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:6px">Phạm vi triệu tập</label>
    <select id="ttScope" class="form-control" style="width:100%">
      <option value="all">Toàn bộ lực lượng (tất cả đơn vị)</option>
      <option value="response">Chỉ đội ứng phó nhanh</option>
      <option value="pump">Chỉ đội máy bơm + thoát úng</option>
    </select>
  </div>
  <div style="margin-bottom:14px">
    <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:6px">Thời gian tập kết</label>
    <input id="ttTime" class="form-control" type="datetime-local" value="${new Date(Date.now()+3600000).toISOString().slice(0,16)}"/>
  </div>
  <div style="margin-bottom:16px">
    <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:6px">Địa điểm tập kết</label>
    <input id="ttLocation" class="form-control" placeholder="VD: Trụ sở Chi cục / Điếm đê K+5" style="width:100%"/>
  </div>
  <div style="display:flex;gap:8px;justify-content:flex-end">
    <button onclick="_fosClose()" style="padding:8px 16px;border-radius:8px;border:1px solid rgba(255,255,255,.12);background:transparent;color:rgba(255,255,255,.5);font-size:12px;cursor:pointer">Hủy</button>
    <button onclick="_doTrieuTap()" style="padding:8px 18px;border-radius:8px;border:none;background:#ef4444;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Gửi lệnh triệu tập</button>
  </div>
</div>`);
};

window._doTrieuTap = function() {
  const scope = document.getElementById('ttScope').value;
  const loc = document.getElementById('ttLocation').value || 'Trụ sở Chi cục TT-PCTT';
  const labels = { all:'toàn bộ lực lượng', response:'đội ứng phó nhanh', pump:'đội máy bơm' };
  _fosClose();
  if (typeof showToast === 'function')
    showToast(`Đã gửi lệnh triệu tập ${labels[scope]||scope} — Tập kết tại: ${loc}`, 'success');
};
