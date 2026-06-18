# Internal Scoping — Lavish Salon (www.ilovelavish.com)

**Audited:** 2026-06-18 · **Vertical:** salon (Calgary) · **Google:** 4.8★, 780 reviews
**Collector verdict:** grade **C** (high confidence) · tier **tune-up** · reachable, not blocked
**Stack:** Squarespace (not legacy) · HTTPS ✓ · mobile perf **56** · LCP **16.0s lab** (CWV `pass:false`, CLS 0.004 fine)

## Recommendation: TUNE-UP, not rebuild

The site is already a clean, modern, editorial Squarespace build — real salon photography, serif display type, a working "Book Now" CTA, services, hours, reviews, contact form. Visually it matches a premium salon's price point; there's no "AI slop" / dated-theme case for a rebuild. Per the scoping rubric (grade B–C = targeted tune-up, not a full package), this is a **mini-engagement** centered on the one real problem: **performance**. A full $1,500 rebuild is NOT the right pitch here and would be hard to justify against a site that already looks good.

The single defensible headline: **mobile performance 56 / LCP 16s (lab) driven by unoptimized images** — on Squarespace this is structural and hard for the owner to fix themselves. That's the hook.

## Chosen template direction (reference only)

`sites/tmpl-salon-*` for layout/token reference if we ever do go to a rebuild — but for the tune-up we do NOT rebuild on `packages/shared`. The tune-up either (a) optimizes within Squarespace, or (b) if they want to leave Squarespace, becomes the standard $1,500 flat-fee Astro build + migration add-on. Default pitch = the targeted performance/SEO fix.

## Content that ports over (if rebuilt)

- **Services:** Cuts, Color, Styling (service list present; no per-service prices visible on homepage — confirm at intake).
- **Hours:** present on site ✓.
- **Reviews:** present ✓ (4.8★ / 780 Google reviews — strong social proof to surface near hero/CTA).
- **Booking:** working "Book Now" CTA already wired — port the same booking provider.
- **NAP:** phone / click-to-call present ✓; **address + map MISSING** (see gaps).
- **Imagery:** real interior + stylist photos already on-site — reusable (re-encode to right-sized WebP, which is also the perf fix).

## Gap list (missing `fixes.targeted`)

1. **Address + map (local SEO)** — `addressOrMap: false`. No structured location on a local salon hurts "near me" discovery.
2. **LocalBusiness JSON-LD** — `localBusinessJsonLd: false`. Ship `HairSalon`-typed JSON-LD (structured address/geo/hours). Never self-`aggregateRating`.
3. **Menu/service structured data** — `menuSchema: false` (salon service list).
4. **Image perf hygiene** — missing `alt`, missing explicit `width`/`height` (CLS risk), legacy JS, font-display — all flowing from Squarespace defaults.

## Package / price / effort

- **Engagement:** **Tune-up mini-engagement** (per packaging.md, grade B/C → targeted fix, NOT the $1,500 flat build).
- **Scope of tune-up:** image optimization pass + add address/map + LocalBusiness + service schema. Quoted as a small fixed fee (per-change / mini-engagement; confirm number with operator — not a published tier).
- **Effort:** low — a handful of targeted fixes, no full rebuild. Most of the win is image re-encode + 3 schema/SEO additions.
- **Upsell path if they want off Squarespace:** standard **$1,500 flat-fee Astro rebuild + content-migration & 301 add-on** (required on any rebuild to protect rankings). Lead with the tune-up; offer the rebuild only if they ask for more.

## Client-facing next step

Send the 1-page `audit-www.ilovelavish.com.html`. Hook = "your site looks great but loads slowly on phones (most of your clients) — here's the before/after we'd get you." Offer a quick perf-focused demo, not a full redesign pitch.
