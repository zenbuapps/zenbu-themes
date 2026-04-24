# Before pushing `zenbu-themes` to GitHub

This directory was staged by the `zenbu-theme-author` workflow. Before you `gh repo create && git push`, please handle:

## 1. Cover images (blocker — validator requires cover.png)

Three themes need real cover images:
- `themes/signature/cover.png`
- `themes/lawyer/cover.png`
- `themes/plumlight/cover.png`

Spec: 1600×900 PNG, < 500KB. Good options:
- Screenshot the theme's home page rendered at 1600 wide, trim to 900.
- Or an abstract brand card with theme name.

Current files are empty placeholders (0 bytes). `npm run validate` will flag them.

## 2. CSS scope sanity-check (signature)

`themes/signature/theme.css` was copied from `apps/web/app/signature.css` in the main Zenbu repo — that file was GLOBAL-scoped (served via Next.js globals), not scoped under `.signature-root`. You'll likely see many unscoped-selector errors from `npm run validate`. Two options:

A. Manually rewrite every top-level selector to prefix with `.signature-root`. (Most reliable.)
B. Wrap the entire file in a `.signature-root { … }` CSS-nesting block if your PostCSS pipeline supports native nesting.

Lawyer and Plumlight were already scoped correctly, so they should pass.

## 3. Install script URL

`install-skill.sh` hardcodes `https://raw.githubusercontent.com/zenbu/zenbu-themes/main/skill/SKILL.md`. If your repo ends up at a different owner (e.g. `yourname/zenbu-themes`), update the URL in `install-skill.sh` AND the Zenbu admin's ImportTab copy-paste command before pushing.

Files that reference the repo URL:
- `install-skill.sh` — `SOURCE_URL`
- `scripts/regen-index.ts` — `RAW_BASE`, `API_BASE`
- `.github/workflows/validate-pr.yml` — uploads artifacts by name
- `README.md`, `CONTRIBUTING.md` — documentation URLs
- `zenbu-site/apps/web/app/(admin)/admin/themes/ImportTab.tsx` — the curl command shown to users

## 4. First validate pass

```bash
cd /Users/luke/zenbu-themes-seed
npm install
npm run validate
```

Expected output: all three themes report problems on first run because `cover.png` files are empty (fix #1), and signature likely fails CSS scope (fix #2). Once both fixed, you should see all three green.

## 5. Create repo + push

```bash
cd /Users/luke/zenbu-themes-seed
gh repo create zenbu/zenbu-themes --public --source . --description "Community theme marketplace for Zenbu Site"
git add .
git commit -m "chore: bootstrap zenbu-themes marketplace"
git push -u origin main
```

If you use a different owner, replace `zenbu/zenbu-themes` accordingly.

## 6. After first push — update Zenbu admin's expected URL

The backend marketplace service uses env `THEMES_INDEX_URL` (defaults to `https://raw.githubusercontent.com/zenbu/zenbu-themes/main/index.json`). If your repo slug is different, set `THEMES_INDEX_URL` in `apps/api-gateway/.env` accordingly.

Also update `ImportTab.tsx` copy-paste install command if the repo slug differs:
```ts
const installCmd = 'curl -o- https://raw.githubusercontent.com/<YOUR_OWNER>/zenbu-themes/main/install-skill.sh | bash';
```

## 7. After push — remove bundled themes from main Zenbu repo (D3)

Once `zenbu-themes` is live and you've verified one marketplace install works end-to-end:
```bash
cd /Users/luke/zenbu-site/.worktrees/theme-platform
rm -rf apps/web/components/themes/{signature,lawyer,plumlight}
# Regenerate installed.generated.ts to only include themes still bundled (i.e. just default):
# Edit apps/web/components/themes/installed.generated.ts manually to empty the INSTALLED_THEMES map.
```

Then re-install signature/lawyer/plumlight via the admin's "公開模板庫" tab so they come from zenbu-themes marketplace instead of being hand-bundled.

Delete this checklist file before pushing (or keep it under `/docs` — your call).
