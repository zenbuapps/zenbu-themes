---
name: zenbu-theme-author
description: Use when the user pastes or points to TSX/HTML/CSS that they want turned into a Zenbu Site theme, or asks to build / import / author a new theme. Triggers include "幫我匯入這個佈景主題", "做一個新主題", "把這個 landing page 變成 Zenbu 主題", "發 PR 給 zenbu-themes", "打包成私人主題 zip", "檢查我的主題符不符合 zenbu 規範" (validate-only mode). Also use when wiring the in-admin "匯入佈景主題" button or explaining theme architecture to anyone (human or AI).
---

# Zenbu Theme Author

## Overview

Zenbu Site themes are **AI-friendly by design**. Everything the admin editor and the Gemini AI need to know about a theme is declared in two registries — no hardcoded prompt strings, no drift. If you add a new field / new CSS var / new block / new theme, the admin UI and AI auto-discover it next turn.

**Core principle:** Register, don't hardcode. Two registries are the contract:

| Registry | Source of truth | Scope |
|----------|----------------|-------|
| `BLOCK_REGISTRY` | `packages/shared-types/src/blocks.ts` | per-block **instance** fields (what the editor shows per block) |
| `THEME_MANIFESTS` | `packages/shared-types/src/themes.ts` | theme-wide **CSS variables** (colors, typography, anim intensity) |

Both are consumed by:
- `apps/web/components/admin/pages/entity-editors/*` — admin editor UIs
- `apps/api-gateway/src/ai-gemini/gemini.service.ts` — injects schemas into Gemini system prompt per request

## When to Use

Invoke this skill when the user:
- Pastes TSX / HTML / CSS and says "turn this into a theme" / "匯入這個主題"
- Asks how to build a new Zenbu theme from scratch
- Asks why AI can't modify some aspect of a theme (usually = missing from registry)
- Wants to add a new block type, new CSS var, or new theme option
- Is building the in-admin "匯入佈景主題" button and needs the conversion spec

## Mental model — three layers of a theme

```
┌─ BACKEND (API) ─────────────────────────────────────────────┐
│  apps/api-gateway/src/themes/themes.service.ts              │
│  • ThemeRecord: { id, name, description, samplePages[] }    │
│  • samplePages seed the DB via POST /v1/admin/themes/apply  │
└──────────────────────────────────────────────────────────────┘
┌─ FRONTEND COMPONENTS ───────────────────────────────────────┐
│  apps/web/components/themes/{id}/                           │
│    index.tsx         — exports ThemeModule {                │
│                         meta, Chrome, SectionRenderer,      │
│                         samplePages                         │
│                       }                                      │
│    {id}-theme.css    — scoped under `.{id}-root` class      │
│    sample-pages/     — JSON seeds used by backend           │
│  apps/web/components/themes/registry.ts                     │
│    — bundles all ThemeModules                               │
└──────────────────────────────────────────────────────────────┘
┌─ AI / ADMIN CONTRACTS (shared-types) ───────────────────────┐
│  packages/shared-types/src/blocks.ts                        │
│    — BLOCK_REGISTRY: per-block entityFields + translationFields │
│  packages/shared-types/src/themes.ts                        │
│    — THEME_MANIFESTS[id]: cssVars with label/type/affects   │
└──────────────────────────────────────────────────────────────┘
```

**Golden rule:** every user-tunable knob must appear in exactly one of the two registries. Knobs outside the registry → admin editor can't show them + AI can't touch them.

## Conversion workflow — TSX/HTML paste → Zenbu theme

When the user pastes raw theme code, follow this sequence. Don't skip steps; each one feeds the next.

### 1. Identify semantic sections
Scan the pasted code and group elements into **block archetypes**. Zenbu already has these standard types (see `BLOCK_REGISTRY` for the full list):

```
hero, stats, products, integration-flow, why, testimonials, pricing,
rich-text, featured-articles, featured-portfolio, about-summary,
hero-carousel, categories-circles, product-showcase, gift-cta,
brand-story, contact-info, contact-form,
practice, cases, portrait, appointment   (lawyer-specific)
```

- If a pasted section matches an existing archetype → reuse the block type, only add a new SectionRenderer branch in the theme's `index.tsx`.
- If it's genuinely new → add a new `BlockType` in `packages/shared-types/src/blocks.ts` + a `BlockTypeDef` entry in `BLOCK_REGISTRY`. Ask the user whether to also extend `types.ts`' `BlockType` union in `apps/web/components/themes/types.ts` (legacy union, may be deduped later).

