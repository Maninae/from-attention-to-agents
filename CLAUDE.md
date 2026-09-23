# From Attention to Agents - agent onboarding

Multi-chapter educational course site: the arc of modern AI from the 2017 Transformer to the September-2026 reasoning-agent frontier. Audience is ML-literate but catching up from late-2019 (CNNs, attention just arriving in NLP).

## Run locally

```
python3 -m http.server 8000   # http://localhost:8000
```

Plain HTML + CSS + vanilla JS. No build step. Externals: Google Fonts + KaTeX, both CDN.

## The narrative spine

The recurring question: **where does the optimization happen - in the weights, or in the context?** Each chapter turns one lever.

| # | Slug | Era | Lever |
|---|------|-----|-------|
| 0 | `where-you-left-off` | 2017 - 2019 | Architecture |
| 1 | `scale-is-a-strategy` | 2020 - 2022 | Scale |
| 2 | `inside-a-modern-pretraining-run` | 2023 - 2026 | Efficiency (data, architecture, numerics) |
| 3 | `teaching-it-to-be-helpful` | 2022 | Alignment (RLHF, CAI, CoT seed) |
| 4 | `the-recipe-gets-cheaper` | 2023 - 2026 | Democratization (DPO family, LoRA/QLoRA, Tulu 3, RLVR) |
| 5 | `steering-without-retraining` | 2022 - 2026 | Context / prompt |
| 6 | `learning-to-think` | 2024 - 2026 | Test-time compute |
| 7 | `reinforcement-learning-grows-up` | 2025 - 2026 | Reward (RL at scale) |
| 8 | `paying-for-thought` | 2023 - 2026 | Inference systems |
| 9 | `learning-to-act` | 2024 - 2026 | Agency |
| 10 | `measuring-what-we-built` | 2020 - 2026 | Measurement + trust |
| 11 | `computational-cognition` | 2026 | Synthesis + voice-tool capstone |

Recurring threads (these make it a story, not a timeline):
- **CoT seed grows three times:** prompt trick (Ch3) -> prompt-opt target (Ch5) -> trained into weights (Ch6).
- **Democratization curve:** RLHF -> DPO -> GRPO; full-finetune -> LoRA -> QLoRA; closed -> LLaMA -> DeepSeek -> Kimi.
- **The reader's own thread:** QLoRA voice-tuning idea lives at Ch4; the Ch11 capstone resolves it by showing the prompt lane is the better path.
- **Eval shadow + Goodhart:** BBH -> MMLU -> SWE-bench -> LLM-as-judge -> HLE culminates in Ch10.
- **Multimodality is a thread, not a chapter:** appears in Ch1 (ViT/CLIP) and Ch11 (native-multimodal frontier).

Full chapter contracts in `workspace/BUILD-PLAN.md` and `workspace/REFRESH-PLAN.md` (gitignored - agent scratch).

## Architecture

Dependency direction: `chapters/*.html -> ../scripts/shared.js + per-demo scripts -> ../styles/{shared,demos,glossary}.css tokens`.

| Path | Responsibility |
|------|----------------|
| `index.html` | Landing: hero + twelve chapter cards. |
| `chapters/chapterNN-slug.html` | One chapter. Sidebar + article. Imports `../styles/*` and `../scripts/*` relatively. |
| `styles/shared.css` | Design system: `:root` tokens, typography, callouts, sidebar TOC, nav, responsive. |
| `styles/demos.css` | Demo widget chrome (`.demo-wrap`, `.demo-head`, `.demo-btn`, hero, part cards, timeline styles). |
| `styles/glossary.css` | Inline glossary terms + right-rail panel. |
| `scripts/shared.js` | Scroll progress, auto TOC from h2/h3 inside `.article`, mobile nav, KaTeX render, math tooltips. |
| `scripts/glossary.js` | Click-to-open glossary panel; reads `window.GLOSSARY`. |
| `scripts/glossaryData.js` | The glossary payload: one entry per `data-gloss` id used anywhere in `chapters/`. Alphabetical. |
| `scripts/cotTrace.js` | Chain-of-thought trace demo. |
| `scripts/elo.js` | Pairwise -> Elo leaderboard. |
| `scripts/evolution.js` | Reflective evolution + Pareto frontier. |
| `scripts/icl.js` | In-context learning demo. |
| `scripts/memoryBars.js` | LoRA / QLoRA memory-footprint bars. |
| `scripts/parallelism.js` | DP / FSDP / TP / PP / EP primer (Ch0 links here from Ch2). |
| `scripts/promptSearch.js` | Propose -> score -> select loop. |
| `scripts/r1Pipeline.js` | R1 training pipeline visualization. |
| `scripts/reactLoop.js` | ReAct loop stepper. |
| `scripts/rlComparison.js` | PPO / DPO / GRPO comparison. |
| `scripts/rlhfPipeline.js` | RLHF three-stage pipeline. |
| `scripts/scalingLaw.js` | Scaling-law curves. |
| `scripts/testTimeCompute.js` | Test-time compute curves. |
| `scripts/transformerBlock.js` | Transformer block diagram. |
| `scripts/kvCache.js` | KV-cache size across MHA / GQA / MLA (Ch2). |
| `scripts/moeRouter.js` | MoE router with total vs active params (Ch2). |
| `scripts/grpoMechanics.js` | GRPO group-of-rollouts mechanics (Ch7). |
| `scripts/kvCacheCalc.js` | KV-cache memory calculator by context length (Ch8). |
| `scripts/specDecodeStepper.js` | Speculative-decoding stepper (Ch8). |
| `scripts/benchmarkTreadmill.js` | Benchmark-saturation treadmill (Ch10). |
| `scripts/leversSynthesis.js` | Eleven-lever synthesis map (Ch11). |

