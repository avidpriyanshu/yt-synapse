# Rate-Limit Avoidance Implementation Plan

**Goal:** Implement YouTube rate-limit avoidance strategies to maintain consistent scraping without detection/blocking

**Motivation:** Current auto-retry (5 min) isn't enough; YouTube detects automated patterns and blocks requests

---

## Technical Approaches (Research Reference)

1. **User-Agent Rotation**: Mimic different browsers/devices (Chrome, Safari, mobile)
2. **Proxy Distribution**: Route requests through multiple IPs (ProxyScrape, ScraperAPI)
3. **Randomized Delays**: Add 1-5 second random delays between requests to avoid burst detection
4. **URL Parameter Tricks**: Append dummy params (`&abc=123`) to bypass simple path-based limiters

---

## Phase Breakdown

### Phase 1: User-Agent Rotation
**Objective**: Rotate browser/device signatures to avoid single-bot detection

**Tasks**:
- [ ] 1.1 Research YouTube's user-agent detection patterns
- [ ] 1.2 Create user-agent pool (10-15 popular combinations)
- [ ] 1.3 Implement rotation logic in fetch requests
- [ ] 1.4 Test with production channels
- [ ] 1.5 Document and review

---

### Phase 2: Randomized Delays
**Objective**: Mimic human browsing patterns to stay under burst-detection radar

**Tasks**:
- [ ] 2.1 Implement configurable delay range (min/max ms)
- [ ] 2.2 Add jitter to batch delays (not just fixed intervals)
- [ ] 2.3 Test delay impact on scraping speed
- [ ] 2.4 Review and adjust thresholds
- [ ] 2.5 Document configuration

---

### Phase 3: Proxy Support (Optional, Research First)
**Objective**: Distribute requests across multiple IPs if rate limits persist

**Tasks**:
- [ ] 3.1 Research free proxy providers (ProxyScrape, ScraperAPI)
- [ ] 3.2 Evaluate cost/benefit trade-offs
- [ ] 3.3 Implement if justified
- [ ] 3.4 Test reliability and fallback behavior

---

### Phase 4: URL Parameter Tricks
**Objective**: Bypass simple path-based rate limiters with dummy parameters

**Tasks**:
- [ ] 4.1 Identify YouTube RSS/API endpoints
- [ ] 4.2 Add random query params to each request
- [ ] 4.3 Test endpoint behavior changes
- [ ] 4.4 Document observed effects

---

### Phase 5: Integration & Testing
**Objective**: Combine all strategies and validate against real-world scraping

**Tasks**:
- [ ] 5.1 Integrate all four strategies into fetch logic
- [ ] 5.2 Add telemetry (request count, success rate, ban status)
- [ ] 5.3 Long-term test (24h+ continuous scraping)
- [ ] 5.4 Document results and adjust thresholds

---

## How We'll Solve This

1. **Iterative cycles**: Solve one phase → review → move to next
2. **Testing**: Each phase includes manual testing against production channels
3. **Documentation**: Record findings, thresholds, and configuration for future tuning
4. **Rollback**: Keep previous versions working in case new strategies trigger harsher blocks

---

## Success Criteria

- [ ] Can continuously scrape 5+ channels without rate limiting
- [ ] Request patterns not detectable as automated
- [ ] No permanent IP bans or account blocks
- [ ] Configuration tunable per channel (aggressive vs. conservative)
