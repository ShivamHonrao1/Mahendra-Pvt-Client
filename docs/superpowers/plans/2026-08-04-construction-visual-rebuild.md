# Construction-Forward Visual Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Mahendra Facility Services one-page site with full-bleed construction photography, dark bands, slab-serif display type, and restored motion — replacing the flat corporate design the client rejected.

**Architecture:** `index.html` and `css/style.css` are rewritten section by section against a logo-derived teal/gold token set. `js/script.js` keeps its existing structure and gains exactly two capabilities (directional reveal presets, image-curtain reveal) plus a `?noanim` escape hatch for deterministic screenshots. No new runtime dependency; the vendored GSAP/ScrollTrigger/Lenis in `js/vendor/` already provide everything.

**Tech Stack:** Plain HTML5, hand-written CSS with custom properties, vanilla ES5-style JS (the existing file uses `var` and `function` — match it). GSAP 3 + ScrollTrigger + Lenis, vendored. Google Fonts `<link>` for Roboto Slab + Inter.

## Global Constraints

Every task inherits these. Copied from `docs/superpowers/specs/2026-08-04-construction-visual-rebuild-design.md` and `CLAUDE.md`.

- **No build step.** No npm, no `package.json`, no bundler, no framework. `index.html` must open directly from the filesystem and work.
- **No CDN for libraries.** GSAP, ScrollTrigger, and Lenis load from `js/vendor/`. Fonts are the sole exception — they load from Google Fonts via `<link>`, matching existing practice, and the page must remain legible if they fail.
- **No inline styles or scripts.** All CSS in `css/style.css`, all JS in `js/script.js`.
- **Images are local.** Everything under `assets/images/`. No hotlinking. The site works offline.
- **Mobile-nav breakpoint is 900px** — the CSS media query and the `innerWidth > 900` check in `js/script.js` must stay in sync. Change both or neither.
- **`overflow-x: clip` on both `html` and `body` stays.** GSAP sets pre-reveal transforms that create horizontal scroll without it.
- **`prefers-reduced-motion: reduce` disables all motion.** Content must be fully visible and readable with motion off.
- **Alt text on every image.** Real `<nav>`/`<section>`/`<article>` semantics.
- **Exact company facts** — do not paraphrase, retype, or "correct" these:
  - Legal name: `Mahendra Facility Services Pvt Ltd`. Display name: `Mahendra Facility Services`.
  - MD: `Mahendra P. Sangale`, Managing Director.
  - Phone: `+91 97678 47637` (tel link `tel:+919767847637`).
  - Emails: `info@mahendraconsultancy.co.in`, `mahendra.sangale11@gmail.com`.
  - Website: `mahendraconsultancy.co.in`.
  - Registered office: `Leela Grandeur, Office No. 210, 2nd Floor, Pune-Solapur Road, Opp. Kumar Meadows, Above Mahindra Showroom, Manjari, Pune-412307`.
  - Operational office: `M.No. 4144, S.No. 215/24B, Near Gaikwad Work Shop, Ganganagar, Phursungi, Pune-412308`.
  - Registrations: Shop Act `2031000314490390` · PAN `CTLPS4430C` · PF `PUPUN1519765` · ESIC `33000526000001019` · GST `27CTLPS4430C1ZN` · PTRC `27821443148P` · MLWF `PUN77573` · Udyam `UDYAM-MH-26-0052752`.
  - Clients: `Dream Plast`, `Omnia Toys`, `Venky's`.
- **Never add the "98.9% client retention" figure.** It appears in the source PDF and was deliberately removed as unverifiable. Stats are exactly: `7+` years, `8` service lines, `8` registrations, `100%` compliance.
- **Never claim the company performs construction or civil contracting.** It supplies manpower to industrial and construction sites. Construction imagery is a visual language, not a claim of services.

### Verification commands used throughout

Screenshot (run from any directory):

```bash
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" \
  --headless --disable-gpu --window-size=1440,9000 --virtual-time-budget=20000 \
  --screenshot="C:/Users/shiva/AppData/Local/Temp/claude/D--client-Mahendar-Pvt/10ba3152-7dcf-4eb4-a97e-d3ebf63a3a33/scratchpad/shot.png" \
  "file:///D:/client/Mahendar-Pvt/index.html?noanim"
```

Mobile screenshot uses the same command with `--window-size=430,9000`.

`?noanim` is added in Task 3. Before Task 3 completes, drop the query string.

Read the resulting PNG with the Read tool to confirm the section renders. A 9000px-tall PNG is unreadable at full-page scale — if detail is needed, re-shoot with `--window-size=1440,1200` after adding `#anchor`-free scroll, or crop with PowerShell `System.Drawing`.

---

## File Structure

| File | Responsibility | Change |
|---|---|---|
| `index.html` | Entire page markup: topbar, header, hero, stats, about, services, why, process, compliance, clients, CTA, contact, footer | Rewritten section by section |
| `css/style.css` | All styling. Tokens in `:root`, then base, then one commented block per section, in the same order as the markup | Rewritten section by section |
| `js/script.js` | Motion + interaction. Existing IIFE structure retained | 3 surgical additions |
| `assets/images/*.jpg` | Photography and badges | 11 photos replaced/added |
| `CLAUDE.md` | Project guidance for future sessions | Brand, services, assets, stats updated |
| `docs/superpowers/specs/2026-08-04-construction-visual-rebuild-design.md` | Approved design | Read-only reference |

`css/style.css` stays a single file. It is ~400 lines today and will land around ~900 — still comfortably navigable, and splitting it would require either `@import` (an extra request per file) or a build step, both of which the constraints forbid.

---

## Task 1: Photography

Download the construction and industrial photo set. Nothing else in the build works without it — every later task references these filenames.

**Files:**
- Create: `assets/images/img-hero.jpg`, `img-about.jpg`, `img-why.jpg`, `svc-manpower.jpg`, `svc-contract-labour.jpg`, `svc-housekeeping.jpg`, `svc-industrial.jpg`, `svc-staffing.jpg`, `svc-contract-employment.jpg`, `svc-security.jpg`, `svc-facility-management.jpg`
- Delete: `assets/images/img-contact.jpg`

**Interfaces:**
- Produces: the eleven filenames above, referenced by `src` in Tasks 4–10. Do not rename them.

All URLs below were verified to return HTTP 200 with `Content-Type: image/jpeg`, and each image was visually inspected to confirm its subject. Unsplash photos are free to use commercially without attribution.

- [ ] **Step 1: Download the ten confirmed photos**

```bash
cd "D:/client/Mahendar-Pvt/assets/images"
U="https://images.unsplash.com/photo-"
Q="?auto=format&fit=crop&w=1800&q=72"

curl -s -o img-hero.jpg                "${U}1541888946425-d81bb19240f5${Q}"
curl -s -o img-about.jpg               "${U}1504307651254-35680f356dfd${Q}"
curl -s -o img-why.jpg                 "${U}1565008447742-97f6f38c985c${Q}"
curl -s -o svc-manpower.jpg            "${U}1621905251189-08b45d6a269e${Q}"
curl -s -o svc-contract-labour.jpg     "${U}1504328345606-18bbc8c9d7d1${Q}"
curl -s -o svc-housekeeping.jpg        "${U}1581578731548-c64695cc6952${Q}"
curl -s -o svc-industrial.jpg          "${U}1567789884554-0b844b597180${Q}"
curl -s -o svc-staffing.jpg            "${U}1503387762-592deb58ef4e${Q}"
curl -s -o svc-contract-employment.jpg "${U}1521791136064-7986c2920216${Q}"
curl -s -o svc-facility-management.jpg "${U}1607472586893-edb57bdc0e39${Q}"
```

Subject of each, for the alt text written in later tasks:

| File | Subject |
|---|---|
| `img-hero.jpg` | Crew of workers in hard hats and hi-vis vests standing on a large construction site |
| `img-about.jpg` | Overhead view of site workers in orange vests among rebar and formwork |
| `img-why.jpg` | High-rise buildings under construction with tower cranes against sky |
| `svc-manpower.jpg` | Worker in a yellow hard hat and gloves wiring an electrical box |
| `svc-contract-labour.jpg` | Welder in mask and jacket welding, sparks flying |
| `svc-housekeeping.jpg` | Cleaner in mask and yellow gloves wiping window shutters |
| `svc-industrial.jpg` | Robotic arms on an automotive body assembly line |
| `svc-staffing.jpg` | Person drafting and checking technical drawings at a desk |
| `svc-contract-employment.jpg` | Two people shaking hands across a desk |
| `svc-facility-management.jpg` | Building plant room — pipework, valves and gauges on a brick wall |

- [ ] **Step 2: Verify all ten downloaded as real JPEGs**

