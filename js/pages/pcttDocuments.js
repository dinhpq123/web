// ── HADIWA IOC — PCTT DOCUMENTS + PA/KH PCTT (VĂN BẢN & QUYỪ TẠNH) ------

// ── Mock data: Phương án / Kế hoạch PCTT các cấp ─────────────────────
const PAKH_DATA = [
  // Cấp Thành phố
  { id:'PA-TP-2026', title:'Phương án ƯĐPCTT và TKCN năm 2026 — Thành phố Hà Nội', type:'Phương án', level:'city', year:2026, issuer:'UBND TP Hà Nội', qdNum:'QD-14/2026', qdDate:'20/01/2026', access:'public', size:'8.4 MB', summary:'Phương án tổng thể tình huống, lực lượng, phương tiện đối phó thiên tai toàn TP.' },
  { id:'KH-TP-2026', title:'Kế hoạch PCTT năm 2026 — sở NN&PTNT Hà Nội', type:'Kế hoạch', level:'city', year:2026, issuer:'Sở NN&PTNT', qdNum:'KH-12/SNN', qdDate:'15/02/2026', access:'public', size:'4.1 MB', summary:'Kế hoạch phân bổ nguồn lực, phân công trách nhiệm chỉ đạo PCTT toàn TP.' },
  { id:'PA-TP-2025', title:'Phương án ƯĐPCTT và TKCN năm 2025 — Thành phố Hà Nội', type:'Phương án', level:'city', year:2025, issuer:'UBND TP Hà Nội', qdNum:'QD-18/2025', qdDate:'25/01/2025', access:'public', size:'7.8 MB', summary:'Phương án năm 2025.' },
  // Cấp Quận / Huyện
  { id:'PA-BV-2026', title:'Phương án PCTT huyện Ba Vì năm 2026', type:'Phương án', level:'district', year:2026, issuer:'UBND H. Ba Vì', qdNum:'QD-08/UBND', qdDate:'10/02/2026', access:'public', size:'3.2 MB', summary:'Phương án hồ Suối Hai, Tuy Lai và đê sông Đà.' },
  { id:'PA-MY-2026', title:'Phương án PCTT huyện Mỹ Đức năm 2026', type:'Phương án', level:'district', year:2026, issuer:'UBND H. Mỹ Đức', qdNum:'QD-06/UBND', qdDate:'12/02/2026', access:'public', size:'2.7 MB', summary:'Phương án về hồ Quan Sơn, vuông nguy cơ ngập.' },
  { id:'KH-PT-2026', title:'Kế hoạch PCTT huyện Phúc Thọ năm 2026', type:'Kế hoạch', level:'district', year:2026, issuer:'UBND H. Phúc Thọ', qdNum:'KH-05/UBND', qdDate:'08/02/2026', access:'internal', size:'2.1 MB', summary:'Kế hoạch hàng năm, phân công ƯCSC cấp huyện.' },
  { id:'PA-CM-2026', title:'Phương án PCTT huyện Chương Mỹ năm 2026', type:'Phương án', level:'district', year:2026, issuer:'UBND H. Chương Mỹ', qdNum:'QD-09/UBND', qdDate:'14/02/2026', access:'public', size:'2.9 MB', summary:'Vùng nguy cơ lũ hòa Bình, Sông Bùi.' },
  // Cấp Xã
  { id:'PA-VT-XA-2026', title:'Phương án PCTT xã Vĩnh Tường năm 2026', type:'Phương án', level:'commune', year:2026, issuer:'UBND xã Vĩnh Tường', qdNum:'QD-02/UBND', qdDate:'20/02/2026', access:'public', size:'1.1 MB', summary:'Phương án 4 tại chỗ cấp xã.' },
  { id:'PA-XT-XA-2026', title:'Phương án PCTT xã Xuân Phú năm 2026', type:'Phương án', level:'commune', year:2026, issuer:'UBND xã Xuân Phú', qdNum:'QD-03/UBND', qdDate:'22/02/2026', access:'public', size:'980 KB', summary:'Phương án phòng, chống lũ, út cấp xã.' },
  { id:'PA-DP-XA-2026', title:'Phương án PCTT xã Đại Nghĩa năm 2026', type:'Phương án', level:'commune', year:2026, issuer:'UBND xã Đại Nghĩa', qdNum:'QD-01/UBND', qdDate:'18/02/2026', access:'public', size:'890 KB', summary:'Phương án khu vực ven hồ Quan Sơn.' },
  { id:'KH-BV-XA-2026', title:'Kế hoạch PCTT xã Ba Vì năm 2026', type:'Kế hoạch', level:'commune', year:2026, issuer:'UBND xã Ba Vì', qdNum:'KH-01/UBND', qdDate:'25/02/2026', access:'internal', size:'760 KB', summary:'Kế hoạch di dời dân hạ du hồ Suối Hai.' },
];

