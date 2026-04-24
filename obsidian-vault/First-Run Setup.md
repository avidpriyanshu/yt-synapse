---
title: First Run Setup
type: settings
---

# Welcome to YouTube Vault

Thank you for setting up YouTube Vault! This wizard will help you get started in just a few minutes.

## What Does YouTube Vault Do?

YouTube Vault is a system that automatically collects videos from your favorite YouTube channels and organizes them in your Obsidian vault. It creates beautiful note pages for each video, extracts key topics, and makes them searchable and browsable.

**You don't need to do anything manually** — the system runs in the background and adds videos as you browse.

---

## Step 1: What Are Your Channel Interests?

Which types of channels interest you most? You can add more channels anytime.

Select as many as you like:

```dataviewjs
dv.container.innerHTML = `
<div style="padding: 1em; background-color: var(--background-secondary); border-radius: 0.5em; margin-bottom: 1em;">
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1em;">
    <label style="display: flex; align-items: center; cursor: pointer;">
      <input type="checkbox" value="Technology" style="margin-right: 0.5em; width: 1.2em; height: 1.2em; cursor: pointer;">
      <span>🖥️ Technology</span>
    </label>
    <label style="display: flex; align-items: center; cursor: pointer;">
      <input type="checkbox" value="Education" style="margin-right: 0.5em; width: 1.2em; height: 1.2em; cursor: pointer;">
      <span>📚 Education</span>
    </label>
    <label style="display: flex; align-items: center; cursor: pointer;">
      <input type="checkbox" value="Science" style="margin-right: 0.5em; width: 1.2em; height: 1.2em; cursor: pointer;">
      <span>🔬 Science</span>
    </label>
    <label style="display: flex; align-items: center; cursor: pointer;">
      <input type="checkbox" value="Business" style="margin-right: 0.5em; width: 1.2em; height: 1.2em; cursor: pointer;">
      <span>💼 Business</span>
    </label>
    <label style="display: flex; align-items: center; cursor: pointer;">
      <input type="checkbox" value="Creative" style="margin-right: 0.5em; width: 1.2em; height: 1.2em; cursor: pointer;">
      <span>🎨 Creative</span>
    </label>
    <label style="display: flex; align-items: center; cursor: pointer;">
      <input type="checkbox" value="Entertainment" style="margin-right: 0.5em; width: 1.2em; height: 1.2em; cursor: pointer;">
      <span>🎬 Entertainment</span>
    </label>
    <label style="display: flex; align-items: center; cursor: pointer;">
      <input type="checkbox" value="Health" style="margin-right: 0.5em; width: 1.2em; height: 1.2em; cursor: pointer;">
      <span>💚 Health</span>
    </label>
    <label style="display: flex; align-items: center; cursor: pointer;">
      <input type="checkbox" value="Sports" style="margin-right: 0.5em; width: 1.2em; height: 1.2em; cursor: pointer;">
      <span>⚽ Sports</span>
    </label>
  </div>
</div>
`;

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(cb => {
  cb.addEventListener('change', () => {
    const selected = Array.from(checkboxes).filter(c => c.checked).map(c => c.value);
    localStorage.setItem('yt-vault-setup-interests', JSON.stringify(selected));
  });
});

// Load saved interests if any
try {
  const saved = JSON.parse(localStorage.getItem('yt-vault-setup-interests') || '[]');
  saved.forEach(interest => {
    const cb = Array.from(checkboxes).find(c => c.value === interest);
    if (cb) cb.checked = true;
  });
} catch (e) {}
```

---

## Step 2: How Much Detail Do You Want to See?

When the scraper runs, how much information should it show you?

```dataviewjs
(async () => {
  dv.container.innerHTML = `
  <div style="padding: 1em; background-color: var(--background-secondary); border-radius: 0.5em; margin-bottom: 1em;">
    <div style="margin-bottom: 1.5em;">
      <label style="display: flex; align-items: flex-start; margin-bottom: 1em; cursor: pointer;">
        <input type="radio" name="log-preference" value="INFO" style="margin-right: 0.5em; margin-top: 0.15em; cursor: pointer;">
        <div>
          <strong>Summary</strong> (Recommended)
          <p style="font-size: 0.9em; color: var(--text-muted); margin: 0.25em 0 0 0;">
            Shows overall progress — how many videos were added, if any errors happened, that's it.
          </p>
        </div>
      </label>
      <label style="display: flex; align-items: flex-start; cursor: pointer;">
        <input type="radio" name="log-preference" value="VERBOSE" style="margin-right: 0.5em; margin-top: 0.15em; cursor: pointer;">
        <div>
          <strong>Detailed</strong>
          <p style="font-size: 0.9em; color: var(--text-muted); margin: 0.25em 0 0 0;">
            Shows every action — each video added, topics extracted, channels processed. Useful for understanding what's happening.
          </p>
        </div>
      </label>
    </div>
  </div>
  `;

  const logRadios = document.querySelectorAll('input[name="log-preference"]');
  
  try {
    const res = await fetch('http://localhost:3000/config');
    if (res.ok) {
      const config = await res.json();
      const level = config.loggingLevel || 'INFO';
      const radio = Array.from(logRadios).find(r => r.value === level);
      if (radio) radio.checked = true;
    }
  } catch (e) {
    const summaryRadio = Array.from(logRadios).find(r => r.value === 'INFO');
    if (summaryRadio) summaryRadio.checked = true;
  }
})();
```

