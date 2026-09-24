/* ============================================================
   Scaling laws: Kaplan (2020) vs Chinchilla (2022).
   Two power-law curves on a log-log plot, with a budget slider
   that walks a point along each curve. Same compute C, two
   different allocations between params (N) and data (D):
     Kaplan: most of C goes to N, D held modest.
     Chinchilla: N and D scale together (compute-optimal).
   The gap between the two curves is the chapter's thesis in
   one picture.
   Self-contained IIFE. Mounts into #scaling-demo.
   Plain SVG. Determinism: no randomness, fixed math.
   ============================================================ */
(function () {
  const mount = document.getElementById('scaling-demo');
  if (!mount) return;

  // ---- model: loss = A * C^(-alpha) ----
  // Compute axis in petaflop/s-days, log-spaced from 1 to 1e5.
  // GPT-3 (Kaplan-era) sat near ~3,640 pflop/s-days; Chinchilla used
  // a comparable budget but spent more of it on tokens. We use two
  // power laws with the same exponent and different prefactors so the
  // gap reflects allocation, not a fundamental change in physics.
  const ALPHA = 0.057;       // Kaplan's compute exponent, rounded
  const A_KAPLAN = 5.6;      // prefactor (tuned so curves pass through realistic points)
  const A_CHIN   = 4.85;     // Chinchilla: better allocation, lower loss at the same C
  const C_MIN = 1, C_MAX = 1e5;
  const lossOf = (A, C) => A * Math.pow(C, -ALPHA);

  // ---- scoped styles ----
  const css = `
    .sl-root { max-width: 720px; margin: 0 auto; font-family: var(--sans); }
    .sl-svg { display: block; width: 100%; height: auto; }
    .sl-axis { stroke: var(--rule-strong); stroke-width: 1; }
    .sl-grid { stroke: var(--rule); stroke-width: 1; stroke-dasharray: 2 4; }
    .sl-axis-label { font-family: var(--mono); font-size: 11px; fill: var(--text-muted); }
    .sl-tick { font-family: var(--mono); font-size: 10px; fill: var(--text-muted); }
    .sl-curve-k { fill: none; stroke: var(--accent); stroke-width: 2.5; opacity: 0.9; }
    .sl-curve-c { fill: none; stroke: var(--teal); stroke-width: 2.5; opacity: 0.95; }
    .sl-curve-label { font-family: var(--sans); font-size: 13px; font-weight: 600; }
    .sl-dot { stroke: var(--bg-surface); stroke-width: 2; }
    .sl-dot.k { fill: var(--accent); }
    .sl-dot.c { fill: var(--teal); }
    .sl-vline { stroke: var(--text-muted); stroke-width: 1; stroke-dasharray: 3 4; opacity: 0.5; }

    .sl-readout {
      display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
      margin-top: 16px;
    }
    @media (max-width: 520px) { .sl-readout { grid-template-columns: 1fr; } }
    .sl-card {
      border: 1px solid var(--rule); border-radius: 10px;
      background: var(--bg-elevated); padding: 12px 14px;
    }
    .sl-card .sl-tag {
      font-family: var(--mono); font-size: 12px;
      color: var(--text-muted); margin-bottom: 4px;
    }
    .sl-card.k .sl-tag { color: var(--accent); }
    .sl-card.c .sl-tag { color: var(--teal); }
    .sl-card .sl-loss { font-family: var(--mono); font-size: 22px; color: var(--text-primary); }
    .sl-card .sl-alloc { font-family: var(--mono); font-size: 12px; color: var(--text-secondary); margin-top: 4px; }

    .sl-controls { display: flex; align-items: center; gap: 12px; margin-top: 16px; flex-wrap: wrap; }
    .sl-controls label {
      font-family: var(--mono); font-size: 12px;
      color: var(--text-secondary);
    }
    .sl-controls input[type=range] {
      flex: 1; min-width: 200px; accent-color: var(--accent);
    }
    .sl-controls .sl-budget {
      font-family: var(--mono); font-size: 13px; color: var(--text-primary);
      min-width: 12ch; text-align: right;
    }
    .sl-gap {
      margin-top: 12px;
      font-family: var(--mono); font-size: 12px; color: var(--text-secondary);
    }
    .sl-gap strong { color: var(--pos); font-weight: 600; }
  `;
  const style = document.createElement('style'); style.textContent = css; mount.appendChild(style);

  // ---- geometry ----
  const W = 700, H = 320;
  const PAD_L = 64, PAD_R = 24, PAD_T = 24, PAD_B = 48;
  const logC = (c) => Math.log10(c);
  const xOf = (c) => PAD_L + (logC(c) - logC(C_MIN)) / (logC(C_MAX) - logC(C_MIN)) * (W - PAD_L - PAD_R);
  // Loss range: choose so both curves render legibly.
  const L_MIN = 2.0, L_MAX = 6.0;
  const yOf = (L) => PAD_T + (L_MAX - L) / (L_MAX - L_MIN) * (H - PAD_T - PAD_B);

  // ---- build SVG ----
  function curvePath(A) {
    let d = '';
    const N = 64;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const C = Math.pow(10, logC(C_MIN) + t * (logC(C_MAX) - logC(C_MIN)));
      const L = lossOf(A, C);
      d += (i === 0 ? 'M' : 'L') + xOf(C).toFixed(1) + ' ' + yOf(L).toFixed(1) + ' ';
    }
    return d;
  }

  let svg = `<svg class="sl-svg" viewBox="0 0 ${W} ${H}" role="img"
    aria-label="Log-log loss-vs-compute curve. Kaplan's allocation and Chinchilla's compute-optimal allocation. The Chinchilla curve sits below the Kaplan curve at every compute budget.">`;

  // grid + axes
  for (let e = 0; e <= 5; e++) {
    const C = Math.pow(10, e);
    svg += `<line class="sl-grid" x1="${xOf(C)}" y1="${PAD_T}" x2="${xOf(C)}" y2="${H - PAD_B}"/>`;
    svg += `<text class="sl-tick" x="${xOf(C)}" y="${H - PAD_B + 14}" text-anchor="middle">10^${e}</text>`;
  }
  for (let L = 2; L <= 6; L++) {
    svg += `<line class="sl-grid" x1="${PAD_L}" y1="${yOf(L)}" x2="${W - PAD_R}" y2="${yOf(L)}"/>`;
    svg += `<text class="sl-tick" x="${PAD_L - 8}" y="${yOf(L) + 3}" text-anchor="end">${L.toFixed(1)}</text>`;
  }
  svg += `<line class="sl-axis" x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${H - PAD_B}"/>`;
  svg += `<line class="sl-axis" x1="${PAD_L}" y1="${H - PAD_B}" x2="${W - PAD_R}" y2="${H - PAD_B}"/>`;
  svg += `<text class="sl-axis-label" x="${(PAD_L + W - PAD_R) / 2}" y="${H - 10}" text-anchor="middle">Compute C (petaflop/s-days, log)</text>`;
  svg += `<text class="sl-axis-label" x="${-((PAD_T + H - PAD_B) / 2)}" y="16" transform="rotate(-90)" text-anchor="middle">Test loss</text>`;

  // curves
  svg += `<path class="sl-curve-k" d="${curvePath(A_KAPLAN)}"/>`;
  svg += `<path class="sl-curve-c" d="${curvePath(A_CHIN)}"/>`;

  // labels at the right edge
  const Cr = C_MAX * 0.6;
  svg += `<text class="sl-curve-label" fill="var(--accent)" x="${xOf(Cr)}" y="${yOf(lossOf(A_KAPLAN, Cr)) - 8}">Kaplan allocation</text>`;
  svg += `<text class="sl-curve-label" fill="var(--teal)"   x="${xOf(Cr)}" y="${yOf(lossOf(A_CHIN,   Cr)) + 16}">Chinchilla (compute-optimal)</text>`;

  // moving probe
  svg += `<line class="sl-vline" id="sl-vline" x1="0" y1="${PAD_T}" x2="0" y2="${H - PAD_B}"/>`;
  svg += `<circle class="sl-dot k" id="sl-dot-k" r="5" cx="0" cy="0"/>`;
  svg += `<circle class="sl-dot c" id="sl-dot-c" r="5" cx="0" cy="0"/>`;

  svg += `</svg>`;

  // ---- DOM mount ----
  const root = document.createElement('div'); root.className = 'sl-root';
  root.innerHTML = svg + `
    <div class="sl-controls">
      <label for="sl-range">Compute budget</label>
      <input id="sl-range" type="range" min="0" max="100" value="58" step="1" aria-label="Compute budget in log scale"/>
      <span class="sl-budget" id="sl-budget">10^${(0.58 * 5).toFixed(2)} pflop/s-days</span>
    </div>
    <div class="sl-readout">
      <div class="sl-card k">
        <div class="sl-tag">Kaplan allocation</div>
        <div class="sl-loss" id="sl-loss-k">-</div>
        <div class="sl-alloc">spend on N &gt;&gt; D</div>
      </div>
      <div class="sl-card c">
        <div class="sl-tag">Chinchilla (compute-optimal)</div>
        <div class="sl-loss" id="sl-loss-c">-</div>
        <div class="sl-alloc">scale N and D together</div>
      </div>
    </div>
    <p class="sl-gap" id="sl-gap"></p>
  `;
  mount.appendChild(root);

  const range  = root.querySelector('#sl-range');
  const budget = root.querySelector('#sl-budget');
  const lossKEl = root.querySelector('#sl-loss-k');
  const lossCEl = root.querySelector('#sl-loss-c');
  const gapEl  = root.querySelector('#sl-gap');
  const vline  = root.querySelector('#sl-vline');
  const dotK   = root.querySelector('#sl-dot-k');
  const dotC   = root.querySelector('#sl-dot-c');

  function update() {
    const t = range.value / 100;            // 0..1
    const C = Math.pow(10, t * 5);          // 1 .. 1e5
    const lk = lossOf(A_KAPLAN, C);
    const lc = lossOf(A_CHIN,   C);
    const xc = xOf(C);
    vline.setAttribute('x1', xc); vline.setAttribute('x2', xc);
    dotK.setAttribute('cx', xc); dotK.setAttribute('cy', yOf(lk));
    dotC.setAttribute('cx', xc); dotC.setAttribute('cy', yOf(lc));
    budget.textContent = `10^${(t * 5).toFixed(2)} pflop/s-days`;
    lossKEl.textContent = lk.toFixed(3);
    lossCEl.textContent = lc.toFixed(3);
    const saved = ((lk - lc) / lk * 100);
    gapEl.innerHTML = `Same compute, two allocations: Chinchilla's curve lies <strong>${saved.toFixed(1)}% lower in loss</strong>. Read sideways: matching Kaplan's loss takes less compute when you scale data with params.`;
  }
  range.addEventListener('input', update);
  update();
})();
