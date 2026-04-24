# YouTube Vault — Complete Setup Guide

**Share this with anyone who wants to use the system.**

---

## What is YouTube Vault?

YouTube Vault is a system that **automatically collects YouTube videos** from your favorite channels and **organizes them in Obsidian**. Every video becomes a searchable note with:
- Video title, URL, and transcript summary
- Auto-extracted topics and keywords
- Channel information
- Organized by date and category

**Use cases:**
- Build a personal knowledge base from YouTube
- Research specific topics across multiple videos
- Keep your favorite educational content organized
- Reference videos months later without scrolling YouTube

---

## How It Works (Tech Stack)

```
YouTube Clips
    ↓
Web Clipper Extension
    ↓
Obsidian Vault (obsidian-vault/)
    ↓
File Watcher (chokidar)
    ↓
Node.js Service (logic-engine/)
    ↓
Scraper (main.js)
    ↓
Video Processing
    ├─ Extract metadata from video URL
    ├─ Generate transcript summary
    ├─ Extract topics/keywords
    └─ Create organized Obsidian notes
    ↓
Organized Vault
    ├─ videos/ (video notes)
    ├─ topics/ (topic index)
    ├─ channels/ (channel info)
    └─ clippings/ (raw input)
```

**Technologies Used:**
- **Backend:** Node.js + Express (simple HTTP API)
- **Storage:** File system (Markdown files)
- **File Watching:** chokidar (monitors new clips)
- **Frontend:** Obsidian + Dataview plugin (UI)
- **Communication:** HTTP APIs (localhost:3000)

---

## For Someone Else: Step-by-Step Setup

### Prerequisites
- macOS or Linux (Windows with WSL)
- Node.js 18+ installed
- Obsidian installed
- Git installed

### Step 1: Get the Code (2 minutes)

```bash
git clone https://github.com/YOUR_REPO/yt-vault.git
cd yt-vault
```

### Step 2: Install Dependencies (2 minutes)

```bash
cd logic-engine
npm install
```

### Step 3: Start the Service (1 minute)

```bash
npm run server
```

You'll see: `✓ Server started: listening on port 3000`

### Step 4: Open Vault in Obsidian (1 minute)

1. Open Obsidian
2. Open vault from: `yt-vault/obsidian-vault/`
3. Obsidian will ask to enable plugins → **Enable**
4. The yt-vault-service plugin auto-starts the scraper

### Step 5: Done! Start Using (1 minute)

Go to **Quick-Start** page in Obsidian:
- Click **"Start Scraping Now"** button
- Or enable auto-start in **Settings**

Add a video clip using:
- Web clipper extension, OR
- Copy video URL into `obsidian-vault/clippings/` folder manually

Videos appear in `obsidian-vault/videos/` within seconds.

---

## How It Initializes on Their Device

When they open the vault:

1. **Obsidian plugin loads** → `obsidian-vault/.obsidian/plugins/yt-vault-service/main.js`
2. **Plugin checks:** Is service running on localhost:3000? 
   - No → Starts it: `node logic-engine/service-launcher.js --detach`
   - Yes → Continues
3. **Service is running** → Creates HTTP API on port 3000
4. **Plugin reads config:** `autoStartScraper` setting
   - If `true` → POSTs `/start` to begin scraping
   - If `false` → Waits for user to click button
5. **Scraper starts** → File watcher watches `clippings/` folder
6. **Ready!** User adds clips, scraper processes them automatically

**No manual terminal work needed** — it's all automatic on first open.

---

## System Architecture

### Core Components

**1. Service (`logic-engine/server.js`)**
- HTTP server on localhost:3000
- Endpoints:
  - `GET /health` — check if running
  - `POST /start` — start scraper
  - `POST /stop` — stop scraper
  - `GET /status` — check if scraper is running
  - `GET /config` — read settings
  - `POST /config` — update settings
  - `GET /logs` — view today's logs

**2. Scraper (`logic-engine/main.js`)**
- Watches `obsidian-vault/clippings/` for new files
- For each new clip:
  - Parse YouTube URL
  - Fetch video metadata (title, channel, etc.)
  - Generate transcript summary (if available)
  - Extract topics/keywords via NLP
  - Create Markdown note in `obsidian-vault/videos/`
  - Create topic index in `obsidian-vault/topics/`
  - Update channel page in `obsidian-vault/channels/`

