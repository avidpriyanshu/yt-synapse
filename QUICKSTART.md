# ⚡ Quick Start (2 minutes)

## Installation

**One command, that's it:**

```bash
bash INSTALL.sh
```

This script will:
- ✓ Check for Node.js (install if missing)
- ✓ Install all dependencies
- ✓ Set up PM2 (background service manager)
- ✓ Start the service
- ✓ Enable auto-start on system boot

---

## Using the App

### 1. Open Obsidian
Go to the **99-Service-Controls** page

### 2. Control the Scraper
- **▶ Start Scraping** — Begin collecting YouTube videos
- **⏹ Stop Scraping** — Pause collection
- **📋 View Logs** — See what's happening

### 3. Check Status
- 🟢 **Running** — Actively scraping
- 🔴 **Stopped** — Not running
- 🔄 **Checking** — Checking status

---

## That's All!

Your service will:
- ✓ Run automatically when you restart your Mac
- ✓ Restart itself if it crashes
- ✓ Be fully controllable from Obsidian

No terminal commands needed anymore.

---

## Optional: Manual PM2 Commands

If you want to control it from terminal:

```bash
pm2 start yt-vault-service        # Start
pm2 stop yt-vault-service         # Stop
pm2 restart yt-vault-service      # Restart
pm2 logs yt-vault-service         # View live logs
pm2 monit                          # Monitor all processes
```

---

## Troubleshooting

**Service won't start?**
- Check logs: `pm2 logs yt-vault-service`
- Verify config: `cat logic-engine/config/config.json`

**Still having issues?**
- See SETUP_GUIDE.md for detailed configuration

