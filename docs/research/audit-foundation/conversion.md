# Conversion & UX

How Calgary local-shop sites turn visitors into calls, bookings, orders, and visits — CTA placement, click-to-call, booking/order flows, form friction, and trust-cue placement, synthesized from the re-verified conversion claim set.

## Necessary (must / should-have)

The non-negotiables, lead with the highest-impact:

- **Exactly one visually dominant primary CTA, above the fold.** A single high-contrast action (filled button) outperforms competing equal-weight CTAs, which cause decision paralysis. Secondary actions stay subordinate (outline/ghost), tertiary as text links. ~70% of small-business homepages lack a clear above-fold CTA; above-fold CTAs see ~73% visibility vs ~44% below.
- **The phone number must be a real `tel:` anchor in E.164 format** (`href="tel:+1..."`, no spaces/dashes inside the href; human-formatted display is fine). Plain-text or image-only numbers forfeit the one-tap call — a high-frequency, highest-ROI defect. A tappable number in a sticky mobile header is the single highest-converting element for most local service businesses.
- **Set conversion priority per vertical, not uniformly.** The primary CTA maps to the vertical's macro-conversion (booked appointment / submitted quote / order / reservation / in-store visit); micro-conversions (call, directions, hours, menu-view) are secondary support. One shared engine themes the CTA stack per shop.
- **Surface a compact star rating + review count near the primary CTA and in the hero — not the footer.** This is the single highest-leverage, always-reused trust cue. Use a specific numeric count ("247 reviews"), not stars alone — count outperforms a bare rating and recency matters (BrightLocal 2026: 47% avoid businesses with <20 reviews; 74% want reviews from the last 3 months).
- **Named testimonials with a real photo** (and role/credential where relevant) convert materially better than anonymous or text-only quotes, scattered near decision points (near CTA/form), not isolated on a testimonials page.
- **Ship the minimal contact form: Name + Email + (optional) Phone + Message — 3–4 fields, single column.** 3 fields is the practical optimum; forms under 5 consistently outperform longer ones (one case cut 11→4 fields for +120%; HubSpot 4→3 = ~50% lift). A required phone field depresses completion (~5% average dip; mandatory phone can cut conversions >50%) — keep phone **optional, never blocking submit**.
- **Mobile inputs must declare correct `type`/`inputmode`/`autocomplete`** (`type=email autocomplete=email`, `type=tel autocomplete=tel` for the numeric pad, `autocomplete=name`). Cheap to implement, high mobile-UX payoff on a majority-mobile audience.
- **Co-locate hours + NAP (name/address/phone) with the CTA**, so a ready-to-act visitor can confirm open/where/how-to-reach at the decision point — not scattered only in the footer.
- **HTTPS on the form.** Data-use/trust anxiety is a top abandonment driver (~19% self-reported); a "Not Secure" warning at data entry directly suppresses submission. Now low-prevalence but a hard blocker when present.
- **Guest booking by default** — never gate booking/order behind account creation (19% of US shoppers have abandoned specifically because a site forced signup). Offer account creation *after* commitment. This is a vendor-selection criterion (prefer Square / Calendly / OpenTable / ChowNow guest flows).
- **Keep click-to-call alongside the booking widget on every appointment vertical** — a parallel path, never replaced by it.
- **Mobile load/perf is a conversion blocker, not just SEO.** A CTA that loads after a CLS shift or 5s LCP is functionally absent; bounce probability rises 123% as mobile load goes 1s→10s. Static-Astro output is the natural fix and a strong before/after outreach proof-point.

Strong should-haves:

- **Pair an above-fold hero CTA with a persistent (sticky) CTA** so the action is reachable at every scroll depth — hero captures ready-now visitors, the sticky element re-presents after they scroll past. Sticky bottom-bar CTAs are reported to lift conversions ~25–31% on mobile (e-commerce figures, directional).
- **Place the persistent CTA in the mobile "thumb zone"** (bottom bar / bottom-right float), tap target ≥44×44px (WCAG AA floor is 24×24px; 44–48px is the practical target), high contrast.
- **Repeat the primary CTA in nav + hero + closing section** (low-friction at top → mid-funnel lead CTA after the value prop → highest-intent CTA repeated at the bottom). The repo's SiteNav/Hero/CTA layout already encodes this; per-vertical work is choosing *which* action fills the slots.
- **Specific, outcome-oriented CTA copy** driven by theme/content, not hardcoded generic "Contact Us"/"Submit" (e.g. "Book Your Appointment" ~+25% dental clicks, "Call Now — Free Quote", "Schedule a Free Case Review", "Try a Free Class", "Get Directions").
- **Single-column form, top-aligned labels, on-blur inline validation.** Single-column completed ~15.4s faster (CXL, 702 participants); placeholder-only labels raise errors and fail contrast (NN/G); 31% of sites still lack inline validation (Baymard) — debounce on blur, not every keystroke.
- **Trust-signal placement hierarchy: pick 2–3 per page, don't stack.** Compact rating+count in hero → a named testimonial or guarantee near the CTA → a privacy reassurance line at the form ("Your info is secure and never shared", Alberta PIPA-aligned wording, not US Norton/McAfee seals).
- **Post-submit confirmation that sets expectations** ("We'll call within X hours") and re-exposes click-to-call, not a bare collapsing "thank you".
- **Real owner/staff and real work photography** over stock — visitors detect stock and trust drops (token-driven imagery rule, not a component change).

