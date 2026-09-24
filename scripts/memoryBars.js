/* ============================================================
   Memory bars — full FT vs LoRA vs QLoRA on a 65B model
   A stateless three-bar SVG comparing GPU memory footprint to
   fine-tune a 65B parameter LLM. Numbers are pulled straight
   from the LoRA and QLoRA papers (LoRA: arXiv 2106.09685;
   QLoRA: arXiv 2305.14314). Click a bar to read the breakdown.
   Pure DOM. No dependencies.
   ============================================================ */
(function () {
  const mount = document.getElementById('mem-demo');
  if (!mount) return;

  const css = `
    .mb-wrap { max-width: 720px; margin: 0 auto; font-family: var(--sans); }
    .mb-frame {
      font-family: var(--mono); font-size: 12px;
      color: var(--text-muted); margin: 4px 0 14px;
      letter-spacing: 0.02em;
    }
    .mb-row {
      display: grid;
      grid-template-columns: 110px 1fr 96px;
      align-items: center;
      gap: 14px;
      padding: 12px 0;
      border-top: 1px solid var(--rule);
      cursor: pointer;
      transition: background 0.15s;
    }
    .mb-row:first-child { border-top: none; }
    .mb-row:hover { background: var(--bg-hover); }
    .mb-row.sel { background: var(--accent-light); }
    .mb-label {
      font-family: var(--sans);
      font-weight: 700;
      font-size: 15px;
      color: var(--text-primary);
    }
    .mb-sub {
      font-family: var(--mono);
      font-size: 11px;
      color: var(--text-muted);
      letter-spacing: 0.04em;
      margin-top: 2px;
    }
    .mb-bar-track {
      position: relative;
      height: 18px;
      background: var(--bg-elevated);
      border: 1px solid var(--rule);
      border-radius: 4px;
      overflow: hidden;
    }
    .mb-bar-fill {
      position: absolute; top: 0; left: 0; bottom: 0;
      background: var(--accent);
      opacity: 0.85;
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .mb-row.sel .mb-bar-fill { opacity: 1; }
    .mb-amt {
      font-family: var(--sans); font-weight: 700;
      font-size: 18px; color: var(--text-primary);
      text-align: right;
    }
    .mb-amt .unit {
      font-family: var(--mono); font-size: 11px;
      color: var(--text-muted); margin-left: 2px;
    }
    .mb-detail {
      margin-top: 18px;
      border-top: 1px solid var(--rule);
      padding-top: 16px;
      min-height: 88px;
    }
    .mb-detail .lbl {
      font-family: var(--mono); font-size: 12px;
      color: var(--accent);
      margin-bottom: 6px;
    }
    .mb-detail .body {
      font-family: var(--sans); font-size: 15px;
      color: var(--text-secondary); line-height: 1.55;
      margin: 0;
    }
    .mb-detail .body strong { color: var(--text-primary); }
    @media (max-width: 640px) {
      .mb-row { grid-template-columns: 90px 1fr 76px; gap: 10px; }
      .mb-label { font-size: 14px; }
      .mb-amt { font-size: 16px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .mb-bar-fill { transition: none; }
    }
  `;

  // Reference scale: full 16-bit FT of a 65B model is ~780 GB
  // (paper figure 1, QLoRA, arXiv 2305.14314).
  const FULL = 780;
  const ROWS = [
    {
      id: 'full',
      name: 'Full fine-tune',
      sub: 'FP16, Adam',
      gb: 780,
      label: '~780 GB',
      detail: 'Every one of the 65B parameters is trainable, in 16-bit precision, with first- and second-moment Adam statistics resident in memory. The QLoRA paper marks ~780 GB as the reference footprint for this setup. Out of reach without a multi-node A100/H100 cluster.',
    },
    {
      id: 'lora',
      name: 'LoRA',
      sub: 'rank-r adapters',
      gb: 260,
      label: '~3× less GPU mem',
      detail: 'The base 65B weights stay frozen but still sit in 16-bit. Only the low-rank update <strong>ΔW = BA</strong> trains, with rank r ≪ min(d, k). LoRA reports <strong>~10,000× fewer trainable parameters</strong> and <strong>~3× less GPU memory</strong> than full Adam fine-tuning of GPT-3 175B; the same ratio gets you down here on 65B.',
    },
    {
      id: 'qlora',
      name: 'QLoRA',
      sub: '4-bit base + LoRA',
      gb: 48,
      label: '48 GB',
      detail: 'The frozen base weights are quantized to <strong>NF4</strong> (4-bit), constants are double-quantized, and optimizer state pages out via paged memory. The LoRA adapters above it train in BF16. The whole 65B fine-tune fits on a single <strong>48 GB</strong> GPU, and Guanaco hit <strong>99.3%</strong> of ChatGPT on the Vicuna benchmark in 24 hours.',
    },
  ];

  const rowMarkup = ROWS.map(r => `
    <div class="mb-row" data-id="${r.id}" tabindex="0" role="button" aria-pressed="false">
      <div>
        <div class="mb-label">${r.name}</div>
        <div class="mb-sub">${r.sub}</div>
      </div>
      <div class="mb-bar-track"><div class="mb-bar-fill" style="width:${(r.gb / FULL) * 100}%"></div></div>
      <div class="mb-amt">${r.gb}<span class="unit">GB</span></div>
    </div>
  `).join('');

  mount.innerHTML = `
    <div class="mb-wrap">
      <p class="mb-frame">GPU memory to fine-tune a 65B-param LLM. Same model, three recipes.</p>
      <div class="mb-rows" id="mb-rows">${rowMarkup}</div>
      <div class="mb-detail" id="mb-detail">
        <div class="lbl" id="mb-detail-lbl">Pick a recipe</div>
        <p class="body" id="mb-detail-body">Click any of the three bars to see what each method does and does not hold in GPU memory.</p>
      </div>
    </div>
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  mount.appendChild(styleEl);

  const rows = Array.from(mount.querySelectorAll('.mb-row'));
  const detailLbl = mount.querySelector('#mb-detail-lbl');
  const detailBody = mount.querySelector('#mb-detail-body');
  const byId = Object.fromEntries(ROWS.map(r => [r.id, r]));

  function select(id) {
    const r = byId[id];
    if (!r) return;
    rows.forEach(el => {
      const on = el.dataset.id === id;
      el.classList.toggle('sel', on);
      el.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    detailLbl.textContent = r.name + ' · ' + r.label;
    detailBody.innerHTML = r.detail;
  }

  rows.forEach((el, i) => {
    el.addEventListener('click', () => select(el.dataset.id));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select(el.dataset.id);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const next = e.key === 'ArrowDown' ? (i + 1) % rows.length : (i - 1 + rows.length) % rows.length;
        rows[next].focus();
        select(rows[next].dataset.id);
      }
    });
  });

  select('qlora');
})();
