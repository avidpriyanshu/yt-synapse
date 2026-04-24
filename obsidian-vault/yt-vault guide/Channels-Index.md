---
title: Channel Directory
type: index
tags: []
---

# Channel Directory

Browse all creators organized by category or alphabetically. Each channel page shows all videos from that creator in chronological order.

## All Channels (Alphabetical)

```dataview
LIST file.link
FROM "channels"
WHERE type = "channel"
SORT file.name
```

## Browse by Category

Channels are organized by tags that you assign to each creator. Click on a channel name below to view all its videos, then edit the channel page to add or remove categories.

### Design
```dataview
LIST file.link
FROM "channels"
WHERE contains(tags, "Design")
```

### Product
```dataview
LIST file.link
FROM "channels"
WHERE contains(tags, "Product")
```

### Tech
```dataview
LIST file.link
FROM "channels"
WHERE contains(tags, "Tech")
```

### Education
```dataview
LIST file.link
FROM "channels"
WHERE contains(tags, "Education")
```

### Science
```dataview
LIST file.link
FROM "channels"
WHERE contains(tags, "Science")
```

---

## How to Categorize Channels

1. Open any channel page (e.g., [[Kole Jain]])
2. Click Edit or open in edit mode
3. Find the `tags:` line in the frontmatter at the top
4. Add categories like: `tags: [Design, Product]`
5. Save the file
6. Your channel will now appear in the category sections above

## Suggested Categories

- **Design** — UI/UX, visual design, design systems
- **Product** — Product strategy, SaaS, startups
- **Tech** — Technology, programming, AI, software
- **Education** — Learning, tutorials, courses
- **Science** — Physics, biology, chemistry, engineering
- **Entertainment** — General entertainment, lifestyle
- **Business** — Business strategy, entrepreneurship
- **Lifestyle** — Personal development, habits, mindfulness

---

*Channel Directory | Last updated: 2026-04-24*
