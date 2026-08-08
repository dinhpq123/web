(function () {
  const body = document.body;
  const shell = document.querySelector('.tl-shell');
  const modal = document.getElementById('labModal');
  const drawer = document.getElementById('labDrawer');
  const toastHost = document.getElementById('toastHost');
  const query = new URLSearchParams(window.location.search);
  let activePreset = query.get('preset') || localStorage.getItem('ioc_brand_preset') || 'evg-emerald';

  function updatePresetUi() {
    document.querySelectorAll('[data-action="preset"]').forEach(function (button) {
      const isActive = button.dataset.preset === activePreset;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    const seed = window.BRAND_SEEDS?.[activePreset];
    const tokenValue = document.getElementById('sidebarTokenValue');
    if (seed && tokenValue) tokenValue.textContent = `${seed.sidebarTop} → ${seed.sidebarBottom}`;
  }

  function setTheme(mode) {
    body.classList.toggle('dark', mode === 'dark');
    body.classList.toggle('light', mode !== 'dark');
    localStorage.setItem('ioc_theme', mode);
    if (window.ThemeEngine) window.ThemeEngine.applyGlobalTheme(activePreset, mode);
    updatePresetUi();
    const button = document.querySelector('[data-action="theme"]');
    if (button) button.textContent = mode === 'dark' ? 'Sáng' : 'Tối';
  }

  document.addEventListener('click', function (event) {
    const trigger = event.target.closest('[data-action]');
    if (!trigger) {
      if (!event.target.closest('.tl-dropdown')) document.querySelector('.tl-dropdown')?.classList.remove('open');
      return;
    }
    const action = trigger.dataset.action;
    if (action === 'collapse') shell.classList.toggle('is-collapsed');
    if (action === 'theme') setTheme(body.classList.contains('dark') ? 'light' : 'dark');
    if (action === 'preset') {
      activePreset = trigger.dataset.preset;
      setTheme(body.classList.contains('dark') ? 'dark' : 'light');
    }
    if (action === 'dropdown') trigger.closest('.tl-dropdown').classList.toggle('open');
    if (action === 'modal') modal.hidden = false;
    if (action === 'close-modal') modal.hidden = true;
    if (action === 'drawer') drawer.hidden = false;
    if (action === 'close-drawer') drawer.hidden = true;
    if (action === 'toast') {
      const toast = document.createElement('div');
      toast.className = 'tl-toast';
      toast.textContent = 'Đã cập nhật giao diện thành công.';
      toastHost.appendChild(toast);
      setTimeout(function () { toast.remove(); }, 3200);
    }
  });

  modal.addEventListener('click', function (event) { if (event.target === modal) modal.hidden = true; });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape') { modal.hidden = true; drawer.hidden = true; } });
  const requestedTheme = query.get('theme');
  setTheme(requestedTheme === 'dark' || (!requestedTheme && localStorage.getItem('ioc_theme') === 'dark') ? 'dark' : 'light');
})();
