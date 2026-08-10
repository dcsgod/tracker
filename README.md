# Mastery Tracker 🎯

> **Ravi's personal CP & ML progress dashboard** — deployed at `dcsgod.github.io/tracker`

A comprehensive, self-hosted static web app for tracking:
- **8 ML/AI learning roadmaps** (ML/DL, NLP, LLM Reasoning, Time Series, Quant, GNN, RL, Diffusion)
- **CP/DSA tracker** from Codeforces 800 → 2100 (live problems from the CF API)
- **Daily habit grid** Aug 11 – Dec 31, 2026 (Gym, Running, Diet, Water, DSA, ML, MTech on weekends)
- **Weekly paper recommendations** (2–3 papers from your current learning phase)

All state is **100% client-side** — no backend, no database. Progress is stored in `localStorage` and optionally synced across devices via GitHub Gist.

---

## 🚀 Deploy to GitHub Pages

### 1. Fork / clone this repo

```bash
git clone https://github.com/dcsgod/tracker.git
cd tracker
npm install
```

### 2. Create a new repo named `tracker` on GitHub

Push to `main`:
```bash
git remote set-url origin https://github.com/dcsgod/tracker.git
git push -u origin main
```

### 3. Enable GitHub Pages

In your repo settings → **Pages** → Source: **GitHub Actions** (not a branch).

The `deploy.yml` workflow will automatically build and deploy on every push to `main`.

Your app will be live at: **`https://dcsgod.github.io/tracker/`**

---

## 🔄 Cross-Device Sync (GitHub Gist)

To sync your progress across devices (phone ↔ laptop):

### Step 1: Create a secret Gist

1. Go to **[gist.github.com](https://gist.github.com)**
2. Create a new **secret** gist (any name, e.g. `progress.json` with `{}` as content)
3. Copy the **Gist ID** from the URL: `gist.github.com/dcsgod/`**`THIS_IS_THE_GIST_ID`**

### Step 2: Create a Fine-Grained PAT

1. Go to **[github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new)**
2. Token type: **Fine-grained** or **Classic**
3. Required scope: **`gist`** only
4. Copy the token (`github_pat_…`)

### Step 3: Connect in the App

1. Open the app → click the **⚙️** gear icon
2. Paste your **PAT** and **Gist ID**
3. Click **Connect & Verify**

Your progress will sync automatically (debounced 3s after each change) and load from Gist on page open.

> ⚠️ **Security**: The PAT is stored only in your browser's `localStorage`. It is never sent anywhere other than `api.github.com`.

---

## 📂 Data Files (Stubs to Update)

Two roadmap files were seeded from topic descriptions in the spec but could not be fetched from the live sites because they use JS-rendered SPAs:

| File | Live Site | Action Needed |
|------|-----------|---------------|
| `data/roadmaps/gnnpath.json` | [dcsgod.github.io/Gnnpath/](https://dcsgod.github.io/Gnnpath/) | Visit the site, copy phase/topic names, update the `topics` arrays |
| `data/roadmaps/rlpath.json` | [dcsgod.github.io/rlpath/](https://dcsgod.github.io/rlpath/) | Visit the site, copy phase/topic names, update the `topics` arrays |

The `llmreasoning.json` file is also a stub (same reason). Update the `topics` arrays for each of the 12 phases after visiting [dcsgod.github.io/llmreasoning/](https://dcsgod.github.io/llmreasoning/).

---

## 🛠 Local Development

```bash
npm run dev      # Start Vite dev server at http://localhost:5173/tracker/
npm run build    # Build to /docs for GitHub Pages
npm run preview  # Preview the built output
```

---

## 📤 Export / Import Progress

Progress can be exported as `progress.json` (Settings → Download) and re-imported on any device. This is the manual fallback if Gist sync isn't set up.

---

## 🏗 Architecture

```
src/
├── main.js              # App entry, tab routing, global state
├── styles/main.css      # Dark glassmorphism design system
├── components/
│   ├── OverviewTab.js   # Aggregate stats, progress rings, weekly papers
│   ├── RoadmapTab.js    # 8 roadmap checklists with collapsible phases
│   ├── CPTab.js         # CF API problem browser + my list
│   ├── DailyTrackerTab.js  # Habit grid Aug–Dec 2026
│   └── SettingsPanel.js # Gist sync, PAT, export/import
└── lib/
    ├── storage.js       # localStorage versioned state (schema v1)
    ├── githubSync.js    # GitHub Gist GET/PATCH + debounced push
    └── codeforces.js    # CF API + 7-day cache + tag/rating filter
data/
└── roadmaps/
    ├── mlpath.json          # 7 phases, ML/DL mastery
    ├── nlppath.json         # 10 phases, NLP → Reasoning
    ├── llmreasoning.json    # 12 phases stub
    ├── timeseriespath.json  # 9 sections
    ├── quantpath.json       # 13 phases
    ├── gnnpath.json         # 7 phases stub ⚠
    ├── rlpath.json          # 7 phases stub ⚠
    └── diffusionmodelspath.json  # 7 phases
```

---

## License

MIT — personal use.
