# Vertical Anatomy & Per-Vertical Must-Haves

Per-vertical conversion anatomy, trust signals, schema typing, and booking/media patterns for the nine local-shop verticals — what each must ship and how the audit should weight it.

## Per-vertical must-haves

### Barber

- **Primary conversion is online booking.** `bookingLink` is a primary action for barbers, and the single highest-value upgrade is an embedded online-booking **widget** (Fresha/Booksy/Square Appointments), not a bare link — 30-35% of salon/spa calls go unanswered and reminders cut no-shows up to ~50%. _(provisional)_
- **Schema type:** there is no `BarberShop` type — barbers emit `HairSalon` (parent `HealthAndBeautyBusiness`).
- **Meet-the-team with headshots + short bios** is conversion-strong (person-delivered service). _(provisional)_
- **Portfolio gallery slot** (recent cuts/fades/beard work, paired naturally with an Instagram feed) beats a single hero image — style demonstration, not clinical before/after. A paired before/after slot also applies in this portfolio sense. *(should-have)*
- Services-as-menu can be mirrored into `Service`/`OfferCatalog` JSON-LD (AI-readability, no rich result).

### Cafe

- **Booking/ordering is the primary action;** `bookingLink` (ordering/reservation) is primary, and online reservations lift website conversion ~19%.
- **Schema type:** `CafeOrCoffeeShop` (a `FoodEstablishment`) — the one vertical where content-specific markup is right: `hasMenu` → `Menu` → `hasMenuSection` → `hasMenuItem`, plus `servesCuisine` (both Google-recommended for food).
- `menuSchema` is meaningful **only** for cafe/restaurant — it is dead weight for the other eight and must be masked out of their scoring.
- **Per-menu-item photo slots are must-have**, not text-only: photographed items sell measurably more (~+30% on digital menus) and ~84% of diners want food photos before choosing.
- Interior/ambiance gallery slot is should-have (atmosphere is part of the product).

### Spa

- **Massage-offering spas: practitioner/RMT credential is a must-have, conversion-relevant signal.** In Calgary, paid massage requires a massage-practitioner licence (MTAA/NHPC/CRMTA in good standing) **or** a body-rub practitioner licence (min. 250 hrs); the facility is licensed separately. RMT designation also unlocks insurance direct-billing (a real conversion lever) — distinguish "massage therapy" from "body rub" clearly.
- **Before/after gallery is conversion-critical** (med-spa/cosmetic): on aesthetic sites it is the second-most-visited page after home — ship a dedicated paired before/after media slot.
- **Booking widget** is the single highest-value addition (shared with barber/dental/fitness). _(provisional)_ Jane App is the strongest Canadian booking option (brandable embed, ~CAD $54/mo+).
- **Schema type:** `DaySpa` or `BeautySalon` (`HealthAndBeautyBusiness`).
- **Caveat:** estheticians, nail techs and lash artists are **not** provincially licensed in Alberta — "licensed esthetician" is largely marketing. Lead instead with AHS personal-services facility approval + accredited training. *(should-have)*
- Team-bio + headshot slot and interior/ambiance gallery are supporting elements.

### Trades

- **"Licensed & insured" + WCB Alberta coverage are must-have trust lines.** Alberta.ca's official "Hiring a contractor" guidance tells homeowners to ask for the WCB number/clearance letter and an insurance certificate. "Licensed, insured & WCB-covered" is the canonical trades trust line. (Alberta has no single general-contractor licence — trade certs + municipal licence + insurance + WCB are the real signals.)
- **License numbers, certification/insurance badges, and OEM/affiliation logos** are conversion-critical visual trust proof — a dedicated credential/badge media slot (ideally license numbers linked to provincial verification).
- **Quote/estimate-request mechanism is a missing must-have** (alongside `clickToCall` as primary CTA): contractor sites convert ~10-15% of visitors who give contact info; online estimates let customers price before committing 24/7. _(provisional)_
- **Categorizable project/job gallery** (work by service type, before/after with location context) is conversion-critical visual proof of capability; gallery items should carry an optional location/caption field (doubles as "near me" local-SEO signal).
- `clickToCall` is the **primary** action (urgent/high-ticket, phone-driven). _(provisional)_
- **Schema:** a `HomeAndConstructionBusiness` subtype (Electrician/Plumber/HVACBusiness/GeneralContractor/RoofingContractor/HousePainter/Locksmith); emit `areaServed` (travels to customer) and `makesOffer`/`OfferCatalog`.

### Fitness