### 2. Extract all CSS variables into THEME_MANIFESTS

Convert the pasted CSS `:root { --foo: ... }` blocks into:

```ts
// packages/shared-types/src/themes.ts
THEME_MANIFESTS['your-theme-id'] = {
  id: 'your-theme-id',
  label: '你的主題名稱',
  rootClassName: 'your-theme-id-root',
  description: '一句話描述這個主題的設計感',
  cssVars: [
    {
      key: '--accent',
      label: '強調色',
      type: 'color-hex',
      default: '#XXXXXX',
      pairedWith: '--accent-glow',        // if there's an RGB-triplet sibling
      affects: ['CTA 按鈕', 'Hero 漸層'], // plain-Chinese, NOT CSS selectors
      hint: '跟 --accent-glow 同時改'     // optional
    },
    // ...
  ],
  semantics: {
    accent: ['--accent', '--accent-glow'],
    background: '--bg',
    foreground: '--fg',
  },
};
```

**Critical details:**

- **hex + rgb-triplet pairs**: if the theme uses `rgba(var(--accent-glow), 0.5)` anywhere, you MUST define the triplet var (e.g. `--accent-glow: 255, 94, 43`) as a separate entry with `type: 'color-rgb-triplet'` and cross-link via `pairedWith` on BOTH sides. AI will then update them together.
- **`affects` is for humans / AI rationales**: use plain Chinese (「CTA 按鈕」、「Hero 粒子光暈」), not CSS selectors. This is what AI reads to (a) pick the right var and (b) explain what it did.
- **`type`** drives the admin picker widget. `color-hex` → color input; `color-rgb-triplet` → number triplet; `length` → text; `number` → number; `string` → text.

### 3. Scope all CSS under `.{id}-root`

Every rule in the pasted CSS must be rewritten to live under the theme's root class. This is what lets page-level overrides (`[data-page-root] .signature-root { ... }`) win against the theme's own defaults.

```css
/* ❌ BAD — unscoped, bleeds out of theme */
.btn { ... }
:root { --accent: red; }

/* ✅ GOOD — everything scoped */
.mytheme-root { --accent: red; }
.mytheme-root .btn { ... }
.mytheme-root h1 { ... }
```

### 4. Create the ThemeModule

```tsx
// apps/web/components/themes/{id}/index.tsx
import type { ThemeModule, PageBlock } from '../types';
import './mytheme-theme.css';

function Chrome({ children, navItems, chromeOverrides }: ThemeChromeProps) {
  return (
    <div className="mytheme-root">
      {!chromeOverrides?.hideNav && <header>…nav…</header>}
      <main>{children}</main>
      {!chromeOverrides?.hideFooter && <footer>…</footer>}
    </div>
  );
}

function SectionRenderer({ block, content }: { block: PageBlock; content?: Record<string, unknown> }) {
  switch (block.type) {
    case 'hero':
      return <Hero block={block} content={content} />;
    // ...
    default:
      return null;
  }
}

const theme: ThemeModule = {
  meta: { id: 'mytheme', name: '我的主題', description: '…' },
  Chrome,
  SectionRenderer,
  samplePages: [ /* see step 5 */ ],
};
export default theme;
```

Then register in `apps/web/components/themes/registry.ts`.

### 5. Read editable fields from `block` + `content` props, with fallbacks

Every block component MUST accept the editable props and fall back to hard-coded defaults:

```tsx
function Hero({ block, content }: HeroProps) {
  // entity fields come from `block.*`
  const ctaPrimaryHref = (block?.ctaPrimaryHref as string | undefined) ?? '#';
  const accentColor = block?.accentColor as string | undefined;
  const entryAnimation = (block?.entryAnimation as string | undefined) ?? 'reveal';

  // translation fields come from `content[key]` with plain-language fallbacks
  const headline = pick(content, ['headline_line_1'], 'Default headline');

  // Per-block CSS-var overrides via inline style
  const sectionStyle: React.CSSProperties & Record<string, string> = {};
  if (accentColor) {
    sectionStyle['--accent'] = accentColor;
    sectionStyle['--accent-glow'] = hexToRgbTriplet(accentColor) ?? '';
  }

  return <section style={sectionStyle}>…{headline}…</section>;
}
```

**Never hardcode text or colors that should be user-editable.** Every hardcoded value = a knob the user / AI can't reach.

### 6. Write a seed sample page + translations

