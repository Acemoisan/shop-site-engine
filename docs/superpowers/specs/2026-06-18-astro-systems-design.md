# Design Spec — Astro Systems

**Date:** 2026-06-18 · **Slug:** `astro-systems` · **Vertical:** trades (structured home wiring) · **CMS:** none (default)

Documented agency decisions — **not** a review gate. Built on the shared engine (`packages/shared`); brand lives entirely in `sites/astro-systems/src/theme.css` + `src/content/shop.ts`.

## Brief
A Calgary structured-home-wiring / smart-home integrator, **established 1974**, currently on a late-1990s "click logo to enter" splash site (HTTP-only, no mobile, animated clip-art). Goal: a fast, **secure** static site that reads like a premium modern home-technology integrator — the deliberate opposite of the clip-art relic — closing the trust/credibility/mobile/conversion gaps. **No speed pitch** (the old page already scores PSI 100 by being nearly empty); the win is everything else.

## Direction: "Wired" (premium navy + copper integrator)
Avoids the generic "tech = SaaS purple gradient" and "electrician = hi-vis yellow/red" clichés. Instead: a calm, confident, **navy + copper** system. Copper is on-subject (literal copper wire) and signals warmth + premium craft; the electric blue is pulled from their own ASTRO wordmark — the one salvageable brand cue.

### Tokens (OKLCH, in `theme.css`)
| Token | Value | Rationale |
|---|---|---|
| `--background` | warm near-white | clean canvas, faintly warm (not clinical) |
| `--foreground` | deep midnight navy | high-contrast, premium, calm |
| `--primary` | confident electric blue | echoes the ASTRO blue wordmark; CTAs, links |
| `--accent` | copper | literal copper wire → warmth/premium; eyebrows, highlights, "since 1974" |
| `--muted` / `--border` | cool blue-greys | quiet structure |
| `--radius` | `0.5rem` | clean, precise — not bubbly |

### Type
- **Display — Sora.** Geometric, precise, contemporary — reads as modern engineering/tech without being cold.
- **Body — Inter.** Neutral, highly legible.
- **Utility — DM Mono.** Eyebrows, NAP, phone/spec captions — reads as technical data.

### Signature
A subtle **circuit-trace** motif — thin connecting lines/nodes (a tasteful, grown-up reinterpretation of the old splash's "wires radiating from the house") used in the hero backing and quiet section washes. A dark navy hero anchors the brand; the rest is light and disciplined. **Image-light by design** — no stock photos (none usable exist); depth comes from type, the copper-on-navy palette, the circuit motif, and icon-driven system cards. Real project photography is the flagged photo-sourcing add-on.

## Page structure (`index.astro`)
1. **Trust strip** (navy/copper) — "Wiring Calgary homes since 1974 · Whole-home structured wiring" (replaces the garish orange "get connected" bar with a credible one).
2. **Nav** (shared `SiteNav`) — Sora wordmark, Systems / Why Astro / Process / Contact, **"Request a quote"** CTA + tap-to-call.
3. **Hero** (bespoke, navy + circuit motif) — eyebrow, headline ("One home. Every system, wired to work together."), subcopy from their real intro copy, dual CTA (Request a quote / Call), trust points (Since 1974 · Calgary & area · Built to expand).
4. **Stats** (shared) — real, non-fabricated: `1974` established · `50+ yrs` structured wiring · `One network` unifying entertainment/data/security.
5. **Systems** (bespoke grid — the core) — 5 cards mapping their 5 service pages: **Structured Wiring**, **Entertainment & A/V**, **Home Networking**, **Security & Monitoring**, **Home Automation** — each icon + migrated description.
6. **Why Astro** (shared `Features`) — benefits from their benefits page: scalable & affordable, adds home value, future-proof, quality components / trusted since 1974.
7. **Process** (bespoke 3-step) — Plan with you → Wire to a central media centre → Expand anytime (from their "media centre + modules" copy). Clarity/trust in place of reviews.
8. **Credibility band** (bespoke) — honest "Calgary homes & builders since 1974" + show-homes note. **No fabricated reviews/testimonials** (none exist).
9. **FAQ** (shared `Faq`) — true/general: what structured wiring is, new build vs existing home, working with a builder, expanding later, service area.
10. **Request a quote / Contact** (bespoke) — Web3Forms form (closes the "no form" gap), tap-to-call phone + toll-free + email, service area, Alberta-PIPA note + `/privacy` link.
11. **Closing CTA** (navy) — "Wire it once. Enjoy it for decades." Request a quote / Call.
12. **Footer** (bespoke) — wordmark, blurb, phone/toll-free/email, service area, central-vac cross-link (vacuumwholesalers.com), Privacy link. No socials (none exist).

## Engine integrity
- Semantic token utilities only inside shared components; per-shop look comes entirely from `theme.css`.
- Add reusable icons to the shared `Icon` set (additive, not a per-shop restyle): `home`, `wifi`, `speaker`, `camera`, `cpu`, `monitor` — useful for any future trades/tech/AV build.
- SEO baseline ships: `SeoHead` (absolute canonical + OG/Twitter, theme-color), `@astrojs/sitemap`, `robots.txt`, and a hand-rolled **`ElectricalContractor`/`HomeAndConstructionBusiness` JSON-LD** using a **service-area** model (areaServed Calgary; addressLocality/region only, no fabricated street).
- Privacy: PIPA cross-border (Web3Forms + Cloudflare Pages, both US) note by the form + `/privacy` page + footer link.

## Honesty / what was deliberately NOT done
- **No speed pitch** — old site is PSI 100 by being empty; rebuild quoted on trust/security/design/conversion, never a load-time win.
- **No fabricated reviews, ratings, testimonials, prices, or hours.** Reviews/socials omitted (none found); hours shown as "by appointment."
- **No stock-photo filler** — bespoke graphic design instead; real photography flagged as an add-on.
- **No invented address/map** — service-area treatment (no public storefront).
