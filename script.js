/* ═══════════════════════════════════════════════════════
   GRUPO ORION – script.js
   • Menú hamburguesa
   • Navbar scroll shadow + active link
   • Smooth-scroll con offset del navbar
   • Formulario de contacto con validación básica
   • Toast de confirmación
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Elementos ────────────────────────────────────────────────
  const navbar           = document.getElementById('navbar');
  const hamburger        = document.getElementById('hamburger');
  const navMenu          = document.getElementById('nav-menu');
  const navLinks         = document.querySelectorAll('.nav-link');
  const sections         = document.querySelectorAll('section[id]');
  const form             = document.getElementById('contact-form');
  const toast            = document.getElementById('toast');
  const contactModal     = document.getElementById('contact-modal');
  const modalClose       = document.getElementById('modal-close');
  const btnContactoHero  = document.getElementById('btn-contacto-hero');
  const phoneTriggers    = document.querySelectorAll('.phone-trigger');

  // ── Hamburger ────────────────────────────────────────────────
  hamburger.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Cerrar menú al hacer click en un enlace
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Cerrar menú al hacer click fuera
  document.addEventListener('click', function (e) {
    if (navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // ── Navbar: sombra al bajar ──────────────────────────────────
  function handleScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
    highlightActiveLink();
  }
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ── Active link por sección visible ─────────────────────────
  function highlightActiveLink() {
    const navH = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h'), 10) || 72;
    const scrollY = window.scrollY + navH + 24;

    let current = '';
    sections.forEach(function (sec) {
      if (scrollY >= sec.offsetTop) {
        current = sec.id;
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }

  // ── Smooth scroll con offset del navbar ─────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // ── Formulario de contacto ───────────────────────────────────
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const fields = ['nombre', 'email', 'asunto', 'mensaje'];
      let valid = true;

      fields.forEach(function (id) {
        const el = document.getElementById(id);
        const isEmpty = !el.value.trim();
        const isEmail = id === 'email' && !validateEmail(el.value.trim());
        if (isEmpty || isEmail) {
          el.classList.add('error');
          valid = false;
        } else {
          el.classList.remove('error');
        }
      });

      if (!valid) return;

      // Simular envío (aquí se conectaría con un backend o EmailJS)
      showToast();
      form.reset();
    });

    // Quitar estado de error al escribir
    form.querySelectorAll('input, textarea').forEach(function (el) {
      el.addEventListener('input', function () {
        el.classList.remove('error');
      });
    });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ── Toast ─────────────────────────────────────────────────────
  function showToast() {
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 4000);
  }

  // ── Modal de contacto ─────────────────────────────────────────
  function openContactModal() {
    contactModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeContactModal() {
    contactModal.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (btnContactoHero) {
    btnContactoHero.addEventListener('click', openContactModal);
  }

  phoneTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', openContactModal);
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeContactModal);
  }

  if (contactModal) {
    contactModal.addEventListener('click', function (e) {
      if (e.target === contactModal) closeContactModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && contactModal && contactModal.classList.contains('show')) {
      closeContactModal();
    }
  });

  // ── Init ──────────────────────────────────────────────────────
  handleScroll();
  highlightActiveLink();
})();
