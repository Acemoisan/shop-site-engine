# Client-Site Storage Strategy — Design

**Date:** 2026-06-18
**Status:** Approved direction (C), revised after 3-perspective review (build / business-ops / architecture)
**Author:** agent + operator (Aidan)

## Problem

All shop sites currently live in one pnpm monorepo (`shop-site-engine`): 2 real
clients, ~7 demos, 5 salon prospects, and 60 `tmpl-*` templates, all flat under
`sites/<slug>` sharing `packages/shared`. Three things break as this grows toward
20+ clients:

1. **Monorepo clutter** — engine, throwaway demos, the 60-template gallery, and
   paid deliverables are jumbled in one flat `sites/` directory.
2. **Client isolation** — paid clients aren't cleanly separated; nothing enforces
   "work on one can't leak into another," and there's no per-client owner/lifecycle.
3. **Dev↔launch reconciliation** — the `deploy-shop-site` skill already mandates a
   standalone per-client repo at launch (site + a copy of `packages/shared`), but
   that copy is hand-made, has no provenance, and can drift from its source.

**Goal:** a storage model that scales to 20+ clients which stay *organized,
isolated, and re-openable for paid changes later* — without losing the shared dev
environment and tooling that makes each build fast.

## Forcing constraint (why this isn't a pure monorepo)

The auto-rebuild promise — client clicks **Publish** in Storyblok → their site
rebuilds on **their own** Cloudflare Pages / Netlify account — **currently requires
that host to build from a git-connected repo** (the publish webhook hits the host's
build hook, which pulls code from git + content from Storyblok). If the host is
under the *client's* account, it cannot be pointed at a monorepo containing every
other client's code. So **per-client repos are required** by the combination of:
client isolation + client-owned host + git-driven auto-rebuild.

**Considered and rejected — headless-relay (zero client repos):** we *could* deploy
each client headlessly (`wrangler pages deploy <slug>/dist` into the client's
account, no git connection — already verified 2026-06-18) and run a Cloudflare
Worker *we own* that catches each Storyblok publish and triggers a per-client
headless rebuild. This eliminates per-client repos, but makes client auto-rebuild
depend on **an always-on service we operate**. That directly violates the
"deliver-first, no maintenance, client unaffected if we go inactive" model: a
git-connected host keeps auto-rebuilding with **zero** involvement from us, even if
we disappear. Per-client repos therefore win on *both* isolation **and** go-dark
survivability. Relay deferred indefinitely.

(Industry hybrid confirms the shape: monorepo for tightly-coupled engine+apps,
separate repos for things that deploy independently.)

## Chosen approach: C — Engine monorepo + ejected per-client repos

The monorepo stays the **dev environment and the engine's source of truth**. Each
new client is built *inside* it on the latest engine with all tooling. At launch a
script **ejects** the finished client into its own standalone repo (site + vendored
`packages/shared` + workspace file + **committed lockfile**), provenance-stamped.
That standalone repo becomes the **authoritative source for the live client site**;
the monorepo retains a real (non-stub) **mirror** under `sites/clients/_delivered/`
for gallery/batch/resync use. A `clients` registry is the **operational** index of
all of them.

### Lifecycle (one client, mapped to the payment gate)

```
BUILD                 GATE 2A (pre-pay)        GATE 2C (post-pay)
monorepo         ──►  eject + deploy on    ──► wire CLIENT host acct +
sites/clients/        OUR host / OUR           webhook + domain;
  <slug>              GitHub (preview link)    transfer ownership;
(latest engine,       client previews,         mirror to monorepo
 full tooling,        NO client account            _delivered/<slug>;
 worktree if          touched yet              registry → live
 concurrent)
```

- **Gate 2A (before payment):** eject → standalone repo pushed to **our** GitHub →
  deploy to **our** host → client previews on a `*.pages.dev`/`*.netlify.app` link.
  No client-owned account is touched. This preserves deliver-first leverage (no
  keys before money).
- **Gate 2C (after payment clears):** wire the **client's** host account + Storyblok
  publish webhook + domain cutover → transfer logins → **mirror** the source into
  the monorepo `sites/clients/_delivered/<slug>/` and flip the registry to `live`.

