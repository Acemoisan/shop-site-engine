# Trust & Compliance — Audit Knowledge Base

What earns belief on a Calgary local-shop site: transport security (HTTPS/certs), Alberta PIPA privacy obligations, and social proof. Every claim below is marked _(provisional)_ — none in this dimension is yet verified, so treat all points as directional.

## Necessary (must / should-have)

Lead with the high-impact, must-have signals that gate trust on every vertical (`*`):

- **HTTPS is the floor.** Plain-HTTP sites wear a visible "Not Secure" label in Chrome on every visit (since Chrome 68, 2018), and from ~Oct 2026 Chrome 154 makes HTTPS-First on by default — a full-page click-through warning before the site even loads. 15-25% of small-business domains are still HTTP-only (vs ~97% web-wide). This is the single highest-yield check and is already caught by `url.startsWith('https://')`. _(provisional)_
- **A footer-linked privacy policy is must-have and commonly missing.** Roughly two-thirds of small businesses lack one despite collecting form/booking data; Alberta PIPA requires a published policy, named privacy officer, purpose-at-collection notice, and named disclosure of US/offshore processors. Reliably auto-detectable via an `<a>` whose href/text matches `/privacy[\s-]?(policy|notice|statement)/i`. _(provisional)_
- **Form presence is the legal trigger for offshore disclosure.** Static hosts can't run server-side mail, so every contact form ships PII (name/phone/email/message) to a US endpoint (Netlify stores in the US; Web3Forms forwards via AWS with CleanTalk receiving IP+email). The moment a `contactForm` or `bookingLink` is detected, PIPA expects a privacy policy naming the specific provider(s) and country. **"Form present + privacy policy absent" is the single most defensible compliance finding for Calgary outreach.** _(provisional)_
- **Surface real social proof on every build.** 93-97% of consumers read reviews before choosing a local business; 85% are more likely to use a business with positive reviews, 77% deterred by negative. A page with zero visible proof loses first-time visitors at the consideration stage. _(provisional)_
- **NAP + click-to-call + hours + map are baseline trust plumbing** and core local E-E-A-T signals — already shipped as always-reused components (ContactNAP, CTA, Hours, SiteFooter). 62% of consumers would avoid a business after finding incorrect info (wrong address/phone/hours), so accuracy — not just presence — is load-bearing. _(provisional)_
- **Accurate opening hours** are both conversion and GBP signals: profiles with updated hours get ~2x more visits; complete/accurate profiles earn ~7x more clicks and 70% more in-store visits. Most impactful for walk-in verticals. _(provisional)_

Should-have, high-to-medium impact:

