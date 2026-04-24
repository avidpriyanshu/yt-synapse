# Coding Conventions

**Analysis Date:** 2026-04-24

## Naming Patterns

**Files:**
- Lowercase with `.js` extension: `main.js`, `engine.js`, `processor.js`
- Utility modules use descriptive nouns: `engine.js` (RSS/video resolution), `processor.js` (topic extraction), `reviewer.js` (validation)
- Scripts use descriptive names: `health-check.js`

**Functions:**
- camelCase for all functions: `extractVideoIdFromUrl()`, `validateChannelId()`, `fetchChannelFeedVideoItems()`
- Descriptive verb-noun patterns: `extract*`, `validate*`, `fetch*`, `parse*`, `build*`, `sanitize*`
- Abbreviations used sparingly: `escapeYamlString()` (not `eys()`), `stripBareYears()`, `stripPunctuation()`

**Variables:**
- camelCase for constants that change: `absPath`, `videoId`, `channelId`, `feedTitle`
- SCREAMING_SNAKE_CASE for truly constant values: `VIDEO_BATCH`, `BROWSER_UA`, `YT_HOST`, `INVALID_FILENAME_CHARS`
- Sets and Maps for state: `seen = new Set()`, `pendingTimers = new Map()`
- Descriptive loop variables: `for (const it of items)`, `for (const entry of feed.items)`

**Types (Object Structures):**
- Objects follow semantic naming: `{ ok: boolean, errors: string[], data?: any }`
- Common response shape: `{ ok: true/false, errors: [...], data?: {...} }`
- Validation result objects: `{ ok, errors }` pattern used consistently across `validateChannelId()`, `validateFilename()`, `validateVideo()`

## Code Style

**Formatting:**
- 2-space indentation (observed in all source files)
- Semicolons required (all statements terminate with `;`)
- No unused variables (clean imports/exports)
- Single quotes for strings consistently
- Line breaks after function definitions

**Linting:**
- No `.eslintrc` or linter configuration file present
- Code follows implicit Node.js best practices: `'use strict'` at top of each module
- Type checking done via JSDoc comments (see examples in `processor.js` and `main.js`)

**Structure Convention:**
- All modules use `'use strict'` directive at top: `'use strict';`
- All modules export public interface via `module.exports`
- Internal helper functions defined before exports

## Import Organization

**Order:**
1. Built-in Node modules: `const fs = require('fs');`, `const path = require('path');`
2. External packages: `const chokidar = require('chokidar');`, `const matter = require('gray-matter');`
3. Local modules: `const ReviewAgent = require('./reviewer.js');`, `const engine = require('./engine.js');`

**Path Aliases:**
- No path aliases configured
- All imports use relative paths: `require('./reviewer.js')`, `require('./engine.js')`
- File extensions included in requires (`.js` required, not implicit resolution)

## Error Handling

**Patterns:**

**Try-catch with silent fallback:**
- Used for operations where failure is acceptable
- Example from `main.js:49-56`:
```javascript
function readJson(filePath, fallback) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
```
- Used in `engine.js` for URL parsing where missing data is recoverable

**Try-catch with error logging:**
- Used in async operations where failure should be reported
- Example from `main.js:377-380`:
```javascript
processClipping(absPath).catch((e) => {
  console.error(e);
  reportFile(`[error] ${e.stack || e}`);
});
```
- Error stack preserved and logged to daily log file

**Validation-based error handling:**
- Functions return `{ ok: boolean, errors: string[] }` instead of throwing
- Example from `reviewer.js:63-86`:
```javascript
function validateVideo({ title, url }) {
  const errors = [];
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('title must be non-empty');
  }
  // ... more checks
  return { ok: errors.length === 0, errors };
}
```
- Callers check `.ok` field and read `.errors` array for details
- This pattern is consistent across all validation functions

**Explicit null returns:**
- Functions return `null` for missing/invalid data rather than undefined
- Example from `engine.js:27-44`:
```javascript
function extractChannelIdFromHtml(html) {
  // ... pattern matching
  return null;
}
```

