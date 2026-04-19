'use strict';

/**
 * State schemas (JSON):
 * - channels.json: { channels: Record<channelId, { resolvedAt?, sourceVideoId?, label? }> }
 * - history.json: { videoIds: string[] }
 */

const matter = require('gray-matter');
const fs = require('fs');
const path = require('path');

const INVALID_FILENAME_CHARS = /[<>:"|?*\\/\u0000-\u001f]/g;

const DEFAULT_TOPIC_BLACKLIST = new Set([
  'watch',
  'video',
  'episode',
  'official',
  'trailer',
  'update',
  'must',
  'insane',
  'crazy',
  'best',
  'worst',
  'new',
  'live',
]);

function sanitizeFilename(name, replacement = '-') {
  if (typeof name !== 'string') return '';
  let s = name.replace(INVALID_FILENAME_CHARS, replacement);
  s = s.replace(/\s+/g, ' ').trim();
  s = s.replace(/-+/g, replacement).replace(/^-+|-+$/g, '');
  return s.slice(0, 200);
}

function validateFilename(name) {
  if (!name || typeof name !== 'string') {
    return { ok: false, errors: ['filename must be a non-empty string'] };
  }
  if (/[<>:"|?*\\\u0000-\u001f]/.test(name)) {
    return { ok: false, errors: ['filename contains forbidden characters'] };
  }
  if (name.includes('/') || name.includes('\\')) {
    return { ok: false, errors: ['filename must not contain path separators'] };
  }
  return { ok: true, errors: [] };
}

/** YouTube uploads channel IDs are UC-prefixed, 24 chars */
function validateChannelId(id) {
  if (!id || typeof id !== 'string') {
    return { ok: false, errors: ['channelId missing'] };
  }
  if (!/^UC[A-Za-z0-9_-]{22}$/.test(id)) {
    return { ok: false, errors: ['channelId must be UC + 22 chars (24 total)'] };
  }
  return { ok: true, errors: [] };
}

function validateVideo({ title, url }) {
  const errors = [];
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('title must be non-empty');
  }
  if (!url || typeof url !== 'string') {
    errors.push('url must be a string');
  } else {
    let u;
    try {
      u = new URL(url);
    } catch {
      errors.push('url is not valid');
      return { ok: false, errors };
    }
    const host = u.hostname.replace(/^www\./, '');
    const yt =
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'youtu.be';
    if (!yt) errors.push('url must be youtube.com or youtu.be');
  }
  return { ok: errors.length === 0, errors };
}

function parseFrontmatter(markdown) {
  try {
    const parsed = matter(markdown || '');
    return {
      ok: true,
      data: parsed.data,
      content: parsed.content,
      errors: [],
    };
  } catch (e) {
    return {
      ok: false,
      data: {},
      content: markdown || '',
      errors: [String(e.message || e)],
    };
  }
}

function validateYamlFrontmatter(markdown) {
  const r = parseFrontmatter(markdown);
  if (!r.ok) return { ok: false, errors: r.errors };
  return { ok: true, errors: [] };
}

function toPascalCaseWords(str) {
  return str
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Dedupe and filter topic labels; enforce min length and blacklist.
 */
function cleanTopics(rawTopics, options = {}) {
  const minLen = options.minLen ?? 3;
  const maxTopics = options.maxTopics ?? 12;
  const blacklist = options.blacklist ?? DEFAULT_TOPIC_BLACKLIST;

  if (!Array.isArray(rawTopics)) return [];

  const seen = new Set();
  const out = [];

  for (let t of rawTopics) {
    if (typeof t !== 'string') continue;
    t = t.trim();
    if (t.length < minLen) continue;
    const lower = t.toLowerCase();
    if (blacklist.has(lower)) continue;
    const label = toPascalCaseWords(t);
    if (label.length < minLen) continue;
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(label);
    if (out.length >= maxTopics) break;
  }

  return out;
}

function checkFileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

module.exports = {
  sanitizeFilename,
  validateFilename,
  validateChannelId,
  validateVideo,
  parseFrontmatter,
  validateYamlFrontmatter,
  cleanTopics,
  toPascalCaseWords,
  checkFileExists,
  INVALID_FILENAME_CHARS,
  DEFAULT_TOPIC_BLACKLIST,
};

if (require.main === module && process.argv.includes('--self-test')) {
  const assert = (cond, msg) => {
    if (!cond) throw new Error(msg);
  };
  assert(validateChannelId('UCshort').ok === false, 'bad length');
  assert(validateChannelId(`UC${'x'.repeat(22)}`).ok === true, 'valid UC id');
  assert(validateFilename('bad:name').ok === false, 'bad name');
  assert(sanitizeFilename('Hello: World') === 'Hello- World', 'sanitize');
  assert(cleanTopics(['Mac Apps', 'a', 'Must Watch']).includes('Mac Apps'), 'clean');
  console.log('[reviewer] self-test OK');
}