```bash
cd "D:/client/Mahendar-Pvt/assets/images"
for f in img-hero img-about img-why svc-manpower svc-contract-labour svc-housekeeping svc-industrial svc-staffing svc-contract-employment svc-facility-management; do
  size=$(stat -c%s "$f.jpg")
  if [ "$size" -lt 40000 ]; then echo "FAIL $f.jpg is only $size bytes"; else echo "ok   $f.jpg $size"; fi
done
```

Expected: ten `ok` lines. A file under 40 KB means the download returned an error page — re-run that single `curl`.

- [ ] **Step 3: Source the security photo**

No candidate depicting security personnel passed visual inspection during planning, so this one must be curated rather than copied.

These IDs were already probed and visually rejected — do not spend another round on them: `1520869562399-e772f042f422` (network switch), `1595079676339-1534801ad6cf` (phone QR scan), `1517649763962-0c623066013b` (cyclists), `1568992687947-868a62a9f521` (café meeting), `1573497019940-1c28c88b4f3e` (studio portrait), `1573164713988-8665fc963095` (server room).

Derive fresh candidates by browsing `https://unsplash.com/s/photos/security-guard` and reading photo IDs out of the result URLs (the ID is the trailing segment of `images.unsplash.com/photo-<id>`). Then probe them, keeping only those returning `200`, and view the thumbnails:

```bash
S="C:/Users/shiva/AppData/Local/Temp/claude/D--client-Mahendar-Pvt/10ba3152-7dcf-4eb4-a97e-d3ebf63a3a33/scratchpad/sec"
mkdir -p "$S"
for id in <ids-gathered-above>; do
  code=$(curl -s -o /dev/null -m 10 -w "%{http_code}" "https://images.unsplash.com/photo-$id?w=100")
  echo "$code $id"
  [ "$code" = "200" ] && curl -s -m 20 -o "$S/$id.jpg" "https://images.unsplash.com/photo-$id?auto=format&fit=crop&w=320&q=60"
done
```

Read each downloaded thumbnail with the Read tool. Accept a photo only if it shows a uniformed security guard, a staffed gate or reception desk, or site access control. Reject generic CCTV hardware and stock-photo "cyber security" imagery — this is physical guarding, not IT security.

Then download the winner at full size:

```bash
curl -s -o "D:/client/Mahendar-Pvt/assets/images/svc-security.jpg" \
  "https://images.unsplash.com/photo-<winning-id>?auto=format&fit=crop&w=1800&q=72"
```

**Fallback, if two rounds of probing find nothing suitable:** do not ship a mismatched photo. Skip `svc-security.jpg` entirely and give the Security card the icon treatment defined in Task 6 Step 4 (`.service-card.is-iconic`). Record the decision in the Task 1 commit message so Task 6 knows which branch to take.

- [ ] **Step 4: Delete the superseded unused image**

```bash
cd "D:/client/Mahendar-Pvt" && git rm assets/images/img-contact.jpg
```

`img-contact.jpg` is already referenced nowhere in `index.html`. The other replaced files keep their names and were overwritten in place by Step 1.

- [ ] **Step 5: Confirm nothing else references a deleted file**

Run: `grep -rn "img-contact" "D:/client/Mahendar-Pvt" --include=*.html --include=*.css --include=*.js`
Expected: no output.

- [ ] **Step 6: Commit**

```bash
cd "D:/client/Mahendar-Pvt"
git add assets/images
git commit -m "assets: replace stock photography with construction and industrial set

Eleven copyright-free photos downloaded locally so the site keeps working
offline. Retires the generic office/warehouse imagery and the unused
img-contact.jpg."
```

---

## Task 2: Design tokens, typography and base

Establish the palette and type before any section is styled, so later tasks reference tokens rather than raw hex.

**Files:**
- Modify: `css/style.css:9-75` (the `:root` block and base rules)
- Modify: `index.html:12` (font `<link>`)

**Interfaces:**
- Produces: CSS custom properties `--teal-950`, `--teal`, `--teal-deep`, `--gold`, `--gold-deep`, `--on-dark`, `--on-dark-soft`, `--ink`, `--body-c`, `--muted`, `--bg`, `--surface`, `--line`, `--font-display`, `--font-body`, `--container`, `--radius`, `--radius-sm`; utility classes `.container`, `.section`, `.section-head`, `.kicker`, `.btn`, `.btn-primary`, `.btn-outline`, `.btn-gold`, `.btn-outline-light`, `.band`, `.band-media`. Every later task uses these names.

- [ ] **Step 1: Swap the font link**

In `index.html`, replace the line at `index.html:12`:

```html
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
```

with:

```html
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
```

- [ ] **Step 2: Replace the `:root` block**

Replace `css/style.css:1-37` (the header comment through the close of `:root`) with:

```css
/* ============================================================
   Mahendra Facility Services — construction-forward stylesheet
   Palette derives from the brand logo: petrol teal #00343C ground
   with gold #C6A14F lettering. Dark bands use --teal-950, a
   darkened logo teal, so photography has contrast without
   importing a foreign charcoal.
   Breakpoint contract: mobile nav switches at 900px — keep in
   sync with the innerWidth > 900 check in js/script.js.
   ============================================================ */

:root {
  /* Brand */
  --teal-950: #061A1E;    /* photo overlays, dark bands, footer */
  --teal: #00343C;        /* logo ground */
  --teal-hover: #0A4A54;
  --teal-deep: #002229;
  --teal-tint: #EEF3F2;   /* light section wash */
  --gold: #C6A14F;        /* logo gold */
  --gold-hover: #D8B667;
  --gold-deep: #96772F;   /* accessible gold for small text on light bg */

  /* Neutrals */
  --ink: #14211F;
  --body-c: #46565A;
  --muted: #71807F;
  --bg: #FAFAF8;
  --surface: #FFFFFF;
  --line: #E3E7E4;
  --on-dark: #F2F5F4;
  --on-dark-soft: rgba(242, 245, 244, .72);

  /* Type */
  --font-display: "Roboto Slab", Georgia, "Times New Roman", serif;
  --font-body: "Inter", system-ui, -apple-system, sans-serif;

  /* Misc */
  --radius: 6px;
  --radius-sm: 4px;
  --shadow-sm: 0 2px 10px rgba(6, 26, 30, .07);
  --shadow-md: 0 14px 40px rgba(6, 26, 30, .14);
  --container: 1200px;
  --header-h: 76px;
}
```

- [ ] **Step 3: Update the base type scale**

Replace the `h1, h2, h3, h4` rule and the three heading size rules at `css/style.css:62-72` with:

```css
h1, h2, h3, h4 {
  font-family: var(--font-display);
  color: var(--ink);
  line-height: 1.12;
  margin: 0 0 .5em;
  font-weight: 700;
  letter-spacing: -0.01em;
}
h1 { font-size: clamp(2.3rem, 5vw, 3.9rem); font-weight: 800; }
h2 { font-size: clamp(1.75rem, 3.2vw, 2.6rem); }
h3 { font-size: 1.2rem; font-weight: 600; }

/* Gold emphasis inside display headings */
h1 em, h2 em { font-style: normal; color: var(--gold); }
.on-dark h1, .on-dark h2, .on-dark h3 { color: var(--on-dark); }
.on-dark p { color: var(--on-dark-soft); }

html { scroll-padding-top: calc(var(--header-h) + 16px); }
```

Roboto Slab is a serif, so `letter-spacing` tightens less aggressively than Archivo did — `-0.01em` rather than `-0.015em`.

- [ ] **Step 4: Add the shared section and button utilities**

Append after the `.section` rule at `css/style.css:75`:

```css
.section-head { max-width: 720px; margin: 0 0 clamp(32px, 4vw, 56px); }
.section-head.is-centered { margin-inline: auto; text-align: center; }
.section-intro { font-size: 1.05rem; }

.kicker {
  font-family: var(--font-body);
  font-size: .78rem;
  font-weight: 600;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--gold-deep);
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.kicker::before {
  content: "";
  width: 28px;
  height: 2px;
  background: var(--gold);
  flex: none;
}
.on-dark .kicker { color: var(--gold); }
.is-centered .kicker { justify-content: center; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 26px;
  border-radius: var(--radius);
  font-family: var(--font-body);
  font-size: .82rem;
  font-weight: 600;
  letter-spacing: .1em;
  text-transform: uppercase;
  border: 1px solid transparent;
  transition: background-color .25s ease, color .25s ease, border-color .25s ease;
}
.btn-primary       { background: var(--gold); color: var(--teal-950); }
.btn-primary:hover { background: var(--gold-hover); }
.btn-outline       { border-color: rgba(242,245,244,.45); color: var(--on-dark); }
.btn-outline:hover { border-color: var(--gold); color: var(--gold); }
.btn-gold          { background: var(--gold); color: var(--teal-950); }
.btn-gold:hover    { background: var(--gold-hover); }
.btn-outline-light       { border-color: rgba(242,245,244,.45); color: var(--on-dark); }
.btn-outline-light:hover { border-color: var(--gold); color: var(--gold); }

/* Dark photographic band: image + teal overlay, content above */
.band { position: relative; overflow: hidden; background: var(--teal-950); }
.band > .container { position: relative; z-index: 2; }
.band-media { position: absolute; inset: -12% 0; z-index: 0; }
.band-media img { width: 100%; height: 100%; object-fit: cover; }
.band::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(180deg, rgba(6,26,30,.90), rgba(6,26,30,.78));
}

:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }
```

