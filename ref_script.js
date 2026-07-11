/* =====================================================================
   CÚSPIDES — Interacciones (vanilla JS)
   ---------------------------------------------------------------------
   1) Parallax del hero (dos capas) throttleado con requestAnimationFrame.
   2) Nosotros: reveal de color palabra por palabra mientras la sección
      queda fija (pinned/sticky).
   3) Preparación: scroll-jacking horizontal (las cards se desplazan en
      X según el avance del scroll vertical; la card 5 termina centrada).
   Todos los listeners de scroll van throttleados con rAF.
   ===================================================================== */

(function () {
  'use strict';

  // ¿Mobile? -> desactivamos los efectos pesados (los maneja el CSS)
  const isMobile = window.matchMedia('(max-width: 720px)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Helper de clamp numérico
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));


  /* ===================================================================
     1) PARALLAX DEL HERO
     =================================================================== */
  function initParallax() {
    if (isMobile) return; // en mobile la montaña va en flujo normal

    const layers = Array.from(document.querySelectorAll('.hero [data-parallax]'));
    const hero = document.querySelector('.hero');
    if (!hero || layers.length === 0) return;

    let ticking = false;

    function update() {
      const scrollY = window.scrollY;
      const heroBottom = hero.offsetTop + hero.offsetHeight;

      // Solo animamos mientras el hero está (parcialmente) en pantalla
      if (scrollY < heroBottom) {
        layers.forEach((layer) => {
          const speed = parseFloat(layer.dataset.parallax) || 0;
          const y = scrollY * speed;
          // El botón comparte la MISMA fijación que frentehero (misma
          // velocidad), pero mantiene su centrado horizontal (-50%, -50%).
          if (layer.dataset.center === '1') {
            layer.style.transform = 'translate3d(-50%, calc(-50% + ' + y + 'px), 0)';
          } else {
            // La capa de fondo se mueve más lento; la frontal, más.
            layer.style.transform = 'translate3d(0,' + y + 'px,0)';
          }
        });
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }


  /* ===================================================================
     2) NOSOTROS — reveal de color palabra por palabra (pinned)
     =================================================================== */
  function initNosotros() {
    const section = document.querySelector('.nosotros');
    const track = document.querySelector('.nosotros__track');
    const words = Array.from(document.querySelectorAll('#nosotrosText .word'));
    if (!section || !track || words.length === 0) return;

    // En mobile el CSS ya deja el texto en su color final
    if (isMobile) return;

    let ticking = false;

    function update() {
      // Progreso (0..1) del scroll dentro del tramo "pinneado"
      const rect = track.getBoundingClientRect();
      const total = track.offsetHeight - window.innerHeight;
      // distancia recorrida desde que el track toca el top
      const scrolled = clamp(-rect.top, 0, total);
      const progress = total > 0 ? scrolled / total : 0;

      // Cantidad de palabras "reveladas" según el avance.
      // Usamos un poco menos del recorrido total para que termine antes
      // de despinear (el texto queda completo con algo de margen).
      const revealCount = Math.round(progress * words.length * 1.15);

      words.forEach((word, i) => {
        if (i < revealCount) {
          // La línea de acento termina en naranja; el resto en oscuro.
          word.style.color = word.classList.contains('word--accent')
            ? getComputedStyle(document.documentElement).getPropertyValue('--color-accent')
            : getComputedStyle(document.documentElement).getPropertyValue('--color-dark');
        } else {
          word.style.color = ''; // vuelve al gris de transición (CSS)
        }
      });

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();
  }


  /* ===================================================================
     3) PREPARACIÓN — scroll-jacking horizontal
     =================================================================== */
  function initPrep() {
    const track = document.getElementById('prepTrack');
    const cardsEl = document.getElementById('prepCards');
    const cards = Array.from(document.querySelectorAll('#prepCards .card'));
    if (!track || !cardsEl || cards.length === 0) return;

    // En mobile pasa a scroll horizontal manual (CSS); no calculamos nada.
    if (isMobile) return;

    // Conectores animados entre cards (uno por cada transición)
    const CYAN = '#8DAFC3';
    const GRAY = '#D9D9D9';
    const connectors = Array.from(document.querySelectorAll('#prepCards .connector')).map(function (el) {
      return {
        l: el.querySelector('.connector__sq--l'),
        r: el.querySelector('.connector__sq--r'),
        fill: el.querySelector('.connector__fill')
      };
    });
    const segs = cards.length - 1; // tramos = nº de conectores

    let ticking = false;
    let step = 0;          // ancho de bloque + conector
    let totalDistance = 0; // distancia horizontal a recorrer

    // Calcula medidas y la altura artificial del track
    function measure() {
      const first = cards[0];
      const second = cards[1];
      const cardWidth = first.getBoundingClientRect().width;

      // step = distancia entre el inicio de una card y la siguiente
      if (second) {
        step = second.offsetLeft - first.offsetLeft;
      } else {
        step = cardWidth;
      }

      // Distancia total = (ancho_bloque + gap) × (cantidad − 1)
      totalDistance = step * (cards.length - 1);

      // Centramos la PRIMERA card al inicio: padding-left tal que su
      // centro quede en el centro del viewport.
      const padLeft = (window.innerWidth - cardWidth) / 2;
      cardsEl.style.paddingLeft = padLeft + 'px';

      // Altura artificial: 1 viewport (para el pin) + la distancia que
      // necesitamos "consumir" para recorrer todas las cards.
      const trackHeight = window.innerHeight + totalDistance;
      track.style.setProperty('--track-h', trackHeight + 'px');
    }

    function update() {
      const rect = track.getBoundingClientRect();
      const total = track.offsetHeight - window.innerHeight;
      const scrolled = clamp(-rect.top, 0, total);
      const progress = total > 0 ? scrolled / total : 0;

      // Movimiento 1:1: al avanzar, cada card sucesiva queda centrada.
      // En progress=1, la card 5 queda centrada (no pegada al borde).
      const x = -(progress * totalDistance);
      cardsEl.style.transform = 'translate3d(' + x + 'px,0,0)';

      // Conectores: cada uno se llena mientras se pasa de una card a la
      // siguiente (mismo progreso del scroll-jacking).
      for (let c = 0; c < connectors.length; c++) {
        const cn = connectors[c];
        if (!cn.fill) continue;
        const frac = clamp(progress * segs - c, 0, 1);
        cn.fill.style.width = (frac * 100) + '%';
        // Cuadrado de origen: celeste apenas empieza este tramo
        if (cn.l) cn.l.style.backgroundColor = (progress * segs >= c) ? CYAN : GRAY;
        // Cuadrado de destino: celeste al completar el llenado
        if (cn.r) cn.r.style.backgroundColor = (frac >= 1) ? CYAN : GRAY;
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    function onResize() {
      measure();
      update();
    }

    // Recalcula cuando las fuentes terminan de cargar (cambian anchos)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(onResize);
    }

    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
  }


  /* ===================================================================
     HEADER — transparente sobre el hero, crema sobre el resto
     =================================================================== */
  function initHeader() {
    const header = document.querySelector('.header');
    const hero = document.querySelector('.hero');
    if (!header || !hero) return;

    let ticking = false;

    function update() {
      // Sólida cuando el hero ya casi salió de pantalla bajo la barra
      const threshold = hero.offsetHeight - header.offsetHeight - 10;
      header.classList.toggle('header--solid', window.scrollY > threshold);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();
  }


  /* ===================================================================
     EXPERIENCIAS — carrusel manual con flechas (foto central se agranda)
     =================================================================== */
  function initExperiencias() {
    const track = document.getElementById('expTrack');
    const stage = track && track.querySelector('.exp__stage');
    const items = Array.from(document.querySelectorAll('#expStrip .exp__item'));
    if (!track || !stage || items.length === 0) return;

    // En mobile: scroll horizontal manual (CSS), sin flechas.
    if (isMobile) return;

    const N = items.length;                 // 5 fotos en anillo (loop)
    // Posición (px de diseño @1920) del centro de cada slot según |rel|
    const SLOT = [0, 483.5, 787.5];          // centro, ±1, ±2
    let center = -999;

    // Mide el valor real de --u (no se puede leer el clamp() resuelto):
    // un elemento de prueba con width: calc(1000 * var(--u)).
    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;left:-9999px;top:0;height:0;width:calc(1000 * var(--u));';
    let u = 1;
    function measureU() {
      document.body.appendChild(probe);
      u = (probe.getBoundingClientRect().width / 1000) || 1;
      probe.remove();
    }
    measureU();
    // rel ∈ {-2,-1,0,1,2}: distancia circular al centro
    function relOf(i, c) {
      const d = ((i - c) % N + N) % N;
      return d <= 2 ? d : d - N;
    }
    function place(it, rel, u) {
      const x = SLOT[Math.abs(rel)] * (rel < 0 ? -1 : 1) * u;
      it.style.transform = 'translate(-50%, -50%) translateX(' + x + 'px)';
      it.classList.toggle('is-active', rel === 0);
      it.style.zIndex = (rel === 0) ? 5 : (2 - Math.abs(rel));
    }
    function setCenter(c) {
      if (c === center) return;
      const old = center;
      center = c;
      items.forEach(function (it, i) {
        const relNew = relOf(i, c);
        const relOld = (old <= -999) ? relNew : relOf(i, old);
        // La foto que "da la vuelta" (de un extremo al otro) salta sin
        // transición y reaparece con un fundido, para que no cruce la pantalla.
        if (Math.abs(relNew - relOld) > 1) {
          it.style.transition = 'none';
          it.style.opacity = '0';
          place(it, relNew, u);
          void it.offsetWidth;             // reflow
          it.style.transition = '';
          it.style.opacity = '1';
        } else {
          it.style.transition = '';
          place(it, relNew, u);
        }
      });
    }
    // Reposiciona sin animación (en resize cambia --u)
    function relayout() {
      measureU();
      items.forEach(function (it, i) { it.style.transition = 'none'; place(it, relOf(i, center), u); });
      void stage.offsetWidth;
      items.forEach(function (it) { it.style.transition = ''; });
    }

    // Avance manual por las flechas: el centro recorre el anillo (loop)
    function go(dir) {
      setCenter(((center + dir) % N + N) % N);
    }
    const prevBtn = document.getElementById('expPrev');
    const nextBtn = document.getElementById('expNext');
    if (prevBtn) prevBtn.addEventListener('click', function () { go(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(1); });

    setCenter(0);                            // estado inicial = Aconcagua centrado
    window.addEventListener('resize', relayout);
  }


  /* ===================================================================
     FRASE — aparición sutil de la cita al entrar en viewport
     =================================================================== */
  function initFrase() {
    const section = document.querySelector('.frase');
    if (!section) return;

    // Sin movimiento o sin IntersectionObserver: mostrar directo.
    if (reduceMotion || !('IntersectionObserver' in window)) {
      section.classList.add('is-in');
      return;
    }

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          section.classList.add('is-in');
          io.unobserve(entry.target);       // una sola vez
        }
      });
    }, { threshold: 0.35 });

    io.observe(section);
  }


  /* ===================================================================
     CTA — fallback de scroll suave hacia "Nosotros"
     =================================================================== */
  function initCta() {
    const cta = document.querySelector('.cta');
    const target = document.getElementById('nosotros');
    if (!cta || !target) return;
    cta.addEventListener('click', function () {
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }


  /* ===================================================================
     INIT
     =================================================================== */
  function init() {
    initParallax();
    initNosotros();
    initPrep();
    initExperiencias();
    initFrase();
    initHeader();
    initCta();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

