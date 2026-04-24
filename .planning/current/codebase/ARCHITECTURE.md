# Architecture

**Analysis Date:** 2026-04-24

## Pattern Overview

**Overall:** Event-driven pipeline with file system watcher → content processor → knowledge base generator

**Key Characteristics:**
- Filesystem-based trigger system (clipping detection)
- Multi-stage processing pipeline (URL extraction → channel resolution → RSS fetch → content generation)
- Dual-system architecture: Node.js logic engine controls Obsidian vault generation
- State management via JSON files (channels.json, history.json)
- Template-based markdown generation with wikilink interconnection
- Integration with Obsidian Dataview plugin for dynamic queries

## Layers

**Watcher Layer:**
- Purpose: Monitor clippings folder for new or modified markdown files, debounce, and schedule processing
- Location: `logic-engine/main.js` lines 385-419
- Contains: File system event handlers (chokidar), debounce logic (800ms)
- Depends on: chokidar library, ReviewAgent module
- Used by: Entry point for entire pipeline

**Extractor Layer:**
- Purpose: Parse clipping files and extract YouTube URLs from YAML frontmatter or markdown body
- Location: `logic-engine/main.js` lines 85-144
- Contains: URL regex parsing, video ID extraction, frontmatter parsing via gray-matter
- Depends on: ReviewAgent.parseFrontmatter()
- Used by: Orchestrator (processClipping function)

**Resolver Layer:**
- Purpose: Identify channel ID from a given video ID by fetching and parsing YouTube watch page HTML
- Location: `logic-engine/engine.js` lines 24-71
- Contains: HTML fetching with User-Agent header, channel ID regex extraction (3 fallback patterns), validation
- Depends on: ReviewAgent.validateChannelId(), native fetch API
- Used by: Main orchestrator

**Harvester Layer:**
- Purpose: Fetch RSS feed for a channel and extract video metadata (title, link, videoId, pubDate)
- Location: `logic-engine/engine.js` lines 73-115
- Contains: RSS parsing via rss-parser, item normalization, pubDate extraction
- Depends on: rss-parser library
- Used by: Main orchestrator

**Processor Layer:**
- Purpose: Extract topic labels from video titles using NLP and heuristics
- Location: `logic-engine/processor.js`
- Contains: NLP via compromise library, topic label validation, clickbait filtering, blacklist enforcement
- Depends on: compromise (NLP), ReviewAgent.cleanTopics()
- Used by: Generator layer

**Generator Layer:**
- Purpose: Create markdown files in Obsidian vault (video notes, topic stubs, channel pages)
- Location: `logic-engine/main.js` lines 146-229
- Contains: Markdown template functions (buildVideoMarkdown, buildTopicMarkdown), YAML frontmatter escaping
- Depends on: ReviewAgent validation functions
- Used by: Main orchestrator

**State Management Layer:**
- Purpose: Maintain processed video history and channel metadata
- Location: `logic-engine/main.js` lines 38-83, files: `logic-engine/channels.json`, `logic-engine/history.json`
- Contains: Atomic JSON writes, history set operations, channel record upserts
- Depends on: Node.js fs module, path module
- Used by: Harvester (to filter duplicates), Orchestrator (to track channels)

**Validation Layer:**
- Purpose: Centralized validation for filenames, channel IDs, videos, and YAML syntax
- Location: `logic-engine/reviewer.js`
- Contains: Regex validators, sanitizers, topic cleaning with blacklist, self-test suite
- Depends on: gray-matter library (YAML parsing)
- Used by: All layers throughout pipeline

## Data Flow

**Main Pipeline:**

1. **File Detection** (Watcher Layer)
   - chokidar watches `obsidian-vault/clippings/` directory
   - Detects `.md` file add or change events
   - Debounced 800ms to allow file writes to complete
   - Schedules `processClipping(absPath)` via setTimeout

2. **Source Extraction** (Extractor Layer)
   - Read raw markdown file from clippings/
   - Parse YAML frontmatter using gray-matter
   - Look for `source`, `Source`, `url`, or `link` fields
   - Fall back to regex search in markdown body for YouTube URL
   - Extract 11-character video ID from URL (validates format: alphanumeric + hyphen/underscore)
   - Return `{ok: true, source, videoId}` or `{ok: false, reason}`

