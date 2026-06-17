# Local SEO & Discovery — Audit Knowledge Base

How a build-and-handoff Calgary shop site contributes to (and is limited within) local discovery: GBP, NAP consistency, the local pack, LocalBusiness schema, reviews, citations, and AI-search visibility.

## Necessary (must / should-have)

**The ranking-weight ceiling (verified, high-impact).** In the most-cited local ranking survey (Whitespark/BrightLocal 2025), Google Business Profile (~32%) and reviews (~20%) dominate the *local pack*, while on-page/website signals are only ~15%. Proximity to the searcher is a dominant, fixed factor set by the GBP address that no website change can alter. The honest reframe: the website's real leverage is in *local organic* ("near me", city+service queries) where on-page is the LARGEST category (~33%, plus links ~24%, GBP drops to ~7%). Frame client expectations accordingly — the site reinforces the pack indirectly and wins local organic directly.

**NAP as crawlable text (verified, high-impact).** Exact-match Name/Address/Phone must render as real text (footer + contact), never inside an image, and must mirror the GBP listing and the LocalBusiness JSON-LD byte-for-byte. This is the one piece of the citation ecosystem fully controlled at build time and shipped in every site. Consistent NAP is associated with materially higher local-pack appearance _(provisional)_ and inconsistent contact data erodes consumer trust/conversion _(provisional)_. Treat NAP as foundational table-stakes (citation signals are only ~6–9% weight), not a rank-climbing lever.

**LocalBusiness JSON-LD, done correctly (mixed, high-impact).** Schema requires only `name` + `address`; everything else (geo, telephone, hours, priceRange) is recommended but "the more properties, the higher quality the result" _(provisional)_. Most prospect sites lack JSON-LD entirely (common-but-missing) — a concrete differentiator. The single biggest correctness fix: **never emit self-serving `aggregateRating`/`review` for the business itself** — Google has made self-controlled review markup (including embedded GBP/Facebook review widgets) ineligible for star rich results since 2019, and mismatched/fake values risk a site-wide "spammy structured data" manual penalty (verified). On-page star display is fine; marking it up as self-`aggregateRating` is not.

**Reviews — acquisition, not just display (verified, high-impact).** Review signals are the ~16–20% local-pack category and rising. Practical levers, all owner-runnable and fitting the no-retainer model:
- Getting a business from 0–9 to ~10+ reviews is the high-leverage milestone; above that, count shows diminishing returns (verified).
- Velocity and recency outweigh lifetime count; rankings can decline if inflow stalls — set up an *ongoing* request habit, not a one-time burst (verified).
- Star rating gates conversion sharply: a large majority of consumers only use 4.0+ businesses, so protecting rating matters as much as count (verified).
- The most effective CTA is a direct Google review short link (`g.page`) via SMS ~1–2h post-service (95%+ open), post-service email, and an in-store QR with the plain URL printed alongside (verified).

**GBP address posture by business model (verified, high-impact).** Pure service-area businesses (staff travel to customer — most trades) MUST hide the street address in GBP and define service areas; showing a non-visitable address violates Google guidelines. Storefront/hybrid businesses customers can visit (auto, spa, fitness, law, dental, barber, cafe, retail) MUST keep a visible, accurate address. Of the target verticals, only trades are SAB-default.

**Single-page vs multi-page decision rule (verified, high-impact).** A single page suffices for exactly one customer-facing location in one primary city. A small multi-page local-SEO IA is structurally *required* when (a) there are multiple physical locations, or (b) a SAB genuinely serves multiple distinct cities/suburbs. Most single-shop Calgary clients stay single-page.

**Other should-haves (verified):** Service+city in title tags and H1/H2 (e.g. "Barber in Calgary") is a cheap one-time on-page win. Behavioral signals (~9%) — calls, clicks, direction requests — are improved indirectly by a fast, mobile-first, conversion-complete static site _(provisional)_. Responding to reviews within 24–48h is a free dual rank+trust lever. Claim/clean GBP first, then import to Bing Places (auto-sync), then Apple Business Connect, then Yelp.ca/YellowPages/Facebook.

## Niche / situational

