# Deep Research: Product, Delivery, Tooling & Client Accessibility (Calgary Local-Shop Website Service)

**Date:** 2026-06-15
**Method:** Deep-research workflow — 108 agents, 5 angles, 26 sources, 115 claims extracted, top 25 sent to 3-vote verification.
**⚠️ Reliability caveat:** The original verification + synthesis were **heavily rate-limited by the API** (server-side, temporary). Only **8 claims completed verification** in the first run.

**✅ Re-verification (2026-06-15):** The provisional claims were re-checked in a dedicated 3-vote web fact-check (`reverify-provisional-claims`, 54 agents, no rate-limiting). Section B below is **updated with those verdicts** — `✅ confirmed`, `⚠️ corrected` (true in concept but figures fixed), or `❌ refuted`. **Two items were materially wrong and have been corrected: the privacy law (PIPEDA → Alberta PIPA) and Square's Canada fee.**

---

## A. Verified findings (completed 3-vote check)

| # | Finding | Vote | Source |
|---|---|---|---|
| 1 | **Figma MCP server** gives Claude Code structured access to Figma files — read components, variables, layout data, and **generate code from frames**. | 3-0 | help.figma.com (primary) |
| 2 | Install the remote Figma MCP in Claude Code via `claude plugin install figma@claude-plugins-official`, then authorize through `/plugin`. | 3-0 | help.figma.com (primary) |
| 3 | **Core Web Vitals "good" thresholds:** LCP < 2500ms, INP < 200ms, CLS < 0.1. | 3-0 | corewebvitals.io |
| 4 | Core Web Vitals are a Google ranking **tie-breaker** between competing pages, not a primary ranking driver. | 3-0 | corewebvitals.io |
| 5 | **LocalBusiness schema:** only `name` + `address` are strictly required; `telephone`, `openingHoursSpecification`, `geo`, `url` are recommended. | 3-0 | seo-day.de |
| 6 | **JSON-LD** is the recommended serialization format for LocalBusiness structured data (over Microdata/RDFa). | 3-0 | seo-day.de |
| 7 | **AODA** (accessibility law) is **Ontario-only**, benchmarked to WCAG 2.0 AA — it does **not** bind Alberta businesses. | 2-0 | levelaccess.com |
| 8 | **Alberta has no province-specific web accessibility legislation.** | 2-0 | levelaccess.com |

---

## B. Provisional findings (sourced, **pending re-verification**)

