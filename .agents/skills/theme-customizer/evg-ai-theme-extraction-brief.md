# TASK BRIEF: BOC TACH VA DONG GOI EVG DESIGN SYSTEM

## Vai tro

Ban la AI coding agent dang lam viec truc tiep trong source EVG CMS. Hay boc tach design system dang duoc ung dung thuc te trong source, tao bo tai lieu va demo co the dung de migrate giao dien EVG sang mot ung dung khac.

Khong suy dien bang anh chup neu source da co gia tri chinh xac. Moi token quan trong phai co nguon `duong-dan-file:line`.

## Muc tieu

1. Xac dinh chinh xac theme hien tai cua EVG: mau sac, typography, spacing, radius, border, shadow, icon va state.
2. Xac dinh cach theme duoc ap dung cho Sidebar, Header, BaseLayout va cac UI component dung chung.
3. Chuan hoa ket qua thanh semantic tokens, khong bien toan bo giao dien thanh mot mau xanh.
4. Tao Theme Lab de kiem tra tat ca component va state truoc khi chuyen sang he thong khac.
5. Tao mot Codex skill co the dung de migrate theme ma khong thay doi business logic.

## Nguyen tac bat buoc

- Chi phan tich va bo sung artifact giao dien. Khong sua API, auth, RBAC, route, state management, database hay nghiep vu EVG.
- Khong thay doi visual cua san pham EVG dang chay, tru khi task rieng yeu cau sua.
- Khong dua `.env`, secret, token, credential, du lieu khach hang hoac URL noi bo nhay cam vao bo ban giao.
- Uu tien token va component goc dang duoc import/render. Khong lay mau tu file cu, code chet hoac component khong con dung.
- Khong hard-code mau gan giong. Phai lay dung gia tri trong source hoac computed style.
- Phan biet ro:
  - Brand/primary: hanh dong chinh, active, focus.
  - Success: thanh cong, online, hoat dong tot.
  - Info: thong tin, dang xu ly, du lieu trung tinh.
  - Warning: can chu y, sap het han, cho xu ly.
  - Danger: loi, nguy cap, xoa, tu choi.
  - Neutral: text, surface, border, disabled.
- Khong dung status colors de trang tri ngau nhien. Mot component chi dung mau semantic khi co y nghia nghiep vu.
- Neu EVG khong co Dark Mode hoan chinh, ghi ro `not implemented`; khong tu sang tac mot bo Dark Mode roi gan nhan la theme EVG goc.

## Pham vi source can doc

Tim theo cau truc thuc te cua repository, toi thieu gom:

- `package.json`, lockfile va cau hinh bundler.
- CSS/SCSS global, variables, mixins, reset va theme provider.
- Constants nhu `AppColors`, palette, design tokens hoac theme config.
- Sidebar/Menu, Header/Topbar, BaseLayout/AppShell.
- Button va icon button.
- Input, textarea, checkbox, radio, switch.
- Select, dropdown, combobox, date picker.
- Tabs, segmented controls, breadcrumbs.
- Card, KPI/stat, badge, alert.
- Table, filter bar, pagination, empty/loading/error states.
- Modal, dialog, drawer, popover, tooltip, toast.
- Login/auth screens.
- Font files/imports va icon library.
- Cac portal/overlay root, vi dropdown va modal co the render ngoai component tree.

Dung `rg`/`rg --files` de tim source. Sau khi tim thay component, truy vet import den man hinh dang su dung no de tranh lay nham code cu.

## Quy trinh thuc hien

### Phase 1: Source discovery

1. Lap danh sach framework, UI library, CSS strategy va icon library.
2. Tim tat ca nguon token: CSS variables, SCSS variables, JS constants, theme object va mau inline.
3. Tim component dang render Sidebar/Header/BaseLayout.
4. Lap screen inventory tu route config va menu config.
5. Danh dau code active, legacy, duplicate va dead code.

### Phase 2: Exact token extraction

Trich xuat thanh cac nhom:

- Brand: primary, hover, active, focus, soft background.
- Sidebar: background, active, hover, section title, icon, divider, collapsed state.
- Surface: app, card, elevated, header, overlay.
- Text: primary, secondary, muted, disabled, inverse, link.
- Border: default, subtle, active, focus, invalid.
- Semantic: success, info, warning, danger va cac soft variants.
- Typography: family, weight, size, line-height, letter-spacing.
- Geometry: spacing scale, radius, control height, icon size.
- Effects: shadow, overlay opacity, focus ring, transition.

Moi token phai co:

| Field | Bat buoc |
|---|---|
| Token name | Co |
| Exact value | Co |
| Semantic purpose | Co |
| Source file and line | Co |
| Components using it | Co |
| Light/Dark applicability | Co |

Neu co nhieu gia tri mau cung y nghia, ghi ro token nao la canonical va token nao la legacy/alias.

### Phase 3: Component contracts

Voi moi component, mo ta va demo day du:

- Default.
- Hover.
- Focus-visible.
- Active/selected.
- Disabled.
- Loading neu co.
- Validation/error neu co.
- Light/Dark neu source ho tro.
- Desktop/mobile khi layout thay doi.

Can dac biet kiem tra:

