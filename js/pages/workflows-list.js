// ── HADIWA IOC — Workflow List View ──────────────────────────────
// Renders the list/grid of workflows with search, filter, sort, pagination.
// Depends on: workflows-data.js (WF_LIST, WF_CAT_LABELS)
//             workflows.js     (wfState, _wfRerender, wfOpenBuilder, wfDelete)

function renderWfList() {
  const catColor = {emergency:'#ef4444',report:'var(--purple)',forecast:'#0891b2',scada:'#f59e0b',citizen:'var(--success)',maintenance:'#64748b',ai:'#3699FF'};

  // ── Filter
  let items = WF_LIST.filter(w => {
    const q = (wfState.search||'').toLowerCase();
    if (q && !w.name.toLowerCase().includes(q) && !w.desc.toLowerCase().includes(q)) return false;
    if (wfState.filterCat !== 'all' && w.cat !== wfState.filterCat) return false;
    if (wfState.filterStatus === 'active'   && !w.active) return false;
    if (wfState.filterStatus === 'inactive' &&  w.active) return false;
    return true;
  });

  // ── Sort
  const sb = wfState.sortBy || 'lastRun';
  if (sb === 'runs')    items.sort((a,b) => b.runs - a.runs);
  if (sb === 'name')    items.sort((a,b) => a.name.localeCompare(b.name));
  if (sb === 'lastRun') items.sort((a,b) => b.lastRun > a.lastRun ? 1 : -1);

  // ── Pagination
  const total = items.length;
  const ps = wfState.pageSize || 6;
  const tp = Math.ceil(total / ps) || 1;
  const pg = Math.max(1, Math.min(wfState.page || 1, tp));
  const start = (pg - 1) * ps;
  const paged = items.slice(start, start + ps);

  // ── Page number buttons
  function pgBtns() {
    let html = '';
    for (let i = 1; i <= tp; i++) {
      if (i === 1 || i === tp || (i >= pg - 1 && i <= pg + 1)) {
        html += `<button class="btn btn-sm ${i === pg ? 'btn-primary' : 'btn-ghost'}" onclick="wfGoPage(${i})">${i}</button>`;
      } else if (i === pg - 2 || i === pg + 2) {
        html += `<span style="padding:0 4px;color:var(--muted)">…</span>`;
      }
    }
    return html;
  }

  // ── Small inline SVGs for card buttons
  const ic = {
    edit:   `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    play:   `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg>`,
    copy:   `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    pause:  `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
    resume: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg>`,
    trash:  `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
    prevpg: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`,
    nextpg: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`,
  };

  return `
<style>
.wfl-page{padding:24px;max-width:1200px;margin:0 auto}
.wfl-topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:12px}
.wfl-title{font-size:22px;font-weight:800;color:var(--text);display:flex;align-items:center;gap:8px}
.wfl-subtitle{font-size:12px;color:var(--muted);margin-top:3px}
.wfl-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:16px}
.wfl-search-wrap{position:relative;flex:1;min-width:180px;max-width:260px}
.wfl-search-wrap svg{position:absolute;left:9px;top:50%;transform:translateY(-50%);pointer-events:none;opacity:.4}
.wfl-search{width:100%;padding:7px 9px 7px 30px;background:var(--bg-card);border:1px solid var(--border);border-radius:9px;color:var(--text);font-size:12px;font-family:Inter,sans-serif;outline:none;box-sizing:border-box;transition:border-color .2s}
.wfl-search:focus{border-color:rgba(41,132,238,.5)}
.wfl-sel{padding:7px 9px;background:var(--bg-card);border:1px solid var(--border);border-radius:9px;color:var(--text);font-size:12px;font-family:Inter,sans-serif;outline:none;cursor:pointer;transition:border-color .2s}
.wfl-sel:focus{border-color:rgba(41,132,238,.5)}
.wfl-btn-new{padding:8px 16px;border-radius:10px;background:var(--button-primary-background);border:none;color:var(--button-primary-text);font-size:12px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .2s}
.wfl-btn-new:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(41,132,238,.4)}
.wfl-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:14px;margin-bottom:18px}
.wfl-card{background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:16px;transition:all .25s;position:relative;overflow:hidden}
.wfl-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(41,132,238,.05) 0%,transparent 60%);opacity:0;transition:opacity .3s;pointer-events:none}
.wfl-card:hover{border-color:var(--border-active);transform:translateY(-1px);box-shadow:var(--shadow-card)}
.wfl-card:hover::before{opacity:1}
.wfl-card-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px;gap:8px}
.wfl-card-name{font-size:14px;font-weight:700;color:var(--text);flex:1}
.wfl-card-desc{font-size:11px;color:var(--text-2);margin-bottom:10px;line-height:1.6}
.wfl-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:20px;font-size:10px;font-weight:700;white-space:nowrap;flex-shrink:0}
.wfl-badge.active{background:rgba(41,132,238,.12);color:var(--success-text);border:1px solid rgba(41,132,238,.25)}
.wfl-badge.inactive{background:rgba(100,116,139,.12);color:#94a3b8;border:1px solid rgba(100,116,139,.25)}
.wfl-dot{width:5px;height:5px;border-radius:50%;background:currentColor;display:inline-block}
.wfl-dot.pulse{animation:bk 1.8s ease-in-out infinite}
.wfl-cat-chip{display:inline-block;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600;margin-right:6px;margin-bottom:8px}
.wfl-stats{display:flex;gap:16px;padding-top:9px;border-top:1px solid var(--border);margin-bottom:10px}
.wfl-stat{font-size:11px;color:var(--muted)}.wfl-stat b{color:var(--text);display:block;font-size:13px;font-weight:700}
.wfl-actions{display:flex;gap:5px;flex-wrap:wrap}
.wfl-btn{padding:5px 10px;border-radius:7px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid;transition:all .2s;display:inline-flex;align-items:center;gap:3px;white-space:nowrap;background:transparent}
.wfl-btn-edit{color:#5BA9FF;border-color:rgba(41,132,238,.3)}.wfl-btn-edit:hover{background:rgba(41,132,238,.18)}
.wfl-btn-run{color:var(--success-text);border-color:rgba(41,132,238,.3)}.wfl-btn-run:hover{background:rgba(41,132,238,.18)}
.wfl-btn-copy{color:var(--primary);border-color:var(--border-active)}.wfl-btn-copy:hover{background:var(--primary-soft)}
.wfl-btn-toggle{color:var(--warning-text);border-color:color-mix(in srgb,var(--warning) 35%,transparent)}.wfl-btn-toggle:hover{background:var(--warning-soft)}
.wfl-btn-del{color:#f87171;border-color:rgba(239,68,68,.25)}.wfl-btn-del:hover{background:rgba(239,68,68,.15)}
.wfl-empty{text-align:center;padding:60px 20px;color:var(--muted);font-size:13px}
.wfl-pag{display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid var(--border);flex-wrap:wrap;gap:8px}
.wfl-pag-info{font-size:12px;color:var(--muted)}
.wfl-pag-btns{display:flex;gap:3px;align-items:center}
</style>

<div class="wfl-page">
  <!-- Header -->
  <div class="wfl-topbar">
    <div>
      <div class="wfl-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="rgba(41,132,238,.2)"/></svg>
        Quản lý Workflow
      </div>
      <div class="wfl-subtitle">Xây dựng quy trình vận hành tự động bằng kéo thả — có hỗ trợ AI Block</div>
    </div>
    <button class="wfl-btn-new" id="wfBtnNew">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Tạo workflow mới
    </button>
  </div>

  <!-- Toolbar -->
  <div class="wfl-toolbar">
    <div class="wfl-search-wrap">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input class="wfl-search" id="wfSearch" placeholder="Tìm workflow..." value="${wfState.search||''}" oninput="wfSetSearch(this.value)">
    </div>
    <select class="wfl-sel" onchange="wfSetCat(this.value)">
      <option value="all" ${wfState.filterCat==='all'?'selected':''}>Tất cả loại</option>
      ${Object.entries(WF_CAT_LABELS).map(([k,v])=>`<option value="${k}" ${wfState.filterCat===k?'selected':''}>${v}</option>`).join('')}
    </select>
    <select class="wfl-sel" onchange="wfSetStatus(this.value)">
      <option value="all"      ${wfState.filterStatus==='all'?'selected':''}>Tất cả trạng thái</option>
      <option value="active"   ${wfState.filterStatus==='active'?'selected':''}>Đang hoạt động</option>
      <option value="inactive" ${wfState.filterStatus==='inactive'?'selected':''}>Tạm dừng</option>
    </select>
    <select class="wfl-sel" onchange="wfSetSort(this.value)">
      <option value="lastRun" ${sb==='lastRun'?'selected':''}>Mới chạy nhất</option>
      <option value="runs"    ${sb==='runs'?'selected':''}>Nhiều lượt nhất</option>
      <option value="name"    ${sb==='name'?'selected':''}>Tên A→Z</option>
    </select>
    <span style="font-size:12px;color:var(--muted);margin-left:auto">${total} workflow</span>
  </div>

  <!-- Cards -->
  <div class="wfl-cards">
    ${paged.length === 0
      ? `<div class="wfl-empty">Không tìm thấy workflow nào phù hợp</div>`
      : paged.map(wf => {
          const col = catColor[wf.cat] || 'var(--text-subtle)';
          const nc  = wf.nodes?.length || 0;
          return `
          <div class="wfl-card">
            <div class="wfl-card-top">
              <div class="wfl-card-name">${wf.name}</div>
              <span class="wfl-badge ${wf.active?'active':'inactive'}">
                <span class="wfl-dot ${wf.active?'pulse':''}"></span>
                ${wf.active ? 'Đang chạy' : 'Tạm dừng'}
              </span>
            </div>
            <span class="wfl-cat-chip" style="background:${col}22;color:${col};border:1px solid ${col}44">${WF_CAT_LABELS[wf.cat]||wf.cat}</span>
            <div class="wfl-card-desc">${wf.desc}</div>
            <div class="wfl-stats">
              <div class="wfl-stat"><b>${wf.runs}</b>lượt chạy</div>
              <div class="wfl-stat"><b>${nc}</b>blocks</div>
              <div class="wfl-stat"><b>${wf.lastRun}</b>lần cuối</div>
            </div>
            <div class="wfl-actions">
              <button class="wfl-btn wfl-btn-edit"   onclick="wfOpenBuilder('${wf.id}')">${ic.edit} Chỉnh sửa</button>
              <button class="wfl-btn wfl-btn-run"    onclick="wfRunNow('${wf.id}')">${ic.play} Chạy thử</button>
              <button class="wfl-btn wfl-btn-copy"   onclick="wfDuplicate('${wf.id}')">${ic.copy} Nhân bản</button>
              <button class="wfl-btn wfl-btn-toggle" onclick="wfToggle('${wf.id}')">${wf.active ? ic.pause+'Tạm dừng' : ic.resume+'Bật lại'}</button>
              <button class="wfl-btn wfl-btn-del"    onclick="wfDelete('${wf.id}')">${ic.trash} Xoá</button>
            </div>
          </div>`;
        }).join('')}
  </div>

  <!-- Pagination -->
  <div class="wfl-pag">
    <div class="wfl-pag-info">
      Hiển thị ${Math.min(start+1,total)}–${Math.min(start+ps,total)} / ${total} workflow
    </div>
    <div class="wfl-pag-btns">
      <button class="btn btn-ghost btn-sm" ${pg===1?'disabled':''} onclick="wfGoPage(${pg-1})">${ic.prevpg} Trước</button>
      ${pgBtns()}
      <button class="btn btn-ghost btn-sm" ${pg===tp?'disabled':''} onclick="wfGoPage(${pg+1})">Sau ${ic.nextpg}</button>
    </div>
  </div>
</div>`;
}

function bindWfList() {
  document.getElementById('wfBtnNew')?.addEventListener('click', () => wfOpenBuilder(null));
}

// ── List control functions ────────────────────────────────────────
function wfGoPage(p)    { wfState.page = p; _wfRerender(); }
function wfSetSearch(v) { wfState.search = v; wfState.page = 1; _wfRerender(); }
function wfSetCat(v)    { wfState.filterCat = v; wfState.page = 1; _wfRerender(); }
function wfSetStatus(v) { wfState.filterStatus = v; wfState.page = 1; _wfRerender(); }
function wfSetSort(v)   { wfState.sortBy = v; wfState.page = 1; _wfRerender(); }

function wfDuplicate(id) {
  const src = WF_LIST.find(w => w.id === id);
  if (!src) return;
  const copy = {
    ...src,
    id: 'wf_' + Date.now(),
    name: src.name + ' (bản sao)',
    active: false, runs: 0, lastRun: '-', created: new Date().toISOString().slice(0,10),
    nodes: JSON.parse(JSON.stringify(src.nodes||[])),
    edges: JSON.parse(JSON.stringify(src.edges||[])),
  };
  WF_LIST.push(copy);
  if (typeof showToast === 'function') showToast('Đã nhân bản workflow', 'success');
  _wfRerender();
}

function wfToggle(id) {
  const w = WF_LIST.find(x => x.id === id);
  if (!w) return;
  w.active = !w.active;
  if (typeof showToast === 'function')
    showToast(w.active ? 'Workflow đã bật' : 'Workflow đã tạm dừng', w.active ? 'success' : 'warning');
  _wfRerender();
}