### Website anatomy & conversion (by vertical)
- **Universal local-business conversion elements:** site-wide **USP/UVP with geographic location** in the masthead (visitors land from many entry points); **full NAP** (name/address/phone) consistent across core pages; **explicit service area** so customers know if they're served.
- **Trades/home services (plumbers, electricians, contractors):** must be **mobile-fast** (customers search on smartphones during urgent need → mobile optimization mandatory); display **trust signals** — licenses, certifications, insurance, testimonials.
- **Salons/spas:** **online booking** for direct appointment reservation is essential (bookings push to clients' calendars); a complete **Google Business Profile** with photos + reviews; **4+ star ratings drive substantially more clicks**.
- *(Restaurant/café and retail per-vertical specifics were fetched but their claims didn't reach verification — see source list for reading.)*

### Bookings / reservations pricing *(✅ re-verified 2026-06-15 — figures corrected)*
| Tool | Vertical | Verdict | Corrected pricing (current) |
|---|---|---|---|
| **OpenTable** | Restaurants | ⚠️ corrected | Tier structure right, **figures were wrong**: **Basic $149/mo** + $1.50/network cover (website covers $0.25 ea or $49/mo flat); **Core $299/mo** + $1/cover; **Pro $499/mo** + $1/cover. (~2% service fee on transactions as of early 2026.) |
| **Resy** | Restaurants | ⚠️ corrected | **No per-cover fees** (confirmed). **Platform $249/mo, Platform 360 $399/mo** confirmed. The **"Full Stack $899" tier is no longer on the official page**; post-Tock integration adds **Essential $269/mo** (3% prepay fee) and **Premium $399/mo** (2% prepay fee). |
| **Fresha** | Salons/barbers | ⚠️ corrected | **20% one-time marketplace commission on new clients (min ~$6)** confirmed. Processing is **tiered, not flat 2.19%**: in-person 2.29%+$0.20, online 2.79%+$0.20, manual 3.30%+$0.20. **No longer free** — paid plans (~CA$29.95/mo Independent; ~CA$19.95/member/mo Team), 7-day trial only. |
| **Booksy** | Salons/barbers | ⚠️ corrected | **$29.99/mo (1 provider) + $20/member/mo** confirmed. Processing is **tiered, not $0.15**: 2.49%+$0.10 (card reader), 2.49%+$0.20 (tap to pay), 2.69%+$0.30 (mobile/keyed). |
| **Square Appointments** | Salons/barbers/services | ✅ confirmed | **Free plan** ($0/mo) for a single location/individual; **Plus $35/mo**, **Premium $85/mo** per location (CAD). **Available in Canada.** Strong low-overhead default. |

*(Calendly, Jobber, Housecall Pro named in the brief but no fee claims surfaced — re-research if targeting trades.)*

### Payments & tax *(✅ re-verified 2026-06-15)*
- **Stripe (Canada)** ⚠️ corrected: **2.9% + CA$0.30** per successful domestic card charge (confirmed). Add-ons are **+0.8% international cards** and **+2% currency conversion** (these stack) — *not* a single ~1%.
- **Square (Canada)** ❌ the 2.65% figure was **refuted/outdated**. Current: **2.5% in-person**, **2.8% + $0.30 online/e-commerce**, **3.3% + $0.15 manually keyed**. (2.65% was the pre-Oct/Nov 2025 in-person rate.)
- **Alberta tax** ✅ confirmed: **5% federal GST only — no provincial sales tax** (Alberta is the only province with no PST/HST; CRA-confirmed).

### Local SEO & discovery *(provisional — re-verify)*
- Google rewards **complete, accurate, active Google Business Profiles** with better local-pack/map rankings. A complete profile includes: exact business name, precise address with correct map pin, **primary + secondary categories**, hours, phone, website URL, and service areas.
- Calgary-specific SEO sources fetched: blog.wesolve.ca (Calgary Google Maps ranking), albertarank.ca (local SEO).

### Client self-editing / CMS UX *(corroborates the first stack-research pass)*
Sources reinforce the earlier conclusion: **visual-editing headless CMSs** (Storyblok and similar) are best for non-technical owners; **Decap** is the simplest Git-based pairing; **TinaCMS** offers Git-based visual editing; **Sanity** suits technical teams. CMS-UX sources: prismic.io (best headless CMS with visual editing), luckymedia.dev (Tina; Decap-vs-Tina), monterail.com, webuildstores.co.uk. → See [stack research](2026-06-15-stack-and-tooling-research.md) §2 for the verified CMS conclusions.

### AI / Claude build pipeline
- **Verified:** Figma MCP (design-to-code) + (from prior pass) the **Astro Docs MCP**.
- **Provisional / corroborating:** encode the design system inside Claude (mindstudio: "build a design system in Claude Design" to avoid generic AI aesthetics) — reinforces the verified **CLAUDE.md / design-system** practice from the first pass. Additional MCP-server roundups: bito.ai (Claude Code MCP servers).
- **Pipeline shape (working hypothesis):** Figma (design source) → Figma MCP → Claude Code (component generation against the design-system CLAUDE.md) → Astro Docs MCP (current framework usage) → Playwright MCP (visual/QA checks). To be validated when we build the starter.

### Canada / Alberta legal & ops *(✅ re-verified 2026-06-15)*
- **Accessibility** ✅: AODA is Ontario-only; Alberta has no provincial web-accessibility law. The **Accessible Canada Act (ACA)** applies only to **federally regulated** organizations (banking, telecom, transport, Crown corps, federal gov) — *not* provincially regulated local shops. **(WCAG 2.x AA remains best practice and a selling point, but is not legally mandated for our Alberta clients.)**
- **Privacy** ❌→✅ **CORRECTED**: The earlier "PIPEDA applies" claim was **refuted**. A typical local Alberta shop collecting customer data intra-provincially (contact forms, bookings, e-commerce) is governed by **Alberta's PIPA (Personal Information Protection Act)**, *not* PIPEDA. Alberta (with BC and Quebec) has private-sector law deemed "substantially similar," which displaces PIPEDA for in-province activity. **PIPEDA only applies** if the business is a federal work/undertaking (bank, airline, telecom) **or** personal data crosses provincial/national borders. → Privacy policies and consent flows should reference **Alberta PIPA**. (Source: Office of the Privacy Commissioner of Canada.)

---

## C. What this means for our plan (interpretation)

- **The AI pipeline now has two verified anchors:** Figma MCP (design-to-code) and Astro Docs MCP (current-framework correctness). That's a real, repeatable design→code spine; Playwright MCP for QA is the likely third leg.
- **Per-vertical templates should bake in the conversion elements:** NAP + map, click-to-call, service area, trust signals (trades), online booking (salons/restaurants), reviews/GBP linkage. Bookings/payments are **third-party embeds** (Fresha/Booksy/OpenTable/Square/Stripe), not things we build — which keeps maintenance low.
- **SEO is largely operational:** ship `LocalBusiness` JSON-LD on every site (cheap, verified-correct) + drive Google Business Profile completeness. CWV is a tie-breaker — Astro's static output wins here by default.
- **Legal load is light in Alberta:** no provincial accessibility law and GST-only tax simplify compliance — but WCAG 2.x AA is still best practice, and PIPEDA applies the moment we collect form/booking data.

---

## Sources
**Primary/verified:** help.figma.com (Figma MCP) · corewebvitals.io · seo-day.de (LocalBusiness schema) · levelaccess.com (Canadian accessibility laws)
**Provisional/leads:** whitespark.ca (local conversion elements) · core6.marketing (electrician/trades sites) · adalo.com (salon/spa features) · restaurant.eatapp.co (OpenTable vs Resy) · goodcall.com (Fresha vs Booksy) · wise.com (Stripe/Square/PayPal Canada) · paymentgateway.ca (GST/HST) · blog.wesolve.ca (Calgary Maps ranking) · albertarank.ca (local SEO) · dev.to/sabrielagency (JSON-LD guide) · sterlingsky.ca (GBP checklist) · prismic.io (visual-editing CMS) · luckymedia.dev (Tina; Decap-vs-Tina) · monterail.com · webuildstores.co.uk · mindstudio.ai (design system in Claude) · bito.ai (Claude Code MCP servers) · cookie-banner.ca (PIPEDA; cookie consent) · qsrmagazine.com (restaurant elements — not extracted)
