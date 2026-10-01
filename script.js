/* ==========================================================================
   The Ground Up Project: San Diego — site behavior
   Vanilla JS replacing the Carrd runtime:
   1. Hash routing between page sections
   2. Scroll-reveal animations (fade-right / fade-up / fade-in / hero veil)
   3. Hero background parallax
   4. Mobile nav toggle
   5. Contact / volunteer forms (mailto fallback, no backend)
   6. Loading overlay
   ========================================================================== */
(function () {
  'use strict';

  var CONTACT_EMAIL = 'tgupsd@gmail.com';

  /* ---------- 1. Hash routing ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('.page-section'));
  var byName = {};
  sections.forEach(function (s) {
    var m = s.id.match(/^(.*)-section$/);
    if (m) byName[m[1]] = s;
  });

  function showSection(name) {
    var target = byName[name] || byName.home;
    sections.forEach(function (s) {
      s.classList.toggle('active', s === target);
    });
    // Instant scroll to top on section change (matches original).
    window.scrollTo(0, 0);
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    refreshParallax();
  }

  function route() {
    var h = (location.hash || '').replace(/^#\/?/, '');
    showSection(h || 'home');
  }
  window.addEventListener('hashchange', route);

  /* ---------- 2. Scroll-reveal animations ---------- */
  // Mirrors the original onvisible registrations.
  var revealTargets = [
    ['.t-display', 'rv--right'],            // fade-right, 1s
    ['.band--hero .band__inner', 'rv--up'], // fade-up, 1s, 750ms delay
    ['.t-heading', 'rv--in'],               // fade-in, 1s
    ['.btn-list', 'rv--in'],                // fade-in, 1s
    ['.fig', 'rv--in'],                     // fade-in, 1s
    ['.partners', 'rv--in'],                // fade-in, 1s
    ['.t-body.t-light.t-center', 'rv--in'], // fade-in, 1s
    ['.t-lede', 'rv--in-fast']              // fade-in, 750ms
  ];

  var toReveal = [];
  revealTargets.forEach(function (pair) {
    Array.prototype.forEach.call(document.querySelectorAll(pair[0]), function (el) {
      el.classList.add('rv', pair[1]);
      toReveal.push(el);
    });
  });

  var heroes = Array.prototype.slice.call(document.querySelectorAll('.band--hero'));

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    toReveal.forEach(function (el) { io.observe(el); });
    heroes.forEach(function (el) { io.observe(el); }); // hero veil fade
  } else {
    // No IntersectionObserver: show everything immediately.
    toReveal.forEach(function (el) { el.classList.add('is-visible'); });
    heroes.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 3. Hero background parallax ---------- */
  var ticking = false;
  function refreshParallax() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      document.documentElement.style.setProperty('--scroll-y', String(y));
      heroes.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        el.style.setProperty('--element-top', String(Math.round(rect.top + y)));
      });
    });
  }
  window.addEventListener('scroll', refreshParallax, { passive: true });
  window.addEventListener('resize', refreshParallax);

  /* ---------- 4. Mobile nav toggle (unchanged behavior) ---------- */
  var menuToggle = document.getElementById('menu-toggle');
  var navbarNav = document.getElementById('navbar-nav');
  if (menuToggle && navbarNav) {
    menuToggle.addEventListener('click', function () {
      navbarNav.classList.toggle('active');
      menuToggle.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded',
        navbarNav.classList.contains('active') ? 'true' : 'false');
    });
    navbarNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        navbarNav.classList.remove('active');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 5. Forms ---------- */
  // No backend outside Carrd: validate, open a prefilled email to the
  // team address, then show the original "Thank you! :)" confirmation.
  function showSuccess(form) {
    form.innerHTML = '<p class="t-body form-note">Thank you! :)</p>';
  }

  Array.prototype.forEach.call(document.querySelectorAll('.tgu-form'), function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var honey = form.querySelector('input[name="data-url"], input[name="page-url"]');
      if (honey && honey.value) { showSuccess(form); return; } // spam trap
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var lines = [];
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || el.type === 'submit' || el.type === 'button') return;
        if (el.name === 'data-url' || el.name === 'page-url') return;
        if (el.type === 'checkbox') {
          lines.push(el.name + ': ' + (el.checked ? 'yes' : 'no'));
        } else if (el.value) {
          lines.push(el.name + ': ' + el.value);
        }
      });
      var subject = form.id === 'form02'
        ? 'Volunteer sign-up — The Ground Up Project: San Diego'
        : 'Donation inquiry — The Ground Up Project: San Diego';
      window.location.href = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      showSuccess(form);
    });
  });

  /* ---------- 6. Loading overlay + initial route ---------- */
  function ready() {
    route();
    refreshParallax();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
  window.addEventListener('load', function () {
    document.body.classList.remove('is-loading');
    refreshParallax();
  });
  // Failsafe: never trap the user behind the white overlay.
  setTimeout(function () {
    document.body.classList.remove('is-loading');
  }, 4000);
})();
