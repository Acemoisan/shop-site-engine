# Audit Foundation — Master Summary

This is the cross-dimension synthesis behind the Studio0rbit website audit. It distills eight per-dimension briefings — performance, local SEO, visual/brand, content/IA, conversion/UX, trust/compliance, accessibility, and per-vertical anatomy — into one working reference: what every Calgary local-shop site needs, what only some need, what recurs vs. what's a one-off, and where our audit should put its weight. Where a point rests mainly on not-yet-verified findings, it is tagged _(provisional)_; the trust, conversion, content, a11y, and vertical dimensions are provisional in their entirety, so treat magnitudes there as directional and structural principles as robust.

## 1. Necessary on every local-shop site

The universal floor — these appear as must-haves across multiple dimensions and should anchor the rubric:

- **HTTPS, by default.** Hard trust gate; plain-HTTP wears a "Not Secure" label now and a full-page interstitial from ~Oct 2026. Already the highest-yield single check (trust); near pass/fail, never 1/12 of an average (vertical).
- **Crawlable NAP + hours, from one canonical source.** Name/Address/Phone and hours must render as real text (footer + contact), feed the LocalBusiness JSON-LD byte-for-byte, and mirror the Google Business Profile. This is the single most-shared fact across local SEO, content, trust, and conversion. Accuracy is load-bearing: 62% avoid a business after finding wrong info; "openness" is a Google ranking factor.
- **Real `tel:` click-to-call (E.164 href), above the fold.** Universal, and PRIMARY for high-intent verticals (trades, auto, dental, law). Plain-text/image numbers forfeit the call — a top-ROI defect.
- **A single dominant primary CTA in the first viewport**, mapped to the vertical's macro-conversion, with secondaries de-emphasized. ~70% of small-business homepages lack a clear above-fold CTA.
- **Real social proof near the decision point.** Star rating + specific review count + named/photo testimonials, co-located with the CTA — not isolated in a footer or separate page. Reviews are the universal top trust signal across trust, conversion, and vertical dimensions.
- **Correct, policy-safe LocalBusiness JSON-LD** with the most-specific subtype, structured `PostalAddress`, `geo`, and `openingHoursSpecification` — and **never** a self-serving `aggregateRating`/`review` block (ineligible for stars since 2019; penalty surface).
- **Real, business-specific photography** (storefront/exterior + owner/team + interior/work shot), not stock. The owner/team photo is the highest-trust single asset; this is the strongest visual differentiator and a content/trust/visual triple-point.
- **Mobile-first, responsive, fast.** ~59–60% of sessions are mobile; up to ~88% of "near me" searches are mobile. Slow/broken mobile makes every CTA effectively invisible — perf is a conversion blocker, not just an SEO metric.
- **Performance: LCP-first.** The hero is almost always the LCP element; ship it eager + `fetchpriority="high"` (never lazy), modern format + `srcset`, explicit dimensions on all images/iframes (CLS), self-hosted preloaded fonts. Grade on CrUX p75 (LCP≤2.5s/INP≤200ms/CLS≤0.1) when present, else lab-only with the worst-case caveat.
- **Accessibility "top six," eliminated by construction:** AA color contrast (≥4.5:1 / ≥3:1), image alt, form labels, accessible names on icon-only links/buttons, document `lang`, and a visible focus ring. ~96% of auto-detectable failures live here; a clean build is a real differentiator. _(provisional)_
- **A short, low-friction form** (3-field minimum, optional phone, correct mobile input attributes) — wherever a form ships at all.
- **A footer-linked privacy policy whenever a data-collection surface exists** (form OR booking link). Static hosts ship PII to US endpoints, triggering Alberta PIPA disclosure. "Form present + no privacy policy" is the most defensible compliance finding for Calgary outreach. _(provisional)_
- **Service + city in titles / H1-H2** ("Barber in Calgary") — the cheap, always-applicable on-page win.
- **Copy depth and the core copy blocks:** hero value prop, About/owner story, services/menu with real descriptions, hours, NAP, testimonial quotes, FAQ, closing CTA (~600–1,200 words for a one-page shop). _(provisional)_