- **Insecure form action.** An HTTPS page whose `<form action="http://...">` targets a plaintext endpoint is an "insecure form" (Chrome 86+): autofill disabled, inline warning, blocked submission. The `https` boolean only checks the page URL and misses this. _(provisional)_
- **Graded reviews beat a bare boolean.** Visible numeric star rating (52-55% won't consider below 4 stars), review count (43% prefer 100+ reviews), and named/photo-attributed testimonials (a customer photo lifted one test +102.5%) each grade above generic "great service" text. _(provisional)_
- **Live/embedded Google reviews** outperform static testimonials because they're publicly verifiable and always-fresh (74% of consumers only weight reviews from the last 3 months; Google is checked by ~71-81%). Link to the client's GBP rather than run a paid sync widget. _(provisional)_
- **LocalBusiness JSON-LD** is an always-reused structured identity signal (already shipped via `seo/LocalBusinessJsonLd.astro`); invisible to users, so absence is a silent gap. _(provisional)_
- **Spam/bot protection** (Turnstile/reCAPTCHA/honeypot) is a checkable instance of PIPA's "reasonable security safeguards" (Step 5); a bare `<form>` with no anti-bot mechanism is a weaker safeguards posture. _(provisional)_
- **About/owner identity surface** with a real owner photo: 46% trust a site more with a real owner photo vs 33% generic and 21% with none; 64% trust real owner photos over stock. The engine has no About/Team component today — a gap. _(provisional)_

## Niche / situational

Vertical-gated or low-impact items — record but do not weight as baseline:

- **Professional licensing/credentials (dental, law).** For YMYL queries E-E-A-T correlation roughly triples; named-practitioner credentials, bios, and bar/college registration convert. Scope an optional Credentials/Team section per client, not on every shop. _(provisional)_
- **Licensed / bonded / insured / WCB display (trades).** A primary hiring-confidence cue for contractors; share the same optional Credentials/Guarantees component with trades-specific tokens. _(provisional)_
- **Licensing/insurance/association badges (trades, auto, dental, law, spa).** Conversion-relevant for licensed/risk-bearing verticals, near-irrelevant for cafe/barber/retail. Keyword presence is regex-detectable; validity needs human review. _(provisional)_
- **Google Guarantee / Screened / "Google Verified" badge (trades, dental, law, auto, spa, fitness).** ~12% more clicks for badged businesses, earned off-site via Local Services Ads — report as present/absent, not a build deliverable. _(provisional)_
- **Generic static trust badges (BBB, Norton/McAfee).** Decorative-to-risky: removing a BBB seal produced a 5.3% conversion *lift* (99% confidence) in one test. Record but **do not award trust points by default**; prioritize verifiable Google reviews. _(provisional)_
- **Allergen/ingredient disclosure (cafe).** NOT legally required in Alberta for non-prepackaged food (~16% of Canadian restaurants include it). Optional menu enhancement. _(provisional)_
- **PCI/payment-security surfaces (retail, spa, fitness).** Avoidable — offload to Stripe/Square hosted pages so cards never touch the site (SAQ A). Don't build on-site card forms; relevant only for e-commerce-leaning clients. _(provisional)_
- **"Years in business" / "established YYYY"** — a credibility shortcut, strongest in trades/law/dental/auto, weak for impulse retail/cafe. Regex-detectable but truthfulness isn't page-verifiable. _(provisional)_
- **Cookie/consent banner** — low adoption among Canadian local shops; driven by Quebec Law 25 / GDPR, not Alberta PIPA. Score informational/bonus, not a hard fail. _(provisional)_
- **Missing HSTS** — the norm even on HTTPS sites (~64% lack it), but no browser warning, so a nice-to-have rubric line, not an outreach headline. _(provisional)_
- **Insecure booking link** — providers force HTTPS, so an http booking link is rare and signals a stale/typo embed. Low base-rate, cheap to check. _(provisional)_

## Always reused vs rare

**Always present / always reused (ship by default, score as plumbing):**
- HTTPS detection and the safeguards signal — `always-present`, the existing boolean. _(provisional)_
- Single-fetch detectability of no-HTTPS and http→https redirect gap — extends the existing boolean with no extra tooling. _(provisional)_
- NAP, click-to-call, hours, map, LocalBusiness JSON-LD — already-shipped shared components. _(provisional)_
- The form→offshore-disclosure trigger and the PIPA sub-rubric shape (3 auto signals + 2 manual flags) — `always-present` structure mirroring the conversion inventory. _(provisional)_
- Single-page scanning under-detects privacy artifacts (links live on inner pages) — always a caveat; crawl one level or downgrade confidence to "not found on homepage (review)". _(provisional)_

**Rare (strong upsell flags when present or absent):**
- Live embedded/linked third-party (Google/Yelp) reviews — usually absent on local-shop sites; the highest-trust review tier. _(provisional)_
- AggregateRating/Review JSON-LD — rare; primary payoff is SERP CTR (~15-35% lift), not on-page trust. _(provisional)_
- Broken-cert interstitials (expired/self-signed/hostname-mismatch) — rarer than plain HTTP but block the page outright; highest impact per occurrence. _(provisional)_
- Mixed-content failures — rare, surface after half-finished HTTP→HTTPS WordPress migrations. _(provisional)_
- Cookie banners and generic trust badges — rare on local shops. _(provisional)_

## Most vs least common

**Most common gaps (high-yield outreach hooks):**
- Privacy policy absence — ~two-thirds of small businesses; `common-but-missing`. Trades/barber/cafe skew missing; law/dental skew present. _(provisional)_
- No-HTTPS — concentrated exactly in the small-business segment (15-25% HTTP-only). _(provisional)_
- Zero/weak social proof — `common-but-missing` despite near-universal consumer reliance on reviews. _(provisional)_
- NAP consistency, missing LocalBusiness JSON-LD, near-form purpose notice, About/owner section — all `common-but-missing`. _(provisional)_
- http→https redirect gaps — common on self-managed WordPress/cPanel. _(provisional)_

**Least common:**
- Embedded live reviews, AggregateRating schema, broken certs, mixed content, cookie banners, decorative badges — all `rare`. _(provisional)_

## What works vs what doesn't

**What works:**
- HTTPS by default (deploy-stage guarantee on Cloudflare/Netlify) — avoids the browser penalty and the Oct-2026 interstitial. _(provisional)_
- Verifiable, recent Google reviews surfaced via a "see all reviews on Google" CTA/link — never decays, fits the one-time-fee/client-owns-everything model. _(provisional)_
- Named/photo testimonials over anonymous quotes; review count alongside the star value (a rating with no count reads as cherry-picked). _(provisional)_
- A privacy policy link *at/near the form* — the single highest-leverage missing item on most Calgary shop sites. _(provisional)_
- Real owner/team photos over stock or no imagery. _(provisional)_
- **Cloudflare Turnstile over Google reCAPTCHA** for a PIPA-governed shop: no cookies, no ad-profiling, less consent exposure (both still send IP to a US provider, so either is an offshore-disclosure trigger). Recommend Turnstile as the engine default. _(provisional)_

**What doesn't:**
- Decorative BBB/security seals — neutral-to-negative; don't award points. _(provisional)_
- Static, dated testimonial walls as the *only* proof — decay against the 74%-want-last-3-months recency expectation. _(provisional)_
- `mailto:` form actions — no TLS on the payload, no spam protection, break on phones with no mail app; a triple trust/conversion/safeguard failure. _(provisional)_
- Overselling HTTPS as an SEO fix — Google calls it a "very lightweight" ranking signal (<1% of queries); sell it as credibility/penalty-avoidance, not ranking. _(provisional)_
- On-site card forms — drag the client into PCI scope needlessly. _(provisional)_

**Per-vertical notes:**
- **Booking-heavy verticals (barber, spa, fitness, dental, auto):** the linked booking widget (Calendly/Square/Fresha/Booksy/Setmore/OpenTable/Jane) is usually the *primary* PII collection channel — often more than the contact form — and must be named as a US/foreign provider in the privacy policy. _(provisional)_
- **Trades:** licensed/bonded/insured/WCB display is a top hiring-confidence cue; owner-photo trust rose to 52% for plumbers. _(provisional)_
- **Dental, law (YMYL):** named-practitioner credentials roughly triple E-E-A-T correlation. _(provisional)_
- **Walk-in verticals (cafe, barber, retail, spa, fitness):** accurate hours matter most (2x visits, 7x clicks for complete profiles). _(provisional)_
- **Cafe:** allergen disclosure is optional, not mandatory. _(provisional)_
- **Self-managed WordPress/cPanel & legacy custom sites** are the highest-yield target for the whole transport-security dimension; managed builders (Wix/Squarespace/GoDaddy/WordPress.com) auto-provision SSL, auto-redirect, and handle www/non-www, so deprioritize cert checks there. _(provisional)_

## Audit takeaways

1. **Treat the `https` boolean as a cluster, not a flag.** Extend it to catch: http→https redirect gap (one extra fetch), insecure `<form action>` (Chrome-86 blocking), TLS cert errors (fix the bug where undici throws on expired/self-signed certs and the page is mis-recorded as merely "no HTTPS"), and read the already-discarded HSTS header. _(provisional)_
2. **Add a PIPA sub-rubric** of 3 auto signals (privacy-policy link, HTTPS, cross-border vendors detected) + 2 manual-review flags (near-form purpose notice, named privacy officer / offshore countries named), feeding `computeGrade` like the existing conversion inventory. _(provisional)_
3. **Gate the privacy-policy expectation on detecting a data-collection surface** (form OR booking link) so "form present + no privacy policy" is a precise, defensible finding rather than a blanket fail. Detect cross-border vendors behaviourally via Playwright network requests against a maintained US-processor list (reCAPTCHA/Fonts/Analytics, Calendly, Mailchimp, Square, HubSpot, Cloudflare). _(provisional)_
4. **Split the single `reviews` boolean into ordered sub-signals** (lowest→highest): any social-proof text → named/photo testimonial → numeric star rating → review count → AggregateRating JSON-LD → live embedded/linked Google/Yelp reviews. Google Verified badge is a vertical-gated bonus; BBB/security seals are recorded-but-neutral. _(provisional)_
5. **Detect presence on-page; flag accuracy/consistency for review.** NAP/hours presence is auto-checkable from HTML; matching against the actual Google Business Profile needs the Places API (a complete GBP makes consumers 2.7x more likely to rate a business reputable and 50% more likely to purchase). Label homepage-only misses "not found (review)", not "absent". _(provisional)_
6. **Drive auditor flags and the shippable privacy component from one shared US-vendor table** so detection and remediation stay in sync; bake the commonly-missed artifacts (footer policy, privacy-officer slot, purpose notice, named offshore providers, unchecked marketing opt-in) into the component so a Studio0rbit build auto-passes the PIPA line ~two-thirds of prospects fail. _(provisional)_
