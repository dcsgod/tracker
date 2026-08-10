/**
 * CPTab.js — Codeforces problem tracker
 * Left: topic list | Right: problem browser + my list
 */

import { fetchAllProblems, filterProblems, RATING_BANDS, getCacheInfo, clearCache } from '../lib/codeforces.js';
import { addCPProblem, toggleCPProblem, removeCPProblem, getCPTopicProgress } from '../lib/storage.js';

let cpTopics = [];
let activeTopicId = null;
let allCFProblems = [];
let cfLoading = false;
let selectedBandIdx = 0; // 0 = 800-1000
let viewMode = 'browse'; // 'browse' | 'mylist'
let stateRef = null;
let updateStateRef = null;
let rootRef = null;

async function loadTopics() {
  if (cpTopics.length) return;
  const res = await fetch(`${import.meta.env.BASE_URL}data/cp-topics.json`);
  cpTopics = await res.json();
  if (!activeTopicId && cpTopics.length) activeTopicId = cpTopics[0].id;
}

async function ensureCFProblems() {
  if (allCFProblems.length || cfLoading) return;
  cfLoading = true;
  allCFProblems = await fetchAllProblems();
  cfLoading = false;
}

export async function renderCP(root, state, updateState) {
  rootRef = root;
  stateRef = state;
  updateStateRef = updateState;

  if (!cpTopics.length) {
    root.innerHTML = `<div class="spinner"></div>`;
    await loadTopics();
  }

  const activeTopic = cpTopics.find(t => t.id === activeTopicId) ?? cpTopics[0];
  const cpState = state.cp ?? { topics: {} };

  const cacheInfo = getCacheInfo();

  root.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:12px">
      <div>
        <h1 style="font-size:1.5rem; font-weight:700; background:var(--gradient-primary); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text">
          CP / DSA Tracker
        </h1>
        <div style="color:var(--text-secondary); font-size:0.875rem; margin-top:4px">
          Codeforces problems from 800 → 2100
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap">
        ${cacheInfo ? `
          <span style="font-size:0.75rem; color:var(--text-muted)">
            CF cache: ${cacheInfo.count.toLocaleString()} problems, ${cacheInfo.daysOld}d old
          </span>
          <button class="btn btn-secondary btn-sm" id="clear-cache-btn">🔄 Refresh</button>
        ` : ''}
        <a href="https://dcsgod.github.io/Cppath/" target="_blank" class="btn btn-secondary btn-sm">
          📘 CP Roadmap ↗
        </a>
      </div>
    </div>

    <div class="cp-layout">
      <!-- Topic Sidebar -->
      <div>
        <div style="font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:var(--text-muted); padding:0 4px; margin-bottom:8px">
          DSA Topics
        </div>
        <div class="cp-topic-list" id="cp-topic-list">
          ${cpTopics.map(topic => {
            const prog = getCPTopicProgress(state, topic.id);
            return `
              <div class="cp-topic-item ${topic.id === activeTopicId ? 'active' : ''}" data-topic="${topic.id}">
                <div style="flex:1; min-width:0">
                  <div class="cp-topic-name">${topic.title}</div>
                  <div style="margin-top:4px">
                    <div class="progress-bar" style="height:2px">
                      <div class="progress-fill" style="width:${prog.percent}%"></div>
                    </div>
                  </div>
                </div>
                <div class="cp-topic-meta">${prog.solved}/${prog.total}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Right Panel -->
      <div>
        <!-- Rating band selector & view toggle -->
        <div class="card" style="margin-bottom:16px">
          <div class="card-body" style="display:flex; align-items:center; gap:12px; flex-wrap:wrap">
            <div style="flex:1; min-width:200px">
              <div class="input-label" style="margin-bottom:6px">Rating Band</div>
              <select class="input" id="rating-band-select">
                ${RATING_BANDS.map((band, i) => `
                  <option value="${i}" ${i === selectedBandIdx ? 'selected' : ''}>${band.label}</option>
                `).join('')}
              </select>
            </div>
            <div style="display:flex; gap:8px; align-items:flex-end; padding-bottom:1px">
              <button class="btn ${viewMode === 'browse' ? 'btn-primary' : 'btn-secondary'} btn-sm" id="view-browse">🔍 Browse</button>
              <button class="btn ${viewMode === 'mylist' ? 'btn-primary' : 'btn-secondary'} btn-sm" id="view-mylist">⭐ My List</button>
            </div>
            <button class="btn btn-primary btn-sm" id="fetch-btn">
              ${cfLoading ? '⏳ Loading…' : '⚡ Load Problems'}
            </button>
          </div>
        </div>

        <!-- Active Topic Info -->
        ${activeTopic ? `
          <div style="margin-bottom:12px; display:flex; align-items:center; gap:12px">
            <h2 style="font-size:1.1rem; font-weight:600; flex:1">${activeTopic.title}</h2>
            <div style="display:flex; gap:6px">
              ${activeTopic.tags.map(t => `<span class="badge badge-number">${t}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Problem Panel -->
        <div id="problem-panel">
          <div class="empty-state">
            <div class="empty-state-icon">⚡</div>
            <div class="empty-state-title">Click "Load Problems" to fetch from Codeforces</div>
            <div class="empty-state-desc">Problems are cached locally for 7 days</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Wire topic clicks
  root.querySelectorAll('.cp-topic-item').forEach(item => {
    item.addEventListener('click', () => {
      activeTopicId = item.dataset.topic;
      renderCP(root, state, updateState);
    });
  });

  // Wire rating band
  root.querySelector('#rating-band-select')?.addEventListener('change', (e) => {
    selectedBandIdx = parseInt(e.target.value);
  });

  // Wire view toggle
  root.querySelector('#view-browse')?.addEventListener('click', () => {
    viewMode = 'browse';
    renderCP(root, state, updateState);
  });

  root.querySelector('#view-mylist')?.addEventListener('click', () => {
    viewMode = 'mylist';
    renderProblemPanel(root, state, updateState);
  });

  // Wire fetch button
  root.querySelector('#fetch-btn')?.addEventListener('click', async () => {
    const btn = root.querySelector('#fetch-btn');
    btn.textContent = '⏳ Loading…';
    btn.disabled = true;
    await ensureCFProblems();
    renderProblemPanel(root, state, updateState);
    btn.textContent = '⚡ Reload';
    btn.disabled = false;
  });

  // Wire cache clear
  root.querySelector('#clear-cache-btn')?.addEventListener('click', () => {
    clearCache();
    allCFProblems = [];
    renderCP(root, state, updateState);
  });

  // Auto-render my list if in that mode
  if (viewMode === 'mylist') {
    renderProblemPanel(root, state, updateState);
  }
}

function renderProblemPanel(root, state, updateState) {
  const panel = root.querySelector('#problem-panel');
  if (!panel) return;

  if (viewMode === 'mylist') {
    renderMyList(panel, state, updateState);
    return;
  }

  if (!allCFProblems.length) return;

  const activeTopic = cpTopics.find(t => t.id === activeTopicId);
  if (!activeTopic) return;

  const band = RATING_BANDS[selectedBandIdx];
  const problems = filterProblems(allCFProblems, activeTopic.tags, band.min, band.max, 50);
  const myList = state.cp?.topics?.[activeTopicId]?.problems ?? [];
  const myListIds = new Set(myList.map(p => p.cfId));

  if (problems.length === 0) {
    panel.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-title">No problems found</div>
        <div class="empty-state-desc">No Codeforces problems matched this topic + rating band. Try a different band.</div>
      </div>
    `;
    return;
  }

  panel.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px">
      <div style="font-size:0.85rem; color:var(--text-muted)">${problems.length} problems found</div>
      <div style="font-size:0.78rem; color:var(--text-muted)">Shuffled for variety · click to add to your list</div>
    </div>
    <div style="display:flex; flex-direction:column; gap:8px">
      ${problems.map(p => {
        const ratingClass = p.rating ? `rating-${Math.floor(p.rating / 100) * 100}` : '';
        const inMyList = myListIds.has(p.cfId);
        return `
          <div class="cp-problem-card" data-cf-id="${p.cfId}">
            <div style="flex:1; min-width:0">
              <div class="cp-problem-title">${p.title}</div>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px; font-family:var(--font-mono)">${p.cfId}</div>
            </div>
            <div style="display:flex; align-items:center; gap:8px; flex-shrink:0">
              ${p.rating ? `<span class="rating-badge ${ratingClass}">${p.rating}</span>` : ''}
              <a href="${p.url}" target="_blank" rel="noopener" class="btn btn-secondary btn-xs">↗</a>
              <button class="btn ${inMyList ? 'btn-secondary' : 'btn-primary'} btn-xs add-problem-btn" 
                      data-cf-id="${p.cfId}" data-title="${escapeHtml(p.title)}" data-rating="${p.rating}"
                      ${inMyList ? 'disabled' : ''}>
                ${inMyList ? '✓ Added' : '+ Add'}
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Wire add buttons
  panel.querySelectorAll('.add-problem-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      const problem = {
        cfId: btn.dataset.cfId,
        title: btn.dataset.title,
        rating: parseInt(btn.dataset.rating) || null
      };
      const newState = addCPProblem(state, activeTopicId, problem);
      state = newState;
      updateState(newState);
      btn.textContent = '✓ Added';
      btn.disabled = true;
      btn.className = 'btn btn-secondary btn-xs add-problem-btn';
    });
  });
}

function renderMyList(panel, state, updateState) {
  const myProblems = state.cp?.topics?.[activeTopicId]?.problems ?? [];

  if (myProblems.length === 0) {
    panel.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⭐</div>
        <div class="empty-state-title">Your list is empty</div>
        <div class="empty-state-desc">Switch to Browse mode, load problems from CF, and add them here.</div>
      </div>
    `;
    return;
  }

  const solved = myProblems.filter(p => p.done).length;

  panel.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px">
      <div style="font-size:0.85rem; color:var(--text-muted)">${solved}/${myProblems.length} solved</div>
      <div class="progress-bar" style="flex:1; margin:0 16px">
        <div class="progress-fill" style="width:${myProblems.length > 0 ? Math.round(solved/myProblems.length*100) : 0}%"></div>
      </div>
      <span style="font-size:0.78rem; font-family:var(--font-mono); color:var(--primary)">
        ${myProblems.length > 0 ? Math.round(solved/myProblems.length*100) : 0}%
      </span>
    </div>
    <div style="display:flex; flex-direction:column; gap:8px">
      ${myProblems.map(p => {
        const ratingClass = p.rating ? `rating-${Math.floor(p.rating / 100) * 100}` : '';
        return `
          <div class="cp-problem-card ${p.done ? 'done' : ''}">
            <input type="checkbox" class="habit-checkbox" ${p.done ? 'checked' : ''} 
                   data-cf-id="${p.cfId}" style="flex-shrink:0; margin:0" />
            <div style="flex:1; min-width:0">
              <div class="cp-problem-title">${p.title}</div>
              <div style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono)">${p.cfId}</div>
            </div>
            <div style="display:flex; align-items:center; gap:8px; flex-shrink:0">
              ${p.rating ? `<span class="rating-badge ${ratingClass}">${p.rating}</span>` : ''}
              <a href="https://codeforces.com/problemset/problem/${p.cfId.replace(/([A-Z]+)$/, '/$1')}" 
                 target="_blank" rel="noopener" class="btn btn-secondary btn-xs">↗</a>
              <button class="btn btn-danger btn-xs remove-btn" data-cf-id="${p.cfId}">✕</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Wire checkboxes
  panel.querySelectorAll('.habit-checkbox[data-cf-id]').forEach(cb => {
    cb.addEventListener('change', () => {
      const newState = toggleCPProblem(state, activeTopicId, cb.dataset.cfId);
      state = newState;
      updateState(newState);
      renderMyList(panel, newState, updateState);
    });
  });

  // Wire remove buttons
  panel.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newState = removeCPProblem(state, activeTopicId, btn.dataset.cfId);
      state = newState;
      updateState(newState);
      renderMyList(panel, newState, updateState);
    });
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
