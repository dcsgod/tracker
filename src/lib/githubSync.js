/**
 * githubSync.js — GitHub Gist-based cross-device sync
 * Uses a fine-grained PAT with gist scope, stored only in localStorage.
 * Never sends the token to any server other than api.github.com.
 */

const PAT_KEY = 'cpml-tracker:gist-pat';
const GIST_ID_KEY = 'cpml-tracker:gist-id';
const LAST_SYNC_KEY = 'cpml-tracker:last-sync';

const API_BASE = 'https://api.github.com';

let _debounceTimer = null;

// ─── PAT / Gist ID Management ──────────────────────────────────────────────

export function storePAT(pat) {
  localStorage.setItem(PAT_KEY, pat);
}

export function getPAT() {
  return localStorage.getItem(PAT_KEY);
}

export function storeGistId(gistId) {
  localStorage.setItem(GIST_ID_KEY, gistId);
}

export function getGistId() {
  return localStorage.getItem(GIST_ID_KEY);
}

export function disconnectGist() {
  localStorage.removeItem(PAT_KEY);
  localStorage.removeItem(GIST_ID_KEY);
  localStorage.removeItem(LAST_SYNC_KEY);
}

export function isConnected() {
  return !!(getPAT() && getGistId());
}

export function getLastSyncedAt() {
  return localStorage.getItem(LAST_SYNC_KEY);
}

// ─── Gist API Calls ────────────────────────────────────────────────────────

/**
 * Fetch progress from Gist and return parsed JSON.
 * Returns null if not connected or Gist doesn't have the file yet.
 */
export async function pullGist() {
  const pat = getPAT();
  const gistId = getGistId();
  if (!pat || !gistId) return null;

  try {
    const res = await fetch(`${API_BASE}/gists/${gistId}`, {
      headers: {
        Authorization: `Bearer ${pat}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    const data = await res.json();
    const file = data.files?.['progress.json'];
    if (!file?.content) return null;
    return JSON.parse(file.content);
  } catch (err) {
    console.error('[GistSync] Pull failed:', err);
    return null;
  }
}

/**
 * Push current state to Gist via PATCH.
 * Creates the file if it doesn't exist in the Gist.
 */
export async function pushGist(state) {
  const pat = getPAT();
  const gistId = getGistId();
  if (!pat || !gistId) return false;

  try {
    const res = await fetch(`${API_BASE}/gists/${gistId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${pat}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        files: {
          'progress.json': {
            content: JSON.stringify(state, null, 2)
          }
        }
      })
    });
    if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    const now = new Date().toISOString();
    localStorage.setItem(LAST_SYNC_KEY, now);
    return true;
  } catch (err) {
    console.error('[GistSync] Push failed:', err);
    return false;
  }
}

/**
 * Debounced push — call this on every state change.
 * Waits 3s after the last call before actually pushing.
 */
export function debouncedPush(state, onSuccess, onError) {
  if (_debounceTimer) clearTimeout(_debounceTimer);
  _debounceTimer = setTimeout(async () => {
    const ok = await pushGist(state);
    if (ok) onSuccess?.();
    else onError?.();
  }, 3000);
}

/**
 * Merge remote state into local state.
 * Last-write-wins by updatedAt timestamp.
 */
export function mergeStates(local, remote) {
  if (!remote) return local;
  const localTime = local.updatedAt ? new Date(local.updatedAt) : new Date(0);
  const remoteTime = remote.updatedAt ? new Date(remote.updatedAt) : new Date(0);
  if (remoteTime > localTime) {
    console.log('[GistSync] Remote is newer, using remote state');
    return remote;
  }
  console.log('[GistSync] Local is newer or equal, keeping local state');
  return local;
}

/**
 * Full sync: pull from Gist, merge with local, and update if remote is newer.
 * Returns the merged state (or null on failure).
 */
export async function syncFromGist(localState) {
  const remote = await pullGist();
  if (!remote) return null;
  return mergeStates(localState, remote);
}

/**
 * Verify a PAT + Gist ID combination is valid.
 * Returns { valid: boolean, error?: string }
 */
export async function verifyConnection(pat, gistId) {
  try {
    const res = await fetch(`${API_BASE}/gists/${gistId}`, {
      headers: {
        Authorization: `Bearer ${pat}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    if (res.status === 404) return { valid: false, error: 'Gist not found. Check the Gist ID.' };
    if (res.status === 401) return { valid: false, error: 'Invalid PAT. Check your token.' };
    if (!res.ok) return { valid: false, error: `GitHub API error: ${res.status}` };
    return { valid: true };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}
