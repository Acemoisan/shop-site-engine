---
name: acemoisan-hub
description: Use when working on the acemoisan personal utility hub or its apps (the landing home, the /apps page, or the MacroFactor tracker) — adding/editing an app, extending MacroFactor, changing the design tokens, building/verifying, or deploying. This is Aidan's personal self-hosted-tools site (acemoisan.pages.dev), NOT a Studio0rbit client shop — it deliberately does not use @studio0rbit/shared, Storyblok, or the shop pipeline. Triggers on "the acemoisan site", "the hub", "MacroFactor", "the macro app", "add an app to my hub".
---

# acemoisan hub — iterate the personal utility site

`sites/acemoisan/` is a **standalone static Astro site** — Aidan's personal hub for
self-hosted day-to-day tools. Live at **https://acemoisan.pages.dev** (one
Cloudflare Pages project, Git-connected → **auto-deploys on push**). First app is
**MacroFactor**, a local-first macro tracker. It reuses this repo's token/Tailwind
idiom but is intentionally decoupled from the shop engine: **no `@studio0rbit/shared`,
no Storyblok/CMS, no LocalBusiness/PIPA.** Dark-only. All app data is client-side
`localStorage`.

> Goal of this skill: make these sites **fast and safe to iterate**. Most changes are
> a token tweak, a content edit in one `.ts` file, or a new app page — never a rebuild.

## File map
```
sites/acemoisan/
  astro.config.mjs        # site: https://acemoisan.pages.dev (drives canonical/OG/sitemap)
  DEPLOY.md               # Cloudflare Pages settings (read before touching deploy)
  src/
    theme.css             # OKLCH design tokens (dark-only) — the brand lives here
    styles/base.css       # Tailwind v4 @import + @theme mapping + @source globs
    content/profile.ts    # bio, socials, and the APP REGISTRY (add apps here)
    components/            # Nav (Apps button), Hero-less pages, AppCard, Footer, Icon, Head
    lib/
      macro-store.ts       # Ace-Macros data model + localStorage (key acemf:v1)
      budget-store.ts      # Ace-Budget data model + localStorage (key acebudget:v1)
      emoji.ts             # the icon pool (emoji) for food entries
      backup.ts            # hub-wide export/import + persistence (covers ALL apps)
    scripts/
      macrofactor.ts       # Ace-Macros controller (filename kept; product renamed)
      budget.ts            # Ace-Budget controller
    pages/
      index.astro          # landing home (+ live "today's macros" widget)
      apps/index.astro     # the Apps hub (renders the registry)
      apps/ace-macros.astro # Ace-Macros shell (imports scripts/macrofactor)
      apps/budget.astro    # Ace-Budget shell (imports scripts/budget)
      apps/[slug].astro    # plan/detail page for each PLANNED app (from registry.plan)

# Naming: the product "MacroFactor" was renamed to "Ace-Macros" (route
# /apps/ace-macros; old /apps/macrofactor redirects via astro.config redirects).
# Internal files (macrofactor.ts, macro-store.ts) and the storage key acemf:v1
# were intentionally NOT renamed — the key must stay stable so no data is lost.
```

## Build / preview / verify (do this for every change)
```sh
# build (the --config flag skips a pnpm deps-gate that errors on the monorepo root)
pnpm --filter acemoisan --config.verify-deps-before-run=false build

# preview locally on 4321 (localhost is NOT proxied, so it works)
pnpm --filter acemoisan --config.verify-deps-before-run=false preview --port 4321 --host
```
**Always screenshot-verify** — the build can pass while a page renders wrong.
Drive the LOCAL preview with the pre-installed Chromium via `puppeteer-core`
(resolve it by absolute path from a scratchpad script):
```js
import { createRequire } from "module";
const require = createRequire("/home/user/shop-site-engine/node_modules/");
const puppeteer = require("puppeteer-core");
const b = await puppeteer.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  headless: true, args: ["--no-sandbox","--disable-gpu","--hide-scrollbars"] });
// newPage → setViewport → goto http://127.0.0.1:4321/... → click [data-*] → screenshot
```
For MacroFactor, actually exercise it (open `[data-open="add"]`, click `[data-add-food]`,
`#qty-confirm`, etc.) and read back `localStorage.getItem("acemf:v1")` to confirm state.
Capture mobile (≈390w) + desktop (≈1440w). Google Fonts and `*.pages.dev` are blocked by
the CI egress proxy — screenshot the **local** preview; font fallback is fine for layout.

