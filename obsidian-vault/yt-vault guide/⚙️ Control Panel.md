---
title: Service Controls
type: settings
---

# Service Controls

> Non-technical users can start, stop, and monitor the YouTube vault scraper from this page.

## Controls

```dataviewjs
// Service Control Panel
dv.container.innerHTML = `
<div style="padding: 1em; border: 1px solid var(--background-modifier-border); border-radius: 0.5em; background-color: var(--background-secondary);">
  
  <div style="margin-bottom: 1.5em; padding: 1em; background-color: var(--background-tertiary); border-radius: 0.5em; border-left: 4px solid var(--interactive-accent);">
    <div style="font-size: 0.9em; color: var(--text-muted); margin-bottom: 0.5em;">SCRAPER STATUS</div>
    <div style="font-size: 1.2em; margin-bottom: 0.5em;">
      <span id="status-indicator" style="font-weight: bold;">🔄 Checking...</span>
    </div>
    <div style="font-size: 0.85em; color: var(--text-muted);">
      Last update: <span id="last-check">--:--:--</span>
    </div>
  </div>
  
  <div style="margin-bottom: 1em;">
    <button id="btn-start" style="padding: 0.5em 1em; margin-right: 0.5em; cursor: pointer; background: var(--interactive-accent); color: white; border: none; border-radius: 0.3em; font-weight: bold;">
      ▶ Start Scraping
    </button>
    <button id="btn-stop" style="padding: 0.5em 1em; margin-right: 0.5em; cursor: pointer; background: var(--background-modifier-error); color: white; border: none; border-radius: 0.3em; font-weight: bold;">
      ⏹ Stop Scraping
    </button>
    <button id="btn-logs" style="padding: 0.5em 1em; cursor: pointer; background: var(--interactive-normal); color: white; border: none; border-radius: 0.3em; font-weight: bold;">
      📋 View Logs
    </button>
  </div>
  
  <div id="message" style="padding: 0.5em; border-radius: 0.3em; margin-top: 0.5em; display: none; font-weight: bold;"></div>
  
  <div id="logs-container" style="display: none; margin-top: 1em; padding: 1em; background-color: var(--background-tertiary); border-radius: 0.5em; max-height: 400px; overflow-y: auto; font-family: monospace; font-size: 0.9em; white-space: pre-wrap; word-wrap: break-word;"></div>
  
