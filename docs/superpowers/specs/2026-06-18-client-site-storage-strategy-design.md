# Client-Site Storage Strategy — Design

**Date:** 2026-06-18
**Status:** Approved direction (C), pending spec review
**Author:** agent + operator (Aidan)

## Problem

All shop sites currently live in one pnpm monorepo (`shop-site-engine`): 2 real
clients, ~7 demos, 5 salon prospects, and 60 `tmpl-*` templates, all as
`sites/<slug>` sharing `packages/shared`. Three things break as this grows toward
20+ clients:

1. **Monorepo clutter** — engine, throwaway demos, the 60-template gallery, and
   paid deliverables are jumbled in one flat `sites/` directory.
2. **Client isolation** — paid clients aren't cleanly separated; nothing enforces
   "work on one can't leak into another," and there's no per-client owner/lifecycle.
3. **Dev↔launch reconciliation** — the `deploy-shop-site` skill already mandates a
   standalone per-client repo at launch (site + a copy of `packages/shared`), but
   that copy is hand-made, undocumented in provenance, and can drift from the
   monorepo it came from.

**Goal:** a storage model that scales to 20+ clients which stay *organized,
isolated, and re-openable for paid changes later* — without losing the shared dev
environment and tooling that makes each build fast.

## Forcing constraint (why the answer isn't a pure monorepo)

The auto-rebuild promise — client clicks **Publish** in Storyblok → their site
rebuilds on **their own** Cloudflare Pages / Netlify account — requires that host
to be git-connected to a repo it can read. If the host is under the *client's*
account, it cannot be pointed at a monorepo that contains every other client's
code and content. Therefore **per-client repos are required**, not preferred, by
the combination of: client isolation + client-owned host + auto-rebuild.

(Industry hybrid confirms the shape: monorepo for tightly-coupled engine+apps,
separate repos for things that deploy independently.)

## Chosen approach: C — Engine monorepo + ejected per-client repos

The monorepo stays the **dev environment and the engine's source of truth**. Each
new client is built *inside* it on the latest engine with all tooling. At launch a
script **ejects** the finished client into its own standalone repo (site + vendored
`packages/shared` + workspace file — the 2-package shape the deploy skill already
mandates), **stamped with the engine commit it came from**. That standalone repo
then becomes the **single source of truth for that client**; the monorepo copy is
removed, leaving a one-line pointer. A `clients` registry indexes them all.

### Lifecycle (one client, end to end)

```
BUILD            DELIVER             POST-DELIVERY
monorepo    ──►  eject script   ──►  standalone repo
sites/clients/   ▸ vendors shared    client-<slug> (we own, private)
  <slug>         ▸ stamps commit     ▸ client's Cloudflare Pages (their acct)
(latest engine,  ▸ adds client       ▸ Storyblok publish webhook
 full tooling)     CLAUDE.md +        ▸ single source of truth
                   deploy/verify      ▸ edits happen HERE
                 ▸ registry entry
                 ▸ removes monorepo
                   copy → pointer
```

Worktrees are a **dev-ergonomics tool inside the BUILD phase only** — for building
2–3 in-progress clients concurrently without branch-switching thrash. They are not
where delivered sites are stored.

## Components

### 1. `sites/` reorganization (declutter)

Use pnpm-workspace glob namespacing instead of one flat directory:

```yaml
# pnpm-workspace.yaml
packages:
  - "packages/*"
  - "sites/clients/*"     # in-progress client builds only
  - "sites/demos/*"       # our demos (incl. salon prospect builds)
  - "sites/templates/*"   # the 60 tmpl-* gallery
  - "sites/landing"       # the marketing/landing site
```

`git mv` the existing dirs into these buckets. This is a one-time, low-risk reorg
(pnpm resolves by glob; scripts that reference `sites/<slug>` get path updates).
**Delivered clients are NOT kept under `sites/clients/`** — they graduate out (see
§4). `sites/clients/` holds only what is actively being built.

> Gallery/port scripts (`assign-ports.mjs`, `serve-gallery.mjs`,
> `build-gallery.mjs`, `scaffold-templates.mjs`) reference `sites/tmpl-*` and must
> be updated to `sites/templates/tmpl-*`. This is the main mechanical cost of the
> reorg and must be verified by re-running the gallery build.

