// ── HADIWA IOC — AI Data Engine v5.1 ──────────────────────────────
// Supplements aiagent.js + chatbot.js with:
// 1. Live data context builder (reads actual DATA object)
// 2. Predefined PCTT smart queries with contextual answers
// 3. Dispatch recommendation engine
// 4. AI panel injection into chatbot page

// ── Data Context Builder ───────────────────────────────────────────
function aiGetLiveContext() {
  const data = window.DATA || {};
  const incidents = data.incidents || [];
  const stations  = data.stations  || [];
  const open      = incidents.filter(i => i.status !== 'done');
  const critical  = incidents.filter(i => i.severity === 'critical' && i.status !== 'done');
  const maxWL     = stations.reduce((mx, s) => {
    if (s.waterLevel && s.waterLevel > mx.val) return { val: s.waterLevel, name: s.name, river: s.river };
    return mx;
  }, { val: 0, name: '—', river: '—' });
  const offlineStations = stations.filter(s => s.status === 'offline').length;
  const warningStations = stations.filter(s => s.status === 'warning').length;
  return { open, critical, maxWL, offlineStations, warningStations, total: incidents.length, stations };
}

// ── Predefined Smart Q&A Pairs ─────────────────────────────────────
const AI_QA_PAIRS = [
  {
    triggers: ['sự cố nào đang mở', 'bao nhiêu sự cố', 'sự cố chưa xử lý', 'đang xảy ra'],
    answer: () => {
      const c = aiGetLiveContext();
      if (c.open.length === 0) return 'Hiện tại không có sự cố nào đang mở. Hệ thống đang ở trạng thái bình thường.';
      const list = c.open.slice(0, 5).map(i => `• [${i.id}] ${i.type} — ${i.location} (${i.severity})`).join('\n');
      return `Hiện có **${c.open.length} sự cố** chưa xử lý xong:\n${list}${c.open.length > 5 ? `\n...và ${c.open.length - 5} sự cố khác.` : ''}\n\nSự cố nghiêm trọng (critical): **${c.critical.length}**`;
    },
  },
  {
    triggers: ['mực nước cao nhất', 'trạm đo nào nguy hiểm', 'sông nào vượt'],
    answer: () => {
      const c = aiGetLiveContext();
      if (!c.maxWL.val) return 'Không có dữ liệu mực nước tại thời điểm này.';
      return `Trạm đo có **mực nước cao nhất** là **${c.maxWL.name}** (${c.maxWL.river}) với mức **${c.maxWL.val}m**.\n\nCảnh báo: ${c.warningStations} trạm đang ở trạng thái cảnh báo, ${c.offlineStations} trạm mất kết nối.`;
    },
  },
  {
    triggers: ['trạm offline', 'trạm mất kết nối', 'trạm hỏng'],
    answer: () => {
      const c = aiGetLiveContext();
      const offline = c.stations.filter(s => s.status === 'offline');
      if (!offline.length) return 'Tất cả các trạm đo đang hoạt động bình thường.';
      return `Có **${offline.length} trạm** đang mất kết nối:\n${offline.map(s => `• ${s.name} (${s.district || ''}) — ${s.river || ''}`).join('\n')}\n\nTôi khuyến nghị kiểm tra đường truyền và nguồn điện cho các trạm này.`;
    },
  },
  {
    triggers: ['điều phối', 'nên ưu tiên', 'xử lý gì trước', 'đề xuất', 'khuyến nghị'],
    answer: () => {
      const c = aiGetLiveContext();
      const recs = c.critical.slice(0, 3).map((i, idx) =>
        `${idx + 1}. **[${i.id}] ${i.type}** tại ${i.location}${i.assignedTo ? ` — Đã giao ${i.assignedTo}` : ' — **Chưa phân công đội!**'}`
      );
      if (!recs.length) return 'Không có sự cố nghiêm trọng nào cần ưu tiên ngay lúc này. Tiếp tục giám sát thường xuyên.';
      return `Dựa trên dữ liệu thực tế, tôi **đề xuất ưu tiên** xử lý:\n${recs.join('\n')}\n\nSau đó xử lý các sự cố cấp "high" (${c.open.filter(i=>i.severity==='high').length} vụ).`;
    },
  },
  {
    triggers: ['tóm tắt', 'tổng quan', 'báo cáo nhanh', 'tình hình hiện tại'],
    answer: () => {
      const c = aiGetLiveContext();
      return `**Tóm tắt tình hình hệ thống** (${new Date().toLocaleTimeString('vi-VN')}):\n\n• Tổng sự cố: ${c.total} | Đang mở: ${c.open.length} | Cấp độ critical: ${c.critical.length}\n• Trạm đo: ${c.stations.length} tổng | ${c.warningStations} cảnh báo | ${c.offlineStations} offline\n• Mực nước cao nhất: ${c.maxWL.name} — ${c.maxWL.val}m (${c.maxWL.river})\n\nTình trạng tổng thể: ${c.critical.length > 2 ? '🔴 NGHIÊM TRỌNG' : c.open.length > 5 ? '🟡 CẦN THEO DÕI' : '🟢 BÌNH THƯỜNG'}`;
    },
  },
  {
    triggers: ['sự cố chưa phân công', 'chưa giao đội', 'không có người xử lý'],
    answer: () => {
      const c = aiGetLiveContext();
      const unassigned = c.open.filter(i => !i.assignedTo);
      if (!unassigned.length) return 'Tốt! Tất cả các sự cố đang mở đã được phân công đội xử lý.';
      const list = unassigned.map(i => `• [${i.id}] ${i.type} — ${i.location} (${i.severity})`).join('\n');
      return `Có **${unassigned.length} sự cố** chưa được phân công đội:\n${list}\n\nTôi đề xuất điều động theo thứ tự mức độ ưu tiên (critical trước).`;
    },
  },
  {
    triggers: ['lịch sử', 'đã xử lý xong', 'đã hoàn thành'],
    answer: () => {
      const data = window.DATA || {};
      const done = (data.incidents||[]).filter(i => i.status === 'done');
      return `Đã có **${done.length} sự cố** hoàn thành xử lý trong kỳ hiện tại.\n\nTỷ lệ hoàn thành: ${Math.round(done.length / Math.max((data.incidents||[]).length,1) * 100)}%`;
    },
  },
];

