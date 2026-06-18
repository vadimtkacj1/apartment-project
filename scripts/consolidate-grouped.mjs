#!/usr/bin/env node
// Collect every correctly-named photo (the names listed in each folder's
// _ПОТРІБНО.txt) from grouped/<property>/ into one flat folder ready for
// upload to the server's /uploads/properties/.
//
// Only the txt-listed names are copied, so leftover RANDOM_ fillers that lost
// a slot collision are NOT included.

import { readdirSync, readFileSync, copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = join(PROJECT_ROOT, 'grouped');
const DEST = join(PROJECT_ROOT, 'upload-ready');

mkdirSync(DEST, { recursive: true });

function wantedNames(txtPath) {
  const out = [];
  for (const line of readFileSync(txtPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*(\d+)\.\s+(\S+)\s*$/);
    if (m) out.push(m[2]);
  }
  return out;
}

const folders = readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

let copied = 0;
const issues = [];
const seen = new Map(); // name -> source folder

for (const folder of folders) {
  const dir = join(ROOT, folder);
  const txt = join(dir, '_ПОТРІБНО.txt');
  if (!existsSync(txt)) continue;
  for (const name of wantedNames(txt)) {
    const src = join(dir, name);
    if (!existsSync(src)) {
      issues.push(`[${folder}] missing expected file: ${name}`);
      continue;
    }
    if (seen.has(name)) {
      issues.push(`DUPLICATE name across folders: ${name} (in ${seen.get(name)} and ${folder})`);
      continue;
    }
    seen.set(name, folder);
    copyFileSync(src, join(DEST, name));
    copied++;
  }
}

console.log(`Copied ${copied} files into ${DEST}`);
if (issues.length) {
  console.log(`\n!! ${issues.length} issue(s):`);
  for (const i of issues) console.log(`  - ${i}`);
} else {
  console.log('No issues.');
}