- Dropdown khong bi sai mau khi render qua portal.
- Modal co surface, overlay, title, body, footer va action dung token.
- Table header, row hover, selected row, sort, empty state va pagination dong bo.
- Icon dung `currentColor` hoac token; khong mac dinh den/xam ngoai y muon.
- Sidebar expanded/collapsed khong thay doi sai active state.
- Text va icon dat WCAG AA cho noi dung thong thuong khi co the.

### Phase 4: Theme Lab

Tao mot route/page dev-only ten `Theme Lab` hoac mot static demo doc lap. Khong dua vao production navigation neu khong co co che dev-only.

Theme Lab phai co cac khu vuc:

1. Token swatches va typography scale.
2. Sidebar expanded/collapsed va menu active/hover.
3. Header voi user menu, notification va actions.
4. Buttons va icon buttons.
5. Form controls va validation.
6. Tabs, dropdown, popover va tooltip.
7. Cards, KPI, badges va semantic alerts.
8. Table, filter bar, pagination, loading/empty/error.
9. Modal, drawer, toast va confirm dialog.
10. Responsive states tai 375px, 768px, 1440px va 1920px.

Theme Lab dung du lieu gia, khong goi API production.

### Phase 5: Validation

1. Chay lint/build/test hien co.
2. Chup screenshot Theme Lab tai 375px, 768px, 1440px va 1920px.
3. Kiem tra dropdown/modal/tooltip bang interaction, khong chi screenshot trang tinh.
4. Tim lai toan repository cac mau hard-code va phan loai:
   - Can migrate sang token.
   - Status/domain color hop le.
   - Asset/logo khong duoc thay.
   - Legacy/dead code.
5. Bao cao component con thieu hoac state chua the xac minh.

## Dau ra bat buoc

Tao thu muc ban giao sau, co the doi root folder neu repository co convention khac:

```text
evg-theme-export/
├── README-HANDOFF.md
├── source-map.md
├── screen-inventory.md
├── component-contracts.md
├── validation-report.md
├── tokens/
│   ├── evg-theme.tokens.json
│   ├── evg-theme.css
│   └── evg-theme.scss
├── theme-lab/
│   └── ...source demo hoac huong dan route dev-only...
└── skill/
    └── SKILL.md
```

### `README-HANDOFF.md`

Ghi ro:

- Commit/branch EVG da dung de boc tach.
- Lenh chay Theme Lab.
- Framework va dependency can thiet.
- Pham vi da xac minh va pham vi chua xac minh.
- Danh sach file tuyet doi khong duoc mang sang he thong dich.

### `source-map.md`

Bang lien ket token/component voi source chinh xac:

```md
| Area | Canonical source | Line | Consumer examples | Notes |
```

### `evg-theme.tokens.json`

Dung semantic structure, vi du:

```json
{
  "brand": {
    "primary": { "value": "#30BD6F", "source": "src/...:42" }
  },
  "sidebar": {
    "background": { "value": "linear-gradient(...)" , "source": "src/...:13" }
  },
  "status": {
    "success": {},
    "info": {},
    "warning": {},
    "danger": {}
  }
}
```

### `skill/SKILL.md`

Skill phai co YAML frontmatter hop le:

```yaml
---
name: migrate-evg-visual-system
description: Apply the verified EVG visual system to an existing web application while preserving business logic, routes, auth, RBAC, APIs, and workflows.
---
```

Skill phai huong dan agent:

1. Discover source va route truoc khi sua.
2. Import semantic tokens truoc khi migrate component.
3. Migrate theo thu tu AppShell -> shared controls -> overlays -> data display -> screens.
4. Khong doi business logic.
5. Khong phu primary green len moi component.
6. Dung status colors theo y nghia.
7. Kiem tra Light/Dark, responsive va portal overlays.
8. Bao cao coverage theo tung route/component.

## Tieu chi chap nhan

Chi danh dau hoan thanh khi tat ca dieu sau dung:

- [ ] Sidebar, Header va BaseLayout co token va source reference.
- [ ] Tat ca shared UI component da co contract va demo state.
- [ ] Dropdown, modal, toast, tooltip va portal overlay da duoc kiem tra.
- [ ] Theme Lab hoat dong ma khong can API production.
- [ ] Token JSON/CSS/SCSS khong chua secret hoac du lieu nghiep vu.
- [ ] Khong co mau tim/gradient/trang tri duoc AI tu sang tac ngoai source.
- [ ] Primary, success, info, warning, danger va neutral duoc phan biet ro.
- [ ] Screenshot desktop/mobile khong co text overlap, overflow hoac contrast ro rang bi loi.
- [ ] Skill co the dung tren repository khac ma khong phu thuoc duong dan may local.
- [ ] Validation report liet ke trung thuc moi phan chua xac minh.

## Bao cao cuoi cung

Khi hoan thanh, tra loi ngan gon theo mau:

```md
## Completed
- Source commit: ...
- Canonical theme files: ...
- Theme Lab URL/command: ...
- Components covered: .../... 
- Screens inventoried: .../...
- Validation: build ..., screenshots ..., interactions ...

## Remaining gaps
- ...

## Handoff path
- `evg-theme-export/`
```

Khong chi tra loi bang mot bang mau hoac mot file CSS. Dau ra phai gom source map, semantic tokens, component contracts, Theme Lab, validation report va skill.
