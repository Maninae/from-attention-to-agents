/* ============================================================
   Speculative decoding stepper.
   Step through a fixed target sentence one draft-verify round
   at a time. The draft (small model) proposes k=4 tokens; the
   target (big model) verifies them all in one parallel forward
   pass. The first mismatch resets the draft; matched tokens
   are accepted for free. This is the mechanism from Leviathan
   et al. 2022 (arXiv 2211.17192) and Chen et al. 2023 (arXiv
   2302.01318).

   The scripted trace is fixed and deterministic - it's a
   pedagogical animation, not a live decode. What varies is the
   number of accepted tokens per round; the arithmetic in the
   stats panel (accepted / target-forward-passes) is what the
   reader should walk away with.

   Self-contained IIFE. Mounts into #spec-demo.
   ============================================================ */
(function () {
  const mount = document.getElementById('spec-demo');
  if (!mount) return;

  // A five-round scripted decode of a fixed sentence. Each round has:
  //   before   - tokens already committed
  //   drafted  - tokens the draft model proposed this round (up to k)
  //   accepted - integer count of prefix tokens the target accepts
  //   corrected - the token the target substitutes at the first mismatch
  //               (null if all drafted tokens match, in which case the
  //               target also samples one bonus token from its own dist)
  //   bonus     - the bonus token when accepted == drafted.length
  const K = 4;
  const ROUNDS = [
    {
      drafted:   ['The', ' quick', ' brown', ' fox'],
      accepted:  4,
      corrected: null,
      bonus:     ' jumps',
    },
    {
      drafted:   [' over', ' a', ' lazy', ' dog'],
      accepted:  1,
      corrected: ' the',
    },
    {
      drafted:   [' lazy', ' cat', ' beside', ' the'],
      accepted:  1,
      corrected: ' sleeping',
    },
    {
      drafted:   [' dog', ' in', ' the', ' sun'],
      accepted:  4,
      corrected: null,
      bonus:     '.',
    },
  ];

  // ---- css ----
  const css = `
    .sd-root { max-width: 760px; margin: 0 auto; font-family: var(--sans); }

    .sd-controls {
      display: flex; gap: 10px; margin: 0 0 18px; flex-wrap: wrap;
      align-items: center;
    }
    .sd-btn {
      font-family: var(--mono); font-size: 12px;
      background: var(--bg-surface); color: var(--text-secondary);
      border: 1px solid var(--rule);
      padding: 6px 14px; border-radius: 4px; cursor: pointer;
      transition: all 0.15s;
    }
    .sd-btn:hover:not([disabled]) { color: var(--text-primary); border-color: var(--accent-border); }
    .sd-btn.primary {
      color: var(--bg-elevated); background: var(--accent);
      border-color: var(--accent);
    }
    .sd-btn.primary:hover:not([disabled]) { background: var(--accent-hover); border-color: var(--accent-hover); }
    .sd-btn[disabled] { opacity: 0.4; cursor: not-allowed; }
    .sd-round {
      font-family: var(--mono); font-size: 11px; color: var(--text-muted);
      margin-left: auto; letter-spacing: 0.06em; text-transform: uppercase;
    }

    .sd-stream {
      background: var(--bg-elevated);
      border: 1px solid var(--rule);
      border-radius: 6px;
      padding: 16px 18px;
      min-height: 74px;
      font-family: var(--mono); font-size: 15px; line-height: 1.6;
      color: var(--text-primary);
      overflow-wrap: break-word;
    }
    .sd-stream .committed { color: var(--text-primary); }
    .sd-stream .drafting { opacity: 0.45; }
    .sd-tok {
      display: inline;
      padding: 1px 0;
      border-radius: 2px;
      transition: background 0.25s, color 0.25s;
    }
    .sd-tok.accept { background: rgba(47, 138, 87, 0.14); color: var(--pos); }
    .sd-tok.reject { background: rgba(176, 58, 44, 0.14); color: var(--neg);
      text-decoration: line-through; text-decoration-thickness: 1px; }
    .sd-tok.correct { background: rgba(47, 138, 87, 0.18); color: var(--pos); font-weight: 600; }
    .sd-tok.bonus { background: rgba(47, 138, 87, 0.14); color: var(--pos); font-style: italic; }
    .sd-tok.caret::after {
      content: '▌';
      color: var(--accent);
      margin-left: 1px;
      animation: sd-blink 1s steps(2) infinite;
    }
    @keyframes sd-blink { to { opacity: 0; } }

    .sd-explain {
      margin-top: 14px;
      background: var(--bg-surface);
      border-left: 3px solid var(--accent);
      padding: 12px 16px;
      font-size: 14px; color: var(--text-secondary); line-height: 1.55;
      min-height: 62px;
    }
    .sd-explain b { color: var(--text-primary); }
    .sd-explain code {
      font-family: var(--mono); font-size: 12.5px;
      background: var(--bg-elevated); border: 1px solid var(--rule);
      padding: 1px 5px; border-radius: 3px;
    }

    .sd-stats {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: var(--rule);
      border: 1px solid var(--rule);
      border-radius: 6px;
      margin-top: 14px;
      overflow: hidden;
    }
    .sd-stat {
      background: var(--bg-surface);
      padding: 12px 14px;
    }
    .sd-stat .lbl {
      font-family: var(--mono); font-size: 10px;
      text-transform: uppercase; letter-spacing: 0.1em;
      color: var(--text-muted); margin-bottom: 4px;
    }
    .sd-stat .val {
      font-family: var(--sans); font-weight: 700; font-size: 22px;
      color: var(--text-primary);
      font-variant-numeric: tabular-nums;
    }
    .sd-stat .sub {
      font-family: var(--mono); font-size: 11px;
      color: var(--text-muted); margin-top: 2px;
    }
  `;
  function ensureStyle() {
    if (mount.querySelector('style.sd-style')) return;
    const style = document.createElement('style');
    style.className = 'sd-style';
    style.textContent = css;
    mount.appendChild(style);
  }

  // ---- state ----
  // phase per round:  'idle' -> 'drafted' -> 'verified' -> next round
  const state = {
    round: 0,       // index into ROUNDS
    phase: 'idle',  // 'idle' | 'drafted' | 'verified'
    committed: [],  // list of tokens already accepted
    targetForwardCalls: 0,
    tokensGenerated: 0,
  };

  function reset() {
    state.round = 0;
    state.phase = 'idle';
    state.committed = [];
    state.targetForwardCalls = 0;
    state.tokensGenerated = 0;
    render();
  }

  function step() {
    if (state.phase === 'idle' || state.phase === 'verified') {
      if (state.round >= ROUNDS.length) return;
      // draft phase: propose k tokens (no target work yet)
      state.phase = 'drafted';
    } else if (state.phase === 'drafted') {
      // verify phase: single parallel target forward pass over k+1 positions
      const r = ROUNDS[state.round];
      state.targetForwardCalls += 1;
      const accepted = r.drafted.slice(0, r.accepted);
      state.committed.push(...accepted);
      state.tokensGenerated += r.accepted;
      if (r.corrected !== null && r.corrected !== undefined) {
        state.committed.push(r.corrected);
        state.tokensGenerated += 1;
      } else if (r.bonus) {
        state.committed.push(r.bonus);
        state.tokensGenerated += 1;
      }
      state.phase = 'verified';
      state.round += 1;
    }
    render();
  }

  // ---- render ----
  function render() {
    const done = state.round >= ROUNDS.length && state.phase !== 'drafted';
    const r = state.round < ROUNDS.length ? ROUNDS[state.round] : null;

    // committed stream
    const committedHtml = state.committed
      .map(t => `<span class="sd-tok committed">${escapeHtml(t)}</span>`).join('');

    // pending draft, if we are in drafted phase
    let pendingHtml = '';
    if (state.phase === 'drafted' && r) {
      pendingHtml = '<span class="drafting">' +
        r.drafted.map(t => `<span class="sd-tok">${escapeHtml(t)}</span>`).join('') +
        '</span>';
    }

    // caret at the end of committed, unless we are showing draft
    const caret = (state.phase !== 'drafted' && !done)
      ? '<span class="sd-tok caret"></span>' : '';

    const streamHtml =
      committedHtml + caret + pendingHtml + (done ? '<span class="sd-tok caret" style="opacity:0"></span>' : '');

    // explanation
    let explainHtml = '';
    if (state.phase === 'idle') {
      explainHtml = `<b>Round 1 of ${ROUNDS.length}.</b> Press <b>Draft</b> to have the small model
        propose ${K} tokens. It runs sequentially - ${K} cheap forward passes - and
        writes them to the buffer without touching the big model yet.`;
    } else if (state.phase === 'drafted' && r) {
      explainHtml = `The draft (small model) just proposed <code>${K}</code> tokens - shown
        greyed out. The big model has not seen them yet. Press <b>Verify</b> to run
        <em>one</em> parallel forward pass of the target model over all ${K + 1}
        positions and accept the longest prefix that matches its own greedy
        (or sampled) choice.`;
    } else if (state.phase === 'verified' && r) {
      const bonusText = r.corrected
        ? `so the target substitutes <code>${escapeHtml(r.corrected.trim() || r.corrected)}</code>
           and this round terminates. The rejected draft tokens are discarded.`
        : `so the target also gets to sample one <em>bonus</em> token
           (<code>${escapeHtml((r.bonus || '').trim() || r.bonus)}</code>) from its own
           distribution at the final position - k+1 tokens for the price of one
           big-model forward pass.`;
      explainHtml = `Target accepted <b>${r.accepted} of ${K}</b> drafted tokens; ${bonusText}`;
    }
    if (done) {
      const acceptRate = (state.tokensGenerated / (state.targetForwardCalls * (K + 1))) * 100;
      const speedup = state.tokensGenerated / state.targetForwardCalls;
      explainHtml = `<b>Done.</b> ${state.tokensGenerated} tokens generated with only
        ${state.targetForwardCalls} target-model forward passes -
        an effective <b>${speedup.toFixed(2)}&times;</b> decode speedup on this trace,
        with output identical (up to sampling) to running the target alone.
        Under lossless speculative decoding this is a pure win when the draft agrees
        often enough to amortize its own cost.`;
    }

    mount.querySelector('.sd-body').innerHTML = `
      <div class="sd-controls">
        <button class="sd-btn primary" id="sd-step" ${done ? 'disabled' : ''}>
          ${state.phase === 'drafted' ? 'Verify' : (done ? 'Done' : (state.phase === 'idle' ? 'Draft' : 'Draft next'))}
        </button>
        <button class="sd-btn" id="sd-reset">Reset</button>
        <span class="sd-round">round ${Math.min(state.round + (state.phase === 'drafted' ? 1 : (state.phase === 'verified' ? 0 : 1)), ROUNDS.length)} / ${ROUNDS.length}</span>
      </div>
      <div class="sd-stream">${streamHtml || '<span style="color:var(--text-muted); font-style:italic;">buffer empty - press Draft</span>'}</div>
      <div class="sd-explain">${explainHtml}</div>
      <div class="sd-stats">
        <div class="sd-stat">
          <div class="lbl">tokens generated</div>
          <div class="val">${state.tokensGenerated}</div>
          <div class="sub">accepted + bonus</div>
        </div>
        <div class="sd-stat">
          <div class="lbl">target forwards</div>
          <div class="val">${state.targetForwardCalls}</div>
          <div class="sub">one per verify</div>
        </div>
        <div class="sd-stat">
          <div class="lbl">effective speedup</div>
          <div class="val">${state.targetForwardCalls === 0 ? '-' : (state.tokensGenerated / state.targetForwardCalls).toFixed(2) + '&times;'}</div>
          <div class="sub">tokens / target-pass</div>
        </div>
      </div>
    `;

    const stepBtn = mount.querySelector('#sd-step');
    if (stepBtn && !done) stepBtn.addEventListener('click', step);
    mount.querySelector('#sd-reset').addEventListener('click', reset);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/ /g, ' '); // preserve leading spaces in tokens
  }

  mount.innerHTML = `<div class="sd-root"><div class="sd-body"></div></div>`;
  ensureStyle();
  render();
})();