## Niche / situational

- **Dynamic Number Insertion (DNI) for call tracking** — only if the client runs a (self-owned, e.g. CallRail) tracking account. Keep the real number hard-coded in static HTML + LocalBusiness JSON-LD so DNI swaps for humans without breaking NAP consistency. Mostly out-of-scope for the base one-time build; worth a documented seam.
- **Embedded live Google reviews / third-party review widgets** add independent-verification credibility but are a supplement, not a replacement for on-page rating+count — and their JS can hurt LCP/INP. Prefer statically rendered curated reviews + a "See all on Google" link; reserve embeds for when freshness is the selling point.
- **Pop-up/modal booking widgets** (Calendly pop-up, Square modal) are the recommended fallback when a full inline embed would bloat the page or break layout — keeps the user on-domain, triggers from a contextual CTA. Good default for the nav/sticky CTA while inline lives on the service page.
- **Multi-step form layout** — only switch to it when 6+ fields are genuinely required _(provisional)_; it recovers conversion past the 5-field cliff (+14% at 5, +19% at 7, +32% at 10; quote forms ~+12%). Beyond ~4 steps adds friction without benefit. Default stays ≤5 visible fields.
- **Invisible honeypot** (CSS-hidden, `aria-hidden` + `tabindex=-1`) over visible CAPTCHA _(provisional)_ — CAPTCHAs cost ~3% of conversions and ~15% abandon when challenged. Honeypot is frictionless and sufficient for low-volume local-shop spam (Web3Forms ships one).
- **Silently-failing / unusable mobile forms** (broken submit, no confirmation, tiny tap targets) — low prevalence but high severity; hard to detect statically, so flag as a visual/manual review item rather than an automated check.

## Always reused vs rare

**Always reused (every vertical, `*`):** real `tel:` anchor; one dominant above-fold CTA; rating+count near the CTA/hero; named testimonials near decision points; the minimal 3–4-field single-column form with correct mobile input attributes, on-blur validation, and a confirmation state; hours+NAP co-located with the CTA; HTTPS; per-vertical CTA priority; the nav+hero+closing repeat-CTA pattern; sticky mobile CTA; specific CTA copy; real photography; the 2–3-cue trust hierarchy. These are the shared-engine guardrails.

**Rare / specialized:** DNI call tracking; honeypot vs CAPTCHA tuning; inline-validation edge handling; live third-party review embeds; the "pick 2–3, don't stack" enforcement; detecting silent form failures. Low prevalence, applied only when conditions warrant.

## Most vs least common

**Most common (table-stakes, expected on nearly every build):** click-to-call + booking/order entry points, an above-fold CTA, hours/NAP, reviews, and a contact form — these recur across verticals and the engine already inventories most of them.

**Common-but-missing (the audit gold — present in the playbook, absent on most prospect sites):** the hero+sticky CTA pairing and a sticky bottom-bar component; a clear above-fold primary CTA (~70% of SMB homepages lack one); a genuine `tel:` anchor (vs plain text); the minimal correctly-attributed form; rating+count and named testimonials placed *near the CTA* rather than buried; hours+NAP co-located at the decision point; guest booking (no account gate); per-vertical conversion priority; specific CTA copy; and instant online booking for dental _(provisional)_. These are the highest-leverage outreach and rebuild angles.

**Least common:** DNI, live review embeds, multi-step forms, silent-failure detection — rare by design.

## What works vs what doesn't

General — **works:** one dominant above-fold CTA echoed in nav/hero/closing + sticky; a real `tel:` anchor; rating+count and a named testimonial flanking the CTA; a 3–4-field form with correct mobile attributes and a confirmation that sets expectations. **Doesn't:** multiple equal-weight CTAs (decision paralysis); plain-text phone numbers; required phone fields and long forms; placeholder-only labels; on-submit-only validation; trust cues isolated mid-page or in the footer; account-creation gates; PDF menus/price-lists (force pinch-zoom, weak SEO, break mobile browsing — publish as HTML); off-site redirects mid-flow.

Per-vertical:

