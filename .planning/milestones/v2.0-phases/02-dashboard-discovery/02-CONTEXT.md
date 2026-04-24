# Phase 2: Dashboard & Discovery - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning
**Mode:** Smart Discuss (auto-accepted for autonomous execution)

<domain>
## Phase Boundary

Build a searchable, browsable dashboard for video discovery using Obsidian Bases plugin. Enable users to:
- Search and filter videos via Bases search UI
- View all videos in a sortable table (title, channel, date, topics)
- Browse videos by topic (navigate to topic pages)
- Browse videos by creator (navigate to channel pages)

This phase adds discovery/navigation mechanisms without changing the underlying video metadata or template structure.

</domain>

<decisions>
## Implementation Decisions

### Bases Dashboard Design
- Single Bases view for all videos (not multiple views)
- Table layout with columns: title, channel, date added, topic tags
- Sortable by all columns (user-driven discovery)
- Searchable by title, channel, and topics via Bases native search
- No custom filters initially (Bases search sufficient for MVP)

### Navigation Integration
- Clicking topic in the table navigates to existing topic page (dataview query, already exists)
- Clicking channel in the table navigates to Phase 3 channel page (auto-generated per phase 3)
- Breadcrumbs optional (claude's discretion on UX polish)

### Video Data Source
- Query existing video notes from the vault
- Parse frontmatter for metadata (title, channel, topics, date)
- No new data extraction — reuse Phase 1 metadata fields
- Videos without metadata gracefully excluded or show defaults

### Bases Configuration
- Bases view file location: `Dashboard/Videos.md` (or similar in vault root)
- Bases uses inline metadata table or linked records (Bases documentation approach)
- Read-only view (no in-app video creation — maintains single source of truth in templates)

### Claude's Discretion
- Exact table styling and column order (determined during implementation based on Bases plugin capabilities)
- Pagination or virtual scrolling for large libraries (no requirements yet, implement if needed)
- Dark mode support (Obsidian theme-handled)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Dataview queries already exist for topic pages (leverage for navigation)
- Obsidian Bases plugin available in vault config
- Channel pages will be auto-generated in Phase 3 (coordinate naming conventions)

### Established Patterns
- Metadata in YAML frontmatter (consistent with Phase 1)
- Obsidian plugins (Dataview, Bases) used for dynamic queries
- Video notes stored in standardized directory structure

### Integration Points
- Dashboard pulls from video notes directory
- Links to topic pages use existing dataview queries
- Links to channel pages use Phase 3 auto-generated pages (naming TBD in Phase 3)

</code_context>

<specifics>
## Specific Ideas

- User preference: Quick visual scan of library (table layout preferred over card grid for density)
- Discovery flow: Browse by topic → see related videos → drill into channel
- Empty state: Dashboard shows message if no videos in vault yet (helpful for new users)

</specifics>

<deferred>
## Deferred Ideas

- Advanced filtering (e.g., by date range, view count threshold) — deferred to v2.1
- Video recommendations/clustering by similarity — deferred (requires NLP work in Phase 4)
- Custom dashboard layouts — deferred (advanced UX, not MVP)
- Dashboard auto-refresh on new videos — deferred (nice-to-have)

</deferred>
