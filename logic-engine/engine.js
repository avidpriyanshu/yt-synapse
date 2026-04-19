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

function rssUrlForChannel(channelId) {
  return `${YT_HOST}/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
}

/**
 * Fetch RSS for channel; returns items with title, link, videoId, pubDate.
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

    items.push({
      title,
      link,
      videoId,
      pubDate: entry.pubDate || entry.isoDate || '',
    });
  }

  return { feedTitle, items };
}

module.exports = {
  extractChannelIdFromHtml,
  resolveChannelIdFromVideo,
  fetchWatchPageHtml,
  rssUrlForChannel,
  fetchChannelFeedVideoItems,
  BROWSER_UA,
};
