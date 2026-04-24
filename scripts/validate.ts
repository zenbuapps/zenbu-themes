#!/usr/bin/env tsx
/**
 * Local validator — mirrors the PR CI checks. Run from repo root:
 *   npm run validate           (validates every theme)
 *   npm run validate -- {id}   (validates one theme)
 */
import Ajv from 'ajv';
import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const schema = require('../schema/manifest.schema.json');

const REPO_ROOT = join(__dirname, '..');
const THEMES_DIR = join(REPO_ROOT, 'themes');

const ajv = new Ajv();
const validateManifest = ajv.compile(schema);

interface Problem {
  themeId: string;
  message: string;
}

async function validateTheme(themeId: string): Promise<Problem[]> {
  const dir = join(THEMES_DIR, themeId);
  const problems: Problem[] = [];
  const push = (msg: string) => problems.push({ themeId, message: msg });

  if (!existsSync(dir)) {
    push(`Directory not found: themes/${themeId}/`);
    return problems;
  }

  // manifest.json
  const manifestPath = join(dir, 'manifest.json');
  if (!existsSync(manifestPath)) {
    push('manifest.json missing');
    return problems;
  }
  let manifest: Record<string, unknown>;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  } catch (e) {
    push(`manifest.json not valid JSON: ${(e as Error).message}`);
    return problems;
  }
  if (manifest.id !== themeId) {
    push(`manifest.id ("${manifest.id}") does not match folder name ("${themeId}")`);
  }
  if (!validateManifest(manifest)) {
    for (const err of validateManifest.errors ?? []) {
      push(`manifest.json schema: ${err.instancePath || '/'} ${err.message}`);
    }
  }

  // required siblings
  for (const req of ['index.tsx', 'theme.css']) {
    if (!existsSync(join(dir, req))) push(`${req} missing`);
  }

  // cover.png size check (warn-only if <500KB)
  const coverPath = join(dir, 'cover.png');
  if (existsSync(coverPath)) {
    const size = statSync(coverPath).size;
    if (size > 1_000_000) push(`cover.png exceeds 1MB (${size} bytes)`);
  } else {
    push('cover.png missing (1600x900 PNG required)');
  }

  // CSS scope check
  const cssPath = join(dir, 'theme.css');
  if (existsSync(cssPath)) {
    const rootClass = (manifest.rootClassName as string | undefined) ?? '';
    if (rootClass) {
      const css = readFileSync(cssPath, 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '');
      const rules = css.match(/[^{}]+\{/g) ?? [];
      let unscoped = 0;
      const samples: string[] = [];
      for (const rule of rules) {
        const sel = rule.replace(/\{$/, '').trim();
        if (!sel || sel.startsWith('@')) continue;
        // Allow keyframe stops: "from", "to", "50%", or comma-separated like "0%, 100%".
        const isKeyframeStop = sel
          .split(',')
          .every((part) => /^(\d+(?:\.\d+)?%|from|to)$/.test(part.trim()));
        if (isKeyframeStop) continue;
        if (!sel.includes(`.${rootClass}`)) {
          unscoped += 1;
          if (samples.length < 3) samples.push(sel.slice(0, 60));
        }
      }
      if (unscoped > 0) {
        push(`theme.css has ${unscoped} unscoped selector(s). Examples: ${samples.join(' | ')}`);
      }
    }
  }

  return problems;
}

async function main() {
  const argv = process.argv.slice(2);
  const targets = argv.length > 0
    ? argv
    : readdirSync(THEMES_DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

  if (targets.length === 0) {
    console.log('No themes to validate.');
    process.exit(0);
  }

  let fail = 0;
  for (const id of targets) {
    const problems = await validateTheme(id);
    if (problems.length === 0) {
      console.log(`OK   themes/${id}`);
    } else {
      fail += 1;
      console.log(`FAIL themes/${id}`);
      for (const p of problems) console.log(`       ${p.message}`);
    }
  }
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
