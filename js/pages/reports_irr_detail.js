/**
 * ── IRRIGATION DETAIL REPORT MODULE ────────────────────────────
 * Enhanced with: Premium SVGs, Tabbed Layout, Leaflet Maps,
 * and Mock Document Management.
 * ───────────────────────────────────────────────────────────────
 */

const IRR_ICONS = {
  info: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  tool: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>`,
  map: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
  chart: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  file: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>`,
  camera: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  ruler: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 15.5L15.5 11M3 21L21 3M5 19L7 21M9 17L11 19M13 15L15 17M17 13L19 15M19 11L21 13"/></svg>`,
  mail: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
  warn: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  alert: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
};

/**
 * Global instance for Modal State
 */
var _activeIrrModal = {
  tab: 'general',
  map: null,
  record: null,
  type: null,
};

/**
 * Main function to show the detailed report
 */
function showIrrDetailReport(type, rec) {
  _activeIrrModal.record = rec;
  _activeIrrModal.type = type;
  _activeIrrModal.tab = 'general';

  renderIrrModal();
}

/**
 * Renders/Updates the modal content based on tab
 */
function renderIrrModal() {
  const rec = _activeIrrModal.record;
  const type = _activeIrrModal.type;
  const tab = _activeIrrModal.tab;
  const docNo = rec.id || 'INV-' + Math.floor(Math.random() * 90000 + 10000);

  let title = 'Hồ sơ Chi tiết Công trình Thủy lợi';
  if (type === 'cap_phep') title = `Hồ sơ Cấp phép Thủy lợi — ${docNo}`;
  if (type === 'vi_pham') title = `Hồ sơ Vi phạm Thủy lợi — ${docNo}`;
  if (type === 'kiem_dinh') title = `Hồ sơ Kiểm định An toàn — ${docNo}`;
  if (type === 'dau_tu') title = `Hồ sơ Đầu tư & Nâng cấp — ${docNo}`;
  if (type === 'hien_trang') title = `Báo cáo Đánh giá Hiện trạng — ${docNo}`;

  const html = `
    <div class="irr-modal-container" style="display:flex;flex-direction:column;height:680px;background:var(--bg-card);border-radius:12px;overflow:hidden">
      <!-- Modal Header -->
      <div style="padding:20px 24px;background:linear-gradient(135deg, var(--primary-soft), transparent);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:18px;font-weight:700;color:var(--text);margin-bottom:4px">${title}</div>
          <div style="font-size:12px;color:var(--muted);display:flex;align-items:center;gap:6px">
            <span class="badge badge-cyan" style="font-family:monospace">${docNo}</span>
            <span style="opacity:0.6">•</span>
            <span>Ngày cập nhật: 26/03/2026</span>
          </div>
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-ghost btn-sm" onclick="showToast('Đang tạo bản in...')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> In ấn
          </button>
          <button class="btn btn-primary btn-sm" onclick="showToast('Đang xuất PDF...')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Xuất PDF
          </button>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div id="irrModalTabs" class="modal-tabs">
        ${renderModalTabBtn('general', 'Tổng quan', IRR_ICONS.info)}
        ${renderModalTabBtn('tech', 'Kỹ thuật', IRR_ICONS.ruler)}
        ${renderModalTabBtn('status', 'Hiện trạng', IRR_ICONS.chart)}
        ${renderModalTabBtn('map', 'Vị trí & GIS', IRR_ICONS.map)}
        ${renderModalTabBtn('files', 'Hồ sơ & Bản vẽ', IRR_ICONS.file)}
      </div>

      <!-- Tab Content -->
      <div id="irrModalContent" style="flex:1;overflow-y:auto;padding:24px">
        ${renderTabContent(tab)}
      </div>

      <!-- Footer Info -->
      <div style="padding:12px 24px;border-top:1px solid var(--border);background:var(--bg-elevated);display:flex;justify-content:space-between;align-items:center">
        <div style="font-size:11px;color:var(--muted)">© 2026 iClever Hadiwa IOC · Hệ thống CSDL Thủy lợi TP. Hà Nội</div>
        <div style="display:flex;gap:16px;font-size:11px;color:var(--muted)">
          <span>Người phê duyệt: <strong>Nguyễn Văn Thành</strong></span>
          <span>Chức vụ: <strong>Chi cục trưởng</strong></span>
        </div>
      </div>
    </div>
  `;

  openModal(html, { width: '920px', padding: '0', background: 'transparent' });

  // Post-render actions
  if (tab === 'map') {
    setTimeout(initIrrDetailMap, 300);
  }
}

