# Quick Task: Simplify YT Vault Setup

**Goal:** Reduce friction to absolute minimum — vault opens, scraper runs, one-click setup done.

## Changes

### 1. Enable auto-start by default
- File: `logic-engine/config.json`
- Change: `autoStartScraper: true`

### 2. Simplify First-Run Setup.md
- Remove Step 1 (interests checkboxes) — not used anywhere
- Keep only: Step 2 (auto-start choice) + Complete button
- Remove logging level option (keep default INFO)

### 3. Add Quick-Start.md
- New file: `obsidian-vault/Quick-Start.md`
- Single button: "Start Now" that runs `/start` endpoint
- Shows service status in real-time

### 4. Simplify Settings.md
- Remove logging level section entirely
- Keep only: auto-start toggle
- Remove troubleshooting section

## Result
- Vault opens → service auto-starts
- Scraper runs automatically
- One click to start everything if needed
- No confusing options