// ── AI Answer Engine ───────────────────────────────────────────────
function aiAnswerQuery(question) {
  if (!question || !question.trim()) return null;
  const q = question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  for (const pair of AI_QA_PAIRS) {
    for (const trigger of pair.triggers) {
      const t = trigger.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      if (q.includes(t)) {
        return pair.answer();
      }
    }
  }
  return null;
}

// ── Patch chatbot.js sendMessage to intercept PCTT queries ─────────
(function patchChatbot() {
  const orig = window.sendChatMessage;
  window.sendChatMessage = function(msg) {
    const answer = aiAnswerQuery(msg);
    if (answer) {
      // Inject AI answer directly if the chatbot UI is available
      if (typeof appendChatMessage === 'function') {
        appendChatMessage('user', msg);
        appendChatMessage('ai', answer);
        return;
      }
    }
    if (typeof orig === 'function') orig(msg);
  };
})();

// ── AI Smart Panel — injectable widget ────────────────────────────
function renderAiSmartPanel() {
  const c = aiGetLiveContext();
  const queries = [
    'Tóm tắt tình hình hiện tại',
    'Sự cố nào đang mở?',
    'Đề xuất ưu tiên xử lý',
    'Sự cố chưa phân công đội?',
    'Mực nước cao nhất ở đâu?',
    'Trạm nào đang offline?',
  ];

  return `
<div style="background:rgba(91,169,255,.06);border:1px solid rgba(91,169,255,.2);border-radius:14px;padding:14px 16px;margin-bottom:14px">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
    <div style="width:28px;height:28px;border-radius:8px;background:rgba(91,169,255,.15);display:flex;align-items:center;justify-content:center">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/></svg>
    </div>
    <div>
      <div style="font-size:12px;font-weight:800;color:#5BA9FF">Trợ lý AI PCTT</div>
      <div style="font-size:10px;color:rgba(91,169,255,.6)">Nhận biết ${c.open.length} sự cố mở · ${c.stations.length} trạm đo</div>
    </div>
    <div style="flex:1"></div>
    <div class="pulse-dot" style="background:#5BA9FF;width:6px;height:6px;box-shadow:0 0 6px #5BA9FF"></div>
  </div>
  <!-- Quick query chips -->
  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">
    ${queries.map(q => `
    <button onclick="aiRunQuery(this, '${q}')" style="padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;
      background:rgba(91,169,255,.1);border:1px solid rgba(91,169,255,.25);color:#8CC5FF;cursor:pointer;transition:all .2s"
      onmouseover="this.style.background='rgba(91,169,255,.2)'" onmouseout="this.style.background='rgba(91,169,255,.1)'">${q}</button>`).join('')}
  </div>
  <!-- Answer area -->
  <div id="aiSmartAnswer" style="min-height:40px;font-size:12px;color:var(--text-2);line-height:1.6;background:var(--bg-secondary);border:1px solid var(--border);border-radius:8px;padding:10px;display:none"></div>
</div>`;
}

