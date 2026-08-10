/**
 * RoadmapTab.js — 8 roadmap checklists with collapsible phases
 */

import { setTopicChecked, isTopicChecked, getRoadmapProgress, getWeekNumber } from '../lib/storage.js';

const ROADMAP_IDS = ['mlpath', 'nlppath', 'llmreasoning', 'timeseriespath', 'quantpath', 'gnnpath', 'rlpath', 'diffusionmodelspath'];
const ROADMAP_ICONS = {
  mlpath: '🧠', nlppath: '💬', llmreasoning: '🤖', timeseriespath: '📈',
  quantpath: '📊', gnnpath: '🕸️', rlpath: '🎮', diffusionmodelspath: '🎨'
};

let roadmapData = {};
let activeRoadmapId = 'mlpath';
let searchQuery = '';
let expandedPhases = new Set();

async function loadRoadmaps() {
  if (Object.keys(roadmapData).length) return;
  await Promise.all(ROADMAP_IDS.map(async id => {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}data/roadmaps/${id}.json`);
      roadmapData[id] = await res.json();
    } catch { roadmapData[id] = null; }
  }));
}

export async function renderRoadmaps(root, state, updateState) {
  if (!Object.keys(roadmapData).length) {
    root.innerHTML = `<div class="spinner"></div>`;
    await loadRoadmaps();
  }

  function rerender() {
    renderRoadmaps(root, state, updateState);
  }

  const activeRoadmap = roadmapData[activeRoadmapId];
  const allProgresses = {};
  for (const id of ROADMAP_IDS) {
    if (roadmapData[id]) allProgresses[id] = getRoadmapProgress(state, roadmapData[id]);
  }

  const activeProgress = allProgresses[activeRoadmapId] ?? { checked: 0, total: 0, percent: 0 };

  root.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; gap:16px; flex-wrap:wrap">
      <div>
        <h1 style="font-size:1.5rem; font-weight:700; background:var(--gradient-primary); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text">
          Learning Roadmaps
        </h1>
        <div style="color:var(--text-secondary); font-size:0.875rem; margin-top:4px">
          Track progress across 8 mastery paths
        </div>
      </div>
      <div class="search-box" style="max-width:260px">
        <span class="search-icon">🔍</span>
        <input type="text" class="input" id="roadmap-search" placeholder="Search topics…" value="${searchQuery}" />
      </div>
    </div>

    <div class="roadmap-layout">
      <!-- Sidebar -->
      <div class="roadmap-sidebar">
        ${ROADMAP_IDS.map(id => {
          const rm = roadmapData[id];
          if (!rm) return '';
          const prog = allProgresses[id] ?? { checked: 0, total: 0, percent: 0 };
          return `
            <div class="roadmap-sidebar-item ${id === activeRoadmapId ? 'active' : ''}" 
                 data-roadmap="${id}" id="sidebar-${id}">
              <div style="display:flex; align-items:center; gap:8px; flex:1; min-width:0">
                <span style="font-size:1.1rem">${ROADMAP_ICONS[id]}</span>
                <div style="min-width:0">
                  <div class="roadmap-sidebar-name">${rm.title}</div>
                  <div style="margin-top:4px">
                    <div class="progress-bar" style="height:3px">
                      <div class="progress-fill" style="width:${prog.percent}%"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div style="text-align:right; flex-shrink:0">
                <div class="roadmap-sidebar-progress">${prog.percent}%</div>
                <div style="font-size:0.65rem; color:var(--text-muted)">${prog.checked}/${prog.total}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Roadmap Detail -->
      <div id="roadmap-detail">
        ${renderRoadmapDetail(activeRoadmap, state, activeProgress)}
      </div>
    </div>
  `;

  // Wire sidebar clicks
  root.querySelectorAll('.roadmap-sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      activeRoadmapId = item.dataset.roadmap;
      expandedPhases.clear();
      renderRoadmaps(root, state, updateState);
    });
  });

  // Wire search
  const searchInput = root.querySelector('#roadmap-search');
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    document.getElementById('roadmap-detail').innerHTML =
      renderRoadmapDetail(activeRoadmap, state, activeProgress);
    wirePhaseToggles(root, state, updateState);
    wireTopicCheckboxes(root, state, updateState);
  });

  wirePhaseToggles(root, state, updateState);
  wireTopicCheckboxes(root, state, updateState);
}

function renderRoadmapDetail(roadmap, state, progress) {
  if (!roadmap) return `<div class="empty-state"><div class="empty-state-icon">❌</div><div class="empty-state-title">Could not load roadmap data</div></div>`;

  const q = searchQuery.toLowerCase().trim();

  return `
    <!-- Roadmap Header -->
    <div class="card" style="margin-bottom:16px">
      <div class="card-body" style="display:flex; align-items:center; gap:20px; flex-wrap:wrap">
        <div style="font-size:2.5rem">${ROADMAP_ICONS[roadmap.id]}</div>
        <div style="flex:1; min-width:180px">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px">
            <h2 style="font-size:1.2rem; font-weight:700">${roadmap.title}</h2>
            <span class="badge ${roadmap.coverage === 'full' ? 'badge-full' : 'badge-partial'}">${roadmap.coverage}</span>
            ${roadmap.stub ? '<span class="badge badge-stub">⚠ stub — needs refresh</span>' : ''}
          </div>
          <a href="${roadmap.sourceUrl}" target="_blank" rel="noopener" 
             style="font-size:0.78rem; color:var(--primary); display:flex; align-items:center; gap:4px">
            ${roadmap.sourceUrl} ↗
          </a>
        </div>
        <div style="text-align:center">
          <div style="font-size:2rem; font-weight:800; background:var(--gradient-primary); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text">${progress.percent}%</div>
          <div style="font-size:0.78rem; color:var(--text-muted)">${progress.checked} / ${progress.total} topics</div>
          <div class="progress-bar thick" style="margin-top:6px; width:120px">
            <div class="progress-fill" style="width:${progress.percent}%"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Phases -->
    ${roadmap.phases.map((phase, phaseIdx) => {
      const phaseChecked = phase.topics.filter(t => state.roadmaps?.[roadmap.id]?.[t.id]).length;
      const phaseTotal = phase.topics.length;
      const phasePct = phaseTotal > 0 ? Math.round((phaseChecked / phaseTotal) * 100) : 0;
      const phaseId = `${roadmap.id}-${phase.id}`;
      const isOpen = expandedPhases.has(phaseId) || q.length > 0;

      // Filter topics by search
      const topics = q
        ? phase.topics.filter(t => t.title.toLowerCase().includes(q))
        : phase.topics;

      if (q && topics.length === 0) return '';

      return `
        <div class="phase-card" id="phase-card-${phaseId}">
          <div class="phase-header collapsible-header ${isOpen ? 'open' : ''}" data-phase="${phaseId}">
            <div class="phase-number">${phaseIdx + 1}</div>
            <div class="phase-title-wrap">
              <div class="phase-title">${phase.title}</div>
              <div class="phase-stats">${phaseChecked}/${phaseTotal} completed</div>
            </div>
            ${phase.priority ? `<span class="badge ${phase.stretch ? 'badge-stretch' : 'badge-must'}">${phase.stretch ? 'stretch' : 'priority'}</span>` : ''}
            <div style="display:flex; align-items:center; gap:8px">
              <span class="phase-pct">${phasePct}%</span>
              <span class="collapsible-chevron">▶</span>
            </div>
          </div>
          <div class="phase-progress-row">
            <div class="progress-bar phase-progress-bar">
              <div class="progress-fill" style="width:${phasePct}%"></div>
            </div>
          </div>
          <div class="collapsible-body ${isOpen ? 'open' : ''}" id="phase-body-${phaseId}">
            <div class="topic-list">
              ${topics.map(topic => {
                const checked = isTopicChecked(state, roadmap.id, topic.id);
                const hasPapers = topic.papers && topic.papers.length > 0;
                return `
                  <div class="topic-item" data-roadmap="${roadmap.id}" data-topic="${topic.id}">
                    <input type="checkbox" id="topic-${roadmap.id}-${topic.id}" 
                           ${checked ? 'checked' : ''} />
                    <label for="topic-${roadmap.id}-${topic.id}" class="topic-text">
                      ${topic.title}
                      ${hasPapers ? `<span style="color:var(--accent); font-size:0.75rem; margin-left:4px" title="${topic.papers.join(', ')}">📄 ${topic.papers.length}</span>` : ''}
                    </label>
                    <a href="${roadmap.sourceUrl}" target="_blank" rel="noopener" 
                       class="topic-link" title="Open source">↗</a>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;
    }).join('')}
  `;
}

function wirePhaseToggles(root, state, updateState) {
  root.querySelectorAll('.collapsible-header[data-phase]').forEach(header => {
    header.addEventListener('click', () => {
      const phaseId = header.dataset.phase;
      const body = document.getElementById(`phase-body-${phaseId}`);
      if (!body) return;
      const isOpen = body.classList.contains('open');
      if (isOpen) {
        body.classList.remove('open');
        header.classList.remove('open');
        expandedPhases.delete(phaseId);
      } else {
        body.classList.add('open');
        header.classList.add('open');
        expandedPhases.add(phaseId);
      }
    });
  });
}

function wireTopicCheckboxes(root, state, updateState) {
  root.querySelectorAll('.topic-item input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const item = e.target.closest('.topic-item');
      const roadmapId = item.dataset.roadmap;
      const topicId = item.dataset.topic;
      const newState = setTopicChecked(state, roadmapId, topicId, e.target.checked);
      state = newState;
      updateState(newState);

      // Update phase progress bar inline (no full re-render)
      updatePhaseProgress(root, roadmapId, topicId, newState);
    });
  });
}

function updatePhaseProgress(root, roadmapId, topicId, state) {
  // Find the phase containing this topic and update its progress bar
  const rm = roadmapData[roadmapId];
  if (!rm) return;
  for (const phase of rm.phases) {
    if (phase.topics.find(t => t.id === topicId)) {
      const phaseChecked = phase.topics.filter(t => state.roadmaps?.[roadmapId]?.[t.id]).length;
      const phasePct = Math.round((phaseChecked / phase.topics.length) * 100);
      const phaseId = `${roadmapId}-${phase.id}`;
      const card = document.getElementById(`phase-card-${phaseId}`);
      if (card) {
        card.querySelector('.progress-fill').style.width = `${phasePct}%`;
        card.querySelector('.phase-pct').textContent = `${phasePct}%`;
        card.querySelector('.phase-stats').textContent = `${phaseChecked}/${phase.topics.length} completed`;
      }
      break;
    }
  }
}