### 2. The eject script — `scripts/eject-client.mjs`

One command turns a finished `sites/clients/<slug>` into a standalone repo.
Encapsulates the deploy skill's known "must ship as a 2-package mini-workspace"
gotcha so it's never hand-done wrong.

**Inputs:** `--slug <slug>` (required); reads engine commit from `git rev-parse`.

**Output:** a directory `../client-repos/client-<slug>/` containing:

```
client-<slug>/
  pnpm-workspace.yaml        # 2-package: this site + shared
  package.json               # root, name client-<slug>
  ENGINE.json                # { engineCommit, engineVersion, ejectedAt, slug }
  CLAUDE.md                  # client-specific (see §3)
  .gitignore                 # ignores .env, node_modules, dist
  .env.example               # STORYBLOK_TOKEN / STORYBLOK_STORY placeholders
  packages/shared/           # VENDORED copy of the engine at eject time
  scripts/
    deploy.mjs               # the right host deploy call for this client
    verify.mjs               # build + preview + Playwright screenshot
  sites/<slug>/              # the site (theme, content, pages, public)
```

**Steps the script performs:**
1. Validate the site builds clean in the monorepo first (`pnpm --filter <slug> build`).
2. Copy `sites/clients/<slug>/` → `client-<slug>/sites/<slug>/`.
3. Copy `packages/shared/` → `client-<slug>/packages/shared/` (vendored snapshot).
4. Write root `pnpm-workspace.yaml` (`packages/*`, `sites/*`) + root `package.json`.
5. Write `ENGINE.json` provenance stamp (commit + version + eject timestamp).
6. Render the client `CLAUDE.md` from a template + the registry fields.
7. Copy in `scripts/deploy.mjs` + `scripts/verify.mjs` (host-correct, slug-baked).
8. `pnpm install` + `pnpm --filter <slug> build` **inside** the ejected repo to
   prove it stands alone. Screenshot-verify.
9. Print the next manual steps (create GitHub repo, push, wire host + webhook) —
   the script does NOT auto-create the GitHub repo or touch the client's host
   account (those are irreversible/credentialed actions → operator-confirmed).

> **Vendoring, not publishing.** We deliberately vendor `packages/shared` into each
> client repo rather than publishing `@studio0rbit/shared` to a registry.
> Rationale: (a) it preserves the *exact* known-good Tailwind v4 `@source
> "../components"` relative-path scan, which is fragile from `node_modules`;
> (b) each client repo is then fully self-contained and builds forever, frozen at
> the engine it shipped with — which matches the no-maintenance business model;
> (c) post-delivery edits are almost never engine edits. The registry idea is
> revisited only if vendoring drift becomes painful at much larger scale (see
> "Future / YAGNI").

### 3. Client-specific `CLAUDE.md` (baked into each ejected repo)

A trimmed orientation file so `git clone client-<slug> && claude` opens
already-oriented. Contains: client name + slug, Storyblok space ID + story slug,
host (Cloudflare Pages project / Netlify site), live domain, engine commit it was
ejected from, the build/preview/verify/deploy commands, and the bright-line edit
rule (§ "Editing a delivered site"). Points reusable skills at the user-global
copies (below).

### 4. Graduation rule (single source of truth)

Once a client is **delivered and paid**:
1. The standalone `client-<slug>` repo is the **only** source of truth for that client.
2. Remove `sites/clients/<slug>/` from the monorepo.
3. Leave a breadcrumb: `sites/clients/_delivered/<slug>.md` — a one-line pointer
   with the repo URL, live URL, and delivery date. (Code lives in the standalone
   repo; the monorepo keeps only the pointer.)

This enforces *one truth at a time* by physical removal — no risk of editing a
stale monorepo copy thinking it's live.

### 5. The clients registry — `docs/clients/registry.md` (+ `clients.json`)

The index that makes 20+ clients navigable. One row per client:

| field | example |
|---|---|
| slug | `eye-candy-optical` |
| name | Eye Candy Optical |
| repo | `github.com/Acemoisan/client-eye-candy-optical` |
| live | `eye-candy-optical-yyc.netlify.app` → custom domain |
| host | Cloudflare Pages project `eye-candy-optical` (client acct) |
| storyblok | space `…` / story `…` (or `CMS-less`) |
| engineCommit | `42986f5` |
| delivered | 2026-06-17 |
| status | live / in-build / paused |

