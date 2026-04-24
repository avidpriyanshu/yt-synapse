# Phase 5: Service & Operations - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning
**Mode:** Smart Discuss (auto-accepted for autonomous execution)

<domain>
## Phase Boundary

Add service mode with comprehensive logging and UI controls for non-technical users:
- UI toggle to enable/disable scraper (not just CLI)
- Real-time logs of successful scrapes (videos added, topics created, channels processed)
- Failed scrape logs with error details (bad URL, network error, timeout, etc.)
- Optional auto-start scraper on vault open
- Persistent daily timestamped log files

Makes yt-vault operable without terminal knowledge.

</domain>

<decisions>
## Implementation Decisions

### Service Mode Entry Point
- Create Obsidian "Service Controls" page with UI buttons (using Obsidian callouts + embedded JS)
- Button 1: "Start Scraping" — triggers scraper via Node.js child process
- Button 2: "Stop Scraping" — kills running process
- Button 3: "View Logs" — displays today's log file in note
- Status indicator: Shows if scraper is running (polling backend)

### Logging Architecture
- All logging through centralized `logger.js` module (single point of control)
- Log levels: INFO (standard operations), WARN (non-blocking issues), ERROR (failures)
- Each log entry: timestamp, phase (watch/extract/resolve/harvest/process/generate), action, detail
- Format: `[2026-04-24T14:30:45Z] [EXTRACT] [INFO] Added video: Jet Engine 101 (yt-abc123)`

### Success Logs
- Track: videos added, channels discovered, topics extracted
- Example: `[GENERATE] [INFO] Created note: videos/yt-abc123-Jet-Engine-101.md`
- Real-time streaming to log file (append, no buffering)

### Error Logs
- Capture: why video skipped (bad URL, network timeout, invalid metadata, validation failed)
- Example: `[RESOLVE] [ERROR] Network timeout fetching channel page: https://youtube.com/... (retry 3/3 failed)`
- Include retry count if applicable, network status, exception message

### Auto-Start on Vault Open
- Optional toggle in config (default: off)
- If enabled: Obsidian plugin hook runs scraper on vault load
- Non-blocking (runs in background; doesn't freeze Obsidian UI)
- User can disable mid-run via Service Controls

### Log File Persistence
- Location: `.planning/logs/run-YYYY-MM-DD.log`
- Daily rotation (new file per day)
- Persisted indefinitely (user manages cleanup)
- Human-readable format, grep-able

### Claude's Discretion
- Exact UI styling (buttons vs toggle switches vs custom controls)
- Log file size limits (rotate on size threshold or daily)
- Service heartbeat mechanism (how to detect hung process)
- Auto-retry logic for transient failures (exponential backoff strategy)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `main.js` already has logging structure with `logPhase()` and `reportFile()` functions
- Can extend existing logging to centralize and enrich
- Child process spawning already used in codebase (familiar pattern)

### Established Patterns
- Atomic file writes (used for history.json, channels.json)
- Error handling throughout pipeline
- State management via JSON files

### Integration Points
- Service controls page in Obsidian vault (new)
- Logger module hooks into all phases (watcher, extractor, resolver, harvester, processor, generator)
- Backend API (node process listening for control commands)

</code_context>

<specifics>
## Specific Ideas

- User expectation: Non-technical users should understand what system is doing (clear, plain-language logs)
- Control: Easy start/stop without terminal knowledge (UI-first, not CLI-first)
- Visibility: Success and failure equally visible (know when things break)

</specifics>

<deferred>
## Deferred Ideas

- Advanced service metrics (scrape duration, success rate, performance stats) — deferred
- Scheduled auto-scrape (cron-based) — deferred to v2.1
- Service restart on failure (auto-recovery) — deferred (monitor manually for now)
- Webhook notifications (Slack, Discord alerts on failure) — deferred
- Service-to-user notifications (toast messages in Obsidian) — deferred

</deferred>
