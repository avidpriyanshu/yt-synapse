'use strict';

/**
 * Service Launcher for YouTube Vault
 *
 * Starts the HTTP service (server.js) as a persistent background process.
 * This launcher is called from plugin hooks or manually to ensure the service
 * is available before UI requests are made.
 *
 * Usage:
 *   node service-launcher.js [--detach]
 *
 * With --detach flag, launches in background and returns immediately.
 * Without --detach, runs in foreground (useful for testing/debugging).
 */

'use strict';

const { spawn, spawnSync } = require('child_process');
const http = require('http');
const path = require('path');
const logger = require('./utils/logger.js');

const SERVICE_PORT = process.env.SERVICE_PORT || 3000;
const SERVICE_TIMEOUT = 3000; // ms to wait for service startup

/**
 * Check if service is already running on the port
 */
function isServiceRunning() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${SERVICE_PORT}/health`, (res) => {
      resolve(res.statusCode === 200);
      res.on('data', () => {});
      res.on('end', () => {});
    });

    req.on('error', () => {
      resolve(false);
    });

    req.setTimeout(500);
  });
}

/**
 * Start the service in the background or foreground
 */
function startService(detach = false) {
  const serverPath = path.join(__dirname, 'server.js');

  if (detach) {
    // Background mode: spawn with detached flag
    const child = spawn('node', [serverPath], {
      detached: true,
      stdio: 'ignore',
      env: {
        ...process.env,
        SERVICE_PORT,
      },
    });

    child.unref(); // Allow parent to exit
    logger.log('INFO', 'LAUNCHER', 'Service spawned', `PID ${child.pid} (detached)`);
    return;
  }

  // Foreground mode: run directly (useful for systemd, pm2, etc.)
  const child = spawn('node', [serverPath], {
    stdio: 'inherit',
    env: {
      ...process.env,
      SERVICE_PORT,
    },
  });

  child.on('exit', (code) => {
    logger.log('WARN', 'LAUNCHER', 'Service exited', `code ${code}`);
    process.exit(code);
  });
}

/**
 * Wait for service to become available
 */
async function waitForService(maxWait = SERVICE_TIMEOUT) {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWait) {
    if (await isServiceRunning()) {
      return true;
    }
    await new Promise((r) => setTimeout(r, 100));
  }

  return false;
}

async function main() {
  const args = process.argv.slice(2);
  const detach = args.includes('--detach');

  logger.log('INFO', 'LAUNCHER', 'Service launcher started', `port ${SERVICE_PORT}`);

  // Check if service is already running
  const running = await isServiceRunning();

  if (running) {
    logger.log('INFO', 'LAUNCHER', 'Service already running', `on port ${SERVICE_PORT}`);
    process.exit(0);
  }

  // Start the service
  logger.log('INFO', 'LAUNCHER', 'Starting service', detach ? '(background)' : '(foreground)');
  startService(detach);

  // In detach mode, wait for service to be ready, then exit
  if (detach) {
    const ready = await waitForService();
    if (ready) {
      logger.log('INFO', 'LAUNCHER', 'Service ready', `listening on port ${SERVICE_PORT}`);
      process.exit(0);
    } else {
      logger.log('ERROR', 'LAUNCHER', 'Service startup timeout', `failed to start on port ${SERVICE_PORT}`);
      process.exit(1);
    }
  }
  // In foreground mode, startService() handles the entire process lifecycle
}

if (require.main === module) {
  main().catch((err) => {
    logger.log('ERROR', 'LAUNCHER', 'Startup failed', err.message);
    process.exit(1);
  });
}

module.exports = { startService, isServiceRunning, waitForService };
