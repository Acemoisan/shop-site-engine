# Foundational Question Framework

The complete line of questioning the project must answer with confidence **before** planning or implementation. Goal: a bulletproof plan. Each question is tagged with status:

- ✅ **Answered** — covered by verified research (see linked report)
- 🔬 **Researching** — covered by an in-flight deep-research pass (2026-06-15)
- 🧭 **Decision** — a business/positioning choice the owner must make (research informs, doesn't decide)
- ⏳ **Open** — not yet researched

> **Scope reminder:** this project builds the *production capability* (pipeline, toolchain, design system, access) to create shop sites quickly — and the *service* sold around it. The questions below cover both.

> **⚠️ Owner direction (2026-06-15) reframes several domains:** business model is now a **one-time fee with NO maintenance contracts**, the client must **self-edit everything unaided** and **own all accounts** for a clean walk-away. This changes Domain 2 (no recurring care plan), Domain 3 (one-time pricing, not retainers), and Domain 8 (handoff/editability is now a *gating requirement*, and the code-vs-no-code default is reopened — see [editability & handoff verification](2026-06-15-editability-and-handoff-verification.md)). See [decisions.md](../decisions.md).

---

## Domain 1 — Market & prospecting (finding shops)
*How do we find these shops?*

- 🔬 What channels find local Calgary shops that need a website (or a better one)? (Google Maps/GBP, directories, referrals, cold outreach, door-to-door, partnerships)
- 🔬 How do we identify shops with **no website** vs an **outdated/slow/non-mobile** one — at scale, with tools?
- 🔬 What outreach messaging/offers actually convert for local web design (e.g. free audit)?
- 🧭 Do we niche by vertical (e.g. restaurants only) or stay general? (research informs; owner decides)
- 🧭 Geographic focus within Calgary / Alberta?

## Domain 2 — Offering & positioning (what we sell)
*What do we offer these shops?*

- 🔬 Productized packages vs custom — what structure fits a low-overhead AI-leveraged service?
- 🔬 What deliverables and tiers are most in-demand for local small businesses in 2025-2026?
- 🔬 How do we bundle "build + ongoing care/maintenance" into a recurring offer?
- 🔬 What add-ons matter (SEO, bookings, e-commerce, content, hosting)?
- 🧭 Premium/custom positioning vs budget/volume positioning?

## Domain 3 — Pricing & economics
- 🔬 Realistic Canada / 2025-2026 pricing: one-time build fees, monthly care plans, "website-as-a-service" subscriptions, hosting markups, retainers.
- 🔬 Recurring-revenue models and margins for a solo/small operator.
- 🔬 What will local shops actually pay?
- 🧭 Our price points and packaging (owner sets, informed by research).

## Domain 4 — Engagement types & scoping
*Does the shop have no website at all? Full refactor, or targeted component fixes?*

- 🔬 When is the right move a **brand-new site** (no existing site)?
- 🔬 When is a **full rebuild/refactor** of an existing site warranted?
- 🔬 When are **targeted component-level fixes / incremental improvements / "website care"** the better play?
- 🔬 How do we assess an existing site quickly to choose the path?
- 🔬 Pros/cons of each for a low-overhead service; how to scope and quote each fast.

## Domain 5 — Website anatomy & requirements (what sites actually need)
*What do websites actually need?*

- 🔬 Essential pages/sections and conversion elements **by vertical**: restaurants/cafés, salons/barbers/spas, trades/home services, retail.
- 🔬 Conversion drivers: click-to-call, hours, map, reviews, booking/order CTAs, galleries, menus.
- 🔬 Mobile-first, performance (Core Web Vitals), accessibility (WCAG) requirements.
- 🔬 What separates a lead-generating site from a dead brochure.

## Domain 6 — Design & discovery process
*How do we design around these shops?*

- 🔬 Fast intake/discovery and brand-extraction process per shop.
- 🔬 Content gathering (copy, photos, logo, hours, menu) — what we need from the client and what we generate.
- 🔬 Per-vertical design patterns we can lean on.

## Domain 7 — Tooling & architecture confidence
*We must be 100% confident which tools we use.*

- ✅ Stack comparison (code vs no-code) — [stack research](2026-06-15-stack-and-tooling-research.md)
- ✅ Template/multi-site architecture & theming — [stack research](2026-06-15-stack-and-tooling-research.md)
- 🔬 **Final high-confidence toolchain**, explicitly weighing the client-self-edit requirement and low maintenance.
- 🔬 Bookings, payments/e-commerce, and SEO integrations (best-of-breed, how they embed).
- 🔬 The Claude/AI build pipeline: skills, subagents, MCP servers, design-to-code, copy/image generation.

## Domain 8 — Client accessibility, handoff & ongoing care
*Accessible to clients afterward, for easy edits.*

- ✅ CMS editor-friendliness overview (Storyblok / Decap / avoid Sanity for self-editors) — [stack research](2026-06-15-stack-and-tooling-research.md)
- 🔬 Deeper CMS editor-UX comparison for non-technical owners (hours/photos/menus/text).
- 🔬 What minimizes ongoing support burden.
- 🔬 Handoff, training, and documentation best practices.

## Domain 9 — Calgary / Alberta / Canada operational specifics
- 🔬 `.ca` domains, hosting/data-residency.
- 🔬 PIPEDA / privacy / cookie-consent compliance.
- 🔬 Web accessibility law (AODA / Alberta) for small-business sites.
- 🔬 Canadian payment processing & sales tax (GST).
- 🔬 Google Business Profile setup for Alberta shops.

## Domain 10 — Risks & assumptions to pressure-test
- ⏳ Real 12-month maintenance burden / failure rate of AI-built sites for non-technical owners. (flagged in [open-questions.md](open-questions.md))
- 🧭 Owner's own capacity: solo vs team, coding/design skill, time available.
- 🧭 Budget and runway for tools/subscriptions.

---

## Research in flight (2026-06-15)

Two deep-research passes ran on 2026-06-15:

- **Pass A — Go-to-market & service model** → [report](2026-06-15-go-to-market-and-service-model.md) (Domains 1–4 + sales/intake).
- **Pass B — Product, delivery, tooling & client accessibility** → [report](2026-06-15-product-delivery-and-tooling.md) (Domains 5–9 + AI pipeline + toolchain confidence).

> ⚠️ **Both passes were rate-limited by the API during verification**, so only a subset of claims completed the 3-vote check (Pass A: 3 verified; Pass B: 8 verified). The remainder are *sourced but unverified* (recorded as "provisional" in each report), **not disproven**. **Verification needs re-running before we treat pricing/fees as confident** — this is the main reason several 🔬 items below are not yet promoted to ✅.

### Status after the two passes

- **Domain 1 (prospecting):** partly ✅ (value-first/free-audit outreach; Outscraper/Targetron scraping) — rest provisional.
- **Domain 2 (offering):** provisional — 3-tier packages + recurring care plan pattern documented; needs re-verify.
- **Domain 3 (pricing):** provisional only — **highest priority to re-verify** (Calgary ~$2.5–5k builds, ~$100–300/mo care).
- **Domain 4 (engagement types):** ✅ **DONE** — full [engagement scoping rubric](2026-06-15-engagement-scoping-rubric.md) (25/25 claims verified): decision tree (new/rebuild/fix/care), automatable rapid-audit checklist (PSI API + SEOmator CLI + Lighthouse CI), and per-tier scoping guidance.
- **Domain 5 (anatomy):** ✅ **DONE** — salons/trades in [product report](2026-06-15-product-delivery-and-tooling.md); restaurants/cafés + retail in [vertical anatomy report](2026-06-15-vertical-anatomy-restaurant-retail.md) (HTML menus + Menu schema, ChowNow ordering, Shopify Buy Button, Astro e-commerce spectrum, Google free local listings — CA-eligible).
- **Domain 7 (tooling/AI pipeline):** ✅ Figma MCP + Astro Docs MCP verified; pipeline shape hypothesized.
- **Domain 8 (accessibility/handoff):** corroborated prior CMS conclusions; no new verified specifics.
- **Domain 9 (Canada/Alberta):** ✅ AODA Ontario-only, Alberta has no provincial accessibility law; LocalBusiness schema + JSON-LD verified; tax/privacy provisional.

### Still needed before we're "confident to continue"

1. ✅ **Re-verification done** (2026-06-15) — 18 claims re-checked; pricing/fees firmed up; PIPA & Square corrections applied.
2. ✅ **Engagement-scoping rubric done** — [report](2026-06-15-engagement-scoping-rubric.md).
3. ✅ **Restaurant/café + retail anatomy done** — [report](2026-06-15-vertical-anatomy-restaurant-retail.md).
4. **🧭 Owner decisions** (research can't decide): positioning (premium vs budget/volume), niche vs general, price points, and capacity (solo vs team, time, tool budget). **← THE LAST GATE before planning. All research domains are now answered.**
