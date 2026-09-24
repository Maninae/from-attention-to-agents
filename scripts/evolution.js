/* ============================================================
   Reflective prompt evolution — GEPA in miniature.
   Left panel: the prompt grows, each step driven by a one-line
   reflection on WHY the last attempt fell short.
   Right panel: candidates land on a (conciseness, accuracy)
   plane; the Pareto frontier connects the non-dominated ones.
   Rollout counter climbs slowly — a contrast against the
   thousands an RL search would burn.

   Reference: Agrawal et al., "GEPA: Reflective Prompt Evolution
   can Outperform Reinforcement Learning," arXiv:2507.19457
   (ICLR 2026, oral). Matches GRPO with up to 35x fewer rollouts.

   Pure SVG + DOM. No deps. Deterministic scripted sequence.
   ============================================================ */
(function () {
  const mount = document.getElementById('evo-demo');
  if (!mount) return;

  /* ---------- scoped styles ---------- */
  const css = `
    .ev-wrap { max-width: 760px; margin: 0 auto; }
    .ev-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      align-items: stretch;
    }
    .ev-panel {
      border: 1px solid var(--rule);
      border-radius: 12px;
      background: var(--bg-elevated);
      padding: 16px 18px;
      display: flex; flex-direction: column;
      min-height: 320px;
    }
    .ev-panel-label {
      font-family: var(--mono);
      font-size: 12px;
      color: var(--teal);
      margin-bottom: 10px;
    }
    .ev-prompt {
      font-family: var(--mono);
      font-size: 13px;
      line-height: 1.55;
      color: var(--text-primary);
      background: var(--bg-surface);
      border: 1px solid var(--rule);
      border-radius: 8px;
      padding: 12px 14px;
      white-space: pre-wrap;
      flex: 1;
      min-height: 180px;
    }
    .ev-prompt .ev-added {
      color: var(--accent);
      transition: color 0.6s;
    }
    .ev-reflect {
      margin-top: 12px;
      padding: 10px 12px;
      border-left: 3px solid var(--purple);
      background: color-mix(in srgb, var(--purple) 6%, var(--bg-surface));
      border-radius: 0 6px 6px 0;
      font-size: 13.5px;
      color: var(--text-secondary);
      min-height: 38px;
    }
    .ev-reflect .ev-reflect-label {
      font-family: var(--mono);
      font-size: 11px;
      color: var(--purple);
      margin-right: 6px;
    }
    .ev-reflect.ev-empty { color: var(--text-muted); font-style: italic; border-left-color: var(--rule-strong); background: var(--bg-surface); }
    .ev-reflect.ev-empty .ev-reflect-label { color: var(--text-muted); }

    .ev-plot { width: 100%; height: auto; display: block; overflow: visible; }
    .ev-plot text { font-family: var(--mono); font-size: 10px; fill: var(--text-muted); }
    .ev-plot .ev-axis-title { font-size: 11px; fill: var(--text-secondary); }
    .ev-plot .ev-dot { transition: r 0.3s, opacity 0.3s, fill 0.3s; }
    .ev-plot .ev-dot.ev-new { animation: ev-pop 0.5s ease-out; }
    @keyframes ev-pop {
      0%   { opacity: 0; stroke-width: 0; }
      60%  { opacity: 1; stroke-width: 4; }
      100% { opacity: 1; stroke-width: 1.5; }
    }
    .ev-plot .ev-front-line { transition: stroke-dashoffset 0.6s ease-out; }
    .ev-plot .ev-front-label {
      font-size: 10.5px; fill: var(--accent); font-family: var(--mono);
    }
    .ev-plot .ev-dot-label { font-size: 9.5px; fill: var(--text-muted); }

    .ev-meta {
      display: flex; justify-content: space-between; align-items: baseline;
      margin-top: 14px; gap: 16px;
      flex-wrap: wrap;
    }
    .ev-roll {
      font-family: var(--mono);
      font-size: 13px;
      color: var(--text-secondary);
    }
    .ev-roll strong {
      color: var(--accent);
      font-weight: 650;
      font-size: 15px;
    }
    .ev-roll-caption {
      font-family: var(--sans);
      font-size: 12.5px;
      color: var(--text-muted);
      font-style: italic;
      flex: 1; min-width: 200px; text-align: right;
    }
    .ev-controls { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
    .ev-step-badge {
      font-family: var(--mono); font-size: 11px;
      color: var(--text-muted);
      letter-spacing: 0.05em;
    }
    .ev-caption {
      margin-top: 18px;
      padding-top: 14px;
      border-top: 1px solid var(--rule);
      font-size: 13.5px;
      color: var(--text-secondary);
      line-height: 1.55;
    }
    @media (max-width: 640px) {
      .ev-grid { grid-template-columns: 1fr; }
      .ev-panel { min-height: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .ev-plot .ev-dot.ev-new { animation: none; }
      .ev-prompt .ev-added { transition: none; }
    }
  `;

  /* ---------- scripted, deterministic sequence ----------
     Each step:
       reflection : plain-English why-it-failed
       add        : new line appended to the prompt
       cand       : {x: conciseness 0..1, y: accuracy 0..1, label}
       rollouts   : incremental rollouts spent this step
     The candidate sequence is designed so successive steps push
     OUT the Pareto frontier (a few intentional dominated points
     show that not every reflection is a pure win).
  ----------------------------------------------------------- */
  const BASE_PROMPT = 'You are a helpful assistant. Answer the user\'s question.';
  const STEPS = [
    {
      reflection: 'Outputs ramble before answering; add: state the answer first.',
      add: 'Give the final answer in the first sentence; then explain.',
      cand: { x: 0.52, y: 0.41, label: 'c1' },
      rollouts: 4,
    },
    {
      reflection: 'Math steps are skipped; add: show each arithmetic step.',
      add: 'For any calculation, show each arithmetic step on its own line.',
      cand: { x: 0.46, y: 0.66, label: 'c2' },
      rollouts: 5,
    },
    {
      reflection: 'Tone is too stiff; soften with one warm opening sentence.',
      add: 'Open with one warm, plain sentence before the answer.',
      cand: { x: 0.38, y: 0.58, label: 'c3' },
      rollouts: 4,
    },
    {
      reflection: 'Long examples bury the point; cap them at two sentences.',
      add: 'Keep any worked example to at most two sentences.',
      cand: { x: 0.71, y: 0.74, label: 'c4' },
      rollouts: 5,
    },
    {
      reflection: 'Edge cases missed; add a one-line check before finishing.',
      add: 'End with a one-line sanity check: does the answer fit the question?',
      cand: { x: 0.78, y: 0.88, label: 'c5' },
      rollouts: 6,
    },
  ];

  /* ---------- state ---------- */
  let stepIdx = 0;                 // how many steps have been applied (0..STEPS.length)
  let promptLines = [BASE_PROMPT]; // visible prompt, line by line
  const cands = [];                // {x, y, label}
  let rollouts = 0;

  /* ---------- skeleton ---------- */
  mount.innerHTML = `
    <style>${css}</style>
    <div class="ev-wrap">
      <div class="ev-grid">
        <div class="ev-panel">
          <div class="ev-panel-label">Current prompt <span class="ev-step-badge" id="ev-step-badge">step 0 / ${STEPS.length}</span></div>
          <div class="ev-prompt" id="ev-prompt"></div>
          <div class="ev-reflect ev-empty" id="ev-reflect">
            <span class="ev-reflect-label">Reflection</span>
            <span id="ev-reflect-text">Press &ldquo;Reflect &amp; evolve&rdquo; to read why the last attempt fell short.</span>
          </div>
        </div>
        <div class="ev-panel">
          <div class="ev-panel-label">Candidates &amp; Pareto frontier</div>
          <svg class="ev-plot" id="ev-plot" viewBox="0 0 320 260" role="img" aria-label="Scatter plot of prompt candidates by conciseness and accuracy with Pareto frontier"></svg>
        </div>
      </div>

      <div class="ev-meta">
        <div class="ev-roll">rollouts used: <strong id="ev-rollouts">0</strong></div>
        <div class="ev-roll-caption">A blind RL search would need thousands for the same gain.</div>
      </div>

      <div class="ev-controls">
        <button class="demo-btn primary" id="ev-evolve" type="button">Reflect &amp; evolve &#9656;</button>
        <button class="demo-btn" id="ev-reset" type="button">Reset</button>
      </div>

      <p class="ev-caption">
        Each step reads <em>why</em> the last attempt fell short and edits the prompt to fix
        exactly that. A sentence of feedback carries many more bits than a single scalar reward.
        GEPA matches reinforcement learning with up to <strong>35&times;</strong> fewer rollouts
        (Agrawal et al., 2026).
      </p>
    </div>
  `;

  const promptEl   = mount.querySelector('#ev-prompt');
  const reflectEl  = mount.querySelector('#ev-reflect');
  const reflectTxt = mount.querySelector('#ev-reflect-text');
  const rollEl     = mount.querySelector('#ev-rollouts');
  const stepBadge  = mount.querySelector('#ev-step-badge');
  const plotEl     = mount.querySelector('#ev-plot');
  const evolveBtn  = mount.querySelector('#ev-evolve');
  const resetBtn   = mount.querySelector('#ev-reset');

  /* ---------- rendering ---------- */
  function renderPrompt(highlightLast) {
    const parts = promptLines.map((line, i) => {
      if (highlightLast && i === promptLines.length - 1 && i > 0) {
        return `<span class="ev-added">${escapeHtml(line)}</span>`;
      }
      return escapeHtml(line);
    });
    promptEl.innerHTML = parts.join('\n');
    // fade the highlight after a moment so the eye moves on
    if (highlightLast) {
      const added = promptEl.querySelector('.ev-added');
      if (added) {
        setTimeout(() => { added.style.color = 'var(--text-primary)'; }, 900);
      }
    }
  }

  function renderReflection(text) {
    if (text) {
      reflectEl.classList.remove('ev-empty');
      reflectTxt.textContent = text;
    } else {
      reflectEl.classList.add('ev-empty');
      reflectTxt.innerHTML = 'Press &ldquo;Reflect &amp; evolve&rdquo; to read why the last attempt fell short.';
    }
  }

  function renderRollouts() {
    rollEl.textContent = String(rollouts);
    stepBadge.textContent = `step ${stepIdx} / ${STEPS.length}`;
  }

  /* ---------- plot ---------- */
  // viewBox 320 x 260; plot area inset for axes + labels.
  const PAD_L = 42, PAD_R = 18, PAD_T = 18, PAD_B = 40;
  const PW = 320 - PAD_L - PAD_R;
  const PH = 260 - PAD_T - PAD_B;
  const xPx = (v) => PAD_L + v * PW;
  const yPx = (v) => PAD_T + (1 - v) * PH;

  // Compute Pareto frontier indices: a point is on the frontier
  // if no other point has BOTH x >= and y >= (with at least one strict).
  function frontierIndices(points) {
    const idx = [];
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      let dominated = false;
      for (let j = 0; j < points.length; j++) {
        if (j === i) continue;
        const q = points[j];
        if (q.x >= p.x && q.y >= p.y && (q.x > p.x || q.y > p.y)) {
          dominated = true; break;
        }
      }
      if (!dominated) idx.push(i);
    }
    return idx;
  }

  function renderPlot(newIndex /* index of just-added dot, or -1 */) {
    let s = '';

    // axes
    s += `<line x1="${PAD_L}" y1="${PAD_T + PH}" x2="${PAD_L + PW}" y2="${PAD_T + PH}" stroke="var(--rule-strong)" stroke-width="1"/>`;
    s += `<line x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${PAD_T + PH}" stroke="var(--rule-strong)" stroke-width="1"/>`;

    // light gridlines at 0.25 / 0.5 / 0.75
    [0.25, 0.5, 0.75].forEach(t => {
      const gy = yPx(t);
      s += `<line x1="${PAD_L}" y1="${gy}" x2="${PAD_L + PW}" y2="${gy}" stroke="var(--rule)" stroke-width="1"/>`;
      const gx = xPx(t);
      s += `<line x1="${gx}" y1="${PAD_T}" x2="${gx}" y2="${PAD_T + PH}" stroke="var(--rule)" stroke-width="1"/>`;
    });

    // axis tick labels
    s += `<text x="${PAD_L}" y="${PAD_T + PH + 14}" text-anchor="middle">0</text>`;
    s += `<text x="${PAD_L + PW}" y="${PAD_T + PH + 14}" text-anchor="middle">1</text>`;
    s += `<text x="${PAD_L - 6}" y="${PAD_T + PH + 4}" text-anchor="end">0</text>`;
    s += `<text x="${PAD_L - 6}" y="${PAD_T + 4}" text-anchor="end">1</text>`;

    // axis titles
    s += `<text class="ev-axis-title" x="${PAD_L + PW / 2}" y="${PAD_T + PH + 30}" text-anchor="middle">conciseness &rarr;</text>`;
    s += `<text class="ev-axis-title" x="${-(PAD_T + PH / 2)}" y="14" text-anchor="middle" transform="rotate(-90)">accuracy &rarr;</text>`;

    // frontier line (step-wise, through frontier points sorted by x)
    if (cands.length > 0) {
      const frontIdx = frontierIndices(cands);
      const frontSet = new Set(frontIdx);
      const frontPts = frontIdx.map(i => cands[i]).slice().sort((a, b) => a.x - b.x);

      if (frontPts.length >= 2) {
        // build a staircase path that traces the upper-right envelope:
        // from leftmost frontier point, go right to next x, then up to next y.
        let d = `M ${xPx(frontPts[0].x)} ${yPx(frontPts[0].y)}`;
        for (let i = 1; i < frontPts.length; i++) {
          const prev = frontPts[i - 1];
          const cur  = frontPts[i];
          // move right along previous y, then up to current y
          d += ` L ${xPx(cur.x)} ${yPx(prev.y)} L ${xPx(cur.x)} ${yPx(cur.y)}`;
        }
        s += `<path class="ev-front-line" d="${d}" fill="none" stroke="var(--accent)" stroke-width="1.6" stroke-linejoin="round" opacity="0.7"/>`;
      }

      // frontier label near the top-rightmost frontier point
      const tip = frontPts[frontPts.length - 1];
      s += `<text class="ev-front-label" x="${xPx(tip.x) - 4}" y="${yPx(tip.y) - 10}" text-anchor="end">Pareto frontier</text>`;

      // dots
      cands.forEach((c, i) => {
        const onFront = frontSet.has(i);
        const fill = onFront ? 'var(--accent)' : 'var(--text-muted)';
        const r = onFront ? 5 : 3.5;
        const op = onFront ? 1 : 0.5;
        const isNew = (i === newIndex);
        s += `<circle class="ev-dot${isNew ? ' ev-new' : ''}" cx="${xPx(c.x)}" cy="${yPx(c.y)}" r="${r}" fill="${fill}" opacity="${op}" stroke="var(--bg-elevated)" stroke-width="1.5"/>`;
        // small label, offset so it doesn't overlap the next dot
        if (onFront) {
          s += `<text class="ev-dot-label" x="${xPx(c.x) + 7}" y="${yPx(c.y) + 3}">${c.label}</text>`;
        }
      });
    } else {
      // empty-state hint
      s += `<text x="${PAD_L + PW / 2}" y="${PAD_T + PH / 2}" text-anchor="middle" fill="var(--text-muted)" font-style="italic">candidates appear as you evolve</text>`;
    }

    plotEl.innerHTML = s;
  }

  /* ---------- actions ---------- */
  function step() {
    if (stepIdx >= STEPS.length) return;
    const s = STEPS[stepIdx];
    promptLines.push(s.add);
    cands.push({ x: s.cand.x, y: s.cand.y, label: s.cand.label });
    rollouts += s.rollouts;
    stepIdx += 1;

    renderPrompt(true);
    renderReflection(s.reflection);
    renderPlot(cands.length - 1);
    renderRollouts();

    if (stepIdx >= STEPS.length) {
      evolveBtn.disabled = true;
      evolveBtn.textContent = 'Converged';
      evolveBtn.classList.remove('primary');
    }
  }

  function reset() {
    stepIdx = 0;
    promptLines = [BASE_PROMPT];
    cands.length = 0;
    rollouts = 0;
    evolveBtn.disabled = false;
    evolveBtn.innerHTML = 'Reflect &amp; evolve &#9656;';
    evolveBtn.classList.add('primary');
    renderPrompt(false);
    renderReflection(null);
    renderPlot(-1);
    renderRollouts();
  }

  /* ---------- utils ---------- */
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
  }

  /* ---------- wire up ---------- */
  evolveBtn.addEventListener('click', step);
  resetBtn.addEventListener('click', reset);

  // initial paint
  renderPrompt(false);
  renderReflection(null);
  renderPlot(-1);
  renderRollouts();
})();
