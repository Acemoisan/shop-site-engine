# Trust & Compliance — Audit Briefing

The trust dimension covers transport security (HTTPS/TLS), Alberta PIPA privacy compliance, and social proof — what makes a Calgary shop site read as legitimate, safe, and credible to a first-time visitor and to Google.

## Necessary (must / should-have)

**Transport security is the highest-yield single check.** Plain-`http://` is the most common transport failure on older local-shop sites and exactly the segment we target: ~97% of homepages web-wide are HTTPS, but only ~75-85% of small-business domains _(provisional)_. Since Chrome 68 (2018) every HTTP page wears a visible "Not Secure" label on every visit — the concrete, screenshot-able harm for outreach. Chrome 154 (~Oct 2026) escalates this to a full-page click-through warning before the site even loads, giving outreach a dated, near-term deadline. HTTPS is also the one PIPA-adjacent safeguard that is trivially auto-detected, and a (very lightweight) Google ranking signal — sell it as credibility/penalty-avoidance, not an SEO lever.

**Broken certs are worse than no cert — and the current audit mis-records them.** Expired / self-signed / hostname-mismatch certs throw a NET::ERR_CERT_* "Your connection is not private" interstitial that *blocks* the page, versus the dismissible "Not Secure" label for plain HTTP. Node's `fetch`/undici throws on these before returning HTML, and `fetchPage.ts` currently treats that throw as "https unreachable" and silently falls back to `http://` — so a broken-cert site is mis-logged as merely `https:false`. Catch the TLS error code and record a distinct `tlsCertError` flag.

**Social proof presence is the floor.** 93-97% of consumers read reviews before choosing a local business; 85% are more likely to use one with positive reviews; a page with zero visible proof loses first-time visitors at consideration. This is the existing `reviews` boolean — keep it as the base sub-signal. NAP + click-to-call + hours + map are the always-reused trust "plumbing" (already shipped: ContactNAP, CTA, Hours, SiteFooter) and belong in `packages/shared` by default.

**A footer-linked privacy policy is a must-have and the most reliably auto-detectable PIPA artifact:** scan `<a>` tags (not body copy) for `/privacy[\s-]?(policy|notice|statement)/i`. Absence is genuinely common — roughly two-thirds of small businesses lack one _(provisional)_ — so this line fails for a large share of prospects and is a strong outreach hook. For Alberta shops PIPA requires a published policy, named privacy officer, purpose-at-collection notice, and named disclosure of US/offshore processors _(provisional)_.

**Form presence is the legal trigger.** Every static-host form/booking flow necessarily ships PII (name/phone/email) to a US provider (Netlify stores in the US; Web3Forms forwards via AWS with CleanTalk as a sub-processor) — exactly the cross-border transfer PIPA requires be disclosed. So the moment the audit detects `contactForm` or `bookingLink`, it should expect a privacy policy naming the specific provider and country. **"Form present + privacy policy absent" is the single most defensible compliance finding for Calgary outreach.** The form's `action`/JS endpoint must itself be HTTPS: an HTTPS page with `<form action="http://...">` is an "insecure form" (Chrome 86+) — autofill disabled, inline warning, blocked submission — which the page-level `https` boolean entirely misses.

**The PIPA dimension should be scored as a small weighted sub-rubric** mirroring the existing conversion-inventory pattern: 3 reliable AUTO signals (privacy policy linked, HTTPS, cross-border vendors detected) + 2 MANUAL-REVIEW flags (near-form purpose notice, named privacy officer + policy names offshore countries), feeding `computeGrade` with no new scoring model. Cross-border vendor detection is high-precision via the existing Playwright collector: enumerate outbound third-party requests to known US processors (reCAPTCHA/Fonts/Analytics, Calendly, Mailchimp, Square, HubSpot, Cloudflare) and diff against what the policy text discloses.

**NAP/hours accuracy and a complete GBP are the trust payoff.** NAP consistency across site/GBP/directories is a confirmed local-pack factor; 62% of consumers avoid a business if they find incorrect info online. A complete Google Business Profile makes consumers 2.7x more likely to consider a business reputable and 50% more likely to purchase — the trust payoff is realized *through* a GBP the website corroborates, not the site in isolation. The page-only collector detects NAP/hours *presence*; *consistency/accuracy vs GBP* needs the Places API.

