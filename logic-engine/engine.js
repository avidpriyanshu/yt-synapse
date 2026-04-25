'use strict';

const Parser = require('rss-parser');

const ReviewAgent = require('./utils/reviewer.js');
const logger = require('./utils/logger.js');
const { pickUA, recordRequest } = require('./utils/user-agents.js');
const { requestDelay } = require('./utils/delays.js');

const YT_HOST = 'https://www.youtube.com';

function makeParser() {
  return new Parser({
    customFields: {
      item: [
        ['yt:videoId', 'ytVideoId'],
        ['yt:channelId', 'ytChannelId'],
      ],
    },
    requestOptions: {
      headers: { 'User-Agent': pickUA() },
    },
  });
}

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
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': pickUA(),
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });
    recordRequest(res.status);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  } catch (err) {
    logger.log('WARN', 'EXTRACT', 'Failed to fetch watch page', `${videoId}: ${err.message}`);
    throw err;
  }
}

/**
 * Resolve channel ID from a video page. Returns null if all strategies fail.
 */
async function resolveChannelIdFromVideo(videoId) {
  try {
    const html = await fetchWatchPageHtml(videoId);
    const channelId = extractChannelIdFromHtml(html);
    if (!channelId) {
      logger.log('WARN', 'RESOLVE', 'Could not extract channel ID from page', videoId);
    }
    return channelId;
  } catch (err) {
    logger.log('ERROR', 'RESOLVE', 'Network timeout fetching channel page', `${videoId}: ${err.message}`);
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
  } catch (err) {
    logger.log('WARN', 'EXTRACT', 'Failed to fetch metadata', `${videoId}: ${err.message}`);
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
  let feed;
  try {
    feed = await makeParser().parseURL(url);
  } catch (err) {
    logger.log('ERROR', 'EXTRACT', 'Failed to fetch RSS feed', `${channelId}: ${err.message}`);
    throw err;
  }
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
        await requestDelay();
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
};