- **Schema sub-type per vertical** _(provisional)_: use the most-specific LocalBusiness subtype, not generic `LocalBusiness` (must-have, common-but-missing). barber → `HairSalon` (no `BarberShop` type exists); cafe → `CafeOrCoffeeShop`; spa → `DaySpa`; fitness → `HealthClub`/`ExerciseGym`; dental → `Dentist`; auto → `AutoRepair`; retail → `Store`/subtype; **law → `LegalService` (NOT `Attorney`)**; trades → the specific `HomeAndConstructionBusiness` subtype (`Plumber`, `Electrician`, `HVACBusiness`, etc.). Make `@type` a per-shop content field.
- **Service-area schema/copy** _(provisional)_: trades (SAB) emit `areaServed` and may omit the public address; storefronts keep `PostalAddress` + `geo`. Hybrids (e.g. auto shop with mobile service) can carry both.
- **Service / city / location pages** (verified): multi-service verticals (trades, dental, law, auto) raise the local-organic ceiling with one page per service; SABs serving multiple suburbs need genuinely unique city pages (~40–60% unique content) — duplicate "swap the city name" pages are doorway pages and get filtered/penalized. Cap at genuine priority zones (~3–6 suburbs for a Calgary trades client, not a programmatic matrix).
- **Food-specific schema (cafe)** _(provisional)_: `hasMenu` (URL, not just inline), `servesCuisine`, `acceptsReservations`; prefer a crawlable HTML menu over a PDF-only menu (an AI-search/SEO anti-pattern).
- **Vertical directories** _(provisional)_: pick 2–4 relevant ones at launch — restaurant/cafe: TripAdvisor/OpenTable/Zomato; dental: RateMDs/Healthgrades; trades: HomeStars/BBB; auto: CarGurus; etc.
- **Calgary geo-targeting** _(provisional)_: wire quadrant (NW/NE/SW/SE) and named community (Kensington, Beltline, Inglewood) into titles, headings, NAP copy, and schema — more distinctive than generic "near me".
- **English-only default** _(provisional)_: no bilingual requirement for Alberta private businesses; skip the overhead, reallocate to reviews/NAP/geo.
- **Retail free local listings** _(provisional)_: Google's free local listings + local inventory app are live in Canada — a retail-template default.
- **Legit product/service review schema** (verified): `aggregateRating` CAN earn stars when about specific Products/Services (retail product pages, some menus), not the business as a whole.

## Always reused vs rare

**Always reused (every site, every vertical):**
- The ~15% on-page ceiling and proximity-is-fixed framing (always-present).
- Crawlable NAP text + matching JSON-LD (always-present).
- Reviews weight as a ranking category (always-present).
- Storefront address-visible posture (always-present for the visitable verticals).
- English-only default _(provisional, always-present)_.

**Rare / out-of-scope situational:**
- Citation *volume* management, paid aggregator subscriptions (Data Axle/Foursquare cover Canada; Localeze is US-only) — explicitly out of the one-time model.
- `priceRange`, `hasMap`, `sameAs`, `makesOffer`/`hasOfferCatalog`, special/holiday hours — cheap nice-to-haves, not defaults.
- AI-search citation weight (~13%, rising) _(provisional)_ — supports clean NAP + schema, not a volume program.
- Multi-location/SAB JSON-LD `areaServed` mode — rare, only when the decision rule triggers a tier-up.

## Most vs least common

**Most common (always-present / common):** the ranking-weight reality; NAP-as-text; service+city title tags; review velocity/recency/rating dynamics; the review short-link CTA; storefront address visibility; GBP→Bing→Apple claim sequence; review-response habit.

**Common-but-missing (the differentiators — prospects routinely lack these):** LocalBusiness JSON-LD at all; the correct most-specific `@type`; structured `openingHoursSpecification` (vs a visual-only hours table); dedicated service/location pages; vertical-specific directory listings; Calgary quadrant/community geo-targeting; retail free local listings; the barber/spa booking-link correction below.

**Rare:** citation-volume chasing (low-impact, the work *not* to sell); aggregator subscriptions; `sameAs`/`hasMap`/`priceRange`/`hasOfferCatalog`; special-hours schema; product/service review stars.

## What works vs what doesn't

**Works:**
- Shipping crawlable NAP + a correct, policy-safe LocalBusiness JSON-LD with `geo` (≥5 decimal places) _(provisional)_, E.164-style `+1-403…` phone _(provisional)_, structured `openingHoursSpecification` _(provisional)_, `addressCountry: "CA"`, `addressRegion: "AB"`.
- Driving 0→10 reviews, then steady recent inflow, via the free `g.page` short-link CTA (SMS/email/QR).
- A fast static site converting GBP traffic (click-to-call, booking) to feed behavioral signals _(provisional)_.
- Live, async/lazy-loaded, height-reserved GBP review widgets for fresh on-site social proof (verified) — but they earn no rich-snippet stars and don't replace off-site review acquisition.

