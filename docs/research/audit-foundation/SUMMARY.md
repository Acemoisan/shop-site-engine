# Local-Shop Website Audit — Master Knowledge Summary

This is the verified knowledge foundation behind our Calgary local-shop website audit, synthesized across eight dimension briefings (performance, local SEO, visual/brand, content/IA, conversion/UX, trust/compliance, accessibility, and per-vertical anatomy). Of ~620 underlying claims, roughly 556 are now **verified** and ~64 remain **provisional** — no dimension is whole-cloth provisional anymore. Individual provisional points are tagged _(provisional)_ here only where their underlying claim is still marked provisional in the dimension briefings; everything untagged is verified.

## 1. Necessary on every local-shop site

These are the universal floor — present (or expected) on essentially every vertical, independent of business type.

**Identity & discovery foundations**
- **Crawlable, byte-identical NAP** (name/address/phone as real text, never baked into an image) in the footer and contact section, mirrored into `LocalBusiness` JSON-LD. One canonical content source (the typed `ShopContent` object) must fan out to body, footer, and JSON-LD so the surfaces can never drift. NAP consistency across site/GBP is the single most important citation rule; it can only be verified against GBP, not on-page alone _(provisional)_.
- **Policy-safe `LocalBusiness` JSON-LD** — `name` + structured `PostalAddress` required; emit `geo`, `telephone` (E.164 +1-403), `url`, and `openingHoursSpecification`. Use the most-specific subtype per vertical. **Never self-mark `aggregateRating`/`review`** — it earns no stars and risks a site-wide spam penalty.
- **Published, correct hours** as a visible table that agrees with structured `openingHoursSpecification`; "openness" is a ranking factor and wrong hours are a top trust-and-conversion failure.
- **Title/H1 `<service> in Calgary` + quadrant/community** geo-targeting — cheap, fully controllable, zero-maintenance.

**Conversion plumbing**
- **A real `tel:` anchor in E.164** (`href="tel:+1..."`), above the fold and in the sticky mobile header — the single highest-ROI defect to fix for call-driven shops.
- **Exactly one visually dominant above-fold CTA** mapped to the vertical's macro-conversion, with secondaries de-emphasized; repeated nav → hero → closing, paired with a sticky thumb-zone CTA (≥44px target).
- **Minimal contact form**: Name + Email + optional Phone + Message (3–4 fields, single column), correct mobile input `type`/`inputmode`/`autocomplete`, on-blur validation, a confirmation that sets expectations, and **guest booking — never an account gate**. Phone optional, never blocking.
- **Hours + NAP co-located with the CTA**, not buried in the footer.
- **A compact star rating + specific review count near the CTA/hero** (count beats bare stars; recency matters) plus a named testimonial near the decision point. This is the universal top trust signal — reviews outweigh credential badges.

**Trust & safety**
- **HTTPS** (and the form endpoint itself HTTPS); plain-`http://` is the most common, most screenshot-able transport failure on our target segment. Broken certs are worse than no cert.
- **Footer-linked privacy policy** — the most reliably auto-detectable PIPA artifact; "form present + privacy policy absent" is our single most defensible compliance finding.

**Content spine**
- **Hero value prop, about/owner story (with a genuine photo), services-or-menu with real descriptions, hours, NAP, quoted reviews, FAQ, closing CTA.** The About/owner block and quoted (not just starred) testimonials are the biggest gaps vs. a bare structural inventory.
- **A price signal on every vertical** (never "no price at all") — granularity flexes per vertical.
- **Real, business-specific photography** over stock (owner/staff photo is the highest-trust single image), and AI-generated SEO/a11y micro-content (alt text, meta descriptions, per-page titles) that owners never supply.

