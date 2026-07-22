// ── GLOBAL FILTER / SEARCH BAR ───────────────────────────────────
// Each page defines its own filter spec. The bar renders automatically
// above every page via navigate() in app.js.

const PAGE_FILTERS = {
    dashboard: {
        search: { placeholder: 'Tìm trạm, hồ chứa, sự cố...' },
        filters: [
            { id: 'ff-factory', label: 'Hồ chứa', options: ['Tất cả hồ chứa', ...(RESERVOIR_DATA || []).map(f => f.name)] },
            { id: 'ff-district', label: 'Khu vực', options: ['Tất cả khu vực', 'Quận Hoàn Kiếm', 'Quận Hà Đông', 'Huyện Ba Vì', 'Huyện Mỹ Đức', 'Huyện Chương Mỹ', 'Thị xã Sơn Tây'] },
            { id: 'ff-time', label: 'Thời gian', options: ['Hôm nay', '7 ngày', 'Tháng 3/2026', 'Quý 1/2026', 'Năm 2026'] },
        ]
    },
    scada: {
        search: { placeholder: 'Tìm trạm bơm, cống, thiết bị...' },
        filters: [
            { id: 'ff-factory', label: 'Hồ/Công trình', options: ['Tất cả', ...(RESERVOIR_DATA || []).map(f => f.name)] },
            { id: 'ff-type', label: 'Loại trạm', options: ['Tất cả loại', 'Trạm bơm', 'Cống điều tiết', 'Tràn xả lũ', 'Trạm đo'] },
            { id: 'ff-status', label: 'Trạng thái', options: ['Tất cả TT', 'Online', 'Cảnh báo', 'Offline'] },
        ]
    },
    incidents: {
        search: { placeholder: 'Tìm sự cố đê điều, hồ chứa...' },
        filters: [
            { id: 'ff-factory', label: 'Khu vực', options: ['Tất cả khu vực', 'Quận Tây Hồ', 'Huyện Ba Vì', 'Huyện Mỹ Đức', 'Huyện Chương Mỹ', 'Huyện Quốc Oai'] },
            { id: 'ff-severity', label: 'Mức độ', options: ['Tất cả mức độ', 'Nghiêm trọng', 'Cao', 'Cảnh báo'] },
            { id: 'ff-status', label: 'Trạng thái', options: ['Tất cả TT', 'Mới', 'Đang xử lý', 'Hoàn thành'] },
            { id: 'ff-time', label: 'Thời gian', options: ['Hôm nay', '7 ngày', 'Tháng 3/2026'] },
        ]
    },
    quality: {
        search: { placeholder: 'Tìm mẫu nước, vị trí lấy mẫu...' },
        filters: [
            { id: 'ff-factory', label: 'Nguồn nước', options: ['Tất cả nguồn', ...(RESERVOIR_DATA || []).map(r => r.name)] },
            { id: 'ff-param', label: 'Chỉ tiêu', options: ['Tất cả chỉ tiêu', 'pH', 'DO', 'TSS', 'BOD5', 'COD', 'Coliform'] },
            { id: 'ff-status', label: 'Kết quả', options: ['Tất cả KQ', 'Đạt QCVN', 'Không đạt', 'Cần theo dõi'] },
            { id: 'ff-time', label: 'Thời gian', options: ['Hôm nay', '7 ngày', 'Tháng 3/2026'] },
        ]
    },
    production: {
        search: { placeholder: 'Tìm vật tư, thiết bị ứng cứu...' },
        filters: [
            { id: 'ff-factory', label: 'Kho', options: ['Tất cả kho', 'Kho trung tâm (Ba Đình)', 'Kho Huyện Ba Vì', 'Kho Huyện Mỹ Đức', 'Kho Huyện Chương Mỹ'] },
            { id: 'ff-stage', label: 'Loại vật tư', options: ['Tất cả loại', 'Cừ thép', 'Đá hộc', 'Bao cát', 'Rọ đá', 'Máy bơm', 'Xuồng máy'] },
            { id: 'ff-category', label: 'Danh mục', options: ['Tất cả', 'Vật tư đê điều', 'Phương tiện', 'Hậu cần'] },
            { id: 'ff-status', label: 'Tình trạng', options: ['Tất cả', 'Đầy đủ', 'Cần bổ sung', 'Hết hàng'] },
        ]
    },
    business_overview: {
        search: { placeholder: 'Tìm kiếm nhanh...', small: true },
        filters: [
            { id: 'ff-district', label: 'Khu vực', options: ['Tất cả khu vực', 'Quận Hoàn Kiếm', 'Quận Hà Đông', 'Huyện Ba Vì', 'Huyện Mỹ Đức', 'Huyện Đông Anh'] },
            { id: 'ff-factory', label: 'Nhà máy', options: ['Tất cả nhà máy', ...DATA.factories.map(f => f.name)] },
            { id: 'ff-type', label: 'Loại KH', options: ['Tất cả loại', 'Hộ dân', 'Doanh nghiệp'] },
            { id: 'ff-time', label: 'Kỳ', options: ['Ngày', 'Tuần', 'Tháng', 'Quý', 'Năm'] },
        ]
    },
    business_history: {
        search: { placeholder: 'Tìm mã BK, nhà máy...' },
        filters: [
            { id: 'ff-factory', label: 'Nhà máy', options: ['Tất cả nhà máy', ...DATA.factories.map(f => f.name)] },
            { id: 'ff-status', label: 'Trạng thái', options: ['Tất cả TT', 'Bình thường', 'Cảnh báo'] },
            { id: 'ff-time', label: 'Thời gian', options: ['Hôm nay', '7 ngày', 'Tháng 2/2026'] },
        ]
    },
    business: {
        search: { placeholder: 'Tìm khách hàng, HĐ, mã KH...' },
        twoRows: true,
        filters: [
            { id: 'ff-district', label: 'Khu vực', options: ['Tất cả khu vực', 'Quận Hoàn Kiếm', 'Quận Hà Đông', 'Huyện Ba Vì', 'Huyện Mỹ Đức', 'Huyện Đông Anh'] },
            { id: 'ff-factory', label: 'Nhà máy', options: ['Tất cả nhà máy', ...DATA.factories.map(f => f.name)] },
            { id: 'ff-type', label: 'Loại KH', options: ['Tất cả loại', 'Hộ dân', 'Doanh nghiệp'] },
            { id: 'ff-status', label: 'Trạng thái HĐ', options: ['Tất cả TT', 'Đang hiệu lực', 'Tạm khóa'] },
            { id: 'ff-debt', label: 'Công nợ', options: ['Tất cả', 'Không nợ', 'Có nợ'] },
            { id: 'ff-time', label: 'Kỳ', options: ['T2/2026', 'T1/2026', 'T12/2025', 'T11/2025'] },
        ]
    },
    callcenter: {
        search: { placeholder: 'Tìm theo KH, chủ đề, mã CC...' },
        filters: [
            { id: 'ff-type', label: 'Loại cuộc gọi', options: ['Tất cả', 'Inbound (đến)', 'Outbound (đi)'] },
            { id: 'ff-status', label: 'Trạng thái', options: ['Tất cả TT', 'Đã giải quyết', 'Đang xử lý', 'Escalate'] },
            { id: 'ff-agent', label: 'Agent', options: ['Tất cả agent', 'Nguyễn Thị Phương', 'Hoàng Minh Tuấn'] },
            { id: 'ff-time', label: 'Thời gian', options: ['Hôm nay', '7 ngày', 'Tháng 2/2026'] },
        ]
    },
    hrm: {
        search: { placeholder: 'Tìm nhân viên, chức vụ, phòng ban...' },
        filters: [
            { id: 'ff-factory', label: 'Nhà máy', options: ['Tất cả nhà máy', ...[...new Set(DATA.employees.map(e => e.factory || '—'))].sort()] },
            { id: 'ff-dept', label: 'Phòng ban', options: ['Tất cả phòng ban', ...[...new Set(DATA.employees.map(e => e.dept))].sort()] },
            { id: 'ff-role', label: 'Role', options: ['Tất cả role', 'Admin', 'Dispatcher', 'Operator', 'Viewer'] },
            { id: 'ff-status', label: 'Trạng thái', options: ['Tất cả TT', 'Đang làm việc', 'Không HĐ'] },
        ]
    },
    nrw: {
        search: { placeholder: 'Tìm đê, khu vực đê điều...' },
        filters: [
            { id: 'ff-zone', label: 'Tuyến đê', options: ['Tất cả đê', ...(DIKE_DATA || []).map(d => d.name)] },
            { id: 'ff-status', label: 'Tình trạng', options: ['Tất cả', 'Đạt tiêu chuẩn', 'Cần gia cố', 'Xung yếu'] },
            { id: 'ff-time', label: 'Thời gian', options: ['Hôm nay', '7 ngày', 'Tháng 3/2026'] },
        ]
    },
    reports: {
        search: { placeholder: 'Tìm báo cáo đê điều, thủy lợi...' },
        filters: [
            { id: 'ff-factory', label: 'Công trình', options: ['Tất cả', ...(RESERVOIR_DATA || []).map(f => f.name)] },
            { id: 'ff-type', label: 'Loại báo cáo', options: ['Tất cả loại', 'Hộ đê', 'Tình hình thiên tai', 'Sự cố', 'Dự báo lũ', '4 Tại chỗ'] },
            { id: 'ff-time', label: 'Kỳ', options: ['Hôm nay', '7 ngày', 'Tháng 3/2026', 'Quý 1/2026', 'Năm 2026'] },
        ]
    },
    gis: {
        search: { placeholder: 'Tìm trạm thủy văn, hồ chứa, tuyến đê...' },
        filters: [
            { id: 'ff-factory', label: 'Hồ chứa', options: ['Tất cả hồ', ...(RESERVOIR_DATA || []).map(f => f.name)] },
            { id: 'ff-district', label: 'Khu vực', options: ['Tất cả khu vực', 'Quận Tây Hồ', 'Huyện Ba Vì', 'Huyện Mỹ Đức', 'Huyện Đông Anh', 'Huyện Quốc Oai'] },
            { id: 'ff-layer', label: 'Hiển thị lớp', options: ['Tất cả lớp', 'Trạm thủy văn', 'Hồ chứa', 'Tuyến đê', 'Sự cố hiện tại'] },
        ]
    },
    aiagent: {
        search: { placeholder: 'Tìm tác vụ, loại báo cáo...' },
        filters: [
            { id: 'ff-type', label: 'Loại tác vụ', options: ['Tất cả loại', 'Báo cáo tự động', 'Giám sát bất thường', 'Cảnh báo thông minh'] },
            { id: 'ff-status', label: 'Trạng thái', options: ['Tất cả TT', 'Đang chạy', 'Tạm dừng'] },
            { id: 'ff-channel', label: 'Kênh gửi', options: ['Tất cả kênh', 'Email', 'Zalo', 'SMS', 'Notification'] },
        ]
    },
    datahub: {
        search: { placeholder: 'Tìm hệ thống, API key...' },
        filters: [
            { id: 'ff-sys', label: 'Hệ thống', options: ['Tất cả hệ thống', 'SCADA/PLC', 'Kế toán ERP', 'Hóa đơn VNPT', 'Ngân hàng', 'GIS Server'] },
            { id: 'ff-status', label: 'Trạng thái', options: ['Tất cả TT', 'Kết nối', 'Lỗi kết nối', 'Một phần'] },
        ]
    },
    chatbot: {
        search: { placeholder: 'Tìm tin nhắn, từ khóa...' },
        filters: [
            { id: 'ff-topic', label: 'Chủ đề', options: ['Tất cả chủ đề', 'Sản lượng', 'Chất lượng nước', 'Sự cố', 'SCADA', 'NRW'] },
        ]
    },
    log: {
        search: { placeholder: 'Tìm người dùng, hành động, đối tượng...' },
        filters: [
            { id: 'ff-user', label: 'Người dùng', options: ['Tất cả NV', ...DATA.employees.map(e => e.name)] },
            { id: 'ff-action', label: 'Loại thao tác', options: ['Tất cả thao tác', 'Tạo mới', 'Cập nhật', 'Xóa', 'Xuất báo cáo', 'Nhập dữ liệu'] },
            { id: 'ff-time', label: 'Thời gian', options: ['Hôm nay', '7 ngày', 'Tháng 2/2026'] },
        ]
    },
    settings: {
        search: { placeholder: 'Tìm cài đặt, phân quyền...' },
        filters: []
    },
};

