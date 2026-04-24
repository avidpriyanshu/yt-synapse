# YouTube Vault 🧠

**Automatically collect YouTube videos from your favorite channels and organize them in your Obsidian vault as permanent, searchable knowledge.**

---

## 🚀 Quick Start (2 Minutes)

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/yt-vault
cd yt-vault

# 2. Run the installer (does everything)
bash INSTALL.sh

# 3. Done! Open your Obsidian vault
# Service auto-starts and scraper begins
```

**That's it.** The service runs in the background. Open Obsidian → scraping starts automatically.

---

## 📖 Table of Contents

- [What Is It?](#what-is-it)
- [How It Works](#how-it-works)
- [Installation](#installation)
- [Using Your Own Obsidian Vault](#using-your-own-obsidian-vault)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Configuration](#configuration)
- [Advanced](#advanced)
- [Getting Help](#getting-help)

---

## What Is It?

YouTube Vault is a **self-hosted system** that:

✅ **Watches** your Obsidian vault for clipping instructions  
✅ **Fetches** latest videos from YouTube channels  
✅ **Processes** them: extracts metadata, topics, summaries  
✅ **Organizes** everything as searchable notes in your vault  
✅ **Runs automatically** in the background, 24/7  

### Use Cases

- 🎓 **Students** — Turn educational YouTube into study notes
- 🔬 **Researchers** — Build a knowledge base from video sources
- 🎬 **Content creators** — Track inspiration and learning
- 🧠 **AI enthusiasts** — Attach vault to Claude/ChatGPT for enhanced reasoning
- 📚 **Knowledge workers** — Build a personal Wikipedia from creators you follow

---

## How It Works

### The Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│ YOU: Drop YouTube URL in clippings folder                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ WATCHER: Detects new file, extracts channel ID              │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ SCRAPER: Fetches RSS feed, gets 15 latest videos            │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ PROCESSOR: Extracts metadata, topics, summaries              │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ GENERATOR: Creates markdown notes with wikilinks             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ OBSIDIAN: Notes appear organized by channel, topic, date    │
└─────────────────────────────────────────────────────────────┘
```

### 7-Layer Architecture

```
logic-engine/
├── server.js               HTTP API (localhost:3000)
├── core/                   Data ingestion
│   ├── watcher.js         Monitors clippings folder
│   ├── extractor.js       Parses YouTube URLs
│   └── resolver.js        Fetches metadata
├── processing/            Transformation pipeline
│   └── processor.js       Processes & structures data
├── utils/                 Helper functions
│   ├── logger.js         Logging system
│   ├── reviewer.js       Data validation
│   ├── error-messages.js User-friendly errors
│   └── topic-merger.js   Topic organization
└── config/               Configuration
    ├── config.json       App settings
    ├── channels.json     Channel list
    └── history.json      Processed videos log
```

---

## Installation

### Prerequisites