**Doesn't work / prohibited:**
- Self-`aggregateRating`/review markup for the business — ineligible for stars, penalty surface (verified). The audit's `localBusinessJsonLd` check should *flag* a self-review block as a defect, not credit it.
- Review *gating* (routing happy customers to Google, diverting unhappy to private forms) — violates Google policy AND the FTC 2024 fake-review rule (penalties up to ~$51,744/violation); CTA flows must ask ALL customers unconditionally (verified). Incentivizing reviews is likewise banned.
- Keyword-stuffing review text to rank — a controlled test produced flat/worse results (verified).
- Chasing citation volume / hundreds of low-DA directories — the classic retainer that doesn't move rank for a small shop (verified-leaning) _(provisional)_.
- PDF-only menus/price lists — invisible to crawlers and LLMs _(provisional)_.

**Per-vertical notes:**
- **Trades** (SAB): hide GBP address; emphasize `areaServed` schema, reviews, citations, and unique service-area (suburb) pages — proximity is weak, so on-site/off-site work does more proportional lifting. Use a `Plumber`/`Electrician`/`HVACBusiness` `@type`. Booking default is GBP appointment link / click-to-call + quote form.
- **Barber & spa**: Reserve-with-Google for beauty & wellness is **US-only**, Canada on the 2026 roadmap — so the build default is a plain GBP appointment *link* to Booksy/Fresha/Square, NOT a native in-listing Book button _(provisional)_. This is the most important Calgary-specific correction vs generic US advice.
- **Cafe**: `CafeOrCoffeeShop` (or `Restaurant`) `@type`, `hasMenu`/`servesCuisine`/`acceptsReservations`, crawlable HTML menu; OpenTable's Reserve-with-Google IS live in Canada for reservations-taking dining _(provisional)_.
- **Dental**: `Dentist` `@type` (also a MedicalBusiness — keep LocalBusiness fields); native GBP Book Now achievable via PM vendors like NexHealth _(provisional)_; no review-policy exemption for health (YMYL scrutiny).
- **Fitness**: `HealthClub`/`ExerciseGym`; class booking via Mindbody/Square; default to a "Book a class" link, native Google class booking as an upgrade _(provisional)_.
- **Auto**: NOT a native Reserve-with-Google appointment vertical _(provisional)_; default to GBP completeness + click-to-call + quote/appointment-request form + quadrant geo-targeting. `AutoRepair` `@type`.
- **Retail**: `Store`/subtype; Google free local listings + local inventory app (Canada-eligible) _(provisional)_; product `Review`/`Offer` schema is legitimate on product pages.
- **Law**: `LegalService` `@type` (not `Attorney`); multi-service pages raise the organic ceiling; lean on provincial Law Society listings over US-leaning Avvo _(provisional)_.

## Audit takeaways

- **Make `localBusinessJsonLd` quality-graded, not binary.** Decompose into: specific subtype vs generic `LocalBusiness`; structured `PostalAddress` present; `geo` + `openingHoursSpecification` present; and an explicit FAIL/WARN if self-serving `aggregateRating`/`review` is detected. A bare name+address stub or a self-review block should not earn a green check _(provisional)_.
- **Fix the schema detector's blind spots** _(provisional)_: the current `@type` regex misses `Dentist`, `LegalService`, `AutoRepair`, `HealthClub`, `DaySpa`, `Plumber`, etc. — match `LocalBusiness` plus its subtype allowlist (or parse JSON-LD). Likewise split `menuSchema` to credit a crawlable HTML menu/service list with prices (not just inline `Menu`), and flag PDF-only menus.
- **Split "hours" and "address/map" into structured vs cosmetic** _(provisional)_: grade `openingHoursSpecification` and crawlable postal-address text (Alberta `T#X #X#` + "AB") above a visual-only table or a map link/image. The current text/regex checks over-credit cosmetic signals.
- **Flag NAP presence vs NAP consistency as different things** _(provisional)_: an on-page audit can only assert NAP is present and crawlable, not that it matches GBP/citations — surface GBP cross-check as a manual follow-up, not an implied green check.
- **Score reviews as acquisition, not decoration:** check for a review-request CTA / Google short link, not just a testimonials block — and treat review *recency/velocity* and a 4.0+ rating as outreach talking points. The website cannot generate the ~20% review signal; the handoff sets up the owner to.
- **Tier the build by location model:** detect single-location-one-city (single-page OK) vs multi-location or multi-suburb SAB (multi-page IA required, with unique city pages and per-location schema/GBP cross-linking).