## Load-bearing conventions

- **Old chapter URLs are redirect stubs.** `chapters/chapter02-teaching-it-to-be-helpful.html`, `chapter03-the-recipe-gets-cheaper.html`, `chapter04-steering-without-retraining.html`, `chapter05-learning-to-think.html`, `chapter06-learning-to-act.html`, `chapter07-computational-cognition.html` are redirect stubs to preserve old shared links. Do not edit them and do not link them from new content.
- **Theme is a token swap.** All colors, fonts, spacing live as `:root` custom properties in `shared.css`. The theme is **light warm-paper, all-sans, no serifs, low-stimulation**. Never hardcode hex in component rules.
- **Multi-chapter, not single-page.** Each chapter is its own HTML at `chapters/chapterNN-slug.html`. Use relative paths `../styles/*` and `../scripts/*`. The sidebar TOC auto-builds per page from h2/h3 inside `.article`.
- **NO KaTeX in headings.** The TOC reads heading text. Use HTML entities (e.g. `&lambda;` not `$\lambda$`) inside h2/h3.
- **Required chapter scaffolding:** a `.lecture-roadmap` paragraph immediately after `<article>` opens; a `.lecture-nav-top` AND `.lecture-nav` (bottom) with prev/next pointers to adjacent chapters; section numbers on h2s via `<span class="section-number">N.</span>`.
- **Each demo is a self-contained IIFE.** Mounts by id (`document.getElementById(...)`, bail if absent), injects its own scoped `<style>` with prefixed classes (`kvc-`/`moe-`/`grpo-`/`sd-`/`bt-`/...), reuses `.demo-btn` chrome, references only `:root` tokens.
- **Determinism.** Demos use fixed data or a seeded PRNG (mulberry32). Do NOT use `Math.random()` or `Date.now()`.
- **Glossary pattern.** Wrap background terms in `<span class="gloss" data-gloss="kebab-id">term</span>`. Every id must resolve to an entry in `scripts/glossaryData.js`. When adding new ids from a chapter, either add the entry directly or leave a `workspace/refresh/glossary-chNN.md` stub for the finish-glossary sweep.
- **Strategic color, sparingly.** `--pos` (dark green) / `--neg` (dark red) for yes/no or good/bad emphasis only. Color must stay rare to carry meaning.
- **Math tooltips.** Use `\htmlData{tip=...}` on the geometric-mean-difficulty term of complex formulas. Plain-ASCII tip text only.
- **Citations are non-negotiable.** Every claim, date, figure links inline to its primary source (arXiv / ACL / NeurIPS / official report). If you change a claim, re-verify against the source.
- **Voice.** Read `~/.claude/skills/owen-comms/SKILL.md`. Open on substance/mechanism (NEVER a throat-clearing or emotional-teaser hook), mixed register, sparse spaced-hyphens (not em-dashes), no tricolons, no "Moreover/Furthermore", uneven paragraphs.

## How to add a chapter

1. Copy a sibling chapter file as template (or build from scratch following conventions above).
2. Update `<title>`, `<meta description>`, sidebar title/subtitle, the eyebrow + h1, `.lecture-roadmap`, the prev/next nav cards (top and bottom), and the chapter body.
3. Link assets relatively: `../styles/shared.css`, `../styles/demos.css`, optionally `../styles/glossary.css`, plus `../scripts/shared.js` and `../scripts/glossaryData.js` + `../scripts/glossary.js` if you used `data-gloss` terms.
4. Verify locally with `python3 -m http.server 8000`: sidebar TOC populates, scroll progress moves, prev/next jump to adjacent chapters, no console errors.
5. Add your chapter card to `index.html`.
6. Write a build note in `workspace/` recording: claims + sources, glossary ids introduced, demos used.

## What lives in `workspace/`

Gitignored agent scratch - build plan, refresh plan, claim sheets, research notes, review notes. Never ships. The orchestrator dumps `.md` here so agents don't pollute each other's context.
