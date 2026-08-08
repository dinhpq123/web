// ── HADIWA IOC — Workflow Entry Point ─────────────────────────────
// This file is the main entry point for the Workflow Builder module.
// It handles: state management, routing (list ↔ builder), builder UI,
// node/edge CRUD, property panel, and save/delete/open actions.
//
// DEPENDS ON (loaded in order via app.html):
//   workflows-data.js   → WF_BLOCK_DEFS, WF_CATS, WF_CAT_LABELS, WF_LIST, wfGetPropFields
//   workflows-list.js   → renderWfList(), bindWfList(), wfGoPage, wfSet*, wfDuplicate, wfToggle
//   workflows-runner.js → wfRunNow(), wfSimClose(), _wfTopoSort()
//   workflows.js        → (this file) renderWorkflows, wfState, builder, wfDelete, wfSave

// ── State ──────────────────────────────────────────────────────────
let wfState = {
  view: 'list',       // 'list' | 'builder'
  activeWf: null,
  nodes: [],          // {id, defId, x, y, label, params}
  edges: [],          // {id, fromId, toId}
  selectedNode: null,
  connecting: null,
  nextId: 100,
  canvasPan: { x: 0, y: 0 },
  // List filters
  page: 1, pageSize: 6,
  search: '', filterCat: 'all', filterStatus: 'all', sortBy: 'lastRun',
};

// ── Router ─────────────────────────────────────────────────────────
function renderWorkflows() {
  wfState.view = wfState.view || 'list';
  return wfState.view === 'list' ? renderWfList() : renderWfBuilder();
}

window.afterRender_workflows = function () {
  if (wfState.view === 'list') bindWfList();
  else                         bindWfBuilder();
};

function _wfRerender() {
  const area = document.getElementById('contentArea');
  if (!area) return;
  area.innerHTML = `<div class="fade-in">${renderWorkflows()}</div>`;
  window.afterRender_workflows();
}

// ── Open/Delete ────────────────────────────────────────────────────
function wfOpenBuilder(id) {
  wfState.view = 'builder';
  const wf = id ? WF_LIST.find(w => w.id === id) : null;
  wfState.activeWf = wf || {
    id: 'wf_new_' + Date.now(), name: 'Workflow mới', desc: '',
    active: false, runs: 0, lastRun: '-', created: new Date().toISOString().slice(0,10),
    cat: 'report', nodes: [], edges: [],
  };
  wfState.nodes = wf?.nodes?.length ? JSON.parse(JSON.stringify(wf.nodes)) : [
    { id: 'n1', defId: 'trigger_iot',  x: 80,  y: 200, label: 'IoT Cảnh báo',  params: {} },
    { id: 'n2', defId: 'ai_classify',  x: 340, y: 200, label: 'Phân loại AI',  params: {} },
    { id: 'n3', defId: 'act_notify',   x: 600, y: 130, label: 'Gửi thông báo', params: {} },
    { id: 'n4', defId: 'act_tts',      x: 600, y: 300, label: 'Phát loa TTS',  params: {} },
  ];
  wfState.edges = wf?.edges?.length ? JSON.parse(JSON.stringify(wf.edges)) : [
    { id: 'e1', fromId: 'n1', toId: 'n2' },
    { id: 'e2', fromId: 'n2', toId: 'n3' },
    { id: 'e3', fromId: 'n2', toId: 'n4' },
  ];
  wfState.selectedNode = null;
  wfState.nextId = 100;
  wfState.canvasPan = { x: 0, y: 0 };
  _wfRerender();
}

function wfDelete(id) {
  const wf = WF_LIST.find(w => w.id === id);
  if (!confirm(`Xoá workflow "${wf?.name}"?`)) return;
  WF_LIST = WF_LIST.filter(w => w.id !== id);
  wfState.view = 'list';
  _wfRerender();
}

