---
name: deploy-shop-site
description: Use when deploying, hosting, or launching a Studio0rbit shop site — standing up auto-deploy, doing a per-client launch (standalone repo + host build hook + publish webhook), or quickly publishing a demo. Clients need no GitHub. Calgary shop-site engine specific.
---

# Deploy a Shop Site

How a shop site goes live and stays self-updating. Each site builds to **static files** (`sites/<slug>/dist/`) served from a free CDN host. Source of truth: `docs/deployment.md` (keep them in sync).

**The end state for every client:** they click **Publish** in Storyblok → their live site updates in ~1 minute, automatically, with nobody in the loop.

```
Storyblok (Publish) → webhook → host Build Hook → host rebuilds
   (pulls site CODE from Git + CONTENT from Storyblok) → redeploys to CDN
```

## Clients need NO GitHub
Site **code** lives in a Git repo **we** own; the client never touches it. The client only ever uses: **Storyblok** (edit content), a **host account** (Cloudflare Pages / Netlify — free, theirs, rarely opened), and a **domain** registrar (~$15/yr, annual renewal). Content changes flow Storyblok → webhook → rebuild and never touch Git. The deployed site is static files on a CDN, so it keeps serving even if rebuilds ever stop.

## Production model: one repo per client (not the dev monorepo)
The `sites/*` monorepo is our **development** capability. For a client **launch**, give their site its **own standalone repo** (just their site) so each client is isolated and hands-off.

> ⚠️ **Workspace dependency gotcha:** a site imports `@studio0rbit/shared` as `workspace:*`. A standalone single-site repo **must still carry `packages/shared`** (ship it as a 2-package mini-workspace: the site + shared, with a root `pnpm-workspace.yaml`) or the install/build can't resolve the shared engine. Don't copy only `sites/<slug>/` out and expect `pnpm install` to work.

## Per-client launch runbook (one-time, ~15 min, then zero maintenance)
1. **Finalize** the site — theme + content + Storyblok wired and verified (`create-shop-site`).
2. **Standalone GitHub repo** (ours): the site + `packages/shared` + a root workspace file. Push it.
3. **Client host account** under *their* email; connect the repo:
   - Build: `pnpm install && pnpm build` · Output dir: `dist` · Node 20+.
   - Env var: **`STORYBLOK_TOKEN`** = their Storyblok **delivery** (read) token. (Also set `STORYBLOK_STORY` if the code doesn't default to the right slug.)
4. **Build Hook** in the host — a URL that triggers a deploy.
5. **Storyblok → Settings → Webhooks → Story published** → paste that Build Hook URL. *(Now Publish auto-rebuilds.)*
6. **Point the domain** at the host (client owns the registrar).
7. **Hand over logins:** Storyblok + host + domain. **No GitHub.** Done.

## Fast paths for OUR demos (no client handoff)
- **Netlify Drop** (fastest): build, then drag `sites/<slug>/dist` onto https://app.netlify.com/drop → instant URL. Manual re-drop to update.
- **Cloudflare Wrangler** (scriptable): `npx wrangler login` (run via `! ` in the session prompt so output lands here), then `npx wrangler pages deploy sites/<slug>/dist --project-name=<slug>`.
- **Git-connected monorepo** (per-site host settings): Base dir `sites/<slug>` · Build `pnpm --filter <slug> build` · Publish `sites/<slug>/dist` · Env `STORYBLOK_TOKEN`.

## Tokens (don't mix them up)
- Site env var `STORYBLOK_TOKEN` = **delivery/read** token (same for every story in a space; safe in host config). See `storyblok-shop-cms` for delivery-vs-management tokens.
- The **management** `sb_pat_` token is for content-model setup only — never goes in host/deploy config.

## Verification status
Verified: static build output and the Storyblok content fetch at build time (`content source: Storyblok` in the build log). **Not yet executed end-to-end:** a live host + Publish→webhook→rebuild loop (pending an owner host login). When first run, confirm a Storyblok Publish triggers a deploy and the change appears live in ~1 min, then record it here and in `docs/deployment.md`.

## Common mistakes
- Copying only the site dir to a standalone repo → `@studio0rbit/shared` won't resolve (see gotcha above).
- Putting the `sb_pat_` management token in host env → wrong token; use the delivery token.
- Forgetting the publish webhook → site builds once but never auto-updates on client edits.
- Wrong output dir (must be `dist`) or missing `STORYBLOK_TOKEN` env → unstyled/empty or fallback-only deploy.
