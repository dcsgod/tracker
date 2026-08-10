# CP & ML Mastery Tracker — Project Spec

## 0. What this is

A single-user, self-hosted **progress-tracking web app** — a "todo/checklist" system for a long-term self-study plan — deployed as a static site on **GitHub Pages**, with progress that **persists** (survives closing the tab / switching devices), built by Claude Code from this spec.

It tracks three independent tracks in one dashboard:

1. **Roadmap Tracks** — checklist progress through 8 existing curriculum roadmap sites (already live at `dcsgod.github.io/<path>`), 4 to be finished in full and 4 to be finished partially.
2. **CP / DSA Track** — a problem tracker from basic through **Codeforces rating 2100**, organized by topic and difficulty.
3. **Daily Tracker** — a calendar/grid habit tracker (Gym, Running, Diet, Water, DSA, ML, Mtech Classes) from **Aug 11 – Dec 31, 2026**, replacing the LaTeX/PDF tracker the owner was previously printing.

The owner (Ravi) works in data analytics/AI engineering and wants this as a living app he checks daily, not a static PDF he has to re-print weekly.

---

## 1. Source roadmaps (what "full" vs "partial" coverage means)

These are Ravi's own existing GitHub Pages sites (`github.com/dcsgod`). The app does **not** need to re-host their content — it links out to each — but it needs a **topic checklist** modeled on each site's structure so progress can be tracked topic-by-topic. Content below was scraped directly from the live sites and should seed `/data/roadmaps/*.json`.

### Cover in FULL

| Path | URL | Structure |
|---|---|---|
| **ML/DL Mastery** | https://dcsgod.github.io/mlpath/ | 7 phases, 200+ algorithms, 18–36 months nominal. Phases: (1) Math Foundations — linear algebra, calculus, probability, information theory, optimization; (2) Statistics & Probabilistic Modeling — frequentist, Bayesian, GLMs, MCMC, PGMs, GPs, causal inference, time series; (3) Classical ML — linear/nonlinear models, ensembles, clustering, dimensionality reduction, learning theory, optimization, anomaly detection, feature engineering, kernels; (4) Deep Learning & Neural Architectures — NN fundamentals, CNNs, RNNs, Transformers, generative models, large-scale training, regularization, GNNs, self-supervised learning; (5) Computer Vision — classical CV, detection, segmentation, 3D vision, generative vision, multimodal, video, ViTs; (6) Advanced ML & Systems — RL, meta-learning, interpretability, adversarial robustness, ML systems/infra, Bayesian DL, continual learning, fairness; (7) Research Frontier — LLM architecture, RLHF/alignment, mechanistic interpretability, scaling laws, reasoning/agents, multimodal frontier, research process, theory. Includes an "Anthropic hiring bar" checklist and canon paper list (~45 papers). |
| **NLP → Reasoning Model Mastery** | https://dcsgod.github.io/Nlppath/ | 10 phases, 300+ topics, 307 resources. Phases: Math Foundations → NLP Fundamentals (tokenization, POS, NER, parsing) → Classical NLP (n-grams, HMM, CRF, TF-IDF, LDA) → Word Embeddings (Word2Vec, GloVe, FastText, ELMo) → Neural NLP & Seq2Seq (LSTM/GRU/attention) → Transformers & LLM Architecture (BERT, GPT, T5, MoE, Mamba, FlashAttn, RoPE) → LLMs & Pre-training (scaling laws, Chinchilla, LLaMA, ZeRO, Megatron) → Fine-tuning & Alignment (LoRA, QLoRA, RLHF, DPO, CAI, ORPO) → RL for LLMs (PPO, GRPO, TRPO, GAE, reward hacking) → Reasoning & Inference (CoT, ToT, PRM, RAG, DeepSeek-R1, o1). |
| **LLM Building, Reasoning Models & Fine-Tuning** | https://dcsgod.github.io/llmreasoning/ | 12 phases, 150+ resources, 36 build milestones. Categories: Foundations, LLM building, Fine-tuning, Alignment, Reasoning. Site is a JS-rendered SPA — phase-level topic detail should be pulled by opening the site directly (Claude Code / the app should treat this as "12 phases, 0/12 complete" tracked at phase granularity unless the owner supplies the phase-by-phase breakdown, since the static HTML shell does not expose per-topic text). |
| **Time Series, Forecasting & Causal Inference** | https://dcsgod.github.io/timeseriespath/ | 9 sections, 200+ topics, foundation → PhD levels. Sections: (1) Foundations of TS (28 topics: stationarity, ACF/PACF, decomposition, smoothing); (2) Volatility Modeling (ARCH/GARCH family, cointegration, VAR/SVAR); (3) State Space & Bayesian Methods (Kalman filter/smoother, particle filters, BVAR, TVP-VAR, regime-switching); (4) Modern Forecasting (Prophet, probabilistic forecasting, hierarchical reconciliation, M4/M5 competition methods, nowcasting); (5) ML for Time Series (feature engineering, tree methods, deep architectures — LSTM/TCN/Transformers/N-BEATS/DeepAR/TFT/Mamba/foundation models, generative DL for TS, anomaly/change-point detection, TS classification); (6) Causal Inference (potential outcomes, DAGs/SCMs, DiD/RDD/IV/synthetic control, CATE/causal forests, causal TS); (7) Double/Debiased ML & Semiparametrics (Neyman orthogonality, DML variants, TMLE); (8) Panel Data & Spatial TS (fixed/random effects, dynamic panel GMM, spatial econometrics, GNNs for TS); (9) Frontier Research (LLMs as TS reasoners — Chronos/TimesFM/MOIRAI, online/adaptive learning, RL for sequential decisions, domain applications — finance/retail/energy/macro/epi/climate, software tooling). |

