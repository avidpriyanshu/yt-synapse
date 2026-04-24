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
dv.container.innerHTML = `
<div style="padding: 1em; background-color: var(--background-secondary); border-radius: 0.5em; margin-bottom: 1em;">
  <label style="display: flex; align-items: center; cursor: pointer;">
    <input type="checkbox" id="auto-start-toggle" style="margin-right: 0.5em; width: 1.2em; height: 1.2em; cursor: pointer;">
    <span>Enable auto-start when vault opens</span>
  </label>
  <p style="font-size: 0.9em; color: var(--text-muted); margin-top: 0.5em;">
    If disabled, you can manually start scraping from the Service Controls page.
  </p>
</div>
`;

const toggle = document.getElementById('auto-start-toggle');
if (toggle) {
  // Load saved preference
  try {
    const settings = JSON.parse(localStorage.getItem('yt-vault-settings') || '{}');
    toggle.checked = settings.autoStartEnabled !== false;
  } catch (e) {
    toggle.checked = false;
  }

  toggle.addEventListener('change', () => {
    const settings = JSON.parse(localStorage.getItem('yt-vault-settings') || '{}');
    settings.autoStartEnabled = toggle.checked;
    localStorage.setItem('yt-vault-settings', JSON.stringify(settings));
  });
}
```

---

## Logging Preferences

### Logging Level

Choose how much detail you want to see when the scraper is running.

- **Summary:** See only major milestones (scrape started, completed, any errors)
- **Detailed:** See every action (video added, topic extracted, channels processed)

```dataviewjs
dv.container.innerHTML = `
<div style="padding: 1em; background-color: var(--background-secondary); border-radius: 0.5em; margin-bottom: 1em;">
  <div style="margin-bottom: 1em;">
    <label style="display: flex; align-items: center; margin-bottom: 0.5em; cursor: pointer;">
      <input type="radio" name="log-level" value="summary" style="margin-right: 0.5em; cursor: pointer;">
      <span><strong>Summary</strong> — Show overall progress and errors only</span>
    </label>
    <label style="display: flex; align-items: center; cursor: pointer;">
      <input type="radio" name="log-level" value="detailed" style="margin-right: 0.5em; cursor: pointer;">
      <span><strong>Detailed</strong> — Show every action the scraper takes</span>
    </label>
  </div>
  <p style="font-size: 0.9em; color: var(--text-muted); margin-top: 0.5em;">
    Detailed logging uses more disk space but helps understand what's happening.
  </p>
</div>
`;

const radioButtons = document.querySelectorAll('input[name="log-level"]');
radioButtons.forEach(btn => {
  // Load saved preference
  try {
    const settings = JSON.parse(localStorage.getItem('yt-vault-settings') || '{}');
    if (settings.logLevel === btn.value) {
      btn.checked = true;
    }
  } catch (e) {}

  btn.addEventListener('change', (e) => {
    if (e.target.checked) {
      const settings = JSON.parse(localStorage.getItem('yt-vault-settings') || '{}');
      settings.logLevel = e.target.value;
      localStorage.setItem('yt-vault-settings', JSON.stringify(settings));
    }
  });
});

// Set default if none selected
const checked = document.querySelector('input[name="log-level"]:checked');
if (!checked) {
  const summary = document.querySelector('input[name="log-level"][value="summary"]');
  if (summary) summary.checked = true;
}
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

The app uses your browser's local storage to remember your preferences. If you're using a private/incognito window, settings may not persist.

---

## Need Help?

For questions or issues, refer to the **Service Controls** page or check the latest logs to understand what's happening in your vault.

*Settings page — Last updated 2026-04-24*