function renderFilterBar(pageId) {
    const cfg = PAGE_FILTERS[pageId];
    if (!cfg) return '';

    const searchId = `fbSearch_${pageId}`;

    if (cfg.twoRows) {
        // Multi-row layout for complex filtering (Business page)
        const row1Filters = cfg.filters.slice(0, 3);
        const row2Filters = cfg.filters.slice(3);

        return `
<div class="filter-panel two-rows" id="filterPanel_${pageId}">
  <!-- Row 1: Search + 3 Filters -->
  <div class="fb-row">
    <div class="fb-search-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input id="${searchId}" class="fb-search-input" placeholder="${cfg.search?.placeholder || 'Tìm kiếm nhanh...'}" oninput="handleFbSearch('${pageId}', this.value)">
      <kbd id="${searchId}Clear" onclick="clearFbSearch('${pageId}')" style="display:none;cursor:pointer;color:var(--muted);font-size:11px;background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:4px;padding:1px 5px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></kbd>
    </div>
    <div class="fb-divider"></div>
    ${row1Filters.map(f => `
    <div class="fb-filter-group">
      <label class="fb-label">${f.label}</label>
      <select class="fb-select" id="${f.id}_${pageId}" onchange="handleFbFilter('${pageId}')">
        ${f.options.map((o, i) => `<option value="${i === 0 ? '' : o}">${o}</option>`).join('')}
      </select>
    </div>`).join('')}
  </div>

  <!-- Row 2: Remaining Filters + Reset Button -->
  <div class="fb-row" style="margin-top:12px; border-top:1px solid rgba(255,255,255,.05); padding-top:12px">
    ${row2Filters.map(f => `
    <div class="fb-filter-group">
      <label class="fb-label">${f.label}</label>
      <select class="fb-select" id="${f.id}_${pageId}" onchange="handleFbFilter('${pageId}')">
        ${f.options.map((o, i) => `<option value="${i === 0 ? '' : o}">${o}</option>`).join('')}
      </select>
    </div>`).join('')}
    
    <div class="fb-divider"></div>
    <button class="fb-reset" onclick="resetFilters('${pageId}')" title="Đặt lại bộ lọc">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
        Đặt lại
    </button>
  </div>
  
  <div id="fbChips_${pageId}" class="fb-chips"></div>
</div>`;
    }

    return `
<div class="filter-panel" id="filterPanel_${pageId}">
  <!-- Search -->
  <div class="fb-search-wrap ${cfg.search?.small ? 'sm' : ''}">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    <input id="${searchId}" class="fb-search-input" placeholder="${cfg.search?.placeholder || 'Tìm kiếm nhanh...'}" oninput="handleFbSearch('${pageId}', this.value)">
    <kbd id="${searchId}Clear" onclick="clearFbSearch('${pageId}')" style="display:none;cursor:pointer;color:var(--muted);font-size:11px;background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:4px;padding:1px 5px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></kbd>
  </div>

  <!-- Divider -->
  <div class="fb-divider"></div>

  <!-- Filters -->
  ${cfg.filters.map(f => `
  <div class="fb-filter-group">
    <label class="fb-label">${f.label}</label>
    <select class="fb-select" id="${f.id}_${pageId}" onchange="handleFbFilter('${pageId}')">
      ${f.options.map((o, i) => `<option value="${i === 0 ? '' : o}">${o}</option>`).join('')}
    </select>
  </div>`).join('')}

  ${cfg.filters.length > 0 ? `
  <!-- Divider -->
  <div class="fb-divider"></div>
  <!-- Reset -->
  <button class="fb-reset" onclick="resetFilters('${pageId}')" title="Đặt lại bộ lọc">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
    Đặt lại
  </button>` : ''}

  <!-- Active filter chips -->
  <div id="fbChips_${pageId}" class="fb-chips"></div>
</div>`;
}

