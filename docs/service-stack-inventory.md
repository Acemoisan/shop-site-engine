# Service & Tool Stack Inventory

> **The single source of truth for every tool, service, and account in the Studio0rbit pipeline** — what *we* use to build/deliver, what the *client* owns after handoff, the plan/tier, the limits, and who pays. If a tool isn't here, it isn't part of the standard stack.

**Last reviewed:** 2026-06-17 · **Owner:** operator (Aidan)

### How to keep this current (do not let it drift)
This doc only works if it stays true. Update it **whenever**:
- We adopt, drop, or swap a tool/service.
- A plan/tier or a documented limit changes (re-verify quotas — providers change them).
- A "⚠️ under review" item gets settled (lock it in or replace it, then clear the flag).
- A new client launch reveals a tool we relied on but never wrote down.

When something here conflicts with `docs/deployment.md`, `CLAUDE.md`, or `docs/client-handoff-guide.md`, **this file wins** — then fix the other doc to match.

---

## Why our stack is low lock-in (the model in one paragraph)

We build **static sites** (Astro compiles each shop to plain HTML/CSS/JS). A static host is just a file-server + CDN — not a proprietary platform like Wix/Squarespace/Shopify where build and hosting are fused and leaving means rebuilding from scratch. Our output is **portable** (any static host serves it), content lives in **Storyblok** (exportable via API), and the **domain is client-owned from day one**. The only host-specific wiring is the auto-rebuild Build Hook — re-pointable in minutes if a client ever moves hosts. Net: **less lock-in than any all-in-one website builder**, and that's a selling point.

---

## 1. Tools WE use (development & delivery)

| Tool / Service | Purpose | Plan / Tier | Limits / Quotas | Account | Status | Ref |
|---|---|---|---|---|---|---|
| **Cloudflare Pages** | **Standard host** for demos + client launches | Free | **Unlimited bandwidth all tiers, no pausing**; 500 builds/mo; 20k files/site; Wrangler token-scriptable; CNAME-flattening = clean apex domains | Ours / per client | ✅ Standard | `docs/deployment.md`, `docs/research/2026-06-18-host-reassessment.md`, memory `cloudflare-credentials` |
| **Netlify** | Supported **alternative** host; currently hosts our live sites on a grandfathered **legacy** account | Free (`*.netlify.app`) | ⚠️ **Legacy accts:** 100 GB BW/300 build-min. **New accts (post-2025-09) = credit model: ~300 credits/mo ≈ ~15 GB; site PAUSES on overage (also blocks form submissions), no add-on credits on free** → not for new client accounts. See `docs/research/2026-06-18-host-reassessment.md` | Ours | ↔ Alternative | `docs/deployment.md` |
| **Astro** | Static site generator (per shop) | OSS, free | — | — | ✅ Core | `CLAUDE.md`; site `package.json` (`^5.0.0`) |
| **Tailwind CSS v4** | Styling (`@theme inline` tokens) | OSS, free | v4 needs `@source` for monorepo components | — | ✅ Core | `CLAUDE.md`; `^4.0.0` |
| **pnpm** | Monorepo workspace manager | OSS, free | — | — | ✅ Core | root `package.json` (`11.7.0`) |
| **Storyblok Management API** | One-time CMS setup (content model + seed content) | Free | Personal access token `sb_pat_`; setup-only | Ours | ✅ Core | `storyblok-shop-cms` skill; `setup-shop.mjs` |
| **GitHub** | Site code repos (ours; one standalone repo per client) | Free (private) | — | Ours | ✅ Core | `git-workflow-and-repo` memory |
| **Wrangler CLI** | Cloudflare deploy orchestration | Free | Only if using Cloudflare | — | ↔ Alt-only | `docs/deployment.md` |
| **Google PageSpeed Insights API** | Audit performance scoring | Free (API key) | Rate-limited, sufficient at our volume | Ours | ✅ Audit | `docs/decisions.md`; env `PSI_API_KEY` |
| **SEOmator CLI** (`@seomator/seo-audit`) | Deep SEO/security audit (251 rules) | Free npm pkg | — | — | ✅ Audit | `packages/audit/package.json` |
| **Outscraper** | Google Maps prospect scraping | Free tier | 500 records/mo | Ours | ⏳ Phase 3 | `docs/decisions.md`, `docs/roadmap.md` |
| **Claude Code** | AI build orchestration (the `client-pipeline` skill) | Existing subscription | — | Ours | ✅ Core | `CLAUDE.md` |
| **Playwright (MCP)** | Screenshot/responsive verification | Plugin, free | — | — | ✅ Verify | `CLAUDE.md` |
| **Astro/Context7 docs (MCP)** | Current Astro/Tailwind v4 docs | Plugin, free | — | — | ✅ Dev aid | `CLAUDE.md` |
| **frontend-design (plugin)** | Design brainstorm → token system | Plugin, free | — | — | ◻ Optional | `CLAUDE.md`, `docs/roadmap.md` |
| **Figma (MCP)** | Design→code spine (planned) | ~$12–16/editor/mo if adopted | — | TBD | ◻ Not adopted | `docs/decisions.md` |

---

## 2. Tools the CLIENT touches or owns (post-handoff)

The whole point: the client uses **as few tools as possible**, and **owns** the ones they use.

