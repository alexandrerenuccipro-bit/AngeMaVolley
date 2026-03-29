(function initThemeToggle() {
  const THEME_STORAGE_KEY = 'angema-theme';
  const root = document.documentElement;

  function getSavedTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return null;
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    const switchInput = document.getElementById('theme-switch');
    if (switchInput) {
      switchInput.checked = theme === 'light';
      switchInput.setAttribute('aria-checked', String(theme === 'light'));
    }
  }

  function bindSwitch() {
    const switchInput = document.getElementById('theme-switch');
    if (!switchInput) {
      return;
    }

    switchInput.addEventListener('change', function onThemeChange(event) {
      applyTheme(event.target.checked ? 'light' : 'dark');
    });
  }

  const initialTheme = getSavedTheme() || 'light';
  applyTheme(initialTheme);
  bindSwitch();
})();
