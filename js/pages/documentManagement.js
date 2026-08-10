// ── HADIWA IOC — Document Management v5.2 ─────────────────────────
// Comprehensive PCTT document registry with search, category filter,
// signing workflow, version control, and stats

let dmDocTab = 'all';
let dmDocSearch = '';

const DM_CATEGORIES = {
  qd: { label: 'Quyết định',    color: '#ef4444' },
  cv: { label: 'Công văn',      color: '#3b82f6' },
  tb: { label: 'Thông báo',     color: '#f59e0b' },
  pa: { label: 'Phương án PCTT',color: 'var(--purple)' },
  bb: { label: 'Biên bản',      color: 'var(--success)' },
  bc: { label: 'Báo cáo',       color: '#06b6d4' },
  ke: { label: 'Kế hoạch',      color: '#f97316' },
};

const DM_DOCUMENTS = [
  { id:'QĐ-127/2026', type:'qd', title:'Quyết định thành lập Ban Chỉ huy PCTT&TKCN năm 2026', date:'15/01/2026', issuer:'Chi cục TT-PCTT HN', status:'signed', signer:'Chi cục trưởng Lê Văn Nam', version:'1.0', downloads:42, urgent:false },
  { id:'PA-FLOOD-01',  type:'pa', title:'Phương án phòng chống lũ lụt TP. Hà Nội 2026 — Mùa mưa bão', date:'01/02/2026', issuer:'Chi cục TT-PCTT HN', status:'signed', signer:'Chi cục trưởng Lê Văn Nam', version:'2.1', downloads:118, urgent:false },
  { id:'PA-DIKE-02',   type:'pa', title:'Phương án hộ đê khẩn cấp — Đê Hữu Đáy đoạn Chương Mỹ-Mỹ Đức', date:'10/02/2026', issuer:'Chi cục TT-PCTT HN', status:'signed', signer:'Chi cục trưởng Lê Văn Nam', version:'1.0', downloads:76, urgent:true },
  { id:'CV-048/2026',  type:'cv', title:'Công văn yêu cầu kiểm tra đê điều trước mùa lũ 2026', date:'25/02/2026', issuer:'Chi cục TT-PCTT HN', status:'signed', signer:'PCC Nguyễn Thị Hà', version:'1.0', downloads:31, urgent:false },
  { id:'TB-12/2026',   type:'tb', title:'Thông báo diễn tập ứng phó thiên tai cấp thành phố ngày 20/3/2026', date:'05/03/2026', issuer:'Chi cục TT-PCTT HN', status:'signed', signer:'PCC Nguyễn Thị Hà', version:'1.0', downloads:28, urgent:false },
  { id:'BC-QLDD-Q1',   type:'bc', title:'Báo cáo công tác quản lý đê điều quý I/2026', date:'10/03/2026', issuer:'P. Quản lý Đê điều', status:'draft', signer:null, version:'0.3', downloads:0, urgent:false },
  { id:'KH-TKTL-2026', type:'ke', title:'Kế hoạch thanh tra, kiểm tra công trình thủy lợi năm 2026', date:'20/01/2026', issuer:'Chi cục TT-PCTT HN', status:'signed', signer:'Chi cục trưởng Lê Văn Nam', version:'1.0', downloads:55, urgent:false },
  { id:'PA-EVA-Chus',  type:'pa', title:'Phương án sơ tán dân vùng thấp trũng huyện Chương Mỹ', date:'12/03/2026', issuer:'UBND H. Chương Mỹ', status:'pending', signer:null, version:'1.0', downloads:3, urgent:true },
  { id:'BB-KT-DK02',   type:'bb', title:'Biên bản kiểm tra đê Hữu Đáy K+8+200 sau sự cố thẩm lậu', date:'12/03/2026', issuer:'Đội ứng phó 01', status:'signed', signer:'Đội trưởng Nguyễn Văn Hùng', version:'1.0', downloads:14, urgent:true },
  { id:'QĐ-HĐ-033',    type:'qd', title:'Quyết định huy động lực lượng, phương tiện ứng phó lũ sông Đáy', date:'13/03/2026', issuer:'Chi cục TT-PCTT HN', status:'signed', signer:'Chi cục trưởng Lê Văn Nam', version:'1.0', downloads:22, urgent:true },
  { id:'CV-TKC-09',    type:'cv', title:'Công văn đề nghị Quân khu 7 hỗ trợ lực lượng ứng phó lũ, bão', date:'13/03/2026', issuer:'Chi cục TT-PCTT HN', status:'pending', signer:null, version:'0.1', downloads:0, urgent:true },
  { id:'BC-QT-0310',   type:'bc', title:'Báo cáo nhanh tình hình thiên tai ngày 13/3/2026', date:'13/03/2026', issuer:'CHTT IOC Hadiwa', status:'draft', signer:null, version:'0.5', downloads:0, urgent:true },
];

