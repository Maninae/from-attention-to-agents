/* ============================================================
   MoE router miniature - total vs active params, with balancing
   8 routed experts + 1 shared expert, top-2 gating over a fixed
   stream of 32 tokens. Deterministic (mulberry32 seed 0xBEEF).
   Balancing toggle: aux-loss-free style expert bias vs off.
   Off => one expert absorbs a growing share of traffic.
   Mounts on #moe-demo.
   ============================================================ */
(function () {
  const mount = document.getElementById('moe-demo');
  if (!mount) return;

  // Reference sizes (mock but sensible): 8 routed experts + 1 shared,
  // each expert ~30B params. Shared is always active. Top-2 routing.
  const N_ROUTED = 8;
  const N_SHARED = 1;
  const TOP_K = 2;
  const EXPERT_PARAMS_B = 30;   // per expert, in billions
  const TOTAL_PARAMS_B = (N_ROUTED + N_SHARED) * EXPERT_PARAMS_B; // 270B
  const ACTIVE_PARAMS_B = (TOP_K + N_SHARED) * EXPERT_PARAMS_B;   // 90B

  const N_TOKENS = 32;

  // Deterministic PRNG.
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Build a fixed stream of token affinities: each token has an 8-vector
  // of scores over routed experts. We shape them so a naive gate would
  // over-pick expert 0 (that is the failure mode balancing has to fix).
  const rand = mulberry32(0xBEEF);
  const TOKENS = [];
  for (let i = 0; i < N_TOKENS; i++) {
    const scores = [];
    for (let e = 0; e < N_ROUTED; e++) {
      // Bias expert 0 upward on ~55% of tokens; noise for the rest.
      let base = rand() * 0.6;
      if (e === 0 && rand() < 0.55) base += 0.7;
      scores.push(base);
    }
    TOKENS.push({ id: i, scores });
  }

  // Palette for experts.
  const EXPERT_COLORS = [
    'var(--accent)', 'var(--teal)', 'var(--blue)', 'var(--green)',
    'var(--amber)', 'var(--purple)', 'var(--rose)', 'var(--neg)'
  ];

  const css = `
    .mo-wrap { max-width: 720px; margin: 0 auto; font-family: var(--sans); }
    .mo-frame { font-family: var(--mono); font-size: 12px; color: var(--text-muted); margin: 4px 0 14px; letter-spacing: 0.02em; }
    .mo-stats {
      display: grid; grid-template-columns: 1fr 1fr 1fr;
      gap: 10px; margin-bottom: 14px;
    }
    .mo-stat {
      padding: 10px 12px;
      border: 1px solid var(--rule); border-radius: 8px;
      background: var(--bg-elevated);
    }
    .mo-stat-lbl { font-family: var(--mono); font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; }
    .mo-stat-val { font-family: var(--sans); font-size: 20px; font-weight: 700; color: var(--text-primary); margin-top: 2px; }
    .mo-stat-val .u { font-family: var(--mono); font-size: 12px; color: var(--text-muted); font-weight: 400; margin-left: 2px; }
    .mo-controls { display: flex; flex-wrap: wrap; gap: 10px; margin: 6px 0 14px; }
    .mo-experts {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 6px;
      margin-bottom: 16px;
    }
    .mo-exp {
      border: 1px solid var(--rule); border-radius: 6px;
      padding: 6px 4px 8px; text-align: center;
      background: var(--bg-elevated);
      position: relative;
    }
    .mo-exp-dot {
      width: 10px; height: 10px; border-radius: 50%;
      margin: 0 auto 4px;
    }
    .mo-exp-name { font-family: var(--mono); font-size: 10px; color: var(--text-muted); }
    .mo-exp-bar {
      margin-top: 4px; height: 40px;
      background: var(--bg-hover); border-radius: 3px;
      position: relative; overflow: hidden;
    }
    .mo-exp-bar-fill {
      position: absolute; bottom: 0; left: 0; right: 0;
      transition: height 0.2s;
    }
    .mo-exp-cnt { font-family: var(--mono); font-size: 11px; color: var(--text-primary); margin-top: 3px; }
    .mo-tokens {
      display: flex; flex-wrap: wrap; gap: 3px;
      padding: 10px; border: 1px solid var(--rule); border-radius: 8px;
      background: var(--bg-elevated); min-height: 84px;
      margin-bottom: 12px;
    }
    .mo-tok {
      display: inline-flex; flex-direction: column;
      align-items: stretch; gap: 2px;
      padding: 3px 4px; border-radius: 4px;
      background: var(--bg-hover); font-family: var(--mono); font-size: 10px;
      color: var(--text-muted);
    }
    .mo-tok-label { text-align: center; }
    .mo-tok-dots { display: flex; gap: 2px; justify-content: center; }
    .mo-tok-dot { width: 6px; height: 6px; border-radius: 50%; }
    .mo-legend {
      font-size: 12px; color: var(--text-secondary); line-height: 1.55;
      padding: 10px 12px; border: 1px solid var(--rule);
      background: var(--accent-light); border-radius: 8px;
    }
    .mo-legend strong { color: var(--text-primary); }
    @media (max-width: 640px) {
      .mo-experts { grid-template-columns: repeat(4, 1fr); }
      .mo-stats { grid-template-columns: 1fr 1fr; }
    }
    @media (prefers-reduced-motion: reduce) {
      .mo-exp-bar-fill { transition: none; }
    }
  `;

  const html = `
    <div class="mo-wrap">
      <p class="mo-frame">8 routed experts + 1 shared &middot; top-2 gating &middot; 30B params per expert (mock).</p>
      <div class="mo-stats">
        <div class="mo-stat">
          <div class="mo-stat-lbl">Total params</div>
          <div class="mo-stat-val">${TOTAL_PARAMS_B}<span class="u">B</span></div>
        </div>
        <div class="mo-stat">
          <div class="mo-stat-lbl">Active per token</div>
          <div class="mo-stat-val">${ACTIVE_PARAMS_B}<span class="u">B</span></div>
        </div>
        <div class="mo-stat">
          <div class="mo-stat-lbl">Ratio</div>
          <div class="mo-stat-val">${(ACTIVE_PARAMS_B / TOTAL_PARAMS_B * 100).toFixed(0)}%<span class="u">of total fires</span></div>
        </div>
      </div>
      <div class="mo-controls">
        <button class="demo-btn" id="mo-step">step token</button>
        <button class="demo-btn primary" id="mo-play">play</button>
        <button class="demo-btn" id="mo-reset">reset</button>
        <button class="demo-btn" id="mo-bal">balancing: <span id="mo-bal-state">on</span></button>
      </div>
      <div class="mo-experts" id="mo-experts"></div>
      <div class="mo-tokens" id="mo-tokens"></div>
      <div class="mo-legend" id="mo-legend"></div>
    </div>
  `;

  mount.innerHTML = html;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  mount.appendChild(styleEl);

  const state = {
    step: 0,
    playing: false,
    timer: null,
    balancing: true,
    biases: new Array(N_ROUTED).fill(0),
    counts: new Array(N_ROUTED).fill(0),
    routed: [] // per-token top-k assignment (array of ints of length TOP_K)
  };

  function topK(scores) {
    const idx = scores.map((s, i) => [s, i]).sort((a, b) => b[0] - a[0]);
    return idx.slice(0, TOP_K).map(pair => pair[1]);
  }

  function routeOne(tokenIdx) {
    const raw = TOKENS[tokenIdx].scores;
    // Aux-loss-free style: add per-expert bias to the routing score
    // (bias is nudged down for over-used experts). Bias only affects
    // routing, not the final value combination.
    const gated = raw.map((s, i) => s + (state.balancing ? state.biases[i] : 0));
    const picks = topK(gated);
    picks.forEach(e => { state.counts[e] += 1; });
    state.routed[tokenIdx] = picks;

    if (state.balancing) {
      // Simple online balancing: after each token, nudge the picked
      // experts' bias slightly down, unpicked ones slightly up. The
      // "target" is uniform load (K / N per token).
      const eta = 0.08;
      const target = TOP_K / N_ROUTED;
      const totalTokens = state.step + 1;
      for (let e = 0; e < N_ROUTED; e++) {
        const load = state.counts[e] / (totalTokens * TOP_K);
        state.biases[e] += eta * (target - load);
      }
    }
  }

  function render() {
    const totalTokens = Math.max(1, state.step);
    // Load = fraction of tokens routed to this expert (top-K counts each pick as 1 token visit).
    // Uniform load = TOP_K / N_ROUTED (e.g. top-2 of 8 => each expert sees 25% of tokens).
    const maxCount = Math.max(1, ...state.counts);
    const expertsEl = mount.querySelector('#mo-experts');
    expertsEl.innerHTML = state.counts.map((c, i) => {
      const pct = (c / maxCount) * 100;
      const load = state.step > 0 ? ((c / totalTokens) * 100).toFixed(0) : '0';
      return `
        <div class="mo-exp" title="expert ${i}">
          <div class="mo-exp-dot" style="background:${EXPERT_COLORS[i]}"></div>
          <div class="mo-exp-name">E${i}</div>
          <div class="mo-exp-bar"><div class="mo-exp-bar-fill" style="height:${pct}%; background:${EXPERT_COLORS[i]}; opacity:0.85"></div></div>
          <div class="mo-exp-cnt">${load}%</div>
        </div>
      `;
    }).join('');

    // Token stream
    const tokensEl = mount.querySelector('#mo-tokens');
    tokensEl.innerHTML = state.routed.slice(0, state.step).map((picks, tid) => {
      const dots = picks.map(e => `<span class="mo-tok-dot" style="background:${EXPERT_COLORS[e]}"></span>`).join('');
      return `<span class="mo-tok"><span class="mo-tok-label">t${tid}</span><span class="mo-tok-dots">${dots}</span></span>`;
    }).join('');

    // Legend
    const legendEl = mount.querySelector('#mo-legend');
    const loads = state.counts.map(c => state.step > 0 ? c / totalTokens : 0);
    const maxLoad = loads.length ? Math.max(...loads) : 0;
    const maxLoadIdx = loads.indexOf(maxLoad);
    const uniform = TOP_K / N_ROUTED;
    if (state.step === 0) {
      legendEl.innerHTML = 'Press <strong>step token</strong>. Each token picks its top-2 routed experts; the shared expert always fires. Watch load stay balanced with the bias on; turn it off to see one expert absorb the traffic.';
    } else if (state.balancing) {
      legendEl.innerHTML = `Uniform target: each expert sees <strong>${(uniform * 100).toFixed(0)}%</strong> of tokens (top-${TOP_K} of ${N_ROUTED}). Heaviest expert (E${maxLoadIdx}): <strong>${(maxLoad * 100).toFixed(0)}%</strong>. Aux-loss-free bias is nudging the router toward balance without a gradient penalty on the language loss.`;
    } else {
      legendEl.innerHTML = `Balancing OFF. Heaviest expert (E${maxLoadIdx}): <strong>${(maxLoad * 100).toFixed(0)}%</strong> of tokens (uniform target: ${(uniform * 100).toFixed(0)}%). Without a nudge, the router's own bias in the data leads to expert collapse; the underused experts get no gradient and stay useless.`;
    }
  }

  function step() {
    if (state.step >= N_TOKENS) return;
    routeOne(state.step);
    state.step += 1;
    render();
    if (state.step >= N_TOKENS && state.playing) stopPlay();
  }
  function startPlay() {
    if (state.playing) return;
    state.playing = true;
    mount.querySelector('#mo-play').textContent = 'pause';
    state.timer = setInterval(step, 220);
  }
  function stopPlay() {
    state.playing = false;
    mount.querySelector('#mo-play').textContent = 'play';
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
  }
  function reset() {
    stopPlay();
    state.step = 0;
    state.biases = new Array(N_ROUTED).fill(0);
    state.counts = new Array(N_ROUTED).fill(0);
    state.routed = [];
    render();
  }
  function toggleBalancing() {
    state.balancing = !state.balancing;
    mount.querySelector('#mo-bal-state').textContent = state.balancing ? 'on' : 'off';
    reset();
  }

  mount.querySelector('#mo-step').addEventListener('click', () => { stopPlay(); step(); });
  mount.querySelector('#mo-play').addEventListener('click', () => {
    if (state.playing) stopPlay(); else startPlay();
  });
  mount.querySelector('#mo-reset').addEventListener('click', reset);
  mount.querySelector('#mo-bal').addEventListener('click', toggleBalancing);

  render();
})();