- **Primary headline CTA is a free-trial / intro-offer signup** ("30-day free trial", "free first class", "no credit card required") — the top-of-funnel entry; membership and per-class booking are secondary. The sale is a recurring membership, not a one-off transaction.
- **Embedded, bookable, live class schedule/timetable is the core conversion engine** — paste-in widgets from a fitness-management platform (Mindbody from ~USD $99/mo, Wodify from ~$79/mo, Glofox) render the class calendar, booking, payment and sign-up in-page. The class schedule + membership CTA is effectively mandatory.
- A class/schedule timetable is also a distinct should-have inventory item (detect timetable markup or known hosts: mindbody, vibefam, gymmaster, classfit, wodify).
- **Booking widget** is among the highest-value additions (studios report ~30% lift in lead conversion with integrated booking). _(provisional)_
- **Schema type:** `ExerciseGym` or `HealthClub` (`HealthClub` has dual parents `SportsActivityLocation` + `HealthAndBeautyBusiness`).
- **Trust signals are voluntary** — NCCA-accredited trainer certs (e.g. NASM-CPT) are the credibility marker but trainer certification isn't provincially regulated in Alberta. Surface via trainer bios + cert logos. A liability waiver/informed-consent process is operational (booking-flow intake), not a public badge. *(should-have)*
- Required anatomy: hero + free-trial CTA, embedded bookable timetable, membership/pricing packages, trainer profiles, results/testimonials + reviews, facility gallery, hours, location/map, FAQ, recurring-billing signup, `HealthClub`/`ExerciseGym` schema.

### Dental

- **Primary conversion is an online new-patient appointment *request* + click-to-call** — a request (not instant-confirm) because new-patient onboarding precedes scheduling.
- **Alberta Dental Association & College / CDSA registration is a must-have trust line**, and the regulator requires truthful, non-misleading marketing — no "best dentist"/specialty claims unless certified. Put a registration line in footer/about.
- **Consent-gated before/after gallery slot is a must-have** for cosmetic/ortho conversion — before/after photos and named testimonials require documented written patient consent (a compliance liability otherwise). The client populates it with consented images.
- **Booking widget** is one of the four highest-value additions — ~73% of dental bookings happen after hours when phones are unstaffed. _(provisional)_ Booking via PMS-synced platform: NexHealth (Direct Link or embed snippet, but ~USD $299-350+/mo — justified mainly for established practices) or, with better CAD fit, **Jane App** (~CAD $54/mo+). Default for our one-time-fee model: embed the client's existing PMS link or fall back to a simple appointment-request form.
- **Insurance-accepted / direct-billing block** is a high-impact, frequently-missing conversion signal (cost/coverage is the dominant patient concern). Canadian phrasing: "direct billing accepted" (Sun Life, Blue Cross, Canadian Dental Care Plan). *(should-have)*
- **New-patient + insurance intake** (digital forms: demographics, health history, consents, insurance card front/back upload) is a second conversion layer; must be mobile-responsive, aim for completion 24h pre-visit. *(should-have)*
- Team/doctor bios with headshots are conversion-critical (92% of healthcare seekers read a clinician bio before booking). _(provisional)_
- **Schema type:** `Dentist` (dual parent `LocalBusiness`/`MedicalBusiness` **and** `MedicalOrganization`), so it can carry `medicalSpecialty` (nice-to-have, AI-readability only) plus `priceRange`/`openingHours`.
- Required anatomy: hero + appointment-request CTA + click-to-call, services (general/cosmetic/emergency), new-patient info + insurance/financing, appointment-request form, intake form, team bios, reviews, hours, map, FAQ, `Dentist` schema. No e-commerce. _(provisional)_

### Law

