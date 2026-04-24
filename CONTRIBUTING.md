# Contributing a theme

Welcome. This doc assumes you already have a landing page / theme design and want to get it into the Zenbu marketplace.

## TL;DR

1. Install the `zenbu-theme-author` skill (command in README).
2. In Claude Code: `/zenbu-theme-author` + paste your source files.
3. Skill produces `themes/{your-id}/` and opens a PR here.
4. CI runs automated validation + Playwright preview screenshot.
5. A maintainer reviews the `affects` labels (important — they drive AI UX) and merges.
6. `index.json` regenerates automatically; your theme shows up in every Zenbu admin's marketplace within 6 hours (or instantly after a manual refresh).

## Theme folder requirements

Every `themes/{id}/` must contain:

- `manifest.json` — schema in `schema/manifest.schema.json`. Key fields:
  - `schemaVersion: 1`
  - `id` — must match the folder name; lowercase letters, digits, hyphens, starts with a letter.
  - `name`, `description`, `author: { name, github? }`, `license`, `compatibility: { zenbuSite: ">=0.5.0" }`
  - `rootClassName` — ends with `-root`, matches a class in your CSS
  - `cssVars` — every user-tunable CSS variable, with `label` (zh-TW) + `type` + `default` + `affects` (plain Chinese bullet list)
  - `blockTypesUsed` — list of block types your `SectionRenderer` handles (e.g. `["hero", "about-summary", "quote", "faq"]`)
  - `samplePages` — at minimum a home page seed
- `index.tsx` — exports the `ThemeModule` (Chrome + SectionRenderer + samplePages + supportedBlockTypes).
- `theme.css` — every selector scoped under `.{rootClassName}`. No leaks to global scope.
- `cover.png` — 1600x900, under 500KB.
- `sample-pages/home.json` — a working page seed for users to start from.
- Optional: `preview.png` (full-page screenshot, 1200×2400 ish), block-component splits (e.g. `Hero.tsx` for client-only blocks).

## CI checks (also runnable locally via `npm run validate`)

Every PR must pass:
1. `manifest.json` matches `schema/manifest.schema.json`.
2. `index.tsx` type-checks against `@zenbu-site/theme-types` (a small type-only package).
3. Every CSS selector is under `.{rootClassName}` (PostCSS rule).
4. `cover.png` is 1600x900 and under 500KB.
5. Playwright renders `sample-pages/home.json` in an isolated harness and attaches the screenshot to the PR comment for human review.

## Human review focus

Automated checks don't catch everything. A maintainer will spot-check:
- **`affects` labels** — must be plain Chinese describing what part of the UI the var changes ("CTA 按鈕", "Hero 粒子光暈"). AI reads these to narrate changes back to users, so literal / CSS-selector labels hurt UX.
- **Paired vars** — if your theme uses `rgba(var(--x-glow), 0.5)` pattern, the hex `--x-accent` and RGB-triplet `--x-glow` must be cross-linked via `pairedWith` so AI updates them together.
- **Sample page copy** — the seed should be good marketing copy that a user could ship with minor edits. Not lorem ipsum.
- **Block type naming** — if you invented a new block type (e.g. `comparison-table`), flag it in the PR description — shared-types registry needs a paired update.

## What not to do

- Don't push to `main` directly.
- Don't edit another theme's folder in the same PR (split into separate PRs).
- Don't ship external font CDN imports that you haven't licensed (`fonts.googleapis.com` is OK).
- Don't include `node_modules`, build artifacts, or `.DS_Store`.
- Don't register a new block type without updating the `zenbu-site` shared-types registry in a coordinated PR.

## Private themes

If your theme is meant to stay inside one Zenbu site only, don't PR here. Instead:
1. Let the `zenbu-theme-author` skill pack it as a zip.
2. Upload the zip via your Zenbu admin → 主題模板 → 匯入 → 私人（zip）.
