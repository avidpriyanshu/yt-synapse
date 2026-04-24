'use strict';

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const ReviewAgent = require('./reviewer.js');
const engine = require('./engine.js');
const processor = require('./processor.js');
const logger = require('./logger.js');
const errorMessages = require('./error-messages.js');

const VIDEO_BATCH = 15;

function getVaultRoot() {
  return (
    process.env.VAULT_ROOT ||
    path.resolve(__dirname, '..', 'obsidian-vault')
  );
}

function logPhase(phase, action, detail) {
  // Route to centralized logger module (keeping for compatibility)
  logger.log('INFO', phase, action, detail);
}

function writeJsonAtomic(filePath, obj) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const tmp = path.join(
    dir,
    `.${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`
  );
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2), 'utf8');
  fs.renameSync(tmp, filePath);
}

function readJson(filePath, fallback) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

const CHANNELS_PATH = path.join(__dirname, 'channels.json');
const HISTORY_PATH = path.join(__dirname, 'history.json');

function loadHistorySet() {
  const data = readJson(HISTORY_PATH, { videoIds: [] });
  return new Set(data.videoIds || []);
}

function appendHistoryAtomic(videoId) {
  const data = readJson(HISTORY_PATH, { videoIds: [] });
  const ids = data.videoIds || [];
  if (!ids.includes(videoId)) {
    ids.push(videoId);
    writeJsonAtomic(HISTORY_PATH, { videoIds: ids });
  }
}

function upsertChannelRecord(channelId, meta) {
  const data = readJson(CHANNELS_PATH, { channels: {} });
  data.channels[channelId] = {
    ...data.channels[channelId],
    ...meta,
    resolvedAt: new Date().toISOString(),
  };
  writeJsonAtomic(CHANNELS_PATH, data);
}

/**
 * Auto-generate channel page if it doesn't exist.
 * Called after upserting channel record to channels.json.
 */
function generateChannelPageIfNeeded(channelId, channelTitle) {
  if (!channelId || !channelTitle) return;

  const vault = getVaultRoot();
  const channelsDir = path.join(vault, 'channels');

  // Sanitize filename
  const slug = ReviewAgent.sanitizeFilename(channelTitle.replace(/\s+/g, ' '));
  const filename = `${slug || 'channel'}.md`;
  const filepath = path.join(channelsDir, filename);

  // Only create if doesn't exist
  if (fs.existsSync(filepath)) {
    return; // Already exists, don't overwrite
  }

  // Create channels directory if needed
  fs.mkdirSync(channelsDir, { recursive: true });

  // Generate channel page content
  const escapedTitle = channelTitle.replace(/"/g, '\\"');
  const channelPageContent = `---
title: "${escapedTitle}"
channel_id: ${channelId}
type: channel
tags: []
---

# ${channelTitle}

[Watch on YouTube →](https://www.youtube.com/channel/${channelId})

## Videos

\`\`\`dataview
TABLE title, date as "Published", topics
FROM "videos"
WHERE channel_id = "${channelId}" OR channel = [[${channelTitle}]]
SORT date DESC
\`\`\`

`;

  fs.writeFileSync(filepath, channelPageContent, 'utf8');
  logPhase('generator', 'channel-page', `created ${filename}`);
}

/** First youtube URL in markdown body */
function extractYoutubeUrlFromBody(content) {
  const re =
    /https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=[^&\s)]+|shorts\/[^\s)]+)|youtu\.be\/[^\s)]+)/gi;
  const m = re.exec(content || '');
  return m ? m[0] : null;
}