**Visual & accessibility floor**
- **AA contrast** (4.5:1 body / 3:1 large), **body ≥16px, line-height ≥1.5, line length ~45–75ch, modular type scale ≥1.2** with display+body pairing — low-contrast text is the #1 web defect (~84% of pages) and the most consequential automatable criterion. Contrast must be re-validated **per theme** (each shop swaps the OKLCH palette).
- **The WebAIM top six**, guaranteed by construction: `<html lang>`, document title, image `alt`, form labels, link names, button names — ~96% of auto-detectable WCAG failures.
- **Real hero masthead, generous whitespace, restrained palette, familiar section order** (hero → services/menu → reviews → hours/NAP → CTA), responsive mobile-legible layout, favicon + logo, no broken/template chrome.
- **Fast static output** — LCP ≤2.5s / INP ≤200ms / CLS ≤0.1, explicit width/height on all media, hero eager with `fetchpriority="high"` (never lazy), self-hosted preloaded fonts.

## 2. Niche / vertical-specific

**Primary conversion action diverges by vertical** — the audit's flat `bookingLink` is too narrow; generalize to "primary conversion action":
- **Barber / spa / fitness (salon-type):** online **Book** to a scheduler (online booking ~78% preferred); show price + duration next to the CTA. Spa skews more phone-heavy (~57% still phone) _(provisional)_; fitness's entry macro is a **free-trial/intro offer**, funnelling to recurring membership, with an embedded bookable class timetable as the core engine.
- **Trades / auto:** **click-to-call primary** (urgent, high-ticket) _(provisional)_ + a **quote/estimate-request mechanism** as a co-must-have _(provisional)_; categorizable before/after project galleries with location captions (double as local-SEO).
- **Dental:** new-patient appointment **request** (not instant-confirm) + click-to-call; consent-gated before/after gallery; insurance/direct-billing block; team/doctor bios.
- **Law:** a single **"Free Consultation / Case Review"** as both sticky click-to-call and one short intake form; per-case-type practice-area pages are the organizing structure _(provisional)_; attorney headshots/bios, no galleries.
- **Cafe / restaurant:** menu-view → order/reserve → directions; **HTML menu, never PDF**, with per-item name + price + description and photo slots for best-sellers.
- **Retail:** branches on model — foot-traffic shops default to **Get Directions / Visit**, online-sellers to **Shop/Buy**; per-product image + price slots.

**Two-layer trust model:** a *governing-credential* slot (auto = AMVIC licence, law = Law Society of Alberta, dental = ADA&C/CDSA, trades = WCB + licensed/bonded/insured, massage = Calgary practitioner licence) **plus** a *conversion-proof* slot (reviews, direct-billing, warranty, consented before/after). Esthetics and fitness have **no** governing licence — voluntary certs only. Regulated verticals carry advertising constraints: law (no "specialist"/superlatives/advertised outcomes), dental (truthful, no guarantees), auto (AMVIC name + all-in pricing).

**Vertical schema add-ons:** correct most-specific `@type` (`HairSalon`, `CafeOrCoffeeShop`, `DaySpa`, `Dentist`, `LegalService`, `AutoRepair`, `Store`, trades `HomeAndConstructionBusiness` subtypes) plus conditional `priceRange` (all), `hasMenu`/`servesCuisine` (cafe only — dead weight elsewhere, mask it out), `areaServed` (trades/auto/law), `makesOffer` (service verticals), `medicalSpecialty` (dental).

**Pricing granularity:** fixed itemized list for barber/cafe/spa; ranges / "starting at" + estimate CTA for trades/dental/auto; billing-model explainer for law. Flag any hard fixed price on site-dependent work.

**Per-vertical media gaps** (concrete findings): missing before/after (spa/dental/auto/barber), text-only menu without food photos (cafe), no categorized project gallery (trades/auto), stock instead of real headshots (law/dental).

**Other niche items:** multi-location / multi-suburb page sets (uniquely authored, not city-swapped); SAB address-hiding + `areaServed` for mobile trades; embed facades / lazy iframes; DNI call tracking; honeypot vs CAPTCHA; cookie/consent banners (Quebec/GDPR-driven, not PIPA); dark themes (brand-fit, not a quality bar).

## 3. Always reused vs rare

