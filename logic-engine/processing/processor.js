'use strict';

const fs = require('fs');
const path = require('path');
const ReviewAgent = require('../utils/reviewer.js');
const logger = require('../utils/logger.js');

/** Cached topic blacklist with 60-second TTL */
let _blacklistCache = null;
let _blacklistLoadedAt = 0;

function getBlacklist() {
  const now = Date.now();
  if (now - _blacklistLoadedAt < 60_000 && _blacklistCache) {
    return _blacklistCache;
  }

  try {
    const blacklistPath = path.join(__dirname, '..', '..', '.planning', 'topic-blacklist.json');
    const blacklistData = JSON.parse(fs.readFileSync(blacklistPath, 'utf-8'));
    _blacklistCache = new Set(Object.keys(blacklistData).map(t => t.toLowerCase()));
    _blacklistLoadedAt = now;
    logger.log('INFO', 'PROCESSOR', 'Reloaded topic blacklist', `${_blacklistCache.size} terms`);
    return _blacklistCache;
  } catch (e) {
    logger.log('WARN', 'PROCESSOR', 'Failed to load topic blacklist', `Using defaults: ${e.message}`);
    _blacklistCache = new Set([
      'must', 'watch', 'insane', 'crazy', 'shocking', 'ultimate', 'best', 'worst',
      'official', 'trailer', 'new', 'live', 'streaming', 'episode', 'full',
      'video', 'update', 'the', 'you', 'and', 'for', 'are', 'that', 'this',
      'one', 'can', 'get', 'almost', 'more', 'amazing', 'awesome',
    ]);
    _blacklistLoadedAt = now;
    return _blacklistCache;
  }
}

/** Load external topic remap configuration */
let topicRemap = {};
try {
  const remapPath = path.join(__dirname, '..', '..', '.planning', 'topic-remap.json');
  if (fs.existsSync(remapPath)) {
    const remapData = JSON.parse(fs.readFileSync(remapPath, 'utf-8'));
    // Filter out comment/instruction keys
    Object.keys(remapData).forEach(key => {
      if (!key.startsWith('_')) {
        topicRemap[key.toLowerCase()] = remapData[key];
      }
    });
    logger.log('INFO', 'PROCESSOR', 'Loaded topic remap', `${Object.keys(topicRemap).length} mappings`);
  }
} catch (e) {
  logger.log('WARN', 'PROCESSOR', 'Failed to load topic remap', `Continuing without: ${e.message}`);
  topicRemap = {};
}

const STOP_LABELS = new Set([
  // Articles, pronouns, prepositions (original)
  'you', 'the', 'and', 'for', 'are', 'that', 'this', 'one', 'any',
  'only', 'then', 'there', 'your', 'from', 'into', 'when', 'what',
  'how', 'why', 'just', 'also', 'here', 'all', 'most', 'some', 'more',
  'less', 'much', 'many', 'too', 'very', 'even', 'still', 'yet', 'with',
  'but', 'or', 'in', 'on', 'at', 'by', 'to', 'a', 'an',
  // Ordinals (appear capitalized but not topics)
  'first', 'second', 'third', 'fourth', 'fifth', 'last', 'next',
  // Time units (appear capitalized but not topics)
  'minute', 'minutes', 'second', 'seconds', 'hour', 'hours', 'day', 'days',
  'week', 'weeks', 'month', 'months', 'year', 'years',
  // Generic skill/experience descriptors
  'experience', 'beginner', 'simple', 'easy', 'hard', 'quick',
  'basic', 'advanced', 'intermediate', 'complex',
  // Comparative/evaluative adjectives (not topics)
  'better', 'worse', 'different', 'perfect', 'wrong', 'right', 'good', 'bad',
  // Generic tech/project nouns
  'model', 'version', 'release', 'test', 'testing', 'tests',
  'feature', 'features', 'setup', 'install', 'project', 'issue', 'issues',
  // Common filler words in titles
  'actually', 'literally', 'basically', 'finally', 'every', 'never',
  'again', 'back', 'really', 'before', 'after', 'since', 'during',
  'while', 'so', 'own', 'nothing', 'something', 'everything', 'anything',
]);

