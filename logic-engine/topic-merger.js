'use strict';

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const ReviewAgent = require('./reviewer.js');

/**
 * Topic Merger Utility
 * Handles bulk merging/renaming of topics across all video notes
 */

class TopicMerger {
  constructor(vaultDir = null) {
    this.vaultDir = vaultDir || path.join(__dirname, '..', 'vault');
    this.videosDir = path.join(this.vaultDir, 'videos');
    this.history = this.loadHistory();
  }

  loadHistory() {
    try {
      const historyPath = path.join(__dirname, '..', 'logic-engine', 'history.json');
      if (fs.existsSync(historyPath)) {
        return JSON.parse(fs.readFileSync(historyPath, 'utf-8'));
      }
    } catch (e) {
      console.error('[topic-merger] Failed to load history:', e.message);
    }
    return { videoIds: [] };
  }

  saveHistory() {
    try {
      const historyPath = path.join(__dirname, '..', 'logic-engine', 'history.json');
      fs.writeFileSync(historyPath, JSON.stringify(this.history, null, 2));
    } catch (e) {
      console.error('[topic-merger] Failed to save history:', e.message);
    }
  }

  /**
   * Merge one topic into another across all video notes
   * @param {string} oldTopic - Topic to replace
   * @param {string} newTopic - Replacement topic
   * @returns {Object} Result with count of videos merged
   */
  mergeTopic(oldTopic, newTopic) {
    if (!oldTopic || !newTopic) {
      return { success: false, error: 'Both oldTopic and newTopic required' };
    }

    const oldWikilink = `[[${oldTopic}]]`;
    const newWikilink = `[[${newTopic}]]`;
    let mergedCount = 0;
    let filesProcessed = 0;
    const errors = [];

    // Scan all video files in the vault
    try {
      if (!fs.existsSync(this.videosDir)) {
        return { success: false, error: `Videos directory not found: ${this.videosDir}` };
      }

      const files = fs.readdirSync(this.videosDir).filter(f => f.endsWith('.md'));

      for (const file of files) {
        const filePath = path.join(this.videosDir, file);
        filesProcessed++;

        try {
          let content = fs.readFileSync(filePath, 'utf-8');
          const original = content;

          // Replace in frontmatter and content
          content = content.replace(new RegExp(oldWikilink, 'g'), newWikilink);

          // Only write if changed
          if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf-8');
            mergedCount++;
            console.log(`  [merged] ${file}`);
          }
        } catch (e) {
          errors.push(`${file}: ${e.message}`);
        }
      }

      // Update history if tracking topics
      if (this.history.topics) {
        const oldTopicIndex = this.history.topics.indexOf(oldTopic);
        if (oldTopicIndex !== -1) {
          this.history.topics.splice(oldTopicIndex, 1);
        }
        if (!this.history.topics.includes(newTopic)) {
          this.history.topics.push(newTopic);
        }
        this.saveHistory();
      }

      return {
        success: true,
        oldTopic,
        newTopic,
        filesProcessed,
        mergedCount,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  /**
   * Get all unique topics currently in use
   * @returns {string[]} Array of unique topics
   */
  getAllTopics() {
    const topics = new Set();

    try {
      if (!fs.existsSync(this.videosDir)) return Array.from(topics);

      const files = fs.readdirSync(this.videosDir).filter(f => f.endsWith('.md'));

      for (const file of files) {
        const filePath = path.join(this.videosDir, file);
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const { data } = matter(content);
          if (Array.isArray(data.topics)) {
            data.topics.forEach(t => topics.add(t));
          }
        } catch (e) {
          // Skip files with parsing errors
        }
      }
    } catch (e) {
      console.error('[topic-merger] Error scanning topics:', e.message);
    }

    return Array.from(topics).sort();
  }

  /**
   * Find potential duplicate topics (similar spelling)
   * @returns {Array} Array of [topic1, topic2] pairs that might be duplicates
   */
  findDuplicates() {
    const topics = this.getAllTopics();
    const duplicates = [];
    const seen = new Set();

    for (let i = 0; i < topics.length; i++) {
      for (let j = i + 1; j < topics.length; j++) {
        const t1 = topics[i].toLowerCase();
        const t2 = topics[j].toLowerCase();

        // Check for singular/plural variations
        if (
          t1.endsWith('s') &&
          t1.slice(0, -1) === t2
        ) {
          const key = [topics[i], topics[j]].sort().join('|');
          if (!seen.has(key)) {
            duplicates.push([topics[i], topics[j]]);
            seen.add(key);
          }
        }

        // Check for similar prefix (e.g., "Jet Engine" vs "Jet Engines")
        if (
          t1.startsWith(t2.split(' ')[0]) &&
          Math.abs(t1.length - t2.length) <= 3
        ) {
          const key = [topics[i], topics[j]].sort().join('|');
          if (!seen.has(key)) {
            duplicates.push([topics[i], topics[j]]);
            seen.add(key);
          }
        }
      }
    }

    return duplicates;
  }
}

module.exports = TopicMerger;

// CLI support: node topic-merger.js --merge "old" "new"
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args[0] === '--merge' && args[1] && args[2]) {
    const merger = new TopicMerger();
    console.log(`Merging "${args[1]}" into "${args[2]}"...`);
    const result = merger.mergeTopic(args[1], args[2]);
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.success ? 0 : 1);
  } else if (args[0] === '--list') {
    const merger = new TopicMerger();
    console.log('Current topics in vault:');
    const topics = merger.getAllTopics();
    topics.forEach(t => console.log(`  - ${t}`));
  } else if (args[0] === '--find-duplicates') {
    const merger = new TopicMerger();
    console.log('Potential duplicate topics:');
    const dupes = merger.findDuplicates();
    if (dupes.length === 0) {
      console.log('  (none found)');
    } else {
      dupes.forEach(([t1, t2]) => {
        console.log(`  - "${t1}" vs "${t2}"`);
      });
    }
  } else {
    console.log(`
Topic Merger Utility

Usage:
  node topic-merger.js --merge "old topic" "new topic"  Merge old into new
  node topic-merger.js --list                           List all topics
  node topic-merger.js --find-duplicates                Find potential dupes
    `);
  }
}