function wfSave() {
  const name = document.getElementById('wfbName')?.value?.trim() || 'Untitled';
  wfState.activeWf.name  = name;
  wfState.activeWf.nodes = JSON.parse(JSON.stringify(wfState.nodes));
  wfState.activeWf.edges = JSON.parse(JSON.stringify(wfState.edges));
  const idx = WF_LIST.findIndex(w => w.id === wfState.activeWf.id);
  if (idx >= 0) WF_LIST[idx] = { ...wfState.activeWf };
  else          WF_LIST.push({ ...wfState.activeWf });
  if (typeof showToast === 'function') showToast(`Đã lưu workflow "${name}"`, 'success');
}

// ── BUILDER VIEW ───────────────────────────────────────────────────
function renderWfBuilder() {
  return `
<style>
.wfb-root{display:flex;height:calc(100vh - 52px);overflow:hidden;font-family:'Inter',sans-serif;background:#0a0c1a}
.wfb-palette{width:224px;min-width:224px;background:rgba(255,255,255,.03);border-right:1px solid rgba(255,255,255,.07);display:flex;flex-direction:column;overflow:hidden}
.wfb-palette-head{padding:13px 14px 8px;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.38);border-bottom:1px solid rgba(255,255,255,.06);display:flex;align-items:center;gap:6px}
.wfb-palette-body{flex:1;overflow-y:auto;padding:8px}
.wfb-cat-label{font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:8px 6px 3px;color:rgba(255,255,255,.28)}
.wfb-block{display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:9px;cursor:grab;margin-bottom:2px;border:1px solid transparent;transition:all .18s;user-select:none}
.wfb-block:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.1)}
.wfb-block:active{cursor:grabbing;transform:scale(.97)}
.wfb-block-icon{width:22px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.wfb-block-info{min-width:0}
.wfb-block-name{font-size:11px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wfb-block-desc{font-size:9px;color:rgba(255,255,255,.3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}
.wfb-canvas-wrap{flex:1;position:relative;overflow:hidden;background:#070910;cursor:default}
.wfb-canvas-wrap.connecting{cursor:crosshair}
.wfb-grid{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.055) 1px,transparent 1px);background-size:28px 28px;pointer-events:none}
.wfb-node{position:absolute;background:rgba(12,15,28,.94);border-radius:14px;border:2px solid;padding:11px 14px;cursor:pointer;user-select:none;min-width:140px;transition:box-shadow .2s;backdrop-filter:blur(8px)}
.wfb-node.selected{box-shadow:0 0 0 3px rgba(41,132,238,.65),0 8px 32px rgba(0,0,0,.5)!important}
.wfb-node-head{display:flex;align-items:center;gap:8px;margin-bottom:3px}
.wfb-node-icon{display:flex;align-items:center;flex-shrink:0}
.wfb-node-label{font-size:12px;font-weight:700;color:#fff;flex:1}
.wfb-node-cat{font-size:9px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.32)}
.wfb-port{width:12px;height:12px;border-radius:50%;border:2px solid;position:absolute;cursor:crosshair;transition:transform .15s;background:#070910}
.wfb-port-out{right:-7px;top:50%;transform:translateY(-50%)}.wfb-port-out:hover{transform:translateY(-50%) scale(1.6)}
.wfb-port-in{left:-7px;top:50%;transform:translateY(-50%)}.wfb-port-in:hover{transform:translateY(-50%) scale(1.6)}
.wfb-toolbar{position:absolute;top:12px;left:50%;transform:translateX(-50%);display:flex;gap:7px;background:rgba(10,12,26,.92);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:8px 13px;z-index:10;backdrop-filter:blur(14px);align-items:center}
.wfb-tb-btn{padding:6px 13px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid;transition:all .2s;display:flex;align-items:center;gap:5px}
.wfb-tb-back{background:transparent;color:rgba(255,255,255,.55);border-color:rgba(255,255,255,.14)}.wfb-tb-back:hover{background:rgba(255,255,255,.07);color:#fff}
.wfb-tb-save{background:linear-gradient(135deg,var(--purple),var(--purple));color:#fff;border-color:transparent}.wfb-tb-save:hover{box-shadow:0 4px 16px rgba(41,132,238,.5)}
.wfb-tb-run{background:rgba(41,132,238,.14);color:var(--success-text);border-color:rgba(41,132,238,.35)}.wfb-tb-run:hover{background:rgba(41,132,238,.28)}
.wfb-tb-name{background:transparent;border:none;color:#fff;font-size:14px;font-weight:700;outline:none;width:190px;text-align:center;font-family:'Inter',sans-serif}
.wfb-hint{font-size:10px;color:rgba(255,255,255,.25);pointer-events:none;position:absolute;bottom:16px;left:50%;transform:translateX(-50%);white-space:nowrap}
.wfb-props{width:255px;min-width:255px;background:rgba(255,255,255,.03);border-left:1px solid rgba(255,255,255,.07);display:flex;flex-direction:column;overflow-y:auto}
.wfb-props-head{padding:13px;font-size:10px;font-weight:700;color:rgba(255,255,255,.4);letter-spacing:.08em;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,.06);display:flex;align-items:center;gap:6px}
.wfb-props-body{padding:14px;flex:1}
.wfb-prop-row{margin-bottom:12px}
.wfb-prop-label{font-size:10px;font-weight:600;color:rgba(255,255,255,.38);letter-spacing:.07em;text-transform:uppercase;margin-bottom:5px}
.wfb-prop-input{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:7px 10px;color:#fff;font-size:12px;font-family:'Inter',sans-serif;outline:none;transition:border-color .2s;box-sizing:border-box}
.wfb-prop-input:focus{border-color:rgba(41,132,238,.6)}
.wfb-prop-select{width:100%;background:#0f1629;border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:7px 10px;color:#fff;font-size:12px;font-family:'Inter',sans-serif;outline:none;box-sizing:border-box}
.wfb-prop-hint{font-size:10px;color:rgba(255,255,255,.28);margin-top:4px;line-height:1.4}
.wfb-node-del-btn{width:100%;padding:8px;border-radius:8px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#f87171;font-size:12px;font-weight:600;cursor:pointer;margin-top:10px;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:5px}
.wfb-node-del-btn:hover{background:rgba(239,68,68,.25)}
</style>

<div class="wfb-root" id="wfbRoot">
  <!-- Palette -->
  <div class="wfb-palette">
    <div class="wfb-palette-head">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
      Blocks
    </div>
    <div class="wfb-palette-body" id="wfbPalette">
      ${WF_CATS.map(cat => `
        <div class="wfb-cat-label" style="color:${cat.color}99">${cat.label}</div>
        ${WF_BLOCK_DEFS.filter(b => b.cat === cat.id).map(b => `
          <div class="wfb-block" draggable="true" data-def-id="${b.id}"
               style="border-left:2px solid ${b.color}55" title="${b.desc}">
            <span class="wfb-block-icon" style="color:${b.color}">${b.icon}</span>
            <div class="wfb-block-info">
              <div class="wfb-block-name" style="color:${b.color}">${b.label}</div>
              <div class="wfb-block-desc">${b.desc}</div>
            </div>
          </div>`).join('')}
      `).join('')}
    </div>
  </div>

  <!-- Canvas -->
  <div class="wfb-canvas-wrap" id="wfbCanvasWrap">
    <div class="wfb-grid"></div>
    <!-- Toolbar -->
    <div class="wfb-toolbar">
      <button class="wfb-tb-btn wfb-tb-back" id="wfbBack">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        Danh sách
      </button>
      <input class="wfb-tb-name" id="wfbName" value="${wfState.activeWf?.name || 'Workflow mới'}" placeholder="Tên workflow">
      <button class="wfb-tb-btn wfb-tb-run" id="wfbRunBtn">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg>
        Chạy thử
      </button>
      <button class="wfb-tb-btn wfb-tb-save" id="wfbSaveBtn">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        Lưu
      </button>
    </div>
    <!-- SVG edges -->
    <svg id="wfbSvg" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;z-index:1">
      <defs>
        <marker id="wfArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="rgba(41,132,238,.75)"/>
        </marker>
      </defs>
      <g id="wfbEdgesG"></g>
      <path id="wfbDragEdge" d="" stroke="rgba(41,132,238,.5)" stroke-width="2" fill="none"
            stroke-dasharray="6 4" marker-end="url(#wfArrow)" style="pointer-events:none"/>
    </svg>
    <!-- Nodes -->
    <div id="wfbNodes" style="position:absolute;inset:0;z-index:2"></div>
    <div class="wfb-hint">Kéo block từ bảng trái · Kéo port để nối · Click edge để xoá</div>
  </div>

  <!-- Properties -->
  <div class="wfb-props" id="wfbProps">
    <div class="wfb-props-head">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      Thuộc tính
    </div>
    <div class="wfb-props-body" id="wfbPropsBody">
      <div style="color:rgba(255,255,255,.28);font-size:12px;text-align:center;margin-top:32px">
        Click vào block để chỉnh thuộc tính
      </div>
    </div>
  </div>
</div>`;
}

