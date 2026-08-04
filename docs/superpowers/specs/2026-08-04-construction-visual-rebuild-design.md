# Design: Construction-Forward Visual Rebuild

**Date:** 2026-08-04
**Project:** Mahendra Facility Services Pvt Ltd — static one-page site
**Status:** Approved

## Problem

The client is not happy with the current design. They pointed at a sibling project (`D:\client\real-estate-agent`, "Saamarth Properties") as the target quality bar and asked for the same treatment applied to their business, with construction-worker and construction-related imagery plus client-related imagery.

The current page is deliberately flat and restrained — the product of a 2026 revamp where the client asked for a corporate look that "shouldn't look AI-built." That restraint is now the complaint. This rebuild reverses it.

## Premise correction

The client described the business as a "construction company." The source material does not support that reading:

- `source-material/mahendra CO prof_20231004_211536_0000.pdf` describes labour contracting and manpower supply to manufacturing, casting, forging, painting, powder-coating, electrical, and automotive-parts units.
- `source-material/WhatsApp Image 2026-07-28 at 16.06.53.jpeg` (business card) gives the legal name as **Mahendra Facility Services Pvt Ltd**.
- `assets/images/logo.jpg` carries the tagline "MANPOWER. PERFORMANCE. TRUST." over five pillars: Manpower Supply, Skilled Workforce, Cleaning Services, Security Services, Facility Management.

The business is therefore unchanged: manpower and labour contracting. The client staffs industrial and construction sites, which is why construction imagery reads correctly. What changes is the visual language, not the offering. No copy on the page will claim the company performs civil or construction contracting.

Two facts from the source material that the current site does not reflect:

1. The legal name includes **Pvt Ltd**.
2. The logo advertises **Security Services** and **Facility Management**, which the current six-service grid omits.

## Decisions

Taken from the reference site: full-bleed photography with dark bands, serif display type, and the stronger motion system.

Deliberately **not** taken: testimonials, FAQ accordion, contact form, and floating WhatsApp button. The reference site carries placeholder testimonials as outstanding `TODO` debt; this site will not invent social proof. Every claim on the page stays traceable to the PDF, the business card, or the logo.

### Palette

The reference site's charcoal-and-bronze palette derives from *its* logo. The same principle applies here, so the palette derives from *this* logo rather than being imported.

| Token | Value | Role |
|---|---|---|
| `--teal-950` | `#061A1E` | Hero overlay, dark bands, footer (logo ground, darkened) |
| `--teal-900` | `#00343C` | Logo ground — secondary dark surface |
| `--gold` | `#C6A14F` | Logo lettering — accents, rules, CTA |
| `--gold-deep` | `#96772F` | Gold text on light backgrounds, for contrast |
| `--canvas` | `#FAFAF8` | Page background |
| `--paper` | `#FFFFFF` | Cards |
| `--line` | `#E4E2DB` | Hairlines |

Photographic overlays use `--teal-950`, not charcoal. Full-bleed imagery gets reference-grade contrast while every dark surface still traces back to the logo.

### Typography

Roboto Slab for display and headings; Inter for body and UI. Archivo retires. Headlines carry gold `<em>` accents, borrowing the reference's device but with a slab rather than Playfair Display — the slab's low stroke contrast reads as infrastructure rather than boutique property, which suits site photography and the gold logo.

Buttons keep a 6px radius with uppercase tracked labels. The base rem scale is unchanged; the reference's `62.5%` root trick is not adopted, as rescaling every value in the stylesheet buys nothing here.

### Page architecture

The sticky header, the 900px mobile-drawer breakpoint, the topbar, and the back-to-top control all carry over unchanged. Section order:

| Section | Treatment | Status |
|---|---|---|
| Hero | Full-bleed site photo, `--teal-950` overlay, parallax backdrop, slab H1 with gold `<em>`, two CTAs, stat bar along the bottom | Rebuilt |
| About | Two-column, image with curtain reveal | Rebuilt |
| Services | Eight photo cards | Expanded from six |
| Why Us | Dark band with parallax backdrop | New |
| Process | Gold numerals | Restyled |
| Compliance | Eight badges on a teal band | Restyled |
| Clients | Logo strip | Rebuilt |
| CTA band | Gold rule on teal, phone CTA | New |
| Contact | Content unchanged | Restyled |
| Footer | — | Restyled |

### Services — eight lines

The six from the PDF (Manpower Services, Contract Labour Supplier Services, Housekeeping Manpower Services, Industrial Manpower Services, Staffing Service, Contract Employment Services) plus Security Services and Facility Management.

