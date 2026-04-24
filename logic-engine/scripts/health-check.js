'use strict';

/**
 * Scan vault markdown for [[wikilinks]] and report targets with no matching .md file.
 */

const fs = require('fs');
const path = require('path');

const vaultRoot =
  process.env.VAULT_ROOT ||
  path.resolve(__dirname, '..', '..', 'obsidian-vault');

const LINK_RE = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;

/** Ignore Obsidian YAML frontmatter when scanning for wikilinks */
function stripFrontmatter(content) {
  if (!content.startsWith('---\n') && !content.startsWith('---\r\n')) {
    return content;
  }
  const rest = content.slice(4);
  const end = rest.search(/\r?\n---\r?\n/);
  if (end === -1) return content;
  return rest.slice(end).replace(/^\r?\n---\r?\n/, '');
}

function walkMarkdownFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === '.obsidian') continue;
      walkMarkdownFiles(full, acc);
    } else if (e.isFile() && e.name.endsWith('.md')) {
      acc.push(full);
    }
  }
  return acc;
}

function normalizeTarget(name) {
  return name.trim();
}

function resolveWikiPath(target) {
  const base = target.endsWith('.md') ? target : `${target}.md`;
  /** Obsidian resolves by path or basename — try basename under vault */
  const candidates = [
    path.join(vaultRoot, base),
    path.join(vaultRoot, 'videos', base),
    path.join(vaultRoot, 'topics', base),
    path.join(vaultRoot, 'clippings', base),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  /** basename only */
  const bn = path.basename(base);
  const topicsPath = path.join(vaultRoot, 'topics', bn);
  const videosPath = path.join(vaultRoot, 'videos', bn);
  if (fs.existsSync(topicsPath)) return topicsPath;
  if (fs.existsSync(videosPath)) return videosPath;
  return null;
}

function main() {
  const files = walkMarkdownFiles(vaultRoot);
  const broken = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    const content = stripFrontmatter(raw);
    let m;
    LINK_RE.lastIndex = 0;
    while ((m = LINK_RE.exec(content)) !== null) {
      const target = normalizeTarget(m[1]);
      if (!target || target.startsWith('#')) continue;
      const resolved = resolveWikiPath(target);
      if (!resolved) {
        broken.push({
          from: path.relative(vaultRoot, file),
          link: target,
        });
      }
    }
  }

  if (broken.length === 0) {
    console.log('[health-check] No broken wikilink targets found.');
    process.exit(0);
  }

  console.log('[health-check] Broken or unresolved wikilinks:');
  for (const b of broken) {
    console.log(`  ${b.from} -> [[${b.link}]]`);
  }
  process.exit(1);
}

main();
