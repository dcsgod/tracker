/**
 * main.js — App entry point
 * Handles: tab routing, global state, toast notifications, settings wiring
 */

import './styles/main.css';
import { loadState, saveState } from './lib/storage.js';
import { isConnected, syncFromGist, debouncedPush, getLastSyncedAt } from './lib/githubSync.js';
import { renderOverview } from './components/OverviewTab.js';
import { renderRoadmaps } from './components/RoadmapTab.js';
import { renderCP } from './components/CPTab.js';
import { renderDaily } from './components/DailyTrackerTab.js';
import { renderSettings } from './components/SettingsPanel.js';

// ─── Global State ──────────────────────────────────────────────────────────

let state = loadState();
let currentTab = 'overview';

// ─── Toast System ──────────────────────────────────────────────────────────

export function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ─── State Mutation ────────────────────────────────────────────────────────

/**
 * Central state updater. All components call this to update state.
 * Persists to localStorage and triggers debounced Gist sync.
 */
export function updateState(newState) {
  state = newState;
  updateSyncStatus();
  if (isConnected()) {
    debouncedPush(
      state,
      () => {
        updateSyncStatus('synced');
        showToast('Synced to GitHub Gist', 'success');
      },
      () => showToast('Gist sync failed', 'error')
    );
  }
}

export function getState() { return state; }

// ─── Sync Status UI ────────────────────────────────────────────────────────

function updateSyncStatus(forcedState) {
  const dot = document.getElementById('sync-dot');
  const text = document.getElementById('sync-text');

  if (forcedState === 'synced') {
    dot.className = 'sync-dot synced';
    text.textContent = 'Synced';
    return;
  }

  if (forcedState === 'syncing') {
    dot.className = 'sync-dot syncing';
    text.textContent = 'Syncing…';
    return;
  }

  if (!isConnected()) {
    dot.className = 'sync-dot';
    text.textContent = 'Local only';
    return;
  }

  const lastSync = getLastSyncedAt();
  if (lastSync) {
    const ago = getTimeAgo(new Date(lastSync));
    dot.className = 'sync-dot synced';
    text.textContent = `Synced ${ago}`;
  } else {
    dot.className = 'sync-dot';
    text.textContent = 'Connected';
  }
}

function getTimeAgo(date) {
  const seconds = Math.floor((Date.now() - date) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// ─── Tab Routing ───────────────────────────────────────────────────────────

const tabButtons = document.querySelectorAll('.nav-tab');
const tabPanels = document.querySelectorAll('.tab-panel');

function switchTab(tabId) {
  currentTab = tabId;

  tabButtons.forEach(btn => {
    const isActive = btn.dataset.tab === tabId;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive);
  });

  tabPanels.forEach(panel => {
    panel.classList.toggle('active', panel.id === `tab-${tabId}`);
  });

  // Re-render active tab to pick up state changes
  renderTab(tabId);
}

function renderTab(tabId) {
  switch (tabId) {
    case 'overview':
      renderOverview(document.getElementById('overview-root'), state, updateState, switchTab);
      break;
    case 'roadmaps':
      renderRoadmaps(document.getElementById('roadmaps-root'), state, updateState);
      break;
    case 'cp':
      renderCP(document.getElementById('cp-root'), state, updateState);
      break;
    case 'daily':
      renderDaily(document.getElementById('daily-root'), state, updateState);
      break;
  }
}

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// ─── Settings Modal ────────────────────────────────────────────────────────

const settingsOverlay = document.getElementById('settings-overlay');
const settingsBtn = document.getElementById('settings-btn');

settingsBtn.addEventListener('click', () => {
  settingsOverlay.classList.add('open');
  renderSettings(document.getElementById('settings-root'), state, (newState) => {
    state = newState;
    updateSyncStatus();
    renderTab(currentTab);
    showToast('Settings saved', 'success');
  }, showToast, () => {
    settingsOverlay.classList.remove('open');
  });
});

settingsOverlay.addEventListener('click', (e) => {
  if (e.target === settingsOverlay) settingsOverlay.classList.remove('open');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') settingsOverlay.classList.remove('open');
});

// ─── Initial Load & Gist Sync ──────────────────────────────────────────────

async function init() {
  updateSyncStatus();

  // Attempt Gist pull on load if connected
  if (isConnected()) {
    updateSyncStatus('syncing');
    try {
      const merged = await syncFromGist(state);
      if (merged && merged !== state) {
        state = merged;
        saveState(state);
        updateSyncStatus('synced');
        showToast('Progress loaded from GitHub Gist', 'success');
      } else {
        updateSyncStatus();
      }
    } catch {
      updateSyncStatus();
    }
  }

  // Render the default tab
  renderTab('overview');
}

init();
