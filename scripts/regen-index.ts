#!/usr/bin/env tsx
/**
 * Rebuild `index.json` from every themes/{id}/manifest.json. Ran by CI on
 * every merge to main, but also runnable locally:
 *   npm run regen-index
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const REPO_ROOT = join(__dirname, '..');
const THEMES_DIR = join(REPO_ROOT, 'themes');
const INDEX_PATH = join(REPO_ROOT, 'index.json');
const RAW_BASE = process.env.RAW_BASE
  ?? 'https://raw.githubusercontent.com/zenbu/zenbu-themes/main';
const API_BASE = process.env.API_BASE
  ?? 'https://api.github.com/repos/zenbu/zenbu-themes';

interface IndexEntry {
  id: string;
  name: string;
  description?: string;
  author?: { name?: string; github?: string };
  license?: string;
  tags?: string[];
  coverImage?: string;
  previewImage?: string;
  manifestUrl: string;
  tarballUrl: string;
}

function main() {
  const dirs = readdirSync(THEMES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const themes: IndexEntry[] = [];
  for (const id of dirs) {
    const manifestPath = join(THEMES_DIR, id, 'manifest.json');
    if (!existsSync(manifestPath)) {
      console.warn(`Skip ${id}: no manifest.json`);
      continue;
    }
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    themes.push({
      id: manifest.id,
      name: manifest.name,
      description: manifest.description,
      author: manifest.author,
      license: manifest.license,
      tags: manifest.tags,
      coverImage: `${RAW_BASE}/themes/${id}/cover.png`,
      previewImage: manifest.previewImage
        ? `${RAW_BASE}/themes/${id}/preview.png`
        : undefined,
      manifestUrl: `${RAW_BASE}/themes/${id}/manifest.json`,
      // Per-theme tarball via GitHub's repo tarball endpoint + archive path.
      // Installer auto-strips parent folders looking for manifest.json, so
      // any github tarball shape works.
      tarballUrl: `${API_BASE}/tarball/main`,
    });
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    themes,
  };
  writeFileSync(INDEX_PATH, JSON.stringify(payload, null, 2) + '\n');
  console.log(`Wrote index.json with ${themes.length} theme(s).`);
}

main();
