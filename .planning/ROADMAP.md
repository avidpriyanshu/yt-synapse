# Roadmap: Milestone v2.0 YouTube Vault Redesign

**6 phases** | **24 requirements mapped** | All covered ✓

## Phased Breakdown

| # | Phase | Goal | Requirements | Count | Status |
|---|-------|------|--------------|-------|--------|
| 1 | Enhanced Templates | Update video note templates with thumbnails and transcripts | TMPL-01, TMPL-02, TMPL-03 | 3 | ✅ |
| 2 | Dashboard & Discovery | Build searchable Bases dashboard for video discovery | DASH-01, DASH-02, DASH-03, DASH-04 | 4 | ✅ |
| 3 | Channel Management | Auto-generate channel pages with categorization | CHAN-01, CHAN-02, CHAN-03, CHAN-04 | 4 | ⧗ |
| 4 | Topic Quality | Replace NLP library and fix topic extraction | TOPIC-01, TOPIC-02, TOPIC-03, TOPIC-04 | 4 | ⧗ |
| 5 | Service & Operations | Add service mode with logging and UI controls | SVC-01, SVC-02, SVC-03, SVC-04, SVC-05 | 5 | ⧗ |
| 6 | Accessibility | Make system user-friendly for non-technical users | A11Y-01, A11Y-02, A11Y-03, A11Y-04 | 4 | ⧗ |

---

## Phase Details

### Phase 1: Enhanced Templates

**Goal:** Update video note templates to include thumbnails, transcripts, and richer metadata.

**Requirements:**
- TMPL-01: Thumbnail extraction using YouTube URL formula
- TMPL-02: Transcript section in video notes
- TMPL-03: Enhanced metadata display (duration, views, publish date)

**Success Criteria:**
1. Video notes display thumbnail image (sourced from hqdefault.jpg URL)
2. Video notes include empty "Transcript" section for user to fill
3. Video notes show publish date, duration, view count in metadata block

**Dependencies:** None (foundational)

**Effort:** Medium (template changes + URL formula)

---

### Phase 2: Dashboard & Discovery

**Goal:** Create searchable, browsable dashboard using Obsidian Bases for video discovery.

**Requirements:**
- DASH-01: Search/filter videos via Bases search
- DASH-02: Sortable video table (title, channel, date, topics)
- DASH-03: Browse by topic via auto-generated topic pages
- DASH-04: Browse by creator via auto-generated channel pages

**Success Criteria:**
1. Bases view displays all videos in searchable, sortable table
2. User can filter by channel, date, or topic
3. Clicking topic navigates to topic page (existing dataview queries)
4. Clicking channel navigates to channel page (existing functionality)

**Dependencies:** Phase 3 (channel pages must exist for navigation)

**Effort:** Medium (Bases configuration, UI layout)

---

### Phase 3: Channel Management

**Goal:** Auto-generate channel pages with categorization system.

**Requirements:**
- CHAN-01: Auto-generate one page per unique channel
- CHAN-02: Channel tag/category assignment system
- CHAN-03: Filter/browse videos by channel category
- CHAN-04: Channel page displays chronological video list

**Success Criteria:**
1. Each new channel processed gets a dedicated page in /channels/
2. Channel page frontmatter includes tags field with categories
3. User can browse channels by category (Bases view or dataview query)
4. Channel page displays all videos from creator sorted by date DESC

**Dependencies:** None (extends existing channel generation)

**Effort:** Medium-High (categorization system, UI for tag assignment)

---

### Phase 4: Topic Quality

**Goal:** Replace stale NLP library with higher-quality alternative and improve topic extraction accuracy.

**Requirements:**
- TOPIC-01: Replace compromise library with better NLP tool
- TOPIC-02: Reduce noisy topics (no "Almost", "You Can", etc.)
- TOPIC-03: Add topic deduplication/merging utility
- TOPIC-04: Make topic blacklist configurable

**Success Criteria:**
1. compromise library replaced with [selected alternative]
2. Topic extraction output is cleaner (validated on test videos)
3. User can manually merge/remap duplicate topics
4. Topic filtering rules read from config file (not hardcoded)

**Dependencies:** None (internal refactor)

**Effort:** High (NLP integration, testing with diverse titles)

---

### Phase 5: Service & Operations

**Goal:** Add service mode with logging, controls, and monitoring for non-technical users.

**Requirements:**
- SVC-01: UI toggle to enable/disable scraper
- SVC-02: Real-time logs of successful scrapes
- SVC-03: Failed scrape logs with error details
- SVC-04: Auto-start scraper on vault open (optional)
- SVC-05: Daily timestamped log file

**Success Criteria:**
1. Service mode runnable via UI button (not just `node main.js`)
2. Success log shows videos added, topics created, channels processed
3. Error log shows failed videos with reason (bad URL, network error, etc.)
4. Log entries include timestamp, phase, action, detail
5. Logs persisted to `logs/run-YYYY-MM-DD.log`

**Dependencies:** Phase 1-4 (logging integrated across all phases)

**Effort:** Medium (service wrapper, logging infrastructure)

---

### Phase 6: Accessibility

**Goal:** Make system accessible and understandable to non-technical users.

**Requirements:**
- A11Y-01: Settings UI in Obsidian (no config file editing)
- A11Y-02: Clear logging explaining what system is doing
- A11Y-03: Non-technical setup wizard (first run)
- A11Y-04: Error messages in plain language

**Success Criteria:**
1. Settings button in Obsidian opens settings page (channel tags, scraper schedule, logging level)
2. All log messages written in plain English (not developer jargon)
3. First-run wizard guides user through vault setup
4. Error messages explain what went wrong and how to fix (not stack traces)

**Dependencies:** Phase 5 (service mode), all prior phases (clear error handling)

**Effort:** Medium-High (UX design, error messages, wizard flow)

---

## Build Order Notes

1. **Start with Phase 1** — Templates are foundational, low risk
2. **Phases 2 & 3 can overlap** — Dashboard and channels are independent
3. **Phase 4 is critical** — Topic quality is a core concern; do early after templates
4. **Phase 5 depends on 1-4** — Service mode integration touches all phases
5. **Phase 6 last** — Accessibility polish after core functionality works

---

## Risk Assessment

| Phase | Risk | Mitigation |
|-------|------|-----------|
| 1 | Template changes affect existing notes | Test on sample vault; optional migration script |
| 2 | Bases plugin instability | Fallback to dataview-only dashboard |
| 3 | Channel categorization complexity | Simple tagging system (not hierarchical) |
| 4 | NLP library replacement | Parallel implementation + testing on real data |
| 5 | Service mode reliability | Robust error handling, fallback to CLI |
| 6 | UX discovery | Early user testing with non-technical users |

---

*Roadmap created: 2026-04-24*
