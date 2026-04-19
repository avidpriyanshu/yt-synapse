# yt-synapse 🧠

**Turn every YouTube video you watch into permanent, searchable knowledge.**

Automatically extract videos from your favorite channels, organize them by topic, and build a knowledge graph in Obsidian. Then connect that knowledge to Claude, ChatGPT, or any AI to power your research, learning, and creative work.

---

## What is yt-synapse?

yt-synapse is a self-hosted YouTube intelligence pipeline that:

1. **Watches** a folder in your Obsidian vault for clipping instructions
2. **Resolves** the YouTube channel, fetches its RSS feed, and pulls the latest videos
3. **Generates** structured markdown notes with automatic topic extraction
4. **Organizes** videos by channel, topic, and date—all as wikilinks in Obsidian
5. **Syncs** everything into your vault as a searchable, AI-compatible knowledge base

Think of it as your YouTube → Brain interface. Videos don't just disappear from your watch history—they become permanent, indexed knowledge you can search, link, and reason about.

---

## Who is this for?

- **Researchers** — systematically harvest video sources and cross-reference them
- **Students** — turn educational YouTube channels into study notes and topic maps
- **Content creators** — track inspiration and track what you've learned from other creators
- **AI-powered thinkers** — attach your vault to Claude or ChatGPT to enhance your reasoning with video knowledge
- **Knowledge workers** — build a personal Wikipedia from your favorite creators

---

## How it works

```
┌──────────────────────────────────────────────────────────┐
│ 1. Drop a clipping into obsidian-vault/clippings/        │
│    (contains a YouTube URL or channel reference)         │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│ 2. Node.js watcher detects the file                      │
│    - Extracts video/channel ID                           │
│    - Fetches RSS feed for that channel                   │
│    - Pulls ~15 most recent videos                        │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│ 3. Pipeline generates markdown notes                     │
│    - Video note: title, source, channel, topics, date    │
│    - Topic stubs: wikilinks to group videos              │
│    - Channel page: index of all videos from creator      │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│ 4. Everything appears in Obsidian                        │
│    - Open the Bases view to see all scraped videos       │
│    - Click channel names to see all videos from that     │
│    - Explore topics to discover related videos           │
│    - Use graph view to see connections                   │
└──────────────────────────────────────────────────────────┘
```

---

## Installation

### Prerequisites

