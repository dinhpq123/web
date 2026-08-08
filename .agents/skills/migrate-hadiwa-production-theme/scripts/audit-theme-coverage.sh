#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"

if ! command -v rg >/dev/null 2>&1; then
  printf 'error: ripgrep (rg) is required\n' >&2
  exit 2
fi

if [[ ! -d "$ROOT" ]]; then
  printf 'error: directory not found: %s\n' "$ROOT" >&2
  exit 2
fi

GLOBS=(
  --glob '*.{css,scss,sass,less,html,js,jsx,ts,tsx,vue,svelte,svg}'
  --glob '!node_modules/**'
  --glob '!dist/**'
  --glob '!build/**'
  --glob '!coverage/**'
  --glob '!vendor/**'
)

scan() {
  local title="$1"
  local pattern="$2"
  printf '\n=== %s ===\n' "$title"
  rg -n -i "${GLOBS[@]}" -- "$pattern" "$ROOT" || true
}

scan 'HEX COLOR LITERALS' '#[0-9a-f]{3,8}\b'
scan 'RGB/HSL COLOR LITERALS' '(rgba?|hsla?)\s*\('
scan 'INLINE STYLE ATTRIBUTES' "style\\s*=\\s*['\"]"
scan 'DIRECT STYLE MUTATION' '\.style\.(color|background|backgroundColor|border|borderColor|boxShadow|fill|stroke)\s*='
scan 'SVG FIXED FILL OR STROKE' "(fill|stroke)\\s*=\\s*['\"](#[0-9a-f]{3,8}|rgba?\\(|[a-z]+)['\"]"
scan 'LEGACY OR SUSPICIOUS HADIWA COLORS' '#00d2ff|#00f2ff|#0066ff|#00f080|#9d70ff|rgba?\(\s*0\s*,\s*(200|210|242)\s*,\s*255'
scan 'GENERIC GREEN/PURPLE VARIABLE USAGE' 'var\(--(green|purple|emerald|violet)(-[a-z0-9-]+)?\)'

# --- Tailwind CSS ---
# Tailwind utility colors live in class="..." strings and in tailwind.config,
# not as hex/rgb literals in the markup, so the scans above miss them entirely.
TAILWIND_COLOR_WORDS='(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|grey|zinc|neutral|stone)'

scan 'TAILWIND UTILITY COLOR CLASSES' "(bg|text|border|ring|divide|outline|fill|stroke|from|via|to|shadow|accent|caret|decoration)-${TAILWIND_COLOR_WORDS}-[0-9]{2,3}\\b"
scan 'TAILWIND CONFIG CUSTOM COLORS' 'colors\s*:\s*\{|extend\s*:\s*\{[^}]*colors'
scan 'TAILWIND V4 @theme COLOR TOKENS' '@theme\b|--color-[a-z0-9-]+\s*:'

if [[ -f "$ROOT/tailwind.config.js" || -f "$ROOT/tailwind.config.ts" || -f "$ROOT/tailwind.config.cjs" ]]; then
  printf '\n=== TAILWIND CONFIG FILE FOUND ===\n'
  printf 'Read tailwind.config.* directly and diff theme.extend.colors against the approved palette in palette-and-semantics.md.\n'
fi

printf '\nAudit complete. Classify each result; do not replace literals blindly.\n'
printf 'If the app is a Tailwind project, utility-class colors and tailwind.config are authoritative — a clean hex/rgb scan alone does NOT mean the theme is clean.\n'
