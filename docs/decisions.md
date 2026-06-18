# Decisions Log

Running log of decisions for the Calgary local-shop website service. Newest first.

> **Scope reminder:** this project builds the *architecture and resources* (toolchain, design system, AI pipeline, accounts/access) to create shop sites quickly — not an internal library of finished sites or templates. Decisions below choose the tools that make up that capability.

---

## 2026-06-18 — Standard host switched: Netlify → Cloudflare Pages

- **Cloudflare Pages is now the standard host** for demos and client launches; **Netlify is demoted to the supported alternative.** Our currently-live sites (landing, Bitcoin Manor, Eye Candy, salons) stay on the **grandfathered legacy Netlify account** until rebuilt — only *new* client accounts go to Cloudflare.
- **Why:** Netlify moved new accounts to a **credit-based free plan (Sept 2025)** — ~300 credits/mo ≈ ~15 GB, and **the site pauses on overage** (which also blocks contact-form submissions; no add-on credits on free; April-2026 costs rose; June-2026 reports of credits not renewing). That breaks our core promise of a **free-forever, hands-off, client-owned** site. **Cloudflare Pages** has **unlimited bandwidth at every tier and never pauses** — the right fit for a static brochure site we never touch again. Full analysis: [docs/research/2026-06-18-host-reassessment.md](research/2026-06-18-host-reassessment.md).
- **Vercel rejected:** its **Hobby (free) plan prohibits commercial use** (client sites would need Pro at $20/seat/mo) — a non-starter for the model.
- **US-jurisdiction concern (raised alongside):** switching hosts does **not** change it — Netlify, Cloudflare, and Web3Forms are all US-based. The legal requirement is the **Alberta PIPA cross-border disclosure**, which we already ship; for contact-form data the practical risk is negligible. **Keep Web3Forms + disclosure** (a Canadian-only/self-hosted form handler would re-introduce per-client lock-in for ~zero benefit). The disclosure text now names **Cloudflare Pages** for new builds (legacy sites name Netlify).
- **Deploy flow validated** on `sites/maw` → `maw-cnt.pages.dev`: a scoped API token (`Account → Cloudflare Pages → Edit`) + account ID in `secrets/cloudflare.env`, then `wrangler pages deploy` — same shape as the Netlify token flow, **no GitHub required.** Runbook in the `deploy-shop-site` skill + memory `cloudflare-credentials`.
- **Also added:** a host-agnostic, per-registrar **domain-cutover runbook** in `deploy-shop-site` (you re-point DNS, never transfer the registrar), and trimmed the triple-repeated domain section out of the handoff generator.

---

## 2026-06-17 — Pricing: dropped tiers for a single $1,500 flat fee + add-on menu

- **Dropped good-better-best tiers in favour of ONE flat fee.** The offer is now a **single $1,500 one-time flat fee + a published à-la-carte add-on menu + a "custom quote" escape hatch** — no Starter/Growth/Pro, no $1,800 / $3,500 / $6,000. Every local-business site ships the **same core component set**; divergent needs (e-commerce, booking beyond the one included, extra pages, full copywriting, multi-location, photo sourcing) ride on add-ons, and true outliers get a custom quote.
- **This supersedes** the 2026-06-15 "Prices committed — $1,800 / $3,500 / $6,000 three tiers" decision (in the SHIPPED entry below) **and** the [2026-06-17 pricing-strategy research](research/2026-06-17-pricing-strategy.md) verdict ("keep 3 tiers, don't lower prices") — that research is now marked **superseded**.
- **Why (research-backed):** the [single-fee vs tiers study](research/2026-06-17-single-fee-vs-tiers.md) reached verdict **CONFIRM (single flat fee)** — under adversarial verification every pro-tier conversion/revenue claim was refuted (13 of 25 killed); the lone durable pro-tier point (no upward-migration path) is solved by the add-on menu. Tiers also add per-build scope variance, which works *against* the pipeline's consistency/speed moat (our codebase confirms tiers add zero build value today and would only add branching). A single fixed scope = one recipe, every site = maximum consistency.
- **$1,500 anchor:** Calgary band low-end / = the closest owns-everything-+-CMS comparable (Agency7 8-page+CMS ~$1,497), above the $299–999 budget-template floor, far below $7,500+ custom agencies. Reasoned positioning, not an evidence-locked band — sanity-check against live quotes before locking. Touch-ups stay per-change pay-as-you-go (no subscription, no maintenance contract).
- Authority doc: [docs/gtm/packaging.md](gtm/packaging.md) ("One flat fee — no tiers"). The live landing site (`sites/landing`) is migrated to $1,500 flat.

