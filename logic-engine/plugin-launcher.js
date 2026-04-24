/**
 * YouTube Vault Auto-Start Plugin
 *
 * This module is loaded by Obsidian plugin hooks to handle auto-start
 * of the scraper on vault open. It reads the config and makes a non-blocking
 * HTTP request to the service backend. It will also ensure the service
 * backend (server.js) is started if it's not already running.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const { execFile } = require('child_process');
const logger = require('./logger.js');

class YouTubeVaultAutoStartPlugin {
  constructor() {
    this.configPath = path.join(__dirname, 'config.json');
    this.autoStartEnabled = false;
    this.serviceStarted = false;
    this.loadConfig();
  }

  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        this.autoStartEnabled = config.autoStartScraper === true;
        logger.log('INFO', 'SERVICE', 'Loaded auto-start config', `enabled: ${this.autoStartEnabled}`);
      }
    } catch (err) {
      logger.log('WARN', 'SERVICE', 'Failed to load config', err.message);
      this.autoStartEnabled = false;
    }
  }

  /**
   * Check if service is already running
   */
  isServiceRunning() {
    return new Promise((resolve) => {
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/health',
        method: 'GET',
        timeout: 500,
      };

      const req = http.request(options, (res) => {
        resolve(res.statusCode === 200);
        res.on('data', () => {});
        res.on('end', () => {});
      });

      req.on('error', () => {
        resolve(false);
      });

      req.setTimeout(500);
      req.end();
    });
  }

  /**
   * Ensure service backend is running
   */
  ensureService() {
    if (this.serviceStarted) {
      return Promise.resolve();
    }

    return this.isServiceRunning().then((running) => {
      if (running) {
        logger.log('INFO', 'SERVICE', 'Service already running', 'no action needed');
        this.serviceStarted = true;
        return;
      }

      // Service not running — try to start it
      logger.log('INFO', 'SERVICE', 'Service not running', 'attempting to start');
      return this.startServiceBackend();
    });
  }

  /**
   * Start service backend using service-launcher.js
   */
  startServiceBackend() {
    return new Promise((resolve) => {
      const launcherPath = path.join(__dirname, 'service-launcher.js');

      execFile('node', [launcherPath, '--detach'], (error, stdout, stderr) => {
        if (error) {
          logger.log('WARN', 'SERVICE', 'Failed to start service', error.message);
          resolve(); // Don't fail — just warn
          return;
        }

        logger.log('INFO', 'SERVICE', 'Service started successfully', 'via launcher');
        this.serviceStarted = true;
        resolve();
      });
    });
  }

  /**
   * Called when vault opens. Start scraper if auto-start enabled.
   * Non-blocking: uses HTTP request to backend server.
   */
  onVaultOpen() {
    // First ensure the service is running
    this.ensureService().then(() => {
      if (!this.autoStartEnabled) {
        return;
      }

      logger.log('INFO', 'SERVICE', 'Auto-start triggered', 'vault open');
      this.startScraperRemote();
    });
  }

  /**
   * Send start request to service backend (non-blocking)
   */
  startScraperRemote() {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/start',
      method: 'POST',
      timeout: 2000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.status === 'started' || result.status === 'already-running') {
            logger.log('INFO', 'SERVICE', 'Auto-start successful', `PID: ${result.pid}`);
          } else {
            logger.log('WARN', 'SERVICE', 'Auto-start failed', result.message || 'unknown error');
          }
        } catch (e) {
          logger.log('WARN', 'SERVICE', 'Failed to parse response', e.message);
        }
      });
    });

    req.on('error', (err) => {
      logger.log('WARN', 'SERVICE', 'Service connection failed', err.message);
    });

    req.on('timeout', () => {
      logger.log('WARN', 'SERVICE', 'Service request timeout', 'check if server is running');
      req.destroy();
    });

    // Non-blocking: don't wait for response
    req.write('');
    req.end();
  }
}

// Export for plugin loader
module.exports = YouTubeVaultAutoStartPlugin;

// If running standalone (for testing), create instance
if (require.main === module) {
  const plugin = new YouTubeVaultAutoStartPlugin();
  console.log('Auto-start plugin loaded');
  console.log('Auto-start enabled:', plugin.autoStartEnabled);
  console.log('Testing service availability...');
  plugin.ensureService().then(() => {
    console.log('Service check complete');
  });
}
