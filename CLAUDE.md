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

Headless screenshot (verified on this machine):

    "/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless --disable-gpu \
      --window-size=1440,9000 --virtual-time-budget=20000 --screenshot=out.png \
      "file:///D:/client/Mahendar-Pvt/index.html?noanim"

The hero is capped at `min(92vh, 900px)` so tall-viewport captures work. Headless Edge enforces a ~500px minimum layout width — for narrower checks, wrap the page in a fixed-width `<iframe>` harness.

## Structure

```
index.html          single page: topbar, sticky nav, hero (with docked stat bar), about, services, why, process, compliance, clients, CTA band, contact, footer
css/style.css        all styling — construction-forward design system (Roboto Slab/Inter fonts), teal/gold brand tokens, dark photographic bands, responsive
js/script.js          Lenis smooth scroll + GSAP ScrollTrigger reveals/parallax/counters, nav, back-to-top, ?noanim override
js/vendor/            vendored libs: gsap.min.js, ScrollTrigger.min.js, lenis.min.js, lenis.css
assets/images/        logo, official compliance badges, and high-res Unsplash photos (see inventory)
source-material/       original client PDF + business card + goal-prompt.md — reference only, not shipped
docs/superpowers/      spec-driven-development artifacts (plans/, specs/) from past feature work — reference history, not shipped
```

## Brand

- Logo: `assets/images/logo.jpg` — gold "M" wordmark on dark petrol teal (client-supplied, Jul 2026).
- The look is **construction-forward**: full-bleed site photography under a `--teal-950` overlay, dark photographic bands, Roboto Slab display type with gold `<em>` emphasis, and curtain reveals on images.
- **History, so this is not re-litigated:** a deliberately flat, restrained corporate design shipped in the 2026 revamp ("shouldn't look AI-built" — flat colors, 1px borders, no gradients, sparing gold). The client rejected it in August 2026 and asked for the treatment used in the sibling `real-estate-agent` project. Do not restore the flat direction without a fresh client instruction.
- Palette derives from the logo and is not imported from the reference site: `--teal-950 #061A1E` (overlays, bands, footer) · `--teal #00343C` (logo ground) · `--gold #C6A14F` (logo lettering) · `--gold-deep #96772F` (gold text on light) · `--bg #FAFAF8`.
- Type: **Roboto Slab** display, **Inter** body (Google Fonts `<link>`). Archivo is retired.
- Numbers on the site must stay defensible: stats are 7+ years, 8 service lines, 8 registrations, 100% compliance. A fabricated "98.9% client retention" figure was removed — don't reintroduce invented metrics.

## Asset inventory (assets/images/)