`.band-media` is inset by `-12%` vertically so the parallax translation added in Task 3 never exposes a bare edge.

- [ ] **Step 5: Verify the page still loads and fonts applied**

Run the screenshot command from Global Constraints, without `?noanim` (not implemented until Task 3):

```bash
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless --disable-gpu \
  --window-size=1440,3000 --virtual-time-budget=20000 \
  --screenshot="C:/Users/shiva/AppData/Local/Temp/claude/D--client-Mahendar-Pvt/10ba3152-7dcf-4eb4-a97e-d3ebf63a3a33/scratchpad/t2.png" \
  "file:///D:/client/Mahendar-Pvt/index.html"
```

Read `t2.png`. Expected: the page renders with slab-serif headings instead of the previous grotesque. Sections still carry old layout — that is correct at this stage; only tokens and type changed.

- [ ] **Step 6: Commit**

```bash
cd "D:/client/Mahendar-Pvt"
git add index.html css/style.css
git commit -m "style: logo-derived token set and Roboto Slab display type

Adds --teal-950 for photographic overlays and dark bands, gold <em>
emphasis in headings, and the shared .band/.kicker/.btn utilities the
rebuilt sections rely on. Archivo retires."
```

---

## Task 3: Motion engine

Three additions to `js/script.js`. The file's existing IIFE, `var`/`function` style, and graceful-degradation guards stay exactly as they are.

**Files:**
- Modify: `js/script.js:6-15` (add the `?noanim` check)
- Modify: `js/script.js:156-166` (the `presets` object)
- Modify: `js/script.js:143-151` and `js/script.js:201` (wire up curtain reveals)
- Modify: `css/style.css` (append the `.img-reveal` rules)

**Interfaces:**
- Consumes: `assets/images/*` from Task 1.
- Produces:
  - `data-anim` preset names usable in markup: `fade-up`, `fade-right`, `fade-left`, `hero-title`, `hero-media`, `card`, `stat`.
  - `.img-reveal` — a class placed on any element wrapping an `<img>`; the wrapper's `::after` curtain wipes away and the image settles from a slight zoom.
  - `data-parallax="<number>"` on `.band-media` elements; the number is the fraction of viewport height translated across the scroll.
  - `?noanim` query parameter — treated identically to `prefers-reduced-motion: reduce`.

- [ ] **Step 1: Add the `?noanim` escape hatch**

In `js/script.js`, find the reduced-motion constant near the top (`js/script.js:9-10`):

```js
  var prefersReduced =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

Replace with:

```js
  // ?noanim forces the reduced-motion path — used for deterministic
  // headless screenshots, since GSAP reveals otherwise race the capture.
  var prefersReduced =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    /[?&]noanim\b/.test(window.location.search);
```

- [ ] **Step 2: Verify `?noanim` works**

```bash
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless --disable-gpu \
  --window-size=1440,3000 --virtual-time-budget=20000 \
  --screenshot="C:/Users/shiva/AppData/Local/Temp/claude/D--client-Mahendar-Pvt/10ba3152-7dcf-4eb4-a97e-d3ebf63a3a33/scratchpad/t3a.png" \
  "file:///D:/client/Mahendar-Pvt/index.html?noanim"
```

Read `t3a.png`. Expected: all content fully visible and opaque, no half-faded elements. Before this change the same capture showed elements mid-reveal or invisible.

- [ ] **Step 3: Restore the directional presets**

Replace the comment and `presets` object at `js/script.js:156-166` with:

```js
    /* Reveal presets. Directional variants are distinct again — the
       2026 "everything is a small fade-up" flattening was reverted with
       the construction rebuild. */
    var presets = {
      "fade-up":    { from: { y: 40, opacity: 0 } },
      "fade-right": { from: { x: -48, opacity: 0 } },
      "fade-left":  { from: { x: 48, opacity: 0 } },
      "hero-title": { from: { y: 48, opacity: 0 }, dur: 1.0 },
      "hero-media": { from: { y: 40, opacity: 0, scale: 1.04 }, dur: 1.1 },
      "card":       { from: { y: 44, opacity: 0 } },
      "stat":       { from: { y: 24, opacity: 0 } }
    };
```

The `gsap.to` call at `js/script.js:187-197` already animates `x: 0, y: 0, opacity: 1, scale: 1`, so horizontal and scale presets need no further change.

- [ ] **Step 4: Add the curtain-reveal function**

Insert this function immediately after `initParallax` closes at `js/script.js:222`:

```js
  /* ---- Image curtain reveal ---- */
  function initImageReveals() {
    var els = document.querySelectorAll(".img-reveal");
    if (!els.length) return;

    if (!hasST || prefersReduced) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    els.forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: function () { el.classList.add("is-in"); }
      });
    });
  }
```

CSS owns the transition; JS only toggles the class. That keeps the motion definition next to the visual styling and avoids a second GSAP timeline.

- [ ] **Step 5: Call it from both code paths**

In `initAnimations`, the reduced-motion early return at `js/script.js:147-151` becomes:

```js
    if (!hasST || prefersReduced) {
      animEls.forEach(function (el) { el.style.opacity = "1"; el.style.transform = "none"; });
      initParallaxFallback();
      initImageReveals();
      return;
    }
```

and the animated path at `js/script.js:201` becomes:

```js
    initParallax();
    initImageReveals();
```

- [ ] **Step 6: Add the curtain CSS**

Append to `css/style.css`:

```css
/* ---------- Image curtain reveal ---------- */
.img-reveal { position: relative; overflow: hidden; }
.img-reveal img {
  transform: scale(1.08);
  transition: transform 1.1s cubic-bezier(.22,.61,.36,1);
}
.img-reveal::after {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--teal-950);
  transform: translateX(0);
  transition: transform .85s cubic-bezier(.76,0,.24,1);
  z-index: 2;
}
.img-reveal.is-in img    { transform: scale(1); }
.img-reveal.is-in::after { transform: translateX(101%); }

@media (prefers-reduced-motion: reduce) {
  .img-reveal img    { transform: none; transition: none; }
  .img-reveal::after { display: none; }
  html { scroll-behavior: auto; }
}
```

The `101%` avoids a hairline of curtain remaining on fractional-pixel widths.

- [ ] **Step 7: Verify the reveal fires and degrades**

There is no image using `.img-reveal` until Task 5, so verify against a temporary probe rather than the page. Run in a browser console on `file:///D:/client/Mahendar-Pvt/index.html`:

```js
var f = document.querySelector('.about-media');
f.classList.add('img-reveal');
getComputedStyle(f).position === 'relative'
```

Expected: `true`, and the element visibly wipes when scrolled into view on reload.

Then confirm the reduced-motion path:

```bash
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless --disable-gpu \
  --window-size=1440,3000 --virtual-time-budget=20000 \
  --screenshot="C:/Users/shiva/AppData/Local/Temp/claude/D--client-Mahendar-Pvt/10ba3152-7dcf-4eb4-a97e-d3ebf63a3a33/scratchpad/t3b.png" \
  "file:///D:/client/Mahendar-Pvt/index.html?noanim"
```

Read `t3b.png`. Expected: identical to `t3a.png` — no black rectangles anywhere, since `.img-reveal::after` is hidden and `is-in` is applied immediately on the reduced-motion path.

- [ ] **Step 8: Commit**

```bash
cd "D:/client/Mahendar-Pvt"
git add js/script.js css/style.css
git commit -m "feat: directional reveals, image curtain and ?noanim

Restores distinct fade-left/right and hero scale presets that had all
collapsed to a small fade-up. Adds .img-reveal curtain (CSS-driven,
class toggled by ScrollTrigger) and a ?noanim query param that takes the
reduced-motion path for deterministic headless screenshots."
```

---

## Task 4: Header and photographic hero

The single biggest visual change. Full-bleed site photo, teal overlay, parallax backdrop, slab headline with gold emphasis, stat bar docked at the bottom.

**Files:**
- Modify: `index.html:19-96` (topbar through stats section)
- Modify: `css/style.css` (replace the header/hero/stats blocks)

