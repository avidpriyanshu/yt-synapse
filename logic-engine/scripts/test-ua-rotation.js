#!/usr/bin/env node
'use strict';

const assert = require('assert');
const path = require('path');
const { pickUA, recordRequest, getMetrics, resetMetrics, UA_POOL } = require('../utils/user-agents.js');

console.log('🧪 User-Agent Rotation Test Suite\n');

// Test 1: UA pool has minimum entries
console.log('Test 1: UA pool size');
assert(UA_POOL.length >= 10, 'Pool should have >= 10 user-agents');
console.log(`  ✓ Pool has ${UA_POOL.length} user-agents`);

// Test 2: All entries are non-empty strings
console.log('\nTest 2: UA pool entries are valid');
for (let i = 0; i < UA_POOL.length; i++) {
  assert(typeof UA_POOL[i] === 'string', `Entry ${i} should be a string`);
  assert(UA_POOL[i].length > 20, `Entry ${i} should be a realistic UA (>20 chars)`);
  assert(UA_POOL[i].includes('Mozilla'), `Entry ${i} should look like a real browser UA`);
}
console.log(`  ✓ All ${UA_POOL.length} entries are valid UA strings`);

// Test 3: pickUA returns different values over time
console.log('\nTest 3: UA rotation produces variety');
const picks = new Set();
for (let i = 0; i < 100; i++) {
  picks.add(pickUA());
}
assert(picks.size > 5, 'Should pick at least 5 different UAs in 100 calls');
console.log(`  ✓ Picked ${picks.size} unique UAs out of 100 calls (variety: ${(picks.size / 100 * 100).toFixed(0)}%)`);

// Test 4: Metrics tracking works correctly
console.log('\nTest 4: Metrics recording');
resetMetrics();
recordRequest(200);
recordRequest(200);
recordRequest(429);
recordRequest(403);
recordRequest(200);

const metrics = getMetrics();
assert(metrics.total === 5, 'Should have 5 total requests');
assert(metrics.success === 3, 'Should have 3 successful (200) responses');
assert(metrics.rate429 === 1, 'Should have 1 429 response');
assert(metrics.rate403 === 1, 'Should have 1 403 response');
assert(metrics.successRate === '60.0%', 'Success rate should be 60%');
console.log(`  ✓ Metrics: ${metrics.total} total, ${metrics.success} success, ${metrics.rate429} x429, ${metrics.rate403} x403`);
console.log(`  ✓ Success rate: ${metrics.successRate}`);

// Test 5: Metrics reset works
console.log('\nTest 5: Metrics reset');
resetMetrics();
recordRequest(200);
const metricsAfterReset = getMetrics();
assert(metricsAfterReset.total === 1, 'Should have reset and only 1 request');
assert(metricsAfterReset.success === 1, 'Should have 1 success');
console.log(`  ✓ Metrics reset successfully`);

// Test 6: REGRESSION - ensure engine.js still loads correctly
console.log('\nTest 6: Regression - engine.js can load with UA changes');
try {
  const engine = require('../engine.js');
  assert(typeof engine.fetchWatchPageHtml === 'function', 'fetchWatchPageHtml should exist');
  assert(typeof engine.fetchChannelFeedVideoItems === 'function', 'fetchChannelFeedVideoItems should exist');
  assert(typeof engine.resolveChannelIdFromVideo === 'function', 'resolveChannelIdFromVideo should exist');
  assert(!engine.BROWSER_UA, 'BROWSER_UA should no longer be exported (should be undefined)');
  console.log(`  ✓ engine.js loads successfully with UA rotation`);
  console.log(`  ✓ All exported functions present`);
  console.log(`  ✓ BROWSER_UA correctly removed from exports`);
} catch (err) {
  console.error(`  ✗ Failed to load engine.js: ${err.message}`);
  process.exit(1);
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ All tests passed!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('Ready for integration testing with real clippings.\n');