---

## 2026-06-17 — Audit suite descoped: pruned the research-grounded machinery, kept the knowledge

- **Halted the audit-suite upgrade (sub-projects #2–#6) and pruned the inert machinery.** The new `client-pipeline` orchestrator routes Audit mode through the existing `site-audit` skill + `packages/audit` collector (grade/tier + branded report + scoping note). The research-grounded layer — `rubric.json` (130 criteria), `src/foundation/*` (claims/criteria/score), and the just-started specialist team (sub-project #3) — had **zero consumers** and duplicated the legacy `src/rubric.ts` scorer the collector actually uses. Removed the source/tests/generators; the collector's 38 tests stay green.
- **Kept the research knowledge** in `docs/research/audit-foundation/` (`claims.json`, `SUMMARY.md`, 8 dimension briefings, `rubric.json` as a reference checklist) — verified "what makes a good local-shop site" base, not wasted.
- **Folded the verified top priorities + honesty rules into the `site-audit` skill** so the research is applied in every audit (sharper ranking, defensible framing) without the machinery.
- **Rationale:** the audit is sales infrastructure, not the product; the existing collector already serves the pipeline's two needs (outreach hook + build scoping). A 130-criterion model added cost and a second, drift-prone scorer without changing the pitch/scoping decision. Lean repo over dormant dead code (the "nothing long-term" model).

---

## 2026-06-16 — Lead pipeline: manual-first, free-tier (Phase 3)

- **Start the lead pipeline by hand, not with code.** v1 = one **Outscraper free-tier** (500 records/mo) Google Maps export per vertical×area → qualify in a spreadsheet → audit the top ~20 with the **existing** `packages/audit` tool. Goal: prove the **scrape → website-presence → audit** loop and validate demand for **$0** before building anything.
- **Grab ALL shops, not no-website-only.** ~25% of Canadian small businesses lack a site (shrinking ~1–2pp/yr); the other ~75% are mostly weak/dated sites the audit tool monetizes as rebuild/tune-up. Website-presence is a **column, not a filter**.
- **Outscraper is the workhorse; Playwright stays a rare per-shop deep-dive.** Scraping public data isn't illegal (hiQ v. LinkedIn / CFAA) but breaches Google's ToS — letting Outscraper do the bulk scraping puts that ToS risk on the vendor, not us.
- **Review-response analysis deferred to v2.** Owner-reply data (a verified strong signal — 63% of businesses never reply; replies are a Google local-ranking factor) is added only after scraping is proven.
- **Build the thin `packages/leads` tool only on a trigger** (≥3 pulls AND >30 min/pull; OR paying past free tier and wanting the audit batch-loop; OR dedupe-over-time pain). YAGNI until then.
- Spec: [superpowers/specs/2026-06-16-prospect-pull-manual-design.md](superpowers/specs/2026-06-16-prospect-pull-manual-design.md) · Plan: [superpowers/plans/2026-06-16-prospect-pull-manual.md](superpowers/plans/2026-06-16-prospect-pull-manual.md).

---

## 2026-06-15 — SHIPPED: capability built, service live (closes the open loops)

Reality has caught up to the plan. Recording it so earlier "reopened/pending/proposed" entries below are read as **history, not live uncertainty**:

- **Code-first is LOCKED and validated** (closes the "code-vs-no-code reopened" thread at the entries below). Evidence: the Astro + Tailwind v4 + OKLCH-token engine ships, **5 CMS-wired demos** + **60 template exploration sites** are built, and the **live landing page** runs on it. No-code (Framer/Wix/Webflow) remains a per-client handoff fallback only.
- **Service is LIVE:** landing page at **https://studio0rbit-audit.netlify.app/** (Netlify, `sites/landing`).
- **Prices committed (no longer "proposed"):** ~~the live site publishes **$1,800 / $3,500 (Growth) / $6,000** one-time, matching `docs/gtm/packaging.md`.~~ **SUPERSEDED 2026-06-17 → a single $1,500 flat fee + add-on menu (no tiers); see the 2026-06-17 pricing entry above.** Revisit the anchor with real sales data, not as an open question.
- **Toolchain table below ("Status: proposed, not yet committed") is now COMMITTED** — validated by the shipped engine.
- **Site-audit tool exists** (`packages/audit` + `site-audit` skill), run on a real prospect ("chopchop") — the "AI site-audit tool" build item is done.
- Still genuinely open: run the Calgary prospect scrape + first outreach batch (roadmap Phase 3–4); reconfirm scraper pricing.

> Note on older entries: the **PIPEDA** mention further down (in the 2026-06-15 GTM-research entry) was **superseded** by the correction "it's Alberta **PIPA**, not PIPEDA." The **care-plan / WaaS** directional notes are reference-only — the locked model is one-time fee, no maintenance.

---

## 2026-06-15 — Business model & hard requirements (owner direction)

Owner set direction that changes earlier assumptions. **Decided, not provisional:**

- **Business model = ONE-TIME build fee, NO maintenance contracts.** This **supersedes** the earlier "recurring care/WaaS plan for margin and stability" recommendation from the GTM research. Margin comes from build efficiency (AI pipeline + design system), not recurring revenue. The care-plan / WaaS sections of the GTM report are now **reference-only**, not the plan.
- **Hard requirement — client self-edits everything, unaided.** After handoff the shop owner edits text, images, hours, contacts, links, and menus **without us**. This is now a *gating* requirement on every tooling choice, not a feature.
- **Walk-away handoff — client owns all accounts.** No maintenance contract means the client must own domain, hosting, and any CMS/editor account so we have zero ongoing obligation. "Build it, hand it over, never touch it again."
- **The "code-first default / no-code fallback" framing is reopened.** That call was argued on *our* build efficiency (and an implicit recurring-care model). Under one-time-fee + zero-maintenance + client-owns-one-account, no-code may be the **primary** recommendation, not the fallback — see the [editability & handoff verification](research/2026-06-15-editability-and-handoff-verification.md). Final call pending the interview (positioning / vertical / volume).
- **Lovable** is being evaluated as a *build accelerator only* — verification confirms it is **not** a client self-edit / handoff solution on its own.
- **Two capabilities promoted to build items:** (1) an **AI site-audit tool** — fetch a prospect's existing site and determine what it would benefit from (powers value-first outreach); (2) a **consistent scoping rubric** — reliably determine what a given site needs and what we can do (the engagement-scoping framework Domain 4 flagged as missing).
- **Timeline:** working website *variations* by end of day (2026-06-15); actively prospecting clients by end of this week.

See [editability & handoff verification report](research/2026-06-15-editability-and-handoff-verification.md) for the evidence behind the reopened code-vs-no-code decision.

---

## 2026-06-15 — Vertical anatomy: restaurants/cafés + retail (19/19 confirmed of verified)

[Report](research/2026-06-15-vertical-anatomy-restaurant-retail.md). Completes the per-vertical picture.

- **Restaurant template defaults:** HTML menu (never PDF) + `schema.org/Menu` markup; reservations + first-party ordering are the conversion drivers; **ChowNow** = best-of-breed commission-free ordering embed (~$99–149/mo, no per-order cut) vs DoorDash 15–30%/order; mobile-first sub-2s.
- **Retail template defaults:** Astro supports the full e-commerce spectrum (checkout links → hosted pages → full storefront); **Shopify Buy Button JS** = best-of-breed embed for selling a few products from a code-based site; full Shopify/Square Online when real volume. `Product`+`Offer` schema (price/priceCurrency/availability/condition required for Google auto-updates).
- **Retail discovery:** Google **free local listings + local inventory app are CA-eligible** → usable for Calgary.
- 6 over-reaching vendor stats were refuted and excluded (logged in the report).

**All research domains are now answered. The only remaining gate before planning is the 🧭 owner decisions** (positioning, niche, price points, capacity) — see [open-questions.md](research/open-questions.md).

---

## 2026-06-15 — Engagement scoping rubric (25/25 verified)

Full decision framework researched and documented → [report](research/2026-06-15-engagement-scoping-rubric.md). High confidence (primary sources for tooling/CWV).

**Adopted decision rule — "foundation-strength test":**
- **No site / only social** → brand-new build.
- **Systemic failure or audit grade D–F** (unsupported/insecure platform, plugin bloat, broken IA, not mobile, conversion failure, rebrand/pivot, 3–5+ yrs old w/ structural debt) → **full rebuild**.
- **Solid base, surface issues, grade B–C** (mobile/booking/speed/SEO/section refresh) → **targeted fix package**.
- **Already aligned, grade A–B** → **care retainer**.

**Adopted rapid-audit pipeline (also our free-audit outreach hook):** PageSpeed Insights API + **SEOmator CLI** (`npm @seomator/seo-audit`, 251 rules → 0–100 + A–F) + Lighthouse CI, orchestratable via n8n + LLM to auto-generate the audit + outreach. Grade maps to tier (A=care, B/C=fix, D/F=rebuild). CWV pass/fail: LCP<2.5s / INP≤200ms / CLS<0.1 (lab scores approximate Google's field verdict — use for triage, not as official).

**Key economic stance:** because our AI/template pipeline makes rebuilds cheap/fast, **"when patching cost ≥ rebuild cost, rebuild"** tips toward rebuild more often than for a traditional agency. On every rebuild: **301 redirect mapping is the #1 migration priority** (missing redirects = top cause of ranking loss).

---

## 2026-06-15 — Re-verification of provisional claims (54-agent fact-check)

Ran a dedicated 3-vote web fact-check on the 18 highest-value provisional claims. Result: **10 confirmed, 6 corrected, 2 refuted.** Both research reports updated inline.

**Now confident (verified):**
- **Pricing holds:** Canada build tiers (~$1.5k basic / $3.5–5k standard / $6–10k+ advanced / $15k+ ecom) and care plans (US $100–150/mo; Canada $150–300 CAD/mo) confirmed. Calgary template builds confirmed but **low-end — budget ~$3k–$8k as typical.**
- **Square Appointments** has a free single-location plan, works in Canada → strong low-overhead booking default.
- **Alberta = 5% GST only.** Reviews drive clicks (4★ listings get ~59% of local-pack clicks). GBP completeness aids ranking. Trades need trust signals + mobile speed.

**Two corrections that change our plan:**
1. ❌→✅ **Privacy law: it's Alberta PIPA, NOT PIPEDA**, for a local shop collecting data in-province. Privacy policies/consent must reference **Alberta PIPA**. PIPEDA only applies to federally-regulated businesses or cross-border data.
2. ❌ **Square's Canada card fee is 2.5% in-person / 2.8%+$0.30 online** (not 2.65%). Also: OpenTable figures were stale (Basic $149 / Core $299 / Pro $499); Fresha is no longer free (~CA$29.95/mo); Stripe CA international add-ons are +0.8% + +2% conversion.

**WaaS caveat:** the subscription-build model is real but specific "$499×24 then $129" figures are illustrative — entry subscription web design runs ~$300–$800/mo.

---

## 2026-06-15 — Go-to-market & product research (passes A & B)

Two deep-research passes ran. **Both were API rate-limited during verification**, so most findings are *provisional (sourced, unverified)* rather than confirmed — see the [GTM report](research/2026-06-15-go-to-market-and-service-model.md) and [product/tooling report](research/2026-06-15-product-delivery-and-tooling.md). Decisions below are **directional, pending a verification re-run.**

**Newly verified (safe to build on):**
- AI pipeline gains a verified design→code spine: **Figma MCP** (`claude plugin install figma@claude-plugins-official`) + the **Astro Docs MCP** (from the stack pass). Playwright MCP is the likely QA leg.
- Ship **`LocalBusiness` JSON-LD** (only name+address strictly required) on every site; Core Web Vitals (LCP<2.5s/INP<200ms/CLS<0.1) are a ranking tie-breaker — Astro static output wins by default.
- **Alberta legal load is light:** no provincial web-accessibility law (AODA is Ontario-only); GST-only tax. WCAG 2.x AA still best practice; PIPEDA applies once we collect form/booking data.
- **Lead-gen is mechanizable + the winning angle is value-first:** Outscraper/Targetron to scrape Google Maps for no-website/low-rating shops; lead outreach with a free audit.

**Directional decisions (pending verification):**
- **Service shape:** 3 tiers (Starter brochure / Growth lead-gen / Pro e-commerce) + a recurring **care/WaaS plan** for margin and stability.
- **Bookings/payments are third-party embeds** (Fresha/Booksy/Square for salons; OpenTable/Resy for restaurants; Stripe/Shopify for commerce) — not built in-house. Keeps maintenance low.
- **Pricing anchor (CONFIRM FIRST):** Calgary template builds ~$2,500–$5,000 one-time; care plans ~$100–$300/mo.

**Still open before committing:** re-verify pricing/fees; build a new-build-vs-rebuild-vs-targeted-fix scoping rubric; cover restaurant/café + retail anatomy; and the owner's 🧭 positioning/niche/price/capacity calls.

---

## 2026-06-15 — Initial scope decisions

Confirmed before launching the stack/tooling deep research:

- **Stack approach:** Hybrid — research both code-based and no-code; code-based is the intended default, no-code is a fallback.
- **Content editing:** Shop owners self-edit content (hours, menu, photos, text) → requires a non-technical CMS editor UI.
- **Feature range:** Full — brochure/contact, bookings/reservations, e-commerce/online ordering, local SEO / Google Business discovery.

## Recommended toolchain (from 2026-06-15 research — see [research report](research/2026-06-15-stack-and-tooling-research.md))

Status: **proposed**, not yet committed. Validate by building the starter template.

### Code path (default offering)
| Layer | Choice | Why |
|---|---|---|
| Framework | Astro (Next.js for app-like sites) | Lowest recurring cost, best AI leverage, best reuse |
| Styling | Tailwind v4 | `@theme inline` token utilities |
| Components | shadcn/ui | CSS-variable theming → re-theme per client without touching components |
| Theming | CSS variables / OKLCH design tokens | One token file per shop |
| Architecture | Shared-component monorepo (pnpm workspaces) or Vercel Platforms multi-tenant | One codebase/toolchain → many shops |
| CMS (non-technical owners) | Storyblok | Most editor-friendly headless CMS, live preview |
| CMS (budget/technical owners) | Decap | Free, Git/Markdown, simplest Astro pairing |
| Hosting | Cloudflare Pages / Netlify / Vercel | $0–20/mo |
| AI tooling | Claude Code + Astro Docs MCP + `CLAUDE.md` design system | Repeatable, on-brand generation |

### No-code fallback
| Scenario | Choice |
|---|---|
| Fastest/cheapest brochure site | Framer |
| Native e-commerce needed | Wix Studio |
| Local/technical SEO is the priority | Webflow |

### Non-negotiable
- A **strong, structured design system / component library** is the defense against generic "AI slop" and the thing that makes per-shop builds a fast tweak. Encode it in `CLAUDE.md`.

### To verify before committing
- All 2025–2026 pricing (Framer repriced Oct 2025; CMS pricing figures were refuted in research).
- Bookings/ordering tooling, full Claude pipeline, and Calgary/Canada specifics (see [open-questions.md](research/open-questions.md)).
