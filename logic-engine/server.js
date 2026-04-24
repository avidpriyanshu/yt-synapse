'use strict';

const http = require('http');
const { execFile } = require('child_process');
const path = require('path');
const logger = require('./logger.js');

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
        logger.log('ERROR', 'SERVICE', 'Scraper process error', error.message);
      }
      runningProcess = null;
      runningProcessPid = null;
    });

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
 * HTTP Request handler
 */
function handleRequest(req, res) {
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
