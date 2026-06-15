# Deep Research: Go-to-Market & Service Model (Calgary Local-Shop Website Service)

**Date:** 2026-06-15
**Method:** Deep-research workflow — 111 agents, 6 angles, 28 sources, 126 claims extracted, top 25 sent to 3-vote verification.
**⚠️ Reliability caveat:** The original verification + synthesis were **heavily rate-limited by the API**; only **3 claims completed verification** in the first run.

**✅ Re-verification (2026-06-15):** Key pricing claims were re-checked in a dedicated 3-vote web fact-check (`reverify-provisional-claims`, no rate-limiting). The Pricing section below now carries verdicts (`✅ confirmed` / `⚠️ corrected`). Headline result: **the pricing is solid** — Canada build tiers and care-plan ranges confirmed verbatim; Calgary template pricing confirmed but flagged as low-end (~$3k–$8k is more typical); the WaaS example figures are illustrative, not standard.

---

## A. Verified findings (completed 3-vote check)

| # | Finding | Vote | Source |
|---|---|---|---|
| 1 | **Value-first outreach** that leads with a free analysis of the prospect's online presence converts better than generic cold outreach. | 2-0 | trovn.io |
| 2 | Roughly **1 in 5 to 1 in 3 small businesses still have no website** — this defines the size of the no-website prospect pool. | 1-1 (weak) | outscraper.com |
| 3 | **Outscraper** can scrape Google Maps listings and filter to "Businesses Without Websites Only" → at-scale lead generation. | 2-0 | outscraper.com |

---

## B. Provisional findings (sourced, **pending re-verification**)

### Prospecting / finding clients
- **Tools for finding shops with no/weak website at scale:**
  - **Outscraper** — Google Maps scrape + "no website" filter *(this one verified, see above)*.
  - **Targetron** — filters Google Business Profiles showing an "Add Website" link (Google-verified business, no site linked).
  - **Manual Google Maps** — search "[service] [city]", check listings for an empty website field.
  - **Google search operators** — e.g. `site:facebook.com "plumber" "Calgary"` to surface businesses relying only on social pages.
- **Qualifying workflow:** run targeted local searches → check for missing website links → prioritize businesses with **sub-4.0 star ratings** (room to improve) → extract NAP (name/address/phone) → verify they're a brick-and-mortar fit.
- **Outreach hooks that convert:**
  - A **free 1-page website audit** highlighting ~3 specific improvements.
  - Personalize by referencing a **specific page or feature** on their existing site that needs work.

### Offering / productization
- **Three-tier package structure** (common pattern):
  - **Starter** — brochure/credibility: ~5 core pages, mobile-responsive, basic forms, foundational SEO, simple CMS.
  - **Growth** — lead generation: custom templates, blog, CRM/email integrations, advanced SEO.
  - **Pro** — e-commerce: payment gateways, product management, scalable architecture.
- **Website care plan — four core deliverables:** backups, software/plugin/theme updates, security (firewall/malware scanning/brute-force protection), uptime monitoring. *(Note: backups/plugin-updates framing is WordPress-centric; on a static Astro/Git stack the maintenance surface is smaller — adapt the care-plan definition to our stack.)*
- **Website-as-a-Service (WaaS):** subscription can replace big upfront builds, e.g. **$499/mo for 24 months, then dropping to $129/mo** care plan. Requires a productized (not custom) service to stay profitable.

