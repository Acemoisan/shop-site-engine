# Design Spec — Bitcoin Manor (`sites/bitcoin-manor`)

**Date:** 2026-06-17 · **Vertical:** retail (brand/catalog) · **Engine:** packages/shared, themed per shop.
**No review gate** — this records the agency decisions; build proceeds.

## Goal
Replace a 38.8s-LCP legacy-WordPress homepage with a fast, distinctive **brand/landing site** that showcases Bitcoin Manor's in-house Bitcoin gear and **deep-links into their existing WooCommerce store**. Fix the audit gaps: performance (static Astro → CWV pass), contact form, structured data (Organization + Store + Product), clear CTAs, social proof.

## Audience & job
Bitcoiners (hobbyists → hardware buyers, parents buying "Bitcoin for Kids", art collectors). The page's single job: **make the brand feel premium and credible, and route visitors to the right product/category in the store.**

## Token system (anti-slop — grounded in their laser/3D/LED maker world)
Avoids the generic "near-black + one acid accent" default by using a **warm laser/forge** palette and a hardware-derived signature.

| Token | Value (hex → OKLCH) | Role |
|---|---|---|
| background | `#14110E` espresso-black | warm canvas (not pure black) |
| foreground | `#ECE6DA` bone | laser-on-canvas off-white (not pure white) |
| card | `#1E1A16` | raised warm panel |
| primary | `#F7931A` Bitcoin-orange | brand-true CTA/accent |
| accent | `#FF4D2E` LED-ember | signature LED dots / "live" only |
| muted-foreground | `#9A8F7E` warm taupe | secondary text |
| border | `#2C2620` | warm hairline |
| radius | `0.25rem` | squared, engineered |

**Type:** display **Chakra Petch** (600/700, HUD/hardware), body **Inter** (400/500/600), data **IBM Plex Mono** (400/500). Loaded `display=swap` + preconnect.

**Signature:** a monospace **LED dot-matrix data readout** (BLOCK / PRICE / FEES sat·vB / POOL) echoing the Stacksworth Matrix; reused as terminal-style section eyebrows. The one bold element — everything else quiet, spacious, hairline-ruled.

## Section plan (`index.astro`)
1. **SiteNav** (shared) — sticky blurred nav; CTA "Shop" → store. Links: Hardware, Collections, Events, Contact.
2. **Hero** (bespoke) — "BITCOIN MANOR" wordmark, tagline "Personalizing Your Bitcoin Journey", subcopy (in-house, hand-built in Alberta, Lightning-ready). LED readout strip (signature). CTAs: "Shop the store" → store, "See Stacksworth" → hardware. CSS laser-grid + ember glow bg (no external photo; swappable image slot in CMS).
3. **Stats** (shared) — In-house · Hand-built in Alberta · Lightning ⚡ accepted · 4.8★ rated.
4. **Stacksworth hardware** (bespoke) — flagship **Matrix** ($169 CAD) with a faux LED readout mock, feature bullets (block height/price/fees/pool/time, ESP32, red LEDs, Wi-Fi). CTAs: "Buy the Matrix" → product, "Spark — coming soon" (disabled).
5. **Collections** (bespoke grid) — 3D-Printed Solutions, Laser Crafted Collectibles, Laser Layers: Proof of Work, Special-Edition COLDbox, Bitcoin for Kids, Sublimation Art. Each: icon + name + real blurb + deep-link.
6. **Why Bitcoin Manor** (shared Features) — value props: designed & built in-house, Bitcoin-native (Lightning), made in Alberta, for every stacker.
7. **Proof of Work band** (bespoke) — dramatic quote: "Born from paint, code, and laser light — Bitcoin's untold stories, burned forever into canvas." CTA → laser-layers.
8. **Reviews** (shared) — real 4.8★ + truthful community blurb. **No fabricated testimonials.**
9. **Events/community** (bespoke, light) — "Catch us at Bitcoin meetups across Alberta" → contact. No fabricated dates.
10. **Contact** (bespoke) — email support@bitcoinmanor.com, Web3Forms contact form (Name/Email/Message + PIPA privacy line), socials (IG, X), "Ships across Canada".
11. **Closing CTA** (bespoke) → store.
12. **Footer** (bespoke) — brand, nav, socials, © Bitcoin Manor, "Built in Alberta". No NAP (online brand).
13. **JSON-LD** (bespoke inline) — Organization + Store + Product(Matrix, $169 CAD). Not LocalBusiness (no storefront/address).

## CMS (Storyblok)
Separate space for Bitcoin Manor. Key copy/blurbs/prices/links/images editable; build survives Storyblok down via local fallbacks (field-by-field override). Image slots swappable so client drops in real product photos.

## Quality bar
Static output; LCP < 2.5s target; AA contrast on bone/ink; visible focus; reduced-motion respected; mobile-first. Screenshot-verify mobile (390) + desktop (1280) before done.
