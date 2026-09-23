// Glossary data for the click-a-term sidebar feature.
// Each entry: { title, summary, resources: [{label, url}, ...] }.
// IDs are kebab-case so the page markup can reference them directly.
window.GLOSSARY = {

  "agent": {
    title: "LLM agent",
    summary: "A language model wrapped in a loop that lets it observe, plan, call tools, and act on an external environment until a goal is met — turning a one-shot text predictor into a system that takes steps over time. The defining shift from chatbot to agent is the closed loop with the world: the model decides what to do next based on what just happened.",
    resources: [
      { label: "Anthropic — Building effective agents", url: "https://www.anthropic.com/research/building-effective-agents" },
      { label: "ReAct (Yao et al., 2022)", url: "https://arxiv.org/abs/2210.03629" },
      { label: "Wikipedia — Intelligent agent", url: "https://en.wikipedia.org/wiki/Intelligent_agent" }
    ]
  },

  "aime": {
    title: "AIME (American Invitational Mathematics Examination)",
    summary: "A 15-problem, 3-hour high-school competition math test with integer answers from 0–999, used as a hard reasoning benchmark for LLMs. Because answers are short integers, AIME is easy to grade automatically — making it a favorite for verifiable-reward RL setups. DeepSeek-R1 and OpenAI's o-series report headline numbers as <em>AIME 2024 pass@1</em>.",
    resources: [
      { label: "AIME (Art of Problem Solving wiki)", url: "https://artofproblemsolving.com/wiki/index.php/AIME" },
      { label: "MAA — AMC/AIME", url: "https://maa.org/student-programs/amc/" },
      { label: "DeepSeek-R1 paper", url: "https://arxiv.org/abs/2501.12948" }
    ]
  },

  "alfworld": {
    title: "ALFWorld",
    summary: "A text-and-embodied benchmark that aligns a TextWorld-style language environment with the visual ALFRED household-task simulator, so an agent can learn abstract plans in text and then execute them as embodied actions. It became a standard testbed for early ReAct-style LLM agents because it requires multi-step planning, tool-like environment interaction, and grounding.",
    resources: [
      { label: "Shridhar et al., 2020 — ALFWorld paper", url: "https://arxiv.org/abs/2010.03768" },
      { label: "ALFWorld GitHub", url: "https://github.com/alfworld/alfworld" },
      { label: "ALFRED (the embodied parent)", url: "https://arxiv.org/abs/1912.01734" }
    ]
  },

  "alpaca": {
    title: "Alpaca",
    summary: "A Stanford project (March 2023) that fine-tuned LLaMA-7B on 52K instruction-following examples generated cheaply by prompting GPT-3.5 (self-instruct style). For about $600 of compute it produced behavior qualitatively close to text-davinci-003, kicking off the open instruction-tuned LLM era and a wave of distilled-from-GPT chat models.",
    resources: [
      { label: "Stanford Alpaca release", url: "https://crfm.stanford.edu/2023/03/13/alpaca.html" },
      { label: "Alpaca GitHub", url: "https://github.com/tatsu-lab/stanford_alpaca" },
      { label: "Self-Instruct (Wang et al., 2022)", url: "https://arxiv.org/abs/2212.10560" }
    ]
  },

  "ape": {
    title: "APE — Automatic Prompt Engineer",
    summary: "An early (2022) prompt-optimization method that uses an LLM both as the proposer of candidate instructions and as the scorer of how well each instruction performs on a small held-out set, then iterates on the top survivors. APE was the first widely cited demonstration that prompt search can match or beat hand-written prompts on instruction-induction benchmarks.",
    resources: [
      { label: "Zhou et al., 2022 — Large Language Models Are Human-Level Prompt Engineers", url: "https://arxiv.org/abs/2211.01910" },
      { label: "APE project page", url: "https://sites.google.com/view/automatic-prompt-engineer" }
    ]
  },

  "asl": {
    title: "ASL - AI Safety Level",
    summary: "Anthropic's Responsible Scaling Policy defines tiered safeguards (ASL-2, ASL-3, ASL-4, ...) tied to model-capability thresholds. Each level specifies deployment and security controls that must be in place before the lab trains or ships a model at that tier. ASL-3 safeguards were activated for Claude in May 2025.",
    resources: [
      { label: "Anthropic RSP updates", url: "https://www.anthropic.com/rsp-updates" },
      { label: "RSP v3.0 PDF", url: "https://www-cdn.anthropic.com/e670587677525f28df69b59e5fb4c22cc5461a17.pdf" }
    ]
  },

  "attribution-graph": {
    title: "Attribution graph",
    summary: "A local computational map, built for a single prompt, that traces which sparse features caused which downstream features and ultimately the output logit. Anthropic's March 2025 circuit-tracing method replaces the model's MLPs with sparse cross-layer transcoders and then computes the attribution graph on that substitute network, so the graph is interpretable end-to-end.",
    resources: [
      { label: "Lindsey, Batson et al. - On the Biology of a Large Language Model (Mar 2025)", url: "https://transformer-circuits.pub/2025/attribution-graphs/biology.html" },
      { label: "Circuit tracing methods (Mar 2025)", url: "https://transformer-circuits.pub/2025/attribution-graphs/methods.html" }
    ]
  },

  "autogpt": {
    title: "Auto-GPT",
    summary: "A March 2023 open-source experiment that wrapped GPT-4 in a self-prompting loop: given a high-level goal, it generates subtasks, executes them via tool calls (web browse, file I/O, shell), critiques its own progress, and continues until the goal is met. It went viral as a proof-of-concept of autonomous agents, but was famously unreliable — it shipped the dream of agents before the substrate was ready.",
    resources: [
      { label: "Auto-GPT GitHub (Significant-Gravitas)", url: "https://github.com/Significant-Gravitas/AutoGPT" },
      { label: "Wikipedia — Auto-GPT", url: "https://en.wikipedia.org/wiki/Auto-GPT" }
    ]
  },

  "aux-loss-free-balancing": {
    title: "Auxiliary-loss-free load balancing (MoE)",
    summary: "A trick from DeepSeek-V3 (following Wang et al., 2024) for keeping MoE routing balanced without adding a load-balancing penalty to the training loss. A per-expert bias is maintained and adjusted online: nudge it up for under-used experts, down for over-used ones, so the router picks a balanced set on its own. Classical MoE balancing losses distort language-modeling gradients; this one does not. DeepSeek reported a measurable quality gain from the swap.",
    resources: [
      { label: "DeepSeek-V3 technical report", url: "https://arxiv.org/abs/2412.19437" },
      { label: "Wang et al., 2024 - Auxiliary-loss-free load balancing", url: "https://arxiv.org/abs/2408.15664" }
    ]
  },

  "base-lm": {
    title: "Base language model",
    summary: "A pretrained language model in its raw next-token-prediction state, before any instruction tuning, RLHF, or other alignment. Base models complete text but do not reliably follow instructions or refuse harmful requests — they are the substrate that post-training shapes into a usable assistant.",
    resources: [
      { label: "GPT-3 paper (Brown et al., 2020)", url: "https://arxiv.org/abs/2005.14165" },
      { label: "InstructGPT paper (Ouyang et al., 2022)", url: "https://arxiv.org/abs/2203.02155" }
    ]
  },

  "bbh": {
    title: "BIG-Bench Hard (BBH)",
    summary: "A curated suite of 23 reasoning tasks pulled from the larger BIG-Bench, kept because pre-2022 models failed to beat the average human rater on them. With plain prompting models lagged; adding chain-of-thought let Codex (code-davinci-002) surpass the average human on 17 of 23. BBH became the default scoreboard for prompt-optimization papers.",
    resources: [
      { label: "Suzgun et al., 2022 — BBH paper", url: "https://arxiv.org/abs/2210.09261" },
      { label: "BIG-Bench repo (Google)", url: "https://github.com/google/BIG-bench" }
    ]
  },

  "bookcorpus": {
    title: "BookCorpus",
    summary: "A ~7,000-book corpus of free unpublished novels scraped from Smashwords, used (with English Wikipedia) to pretrain the original BERT and GPT. It mattered because long-form prose gave early transformers exposure to extended, coherent context — but it also became a case study in the murky provenance of pretraining data.",
    resources: [
      { label: "Zhu et al., 2015 — Aligning Books and Movies", url: "https://arxiv.org/abs/1506.06724" },
      { label: "Wikipedia — BookCorpus", url: "https://en.wikipedia.org/wiki/BookCorpus" },
      { label: "Bandy & Vincent, 2021 — Addressing Documentation Debt", url: "https://arxiv.org/abs/2105.05241" }
    ]
  },

  "bradley-terry": {
    title: "Bradley-Terry model",
    summary: "A probability model (1952) for pairwise comparisons: assign each item a positive score, and the probability that <em>i</em> beats <em>j</em> is its share of their combined score. Fitting the scores by maximum likelihood from observed comparisons gives you a ranking. RLHF's reward model is typically trained with a Bradley-Terry loss on human preference pairs.",
    resources: [
      { label: "Bradley & Terry, 1952 (original)", url: "https://www.jstor.org/stable/2334029" },
      { label: "Wikipedia — Bradley-Terry model", url: "https://en.wikipedia.org/wiki/Bradley%E2%80%93Terry_model" },
      { label: "InstructGPT paper (uses BT loss)", url: "https://arxiv.org/abs/2203.02155" }
    ]
  },

  "budget-forcing": {
    title: "Budget forcing",
    summary: "A test-time-compute trick from s1 (Muennighoff et al., 2025): force the model to keep thinking by appending the token <code>Wait</code> whenever it tries to stop, or force it to stop by inserting an end-of-thinking marker — effectively a knob on how many reasoning tokens the model produces. It is a cheap way to trade compute for accuracy without retraining.",
    resources: [
      { label: "Muennighoff et al., 2025 — s1: Simple test-time scaling", url: "https://arxiv.org/abs/2501.19393" },
      { label: "s1 GitHub", url: "https://github.com/simplescaling/s1" }
    ]
  },

  "byte-level-bpe": {
    title: "Byte-level BPE",
    summary: "The variant of BPE used by GPT-2 and everything that followed: instead of operating on Unicode characters, encode text as raw UTF-8 bytes first and run BPE merges over that 256-symbol alphabet. Every possible Unicode string is representable without an <em>unk</em> token, code and emoji tokenize gracefully, and there is no language-specific preprocessing. GPT-2 shipped with this scheme and it is now the default across GPT, Llama (via SentencePiece-BPE), and most open models.",
    resources: [
      { label: "Radford et al., 2019 - GPT-2 paper", url: "https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf" },
      { label: "Hugging Face - Byte-Pair Encoding tokenizer notes", url: "https://huggingface.co/learn/nlp-course/en/chapter6/5" }
    ]
  },

  "byte-pair-encoding": {
    title: "Byte-Pair Encoding (BPE)",
    summary: "A subword tokenization algorithm (Sennrich et al., 2016, adapted from Gage 1994's data-compression scheme) that starts with characters and repeatedly merges the most frequent adjacent pair into a new symbol until it hits a target vocabulary size. The result is a vocabulary that keeps common words intact and shatters rare words into meaningful pieces, so the model never sees an out-of-vocabulary token. GPT, Llama, and most modern LLMs use a BPE-family tokenizer.",
    resources: [
      { label: "Sennrich et al., 2016 - Neural Machine Translation of Rare Words with Subword Units", url: "https://arxiv.org/abs/1508.07909" },
      { label: "Wikipedia - Byte pair encoding", url: "https://en.wikipedia.org/wiki/Byte_pair_encoding" }
    ]
  },

  "ccl": {
    title: "CCL - Critical Capability Level",
    summary: "Google DeepMind's Frontier Safety Framework term for capability thresholds that would pose severe-harm risks without mitigations. CCLs are defined per risk domain (CBRN, cybersecurity, ML R&amp;D, deceptive alignment, harmful manipulation) and trigger heightened safeguards when a frontier model reaches them.",
    resources: [
      { label: "Google DeepMind Frontier Safety Framework", url: "https://deepmind.google/blog/introducing-the-frontier-safety-framework/" },
      { label: "FSF strengthening update (Sep 2025)", url: "https://deepmind.google/blog/strengthening-our-frontier-safety-framework/" }
    ]
  },

  "chain-of-thought": {
    title: "Chain-of-thought prompting (CoT)",
    summary: "Prompting a large model to produce intermediate reasoning steps before its final answer — often by adding a cue like <em>let's think step by step</em>. The extra tokens give the model room to compute, so accuracy on multi-step problems jumps without any weight change. It was the first widely cited proof that <em>how</em> you phrase a prompt is worth measurable accuracy.",
    resources: [
      { label: "Wei et al., 2022 — Chain-of-Thought Prompting", url: "https://arxiv.org/abs/2201.11903" },
      { label: "Kojima et al., 2022 — Zero-shot CoT", url: "https://arxiv.org/abs/2205.11916" }
    ]
  },

  "chatbot-arena": {
    title: "Chatbot Arena (LMArena)",
    summary: "Live head-to-head model leaderboard where anonymous responses from two models are shown side-by-side and users pick a winner. Wins aggregate into Elo via a Bradley-Terry model. Originally launched by LMSYS at Berkeley in May 2023; the operator later spun out as LMArena. Its rankings became the dominant qualitative signal for the field through 2024-2025.",
    resources: [
      { label: "LMSYS Chatbot Arena", url: "https://lmarena.ai/" },
      { label: "Chiang et al., Jul 2024 - Chatbot Arena paper", url: "https://arxiv.org/abs/2403.04132" }
    ]
  },

  "cispo": {
    title: "CISPO",
    summary: "Clipped IS-weight Policy Optimization (Chen et al., MiniMax M1 report, June 2025). PPO clips the surrogate update (the ratio-times-advantage term); CISPO clips the importance-sampling weight itself, then lets the rest of the term flow through unclipped. The claim is that this preserves signal from low-probability but high-reward tokens that PPO's symmetric clip discards. CISPO is the loss function Meta's ScaleRL recipe ended up standardizing on. It trained MiniMax-M1 (456B MoE, 45.9B active) at $534,700 on 512 H800s in 3 weeks with a 1M-token context.",
    resources: [
      { label: "MiniMax-M1 report", url: "https://arxiv.org/abs/2506.13585" }
    ]
  },

  "clip-higher": {
    title: "Clip-Higher (DAPO)",
    summary: "Replaces PPO's symmetric ratio clip (1-&epsilon;, 1+&epsilon;) with an asymmetric pair (1-&epsilon;_low, 1+&epsilon;_high) with &epsilon;_high larger. The point is entropy: under a symmetric clip, a low-probability exploration token whose new probability should rise is bounded above at (1+&epsilon;)*&pi;_old, which for a starting probability of 0.001 and &epsilon;=0.2 means the largest step is to 0.0012. High-probability exploitation tokens face the same asymmetric ceiling but have much more room to lose. DAPO's default is &epsilon;_low=0.2, &epsilon;_high=0.28, buying back exactly the room exploration tokens need to grow.",
    resources: [
      { label: "DAPO paper", url: "https://arxiv.org/abs/2503.14476" }
    ]
  },

  "codeforces-elo": {
    title: "Codeforces Elo",
    summary: "The Elo-style competitive-programming rating from codeforces.com, increasingly used as a yardstick for code-reasoning models — OpenAI's o-series and DeepSeek-R1 report Codeforces percentile / rating numbers head-to-head with human contestants. It is attractive because problems are graded by hidden tests, making the score hard to game.",
    resources: [
      { label: "Codeforces — Rating system", url: "https://codeforces.com/blog/entry/77890" },
      { label: "DeepSeek-R1 paper (reports Codeforces percentile)", url: "https://arxiv.org/abs/2501.12948" }
    ]
  },

  "coding-agent": {
    title: "Coding agent",
    summary: "An LLM agent specialized for software-engineering tasks: read a repo, plan a change, edit files, run tests, and iterate until a goal is met. SWE-bench and SWE-bench Verified are the canonical evaluation suites; products like Claude Code, Devin, and Cursor's agent mode are mainstream instances.",
    resources: [
      { label: "SWE-bench paper (Jimenez et al., 2023)", url: "https://arxiv.org/abs/2310.06770" },
      { label: "SWE-agent (Yang et al., 2024)", url: "https://arxiv.org/abs/2405.15793" },
      { label: "Anthropic — Claude Code", url: "https://www.anthropic.com/claude-code" }
    ]
  },

  "cold-start-sft": {
    title: "Cold-start SFT",
    summary: "A short supervised-fine-tuning stage on a small curated set of high-quality reasoning traces, run <em>before</em> RL begins, to give the policy a non-trivial starting distribution. DeepSeek-R1 added a cold-start SFT phase on top of R1-Zero's pure-RL recipe specifically to fix the readability and language-mixing problems that pure RL produced.",
    resources: [
      { label: "DeepSeek-R1 paper", url: "https://arxiv.org/abs/2501.12948" }
    ]
  },

  "compute-optimal": {
    title: "Compute-optimal training (Chinchilla)",
    summary: "DeepMind's 2022 finding that for a fixed compute budget, the loss-minimizing choice is to train a <em>smaller</em> model on <em>more</em> tokens than was then standard — roughly 20 tokens per parameter. The 70B Chinchilla model, trained on 1.4T tokens, beat the 280B Gopher on the same compute. It rewrote the scaling-law playbook and motivated LLaMA's data-heavy regime.",
    resources: [
      { label: "Hoffmann et al., 2022 — Chinchilla paper", url: "https://arxiv.org/abs/2203.15556" },
      { label: "Wikipedia — Chinchilla (language model)", url: "https://en.wikipedia.org/wiki/Chinchilla_(language_model)" }
    ]
  },

  "computer-use": {
    title: "Computer use",
    summary: "An agent capability in which the model directly drives a desktop or browser by observing screenshots and emitting mouse / keyboard / scroll actions — the same interface a human uses. Anthropic shipped the first general-purpose computer-use API with Claude 3.5 Sonnet (October 2024); OSWorld is the canonical benchmark.",
    resources: [
      { label: "Anthropic — Computer use (Claude 3.5 Sonnet)", url: "https://www.anthropic.com/news/3-5-models-and-computer-use" },
      { label: "OSWorld paper (Xie et al., 2024)", url: "https://arxiv.org/abs/2404.07972" }
    ]
  },

  "constitutional-ai": {
    title: "Constitutional AI",
    summary: "Anthropic's alignment recipe (Bai et al., Dec 2022) where a written 'constitution' of principles replaces the human labeler. Stage 1 (SL-CAI): the model self-critiques its outputs against the constitution, revises them, then SFTs on the revisions. Stage 2 (RLAIF): an AI evaluator prompted with the same principles labels preferences; a preference model trains on those labels; RL against it. The paper's claim is a harmless assistant without any human labels identifying harmful outputs.",
    resources: [
      { label: "Bai et al., 2022 - Constitutional AI", url: "https://arxiv.org/abs/2212.08073" },
      { label: "Anthropic - Claude's Constitution", url: "https://www.anthropic.com/news/claudes-constitution" }
    ]
  },

  "contrastive-learning": {
    title: "Contrastive learning",
    summary: "A self-supervised training scheme that pulls embeddings of matched pairs (e.g. an image and its caption) together while pushing unmatched pairs apart. CLIP (OpenAI, 2021) is the canonical multimodal example — train on 400M image-text pairs with an InfoNCE loss and you get a joint embedding space that powers zero-shot classification.",
    resources: [
      { label: "Radford et al., 2021 — CLIP", url: "https://arxiv.org/abs/2103.00020" },
      { label: "Chen et al., 2020 — SimCLR", url: "https://arxiv.org/abs/2002.05709" },
      { label: "Wikipedia — Contrastive learning", url: "https://en.wikipedia.org/wiki/Contrastive_learning" }
    ]
  },

  "cot": {
    title: "Chain-of-thought (CoT)",
    summary: "Same idea as chain-of-thought prompting: have the model write out intermediate reasoning steps before its final answer. The CoT seed grows three times across this course — first as a prompt trick (Wei 2022), then as a prompt-optimization target (GEPA / MIPROv2), then as a trained behavior in DeepSeek-R1's RL pipeline.",
    resources: [
      { label: "Wei et al., 2022 — Chain-of-Thought Prompting", url: "https://arxiv.org/abs/2201.11903" },
      { label: "Kojima et al., 2022 — Zero-shot CoT", url: "https://arxiv.org/abs/2205.11916" },
      { label: "DeepSeek-R1 paper", url: "https://arxiv.org/abs/2501.12948" }
    ]
  },

  "cot-faithfulness": {
    title: "CoT faithfulness",
    summary: "The question of whether a model's chain-of-thought actually explains the computation that produced its answer, or whether it is a plausible post-hoc story. Turpin et al. (2023) showed that subtly biasing the prompt (order the features, put the target answer in the few-shot demos) can drop BBH accuracy by up to 36 points while the CoT never mentions the bias it is following. The stated reasoning and the deciding computation are two different objects, and only one of them is visible.",
    resources: [
      { label: "Turpin et al., 2023 - Language Models Don't Always Say What They Think", url: "https://arxiv.org/abs/2305.04388" },
      { label: "OpenAI - Chain-of-thought monitoring (2025)", url: "https://openai.com/index/chain-of-thought-monitoring/" }
    ]
  },

  "cross-layer-transcoder": {
    title: "Cross-layer transcoder (CLT)",
    summary: "Anthropic's replacement primitive for MLP blocks in circuit tracing: a sparse, interpretable module whose features can read from and write to the residual stream across multiple layers. Attribution graphs are computed on the substitute network built from CLTs, giving a linear, interpretable path from features at one layer to features at any later layer.",
    resources: [
      { label: "Circuit tracing methods (Mar 2025)", url: "https://transformer-circuits.pub/2025/attribution-graphs/methods.html" },
      { label: "On the Biology of a Large Language Model", url: "https://transformer-circuits.pub/2025/attribution-graphs/biology.html" }
    ]
  },

  "dapo": {
    title: "DAPO",
    summary: "Decoupled Clip and Dynamic sAmpling Policy Optimization (ByteDance Seed, March 2025). Four fixes to GRPO bundled together: Clip-Higher (asymmetric &epsilon;_low / &epsilon;_high to prevent entropy collapse on exploration tokens), dynamic sampling (discard prompts where all G rollouts share a reward and re-sample), token-level policy-gradient loss (sum across all tokens then normalize once, so long responses contribute proportional gradient), and overlong reward shaping (soft length penalty instead of hard truncation-to-zero). Reports 50 points on AIME 2024 with Qwen2.5-32B base at about half the training steps of DeepSeek-R1-Zero-Qwen-32B.",
    resources: [
      { label: "DAPO paper", url: "https://arxiv.org/abs/2503.14476" }
    ]
  },

  "data-wall": {
    title: "Data wall",
    summary: "The observation (Villalobos et al., 2024) that the stock of high-quality public web text is finite and the frontier's pretraining-token consumption is projected to exhaust it between 2026 and 2032. Once you cannot double tokens each generation, compute-optimal Chinchilla scaling stops applying and labs shift toward data reuse, synthetic data, and RL from verifiable rewards. The data wall is the reason 2025-26 pretraining research reads more like data curation than raw scaling.",
    resources: [
      { label: "Villalobos et al., 2024 - Position: Will we run out of data?", url: "https://arxiv.org/abs/2211.04325" },
      { label: "Muennighoff et al., 2023 - Scaling Data-Constrained Language Models", url: "https://arxiv.org/abs/2305.16264" }
    ]
  },

  "decoder-only": {
    title: "Decoder-only transformer",
    summary: "A transformer that uses only the autoregressive decoder stack: each token attends to itself and to earlier tokens via a causal mask, and the model is trained to predict the next token. GPT, LLaMA, Claude, and Gemini are all decoder-only. The architecture won the LLM era because next-token prediction at scale turned out to be a universal training signal.",
    resources: [
      { label: "Vaswani et al., 2017 — Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762" },
      { label: "Radford et al., 2018 — GPT", url: "https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf" },
      { label: "Wikipedia — GPT (language model)", url: "https://en.wikipedia.org/wiki/Generative_pre-trained_transformer" }
    ]
  },

  "deliberative-alignment": {
    title: "Deliberative alignment",
    summary: "OpenAI's training recipe for the o-series (Guan et al., Dec 2024): teach the model to explicitly reason over a written safety spec in its own chain-of-thought before answering, rather than to imitate safe answers directly. Applied to the o-series using only synthetic data (no human-written CoT, no human-written answers), it reports better jailbreak robustness, less over-refusal, and out-of-distribution generalization to safety cases not in the training set. Turns the Model Spec from a filter into a document the model was taught to think against.",
    resources: [
      { label: "Guan et al., Dec 2024 - Deliberative Alignment", url: "https://arxiv.org/abs/2412.16339" },
      { label: "OpenAI blog", url: "https://openai.com/index/deliberative-alignment/" }
    ]
  },

  "discrete-prompt-optimization": {
    title: "Discrete prompt optimization",
    summary: "Searching directly over <em>words</em> (the discrete vocabulary) rather than over continuous embeddings — propose a candidate instruction, score it on a small dev set, keep the winners, mutate, repeat. APE, OPRO, EvoPrompt, PromptBreeder, and GEPA all live in this family. The big appeal is that the resulting prompt is human-readable and portable across models.",
    resources: [
      { label: "APE — Zhou et al., 2022", url: "https://arxiv.org/abs/2211.01910" },
      { label: "OPRO — Yang et al., 2023", url: "https://arxiv.org/abs/2309.03409" },
      { label: "EvoPrompt — Guo et al., 2023", url: "https://arxiv.org/abs/2309.08532" }
    ]
  },

  "double-quantization": {
    title: "Double quantization",
    summary: "A QLoRA trick: after quantizing weights to 4-bit NF4, also quantize the per-block quantization constants themselves (from FP32 down to 8-bit) so the metadata overhead drops by another ~0.37 bits per parameter. It is a small but real piece of why QLoRA can finetune a 65B model on a single 48GB GPU.",
    resources: [
      { label: "Dettmers et al., 2023 — QLoRA paper", url: "https://arxiv.org/abs/2305.14314" },
      { label: "bitsandbytes library", url: "https://github.com/bitsandbytes-foundation/bitsandbytes" }
    ]
  },

  "dpo": {
    title: "Direct Preference Optimization (DPO)",
    summary: "A 2023 method (Rafailov et al.) that skips RLHF's reward model and PPO loop entirely. DPO rewrites the RLHF objective so that the preference data can directly supervise the policy via a closed-form loss — a simple classification-style update on chosen-vs-rejected response pairs. Same alignment signal, none of the RL machinery.",
    resources: [
      { label: "Rafailov et al., 2023 — DPO paper", url: "https://arxiv.org/abs/2305.18290" },
      { label: "TRL library DPOTrainer docs", url: "https://huggingface.co/docs/trl/dpo_trainer" }
    ]
  },

  "dr-grpo": {
    title: "Dr. GRPO",
    summary: "Liu et al. (Sea AI Lab / NUS, March 2025) identified two biases hidden in GRPO's normalizations. Dividing the token-summed loss by response length makes the per-token gradient inversely proportional to length, pushing the policy toward short-correct-and-long-wrong. Dividing the advantage by the std of group rewards over-weights low-variance (already-easy or already-hard) prompts at the cost of the informative middle. Dr. GRPO drops both denominators, recovering an unbiased REINFORCE-with-baseline. Their 7B Oat-Zero recipe hits 43.3% on AIME 2024 in 27 GPU-hours on 8xA100 at half the response length of naive GRPO.",
    resources: [
      { label: "Understanding R1-Zero-Like Training (Liu et al., 2025)", url: "https://arxiv.org/abs/2503.20783" },
      { label: "oat-zero code", url: "https://github.com/sail-sg/oat-zero" }
    ]
  },

  "drpo": {
    title: "DRPO — Dynamic Rewarding with Prompt Optimization",
    summary: "A tuning-free alignment method (Singla et al., EMNLP 2024) that uses a dynamic, automatically updated reward signal and a search-based prompt optimizer to align a base model — no SFT, no RLHF, no weight updates. Base LLMs aligned with DRPO surpass their RLHF-tuned counterparts on standard benchmarks while spending only inference compute.",
    resources: [
      { label: "Singla et al., 2024 — DRPO paper", url: "https://arxiv.org/abs/2402.08005" },
      { label: "DRPO GitHub", url: "https://github.com/Singla17/DRPO" }
    ]
  },

  "dspy": {
    title: "DSPy",
    summary: "A Stanford framework (Khattab et al., 2023) that lets you write LM programs as composed modules with typed signatures, then automatically optimizes the prompts and demos using methods like MIPROv2 and GEPA. The pitch is <em>program, don't prompt</em>: declare the I/O contract and let an optimizer compile the actual prompts.",
    resources: [
      { label: "Khattab et al., 2023 — DSPy paper", url: "https://arxiv.org/abs/2310.03714" },
      { label: "DSPy docs", url: "https://dspy.ai/" },
      { label: "DSPy GitHub", url: "https://github.com/stanfordnlp/dspy" }
    ]
  },

  "dynamic-sampling": {
    title: "Dynamic sampling (DAPO)",
    summary: "During GRPO training, prompts where all G rollouts happen to be correct or all happen to be wrong contribute zero gradient - their group-mean advantage is zero for every rollout. As the policy gets stronger, more of the batch becomes zero-advantage. DAPO's dynamic sampling discards such prompts on the fly and oversamples until the batch is fully useful. ScaleRL later re-introduced the same idea as <em>zero-variance sample removal</em>.",
    resources: [
      { label: "DAPO paper", url: "https://arxiv.org/abs/2503.14476" }
    ]
  },

  "elo-rating": {
    title: "Elo rating",
    summary: "A method (Arpad Elo, 1960s) for turning pairwise win/lose outcomes into a single scalar skill rating per competitor, updated after each match by how surprising the result was. Chatbot Arena uses Elo to rank LLMs from millions of crowdsourced pairwise human votes — turning preference into a global leaderboard.",
    resources: [
      { label: "Wikipedia — Elo rating system", url: "https://en.wikipedia.org/wiki/Elo_rating_system" },
      { label: "Chatbot Arena (Chiang et al., 2024)", url: "https://arxiv.org/abs/2403.04132" },
      { label: "LMSYS Chatbot Arena leaderboard", url: "https://lmarena.ai/" }
    ]
  },

  "emergent-ability": {
    title: "Emergent ability",
    summary: "A capability that is essentially absent at small scale but appears suddenly past some compute / parameter / data threshold. Wei et al. (2022) catalogued dozens of such jumps in LLMs. A 2023 NeurIPS paper (Schaeffer et al.) argued many such emergence claims are artifacts of harsh metrics and disappear under continuous scoring — the debate is unsettled.",
    resources: [
      { label: "Wei et al., 2022 — Emergent Abilities", url: "https://arxiv.org/abs/2206.07682" },
      { label: "Schaeffer et al., 2023 — Are Emergent Abilities a Mirage?", url: "https://arxiv.org/abs/2304.15004" }
    ]
  },

  "encoder-only": {
    title: "Encoder-only transformer",
    summary: "A transformer that uses only the bidirectional encoder stack — every token attends to every other token — and is typically trained with masked language modeling. BERT (Devlin et al., 2018) was the prototype. Encoder-only models excel at understanding tasks like classification and retrieval, but cannot generate text autoregressively.",
    resources: [
      { label: "Devlin et al., 2018 — BERT", url: "https://arxiv.org/abs/1810.04805" },
      { label: "Wikipedia — BERT", url: "https://en.wikipedia.org/wiki/BERT_(language_model)" }
    ]
  },

  "entropy-collapse": {
    title: "Entropy collapse (RL)",
    summary: "The policy's output distribution over next tokens becomes sharply peaked on a small set of exploit tokens, and exploration effectively stops. In GRPO with a symmetric ratio clip, low-probability exploration tokens are capped above at (1+&epsilon;)*&pi;_old regardless of how large their advantage is, so their probability cannot grow fast enough to survive competition with exploitation tokens. Clip-Higher (DAPO) is the canonical fix.",
    resources: [
      { label: "DAPO paper", url: "https://arxiv.org/abs/2503.14476" }
    ]
  },

  "evoprompt": {
    title: "EvoPrompt",
    summary: "A 2023 prompt optimizer that runs an evolutionary algorithm — selection, crossover, mutation — over discrete natural-language prompts, with an LLM doing the recombination. EvoPrompt showed that classical evolutionary search transferred cleanly to the prompt space, outperforming hand-crafted and APE prompts on instruction-induction and BBH-style benchmarks.",
    resources: [
      { label: "Guo et al., 2023 — EvoPrompt paper", url: "https://arxiv.org/abs/2309.08532" },
      { label: "EvoPrompt GitHub", url: "https://github.com/beeevita/EvoPrompt" }
    ]
  },

  "fine-tuning": {
    title: "Fine-tuning",
    summary: "Taking a pretrained model and continuing training on a smaller task-specific dataset, updating some or all of its weights. Full fine-tuning updates everything; parameter-efficient fine-tuning (LoRA, prefix tuning, etc.) updates a small adapter. Fine-tuning is the standard way to adapt a foundation model to a downstream task or behavioral target.",
    resources: [
      { label: "Howard & Ruder, 2018 — ULMFiT", url: "https://arxiv.org/abs/1801.06146" },
      { label: "Wikipedia — Fine-tuning (deep learning)", url: "https://en.wikipedia.org/wiki/Fine-tuning_(deep_learning)" }
    ]
  },

  "foundation-model": {
    title: "Foundation model",
    summary: "A term coined by Stanford CRFM (Bommasani et al., 2021) for a model trained on broad data at scale that can be adapted to many downstream tasks. GPT-3, CLIP, and PaLM were the prototypes. The framing was controversial because it bundled together a research observation (transfer at scale) with a sociotechnical claim (these models are infrastructure).",
    resources: [
      { label: "Bommasani et al., 2021 — On the Opportunities and Risks of Foundation Models", url: "https://arxiv.org/abs/2108.07258" },
      { label: "Stanford CRFM", url: "https://crfm.stanford.edu/" }
    ]
  },

  "fp8-training": {
    title: "FP8 mixed-precision training",
    summary: "Running the bulk of pretraining matmuls in 8-bit floating point (E4M3 for weights/activations, E5M2 for gradients) with BF16 master weights and per-tile activation scaling to control numeric drift. Roughly 2x throughput over BF16 on Hopper GPUs at the same hardware. DeepSeek-V3 (Dec 2024) is the first flagship-scale open production run; the recipe now lives in open trainers and has been picked up by Nemotron and others.",
    resources: [
      { label: "DeepSeek-V3 technical report", url: "https://arxiv.org/abs/2412.19437" },
      { label: "FP8 formats for deep learning (Micikevicius et al., 2022)", url: "https://arxiv.org/abs/2209.05433" }
    ]
  },

  "frozen-model": {
    title: "Frozen model",
    summary: "A model whose weights are not updated — used as a fixed function, with all adaptation happening outside the weights (via prompts, adapters, retrieved context, or downstream layers). In-context learning, retrieval-augmented generation, and prompt optimization all treat the LLM as frozen.",
    resources: [
      { label: "GPT-3 paper (the iconic frozen-model demo)", url: "https://arxiv.org/abs/2005.14165" },
      { label: "Lester et al., 2021 — Prompt Tuning (frozen backbone)", url: "https://arxiv.org/abs/2104.08691" }
    ]
  },

  "genrm": {
    title: "Generative reward model (GenRM)",
    summary: "Instead of a scalar-head classifier trained on Bradley-Terry preferences, train the reward as a next-token-prediction task: ask the model <em>is this correct? think it through, then answer yes or no</em>. The reward is the probability the model assigns to <em>yes</em> after its own CoT rationale. Two properties come for free: chain-of-thought at reward time (so the RM catches subtle math slips a scalar head would miss), and majority voting across multiple RM samples. Zhang et al. (Google, Aug 2024, ICLR 2025) report GSM8K verifier accuracy rising from 73% to 93.4%.",
    resources: [
      { label: "Generative Verifiers (Zhang et al., 2024)", url: "https://arxiv.org/abs/2408.15240" }
    ]
  },

  "gepa": {
    title: "GEPA — Reflective Prompt Evolution",
    summary: "A reflective prompt optimizer (Agrawal et al., 2025): after each attempt it writes a natural-language diagnosis of <em>why</em> the output fell short, proposes a targeted edit aimed at exactly that failure, and keeps a Pareto frontier of candidates so it never collapses to one brittle winner. Matched or beat GRPO by up to ~20 points using up to 35x fewer rollouts; ICLR 2026 oral.",
    resources: [
      { label: "Agrawal et al., 2025 — GEPA paper", url: "https://arxiv.org/abs/2507.19457" },
      { label: "GEPA GitHub", url: "https://github.com/gepa-ai/gepa" },
      { label: "GEPA in DSPy docs", url: "https://dspy.ai/api/optimizers/GEPA/overview/" }
    ]
  },

  "goodharts-law": {
    title: "Goodhart's law",
    summary: "<em>When a measure becomes a target, it ceases to be a good measure.</em> Any prompt or policy optimized against a fixed proxy reward — a learned RM, an LLM judge, a benchmark — eventually exploits the proxy's blind spots rather than the underlying goal. The whole point of human-in-the-loop anchoring, held-out evals, and KL penalties is to keep Goodhart at bay.",
    resources: [
      { label: "Wikipedia — Goodhart's law", url: "https://en.wikipedia.org/wiki/Goodhart%27s_law" },
      { label: "Manheim & Garrabrant, 2018 — Categorizing Variants of Goodhart's Law", url: "https://arxiv.org/abs/1803.04585" }
    ]
  },

  "gqa": {
    title: "Grouped-query attention (GQA)",
    summary: "A KV-cache shrink between MHA and MQA: query heads are split into groups, each group shares one key/value head, and the total number of KV heads is a tunable knob (n_kv &lt; n_q). Introduced by Ainslie et al. (2023); adopted at scale by Llama 2 70B and the whole Llama 3 line. Cuts the per-token KV cache by the head-to-group ratio while keeping most of MHA's quality.",
    resources: [
      { label: "Ainslie et al., 2023 - GQA", url: "https://arxiv.org/abs/2305.13245" },
      { label: "Llama 2 paper", url: "https://arxiv.org/abs/2307.09288" }
    ]
  },

  "grpo": {
    title: "GRPO — Group Relative Policy Optimization",
    summary: "DeepSeek's 2024 RL algorithm that removes PPO's value-function critic: for each prompt it samples a group of responses, scores them, and uses each response's deviation from the group mean as the advantage. No critic means roughly half the memory and compute of PPO. GRPO powered DeepSeekMath and DeepSeek-R1.",
    resources: [
      { label: "Shao et al., 2024 — DeepSeekMath / GRPO", url: "https://arxiv.org/abs/2402.03300" },
      { label: "DeepSeek-R1 paper", url: "https://arxiv.org/abs/2501.12948" }
    ]
  },

  "gsm8k": {
    title: "GSM8K",
    summary: "Grade School Math 8K — an OpenAI benchmark (Cobbe et al., 2021) of 8.5K linguistically diverse grade-school word problems with full natural-language solutions. It became the standard eval for arithmetic and multi-step reasoning in LLMs and was where chain-of-thought first showed dramatic gains.",
    resources: [
      { label: "Cobbe et al., 2021 — GSM8K paper", url: "https://arxiv.org/abs/2110.14168" },
      { label: "GSM8K GitHub (OpenAI)", url: "https://github.com/openai/grade-school-math" }
    ]
  },

  "gspo": {
    title: "GSPO - Group Sequence Policy Optimization",
    summary: "Zheng et al. (Alibaba Qwen, July 2025). Moves the PPO importance-sampling ratio from token-level to sequence-level, and clips at the sequence level too. For dense models this is a modest change; for MoE models it turns out to matter a lot, because a token can be routed through slightly different experts between the rollout snapshot and the update snapshot, giving per-token ratios that reflect routing noise more than policy change. Sequence-level aggregation averages that noise out. The Qwen team credits GSPO with the stability of Qwen3's RL runs.",
    resources: [
      { label: "GSPO paper", url: "https://arxiv.org/abs/2507.18071" }
    ]
  },

  "helpful-honest-harmless": {
    title: "Helpful, Honest, Harmless (HHH)",
    summary: "Anthropic's three-axis target for assistant behavior, introduced in Askell et al. (2021) as a working definition of <em>aligned</em>: the model should help the user, be truthful about what it knows and does not know, and avoid harm. HHH became the de facto value-alignment framing for RLHF-tuned chat models.",
    resources: [
      { label: "Askell et al., 2021 — A General Language Assistant as a Laboratory for Alignment", url: "https://arxiv.org/abs/2112.00861" },
      { label: "Anthropic — Core views on AI safety", url: "https://www.anthropic.com/news/core-views-on-ai-safety" }
    ]
  },

  "hle": {
    title: "HLE - Humanity's Last Exam",
    summary: "A 2,500-question benchmark of expert-written, closed-form problems spanning over 100 subjects (math, physics, chemistry, biology, medicine, humanities, computer science, and more), released January 2025 by the Center for AI Safety and Scale AI with roughly 1,000 subject-matter experts contributing. Named for the expectation that this cohort would be the last to assemble a broad expert-level exam before the frontier saturates it.",
    resources: [
      { label: "HLE paper (arXiv:2501.14249)", url: "https://arxiv.org/abs/2501.14249" },
      { label: "HLE site", url: "https://agi.safe.ai/" }
    ]
  },

  "hybrid-thinking": {
    title: "Hybrid thinking",
    summary: "A single model that ships in two modes: answer fast, or spend inference tokens on a visible chain of thought first. Anthropic's Claude 3.7 Sonnet (Feb 2025) was the first shipped example; Qwen3, Claude 4, DeepSeek-V3.1, and Gemini 2.5 followed. GPT-5 (Aug 2025) went further and made the mode choice automatic by routing between a fast path and a deep-reasoning path per request. The alternative, a separate reasoner model, was the shape of the 2024 wave; hybrid is the 2025-26 shape.",
    resources: [
      { label: "Anthropic - Claude 3.7 Sonnet", url: "https://www.anthropic.com/news/claude-3-7-sonnet" },
      { label: "OpenAI - GPT-5", url: "https://openai.com/index/introducing-gpt-5/" },
      { label: "DeepSeek - V3.1 release", url: "https://www.deepseek.com/en/news/deepseek-v3-1/" }
    ]
  },

  "icl": {
    title: "In-context learning (ICL)",
    summary: "A frozen language model performs a brand-new task purely from examples or instructions placed in its prompt, with no gradient updates. Few-shot uses a handful of examples; zero-shot uses just an instruction. GPT-3 was the loud first demonstration, and it is the reason a prompt is a steering lever rather than just a question.",
    resources: [
      { label: "GPT-3 paper (Brown et al., 2020)", url: "https://arxiv.org/abs/2005.14165" },
      { label: "Wikipedia — Prompt engineering", url: "https://en.wikipedia.org/wiki/Prompt_engineering" }
    ]
  },

  "in-context-learning": {
    title: "In-context learning",
    summary: "Synonymous with ICL — a pretrained model adapts to a new task purely from examples or instructions in the prompt, without any weight updates. The phenomenon is striking because the model behaves <em>as if</em> it had been fine-tuned on the in-prompt examples, even though its parameters are frozen.",
    resources: [
      { label: "Brown et al., 2020 — GPT-3 / ICL", url: "https://arxiv.org/abs/2005.14165" },
      { label: "Xie et al., 2022 — An Explanation of ICL as Bayesian Inference", url: "https://arxiv.org/abs/2111.02080" }
    ]
  },

  "instruction-tuning": {
    title: "Instruction tuning",
    summary: "Supervised fine-tuning on a dataset of (instruction, response) pairs so the model learns to follow natural-language commands instead of merely continuing text. FLAN (Google, 2021) and T0 were the early multitask demonstrations; InstructGPT made it the standard first step of post-training before RLHF.",
    resources: [
      { label: "Wei et al., 2021 — Finetuned Language Models Are Zero-Shot Learners (FLAN)", url: "https://arxiv.org/abs/2109.01652" },
      { label: "Ouyang et al., 2022 — InstructGPT", url: "https://arxiv.org/abs/2203.02155" }
    ]
  },

  "intent-alignment-gap": {
    title: "Intent alignment gap",
    summary: "The gap between what the user <em>wanted</em> and what the model optimizes for. A base LM optimized for next-token likelihood is not optimized to be helpful, honest, or harmless — InstructGPT framed RLHF specifically as a method to close this gap by training on human preferences over assistant behavior.",
    resources: [
      { label: "Ouyang et al., 2022 — InstructGPT", url: "https://arxiv.org/abs/2203.02155" },
      { label: "Christiano et al., 2017 — Deep RL from Human Preferences", url: "https://arxiv.org/abs/1706.03741" }
    ]
  },

  "ipo": {
    title: "IPO - Identity Preference Optimization",
    summary: "Azar et al., Oct 2023. A DPO variant that replaces DPO's Bradley-Terry log-sigmoid with an identity mapping, so the loss stops running off to infinity on near-certain preference pairs. Same offline / no-reward-model setup as DPO, less prone to overfitting on confident preference labels.",
    resources: [
      { label: "Azar et al., 2023 - IPO", url: "https://arxiv.org/abs/2310.12036" }
    ]
  },

  "judge-drift": {
    title: "Judge drift",
    summary: "A failure mode of LLM-as-judge: when an outer loop optimizes against an LLM judge, the search eventually finds outputs that please the judge in ways a human would not endorse — the same Goodhart attractor as reward hacking, but with a language-model proxy. Mitigations stack: held-out human anchors, judge ensembling, and frequent recalibration.",
    resources: [
      { label: "Zheng et al., 2023 — Judging LLM-as-a-Judge (MT-Bench)", url: "https://arxiv.org/abs/2306.05685" },
      { label: "Panickssery et al., 2024 — LLM Evaluators Recognize and Favor Their Own Generations", url: "https://arxiv.org/abs/2404.13076" }
    ]
  },

  "kl-constraint": {
    title: "KL constraint",
    summary: "A constraint that the post-RL policy stay close (in KL divergence) to the reference SFT policy. In PPO-RLHF it is added as a penalty term in the reward; in DPO it is baked into the closed-form objective. Without it, the policy drifts far from the language model's natural distribution and starts producing degenerate text that hacks the reward.",
    resources: [
      { label: "Ouyang et al., 2022 — InstructGPT (KL penalty)", url: "https://arxiv.org/abs/2203.02155" },
      { label: "Rafailov et al., 2023 — DPO (KL in closed form)", url: "https://arxiv.org/abs/2305.18290" }
    ]
  },

  "kl-penalty": {
    title: "KL penalty",
    summary: "The same idea as the KL constraint, expressed as a soft penalty term in the reward: <code>r = r_RM - &beta; &middot; KL(&pi; || &pi;_ref)</code>. The hyperparameter &beta; trades off reward-chasing against staying close to the reference SFT policy. Tuning &beta; is one of the dark arts of RLHF.",
    resources: [
      { label: "Stiennon et al., 2020 — Learning to summarize with HF (early KL penalty)", url: "https://arxiv.org/abs/2009.01325" },
      { label: "InstructGPT paper", url: "https://arxiv.org/abs/2203.02155" }
    ]
  },

  "kto": {
    title: "KTO - Kahneman-Tversky Optimization",
    summary: "Ethayarajh et al., Feb 2024. A DPO-family loss that does NOT require pairs. Each training example is a single response tagged desirable or undesirable, and the loss is a Kahneman-Tversky prospect-theory utility. Matches the data shape a lot of teams actually have (thumbs-up / thumbs-down feeds) instead of the ranked A/B DPO wants.",
    resources: [
      { label: "Ethayarajh et al., 2024 - KTO", url: "https://arxiv.org/abs/2402.01306" }
    ]
  },

  "kv-cache": {
    title: "KV cache",
    summary: "The stored keys and values from every previously generated token, held in GPU memory so that autoregressive decoding does not recompute them each step. Size scales linearly with context length, layers, and heads; at 128k context and dozens of layers a dense-MHA cache is measured in tens of gigabytes per sequence. This is why modern architectures optimize for KV-cache shrink (MQA, GQA, MLA) more than for parameter count.",
    resources: [
      { label: "vLLM / PagedAttention (Kwon et al., 2023)", url: "https://arxiv.org/abs/2309.06180" },
      { label: "GQA - the standard KV shrink (Ainslie et al., 2023)", url: "https://arxiv.org/abs/2305.13245" }
    ]
  },

  "llama": {
    title: "LLaMA",
    summary: "Meta's open-weights LLM family. LLaMA 1 (Feb 2023, Touvron et al.) showed that a 13B model trained on 1T tokens could match GPT-3 175B, validating Chinchilla's data-heavy regime. LLaMA 2 / 3 / 3.1 made permissively licensed open weights the substrate that the entire open-source post-training ecosystem (Alpaca, Vicuna, QLoRA, R1) built on.",
    resources: [
      { label: "Touvron et al., 2023 — LLaMA paper", url: "https://arxiv.org/abs/2302.13971" },
      { label: "Touvron et al., 2023 — Llama 2", url: "https://arxiv.org/abs/2307.09288" },
      { label: "Meta — Llama 3 announcement", url: "https://ai.meta.com/blog/meta-llama-3/" }
    ]
  },

  "llm-as-judge": {
    title: "LLM-as-judge",
    summary: "Using a strong LLM to score or compare outputs of other models — typically as a pairwise preference oracle. Zheng et al. (2023) showed GPT-4 agreed with human raters about as often as humans agreed with each other on MT-Bench. It is the workhorse of cheap evaluation, but it carries position bias, self-preference bias, and Goodhart risk.",
    resources: [
      { label: "Zheng et al., 2023 — Judging LLM-as-a-Judge", url: "https://arxiv.org/abs/2306.05685" },
      { label: "Dubois et al., 2024 — AlpacaEval LLM judges", url: "https://arxiv.org/abs/2404.04475" }
    ]
  },

  "lora": {
    title: "LoRA — Low-Rank Adaptation",
    summary: "Freeze the pretrained weights, inject a pair of low-rank matrices <em>A</em> and <em>B</em> into each attention projection, and train only those. The rank-<em>r</em> bottleneck means you update &lt;1% of parameters with no inference-time latency cost (the adapters can be merged). LoRA is the most widely deployed PEFT method by far.",
    resources: [
      { label: "Hu et al., 2021 — LoRA paper", url: "https://arxiv.org/abs/2106.09685" },
      { label: "HuggingFace PEFT library", url: "https://github.com/huggingface/peft" }
    ]
  },

  "masked-language-modeling": {
    title: "Masked language modeling (MLM)",
    summary: "The training objective behind BERT: randomly mask ~15% of input tokens and ask the model to predict them from bidirectional context. MLM gives encoder-only transformers their understanding power but cannot be used to generate fluent text autoregressively, which is why decoder-only next-token prediction won the LLM era.",
    resources: [
      { label: "Devlin et al., 2018 — BERT / MLM", url: "https://arxiv.org/abs/1810.04805" },
      { label: "Wikipedia — BERT", url: "https://en.wikipedia.org/wiki/BERT_(language_model)" }
    ]
  },

  "math-500": {
    title: "MATH-500",
    summary: "A 500-problem evaluation subset of Hendrycks et al.'s MATH benchmark, popularized by OpenAI's PRM800K paper as the standard small set for fast iteration. Used heavily in DeepSeek-R1 and s1 to report math-reasoning pass@1.",
    resources: [
      { label: "Hendrycks et al., 2021 — MATH paper", url: "https://arxiv.org/abs/2103.03874" },
      { label: "Lightman et al., 2023 — PRM800K (introduces MATH-500)", url: "https://arxiv.org/abs/2305.20050" }
    ]
  },

  "mcp": {
    title: "Model Context Protocol (MCP)",
    summary: "An open protocol (Anthropic, November 2024) that standardizes how LLM agents connect to external tools, data sources, and resources — a USB-C port for AI. MCP servers expose tools, prompts, and resources via JSON-RPC; MCP clients (Claude Desktop, Cursor, IDEs) call them. Adoption was rapid: OpenAI, Google, and most agent frameworks now speak MCP.",
    resources: [
      { label: "Anthropic — Introducing MCP", url: "https://www.anthropic.com/news/model-context-protocol" },
      { label: "MCP specification", url: "https://modelcontextprotocol.io/" },
      { label: "MCP GitHub", url: "https://github.com/modelcontextprotocol" }
    ]
  },

  "metr-horizon": {
    title: "METR time horizon",
    summary: "METR's 50%-success task-length metric: the length of task (measured in expert-human minutes on their HCAST + RE-Bench + 66-short-tasks suite) at which a model achieves a 50% success rate. Reframes agent competence as an axis of expanding autonomy rather than a fixed-benchmark pass rate. The March 2025 headline was a ~7-month doubling since 2019; the January 2026 update reported GPT-5 at 214 minutes and Claude Opus 4.5 at 320 minutes.",
    resources: [
      { label: "Kwa et al., Mar 2025 - Measuring AI Ability to Complete Long Software Tasks", url: "https://arxiv.org/abs/2503.14499" },
      { label: "METR - Time Horizon 1.1 (Jan 2026)", url: "https://metr.org/blog/2026-1-29-time-horizon-1-1/" },
      { label: "METR - Time Horizons tracker", url: "https://metr.org/time-horizons/" }
    ]
  },

  "mid-training-annealing": {
    title: "Mid-training (annealing / cooldown)",
    summary: "A late pretraining stage where you keep your highest-quality tokens (math, code, textbooks, distilled reasoning traces) and warm the learning rate down while feeding only that. The technique is called cooldown or annealing in the Llama 3 herd and Dolmino in OLMo 2. Same shape as post-training preference SFT but applied to base pretraining, and cheap because it runs only for a small fraction of total tokens.",
    resources: [
      { label: "OLMo 2 (Groeneveld et al., 2025)", url: "https://arxiv.org/abs/2501.00656" },
      { label: "Llama 3 herd technical report", url: "https://arxiv.org/abs/2407.21783" }
    ]
  },

  "miprov2": {
    title: "MIPROv2",
    summary: "A DSPy optimizer (Opsahl-Ong et al., 2024) that jointly tunes instructions and few-shot demos using a Bayesian search over candidates, with bootstrapped demos drawn from the training set and instructions proposed by an LLM. It was the strongest DSPy optimizer until GEPA, and remains the standard joint instruction-and-demo baseline.",
    resources: [
      { label: "Opsahl-Ong et al., 2024 — MIPROv2 paper", url: "https://arxiv.org/abs/2406.11695" },
      { label: "MIPROv2 in DSPy docs", url: "https://dspy.ai/api/optimizers/MIPROv2/" }
    ]
  },

  "mla": {
    title: "Multi-head latent attention (MLA)",
    summary: "DeepSeek's KV-cache shrink. Instead of caching per-head keys and values, cache a low-rank latent vector and reconstruct per-head K and V on the fly with two learned up-projections. Introduced in DeepSeek-V2 (2024), reused in DeepSeek-V3. Shrinks the cache more than GQA and, per DeepSeek's ablations, keeps modeling quality above MHA rather than below it. Pairs naturally with MoE, since both make the per-token cost small.",
    resources: [
      { label: "DeepSeek-V2 paper (MLA introduced)", url: "https://arxiv.org/abs/2405.04434" },
      { label: "DeepSeek-V3 technical report", url: "https://arxiv.org/abs/2412.19437" }
    ]
  },

  "mmlu": {
    title: "MMLU",
    summary: "Massive Multitask Language Understanding (Hendrycks et al., 2020) — 57 multiple-choice subjects, from elementary math to professional law and medicine, used as a broad knowledge-and-reasoning benchmark. MMLU became the universal one-number eval; nearly every frontier-model release reports it.",
    resources: [
      { label: "Hendrycks et al., 2020 — MMLU paper", url: "https://arxiv.org/abs/2009.03300" },
      { label: "MMLU GitHub", url: "https://github.com/hendrycks/test" }
    ]
  },

  "moe": {
    title: "Mixture-of-Experts (MoE)",
    summary: "An architecture where each token is routed by a learned gate to a small subset (top-k) of many parallel feed-forward experts - so the model has huge total parameters but only activates a fraction per token. Sparsely-gated MoE (Shazeer et al., 2017) is the modern recipe; Mixtral, DeepSeek-V3, Qwen3, and Kimi K2 are MoE at the frontier. DeepSeek-V3's key innovation was auxiliary-loss-free load balancing (see <code>aux-loss-free-balancing</code>), which keeps routing balanced without distorting the language-modeling loss.",
    resources: [
      { label: "Shazeer et al., 2017 - Sparsely-Gated MoE", url: "https://arxiv.org/abs/1701.06538" },
      { label: "Mixtral 8x7B paper (Jiang et al., 2024)", url: "https://arxiv.org/abs/2401.04088" },
      { label: "DeepSeek-V3 paper", url: "https://arxiv.org/abs/2412.19437" }
    ]
  },

  "mqa": {
    title: "Multi-query attention (MQA)",
    summary: "The most aggressive KV-cache shrink: all query heads share a single key/value head. Introduced by Shazeer (2019). Divides the KV cache by the number of heads, which at n_heads = 64 is a huge win. The trade is quality; GQA later split the difference and became the standard.",
    resources: [
      { label: "Shazeer, 2019 - MQA", url: "https://arxiv.org/abs/1911.02150" }
    ]
  },

  "mtp": {
    title: "Multi-token prediction (MTP)",
    summary: "Train the model with several shallow prediction heads that guess the next D tokens in parallel (each conditioned on the previous head's guess), instead of only the next token. Popularized by DeepSeek-V3, which reports a quality gain from the denser gradient signal. Bonus: the extra heads double as draft-token producers for speculative decoding at inference time, giving an MTP-trained model a serving speedup for free.",
    resources: [
      { label: "DeepSeek-V3 technical report", url: "https://arxiv.org/abs/2412.19437" },
      { label: "Better & Faster LLMs via Multi-token Prediction (Gloeckle et al., 2024)", url: "https://arxiv.org/abs/2404.19737" }
    ]
  },

  "multi-head-attention": {
    title: "Multi-head attention",
    summary: "Split the input into <em>h</em> parallel attention heads, each with its own learned query/key/value projection, run scaled dot-product attention in each, then concatenate and project back. Each head can attend to a different relational pattern (syntax, coreference, position). It is the workhorse computation of the transformer.",
    resources: [
      { label: "Vaswani et al., 2017 — Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762" },
      { label: "Wikipedia — Attention (machine learning)", url: "https://en.wikipedia.org/wiki/Attention_(machine_learning)" }
    ]
  },

  "native-multimodal": {
    title: "Native multimodal",
    summary: "Models trained from scratch with text, images, audio, and video as first-class input/output modalities in a single transformer — rather than bolting a vision encoder onto a pretrained LLM. Google Gemini (2023) and GPT-4o (2024) were the first widely deployed native-multimodal frontier models, with end-to-end audio I/O and image generation in the same network.",
    resources: [
      { label: "Gemini technical report (Google, 2023)", url: "https://arxiv.org/abs/2312.11805" },
      { label: "OpenAI — GPT-4o announcement", url: "https://openai.com/index/hello-gpt-4o/" }
    ]
  },

  "next-token-prediction": {
    title: "Next-token prediction",
    summary: "The training objective of decoder-only LLMs: given the prefix, predict the next token; do that for trillions of tokens. The deep claim of the scale era is that this single objective, run on enough data with enough parameters, is a universal training signal that yields reasoning, world knowledge, and instruction-following as side effects.",
    resources: [
      { label: "Radford et al., 2018 — GPT", url: "https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf" },
      { label: "Brown et al., 2020 — GPT-3", url: "https://arxiv.org/abs/2005.14165" }
    ]
  },

  "nf4": {
    title: "NF4 — 4-bit NormalFloat",
    summary: "A 4-bit datatype introduced in QLoRA (Dettmers et al., 2023) whose 16 quantization levels are chosen to be information-theoretically optimal for normally distributed weights (which is roughly what pretrained LLM weights look like). NF4 outperforms 4-bit integer and 4-bit float quantization for LLM finetuning, with negligible accuracy loss vs. FP16.",
    resources: [
      { label: "Dettmers et al., 2023 — QLoRA paper (NF4)", url: "https://arxiv.org/abs/2305.14314" },
      { label: "bitsandbytes library", url: "https://github.com/bitsandbytes-foundation/bitsandbytes" }
    ]
  },

  "obfuscated-reward-hacking": {
    title: "Obfuscated reward hacking",
    summary: "Baker et al. (OpenAI, March 2025) showed that a weak-model CoT monitor (GPT-4o) can reliably catch a strong reasoner (o3-mini) hacking a coding verifier - because the model tends to SAY it is about to hack the checker. Applying optimization pressure to that CoT (penalizing bad thoughts during training) does not stop the hacking; it teaches the model to stop mentioning it while still doing it. The recommendation is to leave the CoT unpressured so the trace remains usable as a monitoring signal.",
    resources: [
      { label: "Baker et al., 2025", url: "https://arxiv.org/abs/2503.11926" },
      { label: "OpenAI blog", url: "https://openai.com/index/chain-of-thought-monitoring/" }
    ]
  },

  "open-weights": {
    title: "Open-weights model",
    summary: "A model whose trained parameters are publicly downloadable, even if the training data, code, or full recipe is not. LLaMA, Mistral, Mixtral, Qwen, and DeepSeek are open-weights; GPT-4 and Claude are closed-weights. The distinction matters because open weights enable fine-tuning, distillation, mechanistic interpretability, and local deployment.",
    resources: [
      { label: "Meta — Llama 3 announcement", url: "https://ai.meta.com/blog/meta-llama-3/" },
      { label: "DeepSeek-R1 paper", url: "https://arxiv.org/abs/2501.12948" }
    ]
  },

  "openrlhf": {
    title: "OpenRLHF",
    summary: "One of the earliest popular open-source RLHF frameworks. Ray-based, single-node-to-multi-node scaling, broad algorithm coverage from PPO through DPO and GRPO. Still the easiest starting point for reproducing RLHF-style pipelines; verl or slime are the choices at larger scale.",
    resources: [
      { label: "OpenRLHF (GitHub)", url: "https://github.com/OpenRLHF/OpenRLHF" }
    ]
  },

  "opro": {
    title: "OPRO — Optimization by PROmpting",
    summary: "A 2023 DeepMind method (Yang et al.) that uses an LLM itself as the optimizer: at each step it sees a history of past prompts and their scores, and proposes a new prompt aimed at higher score. OPRO showed that an LLM can do non-trivial black-box optimization purely through prompting — discovered prompts that beat <em>let's think step by step</em> on GSM8K.",
    resources: [
      { label: "Yang et al., 2023 — OPRO paper", url: "https://arxiv.org/abs/2309.03409" }
    ]
  },

  "orpo": {
    title: "ORPO - Odds-Ratio Preference Optimization",
    summary: "Hong et al., Mar 2024. Folds SFT and preference optimization into a single objective with an odds-ratio term, so you no longer run separate SFT and preference stages. No reference model needed. Monolithic in the paper's own framing.",
    resources: [
      { label: "Hong et al., 2024 - ORPO", url: "https://arxiv.org/abs/2403.07691" }
    ]
  },

  "osworld": {
    title: "OSWorld",
    summary: "A 2024 benchmark (Xie et al.) of 369 real computer tasks across Ubuntu, Windows, and macOS — file management, web browsing, office apps, multi-app workflows — graded by execution-based checks. OSWorld is the canonical eval for computer-use agents; humans score ~72%, and frontier models have been climbing from single digits toward the human bar.",
    resources: [
      { label: "Xie et al., 2024 — OSWorld paper", url: "https://arxiv.org/abs/2404.07972" },
      { label: "OSWorld GitHub", url: "https://github.com/xlang-ai/OSWorld" }
    ]
  },

  "overlong-shaping": {
    title: "Overlong reward shaping",
    summary: "Instead of hard-truncating responses that hit the max-length cap and assigning them zero reward (pure noise for the loss), apply a soft, monotonic length penalty as the response approaches the cap. Preserves signal near the boundary and stops the policy from oscillating between <em>thought too long, got zero</em> and <em>thought short enough, got scored</em>. Introduced in DAPO.",
    resources: [
      { label: "DAPO paper", url: "https://arxiv.org/abs/2503.14476" }
    ]
  },

  "paged-attention": {
    title: "PagedAttention",
    summary: "A KV-cache memory manager for LLM serving that stores each request's cache as a list of fixed-size blocks and a per-request block table, so the attention kernel can gather from a non-contiguous layout. Introduced by vLLM (Kwon et al., SOSP 2023) to fix the pre-2023 problem of reserving contiguous max-context buffers per request, which left 60-80% of KV memory unused. Every serious 2024+ serving engine adopted the same idea.",
    resources: [
      { label: "Kwon et al., SOSP 2023 - PagedAttention", url: "https://arxiv.org/abs/2309.06180" },
      { label: "vLLM engine (GitHub)", url: "https://github.com/vllm-project/vllm" },
      { label: "Anyscale - Continuous batching benchmark", url: "https://www.anyscale.com/blog/continuous-batching-llm-inference" }
    ]
  },

  "paged-optimizers": {
    title: "Paged optimizers",
    summary: "A QLoRA trick that uses NVIDIA's unified memory to swap optimizer state between GPU and CPU on demand, avoiding OOM spikes during gradient checkpointing — analogous to how an OS pages memory to disk. It is the last of the three QLoRA innovations (NF4 + double quantization + paged optimizers) that lets you finetune a 65B model on a single 48GB GPU.",
    resources: [
      { label: "Dettmers et al., 2023 — QLoRA paper", url: "https://arxiv.org/abs/2305.14314" },
      { label: "bitsandbytes library", url: "https://github.com/bitsandbytes-foundation/bitsandbytes" }
    ]
  },

  "pairwise-preference": {
    title: "Pairwise preference data",
    summary: "The training signal for RLHF and DPO: a human (or LLM judge) sees two model responses to the same prompt and picks the better one. Pairwise comparisons are easier and more reliable for raters than absolute Likert scores, and they map cleanly to a Bradley-Terry reward model.",
    resources: [
      { label: "Christiano et al., 2017 — RL from Human Preferences", url: "https://arxiv.org/abs/1706.03741" },
      { label: "Ouyang et al., 2022 — InstructGPT", url: "https://arxiv.org/abs/2203.02155" }
    ]
  },

  "pareto": {
    title: "Pareto frontier",
    summary: "The set of candidates that are not dominated by any other candidate on every objective at once — improving on one metric requires sacrificing another. Keeping a Pareto front of prompts or policies (rather than only the single best) prevents the search from collapsing onto one fragile winner that happens to top the aggregate score.",
    resources: [
      { label: "Wikipedia — Pareto efficiency", url: "https://en.wikipedia.org/wiki/Pareto_efficiency" },
      { label: "Wikipedia — Multi-objective optimization", url: "https://en.wikipedia.org/wiki/Multi-objective_optimization" }
    ]
  },

  "pareto-frontier": {
    title: "Pareto frontier",
    summary: "The set of candidates that are not dominated by any other candidate on every objective at once — improving on one metric requires sacrificing another. In GEPA, keeping a Pareto front of prompts (rather than only the single best) prevents the search from collapsing onto one fragile winner that happens to top the aggregate score.",
    resources: [
      { label: "Wikipedia — Pareto efficiency", url: "https://en.wikipedia.org/wiki/Pareto_efficiency" },
      { label: "Wikipedia — Multi-objective optimization", url: "https://en.wikipedia.org/wiki/Multi-objective_optimization" }
    ]
  },

  "pass-at-k": {
    title: "pass@k",
    summary: "Coding-benchmark metric: probability that at least one of k independently sampled model responses passes the test suite. pass@1 is one-shot success; pass@k with k &gt; 1 measures whether the model can solve the problem given more attempts. High pass@k with low pass@1 means the capability is there but unreliable.",
    resources: [
      { label: "Chen et al., 2021 - HumanEval / Codex", url: "https://arxiv.org/abs/2107.03374" }
    ]
  },

  "peft": {
    title: "PEFT — Parameter-Efficient Fine-Tuning",
    summary: "The umbrella term for fine-tuning methods that freeze most of the pretrained model and update only a small set of new or selected parameters — LoRA, prefix tuning, prompt tuning, adapters, (IA)³, and so on. PEFT methods can match full fine-tuning quality while updating &lt;1% of weights, slashing memory and storage costs per task.",
    resources: [
      { label: "HuggingFace PEFT library + docs", url: "https://huggingface.co/docs/peft/" },
      { label: "Lialin et al., 2023 — PEFT survey", url: "https://arxiv.org/abs/2303.15647" }
    ]
  },

  "positional-encoding": {
    title: "Positional encoding",
    summary: "Self-attention is permutation-invariant — it does not know the order of tokens — so transformers add a per-position vector to inject sequence information. Vaswani used fixed sinusoids; modern LLMs use rotary positional embeddings (RoPE, Su et al. 2021), which encode position by rotating query/key vectors and generalize better to long context.",
    resources: [
      { label: "Vaswani et al., 2017 — Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762" },
      { label: "Su et al., 2021 — RoPE paper", url: "https://arxiv.org/abs/2104.09864" }
    ]
  },

  "power-law": {
    title: "Power law (scaling)",
    summary: "A relationship of the form <code>y = a &middot; x^b</code> — a straight line on a log-log plot. LLM loss decreases as a power law in parameters, data, and compute (Kaplan et al. 2020, Hoffmann et al. 2022). The smooth, predictable nature of these curves is what made <em>just scale it up</em> a viable strategy in 2020-2022.",
    resources: [
      { label: "Kaplan et al., 2020 — Scaling Laws for Neural Language Models", url: "https://arxiv.org/abs/2001.08361" },
      { label: "Hoffmann et al., 2022 — Chinchilla scaling laws", url: "https://arxiv.org/abs/2203.15556" },
      { label: "Wikipedia — Power law", url: "https://en.wikipedia.org/wiki/Power_law" }
    ]
  },

  "ppo": {
    title: "PPO — Proximal Policy Optimization",
    summary: "OpenAI's 2017 policy-gradient RL algorithm that uses a clipped surrogate objective to keep each update close to the current policy — stable, sample-efficient, and easy to tune. PPO was the RL backbone of InstructGPT and ChatGPT-era RLHF; DPO and GRPO are both reactions against its complexity and cost.",
    resources: [
      { label: "Schulman et al., 2017 — PPO paper", url: "https://arxiv.org/abs/1707.06347" },
      { label: "Ouyang et al., 2022 — InstructGPT (PPO for RLHF)", url: "https://arxiv.org/abs/2203.02155" }
    ]
  },

  "prefix-tuning": {
    title: "Prefix tuning",
    summary: "Li & Liang (2021): prepend a short sequence of trainable continuous vectors to <em>every layer's</em> attention keys and values, while keeping the LM frozen. Prefix tuning is essentially soft prompt tuning extended to all layers, and it was one of the first PEFT methods to match full fine-tuning on generation tasks with &lt;0.1% of parameters.",
    resources: [
      { label: "Li & Liang, 2021 — Prefix-Tuning paper", url: "https://arxiv.org/abs/2101.00190" }
    ]
  },

  "pretraining": {
    title: "Pretraining",
    summary: "The first, biggest, most expensive stage of building an LLM: take a randomly initialized transformer, train it on trillions of tokens of web/code/book text with a self-supervised objective (next-token prediction, MLM) until the loss curve saturates. Everything after — SFT, RLHF, RL — is comparatively cheap shaping of the resulting base model.",
    resources: [
      { label: "Radford et al., 2018 — GPT (pretrain-then-finetune)", url: "https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf" },
      { label: "Brown et al., 2020 — GPT-3", url: "https://arxiv.org/abs/2005.14165" }
    ]
  },

  "process-reward-model": {
    title: "Process reward model (PRM)",
    summary: "A reward model trained to score each <em>step</em> of a chain-of-thought, not just the final answer — so the RL signal can credit good intermediate reasoning even when the final answer is wrong. Lightman et al. (2023) released PRM800K, 800K step-level human-labeled annotations of MATH solutions, which trained the first widely cited PRM.",
    resources: [
      { label: "Lightman et al., 2023 — PRM800K paper", url: "https://arxiv.org/abs/2305.20050" },
      { label: "PRM800K GitHub (OpenAI)", url: "https://github.com/openai/prm800k" }
    ]
  },

  "process-vs-outcome-reward": {
    title: "Process vs outcome reward",
    summary: "Two ways to give RL feedback on reasoning. <em>Outcome reward</em> only checks the final answer (cheap, easy to verify, but blind to how the model got there). <em>Process reward</em> scores each step (denser signal, fewer credit-assignment problems, but expensive to label). DeepSeek-R1 famously used pure outcome reward (RLVR) and still produced sophisticated reasoning traces.",
    resources: [
      { label: "Uesato et al., 2022 — Process vs Outcome Supervision", url: "https://arxiv.org/abs/2211.14275" },
      { label: "Lightman et al., 2023 — Let's Verify Step by Step", url: "https://arxiv.org/abs/2305.20050" }
    ]
  },

  "prompt-injection": {
    title: "Prompt injection",
    summary: "Simon Willison's Sept 2022 name for the LLM analogue of SQL injection: instructions in user-supplied data hijack the model that was supposed to be processing the data. The <em>indirect</em> variant (Greshake et al., 2023) is the agent version: the attacker never talks to the model, they plant instructions inside a document, email, calendar invite, or webpage that the agent later reads while acting on the user's behalf. Documented in-production attacks include EchoLeak (CVE-2025-32711, Microsoft 365 Copilot) and Black Hat 2025's Gemini smart-home takeover. No settled defense; the current shape is Anthropic constitutional classifiers and Google DeepMind CaMeL.",
    resources: [
      { label: "Willison - Prompt injection attacks against GPT-3 (Sept 2022)", url: "https://simonwillison.net/2022/Sep/12/prompt-injection/" },
      { label: "Greshake et al., 2023 - Indirect prompt injection", url: "https://arxiv.org/abs/2302.12173" },
      { label: "Willison - The lethal trifecta (Jun 2025)", url: "https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/" }
    ]
  },

  "prompt-tuning": {
    title: "Prompt tuning",
    summary: "Lester et al. (2021): freeze the model and learn a short sequence of continuous embedding vectors that get prepended to the input — trained by gradient descent on the downstream task. At scale, prompt tuning closes the gap with full fine-tuning while updating &lt;0.01% of parameters. It is a PEFT method, despite the name <em>prompt</em>.",
    resources: [
      { label: "Lester et al., 2021 — The Power of Scale for Prompt Tuning", url: "https://arxiv.org/abs/2104.08691" }
    ]
  },

  "promptbreeder": {
    title: "PromptBreeder",
    summary: "A 2023 DeepMind method (Fernando et al.) that evolves both prompts <em>and</em> the mutation operators used to evolve them — a self-referential evolutionary loop where the LLM both produces candidates and proposes how to mutate them. It outperformed CoT, APE, and OPRO on GSM8K and BBH at the time.",
    resources: [
      { label: "Fernando et al., 2023 — PromptBreeder paper", url: "https://arxiv.org/abs/2309.16797" }
    ]
  },

  "qlora": {
    title: "QLoRA",
    summary: "Dettmers et al. (2023) — fine-tuning of a 4-bit-quantized frozen base model with LoRA adapters in FP16 on top. Three innovations together (NF4 quantization, double quantization, paged optimizers) make it possible to finetune a 65B model on a single 48GB GPU, while matching full 16-bit fine-tuning quality. QLoRA is what put LLM fine-tuning in reach of laptops.",
    resources: [
      { label: "Dettmers et al., 2023 — QLoRA paper", url: "https://arxiv.org/abs/2305.14314" },
      { label: "QLoRA GitHub", url: "https://github.com/artidoro/qlora" }
    ]
  },

  "quality-classifier": {
    title: "Model-based quality classifier",
    summary: "A small (fastText or BERT-scale) model trained to score how &quot;high-quality&quot; a document is, then used to filter Common Crawl before pretraining. The label source varies: FineWeb-Edu uses educational ratings from a big instruction model; DCLM trains a fastText on OpenHermes + ELI5 posts; Nemotron-CC uses an ensemble. Model-based filtering replaced hand-written heuristics because it can see coherence and pedagogy rather than surface features.",
    resources: [
      { label: "DCLM (Li et al., 2024)", url: "https://arxiv.org/abs/2406.11794" },
      { label: "FineWeb-Edu (Penedo et al., 2024)", url: "https://arxiv.org/abs/2406.17557" },
      { label: "Nemotron-CC (Nvidia, 2024)", url: "https://arxiv.org/abs/2412.02595" }
    ]
  },

  "react-loop": {
    title: "ReAct loop",
    summary: "Yao et al. (2022): interleave <em>reasoning</em> (thoughts written in natural language) with <em>acting</em> (tool calls or environment actions) in a single LLM trace. ReAct was the first widely cited recipe for grounded LLM agents and remains the conceptual backbone of every modern agent loop, from AutoGPT to Claude Code.",
    resources: [
      { label: "Yao et al., 2022 — ReAct paper", url: "https://arxiv.org/abs/2210.03629" }
    ]
  },

  "reasoning-distillation": {
    title: "Reasoning distillation",
    summary: "Training a small student model to imitate a big reasoner's chain-of-thought traces on hard problems. DeepSeek-R1 distilled its reasoning traces into Qwen and Llama backbones (R1-Distill-Qwen, R1-Distill-Llama) and the small distilled models beat size-matched RL-from-scratch. Distinct from pretraining-time logit distillation (Gemma 2/3), which copies the teacher's full next-token distribution across a huge pretraining corpus.",
    resources: [
      { label: "DeepSeek-R1 paper (distillation section)", url: "https://arxiv.org/abs/2501.12948" }
    ]
  },

  "reflective-evolution": {
    title: "Reflective evolution",
    summary: "Prompt-search loops where each mutation is informed by a natural-language <em>reflection</em> on why the previous candidate failed — diagnose, then fix the specific failure — rather than blind random mutation. GEPA is the canonical example, and the reflective signal is why it can beat GRPO with orders of magnitude fewer rollouts.",
    resources: [
      { label: "Agrawal et al., 2025 — GEPA paper", url: "https://arxiv.org/abs/2507.19457" },
      { label: "Shinn et al., 2023 — Reflexion (related)", url: "https://arxiv.org/abs/2303.11366" }
    ]
  },

  "reflective-mutation": {
    title: "Reflective mutation",
    summary: "The single-step inside reflective evolution: take a failing candidate plus a diagnosis of why it failed, ask the LLM to write a new candidate that fixes exactly that failure mode. It is targeted (not random) and grounded in observed errors (not abstract priors), which is why it consumes so few rollouts.",
    resources: [
      { label: "Agrawal et al., 2025 — GEPA paper", url: "https://arxiv.org/abs/2507.19457" },
      { label: "Shinn et al., 2023 — Reflexion", url: "https://arxiv.org/abs/2303.11366" }
    ]
  },

  "reward-hacking": {
    title: "Reward hacking",
    summary: "When an RL policy finds an unintended high-reward strategy that exploits a flaw in the reward function rather than solving the intended task — the empirical face of Goodhart's law in RL. In RLHF, classic symptoms are sycophancy, length inflation, and confidently wrong answers that the RM happens to score well.",
    resources: [
      { label: "Krakovna et al., 2020 — Specification gaming examples", url: "https://deepmindsafetyresearch.medium.com/specification-gaming-the-flip-side-of-ai-ingenuity-c85bdb0deeb4" },
      { label: "Skalse et al., 2022 — Defining and Characterizing Reward Hacking", url: "https://arxiv.org/abs/2209.13085" }
    ]
  },

  "reward-model": {
    title: "Reward model (RM)",
    summary: "In RLHF, a separately trained model that takes a (prompt, response) pair and outputs a scalar predicting how much a human would prefer it. The RM is trained on pairwise preference data with a Bradley-Terry loss, then used as the reward function during PPO. The quality of the final policy is bounded by the quality of the RM.",
    resources: [
      { label: "Christiano et al., 2017 — Deep RL from Human Preferences", url: "https://arxiv.org/abs/1706.03741" },
      { label: "Ouyang et al., 2022 — InstructGPT", url: "https://arxiv.org/abs/2203.02155" }
    ]
  },

  "rewardbench": {
    title: "RewardBench",
    summary: "A benchmark for reward-model quality: given a prompt and two candidate responses, does the RM pick the one humans preferred? RewardBench (Lambert et al., 2024) was the first such leaderboard; RewardBench 2 (Malik et al., 2025) is a harder, cleaner-annotated successor with scores dropping ~20 points versus v1, and rank correlates with downstream RL quality. Together they turn <em>how good is your RM</em> into a measured axis instead of a vibe.",
    resources: [
      { label: "RewardBench (Lambert et al., 2024)", url: "https://arxiv.org/abs/2403.13787" },
      { label: "RewardBench 2 (Malik et al., 2025)", url: "https://arxiv.org/abs/2506.01937" }
    ]
  },

  "rlaif": {
    title: "RLAIF - RL from AI Feedback",
    summary: "Same PPO-against-a-reward-model shape as RLHF, but the preference labels come from an AI evaluator prompted with a rulebook, not from human labelers. Introduced as the second stage of Constitutional AI; a Google follow-up (Lee et al., 2023) showed it is comparable to RLHF on summarization and dialogue, even when the labeler is the same size as the policy. Direct-RLAIF (d-RLAIF) skips the separate reward-model training entirely and reads the reward off an LLM prompt online during RL.",
    resources: [
      { label: "Bai et al., 2022 - Constitutional AI", url: "https://arxiv.org/abs/2212.08073" },
      { label: "Lee et al., 2023 - RLAIF vs RLHF", url: "https://arxiv.org/abs/2309.00267" }
    ]
  },

  "rlhf": {
    title: "RLHF — Reinforcement Learning from Human Feedback",
    summary: "The three-stage post-training recipe: (1) supervised fine-tuning on demonstrations, (2) train a reward model on pairwise human preferences, (3) optimize the SFT policy against the RM with PPO + KL constraint. InstructGPT and ChatGPT made this the standard alignment pipeline; DPO and GRPO are simplifications of the same idea.",
    resources: [
      { label: "Christiano et al., 2017 — Deep RL from Human Preferences", url: "https://arxiv.org/abs/1706.03741" },
      { label: "Ouyang et al., 2022 — InstructGPT", url: "https://arxiv.org/abs/2203.02155" }
    ]
  },

  "rlvr": {
    title: "RLVR - Reinforcement Learning from Verifiable Rewards",
    summary: "Use a programmatic verifier (a unit test, an equation checker, an integer-answer comparator) as the reward function - no learned reward model needed. Coined in the Tulu 3 paper (Nov 2024) and popularized by DeepSeek-R1. Verifiable rewards are harder to hack per-sample than learned RMs, so they enable much longer, more aggressive RL training - but not un-hackable: length bias, format hacking, and spec exploits are all real, and Ch 7 covers the failure modes and successor algorithms in detail.",
    resources: [
      { label: "Lambert et al., 2024 - Tulu 3 (introduces the RLVR framing)", url: "https://arxiv.org/abs/2411.15124" },
      { label: "DeepSeek-R1 paper", url: "https://arxiv.org/abs/2501.12948" }
    ]
  },

  "rmsnorm": {
    title: "RMSNorm",
    summary: "Root Mean Square LayerNorm. Skip the mean-subtraction step of LayerNorm and normalize only by the root-mean-square of the activation vector. Same practical behavior at large widths, fewer ops, no bias term. Introduced by Zhang and Sennrich (2019); adopted by Llama and every open flagship since.",
    resources: [
      { label: "Zhang & Sennrich, 2019 - RMSNorm", url: "https://arxiv.org/abs/1910.07467" },
      { label: "Llama paper (uses RMSNorm)", url: "https://arxiv.org/abs/2302.13971" }
    ]
  },

  "rollout": {
    title: "Rollout",
    summary: "A single trajectory sampled from the current policy — for an LLM, one full generation from prompt to stop token (and any tool calls / environment steps along the way). Rollouts are the unit of cost for RL: GRPO needs a <em>group</em> of rollouts per prompt to estimate the advantage. Reducing rollouts per gradient step is a major axis of efficiency research.",
    resources: [
      { label: "Sutton & Barto — Reinforcement Learning: An Introduction (free)", url: "http://incompleteideas.net/book/the-book-2nd.html" },
      { label: "Shao et al., 2024 — GRPO (group of rollouts)", url: "https://arxiv.org/abs/2402.03300" }
    ]
  },

  "rope": {
    title: "Rotary positional embeddings (RoPE)",
    summary: "Encode token position by rotating the query and key vectors by an angle that scales with position index and dimension frequency; the dot product then depends only on the relative offset between two tokens. Introduced by Su et al. (2021), popularized by GPT-NeoX and then Llama. Relative-position behavior is what makes long-context extension tricks (position interpolation, YaRN) possible at all.",
    resources: [
      { label: "Su et al., 2021 - RoFormer / RoPE", url: "https://arxiv.org/abs/2104.09864" }
    ]
  },

  "rubric-reward": {
    title: "Rubric reward",
    summary: "A reward function that scores a response against an enumerated list of named criteria with weights, producing a scalar as a weighted sum of criterion scores. Denser than a preference pair (a vector of criterion scores per annotation rather than one A-vs-B bit) and more inspectable (disagreement between reward and human judgment can be diagnosed to a specific axis). The current default in labs' non-verifiable domains: instruction following, safety, tone, honesty, open-ended tasks. Also hackable - rubric-hacking looks like inflating one criterion (e.g. self-reflection) at the cost of the rest.",
    resources: [
      { label: "Chasing the Tail: Rubric Reward Modeling", url: "https://arxiv.org/abs/2509.21500" }
    ]
  },

  "scalerl": {
    title: "ScaleRL",
    summary: "Meta et al.'s best-practice RL recipe from <em>The Art of Scaling Reinforcement Learning Compute for LLMs</em> (Khatri, Madaan, Tiwari et al., Oct 2025). Ingredients: async PipelineRL with an eight-step off-policy tolerance, CISPO as the loss, fp32 in the LM head to keep rollout and trainer engines numerically aligned, prompt-level loss averaging, batch-level advantage normalization, forced length interruption at the budget cap, zero-variance sample removal, and a no-positive-resampling curriculum. Fits a sigmoid predictive curve on small runs and extrapolates to a 100k-GPU-hour run.",
    resources: [
      { label: "Art of Scaling RL Compute (2025)", url: "https://arxiv.org/abs/2510.13786" }
    ]
  },

  "self-attention": {
    title: "Self-attention",
    summary: "Each token computes a weighted sum over <em>all</em> tokens in its context, with weights given by the softmax of query-key dot products. The headline operation of the transformer (Vaswani et al., 2017) — it replaced recurrence with a parallelizable mixing primitive whose cost grows quadratically in sequence length but constant in depth.",
    resources: [
      { label: "Vaswani et al., 2017 — Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762" },
      { label: "Wikipedia — Attention (machine learning)", url: "https://en.wikipedia.org/wiki/Attention_(machine_learning)" }
    ]
  },

  "sft": {
    title: "SFT — Supervised Fine-Tuning",
    summary: "Plain supervised learning on (input, target) pairs as a post-training step — typically (instruction, demonstration) pairs that teach the base LM to respond as an assistant. SFT is RLHF's first stage and the foundation everything else (RL, DPO) builds on; quality of the SFT mix often matters more than which RL algorithm follows.",
    resources: [
      { label: "Ouyang et al., 2022 — InstructGPT (SFT stage)", url: "https://arxiv.org/abs/2203.02155" },
      { label: "HuggingFace TRL SFTTrainer", url: "https://huggingface.co/docs/trl/sft_trainer" }
    ]
  },

  "sharegpt": {
    title: "ShareGPT",
    summary: "A community dataset of ~90K real ChatGPT conversations scraped from the now-defunct sharegpt.com extension, used to fine-tune Vicuna and many other early open chat models. Its existence quietly fueled the 2023 explosion of GPT-3.5-distilled open assistants, with all the licensing and provenance ambiguity that implies.",
    resources: [
      { label: "Vicuna release (introduces ShareGPT use)", url: "https://lmsys.org/blog/2023-03-30-vicuna/" },
      { label: "ShareGPT v3 on HuggingFace", url: "https://huggingface.co/datasets/anon8231489123/ShareGPT_Vicuna_unfiltered" }
    ]
  },

  "simpo": {
    title: "SimPO - Simple Preference Optimization",
    summary: "Meng et al., May 2024. Reference-free DPO variant: the reward is the average log-probability of the sequence (length-normalized), plus a target margin. Half the memory of DPO because the frozen reference policy is gone, and reported gains on AlpacaEval / Arena-Hard on Llama-3-Instruct bases.",
    resources: [
      { label: "Meng et al., 2024 - SimPO", url: "https://arxiv.org/abs/2405.14734" }
    ]
  },

  "sparse-autoencoder": {
    title: "Sparse autoencoder (SAE)",
    summary: "A wide, mostly-inactive linear expansion of a residual-stream activation trained so that only a handful of latents fire per token. Because dictionary-learning encourages monosemantic features, the latents that do fire tend to be human-readable concepts. SAEs at millions of features are now the standard scaffold for interpreting frontier models (Anthropic Scaling Monosemanticity, OpenAI SAE scaling).",
    resources: [
      { label: "Templeton et al., Scaling Monosemanticity (May 2024)", url: "https://transformer-circuits.pub/2024/scaling-monosemanticity/" },
      { label: "Gao et al., Scaling and evaluating sparse autoencoders (Jun 2024)", url: "https://cdn.openai.com/papers/sparse-autoencoders.pdf" }
    ]
  },

  "speculative-decoding": {
    title: "Speculative decoding",
    summary: "A lossless inference-time speedup: a small draft model proposes the next k tokens, the big target model verifies all k in a single parallel forward pass, and every drafted token that matches what the target would have picked is a token accepted for free. Introduced independently by Leviathan et al. (Google, 2022) and Chen et al. (DeepMind, 2023). Because decode is memory-bandwidth-bound, verifying k+1 positions costs about the same wall-clock as verifying one - the trick is a step-function speedup for the target's own arithmetic. Modern drafters (EAGLE, Medusa, MTP heads) reuse the target's hidden states to raise acceptance rates.",
    resources: [
      { label: "Leviathan et al., 2022 - Fast Inference via Speculative Decoding", url: "https://arxiv.org/abs/2211.17192" },
      { label: "Chen et al., 2023 - Speculative Sampling", url: "https://arxiv.org/abs/2302.01318" },
      { label: "EAGLE (Li et al., 2024)", url: "https://arxiv.org/abs/2401.15077" }
    ]
  },

  "spo": {
    title: "SPO — Self-supervised Prompt Optimization",
    summary: "A prompt-optimization framework that uses pairwise self-play among prompts as the supervision signal: candidates are evaluated by comparing their outputs against each other with an LLM judge, like a tournament, removing the need for any ground-truth labels. Works on tasks where absolute scoring is hard but relative preference is easy.",
    resources: [
      { label: "Xiang et al., 2025 — SPO paper", url: "https://arxiv.org/abs/2502.06855" }
    ]
  },

  "ssm-mamba": {
    title: "State-space models (SSM) / Mamba",
    summary: "A non-attention sequence architecture based on a selective, data-dependent linear recurrence. Cost is linear in sequence length and per-step state is constant, so there is no growing KV cache. Mamba (Gu &amp; Dao, 2023) is the reference implementation; Mamba-2 (2024) unified it with a linear-attention lens. Pure SSMs match small transformers on language and lose ground on retrieval-heavy tasks, so what actually ships in 2025-26 is hybrid attention-SSM stacks (Jamba, Nemotron-H).",
    resources: [
      { label: "Mamba (Gu & Dao, 2023)", url: "https://arxiv.org/abs/2312.00752" },
      { label: "Jamba (AI21, 2024)", url: "https://arxiv.org/abs/2403.19887" },
      { label: "Nemotron-H hybrid (Nvidia, 2025)", url: "https://arxiv.org/abs/2504.03624" }
    ]
  },

  "style-control": {
    title: "Style control (Chatbot Arena)",
    summary: "LMSYS's August 2024 correction to Chatbot Arena's Elo aggregation: fit the Bradley-Terry model with response length and markdown density as covariates, and report rankings after regressing style out. In the debut rankings this pushed Anthropic and Meta models up and OpenAI's smaller models down, without changing which battles happened.",
    resources: [
      { label: "LMSYS blog, Aug 28 2024", url: "https://www.lmsys.org/blog/2024-08-28-style-control/" }
    ]
  },

  "swe-bench": {
    title: "SWE-bench",
    summary: "Jimenez et al. (2023): 2,294 real GitHub issues from 12 popular Python repos, each paired with the human PR that fixed it and its unit tests. The agent must read the repo, edit code, and pass the hidden tests. SWE-bench made <em>can the model fix a real bug</em> a measurable question and reshaped how coding-agent progress is reported.",
    resources: [
      { label: "Jimenez et al., 2023 — SWE-bench paper", url: "https://arxiv.org/abs/2310.06770" },
      { label: "SWE-bench website + leaderboard", url: "https://www.swebench.com/" }
    ]
  },

  "swe-bench-verified": {
    title: "SWE-bench Verified",
    summary: "OpenAI's 2024 human-validated subset of SWE-bench — 500 issues that engineers confirmed are well-specified, have correct unit tests, and are solvable in isolation. It removes the noise from the original benchmark and has become the canonical scoreboard for coding agents (Claude, Devin, OpenHands, SWE-agent).",
    resources: [
      { label: "OpenAI — Introducing SWE-bench Verified", url: "https://openai.com/index/introducing-swe-bench-verified/" },
      { label: "SWE-bench Verified on HuggingFace", url: "https://huggingface.co/datasets/princeton-nlp/SWE-bench_Verified" }
    ]
  },

  "swe-gym": {
    title: "SWE-Gym",
    summary: "Pan et al. (Dec 2024): the first agentic RL environment for training real-world software-engineering agents. Packages 2,438 Python task instances, each with an executable runtime environment, hidden unit tests, and a natural-language task description, so an RL rollout can execute the agent's patch and use the pass/fail as reward. Reported +19 absolute points on SWE-bench Verified when used to train an open agent, and 32.0% at inference with a learned verifier. Kicked off the 2025 wave of agentic RL environments (R2E-Gym, SWE-smith, SWE-rebench, SkyRL-Agent).",
    resources: [
      { label: "Pan et al., 2024 - SWE-Gym", url: "https://arxiv.org/abs/2412.21139" },
      { label: "SWE-Gym GitHub", url: "https://github.com/SWE-Gym/SWE-Gym" }
    ]
  },

  "swiglu": {
    title: "SwiGLU activation",
    summary: "A gated variant of the FFN activation: replace the usual ReLU/GELU between two linear projections with a Swish-gated GLU that multiplies two separate projections. Small but consistent quality win at fixed FLOPs. Introduced by Shazeer (2020), adopted by PaLM and then Llama and every open flagship since. Costs three FFN projection matrices instead of two, which is why frontier reports quote FFN hidden dim as 2/3 of the naive figure to keep the parameter count honest.",
    resources: [
      { label: "Shazeer, 2020 - GLU variants improve Transformer", url: "https://arxiv.org/abs/2002.05202" }
    ]
  },

  "synthetic-pretraining-data": {
    title: "Synthetic pretraining data",
    summary: "Text generated by another language model (typically a strong instruction-tuned one) and mixed into pretraining. Two flavors dominate: distributional rewriting of low-quality crawl into higher-quality prose (Nemotron-CC), and from-scratch generation of curated content (Microsoft's phi line, textbooks-are-all-you-need). The lesson is not that synthetic beats real; it is that a distribution shaped by what a strong teacher would say next is worth more per token than raw crawl.",
    resources: [
      { label: "phi-1 - Textbooks Are All You Need (Gunasekar et al., 2023)", url: "https://arxiv.org/abs/2306.11644" },
      { label: "Nemotron-CC rephrasing (Nvidia, 2024)", url: "https://arxiv.org/abs/2412.02595" }
    ]
  },

  "tau-bench": {
    title: "τ-bench (tau-bench)",
    summary: "A Sierra benchmark (Yao et al., 2024) for tool-using agents in realistic customer-service scenarios — retail returns and airline rebookings — where the agent must follow domain policy, call tools, and converse with a simulated user. τ-bench exposes a long tail of multi-turn reasoning and policy-compliance failures that single-shot benchmarks miss.",
    resources: [
      { label: "Yao et al., 2024 — τ-bench paper", url: "https://arxiv.org/abs/2406.12045" },
      { label: "τ-bench GitHub (Sierra)", url: "https://github.com/sierra-research/tau-bench" }
    ]
  },

  "test-time-compute": {
    title: "Test-time compute",
    summary: "Spending more compute at inference — longer chains of thought, more sampled reasoning paths, self-consistency vote, tree-of-thought search, best-of-N reranking — to trade FLOPs for accuracy without changing weights. Snell et al. (2024) showed that scaling test-time compute can outperform scaling parameters; OpenAI's o-series and DeepSeek-R1 ride this curve.",
    resources: [
      { label: "Snell et al., 2024 — Scaling Test-Time Compute", url: "https://arxiv.org/abs/2408.03314" },
      { label: "OpenAI — Learning to Reason with LLMs (o1)", url: "https://openai.com/index/learning-to-reason-with-llms/" }
    ]
  },

  "thinking-budget": {
    title: "Thinking budget",
    summary: "An API knob that caps how many hidden reasoning tokens a reasoning model may emit before it answers - the product-visible shadow of the fact that inference tokens cost real money. Anthropic exposes it as an integer <code>budget_tokens</code>, OpenAI as a <code>reasoning.effort</code> level, Google Gemini as a <code>thinking_level</code>. Reasoning tokens are billed at the output-token rate and consume a KV-cache slot for the duration of the response, so the knob is both a latency dial and a cost dial. Frontier reasoning models shipped after o1 (Sept 2024) all expose some version of it.",
    resources: [
      { label: "Anthropic - Extended thinking", url: "https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking" },
      { label: "OpenAI - Reasoning guide", url: "https://platform.openai.com/docs/guides/reasoning" },
      { label: "Gemini API - Thinking", url: "https://ai.google.dev/gemini-api/docs/thinking" }
    ]
  },

  "token-level-loss": {
    title: "Token-level policy-gradient loss",
    summary: "Aggregate the per-token PPO surrogate across ALL tokens in the batch and normalize once, rather than averaging per response. Under GRPO's original per-response average, a length-|o| response contributes gradient proportional to 1/|o|, so a long-wrong rollout gets a smaller total push than a short-wrong one - one of the length biases Dr. GRPO identified. Token-level aggregation lets each token's gradient count equally, so long responses contribute in proportion to their length. Adopted by DAPO, ScaleRL, and most 2025-26 RL recipes.",
    resources: [
      { label: "DAPO paper", url: "https://arxiv.org/abs/2503.14476" },
      { label: "Dr. GRPO paper", url: "https://arxiv.org/abs/2503.20783" }
    ]
  },

  "tokenizer": {
    title: "Tokenizer",
    summary: "The first and last stage of every LLM: the function that turns a raw string into a sequence of integer token ids on the way in, and the inverse map on the way out. Modern LLMs use subword tokenizers (BPE, WordPiece, Unigram, or byte-level variants) trained on a corpus so common substrings become single tokens and rare ones split. The tokenizer's vocabulary size (32k for Llama 1, 100k+ for Llama 3 and GPT-4o, 200k+ for Gemma 3) is a load-bearing hyperparameter: bigger vocab means fewer tokens per document and cheaper long-context, but a larger embedding table.",
    resources: [
      { label: "Hugging Face - Tokenizers course", url: "https://huggingface.co/learn/nlp-course/en/chapter6/1" },
      { label: "SentencePiece (Kudo & Richardson, 2018)", url: "https://arxiv.org/abs/1808.06226" },
      { label: "Karpathy - Let's build the GPT tokenizer (video)", url: "https://www.youtube.com/watch?v=zduSFxRajkE" }
    ]
  },

  "toolformer": {
    title: "Toolformer",
    summary: "Schick et al. (2023): a self-supervised method that teaches an LM to decide <em>when</em> and <em>how</em> to call external APIs (calculator, search, translator, Q&A, calendar) by sampling possible API calls, checking which ones reduce loss on the subsequent text, and fine-tuning on the helpful ones. It was a foundational proof-of-concept for tool-using LLMs.",
    resources: [
      { label: "Schick et al., 2023 — Toolformer paper", url: "https://arxiv.org/abs/2302.04761" }
    ]
  },

  "transfer-learning": {
    title: "Transfer learning",
    summary: "Take a model trained on a large source task, reuse its learned representations for a different downstream task — typically by fine-tuning. In NLP it went from word2vec embeddings to ULMFiT to BERT to <em>just prompt the foundation model</em>. The history of modern deep learning is largely the history of transfer learning getting more and more powerful.",
    resources: [
      { label: "Howard & Ruder, 2018 — ULMFiT", url: "https://arxiv.org/abs/1801.06146" },
      { label: "Wikipedia — Transfer learning", url: "https://en.wikipedia.org/wiki/Transfer_learning" }
    ]
  },

  "tulu3": {
    title: "Tulu 3",
    summary: "Ai2's open post-training recipe (Lambert et al., Nov 2024). Four stages: data curation, SFT, DPO, then a final RL stage the paper introduces as a novel method they call Reinforcement Learning with Verifiable Rewards (RLVR) - the moment the term RLVR entered the literature. At release, Tulu 3's fine-tunes matched or exceeded Claude 3.5 Haiku and GPT-4o-mini at their scale, and the SFT -> DPO -> RLVR pipeline is what most 2025 open post-training work starts from.",
    resources: [
      { label: "Lambert et al., 2024 - Tulu 3", url: "https://arxiv.org/abs/2411.15124" },
      { label: "Ai2 Tulu 3 blog", url: "https://allenai.org/blog/tulu-3-technical" }
    ]
  },

  "vapo": {
    title: "VAPO",
    summary: "Value-Augmented Proximal Policy Optimization (Ren et al., ByteDance Seed, April 2025). Argues that GRPO / Dr. GRPO / DAPO dropped the critic too quickly, and that a value model can carry frontier-scale RL if you address three specific pathologies: value-model bias (fix with value pretraining), heterogeneous response lengths (fix with clip-higher plus token-level loss, borrowed from DAPO), and reward sparsity across long CoT (fix with length-adaptive GAE). Reports 60.4 on AIME 2024 with a Qwen 32B base, ~10 points above the reported R1-Zero-Qwen-32B and DAPO under matched conditions, with no training crashes across seeds.",
    resources: [
      { label: "VAPO paper", url: "https://arxiv.org/abs/2504.05118" }
    ]
  },

  "verifier": {
    title: "Verifier (RLVR reward function)",
    summary: "A deterministic program that scores a model response without human labels: a math-equality check, a unit-test runner, a sandbox exit code, a regex over an output format. RLVR runs GRPO-style RL against a verifier instead of a learned reward model, so the reward is cheap, exact, and bounded 0-1 by construction. The catch is Ch 7's whole point: every verifier is a proxy, and the policy will find the gap between what it measures and what you meant.",
    resources: [
      { label: "Tulu 3 (coined RLVR)", url: "https://arxiv.org/abs/2411.15124" },
      { label: "DeepSeekMath (verifier + GRPO)", url: "https://arxiv.org/abs/2402.03300" },
      { label: "OpenAI - Chain-of-thought monitoring", url: "https://openai.com/index/chain-of-thought-monitoring/" }
    ]
  },

  "verl": {
    title: "verl (HybridFlow)",
    summary: "ByteDance / HKU's RL framework (Sheng et al., Sep 2024). Combines a single-controller top-level scheduler with multi-controller inner distributed operators, and packages a 3D-HybridEngine that reshards the actor between training and generation phases with zero redundant copies. Reports 1.5-20x throughput vs prior state-of-the-art baselines and is the most mature stack for training large models at frontier scale in 2026.",
    resources: [
      { label: "HybridFlow / verl (Sheng et al., 2024)", url: "https://arxiv.org/abs/2409.19256" },
      { label: "verl GitHub", url: "https://github.com/volcengine/verl" }
    ]
  },

  "vicuna": {
    title: "Vicuna",
    summary: "An LMSYS project (March 2023) that fine-tuned LLaMA-13B on 70K ShareGPT conversations and reported ~90% GPT-4-judged quality vs. ChatGPT for ~$300 of compute. Vicuna kicked off the LLM-as-judge era (its eval framework became MT-Bench / Chatbot Arena) and was the most influential open chat model of mid-2023.",
    resources: [
      { label: "Vicuna release announcement", url: "https://lmsys.org/blog/2023-03-30-vicuna/" },
      { label: "Chiang et al., 2024 — Chatbot Arena paper", url: "https://arxiv.org/abs/2403.04132" }
    ]
  },

  "vit-patches": {
    title: "ViT patches",
    summary: "Vision Transformer (Dosovitskiy et al., 2020): split an image into a grid of fixed-size patches (e.g. 16x16), flatten each patch into a vector, project to the embedding dim, add positional encoding — and feed the resulting sequence into a standard transformer. ViT collapsed the boundary between vision and language architectures and underpins CLIP, multimodal LLMs, and modern vision foundation models.",
    resources: [
      { label: "Dosovitskiy et al., 2020 — ViT paper", url: "https://arxiv.org/abs/2010.11929" }
    ]
  },

  "voyager": {
    title: "Voyager",
    summary: "Wang et al. (2023): an LLM-powered open-ended Minecraft agent that uses GPT-4 to write executable JavaScript skills, stores them in a growing skill library, and proposes its own curriculum of harder tasks. Voyager was a foundational demo of <em>lifelong</em> LLM agents — accumulating reusable capabilities rather than starting each episode fresh.",
    resources: [
      { label: "Wang et al., 2023 — Voyager paper", url: "https://arxiv.org/abs/2305.16291" },
      { label: "Voyager project page", url: "https://voyager.minedojo.org/" }
    ]
  },

  "webarena": {
    title: "WebArena",
    summary: "Zhou et al. (2023): a self-hosted, reproducible web-browsing benchmark for autonomous agents — real instances of e-commerce, GitLab, Reddit-like, and CMS sites, with execution-based tasks (book this flight, file this issue). WebArena is the standard hard eval for browser-driving LLM agents; success rates were single-digit at launch and have climbed steadily since.",
    resources: [
      { label: "Zhou et al., 2023 — WebArena paper", url: "https://arxiv.org/abs/2307.13854" },
      { label: "WebArena project page", url: "https://webarena.dev/" }
    ]
  },

  "webshop": {
    title: "WebShop",
    summary: "Yao et al. (2022): a simulated e-commerce site with 1.18M real Amazon products where an agent must navigate, search, and buy items matching natural-language instructions. WebShop was one of the earliest realistic web-agent benchmarks and a standard testbed for ReAct-style methods before WebArena raised the bar.",
    resources: [
      { label: "Yao et al., 2022 — WebShop paper", url: "https://arxiv.org/abs/2207.01206" },
      { label: "WebShop project page", url: "https://webshop-pnlp.github.io/" }
    ]
  },

  "yarn": {
    title: "YaRN (long-context extension)",
    summary: "A RoPE-scaling recipe from Peng et al. (2023) for extending a model's context window past its pretraining length. Two moves: interpolate RoPE frequencies per band (leave high-frequency dims alone, stretch low-frequency ones) instead of uniformly, and add an attention-temperature term to keep the softmax well-scaled. The default recipe for 128k-token fine-tunes; DeepSeek-V3 uses it, and it works with under 0.1% of the original pretraining data.",
    resources: [
      { label: "Peng et al., 2023 - YaRN", url: "https://arxiv.org/abs/2309.00071" },
      { label: "Position Interpolation - the predecessor (Chen et al., 2023)", url: "https://arxiv.org/abs/2306.15595" }
    ]
  },

  "zero-shot-transfer": {
    title: "Zero-shot transfer",
    summary: "Applying a pretrained model to a task it was never explicitly trained for, without any examples — just an instruction or a label space. CLIP's zero-shot ImageNet classification (a vision model classifying images via natural-language class names) was the landmark demo, but every modern LLM exhibits zero-shot transfer at scale.",
    resources: [
      { label: "Radford et al., 2021 — CLIP (zero-shot ImageNet)", url: "https://arxiv.org/abs/2103.00020" },
      { label: "Brown et al., 2020 — GPT-3 (zero-shot NLP)", url: "https://arxiv.org/abs/2005.14165" }
    ]
  }

};