Photos are **copyright-free Unsplash images** (the originally-extracted PDF photos were too low-res/blurry and were replaced at the client's request), re-selected in the August 2026 construction rebuild for a construction/industrial-site subject match. The logo, the 8 government compliance badges, and client names are the company's own — keep those; don't swap them for stock.

| File | Content | Used in |
|---|---|---|
| `logo.jpg` | Company logo (brand) — gold "M" wordmark on dark-teal ground, "MAHENDRA / FACILITY SERVICES" | Navbar, footer, favicon |
| `img-hero.jpg` | Site crew in hard hats and hi-vis vests on a large construction site | Hero band |
| `img-about.jpg` | Site workers in orange hi-vis vests laying reinforcement bar | About band |
| `img-why.jpg` | High-rise buildings under construction with tower cranes | Why Us band (parallax) |
| `svc-manpower.jpg` | Worker in a hard hat and gloves wiring an electrical distribution box | Manpower service card |
| `svc-contract-labour.jpg` | Welder in protective mask joining steel, sparks flying | Contract Labour Supply card |
| `svc-housekeeping.jpg` | Housekeeping staff in mask and gloves cleaning window shutters | Housekeeping Manpower card |
| `svc-industrial.jpg` | Robotic arms on an automotive body assembly line | Industrial Manpower card |
| `svc-staffing.jpg` | Supervisor checking technical drawings and specifications at a desk | Staffing Services card |
| `svc-contract-employment.jpg` | Two people shaking hands to close a contract | Contract Employment card |
| `svc-security.jpg` | Security guard in a hi-vis vest marked SECURITY, seen from behind, walking along a building frontage | Security Services card |
| `svc-facility-management.jpg` | Building plant room with pipework, valves and pressure gauges | Facility Management card |
| `badge-shopact.jpg` · `badge-epfo.jpg` · `badge-esic.jpg` · `badge-gst.jpg` · `badge-ptax.jpg` · `badge-mlwb.png` · `badge-udyog-msme.jpg` · `badge-labour-bureau.png` | Official govt registration emblems (brand-owned) | Compliance grid |

The unused contact-section stock photo from the earlier revamp was deleted in the construction rebuild — the contact section still doesn't use a photo. Every service card and the hero/about/why bands wrap their `<img>` in a `.img-reveal` container for the curtain-wipe animation (see Animation notes below). The Security card ships with `svc-security.jpg`; a `.service-card.is-iconic` fallback style exists in `css/style.css` for an icon-only treatment but is currently unused.

Client logos are rendered as **text cards** (Dream Plast, Omnia Toys, Venky's) in the Clients section — the old `clients-strip.jpg` (red-bordered PDF crop) is no longer used.

## Animation / interaction notes

- `data-anim="..."` drives GSAP reveal presets. Directional presets (`fade-left`, `fade-right`) are genuinely directional again — the 2026 flattening was reverted with the construction rebuild. `.img-reveal` adds a curtain wipe on images (CSS transition, `.is-in` class toggled by ScrollTrigger). `data-parallax` is live again on `.band-media` in the hero and Why Us band. `data-count` + `data-suffix` still drive animated number counters.
- **`?noanim`** forces the reduced-motion path. Use it for deterministic headless screenshots.
- Mobile-nav breakpoint is **900px** (hamburger below that) — kept in sync between the CSS media query and the `innerWidth > 900` check in `script.js`. Change both together.
- GSAP sets initial off-screen transforms on `[data-anim]`; `html`/`body` use `overflow-x: clip` so those pre-reveal transforms never create horizontal scroll. Don't remove the clip.

## Company data (source of truth — don't re-derive from the PDF each session)

- **Legal/trade names:** Mahendra Facility Services Pvt Ltd (per the business card) — displayed as "Mahendra Facility Services" / formerly Mahendra Consultancy Services. Note: the email/website domain remains `mahendraconsultancy.co.in` — keep those functional addresses as-is.
- **MD:** Mahendra P. Sangale — Mob. 9767847637
- **Registered office:** Leela Grandeur, Office No. 210, 2nd floor, Pune-Solapur Road, Opp. Kumar Meadows, Above Mahindra Showroom, Manjari, Pune-412307
- **Operational address:** M.No. 4144, S.No. 215/24B, Near Gaikwad Work Shop, Ganganagar, Phursungi, Pune-412308
- **Phone:** +91 9767847637
- **Emails:** mahendra.sangale11@gmail.com / info@mahendraconsultancy.co.in
- **Website (existing):** mahendraconsultancy.co.in
- **Services (8):** Manpower Services, Contract Labour Supplier Services, Housekeeping Manpower Services, Industrial Manpower Services, Staffing Service, Contract Employment Services, Security Services, Facility Management. Security and Facility Management were added in August 2026 to match the logo's service strip. Security is partly backed by the PDF (direct-employee security staff, PASARA/Guard Board work); **Facility Management is backed only by the logo and the company name** — keep its copy general until the client confirms the FM scope they take on.
- **Skilled roles offered:** ITI/Chemical Plant Operator, Welder, Machine Operator, Loader, Packing Operator; **Unskilled:** Helper
- **Compliance/registrations:** Shop Act No. 2031000314490390 · PAN CTLPS4430C · PF Reg. PUPUN1519765 · ESIC Reg. 33000526000001019 · GST 27CTLPS4430C1ZN · PTRC 27821443148P · MLWF No. PUN77573 · Udyam Reg. UDYAM-MH-26-0052752
- **Clients:** Dream Plast, Omnia Toys, Venky's

## Conventions

- Keep it accessible and mobile-first: real `<nav>`/`<section>` semantics, alt text on every image, sufficient color contrast against the teal/gold palette (dark bands use `--teal-950`/`--on-dark`, not raw black-on-photo text).
- No inline styles/scripts — all CSS in `css/style.css`, all JS in `js/script.js` (third-party libs live only in `js/vendor/`).
- Don't add a JS framework, package.json, or build step — it's a static brochure site. Extra libraries, if ever needed, get vendored into `js/vendor/` (like GSAP/Lenis), never pulled from a CDN at runtime.
