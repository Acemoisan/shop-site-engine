# Deployment

> **Live (2026-06-15):** the service **landing page** (`sites/landing`) is deployed on **Netlify** at **https://studio0rbit-audit.netlify.app/** — our own account, free `*.netlify.app` subdomain (custom domain to attach later). The free-audit contact form uses **Web3Forms** (host-agnostic, no activation; **verified delivering email**) — *not* FormSubmit (activation-token churn) or Netlify Forms (drag-drop deploys skip form detection → 404). See the `deploy-shop-site` skill → "Contact form handling." The client-shop Publish→webhook→rebuild loop (below) has **not** yet been exercised on a real client launch.

Each shop site builds to static files (`sites/<slug>/dist/`) and hosts on a free static host. Under our model the **client owns their hosting account**; for our own demos we use ours.

> **Standard host: Cloudflare Pages** *(switched from Netlify 2026-06-18 — see `docs/research/2026-06-18-host-reassessment.md`)*. Cloudflare's free tier has **unlimited bandwidth and never pauses**, so a client-owned static site stays free-forever and hands-off; deploy is a scoped API-token flow (no GitHub needed). **Netlify is the supported alternative** — our currently-live sites (landing, Bitcoin Manor, Eye Candy, salons) run on it from a grandfathered legacy account, but Netlify's post-2025 credit free tier **pauses new accounts on overage** (which also blocks form submissions), so we don't put new client accounts on it. See `docs/service-stack-inventory.md` for the full tool inventory.

Build first: `pnpm build` (or `pnpm --filter <slug> build`). Output is `sites/<slug>/dist/`.

## Option A — Cloudflare Pages via Wrangler token (STANDARD; headless, repeatable)
Creds live in `secrets/cloudflare.env` (gitignored: API token scoped `Account → Cloudflare Pages → Edit`, + `CLOUDFLARE_ACCOUNT_ID`). From repo root:
```
set -a; source secrets/cloudflare.env; set +a
npx wrangler pages project create <slug> --production-branch=main   # first time only
npx wrangler pages deploy sites/<slug>/dist --project-name=<slug> --branch=main
```
- Pro: scriptable, no GitHub/login prompt, unlimited bandwidth, never pauses, custom domains easy. First proof: `sites/maw` → `maw-cnt.pages.dev` (2026-06-18). Quirks (`wrangler whoami` errors harmlessly; use the `<project>.pages.dev` URL) in memory `cloudflare-credentials`.

## Option B — Netlify Drop (quick demo only, no CLI)
1. Go to **https://app.netlify.com/drop** (sign in with a free account).
2. Drag the folder `sites/<slug>/dist` onto the page → instant public URL.
- Pro: zero setup. Con: manual re-drop to update; Netlify's credit free tier pauses on overage — **demos only, not client launches.**

## Option C — Git-connected (auto-deploy on edit; for the client's standalone repo)
Requires the repo pushed to GitHub, then connect the repo in Cloudflare Pages (standard) / Netlify with:
- Build command: `pnpm --filter <slug> build`
- Output dir: `sites/<slug>/dist`
- This is the setup a client inherits: a Storyblok publish triggers a rebuild + redeploy automatically.

## Custom domain
Point the client's domain (e.g. `yourshop.ca`) at the host per the host's DNS instructions. The client owns the registrar account.

---

# Auto-deploy (Publish → live, nobody in the loop)

**Goal:** when the client clicks **Publish** in Storyblok, their live site updates in ~1 minute, automatically — no developer, no rebuild request.

**Mechanism:**
```
Storyblok (Publish) → webhook → host Build Hook → host rebuilds
   (pulls site CODE from Git + CONTENT from Storyblok) → redeploys to CDN
```

## ❓ Do clients need a GitHub account? — NO.
The site **code** lives in a Git repo that **we** own; the client never touches it. The client only ever uses:
- **Storyblok** — edit content (free, theirs)
- **Hosting account** (Cloudflare Pages — standard; Netlify alt) — free, theirs, but they basically never open it
- **Domain** registrar — theirs, once-a-year renewal

Content changes flow Storyblok → webhook → rebuild and **never touch Git**. GitHub is purely *our* build source. The deployed site is static files on a CDN, so it keeps serving even if rebuilds ever stopped — no single point of failure for the client.

## Production model: one repo per client (not this dev monorepo)
This monorepo (`sites/*`) is our **development capability** — where we build/iterate the engine + templates. For a client **launch**, give their site its **own standalone repo** (just their one site) so each client is isolated, trivial to deploy, and truly hands-off. Generate/copy the finished site out of the monorepo into a fresh repo at launch.

## Per-client launch runbook (one-time, ~15 min, then zero maintenance)
1. Finalize the client's site (theme + content + Storyblok space wired — see the `storyblok-shop-cms` skill).
2. Create a **standalone GitHub repo** (ours) containing just their site; push it.
3. Create the client's **host account** (Cloudflare Pages — standard; Netlify only for a grandfathered legacy account) under *their* email; connect the repo:
   - Build command: `pnpm install && pnpm build` · Output dir: `dist` · Node 20+.
   - Env var: **`STORYBLOK_TOKEN`** = their Storyblok preview/public **delivery** token.
4. Create a **Build Hook** in the host (a URL that triggers a deploy).
5. In **Storyblok → Settings → Webhooks**, set **Story published** → that Build Hook URL. *(Now Publish auto-rebuilds.)*
6. Point the client's **domain** at the host.
7. Hand over logins: **Storyblok + host + domain** (no GitHub). Done.

## What it requires
- **Of us (one-time per client):** the steps above. No ongoing work afterward.
- **Of the client:** a host account (free) + Storyblok (free) + domain (~$15/yr). **No GitHub, no code, no build knowledge — ever.**

## Deploying from THIS monorepo (for demos)
If connecting a host directly to this monorepo instead of a standalone repo, set per-site build settings:
- Base/working dir: `sites/<slug>` · Build: `pnpm --filter <slug> build` · Publish dir: `sites/<slug>/dist` · Env: `STORYBLOK_TOKEN`.