**Interfaces:**
- Consumes: `.band`, `.band-media`, `.kicker`, `.btn-primary`, `.btn-outline` from Task 2; `data-anim`, `data-parallax`, `.img-reveal` from Task 3; `assets/images/img-hero.jpg` from Task 1.
- Produces: `.hero`, `.hero-inner`, `.hero-copy`, `.hero-actions`, `.hero-stats`, `.stat`, `.stat-num`, `.stat-label`. The `.stats` section is absorbed into the hero and no longer exists as a standalone section.

- [ ] **Step 1: Replace the hero and stats markup**

Replace `index.html:61-96` (the `<!-- HERO -->` comment through the close of the stats `</section>`) with:

```html
  <!-- ============ HERO ============ -->
  <section class="hero band on-dark" id="hero">
    <div class="band-media" data-parallax="0.12">
      <img src="assets/images/img-hero.jpg" alt="Site crew in hard hats and hi-vis vests on a large construction site" />
    </div>

    <div class="container hero-inner">
      <div class="hero-copy">
        <p class="kicker" data-anim="fade-up">Manpower &middot; Housekeeping &middot; Industrial Staffing</p>
        <h1 data-anim="hero-title">A dependable <em>workforce partner</em> for your plant, facility and site</h1>
        <p class="hero-lead" data-anim="fade-up">
          Mahendra Facility Services supplies skilled and unskilled manpower on contract to
          manufacturing, casting, forging, painting and automotive units across Pune —
          on our payroll, under our supervision, with PF, ESIC and GST compliance handled end to end.
        </p>
        <div class="hero-actions" data-anim="fade-up">
          <a href="#contact" class="btn btn-primary" data-scroll>Get a Quote</a>
          <a href="#services" class="btn btn-outline" data-scroll>View Services</a>
        </div>
        <p class="hero-registrations" data-anim="fade-up">
          <strong>Registered under:</strong> Shop Act &middot; EPFO &middot; ESIC &middot; GST &middot; MLWF &middot; Udyam (MSME)
        </p>
      </div>
    </div>

    <div class="hero-stats" aria-label="Company highlights">
      <div class="container hero-stats-grid">
        <div class="stat" data-anim="stat"><span class="stat-num" data-count="7" data-suffix="+">0</span><span class="stat-label">Years in Operation</span></div>
        <div class="stat" data-anim="stat"><span class="stat-num" data-count="8">0</span><span class="stat-label">Service Lines</span></div>
        <div class="stat" data-anim="stat"><span class="stat-num" data-count="8">0</span><span class="stat-label">Statutory Registrations</span></div>
        <div class="stat" data-anim="stat"><span class="stat-num" data-count="100" data-suffix="%">0</span><span class="stat-label">Compliance, On Record</span></div>
      </div>
    </div>
  </section>
```

Note `data-count="8"` on Service Lines — up from 6, matching the eight-card grid built in Task 6.

- [ ] **Step 2: Replace the hero CSS**

Find the existing `.hero`, `.hero-inner`, `.hero-copy`, `.hero-media`, `.stats` and `.stat` rules in `css/style.css` and replace all of them with:

```css
/* ---------- Hero ---------- */
.hero {
  min-height: min(92vh, 900px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-top: calc(var(--header-h) + 72px);
}
.hero-inner { padding-bottom: clamp(48px, 7vw, 96px); }
.hero-copy { max-width: 780px; }
.hero-copy h1 { margin-bottom: 22px; }
.hero-lead {
  font-size: clamp(1rem, 1.5vw, 1.13rem);
  max-width: 640px;
  color: var(--on-dark-soft);
}
.hero-actions { display: flex; flex-wrap: wrap; gap: 14px; margin: 32px 0 28px; }
.hero-registrations {
  font-size: .84rem;
  letter-spacing: .03em;
  color: var(--on-dark-soft);
  margin: 0;
}
.hero-registrations strong { color: var(--gold); font-weight: 600; }

/* Stat bar docked to the bottom of the hero */
.hero-stats {
  position: relative;
  z-index: 2;
  border-top: 1px solid rgba(242,245,244,.16);
  background: rgba(6,26,30,.55);
}
.hero-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
}
.stat { padding: 26px 20px; text-align: center; }
.stat + .stat { box-shadow: -1px 0 0 rgba(242,245,244,.16); }
.stat-num {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(1.9rem, 3.4vw, 2.7rem);
  font-weight: 800;
  color: var(--gold);
  line-height: 1;
}
.stat-label {
  display: block;
  margin-top: 8px;
  font-size: .76rem;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--on-dark-soft);
}

@media (max-width: 900px) {
  .hero { min-height: 0; padding-top: calc(var(--header-h) + 48px); }
  .hero-stats-grid { grid-template-columns: repeat(2, 1fr); }
  .stat:nth-child(odd) { box-shadow: none; }
  .stat:nth-child(n+3) { box-shadow: 0 -1px 0 rgba(242,245,244,.16); }
  .stat:nth-child(4)   { box-shadow: 0 -1px 0 rgba(242,245,244,.16), -1px 0 0 rgba(242,245,244,.16); }
}
@media (max-width: 560px) {
  .hero-actions .btn { width: 100%; }
}
```

`min-height: min(92vh, 900px)` caps the hero so the 9000px-tall headless capture does not stretch it.

- [ ] **Step 3: Make the header transparent over the hero**

The header now sits over photography. Find the `.site-header` rule and replace it with:

```css
.site-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 50;
  height: var(--header-h);
  display: flex;
  align-items: center;
  background: transparent;
  border-bottom: 1px solid transparent;
  transition: background-color .3s ease, border-color .3s ease, box-shadow .3s ease;
}
.site-header.is-stuck {
  background: var(--teal-950);
  border-bottom-color: rgba(242,245,244,.14);
  box-shadow: var(--shadow-sm);
}
.site-header .brand-name { color: var(--on-dark); }
.site-header .brand-sub  { color: var(--on-dark-soft); }
.primary-nav a           { color: var(--on-dark); }
.primary-nav a:hover     { color: var(--gold); }
.primary-nav .nav-cta {
  background: var(--gold);
  color: var(--teal-950);
  padding: 10px 20px;
  border-radius: var(--radius);
  font-weight: 600;
}
.primary-nav .nav-cta:hover { background: var(--gold-hover); color: var(--teal-950); }
```

Check what class `initHeader` at `js/script.js:54-63` toggles. If it toggles a class other than `is-stuck`, use that name here rather than editing the JS — the JS is not in this task's scope.

- [ ] **Step 4: Push the topbar behind the fixed header**

The topbar scrolls away above the fixed header. Replace the `.topbar` rule with:

```css
.topbar {
  background: var(--teal-deep);
  color: var(--on-dark-soft);
  font-size: .8rem;
  position: relative;
  z-index: 60;
}
.topbar-inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 24px;
  padding-block: 9px;
}
.topbar p { margin: 0; }
.topbar a { color: var(--on-dark-soft); }
.topbar a:hover { color: var(--gold); }
@media (max-width: 700px) { .topbar-note { display: none; } }
```

- [ ] **Step 5: Screenshot the hero**

```bash
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless --disable-gpu \
  --window-size=1440,1400 --virtual-time-budget=20000 \
  --screenshot="C:/Users/shiva/AppData/Local/Temp/claude/D--client-Mahendar-Pvt/10ba3152-7dcf-4eb4-a97e-d3ebf63a3a33/scratchpad/t4.png" \
  "file:///D:/client/Mahendar-Pvt/index.html?noanim"
```

Read `t4.png`. Expected: full-bleed construction crew photo behind a dark teal wash; white slab headline with `workforce partner` in gold; two buttons; four gold statistics in a bar across the bottom of the hero reading `7+`, `8`, `8`, `100%`. The nav sits over the photo with no background band.

- [ ] **Step 6: Screenshot mobile**

Same command with `--window-size=430,1600`, output `t4m.png`. Read it. Expected: no horizontal scroll, stats in a 2×2 grid, buttons full width, topbar note hidden.

- [ ] **Step 7: Commit**

```bash
cd "D:/client/Mahendar-Pvt"
git add index.html css/style.css
git commit -m "feat: photographic hero with parallax backdrop and docked stat bar

Replaces the split copy/photo hero with a full-bleed site photograph under
a teal overlay. Absorbs the standalone stats section into the hero as a
bottom-docked bar and updates service lines 6 to 8. Header goes transparent
over the hero and solidifies on scroll."
```

---

## Task 5: About

Two-column, with the first curtain-revealed image on the page.

**Files:**
- Modify: `index.html:98-131` (the about section)
- Modify: `css/style.css` (the `.about-*` block)

**Interfaces:**
- Consumes: `.img-reveal` from Task 3, `assets/images/img-about.jpg` from Task 1, `.kicker` from Task 2.
- Produces: `.about-grid`, `.about-media`, `.about-copy`, `.about-points`, `.about-md`.

- [ ] **Step 1: Update the about markup**

In `index.html`, change the media figure at `index.html:101-103` to add the curtain class and the new alt text, and switch the copy column to a directional reveal:

