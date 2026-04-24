# Service

Videos that link to this topic note.

```dataview
TABLE title, source, date as Published
FROM "videos"
WHERE contains(file.outlinks, this.file.link)
SORT date DESC
```

