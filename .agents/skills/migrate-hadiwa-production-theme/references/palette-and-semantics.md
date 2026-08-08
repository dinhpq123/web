# Approved Palette And Semantics

## Contents

1. Brand seed
2. Light matrix
3. Dark matrix
4. Sidebar and shell
5. Intentional identity colors
6. Semantic rules

## 1. Brand Seed

Treat these values as canonical for the approved Hadiwa `evg-emerald` preset. The exact EVG primary `#30BD6F` is the visible navigation selection and primary-action anchor. Darker sidebar values are derived from that same green family only to provide enough contrast for navigation text.

```text
Sidebar top          #137A43
Sidebar bottom       #0B5034
Sidebar section      #8FDEB1
Sidebar active       #30BD6F → #27A962
Sidebar active edge  #8FDEB1
Light primary        #30BD6F
Light hover          #1BA05C
Light active         #168B50
Light form focus     #20B970
Information          #2984EE
Dark primary         #45D483 (Hadiwa extension; EVG has no dark mode)
```

Use exactly:

```css
--sidebar-background: linear-gradient(180deg, #137A43 0%, #0B5034 100%);
--sidebar-item-active: linear-gradient(180deg, #30BD6F 0%, #27A962 100%);
--sidebar-section-accent: #8FDEB1;
--sidebar-active-border: #8FDEB1;
--sidebar-active-shadow: 0 0 20px rgba(48,189,111,.26) inset;
```

Do not extend the navigation green into workspace cards, charts, tables, or semantic statuses. It is a shell identity and selection signal, not a coat of paint.

### Exact EVG navy backup

The extracted EVG source values remain available as `evg-classic-navy`. This is a faithful backup preset, not the approved Hadiwa default:

```css
--sidebar-background: linear-gradient(180deg, #1E3883 0%, #192B54 100%);
--sidebar-item-active: linear-gradient(180deg, rgba(77,191,252,.05) 0%, rgba(77,179,252,.5) 100%);
--sidebar-section-accent: #1EF5DF;
--sidebar-active-border: #41A7FF;
--sidebar-active-shadow: 0 0 25px #4C76D6B2 inset;
```

## 2. Light Matrix

```css
:root,
.theme-light,
body.light {
  --primary: #30BD6F;
  --primary-hover: #1BA05C;
  --primary-active: #168B50;
  --primary-soft: rgba(48, 189, 111, .12);
  --primary-text: #137A43;
  --text-on-primary: #FFFFFF;

  --bg-app: #F0F4F8;
  --bg-surface: #FFFFFF;
  --bg-card: #FFFFFF;
  --bg-elevated: #FFFFFF;
  --bg-secondary: #EEF1FA;
  --bg-tertiary: #F9F9F9;
  --bg-hover: rgba(41, 132, 238, .08);
  --bg-selected: rgba(41, 132, 238, .12);
  --bg-header: #FFFFFF;

  --text-primary: #18183E;
  --text-secondary: #494968;
  --text-muted: #5F6678;
  --text-subtle: #6B7280;
  --text-disabled: #9CA2B8;

  --border: #DBDFF1;
  --border-light: #E4E6EF;
  --border-active: #2984EE;
  --border-focus: #20B970;

  --info: #2984EE;
  --info-soft: #ECF8FF;
  --info-text: #0B5CAD;
  --warning: #946200;
  --warning-soft: #FFF8DD;
  --warning-text: #6F4E00;
  --danger: #E14E54;
  --danger-soft: #FFF5F8;
  --danger-text: #B4232A;

  --status-online: #168A4B;
  --status-online-glow: rgba(22, 138, 75, .42);
}
```

Approved light shadows:

```css
--shadow-card: 0 2px 12px rgba(24, 24, 62, .06);
--shadow-dropdown: 0 8px 30px rgba(24, 24, 62, .10);
--focus-ring: 0 0 0 3px rgba(32, 185, 112, .18);
```

## 3. Dark Matrix