```html
      <div class="about-media img-reveal" data-anim="fade-right">
        <img src="assets/images/img-about.jpg" alt="Site workers in orange hi-vis vests laying reinforcement bar" />
      </div>
```

Change the heading at `index.html:106` to carry gold emphasis:

```html
        <h2 data-anim="fade-left">Labour contracting, run on <em>systems and records</em></h2>
```

Leave the two body paragraphs, `.about-points` list, and `.about-md` block exactly as written — the copy is accurate and sourced.

- [ ] **Step 2: Replace the about CSS**

```css
/* ---------- About ---------- */
.about { background: var(--surface); }
.about-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  gap: clamp(32px, 5vw, 72px);
  align-items: center;
}
.about-media { border-radius: var(--radius); }
.about-media img { width: 100%; aspect-ratio: 4 / 5; object-fit: cover; }
.about-copy h2 { margin-bottom: 20px; }
.about-points { margin: 26px 0; display: grid; gap: 12px; }
.about-points li {
  position: relative;
  padding-left: 30px;
  list-style: none;
  color: var(--body-c);
}
.about-points li::before {
  content: "";
  position: absolute;
  left: 0; top: .62em;
  width: 16px; height: 2px;
  background: var(--gold);
}
.about-md {
  margin: 0;
  padding-top: 22px;
  border-top: 1px solid var(--line);
}
.about-md-name {
  display: block;
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--ink);
  font-size: 1.05rem;
}
.about-md-role {
  display: block;
  font-size: .78rem;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--gold-deep);
}

@media (max-width: 900px) {
  .about-grid { grid-template-columns: 1fr; }
  .about-media img { aspect-ratio: 3 / 2; }
}
```

- [ ] **Step 3: Verify the curtain does not leave a black box**

```bash
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless --disable-gpu \
  --window-size=1440,2600 --virtual-time-budget=20000 \
  --screenshot="C:/Users/shiva/AppData/Local/Temp/claude/D--client-Mahendar-Pvt/10ba3152-7dcf-4eb4-a97e-d3ebf63a3a33/scratchpad/t5.png" \
  "file:///D:/client/Mahendar-Pvt/index.html?noanim"
```

Read `t5.png`. Expected: the about photo is fully visible — workers among rebar — with no dark rectangle covering it. A black box means Task 3 Step 5 did not wire `initImageReveals` into the reduced-motion path.

- [ ] **Step 4: Verify the animated path**

Open `file:///D:/client/Mahendar-Pvt/index.html` in a normal browser and scroll to About. Expected: a teal curtain wipes left-to-right off the photo while the image settles from a slight zoom, and the copy column slides in from the right.

- [ ] **Step 5: Commit**

```bash
cd "D:/client/Mahendar-Pvt"
git add index.html css/style.css
git commit -m "feat: about section with curtain-revealed site photograph

Portrait 4:5 crop on desktop, directional reveals on both columns, gold
rule markers on the trust points."
```

---

## Task 6: Services — eight photo cards

**Files:**
- Modify: `index.html:133-222` (the services section)
- Modify: `css/style.css` (the `.services`/`.service-card` block)

**Interfaces:**
- Consumes: eight `assets/images/svc-*.jpg` from Task 1; `.kicker`, `.section-head` from Task 2; `data-anim="card"` from Task 3.
- Produces: `.services-grid`, `.service-card`, `.service-media`, `.service-body`, `.service-num`, `.chip-list`, `.service-card.is-iconic`.

- [ ] **Step 1: Replace the section heading**

At `index.html:138`, `Six service lines` is now wrong. Replace the `.section-head` block with:

```html
      <div class="section-head">
        <p class="kicker" data-anim="fade-up">Our Services</p>
        <h2 data-anim="fade-up">Eight service lines, one standard of <em>compliance</em></h2>
        <p class="section-intro" data-anim="fade-up">
          From skilled industrial labour to housekeeping, security and payroll-ready contract
          staffing — each engagement is delivered with the same statutory discipline.
        </p>
      </div>
```

- [ ] **Step 2: Change the grid wrapper**

Replace `<div class="cards-3">` at `index.html:144` with `<div class="services-grid">`.

- [ ] **Step 3: Keep the six existing cards, updating alt text and numbering**

The six existing `<article class="service-card">` blocks at `index.html:146-218` keep their headings, copy, and `.chip-list`. Change only the `<img>` alt attributes so they describe the new photographs:

| Card | New alt text |
|---|---|
| 01 Manpower Services | `Worker in a hard hat and gloves wiring an electrical distribution box` |
| 02 Contract Labour Supply | `Welder in protective mask joining steel, sparks flying` |
| 03 Housekeeping Manpower | `Housekeeping staff in mask and gloves cleaning window shutters` |
| 04 Industrial Manpower | `Robotic arms on an automotive body assembly line` |
| 05 Staffing Services | `Supervisor checking technical drawings and specifications at a desk` |
| 06 Contract Employment | `Two people shaking hands to close a contract` |

- [ ] **Step 4: Add the two new cards**

Insert immediately before the closing `</div>` of the grid, after the Contract Employment card:

```html
        <article class="service-card" data-anim="card">
          <div class="service-media img-reveal">
            <img src="assets/images/svc-security.jpg" alt="Uniformed security guard on duty at a site entrance" loading="lazy" />
          </div>
          <div class="service-body">
            <span class="service-num">07</span>
            <h3>Security Services</h3>
            <p>Security staff deployed as our direct employees, with PASARA licensing and Guard Board formalities handled by us.</p>
          </div>
        </article>

        <article class="service-card" data-anim="card">
          <div class="service-media img-reveal">
            <img src="assets/images/svc-facility-management.jpg" alt="Building plant room with pipework, valves and pressure gauges" loading="lazy" />
          </div>
          <div class="service-body">
            <span class="service-num">08</span>
            <h3>Facility Management</h3>
            <p>Day-to-day upkeep of premises through a single supervised team, coordinated under one contract and one point of contact.</p>
          </div>
        </article>
```

Also add `class="service-media img-reveal"` to the six existing cards' media wrappers.

**If Task 1 Step 3 took the fallback branch** and `svc-security.jpg` does not exist, use this card instead:

```html
        <article class="service-card is-iconic" data-anim="card">
          <div class="service-body">
            <span class="service-num">07</span>
            <h3>Security Services</h3>
            <p>Security staff deployed as our direct employees, with PASARA licensing and Guard Board formalities handled by us.</p>
          </div>
        </article>
```

The Facility Management copy stays general — the client has not yet confirmed the scope of FM contracts they take on, and the spec requires it stay non-specific until they do.

- [ ] **Step 5: Replace the services CSS**

```css
/* ---------- Services ---------- */
.services { background: var(--bg); }
.services-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}
.service-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
}
.service-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: rgba(198,161,79,.5);
}
.service-media { aspect-ratio: 3 / 2; }
.service-media img { width: 100%; height: 100%; object-fit: cover; }
.service-body { padding: 24px; flex: 1; }
.service-num {
  display: block;
  font-family: var(--font-display);
  font-size: .84rem;
  font-weight: 700;
  letter-spacing: .12em;
  color: var(--gold-deep);
  margin-bottom: 10px;
}
.service-body h3 { margin-bottom: 10px; }
.service-body p { font-size: .94rem; margin-bottom: 0; }

/* Card without a photograph — gold rule stands in for the image */
.service-card.is-iconic { background: var(--teal); }
.service-card.is-iconic .service-body { padding-top: 34px; }
.service-card.is-iconic .service-body::before {
  content: "";
  display: block;
  width: 44px; height: 3px;
  background: var(--gold);
  margin-bottom: 20px;
}
.service-card.is-iconic h3 { color: var(--on-dark); }
.service-card.is-iconic p  { color: var(--on-dark-soft); }
.service-card.is-iconic .service-num { color: var(--gold); }

.chip-list { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 14px; }
.chip-list li {
  list-style: none;
  font-size: .76rem;
  padding: 5px 11px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--body-c);
  background: var(--bg);
}

@media (max-width: 1100px) { .services-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 620px)  { .services-grid { grid-template-columns: 1fr; } }
```

Four columns keeps eight cards on two tidy rows.

- [ ] **Step 6: Verify eight cards render**

```bash
grep -c 'class="service-card' "D:/client/Mahendar-Pvt/index.html"
```

Expected: `8`.

```bash
grep -c 'cards-3' "D:/client/Mahendar-Pvt/index.html"
```

Expected: `0`.

- [ ] **Step 7: Screenshot the grid**

Capture at `--window-size=1440,4200`, output `t6.png`. Read it. Expected: a 4×2 grid of photo cards, each photo matching its heading — the welder card must read "Contract Labour Supply", the cleaner card "Housekeeping Manpower". A mismatch means the alt-text table in Step 3 was applied to the wrong card order.

