# Content & Information Architecture — Audit Briefing

What a Calgary local-shop site must say (services + prices, real copy, photos, hours, menu/product detail) and how those facts should be sourced, granular, and structured per vertical. Every claim below is _(provisional)_; lead points are the must-have, high-impact ones.

## Necessary (must / should-have)

**Pricing is mandatory in some form on every vertical — the variable is granularity, not whether to show it.** The engine should never ship "no price signal at all"; every vertical gets at least a range, "starting at," labor rate, or consultation anchor. Publishing a price raises lead _quality_ by self-qualifying prospects; withholding it raises volume but lowers quality. The only real harm is publishing the _wrong granularity_ — a hard fixed price on variable, site-dependent work. _(provisional)_

- **Per-vertical pricing default (encode as a template default, not per-shop code):** barber/cafe/spa = full fixed itemized prices + per-line book CTA; trades = ranges/"starting at" + estimate CTA; auto = labor rate + short fixed menu + estimate CTA; dental = ranges for high-ticket elective + consult CTA; law = billing-model explainer + optional fixed-fee for standardized matters + consult CTA; retail = per-item prices when transactional, catalog "visit us" when foot-traffic. `ShopService.price` is already optional, so this is a content-layer decision. _(provisional)_
- **Cafe/restaurant menus** must publish a fixed price next to every item (not ranges) as in-page HTML, never a PDF; at minimum each item carries name + price + a short description. _(provisional)_
- **NAP + hours are the must-have factual core**, and must be byte-for-byte consistent across the website (footer + contact), the `LocalBusiness` JSON-LD, and the Google Business Profile — the single most important citation-consistency rule. Derive NAP/hours/area-served from ONE canonical `ShopContent` object that fans out to body, footer, and JSON-LD so the three can never drift; JSON-LD must reflect actual visible content, never padded/aspirational. _(provisional)_
- **Wrong/outdated hours are a top trust failure** (a customer who travels to a "open" shop that's closed leaves a 1-star review; Google made "openness" a ranking factor in late 2023). _(provisional)_
- **Real reviews/testimonials as quoted on-page copy** (the words, not just a star number) are the single most powerful local trust signal and double as indexable review-keyword content. _(provisional)_
- **A real About/owner-story block with a real photo** is a primary E-E-A-T "experience" trust signal and the single biggest copy gap vs a bare structural inventory — always reused across every vertical. _(provisional)_
- **Real, business-specific photography out-converts stock** (~35% lift in tested A/B; ~83% of consumers trust real photos more). The minimum viable real-image set for any shop: one storefront/exterior, one owner-or-team photo (highest-trust single asset — owner photo trusted by 46% vs 21% for no image), and one interior/work/results shot. Treat stock as a temporary placeholder, never the shipped state. _(provisional)_
- **Copy depth is a must:** ~300-500 words minimum homepage body to read as credible/rankable; a single-location one-page shop needs roughly 600-1,200 words total across hero + about + services + FAQ + area/contact. Below ~300-400 words it reads as a thin brochure at risk under Helpful Content systems. _(provisional)_
- **Storefront/hybrid verticals** (barber, cafe, spa, dental, retail, fitness, sit-down auto/law) frame content as "located at Y": full physical address + embedded/linked map + `PostalAddress` in JSON-LD. **Mobile/service-area verticals** (mobile trades, mobile auto) frame as "serves area X": `areaServed` + named Calgary cities/quadrants in copy. _(provisional)_

Should-haves once the must-haves are in place:

- **Per-service descriptions** (a real 1-3 sentence description per service, or 500-1,000 words on a focused page) out-convert and out-rank a bare price-only list for service verticals. _(provisional)_
- **An FAQ block** of 3-6 real Q&As (2-3 sentence answers) is still worth shipping for on-page conversion, featured snippets, voice, and AI-search — even though Google removed FAQ rich-result snippets (do NOT pitch FAQ schema for a rich-result payoff). _(provisional)_
- **Neighborhood/service-area copy** that names actual Calgary areas (never a city-name find-and-replace, which is treated as thin/duplicate). _(provisional)_
- **Hours as `openingHoursSpecification`** in JSON-LD (hh:mm:ss 24-hour, each day its own object, must agree with the visible table). _(provisional)_

## Niche / situational

- **Dietary/allergen tags** per menu item — optional/voluntary in Canada; no Alberta menu-calorie mandate. Ship as an optional field, not required. _(provisional)_
- **Variant-priced retail** uses `AggregateOffer` (lowPrice/highPrice) for a range — but that is NOT valid for Google merchant-listing rich results (those need a single `Offer`). _(provisional)_
- **Special/holiday hours** authored as dated exceptions (`validFrom`/`validThrough`), not by editing weekly hours; pragmatically, keep regular hours static and hand holiday-hours upkeep to the client's GBP. A 7+ day closure must be GBP "temporarily closed," not special hours (≤6 days). _(provisional)_
- **Call-tracking numbers** break NAP consistency — use Dynamic Number Insertion or one consistent local number; simplest safe default is one canonical local number in `shop.ts`. _(provisional)_
- **Multi-location** clients each need a uniquely-authored `/locations/<city>` page with that location's exact NAP/hours — never a shared list or city-swapped near-duplicate. Lower prevalence (most Calgary clients are single-location) but a real trap when it applies. _(provisional)_
- **Minor address abbreviations** (St vs Street, Ste vs Suite) are tolerated by Google — don't over-engineer normalization; spend effort on real discrepancies (wrong phone, missing postal digits, divergent business-name strings, stale duplicate listings). _(provisional)_
- **FAQ pre-visit question sets** (parking, walk-in vs appointment, payment/insurance, pets/kids) reduce phone load and aid voice search; phrase in natural language and vary the set per vertical. _(provisional)_

## Always reused vs rare

**Always-reused copy blocks (essentially every vertical):** hero value proposition, about/owner story, services-or-menu with real descriptions, hours, NAP/contact, reviews/testimonials quotes, FAQ, closing CTA. These map to core `ShopContent` fields. _(provisional)_

**Always-present factual data owners already hold:** exact business name, address, phone, hours (most maintain these in a GBP — ~64% claimed). The raw service/menu list with prices is also reliably owner-supplied. _(provisional)_

**Vertical-specific / optional content slots (toggled per template):**
- Menu item photos + descriptions — cafe/restaurant.
- Per-service keyword pages — trades/law/dental/auto/spa/fitness.
- Service-area/neighborhood text — multi-area service businesses.
- License/credentials/insurance copy — regulated/licensed verticals.
- Before/after results galleries — barber/spa (light consent), dental/spa/fitness (consent-gated under Alberta PIPA).
- Guarantee/warranty slot — vertical-gated (enabled for trades/auto, reworded/suppressed for law/dental). _(provisional)_

**Rare:** multi-location pages, 7+ day GBP closures, AggregateOffer variant pricing, call-tracking layers, gym cooling-off disclosures (Alberta has none for in-gym signups). _(provisional)_

## Most vs least common

- **Most common (and owner-supplied):** NAP, hours, a basic service/menu list with prices. The owner's GBP is the canonical pre-fill source — pull from it to remove intake friction and enforce NAP consistency. _(provisional)_
- **Most commonly MISSING-but-expected:** per-service descriptive copy (owners can't write it), polished body/marketing copy (hero tagline, About, headings, CTA wording), an About/owner story, item-level menu detail (~40% of independent restaurants lack a machine-readable menu; ~44% have no site at all), and SEO micro-content (alt text, meta descriptions, title tags — owners never produce these). These are the high-leverage defaults to AI-generate. _(provisional)_
- **Item-level photos** are most expected in retail and cafe, least common in barber/spa/auto/fitness (where the priced item is a service). Real shops most often ship name+price; descriptions/photos/variants are the commonly-missing tier. _(provisional)_
- **Reviews/testimonials** already exist (on the GBP) but are rarely surfaced unprompted — gather-only, never generate. _(provisional)_

## What works vs what doesn't

**Works (cross-vertical):** showing _some_ price signal to self-qualify leads; real photos (owner/staff highest-trust); quoted testimonial copy; an About/owner story; a single canonical content source feeding body + footer + JSON-LD; pulling NAP/hours/photos/reviews from the existing GBP and AI-drafting everything else.

**Doesn't work:** PDF menus; thin sub-300-word pages; stock/AI hero imagery; city-name find-and-replace area copy; a single shared page for multiple locations; a one-size "guarantee badge" (non-compliant for law/dental); withholding all price signal; NAP that drifts between site and GBP; schema-only fields not shown on the page.

**Per-vertical notes:**
- **Cafe/restaurant:** menu item descriptions + photos of best-sellers/high-margin items materially out-convert a bare list (~25-30% lift with imagery; ~82-84% of diners want food photos; DoorDash ~44% more orders per photographed item). Photograph only "one eye magnet per category," not every item. Item minimum: name + price + short description; dietary tags optional. _(provisional)_
- **Trades:** convert on real before/during/after project galleries (organized by type, with city + scope captions, on the homepage — ~80%+ lift reported); owner/crew photo carries disproportionate trust (plumbing owner image trusted 52% — highest tested). "Licensed, bonded, insured, WCB-covered" is the canonical trust cluster (display is a conversion signal, not a mandated disclosure). Use ranges/"starting at" + estimate CTA — a hard quote on unseen work is non-binding and exposes the business. _(provisional)_
- **Auto:** AMVIC business licence — advertising must conspicuously show the licensed business/trade name and (print/TV) a licence statement; **all-in advertised pricing** (all fees except GST) is enforced. Publish hourly labor rate + short fixed menu (oil change, inspection, tire rotation) + per-job written-estimate CTA; honest price ranges (e.g. brakes $250-$450) + turnaround on per-service pages. "Written estimate, warranty in writing, AMVIC-licensed" is a unique conversion play. _(provisional)_
- **Dental:** publish ranges for high-ticket elective treatments (improves lead quality); routine/insurance work stays consultation-based. Must be CDSA-registered; advertising truthful/verifiable, no superlatives/guarantees. Before/after photos need explicit written PIPA-compliant consent — default to clinic/staff/equipment imagery. Premises photography matters more than headshots for office-visited offices. _(provisional)_
- **Law:** make the billing model transparent (flat/hourly/contingency) + consultation CTA; optional fixed-fee for standardized matters. Hard prohibitions: no "specialist"/"expert," no superlatives ("best"/"top"), no advertised settlement amounts or guaranteed outcomes; contingency copy must disclose disbursements-on-loss + fee %. Substance content ("what to expect after a Calgary car accident") is the compliant conversion lever. _(provisional)_
- **Barber/spa:** the price list is the page clients browse before booking — item-level name + price + **duration** + 2-3 sentence selling description beats photos. Convert on a results gallery (6-12) + stylist/team headshots + interior atmosphere. _(provisional)_
- **Retail:** product pages need name + image + price + priceCurrency (Merchant minimum), plus real (non-stock) photos, a unique 2+ sentence description, variants, availability, and alt text. Catalog "visit us" without prices is acceptable when the job is foot traffic; keep online/in-store prices consistent. _(provisional)_
- **Spa/fitness:** spa/massage is NOT a regulated profession in Alberta (RMT unprotected as of mid-2026) — trust content is association membership (NHPC/CMMOTA/MTAA) + insurance-receipt eligibility, not a government licence. Member transformation photos need written PIPA consent. _(provisional)_
- **Cross-cutting federal floor (all verticals):** Competition Act (Bill C-59) — genuine testimonials with material connections disclosed, "adequate and proper testing" behind efficacy/performance claims, no drip pricing (all-in prices). _(provisional)_

## Audit takeaways

- **Add copy-depth and content-completeness checks** the structural 12-item inventory lacks: word-count floor (~300-400 min, 600-1,200 sweet spot), `hasAboutOrOwnerStory`, real per-service descriptions (not bare price rows), and quoted testimonials (not just a star count). _(provisional)_
- **Score the photo set against the MVP spec:** flag stock/AI hero imagery and require at minimum a real exterior + owner/team photo + one interior/work/results shot; weight owner photo highest. _(provisional)_
- **Enforce one canonical NAP/hours source → body + footer + JSON-LD, and check site↔GBP parity:** validate click-to-call points at the same number as JSON-LD `telephone`, emit `openingHoursSpecification`, and forbid schema-only fields not visible on the page. Ignore St-vs-Street noise; flag wrong/missing digits and divergent name/phone strings. _(provisional)_
- **Apply the per-vertical pricing-granularity rubric:** flag "no price signal at all" everywhere; flag a hard fixed price on variable/site-dependent trades/auto/dental work; for cafe flag PDF menus and missing per-item prices. _(provisional)_
- **Gate compliance-sensitive content by vertical:** flag law/dental superlatives, specialist claims, guaranteed outcomes, and advertised settlement amounts; require auto all-in pricing + AMVIC licence indication; treat before/after galleries (dental/spa/fitness) as consent-required. _(provisional)_
- **Frame intake as generate-then-confirm, not request-then-wait** (waiting on client content is the dominant cause of stalled projects). Pull NAP/hours/photos/reviews from the GBP; collect only what AI can't infer (raw service+price list, booking URL, real photos, 3-5 differentiator fragments, existing reviews); AI-generate descriptions/taglines/headings/alt/meta; seed it all into the client's owned Storyblok story as the editable live default. _(provisional)_