function extractVideoIdFromUrl(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return null;
  try {
    const u = new URL(urlStr.trim());
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '').split('/')[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const v = u.searchParams.get('v');
      if (v && /^[\w-]{11}$/.test(v)) return v;
      const shorts = u.pathname.match(/^\/shorts\/([\w-]{11})/);
      if (shorts) return shorts[1];
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Parse clipping file: frontmatter `source`, optional body URL fallback.
 */
function extractClipSource(markdown, filePath) {
  const parsed = ReviewAgent.parseFrontmatter(markdown);
  if (!parsed.ok) {
    logPhase('watcher', 'warn', `invalid frontmatter ${filePath}`);
  }
  const data = parsed.data || {};
  let source =
    data.source ||
    data.Source ||
    data.url ||
    data.link ||
    null;

  if (!source) {
    source = extractYoutubeUrlFromBody(parsed.content || '');
  }

  if (!source) {
    return { ok: false, reason: 'no youtube source in frontmatter or body' };
  }

  const videoId = extractVideoIdFromUrl(source);
  if (!videoId) {
    return { ok: false, reason: 'could not parse video id from URL' };
  }

  return { ok: true, source, videoId };
}

function videoNoteFilename(title, videoId) {
  const slug = ReviewAgent.sanitizeFilename(
    (title || 'video').replace(/\s+/g, ' ')
  ).slice(0, 120);
  const base = slug || 'video';
  return `${base}-${videoId}.md`;
}

function topicNoteFilename(topicLabel) {
  const s = ReviewAgent.sanitizeFilename(topicLabel.replace(/\s+/g, ' '));
  return `${s || 'topic'}.md`;
}

function escapeYamlString(s) {
  if (!s) return '""';
  const t = String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `"${t}"`;
}

/**
 * Format view count with comma separators.
 * @param {number} count - View count
 * @returns {string} Formatted view count (e.g., "1,234,567")
 */
function formatViewCount(count) {
  if (count == null || isNaN(count)) return '—';
  return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format duration from seconds to MM:SS format.
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration (e.g., "12:34")
 */
function formatDuration(seconds) {
  if (seconds == null || isNaN(seconds) || seconds < 0) return '—';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function buildVideoMarkdown({
  title,
  source,
  channelTitle,
  channelId,
  videoId,
  topicLabels,
  pubDate,
  duration,
  viewCount,
}) {
  const yamlTopics = topicLabels.map((t) => `  - "[[${t.replace(/"/g, '\\"')}]]"`);
  const topicLinksLine = topicLabels.map((t) => `[[${t}]]`).join(' ');
  const dateLine = pubDate
    ? pubDate.slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  const topicsYaml =
    yamlTopics.length > 0 ? `\n${yamlTopics.join('\n')}` : ' []';

  // Channel name (plain text for YAML) + wikilink in body
  const channelWikilink = `[[${channelTitle}]]`;

  // Format metadata for display
  const durationDisplay = formatDuration(duration);
  const viewCountDisplay = formatViewCount(viewCount);

  return `---
title: ${escapeYamlString(title)}
source: ${escapeYamlString(source)}
channel: ${escapeYamlString(channelTitle)}
channel_id: ${channelId}
video_id: ${videoId}
duration: ${duration || null}
view_count: ${viewCount || null}
topics:${topicsYaml}
date: ${dateLine}
type: video
tags:
  - youtube/video
---

# ${title}

![thumbnail](https://img.youtube.com/vi/${videoId}/hqdefault.jpg)

**Channel:** ${channelWikilink}
**Published:** ${pubDate || dateLine}
**Duration:** ${durationDisplay}
**Views:** ${viewCountDisplay}

## Topics

${topicLinksLine || '_No extracted topics_'}

## Transcript

_User-fillable. Paste or summarize transcript here._

## Notes

`;

}

function buildTopicMarkdown(topicLabel) {
  const safe = topicLabel.replace(/"/g, '\\"');
  return `# ${topicLabel}

Videos that link to this topic note.

\`\`\`dataview
TABLE title, source, date as Published
FROM "videos"
WHERE contains(file.outlinks, this.file.link)
SORT date DESC
\`\`\`

`;

}
async function processClipping(absPath) {
  const vault = getVaultRoot();
  const phase = 'pipeline';

  logPhase('watcher', 'file', absPath);

  let raw;
  try {
    raw = fs.readFileSync(absPath, 'utf8');
  } catch (e) {
    logPhase('watcher', 'error', String(e.message || e));
    return;
  }

  const clip = extractClipSource(raw, absPath);
  if (!clip.ok) {
    logPhase('watcher', 'skip', clip.reason || 'unknown');
    return;
  }

  const { source, videoId } = clip;
  logPhase('extractor', 'videoId', videoId);

  let channelId = await engine.resolveChannelIdFromVideo(videoId);
  if (!channelId) {
    logPhase('resolver', 'retry-later', `no channelId for video ${videoId}`);
    reportFile(
      `[sync] videos_added=0 topics_created=0 status=retry-later video=${videoId}`
    );
    return;
  }

  const chVal = ReviewAgent.validateChannelId(channelId);
  if (!chVal.ok) {
    logPhase('resolver', 'invalid', chVal.errors.join('; '));
    return;
  }

  logPhase('resolver', 'channelId', channelId);

  upsertChannelRecord(channelId, { sourceVideoId: videoId });

  let feedTitle = 'YouTube Channel';
  let items = [];
  try {
    const feed = await engine.fetchChannelFeedVideoItems(channelId);
    feedTitle = feed.feedTitle || feedTitle;
    items = feed.items || [];
  } catch (e) {
    const userMessage = errorMessages.getErrorMessage(e, { action: 'fetch videos from YouTube' });
    logger.error('Video fetch failed', userMessage);
    return;
  }

  upsertChannelRecord(channelId, { feedTitle });

  // Auto-generate channel page for new channels
  generateChannelPageIfNeeded(channelId, feedTitle);

  logPhase('harvester', 'rss', `${items.length} entries for ${feedTitle}`);

  const history = loadHistorySet();
  const fresh = [];

  for (const it of items) {
    if (!it.videoId) continue;
    if (history.has(it.videoId)) continue;

    const vv = ReviewAgent.validateVideo({
      title: it.title,
      url: it.link || `https://www.youtube.com/watch?v=${it.videoId}`,
    });
    if (!vv.ok) {
      logPhase('harvester', 'skip-invalid', vv.errors.join(';'));
      continue;
    }
    fresh.push(it);
    if (fresh.length >= VIDEO_BATCH) break;
  }

  logPhase(
    phase,
    'batch',
    `processing ${fresh.length} new videos (max ${VIDEO_BATCH})`
  );

  const videosDir = path.join(vault, 'videos');
  const topicsDir = path.join(vault, 'topics');
  fs.mkdirSync(videosDir, { recursive: true });
  fs.mkdirSync(topicsDir, { recursive: true });

  let videosAdded = 0;
  let topicsCreated = 0;

  for (const it of fresh) {
    const topics = processor.extractCandidateTopics(it.title);
    const topicLinks = processor.topicsToWikiLinks(topics);

    const fname = videoNoteFilename(it.title, it.videoId);
    const videoPath = path.join(videosDir, fname);

    if (ReviewAgent.checkFileExists(videoPath)) {
      logPhase('generator', 'skip-exists', videoPath);
      appendHistoryAtomic(it.videoId);
      continue;
    }

    const md = buildVideoMarkdown({
      title: it.title,
      source: it.link,
      channelTitle: feedTitle,
      channelId,
      videoId: it.videoId,
      topicLabels: topics,
      pubDate: it.pubDate,
      duration: it.duration || null,
      viewCount: it.viewCount || null,
    });

    fs.writeFileSync(videoPath, md, 'utf8');
    videosAdded += 1;
    appendHistoryAtomic(it.videoId);
    logPhase('generator', 'video', fname);

    for (const label of topics) {
      const tname = topicNoteFilename(label);
      const tpath = path.join(topicsDir, tname);
      if (ReviewAgent.checkFileExists(tpath)) continue;
      fs.writeFileSync(tpath, buildTopicMarkdown(label), 'utf8');
      topicsCreated += 1;
      logPhase('generator', 'topic', tname);
    }
  }

  reportFile(
    `[sync] videos_added=${videosAdded} topics_created=${topicsCreated} channel=${channelId}`
  );
  logPhase(
    phase,
    'done',
    `videos_added=${videosAdded} topics_created=${topicsCreated}`
  );
}

const debounceMs = 800;
const pendingTimers = new Map();

function scheduleProcess(absPath) {
  if (pendingTimers.has(absPath)) {
    clearTimeout(pendingTimers.get(absPath));
  }
  const t = setTimeout(() => {
    pendingTimers.delete(absPath);
    processClipping(absPath).catch((e) => {
      const userMessage = errorMessages.getErrorMessage(e, { action: 'process video' });
      logger.error('Processing failed', userMessage);
      reportFile(`[error] ${e.stack || e}`);
    });
  }, debounceMs);
  pendingTimers.set(absPath, t);
}

function startWatcher() {
  const vault = getVaultRoot();
  const clippings = path.join(vault, 'clippings');

  fs.mkdirSync(clippings, { recursive: true });

  logPhase('boot', 'vault', vault);
  logPhase('boot', 'watch', clippings);

  /** Watch folder (not ** glob) to avoid EMFILE / too many open files on macOS */
  const watcher = chokidar.watch(clippings, {
    persistent: true,
    ignoreInitial: false,
    depth: 15,
    ignorePermissionErrors: true,
    usePolling:
      process.env.CHOKIDAR_POLLING === '1' ||
      process.env.CHOKIDAR_POLLING === 'true',
    awaitWriteFinish: {
      stabilityThreshold: 400,
      pollInterval: 100,
    },
  });

  const handleMd = (p) => {
    if (typeof p === 'string' && p.endsWith('.md')) scheduleProcess(p);
  };

  watcher.on('add', handleMd);
  watcher.on('change', handleMd);

  watcher.on('error', (err) => {
    const userMessage = errorMessages.getErrorMessage(err, { action: 'monitor vault folder' });
    logger.error('Vault monitoring error', userMessage);
  });
}

if (require.main === module) {
  const args = process.argv.slice(2);

  // Handle topic merge command
  if (args[0] === '--merge-topic-pair' && args[1] && args[2]) {
    const TopicMerger = require('./topic-merger.js');
    const merger = new TopicMerger(getVaultRoot());
    console.log(`Merging topic "${args[1]}" into "${args[2]}"...`);
    const result = merger.mergeTopic(args[1], args[2]);
    if (result.success) {
      console.log(`✓ Success: ${result.mergedCount} videos updated`);
      process.exit(0);
    } else {
      logger.error('Startup failed', result.error);
      process.exit(1);
    }
  }

  // Handle topic listing
  else if (args[0] === '--list-topics') {
    const TopicMerger = require('./topic-merger.js');
    const merger = new TopicMerger(getVaultRoot());
    const topics = merger.getAllTopics();
    console.log('Topics in vault:');
    topics.forEach(t => console.log(`  ${t}`));
    process.exit(0);
  }

  // Handle duplicate detection
  else if (args[0] === '--find-duplicate-topics') {
    const TopicMerger = require('./topic-merger.js');
    const merger = new TopicMerger(getVaultRoot());
    const dupes = merger.findDuplicates();
    console.log('Potential duplicate topics:');
    if (dupes.length === 0) {
      console.log('  (none found)');
    } else {
      dupes.forEach(([t1, t2]) => {
        console.log(`  "${t1}" vs "${t2}"`);
      });
    }
    process.exit(0);
  }

  // Default: start watcher
  else {
    startWatcher();
  }
}

module.exports = {
  startWatcher,
  extractClipSource,
  extractVideoIdFromUrl,
  getVaultRoot,
  processClipping,
  buildVideoMarkdown,
  buildTopicMarkdown,
};
