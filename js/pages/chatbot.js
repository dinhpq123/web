// ── AI CHATBOT PAGE ───────────────────────────────────────────────
const chatHistory = [
  { role: 'ai', text: 'Xin chào! Tôi là **AI Trợ lý Hadiwa IOC** – Hệ thống Đê điều & Phòng chống Thiên tai TP. Hà Nội. Tôi có thể giúp bạn trìa cứu thông tin đê, hồ chứa, sự cố, quy trình ứng cứu hoặc phân tích dữ liệu thủy văn.\n\nBạn có thể **nhập văn bản** hoặc nhấn <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg> để **ra lệnh bằng giọng nói**. Bạn cần hỗ trợ gì?' }
];
let cbVoiceRecording = false;
let cbVoiceStream = null;
let cbMediaRecorder = null;
let cbAudioChunks = [];
let cbSpeaking = false;
let cbSpeechSynth = window.speechSynthesis;

// ── SVG AI Avatar — Hadiwa Mascot ───────────────────────────────
const AI_AVATAR_SVG = `<img src="assets/mascot-hadiwa.svg?v=20260326" style="width:100%;height:100%;object-fit:contain">`;
// ── Render page ──────────────────────────────────────────────────
function renderChatbot() {
  return `
  <div class="page-header" style="margin-bottom:12px">
    <div class="page-title">
      <h1>Trợ lý AI – Hadiwa</h1>
      <p>Tra cứu đê điều, thủy văn, hồ chứa, PCTT và dữ liệu vận hành · Hỗ trợ giọng nói</p>
    </div>
    <div class="page-actions">
      <div id="ttsToggle" title="Bật/tắt đọc to phản hồi AI" style="display:flex;align-items:center;gap:6px;padding:6px 12px;background:rgba(0,200,255,.06);border:1px solid rgba(0,200,255,.18);border-radius:8px;cursor:pointer;font-size:12px;color:var(--muted);transition:all .2s" onclick="toggleTts(this)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
        TTS: <span id="ttsState">Tắt</span>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="clearChat()">Xóa lịch sử</button>
      <button class="btn btn-outline btn-sm" onclick="openChatHistoryModal()">Quản lý lịch sử</button>
    </div>
  </div>

  <div class="card" style="height:calc(100vh - 230px);min-height:480px;display:flex;flex-direction:column;overflow:hidden">
    <!-- Messages -->
    <div class="chat-messages" id="chatMessages" style="flex:1;overflow-y:auto">
      ${chatHistory.map(m => renderMsg(m)).join('')}
    </div>

    <!-- Voice recording indicator -->
    <div id="voiceBar" style="display:none;align-items:center;gap:10px;padding:10px 16px;background:rgba(255,23,68,.07);border-top:1px solid rgba(255,23,68,.2)">
      <div style="display:flex;gap:3px;align-items:center">
        ${Array(7).fill(0).map((_, i) => `<div class="voice-bar-dot" style="animation-delay:${i * 0.1}s"></div>`).join('')}
      </div>
      <span style="font-size:13px;color:var(--red)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg> Đang nghe... Hãy nói câu hỏi của bạn</span>
      <button onclick="stopVoice()" style="margin-left:auto;font-size:12px;color:var(--muted);background:none;border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:4px 10px;cursor:pointer">Dừng</button>
    </div>

    <!-- Output Format Bar — chips generated inline so they appear on first render -->
    <div id="chatFormatBar" style="display:flex;align-items:center;gap:5px;padding:8px 16px 4px;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;border-top:1px solid rgba(255,255,255,.04);flex-shrink:0">
      <span style="font-size:10px;font-weight:700;color:var(--muted);letter-spacing:.06em;white-space:nowrap;flex-shrink:0">Trả lời dạng:</span>
      ${(typeof OUTPUT_FORMATS !== 'undefined' ? OUTPUT_FORMATS : []).map(f => `<button
        onclick="cbApplyOutputFormat('${f.id}','${f.text}')"
        title="${f.label}"
        style="display:inline-flex;align-items:center;gap:4px;padding:4px 9px;border-radius:20px;border:1px solid ${f.color}40;background:transparent;color:rgba(255,255,255,.45);font-size:11px;font-weight:500;cursor:pointer;white-space:nowrap;transition:all .2s;font-family:'Inter',sans-serif;flex-shrink:0"
        onmouseover="this.style.borderColor='${f.color}';this.style.color='${f.color}';this.style.background='${f.color}18'"
        onmouseout="this.style.borderColor='${f.color}40';this.style.color='rgba(255,255,255,.45)';this.style.background='transparent'">
        ${f.icon}&nbsp;${f.label}
      </button>`).join('')}
    </div>


    <!-- Suggestions -->
    <div class="chat-suggestions" id="chatSuggestions">
      ${['Mực nước sông Hồng tại Hà Nội hiện tại?', 'Hồ Tuy Lai đang ở mức cảnh báo nào?', 'Quy trình xử lý khi đê Thảm lậu?', 'Đên Hữu Đáy K18+500 đang có sự cố gì?', 'Lực lượng ứng trực hiện tại gồm ai?'].map(q => `<span class="chip" onclick="sendChip(this)">${q}</span>`).join('')}
    </div>

    <!-- Uploaded File Preview -->
    <div id="mainFilePreview" style="display:none;padding:10px 16px;border-top:1px solid rgba(255,255,255,.05);background:rgba(0,0,0,.15);position:relative">
      <div id="mainFilePreviewContent" style="display:flex;align-items:center;gap:12px"></div>
      <button onclick="clearMainFile()" style="position:absolute;top:50%;right:12px;transform:translateY(-50%);background:rgba(255,23,68,.1);border:1px solid rgba(255,23,68,.3);color:#ff6b6b;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:.2s"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>

    <!-- Input Box (Row 1 & 2) -->
    <div style="background:#131d36;padding:16px;border-radius:0 0 12px 12px;border-top:1px solid rgba(255,255,255,.05)">
      <!-- Row 1: Text Input & Send -->
      <div style="position:relative;margin-bottom:12px">
        <input type="text" id="chatInput" placeholder="Hỏi Hadiwa AI ● đê, hồ, lũ lụt, thiên tai • • •" onkeydown="if(event.key==='Enter') sendChat()" style="width:100%;background:rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#fff;font-size:14px;font-family:'Inter',sans-serif;padding:12px 45px 12px 14px;outline:none;caret-color:var(--cyan);transition:border-color .2s" onfocus="this.style.borderColor='var(--cyan)'" onblur="this.style.borderColor='rgba(255,255,255,.1)'">
        <button class="chat-send" onclick="sendChat()" style="position:absolute;right:6px;top:50%;transform:translateY(-50%);background:var(--cyan);color:#fff;border:none;width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:.2s;padding:0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>

      <!-- Row 2: Controls -->
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:20px">
          <!-- Attachment -->
          <input type="file" id="mainChatAttach" style="display:none" onchange="handleMainFileAttach(this)">
          <button onclick="document.getElementById('mainChatAttach').click()" style="background:transparent;border:none;color:var(--muted);cursor:pointer;display:flex;align-items:center;padding:0;transition:.2s" onmouseover="this.style.color='var(--cyan)'" onmouseout="this.style.color='var(--muted)'" title="Đính kèm">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>

          <!-- Tools Dropdown -->
          <div style="position:relative;display:inline-block">
            <button onclick="const m = document.getElementById('mainToolMenu'); window._mainCatClose?window._mainCatClose():null; m.style.display = m.style.display==='block'?'none':'block'; window._mainToolClose=()=>m.style.display='none'; event.stopPropagation();" style="background:transparent;border:none;color:var(--muted);cursor:pointer;display:flex;align-items:center;gap:6px;font-size:13px;font-weight:500;padding:2px 6px;border-radius:6px;transition:.2s" onmouseover="this.style.background='rgba(255,255,255,.05)';this.style.color='#fff'" onmouseout="this.style.background='transparent';this.style.color='var(--muted)'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              <span id="mainToolLabel">Công cụ</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div id="mainToolMenu" style="display:none;position:absolute;bottom:calc(100% + 10px);left:-20px;background:#1e293b;border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:6px;min-width:180px;box-shadow:0 4px 20px rgba(0,0,0,.5);z-index:100;animation:chatPop .2s ease">
              <div style="padding:8px 12px;font-size:13px;color:#fff;cursor:pointer;border-radius:6px;transition:.2s;display:flex;align-items:center;gap:8px" onmouseover="this.style.background='rgba(255,255,255,.1)'" onmouseout="this.style.background='transparent'" onclick="document.getElementById('mainToolLabel').innerText='Phân tích mực nước'; this.parentElement.style.display='none'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> Phân tích mực nước</div>
              <div style="padding:8px 12px;font-size:13px;color:#fff;cursor:pointer;border-radius:6px;transition:.2s;display:flex;align-items:center;gap:8px" onmouseover="this.style.background='rgba(255,255,255,.1)'" onmouseout="this.style.background='transparent'" onclick="document.getElementById('mainToolLabel').innerText='Tra cứu sự cố Đê'; this.parentElement.style.display='none'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Tra cứu sự cố Đê</div>
              <div style="padding:8px 12px;font-size:13px;color:#fff;cursor:pointer;border-radius:6px;transition:.2s;display:flex;align-items:center;gap:8px" onmouseover="this.style.background='rgba(255,255,255,.1)'" onmouseout="this.style.background='transparent'" onclick="document.getElementById('mainToolLabel').innerText='Viết báo cáo PCTT'; this.parentElement.style.display='none'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Viết báo cáo PCTT</div>
              <div style="padding:8px 12px;font-size:13px;color:#fff;cursor:pointer;border-radius:6px;transition:.2s;display:flex;align-items:center;gap:8px" onmouseover="this.style.background='rgba(255,255,255,.1)'" onmouseout="this.style.background='transparent'" onclick="document.getElementById('mainToolLabel').innerText='Tìm kiếm văn bản'; this.parentElement.style.display='none'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg> Tìm kiếm văn bản</div>
              <div style="padding:8px 12px;font-size:13px;color:#fff;cursor:pointer;border-radius:6px;transition:.2s;display:flex;align-items:center;gap:8px" onmouseover="this.style.background='rgba(255,255,255,.1)'" onmouseout="this.style.background='transparent'" onclick="document.getElementById('mainToolLabel').innerText='Phân tích ảnh hiện trường'; this.parentElement.style.display='none'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> Phân tích ảnh hiện trường</div>
            </div>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:12px">
          <!-- Category Dropdown -->
          <div style="position:relative;display:inline-block">
            <button onclick="const m = document.getElementById('mainCatMenu'); window._mainToolClose?window._mainToolClose():null; m.style.display = m.style.display==='block'?'none':'block'; window._mainCatClose=()=>m.style.display='none'; event.stopPropagation();" style="background:transparent;border:none;color:var(--muted);cursor:pointer;display:flex;align-items:center;gap:4px;font-size:13px;font-weight:500;padding:4px 8px;border-radius:6px;transition:.2s" onmouseover="this.style.background='rgba(255,255,255,.05)';this.style.color='#fff'" onmouseout="this.style.background='transparent';this.style.color='var(--muted)'">
              <span id="mainCatLabel" style="display:flex;align-items:center;gap:5px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> Tất cả chủ đề</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div id="mainCatMenu" style="display:none;position:absolute;bottom:calc(100% + 5px);right:0;background:#1e293b;border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:6px;min-width:160px;box-shadow:0 4px 20px rgba(0,0,0,.5);z-index:100;animation:chatPop .2s ease">
              <div style="padding:8px 12px;font-size:13px;color:#fff;cursor:pointer;border-radius:6px;transition:.2s;background:rgba(255,255,255,.05);display:flex;align-items:center;gap:8px" onclick="document.getElementById('mainCatLabel').innerHTML='<svg width=&quot;14&quot; height=&quot;14&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;2&quot; style=&quot;flex-shrink:0&quot;><circle cx=&quot;12&quot; cy=&quot;12&quot; r=&quot;10&quot;/><line x1=&quot;2&quot; y1=&quot;12&quot; x2=&quot;22&quot; y2=&quot;12&quot;/><path d=&quot;M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z&quot;/></svg> Tất cả chủ đề'; this.parentElement.style.display='none'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> Tất cả chủ đề</div>
              <div style="padding:8px 12px;font-size:13px;color:#fff;cursor:pointer;border-radius:6px;transition:.2s;display:flex;align-items:center;gap:8px" onmouseover="this.style.background='rgba(255,255,255,.1)'" onmouseout="this.style.background='transparent'" onclick="document.getElementById('mainCatLabel').innerHTML='<svg width=&quot;14&quot; height=&quot;14&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;2&quot; style=&quot;flex-shrink:0&quot;><path d=&quot;M3 7h18M3 12h18M3 17h12&quot;/></svg> Đê điều'; this.parentElement.style.display='none'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><path d="M3 7h18M3 12h18M3 17h12"/></svg> Đê điều</div>
              <div style="padding:8px 12px;font-size:13px;color:#fff;cursor:pointer;border-radius:6px;transition:.2s;display:flex;align-items:center;gap:8px" onmouseover="this.style.background='rgba(255,255,255,.1)'" onmouseout="this.style.background='transparent'" onclick="document.getElementById('mainCatLabel').innerHTML='<svg width=&quot;14&quot; height=&quot;14&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;2&quot; style=&quot;flex-shrink:0&quot;><path d=&quot;M2 12c2-4 4-6 10-6s8 2 10 6c-2 4-4 6-10 6S4 16 2 12z&quot;/><path d=&quot;M12 12v.01&quot;/></svg> Thủy văn &amp; Mưa lũ'; this.parentElement.style.display='none'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg> Thủy văn &amp; Mưa lũ</div>
              <div style="padding:8px 12px;font-size:13px;color:#fff;cursor:pointer;border-radius:6px;transition:.2s;display:flex;align-items:center;gap:8px" onmouseover="this.style.background='rgba(255,255,255,.1)'" onmouseout="this.style.background='transparent'" onclick="document.getElementById('mainCatLabel').innerHTML='<svg width=&quot;14&quot; height=&quot;14&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;2&quot; style=&quot;flex-shrink:0&quot;><rect x=&quot;2&quot; y=&quot;7&quot; width=&quot;20&quot; height=&quot;14&quot; rx=&quot;2&quot;/><path d=&quot;M16 7V5a2 2 0 00-4 0v2M8 7V5a2 2 0 00-4 0v2&quot;/></svg> Hồ chứa &amp; Trạm bơm'; this.parentElement.style.display='none'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-4 0v2"/></svg> Hồ chứa &amp; Trạm bơm</div>
              <div style="padding:8px 12px;font-size:13px;color:#fff;cursor:pointer;border-radius:6px;transition:.2s;display:flex;align-items:center;gap:8px" onmouseover="this.style.background='rgba(255,255,255,.1)'" onmouseout="this.style.background='transparent'" onclick="document.getElementById('mainCatLabel').innerHTML='<svg width=&quot;14&quot; height=&quot;14&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;2&quot; style=&quot;flex-shrink:0&quot;><path d=&quot;M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z&quot;/><line x1=&quot;12&quot; y1=&quot;9&quot; x2=&quot;12&quot; y2=&quot;13&quot;/><line x1=&quot;12&quot; y1=&quot;17&quot; x2=&quot;12.01&quot; y2=&quot;17&quot;/></svg> Thiên tai &amp; Cứu nạn'; this.parentElement.style.display='none'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Thiên tai &amp; Cứu nạn</div>
              <div style="padding:8px 12px;font-size:13px;color:#fff;cursor:pointer;border-radius:6px;transition:.2s;display:flex;align-items:center;gap:8px" onmouseover="this.style.background='rgba(255,255,255,.1)'" onmouseout="this.style.background='transparent'" onclick="document.getElementById('mainCatLabel').innerHTML='<svg width=&quot;14&quot; height=&quot;14&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;2&quot; style=&quot;flex-shrink:0&quot;><path d=&quot;M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z&quot;/><polyline points=&quot;14 2 14 8 20 8&quot;/></svg> Văn bản &amp; Kế hoạch'; this.parentElement.style.display='none'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Văn bản &amp; Kế hoạch</div>
            </div>

          </div>

          <!-- Micro Button -->
          <button id="mainMicBtn" onclick="toggleVoice()" style="background:transparent;border:none;color:var(--muted);cursor:pointer;display:flex;align-items:center;padding:0;transition:.2s" onmouseover="this.style.color='var(--cyan)'" onmouseout="this.style.color='var(--muted)'" title="Voice chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

// ── Message renderer ─────────────────────────────────────────────
function renderMsg(m) {
  const isUser = m.role === 'user';
  const isVoice = !!m.audioSrc;
  const ttsBtnId = 'tts_' + Date.now() + Math.random().toString(36).slice(2, 6);
  const html = m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

  // Voice message indicator (user spoke)
  const voiceTag = isVoice ? `
    <div class="audio-player" style="margin-top:8px;display:flex;align-items:center;gap:8px">
      <button onclick="playAudio('${m.audioSrc}', this)" style="width:28px;height:28px;border-radius:50%;background:rgba(0,200,255,.15);border:1px solid rgba(0,200,255,.3);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style="color:var(--cyan)"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </button>
      <div style="flex:1;height:3px;background:rgba(0,200,255,.12);border-radius:3px;position:relative">
        <div class="audio-progress-bar" style="height:100%;width:0%;background:var(--cyan);border-radius:3px;transition:width .1s"></div>
      </div>
      <span style="font-size:10px;color:var(--muted);font-family:'Roboto Mono',monospace">0:${Math.floor(Math.random() * 4 + 2).toString().padStart(2, '0')}</span>
    </div>` : '';

  // Encode TTS text to prevent HTML injection errors in string template
  const encodedText = encodeURIComponent(m.text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/[#|*\[\]]/g, ''));

  // TTS button for AI messages
  const ttsBtn = !isUser ? `
  <button id="${ttsBtnId}" class="tts-speak-btn" onclick="speakText(this, '${encodedText}')" title="Đọc to phản hồi này" style="margin-top:7px;font-size:11px;color:var(--muted);background:none;border:1px solid rgba(0,200,255,.15);border-radius:6px;padding:3px 9px;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:all .2s" onmouseover="this.style.borderColor='rgba(0,200,255,.4)'" onmouseout="if(!cbSpeaking||window._ttsActiveBtn!==this)this.style.borderColor='rgba(0,200,255,.15)'">
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg> Đọc to
  </button>` : '';

  // File attachment card
  const fileCard = (m.fileId && _fileRegistry[m.fileId]) ? renderFileCard(_fileRegistry[m.fileId], m.fileId) : '';

  return `<div class="chat-msg ${isUser ? 'user' : ''}">
    <div class="chat-avatar ${isUser ? 'user' : 'ai'}">${isUser ? 'AD' : '<img src="assets/mascot-hadiwa.svg?v=20260326" style="width:100%;height:100%;object-fit:contain">'}</div>
    <div class="chat-bubble ${isUser ? 'user' : 'ai'}">
      ${isVoice ? `<div style="display:flex;align-items:center;gap:5px;margin-bottom:5px;font-size:11px;color:var(--cyan)"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/></svg> Tin nhắn giọng nói</div>` : ''}
      ${html}
      ${voiceTag}
      ${fileCard}
      ${ttsBtn}
    </div>
  </div>`;
}

// ── AI responses ─────────────────────────────────────────────────
const AI_RESPONSES = {
  'thảm lậu': `**Quy trình xử lý đê thảm lậu / mạch sủi khẩn cấp:**\n\n1. **Báo cáo ngay** – Liên hệ Đội ưứng cứu sự cố (ƯCSC) gần nhất và Bộ phận Điều hành PCTT.\n2. **Cắm giọi khóa khu vực** – Cắm biển cảnh báo 500m hai phía, cấm người qua lại.\n3. **Sử dụng bao tải cát** – Đắp khẩn cấp ép mạch nước, không đào sâu vào đê.\n4. **Giám sát mục nước** – Khắc phục đồng thời theo dõi mực nước sông mỗi 15 phút.\n5. **Hỏ sơ thủy văn** – Theo dõi sông Hồng, nếu tiếp tục dâng cần sẵn sàng sơ tán.\n6. **Báo cáo về BCH PCTT** – Gửi báo cáo sự cố trong vòng 2h cho Ban Chỉ huy PCTT TP. Hà Nội.\n\n⚠️ Tham khảo: Quy trình ứng cứu QT-PCTT-004, Tiêu chuẩn TCVN 8636:2011.`,
  'mực nước': `**Mực nước các trạm dọc sông Hồng (hiện tại):**\n\n| Trạm | Sông | Mực nước | Báo động | Trạng thái |\n|---|---|---|---|---|\n| Hà Nội | S. Hồng | **4.82m** | BĐ1: 9.5m | [Bình thường] |\n| Sơn Tây | S. Hồng | **7.15m** | Bơ0: 11.0m | Bình thường |\n| Thượng Cát | S. Đuống | **5.38m** | Bơ0: 8.2m | Bình thường |\n| Ba Thá | S. Đáy | **3.95m** | Bơ0: 8.5m | Bình thường |\n| Lý Nhân | S. Hồng | **2.81m** | Bơ0: 9.0m | Bình thường |\n\nGhi chú: Mực nước cập nhật lúc 12:00 hôm nay. Độ chính xác ±0.05m.`,
  'hồ tuy lai': `Theo dữ liệu hiện tại, **Hồ Tuy Lai** (Đồng Xuân – Mỹ Đức) đang: \n\n<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--red);vertical-align:middle"></span> **Mực nước: 19.2m** – tiệm cận cảnh báo 2 (19.5m)\n<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--red);vertical-align:middle"></span> **Tràn xả lũ:** đang mở 3 khoang (Q=28 m³/s)\n<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--yellow);vertical-align:middle"></span> **Thảm lượng hồ:** 31.2 triệu m³ / 35 triệu m³ (89%)\n\nĐề xuất: Tiếp tục xả kiểm soát, theo dõi hạ lưu sông Đáy, sẵn sàng phương án sơ tán khu vực Mỹ Đức.`,
  'suối hai': `**Hồ Suối Hai (Ba Vì):**\n\n - Mực nước: **20.8m** (MNDBT: 21.0m) ✅ An toàn\n - Dung tích: 47.6 triệu m³ / 51.6 triệu m³ (92%)\n - Đang tưới: 7.500 ha nông nghiệp Ba Vì\n - Trạng thái xả tràn: Đóng\n\nChú ý: dự báo mưa 25-50mm vào sáng mai, cần giám sát chặt mực hồ sau 06:00.`,
  'đê hữu đáy': `Theo dữ liệu từ hệ thống IoT, **Đê Hữu Đáy K18+500** đang có:\n\n<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--red);vertical-align:middle"></span> **Sự cố SC-003** – Mạch sủi thảm lậu lưu lượng 3.2 l/s (11:45 hôm nay)\n<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--red);vertical-align:middle"></span> **Đội ƯCSC số 3** đang triển khai tại hiện trưỜng\n<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--yellow);vertical-align:middle"></span> **Cảnh báo** – Mực nước sông Đáy 3.95m (Bơ0: 8.5m)\n\nĐề xuất khẩn: Thêm tấm bút ép cát, cắm thêm 10 bao ở phương dáng, gọi bổ sung nhân lực.`,
  'thiết bị': `**Danh sách thiết bị sắp đến hạn bảo dưỡng:**\n\n| Thiết bị | Địa điểm | Hạn BD | Mức ưu tiên |\n|---|---|---|---|\n| Máy bơm động lực #1 | Trạm Hà Nội | **15/04/2026** | Trung bình |\n| Cảm biến mực nước (IoT) | Đê Tả Hồng K35 | **20/03/2026** | ⚠️ Sắp đến hạn |\n| Máy bơm thoát lũ #2 | Trạm Bơm Phú Diễn | **Cần kiểm tra ngay** | 🚨 Khẩn cấp |\n\n⚠️ Máy bơm Trạm Bơm Phú Diễn còn 8 ngày đến hạn định kỳ.`,
  'cảnh báo': `**Danh sách cảnh báo lũ hiện tại:**\n\n| Mức | Địa điểm | Nguy cơ | Trạng thái |\n|---|---|---|---|\n| Bơ2 | Hồ Tuy Lai – Mỹ Đức | Xả tràn 3 khoang | [Đang xử lý] |\n| Bơ1 | Đê Ngọc Tảo K5+100 | Nứt dọc đỉnh 180m | [Ứng cứu] |\n| Bơ1 | Đê Hữu Đáy K18+500 | Mạch sủi + thảm lậu | [Ứng cứu] |\n| Bơ0 | Đê Hữu Hồng K22+300 | Sạt mái đê | [Theo dõi] |\n\nTổng 2 cảnh báo chưa xử lý xong, 2 đang theo dõi.`,
  'nhân lực': `**Lực lượng ứng trực (hiện tại):**\n\n- Tổng cán bộ on-call: **${BIZ_STATS?.onDutyStaff || 38} người**\n- Số đội hiện trường: **${BIZ_STATS?.fieldTeams || 7} đội** (mỗi đội 5-8 người)\n- Phương tiện sẵn sàng: 12 xe tải, 4 máy bơm dã chiến, 6 thiết bị lặn\n- Vật tư kho: 45.000 bao tải cát, 30.000 rọ đá, 4.000 cọ tre\n\nĐội ƯCSC số 3 đang triển khai tại Đê Hữu Đáy K18+500.`,
  'báo cáo': `**Báo cáo vận hành hôm nay (12/3/2026):**\n\n- Tổng tuyến đê: **${DIKE_DATA?.length || 10} tuyến** | Xung yếu: 3 tuyến\n- Hồ chứa đang theo dõi: **${RESERVOIR_DATA?.length || 6} hồ** | Cảnh báo: 1 hồ\n- Trạm thủy văn online: **5/8 trạm**\n- Sự cố đang xử lý: **7 vụ**\n- Lệnh chờ phê duyệt: **4 lệnh**\n\n<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Tháng 3/2026 tính đến nay: 18 sự cố đã xử lý, 3 đang mở.`,
};

