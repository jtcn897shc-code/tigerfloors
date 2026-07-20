/* Nav solidify on scroll, mobile menu toggle, scroll-reveal. */
(function () {
  "use strict";

  const nav = document.getElementById("nav");
  if (nav) {
    const SOLID_AT = 40;
    let ticking = false;
    function update() {
      nav.classList.toggle("is-solid", window.scrollY > SOLID_AT);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  const toggle = document.getElementById("nav-toggle");
  const links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      const open = links.style.display === "flex";
      links.style.display = open ? "" : "flex";
      links.style.position = "fixed";
      links.style.inset = "64px 0 auto 0";
      links.style.background = "var(--paper)";
      links.style.flexDirection = "column";
      links.style.padding = "16px 24px";
      links.style.borderBottom = "1px solid var(--hairline)";
    });
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealed = document.querySelectorAll("[data-reveal]");
  if (!reduce && "IntersectionObserver" in window && revealed.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealed.forEach(function (el) { io.observe(el); });
  } else {
    revealed.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Stat count-up: numbers rise when the band scrolls in ---------- */
  const counters = document.querySelectorAll("[data-countup]");
  function runCounter(el) {
    const target = parseInt(el.getAttribute("data-countup").replace(/[^0-9]/g, ""), 10) || 0;
    const DURATION = 1400;
    const t0 = performance.now();
    function frame(now) {
      const p = Math.min(1, (now - t0) / DURATION);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if (counters.length) {
    if (!reduce && "IntersectionObserver" in window) {
      const cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(function (el) {
        el.textContent = parseInt(el.getAttribute("data-countup"), 10).toLocaleString();
      });
    }
  }

  /* ---------- Valuation CTA: opens the concierge with the question pre-sent ---------- */
  const valBtn = document.getElementById("valuation-open");
  if (valBtn) {
    valBtn.addEventListener("click", function () {
      document.dispatchEvent(
        new CustomEvent("destura:chat-open", {
          detail: { prompt: "What's my home worth? I'd like a free valuation." },
        })
      );
    });
  }
})();