- **Trades / home-services** — Primary = **click-to-call** ("Call Now — Free Quote"), quote form as the *secondary* after-hours fallback. ~83% of homeowners prefer to call; phone leads convert ~10–15x web forms; response speed matters (78% hire the first to respond). Trust cues: licensed/bonded/insured + workmanship warranty + accreditation badge (e.g. BBB) near the hero CTA — verify Alberta license/bond terminology. _The phone-first multiplier and click-to-call urgency claims are provisional._
- **Auto repair** — Two signals in tension, both verified: phone is still the dominant *booking channel* (~64% call vs ~19% online, CDK/Pied Piper 2025) → make `tel:` prominent; but ~75% *prefer* to schedule online and ~40% of appointments are booked after-hours, so default Primary = **Book Appointment** with click-to-call a strong secondary. Trust cues: ASE-certified badges, stated parts-and-labor warranty (e.g. 12mo/12k), RepairPal/AAA Approved.
- **Dental** — Primary = **Book Appointment** (real-time instant scheduler, not a "Request an Appointment" form _(provisional)_, ~30–40% higher new-patient conversion); click-to-call secondary. Trust cues: real before/after photos (consent/PIPA), staff credentials, named/video patient testimonials.
- **Barber / spa / fitness (salon-type)** — Primary = **Book / Book now** to an online scheduler (online booking is majority-preferred ~78% vs ~22% phone; ~49% lower no-shows); lowest-friction flow is **service → time → confirm (guest)** — at most three steps before commitment _(per-field/per-step friction figures provisional)_. Show pricing + durations next to the Book CTA. Trust cues for visual-service verticals: a real before/after or work gallery (stock model photos hurt), Instagram embed, practitioner credentials.
  - **Spa is the edge case** _(provisional)_: more phone-heavy (~57% of bookings still phone/in-person), and 77% find calling easiest to *change* an appointment — weight call nearly co-equal with Book.
- **Fitness/gym** — differs from book-a-slot: Primary = a **low-friction trial offer** ("Try a Free Class" / "Get Started") above the fold and repeated in nav; the trial is the entry macro that funnels to membership.
- **Cafe / restaurant** — Hierarchy is **menu-view → order/reserve → directions/hours**; menu is the most-visited page (publish as HTML, never PDF). Two variants: quick-serve cafe defaults Primary to **View Menu + Get Directions/Hours** (walk-in); full-service restaurant defaults to **Order Online** or **Reserve**. Embed the order/reservation handoff on-domain; capture intent on-site and defer the redirect to the commit step (OpenTable collects date/time/party-size inline, hands off only for final availability).
- **Law** — Primary = a **"Free Consultation / Free Case Review"** delivered as *both* a sticky click-to-call number on every page *and* one short intake form; ~84% of law-firm calls are mobile and speed-to-answer dominates. Specific high-intent copy beats vague "Contact Us"; one primary CTA above the fold, not many (CTA overload is cited as a top reason ~65% of firm sites fail to convert). Trust cues: third-party badges (Super Lawyers, Avvo, bar membership, BBB — verify Canadian/Law Society of Alberta equivalents) and case-results/named testimonials; their *absence* is itself a red flag.
- **Retail** — branches on model: foot-traffic shops default Primary to **Get Directions / Visit Us + hours** with call secondary (the directions-click is itself a tracked local conversion) _(prevalence figures provisional)_; online-selling shops default to **Shop / Buy** with pickup/directions secondary. Expose a model switch; don't assume e-commerce.
- **Quote-driven group (trades, auto, law, dental, spa)** — keep the public first-touch form short (Name/Email/optional-Phone/Message); defer long qualifying/intake detail (case details, insurance, medical history, diagnostics) to the callback, not the marketing site.

## Audit takeaways

- **Check the phone number is a real `tel:` anchor (E.164) AND above-the-fold / in the sticky mobile nav — not just present somewhere in the HTML.** Plain-text numbers and footer-only placement are the #1 highest-ROI defect for call-driven shops and the strongest outreach angle.
- **Score the CTA, not just its presence:** is there one dominant primary CTA in the hero/first viewport, mapped to the vertical's macro-conversion, with secondaries de-emphasized? Flag multiple equal-weight CTAs and vague generic copy.
- **Turn the form check into a friction score:** count visible fields (penalize >5), flag a required phone field and long/multi-purpose intake, confirm correct mobile input attributes and a confirmation state, and prefer "add click-to-call" over "optimize the form" for call-driven verticals.
- **Assess trust-cue placement, not mere presence:** is a rating+specific-count visible in the hero/near the CTA, and a named testimonial beside the action? Footer-only or mid-page reviews score low.
- **Verify decision-point co-location:** hours + address/map + tappable phone reachable near the primary CTA, and HTTPS on any form. PDF menus/price-lists and off-site booking redirects are flaggable friction.
- **Weight mobile responsiveness and load as conversion blockers:** a viewport meta tag is necessary-not-sufficient — a real mobile-usability/perf signal matters because a CTA behind a 5s LCP or a CLS shift is functionally absent.
