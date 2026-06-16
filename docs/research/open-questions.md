# Open Questions & Next Steps

> **2026-06-15 update:** the owner-decision gate (bottom) is **resolved** and the capability has shipped (service live at https://studio0rbit-audit.netlify.app/). Only the minor "confirm during build" items remain. This file is now an archival tracker — see [roadmap.md](../roadmap.md) for live status.

Status as of 2026-06-15, after five research passes + a re-verification pass. Most original gaps are now closed.

## ✅ Closed since the first pass
- **Bookings/ordering/payments integrations** → covered for all four verticals (Square/Fresha/Booksy/OpenTable/Resy/ChowNow/Shopify/Stripe), with re-verified fees. See product & vertical-anatomy reports.
- **Full Claude/AI pipeline** → Figma MCP + Astro Docs MCP verified; pipeline shape documented.
- **Calgary/Canada specifics** → Alberta GST-only ✅; **privacy = Alberta PIPA, not PIPEDA** ✅; no provincial accessibility law ✅; Google free local inventory app is CA-eligible ✅.
- **Engagement scoping** → full decision rubric + automatable audit. See [scoping report](2026-06-15-engagement-scoping-rubric.md).
- **Restaurant/café + retail anatomy** → [vertical anatomy report](2026-06-15-vertical-anatomy-restaurant-retail.md).
- **Pricing** → re-verified (Canada build tiers + care plans confirmed; Calgary builds ~$3k–$8k typical).

## ⏳ Genuinely still open (minor — confirm during build, not blockers)
1. **Canadian e-commerce tax/fee specifics** — CAD/GST-PST setup and Square Online vs Shopify Lite vs Stripe fee comparison for Alberta merchants.
2. **Reservation widget embedding** — exactly how OpenTable/Resy embed into Astro (iframe/script/API) and their fees vs free Google Reserve for low-volume cafés.
3. **Care/maintenance retainer structure** — deliverables/SLA/price; note our static Astro/Git stack has a much smaller maintenance surface than WordPress, so define the retainer around content edits + monitoring, not plugin patching.
4. **Tech-stack-detection + GBP-completeness APIs** for the automated audit, and their scoring weights.
5. **12-month real-world maintenance/failure rate** of AI-built sites for non-technical owners.
6. **Lab vs field (CrUX) CWV** reconciliation for low-traffic small-business sites.

## ✅ Owner decisions — RESOLVED (was "the last gate"); see [roadmap.md](../roadmap.md) Locked decisions
All four are locked, and planning + implementation are **done** (engine, 5 demos, 60 templates, live landing page at https://studio0rbit-audit.netlify.app/):
1. **Positioning** → mid-market productized, ~$3k–$8k tiered (live: $1,800 / $3,500 / $6,000).
2. **Niche** → all verticals; demo order barber/café first.
3. **Price points & packaging** → set & published (see [packaging.md](../gtm/packaging.md)). One-time fee, no care plan.
4. **Capacity** → solo, full-time.
