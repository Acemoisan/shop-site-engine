# Internal Scoping — Gallery T Hair Studio

- **Prospect:** Gallery T Hair Studio — https://www.gallerytstudio.com/
- **Vertical:** salon · **Calgary** · 4.8★ / 385 reviews
- **Stack:** Wix (not flagged legacy) · HTTPS ok
- **Grade:** C (high confidence) · collector tier: `tune-up`
- **PSI:** mobile performance **40** (perf grade F) / desktop 80 · SEO 100 · a11y 93 · lab LCP **9.45s** (indicative lab, no CrUX field data) · CLS 0

## Recommendation: REBUILD (visual-review upgrade over the C/tune-up)

The rubric grade is C because feature *presence* checks mostly pass (booking link, hours, address, reviews, JSON-LD all detected). But the **visual review overrides this to a rebuild**:

1. **The page reads as a product storefront, not a salon.** Above the fold is a "Popular Products" grid (hair lotions/oils) over a generic plant-shelf hero — no salon work, no interior, no stylists, no service menu. A 4.8★/385-review salon's #1 job (get booked) is buried; the homepage sells $20 retail bottles instead.
2. **Mobile performance is F (40 / lab LCP 9.45s).** Wix ships heavy JS (unused JavaScript, legacy JS, TBT, main-thread work all failing). This is the conversion killer — most salon traffic is mobile "near me."
3. **No click-to-call and no real above-fold booking CTA.** Booking link exists somewhere in nav but isn't the dominant action; no `tel:` anchor at all.

A token-swap on Wix can't fix the architecture (speed) or the information hierarchy (storefront-first). Static Astro rebuild = the headline win: **lab LCP 9.45s → target < 2.5s**, plus a salon-correct layout.

## Template direction

- **Base:** `create-shop-site` → new `sites/gallery-t` on `packages/shared`, own `theme.css` + content. Mine `sites/tmpl-salon-*` for layout/token ideas (visual reference only).
- **Tone:** "art gallery / studio" — the brand already leans gallery (logo, B&W studio shots at the bottom of current site). Lean into editorial whitespace, a refined display+body type pairing, neutral/warm palette, real photography. Premium-but-approachable, salon-correct (not e-commerce-first).
- **Hierarchy fix:** Hero (salon imagery + dominant **Book** CTA) → Services/menu with prices → Reviews (4.8★/385, named testimonial) → Hours → NAP/map → closing CTA. Retail products demoted to a single optional "Shop our products" strip, not the headline.

## Content that ports straight over

- **Services + prices** — NOT visible on current homepage; pull from their booking system / service pages (likely Fresha/Booksy/Vagaro behind the Wix booking link). **Gap: confirm the booking provider during intake.**
- **Hours** — present, port over.
- **Reviews** — 4.8★ / 385 (Google); surface rating + a named recent quote at the decision point. Never self-`aggregateRating`.
- **NAP / map** — present (address + map detected).
- **Booking** — existing booking link → wire as the **one included** booking embed (whichever provider they use).
- **Images** — pull real B&W studio shots + any salon-work/interior photos from current Wix, re-encode to right-sized WebP (hero ~80–150KB). **Reject the generic plant/product stock as hero.** Likely need 1–2 better hero/work images → flag photo-sourcing add-on if thin.
- **Copy** — port the "About us" (Calgary salon, hospitality-led) blurb; tighten.

## Gap list (missing `fixes.targeted` → build tasks)

- **Click-to-call** (`tel:` E.164, above fold + sticky mobile header) — currently absent.
- **Contact form** (+ Alberta PIPA privacy note) — absent.
- **Menu/Service structured data** — absent; ship per-vertical salon service schema.
- **LocalBusiness JSON-LD** — present on current site but we ship our own correct `HairSalon`-typed JSON-LD by default.
- **Service menu + prices on-page** — currently nowhere on the homepage; biggest content build task.

## Package / price / effort

- **Package:** the flat **$1,500 one-time** full build (rebuild path — owns-everything, Storyblok CMS, one booking embed). Per packaging.md, a rebuild off a slow/off-brand base is the flat-fee build, not a tune-up.
- **Likely add-ons to quote up front:** **content migration + 301 redirect mapping** (required on any rebuild — Wix URL change risks ranking loss); **photo sourcing/light editing** if their own salon imagery is thin; optional **retail strip / Square Buy Button** if they want to keep selling products.
- **Effort:** standard single-vertical build on the engine — token theme + content fill + booking embed + screenshot-verify + deploy. Main variable is pulling the service menu/prices (not on the site today) and sourcing decent salon photography.

## Client-facing next step

Send the 1-page audit HTML. Lead with the perf + "your homepage sells products, not haircuts" hook; offer a quick before/after using the salon template hero with their own studio photos.
