'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Centralized logger module for all pipeline phases.
 * Supports INFO, WARN, ERROR levels with timestamps, phase, action, detail.
 * Appends to daily log file with no buffering (atomic writes).
 */

function getLogsDir() {
  return path.join(path.dirname(__dirname), '.planning', 'logs');
}

function getTodayLogFile() {
  const logsDir = getLogsDir();
  fs.mkdirSync(logsDir, { recursive: true });
  const day = new Date().toISOString().slice(0, 10);
  return path.join(logsDir, `run-${day}.log`);
}

function formatEntry(level, phase, action, detail) {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${phase}] [${level}] ${action}: ${detail}`;
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

module.exports = {
  log,
  getLogContent,
  getLogsDir,
  getTodayLogFile,
  levels: {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR'
  }
};
