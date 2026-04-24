'use strict';

const http = require('http');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('./utils/logger.js');

const CONFIG_PATH = path.join(__dirname, 'config', 'config.json');
const BLACKLIST_PATH = path.join(__dirname, '..', '.planning', 'topic-blacklist.json');

let runningProcess = null;
let runningProcessPid = null;

/**
 * Start scraper process via Node.js
 */
function startScraperProcess() {
  if (runningProcess) {
    return { status: 'already-running', pid: runningProcessPid };
  }

  try {
    const mainPath = path.join(__dirname, 'main.js');
    runningProcess = execFile('node', [mainPath], (error, stdout, stderr) => {
      if (error && error.killed === false) {
        logger.log('ERROR', 'SERVICE', 'Scraper crashed', `${error.message}\nSTDERR: ${stderr}`);
      } else {
        logger.log('INFO', 'SERVICE', 'Scraper exited', 'process ended normally');
      }
      runningProcess = null;
      runningProcessPid = null;
    });

    // Capture stderr in real-time
    if (runningProcess.stderr) {
      runningProcess.stderr.on('data', (data) => {
        logger.log('ERROR', 'SERVICE', 'Scraper stderr', data.toString());
      });
    }

    // Capture stdout for debugging
    if (runningProcess.stdout) {
      runningProcess.stdout.on('data', (data) => {
        logger.log('DEBUG', 'SERVICE', 'Scraper output', data.toString());
      });
    }

    runningProcessPid = runningProcess.pid;
    logger.log('INFO', 'SERVICE', 'Scraper started', `PID: ${runningProcessPid}`);
    return { status: 'started', pid: runningProcessPid };
  } catch (err) {
    logger.log('ERROR', 'SERVICE', 'Failed to start scraper', err.message);
    return { status: 'error', message: err.message };
  }
}

/**
 * Stop running scraper process
 */
function stopScraperProcess() {
  if (!runningProcess) {
    return { status: 'not-running' };
  }

  try {
    process.kill(runningProcessPid, 'SIGTERM');
    logger.log('INFO', 'SERVICE', 'Scraper stopped', `PID: ${runningProcessPid}`);
    runningProcess = null;
    runningProcessPid = null;
    return { status: 'stopped' };
  } catch (err) {
    logger.log('ERROR', 'SERVICE', 'Failed to stop scraper', err.message);
    return { status: 'error', message: err.message };
  }
}

/**
 * Check if scraper is running
 */
function getScraperStatus() {
  return {
    running: runningProcess !== null,
    pid: runningProcessPid,
  };
}

/**
 * Get log content for today
 */
function getLogsContent() {
  return logger.getLogContent(0);
}

/**
 * Read config.json
 */
function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (err) {
    logger.log('ERROR', 'CONFIG', 'Failed to read config', err.message);
    return { autoStartScraper: false, loggingLevel: 'INFO' };
  }
}

/**
 * Write config.json
 */
function writeConfig(updates) {
  try {
    const config = readConfig();
    Object.assign(config, updates);
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    logger.log('INFO', 'CONFIG', 'Config updated', JSON.stringify(updates));
    return { ok: true };
  } catch (err) {
    logger.log('ERROR', 'CONFIG', 'Failed to write config', err.message);
    return { ok: false, error: err.message };
  }
}

/**
 * Read topic blacklist
 */
function readBlacklist() {
  try {
    const data = JSON.parse(fs.readFileSync(BLACKLIST_PATH, 'utf-8'));
    const words = Object.keys(data).filter(k => !k.startsWith('_')).sort();
    return { ok: true, words };
  } catch (err) {
    logger.log('ERROR', 'BLACKLIST', 'Failed to read blacklist', err.message);
    return { ok: false, words: [], error: err.message };
  }
}

/**
 * Add word to blacklist
 */
