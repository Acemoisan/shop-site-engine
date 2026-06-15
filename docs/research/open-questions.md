# Open Questions & Next Steps

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

## 🧭 Owner decisions — THE LAST GATE before planning
Research can inform but not make these:
1. **Positioning:** premium/custom vs budget/volume.
2. **Niche:** one vertical (e.g. restaurants) vs general local-shop.
3. **Price points & packaging:** our actual tiers and care-plan price.
4. **Capacity:** solo vs team, time available, monthly tool/subscription budget.

Once these are set, move to **planning** (write the build plan for the starter template + AI pipeline) and then **implementation** (scaffold + a sample Calgary shop site to measure turnaround).
