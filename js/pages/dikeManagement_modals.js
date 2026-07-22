// ── HADIWA IOC — Dike Management Supplement (v5.3+) ────────────────
// Implements: dmViewDike, dmOpenPatrolLog, dmNewViolation, dmViewViolation
// Edit patrol entry, dike status update, vulnerability lập phiếu

// ── Modal helper ───────────────────────────────────────────────────
function dmShowModal(html) {
  let el = document.getElementById('dmModalOverlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'dmModalOverlay';
    el.style.cssText = 'position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px';
    el.addEventListener('click', e => { if (e.target === el) dmCloseModal(); });
    document.body.appendChild(el);
  }
  el.innerHTML = html;
  el.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function dmCloseModal() {
  const el = document.getElementById('dmModalOverlay');
  if (el) { el.style.display = 'none'; el.innerHTML = ''; }
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') dmCloseModal(); });

// ──────────────────────────────────────────────────────────────────
// 1. dmViewDike(id) — Full detail modal for a dike segment
// ──────────────────────────────────────────────────────────────────
function dmViewDike(id) {
  const d = (typeof DIKE_REGISTRY !== 'undefined' ? DIKE_REGISTRY : []).find(x => x.id === id);
  if (!d) return;

  const vulnList = (typeof DIKE_VULNERABLE !== 'undefined' ? DIKE_VULNERABLE : []).filter(v => v.dikeId === id);
  const patrols  = (typeof DIKE_PATROLS   !== 'undefined' ? DIKE_PATROLS   : []).filter(p => p.dikeId === id);

  const typeLabel = { cap1:'Đê cấp I (Quốc gia)', cap2:'Đê cấp II', local:'Đê địa phương' };
  const typeColor = { cap1:'#ef4444', cap2:'#f59e0b', local:'#3b82f6' };
  const statusColor= { ok:'#10b981', warning:'#f59e0b', danger:'#f97316', critical:'#ef4444' };
  const sc = statusColor[d.status] || '#6b7280';
  const tc = typeColor[d.type] || '#6b7280';
  const sevColor = { emergency:'#ef4444', critical:'#ef4444', warning:'#f59e0b', info:'#3b82f6' };
  const sevLabel = { emergency:'Khẩn cấp', critical:'Nghiêm trọng', warning:'Cảnh báo', info:'Thông tin' };

  dmShowModal(`
<div style="background:#0e1220;border:1px solid rgba(255,255,255,.1);border-radius:18px;width:860px;max-width:100%;max-height:90vh;overflow:hidden;display:flex;flex-direction:column;">
  <!-- Header -->
  <div style="padding:20px 24px 16px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:10px">
    <div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
        <span style="font-family:monospace;font-size:12px;color:#a78bfa;font-weight:700">${d.id}</span>
        <span style="padding:2px 10px;border-radius:20px;font-size:10px;font-weight:800;background:${tc}20;color:${tc};border:1px solid ${tc}44">${typeLabel[d.type]||d.type}</span>
        <span style="padding:2px 10px;border-radius:20px;font-size:10px;font-weight:800;background:${sc}20;color:${sc};border:1px solid ${sc}44">${d.condition}</span>
      </div>
      <h2 style="font-size:17px;font-weight:800;color:#fff;margin:0">${d.name}</h2>
      <div style="font-size:12px;color:rgba(255,255,255,.4);margin-top:3px">${d.district}</div>
    </div>
    <div style="display:flex;gap:8px;align-items:center">
      <button onclick="dmEditDike('${d.id}')" style="padding:7px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:#fff;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        Chỉnh sửa
      </button>
      <button onclick="dmCloseModal()" style="width:32px;height:32px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:transparent;color:rgba(255,255,255,.5);cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center">✕</button>
    </div>
  </div>

  <!-- Body -->
  <div style="overflow-y:auto;padding:20px 24px;flex:1">
    <!-- Stats grid -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px">
      ${[
        ['Chiều dài', d.length + ' km', '#38bdf8'],
        ['Cao trình đỉnh', d.elevation, '#a3e635'],
        ['Kiểm tra gần nhất', d.lastInspect, '#f59e0b'],
        ['Điểm cần xử lý', d.issues, d.issues > 5 ? '#ef4444' : d.issues > 0 ? '#f59e0b' : '#10b981'],
      ].map(([l,v,c]) => `
      <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:10px 14px">
        <div style="font-size:9px;font-weight:700;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px">${l}</div>
        <div style="font-size:18px;font-weight:900;color:${c};font-family:monospace">${v}</div>
      </div>`).join('')}
    </div>

    <!-- Info row -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
      <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:14px">
        <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em">Thông tin cơ bản</div>
        ${[
          ['Sông', d.river],
          ['Phân loại', typeLabel[d.type]||d.type],
          ['Địa bàn', d.district],
          ['Tình trạng hiện tại', d.condition],
        ].map(([k,v]) => `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:12px">
          <span style="color:rgba(255,255,255,.4)">${k}</span><span style="color:#fff;font-weight:600;text-align:right;max-width:200px">${v}</span>
        </div>`).join('')}
      </div>
      <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:14px">
        <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em">Nhật ký tuần tra (${patrols.length})</div>
        ${patrols.length === 0
          ? `<div style="font-size:12px;color:rgba(255,255,255,.3);padding:8px 0">Chưa có nhật ký</div>`
          : patrols.map(p => {
              const alert = p.result.includes('Phát hiện') || p.result.includes('tràn') || p.result.includes('thẩm lậu');
              return `<div style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)">
                <div style="font-size:10px;color:rgba(255,255,255,.35)">${p.date} · ${p.officer} · ${p.post}</div>
                <div style="font-size:11px;color:${alert?'#fbbf24':'rgba(255,255,255,.6)'};line-height:1.5;margin-top:2px">${p.result.substring(0, 100)}${p.result.length>100?'…':''}</div>
              </div>`;
            }).join('')}
      </div>
    </div>

    <!-- Vulnerable points -->
    <div>
      <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">
        Điểm xung yếu trên tuyến (${vulnList.length})
      </div>
      ${vulnList.length === 0
        ? `<div style="font-size:13px;color:rgba(255,255,255,.3);padding:16px;text-align:center;background:rgba(255,255,255,.02);border-radius:10px;border:1px dashed rgba(255,255,255,.08)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" style="display:block;margin:0 auto 8px"><polyline points="20 6 9 17 4 12"/></svg>
            Không có điểm xung yếu — Tuyến đê này đang trong tình trạng tốt</div>`
        : vulnList.map(v => {
            const c = sevColor[v.severity] || '#6b7280';
            const statusLabel = {monitoring:'Đang theo dõi',fixing:'Đang xử lý',emergency_response:'Ứng phó khẩn cấp',pending_violation:'Chờ xử phạt',resolved:'Đã xử lý'}[v.status]||v.status;
            return `<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-left:3px solid ${c};border-radius:10px;padding:12px;margin-bottom:8px;display:flex;gap:12px;align-items:flex-start">
              <div style="flex:1">
                <div style="display:flex;gap:8px;align-items:center;margin-bottom:4px;flex-wrap:wrap">
                  <span style="padding:1px 8px;border-radius:20px;font-size:10px;font-weight:800;background:${c}22;color:${c}">${sevLabel[v.severity]||v.severity}</span>
                  <span style="font-size:12px;font-weight:700;color:#fff">${v.type}</span>
                </div>
                <div style="font-size:11px;color:rgba(255,255,255,.5);margin-bottom:3px">${v.location}</div>
                <div style="font-size:11px;color:rgba(255,255,255,.55);line-height:1.5">${v.desc}</div>
              </div>
              <div style="flex-shrink:0;text-align:right">
                <div style="font-size:10px;font-weight:700;color:${c};padding:3px 10px;border-radius:20px;border:1px solid ${c}44;background:${c}15;white-space:nowrap">${statusLabel}</div>
                <div style="font-size:10px;color:rgba(255,255,255,.3);margin-top:4px">${v.found}</div>
              </div>
            </div>`;
          }).join('')}
    </div>
  </div>

  <!-- Footer -->
  <div style="padding:14px 24px;border-top:1px solid rgba(255,255,255,.07);display:flex;gap:8px;justify-content:flex-end">
    <button onclick="dmOpenPatrolLog('${d.id}')" style="padding:8px 16px;border-radius:8px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:#fff;font-size:12px;font-weight:600;cursor:pointer">
      Ghi nhật ký tuần tra
    </button>
    <button onclick="dmCloseModal()" style="padding:8px 18px;border-radius:8px;border:none;background:rgba(255,255,255,.08);color:#fff;font-size:12px;font-weight:600;cursor:pointer">
      Đóng
    </button>
  </div>
</div>`);
}

// ──────────────────────────────────────────────────────────────────
// 2. dmEditDike(id) — Edit modal for dike status/condition
// ──────────────────────────────────────────────────────────────────
function dmEditDike(id) {
  const d = (typeof DIKE_REGISTRY !== 'undefined' ? DIKE_REGISTRY : []).find(x => x.id === id);
  if (!d) return;
  const stOpts = ['ok','warning','danger','critical'];
  const stLabel= ['Tốt','Cảnh báo','Nguy hiểm','Khẩn cấp'];

  dmShowModal(`
<div style="background:#0e1220;border:1px solid rgba(255,255,255,.1);border-radius:16px;width:520px;max-width:100%">
  <div style="padding:18px 22px 14px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between">
    <h3 style="font-size:15px;font-weight:800;color:#fff;margin:0">Cập nhật thông tin đê — ${d.id}</h3>
    <button onclick="dmCloseModal()" style="background:transparent;border:none;color:rgba(255,255,255,.5);cursor:pointer;font-size:18px">✕</button>
  </div>
  <form onsubmit="dmSaveDike(event,'${id}')" style="padding:20px 22px">
    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Tên tuyến đê</label>
      <input id="dkeName" class="form-control" value="${d.name}" style="width:100%"/>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Chiều dài (km)</label>
        <input id="dkeLength" class="form-control" type="number" step="0.1" value="${d.length}"/>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Cao trình đỉnh</label>
        <input id="dkeElevation" class="form-control" value="${d.elevation}"/>
      </div>
    </div>
    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Tình trạng hiện tại</label>
      <select id="dkeStatus" class="form-control" style="width:100%">
        ${stOpts.map((s,i) => `<option value="${s}" ${d.status===s?'selected':''}>${stLabel[i]}</option>`).join('')}
      </select>
    </div>
    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Địa bàn</label>
      <input id="dkeDistrict" class="form-control" value="${d.district}" style="width:100%"/>
    </div>
    <div style="margin-bottom:18px">
      <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Số điểm cần xử lý</label>
      <input id="dkeIssues" class="form-control" type="number" min="0" value="${d.issues}" style="width:100%"/>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button type="button" onclick="dmCloseModal()" style="padding:8px 16px;border-radius:8px;border:1px solid rgba(255,255,255,.12);background:transparent;color:rgba(255,255,255,.6);font-size:12px;cursor:pointer">Hủy</button>
      <button type="submit" style="padding:8px 18px;border-radius:8px;border:none;background:#7c3aed;color:#fff;font-size:12px;font-weight:700;cursor:pointer">Lưu thay đổi</button>
    </div>
  </form>
</div>`);
}

function dmSaveDike(e, id) {
  e.preventDefault();
  const d = (typeof DIKE_REGISTRY !== 'undefined' ? DIKE_REGISTRY : []).find(x => x.id === id);
  if (!d) return;
  const stLabel= { ok:'Tốt', warning:'Cảnh báo', danger:'Nguy hiểm', critical:'Khẩn cấp' };
  d.name      = document.getElementById('dkeName').value;
  d.length    = parseFloat(document.getElementById('dkeLength').value) || d.length;
  d.elevation = document.getElementById('dkeElevation').value;
  d.status    = document.getElementById('dkeStatus').value;
  d.condition = stLabel[d.status] || d.status;
  d.district  = document.getElementById('dkeDistrict').value;
  d.issues    = parseInt(document.getElementById('dkeIssues').value) || 0;
  d.lastInspect = new Date().toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' }).replace(/\//g, '/');
  dmCloseModal();
  if (typeof showToast === 'function') showToast(`Đã cập nhật thông tin tuyến đê ${id}`, 'success');
  // Re-render the page content
  const area = document.getElementById('contentArea') || document.querySelector('.page-content');
  if (area && typeof renderDikeManagement === 'function') area.innerHTML = renderDikeManagement();
}

// ──────────────────────────────────────────────────────────────────
// 3. dmOpenPatrolLog(dikeId?) — Form modal to add a patrol entry
// ──────────────────────────────────────────────────────────────────
function dmOpenPatrolLog(dikeId) {
  const registry = typeof DIKE_REGISTRY !== 'undefined' ? DIKE_REGISTRY : [];
  dmShowModal(`
<div style="background:#0e1220;border:1px solid rgba(255,255,255,.1);border-radius:16px;width:560px;max-width:100%">
  <div style="padding:18px 22px 14px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between">
    <h3 style="font-size:15px;font-weight:800;color:#fff;margin:0;display:flex;align-items:center;gap:8px">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      Ghi Nhật ký Tuần tra Đê
    </h3>
    <button onclick="dmCloseModal()" style="background:transparent;border:none;color:rgba(255,255,255,.5);cursor:pointer;font-size:18px">✕</button>
  </div>
  <form onsubmit="dmSavePatrol(event)" style="padding:20px 22px">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Tuyến đê *</label>
        <select id="ptDikeId" class="form-control" style="width:100%">
          ${registry.map(d => `<option value="${d.id}" ${d.id===dikeId?'selected':''}>${d.name.substring(0,30)}</option>`).join('')}
        </select>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Điếm canh *</label>
        <input id="ptPost" class="form-control" placeholder="VD: Điếm K+5" required/>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Cán bộ tuần tra *</label>
        <input id="ptOfficer" class="form-control" placeholder="Họ và tên" required/>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Thời gian</label>
        <input id="ptDate" class="form-control" type="datetime-local" value="${new Date().toISOString().substring(0,16)}"/>
      </div>
    </div>
    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Kết quả ghi nhận *</label>
      <textarea id="ptResult" class="form-control" rows="4" placeholder="Mô tả tình hình đê điều, phát hiện bất thường (nếu có)..." required style="resize:vertical;width:100%"></textarea>
    </div>
    <div style="margin-bottom:18px">
      <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:8px">Tình trạng phát hiện</label>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${[['normal','Bình thường','#10b981'],['crack','Nứt mặt đê','#f59e0b'],['seepage','Thẩm lậu','#f97316'],['overflow','Tràn mặt','#ef4444'],['other','Bất thường khác','#6b7280']].map(([v,l,c]) =>
          `<label style="display:flex;align-items:center;gap:6px;font-size:12px;color:${c};cursor:pointer;padding:4px 10px;border-radius:20px;border:1px solid ${c}44;background:${c}12">
            <input type="radio" name="ptType" value="${v}" ${v==='normal'?'checked':''} style="accent-color:${c}"/> ${l}
          </label>`).join('')}
      </div>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button type="button" onclick="dmCloseModal()" style="padding:8px 16px;border-radius:8px;border:1px solid rgba(255,255,255,.12);background:transparent;color:rgba(255,255,255,.6);font-size:12px;cursor:pointer">Hủy</button>
      <button type="submit" style="padding:8px 18px;border-radius:8px;border:none;background:#38bdf8;color:#0e1220;font-size:12px;font-weight:800;cursor:pointer">Lưu nhật ký</button>
    </div>
  </form>
</div>`);
}

function dmSavePatrol(e) {
  e.preventDefault();
  const now = new Date();
  const dtInput = document.getElementById('ptDate').value;
  const dt = dtInput ? new Date(dtInput) : now;
  const dateStr = dt.toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).replace(', ',' ');
  const newEntry = {
    id: 'PT-' + String(Date.now()).slice(-6),
    dikeId: document.getElementById('ptDikeId').value,
    officer: document.getElementById('ptOfficer').value,
    post:    document.getElementById('ptPost').value,
    date:    dateStr,
    result:  document.getElementById('ptResult').value,
    coord:   [21.0, 105.8],
  };
  if (typeof DIKE_PATROLS !== 'undefined') DIKE_PATROLS.unshift(newEntry);
  dmCloseModal();
  if (typeof showToast === 'function') showToast('Đã ghi nhật ký tuần tra thành công!', 'success');
  // Refresh tab
  if (typeof dmTab === 'function') dmTab('patrol');
  else if (typeof dikeState !== 'undefined') { dikeState.tab = 'patrol'; const a=document.getElementById('contentArea')||document.querySelector('.page-content'); if(a&&typeof renderDikeManagement==='function') a.innerHTML=renderDikeManagement(); }
}

