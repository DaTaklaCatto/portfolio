(function () {
  "use strict";

  // Register GSAP Plugins
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, CustomEase);

  /* ==========================================================================
        Lucide Icons Setup
     ========================================================================== */
  function initLucide() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLucide);
  } else {
    initLucide();
  }

  /* ==========================================================================
        Live Dhaka Time Clock
     ========================================================================== */
  function updateClock() {
    const clockElement = document.querySelector("[data-clock]");
    if (!clockElement) return;

    const now = new Date();
    const options = {
      timeZone: "Asia/Dhaka",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    clockElement.textContent = new Intl.DateTimeFormat("en-US", options).format(now);
  }

  updateClock();
  setInterval(updateClock, 1000);

  /* ==========================================================================
        Lenis Smooth Scrolling Engine & Links Handling
     ========================================================================== */
  let lenis;

  function initSmoothScroll() {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Global click listener for smooth scrolling across all <a> elements
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;
      if (href.startsWith("#")) {
        e.preventDefault();

        if (href === "#" || href === "#top") {
          lenis.scrollTo(0, {
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
          return;
        }

        const targetElement = document.querySelector(href);
        if (targetElement) {
          lenis.scrollTo(targetElement, {
            offset: 0,
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }
      // Handle same-page links formatted like index.html#about
      else if (href.includes("#")) {
        const [urlPath, hash] = href.split("#");
        const currentPath = window.location.pathname.split("/").pop() || "index.html";

        if (urlPath === "" || urlPath === currentPath) {
          e.preventDefault();
          const targetElement = document.querySelector(`#${hash}`);
          if (targetElement) {
            lenis.scrollTo(targetElement, {
              offset: 0,
              duration: 1.5,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
          }
        }
      }
    });
  }

  initSmoothScroll();

  /* ==========================================================================
        Theme Toggle Switcher (Default: Dark)
     ========================================================================== */
  (function () {
    function getPreferredTheme() {
      try {
        const storedTheme = localStorage.getItem("nw-theme");
        if (storedTheme === "dark" || storedTheme === "light") {
          return storedTheme;
        }
      } catch (e) {}

      // Dark mode default
      return "dark";
    }

    function applyTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      document.querySelectorAll("[data-theme-label]").forEach((el) => {
        el.textContent = theme === "dark" ? "DARK" : "LIGHT";
      });
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", theme === "dark" ? "#0B0B0A" : "#F7F6F3");
    }

    function currentTheme() {
      return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    }

    function toggleTheme() {
      const next = currentTheme() === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("nw-theme", next);
      } catch (e) {}
      applyTheme(next);
    }

    applyTheme(getPreferredTheme());

    document.addEventListener("DOMContentLoaded", () => {
      applyTheme(getPreferredTheme());

      document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
        btn.addEventListener("click", toggleTheme);
      });
    });

    window.NW = window.NW || {};
    window.NW.toggleTheme = toggleTheme;
  })();

  /* ==========================================================================
        GSAP Preloader Animation
     ========================================================================== */
  function initPreloader() {
    const preloader = document.querySelector("[data-preloader]");
    const counter = document.querySelector("[data-loader-counter]");
    const progress = document.querySelector("[data-loader-progress]");

    if (!preloader || !counter || !progress) {
      initHeroAnimations();
      return;
    }

    document.body.style.overflow = "hidden";

    const obj = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        initHeroAnimations();
      },
    });

    tl.to(obj, {
      value: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => {
        const val = Math.floor(obj.value);
        counter.textContent = val + "%";
        progress.style.width = val + "%";
      },
    })
      .to(preloader, {
        yPercent: -100,
        duration: 0.8,
        ease: "power4.inOut",
      })
      .set(preloader, { display: "none" });
  }

  /* ==========================================================================
        Hero Entrance Animations
     ========================================================================== */
  function initHeroAnimations() {
    const heroTl = gsap.timeline();

    heroTl
      .from("#hero-img", {
        scale: 1.25,
        duration: 1.4,
        ease: "power3.out",
      })
      .from(
        ".hero__eyebrow .line span",
        {
          yPercent: 100,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=1.0",
      )
      .from(
        ".hero__name .word span",
        {
          yPercent: 110,
          duration: 1,
          stagger: 0.15,
          ease: "power4.out",
        },
        "-=0.6",
      )
      .from(
        ".hero__bottom",
        {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4",
      );
  }

  /* ==========================================================================
        Scroll-Triggered Text & Reveal Animations
     ========================================================================== */
  function initScrollAnimations() {
    // Reveal paragraphs on scroll
    const splitLines = document.querySelectorAll("[data-split]");
    splitLines.forEach((text) => {
      gsap.from(text, {
        scrollTrigger: {
          trigger: text,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    });

    // About metadata rows stagger reveal
    gsap.from(".about__meta-row", {
      scrollTrigger: {
        trigger: ".about__meta",
        start: "top 80%",
      },
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: "power2.out",
    });

    // Tech Stack items reveal
    gsap.from(".stack__item", {
      scrollTrigger: {
        trigger: ".stack",
        start: "top 85%",
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: "power2.out",
    });
  }

  /* ==========================================================================
        Mobile Navigation Drawer Animation
     ========================================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    initPreloader();
    initScrollAnimations();

    const toggleBtn = document.querySelector("[data-menu-toggle]");
    const menu = document.querySelector("[data-mobile-menu]");
    const menuLinks = document.querySelectorAll("[data-mobile-link]");
    const openIcon = document.querySelector(".menu-btn .icon-open");
    const closeIcon = document.querySelector(".menu-btn .icon-close");

    if (!toggleBtn || !menu) return;

    let isMenuOpen = false;

    const menuTl = gsap.timeline({ paused: true });

    menuTl
      .to(menu, {
        autoAlpha: 1,
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: 0.6,
        ease: "power4.inOut",
      })
      .to(
        openIcon,
        {
          rotate: 90,
          opacity: 0,
          scale: 0.5,
          duration: 0.3,
          ease: "power2.in",
        },
        0,
      )
      .to(
        closeIcon,
        {
          rotate: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        0.2,
      )
      .from(
        menuLinks,
        {
          y: 40,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.2",
      );

    function toggleMenu() {
      isMenuOpen = !isMenuOpen;
      document.body.classList.toggle("menu-open", isMenuOpen);

      if (isMenuOpen) {
        menuTl.play();
        if (lenis) lenis.stop();
      } else {
        menuTl.reverse();
        if (lenis) lenis.start();
      }
    }

    toggleBtn.addEventListener("click", toggleMenu);

    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (isMenuOpen) toggleMenu();
      });
    });
  });
})();