function renderDocManagement() {
  const filtered = DM_DOCUMENTS.filter(d => {
    const matchTab = dmDocTab === 'all' ? true : dmDocTab === 'urgent' ? d.urgent : dmDocTab === 'draft' ? d.status === 'draft' : d.type === dmDocTab;
    const matchSearch = !dmDocSearch || d.title.toLowerCase().includes(dmDocSearch.toLowerCase()) || d.id.toLowerCase().includes(dmDocSearch.toLowerCase());
    return matchTab && matchSearch;
  });

  const signed  = DM_DOCUMENTS.filter(d => d.status === 'signed').length;
  const pending = DM_DOCUMENTS.filter(d => d.status === 'pending').length;
  const drafts  = DM_DOCUMENTS.filter(d => d.status === 'draft').length;
  const urgent  = DM_DOCUMENTS.filter(d => d.urgent).length;

  return `
<style>
.dm-doc-page{padding:20px 24px;max-width:1280px;margin:0 auto}
.dm-doc-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px}
.dm-doc-kpi{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px 16px;display:flex;align-items:center;gap:12px}
.dm-doc-kpi-val{font-size:26px;font-weight:900;line-height:1}
.dm-doc-kpi-lbl{font-size:10px;color:rgba(255,255,255,.38);font-weight:600;margin-top:2px}
.dm-doc-filters{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;align-items:center}
.dm-doc-table{width:100%;border-collapse:collapse}
.dm-doc-table th{font-size:10px;font-weight:700;color:rgba(255,255,255,.32);text-transform:uppercase;letter-spacing:.07em;padding:8px 12px;text-align:left;border-bottom:1px solid rgba(255,255,255,.07)}
.dm-doc-table td{padding:10px 12px;font-size:12px;border-bottom:1px solid rgba(255,255,255,.04);vertical-align:middle}
.dm-doc-table tr:hover td{background:rgba(255,255,255,.025)}
.dm-status-dot{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700}
</style>

<div class="dm-doc-page">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;flex-wrap:wrap;gap:10px">
    <div>
      <h1 style="font-size:20px;font-weight:800;color:#fff;margin:0 0 4px;display:flex;align-items:center;gap:8px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
        </svg>
        Quản lý Văn bản & Tài liệu PCTT
      </h1>
      <div style="font-size:12px;color:rgba(255,255,255,.38)">${DM_DOCUMENTS.length} văn bản · ${urgent} tài liệu khẩn · ${signed} đã ký ban hành</div>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-ghost btn-sm" onclick="dmDocExport()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Xuất Excel
      </button>
      <button class="btn btn-primary btn-sm" onclick="dmDocNew()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Tạo văn bản mới
      </button>
    </div>
  </div>

  <!-- KPIs -->
  <div class="dm-doc-kpis">
    ${[
      ['Tổng văn bản', DM_DOCUMENTS.length, '#38bdf8',
       `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`],
      ['Đã ký ban hành', signed, 'var(--success)',
       `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`],
      ['Chờ phê duyệt', pending, '#f59e0b',
       `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`],
      ['Tài liệu khẩn', urgent, '#ef4444',
       `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`],
    ].map(([l,v,c,icon]) => `
    <div class="dm-doc-kpi">
      <div style="width:36px;height:36px;border-radius:10px;background:${c}18;display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2">${icon.replace(/<svg[^>]*>|<\/svg>/g,'')}</svg>
      </div>
      <div><div class="dm-doc-kpi-val" style="color:${c}">${v}</div><div class="dm-doc-kpi-lbl">${l}</div></div>
    </div>`).join('')}
  </div>

  <!-- Search + Category Filters -->
  <div class="dm-doc-filters">
    <div style="position:relative">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="2" style="position:absolute;left:10px;top:50%;transform:translateY(-50%)"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" class="form-control form-control-sm" placeholder="Tìm kiếm mã số, tiêu đề..." style="padding-left:30px;width:240px" value="${dmDocSearch}"
        oninput="dmDocSearchFn(this.value)">
    </div>
    <div class="ui-segmented" aria-label="Lọc loại tài liệu">
      <button class="ui-segmented__item ${dmDocTab==='all'?'active':''}" onclick="dmDocSetTab('all')">Tất cả</button>
      <button class="ui-segmented__item ${dmDocTab==='urgent'?'active':''}" onclick="dmDocSetTab('urgent')">
        Khẩn cấp
        <span class="badge badge-red" style="margin-left:4px">${urgent}</span>
      </button>
      <button class="ui-segmented__item ${dmDocTab==='draft'?'active':''}" onclick="dmDocSetTab('draft')">Bản nháp</button>
      ${Object.keys(DM_CATEGORIES).map(key =>
        `<button class="ui-segmented__item ${dmDocTab===key?'active':''}" onclick="dmDocSetTab('${key}')">${DM_CATEGORIES[key].label}</button>`).join('')}
    </div>
  </div>

  <!-- Document Table -->
  <div class="card" style="padding:0">
    <div class="table-wrap">
      <table class="dm-doc-table">
        <thead><tr>
          <th style="width:120px">Số/Mã</th>
          <th>Trích yếu nội dung</th>
          <th>Loại</th>
          <th style="width:90px">Ngày</th>
          <th>Trạng thái</th>
          <th style="width:90px">Phiên bản</th>
          <th style="width:120px">Người ký</th>
          <th style="width:60px" class="text-center">Tải về</th>
          <th style="width:100px"></th>
        </tr></thead>
        <tbody>
          ${filtered.length === 0
            ? `<tr><td colspan="9" style="text-align:center;padding:32px;color:rgba(255,255,255,.3)">Không có văn bản nào phù hợp</td></tr>`
            : filtered.map(d => {
              const cat = DM_CATEGORIES[d.type] || { label: d.type, color: 'var(--text-subtle)' };
              const sc  = { signed:'var(--success)', pending:'#f59e0b', draft:'var(--text-subtle)' }[d.status];
              const sl  = { signed:'Đã ký', pending:'Chờ ký', draft:'Bản nháp' }[d.status];
              return `<tr>
                <td>
                  <div style="font-family:monospace;font-size:11px;font-weight:700;color:#5BA9FF">${d.id}</div>
                  ${d.urgent ? `<div style="font-size:9px;font-weight:800;color:#ef4444;margin-top:2px">KHẨN</div>` : ''}
                </td>
                <td>
                  <div style="font-weight:600;color:#fff;line-height:1.4">${d.title}</div>
                  <div style="font-size:10px;color:rgba(255,255,255,.35);margin-top:2px">${d.issuer}</div>
                </td>
                <td>
                  <span style="padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;background:${cat.color}18;color:${cat.color};border:1px solid ${cat.color}30">${cat.label}</span>
                </td>
                <td style="font-size:11px;color:rgba(255,255,255,.45)">${d.date}</td>
                <td>
                  <div class="dm-status-dot" style="color:${sc}">
                    <div style="width:6px;height:6px;border-radius:50%;background:${sc};flex-shrink:0"></div>
                    ${sl}
                  </div>
                </td>
                <td style="font-family:monospace;font-size:11px;color:rgba(255,255,255,.45)">v${d.version}</td>
                <td style="font-size:11px;color:rgba(255,255,255,.5)">${d.signer||'—'}</td>
                <td style="text-align:center;font-size:12px;font-weight:700;color:${d.downloads>0?'#38bdf8':'rgba(255,255,255,.25)'}">${d.downloads}</td>
                <td>
                  <div style="display:flex;gap:4px">
                    <button class="btn btn-ghost btn-sm" onclick="dmDocView('${d.id}')" title="Xem">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    ${d.status==='pending'?`<button class="btn btn-primary btn-sm" onclick="dmDocSign('${d.id}')">Ký duyệt</button>`:
                      d.status==='draft'?`<button class="btn btn-outline btn-sm" onclick="dmDocSubmit('${d.id}')">Trình ký</button>`:
                      `<button class="btn btn-ghost btn-sm" onclick="dmDocDownload('${d.id}')" title="Tải về">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      </button>`}
                  </div>
                </td>
              </tr>`;
            }).join('')}
        </tbody>
      </table>
    </div>
    <div style="padding:12px 16px;font-size:11px;color:rgba(255,255,255,.3);border-top:1px solid rgba(255,255,255,.06)">
      Hiển thị ${filtered.length} / ${DM_DOCUMENTS.length} văn bản
    </div>
  </div>
</div>`;
}

