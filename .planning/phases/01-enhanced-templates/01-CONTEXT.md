# Phase 1: Enhanced Templates - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning
**Mode:** Smart Discuss (auto-accepted recommendations for autonomous execution)

<domain>
## Phase Boundary

Update existing video note templates to include:
- YouTube video thumbnails (via hqdefault.jpg URL formula)
- Transcript section (empty by default, user-fillable)
- Enhanced metadata display (duration, view count, publish date)

This phase improves the *visual richness* and *completeness* of clipped video notes without changing the core clipping workflow or discovery mechanism.

</domain>

<decisions>
## Implementation Decisions

### Template Structure
- Thumbnail placed at the top of the note (visual anchor, consistent with Medium/web conventions)
- Metadata block positioned below title/URL but above content (quick reference without scrolling)
- Transcript section placed at the bottom as an empty, user-fillable block
- All additions use markdown + YAML frontmatter (consistent with existing templates)

### Thumbnail & Metadata Format
- Thumbnail URL formula: `https://img.youtube.com/vi/{videoId}/hqdefault.jpg` (standard, always available)
- Thumbnail embedded as markdown image (not a link) for clean rendering in Obsidian
- Metadata fields in frontmatter: `duration`, `viewCount`, `publishDate` (YAML native types)
- Metadata display as a small info block in note body (Obsidian callout or table format for readability)

### Transcript Section Handling
- Transcript section is empty by default (user responsibility to fill — no transcript API integration yet)
- Section marked with clear header: `## Transcript` with a comment/note explaining it's user-fillable
- Optional: Small placeholder text guiding user to extract from YouTube's auto-generated captions

### Migration & Backward Compatibility
- New templates apply to *all new clippings* (not retroactive)
- Existing notes are NOT automatically updated (avoid surprise changes)
- No migration script required (clean forward strategy)

### Claude's Discretion
- Specific styling/formatting details (table vs callout, font sizes, spacing) — determined during implementation based on Obsidian theme best practices
- Metadata extraction approach (hardcoded parsing vs API call attempt) — decided during research phase

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `processor.js` — Contains template rendering logic for video notes
- `engine.js` — Orchestrates the pipeline, passes metadata to processor
- YAML frontmatter already in use (gray-matter library handles parsing)

### Established Patterns
- Templates use markdown + YAML frontmatter (consistent, no new formats)
- Metadata flows from YouTube extraction → reviewer validation → processor generation
- Current metadata fields: `title`, `url`, `channel`, `topics` (will extend with duration, viewCount, publishDate)

### Integration Points
- Processor is the injection point for template changes (modify how notes are generated)
- Engine extracts video metadata (ensure duration, viewCount, publishDate are captured during fetch)
- Reviewer validates metadata before passing to processor (no changes needed here)

</code_context>

<specifics>
## Specific Ideas

- User preference: Thumbnail should be immediately visible when opening note (supports quick visual scanning)
- Consistency: Use existing Obsidian styling conventions (don't introduce custom CSS yet)
- User expectation: Transcript section should feel optional, not like a required field

</specifics>

<deferred>
## Deferred Ideas

- Automatic transcript extraction from YouTube (deferred to Phase 4 or later — API-heavy, out of scope for v2.0)
- Custom thumbnail crops or overlay (nice-to-have, deferred)
- Video duration calculation/validation (simple — can be handled as Claude's Discretion during implementation)

</deferred>