Backing for the two additions is uneven and should be recorded as such. Security is partly supported by the PDF, which states that "all security staff & security personnel are our direct employees" and describes Police License (PASARA) and Guard Board Exemption work. Facility Management is supported only by the logo strip and the "Facility Services" legal name. Both ship per the client's explicit instruction; the Facility Management copy stays general until the client confirms the scope of FM contracts they actually take on.

### Why Us content

Four points, taken verbatim in substance from the PDF's "Why Choose Us" block: Expertise, Quality Candidates, Flexibility, Client-Centric Approach.

### Statistics

`7+ years · 8 service lines · 8 registrations · 100% compliance`. Service lines moves from 6 to 8 to match the expanded grid.

The PDF prints a "client retention rate of 98.9%." It stays off the site. `CLAUDE.md` records it as removed for being unverifiable, and appearing in the source PDF is not sufficient reason to reinstate it.

### Photography

Eleven images downloaded into `assets/images/`: `img-hero` (site crew), `img-about`, `img-why` (parallax backdrop), and eight service photos covering manpower, contract labour, housekeeping, industrial, staffing, contract employment, security, and facility management.

All construction and industrial in character — helmets, scaffolding, welders, site crews. Copyright-free sources only, downloaded to disk rather than hotlinked, so the site continues to run fully offline. The existing compliance badges and `logo.jpg` are company-owned and are not touched.

The current generic office and warehouse stock is retired: the six existing `svc-*.jpg` files, `img-hero.jpg`, `img-about.jpg`, and `img-contact.jpg` (already unused) are replaced or deleted. New files reuse the existing naming convention, so `svc-security.jpg` and `svc-facility-management.jpg` join the set.

### Client logos

The client asked for real client logos in place of today's text cards. Real logo files must come from the client; third-party trademarks will not be scraped or reproduced, and the client should confirm they have consent to display each mark.

The clients strip is therefore built to hold real logo images, with the existing text cards (Dream Plast, Omnia Toys, Venky's) as the shipped fallback until files arrive. This is a content dependency, not a build blocker.

### Motion

`js/script.js` already implements everything needed: Lenis smooth scroll, header state, nav drawer, anchor scroll, back-to-top, scroll progress, `[data-anim]` reveals with per-section stagger, animated counters, and a `[data-parallax]` implementation. Two changes only:

1. **Restore the directional reveal presets.** Every preset name currently collapses to a small fade-up. The side-slide and zoom presets become distinct again.
2. **Add an `.img-reveal` curtain** for images, matching the reference's treatment.

`[data-parallax]` is re-enabled on the hero and the Why Us band; the code exists and is currently unused.

No second animation system is introduced and no new dependency is added. The reference site's IntersectionObserver reveal system is not ported — this project's GSAP-based one already covers it.

`prefers-reduced-motion` continues to disable all motion, and `overflow-x: clip` on `html`/`body` stays, since GSAP sets pre-reveal transforms that would otherwise create horizontal scroll.

## Scope of change

| File | Change |
|---|---|
| `index.html` | Rewritten — new section architecture |
| `css/style.css` | Rewritten — new tokens, photographic and dark-band treatments |
| `js/script.js` | Two additions: directional presets restored, curtain reveal added |
| `assets/images/` | 11 photos added; superseded stock retired |
| `CLAUDE.md` | Brand, asset inventory, and service list updated |

Constraints from `CLAUDE.md` that continue to hold: no framework, no bundler, no npm dependency, no build step; libraries vendored in `js/vendor/` rather than loaded from a CDN; no inline styles or scripts; the page opens directly from the filesystem; `source-material/` is preserved.

## Rejected approaches

**In-place restyle.** Keeping `index.html` and rewriting only the stylesheet is the smallest diff, but the current tokens *are* the rejected design — `CLAUDE.md` mandates flat colors, 1px borders, small radii, no gradients, and sparing gold. Hero, services, and clients all need markup changes regardless. The restyle would spend its effort fighting the existing system.

**Cloning the reference project.** Copying `real-estate-agent`'s files and swapping content reaches the target look fastest, but imports Playfair Display, the bronze palette, the `62.5%` rem scale, a second reveal system, CDN script tags into a deliberately offline-only repo, and that project's outstanding placeholder debt. All of it would then have to be removed.

## Documentation update

`CLAUDE.md` currently instructs future sessions toward the design being replaced: "flat colors, 1px borders, small radii, no gradients/orbs/glassmorphism, gold used sparingly," and "the look is deliberately corporate/restrained (2026 revamp at client request)."

That guidance was accurate when written and is now superseded. It must be updated in the same change, or a later session will read it as authoritative and revert this rebuild. The updated file should record that the restrained direction was tried and rejected by the client in August 2026, so the history is legible rather than merely overwritten.

Also updated in `CLAUDE.md`: the legal name (Pvt Ltd), the eight-service list, the asset inventory, and the stats line.