function renderModalTabBtn(id, label, icon) {
  const active = _activeIrrModal.tab === id;
  return `
    <button type="button" class="modal-tab ${active ? 'active' : ''}" onclick="switchIrrModalTab('${id}')">
      ${icon} ${label}
    </button>
  `;
}

function switchIrrModalTab(id) {
  _activeIrrModal.tab = id;
  
  // Update Tab Buttons UI
  const tabs = document.getElementById('irrModalTabs');
  if (tabs) {
    tabs.innerHTML = `
        ${renderModalTabBtn('general', 'Tổng quan', IRR_ICONS.info)}
        ${renderModalTabBtn('tech', 'Kỹ thuật', IRR_ICONS.ruler)}
        ${renderModalTabBtn('status', 'Hiện trạng', IRR_ICONS.chart)}
        ${renderModalTabBtn('map', 'Vị trí & GIS', IRR_ICONS.map)}
        ${renderModalTabBtn('files', 'Hồ sơ & Bản vẽ', IRR_ICONS.file)}
    `;
  }

  const container = document.getElementById('irrModalContent');
  if (container) {
    container.innerHTML = renderTabContent(id);
    // Restart animation if needed
    container.style.opacity = '0';
    setTimeout(() => {
      container.style.transition = 'opacity 0.2s ease-in-out';
      container.style.opacity = '1';
    }, 10);
    // Init map if moving to map tab
    if (id === 'map') setTimeout(initIrrDetailMap, 300);
  }
}

function renderTabContent(tab) {
  const rec = _activeIrrModal.record;
  const type = _activeIrrModal.type;

  switch (tab) {
    case 'general': return renderGeneralTab(rec, type);
    case 'tech': return renderTechTab(rec, type);
    case 'status': return renderStatusTab(rec, type);
    case 'map': return renderMapTab(rec);
    case 'files': return renderFilesTab(rec, type);
    default: return '';
  }
}

