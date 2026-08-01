/* ==========================================================================
   RAJAMMA ENGINEERING — INTERACTIONS
   Machine slider, form handling, misc UI behaviour.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------- Machine slider ---------------- */
  const track = document.querySelector('.machine-track');
  if (track) {
    const prevBtn = document.querySelector('[data-machine-prev]');
    const nextBtn = document.querySelector('[data-machine-next]');
    const scrollAmount = () => (track.querySelector('.machine-card')?.offsetWidth || 380) + 24;

    nextBtn?.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
    prevBtn?.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
  }

  /* ---------------- RFQ / Contact form ---------------- */
  document.querySelectorAll('[data-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const requiredFields = form.querySelectorAll('[required]');
      let valid = true;
      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = 'var(--color-error)';
        } else {
          field.style.borderColor = 'var(--color-silver-soft)';
        }
      });

      const feedback = form.querySelector('[data-form-feedback]');
      if (!valid) {
        if (feedback) {
          feedback.textContent = 'Please complete all required fields.';
          feedback.style.color = 'var(--color-error)';
        }
        return;
      }

      // Placeholder submit — wire to backend / form endpoint later.
      if (feedback) {
        feedback.textContent = 'Thank you. Our engineering team will respond within one business day.';
        feedback.style.color = 'var(--color-success)';
      }
      form.reset();
    });
  });

  /* ---------------- File upload label ---------------- */
  document.querySelectorAll('.form-file input[type="file"]').forEach((input) => {
    const label = input.closest('.form-file').querySelector('[data-file-label]');
    input.addEventListener('change', () => {
      if (label) {
        label.textContent = input.files.length
          ? `${input.files.length} file(s) selected: ${Array.from(input.files).map(f => f.name).join(', ')}`
          : 'Drop drawing files here or click to browse (PDF, DWG, STEP)';
      }
    });
  });

  /* ---------------- Current year in footer ---------------- */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
