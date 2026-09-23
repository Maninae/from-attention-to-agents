/* ============================================================
   In-context learning mini demo — what GPT-3 showed in 2020.
   The same instruction with 0, 1, or 3 demonstrations placed in
   the prompt; output crystallizes as demos appear. No model is
   actually called. The outputs are canned strings — the point is
   the SHAPE of the conditioning, not a live inference.
   Self-contained IIFE. Mounts into #icl-demo.
   ============================================================ */
(function () {
  const mount = document.getElementById('icl-demo');
  if (!mount) return;

  // Pig Latin is a clean toy task: clearly rule-based, no prior
  // training-set leakage to worry about, and reads in one glance.
  const INSTRUCTION = 'Translate English to Pig Latin.';
  const DEMOS = [
    { en: 'apple',    pl: 'apple-way'   },
    { en: 'banana',   pl: 'anana-bay'   },
    { en: 'chair',    pl: 'air-chay'    },
  ];
  const QUERY = 'pencil';

  // Canned "model outputs" at each shot count. The 0-shot output is
  // deliberately a refusal-style document continuation — that's the
  // base-LM-as-document-completer shape Ch1 wants to plant for Ch2.
  const OUTPUTS = {
    0: { text: '...into Pig Latin, a children’s word game in which English syllables are rearranged according to a set of simple rules.',
         right: false, note: 'no demos - the base model continues the document instead of doing the task.' },
    1: { text: 'pencil-way',
         right: false, note: '1 demo - the model copied the surface form of "apple-way" instead of inferring the rule.' },
    3: { text: 'encil-pay',
         right: true,  note: '3 demos - with enough examples the underlying rule (move first consonant cluster to the end + "ay") snaps into place. No weights changed.' },
  };

  const css = `
    .icl-root { max-width: 700px; margin: 0 auto; font-family: var(--sans); }
    .icl-controls {
      display: flex; flex-wrap: wrap; gap: 8px;
      margin-bottom: 14px;
    }
    .icl-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    @media (max-width: 560px) { .icl-grid { grid-template-columns: 1fr; } }
    .icl-pane {
      border: 1px solid var(--rule); border-radius: 10px;
      background: var(--bg-elevated); padding: 14px 16px;
    }
    .icl-tag {
      font-family: var(--mono); font-size: 10px; text-transform: uppercase;
      letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 8px;
    }
    .icl-prompt, .icl-output {
      font-family: var(--mono); font-size: 13px; line-height: 1.55;
      color: var(--text-primary); white-space: pre-wrap;
      min-height: 9.5em;
    }
    .icl-prompt .icl-instr { color: var(--accent); }
    .icl-prompt .icl-demo { color: var(--text-secondary); }
    .icl-prompt .icl-query { color: var(--text-primary); font-weight: 600; }
    .icl-output .icl-arrow { color: var(--text-muted); }
    .icl-output.right .icl-result { color: var(--pos); font-weight: 600; }
    .icl-output.wrong .icl-result { color: var(--neg); font-weight: 600; }
    .icl-note {
      margin-top: 10px;
      font-family: var(--sans); font-size: 13px; color: var(--text-secondary);
      line-height: 1.5;
    }
  `;
  const style = document.createElement('style'); style.textContent = css; mount.appendChild(style);

  const root = document.createElement('div'); root.className = 'icl-root';
  root.innerHTML = `
    <div class="icl-controls" role="tablist" aria-label="Number of in-context demonstrations">
      <button class="demo-btn" data-k="0" role="tab">0-shot</button>
      <button class="demo-btn" data-k="1" role="tab">1-shot</button>
      <button class="demo-btn primary" data-k="3" role="tab">3-shot</button>
    </div>
    <div class="icl-grid">
      <div class="icl-pane">
        <div class="icl-tag">Prompt (the only thing that changes)</div>
        <div class="icl-prompt" id="icl-prompt"></div>
      </div>
      <div class="icl-pane">
        <div class="icl-tag">Model output</div>
        <div class="icl-output" id="icl-output"></div>
        <p class="icl-note" id="icl-note"></p>
      </div>
    </div>
  `;
  mount.appendChild(root);

  const promptEl = root.querySelector('#icl-prompt');
  const outputEl = root.querySelector('#icl-output');
  const noteEl   = root.querySelector('#icl-note');
  const buttons  = root.querySelectorAll('.demo-btn');

  function render(k) {
    let p = `<span class="icl-instr">${INSTRUCTION}</span>\n\n`;
    for (let i = 0; i < k; i++) {
      const d = DEMOS[i];
      p += `<span class="icl-demo">English: ${d.en}\nPig Latin: ${d.pl}</span>\n\n`;
    }
    p += `<span class="icl-query">English: ${QUERY}\nPig Latin:</span>`;
    promptEl.innerHTML = p;

    const o = OUTPUTS[k];
    outputEl.className = 'icl-output ' + (o.right ? 'right' : 'wrong');
    outputEl.innerHTML = `<span class="icl-arrow">&rarr; </span><span class="icl-result">${o.text}</span>`;
    noteEl.innerHTML = o.note;

    buttons.forEach(b => {
      const sel = +b.dataset.k === k;
      b.classList.toggle('primary', sel);
    });
  }

  buttons.forEach(b => b.addEventListener('click', () => render(+b.dataset.k)));
  render(3);
})();
