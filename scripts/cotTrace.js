/* ============================================================
   R1-style chain-of-thought trace stepper.
   A pre-canned reasoning trace on a simple combinatorics problem.
   The model takes a wrong path, hits the "Wait..." moment, backs
   up, and finishes correctly. Highlights the self-correction
   cell — the canonical "aha" behavior R1 reports under pure RL.
   No live LLM. The trace is illustrative, not lifted from the
   R1 paper verbatim (the paper's example is paraphrased on
   readability grounds; the SHAPE matches the documented behavior:
   draft -> error -> "Wait" -> revise -> verify).
   Source for the pattern: arXiv 2501.12948, §2.2.4 "aha moment".
   Self-contained IIFE. Mounts into #cot-demo. Deterministic.
   ============================================================ */
(function () {
  const mount = document.getElementById('cot-demo');
  if (!mount) return;

  const PROBLEM = 'How many positive integers less than 1000 are divisible by 7 but not by 11?';

  // kind: 'draft' | 'wait' | 'revise' | 'verify' | 'answer'
  const STEPS = [
    { kind: 'draft',
      text: 'Count multiples of 7 below 1000. The largest is 994 = 7 × 142. So there are 142 multiples of 7 in [1, 999].' },
    { kind: 'draft',
      text: 'Now subtract the ones that are also multiples of 11. Those are multiples of 7·11 = 77. The largest under 1000 is 7·11·13 = 1001 — too big — so use 7·11·12 = 924. That gives 12 multiples of 77 below 1000.' },
    { kind: 'draft',
      text: 'Answer: 142 − 12 = 133.' },
    { kind: 'wait',
      text: 'Wait — 142 − 12. Let me redo the arithmetic slowly. 142 − 10 = 132, then − 2 more = 130. Not 133.' },
    { kind: 'revise',
      text: 'And re-check the counts themselves. 7 · 142 = 994 ✓, 7 · 143 = 1001 ✗ (over 999). So floor(999/7) = 142 stands.' },
    { kind: 'revise',
      text: '77 · 12 = 924 ✓, 77 · 13 = 1001 ✗. So floor(999/77) = 12 stands.' },
    { kind: 'verify',
      text: 'Cross-check by inclusion–exclusion: |A \\ B| = |A| − |A ∩ B| = 142 − 12 = 130. Consistent — the earlier 133 was an arithmetic slip.' },
    { kind: 'answer',
      text: 'Final answer: 130.' },
  ];

  const css = `
    .cot-root { font-family: var(--sans); max-width: 700px; margin: 0 auto; }
    .cot-problem {
      font-family: var(--mono); font-size: 13px;
      color: var(--text-primary);
      background: var(--bg-elevated);
      border: 1px solid var(--rule);
      border-left: 3px solid var(--teal);
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 16px;
    }
    .cot-problem .cot-tag {
      font-family: var(--mono); font-size: 10px; text-transform: uppercase;
      letter-spacing: 0.1em; color: var(--teal); margin-bottom: 6px;
    }

    .cot-stream {
      display: flex; flex-direction: column; gap: 8px;
      min-height: 280px;
    }
    .cot-step {
      font-family: var(--mono); font-size: 13px; line-height: 1.6;
      color: var(--text-primary);
      background: var(--bg-elevated);
      border: 1px solid var(--rule);
      border-radius: 8px;
      padding: 10px 14px;
      opacity: 0;
      transform: translateY(4px);
      transition: opacity 0.2s, transform 0.2s, background 0.2s;
    }
    .cot-step.shown { opacity: 1; transform: translateY(0); }
    .cot-step .cot-kind {
      font-family: var(--mono); font-size: 10px; text-transform: uppercase;
      letter-spacing: 0.1em; color: var(--text-muted); margin-right: 8px;
    }
    .cot-step.wait {
      background: color-mix(in srgb, var(--accent) 12%, var(--bg-elevated));
      border-color: var(--accent);
    }
    .cot-step.wait .cot-kind { color: var(--accent); font-weight: 700; }
    .cot-step.revise { border-left: 3px solid var(--accent); }
    .cot-step.verify { border-left: 3px solid var(--teal); }
    .cot-step.answer {
      background: color-mix(in srgb, var(--pos) 10%, var(--bg-elevated));
      border-color: var(--pos);
      font-weight: 600;
    }
    .cot-step.answer .cot-kind { color: var(--pos); }
    .cot-step .cot-strike { text-decoration: line-through; color: var(--text-muted); }

    .cot-controls {
      display: flex; gap: 10px; margin-top: 14px;
      align-items: center;
      flex-wrap: wrap;
    }
    .cot-counter {
      font-family: var(--mono); font-size: 11px; color: var(--text-muted);
      margin-left: auto;
    }

    .cot-foot {
      margin-top: 14px;
      font-family: var(--sans); font-size: 13px;
      color: var(--text-secondary);
      border-top: 1px solid var(--rule);
      padding-top: 12px;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  mount.appendChild(style);

  mount.innerHTML = `
    <div class="cot-root">
      <div class="cot-problem">
        <div class="cot-tag">Problem</div>
        ${PROBLEM}
      </div>
      <div class="cot-stream" id="cot-stream"></div>
      <div class="cot-controls">
        <button class="demo-btn primary" id="cot-next">Next step</button>
        <button class="demo-btn" id="cot-reset">Reset</button>
        <span class="cot-counter" id="cot-counter">0 / ${STEPS.length}</span>
      </div>
      <div class="cot-foot">
        The “Wait…” line is the famous self-correction beat from the R1 paper. Under pure RL with
        a verifier, response length grows on its own and the model starts revisiting earlier
        steps unprompted. Real trace SHAPES look like this; the prose here is paraphrased for
        readability.
      </div>
    </div>
  `;

  const stream = mount.querySelector('#cot-stream');
  const counter = mount.querySelector('#cot-counter');
  const btnNext = mount.querySelector('#cot-next');
  const btnReset = mount.querySelector('#cot-reset');

  let shown = 0;

  const labelFor = (kind) => {
    if (kind === 'draft') return 'draft';
    if (kind === 'wait') return 'Wait —';
    if (kind === 'revise') return 'revise';
    if (kind === 'verify') return 'verify';
    if (kind === 'answer') return 'final';
    return kind;
  };

  const render = () => {
    stream.innerHTML = '';
    for (let i = 0; i < shown; i++) {
      const st = STEPS[i];
      const div = document.createElement('div');
      div.className = `cot-step ${st.kind}`;
      // strike through the wrong-path draft step once Wait fires
      const isStruckDraft = st.kind === 'draft' && shown > 3 && i === 2;
      const inner = isStruckDraft
        ? `<span class="cot-strike">${st.text}</span>`
        : st.text;
      div.innerHTML = `<span class="cot-kind">${labelFor(st.kind)}</span>${inner}`;
      stream.appendChild(div);
      // trigger transition next tick
      requestAnimationFrame(() => div.classList.add('shown'));
    }
    counter.textContent = `${shown} / ${STEPS.length}`;
    btnNext.disabled = shown >= STEPS.length;
    btnNext.textContent = shown >= STEPS.length ? 'done' : 'Next step';
    btnNext.classList.toggle('primary', shown < STEPS.length);
  };

  btnNext.addEventListener('click', () => {
    if (shown < STEPS.length) { shown++; render(); }
  });
  btnReset.addEventListener('click', () => {
    shown = 0; render();
  });
  render();
})();