window.aiRunQuery = function(btn, question) {
  const answer = aiAnswerQuery(question);
  const panel = document.getElementById('aiSmartAnswer');
  if (!panel) return;
  panel.style.display = 'block';
  // Format bold markdown
  panel.innerHTML = (answer || 'Xin lỗi, tôi chưa có câu trả lời cho câu hỏi này. Hãy thử câu hỏi khác.')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#e0d0ff">$1</strong>')
    .replace(/\n/g, '<br>');
};

// ── Dispatch Recommendation Widget ────────────────────────────────
function renderDispatchRecommendation() {
  const c = aiGetLiveContext();
  if (!c.critical.length && !c.open.length) {
    return `<div style="padding:12px;font-size:12px;color:rgba(255,255,255,.4);text-align:center">Không có sự cố nào cần điều phối</div>`;
  }
  const incidents = [...c.critical, ...c.open.filter(i=>i.severity==='high' && !c.critical.includes(i))].slice(0, 4);
  return `
<div style="margin-top:10px">
  <div style="font-size:10px;font-weight:700;color:rgba(91,169,255,.6);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">AI Gợi ý điều phối</div>
  ${incidents.map((i, idx) => {
    const c2 = i.severity === 'critical' ? '#ef4444' : '#f59e0b';
    return `
  <div style="display:flex;gap:10px;padding:8px;border-radius:8px;background:${c2}0a;border:1px solid ${c2}20;margin-bottom:6px;align-items:flex-start">
    <span style="font-size:10px;font-weight:800;color:${c2};min-width:16px;text-align:center">${idx+1}</span>
    <div style="flex:1">
      <div style="font-size:11px;font-weight:700;color:#fff">${i.type}</div>
      <div style="font-size:10px;color:rgba(255,255,255,.45)">${i.location}</div>
    </div>
    ${i.assignedTo
      ? `<span style="font-size:10px;color:var(--success-text);flex-shrink:0">✓ Đã giao</span>`
      : `<button class="btn btn-sm" onclick="viewIncident('${i.id}')" style="font-size:10px;padding:2px 8px;height:auto;background:${c2}22;border:1px solid ${c2}44;color:${c2};border-radius:6px">Phân công</button>`}
  </div>`;
  }).join('')}
</div>`;
}

window.renderAiSmartPanel = renderAiSmartPanel;
window.renderDispatchRecommendation = renderDispatchRecommendation;
window.aiAnswerQuery = aiAnswerQuery;

// Auto-inject smart panel into chatbot page if present
window.afterRender_chatbot = function() {
  const hdr = document.querySelector('.chat-messages, #chatMessages, .chatbot-container');
  if (!hdr) return;
  const wrapper = document.getElementById('aiSmartPanelWrapper');
  if (!wrapper) {
    const div = document.createElement('div');
    div.id = 'aiSmartPanelWrapper';
    div.innerHTML = renderAiSmartPanel();
    hdr.parentNode.insertBefore(div, hdr);
  }
};

// Also inject into aiagent page
window.afterRender_aiagent = function() {
  const statsEl = document.querySelector('[data-agent-tab="aistats"], .agent-stats-panel');
  if (!statsEl) return;
  const wrapper = document.getElementById('aiDispatchWrapper');
  if (!wrapper) {
    const div = document.createElement('div');
    div.id = 'aiDispatchWrapper';
    div.innerHTML = renderDispatchRecommendation();
    statsEl.prepend(div);
  }
};
