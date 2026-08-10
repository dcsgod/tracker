/**
 * DailyTrackerTab.js — Aug 11 – Dec 31, 2026 habit tracker
 * Replicates the LaTeX PDF tracker interactively
 */

import { setDailyHabit, computeStreak, formatDate } from '../lib/storage.js';

const START_DATE = new Date('2026-08-11');
const END_DATE = new Date('2026-12-31');
const HABITS = ['gym', 'running', 'diet', 'water', 'dsa', 'ml'];
const HABIT_LABELS = {
  gym: 'Gym 🏋️', running: 'Running 🏃', diet: 'Diet 🥗',
  water: 'Water 💧', dsa: 'DSA ⚡', ml: 'ML 🧠', mtech: 'MTech 🎓'
};
const HABIT_COLORS = {
  gym: '#22c55e', running: '#14b8a6', diet: '#84cc16',
  water: '#38bdf8', dsa: '#a855f7', ml: '#6366f1', mtech: '#f97316'
};
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function generateDateRange() {
  const dates = [];
  const current = new Date(START_DATE);
  let dayN = 1;
  while (current <= END_DATE) {
    dates.push({ date: new Date(current), dayN: dayN++ });
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function isWeekend(date) {
  return date.getDay() === 0 || date.getDay() === 6; // Sun or Sat
}

function isToday(date) {
  const now = new Date();
  return date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
}

function isFuture(date) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return date > now;
}

export function renderDaily(root, state, updateState) {
  const dates = generateDateRange();
  const today = new Date();

  // Compute streaks
  const streaks = {};
  for (const habit of [...HABITS, 'mtech']) {
    streaks[habit] = computeStreak(state, habit);
  }

  // Group dates by month for display
  const months = {};
  dates.forEach(({ date, dayN }) => {
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!months[key]) months[key] = { name: MONTH_NAMES[date.getMonth()], year: date.getFullYear(), dates: [] };
    months[key].dates.push({ date, dayN });
  });

  root.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:12px">
      <div>
        <h1 style="font-size:1.5rem; font-weight:700; background:var(--gradient-primary); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text">
          Daily Habit Tracker
        </h1>
        <div style="color:var(--text-secondary); font-size:0.875rem; margin-top:4px">
          Aug 11 → Dec 31, 2026 · ${dates.length} days
        </div>
      </div>
      <div style="display:flex; gap:8px">
        <button class="btn btn-secondary btn-sm" id="scroll-today-btn">📍 Jump to Today</button>
        <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨 Print Week</button>
      </div>
    </div>

    <!-- Streak Summary -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-body">
        <div style="font-size:0.8rem; font-weight:600; color:var(--text-secondary); margin-bottom:10px; text-transform:uppercase; letter-spacing:.05em">
          Current Streaks
        </div>
        <div class="streak-row" style="padding:0">
          ${[...HABITS, 'mtech'].map(habit => `
            <div class="streak-pill">
              <span style="color:${HABIT_COLORS[habit]}">●</span>
              <span style="font-size:0.78rem">${HABIT_LABELS[habit].replace(/ .*/,'')}</span>
              <span class="streak-count">${streaks[habit]}d</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Tracker Table -->
    ${Object.values(months).map(month => `
      <div style="margin-bottom:20px">
        <div style="font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:10px; display:flex; align-items:center; gap:8px">
          <span>${month.name} ${month.year}</span>
          <span style="font-size:0.75rem; color:var(--text-muted)">(${month.dates.length} days)</span>
        </div>
        <div class="daily-table-wrapper">
          <table class="daily-table">
            <thead>
              <tr>
                <th style="width:90px">Date</th>
                <th style="width:40px">Day</th>
                <th style="width:50px">Day#</th>
                ${HABITS.map(h => `<th style="width:52px">${HABIT_LABELS[h].replace(/ .*/,'')}</th>`).join('')}
                <th style="width:60px; color:var(--accent)">MTech</th>
              </tr>
            </thead>
            <tbody>
              ${month.dates.map(({ date, dayN }) => {
                const dateStr = formatDate(date);
                const dayData = state.daily?.[dateStr] ?? {};
                const weekend = isWeekend(date);
                const todayRow = isToday(date);
                const future = isFuture(date);
                return `
                  <tr class="${todayRow ? 'today' : ''} ${weekend ? 'weekend' : ''}" 
                      id="${todayRow ? 'today-row' : ''}">
                    <td class="day-date">${date.getDate()} ${MONTH_NAMES[date.getMonth()]}</td>
                    <td class="day-of-week">${DAY_NAMES[date.getDay()]}</td>
                    <td class="day-n">D${dayN}</td>
                    ${HABITS.map(habit => `
                      <td>
                        <input type="checkbox" 
                               class="habit-checkbox" 
                               data-habit="${habit}" 
                               data-date="${dateStr}"
                               ${dayData[habit] ? 'checked' : ''}
                               ${future ? 'style="opacity:0.35"' : ''}
                               title="${HABIT_LABELS[habit]} · ${dateStr}" />
                      </td>
                    `).join('')}
                    <td>
                      ${weekend ? `
                        <input type="checkbox" 
                               class="habit-checkbox" 
                               data-habit="mtech" 
                               data-date="${dateStr}"
                               ${dayData.mtech ? 'checked' : ''}
                               ${future ? 'style="opacity:0.35"' : ''}
                               title="MTech Classes · ${dateStr}" />
                      ` : '<span style="color:var(--text-muted);font-size:0.7rem">—</span>'}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `).join('')}
  `;

  // Wire checkboxes
  root.querySelectorAll('.habit-checkbox[data-date]').forEach(cb => {
    cb.addEventListener('change', () => {
      const newState = setDailyHabit(state, cb.dataset.date, cb.dataset.habit, cb.checked);
      state = newState;
      updateState(newState);
      // Update streak pills inline
      updateStreaks(root, newState);
    });
  });

  // Scroll to today
  root.querySelector('#scroll-today-btn')?.addEventListener('click', () => {
    document.getElementById('today-row')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // Auto scroll to today on first render
  setTimeout(() => {
    document.getElementById('today-row')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 200);
}

function updateStreaks(root, state) {
  const streakPills = root.querySelectorAll('.streak-pill');
  const habitsOrder = [...HABITS, 'mtech'];
  streakPills.forEach((pill, i) => {
    const habit = habitsOrder[i];
    if (!habit) return;
    const count = computeStreak(state, habit);
    const countEl = pill.querySelector('.streak-count');
    if (countEl) countEl.textContent = `${count}d`;
  });
}
