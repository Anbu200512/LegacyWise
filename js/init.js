// init.js - apply saved theme & direction before paint to avoid flashing
(function () {
  try {
    var THEME_KEY = 'legacywise_theme';
    var DIR_KEY = 'legacywise_direction';
    var saved = localStorage.getItem(THEME_KEY);
    var isDark = saved === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.setAttribute('dir', localStorage.getItem(DIR_KEY) || 'ltr');
  } catch (e) {
    /* ignore storage errors */
  }
})();
