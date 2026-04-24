# Files for GitHub — Complete Checklist

**This document lists EXACTLY which files go to GitHub and which stay private.**

---

## ✅ UPLOAD TO GITHUB (Users See These)

### 📄 Documentation (Root Level)

```
README.md                    ← MAIN ENTRY POINT (comprehensive guide)
QUICKSTART.md               ← 2-minute quick start
INSTALL.sh                  ← One-command installer
.gitignore                  ← Git ignore rules
```

### 📁 Source Code (logic-engine/)

```
logic-engine/
├── server.js               ← HTTP API server
├── main.js                 ← Scraper entry point
├── engine.js               ← Main processing engine
├── plugin-launcher.js      ← Plugin launcher
├── service-launcher.js     ← Service launcher
├── package.json            ← Dependencies
├── package-lock.json       ← Lock file
├── ecosystem.config.js     ← PM2 configuration
├── PM2_SETUP.md           ← PM2 setup notes
├── setup-pm2-autoboot.sh  ← Auto-boot setup script
│
├── core/                   ← Data ingestion layer
│   ├── watcher.js
│   ├── extractor.js
│   └── resolver.js
│
├── processing/             ← Transformation pipeline
│   └── processor.js
│
├── utils/                  ← Helper functions
│   ├── logger.js
│   ├── reviewer.js
│   ├── error-messages.js
│   └── topic-merger.js
│
├── config/                 ← Configuration files
│   ├── config.json         (example config)
│   ├── channels.json       (auto-generated)
│   ├── history.json        (auto-generated)
│   └── ecosystem.config.js
│
└── scripts/                ← Utility scripts
    └── health-check.js
```

### 📁 Obsidian Vault (obsidian-vault/)

**Only for reference/example. Users will use their own vault.**

```
obsidian-vault/
├── 99-Service-Controls.md  ← Control panel (Dataview UI)
├── clippings/             ← INPUT folder (empty)
├── videos/                ← OUTPUT example
├── topics/                ← OUTPUT example
└── channels/              ← OUTPUT example
```

### 📁 Root Files

```
ARCHITECTURE.md            ← Technical deep dive
DEPLOYMENT.md             ← Deployment notes
```

---

## ❌ DO NOT UPLOAD TO GITHUB (Private/Dev Only)

### 🚫 Development Directories

```
.planning/                 ← ALL PLANNING DOCS (do not share)
  ├── PROJECT.md
  ├── ROADMAP.md
  ├── STATE.md
  ├── codebase/
  ├── current/
  ├── milestones/
  ├── quick/
  └── [all other planning files]

.claude/                   ← Claude Code private settings
  ├── settings.json
  ├── skills/
  ├── worktrees/
  └── [all Claude internal files]

.cursor/                   ← Cursor IDE private settings
.agents/                   ← Agent configuration
.caliber/                  ← Caliber settings
```

### 🚫 Auto-Generated Files

```
node_modules/              ← npm packages (users run: npm install)
.git/                      ← Git history (GitHub handles this)
.gitignore                 ← Already in repo
```

### 🚫 Internal Documentation

```
COMPLETE_GUIDE.md         ← Consolidated in README.md now
LLM_ASSISTANT.md          ← Keep or delete (consolidated into README)
SETUP_GUIDE.md            ← Consolidated in README.md now
GITHUB_FILES.md           ← This file (internal reference)
```

### 🚫 Your Personal Notes

```
CLAUDE.md                 ← Your memory/preferences (private)
.claude_history/          ← Conversation history (private)
DEBUG_NOTES.txt          ← Any debugging notes
DEVELOPER_NOTES.md       ← Your development notes
```

### 🚫 Obsidian Vault Content (Optional)

```
obsidian-vault/videos/    ← Can include examples OR leave empty
obsidian-vault/topics/    ← Can include examples OR leave empty
obsidian-vault/channels/  ← Can include examples OR leave empty
```

---

## 📦 What Users Clone

When users run: `git clone https://github.com/yourusername/yt-vault`

They get:

```
yt-vault/
├── README.md              ✓ Read this first
├── QUICKSTART.md         ✓ Quick start
├── INSTALL.sh            ✓ Run this installer
├── ARCHITECTURE.md       ✓ Technical details
├── DEPLOYMENT.md         ✓ Production notes
├── logic-engine/         ✓ Source code
├── obsidian-vault/       ✓ Example vault
└── .gitignore            ✓ Git settings

They DO NOT get:
├── .planning/            ✗ Private planning
├── .claude/              ✗ Private settings
├── CLAUDE.md             ✗ Your memory
├── LLM_ASSISTANT.md      ✗ Internal reference
└── node_modules/         ✗ Installed via npm install
```

---

## 🔧 .gitignore Configuration

Your `.gitignore` should have:

```
# Dependencies
node_modules/
package-lock.json         # Can share this, but npm install recreates it

# Private directories
.planning/
.claude/
.cursor/
.agents/
.caliber/
.claude_history/

# Private files
CLAUDE.md
DEBUG_NOTES.txt
DEVELOPER_NOTES.md

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log
logs/
```

---

## ✍️ Create This .gitignore Now

<function_calls>
Create a proper .gitignore with the content above
