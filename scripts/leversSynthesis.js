/* ============================================================
   Eleven-levers synthesis - toggle each lever and watch a stacked
   bar of "what the model can do" assemble. Illustrative, NOT
   benchmark-accurate; labeled as such inside the demo.
   Pure SVG + DOM, no deps. IIFE-mounted by id. Deterministic.
   ============================================================ */
(function () {
  const mount = document.getElementById('levers-demo');
  if (!mount) return;

  // Ordered: architecture (Ch0) is the floor; measurement (Ch10) is the ceiling.
  // Gains sum to ~90; FLOOR 6 puts a fully-lit stack near the 100 mark.
  // Colors are project tokens only (see styles/shared.css). Adjacent
  // levers in a family (arch+pretrain, align+democrat, ttc+rl) share a
  // token; labels + position keep them distinct in the stack.
  const LEVERS = [
    { id: 'arch',    chap: 0,  label: 'Architecture',        sub: 'Transformer + pretraining (Ch0)',       gain: 12, color: 'var(--blue)' },
    { id: 'scale',   chap: 1,  label: 'Scale',               sub: 'Power law + in-context learning (Ch1)', gain: 16, color: 'var(--purple)' },
    { id: 'pretrain',chap: 2,  label: 'Pretraining eff.',    sub: 'Data / MoE / MLA / FP8 (Ch2)',          gain: 7,  color: 'var(--blue)' },
    { id: 'align',   chap: 3,  label: 'Alignment',           sub: 'RLHF, InstructGPT (Ch3)',               gain: 12, color: 'var(--amber)' },
    { id: 'demo',    chap: 4,  label: 'Democratization',     sub: 'DPO / GRPO / QLoRA (Ch4)',              gain: 5,  color: 'var(--amber)' },
    { id: 'ctx',     chap: 5,  label: 'Context',             sub: 'Reflective prompt search (Ch5)',        gain: 6,  color: 'var(--teal)' },
    { id: 'ttc',     chap: 6,  label: 'Test-time compute',   sub: 'Reasoning traces (Ch6)',                gain: 10, color: 'var(--green)' },
    { id: 'rl',      chap: 7,  label: 'RL at scale',         sub: 'Verifiable rewards, GRPO+ (Ch7)',       gain: 6,  color: 'var(--green)' },
    { id: 'infer',   chap: 8,  label: 'Inference systems',   sub: 'PagedAttn, spec decoding (Ch8)',        gain: 4,  color: 'var(--purple)' },
    { id: 'agent',   chap: 9,  label: 'Agency',              sub: 'Tools, ReAct loop, MCP (Ch9)',          gain: 8,  color: 'var(--accent)' },
    { id: 'eval',    chap: 10, label: 'Measurement + trust', sub: 'Evals, interpretability (Ch10)',        gain: 4,  color: 'var(--pos)' },
  ];
  const FLOOR = 6; // "raw next-token completion" baseline.

  const state = Object.fromEntries(LEVERS.map(l => [l.id, true]));

  // ---- scoped styles ------------------------------------------------------
  const style = document.createElement('style');
  style.textContent = `
    .lv-wrap { max-width: 760px; margin: 0 auto; font-family: var(--sans); color: var(--text-primary); }
    .lv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
    @media (max-width: 640px) { .lv-grid { grid-template-columns: 1fr; } }
    .lv-controls { display: flex; flex-direction: column; gap: 8px; }
    .lv-row {
      display: flex; align-items: flex-start; gap: 12px;
      border: 1px solid var(--rule);
      border-radius: 10px;
      padding: 10px 12px;
      background: var(--bg-elevated);
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s;
    }
    .lv-row:hover { border-color: var(--accent-border); }
    .lv-row.off { background: var(--bg-surface); opacity: 0.62; }
    .lv-swatch {
      width: 12px; height: 12px; margin-top: 4px;
      border-radius: 3px; flex-shrink: 0;
      background: var(--c, var(--accent));
      box-shadow: 0 0 0 1px var(--rule-strong);
    }
    .lv-row.off .lv-swatch { background: var(--bg-deep); box-shadow: 0 0 0 1px var(--rule); }
    .lv-meta { flex: 1; min-width: 0; }
    .lv-label { font-weight: 600; font-size: 14px; color: var(--text-primary); }
    .lv-row.off .lv-label { color: var(--text-muted); }
    .lv-sub { font-family: var(--mono); font-size: 11px; color: var(--text-muted); margin-top: 2px; }
    .lv-toggle {
      font-family: var(--mono); font-size: 10px;
      text-transform: uppercase; letter-spacing: 0.1em;
      color: var(--text-muted); margin-top: 3px;
    }
    .lv-row.on .lv-toggle { color: var(--pos); }
    .lv-row.off .lv-toggle { color: var(--neg); }

    .lv-bar-wrap {
      display: flex; flex-direction: column;
      border: 1px solid var(--rule);
      border-radius: 10px;
      padding: 14px;
      background: var(--bg-surface);
      min-height: 320px;
    }
    .lv-bar-head {
      font-family: var(--mono); font-size: 11px;
      text-transform: uppercase; letter-spacing: 0.1em;
      color: var(--text-muted); margin-bottom: 8px;
    }
    .lv-bar-track {
      flex: 1; display: flex; flex-direction: column-reverse;
      border: 1px solid var(--rule-strong);
      border-radius: 8px;
      background: var(--bg-elevated);
      overflow: hidden;
      min-height: 240px;
    }
    .lv-bar-seg {
      width: 100%;
      transition: height 0.35s ease, background 0.2s;
      display: flex; align-items: center; justify-content: flex-start;
      padding: 0 10px;
      font-family: var(--mono); font-size: 11px; color: var(--bg-elevated);
      overflow: hidden;
    }
    .lv-bar-seg.floor { background: repeating-linear-gradient(45deg, var(--bg-hover) 0 6px, var(--bg-surface) 6px 12px); color: var(--text-muted); }
    .lv-bar-total {
      margin-top: 10px;
      font-family: var(--mono); font-size: 12px; color: var(--text-secondary);
      display: flex; justify-content: space-between;
    }
    .lv-bar-total b { color: var(--text-primary); }
    .lv-caveat {
      font-family: var(--mono); font-size: 10px;
      text-transform: uppercase; letter-spacing: 0.08em;
      color: var(--text-muted); margin-top: 8px;
      text-align: center;
    }
    .lv-actions { display: flex; gap: 8px; margin-top: 14px; }
  `;
  mount.appendChild(style);

  // ---- DOM scaffold -------------------------------------------------------
  const wrap = document.createElement('div');
  wrap.className = 'lv-wrap';
  wrap.innerHTML = `
    <div class="lv-grid">
      <div class="lv-controls" role="group" aria-label="Lever toggles"></div>
      <div class="lv-bar-wrap">
        <div class="lv-bar-head">What the model can do</div>
        <div class="lv-bar-track"></div>
        <div class="lv-bar-total"><span>capability (illustrative)</span><b><span class="lv-num">0</span> / 100</b></div>
        <div class="lv-caveat">illustrative, not measured</div>
      </div>
    </div>
    <div class="lv-actions">
      <button class="demo-btn" data-act="all">All levers on</button>
      <button class="demo-btn" data-act="none">Strip back to base</button>
    </div>
  `;
  mount.appendChild(wrap);

  const controls = wrap.querySelector('.lv-controls');
  const track = wrap.querySelector('.lv-bar-track');
  const totalNum = wrap.querySelector('.lv-num');

  LEVERS.forEach(l => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'lv-row on';
    row.dataset.id = l.id;
    row.style.setProperty('--c', l.color);
    row.innerHTML = `
      <span class="lv-swatch" aria-hidden="true"></span>
      <span class="lv-meta">
        <span class="lv-label">${l.label}</span>
        <span class="lv-sub">${l.sub}</span>
      </span>
      <span class="lv-toggle">ON</span>
    `;
    row.addEventListener('click', () => {
      state[l.id] = !state[l.id];
      render();
    });
    controls.appendChild(row);
  });

  wrap.querySelector('[data-act="all"]').addEventListener('click', () => {
    LEVERS.forEach(l => { state[l.id] = true; }); render();
  });
  wrap.querySelector('[data-act="none"]').addEventListener('click', () => {
    LEVERS.forEach(l => { state[l.id] = false; }); render();
  });

  // ---- render -------------------------------------------------------------
  function render() {
    // total = floor + sum(on)
    let total = FLOOR;
    LEVERS.forEach(l => { if (state[l.id]) total += l.gain; });
    totalNum.textContent = Math.round(total);

    // controls
    controls.querySelectorAll('.lv-row').forEach(row => {
      const id = row.dataset.id;
      const on = state[id];
      row.classList.toggle('on', on);
      row.classList.toggle('off', !on);
      row.querySelector('.lv-toggle').textContent = on ? 'ON' : 'OFF';
    });

    // bar — floor first, then levers in order of chapter
    track.innerHTML = '';
    const floor = document.createElement('div');
    floor.className = 'lv-bar-seg floor';
    floor.style.height = (FLOOR) + '%';
    floor.textContent = 'raw completion';
    track.appendChild(floor);
    LEVERS.forEach(l => {
      const seg = document.createElement('div');
      seg.className = 'lv-bar-seg';
      seg.style.background = l.color;
      seg.style.height = (state[l.id] ? l.gain : 0) + '%';
      if (state[l.id] && l.gain >= 8) seg.textContent = l.label;
      track.appendChild(seg);
    });
  }

  render();
})();
