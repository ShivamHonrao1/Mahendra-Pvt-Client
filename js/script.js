/* ============================================================
   Mahendra Facility Services — interactions
   Lenis smooth scroll + GSAP ScrollTrigger animations.
   Vendored libs (no CDN). Degrades gracefully if libs absent.
   ============================================================ */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var hasGSAP = typeof window.gsap !== "undefined";
  var hasST = hasGSAP && typeof window.ScrollTrigger !== "undefined";
  var hasLenis = typeof window.Lenis !== "undefined";

  document.addEventListener("DOMContentLoaded", function () {
    var lenis = initSmoothScroll();
    initHeader();
    initNav(lenis);
    initBackToTop(lenis);
    initAnchorScroll(lenis);
    initScrollProgress();
    initAnimations();
    initCounters();

    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });

  /* ---- Lenis smooth scroll, synced to GSAP ticker ---- */
  function initSmoothScroll() {
    if (!hasLenis || prefersReduced) return null;

    var lenis = new Lenis({
      duration: 1.1,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });

    if (hasGSAP) {
      lenis.on("scroll", function () {
        if (hasST) ScrollTrigger.update();
      });
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    return lenis;
  }

  /* ---- Header: solid background after scrolling ---- */
  function initHeader() {
    var header = document.getElementById("siteHeader");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("scrolled", window.pageYOffset > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile nav toggle ---- */
  function initNav(lenis) {
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("primaryNav");
    if (!toggle || !nav) return;

    function close() {
      nav.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") close();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) close();
    });
  }

  /* ---- Smooth anchor scrolling (works with or without Lenis) ---- */
  function initAnchorScroll(lenis) {
    var links = document.querySelectorAll('a[data-scroll], a[href^="#"]');
    links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        var href = link.getAttribute("href");
        if (!href || href.charAt(0) !== "#" || href === "#") return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var offset = 68;
        if (lenis) {
          lenis.scrollTo(target, { offset: -offset, duration: 1.2 });
        } else {
          var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: y, behavior: prefersReduced ? "auto" : "smooth" });
        }
      });
    });
  }

  /* ---- Back to top ---- */
  function initBackToTop(lenis) {
    var btn = document.getElementById("toTop");
    if (!btn) return;
    var onScroll = function () {
      btn.classList.toggle("show", window.pageYOffset > 620);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", function () {
      if (lenis) lenis.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
    onScroll();
  }

  /* ---- Scroll progress bar ---- */
  function initScrollProgress() {
    var bar = document.getElementById("scrollProgress");
    if (!bar) return;
    var update = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (window.pageYOffset / max) * 100 : 0;
      bar.style.width = pct + "%";
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---- Scroll-triggered reveal animations ---- */
  function initAnimations() {
    var animEls = document.querySelectorAll("[data-anim]");

    // Fallback: no GSAP or reduced motion -> just show everything.
    if (!hasST || prefersReduced) {
      animEls.forEach(function (el) { el.style.opacity = "1"; el.style.transform = "none"; });
      initParallaxFallback();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Group [data-anim] elements by their nearest section for stagger.
    /* Subtle, corporate reveals — small vertical offsets only.
       (Side-slide presets intentionally map to fade-up.) */
    var presets = {
      "fade-up":    { from: { y: 26, opacity: 0 } },
      "fade-right": { from: { y: 26, opacity: 0 } },
      "fade-left":  { from: { y: 26, opacity: 0 } },
      "hero-title": { from: { y: 30, opacity: 0 }, dur: 0.9 },
      "hero-media": { from: { y: 26, opacity: 0 }, dur: 1.0 },
      "card":       { from: { y: 28, opacity: 0 } },
      "stat":       { from: { y: 20, opacity: 0 } }
    };

    // Set initial states
    animEls.forEach(function (el) {
      var key = el.getAttribute("data-anim");
      var p = presets[key] || presets["fade-up"];
      gsap.set(el, p.from);
    });

    // Animate grouped elements with a small stagger per parent container.
    var groups = new Map();
    animEls.forEach(function (el) {
      var parent = el.closest("section") || document.body;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(el);
    });

    groups.forEach(function (els) {
      els.forEach(function (el, i) {
        var key = el.getAttribute("data-anim");
        var p = presets[key] || presets["fade-up"];
        gsap.to(el, {
          x: 0, y: 0, opacity: 1, scale: 1,
          duration: p.dur || 0.75,
          ease: "power2.out",
          delay: Math.min(i, 5) * 0.06,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none"
          }
        });
      });
    });

    initParallax();
    // Recalculate once images have loaded (heights change).
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }

  /* ---- Parallax on decorative frames/floats via ScrollTrigger ---- */
  function initParallax() {
    var els = document.querySelectorAll("[data-parallax]");
    els.forEach(function (el) {
      var speed = parseFloat(el.getAttribute("data-parallax")) || 0.1;
      gsap.to(el, {
        yPercent: speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("section") || el,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });
  }

  // If GSAP missing, ensure parallax elements are visible/static.
  function initParallaxFallback() {
    document.querySelectorAll("[data-parallax]").forEach(function (el) {
      el.style.transform = "none";
    });
  }

  /* ---- Animated number counters ---- */
  function initCounters() {
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;

    function animate(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var decimals = (String(target).split(".")[1] || "").length;
      var start = 0, dur = 1600, t0 = null;

      function step(ts) {
        if (!t0) t0 = ts;
        var prog = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - prog, 3);
        var val = start + (target - start) * eased;
        el.textContent = val.toFixed(decimals) + suffix;
        if (prog < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals) + suffix;
      }
      requestAnimationFrame(step);
    }

    if (prefersReduced) {
      nums.forEach(function (el) {
        var t = parseFloat(el.getAttribute("data-count"));
        var s = el.getAttribute("data-suffix") || "";
        var d = (String(t).split(".")[1] || "").length;
        el.textContent = t.toFixed(d) + s;
      });
      return;
    }

    if (hasST) {
      nums.forEach(function (el) {
        ScrollTrigger.create({
          trigger: el,
          start: "top 92%",
          once: true,
          onEnter: function () { animate(el); }
        });
      });
    } else if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { animate(en.target); obs.unobserve(en.target); }
        });
      }, { threshold: 0.5 });
      nums.forEach(function (el) { io.observe(el); });
    } else {
      nums.forEach(animate);
    }
  }
})();