Worktrees are a **BUILD-phase dev tool only** — for building 2–3 in-progress
clients concurrently without branch-switching thrash. They are not where delivered
sites are stored.

## Components

### 1. `sites/` reorganization (declutter) + a path helper

Namespace via pnpm-workspace globs instead of one flat directory:

```yaml
# pnpm-workspace.yaml
packages:
  - "packages/*"
  - "sites/clients/*"             # in-progress client builds
  - "sites/clients/_delivered/*"  # delivered-client mirrors (real code)
  - "sites/demos/*"               # our demos + salon prospect builds
  - "sites/templates/*"           # the 60 tmpl-*
  - "sites/landing"               # marketing/landing — MUST stay at this exact path
```

> **`sites/landing` is hardcoded** in 5+ scripts (`check-overflow.mjs`,
> `shoot-gallery.mjs`, `build-templates-into-landing.mjs`, `make-og-images.mjs`,
> `serve-gallery.mjs`). It does **not** move into a bucket.

**The real cost is Node `fs.join(ROOT, "sites", slug)` calls, not pnpm.** pnpm
resolves by glob, but scripts that build a path from the bare slug break when
`tmpl-*` moves to `sites/templates/tmpl-*`. Fix with **one shared helper**
(`scripts/lib/site-dir.mjs` → `siteDir(slug)` maps slug → its bucket path) rather
than scattering edits. Scripts confirmed to need it:

- `assign-ports.mjs` (writes `astro.config.mjs` into the template dir)
- `build-gallery.mjs` (`existsSync` gate on `index.astro` — wrong path = 0/60)
- `scaffold-templates.mjs` (scaffolds new template dir)
- `fix-jsonld.mjs` (`readdirSync(sites).filter(startsWith "tmpl-")` — finds none)
- `design-templates.workflow.mjs` (per-template page path)
- `build-templates-into-landing.mjs` (the gallery→landing embed pipeline — couples
  `sites/landing` to `sites/templates/*`; re-verify after reorg)
- `check-overflow.mjs`, `make-catalogue.mjs` (path/doc references)

`--filter <slug>` exec lines survive untouched (filter matches **package name**, not
path; the reorg renames no packages).

### 2. The eject script — `scripts/eject-client.mjs`

One command turns a finished `sites/clients/<slug>` into a standalone repo,
encapsulating the deploy skill's "2-package mini-workspace" gotcha so it's never
hand-done wrong.

**Guard rails:**
- **Refuses** unless `--slug` resolves under `sites/clients/` (never eject a
  template or a shared-Storyblok demo).
- **Refuses** if `packages/shared` has uncommitted changes (a dirty engine tree
  would make the provenance stamp lie). Stamp uses `git describe --dirty` as a
  belt-and-braces check.
- **Refuses** if `pnpm --filter <slug> build` fails in the monorepo first (no
  ejecting broken sites).

**Output** `../client-repos/client-<slug>/`:

```
client-<slug>/
  pnpm-workspace.yaml        # packages/* + sites/*
  package.json               # root; carries packageManager + pnpm.onlyBuiltDependencies
  pnpm-lock.yaml             # COMMITTED — the real "frozen forever" mechanism
  ENGINE.json                # { slug, engineCommit, engineDescribe, sharedHash, ejectedAt }
  CLAUDE.md                  # client-specific (see §3)
  .gitignore                 # .env, node_modules, dist
  .env.example               # only emitted for CMS sites (see below)
  packages/shared/           # VENDORED snapshot of the engine at eject time
  scripts/
    deploy.mjs               # SELF-CONTAINED host deploy (no monorepo secrets/ dep)
    verify.mjs               # build + preview + Playwright screenshot
  sites/<slug>/              # the site (theme, content, pages, public)
```

**Critical carry-overs (each a real install-day failure if missed):**
- **`pnpm.onlyBuiltDependencies` (≥ `sharp`, `esbuild`)** in the generated root
  `package.json`. pnpm 10+ skips native builds otherwise; Astro's asset/sitemap
  pipeline pulls `sharp`. (Note: the monorepo's root `package.json` and
  `pnpm-workspace.yaml` currently *disagree* on this list — the eject script writes
  one correct, deduped list and is the moment to fix the discrepancy.)
