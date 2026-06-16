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

  "autogpt": {
    title: "Auto-GPT",
    summary: "A March 2023 open-source experiment that wrapped GPT-4 in a self-prompting loop: given a high-level goal, it generates subtasks, executes them via tool calls (web browse, file I/O, shell), critiques its own progress, and continues until the goal is met. It went viral as a proof-of-concept of autonomous agents, but was famously unreliable — it shipped the dream of agents before the substrate was ready.",
    resources: [
      { label: "Auto-GPT GitHub (Significant-Gravitas)", url: "https://github.com/Significant-Gravitas/AutoGPT" },
      { label: "Wikipedia — Auto-GPT", url: "https://en.wikipedia.org/wiki/Auto-GPT" }
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

  "chain-of-thought": {
    title: "Chain-of-thought prompting (CoT)",
    summary: "Prompting a large model to produce intermediate reasoning steps before its final answer — often by adding a cue like <em>let's think step by step</em>. The extra tokens give the model room to compute, so accuracy on multi-step problems jumps without any weight change. It was the first widely cited proof that <em>how</em> you phrase a prompt is worth measurable accuracy.",
    resources: [
      { label: "Wei et al., 2022 — Chain-of-Thought Prompting", url: "https://arxiv.org/abs/2201.11903" },
      { label: "Kojima et al., 2022 — Zero-shot CoT", url: "https://arxiv.org/abs/2205.11916" }
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

  "decoder-only": {
    title: "Decoder-only transformer",
    summary: "A transformer that uses only the autoregressive decoder stack: each token attends to itself and to earlier tokens via a causal mask, and the model is trained to predict the next token. GPT, LLaMA, Claude, and Gemini are all decoder-only. The architecture won the LLM era because next-token prediction at scale turned out to be a universal training signal.",
    resources: [
      { label: "Vaswani et al., 2017 — Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762" },
      { label: "Radford et al., 2018 — GPT", url: "https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf" },
      { label: "Wikipedia — GPT (language model)", url: "https://en.wikipedia.org/wiki/Generative_pre-trained_transformer" }
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

  "frozen-model": {
    title: "Frozen model",
    summary: "A model whose weights are not updated — used as a fixed function, with all adaptation happening outside the weights (via prompts, adapters, retrieved context, or downstream layers). In-context learning, retrieval-augmented generation, and prompt optimization all treat the LLM as frozen.",
    resources: [
      { label: "GPT-3 paper (the iconic frozen-model demo)", url: "https://arxiv.org/abs/2005.14165" },
      { label: "Lester et al., 2021 — Prompt Tuning (frozen backbone)", url: "https://arxiv.org/abs/2104.08691" }
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

  "helpful-honest-harmless": {
    title: "Helpful, Honest, Harmless (HHH)",
    summary: "Anthropic's three-axis target for assistant behavior, introduced in Askell et al. (2021) as a working definition of <em>aligned</em>: the model should help the user, be truthful about what it knows and does not know, and avoid harm. HHH became the de facto value-alignment framing for RLHF-tuned chat models.",
    resources: [
      { label: "Askell et al., 2021 — A General Language Assistant as a Laboratory for Alignment", url: "https://arxiv.org/abs/2112.00861" },
      { label: "Anthropic — Core views on AI safety", url: "https://www.anthropic.com/news/core-views-on-ai-safety" }
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

  "miprov2": {
    title: "MIPROv2",
    summary: "A DSPy optimizer (Opsahl-Ong et al., 2024) that jointly tunes instructions and few-shot demos using a Bayesian search over candidates, with bootstrapped demos drawn from the training set and instructions proposed by an LLM. It was the strongest DSPy optimizer until GEPA, and remains the standard joint instruction-and-demo baseline.",
    resources: [
      { label: "Opsahl-Ong et al., 2024 — MIPROv2 paper", url: "https://arxiv.org/abs/2406.11695" },
      { label: "MIPROv2 in DSPy docs", url: "https://dspy.ai/api/optimizers/MIPROv2/" }
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
    summary: "An architecture where each token is routed by a learned gate to a small subset (top-k) of many parallel feed-forward <em>experts</em> — so the model has huge total parameters but only activates a fraction per token. Sparsely-gated MoE (Shazeer et al., 2017) is the modern recipe; Mixtral, DeepSeek-V3, and GPT-4 (reportedly) are MoE.",
    resources: [
      { label: "Shazeer et al., 2017 — Sparsely-Gated MoE", url: "https://arxiv.org/abs/1701.06538" },
      { label: "Mixtral 8x7B paper (Jiang et al., 2024)", url: "https://arxiv.org/abs/2401.04088" },
      { label: "DeepSeek-V3 paper", url: "https://arxiv.org/abs/2412.19437" }
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

  "open-weights": {
    title: "Open-weights model",
    summary: "A model whose trained parameters are publicly downloadable, even if the training data, code, or full recipe is not. LLaMA, Mistral, Mixtral, Qwen, and DeepSeek are open-weights; GPT-4 and Claude are closed-weights. The distinction matters because open weights enable fine-tuning, distillation, mechanistic interpretability, and local deployment.",
    resources: [
      { label: "Meta — Llama 3 announcement", url: "https://ai.meta.com/blog/meta-llama-3/" },
      { label: "DeepSeek-R1 paper", url: "https://arxiv.org/abs/2501.12948" }
    ]
  },

  "opro": {
    title: "OPRO — Optimization by PROmpting",
    summary: "A 2023 DeepMind method (Yang et al.) that uses an LLM itself as the optimizer: at each step it sees a history of past prompts and their scores, and proposes a new prompt aimed at higher score. OPRO showed that an LLM can do non-trivial black-box optimization purely through prompting — discovered prompts that beat <em>let's think step by step</em> on GSM8K.",
    resources: [
      { label: "Yang et al., 2023 — OPRO paper", url: "https://arxiv.org/abs/2309.03409" }
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

  "pareto-frontier": {
    title: "Pareto frontier",
    summary: "The set of candidates that are not dominated by any other candidate on every objective at once — improving on one metric requires sacrificing another. In GEPA, keeping a Pareto front of prompts (rather than only the single best) prevents the search from collapsing onto one fragile winner that happens to top the aggregate score.",
    resources: [
      { label: "Wikipedia — Pareto efficiency", url: "https://en.wikipedia.org/wiki/Pareto_efficiency" },
      { label: "Wikipedia — Multi-objective optimization", url: "https://en.wikipedia.org/wiki/Multi-objective_optimization" }
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

  "react-loop": {
    title: "ReAct loop",
    summary: "Yao et al. (2022): interleave <em>reasoning</em> (thoughts written in natural language) with <em>acting</em> (tool calls or environment actions) in a single LLM trace. ReAct was the first widely cited recipe for grounded LLM agents and remains the conceptual backbone of every modern agent loop, from AutoGPT to Claude Code.",
    resources: [
      { label: "Yao et al., 2022 — ReAct paper", url: "https://arxiv.org/abs/2210.03629" }
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

  "rlhf": {
    title: "RLHF — Reinforcement Learning from Human Feedback",
    summary: "The three-stage post-training recipe: (1) supervised fine-tuning on demonstrations, (2) train a reward model on pairwise human preferences, (3) optimize the SFT policy against the RM with PPO + KL constraint. InstructGPT and ChatGPT made this the standard alignment pipeline; DPO and GRPO are simplifications of the same idea.",
    resources: [
      { label: "Christiano et al., 2017 — Deep RL from Human Preferences", url: "https://arxiv.org/abs/1706.03741" },
      { label: "Ouyang et al., 2022 — InstructGPT", url: "https://arxiv.org/abs/2203.02155" }
    ]
  },

  "rlvr": {
    title: "RLVR — Reinforcement Learning from Verifiable Rewards",
    summary: "Use a programmatic verifier (a unit test, an equation checker, an integer-answer comparator) as the reward function — no learned reward model needed. Verifiable rewards cannot be hacked the way RMs can, so they enable much longer, more aggressive RL training. RLVR + GRPO is what produced DeepSeek-R1's reasoning traces.",
    resources: [
      { label: "Lambert et al., 2024 — Tulu 3 (introduces the RLVR framing)", url: "https://arxiv.org/abs/2411.15124" },
      { label: "DeepSeek-R1 paper", url: "https://arxiv.org/abs/2501.12948" }
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

  "spo": {
    title: "SPO — Self-supervised Prompt Optimization",
    summary: "A prompt-optimization framework that uses pairwise self-play among prompts as the supervision signal: candidates are evaluated by comparing their outputs against each other with an LLM judge, like a tournament, removing the need for any ground-truth labels. Works on tasks where absolute scoring is hard but relative preference is easy.",
    resources: [
      { label: "Xiang et al., 2025 — SPO paper", url: "https://arxiv.org/abs/2502.06855" }
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

  "swe-bench": {
    title: "SWE-bench",
    summary: "Jimenez et al. (2023): 2,294 real GitHub issues from 12 popular Python repos, each paired with the human PR that fixed it and its unit tests. The agent must read the repo, edit code, and pass the hidden tests. SWE-bench made <em>can the model fix a real bug</em> a measurable question and reshaped how coding-agent progress is reported.",
    resources: [
      { label: "Jimenez et al., 2023 — SWE-bench paper", url: "https://arxiv.org/abs/2310.06770" },
      { label: "SWE-bench website + leaderboard", url: "https://www.swebench.com/" }
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

  "zero-shot-transfer": {
    title: "Zero-shot transfer",
    summary: "Applying a pretrained model to a task it was never explicitly trained for, without any examples — just an instruction or a label space. CLIP's zero-shot ImageNet classification (a vision model classifying images via natural-language class names) was the landmark demo, but every modern LLM exhibits zero-shot transfer at scale.",
    resources: [
      { label: "Radford et al., 2021 — CLIP (zero-shot ImageNet)", url: "https://arxiv.org/abs/2103.00020" },
      { label: "Brown et al., 2020 — GPT-3 (zero-shot NLP)", url: "https://arxiv.org/abs/2005.14165" }
    ]
  }

};