- **Single primary action is a consultation / case-evaluation request** — a specific CTA ("Schedule a Free 15-Minute Case Evaluation"), not generic "Contact Us", backed by click-to-call. No e-commerce, no online transaction.
- **Capture-first pattern:** short contact/intake form + prominent click-to-call + "Free Consultation/Case Review" CTA repeated in sticky header and mid-page; scheduling is optional (intake/conflict-checking happens by phone). Maps to existing `contactForm` + `clickToCall` — no third-party embed needed for baseline.
- **Per-case-type practice-area pages** are the organizing structure (personal injury, immigration, estate, family) each with targeted, empathetic messaging and a practice-area-specific intake form; a single "we handle everything" page underperforms. These are the highest-value structural element — well-placed CTAs on them can lift conversions ~25%+. _(provisional)_
- **Law Society of Alberta membership is the foundational trust credential**; the Code of Conduct (Ch. 4) requires all marketing be demonstrably true, accurate, verifiable.
- **Prohibited language:** avoid "specialist"/"expert" (no Alberta specialist certification), superlatives ("best"/"top"/"leading"), and advertised settlement/verdict amounts; use "focuses on" / "extensive experience in". A "past results do not guarantee future outcomes" disclaimer is required wherever outcomes are referenced.
- Short intake forms (contact, issue type, brief description) convert better; deeper intake follows the booked consult. *(should-have)*
- **Photography emphasis is team/attorney headshots** (consistent across the roster) — no before/after or product/menu galleries; de-prioritize gallery slots. Team-bio + headshot slot is must-have. _(provisional)_
- Optional self-serve booking: Calendly embeds free on any plan (inline/popup/link), and its event-type intake questions double as a lightweight intake form. *(nice-to-have)*
- **Schema type:** `Attorney` or `LegalService`; emit `areaServed` and `makesOffer`/`OfferCatalog`.
- Required anatomy: home with single consult CTA, per-case practice-area pages, attorney bios + credentials/bar memberships, results/testimonials, short intake form, contact + click-to-call, `LegalService`/`Attorney` schema. _(provisional)_

### Auto