## Logging

**Framework:** `console` (built-in only) + custom file logging

**Patterns:**

**Phase-based structured logging:**
- Custom `logPhase(phase, action, detail)` function standardizes all logging
- Format: `[${phase}] ${action} : ${detail}`
- Example: `[watcher] file : /path/to/file.md`
- Phases: `watcher`, `extractor`, `resolver`, `harvester`, `generator`, `boot`, `pipeline`
- Actions: `file`, `videoId`, `skip`, `error`, `warn`, `batch`, `done`, `video`, `topic`

**File-based logging:**
- All log output written to `logs/run-{YYYY-MM-DD}.log` (daily files)
- Entries prefixed with ISO timestamp: `[${new Date().toISOString()}] {line}`
- Called via `reportFile(msg)` in addition to `console.log()`

**Sync event logging:**
- Status line format for sync operations: `[sync] videos_added={N} topics_created={N} channel={channelId}`
- Error line format: `[error] {error stack or message}`
- Retry line format: `[sync] videos_added=0 topics_created=0 status=retry-later video={videoId}`

## Comments

**When to Comment:**
- Block comments for algorithm explanations: `/** First youtube URL in markdown body */`
- Inline comments for non-obvious regex patterns: `// Strip trailing/leading punctuation`
- Comments for workarounds: `/** Watch folder (not ** glob) to avoid EMFILE / too many open files on macOS */`

**JSDoc/TSDoc:**
- Functions that accept complex parameters or return structured data have JSDoc
- Example from `main.js:114-117`:
```javascript
/**
 * Parse clipping file: frontmatter `source`, optional body URL fallback.
 */
function extractClipSource(markdown, filePath) {
```
- Document type hints for Maps/Sets: `/** @type {Map<string,string>} lowercase -> display */`

## Function Design

**Size:** 
- Functions typically 5-30 lines
- Larger functions (30+ lines) are public entry points like `processClipping()` (~135 lines) which orchestrate multiple steps
- Small utility functions: 1-10 lines (e.g., `isPlausibleLabel()`, `stripBareYears()`)

**Parameters:**
- Maximum 2-3 positional parameters typical
- Object destructuring for multiple related parameters: `buildVideoMarkdown({ title, source, channelTitle, ... })`
- Optional parameters passed in options object: `cleanTopics(rawTopics, options = {})`
- Environment variables checked at function entry (config injection not used)

**Return Values:**
- Most functions return a single value
- Validation functions return standardized `{ ok, errors }` objects
- Fetch/parse functions return enriched objects with all fields (no null fields omitted)
- Async functions return Promise<T> or null on failure

## Module Design

**Exports:**
- Each module exports named functions via `module.exports = { func1, func2, ... }`
- No default exports
- Related functions grouped in same module: `engine.js` exports 5 functions, all related to RSS/channel resolution
- Constants exported if used by other modules: `ReviewAgent.DEFAULT_TOPIC_BLACKLIST`

**Barrel Files:**
- Not used in this project
- Each module is directly imported with path: `require('./engine.js')`

**Module Responsibilities:**

`main.js` - Core pipeline orchestration (file watching, video processing, markdown generation)
- Exports: `startWatcher()`, `processClipping()`, `extractClipSource()`, etc.

`reviewer.js` - Data validation and normalization
- Exports: 9 validation/sanitization functions
- Dependencies: `gray-matter` (YAML parsing), `fs`

`engine.js` - YouTube/RSS integration
- Exports: 5 functions for channel resolution and RSS fetching
- Dependencies: `rss-parser`, `ReviewAgent`

`processor.js` - Natural language topic extraction
- Exports: 2 functions for topic extraction
- Dependencies: `compromise` (NLP), `ReviewAgent`

`scripts/health-check.js` - Vault integrity validation
- Standalone script, no exports
- Scans for broken wikilinks in generated markdown

---

*Convention analysis: 2026-04-24*