function dmDocSetTab(tab) {
  dmDocTab = tab;
  const area = document.getElementById('contentArea') || document.querySelector('.page-content');
  if (area) area.innerHTML = renderDocManagement();
}
function dmDocSearchFn(q) {
  dmDocSearch = q;
  const tbody = document.querySelector('.dm-doc-table tbody');
  if (!tbody) return;
  const filtered = DM_DOCUMENTS.filter(d => {
    const matchTab = dmDocTab === 'all' ? true : dmDocTab === 'urgent' ? d.urgent : dmDocTab === 'draft' ? d.status === 'draft' : d.type === dmDocTab;
    const matchSearch = !q || d.title.toLowerCase().includes(q.toLowerCase()) || d.id.toLowerCase().includes(q.toLowerCase());
    return matchTab && matchSearch;
  });
  const area = document.getElementById('contentArea') || document.querySelector('.page-content');
  if (area) area.innerHTML = renderDocManagement();
}
function dmDocView(id) { const d = DM_DOCUMENTS.find(x=>x.id===id); if (d && typeof showToast==='function') showToast(`Xem văn bản: ${d.title.substring(0,50)}...`, 'info'); }
function dmDocSign(id) { const d = DM_DOCUMENTS.find(x=>x.id===id); if (d) { d.status='signed'; d.signer='Chi cục trưởng Lê Văn Nam'; if(typeof showToast==='function') showToast(`Đã ký ban hành văn bản ${id}!`, 'success'); dmDocSetTab(dmDocTab); } }
function dmDocSubmit(id) { const d = DM_DOCUMENTS.find(x=>x.id===id); if (d) { d.status='pending'; if(typeof showToast==='function') showToast(`Đã trình ký văn bản ${id}`, 'info'); dmDocSetTab(dmDocTab); } }
function dmDocDownload(id) { if(typeof showToast==='function') showToast(`Đang tải xuống ${id}...`, 'info'); }
function dmDocNew() { if(typeof showToast==='function') showToast('Mở form soạn văn bản mới...', 'info'); }
function dmDocExport() { if(typeof showToast==='function') showToast('Đang xuất danh sách văn bản ra Excel...', 'info'); }
