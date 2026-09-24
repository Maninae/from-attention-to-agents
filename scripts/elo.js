/* ============================================================
   Elo from pairwise clicks — the voice tool's reward signal.
   Five candidate "style prompts" rewrite the same sentence;
   you click which one sounds more like you. A standard Elo
   update (K = 32) turns binary clicks into a scalar ranking.
   No deps. Deterministic matchup order. IIFE-mounted by id.
   ============================================================ */
(function () {
  const mount = document.getElementById('elo-demo');
  if (!mount) return;

  // ---- candidates ---------------------------------------------------------
  const BASE = "I am writing to inform you that the project has been completed ahead of schedule.";
  const CANDIDATES = [
    { id: 'corp',  label: 'Corporate', text: 'Please be advised the project has reached completion ahead of the projected timeline.' },
    { id: 'acad',  label: 'Academic',  text: 'The project was concluded in advance of its scheduled completion date.' },
    { id: 'warm',  label: 'Warm',      text: 'Good news, we wrapped the project early!' },
    { id: 'terse', label: 'Terse',     text: "Project's done, ahead of schedule." },
    { id: 'owen',  label: 'Owen-ish',  text: "Heads up: project's done, and we beat the deadline." },
  ];

  // ---- fixed matchup order (round-robin-ish, 9 pairs) ---------------------
  // covers every candidate at least 3 times, no immediate repeats.
  const MATCHUPS = [
    ['corp',  'warm'],
    ['acad',  'terse'],
    ['owen',  'corp'],
    ['warm',  'acad'],
    ['terse', 'owen'],
    ['corp',  'acad'],
    ['warm',  'terse'],
    ['owen',  'acad'],
    ['corp',  'terse'],
  ];

  // ---- state --------------------------------------------------------------
  const K = 32;
  const ratings = Object.fromEntries(CANDIDATES.map(c => [c.id, 1000]));
  let step = 0;        // index into MATCHUPS
  let votes = 0;

  // ---- scoped styles ------------------------------------------------------
  const style = document.createElement('style');
  style.textContent = `
    .el-wrap { max-width: 760px; margin: 0 auto; font-family: var(--sans); color: var(--text-primary); }
    .el-base {
      font-family: var(--mono); font-size: 12px; color: var(--text-muted);
      border: 1px dashed var(--rule); border-radius: 8px;
      padding: 10px 12px; margin: 0 0 18px;
      background: var(--bg-elevated);
    }
    .el-base b { color: var(--text-secondary); font-weight: 600; }
    .el-prompt {
      font-family: var(--mono); font-size: 12px;
      color: var(--teal);
      margin: 0 0 10px;
    }
    .el-round { font-family: var(--mono); font-size: 11px; color: var(--text-muted); float: right; }
    .el-pair {
      display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
      margin: 0 0 14px;
    }
    .el-card {
      display: flex; flex-direction: column;
      border: 1px solid var(--rule-strong);
      border-radius: 10px;
      background: var(--bg-elevated);
      padding: 14px 14px 12px;
      text-align: left;
      cursor: pointer;
      font: inherit;
      color: inherit;
      transition: border-color 0.15s, background 0.15s, transform 0.08s;
    }
    .el-card:hover { border-color: var(--accent-border); background: var(--bg-surface); }
    .el-card:focus-visible { outline: none; border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-light); }
    .el-card:active { transform: translateY(1px); }
    .el-card .el-side {
      font-family: var(--mono); font-size: 11px;
      color: var(--accent); margin-bottom: 6px;
    }
    .el-card .el-rewrite {
      font-family: var(--serif, var(--sans)); font-size: 15px; line-height: 1.45;
      color: var(--text-primary); margin: 0 0 10px;
    }
    .el-card .el-pick {
      margin-top: auto;
      font-family: var(--mono); font-size: 11px; color: var(--text-secondary);
    }
    .el-card .el-pick::before { content: "→ "; color: var(--accent); }

    .el-board {
      border-top: 1px solid var(--rule);
      padding-top: 14px; margin-top: 6px;
    }
    .el-board-head {
      display: flex; justify-content: space-between; align-items: baseline;
      margin-bottom: 10px;
    }
    .el-board-title {
      font-family: var(--mono); font-size: 12px;
      color: var(--text-secondary);
    }
    .el-tally { font-family: var(--mono); font-size: 11px; color: var(--text-muted); }
    .el-row {
      display: grid; grid-template-columns: 90px 1fr 56px;
      align-items: center; gap: 10px;
      padding: 5px 0;
      transition: transform 0.25s ease;
    }
    .el-row .el-name {
      font-family: var(--mono); font-size: 12px; color: var(--text-secondary);
    }
    .el-row.lead .el-name { color: var(--accent); font-weight: 600; }
    .el-bar {
      position: relative;
      height: 10px;
      background: var(--bg-elevated);
      border-radius: 5px;
      overflow: hidden;
    }
    .el-bar-fill {
      position: absolute; left: 0; top: 0; bottom: 0;
      background: var(--teal);
      border-radius: 5px;
      transition: width 0.35s ease, background 0.2s;
    }
    .el-row.lead .el-bar-fill { background: var(--accent); }
    .el-row .el-r {
      font-family: var(--mono); font-size: 12px; color: var(--text-secondary);
      text-align: right;
    }

    .el-done {
      text-align: center;
      padding: 18px 12px;
      border: 1px solid var(--rule-strong);
      border-radius: 10px;
      background: var(--bg-elevated);
      margin: 0 0 14px;
    }
    .el-done p {
      margin: 0 0 12px;
      font-size: 15px; color: var(--text-secondary);
    }
    .el-done b { color: var(--accent); }

    .el-caption {
      margin: 18px 0 0;
      padding-top: 14px;
      border-top: 1px solid var(--rule);
      font-size: 14px; line-height: 1.5; color: var(--text-secondary);
    }
    .el-caption .el-note {
      display: block; margin-top: 8px;
      font-family: var(--mono); font-size: 11px; color: var(--text-muted);
    }

    @media (max-width: 560px) {
      .el-pair { grid-template-columns: 1fr; }
      .el-row { grid-template-columns: 78px 1fr 50px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .el-bar-fill, .el-row, .el-card { transition: none; }
    }
  `;
  mount.appendChild(style);

  // ---- skeleton ----------------------------------------------------------
  const wrap = document.createElement('div');
  wrap.className = 'el-wrap';
  wrap.innerHTML = `
    <p class="el-base"><b>Sample sentence.</b> ${BASE}</p>
    <div class="el-prompt">Which sounds more like you? <span class="el-round" id="el-round"></span></div>
    <div id="el-stage"></div>
    <div class="el-board" aria-live="polite">
      <div class="el-board-head">
        <span class="el-board-title">Leaderboard: Elo rating</span>
        <span class="el-tally" id="el-tally">0 votes</span>
      </div>
      <div id="el-rows"></div>
    </div>
    <p class="el-caption">
      This is the voice tool's reward signal. You never score anything 1–10; you just click which sounds more like you, and Bradley–Terry / Elo turns those clicks into a number the optimizer can climb.
      <span class="el-note">Real systems then calibrate an LLM judge against these human clicks for throughput.</span>
    </p>
  `;
  mount.appendChild(wrap);

  const stage = wrap.querySelector('#el-stage');
  const rowsEl = wrap.querySelector('#el-rows');
  const tallyEl = wrap.querySelector('#el-tally');
  const roundEl = wrap.querySelector('#el-round');

  const byId = Object.fromEntries(CANDIDATES.map(c => [c.id, c]));

  // ---- Elo update (standard) ---------------------------------------------
  // expected_A = 1 / (1 + 10^((R_B - R_A) / 400))
  // R_A' = R_A + K * (S_A - E_A);   S_winner = 1, S_loser = 0
  function updateElo(winnerId, loserId) {
    const Rw = ratings[winnerId];
    const Rl = ratings[loserId];
    const Ew = 1 / (1 + Math.pow(10, (Rl - Rw) / 400));
    const El = 1 - Ew;
    ratings[winnerId] = Rw + K * (1 - Ew);
    ratings[loserId]  = Rl + K * (0 - El);
  }

  // ---- render: matchup ---------------------------------------------------
  function renderMatchup() {
    if (step >= MATCHUPS.length) { renderDone(); return; }
    const [aId, bId] = MATCHUPS[step];
    const a = byId[aId], b = byId[bId];
    roundEl.textContent = `pair ${step + 1} / ${MATCHUPS.length}`;
    stage.innerHTML = `
      <div class="el-pair">
        <button class="el-card" data-winner="${a.id}" data-loser="${b.id}" type="button" aria-label="Pick ${a.label}, it sounds more like me">
          <span class="el-side">A &middot; ${a.label}</span>
          <p class="el-rewrite">${a.text}</p>
          <span class="el-pick">A sounds more like me</span>
        </button>
        <button class="el-card" data-winner="${b.id}" data-loser="${a.id}" type="button" aria-label="Pick ${b.label}, it sounds more like me">
          <span class="el-side">B &middot; ${b.label}</span>
          <p class="el-rewrite">${b.text}</p>
          <span class="el-pick">B sounds more like me</span>
        </button>
      </div>
    `;
    stage.querySelectorAll('.el-card').forEach(btn => {
      btn.addEventListener('click', () => {
        updateElo(btn.dataset.winner, btn.dataset.loser);
        votes += 1;
        step += 1;
        renderBoard();
        renderMatchup();
      });
    });
    // Focus the first card so keyboard users land on a button.
    const first = stage.querySelector('.el-card');
    if (first && document.activeElement === document.body) first.focus({ preventScroll: true });
  }

  // ---- render: leaderboard -----------------------------------------------
  function renderBoard() {
    tallyEl.textContent = `${votes} vote${votes === 1 ? '' : 's'}`;
    const sorted = CANDIDATES.slice().sort((x, y) => ratings[y.id] - ratings[x.id]);
    const rs = sorted.map(c => ratings[c.id]);
    const maxR = Math.max(...rs);
    const minR = Math.min(...rs);
    const span = Math.max(40, maxR - minR); // floor so bars are visible at start
    const top = sorted[0].id;
    rowsEl.innerHTML = sorted.map(c => {
      const r = ratings[c.id];
      // 14% baseline so even last place has a visible nub at the start.
      const pct = 14 + 86 * ((r - minR) / span);
      const lead = (c.id === top && votes > 0) ? ' lead' : '';
      return `
        <div class="el-row${lead}">
          <span class="el-name">${c.label}</span>
          <div class="el-bar"><div class="el-bar-fill" style="width:${pct.toFixed(1)}%"></div></div>
          <span class="el-r">${Math.round(r)}</span>
        </div>
      `;
    }).join('');
  }

  // ---- render: done ------------------------------------------------------
  function renderDone() {
    roundEl.textContent = `complete`;
    const sorted = CANDIDATES.slice().sort((x, y) => ratings[y.id] - ratings[x.id]);
    const winner = sorted[0];
    stage.innerHTML = `
      <div class="el-done">
        <p><b>${votes} votes</b> &rarr; a full ranking. Top voice: <b>${winner.label}</b> (${Math.round(ratings[winner.id])}).</p>
        <button class="demo-btn primary" id="el-reset" type="button">Reset</button>
      </div>
    `;
    stage.querySelector('#el-reset').addEventListener('click', reset);
  }

  function reset() {
    for (const c of CANDIDATES) ratings[c.id] = 1000;
    step = 0;
    votes = 0;
    renderBoard();
    renderMatchup();
  }

  // ---- boot --------------------------------------------------------------
  renderBoard();
  renderMatchup();
})();
