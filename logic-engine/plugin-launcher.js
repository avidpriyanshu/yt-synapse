/**
 * YouTube Vault Auto-Start Plugin
 *
 * This module is loaded by Obsidian plugin hooks to handle auto-start
 * of the scraper on vault open. It reads the config and makes a non-blocking
 * HTTP request to the service backend.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const logger = require('./logger.js');

class YouTubeVaultAutoStartPlugin {
  constructor() {
    this.configPath = path.join(__dirname, 'config.json');
    this.autoStartEnabled = false;
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
   * Called when vault opens. Start scraper if auto-start enabled.
   * Non-blocking: uses HTTP request to backend server.
   */
  onVaultOpen() {
    if (!this.autoStartEnabled) {
      return;
    }

    logger.log('INFO', 'SERVICE', 'Auto-start triggered', 'vault open');
    this.startScraperRemote();
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
}
