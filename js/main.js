/* =========================================================================
   main.js — rendering, interactions and animations
   -------------------------------------------------------------------------
   Content comes from window.PORTFOLIO (js/data.js). Each feature lives in
   its own init* function, wired up in init() at the bottom of this file.

   GSAP + ScrollTrigger are used when available (CDN); every animation has
   a vanilla fallback so the site still works offline or if the CDN fails.
   ========================================================================= */

(function () {
  "use strict";

  window.__portfolioReady = true; // tells the inline safety-net in <head> that JS is running

  /* =======================================================================
     HELPERS
     ======================================================================= */
  const DATA = window.PORTFOLIO || {};
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGSAP = () => !reducedMotion && typeof window.gsap !== "undefined";
  const hasScrollTrigger = () => hasGSAP() && typeof window.ScrollTrigger !== "undefined";

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  /** Escape user-editable strings before putting them in innerHTML. */
  function esc(str = "") {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /** Run fn at most once per animation frame (scroll/pointer throttling). */
  function rafThrottle(fn) {
    let ticking = false;
    return function (...args) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        fn.apply(this, args);
        ticking = false;
      });
    };
  }

  /** Delay fn until events stop firing for `wait` ms (resize). */
  function debounce(fn, wait = 150) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  /** Is this a real link, or a "#" placeholder? */
  const isRealLink = (url) => url && url.trim() !== "" && url.trim() !== "#";

  /**
   * Image with an automatic dashed placeholder behind it.
   * If the file is missing, onerror hides the <img> and the placeholder
   * (showing the expected file name + size) becomes visible.
   */
  function mediaHTML({ src, w, h, alt = "", cls = "", lazy = true }) {
    const file = src ? src.split("/").pop() : "image.jpg";
    return `
      <div class="media ${cls}">
        <div class="ph" aria-hidden="true">
          <i class="fa-regular fa-image"></i><span>${esc(file)}</span><small>${w} × ${h}</small>
        </div>
        ${src ? `<img src="${esc(src)}" alt="${esc(alt)}" width="${w}" height="${h}"
          ${lazy ? 'loading="lazy"' : ""} decoding="async" onerror="this.classList.add('is-missing')">` : ""}
      </div>`;
  }

  /** Returns the focusable elements inside a container. */
  function getFocusable(container) {
    return $$(
      'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]), select, [tabindex]:not([tabindex="-1"])',
      container
    ).filter((el) => el.offsetParent !== null || el === document.activeElement);
  }

  /** Keeps Tab / Shift+Tab inside `elements` (used by the modal + mobile menu). */
  function trapTab(e, elements) {
    if (e.key !== "Tab" || !elements.length) return;
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* =======================================================================
     RENDERING (from data.js)
     ======================================================================= */

  function renderSocials() {
    const links = (DATA.social || [])
      .map((s) => {
        const external = /^https?:/.test(s.url);
        return `<a href="${esc(s.url)}" aria-label="${esc(s.label)}" ${external ? 'target="_blank" rel="noopener"' : ""}>
                  <i class="${esc(s.icon)}" aria-hidden="true"></i>
                </a>`;
      })
      .join("");
    $$("[data-socials]").forEach((el) => (el.innerHTML = links));
  }

  function renderStats() {
    const el = $("#stats");
    if (!el) return;
    el.innerHTML = (DATA.stats || [])
      .map(
        (s) => `
        <li class="stat" data-reveal>
          <span class="stat__value" data-count="${Number(s.value) || 0}" data-suffix="${esc(s.suffix || "")}">0${esc(s.suffix || "")}</span>
          <span class="stat__label">${esc(s.label)}</span>
        </li>`
      )
      .join("");
  }

  function renderServices() {
    const grid = $("#servicesGrid");
    if (!grid) return;
    grid.innerHTML = (DATA.services || [])
      .map(
        (svc, i) => `
        <article class="service-card" data-reveal data-spotlight>
          <div class="service-card__top">
            <span class="service-card__icon"><i class="${esc(svc.icon)}" aria-hidden="true"></i></span>
            <span class="service-card__num" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
          </div>
          <h3 class="service-card__title">${esc(svc.title)}</h3>
          <p class="service-card__text">${esc(svc.text)}</p>
          <ul class="service-card__tags">
            ${(svc.tags || []).map((t) => `<li>${esc(t)}</li>`).join("")}
          </ul>
        </article>`
      )
      .join("");
  }

  function renderSkills() {
    const grid = $("#skillsGrid");
    if (!grid) return;
    grid.innerHTML = (DATA.skills || [])
      .map(
        (cat) => `
        <article class="skill-card" data-reveal data-spotlight>
          <header class="skill-card__head">
            <span class="skill-card__icon"><i class="${esc(cat.icon)}" aria-hidden="true"></i></span>
            <div>
              <h3 class="skill-card__title">${esc(cat.category)}</h3>
              <p class="skill-card__count">${cat.items.length} skill${cat.items.length === 1 ? "" : "s"}</p>
            </div>
          </header>
          <ul class="chips">
            ${cat.items
              .map((s) => `<li class="chip"><i class="${esc(s.icon)}" aria-hidden="true"></i>${esc(s.name)}</li>`)
              .join("")}
          </ul>
        </article>`
      )
      .join("");
  }

  /** Marquee content is duplicated once so translateX(-50%) loops seamlessly. */
  function renderMarquee() {
    const items = DATA.marquee || [];
    const html = (list) =>
      list.map((t) => `<span class="marquee__item"><i class="${esc(t.icon)}"></i>${esc(t.name)}</span>`).join("");
    const a = $("#marqueeA");
    const b = $("#marqueeB");
    if (a) a.innerHTML = html(items) + html(items);
    if (b) {
      const reversed = items.slice().reverse();
      b.innerHTML = html(reversed) + html(reversed);
    }
  }

  function renderExperience() {
    const list = $("#timelineList");
    if (!list) return;
    list.innerHTML = (DATA.experience || [])
      .map((job) => {
        const initials = job.company
          .split(/\s+/)
          .filter((w) => /^[A-Za-z]/.test(w))
          .slice(0, 2)
          .map((w) => w[0].toUpperCase())
          .join("");
        const badge = job.current ? '<span class="badge-current">Current</span>' : "";
        return `
        <li class="timeline__item" data-reveal>
          <span class="timeline__dot" aria-hidden="true"></span>
          <div class="timeline__side">
            <p class="timeline__side-period">${esc(job.period)}</p>
            ${badge}
          </div>
          <article class="exp-card glass" data-spotlight>
            <header class="exp-card__head">
              <div class="exp-card__logo" title="${esc(job.logo || "")} — 200×200 PNG">
                <span class="exp-card__initials" aria-hidden="true">${esc(initials)}</span>
                ${job.logo ? `<img src="${esc(job.logo)}" alt="${esc(job.company)} logo" width="200" height="200" loading="lazy" onerror="this.classList.add('is-missing')">` : ""}
              </div>
              <div>
                <h3 class="exp-card__company">${esc(job.company)}</h3>
                <p class="exp-card__period"><i class="fa-regular fa-calendar" aria-hidden="true"></i>${esc(job.period)} ${badge}</p>
              </div>
            </header>
            <div class="exp-card__roles">
              ${job.roles.map((r) => `<span class="role-tag">${esc(r)}</span>`).join("")}
            </div>
            <ul class="exp-card__points">
              ${job.points.map((p) => `<li>${esc(p)}</li>`).join("")}
            </ul>
          </article>
        </li>`;
      })
      .join("");
  }

  const categoryLabel = (key) => {
    const f = (DATA.projectFilters || []).find((x) => x.key === key);
    return f ? f.label : key;
  };

  function renderProjectFilters() {
    const wrap = $("#projectFilters");
    if (!wrap) return;
    const projects = DATA.projects || [];
    wrap.innerHTML = (DATA.projectFilters || [])
      .map((f) => ({ ...f, count: f.key === "all" ? projects.length : projects.filter((p) => p.category === f.key).length }))
      .filter((f) => f.key === "all" || f.count > 0) // hide empty categories
      .map(({ key, label, count }, i) => {
        const f = { key, label };
        return `<button type="button" class="filter-btn${i === 0 ? " is-active" : ""}" data-filter="${esc(f.key)}" aria-pressed="${i === 0}">
                  ${esc(f.label)}<span class="filter-btn__count">${count}</span>
                </button>`;
      })
      .join("");
  }

  function projectLinksHTML(p, cls = "link-btn") {
    const link = (url, icon, label) =>
      !url
        ? ""
        : isRealLink(url)
        ? `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener"><i class="${icon}" aria-hidden="true"></i>${label}</a>`
        : `<span class="${cls} is-disabled" aria-disabled="true" title="Link coming soon"><i class="${icon}" aria-hidden="true"></i>${label}</span>`;
    return link(p.live, "fa-solid fa-arrow-up-right-from-square", "Live Demo") + link(p.github, "fa-brands fa-github", "GitHub");
  }

  /** "https://www.example.com/x" → "example.com" (for the browser bar) */
  function domainOf(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch (e) {
      return "";
    }
  }

  /** Browser-window frame around a full-page screenshot (scrolls on hover). */
  function browserShotHTML(p, { cls = "", lazy = true } = {}) {
    const file = p.image.split("/").pop();
    const domain = isRealLink(p.live) ? domainOf(p.live) : "";
    return `
      <div class="browser ${cls}">
        <div class="browser__bar" aria-hidden="true">
          <span class="browser__dots"><i></i><i></i><i></i></span>
          <span class="browser__url"><i class="fa-solid fa-lock"></i>${esc(domain || p.title)}</span>
        </div>
        <div class="browser__screen media">
          <div class="ph" aria-hidden="true">
            <i class="fa-regular fa-image"></i><span>${esc(file)}</span><small>800 px wide · full page</small>
          </div>
          <img class="shot" src="${esc(p.image)}" alt="${esc(p.title)} website screenshot" width="800"
            ${lazy ? 'loading="lazy"' : ""} decoding="async" onerror="this.classList.add('is-missing')">
        </div>
      </div>`;
  }

  function renderProjects() {
    const grid = $("#projectsGrid");
    if (!grid) return;
    grid.innerHTML = (DATA.projects || [])
      .map(
        (p, i) => `
        <article class="project-card${p.featured ? " project-card--featured" : ""}" data-category="${esc(p.category)}" data-reveal data-tilt data-spotlight>
          <div class="project-card__media">
            ${browserShotHTML(p)}
            <div class="project-card__overlay" aria-hidden="true">
              <span><i class="fa-solid fa-expand"></i> View details</span>
            </div>
          </div>
          <div class="project-card__body">
            <p class="project-card__cat">${esc(categoryLabel(p.category))}${p.featured ? ' <span class="project-card__badge"><i class="fa-solid fa-star" aria-hidden="true"></i> Featured</span>' : ""}</p>
            <h3 class="project-card__title">
              <button type="button" class="project-card__open" data-index="${i}" aria-haspopup="dialog">${esc(p.title)}</button>
            </h3>
            <p class="project-card__desc">${esc(p.description)}</p>
            <ul class="tags" aria-label="Technologies">
              ${p.tech.map((t) => `<li class="tag">${esc(t)}</li>`).join("")}
            </ul>
            <div class="project-card__links">${projectLinksHTML(p)}</div>
          </div>
        </article>`
      )
      .join("");

    // Show only the first N cards until "View all projects" is clicked
    const limit = Number(DATA.projectsInitial) || 0;
    const cards = $$(".project-card", grid);
    if (limit && cards.length > limit) {
      cards.slice(limit).forEach((c) => c.classList.add("is-extra", "is-hidden"));
      grid.insertAdjacentHTML(
        "afterend",
        `<div class="projects__more"><button type="button" class="btn btn--ghost" id="projectsMore" data-magnetic>
           View all projects <span class="filter-btn__count">${cards.length}</span> <i class="fa-solid fa-arrow-down" aria-hidden="true"></i>
         </button></div>`
      );
    }
  }

  function renderEducation() {
    const grid = $("#educationGrid");
    if (!grid) return;
    grid.innerHTML = (DATA.education || [])
      .map(
        (e) => `
        <article class="edu-card glass${e.featured ? " edu-card--featured" : ""}" data-reveal data-spotlight>
          <div class="edu-card__text">
            <div class="edu-card__top">
              <span class="edu-card__icon"><i class="${esc(e.icon || "fa-solid fa-graduation-cap")}" aria-hidden="true"></i></span>
              <span class="edu-card__period">${esc(e.period)}</span>
            </div>
            <h3 class="edu-card__title">${esc(e.title)}</h3>
            ${e.subtitle ? `<p class="edu-card__subtitle">${esc(e.subtitle)}</p>` : ""}
            ${e.institution ? `<p class="edu-card__inst"><i class="fa-solid fa-building-columns" aria-hidden="true"></i> ${esc(e.institution)}</p>` : ""}
            ${e.description ? `<p class="edu-card__desc">${esc(e.description)}</p>` : ""}
          </div>
          ${e.image ? mediaHTML({ src: e.image, w: 1200, h: 850, alt: `${e.title} certificate`, cls: "edu-card__media" }) : ""}
        </article>`
      )
      .join("");
  }

  function renderTestimonials() {
    const section = $("#testimonials");
    const track = $("#sliderTrack");
    const items = DATA.testimonials || [];
    if (!section || !track) return false;
    if (DATA.showTestimonials === false || !items.length) {
      section.remove();
      return false;
    }
    track.innerHTML = items
      .map(
        (t, i) => `
        <div class="slide" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${items.length}">
          <figure class="testimonial glass">
            <i class="fa-solid fa-quote-left testimonial__quote-icon" aria-hidden="true"></i>
            <blockquote class="testimonial__text"><p>${esc(t.quote)}</p></blockquote>
            <figcaption class="testimonial__author">
              ${mediaHTML({ src: t.image, w: 200, h: 200, alt: t.name, cls: "testimonial__avatar" })}
              <span>
                <span class="testimonial__name">${esc(t.name)}</span><br>
                <span class="testimonial__role">${esc(t.role)}</span>
              </span>
            </figcaption>
          </figure>
        </div>`
      )
      .join("");
    $("#sliderDots").innerHTML = items
      .map((_, i) => `<button type="button" class="slider__dot" data-slide="${i}" aria-label="Show testimonial ${i + 1}"><span></span></button>`)
      .join("");
    return true;
  }

  /* =======================================================================
     THEME TOGGLE (saved in localStorage)
     ======================================================================= */
  function initTheme() {
    const btn = $("#themeToggle");
    const root = document.documentElement;
    const meta = $('meta[name="theme-color"]');

    const apply = (theme) => {
      root.setAttribute("data-theme", theme);
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
      if (meta) meta.setAttribute("content", theme === "dark" ? "#0A0A0F" : "#F6F6FA");
    };

    apply(root.getAttribute("data-theme") || "dark");

    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* storage unavailable (private mode) — theme still switches */
      }
    });
  }

  /* =======================================================================
     PAGE LOADER — "MS" intro, capped at 1.5s after navigation start
     ======================================================================= */
  function initLoader(onDone) {
    const loader = $("#loader");
    const MIN = reducedMotion ? 0 : 1000; // let the intro play
    const MAX = 1500; // never block longer than this
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      if (loader) {
        loader.classList.add("is-done");
        setTimeout(() => loader.remove(), 600);
      }
      onDone();
    };

    const afterMin = () => setTimeout(finish, Math.max(0, MIN - performance.now()));
    if (document.readyState === "complete") afterMin();
    else window.addEventListener("load", afterMin, { once: true });
    setTimeout(finish, Math.max(0, MAX - performance.now()));
  }

  /* =======================================================================
     HERO INTRO — heading line reveal + staggered fade-up
     ======================================================================= */
  function initHeroIntro() {
    const items = $$("[data-hero]");
    items.forEach((el, i) => el.style.setProperty("--i", i));

    if (hasGSAP()) {
      const tl = window.gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(".hero__title .line-inner", { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.12 })
        .fromTo(items, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, "-=0.6");
    } else {
      document.documentElement.classList.add("hero-ready");
    }
  }

  /* =======================================================================
     TYPING EFFECT (vanilla JS)
     ======================================================================= */
  function initTyping() {
    const el = $("#typing");
    const roles = (DATA.profile && DATA.profile.roles) || [];
    if (!el || !roles.length) return;

    // Reduced motion: swap whole words instead of typing
    if (reducedMotion) {
      let i = 0;
      el.textContent = roles[0];
      setInterval(() => {
        i = (i + 1) % roles.length;
        el.textContent = roles[i];
      }, 3000);
      return;
    }

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const word = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) {
          deleting = true;
          return setTimeout(tick, 1800); // pause on the full word
        }
        return setTimeout(tick, 60 + Math.random() * 60);
      }
      charIndex--;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        return setTimeout(tick, 350);
      }
      return setTimeout(tick, 32);
    };
    tick();
  }

  /* =======================================================================
     NAVBAR — active link highlighting (IntersectionObserver)
     ======================================================================= */
  function initActiveLinks() {
    const links = $$(".nav__link, .mobile-menu__link");
    const sections = $$("main section[id]");
    if (!("IntersectionObserver" in window)) return;

    const setActive = (id) => {
      links.forEach((a) => {
        const active = a.getAttribute("href") === `#${id}`;
        a.classList.toggle("is-active", active);
        if (active) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          // Testimonials has no nav link — keep the previous one highlighted
          if (links.some((a) => a.getAttribute("href") === `#${id}`)) setActive(id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* =======================================================================
     MOBILE MENU — slide-in panel with focus trap
     ======================================================================= */
  const menu = { open: false };

  function initMobileMenu() {
    const btn = $("#hamburger");
    const panel = $("#mobileMenu");
    const backdrop = $("#menuBackdrop");
    if (!btn || !panel) return;

    const onKey = (e) => {
      if (e.key === "Escape") close();
      trapTab(e, [btn, ...getFocusable(panel)]);
    };

    function open() {
      menu.open = true;
      btn.setAttribute("aria-expanded", "true");
      btn.setAttribute("aria-label", "Close menu");
      panel.setAttribute("aria-hidden", "false");
      backdrop.hidden = false;
      requestAnimationFrame(() => {
        panel.classList.add("is-open");
        backdrop.classList.add("is-open");
      });
      document.body.classList.add("is-locked");
      document.addEventListener("keydown", onKey);
      setTimeout(() => {
        const first = $(".mobile-menu__link", panel);
        if (first) first.focus();
      }, 250);
    }

    function close(returnFocus = true) {
      if (!menu.open) return;
      menu.open = false;
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Open menu");
      panel.setAttribute("aria-hidden", "true");
      panel.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      setTimeout(() => (backdrop.hidden = true), 400);
      document.body.classList.remove("is-locked");
      document.removeEventListener("keydown", onKey);
      if (returnFocus) btn.focus();
    }

    btn.addEventListener("click", () => (menu.open ? close() : open()));
    backdrop.addEventListener("click", () => close());
    $$("a", panel).forEach((a) => a.addEventListener("click", () => close(false)));

    // Close automatically when resizing up to desktop
    window.addEventListener(
      "resize",
      debounce(() => {
        if (window.innerWidth >= 1024) close(false);
      })
    );
  }

  /* =======================================================================
     SCROLL-DRIVEN UI — one rAF-throttled scroll handler for:
     nav blur + hide/show, progress bar, back-to-top ring, timeline draw
     ======================================================================= */
  function initScrollUI() {
    const nav = $("#nav");
    const bar = $("#scrollProgress");
    const backBtn = $("#backToTop");
    const ring = $("#backToTopRing");
    const timeline = $("#timeline");
    const timelineFill = $("#timelineProgress");
    const items = $$(".timeline__item");
    const RING_LEN = 2 * Math.PI * 22; // circle r=22

    let lastY = window.scrollY;

    const update = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      const progress = max > 0 ? clamp(y / max, 0, 1) : 0;

      // Navbar: blur background after scrolling, hide on scroll down, show on scroll up
      nav.classList.toggle("is-scrolled", y > 16);
      const delta = y - lastY;
      const navHasFocus = nav.contains(document.activeElement);
      if (y > 320 && delta > 6 && !menu.open && !navHasFocus) nav.classList.add("is-hidden");
      else if (delta < -6 || y <= 320) nav.classList.remove("is-hidden");
      lastY = y;

      // Top progress bar
      bar.style.transform = `scaleX(${progress})`;

      // Back-to-top button + circular progress ring
      backBtn.classList.toggle("is-visible", y > vh * 0.8);
      ring.style.strokeDashoffset = String(RING_LEN * (1 - progress));

      // Timeline line draws itself as you scroll through the section
      if (timeline) {
        const rect = timeline.getBoundingClientRect();
        const start = vh * 0.65;
        const p = reducedMotion ? 1 : clamp((start - rect.top) / rect.height, 0, 1);
        timelineFill.style.transform = `scaleY(${p})`;
        items.forEach((item) => {
          const top = item.getBoundingClientRect().top + 36;
          item.classList.toggle("is-active", reducedMotion || top < start);
        });
      }
    };

    ring.style.strokeDasharray = String(RING_LEN);
    window.addEventListener("scroll", rafThrottle(update), { passive: true });
    window.addEventListener("resize", debounce(update, 100));
    update();

    backBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      $("#home").focus({ preventScroll: true });
    });
  }

  /* =======================================================================
     SCROLL REVEAL — GSAP ScrollTrigger.batch, IntersectionObserver fallback
     After an element is revealed, its data-reveal attribute is removed so
     later transforms (tilt, filtering) aren't fighting the reveal styles.
     ======================================================================= */
  function initReveal() {
    const els = $$("[data-reveal]");
    const finish = (el) => {
      el.removeAttribute("data-reveal");
      el.style.removeProperty("--delay");
    };

    if (reducedMotion || !("IntersectionObserver" in window)) {
      els.forEach(finish);
      return;
    }

    if (hasScrollTrigger()) {
      const { gsap, ScrollTrigger } = window;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.batch(els, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.08,
              overwrite: true,
              onComplete: () => batch.forEach((el) => {
                gsap.set(el, { clearProps: "opacity,transform" });
                finish(el);
              })
            }
          )
      });
      window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
      return;
    }

    // Fallback: CSS transitions + IntersectionObserver with sibling stagger
    document.documentElement.classList.add("reveal-io");
    els.forEach((el) => {
      const siblings = Array.from(el.parentElement.children).filter((c) => c.hasAttribute("data-reveal"));
      el.style.setProperty("--delay", `${Math.min(siblings.indexOf(el), 6) * 0.08}s`);
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Also reveal anything already scrolled past (e.g. reload mid-page)
          if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;
          const el = entry.target;
          el.classList.add("is-visible");
          io.unobserve(el);
          setTimeout(() => {
            finish(el);
            el.classList.remove("is-visible");
          }, 1400);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));
  }

  /* =======================================================================
     ANIMATED COUNTERS — IntersectionObserver + requestAnimationFrame
     ======================================================================= */
  function initCounters() {
    const counters = $$("[data-count]");
    const render = (el, n) => (el.textContent = `${n}${el.dataset.suffix || ""}`);

    if (reducedMotion || !("IntersectionObserver" in window)) {
      counters.forEach((el) => render(el, Number(el.dataset.count)));
      return;
    }

    const animate = (el) => {
      const target = Number(el.dataset.count);
      const duration = 1800;
      const start = performance.now();
      const step = (now) => {
        const t = clamp((now - start) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        render(el, Math.round(target * eased));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate(entry.target);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => io.observe(el));
  }

  /* =======================================================================
     SPOTLIGHT — cards get a glow + gradient border that follows the cursor
     (sets --mx / --my, read by CSS)
     ======================================================================= */
  function initSpotlight() {
    if (!finePointer) return;
    $$("[data-spotlight]").forEach((card) => {
      card.addEventListener(
        "pointermove",
        rafThrottle((e) => {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${e.clientX - r.left}px`);
          card.style.setProperty("--my", `${e.clientY - r.top}px`);
        })
      );
    });
  }

  /* =======================================================================
     HERO SPOTLIGHT — soft glow that trails the mouse in the hero
     ======================================================================= */
  function initHeroSpot() {
    const hero = $("#home");
    const spot = $("#heroSpot");
    if (!hero || !spot || !finePointer || reducedMotion) return;
    let tx = 0, ty = 0, x = 0, y = 0, running = false;

    const loop = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      spot.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      if (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) requestAnimationFrame(loop);
      else running = false;
    };

    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      hero.classList.add("spot-on");
      if (!running) {
        running = true;
        requestAnimationFrame(loop);
      }
    });
    hero.addEventListener("pointerleave", () => hero.classList.remove("spot-on"));
  }

  /* =======================================================================
     LOCAL TIME — live clock for Karachi in the About bento
     ======================================================================= */
  function initLocalTime() {
    const el = $("#localTime");
    if (!el) return;
    let fmt;
    try {
      fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Karachi" });
    } catch (e) {
      return;
    }
    const tick = () => (el.textContent = fmt.format(new Date()));
    tick();
    setInterval(tick, 15000);
  }

  /* =======================================================================
     PROJECT FILTERING — fade/scale out, then fade/scale in
     ======================================================================= */
  function initProjectFilters() {
    const wrap = $("#projectFilters");
    const cards = $$(".project-card");
    if (!wrap) return;
    let token = 0; // ignore stale timeouts when filters are clicked quickly

    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn || btn.classList.contains("is-active")) return;

      $$(".filter-btn", wrap).forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });

      const key = btn.dataset.filter;
      const collapsed = !!$("#projectsMore");
      const matches = (card) =>
        key === "all" ? !(collapsed && card.classList.contains("is-extra")) : card.dataset.category === key;
      const more = $(".projects__more");
      if (more) more.hidden = key !== "all";
      const current = ++token;
      const OUT = reducedMotion ? 0 : 300;

      // 1) fade out cards that no longer match
      cards.forEach((card) => {
        card.style.transform = "";
        if (!matches(card) && !card.classList.contains("is-hidden")) card.classList.add("is-leaving");
      });

      // 2) hide them, then bring matching cards in
      setTimeout(() => {
        if (current !== token) return;
        cards.forEach((card) => {
          card.classList.remove("is-leaving");
          if (!matches(card)) {
            card.classList.add("is-hidden");
          } else if (card.classList.contains("is-hidden")) {
            card.classList.remove("is-hidden");
            card.classList.add("is-entering");
            void card.offsetWidth; // force reflow so the transition runs
            requestAnimationFrame(() => card.classList.remove("is-entering"));
          }
        });
        if (hasScrollTrigger()) window.ScrollTrigger.refresh();
      }, OUT);
    });
  }

  /* =======================================================================
     HOVER-SCROLL SCREENSHOTS
     Measures how far each full-page screenshot can scroll inside its frame
     and exposes it to CSS as --scroll-dist / --scroll-time. Desktop: scrolls
     on hover. Touch: pans slowly while the card is on screen.
     ======================================================================= */
  function initShotScroll() {
    const SPEED = 450; // px per second

    const measure = (img) => {
      const screen = img.closest(".browser__screen");
      if (!screen || img.classList.contains("is-missing") || !img.naturalWidth) return;
      const dist = Math.max(0, img.getBoundingClientRect().height - screen.clientHeight);
      const time = clamp(dist / SPEED, 1.5, 14);
      screen.style.setProperty("--scroll-dist", `${-dist}px`);
      screen.style.setProperty("--scroll-time", `${time.toFixed(2)}s`);
      screen.classList.toggle("can-scroll", dist > 10);
    };
    const measureAll = () => $$(".browser__screen .shot").forEach(measure);

    $$(".browser__screen .shot").forEach((img) => {
      if (img.complete) measure(img);
      img.addEventListener("load", () => measure(img));
    });
    window.addEventListener("resize", debounce(measureAll, 200));
    // Cards change size when filtered / revealed
    $("#projectFilters") && $("#projectFilters").addEventListener("click", () => setTimeout(measureAll, 450));

    // Touch devices: pan while visible (no hover available)
    if (!finePointer && !reducedMotion && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.target.classList.toggle("is-panning", e.isIntersecting)),
        { threshold: 0.6 }
      );
      $$(".project-card .browser__screen").forEach((s) => io.observe(s));
    }

    // Re-measure the modal screenshot whenever it opens
    const modal = $("#projectModal");
    if (modal) {
      new MutationObserver(() => {
        const img = $(".modal__browser .shot", modal);
        if (img) img.complete ? measure(img) : img.addEventListener("load", () => measure(img), { once: true });
      }).observe($("#modalContent"), { childList: true });
    }

    window.__measureShots = measureAll;
  }

  /* =======================================================================
     "VIEW ALL PROJECTS" button
     ======================================================================= */
  function initProjectsMore() {
    const btn = $("#projectsMore");
    if (!btn) return;
    btn.addEventListener("click", () => {
      $$(".project-card.is-extra").forEach((card) => {
        card.classList.remove("is-hidden");
        card.classList.add("is-entering");
        void card.offsetWidth;
        requestAnimationFrame(() => card.classList.remove("is-entering"));
      });
      btn.parentElement.remove();
      setTimeout(() => {
        if (window.__measureShots) window.__measureShots();
        if (hasScrollTrigger()) window.ScrollTrigger.refresh();
      }, 50);
    });
  }

  /* =======================================================================
     3D TILT on project cards (fine pointers only)
     ======================================================================= */
  function initTilt() {
    if (!finePointer || reducedMotion) return;
    const MAX = 8; // degrees

    $$("[data-tilt]").forEach((card) => {
      card.addEventListener(
        "pointermove",
        rafThrottle((e) => {
          if (card.hasAttribute("data-reveal")) return; // wait for reveal to finish
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          card.classList.add("is-tilting");
          card.style.transform = `perspective(1000px) rotateX(${(-y * MAX).toFixed(2)}deg) rotateY(${(x * MAX).toFixed(2)}deg) translateY(-6px)`;
        })
      );
      card.addEventListener("pointerleave", () => {
        card.classList.remove("is-tilting");
        card.style.transform = "";
      });
    });
  }

  /* =======================================================================
     PROJECT MODAL — ESC / outside click to close, focus trap, focus restore
     ======================================================================= */
  function initModal() {
    const modal = $("#projectModal");
    const content = $("#modalContent");
    const grid = $("#projectsGrid");
    if (!modal || !grid) return;
    let lastFocused = null;

    const onKey = (e) => {
      if (e.key === "Escape") close();
      trapTab(e, getFocusable(modal));
    };

    function open(index) {
      const p = (DATA.projects || [])[index];
      if (!p) return;
      lastFocused = document.activeElement;

      content.innerHTML = `
        ${browserShotHTML(p, { cls: "modal__browser", lazy: false })}
        <div class="modal__body">
          <p class="project-card__cat">${esc(categoryLabel(p.category))}</p>
          <h3 class="modal__title" id="modalTitle">${esc(p.title)}</h3>
          <p class="modal__text">${esc(p.description)}</p>
          ${p.details ? `<p class="modal__text">${esc(p.details)}</p>` : ""}
          ${
            p.features && p.features.length
              ? `<h4 class="modal__subtitle">Key features</h4>
                 <ul class="modal__features">${p.features
                   .map((f) => `<li><i class="fa-solid fa-circle-check" aria-hidden="true"></i>${esc(f)}</li>`)
                   .join("")}</ul>`
              : ""
          }
          <h4 class="modal__subtitle">Tech stack</h4>
          <ul class="tags">${p.tech.map((t) => `<li class="tag">${esc(t)}</li>`).join("")}</ul>
          <div class="modal__links">${projectLinksHTML(p, "btn btn--ghost btn--sm")}</div>
        </div>`;

      modal.hidden = false;
      document.body.classList.add("is-locked");
      requestAnimationFrame(() => modal.classList.add("is-open"));
      document.addEventListener("keydown", onKey);
      $(".modal__close", modal).focus();
    }

    function close() {
      modal.classList.remove("is-open");
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("is-locked");
      setTimeout(() => {
        modal.hidden = true;
        content.innerHTML = "";
      }, reducedMotion ? 0 : 400);
      if (lastFocused) lastFocused.focus();
    }

    grid.addEventListener("click", (e) => {
      const btn = e.target.closest(".project-card__open");
      if (btn) open(Number(btn.dataset.index));
    });
    $$("[data-close]", modal).forEach((el) => el.addEventListener("click", close));
  }

  /* =======================================================================
     MAGNETIC BUTTONS (fine pointers only)
     ======================================================================= */
  function initMagnetic() {
    if (!finePointer || reducedMotion) return;
    $$("[data-magnetic]").forEach((el) => {
      const strength = 0.3;
      el.addEventListener(
        "pointermove",
        rafThrottle((e) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * strength;
          const y = (e.clientY - r.top - r.height / 2) * strength;
          el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        })
      );
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }

  /* =======================================================================
     CUSTOM CURSOR — dot + trailing ring (desktop, fine pointer only)
     ======================================================================= */
  function initCursor() {
    if (!finePointer || reducedMotion) return;
    const root = document.documentElement;
    const dot = $(".cursor-dot");
    const ringEl = $(".cursor-ring");
    root.classList.add("has-cursor");

    let mx = -100, my = -100; // mouse
    let rx = -100, ry = -100; // ring (lerped)

    window.addEventListener(
      "pointermove",
      (e) => {
        if (e.pointerType !== "mouse") return;
        mx = e.clientX;
        my = e.clientY;
        dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
        root.classList.add("cursor-visible");
      },
      { passive: true }
    );
    document.addEventListener("pointerleave", () => root.classList.remove("cursor-visible"));
    document.addEventListener("mouseout", (e) => {
      if (!e.relatedTarget) root.classList.remove("cursor-visible");
    });

    // Grow the ring over interactive elements
    const interactive = "a, button, [role='button'], input, textarea, label, .project-card";
    document.addEventListener("pointerover", (e) => {
      root.classList.toggle("cursor-hover", !!e.target.closest(interactive));
    });

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ringEl.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* =======================================================================
     TESTIMONIALS SLIDER — autoplay, arrows, dots, swipe, keyboard
     ======================================================================= */
  function initSlider() {
    const slider = $("#slider");
    const track = $("#sliderTrack");
    if (!slider || !track) return;
    const viewport = $(".slider__viewport", slider);
    const slides = $$(".slide", track);
    const dots = $$(".slider__dot", slider);
    const total = slides.length;
    const DELAY = 6000;
    let index = 0;
    let timer = null;

    function goTo(i) {
      index = (i + total) % total;
      track.style.transform = `translateX(${-index * 100}%)`;
      slides.forEach((s, n) => {
        const active = n === index;
        s.setAttribute("aria-hidden", String(!active));
        s.inert = !active;
      });
      dots.forEach((d, n) => d.setAttribute("aria-current", String(n === index)));
    }

    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);

    function play() {
      if (reducedMotion || total < 2) return;
      stop();
      timer = setInterval(next, DELAY);
    }
    function stop() {
      clearInterval(timer);
      timer = null;
    }

    $("#sliderNext").addEventListener("click", () => { next(); play(); });
    $("#sliderPrev").addEventListener("click", () => { prev(); play(); });
    dots.forEach((d) => d.addEventListener("click", () => { goTo(Number(d.dataset.slide)); play(); }));

    // Pause while hovered / focused / tab hidden
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", play);
    slider.addEventListener("focusin", stop);
    slider.addEventListener("focusout", play);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : play()));

    // Keyboard arrows when focus is inside the slider
    slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });

    // Swipe / drag (pointer events cover touch + mouse)
    let startX = 0;
    let startY = 0;
    let dx = 0;
    let dragging = false;

    viewport.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      dx = 0;
      stop();
    });
    viewport.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      dx = e.clientX - startX;
      if (Math.abs(dx) < Math.abs(e.clientY - startY)) return; // vertical scroll — let it be
      track.classList.add("is-dragging");
      track.style.transform = `translateX(calc(${-index * 100}% + ${dx}px))`;
    });
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove("is-dragging");
      if (dx < -50) next();
      else if (dx > 50) prev();
      else goTo(index);
      play();
    };
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("pointerleave", endDrag);

    goTo(0);
    play();
  }

  /* =======================================================================
     TOAST NOTIFICATIONS
     ======================================================================= */
  function showToast({ type = "success", title = "", message = "", duration = 6000 }) {
    const wrap = $("#toasts");
    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.setAttribute("role", type === "error" ? "alert" : "status");
    toast.innerHTML = `
      <i class="toast__icon fa-solid ${type === "error" ? "fa-circle-exclamation" : "fa-circle-check"}" aria-hidden="true"></i>
      <div>
        <p class="toast__title">${esc(title)}</p>
        ${message ? `<p class="toast__msg">${esc(message)}</p>` : ""}
      </div>
      <button type="button" class="toast__close" aria-label="Dismiss notification"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>`;
    wrap.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("is-visible"));

    const remove = () => {
      toast.classList.remove("is-visible");
      setTimeout(() => toast.remove(), 400);
    };
    $(".toast__close", toast).addEventListener("click", remove);
    setTimeout(remove, duration);
  }

  /* =======================================================================
     CONTACT FORM — inline validation + Formspree / EmailJS via fetch()
     ======================================================================= */
  function initContactForm() {
    const form = $("#contactForm");
    if (!form) return;
    const submitBtn = $("#submitBtn");
    const label = $(".btn__label", submitBtn);
    const icon = $("i", submitBtn);
    const config = DATA.contactForm || {};
    const email = (DATA.profile && DATA.profile.email) || "";

    const rules = {
      name: (v) => (v.length < 2 ? "Please enter your name." : ""),
      email: (v) =>
        !v ? "Please enter your email." : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "Please enter a valid email address." : "",
      subject: (v) => (v.length < 3 ? "Please add a short subject." : ""),
      message: (v) => (v.length < 10 ? "Your message should be at least 10 characters." : "")
    };

    function validateField(input) {
      const rule = rules[input.name];
      if (!rule) return true;
      const error = rule(input.value.trim());
      const field = input.closest(".field");
      field.classList.toggle("has-error", !!error);
      input.setAttribute("aria-invalid", String(!!error));
      $(".field__error", field).textContent = error;
      return !error;
    }

    // Validate on blur; re-validate while typing once a field has an error
    Object.keys(rules).forEach((name) => {
      const input = form.elements[name];
      input.addEventListener("blur", () => { if (input.value.trim()) validateField(input); });
      input.addEventListener("input", () => {
        if (input.closest(".field").classList.contains("has-error")) validateField(input);
      });
    });

    function setLoading(on) {
      submitBtn.disabled = on;
      label.textContent = on ? "Sending…" : "Send Message";
      icon.className = on ? "spinner" : "fa-solid fa-paper-plane";
    }

    const isPlaceholder = (v) => !v || /YOUR_/.test(v);

    async function send(payload) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        if (config.provider === "emailjs") {
          const c = config.emailjs || {};
          if ([c.publicKey, c.serviceId, c.templateId].some(isPlaceholder)) throw new Error("not-configured");
          const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              service_id: c.serviceId,
              template_id: c.templateId,
              user_id: c.publicKey,
              template_params: {
                from_name: payload.name,
                from_email: payload.email,
                reply_to: payload.email,
                subject: payload.subject,
                message: payload.message
              }
            })
          });
          if (!res.ok) throw new Error(await res.text());
          return;
        }

        // Default: Formspree
        const endpoint = config.formspree && config.formspree.endpoint;
        if (isPlaceholder(endpoint)) throw new Error("not-configured");
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({ ...payload, _replyto: payload.email, _subject: `Portfolio: ${payload.subject}` })
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error((data.errors && data.errors.map((x) => x.message).join(", ")) || "Request failed");
        }
      } finally {
        clearTimeout(timeout);
      }
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const inputs = Object.keys(rules).map((n) => form.elements[n]);
      const valid = inputs.map(validateField).every(Boolean);
      if (!valid) {
        const firstInvalid = inputs.find((i) => i.getAttribute("aria-invalid") === "true");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Honeypot filled → silently "succeed" for bots
      if (form.elements._gotcha.value) {
        form.reset();
        return;
      }

      const payload = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        subject: form.elements.subject.value.trim(),
        message: form.elements.message.value.trim()
      };

      setLoading(true);
      try {
        await send(payload);
        form.reset();
        showToast({ type: "success", title: "Message sent!", message: "Thanks for reaching out — I'll get back to you soon." });
      } catch (err) {
        const notConfigured = err && err.message === "not-configured";
        showToast({
          type: "error",
          title: notConfigured ? "Contact form not set up yet" : "Couldn't send your message",
          message: notConfigured
            ? `Please email me directly at ${email}.`
            : `Please try again, or email me directly at ${email}.`,
          duration: 8000
        });
        if (notConfigured) console.warn("[portfolio] Add your Formspree endpoint or EmailJS keys in js/data.js → contactForm.");
      } finally {
        setLoading(false);
      }
    });
  }

  /* =======================================================================
     IMAGE FALLBACK SAFETY NET
     Catches images that failed before their onerror handler could run,
     and un-hides any that later load successfully.
     ======================================================================= */
  function initImageFallbacks() {
    $$(".media > img, .exp-card__logo img").forEach((img) => {
      img.addEventListener("load", () => img.classList.remove("is-missing"));
      if (img.complete && img.naturalWidth === 0 && img.loading !== "lazy") img.classList.add("is-missing");
    });
  }

  /* =======================================================================
     MISC
     ======================================================================= */
  function initYear() {
    const y = $("#year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  /* =======================================================================
     INIT
     ======================================================================= */
  function init() {
    // 1. Render content from data.js
    renderSocials();
    renderStats();
    renderServices();
    renderSkills();
    renderMarquee();
    renderExperience();
    renderProjectFilters();
    renderProjects();
    renderEducation();
    const hasTestimonials = renderTestimonials();

    // 2. Core UI
    initTheme();
    initMobileMenu();
    initActiveLinks();
    initScrollUI();
    initImageFallbacks();
    initYear();

    // 3. Content interactions
    initCounters();
    initSpotlight();
    initHeroSpot();
    initLocalTime();
    initProjectFilters();
    initShotScroll();
    initProjectsMore();
    initModal();
    if (hasTestimonials) initSlider();
    initContactForm();

    // 4. Pointer effects (desktop only)
    initTilt();
    initMagnetic();
    initCursor();

    // 5. Loader → hero intro → typing, then scroll reveals
    initLoader(() => {
      initHeroIntro();
      setTimeout(initTyping, reducedMotion ? 0 : 700);
      initReveal();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
