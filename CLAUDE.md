# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A static one-page portfolio/marketing website for **Mahendra Facility Services** (the trading name the client now uses everywhere; formerly "Mahendra Consultancy Services"), a Pune-based manpower/labour-contracting and housekeeping-staffing firm run by Managing Director Mahendra P. Sangale.

There is no application logic, backend, or build pipeline here — this is a brochure site. All content originates from two source files kept in `source-material/` (do not delete or treat as dead weight — they are the client's only brief):

- `source-material/mahendra CO prof_20231004_211536_0000.pdf` — 12-page company profile (about, services, statutory registrations, clients, gallery, contact).
- `source-material/WhatsApp Image 2026-07-28 at 16.06.53.jpeg` — business card (logo, MD name, phone, registered office address).

Real photos/logos/badges were already extracted from those two files into `assets/images/` (see inventory below) — reuse these rather than re-extracting or substituting stock imagery.

## Tech stack & constraints

- Plain **HTML + CSS + vanilla JS**. No frameworks (React/Vue/etc.), no bundlers, no npm dependencies, no build step.
- **Animation libraries are vendored locally** in `js/vendor/` — GSAP + ScrollTrigger (scroll animations) and Lenis (smooth scroll). Loaded via plain `<script>`/`<link>` tags, NOT a CDN, so the site still works fully offline. `script.js` degrades gracefully (static, no smooth scroll) if a lib is missing or `prefers-reduced-motion` is set.
- Single scrolling page (`index.html`) with anchor-linked sections and a fixed nav — not a multi-page site.
- Must run by simply opening `index.html` in a browser, or via any static file server. No server-side code.

## Running / previewing

There is no build/test/lint tooling in this repo. To preview:

```
# any static server works, e.g.:
npx serve .
# or just open index.html directly in a browser
```

## Structure

```
index.html          single page: topbar, sticky nav, hero, stats, about, services, process, compliance, clients, contact, footer
css/style.css        all styling — corporate design system (Archivo/Inter fonts), teal/gold brand tokens, responsive
js/script.js          Lenis smooth scroll + GSAP ScrollTrigger subtle reveals/counters, nav, back-to-top
js/vendor/            vendored libs: gsap.min.js, ScrollTrigger.min.js, lenis.min.js, lenis.css
assets/images/        logo, official compliance badges, and high-res Unsplash photos (see inventory)
source-material/       original client PDF + business card + goal-prompt.md — reference only, not shipped
```

## Brand

- Logo: `assets/images/logo.jpg` — gold "M" wordmark on dark petrol teal (client-supplied, Jul 2026).
- Palette is drawn from the logo: primary teal `#00343C` (logo ground) · gold accent `#C6A14F` (logo lettering) · darker gold `#96772F` for small text on light backgrounds · deep teal `#002229` (topbar/footer) · warm off-white `#FAFAF8`.
- Type: **Archivo** for display/headings, **Inter** for body (Google Fonts `<link>`; site still renders acceptably if fonts fail).
- The look is deliberately corporate/restrained (2026 revamp at client request — "shouldn't look AI-built"): flat colors, 1px borders, small radii, no gradients/orbs/glassmorphism, gold used sparingly (kicker rules, nav CTA, process numbers). Keep the teal/gold palette — the earlier red/navy scheme is retired.
- Numbers on the site must stay defensible: stats are 7+ years, 6 service lines, 8 registrations, 100% compliance. A fabricated "98.9% client retention" figure was removed — don't reintroduce invented metrics.

## Asset inventory (assets/images/)

Photos are **copyright-free Unsplash images** (the originally-extracted PDF photos were too low-res/blurry and were replaced at the client's request). The logo, the 8 government compliance badges, and client names are the company's own — keep those; don't swap them for stock.

| File | Content | Used in |
|---|---|---|
| `logo.jpg` | Company logo (brand) — gold "M" wordmark on dark-teal ground, "MAHENDRA / FACILITY SERVICES" | Navbar, footer, favicon |
| `img-hero.jpg` | Industrial technician at machinery (Unsplash) | Hero |
| `img-about.jpg` | Staff at computers (Unsplash) | About |
| `svc-manpower.jpg` | Worker team on site (Unsplash) | Manpower service card |
| `svc-contract-labour.jpg` | Construction/labour crew (Unsplash) | Contract Labour card |
| `svc-housekeeping.jpg` | Cleaning staff (Unsplash) | Housekeeping card |
| `svc-industrial.jpg` | Warehouse/industrial ops (Unsplash) | Industrial Manpower card |
| `svc-staffing.jpg` | Team collaborating (Unsplash) | Staffing card |
| `svc-contract-employment.jpg` | Business handshake (Unsplash) | Contract Employment card |
| `img-contact.jpg` | Modern office (Unsplash) | Currently unused (contact panel is flat teal) — kept in case a photo treatment returns |
| `badge-shopact.jpg` · `badge-epfo.jpg` · `badge-esic.jpg` · `badge-gst.jpg` · `badge-ptax.jpg` · `badge-mlwb.png` · `badge-udyog-msme.jpg` · `badge-labour-bureau.png` | Official govt registration emblems (brand-owned) | Compliance grid |

Client logos are rendered as **text cards** (Dream Plast, Omnia Toys, Venky's) in the Clients section — the old `clients-strip.jpg` (red-bordered PDF crop) is no longer used.

## Animation / interaction notes

- `data-anim="..."` attributes drive GSAP reveal presets — all deliberately subtle small fade-ups (side-slide preset names still exist in `script.js` but map to fade-up; keep it that way). Grouped per-section with a small stagger. `data-count` + `data-suffix` drive animated number counters. `data-parallax` is still supported by `script.js` but no longer used in the markup — the corporate look avoids parallax.
- Mobile-nav breakpoint is **900px** (hamburger below that) — kept in sync between the CSS media query and the `innerWidth > 900` check in `script.js`. Change both together.
- GSAP sets initial off-screen transforms on `[data-anim]`; `html`/`body` use `overflow-x: clip` so those pre-reveal transforms never create horizontal scroll. Don't remove the clip.

## Company data (source of truth — don't re-derive from the PDF each session)

- **Legal/trade names:** Mahendra Facility Services (primary display name everywhere) / formerly Mahendra Consultancy Services. Note: the email/website domain remains `mahendraconsultancy.co.in` — keep those functional addresses as-is.
- **MD:** Mahendra P. Sangale — Mob. 9767847637
- **Registered office:** Leela Grandeur, Office No. 210, 2nd floor, Pune-Solapur Road, Opp. Kumar Meadows, Above Mahindra Showroom, Manjari, Pune-412307
- **Operational address:** M.No. 4144, S.No. 215/24B, Near Gaikwad Work Shop, Ganganagar, Phursungi, Pune-412308
- **Phone:** +91 9767847637
- **Emails:** mahendra.sangale11@gmail.com / info@mahendraconsultancy.co.in
- **Website (existing):** mahendraconsultancy.co.in
- **Services:** Manpower Services, Contract Labour Supplier Services, Housekeeping Manpower Services, Industrial Manpower Services, Staffing Service, Contract Employment Services
- **Skilled roles offered:** ITI/Chemical Plant Operator, Welder, Machine Operator, Loader, Packing Operator; **Unskilled:** Helper
- **Compliance/registrations:** Shop Act No. 2031000314490390 · PAN CTLPS4430C · PF Reg. PUPUN1519765 · ESIC Reg. 33000526000001019 · GST 27CTLPS4430C1ZN · PTRC 27821443148P · MLWF No. PUN77573 · Udyam Reg. UDYAM-MH-26-0052752
- **Clients:** Dream Plast, Omnia Toys, Venky's

## Conventions

- Keep it accessible and mobile-first: real `<nav>`/`<section>` semantics, alt text on every image, sufficient color contrast against the red/navy palette.
- No inline styles/scripts — all CSS in `css/style.css`, all JS in `js/script.js` (third-party libs live only in `js/vendor/`).
- Don't add a JS framework, package.json, or build step — it's a static brochure site. Extra libraries, if ever needed, get vendored into `js/vendor/` (like GSAP/Lenis), never pulled from a CDN at runtime.