- **`packageManager` field** pinned to the monorepo's pnpm version (corepack
  lockfile-format drift otherwise).
- **Committed `pnpm-lock.yaml` with resolved versions.** Without it, floating ranges
  (`astro: ^5`, `tailwindcss: ^4`) mean the *next* host rebuild can pull a new minor
  and change rendering — fatal to "builds forever / no maintenance." The lockfile is
  what actually freezes the site; the vendored engine alone does not.
- **`.env` handling:** detect CMS vs CMS-less from the source site. CMS sites
  (bitcoin-manor) get `.env.example` with `STORYBLOK_TOKEN`/`STORYBLOK_STORY`
  placeholders and a `CLAUDE.md` note that the **live host must set the real
  delivery token** or the build silently ships fallback content. CMS-less sites
  (eye-candy) get no `.env` artifacts.

**Final step:** `pnpm install && pnpm --filter <slug> build` **inside** the ejected
repo to prove it stands alone, then screenshot-verify. The script does **not**
create the GitHub repo or touch any client host account — those are
operator-confirmed (irreversible/credentialed; pinned to the gate stages above).

> **Why vendor, not publish a registry package.** (Corrected rationale — the earlier
> "Tailwind `@source` is fragile from node_modules" reason was wrong; `@source
> "../components"` resolves relative to `base.css`, identically in both topologies,
> and review confirmed the vendored scan works.) The real reasons: (a) a **private**
> `@studio0rbit/shared` would force every client's host build to authenticate to our
> registry with a long-lived PAT — a per-client secret that must work *forever*,
> coupling the client's "frozen" site to our registry staying up and that token
> staying valid; that breaks the go-dark/no-maintenance model. (b) Vendoring +
> committed lockfile gives a genuinely self-contained repo with **zero** external
> auth at install time. (c) Post-delivery edits are almost never engine edits. The
> published-package path is revisited only if vendoring drift becomes painful at much
> larger scale (see "Future / YAGNI").

### 3. Client-specific `CLAUDE.md` (baked into each ejected repo)

