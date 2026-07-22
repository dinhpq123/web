// ── QUAWACO IOC — ONBOARDING SPOTLIGHT ENGINE ────────────────────────────────
// Provides: OB.startTour, OB.endTour, OB.hasSeenPage, OB.markPageSeen,
//           OB.trackVisit, OB.getPageVisitCount, OB.injectHelpSuggestion

(function () {
    'use strict';

    // ── Tour step definitions per page ────────────────────────────────────────
    const OB_TOURS = {
        dashboard: [
            { target: '#sidebarNav', title: 'Menu điều hướng', body: 'Tất cả tính năng của hệ thống IOC được tổ chức tại đây. Click để mở từng phân hệ.' },
            { target: '.kpi-grid', title: 'KPI Tổng Quan', body: 'Các chỉ số vận hành quan trọng được cập nhật tự động mỗi 30 giây từ hệ thống SCADA.' },
            { target: '#dashTicker', title: 'Live Ticker', body: 'Dải thông tin trực tiếp: sản lượng, áp lực, cảnh báo và chất lượng nước theo thời gian thực.' },
            { target: '.header-right', title: 'Thanh Công Cụ', body: 'Xem cảnh báo, chuyển giao diện sáng/tối và bật chế độ toàn màn hình từ đây.' },
            { target: '#qwcChatbot', title: 'Hadiwa AI Trợ lý', body: 'Nhấn vào đây để hỏi AI về dữ liệu vận hành, sự cố, hoặc tra cứu thông tin hệ thống.' },
        ],
        gis: [
            { target: '.leaflet-container', title: 'Bản đồ GIS', body: 'Hiển thị toàn bộ mạng lưới tuyến ống, trạm bơm, sự cố và cảnh báo trên bản đồ địa lý.' },
            { target: '.gis-layer-panel, .leaflet-control-layers', fallback: '.leaflet-container', title: 'Bộ lọc & Lớp bản đồ', body: 'Bật/tắt các lớp hiển thị: tuyến ống, trạm bơm, sự cố đang xử lý, cảnh báo rò rỉ...' },
        ],
        incidents: [
            { target: '.filter-bar, .page-header', title: 'Bộ lọc Sự cố', body: 'Lọc theo trạng thái, loại sự cố, nhà máy và khoảng thời gian để tìm nhanh hơn.' },
            { target: '.data-table, table', title: 'Danh sách Sự cố & Lệnh CT', body: 'Mỗi hàng là một sự cố hoặc lệnh công tác. Click icon ▶ để xem chi tiết, icon bút để cập nhật.' },
            { target: '.pagination, [id*="pagination"]', fallback: '.page-actions', title: 'Phân trang', body: 'Chuyển giữa các trang kết quả.' },
        ],
        nrw: [
            { target: '.tab-bar, .tabs', fallback: '.page-header', title: 'Các Tab NRW', body: 'Chuyển giữa: Tổng quan NRW, Cảnh báo rò rỉ, và Lịch sử xử lý sự cố thất thoát.' },
        ],
        plants: [
            { target: '.kpi-grid, .page-header', title: 'Tổng quan Nhà máy', body: 'Xem toàn bộ nhà máy cùng công suất và trạng thái vận hành.' },
        ],
        scada: [
            { target: '.page-header', title: 'SCADA / RTU', body: 'Giám sát trực tiếp các thiết bị RTU/PLC và trạm bơm. Một số thao tác yêu cầu xác thực 2 lớp.' },
        ],
        alerts: [
            { target: '.alarm-list, table', title: 'Danh sách Cảnh Báo', body: 'Cảnh báo được phân loại theo mức độ. Nhấn "Xác nhận" để ACK.' },
        ],
        camera: [
            { target: '.camera-grid, .page-header', title: 'Camera / CCTV', body: 'Màn hình giám sát camera toàn hệ thống. Chọn camera để xem full-screen hoặc lưu ảnh.' },
        ],
        business: [
            { target: '.page-header', title: 'Tổng Quan Kinh Doanh', body: 'Doanh thu, sản lượng và khách hàng mới được tổng hợp theo nhà máy và thời kỳ.' },
        ],
        settings: [
            { target: '.page-header', title: 'Cài Đặt Hệ Thống', body: 'Cấu hình giao diện, animation, phân quyền và các tùy chọn cá nhân của tài khoản.' },
        ],
    };

    // ── Help chat responses per page ──────────────────────────────────────────
    const OB_HELP_TEXTS = {
        dashboard: 'Dashboard tổng quan hiển thị các KPI vận hành chính (sản lượng, trạm, sự cố, cảnh báo) và biểu đồ sản lượng theo thời gian thực. Dữ liệu tự làm mới mỗi 30 giây.',
        gis: 'Bản đồ GIS hiển thị toàn bộ mạng lưới tuyến ống và trạm bơm. Nhấn vào biểu tượng sự cố để xem chi tiết hoặc tạo lệnh công tác. Dùng bộ lọc lớp bản đồ ở góc trên để bật/tắt các lớp hiển thị.',
        incidents: 'Trang Sự cố & Lệnh CT quản lý toàn bộ sự cố vận hành. Bạn có thể tạo mới, phân công xử lý, theo dõi tiến độ và đóng sự cố từ đây. Dùng bộ lọc để tìm nhanh theo trạng thái hoặc nhà máy.',
        nrw: 'NRW (Non-Revenue Water) theo dõi thất thoát nước hệ thống. Tab "Cảnh báo rò rỉ" hiển thị các điểm rò rỉ nghi ngờ, Tab "Lịch sử" cho thấy các xử lý đã thực hiện.',
        plants: 'Quản lý toàn bộ nhà máy và công suất sử dụng. Click vào nhà máy để xem chi tiết thiết bị, lịch sử cảnh báo và thông số vận hành.',
        scada: 'SCADA hiển thị trạng thái thiết bị RTU/PLC theo thời gian thực. Các thao tác điều khiển (bật/tắt máy bơm, đóng/mở van) yêu cầu xác thực 2 lớp (2FA) để đảm bảo an toàn.',
        quality: 'Chất lượng nước giám sát các thông số: Clo dư, độ đục, pH, TDS tại các điểm đo. Màu đỏ = vượt ngưỡng QCVN. Dữ liệu được cập nhật từ hệ thống LIMS.',
        alerts: 'Cảnh báo hệ thống tổng hợp các sự kiện từ SCADA, chất lượng nước và thiết bị. Nhấn "Xác nhận (ACK)" để ghi nhận đã xử lý. Cảnh báo chưa ACK sẽ hiển thị badge đỏ trên header.',
        camera: 'Camera/CCTV cho phép xem trực tiếp camera tại các nhà máy và trạm bơm. Nhấn đúp vào camera để xem toàn màn hình, hoặc dùng nút chụp ảnh để lưu bằng chứng.',
        business: 'Tổng quan kinh doanh hiển thị doanh thu, sản lượng và số khách hàng mới theo từng nhà máy. Chuyển sang tab "Lịch sử" để xem chi tiết từng kỳ.',
        dieuhanh: 'Điều Hành & Phê Duyệt là trung tâm quản lý các quyết định vận hành cần phê duyệt từ lãnh đạo, bao gồm phê duyệt lệnh công tác quan trọng và điều chỉnh vận hành.',
        datahub: 'Data Hub & AI KPI cho phép nhập dữ liệu KPI thủ công, tải file Excel/PDF để AI tự trích xuất, và đồng bộ với hệ thống SCADA.',
        chatbot: 'Hadiwa AI có thể trả lời câu hỏi về dữ liệu vận hành, tra cứu thông số thiết bị, phân tích xu hướng thủy văn và viết báo cáo tự động.',
        settings: 'Cài Đặt cho phép tùy chỉnh giao diện (sáng/tối, animation), bố cục Dashboard và phân quyền tài khoản trong tổ chức.',
    };

    // ── localStorage helpers ───────────────────────────────────────────────────
    const LS = {
        get: (k) => localStorage.getItem(k),
        set: (k, v) => localStorage.setItem(k, String(v)),
        inc: (k) => { const n = parseInt(localStorage.getItem(k) || '0', 10) + 1; localStorage.setItem(k, n); return n; },
    };

    // ── Onboarding enabled check ───────────────────────────────────────────────
    // localStorage key: 'qwc_ob_enabled' → '1' = on (default), '0' = off
    function _isEnabled() {
        return localStorage.getItem('qwc_ob_enabled') !== '0';
    }

    // ── Spotlight overlay ──────────────────────────────────────────────────────
    let _tourSteps = [], _tourIdx = 0;

    function _getOverlay() {
        let el = document.getElementById('ob-overlay');
        if (!el) {
            el = document.createElement('div');
            el.id = 'ob-overlay';
            el.innerHTML = `
        <div id="ob-backdrop"></div>
        <div id="ob-tooltip">
          <div id="ob-step-counter"></div>
          <div id="ob-title"></div>
          <div id="ob-body"></div>
          <div id="ob-actions">
            <button id="ob-skip" onclick="OB.endTour()">Bỏ qua</button>
            <div style="display:flex;gap:8px">
              <button id="ob-prev" onclick="OB._step(-1)">‹ Trước</button>
              <button id="ob-next" onclick="OB._step(1)">Tiếp ›</button>
              <button id="ob-done" onclick="OB.endTour()" style="display:none">Hoàn thành ✓</button>
            </div>
          </div>
        </div>`;
            document.body.appendChild(el);
            if (!document.getElementById('ob-style')) {
                const s = document.createElement('style');
                s.id = 'ob-style';
                s.textContent = `
          #ob-overlay{position:fixed;inset:0;z-index:99999;pointer-events:none}
          #ob-backdrop{position:fixed;inset:0;background:rgba(2,8,20,.82);backdrop-filter:blur(2px);pointer-events:all}
          #ob-tooltip{position:fixed;background:linear-gradient(135deg,#071629,#0d2040);border:1px solid rgba(0,200,255,.35);border-radius:14px;padding:20px 22px;min-width:280px;max-width:340px;box-shadow:0 8px 40px rgba(0,0,0,.6);pointer-events:all;animation:ob-pop .25s cubic-bezier(.175,.885,.32,1.275);z-index:100000}
          @keyframes ob-pop{from{opacity:0;transform:scale(.9) translateY(8px)}to{opacity:1;transform:none}}
          #ob-step-counter{font-size:10px;font-family:'Roboto Mono',monospace;color:rgba(0,200,255,.6);letter-spacing:1px;margin-bottom:8px;text-transform:uppercase}
          #ob-title{font-size:15px;font-weight:700;color:#e3f2fd;margin-bottom:8px;display:flex;align-items:center;gap:8px}
          #ob-title::before{content:'';display:inline-block;width:4px;height:16px;background:var(--cyan,#00c8ff);border-radius:2px;flex-shrink:0}
          #ob-body{font-size:13px;color:#90afc8;line-height:1.55;margin-bottom:18px}
          #ob-actions{display:flex;justify-content:space-between;align-items:center;gap:8px}
          #ob-skip{font-size:12px;color:rgba(255,255,255,.35);background:none;border:none;cursor:pointer;padding:4px 0;transition:.2s}
          #ob-skip:hover{color:rgba(255,255,255,.7)}
          #ob-prev,#ob-next,#ob-done{font-size:12px;font-weight:600;padding:7px 14px;border-radius:8px;border:1px solid rgba(0,200,255,.3);cursor:pointer;transition:all .2s}
          #ob-prev{background:rgba(0,200,255,.06);color:rgba(0,200,255,.8)}
          #ob-next,#ob-done{background:linear-gradient(135deg,#0050cc,#00c8ff);color:#fff;border-color:transparent;box-shadow:0 2px 12px rgba(0,200,255,.3)}
          #ob-prev:hover{background:rgba(0,200,255,.12)}
          #ob-next:hover,#ob-done:hover{filter:brightness(1.1)}
          .ob-highlight{outline:2px solid rgba(0,200,255,.9)!important;outline-offset:4px!important;border-radius:6px;box-shadow:0 0 0 4px rgba(0,200,255,.15),0 0 20px rgba(0,200,255,.2)!important;position:relative;z-index:99998}
        `;
                document.head.appendChild(s);
            }
        }
        return el;
    }

    function _positionTooltip(targetEl) {
        const tooltip = document.getElementById('ob-tooltip');
        if (!tooltip) return;
        const vw = window.innerWidth, vh = window.innerHeight;
        if (!targetEl) {
            tooltip.style.cssText += ';top:50%;left:50%;transform:translate(-50%,-50%)'; return;
        }
        tooltip.style.transform = '';
        const rect = targetEl.getBoundingClientRect();
        const tw = tooltip.offsetWidth || 320, th = tooltip.offsetHeight || 180;
        const top = (rect.bottom + th + 16 < vh) ? rect.bottom + 12 : Math.max(12, rect.top - th - 12);
        const left = Math.max(12, Math.min(rect.left + rect.width / 2 - tw / 2, vw - tw - 12));
        tooltip.style.top = top + 'px';
        tooltip.style.left = left + 'px';
    }

    function _renderStep(idx) {
        const step = _tourSteps[idx];
        if (!step) return;
        document.querySelectorAll('.ob-highlight').forEach(el => el.classList.remove('ob-highlight'));
        let targetEl = step.target ? document.querySelector(step.target) : null;
        if (!targetEl && step.fallback) targetEl = document.querySelector(step.fallback);
        if (targetEl) { targetEl.classList.add('ob-highlight'); targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        document.getElementById('ob-step-counter').textContent = `Bước ${idx + 1} / ${_tourSteps.length}`;
        document.getElementById('ob-title').textContent = step.title;
        document.getElementById('ob-body').textContent = step.body;
        const isLast = idx === _tourSteps.length - 1;
        document.getElementById('ob-next').style.display = isLast ? 'none' : '';
        document.getElementById('ob-done').style.display = isLast ? '' : 'none';
        document.getElementById('ob-prev').style.display = idx === 0 ? 'none' : '';
        setTimeout(() => _positionTooltip(targetEl), 120);
    }

    // ── Help chip builder ──────────────────────────────────────────────────────
    function _buildHelpChip(pageId, pageCfg) {
        const chip = document.createElement('div');
        chip.className = 'ob-help-chip';
        chip.style.cssText = 'display:inline-flex;align-items:center;gap:6px;flex-shrink:0;padding:6px 12px;background:rgba(0,200,255,.08);border:1.5px solid rgba(0,200,255,.45);border-radius:20px;cursor:pointer;font-size:12px;color:#e3f2fd;white-space:nowrap;transition:all .2s;font-weight:600';
        chip.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00c8ff" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Hướng dẫn trang này`;
        chip.onmouseover = () => { chip.style.background = 'rgba(0,200,255,.18)'; };
        chip.onmouseout = () => { chip.style.background = 'rgba(0,200,255,.08)'; };
        chip.onclick = () => OB._sendHelpMessage(pageId, pageCfg);
        return chip;
    }

    // ── Public API ─────────────────────────────────────────────────────────────
    window.OB = {
        startTour(pageId) {
            if (!_isEnabled()) return;  // Onboarding disabled in Settings
            const steps = OB_TOURS[pageId];
            if (!steps || steps.length === 0) return;
            _tourSteps = steps; _tourIdx = 0;
            _getOverlay().style.display = 'block';
            _renderStep(0);
        },

        endTour() {
            const overlay = document.getElementById('ob-overlay');
            if (overlay) overlay.style.display = 'none';
            document.querySelectorAll('.ob-highlight').forEach(el => el.classList.remove('ob-highlight'));
            if (window._ob_currentPage) OB.markPageSeen(window._ob_currentPage);
        },

        _step(dir) {
            _tourIdx = Math.max(0, Math.min(_tourSteps.length - 1, _tourIdx + dir));
            _renderStep(_tourIdx);
        },

        hasSeenPage(pageId) { return LS.get('qwc_ob_page_' + pageId) === '1'; },
        markPageSeen(pageId) { LS.set('qwc_ob_page_' + pageId, '1'); },

        trackVisit(pageId) {
            window._ob_currentPage = pageId;
            LS.inc('qwc_visits_' + pageId);
        },

        getPageVisitCount(pageId) {
            return parseInt(LS.get('qwc_visits_' + pageId) || '0', 10);
        },

        // Injects "Hướng dẫn trang này" as first chip (idempotent)
        injectHelpSuggestion(pageId) {
            if (!_isEnabled()) return;  // Onboarding disabled in Settings
            const cfg = window.OB_CONFIG || {};
            const maxVisits = cfg.chatbotHelpVisits || 5;
            const visits = OB.getPageVisitCount(pageId);
            if (visits > maxVisits) return;

            const container = document.getElementById('qwcSuggestions');
            if (!container) return;

            // Remove stale chip first
            container.querySelectorAll('.ob-help-chip').forEach(c => c.remove());

            const pageCfg = ((cfg.pages || {})[pageId]) || {};
            container.insertBefore(_buildHelpChip(pageId, pageCfg), container.firstChild);
        },

        _sendHelpMessage(pageId, pageCfg) {
            // Open chatbot window
            const win = document.getElementById('qwcChatWindow');
            if (win) win.style.display = 'flex';

            const userQ = `Hướng dẫn sử dụng trang ${pageCfg.title || pageId}`;
            if (typeof pushStickyMsg === 'function') pushStickyMsg({ role: 'user', text: userQ });

            const helpText = OB_HELP_TEXTS[pageId]
                || `Trang **${pageCfg.title || pageId}** là một phân hệ quan trọng của Hadiwa IOC.`;
            const videoUrl = pageCfg.videoUrl || '#';
            const docUrl = pageCfg.docUrl || 'docs/documentation.html';

            // Build a reply that renderMsg will display correctly (uses ** → <strong> and \n → <br>)
            const replyText = `${helpText}\n\n` +
                `<div style="display:flex;flex-direction:column;gap:8px;margin-top:4px">` +
                `<a href="${videoUrl}" target="_blank" ` +
                `style="display:inline-flex;align-items:center;gap:8px;padding:8px 14px;background:rgba(255,23,68,.08);border:1px solid rgba(255,23,68,.3);border-radius:8px;color:#ff8a80;text-decoration:none;font-size:12px;font-weight:600" ` +
                `onmouseover="this.style.background='rgba(255,23,68,.18)'" onmouseout="this.style.background='rgba(255,23,68,.08)'">` +
                `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>` +
                `Xem video hướng dẫn</a>` +
                `<a href="${docUrl}" target="_blank" ` +
                `style="display:inline-flex;align-items:center;gap:8px;padding:8px 14px;background:rgba(0,200,255,.06);border:1px solid rgba(0,200,255,.2);border-radius:8px;color:#80d8ff;text-decoration:none;font-size:12px;font-weight:600" ` +
                `onmouseover="this.style.background='rgba(0,200,255,.14)'" onmouseout="this.style.background='rgba(0,200,255,.06)'">` +
                `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>` +
                `Tài liệu sử dụng</a>` +
                `<button onclick="OB.startTour('${pageId}')" ` +
                `style="display:inline-flex;align-items:center;gap:8px;padding:8px 14px;background:rgba(0,200,255,.06);border:1px solid rgba(0,200,255,.2);border-radius:8px;color:#80d8ff;font-size:12px;font-weight:600;cursor:pointer;text-align:left" ` +
                `onmouseover="this.style.background='rgba(0,200,255,.14)'" onmouseout="this.style.background='rgba(0,200,255,.06)'">` +
                `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>` +
                `Bắt đầu tour hướng dẫn tương tác</button>` +
                `</div>`;

            setTimeout(() => {
                if (typeof pushStickyMsg === 'function') pushStickyMsg({ role: 'ai', text: replyText });
            }, 500);
        },
    };

    // ── Patch updateStickySuggestions to always re-inject help chip ────────────
    // We wait for DOM ready so chatbot.js has already defined updateStickySuggestions
    document.addEventListener('DOMContentLoaded', () => {
        // Small delay to let chatbot.js finish defining all functions
        setTimeout(() => {
            if (typeof updateStickySuggestions === 'function') {
                const _orig = updateStickySuggestions;
                window.updateStickySuggestions = function (lastText) {
                    _orig(lastText);
                    // Re-inject help chip for current page if within N-visit threshold
                    const page = window._ob_currentPage || window.currentPage;
                    if (page) OB.injectHelpSuggestion(page);
                };
            }
        }, 200);
    });

})();
