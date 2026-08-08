// ── HADIWA IOC — Early Warning Modals (alerts.js supplement) ──────
// Implements: ewDetailAlert, ewOpenNewRule — previously toast-only stubs
// Also: fixes ewTab active-class bug (same issue as dikeManagement)

// Shared modal overlay for alerts page
function _ewModal(html) {
  let el = document.getElementById('ewModalOverlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'ewModalOverlay';
    el.style.cssText = 'position:fixed;inset:0;z-index:9300;background:rgba(0,0,0,.72);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:20px';
    el.addEventListener('click', e => { if (e.target === el) _ewClose(); });
    document.body.appendChild(el);
  }
  el.innerHTML = html;
  el.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function _ewClose() {
  const el = document.getElementById('ewModalOverlay');
  if (el) { el.style.display = 'none'; el.innerHTML = ''; }
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') _ewClose(); });

// ── Fix ewTab: also update active button state ─────────────────────
// Patch on top of existing ewTab function
const _ewTabOrig = typeof ewTab === 'function' ? ewTab : null;
window.ewTab = function(tab) {
  if (_ewTabOrig) _ewTabOrig(tab);
  else {
    // Fallback if ewTab not yet defined
    if (typeof ewState !== 'undefined') ewState.tab = tab;
    const c = document.getElementById('ewContent');
    if (c && typeof ewRenderTab === 'function') c.innerHTML = ewRenderTab();
  }
  // Update button active classes
  document.querySelectorAll('.ew-tab,.tab-btn').forEach(btn => {
    const tabIds = ['alerts','rules','matrix','channels'];
    const match = tabIds.some(t => btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${t}'`) && t === tab);
    if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${tab}'`)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
};

// ──────────────────────────────────────────────────────────────────
// ewDetailAlert(id) — Full alert detail modal with action steps
// ──────────────────────────────────────────────────────────────────
window.ewDetailAlert = function(id) {
  const alerts = typeof EW_ALERTS !== 'undefined' ? EW_ALERTS : [];
  const a = alerts.find(x => x.id === id);
  if (!a) return;

  const sevColor = { critical:'var(--alert-critical)', high:'var(--alert-bd3)', medium:'var(--alert-bd2)', low:'var(--alert-bd1)' };
  const sevLabel = { critical:'Khẩn cấp', high:'Cao', medium:'Trung bình', low:'Thấp' };
  const sc = sevColor[a.severity] || 'var(--text-subtle)';
  const sl = sevLabel[a.severity] || a.severity;

  const steps = [
    { n:1, title:'Xác minh cảnh báo', desc:`Kiểm tra dữ liệu trạm ${a.station}: mực nước/lượng mưa thực tế. Liên hệ cán bộ trực tại hiện trường xác nhận.`, done: a.status!=='new' },
    { n:2, title:'Thông báo lãnh đạo', desc:'Báo cáo ngay Chi cục trưởng / Phó Chi cục trưởng trực ban về tình huống cảnh báo.', done: a.status==='done' },
    { n:3, title:'Kích hoạt quy trình ứng phó', desc:'Gửi cảnh báo đến các đơn vị liên quan: đội ứng phó, chính quyền địa phương, người dân vùng ảnh hưởng.', done: a.status==='done' },
    { n:4, title:'Điều động lực lượng', desc:'Triển khai lực lượng, phương tiện, vật tư đến vị trí cần thiết. Cập nhật trạng thái trên hệ thống.', done: false },
    { n:5, title:'Báo cáo & Theo dõi liên tục', desc:'Ghi nhận diễn biến theo từng giờ. Cập nhật bản tin thủy văn. Sẵn sàng nâng cấp phương án.', done: false },
  ];

  _ewModal(`
<div style="background:#0e1220;border:1px solid rgba(255,255,255,.1);border-radius:18px;width:720px;max-width:100%;max-height:90vh;overflow:hidden;display:flex;flex-direction:column">
  <!-- Header -->
  <div style="padding:20px 24px 16px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;gap:14px;align-items:flex-start">
    <div style="width:44px;height:44px;border-radius:12px;background:color-mix(in srgb, ${sc} 18%, transparent);border:1px solid color-mix(in srgb, ${sc} 44%, transparent);display:flex;align-items:center;justify-content:center;flex-shrink:0">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${sc}" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    </div>
    <div style="flex:1">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap">
        <span style="font-family:monospace;font-size:11px;color:#5BA9FF">${a.id}</span>
        <span style="padding:1px 8px;border-radius:20px;font-size:10px;font-weight:800;background:color-mix(in srgb, ${sc} 20%, transparent);color:${sc};border:1px solid color-mix(in srgb, ${sc} 44%, transparent)">${sl}</span>
        <span style="font-size:10px;color:rgba(255,255,255,.35)">${a.time}</span>
      </div>
      <h2 style="font-size:16px;font-weight:800;color:#fff;margin:0">${a.station}</h2>
      <div style="font-size:12px;color:rgba(255,255,255,.5);margin-top:2px">${a.message || a.type}</div>
    </div>
    <div style="display:flex;gap:6px;align-items:center">
      ${a.status === 'new' ? `<button onclick="ewAckAlert('${a.id}');_ewClose()" style="padding:7px 14px;border-radius:8px;border:none;background:#f59e0b;color:#0e1220;font-size:11px;font-weight:800;cursor:pointer">Tiếp nhận xử lý</button>` : ''}
      <button onclick="_ewClose()" style="background:transparent;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:20px">✕</button>
    </div>
  </div>

  <!-- Body -->
  <div style="overflow-y:auto;flex:1;padding:20px 24px">
    <!-- Values -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px">
      ${[
        ['Giá trị đo', a.value, sc],
        ['Ngưỡng cảnh báo', a.threshold||'—', '#f59e0b'],
        ['Vượt ngưỡng', a.value && a.threshold ? (parseFloat(a.value)-parseFloat(a.threshold)).toFixed(2)+' m' : '—', '#ef4444'],
      ].map(([l,v,c]) => `<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:10px 12px">
        <div style="font-size:9px;font-weight:700;color:rgba(255,255,255,.32);text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px">${l}</div>
        <div style="font-size:20px;font-weight:900;color:${c};font-family:monospace">${v}</div>
      </div>`).join('')}
    </div>

    <!-- AI Response Steps -->
    <div style="font-size:11px;font-weight:800;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px">
      Quy trình ứng phó tự động (AI)
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${steps.map((s, i) => `
      <div style="display:flex;gap:12px;align-items:flex-start;padding:12px 14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;${s.done?'opacity:.5':''}">
        <div style="width:28px;height:28px;border-radius:50%;${s.done?'background:var(--success)':'background:rgba(255,255,255,.06);border:2px solid rgba(255,255,255,.15)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:12px;font-weight:800;color:${s.done?'#fff':'rgba(255,255,255,.4)'}">
          ${s.done ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>` : s.n}
        </div>
        <div>
          <div style="font-size:12px;font-weight:700;color:${s.done?'rgba(255,255,255,.4)':'#fff'};margin-bottom:3px">${s.title}</div>
          <div style="font-size:11px;color:rgba(255,255,255,.45);line-height:1.5">${s.desc}</div>
          ${!s.done ? `<button class="ew-step-action" style="border:none;cursor:pointer;margin-top:6px" onclick="_ewClose();navigate('${['gis','scada','workflows','plants','dashboard'][i]||'gis'}')">Thực hiện ngay →</button>` : ''}
        </div>
      </div>`).join('')}
    </div>
  </div>

  <!-- Footer -->
  <div style="padding:14px 24px;border-top:1px solid rgba(255,255,255,.07);display:flex;gap:8px;justify-content:flex-end">
    <button onclick="ewDispatch('${a.id}')" style="padding:7px 14px;border-radius:8px;border:none;background:var(--purple);color:#fff;font-size:12px;font-weight:700;cursor:pointer">Điều phối xử lý</button>
    <button onclick="ewSendAlert('${a.id}')" style="padding:7px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:#fff;font-size:12px;font-weight:600;cursor:pointer">Gửi cảnh báo PA/Zalo</button>
    <button onclick="_ewClose()" style="padding:7px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.08);background:transparent;color:rgba(255,255,255,.45);font-size:12px;cursor:pointer">Đóng</button>
  </div>
</div>`);
};

window.ewDispatch = function(id) {
  _ewClose();
  if (typeof showToast === 'function') showToast(`Đã gửi lệnh điều phối ứng phó cảnh báo ${id}`, 'success');
};
window.ewSendAlert = function(id) {
  _ewClose();
  if (typeof showToast === 'function') showToast(`Đã phát cảnh báo đa kênh (PA+Zalo+SMS) cho ${id}`, 'success');
};

// ──────────────────────────────────────────────────────────────────
// ewOpenNewRule(id) — Form to create or edit alert threshold rule
// ──────────────────────────────────────────────────────────────────
window.ewOpenNewRule = function(id = null) {
  const rules = typeof EW_RULES !== 'undefined' ? EW_RULES : [];
  const r = id ? rules.find(x => x.id === id || String(x.id) === String(id)) : null;
  const isEdit = !!r;

  _ewModal(`
<div style="background:#0e1220;border:1px solid rgba(255,255,255,.1);border-radius:16px;width:560px;max-width:100%">
  <div style="padding:18px 22px 14px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between">
    <h3 style="font-size:15px;font-weight:800;color:#fff;margin:0;display:flex;align-items:center;gap:8px">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--warning-text)" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
      ${isEdit ? 'Chỉnh sửa quy tắc cảnh báo' : 'Thiết lập quy tắc cảnh báo mới'}
    </h3>
    <button onclick="_ewClose()" style="background:transparent;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:20px">✕</button>
  </div>
  <form onsubmit="ewSaveRule(event, ${id ? `'${id}'` : 'null'})" style="padding:20px 22px">
    <div style="margin-bottom:12px">
      <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Tên quy tắc *</label>
      <input id="ruleNameInp" class="form-control" placeholder="VD: Mực nước sông Hồng vượt BD2" required style="width:100%" value="${isEdit ? r.name : ''}"/>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Trạm / cảm biến</label>
        <select id="ruleSensor" class="form-control" style="width:100%">
          <option ${isEdit && r.station==='Tất cả trạm'?'selected':''}>Tất cả trạm</option>
          <option ${isEdit && r.station.includes('Sông Hồng')?'selected':''}>Sông Hồng — Hà Nội</option>
          <option ${isEdit && r.station.includes('Sông Đáy')?'selected':''}>Sông Đáy — Quốc Oai</option>
          <option ${isEdit && r.station.includes('Sông Tích')?'selected':''}>Sông Tích — Sơn Tây</option>
          <option ${isEdit && r.station.includes('Sông Bùi')?'selected':''}>Sông Bùi — Xuân Mai</option>
          <option ${isEdit && r.station.includes('Sông Nhuệ')?'selected':''}>Sông Nhuệ — Hà Đông</option>
        </select>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Thông số đo</label>
        <select id="ruleMetric" class="form-control" style="width:100%">
          <option value="waterLevel" ${isEdit && r.param.includes('Mực nước')?'selected':''}>Mực nước (m)</option>
          <option value="rainfall" ${isEdit && r.param.includes('Lượng mưa')?'selected':''}>Lượng mưa (mm)</option>
          <option value="flow" ${isEdit && r.param.includes('Lưu lượng')?'selected':''}>Lưu lượng (m³/s)</option>
        </select>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px">
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Điều kiện</label>
        <select id="ruleOp" class="form-control">
          <option value="gte" ${isEdit && r.op==='>='?'selected':''}>≥ (lớn hơn hoặc bằng)</option>
          <option value="gt" ${isEdit && (r.op==='>' || !r.op)?'selected':''}>&gt; (lớn hơn)</option>
          <option value="lte" ${isEdit && r.op==='<='?'selected':''}>≤ (nhỏ hơn hoặc bằng)</option>
        </select>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Ngưỡng *</label>
        <input id="ruleThreshold" class="form-control" type="number" step="0.01" placeholder="9.50" required value="${isEdit ? (parseFloat(r.val) || r.val) : ''}"/>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Mức độ</label>
        <select id="ruleSeverity" class="form-control">
          <option value="low" ${isEdit && r.severity==='low'?'selected':''}>Thấp</option>
          <option value="medium" ${isEdit && r.severity==='medium'?'selected':''}>Trung bình</option>
          <option value="high" ${isEdit && r.severity==='high'?'selected':''}>Cao</option>
          <option value="critical" ${isEdit && r.severity==='critical'?'selected':''}>Khẩn cấp</option>
        </select>
      </div>
    </div>
    <div style="margin-bottom:12px">
      <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:6px">Kênh thông báo khi kích hoạt</label>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${[['app','Push App','var(--purple)'],['zalo','Zalo OA','#06b6d4'],['sms','SMS','var(--success)'],['pa','Loa PA','#f59e0b'],['email','Email','var(--text-subtle)']].map(([v,l,c]) => {
          const isChecked = isEdit ? r.channels.includes(v) : true;
          return `<label style="display:flex;align-items:center;gap:5px;font-size:11px;cursor:pointer;padding:4px 10px;border-radius:20px;border:1px solid ${c}44;background:${c}12;color:${c}">
            <input type="checkbox" name="ruleChan" value="${v}" ${isChecked ? 'checked' : ''} style="accent-color:${c}"/> ${l}
          </label>`;
        }).join('')}
      </div>
    </div>
    <div style="margin-bottom:18px">
      <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Hành động khi kích hoạt</label>
      <select id="ruleAction" class="form-control" style="width:100%">
        <option>Gửi cảnh báo tự động đa kênh</option>
        <option>Tạo sự cố trong hệ thống</option>
        <option>Gửi cảnh báo + Tạo sự cố</option>
        <option>Gửi cảnh báo + Đề xuất điều phối</option>
      </select>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button type="button" onclick="_ewClose()" style="padding:8px 16px;border-radius:8px;border:1px solid rgba(255,255,255,.12);background:transparent;color:rgba(255,255,255,.5);font-size:12px;cursor:pointer">Hủy</button>
      <button type="submit" style="padding:8px 18px;border-radius:8px;border:none;background:#f59e0b;color:#0e1220;font-size:12px;font-weight:800;cursor:pointer">${isEdit ? 'Cập nhật' : 'Tạo quy tắc'}</button>
    </div>
  </form>
</div>`);
};

window.ewSaveRule = function(e, id = null) {
  e.preventDefault();
  const name = document.getElementById('ruleNameInp').value;
  const thresh = document.getElementById('ruleThreshold').value;
  const sev = document.getElementById('ruleSeverity').value;
  const sensor = document.getElementById('ruleSensor').value;
  const metric = document.getElementById('ruleMetric').options[document.getElementById('ruleMetric').selectedIndex].text;
  const op = document.getElementById('ruleOp').value === 'gte' ? '>=' : document.getElementById('ruleOp').value === 'gt' ? '>' : '<=';
  
  const channels = Array.from(document.querySelectorAll('input[name="ruleChan"]:checked')).map(el => el.value);

  const rules = typeof EW_RULES !== 'undefined' ? EW_RULES : [];
  
  if (id) {
    const r = rules.find(x => x.id === id || String(x.id) === String(id));
    if (r) {
      r.name = name;
      r.val = thresh;
      r.severity = sev;
      r.station = sensor;
      r.param = metric;
      r.op = op;
      r.channels = channels;
      if (typeof showToast === 'function') showToast(`Đã cập nhật quy tắc: "${name}"`, 'success');
    }
  } else {
    rules.unshift({ 
      id: 'RULE-' + String(Date.now()).slice(-5), 
      name, 
      station: sensor, 
      param: metric, 
      op: op, 
      val: thresh, 
      severity: sev, 
      active: true, 
      channels: channels 
    });
    if (typeof showToast === 'function') showToast(`Đã tạo quy tắc cảnh báo mới: "${name}"`, 'success');
  }
  
  _ewClose();
  if (typeof ewTab === 'function') ewTab('rules');
};

// ──────────────────────────────────────────────────────────────────
// ewProcessAlert(id) — Workflow modal to handle/resolve an alert
// ──────────────────────────────────────────────────────────────────
window.ewProcessAlert = function(id) {
  const alerts = typeof EW_ALERTS !== 'undefined' ? EW_ALERTS : [];
  const a = alerts.find(x => x.id === id);
  if (!a) return;

  _ewModal(`
<div style="background:#0e1220;border:1px solid rgba(255,255,255,.1);border-radius:18px;width:540px;max-width:100%">
  <div style="padding:18px 22px 14px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between">
    <h3 style="font-size:15px;font-weight:800;color:#fff;margin:0;display:flex;align-items:center;gap:8px">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--warning-text)" stroke-width="2.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
      Xử lý Cảnh báo: ${a.id}
    </h3>
    <button onclick="_ewClose()" style="background:transparent;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:20px">✕</button>
  </div>
  <div style="padding:20px 22px">
    <div style="background:rgba(255,255,255,.03);padding:12px;border-radius:10px;margin-bottom:16px;border-left:3px solid #fbbf24">
      <div style="font-size:13px;font-weight:700;color:#fff">${a.station} — ${a.param}</div>
      <div style="font-size:12px;color:rgba(255,255,255,.5);margin-top:4px">${a.desc}</div>
    </div>
    
    <div style="margin-bottom:16px">
      <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:8px">Chọn hành động xử lý</label>
      <div style="display:grid;gap:8px">
        ${[
          { id:'ack', label:'Tiếp nhận & Theo dõi', desc:'Chuyển trạng thái sang "Đang xử lý"' },
          { id:'delegate', label:'Điều phối lực lượng', desc:'Giao việc cho đội ứng cứu hiện trường' },
          { id:'resolve', label:'Đóng cảnh báo (Hoàn thành)', desc:'Xác nhận tình huống đã an toàn' },
          { id:'false', label:'Báo động giả / Sai số', desc:'Loại bỏ cảnh báo khỏi danh mục' }
        ].map(opt => `
          <label style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid rgba(255,255,255,.08);border-radius:10px;cursor:pointer;transition:.2s" onmouseover="this.style.background='rgba(255,255,255,.04)'" onmouseout="this.style.background='transparent'">
            <input type="radio" name="ewAction" value="${opt.id}" ${opt.id==='ack'?'checked':''} style="accent-color:#fbbf24"/>
            <div>
              <div style="font-size:13px;font-weight:600;color:#fff">${opt.label}</div>
              <div style="font-size:11px;color:rgba(255,255,255,.4)">${opt.desc}</div>
            </div>
          </label>
        `).join('')}
      </div>
    </div>
    
    <div style="margin-bottom:20px">
      <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:6px">Ghi chú xử lý</label>
      <textarea id="ewProcessNote" class="form-control" style="width:100%;height:80px;resize:none" placeholder="Nhập nội dung xử lý..."></textarea>
    </div>
    
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button onclick="_ewClose()" style="padding:9px 18px;border-radius:8px;border:1px solid rgba(255,255,255,.12);background:transparent;color:rgba(255,255,255,.5);font-size:13px;cursor:pointer">Hủy</button>
      <button onclick="ewStepExecute('${a.id}')" style="padding:9px 22px;border-radius:8px;border:none;background:#fbbf24;color:#0e1220;font-size:13px;font-weight:800;cursor:pointer">Xác nhận Xử lý</button>
    </div>
  </div>
</div>`);
};

window.ewStepExecute = function(id) {
  const action = document.querySelector('input[name="ewAction"]:checked').value;
  const note = document.getElementById('ewProcessNote').value;
  const alerts = typeof EW_ALERTS !== 'undefined' ? EW_ALERTS : [];
  const a = alerts.find(x => x.id === id);
  
  if (a) {
    if (action === 'resolve' || action === 'false') {
      a.status = 'done';
    } else {
      a.status = 'handling';
    }
  }
  
  _ewClose();
  if (typeof showToast === 'function') showToast('Đã lưu kết quả xử lý cảnh báo', 'success');
  if (typeof ewTab === 'function') ewTab('alerts');
};

// Patch ewAckAlert to use the new process modal
window.ewAckAlert = function(id) {
  ewProcessAlert(id);
};