So `git clone client-<slug> && claude` opens already-oriented. Contains: client name
+ slug; Storyblok space ID + story slug (or `CMS-less`); host (Pages project /
Netlify site); live domain; **the frozen engine commit + a warning** ("this repo is
frozen at engine `<commit>`; user-global skills describe the *current* engine —
verify before applying engine-level steps"); the build/preview/verify/deploy
commands; and the bright-line edit rule (below).

### 4. Mirror, don't delete (single authoritative source, reversibly)

Once a client is **delivered and paid** (Gate 2C):
1. The standalone `client-<slug>` repo is **authoritative for the live site**;
   post-delivery edits happen there (clone → edit → push → auto-deploy).
2. `git mv sites/clients/<slug>` → `sites/clients/_delivered/<slug>` in the monorepo,
   keeping **real code** (consumes `workspace:*`, builds against the *live* engine).
   This preserves: the gallery/"sites we've shipped" view, repo-wide batch ops
   (`pnpm -r build`, cross-client audits), and a from-here resync path.
3. After any post-delivery edit in the standalone repo, **mirror the source change
   back** into the `_delivered/<slug>` copy (cheap — same theme/content/page files).
   `eject-client.mjs --check <slug>` diffs the two and **warns on divergence** so the
   mirror can't silently rot.

This replaces the earlier "delete the monorepo copy" rule, which was the
highest-regret, hardest-to-reverse decision — it solved a *discipline* problem
(editing a stale copy) with a *destructive* mechanism. The divergence check + the
`_delivered/` namespace + the registry `status` field solve it reversibly.

> **Honest framing:** this is "single source of truth **per client deliverable**,"
> not globally. The *engine* deliberately fans out into N frozen vendored copies +
> the live monorepo copy. `ENGINE.json.sharedHash` (a content hash of the vendored
> `packages/shared`) lets `--check` detect a hand-edited vendored engine, so
> divergence is *detectable* rather than silent.

### 5. The clients registry — `docs/clients/registry.md` + `clients.json`

The **operational** source of truth (not just a code index). One row per client:

| field | example / note |
|---|---|
| slug / name | `eye-candy-optical` / Eye Candy Optical |
| repo | `github.com/Acemoisan/client-eye-candy-optical` (private, ours) |
| live / domain | `eye-candy-optical-yyc.netlify.app` → custom domain |
| host | Cloudflare Pages project (client acct) |
| storyblok | space / story (or `CMS-less`) |
| engineCommit | `42986f5` |
| **registrarLogin / domainRenewal** | where domain lives + renewal date (a lapsed $15/yr domain = client outage they'll blame us for) |
| **ownershipTransferred** | Y/N + date (did Gate 2C complete?) |
| **paymentStatus / invoiceRef** | paid / refunded / collections |
| **gstRecordsRef** | pointer (CRA 6-yr retention) |
| **emailOnDomain** | Y/N (MX-risk flag from cutover) |
| **gscOwner** | who holds Search Console |
| **supportStatus** | delivered as-is on date X |
| status | in-build / live / paused |

`clients.json` is the machine-readable twin (feeds `eject-client.mjs` `CLAUDE.md`
rendering + any future resync). `registry.md` is the human index.

### 6. Source-export artifact at delivery (client-owns-it + go-dark survival)

Every delivery produces a **source export** — a zip of the client's
`sites/<slug>/` (theme + content + pages + public) plus, for CMS clients, a Storyblok
content export. Included in the handoff package (or escrowed and offered on request —
operator's choice, but the option must exist). This makes three otherwise-unanswered
cases survivable:
- **Client leaves us entirely** (and has no GitHub): they hold portable source, not
  just the static `dist/` on their host.
- **We go inactive:** their site keeps serving (static on their host) and they have
  the source to take elsewhere.
- **Contract alignment:** "client owns it" becomes literally true without us handing
  over our private repo or the engine.

### 7. Reusable skills → user-global (tool access in any repo)

Promote `deploy-shop-site`, `storyblok-shop-cms`, `shop-templates` to **user-level**
skills (available in any standalone client repo). Keep `triage-prospects`, the
template-gallery scripts, and `client-pipeline` *audit* mode **project-level**
(monorepo-only). Plugins (`frontend-design`, `playwright`, `context7`) are already
global. The bundled `scripts/deploy.mjs`/`verify.mjs` in each ejected repo must be
**self-contained** (a promoted global skill must not assume the monorepo's
`secrets/` or `scripts/` paths exist).

### 8. Rare path: mass engine-update — `scripts/resync-engine.mjs`

For the uncommon case where an engine fix should reach delivered clients. Because the
monorepo keeps a real `_delivered/<slug>` copy (§4), resync runs **from the
monorepo** — no cloning N external repos. Per-client: re-vendor latest
`packages/shared` into the client repo, re-stamp `ENGINE.json`, rebuild +
screenshot-verify, leave push/redeploy to the operator.

**Honest cost + scope:** these are static sites (no server, third-party form
endpoint only) so the realistic security-fix blast radius is small. But a real fix
across N clients is still N× build+verify+deploy. Therefore: **build and test
`resync-engine.mjs` against one real ejected client early** (not "last" as before),
so it works when first needed. It stays **opt-in, per-client, never automatic** —
this is not a maintenance contract; it's the capability to honor a paid change or a
genuine defect.

## Editing a delivered site (the bright line)

- **Client-specific work** (theme, content, composition, copy, an add-on section
  from existing components) → edit **directly in `client-<slug>`**. Full tooling:
  `pnpm install && pnpm --filter <slug> build`, Playwright screenshots, Storyblok
  fetch, the vendored component catalogue, the global skills. Fully isolated. Mirror
  the change back to `_delivered/<slug>` after.
- **Engine work** (new shared component, new vertical, SEO-baseline change) → do it
  in the **monorepo engine first** so future clients benefit, then optionally
  `resync-engine` that one client.

## Demos & templates (not clients)

- **Demos are never ejected.** They share **one** Storyblok space, so they can't be
  handed to a client-owned host as-is. Promoting a demo to a real client requires a
  **new dedicated Storyblok space** (re-home content) *before* eject.
- **Templates have no shared dependency** (self-contained astro+tailwind). The eject
  script's `sites/clients/` guard already excludes them.

## Prerequisites the storage model assumes (decide separately — NOT built here)

These are document/decision items, mostly cheap, that the machinery presupposes.
Resolve before relying on it:

1. **Contract wording must match "we keep the repo."** Add to
   `docs/gtm/payment-and-terms.md` + the handoff: deliverable = the deployed site +
   full ownership of host/CMS/domain accounts **+ a source export (§6)**; the build
   *source repository* and the *shared engine* remain Studio0rbit property. Without
   this, a client who paid against "all IP transfers" can claim our repo.
2. **A change-order product.** "Re-open for paid changes later" is the entire
   motivation, but there's no defined price/terms/SLA for it today (model is
   one-time, no maintenance, as-is). Define it (flat-per-change or hourly, written
   quote, as-is + payment-gated re-applied per change) so post-delivery edits aren't
   ad-hoc negotiations that erode the no-maintenance shield.

## Error handling / safety (summary)

- Eject refuses on: non-`clients/` slug, dirty engine tree, failing monorepo build.
- Eject proves a **standalone** build + screenshot before declaring done (catches
  workspace/native-dep/lockfile gotchas at eject time, not launch day).
- Eject never creates GitHub repos or touches client host accounts (operator-confirmed,
  pinned to Gate 2A vs 2C).
- Mirroring happens **after** the standalone repo is live and payment cleared; the
  monorepo copy is moved (not deleted), so a client's code is never the only copy in
  one fragile place.

## Testing / verification

- **Reorg:** after `git mv` + `siteDir()` helper, re-run the gallery build **and the
  gallery→landing embed** + a sample `pnpm --filter` build; confirm screenshots
  render (Tailwind `@source` still resolves) and the landing gallery repopulates.
- **Eject:** run `eject-client.mjs` on `eye-candy-optical` into a **scratch dir**
  (do NOT touch its live deploy); confirm it `pnpm install && build`s standalone,
  **`sharp` builds its native binary**, and the screenshot matches the monorepo
  build. This is the gate that proves vendoring + lockfile + native-deps all work.
- **Registry:** confirm `clients.json` ⇄ `registry.md` agree for existing clients.
- **Resync:** run `resync-engine.mjs` against one scratch-ejected client and confirm
  rebuild + screenshot.

## Migration plan (phased — safe work now, machinery forward)

**Phase 1 — now (safe, high-value, decoupled from the contested machinery):**
1. Reorg `sites/` into `clients/ demos/ templates/ landing` + add `siteDir()` helper;
   fix the listed scripts; re-verify gallery + landing-embed builds.
2. Seed `docs/clients/registry.md` + `clients.json` with the 2 real clients (full
   operational schema §5).
3. Add the **source-export step** to the delivery/handoff flow (§6).
4. Promote the 3 reusable skills to user-global (§7).
5. Resolve the two **prerequisites** (contract wording + change-order product).

**Phase 2 — build forward on the next fresh client (don't retrofit live sites):**
6. Build + validate `eject-client.mjs` against a **scratch** eject of
   `eye-candy-optical` (live deploy untouched).
7. Build + test `resync-engine.mjs` against that scratch eject.
8. Deliver client #3 end-to-end through the new eject→Gate-2C→mirror flow.

**Phase 3 — when there's a paying reason:**
9. Retro-eject bitcoin-manor / eye-candy-optical to standalone repos **only if/when**
   they need a paid change or a real defect fix — not to prove the script.
10. Update `deploy-shop-site` + `create-shop-site` skills + root `CLAUDE.md` to
    describe eject → gate stages → mirror → registry as the standard.

## Future / YAGNI (explicitly deferred)

- **Publishing `@studio0rbit/shared`** to a registry — only if vendoring drift hurts
  at much larger scale, and only after solving the private-registry-auth-on-client-host
  problem (§2 rationale). Public-npm would expose the engine; private adds a forever
  token to each client build. Not now.
- **Git subtree** for the engine — same engine-in-every-repo property as vendoring,
  but adds `git subtree pull` merge tooling for resync. Real option if resync volume
  grows; its merge sharp-edges aren't worth it while `_delivered/` mirrors make
  from-monorepo resync easy.
- **Headless webhook-relay** (Worker we own) — rejected for go-dark survivability
  (forcing-constraint section).
- **Auto-creating client GitHub repos / wiring hosts via API** — deferred;
  irreversible/credentialed; keep operator-confirmed.
```