- [ ] **Step 8: Commit**

```bash
cd "D:/client/Mahendar-Pvt"
git add index.html css/style.css
git commit -m "feat: eight service cards with construction photography

Adds Security Services and Facility Management per the brand logo's
service strip, moves the grid to four columns, and gives every card a
curtain-revealed photograph."
```

---

## Task 7: Why Us band

New dark photographic band carrying the four "Why Choose Us" points from the company profile PDF.

**Files:**
- Modify: `index.html` (insert after the services `</section>`, before the process section at `index.html:224`)
- Modify: `css/style.css` (append the `.why` block)

**Interfaces:**
- Consumes: `.band`, `.band-media`, `.on-dark`, `.kicker` from Task 2; `data-parallax` from Task 3; `assets/images/img-why.jpg` from Task 1.
- Produces: `.why`, `.why-grid`, `.why-item`, `.why-num`.

- [ ] **Step 1: Insert the section**

```html
  <!-- ============ WHY US ============ -->
  <section class="section why band on-dark" id="why" aria-labelledby="why-heading">
    <div class="band-media" data-parallax="0.10">
      <img src="assets/images/img-why.jpg" alt="High-rise buildings under construction with tower cranes" />
    </div>
    <div class="container">
      <div class="section-head is-centered">
        <p class="kicker" data-anim="fade-up">Why Choose Us</p>
        <h2 id="why-heading" data-anim="fade-up">Built on <em>expertise, screening and flexibility</em></h2>
      </div>
      <div class="why-grid">
        <article class="why-item" data-anim="card">
          <span class="why-num">01</span>
          <h3>Expertise</h3>
          <p>Our recruiters understand the staffing needs of different industries and find the right people for your operation.</p>
        </article>
        <article class="why-item" data-anim="card">
          <span class="why-num">02</span>
          <h3>Quality Candidates</h3>
          <p>A rigorous screening and selection process means you are matched with qualified workers, not whoever is available.</p>
        </article>
        <article class="why-item" data-anim="card">
          <span class="why-num">03</span>
          <h3>Flexibility</h3>
          <p>Customised staffing that adapts to your changing requirements and business cycles, scaling up or down as needed.</p>
        </article>
        <article class="why-item" data-anim="card">
          <span class="why-num">04</span>
          <h3>Client-Centric Approach</h3>
          <p>We build long-term partnerships rather than one-off placements, and stay accountable for how the deployment performs.</p>
        </article>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Add the nav link**

In the primary nav at `index.html:48-54`, insert after the Services item:

```html
          <li><a href="#why" data-scroll>Why Us</a></li>
```

Seven items plus the CTA is the practical ceiling for the 900px breakpoint. Do not add more.

- [ ] **Step 3: Add the CSS**

```css
/* ---------- Why us ---------- */
.why-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 28px;
}
.why-item { border-top: 2px solid rgba(198,161,79,.5); padding-top: 22px; }
.why-num {
  display: block;
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 800;
  color: var(--gold);
  line-height: 1;
  margin-bottom: 12px;
}
.why-item h3 { color: var(--on-dark); margin-bottom: 8px; }
.why-item p  { color: var(--on-dark-soft); font-size: .94rem; margin-bottom: 0; }

@media (max-width: 900px) { .why-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 560px) { .why-grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 4: Verify contrast and parallax containment**

Capture at `--window-size=1440,5200`, output `t7.png`. Read it. Expected: crane photograph under a heavy teal wash, white headings and gold numerals clearly legible, no bare edge at the top or bottom of the band where the parallax translation runs out.

- [ ] **Step 5: Verify no horizontal scroll was introduced**

Open the page in a browser and run in the console:

```js
document.documentElement.scrollWidth <= window.innerWidth
```

Expected: `true`. A `false` here means `.band-media`'s negative inset escaped the `overflow: hidden` on `.band`.

- [ ] **Step 6: Commit**

```bash
cd "D:/client/Mahendar-Pvt"
git add index.html css/style.css
git commit -m "feat: Why Us band over parallax construction photography

Four points taken from the company profile's 'Why Choose Us' section,
set on a dark teal-washed band with a crane photograph behind."
```

---

## Task 8: Process and Compliance

Restyle both to the new language. Markup changes are minimal — the content is already correct and sourced.

**Files:**
- Modify: `index.html:225-303` (process and compliance headings only)
- Modify: `css/style.css` (the `.process-*` and `.comp-*` blocks)

**Interfaces:**
- Consumes: `.kicker`, `.section-head`, `.band` from Task 2.
- Produces: `.process-grid`, `.process-step`, `.process-num`, `.compliance-grid`, `.comp-card`.

- [ ] **Step 1: Add gold emphasis to both headings**

At `index.html:229`:

```html
        <h2 data-anim="fade-up">From requirement to <em>deployment</em></h2>
```

At `index.html:261`:

```html
        <h2 data-anim="fade-up">Registrations &amp; licences <em>on record</em></h2>
```

- [ ] **Step 2: Replace the process CSS**

```css
/* ---------- Process ---------- */
.process { background: var(--teal-tint); }
.process-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  counter-reset: none;
}
.process-step {
  list-style: none;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 30px 26px;
  position: relative;
}
.process-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px; height: 46px;
  border-radius: 50%;
  background: var(--teal);
  color: var(--gold);
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 800;
  margin-bottom: 18px;
}
.process-step h3 { margin-bottom: 8px; }
.process-step p  { font-size: .93rem; margin-bottom: 0; }

@media (max-width: 900px) { .process-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 560px) { .process-grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 3: Move compliance onto a dark teal background**

Add `on-dark` to the compliance section's classes. At `index.html:257`:

```html
  <section class="section compliance on-dark" id="compliance">
```

Do **not** add `band`. This section has no photograph behind it, so it takes a flat `--teal-950` background rather than the photo-overlay treatment; `.band` would add an empty `::after` scrim over nothing.

```css
/* ---------- Compliance ---------- */
.compliance { background: var(--teal-950); }
.compliance .section-intro { color: var(--on-dark-soft); }
.compliance-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}
.comp-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px solid rgba(242,245,244,.16);
  border-radius: var(--radius);
  background: rgba(242,245,244,.04);
}
.comp-card img {
  width: 52px;
  height: 52px;
  object-fit: contain;
  flex: none;
  background: var(--surface);
  border-radius: var(--radius-sm);
  padding: 5px;
}
.comp-text h3 {
  color: var(--on-dark);
  font-size: .92rem;
  margin: 0 0 3px;
}
.comp-text p {
  margin: 0;
  font-size: .84rem;
  font-family: var(--font-body);
  color: var(--gold);
  word-break: break-all;
}

@media (max-width: 1000px) { .compliance-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 560px)  { .compliance-grid { grid-template-columns: 1fr; } }
```

The badge emblems are dark-on-white artwork, so each sits on a white plate rather than directly on the teal.

- [ ] **Step 4: Verify all eight badges still load**

```bash
cd "D:/client/Mahendar-Pvt"
grep -o 'assets/images/badge-[a-z-]*\.\(jpg\|png\)' index.html | sort -u | while read p; do
  [ -f "$p" ] && echo "ok   $p" || echo "FAIL missing $p"
done
```

Expected: eight `ok` lines, no `FAIL`.

- [ ] **Step 5: Screenshot**

Capture at `--window-size=1440,6400`, output `t8.png`. Read it. Expected: process cards on a pale teal wash with circular teal-and-gold numerals; compliance badges on white plates against the near-black teal band, registration numbers legible in gold.

- [ ] **Step 6: Commit**

```bash
cd "D:/client/Mahendar-Pvt"
git add index.html css/style.css
git commit -m "style: process and compliance in the new visual language

Process gets circular teal/gold step markers on a pale teal wash;
compliance moves onto the dark teal band with badges on white plates."
```

---

## Task 9: Clients and CTA band

**Files:**
- Modify: `index.html:305-322` (clients section), and insert the CTA band after it
- Modify: `css/style.css` (the `.clients-*` block, plus a new `.cta-band` block)

**Interfaces:**
- Consumes: `.band`, `.btn-primary`, `.kicker` from Task 2.
- Produces: `.clients-row`, `.client-logo`, `.clients-note`, `.cta-band`, `.cta-inner`.

- [ ] **Step 1: Restructure the clients strip to hold real logo files**

The client has been asked for real logo files; they have not arrived. Build the strip so a logo image drops in without further CSS work, and ship the text cards until then.

Replace `index.html:312-316` with:

```html
      <div class="clients-row" data-anim="fade-up">
        <!-- TODO: replace each .client-logo's text with
             <img src="assets/images/client-<name>.png" alt="<Company> logo" />
             once the client supplies logo files and confirms permission to display them. -->
        <div class="client-logo">Dream Plast</div>
        <div class="client-logo">Omnia Toys</div>
        <div class="client-logo">Venky's</div>
      </div>
