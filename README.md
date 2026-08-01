# Rajamma Engineering Pvt. Ltd. — Website

Premium industrial website for Rajamma Engineering, a heavy precision
machining company in Ambattur Industrial Estate, Chennai (est. 1993).
Built vanilla HTML/CSS/JS — no framework — with GSAP + Lenis for motion.
GitHub Pages compatible.

## Status

**Complete and production-quality:**

- Full design system (`css/tokens.css`, `css/base.css`, `css/components.css`)
- Home page (`index.html`) — all 10 sections: hero, overview, capabilities,
  machine highlights, industries, workflow, why-us, client logos,
  testimonials, contact CTA
- About (`pages/about.html`) — story, vision/mission/values, facts
- **Owner (`pages/owner.html`)** — Managing Director profile and board of
  directors
- **Machines &amp; Capabilities (`pages/machines.html`)** — merged page: all
  8 core capabilities, full list of 19 machining operations, the full
  7-machine fleet with real specs (make, quantity, working envelope,
  applications, and a photo slot for each machine), and overall machining
  capacity facts
- **Industries (`pages/industries.html`)** — the 6 sectors served
- Contact (`pages/contact.html`) — map embed, phone/email/WhatsApp, form
- RFQ (`pages/rfq.html`) — drawing upload + quote request form
- Privacy Policy (`pages/privacy.html`), custom 404 (`404.html`)
- SEO scaffolding: meta, Open Graph, Twitter Cards, Schema.org (Manufacturer
  + LocalBusiness), `robots.txt`, `sitemap.xml`, `manifest.json`, `.nojekyll`
- Shared nav, footer, loading screen, scroll progress bar, floating
  WhatsApp button, mobile menu — present on every page
- Real business details wired in throughout: registered address, phone,
  email, GSTIN (`33AAACR3633D1ZX`), Udyam/MSME registration
  (`UDYAM-TN-24-0009966`)

**Not yet built** (linked from footer but pages don't exist yet):
`pages/gallery.html`, `pages/downloads.html`. These follow the same
`inner.css` system as the other interior pages — ask to continue the build
and they'll be added in the same style.

## Design system

- **Color** — Graphite `#14171B` (ink), Steel Blue `#1B4C82` (primary),
  Precision Cyan `#2E86D6` (accent), Machined Silver `#C9CED6` (hairlines),
  off-white `#F7F8FA` (background).
- **Type** — Space Grotesk (display), Inter (body), JetBrains Mono (every
  spec, tolerance and dimension — mirrors engineering-drawing lettering).
- **Signature motif** — concentric "toolpath rings" that trace open like a
  boring bar cutting a bore true, used in the hero, section dividers and
  the loading screen. Micro-annotations (`⌀450`, `±0.02mm`, `Ra 1.6`) are
  used as real GD&T-style callouts, not decorative numbering.
- All tokens live in `css/tokens.css` — change a value once, it propagates
  everywhere.

## Structure

```
/index.html            Home page
/404.html
/robots.txt  /sitemap.xml  /manifest.json  /.nojekyll
/css/
  tokens.css            Design tokens (color, type, spacing, motion)
  base.css              Reset, typography, buttons, cards, utilities
  components.css        Nav, loader, footer, WhatsApp button, forms
  home.css               Home-page-only sections (also used by capabilities/
                          machines/industries/quality for shared grid styles)
  inner.css              Shared interior-page layout (hero banner, grids)
/js/
  motion.js              Lenis + GSAP: loader, nav state, scroll reveals,
                          counters, parallax, text-mask reveal
  interactions.js         Machine slider, form validation, misc UI
/pages/
  about.html  owner.html  machines.html
  industries.html  contact.html  rfq.html  privacy.html
/assets/
  svg/favicon.svg
  images/                Empty — placeholder photography removed, see below
```

## Images

This build ships **without photography**. `assets/images/` is present but
empty. Every `<img>` tag that needs a photo (home page, about page) already
has the correct `alt`, `width`, and `height` attributes set — add real
photography at the same filenames (e.g. `assets/images/hero-machining.svg`
→ replace with real photography and keep the `src` pointing at that
filename, or update the `src` extension) and the layout will pick it up
as-is.

## Running locally

Static site, no build step. Serve the root folder with any static
server, e.g.:

```
npx serve .
# or
python3 -m http.server 8000
```

Open `index.html` (or `http://localhost:8000`).

## Tech

Vanilla HTML5 / CSS3 / JS — no React, Vue, Angular, Bootstrap or Tailwind,
per brief. GSAP + ScrollTrigger and Lenis are loaded from CDN
(`unpkg.com`, `cdnjs.cloudflare.com`); Google Fonts loaded from
`fonts.googleapis.com`. Everything else is self-contained.

## Before going live

- Add real photography (see **Images** above)
- Replace testimonial placeholders on the home page with verified client
  quotes
- Have legal counsel review `pages/privacy.html`
- Wire the RFQ/contact forms to a real backend or form endpoint (they
  currently validate client-side only — see `js/interactions.js`)
- Build `pages/gallery.html` and `pages/downloads.html` if needed
