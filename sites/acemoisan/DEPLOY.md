# Deploying `acemoisan` → Cloudflare Pages

Personal utility hub. A **standalone static Astro site** (no `@studio0rbit/shared`
dependency, no Storyblok/CMS, no backend — data is client-side localStorage).
Production URL: **`acemoisan.pages.dev`** (the `site:` in `astro.config.mjs` is
already set to this, so canonical/OG/sitemap resolve correctly).

## Recommended: Cloudflare Pages, connected to Git (auto-deploys on push)

Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**:

| Setting | Value |
|---|---|
| Repository | `Acemoisan/shop-site-engine` |
| Production branch | `main` (or the working branch until merged) |
| Project name | `acemoisan` → `acemoisan.pages.dev` |
| Framework preset | None |
| Build command | `pnpm install --filter acemoisan... && pnpm --filter acemoisan build` |
| Build output directory | `sites/acemoisan/dist` |
| Env var | `NODE_VERSION` = `22` |

> **`NODE_VERSION` must be ≥ 22.13** — the repo pins `pnpm@11.7.0`
> (`packageManager`), which requires Node 22.13+ (it uses the `node:sqlite`
> built-in). Node 20 fails at pnpm activation before any install runs.
>
> **Why the filtered install** (`--filter acemoisan...`): it installs only this
> site's dependency graph and skips the monorepo root's dev tooling (netlify-cli
> and its native deps). No `STORYBLOK_TOKEN` is needed — this site has no CMS.
>
> **Build-script decisions** live in `pnpm-workspace.yaml` (`allowBuilds` +
> `onlyBuiltDependencies`); every package with a build script has an explicit
> `true`/`false` there, so `pnpm install` never stops on
> `ERR_PNPM_IGNORED_BUILDS`.

## Alternative: headless deploy with Wrangler (from a machine that can reach `api.cloudflare.com`)

```bash
export CLOUDFLARE_API_TOKEN=<token scoped: Account · Cloudflare Pages · Edit>
export CLOUDFLARE_ACCOUNT_ID=<account id>
# ...or just: npx wrangler login   (opens a browser OAuth flow)

pnpm install --filter acemoisan... && pnpm --filter acemoisan build
npx wrangler pages project create acemoisan --production-branch=main   # first time only
npx wrangler pages deploy sites/acemoisan/dist --project-name=acemoisan --branch=main
```

> Note: the Studio0rbit dev/CI container's egress policy blocks
> `api.cloudflare.com` and `*.pages.dev`, so the Wrangler path must run from an
> environment that allows Cloudflare (a local machine, or a session whose network
> policy permits it). The Git-connect route above builds on Cloudflare's own
> servers and has no such restriction.

## Post-deploy check
- Visit `https://acemoisan.pages.dev/`, `/apps`, `/apps/macrofactor` — all 200.
- `view-source` → `<link rel="canonical">` and `og:image` are absolute `https://acemoisan.pages.dev/...`.
- `/sitemap-index.xml` and `/robots.txt` resolve.
- Log a food in MacroFactor, reload → it persists (localStorage).