```

Do not source these logos from the web. They are third-party trademarks and the client must supply them.

- [ ] **Step 2: Add gold emphasis to the heading**

At `index.html:310`:

```html
        <h2 data-anim="fade-up">Companies <em>we serve</em></h2>
```

- [ ] **Step 3: Insert the CTA band after the clients `</section>`**

```html
  <!-- ============ CTA BAND ============ -->
  <section class="cta-band" aria-labelledby="cta-heading">
    <div class="container cta-inner">
      <div>
        <h2 id="cta-heading" data-anim="fade-up">Need workers on site <em>next month?</em></h2>
        <p data-anim="fade-up">Tell us the roles, headcount and shift pattern. We will come back with a manpower plan and a commercial proposal.</p>
      </div>
      <a href="#contact" class="btn btn-primary" data-scroll data-anim="fade-up">Get a Quote</a>
    </div>
  </section>
```

- [ ] **Step 4: Add the CSS**

```css
/* ---------- Clients ---------- */
.clients { background: var(--surface); }
.clients-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 26px;
}
.client-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 108px;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--bg);
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--teal);
  text-align: center;
}
.client-logo img { max-height: 62px; width: auto; object-fit: contain; }
.clients-note { color: var(--muted); font-size: .94rem; margin: 0; }

/* ---------- CTA band ---------- */
.cta-band {
  background: var(--teal);
  border-top: 3px solid var(--gold);
  padding: clamp(44px, 5vw, 68px) 0;
}
.cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
}
.cta-band h2 { color: var(--on-dark); margin-bottom: 8px; }
.cta-band h2 em { color: var(--gold); font-style: normal; }
.cta-band p { color: var(--on-dark-soft); margin: 0; max-width: 620px; }
.cta-band .btn { flex: none; }

@media (max-width: 620px) {
  .clients-row { grid-template-columns: 1fr; }
  .cta-band .btn { width: 100%; }
}
```

- [ ] **Step 5: Verify the TODO is present and no logo file is referenced**

```bash
cd "D:/client/Mahendar-Pvt"
grep -c "TODO: replace each .client-logo" index.html
grep -c "client-dream\|client-omnia\|client-venky" index.html
```

Expected: `1` then `0`. A non-zero second count means a third-party logo was added against the constraint.

- [ ] **Step 6: Screenshot**

Capture at `--window-size=1440,7400`, output `t9.png`. Read it. Expected: three bordered client cards in slab type, then a teal CTA band with a gold top rule and a gold button.

- [ ] **Step 7: Commit**

```bash
cd "D:/client/Mahendar-Pvt"
git add index.html css/style.css
git commit -m "feat: clients strip ready for real logos, plus CTA band

Client cards keep text until the client supplies logo files; the markup
and CSS already accept an <img> drop-in. Adds a gold-ruled teal CTA band
above the contact section."
```

---

## Task 10: Contact and footer

**Files:**
- Modify: `index.html:324-425` (contact heading and footer service list)
- Modify: `css/style.css` (the `.contact-*` and `.site-footer` blocks)

**Interfaces:**
- Consumes: `.band`, `.btn-gold`, `.btn-outline-light`, `.on-dark` from Task 2.
- Produces: `.contact-grid`, `.contact-info`, `.contact-list`, `.contact-panel`, `.footer-grid`, `.footer-bottom`.

- [ ] **Step 1: Add gold emphasis to the contact heading**

At `index.html:329`:

```html
        <h2 data-anim="fade-up">Discuss your <em>manpower requirement</em></h2>
```

- [ ] **Step 2: Add the two new services to the footer list**

Replace the footer services list at `index.html:404-410` with:

```html
        <ul>
          <li><a href="#services" data-scroll>Manpower Services</a></li>
          <li><a href="#services" data-scroll>Contract Labour Supply</a></li>
          <li><a href="#services" data-scroll>Housekeeping Manpower</a></li>
          <li><a href="#services" data-scroll>Industrial Manpower</a></li>
          <li><a href="#services" data-scroll>Security Services</a></li>
          <li><a href="#services" data-scroll>Facility Management</a></li>
        </ul>
```

- [ ] **Step 3: Add the Why Us link to the footer company list**

In the footer company list at `index.html:394-400`, insert after the About item:

```html
          <li><a href="#why" data-scroll>Why Us</a></li>
```

- [ ] **Step 4: Replace the contact CSS**

```css
/* ---------- Contact ---------- */
.contact { background: var(--bg); }
.contact-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, .9fr);
  gap: clamp(28px, 4vw, 56px);
  align-items: start;
}
.contact-person { margin-bottom: 26px; padding-bottom: 22px; border-bottom: 1px solid var(--line); }
.contact-name {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}
.contact-role {
  margin: 0;
  font-size: .78rem;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--gold-deep);
}
.contact-list { display: grid; gap: 20px; }
.contact-list li { list-style: none; display: grid; gap: 3px; }
.ci-label {
  font-size: .72rem;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--muted);
}
.contact-list a { color: var(--teal); font-weight: 500; }
.contact-list a:hover { color: var(--gold-deep); }

.contact-panel {
  background: var(--teal-950);
  border-radius: var(--radius);
  border-top: 3px solid var(--gold);
  padding: clamp(28px, 3.5vw, 40px);
}
.contact-panel h3 { color: var(--on-dark); font-size: 1.25rem; }
.contact-panel p  { color: var(--on-dark-soft); }
.contact-actions { display: flex; flex-wrap: wrap; gap: 12px; margin: 24px 0 18px; }
.contact-panel-note { font-size: .88rem; margin: 0; }
.contact-panel-note a { color: var(--gold); font-weight: 600; }

@media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr; } }
@media (max-width: 560px) { .contact-actions .btn { width: 100%; } }
```

- [ ] **Step 5: Replace the footer CSS**

```css
/* ---------- Footer ---------- */
.site-footer { background: var(--teal-950); color: var(--on-dark-soft); }
.footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
  gap: 40px;
  padding: clamp(48px, 6vw, 76px) 24px clamp(36px, 4vw, 52px);
}
.footer-logo { width: 108px; border-radius: var(--radius-sm); margin-bottom: 18px; }
.footer-brand p { font-size: .92rem; margin: 0; }
.site-footer h4 {
  color: var(--on-dark);
  font-size: .8rem;
  letter-spacing: .14em;
  text-transform: uppercase;
  margin: 0 0 16px;
  font-family: var(--font-body);
  font-weight: 600;
}
.site-footer ul { display: grid; gap: 9px; }
.site-footer li { list-style: none; }
.site-footer a { color: var(--on-dark-soft); font-size: .92rem; }
.site-footer a:hover { color: var(--gold); }
.footer-contact p { margin: 0 0 9px; font-size: .92rem; }
.footer-bottom { border-top: 1px solid rgba(242,245,244,.14); }
.footer-bottom-inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 24px;
  padding-block: 20px;
}
.footer-bottom p { margin: 0; font-size: .82rem; }
.footer-reg { color: var(--muted); }

