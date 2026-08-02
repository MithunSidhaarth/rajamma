/* ==========================================================================
   RAJAMMA ENGINEERING — INTERACTIONS
   Machine slider, Web3Forms integration, file upload, misc UI.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------- Machine slider ---------------- */
  const track = document.querySelector('.machine-track');

  if (track) {
    const prevBtn = document.querySelector('[data-machine-prev]');
    const nextBtn = document.querySelector('[data-machine-next]');

    const scrollAmount = () =>
      (track.querySelector('.machine-card')?.offsetWidth || 380) + 24;

    nextBtn?.addEventListener('click', () => {
      track.scrollBy({
        left: scrollAmount(),
        behavior: 'smooth'
      });
    });

    prevBtn?.addEventListener('click', () => {
      track.scrollBy({
        left: -scrollAmount(),
        behavior: 'smooth'
      });
    });
  }

  /* ---------------- Web3Forms ---------------- */

  document.querySelectorAll("[data-form]").forEach((form) => {

    form.addEventListener("submit", async (e) => {

      e.preventDefault();

      const feedback = form.querySelector("[data-form-feedback]");
      const submitBtn = form.querySelector('button[type="submit"]');

      /* Validation */

      let valid = true;

      form.querySelectorAll("[required]").forEach(field => {

        if (!field.value.trim()) {

          valid = false;
          field.style.borderColor = "var(--color-error)";

        } else {

          field.style.borderColor = "var(--color-silver-soft)";
        }

      });

      if (!valid) {

        feedback.textContent = "Please complete all required fields.";
        feedback.style.color = "var(--color-error)";

        return;

      }

      /* Loading */

      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = "Sending...";

      feedback.textContent = "";
      feedback.style.color = "";

      try {

        const formData = new FormData(form);

        formData.append(
          "access_key",
          "3539e747-ec8e-4523-9e3b-2f24075be972"
        );

        const response = await fetch(
          "https://api.web3forms.com/submit",
          {
            method: "POST",
            body: formData
          }
        );

        const result = await response.json();

        if (result.success) {

          feedback.textContent =
            "✓ Thank you! Your enquiry has been received. Our engineering team will contact you shortly.";

          feedback.style.color = "var(--color-success)";

          form.reset();

          /* Reset file label */

          form.querySelectorAll("[data-file-label]").forEach(label => {

            label.textContent =
              "Drop drawing files here or click to browse (PDF, DWG, STEP)";

          });

        } else {

          throw new Error(result.message);

        }

      } catch (err) {

        console.error(err);

        feedback.textContent =
          "Something went wrong. Please try again or contact us directly.";

        feedback.style.color = "var(--color-error)";

      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

    });

  });

  /* ---------------- File Upload ---------------- */

  document
    .querySelectorAll('.form-file input[type="file"]')
    .forEach((input) => {

      const label = input
        .closest(".form-file")
        .querySelector("[data-file-label]");

      input.addEventListener("change", () => {

        if (!label) return;

        if (input.files.length === 0) {

          label.textContent =
            "Drop drawing files here or click to browse (PDF, DWG, STEP)";

          return;

        }

        label.textContent =
          `${input.files.length} file(s): ` +
          Array.from(input.files)
            .map(file => file.name)
            .join(", ");

      });

    });

  /* ---------------- Footer Year ---------------- */

  document.querySelectorAll("[data-year]").forEach(el => {

    el.textContent = new Date().getFullYear();

  });

})();
