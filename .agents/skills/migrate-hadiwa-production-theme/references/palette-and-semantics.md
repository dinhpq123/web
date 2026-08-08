# Approved Palette And Semantics

## Contents

1. Brand seed
2. Light matrix
3. Dark matrix
4. Sidebar and shell
5. Intentional identity colors
6. Semantic rules

## 1. Brand Seed

Treat these values as canonical for the approved Hadiwa `evg-emerald` preset. It adapts EVG green into a restrained teal navigation shell while preserving blue for information and semantic colors for operational state.

```text
Sidebar top          #0F5B55
Sidebar bottom       #123D42
Sidebar section      #8BE7B5
Sidebar active       rgba(48,189,111,.12) → rgba(48,189,111,.30)
Sidebar active edge  #58CB89
Light primary        #30BD6F
Light hover          #1BA05C
Light active         #168B50
Light form focus     #20B970
Information          #2984EE
Dark primary         #45D483 (Hadiwa extension; EVG has no dark mode)
```

Use exactly:

```css
--sidebar-background: linear-gradient(180deg, #0F5B55 0%, #123D42 100%);
--sidebar-item-active: linear-gradient(180deg, rgba(48,189,111,.12) 0%, rgba(48,189,111,.30) 100%);
--sidebar-section-accent: #8BE7B5;
--sidebar-active-border: #58CB89;
--sidebar-active-shadow: 0 0 22px rgba(48,189,111,.28) inset;
```

Do not extend the teal navigation palette into workspace cards, charts, tables, or semantic statuses. It is a shell identity, not a coat of paint.

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

  --bg-app: #0B1D33;
  --bg-surface: #142D52;
  --bg-card: #193A6D;
  --bg-elevated: #20457E;
  --bg-secondary: #18355F;
  --bg-tertiary: #1D4076;
  --bg-hover: rgba(75, 145, 241, .13);
  --bg-selected: rgba(75, 145, 241, .22);
  --bg-header: #142D52;

  --text-primary: #F8FBFF;
  --text-secondary: #D1E2F4;
  --text-muted: #A4B8CD;
  --text-subtle: #B7C9DA;
  --text-disabled: #71849A;

  --border: rgba(91, 169, 255, .24);
  --border-light: rgba(113, 166, 255, .14);
  --border-active: #4B91F1;
  --border-focus: #5BA9FF;

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
--sidebar-background: linear-gradient(180deg, #0F5B55 0%, #123D42 100%);
--workspace-background: linear-gradient(180deg, #0B1D33 0%, #142D52 100%);
--header-background: linear-gradient(90deg, #192B54 0%, #142D52 100%);
--ticker-background: linear-gradient(90deg, #142D52 0%, #192B54 50%, #142D52 100%);
--shadow-card: 0 10px 28px rgba(2, 10, 24, .28);
--focus-ring: 0 0 0 3px rgba(91, 169, 255, .22);
```

Do not introduce `#030...` black panels or gray overlays as normal surfaces. Use the navy hierarchy above.

## 4. Sidebar And Shell

```text
Sidebar parent background  sidebar gradient
Sidebar default text       #EAF2FF
Sidebar active text        #FFFFFF
Sidebar section heading    #8BE7B5
Sidebar border             rgba(139,231,181,.22)
Sidebar item hover         rgba(48,189,111,.12) → rgba(48,189,111,.30)
Sidebar item active        active gradient
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
