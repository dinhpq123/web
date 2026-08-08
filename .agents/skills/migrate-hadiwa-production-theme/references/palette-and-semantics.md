# Approved Palette And Semantics

## Contents

1. Brand seed
2. Light matrix
3. Dark matrix
4. Sidebar and shell
5. Intentional identity colors
6. Semantic rules

## 1. Brand Seed

Treat these values as canonical for the approved `evg-emerald` preset despite the historical preset name. The approved visual is blue/navy, not emerald green.

```text
Sidebar top          #1E3883
Sidebar bottom       #192B54
Sidebar section      #1EF5DF
Active start         #3371C6
Active end           #285CAA
Light primary        #2984EE
Light hover          #1F73D2
Light active         #285CAA
Dark primary         #5BA9FF
Dark primary hover   #7BBAFF
Dark primary active  #4B91F1
```

Use exactly:

```css
--sidebar-background: linear-gradient(180deg, #1E3883 0%, #192B54 100%);
--sidebar-item-active: linear-gradient(135deg, #3371C6 0%, #285CAA 100%);
--sidebar-section-accent: #1EF5DF;
```

Do not substitute a near-blue, purple navy, green active state, or solid sidebar fill.

## 2. Light Matrix

```css
:root,
.theme-light,
body.light {
  --primary: #2984EE;
  --primary-hover: #1F73D2;
  --primary-active: #285CAA;
  --primary-soft: rgba(41, 132, 238, .12);
  --primary-text: #0B5CAD;
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
  --border-focus: #2984EE;

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
--focus-ring: 0 0 0 3px rgba(41, 132, 238, .18);
```

## 3. Dark Matrix

```css
.theme-dark,
body.dark {
  --primary: #5BA9FF;
  --primary-hover: #7BBAFF;
  --primary-active: #4B91F1;
  --primary-soft: rgba(91, 169, 255, .16);
  --primary-text: #A9D3FF;
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
--workspace-background: linear-gradient(180deg, #1E3883 0%, #192B54 100%);
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
Sidebar section heading    #1EF5DF
Sidebar border             rgba(113,166,255,.28)
Sidebar item hover         rgba(30,245,223,.10)
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