### Cover PARTIALLY (track high-value phases only — owner selects which on first run)

| Path | URL | Structure |
|---|---|---|
| **Quant Researcher & Algo Designer** | https://dcsgod.github.io/quantpath/ | 13 phases, 300+ resources: Math Foundations, Probability Theory, Stochastic Calculus, Programming & DSA, Competitive Programming, Statistics & Econometrics, ML for Quant, Market Microstructure, Portfolio & Risk, Strategy Design, Trading Infrastructure, Execution Algorithms, Interview Prep. |
| **GNN Path** | https://dcsgod.github.io/Gnnpath/ | Not machine-readable at fetch time (dynamic content). Seed as a phase-level stub using the GNN section already detailed inside `mlpath` (message passing, GCN, GraphSAGE, GAT, GIN, ChebNet, DiffPool, Graph Transformer, heterogeneous graphs) and refine by visiting the live site once. |
| **RL Path** | https://dcsgod.github.io/rlpath/ | Not machine-readable at fetch time. Seed as a phase-level stub using the RL section already detailed inside `mlpath` (MDPs, Bellman, DP, TD/Q-learning, DQN family, policy gradient, actor-critic, PPO/TRPO/SAC/TD3, model-based RL, AlphaZero/MuZero) and refine by visiting the live site once. |
| **Diffusion Models** | https://dcsgod.github.io/diffusionmodelspath/ | 7 phases, 40+ topics, 70+ key papers, 10–14 months nominal: (1) Prerequisites (probability, VAEs, SDEs, EBMs); (2) Score Matching & Denoising Score Matching (Hyvärinen SM, DSM, NCSN, Langevin dynamics); (3) DDPM/DDIM & Diffusion Framework (forward/reverse process, ε-prediction, DDIM sampling, SDE unification, classifier guidance); (4) Latent Diffusion & Text-to-Image (LDM/Stable Diffusion, DALL-E 2, Imagen, DreamBooth/LoRA/textual inversion, ControlNet, Diffusers library); (5) Architectures (U-Net, DiT, FLUX, consistency models/LCM); (6) Applications (video, audio, 3D/molecular, editing/inpainting, scientific imaging, evaluation metrics); (7) Frontier (flow matching, rectified flow, stochastic interpolants, diffusion as world models, inverse problems). Owner tracks phases 1–3 as priority, 4–7 as stretch.

For the two paths whose live topic lists weren't fetchable (`Gnnpath`, `rlpath`), ship the stub seed data described above but add a **"Refresh from source"** admin note in the README telling the owner to re-open those two URLs, copy the phase/topic list, and paste into the matching JSON file — don't block the rest of the build on this.
Make sure it give me 2-3 papers to reproduce every week from my learning path 

---

## 2. CP / DSA track (basic → Codeforces 2100)

Don't hand-curate thousands of problems. Instead:

