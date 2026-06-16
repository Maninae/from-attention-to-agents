# From Attention to Agents — agent onboarding

Multi-chapter educational course site: the arc of modern AI from the 2017 Transformer to the 2026 reasoning-agent frontier. Audience is ML-literate but catching up from late-2019 (CNNs, attention just arriving in NLP).

Sibling site to [`prompt-evolution`](../prompt-evolution) — the canonical reference for design language and reusable demos. Chapter 4 of this course is essentially `prompt-evolution` re-homed into the multi-chapter shell.

## Run locally

```
python3 -m http.server 8000   # http://localhost:8000
```

Plain HTML + CSS + vanilla JS. No build step. Externals: Google Fonts + KaTeX, both CDN.

## The narrative spine

The recurring question: **where does the optimization happen — in the weights, or in the context?** Each chapter turns one lever.

| # | Slug | Era | Lever |
|---|------|-----|-------|
| 0 | `where-you-left-off` | 2017–2019 | Architecture |
| 1 | `scale-is-a-strategy` | 2020–2022 | Pretraining / scale |
| 2 | `teaching-it-to-be-helpful` | 2022 | Alignment (RLHF, CoT seed) |
| 3 | `the-recipe-gets-cheaper` | 2023–2024 | Alignment continued (DPO, GRPO, LoRA) |
| 4 | `steering-without-retraining` | 2022–2025 | Context / prompt |
| 5 | `learning-to-think` | 2024–2025 | Test-time compute |
| 6 | `learning-to-act` | 2024–2026 | Agency |
| 7 | `computational-cognition` | 2026 | Synthesis + voice-tool capstone |

Recurring threads (these make it a story, not a timeline):
- **CoT seed grows three times:** prompt trick (Ch2) → prompt-opt target (Ch4) → trained into weights (Ch5).
- **Democratization curve:** RLHF → DPO → GRPO; full-finetune → LoRA → QLoRA; closed → LLaMA → DeepSeek.
- **The reader's own thread:** QLoRA voice-tuning idea lives at Ch3; the Ch7 capstone resolves it by showing the prompt lane is the better path.
- **Eval shadow + Goodhart:** BBH → MMLU → SWE-bench → LLM-as-judge; reward-hacking as villain.
- **Multimodality is a thread, not a chapter:** appears in Ch1 (ViT/CLIP) and Ch7 (native-multimodal frontier).

Full chapter contracts in `workspace/BUILD-PLAN.md` (gitignored — agent scratch).

## Architecture

Dependency direction: `chapters/*.html → ../scripts/shared.js + per-demo scripts → ../styles/{shared,demos,glossary}.css tokens`.

| Path | Responsibility |
|------|----------------|
| `index.html` | Landing: hero + chapter card grid. Currently a stub; finalized by a later agent once chapter pages exist. |
| `chapters/chapterNN-slug.html` | One chapter. Sidebar + article. Imports `../styles/*` and `../scripts/*` relatively. |
| `styles/shared.css` | Design system: `:root` tokens, typography, callouts, sidebar TOC, nav, responsive. |
| `styles/demos.css` | Demo widget chrome (`.demo-wrap`, `.demo-head`, `.demo-btn`, hero, part cards, timeline styles). |
| `styles/glossary.css` | Inline glossary terms + right-rail panel. |
| `scripts/shared.js` | Scroll progress, auto TOC from h2/h3 inside `.article`, mobile nav, KaTeX render, math tooltips. |
| `scripts/glossary.js` | Click-to-open glossary panel; reads `window.GLOSSARY`. |
| `scripts/glossaryData.js` | Currently `window.GLOSSARY = {};` placeholder. A later sweep collects every `data-gloss` id introduced in chapters and writes the real entries. |
| `scripts/timeline.js` | Two-lane timeline (mounts `#timeline-demo`). |
| `scripts/rlComparison.js` | PPO/DPO/GRPO comparison (`#rl-demo`). |
| `scripts/promptSearch.js` | Propose → score → select loop (`#search-demo`). |
| `scripts/evolution.js` | Reflective evolution + Pareto frontier (`#evo-demo`). |
| `scripts/elo.js` | Pairwise → Elo leaderboard (`#elo-demo`). |

