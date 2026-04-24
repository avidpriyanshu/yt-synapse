# Phase 4: Topic Quality - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning
**Mode:** Smart Discuss (auto-accepted for autonomous execution)

<domain>
## Phase Boundary

Replace stale NLP library (compromise) with higher-quality alternative for topic extraction. Improve quality of extracted topics and provide tools for user topic management:
- Replace NLP library with better alternative (e.g., natural, compromise-ng, or custom regex)
- Reduce noisy topics (stop extracting "Almost", "You Can", garbage phrases)
- Add topic deduplication/merging utility for manual correction
- Make topic blacklist configurable (externalize hardcoded terms)

Core goal: Cleaner, more meaningful topics with user control.

</domain>

<decisions>
## Implementation Decisions

### NLP Library Replacement
- Recommended: Switch to simpler approach (keyword extraction via regex + noun phrase detection)
- Rationale: compromise outdated; full NLP overkill for video title topic extraction
- Fallback: Use compromise-ng (drop-in replacement) if regex approach insufficient
- Extract: Noun phrases, capitalized terms, named entities from video title
- No dependency on Machine Learning models (keep it lightweight)

### Topic Quality Improvements
- Implement hardcoded stoplist: filter out ["Almost", "You Can", "How to", "In", "The", "A", "And", "Or", "Get", "More", "New"]
- Noun phrase extraction: look for 2-3 word sequences (usually more meaningful than single words)
- Capitalization bias: weight capitalized terms higher (likely proper nouns: "AI", "JavaScript", "Boston")
- Length filter: ignore topics < 2 chars or > 50 chars (filter junk)

### Topic Deduplication & User Management
- Add utility function: `mergeTopics(oldTopic, newTopic)` that updates history and all video notes
- Create topic management file: `.planning/topic-remap.json` for user-defined topic merges (e.g., {"Jet Engine": "Jet Engines"})
- On scrape, check remap file before writing topic to note (normalize before storage)
- Optional: CLI tool for bulk topic merge (`node main.js --merge-topics`)

### Topic Blacklist Configuration
- Move hardcoded stoplist to `.planning/topic-blacklist.json` with reason per item
- Format: `{"Almost": "filler word", "You Can": "phrase filler", ...}`
- Load blacklist at startup; check during extraction
- Allow user to add/remove items without code change

### Claude's Discretion
- Exact NLP library choice (defer to implementation phase based on testing)
- Thresholds for phrase length, capitalization weighting
- Deduplication threshold (how similar is "similar enough" for topic merge)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `processor.js` — Contains current topic extraction logic (can be refactored)
- `reviewer.js` — Validates extracted topics (will validate new extraction)
- history.json already tracks all topics ever extracted (leverage for dedup)

### Established Patterns
- Configuration files in `.planning/` directory (use for blacklist, remap)
- Topic extraction happens during processing phase
- Topics stored in YAML frontmatter and history for cross-referencing

### Integration Points
- Topic extraction in processor → reviewer validation → template generation
- New dedup/remap utility called before writing topics to note
- Blacklist checked during initial extraction (before storage)

</code_context>

<specifics>
## Specific Ideas

- User expectation: Cleaner topics = better organization and discovery (quality > quantity)
- Flexibility: User can customize blacklist and remaps without engineering (config-driven)
- Non-breaking: New extraction applies to new videos; existing topics unchanged (safe forward strategy)

</specifics>

<deferred>
## Deferred Ideas

- Machine Learning topic classification (overkill; regex approach sufficient for MVP)
- Automatic topic merging based on similarity (manual control preferred; automation later)
- Topic hierarchy/taxonomy (flat tags sufficient for v2.0)
- Topic suggestion UI in Obsidian (advanced; deferred)

</deferred>
