/**
 * storage.js — versioned localStorage persistence
 * Schema key: cpml-tracker:v1
 */

const STORAGE_KEY = 'cpml-tracker:v1';

const DEFAULT_STATE = {
  schemaVersion: 1,
  roadmaps: {},   // { [roadmapId]: { [topicId]: true|false } }
  cp: {
    topics: {},   // { [topicId]: { problems: [{ cfId, rating, title, done }] } }
    starredProblems: {}
  },
  daily: {},      // { 'YYYY-MM-DD': { gym, running, diet, water, dsa, ml, mtech } }
  papers: {},     // { [paperId]: { reproduced: true|false, weekReproduced: number } }
  gist: {
    connected: false,
    gistId: null,
    lastSyncedAt: null
  },
  updatedAt: null
};

/**
 * Load full state from localStorage.
 * Returns DEFAULT_STATE if nothing stored or corrupt.
 */
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    // Schema migration hooks (add here if v2 needed)
    if (parsed.schemaVersion === 1) {
      return { ...structuredClone(DEFAULT_STATE), ...parsed };
    }
    return structuredClone(DEFAULT_STATE);
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

/**
 * Persist full state to localStorage.
 */
export function saveState(state) {
  const toSave = { ...state, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  return toSave;
}

/**
 * Check or uncheck a roadmap topic.
 */
export function setTopicChecked(state, roadmapId, topicId, checked) {
  const next = structuredClone(state);
  if (!next.roadmaps[roadmapId]) next.roadmaps[roadmapId] = {};
  next.roadmaps[roadmapId][topicId] = checked;
  return saveState(next);
}

/**
 * Check if a roadmap topic is checked.
 */
export function isTopicChecked(state, roadmapId, topicId) {
  return !!(state.roadmaps[roadmapId]?.[topicId]);
}

/**
 * Set daily habit checkbox.
 */
export function setDailyHabit(state, dateStr, habit, checked) {
  const next = structuredClone(state);
  if (!next.daily[dateStr]) next.daily[dateStr] = {};
  next.daily[dateStr][habit] = checked;
  return saveState(next);
}

/**
 * Add a problem to a CP topic's tracked list.
 */
export function addCPProblem(state, topicId, problem) {
  const next = structuredClone(state);
  if (!next.cp.topics[topicId]) next.cp.topics[topicId] = { problems: [] };
  const existing = next.cp.topics[topicId].problems.find(p => p.cfId === problem.cfId);
  if (!existing) {
    next.cp.topics[topicId].problems.push({ ...problem, done: false, addedAt: new Date().toISOString() });
  }
  return saveState(next);
}

/**
 * Toggle a CP problem as done/not-done.
 */
export function toggleCPProblem(state, topicId, cfId) {
  const next = structuredClone(state);
  const prob = next.cp.topics[topicId]?.problems?.find(p => p.cfId === cfId);
  if (prob) prob.done = !prob.done;
  return saveState(next);
}

/**
 * Remove a problem from a CP topic's list.
 */
export function removeCPProblem(state, topicId, cfId) {
  const next = structuredClone(state);
  if (next.cp.topics[topicId]?.problems) {
    next.cp.topics[topicId].problems = next.cp.topics[topicId].problems.filter(p => p.cfId !== cfId);
  }
  return saveState(next);
}

/**
 * Mark a paper as reproduced (or unmark).
 */
export function setPaperReproduced(state, paperId, reproduced) {
  const next = structuredClone(state);
  if (!next.papers[paperId]) next.papers[paperId] = {};
  next.papers[paperId].reproduced = reproduced;
  if (reproduced) next.papers[paperId].weekReproduced = getWeekNumber();
  return saveState(next);
}

/**
 * Compute streak for a given habit column.
 * Counts consecutive days ending at (and including) today.
 */
export function computeStreak(state, habit) {
  const today = new Date();
  let streak = 0;
  let d = new Date(today);
  while (true) {
    const key = formatDate(d);
    if (state.daily[key]?.[habit]) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Calculate progress for a roadmap given its phase/topic structure.
 * Returns { checked, total, percent }
 */
export function getRoadmapProgress(state, roadmap) {
  let total = 0, checked = 0;
  for (const phase of roadmap.phases) {
    for (const topic of phase.topics) {
      total++;
      if (state.roadmaps[roadmap.id]?.[topic.id]) checked++;
    }
  }
  return { checked, total, percent: total > 0 ? Math.round((checked / total) * 100) : 0 };
}

/**
 * Calculate CP progress for a topic.
 * Returns { solved, total, percent }
 */
export function getCPTopicProgress(state, topicId) {
  const problems = state.cp.topics[topicId]?.problems ?? [];
  const total = problems.length;
  const solved = problems.filter(p => p.done).length;
  return { solved, total, percent: total > 0 ? Math.round((solved / total) * 100) : 0 };
}

/**
 * Export state as a formatted JSON string.
 */
export function exportState(state) {
  return JSON.stringify(state, null, 2);
}

/**
 * Import state from a JSON string.
 * Validates and merges with defaults.
 */
export function importState(jsonStr) {
  const parsed = JSON.parse(jsonStr);
  if (!parsed.schemaVersion) throw new Error('Invalid progress file: missing schemaVersion');
  const merged = { ...structuredClone(DEFAULT_STATE), ...parsed };
  return saveState(merged);
}

// ─── Helpers ───────────────────────────────────────────────────────────────

export function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

export function getWeekNumber() {
  const start = new Date('2026-08-11');
  const now = new Date();
  return Math.max(0, Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000)));
}
