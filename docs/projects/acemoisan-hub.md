# acemoisan hub — personal utility site

*Live: https://acemoisan.pages.dev · Source: `sites/acemoisan/` · Skill: `.claude/skills/acemoisan-hub`*

A personal project built on the same engine tooling as the Studio0rbit shop sites,
but deliberately separate from the shop business: **Aidan's own hub for self-hosted
day-to-day tools.** The first app is **MacroFactor**, a local-first macro/nutrition
tracker. This doc is the record of what exists and how it was built; the
**`acemoisan-hub` skill** is the operational runbook for changing it.

## What it is
- **`/`** — landing home: intro + socials (mirrored from acemoisan.github.io), and a
  live on-device dashboard panel (clock + today's macro snapshot read from the same
  `localStorage` the app writes).
- **`/apps`** — the Apps hub. An **"Apps" button in the header** opens it. Renders an
  app registry (`src/content/profile.ts`); apps are marked `live` or `planned`.
- **`/apps/macrofactor`** — the MacroFactor clone.

It's **one Cloudflare Pages project**, Git-connected, so **every push to the
production branch auto-builds and deploys**. Standalone static Astro — no
`@studio0rbit/shared`, no Storyblok, no backend. Dark-only. All data is client-side.

## MacroFactor (v1 + catalogs/icons)
Mimics MacroFactor's basics:
- **Food catalogue** with a starter set + user-created custom foods, organised into
  **named catalogs** (Basics, My Foods, and any you add). Filter by catalog chips,
  create/rename/delete catalogs, and **move a food between catalogs** from its editor.
- **Optional emoji icon per food**, chosen from a large searchable pool
  (`src/lib/emoji.ts`) — shown in the catalog list, quick-add chips, the timeline, and
  the qty dialog.
- **Timeline food log** per day with quick-add of recent foods.
- **Daily totals vs goals** — calorie ring + protein/carbs/fat bars with remaining.
- **Live month calendar** (heatmap by calorie %) to jump between days.
- **Monthly progress** — daily-calories bar chart with goal + average lines, and
  avg/day, days-logged, avg-protein stats.
- **Goal editor** (calories + P/C/F). Everything persists in `localStorage`
  (`acemf:v1`); no account, works offline.

Architecture: data model in `src/lib/macro-store.ts` (schema + safe, additive
migrations), controller in `src/scripts/macrofactor.ts` (plain DOM, delegated
events, hand-rolled SVG visuals — no chart lib). See the skill for internals.

## Design
Clean-modern, dark-only, with a subtle dev/arcade accent and an azure brand primary
derived from acemoisan.github.io's `#149ddd`. Tokens live in `src/theme.css` (OKLCH),
mapped to Tailwind in `src/styles/base.css`. The four macro-data colors are a
**colorblind-safe categorical palette** validated with the `dataviz` skill against the
card surface — don't change them without re-validating.

## Build story (context)
Built and shipped in a single session **entirely from mobile.** Notable bumps, all
resolved and captured so they don't recur:
- **Reference sites blocked.** The CI egress proxy blocks `*.pages.dev` (and
  `api.cloudflare.com`), so the `maw`/`alcurio` style references couldn't be viewed and
  a headless `wrangler` deploy was impossible from the container. → Deployed via
  **Cloudflare Pages Git-connect** (build runs on Cloudflare's side).
- **Deploy build failures**, both now fixed in-repo:
  - Node 20 was too old for the repo's pinned `pnpm@11.7.0` (needs Node ≥22.13) →
    `NODE_VERSION=22`.
  - `pnpm-workspace.yaml` had unfinished `allowBuilds` placeholder values, so
    `pnpm install` exited non-zero → set explicit `true`/`false`.

## Deploy
See `sites/acemoisan/DEPLOY.md`. Summary: Cloudflare Pages, project `acemoisan`,
build `pnpm install --filter acemoisan... && pnpm --filter acemoisan build`, output
`sites/acemoisan/dist`, `NODE_VERSION=22`. Pushing the production branch redeploys.

## Roadmap
- More apps (Habit Grid, Command Deck are stubbed in the registry).
- MacroFactor: barcode/nutrition-label entry, weight-trend widget, export/import.
- **Cloud sync** (Cloudflare D1 + auth) as the "self-hosting my data" milestone —
  kept swappable behind the store module so the localStorage app doesn't need a rewrite.