**Should-have social-proof upgrades** (graded above bare testimonial text): a visible numeric star rating (52-55% only consider 4-star+ businesses); review count/volume (43% prefer 100+ reviews) _(provisional)_; named/photo-attributed testimonials (a customer photo lifted one test +102.5%); and — highest tier — live embedded/linked third-party (Google/Yelp) reviews, which are publicly verifiable and inherently recent (matters more in 2026 as the FTC's fake-review rule and AI fakes raise skepticism). Google is the dominant platform consumers check (71% in 2026), so surfacing the shop's GBP reviews is the highest-leverage move. Also should-have: AggregateRating/Review JSON-LD (SERP CTR ~15-35%, distinct from on-page trust); LocalBusiness JSON-LD (silent identity signal, already shipped); an About/owner-identity surface; spam/bot protection on forms (a PIPA "reasonable safeguards" instance); and HSTS — but HSTS is *nice-to-have* (no visitor-visible symptom, weight it low) _(provisional)_.

## Niche / situational

- **Professional licensing/credential display** — high-impact but vertical-conditional for YMYL: dental, law (where E-E-A-T correlation roughly triples) _(provisional)_, and trades. Scope a per-client Credentials/Team section, not every shop.
- **Licensed / bonded / insured / WCB strip** — high-impact, specific to trades/contractors; primary hiring-confidence cue. Licensing/insurance/association badges also help auto, dental, law, spa; near-irrelevant for cafe/barber/retail.
- **Google Guarantee / Screened / Verified badge** — high-impact for eligible service verticals (trades, dental, law, auto, spa, fitness): ~12% more clicks + financial backstop. Earned off-site via Local Services Ads, so report present/absent, not a build deliverable _(provisional)_.
- **Generic static trust badges (BBB, Norton/McAfee)** — decorative-to-risky; one test found *removing* a BBB seal gave a 5.3% conversion lift. Record but do NOT award trust points; prioritize verifiable Google reviews over seals.
- **Booking widgets as a data-collection surface** — for barber/spa/fitness/dental/auto, a linked Calendly/Square/Fresha/Booksy/Jane is often the *primary* PII channel (more than the contact form) and must be named in the offshore-disclosure list. Providers force HTTPS, so a detected `http://` booking link is a stale/typo link worth flagging.
- **Cookie/consent banner** — low adoption among Canadian local shops; driven by Quebec Law 25 / GDPR, not Alberta PIPA. Score informational/bonus, not a hard fail. Fingerprint CMP scripts (OneTrust, Cookiebot, Termly, iubenda) over generic text.
- **Allergen/ingredient disclosure (cafe)** — NOT legally required in Alberta for non-prepackaged food (~16% of Canadian restaurants include it); optional menu enhancement only.
- **PCI/payment surfaces (retail/spa/fitness)** — avoid entirely: offload to hosted checkout (Stripe/Square) so cards never touch the static site (keeps client at SAQ A). Don't build on-site card forms or a badge system.
- **"Years in business" / "established YYYY"** — credibility shortcut, strongest in considered trades/professional services; weak for impulse retail/cafe _(provisional)_.
- **Insecure booking link** — low base-rate (providers force HTTPS); cheap to check once a `bookingLink` is detected, mostly catches stale embeds.

## Always reused vs rare

**Always reused (ship by default, in `packages/shared`):** HTTPS (deploy-stage guarantee on Cloudflare/Netlify), NAP + click-to-call + hours + map, a reviews/testimonials section, LocalBusiness JSON-LD, and a footer-linked PIPA privacy-policy component. The PIPA sub-rubric and the cross-border-vendor table should be a single shared source driving both detection (auditor) and remediation (the shippable privacy component) so they stay in sync. Single-page (homepage-only) scanning is an always-present caveat — privacy links/officers/notices often live on inner pages, so crawl one level or downgrade confidence.

**Rare on local-shop sites (and therefore strong upsell flags):** live embedded/linked third-party reviews, AggregateRating JSON-LD, HSTS headers _(provisional)_, broken/mismatched certs, mixed-content failures, www/non-www canonicalisation, Google Verified badges _(provisional)_, and credential/licensing strips. Most sites have only `reviewsAny` and no privacy policy — graded sub-signals create clear, defensible findings.

## Most vs least common

**Most common failures** (high outreach value): no-HTTPS on self-hosted/legacy stacks _(provisional)_; missing privacy policy (~two-thirds of small businesses) _(provisional)_; bare `<form>` with no purpose notice, no near-form privacy link, and no spam protection; missing star rating/review count alongside generic testimonials; NAP/hours present on-page but unverified against GBP. http→https redirect gaps are also common on self-managed WordPress/cPanel.

**Least common / lowest severity:** missing HSTS (the norm — only ~36% of mobile pages send it — but zero visitor-visible symptom, so low weight) _(provisional)_; broken certs (rarer than plain HTTP but worse per occurrence); embedded live-review widgets (rare, the highest-trust tier); mixed content; cookie banners; decorative badges.

**Platform predicts the cluster:** GoDaddy Builder, Wix, Squarespace, WordPress.com auto-provision SSL, auto-redirect, and handle www/non-www — they rarely show transport failures. Failures cluster on self-managed WordPress.org/cPanel and hand-rolled custom sites — exactly our prospect profile. Cross-reference `stack.ts`: deprioritise transport checks on managed builders, spend the probe budget on self-hosted sites.

## What works vs what doesn't

**Works across all verticals:** verifiable Google reviews (live link/widget) over static, undated testimonials (74% only weight reviews from the last 3 months _(provisional)_; recency favors live embeds); named/photo testimonials over anonymous quotes; a real owner photo (46% trust a site more with one vs 33% generic, 21% none); HTTPS by default; a complete GBP the site corroborates; **Cloudflare Turnstile over Google reCAPTCHA** for a PIPA shop (no cookies, no ad-profiling, less consent exposure — though both still send IP to a US provider).

**Doesn't work / counter-productive:** BBB and generic security seals (mixed-to-negative evidence; clutter that reads as AI-slop); static baked-in testimonial walls that decay; on-site card forms (PCI scope); `mailto:` form actions (no TLS, no spam protection, break on phones — a triple trust/conversion/safeguard failure); overselling HTTPS as an SEO fix (it's <1% of queries).