| Tool / Service | What the client does | Plan / Tier | Limits | Owner | Status | Ref |
|---|---|---|---|---|---|---|
| **Storyblok** | Edits content, uploads images, clicks Publish | Free **Starter** (forever) | 1 space, 1 seat, visual editor; re-verify asset cap | **Client** | ✅ Standard | `storyblok-shop-cms` skill; `docs/client-handoff-guide.md` |
| **Netlify** (host account) | Basically never opens it — auto-rebuilds on Publish | Free | Free-tier bandwidth/build limits (re-verify) | **Client** | ✅ Standard | `docs/deployment.md` |
| **Domain registrar** | Once-a-year renewal | ~$15–20 CAD/yr | — | **Client** | ✅ Standard | `docs/client-handoff-guide.md` |
| **Web3Forms** | Receives contact-form submissions as email | Free | **250 submissions/mo**, 30-day storage, no file uploads (free tier) | Keyed to client email | ✅ Standard | `docs/research/2026-06-17-form-service-comparison.md`; `docs/deployment.md` |
| **Google Business Profile** | Claims/maintains their own listing (local SEO) | Free | — | **Client** | ✅ Client action | `docs/client-handoff-guide.md` |
| **Booking / ordering** (see §3) | Runs their own business account; we embed it | Varies | Varies | **Client** | ↔ Per vertical | `docs/decisions.md` |

> **No GitHub, ever.** Site code lives in *our* repo; content flows Storyblok → webhook → rebuild and never touches Git. The deployed site is static files on a CDN, so it keeps serving even if rebuilds stop.

---

## 3. Client booking/ordering integrations (client-owned, we wire the embed)

Selected per vertical. The client owns the account and pays the fees; we only embed it.

| Service | Best for | Pricing (re-verify) | Notes |
|---|---|---|---|
| **Square Appointments** | Barber / salon / spa | **Free** single-location | 2.5% in-person / 2.8%+$0.30 online |
| **Fresha / Booksy** | Premium salons | ~CA$29.95/mo | Marketplace commission on new clients |
| **OpenTable** | Restaurant reservations | $149–499/mo + per-cover | Tiered |
| **Resy** | Premium reservations | $249–399/mo | No per-cover fee |
| **Google Reserve** | Low-volume restaurants | Free (via GBP) | Budget alternative |
| **ChowNow** | Restaurant ordering | ~$99–149/mo | Commission-free; 2.95%+$0.29 card |
| **Shopify Buy Button** | Retail, few products | Per Shopify plan | Embeds into Astro |
| **Shopify / Square Online** | Full retail e-commerce | Shopify ~$29/mo+ | When real inventory/shipping needed |

---

## 4. Cost summary

**Ongoing client cost: ~$15 CAD/year** (domain renewal only). Hosting + Storyblok stay on free tiers. Booking/payment tools are the client's own business expense.

**Our recurring cost:** effectively $0 for the core delivery stack (free tiers + existing Claude subscription). Paid tools (Outscraper paid tier, Figma) are not yet adopted.

---

## 5. ⚠️ Open decisions & review flags

| Item | Status | Decision needed |
|---|---|---|
| ~~**Standard host (Netlify → Cloudflare Pages)**~~ | ✅ Settled 2026-06-18 | **Switched: Cloudflare Pages is now the standard host**, Netlify the alternative. Netlify's Sept-2025 credit free tier **pauses** sites on overage (breaks "free forever, hands-off"); Cloudflare = unlimited bandwidth, no pausing. Vercel disqualified (Hobby bars commercial use). Validated via `sites/maw` → `maw-cnt.pages.dev`. Full analysis: `docs/research/2026-06-18-host-reassessment.md`; deploy flow: memory `cloudflare-credentials`. Live sites stay on the legacy Netlify account until rebuilt. |
| ~~**Web3Forms**~~ | ✅ Settled 2026-06-17 | **Locked in as standard.** Beats Formspree (50/mo), Netlify Forms (100/mo + pauses site), and a Cloudflare Worker (ties client to us). Full rationale: `docs/research/2026-06-17-form-service-comparison.md`. |
| ~~**Cross-border data disclosure**~~ | ✅ Settled 2026-06-17 (host name updated 2026-06-18) | **Mandatory & standardized.** Alberta PIPA s.13.1/13.2 require every client site to disclose that US providers (Web3Forms + the host — **Cloudflare Pages** for new builds; **Netlify** for legacy live sites) may store/process data outside Canada. Standard text: `docs/onboarding/privacy-notice-template.md`; full review: `docs/research/2026-06-17-attribution-and-disclosure-review.md`. Baked into CLAUDE.md, create-shop-site, intake, and handoff. |
| **Attribution / credit (badges)** | ✅ Settled 2026-06-17 | **None required anywhere** — Web3Forms, Storyblok, Netlify, Google Fonts, our custom icons, Astro/Tailwind on a compiled site all need no visible credit. Only watch: never use CC BY images without credit (prefer client-supplied / CC0 / Unsplash / Pexels); never enroll commercial sites in Netlify's OSS plan. See the review doc. |
| **Live monitoring** | Deferred | No uptime/error monitoring yet. Static sites rarely fail; revisit if client volume grows. |
| **Outscraper paid tier** | Phase 3 | Free tier (500/mo) until scrape volume forces an upgrade. |
| **Figma MCP** | Not adopted | Optional design tooling; ~$12–16/editor/mo if we ever turn it on. |

---

## 6. Where the detail lives (this doc summarizes these)

- `docs/deployment.md` — hosting + the Publish→webhook→rebuild auto-deploy loop
- `docs/client-handoff-guide.md` — client account ownership + per-vertical booking
- `docs/decisions.md` — toolchain rationale + pricing research
- `docs/roadmap.md` — cost model + phasing
- `CLAUDE.md` — dev pipeline, component catalogue, token system
- `.claude/skills/*` — the runnable workflows (audit, build, CMS, deploy, triage)