## 2. Niche / vertical-specific

What matters only for some verticals — drives the per-vertical masking and re-weighting of the rubric:

- **Primary-conversion action varies by vertical** (the single biggest per-vertical knob): online booking widget (barber, spa, fitness, dental), reservation/order (cafe), consultation request (law), appointment + quote/estimate (auto, trades), free-trial→membership (fitness). The generic "bookingLink" item is too narrow.
- **Embeds are a per-shop perf risk only for booking/map verticals** (barber, spa, fitness, dental, cafe, auto); law/retail/trades typically carry just a map. Use link-out / facade / lazy with reserved space.
- **Schema subtype is per-vertical, not per-shop:** HairSalon (barber), CafeOrCoffeeShop (cafe), DaySpa (spa), HealthClub/ExerciseGym (fitness), Dentist (dental), AutoRepair (auto), Store (retail), LegalService — not Attorney (law), and the specific HomeAndConstructionBusiness subtype (trades). `menuSchema` is meaningful ONLY for cafe/restaurant — dead weight (and a live denominator bug) for the other eight.
- **Governing-credential layer for regulated verticals:** AMVIC# (auto), Law Society of Alberta (law), ADA&C/CDSA registration (dental), WCB + insurance + trade certs (trades), Calgary massage/RMT licence (spa, massage-offering). Esthetics and fitness have NO governing licence — voluntary certs only.
- **Advertising-copy constraints (regulated):** law (no "specialist"/"expert"/superlatives/advertised settlements; results disclaimer if outcomes are referenced), dental (no "best"/specialty claims, before/after needs PIPA consent), auto (AMVIC all-in pricing + licence display).
- **Service-area (SAB) posture:** trades (and mobile auto) hide the GBP street address, emit `areaServed`, and need genuinely unique suburb pages; storefront verticals keep a visible address. Of the nine, only trades is SAB-default.
- **Media slots are vertical-specific:** before/after (spa, dental, auto body, barber-as-portfolio), categorized project gallery (trades, auto), per-item food photos (cafe), per-product photos (retail), facility/ambiance (cafe, spa, fitness, dental), team headshots+bios (dental, law, fitness, barber, spa) — and explicitly **no gallery, yes headshots** for law.
- **Cafe-only content/SEO:** crawlable HTML menu (never PDF) with per-item price, `hasMenu`/`servesCuisine`/`acceptsReservations`; OpenTable Reserve-with-Google is live in Canada.
- **Pricing granularity by vertical:** full fixed prices (barber/cafe/spa), ranges/"starting at" (trades/auto/dental elective), billing-model explainer (law). "No price signal at all" is a defect everywhere; a hard fixed price on variable work is a defect for trades/auto/dental.
- **Multi-location / multi-suburb** flips the build from single-page to a multi-page IA with uniquely-authored per-location pages — a real trap, but low prevalence (most Calgary clients are single-location).
- **Calgary-specific correction:** Reserve-with-Google for beauty/wellness is US-only (Canada on the 2026 roadmap), so barber/spa default to a plain GBP appointment *link* (Booksy/Fresha/Square), not a native Book button. _(provisional)_

## 3. Always reused vs rare

