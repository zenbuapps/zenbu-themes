# zenbu-themes

Community theme marketplace for [Zenbu Site](https://github.com/zenbu/zenbu-site). Every theme in this repo can be browsed and installed from any Zenbu admin panel via the "主題模板 → 公開模板庫" tab.

## Using a theme

1. Open your Zenbu admin → **主題模板** → **公開模板庫**.
2. Pick a theme and click **安裝**.
3. Backend fetches the tarball, validates, writes the files, and restarts. The theme appears in **我的主題**.

## Contributing a theme

Don't edit this repo by hand — use the `zenbu-theme-author` skill in Claude Code. It:
- Converts your HTML / TSX / CSS into the required format (manifest, scoped CSS, block registration).
- Runs local validation matching the PR CI.
- Opens the PR for you.

Install the skill:

```bash
curl -o- https://raw.githubusercontent.com/zenbuapps/zenbu-themes/main/install-skill.sh | bash
```

Then in Claude Code:

```
/zenbu-theme-author
我有一個 landing page 想變成 Zenbu 主題，檔案在這裡：
<path/to/your/files>
```

See `CONTRIBUTING.md` for the full authoring workflow.

## Repo layout

```
zenbu-themes/
├── themes/                 — one folder per theme
│   └── {theme-id}/
│       ├── manifest.json
│       ├── index.tsx       — ThemeModule entry
│       ├── theme.css       — scoped under .{theme-id}-root
│       ├── cover.png       — 1600x900, < 500KB
│       ├── preview.png     — (optional) full-page screenshot
│       └── sample-pages/
│           └── home.json
├── blocks/                 — v2 placeholder for block marketplace
├── schema/
│   └── manifest.schema.json
├── scripts/
│   ├── validate.ts         — mirrors PR CI; run locally before pushing
│   └── regen-index.ts      — rebuilds index.json from manifests
├── index.json              — auto-generated after merge; consumed by Zenbu backend
└── .github/workflows/
    ├── validate-pr.yml     — schema + tsc + CSS scope + screenshot
    └── regenerate-index.yml
```

`index.json` is the single document the Zenbu backend fetches to list themes. It's regenerated automatically by CI on every merge to `main`.

## License

Each theme declares its own license in its `manifest.json`. This repo's scaffolding (schema, scripts, workflows) is MIT licensed.
