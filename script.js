/* ============================================
   ZINCUME SECURITY SERVICES — JAVASCRIPT
   ============================================ */

(function () {
  'use strict';

  // ─── FOOTER YEAR ────────────────────────────
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ─── STICKY NAV ─────────────────────────────
  const navHeader = document.getElementById('nav-header');
  function updateNav() {
    if (window.scrollY > 40) {
      navHeader.classList.add('scrolled');
    } else {
      navHeader.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ─── MOBILE NAV TOGGLE ──────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!navHeader.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // ─── ACTIVE NAV SECTION HIGHLIGHT ───────────
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');
  const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '72');

  function updateActiveNav() {
    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop - navHeight - 40;
      if (window.scrollY >= top) {
        currentId = section.getAttribute('id');
      }
    });
    navLinkEls.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${currentId}`);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // ─── SMOOTH SCROLL ──────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ─── SCROLL REVEAL ──────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));

  // ─── FAQ ACCORDION ──────────────────────────
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ─── CONTACT FORM VALIDATION & SUBMIT ───────
  const form = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    const fields = {
      'full-name': {
        el: document.getElementById('full-name'),
        errEl: document.getElementById('full-name-error'),
        validate: v => v.trim().length >= 2 ? null : 'Please enter your full name.'
      },
      'phone': {
        el: document.getElementById('phone'),
        errEl: document.getElementById('phone-error'),
        validate: v => /^[\d\s\+\-\(\)]{7,}$/.test(v.trim()) ? null : 'Please enter a valid phone number.'
      },
      'email': {
        el: document.getElementById('email'),
        errEl: document.getElementById('email-error'),
        validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'Please enter a valid email address.'
      },
      'course': {
        el: document.getElementById('course'),
        errEl: document.getElementById('course-error'),
        validate: v => v ? null : 'Please select a course of interest.'
      }
    };

    function validateField(key) {
      const { el, errEl, validate } = fields[key];
      const error = validate(el.value);
      if (error) {
        el.classList.add('invalid');
        errEl.textContent = error;
        return false;
      }
      el.classList.remove('invalid');
      errEl.textContent = '';
      return true;
    }

    // Live validation on blur
    Object.keys(fields).forEach(key => {
      fields[key].el.addEventListener('blur', () => validateField(key));
      fields[key].el.addEventListener('input', () => {
        if (fields[key].el.classList.contains('invalid')) {
          validateField(key);
        }
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const allValid = Object.keys(fields).map(validateField).every(Boolean);
      if (!allValid) return;

      const submitBtn = document.getElementById('submit-btn');
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = 'Sending...';

      // Simulate submission (no backend)
      setTimeout(() => {
        form.hidden = true;
        formSuccess.hidden = false;
        formSuccess.focus();
      }, 1000);
    });
  }

})();
