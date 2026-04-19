'use strict';

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const ReviewAgent = require('./reviewer.js');
const engine = require('./engine.js');
const processor = require('./processor.js');

const VIDEO_BATCH = 15;

function getVaultRoot() {
  return (
    process.env.VAULT_ROOT ||
    path.resolve(__dirname, '..', 'obsidian-vault')
  );
}

function logPhase(phase, action, detail) {
  const msg = `[${phase}] ${action} : ${detail}`;
  console.log(msg);
  reportFile(msg);
}

function reportFile(line) {
  const logsDir = path.join(__dirname, 'logs');
  fs.mkdirSync(logsDir, { recursive: true });
  const day = new Date().toISOString().slice(0, 10);
  const logFile = path.join(logsDir, `run-${day}.log`);
  fs.appendFileSync(
    logFile,
    `[${new Date().toISOString()}] ${line}\n`,
    'utf8'
  );
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

function sanitizeFilename(str) {
  return ReviewAgent.sanitizeFilename((str || '').replace(/\s+/g, ' ')).trim();
}

function buildVideoMarkdown({
  title,
  source,
  channelTitle,
  channelId,
  videoId,
  topicLabels,
  pubDate,
}) {
  const yamlTopics = topicLabels.map((t) => `  - "[[${t.replace(/"/g, '\\"')}]]"`);
  const topicLinksLine = topicLabels.map((t) => `[[${t}]]`).join(' ');
  const dateLine = pubDate
    ? pubDate.slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  const topicsYaml =
    yamlTopics.length > 0 ? `\n${yamlTopics.join('\n')}` : ' []';

  // Channel as wikilink for Obsidian to render as a clickable link
  const channelFile = sanitizeFilename(channelTitle);
  const channelWikilink = `[[channels/${channelFile}]]`;

  return `---
title: ${escapeYamlString(title)}
source: ${escapeYamlString(source)}
channel: ${channelWikilink}
channel_id: ${channelId}
video_id: ${videoId}
topics:${topicsYaml}
date: ${dateLine}
type: video
tags:
  - youtube/video
---

# ${title}

**Channel:** ${channelWikilink}
**Published:** ${pubDate || dateLine}

## Topics

${topicLinksLine || '_No extracted topics_'}

## Notes

`;

}

function buildChannelMarkdown(channelTitle, channelId) {
  const youtubeUrl = `https://www.youtube.com/channel/${channelId}`;

  return `---
title: "${escapeYamlString(channelTitle)}"
channel_id: ${channelId}
type: channel
tags:
  - youtube/channel
---

# ${channelTitle}

[Watch on YouTube →](${youtubeUrl})

## Videos

\`\`\`dataview
TABLE title, source as "Watch", date as "Published"
FROM "videos"
WHERE channel = this.file.link
SORT date DESC
\`\`\`

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

function ensureChannelPage(channelTitle, channelId, channelsDir) {
  const filename = sanitizeFilename(channelTitle);
  const channelPath = path.join(channelsDir, `${filename}.md`);

  if (ReviewAgent.checkFileExists(channelPath)) {
    logPhase('channel', 'exists', filename);
    return;
  }

  const md = buildChannelMarkdown(channelTitle, channelId);
  fs.writeFileSync(channelPath, md, 'utf8');
  logPhase('channel', 'created', filename);
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
    logPhase('harvester', 'error', String(e.message || e));
    return;
  }

  upsertChannelRecord(channelId, { feedTitle });

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

  // Ensure channel page exists
  const channelsDir = path.join(vault, 'channels');
  fs.mkdirSync(channelsDir, { recursive: true });
  ensureChannelPage(feedTitle, channelId, channelsDir);

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
      console.error(e);
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
    logPhase('watcher', 'error', String(err));
  });
}

if (require.main === module) {
  startWatcher();
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
