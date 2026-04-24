# Codebase Structure

**Analysis Date:** 2026-04-24

## Directory Layout

```
yt-vault/
├── logic-engine/                    # Node.js pipeline engine
│   ├── main.js                      # Watcher entry point + orchestrator
│   ├── engine.js                    # YouTube resolver/harvester (web scraping)
│   ├── processor.js                 # NLP topic extraction
│   ├── reviewer.js                  # Validation & utilities
│   ├── package.json                 # Dependencies (chokidar, rss-parser, compromise, gray-matter)
│   ├── package-lock.json            # Locked versions
│   ├── channels.json                # Channel metadata store
│   ├── history.json                 # Processed video ID history
│   ├── logs/                        # Daily run logs
│   │   └── run-{YYYY-MM-DD}.log     # Timestamped log entries
│   ├── scripts/
│   │   └── health-check.js          # System readiness validator
│   └── node_modules/                # Installed dependencies
│
├── obsidian-vault/                  # Obsidian knowledge base (user-facing)
│   ├── clippings/                   # INPUT: User drops YouTube URLs here
│   │   └── *.md                     # Clipping files (YAML frontmatter + notes)
│   │
│   ├── videos/                      # OUTPUT: Generated video notes (auto)
│   │   └── {title}-{videoId}.md     # One file per video with metadata + dataview
│   │
│   ├── topics/                      # OUTPUT: Generated topic index pages (auto)
│   │   └── {Topic Label}.md         # One file per extracted topic, contains dataview query
│   │
│   ├── channels/                    # OUTPUT: Generated channel index pages (auto)
│   │   └── {Channel Name}.md        # One file per creator, lists all their videos
│   │
│   ├── Bases/                       # Obsidian database views
│   │   └── scrapedVideos.base       # Table view configuration for database view
│   │
│   ├── .obsidian/                   # Obsidian app configuration
│   │   ├── app.json                 # App settings
│   │   ├── appearance.json          # Theme settings
│   │   ├── community-plugins.json   # Enabled plugins: ["dataview"]
│   │   ├── core-plugins.json        # Obsidian core plugins
│   │   ├── plugins/                 # Plugin data
│   │   ├── types.json               # Metadata about note types
│   │   └── workspace.json           # Window/pane layout
│   │
│   ├── Dashboard.md                 # User-facing home page + quick links
│   ├── YouTube Intelligence.md      # Documentation/guide
│   └── {other-user-files}.md        # User's own notes (untracked by system)
│
├── .planning/                       # GSD planning documents
│   └── codebase/                    # Codebase analysis (THIS DIRECTORY)
│       ├── STACK.md                 # Technology stack & dependencies
│       ├── INTEGRATIONS.md          # External APIs & services
│       ├── ARCHITECTURE.md          # System design & layers (you are here)
│       ├── STRUCTURE.md             # File organization & module structure
│       ├── CONVENTIONS.md           # Coding patterns & style
│       └── TESTING.md               # Test framework & patterns
│
├── .claude/                         # Claude Code workspace config
├── .cursor/                         # Cursor IDE workspace config
├── .agents/                         # GSD agent config
├── .caliber/                        # Caliber workflow config
├── .git/                            # Git repository
├── .gitignore                       # Git exclude patterns
├── README.md                        # Project documentation
└── LICENSE                          # MIT license (implicit)
```

## Directory Purposes

**logic-engine/:**
- Purpose: Node.js pipeline that watches for YouTube clippings and generates vault content
- Contains: Core business logic modules, entry point, state files, logs, scripts
- Key files: `main.js` (orchestrator), `engine.js` (YouTube integration), `processor.js` (NLP), `reviewer.js` (validation)
- Access: Run `npm install` then `node main.js` to start
- Output: Generates markdown files directly into `obsidian-vault/` directories

**obsidian-vault/:**
- Purpose: User-facing knowledge base; both input folder (clippings/) and output folders (videos/, topics/, channels/)
- Contains: Obsidian app config, generated documents, user notes, database views
- Input: `clippings/` folder where user drops YouTube clipping instructions
- Output: `videos/`, `topics/`, `channels/` auto-populated by pipeline
- Vault root: Configurable via VAULT_ROOT env var, defaults to this directory
- Plugin: Requires Dataview plugin for dynamic queries in generated notes