const PCTT_DOCS = [
  { id: 'QD-14/2026', title: 'Quyết định ban hành phương án ứng phó thiên tai và TKCN năm 2026', type: 'Quyết định', issuer: 'UBND Thành phố Hà Nội', date: '20/01/2026', category: 'Kế hoạch PCTT', size: '2.4 MB' },
  { id: 'CV-523/SNN', title: 'Công văn tăng cường kiểm tra, xử lý các trọng điểm đê điều xung yếu trước mùa lũ', type: 'Công văn', issuer: 'Sở NN&PTNT Hà Nội', date: '05/03/2026', category: 'Chỉ đạo điều hành', size: '450 KB' },
  { id: 'KH-12/CC', title: 'Kế hoạch diễn tập PCTT và hỗ trợ cộng đồng tại hồ chứa Suối Hai năm 2026', type: 'Kế hoạch', issuer: 'Chi cục Thủy lợi Hà Nội', date: '10/02/2026', category: 'Diễn tập', size: '1.1 MB' },
  { id: 'TT-04/2023', title: 'Thông tư hướng dẫn quản lý, sử dụng và thanh quyết toán Quỹ PCTT cấp tỉnh', type: 'Thông tư', issuer: 'Bộ NN&PTNT', date: '15/12/2023', category: 'Pháp luật', size: '890 KB' },
  { id: 'BC-01/2026', title: 'Báo cáo tổng kết công tác Phòng, chống thiên tai và TKCN năm 2025', type: 'Báo cáo', issuer: 'Chi cục Thủy lợi Hà Nội', date: '05/01/2026', category: 'Báo cáo YTD', size: '5.2 MB' },
  { id: 'NQ-46/HN', title: 'Nghị quyết về tăng cường công tác PCTT giai đoạn 2025-2030', type: 'Nghị quyết', issuer: 'HĐND Thành phố', date: '30/06/2025', category: 'Pháp luật', size: '760 KB' },
  { id: 'CV-88/CC', title: 'Công văn cảnh báo nguy cơ sạt lở, lũ quét tại các huyện phía Tây Hà Nội', type: 'Công văn', issuer: 'Chi cục Thủy lợi Hà Nội', date: '10/03/2026', category: 'Chỉ đạo điều hành', size: '320 KB' },
];

let _docFilter = '';
let _docCategory = '';
let _docsTab = 'vanbans';
let _pakhLevel = 'city';
let _pakhYear  = 2026;

function renderPcttDocuments() {
  const filtered = PCTT_DOCS.filter(d => {
    const q = _docFilter.toLowerCase();
    const matchText = !q || d.title.toLowerCase().includes(q) || d.id.toLowerCase().includes(q);
    const matchCat = !_docCategory || d.category === _docCategory;
    return matchText && matchCat;
  });

  const typeColors = { 'Quyết định': 'badge-gray', 'Công văn': 'badge-gray', 'Kế hoạch': 'badge-gray', 'Thông tư': 'badge-gray', 'Báo cáo': 'badge-gray', 'Nghị quyết': 'badge-gray' };
  const categories = [...new Set(PCTT_DOCS.map(d => d.category))];

  return `
  <div class="page-header">
    <div class="page-title">
      <h1>Văn bản &amp; Quyết định PCTT</h1>
      <p>Kho ${PCTT_DOCS.length} văn bản quy phạm · ${PAKH_DATA.length} Phương án/Kế hoạch PCTT các cấp</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-primary btn-sm" onclick="openUploadDocModal()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        Tải lên văn bản
      </button>
    </div>
  </div>

  <div class="tabs" style="margin-bottom:16px">
    <button class="tab-btn ${_docsTab==='vanbans'?'active':''}" onclick="switchDocsTab('vanbans')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      Văn bản &amp; QĐ PCTT (${PCTT_DOCS.length})
    </button>
    <button class="tab-btn ${_docsTab==='pakh'?'active':''}" onclick="switchDocsTab('pakh')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      PA/KH PCTT (${PAKH_DATA.length})
    </button>
  </div>

  <div id="docsTabContent">${_docsTab==='pakh'?_renderPakhTab():_renderVanbanTab(filtered,categories,typeColors)}</div>`;
}

