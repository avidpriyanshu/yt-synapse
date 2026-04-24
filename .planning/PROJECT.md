# Project: yt-vault

YouTube knowledge vault system for Obsidian, automating the capture, organization, and discovery of YouTube video content into a personal knowledge base.

## What This Is

A Node.js-powered pipeline that:
1. Watches for YouTube clipping instructions in Obsidian
2. Fetches video metadata and channel information from YouTube
3. Extracts topics and channels using NLP and web scraping
4. Generates interconnected markdown notes in Obsidian vault
5. Powers vault search and discovery via Dataview queries and Bases

**Current version:** v1.0 (YouTube Synapse)

## Current Milestone: v2.0 YouTube Vault Redesign

**Goal:** Enhanced templates, improved dashboard, NLP quality, service mode, and accessibility for non-technical users.

**Target features:**
- Enhanced clipping templates with thumbnail extraction and transcript sections
- Improved Obsidian dashboard using Bases for search and discovery
- Per-channel pages auto-generated with video lists and categorization
- Channel tag/category system for organization
- Fix topic extraction quality (replace stale compromise NLP with better library)
- Scraper service mode with UI toggle for non-technical users
- Comprehensive logging for successful and failed scrapes

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition:**
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone:**
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

## Key Decisions

- Use Node.js for pipeline (no Python dependency)
- Obsidian as primary UI (no custom web app)
- Web scraping for YouTube (avoid official API auth)
- Dataview plugin required for dynamic queries

---

*Project initialized: 2026-04-24*
