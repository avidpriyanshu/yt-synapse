# YouTube Vault: Obsidian Plugin for Auto-Scraped YouTube Research

**Automatically archive YouTube videos to Obsidian with smart topic extraction, batch control, and persistent search. Never lose a research video again.**

---

## Table of Contents

- [Key Features](#key-features)
- [Dependencies](#dependencies)
- [Web Clipper Bookmarklet](#web-clipper-bookmarklet)
- [First Steps](#first-steps)
- [Feature Breakdown](#feature-breakdown)
- [Control Panel](#control-panel)
- [Use Cases](#use-cases)
- [Extension Guide](#extension-guide)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Technical Details](#technical-details)

---

## Key Features

### Core Features

- **Automatic Scraping**: Add a YouTube channel URL to `clippings/` folder → All videos fetch automatically in 5-10 seconds
- **Smart Topic Extraction**: Video titles auto-parsed into topic tags (no manual tagging required)
- **Batch Control**: Set videos per fetch (1-50), rate-limit with batch delays
- **Full-Text Search**: Search by title, channel, topic, or date in Obsidian's native search
- **Per-Note Toggle**: Add `scrapping: no` to skip scraping individual videos

### Control Features

- **Control Panel UI**: Start/stop scraping, view logs, adjust settings—all in Obsidian
- **History Reset**: Clear all cached videos and re-scrape from scratch
- **Topic Quality Filters**: Exclude small topics (CIA, ads, metadata) from extraction
- **24/7 Background Process**: PM2 keeps service running across reboots

---

## Dependencies

Install all in one command:

```bash
bash INSTALL.sh
```

Manual dependencies table:

| Dependency | Version | What It Does |
|------------|---------|-------------|
| **Node.js** | 16.x or higher | Runs the scraper engine |
| **npm** | 8.x+ | Installs packages |
| **Obsidian** | 1.4.x+ | Vault storage and UI |
| **PM2** | 5.x+ | Background process manager (auto-installed) |
| **Web Clipper** | Latest | Bookmarklet for quick URL capture (optional) |

---

## Web Clipper Bookmarklet

Save any YouTube video to your vault with a single click. Copy this entire line (no line breaks) into your browser's bookmarks bar:

```javascript
javascript:(function(){const url='http://localhost:3000/api/clip';const vaultNote=prompt('Note name (or leave blank for auto):');const youtubeUrl=window.location.href;if(youtubeUrl.includes('youtube')||youtubeUrl.includes('youtu.be')){fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:youtubeUrl,noteName:vaultNote||'Video'})}).then(r=>r.json()).then(d=>{alert('✓ Saved to: '+d.path);window.close()}).catch(e=>alert('✗ Error: '+e.message))}else{alert('✗ Not a YouTube URL')}})();
```

### Setup (3 Steps)

1. **Create Bookmark**: Right-click bookmark bar → "Add Page" → Paste code above as URL
2. **Rename**: Call it "Save to Vault" (or anything you like)
3. **Use**: Visit any YouTube video → Click bookmark → Video adds to `clippings/`

### Troubleshooting Bookmarklet

- **"Not a YouTube URL"**: Ensure you're on youtube.com or youtu.be
- **"Service unavailable"**: Service not running. Check `pm2 status`
- **Blank response**: Port 3000 blocked by firewall or another app

---

## First Steps

### Step 1: Install (One Command)

```bash
bash INSTALL.sh
```

Wait for "✓ Service running on port 3000" message.

### Step 2: Add Your First Channel

1. Open Obsidian
2. Navigate to: `yt-vault guide/` → create a new note named "My First Channel"
3. Paste a YouTube channel URL:
   ```
   https://www.youtube.com/@ChannelName
   ```
4. Save (Ctrl+S / Cmd+S)
5. Videos appear in 5-10 seconds ✓

### Step 3: Open Control Panel

1. In Obsidian: `yt-vault guide/` → Open **⚙️ Control Panel**
2. Verify green status indicator (running)
3. Click **View Logs** to see scraping progress

---

## Feature Breakdown

### Filtering (Topic Extraction)

Videos are auto-tagged from titles. Exclude unwanted topics:

1. Control Panel → **Advanced Settings**
2. Add to "Excluded Topics":
   - `CIA` (metadata)
   - `ads` (sponsored)
   - `shorts` (only long content)
3. Click **Save**

Next scrape skips these topics.

### Batch Control (Rate Limiting)

Control how many videos fetch per channel per run:

**In Control Panel:**
- Set "Videos per batch" slider (1-50)
- Default: 15 videos per channel per day

**Why batch?** YouTube rate-limits heavy requests. Smaller batches = more reliable.

### Topic Quality (Smart Extraction)

Topics auto-extracted from video titles using keyword detection. Example:

```
Video Title: "Machine Learning Tutorial: LLMs in 2024"
→ Extracted topics: [ML, LLMs, Tutorial, 2024]
```

Quality filter removes:
- Single-letter topics (`A`, `I`)
- Single-digit years (noise)
- Common metadata (`views`, `shorts`)

### History Reset (Start Fresh)

Clear all cached videos and re-scrape from scratch:

1. Control Panel → **Advanced**
2. Click **Reset History**
3. Confirm (deletes all video notes, keeps channels)
4. Service restarts and re-scrapes

Useful if: Topics wrong, duplicates appeared, or scraper corrupted.

---

## Control Panel

Open in Obsidian: `yt-vault guide/⚙️ Control Panel`

### Status Indicator

- **Green circle**: Scraper running normally
- **Yellow circle**: Scraper running, currently processing
- **Red circle**: Scraper stopped or errored

Click to toggle start/stop.

### Dashboard Buttons

| Button | What It Does |
|--------|-------------|
| **Start Scraper** | Begin watching channels for new videos |
| **Stop Scraper** | Pause scraping (videos stay) |
| **View Logs** | See scraping activity and errors (last 100 lines) |
| **Refresh Channels** | Force re-check all channels now |
| **View Dashboard** | Open video browser (all videos, search, sort) |

### Settings Section

| Setting | Options | Default |
|---------|---------|---------|
| Auto-start | On / Off | On |
| Logging | INFO (verbose) / WARN / ERROR | INFO |
| Videos per batch | 1-50 slider | 15 |
| Batch delay (ms) | Milliseconds between fetches | 1000 |

### Topic Filters

Add topics to exclude from auto-extraction:

```
Excluded topics: CIA, ads, shorts, vlog, clip
```

Partial matches work (`ads` excludes "paid ads", "ads removal", etc.).

### Advanced

- **Reset History**: Delete all video notes and re-scrape
- **Clear Logs**: Remove log file
- **Reload Config**: Restart with new settings

---

## Use Cases

### Use Case 1: Research YouTube Channel on AI Safety

```
Research AI Safety → Find @AIExplained channel
        ↓
Add https://www.youtube.com/@AIExplained to clippings/
        ↓
Service fetches 15 latest videos in 8 seconds
        ↓
Topics auto-tag: AI, safety, governance, ethics
        ↓
Search "AI safety" in Obsidian → Find 47 related videos
        ↓
Click topic link "governance" → See all 12 related videos
        ↓
Cite video in paper (link + metadata auto-filled) in 30 seconds
```

### Use Case 2: Monitor Multiple Tech Channels Weekly

```
Add 5 channels (React, Node.js, TypeScript, DevOps, Databases)
        ↓
Control Panel: Set batch size = 5, batch delay = 500ms
        ↓
Service checks each channel once daily
        ↓
Create saved search "NEW tech" with date filter
        ↓
Every Monday: Review new videos from all channels
        ↓
Topics auto-organize: "React Hooks", "Next.js", "DevOps CI/CD"
        ↓
Cite latest tools/patterns in work without re-searching YouTube
```

### Use Case 3: Archive Conference Talks on Demand

```
Conference announces 40 new talks
        ↓
Add conference YouTube channel
        ↓
Batch size = 40, batch delay = 100ms
        ↓
Service fetches all talks in 30 seconds
        ↓
Exclude topic: "intro" (unwanted talks)
        ↓
Search by speaker name, topic, date
        ↓
Build personal conference archive with full metadata
        ↓
Cross-link to your notes/papers
```

### Use Case 4: Maintain Personal Learning Backups

```
Follow 12 educational channels
        ↓
Control Panel: Auto-start ON, set to run daily
        ↓
Each morning: Check what's new automatically
        ↓
Service never stops, keeps vault synced offline
        ↓
If a video is deleted from YouTube: yours stays in vault
        ↓
Full vault backup to cloud via obsidian-sync or manual export
        ↓
Access research anywhere, anytime, even without internet
```

---

## Extension Guide

### Level 1: Manual Export (Beginner)

Watch YouTube, copy URLs to `clippings/` manually:

```
Open YouTube video
→ Copy URL (Cmd+L → Cmd+C)
→ Create note in clippings/ folder
→ Paste URL
→ Save
→ Video metadata appears in 5-10 seconds
```

**When**: Quick one-off saves, small batches

---

### Level 2: Bot Template (Intermediate)

Use Web Clipper bookmarklet for one-click saves:

1. Install bookmarklet (see Web Clipper Bookmarklet section)
2. On any YouTube page: Click bookmark button
3. Optionally enter custom note name
4. Video auto-adds to `clippings/` folder

**When**: Frequent browsing, want to save without leaving YouTube

---

### Level 3: Custom Scoring (Advanced)

Modify topic scoring in `logic-engine/engine.js`:

```javascript
// Example: Boost AI-related topics, reduce vlog content
const TOPIC_WEIGHTS = {
  'AI': 2.0,        // Boost importance
  'ML': 1.8,
  'vlog': 0.2,      // Reduce importance
  'daily': 0.1,
};

// Modify extraction logic:
topics = extractedTopics
  .filter(t => !EXCLUDED.includes(t))
  .map(t => ({ text: t, weight: TOPIC_WEIGHTS[t] || 1.0 }))
  .sort((a, b) => b.weight - a.weight);
```

Edit config and restart:

```bash
pm2 restart yt-vault-service
```

**When**: Want to customize which topics matter for your research

---

### Level 4: Blacklist Management (Expert)

Create per-channel blacklist to skip specific videos:

**In Control Panel Advanced Settings**, add to "Video Blacklist":

```
channelID:videoID (full blacklist)
Example:
UCa-yuwJY0SZ6tEjjx-6_xMg:dQw4w9WgXcQ  ← Skip this video

Or by pattern:
title:contains:Shorts  ← Skip titles containing "Shorts"
title:startsWith:LIVE  ← Skip LIVE streams
```

Check channel ID from video metadata (Control Panel → View Logs → search `channelId`).

Service skips blacklisted videos on next scrape.

**When**: Exclude specific videos or patterns (ads, unrelated content, duplicates)

---

## Troubleshooting

### Problem 1: Video Not Scraped (No Entry in videos/ Folder)

**Diagnosis:**
1. Is the URL in `clippings/` folder? (Not a subdirectory)
2. Is it a valid YouTube URL? (youtube.com, youtu.be, or @ChannelName)
3. Is the service running? (Green dot in Control Panel)

**Solution:**
- Control Panel → **View Logs** → Look for error messages
- Check: `pm2 logs yt-vault-service` in terminal
- If URL is valid and service is running, try **Refresh Channels** button

---

### Problem 2: Scraper Stuck (Appears Running but Nothing Happens)

**Diagnosis:**
1. Check Control Panel → **View Logs** for recent activity
2. Has it been > 2 minutes with no new log entries?

**Solution:**
```bash
# Check if process is actually running
pm2 status

# If stuck, restart service
pm2 restart yt-vault-service

# Or forcefully kill and restart
pm2 delete yt-vault-service
npm run pm2-start
```

---

### Problem 3: Topics Wrong or Missing

**Diagnosis:**
1. Open a video note in Obsidian
2. Check "Topics:" section at top
3. Are they irrelevant or too generic?

**Solution:**
1. Control Panel → **Advanced Settings** → **Topic Filters**
2. Add unwanted topics to exclusion list: `metadata, shorts, clip`
3. Click **Reset History** to re-scrape with new filters
4. Check `logic-engine/config/config.json` for custom weights

---

### Problem 4: Service Won't Start

**Diagnosis:**
```bash
pm2 status
# Look for "errored" status
pm2 logs yt-vault-service
# Read error message
```

**Solution:**
- **Module not found**: `cd logic-engine && npm install`
- **Port 3000 in use**: `kill -9 $(lsof -ti :3000)` then restart
- **Config error**: Check JSON syntax in `logic-engine/config/config.json`

---

### Problem 5: History Needs Reset (Duplicates, Corruption)

**Diagnosis:**
1. Duplicate video notes appearing
2. Topics completely wrong across vault
3. Videos list has old cached data

**Solution:**
1. Control Panel → **Advanced** → **Reset History**
2. Click **Confirm** (this deletes all video notes but keeps channels)
3. Service automatically re-scrapes from scratch
4. Videos repopulate in 10-30 seconds per channel

---

### Problem 6: Channel Not Recognized (URL Added but Nothing Happens)

**Diagnosis:**
1. Did you add a valid channel URL? (Format: `https://www.youtube.com/@ChannelName` or URL from channel page)
2. Does channel have any videos?

**Solution:**
1. Copy URL directly from YouTube channel page
2. Create new note in `clippings/` with ONLY the URL
3. Save and wait 10 seconds
4. Control Panel → **View Logs** → Search for channel name
5. If no log entry: Check URL format (@ symbol required for user channels)

---

### Problem 7: Batch Size Limits (Fetches Stop at 50)

**Diagnosis:**
1. Set batch size > 50 but videos only appear up to 50

**Solution:**
- Maximum batch size is hardcoded at 50 videos per channel per run
- To fetch more: Run service multiple times or adjust batch delay
- Edit `logic-engine/engine.js` and change `MAX_BATCH = 50` (not recommended—YouTube rate limiting)

---

### Problem 8: Rate Limits (Service Slows or Gets Blocked)

**Diagnosis:**
1. Scraper suddenly stops fetching
2. Logs show "429 Too Many Requests" or "Rate Limited"

**Solution:**
1. Control Panel → **Settings** → Increase **Batch Delay** (500ms → 2000ms)
2. Decrease **Videos per batch** (15 → 5)
3. Click **Save** and restart service
4. If blocked: Wait 1-2 hours before resuming (YouTube temporary ban)

---

## FAQ

### Topics & Extraction

**Q: Why is CIA excluded from topics by default?**  
A: CIA appears in many video titles as acronym (Common Issues & Analysis, etc.) but rarely indicates actual topic. Default filter removes noise.

**Q: How does topic quality work? Why some videos have 2 topics and others have 10?**  
A: Topics extracted from title and description. More detailed titles = more topics. Quality filter removes single-letters and generic words.

**Q: Can I add custom topics manually?**  
A: Yes, edit video note and add to "Topics:" section. Service won't overwrite manual entries.

**Q: Do topics update when a video is re-scraped?**  
A: No, service preserves existing topics to respect manual edits.

---

### History & Data

**Q: What happens when I click "Reset History"?**  
A: All video notes are deleted. Channel notes are kept. Service re-scrapes all videos from scratch on next run.

**Q: Is there a backup before reset?**  
A: No automatic backup. Backup manually: `cp -r videos/ videos-backup/` before reset.

**Q: Can I restore deleted videos?**  
A: Only if you have a git backup or manually restored version. Otherwise, re-add the channel URL to re-scrape.

**Q: What's a backup and how often should I do one?**  
A: Backup = copy entire vault folder to external drive or cloud. Recommended: Weekly for heavy users, monthly for light users.

---

### Offline & Sharing

**Q: Does it work offline?**  
A: No. Service needs internet to fetch from YouTube. However, once videos are saved, you can browse/search them offline in Obsidian.

**Q: Can I share my vault with others?**  
A: Yes. Vault is just markdown files. Zip and share. Recipient runs `bash INSTALL.sh` and service auto-reads vault.

**Q: Can multiple people use the same vault?**  
A: Not simultaneously (Obsidian limitation). Use obsidian-sync for multi-device sync, not multi-person.

---

### Customization & Advanced

**Q: Can I change where videos are saved?**  
A: Edit `logic-engine/config/config.json` → `outputPaths` section. Restart service after.

**Q: How do I prevent certain channels from being scraped?**  
A: Add channel ID to `blacklist.json` in config folder, or manually delete notes and don't re-add URL.

**Q: Can I use a custom note template for videos?**  
A: Yes. Edit template in `logic-engine/templates/video.md` and restart service.

**Q: How do I integrate with other tools (Notion, Readwise, etc.)?**  
A: Export vault as JSON (via Control Panel → Export) and import to other tools. No native integration yet.

---

## Technical Details

### How It Works (Behind the Scenes)

```
1. YouTube URL in clippings/ folder
         ↓
2. File watcher detects change
         ↓
3. Extract channel ID from URL
         ↓
4. Fetch RSS feed for channel
         ↓
5. Parse video metadata (title, duration, date)
         ↓
6. Extract topics from title using NLP
         ↓
7. Apply topic filters (exclude CIA, ads, etc.)
         ↓
8. Generate markdown for each video
         ↓
9. Save to videos/, topics/, channels/ folders
         ↓
10. Update dashboard with new entries
```

### Project Structure

```
yt-vault/
├── INSTALL.sh                     ← One-command installer
├── README.md                      ← This file
│
├── logic-engine/                  ← Node.js service (port 3000)
│   ├── server.js                  (HTTP API for Control Panel)
│   ├── main.js                    (File watcher + orchestration)
│   ├── engine.js                  (YouTube fetching + scraping)
│   ├── config/
│   │   ├── config.json            (Settings: batch size, filters)
│   │   └── blacklist.json         (Blacklisted videos/channels)
│   ├── utils/
│   │   ├── logger.js              (Logging to Control Panel)
│   │   └── obsidian-api.js        (Vault file operations)
│   └── templates/
│       ├── video.md               (Video note template)
│       ├── topic.md               (Topic page template)
│       └── channel.md             (Channel page template)
│
└── obsidian-vault/                ← Example Obsidian vault
    ├── yt-vault guide/            (UI pages in Obsidian)
    │   ├── ⚙️ Control Panel       (Interactive settings + logs)
    │   ├── 🎥 Dashboard           (Browse all videos)
    │   ├── Quick-Start            (Getting started guide)
    │   ├── Channels-Index         (All channels)
    │   └── CHANNEL-MANAGEMENT     (Add/remove channels)
    │
    ├── clippings/                 (INPUT: paste URLs here)
    ├── videos/                    (OUTPUT: auto-generated video notes)
    ├── topics/                    (OUTPUT: auto-generated topic pages)
    └── channels/                  (OUTPUT: auto-generated channel pages)
```

### Commands Reference

| Task | Command |
|------|---------|
| Install | `bash INSTALL.sh` |
| Check status | `pm2 status` |
| View live logs | `pm2 logs yt-vault-service` |
| Start service | `pm2 start yt-vault-service` |
| Stop service | `pm2 stop yt-vault-service` |
| Restart service | `pm2 restart yt-vault-service` |
| Manual setup | `cd logic-engine && npm install && npm run pm2-start` |
| Configure vault path | `export VAULT_ROOT="/path/to/vault"` |

---

**Ready to get started?** Run `bash INSTALL.sh` and open Obsidian. Your first video appears in 5-10 seconds.
