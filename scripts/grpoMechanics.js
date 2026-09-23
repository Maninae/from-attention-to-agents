/* ============================================================
   GRPO mechanics - one group of rollouts, three algorithms.
   Deterministic. No randomness. Reusable :root tokens only.
   Prefix: rlg-  (Ch7 "RL grows up").
   Mount: #rlg-demo.

   The point: given the SAME group of 8 rollouts to a math prompt,
   how does the loss aggregation choice change what each response
   contributes to the gradient?
     - GRPO       : A_i = (r_i - mean)/std; per-token grad = A_i / |o_i|
     - Dr. GRPO   : A_i = r_i - mean;       per-token grad = A_i
     - DAPO(TLPG) : A_i as GRPO; loss summed at token level (Σ Σ) then
                    normalized by total tokens across the batch, so a
                    response's total gradient scales with its length.

   Length bias visualization: the long-wrong rollouts (E, F) are
   deemphasized under GRPO's 1/|o_i|, which is exactly the bias
   Dr. GRPO (Liu et al., Mar 2025) identified.
   ============================================================ */
(function () {
  const mount = document.getElementById('rlg-demo');
  if (!mount) return;

  // Fixed group of 8 rollouts (deterministic).
  const ROLLOUTS = [
    { id: 'A', correct: true,  tokens: 220 },
    { id: 'B', correct: true,  tokens: 260 },
    { id: 'C', correct: true,  tokens: 340 },
    { id: 'D', correct: false, tokens: 180 },
    { id: 'E', correct: false, tokens: 640 },
    { id: 'F', correct: false, tokens: 820 },
    { id: 'G', correct: true,  tokens: 480 },
    { id: 'H', correct: false, tokens: 300 },
  ];

  const ALGOS = [
    {
      id: 'grpo',
      label: 'GRPO',
      subtitle: 'group mean + std, divide by |o_i|',
      caption:
        'The per-response gradient is A_i · (something summed over |o_i| tokens) / |o_i|. ' +
        'Long WRONG answers (E, F) get a small per-token push and a small total push. ' +
        'That is the bias Dr. GRPO points at: the loss under-penalizes wrong-and-lengthy.',
    },
    {
      id: 'drgrpo',
      label: 'Dr. GRPO',
      subtitle: 'drop 1/std and 1/|o_i|',
      caption:
        'Drop the standard-deviation normalization (which over-weighted low-variance prompts) ' +
        'and drop 1/|o_i| (which shrank the update on long responses). All wrong rollouts now ' +
        'contribute the same per-response push, regardless of length.',
    },
    {
      id: 'dapo',
      label: 'DAPO (token-level)',
      subtitle: 'sum token losses, normalize once at batch level',
      caption:
        'Same group-normalized advantage, but the loss is summed over ALL tokens in the batch ' +
        'and normalized once. A response of length |o_i| now contributes gradient proportional ' +
        'to |o_i|. Long wrong rollouts get the LARGEST total penalty - the opposite of GRPO.',
    },
  ];

  // ---- pure functions ----
  function mean(xs) { return xs.reduce((a, b) => a + b, 0) / xs.length; }
  function std(xs) {
    const m = mean(xs);
    const v = mean(xs.map((x) => (x - m) * (x - m)));
    return Math.sqrt(v) || 1e-9;
  }

  // Gradient magnitude per response, under each algorithm.
  // Values are unitless (proportional); we visualize their relative size.
  function computeGrads(algo) {
    const rewards = ROLLOUTS.map((r) => (r.correct ? 1 : 0));
    const m = mean(rewards);
    const s = std(rewards);
    if (algo === 'grpo') {
      // per-response gradient magnitude ~ |A_i|. Per-token ~ |A_i| / |o_i|.
      return ROLLOUTS.map((r, i) => {
        const A = (rewards[i] - m) / s;
        const perTok = A / r.tokens;
        return { A, perTok, total: A }; // per-response "total" = A_i (each token contributes 1/|o|)
      });
    }
    if (algo === 'drgrpo') {
      return ROLLOUTS.map((r, i) => {
        const A = rewards[i] - m;
        const perTok = A;
        return { A, perTok, total: A };
      });
    }
    // dapo: token-level. Same A, but "total" gradient scales with |o_i|.
    // We normalize by the mean of |o| so scales are comparable to the others.
    const meanLen = mean(ROLLOUTS.map((r) => r.tokens));
    return ROLLOUTS.map((r, i) => {
      const A = (rewards[i] - m) / s;
      const perTok = A;
      const total = A * (r.tokens / meanLen);
      return { A, perTok, total };
    });
  }

  const css = `
    .rlg-wrap { font-family: var(--sans); max-width: 760px; margin: 0 auto; }
    .rlg-frame { font-family: var(--mono); font-size: 12px; color: var(--text-muted);
      margin: 4px 0 12px; letter-spacing: 0.02em; }
    .rlg-controls { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
    .rlg-panel { border-top: 1px solid var(--rule); padding-top: 12px; }
    .rlg-method { font-family: var(--mono); font-size: 12px; color: var(--accent);
      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px; }
    .rlg-sub { font-family: var(--mono); font-size: 11px; color: var(--text-muted);
      margin-bottom: 10px; letter-spacing: 0.02em; }

    .rlg-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px;
      align-items: start; margin-bottom: 10px; }
    @media (max-width: 640px) { .rlg-grid { grid-template-columns: 1fr; } }

    .rlg-col-title { font-family: var(--mono); font-size: 11px; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.09em; margin-bottom: 6px; }

    .rlg-row { display: grid;
      grid-template-columns: 28px 1fr 44px;
      align-items: center; gap: 8px;
      padding: 4px 0;
      border-bottom: 1px dashed var(--rule);
      font-size: 13px;
    }
    .rlg-row:last-child { border-bottom: none; }
    .rlg-id { font-family: var(--mono); color: var(--text-secondary); font-size: 12px; }
    .rlg-tokens { color: var(--text-muted); font-family: var(--mono); font-size: 11px;
      text-align: right; }
    .rlg-lenbar { height: 8px; background: var(--rule); border-radius: 3px;
      overflow: hidden; }
    .rlg-lenbar-fill { height: 100%; background: var(--rule-strong); }
    .rlg-verdict { display: inline-block; width: 14px; text-align: center;
      font-family: var(--mono); font-weight: 700; font-size: 12px; }
    .rlg-verdict.ok  { color: var(--pos); }
    .rlg-verdict.err { color: var(--neg); }

    .rlg-gradrow { display: grid;
      grid-template-columns: 28px 1fr 60px;
      align-items: center; gap: 8px;
      padding: 4px 0;
      border-bottom: 1px dashed var(--rule);
      font-size: 13px;
    }
    .rlg-gradrow:last-child { border-bottom: none; }
    .rlg-gradbar-container { position: relative; height: 16px; }
    .rlg-gradbar-mid { position: absolute; left: 50%; top: 0; bottom: 0;
      width: 1px; background: var(--rule-strong); }
    .rlg-gradbar { position: absolute; top: 3px; bottom: 3px;
      border-radius: 3px; transition: width 0.25s, left 0.25s, background 0.25s; }
    .rlg-gradbar.pos { background: var(--pos); }
    .rlg-gradbar.neg { background: var(--neg); }
    .rlg-gradnum { font-family: var(--mono); font-size: 11px; color: var(--text-muted);
      text-align: right; }

    .rlg-caption { font-size: 14px; color: var(--text-primary); line-height: 1.5;
      max-width: 62ch; margin: 10px 0 4px; }
    .rlg-note { font-size: 12px; color: var(--text-muted); font-family: var(--mono);
      line-height: 1.5; margin-top: 6px; }
  `;

  // ---- render ----
  const style = document.createElement('style');
  style.textContent = css;
  mount.appendChild(style);

  const wrap = document.createElement('div');
  wrap.className = 'rlg-wrap';
  wrap.innerHTML = `
    <div class="rlg-frame">group_size = 8 rollouts · math prompt · deterministic</div>
    <div class="rlg-controls" role="tablist"></div>
    <div class="rlg-panel">
      <div class="rlg-method" data-role="method"></div>
      <div class="rlg-sub" data-role="sub"></div>
      <div class="rlg-grid">
        <div>
          <div class="rlg-col-title">rollouts (verdict &middot; length)</div>
          <div data-role="rollouts"></div>
        </div>
        <div>
          <div class="rlg-col-title">per-response gradient contribution</div>
          <div data-role="grads"></div>
        </div>
      </div>
      <p class="rlg-caption" data-role="caption"></p>
      <p class="rlg-note" data-role="note"></p>
    </div>
  `;
  mount.appendChild(wrap);

  const controlsEl = wrap.querySelector('.rlg-controls');
  const methodEl = wrap.querySelector('[data-role="method"]');
  const subEl = wrap.querySelector('[data-role="sub"]');
  const rolloutsEl = wrap.querySelector('[data-role="rollouts"]');
  const gradsEl = wrap.querySelector('[data-role="grads"]');
  const captionEl = wrap.querySelector('[data-role="caption"]');
  const noteEl = wrap.querySelector('[data-role="note"]');

  // Build controls.
  const buttons = ALGOS.map((a) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'demo-btn';
    b.textContent = a.label;
    b.setAttribute('role', 'tab');
    b.addEventListener('click', () => select(a.id));
    controlsEl.appendChild(b);
    return { id: a.id, el: b };
  });

  // Build rollouts (left column, static).
  const maxLen = Math.max(...ROLLOUTS.map((r) => r.tokens));
  ROLLOUTS.forEach((r) => {
    const row = document.createElement('div');
    row.className = 'rlg-row';
    row.innerHTML = `
      <span class="rlg-id">${r.id}</span>
      <div>
        <div class="rlg-lenbar"><div class="rlg-lenbar-fill" style="width:${
          (r.tokens / maxLen * 100).toFixed(1)
        }%"></div></div>
      </div>
      <span class="rlg-tokens">
        <span class="rlg-verdict ${r.correct ? 'ok' : 'err'}">${r.correct ? '&check;' : '&times;'}</span>
        ${r.tokens}
      </span>
    `;
    rolloutsEl.appendChild(row);
  });

  function select(id) {
    buttons.forEach((b) => b.el.classList.toggle('active', b.id === id));
    const algo = ALGOS.find((a) => a.id === id);
    methodEl.textContent = algo.label;
    subEl.textContent = algo.subtitle;
    captionEl.textContent = algo.caption;

    const grads = computeGrads(id);
    const maxAbs = Math.max(...grads.map((g) => Math.abs(g.total))) || 1;
    // Extra hint for GRPO: note per-token push for E vs D.
    if (id === 'grpo') {
      const D = grads[3], F = grads[5];
      noteEl.textContent =
        `per-token push |A/|o|| : wrong-short D = ${Math.abs(D.perTok).toFixed(4)}, ` +
        `wrong-long F = ${Math.abs(F.perTok).toFixed(4)}. ` +
        `F's per-token gradient is ~${(Math.abs(D.perTok) / Math.abs(F.perTok)).toFixed(1)}x weaker than D's.`;
    } else if (id === 'drgrpo') {
      noteEl.textContent =
        `per-token push |A| is constant across responses of the same verdict: ` +
        `every wrong rollout contributes the same negative signal, per token, regardless of |o_i|.`;
    } else {
      const F = grads[5], D = grads[3];
      noteEl.textContent =
        `token-level aggregation: F contributes ${(Math.abs(F.total) / Math.abs(D.total)).toFixed(1)}x ` +
        `the total gradient of D, in proportion to its length (${ROLLOUTS[5].tokens} vs ${ROLLOUTS[3].tokens} tokens).`;
    }

    gradsEl.innerHTML = '';
    grads.forEach((g, i) => {
      const r = ROLLOUTS[i];
      const row = document.createElement('div');
      row.className = 'rlg-gradrow';
      const pct = Math.abs(g.total) / maxAbs;
      const width = (pct * 48).toFixed(1);
      const pos = g.total >= 0;
      const barStyle = pos
        ? `left: 50%; width: ${width}%;`
        : `right: 50%; left: auto; width: ${width}%;`;
      row.innerHTML = `
        <span class="rlg-id">${r.id}</span>
        <div class="rlg-gradbar-container">
          <div class="rlg-gradbar-mid"></div>
          <div class="rlg-gradbar ${pos ? 'pos' : 'neg'}" style="${barStyle}"></div>
        </div>
        <span class="rlg-gradnum">${g.total >= 0 ? '+' : ''}${g.total.toFixed(2)}</span>
      `;
      gradsEl.appendChild(row);
    });
  }

  select('grpo');
})();
