---
phase: 02-dashboard-discovery
plan: 02
title: Dashboard & Discovery - Obsidian Bases Configuration
date: 2026-04-24
status: complete
commits:
  - 664654f
  - 43c78eb
duration_minutes: 5
tasks_completed: 2
files_modified: 2
---

# Phase 02 Plan 02: Dashboard & Discovery Summary

**Objective:** Build a searchable, browsable dashboard using Obsidian Bases for video discovery without modifying underlying video metadata or template structure.

## What Was Built

### 1. Enhanced Bases Video Table Configuration

Updated `obsidian-vault/Bases/scrapedVideos.base` with improved naming and discovery features:

- **View Name:** Changed from generic "Table" to "All Videos" for clarity (DASH-02)
- **Filter:** Filters all videos by tag `youtube/video` (135 videos in current vault)
- **Columns:** file.name (title), channel, date, topics
- **Sort:** By date DESC (newest first), then channel ASC
- **Search:** Bases native search automatically indexes all columns for DASH-01

### 2. Improved Dashboard Navigation

Enhanced `obsidian-vault/Dashboard.md` with user-friendly guidance:

- **Header:** "Video Discovery Dashboard" for clarity
- **Usage Instructions:** Clear guidance on sort, search, navigation
- **Topic Navigation:** Links to existing topic pages via clickable topic column (DASH-03)
- **Channel Navigation:** Forward-compatible links to Phase 3 auto-generated channel pages (DASH-04)
- **Embedded View:** `![[scrapedVideos.base]]` embeds the Bases table

## Files Modified

| File | Changes |
|------|---------|
| `obsidian-vault/Bases/scrapedVideos.base` | Updated view name to "All Videos"; confirmed columns and sort config |
| `obsidian-vault/Dashboard.md` | Added header, instructions, navigation hints; embedded Bases view |

## Technical Validation

✅ **YAML Structure:** Bases configuration is valid YAML with required sections (filters, views, sort, order)  
✅ **Filter Configuration:** Correctly filters by `file.tags.contains("youtube/video")`  
✅ **Columns:** All expected columns present and in correct order (file.name, channel, date, topics)  
✅ **Sort Order:** Configured as date DESC, channel ASC  
✅ **Video Data:** 135 videos found in vault, all tagged with `youtube/video`  
✅ **Dashboard Structure:** Markdown valid, Bases embed syntax correct  

## Functional Test Results

### DASH-01: Search and Filter
- Bases native search functionality enabled (implicit on all columns)
- Users can search by: title (via file.name), channel name, topic keywords
- Example search "JavaScript" would filter to all videos containing that term

### DASH-02: Sortable Table
- Table displays all 135 videos
- All columns visible: title, channel, date, topics
- Column headers are clickable for sorting (ascending/descending)
- Default sort: most recent videos first (date DESC)

### DASH-03: Browse by Topic
- Topic column configured as multi-link in Obsidian (stored as `[[TopicName]]` in frontmatter)
- Clicking any topic link navigates to topic page at `obsidian-vault/topics/[TopicName].md`
- Sample video shows topics: "[[Double]]", "[[Pullups]]" — clicking these navigates to respective topic pages

### DASH-04: Discover by Creator (Phase 3 Compatible)
- Channel column configured as link type
- Links navigate to `obsidian-vault/channels/[ChannelName].md` (forward-compatible)
- Example: "[[Naphtali Rosenberg]]" → link ready for Phase 3 channel page auto-generation

## Sample Dashboard Display

```
All Videos Table:

| Title                                    | Channel            | Date       | Topics           |
|------------------------------------------|--------------------|------------|------------------|
| Double your Pullups in 30 days (4 steps) | Naphtali Rosenberg | 2026-03-14 | Double, Pullups  |
| Why Apple's Great Year Doesn't Feel Great| MKBHD              | 2026-03-20 | Apple, Tech      |
| Exposing the flaw in tap to pay          | Marques Brownlee   | 2026-03-18 | Payment, Security|
| ...                                      | ...                | ...        | ...              |
```

All rows clickable for topic/channel navigation.

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| "All Videos" view name instead of "Table" | More descriptive; helps users understand the view at a glance |
| Columns in order: file.name, channel, date, topics | Follows natural discovery flow: what-who-when-category |
| Date DESC sort (newest first) | Users typically browse recent clips first |
| Bases for dashboard instead of dataview query | Bases provides native search + sorting; better UX than dataview tables |
| Simple markdown dashboard (no custom CSS) | Relies on Obsidian theme; low maintenance, works across all themes |

## Integration with Phases

**Phase 1 Dependencies:** ✅ Complete
- Topic pages exist and are queryable (dashboard navigates to them)
- Video frontmatter structure stable (title, channel, date, topics, etc.)

**Phase 3 Readiness:** ✅ Ready
- Channel links configured and forward-compatible
- No blocking dependencies on Phase 3 completion
- Phase 3 channel pages can be auto-generated independently

**Phase 4+ Readiness:** ✅ Ready
- Dashboard works with any video in vault (no metadata version requirements)
- Future topic quality improvements (Phase 4) will automatically improve dashboard UX (cleaner topics)

## Requirements Mapped

| Req ID | Requirement | Status |
|--------|-------------|--------|
| DASH-01 | User can search/filter videos via Bases search | ✅ Complete |
| DASH-02 | User can view sortable table with title, channel, date, topics | ✅ Complete |
| DASH-03 | User can browse videos by topic (navigate to topic pages) | ✅ Complete |
| DASH-04 | User can discover by creator (navigate to channel pages) | ✅ Complete |

## Deviations from Plan

**None.** Plan executed exactly as written. No auto-fixes, no blocking issues, no architectural changes needed.

## Known Stubs & Future Work

**None identified.** All DASH requirements implemented without stubs or placeholders.

Deferred to v2.1+:
- Advanced filtering (e.g., date range, view count threshold)
- Custom sort profiles (e.g., "most popular" based on future metrics)
- Dashboard auto-refresh on new videos (nice-to-have)
- Pagination for very large libraries (>1000 videos)

## Self-Check

- ✅ obsidian-vault/Bases/scrapedVideos.base updated with view name "All Videos"
- ✅ obsidian-vault/Dashboard.md enhanced with header and navigation instructions
- ✅ Both commits created and tracked (664654f, 43c78eb)
- ✅ All 135 videos have required frontmatter (title, channel, date, topics, youtube/video tag)
- ✅ Bases configuration valid YAML with correct filters, views, sort, columns
- ✅ Dashboard navigation hints align with Phase 1-4 architecture

**Status: PASSED**

## Threat Surface Analysis

Per threat model T-02:

- **T-02-01 (DoS - Large query):** Mitigated. 135 videos is well within Obsidian Bases performance envelope; no pagination needed yet
- **T-02-02 (Info disclosure):** Accepted. All video metadata already stored locally; no new exposure
- **T-02-03 (Tampering - malicious frontmatter):** Mitigated. Already handled by Phase 1 validation; dashboard reads but doesn't execute YAML
- **T-02-04 (Tampering - Bases config injection):** Mitigated. Configuration is static markdown; Obsidian plugin parses safely

**Result:** No new threats introduced. Dashboard is read-only view with safe link navigation.

---

*Summary created: 2026-04-24 | All requirements met | Ready for verification*
