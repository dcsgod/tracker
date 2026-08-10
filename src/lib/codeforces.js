/**
 * codeforces.js — Codeforces API client + local cache
 * API: https://codeforces.com/api/problemset.problems (no auth)
 * Cache: stored in localStorage for 7 days
 */

const CF_CACHE_KEY = 'cpml-tracker:cf-cache';
const CF_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
const CF_API_URL = 'https://codeforces.com/api/problemset.problems';

/**
 * Fetch all problems from Codeforces API.
 * Returns cached version if fresh (< 7 days old).
 */
export async function fetchAllProblems() {
  const cached = loadCache();
  if (cached) return cached;

  try {
    const res = await fetch(CF_API_URL);
    if (!res.ok) throw new Error(`CF API error: ${res.status}`);
    const data = await res.json();
    if (data.status !== 'OK') throw new Error(`CF API status: ${data.status}`);

    const problems = data.result.problems.map(p => ({
      cfId: `${p.contestId}${p.index}`,
      contestId: p.contestId,
      index: p.index,
      title: p.name,
      rating: p.rating ?? null,
      tags: p.tags ?? [],
      url: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`
    }));

    saveCache(problems);
    return problems;
  } catch (err) {
    console.error('[CF] Fetch failed:', err);
    // Return stale cache if available
    const stale = loadCache(true);
    return stale ?? [];
  }
}

/**
 * Filter problems by tags and rating range.
 * tags: array of strings (CF tag names)
 * ratingMin/ratingMax: numbers or null (to include unrated)
 */
export function filterProblems(problems, tags, ratingMin, ratingMax, limit = 50) {
  return problems
    .filter(p => {
      // Rating filter
      if (p.rating === null) return false;
      if (ratingMin !== null && p.rating < ratingMin) return false;
      if (ratingMax !== null && p.rating > ratingMax) return false;
      // Tag filter — problem must have at least one of the requested tags
      if (tags && tags.length > 0) {
        const hasTag = tags.some(t => p.tags.some(pt => pt.toLowerCase().includes(t.toLowerCase())));
        if (!hasTag) return false;
      }
      return true;
    })
    .sort(() => Math.random() - 0.5) // Shuffle for variety
    .slice(0, limit);
}

/**
 * Get problems for a specific CP topic.
 * Uses the topic's tags from cp-topics.json.
 */
export async function getProblemsForTopic(topic, ratingMin, ratingMax) {
  const all = await fetchAllProblems();
  return filterProblems(all, topic.tags, ratingMin, ratingMax);
}

/**
 * Rating band definitions matching the project spec.
 */
export const RATING_BANDS = [
  { label: '800–1000 (Beginner)', min: 800, max: 1000 },
  { label: '1100–1300 (Easy)', min: 1100, max: 1300 },
  { label: '1400–1600 (Medium)', min: 1400, max: 1600 },
  { label: '1700–1900 (Hard)', min: 1700, max: 1900 },
  { label: '2000–2100 (Expert)', min: 2000, max: 2100 }
];

/**
 * Clear the CF problem cache (force refresh next time).
 */
export function clearCache() {
  localStorage.removeItem(CF_CACHE_KEY);
}

/**
 * Get cache age info.
 */
export function getCacheInfo() {
  const raw = localStorage.getItem(CF_CACHE_KEY);
  if (!raw) return null;
  try {
    const { fetchedAt, count } = JSON.parse(raw);
    const age = Date.now() - fetchedAt;
    const daysOld = (age / (24 * 60 * 60 * 1000)).toFixed(1);
    return { fetchedAt: new Date(fetchedAt).toLocaleString(), daysOld, count };
  } catch {
    return null;
  }
}

// ─── Cache Helpers ─────────────────────────────────────────────────────────

function loadCache(allowStale = false) {
  try {
    const raw = localStorage.getItem(CF_CACHE_KEY);
    if (!raw) return null;
    const { fetchedAt, problems } = JSON.parse(raw);
    if (!allowStale && Date.now() - fetchedAt > CF_CACHE_TTL) return null;
    return problems;
  } catch {
    return null;
  }
}

function saveCache(problems) {
  localStorage.setItem(CF_CACHE_KEY, JSON.stringify({
    fetchedAt: Date.now(),
    count: problems.length,
    problems
  }));
}