function handleFbSearch(pageId, value) {
    const clearBtn = document.getElementById(`fbSearch_${pageId}Clear`);
    if (clearBtn) clearBtn.style.display = value ? 'inline-block' : 'none';

    // If it's business page, use its own rendering to support pagination
    if (pageId === 'business' && typeof changeCustPage === 'function') {
        custPage = 1; // Reset to first page
        document.getElementById('bizContent').innerHTML = renderCustomers();
    } else if (pageId === 'hrm' && typeof renderEmployeeList === 'function') {
        window.hrmSearchQuery = value;
        window.hrmEmpPage = 1;
        document.getElementById('hrmContent').innerHTML = renderEmployeeList();
    } else if (pageId === 'incidents' && typeof getIncidentTabContent === 'function') {
        incidentPage = 1;
        taskPage = 1;
        document.getElementById('incidentViewContainer').innerHTML = getIncidentTabContent();
    } else {
        // Default behavior for other pages: hide/show rows
        const bodies = document.querySelectorAll('tbody');
        if (bodies.length > 0) {
            bodies.forEach(tbody => {
                Array.from(tbody.rows).forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = !value || text.includes(value.toLowerCase()) ? '' : 'none';
                });
            });
        }
    }

    // Also update chip display
    updateFbChips(pageId);
}

