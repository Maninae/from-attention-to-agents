/* ============================================================
   Prompt search — propose → score → select.
   The shared engine behind APE, OPRO, and EvoPrompt: keep a
   small population of candidate instructions, mutate the best,
   re-score, repeat. No gradients. Scores are simulated so the
   concept is visible at a glance.
   Self-contained IIFE. Mounts into #search-demo.
   ============================================================ */
(function () {
  const mount = document.getElementById('search-demo');
  if (!mount) return;

  // ---- seeded PRNG (mulberry32, fixed seed for determinism) ----
  let _seed = 0x9e3779b9 >>> 0;
  function rand() {
    let t = (_seed = (_seed + 0x6D2B79F5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  function resetRand() { _seed = 0x9e3779b9 >>> 0; }
  function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }

  // ---- scoped styles ----
  const css = `
    .ps-root { max-width: 720px; margin: 0 auto; font-family: var(--sans); }
    .ps-meta {
      display: flex; align-items: baseline; justify-content: space-between;
      gap: 12px; flex-wrap: wrap;
      font-family: var(--mono); font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 14px;
    }
    .ps-meta .ps-gen { color: var(--accent); }
    .ps-meta .ps-best { color: var(--teal); }
    .ps-meta .ps-step { color: var(--text-secondary); }

    .ps-pop {
      display: grid; gap: 10px;
      grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 520px) { .ps-pop { grid-template-columns: 1fr; } }

    .ps-card {
      position: relative;
      border: 1px solid var(--rule);
      border-radius: 10px;
      background: var(--bg-elevated);
      padding: 12px 14px 14px;
      transition: border-color 0.2s, background 0.2s, transform 0.2s;
    }
    .ps-card .ps-tag {
      font-family: var(--mono); font-size: 11px;
      color: var(--text-muted);
    }
    .ps-card .ps-prompt {
      font-family: var(--sans); font-size: 14px; line-height: 1.45;
      color: var(--text-primary);
      margin: 4px 0 10px;
      min-height: 2.6em;
    }
    .ps-bar {
      position: relative;
      height: 6px; border-radius: 3px;
      background: var(--bg-hover);
      overflow: hidden;
    }
    .ps-bar > span {
      display: block; height: 100%;
      background: var(--teal);
      transition: width 0.5s ease;
    }
    .ps-score {
      display: flex; justify-content: space-between; align-items: baseline;
      font-family: var(--mono); font-size: 11px; color: var(--text-secondary);
      margin-top: 6px;
    }
    .ps-score .n { color: var(--text-primary); font-size: 13px; }

    /* card state highlights */
    .ps-card.ps-kept {
      border-color: var(--accent-border);
      background: var(--accent-light);
    }
    .ps-card.ps-kept .ps-tag { color: var(--accent); }
    .ps-card.ps-new {
      border-color: rgba(47, 142, 125, 0.30);
    }
    .ps-card.ps-new .ps-tag { color: var(--teal); }
    .ps-card.ps-best-card { box-shadow: inset 0 0 0 1.5px var(--accent); }

    /* sparkline */
    .ps-spark {
      margin-top: 18px;
      border-top: 1px solid var(--rule);
      padding-top: 14px;
    }
    .ps-spark-label {
      font-family: var(--mono); font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 8px;
    }
    .ps-spark svg { display: block; width: 100%; height: 70px; overflow: visible; }
    .ps-spark-axislabels {
      display: flex; justify-content: space-between;
      font-family: var(--mono); font-size: 11px; color: var(--text-muted);
      margin-top: 4px;
    }
    .ps-spark .ps-spark-bar { fill: var(--teal); }
    .ps-spark .ps-spark-bar.cur { fill: var(--accent); }
    .ps-spark .ps-spark-axis { stroke: var(--rule-strong); stroke-width: 1; }
    .ps-spark .ps-spark-tick {
      font-family: var(--mono); font-size: 10px; fill: var(--text-muted);
    }

    .ps-caption {
      margin-top: 18px;
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.5;
    }
    .ps-caption strong { color: var(--text-primary); font-weight: 600; }
    .ps-note {
      margin-top: 6px;
      font-family: var(--mono); font-size: 11px;
      color: var(--text-muted);
    }

    /* respect reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .ps-card, .ps-bar > span { transition: none; }
    }
  `;

  // ---- prompt-engineering content pool ----
  // Starting (bland) prompts.
  const SEED_PROMPTS = [
    'Answer the question.',
    'Solve the problem.',
    'Respond.',
    'Give the answer.',
  ];

  // Mutation moves — phrases known to help in real prompt-optimization papers
  // (chain-of-thought, "take a deep breath" from OPRO, step decomposition, etc.).
  const ADDITIONS = [
    "Let's think step by step.",
    'Show your reasoning.',
    'Take a deep breath and work through it carefully.',
    'Break the problem into steps.',
    'Explain each step before the final answer.',
    'Reason carefully, then state the answer.',
    'Work it out one piece at a time.',
    'First plan, then solve.',
  ];

  // Base stems used when "crossing over" two survivors.
  const STEMS = [
    'Solve the problem.',
    'Answer carefully.',
    'Address the question.',
    'Work through the task.',
    'Tackle it methodically.',
  ];

  // ---- state ----
  const POP_SIZE = 4;
  let generation = 0;
  let population = []; // { id, text, score, tag: 'kept'|'new'|'seed' }
  let history = [];    // best score per generation (index 0 = gen 0)
  let nextId = 1;

  function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }

  // Fitness model: trends upward toward ~95 as a candidate accumulates good
  // moves; noisier early, calmer later. Purely illustrative.
  function scoreFor(text, gen) {
    let base = 18; // bland baseline
    ADDITIONS.forEach(a => { if (text.includes(a)) base += 14; });
    // diminishing returns past two additions
    const adds = ADDITIONS.reduce((k, a) => k + (text.includes(a) ? 1 : 0), 0);
    if (adds >= 2) base -= (adds - 1) * 6;
    // generational drift toward asymptote ~95
    const drift = (95 - base) * (1 - Math.pow(0.78, gen));
    const noise = (rand() - 0.5) * 9;
    return Math.round(clamp(base + drift * 0.55 + noise, 5, 99));
  }

  function mutate(parent) {
    // 50% add a new helpful phrase; 50% swap stem then add.
    const addable = ADDITIONS.filter(a => !parent.text.includes(a));
    const addition = addable.length ? pick(addable) : pick(ADDITIONS);
    if (rand() < 0.5) {
      return (parent.text.replace(/\s+$/, '') + ' ' + addition).trim();
    }
    const stem = pick(STEMS);
    return (stem + ' ' + addition).trim();
  }

  function crossover(a, b) {
    // Pull one addition from each parent (if present), recombine on a stem.
    const fromA = ADDITIONS.find(x => a.text.includes(x));
    const fromB = ADDITIONS.find(x => b.text.includes(x) && x !== fromA);
    const stem = pick(STEMS);
    const tail = [fromA, fromB].filter(Boolean).join(' ');
    if (!tail) return mutate(a);
    return (stem + ' ' + tail).trim();
  }

  function initPopulation() {
    resetRand();
    generation = 0;
    nextId = 1;
    population = SEED_PROMPTS.map(t => ({
      id: nextId++,
      text: t,
      score: scoreFor(t, 0),
      tag: 'seed',
    }));
    history = [Math.max(...population.map(p => p.score))];
  }

  function step() {
    generation += 1;

    // 1) SELECT: keep top 2.
    const sorted = [...population].sort((a, b) => b.score - a.score);
    const kept = sorted.slice(0, 2).map(p => ({ ...p, tag: 'kept' }));

    // 2) PROPOSE: 2 children — one mutation, one crossover.
    const childA = {
      id: nextId++,
      text: mutate(kept[0]),
      tag: 'new',
      score: 0,
    };
    const childB = {
      id: nextId++,
      text: crossover(kept[0], kept[1]),
      tag: 'new',
      score: 0,
    };

    // 3) SCORE the new ones (kept ones keep their score so the climb is visible).
    childA.score = scoreFor(childA.text, generation);
    childB.score = scoreFor(childB.text, generation);

    population = [kept[0], kept[1], childA, childB];
    history.push(Math.max(...population.map(p => p.score)));
  }

  // ---- render ----
  function renderCard(p, isBest) {
    const tagLabel =
      p.tag === 'kept' ? 'kept · top-2' :
      p.tag === 'new'  ? 'new · proposed' :
                        'seed';
    return `
      <div class="ps-card ${p.tag === 'kept' ? 'ps-kept' : p.tag === 'new' ? 'ps-new' : ''} ${isBest ? 'ps-best-card' : ''}">
        <div class="ps-tag">${tagLabel}</div>
        <div class="ps-prompt">${escapeHTML(p.text)}</div>
        <div class="ps-bar"><span style="width:${p.score}%"></span></div>
        <div class="ps-score">
          <span>fitness</span>
          <span class="n">${p.score}</span>
        </div>
      </div>
    `;
  }

  function escapeHTML(s) {
    return s.replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function renderSpark() {
    const n = history.length;
    const W = 100, H = 100; // viewBox; scales via CSS width:100%
    const padL = 4, padR = 2, padT = 6, padB = 12;
    const innerW = W - padL - padR;
    const innerH = H - padT - padB;
    const slots = Math.max(n, 6);
    const barW = innerW / slots * 0.7;
    const gap = innerW / slots * 0.3;
    let bars = '';
    history.forEach((v, i) => {
      const x = padL + i * (barW + gap) + gap / 2;
      const h = (v / 100) * innerH;
      const y = padT + (innerH - h);
      const cls = i === n - 1 ? 'ps-spark-bar cur' : 'ps-spark-bar';
      bars += `<rect class="${cls}" x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${barW.toFixed(2)}" height="${h.toFixed(2)}" rx="0.6"/>`;
    });
    // gen-0 label and current-gen label
    const labels = n <= 1 ? '<span>gen 0</span>'
      : `<span>gen 0</span><span>gen ${n - 1}</span>`;
    return `
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Best fitness across generations">
        <line class="ps-spark-axis" x1="${padL}" y1="${padT + innerH}" x2="${W - padR}" y2="${padT + innerH}"/>
        ${bars}
      </svg>
      <div class="ps-spark-axislabels">${labels}</div>
    `;
  }

  function stepLabel() {
    if (generation === 0) return 'ready';
    return 'select &rarr; propose &rarr; score';
  }

  function render() {
    const best = Math.max(...population.map(p => p.score));
    mount.innerHTML = `
      <style>${css}</style>
      <div class="ps-root">
        <div class="ps-meta">
          <span class="ps-gen">generation ${generation}</span>
          <span class="ps-step">${stepLabel()}</span>
          <span class="ps-best">best fitness ${best}</span>
        </div>
        <div class="ps-pop">
          ${population.map(p => renderCard(p, p.score === best)).join('')}
        </div>
        <div class="ps-spark">
          <div class="ps-spark-label">best fitness across generations</div>
          ${renderSpark()}
        </div>
        <div class="demo-controls">
          <button type="button" class="demo-btn primary" data-act="step">Run a generation &#9656;</button>
          <button type="button" class="demo-btn" data-act="reset">Reset</button>
        </div>
        <p class="ps-caption">
          No gradients, no weight updates. An LLM proposes prompts, a metric scores
          them, the best survive. This is <strong>APE</strong>, <strong>OPRO</strong>,
          and <strong>EvoPrompt</strong> in one loop.
        </p>
        <p class="ps-note">illustrative: scores are simulated to make the climb visible</p>
      </div>
    `;

    mount.querySelectorAll('.demo-btn').forEach(b => {
      b.addEventListener('click', () => {
        const act = b.dataset.act;
        if (act === 'step') { step(); render(); }
        else if (act === 'reset') { initPopulation(); render(); }
      });
    });
  }

  initPopulation();
  render();
})();
