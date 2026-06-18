# Internal Scoping — Restyle Salon | Premium Hair, Skin & Spa

- **URL:** https://www.restylesalon.com/
- **Vertical:** salon · **Google:** 4.8★, 1823 reviews (Calgary)
- **Audited:** 2026-06-18 · **Grade:** C (high confidence) · **Tier:** tune-up
- **Reachable:** true · **Blocked:** false · **Platform:** unknown (not legacy/WordPress)

## Verdict: TUNE-UP, not a rebuild

The collector grades this C/tune-up, and the visual review **confirms** it (does not upgrade to rebuild). The live site is already a modern, well-designed salon page: dark editorial hero with real photography, a "Signature Services" grid with prices and per-service ratings, a styled FAQ accordion, an Instagram feed, and a clear booking CTA. PSI mobile performance is **91 (A)**, desktop **98** — fast, not a slow WordPress build. This is a strong-base site with a few surface gaps, not a candidate for a full rebuild. Per `packaging.md` (grade B–C → targeted tune-up mini-engagement), we should pitch a small specific fix, not the $1,500 flat build.

## Chosen direction

No template/rebuild needed. If we win the work it is a **targeted tune-up mini-engagement** on their existing site — close the two named gaps. Design reference only (not to ship): `sites/tmpl-salon-*` for any layout cues. Do **not** propose porting them onto our engine; that would be a downgrade of an already-good site and isn't honest scoping.

## Content that already ports / is present (no migration needed)

- Services + prices — present (Signature Services grid with prices)
- Hours — present (`inventory.hours: true`)
- Address / map — present (`addressOrMap: true`)
- Booking — present (`bookingLink: true`)
- Click-to-call — present (`clickToCall: true`)
- LocalBusiness JSON-LD — present (`localBusinessJsonLd: true`)
- HTTPS, OG tags, favicon, contact form, mobile viewport — all present

## Gap list (the only build/tune-up tasks)

From `fixes.targeted`:
1. **Surface reviews / social proof on-page** (`reviews: false`) — they have 1823 Google reviews at 4.8★ but the homepage doesn't surface a star rating + recent count + a named testimonial near the hero/CTA. Highest-impact gap given the strength of their actual reputation.
2. **Add Menu/service structured data** (`menuSchema: false`) — their service+price list isn't marked up as structured data, so Google can't render rich service info.

Secondary polish (from `fixes.general`, optional, not headline):
- "Buttons do not have an accessible name" — a11y fix (PSI accessibility 89/B).
- `user-scalable="no"` / restrictive viewport — accessibility + pinch-zoom.
- Render-blocking requests / legacy JS / unused JS — minor perf trims (already A-grade).

## Package / price / effort

- **Engagement type:** Tune-up mini-engagement (grade C, solid base, surface issues) — **not** the $1,500 flat rebuild.
- **Scope:** surface reviews/social-proof block + add Service/Menu structured data; optionally the small a11y/viewport fixes.
- **Price:** per-change, pay-as-you-go touch-up quote (small fixed quote for the two targeted items). No subscription, no maintenance.
- **Effort:** low — a couple of focused changes; no migration, no redesign.

## Honesty notes (for the report / outreach)

- CWV: `cwv.pass: false` is driven by **lab LCP 3.4s** (CLS 0, INP null — no CrUX field data). Frame as *indicative lab data*, not "Google's verdict." Site is genuinely fast (PSI 91 mobile / 98 desktop); do not overstate a speed problem.
- Do **not** manufacture problems — this is a good site. Lead with the social-proof gap (real, defensible, high-value given 1823 reviews) and the schema gap. Be honest that design/perf are already strong.
