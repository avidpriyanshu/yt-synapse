# Technology Stack

**Analysis Date:** 2026-04-24

## Languages

**Primary:**
- JavaScript (Node.js) - All core logic, watcher, and processing
- Markdown - Documentation and generated vault notes

## Runtime

**Environment:**
- Node.js 18+ (required by `engines` field in `package.json`)

**Package Manager:**
- npm 9+ (inferred from lockfile version 3)
- Lockfile: `package-lock.json` present at `/Users/avid/Desktop/yt-vault/logic-engine/package-lock.json`

## Frameworks & Core Libraries

**File System Watching:**
- `chokidar` 4.0.3 - Monitors `obsidian-vault/clippings/` directory for new/changed markdown files
  - Location: `/Users/avid/Desktop/yt-vault/logic-engine/main.js` (line 5)
  - Purpose: Real-time detection of clipping files to trigger processing

**Natural Language Processing:**
- `compromise` 14.15.0 - NLP for topic extraction from video titles
  - Location: `/Users/avid/Desktop/yt-vault/logic-engine/processor.js` (line 3)
  - Purpose: Extract people, places, proper nouns, and noun phrases from YouTube video titles
  - Dependencies: `efrt`, `grad-school`, `suffix-thumb`

**Front Matter Parsing:**
- `gray-matter` 4.0.3 - YAML frontmatter extraction from markdown
  - Location: `/Users/avid/Desktop/yt-vault/logic-engine/reviewer.js` (line 9)
  - Purpose: Parse video metadata from clipping file frontmatter

**RSS Parsing:**
- `rss-parser` 3.13.0 - YouTube channel RSS feed parsing
  - Location: `/Users/avid/Desktop/yt-vault/logic-engine/engine.js` (line 3)
  - Purpose: Fetch video metadata from YouTube channel feeds
  - Custom fields configured for YouTube-specific data: `yt:videoId`, `yt:channelId`

## Key Dependencies (Transitive)

**Utility Libraries:**
- `readdirp` 4.0.1 - Recursive directory reading (via chokidar)
- `js-yaml` - YAML parsing (via gray-matter)
- `entities` 2.2.0 - HTML entity parsing (via rss-parser)
- `xml2js` - XML parsing (via rss-parser)
- `sax` - SAX XML parser (via xml2js)
- `argparse` 1.0.10 - CLI argument parsing (via js-yaml)

## Configuration

**Environment Variables:**
- `VAULT_ROOT` - Path to Obsidian vault (defaults to `../obsidian-vault` relative to logic-engine)
  - Set via: `process.env.VAULT_ROOT` in `/Users/avid/Desktop/yt-vault/logic-engine/main.js` (line 14-17)
  - Usage: `VAULT_ROOT=/path/to/vault npm start`
- `CHOKIDAR_POLLING` - Enable polling mode instead of native file system events (set to '1' or 'true')
  - Usage in: `/Users/avid/Desktop/yt-vault/logic-engine/main.js` (line 400-402)
  - Purpose: Workaround for systems with limited file descriptor limits

**Build/Development:**
- No build step (pure Node.js scripts)
- No dev dependencies defined

## Scripts

**Run Commands:**
- `npm start` → `node main.js` - Start the file watcher
- `npm run health` → `node scripts/health-check.js` - Verify wikilink integrity
- `npm run self-test` → `node reviewer.js --self-test` - Unit test validation

## Platform Requirements

**Development:**
- macOS, Linux, or Windows with Node.js 18+
- Obsidian application installed separately
- File system that supports efficient file watching (native inode/FSEvents on macOS/Linux)

**Production/Usage:**
- Headless Node.js 18+ runtime
- Read/write access to Obsidian vault directory
- Network access to YouTube.com for:
  - Video page HTML fetching (`https://www.youtube.com/watch?v={videoId}`)
  - RSS feed fetching (`https://www.youtube.com/feeds/videos.xml?channel_id={channelId}`)

## Architecture Notes

**Monolithic Script Structure:**
- No module bundler or transpiler (vanilla Node.js CommonJS)
- Single execution context, no process separation
- Direct file I/O for state management (JSON files: `channels.json`, `history.json`)
- Console logging with local file-based audit trail (`logs/run-YYYY-MM-DD.log`)

**External API Usage:**
- YouTube watch page HTML scraping (no API key required)
- YouTube RSS feeds (public, no authentication)
- Native `fetch()` API for HTTP requests (Node.js 18+ built-in)

---

*Stack analysis: 2026-04-24*
