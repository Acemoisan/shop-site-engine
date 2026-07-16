# acemoisan hub — personal utility site

*Live: https://acemoisan.pages.dev · Source: `sites/acemoisan/` · Skill: `.claude/skills/acemoisan-hub`*

A personal project built on the same engine tooling as the Studio0rbit shop sites,
but deliberately separate from the shop business: **Aidan's own hub for self-hosted
day-to-day tools.** Live apps: **Ace-Macros** (macro/nutrition) and **Ace-Budget**
(money), both local-first. This doc is the record of what exists and how it was built;
the **`acemoisan-hub` skill** is the operational runbook for changing it.

## What it is
- **`/`** — landing home: intro + socials (mirrored from acemoisan.github.io), and a
  live on-device dashboard panel (clock + today's macro snapshot read from the same
  `localStorage` the app writes).
- **`/apps`** — the Apps hub. An **"Apps" button in the header** opens it. Renders an
  app registry (`src/content/profile.ts`); apps are `live` or `planned`.
- **`/apps/ace-macros`** — the Ace-Macros tracker (a MacroFactor-style clone; the old
  `/apps/macrofactor` URL redirects here).
- **`/apps/budget`** — Ace-Budget (see below).
- **Planned apps** (Homebase, Habit Grid, Command Deck) each open a **plan/detail page**
  at `/apps/<slug>` (dynamic `[slug].astro`, content in the registry's `plan` field) —
  cards are clickable "View plan", not dead links.

It's **one Cloudflare Pages project**, Git-connected, so **every push to the
production branch auto-builds and deploys**. Standalone static Astro — no
`@studio0rbit/shared`, no Storyblok, no backend. Dark-only. All data is client-side.

## Ace-Budget (v1)
A calendar-driven budget tracker (`src/lib/budget-store.ts`, `budget.astro`,
`scripts/budget.ts`; key `acebudget:v1`): add/edit income & expense **entries per day**
on a month **calendar** (days tinted by net +/−), a **month summary** (income / expense /
net + optional monthly-budget bar), a **category breakdown** of the month's spend, custom
categories + currency in Settings, and a one-tap **Backup** (shares the hub's backup —
`backup.ts` exports every localStorage key, so Ace-Budget data is in the same file).
Future v2: mirror the user's existing spreadsheet (formulas/notes) once shared via Drive.

## Ace-Macros (v1 + catalogs/icons)
Mimics MacroFactor's basics (renamed from "MacroFactor" → "Ace-Macros"; route
`/apps/ace-macros`, internal files still `macrofactor.ts` / `macro-store.ts`, storage key
`acemf:v1` unchanged so no data is lost):
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
- **Data durability** — a **Data & backup** panel exports *all* hub data to a JSON
  file and restores it on any device/browser, with a "last backup / back up now"
  nudge (fires when overdue or never), and a best-effort `navigator.storage.persist()`
  request. This is the safety net for a local-first app until cloud sync lands
  (`src/lib/backup.ts`).

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

## Data safety (important)
On-device localStorage is **not** a durability guarantee — the browser can clear it
(clearing site data, iOS's 7‑day unused-site rule, storage-pressure eviction), and
it's per-browser/per-device. Our code never scrubs it (only read/write under a stable
key, additive migrations), but the browser can. Mitigations shipped: the **Data &
backup** export/import + persistence request + overdue-backup nudge. The full "never
lost, synced everywhere" answer is cloud sync (below). Tell users to keep a backup.

## Household utilities — options being explored (not built yet)
Surfaced as the **Homebase** "coming soon" app. The recurring constraint: a static
page **can't safely hold device secrets** (anything in client JS is public), and an
HTTPS page can't call an HTTP LAN device (mixed content). So most *control* paths need
either same-WiFi local access or a **tiny proxy that holds the token** (a Cloudflare
Worker — the same small-backend pattern as the email idea). Simple → involved:

- **Home Assistant (recommended for a self-hoster).** Self-hosted hub (Pi/mini-PC/
  Docker) that speaks to nearly everything (Zigbee/Z-Wave/WiFi/Hue/Alexa). Exposes a
  REST + WebSocket API with long-lived tokens. Expose it via **Cloudflare Tunnel** and
  the hub can read state / toggle devices (token in a Worker secret). One integration
  point for *everything*, incl. Alexa. Best fit for the "self-host my tools" goal.
  Lightest start: just **link/embed the HA dashboard** (already a great mobile UI).
- **No-code webhook glue** (IFTTT / Make / **Voice Monkey**). Hub button → Worker →
  webhook → "turn on lights" or **Alexa announces** something. Broadest reach, least
  code; Voice Monkey is the easy way to make Alexa *say* things (e.g. a macro nudge).
- **Single-vendor cloud API** for an MVP: **LIFX** (Bearer-token HTTP API) or **Hue**
  (local bridge token, or cloud OAuth). One button toggles one light via a Worker proxy.
- **Read-only first** (lowest risk): show home state (temp, which lights are on, energy)
  as a dashboard widget by reading HA's API — no control, no risk.

On **Alexa specifically**: you don't call Alexa from a webpage — it's a voice front-end.
The simple paths are *through* Home Assistant, or **Voice Monkey / routine webhooks** to
trigger routines / announcements. A full custom Alexa Skill (AWS Lambda + cert) is heavy —
not "simple." Likely first step for Homebase: stand up Home Assistant, expose via
Cloudflare Tunnel, and add read-only widgets → then a couple of control buttons via a Worker.

## Roadmap
- More apps (Habit Grid, Command Deck are stubbed in the registry).
- Ace-Macros: barcode/nutrition-label entry, weight-trend widget.
- Ace-Budget v2: mirror the user's existing spreadsheet (exact formulas + notes) once
  shared via Google Drive; recurring entries, per-category budgets, CSV import/export.
- **Reminders / alerts — deferred by choice** (2026‑07‑16). Web push was judged too
  heavy (needs a PWA install + service worker + a Worker cron sender; iOS requires
  Home‑Screen install). When wanted, the recommended *easy* path is **calendar `.ics`
  export** from the hub (no backend, no install: user opens the file once and their
  phone's calendar fires native reminders). **Email reminders** (Cloudflare Worker on
  a cron + Resend) are the richer option but need a small backend + one‑time setup.
  For now the user uses their phone's own calendar/reminders app.
- **Cloud sync** (Cloudflare D1 + auth) as the "self-hosting my data" milestone —
  kept swappable behind the store module so the localStorage app doesn't need a rewrite.