3. **Channel Resolution** (Resolver Layer)
   - Fetch YouTube watch page HTML for the video ID
   - Apply 3 regex patterns to extract channel ID (UC-prefixed, 24 chars total)
   - Validate channel ID format (UC + 22 alphanumeric/hyphen/underscore chars)
   - Store in `channels.json` with sourceVideoId and timestamp
   - Return channel ID or null (signals retry-later)

4. **Feed Harvesting** (Harvester Layer)
   - Construct YouTube RSS feed URL: `https://www.youtube.com/feeds/videos.xml?channel_id={channelId}`
   - Parse XML feed using rss-parser with custom field mappings
   - Extract up to 20 video entries from feed
   - Normalize each entry: title, link, videoId, pubDate
   - Filter against history.json to skip already-processed videos
   - Load only fresh videos (up to VIDEO_BATCH=15 maximum)
   - Return fresh batch with metadata

5. **Topic Extraction** (Processor Layer)
   - Run NLP analysis on video title using compromise library:
     - Extract named people (doc.people())
     - Extract named places (doc.places())
     - Extract noun phrases (#Noun+)
     - Match capitalized sequences (potential proper nouns)
     - Extract acronyms (2-10 char ALL_CAPS strings)
   - Filter by label plausibility:
     - Length 3-50 characters
     - No clickbait terms (watch, must, insane, crazy, etc.)
     - No stop words (you, the, and, for, etc.)
     - No @#, punctuation-only, URLs, first-person pronouns
     - No trailing prepositions
   - Deduplicate by lowercase mapping
   - Apply blacklist, limit to max 7 topics
   - Return `[Topic1, Topic2, ...]`

6. **Markdown Generation** (Generator Layer)
   - For each fresh video:
     - Create video note: `{sanitized-title}-{videoId}.md` in `obsidian-vault/videos/`
     - YAML frontmatter: title, source, channel (plaintext), channel_id, video_id, topics[] (array), date, type: video, tags: [youtube/video]
     - Body: # heading, **Channel:** wikilink, ## Topics section with wikilinks, ## Notes (empty for user)
   - For each unique topic label:
     - Create topic stub: `{sanitized-label}.md` in `obsidian-vault/topics/`
     - Body: dataview query that finds all videos linking to this topic via outlinks
   - Create/update channel index: `{channelTitle}.md` in `obsidian-vault/channels/`
     - Body: dataview query listing all videos from that channel sorted by date desc

7. **State Tracking & Logging**
   - Atomically update `history.json`: append new videoIds to array
   - Log each phase: `[phase] action : detail`
   - Dual output: console.log() + append to `logs/run-{YYYY-MM-DD}.log`
   - Structured sync report: `[sync] videos_added=N topics_created=M channel={id}`

**State Objects:**

- **channels.json**: `{ channels: Record<channelId, { sourceVideoId?, feedTitle?, resolvedAt }> }`
  - Updated when channel resolved (channelId + sourceVideoId added)
  - Updated when feed fetched (feedTitle added)
  - Used to remember which channels processed
  - Key: YouTube channel ID (UC-prefixed 24 chars)
  - Value: Metadata object with resolution timestamp

- **history.json**: `{ videoIds: [id1, id2, ...] }`
  - Append-only list of processed video IDs (11-char codes)
  - Checked before processing to prevent duplicate notes
  - Never purged (grows indefinitely over time)
  - Used as Set for O(1) lookups during harvesting

## Key Abstractions

**ReviewAgent Module (`logic-engine/reviewer.js`):**
- Purpose: Centralized validation and utility functions
- Pattern: Single-export module with pure functions
- Exports: sanitizeFilename(), validateFilename(), validateChannelId(), validateVideo(), parseFrontmatter(), cleanTopics(), toPascalCaseWords(), checkFileExists()
- Constants: DEFAULT_TOPIC_BLACKLIST (13 terms), INVALID_FILENAME_CHARS regex
- Used: Throughout pipeline for consistency

**Engine Module (`logic-engine/engine.js`):**
- Purpose: Encapsulate all YouTube web scraping and API logic
- Pattern: Async functions for HTTP requests and HTML/XML parsing
- Exports: resolveChannelIdFromVideo(), fetchWatchPageHtml(), extractChannelIdFromHtml(), fetchChannelFeedVideoItems(), rssUrlForChannel()
- Constants: BROWSER_UA (Chrome user agent), YT_HOST
- Isolation: All YouTube integration centralized here

**Processor Module (`logic-engine/processor.js`):**
- Purpose: Encapsulate NLP and topic extraction heuristics
- Pattern: Pure functions for text analysis
- Exports: extractCandidateTopics(), topicsToWikiLinks()
- Constants: CLICKBAIT, STOP_LABELS, mergedBlacklist sets
- Separation: NLP library (compromise) dependency isolated here

**Clipping (Input Document Type):**
- Purpose: User instruction file dropped into clippings/ folder
- Format: YAML frontmatter + markdown body
- Key fields: `source` (YouTube URL), `title` (optional), body notes (optional)
- Location: `obsidian-vault/clippings/{name}.md`
- Lifecycle: Detected → Validated → Processed → Typically left as-is (not deleted)

**Video Note (Primary Output Document):**
- Purpose: Represent a single processed video in vault
- Format: YAML frontmatter + markdown template
- Fields: title, source (full URL), channel (plaintext), channel_id, video_id, topics[] (array of wikilinks), date (YYYY-MM-DD), type: video, tags
- Location: `obsidian-vault/videos/{title}-{videoId}.md`
- Linking: References topics as `[[Topic]]` wikilinks, references channel as `[[channelTitle]]`
- Content: Heading, channel/date metadata, topics list, empty notes section for user annotation

**Topic Note (Intermediate Index Document):**
- Purpose: Group and index all videos by extracted topic
- Format: Minimal markdown + dataview query
- Fields: Filename is canonical (no frontmatter)
- Location: `obsidian-vault/topics/{Topic Label}.md`
- Linking: Dynamically updated via dataview `contains(file.outlinks, this.file.link)` queries
- Content: Single dataview block that lists all videos tagged with this topic

**Channel Page (Secondary Index Document):**
- Purpose: Index all videos from a single creator
- Format: Markdown with dataview query
- Fields: channel_id, title (from feed), type: channel
- Location: `obsidian-vault/channels/{Channel Name}.md`
- Linking: Videos reference via `[[channelTitle]]` in their channel field
- Content: Watch link + dataview table showing all videos from channel sorted by date desc

## Entry Points

**main.js (Primary Watcher):**
- Location: `logic-engine/main.js`
- Invocation: `node main.js` from logic-engine/ directory, or `npm start`
- Startup sequence: Resolves VAULT_ROOT (env var or default), initializes chokidar on clippings/ folder, logs to console and daily log file
- Lifecycle: Runs indefinitely as long-lived process; listens for file changes
- Exports: startWatcher(), processClipping(), extractClipSource(), buildVideoMarkdown(), buildTopicMarkdown() (for testing)
- Environment: VAULT_ROOT (optional, defaults to ../obsidian-vault), CHOKIDAR_POLLING (for network filesystems)

**reviewer.js (Self-Test Validator):**
- Location: `logic-engine/reviewer.js`
- Invocation: `node reviewer.js --self-test`
- Purpose: Run internal assertion tests on validators
- Tests: Channel ID format, filename validation, sanitization, topic cleaning
- Exit: Prints `[reviewer] self-test OK` to stdout if all assertions pass
- Exit code: 0 on success, non-zero on failure

**health-check.js (Diagnostic Script):**
- Location: `logic-engine/scripts/health-check.js`
- Invocation: `npm run health`
- Purpose: Verify system readiness before starting watcher
- Checks: Vault exists and accessible, dependencies installed, permissions correct

## Error Handling

**Strategy:** Fail-open pipeline with logging; non-fatal errors skip silently, fatal errors logged and reported

**Validation Errors (skipped):**
- Invalid frontmatter → `logPhase('watcher', 'skip', 'invalid frontmatter {filePath}')`
- No YouTube source found → `logPhase('watcher', 'skip', 'no youtube source in frontmatter or body')`
- Bad video ID format → `logPhase('watcher', 'skip', 'could not parse video id from URL')`
- Bad channel ID format → `logPhase('resolver', 'invalid', 'channelId must be UC + 22 chars')`
- Invalid video metadata → `logPhase('harvester', 'skip-invalid', errors.join(';'))`
- Effect: File ignored, watcher continues

**Network Errors (retry-later):**
- Channel ID resolution fails (HTML fetch) → returns null, triggers `logPhase('resolver', 'retry-later', 'no channelId for video {id}')`
- RSS feed unreachable → catches error, logs `logPhase('harvester', 'error', message)`, processClipping exits early
- Effect: history.json not updated, next file write triggers reprocess

**File System Errors (logged):**
- Mkdir failures, write failures → wrapped in try-catch
- Pattern: `try { fs.writeFileSync(...) } catch(e) { logPhase('generator', 'error', String(e)) }`
- Effect: Error logged but watcher continues

**Uncaught Exceptions (reported):**
- Top-level promise catch in scheduleProcess
- Pattern: `processClipping().catch(e => { console.error(e); reportFile([error] ${e.stack}) })`
- Effect: Stack trace logged to file and console, watcher continues

**YAML Parsing (graceful):**
- gray-matter catches YAML syntax errors
- parseFrontmatter returns `{ok: false, data: {}, content, errors: [message]}`
- All validators check ok flag before proceeding
- Pattern: Validation always returns `{ok: bool, errors: string[]}`

## Cross-Cutting Concerns

**Logging:**
- Dual-channel: console.log() for real-time debugging, file log for persistent record
- Format: `[YYYY-MM-DDTHH:MM:SS.sssZ] [{phase}] {action} : {detail}`
- Location: `logic-engine/logs/run-{YYYY-MM-DD}.log` (created daily, append-only)
- Phases: boot, watcher, extractor, resolver, harvester, generator, pipeline, sync
- Structured sync reports: `[sync] videos_added={N} topics_created={M} status={ok|retry-later} channel={id}`

**Validation:**
- Centralized in ReviewAgent module (no validation scattered across files)
- Pattern: All validators return `{ok: boolean, errors: string[]}`
- Applied at layers: filename sanitization, channel ID format, video URL validation, YAML frontmatter, topic label plausibility, blacklist filtering
- Blacklists: Clickbait (watch, must, insane, crazy, shocking, ultimate, best, worst, official, trailer, new, live, streaming, episode, full) + stop words (you, the, and, for, are, that, etc.)

**File Safety:**
- Atomic JSON writes: write to temp file with unique suffix, then rename atomically
- Pattern: `fs.writeFileSync(tmpFile); fs.renameSync(tmpFile, targetFile)`
- Debounced processing: 800ms stability threshold before processing file
- awaitWriteFinish: chokidar waits 400ms of file inactivity before firing event
- Read-then-parse: all inputs read fully before parsing (no streaming)

**Markdown Wikilink Formatting:**
- Video notes: Channel referenced as plaintext in YAML (`channel: "Shreya Heda"`), as wikilink in body (`**Channel:** [[Shreya Heda]]`)
- Topics: Extracted topics formatted as YAML array (`topics: [["[[AI]]", "[[Ethics]]"]`) and as inline links in body (`[[AI]] [[Ethics]]`)
- Topic files: Named from sanitized topic label; linked from videos via `file.outlinks` dataview queries
- Channel files: Named from feed title; linked from videos via exact channel field match

**Topic Deduplication:**
- Per-document: Same topic never extracted twice from one video (via Set dedup in processor)
- Vault-wide: Duplicate filenames create versioned copies in Obsidian, so collisions are visible
- Naming: topicNoteFilename() sanitizes unicode, spaces, special chars → `{sanitized}.md`
- Search: Topics queryable via dataview `contains(file.outlinks, [[Topic]])` pattern

---

*Architecture analysis: 2026-04-24*