Add to the theme's `samplePages` in both:
- `apps/web/components/themes/{id}/sample-pages/{slug}.json` (frontend reference)
- `apps/api-gateway/src/themes/themes.service.ts` `ThemeRecord.samplePages[]` — **with `translations.zh-TW.blocksContent`** so the DB gets seeded with matching content when the theme is applied.

Without seeded translations, the admin editor fields appear empty even though the frontend shows default text.

```ts
// themes.service.ts
{
  slug: 'home',
  title: '首頁',
  blocks: [
    { id: 'mytheme-home-hero', type: 'hero', ctaPrimaryHref: '#pricing' },
  ],
  translations: {
    'zh-TW': {
      seoTitle: '…',
      seoDescription: '…',
      blocksContent: {
        'mytheme-home-hero': {
          headline_line_1: '一套系統，',
          subheadline: '…',
          cta_primary_label: '開始免費試用',
          // …
        },
      },
    },
  },
}
```

### 7. Apply + verify

After code + seeds are in place:

1. Rebuild shared-types (`cd packages/shared-types && npm run build`) so the web + api both see new registry entries.
2. Restart the api-gateway tmux session if needed (it usually auto-reloads).
3. Call the apply API:
   ```bash
   curl -s -b cookies.txt -H 'Origin: http://localhost:6060' \
     -X POST http://localhost:6001/v1/admin/themes/apply \
     -H 'Content-Type: application/json' \
     -d '{"themeId":"mytheme","importPages":[{"slug":"home","onConflict":"overwrite"}]}'
   ```
4. Open `/admin/pages/home/edit` — every editable field should show its seeded value.
5. Open the public page (`/` or `/zh-TW`) — fallback defaults should match DB values.
6. Test AI: open the AI compose panel, ask it to change the accent color. It should emit `updatePageStyle` with the **correct var names from the manifest**, no longer "--color-accent" guesses.

## Quick reference — field type → admin widget

| `BlockFieldDef.type` | Rendered as | Use for |
|----------------------|-------------|---------|
| `input` | text `<input>` | one-line text |
| `textarea` | multi-line `<textarea>` | body copy |
| `image` | text input (media-picker planned) | image URL |
| `url` | text input | internal/external link |
| `number` | text input | numeric value |
| `boolean` | text input (checkbox planned) | toggle |
| `color` | swatches + native picker + hex | **instance** color override (e.g. Hero accent) |
| `select` | `<select>` with `options` | discrete preset (e.g. entry animation) |

For `color` add `presets: [{ value: '#FF5E2B', label: '科技橘' }, ...]`.
For `select` add `options: [{ value: 'blur', label: '模糊淡入' }, ...]`.

## Mandatory checklist for any new theme

Before declaring a theme "done", verify:

- [ ] All CSS rules are scoped under `.{id}-root` (no unscoped selectors, no `:root` overrides that leak)
- [ ] `THEME_MANIFESTS[id]` lists **every** user-tunable CSS var, with `affects` in plain Chinese
- [ ] All hex/rgb-triplet pairs are cross-linked via `pairedWith` on both entries
- [ ] Block components accept `block` + `content` props; no hardcoded editable text/colors
- [ ] `samplePages` includes `translations.zh-TW.blocksContent` for every block
- [ ] Per-block CSS-var overrides (accentColor, etc.) applied via inline `style={{ '--accent': ... }}`
- [ ] Any JS that reads CSS vars uses `getComputedStyle(elementInsideTheme)`, NOT `getComputedStyle(document.documentElement)` — otherwise section/page overrides don't cascade in
- [ ] Frontend page wrapper has `<div data-page-root>` around the theme root so page-level overrides target the right scope
- [ ] `registry.ts` imports + registers the new theme
- [ ] Backend `themes.service.ts` has a matching `ThemeRecord`
- [ ] Running `curl POST /v1/admin/themes/apply` seeds real content that matches the frontend

## Common mistakes

