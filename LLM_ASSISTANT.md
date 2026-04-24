# 🤖 LLM Assistant Prompt

**Copy this prompt and paste it into Claude, ChatGPT, or any AI to get help with YouTube Vault.**

---

## How to Use This

1. Copy the prompt below (everything between the dashes)
2. Open Claude (claude.ai), ChatGPT, or your favorite AI
3. Paste the prompt into a new conversation
4. Ask your question

The AI will have full context about YouTube Vault and can help you troubleshoot, understand how it works, or make changes.

---

## 📋 Copy This Prompt

```
You are an expert assistant for YouTube Vault, a self-hosted YouTube video scraper and note organizer for Obsidian.

## Project Structure

YouTube Vault has these main components:

**Backend (Node.js service):**
- Location: `logic-engine/` directory
- Entry point: `main.js` (the scraper process)
- Server: `server.js` (HTTP API on localhost:3000)
- Service manager: PM2 (background process manager)

**Frontend (Obsidian vault):**
- Location: `obsidian-vault/` directory
- Control panel: `99-Service-Controls.md` (UI to start/stop scraper)
- Input folder: `clippings/` (where users drop YouTube URLs)
- Output folders: `videos/`, `topics/`, `channels/` (generated notes)

**Configuration:**
- `logic-engine/config/config.json` — App settings
- `logic-engine/config/channels.json` — Channel list
- `logic-engine/config/history.json` — Processed videos log
- `logic-engine/ecosystem.config.js` — PM2 configuration

## How It Works

1. User drops a YouTube URL into `obsidian-vault/clippings/`
2. Service watcher detects the new file
3. Scraper extracts the channel ID and fetches videos via RSS
4. Videos are processed and converted to markdown notes
5. Notes appear in Obsidian organized by channel, topic, and date
6. Service runs continuously in background via PM2

## Technology Stack

- **Runtime:** Node.js 18+
- **Package Manager:** npm
- **Process Manager:** PM2 (keeps service running, auto-restarts)
- **File Watching:** chokidar
- **Data Storage:** JSON files in `logic-engine/config/`
- **Frontend:** Obsidian + Dataview plugin
- **Communication:** HTTP REST API

## Common Issues

**"Service unavailable"** — PM2 process crashed. Fix: `pm2 restart yt-vault-service`

**"Cannot find module 'chokidar'"** — Dependencies not installed. Fix: `cd logic-engine && npm install`

**Service starts then stops** — Check logs: `pm2 logs yt-vault-service`

**Videos not appearing** — Is scraper running? Did you put a URL in `clippings/`? Check logs.

## Key Commands

```bash
pm2 status                           # Check if service is running
pm2 logs yt-vault-service            # View service logs
pm2 restart yt-vault-service         # Restart service
pm2 stop yt-vault-service            # Stop service
npm run pm2-start                    # Start service (from logic-engine/)
bash INSTALL.sh                      # One-command installer (from repo root)
```

## What I Need Help With

[USER DESCRIBES THEIR QUESTION/ISSUE HERE]

Please help me with the YouTube Vault setup/issue described above. Ask clarifying questions if needed, and provide specific commands or code changes if applicable.
```

---

## Example Usage

### Example 1: Troubleshooting

**Your message:**
```
I pasted the LLM Assistant prompt into Claude.

Then I asked:

"I'm trying to set up YouTube Vault but when I run bash INSTALL.sh, it says 'command not found: npm'. I'm on macOS. What do I do?"
```

**Claude will know:**
- You need Node.js installed
- npm comes with Node.js
- The INSTALL.sh script should handle this automatically
- How to fix it (download Node.js, try again)

### Example 2: Understanding Features

**Your message:**
```
I'm using YouTube Vault and I want to know: how does the scraper decide what topics to assign to each video? Where is that logic?
```

**Claude will know:**
- Topics are generated in `logic-engine/utils/topic-merger.js`
- The algorithm uses keywords from video titles and descriptions
- How to modify it if you want different behavior

### Example 3: Making Changes

**Your message:**
```
I want to modify the scraper to also fetch video thumbnails. What files do I need to change? Walk me through the changes.
```

**Claude will know:**
- You need to modify `processor.js` to extract thumbnail URLs
- You need to modify `generator.js` to save thumbnails to notes
- Where to make each change, step-by-step

---

## Why This Works

The prompt tells the AI:
- ✓ The complete project structure
- ✓ How components connect
- ✓ The technology stack
- ✓ Common issues and solutions
- ✓ Key commands to use

With this context, the AI can:
- Answer questions accurately
- Suggest fixes for errors
- Help you modify the code
- Explain how features work
- Debug issues with you

---

## Tips for Best Results

1. **Be specific** — Instead of "it doesn't work," say "when I click the Start button, the status shows ⚠️ Service unavailable"

2. **Share error messages** — Copy exact error text from logs or terminal

3. **Ask for step-by-step help** — "Walk me through how to add a new feature"

4. **Ask about your environment** — "I'm on Windows WSL, does that matter?"

5. **Share relevant logs** — Copy the output of `pm2 logs yt-vault-service` if having issues

---

## When to Use This

| Situation | Use This? |
|-----------|-----------|
| Service won't start | ✓ Yes |
| Want to understand the architecture | ✓ Yes |
| Need to modify code | ✓ Yes |
| Videos not appearing | ✓ Yes |
| Want to add a new feature | ✓ Yes |
| Simple question about Obsidian | ✗ No (use Obsidian docs instead) |
| General Node.js questions | ✓ Probably (AI has context) |

---

## What Happens Next

1. You paste the prompt into Claude/ChatGPT
2. The AI loads the context about YouTube Vault
3. You describe your issue or question
4. The AI responds with:
   - Clear explanation
   - Specific commands to run
   - Code changes if needed
   - Troubleshooting steps

---

## Your AI Can Now Help With

- ✓ Installation issues
- ✓ Troubleshooting errors
- ✓ Understanding how features work
- ✓ Modifying code
- ✓ Adding new features
- ✓ Performance optimization
- ✓ Debugging the scraper
- ✓ Configuring PM2
- ✓ General development questions

---

**Good luck with YouTube Vault! 🚀**

For documentation, see: COMPLETE_GUIDE.md
