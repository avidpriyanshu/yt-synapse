# Requirements: Milestone v2.0 YouTube Vault Redesign

## Active Requirements

### Templates (TMPL)
- [x] **TMPL-01**: User can view YouTube video thumbnail in clipped notes (hqdefault.jpg URL formula)
- [x] **TMPL-02**: User can see transcript section in video notes (empty by default, user-fillable)
- [x] **TMPL-03**: User can view enhanced video metadata (duration, view count, publish date)

### Dashboard & Discovery (DASH)
- [x] **DASH-01**: User can search and filter videos via Obsidian Bases search
- [x] **DASH-02**: User can view all videos in a sortable table with columns (title, channel, date, topics)
- [x] **DASH-03**: User can browse videos by topic via auto-generated topic pages
- [x] **DASH-04**: User can discover videos by creator via auto-generated channel pages

### Channel Management (CHAN)
- [ ] **CHAN-01**: System auto-generates one page per unique YouTube channel
- [ ] **CHAN-02**: User can assign tags/categories to channels (e.g., "Tech", "Education", "Entertainment")
- [ ] **CHAN-03**: User can filter/browse videos by channel category
- [ ] **CHAN-04**: Channel page displays all videos from that creator in chronological order

### Topic Quality (TOPIC)
- [ ] **TOPIC-01**: System replaces compromise NLP library with higher-quality alternative
- [ ] **TOPIC-02**: Extracted topics are more accurate and less noisy (no "Almost", "You Can" labels)
- [ ] **TOPIC-03**: User can manually map or merge duplicate topics (e.g., "Jet Engines" vs "Jet Engine")
- [ ] **TOPIC-04**: Topic blacklist is configurable (no hardcoded terms)

### Service & Operations (SVC)
- [ ] **SVC-01**: User can enable/disable scraper via UI toggle (no manual Node.js start required)
- [ ] **SVC-02**: User can view real-time logs of successful scrapes (video added, topics created)
- [ ] **SVC-03**: User can view failed scrapes with error details (why video was skipped)
- [ ] **SVC-04**: System auto-starts scraper on vault open (optional, toggle-able)
- [ ] **SVC-05**: System logs scrapes to daily log file with timestamps and status

### Accessibility (A11Y)
- [ ] **A11Y-01**: Non-technical user can set up scraper without editing configuration files
- [ ] **A11Y-02**: Non-technical user can understand what system is doing via clear logging
- [ ] **A11Y-03**: Settings UI presented in Obsidian (not command line)
- [ ] **A11Y-04**: Errors explained in plain language (not developer errors)

---

## Future Requirements (Deferred to v2.1+)

- Transcript auto-fetching from YouTube (API-heavy, deferred)
- Batch re-scraping entire channels
- Custom NLP parameters per channel
- Video similarity/clustering by topic
- Full-text search across video descriptions
- Scheduled auto-sync (cron-based)
- Webhook integration for external clipping sources

---

## Out of Scope (v2.0)

- YouTube official API (avoiding auth complexity)
- Web-based UI (Obsidian-only)
- Multi-user sync/collaboration
- Video download/archival
- Subtitles/closed captions indexing
- AI-powered video summarization

---

## Traceability

| Phase | Requirements | Status |
|-------|--------------|--------|
| 1 | TMPL-01, TMPL-02, TMPL-03 | ✅ Complete |
| 2 | DASH-01, DASH-02, DASH-03, DASH-04 |
| 3 | CHAN-01, CHAN-02, CHAN-03, CHAN-04 |
| 4 | TOPIC-01, TOPIC-02, TOPIC-03, TOPIC-04 |
| 5 | SVC-01, SVC-02, SVC-03, SVC-04, SVC-05 |
| 6 | A11Y-01, A11Y-02, A11Y-03, A11Y-04 |

---

*Requirements defined: 2026-04-24*
