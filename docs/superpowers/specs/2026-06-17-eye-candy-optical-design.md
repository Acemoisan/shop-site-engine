# Design Spec — Eye Candy Optical

**Date:** 2026-06-17 · **Slug:** `eye-candy-optical` · **Vertical:** retail (optical) · **CMS:** none (client request)

Documented agency decisions — **not** a review gate. Built on the shared engine (`packages/shared`); brand lives entirely in `sites/eye-candy-optical/src/theme.css` + `src/content/shop.ts`.

## Brief
A premium two-location optical boutique in Calgary ($600+ designer frames, Oakley Meta featured) currently on a sparse, slow Wix template. Goal: a fast static site that reads like a refined eyewear boutique — distinctly *not* generic AI/Wix slop — reusing the client's own product photography.

## Direction: "The Lens" (light editorial gallery)
Deliberately avoids the three AI-default looks. In particular it sidesteps the cream-+-serif-+-terracotta cliché by using a **cool porcelain** canvas and pulling the brand colour from the subject's own world.

### Tokens (OKLCH, in `theme.css`)
| Token | Value | Rationale |
|---|---|---|
| `--background` | `oklch(0.984 0.003 220)` porcelain | cool gallery white, not warm cream |
| `--foreground` | `oklch(0.235 0.018 250)` slate ink | high-contrast, calm |
| `--primary` | `oklch(0.505 0.085 175)` emerald | the green flash of an **anti-reflective lens coating** — on-subject, ownable |
| `--accent` | `oklch(0.585 0.1 60)` cognac | tortoiseshell acetate — used *only* for prices + the sale strip |
| `--muted` / `--border` | cool greys | quiet structure |
| `--radius` | `0.625rem` | soft, with `rounded-full` circles as the motif |

### Type
- **Display — Fraunces.** Chosen for its literal *optical-size* axis (on-pun for an optician) and high-contrast, boutique character. Used with restraint for headings.
- **Body — Hanken Grotesk.** Clean, modern, good x-height.
- **Utility — DM Mono.** Eyebrows, prices, NAP, captions — reads as optometry measurement data.

### Signature
**The lens-circle** — portrait and product images framed in perfect circles with a thin emerald AR-coating ring (`.lens-ring` / `.lens-ring-sm`), as if seen *through* a coated lens. Reinforced by a quiet **Snellen eye-chart rule** under the hero (decreasing real chart letters). Boldness spent in one place; everything else stays disciplined.

## Page structure (`index.astro`)
1. **Announcement strip** (cognac) — refined replacement for their garish Wix "SALE • SALE" marquee. Shows their real promo (Oakley Meta from $611, reg. $679).
2. **Nav** (shared `SiteNav`) — Fraunces wordmark, Frames / Experience / Studios, "Book an exam" CTA.
3. **Hero** (bespoke) — eyebrow, Fraunces headline "Frames worth a second look.", subcopy, dual CTA, lens-circle portrait + floating product lens + "20/20" chip.
4. **Snellen acuity rule** (signature).
5. **Stats** (shared) — two studios / on-site exams / designer.
6. **Frame wall** (bespoke) — 5 lens-circles of the client's real product shots, cognac category eyebrows, no fabricated prices.
7. **Experience** (shared `Features`) — eye exams, curated wall, lenses cut to order, two neighbourhoods.
8. **Locations** (bespoke) — the centrepiece; two cards with address→map, click-to-call, per-location hours, directions. Replaces the broken Wix footer map and closes the "no hours" gap.
9. **FAQ** (shared `Faq`) — general, true; no invented policies.
10. **Book / Contact** (bespoke) — both studios' click-to-call + email, Web3Forms contact form (closes the "no form" gap), Alberta-PIPA note.
11. **Closing CTA** + **Footer** (bespoke, dual-location).

## Engine integrity
- Semantic token utilities only inside shared components; per-shop look comes entirely from `theme.css`. Added three reusable icons (`eye`, `glasses`, `sun`, `mail`) to the shared `Icon` set — additive, not a per-shop restyle.
- SEO baseline ships: `SeoHead` (absolute canonical + OG/Twitter, theme-color), `@astrojs/sitemap`, `robots.txt`, and a hand-rolled `Optician`/`LocalBusiness` JSON-LD **@graph with both locations** (addresses + opening hours).

## Honesty / what was deliberately NOT done
- No fabricated reviews/ratings or testimonials (their real Google reviews are a future swap-in).
- No invented prices or service policies; the only price shown is their own published promo.
- Performance quoted as PageSpeed score + static architecture (mobile 64 → 90), never a lab LCP as a felt load time.
