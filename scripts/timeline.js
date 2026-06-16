/* ============================================================
   Two-lane timeline — the map of the whole site.
   Top lane = "weights" (align by training).
   Bottom lane = "prompt" (align by optimizing context).
   They start from a shared origin (in-context learning) and
   converge in 2026 (GEPA). Click a node for detail.
   Pure SVG, scales via viewBox. No dependencies.
   ============================================================ */
(function () {
  const mount = document.getElementById('timeline-demo');
  if (!mount) return;

  const W = 1000, H = 360;
  const Y_WEIGHTS = 96, Y_PROMPT = 250, Y_CONV = 173;
  const x = (yr) => 150 + ((yr - 2022) / (2026 - 2022)) * 770;

  // lane: 'w' weights, 'p' prompt. yr = decimal year (label placement only).
  const NODES = [
    { id: 'instructgpt', lane: 'w', yr: 2022.2, label: 'InstructGPT', year: '2022',
      detail: 'RLHF goes mainstream: supervised fine-tuning → reward model → PPO. A 1.3B aligned model was preferred over 175B GPT-3. (Ouyang et al.)' },
    { id: 'dpo', lane: 'w', yr: 2023.4, label: 'DPO', year: '2023',
      detail: 'Direct Preference Optimization drops the separate reward model — "your LM is secretly a reward model" — turning alignment into one classification loss on preference pairs. (Rafailov et al., NeurIPS 2023)' },
    { id: 'grpo', lane: 'w', yr: 2024.1, label: 'GRPO', year: '2024',
      detail: 'Group Relative Policy Optimization drops PPO’s critic: sample a group of answers, score each against the group mean. Cheap RL that powered DeepSeek-R1. (DeepSeekMath)' },
    { id: 'r1', lane: 'w', yr: 2025.05, label: 'R1 / RLVR', year: '2025',
      detail: 'Reasoning models trained with RL on verifiable rewards (RLVR). The weights lane peaks: pure RL, no human labels in the loop. (DeepSeek-R1)' },

    { id: 'ape', lane: 'p', yr: 2022.85, label: 'APE', year: '2022',
      detail: 'Automatic Prompt Engineer: let the LLM propose and score its own instructions. "LLMs are human-level prompt engineers." The prompt lane begins. (Zhou et al.)' },
    { id: 'evoprompt', lane: 'p', yr: 2023.7, label: 'EvoPrompt', year: '2023',
      detail: 'Wrap an evolutionary algorithm around an LLM: keep a population of prompts, mutate and cross them over, select the fittest. Beat human prompts by up to 25% on BBH. (Guo et al.)' },
    { id: 'dspy', lane: 'p', yr: 2024.15, label: 'DSPy / MIPROv2', year: '2024',
      detail: '"Program, don’t prompt." Declare the task; an optimizer (MIPROv2) jointly tunes the instructions AND the few-shot demos against a metric via Bayesian search. (Stanford)' },
    { id: 'drpo', lane: 'p', yr: 2024.85, label: 'DRPO', year: '2024',
      detail: 'Dynamic Rewarding with Prompt Optimization: tuning-free self-alignment by searching the prompt. Base models + DRPO beat their own SFT/RLHF versions. (Singla et al., EMNLP 2024)' },

    { id: 'gepa', lane: 'c', yr: 2026.0, label: 'GEPA', year: '2026',
      detail: 'Reflective prompt evolution: read WHY each attempt failed, propose targeted edits, keep a Pareto frontier of winners. Matches RL with up to 35× fewer rollouts. The lanes meet. (ICLR 2026, oral)' },
  ];

  const yOf = (n) => n.lane === 'w' ? Y_WEIGHTS : n.lane === 'p' ? Y_PROMPT : Y_CONV;

  // ---- build SVG ----
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Timeline of weights-based and prompt-based LLM alignment, 2022 to 2026">`;

  // defs: convergence gradient
  s += `<defs><linearGradient id="tlconv" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="var(--accent)"/><stop offset="1" stop-color="var(--teal)"/>
  </linearGradient></defs>`;

  // lane baselines
  s += `<line x1="120" y1="${Y_WEIGHTS}" x2="${x(2025.05)}" y2="${Y_WEIGHTS}" stroke="var(--rule-strong)" stroke-width="1.5"/>`;
  s += `<line x1="120" y1="${Y_PROMPT}" x2="${x(2024.85)}" y2="${Y_PROMPT}" stroke="var(--rule-strong)" stroke-width="1.5"/>`;

  // lane labels
  s += `<text class="tl-lane-label" x="120" y="${Y_WEIGHTS - 40}" fill="var(--accent)">Weights &mdash; align by training</text>`;
  s += `<text class="tl-lane-label" x="120" y="${Y_PROMPT + 52}" fill="var(--teal)">Prompt &mdash; align by optimizing context</text>`;

  // shared origin marker
  s += `<text class="tl-year" x="120" y="${Y_CONV - 6}" text-anchor="start">origin: in-context learning (GPT-3, 2020) &rarr; chain-of-thought (2022)</text>`;
  s += `<path d="M120 ${Y_CONV + 4} C 135 ${Y_WEIGHTS}, 135 ${Y_WEIGHTS}, 150 ${Y_WEIGHTS}" fill="none" stroke="var(--rule-strong)" stroke-width="1.5"/>`;
  s += `<path d="M120 ${Y_CONV + 4} C 135 ${Y_PROMPT}, 135 ${Y_PROMPT}, 150 ${Y_PROMPT}" fill="none" stroke="var(--rule-strong)" stroke-width="1.5"/>`;

  // convergence paths into GEPA
  const gx = x(2026.0);
  s += `<path d="M${x(2025.05)} ${Y_WEIGHTS} C ${gx - 60} ${Y_WEIGHTS}, ${gx - 60} ${Y_CONV}, ${gx} ${Y_CONV}" fill="none" stroke="url(#tlconv)" stroke-width="2" stroke-dasharray="3 4" opacity="0.8"/>`;
  s += `<path d="M${x(2024.85)} ${Y_PROMPT} C ${gx - 60} ${Y_PROMPT}, ${gx - 60} ${Y_CONV}, ${gx} ${Y_CONV}" fill="none" stroke="url(#tlconv)" stroke-width="2" stroke-dasharray="3 4" opacity="0.8"/>`;

  // year ticks
  for (let yr = 2022; yr <= 2026; yr++) {
    s += `<line x1="${x(yr)}" y1="318" x2="${x(yr)}" y2="324" stroke="var(--rule)"/>`;
    s += `<text class="tl-year" x="${x(yr)}" y="338" text-anchor="middle">${yr}</text>`;
  }

  // nodes
  NODES.forEach(n => {
    const nx = x(n.yr), ny = yOf(n);
    const color = n.lane === 'w' ? 'var(--accent)' : n.lane === 'p' ? 'var(--teal)' : 'url(#tlconv)';
    const above = n.lane === 'w';                       // weights labels above, prompt below
    const ly = above ? ny - 16 : ny + 24;
    const big = n.lane === 'c';
    s += `<g class="tl-node" data-id="${n.id}" tabindex="0">
      <circle cx="${nx}" cy="${ny}" r="${big ? 8 : 6}" fill="${color}" stroke="var(--bg-surface)" stroke-width="2"/>
      <text x="${nx}" y="${ly}" text-anchor="middle" ${big ? 'font-weight="700"' : ''}>${n.label}</text>
    </g>`;
  });

  s += `</svg>`;

  mount.innerHTML =
    `<div class="timeline">${s}</div>
     <div class="tl-detail" id="tl-detail">
       <p class="placeholder">Click any milestone to read what it changed. Notice the two lanes start from the same origin and meet again in 2026.</p>
     </div>`;

  // ---- interaction ----
  const detail = mount.querySelector('#tl-detail');
  const byId = Object.fromEntries(NODES.map(n => [n.id, n]));
  const select = (id) => {
    const n = byId[id]; if (!n) return;
    mount.querySelectorAll('.tl-node').forEach(g => g.classList.toggle('sel', g.dataset.id === id));
    detail.innerHTML = `<div class="y">${n.year}</div><h4>${n.label}</h4><p>${n.detail}</p>`;
  };
  mount.querySelectorAll('.tl-node').forEach(g => {
    g.addEventListener('click', () => select(g.dataset.id));
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(g.dataset.id); } });
  });
})();
