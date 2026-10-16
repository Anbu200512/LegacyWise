// contact.js - Contact form functionality
function initContactForm() {
  const form = document.getElementById('contact-form');
  const clearBtn = document.getElementById('clear-demo-btn');
  const statusDiv = document.getElementById('form-status');
  
  const DEMO_KEY = 'legacywise_demo_enquiries';
  
  function loadDemoData() {
    const data = JSON.parse(localStorage.getItem(DEMO_KEY) || '[]');
    const list = document.getElementById('demo-enquiries');
    if (!list) return;
    list.innerHTML = '';
    if (data.length === 0) {
      list.innerHTML = '<p class="text-sm text-gray-600 dark:text-gray-400">No demo enquiries saved.</p>';
      return;
    }
    data.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'p-3 border border-gray-200 dark:border-gray-700 rounded-md';
      div.innerHTML = `
        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">${escapeHtml(item.fullName)} - ${escapeHtml(item.email)}</p>
        <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Type: ${escapeHtml(item.consultationType)} | Method: ${escapeHtml(item.preferredContact)}</p>
        <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">${new Date(item.timestamp).toLocaleString()}</p>
      `;
      list.appendChild(div);
    });
  }
  
  function saveDemoData(data) {
    const existing = JSON.parse(localStorage.getItem(DEMO_KEY) || '[]');
    existing.push(data);
    localStorage.setItem(DEMO_KEY, JSON.stringify(existing));
  }
  
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Remove all saved demo enquiry data from localStorage?')) {
        localStorage.removeItem(DEMO_KEY);
        loadDemoData();
      }
    });
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Clear previous errors
      form.querySelectorAll('.field-error').forEach(el => el.textContent = '');
      
      const fullName = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const preferredContact = document.getElementById('preferredContact').value;
      const consultationType = document.getElementById('consultationType').value;
      const preferredDate = document.getElementById('preferredDate').value;
      const preferredTime = document.getElementById('preferredTime').value;
      const enquiry = document.getElementById('enquiry').value.trim();
      const consent = document.getElementById('consent').checked;
      
      let isValid = true;
      
      if (!fullName) {
        document.getElementById('error-fullName').textContent = 'Full name is required';
        isValid = false;
      }
      if (!email) {
        document.getElementById('error-email').textContent = 'Email address is required';
        isValid = false;
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          document.getElementById('error-email').textContent = 'Please enter a valid email address';
          isValid = false;
        }
      }
      if (!preferredContact) {
        document.getElementById('error-preferredContact').textContent = 'Please select a contact method';
        isValid = false;
      }
      if (!consultationType) {
        document.getElementById('error-consultationType').textContent = 'Please select a consultation type';
        isValid = false;
      }
      if (!preferredDate) {
        document.getElementById('error-preferredDate').textContent = 'Preferred date is required';
        isValid = false;
      }
      if (!preferredTime) {
        document.getElementById('error-preferredTime').textContent = 'Preferred time is required';
        isValid = false;
      }
      if (!enquiry) {
        document.getElementById('error-enquiry').textContent = 'Please provide a brief enquiry';
        isValid = false;
      }
      if (!consent) {
        document.getElementById('error-consent').textContent = 'Please confirm your consent to be contacted';
        isValid = false;
      }
      
      if (!isValid) {
        if (statusDiv) {
          statusDiv.innerHTML = '<div class="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-md text-red-800 dark:text-red-200">Please fix the errors above.</div>';
        }
        return;
      }
      
      // Save minimal demo data
      const demoData = {
        fullName,
        email,
        phone: phone || null,
        preferredContact,
        consultationType,
        preferredDate,
        preferredTime,
        enquiry,
        timestamp: new Date().toISOString()
      };
      saveDemoData(demoData);
      
      if (statusDiv) {
        statusDiv.innerHTML = '<div class="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-md text-green-800 dark:text-green-200"><strong>Enquiry submitted (demo)</strong><br>This is a demonstration form only - no appointment is confirmed. The information has been saved locally in your browser for demo purposes only.</div>';
      }
      
      form.reset();
      loadDemoData();
      
      setTimeout(() => {
        if (statusDiv) statusDiv.innerHTML = '';
      }, 8000);
    });
  }
  
  loadDemoData();
}

document.addEventListener('DOMContentLoaded', initContactForm);
