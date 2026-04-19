'use strict';

const nlp = require('compromise');
const ReviewAgent = require('./reviewer.js');

/** Clickbait / noise tokens (lowercase); years handled separately */
const CLICKBAIT = new Set([
  'must',
  'watch',
  'insane',
  'crazy',
  'shocking',
  'ultimate',
  'best',
  'worst',
  'official',
  'trailer',
  'new',
  'live',
  'streaming',
  'episode',
  'full',
]);

const mergedBlacklist = new Set([
  ...ReviewAgent.DEFAULT_TOPIC_BLACKLIST,
  ...CLICKBAIT,
]);

const STOP_LABELS = new Set([
  'you',
  'the',
  'and',
  'for',
  'are',
  'that',
  'this',
  'one',
  'any',
  'only',
  'then',
  'there',
  'your',
  'from',
  'into',
  'when',
  'what',
  'how',
  'why',
  'just',
  'also',
  'here',
  'all',
  'most',
  'some',
  'more',
  'less',
  'much',
  'many',
  'too',
  'very',
  'even',
  'still',
  'yet',
  'with',
  'but',
  'or',
  'in',
  'on',
  'at',
  'by',
  'to',
  'a',
  'an',
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

function extractCandidateTopics(title) {
  if (!title || typeof title !== 'string') return [];

  let t = stripBareYears(title);
  const doc = nlp(t);

  const found = [];

  /** @type {Map<string,string>} lowercase -> display */
  const seen = new Map();

  const people = doc.people().out('array');
  for (const p of people) {
    let s = String(p).trim();
    s = stripPunctuation(s);
    if (s.length >= 2) seen.set(s.toLowerCase(), s);
  }

  const places = doc.places().out('array');
  for (const p of places) {
    let s = String(p).trim();
    s = stripPunctuation(s);
    if (s.length >= 2) seen.set(s.toLowerCase(), s);
  }

  doc.match('#Noun+').json().forEach((chunk) => {
    let txt = chunk.text.trim();
    txt = stripPunctuation(txt);
    if (
      txt.length >= 3 &&
      /^[A-Z]/.test(txt) &&
      !CLICKBAIT.has(txt.toLowerCase())
    ) {
      seen.set(txt.toLowerCase(), txt);
    }
  });

  /** Capitalized sequences (potential proper nouns missed) */
  const capPhrases = t.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3}\b/g) || [];
  for (const phrase of capPhrases) {
    let clean = stripPunctuation(phrase.trim());
    const low = clean.toLowerCase();
    if (!CLICKBAIT.has(low)) seen.set(low, clean);
  }

  /** ALL CAPS tokens (likely acronyms), 2–10 chars */
  const acronyms =
    t.match(/\b[A-Z]{2,10}\b/g) || [];
  for (const a of acronyms) {
    const clean = stripPunctuation(a);
    if (clean) seen.set(clean.toLowerCase(), clean);
  }

  seen.forEach((v) => {
    if (isPlausibleLabel(v)) found.push(v);
  });

  return ReviewAgent.cleanTopics(found, {
    minLen: 3,
    maxTopics: 7,
    blacklist: mergedBlacklist,
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
  CLICKBAIT,
};