- **Node.js** 18+ ([install here](https://nodejs.org))
- **Obsidian** (free, [download here](https://obsidian.md))
- A YouTube channel URL (from the video you want to track)

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/yt-synapse.git
cd yt-synapse
```

### 2. Install dependencies

```bash
cd logic-engine
npm install
cd ..
```

### 3. (Optional) Point to your vault

If your Obsidian vault is in a different location, set the `VAULT_ROOT` environment variable:

```bash
export VAULT_ROOT=/path/to/your/obsidian/vault
```

By default, it points to `obsidian-vault/` in this repo.

### 4. Start the watcher

```bash
cd logic-engine
node main.js
```

Leave this running in a terminal. It watches `obsidian-vault/clippings/` for new markdown files.

---

## Usage

### Basic workflow

1. **Create a clipping file** in `obsidian-vault/clippings/` with a YouTube URL in the frontmatter:

   **Example:** `clippings/awesome-channel.md`
   ```markdown
   ---
   source: https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ---

   Notes about this video or channel...
   ```

2. **Save the file.** The watcher detects it automatically.

3. **Check your vault.** New video notes appear in `obsidian-vault/videos/`:
   - Each video gets a markdown file with title, channel, topics, and publish date
   - The channel gets its own index page in `channels/`
   - New topics are created as wikilinks

4. **Explore in Obsidian:**
   - Open the **Bases** view to see all videos in a table
   - Click a **channel name** to see all videos from that creator
   - Click a **topic** to see all videos tagged with that theme
   - Use **Graph View** to see the knowledge network

### File structure

```
obsidian-vault/
├── clippings/              ← Drop your clipping files here
├── videos/                 ← Generated video notes (auto)
├── topics/                 ← Generated topic index pages (auto)
├── channels/               ← Generated channel index pages (auto)
├── Bases/
│   └── scrapedVideos.base  ← Table view of all videos
├── Dashboard.md            ← Quick access to views
└── .obsidian/              ← Obsidian config (includes Dataview plugin)
```

---

## Frontmatter fields

Every generated video note has:

| Field | Example | Purpose |
|-------|---------|---------|
| `title` | "Why I Left Google" | Video title |
| `source` | "https://youtube.com/watch?v=..." | YouTube URL |
| `channel` | `[[channels/My Creator]]` | Wikilink to channel page |
| `channel_id` | `UCxxxxxxxxxxxxxx` | YouTube channel ID (for reference) |
| `video_id` | `dQw4w9WgXcQ` | YouTube video ID (11 chars) |
| `topics` | `[[AI]], [[Ethics]]` | Auto-extracted topics |
| `date` | `2025-03-15` | Publish date |
| `type` | `video` | Document type (used for filtering) |
| `tags` | `youtube/video` | Tag for Bases filtering |

---

## Future use cases

### AI-powered research

**Attach your vault to Claude or ChatGPT:**

Copy your `obsidian-vault/` and feed it to Claude's file upload or ChatGPT's plugin:

```
Me: "I've uploaded my YouTube vault. Summarize all videos 
about AI safety and highlight the key arguments."

Claude: Analyzes your vault and returns a synthesis of your 
video knowledge, complete with source links.
```

This turns your personal video library into an AI-augmented knowledge base.

### Automatic topic mapping

Future versions will use NLP to:
- Smarten topic extraction (avoid fragments and noise)
- Suggest topic merges ("Machine Learning" ← "ML" ← "Deep Learning")
- Build topic hierarchies (Philosophy > Ethics > AI Ethics)
- Auto-tag videos based on transcript analysis

### Cross-vault knowledge graphs

Link your yt-synapse vault to other Obsidian vaults:
- Connect videos to your book notes
- Relate channels to the authors/researchers who created them
- Build a knowledge graph across all your learning sources

### Transcript ingestion

Use YouTube's auto-generated transcripts (via the YouTube API) to:
- Index searchable content from videos
- Extract time-stamped quotes
- Find specific moments across your library

### Readwise-style review

Implement scheduled "review" prompts:
- "Here are 3 random videos you saved. Any new insights?"
- Spaced repetition for video knowledge
- Export highlights from videos you annotated

---

## How to contribute

This project is open source and welcomes contributions:

1. **Fork** the repo
2. **Create a branch** for your feature (`git checkout -b feature/smarter-topics`)
3. **Make changes** and test thoroughly
4. **Submit a PR** with a clear description of what you changed and why

### Areas we need help with:

- Improving topic extraction (better NLP, smarter deduplication)
- Adding transcript support
- Building UI for better visualization
- Docker support for easier deployment
- Tests and CI/CD

---

## Roadmap

- [ ] Smart topic extraction (transcript-based, AI-assisted)
- [ ] Scheduled transcript sync from YouTube API
- [ ] Dataview dashboard with insights (videos per channel, top topics, etc.)
- [ ] Export to Roam Research, Logseq, and other tools
- [ ] Mobile app for adding clips
- [ ] Integration with Readwise for spaced repetition
- [ ] API endpoint for external tools
- [ ] Web UI for browsing your vault

---

## Troubleshooting

### "No channel ID found"
The YouTube channel wasn't resolvable. Try:
- Check the URL is a valid YouTube watch page
- Wait 30 seconds and re-try (rate limiting)

### "Videos aren't appearing in Obsidian"
1. Check that `VAULT_ROOT` points to the correct vault
2. Verify the watcher is still running (check the terminal)
3. Check `logic-engine/logs/` for error messages
4. Reload Obsidian (Cmd/Ctrl+R or restart the app)

### "Topics are weird/noisy"
Topic extraction uses heuristics and will improve over time. For now:
- You can manually edit topic files in `topics/`
- We're working on smarter extraction for the next release

---

## License

MIT. You're free to use, modify, and distribute this however you want.

---

## Questions?

[Open an issue](https://github.com/yourusername/yt-synapse/issues) or reach out.

**Happy learning!** 🎥📚
