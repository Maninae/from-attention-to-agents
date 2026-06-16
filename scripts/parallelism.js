/* ============================================================
   RNN vs Transformer parallelism — a deterministic stepper.
   Two rows of n tokens. Press "step" or "play": the RNN row
   lights up one position per step, left-to-right. The
   Transformer row lights up all n positions at step 1.

   The point: O(n) sequential operations vs O(1). The total
   compute is similar (or greater for self-attention's O(n^2·d))
   but it parallelizes across the sequence axis, which is what
   a GPU actually wants. Mounts on #parallelism-demo.
   ============================================================ */
(function () {
  const mount = document.getElementById('parallelism-demo');
  if (!mount) return;

  const TOKENS = ['The', 'animal', 'didn’t', 'cross', 'the', 'street'];
  const N = TOKENS.length;
  const MAX_STEPS = N; // RNN needs N steps; Transformer finishes in 1

  let step = 0;
  let playing = false;
  let timer = null;

  const html = `
    <div class="pa-grid">
      <div class="pa-row" data-row="rnn">
        <div class="pa-label">RNN <span class="pa-tag">O(n) sequential</span></div>
        <div class="pa-cells" id="pa-rnn"></div>
      </div>
      <div class="pa-row" data-row="tx">
        <div class="pa-label">Transformer <span class="pa-tag pa-tag-accent">O(1) sequential</span></div>
        <div class="pa-cells" id="pa-tx"></div>
      </div>
    </div>
    <div class="pa-bar">
      <button class="demo-btn" data-act="step">step</button>
      <button class="demo-btn" data-act="play">play</button>
      <button class="demo-btn" data-act="reset">reset</button>
      <span class="pa-counter" id="pa-counter">step 0 / ${MAX_STEPS}</span>
    </div>
    <p class="pa-note">
      Same input, same total work in spirit. The RNN must finish position <em>i</em> before it can
      start <em>i+1</em>; the Transformer reads everything in one parallel pass. On a GPU, the
      second pattern wins.
    </p>
  `;
  mount.innerHTML = html;

  // ---- scoped styles ----
  const css = `
    .pa-grid { display:grid; gap:18px; margin-bottom:14px; }
    .pa-row { border:1px solid var(--rule); border-radius:10px; padding:14px 16px; background:var(--bg-elevated); }
    .pa-label { font-family:var(--mono); font-size:12px; color:var(--text-secondary); margin-bottom:10px;
      display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
    .pa-tag { font-family:var(--mono); font-size:10px; text-transform:uppercase; letter-spacing:0.08em;
      color:var(--text-muted); border:1px solid var(--rule); border-radius:999px; padding:2px 8px; }
    .pa-tag-accent { color:var(--accent); border-color:var(--accent-border); }
    .pa-cells { display:flex; gap:8px; flex-wrap:wrap; }
    .pa-cell {
      font-family:var(--mono); font-size:13px;
      padding:7px 11px; border-radius:8px;
      border:1px solid var(--rule); background:var(--bg-surface);
      color:var(--text-muted);
      transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.15s;
      min-width: 56px; text-align:center;
    }
    .pa-cell.lit {
      background: var(--accent-light); color: var(--text-primary);
      border-color: var(--accent-border); transform: translateY(-1px);
    }
    .pa-cell.now {
      background: var(--accent); color: var(--bg-deep); border-color: var(--accent);
    }
    .pa-bar { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
    .pa-counter { font-family:var(--mono); font-size:12px; color:var(--text-muted); margin-left:6px; }
    .pa-note { margin:14px 0 0; font-size:14px; color:var(--text-secondary); }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  mount.appendChild(styleEl);

  const rnnRow = mount.querySelector('#pa-rnn');
  const txRow = mount.querySelector('#pa-tx');
  const counter = mount.querySelector('#pa-counter');

  function build() {
    rnnRow.innerHTML = TOKENS.map((t, i) =>
      `<div class="pa-cell" data-i="${i}">${t}</div>`).join('');
    txRow.innerHTML = TOKENS.map((t, i) =>
      `<div class="pa-cell" data-i="${i}">${t}</div>`).join('');
  }
  build();

  function render() {
    rnnRow.querySelectorAll('.pa-cell').forEach((c, i) => {
      c.classList.toggle('lit', i < step);
      c.classList.toggle('now', i === step - 1);
    });
    txRow.querySelectorAll('.pa-cell').forEach((c, i) => {
      const on = step >= 1;
      c.classList.toggle('lit', on);
      c.classList.toggle('now', step === 1);
    });
    counter.textContent = `step ${step} / ${MAX_STEPS}`;
  }
  render();

  function doStep() {
    if (step >= MAX_STEPS) { stopPlay(); return; }
    step += 1;
    render();
  }
  function reset() {
    stopPlay();
    step = 0;
    render();
  }
  function startPlay() {
    if (playing) return;
    playing = true;
    timer = setInterval(() => {
      if (step >= MAX_STEPS) { stopPlay(); return; }
      doStep();
    }, 520);
    mount.querySelector('[data-act="play"]').textContent = 'pause';
  }
  function stopPlay() {
    playing = false;
    if (timer) { clearInterval(timer); timer = null; }
    const btn = mount.querySelector('[data-act="play"]');
    if (btn) btn.textContent = 'play';
  }

  mount.querySelectorAll('.demo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const act = btn.dataset.act;
      if (act === 'step') { stopPlay(); doStep(); }
      else if (act === 'play') { playing ? stopPlay() : startPlay(); }
      else if (act === 'reset') { reset(); }
    });
  });
})();