```css
.theme-dark,
body.dark {
  --primary: #45D483;
  --primary-hover: #62DE97;
  --primary-active: #32BA70;
  --primary-soft: rgba(69, 212, 131, .16);
  --primary-text: #83E8AD;
  --text-on-primary: #FFFFFF;

  --bg-app: #0C4635;
  --bg-surface: #13553F;
  --bg-card: #176348;
  --bg-elevated: #1E7756;
  --bg-secondary: #17644A;
  --bg-tertiary: #1A6E50;
  --bg-hover: rgba(48, 189, 111, .10);
  --bg-selected: rgba(48, 189, 111, .18);
  --bg-header: #13553F;

  --text-primary: #F8FBFF;
  --text-secondary: #D9EDE5;
  --text-muted: #A9CBBE;
  --text-subtle: #B7C9DA;
  --text-disabled: #769E90;

  --border: rgba(176, 235, 205, .30);
  --border-light: rgba(176, 235, 205, .18);
  --border-active: #30BD6F;
  --border-focus: #45D483;

  --info: #3699FF;
  --info-soft: rgba(54, 153, 255, .16);
  --info-text: #8CC5FF;
  --warning: #F6C000;
  --warning-soft: rgba(246, 192, 0, .16);
  --warning-text: #FFE27A;
  --danger: #E14E54;
  --danger-soft: rgba(225, 78, 84, .16);
  --danger-text: #FF9AA0;

  --status-online: #45D483;
  --status-online-glow: rgba(69, 212, 131, .52);
}
```

Approved dark shell:

```css
--sidebar-background: linear-gradient(180deg, #137A43 0%, #0B5034 100%);
--workspace-background: linear-gradient(180deg, #0C4635 0%, #13553F 100%);
--header-background: linear-gradient(90deg, #0F5B42 0%, #13553F 100%);
--ticker-background: linear-gradient(90deg, #13553F 0%, #0F5B42 50%, #13553F 100%);
--shadow-card: 0 10px 28px rgba(2, 10, 24, .28);
--focus-ring: 0 0 0 3px rgba(69, 212, 131, .22);
```

Do not introduce black, near-black (`#07...`) panels or gray overlays as normal surfaces. The darkest normal application surface is `#0C4635`; use the brighter green hierarchy above while retaining blue for information and red/amber for operational status.

## 4. Sidebar And Shell

```text
Sidebar parent background  sidebar gradient
Sidebar default text       #EAF2FF
Sidebar active text        #FFFFFF
Sidebar section heading    #8FDEB1
Sidebar border             rgba(48,189,111,.34)
Sidebar item hover         #30BD6F → #27A962
Sidebar item active        #30BD6F → #27A962
Header light               #FFFFFF
Header dark                approved header gradient
Ticker light               #EEF1FA
Ticker dark                approved ticker gradient
```

The hamburger belongs inside the sidebar logo row. The logo itself opens the module launcher; do not add a weak instruction strip beneath it.

## 5. Intentional Identity Colors

### Module launcher

These colors apply only to icon, label, border, and restrained hover tint inside the post-login module launcher:

```text
Điều hành Tập trung       #7C3AED
Thủy lợi & Đê điều       #0891B2
Chỉ đạo PCTT             #DC2626
IoT & Cảnh báo           #059669
Báo cáo & Truyền thông   #D97706
Trung tâm AI             #A78BFA
Quản trị Hệ thống        #64748B
```

Do not propagate these seven colors to page cards, nav controls, or generic dashboard icons.

### Login quick-account roles

Use each role color for the quick-account icon, badge, border, and selected-state tint:

```text
SUPERADMIN / SYSADMIN  #FF1744
CHI_CUC_TRUONG         #7C3AED
DIEU_HANH              #F59E0B
KY_THUAT               #0066CC
QUAN_LY_DE             #00B4D8
HR                     #00A86B
VIEWER                 #718096
```

### Domain colors

```css
--alert-bd1: #F6C000;
--alert-bd2: #F28C28;
--alert-bd3: #E14E54;
--alert-critical: #B4232A; /* dark may use #FF6B73 for readable text */
```

## 6. Semantic Rules

- Brand/primary means selection, focus, navigation, primary action, and neutral data emphasis.
- `--status-online` means real online/connected/healthy state only.
- Success means completed/verified/approved, never every highlighted control.
- Warning/danger mean actual severity. Do not use them as decorative card borders.
- AI purple stays inside AI identity. Generic settings and cards remain primary/neutral.
- Use `*-text` tokens for text contrast and `*-soft` tokens for backgrounds.
- Muted text remains readable; disabled text is visibly weaker.
- Chart palettes may use multiple series colors, but surrounding controls remain semantic.
- Never use arbitrary dark gray fills such as `#333`, `#444`, or translucent black to patch missing surfaces.
