/* ==========================================================================
   RAJAMMA ENGINEERING — MOTION CORE
   Lenis smooth scroll + GSAP orchestration. Loaded on every page.
   ========================================================================== */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- Lenis smooth scroll ---------------- */
  let lenis;
  if (!prefersReduced && window.Lenis) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
  }

  /* ---------------- Loader ---------------- */
  const loader = document.querySelector('.loader');
  function runLoader() {
    if (!loader) { document.body.classList.add('is-loaded'); return; }
    const circle = loader.querySelector('circle');
    const label = loader.querySelector('.loader-label');
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.classList.add('is-loaded');
        loader.remove();
        initPageReveals();
      }
    });
    if (circle) tl.to(circle, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, 0);
    if (label) tl.fromTo(label, { opacity: 0.3 }, { opacity: 1, duration: 0.9, ease: 'power1.inOut', repeat: 1, yoyo: true }, 0);
    tl.to(loader, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, 1.0);
  }

  /* ---------------- Nav scroll state ---------------- */
  const nav = document.querySelector('.site-nav');
  function initNav() {
    if (!nav) return;
    ScrollTrigger.create({
      start: 'top -80',
      onUpdate: (self) => {
        nav.classList.toggle('is-scrolled', self.scroll() > 80);
      }
    });

    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.mobile-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.classList.toggle('is-active', isOpen);
        if (lenis) isOpen ? lenis.stop() : lenis.start();
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
      menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.classList.remove('is-active');
        if (lenis) lenis.start();
        document.body.style.overflow = '';
      }));
    }
  }

  /* ---------------- Scroll progress bar ---------------- */
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    gsap.to(bar, {
      width: '100%',
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
    });
  }

  /* ---------------- Scroll reveals (generic) ---------------- */
  function initPageReveals() {
    if (prefersReduced) {
      gsap.set('[data-reveal]', { opacity: 1, y: 0, clearProps: 'all' });
      document.querySelectorAll('[data-counter]').forEach((el) => {
        const target = parseFloat(el.dataset.counter);
        const decimals = (el.dataset.counter.split('.')[1] || '').length;
        el.textContent = target.toFixed(decimals);
      });
      return;
    }

    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      const type = el.dataset.reveal || 'up';
      const from = type === 'up' ? { y: 48, opacity: 0 } :
                   type === 'fade' ? { opacity: 0 } :
                   type === 'scale' ? { opacity: 0, scale: 0.94 } :
                   { y: 48, opacity: 0 };
      gsap.fromTo(el, from, {
        y: 0, opacity: 1, scale: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    // Staggered groups
    gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
      const items = group.querySelectorAll('[data-reveal-item]');
      gsap.fromTo(items, { y: 36, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: group, start: 'top 85%' }
      });
    });

    // Text mask reveal for big headings
    gsap.utils.toArray('[data-text-reveal]').forEach((el) => {
      const split = el.textContent.trim().split(/\s+/);
      el.innerHTML = split.map(w => `<span class="word"><span class="word-inner">${w}</span></span>`).join(' ');
      gsap.set(el.querySelectorAll('.word'), { overflow: 'hidden', display: 'inline-block' });
      gsap.fromTo(el.querySelectorAll('.word-inner'), { yPercent: 110 }, {
        yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.035,
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    // Counters (skip hero-specs counters — those run immediately in heroEntrance)
    gsap.utils.toArray('[data-counter]').forEach((el) => {
      if (el.closest('.hero-specs')) return;
      const target = parseFloat(el.dataset.counter);
      const decimals = (el.dataset.counter.split('.')[1] || '').length;
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: target, duration: 1.8, ease: 'power2.out',
            onUpdate: () => { el.textContent = obj.val.toFixed(decimals); }
          });
        }
      });
    });

    // Parallax media
    gsap.utils.toArray('[data-parallax]').forEach((el) => {
      const strength = parseFloat(el.dataset.parallax) || 60;
      gsap.fromTo(el, { yPercent: -strength / 10 }, {
        yPercent: strength / 10, ease: 'none',
        scrollTrigger: { trigger: el.closest('[data-parallax-wrap]') || el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // Mouse parallax on hero rings
    const rings = document.querySelector('[data-mouse-parallax]');
    if (rings && window.matchMedia('(hover: hover)').matches) {
      window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 24;
        const y = (e.clientY / window.innerHeight - 0.5) * 24;
        gsap.to(rings, { x, y, duration: 1.2, ease: 'power3.out' });
      });
    }

    // Section divider ring rotation (signature motif)
    gsap.utils.toArray('[data-ring-rotate]').forEach((el) => {
      gsap.to(el, {
        rotate: 360, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
      });
    });
  }

  /* ---------------- Hero load sequence ---------------- */
  function heroEntrance() {
    if (prefersReduced) return;
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo('.hero-content .eyebrow', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      .fromTo('.hero-content .h-hero .word-inner', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.03 }, '-=0.35')
      .fromTo('.hero-sub', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
      .fromTo('.hero-actions', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
      .fromTo('.hero-specs', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
      .add(() => {
        document.querySelectorAll('.hero-specs [data-counter]').forEach((el) => {
          const target = parseFloat(el.dataset.counter);
          const decimals = (el.dataset.counter.split('.')[1] || '').length;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target, duration: 1.4, ease: 'power2.out',
            onUpdate: () => { el.textContent = obj.val.toFixed(decimals); }
          });
        });
      }, '-=0.5')
      .fromTo('.hero-rings', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out' }, '-=1.2')
      .fromTo('.scroll-cue', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.4');
  }

  /* ---------------- Init ---------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initScrollProgress();

    // Prepare hero headline for word-reveal before loader completes
    const heroHeading = document.querySelector('[data-text-reveal-hero]');
    if (heroHeading) {
      const split = heroHeading.innerHTML.trim().split(/\s+/);
      heroHeading.innerHTML = split.map(w => `<span class="word"><span class="word-inner">${w}</span></span>`).join(' ');
      gsap.set(heroHeading.querySelectorAll('.word'), { overflow: 'hidden', display: 'inline-block' });
      gsap.set(heroHeading.querySelectorAll('.word-inner'), { yPercent: 110 });
    }

    runLoader();
    setTimeout(heroEntrance, 900);
  });

  window.addEventListener('load', () => {
    // Fonts/images can shift layout after DOMContentLoaded; recalc trigger positions
    // so scroll-based reveals and counters (facts-grid, etc.) fire at the right point.
    ScrollTrigger.refresh();
  });
})();
