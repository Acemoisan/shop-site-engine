# Content & Information Architecture

What copy, pricing, photos, hours, and menu/product detail a Calgary local-shop site must ship — and which blocks reuse across verticals vs. flex per vertical. Synthesized from 86 re-verified content claims; only points marked _(provisional)_ rest on a still-provisional claim.

## Necessary (must / should-have)

The non-negotiable content spine, present on essentially every vertical:

- **Hero value proposition, about/owner story, services-or-menu (with real descriptions), hours, NAP/contact, review/testimonial quotes, FAQ, and a closing CTA** are the always-reused copy blocks.
- **A real About / owner-story block with a genuine photo** is the single biggest copy gap vs. a bare structural inventory — it is a primary E-E-A-T "experience" trust signal and lifts conversion across every vertical (only tone/length differs).
- **Quoted reviews/testimonials as on-page copy** (the actual words, not just a star number) are the single most powerful local trust signal and double as keyword-rich, indexable content.
- **NAP must be byte-for-byte consistent** across website, `LocalBusiness` JSON-LD, and Google Business Profile — the single most important citation-consistency rule. Derive NAP/hours/area-served from **one canonical content source** (the typed `ShopContent` object) that fans out to body, footer, and JSON-LD so the surfaces can never drift. Mismatches dilute the Prominence ranking factor and risk manual action.
- **Hours must be published and correct.** Outdated hours are a top conversion-and-trust failure (a customer who finds you closed leaves a 1-star review), and "openness" became a ranking factor in late 2023. Emit `openingHoursSpecification` (24h `hh:mm:ss`, each day its own object) that agrees with the visible table.
- **Real, business-specific photography over stock.** A genuine owner/staff photo is the highest-trust single image (BrightLocal: 46% trust owner photos vs. 21% for none; 79% trust a site more with any staff/premises photo). Authentic imagery is now an explicit consumer expectation (~98% per Getty). The MVP image set for any shop: one storefront/exterior, one owner/team photo, one interior/work/results shot — sites with no images score lowest on trust.
- **A pricing signal is mandatory on every vertical** — never ship "no price at all." The harm comes only from the wrong granularity (a hard fixed price on variable, site-dependent work).
- **Per-vertical pricing defaults:** barber/cafe/spa ship a full fixed itemized price list that doubles as the booking entry point; trades/dental/law/auto should NOT publish a full fixed per-item list — ranges / "starting at" anchors plus a consultation/estimate CTA, because the true price depends on a site visit, diagnosis, case, or treatment plan (a hard quote on unseen work isn't binding and exposes the business).
- **Cafe/restaurant menus** must show a fixed price next to every item, rendered as in-page HTML (never a PDF); the menu is the most-visited page. Item minimum: name + price + short description.
- **Minimum credible copy:** roughly 600–1,200 words of real body copy across hero + about + services + FAQ + area/contact; below ~300–400 words the page reads as a thin brochure at risk under Helpful Content systems _(provisional)_. A ~300-word homepage floor reads as credible enough to rank _(provisional)_.
- **Compliance-driven content is must-have where it applies** (regulated/licensed verticals — see "What works vs what doesn't"): AMVIC display + all-in pricing (auto), no "specialist"/superlatives and no settlement-boasting (law), truthful/verifiable/no-guarantee advertising (dental), consent-gated before/after (dental/spa/fitness under Alberta PIPA). The federal Competition Act floor (genuine testimonials, all-in pricing, tested performance claims) governs **every** vertical.
- **SEO/accessibility micro-content** (image alt text, meta descriptions, per-page titles) must always be machine/AI-generated — owners don't produce these and small sites routinely ship them missing.

## Niche / situational

- **Per-service descriptions** (~500–1,000 words on a focused service page, or a substantial paragraph each when consolidated) outperform a price-only list for ranking + conversion in service verticals (barber, spa, trades, dental, law, auto, fitness) _(provisional)_. For a one-page demo, the equivalent is a real 1–3 sentence description per service.
- **Neighborhood / service-area copy** naming actual Calgary areas (never a city-name find-and-replace, which is treated as thin duplicate content) — required to rank for "near me" queries; matters most for multi-area service businesses (trades, mobile auto, law, multi-area clinics), less for a single-storefront barber/cafe.
- **Trades lead-quality pricing:** publishing a "starting at" / typical project range filters budget-mismatched homeowners and improves lead quality _(provisional)_.
- **Dental high-ticket ranges** (implants, ortho, cosmetic) pre-qualify serious prospects; routine/insurance-billed work stays consultation-based _(provisional)_.
- **Auto** is hybrid: publish the hourly labor rate + a short fixed-price menu (oil change, inspection, tire rotation) alongside an estimate CTA, with honest ranges + turnaround for variable repairs _(per-service ranges provisional)_.
- **Law** ships a billing-model explainer (flat/hourly/contingency, in plain language) + consultation CTA, with optional fixed-fee lines for standardized matters (simple will, incorporation).
- **Retail** shows per-item prices when transactional/click-and-collect, but a catalog "visit us" pattern without prices is acceptable when the job is foot traffic; keep online/in-store prices consistent.
- **FAQ** (3–6 real, specific Q&As) is still worth shipping even though Google removed FAQ rich results — value is now on-page conversion, featured snippets, voice, and AI-search citation. Pre-visit questions (parking, walk-in vs. appointment, payment/insurance, pets/kids) phrased naturally cut phone load _(provisional)_; question sets are vertical-specific.
- **Credentials / trust-bar content** (licenses, certs, association/BBB/Chamber membership, awards, years-in-business, warranties) — most load-bearing for higher-consideration verticals (trades, auto, dental, law, spa); a barber/cafe needs far less.
- **Menu item photos + descriptions** for cafes materially out-convert a bare list _(provisional)_; photograph only best-sellers/high-margin items.
- **Multi-location** sites need a uniquely-authored page per location (`/locations/<city>`) with that location's exact NAP/hours — never one shared page or city-swapped near-duplicates. Lower-prevalence (most Calgary clients are single-location) but a real trap when it applies.
- **Holiday/special hours** authored as dated exceptions; pragmatically, keep regular hours on the static site and document GBP special-hours as the client's ongoing job. Call-tracking numbers, GBP 7+ day closures, and address abbreviation tolerances are handoff edge cases, not site work.

## Always reused vs rare

**Always reused (core `ShopContent` fields / sections, every vertical):** hero value prop, about/owner story, services-or-menu with real descriptions, hours, NAP/contact, quoted reviews/testimonials, FAQ, closing CTA. NAP+hours are the one factual core owners reliably already have (most maintain a GBP).

**Vertical-specific (optional content slots toggled per template):**
- Menu item photos + descriptions — cafe
- Per-service keyword pages — trades/law/dental/auto/spa/fitness
- Service-area / neighborhood text — multi-area service businesses
- License / credentials / insurance copy — regulated/licensed verticals
- Before/after results galleries — trades, barber/spa, and (consent-gated) dental/spa/fitness

The intake form's only vertical-specific section is the structured list (menu vs. products vs. services); the downstream copy-generation pipeline is identical across verticals, preserving the one-engine model.

## Most vs least common

- **Most common (owners have it, supply unaided):** exact NAP + hours, the raw service/menu list with prices, some usable photos (often already on their GBP), and pointers to existing review quotes.
- **Commonly missing but expected:** per-item menu/product detail (~40% of independent restaurants lack a machine-readable menu; ~44% have no site at all) _(provisional)_, per-service descriptions, about/owner story, real (non-stock) photography, credentials/trust copy, and SEO micro-content.
- **Item-level photos** are most common/expected in retail and cafe (the item is a product/dish), least common in barber/spa/auto/fitness (the item is a service). Real shops most often ship just name+price; descriptions, per-item photos, and tags are the missing tier.
- **Least common / rare:** dietary-allergen tags (optional, not legally required in Alberta), holiday-hours exceptions, multi-location pages, and pre-visit FAQ depth.

## What works vs what doesn't

**Universal:** publishing a price signal raises lead quality by self-qualifying prospects; withholding all price raises volume but lowers quality and conversion _(provisional)_. Real photos beat stock; quoted testimonials beat a bare star count; one canonical content source beats hand-typed NAP. Federal Competition Act caps fake reviews, partial/drip pricing, and untested "guaranteed results" everywhere.

**Per-vertical (where claims name verticals):**

- **Barber / spa:** full fixed itemized price list (+ per-line book CTA) that doubles as the booking page; service items carry name + price + **duration** + a 2–3 sentence selling description. Convert on a real results gallery (cuts, color, treatments) + stylist/team bios + interior atmosphere. Spa/barber results are client work (lighter consent than dental). Massage/RMT is **not** a regulated profession in Alberta (mid-2026) — trust comes from association membership (NHPC/CMMOTA/MTAA) + insurance-receipt eligibility, not a government licence.
- **Cafe:** fixed per-item prices in HTML (never PDF, never ranges); item = name + price + short description, photo/dietary tags optional. Real food photography is a direct revenue driver (photographed items 25%+ better conversion; ~44% more orders on delivery). Dietary/allergen tags are voluntary in Canada — ship as optional, not required.
- **Trades:** ranges/"starting at" + estimate CTA, never a checkout-style fixed price (a hard quote on unseen work isn't binding). Convert on owner/crew + branded-vehicle photos and real before/during/after project galleries (organized by type, with city+scope captions that double as local-SEO) on the homepage. Owner photo carries disproportionate trust (52% — highest tested — for in-home trades). Surface the trust cluster "licensed, bonded, insured, WCB-covered" (legal to operate that way; displaying it is the conversion payoff). Can prominently advertise workmanship guarantees.
- **Auto:** publish labor rate + short fixed menu + honest ranges + turnaround, with estimate CTA. **AMVIC** business licence is required and advertising must conspicuously show the licensed name (print/TV also state licence-holding); advertised prices must be **all-in** (all fees except GST). Surface "written estimate, warranty in writing, AMVIC-licensed" — strong, vertical-unique conversion play. Can advertise written warranties.
- **Law:** billing-model explainer + consultation CTA + optional fixed-fee lines. **Hard prohibitions:** no "specialist"/"expert" (no Alberta certification program), no superlatives ("best/top/leading"), no advertised settlement/verdict amounts or outcome guarantees; contingency copy must disclose disbursements-on-loss and fee %. Use "focuses on" / "extensive experience in." Substance content ("what to expect after a car accident in Alberta") is the compliant conversion lever, not result-boasting. ALIA indemnity is automatic, not a differentiator.
- **Dental:** ranges for high-ticket elective treatments + consult CTA _(provisional)_; routine/insurance work stays consultation-based. Registration with CDSA/CDHA required; advertising must be truthful, verifiable, no superlatives, no guarantees (mirrors the legal bar). Before/after photos require explicit, written, purpose-specific patient consent (Alberta PIPA; de-identification is insufficient) — default to clinic/staff/equipment imagery so a site can ship without patient photos. Premises/interior photography matters more than headshots for office-visited practices.
- **Retail:** per-item prices when transactional; per-item Product card minimum = name + image + price + priceCurrency (Merchant Center). Real product photography over manufacturer stock; thin pages (name + price + copied blurb, no alt text) are a common failure. Use `AggregateOffer` (lowPrice/highPrice) only for on-page variant ranges — not valid for merchant rich results.
- **Fitness:** convert on real facility + trainer/member imagery; transformation (before/after body) photos are PIPA personal information requiring written consent. No Alberta-mandated cancellation disclosure for in-gym memberships — transparent cancellation/contract terms are a trust choice.
- **Storefront/hybrid verticals** (barber, cafe, spa, dental, retail, fitness, sit-down auto/law): frame as "located at Y" — full address + map + `PostalAddress`. **Mobile/service-area** (mobile trades, mobile auto, home-visit): frame as "serves area X" — `areaServed` + named Calgary neighbourhoods in copy (realistic core areas, not exhaustive). On GBP specifically, hiding the SAB address often tanks visibility — flag to the client. JSON-LD must match visible page content; no schema-only padded service areas.

## Audit takeaways

- **Flag thin copy and missing trust blocks, not just structural presence.** Check for ~600–1,200 words of real body copy, a present About/owner-story block, and quoted (not just starred) testimonials — these are the highest-leverage gaps vs. a bare 12-item inventory _(copy-depth floor provisional)_.
- **Enforce one canonical content source.** No NAP/hours string typed twice — body, footer, and JSON-LD all derive from the `ShopContent` object; verify the click-to-call number matches the JSON-LD `telephone`, and that on-site NAP matches GBP exactly. Spend effort on real discrepancies (wrong digits, divergent name/phone, stale duplicate listings), not "St" vs. "Street."
- **Apply the per-vertical pricing default as the audit rule:** require a price signal everywhere, fixed itemized for barber/cafe/spa, ranges/"starting at" + estimate CTA for trades/dental/auto, billing-model explainer for law — and flag any hard fixed price on site-dependent work.
- **Check imagery is real, not stock/AI**, and that the MVP set (storefront + owner/team + interior/work) is present; flag stock heroes and missing owner photos. Before/after galleries (dental/spa/fitness) must be consent-gated.
- **Verify compliance content per vertical:** AMVIC name + all-in pricing (auto), no specialist/superlative/settlement claims (law), truthful/no-guarantee advertising (dental), genuine testimonials + all-in pricing (Competition Act, all verticals). Gate guarantee/warranty and awards slots by vertical — outcome guarantees are non-compliant for law/dental.
- **Design intake as generate-then-confirm, not request-then-wait.** Waiting on client content is the dominant cause of stalled projects. Collect only what the owner uniquely holds (confirm NAP+hours, raw service/menu list with prices, booking URL, real photos, 3–5 differentiator fragments, existing review quotes); AI-generate everything else (descriptions, taglines, headings, alt text, meta) and seed it into the owned CMS as the live, editable default.