function isPlausibleLabel(t) {
  if (!t || t.length < 3 || t.length > 50) return false;
  let s = t.trim();

  // Strip trailing/leading punctuation
  s = s.replace(/^['"().,;:!?\-_\[\]]+|['"().,;:!?\-_\[\]]+$/g, '');
  if (!s || s.length < 3) return false;

  if (/[@#]/.test(s)) return false;
  if (/^['"().,;:!?\-_]+$/.test(s)) return false;
  if (/\bhttps?:\/\//i.test(s)) return false;
  if (/\s-\s*$/.test(s)) return false;
  if (/^[a-z]+\)$/i.test(s)) return false;
  if (STOP_LABELS.has(s.toLowerCase())) return false;

  // Reject labels starting with first-person pronouns
  if (/^(I |My |We |Our |Me |Us )/i.test(s)) return false;

  // Reject labels ending with prepositions or conjunctions
  if (/\s(for|with|of|in|on|at|by|to|and|or|but|from|into|about)$/i.test(s)) return false;

  // Reject single-word labels unless they're all-caps (acronym) or 5+ chars
  if (!s.includes(' ')) {
    if (!/^[A-Z]{2,}$/.test(s) && s.length < 5) return false;
  }

  return true;
}

function stripBareYears(text) {
  return text.replace(/\b(19|20)\d{2}\b/g, ' ');
}

function stripPunctuation(s) {
  return s.replace(/^['"().,;:!?\-_\[\]]+|['"().,;:!?\-_\[\]]+$/g, '');
}

/**
 * Apply topic remapping for deduplication
 */
function remapTopic(topic) {
  if (!topic) return topic;
  const key = topic.toLowerCase();
  return topicRemap[key] || topic;
}

/**
 * Check if a phrase contains blacklisted words
 */
function isPhraseTainted(phrase, blacklist) {
  const words = phrase.toLowerCase().split(/\s+/);
  return words.some(word => blacklist.has(word));
}

function extractCandidateTopics(title) {
  if (!title || typeof title !== 'string') return [];

  let t = stripBareYears(title);
  const found = [];
  const blacklist = getBlacklist();

  /** @type {Map<string,string>} lowercase -> display */
  const seen = new Map();

  // Extract capitalized multi-word phrases (2-3 words): "Machine Learning", "Web Development"
  // Prioritize longer phrases first to avoid individual word extraction
  const capPhrases = t.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}\b/g) || [];

  for (const phrase of capPhrases) {
    let clean = stripPunctuation(phrase.trim());
    const low = clean.toLowerCase();
    // Skip if phrase contains any blacklisted words
    if (!isPhraseTainted(clean, blacklist) && !blacklist.has(low)) {
      seen.set(low, clean);
    }
  }

  // Extract single capitalized words if they're 5+ chars (likely proper nouns)
  // Skip if already captured in a multi-word phrase
  const capWords = t.match(/\b[A-Z][a-z]{4,}\b/g) || [];
  for (const word of capWords) {
    let clean = stripPunctuation(word.trim());
    const low = clean.toLowerCase();
    // Don't extract single words that are part of a multi-word phrase
    const isPartOfPhrase = Array.from(seen.values()).some(phrase =>
      phrase.toLowerCase().includes(low)
    );
    if (!blacklist.has(low) && !isPartOfPhrase) {
      seen.set(low, clean);
    }
  }

  // Extract ALL CAPS tokens (likely acronyms), 3–10 chars (min 3 to filter noise like IS, IT, AT)
  const acronyms = t.match(/\b[A-Z]{3,10}\b/g) || [];
  for (const a of acronyms) {
    const clean = stripPunctuation(a);
    const low = clean.toLowerCase();
    if (clean && !blacklist.has(low)) {
      seen.set(low, clean);
    }
  }

  // Apply remapping for deduplication and collect final topics
  seen.forEach((v) => {
    if (isPlausibleLabel(v) && !isPhraseTainted(v, blacklist)) {
      const remapped = remapTopic(v);
      // Avoid duplicates after remapping
      if (!found.includes(remapped)) {
        found.push(remapped);
      }
    }
  });

  return ReviewAgent.cleanTopics(found, {
    minLen: 3,
    maxTopics: 7,
    blacklist,
  });
}

/**
 * Convert topic labels to wikilink strings [[Label]]
 */
function topicsToWikiLinks(labels) {
  return labels.map((label) => `[[${label}]]`);
}

module.exports = {
  extractCandidateTopics,
  topicsToWikiLinks,
  remapTopic,
  getBlacklist,
  topicRemap,
};
