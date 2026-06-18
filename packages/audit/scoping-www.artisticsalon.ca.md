# Internal Scoping Note — Artistic Salon (www.artisticsalon.ca)

**Date:** 2026-06-17 · **Vertical:** salon · **Platform:** Wix (not flagged legacy)
**Grade:** C (high confidence) · **Tier:** tune-up (collector) → **rebuild lean** on visual + perf grounds
**Google:** 4.9★ / 719 reviews (Calgary) — strong reputation, site undersells it.

## Verdict
Feature-complete on paper (booking, click-to-call, hours, NAP, reviews, contact form, OG, favicon all present — conversion grade B), but the **rendered page is sparse, broken-feeling, and slow**, with large empty bands, a cut-off hero wordmark, and an orange-on-orange services menu that's hard to read. A 4.9★/719-review salon deserves better than a stock Wix layout. Lead the pitch on **speed + the visual mismatch with their reputation**, not the (thin) feature-gap list. Pitch as a rebuild; fall back to a tune-up if budget-sensitive.

## Chosen template direction
- Production build = new `sites/artistic-salon` on `packages/shared` via the **create-shop-site** skill (one engine, themed per shop). Mine `sites/tmpl-salon-*` for layout/token ideas only.
- **Tokens / feel:** keep their warm terracotta/peach brand equity but fix it — use peach/terracotta as an *accent* over a clean light-neutral background and a strong dark foreground (kills the orange-on-orange contrast fail). Display font for the wordmark/headings (their current logo is getting clipped), readable body font. Generous whitespace replaces the current empty dead-bands with intentional rhythm.
- Hero: full-bleed real salon-interior photo (they already have good interior + work shots) + tagline + dominant "Book / Free Consultation" CTA, eager `fetchpriority="high"`.

## Content that ports straight over (their site is the content source)
- **Services + prices:** Women's (Cut/Shampoo & Style, Blow-dry, Bang Trim, Wash Set, Updo, Root Touch-up, Color, Highlights/Full Highlights, Perm, Special Perm & Style, Keratin treatment, Balayage – Upon Consultation) and Men's (Better Cut & Shampoo & Style, Bang trim, Cut, Sleek Conditioning Treatment, Highlights, Perm) — pull exact names/prices from their menu section.
- **Stylist roster:** named team (Kevin/Director, Lily, Pemb, Kerry, Mercedes, Sara, Mu, Danielle) with roles — port as a team/"meet the stylists" block.
- **Free Consultations** blurb + the "Let's get to know each other" intro/about copy.
- **Hours, address/map, phone (click-to-call), booking link, contact form** — all present; carry over and wire the one included booking embed (Fresha/Square — confirm which they use).
- **Reviews / social proof** — surface the 4.9★ / 719-review count near the hero CTA (manual star + count + a named quote; never self-`aggregateRating` in JSON-LD).
- **Gallery** of real cut/color work (already on their site).

## Gap list (close on build)
- **`fixes.targeted`:** add `LocalBusiness` (HairSalon) JSON-LD with structured address/geo/hours; add Menu/service structured data (salon service list). Both missing today.
- Meta description (missing). Form has unlabeled `<select>` elements (a11y) — fix on rebuild.
- Contrast: background/foreground contrast fails (the orange-on-orange) — resolved by the token redesign to AA best-practices at handoff.
- "Page is blocked from indexing" appeared in failed audits — **verify on their live site** whether the homepage is actually noindex; if so that's a serious findability flag worth raising. (Could be a Wix staging/robots quirk — confirm before asserting to the prospect.)

## Performance (the headline)
- PSI mobile performance **70**, **desktop 43** (slow). Lab **LCP ~4.47s** (CWV `pass:false`), CLS 0.004 (fine). No CrUX field data — frame LCP as *indicative lab data*, not Google's field verdict.
- Static Astro rebuild target: **LCP ~4.5s → under 2.5s**, CWV pass, image delivery fixed (WebP, sized), unused JS removed (Wix ships heavy JS). This is the concrete before→after to lead with.

## Package / price / effort
- **Recommended: $1,500 flat-fee rebuild** (every site = same core components; one engine, themed). Booking embed (one) included. Treat the 4.9★/719-review reputation as the reason to do it right, not patch it.
  - Likely add-ons to quote up front: **content migration + 301 redirect mapping** (required on any rebuild — top cause of ranking loss; they have an established Wix URL/history), and optionally a **GBP optimization pass**.
- **Fallback (budget-sensitive):** targeted **tune-up** mini-engagement — add JSON-LD + Menu schema + meta description, fix contrast + form labels, re-host hero/images for speed. Cheaper, but leaves them on slow Wix; weaker outcome. Default pitch is the rebuild.
- **Effort:** standard single-shop build (token theme + content fill + Storyblok wiring + verify). Content is rich and already on their site → mostly migration, not authoring.

## Client-facing next step
Send `audit-www.artisticsalon.ca.html`. Hook: "Your reviews are exceptional (4.9★, 719) but your site loads slowly and looks thinner than your reputation — here's a faster, cleaner version." Offer a quick before/after using the salon template.
