/* ============================================================
   Glossary — right-hand sidebar panel.
   Any element with [data-gloss="id"] becomes a clickable term;
   clicking opens a panel populated from window.GLOSSARY[id]
   (defined in glossaryData.js). Non-modal: on wide screens the
   content reflows beside the panel so you can keep scrolling.
   ============================================================ */
(function () {
  const data = () => window.GLOSSARY || {};

  // ---- build panel + scrim ----
  const scrim = document.createElement('div');
  scrim.className = 'gloss-scrim';

  const panel = document.createElement('aside');
  panel.className = 'glossary-panel';
  panel.setAttribute('role', 'complementary');
  panel.setAttribute('aria-label', 'Glossary');
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML =
    '<div class="gp-head">' +
      '<div><div class="gp-title"></div></div>' +
      '<button class="gp-close" type="button" aria-label="Close glossary">×</button>' +
    '</div>' +
    '<div class="gp-body">' +
      '<div class="gp-summary"></div>' +
      '<div class="gp-resources" hidden>' +
        '<div class="gp-resources-label">Learn more</div>' +
        '<div class="gp-res-list"></div>' +
      '</div>' +
    '</div>';

  document.body.appendChild(scrim);
  document.body.appendChild(panel);

  const elTitle = panel.querySelector('.gp-title');
  const elSummary = panel.querySelector('.gp-summary');
  const elResWrap = panel.querySelector('.gp-resources');
  const elResList = panel.querySelector('.gp-res-list');
  let activeId = null, activeTerm = null;

  function close() {
    panel.classList.remove('open');
    document.body.classList.remove('gloss-open');
    panel.setAttribute('aria-hidden', 'true');
    if (activeTerm) activeTerm.classList.remove('active');
    activeId = null; activeTerm = null;
  }

  function open(id, termEl) {
    const entry = data()[id];
    if (!entry) return;
    if (activeId === id && panel.classList.contains('open')) { close(); return; } // toggle off
    if (activeTerm) activeTerm.classList.remove('active');

    elTitle.textContent = entry.title || id;
    elSummary.innerHTML = entry.summary || '';
    const res = entry.resources || [];
    elResList.innerHTML = res.map(function (r) {
      return '<a class="gp-res" href="' + r.url + '" target="_blank" rel="noopener">' +
        r.label + '<span class="gp-res-arrow">↗</span></a>';
    }).join('');
    elResWrap.hidden = res.length === 0;

    panel.classList.add('open');
    document.body.classList.add('gloss-open');
    panel.setAttribute('aria-hidden', 'false');
    panel.querySelector('.gp-body').scrollTop = 0;
    activeId = id;
    activeTerm = termEl || null;
    if (activeTerm) activeTerm.classList.add('active');
  }

  // ---- wire terms ----
  document.querySelectorAll('[data-gloss]').forEach(function (el) {
    const id = el.dataset.gloss;
    if (!data()[id]) { el.classList.remove('gloss'); return; } // no entry -> plain text
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', 'Glossary: ' + el.textContent.trim());
    el.addEventListener('click', function (e) { e.preventDefault(); open(id, el); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(id, el); }
    });
  });

  panel.querySelector('.gp-close').addEventListener('click', close);
  scrim.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) close();
  });
})();
