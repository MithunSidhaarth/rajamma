/* ==========================================================================
   RAJAMMA ENGINEERING — INTERACTIONS
   Machine slider, Web3Forms, file upload, misc UI.
   ========================================================================== */

(function () {
    "use strict";

    /* ==========================================================
       MACHINE SLIDER
    ========================================================== */

    const track = document.querySelector(".machine-track");

    if (track) {

        const prevBtn = document.querySelector("[data-machine-prev]");
        const nextBtn = document.querySelector("[data-machine-next]");

        const scrollAmount = () =>
            (track.querySelector(".machine-card")?.offsetWidth || 380) + 24;

        nextBtn?.addEventListener("click", () => {
            track.scrollBy({
                left: scrollAmount(),
                behavior: "smooth"
            });
        });

        prevBtn?.addEventListener("click", () => {
            track.scrollBy({
                left: -scrollAmount(),
                behavior: "smooth"
            });
        });

    }

    /* ==========================================================
       WEB3FORMS
    ========================================================== */

    document.querySelectorAll("[data-form]").forEach((form) => {

        form.addEventListener("submit", async function (e) {

            e.preventDefault();

            const feedback = form.querySelector("[data-form-feedback]");
            const submitBtn = form.querySelector("button[type='submit']");

            if (feedback) {
                feedback.textContent = "";
            }

            /* ---------------- Validation ---------------- */

            let valid = true;

            form.querySelectorAll("[required]").forEach(field => {

                if (!field.value.trim()) {

                    valid = false;
                    field.style.borderColor = "var(--color-error)";

                } else {

                    field.style.borderColor = "";

                }

            });

            if (!valid) {

                if (feedback) {

                    feedback.style.color = "var(--color-error)";
                    feedback.textContent =
                        "Please complete all required fields.";

                }

                return;

            }

            /* ---------------- Button ---------------- */

            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = "Sending...";

            try {

                const formData = new FormData(form);

                const response = await fetch(
                    "https://api.web3forms.com/submit",
                    {
                        method: "POST",
                        body: formData,
                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

                const result = await response.json();

                console.log(result);

                if (response.ok && result.success) {

                    if (feedback) {

                        feedback.style.color = "var(--color-success)";
                        feedback.textContent =
                            "✓ Thank you! Your enquiry has been received successfully. We will contact you shortly.";

                    }

                    form.reset();

                    form.querySelectorAll("[data-file-label]").forEach(label => {

                        label.textContent =
                            "Drop drawing files here or click to browse (PDF, DWG, STEP)";

                    });

                } else {

                    throw new Error(
                        result.message || "Unable to submit the form."
                    );

                }

            } catch (error) {

                console.error(error);

                if (feedback) {

                    feedback.style.color = "var(--color-error)";
                    feedback.textContent =
                        error.message ||
                        "Something went wrong. Please try again.";

                }

            }

            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

        });

    });

    /* ==========================================================
       FILE LABEL
    ========================================================== */

    document
        .querySelectorAll(".form-file input[type='file']")
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
                    input.files.length +
                    " file(s): " +
                    Array.from(input.files)
                        .map(file => file.name)
                        .join(", ");

            });

        });

    /* ==========================================================
       FOOTER YEAR
    ========================================================== */

    document.querySelectorAll("[data-year]").forEach((el) => {
        el.textContent = new Date().getFullYear();
    });

})();