</div>
`;

const SERVICE_API = 'http://localhost:3000';
const statusIndicator = dv.container.querySelector('#status-indicator');
const lastCheckTime = dv.container.querySelector('#last-check');
const messageDiv = dv.container.querySelector('#message');
const logsContainer = dv.container.querySelector('#logs-container');

function updateTime() {
  const now = new Date();
  lastCheckTime.textContent = now.toLocaleTimeString();
}

async function checkStatus() {
  try {
    const res = await fetch(`${SERVICE_API}/status`);
    const data = await res.json();
    
    if (data.running) {
      statusIndicator.textContent = '🟢 Running (PID: ' + data.pid + ')';
      statusIndicator.style.color = 'var(--interactive-accent)';
    } else {
      statusIndicator.textContent = '🔴 Stopped';
      statusIndicator.style.color = 'var(--text-muted)';
    }
    updateTime();
  } catch (err) {
    statusIndicator.textContent = '⚠️ Service unavailable';
    statusIndicator.style.color = 'var(--background-modifier-error)';
  }
}

async function startScraper() {
  try {
    const res = await fetch(`${SERVICE_API}/start`, { method: 'POST' });
    const data = await res.json();
    
    if (data.status === 'started' || data.status === 'already-running') {
      showMessage('✓ Scraper started', 'success');
    } else {
      showMessage('✗ Failed to start scraper: ' + data.message, 'error');
    }
    checkStatus();
  } catch (err) {
    showMessage('✗ Error: ' + err.message, 'error');
  }
}

async function stopScraper() {
  try {
    const res = await fetch(`${SERVICE_API}/stop`, { method: 'POST' });
    const data = await res.json();
    
    if (data.status === 'stopped') {
      showMessage('✓ Scraper stopped', 'success');
    } else {
      showMessage('✗ Scraper not running', 'error');
    }
    checkStatus();
  } catch (err) {
    showMessage('✗ Error: ' + err.message, 'error');
  }
}

async function viewLogs() {
  try {
    const res = await fetch(`${SERVICE_API}/logs`);
    const data = await res.json();
    
    logsContainer.style.display = logsContainer.style.display === 'none' ? 'block' : 'none';
    if (logsContainer.style.display === 'block') {
      logsContainer.textContent = data.content || 'No logs yet';
      logsContainer.scrollTop = logsContainer.scrollHeight;
    }
  } catch (err) {
    showMessage('✗ Error loading logs: ' + err.message, 'error');
  }
}

function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.style.display = 'block';
  messageDiv.style.backgroundColor = type === 'success' ? 'var(--background-modifier-success)' : 'var(--background-modifier-error)';
  messageDiv.style.color = type === 'success' ? 'var(--text-muted)' : 'white';
  
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 3000);
}

// Attach event listeners (use dv.container for correct context)
const btnStart = dv.container.querySelector('#btn-start');
const btnStop = dv.container.querySelector('#btn-stop');
const btnLogs = dv.container.querySelector('#btn-logs');

if (btnStart) btnStart.addEventListener('click', startScraper);
if (btnStop) btnStop.addEventListener('click', stopScraper);
if (btnLogs) btnLogs.addEventListener('click', viewLogs);

// Check config and auto-start if enabled
async function initializeAutoStart() {
  try {
    const res = await fetch(`${SERVICE_API}/config`);
    const config = await res.json();
    
    if (config.autoStartScraper === true) {
      // Give a small delay to ensure service is ready
      setTimeout(() => {
        checkStatus();
        setTimeout(() => {
          const status = dv.container.querySelector('#status-indicator');
          if (status && status.textContent.includes('Stopped')) {
            startScraper();
          }
        }, 500);
      }, 1000);
    } else {
      checkStatus();
    }
  } catch (err) {
    // Fallback: just check status if config fetch fails
    checkStatus();
  }
}

// Initial setup and periodic updates
initializeAutoStart();
setInterval(checkStatus, 2000);
```

## Settings

```dataviewjs
dv.container.innerHTML = `
<div style="padding: 1em; border: 1px solid var(--background-modifier-border); border-radius: 0.5em; background-color: var(--background-secondary);">
  
  <div style="margin-bottom: 1em;">
    <div style="font-size: 0.9em; color: var(--text-muted); margin-bottom: 0.5em; font-weight: bold;">AUTO-START SCRAPER</div>
    <label style="display: flex; align-items: center; cursor: pointer;">
      <input id="setting-autostart" type="checkbox" style="margin-right: 0.5em;" />
      <span>Automatically start scraper when vault opens</span>
    </label>
  </div>
  
  <div style="margin-bottom: 1em;">
    <div style="font-size: 0.9em; color: var(--text-muted); margin-bottom: 0.3em; font-weight: bold;">LOGGING LEVEL</div>
    <select id="setting-loglevel" style="padding: 0.3em 0.5em; border: 1px solid var(--background-modifier-border); border-radius: 0.3em; background-color: var(--background-tertiary);">
      <option value="INFO">INFO (standard)</option>
      <option value="WARN">WARN (non-blocking)</option>
      <option value="ERROR">ERROR (failures)</option>
    </select>
  </div>
  
  <div style="margin-bottom: 1.5em;">
    <div style="font-size: 0.9em; color: var(--text-muted); margin-bottom: 0.3em; font-weight: bold;">VIDEOS PER BATCH</div>
    <input id="setting-batchsize" type="number" min="1" max="50" style="padding: 0.3em 0.5em; border: 1px solid var(--background-modifier-border); border-radius: 0.3em; background-color: var(--background-tertiary); width: 80px;" />
    <span style="font-size: 0.8em; color: var(--text-muted); margin-left: 0.5em;">max videos to process per channel</span>
  </div>
  
  <div>
    <button id="btn-save-settings" style="padding: 0.5em 1em; cursor: pointer; background: var(--interactive-accent); color: white; border: none; border-radius: 0.3em; font-weight: bold;">
      💾 Save Settings
    </button>
  </div>
  
  <div id="settings-message" style="padding: 0.5em; border-radius: 0.3em; margin-top: 0.5em; display: none; font-weight: bold;"></div>
  
