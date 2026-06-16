# Deployment

Each shop site builds to static files (`sites/<slug>/dist/`) and hosts on a free static host. Under our model the **client owns their hosting account**; for our own demos we use ours.

Build first: `pnpm build` (or `pnpm --filter <slug> build`). Output is `sites/<slug>/dist/`.

## Option A — Netlify Drop (fastest, no CLI, good for demos)
1. Go to **https://app.netlify.com/drop** (sign in with a free account).
2. Drag the folder `sites/demo-barber/dist` onto the page → instant public URL.
3. Repeat with `sites/demo-cafe/dist`.
- Pro: zero setup. Con: manual re-drop to update (fine for demos).

## Option B — Cloudflare Pages via Wrangler (repeatable, recommended for real sites)
1. Authenticate once (run in the session prompt so output lands here):
   `! npx wrangler login`
2. Deploy a site:
   `npx wrangler pages deploy sites/demo-barber/dist --project-name=demo-barber`
   `npx wrangler pages deploy sites/demo-cafe/dist --project-name=demo-cafe`
- Pro: scriptable, custom domains easy, free tier generous.

## Option C — Git-connected (best for client-owned, auto-deploy on edit)
Requires the repo pushed to GitHub, then connect the repo in Cloudflare Pages / Netlify with:
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
- **Hosting account** (Cloudflare Pages / Netlify) — free, theirs, but they basically never open it
- **Domain** registrar — theirs, once-a-year renewal

Content changes flow Storyblok → webhook → rebuild and **never touch Git**. GitHub is purely *our* build source. The deployed site is static files on a CDN, so it keeps serving even if rebuilds ever stopped — no single point of failure for the client.

## Production model: one repo per client (not this dev monorepo)
This monorepo (`sites/*`) is our **development capability** — where we build/iterate the engine + templates. For a client **launch**, give their site its **own standalone repo** (just their one site) so each client is isolated, trivial to deploy, and truly hands-off. Generate/copy the finished site out of the monorepo into a fresh repo at launch.

## Per-client launch runbook (one-time, ~15 min, then zero maintenance)
1. Finalize the client's site (theme + content + Storyblok space wired — see the `storyblok-shop-cms` skill).
2. Create a **standalone GitHub repo** (ours) containing just their site; push it.
3. Create the client's **host account** (Cloudflare Pages or Netlify) under *their* email; connect the repo:
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
