/**
 * SettingsPanel.js — GitHub Gist sync setup, PAT management, export/import
 */

import {
  storePAT, getPAT, storeGistId, getGistId,
  disconnectGist, isConnected, verifyConnection, pushGist
} from '../lib/githubSync.js';
import { exportState, importState } from '../lib/storage.js';

export function renderSettings(root, state, onSave, showToast, onClose) {
  const connected = isConnected();
  const pat = getPAT() ?? '';
  const gistId = getGistId() ?? '';

  root.innerHTML = `
    <div class="modal-header">
      <h2 class="modal-title">⚙️ Settings</h2>
      <button class="btn-icon" id="settings-close">✕</button>
    </div>

    <!-- GitHub Gist Sync -->
    <div style="margin-bottom:24px">
      <div style="font-size:0.85rem; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:var(--text-secondary); margin-bottom:12px">
        GitHub Gist Sync
      </div>

      <div style="background:rgba(251,191,36,0.08); border:1px solid rgba(251,191,36,0.2); border-radius:var(--radius-md); padding:12px 14px; margin-bottom:14px; font-size:0.8rem; color:var(--warning)">
        ⚠️ Your PAT is stored only in this browser's localStorage. It is never sent anywhere other than api.github.com.
      </div>

      ${connected ? `
        <div style="background:rgba(52,211,153,0.08); border:1px solid rgba(52,211,153,0.2); border-radius:var(--radius-md); padding:12px 14px; margin-bottom:14px">
          <div style="color:var(--success); font-size:0.875rem; font-weight:600; margin-bottom:4px">✅ Connected to GitHub Gist</div>
          <div style="color:var(--text-muted); font-size:0.78rem">Gist ID: <code style="font-family:var(--font-mono)">${gistId}</code></div>
        </div>
        <div style="display:flex; gap:8px">
          <button class="btn btn-primary btn-sm" id="sync-now-btn">🔄 Sync Now</button>
          <button class="btn btn-danger btn-sm" id="disconnect-btn">Disconnect</button>
        </div>
      ` : `
        <div class="input-group" style="margin-bottom:12px">
          <label class="input-label" for="pat-input">
            Personal Access Token 
            <a href="https://github.com/settings/tokens/new" target="_blank" style="color:var(--primary); font-size:0.75rem">(Create token ↗)</a>
          </label>
          <div style="position:relative">
            <input type="password" class="input" id="pat-input" placeholder="github_pat_…" value="${pat}" />
            <button class="btn-icon" id="pat-toggle" style="position:absolute; right:4px; top:50%; transform:translateY(-50%)">👁</button>
          </div>
          <div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px">
            Required scope: <code style="font-family:var(--font-mono)">gist</code> (fine-grained or classic)
          </div>
        </div>
        <div class="input-group" style="margin-bottom:14px">
          <label class="input-label" for="gist-id-input">
            Gist ID
            <a href="https://gist.github.com" target="_blank" style="color:var(--primary); font-size:0.75rem">(Create a secret gist ↗)</a>
          </label>
          <input type="text" class="input" id="gist-id-input" placeholder="abc123def456…" value="${gistId}" />
          <div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px">
            From the Gist URL: gist.github.com/username/<strong>THIS_PART</strong>
          </div>
        </div>
        <div id="connect-error" style="color:var(--danger); font-size:0.8rem; margin-bottom:10px; display:none"></div>
        <button class="btn btn-primary" id="connect-btn">🔗 Connect & Verify</button>
      `}
    </div>

    <div class="divider"></div>

    <!-- Export / Import -->
    <div style="margin-bottom:24px">
      <div style="font-size:0.85rem; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:var(--text-secondary); margin-bottom:12px">
        Export / Import Progress
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap">
        <button class="btn btn-secondary" id="export-btn">📥 Download progress.json</button>
        <label class="btn btn-secondary" for="import-file" style="cursor:pointer">📤 Import progress.json</label>
        <input type="file" id="import-file" accept=".json" style="display:none" />
      </div>
    </div>

    <div class="divider"></div>

    <!-- Danger Zone -->
    <div>
      <div style="font-size:0.85rem; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:var(--danger); margin-bottom:12px">
        Danger Zone
      </div>
      <button class="btn btn-danger" id="reset-btn">🗑 Reset All Progress</button>
    </div>
  `;

  // Close button
  root.querySelector('#settings-close')?.addEventListener('click', onClose);

  // PAT visibility toggle
  root.querySelector('#pat-toggle')?.addEventListener('click', () => {
    const input = root.querySelector('#pat-input');
    input.type = input.type === 'password' ? 'text' : 'password';
  });

  // Connect button
  root.querySelector('#connect-btn')?.addEventListener('click', async () => {
    const btn = root.querySelector('#connect-btn');
    const errEl = root.querySelector('#connect-error');
    const newPat = root.querySelector('#pat-input')?.value?.trim();
    const newGistId = root.querySelector('#gist-id-input')?.value?.trim();

    if (!newPat || !newGistId) {
      errEl.textContent = 'Both PAT and Gist ID are required.';
      errEl.style.display = 'block';
      return;
    }

    btn.textContent = '⏳ Verifying…';
    btn.disabled = true;
    errEl.style.display = 'none';

    const { valid, error } = await verifyConnection(newPat, newGistId);
    if (!valid) {
      errEl.textContent = error;
      errEl.style.display = 'block';
      btn.textContent = '🔗 Connect & Verify';
      btn.disabled = false;
      return;
    }

    storePAT(newPat);
    storeGistId(newGistId);
    showToast('GitHub Gist connected!', 'success');
    renderSettings(root, state, onSave, showToast, onClose);
  });

  // Sync now
  root.querySelector('#sync-now-btn')?.addEventListener('click', async () => {
    const btn = root.querySelector('#sync-now-btn');
    btn.textContent = '⏳ Syncing…';
    btn.disabled = true;
    const ok = await pushGist(state);
    btn.textContent = ok ? '✅ Synced' : '❌ Failed';
    setTimeout(() => {
      btn.textContent = '🔄 Sync Now';
      btn.disabled = false;
    }, 2000);
    if (ok) showToast('Progress synced to Gist!', 'success');
    else showToast('Gist sync failed', 'error');
  });

  // Disconnect
  root.querySelector('#disconnect-btn')?.addEventListener('click', () => {
    if (!confirm('Disconnect GitHub Gist? Your local progress will remain.')) return;
    disconnectGist();
    showToast('Disconnected from GitHub Gist', 'info');
    renderSettings(root, state, onSave, showToast, onClose);
  });

  // Export
  root.querySelector('#export-btn')?.addEventListener('click', () => {
    const json = exportState(state);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mastery-progress-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Progress downloaded!', 'success');
  });

  // Import
  root.querySelector('#import-file')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const newState = importState(ev.target.result);
        onSave(newState);
        showToast('Progress imported successfully!', 'success');
        onClose();
      } catch (err) {
        showToast(`Import failed: ${err.message}`, 'error');
      }
    };
    reader.readAsText(file);
  });

  // Reset
  root.querySelector('#reset-btn')?.addEventListener('click', () => {
    if (!confirm('⚠️ This will DELETE all your progress. This cannot be undone. Continue?')) return;
    if (!confirm('Are you absolutely sure? Type OK to confirm.', 'OK')) return;
    localStorage.removeItem('cpml-tracker:v1');
    showToast('All progress reset', 'info');
    onClose();
    location.reload();
  });
}