</div>
`;

const SERVICE_API = 'http://localhost:3000';
const autostartInput = dv.container.querySelector('#setting-autostart');
const loglevelSelect = dv.container.querySelector('#setting-loglevel');
const batchsizeInput = dv.container.querySelector('#setting-batchsize');
const saveBtn = dv.container.querySelector('#btn-save-settings');
const settingsMsg = dv.container.querySelector('#settings-message');

function showSettingsMessage(text, type) {
  settingsMsg.textContent = text;
  settingsMsg.style.display = 'block';
  settingsMsg.style.backgroundColor = type === 'success' ? 'var(--background-modifier-success)' : 'var(--background-modifier-error)';
  settingsMsg.style.color = type === 'success' ? 'var(--text-muted)' : 'white';
  
  setTimeout(() => {
    settingsMsg.style.display = 'none';
  }, 3000);
}

async function loadSettings() {
  try {
    const res = await fetch(`${SERVICE_API}/config`);
    const config = await res.json();
    
    autostartInput.checked = config.autoStartScraper === true;
    loglevelSelect.value = config.loggingLevel || 'INFO';
    batchsizeInput.value = config.videoBatchSize || 15;
  } catch (err) {
    showSettingsMessage('Error loading settings: ' + err.message, 'error');
  }
}

async function saveSettings() {
  try {
    const updates = {
      autoStartScraper: autostartInput.checked,
      loggingLevel: loglevelSelect.value,
      videoBatchSize: parseInt(batchsizeInput.value, 10) || 15
    };
    
    const res = await fetch(`${SERVICE_API}/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    const data = await res.json();
    if (data.ok) {
      showSettingsMessage('✓ Settings saved', 'success');
    } else {
      showSettingsMessage('✗ Failed to save: ' + (data.error || 'unknown error'), 'error');
    }
  } catch (err) {
    showSettingsMessage('✗ Error: ' + err.message, 'error');
  }
}

if (saveBtn) saveBtn.addEventListener('click', saveSettings);
loadSettings();
```


## Topic Filters

Exclude words from being extracted as topics. Add words to prevent generic or irrelevant topics like "minutes", "first", "experience" from appearing in your vault.

```dataviewjs
dv.container.innerHTML = `
<div style="padding: 1em; border: 1px solid var(--background-modifier-border); border-radius: 0.5em; background-color: var(--background-secondary);">
  
  <div style="margin-bottom: 1em;">
    <div style="font-size: 0.9em; color: var(--text-muted); margin-bottom: 0.5em; font-weight: bold;">BLOCKED WORDS</div>
    <div id="blacklist-tags" style="display: flex; flex-wrap: wrap; gap: 0.3em; margin-bottom: 1em; min-height: 2em;">
      <span style="color: var(--text-muted); font-style: italic;">Loading...</span>
    </div>
  </div>
  
  <div style="display: flex; gap: 0.5em; margin-bottom: 1em;">
    <input id="new-word-input" type="text" placeholder="Type a word to block" style="padding: 0.3em 0.5em; border: 1px solid var(--background-modifier-border); border-radius: 0.3em; background-color: var(--background-tertiary); flex: 1;" />
    <button id="btn-add-word" style="padding: 0.3em 0.8em; cursor: pointer; background: var(--interactive-accent); color: white; border: none; border-radius: 0.3em; font-weight: bold;">+ Add</button>
  </div>
  
  <div id="blacklist-message" style="padding: 0.5em; border-radius: 0.3em; display: none; font-weight: bold;"></div>
  
</div>
`;

const SERVICE_API = 'http://localhost:3000';
const blacklistTagsDiv = dv.container.querySelector('#blacklist-tags');
const newWordInput = dv.container.querySelector('#new-word-input');
const addWordBtn = dv.container.querySelector('#btn-add-word');
const blacklistMsg = dv.container.querySelector('#blacklist-message');

function showBlacklistMessage(text, type) {
  blacklistMsg.textContent = text;
  blacklistMsg.style.display = 'block';
  blacklistMsg.style.backgroundColor = type === 'success' ? 'var(--background-modifier-success)' : 'var(--background-modifier-error)';
  blacklistMsg.style.color = type === 'success' ? 'var(--text-muted)' : 'white';
  
  setTimeout(() => {
    blacklistMsg.style.display = 'none';
  }, 3000);
}