**Always reused — recurs on (nearly) every build:**
- The static-HTML-on-edge-CDN architecture (structurally fixes CDN/caching/TTFB/HTTPS) plus the fixed per-build perf checklist (hero via Image + priority, self-hosted fonts, link-out embeds).
- Crawlable NAP + matching JSON-LD, click-to-call, hours, map — already shipped shared components.
- One dominant primary CTA echoed across nav/hero/closing, with a co-located rating+count and NAP/hours.
- Centrally-owned a11y guarantees: token-pair contrast validation, `<html lang>`, shared `:focus-visible` ring, global `prefers-reduced-motion` reset, default hero scrim, required CMS alt fields. _(provisional)_
- The universal copy blocks and the single-canonical-content-source pattern (body + footer + JSON-LD can't drift). _(provisional)_
- Per-vertical theming is mechanically always present; its *expression* is vertical-specific.

**Rare — one-offs / upsell flags / situational:**
- Facade pattern for heavy embeds, explicit `<link rel=preload>` for non-standard heroes.
- Citation-volume programs, aggregator subscriptions, `sameAs`/`hasMap`/`priceRange`/special-hours schema, AggregateRating/Review JSON-LD.
- Live embedded/linked Google reviews (highest-trust tier, usually absent — a strong upsell flag).
- Broken-cert interstitials, mixed-content, cookie banners, decorative BBB/security badges, DNI call tracking, multi-step/long intake forms.
- Builder watermarks, visible typos/placeholder chrome, custom illustration, dark themes.
- The manual a11y pass (keyboard, screen-reader, alt-quality, reflow) — run once per finished site. _(provisional)_

## 4. Most vs least common

**Most commonly PRESENT (owner already holds, or shipped by default):** NAP, hours, a basic service/menu list with prices, a (often unclaimed) GBP, HTTPS on managed builders. ~64% of owners maintain a GBP.

**Most commonly LACKING — the differentiator gap (the rubric's richest hunting ground):**
- No above-fold/single-dominant CTA; phone as plain text not `tel:`; review count + named/photo testimonials near the CTA; sticky mobile CTA; guest-checkout booking; correct mobile input attributes.
- LocalBusiness JSON-LD at all (most prospects lack it); the correct most-specific subtype; structured `openingHoursSpecification` vs a visual-only table; dedicated service/location pages; Calgary quadrant/community geo-targeting.
- Real photography (vs stock); per-service descriptive copy, About/owner story, polished marketing copy, alt text/meta/titles — the high-leverage AI-generate defaults.
- Privacy policy (~two-thirds of small businesses lack one); a review-request CTA / `g.page` short link (acquisition, not decoration).
- Modern image formats (WebP ~7–12%, AVIF ~0.3%), LCP-image preload (~2.1%), and CrUX field data itself (most single-location shops fall below the threshold — an expected default, not an anomaly).
- The a11y top six fail near-universally (~84% low contrast, ~53% missing alt, ~51% missing labels). _(provisional)_

**Most common FAILURE driver (and best outreach signal):** WordPress + page-builder bloat — passes CWV only ~43% vs Squarespace ~68% / Wix ~71–75% / Shopify ~75% / Duda ~84%. It's also the highest-yield target for the transport-security dimension (self-managed WP/cPanel skip auto-SSL/redirect). _(provisional)_

**Near-universal but low-value (do NOT deduct):** "remove unused CSS," third-party "efficient cache policy" flags, decorative trust badges, missing HSTS, FAQ rich-result hopes. Treat as advisory/neutral. _(provisional)_

## 5. What works vs what doesn't

**Works:**
- Static HTML on an edge CDN; hero via Astro Image + eager + `fetchpriority="high"`; explicit dimensions; self-hosted preloaded fonts; link-out/facade embeds.
- One high-contrast primary CTA with specific outcome copy ("Book Your Appointment," "Schedule a Free Case Review") over generic "Contact Us"/"Submit"; persistent sticky mobile CTA in the thumb zone; short single-column forms with optional phone and correct mobile keyboards; guest flows; on-domain booking embeds.
- Real photos (owner/team highest-trust) + quoted testimonials + rating-with-count flanking the CTA; verifiable, recent Google reviews surfaced via a "see all on Google" link; driving 0→10 reviews then steady recent inflow via the free `g.page` CTA (ask ALL customers — gating violates Google + FTC rules).
- Generous whitespace, restrained palette (~2 neutrals + 1 accent), display+body type pairing, ≥16px body, ≥1.5 line-height, AA contrast, modular type scale, familiar category-prototypical layout order. Build-time token contrast gate via real sRGB luminance (not OKLCH L).
- A privacy policy link at/near the form, naming the specific US/offshore providers; Cloudflare Turnstile over reCAPTCHA; honeypot over CAPTCHA.

**Doesn't work:**
- Blanket `loading="lazy"` (lazy-loads the hero); grading on the composite Lighthouse score or non-scored diagnostics; hard-failing on a single lab LCP with no field data.
- Plain-text/image phone numbers; multiple equal-weight CTAs; account-creation gates; required phone / long forms; placeholder-only labels; raw iframe booking embeds on mobile; off-site redirects before commitment; PDF menus/price lists.
- Stock/staged/blurry/stretched imagery; default/novelty fonts; wall-of-text; cramped no-hierarchy layouts; autoplay hero sliders (~1% clicked); skeuomorphic styling; builder watermarks; intrusive pop-ups; stale visible content.
- Self-`aggregateRating` markup; review gating/incentivizing; keyword-stuffed review text; citation-volume chasing; city-name find-and-replace area pages (doorway pages); `mailto:` form actions; on-site card forms; decorative BBB/security seals.
- **Honesty on the pitch:** sell perf as a **conversion lever + organic tiebreaker**, NOT a local-pack ranking driver (GBP/reviews/proximity dominate the map pack); sell HTTPS and a11y as credibility/penalty-avoidance, not ranking or "WCAG AA compliant." Frame the site's local leverage as *local organic* (where on-page is the largest category) — the ~15% on-page ceiling and fixed proximity cap what the website alone can move.

## Top cross-cutting audit priorities

Ranked by customer impact — what the audit should weight most heavily. The headline output:

1. **HTTPS + transport security (hard gate).** Cheapest, highest-yield, near pass/fail; the Oct-2026 interstitial raises the stakes. Extend the boolean to a cluster: http→https redirect gap, insecure `<form action>`, cert errors. _(trust/vertical)_
2. **Mobile-first performance, LCP-weighted.** Mobile is the majority of local traffic and a conversion blocker; LCP (the hero) is the metric shop sites fail most. Branch the rubric on CrUX-vs-lab data availability; store the three CWV individually; weight LCP > CLS; ignore non-scored noise. _(perf/conversion)_
3. **Vertical-correct primary conversion path above the fold.** The right macro-action (call vs book vs order vs consultation vs trial) as a single dominant CTA, with co-located rating+count and NAP/hours, plus a real `tel:` anchor. Vertical-mask and re-weight the inventory; `tel:` and reviews weight highest for high-intent verticals. _(conversion/vertical)_
4. **Real photography + surfaced social proof.** Owner/team photo + real shots + star rating with specific count + named/photo testimonials near decision points — the strongest trust-and-visual lever and the most common gap. Score reviews as acquisition (review-request CTA / `g.page`), not decoration. _(visual/trust/content/vertical)_
5. **Crawlable NAP/hours from one canonical source + correct, policy-safe LocalBusiness JSON-LD.** Quality-graded (specific subtype, structured address/hours/geo), with a FAIL on self-serving `aggregateRating`. Flag NAP *presence* on-page; surface GBP parity as manual follow-up. _(localSeo/content/trust)_
6. **PIPA privacy posture, gated on a data-collection surface.** Footer privacy policy naming offshore providers wherever a form or booking link exists — the most defensible Calgary compliance finding. _(trust)_
7. **Visual/brand credibility, vertical register-fit.** The 50ms first impression and credibility halo. Anchor the deterministic floor on AA contrast + ≥16px body + ≥1.5 line-height + modular scale; vision-LLM scores the subjective half (flagged lower-confidence); flag premium businesses stuck on cheap/dated templates as the top outreach target. _(visual/a11y)_
8. **Accessibility top six (risk-reduction + reach, never a compliance claim).** Contrast, alt, labels, link/button names, lang, focus — a graded "automated-detectable issues" dimension; the highest-leverage engine fix is a strong default hero scrim over client photos. _(a11y)_
9. **Content depth + completeness.** Word-count floor, About/owner story, real per-service descriptions, quoted testimonials, vertical-correct pricing granularity, compliance-gated copy (law/dental superlatives, AMVIC all-in pricing). Intake as generate-then-confirm. _(content)_
10. **Builder/platform detection as a prospecting multiplier.** WordPress + page-builder predicts CWV, HTTPS, and bloat failures simultaneously — the single strongest "flag this prospect" signal feeding priorities 1, 2, and 6. _(perf/trust)_