**Always reused (ships in every build, lives in `packages/shared`):** crawlable NAP + `tel:` + visible hours; `LocalBusiness` JSON-LD (no self-rating); the one-dominant-CTA + sticky pattern repeated nav/hero/closing; rating+count and a named testimonial near the CTA; the minimal correctly-attributed form with confirmation; HTTPS; footer-linked privacy policy; the content spine (hero/about/services/hours/NAP/reviews/FAQ/CTA); real photography; AA-contrast tokens, `<html lang>`/`<title>`, `:focus-visible` ring, `prefers-reduced-motion` guard, required `alt` slots, a strong default hero scrim; and the per-theme contrast gate (the one thing that varies per shop and silently breaks AA). The hero-image perf checklist collapses to: Astro `Image` for the hero + `fetchpriority`, self-hosted fonts, facade/link-out embeds.

**Rare (specific triggers only):** multi-location/multi-suburb page sets and per-location schema; embed facade pattern (high-leverage but uncommon); DNI; live third-party review embeds; honeypot/CAPTCHA tuning; broken-cert/mixed-content/HSTS handling; credential/licensing strips; food-menu schema and Reserve-with-Google; retail inventory feeds; holiday-hours schema; legitimate product/service review schema; the manual a11y check set; skip links; builder watermarks.

## 4. Most vs least common

**Most common in the wild (table-stakes, usually present):** visible hours, address/map, a click-to-call link, basic reviews, a contact form, and an above-fold CTA — but often a *weak* one. Owners reliably supply NAP + hours + a raw service/menu list with prices + some GBP photos. Most-common **failure modes**: platform/page-builder bloat (the single strongest predictor of a failing mobile PSI score — WordPress 43% CWV pass vs Shopify 75%, Duda 84%), unoptimized/late hero images, render-blocking embeds, no-HTTPS on self-managed stacks, low-contrast text (~84%), missing alt (~53%), missing form labels (~51%).

**Common-but-missing (the differentiator gold — present in our playbook, absent on most prospects):** `LocalBusiness` JSON-LD at all, structured `openingHoursSpecification` vs a cosmetic table, specific `@type` subtypes, quadrant/community targeting; a clear above-fold primary CTA (~70% of SMB homepages lack one), a genuine `tel:` anchor, rating+count placed *near the CTA*, guest booking, the hero+sticky pairing; a privacy policy (~two-thirds of small businesses lack one) _(provisional)_, graded review sub-signals; real authentic photography, generous whitespace, body ≥16px, line-height ≥1.5, a real type pairing, a custom favicon; the About/owner-story block, quoted testimonials, per-service descriptions, SEO micro-content.

**Least common / rare (often defects when present, or upsell flags):** self-`aggregateRating`, holiday-hours schema, retail inventory feeds; DNI, live review embeds, multi-step forms; HSTS, broken certs, mixed content; builder watermarks, visible typos/lorem; custom illustration, dark themes; the budget-shop-over-designing mismatch.

## 5. What works vs what doesn't

**Works (ship these):**
- **Static, pre-rendered HTML from a CDN edge** — structurally beats every page-builder on CWV; fast load is a credible, demonstrable differentiator (most competitor sites average ~15s mobile loads).
- **GBP completeness + correct primary category + steady recent reviews** — the highest-leverage 2025–26 local levers, outweighing citation count and proximity; the site's honest ROI is local-organic / "near me", not the proximity-driven 3-pack.
- **Real photos + quoted/named testimonials + verifiable Google reviews** (live link/widget) over stock imagery, anonymous quotes, and decaying static testimonial walls.
- **One dominant CTA + real `tel:` + rating-and-count flanking the action + a 3–4-field form with a confirmation.**
- **A complete GBP the site corroborates** (2.7× more likely considered reputable), consistent NAP, AA-contrast tokens, semantic HTML.
- **Cloudflare Turnstile over Google reCAPTCHA** for a PIPA shop; honeypot over visible CAPTCHA for low-volume spam.