### Pricing & economics *(✅ re-verified 2026-06-15 — verdicts inline; currency mixes USD/CAD across sources)*
- **One-time build, Calgary** ⚠️ corrected: oxone.ca's **$2,500–$5,000** for a template 5–10 page site is **accurate but low-end** — multiple Calgary 2026 sources put a comparable "standard business site" at **~$3,000–$8,000** (Chameleon-Ideas $4,000–$10,000; Luminary $3,500–$8,000). Market tiers **$500–$1,500 DIY / $1,500–$5,000 template / $5,000–$15,000+ custom** ✅ confirmed.
- **One-time build, Canada 2026 (canadawebpro.ca)** ✅ confirmed (3-0): ~**$1,500 basic / $3,500–$5,000 standard / $6,000–$10,000+ advanced / $15,000+ e-commerce** (hosting excluded; hosting itself ~$20–$60/mo).
- **Care/maintenance plans:**
  - US agency survey ✅ confirmed (3-0): rarely under $75/mo; **most $100–$150/mo**, high end ~$250/mo.
  - Canada ✅ confirmed (3-0): **typical $150–$300 CAD/mo**; tiered **$50–150 basic / $150–250 standard / $250–400+ advanced** (+$100–200 e-commerce).
  - FatLab tiers (provisional, not re-checked): $99 / $199 / $349 / $599 per month (0 / 1 / 3 / 8 dev hours).
  - Clickworthy (Canada) entry plan (provisional): $299/mo CAD (hosting, security, backups, 1 dev hour).
- **Website-as-a-Service** ⚠️ corrected: the model (finance the build over a term, then step down to a care plan) is **real and common**, but "$499/mo × 24 then $129/mo" is **illustrative, not a standard rate**. Representative 2026: subscription web design **$300–$800/mo entry**; standalone care **$100–$500/mo**. Month-to-month after a 3–6 month onboarding now favored over long lock-ins.

### Engagement types & scoping *(source leads only — claims didn't reach verification)*
Sources fetched on **new build vs full rebuild/redesign vs targeted incremental fixes ("website care")**: rubikdigital (audit vs redesign), socialectric (redesign or rebuild), cmsminds (refresh vs redesign), reaktiv (redesign vs incremental decision process), lowcode.agency (rebuild vs redesign). These cover the decision framework but were not individually verified — treat as reading for building our own scoping rubric.

### Sales & intake *(source leads only)*
Sources on fast proposal/scope/close workflows: victorflow (client onboarding for web designers), smartpricingtable (how to scope a website project), feedbucket (web design proposal template), betterproposals (simple web design quote template).

---

## C. What this means for our plan (interpretation)

- **Lead-gen is mechanizable:** Outscraper/Targetron + a "no website / weak website + low star rating" filter gives a repeatable Calgary prospect list. The verified winning angle is **value-first outreach (free audit)**, not generic cold pitches. This pairs perfectly with an AI pipeline that can auto-generate a quick audit per prospect.
- **Productize into 3 tiers + a recurring care plan.** The recurring plan is where margin and stability live (WaaS / care subscription).
- **Pricing anchor (to confirm):** Calgary template-based builds cluster around **$2,500–$5,000 one-time**, with **$100–$300/mo** care plans. Our AI-leveraged low-overhead model can likely undercut or out-margin this — but **verify the numbers before quoting.**

---

## Sources
**Verified-claim sources:** trovn.io/blog/find-local-businesses-without-website · outscraper.com/how-to-find-businesses-without-website-for-cold-outreach
**Provisional/lead sources:** targetron.com/businesses-without-websites · smartreach.io (cold email templates) · alore.io (web design cold email) · zerodarkmktg.com · theadminbar.com (care plans) · newpulselabs.com (recurring revenue) · sugarpixels.com (packages) · fatlabwebsupport.com (maintenance tiers) · oxone.ca (Calgary pricing) · canadawebpro.ca (Canada 2026 pricing) · clickworthy.io (Canada maintenance) · superdupr.com · rubikdigital.co.uk · socialectric.com · cmsminds.com · reaktiv.co · lowcode.agency · debugbear.com · victorflow.com · smartpricingtable.com · feedbucket.app · betterproposals.io · redsunitservices.com · cliowebsites.com · chameleon-ideas.com

*(All Calgary-specific sources — oxone.ca, redsunitservices, cliowebsites, chameleon-ideas — are local agency blogs; useful for market-rate anchoring but self-interested. Re-verify.)*
