// ── PCTT MEDIA PAGE ────────────────────────────────────────────────
const MEDIA_ITEMS_ALL = [
  { id:'M01', title:'Hướng dẫn chuẩn bị 4 tại chỗ cho hộ gia đình', type:'Video', author:'Chi cục Thủy lợi', views:'12.5k', date:'10/03/2026', duration:'8:24', tags:['4 tại chỗ','gia đình'], featured:true },
  { id:'M02', title:'Danh mục vật tư xung yếu cần dự trữ mùa lũ 2026', type:'Tài liệu', author:'Phòng PCTT', views:'8.2k', date:'08/03/2026', duration:'15 trang', tags:['vật tư','dự trữ'], featured:false },
  { id:'M03', title:'Bản đồ điểm sơ tán dân tại huyện Chương Mỹ và Mỹ Đức', type:'Bản đồ', author:'Trung tâm KTTV', views:'25.1k', date:'05/03/2026', duration:'Tương tác', tags:['sơ tán','Chương Mỹ'], featured:true },
  { id:'M04', title:'Phim tư liệu: 50 năm truyền thống đê điều Hà Nội', type:'Phim', author:'Sở NN&PTNT', views:'5.4k', date:'01/03/2026', duration:'22:15', tags:['lịch sử','đê điều'], featured:false },
  { id:'M05', title:'Infographic: Quy trình vận hành cống tiêu trong mùa lũ', type:'Infographic', author:'Chi cục Thủy lợi', views:'18.9k', date:'28/02/2026', duration:'1 trang', tags:['cống','vận hành'], featured:false },
  { id:'M06', title:'Cẩm nang ứng phó bão dành cho cán bộ PCTT cơ sở', type:'Tài liệu', author:'Ban chỉ đạo PCTT', views:'31.4k', date:'25/02/2026', duration:'48 trang', tags:['bão','cán bộ'], featured:true },
  { id:'M07', title:'Video hướng dẫn kỹ thuật cắm cọc, gia cố mặt đê khẩn cấp', type:'Video', author:'Phòng Kỹ thuật', views:'9.7k', date:'20/02/2026', duration:'12:38', tags:['kỹ thuật','gia cố đê'], featured:false },
  { id:'M08', title:'Bộ câu hỏi - Đáp về Luật Phòng, chống thiên tai 2013 (sửa đổi 2020)', type:'Tài liệu', author:'Bộ NN&PTNT', views:'7.3k', date:'15/02/2026', duration:'28 trang', tags:['pháp luật','kiến thức'], featured:false },
  { id:'M09', title:'Bản đồ nguy cơ ngập lụt lưu vực sông Nhuệ - Đáy', type:'Bản đồ', author:'Viện Quy hoạch Thủy lợi', views:'14.6k', date:'12/02/2026', duration:'GIS Layer', tags:['ngập lụt','sông Đáy'], featured:false },
  { id:'M10', title:'Hướng dẫn sơ cấp cứu trong thiên tai – Video thực hành', type:'Video', author:'Hội Chữ thập đỏ HN', views:'22.0k', date:'10/02/2026', duration:'15:42', tags:['sơ cấp cứu','y tế'], featured:false },
  { id:'M11', title:'Infographic: Dấu hiệu nhận biết đê bị thẩm lậu, sạt lở', type:'Infographic', author:'Phòng Quản lý Đê điều', views:'16.8k', date:'05/02/2026', duration:'2 trang', tags:['đê điều','nhận biết'], featured:false },
  { id:'M12', title:'Kế hoạch PCTT tỉnh/thành phố 2026 – Tài liệu tổng hợp', type:'Tài liệu', author:'Chi cục Thủy lợi', views:'4.1k', date:'01/02/2026', duration:'120 trang', tags:['kế hoạch','2026'], featured:false },
];

const MEDIA_TYPE_ICONS = {
  'Video':'<polygon points="5 3 19 12 5 21 5 3"/>',
  'Phim':'<polygon points="5 3 19 12 5 21 5 3"/>',
  'Tài liệu':'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  'Bản đồ':'<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
  'Infographic':'<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>',
};
const MEDIA_TYPE_COLOR = {
  'Video':'var(--danger)','Phim':'var(--danger)','Tài liệu':'var(--primary)','Bản đồ':'var(--success)','Infographic':'var(--warning)',
};

let _mediaState = { filter:'', typeFilter:'all', sort:'date', view:'grid', page:1 };
const _MEDIA_PER_PAGE = 6;

function _mediaFiltered() {
  let items = MEDIA_ITEMS_ALL.slice();
  if (_mediaState.typeFilter !== 'all') items = items.filter(m => m.type === _mediaState.typeFilter);
  if (_mediaState.filter) {
    const q = _mediaState.filter.toLowerCase();
    items = items.filter(m => m.title.toLowerCase().includes(q) || m.tags.some(t => t.toLowerCase().includes(q)) || m.author.toLowerCase().includes(q));
  }
  if (_mediaState.sort === 'views') items.sort((a,b) => parseFloat(b.views)-parseFloat(a.views));
  else if (_mediaState.sort === 'title') items.sort((a,b) => a.title.localeCompare(b.title));
  else items.sort((a,b) => b.date.localeCompare(a.date));
  return items;
}

