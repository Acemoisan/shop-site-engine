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
