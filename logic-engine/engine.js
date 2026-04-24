'use strict';

const Parser = require('rss-parser');

const ReviewAgent = require('./reviewer.js');

const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const YT_HOST = 'https://www.youtube.com';

const parser = new Parser({
  customFields: {
    item: [
      ['yt:videoId', 'ytVideoId'],
      ['yt:channelId', 'ytChannelId'],
    ],
  },
  requestOptions: {
    headers: { 'User-Agent': BROWSER_UA },
  },
});

/**
 * Try three different patterns for channelId in YouTube watch page HTML.
 */
function extractChannelIdFromHtml(html) {
  if (!html || typeof html !== 'string') return null;

  const patterns = [
    /"channelId":"(UC[A-Za-z0-9_-]{22})"/,
    /"externalId":"(UC[A-Za-z0-9_-]{22})"/,
    /browse_id":"(UC[A-Za-z0-9_-]{22})"/,
  ];

  for (const re of patterns) {
    const m = html.match(re);
    if (m && m[1]) {
      const v = ReviewAgent.validateChannelId(m[1]);
      if (v.ok) return m[1];
    }
  }
  return null;
}

async function fetchWatchPageHtml(videoId) {
  const url = `${YT_HOST}/watch?v=${encodeURIComponent(videoId)}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': BROWSER_UA,
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

/**
 * Resolve channel ID from a video page. Returns null if all strategies fail.
 */
async function resolveChannelIdFromVideo(videoId) {
  try {
    const html = await fetchWatchPageHtml(videoId);
    return extractChannelIdFromHtml(html);
  } catch {
    return null;
  }
}

/**
 * Extract duration from YouTube watch page HTML.
 * @param {string} html - YouTube watch page HTML content
 * @returns {number|null} Duration in seconds, or null if not found
 */
function extractDurationFromHtml(html) {
  if (!html || typeof html !== 'string') return null;

  const match = html.match(/"lengthSeconds":"(\d+)"/);
  if (match && match[1]) {
    const seconds = parseInt(match[1], 10);
    return !isNaN(seconds) && seconds >= 0 ? seconds : null;
  }
  return null;
}

/**
 * Extract view count from YouTube watch page HTML.
 * @param {string} html - YouTube watch page HTML content
 * @returns {number|null} View count, or null if not found
 */
function extractViewCountFromHtml(html) {
  if (!html || typeof html !== 'string') return null;

  const match = html.match(/"viewCount":"(\d+)"/);
  if (match && match[1]) {
    const count = parseInt(match[1], 10);
    return !isNaN(count) && count >= 0 ? count : null;
  }
  return null;
}

/**
 * Fetch and extract metadata (duration, view count) from a YouTube video.
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<{duration: number|null, viewCount: number|null}>} Metadata object
 */
async function fetchVideoMetadata(videoId) {
  try {
    const html = await fetchWatchPageHtml(videoId);
    return {
      duration: extractDurationFromHtml(html),
      viewCount: extractViewCountFromHtml(html),
    };
  } catch {
    // Graceful degradation: return nulls on any error
    return { duration: null, viewCount: null };
  }
}

function rssUrlForChannel(channelId) {
  return `${YT_HOST}/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
}

/**
 * Fetch RSS for channel; returns items with title, link, videoId, pubDate.
 * Enriches each item with duration and viewCount via fetchVideoMetadata.
 */
async function fetchChannelFeedVideoItems(channelId) {
  const url = rssUrlForChannel(channelId);
  const feed = await parser.parseURL(url);
  const feedTitle = (feed.title || '').trim() || 'YouTube Channel';
  const items = [];

  for (const entry of feed.items || []) {
    const title = (entry.title || '').trim();
    let videoId =
      entry.ytVideoId ||
      entry.id?.replace(/^yt:video:/, '') ||
      null;

    if (!videoId && entry.link) {
      try {
        const u = new URL(entry.link);
        videoId = u.searchParams.get('v');
      } catch {
        /* ignore */
      }
    }

    const link =
      entry.link ||
      (videoId ? `${YT_HOST}/watch?v=${videoId}` : '');

    const item = {
      title,
      link,
      videoId,
      pubDate: entry.pubDate || entry.isoDate || '',
      duration: null,
      viewCount: null,
    };

    // Enrich with duration and viewCount if we have a videoId
    if (videoId) {
      try {
        const metadata = await fetchVideoMetadata(videoId);
        item.duration = metadata.duration;
        item.viewCount = metadata.viewCount;
      } catch {
        // Graceful degradation: keep nulls on error
      }
    }

    items.push(item);
  }

  return { feedTitle, items };
}

module.exports = {
  extractChannelIdFromHtml,
  resolveChannelIdFromVideo,
  fetchWatchPageHtml,
  rssUrlForChannel,
  fetchChannelFeedVideoItems,
  extractDurationFromHtml,
  extractViewCountFromHtml,
  fetchVideoMetadata,
  BROWSER_UA,
};
