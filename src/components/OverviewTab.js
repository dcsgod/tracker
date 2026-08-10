/**
 * OverviewTab.js — Aggregate progress dashboard
 * Shows: overall %, per-roadmap bars, streak summary, weekly papers
 */

import { getRoadmapProgress, getCPTopicProgress, computeStreak, formatDate, getWeekNumber } from '../lib/storage.js';

const ROADMAP_IDS = ['mlpath', 'nlppath', 'llmreasoning', 'timeseriespath', 'quantpath', 'gnnpath', 'rlpath', 'diffusionmodelspath'];
const ROADMAP_TITLES = {
  mlpath: 'ML/DL Mastery',
  nlppath: 'NLP → Reasoning',
  llmreasoning: 'LLM Building & Reasoning',
  timeseriespath: 'Time Series & Causal',
  quantpath: 'Quant Researcher',
  gnnpath: 'GNN Path',
  rlpath: 'RL Path',
  diffusionmodelspath: 'Diffusion Models'
};
const ROADMAP_ICONS = {
  mlpath: '🧠', nlppath: '💬', llmreasoning: '🤖', timeseriespath: '📈',
  quantpath: '📊', gnnpath: '🕸️', rlpath: '🎮', diffusionmodelspath: '🎨'
};
const HABITS = ['gym', 'running', 'diet', 'water', 'dsa', 'ml'];
const HABIT_LABELS = { gym: 'Gym', running: 'Running', diet: 'Diet', water: 'Water 💧', dsa: 'DSA', ml: 'ML' };
const HABIT_ICONS = { gym: '🏋️', running: '🏃', diet: '🥗', water: '💧', dsa: '⚡', ml: '🧠' };

let roadmapDataCache = {};