---

## Step 3: Should the Scraper Start Automatically?

Would you like the scraper to automatically start checking for new videos when you open your vault?

```dataviewjs
(async () => {
  dv.container.innerHTML = `
  <div style="padding: 1em; background-color: var(--background-secondary); border-radius: 0.5em; margin-bottom: 1em;">
    <div style="margin-bottom: 1.5em;">
      <label style="display: flex; align-items: flex-start; margin-bottom: 1em; cursor: pointer;">
        <input type="radio" name="auto-start-pref" value="yes" style="margin-right: 0.5em; margin-top: 0.15em; cursor: pointer;">
        <div>
          <strong>Yes, start automatically</strong> (Recommended)
          <p style="font-size: 0.9em; color: var(--text-muted); margin: 0.25em 0 0 0;">
            The scraper begins checking for new videos as soon as you open your vault. Most convenient.
          </p>
        </div>
      </label>
      <label style="display: flex; align-items: flex-start; cursor: pointer;">
        <input type="radio" name="auto-start-pref" value="no" style="margin-right: 0.5em; margin-top: 0.15em; cursor: pointer;">
        <div>
          <strong>No, I'll start it manually</strong>
          <p style="font-size: 0.9em; color: var(--text-muted); margin: 0.25em 0 0 0;">
            You control when scraping happens using the Start button on the Service Controls page.
          </p>
        </div>
      </label>
    </div>
  </div>
  `;

  const autoStartRadios = document.querySelectorAll('input[name="auto-start-pref"]');
  
  try {
    const res = await fetch('http://localhost:3000/config');
    if (res.ok) {
      const config = await res.json();
      const saved = config.autoStartScraper !== false;
      const radio = Array.from(autoStartRadios).find(r => r.value === (saved ? 'yes' : 'no'));
      if (radio) radio.checked = true;
    }
  } catch (e) {
    const yesRadio = Array.from(autoStartRadios).find(r => r.value === 'yes');
    if (yesRadio) yesRadio.checked = true;
  }
})();
```

---

## You're All Set! ✓

Your YouTube Vault is now configured and ready to use.

```dataviewjs
(async () => {
  dv.container.innerHTML = `
  <div style="padding: 1em; background-color: var(--background-secondary); border-radius: 0.5em; margin-bottom: 1em;">
    <button id="complete-setup-btn" style="padding: 0.8em 1.5em; background-color: var(--interactive-accent); color: white; border: none; border-radius: 0.3em; cursor: pointer; font-size: 1em; font-weight: bold;">
      Complete Setup
    </button>
    <div id="setup-status" style="margin-top: 1em; font-size: 0.95em;"></div>
  </div>
  `;

  const btn = document.getElementById('complete-setup-btn');
  const statusDiv = document.getElementById('setup-status');

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    statusDiv.textContent = 'Saving settings...';

    try {
      const logLevel = document.querySelector('input[name="log-preference"]:checked')?.value || 'INFO';
      const autoStart = document.querySelector('input[name="auto-start-pref"]:checked')?.value === 'yes';

      // Save logging level
      let res = await fetch('http://localhost:3000/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loggingLevel: logLevel })
      });
      if (!res.ok) throw new Error('Failed to save logging level');

      // Save autostart setting
      res = await fetch('http://localhost:3000/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoStartScraper: autoStart })
      });
      if (!res.ok) throw new Error('Failed to save autostart setting');

      // If autostart is enabled, start scraper now
      if (autoStart) {
        res = await fetch('http://localhost:3000/start', { method: 'POST' });
        if (res.ok) {
          statusDiv.innerHTML = '✓ <strong>Setup complete!</strong> Your scraper is now running. Go to <strong>Service Controls</strong> to manage it.';
          statusDiv.style.color = 'var(--text-success)';
        } else {
          statusDiv.innerHTML = '✓ <strong>Setup complete!</strong> Go to <strong>Service Controls</strong> to start scraping.';
          statusDiv.style.color = 'var(--text-success)';
        }
      } else {
        statusDiv.innerHTML = '✓ <strong>Setup complete!</strong> Go to <strong>Service Controls</strong> when you\'re ready to start scraping.';
        statusDiv.style.color = 'var(--text-success)';
      }

      btn.style.display = 'none';
    } catch (err) {
      statusDiv.textContent = '✗ Error: ' + err.message;
      statusDiv.style.color = 'var(--text-error)';
      btn.disabled = false;
    }
  });
})();
```

### Next Steps

1. **Click "Complete Setup"** above to apply your preferences
2. **Go to Service Controls** — See controls for starting and stopping your scraper
3. **Watch videos appear** — Your vault will automatically populate with video notes, topics, and channel pages
4. **Adjust settings anytime** — Come back to the Settings page to change your preferences

### Where to Find Everything

- **Service Controls:** Use to start/stop scraper and view logs
- **Settings:** Adjust preferences for auto-start, logging, and categories
- **Videos:** All videos are stored in the `videos/` folder
- **Topics:** Auto-generated topic pages in the `topics/` folder
- **Channels:** Auto-generated channel pages in the `channels/` folder

### Need Help?

Every message you see should be in plain English. If you encounter something confusing or technical-sounding, that's a bug — please let us know!

---

**Setup completed:** 2026-04-24

Ready to start? Go to **Service Controls** to begin!
