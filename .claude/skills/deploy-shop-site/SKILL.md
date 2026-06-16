---
name: deploy-shop-site
description: Use when deploying, hosting, or launching a Studio0rbit shop site — standing up auto-deploy, doing a per-client launch (standalone repo + host build hook + publish webhook), quickly publishing a demo, or wiring a contact form to deliver email. Clients need no GitHub. Calgary shop-site engine specific.
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

## Contact form handling (static sites have no backend)
A static site can't email a form on its own — it needs a third-party form endpoint. **Use [Web3Forms](https://web3forms.com).** Verified working on the live landing site (2026-06-15); reference impl: `sites/landing/src/components/Contact.astro`.

**Why Web3Forms (and not the others we burned time on):**
- ✅ **Web3Forms** — host-agnostic (works on *any* static deploy, incl. Netlify drag-drop), **no activation step**, emails submissions instantly. Free tier ~250/mo.
- ❌ **FormSubmit.co** — requires clicking an email activation link, and that token gets **invalidated by any later submission** (token churn) → "confirmation token not found." Painful; avoid.
- ❌ **Netlify Forms** — form detection only runs on **Git/CLI builds, NOT manual drag-drop deploys**. Drag-drop → the form is never registered → POST returns **404**. Only viable if deploying via Git or `netlify deploy` (CLI).

**Setup (≈2 min):**
1. Owner gets a free **access key** at web3forms.com (enter their email → key emailed instantly; no account). The key is **public/safe to commit** — it lives in client-side HTML. Store it in `site.ts` (e.g. `web3formsKey`).
2. Form: hidden `<input name="access_key" value={key}>`, optional hidden `subject`/`from_name`, a hidden `botcheck` honeypot, and named fields.
3. Progressive-enhancement JS: `fetch("https://api.web3forms.com/submit", {method:"POST", headers:{"Content-Type":"application/json", Accept:"application/json"}, body: JSON.stringify(data)})` → check `json.success` → show inline success; no-JS falls back to a normal POST to the same endpoint.

> ⚠️ **You CANNOT verify Web3Forms with curl/server requests** — the free tier rejects non-browser calls with `"...Pro plan is required"` (it only accepts client-side/browser submissions). That error means the **key/endpoint are fine**, not broken. Verify by submitting from a **real browser** on the deployed (or locally-served) site — it returns `{success:true}` and emails the owner.

## Tokens (don't mix them up)
- Site env var `STORYBLOK_TOKEN` = **delivery/read** token (same for every story in a space; safe in host config). See `storyblok-shop-cms` for delivery-vs-management tokens.
- The **management** `sb_pat_` token is for content-model setup only — never goes in host/deploy config.

## Verification status
Verified: static build output and the Storyblok content fetch at build time (`content source: Storyblok` in the build log). **First live deploy done (2026-06-15):** the landing site shipped to **Netlify** (drag-drop of `dist`) at a free `*.netlify.app` subdomain, with a **Web3Forms contact form verified delivering email** end-to-end. **Still not executed end-to-end:** the Storyblok Publish→webhook→rebuild auto-update loop (pending a Git/CLI-connected host build). When first run, confirm a Storyblok Publish triggers a deploy and the change appears live in ~1 min, then record it here and in `docs/deployment.md`.

## Common mistakes
- Copying only the site dir to a standalone repo → `@studio0rbit/shared` won't resolve (see gotcha above).
- Putting the `sb_pat_` management token in host env → wrong token; use the delivery token.
- Forgetting the publish webhook → site builds once but never auto-updates on client edits.
- Wrong output dir (must be `dist`) or missing `STORYBLOK_TOKEN` env → unstyled/empty or fallback-only deploy.
- Using Netlify Forms with a drag-drop deploy → form unregistered, POST 404 (use Web3Forms, or deploy via Git/CLI). See Contact form handling above.
- "Testing" a Web3Forms key with curl and concluding it's broken → free tier blocks server requests; only a real browser submission works.
