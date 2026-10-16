document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.footer-newsletter-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const status = form.parentElement.querySelector('.footer-newsletter-status');
      if (status) {
        status.textContent = 'Thanks for your interest. Newsletter signup is a demo and no email was sent.';
        status.setAttribute('role', 'status');
      }
      form.reset();
    });
  });
});
