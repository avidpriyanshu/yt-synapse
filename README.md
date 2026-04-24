# YouTube Vault 🎥

**Automatically save YouTube videos to Obsidian. Organize by channel, topic, and date. Search and discover everything in one place.**

---

## ⚡ Install (1 Command)

```bash
bash INSTALL.sh
```

That's it! The service starts automatically.

---

## 🎯 What It Does

✅ **Watches** your Obsidian vault for YouTube links  
✅ **Grabs** videos from channels automatically  
✅ **Saves** everything as searchable notes  
✅ **Organizes** by channel, topic, date  
✅ **Runs 24/7** in the background  

---

## 📖 How to Use

### 1. Add a Channel

Go to: **Obsidian** → `clippings/` folder

Create a new note with a YouTube URL:
```
https://www.youtube.com/@ChannelName
```

Save → Videos appear automatically in 5-10 seconds ✓

### 2. Control It

Open: **Obsidian** → **⚙️ Control Panel**

**Start/Stop** scraping anytime  
**View Logs** to see what's happening  
**Change Settings** (see below)  

### 3. Browse Videos

Open: **Obsidian** → **🎥 Dashboard**

- Search by title, channel, or topic
- Sort by date or channel  
- Click topics to explore related videos

---

## ⚙️ Settings (Optional)

All settings can be changed from **Control Panel** → **Settings** section in Obsidian.

| Setting | What It Does |
|---------|-------------|
| **Auto-start** | Scraper starts when Obsidian opens |
| **Logging** | INFO (normal) / WARN / ERROR (errors only) |
| **Videos per batch** | Max videos to fetch per channel (1-50) |

Or edit manually: `logic-engine/config/config.json`

---

## 🎬 Advanced: Control When Videos Are Scraped

### Per-Note Control

Add `scrapping: no` to your clipping to skip scraping just this once:

```
---
source: https://www.youtube.com/watch?v=dQw4w9WgXcQ
scrapping: no
---
```

✓ = Scrapes (default)  
`no` = Skips scraping for this note  

### Batch Size

Change how many videos are fetched at once:

**In Control Panel:**
- Change "Videos per batch" setting  
- Click Save  

**Or in Terminal:**
```json
// logic-engine/config/config.json
{
  "videoBatchSize": 15
}
```

---

## 📁 Vault Structure

```
your-vault/
├── clippings/       ← Drop YouTube URLs here (INPUT)
├── videos/          ← Generated video notes (OUTPUT)
├── topics/          ← Topic pages (OUTPUT)
├── channels/        ← Channel pages (OUTPUT)
│
└── yt-vault guide/
    ├── ⚙️ Control Panel      ← Start/stop/settings
    ├── 🎥 Dashboard         ← Browse all videos
    ├── Quick-Start          ← Getting started
    ├── Channels-Index       ← All channels
    └── CHANNEL-MANAGEMENT   ← Manage channels
```

---

## 🔧 Troubleshooting

### Videos not appearing?

1. Check: Is scraper running? (✅ green dot in Control Panel)
2. Verify: Is YouTube URL in `clippings/` folder?
3. Check logs: Control Panel → View Logs

### Service keeps stopping?

```bash
# Check what's wrong
pm2 logs yt-vault-service

# Restart
pm2 restart yt-vault-service
```

### "Service unavailable" error?

```bash
# Start service
pm2 start yt-vault-service

# Or restart
pm2 restart yt-vault-service
```

### Port 3000 in use?

```bash
# Find what's using port 3000
lsof -i :3000

# Kill it (get PID from above)
kill -9 <PID>
```

---

## 💻 Technical Details

### How It Works (Behind the Scenes)

```
YouTube URL in clippings/
        ↓
Detects URL (file watcher)
        ↓
Gets channel ID from video
        ↓
Fetches RSS feed (latest videos)
        ↓
Extracts topics from titles
        ↓
Creates markdown notes
        ↓
Saves to videos/, topics/, channels/
```

### Project Structure

```
yt-vault/
├── INSTALL.sh                  ← Run this
├── README.md                   ← This file
│
├── logic-engine/               ← Node.js service
│   ├── server.js              (HTTP API on port 3000)
│   ├── main.js                (Scraper + file watcher)
│   ├── engine.js              (YouTube fetcher)
│   ├── config/                (Settings)
│   └── utils/                 (Helpers)
│
└── obsidian-vault/            ← Example vault
    ├── yt-vault guide/        (UI pages)
    ├── clippings/             (INPUT folder)
    ├── videos/                (OUTPUT folder)
    ├── topics/                (OUTPUT folder)
    └── channels/              (OUTPUT folder)
```

---

## 🚀 Commands

| Task | Command |
|------|---------|
| Install | `bash INSTALL.sh` |
| Check status | `pm2 status` |
| View logs | `pm2 logs yt-vault-service` |
| Start | `pm2 start yt-vault-service` |
| Stop | `pm2 stop yt-vault-service` |
| Restart | `pm2 restart yt-vault-service` |

---

## 📝 Manual Setup (If INSTALL.sh Fails)

```bash
# 1. Install Node.js
# Download from https://nodejs.org (v18+)

# 2. Install dependencies
cd logic-engine
npm install

# 3. Install PM2
npm install -g pm2

# 4. Start service
npm run pm2-start

# 5. Done!
```

---

## 🎯 Your Vault Path (Advanced)

If using your own vault, tell the service where it is:

```bash
# Edit your shell config (~/.zshrc or ~/.bash_profile)
export VAULT_ROOT="/Users/yourname/path/to/your/vault"

# Reload
source ~/.zshrc

# Restart service
pm2 restart yt-vault-service
```

---

## 🆘 Getting Help

### Check Logs First

```bash
pm2 logs yt-vault-service
```

Error messages explain what's wrong.

### Common Issues

| Problem | Fix |
|---------|-----|
| Service unavailable | `pm2 restart yt-vault-service` |
| Can't find module | `cd logic-engine && npm install` |
| Videos not appearing | Check `clippings/` has YouTube URL |
| Service crashes | Run `pm2 logs yt-vault-service` |
| Port 3000 in use | `kill -9 <PID>` (from `lsof -i :3000`) |

---

## ✨ Features

- ✅ Automatic channel scraping
- ✅ RSS feed parsing  
- ✅ Topic extraction from video titles
- ✅ Full-text search in Obsidian
- ✅ Customizable batch sizes
- ✅ Per-note scraping toggle
- ✅ Settings panel in Obsidian
- ✅ Real-time logs
- ✅ Auto-start on vault open

---

## 🎓 What You Get

### Video Notes
- Title, channel, link
- Duration, view count
- Topics (auto-extracted)
- Space for your notes

### Topic Pages
- All videos with this topic
- Cross-linked references
- Organized by date

### Channel Pages
- All videos from this channel
- Latest uploads first
- Channel metadata

---

## 🤔 FAQ

**Q: Does it work with my existing vault?**  
A: Yes! Just run INSTALL.sh, then set `VAULT_ROOT` to your vault path.

**Q: How often does it check for new videos?**  
A: Immediately when you add a URL. Then continuously watches for changes.

**Q: Can I stop it from scraping?**  
A: Yes, use Control Panel or add `scrapping: no` to the note.

**Q: Does it work offline?**  
A: No, needs internet to fetch from YouTube.

**Q: Can I delete notes and re-scrape?**  
A: Yes, just delete the note and add the URL again.

**Q: Does it use the YouTube API?**  
A: No, it uses RSS feeds (free, no quota).

---

**Ready to start?** Run `bash INSTALL.sh` and open Obsidian! 🚀