function renderPcttMedia() {
  const all = _mediaFiltered();
  const totalPages = Math.max(1, Math.ceil(all.length / _MEDIA_PER_PAGE));
  _mediaState.page = Math.min(_mediaState.page, totalPages);
  const paged = all.slice((_mediaState.page-1)*_MEDIA_PER_PAGE, _mediaState.page*_MEDIA_PER_PAGE);
  const totalViews = MEDIA_ITEMS_ALL.reduce((s,m) => s + parseFloat(m.views), 0);

  const gridItems = paged.map(item => {
    const iconPath = MEDIA_TYPE_ICONS[item.type] || MEDIA_TYPE_ICONS['Tài liệu'];
    const color = MEDIA_TYPE_COLOR[item.type] || 'var(--primary)';
    const isVideo = item.type === 'Video' || item.type === 'Phim';
    const rgba = color.replace('var(','rgba(').replace(')','');
    return `
    <div class="card" style="padding:0;overflow:hidden;cursor:pointer;transition:transform .2s,border-color .2s;${item.featured?'border-color:rgba(0,200,255,.3)':''}"
      onmouseover="this.style.transform='translateY(-3px)';this.style.borderColor='rgba(0,200,255,.35)'"
      onmouseout="this.style.transform='';this.style.borderColor='${item.featured?'rgba(0,200,255,.3)':'var(--border)'}'"
      onclick="openMediaDetail('${item.id}')">
      <div style="height:140px;background:linear-gradient(135deg,${rgba},.08),rgba(0,0,0,.2));border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:center;position:relative">
        ${item.featured ? '<div style="position:absolute;top:8px;left:10px;background:rgba(0,200,255,.2);border:1px solid rgba(0,200,255,.35);border-radius:4px;padding:2px 7px;font-size:9px;color:var(--primary);font-weight:700">⭐ NỔI BẬT</div>' : ''}
        <div style="width:48px;height:48px;border-radius:12px;background:${rgba},.15);border:1px solid ${rgba},.3);display:flex;align-items:center;justify-content:center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8">${iconPath}</svg>
        </div>
        <div style="position:absolute;bottom:8px;right:10px">
          <span style="font-size:10px;color:${color};background:${rgba},.1);border:1px solid ${rgba},.25);border-radius:4px;padding:2px 7px;font-weight:600">${item.duration}</span>
        </div>
      </div>
      <div style="padding:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span class="badge badge-gray" style="font-size:10px;text-transform:uppercase">${item.type}</span>
          <span style="font-size:10px;color:var(--muted)">${item.date}</span>
        </div>
        <h3 style="font-size:12px;font-weight:700;margin-bottom:8px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${item.title}</h3>
        <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border);padding-top:8px">
          <span style="font-size:10px;color:var(--muted)">${item.author}</span>
          <div style="display:flex;align-items:center;gap:4px;font-size:10px;color:var(--muted)">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            ${item.views}
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  const listItems = paged.map(item => {
    const color = MEDIA_TYPE_COLOR[item.type] || 'var(--primary)';
    const rgba = color.replace('var(','rgba(').replace(')','');
    const iconPath = MEDIA_TYPE_ICONS[item.type] || MEDIA_TYPE_ICONS['Tài liệu'];
    return `
    <div style="display:flex;align-items:center;gap:14px;padding:12px 16px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .15s"
      onmouseover="this.style.background='rgba(255,255,255,.02)'" onmouseout="this.style.background=''" onclick="openMediaDetail('${item.id}')">
      <div style="width:40px;height:40px;border-radius:10px;background:${rgba},.12);border:1px solid ${rgba},.25);display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8">${iconPath}</svg>
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${item.title}</div>
        <div style="font-size:11px;color:var(--muted);margin-top:2px">${item.author} · ${item.date}</div>
      </div>
      <span class="badge badge-gray" style="font-size:10px;flex-shrink:0">${item.type}</span>
      <span style="font-size:11px;color:var(--muted);flex-shrink:0;min-width:50px;text-align:right">${item.views} xem</span>
      <span style="font-size:11px;color:var(--muted);flex-shrink:0">${item.duration}</span>
      <button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();openMediaDetail('${item.id}')">Xem</button>
    </div>`;
  }).join('');

  const paginationBtns = Array.from({length:totalPages},(_,i) => i+1).map(p =>
    `<button class="pagination-page ${p===_mediaState.page?'active':''}" onclick="window._mediaGoPage(${p})">${p}</button>`
  ).join('');

  return `
  <div class="page-header">
    <div class="page-title">
      <h1>Truyền thông PCTT</h1>
      <p>Cổng thông tin tuyên truyền, hướng dẫn và phổ cập kiến thức phòng chống thiên tai</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-ghost btn-sm" onclick="openAiContentModal()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        Tạo nội dung AI
      </button>
      <button class="btn btn-primary btn-sm" onclick="openAddMediaModal()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Thêm tài liệu
      </button>
    </div>
  </div>

  <!-- Tab navigation -->
  <div class="tabs" style="margin-bottom:16px">
    ${[
      { id: 'library', label: 'Kho tài liệu', iconPath: '<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>' },
      { id: 'social',  label: 'Mạng xã hội',  iconPath: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>' },
      { id: 'tts',     label: 'Phát thanh TTS', iconPath: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M15.54 8.46a5 5 0 010 7.07"/>' },
    ].filter(t => typeof isTabVisible === 'function' ? isTabVisible('pcttMedia', t.id) : true)
     .map((t, i) => `
    <button class="tab-btn ${i === 0 ? 'active' : ''}" id="mediaTab${t.id.charAt(0).toUpperCase()+t.id.slice(1)}" onclick="switchMediaMainTab('${t.id}',this)">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px">${t.iconPath}</svg>
      ${t.label}
    </button>`).join('')}
  </div>
  <div id="mediaMainContent">

  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px">
    ${[
      {l:'Tổng lượt xem', v:totalViews.toFixed(1)+'k', c:'var(--primary)'},
      {l:'Tài liệu', v:MEDIA_ITEMS_ALL.filter(m=>m.type==='Tài liệu').length, c:'var(--primary)'},
      {l:'Video / Phim', v:MEDIA_ITEMS_ALL.filter(m=>m.type==='Video'||m.type==='Phim').length, c:'var(--danger)'},
      {l:'Bản đồ & Infographic', v:MEDIA_ITEMS_ALL.filter(m=>m.type==='Bản đồ'||m.type==='Infographic').length, c:'var(--success)'},
    ].map(s=>`<div class="card kpi-card" style="border-top:2px solid ${s.c}"><div class="kpi-label">${s.l}</div><div class="kpi-value" style="color:${s.c}">${s.v}</div></div>`).join('')}
  </div>

  <!-- Filters & toolbar -->
  <div style="display:flex;gap:10px;align-items:center;margin-bottom:16px;flex-wrap:wrap">
    <div style="position:relative;flex:1;min-width:200px;max-width:360px">
      <input type="text" class="form-control" placeholder="Tìm theo tiêu đề, từ khoá..." style="padding-left:34px" value="${_mediaState.filter}"
        oninput="window._mediaQ=this.value;clearTimeout(window._mediaDeb);window._mediaDeb=setTimeout(()=>{window._mediaState.filter=window._mediaQ;window._mediaState.page=1;window._rerenderMedia()},250)">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2" style="position:absolute;left:11px;top:13px"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    </div>
    ${['all','Video','Tài liệu','Bản đồ','Infographic'].map(t=>`
    <button class="btn btn-${_mediaState.typeFilter===t?'outline':'ghost'} btn-sm" style="font-size:11px${_mediaState.typeFilter===t?';color:var(--primary)':''}" onclick="window._mediaState.typeFilter='${t}';window._mediaState.page=1;window._rerenderMedia()">${t==='all'?'Tất cả':t}</button>`).join('')}
    <div style="margin-left:auto;display:flex;align-items:center;gap:8px">
      <select class="form-control" style="width:140px;font-size:12px" onchange="window._mediaState.sort=this.value;window._rerenderMedia()">
        <option value="date" ${_mediaState.sort==='date'?'selected':''}>Mới nhất</option>
        <option value="views" ${_mediaState.sort==='views'?'selected':''}>Lượt xem</option>
        <option value="title" ${_mediaState.sort==='title'?'selected':''}>A-Z tiêu đề</option>
      </select>
      <div class="ui-segmented" aria-label="Kiểu hiển thị tài liệu">
        <button class="ui-segmented__item btn-icon ${_mediaState.view==='grid'?'active':''}" title="Lưới" aria-label="Hiển thị dạng lưới" onclick="window._mediaState.view='grid';window._rerenderMedia()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        </button>
        <button class="ui-segmented__item btn-icon ${_mediaState.view==='list'?'active':''}" title="Danh sách" aria-label="Hiển thị dạng danh sách" onclick="window._mediaState.view='list';window._rerenderMedia()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Result count -->
  <div style="font-size:11px;color:var(--muted);margin-bottom:12px">
    Hiển thị ${Math.min((_mediaState.page-1)*_MEDIA_PER_PAGE+1, all.length)}–${Math.min(_mediaState.page*_MEDIA_PER_PAGE, all.length)} / ${all.length} tài liệu
  </div>

  <!-- Content -->
  ${all.length === 0 ? `<div style="text-align:center;padding:60px;color:var(--muted)">Không tìm thấy tài liệu phù hợp</div>` :
    _mediaState.view === 'grid'
      ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:16px">${gridItems}</div>`
      : `<div class="card" style="padding:0;overflow:hidden">${listItems}</div>`
  }

  <!-- Pagination -->
  ${totalPages > 1 ? `
  <div class="pagination-btns" style="justify-content:center;margin-top:20px">
    <button class="btn btn-ghost btn-sm" onclick="window._mediaGoPage(${_mediaState.page-1})" ${_mediaState.page<=1?'disabled':''}>← Trước</button>
    ${paginationBtns}
    <button class="btn btn-ghost btn-sm" onclick="window._mediaGoPage(${_mediaState.page+1})" ${_mediaState.page>=totalPages?'disabled':''}>Sau →</button>
  </div>` : ''}
  </div><!-- end mediaMainContent -->`;
}

let _mediaMainTab = 'library';
window.switchMediaMainTab = function(tab, btn) {
  _mediaMainTab = tab;
  document.querySelectorAll('#mediaTabLibrary,#mediaTabSocial,#mediaTabTts').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const cont = document.getElementById('mediaMainContent');
  if (!cont) return;
  if (tab === 'social') {
    cont.innerHTML = renderSocialMedia();
  } else if (tab === 'tts') {
    cont.innerHTML = renderTtsStudio();
  } else {
    window._rerenderMedia();
  }
};

// Expose state & helpers to window

window._mediaState = _mediaState;
window._rerenderMedia = function() {
  const sel = ['#contentArea .fade-in','#contentArea'].find(s=>document.querySelector(s));
  if (sel) { const el = document.querySelector(sel); if(el) el.innerHTML = renderPcttMedia(); }
};
window._mediaGoPage = function(p) {
  const all = window._mediaFiltered ? window._mediaFiltered() : _mediaFiltered();
  const total = Math.max(1, Math.ceil(all.length / _MEDIA_PER_PAGE));
  _mediaState.page = Math.max(1, Math.min(p, total));
  window._rerenderMedia();
};
window._mediaFiltered = _mediaFiltered;

window.openMediaDetail = function(id) {
  const item = MEDIA_ITEMS_ALL.find(m => m.id === id); if (!item) return;
  const isVideo = item.type === 'Video' || item.type === 'Phim';
  const color = MEDIA_TYPE_COLOR[item.type] || 'var(--primary)';
  const rgba = color.replace('var(','rgba(').replace(')','');
  const iconPath = MEDIA_TYPE_ICONS[item.type] || MEDIA_TYPE_ICONS['Tài liệu'];
  openModal(`
  <div class="modal-header">
    <span class="modal-title">${item.type}: ${item.title.substring(0,55)}…</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body" style="max-height:80vh;overflow-y:auto">
    <div style="height:260px;background:linear-gradient(135deg,${rgba},.06),rgba(0,0,0,.15));border:1px solid var(--border);border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;margin-bottom:16px">
      ${isVideo
        ? `<div style="width:64px;height:64px;border-radius:50%;background:rgba(0,0,0,.4);border:2px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;cursor:pointer" onclick="showToast('Đang phát video...')">
             <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><polygon points="5 3 19 12 5 21 5 3"/></svg>
           </div>
           <div style="text-align:center"><div style="font-size:13px;font-weight:600">Phát video</div><div style="font-size:11px;color:var(--muted);margin-top:3px">Thời lượng: ${item.duration}</div></div>`
        : `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.2">${iconPath}</svg>
           <div style="text-align:center"><div style="font-size:13px;font-weight:600">${item.type}</div><div style="font-size:11px;color:var(--muted);margin-top:3px">${item.duration}</div></div>
           <button class="btn btn-primary btn-sm" onclick="showToast('Đang mở tài liệu...')">Mở tài liệu</button>`}
    </div>
    <h2 style="font-size:15px;font-weight:700;margin-bottom:10px;line-height:1.4">${item.title}</h2>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
      <span class="badge badge-gray">${item.type}</span>
      ${item.featured?'<span class="badge badge-blue">⭐ Nổi bật</span>':''}
      ${item.tags.map(t=>`<span class="badge badge-blue" style="font-size:10px">${t}</span>`).join('')}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      ${[{label:'Tác giả / Đơn vị',val:item.author},{label:'Ngày đăng',val:item.date},{label:'Lượt xem',val:item.views},{label:'Thời lượng / Số trang',val:item.duration}]
        .map(f=>`<div style="padding:10px 12px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px"><div style="font-size:10px;color:var(--muted);margin-bottom:3px">${f.label}</div><div style="font-size:13px;font-weight:600">${f.val}</div></div>`)
        .join('')}
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
    <button class="btn btn-ghost btn-sm" onclick="showToast('Đã sao chép link chia sẻ!')">Chia sẻ</button>
    <button class="btn btn-primary" onclick="showToast('Đang tải xuống ${item.id}...')">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Tải xuống
    </button>
  </div>`);
};

window.openAddMediaModal = function() {
  openModal(`
  <div class="modal-header">
    <span class="modal-title">Thêm tài liệu truyền thông</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body">
    <div style="border:2px dashed rgba(0,200,255,.3);border-radius:10px;padding:24px;text-align:center;margin-bottom:16px;cursor:pointer" onclick="showToast('Chọn file media...')">
      <div style="font-size:13px;font-weight:600;color:var(--primary)">Kéo thả hoặc click để chọn file</div>
      <div style="font-size:11px;color:var(--muted);margin-top:5px">MP4, PDF, DOCX, PNG (tối đa 100MB)</div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Tiêu đề</label><input class="form-control" placeholder="Tiêu đề tài liệu"></div>
      <div class="form-group"><label class="form-label">Loại</label><select class="form-control"><option>Video</option><option>Tài liệu</option><option>Bản đồ</option><option>Infographic</option><option>Phim</option></select></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Tác giả / Đơn vị</label><input class="form-control" placeholder="VD: Chi cục Thủy lợi"></div>
      <div class="form-group"><label class="form-label">Từ khoá</label><input class="form-control" placeholder="VD: sơ tán, lũ lụt..."></div>
    </div>
    <div class="form-group"><label class="form-label" style="display:flex;align-items:center;gap:6px"><input type="checkbox"> Đánh dấu là tài liệu nổi bật</label></div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('✅ Đã thêm tài liệu truyền thông!')">Thêm tài liệu</button>
  </div>`);
};

// AI Content Creation Modal
window.openAiContentModal = function() {
  openModal(`
  <div class="modal-header">
    <span class="modal-title" style="display:flex;align-items:center;gap:8px">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      Tạo nội dung truyền thông bằng AI
    </span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body">
    <!-- AI Banner -->
    <div style="background:linear-gradient(135deg,rgba(0,102,255,.12),rgba(0,200,255,.06));border:1px solid rgba(0,102,255,.25);border-radius:10px;padding:14px 18px;margin-bottom:18px;display:flex;gap:12px;align-items:flex-start">
      <div style="width:36px;height:36px;background:linear-gradient(135deg,#0050cc,#00c8ff);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      </div>
      <div>
        <div style="font-size:13px;font-weight:700;color:#e2e8f0;margin-bottom:3px">AI Tạo nội dung PCTT</div>
        <div style="font-size:12px;color:var(--muted);line-height:1.6">Nhập yêu cầu, AI sẽ tự động soạn thảo nội dung tuyên truyền, bài viết hướng dẫn, thông báo khẩn, infographic script... phù hợp với bối cảnh thiên tai Hà Nội.</div>
      </div>
    </div>
    <!-- Quick prompts -->
    <div style="font-size:11px;color:var(--muted);margin-bottom:8px;font-weight:600">Gợi ý nhanh:</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
      ${['Thông báo khẩn cấp lũ lụt','Hướng dẫn 4 tại chỗ cho dân','Nội dung mạng xã hội về bão','Script infographic phòng tránh lũ','Kịch bản video hướng dẫn ứng phó'].map(p=>
        `<button style="padding:5px 10px;border-radius:6px;border:1px solid rgba(0,200,255,.25);background:rgba(0,200,255,.06);color:var(--primary);font-size:11px;cursor:pointer;transition:.15s" onmouseover="this.style.background='rgba(0,200,255,.12)'" onmouseout="this.style.background='rgba(0,200,255,.06)'" onclick="document.getElementById('aiMediaPrompt').value='${p}'">${p}</button>`
      ).join('')}
    </div>
    <div class="form-row" style="margin-bottom:12px">
      <div class="form-group">
        <label class="form-label">Loại nội dung</label>
        <select class="form-control" id="aiMediaType">
          <option>Thông báo khẩn cấp</option>
          <option>Bài viết hướng dẫn</option>
          <option>Bài đăng mạng xã hội</option>
          <option>Script video thuyết minh</option>
          <option>Nội dung infographic</option>
          <option>Thông cáo báo chí</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Đối tượng</label>
        <select class="form-control" id="aiMediaAudience">
          <option>Người dân</option>
          <option>Cán bộ PCTT</option>
          <option>Học sinh – sinh viên</option>
          <option>Lãnh đạo địa phương</option>
        </select>
      </div>
    </div>
    <div class="form-group" style="margin-bottom:12px">
      <label class="form-label">Yêu cầu chi tiết</label>
      <textarea class="form-control" id="aiMediaPrompt" rows="4" placeholder="VD: Viết thông báo khẩn cho người dân vùng trũng thấp ven sông Đáy về nguy cơ lũ do mưa lớn kéo dài 3 ngày, mực nước đang tiệm cận BĐ2..."></textarea>
    </div>
    <div id="aiMediaOutput" style="display:none"></div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
    <button class="btn btn-primary" id="aiMediaGenBtn" onclick="runAiMediaGenerate()" style="background:linear-gradient(135deg,#0050cc,#00c8ff);border:none">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      Tạo nội dung
    </button>
  </div>`);
};

window.runAiMediaGenerate = function() {
  const prompt = document.getElementById('aiMediaPrompt')?.value;
  const type = document.getElementById('aiMediaType')?.value || 'Thông báo';
  const audience = document.getElementById('aiMediaAudience')?.value || 'Người dân';
  if (!prompt || prompt.trim().length < 5) { showToast('Vui lòng nhập yêu cầu chi tiết hơn!','error'); return; }
  const btn = document.getElementById('aiMediaGenBtn');
  if (btn) { btn.disabled = true; btn.textContent = '⟳ Đang tạo...'; }
  const out = document.getElementById('aiMediaOutput');
  if (out) { out.style.display='block'; out.innerHTML = `<div style="background:rgba(0,102,255,.06);border:1px solid rgba(0,102,255,.2);border-radius:10px;padding:16px;margin-top:8px"><div style="font-size:12px;color:rgba(96,165,250,.9);margin-bottom:10px;display:flex;align-items:center;gap:6px"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> AI đang soạn thảo nội dung...</div><div id="aiStreamText" style="font-size:13px;line-height:1.8;color:var(--text-2);white-space:pre-wrap"></div></div>`; }

  const SAMPLES = {
    'Thông báo khẩn cấp': `🔴 THÔNG BÁO KHẨN — PCTT HÀ NỘI\n\nKính gửi: Toàn thể người dân vùng ven sông Đáy, huyện Chương Mỹ, Mỹ Đức, Ứng Hòa\n\nDo ảnh hưởng của hoàn lưu bão số ${Math.floor(Math.random()*5+3)}, mưa lớn kéo dài từ đêm ngày ${new Date().getDate()}/${new Date().getMonth()+1}, mực nước sông Đáy tại trạm Ba Thá đang tiệm cận mức báo động 1 (${(3.8+Math.random()*0.5).toFixed(2)}m / BĐ1 = 4.5m).\n\n📋 KHUYẾN CÁO:\n• Di chuyển người già, trẻ em, người bệnh lên vị trí cao an toàn\n• Chuẩn bị lương thực, nước sạch, thuốc dự phòng cho 3 ngày\n• Không đi qua đường ngập nước sau mưa lớn\n• Liên hệ BCH PCTT xã/phường để được hỗ trợ\n\n📞 Đường dây nóng PCTT: 19001207 | UBND huyện: 024.33xxxxxx`,
    'Bài viết hướng dẫn': `HƯỚNG DẪN THỰC HIỆN "4 TẠI CHỖ" TRONG PHÒNG CHỐNG THIÊN TAI\n\n${type} dành cho ${audience}\n\nPhương châm "4 tại chỗ" là: Chỉ huy tại chỗ — Lực lượng tại chỗ — Phương tiện tại chỗ — Hậu cần tại chỗ.\n\n1. CHUẨN BỊ CÁ NHÂN & GIA ĐÌNH\n• Chuẩn bị túi khẩn cấp: nước uống 3L/người/ngày, thực phẩm khô 3 ngày, đèn pin, pin dự phòng, thuốc cơ bản\n• Xác định địa điểm sơ tán gần nhất và đường thoát hiểm\n• Lưu số điện thoại khẩn cấp: 113 (CA), 114 (PCCC), 115 (Cấp cứu)\n\n2. TRONG KHI THIÊN TAI XẢY RA\n• Theo dõi lệnh sơ tán của chính quyền địa phương\n• Tắt điện, ga trước khi rời khỏi nhà\n• Không bơi qua vùng nước lũ`,
    'Bài đăng mạng xã hội': `⚠️ [CẢNH BÁO PCTT HÀ NỘI] ⚠️\n\nMưa lớn đang xảy ra tại nhiều huyện phía Tây và Nam Hà Nội. Mực nước sông Đáy đang dâng cao.\n\n✅ Hãy:\n→ Không ra ngoài nếu không có việc cần thiết\n→ Tránh xa suối, hố nước, vùng trũng\n→ Chằng chống mái nhà, cây cối xung quanh\n\n❌ Đừng:\n→ Đi qua đường ngập nước\n→ Trú trong nhà yếu, cây cổ thụ\n→ Chủ quan với lũ ống, lũ quét\n\n📲 Theo dõi cập nhật tại: hadiwa.vn\n#PCTTHA Nội #ThienTai #AnToanMuaLu`,
  };
  const sample = SAMPLES[type] || SAMPLES['Thông báo khẩn cấp'];
  let i = 0;
  const el = document.getElementById('aiStreamText');
  const timer = setInterval(() => {
    if (!el || !document.getElementById('aiStreamText')) { clearInterval(timer); return; }
    i = Math.min(i + Math.floor(Math.random()*8+3), sample.length);
    el.textContent = sample.substring(0, i);
    if (i >= sample.length) {
      clearInterval(timer);
      if (btn) { btn.disabled = false; btn.textContent = 'Tạo lại'; }
      // Add copy + save buttons
      const parent = el.parentElement;
      if (parent && !document.getElementById('aiSaveBtn')) {
        parent.insertAdjacentHTML('beforeend', `
        <div style="display:flex;gap:8px;margin-top:12px;border-top:1px solid rgba(255,255,255,.08);padding-top:10px">
          <button onclick="navigator.clipboard?.writeText(document.getElementById('aiStreamText').textContent)||showToast('Đã sao chép!')" class="btn btn-ghost btn-sm"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Sao chép</button>
          <button id="aiSaveBtn" class="btn btn-primary btn-sm" onclick="closeModal();showToast('Đã lưu nội dung vào kho tài liệu!')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg> Lưu vào kho</button>
        </div>`);
      }
    }
  }, 30);
};

// ── SOCIAL MEDIA MANAGEMENT ───────────────────────────────────────────
function renderSocialMedia() {
  const ACCOUNTS = [
    { id: 'fb', name: 'Facebook Fanpage', handle: 'Chi cục TT-PCTT Hà Nội', followers: '28.4k', status: 'connected', color: '#1877f2', posts: 142, reach: '184k',
      icon: '<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>' },
    { id: 'zalo', name: 'Zalo Official Account', handle: '@pctt.hanoi', followers: '15.2k', status: 'connected', color: '#0068ff', posts: 98, reach: '92k',
      icon: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12h8M8 8h8M8 16h5"/>' },
    { id: 'yt', name: 'YouTube Channel', handle: 'PCTT Hà Nội Official', followers: '4.8k', status: 'connected', color: '#ff0000', posts: 56, reach: '62k',
      icon: '<path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>' },
    { id: 'tiktok', name: 'TikTok', handle: '@pctthanoi', followers: '12.1k', status: 'disconnected', color: '#010101', posts: 0, reach: '—',
      icon: '<path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/>' },
  ];

  const SCHEDULED = [
    { id: 'SC01', platform: 'fb', title: 'Cảnh báo mưa lớn ngày 15/03 – Huyện Chương Mỹ, Mỹ Đức', time: '15/03/2026 08:00', status: 'scheduled', type: 'alert' },
    { id: 'SC02', platform: 'fb,zalo', title: 'Hướng dẫn kiểm tra nhà cửa trước mùa mưa bão 2026', time: '14/03/2026 17:00', status: 'scheduled', type: 'guide' },
    { id: 'SC03', platform: 'yt', title: 'Video: Kỹ thuật cắm cọc gia cố mặt đê khẩn cấp (8 phút)', time: '13/03/2026 10:00', status: 'published', type: 'video' },
    { id: 'SC04', platform: 'fb,zalo,yt', title: 'Tổng kết 4 tại chỗ Tháng 2/2026 – Chi cục TT-PCTT Hà Nội', time: '12/03/2026 09:00', status: 'published', type: 'report' },
    { id: 'SC05', platform: 'fb', title: '[KHẨN] Thông báo mực nước sông Đáy tại Ba Thá lúc 20:00', time: '11/03/2026 20:15', status: 'published', type: 'alert' },
    { id: 'SC06', platform: 'zalo', title: 'Danh sách điểm sơ tán dân Huyện Thường Tín 2026', time: '16/03/2026 14:00', status: 'scheduled', type: 'info' },
  ];

  const platformLabel = { fb: 'Facebook', zalo: 'Zalo OA', yt: 'YouTube', tiktok: 'TikTok' };
  const platformColor = { fb: '#1877f2', zalo: '#0068ff', yt: '#ff0000', tiktok: '#010101' };
  const statusBadge = { scheduled: '<span class="badge badge-yellow">Đã lên lịch</span>', published: '<span class="badge badge-green">Đã đăng</span>', draft: '<span class="badge badge-gray">Nháp</span>' };
  const typeColor = { alert: 'var(--danger)', guide: 'var(--primary)', video: 'var(--danger)', report: 'var(--success)', info: 'var(--info)' };

  return `
  <!-- Connected Accounts -->
  <div class="card" style="margin-bottom:16px">
    <div class="card-header">
      <span class="card-title">Tài khoản Mạng xã hội</span>
      <button class="btn btn-primary btn-sm" onclick="openConnectAccountModal()">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Kết nối tài khoản
      </button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;padding:4px 0 8px">
      ${ACCOUNTS.map(acc => `
      <div class="card" style="padding:16px;border-top:3px solid ${acc.color};position:relative">
        ${acc.status === 'connected'
          ? '<div style="position:absolute;top:10px;right:10px;width:8px;height:8px;border-radius:50%;background:var(--success)"></div>'
          : '<div style="position:absolute;top:10px;right:10px;width:8px;height:8px;border-radius:50%;background:var(--muted)"></div>'}
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
          <div style="width:34px;height:34px;border-radius:8px;background:${acc.color}22;border:1px solid ${acc.color}44;display:flex;align-items:center;justify-content:center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${acc.color}" stroke-width="1.8">${acc.icon}</svg>
          </div>
          <div>
            <div style="font-size:13px;font-weight:700">${acc.name}</div>
            <div style="font-size:10px;color:var(--muted)">${acc.handle}</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:12px">
          ${[{l:'Followers',v:acc.followers},{l:'Bài đăng',v:acc.posts},{l:'Reach',v:acc.reach}].map(s => `
          <div style="text-align:center;padding:6px 4px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:6px">
            <div style="font-size:12px;font-weight:700;color:var(--primary)">${s.v}</div>
            <div style="font-size:9px;color:var(--muted)">${s.l}</div>
          </div>`).join('')}
        </div>
        ${acc.status === 'connected'
          ? `<div style="display:flex;gap:6px">
              <button class="btn btn-ghost btn-sm" style="flex:1;font-size:11px" onclick="showToast('Mở ${acc.name}...')">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Mở
              </button>
              <button class="btn btn-outline btn-sm" style="flex:1;font-size:11px" onclick="openComposeForPlatform('${acc.id}')">Đăng bài</button>
            </div>`
          : `<button class="btn btn-primary btn-sm" style="width:100%;font-size:11px" onclick="openConnectAccountModal()">Kết nối ngay</button>`}
      </div>`).join('')}
    </div>
  </div>

  <!-- Post Composer + Scheduled Posts -->
  <div style="display:grid;grid-template-columns:1fr 1.3fr;gap:16px">

    <!-- Composer -->
    <div class="card" style="padding:0">
      <div class="card-header">
        <span class="card-title">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Soạn bài đăng
        </span>
      </div>
      <div style="padding:16px">
        <!-- Platform picker -->
        <div style="margin-bottom:12px">
          <div style="font-size:11px;color:var(--muted);margin-bottom:8px;font-weight:600">ĐĂNG LÊN NỀN TẢNG:</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap" id="platformPicker">
            ${ACCOUNTS.filter(a => a.status === 'connected').map(acc => `
            <label style="cursor:pointer;display:flex;align-items:center;gap:5px;padding:5px 10px;border-radius:6px;border:1px solid ${acc.color}44;background:${acc.color}11;font-size:11px;color:${acc.color}">
              <input type="checkbox" id="plat_${acc.id}" style="width:12px;height:12px;accent-color:${acc.color}">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="${acc.color}" stroke-width="2">${acc.icon}</svg>
              ${acc.name.split(' ')[0]}
            </label>`).join('')}
          </div>
        </div>
        <!-- Content area -->
        <textarea id="composeText" class="form-control" rows="5" style="margin-bottom:10px;resize:vertical" placeholder="Nhập nội dung bài đăng... Sử dụng AI để soạn thảo nhanh."></textarea>
        <!-- Quick tags -->
        <div style="margin-bottom:10px;display:flex;gap:6px;flex-wrap:wrap">
          ${['#PCTTHaNoi','#ThienTai','#AnToanMuaLu','#DeDieu','#ThuyLoi'].map(t =>
            `<span style="padding:3px 8px;border-radius:4px;background:rgba(0,200,255,.08);border:1px solid rgba(0,200,255,.2);font-size:10px;color:var(--primary);cursor:pointer" onclick="document.getElementById('composeText').value+=(' ${t}')">${t}</span>`
          ).join('')}
        </div>
        <!-- Attachments row -->
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
          <button class="btn btn-ghost btn-sm" onclick="showToast('Chọn ảnh/video...')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Ảnh/Video
          </button>
          <button class="btn btn-ghost btn-sm" onclick="openAiContentModal()">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            AI Soạn thảo
          </button>
          <div style="margin-left:auto;font-size:10px;color:var(--muted)" id="composeCharCount">0 ký tự</div>
        </div>
        <!-- Schedule / Publish -->
        <div style="display:flex;gap:6px">
          <input type="datetime-local" class="form-control" style="flex:1;font-size:12px" id="composeSchedule">
          <button class="btn btn-ghost btn-sm" onclick="showToast('Đã lưu nháp!')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
            Nháp
          </button>
          <button class="btn btn-outline btn-sm" onclick="showToast('Đã lên lịch đăng bài!')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Lên lịch
          </button>
          <button class="btn btn-primary btn-sm" onclick="showToast('Đang đăng bài lên các nền tảng...')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Đăng ngay
          </button>
        </div>
      </div>
    </div>

    <!-- Scheduled Posts -->
    <div class="card" style="padding:0">
      <div class="card-header">
        <span class="card-title">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Lịch đăng bài
        </span>
        <div style="display:flex;gap:6px">
          <select class="form-control" style="width:110px;font-size:11px" onchange="">
            <option>Tất cả nền tảng</option>
            <option>Facebook</option>
            <option>Zalo OA</option>
            <option>YouTube</option>
          </select>
          <select class="form-control" style="width:100px;font-size:11px">
            <option>Tất cả TT</option>
            <option>Đã lên lịch</option>
            <option>Đã đăng</option>
            <option>Nháp</option>
          </select>
        </div>
      </div>
      <div style="overflow:auto;max-height:420px">
        ${SCHEDULED.map(post => {
          const platforms = post.platform.split(',');
          return `
        <div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;gap:12px;align-items:flex-start;cursor:pointer;transition:background .15s" onmouseover="this.style.background='rgba(255,255,255,.02)'" onmouseout="this.style.background=''">
          <div style="width:6px;height:6px;border-radius:50%;background:${typeColor[post.type]};margin-top:5px;flex-shrink:0"></div>
          <div style="flex:1;min-width:0">
            <div style="font-size:12px;font-weight:600;line-height:1.4;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${post.title}</div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
              <div style="font-size:10px;color:var(--muted);display:flex;align-items:center;gap:4px">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${post.time}
              </div>
              <div style="display:flex;gap:4px">
                ${platforms.map(p => `<span style="font-size:9px;padding:2px 5px;border-radius:3px;background:${platformColor[p]}22;color:${platformColor[p]};border:1px solid ${platformColor[p]}44;font-weight:600">${platformLabel[p]}</span>`).join('')}
              </div>
              ${statusBadge[post.status] || ''}
            </div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0">
            <button class="btn btn-ghost btn-sm" style="padding:4px 7px" onclick="event.stopPropagation();showToast('Chỉnh sửa bài đăng ${post.id}')">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            ${post.status !== 'published' ? `<button class="btn btn-ghost btn-sm" style="padding:4px 7px;color:var(--danger)" onclick="event.stopPropagation();showToast('Đã xóa lịch đăng bài!')">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
            </button>` : ''}
          </div>
        </div>`;
        }).join('')}
      </div>
      <div style="padding:10px 16px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:11px;color:var(--muted)">${SCHEDULED.filter(s => s.status === 'scheduled').length} bài đang lên lịch · ${SCHEDULED.filter(s => s.status === 'published').length} đã đăng</span>
        <button class="btn btn-ghost btn-sm" onclick="showToast('Xuất lịch đăng bài...')">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Xuất lịch
        </button>
      </div>
    </div>
  </div>`;
}

window.openConnectAccountModal = function() {
  openModal(`
  <div class="modal-header">
    <span class="modal-title">Kết nối tài khoản MXH mới</span>
    <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div class="modal-body">
    <p style="font-size:13px;color:var(--muted);margin-bottom:16px">Chọn nền tảng mạng xã hội để kết nối và quản lý đăng bài tự động:</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      ${[
        {name:'Facebook Fanpage',color:'#1877f2',desc:'Kết nối qua Facebook Business Manager'},
        {name:'Zalo Official Account',color:'#0068ff',desc:'Kết nối qua Zalo OA Developer Portal'},
        {name:'YouTube Channel',color:'#ff0000',desc:'Kết nối qua Google API Console'},
        {name:'TikTok Business',color:'#333',desc:'Kết nối qua TikTok for Business'},
      ].map(p => `
      <div style="padding:14px;border:1px solid ${p.color}33;border-radius:10px;cursor:pointer;transition:.2s" onmouseover="this.style.background='${p.color}11'" onmouseout="this.style.background=''" onclick="closeModal();showToast('Đang kết nối ${p.name}...')">
        <div style="font-size:13px;font-weight:700;color:${p.color};margin-bottom:4px">${p.name}</div>
        <div style="font-size:11px;color:var(--muted)">${p.desc}</div>
      </div>`).join('')}
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Hủy</button></div>`);
};

window.openComposeForPlatform = function(platformId) {
  // Scroll to composer or open compose modal
  showToast('Mở soạn thảo bài đăng cho ' + {fb:'Facebook',zalo:'Zalo OA',yt:'YouTube',tiktok:'TikTok'}[platformId] + '...');
};


// ── TTS STUDIO ─────────────────────────────────────────────────────
const TTS_VOICES = [
  { id:'v01', name:'Hà Linh',     gender:'female', accent:'Bắc',  style:'Chuyên nghiệp', sample:'Xin chào, tôi là Hà Linh, giọng đọc phát thanh chuyên nghiệp.',            cloned:false, avatar:'HL' },
  { id:'v02', name:'Minh Quân',   gender:'male',   accent:'Bắc',  style:'Uy quyền',      sample:'Cảnh báo lũ lụt cấp độ 3 đang được ban hành trên địa bàn huyện Ba Vì.',    cloned:false, avatar:'MQ' },
  { id:'v03', name:'Thu Hà',      gender:'female', accent:'Trung',style:'Thân thiện',    sample:'Kính chào quý vị, đây là thông báo từ Chi cục Phòng chống thiên tai.',      cloned:false, avatar:'TH' },
  { id:'v04', name:'Văn Hùng',    gender:'male',   accent:'Nam',  style:'Rõ ràng',       sample:'Thưa toàn thể nhân dân, xin lưu ý các thông tin quan trọng sau đây.',        cloned:false, avatar:'VH' },
  { id:'v05', name:'Bảo Châu',    gender:'female', accent:'Bắc',  style:'Trầm lắng',     sample:'Đây là bản tin thời tiết và cảnh báo thiên tai khu vực Hà Nội ngày hôm nay.',cloned:false, avatar:'BC' },
  { id:'v06', name:'Đức Anh',     gender:'male',   accent:'Bắc',  style:'Khẩn cấp',      sample:'Khẩn cấp! Mực nước sông Hồng đang dâng cao, người dân vùng ven đê cần sơ tán ngay.',cloned:false,avatar:'ĐA'},
  { id:'cv1', name:'Clone Giám đốc', gender:'male', accent:'Bắc', style:'Clone',         sample:'Giọng clone từ mẫu của đồng chí Giám đốc Chi cục.',                         cloned:true,  avatar:'GĐ' },
  { id:'cv2', name:'Clone MC Cơ quan', gender:'female',accent:'Bắc',style:'Clone',       sample:'Giọng clone từ MC phát thanh nội bộ của Chi cục.',                           cloned:true,  avatar:'MC' },
];

const TTS_HISTORY = [
  { id:'a01', name:'Canh-bao-lu-Ba-Vi_13-03.mp3',  voice:'Minh Quân', duration:'0:28', size:'440 KB', date:'13/03/2026 07:20', text:'Cảnh báo lũ lụt cấp 3 tại huyện Ba Vì...' },
  { id:'a02', name:'TB-phi-nhan-Cu-Loa_12-03.mp3', voice:'Đức Anh',   duration:'0:42', size:'657 KB', date:'12/03/2026 22:15', text:'Thông báo phát qua hệ thống cụm loa toàn Chi cục...' },
  { id:'a03', name:'Huong-dan-so-tan_10-03.mp3',   voice:'Hà Linh',   duration:'1:15', size:'1.2 MB', date:'10/03/2026 14:00', text:'Hướng dẫn sơ tán dân vùng ven đê huyện Chương Mỹ...' },
  { id:'a04', name:'Ban-tin-canh-bao-sang.mp3',    voice:'Thu Hà',    duration:'0:55', size:'860 KB', date:'09/03/2026 05:30', text:'Bản tin cảnh báo thiên tai buổi sáng ngày 09/3...' },
];

let _ttsVoice = 'v02';
let _ttsFormat = 'mp3';
let _ttsSpeed  = 1.0;
let _ttsPitch  = 0;

function renderTtsStudio() {
  const sv = TTS_VOICES.find(v => v.id === _ttsVoice) || TTS_VOICES[0];
  const svgMic = '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>';
  const svgDl  = '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>';
  const svgPlay= '<polygon points="5 3 19 12 5 21 5 3"/>';

  return `
  <div style="display:grid;grid-template-columns:300px minmax(0,1fr);gap:16px;align-items:start">

    <!-- LEFT: voice library -->
    <div style="display:flex;flex-direction:column;gap:12px">
      <div class="card" style="padding:14px">
        <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Thư viện giọng đọc</div>
        <div style="display:flex;flex-direction:column;gap:4px;max-height:340px;overflow-y:auto;padding-right:2px">
          ${TTS_VOICES.map(v => `
          <div onclick="window._ttsSelectVoice('${v.id}')"
               style="display:flex;align-items:center;gap:9px;padding:8px 9px;border-radius:9px;cursor:pointer;border:1.5px solid ${_ttsVoice===v.id?'var(--primary)':'transparent'};background:${_ttsVoice===v.id?'rgba(0,200,255,.08)':'rgba(255,255,255,.02)'};transition:.15s">
            <div style="width:34px;height:34px;border-radius:50%;background:${v.cloned?'linear-gradient(135deg,var(--info),#285CAA)':'linear-gradient(135deg,var(--primary),var(--info))'};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0">${v.avatar}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:12px;font-weight:600;display:flex;align-items:center;gap:4px">
                ${v.name}
                ${v.cloned?'<span style="font-size:9px;padding:1px 5px;border-radius:4px;background:rgba(41,132,238,.2);color:#5BA9FF">CLONE</span>':''}
              </div>
              <div style="font-size:10px;color:var(--muted);margin-top:1px">${v.accent} · ${v.style}</div>
            </div>
            <button onclick="event.stopPropagation();window._ttsPreviewVoice('${v.id}')"
              style="width:26px;height:26px;border-radius:50%;border:1px solid var(--border);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--muted);flex-shrink:0">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">${svgPlay}</svg>
            </button>
          </div>`).join('')}
        </div>
        <div style="border-top:1px solid var(--border);padding-top:10px;margin-top:8px">
          <button class="btn btn-outline btn-sm" style="width:100%" onclick="openVoiceCloneWizard()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${svgMic}</svg>
            Clone giọng đọc mới
          </button>
        </div>
      </div>

      <!-- Settings -->
      <div class="card" style="padding:14px">
        <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Tuỳ chỉnh</div>
        <div class="form-group" style="margin-bottom:10px">
          <label class="form-label" style="font-size:11px">Tốc độ đọc</label>
          <div style="display:flex;align-items:center;gap:8px">
            <input type="range" min="0.5" max="2.0" step="0.1" value="${_ttsSpeed}" style="flex:1;accent-color:var(--primary)"
              oninput="document.getElementById('ttsSpeedVal').textContent=parseFloat(this.value).toFixed(1)+'x';window._ttsSpeed=parseFloat(this.value)">
            <span id="ttsSpeedVal" style="font-size:11px;color:var(--primary);min-width:30px">${_ttsSpeed}x</span>
          </div>
        </div>
        <div class="form-group" style="margin-bottom:10px">
          <label class="form-label" style="font-size:11px">Cao độ giọng</label>
          <div style="display:flex;align-items:center;gap:8px">
            <input type="range" min="-10" max="10" step="1" value="${_ttsPitch}" style="flex:1;accent-color:var(--primary)"
              oninput="document.getElementById('ttsPitchVal').textContent=(this.value>0?'+':'')+this.value;window._ttsPitch=parseInt(this.value)">
            <span id="ttsPitchVal" style="font-size:11px;color:var(--primary);min-width:28px">${_ttsPitch>0?'+':''}${_ttsPitch}</span>
          </div>
        </div>
        <div class="form-group" style="margin-bottom:0">
          <label class="form-label" style="font-size:11px">Định dạng xuất</label>
          <div style="display:flex;gap:6px">
            ${['mp3','wav','ogg'].map(f=>`
            <label style="display:flex;align-items:center;gap:4px;padding:4px 10px;border:1px solid ${_ttsFormat===f?'var(--primary)':'var(--border)'};border-radius:6px;font-size:11px;cursor:pointer;color:${_ttsFormat===f?'var(--primary)':'var(--muted)'}">
              <input type="radio" name="ttsFormat" value="${f}" ${_ttsFormat===f?'checked':''} style="display:none"
                onchange="window._ttsFormat='${f}';this.closest('div').querySelectorAll('label').forEach(l=>{const v=l.querySelector('input').value;l.style.borderColor=v===window._ttsFormat?'var(--primary)':'var(--border)';l.style.color=v===window._ttsFormat?'var(--primary)':'var(--muted)'})">
              .${f.toUpperCase()}
            </label>`).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT: editor + output -->
    <div style="display:flex;flex-direction:column;gap:14px">

      <!-- Active voice banner -->
      <div class="card" style="padding:13px;border-left:3px solid var(--primary)">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:40px;height:40px;border-radius:50%;background:${sv.cloned?'linear-gradient(135deg,var(--info),#285CAA)':'linear-gradient(135deg,var(--primary),var(--info))'};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex-shrink:0">${sv.avatar}</div>
          <div>
            <div style="font-size:13px;font-weight:700">${sv.name} ${sv.cloned?'<span style="font-size:10px;padding:1px 6px;border-radius:4px;background:rgba(41,132,238,.2);color:#5BA9FF">CLONE</span>':''}</div>
            <div style="font-size:11px;color:var(--muted);margin-top:2px">${sv.accent} · ${sv.style} · Tốc độ ${_ttsSpeed}x · Cao độ ${_ttsPitch>0?'+':''}${_ttsPitch}</div>
          </div>
          <button onclick="window._ttsPreviewVoice('${sv.id}')" class="btn btn-ghost btn-sm" style="margin-left:auto">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">${svgPlay}</svg> Nghe thử
          </button>
        </div>
      </div>

      <!-- Text editor -->
      <div class="card" style="padding:14px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:6px">
          <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px">Nội dung cần đọc</div>
          <div style="display:flex;gap:5px;flex-wrap:wrap">
            ${[['Dừng ngắn','<break time="500ms"/>'],['Dừng dài','<break time="1s"/>'],['Nhấn mạnh','<emphasis level=\"strong\">%s</emphasis>'],['Chậm lại','<prosody rate=\"slow\">%s</prosody>']].map(([l,t])=>`
            <button class="btn btn-ghost btn-xs" onclick="window._ttsInsertTag(${JSON.stringify(t)})">${l}</button>`).join('')}
          </div>
        </div>
        <textarea id="ttsText" class="form-control" rows="8" style="font-size:13px;line-height:1.8;resize:vertical"
          placeholder="Nhập văn bản cần chuyển thành giọng nói...">Kính thưa đồng bào! Hiện nay mực nước sông Hồng tại trạm Long Biên đang ở mức báo động 2, độ cao 9,4 mét. Chi cục Thủy lợi và Phòng chống thiên tai Hà Nội đề nghị người dân vùng ven đê không ra bờ sông khi không cần thiết và sẵn sàng sơ tán theo hướng dẫn của chính quyền địa phương.</textarea>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
          <span id="ttsCharCount" style="font-size:11px;color:var(--muted)">~220 ký tự · ước tính 0:28</span>
          <button class="btn btn-ghost btn-xs" onclick="document.getElementById('ttsText').value='';document.getElementById('ttsCharCount').textContent='0 ký tự'">Xoá</button>
        </div>
        <script>(function(){var ta=document.getElementById('ttsText'),cc=document.getElementById('ttsCharCount');if(ta&&cc)ta.oninput=function(){var n=ta.value.length,s=Math.round(n/5/(window._ttsSpeed||1));cc.textContent=n+' ký tự · ước tính '+Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};})()</script>
        <div class="form-group" style="margin-top:12px;margin-bottom:0">
          <label class="form-label" style="font-size:11px">Tên file xuất</label>
          <div style="display:flex;gap:8px">
            <input id="ttsFileName" type="text" class="form-control" placeholder="ten-file-audio" value="TB-PCTT-${new Date().toISOString().slice(0,10)}" style="flex:1;font-size:12px">
            <select class="form-control" style="width:88px;font-size:12px" onchange="window._ttsFormat=this.value">
              <option value="mp3">.MP3</option><option value="wav">.WAV</option><option value="ogg">.OGG</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div style="display:flex;gap:10px">
        <button class="btn btn-ghost" style="flex:1" onclick="window._ttsPreviewGenerate()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">${svgPlay}</svg> Xem trước
        </button>
        <button class="btn btn-primary" style="flex:2" onclick="window._ttsGenerate()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>
          Tạo file Audio
        </button>
        <button class="btn btn-outline" onclick="window._ttsBroadcastDirect()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          Phát thẳng loa
        </button>
      </div>

      <!-- Progress bar (hidden) -->
      <div id="ttsProgress" style="display:none">
        <div class="card" style="padding:14px">
          <div style="font-size:12px;font-weight:600;margin-bottom:10px;color:var(--primary)">Đang tạo file âm thanh...</div>
          <div style="background:rgba(255,255,255,.07);border-radius:6px;height:8px;overflow:hidden">
            <div id="ttsProgressBar" style="width:0%;height:100%;background:linear-gradient(90deg,var(--primary),var(--info));border-radius:6px;transition:width .3s"></div>
          </div>
          <div id="ttsProgressMsg" style="font-size:11px;color:var(--muted);margin-top:8px">Khởi tạo...</div>
        </div>
      </div>

      <!-- History table -->
      <div class="card" style="padding:0">
        <div class="card-header">
          <span class="card-title">File âm thanh đã tạo</span>
          <input type="text" class="form-control form-control-sm" placeholder="Tìm file..." style="width:140px" oninput="this.closest('.card').querySelectorAll('tbody tr').forEach(r=>r.style.display=r.textContent.toLowerCase().includes(this.value.toLowerCase())?'':'none')">
        </div>
        <div class="table-wrap">
          <table id="ttsHistoryTable">
            <thead><tr><th>Tên file</th><th>Giọng</th><th>Thời lượng</th><th>Kích thước</th><th>Ngày tạo</th><th>Thao tác</th></tr></thead>
            <tbody id="ttsHistoryBody">
              ${TTS_HISTORY.map(h=>`
              <tr>
                <td>
                  <div style="font-size:12px;font-weight:500">${h.name}</div>
                  <div style="font-size:10px;color:var(--muted);max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${h.text}</div>
                </td>
                <td style="font-size:12px">${h.voice}</td>
                <td style="font-size:12px;color:var(--primary)">${h.duration}</td>
                <td style="font-size:12px;color:var(--muted)">${h.size}</td>
                <td style="font-size:11px;color:var(--muted)">${h.date}</td>
                <td>
                  <div style="display:flex;gap:3px">
                    <button class="btn btn-ghost btn-xs" title="Phát" onclick="showToast('Đang phát: ${h.name}')"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none">${svgPlay}</svg></button>
                    <button class="btn btn-ghost btn-xs" title="Tải xuống" onclick="showToast('Đang tải: ${h.name}...')"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${svgDl}</svg></button>
                    <button class="btn btn-ghost btn-xs" title="Phát qua loa" onclick="openBroadcastWithAudio('${h.id}','${h.name}')"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg></button>
                    <button class="btn btn-ghost btn-xs" style="color:var(--danger)" title="Xoá" onclick="showToast('Đã xoá: ${h.name}')"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg></button>
                  </div>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>`;
}

// ── TTS helpers ────────────────────────────────────────────────────
window._ttsSelectVoice = function(id) { _ttsVoice = id; document.getElementById('mediaMainContent').innerHTML = renderTtsStudio(); };

window._ttsPreviewVoice = function(id) {
  const v = TTS_VOICES.find(x => x.id === id); if (!v) return;
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(v.sample);
    u.lang='vi-VN'; u.rate=_ttsSpeed; u.pitch=1+(_ttsPitch/10);
    window.speechSynthesis.speak(u); showToast('Nghe thử: ' + v.name);
  } else showToast('Trình duyệt không hỗ trợ TTS preview');
};

window._ttsPreviewGenerate = function() {
  const text = document.getElementById('ttsText')?.value?.trim(); if (!text) { showToast('Nhập nội dung cần đọc!'); return; }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/<[^>]+>/g,''));
    u.lang='vi-VN'; u.rate=_ttsSpeed; u.pitch=1+(_ttsPitch/10);
    window.speechSynthesis.speak(u); showToast('Đang phát xem trước qua Browser TTS...');
  } else showToast('Trình duyệt không hỗ trợ TTS preview');
};

window._ttsInsertTag = function(tag) {
  const ta = document.getElementById('ttsText'); if (!ta) return;
  const s = ta.selectionStart, e = ta.selectionEnd, sel = ta.value.substring(s, e);
  ta.value = ta.value.substring(0,s) + (sel ? tag.replace('%s',sel) : tag) + ta.value.substring(e);
  ta.focus(); showToast('Đã chèn SSML tag');
};

window._ttsGenerate = function() {
  const text = document.getElementById('ttsText')?.value?.trim();
  const fn   = (document.getElementById('ttsFileName')?.value?.trim() || 'audio') + '.' + _ttsFormat;
  if (!text) { showToast('Nhập nội dung cần đọc!'); return; }
  const v = TTS_VOICES.find(x => x.id === _ttsVoice);
  const prog = document.getElementById('ttsProgress');
  const bar  = document.getElementById('ttsProgressBar');
  const msg  = document.getElementById('ttsProgressMsg');
  if (prog) prog.style.display = '';
  const steps = [[10,'Phân tích văn bản...'],[35,'Tải model giọng: '+(v?.name||'')+'...'],[60,'Tổng hợp âm thanh...'],[85,'Chuẩn hoá âm lượng...'],[100,'Hoàn thành!']];
  let i = 0;
  const run = () => {
    if (i >= steps.length) {
      setTimeout(() => {
        if (prog) prog.style.display = 'none';
        const sec = Math.round(text.length/5/_ttsSpeed);
        TTS_HISTORY.unshift({ id:'a'+Date.now(), name:fn, voice:v?.name||'—', duration:Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0'), size:Math.round(text.length*8/_(_ttsFormat==='wav'?1:8))+'KB', date:new Date().toLocaleString('vi-VN'), text:text.substring(0,80)+'...' });
        document.getElementById('mediaMainContent').innerHTML = renderTtsStudio();
        showToast('File âm thanh đã tạo: ' + fn);
      }, 400); return;
    }
    if (bar) bar.style.width = steps[i][0]+'%';
    if (msg) msg.textContent  = steps[i][1];
    i++; setTimeout(run, 350 + Math.random()*250);
  };
  run();
};

window._ttsBroadcastDirect = function() {
  const text = document.getElementById('ttsText')?.value?.trim(); if (!text) { showToast('Nhập nội dung cần phát!'); return; }
  const speakers = (window.NOTIFY_SPEAKERS||[]);
  openModal(`
    <div class="modal-header"><span class="modal-title">Phát thẳng qua hệ thống Loa</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
    <div class="modal-body">
      <div style="padding:10px 14px;background:rgba(0,200,255,.06);border:1px solid rgba(0,200,255,.2);border-radius:9px;font-size:12px;margin-bottom:14px">
        <strong>Giọng:</strong> ${TTS_VOICES.find(v=>v.id===_ttsVoice)?.name||'—'} · Tốc độ ${_ttsSpeed}x
      </div>
      <div class="form-group">
        <label class="form-label">Chọn cụm loa phát</label>
        <div style="display:flex;flex-direction:column;gap:5px;max-height:200px;overflow-y:auto">
          ${speakers.map(s=>`<label style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:7px;cursor:pointer;border:1px solid var(--border)">
            <input type="checkbox" ${s.status==='online'?'checked':'disabled'} style="accent-color:var(--primary)">
            <div style="width:7px;height:7px;border-radius:50%;background:${s.status==='online'?'var(--success)':'var(--muted)'}"></div>
            <span style="font-size:12px;flex:1">${s.name}</span>
            <span style="font-size:10px;color:var(--muted)">${s.status==='online'?'Online':'Offline'}</span>
          </label>`).join('')}
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Hủy</button>
      <button class="btn btn-primary" onclick="closeModal();window._ttsGenerate();setTimeout(()=>showToast('Đang phát thông báo qua hệ thống loa...'),3500)">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>
        Tạo & Phát ngay
      </button>
    </div>
  `);
};

window.openBroadcastWithAudio = function(id, name) {
  openModal(`
    <div class="modal-header"><span class="modal-title">Phát file âm thanh qua Loa</span><button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
    <div class="modal-body">
      <div style="padding:10px 14px;background:rgba(0,200,255,.06);border:1px solid rgba(0,200,255,.2);border-radius:9px;font-size:13px;font-weight:600;margin-bottom:14px">${name}</div>
      <div class="form-group">
        <label class="form-label">Chọn cụm loa</label>
        <div style="display:flex;flex-direction:column;gap:5px;max-height:200px;overflow-y:auto">
          ${(window.NOTIFY_SPEAKERS||[]).map(s=>`<label style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:7px;cursor:pointer;border:1px solid var(--border)">
            <input type="checkbox" ${s.status==='online'?'checked':'disabled'} style="accent-color:var(--primary)">
            <div style="width:7px;height:7px;border-radius:50%;background:${s.status==='online'?'var(--success)':'var(--muted)'}"></div>
            <span style="font-size:12px;flex:1">${s.name}</span>
          </label>`).join('')}
        </div>
      </div>
      <div class="form-group" style="margin-bottom:0">
        <label class="form-label">Số lần lặp</label>
        <select class="form-control" style="width:100px"><option>1 lần</option><option selected>3 lần</option><option>5 lần</option></select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Hủy</button>
      <button class="btn btn-primary" onclick="closeModal();showToast('Đang phát \\'${name}\\' qua hệ thống loa...')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>
        Phát ngay
      </button>
    </div>
  `);
};

// ── Voice Clone Wizard ─────────────────────────────────────────────
function openVoiceCloneWizard() {
  let step = 1, cloneName = '';
  function render() {
    const body = step === 1 ? `
      <div style="text-align:center;padding:10px 0 20px">
        <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--info),#285CAA);margin:0 auto 16px;display:flex;align-items:center;justify-content:center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        </div>
        <h3 style="font-size:15px;font-weight:700;margin-bottom:8px">Clone giọng đọc bằng AI</h3>
        <p style="font-size:12px;color:var(--muted);max-width:380px;margin:0 auto 20px">Tải lên file âm thanh mẫu chất lượng cao (≥10 giây, ít tiếng ồn). Hệ thống AI sẽ phân tích và tái tạo giọng nói để dùng phát thanh.</p>
        <div style="border:2px dashed var(--border);border-radius:12px;padding:28px;cursor:pointer" onclick="document.getElementById('cloneUpload').click()">
          <input type="file" id="cloneUpload" accept=".mp3,.wav,.ogg,.m4a" style="display:none" onchange="document.getElementById('cloneFileName').textContent=this.files[0]?.name||'Chưa chọn'">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5" style="margin:0 auto 10px;display:block"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <div id="cloneFileName" style="font-size:12px;color:var(--muted)">Kéo thả hoặc nhấn để chọn file âm thanh</div>
        </div>
        <div class="form-group" style="margin-top:14px;text-align:left">
          <label class="form-label">Tên giọng đọc mới</label>
          <input id="cloneVoiceName" type="text" class="form-control" placeholder="Ví dụ: Giọng Trưởng phòng">
        </div>
        <div class="form-group" style="text-align:left">
          <label class="form-label">Giới tính</label>
          <select id="cloneGender" class="form-control"><option value="female">Nữ</option><option value="male">Nam</option></select>
        </div>
      </div>` : step === 2 ? `
      <div style="padding:10px 0">
        <div style="font-size:13px;font-weight:600;text-align:center;margin-bottom:16px;color:var(--primary)">Đang phân tích và clone giọng đọc...</div>
        ${['Thu thập đặc trưng giọng nói','Huấn luyện mô hình AI voice cloning','Tổng hợp giọng thử nghiệm','Tinh chỉnh & xác thực chất lượng'].map((s,i)=>`
        <div style="display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:8px;background:rgba(255,255,255,.03);margin-bottom:6px">
          <div style="width:22px;height:22px;border-radius:50%;background:${i<3?'rgba(22,163,74,.2)':'rgba(0,200,255,.15)'};border:1.5px solid ${i<3?'var(--success)':'var(--primary)'};display:flex;align-items:center;justify-content:center;flex-shrink:0">
            ${i<3?'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>':'<div style="width:7px;height:7px;border-radius:50%;background:var(--primary)"></div>'}
          </div>
          <span style="font-size:12px;flex:1">${s}</span>
          <span style="font-size:10px;color:${i<3?'var(--success)':'var(--primary)'}">${i<3?'Hoàn thành':'Đang xử lý...'}</span>
        </div>`).join('')}
      </div>` : `
      <div style="text-align:center;padding:20px 0">
        <div style="width:60px;height:60px;border-radius:50%;background:rgba(22,163,74,.12);border:2px solid var(--success);margin:0 auto 14px;display:flex;align-items:center;justify-content:center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 style="font-size:16px;font-weight:700;color:var(--success);margin-bottom:8px">Clone thành công!</h3>
        <p style="font-size:12px;color:var(--muted)">Giọng đọc <strong style="color:white">"${cloneName}"</strong> đã được thêm vào thư viện và có thể dùng ngay.</p>
      </div>`;

    openModal(`
      <div class="modal-header">
        <span class="modal-title">Clone giọng đọc AI — Bước ${step}/3</span>
        <button class="modal-close" onclick="closeModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div class="modal-body">${body}</div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> ${step===3?'Đóng':'Hủy'}</button>
        ${step===1?`<button class="btn btn-primary" onclick="
          var n=document.getElementById('cloneVoiceName')?.value?.trim();
          if(!n){showToast('Nhập tên giọng đọc!');return;}
          var g=document.getElementById('cloneGender')?.value||'female';
          cloneName=n; step=2; render();
          setTimeout(function(){
            step=3; render();
            TTS_VOICES.push({id:'cv'+Date.now(),name:n,gender:g,accent:'Bắc',style:'Clone',sample:'Đây là giọng clone: '+n,cloned:true,avatar:n.slice(0,2).toUpperCase()});
          },2500);">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/></svg>
          Bắt đầu clone
        </button>`:''}
        ${step===3?`<button class="btn btn-primary" onclick="closeModal();document.getElementById('mediaMainContent').innerHTML=renderTtsStudio()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          Dùng giọng mới
        </button>`:''}
      </div>
    `);
  }
  render();
}