function bindWfBuilder() {
  renderWfNodes(); renderWfEdges();

  document.getElementById('wfbBack')?.addEventListener('click', () => {
    wfState.view = 'list'; _wfRerender();
  });
  document.getElementById('wfbSaveBtn')?.addEventListener('click', wfSave);
  document.getElementById('wfbRunBtn')?.addEventListener('click', () => {
    wfSave();
    wfRunNow(wfState.activeWf.id);
  });

  // Palette drag
  document.querySelectorAll('.wfb-block[draggable]').forEach(el => {
    el.addEventListener('dragstart', e => e.dataTransfer.setData('defId', el.dataset.defId));
  });

  // Canvas drop
  const wrap = document.getElementById('wfbCanvasWrap');
  wrap.addEventListener('dragover', e => e.preventDefault());
  wrap.addEventListener('drop', e => {
    e.preventDefault();
    const defId = e.dataTransfer.getData('defId');
    if (!defId) return;
    const r = wrap.getBoundingClientRect();
    wfAddNode(defId, e.clientX - r.left - wfState.canvasPan.x - 72, e.clientY - r.top - wfState.canvasPan.y - 30);
  });

  // Deselect on canvas click
  wrap.addEventListener('click', e => {
    if (e.target === wrap || e.target.classList.contains('wfb-grid')) {
      wfState.selectedNode = null; wfState.connecting = null;
      document.getElementById('wfbDragEdge')?.setAttribute('d', '');
      document.querySelectorAll('.wfb-node').forEach(n => n.classList.remove('selected'));
      renderWfPropsPanel(null);
    }
  });
}

