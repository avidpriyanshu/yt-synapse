# Deployment — YouTube Vault

**Simple 3-step deployment for anyone.**

---

## Quick Start (2 minutes)

### Step 1: Get Code
```bash
git clone https://github.com/YOUR_REPO/yt-vault.git
cd yt-vault
```

### Step 2: Install & Run
```bash
cd logic-engine
npm install
npm run server
```

You'll see: `✓ Server started: listening on port 3000`

### Step 3: Open Vault
1. Open Obsidian
2. Open vault: `File → Open vault folder → select yt-vault/obsidian-vault/`
3. Enable plugins when prompted
4. Go to **Quick-Start** page
5. Click **"Start Scraping Now"** button

**Done!** 

Add a video clip (web clipper) → Appears in vault in seconds.

---

## Keep it Running

### Option A: Terminal (Simple)
- Run `npm run server` in terminal
- Keep terminal open
- Service stops when you close terminal

### Option B: Background (Advanced)
- Run `npm run pm2-start`
- Service runs in background
- Keep it running with `npm run pm2-setup-autoboot`
- See `logic-engine/PM2_SETUP.md` for details

---

## File Structure for Deployment

```
yt-vault/                    # Clone this entire folder
├── README.md                # Start here
├── SETUP_GUIDE.md           # For sharing with others
├── ARCHITECTURE.md          # System design (for developers)
├── DEPLOYMENT.md            # This file
├── .gitignore               # Git configuration
│
├── logic-engine/            # Backend (ready to deploy)
│   ├── server.js
│   ├── main.js
│   ├── config.json          # Edit this to configure
│   ├── package.json
│   └── ... (all core files)
│
└── obsidian-vault/          # Frontend (ready to use)
    ├── README.md
    ├── Quick-Start.md
    ├── Settings.md
    ├── videos/              # Auto-generated
    ├── topics/              # Auto-generated
    ├── channels/            # Auto-generated
    ├── clippings/           # User input
    └── .obsidian/           # Config
```

---

## Configuration

Edit: `logic-engine/config.json`

```json
{
  "autoStartScraper": true,     // Auto-start on vault open? (true/false)
  "loggingLevel": "INFO"        // Log detail (INFO or VERBOSE)
}
```

Or use Obsidian **Settings** page to change it (saves automatically).

---

## Troubleshooting

### "Service not running"
```bash
cd logic-engine
npm run server
```

### "Port 3000 already in use"
```bash
# Kill whatever's using port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Restart service
npm run server
```

### "Clips not processing"
1. Check service is running: `curl http://localhost:3000/health`
2. Check logs: `tail -f .planning/logs/run-*.log`
3. Restart: `npm run server`

### "Plugin not working"
1. Obsidian → Settings → Community plugins → Check "yt-vault-service" is enabled
2. Reload Obsidian: Cmd+Shift+P → "Reload app without saving"

---

## For Others (Sharing)

**Copy-paste these instructions for anyone:**

1. Clone: `git clone https://github.com/YOUR_REPO/yt-vault.git && cd yt-vault`
2. Install: `cd logic-engine && npm install`
3. Run: `npm run server`
4. Open: Obsidian → File → Open vault folder → `yt-vault/obsidian-vault/`
5. Go to **Quick-Start** page and click button

---

## What to Monitor

### Service Health
```bash
curl http://localhost:3000/health
# Response: {"status":"ok"}
```

### Scraper Status
```bash
curl http://localhost:3000/status
# Response: {"running":true,"pid":12345}
```

### Current Config
```bash
curl http://localhost:3000/config
```

### Logs (Real-time)
```bash
tail -f .planning/logs/run-*.log
```

---

## Advanced: PM2 Setup (Optional)

For auto-start on system reboot:

```bash
cd logic-engine
npm run pm2-setup-autoboot
```

Then:
- Service auto-starts on PC reboot
- Service auto-restarts if it crashes
- See `logic-engine/PM2_SETUP.md` for details

---

## Environment

**Requirements:**
- Node.js 18+ (check: `node --version`)
- Obsidian (any recent version)
- macOS or Linux (Windows with WSL works too)

**That's it.** No databases, no external services.

---

## Common Configs

### Development (you're working on code)
```bash
npm run server              # Service in terminal (easy to debug)
# Edit code, restart service manually
```

### Home Use (personal knowledge base)
```bash
npm run server              # Keep terminal open
# Or use PM2: npm run pm2-start
```

### Shared Server (multiple users)
```bash
npm run pm2-start
npm run pm2-setup-autoboot  # Auto-start on reboot
pm2 monit                   # Monitor CPU/memory
```

---

**That's it! You're done.**

More info? See SETUP_GUIDE.md or ARCHITECTURE.md.

---

**Version:** 1.0 (2026-04-24)  
**Status:** Ready to deploy