| Mistake | Symptom | Fix |
|---------|---------|-----|
| Reading CSS vars from `document.documentElement` | Per-page / per-section overrides invisible to canvas-drawn effects | Read from the canvas / element itself (`getComputedStyle(canvas)`) |
| Unscoped CSS or `:root` defaults | Admin page-overrides (injected as `[data-page-root]`) can't win; theme's own value reasserts | Scope everything under `.{id}-root`; page-override selector chain already targets both |
| Hex var without matching RGB triplet | rgba(var(--glow), 0.5) can't do opacity math → blank | Always define both, cross-link via `pairedWith` |
| Hardcoded text in component | User can "edit" in admin but frontend doesn't update | Read from `content[key]` with fallback |
| Block registry updated but no DB seed | Fields appear in admin but empty | Add `translations.zh-TW.blocksContent` to `samplePages` + re-apply theme |
| `affects` written as CSS selectors | AI produces cryptic rationales ("修改 .hero-title") | Rewrite `affects` as plain Chinese (「主標題漸層」) |
| Running `npm run build` only in one location | Worktree still sees old types → mysterious TS errors | Rebuild in each `packages/shared-types` (main + .worktrees/*) |

## Real-world import playbook — lessons from converting single-file HTML landings

These patterns emerged from converting a self-contained Babel-standalone React landing (`Paper 風格.zip` → `paper-style` theme). They apply whenever the user pastes a **single-HTML-file** prototype (common output from ChatGPT/Claude/Figma Make/Bolt).

### Things a single-file HTML landing usually brings that you MUST strip

| Source smell | Why it breaks Zenbu | What to do |
|-------------|--------------------|------------|
| `<script src="unpkg.com/react">` + `<script src="babel">` | Re-runs React in the browser, conflicts with Next.js | Throw away — extract component logic into `.tsx`, ship via Next.js bundler |
| `body::before { ... }` / `html, body { background: ... }` | Paints outside the theme scope; leaks into admin | Move to `.themeId-root::before` + set `position: absolute` (not fixed) and give `.themeId-root` `position: relative; overflow-x: hidden` |
| Global `* { box-sizing }` reset | Clobbers admin UI if user toggles themes | Scope the reset to `.themeId-root, .themeId-root *` |
| `document.documentElement.style.setProperty('--x', y)` | Writes vars on `<html>`, bypassing theme scope | Move to block entity fields + inline `style={{ '--x': y }}` on the rendered section |
| Hardcoded hex in inline `style={{ background: '#111' }}` | User can't re-theme; AI can't modify | Replace inline hex with `var(--ps-ink)` etc, register the var in ThemeManifest |
| `@import url(fonts.googleapis.com)` at CSS top | Fine to keep if consistent — but only inside the scoped CSS file, not global | Leave in theme CSS; just verify it sits above the `.themeId-root` selectors |
| Custom UI chrome (command palettes, dev-only tweaks panels) | Dev-mode toys, not a theme | Drop them — they're not user-editable |
| Typewriter animations / setState during render | Hard to express as declarative content | Decide: keep as client-only effect (wrap block renderer with `'use client'`), or drop for v1 |

### Class prefixing convention

Every class the theme ships gets a 2-3 letter theme-specific prefix to avoid Tailwind / admin / other-theme collisions. Paper uses `ps-` (**P**aper **S**tyle): `.ps-hero`, `.ps-btn-primary`, `.ps-foot-col`…

Pick a prefix that:
- is short (typed often in CSS)
- won't collide with other themes (signature uses `sig-`, plumlight uses no prefix but uses nested `.plumlight-root .nav` descendant selectors — both are fine; pick one pattern per theme).

### Fold-in order: write CSS first, then TSX

Temptation: port TSX first because it maps to React mental model. Avoid — you'll end up with JSX full of inline hex that you'll then struggle to re-theme.

Better order:
1. Scoped CSS file (vars + classes) — tune until the theme looks right with placeholder markup
2. TSX block components reference only the classes/vars — no inline colors
3. `block` / `content` props replace every hardcoded string in TSX

This keeps "style editable by user" and "content editable by user" cleanly separated.

### When to create a new block type vs reuse an existing one

Reuse when the semantics match even if the visual is different. From the Paper import:
- "Journal" (latest blog posts grid) → reused `featured-articles` (same semantics: a list of posts). Visual is different but that's theme concern.
- "Newsletter dark band" → reused `cta` (call-to-action band).
- "Editor showcase" → merged into `about-summary` (left-copy + right-visual pattern).

Create new block type when structure is genuinely different:
- "Pull quote" with attribution + role → new `quote` block (no existing type captures `{body, attribution, role}`)
- "FAQ accordion" with 6 Q/A pairs → new `faq` block (not `text`, because we want per-question editing)

**Decision rule:** if you'd need `content[key]` with >3 unique field names that don't exist anywhere else, make a new block type.

### ThemeManifest writing tips (from experience, not theory)

1. **`affects` should be 3-5 items max per var**, in plain Chinese. Longer lists read as AI noise. "Hero 粒子光暈、按鈕 hover 光暈、主標題漸層" is good; "所有會用到強調色的地方" is bad.
2. Include **a `hint` on any var where default value is non-intuitive** — e.g. `--ps-texture-opacity` default `0.55` needs a hint explaining the 0–1 range and semantic meaning.
3. When the theme has **NO rgb-triplet paired var**, don't force-create one. Paper Style only uses the accent hex, so no `--ps-accent-glow` needed.
4. Font vars (`--ps-font-serif` etc) use `type: 'string'` and should be listed — AI is often asked "make it more classical" which = swap serif. Having the var registered lets AI actually modify fonts.
5. Put **semantically meaningful vars first**, decorative vars last. AI and users scan top-down.

### Sample-page seed rules

1. **Every block in the sample page MUST have a corresponding key in `translations.zh-TW.blocksContent`**. Empty keys = empty admin editor fields (user then thinks it's broken).
2. **Content should tell a coherent mini-story** — don't lorem-ipsum. The seed content is literally the marketing copy the user will see when they apply the theme; make it so good that a user could ship it as-is with a name change.
3. For blocks with numbered slots (FAQ's `q1..q6`, Journal's `article0_meta..article2_excerpt`), seed **at least 3 of them** — enough to demonstrate the pattern but leave room for users to delete/add.

### Common single-file HTML oddities to watch

- **`body::before` with `position: fixed`**: won't work inside `.themeId-root` — change to `position: absolute` so it's confined to the theme scope.
- **Typewriter effect that writes to `h1`**: if you drop the `useEffect` typewriter, make sure the static version of the headline has visible content (not empty string + cursor).
- **`onMouseEnter` inline style toggles**: convert to CSS `:hover` rules — works without JS, survives SSR.
- **Command palette / tweaks panel** accessed via `⌘K`: discard; Zenbu has its own admin for those jobs.

### Verification routine (memorize)

After applying the theme:

```bash
# Active theme should now be yours
curl -s -b cookies.txt -H 'Origin: http://localhost:6060' \
  http://localhost:6001/v1/admin/themes | jq '.activeTheme'

# Home blocks should match your seed
curl -s -b cookies.txt -H 'Origin: http://localhost:6060' \
  http://localhost:6001/v1/admin/pages/home | jq '.blocks[].type'

# zh-TW translations blocksContent should be populated
curl -s -b cookies.txt -H 'Origin: http://localhost:6060' \
  http://localhost:6001/v1/admin/pages/home \
  | jq '.translations[] | select(.locale=="zh-TW") | .blocksContent | keys'
```

Then visit the public home page (`/zh-TW`) — every fallback default you wrote in the `.tsx` should be replaced by the DB seed. If a section looks "blank", the seed for that block is missing.

## Output flow — PR or private zip

After finishing the 7-step conversion, ask the user which flow they want:

### Public (PR to `zenbu-themes`)

The goal is to land the theme in the community marketplace so other Zenbu sites can install it.

1. `git clone` (or `gh repo fork` + clone) `github.com/<org>/zenbu-themes` into a tmp dir.
2. Create `themes/{id}/` with the produced files (`manifest.json`, `index.tsx`, `theme.css`, `sample-pages/*.json`, `cover.png`; optional `preview.png`, block-component `.tsx` splits for `'use client'` work).
3. Run local `npm run validate` — the zenbu-themes repo ships this script mirroring the PR-CI checks (JSON Schema on `manifest.json`, tsc on theme TSX, CSS scope under `.{rootClassName}`, cover.png dimensions < 500KB). Must pass before PR.
4. Create a branch → commit → push → `gh pr create` with a PR description containing:
   - The source hint ("Paper-style landing from Claude Design export").
   - Any new block types the skill had to register (e.g. "adds new block types: quote, faq"). Flag these so reviewers know shared-types needs a synced update.
   - Note that Playwright screenshots will be attached by CI automatically.
5. Tell the user the PR URL. Explain that CI + team merge is the next step.

### Private (zip upload)

Used when the user wants this theme private to their own Zenbu site.

1. zip the produced `themes/{id}/` folder → `/{tmp}/{themeId}.zip`.
2. Tell the user: "zip 檔在 `/path/{themeId}.zip`. 打開你的 Zenbu 後台 → 主題模板 → 匯入 → 私人（zip），上傳這個檔案。"
3. Done. No GitHub token, no network calls, no PR.

### Validate-only (no output)

If the user says "check my theme meets zenbu specs" / "validate only":

1. Assume the theme folder is already on disk at a path the user specifies.
2. Run the same checks `zenbu-themes/scripts/validate.ts` does (schema, tsc, CSS scope, cover image).
3. Report pass/fail with specific errors. Do NOT open a PR or produce a zip.

## `addBlock` authoring note (for the Gemini AI, not the skill)

This skill is used for theme *authoring*. At runtime, a DIFFERENT AI (Gemini) edits pages and can add blocks via the `addBlock` tool. For that flow to work, every theme MUST declare its `supportedBlockTypes: string[]` field on its `ThemeModule`:

```ts
const myTheme: ThemeModule = {
  meta: ..., Chrome: ..., SectionRenderer: ..., samplePages: ...,
  supportedBlockTypes: ['hero', 'about-summary', 'quote', 'faq', 'cta'],
};
```

The list must match the cases handled by the theme's `SectionRenderer`. The backend also maintains a parallel map in `apps/api-gateway/src/themes/themes.service.ts` `SUPPORTED_BLOCK_TYPES` — if you add a new block type to your theme, update both.

When AI adds a block, it uses `BLOCK_REGISTRY[type].example.block` for entity defaults and `.example.content` as seeded translation content. Your block's entry in `BLOCK_REGISTRY` (in `packages/shared-types/src/blocks.ts`) should therefore have a complete `example` — it becomes the block's "factory defaults" whenever AI instantiates it.

## SectionRenderer MUST wrap blocks in `<BlockRevealWrapper>`

This is a checklist item, not optional. Without it, the universal `entryAnimation` / `animationDuration` entity fields are ignored and admin users can't animate blocks in your theme.

Pattern:

```tsx
import { BlockRevealWrapper } from '../shared/BlockRevealWrapper';
import '../shared/reveal-animations.css';

function renderInner(block, content) {
  switch (block.type) { ... }
}

function SectionRenderer({ block, content }: { block: PageBlock; content?: Record<string, unknown> }) {
  const inner = renderInner(block, content);
  if (!inner) return null;
  return <BlockRevealWrapper block={block}>{inner}</BlockRevealWrapper>;
}
```

Do NOT implement your own reveal logic inside individual block components. The wrapper handles it uniformly. If a specific block needs extra *internal* animations (like Signature's inline `.reveal` class on heading elements), those are separate from the block-level entry animation and can coexist.

## In-admin "匯入佈景主題" (implemented as of Phase C)

The admin `/admin/themes` page now has three tabs:
- **我的主題** — already-installed themes (private + public that have been installed).
- **公開模板庫** — fetches `zenbu-themes` `index.json` via cached `/v1/admin/themes/marketplace`, 6h TTL, with ETag. User clicks "安裝" on any card → backend fetches the tarball, validates, writes `apps/web/components/themes/{id}/`, regenerates `installed.generated.ts`, touches api-gateway main.ts for auto-restart, revalidates Next.
- **匯入** — two sub-tabs: "公開 (PR)" shows copy-pasteable Claude Code prompt + this skill's install command; "私人 (zip)" is a form for uploading the zip produced by the private-output flow above.

The admin page is a pure consumer of the skill's output — it doesn't run any AI itself. All conversion work happens in the user's local Claude Code via this skill.

## Key file paths (memorize these)

- Block registry: `packages/shared-types/src/blocks.ts`
- Theme manifests: `packages/shared-types/src/themes.ts`
- Theme types: `packages/shared-types/src/theme-manifest.ts`
- Frontend theme folder: `apps/web/components/themes/{id}/`
- Frontend theme registry: `apps/web/components/themes/registry.ts`
- Page style override injector: `apps/web/components/themes/shared/PageStyleOverrides.tsx`
- Admin per-block editors: `apps/web/components/admin/pages/entity-editors/`
- Backend theme records: `apps/api-gateway/src/themes/themes.service.ts`
- AI prompt composition: `apps/api-gateway/src/ai-gemini/gemini.service.ts` (loads BLOCK_REGISTRY + THEME_MANIFESTS; do NOT hardcode var names here)

## When you must edit the Gemini prompt directly

Almost never. If you're tempted to edit `gemini.service.ts` to add "the AI should know about X", stop and ask: can X be expressed as a registry entry instead? 99% of the time yes.

Exceptions (legitimate prompt edits):
- Adding a whole new tool (e.g. a new function declaration)
- Changing the rationale format / style rules
- Adding safety / scope constraints

Everything else = registry work.
