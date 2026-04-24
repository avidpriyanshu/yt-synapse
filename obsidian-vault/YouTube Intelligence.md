# YouTube Intelligence

Master dashboard for discovered videos.

```dataview
TABLE title, channel as Channel, date as Date, topic as topics
FROM "videos"
WHERE type = "video"
SORT date DESC
LIMIT 50
```

## Recent sync

See `logic-engine/logs/` for run logs.
