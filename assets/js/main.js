/* ACE DIVING — small progressive-enhancement script: nav, dive-site filter */
(function () {
  'use strict';

  /* ---- mobile nav toggle ---- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  /* ---- dropdowns: click to open (works for touch + keyboard), hover on desktop ---- */
  var items = document.querySelectorAll('.nav > ul > li');
  var hoverable = window.matchMedia('(hover: hover) and (min-width: 1121px)');

  function closeAll(except) {
    items.forEach(function (li) {
      if (li !== except) {
        li.classList.remove('open');
        var b = li.querySelector(':scope > button');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
  }

  items.forEach(function (li) {
    var btn = li.querySelector(':scope > button');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = li.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      closeAll(li);
    });
    li.addEventListener('mouseenter', function () {
      if (!hoverable.matches) return;
      closeAll(li);
      li.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    });
    li.addEventListener('mouseleave', function () {
      if (!hoverable.matches) return;
      li.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', function () { closeAll(null); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(null); });

  /* ---- dive sites: search + depth band filter ---- */
  var list = document.querySelector('.sites');
  if (list) {
    var q = document.getElementById('site-search');
    var chips = document.querySelectorAll('.chip[data-band]');
    var count = document.getElementById('site-count');
    var cards = Array.prototype.slice.call(list.querySelectorAll('.site'));
    var band = 'all';

    function apply() {
      var term = (q && q.value || '').trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (c) {
        var okBand = band === 'all' || c.getAttribute('data-band') === band;
        var okText = !term || c.textContent.toLowerCase().indexOf(term) !== -1;
        var show = okBand && okText;
        c.hidden = !show;
        if (show) shown++;
      });
      if (count) count.textContent = shown + ' of ' + cards.length + ' sites';
    }
    if (q) q.addEventListener('input', apply);
    chips.forEach(function (ch) {
      ch.addEventListener('click', function () {
        band = ch.getAttribute('data-band');
        chips.forEach(function (o) { o.setAttribute('aria-pressed', o === ch ? 'true' : 'false'); });
        apply();
      });
    });
    apply();
  }

  /* ---- contact form: static demo, no backend ---- */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = document.getElementById('form-note');
      if (note) {
        note.hidden = false;
        note.textContent = 'Thanks for submitting! This is a static prototype — hook the form to your email/CRM to receive messages.';
      }
    });
  }
})();