**3. Plugin (`obsidian-vault/.obsidian/plugins/yt-vault-service/`)**
- Hooks into Obsidian vault open event
- Auto-starts service if not running
- Reads config and optionally starts scraper
- Provides UI integration

**4. UI (`obsidian-vault/*.md`)**
- **Quick-Start:** One-click start button
- **Settings:** Toggle auto-start
- **Service Controls:** Status, logs, manual controls
- **First-Run Setup:** Initial configuration

---

## Directory Structure

```
yt-vault/
├── logic-engine/              # Backend (Node.js)
│   ├── server.js             # HTTP API
│   ├── main.js               # Scraper logic
│   ├── service-launcher.js    # Service starter
│   ├── plugin-launcher.js     # Obsidian plugin helper
│   ├── logger.js             # Logging
│   ├── config.json           # Settings (autoStartScraper, loggingLevel)
│   └── package.json
│
├── obsidian-vault/           # Frontend (Obsidian)
│   ├── .obsidian/
│   │   └── plugins/
│   │       └── yt-vault-service/    # Auto-start plugin
│   │           ├── manifest.json
│   │           └── main.js
│   ├── Quick-Start.md        # One-click start
│   ├── Settings.md           # Configuration UI
│   ├── Service-Controls.md   # Manual controls
│   ├── First-Run Setup.md    # Initial wizard
│   ├── videos/               # Video notes (auto-generated)
│   ├── topics/               # Topic index (auto-generated)
│   ├── channels/             # Channel pages (auto-generated)
│   └── clippings/            # Input folder (user adds clips here)
│
└── .planning/                # Docs & logs
    └── logs/
```

---

## How to Share

### Option 1: Direct Repository Link
```
Share this link:
https://github.com/YOUR_REPO/yt-vault

They run:
git clone https://github.com/YOUR_REPO/yt-vault.git
cd yt-vault/logic-engine
npm install
npm run server

Then open obsidian-vault/ in Obsidian.
```

### Option 2: Zip File
1. `git clone` your repo
2. Zip the folder: `yt-vault.zip`
3. Share the zip file
4. They unzip, follow steps above

### Option 3: Docker Container
Create `Dockerfile` and share image (future enhancement)

---

## Configuration

User can customize in **Settings page** or by editing `logic-engine/config.json`:

```json
{
  "autoStartScraper": true,      // Auto-start on vault open (boolean)
  "loggingLevel": "INFO"         // Log detail level (INFO or VERBOSE)
}
```

---

## Troubleshooting

### "Service not running"
Solution:
```bash
cd logic-engine
npm run server
```

### "Clips aren't being processed"
1. Check service is running: `curl http://localhost:3000/health`
2. Check logs: `tail -f .planning/logs/run-*.log`
3. Restart: Kill service and `npm run server`

### "Port 3000 already in use"
```bash
# Find what's using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Restart service
npm run server
```

---

## Use Cases

### 1. **Personal Learning Archive**
Collect educational videos from multiple creators and organize by topic.

### 2. **Research Database**
Build a searchable database of videos related to specific domains.

### 3. **Knowledge Management**
Keep reference videos alongside your notes in Obsidian.

### 4. **Content Curation**
Organize videos you want to share or refer back to.

### 5. **Accessibility**
Text summaries make content searchable without watching.

---

## Performance

- **Initialization:** ~3 seconds (first vault open)
- **Per-video processing:** ~1-2 seconds
- **Storage:** ~1KB per video + metadata
- **CPU:** Minimal when idle, ~10-15% during processing

---

## Security & Privacy

- **Data:** All stored locally (no cloud sync)
- **URLs:** No external API calls except YouTube metadata
- **Config:** Plain text JSON file (local only)
- **Service:** Localhost only (no network exposure)

---

## Next Steps

1. **Set up the system** (follow Step-by-Step above)
2. **Go to Quick-Start** page in Obsidian
3. **Click "Start Scraping Now"**
4. **Add your first video** using web clipper
5. **Watch it appear** in your vault!

---

## Need Help?

- **Can't install?** Check Node.js version: `node --version` (need 18+)
- **Port issue?** Kill process on 3000: `lsof -i :3000 | kill -9`
- **Logs?** Check: `.planning/logs/run-YYYY-MM-DD.log`
- **Obsidian plugin issue?** Rebuild: `.obsidian/plugins/yt-vault-service/`

---

**Version:** 1.0 (2026-04-24)  
**Last Updated:** 2026-04-24  
**Author:** Priyanshu
