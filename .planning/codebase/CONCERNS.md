# Concerns

**Analysis Date:** 2026-04-24

## Technical Debt

**Topic Extraction Quality:**
- Produces noisy, low-quality topics (e.g., "Almost", "You Can", "Bodies") due to over-aggressive NLP heuristics
- Compromise library has stale heuristics; 18+ months without updates
- Clickbait filtering rules are incomplete (catches "watch", "must", "insane" but misses "SHOCKING", "UNBELIEVABLE")
- No topic deduplication vault-wide (e.g., "Jet Engines" vs "Jet Engine" create separate files)
- Manual topic mapping not supported (no way to merge or rename extracted topics)

**State Management:**
- history.json is append-only and grows indefinitely (no cleanup mechanism)
- channels.json has no retention policy (old channels accumulate)
- Linear history lookup on every video (O(n) array scan, no indexed set structure)
- No backup or versioning of state files (accidental corruption unrecoverable)
- Potential file system race conditions during concurrent topic file writes (multiple processes writing simultaneously)

**Configuration & Hardcoding:**
- Hardcoded VIDEO_BATCH=15 with no configuration option (requires code change to adjust)
- VAULT_ROOT only via environment variable (no config file)
- NLP parameters (phrase length, clickbait terms, blacklist) scattered across processor.js and reviewer.js
- No way to customize topic extraction behavior per channel or globally

**Network & Resilience:**
- No retry logic for transient network failures (single fetch failure aborts entire batch)
- No timeout on fetch operations (could hang indefinitely on slow/broken YouTube)
- HTML scraping uses fragile regex patterns (3 fallback channel ID extraction attempts, all regex-based)
- No backoff strategy for rate limiting
- RSS feed parsing with no error recovery (if one feed fails, entire batch skipped)

## Security Concerns

**Web Scraping:**
- HTML scraping of YouTube watch pages without timeout (vulnerability to slowloris-style attacks)
- Channel ID extraction relies on regex pattern matching against HTML structure (brittle if YouTube changes)
- No URL validation before fetching (could be tricked into fetching arbitrary URLs if source parsing breaks)
- No rate limiting or request throttling to YouTube (risk of IP blocking)
- User-Agent string hardcoded (identifies as Chrome, could be blocked if YouTube detects automation)

**File System:**
- Vault write permissions not validated at startup
- No symlink follow-up detection (TOCTOU vulnerability on vault path resolution)
- Filename sanitization may be incomplete (edge case: very long filenames could overflow filesystem limits)
- Topic file names generated from user-controlled video titles (potential for path traversal if sanitization broken)

**YAML Parsing:**
- gray-matter YAML parsing could be vulnerable to YAML injection if user controls frontmatter
- No YAML schema validation (arbitrary fields accepted in frontmatter)
- Topic array stored in YAML without quoting (special characters could break syntax)

## Performance Bottlenecks

**Data Structure & Lookup:**
- Linear history lookup on every video (O(n) reads from disk, then array.includes() scan)
- NLP parser reinitialized per title extraction (no caching of compromise instance)
- No streaming support for RSS feed parsing (entire feed loaded into memory before processing)

**I/O Patterns:**
- All state files read synchronously (blocks event loop)
- History.json grows indefinitely, eventually O(n) lookup becomes prohibitive
- No batching across multiple channel fetches (one feed fetch per channel, no pipelining)

**Scalability Limits:**
- Current capacity: ~135 videos, 337 topics
- Obsidian degrades significantly above 5,000-10,000 files per vault
- At current rate (15 vids/batch), would hit Obsidian limit in ~350-670 batches
- No archive or rollover strategy for old videos

## Fragile Areas

**URL Parsing:**
- Regex-based video ID extraction with no fallback (one pattern fails, video skipped)
- Channel ID extraction depends on 3 regex patterns with no validation against live YouTube schema
- No URL validation before fetching (could send malformed requests)

**Topic Filtering Rules:**
- Clickbait terms and stop words scattered across two files (processor.js and reviewer.js) - inconsistent application
- Blacklist duplicated between DEFAULT_TOPIC_BLACKLIST and mergedBlacklist sets (maintenance burden)
- Filter order matters (length check before stop-word filtering could cause issues)