**Doesn't work (flag or avoid):**
- **Review gating / incentivizing** (FTC fake-review rule ~$51,744/violation + Google policy), **self-`aggregateRating`** (no stars, penalty risk), keyword-stuffed review text, citation-volume blasts.
- **PDF menus/price-lists** (crawler- and LLM-invisible, break mobile), **plain-text/image phone numbers**, **multiple equal-weight CTAs** (decision paralysis), required phone fields and long forms, placeholder-only labels, account-creation gates, off-site redirects mid-flow.
- **Stock/staged photography, low-res/stretched images, default/novelty fonts, wall-of-text, cramped no-whitespace layouts, autoplay hero sliders** (~1% click-through), skeuomorphic chrome, builder watermarks, intrusive pop-ups, stale visible content.
- **BBB/Norton/McAfee security seals** (mixed-to-negative; one test found *removing* a BBB seal lifted conversion 5.3%), on-site card forms (PCI scope), `mailto:` form actions.
- **Lazy-loading the hero**, render-blocking third-party embeds (the primary way a static site still fails CWV), overselling HTTPS or page speed as an SEO/ranking *guarantee*.
- **Honesty traps to avoid:** never claim "AA compliant" off a Lighthouse score (engines evaluate only ~30–40% of criteria; ~57% by issue volume is the upper bound); never hard-fail an image-optimized static site on lab LCP alone or report a lab INP pass/fail; never report a blank CWV section (no CrUX field data) as a failure — it is the expected default for single-location shops.

## Top cross-cutting audit priorities

Ranked by customer impact — this is the headline. Each surfaces repeatedly across multiple dimensions, so fixing it pays off in conversion, trust, and discovery at once.

1. **Make the phone a real, prominent `tel:` anchor.** A genuine E.164 `tel:` link, above the fold and in the sticky mobile header — not plain text, not footer-only. Highest-ROI single defect for the call-driven verticals (trades, auto, dental, law) and the strongest outreach angle.
2. **One dominant, vertical-correct above-fold CTA** mapped to the macro-conversion (book / quote / request / order / visit), secondaries de-emphasized, repeated nav→hero→closing + sticky. ~70% of SMB homepages lack a clear above-fold CTA.
3. **Surface social proof at the decision point** — a star rating + *specific recent count* and a named testimonial beside the CTA/hero, not the footer. Reviews are the universal top trust signal across every vertical.
4. **HTTPS + a form-gated privacy policy.** Fix transport security (and catch broken certs distinctly), and treat "form present + privacy policy absent" as the precise PIPA finding. Visible "Not Secure" is screenshot-able harm with a near-term Chrome escalation deadline.
5. **Mobile speed via static architecture, centered on the hero image.** Eager hero with `fetchpriority="high"`, modern format + dimensions, self-hosted fonts, facade/link-out embeds — pitched as a conversion lever (bounce rises 123% from 1s→10s), not a ranking guarantee. Use WordPress+page-builder detection as a prospecting signal.
6. **AA contrast, validated per theme.** The #1 web defect, the one visual metric tools score reliably, and a per-shop regression because each theme swaps the OKLCH palette — gate the `theme.css` token matrix at build time with `culori`.
7. **Quality `LocalBusiness` JSON-LD with the correct per-vertical `@type`** — structured address, `geo`, `openingHoursSpecification`, conditional properties — and **no self-`aggregateRating`**. Grade quality, not mere presence.
8. **Real photography + the About/owner-story + quoted testimonials.** The biggest content gaps vs. a bare inventory; the owner photo carries disproportionate trust (up to ~52% for in-home trades), and authentic imagery is now an explicit consumer expectation.
9. **Per-vertical correctness across the board** — mask non-applicable schema/items (e.g. `menuSchema` only for cafe), apply per-vertical pricing granularity and the two-layer trust model, and flag vertical-specific media gaps. A flat 12-item average mis-scores; vertical weighting plus universal `https`/`mobileViewport` gates is the fix _(provisional)_.
10. **Honest framing throughout.** Sell local-organic gains (not 3-pack jumps), conversion (not ranking guarantees), and "WCAG 2.2 AA best practices at handoff" / risk-reduction (not "legally compliant") — defensibility is itself a competitive edge.
