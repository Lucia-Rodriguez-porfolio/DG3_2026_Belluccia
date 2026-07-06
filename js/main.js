/* ============================================
   MADERA VIVA — main.js
   GSAP + ScrollTrigger + Interactividad
   ============================================ */

(function () {
  "use strict";

  // ---- Registrar plugin ----
  gsap.registerPlugin(ScrollTrigger);

  // ---- Referencias DOM ----
  const cursor = document.getElementById("cursor");
  const cursorDot = document.getElementById("cursorDot");
  const nav = document.getElementById("nav");

  /* ============================================
     1. CURSOR PERSONALIZADO
     ============================================ */
  if (cursor && cursorDot && window.matchMedia("(pointer: fine)").matches) {
    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(cursorDot, { x: mouseX, y: mouseY });
    });

    // Suavizar el círculo exterior
    gsap.ticker.add(() => {
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      gsap.set(cursor, { x: curX, y: curY });
    });

    // Hover sobre links y botones
    document.querySelectorAll("a, button, .proceso-step, .bento-cell").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("cursor--active"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("cursor--active"));
    });

    // Cambio de color del cursor por sección
    const sectionColors = {
      hero: "#00FFCC",
      manifiesto: "#00FFCC",
      proceso: "#00FFCC",
      transicion: "#C8FF00",
      restauracion: "#00FFCC",
      anatomia: "#FF00AA",
      capsula: "#FF00AA",
      galeria: "#C8FF00",
      verde: "#C8FF00",
      bento: "#00FFCC",
      testimonios: "#00FFCC",
      contacto: "#FF00AA",
    };

    Object.entries(sectionColors).forEach(([id, color]) => {
      const el = document.getElementById(id);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onEnter: () => setAccent(color),
        onEnterBack: () => setAccent(color),
      });
    });

    function setAccent(color) {
      document.documentElement.style.setProperty("--accent-current", color);
    }
  }


  /* ============================================
     2. NAVEGACIÓN — scroll nav
     ============================================ */
  ScrollTrigger.create({
    start: "top -80px",
    onEnter: () => nav && nav.classList.add("nav--scrolled"),
    onLeaveBack: () => nav && nav.classList.remove("nav--scrolled"),
  });

  // Auto-hide navbar al hacer scroll hacia abajo
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    if (!nav) return;
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    if (currentScroll <= 80) {
      nav.classList.remove("nav--hidden");
      lastScroll = currentScroll;
      return;
    }
    if (currentScroll > lastScroll && !nav.classList.contains("nav--hidden")) {
      nav.classList.add("nav--hidden"); // Scroll down
    } else if (currentScroll < lastScroll && nav.classList.contains("nav--hidden")) {
      nav.classList.remove("nav--hidden"); // Scroll up
    }
    lastScroll = currentScroll;
  });

  // Burger menu (mobile)
  const burger = document.getElementById("navBurger");
  const navLinks = document.querySelector(".nav-links");
  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      const open = navLinks.style.display === "flex";
      navLinks.style.display = open ? "none" : "flex";
      navLinks.style.flexDirection = "column";
      navLinks.style.position = "fixed";
      navLinks.style.top = "70px";
      navLinks.style.left = "0";
      navLinks.style.right = "0";
      navLinks.style.background = "rgba(8,8,16,0.97)";
      navLinks.style.padding = "2rem";
      navLinks.style.gap = "1.5rem";
      navLinks.style.backdropFilter = "blur(12px)";
      navLinks.style.zIndex = "99";
    });
  }


  /* ============================================
     3. HERO — ANIMACIÓN DE ENTRADA
     ============================================ */
  const heroTL = gsap.timeline({ delay: 0.3 });

  heroTL
    .to("#heroEyebrow", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
    })
    .to(
      ".hero-line",
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      },
      "-=0.3"
    )
    .to(
      "#heroSub",
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.4"
    )
    .to(
      ".hero-ctas",
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      },
      "-=0.3"
    )
    .to(
      ".hero-scroll-hint",
      {
        opacity: 0.5,
        duration: 0.5,
      },
      "-=0.2"
    );

  // Inicializar estados ocultos del hero
  gsap.set("#heroEyebrow", { opacity: 0, y: 20 });
  gsap.set(".hero-line", { opacity: 0, y: 60 });
  gsap.set("#heroSub", { opacity: 0, y: 20 });
  gsap.set(".hero-ctas", { opacity: 0, y: 20 });
  gsap.set(".hero-scroll-hint", { opacity: 0 });


  /* ============================================
     4. MANIFIESTO — reveal con scroll
     ============================================ */
  const textRevealEl = document.querySelector('.js-text-reveal');
  if (textRevealEl) {
    const text = textRevealEl.textContent.trim();
    const words = text.split(/\s+/);
    textRevealEl.innerHTML = '';
    textRevealEl.setAttribute('aria-label', text);

    words.forEach(word => {
      const outerDiv = document.createElement('div');
      outerDiv.className = 'overflow-hidden';
      outerDiv.setAttribute('aria-hidden', 'true');
      outerDiv.style.position = 'relative';
      outerDiv.style.display = 'inline-block';
      outerDiv.style.marginRight = '0.25em';
      outerDiv.style.opacity = '0.2';
      outerDiv.textContent = word;
      textRevealEl.appendChild(outerDiv);
    });

    gsap.to(textRevealEl.querySelectorAll('.overflow-hidden'), {
      scrollTrigger: {
        trigger: ".section-manifiesto",
        start: "top 60%",
        end: "bottom 70%",
        scrub: 1,
      },
      opacity: 1,
      stagger: 0.1,
      ease: "none",
    });
  }

  if (document.querySelector('.manifiesto-deco')) {
    gsap.to(".manifiesto-deco", {
      scrollTrigger: {
        trigger: ".section-manifiesto",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
      x: "-30vw", // Movimiento suave de derecha a izquierda
      ease: "none",
    });
  }


  /* ============================================
     5. PROCESO — pasos en cascada
     ============================================ */
  gsap.to(".proceso-step", {
    scrollTrigger: {
      trigger: ".section-proceso",
      start: "top 70%",
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
  });


  /* ============================================
     6. TRANSICIÓN — cambio de fondo dramático
     ============================================ */
  ScrollTrigger.create({
    trigger: ".section-transicion",
    start: "top center",
    end: "bottom center",
    onEnter: () => {
      gsap.to(".section-transicion", {
        background: "radial-gradient(ellipse at center, #0F1A00 0%, #080810 100%)",
        duration: 0.6,
      });
    },
    onLeave: () => {
      gsap.to(".section-transicion", {
        background: "var(--bg-deep)",
        duration: 0.6,
      });
    },
    onEnterBack: () => {
      gsap.to(".section-transicion", {
        background: "radial-gradient(ellipse at center, #0F1A00 0%, #080810 100%)",
        duration: 0.6,
      });
    },
    onLeaveBack: () => {
      gsap.to(".section-transicion", {
        background: "var(--bg-deep)",
        duration: 0.6,
      });
    },
  });

  gsap.from(".transicion-text", {
    scrollTrigger: {
      trigger: ".section-transicion",
      start: "top 75%",
    },
    opacity: 0,
    scale: 0.85,
    duration: 1.2,
    ease: "power4.out",
  });


  /* ============================================
     7. SLIDER BEFORE / AFTER
     ============================================ */
  const sliderContainer = document.getElementById("beforeAfterSlider");
  const sliderAfter = document.getElementById("sliderAfter");
  const sliderHandle = document.getElementById("sliderHandle");

  if (sliderContainer && sliderAfter && sliderHandle) {
    let isDragging = false;
    let isVertical = window.innerWidth <= 767;
    let sliderPercent = 50;

    function updateSlider(percent) {
      sliderPercent = Math.max(5, Math.min(95, percent));
      if (isVertical) {
        sliderAfter.style.clipPath = `inset(${sliderPercent}% 0 0 0)`;
        gsap.set(sliderHandle, { top: `${sliderPercent}%`, left: "50%", xPercent: -50, yPercent: -50 });
      } else {
        sliderAfter.style.clipPath = `inset(0 ${100 - sliderPercent}% 0 0)`;
        gsap.set(sliderHandle, { left: `${sliderPercent}%`, top: "50%", xPercent: -50, yPercent: -50 });
      }
    }

    function getPercent(e) {
      const rect = sliderContainer.getBoundingClientRect();
      if (isVertical) {
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return ((clientY - rect.top) / rect.height) * 100;
      } else {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        return ((clientX - rect.left) / rect.width) * 100;
      }
    }

    // Mouse
    sliderContainer.addEventListener("mousedown", (e) => {
      isDragging = true;
      updateSlider(getPercent(e));
    });
    document.addEventListener("mousemove", (e) => {
      if (isDragging) updateSlider(getPercent(e));
    });
    document.addEventListener("mouseup", () => { isDragging = false; });

    // Touch
    sliderContainer.addEventListener("touchstart", (e) => {
      isDragging = true;
      e.preventDefault();
    }, { passive: false });
    document.addEventListener("touchmove", (e) => {
      if (isDragging) {
        e.preventDefault();
        updateSlider(getPercent(e));
      }
    }, { passive: false });
    document.addEventListener("touchend", () => { isDragging = false; });

    // Responsive
    window.addEventListener("resize", () => {
      isVertical = window.innerWidth <= 767;
      updateSlider(sliderPercent);
    });

    // Inicializar
    updateSlider(50);

    // Animación de entrada
    gsap.from(sliderContainer, {
      scrollTrigger: {
        trigger: ".section-restauracion",
        start: "top 70%",
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });
  }


  /* ============================================
     8. ANATOMÍA — columnas
     ============================================ */
  gsap.to(".anatomia-col", {
    scrollTrigger: {
      trigger: ".section-anatomia",
      start: "top 70%",
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power3.out",
  });


  /* ============================================
     9. COUNTDOWN CÁPSULA
     ============================================ */
  function initCountdown() {
    const target = new Date();
    target.setDate(target.getDate() + 47); // 47 días al lanzamiento
    target.setHours(0, 0, 0, 0);

    const elDays = document.getElementById("cdDays");
    const elHours = document.getElementById("cdHours");
    const elMins = document.getElementById("cdMins");

    if (!elDays) return;

    function update() {
      const now = new Date();
      const diff = target - now;

      if (diff <= 0) {
        elDays.textContent = "00";
        elHours.textContent = "00";
        elMins.textContent = "00";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      elDays.textContent = String(days).padStart(2, "0");
      elHours.textContent = String(hours).padStart(2, "0");
      elMins.textContent = String(mins).padStart(2, "0");
    }

    update();
    setInterval(update, 30000);
  }
  initCountdown();

  // Animación teaser
  gsap.from(".teaser-content > *", {
    scrollTrigger: {
      trigger: ".section-capsula-teaser",
      start: "top 70%",
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.1,
    ease: "power3.out",
  });


  /* ============================================
     10. GALERÍA PARALAJE
     ============================================ */
  document.querySelectorAll(".galeria-item").forEach((item) => {
    const speed = parseFloat(item.dataset.speed) || 0.3;
    gsap.to(item.querySelector("img"), {
      scrollTrigger: {
        trigger: item,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
      y: `${speed * 80}px`,
      ease: "none",
    });
  });

  gsap.from(".galeria-item", {
    scrollTrigger: {
      trigger: ".section-galeria",
      start: "top 70%",
    },
    opacity: 0,
    scale: 0.9,
    duration: 0.8,
    stagger: 0.1,
    ease: "power3.out",
  });


  /* ============================================
     11. CONTADORES ANIMADOS (verde + restauración)
     ============================================ */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;

    gsap.fromTo(
      el,
      { innerText: 0 },
      {
        innerText: target,
        duration: 2,
        ease: "power2.out",
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
        onUpdate: function () {
          el.innerText = Math.round(this.targets()[0].innerText).toLocaleString("es-AR");
        },
      }
    );
  }

  // 1. Animar los contadores de números
  document.querySelectorAll(".verde-num, .stat-num").forEach((el) => {
    animateCounter(el);
  });

  // 2. Animar opacidad y posición de las tarjetas verde-stat (animación general de la página)
  const verdeStats = document.querySelectorAll(".verde-stat");
  if (verdeStats.length) {
    gsap.from(verdeStats, {
      scrollTrigger: {
        trigger: ".section-verde",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 60,
      duration: 1.2,
      stagger: 0.25,
      ease: "power4.out",
    });
  }


  /* ============================================
     12. BENTO GRID — stagger desde el centro
     ============================================ */
  const bentoCells = document.querySelectorAll(".bento-cell");
  if (bentoCells.length) {
    gsap.to(bentoCells, {
      scrollTrigger: {
        trigger: "#bentoGrid",
        start: "top 75%",
      },
      opacity: 1,
      scale: 1,
      duration: 0.7,
      stagger: {
        each: 0.1,
        from: "center",
        ease: "power2.inOut",
      },
      ease: "power3.out",
    });
  }


  /* ============================================
     13. TESTIMONIOS — CARRUSEL
     ============================================ */
  const track = document.getElementById("testTrack");
  const dots = document.querySelectorAll(".test-dot");
  const cards = document.querySelectorAll(".test-card");
  const prevBtn = document.getElementById("testPrev");
  const nextBtn = document.getElementById("testNext");

  if (track && cards.length) {
    let current = 0;

    function goTo(idx) {
      current = (idx + cards.length) % cards.length;

      cards.forEach((c, i) => c.classList.toggle("active", i === current));
      dots.forEach((d, i) => d.classList.toggle("active", i === current));

      gsap.to(track, {
        x: `-${current * (100 / cards.length)}%`,
        duration: 0.7,
        ease: "power3.inOut",
      });
    }

    // Configurar track para slide
    gsap.set(track, { display: "flex", width: `${cards.length * 100}%`, x: 0, overflow: "visible" });
    cards.forEach((c) => { c.style.flex = `0 0 ${100 / cards.length}%`; });
    cards[0].classList.add("active");

    prevBtn && prevBtn.addEventListener("click", () => goTo(current - 1));
    nextBtn && nextBtn.addEventListener("click", () => goTo(current + 1));
    dots.forEach((d) => d.addEventListener("click", () => goTo(parseInt(d.dataset.idx, 10))));

    // Auto-avance
    let autoTimer = setInterval(() => goTo(current + 1), 6000);
    track.addEventListener("mouseenter", () => clearInterval(autoTimer));
    track.addEventListener("mouseleave", () => {
      autoTimer = setInterval(() => goTo(current + 1), 6000);
    });
  }


  /* ============================================
     14. FORMULARIOS — feedback visual
     ============================================ */
  function handleForm(formId, successMsg) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const btn = form.querySelector("button[type=submit]");
      const original = btn.textContent;

      btn.textContent = "✓ Enviado";
      btn.style.background = "#C8FF00";
      btn.style.color = "#080810";
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = "";
        btn.style.color = "";
        btn.disabled = false;
        form.reset();
      }, 3500);
    });
  }

  handleForm("footerForm", "¡Gracias! Te contactamos pronto.");
  handleForm("teaserForm", "¡Anotado para acceso anticipado!");


  /* ============================================
     15. REVEAL SECCIONES GENERALES
     ============================================ */
  // Títulos de secciones
  gsap.utils.toArray(".section-title").forEach((el) => {
    if (el.closest(".section-hero")) return; // Hero ya tiene su propia animación
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        once: true,
      },
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: "power3.out",
    });
  });

  // Verde micro-copy
  gsap.from(".verde-micro", {
    scrollTrigger: {
      trigger: ".verde-micro",
      start: "top 85%",
    },
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: "power3.out",
  });

  // Footer
  gsap.from(".footer-title", {
    scrollTrigger: {
      trigger: ".section-footer",
      start: "top 75%",
    },
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power3.out",
  });

  gsap.from(".footer-right", {
    scrollTrigger: {
      trigger: ".section-footer",
      start: "top 70%",
    },
    opacity: 0,
    x: 40,
    duration: 1,
    delay: 0.2,
    ease: "power3.out",
  });


  /* ============================================
     16. PARALLAX SUAVE — Hero & Restauración
     ============================================ */
  gsap.to(".hero-bg-video", {
    scrollTrigger: {
      trigger: ".section-hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
    y: "30%",
    ease: "none",
  });

  gsap.to(".restauracion-bg-img", {
    scrollTrigger: {
      trigger: ".section-restauracion",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
    y: "20%",
    ease: "none",
  });


  /* ============================================
     17. SCROLL SUAVE — ANCLAS DE NAVEGACIÓN
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });

        // Cerrar menu mobile si está abierto
        if (navLinks && navLinks.style.display === "flex") {
          navLinks.style.display = "none";
        }
      }
    });
  });

  /* ============================================
     18. SWIPER CARDS (ANATOMÍA)
     ============================================ */
  if (document.querySelector(".anatomia-swiper")) {
    new Swiper(".anatomia-swiper", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      initialSlide: 1,
      coverflowEffect: {
        rotate: 0,
        stretch: 50,
        depth: 200,
        modifier: 1,
        slideShadows: false,
        scale: 0.85,
      },
      loop: true,
      loopedSlides: 3,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".nav-next",
        prevEl: ".nav-prev",
      },
      pagination: {
        el: ".slider_pagination",
        type: "progressbar",
      },
    });
  }

  /* ============================================
     19. CARD GLOW EFFECT
     ============================================ */
  const newsCards = document.querySelectorAll(".news_card_component");
  newsCards.forEach(card => {
    const glow = card.querySelector(".card-glow");
    if (!glow) return;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(32, 231, 183, 0.4) 0%, rgba(32, 231, 183, 0.12) 50%, transparent 70%)`;
    });
  });

  /* ============================================
     20. BG SWIPER (RESTAURACIÓN)
     ============================================ */
  if (document.querySelector(".bg-swiper")) {
    const bgSwiper = new Swiper(".bg-swiper", {
      effect: "fade",
      fadeEffect: {
        crossFade: true
      },
      speed: 800,
      loop: true,
      navigation: {
        nextEl: "#bg-next",
        prevEl: "#bg-prev",
      },
      on: {
        init: function () {
          updateProgress(this);
        },
        slideChange: function () {
          updateProgress(this);
        }
      }
    });

    function updateProgress(swiper) {
      const progressBar = document.getElementById("bg-progress");
      if (progressBar) {
        // Calculate progress percentage based on current slide
        const totalSlides = swiper.slides.length;
        const currentSlide = swiper.realIndex + 1;

        // Progress goes from -100% to 0% (translating)
        const percent = ((currentSlide / totalSlides) * 100) - 100;
        progressBar.style.transform = `translate3d(${percent}%, 0px, 0px)`;
      }
    }
  }

  // ---- EFECTO PARALLAX FLOTANTE MUEBLES CÁPSULA (JS NATIVO) ----
  const capsulaSection = document.getElementById("capsula");
  if (capsulaSection) {
    const items = capsulaSection.querySelectorAll(".c-element-overviewgrid > .overview-item:not(.bento-header-wrapper):not(.infinity-item--skip)");

    // Factores de movimiento asíncronos/diferentes por imagen (parallax orgánico)
    const factors = [
      { x: -0.04, y: -0.04 }, // Img 1
      { x: 0.03, y: -0.05 },  // Img 2
      { x: -0.05, y: 0.02 },  // Img 3
      { x: 0.04, y: 0.04 },   // Img 4
      { x: -0.03, y: 0.05 },  // Img 5
      { x: 0.05, y: -0.03 }   // Img 6
    ];

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener("mousemove", (e) => {
      // Coordenadas relativas al centro del viewport (-0.5 a 0.5)
      targetX = (e.clientX / window.innerWidth) - 0.5;
      targetY = (e.clientY / window.innerHeight) - 0.5;
    });

    function animateParallax() {
      // Interpolación lineal suave (lerp)
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      items.forEach((item, index) => {
        const factor = factors[index] || { x: 0.03, y: 0.03 };
        // Desplazamiento máximo de 15px - 20px
        const moveX = currentX * factor.x * 400;
        const moveY = currentY * factor.y * 400;

        const media = item.querySelector(".fs-media");
        if (media) {
          media.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        }
      });

      requestAnimationFrame(animateParallax);
    }

    animateParallax();
  }

})();

// Mobile Capsula Loop Carousel
function initMobileCapsulaCarousel() {
  if (window.innerWidth <= 768) {
    const grid = document.querySelector("#capsula .c-element-overviewgrid");
    if (!grid || grid.classList.contains("carousel-initialized")) return;
    
    // Extract bento header and place it before the grid
    const bentoHeader = grid.querySelector(".bento-header-wrapper");
    if (bentoHeader) {
      grid.parentNode.insertBefore(bentoHeader, grid);
    }
    
    // Get all image items
    const items = Array.from(grid.querySelectorAll(".overview-item:not(.bento-header-wrapper):not(.infinity-item--skip)"));
    
    // Clear skip items from DOM
    grid.querySelectorAll(".infinity-item--skip").forEach(el => el.remove());
    
    // Create track
    const track = document.createElement("div");
    track.className = "capsula-carousel-track";
    
    // Append items to track
    items.forEach(item => {
      track.appendChild(item);
    });
    
    // Clone items for seamless loop
    items.forEach(item => {
      const clone = item.cloneNode(true);
      clone.classList.add("carousel-clone");
      track.appendChild(clone);
    });
    
    grid.innerHTML = "";
    grid.appendChild(track);
    grid.classList.add("carousel-initialized");
  }
}
window.addEventListener("DOMContentLoaded", initMobileCapsulaCarousel);
window.addEventListener("resize", initMobileCapsulaCarousel);
