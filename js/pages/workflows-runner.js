// ── HADIWA IOC — Workflow Test-Run Simulation ─────────────────────
// Simulates execution with step-by-step overlay animation.
// Shows each block lighting up in topological order.
// Depends on: workflows-data.js (WF_BLOCK_DEFS), workflows.js (wfState)

function wfRunNow(id) {
  const wf = WF_LIST.find(w => w.id === id);
  if (!wf) return;
  if (!wf.nodes || wf.nodes.length === 0) {
    if (typeof showToast === 'function') showToast('Workflow chưa có block nào — hãy chỉnh sửa trước', 'warning');
    return;
  }

  // Build execution order via topological sort
  const order = _wfTopoSort(wf.nodes, wf.edges);

  // Show simulation overlay
  document.body.insertAdjacentHTML('beforeend', _wfSimOverlay(wf, order));

  // Animate steps
  let step = 0;
  const log = document.getElementById('wfSimLog');
  const bar = document.getElementById('wfSimBar');
  const stepLabel  = document.getElementById('wfSimStep');
  const totalLabel = document.getElementById('wfSimTotal');
  if (totalLabel) totalLabel.textContent = order.length;

  const icons = { trigger:'var(--danger)', condition:'var(--warning-text)', action:'var(--primary)', ai:'var(--primary)', control:'var(--muted)', integration:'var(--primary)' };
  const delay = ms => new Promise(r => setTimeout(r, ms));

  async function runSteps() {
    for (let i = 0; i < order.length; i++) {
      const node = order[i];
      const def  = WF_BLOCK_DEFS.find(d => d.id === node.defId) || { label: node.label, cat:'action', color:'var(--text-subtle)' };
      const pct  = Math.round(((i + 1) / order.length) * 100);

      // Highlight card
      document.querySelectorAll('.wf-sim-node').forEach(el => {
        el.classList.remove('wf-sim-active', 'wf-sim-done');
        if (el.dataset.idx < i) el.classList.add('wf-sim-done');
      });
      const active = document.querySelector(`.wf-sim-node[data-idx="${i}"]`);
      if (active) {
        active.classList.add('wf-sim-active');
        active.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Progress
      if (bar) bar.style.width = pct + '%';
      if (stepLabel) stepLabel.textContent = i + 1;

      // Log entry
      const ms = 400 + Math.random() * 600;
      const msgs = {
        trigger:     [`Nhận tín hiệu kích hoạt từ "${node.label}"`, `Điều kiện kích hoạt đã thỏa mãn`],
        condition:   [`Đánh giá điều kiện "${node.label}"`, `Kết quả: TRUE → nhánh chính`],
        action:      [`Thực thi hành động "${node.label}"`, `Gửi thành công — 200 OK`],
        ai:          [`Gọi AI model cho block "${node.label}"`, `AI xử lý xong — confidence: 94%`],
        control:     [`Điều phối luồng tại "${node.label}"`, `Tiếp tục nhánh tiếp theo`],
        integration: [`Kết nối hệ thống ngoài "${node.label}"`, `Response: 200 OK — ${Math.floor(ms)}ms`],
      };
      const m = (msgs[def.cat] || ['Xử lý block...'])[Math.floor(Math.random() * 2)];
      if (log) {
        log.insertAdjacentHTML('beforeend', `
          <div class="wf-sim-log-entry" style="animation:fadeIn .3s ease">
            <span style="color:${def.color||'var(--purple)'};margin-right:6px">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="${def.color||'var(--purple)'}"><circle cx="12" cy="12" r="10"/></svg>
            </span>
            <span style="color:rgba(255,255,255,.5);font-size:10px;margin-right:6px">${new Date().toLocaleTimeString('vi-VN')}</span>
            <span>${def.label}</span>
            <span style="color:rgba(255,255,255,.45)"> — ${m}</span>
          </div>`);
        log.scrollTop = log.scrollHeight;
      }

      if (i < order.length - 1) await delay(700 + Math.random() * 500);
    }

    // Done
    if (bar) { bar.style.width = '100%'; bar.style.background = 'var(--success)'; }
    const status = document.getElementById('wfSimStatus');
    if (status) { status.textContent = 'Hoàn thành'; status.style.color = 'var(--success-text)'; }
    const closeBtn = document.getElementById('wfSimCloseBtn');
    if (closeBtn) closeBtn.textContent = 'Đóng';

    // Update run count
    const w = WF_LIST.find(x => x.id === id);
    if (w) { w.runs++; w.lastRun = new Date().toLocaleString('vi-VN'); }
    if (typeof showToast === 'function') showToast(`Chạy thử "${wf.name}" thành công`, 'success');
  }

  runSteps();
}

function _wfSimOverlay(wf, order) {
  const colors = { trigger:'var(--danger)', condition:'var(--warning-text)', action:'var(--primary)', ai:'var(--primary)', control:'var(--muted)', integration:'var(--primary)' };
  const nodeCards = order.map((node, i) => {
    const def = WF_BLOCK_DEFS.find(d => d.id === node.defId) || { label: node.label, cat: 'action', color: 'var(--text-subtle)', icon: '' };
    const col = def.color || 'var(--text-subtle)';
    return `<div class="wf-sim-node" data-idx="${i}" style="--nc:${col}">
      <div class="wf-sim-node-inner">
        <span class="wf-sim-node-icon" style="color:${col}">${def.icon||''}</span>
        <div>
          <div style="font-size:12px;font-weight:700;color:#fff">${node.label||def.label}</div>
          <div style="font-size:10px;color:rgba(255,255,255,.4)">${def.label}</div>
        </div>
        <span class="wf-sim-check">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </span>
      </div>
    </div>`;
  }).join(`<div class="wf-sim-arrow"><svg width="10" height="16" viewBox="0 0 10 24"><polyline points="5 0 5 18" stroke="rgba(255,255,255,.2)" stroke-width="1.5" fill="none"/><polygon points="0 16 5 24 10 16" fill="rgba(255,255,255,.2)"/></svg></div>`);

  return `
<style>
#wfSimOverlay{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(12px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .25s ease}
.wf-sim-box{background:#0f0f1a;border:1px solid rgba(41,132,238,.3);border-radius:20px;width:100%;max-width:680px;max-height:90vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 24px 64px rgba(0,0,0,.6)}
.wf-sim-header{padding:18px 22px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between}
.wf-sim-title{font-size:15px;font-weight:800;color:#fff}
.wf-sim-subtitle{font-size:11px;color:rgba(255,255,255,.4);margin-top:2px}
.wf-sim-body{display:flex;flex:1;overflow:hidden}
.wf-sim-steps{width:220px;flex-shrink:0;padding:16px;overflow-y:auto;border-right:1px solid rgba(255,255,255,.06)}
.wf-sim-node{border-radius:10px;padding:8px 10px;margin-bottom:4px;border:1px solid rgba(255,255,255,.07);transition:all .3s;background:rgba(255,255,255,.03)}
.wf-sim-node.wf-sim-active{background:rgba(41,132,238,.12);border-color:rgba(41,132,238,.4);transform:translateX(3px)}
.wf-sim-node.wf-sim-done{opacity:.45}
.wf-sim-node-inner{display:flex;align-items:center;gap:8px}
.wf-sim-node-icon{display:flex;align-items:center;flex-shrink:0}
.wf-sim-check{margin-left:auto;opacity:0;transition:opacity .3s}.wf-sim-done .wf-sim-check{opacity:1}
.wf-sim-arrow{display:flex;justify-content:center;margin:2px 0}
.wf-sim-right{flex:1;display:flex;flex-direction:column;overflow:hidden}
.wf-sim-progress-wrap{padding:16px 18px;border-bottom:1px solid rgba(255,255,255,.06)}
.wf-sim-prog-bar-bg{height:6px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden;margin:8px 0}
.wf-sim-prog-bar{height:100%;background:linear-gradient(90deg,var(--purple),var(--purple));border-radius:3px;transition:width .5s ease;width:0}
.wf-sim-log-area{flex:1;overflow-y:auto;padding:12px 16px}
.wf-sim-log-entry{font-size:11px;color:rgba(255,255,255,.65);padding:5px 0;border-bottom:1px solid rgba(255,255,255,.04);display:flex;align-items:flex-start;gap:4px;line-height:1.5}
.wf-sim-footer{padding:12px 18px;border-top:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between}
@keyframes fadeIn{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
</style>
<div id="wfSimOverlay" onclick="if(event.target===this)wfSimClose()">
  <div class="wf-sim-box">
    <div class="wf-sim-header">
      <div>
        <div class="wf-sim-title">Chạy thử: ${wf.name}</div>
        <div class="wf-sim-subtitle">Mô phỏng thực thi — dữ liệu giả lập, không ảnh hưởng môi trường thật</div>
      </div>
      <button onclick="wfSimClose()" style="background:none;border:none;color:rgba(255,255,255,.5);cursor:pointer;font-size:20px;line-height:1;padding:0 4px">&#215;</button>
    </div>
    <div class="wf-sim-body">
      <div class="wf-sim-steps">${nodeCards}</div>
      <div class="wf-sim-right">
        <div class="wf-sim-progress-wrap">
          <div style="display:flex;justify-content:space-between;font-size:12px;color:rgba(255,255,255,.5)">
            <span id="wfSimStatus">Đang chạy...</span>
            <span>Bước <span id="wfSimStep">0</span>/<span id="wfSimTotal">0</span></span>
          </div>
          <div class="wf-sim-prog-bar-bg"><div class="wf-sim-prog-bar" id="wfSimBar"></div></div>
        </div>
        <div class="wf-sim-log-area" id="wfSimLog"></div>
      </div>
    </div>
    <div class="wf-sim-footer">
      <span style="font-size:11px;color:rgba(255,255,255,.35)">${wf.nodes.length} blocks — Môi trường: Sandbox</span>
      <button id="wfSimCloseBtn" onclick="wfSimClose()" style="padding:7px 18px;border-radius:8px;background:rgba(41,132,238,.15);border:1px solid rgba(41,132,238,.3);color:#5BA9FF;font-size:12px;font-weight:600;cursor:pointer">Hủy</button>
    </div>
  </div>
</div>`;
}

function wfSimClose() {
  const el = document.getElementById('wfSimOverlay');
  if (el) el.remove();
}

// ── Topological sort (BFS Kahn's algorithm) ───────────────────────
function _wfTopoSort(nodes, edges) {
  if (!nodes || !nodes.length) return [];
  const inDeg = {};
  const adj   = {};
  nodes.forEach(n => { inDeg[n.id] = 0; adj[n.id] = []; });
  (edges||[]).forEach(e => {
    if (adj[e.fromId]) adj[e.fromId].push(e.toId);
    if (inDeg[e.toId] !== undefined) inDeg[e.toId]++;
  });
  const queue  = nodes.filter(n => inDeg[n.id] === 0).map(n => n.id);
  const result = [];
  while (queue.length) {
    const id = queue.shift();
    const n  = nodes.find(x => x.id === id);
    if (n) result.push(n);
    (adj[id]||[]).forEach(nid => { inDeg[nid]--; if (inDeg[nid] === 0) queue.push(nid); });
  }
  // Append any remaining (cycles / disconnected)
  nodes.forEach(n => { if (!result.find(r => r.id === n.id)) result.push(n); });
  return result;
}
