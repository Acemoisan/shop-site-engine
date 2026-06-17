# Conversion & UX Audit Briefing

Synthesis of the audit knowledge base's conversion-dimension claims — CTA placement, click-to-call, booking/order flows, form friction, and trust-cue placement for Calgary local-shop sites. (All 85 conversion claims carry `provisional` confidence, so every point below is provisional; the `_(provisional)_` tag is omitted only because it would apply universally — treat magnitudes as directional and the structural principles as robust.)

## Necessary (must / should-have)

These are the table-stakes that should anchor any rubric. Leading with the must-haves of highest impact:

- **Real `tel:` click-to-call, above the fold.** The phone number must be a real `tel:` anchor in E.164 format (`+1...`, no spaces/dashes in the href) so one tap dials; plain-text or image-only numbers forfeit the call. A phone rendered as plain text is flagged as a high-frequency, highest-ROI defect on local-shop sites. Display value can stay human-formatted while the href uses E.164.
- **One visually dominant primary CTA above the fold.** A single high-contrast primary action beats equal-weight competing CTAs (decision paralysis); secondaries should be ghost/outline or text links. ~70% of small-business homepages lack a clear above-fold CTA, and above-fold CTAs have ~73% visibility vs ~44% below.
- **Primary CTA mapped to the vertical's macro-conversion.** Conversion priority is set per vertical, not uniformly — the primary CTA = booked appointment / submitted quote / order / reservation / in-store visit, with micro-conversions (call, directions, hours, menu-view) as secondary support. One shared engine themes the CTA stack per shop.
- **Guest booking/order flow — never gate on account creation.** 19% of US shoppers have abandoned specifically because a site forced account creation; the default path is guest (name + contact), with account creation offered only after commitment. This is a vendor-selection criterion (prefer Square / Calendly / OpenTable / ChowNow guest paths).
- **Minimal, low-friction forms.** Ship a 3-field minimum (Name + Email + Message); completion drops non-linearly with field count (~32% at 1 field → ~23% at 3 → ~17% at 5 → ~11% at 7 → ~7% at 10+). Phone field, if present, must be **optional** — mandatory phone can cut conversions by >50%.
- **Correct mobile input attributes.** `type=email autocomplete=email`, `type=tel autocomplete=tel` (numeric dial pad), `autocomplete=name` — cheap to implement, high mobile-UX payoff; wrong/absent attributes force a full QWERTY keyboard and kill autofill.
- **Click-to-call tap targets sized for thumbs.** WCAG 2.2 SC 2.5.8 floor is 24×24 CSS px; practical target is 44–48px (iOS 44pt / Android 48dp). Persistent CTA belongs in the mobile thumb zone (bottom bar / bottom-right), high contrast.
- **Mobile-responsive and fast.** A site that fails mobile usability or loads slowly makes every CTA effectively invisible; a viewport meta tag is necessary-not-sufficient. Bounce probability rises 123% as mobile load goes 1s→10s. Perf is a conversion blocker, not just an SEO metric.
- **Compact star rating + review count near the primary CTA / in hero.** Described as the single highest-leverage, always-reused trust cue. Named testimonials with a real photo beat anonymous/text-only quotes and should sit near decision points, not on an isolated page. Real owner/staff/work photography beats stock.
- **Hours + NAP co-located with the CTA.** A ready-to-act visitor needs "are they open / where / how do I reach them" answered at the decision point, not scattered in the footer.