function clearFbSearch(pageId) {
    const input = document.getElementById(`fbSearch_${pageId}`);
    if (input) { input.value = ''; handleFbSearch(pageId, ''); }
}

function handleFbFilter(pageId) {
    updateFbChips(pageId);

    // If it's business page, use its own rendering to support pagination
    if (pageId === 'business' && typeof changeCustPage === 'function') {
        custPage = 1; // Reset to first page
        document.getElementById('bizContent').innerHTML = renderCustomers();
    } else if (pageId === 'hrm' && typeof renderEmployeeList === 'function') {
        window.hrmFactoryFilter = document.getElementById('ff-factory_hrm')?.value || '';
        window.hrmDeptFilter = document.getElementById('ff-dept_hrm')?.value || '';
        window.hrmEmpPage = 1;
        const hrmContent = document.getElementById('hrmContent');
        if (hrmContent) hrmContent.innerHTML = renderEmployeeList();
    } else if (pageId === 'incidents' && typeof getIncidentTabContent === 'function') {
        incidentPage = 1;
        taskPage = 1;
        const container = document.getElementById('incidentViewContainer');
        if (container) container.innerHTML = getIncidentTabContent();
    }

    showToast('Bộ lọc đã được áp dụng', 'success');
}

function updateFbChips(pageId) {
    const cfg = PAGE_FILTERS[pageId];
    if (!cfg) return;
    const chipsEl = document.getElementById(`fbChips_${pageId}`);
    if (!chipsEl) return;

    const chips = [];
    const searchVal = document.getElementById(`fbSearch_${pageId}`)?.value;
    if (searchVal) chips.push({ label: `"${searchVal}"`, clear: () => clearFbSearch(pageId) });

    cfg.filters.forEach(f => {
        const sel = document.getElementById(`${f.id}_${pageId}`);
        if (sel && sel.value) chips.push({ label: `${f.label}: ${sel.value}`, clear: () => { sel.value = ''; handleFbFilter(pageId); } });
    });

    chipsEl.innerHTML = chips.map((c, i) => `
    <span class="fb-chip">${c.label}
      <span onclick="(${c.clear.toString()})()" style="cursor:pointer;margin-left:4px;opacity:.6;font-size:11px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>
    </span>`).join('');
}

