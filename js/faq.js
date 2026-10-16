// FAQ search, category filters, and accordion controls
function initFAQ() {
  const search = document.getElementById('faq-search');
  const clearSearch = document.getElementById('faq-clear');
  const items = Array.from(document.querySelectorAll('.faq-item'));
  const count = document.getElementById('faq-count');
  const emptyState = document.getElementById('faq-empty');
  const filters = Array.from(document.querySelectorAll('.faq-category-filter'));
  let activeCategory = 'all';

  function updateResults() {
    const term = (search?.value || '').toLowerCase().trim();
    let visibleCount = 0;

    items.forEach((item) => {
      const question = item.querySelector('.faq-question')?.textContent?.toLowerCase() || '';
      const answer = item.querySelector('.faq-answer')?.textContent?.toLowerCase() || '';
      const matchesTerm = `${question} ${answer}`.includes(term);
      const matchesCategory = activeCategory === 'all' || item.dataset.category === activeCategory;
      const visible = matchesTerm && matchesCategory;
      item.classList.toggle('hidden', !visible);
      if (visible) visibleCount++;
    });

    if (count) count.textContent = String(visibleCount);
    if (emptyState) emptyState.classList.toggle('hidden', visibleCount > 0);
    if (clearSearch) clearSearch.hidden = !term;
  }

  search?.addEventListener('input', updateResults);

  clearSearch?.addEventListener('click', () => {
    if (!search) return;
    search.value = '';
    search.focus();
    updateResults();
  });

  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      activeCategory = filter.dataset.category || 'all';
      filters.forEach((button) => {
        button.setAttribute('aria-pressed', String(button === filter));
      });
      updateResults();
    });
  });

  document.querySelectorAll('.faq-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const content = document.getElementById(toggle.dataset.target);
      const item = toggle.closest('.faq-item');
      const icon = toggle.querySelector('.faq-icon');
      if (!content) return;

      const isOpening = content.classList.contains('hidden');
      content.classList.toggle('hidden', !isOpening);
      toggle.setAttribute('aria-expanded', String(isOpening));
      item?.classList.toggle('is-open', isOpening);
      if (icon) icon.style.transform = isOpening ? 'rotate(180deg)' : 'rotate(0deg)';
    });
  });

  updateResults();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFAQ);
} else {
  initFAQ();
}
