#!/usr/bin/env node
// Rename positionally-prefixed photos in grouped/<property>/ to the correct
// names listed in that folder's _ПОТРІБНО.txt.
//
// Each photo file is prefixed with a 2-digit display position:
//   01_<name>.ext            -> the real recovered photo for slot 1
//   RANDOM_NN_<hash>.ext     -> random filler placeholder for slot NN
//   WEB_NN_<hash>.ext        -> web-recovered real photo for slot NN
// The txt lists, per slot number, the exact final filename to use.
//
// Usage:
//   node scripts/rename-grouped.mjs           # dry run (default, prints plan)
//   node scripts/rename-grouped.mjs --apply   # actually rename

import { readdirSync, readFileSync, renameSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = join(PROJECT_ROOT, 'grouped');
const APPLY = process.argv.includes('--apply');

function parseTxt(txtPath) {
  // Lines look like:  "  1. 1781448750913-s4w8y6w8wkb.jpg"
  const map = new Map(); // position(number) -> correct name
  const text = readFileSync(txtPath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*(\d+)\.\s+(\S+)\s*$/);
    if (m) map.set(Number(m[1]), m[2]);
  }
  return map;
}

function positionOf(filename) {
  // strip optional RANDOM_ / WEB_ prefix, then capture leading NN_
  const stripped = filename.replace(/^(RANDOM_|WEB_)/, '');
  const m = stripped.match(/^(\d+)_/);
  return m ? { pos: Number(m[1]), kind: filename.startsWith('WEB_') ? 'WEB' : filename.startsWith('RANDOM_') ? 'RANDOM' : 'REAL' } : null;
}

let folders = readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

let totalPlanned = 0;
let issues = [];

for (const folder of folders) {
  const dir = join(ROOT, folder);
  const txtPath = join(dir, '_ПОТРІБНО.txt');
  if (!existsSync(txtPath)) {
    issues.push(`[${folder}] no _ПОТРІБНО.txt`);
    continue;
  }
  const want = parseTxt(txtPath);
  const files = readdirSync(dir).filter((f) => !/\.txt$/i.test(f) && f !== '_ПОТРІБНО.txt');

  // group files by position
  const byPos = new Map();
  for (const f of files) {
    const p = positionOf(f);
    if (!p) {
      issues.push(`[${folder}] cannot parse position: ${f}`);
      continue;
    }
    if (!byPos.has(p.pos)) byPos.set(p.pos, []);
    byPos.get(p.pos).push({ file: f, kind: p.kind });
  }

  const plan = []; // {from, to}
  for (const [pos, entries] of [...byPos.entries()].sort((a, b) => a[0] - b[0])) {
    const target = want.get(pos);
    if (!target) {
      issues.push(`[${folder}] position ${pos} has file(s) but no txt entry: ${entries.map((e) => e.file).join(', ')}`);
      continue;
    }
    if (entries.length > 1) {
      // collision: prefer WEB (real recovered) > REAL > RANDOM
      const rank = { WEB: 0, REAL: 1, RANDOM: 2 };
      entries.sort((a, b) => rank[a.kind] - rank[b.kind]);
      issues.push(
        `[${folder}] position ${pos} COLLISION -> keep ${entries[0].file} (${entries[0].kind}); ` +
          `others: ${entries.slice(1).map((e) => `${e.file} (${e.kind})`).join(', ')}`
      );
    }
    plan.push({ from: entries[0].file, to: target });
  }

  // missing positions
  for (const pos of want.keys()) {
    if (!byPos.has(pos)) issues.push(`[${folder}] MISSING file for position ${pos} (want ${want.get(pos)})`);
  }

  // target name collisions within folder
  const seenTargets = new Map();
  for (const { from, to } of plan) {
    if (seenTargets.has(to)) issues.push(`[${folder}] DUPLICATE target ${to} from ${from} and ${seenTargets.get(to)}`);
    seenTargets.set(to, from);
  }

  // print plan
  console.log(`\n=== ${folder} (${plan.length}/${want.size}) ===`);
  for (const { from, to } of plan) {
    const noop = from === to ? '  [already correct]' : '';
    console.log(`  ${from}  ->  ${to}${noop}`);
    if (from !== to) totalPlanned++;
    if (APPLY && from !== to) {
      const fromPath = join(dir, from);
      const toPath = join(dir, to);
      if (existsSync(toPath)) {
        issues.push(`[${folder}] target already exists, skipped: ${to}`);
      } else {
        renameSync(fromPath, toPath);
      }
    }
  }
}

console.log(`\n----------------------------------------`);
console.log(`${APPLY ? 'APPLIED' : 'DRY RUN'}: ${totalPlanned} files to rename across ${folders.length} folders`);
if (issues.length) {
  console.log(`\n!! ${issues.length} ISSUE(S) NEEDING ATTENTION:`);
  for (const i of issues) console.log(`  - ${i}`);
} else {
  console.log(`\nNo issues detected.`);
}
