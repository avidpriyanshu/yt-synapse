---
title: Quick Start
type: settings
---

# Quick Start

Ready to start collecting videos? Click the button below.

```dataviewjs
(async () => {
  dv.container.innerHTML = `
  <div style="padding: 2em; background-color: var(--background-secondary); border-radius: 0.5em; text-align: center; margin-bottom: 2em;">
    <button id="start-btn" style="padding: 1.2em 2em; background-color: var(--interactive-accent); color: white; border: none; border-radius: 0.5em; cursor: pointer; font-size: 1.2em; font-weight: bold; margin-bottom: 1em;">
      ▶️ Start Scraping Now
    </button>
    <div id="status" style="margin-top: 1em; font-size: 0.95em; min-height: 3em;"></div>
  </div>
  `;

  const btn = document.getElementById('start-btn');
  const statusDiv = document.getElementById('status');

  async function checkService() {
    try {
      const res = await fetch('http://localhost:3000/health');
      return res.ok;
    } catch {
      return false;
    }
  }

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    statusDiv.innerHTML = '⏳ Starting...';

    try {
      const serviceRunning = await checkService();
      if (!serviceRunning) {
        statusDiv.innerHTML = '⚠️ Service not running. Start it from Service Controls first.';
        btn.disabled = false;
        return;
      }

      const res = await fetch('http://localhost:3000/start', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to start');
      
      const data = await res.json();
      statusDiv.innerHTML = `✓ <strong>Scraper started!</strong><br>PID: ${data.pid}<br><br>Videos will be added to your vault as they're found.`;
    } catch (err) {
      statusDiv.innerHTML = '✗ Error: ' + err.message;
      btn.disabled = false;
    }
  });

  // Show current status on load
  const running = await checkService();
  if (running) {
    const res = await fetch('http://localhost:3000/status');
    const status = await res.json();
    if (status.running) {
      statusDiv.innerHTML = `✓ <strong>Scraper is already running</strong><br>PID: ${status.pid}<br><br>Videos are being collected automatically.`;
      btn.innerHTML = '⏹️ Stop Scraping';
      btn.disabled = false;
    }
  }
})();
```

---

## What Happens Next

Once you click "Start Scraping":
- The system starts watching your clippings folder
- Any new videos you add (via web clipper or manually) are automatically processed
- Video pages are created in `videos/` folder
- Topics are auto-extracted and organized in `topics/` folder
- Channels are tracked in `channels/` folder

That's it! No manual work needed.

---

**Need Help?** Go to **Service Controls** to see logs and manage the scraper.
