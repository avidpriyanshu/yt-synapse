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

## Auto-Start Configuration

See `config.json` in logic-engine to enable auto-start on vault open:

```json
{
  "autoStartScraper": false
}
```

Set to `true` to automatically start scraper when vault opens.

---

## How It Works

1. **Start** — Spawns a new Node.js process running the scraper pipeline
2. **Stop** — Terminates the running scraper process gracefully
3. **View Logs** — Displays today's timestamped log file
4. **Status** — Auto-updates every 2 seconds showing if scraper is running

Logs are saved to `.planning/logs/run-YYYY-MM-DD.log` with one entry per successful/failed video.
