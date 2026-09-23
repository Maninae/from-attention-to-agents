/* ============================================================
   Transformer block — a clean SVG anatomy of one encoder block.
   Hover or focus a sub-block to surface a one-line explanation.
   Mounts on #transformer-demo. Pure SVG, no dependencies.

   The block is laid out vertically, mirroring Vaswani Figure 1
   (encoder side): input embed + positional encoding -> Q/K/V
   projection -> scaled dot-product attention -> multi-head
   concat + output projection -> add & norm -> FFN -> add & norm.
   ============================================================ */
(function () {
  const mount = document.getElementById('transformer-demo');
  if (!mount) return;

  const W = 760, H = 540;

  // x positions for the main column and the residual-skip rail
  const CX = 380;
  const RAIL = 660;
  const BOX_W = 360, BOX_H = 46;

  // Each step in the encoder block, top -> bottom.
  // y = vertical center; kind controls the chrome.
  const STEPS = [
    { id: 'embed',  y:  46, label: 'Input embedding + positional encoding',
      blurb: 'Token ids become 512-dim vectors. Sinusoidal positional encodings are added so the model knows order - without them self-attention is permutation-equivariant.' },
    { id: 'qkv',    y: 116, label: 'Linear projections: Q, K, V',
      blurb: 'Three learned linear maps split each token vector into Query, Key, and Value. Each head gets its own slice (d_model / h dims per head, h = 8 in the base model).' },
    { id: 'attn',   y: 186, label: 'Scaled dot-product attention',
      blurb: 'Attention(Q,K,V) = softmax(QKᵀ / √d_k) · V. Every token aggregates a weighted mix of all other tokens - O(n²·d) per layer but only O(1) sequential steps.' },
    { id: 'concat', y: 256, label: 'Multi-head concat + output projection',
      blurb: 'The 8 heads run in parallel on different subspaces; their outputs are concatenated and passed through one more linear projection back to d_model.' },
    { id: 'an1',    y: 320, label: 'Add & LayerNorm',
      blurb: 'Residual connection from the block input, then LayerNorm. The skip lets gradients flow and lets a layer learn the identity if it has nothing useful to add.' },
    { id: 'ffn',    y: 390, label: 'Position-wise feed-forward (FFN)',
      blurb: 'Two linear layers with a ReLU in between, applied independently to every position. Inner width d_ff = 2048 in the base model - most of the parameters live here.' },
    { id: 'an2',    y: 454, label: 'Add & LayerNorm',
      blurb: 'Second residual + LayerNorm. The block output has the same shape as its input, so you can stack N = 6 of them and feed the top into a decoder or a classification head.' },
  ];

  // Connections between successive steps (simple straight lines)
  const conns = [];
  for (let i = 0; i < STEPS.length - 1; i++) {
    conns.push([STEPS[i].y + BOX_H / 2, STEPS[i + 1].y - BOX_H / 2]);
  }

  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Anatomy of one Transformer encoder block">`;

  // residual rail (decorative — the skips below reference it)
  s += `<line x1="${RAIL}" y1="${STEPS[0].y}" x2="${RAIL}" y2="${STEPS[6].y}" stroke="var(--rule)" stroke-dasharray="2 4"/>`;

  // straight inter-step connectors
  conns.forEach(([y1, y2]) => {
    s += `<line x1="${CX}" y1="${y1}" x2="${CX}" y2="${y2}" stroke="var(--rule-strong)" stroke-width="1.5"/>`;
  });

  // residual skip 1: from after embed (top of qkv) around to before add&norm 1
  const skip = (yFrom, yTo, label) => {
    const xA = CX + BOX_W / 2;
    return (
      `<path d="M${xA} ${yFrom} C ${RAIL + 30} ${yFrom}, ${RAIL + 30} ${yTo}, ${xA} ${yTo}"
              fill="none" stroke="var(--teal)" stroke-width="1.5" opacity="0.55"/>` +
      `<text x="${RAIL + 36}" y="${(yFrom + yTo) / 2 + 4}" font-family="var(--mono)" font-size="11"
             fill="var(--teal)" opacity="0.8">${label}</text>`
    );
  };
  s += skip(STEPS[0].y, STEPS[4].y, 'residual');
  s += skip(STEPS[4].y, STEPS[6].y, 'residual');

  // boxes — each is a focusable group with a tooltip
  STEPS.forEach((st, i) => {
    // Color: attention + FFN are the load-bearing computation; others are plumbing
    const isCore = (st.id === 'attn' || st.id === 'ffn');
    const fill = isCore ? 'var(--accent-light)' : 'var(--bg-elevated)';
    const stroke = isCore ? 'var(--accent-border)' : 'var(--rule-strong)';
    const labelColor = isCore ? 'var(--accent)' : 'var(--text-primary)';
    s += `<g class="tb-step" data-id="${st.id}" tabindex="0">
      <rect x="${CX - BOX_W / 2}" y="${st.y - BOX_H / 2}" width="${BOX_W}" height="${BOX_H}"
            rx="10" ry="10" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <text x="${CX}" y="${st.y + 5}" text-anchor="middle"
            font-family="var(--sans)" font-size="14" font-weight="600" fill="${labelColor}">${st.label}</text>
    </g>`;
  });

  // Top arrow (input) and bottom arrow (output)
  s += `<text x="${CX}" y="18" text-anchor="middle" font-family="var(--mono)" font-size="11"
          fill="var(--text-muted)">input tokens (n positions)</text>`;
  s += `<text x="${CX}" y="${H - 8}" text-anchor="middle" font-family="var(--mono)" font-size="11"
          fill="var(--text-muted)">block output - same shape, fed into the next of N=6 layers</text>`;

  s += `</svg>`;

  mount.innerHTML =
    `<div class="tb-wrap">${s}</div>
     <div class="tb-detail" id="tb-detail">
       <p class="placeholder">Hover or click a sub-block. The two highlighted boxes are where the math happens; the rest is plumbing that makes deep stacks trainable.</p>
     </div>`;

  // ---- scoped styles ----
  const css = `
    .tb-wrap svg { display:block; width:100%; height:auto; max-width:760px; margin:0 auto; }
    .tb-step { cursor:pointer; outline:none; }
    .tb-step rect { transition: filter 0.15s, stroke-width 0.15s; }
    .tb-step:hover rect, .tb-step.sel rect { stroke: var(--accent); stroke-width: 2; }
    .tb-step:focus-visible rect { stroke: var(--accent); stroke-width: 2.5; }
    .tb-detail {
      margin-top: 18px;
      border-top: 1px solid var(--rule);
      padding-top: 16px;
      min-height: 64px;
    }
    .tb-detail h4 { margin: 0 0 6px; font-size: 16px; color: var(--text-primary); }
    .tb-detail p { margin: 0; color: var(--text-secondary); font-size: 15px; }
    .tb-detail .placeholder { color: var(--text-muted); font-style: italic; }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  mount.appendChild(styleEl);

  // ---- interaction ----
  const detail = mount.querySelector('#tb-detail');
  const byId = Object.fromEntries(STEPS.map(st => [st.id, st]));
  const select = (id) => {
    const st = byId[id]; if (!st) return;
    mount.querySelectorAll('.tb-step').forEach(g => g.classList.toggle('sel', g.dataset.id === id));
    detail.innerHTML = `<h4>${st.label}</h4><p>${st.blurb}</p>`;
  };
  mount.querySelectorAll('.tb-step').forEach(g => {
    g.addEventListener('click', () => select(g.dataset.id));
    g.addEventListener('mouseenter', () => select(g.dataset.id));
    g.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(g.dataset.id); }
    });
  });
})();