function resetFilters(pageId) {
    const cfg = PAGE_FILTERS[pageId];
    if (!cfg) return;
    cfg.filters.forEach(f => {
        const sel = document.getElementById(`${f.id}_${pageId}`);
        if (sel) sel.value = '';
    });

    const input = document.getElementById(`fbSearch_${pageId}`);
    if (input) input.value = '';

    const clearBtn = document.getElementById(`fbSearch_${pageId}Clear`);
    if (clearBtn) clearBtn.style.display = 'none';

    // If it's business page, use its own rendering
    if (pageId === 'business' && typeof changeCustPage === 'function') {
        custPage = 1;
        document.getElementById('bizContent').innerHTML = renderCustomers();
    } else if (pageId === 'hrm' && typeof renderEmployeeList === 'function') {
        window.hrmSearchQuery = '';
        window.hrmFactoryFilter = '';
        window.hrmDeptFilter = '';
        window.hrmEmpPage = 1;
        const hrmContent = document.getElementById('hrmContent');
        if (hrmContent) hrmContent.innerHTML = renderEmployeeList();
    } else if (pageId === 'incidents' && typeof getIncidentTabContent === 'function') {
        incidentPage = 1;
        taskPage = 1;
        const container = document.getElementById('incidentViewContainer');
        if (container) container.innerHTML = getIncidentTabContent();
    } else {
        // Reset table rows visibility
        document.querySelectorAll('tbody tr').forEach(row => row.style.display = '');
    }

    updateFbChips(pageId);
    showToast('Đã đặt lại bộ lọc', 'success');
}