// ── Bảng so sánh / Table format AI responses ────────────────────
AI_RESPONSES['bảng so sánh'] = `**So sánh tình trạng các hồ chứa đang theo dõi:**

| Hồ chứa | Mực nước | Dung tích (%) | Xả tràn | Cảnh báo |
|---|---|---|---|---|
| Hồ Tuy Lai | 19.2m | 89% | Đang xả 3 khoang | ⚠️ Bảo 2 |
| Hồ Suối Hai | 20.8m | 92% | Đóng | ✅ An toàn |
| Hồ Đồng Quan | 15.4m | 76% | Đóng | ✅ An toàn |
| Hồ Quan Sơn | 18.1m | 84% | Đang xả 1 khoang | ⚠️ Giám sát |
| Hồ Hòa Bình | 112.0m | 71% | Đang điều tiết | ✅ Bình thường |

ℹ️ Dữ liệu cập nhật 12:00 hôm nay. Bạn có muốn xuất **Excel** không?`;
AI_RESPONSES['bảng mực nước']    = AI_RESPONSES['bảng so sánh'];
AI_RESPONSES['so sánh hồ chứa'] = AI_RESPONSES['bảng so sánh'];
AI_RESPONSES['bảng so sánh hồ'] = AI_RESPONSES['bảng so sánh'];
AI_RESPONSES['trả lời dạng bảng'] = AI_RESPONSES['bảng so sánh'];
AI_RESPONSES['bảng thống kê'] = `**Thống kê tình hình đê điều tháng 3/2026:**

| Chỉ tiêu | Giá trị | So tháng trước | Ghi chú |
|---|---|---|---|
| Sự cố đê điều | 7 vụ | ↗ +2 | 2 sự cố nặng |
| Tôm tất khẩn cấp | 3 lần | ↑ +1 | Đê Hữu Đáy |
| Cảnh báo lũ | 2 cấp Bảo2 | → = | Tuy Lai, Ngọc Tảo |
| Lực lượng ứng trực | 38 người | ↓ -2 | Nghỉ ốm 2 cán bộ |
| Vật tư tồn kho (bao cát) | 45.000 | ↓ -5.000 | Đã xuất cấp |
| Hồ chứa cảnh báo | 1 hồ | → = | Hồ Tuy Lai |`;