async function loadBlacklist() {
  try {
    const res = await fetch(`${SERVICE_API}/blacklist`);
    const data = await res.json();
    
    if (data.ok && data.words && data.words.length > 0) {
      blacklistTagsDiv.innerHTML = data.words.map(word => `
        <span style="display: inline-flex; align-items: center; gap: 0.3em; padding: 0.2em 0.5em; background: var(--background-tertiary); border-radius: 0.3em; font-size: 0.9em;">
          ${word}
          <button onclick="removeWord('${word}')" style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 0; margin: 0; font-weight: bold;">×</button>
        </span>
      `).join('');
    } else {
      blacklistTagsDiv.innerHTML = '<span style="color: var(--text-muted); font-style: italic;">No words blocked yet</span>';
    }
  } catch (err) {
    blacklistTagsDiv.innerHTML = '<span style="color: var(--background-modifier-error);">Error loading blacklist</span>';
  }
}

async function removeWord(word) {
  try {
    const res = await fetch(`${SERVICE_API}/blacklist/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word })
    });
    
    const data = await res.json();
    if (data.ok) {
      showBlacklistMessage(`✓ Removed "${word}"`, 'success');
      loadBlacklist();
    } else {
      showBlacklistMessage('✗ Failed to remove: ' + (data.error || 'unknown error'), 'error');
    }
  } catch (err) {
    showBlacklistMessage('✗ Error: ' + err.message, 'error');
  }
}

async function addWord() {
  const word = newWordInput.value.trim();
  if (!word) {
    showBlacklistMessage('Enter a word first', 'error');
    return;
  }
  
  try {
    const res = await fetch(`${SERVICE_API}/blacklist/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word })
    });
    
    const data = await res.json();
    if (data.ok) {
      newWordInput.value = '';
      showBlacklistMessage(`✓ Added "${word}" to blacklist`, 'success');
      loadBlacklist();
    } else {
      showBlacklistMessage('✗ Failed to add: ' + (data.error || 'unknown error'), 'error');
    }
  } catch (err) {
    showBlacklistMessage('✗ Error: ' + err.message, 'error');
  }
}

if (addWordBtn) {
  addWordBtn.addEventListener('click', addWord);
  newWordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addWord();
  });
}

loadBlacklist();
```

## Recent Topics

```dataviewjs
dv.container.innerHTML = `
<div style="padding: 1em; border: 1px solid var(--background-modifier-border); border-radius: 0.5em; background-color: var(--background-secondary);">
  
  <div style="margin-bottom: 1em; font-size: 0.9em; color: var(--text-muted); font-weight: bold;">TOPICS FROM LAST 24 HOURS</div>
  
  <div id="topics-loading" style="text-align: center; padding: 1em; color: var(--text-muted);">Loading topics...</div>
  <div id="topics-container" style="display: none;"></div>
  <div id="topics-empty" style="display: none; padding: 1em; text-align: center; color: var(--text-muted);">No topics yet</div>
  <div id="topics-error" style="display: none; padding: 1em; color: var(--background-modifier-error); font-weight: bold;"></div>
  
</div>
`;

const SERVICE_API = 'http://localhost:3000';
const loadingDiv = dv.container.querySelector('#topics-loading');
const containerDiv = dv.container.querySelector('#topics-container');
const emptyDiv = dv.container.querySelector('#topics-empty');
const errorDiv = dv.container.querySelector('#topics-error');

