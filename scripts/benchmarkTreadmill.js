/* ============================================================
   Benchmark treadmill - each row is one benchmark plotted from
   its launch date and launch-report SOTA to its current status.
   The point of the picture is the *slope*: how quickly a
   benchmark loses signal after publication. Older benchmarks
   climb a wall; recent ones sit near the floor and started
   climbing on their launch year.

   Every launch-year and launch-SOTA below is from the primary
   source cited in the chapter, not inferred.

   Self-contained IIFE. Mounts into #treadmill-demo. Plain SVG.
   Determinism: fixed data, no randomness, no Date.now().
   ============================================================ */
(function () {
  const mount = document.getElementById('treadmill-demo');
  if (!mount) return;

  // Each entry: benchmark launch (year, SOTA at launch report), plus a
  // "now" point that is either the widely-reported saturation range or
  // a hedged "still climbing" marker. See prose for citations.
  const BENCHES = [
    {
      id: 'mmlu',
      label: 'MMLU',
      family: 'knowledge',
      launchYear: 2020.75,   // Hendrycks et al., Sep 2020
      launchScore: 43.9,     // GPT-3 few-shot, per Hendrycks 2020
      nowYear: 2024.5,
      nowScore: 90,          // saturated across frontier models by mid-2024
      humanExpert: 89.8,     // Hendrycks 2020 (est. human expert accuracy)
      status: 'saturated',
      what: '57 subjects, 4-way multiple choice.',
      note: 'Frontier scores crossed the 90% expert-baseline in 2024; the benchmark stopped separating models.',
      labelDy: 0,
    },
    {
      id: 'gsm8k',
      label: 'GSM8K',
      family: 'math',
      launchYear: 2021.83,   // Cobbe et al., Oct 2021
      launchScore: 55,       // GPT-3 6B + verifier, per Cobbe 2021
      nowYear: 2024,
      nowScore: 96,          // saturated on frontier reports through 2024
      humanExpert: null,
      status: 'saturated',
      what: '8.5k grade-school word problems.',
      note: 'A once-serious math bench that frontier models now clear near-perfectly.',
      labelDy: -12,
    },
    {
      id: 'humaneval',
      label: 'HumanEval',
      family: 'code',
      launchYear: 2021.58,   // Chen et al., Jul 2021
      launchScore: 28.8,     // Codex 12B pass@1
      nowYear: 2024,
      nowScore: 96,
      humanExpert: null,
      status: 'saturated',
      what: '164 hand-written Python problems.',
      note: 'Kept as a smoke test, not a leaderboard axis.',
      labelDy: 2,
    },
    {
      id: 'gpqa-diamond',
      label: 'GPQA Diamond',
      family: 'knowledge',
      launchYear: 2023.92,   // Rein et al., Nov 2023
      launchScore: 39,       // GPT-4 zero-shot, per Rein 2023
      nowYear: 2025.5,
      nowScore: 85,          // reasoning models regularly above 80 in 2025
      humanExpert: 65,       // PhD experts in-domain
      status: 'climbing',
      what: '198 hardest graduate-level physics, chem, biology MCQs.',
      note: 'Reasoning models crossed the PhD-expert baseline by 2025.',
      labelDy: 8,
    },
    {
      id: 'swe-bench-verified',
      label: 'SWE-bench Verified',
      family: 'code',
      launchYear: 2024.62,   // OpenAI, Aug 2024
      launchScore: 33.2,     // baseline in the launch post
      nowYear: 2025.75,
      nowScore: 70,          // frontier launches quote 60-75 range
      humanExpert: null,
      status: 'climbing',
      what: '500 vetted GitHub issues, execution-graded.',
      note: 'Shipped a year ago; frontier launches now quote 60-75% routinely.',
      labelDy: 0,
    },
    {
      id: 'swe-bench-pro',
      label: 'SWE-bench Pro',
      family: 'code',
      launchYear: 2025.75,   // Scale, Sep 2025
      launchScore: 23.3,     // GPT-5 in the release
      nowYear: 2026.5,
      nowScore: 30,
      humanExpert: null,
      status: 'open',
      what: 'GPL + held-out + commercial repos, contamination-resistant.',
      note: 'A response to Verified having become quotable-in-a-launch-post. Still open.',
      labelDy: -10,
    },
    {
      id: 'aime',
      label: 'AIME (as LM bench)',
      family: 'math',
      launchYear: 2024,      // adopted as an LLM eval widely in 2024
      launchScore: 13,       // pre-reasoning-era frontier models
      nowYear: 2025.5,
      nowScore: 90,          // reasoning models routinely 80-95
      humanExpert: null,
      status: 'saturating',
      what: '15 short-answer competition problems per year.',
      note: 'Went from a stretch bench to a warm-up in one release cycle after o1 and R1.',
      labelDy: -6,
    },
    {
      id: 'frontiermath',
      label: 'FrontierMath',
      family: 'math',
      launchYear: 2024.83,   // Epoch, Nov 2024
      launchScore: 2,        // <2% at launch across frontier models
      nowYear: 2026.5,
      nowScore: 40,          // 50%+ on Tier 1-3 by mid-2026 per Epoch
      humanExpert: null,
      status: 'climbing',
      what: 'Novel unpublished problems, hours-to-days for expert mathematicians.',
      note: 'Built specifically so a 2024 launch would not saturate in 12 months. It nearly did anyway.',
      labelDy: 0,
    },
    {
      id: 'hle',
      label: 'Humanity’s Last Exam',
      family: 'knowledge',
      launchYear: 2025.08,   // CAIS + Scale, Jan 2025
      launchScore: 9,        // best frontier at launch
      nowYear: 2026.5,
      nowScore: 30,
      humanExpert: null,
      status: 'open',
      what: '2,500 expert-written questions across 100+ subjects.',
      note: 'Explicitly named for what it is: the last exam that could be assembled before its cohort saturates it too.',
      labelDy: 8,
    },
    {
      id: 'arc-agi-2',
      label: 'ARC-AGI-2',
      family: 'reasoning',
      launchYear: 2025.23,   // Chollet, Mar 2025
      launchScore: 3,        // 0-4% at launch, per Chollet
      nowYear: 2026.5,
      nowScore: 15,
      humanExpert: 60,       // human panel baseline in the launch report
      status: 'open',
      what: 'Novel visual reasoning puzzles designed against brute-force search.',
      note: 'Chollet’s answer to ARC-AGI-1 falling to o3 in late 2024. Still low for models.',
      labelDy: 4,
    },
  ];

  const FAMILY_COLOR = {
    knowledge: 'var(--blue)',
    math: 'var(--purple)',
    code: 'var(--teal)',
    reasoning: 'var(--amber)',
  };

  const css = `
    .bt-root { max-width: 760px; margin: 0 auto; font-family: var(--sans); }
    .bt-controls { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
    .bt-chip {
      font-family: var(--mono); font-size: 11px;
      padding: 5px 9px; border: 1px solid var(--rule);
      background: var(--bg-elevated); color: var(--text-secondary);
      border-radius: 999px; cursor: pointer;
    }
    .bt-chip.active { background: var(--accent-light); color: var(--accent);
      border-color: var(--accent-border); }
    .bt-svg { display: block; width: 100%; height: auto; }
    .bt-axis { stroke: var(--rule-strong); stroke-width: 1; }
    .bt-grid { stroke: var(--rule); stroke-width: 1; stroke-dasharray: 2 4; }
    .bt-tick { font-family: var(--mono); font-size: 10px; fill: var(--text-muted); }
    .bt-axis-label { font-family: var(--mono); font-size: 10px; fill: var(--text-muted); }
    .bt-line { fill: none; stroke-width: 2; opacity: 0.55; }
    .bt-line.dim { opacity: 0.14; }
    .bt-line.active { opacity: 1; stroke-width: 2.75; }
    .bt-dot { stroke: var(--bg-surface); stroke-width: 1.25; }
    .bt-dot.dim { opacity: 0.18; }
    .bt-dot.active { stroke-width: 2; }
    .bt-label { font-family: var(--sans); font-size: 11.5px; fill: var(--text-secondary);
      pointer-events: none; }
    .bt-label.active { fill: var(--text-primary); font-weight: 600; }
    .bt-label.dim { opacity: 0.28; }
    .bt-human { stroke: var(--text-muted); stroke-width: 1; stroke-dasharray: 3 3; opacity: 0.5; }
    .bt-readout {
      margin-top: 14px; border: 1px solid var(--rule); border-radius: 10px;
      background: var(--bg-elevated); padding: 12px 14px;
      min-height: 96px;
    }
    .bt-readout .bt-r-title {
      font-family: var(--sans); font-size: 15px; font-weight: 600;
      color: var(--text-primary); margin-bottom: 2px;
    }
    .bt-readout .bt-r-sub {
      font-family: var(--mono); font-size: 11px; color: var(--text-muted);
      margin-bottom: 8px;
    }
    .bt-readout .bt-r-what { font-size: 14px; color: var(--text-secondary); margin: 0 0 6px 0; }
    .bt-readout .bt-r-note { font-size: 13.5px; color: var(--text-secondary); margin: 0; }
    .bt-readout .bt-r-stats { display: flex; gap: 18px; margin-top: 8px;
      font-family: var(--mono); font-size: 12px; color: var(--text-muted); }
    .bt-readout .bt-r-stats strong { color: var(--text-primary); font-weight: 600; }
    .bt-status-open { color: var(--pos); }
    .bt-status-saturated { color: var(--neg); }
    .bt-status-climbing, .bt-status-saturating { color: var(--amber); }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  mount.appendChild(styleEl);

  const root = document.createElement('div');
  root.className = 'bt-root';
  mount.appendChild(root);

  // ---- legend / family chips (all-on by default; click to filter) ----
  const controls = document.createElement('div');
  controls.className = 'bt-controls';
  const families = ['knowledge', 'math', 'code', 'reasoning'];
  const active = new Set(families);
  let hoverId = null;
  families.forEach((f) => {
    const chip = document.createElement('button');
    chip.className = 'bt-chip active';
    chip.dataset.family = f;
    chip.textContent = f;
    chip.style.borderColor = 'var(--rule)';
    chip.addEventListener('click', () => {
      if (active.has(f)) { active.delete(f); chip.classList.remove('active'); }
      else { active.add(f); chip.classList.add('active'); }
      render();
    });
    controls.appendChild(chip);
  });
  root.appendChild(controls);

  // ---- svg scaffold ----
  const W = 760, H = 380;
  const M = { l: 44, r: 90, t: 14, b: 34 };
  const X0 = 2020, X1 = 2027;
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('class', 'bt-svg');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Benchmark treadmill: launch score to current score for major LLM benchmarks 2020-2026.');
  root.appendChild(svg);

  const x = (year) => M.l + (year - X0) / (X1 - X0) * (W - M.l - M.r);
  const y = (score) => H - M.b - (score / 100) * (H - M.t - M.b);

  // grid
  [0, 25, 50, 75, 100].forEach((s) => {
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', M.l); line.setAttribute('x2', W - M.r);
    line.setAttribute('y1', y(s)); line.setAttribute('y2', y(s));
    line.setAttribute('class', 'bt-grid');
    svg.appendChild(line);
    const t = document.createElementNS(svgNS, 'text');
    t.setAttribute('x', M.l - 8); t.setAttribute('y', y(s) + 3);
    t.setAttribute('text-anchor', 'end');
    t.setAttribute('class', 'bt-tick');
    t.textContent = s + '%';
    svg.appendChild(t);
  });
  // x ticks
  for (let yr = X0; yr <= X1; yr++) {
    const t = document.createElementNS(svgNS, 'text');
    t.setAttribute('x', x(yr)); t.setAttribute('y', H - M.b + 16);
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('class', 'bt-tick');
    t.textContent = yr;
    svg.appendChild(t);
  }
  // axes
  const axX = document.createElementNS(svgNS, 'line');
  axX.setAttribute('x1', M.l); axX.setAttribute('x2', W - M.r);
  axX.setAttribute('y1', H - M.b); axX.setAttribute('y2', H - M.b);
  axX.setAttribute('class', 'bt-axis'); svg.appendChild(axX);
  const axY = document.createElementNS(svgNS, 'line');
  axY.setAttribute('x1', M.l); axY.setAttribute('x2', M.l);
  axY.setAttribute('y1', M.t); axY.setAttribute('y2', H - M.b);
  axY.setAttribute('class', 'bt-axis'); svg.appendChild(axY);

  const axLabelY = document.createElementNS(svgNS, 'text');
  axLabelY.setAttribute('x', M.l + 4); axLabelY.setAttribute('y', M.t - 2);
  axLabelY.setAttribute('class', 'bt-axis-label');
  axLabelY.textContent = 'score';
  svg.appendChild(axLabelY);

  // group per benchmark
  const gLayer = document.createElementNS(svgNS, 'g');
  svg.appendChild(gLayer);

  const geoms = BENCHES.map((b) => {
    const g = document.createElementNS(svgNS, 'g');
    g.dataset.id = b.id;
    g.style.cursor = 'pointer';
    g.setAttribute('pointer-events', 'bounding-box');
    const color = FAMILY_COLOR[b.family];
    // line launch -> now
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', x(b.launchYear));
    line.setAttribute('y1', y(b.launchScore));
    line.setAttribute('x2', x(b.nowYear));
    line.setAttribute('y2', y(b.nowScore));
    line.setAttribute('stroke', color);
    line.setAttribute('class', 'bt-line');
    g.appendChild(line);
    // launch dot
    const dot1 = document.createElementNS(svgNS, 'circle');
    dot1.setAttribute('cx', x(b.launchYear));
    dot1.setAttribute('cy', y(b.launchScore));
    dot1.setAttribute('r', 3.5);
    dot1.setAttribute('fill', color);
    dot1.setAttribute('class', 'bt-dot');
    g.appendChild(dot1);
    // current dot (open circle for "open", filled for the rest)
    const dot2 = document.createElementNS(svgNS, 'circle');
    dot2.setAttribute('cx', x(b.nowYear));
    dot2.setAttribute('cy', y(b.nowScore));
    dot2.setAttribute('r', 4.5);
    dot2.setAttribute('fill', b.status === 'open' ? 'var(--bg-surface)' : color);
    dot2.setAttribute('stroke', color);
    dot2.setAttribute('class', 'bt-dot');
    g.appendChild(dot2);
    // label (labelDy in pixels: nudge to avoid collisions)
    const lbl = document.createElementNS(svgNS, 'text');
    lbl.setAttribute('x', x(b.nowYear) + 8);
    lbl.setAttribute('y', y(b.nowScore) + 3 + (b.labelDy || 0));
    lbl.setAttribute('class', 'bt-label');
    lbl.textContent = b.label;
    g.appendChild(lbl);

    g.addEventListener('mouseenter', () => { hoverId = b.id; render(); setReadout(b); });
    g.addEventListener('mouseleave', () => { hoverId = null; render(); });
    g.addEventListener('click', () => { setReadout(b); });
    // enlarge invisible hit target on the "now" dot for mobile taps
    const hit = document.createElementNS(svgNS, 'circle');
    hit.setAttribute('cx', x(b.nowYear));
    hit.setAttribute('cy', y(b.nowScore));
    hit.setAttribute('r', 10);
    hit.setAttribute('fill', 'transparent');
    hit.style.cursor = 'pointer';
    g.appendChild(hit);

    gLayer.appendChild(g);
    return { b, g, line, dot1, dot2, lbl };
  });

  // readout box
  const readout = document.createElement('div');
  readout.className = 'bt-readout';
  root.appendChild(readout);

  function setReadout(b) {
    const statusClass = 'bt-status-' + b.status;
    readout.innerHTML = `
      <div class="bt-r-title">${b.label}</div>
      <div class="bt-r-sub">${b.family} · launched ${Math.floor(b.launchYear)}</div>
      <p class="bt-r-what">${b.what}</p>
      <p class="bt-r-note">${b.note}</p>
      <div class="bt-r-stats">
        <span>launch SOTA <strong>${b.launchScore}%</strong></span>
        <span>current <strong>~${b.nowScore}%</strong></span>
        <span>status <strong class="${statusClass}">${b.status}</strong></span>
      </div>
    `;
  }
  setReadout(BENCHES[0]);

  function render() {
    geoms.forEach(({ b, g, line, dot1, dot2, lbl }) => {
      const on = active.has(b.family);
      const isHover = hoverId === b.id;
      const dim = !on || (hoverId && !isHover);
      line.classList.toggle('dim', dim);
      line.classList.toggle('active', on && isHover);
      dot1.classList.toggle('dim', dim);
      dot1.classList.toggle('active', on && isHover);
      dot2.classList.toggle('dim', dim);
      dot2.classList.toggle('active', on && isHover);
      lbl.classList.toggle('dim', dim);
      lbl.classList.toggle('active', on && isHover);
    });
  }
  render();
})();
