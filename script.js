
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
   3. CONTACT FORM — FORMSPREE
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

    const response = await fetch(
      FORMSPREE_ENDPOINT,
      {
        method: 'POST',
        body: new FormData(form),
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

    if (status) {
      status.textContent =
        'Thank you! Your enquiry has been submitted successfully. We will contact you shortly.';
    }

    form.reset();

  } catch (error) {

    console.error('AGNEX contact form error:', error);

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
