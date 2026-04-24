---
status: resolved
trigger: autoscraper service won't start
created: 2026-04-24
updated: 2026-04-24
---

# Debug Session: autoscraper-service-wont-start

## Symptoms

- **Expected behavior:** Service runs scraper on schedule
- **Actual behavior:** Service won't start (never has worked)
- **Error messages:** Silent failure — no output when clicking buttons
- **Reproduction:** Click "Start Scraping" button in Obsidian Service Controls UI

## Current Focus

**Hypothesis:** HTTP service backend (server.js) is never started

**Test:** Check if server.js is running and listening on port 3000

**Expecting:** Service backend should be running before UI can call API endpoints

**Next action:** Fix the service startup — server.js needs to be started in the background

## Evidence

- **UI Code Location:** obsidian-vault/99-Service-Controls.md
  - Makes HTTP POST to `http://localhost:3000/start` when "Start Scraping" button clicked (line 74)
  - Makes HTTP GET to `http://localhost:3000/status` (line 55)

- **Server Code Exists:** logic-engine/server.js
  - HTTP server listening on port 3000 (line 119)
  - Handles `/start`, `/stop`, `/status`, `/logs`, `/health` endpoints (lines 93-115)
  - Spawns main.js subprocess when `/start` is called (line 21)

- **Main Scraper Code:** logic-engine/main.js
  - Default: starts file watcher on clippings folder (line 553)
  - Can be spawned as subprocess from server.js

- **Missing:** No startup mechanism
  - package.json has no "server" script (only "start", "health", "self-test")
  - No process manager configuration (no PM2, systemd, etc.)
  - server.js is never started — it's defined but never invoked
  - When UI button is clicked, it tries to POST to localhost:3000, but nothing is listening

## Root Cause

**server.js is never started.** The HTTP service backend that listens on port 3000 and spawns the scraper process is defined in the codebase but has no startup mechanism. Without the HTTP server running, the UI buttons have nowhere to send their requests.

The UI calls `fetch('http://localhost:3000/start')` but gets a connection error because no server is listening on that port. This produces a silent failure with no error output — the Obsidian dataviewjs fetch catches the error and displays nothing.

## Fix Applied

**Three files modified to fix the issue:**

1. **logic-engine/package.json**
   - Added "server" script: `node server.js`
   - Added "launcher" script: `node service-launcher.js --detach`
   - User can now manually start service with `npm run server` (foreground) or `npm run launcher` (background)

2. **logic-engine/service-launcher.js** (NEW)
   - Standalone launcher that checks if service is already running
   - Supports both foreground (for systemd/pm2) and background (--detach) modes
   - Waits for service to become available before exiting
   - Logs all actions via centralized logger

3. **logic-engine/plugin-launcher.js** (UPDATED)
   - Now calls `ensureService()` to start server.js if not already running
   - Uses service-launcher.js to spawn the backend
   - Automatically starts service when vault opens (if auto-start enabled)
   - Falls back gracefully if service startup fails

**Verification:**
- Tested `node server.js` — server starts and listens on port 3000
- Tested `node service-launcher.js` — service launcher properly starts server
- Tested `/health` endpoint — returns `{"status": "ok"}`
- Plugin-launcher now ensures service is available before making requests

## Files Changed

- logic-engine/package.json (added "server" and "launcher" scripts)
- logic-engine/service-launcher.js (NEW — service startup manager)
- logic-engine/plugin-launcher.js (UPDATED — calls ensureService on vault open)

## Next Steps for User

To use the fixed service:

**Option 1: Manual start (Development)**
```bash
cd logic-engine
npm run server
```

**Option 2: Background start**
```bash
cd logic-engine
npm run launcher
```

**Option 3: Auto-start on vault open**
Update `logic-engine/config.json`:
```json
{
  "autoStartScraper": true
}
```
The plugin will automatically ensure the service is running when vault opens.

After the service is started, clicking "Start Scraping" in the Obsidian UI will work correctly.