**clippings/:**
- Purpose: User input folder; drop YAML frontmatter + markdown files here to trigger pipeline
- Example file: `clippings/My Video Channel.md`
- Format: YAML frontmatter with `source: {YouTube URL}` field + optional body notes
- Lifecycle: File detected → processed → left as-is (optionally user can delete after)
- Naming: Any `.md` filename; only `source` field in frontmatter matters

**videos/:**
- Purpose: Auto-generated video index; one file per processed YouTube video
- Files: `{sanitized-title}-{videoId}.md`
- Content: YAML frontmatter (title, source, channel, channel_id, video_id, topics[], date, type: video) + markdown body with template
- Ownership: 100% generated; manual edits won't persist across pipeline runs
- Linking: References channels via `[[channelName]]`, topics via `[[TopicLabel]]`

**topics/:**
- Purpose: Auto-generated topic index; one file per extracted topic label
- Files: `{Topic Label}.md`
- Content: Dataview query that lists all videos containing this topic via outlinks
- Ownership: 100% generated; skeleton only, no body beyond query
- Linking: Backlinked from video notes via `[[Topic]]` wikilinks

**channels/:**
- Purpose: Auto-generated channel index; one file per creator whose videos were processed
- Files: `{Channel Title}.md`
- Content: Frontmatter (channel_id, title, type: channel) + dataview query listing all videos from creator
- Ownership: 100% generated
- Linking: Referenced from video notes via channel field

**.obsidian/:**
- Purpose: Obsidian app configuration and plugin data
- Key file: `community-plugins.json` declares `["dataview"]` as required plugin
- Dataview: Powers dynamic tables in topic and channel files (queries run when note is opened)

**logs/:**
- Purpose: Operation logs for debugging and monitoring
- Files: `run-{YYYY-MM-DD}.log` (one per day, append-only)
- Format: `[ISO-8601-timestamp] [phase] action : detail`
- Rotation: New file created each calendar day
- Retention: Never auto-deleted; manual cleanup required

**scripts/:**
- Purpose: Utility scripts for system administration
- health-check.js: Validates prerequisites (Node version, vault accessible, dependencies installed)

## Key File Locations

**Entry Points:**

- `logic-engine/main.js`: Primary watcher + orchestrator
  - Export: startWatcher() initializes chokidar, logs setup
  - Main logic: processClipping(path) → orchestrates entire pipeline
  - Start command: `node main.js` or `npm start` from logic-engine/

- `logic-engine/reviewer.js`: Self-test validator
  - Command: `node reviewer.js --self-test`
  - Purpose: Validate internal correctness of validators

**Configuration:**

- `logic-engine/package.json`: Dependency manifest
  - Runtime: Node.js 18+
  - Dependencies: chokidar (file watching), rss-parser (YouTube RSS), compromise (NLP), gray-matter (YAML parsing)
  - Scripts: start, health, self-test

- `obsidian-vault/.obsidian/community-plugins.json`: Obsidian plugin list
  - Required: dataview (used in topic/channel index files)

**Core Logic:**

- `logic-engine/main.js` (434 lines): Main logic orchestrator
  - getVaultRoot(): Resolves vault path from env or default
  - extractYoutubeUrlFromBody(): Regex URL search
  - extractVideoIdFromUrl(): URL → video ID extraction
  - extractClipSource(): Parse clipping file for YouTube source
  - buildVideoMarkdown(): Template for video notes
  - buildTopicMarkdown(): Template for topic stubs
  - processClipping(): Main pipeline orchestrator
  - scheduleProcess(): Debounced file handler
  - startWatcher(): Initialize chokidar listener

- `logic-engine/engine.js` (125 lines): YouTube integration
  - extractChannelIdFromHtml(): Regex extraction (3 patterns)
  - fetchWatchPageHtml(): HTTP fetch with User-Agent
  - resolveChannelIdFromVideo(): Fetch page → extract channel ID
  - rssUrlForChannel(): Construct YouTube RSS URL
  - fetchChannelFeedVideoItems(): Parse RSS, normalize items

- `logic-engine/processor.js` (190 lines): Topic extraction
  - extractCandidateTopics(): NLP analysis of title
  - topicsToWikiLinks(): Format topics as wikilinks

