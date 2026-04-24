---
title: Settings
type: settings
---

# Settings

> Configure YouTube Vault for your preferences. No technical knowledge required.

## Scraper Settings

### Enable Auto-Start

When you open your vault, should the scraper automatically begin collecting new videos?

- **Enabled:** Scraper starts automatically (recommended for hands-off use)
- **Disabled:** You control when scraping begins via the Start button

```dataviewjs
(async () => {
  dv.container.innerHTML = `
  <div style="padding: 1em; background-color: var(--background-secondary); border-radius: 0.5em; margin-bottom: 1em;">
    <label style="display: flex; align-items: center; cursor: pointer;">
      <input type="checkbox" id="auto-start-toggle" style="margin-right: 0.5em; width: 1.2em; height: 1.2em; cursor: pointer;">
      <span>Enable auto-start when vault opens</span>
    </label>
    <p style="font-size: 0.9em; color: var(--text-muted); margin-top: 0.5em;">
      If disabled, you can manually start scraping from the Service Controls page.
    </p>
    <div id="status-msg" style="margin-top: 0.5em; font-size: 0.85em;"></div>
  </div>
  `;

  const toggle = document.getElementById('auto-start-toggle');
  const statusMsg = document.getElementById('status-msg');
  
  async function loadSettings() {
    try {
      const res = await fetch('http://localhost:3000/config');
      if (!res.ok) throw new Error('Service error');
      const config = await res.json();
      toggle.checked = config.autoStartScraper || false;
      statusMsg.textContent = '';
    } catch (err) {
      statusMsg.textContent = '⚠️ Service not running — start it from Service Controls first';
      statusMsg.style.color = 'var(--text-error)';
    }
  }

  async function saveSettings() {
    try {
      const res = await fetch('http://localhost:3000/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoStartScraper: toggle.checked })
      });
      if (!res.ok) throw new Error('Save failed');
      statusMsg.textContent = '✓ Saved';
      statusMsg.style.color = 'var(--text-success)';
      setTimeout(() => { statusMsg.textContent = ''; }, 2000);
    } catch (err) {
      statusMsg.textContent = '✗ Failed to save';
      statusMsg.style.color = 'var(--text-error)';
    }
  }

  await loadSettings();
  toggle.addEventListener('change', saveSettings);
})();
```

---

## Logging Preferences

### Logging Level

Choose how much detail you want to see when the scraper is running.

- **Summary:** See only major milestones (scrape started, completed, any errors)
- **Detailed:** See every action (video added, topic extracted, channels processed)

```dataviewjs
(async () => {
  dv.container.innerHTML = `
  <div style="padding: 1em; background-color: var(--background-secondary); border-radius: 0.5em; margin-bottom: 1em;">
    <div style="margin-bottom: 1em;">
      <label style="display: flex; align-items: center; margin-bottom: 0.5em; cursor: pointer;">
        <input type="radio" name="log-level" value="INFO" style="margin-right: 0.5em; cursor: pointer;">
        <span><strong>Summary</strong> — Show overall progress and errors only</span>
      </label>
      <label style="display: flex; align-items: center; cursor: pointer;">
        <input type="radio" name="log-level" value="VERBOSE" style="margin-right: 0.5em; cursor: pointer;">
        <span><strong>Detailed</strong> — Show every action the scraper takes</span>
      </label>
    </div>
    <p style="font-size: 0.9em; color: var(--text-muted); margin-top: 0.5em;">
      Detailed logging uses more disk space but helps understand what's happening.
    </p>
    <div id="log-status-msg" style="margin-top: 0.5em; font-size: 0.85em;"></div>
  </div>
  `;

  const radioButtons = document.querySelectorAll('input[name="log-level"]');
  const statusMsg = document.getElementById('log-status-msg');

  async function loadLoggingLevel() {
    try {
      const res = await fetch('http://localhost:3000/config');
      if (!res.ok) throw new Error('Service error');
      const config = await res.json();
      const level = config.loggingLevel || 'INFO';
      const btn = document.querySelector(`input[name="log-level"][value="${level}"]`);
      if (btn) btn.checked = true;
    } catch (err) {
      const summary = document.querySelector('input[name="log-level"][value="INFO"]');
      if (summary) summary.checked = true;
    }
  }

  async function saveLoggingLevel(level) {
    try {
      const res = await fetch('http://localhost:3000/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loggingLevel: level })
      });
      if (!res.ok) throw new Error('Save failed');
      statusMsg.textContent = '✓ Saved';
      statusMsg.style.color = 'var(--text-success)';
      setTimeout(() => { statusMsg.textContent = ''; }, 2000);
    } catch (err) {
      statusMsg.textContent = '✗ Failed to save';
      statusMsg.style.color = 'var(--text-error)';
    }
  }

  await loadLoggingLevel();
  
  radioButtons.forEach(btn => {
    btn.addEventListener('change', (e) => {
      if (e.target.checked) {
        saveLoggingLevel(e.target.value);
      }
    });
  });
})();
```

---

## Channel Tagging Preferences

### Suggested Categories

When adding new videos, the system can suggest categories for their channels. Edit the list below to match your interests:

```
Technology
Education
Science
Business
Entertainment
News
Health
Creative
Sports
Other
```

**How it works:** When a new video is added from a channel, you're suggested one of these categories to assign to that channel. This helps organize your vault.

---

## Data Management

### View Logs

See what the scraper has been doing. Logs are saved daily and include:
- Videos successfully added
- Topics extracted
- Channels processed
- Any errors encountered

**Latest log location:** `.planning/logs/run-YYYY-MM-DD.log`

You can view the most recent logs from the **Service Controls** page using the "View Logs" button.

### Reset Data

**Warning:** These actions cannot be undone.

- **Clear all videos:** Removes all video notes from your vault. You can start fresh by running the scraper again.
- **Clear all log files:** Deletes the history of what the scraper has done. Start fresh logging.

> To perform a reset, please refer to the **Service Controls** page or contact support.

---

## Troubleshooting

### The scraper isn't starting

1. Check that you have internet access
2. Try stopping the scraper first, then starting it again
3. Check the logs to see what went wrong

### I don't understand a log message

Every log message should be written in plain English. If you see technical jargon or error codes, that's a bug. Please let us know!

### Settings aren't being saved

Make sure the service is running (start it from the Service Controls page). Your settings are saved to the backend config, so if the service isn't running, changes can't be persisted.

---

## Need Help?

For questions or issues, refer to the **Service Controls** page or check the latest logs to understand what's happening in your vault.

*Settings page — Last updated 2026-04-24*