Should-have layer (high value, less absolute):
- **Hero CTA + persistent sticky CTA pairing on mobile** so the action is reachable at every scroll depth (sticky bottom-bar CTAs reportedly ~+31% conversions vs non-sticky; a plain duplicate sticky button gave ~+8%). The engine currently has no sticky bottom-bar component.
- **Specific review COUNT beats a bare star rating** ("247 reviews"); volume and recency increasingly matter (47% won't use a business with <20 reviews; 74% want reviews from the last 3 months).
- **Single-column forms, top-aligned labels, on-blur inline validation, honeypot (not CAPTCHA), and a real success confirmation** that restates response time and re-exposes click-to-call.
- **Three-placement CTA repeat**: same primary action in nav + hero + closing section.

## Niche / situational

- **Call tracking via Dynamic Number Insertion (DNI)** — *nice-to-have, rare.* If used, swap the displayed number with JS while keeping the canonical number hard-coded in HTML + LocalBusiness JSON-LD to preserve NAP. Tension with the no-maintenance model: prefer a client-owned CallRail-style account. Mostly out-of-scope for the base build, but leave the static-number seam intact.
- **Embedded live Google-review / third-party widgets** — *nice-to-have, rare.* A supplement, not a replacement for on-page rating+count; weigh the Core Web Vitals cost (LCP/INP). Prefer statically rendered curated reviews + a "See all on Google" link.
- **Pop-up/modal booking widgets** — situational fallback when a full inline embed would bloat or break layout; keeps the user on-domain (good default for the nav/sticky Book button while inline lives on the service page).
- **Multi-step forms** — only when 6+ fields are genuinely required (recovers conversion: +14% at 5 fields, +19% at 7, +32% at 10); beyond ~4 steps adds friction without benefit. Short local-shop forms should stay single-step.
- **Long qualifying/intake forms** (legal case details, medical history, full diagnostics) belong in the client's internal intake tool, deferred to the callback — not on the public first-touch form.
- **PIPA-aligned privacy microcopy** at the form (Alberta context) rather than US-centric Norton/McAfee seals; Canadian credential equivalents (Law Society of Alberta) over US Avvo/Super Lawyers.

## Always reused vs rare

**Always reused / always-present (every vertical):**
- Click-to-call (`tel:`) co-existing with the booking widget — never let a booking widget remove the phone path.
- Single dominant primary CTA + co-located trust cue (rating + count) + co-located NAP/hours.
- The same primary action echoed across nav, hero, and closing CTA.
- Minimal form with correct mobile input attributes.

**Common-but-missing (the rubric's richest hunting ground — present in best practice, frequently absent on prospect sites):** sticky/persistent mobile CTA; real `tel:` anchor (vs plain text); above-fold primary CTA; review count near the CTA; named testimonials with photos near decision points; guest-checkout booking; correct mobile input attributes; hours/NAP co-located with CTA; per-vertical macro-conversion mapping; specific outcome-oriented CTA copy; dental real-time scheduler (vs request form); privacy reassurance at the form.

**Rare (low prevalence — high severity when present, but not the bread-and-butter findings):** DNI call tracking; live review-widget embeds; inline real-time validation (31% of sites still lack it); silently-failing/unusable mobile forms (hard to detect statically — flag as manual/visual review); missing HTTPS at the form (most hosts now default to HTTPS); the full trust-signal placement hierarchy (pick 2–3 per page).

## Most vs least common

- **Most common defects to expect** (high prevalence, `common` / `common-but-missing`): no above-fold primary CTA; phone as plain text instead of `tel:`; non-mobile-responsive or slow pages; forms too long / required phone; PDF menus instead of HTML; buried booking; weak/absent trust cues near the CTA. These should carry the most rubric weight.
- **Least common but high-severity**: missing HTTPS on the form, silently-failing forms, absence of inline validation, DNI — lower prevalence, so weight them as severity-when-present rather than primary scoring axes.

## What works vs what doesn't

**Works (general):** one dominant high-contrast primary CTA; persistent/sticky mobile CTA in the thumb zone; real `tel:` anchors; short single-column forms with optional phone and correct mobile keyboards; guest flows; inline/on-domain booking embeds; trust cues (rating + count, named testimonials with photos, real photography) flanking the CTA; specific outcome-oriented button copy ("Book Your Appointment," "Schedule a Free Case Review") over generic "Contact Us"/"Submit."

**Doesn't work:** plain-text/image phone numbers; multiple equal-weight competing CTAs; account-creation gates; required phone fields and long forms; placeholder-only labels (NN/G: more errors, slower, worst for older users, fails contrast); raw iframe booking embeds on mobile (no auto-resize, cut content — the worst-on-mobile option); off-site redirects before the user commits; stock imagery; trust cues isolated in the footer or a separate page; PDF menus/price lists (force pinch-zoom, weak SEO).

**Per-vertical notes:**

- **Trades / home services:** PRIMARY = click-to-call (NOT a quote form). ~83% of homeowners prefer to call; phone leads convert ~10–15x web forms; quote form is the secondary after-hours path. Trust cues: licensed/bonded/insured + workmanship warranty + accreditation (BBB) badge strip near the hero CTA and in Features (verify Alberta license/bond terminology vs US framing).
- **Auto repair:** Split signal. One claim: phone dominant (CDK/Pied Piper 2025: ~64% still call vs ~19% online) → click-to-call primary, booking widget secondary. Another: book-primary, call strong-secondary (~75% prefer online, ~40% of appointments booked after-hours). Net: offer both, lead with phone for urgent jobs, expose a 24/7 booking widget. Trust cues: ASE-certified badges, parts-and-labor warranty (12mo/12k), RepairPal/AAA Approved.
- **Dental:** PRIMARY = online booking ("Book Your Appointment" lifts clicks ~25% over "Contact Us"); default to an embedded **real-time scheduler, not a request/contact form** (practices report 30–40% higher new-patient conversion). Click-to-call secondary. Trust cues: real patient before/after photos (with consent/PIPA), staff credentials, named/video testimonials.
- **Barber / salon:** PRIMARY = "Book now" online scheduler; call secondary (77% find calling easiest for *changing* an existing appointment). Show full service pricing + durations next to the Book CTA. Trust cues: real before/after / work gallery, Instagram embed, practitioner credentials.
- **Spa / med-spa:** The edge case among appointment verticals — skews more phone-heavy (~57% of bookings via phone/in-person/recurring), so weight call nearly co-equal with book. Before/after photos and credentials are decisive.
- **Fitness / gym:** PRIMARY = low-friction trial offer ("Try a Free Class" / "Get Started") above the fold and in nav — the macro is a trial/lead, not a single booked slot; urgency and bundling help.
- **Cafe / restaurant:** Hierarchy = menu-view → order/reserve → directions/hours; the menu is the most-visited page and must be HTML, not PDF. Two variants: quick-serve cafe → PRIMARY "View Menu" + "Get Directions/Hours" (walk-in micro-conversions are the goal); full-service → PRIMARY "Order Online" or "Reserve." Keep ordering/reservation embedded on-domain; capture intent on-site (party/date/time) and hand off only at the commit step (OpenTable pattern).
- **Retail:** Branch on model. Foot-traffic shops → PRIMARY "Get Directions" + "Visit Us"/hours, call secondary (the directions click is itself a tracked local conversion). Online-selling shops → PRIMARY "Shop/Buy." Expose a model switch rather than assuming e-commerce.
- **Law:** PRIMARY = a high-trust "Free Consultation / Free Case Review" delivered as BOTH a sticky click-to-call number (on every page) AND one short intake form. ~84% of law-firm calls are mobile; speed-to-answer dominates; vague "Contact Us" underperforms specific copy. Trust cues: professional badges (bar membership, BBB) and case-results/named testimonials — their *absence* is itself a red flag. Verify Canadian equivalents.

## Audit takeaways

For a rubric-builder, the highest-leverage upgrades to a binary checklist:

- **Make `tel:` placement-aware, not just presence.** Verify a real `tel:` anchor (E.164 href) that is tappable AND above-the-fold / in the sticky mobile nav — not merely a `tel:` string somewhere in the HTML. Weight this highest for call-driven verticals (trades, auto, dental, law, barber/spa without online booking).
- **Add an above-the-fold + single-dominant CTA check.** Detect a primary CTA inside the hero/first viewport, and flag multiple equal-weight competing CTAs. Tie the expected CTA *type* to the vertical's macro-conversion (call vs book vs order/reserve vs directions vs trial).
- **Upgrade form scoring from presence to a friction score.** Count visible fields (penalize >5), flag required phone, flag placeholder-only labels and on-submit-only validation, and prefer click-to-call alongside any form (for call-driven verticals the fix is often "add click-to-call," not "optimize the form"). Check guest vs account-gated booking.
- **Score trust-cue placement, not just presence.** Require rating + **specific review count** near a CTA / above the fold, named testimonials with photos near decision points, and a privacy line at the form; check the per-vertical badge strip (licensed/bonded/insured, ASE, bar membership) where relevant.
- **Treat mobile usability and speed as conversion blockers.** Upgrade the viewport-meta check to a real mobile-usability signal (Lighthouse/PSI mobile) and weight LCP/INP/CLS as conversion-killers (a CTA after a CLS shift or 5s LCP is functionally absent).
- **Flag PDF menus/price lists** (linked `.pdf` where a menu/services list is expected) for cafe/restaurant — and also spa, barber, auto — as a should-have defect; the fix is an HTML services list.
