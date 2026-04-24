'use strict';

const fs = require('fs');
const path = require('path');
const ReviewAgent = require('./reviewer.js');

/** Load external topic blacklist configuration */
let topicBlacklist = new Set();
try {
  const blacklistPath = path.join(__dirname, '..', '.planning', 'topic-blacklist.json');
  const blacklistData = JSON.parse(fs.readFileSync(blacklistPath, 'utf-8'));
  topicBlacklist = new Set(Object.keys(blacklistData).map(t => t.toLowerCase()));
} catch (e) {
  console.warn('[processor] Failed to load topic blacklist, using defaults:', e.message);
  topicBlacklist = new Set([
    'must', 'watch', 'insane', 'crazy', 'shocking', 'ultimate', 'best', 'worst',
    'official', 'trailer', 'new', 'live', 'streaming', 'episode', 'full',
    'video', 'update', 'the', 'you', 'and', 'for', 'are', 'that', 'this',
    'one', 'can', 'get', 'almost', 'more', 'amazing', 'awesome',
  ]);
}

/** Load external topic remap configuration */
let topicRemap = {};
try {
  const remapPath = path.join(__dirname, '..', '.planning', 'topic-remap.json');
  if (fs.existsSync(remapPath)) {
    const remapData = JSON.parse(fs.readFileSync(remapPath, 'utf-8'));
    // Filter out comment/instruction keys
    Object.keys(remapData).forEach(key => {
      if (!key.startsWith('_')) {
        topicRemap[key.toLowerCase()] = remapData[key];
      }
    });
  }
} catch (e) {
  console.warn('[processor] Failed to load topic remap, continuing without:', e.message);
  topicRemap = {};
}

const STOP_LABELS = new Set([
  'you', 'the', 'and', 'for', 'are', 'that', 'this', 'one', 'any',
  'only', 'then', 'there', 'your', 'from', 'into', 'when', 'what',
  'how', 'why', 'just', 'also', 'here', 'all', 'most', 'some', 'more',
  'less', 'much', 'many', 'too', 'very', 'even', 'still', 'yet', 'with',
  'but', 'or', 'in', 'on', 'at', 'by', 'to', 'a', 'an',
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

function extractCandidateTopics(title) {
  if (!title || typeof title !== 'string') return [];

  let t = stripBareYears(title);
  const found = [];

  /** @type {Map<string,string>} lowercase -> display */
  const seen = new Map();

  // Extract capitalized multi-word phrases (2-3 words): "Machine Learning", "Web Development"
  // Prioritize longer phrases first to avoid individual word extraction
  const capPhrases = t.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}\b/g) || [];
  const usedRanges = new Set(); // Track which words we've already extracted

  for (const phrase of capPhrases) {
    let clean = stripPunctuation(phrase.trim());
    const low = clean.toLowerCase();
    if (!topicBlacklist.has(low)) {
      seen.set(low, clean);
      usedRanges.add(low); // Mark these words as used
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
    if (!topicBlacklist.has(low) && !isPartOfPhrase) {
      seen.set(low, clean);
    }
  }

  // Extract ALL CAPS tokens (likely acronyms), 2–10 chars
  const acronyms = t.match(/\b[A-Z]{2,10}\b/g) || [];
  for (const a of acronyms) {
    const clean = stripPunctuation(a);
    const low = clean.toLowerCase();
    if (clean && !topicBlacklist.has(low)) {
      seen.set(low, clean);
    }
  }

  // Apply remapping for deduplication and collect final topics
  seen.forEach((v) => {
    if (isPlausibleLabel(v)) {
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
    blacklist: topicBlacklist,
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
  topicBlacklist,
  topicRemap,
};
