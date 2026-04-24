# Phase 3: Channel Management - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning
**Mode:** Smart Discuss (auto-accepted for autonomous execution)

<domain>
## Phase Boundary

Auto-generate dedicated pages for each unique YouTube channel with categorization system. Users can:
- Browse all channels with category tags
- Filter/organize videos by channel category
- See chronological video list per channel
- Assign and manage channel tags/categories

Extends existing channel tracking (channels.json) into discoverable Obsidian pages.

</domain>

<decisions>
## Implementation Decisions

### Channel Page Generation
- One markdown page per unique channel in `/channels/` directory
- Naming: `{channel-name}.md` (slug format, sanitized)
- Generated on each scrape when new videos encountered from a channel
- Pages are regenerated (refreshed) on new video, not created once
- Frontmatter includes: channel name, channel ID, tags (categories), created date

### Categorization System
- Simple tag-based system (flat, not hierarchical)
- User editable tags in page frontmatter: `tags: [Tech, Educational, Gaming]`
- Suggested tags provided as examples, but user can create custom
- Tags stored in frontmatter; no separate tag management file
- Channel category tags separate from video topic tags (different namespace)

### Channel Page Content
- Header with channel name and stats (subscriber count if available, video count in vault)
- Category tags displayed as badges/pills
- Video list: all videos from that channel, sorted by date DESC (newest first)
- Video items link to individual video notes (use existing wikilink format)
- Optional: channel link to YouTube channel (if available)

### Discovery & Organization
- Dashboard or "Channels" index page lists all channel pages (generated or manual)
- Users can browse channels directly or filter videos in dashboard by channel
- Dataview query or Bases column for browsing by channel tag
- No automation of tag assignment (user responsibility for categorization)

### Claude's Discretion
- Channel thumbnail/avatar extraction (nice-to-have, not required)
- Subscriber count API (may not be available without API key)
- Batch re-tag operation (user edits one page at a time)
- Channel merge/dedup logic (assume clean channels from extractor)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `channels.json` — Existing channel tracking with metadata (ID, name, resolved timestamp)
- Channel generation logic already partially exists (needs enhancement for per-video discovery)
- Video notes use wikilinks (can reference channel pages directly)

### Established Patterns
- Markdown pages + YAML frontmatter (consistent approach)
- Metadata in frontmatter; content in markdown body
- State management via atomic JSON files

### Integration Points
- Main scraper already tracks channels; hook channel page generation there
- Engine/processor notifies when new channel encountered
- Reviewer validates channel data before persistence

</code_context>

<specifics>
## Specific Ideas

- User preference: Simple tagging over complex taxonomy (flat > hierarchical)
- Organization: One source of truth (frontmatter), no separate metadata file
- Discovery: Channel pages discoverable from video notes (click channel link → see all videos from that creator)

</specifics>

<deferred>
## Deferred Ideas

- Bulk tag operations (one-time import from spreadsheet) — deferred
- Subscriber count via YouTube API — deferred (complexity, no API key requirement for MVP)
- Automatic channel deduplication (assume clean extraction) — deferred
- Channel "featured" videos or ratings — deferred

</deferred>
