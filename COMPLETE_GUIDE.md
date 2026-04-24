# YouTube Vault — Complete Documentation

**One document with everything: setup, architecture, troubleshooting, and how to use it.**

---

## 📖 Table of Contents

1. [Quick Start (2 minutes)](#quick-start)
2. [What is YouTube Vault?](#what-is-it)
3. [How It Works](#how-it-works)
4. [Project Structure](#project-structure)
5. [Installation & Setup](#installation--setup)
6. [Usage Guide](#usage-guide)
7. [Troubleshooting](#troubleshooting)
8. [Configuration Reference](#configuration-reference)
9. [Getting Help](#getting-help)

---

## Quick Start

**For users who just want it working, no explanations:**

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/yt-vault
cd yt-vault

# 2. Run the installer (handles everything)
bash INSTALL.sh

# 3. Done! Open Obsidian and it auto-starts
```

That's it. Service runs in background. Open Obsidian → scraping starts automatically.

---

## What Is It?

YouTube Vault is a **self-hosted system** that:

✓ **Watches** your Obsidian vault for new clippings  
✓ **Fetches** latest videos from YouTube channels  
✓ **Processes** them: extracts metadata, topics, summaries  
✓ **Organizes** everything as searchable notes in Obsidian  
✓ **Runs automatically** — no manual steps required  

**Think of it as:** YouTube → Brain Interface. Videos don't disappear; they become permanent, searchable knowledge in your vault.

### Who Is This For?

- **Researchers** — systematically harvest video sources
- **Students** — turn educational content into study notes
- **Content creators** — track inspiration and learning
- **AI enthusiasts** — attach vault to Claude/ChatGPT to enhance reasoning
- **Knowledge workers** — build a personal Wikipedia

---

## How It Works

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER OPENS OBSIDIAN                                      │
│    - Obsidian loads 99-Service-Controls page                │
│    - Page auto-checks config & starts scraper if enabled   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. SERVICE SERVER (PM2 + Node.js)                          │
│    - Runs on localhost:3000                                 │
│    - Manages scraper process                               │
│    - Provides API: /start, /stop, /status, /logs            │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. SCRAPER PROCESS                                          │
│    - Watches: obsidian-vault/clippings/                    │
│    - When new file found:                                   │
│      • Extract YouTube URL/channel ID                       │
│      • Fetch RSS feed                                       │
│      • Pull ~15 recent videos                               │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. PROCESSING PIPELINE (7-layer system)                     │
│                                                              │
│    Core Layer (data ingestion):                             │
│    ├─ watcher.js    → detects new clippings               │
│    ├─ extractor.js  → parses YouTube URLs                 │
│    └─ resolver.js   → fetches video metadata              │
│                                                              │
│    Processing Layer (transformation):                        │
│    ├─ harvester.js  → gets videos from RSS                │
│    ├─ processor.js  → processes & structures              │
│    └─ generator.js  → creates markdown notes              │
│                                                              │
│    Utils Layer (helpers):                                   │
│    ├─ logger.js     → logs all activity                    │
│    ├─ reviewer.js   → validates data                       │
│    ├─ error-messages.js → user-friendly errors             │
│    └─ topic-merger.js → organizes topics                   │
│                                                              │
│    Config Layer (settings):                                 │
│    ├─ config.json   → app settings                         │
│    ├─ channels.json → channel list                         │
│    └─ history.json  → processed videos (append-only)       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. OUTPUT: ORGANIZED OBSIDIAN VAULT                         │
│                                                              │
│    obsidian-vault/                                          │
│    ├─ videos/          (individual video notes)             │
│    ├─ topics/          (topic index pages)                  │
│    ├─ channels/        (channel info & indexes)             │
│    ├─ clippings/       (input folder - you add here)       │
│    └─ 99-Service-Controls.md  (control panel)              │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Example

```
User drops "https://youtube.com/@LinusTeachTech" into clippings/
                              ↓
Watcher detects new file
                              ↓
Extractor gets channel ID: UC1JMXE8EHCmmPJTVdVvU5Zg
                              ↓
Resolver fetches RSS feed: https://www.youtube.com/feeds/videos.xml?channel_id=UC1JMXE8EHCmmPJTVdVvU5Zg
                              ↓
Harvester pulls 15 latest videos (titles, URLs, dates)
                              ↓
Processor extracts metadata: duration, description, thumbnail
                              ↓
Generator creates markdown notes:
- videos/Linus-Tech-Tips-Best-[TOPIC]-2024.md
- topics/PC-Hardware/index.md (if topic detected)
- channels/Linus-Tech-Tips/index.md
                              ↓
All notes appear in Obsidian with wikilinks
```

---

## Project Structure

```
yt-vault/
│
├── 📄 README.md                    # Project overview
├── 📄 COMPLETE_GUIDE.md            # THIS FILE - everything
├── 📄 QUICKSTART.md                # 2-minute quick start
├── 📄 SETUP_GUIDE.md               # Detailed setup (for sharing)
├── 📄 ARCHITECTURE.md              # Technical deep dive
├── 📄 DEPLOYMENT.md                # Production notes
├── 🔧 INSTALL.sh                   # One-command installer
│
├── 📁 logic-engine/                # The Node.js service
│   ├── server.js                   # HTTP API server (localhost:3000)
│   ├── main.js                     # Scraper entry point
│   ├── engine.js                   # Main processing engine
│   ├── package.json                # Dependencies
│   ├── ecosystem.config.js         # PM2 configuration
│   │
│   ├── core/                       # Data ingestion layer
│   │   ├── watcher.js              # Monitors clippings folder
│   │   ├── extractor.js            # Parses YouTube URLs
│   │   └── resolver.js             # Fetches metadata
│   │
│   ├── processing/                 # Transformation pipeline
│   │   └── processor.js            # Processes & structures video data
│   │
│   ├── utils/                      # Helper functions
│   │   ├── logger.js               # Logging system
│   │   ├── reviewer.js             # Data validation
│   │   ├── error-messages.js       # User-friendly errors
│   │   └── topic-merger.js         # Organizes topics
│   │
│   ├── config/                     # Configuration files
│   │   ├── config.json             # App settings
│   │   ├── channels.json           # Channel configuration
│   │   ├── history.json            # Processed videos log
│   │   └── ecosystem.config.js     # PM2 settings
│   │
│   └── scripts/                    # Utility scripts
│       └── health-check.js         # Service health monitoring
│
├── 📁 obsidian-vault/              # Your Obsidian vault
│   ├── 99-Service-Controls.md      # Control panel (UI)
│   ├── clippings/                  # INPUT: Drop YouTube URLs here
│   ├── videos/                     # OUTPUT: Video notes
│   ├── topics/                     # OUTPUT: Topic indexes
│   └── channels/                   # OUTPUT: Channel pages
│
├── 📁 .planning/                   # Project planning docs
│   ├── current/                    # Active planning
│   │   ├── PROJECT.md
│   │   ├── ROADMAP.md
│   │   ├── STATE.md
│   │   └── codebase/
│   │
│   ├── milestones/                 # Historical phases
│   └── quick/                      # Quick task history
│
└── 📁 .git/                        # Git repository
```

### Key Directories Explained

| Directory | Purpose | Who Uses It |
|-----------|---------|-------------|
| `logic-engine/` | Node.js service + scraper | System (auto-runs) |
| `obsidian-vault/` | Your knowledge base | You (in Obsidian) |
| `obsidian-vault/clippings/` | INPUT folder | You (drop URLs here) |
| `obsidian-vault/videos/` | OUTPUT folder | Obsidian displays these |
| `.planning/` | Project docs | Developers only |

---

## Installation & Setup

### Prerequisites

- **macOS** (or Linux, WSL on Windows)
- **Node.js** 18+ ([download](https://nodejs.org))
- **Obsidian** ([download](https://obsidian.md))
- **Git** (usually pre-installed on macOS)

### Option 1: Automated Setup (Recommended)

**One command:**

```bash
bash INSTALL.sh
```

This script:
1. ✓ Checks for Node.js (installs if missing)
2. ✓ Installs npm dependencies
3. ✓ Sets up PM2 (process manager)
4. ✓ Starts the service
5. ✓ Enables auto-start on system boot

**Then:** Open Obsidian → Scraper auto-starts.

### Option 2: Manual Setup

If you prefer to understand each step:

```bash
# Clone repository
git clone https://github.com/yourusername/yt-vault
cd yt-vault

# Install Node.js (if not installed)
# Visit https://nodejs.org/ and download

# Install npm dependencies
cd logic-engine
npm install
cd ..

# Install PM2 globally
npm install -g pm2

# Start the service with PM2
cd logic-engine
npm run pm2-start

# Enable auto-start on system boot
npm run pm2-setup-autoboot
```

### Verify Installation

```bash
# Check if service is running
pm2 status

# You should see:
# ┌─────────────────┬──────┬──────┬────────┐
# │ Name            │ PID  │ Mode │ Status │
# ├─────────────────┼──────┼──────┼────────┤
# │ yt-vault-service│ 1234 │ fork │ online │
# └─────────────────┴──────┴──────┴────────┘

# View logs
pm2 logs yt-vault-service
```

---

## Usage Guide

### For End Users

#### 1. Open Obsidian

Navigate to the vault folder: `yt-vault/obsidian-vault/`

#### 2. Check Service Status

Go to page: **99-Service-Controls**

You'll see:
- 🟢 **Running** — scraper is active
- 🔴 **Stopped** — scraper is off
- 🔄 **Checking** — checking status

#### 3. Control the Scraper

| Action | How |
|--------|-----|
| **Start** | Click ▶ Start Scraping button |
| **Stop** | Click ⏹ Stop Scraping button |
| **View logs** | Click 📋 View Logs button |

#### 4. Add a YouTube Channel

In Obsidian, go to: **clippings/** folder

Create a new note with just the YouTube channel URL:
```
https://www.youtube.com/@LinusTeachTech
```

Save it.

The scraper will:
1. Detect the new file
2. Fetch all recent videos from that channel
3. Create organized notes in `videos/`
4. Create topic pages in `topics/`
5. Create a channel index in `channels/`

#### 5. Explore Your Vault

Use Obsidian's features:
- **Graph view** — see connections between videos & topics
- **Search** — find videos by topic, channel, or date
- **Bases view** — see all videos in a table
- **Dataview** — create custom queries

### For Developers

#### Manually Control Service

```bash
# Start the service
pm2 start yt-vault-service

# Stop the service
pm2 stop yt-vault-service

# Restart the service
pm2 restart yt-vault-service

# View real-time logs
pm2 logs yt-vault-service

# Monitor all processes
pm2 monit

# Show process details
pm2 show yt-vault-service
```

#### Modify the Scraper

The scraper code is in `logic-engine/`:

1. **watcher.js** — monitors clippings folder
2. **extractor.js** — parses YouTube URLs
3. **resolver.js** — fetches video metadata
4. **processor.js** — structures the data
5. **generator.js** — creates markdown notes

After modifying code:
```bash
pm2 restart yt-vault-service
```

---

## Troubleshooting

### "Service unavailable" in Obsidian

**Cause:** Server.js is not running.

**Fix:**
```bash
# Check if it's running
pm2 status

# If not running, start it
pm2 start yt-vault-service

# Check for errors
pm2 logs yt-vault-service
```

### Service starts but crashes immediately

**Cause:** Dependencies not installed.

**Fix:**
```bash
cd logic-engine
npm install
npm run pm2-start
```

### Videos not appearing in vault

**Cause:** Scraper might not be running, or the clipping file format is wrong.

**Fix:**
1. Check: Is scraper status 🟢 Running?
2. Check: Did you put a YouTube URL in `clippings/`?
3. Check logs: `pm2 logs yt-vault-service`

### Obsidian can't connect to service

**Cause:** Server on port 3000 is blocked or in use.

**Fix:**
```bash
# Check what's using port 3000
lsof -i :3000

# If something else is using it, kill it or change port in server.js
```

### "Cannot find module 'chokidar'"

**Cause:** Dependencies weren't installed.

**Fix:**
```bash
cd logic-engine
npm install
```

### Service stops after a few seconds

**Check the logs:**
```bash
pm2 logs yt-vault-service
```

Look for error messages. Common issues:
- Missing config file
- Invalid config format
- YouTube API rate limit
- Network error

**Fix depends on the specific error shown in logs.**

---

## Configuration Reference

### config.json

Located: `logic-engine/config/config.json`

```json
{
  "autoStartScraper": true,
  "_autoStart_help": "Set to true to auto-start scraper when Obsidian opens",
  "loggingLevel": "INFO",
  "_loggingLevel_help": "Options: INFO (standard), WARN (important only), ERROR (failures only)"
}
```

#### Settings

| Setting | Value | Meaning |
|---------|-------|---------|
| `autoStartScraper` | `true` / `false` | Auto-start when vault opens |
| `loggingLevel` | `INFO` / `WARN` / `ERROR` | How much logging to show |

### channels.json

Located: `logic-engine/config/channels.json`

Stores configured channels (auto-populated when you add clippings).

### history.json

Located: `logic-engine/config/history.json`

Append-only log of all processed videos. Don't edit manually.

### ecosystem.config.js

Located: `logic-engine/ecosystem.config.js`

PM2 configuration. Defines:
- How the service starts
- Restart behavior
- Log file locations
- Auto-boot settings

Don't edit unless you know what you're doing.

---

## Getting Help

### Option 1: Check Logs

```bash
pm2 logs yt-vault-service
```

Error messages here tell you exactly what's wrong.

### Option 2: Ask an AI

Use the LLM Assistant prompt to get help from Claude, ChatGPT, or another AI:

**See:** LLM_ASSISTANT.md

### Option 3: Manual Debugging

1. Check if Node.js is installed: `node -v`
2. Check if npm is installed: `npm -v`
3. Check if PM2 is installed: `pm2 -v`
4. Check service status: `pm2 status`
5. View logs: `pm2 logs yt-vault-service`

### Option 4: Restart Everything

If something is broken:

```bash
# Stop the service
pm2 stop yt-vault-service

# Delete it from PM2
pm2 delete yt-vault-service

# Re-install dependencies
cd logic-engine
rm -rf node_modules
npm install

# Start fresh
npm run pm2-start
```

---

## Advanced Topics

### Accessing the Service API

The service exposes a REST API on `http://localhost:3000`:

```bash
# Check service status
curl http://localhost:3000/status

# Get logs
curl http://localhost:3000/logs

# Get config
curl http://localhost:3000/config

# Start scraper
curl -X POST http://localhost:3000/start

# Stop scraper
curl -X POST http://localhost:3000/stop

# Health check
curl http://localhost:3000/health
```

### Extending the Scraper

Want to add features? Modify files in `logic-engine/`:

1. **Add new data** — edit `processor.js`
2. **Change how notes are generated** — edit `generator.js`
3. **Add new topics** — edit `topic-merger.js`
4. **Add logging** — use `logger.js`

Always restart after changes:
```bash
pm2 restart yt-vault-service
```

### Performance Tuning

If scraper is slow:
- Increase timeout in `resolver.js`
- Reduce number of videos fetched (default: 15)
- Enable `WARN` logging instead of `INFO` (faster)

---

## Summary

| Task | How |
|------|-----|
| **Install** | `bash INSTALL.sh` |
| **Use** | Open Obsidian → Service Controls → click Start |
| **Add channel** | Drop YouTube URL in `clippings/` folder |
| **Check status** | Obsidian → 99-Service-Controls page |
| **View logs** | `pm2 logs yt-vault-service` |
| **Stop service** | `pm2 stop yt-vault-service` |
| **Auto-start on boot** | Run `npm run pm2-setup-autoboot` |

---

**You now have everything you need to use YouTube Vault.**

For quick answers, see QUICKSTART.md. For step-by-step setup, see SETUP_GUIDE.md. For architecture deep dive, see ARCHITECTURE.md.

Questions? See "Getting Help" section above. 🚀