- **Dual primary conversion:** a dominant above-the-fold "Schedule Service" CTA **and** a quote/estimate request, both backed by sticky click-to-call. Booking is dominant; the estimate request is the auto-specific second path. Online booking should aim for <5 clicks.
- **The homepage must instantly answer three questions:** "Can you fix my problem?" (services + makes serviced), "Can I trust you?" (real shop/team photos, reviews, certifications, warranties), "How do I book?" (dominant CTA).
- **AMVIC business licence is mandatory by law** — display the AMVIC licence number as a must-have trust signal. Technician trade certification (Automotive Service Technician, optionally **Red Seal** — the Canadian ASE equivalent; don't market US "ASE") is the credibility signal. *(should-have)*
- **License numbers, certification/insurance badges, OEM/affiliation logos** are conversion-critical visual proof — a dedicated credential/badge slot.
- **Quote/estimate-request mechanism is a missing must-have** alongside `clickToCall` (price before committing, 24/7). _(provisional)_
- **Categorizable project/job gallery** (before/after with location context) is conversion-critical visual proof; gallery items should support an optional location/caption field (local-SEO signal).
- Warranty (e.g. nationwide parts-and-labour) + financing are high-impact conversion signals. Transparent service menu with pricing maps to the existing Services component. *(should-have)*
- `clickToCall` is a **primary** action (urgent/high-ticket). _(provisional)_ Booking via capacity-aware tools (AutoOps ~USD $100/mo, Shopmonkey) or a Reserve-with-Google link; default ships a quote form + click-to-call with an optional embed slot.
- **Schema type:** `AutoRepair` (parent `AutomotiveBusiness`); emit `areaServed` (mobile mechanics) and `makesOffer`/`OfferCatalog`.
- Required anatomy: hero + Schedule/Call CTA + credibility subhead, services-with-pricing, makes serviced, quote-request form, booking form, certifications/warranties, real shop photos, reviews, NAP + map/directions, service-area strip, FAQ, coupon/offer near CTA, `AutoRepair` schema.

### Retail

- **Schema type:** `Store`. `menuSchema` and booking are masked out; primary signals are reviews + address/map + click-to-call.
- **Real per-product image slots** should be the default in the product showcase (authentic product photos build trust and drive the buy/visit decision) — should-have, since catalog-as-foot-traffic sites can convert on a curated subset. Product/Offer schema fields (price/availability/condition) still need separate auto-update handling.

## Cross-vertical patterns

- **Primary CTA divergence:** across law/dental/auto/fitness the primary action is a **lead/request or recurring-relationship** action — consultation request (law), new-patient appointment request + intake (dental), appointment + estimate (auto), free-trial→membership (fitness) — **not** a one-off transactional booking/order like barber/cafe/spa. The audit's `bookingLink` item is too narrow; generalize it to "primary conversion action" (consultation/appointment/estimate/trial) plus an intake-form item for dental/law.
- **Two-layer trust model:** a *governing-credential / table-stakes-legitimacy* slot (auto=AMVIC, law=Law Society, dental=ADA&C/CDSA, trades=WCB+insurance, massage=Calgary practitioner licence) plus a *conversion-proof* slot (reviews, insurance-accepted/direct-billing, warranty, consented before/after). Esthetics and fitness have **no** governing licence — their signals are voluntary certifications. Regulated verticals (law strongest, dental next) also carry advertising-content constraints.
- **Reviews are the universal top trust signal**, outweighing credential badges: 93% read reviews before purchasing, 92% require ≥4 stars; 4.2-4.5 stars converts better than a "fake-looking" perfect 5.0. Weight highest for dental/law/spa/auto.
- **Use only 3-5 relevant credential badges** — a single "credentials" band per vertical, not a wall of logos (overuse cuts trust). *(should-have)*
- **Authentic (non-stock) photography of the real business/team/work** out-converts stock everywhere and is the baseline expectation — default all media slots to client-supplied photos. Media-slot allocation is vertical-specific: before/after for spa/dental/auto/barber, food photos for cafe, project galleries for trades/auto, headshots for law/dental, interior/ambiance for cafe/spa/fitness/dental.
- **Team-bio + headshot** is conversion-critical for person-delivered services (dental, law) and strong for fitness/barber/spa; lower priority for trades/auto/retail. _(provisional)_
- **`clickToCall` is the primary action** for high-intent urgent verticals (trades, auto, dental, law); lower relative weight for retail/cafe. _(provisional)_ `hours` and address/map are universal must-haves for any physical location.
- **Schema reality check:** emit the **most specific** LocalBusiness subtype (Google's explicit recommendation). Any valid subtype unlocks only one rich result — the knowledge-panel business details — needing just name + address. `priceRange` is recommended everywhere. Self-authored review/`aggregateRating` markup does **not** earn a SERP review snippet (Google ignores self-serving reviews; stars come from GBP). FAQ rich results are **dead** (deprecated; stopped appearing May 2026) — keep FAQ for UX/AI only. Event schema can't express recurring class schedules, so a fitness class-schedule rich result isn't practical. Structured data doesn't directly affect rankings — it's a display + AI-citation (AEO/GEO) play. Net engine knob: **one per-vertical `@type` string** plus conditional `priceRange` (all) / `servesCuisine`+`hasMenu` (cafe) / `areaServed` (trades/auto/law) / `makesOffer` (service verticals) / `medicalSpecialty` (dental).
- **Embed mechanism collapses to three static-site primitives:** (a) JS/snippet widget rendered in-page (Mindbody/Wodify/NexHealth button, Calendly), (b) hosted booking link/button (NexHealth Direct Link, AutoOps, Reserve-with-Google — free), or (c) a plain HTML form (law intake, auto quote). None need a backend → all fit Astro static via a content-configurable `BookingEmbed` slot.

## Audit takeaways

- **Mask non-applicable items and add hard gates.** Replace the flat 12-item average with (a) a vertical applicability mask — `menuSchema` only scores for cafe (a current rubric bug caps perfect barber/spa/etc. sites) — and (b) per-vertical weights with two universal pass/fail gates: **`https`** and **`mobileViewport`**. _(provisional — rests on the https/mobileViewport/scoring claims.)_
- **Generalize `bookingLink` to "primary conversion action"** per vertical, and detect the higher-value **embedded booking widget** (iframe/script to fresha, booksy, squareup, calendly, setmore, simplybook, mindbody, acuityscheduling, vibefam, gymmaster, classfit, wodify) as distinct from a bare link — the strongest per-vertical scoring upgrade for barber/spa/dental/fitness. _(provisional)_
- **Add vertical-specific inventory items:** quote/estimate form (trades/auto, weight alongside click-to-call), insurance-accepted/direct-billing block (dental), class-schedule timetable (fitness), and practice-area pages + intake form (law). Tighten `contactForm` to distinguish a lead/intake/quote form from a newsletter signup, and weight it per vertical (high for law; low for cafe/barber/retail). _(provisional in part — booking-widget, quote-form, and practice-area items rest on provisional claims.)_
- **Weight reviews and click-to-call by vertical:** reviews highest for dental/law/spa/auto; click-to-call as the primary CTA for trades/auto/dental/law. Keep `localBusinessJsonLd`, `ogTags`, and `favicon` as low-weight polish that never gates a grade.
- **Emit the correct per-vertical `@type`** and the small conditional property map; do not inject self-authored `aggregateRating`, and stop treating FAQ markup as a rich-result win.
- **Flag media gaps as concrete, vertical-correct findings:** missing before/after (spa/dental/auto/barber), text-only menu without food photos (cafe), no categorized project gallery (trades/auto), stock instead of real team headshots (law/dental), and stock instead of authentic business photography (all).