## Load-bearing conventions

- **Theme is a token swap.** All colors, fonts, spacing live as `:root` custom properties in `shared.css`. The theme is **light warm-paper, all-sans, no serifs, low-stimulation** — override the design-skill default which uses serifs. Never hardcode hex in component rules.
- **Multi-chapter, not single-page.** Each chapter is its own HTML at `chapters/chapterNN-slug.html`. Use relative paths `../styles/*` and `../scripts/*`. The sidebar TOC auto-builds per page from h2/h3 inside `.article`.
- **NO KaTeX in headings.** The TOC reads heading text. Use HTML entities (e.g. `&lambda;` not `$\lambda$`) inside h2/h3.
- **Required chapter scaffolding:** a `.lecture-roadmap` paragraph immediately after `<article>` opens; a `.lecture-nav-top` AND `.lecture-nav` (bottom) with prev/next pointers to adjacent chapters; section numbers on h2s via `<span class="section-number">N.</span>`.
- **Each demo is a self-contained IIFE.** Mounts by id (`document.getElementById(...)`, bail if absent), injects its own scoped `<style>` with prefixed classes (`tl-`/`rl-`/`ps-`/`ev-`/`el-`), reuses `.demo-btn` chrome, references only `:root` tokens. To add a new demo: mount `<div id="x-demo">` inside a `.demo-wrap` in a chapter, add `<script defer src="../scripts/x.js">`, follow `timeline.js` as the pattern.
- **Determinism.** Demos use fixed data or a seeded PRNG (mulberry32). Do NOT use `Math.random()` or `Date.now()`.
- **Glossary pattern.** Wrap background terms in `<span class="gloss" data-gloss="kebab-id">term</span>`. Do NOT write `glossaryData.js` from a chapter agent — a later sweep builds it. Every `data-gloss` id you introduce must be recorded in your `workspace/` build note.
- **Strategic color, sparingly.** `--pos` (dark green) / `--neg` (dark red) for yes/no or good/bad emphasis only. Color must stay rare to carry meaning.
- **Math tooltips.** Use `\htmlData{tip=...}` on the geometric-mean-difficulty term of complex formulas. Plain-ASCII tip text only.
- **Citations are non-negotiable.** Every claim, date, figure links inline to its primary source (arXiv / ACL / NeurIPS / official report). If you change a claim, re-verify against the source.
- **Voice.** Read `~/.claude/skills/owen-comms/SKILL.md`. Open on substance/mechanism (NEVER a throat-clearing or emotional-teaser hook), mixed register, sparse spaced-hyphens (not em-dashes), no tricolons, no "Moreover/Furthermore", uneven paragraphs.

## How to add a chapter

1. Copy a sibling chapter file as template (or build from scratch following conventions above).
2. Update `<title>`, `<meta description>`, sidebar title/subtitle, the eyebrow + h1, `.lecture-roadmap`, the prev/next nav cards (top and bottom), and the chapter body.
3. Link assets relatively: `../styles/shared.css`, `../styles/demos.css`, optionally `../styles/glossary.css`, plus `../scripts/shared.js` and `../scripts/glossaryData.js` + `../scripts/glossary.js` if you used `data-gloss` terms.
4. Verify locally with `python3 -m http.server 8000`: sidebar TOC populates, scroll progress moves, prev/next jump to adjacent chapters, no console errors.
5. Add your chapter card to `index.html` (or update the existing stub if details change).
6. Write a build note in `workspace/` recording: claims + sources, glossary ids introduced, demos used.

## What lives in `workspace/`

Gitignored agent scratch — build plan, claim sheets, research notes, review notes. Never ships. The orchestrator dumps `.md` here so agents don't pollute each other's context.