function _renderVanbanTab(filtered, categories, typeColors) {
  return `
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px">
    ${['Kế hoạch PCTT', 'Chỉ đạo điều hành', 'Pháp luật'].map(cat => {
      const docs = PCTT_DOCS.filter(d => d.category === cat);
      const latest = docs[0];
      return `
      <div class="card" style="padding:16px;cursor:pointer" onclick="window._docCategory='${cat}';window.rerenderDocsPage()">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <span style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase">${cat}</span>
          <span class="badge badge-blue" style="font-size:10px">${docs.length} VB</span>
        </div>
        <div style="font-size:12px;font-weight:600;line-height:1.4;margin-bottom:8px">${latest?.title.substring(0,65)}...</div>
        <span style="font-size:11px;color:var(--muted)">${latest?.date || '—'} · ${latest?.issuer || ''}</span>
      </div>`;
    }).join('')}
  </div>

  <div class="card" style="margin-bottom:14px;padding:12px 16px">
    <div style="display:flex;gap:10px;align-items:center">
      <div style="position:relative;flex:1">
        <input type="text" class="form-control" placeholder="Tìm kiếm theo tiêu đề, số hiệu..." style="padding-left:34px" value="${_docFilter}" oninput="window._docFilter=this.value;window.rerenderDocsPage()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2" style="position:absolute;left:11px;top:12px"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </div>
      <select class="form-control" style="width:190px" onchange="window._docCategory=this.value;window.rerenderDocsPage()">
        <option value="">Tất cả danh mục</option>
        ${categories.map(c => `<option value="${c}" ${_docCategory===c?'selected':''}>${c}</option>`).join('')}
      </select>
      ${(_docFilter || _docCategory) ? `<button class="btn btn-ghost btn-sm" onclick="window._docFilter='';window._docCategory='';window.rerenderDocsPage()">Xóa lọc</button>` : ''}
    </div>
  </div>

  <div class="card" style="padding:0">
    <div class="card-header">
      <span class="card-title">Danh sách văn bản (${filtered.length}/${PCTT_DOCS.length})</span>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Số hiệu</th><th>Tiêu đề văn bản</th><th>Loại</th><th>Cơ quan ban hành</th><th>Ngày</th><th>Danh mục</th><th>Size</th><th></th></tr></thead>
        <tbody>
          ${filtered.length === 0
            ? `<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--muted)">Không tìm thấy văn bản phù hợp</td></tr>`
            : filtered.map(d => `
          <tr>
            <td class="mono" style="color:var(--primary);font-size:12px;white-space:nowrap">${d.id}</td>
            <td style="max-width:300px"><span style="font-size:13px;font-weight:600">${d.title}</span></td>
            <td><span class="badge ${typeColors[d.type]||'badge-gray'}" style="font-size:10px">${d.type}</span></td>
            <td style="font-size:12px;color:var(--muted)">${d.issuer}</td>
            <td style="font-size:12px;white-space:nowrap">${d.date}</td>
            <td><span class="badge badge-gray" style="font-size:10px">${d.category}</span></td>
            <td style="font-size:11px;color:var(--muted)">${d.size}</td>
            <td>
              <div style="display:flex;gap:4px">
                <button class="btn btn-ghost btn-sm" title="Xem trực tuyến" onclick="viewDocDetail('${d.id}')">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button class="btn btn-ghost btn-sm" title="Tải về" onclick="showToast('Đang tải ${d.id}...')">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function _renderPakhTab() {
  const levelLabels = {city:'Thành phố', district:'Quận / Huyện', commune:'Cấp Xã'};
  const filteredPakh = PAKH_DATA.filter(p => p.level === _pakhLevel && p.year === _pakhYear);
  return `
  <div style="display:flex;gap:10px;align-items:center;margin-bottom:16px;flex-wrap:wrap">
    <div class="ui-segmented" style="margin:0">
      ${['city','district','commune'].map(lvl=>`
      <button class="ui-segmented__item ${_pakhLevel===lvl?'active':''}" onclick="window._pakhLevel='${lvl}';window.rerenderDocsPage()">${levelLabels[lvl]}</button>`).join('')}
    </div>
    <select class="form-control" style="width:120px" onchange="window._pakhYear=+this.value;window.rerenderDocsPage()">
      ${[2026,2025,2024].map(y=>`<option value="${y}" ${_pakhYear===y?'selected':''}>${y}</option>`).join('')}
    </select>
    <span style="font-size:12px;color:var(--muted)">${filteredPakh.length} tài liệu</span>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:12px">
    ${filteredPakh.length ? filteredPakh.map(p=>`
    <div class="card" style="padding:16px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:700;line-height:1.4;margin-bottom:5px">${p.title}</div>
          <div style="font-size:11px;color:var(--muted)">${p.issuer} · ${p.qdDate}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end;flex-shrink:0;margin-left:10px">
          <span class="badge badge-gray" style="font-size:10px">${p.type}</span>
          <span class="badge ${p.access==='public'?'badge-green':'badge-gray'}" style="font-size:10px">${p.access==='public'?'Công khai':'Nội bộ'}</span>
        </div>
      </div>
      <div style="font-size:12px;color:rgba(255,255,255,.55);line-height:1.5;margin-bottom:10px">${p.summary}</div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span class="mono" style="font-size:11px;color:var(--primary)">${p.qdNum}</span>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" onclick="showToast('Xem ${p.qdNum}...')">Xem</button>
          <button class="btn btn-ghost btn-sm" onclick="showToast('Tải ${p.id}.pdf...')">Tải PDF</button>
        </div>
      </div>
    </div>`).join('') : `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted)">Chưa có tài liệu cho cấp và năm đã chọn</div>`}
  </div>`;
}

window.switchDocsTab = function(tab) {
  _docsTab = tab;
  const area = document.getElementById('docsTabContent');
  const filtered = PCTT_DOCS.filter(d => {
    const q = _docFilter.toLowerCase();
    return (!q || d.title.toLowerCase().includes(q) || d.id.toLowerCase().includes(q)) && (!_docCategory || d.category === _docCategory);
  });
  const typeColors = { 'Quyết định': 'badge-gray', 'Công văn': 'badge-gray', 'Kế hoạch': 'badge-gray', 'Thông tư': 'badge-gray', 'Báo cáo': 'badge-gray', 'Nghị quyết': 'badge-gray' };
  const categories = [...new Set(PCTT_DOCS.map(d => d.category))];
  if (area) area.innerHTML = tab==='pakh' ? _renderPakhTab() : _renderVanbanTab(filtered,categories,typeColors);
  // Fix: match by onclick attribute which contains the tab key
  document.querySelectorAll('.tabs .tab-btn').forEach(b => {
    const onclickAttr = b.getAttribute('onclick') || '';
    b.classList.toggle('active', onclickAttr.includes(`'${tab}'`));
  });
};


window.rerenderDocsPage = function() {
  const sel = ['#page-content','#main-content','.page-main','#content'].find(s=>document.querySelector(s));
  if (sel) document.querySelector(sel).innerHTML = renderPcttDocuments();
};

window.viewDocDetail = function(id) {
  const d = PCTT_DOCS.find(x => x.id === id);
  if (!d) return;
  openModal(`
  <div class="modal-header">
    <span class="modal-title">${d.id}</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body">
    <h2 style="font-size:15px;line-height:1.5;margin-bottom:12px">${d.title}</h2>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
      <span class="badge badge-blue">${d.type}</span><span class="badge badge-gray">${d.category}</span>
      <span style="font-size:11px;color:var(--muted)">${d.date} · ${d.issuer} · ${d.size}</span>
    </div>
    <div style="height:360px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px">
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      <div style="text-align:center">
        <div style="font-size:13px;font-weight:600;margin-bottom:5px">Xem trực tuyến</div>
        <div style="font-size:11px;color:var(--muted)">Kết nối máy chủ tài liệu để xuất hiện bản xem PDF</div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="showToast('Đang tải ${d.id}.pdf...')">Tải về PDF (${d.size})</button>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-ghost btn-sm" onclick="showToast('Đã sao chép link!')">Chia sẻ</button>
  </div>`);
};

window.openUploadDocModal = function() {
  openModal(`
  <div class="modal-header">
    <span class="modal-title">Tải lên văn bản PCTT</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body">
    <div style="border:2px dashed rgba(0,200,255,.3);border-radius:10px;padding:28px;text-align:center;margin-bottom:16px;background:rgba(0,200,255,.03);cursor:pointer" onclick="showToast('Chọn file PDF...')">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" style="margin-bottom:8px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      <div style="font-size:13px;font-weight:600;color:var(--primary)">Kéo thả file hoặc click để chọn</div>
      <div style="font-size:11px;color:var(--muted);margin-top:5px">PDF, DOCX, XLSX (tối đa 50MB)</div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Số hiệu văn bản</label><input class="form-control" placeholder="VD: QD-25/2026"></div>
      <div class="form-group"><label class="form-label">Loại văn bản</label><select class="form-control"><option>Quyết định</option><option>Công văn</option><option>Kế hoạch</option><option>Thông tư</option><option>Nghị quyết</option><option>Báo cáo</option></select></div>
    </div>
    <div class="form-group"><label class="form-label">Tiêu đề văn bản</label><input class="form-control" placeholder="Tiêu đề đầy đủ của văn bản"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Cơ quan ban hành</label><input class="form-control" placeholder="VD: UBND Thành phố Hà Nội"></div>
      <div class="form-group"><label class="form-label">Danh mục</label><select class="form-control"><option>Kế hoạch PCTT</option><option>Chỉ đạo điều hành</option><option>Pháp luật</option><option>Diễn tập</option><option>Báo cáo YTD</option></select></div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('✅ Đã tải lên văn bản thành công!')">Tải lên &amp; Lưu</button>
  </div>`);
};