// ── Node rendering ──────────────────────────────────────────────────
function renderWfNodes() {
  const container = document.getElementById('wfbNodes');
  if (!container) return;
  const fallbackSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>';
  container.innerHTML = wfState.nodes.map(node => {
    const def = WF_BLOCK_DEFS.find(b => b.id === node.defId) || {};
    const col = def.color || '#64748b';
    const sel = wfState.selectedNode === node.id ? ' selected' : '';
    return `
    <div class="wfb-node${sel}" id="wfn-${node.id}" data-id="${node.id}"
         style="left:${node.x}px;top:${node.y}px;border-color:${col}60;box-shadow:0 0 0 1px ${col}20,0 6px 24px rgba(0,0,0,.45)">
      <div class="wfb-port wfb-port-in"  style="border-color:${col}" data-node="${node.id}" data-dir="in"></div>
      <div class="wfb-port wfb-port-out" style="border-color:${col}" data-node="${node.id}" data-dir="out"></div>
      <div class="wfb-node-head">
        <span class="wfb-node-icon" style="color:${col}">${def.icon || fallbackSvg}</span>
        <span class="wfb-node-label">${node.label}</span>
      </div>
      <div class="wfb-node-cat" style="color:${col}">${WF_CATS.find(c => c.id === def.cat)?.label || ''}</div>
    </div>`;
  }).join('');

  document.querySelectorAll('.wfb-node').forEach(el => {
    const id = el.dataset.id;
    let ox, oy, moving = false;
    el.addEventListener('mousedown', e => {
      if (e.target.classList.contains('wfb-port')) return;
      moving = true;
      const node = wfState.nodes.find(n => n.id === id);
      ox = e.clientX - node.x; oy = e.clientY - node.y;
      wfSelectNode(id); e.preventDefault();
    });
    const onMove = e => {
      if (!moving) return;
      const node = wfState.nodes.find(n => n.id === id);
      if (!node) { moving = false; return; }
      node.x = e.clientX - ox; node.y = e.clientY - oy;
      el.style.left = node.x + 'px'; el.style.top = node.y + 'px';
      renderWfEdges();
    };
    const onUp = () => { moving = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    el.addEventListener('click', e => { if (!e.target.classList.contains('wfb-port')) wfSelectNode(id); });
  });

  document.querySelectorAll('.wfb-port-out').forEach(port => {
    port.addEventListener('mousedown', e => {
      e.stopPropagation();
      wfState.connecting = { fromId: port.dataset.node };
      const wrap    = document.getElementById('wfbCanvasWrap');
      const svgRect = document.getElementById('wfbSvg').getBoundingClientRect();
      const dragEdge = document.getElementById('wfbDragEdge');
      wrap.classList.add('connecting');
      const onMove = ev => {
        const { x, y } = _getPortCenter(port.dataset.node, 'out');
        dragEdge.setAttribute('d', _bezier(x, y, ev.clientX - svgRect.left, ev.clientY - svgRect.top));
      };
      const onUp = ev => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup',   onUp);
        wrap.classList.remove('connecting');
        dragEdge.setAttribute('d', '');
        const target = document.elementFromPoint(ev.clientX, ev.clientY);
        const toPort = target?.closest('.wfb-port-in');
        if (toPort && toPort.dataset.node !== port.dataset.node) wfAddEdge(port.dataset.node, toPort.dataset.node);
        wfState.connecting = null;
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup',   onUp);
    });
  });
}

function renderWfEdges() {
  const g = document.getElementById('wfbEdgesG');
  if (!g) return;
  g.innerHTML = wfState.edges.map(edge => {
    const { x: x1, y: y1 } = _getPortCenter(edge.fromId, 'out');
    const { x: x2, y: y2 } = _getPortCenter(edge.toId,   'in');
    if (!x1 && !x2) return '';
    return `<path d="${_bezier(x1,y1,x2,y2)}" stroke="rgba(41,132,238,.65)" stroke-width="2" fill="none"
      marker-end="url(#wfArrow)"
      onclick="wfRemoveEdge('${edge.id}')" style="pointer-events:stroke;cursor:pointer"
      title="Click để xoá kết nối"/>`;
  }).join('');
}

function _getPortCenter(nodeId, dir) {
  const el = document.getElementById('wfn-' + nodeId);
  if (!el) return { x: 0, y: 0 };
  const wrap = document.getElementById('wfbCanvasWrap');
  const nr = el.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
  return dir === 'out'
    ? { x: nr.right - wr.left,   y: nr.top + nr.height / 2 - wr.top }
    : { x: nr.left  - wr.left,   y: nr.top + nr.height / 2 - wr.top };
}

function _bezier(x1, y1, x2, y2) {
  const cx = (x1 + x2) / 2;
  return `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`;
}

// ── CRUD ────────────────────────────────────────────────────────────
function wfAddNode(defId, x, y) {
  const def = WF_BLOCK_DEFS.find(b => b.id === defId);
  if (!def) return;
  const id = 'n' + (++wfState.nextId);
  wfState.nodes.push({ id, defId, x, y, label: def.label, params: {} });
  renderWfNodes(); renderWfEdges();
}
function wfAddEdge(fromId, toId) {
  if (wfState.edges.find(e => e.fromId === fromId && e.toId === toId)) return;
  wfState.edges.push({ id: 'e' + (++wfState.nextId), fromId, toId });
  renderWfEdges();
}
function wfRemoveEdge(id) { wfState.edges = wfState.edges.filter(e => e.id !== id); renderWfEdges(); }
function wfRemoveNode(id) {
  wfState.nodes = wfState.nodes.filter(n => n.id !== id);
  wfState.edges = wfState.edges.filter(e => e.fromId !== id && e.toId !== id);
  if (wfState.selectedNode === id) wfState.selectedNode = null;
  renderWfNodes(); renderWfEdges(); renderWfPropsPanel(null);
}

function wfSelectNode(id) {
  wfState.selectedNode = id;
  document.querySelectorAll('.wfb-node').forEach(n => n.classList.toggle('selected', n.dataset.id === id));
  renderWfPropsPanel(wfState.nodes.find(n => n.id === id));
}

// ── Properties panel ────────────────────────────────────────────────
function renderWfPropsPanel(node) {
  const body = document.getElementById('wfbPropsBody');
  if (!body) return;
  if (!node) {
    body.innerHTML = '<div style="color:rgba(255,255,255,.28);font-size:12px;text-align:center;margin-top:32px">Click block để chỉnh thuộc tính</div>';
    return;
  }
  const def    = WF_BLOCK_DEFS.find(b => b.id === node.defId) || {};
  const fields = (typeof wfGetPropFields === 'function' ? wfGetPropFields : _defaultPropFields)(def.id);
  const fallbackSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>';
  body.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,.07)">
      <span style="color:${def.color||'var(--purple)'}">${def.icon||fallbackSvg}</span>
      <div>
        <div style="font-size:13px;font-weight:700;color:#fff">${def.label}</div>
        <div style="font-size:10px;color:rgba(255,255,255,.38)">${def.desc||''}</div>
      </div>
    </div>
    <div class="wfb-prop-row">
      <div class="wfb-prop-label">Tên hiển thị</div>
      <input class="wfb-prop-input" id="propLabel" value="${node.label}" oninput="wfUpdateNodeLabel('${node.id}',this.value)">
    </div>
    ${fields.map(f => `
    <div class="wfb-prop-row">
      <div class="wfb-prop-label">${f.label}</div>
      ${f.type === 'select'
        ? `<select class="wfb-prop-select" onchange="wfUpdateParam('${node.id}','${f.key}',this.value)">
            ${f.options.map(o => `<option value="${o.v}" ${node.params[f.key]===o.v?'selected':''}>${o.l}</option>`).join('')}
          </select>`
        : `<input class="wfb-prop-input" type="${f.type||'text'}" value="${node.params[f.key]||''}"
            placeholder="${f.placeholder||''}" oninput="wfUpdateParam('${node.id}','${f.key}',this.value)">`}
      ${f.hint ? `<div class="wfb-prop-hint">${f.hint}</div>` : ''}
    </div>`).join('')}
    <button class="wfb-node-del-btn" onclick="wfRemoveNode('${node.id}')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
      Xoá block này
    </button>`;
}

function _defaultPropFields() {
  return [{ key: 'note', label: 'Ghi chú', type: 'text', placeholder: '...' }];
}
function wfUpdateNodeLabel(id, val) {
  const node = wfState.nodes.find(n => n.id === id); if (node) node.label = val;
  const el = document.querySelector(`#wfn-${id} .wfb-node-label`); if (el) el.textContent = val;
}
function wfUpdateParam(id, key, val) {
  const node = wfState.nodes.find(n => n.id === id); if (node) node.params[key] = val;
}

// ── Expose to navigate() ────────────────────────────────────────────
window.renderWorkflows     = renderWorkflows;
window.afterRender_workflows = window.afterRender_workflows;  // already set above
