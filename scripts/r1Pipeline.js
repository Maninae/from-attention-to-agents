/* ============================================================
   R1 training pipeline: V3-Base through to R1.
   The full DeepSeek-R1 paper (arXiv 2501.12948) describes a
   multi-stage recipe: cold-start SFT, reasoning RL with a
   verifier + language-consistency reward, then SFT, then
   preference RL. We render it as a horizontal stage diagram,
   each box clickable for one-line description.
   Self-contained IIFE. Mounts into #pipe-demo.
   Plain SVG. Determinism: fixed data.
   Source: arXiv 2501.12948; Nature s41586-025-09422-z.
   ============================================================ */
(function () {
  const mount = document.getElementById('pipe-demo');
  if (!mount) return;

  const STAGES = [
    {
      id: 'base',
      label: 'V3-Base',
      sub: '671B MoE · ~37B active',
      kind: 'base',
      detail: 'DeepSeek-V3-Base: the pretrained Mixture-of-Experts foundation. Trained with no human-labeled reasoning data; pure next-token prediction. Capable but not a reasoner yet.',
    },
    {
      id: 'sft1',
      label: 'Cold-start SFT',
      sub: 'curated CoT traces',
      kind: 'sft',
      detail: 'A small supervised fine-tune on a few thousand long-CoT examples: enough structure to stop RL from collapsing into junk format. R1-Zero skips this step and shows reasoning emerges anyway, but pays in legibility (language mixing, repetition).',
    },
    {
      id: 'rl1',
      label: 'Reasoning RL',
      sub: 'GRPO + verifier + lang reward',
      kind: 'rl',
      detail: 'The core step. GRPO samples a group of answers per problem, rewards each by (a) does the math/code verifier pass and (b) language-consistency. Group-mean reward is the baseline; no critic, no learned reward model. This is where the "Wait..." behavior emerges.',
    },
    {
      id: 'sft2',
      label: 'SFT on rejection-sampled traces',
      sub: '~800K curated samples',
      kind: 'sft',
      detail: 'Sample many reasoning traces from the RL checkpoint, keep the ones whose final answer the verifier accepts (rejection sampling), and SFT on them. Cleans up the model and broadens it beyond pure math/code with general-domain data.',
    },
    {
      id: 'rl2',
      label: 'Preference RL',
      sub: 'helpfulness + harmlessness',
      kind: 'rl',
      detail: 'A final RL pass on human-preference signals for helpfulness and harmlessness, in the spirit of Ch 2 RLHF. This is what turns R1 from a math-and-code savant into a deployable chat model.',
    },
    {
      id: 'r1',
      label: 'R1',
      sub: 'MIT-licensed, open weights',
      kind: 'final',
      detail: 'DeepSeek-R1: released January 22, 2025 with full weights on HuggingFace. Distilled siblings (1.5B / 7B / 14B / 32B / 70B on Qwen2.5 and Llama-3 bases) ship the recipe to consumer hardware within the same week.',
    },
  ];

  const css = `
    .pipe-root { max-width: 760px; margin: 0 auto; font-family: var(--sans); }
    .pipe-svg { display: block; width: 100%; height: auto; }
    .pipe-stage { cursor: pointer; }
    .pipe-box {
      transition: fill 0.15s, stroke 0.15s, stroke-width 0.15s;
    }
    .pipe-stage:hover .pipe-box, .pipe-stage.sel .pipe-box {
      stroke: var(--accent); stroke-width: 2;
    }
    .pipe-stage:focus-visible .pipe-box {
      stroke: var(--accent); stroke-width: 2;
    }
    .pipe-label { font-family: var(--sans); font-weight: 600; font-size: 13px;
      fill: var(--text-primary); }
    .pipe-sub { font-family: var(--mono); font-size: 10.5px;
      fill: var(--text-secondary); }
    .pipe-arrow { fill: var(--text-muted); }

    .pipe-detail {
      margin-top: 18px;
      border-top: 1px solid var(--rule);
      padding-top: 14px;
      min-height: 72px;
    }
    .pipe-detail h4 { margin: 0 0 6px; font-size: 17px; color: var(--text-primary); }
    .pipe-detail h4 .sub { color: var(--text-muted); font-weight: 400; font-size: 14px; font-family: var(--mono); }
    .pipe-detail p { margin: 0; color: var(--text-secondary); font-size: 15px; }
    .pipe-detail .placeholder { color: var(--text-muted); font-style: italic; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  mount.appendChild(style);

  // ---- layout ----
  // 3 stages per row, two rows on wide; we will use one long row and rely
  // on responsive viewBox scaling for narrow screens.
  const W = 980, H = 260;
  const Y = 90, BOX_H = 86;
  const COLS = STAGES.length;
  const PAD_X = 24;
  const cellW = (W - PAD_X * 2) / COLS;
  const BOX_W = cellW - 28;

  const fillFor = (kind) => {
    if (kind === 'base') return 'var(--bg-elevated)';
    if (kind === 'sft') return 'color-mix(in srgb, var(--blue) 10%, var(--bg-elevated))';
    if (kind === 'rl') return 'color-mix(in srgb, var(--accent) 12%, var(--bg-elevated))';
    if (kind === 'final') return 'color-mix(in srgb, var(--green) 12%, var(--bg-elevated))';
    return 'var(--bg-elevated)';
  };
  const strokeFor = (kind) => {
    if (kind === 'base') return 'var(--rule-strong)';
    if (kind === 'sft') return 'var(--blue)';
    if (kind === 'rl') return 'var(--accent)';
    if (kind === 'final') return 'var(--pos)';
    return 'var(--rule-strong)';
  };

  let s = `<svg class="pipe-svg" viewBox="0 0 ${W} ${H}" role="img"
    aria-label="DeepSeek-R1 training pipeline, six stages from V3-Base to R1">`;

  // arrows connecting stages
  for (let i = 0; i < COLS - 1; i++) {
    const x1 = PAD_X + i * cellW + (cellW - BOX_W) / 2 + BOX_W;
    const x2 = PAD_X + (i + 1) * cellW + (cellW - BOX_W) / 2;
    const yMid = Y + BOX_H / 2;
    s += `<line x1="${x1}" y1="${yMid}" x2="${x2 - 8}" y2="${yMid}"
      stroke="var(--text-muted)" stroke-width="1.5"/>`;
    s += `<polygon class="pipe-arrow" points="${x2 - 8},${yMid - 4} ${x2},${yMid} ${x2 - 8},${yMid + 4}"/>`;
  }

  // stage boxes
  STAGES.forEach((st, i) => {
    const bx = PAD_X + i * cellW + (cellW - BOX_W) / 2;
    s += `<g class="pipe-stage" data-id="${st.id}" tabindex="0">
      <rect class="pipe-box" x="${bx}" y="${Y}" width="${BOX_W}" height="${BOX_H}"
            rx="8" fill="${fillFor(st.kind)}" stroke="${strokeFor(st.kind)}" stroke-width="1"/>
      <text class="pipe-label" x="${bx + BOX_W / 2}" y="${Y + 32}" text-anchor="middle">${st.label}</text>
      <text class="pipe-sub" x="${bx + BOX_W / 2}" y="${Y + 54}" text-anchor="middle">${st.sub}</text>
      <text class="pipe-sub" x="${bx + BOX_W / 2}" y="${Y + 72}" text-anchor="middle"
            font-size="9.5" fill="var(--text-muted)">step ${i + 1}</text>
    </g>`;
  });

  // legend
  const legY = Y + BOX_H + 36;
  const legends = [
    { color: 'var(--rule-strong)', label: 'pretrain' },
    { color: 'var(--blue)',        label: 'SFT' },
    { color: 'var(--accent)',      label: 'RL' },
    { color: 'var(--pos)',         label: 'released' },
  ];
  legends.forEach((lg, i) => {
    const lx = PAD_X + i * 130;
    s += `<rect x="${lx}" y="${legY}" width="14" height="8" rx="2"
      fill="${lg.color}" opacity="0.7"/>`;
    s += `<text class="pipe-sub" x="${lx + 20}" y="${legY + 7}">${lg.label}</text>`;
  });

  s += `</svg>`;

  mount.innerHTML =
    `<div class="pipe-root">${s}
      <div class="pipe-detail" id="pipe-detail">
        <p class="placeholder">Click any stage to read what it does. Two RL passes book-end an SFT in the middle: one to teach reasoning, one to teach helpfulness.</p>
      </div>
    </div>`;

  const detail = mount.querySelector('#pipe-detail');
  const byId = Object.fromEntries(STAGES.map(s => [s.id, s]));
  const select = (id) => {
    const st = byId[id]; if (!st) return;
    mount.querySelectorAll('.pipe-stage').forEach(g =>
      g.classList.toggle('sel', g.dataset.id === id));
    detail.innerHTML =
      `<h4>${st.label} <span class="sub">(${st.sub})</span></h4>
       <p>${st.detail}</p>`;
  };
  mount.querySelectorAll('.pipe-stage').forEach(g => {
    g.addEventListener('click', () => select(g.dataset.id));
    g.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(g.dataset.id); }
    });
  });
})();