**File I/O:**
- Minimal error handling on file writes (catch-all generic logging, no retry)
- Atomic rename pattern (write temp, then rename) assumes filesystem supports atomic operations
- No validation that temp file write succeeded before attempting rename
- Symlink handling unclear (could follow symlinks if vault path is a link)

**Wikilinks:**
- Topic label names assume no special characters (double brackets in topic label would break wikilinks)
- No escaping of special markdown characters in generated markdown (backticks, brackets in titles could break syntax)
- Channel name from RSS feed (not sanitized) - feeds could contain malicious markdown syntax

## Missing Features

**Topic Management:**
- No built-in deduplication (duplicate topics with minor variations create multiple files)
- No topic merging (can't combine "Jet Engine" and "Jet Engines" retroactively)
- No topic renaming (changing blacklist means old files persist with old names)
- No custom topic mapping (can't map "AI" → "Artificial Intelligence")

**Transcript & Content:**
- No transcript indexing or full-text search
- No video description parsing (only title used for topic extraction)
- No metadata beyond title (duration, view count, channel description ignored)
- No caching of YouTube page HTML (re-fetched every time channel resolved)

**Operations:**
- No error queue for failed clippings (failed videos are silently skipped)
- No scheduled sync/refresh capability (must manually touch clipping file to reprocess)
- No dry-run mode (can't preview vault changes before committing)
- No undo mechanism (once vault generated, no rollback)
- No audit log of what was processed (only realtime logs, no persistent audit trail)

## At-Risk Dependencies

**Compromise (NLP):**
- Status: 18+ months without updates (last commit ~late 2024)
- Risk: Stale topic extraction, declining maintenance
- Alternatives: SpaCy (Python), NLTK, or external NLP API
- Impact: Topic extraction quality directly affects vault usefulness

**RSS Parser:**
- Status: Slow development, limited GitHub activity
- Risk: YouTube may deprecated RSS feeds entirely (internal talks about deprecation)
- Fallback: Would need to switch to YouTube API v3 (requires auth key)
- Impact: Entire harvester layer depends on this library

**Chokidar (File Watcher):**
- Status: Stable but edge cases on Windows/Linux (filesystem differences)
- Risk: Rare race conditions with rapid file changes or network filesystems
- Impact: Could miss clipping file changes or trigger spurious duplicates

**Gray-matter (YAML):**
- Status: Stable but YAML parsing security considerations
- Risk: Potential YAML injection if user controls frontmatter
- Impact: Could theoretically execute code via YAML in frontmatter (unlikely but possible)

## Reliability & Operations

**Crash & Recovery:**
- No graceful shutdown handler (SIGTERM not caught)
- No in-flight request tracking (requests interrupted on crash)
- No recovery state (can't resume interrupted batch)
- History.json might be corrupted if process crashes mid-write

**Monitoring:**
- No health check endpoint (can't check if watcher is alive from outside)
- Logs only written locally (no centralized logging or monitoring)
- No metrics collection (can't measure throughput, latency, error rate)
- No alerting on failures (admins must check logs manually)

**Deployment:**
- Single-threaded Node.js process (can't scale to multiple CPU cores)
- No process manager (must restart manually if it crashes)
- No containerization (difficult to deploy consistently)
- Hard dependency on local filesystem (can't run in cloud)

## Recommendations

**High Priority:**
1. Add timeout to fetch operations (prevent hanging)
2. Implement retry logic with exponential backoff (handle transient failures)
3. Add audit log of processed videos (operational visibility)
4. Separate configuration from code (make VIDEO_BATCH, NLP params configurable)

**Medium Priority:**
5. Implement topic deduplication and merging utility
6. Add unit tests for core extraction functions
7. Implement state file versioning or backup (protect against corruption)
8. Add health check endpoint and monitoring

**Low Priority (High Effort):**
9. Replace compromise with better NLP library (or external API)
10. Implement error queue for retrying failed videos
11. Add YouTube API v3 as RSS fallback
12. Containerize and deploy to cloud

---

*Concerns analysis: 2026-04-24*
