# Local SEO & Discovery — Audit Briefing

What a build-and-handoff shop site can and cannot move on Google's local pack, local-organic, and AI "near me" results — and the schema/NAP/review/booking facts the audit should grade against.

## Necessary (must / should-have)

Lead with the high-impact, must-have foundations:

- **Know the ceiling.** On-page/website signals are only ~15% of the local *pack* (GBP ~32%, reviews ~20% dominate), but the LARGEST category (~33%) of local *organic* results — so the website's honest ROI is "near me" / city+service organic ranking, not the 3-pack. Proximity is fixed by the GBP address and the site contributes zero to it.
- **Ship exact-match, crawlable NAP.** Name/Address/Phone must be real text (footer + contact section), byte-identical to GBP, and mirrored into LocalBusiness JSON-LD — never baked into an image. This is the one piece of the citation ecosystem we fully control and ship in every site. Consistent NAP is associated with ~40% higher odds of appearing in the local pack and is a must-have, though it is foundational table-stakes (~6–9% direct weight), not a rank-climbing lever. NAP consistency across Google/Apple/Bing/Canadian directories is a must-have foundation _(provisional)_.
- **Ship policy-safe LocalBusiness JSON-LD.** Required properties are only `name` + `address` (full `PostalAddress`); everything else is recommended-but-quality-raising. Use the most-specific subtype per vertical, structure the address (`Calgary`/`AB`/`CA`), and emit `geo` (≥5dp), `telephone` (+1-403 E.164), `url`, and `openingHoursSpecification`.
- **Hard guardrail — never self-markup reviews.** Self-applied `aggregateRating`/`review` about your own business is ineligible for star rich results AND risks a "spammy structured data" manual action that can strip all rich snippets site-wide. This includes embedded Google/Facebook review widgets supplying ratings. On-page star *display* is fine; marking it up as self-`aggregateRating` is the single biggest correctness defect.
- **Set review expectations at handoff.** Reviews are the 3rd-largest pack category (~16–20%, growing) and materially move rank, but they are a GBP/ongoing-operations signal the static site cannot generate. Recency/velocity outweigh lifetime count, and signals decay if inflow stops _(provisional)_. Hand off an owner-runnable review-request flow (Google short link + QR + SMS/email templates); ask ALL customers unconditionally.
- **Booking CTA every appointment vertical.** A free GBP appointment link (customer leaves Google to your booking page) is universally available in Canada and is the safe default booking CTA for barber/spa/fitness/dental/auto.
- **Title/H1 service + city.** Templating "<service> in Calgary" / quadrant + community into title tags and H1/H2 is a cheap, fully-controllable, zero-maintenance on-page win.

## Niche / situational

- **Multi-page IA is a tier-up, not a default.** Single page suffices for one location + one primary city. Break the single-page rule only when (a) multiple physical locations, or (b) a service-area business genuinely serving multiple distinct cities/suburbs. Each location/service-area page must be genuinely unique (~40–60% unique content) or it is a doorway page; cap service-area pages at real priority zones (~3–6 suburbs, not a programmatic city matrix).
- **Vertical schema add-ons.** `hasMenu`/`servesCuisine`/`acceptsReservations` for cafe; `areaServed` for trades; `hasOfferCatalog`/`makesOffer` for service-menu verticals (nice-to-have entity enrichment, not a rich-result trigger). `priceRange` ($–$$$$, <100 chars) is meaningful for cafe/spa/retail/auto, low-signal for dental/law.
- **Nice-to-have enrichers:** `hasMap` (Google Maps URL), `sameAs` (GBP/Facebook/Instagram/Yelp for entity reconciliation), special/holiday hours via `validFrom`/`validThrough`.
- **Off-site / out of scope:** third-party citation consistency (~6% pack), paid data-aggregator subscriptions (Data Axle/Foursquare cover Canada but are recurring; Localeze is US-only) — name as client tasks, never sell as one-time work.
- **English-only** is the correct Calgary default; no Alberta bilingual obligation — reallocate effort to reviews/NAP/geo.
- **Legitimate review schema** only applies to Products/Services the business sells (third-party reviewed) — relevant to retail product pages or per-service pages, not a single-page brochure.

## Always reused vs rare

**Always reused (ships in every build):**
- Crawlable text NAP + click-to-call `tel:` + visible hours.
- LocalBusiness JSON-LD with name/address/geo/telephone/url/openingHoursSpecification, NO self-`aggregateRating`.
- Most-specific `@type` per vertical; Calgary `AB`/`CA` structured address.
- Booking/appointment-link CTA; on-page reviews display linking out to the GBP/Yelp profile.
- Calgary quadrant (NW/NE/SW/SE) + community geo-targeting in titles/headings/copy/schema.

**Rare (specific triggers only):**
- Multi-location / multi-suburb page sets and per-location LocalBusiness schema (multi-location or multi-city SAB only).
- `areaServed` + hidden GBP address (pure service-area trades only).
- Food-menu schema and Reserve-with-Google native buttons (cafe/dining only).
- Retail free local listings / local inventory feed (retail only).
- Special/holiday hours; legitimate product/service review schema.

## Most vs least common

**Most common in the wild:** visible hours, address/map presence, and a click-to-call link are commonly present. Chasing citation VOLUME is a common (low-impact) practitioner habit to avoid.