// ──────────────────────────────────────────────────────────────────
// 4. dmViewViolation(id) — Biên bản vi phạm detail modal
// ──────────────────────────────────────────────────────────────────
function dmViewViolation(id) {
  const violations = typeof DIKE_VIOLATIONS !== 'undefined' ? DIKE_VIOLATIONS : [];
  const registry   = typeof DIKE_REGISTRY   !== 'undefined' ? DIKE_REGISTRY   : [];
  const v = violations.find(x => x.id === id);
  if (!v) return;
  const dike = registry.find(d => d.id === v.dikeId) || {};
  const scMap = { pending:'#f59e0b', fined:'#a78bfa', resolved:'#10b981' };
  const slMap = { pending:'Chờ xử lý', fined:'Đã phạt', resolved:'Đã giải quyết' };
  const sc = scMap[v.status] || '#6b7280';

  dmShowModal(`
<div style="background:#0e1220;border:1px solid rgba(255,255,255,.1);border-radius:16px;width:620px;max-width:100%">
  <div style="padding:18px 22px 14px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between">
    <div>
      <div style="font-size:10px;font-weight:800;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.08em;margin-bottom:3px">Biên bản vi phạm</div>
      <h3 style="font-size:16px;font-weight:800;color:#fff;margin:0;font-family:monospace">${v.id}</h3>
    </div>
    <div style="display:flex;align-items:center;gap:8px">
      <span style="padding:4px 12px;border-radius:20px;font-size:11px;font-weight:800;background:${sc}20;color:${sc};border:1px solid ${sc}44">${slMap[v.status]||v.status}</span>
      <button onclick="dmCloseModal()" style="background:transparent;border:none;color:rgba(255,255,255,.5);cursor:pointer;font-size:18px">✕</button>
    </div>
  </div>
  <div style="padding:20px 22px">
    <!-- Biên bản content -->
    <div style="background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:16px;margin-bottom:16px;text-align:center">
      <div style="font-size:10px;font-weight:700;color:rgba(255,255,255,.4);letter-spacing:.08em;text-transform:uppercase">UBND TP. HÀ NỘI — CHI CỤC TT-PCTT</div>
      <div style="font-size:14px;font-weight:900;color:#fff;margin:6px 0">BIÊN BẢN VI PHẠM HÀNH LANG BẢO VỆ ĐÊ ĐIỀU</div>
      <div style="font-size:11px;color:rgba(255,255,255,.45)">Số: ${v.id} · Ngày lập: ${v.date}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
      ${[
        ['Loại vi phạm', v.type],
        ['Tuyến đê', dike.name || v.dikeId],
        ['Đối tượng vi phạm', v.violator],
        ['Ngày lập biên bản', v.date],
        ['Hình thức xử phạt', v.fine],
        ['Cán bộ lập BB', v.officer],
      ].map(([k,val]) => `<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:10px 12px">
        <div style="font-size:10px;color:rgba(255,255,255,.35);margin-bottom:3px;text-transform:uppercase;letter-spacing:.05em;font-weight:700">${k}</div>
        <div style="font-size:12px;color:#fff;font-weight:600">${val}</div>
      </div>`).join('')}
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      ${v.status === 'pending' ? `<button onclick="dmResolveViolation('${v.id}')" style="padding:8px 16px;border-radius:8px;border:none;background:#a78bfa;color:#fff;font-size:12px;font-weight:700;cursor:pointer">Đánh dấu Đã xử lý</button>` : ''}
      <button onclick="showToast('Đang xuất biên bản PDF...','info')" style="padding:8px 16px;border-radius:8px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:#fff;font-size:12px;font-weight:600;cursor:pointer">
        Xuất PDF
      </button>
      <button onclick="dmCloseModal()" style="padding:8px 16px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:transparent;color:rgba(255,255,255,.6);font-size:12px;cursor:pointer">Đóng</button>
    </div>
  </div>
</div>`);
}

