# Architecture — YouTube Vault

Minimal, clean, LLM-friendly system design.

---

## Project Structure

```
yt-vault/
├── README.md              # User overview
├── SETUP_GUIDE.md         # Setup instructions for others
├── ARCHITECTURE.md        # This file - system design
│
├── logic-engine/          # Backend (Node.js)
│   ├── server.js          # HTTP API server (localhost:3000)
│   ├── main.js            # Scraper (processes clips, creates notes)
│   ├── logger.js          # Logging system
│   ├── config.json        # Configuration (autoStartScraper, loggingLevel)
│   ├── error-messages.js  # Error definitions
│   ├── plugin-launcher.js # Plugin initialization helper
│   ├── service-launcher.js # Service startup manager
│   ├── setup-pm2-autoboot.sh # PM2 auto-boot setup
│   ├── ecosystem.config.js   # PM2 process config
│   ├── PM2_SETUP.md          # PM2 documentation
│   └── package.json          # Dependencies
│
└── obsidian-vault/        # Frontend (Obsidian)
    ├── README.md          # Vault structure explanation
    ├── First-Run Setup.md # Initial configuration wizard
    ├── Quick-Start.md     # One-click start button
    ├── Settings.md        # User preferences UI
    ├── 99-Service-Controls.md # Advanced controls
    │
    ├── videos/            # Generated: video markdown notes
    ├── topics/            # Generated: topic index
    ├── channels/          # Generated: channel pages
    ├── clippings/         # Input: web clipper drops files here
    │
    └── .obsidian/         # Obsidian configuration
        ├── plugins/yt-vault-service/ # Auto-start plugin
        ├── app.json       # UI config
        ├── appearance.json # Theme
        └── community-plugins.json # Enabled plugins
```

---

## Core Components

### 1. **server.js** — HTTP API
```
Port: localhost:3000
Endpoints:
  GET  /health          → Check if running
  POST /start           → Start scraper (fork main.js)
  POST /stop            → Stop scraper
  GET  /status          → Is scraper running?
  GET  /config          → Read config.json
  POST /config          → Update config.json
  GET  /logs            → Today's log file
```

### 2. **main.js** — Scraper
```
Watches: obsidian-vault/clippings/ (file watcher)

Per clip:
  1. Parse YouTube URL
  2. Fetch metadata (title, channel, etc.)
  3. Generate transcript summary
  4. Extract topics/keywords
  5. Create markdown note in videos/
  6. Auto-create topic pages
  7. Update channel info

Output:
  - videos/{title}-{videoId}.md
  - topics/{topic}.md (multiple)
  - channels/{channel}.md
```

### 3. **logger.js** — Logging
```
Levels: INFO (standard), WARN (non-blocking), ERROR (failures)
Output: .planning/logs/run-YYYY-MM-DD.log
Format: ✓ [timestamp] phase: message: details
```

### 4. **plugin-launcher.js** — Obsidian Plugin Bridge
```
On vault open:
  1. Check if service running (GET /health)
  2. If not, start service-launcher.js
  3. Read config.json
  4. If autoStartScraper=true, POST /start
  5. Scraper runs in background
```

### 5. **ecosystem.config.js** — PM2 Process Manager
```
Manages: server.js process
Features:
  - Auto-restart on crash
  - Max memory: 500MB
  - Auto-start on system boot (optional)
  - Logs to .planning/logs/pm2-*.log
```

---

## Data Flow

```
User adds clip (via web clipper)
         ↓
File appears in clippings/
         ↓
Chokidar (file watcher) detects change
         ↓
main.js processes file
         ↓
Extract: title, channel, URL, transcript
         ↓
Generate: topics, keywords
         ↓
Create markdown files:
  - videos/{title}.md
  - topics/{topic}.md
  - channels/{channel}.md
         ↓
Obsidian refreshes → Notes appear in vault
```

---

## Configuration

**File:** `logic-engine/config.json`

```json
{
  "autoStartScraper": true,     // Auto-start on vault open
  "loggingLevel": "INFO"        // Log detail level
}
```

UI to change config: **Settings.md** in Obsidian (saves via `/config` endpoint)

---

## Startup Sequence

### Simple Start (recommended)
```bash
cd logic-engine
npm run server
```
Service runs in terminal. Keep terminal open.

### Advanced Start (with PM2 - optional)
```bash
npm run pm2-start
npm run pm2-setup-autoboot  # One-time setup
```
Service runs in background. Auto-starts on system reboot.

### Auto-Start on Vault Open
1. User opens Obsidian
2. yt-vault-service plugin loads
3. Plugin checks: Is service running?
4. If no: Plugin starts service-launcher.js
5. If yes: Continue
6. Read config.autoStartScraper
7. If true: POST /start → scraper runs

---

## Key Files for LLMs

### If modifying scraper logic:
- **logic-engine/main.js** — Video processing pipeline

### If modifying API:
- **logic-engine/server.js** — HTTP endpoints

### If modifying UI:
- **obsidian-vault/Quick-Start.md** — Button logic
- **obsidian-vault/Settings.md** — Configuration UI

### If debugging:
- **logic-engine/logger.js** — Logging system
- **logic-engine/error-messages.js** — Error definitions

### If changing startup:
- **logic-engine/service-launcher.js** — Service manager
- **obsidian-vault/.obsidian/plugins/yt-vault-service/main.js** — Plugin hooks

---

## Dependencies

**Minimal & explicit:**
```json
{
  "chokidar": "^4.0.3",      // File watcher
  "gray-matter": "^4.0.3",   // YAML frontmatter parser
  "rss-parser": "^3.13.0"    // RSS parsing (future)
}
```

No heavy frameworks. Pure Node.js + small utilities.

---

## Deployment

Clean git repo (only source code, no build artifacts):
```bash
git clone https://github.com/YOUR_REPO/yt-vault.git
cd yt-vault/logic-engine
npm install
npm run server
# Then open obsidian-vault/ in Obsidian
```

Clean, minimal, ready to go.

---

## LLM Integration Notes

For AI agents working with this codebase:

1. **Main loop:** `main.js` watches `clippings/`, processes clips, writes notes
2. **HTTP bridge:** `server.js` exposes all operations as REST endpoints
3. **UI integration:** Obsidian plugin auto-triggers via HTTP endpoints
4. **Config:** All settings in `config.json`, readable/writable via API
5. **Logs:** Structured logging in `.planning/logs/run-YYYY-MM-DD.log`

Key operations for agents:
- POST `/start` → begin scraping
- POST `/stop` → stop scraper
- GET `/status` → check state
- GET `/config` → read settings
- POST `/config` → update settings

---

**Version:** 1.0 (2026-04-24)  
**Last Updated:** 2026-04-24  
**Status:** Minimal, clean, production-ready
