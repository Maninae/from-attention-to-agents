/* ============================================================
   KV serving calculator - concurrent requests per node.

   Ch2's #kv-demo teaches per-variant per-token KV size (MHA vs
   MQA vs GQA vs MLA). This demo asks the serving question that
   sits on top of those numbers: given a serving node's HBM
   budget, model weights, and a per-token KV size, how many
   concurrent requests fit at a given context length - and how
   do PagedAttention (no reserve-the-max fragmentation) and KV
   quantization (halve the per-token bytes) change that count?

   Per-token KV bytes are taken as an INPUT (per model preset)
   rather than re-derived. Presets:
     - Llama 3 70B on 8xH100  (GQA-8, 320 KB/tok, 140 GB weights, 640 GB HBM)
     - DeepSeek-V3 on 8xH200  (MLA,   69 KB/tok, 671 GB FP8 weights, 1.13 TB HBM)

   Self-contained IIFE. Mounts into #kvcalc-demo. Deterministic;
   no PRNG. All math is a small closed-form; the arithmetic is
   what the reader should walk away with.
   ============================================================ */
(function () {
  const mount = document.getElementById('kvcalc-demo');
  if (!mount) return;

  const GB = 1024 * 1024 * 1024;
  const KB = 1024;

  // Per-token-KV-bytes come from Chapter 2 for the variant each model uses.
  // Weights: BF16 for Llama 3 70B, FP8 for DeepSeek-V3 (V3 report ships FP8).
  const PRESETS = [
    {
      id: 'llama70',
      label: 'Llama 3 70B on 8xH100',
      note: 'GQA-8 attention. Per-token KV from Ch 2: 2 layers x 8 kv heads x 128 head_dim x 2 B x 80 layers = 320 KB.',
      hbmBytes: 8 * 80 * GB,          // 640 GB
      weightsBytes: 140 * GB,         // BF16 70B
      kvBytesPerToken: 320 * KB,      // GQA-8, BF16
      variant: 'GQA-8, BF16 KV',
    },
    {
      id: 'v3',
      label: 'DeepSeek-V3 on 8xH200',
      note: 'MLA attention + FP8 weights. Per-token KV from Ch 2: 61 layers x (512 + 64) elements x 2 B ~= 69 KB (BF16 KV).',
      hbmBytes: 8 * 141 * GB,         // 1.128 TB HBM
      weightsBytes: 671 * GB,         // FP8 for 671B params (~1 B/param)
      kvBytesPerToken: 69 * KB,       // MLA BF16 KV
      variant: 'MLA, BF16 KV',
    },
  ];

  const CONTEXTS = [
    { label: '8K',   n: 8 * 1024 },
    { label: '32K',  n: 32 * 1024 },
    { label: '128K', n: 128 * 1024 },
  ];

  // Naive alloc reserves the max context per request slot.
  // Paged alloc only pays for the tokens actually used. As a stand-in
  // for a real workload we assume avg = maxCtx / 2 (a common shape:
  // most turns are short, a few are long). It's the fragmentation gap
  // that matters, not the exact number.
  const AVG_RATIO = 0.5;

  // ---- state ----
  const state = { presetIdx: 0, ctxIdx: 1 };

  // ---- helpers ----
  function fmtGB(b) {
    if (b < GB) return (b / (1024 * 1024)).toFixed(0) + ' MB';
    if (b < 10 * GB) return (b / GB).toFixed(2) + ' GB';
    if (b < 1024 * GB) return (b / GB).toFixed(0) + ' GB';
    return (b / (1024 * GB)).toFixed(2) + ' TB';
  }
  function concurrent(availBytes, perSeqBytes) {
    if (perSeqBytes <= 0) return 0;
    return Math.max(0, Math.floor(availBytes / perSeqBytes));
  }

  // ---- css ----
  const css = `
    .kvc-root { max-width: 760px; margin: 0 auto; font-family: var(--sans); }

    .kvc-controls {
      display: flex; flex-wrap: wrap; gap: 22px 32px;
      margin: 0 0 20px; align-items: flex-start;
    }
    .kvc-ctrl-block { display: flex; flex-direction: column; gap: 6px; }
    .kvc-ctrl-label {
      font-family: var(--mono); font-size: 10.5px;
      text-transform: uppercase; letter-spacing: 0.1em;
      color: var(--text-muted);
    }
    .kvc-btn-row { display: flex; gap: 6px; flex-wrap: wrap; }
    .kvc-btn {
      font-family: var(--mono); font-size: 12px;
      background: var(--bg-surface); color: var(--text-secondary);
      border: 1px solid var(--rule);
      padding: 5px 12px; border-radius: 4px; cursor: pointer;
      transition: all 0.15s;
    }
    .kvc-btn:hover { color: var(--text-primary); border-color: var(--accent-border); }
    .kvc-btn.active {
      color: var(--bg-elevated); background: var(--accent);
      border-color: var(--accent);
    }

    .kvc-summary {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 1px; background: var(--rule);
      border: 1px solid var(--rule); border-radius: 6px;
      overflow: hidden; margin: 0 0 18px;
    }
    .kvc-cell { background: var(--bg-surface); padding: 12px 14px; }
    .kvc-cell .lbl {
      font-family: var(--mono); font-size: 10.5px;
      text-transform: uppercase; letter-spacing: 0.08em;
      color: var(--text-muted); margin-bottom: 4px;
    }
    .kvc-cell .val {
      font-family: var(--sans); font-weight: 700; font-size: 20px;
      color: var(--text-primary); font-variant-numeric: tabular-nums;
    }
    .kvc-cell .sub {
      font-family: var(--mono); font-size: 11px;
      color: var(--text-muted); margin-top: 2px;
    }

    .kvc-note {
      font-family: var(--mono); font-size: 11.5px;
      color: var(--text-muted); margin: 0 0 14px; line-height: 1.55;
    }

    .kvc-table {
      width: 100%; border-collapse: collapse; font-family: var(--sans);
      font-size: 14px; margin-bottom: 14px;
      table-layout: fixed;
    }
    .kvc-table col.c-name { width: 42%; }
    .kvc-table col.c-per  { width: 18%; }
    .kvc-table col.c-cnt  { width: 12%; }
    .kvc-table col.c-bar  { width: 28%; }
    .kvc-table th, .kvc-table td {
      padding: 12px 8px; text-align: right;
      border-bottom: 1px solid var(--rule);
      vertical-align: middle;
    }
    .kvc-table th {
      font-family: var(--mono); font-size: 10.5px;
      text-transform: uppercase; letter-spacing: 0.08em;
      color: var(--text-muted); font-weight: 500;
      border-bottom: 1px solid var(--rule-strong);
    }
    .kvc-table th:first-child, .kvc-table td:first-child { text-align: left; }
    .kvc-name {
      font-weight: 700; color: var(--text-primary);
    }
    .kvc-desc {
      font-family: var(--mono); font-size: 11px; color: var(--text-muted);
      display: block; margin-top: 3px; font-weight: 400; letter-spacing: 0.02em;
    }
    .kvc-num {
      font-family: var(--mono); font-size: 13px; color: var(--text-primary);
      font-variant-numeric: tabular-nums;
    }
    .kvc-count {
      font-family: var(--sans); font-weight: 700; font-size: 18px;
      color: var(--text-primary); font-variant-numeric: tabular-nums;
    }
    .kvc-count.zero { color: var(--neg); }

    .kvc-bar-track {
      position: relative; height: 16px; width: 100%;
      background: var(--bg-elevated); border: 1px solid var(--rule);
      border-radius: 3px; overflow: hidden;
    }
    .kvc-bar-fill {
      position: absolute; top: 0; left: 0; bottom: 0;
      background: var(--accent); opacity: 0.75;
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .kvc-bar-fill.zero { background: var(--neg); opacity: 0.4; }

    .kvc-caption {
      font-family: var(--mono); font-size: 11.5px;
      color: var(--text-muted); margin: 4px 0 0; line-height: 1.55;
    }
  `;

  function ensureStyle() {
    if (mount.querySelector('style.kvc-style')) return;
    const s = document.createElement('style');
    s.className = 'kvc-style';
    s.textContent = css;
    mount.appendChild(s);
  }

  // ---- render ----
  function render() {
    const p = PRESETS[state.presetIdx];
    const ctx = CONTEXTS[state.ctxIdx];
    const kvAvail = p.hbmBytes - p.weightsBytes;
    const kvPerTok = p.kvBytesPerToken;

    // Per-sequence cost under three regimes:
    //   naive  : reserve max ctx per slot, BF16 KV
    //   paged  : pay only for actual tokens (avg = ctx * AVG_RATIO), BF16 KV
    //   paged+ : paged AND FP8 KV cache (halves per-token bytes)
    const perNaive = ctx.n * kvPerTok;
    const perPaged = ctx.n * AVG_RATIO * kvPerTok;
    const perPagedQ = perPaged / 2;

    const rows = [
      { id: 'naive',
        name: 'Naive contiguous alloc',
        desc: 'Reserve max context per slot, BF16 KV. Pre-vLLM defaults.',
        perSeq: perNaive,
      },
      { id: 'paged',
        name: 'PagedAttention',
        desc: 'Pay only for tokens actually used (avg = max/2). BF16 KV.',
        perSeq: perPaged,
      },
      { id: 'pagedq',
        name: 'PagedAttention + FP8 KV',
        desc: 'Add per-request KV-cache quantization to FP8/INT8.',
        perSeq: perPagedQ,
      },
    ];

    // baseline for x-N ratio and bar scale
    const counts = rows.map(r => concurrent(kvAvail, r.perSeq));
    const maxCount = Math.max(...counts, 1);
    const baseline = counts[0] || 1;

    const rowsHtml = rows.map((r, i) => {
      const n = counts[i];
      const ratio = n / baseline;
      const barW = (n / maxCount) * 100;
      return `
      <tr>
        <td>
          <div class="kvc-name">${r.name}</div>
          <span class="kvc-desc">${r.desc}</span>
        </td>
        <td class="kvc-num">${fmtGB(r.perSeq)}</td>
        <td class="kvc-count ${n === 0 ? 'zero' : ''}">${n}
          ${i > 0 ? `<span style="font-family:var(--mono);font-size:11px;color:var(--text-muted);"> (&times;${ratio.toFixed(1)})</span>` : ''}
        </td>
        <td>
          <div class="kvc-bar-track">
            <div class="kvc-bar-fill ${n === 0 ? 'zero' : ''}" style="width: ${barW}%"></div>
          </div>
        </td>
      </tr>`;
    }).join('');

    const presetBtns = PRESETS.map((pp, i) =>
      `<button class="kvc-btn ${i === state.presetIdx ? 'active' : ''}" data-preset="${i}">${pp.label}</button>`
    ).join('');
    const ctxBtns = CONTEXTS.map((cc, i) =>
      `<button class="kvc-btn ${i === state.ctxIdx ? 'active' : ''}" data-ctx="${i}">${cc.label}</button>`
    ).join('');

    mount.querySelector('.kvc-body').innerHTML = `
      <div class="kvc-controls">
        <div class="kvc-ctrl-block">
          <div class="kvc-ctrl-label">serving node</div>
          <div class="kvc-btn-row">${presetBtns}</div>
        </div>
        <div class="kvc-ctrl-block">
          <div class="kvc-ctrl-label">max context per request</div>
          <div class="kvc-btn-row">${ctxBtns}</div>
        </div>
      </div>

      <div class="kvc-summary">
        <div class="kvc-cell">
          <div class="lbl">total HBM</div>
          <div class="val">${fmtGB(p.hbmBytes)}</div>
          <div class="sub">${p.label.split(' on ')[1] || ''}</div>
        </div>
        <div class="kvc-cell">
          <div class="lbl">weights resident</div>
          <div class="val">${fmtGB(p.weightsBytes)}</div>
          <div class="sub">fixed for the model</div>
        </div>
        <div class="kvc-cell">
          <div class="lbl">HBM for KV</div>
          <div class="val">${fmtGB(kvAvail)}</div>
          <div class="sub">HBM - weights</div>
        </div>
      </div>

      <p class="kvc-note">${p.note}</p>

      <table class="kvc-table">
        <colgroup>
          <col class="c-name"><col class="c-per"><col class="c-cnt"><col class="c-bar">
        </colgroup>
        <thead>
          <tr>
            <th>serving regime</th>
            <th>KV / seq</th>
            <th>concurrent</th>
            <th></th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>

      <p class="kvc-caption">
        Concurrent requests = floor((HBM - weights) / KV-per-seq). Paged assumes an average
        request length of half the max context - a rough stand-in for the shape of chat +
        reasoning traffic where most turns are short. Actual numbers on a real deployment
        depend on the workload's length distribution and how much prefix is shared across
        callers.
      </p>
    `;

    mount.querySelectorAll('[data-preset]').forEach(b => {
      b.addEventListener('click', () => {
        state.presetIdx = parseInt(b.dataset.preset, 10);
        render();
      });
    });
    mount.querySelectorAll('[data-ctx]').forEach(b => {
      b.addEventListener('click', () => {
        state.ctxIdx = parseInt(b.dataset.ctx, 10);
        render();
      });
    });
  }

  mount.innerHTML = `<div class="kvc-root"><div class="kvc-body"></div></div>`;
  ensureStyle();
  render();
})();
