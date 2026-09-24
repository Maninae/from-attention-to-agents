/* ============================================================
   Test-time compute: the AIME 2024 step curve.
   o1's own headline numbers: 74 (pass@1) -> 83 (cons@64) ->
   93 (re-ranked@1000). Same weights every step; the only thing
   that changes is how much compute is spent at inference.
   We draw a stepped bar chart with the three regimes; clicking
   a regime explains what it bought.
   Self-contained IIFE. Mounts into #ttc-demo.
   Plain SVG. Determinism: fixed data, no randomness.
   Source: openai.com/index/learning-to-reason-with-llms (Sept 2024).
   ============================================================ */
(function () {
  const mount = document.getElementById('ttc-demo');
  if (!mount) return;

  const REGIMES = [
    {
      id: 'pass1',
      label: 'pass@1',
      cost: '1 sample',
      score: 74,
      detail: 'One reasoning trace, one answer. The first knob is letting the model think, with no test-time search and no voting. 74% on AIME 2024 already exceeds most pre-o1 model families combined.',
    },
    {
      id: 'cons64',
      label: 'cons@64',
      cost: '64 samples · majority vote',
      score: 83,
      detail: 'Sample 64 independent reasoning traces and take the most-common final answer (self-consistency). Cheap, no extra model, +9 points over a single sample. The improvement is the variance reduction of independent attempts agreeing.',
    },
    {
      id: 'rerank1000',
      label: 're-ranked@1000',
      cost: '1000 samples · learned scorer',
      score: 93,
      detail: '1,000 candidates ranked by a learned scoring function. The model still hasn’t changed, and the inference compute is now ~1000× a single pass-through, yet the curve hasn’t flattened. This is what "test-time compute is a scaling axis" looks like as a picture.',
    },
  ];

  const css = `
    .ttc-root { max-width: 720px; margin: 0 auto; font-family: var(--sans); }
    .ttc-svg { display: block; width: 100%; height: auto; }
    .ttc-axis { stroke: var(--rule-strong); stroke-width: 1; }
    .ttc-grid { stroke: var(--rule); stroke-width: 1; stroke-dasharray: 2 4; }
    .ttc-tick { font-family: var(--mono); font-size: 10px; fill: var(--text-muted); }
    .ttc-axis-label { font-family: var(--mono); font-size: 11px; fill: var(--text-muted); }

    .ttc-bar {
      cursor: pointer;
      transition: opacity 0.15s;
    }
    .ttc-bar rect { transition: fill 0.15s, stroke 0.15s, stroke-width 0.15s; }
    .ttc-bar:hover rect, .ttc-bar.sel rect { fill: var(--accent); }
    .ttc-bar:focus-visible rect, .ttc-bar.sel rect {
      stroke: var(--text-primary); stroke-width: 1.5;
    }

    .ttc-step { stroke: var(--accent); stroke-width: 2; fill: none;
      stroke-dasharray: 4 4; opacity: 0.55; }
    .ttc-pt { fill: var(--accent); stroke: var(--bg-surface); stroke-width: 2; }
    .ttc-pt-label { font-family: var(--mono); font-size: 12px; fill: var(--text-primary);
      font-weight: 600; }
    .ttc-base { font-family: var(--mono); font-size: 11px; fill: var(--text-muted); }

    .ttc-detail {
      margin-top: 18px;
      border-top: 1px solid var(--rule);
      padding-top: 14px;
      min-height: 80px;
    }
    .ttc-detail h4 { margin: 0 0 6px; font-size: 17px; color: var(--text-primary); }
    .ttc-detail h4 .cost { color: var(--text-muted); font-weight: 400; font-size: 14px; }
    .ttc-detail p { margin: 0; color: var(--text-secondary); font-size: 15px; }
    .ttc-detail .placeholder { color: var(--text-muted); font-style: italic; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  mount.appendChild(style);

  // ---- geometry ----
  const W = 700, H = 320;
  const PAD_L = 56, PAD_R = 24, PAD_T = 24, PAD_B = 64;
  const Y_MIN = 0, Y_MAX = 100;
  const xOf = (i) => PAD_L + (i + 0.5) * ((W - PAD_L - PAD_R) / REGIMES.length);
  const yOf = (v) => PAD_T + (Y_MAX - v) / (Y_MAX - Y_MIN) * (H - PAD_T - PAD_B);
  const barW = ((W - PAD_L - PAD_R) / REGIMES.length) * 0.46;

  // ---- build SVG ----
  let s = `<svg class="ttc-svg" viewBox="0 0 ${W} ${H}" role="img"
    aria-label="AIME 2024 accuracy at three inference-compute regimes for OpenAI o1">`;

  // y-axis + grid
  s += `<line class="ttc-axis" x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${H - PAD_B}"/>`;
  s += `<line class="ttc-axis" x1="${PAD_L}" y1="${H - PAD_B}" x2="${W - PAD_R}" y2="${H - PAD_B}"/>`;
  for (let v = 0; v <= 100; v += 25) {
    const y = yOf(v);
    if (v > 0) s += `<line class="ttc-grid" x1="${PAD_L}" y1="${y}" x2="${W - PAD_R}" y2="${y}"/>`;
    s += `<text class="ttc-tick" x="${PAD_L - 8}" y="${y + 4}" text-anchor="end">${v}%</text>`;
  }
  s += `<text class="ttc-axis-label" x="${PAD_L}" y="${PAD_T - 8}">AIME 2024 accuracy</text>`;
  s += `<text class="ttc-axis-label" x="${W / 2}" y="${H - 8}" text-anchor="middle">inference compute &rarr;</text>`;

  // human baseline annotation (top quartile of AIME-qualifying high school is around 8/15 ~ 53%)
  const yBase = yOf(53);
  s += `<line class="ttc-grid" x1="${PAD_L}" y1="${yBase}" x2="${W - PAD_R}" y2="${yBase}"
    stroke="var(--teal)" stroke-dasharray="1 4" opacity="0.5"/>`;
  s += `<text class="ttc-base" x="${W - PAD_R - 4}" y="${yBase - 6}" text-anchor="end">
    AIME qualifier ~ top-quartile high-schooler (~53%)</text>`;

  // step line connecting the tops of the bars
  let stepPath = '';
  REGIMES.forEach((r, i) => {
    const x = xOf(i), y = yOf(r.score);
    if (i === 0) stepPath += `M ${PAD_L + 6} ${y} L ${x} ${y}`;
    else {
      const prevY = yOf(REGIMES[i - 1].score);
      stepPath += ` L ${x - 30} ${prevY} L ${x - 30} ${y} L ${x} ${y}`;
    }
  });
  // extend the step a bit beyond the last bar
  const lastX = xOf(REGIMES.length - 1);
  stepPath += ` L ${lastX + 30} ${yOf(REGIMES[REGIMES.length - 1].score)}`;
  s += `<path class="ttc-step" d="${stepPath}"/>`;

  // bars
  REGIMES.forEach((r, i) => {
    const x = xOf(i), y = yOf(r.score);
    const bx = x - barW / 2;
    const bh = (H - PAD_B) - y;
    s += `<g class="ttc-bar" data-id="${r.id}" tabindex="0">
      <rect x="${bx}" y="${y}" width="${barW}" height="${bh}"
            rx="3" fill="var(--accent-border)" stroke="transparent"/>
      <text class="ttc-pt-label" x="${x}" y="${y - 8}" text-anchor="middle">${r.score}%</text>
      <text class="ttc-tick" x="${x}" y="${H - PAD_B + 18}" text-anchor="middle"
            font-family="var(--mono)" font-size="12" fill="var(--text-primary)">${r.label}</text>
      <text class="ttc-tick" x="${x}" y="${H - PAD_B + 34}" text-anchor="middle">${r.cost}</text>
    </g>`;
  });

  s += `</svg>`;

  mount.innerHTML =
    `<div class="ttc-root">${s}
      <div class="ttc-detail" id="ttc-detail">
        <p class="placeholder">Click a regime above. Same model, same problem set, only the inference budget changes.</p>
      </div>
    </div>`;

  const detail = mount.querySelector('#ttc-detail');
  const byId = Object.fromEntries(REGIMES.map(r => [r.id, r]));
  const select = (id) => {
    const r = byId[id]; if (!r) return;
    mount.querySelectorAll('.ttc-bar').forEach(g =>
      g.classList.toggle('sel', g.dataset.id === id));
    detail.innerHTML =
      `<h4>${r.label} &middot; ${r.score}% on AIME 2024 <span class="cost">(${r.cost})</span></h4>
       <p>${r.detail}</p>`;
  };
  mount.querySelectorAll('.ttc-bar').forEach(g => {
    g.addEventListener('click', () => select(g.dataset.id));
    g.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(g.dataset.id); }
    });
  });
})();
