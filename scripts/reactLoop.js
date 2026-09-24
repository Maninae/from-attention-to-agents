/* ============================================================
   ReAct loop stepper — the chapter's headline demo.
   A small agent answers "What's the capital of the country
   where the 2018 Winter Olympics were held?" by interleaving
   Thought / Action / Observation, then a final answer.
   Pure DOM. Click "step" to advance; "reset" to restart.
   No randomness — fully scripted trace.
   ============================================================ */
(function () {
  const mount = document.getElementById('react-demo');
  if (!mount) return;

  // The trace, in order. kind is one of: t (thought), a (action), o (observation), f (final).
  const TRACE = [
    { kind: 't', body: 'I need two facts: which country hosted the 2018 Winter Olympics, then that country’s capital. Start by looking up the host.' },
    { kind: 'a', body: 'search("2018 Winter Olympics host country")' },
    { kind: 'o', body: 'The 2018 Winter Olympics were held in Pyeongchang, South Korea.' },
    { kind: 't', body: 'Host country is South Korea. Now look up its capital.' },
    { kind: 'a', body: 'search("capital of South Korea")' },
    { kind: 'o', body: 'The capital of South Korea is Seoul.' },
    { kind: 'f', body: 'Seoul.' },
  ];

  // ---- styles, scoped to this demo ----
  const css = `
    .rc-wrap { display: grid; grid-template-columns: 1fr; gap: 18px; }
    @media (min-width: 760px) { .rc-wrap { grid-template-columns: 240px 1fr; } }
    .rc-cycle {
      position: relative; padding: 14px; border: 1px solid var(--rule);
      border-radius: 12px; background: var(--bg-elevated);
      display: flex; align-items: center; justify-content: center;
    }
    .rc-cycle svg { width: 100%; max-width: 220px; height: auto; display: block; }
    .rc-cycle .lbl { font-family: var(--mono); font-size: 10px; fill: var(--text-muted); }
    .rc-cycle .node text { font-family: var(--sans); font-size: 13px; fill: var(--text-secondary); }
    .rc-cycle .node.on text { fill: var(--text-primary); font-weight: 600; }
    .rc-cycle .ring { fill: var(--bg-surface); stroke: var(--rule-strong); stroke-width: 1.4; transition: fill 0.2s, stroke 0.2s; }
    .rc-cycle .node.on .ring { stroke-width: 2.5; }
    .rc-cycle .node.t.on .ring { fill: color-mix(in srgb, var(--purple) 18%, var(--bg-surface)); stroke: var(--purple); }
    .rc-cycle .node.a.on .ring { fill: color-mix(in srgb, var(--accent) 18%, var(--bg-surface)); stroke: var(--accent); }
    .rc-cycle .node.o.on .ring { fill: color-mix(in srgb, var(--teal) 18%, var(--bg-surface)); stroke: var(--teal); }
    .rc-cycle .node.f.on .ring { fill: color-mix(in srgb, var(--pos) 22%, var(--bg-surface)); stroke: var(--pos); }
    .rc-cycle .arc { fill: none; stroke: var(--rule); stroke-width: 1.2; }
    .rc-cycle .arc.on { stroke: var(--accent); }

    .rc-pad {
      border: 1px solid var(--rule); border-radius: 12px; background: var(--bg-elevated);
      padding: 14px 16px; min-height: 280px;
    }
    .rc-qtext { font-size: 15px; color: var(--text-primary); margin: 0 0 14px; line-height: 1.55; border-bottom: 1px dashed var(--rule); padding-bottom: 12px; }

    .rc-step {
      display: grid; grid-template-columns: 92px 1fr; gap: 12px;
      margin: 10px 0; padding: 10px 0;
      border-top: 1px dotted var(--rule);
    }
    .rc-step:first-of-type { border-top: none; padding-top: 4px; }
    .rc-tag {
      font-family: var(--mono); font-size: 11px;
      padding: 2px 8px; border-radius: 999px; align-self: start;
      display: inline-block; height: fit-content;
    }
    .rc-tag.t { color: var(--purple); background: color-mix(in srgb, var(--purple) 10%, var(--bg-surface)); }
    .rc-tag.a { color: var(--accent); background: var(--accent-light); }
    .rc-tag.o { color: var(--teal); background: color-mix(in srgb, var(--teal) 10%, var(--bg-surface)); }
    .rc-tag.f { color: var(--pos); background: color-mix(in srgb, var(--pos) 12%, var(--bg-surface)); }
    .rc-body { font-size: 14.5px; color: var(--text-primary); line-height: 1.55; }
    .rc-body.a, .rc-body.o { font-family: var(--mono); font-size: 13.5px; }
    .rc-body.a { color: var(--accent); }
    .rc-body.o { color: var(--text-secondary); }
    .rc-body.f { font-weight: 700; }

    .rc-empty { color: var(--text-muted); font-style: italic; font-size: 14px; }
    .rc-controls { display: flex; gap: 10px; margin-top: 14px; flex-wrap: wrap; }
    .rc-meta { font-family: var(--mono); font-size: 11px; color: var(--text-muted); margin-left: auto; align-self: center; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  mount.appendChild(style);

  // ---- markup ----
  const root = document.createElement('div');
  root.className = 'rc-wrap';
  root.innerHTML = `
    <div class="rc-cycle">
      <svg viewBox="0 0 220 220" role="img" aria-label="Thought, Action, Observation cycle">
        <!-- arcs between nodes -->
        <path class="arc t-to-a" d="M150 60 A 70 70 0 0 1 175 145" />
        <path class="arc a-to-o" d="M165 160 A 70 70 0 0 1 55 160" />
        <path class="arc o-to-t" d="M45 145 A 70 70 0 0 1 70 60" />
        <!-- arrow heads via small triangles -->
        <polygon class="arc" points="171,143 181,148 178,138" />
        <polygon class="arc" points="60,165 50,160 55,170" />
        <polygon class="arc" points="71,62 65,55 76,53" />

        <g class="node t" data-k="t">
          <circle class="ring" cx="110" cy="40" r="30"></circle>
          <text x="110" y="45" text-anchor="middle">Thought</text>
        </g>
        <g class="node a" data-k="a">
          <circle class="ring" cx="186" cy="158" r="30"></circle>
          <text x="186" y="162" text-anchor="middle">Action</text>
        </g>
        <g class="node o" data-k="o">
          <circle class="ring" cx="34" cy="158" r="30"></circle>
          <text x="34" y="162" text-anchor="middle">Observe</text>
        </g>
        <text class="lbl" x="110" y="210" text-anchor="middle">repeat until done</text>
      </svg>
    </div>

    <div class="rc-pad">
      <p class="rc-qtext"><em>Question:</em> what’s the capital of the country where the 2018 Winter Olympics were held?</p>
      <div class="rc-trace"><p class="rc-empty">Press <strong>step</strong> to watch the agent reason, act, and observe, one turn at a time.</p></div>
      <div class="rc-controls">
        <button class="demo-btn primary rc-step-btn">step ›</button>
        <button class="demo-btn rc-reset-btn">reset</button>
        <span class="rc-meta">step <span class="rc-i">0</span> / ${TRACE.length}</span>
      </div>
    </div>
  `;
  mount.appendChild(root);

  // ---- behavior ----
  const trace = root.querySelector('.rc-trace');
  const iLabel = root.querySelector('.rc-i');
  const stepBtn = root.querySelector('.rc-step-btn');
  const resetBtn = root.querySelector('.rc-reset-btn');
  const cycleNodes = root.querySelectorAll('.rc-cycle .node');

  const TAGS = { t: 'Thought', a: 'Action', o: 'Observation', f: 'Final answer' };
  let i = 0;

  function paint() {
    iLabel.textContent = i;
    // highlight current node in the cycle
    const cur = i === 0 ? null : TRACE[i - 1].kind;
    cycleNodes.forEach(n => n.classList.toggle('on', n.dataset.k === cur));
    stepBtn.disabled = i >= TRACE.length;
    stepBtn.style.opacity = i >= TRACE.length ? 0.5 : 1;
  }

  function render() {
    if (i === 0) {
      trace.innerHTML = `<p class="rc-empty">Press <strong>step</strong> to watch the agent reason, act, and observe, one turn at a time.</p>`;
      return;
    }
    trace.innerHTML = TRACE.slice(0, i).map(step => `
      <div class="rc-step">
        <span class="rc-tag ${step.kind}">${TAGS[step.kind]}</span>
        <div class="rc-body ${step.kind}">${step.body}</div>
      </div>
    `).join('');
    paint();
  }

  stepBtn.addEventListener('click', () => {
    if (i >= TRACE.length) return;
    i += 1;
    render();
  });
  resetBtn.addEventListener('click', () => { i = 0; render(); });
  paint();
})();