- Define a fixed **topic list** (below) as the checklist backbone.
- For actual problems, call the **Codeforces API** (`https://codeforces.com/api/problemset.problems`, no auth needed) client-side, filter by `tags` and `rating`, and let the user pick/star problems into their own tracked list. Cache the API response in `localStorage` (it's a few MB, refresh weekly).
- Rating bands to progress through: `800–1000` (basic) → `1100–1300` → `1400–1600` → `1700–1900` → `2000–2100` (target ceiling).
https://dcsgod.github.io/Cppath/
Topic checklist (seed `/data/cp-topics.json`):

```
Arrays & Prefix Sums · Two Pointers & Sliding Window · Sorting & Searching (incl. Binary Search on Answer)
Strings & Hashing · Recursion & Backtracking · Basic Math & Number Theory (GCD, sieve, modular arithmetic)
Greedy · Bitmasking · Stacks/Queues/Deques · Linked Lists
Trees (DFS/BFS, LCA, Euler tour) · Binary Search Trees & Balanced BSTs · Heaps / Priority Queues
Graphs — traversal (DFS/BFS, connected components) · Graphs — shortest paths (Dijkstra, Bellman-Ford, Floyd-Warshall)
Graphs — MST (Kruskal, Prim) · Graphs — advanced (topological sort, SCC/Tarjan, bridges/articulation points)
Union-Find / DSU · Dynamic Programming — 1D/2D · Dynamic Programming — on trees & graphs
Dynamic Programming — bitmask & digit DP · Combinatorics & Probability · Segment Trees & Fenwick (BIT)
Sparse Tables & RMQ · Trie · String Algorithms (KMP, Z-function, Manacher, suffix arrays)
Number Theory — advanced (CRT, Euler's totient, modular inverse) · Game Theory (Nim, Sprague-Grundy)
Geometry basics · Two-pointer/sliding-window on graphs (advanced) · Divide & Conquer
```

---

## 3. Daily Tracker (replaces the LaTeX PDF)

Source: the attached LaTeX document generated one row per calendar day from **Aug 11 → Dec 31, 2026** with checkbox columns: `Gym, Running, Diet, Water, DSA, ML`, plus `Mtech Classes` (checkbox shown **only on weekends**, matching the original `\ifnum\pgfcalendarcurrentweekday>4` weekend test).

Port this 1:1 into the app as an interactive table/grid:

- One row per day, auto-generated for the date range (no manual data entry needed — generate client-side from date math, same as the LaTeX `\pgfcalendar` loop did).
- Columns: Date, Day-of-week, Day-N label, `Gym`, `Running`, `Diet`, `Water`, `DSA`, `ML` (checkboxes, always shown), `Mtech Classes` (checkbox shown only when day-of-week is Sat/Sun).
- Each checkbox persists its checked state per-day per-column.
- Add a simple streak counter per column (e.g., "Water: 12-day streak") — computed, not stored.
- Provide a "print view" (CSS `@media print`, landscape) as a bonus so the owner can still print a week if he wants the old wall-chart habit, but this is optional/secondary to the live tracker.

---

## 4. Core functional requirements

1. **Single dashboard** with tabs/sections: `Roadmaps`, `CP/DSA`, `Daily Tracker`, `Overview` (aggregate progress %).
2. **Checklist items are persistent** — checking a topic off must survive a page reload and a different device/browser.
3. **No backend server required** — must be deployable as a plain static site on GitHub Pages (no Node server, no database).
4. **Progress persistence strategy** (in order of implementation priority):
   - **Tier 1 (must-have): `localStorage`.** Every check/uncheck writes immediately to `localStorage` under a versioned key (e.g. `cpml-tracker:v1`). Works offline, zero setup, but is per-browser only.
   - **Tier 2 (should-have): GitHub Gist sync.** Add a "Connect GitHub" button that takes a **fine-grained Personal Access Token** (stored only in `localStorage`, never sent anywhere but the GitHub API) with `gist` scope. On check/uncheck (debounced ~3s), PATCH a single private Gist (`progress.json`) via `https://api.github.com/gists/{id}` using `fetch`. On load, GET the Gist and merge (last-write-wins by timestamp) with local state. This gives cross-device sync while staying 100% static-hostable, and keeps "progress stored on GitHub" literally true.
   - Export/Import buttons (`Download progress.json` / `Upload progress.json`) as a manual fallback regardless of Tier 2.
5. **Progress math**: per-roadmap % = checked topics / total topics; per-CP-topic % = problems solved (marked done) / problems added to that topic's list; overall % = weighted rollup shown on the `Overview` tab.
6. **Deep links out**: every roadmap topic checklist item links to its source URL (the specific `dcsgod.github.io/<path>#anchor` where possible, else the path root).
7. **Responsive** — usable on mobile (the owner will likely check boxes from his phone).

---

## 5. Tech stack recommendation

Keep it boring and static:

- **Plain HTML + vanilla JS + CSS**, or **React (Vite) built to static output** — either is fine; Vite/React preferred if Claude Code will maintain/extend it later, since component reuse helps for 4 near-identical roadmap-tab layouts.
- No backend framework, no database. All "backend" behavior (persistence, sync) is client-side + GitHub Gist API + Codeforces public API.
- Deploy via **GitHub Pages** from `/docs` or a `gh-pages` branch, using a GitHub Actions workflow (`actions/deploy-pages`) triggered on push to `main`.

### Suggested file/folder structure

```
/project-root
  ├─ README.md                  # setup + how the Gist sync PAT works
  ├─ index.html
  ├─ src/
  │   ├─ main.(js|jsx)
  │   ├─ components/
  │   │   ├─ RoadmapTab.(js|jsx)
  │   │   ├─ CPTab.(js|jsx)
  │   │   ├─ DailyTrackerTab.(js|jsx)
  │   │   └─ OverviewTab.(js|jsx)
  │   ├─ lib/
  │   │   ├─ storage.js          # localStorage read/write, schema versioning
  │   │   ├─ githubSync.js       # Gist GET/PATCH, PAT handling
  │   │   └─ codeforces.js       # CF API fetch + cache + filter helpers
  │   └─ styles/
  ├─ data/
  │   ├─ roadmaps/
  │   │   ├─ mlpath.json
  │   │   ├─ nlppath.json
  │   │   ├─ llmreasoning.json
  │   │   ├─ timeseriespath.json
  │   │   ├─ quantpath.json
  │   │   ├─ gnnpath.json        # stub — refine from live site
  │   │   ├─ rlpath.json         # stub — refine from live site
  │   │   └─ diffusionmodelspath.json
  │   └─ cp-topics.json
  └─ .github/workflows/deploy.yml
```

### Data schema

```jsonc
// data/roadmaps/<path>.json
{
  "id": "mlpath",
  "title": "ML/DL Mastery Roadmap",
  "sourceUrl": "https://dcsgod.github.io/mlpath/",
  "coverage": "full",              // "full" | "partial"
  "phases": [
    {
      "id": "phase-01",
      "title": "Mathematical Foundations",
      "topics": [
        { "id": "linear-algebra", "title": "Linear Algebra — Vector Spaces & Matrices" },
        { "id": "multivariate-calculus", "title": "Multivariate Calculus — Optimization Foundations" }
        // ...
      ]
    }
  ]
}
```

```jsonc
// localStorage: cpml-tracker:v1
{
  "roadmaps": { "mlpath": { "linear-algebra": true, "...": false } },
  "cp": {
    "topics": { "arrays-prefix-sums": { "problems": [{ "cfId": "1352A", "rating": 800, "done": true }] } }
  },
  "daily": { "2026-08-11": { "gym": true, "running": false, "diet": true, "water": true, "dsa": true, "ml": false } },
  "updatedAt": "2026-08-11T12:00:00Z"
}
```

---

## 6. Build steps for Claude Code

1. Scaffold the project (Vite + vanilla JS or React, static build).
2. Build `lib/storage.js` first — get localStorage read/write + schema versioning solid before any UI.
3. Populate `/data/roadmaps/*.json` from Section 1 above (phase + topic titles only — no need to scrape resource links, just enough structure for checkboxes). Mark `gnnpath.json` and `rlpath.json` clearly as stubs.
4. Populate `/data/cp-topics.json` from Section 2.
5. Build `RoadmapTab` — renders phases as collapsible sections, topics as checkboxes, per-phase and per-roadmap progress bars, link-out icon per topic.
6. Build `CPTab` — topic list on the left, on selecting a topic fetch Codeforces problems (`lib/codeforces.js`) filtered by tag + rating band selector (800–1000 / 1100–1300 / 1400–1600 / 1700–1900 / 2000–2100), let user "add to my list" and "mark solved".
7. Build `DailyTrackerTab` — generate the Aug 11–Dec 31 2026 date range client-side, render the grid per Section 3, wire checkboxes to storage.
8. Build `OverviewTab` — aggregate progress bars/rollup numbers across all of the above.
9. Build `lib/githubSync.js` (Tier 2 persistence) + a small settings panel for entering/removing the PAT, with a visible warning that the token is stored only in the browser's localStorage.
10. Add Export/Import JSON buttons.
11. Add the GitHub Actions Pages deploy workflow.
12. Write `README.md`: how to fork/clone, how to create a Gist + fine-grained PAT with `gist` scope, how to enable Pages, and a note to refresh `gnnpath.json`/`rlpath.json` from the live sites.

---

## 7. Explicitly out of scope (don't build)

- No user accounts / multi-user auth — this is single-owner.
- No server-side database — Gist + localStorage only.
- Don't hardcode a static list of thousands of CP problems — pull live from Codeforces API.
- Don't attempt to scrape `llmreasoning`, `Gnnpath`, `rlpath` at build time in a headless browser unless Claude Code has that capability handy — ship the stubs and note the manual refresh step instead.
