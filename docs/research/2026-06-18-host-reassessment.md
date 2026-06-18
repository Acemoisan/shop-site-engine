# Host re-assessment — Netlify vs Cloudflare Pages vs Vercel

**Date:** 2026-06-18 · **Status:** ✅ **DECIDED — standard host switched to Cloudflare Pages** (operator approved after the `sites/maw` deploy validated the flow). Docs updated; see `docs/decisions.md` 2026-06-18 entry.
**Trigger:** operator (Aidan) wanted the 2026-06-17 "Netlify is standard" call re-pressure-tested — specifically free-tier limits, "free forever?", US-jurisdiction/privacy, and ease of domain transfer.

## Headline

**Netlify's free tier materially degraded since we settled on it**, and that change cuts against our core promise (*client owns it, free forever, hands-off*). **Cloudflare Pages is now the better technical fit.** **Vercel is disqualified** for client work. The US-jurisdiction concern is real but is a *disclosure* obligation (already handled via the PIPA cross-border notice), not a practical liability — and switching hosts does **not** resolve it (Cloudflare is US too).

## What changed: Netlify free tier (the reason to revisit)

- **Sept 2025:** Netlify moved **new** accounts to a **credit-based** free plan. Our docs' "100 GB bandwidth / 300 build-min" only survives on **legacy** accounts (pre-2025-09-04). Every **new client account** (created under the client's email — exactly our runbook) is on the new model.
- New free plan ≈ **300 credits/mo ≈ ~15 GB bandwidth-equivalent**; deploys, bandwidth, compute, and requests all draw down the same 300 credits.
- **Over-limit = the site PAUSES until next cycle.** A paused project stops serving traffic **and stops accepting form submissions**, and you **cannot publish updates**. On the free plan you **cannot buy add-on credits** — you wait or upgrade.
- **April 2026:** credit costs went *up* (bandwidth 10→20 credits/GB; compute 5→10), so the same 300 credits buy *less*.
- **June 2026:** multiple forum reports of free-plan credits **not renewing** at cycle reset, leaving sites stuck paused.

**Why this matters to us:** a traffic spike (local-news mention, busy week) can pause a hands-off client site — including killing the contact form — with no self-serve fix for up to a month. That breaks "free forever" and "hands-off" for a client we no longer maintain. Our **existing** live sites (landing, Bitcoin Manor, salons, Eye Candy) run on the operator's **legacy** account and are grandfathered for now; the exposure is **future client accounts**.

## Cloudflare Pages (the recommended alternative)

- **Unlimited bandwidth at every tier** (including free) — no pause-on-traffic risk.
- **500 builds/mo** free; 20,000 files/site, 25 MiB/file (fine for our static shops).
- No credit metering, no pausing → **genuinely free-forever for a client-owned static brochure site.**
- Headless deploy mirrors our Netlify token flow: a scoped **API token** (`Account → Cloudflare Pages → Edit`) + **Account ID**, then `wrangler pages deploy <dist> --project-name=<slug>`. No GitHub required, same as today.
- Bonus for domains: **CNAME flattening** makes apex domains (`shop.ca`) "just work"; Netlify needs an A-record/ALIAS workaround for the root.

## Vercel (disqualified)

- **Hobby (free) plan prohibits commercial use** — "personal or non-commercial use" only. Client/revenue sites must be on **Pro ($20/seat/mo)**, and Vercel may disable Hobby projects "with or without notice."
- A client-owned free site on Vercel would be a **terms violation**. Not viable for our model. Only relevant if we ever run paid app-style projects ourselves.

## US jurisdiction / privacy (the operator's other worry)

- **Switching hosts does not fix this.** Netlify, Cloudflare, and Web3Forms are all US companies.
- The legal must is the **Alberta PIPA cross-border disclosure** — already shipped on every site (footer Privacy link + page + form purpose line naming US providers). See `docs/research/2026-06-17-attribution-and-disclosure-review.md`.
- For the data we collect (name/email/message on a contact form — no sensitive/financial/health data, voluntary, disclosed), the **practical** US-jurisdiction risk is very low. Disclosure is the pragmatic and sufficient answer.
- Eliminating US providers entirely would mean a Canadian-hosted form handler or a self-hosted Cloudflare Worker (re-introduces per-client lock-in — the exact reason `2026-06-17-form-service-comparison.md` rejected the Worker). **Not worth it** for contact-form data. Keep **Web3Forms + disclosure**.

## "Could a client host free, forever?"

- **Cloudflare Pages:** yes — static site, unlimited bandwidth, no pause. Holds up.
- **Netlify (new credit model):** not safely — pause-on-overage risk, and pausing also blocks form submissions. This is the single strongest reason to switch the default.

## Recommendation

1. **Flip the standard host to Cloudflare Pages**, keep Netlify as the documented alternative. ✅ **Done 2026-06-18.**
2. **Keep Web3Forms + PIPA disclosure** unchanged. US concern is handled; alternatives add lock-in/cost for negligible benefit.
3. **Write a host-agnostic domain-cutover runbook** into `deploy-shop-site` + the handoff template (the registrar-DNS steps), since the current docs hardcode Netlify's A record.

## Decision — DONE (2026-06-18)

- [x] `sites/maw` deployed to Cloudflare Pages (`maw-cnt.pages.dev`) — flow validated.
- [x] Flipped default Netlify → Cloudflare Pages across `CLAUDE.md`, `service-stack-inventory.md`, `deployment.md`, `decisions.md`, `deploy-shop-site` + `create-shop-site` skills.
- [x] Updated the PIPA cross-border disclosure to name Cloudflare Pages for new builds (`privacy-notice-template.md`, intake, handoff template) — legacy live sites keep "Netlify" until rebuilt.
- [ ] **Future:** when a live site is next rebuilt/migrated, move it onto the client's own Cloudflare account and update its deployed privacy notice to name Cloudflare. (No urgency — legacy Netlify account is grandfathered.)

## Sources

- Netlify: [pricing](https://www.netlify.com/pricing/) · [credit-based plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/) · [how credits work](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/) · [resume paused projects](https://docs.netlify.com/manage/accounts-and-billing/billing/resume-paused-projects/)
- Cloudflare Pages: [pricing/limits 2026](https://www.devtoolreviews.com/reviews/cloudflare-pages-pricing-bandwidth-limits-2026) · [Workers/Pages pricing](https://developers.cloudflare.com/workers/platform/pricing/) · [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- Vercel: [Hobby plan](https://vercel.com/docs/plans/hobby) · [Terms of Service](https://vercel.com/legal/terms)