## Design system (dark-only)
- Brand + palette live entirely in `src/theme.css` as **OKLCH** custom properties;
  `base.css` maps them to Tailwind utilities via `@theme inline`. Components use
  **semantic utilities only** (`bg-card`, `text-muted-foreground`, `border-border`,
  `text-cal`), never hardcoded colors.
- **Tailwind v4 gotcha:** utilities used only inside `src/components` or `src/pages`
  are generated because `base.css` has `@source "../components"` and `@source "../pages"`.
  New source dir → add an `@source` or its classes silently vanish.
- The four macro-data hues (`--cal/--protein/--carbs/--fat`) are a **validated
  colorblind-safe categorical palette** (dataviz skill, checked against the `--card`
  surface). If you change them, re-run `scripts/validate_palette.js … --mode dark
  --surface "#1b2431"` and keep every check passing.

## Add a new app (≈5 min)
1. Append an entry to `profile.apps` in `src/content/profile.ts`:
   `{ slug, name, tagline, description, icon, href: "/apps/<slug>", status: "live"|"planned", accent, tags }`.
   The home + `/apps` grids render it automatically via `AppCard`. `icon` is an
   `Icon.astro` name (add the SVG path to `src/components/Icon.astro` if new).
2. For a `live` app, create `src/pages/apps/<slug>.astro`: import `base.css` + `theme.css`,
   add `Head` (SEO) + `Nav current="app" appName="…"`, build the UI, and put any client
   logic in `src/scripts/<slug>.ts` imported via `<script>import "../../scripts/<slug>";</script>`.
3. Keep each app self-contained (own script + own `localStorage` namespace) so it can be
   split into its own Pages project later without a rewrite.

## MacroFactor internals
- **Data model** in `src/lib/macro-store.ts`: `State { goals, catalogs, foods, log }`
  under one key `acemf:v1`. `Food` has `catalogId` + optional `icon`; `Entry`
  snapshots name/macros/serving/icon at log time (historical entries never
  retro-change). `log` is `{ "YYYY-MM-DD": Entry[] }` (LOCAL dates, never UTC).
- **Schema migrations are additive + backfilled in `loadState()`** — never bump
  `STORE_KEY` or wipe. Merge new fields with defaults and backfill for old data
  (see how `catalogs`/`catalogId`/`icon` were added). A real person already has data
  in the live app; losing it is unacceptable.
- **Controller** `src/scripts/macrofactor.ts`: one `state` object, `render*()`
  functions that rebuild sections from `state`, `commit()` = save, and a single
  delegated `click` handler keyed on `data-*` attributes. To add a feature: extend
  the store type (+ migration), add markup with a `data-*` hook in
  `macrofactor.astro`, render it, and handle the event in the delegated switch.
- **Visuals** are hand-rolled SVG (calorie ring, macro bars, calendar heatmap,
  monthly bar chart) — no chart lib. Colors come from the macro tokens.
- **Icons**: the food-icon pool is emoji in `src/lib/emoji.ts` (grouped + keyworded,
  `searchEmoji(q)`). Extend by adding `{ c, k }` entries; `ALL_EMOJI` de-dupes and
  drops any without keywords.

## Deploy
Connected to Cloudflare Pages via Git → **pushing to the production branch
auto-builds and deploys**. Do not hand-deploy from CI: this environment's egress
policy blocks `api.cloudflare.com` and `*.pages.dev` (wrangler can't reach them here).
Build settings (also in `sites/acemoisan/DEPLOY.md`):
- Build: `pnpm install --filter acemoisan... && pnpm --filter acemoisan build`
- Output: `sites/acemoisan/dist` · **`NODE_VERSION=22`** (pnpm 11.7 needs Node ≥22.13)
- The `--filter acemoisan...` install is required so the monorepo root's native dev
  deps aren't pulled in (they make `pnpm install` exit non-zero). Build-script
  decisions live in the root `pnpm-workspace.yaml` (`allowBuilds`); every build-script
  package must have an explicit `true`/`false` or install fails.

## Guardrails
- Dark-only by design (light mode kept failing the data-palette contrast floor).
- Reuse the token system; never hardcode colors or restyle per-page.
- Every change: build → screenshot-verify (mobile + desktop) → commit → push (auto-deploys).
- Don't add a backend/accounts casually — "local-first, on-device" is the current
  promise; cloud sync is a future milestone (keep stores swappable for it).
