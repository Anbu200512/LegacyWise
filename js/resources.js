// Print the planning checklist.
document.addEventListener('DOMContentLoaded', () => {
  const printButton = document.getElementById('print-checklist');
  if (printButton) printButton.addEventListener('click', () => window.print());

  const checkboxes = [...document.querySelectorAll('#planning-checklist input[type="checkbox"]')];
  const progress = document.querySelector('.checklist-progress-track');
  const progressLabel = document.getElementById('checklist-progress-label');
  const progressFill = document.getElementById('checklist-progress-fill');
  const storageKey = 'legacywise-planning-checklist';

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    checkboxes.forEach((checkbox, index) => {
      checkbox.checked = Boolean(saved[index]);
    });
  } catch {
    // Keep the checklist usable when browser storage is unavailable.
  }

  const updateProgress = () => {
    const completed = checkboxes.filter((checkbox) => checkbox.checked).length;
    const total = checkboxes.length;
    if (progressLabel) progressLabel.textContent = `${completed} of ${total} complete`;
    if (progress) progress.setAttribute('aria-valuenow', String(completed));
    if (progressFill) progressFill.style.width = `${total ? (completed / total) * 100 : 0}%`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(checkboxes.map((checkbox) => checkbox.checked)));
    } catch {
      // Progress still updates for this visit if storage is unavailable.
    }
  };

  checkboxes.forEach((checkbox) => checkbox.addEventListener('change', updateProgress));
  updateProgress();
});
