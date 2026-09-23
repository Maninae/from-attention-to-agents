/* ============================================================
   KV cache calculator - MHA vs MQA vs GQA vs MLA
   Deterministic. No PRNG. One reference model, shared across
   all four variants: DeepSeek-V3-shape (128 attention heads,
   head_dim 128, 61 layers, BF16). This is the architecture MLA
   was actually deployed on, so the MLA number is the value
   DeepSeek chose for THIS shape rather than a spec pulled from
   an unrelated reference. MHA/GQA/MQA bars show what the cache
   would look like if you swapped MLA for each dense variant on
   the SAME shape (same heads, head_dim, layer count) so the
   comparison is apples-to-apples.
   Adjust context length, see per-sequence KV memory across
   variants. Mounts on #kv-demo.
   ============================================================ */
(function () {
  const mount = document.getElementById('kv-demo');
  if (!mount) return;

  // Reference model: DeepSeek-V3-shape (128 heads, head_dim 128, 61 layers).
  // Bytes: BF16 = 2 bytes per element.
  const HEADS = 128;
  const HEAD_DIM = 128;
  const LAYERS = 61;
  const BYTES = 2;

  // MLA numbers from DeepSeek-V2/V3 config (arXiv:2405.04434, arXiv:2412.19437):
  // kv_lora_rank = 512 (compressed latent KV) + qk_rope_head_dim = 64
  // (decoupled RoPE key that is NOT compressed) = 576 elements per token
  // per layer. This is the actual per-token cache MLA carries in DeepSeek-V3,
  // measured against the same 61-layer 128-head shape used for the other bars.
  const MLA_ELEMS_PER_TOKEN_PER_LAYER = 576;

  // GQA groups: Llama-3-70B (a 64-head model) uses 8 KV heads; carry the same
  // group count over as a representative dense-attention baseline.
  const DEFAULT_GQA = 8;

  const VARIANTS = [
    {
      id: 'mha',
      name: 'MHA',
      long: 'Multi-head attention',
      color: 'var(--neg)',
      elemsPerTokPerLayer: () => 2 * HEADS * HEAD_DIM,
      note: '2 &times; n_heads &times; head_dim per token per layer'
    },
    {
      id: 'gqa',
      name: 'GQA-8',
      long: 'Grouped-query attention (8 KV heads)',
      color: 'var(--accent)',
      elemsPerTokPerLayer: () => 2 * DEFAULT_GQA * HEAD_DIM,
      note: '2 &times; n_kv_heads &times; head_dim per token per layer'
    },
    {
      id: 'mqa',
      name: 'MQA',
      long: 'Multi-query attention (1 KV head)',
      color: 'var(--teal)',
      elemsPerTokPerLayer: () => 2 * 1 * HEAD_DIM,
      note: 'One K/V head shared across all Q heads'
    },
    {
      id: 'mla',
      name: 'MLA',
      long: 'Multi-head latent attention (DeepSeek-V2)',
      color: 'var(--blue)',
      elemsPerTokPerLayer: () => MLA_ELEMS_PER_TOKEN_PER_LAYER,
      note: 'Cache a compressed latent + decoupled RoPE key'
    }
  ];

  function bytesFor(variant, ctx) {
    return variant.elemsPerTokPerLayer() * BYTES * ctx * LAYERS;
  }
  function fmtMB(b) {
    if (b < 1024) return b.toFixed(0) + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
    if (b < 1024 * 1024 * 1024) return (b / (1024 * 1024)).toFixed(1) + ' MB';
    return (b / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  }

  const css = `
    .kv-wrap { max-width: 720px; margin: 0 auto; font-family: var(--sans); }
    .kv-frame { font-family: var(--mono); font-size: 12px; color: var(--text-muted); margin: 4px 0 18px; letter-spacing: 0.02em; }
    .kv-controls {
      display: grid; grid-template-columns: 130px 1fr 120px;
      gap: 12px; align-items: center;
      padding: 14px 16px; margin-bottom: 18px;
      border: 1px solid var(--rule);
      background: var(--bg-elevated);
      border-radius: 10px;
    }
    .kv-controls label { font-size: 13px; color: var(--text-secondary); }
    .kv-controls input[type=range] {
      width: 100%;
      accent-color: var(--accent);
    }
    .kv-value {
      font-family: var(--mono); font-size: 13px;
      color: var(--text-primary); text-align: right;
    }
    .kv-value .unit { color: var(--text-muted); font-size: 11px; margin-left: 3px; }
    .kv-row {
      display: grid;
      grid-template-columns: 96px 1fr 130px;
      align-items: center; gap: 14px;
      padding: 10px 0;
      border-top: 1px solid var(--rule);
    }
    .kv-row:first-child { border-top: none; }
    .kv-label { font-weight: 700; font-size: 14px; color: var(--text-primary); }
    .kv-sub { font-family: var(--mono); font-size: 11px; color: var(--text-muted); margin-top: 2px; }
    .kv-bar-track {
      position: relative; height: 16px;
      background: var(--bg-elevated); border: 1px solid var(--rule);
      border-radius: 4px; overflow: hidden;
    }
    .kv-bar-fill { position: absolute; top: 0; left: 0; bottom: 0; transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
    .kv-amt { font-family: var(--sans); font-weight: 700; font-size: 16px; color: var(--text-primary); text-align: right; }
    .kv-note {
      margin-top: 14px; padding: 12px 14px;
      background: var(--accent-light); border: 1px solid var(--accent-border);
      border-radius: 8px; font-size: 13px; color: var(--text-secondary); line-height: 1.55;
    }
    .kv-note strong { color: var(--text-primary); }
    @media (prefers-reduced-motion: reduce) {
      .kv-bar-fill { transition: none; }
    }
    @media (max-width: 640px) {
      .kv-controls { grid-template-columns: 90px 1fr 90px; gap: 8px; padding: 12px; }
      .kv-row { grid-template-columns: 76px 1fr 96px; gap: 10px; }
    }
  `;

  mount.innerHTML = `
    <div class="kv-wrap">
      <p class="kv-frame">Reference: DeepSeek-V3 shape (128 heads, head_dim 128, 61 layers, BF16). Per-sequence KV cache = elements &times; 2 bytes &times; ctx_len &times; layers. MHA / GQA / MQA bars are the counterfactual dense-attention caches on the same shape; MLA is DeepSeek's actual latent (kv_lora_rank 512 + rope_head_dim 64 = 576 elems/tok/layer).</p>
      <div class="kv-controls">
        <label for="kv-ctx">Context length</label>
        <input id="kv-ctx" type="range" min="1" max="128" step="1" value="8">
        <div class="kv-value"><span id="kv-ctx-val">8</span><span class="unit">k tokens</span></div>
      </div>
      <div id="kv-rows"></div>
      <div class="kv-note" id="kv-note"></div>
    </div>
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  mount.appendChild(styleEl);

  const rowsEl = mount.querySelector('#kv-rows');
  const ctxRange = mount.querySelector('#kv-ctx');
  const ctxVal = mount.querySelector('#kv-ctx-val');
  const noteEl = mount.querySelector('#kv-note');

  function render() {
    const ctxK = parseInt(ctxRange.value, 10);
    ctxVal.textContent = ctxK;
    const ctx = ctxK * 1024;
    const sizes = VARIANTS.map(v => ({ v, bytes: bytesFor(v, ctx) }));
    const maxBytes = Math.max(...sizes.map(s => s.bytes));
    rowsEl.innerHTML = sizes.map(({ v, bytes }) => `
      <div class="kv-row">
        <div>
          <div class="kv-label" style="color:${v.color}">${v.name}</div>
          <div class="kv-sub">${v.long}</div>
        </div>
        <div class="kv-bar-track"><div class="kv-bar-fill" style="width:${(bytes / maxBytes) * 100}%; background:${v.color}; opacity:0.75"></div></div>
        <div class="kv-amt">${fmtMB(bytes)}</div>
      </div>
    `).join('');

    const mha = sizes.find(s => s.v.id === 'mha').bytes;
    const gqa = sizes.find(s => s.v.id === 'gqa').bytes;
    const mla = sizes.find(s => s.v.id === 'mla').bytes;
    const gqaRatio = (mha / gqa).toFixed(1);
    const mlaRatio = (mha / mla).toFixed(1);
    noteEl.innerHTML = `At <strong>${ctxK}k</strong> context on this shape, swapping dense MHA for GQA-8 shrinks the per-sequence cache <strong>${gqaRatio}&times;</strong>; swapping in MLA shrinks it <strong>${mlaRatio}&times;</strong>. Multiply by batch size to see why a serving stack picks the variant it does.`;
  }

  ctxRange.addEventListener('input', render);
  render();
})();
