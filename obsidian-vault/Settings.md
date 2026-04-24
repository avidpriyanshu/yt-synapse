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

---

## Need Help?

- **Quick Start:** Click the button in the **Quick-Start** page
- **Manual Control:** Use **Service Controls** to start/stop scraping and view logs
- **Logs:** Check `.planning/logs/` to see what the scraper is doing

*Settings page — Last updated 2026-04-24*