`clients.json` is the machine-readable twin (used by `eject-client.mjs` to render
`CLAUDE.md` and by any future "mass engine-update" script). `registry.md` is the
human-readable index.

### 6. Reusable skills → user-global (tool access in any repo)

Promote `deploy-shop-site`, `storyblok-shop-cms`, and `shop-templates` to
**user-level** skills so they're available when working in any standalone client
repo. Keep `triage-prospects`, the template-gallery scripts, and `client-pipeline`
*audit* mode **project-level** (monorepo-only — never needed for an existing
client). Plugins (`frontend-design`, `playwright`, `context7`) are already global.

### 7. Rare path: mass engine-update — `scripts/resync-engine.mjs`

For the uncommon case where an engine fix (e.g. SEO baseline change) should reach
already-delivered clients. **Opt-in, per-client, never automatic** (no-maintenance
model). Given a client repo + the monorepo, re-vendors latest `packages/shared`,
re-stamps `ENGINE.json`, rebuilds + screenshot-verifies, and leaves the push +
redeploy to the operator. Keeps the ability to mass-fix without coupling clients
to a live engine dependency.

## Editing a delivered site (the bright line)

- **Client-specific work** (theme, content, composition, copy, an add-on section
  built from existing components) → edit **directly in `client-<slug>`**. Full
  tooling: `pnpm install && pnpm --filter <slug> build`, Playwright screenshots,
  Storyblok fetch, the vendored component catalogue, the global skills. Fully
  isolated.
- **Engine work** (a brand-new shared component, a new vertical, an SEO-baseline
  change) → do it in the **monorepo engine first** so every future client
  benefits, then optionally `resync-engine` that one client.

## Error handling / safety

- `eject-client.mjs` refuses to run if the monorepo build fails first (no ejecting
  broken sites).
- The script proves the ejected repo builds **standalone** before declaring done
  (catches the workspace-resolution gotcha at eject time, not launch day).
- The script never creates GitHub repos or touches client host accounts — those
  are operator-confirmed (matches the "interrupt only for irreversible
  money/credential/auth actions" rule).
- Graduation removes the monorepo copy only after the standalone repo is pushed and
  verified live (operator confirms) — never lose the only copy.

## Testing / verification

- **Reorg:** after `git mv`, run the gallery build + a sample `pnpm --filter`
  build and confirm screenshots render (Tailwind `@source` still resolves).
- **Eject:** run `eject-client.mjs` on an existing delivered client (e.g.
  `eye-candy-optical`) into a scratch dir; confirm it `pnpm install && build`s
  standalone and the screenshot matches the monorepo build.
- **Registry:** confirm `clients.json` ⇄ `registry.md` agree for existing clients.

## Migration plan (existing state)

1. Reorg `sites/` into `clients/ demos/ templates/ landing` + fix gallery scripts.
2. Build `eject-client.mjs`; validate against `eye-candy-optical`.
3. Eject the 2 real clients (bitcoin-manor, eye-candy-optical) to standalone repos,
   wire their hosts/webhooks, then graduate them out of the monorepo.
4. Seed `registry.md` + `clients.json` with both.
5. Promote the 3 reusable skills to user-global.
6. Build `resync-engine.mjs` (can come last; rarely needed).
7. Update `deploy-shop-site` + `create-shop-site` skills + `CLAUDE.md` to describe
   the eject/graduate/registry flow as the standard.

## Future / YAGNI (explicitly deferred)

- **Publishing `@studio0rbit/shared`** to a private registry (GitHub Packages) at a
  pinned version, replacing vendoring. Only if vendoring drift becomes painful at
  much larger scale, AND after re-proving the Tailwind `@source`-from-node_modules
  scan. Not now.
- **Auto-creating client GitHub repos / wiring hosts via API** from the eject
  script. Deferred — irreversible/credentialed; keep operator-confirmed for now.
- **A monorepo-of-clients** (separate `client-repos` monorepo). Rejected — same
  isolation problem as a single monorepo for client-owned hosts.
```
