/* ============================================================
   From Attention to Agents — shared site behavior
   Auto-generated sidebar TOC (per chapter; h2/h3 inside .article),
   scroll progress, KaTeX rendering, mobile nav, math tooltips,
   and inline glossary popups. Loaded on every chapter page from
   ../scripts/shared.js (chapters live in chapters/). Vanilla JS,
   no dependencies beyond KaTeX (CDN).
   ============================================================ */

/* ---------- Scroll progress ---------- */
function initProgress() {
  const bar = document.querySelector('.progress-bar');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    bar.style.width = Math.max(0, Math.min(1, scrolled)) * 100 + '%';
  };
  document.addEventListener('scroll', update, { passive: true });
  update();
}

/* ---------- Sidebar TOC (auto-generated from h2/h3) ---------- */
function initTOC() {
  const toc = document.querySelector('.nav-toc');
  const article = document.querySelector('.article');
  if (!toc || !article) return;

  const headings = article.querySelectorAll('h2, h3');
  const entries = [];
  headings.forEach((h, i) => {
    if (!h.id) h.id = 'sec-' + i;
    // TOC text strips any .section-number prefix
    const num = h.querySelector('.section-number');
    const text = num ? h.textContent.replace(num.textContent, '').trim() : h.textContent.trim();
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = text;
    a.className = h.tagName === 'H2' ? 'nav-item' : 'nav-sub-item';
    toc.appendChild(a);
    entries.push({ el: h, link: a });
  });

  // Scroll-spy
  const onScroll = () => {
    let active = entries[0];
    for (const e of entries) {
      if (e.el.getBoundingClientRect().top <= 120) active = e;
    }
    entries.forEach(e => e.link.classList.toggle('active', e === active));
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Mobile nav ---------- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (!toggle || !sidebar) return;
  toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  sidebar.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => sidebar.classList.remove('open')));
}

/* ---------- KaTeX rendering ---------- */
function renderMath() {
  if (!window.renderMathInElement) return;
  window.renderMathInElement(document.body, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
    ],
    trust: true,           // required for \htmlData tooltips
    throwOnError: false,
    // \htmlData is a trusted HTML extension here (see the tooltips code below);
    // silence KaTeX's strict-mode warning for that one code, keep other warnings on.
    strict: (errorCode) => (errorCode === 'htmlExtension' ? 'ignore' : 'warn'),
  });
}

/* ---------- Math tooltips (KaTeX \htmlData{tip=...}) ----------
   A single popup element appended to <body> so it escapes the
   overflow:hidden clipping on .katex-display. */
function initMathTooltips() {
  let pop = null;
  const show = (target) => {
    const tip = target.getAttribute('data-tip');
    if (!tip) return;
    pop = document.createElement('div');
    pop.className = 'math-tooltip';
    pop.textContent = tip;
    document.body.appendChild(pop);
    const r = target.getBoundingClientRect();
    const top = r.top + window.scrollY - pop.offsetHeight - 8;
    let left = r.left + window.scrollX + r.width / 2 - pop.offsetWidth / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - pop.offsetWidth - 8));
    pop.style.top = top + 'px';
    pop.style.left = left + 'px';
  };
  const hide = () => { if (pop) { pop.remove(); pop = null; } };
  document.body.addEventListener('mouseover', e => {
    const t = e.target.closest('[data-tip]');
    if (t) show(t);
  });
  document.body.addEventListener('mouseout', e => {
    if (e.target.closest('[data-tip]')) hide();
  });
}

/* ---------- Inline glossary popups ----------
   <span class="term" data-term="reward-model">reward model</span>
   with a <template id="gloss-reward-model"> elsewhere on the page. */
function initGlossary() {
  let pop = null;
  const close = () => { if (pop) { pop.remove(); pop = null; } };
  document.body.addEventListener('click', e => {
    const term = e.target.closest('.term');
    close();
    if (!term) return;
    const tpl = document.getElementById('gloss-' + term.dataset.term);
    if (!tpl) return;
    e.stopPropagation();
    pop = document.createElement('div');
    pop.className = 'glossary-pop';
    pop.appendChild(tpl.content.cloneNode(true));
    document.body.appendChild(pop);
    const r = term.getBoundingClientRect();
    let left = r.left + window.scrollX;
    left = Math.min(left, window.innerWidth - pop.offsetWidth - 12);
    pop.style.top = (r.bottom + window.scrollY + 8) + 'px';
    pop.style.left = Math.max(12, left) + 'px';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initProgress();
  initTOC();
  initMobileNav();
  renderMath();
  initMathTooltips();
});
