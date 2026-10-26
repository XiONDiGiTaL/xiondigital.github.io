/* =========================================================================
   XiØN — xiondigital.net
   Interaction layer. No dependencies.
   Everything here is progressive enhancement: with JS disabled the site
   still navigates, plays video on YouTube and reads the full marquee.
   ========================================================================= */

(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  /* ---------------------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------------------- */

  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");

  if (navToggle && mobileNav) {
    var lastFocused = null;

    var focusables = function () {
      return Array.prototype.slice.call(
        mobileNav.querySelectorAll('a[href], button:not([disabled])')
      );
    };

    var closeNav = function (restoreFocus) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
      mobileNav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      if (restoreFocus && lastFocused) lastFocused.focus();
    };

    var openNav = function () {
      lastFocused = document.activeElement;
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Close menu");
      mobileNav.classList.add("is-open");
      document.body.classList.add("nav-open");
      var first = focusables()[0];
      if (first) first.focus();
    };

    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      if (open) closeNav(true);
      else openNav();
    });

    mobileNav.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      if (link) closeNav(false);
    });

    document.addEventListener("keydown", function (event) {
      if (navToggle.getAttribute("aria-expanded") !== "true") return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeNav(true);
        return;
      }

      if (event.key !== "Tab") return;

      var items = focusables();
      if (!items.length) return;

      var first = items[0];
      var last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900 && navToggle.getAttribute("aria-expanded") === "true") {
        closeNav(false);
      }
    });
  }

  /* ---------------------------------------------------------------------
     Scrollspy for the section links on the home page
     --------------------------------------------------------------------- */

  var sectionLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav__link[href^="#"]')
  );

  if (sectionLinks.length && "IntersectionObserver" in window) {
    var sections = sectionLinks
      .map(function (link) {
        var target = document.querySelector(link.getAttribute("href"));
        return target ? { link: link, target: target } : null;
      })
      .filter(Boolean);

    var setActive = function (activeLink) {
      sectionLinks.forEach(function (link) {
        if (link === activeLink) link.classList.add("is-active");
        else link.classList.remove("is-active");
      });
    };

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var match = sections.filter(function (item) {
            return item.target === entry.target;
          })[0];
          if (match) setActive(match.link);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach(function (item) {
      spy.observe(item.target);
    });

    // Clear the highlight when the hero is back in view.
    var hero = document.getElementById("home");
    if (hero) {
      var heroSpy = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) setActive(null);
        },
        { rootMargin: "-10% 0px -70% 0px", threshold: 0 }
      );
      heroSpy.observe(hero);
    }
  }

  /* ---------------------------------------------------------------------
     Pointer spotlight on cards and frames
     --------------------------------------------------------------------- */

  var spotlights = document.querySelectorAll("[data-spotlight], .spot");

  if (spotlights.length && finePointer.matches) {
    spotlights.forEach(function (el) {
      el.addEventListener(
        "pointermove",
        function (event) {
          var rect = el.getBoundingClientRect();
          el.style.setProperty("--mx", event.clientX - rect.left + "px");
          el.style.setProperty("--my", event.clientY - rect.top + "px");
        },
        { passive: true }
      );
    });
  }

  /* ---------------------------------------------------------------------
     Subtle hero parallax (a few pixels, pointer only, never on reduced motion)
     --------------------------------------------------------------------- */

  var parallax = document.querySelector("[data-parallax]");

  if (parallax && finePointer.matches && !reducedMotion.matches) {
    var frame = null;

    parallax.addEventListener(
      "pointermove",
      function (event) {
        if (frame) return;
        frame = window.requestAnimationFrame(function () {
          var rect = parallax.getBoundingClientRect();
          var x = (event.clientX - rect.left) / rect.width - 0.5;
          var y = (event.clientY - rect.top) / rect.height - 0.5;
          parallax.style.setProperty("--px", (x * -8).toFixed(2) + "px");
          parallax.style.setProperty("--py", (y * -8).toFixed(2) + "px");
          frame = null;
        });
      },
      { passive: true }
    );

    parallax.addEventListener("pointerleave", function () {
      parallax.style.setProperty("--px", "0px");
      parallax.style.setProperty("--py", "0px");
    });
  }

  /* ---------------------------------------------------------------------
     Reveal on scroll — class is added here so no-JS visitors see everything
     --------------------------------------------------------------------- */

  var revealTargets = document.querySelectorAll(
    "[data-reveal], .section__head, .featured, .disc-card, .teaser__copy, .thumb-wall, .about__intro, .about__aside, .band__quote, .contact > *, .video, .playlist-cta"
  );

  if (revealTargets.length && "IntersectionObserver" in window && !reducedMotion.matches) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.04 }
    );

    revealTargets.forEach(function (el, index) {
      el.classList.add("reveal");
      el.style.setProperty("--d", (index % 3) * 70 + "ms");
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------------------------
     Listener-reactions marquee pause control (WCAG 2.2.2)
     The original hover-pause still works; this adds a keyboard/pointer
     accessible equivalent without touching the comments or the animation.
     --------------------------------------------------------------------- */

  var quotes = document.getElementById("quotes");
  var quotesToggle = document.getElementById("quotesToggle");

  if (quotes && quotesToggle) {
    var label = quotesToggle.querySelector("span");

    quotesToggle.addEventListener("click", function () {
      var paused = quotes.classList.toggle("is-paused");
      quotesToggle.setAttribute("aria-pressed", String(paused));
      if (label) label.textContent = paused ? "Play" : "Pause";
    });
  }

  /* ---------------------------------------------------------------------
     Visuals: click-to-play YouTube cards
     The control is a real link to YouTube, so it still works without JS,
     for middle-click and for search engines. With JS it swaps in an
     iframe on the same page. Nothing loads or plays until it is clicked.
     --------------------------------------------------------------------- */

  var players = document.querySelectorAll(".video__play[data-video-id]");

  players.forEach(function (control) {
    control.addEventListener("click", function (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (event.button !== undefined && event.button !== 0) return;

      var card = control.closest(".video");
      var frame = card ? card.querySelector(".video__frame") : null;
      if (!frame) return;

      event.preventDefault();

      var id = control.getAttribute("data-video-id");
      var title = control.getAttribute("data-video-title") || "XiØN visualizer";

      var iframe = document.createElement("iframe");
      iframe.src =
        "https://www.youtube-nocookie.com/embed/" +
        encodeURIComponent(id) +
        "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
      iframe.title = title;
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture"
      );
      iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");

      // Remove the facade, keep the iframe filling the frame.
      Array.prototype.slice.call(frame.children).forEach(function (child) {
        frame.removeChild(child);
      });
      frame.appendChild(iframe);
      if (card) card.classList.add("is-playing");

      iframe.focus();
    });
  });
})();