function renderGeneralTab(rec, type) {
  const meta = getGeneralMeta(rec, type);
  return `
    <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:24px">
      <div>
        <div style="font-size:12px;font-weight:700;color:var(--primary);text-transform:uppercase;margin-bottom:16px;letter-spacing:1px">I. Thông tin cơ bản</div>
        <div class="card" style="padding:16px;background:var(--bg-card)">
          <table style="width:100%;font-size:13px;border-collapse:collapse">
            ${meta.map(row => `
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:10px 0;color:var(--muted);width:140px">${row[0]}</td>
                <td style="padding:10px 0;font-weight:600;color:var(--text)">${row[1]}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      </div>
      <div>
        <div style="font-size:12px;font-weight:700;color:var(--primary);text-transform:uppercase;margin-bottom:16px;letter-spacing:1px">II. Phân loại & Pháp lý</div>
        <div class="card" style="padding:16px;background:var(--bg-card)">
          <div style="display:flex;flex-direction:column;gap:12px">
            <div>
              <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Cấp công trình</div>
              <div style="font-size:13px;font-weight:600">Cấp III — Theo QCVN 04-05:2012</div>
            </div>
            <div>
              <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Loại hình</div>
              <div style="font-size:13px;font-weight:600">${rec.loai || 'Công trình Thủy lợi'}</div>
            </div>
            <div>
              <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Văn bản phê duyệt</div>
              <div style="font-size:13px;font-weight:600;color:var(--primary)">QĐ-UBND 1422/2024</div>
            </div>
          </div>
        </div>
        <div style="margin-top:20px">
          <div style="font-size:12px;font-weight:700;color:var(--primary);text-transform:uppercase;margin-bottom:16px;letter-spacing:1px">III. Hình ảnh đại diện</div>
          <div style="width:100%;height:140px;border-radius:8px;background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;border:1px dashed var(--border)">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
             <span style="font-size:11px;color:var(--muted);margin-left:8px">Chưa có ảnh đại diện</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTechTab(rec, type) {
  const specs = getTechSpecs(rec, type);
  return `
    <div style="font-size:12px;font-weight:700;color:var(--primary);text-transform:uppercase;margin-bottom:16px;letter-spacing:1px">Chỉ tiêu kỹ thuật chi tiết</div>
    <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:16px">
      ${specs.map(s => `
        <div class="card" style="padding:12px 16px;background:var(--bg-card);display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:12px;color:var(--muted)">${s[0]}</span>
          <span style="font-size:13px;font-weight:700;color:var(--text)">${s[1]}</span>
        </div>
      `).join('')}
    </div>
    <div style="margin-top:24px">
      <div style="font-size:12px;font-weight:700;color:var(--primary);text-transform:uppercase;margin-bottom:16px;letter-spacing:1px">Mô tả kết cấu & Năng lực phục vụ</div>
      <div class="card" style="padding:16px;background:var(--bg-card);line-height:1.6;font-size:13px;color:var(--text-secondary)">
        Công trình được xây dựng bằng vật liệu bê tông cốt thép mác 250, hệ thống cửa van vận hành cơ giới kết hợp thủ công. 
        Năng lực thiết kế đảm bảo phục vụ tưới cho 150ha đất canh tác và tiêu thoát nước cho khu vực dân cư lân cận với lưu lượng đỉnh thiết kế 
        là 25m3/s. Tình trạng kết cấu hiện tại ổn định, tuân thủ hồ sơ hoàn công năm 2021.
      </div>
    </div>
  `;
}

function renderStatusTab(rec, type) {
  const assessments = getAssessments(rec, type);
  return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div>
        <div style="font-size:12px;font-weight:700;color:var(--primary);text-transform:uppercase;margin-bottom:16px;letter-spacing:1px">IV. Đánh giá hiện trạng</div>
        <div class="card" style="padding:16px;background:var(--bg-card)">
          ${assessments.map(a => `
            <div style="padding:10px 0;border-bottom:1px solid var(--border)">
              <div style="font-size:11px;color:var(--muted);margin-bottom:4px">${a[0]}</div>
              <div style="font-size:13px;font-weight:600;display:flex;align-items:center;gap:6px">
                ${a[1].includes('✅') ? IRR_ICONS.check : a[1].includes('⚠') ? IRR_ICONS.warn : ''}
                ${a[1].replace(/[✅⚠]/g, '')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div>
        <div style="font-size:12px;font-weight:700;color:var(--primary);text-transform:uppercase;margin-bottom:16px;letter-spacing:1px">V. Đề xuất & Kế hoạch</div>
        <div class="card" style="padding:16px;background:var(--bg-card)">
          <div style="margin-bottom:16px">
             <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Hướng xử lý</div>
             <div style="font-size:13px;font-weight:600;color:var(--warning)">${rec.xu_ly || 'Theo dõi định kỳ, bảo trì thường xuyên'}</div>
          </div>
          <div>
             <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Kiểm định tiếp theo</div>
             <div style="font-size:13px;font-weight:600">${rec.kd_tiep || 'Quý IV / 2026'}</div>
          </div>
          <div style="margin-top:16px;padding-top:16px;border-top:1px dashed var(--border)">
             <div style="font-size:12px;font-weight:600;margin-bottom:8px">Ghi chú lãnh đạo</div>
             <div style="font-size:12px;color:var(--muted);line-height:1.5 italic">
               "Yêu cầu đơn vị quản lý tăng cường kiểm tra trước mùa mưa bão, đặc biệt chú ý hệ thống bôi trơn thiết bị cơ giới."
             </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderMapTab(rec) {
  return `
    <div style="height:100%;display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="font-size:12px;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:1px">VỊ TRÍ TRÊN BẢN ĐỒ GIS</div>
        <div style="font-size:12px;color:var(--muted)">Tọa độ: 21°02'45" N — 105°49'12" E</div>
      </div>
      <div id="irrDetailMap" style="flex:1;background:var(--bg-elevated);border-radius:12px;border:1px solid var(--border);min-height:400px"></div>
      <div style="font-size:11px;color:var(--muted);background:var(--primary-soft);padding:10px;border-radius:6px;border:1px solid var(--border)">
        <strong>Ghi chú:</strong> Bản đồ thể hiện vị trí trung tâm công trình và phạm vi hành lang bảo vệ. Bạn có thể kéo/phóng to để xem chi tiết địa hình xung quanh.
      </div>
    </div>
  `;
}

function renderFilesTab(rec, type) {
  return `
    <div style="display:grid;grid-template-columns:1fr 1.2fr;gap:24px">
      <div>
        <div style="font-size:12px;font-weight:700;color:var(--primary);text-transform:uppercase;margin-bottom:16px;letter-spacing:1px">Hồ sơ pháp lý & Cấp phép</div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${renderFileItem('Quyết định cấp phép Thủy lợi', 'ho_so_cap_phep.pdf', 'PDF · 2.4 MB', IRR_ICONS.file)}
          ${renderFileItem('Biên bản nghiệm thu bàn giao', 'ho_so_cap_phep.pdf', 'PDF · 1.8 MB', IRR_ICONS.check)}
          ${renderFileItem('Báo cáo kiểm định an toàn hồ đập', 'bao_cao_kiem_dinh.pdf', 'PDF · 4.2 MB', IRR_ICONS.alert)}
        </div>
        <div style="font-size:12px;font-weight:700;color:var(--primary);text-transform:uppercase;margin:20px 0 16px;letter-spacing:1px">Bản vẽ kỹ thuật</div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${renderFileItem('Bản vẽ mặt bằng tổng thể', 'ban_ve_ky_thuat.pdf', 'DWG/PDF · 8.5 MB', IRR_ICONS.ruler)}
          ${renderFileItem('Chi tiết kết cấu thân cống', 'ban_ve_ky_thuat.pdf', 'PDF · 3.1 MB', IRR_ICONS.tool)}
        </div>
      </div>
      <div>
        <div style="font-size:12px;font-weight:700;color:var(--primary);text-transform:uppercase;margin-bottom:16px;letter-spacing:1px">Ảnh thực địa (Realtime & Survey)</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          ${renderPhotoItem('Toàn cảnh nhìn từ hạ lưu', 'anh_thuc_dia_01.jpg', '26/03/2026')}
          ${renderPhotoItem('Gia cố mái đê đoạn xung yếu', 'anh_thuc_dia_02.jpg', '24/03/2026')}
          ${renderPhotoItem('Hệ thống cửa van vận hành', 'anh_thuc_dia_01.jpg', '22/03/2026')}
          ${renderPhotoItem('Cống xả tràn khi vận hành', 'anh_thuc_dia_02.jpg', '20/03/2026')}
        </div>
        <div style="margin-top:20px">
           <button class="btn btn-ghost btn-sm" style="width:100%;justify-content:center;border:1px dashed var(--border)" onclick="showToast('Chức năng tải lên đang khóa...')">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Thêm ảnh/tài liệu mới
           </button>
        </div>
      </div>
    </div>
  `;
}

function renderFileItem(name, path, info, icon) {
  const fullPath = 'assets/docs/irrigation/' + path;
  return `
    <div class="card" style="padding:12px;background:var(--bg-card);display:flex;align-items:center;gap:12px;transition:background .2s;cursor:pointer" onclick="window.open('${fullPath}', '_blank')" onmouseover="this.style.background='var(--primary-soft)'" onmouseout="this.style.background='rgba(255,255,255,0.03)'">
      <div style="width:36px;height:36px;border-radius:8px;background:var(--primary-soft);display:flex;align-items:center;justify-content:center;color:var(--primary)">
        ${icon}
      </div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600;margin-bottom:2px">${name}</div>
        <div style="font-size:11px;color:var(--muted)">${info}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
    </div>
  `;
}

function renderPhotoItem(caption, path, date) {
  const fullPath = 'assets/docs/irrigation/' + path;
  return `
    <div style="border-radius:10px;overflow:hidden;border:1px solid var(--border);background:var(--bg-elevated);cursor:pointer;transition:transform .2s" onclick="window.open('${fullPath}', '_blank')" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
      <div style="height:80px;background:var(--bg-card);display:flex;align-items:center;justify-content:center">
        ${IRR_ICONS.camera}
      </div>
      <div style="padding:8px;background:var(--bg-elevated)">
        <div style="font-size:11px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${caption}</div>
        <div style="font-size:9px;color:var(--muted)">${date}</div>
      </div>
    </div>
  `;
}

/**
 * Initialize Leaflet Map in Modal
 */
function initIrrDetailMap() {
  const container = document.getElementById('irrDetailMap');
  if (!container || _activeIrrModal.tab !== 'map') return;

  // Cleanup existing map if any
  if (_activeIrrModal.map) {
    _activeIrrModal.map.remove();
    _activeIrrModal.map = null;
  }

  const rec = _activeIrrModal.record;
  const lat = 21.045, lng = 105.795; // Default mock coords

  const map = L.map('irrDetailMap').setView([lat, lng], 15);
  _activeIrrModal.map = map;

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap · iClever',
    maxZoom: 19
  }).addTo(map);

  const markerIcon = L.divIcon({
    html: `
      <div style="position:relative">
        <div style="width:20px;height:20px;background:var(--primary);border:3px solid white;border-radius:50%;box-shadow:0 0 10px var(--primary)"></div>
        <div style="position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:10px solid var(--primary)"></div>
      </div>
    `,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 20]
  });

  L.marker([lat, lng], { icon: markerIcon }).addTo(map)
    .bindPopup(`<strong>${rec.ten || rec.ten_ct || 'Vị trí công trình'}</strong><br/>${rec.xa || ''}, ${rec.huyen || ''}`)
    .openPopup();

  // Circle to represent protected area
  L.circle([lat, lng], {
    color: 'var(--primary)',
    fillColor: 'var(--primary)',
    fillOpacity: 0.1,
    radius: 500
  }).addTo(map);
}

/**
 * Helper: Data mappings
 */
function getGeneralMeta(rec, type) {
  const res = [];
  res.push(['Tên công trình', rec.ten || rec.ten_ct || '—']);
  res.push(['Mã định danh', rec.id || '—']);
  res.push(['Đơn vị quản lý', rec.cty || rec.don_vi_ql || '—']);
  res.push(['Địa điểm', `${rec.xa || ''}, ${rec.huyen || ''}`]);
  res.push(['Ngày cập nhật', '26/03/2026']);
  if (type === 'cap_phep') {
    res.push(['Số giấy phép', rec.so_gp || '—']);
    res.push(['Thời hạn GP', rec.thoi_han || '—']);
  }
  return res;
}

function getTechSpecs(rec, type) {
  const res = [];
  if (type === 'kiem_dinh') {
    res.push(['Cao trình đỉnh', '12.50 m']);
    res.push(['Lưu lượng TK', rec.ll_tk || '15.2 m3/s']);
    res.push(['Dung tích trữ', '120.000 m3']);
    res.push(['Cấp công trình', 'Cấp III']);
  } else {
    res.push(['Quy mô công trình', rec.quy_mo || rec.dai_km || rec.chieu_dai || 'Đang cập nhật']);
    res.push(['Năm xây dựng', rec.nam_xd || '2021']);
    res.push(['Kết cấu chính', 'Bê tông cốt thép']);
    res.push(['Nguồn vốn', 'Ngân sách Thành phố']);
  }
  return res;
}

function getAssessments(rec, type) {
  const st = rec.hien_trang || rec.trang_thai || 'Bình thường';
  if (st === 'Tốt' || st === 'Đảm bảo') {
    return [
      ['Thân đê / Cống', '✅ Kết cấu ổn định, không nứt'],
      ['Hệ thống tự động', '✅ Hoạt động chính xác'],
      ['Khả năng thoát lũ', '✅ Đảm bảo 100%'],
      ['Môi trường', '✅ Sạch sẽ, không bồi lắng'],
    ];
  }
  return [
    ['Thân đê / Cống', '⚠ Có dấu hiệu xuống cấp nhẹ'],
    ['Hệ thống tự động', '✅ Hoạt động tốt'],
    ['Khả năng thoát lũ', '⚠ Giảm 15% do bồi lắng'],
    ['Môi trường', '⚠ Cần nạo vét rác thải'],
  ];
}
