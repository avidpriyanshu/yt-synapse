---
phase: 01-enhanced-templates
plan: 01
title: Enhanced Templates with Thumbnails, Metadata, and Transcripts
date: 2026-04-24
status: complete
commits:
  - 1918840
  - 1c63308
  - e084296
duration_minutes: 8
tasks_completed: 4
files_modified: 3
---

# Phase 01 Plan 01: Enhanced Templates Summary

**Objective:** Update video note templates to include visual thumbnails, transcript sections, and richer metadata fields (duration, view count, publish date).

## What Was Built

### 1. Metadata Extraction Functions (engine.js)

Added three new functions to extract and enrich video metadata from YouTube watch pages:

- **`extractDurationFromHtml(html)`** — Parses `"lengthSeconds":"(\d+)"` regex pattern from HTML, returns duration in seconds or null
- **`extractViewCountFromHtml(html)`** — Parses `"viewCount":"(\d+)"` regex pattern from HTML, returns integer or null
- **`fetchVideoMetadata(videoId)`** — Async function that fetches watch page HTML and calls both extractors; returns `{duration, viewCount}` with graceful degradation on network errors

Enhanced `fetchChannelFeedVideoItems()` to automatically enrich each RSS item with duration and viewCount by calling `fetchVideoMetadata()` for each video.

### 2. Enhanced Template Generator (main.js)

Updated `buildVideoMarkdown()` function with new parameters:

- **New Parameters:** `duration` (seconds), `viewCount` (integer)
- **Thumbnail:** Embeds `![thumbnail](https://img.youtube.com/vi/{videoId}/hqdefault.jpg)` directly below title
- **Metadata Display:**
  - Duration formatted as MM:SS using new `formatDuration()` helper
  - View count formatted with comma separators using new `formatViewCount()` helper
  - Both displayed in metadata section below published date
- **Transcript Section:** New `## Transcript` section with placeholder text `_User-fillable. Paste or summarize transcript here._`
- **YAML Frontmatter:** Added `duration` (seconds as number) and `view_count` fields

### 3. Metadata Validation (reviewer.js)

Added `validateVideoMetadata(metadata)` function:
- Validates `duration` and `viewCount` are non-negative numbers
- Permits null values (graceful degradation)
- Returns `{ok: boolean, errors: string[]}`

### 4. Pipeline Integration (main.js)

Updated `processClipping()` to pass enriched metadata to template builder:
```javascript
const md = buildVideoMarkdown({
  // ... existing fields ...
  duration: it.duration || null,
  viewCount: it.viewCount || null,
});
```

## Files Modified

| File | Changes |
|------|---------|
| `logic-engine/engine.js` | Added 3 extraction functions, enriched RSS feed processing |
| `logic-engine/main.js` | Updated buildVideoMarkdown(), added formatters, integrated metadata into call site |
| `logic-engine/reviewer.js` | Added validateVideoMetadata() function |

## Test Results

All functions tested and verified:

✅ **Duration extraction:** Correctly parses "lengthSeconds":"754" → 754 seconds  
✅ **View count extraction:** Correctly parses "viewCount":"142857" → 142857  
✅ **Template rendering:** Generated markdown includes all enhancements (thumbnail, transcript, metadata)  
✅ **Formatting:**
- Duration: 754 seconds → "12:34"
- View count: 142857 → "142,857"
- null values → "—" (graceful fallback)

✅ **Metadata validation:** Accepts valid numbers and nulls, rejects negatives  
✅ **Backward compatibility:** buildVideoMarkdown() works with and without new parameters

### Sample Generated Template

```markdown
---
title: "Test Video"
source: "https://youtube.com/watch?v=..."
channel: "Test Channel"
channel_id: UC...
video_id: abc123def45
duration: 754
view_count: 142857
topics:
  - "[[Topic1]]"
  - "[[Topic2]]"
date: 2026-04-24
type: video
tags:
  - youtube/video
---

# Test Video

![thumbnail](https://img.youtube.com/vi/abc123def45/hqdefault.jpg)

**Channel:** [[Test Channel]]
**Published:** 2026-04-24
**Duration:** 12:34
**Views:** 142,857

## Topics

[[Topic1]] [[Topic2]]

## Transcript

_User-fillable. Paste or summarize transcript here._

## Notes

```

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Thumbnail placement at top of note | Visual anchor following web conventions; users see video immediately |
| hqdefault.jpg URL formula | Standard YouTube thumbnail, always available, 480x360px |
| Transcript section empty by default | No transcript API integration planned; users responsible for filling (manual or external tools) |
| Graceful degradation on metadata failure | Network/parsing errors don't block note generation; null values render as "—" |
| Regex-based extraction | Matches existing engine.js patterns for channelId extraction; simple, maintainable |
| Format helper functions | Separate formatDuration() and formatViewCount() for testability and reusability |

## Integration Path Verification

✅ **Enrichment → Validation → Template → File Output**

1. RSS feed fetch calls `fetchChannelFeedVideoItems(channelId)`
2. Each item enriched with `fetchVideoMetadata(videoId)` (duration, viewCount)
3. Items passed to `processClipping()` which extracts topics
4. `buildVideoMarkdown()` called with enriched metadata
5. File written to `obsidian-vault/videos/` with all enhancements

## Threat Mitigations Implemented

Per threat model (T-01-03 to T-01-06):

- **T-01-03 (Tampering):** Regex matches validated as non-empty before use
- **T-01-04 (DoS):** Graceful error handling; network failures logged but don't block
- **T-01-05 (YAML Injection):** Uses existing `escapeYamlString()` utility for all user-controlled fields
- **T-01-06 (Repudiation):** Metadata enrichment logged via existing `logPhase()` pattern

## Known Stubs & Deferred Items

**None identified.** All plan requirements implemented without stubs.

Deferred future work (not in scope for v2.0):
- Automatic transcript extraction from YouTube (requires API or detailed scraping)
- Custom thumbnail crops or overlays
- Transcript caching or indexing

## Requirements Mapped

| Req ID | Title | Status |
|--------|-------|--------|
| TMPL-01 | Video notes display thumbnail from hqdefault.jpg formula | ✅ Complete |
| TMPL-02 | Video notes include empty Transcript section for user input | ✅ Complete |
| TMPL-03 | Video notes show duration, view count, publish date in metadata | ✅ Complete |

## Phase 1 Readiness for Downstream Phases

**Phase 2 (Dashboard)** — Can depend on:
- Enhanced templates generate with all new fields (YAML frontmatter complete)
- Dataview queries can now filter by duration, viewCount
- Topic links are functional

**Phase 3 (Channel Management)** — No blockers; this phase is independent

**Phase 4 (Topic Quality)** — Can depend on:
- Topics extracted and notes created with full metadata
- Ready for quality metrics and deduplication

## Deviations from Plan

**None.** Plan executed exactly as written. All tasks completed, all success criteria met.

## Self-Check

- ✅ engine.js exports new functions
- ✅ main.js buildVideoMarkdown() updated with new parameters
- ✅ reviewer.js includes validateVideoMetadata()
- ✅ All commits created and tracked
- ✅ Template test passes with all enhancements

**Status: PASSED**
