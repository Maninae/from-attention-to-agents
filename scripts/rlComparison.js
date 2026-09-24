/* ============================================================
   PPO / DPO / GRPO — "which models are in play?"
   A side-by-side of the components each method keeps vs drops.
   The through-line is progressive simplification: PPO juggles
   four models, DPO drops the reward model AND the critic, GRPO
   keeps the reward signal but drops the critic by using a group
   baseline. Active components are solid + accent-bordered;
   dropped components are faded with a strikethrough.
   Pure DOM. No dependencies.
   ============================================================ */
(function () {
  const mount = document.getElementById('rl-demo');
  if (!mount) return;

  // ---------- scoped styles ----------
  const css = `
    .rl-wrap { max-width: 720px; margin: 0 auto; font-family: var(--sans); }
    .rl-frame {
      font-family: var(--mono); font-size: 12px;
      color: var(--text-muted); margin: 4px 0 14px;
      letter-spacing: 0.02em;
    }
    .rl-controls { display: flex; flex-wrap: wrap; gap: 10px; margin: 0 0 6px; }

    .rl-panel {
      margin-top: 18px;
      border-top: 1px solid var(--rule);
      padding-top: 18px;
    }
    .rl-caption {
      font-family: var(--sans); font-size: 16px;
      color: var(--text-primary); margin: 0 0 18px;
      max-width: 56ch; line-height: 1.5;
    }

    .rl-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 18px;
    }
    .rl-comp {
      border: 1.5px solid var(--rule-strong);
      border-radius: 10px;
      padding: 12px 12px 14px;
      background: var(--bg-elevated);
      transition: border-color 0.2s, opacity 0.2s, background 0.2s;
      min-height: 96px;
      display: flex; flex-direction: column;
    }
    .rl-comp.on { border-color: var(--accent); background: var(--accent-light); }
    .rl-comp.off { opacity: 0.42; background: var(--bg-surface); }

    .rl-comp-name {
      font-family: var(--sans); font-weight: 700; font-size: 14px;
      color: var(--text-primary); margin-bottom: 4px;
    }
    .rl-comp.off .rl-comp-name {
      text-decoration: line-through;
      text-decoration-thickness: 1.5px;
      color: var(--text-secondary);
    }
    .rl-comp-role {
      font-family: var(--mono); font-size: 11px;
      color: var(--text-muted); line-height: 1.45;
    }
    .rl-comp-tag {
      font-family: var(--mono); font-size: 11px;
      margin-top: auto; padding-top: 8px;
    }
    .rl-comp.on  .rl-comp-tag { color: var(--accent); }
    .rl-comp.off .rl-comp-tag { color: var(--text-muted); }

    .rl-count {
      display: flex; align-items: baseline; gap: 10px;
      padding: 12px 14px;
      border: 1px solid var(--rule);
      border-radius: 10px;
      background: var(--bg-surface);
    }
    .rl-count-label {
      font-family: var(--mono); font-size: 12px;
      color: var(--text-muted);
    }
    .rl-count-n {
      font-family: var(--sans); font-weight: 700;
      font-size: 28px; color: var(--accent); line-height: 1;
    }
    .rl-count-note {
      font-family: var(--sans); font-size: 13px;
      color: var(--text-secondary); margin-left: auto;
    }

    @media (max-width: 640px) {
      .rl-grid { grid-template-columns: repeat(2, 1fr); }
      .rl-count { flex-wrap: wrap; }
      .rl-count-note { margin-left: 0; flex-basis: 100%; }
    }
    @media (prefers-reduced-motion: reduce) {
      .rl-comp { transition: none; }
    }
  `;
  // ---------- data ----------
  const COMPONENTS = [
    { id: 'policy',    name: 'Policy',          role: 'the model being trained' },
    { id: 'reference', name: 'Reference model', role: 'frozen copy, anchors the KL penalty' },
    { id: 'reward',    name: 'Reward model',    role: 'learned from human preference rankings' },
    { id: 'critic',    name: 'Critic',          role: 'value head, estimates expected return' },
  ];

  const METHODS = {
    ppo: {
      label: 'PPO',
      on: { policy: true, reference: true, reward: true, critic: true },
      caption: 'Four models in memory. Powerful, but heavy and finicky.',
      count: 4,
      countNote: 'policy + reference + reward + critic',
    },
    dpo: {
      label: 'DPO',
      on: { policy: true, reference: true, reward: false, critic: false },
      caption: 'No reward model, no RL loop: learn straight from preference pairs.',
      count: 2,
      countNote: 'policy + reference only; trained with a classification loss on chosen vs rejected',
    },
    grpo: {
      label: 'GRPO',
      on: { policy: true, reference: true, reward: true, critic: false },
      caption: 'Drops the critic; the group is its own baseline.',
      count: 2,
      countNote: 'policy + reference held in memory, plus a reward signal; advantage = (r − mean) / std across a sampled group',
    },
  };

  // ---------- markup ----------
  const ids = ['ppo', 'dpo', 'grpo'];
  const btnRow = ids.map(id =>
    `<button type="button" class="demo-btn" data-method="${id}" aria-pressed="false">${METHODS[id].label}</button>`
  ).join('');

  const compCells = COMPONENTS.map(c =>
    `<div class="rl-comp" data-comp="${c.id}">
       <div class="rl-comp-name">${c.name}</div>
       <div class="rl-comp-role">${c.role}</div>
       <div class="rl-comp-tag" data-tag="${c.id}">kept</div>
     </div>`
  ).join('');

  mount.innerHTML = `
    <div class="rl-wrap">
      <div class="demo-controls" role="tablist" aria-label="RLHF method">${btnRow}</div>
      <p class="rl-frame">Each step removed a moving part.</p>
      <div class="rl-panel">
        <p class="rl-caption" id="rl-caption"></p>
        <div class="rl-grid" id="rl-grid">${compCells}</div>
        <div class="rl-count">
          <span class="rl-count-label">Models in play</span>
          <span class="rl-count-n" id="rl-count">–</span>
          <span class="rl-count-note" id="rl-count-note"></span>
        </div>
      </div>
    </div>
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  mount.appendChild(styleEl);

  // ---------- interaction ----------
  const btns = Array.from(mount.querySelectorAll('.demo-btn[data-method]'));
  const cells = Array.from(mount.querySelectorAll('.rl-comp'));
  const captionEl = mount.querySelector('#rl-caption');
  const countEl = mount.querySelector('#rl-count');
  const countNoteEl = mount.querySelector('#rl-count-note');

  function select(id) {
    const m = METHODS[id];
    if (!m) return;

    btns.forEach(b => {
      const active = b.dataset.method === id;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    captionEl.textContent = m.caption;
    countEl.textContent = m.count;
    countNoteEl.textContent = m.countNote;

    cells.forEach(cell => {
      const isOn = !!m.on[cell.dataset.comp];
      cell.classList.toggle('on', isOn);
      cell.classList.toggle('off', !isOn);
      const tag = cell.querySelector('.rl-comp-tag');
      if (tag) tag.textContent = isOn ? 'kept' : 'dropped';
    });
  }

  btns.forEach(b => {
    b.addEventListener('click', () => select(b.dataset.method));
    b.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const i = ids.indexOf(b.dataset.method);
        const next = e.key === 'ArrowRight' ? (i + 1) % ids.length : (i - 1 + ids.length) % ids.length;
        const target = btns[next];
        target.focus();
        select(target.dataset.method);
      }
    });
  });

  select('ppo');
})();
