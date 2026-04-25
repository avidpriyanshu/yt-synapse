'use strict';

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', 'config', 'config.json');

function readDelayConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
    const cfg = JSON.parse(raw);
    return {
      min: typeof cfg.requestDelayMinMs === 'number' ? cfg.requestDelayMinMs : 1500,
      max: typeof cfg.requestDelayMaxMs === 'number' ? cfg.requestDelayMaxMs : 4000,
    };
  } catch {
    return { min: 1500, max: 4000 };
  }
}

function randomDelay(minMs, maxMs) {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function requestDelay() {
  const { min, max } = readDelayConfig();
  await randomDelay(min, max);
}

module.exports = { randomDelay, requestDelay, readDelayConfig };