**Per-vertical:**
- **Trades:** Licensed/bonded/insured/WCB strip is a primary hiring cue; owner-photo trust rises to ~52% for plumbers. Skews oldest/likeliest to be HTTP-only.
- **Dental, law (YMYL):** named-practitioner credentials, bios, bar/college registration convert; E-E-A-T correlation roughly triples _(provisional)_. Skew toward *having* a privacy policy.
- **Auto:** licensing/insurance badges relevant; older stacks skew HTTP-only.
- **Barber / spa / fitness / dental / auto (booking-heavy):** the booking widget is the primary offshore PII surface — name the vendor in the policy.
- **Cafe / restaurant:** `menuSchema` is the vertical structured layer; allergen text is optional, not mandatory. Walk-in verticals (cafe/barber/retail/spa) gain most from accurate hours (updated-hours profiles get ~2x visits).
- **Trades / barber / cafe (low digital maturity):** skew toward missing privacy policies _(provisional)_.

## Audit takeaways

- **Fix the cert-error bug first:** catch the TLS error code in `fetchPage.ts` before the http fallback and record `tlsCertError` distinctly — a blocked "connection is not private" page is mis-recorded today as a mere `https:false`.
- **Grade the single `reviews` boolean into ordered sub-signals** (lowest→highest): reviewsAny → named/photo testimonial → numeric star rating → review count → AggregateRating JSON-LD → live embedded/linked Google/Yelp reviews; Google Verified is a service-vertical bonus; BBB/security seals are recorded-but-neutral.
- **Decompose `contactForm`** into contactForm + formEndpointHttps + formSpamProtection (prefer Turnstile over reCAPTCHA) + privacyPolicyLink + formPurposeNotice, and **gate the privacy-policy expectation on detecting any form or booking link** — that makes "form present, policy absent" the precise, defensible PIPA finding.
- **Add a PIPA sub-rubric** (privacyPolicyLinked, https, crossBorderVendorsDetected as AUTO; purposeNoticeNearForm, privacyOfficerNamed as manual-review caveats) feeding `computeGrade`; drive vendor detection from the existing Playwright collector and a maintained US-processor table shared with the shippable privacy component.
- **Mitigate homepage-only scanning:** if a privacy-policy href is found, do one extra fetch of that page and run the officer/offshore-text checks there; otherwise label unfound items "not found on homepage (review)," never "absent," and downgrade confidence.
- **Ship the privacy component that auto-passes** the line ~two-thirds of prospects fail _(provisional)_: footer-linked route, named privacy-officer slot, near-form purpose notice, explicit offshore-provider list, unchecked marketing opt-in. (New shared component dir → remember the Tailwind `@source` rule.)