function addBlacklistWord(word) {
  if (!word || typeof word !== 'string' || word.trim().length === 0) {
    return { ok: false, error: 'Word cannot be empty' };
  }

  try {
    const data = JSON.parse(fs.readFileSync(BLACKLIST_PATH, 'utf-8'));
    const cleanWord = word.trim().toLowerCase();
    data[cleanWord] = 'user-added';
    fs.writeFileSync(BLACKLIST_PATH, JSON.stringify(data, null, 2));
    logger.log('INFO', 'BLACKLIST', 'Added word', cleanWord);
    return { ok: true };
  } catch (err) {
    logger.log('ERROR', 'BLACKLIST', 'Failed to add word', err.message);
    return { ok: false, error: err.message };
  }
}

/**
 * Remove word from blacklist
 */
function removeBlacklistWord(word) {
  if (!word || typeof word !== 'string' || word.trim().length === 0) {
    return { ok: false, error: 'Word cannot be empty' };
  }

  try {
    const data = JSON.parse(fs.readFileSync(BLACKLIST_PATH, 'utf-8'));
    const cleanWord = word.trim().toLowerCase();
    delete data[cleanWord];
    fs.writeFileSync(BLACKLIST_PATH, JSON.stringify(data, null, 2));
    logger.log('INFO', 'BLACKLIST', 'Removed word', cleanWord);
    return { ok: true };
  } catch (err) {
    logger.log('ERROR', 'BLACKLIST', 'Failed to remove word', err.message);
    return { ok: false, error: err.message };
  }
}

/**
 * Parse JSON body from request
 */
function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
  });
}

/**
 * HTTP Request handler
 */
async function handleRequest(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  if (pathname === '/start' && req.method === 'POST') {
    const result = startScraperProcess();
    res.writeHead(200);
    res.end(JSON.stringify(result));
  } else if (pathname === '/stop' && req.method === 'POST') {
    const result = stopScraperProcess();
    res.writeHead(200);
    res.end(JSON.stringify(result));
  } else if (pathname === '/status' && req.method === 'GET') {
    const result = getScraperStatus();
    res.writeHead(200);
    res.end(JSON.stringify(result));
  } else if (pathname === '/logs' && req.method === 'GET') {
    const logs = getLogsContent();
    res.writeHead(200);
    res.end(JSON.stringify({ content: logs }));
  } else if (pathname === '/config' && req.method === 'GET') {
    const config = readConfig();
    res.writeHead(200);
    res.end(JSON.stringify(config));
  } else if (pathname === '/config' && req.method === 'POST') {
    const body = await parseJsonBody(req);
    const result = writeConfig(body);
    res.writeHead(result.ok ? 200 : 400);
    res.end(JSON.stringify(result));
  } else if (pathname === '/blacklist' && req.method === 'GET') {
    const result = readBlacklist();
    res.writeHead(result.ok ? 200 : 400);
    res.end(JSON.stringify(result));
  } else if (pathname === '/blacklist/add' && req.method === 'POST') {
    const body = await parseJsonBody(req);
    const result = addBlacklistWord(body.word);
    res.writeHead(result.ok ? 200 : 400);
    res.end(JSON.stringify(result));
  } else if (pathname === '/blacklist/remove' && req.method === 'POST') {
    const body = await parseJsonBody(req);
    const result = removeBlacklistWord(body.word);
    res.writeHead(result.ok ? 200 : 400);
    res.end(JSON.stringify(result));
  } else if (pathname === '/health' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
}

const server = http.createServer(handleRequest);
const PORT = process.env.SERVICE_PORT || 3000;

server.listen(PORT, () => {
  logger.log('INFO', 'SERVICE', 'Server started', `listening on port ${PORT}`);
});

// Handle SIGTERM for graceful shutdown
process.on('SIGTERM', () => {
  logger.log('INFO', 'SERVICE', 'Shutdown signal received', 'graceful shutdown');
  if (runningProcess) {
    stopScraperProcess();
  }
  server.close(() => {
    logger.log('INFO', 'SERVICE', 'Server closed', 'exiting');
    process.exit(0);
  });
});

module.exports = { startScraperProcess, stopScraperProcess, getScraperStatus, getLogsContent };