async function loadTopics() {
  try {
    const res = await fetch(SERVICE_API + '/topics/recent');
    const data = await res.json();
    
    if (!data.ok || !data.topics || data.topics.length === 0) {
      loadingDiv.style.display = 'none';
      emptyDiv.style.display = 'block';
      return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 0.5em;">';
    data.topics.forEach(t => {
      const bgColor = t.qualityScore === 'HIGH' ? '#4a8a2e' : t.qualityScore === 'MED' ? '#8a7a2e' : '#8a2e2e';
      const label = t.videoCount + ' video' + (t.videoCount !== 1 ? 's' : '');
      html += '<div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5em; background-color: ' + bgColor + '; color: white; border-radius: 0.3em; font-size: 0.9em;">';
      html += '<span><strong>' + t.name + '</strong> (' + label + ')</span>';
      html += '<button data-topic="' + t.name + '" class="blacklist-btn" style="padding: 0.3em 0.6em; background: rgba(255,255,255,0.2); color: white; border: none; border-radius: 0.2em; cursor: pointer; font-size: 0.85em;">Block</button>';
      html += '</div>';
    });
    html += '</div>';
    
    containerDiv.innerHTML = html;
    loadingDiv.style.display = 'none';
    containerDiv.style.display = 'block';
    
    dv.container.querySelectorAll('.blacklist-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const topic = e.target.getAttribute('data-topic');
        try {
          const res = await fetch(SERVICE_API + '/blacklist/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ word: topic })
          });
          if ((await res.json()).ok) {
            e.target.parentElement.style.opacity = '0.5';
            e.target.textContent = '✓ Blocked';
            e.target.disabled = true;
          }
        } catch (err) {
          console.error('Failed to blacklist:', err);
        }
      });
    });
  } catch (err) {
    loadingDiv.style.display = 'none';
    errorDiv.style.display = 'block';
    errorDiv.textContent = '✗ Error loading topics: ' + err.message;
  }
}

loadTopics();
```

## Advanced

```dataviewjs
dv.container.innerHTML = `
<div style="padding: 1em; border: 1px solid var(--background-modifier-border); border-radius: 0.5em; background-color: var(--background-secondary);">
  
  <div style="margin-bottom: 1em;">
    <div style="font-size: 0.9em; color: var(--text-muted); margin-bottom: 0.5em; font-weight: bold;">RESET PROCESSING HISTORY</div>
    <p style="font-size: 0.85em; color: var(--text-muted); margin-bottom: 0.8em;">Clear the scraper's memory of processed videos. This will cause all videos to be re-scraped and new clippings created. A backup will be saved.</p>
    <button id="btn-reset-history" style="padding: 0.5em 1em; cursor: pointer; background: var(--background-modifier-error); color: white; border: none; border-radius: 0.3em; font-weight: bold;">
      🔄 Reset History
    </button>
  </div>
  
  <div id="reset-message" style="padding: 0.5em; border-radius: 0.3em; margin-top: 0.5em; display: none; font-weight: bold;"></div>
  
</div>
`;

const SERVICE_API = 'http://localhost:3000';
const resetBtn = dv.container.querySelector('#btn-reset-history');
const resetMsg = dv.container.querySelector('#reset-message');

function showResetMessage(text, type) {
  resetMsg.textContent = text;
  resetMsg.style.display = 'block';
  resetMsg.style.backgroundColor = type === 'success' ? 'var(--background-modifier-success)' : 'var(--background-modifier-error)';
  resetMsg.style.color = type === 'success' ? 'var(--text-muted)' : 'white';
  
  setTimeout(() => {
    resetMsg.style.display = 'none';
  }, 4000);
}

async function resetHistory() {
  if (!confirm('Are you sure? This will mark all videos for re-scraping.')) {
    return;
  }
  
  try {
    const res = await fetch(SERVICE_API + '/history/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await res.json();
    if (data.ok) {
      showResetMessage('✓ ' + data.message, 'success');
      resetBtn.disabled = true;
      resetBtn.textContent = '✓ History Reset';
    } else {
      showResetMessage('✗ Failed: ' + (data.error || 'unknown error'), 'error');
    }
  } catch (err) {
    showResetMessage('✗ Error: ' + err.message, 'error');
  }
}

if (resetBtn) {
  resetBtn.addEventListener('click', resetHistory);
}
```

---

## How It Works

1. **Start** — Spawns a new Node.js process running the scraper pipeline
2. **Stop** — Terminates the running scraper process gracefully
3. **View Logs** — Displays today's timestamped log file
4. **Status** — Auto-updates every 2 seconds showing if scraper is running
5. **Settings** — Change scraper behavior (auto-start, logging verbosity, batch size)

Logs are saved to `.planning/logs/run-YYYY-MM-DD.log` with one entry per successful/failed video.
