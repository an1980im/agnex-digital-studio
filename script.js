
'use strict';

/* ==========================================
   AGNEX DIGITAL STUDIO
   Website JavaScript
   ========================================== */


/* ==========================================
   1. MOBILE NAVIGATION
   ========================================== */

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');

menuButton?.addEventListener('click', () => {

  if (!nav) return;

  const isOpen = nav.classList.toggle('open');

  menuButton.setAttribute(
    'aria-expanded',
    String(isOpen)
  );

  menuButton.textContent = isOpen ? '×' : '☰';

});

nav?.querySelectorAll('a').forEach(link => {

  link.addEventListener('click', () => {

    nav.classList.remove('open');

    if (menuButton) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.textContent = '☰';
    }

  });

});


/* ==========================================
   2. AUTOMATIC COPYRIGHT YEAR
   ========================================== */

const yearElement = document.querySelector('#year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


/* ==========================================
   3. WEBSITE VISITOR COUNTER
   GoatCounter — GitHub Pages Compatible
   ========================================== */

const GOATCOUNTER_SITE =
  'https://agnexdigital.goatcounter.com';

const counterElement =
  document.querySelector('#visitor-count');

const counterStatus =
  document.querySelector('#visitor-status');

async function loadVisitorCount() {

  if (!counterElement || !counterStatus) return;

  counterElement.textContent = '—';
  counterStatus.textContent = 'Loading visit count...';

  try {

    const response = await fetch(
      `${GOATCOUNTER_SITE}/counter/TOTAL.json`,
      {
        method: 'GET',
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(
        `Visitor counter HTTP ${response.status}`
      );
    }

    const data = await response.json();

    if (
      typeof data.count !== 'string' &&
      typeof data.count !== 'number'
    ) {
      throw new Error('Invalid visitor count');
    }

    // GoatCounter may return a formatted count.
    counterElement.textContent = String(data.count);

    counterStatus.textContent =
      'Total recorded page visits';

  } catch (error) {

    console.warn(
      'AGNEX visitor counter unavailable:',
      error
    );

    counterElement.textContent = '—';

    counterStatus.textContent =
      'Visit count unavailable';

  }

}

// Display the recorded visit count.
loadVisitorCount();


/* ==========================================
   4. CONTACT FORM — FORMSPREE
   ========================================== */

const FORMSPREE_ENDPOINT =
  'https://formspree.io/f/xdegdbjp';

const form = document.querySelector('#contact-form');

let isSubmitting = false;

form?.addEventListener('submit', async (event) => {

  event.preventDefault();

  if (isSubmitting) return;

  if (!form.reportValidity()) return;

  const status =
    document.querySelector('#form-status');

  const submitButton =
    form.querySelector('[type="submit"]');

  const originalButtonText =
    submitButton?.textContent || 'Send Enquiry';

  isSubmitting = true;

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
  }

  if (status) {
    status.setAttribute('role', 'status');
    status.textContent = 'Submitting your enquiry...';
  }

  try {

    const formData = new FormData(form);

    const response = await fetch(
      FORMSPREE_ENDPOINT,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {

      let errorMessage = 'Submission failed';

      try {
        const result = await response.json();

        if (Array.isArray(result.errors)) {
          errorMessage = result.errors
            .map(item => item.message)
            .filter(Boolean)
            .join('; ') || errorMessage;
        }
      } catch (_) {
        // Use the generic error message.
      }

      throw new Error(errorMessage);
    }

    // Show success only after Formspree accepts the request.
    if (status) {
      status.textContent =
        'Thank you! Your enquiry has been submitted successfully. We will contact you shortly.';
    }

    form.reset();

  } catch (error) {

    console.error(
      'AGNEX contact form error:',
      error
    );

    if (status) {
      status.textContent =
        'Sorry, your enquiry could not be submitted. Please try again.';
    }

  } finally {

    isSubmitting = false;

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }

  }

});