**Common but missing (the differentiator gaps):** LocalBusiness JSON-LD at all, structured `openingHoursSpecification` vs a cosmetic table, specific `@type` subtypes, structured `PostalAddress`, `areaServed` for trades, the tier-1 Canadian citation core (GBP, Bing Places, Apple Business Connect, Yelp.ca, Facebook, YellowPages.ca, Canada411, 411.ca), per-location pages/schema, and Calgary quadrant/community targeting. Most prospect sites lack these — concrete outreach hooks.

**Least common / rare:** self-`aggregateRating` (a defect when present), holiday-hours schema, retail inventory feeds, and legitimate product-review schema.

## What works vs what doesn't

**Works (universal):** GBP completeness + correct primary category + steady recent reviews are the highest-leverage 2025 levers, outweighing citation count and proximity. A fast, mobile, conversion-complete static site (CWV LCP<2.5s/INP<200ms/CLS<0.1, click-to-call, booking) converts GBP traffic and feeds the ~9% behavioral category _(provisional)_. Structured NAP/hours/services also drive AI "near me" citation, since LLMs use structured data, not live geo _(provisional)_.

**Doesn't work / banned:** review GATING (routing happy customers to Google, diverting unhappy ones) violates Google policy AND the FTC 2024 fake-review rule (~$51,744/violation) — ask everyone unconditionally; incentivizing reviews is likewise banned. Keyword-stuffing review text produced flat/worse rankings in controlled tests. Citation-volume blasts don't move rankings for a small shop. PDF-only menus/price lists are crawler- and LLM-invisible (ship HTML lists with prices). Self-`aggregateRating` shows no stars and risks a penalty.

**Per-vertical notes:**
- **Trades:** service-area default — HIDE the GBP street address (showing a non-visitable address violates guidelines), use `areaServed` + specific `@type` (Plumber/Electrician/HVACBusiness). Hiding the pin weakens proximity, so compensate with reviews, NAP-consistent citations (HomeStars/BBB), and unique service+city landing pages. Schema relative importance is HIGHER here.
- **Cafe:** `CafeOrCoffeeShop` (`Restaurant` if full-service), `FoodEstablishment` props (`hasMenu` URL > inline, `servesCuisine`, `acceptsReservations`). OpenTable Reserve-with-Google native "Reserve a table" button is live in Canada; low-volume cafes can use a plain booking/menu link.
- **Dental:** `@type` `Dentist` (both MedicalBusiness + LocalBusiness); storefront — keep visible address. No YMYL exemption from the self-review prohibition. Native "Book Now" achievable via PM providers (e.g., NexHealth); secondary review platforms RateMDs/Healthgrades.
- **Law:** `@type` `LegalService` (NOT `Attorney`, which is an individual). Storefront — visible address.
- **Auto:** `AutoRepair`; storefront — visible address. NOT a native Reserve-with-Google vertical — default to GBP completeness + click-to-call + quote/appointment-request form + quadrant targeting _(provisional)_.
- **Barber/spa/fitness:** `HairSalon` (no BarberShop type exists) / `DaySpa` / `HealthClub` or `ExerciseGym`; storefront — visible address. Beauty/wellness native Reserve-with-Google is NOT live in Canada, so the realistic default is a Square/Mindbody booking-link CTA, not an in-Google button.
- **Retail:** `Store` subtype; free Google local listings + local inventory app are available in Canada (build default) — pairs with Product+Offer schema.

## Audit takeaways

- **Decompose `localBusinessJsonLd` from binary to quality-graded:** specific subtype vs generic, structured `PostalAddress`, presence of `geo` + `openingHoursSpecification`, and — critically — FAIL/warn on self-serving `aggregateRating`/`review` rather than crediting it. The narrow `@type` regex misses Dentist/LegalService/AutoRepair/HealthClub/DaySpa/Plumber etc., systematically false-negativing dental/law/trades/auto/spa/fitness — fix to resolve `@type` against the LocalBusiness subtype tree.
- **Split hours and address/map checks by quality:** `hoursVisible` (text) vs `hoursStructured` (`openingHoursSpecification`); separate crawlable postal-address text (Alberta `T#X #X#` + `AB`) from a maps iframe embed from a map-image-only false pass. Grade structured/crawlable higher for local + AI discovery.
- **Repurpose the menu check** to "crawlable menu/service list with prices" = `menu`/`hasMenu` URL OR inline Menu schema OR a visible HTML list — only against food verticals; flag PDF-only menus as not crawlable. `clickToCall` is good UX but isn't evidence the phone is crawlable NAP — add a separate visible-phone-as-NAP check.
- **Note the on-page audit's blind spot:** it inspects the site in isolation and cannot verify site NAP matches GBP — the highest-leverage NAP failure mode. Flag NAP-consistency as a manual/GBP-API follow-up, not implied by a green check _(provisional)_.
- **Frame scope and expectations honestly:** sell consistent on-site NAP + quality JSON-LD + GBP claim/Bing import/Apple Business Connect + tier-1 Canadian + 2–4 vertical directories + an owner-run review flow as the one-time deliverable; explicitly decline recurring citation-volume/aggregator retainers. Promise local-organic gains, not proximity-driven 3-pack jumps.
