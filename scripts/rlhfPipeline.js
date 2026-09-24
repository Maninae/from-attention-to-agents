/* ============================================================
   RLHF three-stage pipeline animator
   Visualizes the InstructGPT recipe: base GPT-3 -> SFT -> RM -> PPO.
   Each stage shows what data feeds it and what model comes out.
   A "Play" button walks the pipeline; clicking a stage jumps to it.
   Pure DOM + a tiny SVG arrow strip. Mounts on #rlhf-pipeline-demo.
   Self-contained IIFE, references only :root tokens.
   ============================================================ */
(function () {
  const mount = document.getElementById('rlhf-pipeline-demo');
  if (!mount) return;

  const css = `
    .pl-wrap { font-family: var(--sans); max-width: 760px; margin: 0 auto; }
    .pl-controls { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 4px; }
    .pl-frame {
      font-family: var(--mono); font-size: 12px;
      color: var(--text-muted); margin: 4px 0 16px; letter-spacing: 0.02em;
    }

    .pl-track {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      align-items: stretch;
      margin-bottom: 18px;
    }
    .pl-stage {
      position: relative;
      border: 1.5px solid var(--rule-strong);
      border-radius: 10px;
      padding: 10px 12px 12px;
      background: var(--bg-elevated);
      cursor: pointer;
      transition: border-color 0.25s, background 0.25s, opacity 0.25s, transform 0.25s;
      min-height: 96px;
      text-align: left;
      font: inherit; color: inherit;
    }
    .pl-stage:hover { border-color: var(--accent-border); }
    .pl-stage.done { border-color: var(--accent-border); background: var(--accent-light); }
    .pl-stage.active {
      border-color: var(--accent);
      background: var(--accent-light);
      transform: translateY(-2px);
    }
    .pl-stage.pending { opacity: 0.55; }

    .pl-stage-num {
      font-family: var(--mono); font-size: 10px;
      color: var(--text-muted);
    }
    .pl-stage-name {
      font-family: var(--sans); font-weight: 700; font-size: 15px;
      color: var(--text-primary); margin: 2px 0 6px;
    }
    .pl-stage-out {
      font-family: var(--mono); font-size: 11px; line-height: 1.45;
      color: var(--text-secondary);
    }
    .pl-stage.active .pl-stage-num,
    .pl-stage.done   .pl-stage-num { color: var(--accent); }

    .pl-arrows {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 8px; margin: -8px 0 14px;
      font-family: var(--mono); font-size: 16px; color: var(--text-muted);
      text-align: center;
    }
    .pl-arrows span { line-height: 1; }
    .pl-arrows span.lit { color: var(--accent); }

    .pl-panel {
      border-top: 1px solid var(--rule);
      padding-top: 16px;
    }
    .pl-headline {
      font-family: var(--sans); font-weight: 600; font-size: 17px;
      color: var(--text-primary); margin: 4px 0 10px;
    }
    .pl-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
    }
    .pl-cell {
      border: 1px solid var(--rule); border-radius: 8px;
      padding: 10px 12px; background: var(--bg-surface);
    }
    .pl-cell .lab {
      font-family: var(--mono); font-size: 11px;
      color: var(--text-muted); margin-bottom: 3px;
    }
    .pl-cell .val {
      font-family: var(--sans); font-size: 14px; color: var(--text-primary);
      line-height: 1.45;
    }
    .pl-cell .val code {
      font-family: var(--mono); font-size: 13px;
      background: var(--bg-elevated); padding: 1px 5px; border-radius: 4px;
      border: 1px solid var(--rule);
    }
    .pl-note {
      margin-top: 12px; font-size: 14px; color: var(--text-secondary);
      line-height: 1.55;
    }
    .pl-note strong { color: var(--text-primary); }

    @media (max-width: 640px) {
      .pl-track { grid-template-columns: repeat(2, 1fr); }
      .pl-arrows { grid-template-columns: repeat(2, 1fr); }
      .pl-grid { grid-template-columns: 1fr; }
    }
    @media (prefers-reduced-motion: reduce) {
      .pl-stage { transition: none; }
    }
  `;

  const STAGES = [
    {
      id: 'base',
      num: '0',
      name: 'Base GPT-3',
      out: '175B params · document completer',
      headline: 'A 175B-parameter base model that completes text but does not follow instructions.',
      input: 'pretraining corpus (web, books)',
      output: 'GPT-3, a base language model',
      note: 'Trained to predict the next token. Asked a question, it may continue with another question, drift, or refuse. The whole pipeline below is about closing that intent gap.',
    },
    {
      id: 'sft',
      num: '1',
      name: 'SFT',
      out: 'supervised policy',
      headline: 'Show the model what good answers look like, then fine-tune on those examples.',
      input: '~13k labeler-written demonstrations',
      output: 'an SFT policy that imitates the demonstrators',
      note: 'Roughly 40 labelers (Upwork + ScaleAI) wrote ideal completions for sampled prompts. The model learns the <em>shape</em> of a helpful answer from human writing. Cheap, stable, and the foundation for everything that follows.',
    },
    {
      id: 'rm',
      num: '2',
      name: 'Reward model',
      out: '6B scalar reward',
      headline: 'Collect pairwise comparisons; train a small model to predict which output a labeler would prefer.',
      input: '~33k prompts × 4–9 ranked completions',
      output: 'a 6B reward model (RM) outputting a scalar',
      note: 'The RM is trained with a Bradley-Terry loss: <code>L = −log σ(r(x, y_w) − r(x, y_l))</code>. The reward <em>difference</em> between a preferred and rejected response is treated as the log-odds of preference. The RM is only 6B even when the policy is 175B, since a small judge is enough for 2022-era preferences.',
    },
    {
      id: 'ppo',
      num: '3',
      name: 'PPO',
      out: 'aligned policy',
      headline: 'Use the reward model as a learned reward signal; optimize the SFT policy with PPO.',
      input: 'fresh prompts + the frozen reward model + the SFT model as a KL anchor',
      output: 'an aligned policy (the InstructGPT model)',
      note: 'The PPO objective adds a KL penalty to the SFT model so the policy does not drift into reward-hacked gibberish. <strong>Headline result:</strong> a 1.3B InstructGPT was preferred over 175B GPT-3, with 100× fewer parameters, simply aligned to intent.',
    },
  ];

  const PLAY_INTERVAL = 1300;

  const stagesHtml = STAGES.map((s, i) => `
    <button type="button" class="pl-stage pending" data-i="${i}" aria-pressed="false">
      <div class="pl-stage-num">Stage ${s.num}</div>
      <div class="pl-stage-name">${s.name}</div>
      <div class="pl-stage-out">${s.out}</div>
    </button>
  `).join('');

  const arrowsHtml =
    '<span></span><span data-arrow="0">→</span><span data-arrow="1">→</span><span data-arrow="2">→</span>';

  mount.innerHTML = `
    <div class="pl-wrap">
      <div class="pl-controls">
        <button type="button" class="demo-btn primary" id="pl-play">▶ Play pipeline</button>
        <button type="button" class="demo-btn" id="pl-reset">Reset</button>
      </div>
      <p class="pl-frame">Each stage is built on the previous one. Click any stage, or press play.</p>
      <div class="pl-track" id="pl-track">${stagesHtml}</div>
      <div class="pl-arrows" id="pl-arrows">${arrowsHtml}</div>
      <div class="pl-panel">
        <div class="pl-headline" id="pl-headline"></div>
        <div class="pl-grid">
          <div class="pl-cell">
            <div class="lab">Input data</div>
            <div class="val" id="pl-input"></div>
          </div>
          <div class="pl-cell">
            <div class="lab">Output</div>
            <div class="val" id="pl-output"></div>
          </div>
        </div>
        <div class="pl-note" id="pl-note"></div>
      </div>
    </div>
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  mount.appendChild(styleEl);

  const stageEls = Array.from(mount.querySelectorAll('.pl-stage'));
  const arrowEls = Array.from(mount.querySelectorAll('.pl-arrows span[data-arrow]'));
  const headlineEl = mount.querySelector('#pl-headline');
  const inputEl = mount.querySelector('#pl-input');
  const outputEl = mount.querySelector('#pl-output');
  const noteEl = mount.querySelector('#pl-note');
  const playBtn = mount.querySelector('#pl-play');
  const resetBtn = mount.querySelector('#pl-reset');

  let timer = null;

  function render(i) {
    const s = STAGES[i];
    stageEls.forEach((el, j) => {
      el.classList.toggle('active', j === i);
      el.classList.toggle('done', j < i);
      el.classList.toggle('pending', j > i);
      el.setAttribute('aria-pressed', j === i ? 'true' : 'false');
    });
    arrowEls.forEach((el, j) => {
      el.classList.toggle('lit', j < i);
    });
    headlineEl.textContent = s.headline;
    inputEl.innerHTML = s.input;
    outputEl.innerHTML = s.output;
    noteEl.innerHTML = s.note;
  }

  function stopTimer() { if (timer) { clearTimeout(timer); timer = null; } }

  function play() {
    stopTimer();
    let i = 0;
    render(i);
    const step = () => {
      i += 1;
      if (i >= STAGES.length) { timer = null; return; }
      render(i);
      timer = setTimeout(step, PLAY_INTERVAL);
    };
    timer = setTimeout(step, PLAY_INTERVAL);
  }

  stageEls.forEach((el, i) => {
    el.addEventListener('click', () => { stopTimer(); render(i); });
  });
  playBtn.addEventListener('click', play);
  resetBtn.addEventListener('click', () => { stopTimer(); render(0); });

  render(0);
})();