function dmResolveViolation(id) {
  const v = (typeof DIKE_VIOLATIONS !== 'undefined' ? DIKE_VIOLATIONS : []).find(x => x.id === id);
  if (v) v.status = 'resolved';
  dmCloseModal();
  if (typeof showToast === 'function') showToast(`Biên bản ${id} đã đánh dấu giải quyết`, 'success');
  if (typeof dmTab  === 'function') dmTab('violations');
}

// ──────────────────────────────────────────────────────────────────
// 5. dmNewViolation() — Form to create a new violation record
// ──────────────────────────────────────────────────────────────────
function dmNewViolation() {
  const registry = typeof DIKE_REGISTRY !== 'undefined' ? DIKE_REGISTRY : [];
  dmShowModal(`
<div style="background:#0e1220;border:1px solid rgba(255,255,255,.1);border-radius:16px;width:580px;max-width:100%">
  <div style="padding:18px 22px 14px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between">
    <h3 style="font-size:15px;font-weight:800;color:#fff;margin:0;display:flex;align-items:center;gap:8px">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      Lập Biên bản Vi phạm mới
    </h3>
    <button onclick="dmCloseModal()" style="background:transparent;border:none;color:rgba(255,255,255,.5);cursor:pointer;font-size:18px">✕</button>
  </div>
  <form onsubmit="dmSaveViolation(event)" style="padding:20px 22px">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Tuyến đê vi phạm *</label>
        <select id="vfDikeId" class="form-control" style="width:100%">
          ${registry.map(d => `<option value="${d.id}">${d.name.substring(0,30)}</option>`).join('')}
        </select>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Ngày lập biên bản *</label>
        <input id="vfDate" class="form-control" type="date" value="${new Date().toISOString().substring(0,10)}" required/>
      </div>
    </div>
    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Loại vi phạm *</label>
      <select id="vfType" class="form-control" style="width:100%">
        <option>Đổ vật liệu vào hành lang bảo vệ đê</option>
        <option>Khai thác đất mặt đê trái phép</option>
        <option>Nuôi trồng thủy sản trong hành lang</option>
        <option>Xây dựng công trình trái phép</option>
        <option>Chăn thả gia súc trên đê</option>
        <option>Khai thác cát, đá trái phép</option>
        <option>Vi phạm khác</option>
      </select>
    </div>
    <div style="margin-bottom:14px">
      <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Đối tượng vi phạm *</label>
      <input id="vfViolator" class="form-control" placeholder="Họ tên / Tên tổ chức, địa chỉ" required style="width:100%"/>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Hình thức xử phạt</label>
        <input id="vfFine" class="form-control" placeholder="VD: 2.000.000 VNĐ / Cảnh cáo"/>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">Cán bộ lập BB *</label>
        <input id="vfOfficer" class="form-control" placeholder="Họ và tên cán bộ" required/>
      </div>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:4px">
      <button type="button" onclick="dmCloseModal()" style="padding:8px 16px;border-radius:8px;border:1px solid rgba(255,255,255,.12);background:transparent;color:rgba(255,255,255,.6);font-size:12px;cursor:pointer">Hủy</button>
      <button type="submit" style="padding:8px 18px;border-radius:8px;border:none;background:#ef4444;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Lập biên bản</button>
    </div>
  </form>
</div>`);
}

function dmSaveViolation(e) {
  e.preventDefault();
  const d = document.getElementById('vfDate').value;
  const dStr = d ? new Date(d).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' }) : '—';
  const newV = {
    id: 'VF-' + String(Date.now()).slice(-5),
    dikeId:   document.getElementById('vfDikeId').value,
    type:     document.getElementById('vfType').value,
    violator: document.getElementById('vfViolator').value,
    date:     dStr,
    fine:     document.getElementById('vfFine').value || 'Chưa xác định',
    status:   'pending',
    officer:  document.getElementById('vfOfficer').value,
  };
  if (typeof DIKE_VIOLATIONS !== 'undefined') DIKE_VIOLATIONS.unshift(newV);
  dmCloseModal();
  if (typeof showToast === 'function') showToast(`Đã lập biên bản ${newV.id} thành công!`, 'success');
  if (typeof dmTab === 'function') dmTab('violations');
}
