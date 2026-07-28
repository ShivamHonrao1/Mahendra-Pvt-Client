/goal Build a one-page portfolio/marketing website for Mahendra Consultancy Services, a Pune-based manpower & labour-contracting company, using plain HTML + CSS + vanilla JS only (no frameworks, no build tools, no npm dependencies). Read CLAUDE.md first — it has the full brand/content/asset reference this brief is built from.

## Objective
Produce a polished, professional, mobile-responsive single-page site (`index.html` + `css/style.css` + `js/script.js`) that a manpower-services client would trust, using only the real company content and real extracted assets already sitting in `assets/images/` (see the asset table in CLAUDE.md) — do not substitute generic stock photography or invent content not present in the source material.

## Brand & theme
- Palette: primary red `#DC241C`, primary navy `#29166F`, white/light-gray backgrounds. These are sampled directly from the company logo/business card — don't deviate from them.
- Logo: `assets/images/logo.jpg` in the navbar (and footer, smaller).
- Typography: a clean, modern sans-serif (e.g. system font stack or a single Google Font like "Poppins"/"Inter" — pick one, keep it consistent for headings vs body).
- Tone: corporate/industrial, confident, trustworthy — this is a B2B services firm, not a consumer brand.

## Structure — single scrolling page, sticky top nav with anchor links
1. **Hero** — company name "Mahendra Consultancy Services", tagline built from their "About Us" copy (trusted labour contracting partner, since [X years] experience), primary CTA button ("Get a Quote" / "Contact Us" scrolling to #contact), background or side image `assets/images/hero-worker.jpg`.
2. **About Us** — condensed from the PDF's About Us copy: trusted organization offering labour contracting per client needs; staff qualified and equipped to handle machines/equipment; serves manufacturing, casting, forging, painting, powder-coating, electrical and automotive-parts units; computerized systems for record-keeping. Include a small stats row (years of experience, industries served, client retention — use the 98.9% client retention figure from the PDF where relevant).
3. **Why Choose Us** — 4 cards from the PDF: Expertise, Quality Candidates, Flexibility, Client-Centric Approach (use the PDF's wording, condensed to short card copy).
4. **Services** — 6 cards, one per service line, each with a short description drawn from its PDF section, plus a relevant image where available:
   - Manpower Services — `assets/images/hero-worker.jpg` or generic icon
   - Contract Labour Supplier Services — `assets/images/contract-labour-team.png`, list the skilled/unskilled roles (Welder, Machine Operator, Loader, Packing Operator, ITI/Chemical Plant Operator, Helper)
   - Housekeeping Manpower Services — `assets/images/housekeeping-team.jpg`
   - Industrial Manpower Services — `assets/images/industrial-manpower-team.jpg` or `assets/images/industrial-team.jpg`
   - Staffing Service
   - Contract Employment Services
5. **Compliance & Certifications** — a badge strip/grid using all 8 badge images (`badge-shopact.jpg`, `badge-labour-bureau.png`, `badge-gst.jpg`, `badge-esic.jpg`, `badge-udyog-msme.jpg`, `badge-ptax.jpg`, `badge-epfo.jpg`, `badge-mlwb.png`), each labeled with its registration number from CLAUDE.md (Shop Act, PAN, PF, ESIC, GST, PTRC, MLWF, Udyam). This section exists to build institutional trust — make the numbers legible, not decorative-only.
6. **Our Clients** — display `assets/images/clients-strip.jpg`, plus/or the client names as text (Dream Plast, Omnia Toys, Venky's) in case the image needs a caption fallback.
7. **Contact** — MD name (Mahendra P. Sangale), phone +91 9767847637 as a `tel:` link, both emails as `mailto:` links, registered office and operational address (both from CLAUDE.md — label them Registered Office / Operational Office), embed a simple contact form (name, phone, message) that submits via `mailto:` (no backend available) OR just prominent click-to-call/click-to-email/WhatsApp (`https://wa.me/919767847637`) buttons — pick whichever reads less janky given no backend exists; a WhatsApp click-to-chat button is preferred since there's no server to receive form submissions.
8. **Footer** — logo, quick nav links, registered address, phone/email, copyright line.

## Functional requirements
- Sticky/fixed nav with smooth-scroll to section anchors; active-link highlighting on scroll is a nice-to-have, not required.
- Hamburger menu on mobile that toggles the nav (vanilla JS, no dependencies).
- Scroll-reveal / fade-in animation on sections as they enter viewport (small vanilla JS IntersectionObserver — keep it subtle, no heavy animation libraries).
- "Back to top" button appearing after scrolling past the hero.
- All images have descriptive `alt` text.
- Fully responsive from ~360px mobile width up through desktop; test the layout doesn't break at common breakpoints (mobile / tablet / desktop).

## Non-functional requirements
- No inline `style=` or `onclick=` — all CSS in `css/style.css`, all JS in `js/script.js`.
- No external JS/CSS framework or CDN dependency required to render correctly (a Google Fonts `<link>` is fine, but the site must still look acceptable if that fails to load).
- Keep it a single HTML file with linked CSS/JS — no templating engine, no multi-page routing.
- Don't add a contact form backend, database, CMS, or any server-side piece — this is a static brochure site by design.

## Deliverables
- `index.html`
- `css/style.css`
- `js/script.js`
- Reuses existing `assets/images/*` — do not add new images unless a section genuinely has no matching real asset (then use a simple CSS/SVG icon, not a stock photo).

## Success criteria
- Opening `index.html` directly in a browser renders a complete, styled, working page with no console errors.
- Every real company fact (registration numbers, phone, emails, both addresses, client names, all 6 services) from CLAUDE.md appears somewhere on the page — nothing invented, nothing dropped.
- Nav, mobile menu, smooth scroll, and back-to-top all work when clicked/tapped.
- Layout holds up at mobile (~375px), tablet (~768px), and desktop (~1440px) widths.
