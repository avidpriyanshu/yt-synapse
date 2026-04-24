---
title: Channel Management Guide
type: guide
tags: []
---

# Channel Management Guide

Learn how to browse, organize, and discover videos by channel (creator).

## Quick Start

- **View all channels:** Go to [[Channels-Index]]
- **Browse a creator's videos:** Click on any channel name
- **Organize channels:** Add tags to channels to categorize them

---

## How to Browse Channels

### Browse All Channels

1. Open [[Channels-Index]] from the Dashboard or search
2. You'll see all creators listed alphabetically
3. Click on any channel name (e.g., [[Kole Jain]]) to see all their videos
4. Each channel page shows videos sorted by date (newest first)

### Browse by Category

1. Open [[Channels-Index]]
2. Scroll to "Browse by Category" section
3. Find the category you're interested in (Design, Product, Tech, etc.)
4. Click on any channel under that category

### Find Videos from a Specific Creator

From anywhere in the vault:
- Click on a channel link in a video note (e.g., `**Channel:** [[Kole Jain]]`)
- This takes you to that creator's page with all their videos

---

## How to Categorize Channels

### Add Tags to a Channel

1. Open any channel page (e.g., [[Tim Gabe]])
2. Click **Edit** (pencil icon) or press `Ctrl+E` (Windows) / `Cmd+E` (Mac)
3. At the top, find the `tags:` line:
   ```
   tags:
     - Design
     - Product
   ```
4. Add or remove tags as needed:
   - Example: `tags: [Design, Product, Education]`
   - Or multiline:
     ```
     tags:
       - Design
       - Product
     ```
5. Save the file (Ctrl+S / Cmd+S)

### Suggested Categories

Pick from these tags (or create your own):

| Tag | Description |
|-----|-------------|
| Design | UI/UX, visual design, design systems, interaction design |
| Product | Product management, SaaS, startups, product strategy |
| Tech | Programming, software, AI, technology trends |
| Education | Tutorials, courses, learning, how-tos |
| Science | Physics, biology, chemistry, engineering, research |
| Entertainment | Entertainment, general interest, lifestyle |
| Business | Business strategy, entrepreneurship, leadership |
| Lifestyle | Personal development, habits, wellness, mindfulness |

---

## How New Channels are Added

You don't need to do anything! Here's what happens:

1. When you scrape a new video from a YouTube channel
2. The system auto-detects the channel and creates a page for it
3. The channel page appears in [[Channels-Index]] automatically
4. You can then add tags to categorize it

---

## Video Discovery by Channel

### From the Dashboard

1. Go to [[Dashboard]]
2. Click on the **Channel** column in the video table
3. It takes you to that creator's page with all their videos

### From Video Notes

Each video note shows its channel:
- Click the channel link → See all videos from that creator
- Example: In a video note, click `[[Kole Jain]]` under "Channel"

### By Category

1. Go to [[Channels-Index]]
2. Find the category you want (Design, Tech, Product, etc.)
3. Click a channel name
4. Browse all videos from that creator

---

## Tips & Tricks

### Find Videos from Multiple Creators in One Category

1. Open [[Channels-Index]]
2. Look at the "Browse by Category" section
3. Multiple creators may share the same category tag
4. Click each one to compare their content

### Create Custom Categories

Not limited to the suggested tags! You can add custom categories:
- Click a channel page → Edit → Add any tag you want
- Example: `tags: [Design, Favorite, ToRead, Inspirational]`

### Track Favorite Channels

Add a "Favorite" tag to your most-watched creators:
```yaml
tags:
  - Design
  - Favorite
```

---

## Troubleshooting

### A channel page isn't showing up in [[Channels-Index]]

- The channel page might not have `type: channel` in frontmatter
- Check the page's YAML at the top — should say `type: channel`
- Save if you made changes

### Videos aren't showing on a channel page

- The channel page's dataview query might be wrong
- Check if the video note has the channel name or channel ID
- Both should be present for the query to work

### Tags aren't appearing in category sections

- Tags are case-sensitive and must match the category name exactly
- Example: `tags: [design]` (lowercase) won't show in "Design" section
- Use capitalized tags: `tags: [Design]`

---

## What's Next?

- Browse [[Channels-Index]] to see all your creators
- Tag channels by category so videos are easier to find
- Check [[Dashboard]] to discover videos across all channels

---

*Channel Management Guide | Updated: 2026-04-24*
