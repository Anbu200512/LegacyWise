// main.js - Shared functionality for LegacyWise
const THEME_KEY = 'legacywise_theme';
const DIR_KEY = 'legacywise_direction';

// --- Helpers -------------------------------------------------------------
// Desktop and mobile controls share IDs, so always select every matching control.
function themeToggles() {
  return document.querySelectorAll('#theme-toggle, .theme-toggle');
}
function dirToggles() {
  return document.querySelectorAll('#dir-toggle, .dir-toggle');
}
function readSetting(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}
function saveSetting(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    // The controls still work when storage is unavailable; the choice lasts
    // until the page is closed.
  }
}
function renderIcons() {
  try {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  } catch (error) {
    // A missing icon must never prevent the display controls from working.
  }
}
function setIcon(selector, iconName) {
  document.querySelectorAll(selector).forEach((el) => {
    el.setAttribute('data-lucide', iconName);
  });
  renderIcons();
}

// --- Theme (dark / light) ------------------------------------------------
function applyTheme(isDark) {
  const root = document.documentElement;
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  setIcon('#theme-icon, .theme-icon', isDark ? 'moon' : 'sun');
  themeToggles().forEach((btn) => {
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  });
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  saveSetting(THEME_KEY, isDark ? 'light' : 'dark');
  applyTheme(!isDark);
}

function initTheme() {
  const saved = readSetting(THEME_KEY);
  applyTheme(saved === 'dark');
}

function initThemeToggle() {
  themeToggles().forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });
  });
}

// --- Direction (LTR / RTL) ----------------------------------------------
function applyDirection(dir) {
  const normalized = dir === 'rtl' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', normalized);
  document.documentElement.style.direction = normalized;
  if (document.body) {
    document.body.setAttribute('dir', normalized);
    document.body.style.direction = normalized;
  }
  setIcon('#dir-icon, .dir-icon', normalized === 'rtl' ? 'arrow-left-right' : 'arrow-right-left');
  dirToggles().forEach((btn) => {
    const label = normalized === 'rtl' ? 'Switch to LTR' : 'Switch to RTL';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  });
}

function toggleDirection() {
  const current = document.documentElement.getAttribute('dir') || 'ltr';
  const next = current === 'rtl' ? 'ltr' : 'rtl';
  saveSetting(DIR_KEY, next);
  applyDirection(next);
}

function initDirection() {
  applyDirection(readSetting(DIR_KEY) || 'ltr');
}

function initDirToggle() {
  dirToggles().forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleDirection();
    });
  });
}

// --- Mobile navigation ---------------------------------------------------
function initMobileNav() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const icon = document.getElementById('mobile-menu-icon');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const wasHidden = menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    if (icon) {
      icon.setAttribute('data-lucide', wasHidden ? 'x' : 'menu');
      renderIcons();
    }
  });
}

// --- Dropdowns -----------------------------------------------------------
function initDropdowns() {
  const dropdownBtns = document.querySelectorAll('[data-dropdown]');
  dropdownBtns.forEach((btn) => {
    const target = btn.dataset.dropdown;
    const menu = document.getElementById(target);
    if (!menu) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = menu.classList.contains('hidden');
      document.querySelectorAll('.dropdown-menu').forEach((m) => m.classList.add('hidden'));
      if (isHidden) {
        menu.classList.remove('hidden');
      }
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach((m) => m.classList.add('hidden'));
  });
}

// --- Smooth scrolling ----------------------------------------------------
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href !== '#' && href.length > 1) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

// --- Notifications -------------------------------------------------------
function showNotification(message, type = 'success') {
  const container = document.getElementById('notification-container');
  if (!container) return;
  const div = document.createElement('div');
  div.className = `p-4 rounded-lg shadow-lg border max-w-sm transition-all ${type === 'success' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-200' : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-200'}`;
  div.textContent = message;
  container.appendChild(div);
  setTimeout(() => {
    div.classList.add('opacity-0');
    setTimeout(() => div.remove(), 300);
  }, 5000);
}

// --- Init ----------------------------------------------------------------
function init() {
  // Attach controls first so a storage/media/icon error cannot leave them dead.
  initThemeToggle();
  initDirToggle();
  initTheme();
  initDirection();
  initMobileNav();
  initDropdowns();
  initSmoothScroll();
  renderIcons();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