// ── File attachment responses (keyword → text + file metadata) ───
const FILE_RESPONSES = [
  {
    keywords: ['bảng so sánh', 'bảng thống kê', 'bảng mực nước', 'so sánh hồ chứa', 'bảng so sánh hồ', 'trả lời dạng bảng'],
    text: 'Tôi đã tạo **bảng so sánh tình trạng các hồ chứa** theo dõi tháng 3/2026. Bạn có thể tải về dạng Excel để chỉnh sửa.',
    file: {
      type: 'excel',
      name: 'BangSoSanh_HoChua_T3_2026.xlsx',
      size: '18 KB',
      preview: [
        ['Hồ chứa', 'Mực nước', 'Dung tích (%)', 'Xả tràn', 'Cảnh báo'],
        ['Hồ Tuy Lai', '19.2m', '89%', 'Đang xả 3 khoang', '⚠️ Bảo 2'],
        ['Hồ Suối Hai', '20.8m', '92%', 'Đóng', '✅ An toàn'],
        ['Hồ Đồng Quan', '15.4m', '76%', 'Đóng', '✅ An toàn'],
        ['Hồ Quan Sơn', '18.1m', '84%', 'Đang xả 1 khoang', '⚠️ Giám sát'],
      ],
    },
  },
  {
    keywords: ['xuất excel', 'excel', 'tải excel', 'file excel', 'danh sách thiết bị', 'xuất danh sách'],
    text: 'Tôi đã xuất **danh sách thiết bị** ra file Excel. Bạn có thể tải về và xem chi tiết lịch bảo dưỡng, thông số kỹ thuật từng thiết bị.',
    file: {
      type: 'excel',
      name: 'DanhSachThietBi_T2_2026.xlsx',
      size: '34 KB',
      preview: [
        ['Thiết bị', 'Nhà máy', 'Trạng thái', 'Hạn BDưỡng'],
        ['Máy bơm ly tâm #1', 'Hồng Gai', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Hoạt động', '15/04/2026'],
        ['Máy bơm áp lực #1', 'Bãi Cháy', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Sắp đến hạn', '20/03/2026'],
        ['Biến tần ABB ACS550', 'Cẩm Phả', '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--red);vertical-align:middle"></span> Cần sửa ngay', '25/02/2026'],
        ['Máy bơm ly tâm #2', 'Hồng Gai', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Hoạt động', '10/06/2026'],
        ['Cảm biến áp suất', 'Uông Bí', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Hoạt động', '01/05/2026'],
      ],
    },
  },
  {
    keywords: ['báo cáo tháng', 'báo cáo sản lượng', 'báo cáo kpi', 'report', 'pdf báo cáo', 'xuất báo cáo'],
    text: 'Tôi đã tạo **Báo cáo vận hành tháng 2/2026** dạng PDF. File bao gồm tóm tắt KPI, sản lượng, chất lượng nước và NRW theo từng khu vực.',
    file: {
      type: 'report',
      name: 'BaoCao_VanHanh_T2_2026.pdf',
      size: '1.2 MB',
      title: 'Báo cáo Vận hành Tháng 2/2026',
      subtitle: 'Chi cục Thủy lợi & PCTT Hà Nội — Hadiwa IOC',
      kpis: [
        { label: 'An toàn đê', value: '98.5%', trend: '+0.2%', ok: true },
        { label: 'Lưu lượng xả', value: '1,250 m³/s', trend: '+45%', ok: true },
        { label: 'Trạm online', value: '8/8', trend: '100%', ok: true },
        { label: 'Sự cố', value: '3 vụ', trend: '2 đã đóng', ok: false },
      ],
    },
  },
  {
    keywords: ['biểu đồ nrw', 'chart nrw', 'biểu đồ thất thoát', 'biểu đồ áp lực', 'biểu đồ sản lượng', 'chart sản lượng', 'xuất biểu đồ'],
    text: 'Đây là **biểu đồ NRW và sản lượng** theo tháng được xuất từ hệ thống. Bấm tải về để lưu file ảnh PNG chất lượng cao.',
    file: {
      type: 'chart',
      name: 'BieuDo_NRW_SanLuong_2026.png',
      size: '280 KB',
      bars: [
        { label: 'T9/25', val: 12, nrw: 2.1 }, { label: 'T10/25', val: 15, nrw: 1.8 },
        { label: 'T11/25', val: 18, nrw: 1.5 }, { label: 'T12/25', val: 22, nrw: 1.6 },
        { label: 'T1/26', val: 20, nrw: 1.4 }, { label: 'T2/26', val: 25, nrw: 1.2 },
      ],
    },
  },
  {
    keywords: ['ảnh trạm', 'hình ảnh trạm', 'ảnh nhà máy', 'hình nhà máy', 'ảnh sự cố', 'hình sự cố', 'ảnh hiện trường'],
    text: 'Đây là **ảnh hiện trường Trạm Cẩm Phả** chụp ngày 27/02/2026 khi xảy ra sự cố máy bơm #2. Ảnh được lưu trong hệ thống CSKH.',
    file: {
      type: 'image',
      name: 'HienTruong_DeHuuDay_12032026.jpg',
      size: '1.8 MB',
      location: 'Đê Hữu Đáy · K18+500',
      timestamp: '12/03/2026 14:22',
    },
  },
  {
    keywords: ['xuất chất lượng', 'kết quả kiểm nghiệm', 'báo cáo chất lượng', 'file chất lượng nước'],
    text: 'Tôi đã xuất **Kết quả kiểm nghiệm chất lượng nước** tháng 2/2026 dạng Excel. Bao gồm đầy đủ các chỉ tiêu theo QCVN 01-1:2024/BYT.',
    file: {
      type: 'excel',
      name: 'KetQua_ChatLuongNuoc_T2_2026.xlsx',
      size: '48 KB',
      preview: [
        ['Nhà máy', 'pH', 'Clo dư', 'Độ đục (NTU)', 'Kết quả'],
        ['Hồng Gai', '7.20', '0.35 mg/L', '0.8 NTU', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Đạt'],
        ['Bãi Cháy', '7.00', '0.42 mg/L', '1.1 NTU', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Đạt'],
        ['Cẩm Phả', '7.40', '0.61 mg/L <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>', '1.3 NTU', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2.5" style="vertical-align:middle"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Không đạt'],
        ['Uông Bí', '7.15', '0.38 mg/L', '0.7 NTU', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Đạt'],
        ['Vân Đồn', '6.95', '0.30 mg/L', '0.9 NTU', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Đạt'],
      ],
    },
  },
  {
    keywords: ['lịch sự cố', 'xuất sự cố', 'danh sách sự cố', 'báo cáo sự cố'],
    text: 'Đây là **Báo cáo sự cố tháng 2/2026** xuất từ hệ thống. Bao gồm 6 sự cố với trạng thái xử lý, thời gian và đơn vị phụ trách.',
    file: {
      type: 'excel',
      name: 'BaoCao_SuCo_T2_2026.xlsx',
      size: '22 KB',
      preview: [
        ['Mã SC', 'Loại sự cố', 'Địa điểm', 'Thời gian', 'Trạng thái'],
        ['SC-001', 'Vỡ ống DN110', 'Hồng Gai – P3', '05/02 08:30', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Đóng'],
        ['SC-002', 'Tụt áp đột ngột', 'Bãi Cháy', '10/02 13:45', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Đóng'],
        ['SC-003', 'Motor Overload', 'Cẩm Phả – Bơm 2', '27/02 14:20', '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--red);vertical-align:middle"></span> Mở'],
        ['SC-004', 'Clo dư vượt QC', 'Cẩm Phả', '27/02 16:00', '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--red);vertical-align:middle"></span> Mở'],
        ['SC-005', 'Mất điện TBA', 'Uông Bí', '18/02 21:00', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Đóng'],
      ],
    },
  },
  {
    keywords: ['xuất word', 'file word', 'word document', 'docx', 'tải word', 'công văn word', 'quyết định word', 'kế hoạch word'],
    text: 'Tôi đã tạo **Công văn / Kế hoạch ứng phó lũ lụt** dạng Word (.docx). File bao gồm nội dung chính thức có thể chỉnh sửa trước khi ký duyệt.',
    file: {
      type: 'word',
      name: 'KH_UngPho_LuLut_T3_2026.docx',
      size: '82 KB',
      pages: 4,
      sections: ['I. Tình hình chung', 'II. Phương án ứng phó', 'III. Lực lượng & Vật tư', 'IV. Phân công nhiệm vụ'],
    },
  },
  {
    keywords: ['bản đồ nhiệt', 'heat map', 'heatmap', 'vùng ngập', 'bản đồ ngập lụt', 'bản đồ rủi ro', 'phân bố ngập'],
    text: 'Đây là **Bản đồ nhiệt vùng ngập lụt** dự báo theo mô hình thủy văn. Màu đỏ = nguy cơ cao, vàng = cảnh báo, xanh = bình thường.',
    file: {
      type: 'heatmap',
      name: 'BanDo_NgapLut_DuBao_T3_2026.png',
      size: '420 KB',
      zones: [
        { label: 'Mỹ Đức', risk: 'high' },
        { label: 'Chương Mỹ', risk: 'high' },
        { label: 'Quốc Oai', risk: 'medium' },
        { label: 'Ba Vì', risk: 'medium' },
        { label: 'Phúc Thọ', risk: 'low' },
        { label: 'Đan Phượng', risk: 'low' },
      ],
    },
  },
];

// ── Render file attachment card ──────────────────────────────────
function renderFileCard(file, fileId) {
  const icons = {
    excel: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    report: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    chart: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
    image: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    word: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>',
    heatmap: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>',
  };
  const colors = { excel: '#00e676', report: '#00c8ff', chart: '#ffca28', image: '#7c4dff', word: '#2196f3', heatmap: '#ff5722' };
  const bgColors = { excel: 'rgba(0,230,118,.08)', report: 'rgba(0,200,255,.08)', chart: 'rgba(255,202,40,.08)', image: 'rgba(124,77,255,.08)', word: 'rgba(33,150,243,.08)', heatmap: 'rgba(255,87,34,.08)' };
  const typeLabels = { excel: 'Excel Spreadsheet', report: 'PDF Report', chart: 'PNG Chart', image: 'JPEG Image', word: 'Word Document', heatmap: 'Heat Map PNG' };

  let preview = '';

  if (file.type === 'excel' && file.preview) {
    // Mini spreadsheet preview
    preview = `<div style="overflow:hidden;border-radius:6px;border:1px solid rgba(0,230,118,.2);margin-bottom:10px;max-height:140px;overflow-y:auto">
      <table style="width:100%;border-collapse:collapse;font-size:10px;font-family:'Roboto Mono',monospace">
        ${file.preview.map((row, ri) => `<tr style="background:${ri === 0 ? 'rgba(0,230,118,.12)' : 'rgba(0,0,0,.1)'}">
          ${row.map(cell => `<td style="padding:4px 8px;border:1px solid rgba(0,230,118,.1);white-space:nowrap;font-weight:${ri === 0 ? 700 : 400};color:${ri === 0 ? 'var(--green)' : 'var(--text-2)'}">${cell}</td>`).join('')}
        </tr>`).join('')}
      </table>
    </div>`;
  }

  if (file.type === 'report' && file.kpis) {
    // PDF report cover preview
    preview = `<div style="background:linear-gradient(135deg,#071629,#0d2545);border-radius:8px;padding:14px;margin-bottom:10px;border:1px solid rgba(0,200,255,.15)">
      <div style="font-size:11px;font-weight:700;color:var(--cyan);margin-bottom:2px;letter-spacing:.5px">${file.title}</div>
      <div style="font-size:10px;color:var(--muted);margin-bottom:10px">${file.subtitle}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        ${(file.kpis || []).map(k => `<div style="background:rgba(0,0,0,.2);border-radius:5px;padding:6px 8px;border:1px solid ${k.ok ? 'rgba(0,230,118,.15)' : 'rgba(255,23,68,.15)'}">
          <div style="font-size:9px;color:var(--muted)">${k.label}</div>
          <div style="font-size:13px;font-weight:700;color:${k.ok ? 'var(--green)' : 'var(--yellow)'};font-family:'Roboto Mono',monospace">${k.value}</div>
          <div style="font-size:9px;color:var(--muted)">${k.trend}</div>
        </div>`).join('')}
      </div>
    </div>`;
  }

  if (file.type === 'chart' && file.bars) {
    // SVG bar + line chart preview
    const maxBar = Math.max(...file.bars.map(b => b.val));
    const W = 260, H = 90, barW = 28, gap = 14;
    const barsHtml = file.bars.map((b, i) => {
      const x = 10 + i * (barW + gap);
      const barH = Math.round((b.val / maxBar) * 60);
      const y = H - 20 - barH;
      return `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="3" fill="rgba(0,200,255,.45)" stroke="#00c8ff" stroke-width="1"/>
              <text x="${x + barW / 2}" y="${H - 6}" text-anchor="middle" font-size="8" fill="#546e7a">${b.label}</text>
              <text x="${x + barW / 2}" y="${y - 3}" text-anchor="middle" font-size="8" fill="#00c8ff">${b.val}</text>`;
    }).join('');
    const linePoints = file.bars.map((b, i) => {
      const x = 10 + i * (barW + gap) + barW / 2;
      const y = H - 20 - Math.round((b.nrw / 20) * 60);
      return `${x},${y}`;
    }).join(' ');
    preview = `<div style="background:#030e1c;border-radius:8px;padding:8px;margin-bottom:10px;border:1px solid rgba(0,200,255,.12)">
      <div style="font-size:10px;color:var(--muted);margin-bottom:4px">Sản lượng (triệu m³) vs NRW (%)</div>
      <svg width="${W}" height="${H}" style="overflow:visible">
        ${barsHtml}
        <polyline points="${linePoints}" fill="none" stroke="#ffca28" stroke-width="1.5" stroke-dasharray="4 2"/>
      </svg>
    </div>`;
  }

  if (file.type === 'image') {
    // Photo frame mock with location details
    preview = `<div style="border-radius:8px;overflow:hidden;margin-bottom:10px;position:relative;background:#0a1a2e;border:1px solid rgba(124,77,255,.25)">
      <svg viewBox="0 0 300 170" width="100%" style="display:block">
        <rect width="300" height="170" fill="#0a1a2e"/>
        <!-- Sky -->
        <rect width="300" height="90" fill="#071629"/>
        <!-- Ground -->
        <rect y="90" width="300" height="80" fill="#0d1f35"/>
        <!-- Building outline -->
        <rect x="40" y="30" width="220" height="100" rx="4" fill="#0d2545" stroke="#00c8ff" stroke-width="0.5"/>
        <rect x="60" y="50" width="80" height="60" fill="#071629" stroke="rgba(0,200,255,.3)" stroke-width="0.5"/>
        <rect x="160" y="50" width="80" height="60" fill="#071629" stroke="rgba(0,200,255,.3)" stroke-width="0.5"/>
        <!-- Windows -->
        ${[65, 95, 125, 165, 195, 225].map(x => `<rect x="${x}" y="55" width="14" height="10" rx="1" fill="rgba(255,202,40,.7)"/><rect x="${x}" y="72" width="14" height="10" rx="1" fill="rgba(0,200,255,.5)"/>`).join('')}
        <!-- Pump equipment -->
        <ellipse cx="150" cy="115" rx="20" ry="12" fill="#0d2545" stroke="#00c8ff" stroke-width="1"/>
        <rect x="140" y="103" width="5" height="20" fill="#0d3060"/>
        <rect x="155" y="103" width="5" height="20" fill="#0d3060"/>
        <!-- Warning overlay -->
        <rect x="100" y="60" width="100" height="40" rx="4" fill="rgba(255,23,68,.12)" stroke="rgba(255,23,68,.4)" stroke-width="1"/>
        <text x="150" y="77" text-anchor="middle" font-size="11" fill="#ff1744" font-weight="bold"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> S.Cố SC-003</text>
        <text x="150" y="92" text-anchor="middle" font-size="8" fill="#ff6b6b">Motor Overload - Bơm #2</text>
        <!-- Timestamp bar -->
        <rect y="148" width="300" height="22" fill="rgba(0,0,0,.7)"/>
        <text x="8" y="162" font-size="9" fill="#7c90a0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> ${file.location}</text>
        <text x="230" y="162" font-size="9" fill="#7c90a0" font-family="monospace">${file.timestamp}</text>
      </svg>
    </div>`;
  }

  return `<div class="file-card" id="fc_${fileId}" style="margin-top:10px;border:1px solid ${colors[file.type] || 'var(--border)'};border-radius:10px;overflow:hidden;background:${bgColors[file.type] || 'rgba(0,0,0,.1)'}">
    ${preview}
    <div style="padding:10px 12px;border-top:1px solid rgba(255,255,255,.05);display:flex;align-items:center;gap:10px">
      <span style="font-size:18px">${icons[file.type] || '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${file.name}</div>
        <div style="font-size:10px;color:var(--muted);margin-top:1px">${typeLabels[file.type] || 'File'} · ${file.size}</div>
      </div>
      <button onclick="downloadFile('${fileId}')" style="flex-shrink:0;display:flex;align-items:center;gap:5px;padding:6px 12px;background:${colors[file.type] || 'var(--cyan)'};color:#071629;border:none;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;letter-spacing:.3px;transition:opacity .2s" onmouseover="this.style.opacity='.8'" onmouseout="this.style.opacity='1'">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Tải về
      </button>
    </div>
  </div>`;
}

// ── File download blob generator ─────────────────────────────────
const _fileRegistry = {};

function downloadFile(fileId) {
  const file = _fileRegistry[fileId];
  if (!file) { showToast('Đang tải file...'); return; }
  try {
    let blob, ext;
    if (file.type === 'excel') {
      // Generate CSV as Excel-compatible
      const rows = file.preview || [['Không có dữ liệu']];
      const csv = '\uFEFF' + rows.map(r => r.map(c => `"${c}"`).join(',')).join('\r\n');
      blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      ext = '.csv';
    } else if (file.type === 'report') {
      // Generate HTML report
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${file.title || file.name}</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;color:#222}h1{color:#0050cc}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ccc;padding:8px}th{background:#0050cc;color:#fff}.kpi{display:inline-block;padding:12px 20px;margin:8px;border:1px solid #ddd;border-radius:8px;text-align:center}</style></head><body><h1>${file.title || 'Báo cáo'}</h1><p>${file.subtitle || ''}</p><h2>KPI Tổng quan</h2>${(file.kpis || []).map(k => `<div class="kpi"><div style="font-size:12px;color:#666">${k.label}</div><div style="font-size:22px;font-weight:bold">${k.value}</div><div style="font-size:11px;color:${k.ok ? 'green' : 'orange'}">${k.trend}</div></div>`).join('')}<p style="color:#888;font-size:11px;margin-top:40px">Xuất từ Hadiwa IOC · ${new Date().toLocaleDateString('vi-VN')}</p></body></html>`;
      blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
      ext = '.html';
    } else if (file.type === 'word') {
      // Word document preview
      preview = `<div style="background:linear-gradient(135deg,#071d3a,#0d2f5f);border-radius:8px;padding:14px;margin-bottom:10px;border:1px solid rgba(33,150,243,.25)">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <div style="width:36px;height:46px;background:#2196f3;border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative">
            <span style="font-size:10px;font-weight:900;color:#fff">W</span>
            <div style="position:absolute;bottom:-4px;right:-4px;width:14px;height:14px;background:#1565c0;border-radius:2px;display:flex;align-items:center;justify-content:center">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>
          <div>
            <div style="font-size:11px;font-weight:700;color:var(--text)">${file.name}</div>
            <div style="font-size:10px;color:var(--muted);margin-top:2px">${file.pages} trang · ${file.size}</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px">
          ${(file.sections || []).map((s, i) => `<div style="display:flex;align-items:center;gap:8px;padding:5px 8px;background:rgba(33,150,243,.08);border-radius:4px;font-size:10px;color:rgba(255,255,255,.7)">
            <span style="font-size:9px;font-weight:700;color:#2196f3;min-width:14px">${i + 1}.</span>${s}
          </div>`).join('')}
        </div>
      </div>`;
    } else if (file.type === 'heatmap') {
      // Heat map SVG preview
      const riskColor = { high: '#ff3d57', medium: '#ff9500', low: '#00e676' };
      const riskLabel = { high: 'Cao', medium: 'TB', low: 'Thấp' };
      preview = `<div style="background:#030e1c;border-radius:8px;padding:8px;margin-bottom:10px;border:1px solid rgba(255,87,34,.2)">
        <div style="font-size:10px;color:var(--muted);margin-bottom:6px;display:flex;align-items:center;gap:6px">
          Bản đồ nhiệt nguy cơ ngập lụt
          <span style="display:flex;gap:4px;margin-left:auto">
            <span style="height:8px;width:16px;border-radius:2px;background:#ff3d57;display:inline-block"></span><span style="font-size:9px">Cao</span>
            <span style="height:8px;width:16px;border-radius:2px;background:#ff9500;display:inline-block;margin-left:4px"></span><span style="font-size:9px">TB</span>
            <span style="height:8px;width:16px;border-radius:2px;background:#00e676;display:inline-block;margin-left:4px"></span><span style="font-size:9px">Thấp</span>
          </span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px">
          ${(file.zones || []).map(z => `<div style="border-radius:6px;padding:5px 8px;background:${riskColor[z.risk]}18;border:1px solid ${riskColor[z.risk]}40;text-align:center">
            <div style="font-size:9px;font-weight:700;color:${riskColor[z.risk]}">${riskLabel[z.risk]}</div>
            <div style="font-size:10px;color:rgba(255,255,255,.7);margin-top:1px">${z.label}</div>
          </div>`).join('')}
        </div>
      </div>`;
    } else {
      // For chart/image: generate an SVG placeholder
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="#030e1c"/><text x="400" y="240" text-anchor="middle" font-size="24" font-family="Arial" fill="#00c8ff">${file.name}</text><text x="400" y="280" text-anchor="middle" font-size="14" fill="#546e7a">Hadiwa IOC · ${new Date().toLocaleDateString('vi-VN')}</text></svg>`;
      blob = new Blob([svg], { type: 'image/svg+xml' });
      ext = '.svg';
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = file.name.replace(/\.(xlsx|pdf|png|jpg)$/, ext);
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    showToast(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Đã tải về: ${file.name}`);
  } catch (e) { showToast('Lỗi tạo file. Vui lòng thử lại.'); }
}

// ── OUTPUT FORMAT DEFINITIONS ───────────────────────────────────
// Each format has: id, label, icon, color, keyword injected into chat input
const OUTPUT_FORMATS = [
  {
    id: 'image',
    label: 'Ảnh',
    color: '#7c4dff',
    icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    text: 'Xuất ảnh hiện trường hoặc bản đồ',
  },
  {
    id: 'chart',
    label: 'Biểu đồ',
    color: '#ffca28',
    icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    text: 'Xuất biểu đồ sản lượng',
  },
  {
    id: 'excel',
    label: 'Excel',
    color: '#00e676',
    icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>',
    text: 'Xuất danh sách thiết bị excel',
  },
  {
    id: 'pdf',
    label: 'PDF',
    color: '#ff5252',
    icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    text: 'Xuất báo cáo tháng dạng PDF',
  },
  {
    id: 'word',
    label: 'Word',
    color: '#2196f3',
    icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>',
    text: 'Xuất công văn kế hoạch word',
  },
  {
    id: 'table',
    label: 'Bảng',
    color: '#00c8ff',
    icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="2" y1="15" x2="22" y2="15"/><line x1="8" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="16" y2="21"/></svg>',
    text: 'bảng so sánh hồ chứa tình trạng hiện tại',
  },
  {
    id: 'heatmap',
    label: 'Bản đồ nhiệt',
    color: '#ff5722',
    icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>',
    text: 'Xuất bản đồ nhiệt vùng ngập',
  },
];

/** Render format chips with active state tracking */
function _renderFormatChips(barId, sendFn, activeId) {
  const bar = document.getElementById(barId);
  if (!bar) return;
  bar.innerHTML = `<span style="font-size:10px;font-weight:700;color:var(--muted);letter-spacing:.06em;white-space:nowrap;flex-shrink:0">Trả lời dạng:</span>` +
    OUTPUT_FORMATS.map(f => {
      const isActive = f.id === activeId;
      return `<button
        onclick="${sendFn}('${f.id}','${f.text}')"
        title="${f.label}"
        style="
          display:inline-flex;align-items:center;gap:4px;padding:4px 9px;
          border-radius:20px;border:1px solid ${isActive ? f.color : f.color + '40'};
          background:${isActive ? f.color + '22' : 'transparent'};
          color:${isActive ? f.color : 'rgba(255,255,255,.45)'};
          font-size:11px;font-weight:${isActive ? 700 : 500};cursor:pointer;
          white-space:nowrap;transition:all .2s;
          font-family:'Inter',sans-serif;
        "
        onmouseover="this.style.borderColor='${f.color}';this.style.color='${f.color}';this.style.background='${f.color}18'"
        onmouseout="this.style.borderColor='${isActive ? f.color : f.color + '40'}';this.style.color='${isActive ? f.color : 'rgba(255,255,255,.45)'}';this.style.background='${isActive ? f.color + '22' : 'transparent'}'">
        ${f.icon}&nbsp;${f.label}
      </button>`;
    }).join('');
}

/** Apply an output format from main chat bar */
window.cbApplyOutputFormat = function(formatId, sampleText) {
  const input = document.getElementById('chatInput');
  if (!input) return;
  _renderFormatChips('chatFormatBar', 'cbApplyOutputFormat', formatId);
  input.value = sampleText;
  input.focus();
};

/** Apply an output format from sticky chat bar */
window.cbApplyStickyOutputFormat = function(formatId, sampleText) {
  const input = document.getElementById('stickyChatInput');
  if (!input) return;
  _renderFormatChips('qwcFormatBar', 'cbApplyStickyOutputFormat', formatId);
  input.value = sampleText;
  input.focus();
};

// ── Context-aware suggestions ────────────────────────────────────
// Mapping: topic keyword → follow-up chips relevant to that topic
const CONTEXT_SUGGESTIONS = {
  'thảm lậu': [
    'Vật liệu nào dùng ép mạch sủi hiệu quả?',
    'Khi nào cần thông báo sơ tán dân cư?',
    'Báo cáo sự cố thảm lậu lên cấp trên thế nào?',
    'Phân biệt mạch sủi và mạch rế?',
  ],
  'mực nước': [
    'Báo động lũ sông Hồng tại Hà Nội là bao nhiêu?',
    'Trạm nào đang có mực nước cao nhất hiện nay?',
    'Mực nước sông Đáy tại Ba Thá hiện tại?',
    'Dự báo mưa 24h tới?',
  ],
  'hồ tuy lai': [
    'Hồ Tuy Lai bắt đầu xả lũ từ khi nào?',
    'Lưu lượng xả hiện tại là bao nhiêu?',
    'Hạ lưu hồ Tuy Lai có nguy cơ ngập không?',
    'Quy trình vận hành tràn xả lũ?',
  ],
  'suối hai': [
    'Hồ Suối Hai có đầy có cần xả tưới không?',
    'Tình trạng đập chính hồ Suối Hai hiện tại?',
    'Cần mở mấy khoang cống khi xả tưới?',
    'Lưu vực hồ Suối Hai thuộc huyện nào?',
  ],
  'đê hữu đáy': [
    'Ai đang phụ trách ứng cứu tại K18+500?',
    'Độ sâu của mạch rế hiện tại?',
    'Phương pháp ép mạch sủi phù hợp nhất?',
    'Dự kiến hoàn thành xử lý khi nào?',
  ],
  'thiết bị': [
    'Lịch bảo dưỡng máy bơm tại Trạm Bơm Phú Diễn?',
    'Cảm biến IoT tuyến đê cần bảo dưỡng loại gì?',
    'Quy trình kiểm tra thiết bị trước mùa lũ?',
    'Ai phụ trách bảo dưỡng thiết bị tháng 3?',
  ],
  'cảnh báo': [
    'Khu dân cư nào cần sơ tán nếu đê vỡ?',
    'Quy trình phát lệnh sơ tán khẩn cấp?',
    'Liên lạc với BCH PCTT TP. Hà Nội nư thế nào?',
    'Loại cảnh báo nào đang mức nghiêm trọng nhất?',
  ],
  'nhân lực': [
    'Số điện thoại Đội ƯCSC số 3?',
    'Ai được phân công trực đêm nay?',
    'Bổ sung nhân lực ứng cứu tại đê Hữu Đáy thế nào?',
    'Kho vật tư còn bao nhiêu bao tải cát?',
  ],
  'báo cáo': [
    'Tổng hợp sự cố tuần này?',
    'Báo cáo thiệt hại do mưa lũ tháng 3?',
    'TK báo cáo lên Sở NN&PTNT?',
    'Xuất danh sách sự cố đang mở?',
  ],
  'mặc định': [
    'Mực nước sông Hồng tại Hà Nội hiện tại?',
    'Hồ Tuy Lai đang ở mức cảnh báo nào?',
    'Đê Hữu Đáy K18+500 đang có sự cố gì?',
    'Lực lượng ứng trực hiện tại?',
    'Thiết bị nào sắp đến hạn bảo dưỡng?',
  ],
};

// Role-based baseline suggestions (always pinned ở cuối)
const ROLE_SUGGESTIONS = {
  admin: ['Tổng hợp sự cố tuần điều này?', 'Báo cáo KPI đê điều tháng 3?', 'Nhân viên nào ON-CALL đêm nay?'],
  dispatcher: ['Sự cố nào chưa phân công xử lý?', 'Ai đang xử lý SC-003?', 'Lệnh công tác đang mở?'],
  operator: ['Quy trình vận hành cống xả lũ?', 'Cách đọc thiết bị đo mực nước?', 'Ngưỡng cảnh báo mực nước sông Hồng?'],
  viewer: ['Báo cáo vận hành tháng 3?', 'Tình trạng đê điều đạt chuẩn không?', 'Hồ chứa nào đang cảnh báo?'],
};



function updateSuggestions(lastText) {
  const el = document.getElementById('chatSuggestions');
  if (!el) return;
  el.style.display = '';
  const txt = (lastText || '').toLowerCase();

  // Pick context chips
  let contextChips = CONTEXT_SUGGESTIONS['mặc định'];
  for (const [key, chips] of Object.entries(CONTEXT_SUGGESTIONS)) {
    if (key !== 'mặc định' && txt.includes(key)) { contextChips = chips; break; }
  }

  // Pick role chips
  const role = (typeof DATA !== 'undefined' && DATA.employees?.[0]?.role) || 'admin';
  const roleChips = ROLE_SUGGESTIONS[role] || ROLE_SUGGESTIONS.admin;

  // Combine: up to 4 context + up to 2 role, remove duplicates
  const combined = [...new Set([...contextChips.slice(0, 4), ...roleChips.slice(0, 2)])];

  el.innerHTML = combined.map(q => `<span class="chip" onclick="sendChip(this)">${q}</span>`).join('');

  // Also populate the format bar (no active format by default)
  _renderFormatChips('chatFormatBar', 'cbApplyOutputFormat', null);
}


// ── Send + receive ───────────────────────────────────────────────
function sendChat(voiceMsg) {
  const input = document.getElementById('chatInput');
  const q = voiceMsg || input.value.trim();
  if (!q && !mainAttachedFile) return;

  if (!voiceMsg) input.value = '';

  let fileId = null;
  if (mainAttachedFile) {
    fileId = 'f_main_' + Date.now();
    const isImg = mainAttachedFile.type.startsWith('image/');
    _fileRegistry[fileId] = {
      type: isImg ? 'image' : 'report',
      name: mainAttachedFile.name,
      size: (mainAttachedFile.size / 1024).toFixed(1) + ' KB',
      location: 'Tải lên từ thiết bị',
      timestamp: new Date().toLocaleTimeString('vi-VN')
    };
  }

  addMsg({ role: 'user', text: q || '', audioSrc: voiceMsg ? 'voice_' + Date.now() : null, fileId });
  mainAttachedFile = null;
  clearMainFile();

  // Typing indicator
  const typingId = 'typing_' + Date.now();
  const container = document.getElementById('chatMessages');
  container.insertAdjacentHTML('beforeend', `
    <div id="${typingId}" class="chat-msg">
      <div class="chat-avatar ai">${AI_AVATAR_SVG}</div>
      <div class="chat-bubble ai" style="padding:14px 16px">
        <div style="display:flex;gap:5px;align-items:center">
          <div class="typing-dot" style="animation-delay:0s"></div>
          <div class="typing-dot" style="animation-delay:.2s"></div>
          <div class="typing-dot" style="animation-delay:.4s"></div>
          <span style="font-size:11px;color:var(--muted);margin-left:4px">Đang phân tích...</span>
        </div>
      </div>
    </div>`);
  container.scrollTop = container.scrollHeight;

  setTimeout(() => {
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();
    const ql = q.toLowerCase();

    // 1. Check file attachment triggers first
    let fileMatch = null;
    for (const fr of FILE_RESPONSES) {
      if (fr.keywords.some(kw => ql.includes(kw))) { fileMatch = fr; break; }
    }

    if (fileMatch) {
      const fileId = 'f_' + Date.now();
      _fileRegistry[fileId] = fileMatch.file;
      addMsg({ role: 'ai', text: fileMatch.text, fileId });
      updateSuggestions(fileMatch.text + ' ' + ql);
      if (document.getElementById('ttsState')?.textContent === 'Bật') {
        setTimeout(() => speakText(null, encodeURIComponent(fileMatch.text)), 400);
      }
      return;
    }

    // 2. Regular text responses
    let resp = 'Tôi đang phân tích dữ liệu hệ thống. Câu hỏi của bạn chưa có trong cơ sở tri thức hiện tại. Vui lòng thử các câu hỏi gợi ý hoặc liên hệ quản trị viên.';
    for (const [k, v] of Object.entries(AI_RESPONSES)) {
      if (ql.includes(k)) { resp = v; break; }
    }
    addMsg({ role: 'ai', text: resp });
    // Update contextual suggestions based on AI response + user question
    updateSuggestions(resp + ' ' + ql);
    // Auto TTS if enabled
    if (document.getElementById('ttsState')?.textContent === 'Bật') {
      setTimeout(() => speakText(null, encodeURIComponent(resp)), 400);
    }
  }, 900 + Math.random() * 600);
}


function sendChip(el) {
  document.getElementById('chatInput').value = el.textContent;
  sendChat();
}

function addMsg(m) {
  chatHistory.push(m);
  const container = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.innerHTML = renderMsg(m);
  container.appendChild(div.firstElementChild);
  container.scrollTop = container.scrollHeight;
}

function clearChat() {
  chatHistory.length = 0;
  chatHistory.push({ role: 'ai', text: 'Lịch sử đã được xóa. Bạn cần tôi giúp gì?' });
  document.getElementById('chatMessages').innerHTML = chatHistory.map(renderMsg).join('');
  updateSuggestions('');
}

let mainAttachedFile = null;

function handleMainFileAttach(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  mainAttachedFile = file;
  const preview = document.getElementById('mainFilePreview');
  const content = document.getElementById('mainFilePreviewContent');
  if (!preview || !content) return;

  preview.style.display = 'block';
  if (file.type.startsWith('image/')) {
    const url = URL.createObjectURL(file);
    content.innerHTML = `<img src="${url}" style="width:36px;height:36px;object-fit:cover;border-radius:6px;border:1px solid rgba(0,200,255,.3)"><div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${file.name}</div><div style="font-size:10px;color:var(--muted)">${(file.size / 1024).toFixed(1)} KB</div></div>`;
  } else {
    content.innerHTML = `<div style="width:36px;height:36px;background:rgba(0,200,255,.1);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:16px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${file.name}</div><div style="font-size:10px;color:var(--muted)">${(file.size / 1024).toFixed(1)} KB</div></div>`;
  }
}

function clearMainFile() {
  mainAttachedFile = null;
  const input = document.getElementById('mainChatAttach');
  if (input) input.value = '';
  const preview = document.getElementById('mainFilePreview');
  if (preview) preview.style.display = 'none';
}

// ── VOICE INPUT (STT) ────────────────────────────────────────────
const STT_PHRASES = [
  'Mực nước sông Hồng tại Hà Nội hiện tại?',
  'Hồ Tuy Lai đang ở mức cảnh báo nào?',
  'Cho tôi biết tình trạng đê Hữu Đáy K18+500',
  'Lực lượng ứng trực hiện có bao nhiêu người?',
  'Thiết bị nào sắp đến hạn bảo dưỡng?',
  'Quy trình xử lý khi phát hiện thảm lậu đê?',
];

function toggleVoice() {
  if (cbVoiceRecording) { stopVoice(); return; }
  startVoice();
}

function startVoice() {
  cbVoiceRecording = true;
  const micBtn = document.getElementById('micBtn');
  const voiceBar = document.getElementById('voiceBar');
  if (micBtn) { micBtn.style.background = 'rgba(255,23,68,.2)'; micBtn.style.borderColor = 'var(--red)'; micBtn.style.color = 'var(--red)'; }
  if (voiceBar) voiceBar.style.display = 'flex';

  // Try real browser STT first
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const sr = new SR();
    sr.lang = 'vi-VN';
    sr.interimResults = false;
    sr.maxAlternatives = 1;
    sr.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      stopVoice();
      sendVoiceMessage(transcript);
    };
    sr.onerror = () => { stopVoice(); simulateSTT(); };
    sr.onend = () => { if (cbVoiceRecording) stopVoice(); };
    sr.start();
    cbVoiceStream = sr;
  } else {
    // Simulate STT after 2.5s
    cbVoiceStream = setTimeout(() => { stopVoice(); simulateSTT(); }, 2500);
  }
}

function simulateSTT() {
  const phrase = STT_PHRASES[Math.floor(Math.random() * STT_PHRASES.length)];
  sendVoiceMessage(phrase);
}

function stopVoice() {
  cbVoiceRecording = false;
  if (cbVoiceStream && typeof cbVoiceStream.stop === 'function') cbVoiceStream.stop();
  else clearTimeout(cbVoiceStream);
  cbVoiceStream = null;
  const micBtn = document.getElementById('micBtn');
  const voiceBar = document.getElementById('voiceBar');
  if (micBtn) { micBtn.style.background = ''; micBtn.style.borderColor = ''; micBtn.style.color = ''; }
  if (voiceBar) voiceBar.style.display = 'none';
}

function sendVoiceMessage(text) {
  // Generate a mock audio blob URL using Web Audio API
  const audioSrc = generateMockAudio(text.length);
  addMsg({ role: 'user', text, audioSrc });

  // Typing indicator + AI response
  const container = document.getElementById('chatMessages');
  const typingId = 'typing_' + Date.now();
  container.insertAdjacentHTML('beforeend', `
    <div id="${typingId}" class="chat-msg">
      <div class="chat-avatar ai">${AI_AVATAR_SVG}</div>
      <div class="chat-bubble ai" style="padding:14px 16px">
        <div style="display:flex;gap:5px;align-items:center">
          <div class="typing-dot"></div><div class="typing-dot" style="animation-delay:.2s"></div><div class="typing-dot" style="animation-delay:.4s"></div>
          <span style="font-size:11px;color:var(--muted);margin-left:4px">Đang xử lý giọng nói...</span>
        </div>
      </div>
    </div>`);
  container.scrollTop = container.scrollHeight;

  setTimeout(() => {
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();
    const ql = text.toLowerCase();
    let resp = 'Tôi đã nhận được yêu cầu bằng giọng nói của bạn. Câu hỏi chưa có trong cơ sở tri thức. Vui lòng thử lại.';
    for (const [k, v] of Object.entries(AI_RESPONSES)) {
      if (ql.includes(k)) { resp = v; break; }
    }
    addMsg({ role: 'ai', text: resp });
    updateSuggestions(resp + ' ' + ql);
    if (document.getElementById('ttsState')?.textContent === 'Bật') {
      setTimeout(() => speakText(null, encodeURIComponent(resp)), 400);
    }
  }, 1000);
}

// ── TTS (Text-to-Speech) ─────────────────────────────────────────
let ttsEnabled = false;

function toggleTts(el) {
  ttsEnabled = !ttsEnabled;
  const state = document.getElementById('ttsState');
  if (state) state.textContent = ttsEnabled ? 'Bật' : 'Tắt';
  el.style.borderColor = ttsEnabled ? 'rgba(0,200,255,.4)' : 'rgba(0,200,255,.18)';
  el.style.color = ttsEnabled ? 'var(--cyan)' : 'var(--muted)';
  showToast(ttsEnabled ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg> TTS đã bật — AI sẽ đọc to phản hồi' : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg> TTS đã tắt');
}

function speakText(btn, encodedText) {
  if (!encodedText) return;
  const clean = decodeURIComponent(encodedText);

  // If already speaking, stop and reset the active button
  if (cbSpeaking && cbSpeechSynth) {
    cbSpeechSynth.cancel();
    cbSpeaking = false;
    _resetTtsBtn(window._ttsActiveBtn);
    window._ttsActiveBtn = null;
    // If toggled from same button, stop here
    if (btn && btn === window._ttsLastBtn) { window._ttsLastBtn = null; return; }
  }
  window._ttsLastBtn = btn;

  // If no explicit btn, auto-find the last TTS button in whichever chat is visible
  const resolvedBtn = btn || (() => {
    // Try main chatbot page first, then sticky
    const allBtns = [...document.querySelectorAll('.tts-speak-btn')];
    return allBtns[allBtns.length - 1] || null;
  })();

  // Mark new active button as playing (pause icon)
  if (resolvedBtn) {
    resolvedBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Dừng`;
    resolvedBtn.style.borderColor = 'rgba(255,23,68,.4)';
    resolvedBtn.style.color = 'var(--red)';
  }
  window._ttsActiveBtn = resolvedBtn;

  const utt = new SpeechSynthesisUtterance(clean);
  utt.lang = 'vi-VN';
  utt.rate = 1.0;
  utt.pitch = 1.0;

  // Pick a Vietnamese voice if available
  const voices = cbSpeechSynth.getVoices();
  const viVoice = voices.find(v => v.lang.startsWith('vi'));
  if (viVoice) utt.voice = viVoice;

  utt.onend = () => {
    cbSpeaking = false;
    _resetTtsBtn(window._ttsActiveBtn);
    window._ttsActiveBtn = null;
  };
  utt.onerror = () => {
    cbSpeaking = false;
    _resetTtsBtn(window._ttsActiveBtn);
    window._ttsActiveBtn = null;
  };
  cbSpeaking = true;
  cbSpeechSynth.speak(utt);
}

function _resetTtsBtn(btn) {
  if (!btn) return;
  btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg> Đọc to`;
  btn.style.borderColor = 'rgba(0,200,255,.15)';
  btn.style.color = 'var(--muted)';
}

// ── Mock audio blob (Web Audio API) ─────────────────────────────
function generateMockAudio(textLen) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return 'mock_audio';
    const ctx = new AudioCtx();
    const duration = Math.max(1.5, Math.min(textLen * 0.06, 8));
    const sampleRate = ctx.sampleRate;
    const buf = ctx.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buf.getChannelData(0);
    // Simulate voice waveform (speech-like noise pattern)
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.sin(Math.PI * t / duration);
      data[i] = envelope * (Math.sin(2 * Math.PI * 200 * t) * 0.3 + (Math.random() - 0.5) * 0.15 + Math.sin(2 * Math.PI * 400 * t + Math.sin(t * 3)) * 0.2);
    }
    // Encode to WAV and create object URL
    const wavBlob = audioBufferToWav(buf);
    return URL.createObjectURL(wavBlob);
  } catch (e) { return 'mock_audio'; }
}

function audioBufferToWav(buffer) {
  const numCh = buffer.numberOfChannels, sampleRate = buffer.sampleRate;
  const data = buffer.getChannelData(0);
  const pcm = new Int16Array(data.length);
  for (let i = 0; i < data.length; i++) pcm[i] = Math.max(-32768, Math.min(32767, Math.round(data[i] * 32768)));
  const wavBuf = new ArrayBuffer(44 + pcm.byteLength);
  const view = new DataView(wavBuf);
  const write = (o, s) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
  write(0, 'RIFF'); view.setUint32(4, 36 + pcm.byteLength, true);
  write(8, 'WAVE'); write(12, 'fmt '); view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); view.setUint16(22, numCh, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * numCh * 2, true);
  view.setUint16(32, numCh * 2, true); view.setUint16(34, 16, true);
  write(36, 'data'); view.setUint32(40, pcm.byteLength, true);
  new Int16Array(wavBuf, 44).set(pcm);
  return new Blob([wavBuf], { type: 'audio/wav' });
}

// ── Audio player click ───────────────────────────────────────────
let currentAudio = null;
function playAudio(src, btn) {
  if (src === 'mock_audio' || !src) { showToast('Đang phát audio giọng nói...'); return; }
  if (currentAudio && !currentAudio.paused) { currentAudio.pause(); currentAudio = null; return; }
  const audio = new Audio(src);
  currentAudio = audio;
  const progressBar = btn.parentElement.querySelector('.audio-progress-bar');
  audio.ontimeupdate = () => { if (progressBar) progressBar.style.width = (audio.currentTime / audio.duration * 100) + '%'; };
  audio.onended = () => { if (progressBar) progressBar.style.width = '0%'; };
  audio.play().catch(() => showToast('Đang phát audio giọng nói...'));
}

// ── afterRender hook — called by app.js after chatbot page DOM is ready ─
// Populates the format bar chips and warms up suggestion chips on load
window.afterRender_chatbot = function () {
  // Populate the output format bar (populated by _renderFormatChips which
  // needs the DOM element to exist first)
  if (typeof _renderFormatChips === 'function') {
    _renderFormatChips('chatFormatBar', 'cbApplyOutputFormat', null);
  }
  // Populate suggestion chips with default PCTT suggestions
  if (typeof updateSuggestions === 'function') {
    updateSuggestions('');
  }
};

// ── Chat History Management ───────────────────────────────────────
const PAST_CHATS = [
  { id: 'ch_pctt01', title: 'Sự cố mạch sủi Đê Hữu Đáy K18+500', date: '12/03/2026 11:45', count: 7,
    preview: [
      { role: 'user', text: 'Đê Hữu Đáy K18+500 đang có sự cố gì?' },
      { role: 'ai',   text: AI_RESPONSES['đê hữu đáy'] },
      { role: 'user', text: 'Phương pháp ập mạch sủi phù hợp nhất?' },
      { role: 'ai',   text: 'Sử dụng bảo tải cát nén ngang kết hợp cọc trụ nhìm. Tiếp tục giám sát mực nước sông Đáy...' },
      { role: 'user', text: 'Đội ƯCSC số 3 đã triển khai chưa?' },
      { role: 'ai',   text: 'Đội ƯCSC số 3 gồm 8 người đã có mặt tại hiện trường lúc 12:00. Xe tải đã chở 500 bao tải cát.' }
    ]
  },
  { id: 'ch_pctt02', title: 'Hồ Tuy Lai — Cảnh báo xả lũ khoang 2', date: '11/03/2026 09:30', count: 5,
    preview: [
      { role: 'user', text: 'Hồ Tuy Lai đang ở mức cảnh báo nào?' },
      { role: 'ai',   text: AI_RESPONSES['hồ tuy lai'] },
      { role: 'user', text: 'Quy trình vận hành tràn xả lũ?' },
      { role: 'ai',   text: 'Mở khoang xả theo QT-HChua-001: mở từng khoang cách 30 phút, kiểm tra hạ lưu trước mỗi lần...' }
    ]
  },
  { id: 'ch_pctt03', title: 'Xuất báo cáo thiệt hại PCTT tháng 2/2026', date: '01/03/2026 08:00', count: 8,
    preview: [
      { role: 'user', text: 'Xuất báo cáo vận hành tháng 2/2026' },
      { role: 'ai',   text: 'Tôi đã tạo **Báo cáo vận hành tháng 2/2026** dạng PDF. File bao gồm tóm tắt KPI, sản lượng, chất lượng nước và NRW.' }
    ]
  },
  { id: 'ch_pctt04', title: 'Mực nước các trạm thủy văn và dự báo lũ', date: '10/03/2026 07:00', count: 6,
    preview: [
      { role: 'user', text: 'Mực nước sông Hồng tại Hà Nội hiện tại?' },
      { role: 'ai',   text: AI_RESPONSES['mực nước'] },
      { role: 'user', text: 'Dự báo mưa 24h tới?' },
      { role: 'ai',   text: 'Dự báo mưa 25–50mm từ 06:00 ngày mai, tập trung khu vực hỏ Tây của thành phố. Đề nghị giám sát hồ Suối Hai và hồ Đồng Mô.' }
    ]
  },
];

function openChatHistoryModal() {
  const now = new Date();
  openModal(`
  <div class="modal-header">
    <span class="modal-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>Lịch sử trò chuyện AI</span>
    <button class="modal-close" onclick="closeModal()">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
  <div class="modal-body" style="padding:16px 20px;max-height:65vh;overflow-y:auto">
    <!-- Search bar -->
    <div style="position:relative;margin-bottom:14px">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--muted)"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input id="chatSearchInput" placeholder="Tìm kiếm cuộc trò chuyện..." oninput="_filterChatHistory(this.value)"
        style="width:100%;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:8px;color:#fff;font-size:13px;padding:8px 10px 8px 32px;outline:none;font-family:'Inter',sans-serif">
    </div>
    <!-- Sessions -->
    <div id="chatHistoryList" style="display:flex;flex-direction:column;gap:10px">
      ${PAST_CHATS.map(c => `
      <div class="_chatHistoryItem" data-title="${c.title.toLowerCase()}" style="background:rgba(0,0,0,.15);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:14px;display:flex;justify-content:space-between;align-items:center;transition:background .15s" onmouseover="this.style.background='rgba(0,200,255,.05)'" onmouseout="this.style.background='rgba(0,0,0,.15)'">
        <div style="display:flex;align-items:center;gap:10px;min-width:0">
          <div style="width:36px;height:36px;border-radius:8px;background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </div>
          <div style="min-width:0">
            <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px">${c.title}</div>
            <div style="font-size:10px;color:var(--muted)">${c.date} &middot; ${c.count} tin nhắn</div>
          </div>
        </div>
        <div style="display:flex;gap:6px;flex-shrink:0;margin-left:10px">
          <button class="btn btn-ghost btn-xs" title="Sao chép link chia sẻ" onclick="shareChat('${c.id}')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Chia sẻ
          </button>
          <button class="btn btn-primary btn-xs" onclick="loadPastChat('${c.id}')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
            Xem lại
          </button>
          <button class="btn btn-ghost btn-xs" style="color:rgba(255,70,70,.7)" title="Xóa phiên" onclick="_deletePastChat('${c.id}',this)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
          </button>
        </div>
      </div>`).join('')}
    </div>
    <div style="text-align:center;margin-top:16px;font-size:11px;color:var(--muted)">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      Lịch sử lưu trên trình duyệt này trong 30 ngày. Dữ liệu có thể mất nếu xóa cache.
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-outline" onclick="_clearAllHistory()" style="color:rgba(255,70,70,.8);border-color:rgba(255,70,70,.3)">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
      Xóa tất cả
    </button>
  </div>`);
}

window._filterChatHistory = function(q) {
  const items = document.querySelectorAll('._chatHistoryItem');
  items.forEach(el => {
    const title = el.dataset.title || '';
    el.style.display = title.includes(q.toLowerCase()) ? '' : 'none';
  });
};

window._deletePastChat = function(id, btn) {
  const idx = PAST_CHATS.findIndex(c => c.id === id);
  if (idx !== -1) PAST_CHATS.splice(idx, 1);
  btn.closest('._chatHistoryItem').remove();
  showToast('Đã xóa phiên trò chuyện.');
};

window._clearAllHistory = function() {
  PAST_CHATS.length = 0;
  closeModal();
  showToast('<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Đã xóa toàn bộ lịch sử trò chuyện.');
};

function shareChat(chatId) {
  const shareLink = `https://hadiwa.ioc.hanoi.gov.vn/shared/chat?session=${chatId}&ts=${Date.now()}`;
  navigator.clipboard.writeText(shareLink).then(() => {
    showToast(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> Đã sao chép link chia sẻ phiên chat!`);
  }).catch(() => {
    prompt('Sao chép link chia sẻ:', shareLink);
  });
}

function loadPastChat(chatId) {
  closeModal();
  chatHistory.length = 0;
  const chatObj = PAST_CHATS.find(c => c.id === chatId);
  if (!chatObj) return;

  chatHistory.push({ role: 'ai', text: `Đã khôi phục phiên chat: **${chatObj.title}** (${chatObj.date}).` });

  // Restore preview messages if available in data object
  if (chatObj.preview && Array.isArray(chatObj.preview)) {
    chatObj.preview.forEach(m => chatHistory.push(m));
  } else {
    chatHistory.push({ role: 'user', text: 'Dữ liệu phiên này không còn trong bộ nhớ cache.' });
    chatHistory.push({ role: 'ai',  text: 'Phiên trò chuyện này đã quá hạn lưu trữ cục bộ. Vui lòng liên hệ quản trị viên để khôi phục từ server.' });
  }

  document.getElementById('chatMessages').innerHTML = chatHistory.map(renderMsg).join('');
  updateSuggestions('');
}

// ── STICKY CHATBOT LOGIC ─────────────────────────────────────────
let stickyAttachedFile = null;

function handleStickyFileAttach(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  stickyAttachedFile = file;
  const preview = document.getElementById('stickyFilePreview');
  const content = document.getElementById('stickyFilePreviewContent');
  if (!preview || !content) return;

  // Show preview
  preview.style.display = 'block';
  if (file.type.startsWith('image/')) {
    const url = URL.createObjectURL(file);
    content.innerHTML = `<img src="${url}" style="width:36px;height:36px;object-fit:cover;border-radius:6px;border:1px solid rgba(0,200,255,.3)"><div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${file.name}</div><div style="font-size:10px;color:var(--muted)">${(file.size / 1024).toFixed(1)} KB</div></div>`;
  } else {
    content.innerHTML = `<div style="width:36px;height:36px;background:rgba(0,200,255,.1);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:16px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${file.name}</div><div style="font-size:10px;color:var(--muted)">${(file.size / 1024).toFixed(1)} KB</div></div>`;
  }
}

function clearStickyFile() {
  stickyAttachedFile = null;
  const input = document.getElementById('qwcChatAttach');
  if (input) input.value = '';
  const preview = document.getElementById('stickyFilePreview');
  if (preview) preview.style.display = 'none';
}

function pushStickyMsg(m) {
  const container = document.getElementById('stickyChatMessages');
  if (!container) return;
  container.insertAdjacentHTML('beforeend', renderMsg(m));
  container.scrollTop = container.scrollHeight;
}

function sendStickyChat() {
  const input = document.getElementById('stickyChatInput');
  const q = input.value.trim();
  if (!q && !stickyAttachedFile) return;

  input.value = '';
  let fileId = null;
  if (stickyAttachedFile) {
    fileId = 'f_up_' + Date.now();
    const isImg = stickyAttachedFile.type.startsWith('image/');
    _fileRegistry[fileId] = {
      type: isImg ? 'image' : 'report',
      name: stickyAttachedFile.name,
      size: (stickyAttachedFile.size / 1024).toFixed(1) + ' KB',
      location: 'Tải lên từ thiết bị',
      timestamp: new Date().toLocaleTimeString('vi-VN')
    };
  }

  pushStickyMsg({ role: 'user', text: q || '', fileId });
  clearStickyFile();

  // Typing indicator
  const typingId = 'sticky_typing_' + Date.now();
  const container = document.getElementById('stickyChatMessages');
  container.insertAdjacentHTML('beforeend', `
    <div id="${typingId}" class="chat-msg">
      <div class="chat-avatar ai">${AI_AVATAR_SVG}</div>
      <div class="chat-bubble ai" style="padding:14px 16px">
        <div style="display:flex;gap:5px;align-items:center">
          <div class="typing-dot" style="animation-delay:0s"></div>
          <div class="typing-dot" style="animation-delay:.2s"></div>
          <div class="typing-dot" style="animation-delay:.4s"></div>
          <span style="font-size:11px;color:var(--muted);margin-left:4px">Đang phân tích...</span>
        </div>
      </div>
    </div>`);
  container.scrollTop = container.scrollHeight;

  setTimeout(() => {
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();
    const ql = q.toLowerCase();

    let fileMatch = null;
    for (const fr of FILE_RESPONSES) {
      if (fr.keywords.some(kw => ql.includes(kw))) { fileMatch = fr; break; }
    }

    if (fileMatch) {
      const pFileId = 'f_' + Date.now();
      _fileRegistry[pFileId] = fileMatch.file;
      pushStickyMsg({ role: 'ai', text: fileMatch.text, fileId: pFileId });
      return;
    }

    let resp = 'Tôi đã nhận được thông tin. Thiết lập công cụ và chỉ tiêu của bạn đã được cập nhật.';
    if (q) {
      resp = 'Tôi đang phân tích dữ liệu hệ thống. Câu hỏi của bạn chưa có trong cơ sở tri thức hiện tại.';
      for (const [k, v] of Object.entries(AI_RESPONSES)) {
        if (ql.includes(k)) { resp = v; break; }
      }
    }
    pushStickyMsg({ role: 'ai', text: resp });
    // Update sticky suggestions based on context
    updateStickySuggestions(resp + ' ' + ql);
    // Auto TTS if sticky TTS is on
    if (window._qwcTtsOn) setTimeout(() => speakText(null, encodeURIComponent(resp)), 400);
  }, 900 + Math.random() * 600);
}

// ── STICKY VOICE INPUT (STT) ─────────────────────────────────────────
function toggleStickyVoice() {
  if (cbVoiceRecording) { stopStickyVoice(); return; }
  startStickyVoice();
}

function startStickyVoice() {
  cbVoiceRecording = true;
  const micBtn = document.getElementById('stickyMicBtn');
  if (micBtn) {
    micBtn.style.color = 'var(--red)';
  }
  const voiceBar = document.getElementById('qwcVoiceBar');
  if (voiceBar) voiceBar.style.display = 'flex';

  // Try real browser STT first
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const sr = new SR();
    sr.lang = 'vi-VN';
    sr.interimResults = false;
    sr.maxAlternatives = 1;
    sr.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      stopStickyVoice();
      sendStickyVoiceMsg(transcript);
    };
    sr.onerror = () => { stopStickyVoice(); simulateStickySTT(); };
    sr.onend = () => { if (cbVoiceRecording) stopStickyVoice(); };
    sr.start();
    cbVoiceStream = sr;
  } else {
    // Simulate STT after 2.5s
    cbVoiceStream = setTimeout(() => { stopStickyVoice(); simulateStickySTT(); }, 2500);
  }
}

function stopStickyVoice() {
  cbVoiceRecording = false;
  if (cbVoiceStream && typeof cbVoiceStream.stop === 'function') cbVoiceStream.stop();
  else clearTimeout(cbVoiceStream);
  cbVoiceStream = null;
  const voiceBar = document.getElementById('qwcVoiceBar');
  if (voiceBar) voiceBar.style.display = 'none';
  const micBtn = document.getElementById('stickyMicBtn');
  if (micBtn) micBtn.style.color = 'var(--muted)';
}

function simulateStickySTT() {
  const phrase = STT_PHRASES[Math.floor(Math.random() * STT_PHRASES.length)];
  sendStickyVoiceMsg(phrase);
}

function sendStickyVoiceMsg(text) {
  const audioSrc = generateMockAudio(text.length);
  pushStickyMsg({ role: 'user', text, audioSrc });

  // Typing indicator + AI response
  const container = document.getElementById('stickyChatMessages');
  if (!container) return;
  const typingId = 'sticky_typing_' + Date.now();
  container.insertAdjacentHTML('beforeend', `
  <div id="${typingId}" class="chat-msg">
    <div class="chat-avatar ai">${AI_AVATAR_SVG}</div>
    <div class="chat-bubble ai" style="padding:14px 16px">
      <div style="display:flex;gap:5px;align-items:center">
        <div class="typing-dot"></div><div class="typing-dot" style="animation-delay:.2s"></div><div class="typing-dot" style="animation-delay:.4s"></div>
        <span style="font-size:11px;color:var(--muted);margin-left:4px">Đang xử lý giọng nói...</span>
      </div>
    </div>
  </div>`);
  container.scrollTop = container.scrollHeight;

  setTimeout(() => {
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();
    const ql = text.toLowerCase();
    let resp = 'Tôi đã nhận được yêu cầu bằng giọng nói. Câu hỏi chưa có trong cơ sở tri thức.';
    for (const [k, v] of Object.entries(AI_RESPONSES)) {
      if (ql.includes(k)) { resp = v; break; }
    }
    pushStickyMsg({ role: 'ai', text: resp });
    updateStickySuggestions(resp + ' ' + ql);
    if (window._qwcTtsOn) setTimeout(() => speakText(null, encodeURIComponent(resp)), 400);
  }, 1000);
}

// ── Sticky TTS toggle ────────────────────────────────────────────
window._qwcTtsOn = false;
function toggleStickyTts(btn) {
  window._qwcTtsOn = !window._qwcTtsOn;
  const on = window._qwcTtsOn;
  if (btn) {
    btn.style.background = on ? 'rgba(0,200,255,.15)' : 'rgba(255,255,255,.05)';
    btn.style.borderColor = on ? 'rgba(0,200,255,.4)' : 'rgba(255,255,255,.1)';
    btn.style.color = on ? 'var(--cyan)' : 'var(--muted)';
  }
  showToast(on
    ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg> TTS bật — AI sẽ đọc to phản hồi'
    : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg> TTS tắt');
}

// ── Sticky context-aware suggestions ─────────────────────────────
const STICKY_PAGE_SUGGESTIONS = {
  dashboard: ['Tổng hợp sản lượng hôm nay?', 'Trạm nào đang có cảnh báo?', 'KPI tháng này so với tháng trước?', 'Hiệu suất toàn hệ thống?'],
  videowall: ['Hiển thị camera Cẩm Phả', 'Trạng thái live các khu vực?', 'Điều hướng đến Video Wall', 'Có sự cố nào đang diễn ra không?'],
  gis: ['Vị trí bể chứa gần Hồng Gai?', 'Sự cố vỡ ống khu vực nào?', 'Khu vực nào chưa phủ mạng?', 'Áp suất tuyến ống Cẩm Phả?'],
  camera: ['Camera nào đang offline?', 'Xem camera Nhà máy Đèo Sen', 'Cảnh báo chuyển động gần đây?', 'Thiết bị camera nào cần bảo trì?'],
  scada: ['Áp lực đầu ra trạm Cẩm Phả?', 'Lưu lượng DMA Hồng Gai?', 'Van V-03 đang ở trạng thái nào?', 'Bơm B-02 tiêu thụ điện bao nhiêu?'],
  plants: ['Nhà máy Đèo Sen công suất bao nhiêu?', 'Tình trạng hóa chất hôm nay?', 'Lịch bảo trì thiết bị gần nhất?', 'NMN nào đang hoạt động dưới 80%?'],
  quality: ['pH nước đầu ra hiện tại?', 'Chỉ số Clo dư trạm Cẩm Phả?', 'QCVN 01-1:2024 quy định pH là bao nhiêu?', 'Mẫu nào vượt ngưỡng vi sinh?'],
  lims: ['Mẫu nước gần nhất được lấy khi nào?', 'Kết quả xét nghiệm hôm nay?', 'Phòng lab đang phân tích bao nhiêu mẫu?', 'Mẫu nào đang chờ kết quả?'],
  nrw: ['NRW DMA Hồng Gai hiện tại?', 'Khu vực nào thất thoát cao nhất?', 'Giải pháp giảm NRW xuống dưới 20%?', 'So sánh NRW tháng này và tháng trước'],
  incidents: ['Sự cố SC-003 tình trạng hiện tại?', 'Có bao nhiêu sự cố chưa xử lý?', 'Thống kê sự cố theo khu vực?', 'Sự cố nào ưu tiên xử lý ngay?'],
  callcenter: ['Khiếu nại chưa giải quyết hôm nay?', 'Thời gian phản hồi trung bình?', 'Cuộc gọi nào đang chờ xử lý?', 'Khiếu nại về mất nước khu vực nào?'],
  business: ['Khách hàng nào nước tháng này cao bất thường?', 'Hợp đồng nào sắp hết hạn?', 'Tổng doanh thu tháng này?', 'Chỉ số thu tiền nước đạt bao nhiêu %?'],
  business_overview: ['Doanh thu tháng vs kế hoạch?', 'Top 5 khách hàng tiêu thụ nhiều nhất?', 'Số lượng hợp đồng mới tháng này?', 'Tỷ lệ thu tiền nước?'],
  reports: ['Xuất báo cáo vận hành tháng 2/2026', 'Báo cáo NRW quý này?', 'Báo cáo chất lượng nước tuần qua?', 'Tổng hợp KPI toàn hệ thống?'],
  alerts: ['Cảnh báo nào nghiêm trọng nhất?', 'Ngưỡng áp suất tối thiểu là bao nhiêu?', 'Thiết lập cảnh báo cho DMA-03?', 'Ai sẽ nhận thông báo khi có cảnh báo?'],
  aiagent: ['AI Agent đang xử lý task nào?', 'Kết quả phân tích dữ liệu gần nhất?', 'Cấu hình AI Agent cho SCADA?', 'Lịch sử agent log hôm nay?'],
  chatbot: ['Tra cứu quy trình xử lý vi sinh?', 'QCVN 01-1:2024 về pH?', 'NRW DMA Hồng Gai?', 'Thiết bị sắp đến hạn bảo dưỡng?'],
  _default: ['Sản lượng hôm nay?', 'Trạm nào đang có cảnh báo?', 'NRW hệ thống hiện tại?', 'Thiết bị cần bảo trì?', 'Chất lượng nước đầu ra?']
};

function updateStickySuggestions(lastText) {
  const el = document.getElementById('qwcSuggestions');
  if (!el) return;
  const page = typeof currentPage !== 'undefined' ? currentPage : '_default';
  let chips = STICKY_PAGE_SUGGESTIONS[page] || STICKY_PAGE_SUGGESTIONS._default;

  // If there's context text, try to refine based on keywords
  if (lastText) {
    const txt = lastText.toLowerCase();
    for (const [key, arr] of Object.entries(CONTEXT_SUGGESTIONS || {})) {
      if (key !== 'mặc định' && txt.includes(key)) { chips = arr.slice(0, 4); break; }
    }
  }
  el.innerHTML = chips.slice(0, 4).map(q =>
    `<span class="chip" style="white-space:nowrap;font-size:11px;padding:5px 10px" onclick="document.getElementById('stickyChatInput').value=this.textContent;sendStickyChat()">${q}</span>`
  ).join('');

  // Also refresh format bar in sticky chat
  _renderFormatChips('qwcFormatBar', 'cbApplyStickyOutputFormat', null);
}


// Populate suggestions when sticky chat window opens
document.addEventListener('DOMContentLoaded', () => {
  // Delay to let DOM settle
  setTimeout(() => updateStickySuggestions(''), 500);
  // Also re-populate when window becomes visible
  const win = document.getElementById('qwcChatbot');
  if (win) {
    const observer = new MutationObserver(() => updateStickySuggestions(''));
    const chatWin = document.getElementById('qwcChatWindow');
    if (chatWin) observer.observe(chatWin, { attributes: true, attributeFilter: ['style'] });
  }
});

// ── Close all chatbot dropdowns on outside click ──────────────────
// All dropdown trigger buttons already call event.stopPropagation(),
// so clicks on the buttons themselves won't reach this listener.
document.addEventListener('click', function () {
  if (window._mainToolClose) { window._mainToolClose(); window._mainToolClose = null; }
  if (window._mainCatClose) { window._mainCatClose(); window._mainCatClose = null; }
  if (window._qwcToolClose) { window._qwcToolClose(); window._qwcToolClose = null; }
  if (window._qwcCatClose) { window._qwcCatClose(); window._qwcCatClose = null; }
});