@media (max-width: 900px) { .footer-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .footer-grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 6: Verify the copyright year script still runs**

`index.html:421` contains `<span id="year"></span>`. Open the page in a browser and check the footer shows `© 2026`. If it is blank, the year-filling code in `js/script.js` did not run — check for a JS error in the console before proceeding.

- [ ] **Step 7: Screenshot the page tail**

Capture at `--window-size=1440,9000`, output `t10.png`. Read it. Expected: contact details in two columns with a dark gold-ruled action panel, then a four-column dark footer.

- [ ] **Step 8: Commit**

```bash
cd "D:/client/Mahendar-Pvt"
git add index.html css/style.css
git commit -m "style: contact and footer in the new visual language

Gold-ruled dark action panel on contact; footer service list picks up
Security Services and Facility Management."
```

---

## Task 11: Responsive, motion and accessibility pass

Everything is built. This task proves it holds together.

**Files:**
- Modify: `css/style.css` (fixes found during the pass)
- Modify: `index.html` (fixes found during the pass)

**Interfaces:**
- Consumes: every class produced by Tasks 2–10.
- Produces: no new interfaces. Corrections only.

- [ ] **Step 1: Confirm the breakpoint contract holds**

```bash
cd "D:/client/Mahendar-Pvt"
grep -n "innerWidth > 900" js/script.js
grep -n "max-width: 900px" css/style.css | head -3
```

Expected: at least one match in each. If the JS check reads a different number, change the CSS to match the JS — never the reverse without changing both.

- [ ] **Step 2: Verify no horizontal scroll at four widths**

For each of `430`, `768`, `900`, `1440`, capture a screenshot and read it:

```bash
for w in 430 768 900 1440; do
  "/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless --disable-gpu \
    --window-size=$w,9000 --virtual-time-budget=20000 \
    --screenshot="C:/Users/shiva/AppData/Local/Temp/claude/D--client-Mahendar-Pvt/10ba3152-7dcf-4eb4-a97e-d3ebf63a3a33/scratchpad/w$w.png" \
    "file:///D:/client/Mahendar-Pvt/index.html?noanim"
done
```

Expected in each: no content clipped at the right edge, no element overflowing its section, the mobile hamburger present at 430 and 768 and absent at 1440.

Headless Edge enforces a minimum layout width of roughly 500px, so the 430 capture may render at ~500px. For a true 430px check, load the page inside a 430px-wide `<iframe>` in a scratchpad HTML harness and screenshot that at `--window-size=900,9000`.

- [ ] **Step 3: Verify reduced motion**

Confirm every `?noanim` screenshot taken so far shows fully opaque content. Then check the CSS guard exists:

```bash
grep -n "prefers-reduced-motion" "D:/client/Mahendar-Pvt/css/style.css"
```

Expected: at least the block added in Task 3 Step 6. If the pre-existing stylesheet had its own reduced-motion block that was removed during the rewrite, restore it.

- [ ] **Step 4: Verify every image has alt text**

```bash
cd "D:/client/Mahendar-Pvt"
grep -o '<img [^>]*>' index.html | grep -v 'alt=' 
```

Expected: no output. Any line printed is an image missing `alt`.

- [ ] **Step 5: Verify no orphaned CSS classes**

```bash
cd "D:/client/Mahendar-Pvt"
for c in hero-media cards-3 stats-grid; do
  echo "== $c"; grep -n "$c" index.html css/style.css
done
```

Expected: no matches. These are classes from the pre-rebuild markup — `hero-media` and `stats-grid` were replaced in Task 4, `cards-3` in Task 6. Delete any leftover CSS rule that still targets them.

- [ ] **Step 6: Verify the fabricated statistic never returned**

```bash
cd "D:/client/Mahendar-Pvt"
grep -rn "98.9\|retention" index.html css/style.css
```

Expected: no output.

- [ ] **Step 7: Verify anchor navigation**

Open the page in a browser. Click each nav item: About, Services, Why Us, How We Work, Compliance, Clients, Get a Quote. Expected: each scrolls smoothly to its section with the heading clear of the fixed header — that is what `scroll-padding-top: calc(var(--header-h) + 16px)` from Task 2 Step 3 provides. If a heading hides behind the header, raise the offset.

- [ ] **Step 8: Verify the site works with libraries missing**

Temporarily rename the vendor directory and reload:

```bash
cd "D:/client/Mahendar-Pvt" && mv js/vendor js/vendor-off
```

Open the page. Expected: all content visible and readable, no smooth scroll, no reveals, no JS errors that break the nav or the back-to-top button. Then restore:

```bash
cd "D:/client/Mahendar-Pvt" && mv js/vendor-off js/vendor
```

- [ ] **Step 9: Commit any fixes**

```bash
cd "D:/client/Mahendar-Pvt"
git add -A
git commit -m "fix: responsive, motion and accessibility corrections

Findings from the full-width pass across 430/768/900/1440, the
reduced-motion path, and the no-JavaScript-libraries fallback."
```

If Steps 1–8 all passed with no edits, skip this commit rather than creating an empty one.

---

## Task 12: Update CLAUDE.md

Without this, the next session reads `CLAUDE.md`, finds instructions mandating the design that was just replaced, and reverts the work.

**Files:**
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: the finished state of every earlier task.
- Produces: accurate project guidance.

- [ ] **Step 1: Rewrite the Brand section**

Replace the `## Brand` section's bullet about the restrained look with:

```markdown
- The look is **construction-forward**: full-bleed site photography under a `--teal-950` overlay, dark photographic bands, Roboto Slab display type with gold `<em>` emphasis, and curtain reveals on images.
- **History, so this is not re-litigated:** a deliberately flat, restrained corporate design shipped in the 2026 revamp ("shouldn't look AI-built" — flat colors, 1px borders, no gradients, sparing gold). The client rejected it in August 2026 and asked for the treatment used in the sibling `real-estate-agent` project. Do not restore the flat direction without a fresh client instruction.
- Palette derives from the logo and is not imported from the reference site: `--teal-950 #061A1E` (overlays, bands, footer) · `--teal #00343C` (logo ground) · `--gold #C6A14F` (logo lettering) · `--gold-deep #96772F` (gold text on light) · `--bg #FAFAF8`.
- Type: **Roboto Slab** display, **Inter** body (Google Fonts `<link>`). Archivo is retired.
```

- [ ] **Step 2: Correct the legal name**

In the "Company data" section, change the legal/trade names line to:

```markdown
- **Legal/trade names:** Mahendra Facility Services Pvt Ltd (per the business card) — displayed as "Mahendra Facility Services" / formerly Mahendra Consultancy Services. Note: the email/website domain remains `mahendraconsultancy.co.in` — keep those functional addresses as-is.
```

- [ ] **Step 3: Update the services list to eight**

```markdown
- **Services (8):** Manpower Services, Contract Labour Supplier Services, Housekeeping Manpower Services, Industrial Manpower Services, Staffing Service, Contract Employment Services, Security Services, Facility Management. Security and Facility Management were added in August 2026 to match the logo's service strip. Security is partly backed by the PDF (direct-employee security staff, PASARA/Guard Board work); **Facility Management is backed only by the logo and the company name** — keep its copy general until the client confirms the FM scope they take on.
```

- [ ] **Step 4: Update the stats line**

Change `6 service lines` to `8 service lines` in the numbers bullet. Leave the rest of that bullet, including the note about the removed 98.9% figure, unchanged.

- [ ] **Step 5: Rewrite the asset inventory table**

Replace the table rows for the photographs with the eleven files from Task 1 and their subjects, keeping the badge and logo rows as they are. Delete the `img-contact.jpg` row. If Task 1 took the security fallback, omit the `svc-security.jpg` row and note that the Security card uses `.service-card.is-iconic`.

- [ ] **Step 6: Update the structure and animation notes**

In the `## Structure` block, add `docs/superpowers/` and change the `index.html` description to list the new section order: topbar, sticky nav, hero, about, services, why, process, compliance, clients, CTA, contact, footer.

In `## Animation / interaction notes`, replace the claim that side-slide presets map to fade-up with:

```markdown
- `data-anim="..."` drives GSAP reveal presets. Directional presets (`fade-left`, `fade-right`) are genuinely directional again — the 2026 flattening was reverted with the construction rebuild. `.img-reveal` adds a curtain wipe on images (CSS transition, `.is-in` class toggled by ScrollTrigger). `data-parallax` is live again on `.band-media` in the hero and Why Us band.
- **`?noanim`** forces the reduced-motion path. Use it for deterministic headless screenshots.
```

- [ ] **Step 7: Add the screenshot recipe**

Under `## Running / previewing`, add:

```markdown
Headless screenshot (verified on this machine):

    "/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless --disable-gpu \
      --window-size=1440,9000 --virtual-time-budget=20000 --screenshot=out.png \
      "file:///D:/client/Mahendar-Pvt/index.html?noanim"

The hero is capped at `min(92vh, 900px)` so tall-viewport captures work. Headless Edge enforces a ~500px minimum layout width — for narrower checks, wrap the page in a fixed-width `<iframe>` harness.
```

- [ ] **Step 8: Verify the file no longer contradicts the build**

The historical note from Step 1 deliberately quotes the retired direction ("Archivo is retired", "no gradients", "gold used sparingly"), so a naive grep for those strings will match by design. Check instead that no line still *instructs* the old design or names a deleted file:

```bash
cd "D:/client/Mahendar-Pvt"
grep -n "Six service\|img-contact\|font-display.*Archivo" CLAUDE.md
grep -n "Archivo" CLAUDE.md | grep -v "retired"
```

Expected: no output from either command. Any hit is a live instruction toward the replaced design, not a historical note.

- [ ] **Step 9: Commit**

```bash
cd "D:/client/Mahendar-Pvt"
git add CLAUDE.md
git commit -m "docs: update project guide for the construction rebuild

Records that the flat 2026 corporate direction was rejected in August 2026,
so a future session does not revert the rebuild. Updates palette, type,
the eight-service list, the Pvt Ltd legal name, the asset inventory, the
animation notes and the screenshot recipe."
```

---

## Open items to raise with the client after delivery

Neither blocks the build; both should be surfaced once the site is up.

1. **Client logo files** — Dream Plast, Omnia Toys and Venky's are shipping as text cards. Real logo files plus confirmation that they may be displayed will complete the Clients strip. The markup already accepts an `<img>` drop-in.
2. **Facility Management scope** — the service card ships with general copy because only the logo and company name support the claim. Once the client describes the FM work they actually take on, the card copy should be made specific.
