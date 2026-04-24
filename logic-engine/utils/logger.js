'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Centralized logger module for all pipeline phases.
 * Supports INFO, WARN, ERROR levels with timestamps, phase, action, detail.
 * Appends to daily log file with no buffering (atomic writes).
 */

function getLogsDir() {
  return path.join(path.resolve(__dirname, '..', '..'), '.planning', 'logs');
}

function getTodayLogFile() {
  const logsDir = getLogsDir();
  fs.mkdirSync(logsDir, { recursive: true });
  const day = new Date().toISOString().slice(0, 10);
  return path.join(logsDir, `run-${day}.log`);
}

function formatEntry(level, phase, action, detail) {
  // Format: Human-readable, complete sentence, no jargon
  // Timestamp includes readable date, not milliseconds
  const now = new Date();
  const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  let prefix = '';
  switch (level) {
    case 'INFO':
      prefix = '✓';
      break;
    case 'WARN':
      prefix = '⚠';
      break;
    case 'ERROR':
      prefix = '✗';
      break;
    default:
      prefix = '•';
  }

  return `${prefix} [${date} ${time}] ${action}: ${detail}`;
}

function log(level, phase, action, detail) {
  if (!['INFO', 'WARN', 'ERROR'].includes(level)) {
    level = 'INFO';
  }

  const entry = formatEntry(level, phase, action, detail);
  const logFile = getTodayLogFile();

  // Atomic append (no buffering)
  fs.appendFileSync(logFile, entry + '\n', 'utf8');

  // Also log to console for developer visibility
  console.log(entry);
}

function getLogContent(daysBack = 0) {
  try {
    const logDate = new Date();
    logDate.setDate(logDate.getDate() - daysBack);
    const dateStr = logDate.toISOString().slice(0, 10);
    const logFile = path.join(getLogsDir(), `run-${dateStr}.log`);

    if (!fs.existsSync(logFile)) {
      return '';
    }

    return fs.readFileSync(logFile, 'utf8');
  } catch {
    return '';
  }
}

/**
 * Helper methods for plain language logging.
 * Use these instead of generic log() for better user-facing messages.
 */

function success(action, details) {
  log('INFO', 'SCRAPER', action, details);
}

function warning(action, details) {
  log('WARN', 'SCRAPER', action, details);
}

function error(action, details) {
  log('ERROR', 'SCRAPER', action, details);
}

function videoAdded(title, channel) {
  success('Video added', `"${title}" from ${channel}`);
}

function videoSkipped(title, reason) {
  warning('Video skipped', `"${title}" — ${reason}`);
}

function topicExtracted(title, topics) {
  const topicList = Array.isArray(topics) ? topics.join(', ') : topics;
  success('Topics extracted', `"${title}" has topics: ${topicList}`);
}

function scrapeStarted(channelCount) {
  success('Scrape started', `Checking ${channelCount} channel(s) for new videos`);
}

function scrapeCompleted(videoCount, topicCount) {
  success('Scrape completed', `Added ${videoCount} video(s) with ${topicCount} topic(s)`);
}

function scrapeError(details) {
  error('Scrape failed', details);
}

function channelProcessed(channelName, videoCount) {
  success('Channel processed', `"${channelName}" has ${videoCount} video(s)`);
}

module.exports = {
  log,
  getLogContent,
  getLogsDir,
  getTodayLogFile,
  // Plain language helpers
  success,
  warning,
  error,
  videoAdded,
  videoSkipped,
  topicExtracted,
  scrapeStarted,
  scrapeCompleted,
  scrapeError,
  channelProcessed,
  levels: {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR'
  }
};
