# Internal Scoping Note — Urban Texture Hair Studio

**Prospect:** Urban Texture Hair Studio · http://urbantexturehairstudio.com/
**Vertical:** salon (luxury) · **Google:** 4.9★, 973 reviews (Calgary)
**Audited:** 2026-06-18 · collector grade **C (high confidence)** · tier **tune-up** · platform **Shopify** (not legacy)

## Verdict: tune-up, NOT a rebuild

This is the rare "feature-complete and good-looking" case. The site already ships everything the rubric scores for: click-to-call, booking link, hours, address/map, reviews, LocalBusiness JSON-LD, HTTPS, OG tags, contact form, favicon, mobile viewport. Conversion graded **A**, SEO **A** (PSI SEO 100/100). The brand identity is genuinely premium — refined serif wordmark, gold/charcoal luxury palette, real salon photography — and matches a 4.9★/973-review luxury salon. We do not pitch a redesign here; we'd be manufacturing a problem (skill honesty rule).

The one real, defensible problem is **mobile performance**: PSI mobile performance **61** (desktop 80), and a long render-blocking + lazy-load chain that leaves below-fold sections blank on first paint (visible in both screenshots — "Our Philosophy", brands/products, and lower image bands paint white). This is a Shopify theme weight problem, not a design problem.

**Honesty guardrails applied:** the 10.2s figure is **lab LCP** (PSI/Lighthouse), no CrUX field data — frame as *indicative lab measurement*, never "Google's verdict" or a felt load time. Do not claim AA compliance off the Lighthouse contrast audit; describe as a best-practices fix at handoff.

## Recommended engagement & price

- **Engagement:** targeted **"tune-up" mini-engagement** (scoping rubric grade B/C → tune-up, per packaging.md). NOT the $1,500 flat rebuild.
- **Why not rebuild:** brand + features are strong; a rebuild would risk their Shopify booking/commerce stack and their existing SEO equity for little gain. The win is a focused performance + accessibility pass.
- **Price:** per-change, pay-as-you-go tune-up (quote up front). Scope this as a small fixed bundle, not the flat fee. If they want the engine's speed guarantee long-term, the upsell path is the $1,500 static rebuild + content migration add-on — but lead with the tune-up.

## What ports over (if it ever becomes a rebuild)

All present and reusable as-is: services + booking embed (Shopify), hours, NAP/address, Google reviews (4.9★/973 — huge social-proof asset, surface at decision point), real salon photography (luxury interior + product shots), brand wordmark + gold/charcoal palette. Copy ("A Luxury Salon", Philosophy section) is on-brand and liftable.

## Gap list (build/fix tasks)

From `fixes.targeted` + `fixes.general`:
1. **Mobile performance** — render-blocking requests, slow FCP/LCP, unused JS, enormous network payloads, document-request latency (theme-level Shopify bloat). Headline fix.
2. **Accessibility** — buttons without accessible names; links without discernible names; insufficient foreground/background contrast (mobile a11y 89).
3. **`fixes.targeted`: add Menu/Service structured data** — the only missing schema item (`menuSchema: false`); add per-vertical Service structured data so services surface in search.

## Client-facing next step

Send the 1-page `audit-urbantexturehairstudio.com.html` report. Lead with the strength ("your site looks the part of a 4.9★ luxury salon") then the single concrete win: **mobile speed** — most salon traffic is mobile and a slow first paint costs bookings. Offer a quick before/after on the performance + accessibility fixes as the tune-up hook. Do not pitch a redesign.