async function loadRoadmapData() {
  const results = {};
  await Promise.all(ROADMAP_IDS.map(async id => {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}data/roadmaps/${id}.json`);
      results[id] = await res.json();
    } catch { results[id] = null; }
  }));
  return results;
}

export async function renderOverview(root, state, updateState, switchTab) {
  root.innerHTML = `<div class="spinner"></div><div class="loading-text">Loading overview…</div>`;

  if (!Object.keys(roadmapDataCache).length) {
    roadmapDataCache = await loadRoadmapData();
  }

  // Calculate aggregate progress
  let totalTopics = 0, checkedTopics = 0;
  const roadmapProgresses = {};

  for (const id of ROADMAP_IDS) {
    const data = roadmapDataCache[id];
    if (!data) continue;
    const progress = getRoadmapProgress(state, data);
    roadmapProgresses[id] = progress;
    totalTopics += progress.total;
    checkedTopics += progress.checked;
  }

  const overallPct = totalTopics > 0 ? Math.round((checkedTopics / totalTopics) * 100) : 0;

  // CP stats
  const cpTopics = Object.keys(state.cp?.topics ?? {});
  const cpSolved = cpTopics.reduce((sum, tid) => sum + (state.cp.topics[tid]?.problems?.filter(p => p.done)?.length ?? 0), 0);
  const cpTotal = cpTopics.reduce((sum, tid) => sum + (state.cp.topics[tid]?.problems?.length ?? 0), 0);

  // Daily streak calculations
  const today = new Date();
  const streaks = {};
  for (const habit of HABITS) {
    streaks[habit] = computeStreak(state, habit);
  }

  // Days completed (at least 1 habit checked)
  const dailyDates = Object.keys(state.daily ?? {});
  const daysWithActivity = dailyDates.filter(d => Object.values(state.daily[d]).some(v => v)).length;

  // Weekly papers — collect from current-phase topics
  const weeklyPapers = getWeeklyPapers(state, roadmapDataCache);

  root.innerHTML = `
    <!-- Hero Overview Ring -->
    <div class="overview-hero">
      <div class="overview-ring" style="--pct: ${overallPct}" id="overview-ring">
        <div class="overview-ring-value">${overallPct}%</div>
      </div>
      <div class="overview-title">Overall Mastery</div>
      <div class="overview-subtitle">
        ${checkedTopics} / ${totalTopics} topics completed across all tracks
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid-4" style="margin-bottom: 24px">
      <div class="stat-card">
        <div class="stat-value">${overallPct}%</div>
        <div class="stat-label">Roadmap Progress</div>
        <div class="stat-sub">${checkedTopics}/${totalTopics} topics</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${cpSolved}</div>
        <div class="stat-label">CF Problems Solved</div>
        <div class="stat-sub">${cpTotal} added to tracker</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${daysWithActivity}</div>
        <div class="stat-label">Active Days</div>
        <div class="stat-sub">Since Aug 11, 2026</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${Math.max(...Object.values(streaks), 0)}</div>
        <div class="stat-label">Best Streak</div>
        <div class="stat-sub">${Object.entries(streaks).find(([,v]) => v === Math.max(...Object.values(streaks)))?.[0] ?? '—'} habit</div>
      </div>
    </div>

    <!-- Roadmap Progress -->
    <div class="grid-2" style="margin-bottom: 24px">
      <div class="card">
        <div class="card-header">
          <div class="card-title">🗺️ Roadmap Tracks</div>
          <button class="btn btn-secondary btn-sm" onclick="window.switchToTab('roadmaps')">View All →</button>
        </div>
        <div class="card-body" style="display:flex; flex-direction:column; gap:14px">
          ${ROADMAP_IDS.map(id => {
            const data = roadmapDataCache[id];
            if (!data) return '';
            const prog = roadmapProgresses[id];
            return `
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px">
                  <span style="font-size:0.85rem; font-weight:500; display:flex; align-items:center; gap:6px">
                    ${ROADMAP_ICONS[id]} ${ROADMAP_TITLES[id]}
                    <span class="badge ${data.coverage === 'full' ? 'badge-full' : 'badge-partial'}">${data.coverage}</span>
                    ${data.stub ? '<span class="badge badge-stub">stub</span>' : ''}
                  </span>
                  <span style="font-size:0.78rem; font-family:var(--font-mono); color:var(--text-muted)">${prog.checked}/${prog.total}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width:${prog.percent}%"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Habit Streaks -->
      <div>
        <div class="card" style="margin-bottom: 16px">
          <div class="card-header">
            <div class="card-title">🔥 Habit Streaks</div>
            <button class="btn btn-secondary btn-sm" onclick="window.switchToTab('daily')">Open Tracker →</button>
          </div>
          <div class="card-body">
            <div class="streak-row">
              ${HABITS.map(h => `
                <div class="streak-pill">
                  <span>${HABIT_ICONS[h]}</span>
                  <span>${HABIT_LABELS[h]}</span>
                  <span class="streak-count">${streaks[h]}d</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- CP Progress -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">⚡ CP / DSA Progress</div>
            <button class="btn btn-secondary btn-sm" onclick="window.switchToTab('cp')">View Problems →</button>
          </div>
          <div class="card-body">
            <div style="display:flex; align-items:center; gap:16px; margin-bottom:12px">
              <div>
                <div style="font-size:1.8rem; font-weight:800; background:var(--gradient-primary); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text">${cpSolved}</div>
                <div style="font-size:0.78rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:.05em">Solved</div>
              </div>
              <div class="progress-bar" style="flex:1; height:8px">
                <div class="progress-fill" style="width:${cpTotal > 0 ? Math.round(cpSolved/cpTotal*100) : 0}%"></div>
              </div>
              <div style="font-size:0.85rem; font-family:var(--font-mono); color:var(--text-secondary)">${cpTotal}</div>
            </div>
            <div style="font-size:0.8rem; color:var(--text-muted)">
              Problems tracked across ${cpTopics.length} topics.
              Add problems in the CP/DSA tab.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Weekly Papers -->
    ${weeklyPapers.length > 0 ? `
    <div class="card">
      <div class="card-header">
        <div class="card-title">📄 Papers to Reproduce This Week</div>
        <span class="badge badge-number">Week ${getWeekNumber() + 1}</span>
      </div>
      <div class="card-body">
        <div class="papers-grid">
          ${weeklyPapers.map(p => {
            const pid = btoa(p.title).slice(0, 16);
            const reproduced = !!(state.papers?.[pid]?.reproduced);
            return `
              <div class="paper-card ${reproduced ? 'reproduced' : ''}">
                <div class="paper-title">${p.title}</div>
                <div class="paper-source">${p.source}</div>
                <div class="paper-actions">
                  <button class="btn btn-xs ${reproduced ? 'btn-secondary' : 'btn-primary'}" 
                    data-paper-id="${pid}" 
                    data-paper-reproduced="${reproduced}"
                    onclick="window.togglePaper('${pid}', ${!reproduced})">
                    ${reproduced ? '✅ Reproduced' : '▶ Mark Reproduced'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
    ` : ''}
  `;

  // Wire up tab switch buttons
  window.switchToTab = switchTab;

  // Wire paper reproduction
  window.togglePaper = (pid, reproduced) => {
    const next = { ...state };
    if (!next.papers) next.papers = {};
    next.papers[pid] = { reproduced, weekReproduced: getWeekNumber() };
    updateState(next);
    renderOverview(root, next, updateState, switchTab);
  };
}

/**
 * Select 2–3 papers for the current week from the roadmap the user is actively working on.
 * Algorithm: find the roadmap with highest in-progress phase (most recently partially completed),
 * then pick papers from the current week using week number as index.
 */
function getWeeklyPapers(state, roadmapData) {
  const papers = [];
  const week = getWeekNumber();

  for (const id of ['mlpath', 'nlppath', 'timeseriespath', 'llmreasoning']) {
    const data = roadmapData[id];
    if (!data) continue;

    for (const phase of data.phases) {
      const phaseChecked = phase.topics.filter(t => state.roadmaps?.[id]?.[t.id]).length;
      const phaseTotal = phase.topics.length;

      // In-progress phase: some checked but not all
      if (phaseChecked > 0 && phaseChecked < phaseTotal) {
        const allPapers = phase.topics.flatMap(t =>
          (t.papers ?? []).map(p => ({ title: p, source: `${data.title} — ${phase.title}` }))
        );
        if (allPapers.length > 0) {
          // Pick 2 papers using week as rotation index
          const start = (week * 2) % allPapers.length;
          for (let i = 0; i < 3 && papers.length < 3; i++) {
            papers.push(allPapers[(start + i) % allPapers.length]);
          }
          if (papers.length >= 3) break;
        }
      }
    }
    if (papers.length >= 3) break;
  }

  // Fallback: grab from first phase of mlpath if nothing in-progress
  if (papers.length === 0 && roadmapData.mlpath) {
    const phase0 = roadmapData.mlpath.phases[0];
    const allPapers = phase0?.topics.flatMap(t =>
      (t.papers ?? []).map(p => ({ title: p, source: `ML/DL Mastery — ${phase0.title}` }))
    ) ?? [];
    const start = week % Math.max(1, allPapers.length);
    papers.push(...allPapers.slice(start, start + 3));
  }

  return papers.slice(0, 3);
}