- **macOS** or **Linux** (Windows: WSL2)
- **Node.js** 18+ ([download](https://nodejs.org))
- **Obsidian** ([download](https://obsidian.md))
- **Git**

### Automated Installation (Recommended)

```bash
bash INSTALL.sh
```

This script:
- ✓ Checks for Node.js (installs if missing via Homebrew)
- ✓ Installs npm dependencies
- ✓ Sets up PM2 (background process manager)
- ✓ Starts the service
- ✓ Enables auto-start on system boot

**After installation:** Restart your Mac (recommended), then open Obsidian.

### Manual Installation

```bash
# 1. Install Node.js from https://nodejs.org (if not installed)

# 2. Install dependencies
cd logic-engine
npm install
cd ..

# 3. Install PM2 globally
npm install -g pm2

# 4. Start the service
cd logic-engine
npm run pm2-start

# 5. Enable auto-start on boot
npm run pm2-setup-autoboot
```

### Verify Installation

```bash
# Check if service is running
pm2 status

# View logs
pm2 logs yt-vault-service

# You should see the service listed as "online"
```

---

## Using Your Own Obsidian Vault

**Most users already have an Obsidian vault. Here's how to use it with YouTube Vault:**

### Option 1: Use Your Existing Vault (Recommended)

```bash
# 1. After running INSTALL.sh, open config.json
nano logic-engine/config/config.json

# 2. (Optional) Add your vault path for reference
# Note: The watcher will look in the VAULT_ROOT environment variable

# 3. Set the environment variable to point to YOUR vault
export VAULT_ROOT=/path/to/your/obsidian/vault

# 4. Restart the service
pm2 restart yt-vault-service
```

### Option 2: Tell the Service About Your Vault

The service automatically looks for a `clippings/` folder in your vault to watch.

**Set up your vault structure:**

```
your-obsidian-vault/
├── clippings/           ← Drop YouTube URLs here
├── videos/              ← OUTPUT: Generated video notes
├── topics/              ← OUTPUT: Topic indexes
├── channels/            ← OUTPUT: Channel pages
└── [your other folders]
```

**To point service to your vault (macOS/Linux):**

Edit your shell profile file (~/.zshrc or ~/.bash_profile):

```bash
# Add this line at the end
export VAULT_ROOT="/Users/yourname/Documents/My-Obsidian-Vault"
```

Then reload:
```bash
source ~/.zshrc
# or
source ~/.bash_profile
```

Restart the service:
```bash
pm2 restart yt-vault-service
```

### Option 3: Copy the Included Vault to Your Location

```bash
# Copy the included vault to your preferred location
cp -r obsidian-vault /path/to/your/vaults/yt-vault

# Set environment variable (see Option 2 above)
export VAULT_ROOT="/path/to/your/vaults/yt-vault"

# Restart service
pm2 restart yt-vault-service
```

### Verify It's Working

1. Open your Obsidian vault
2. Navigate to: `clippings/` folder
3. Create a new file with a YouTube URL:
   ```
   https://www.youtube.com/@LinusTeachTech
   ```
4. Save it
5. Wait 5-10 seconds
6. Check `videos/` folder — new video notes should appear

---

## Usage Guide

### For End Users

#### 1. Add a YouTube Channel

In your Obsidian vault, go to: **clippings/** folder

Create a new note with just the YouTube channel URL:
```
https://www.youtube.com/@ChannelName
```

Save it. The scraper will automatically:
- Detect the new file
- Fetch all recent videos from that channel
- Create organized notes in `videos/`
- Create topic pages in `topics/`
- Create a channel index in `channels/`

#### 2. Control the Scraper

Open the **99-Service-Controls** page in your vault (if using included vault):

- **▶ Start Scraping** — Begin collecting
- **⏹ Stop Scraping** — Pause collection
- **📋 View Logs** — See activity
- **Status** — Shows 🟢 Running or 🔴 Stopped

Or use terminal:
```bash
pm2 start yt-vault-service     # Start
pm2 stop yt-vault-service      # Stop
pm2 logs yt-vault-service      # View logs
```

#### 3. Explore Your Vault

Use Obsidian features:
- **Graph view** — See connections between videos & topics
- **Search** — Find videos by channel, topic, or keyword
- **Bases view** — See all videos in a table
- **Dataview** — Create custom queries

### For Developers

Modify the scraper in `logic-engine/`:

```bash
# Edit a file
nano logic-engine/utils/topic-merger.js

# Restart to apply changes
pm2 restart yt-vault-service

# View logs to check for errors
pm2 logs yt-vault-service
```

Key files:
- `core/watcher.js` — Monitors clippings folder
- `core/extractor.js` — Parses YouTube URLs
- `processing/processor.js` — Processes video data
- `utils/generator.js` — Creates markdown notes

---

## Project Structure

```
yt-vault/
├── README.md                    # This file
├── QUICKSTART.md                # 2-minute quick start
├── INSTALL.sh                   # One-command installer
│
├── logic-engine/                # Node.js service
│   ├── server.js                # HTTP API
│   ├── main.js                  # Scraper entry point
│   ├── package.json             # Dependencies
│   ├── ecosystem.config.js      # PM2 config
│   ├── core/                    # Data ingestion
│   ├── processing/              # Data transformation
│   ├── utils/                   # Helpers
│   ├── config/                  # Settings
│   └── scripts/                 # Utilities
│
├── obsidian-vault/              # Included example vault
│   ├── 99-Service-Controls.md   # Control panel
│   ├── clippings/               # INPUT: Drop URLs here
│   ├── videos/                  # OUTPUT: Generated notes
│   ├── topics/                  # OUTPUT: Topic indexes
│   └── channels/                # OUTPUT: Channel pages
│
└── .planning/                   # Development docs (ignore)
```

---

## Troubleshooting

### "Service unavailable" in Obsidian

```bash
# Check if service is running
pm2 status

# If not, start it
pm2 start yt-vault-service

# Check for errors
pm2 logs yt-vault-service
```

### Service crashes immediately

```bash
# Install missing dependencies
cd logic-engine
npm install

# Start service
npm run pm2-start
```

### Videos not appearing

1. Is the scraper running? Check: `pm2 status`
2. Did you create a file in `clippings/` with a YouTube URL?
3. Check logs: `pm2 logs yt-vault-service`

Common issues:
- YouTube API rate limit (wait a few hours)
- Network error (check internet connection)
- Invalid URL format (must be a full YouTube channel URL)

### Service stops after a few seconds

```bash
pm2 logs yt-vault-service
```

Look at error messages. Common causes:
- Missing config.json
- Invalid JSON in config
- Wrong vault path
- Port 3000 already in use

### "Cannot find module 'chokidar'"

```bash
cd logic-engine
npm install
```

---

## Configuration

### config.json

Location: `logic-engine/config/config.json`

```json
{
  "autoStartScraper": true,
  "loggingLevel": "INFO"
}
```

| Setting | Options | Meaning |
|---------|---------|---------|
| `autoStartScraper` | `true`/`false` | Auto-start when Obsidian opens |
| `loggingLevel` | `INFO`/`WARN`/`ERROR` | How much logging to show |

### Setting Vault Path

```bash
# macOS/Linux: Add to ~/.zshrc or ~/.bash_profile
export VAULT_ROOT="/path/to/your/obsidian/vault"

# Then reload
source ~/.zshrc

# Restart service
pm2 restart yt-vault-service
```

### PM2 Settings

`logic-engine/ecosystem.config.js` controls:
- How service starts/restarts
- Log file locations
- Auto-boot behavior

Only edit if you know what you're doing.

---

## Advanced

### Using the REST API

```bash
# Check status
curl http://localhost:3000/status

# Get config
curl http://localhost:3000/config

# Start scraper
curl -X POST http://localhost:3000/start

# Stop scraper
curl -X POST http://localhost:3000/stop

# Get logs
curl http://localhost:3000/logs

# Health check
curl http://localhost:3000/health
```

### Extending the Scraper

Want to add features? Modify `logic-engine/`:

1. **Add new metadata** — Edit `processor.js`
2. **Change note generation** — Edit `generator.js`
3. **Modify topics** — Edit `topic-merger.js`
4. **Add logging** — Use `logger.js`

After changes:
```bash
pm2 restart yt-vault-service
```

### Performance Tuning

If scraper is slow:
- Increase timeout in `core/resolver.js`
- Reduce videos fetched (default: 15)
- Change logging to `WARN` instead of `INFO`

---

## Getting Help

### 1. Check Logs

```bash
pm2 logs yt-vault-service
```

Error messages here explain what's wrong.

### 2. Ask an AI for Help

Copy this prompt into Claude or ChatGPT to get contextual help:

```
You are helping me with YouTube Vault, a YouTube video scraper for Obsidian.

Core components:
- logic-engine/ — Node.js service that runs on localhost:3000
- obsidian-vault/ — Example Obsidian vault structure
- PM2 — Background process manager

The system:
1. Watches clippings/ folder in Obsidian vault
2. When new YouTube URL is added, scraper fetches videos
3. Processes them and creates markdown notes
4. Notes appear in videos/, topics/, and channels/ folders

Key commands:
- pm2 status (check if running)
- pm2 logs yt-vault-service (view logs)
- pm2 restart yt-vault-service (restart)
- bash INSTALL.sh (install everything)

My issue: [DESCRIBE YOUR PROBLEM HERE]
```

### 3. Manual Debugging

```bash
# Verify prerequisites
node -v                          # Should show v18+
npm -v                           # Should show version
pm2 -v                           # Should show version

# Check service status
pm2 status

# Check if port 3000 is in use
lsof -i :3000

# Restart everything
pm2 restart yt-vault-service

# Clean reinstall
pm2 delete yt-vault-service
cd logic-engine
rm -rf node_modules
npm install
npm run pm2-start
```

### 4. Common Issues

| Issue | Fix |
|-------|-----|
| "Service unavailable" | `pm2 restart yt-vault-service` |
| "Cannot find module" | `cd logic-engine && npm install` |
| Service crashes | `pm2 logs yt-vault-service` and check errors |
| Videos not appearing | Check `clippings/` has a valid YouTube URL |
| Port 3000 in use | `lsof -i :3000` and kill the process |
| Wrong vault path | Set `VAULT_ROOT` environment variable |

---

## What Gets Installed

### Node.js Packages (logic-engine/)

- **chokidar** — File watching
- **gray-matter** — YAML parsing
- **rss-parser** — RSS feed parsing

### System Tools

- **PM2** — Process manager (installed globally)
- **Node.js** — JavaScript runtime (if not present)

---

## Summary

| Task | Command |
|------|---------|
| **Install** | `bash INSTALL.sh` |
| **Start service** | `pm2 start yt-vault-service` |
| **Stop service** | `pm2 stop yt-vault-service` |
| **View logs** | `pm2 logs yt-vault-service` |
| **Restart service** | `pm2 restart yt-vault-service` |
| **Check status** | `pm2 status` |
| **Add custom vault** | Set `VAULT_ROOT` environment variable |

---

## Next Steps

1. **Clone repo** — `git clone <url> && cd yt-vault`
2. **Install** — `bash INSTALL.sh`
3. **Set vault path** (if using existing vault) — `export VAULT_ROOT="/path/to/vault"`
4. **Add a channel** — Drop YouTube URL in `clippings/` folder
5. **Watch it work** — Videos appear in vault automatically

---

**Questions?** Check logs, then ask an AI assistant (see "Getting Help" section above).

**Ready to start?** Run `bash INSTALL.sh` and enjoy! 🚀