- `logic-engine/reviewer.js` (185 lines): Validation utilities
  - sanitizeFilename(): Remove invalid chars
  - validateChannelId(): Format validation
  - validateVideo(): Metadata validation
  - parseFrontmatter(): YAML parsing
  - cleanTopics(): Dedupe + filter + blacklist
  - toPascalCaseWords(): Normalize topic case

**State Files:**

- `logic-engine/channels.json`: Channel metadata store
  - Schema: `{ channels: Record<channelId, {sourceVideoId?, feedTitle?, resolvedAt}> }`
  - Updated: During channel resolution and feed fetch
  - Purpose: Remember which channels have been processed

- `logic-engine/history.json`: Video ID history
  - Schema: `{ videoIds: [id1, id2, ...] }`
  - Updated: Append-only after each video is processed
  - Purpose: Prevent duplicate video notes
  - Size: Grows indefinitely over time

**Generated Documents:**

- `obsidian-vault/videos/{title}-{videoId}.md`
  - Template: YAML frontmatter + markdown body
  - Fields: title, source (full URL), channel (plaintext), channel_id, video_id, topics[], date, type: video, tags: [youtube/video]
  - Body: # Heading, **Channel:** [[wikilink]], ## Topics (wikilinks), ## Notes (empty for user)

- `obsidian-vault/topics/{Topic Label}.md`
  - Content: Single dataview code block
  - Query: TABLE title, source, date FROM "videos" WHERE contains(file.outlinks, this.file.link) SORT date DESC

- `obsidian-vault/channels/{Channel Name}.md`
  - Template: Frontmatter + markdown body
  - Fields: channel_id, title, type: channel
  - Body: Watch link + dataview TABLE query listing all videos from channel

## Naming Conventions

**Files:**

- Video notes: `{sanitized-title}-{videoId}.md`
  - Example: `Why Apple's Great Year Doesn't Feel Great-HNy8BtG9OKs.md`
  - Title: Truncated to 120 chars, spaces/special chars sanitized
  - Video ID: Exact 11-char YouTube ID appended

- Topic files: `{Sanitized Topic Label}.md`
  - Example: `AI Agents Design.md`
  - Sanitization: Remove invalid filename chars, collapse spaces, title-case words
  - Unicode: Converted to ASCII equivalents where possible

- Channel files: `{Feed Title}.md`
  - Example: `Shreya Heda.md`
  - Name: Taken directly from YouTube RSS feed (may contain special chars in rare cases)

**Directories:**

- Flat structure: No subdirectories within videos/, topics/, channels/
- All files at root level for easy discovery in Obsidian

## Where to Add New Code

**New Feature (adding pipeline stage):**
- Implement in separate module: `logic-engine/{feature}.js`
- Export public functions, keep private helpers internal
- Call from processClipping() orchestrator in main.js
- Add validation logic to reviewer.js for new data types

**New Utility Function:**
- Add to `logic-engine/reviewer.js` if validation/general purpose
- Add to relevant module (engine.js, processor.js) if domain-specific
- Export from module.exports
- Add self-test case to reviewer.js --self-test

**Bug Fix:**
- Locate in relevant module (main.js orchestrator, engine.js YouTube, processor.js NLP, reviewer.js validation)
- Add test case to reviewer.js --self-test if it's a validation bug
- Log relevant phase/action before fix in main.js if it's a pipeline bug

## Special Directories

**node_modules/:**
- Purpose: Installed dependencies (created by npm install)
- Generated: Yes (via package-lock.json)
- Committed: No (in .gitignore)
- Size: ~100MB+ (includes chokidar, rss-parser, compromise, gray-matter + transitive deps)

**logs/:**
- Purpose: Operation logs for debugging
- Generated: Yes (created on first run)
- Committed: No (in .gitignore, logs/ likely excluded)
- Rotation: New file created each calendar day (run-{YYYY-MM-DD}.log)

**.obsidian/plugins/:**
- Purpose: Dataview plugin data (if installed)
- Generated: Yes (created by Obsidian when plugin installed)
- Committed: Varies (may be in git for reproducibility)

---

*Structure analysis: 2026-04-24*
