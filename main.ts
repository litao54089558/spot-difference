// Spot the Difference — the hand-in program (Node 22, standard library only).
//
// The repository holds the game as plain static files under game/ and three
// screenshots under screenshots/. This program hands them in: it copies both
// folders beside this file into the output directory (/output in the grader,
// MAKEFUN_OUTPUT_DIR anywhere else) and writes /output/dossier.json, the
// summary the judge reads, built by the vendored make.fun library from
// exactly the files it copied. Run it twice and the bytes match.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

// The repository root: the directory this file lives in.
const repoRoot = dirname(fileURLToPath(import.meta.url));

// The grader's output directory, or the local stand-in.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The caps the scorer grades against. Only text_max_bytes shapes the
// dossier's bytes; the rest make this program fail here exactly where the
// scorer would refuse the entry, instead of handing in a broken one.
const dossierCaps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

function removeIfPresent(path) {
  if (existsSync(path)) rmSync(path, { recursive: true, force: true });
}

function copyTree(name) {
  const source = join(repoRoot, name);
  const target = join(outputDir, name);
  if (!existsSync(source)) {
    throw new Error(`missing ${name}/ beside main.ts: expected ${source}`);
  }
  cpSync(source, target, { recursive: true });
  return target;
}

function totalBytes(path) {
  let bytes = 0;
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else bytes += statSync(full).size;
    }
  };
  walk(path);
  return bytes;
}

// Start from a clean output directory so a stale file from an earlier run
// can never ride along with the entry.
mkdirSync(outputDir, { recursive: true });
removeIfPresent(join(outputDir, 'game'));
removeIfPresent(join(outputDir, 'screenshots'));
removeIfPresent(join(outputDir, 'dossier.json'));

const gameDir = copyTree('game');
const shotsDir = copyTree('screenshots');

const dossier = buildDossier(outputDir, dossierCaps);
writeFileSync(join(outputDir, 'dossier.json'), dossier);

console.log(`spot-difference: game/ ${totalBytes(gameDir)} bytes, screenshots/ ${totalBytes(shotsDir)} bytes`);
console.log(`spot-difference: dossier.json ${Buffer.byteLength(dossier)} bytes written to ${outputDir}`);
