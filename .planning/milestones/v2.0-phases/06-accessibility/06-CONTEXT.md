# Phase 6: Accessibility - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning
**Mode:** Smart Discuss (auto-accepted for autonomous execution)

<domain>
## Phase Boundary

Make yt-vault user-friendly for non-technical users by:
- Settings UI in Obsidian (no config file editing)
- Clear logging explaining what system is doing (plain language)
- First-run wizard for initial vault setup
- Error messages in plain language (no stack traces or dev jargon)

Removes barriers to entry; makes system understandable without engineering knowledge.

</domain>

<decisions>
## Implementation Decisions

### Settings UI in Obsidian
- Create "Settings" page accessible from Service Controls menu
- Settings panels for:
  - Scraper schedule (if implemented, or placeholder)
  - Channel tagging preferences (example categories, auto-assign)
  - Logging level (verbose vs. summary)
  - Auto-start toggle (enable/disable vault-open hook)
  - Data management (reset all, export logs)
- Markdown-based UI (Obsidian forms plugin if available, else callouts with instructions)
- Non-technical users edit this page directly (no code editing)

### Plain Language Logging
- All log messages written in complete English sentences, not abbreviations
- Example: Instead of `[EXTRACT] [INFO] Added video: yt-abc123`
  Write: `Successfully added video "Jet Engine 101" from Channel Name`
- Avoid: Technical terms (JSON, regex, HTTP codes), error codes, timestamps (use human dates)
- Explain context: Why action happened, what comes next

### First-Run Wizard
- Detect first run: Check if `obsidian-vault/videos/` exists; if not, show wizard
- Wizard steps:
  1. Welcome message explaining yt-vault purpose
  2. Ask user: Channel interests (suggest categories from CONFIG)
  3. Ask user: Logging preference (verbose or summary)
  4. Ask user: Auto-start preference (yes/no)
  5. Confirm setup; create initial `.planning/settings-user.json`
  6. Explain next steps: Go to Service Controls to start scraping
- Wizard is markdown page shown on vault open (not interactive CLI)

### Error Messages in Plain Language
- Audit all error cases in codebase
- Replace technical errors with user-friendly messages
- Format: `{What went wrong} — {Why it happened} — {How to fix}`
  - Example: "The video link doesn't work — YouTube may have removed it or the link is broken. You can try the URL manually or delete this entry."
- Log stack traces separately (for debugging), never show to user
- Provide recovery options (retry, skip, report issue)

### Claude's Discretion
- Exact UI styling and layout (Obsidian-native patterns)
- Specific category suggestions in first-run wizard
- Threshold for "verbose" vs "summary" logging
- Whether to show stack traces in debug logs (vs. swallow completely)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Logger module (from Phase 5) — can format messages in plain language
- Service Controls page (Phase 5) — extend with settings and wizard
- Obsidian plugin hooks available for vault-open detection

### Established Patterns
- Settings stored in `.planning/` JSON files
- UI pages in markdown (Obsidian-native)
- Error handling throughout pipeline (audit for user-facing rewrites)

### Integration Points
- Settings loaded at startup by main.js
- Logging controlled via logger.js (apply plain language there)
- First-run check in main.js (show wizard if needed)
- Error handlers in all pipeline phases (rewrite messages)

</code_context>

<specifics>
## Specific Ideas

- User expectation: Non-technical user should never see a stack trace or error code
- Clarity: Every message should answer: What happened, why, what next?
- Guidance: Settings page and wizard should guide users to success path

</specifics>

<deferred>
## Deferred Ideas

- Interactive wizard CLI (Obsidian-native approach preferred)
- Advanced logging analytics (historical data, charts) — deferred
- In-app onboarding tour (nice-to-have) — deferred
- Multilingual UI (English-first for MVP) — deferred

</deferred>
