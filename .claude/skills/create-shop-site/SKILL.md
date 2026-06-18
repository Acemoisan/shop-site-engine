---
name: create-shop-site
description: Use when building a brand-new Studio0rbit client shop site from scratch — scaffolding a new sites/<slug> Astro app, choosing/writing its OKLCH theme tokens, authoring its content, wiring it to Storyblok, and verifying before handoff. Every site is ONE fixed-scope build ($1,500 flat, no tiers) — same core component set every time; extras are paid add-ons. Calgary shop-site engine specific.
---

# Create a Shop Site

End-to-end runbook to produce one new client shop site on the shared engine. The whole job is: **scaffold a thin site → theme tokens → content → compose sections → wire Storyblok → verify.** A new shop is a token-swap + content fill on existing components, never a rebuild.

**REQUIRED BACKGROUND:** Read `shop-templates` (structure, component library, props, hero patterns) and `storyblok-shop-cms` (content model + Management API) first. Use `frontend-design` for the look. Deploy with `deploy-shop-site`.

## The standard build — one fixed scope (no tiers)

We sell **one flat-fee website ($1,500)**, not tiers. Every client site ships the **same core component set** — this is the deal *and* the pipeline's consistency advantage. **Do not add/drop sections to signal "more website."** A vertical differs only by **theme tokens, content, hero style, and section *labels*** — never by which sections exist.

**Canonical composition** (the order in `index.astro`; every site ships all of these):

| # | Component | Notes / vertical flex |
|---|---|---|
| 1 | `SiteNav` | booking/order CTA in nav (`bookingUrl`) |
| 2 | `Hero` *or* custom hero `<section>` | hero style is the main per-vertical choice |
| 3 | `Features` | the "why us" trust row |
| 4 | `Services` | **relabel heading** per vertical: Menu / Treatments / Memberships / Services |
| 5 | `Reviews` + `Testimonials` | social proof |
| 6 | `Hours` | opening hours |
| 7 | `ContactNAP` | address + map link + `tel:` click-to-call |
| 8 | `Faq` | common questions |
| 9 | `CTA` | closing call/book |
| 10 | `SiteFooter` | — |
| — | `seo/LocalBusinessJsonLd` | required on every site (the "found on Google" promise) |

`Stats` is the one optional band (use when the shop has strong numbers; omit otherwise) — it does not change the deal.

**Add-ons plug into this base — they never replace it.** Each is a one-time, separately-quoted extension on top of the standard build:

| Add-on | Where it plugs in |
|---|---|
| Online store / e-commerce | Shopify Buy Button (or Square Online) embed in a new `<section>`/route — see `shop-templates` |
| Extra pages or sections | additional Astro routes / extra section instances |
| Full professional copywriting | deeper content in the *same* sections — not new structure |
| Multi-location | repeated `ContactNAP` + per-location content (one Storyblok story per location) |
| Photo sourcing & editing | assets only — no structural change |

> Anything outside this menu → **custom quote**, not a silent scope increase. Keep the base build identical every time; that's what keeps it a token-swap + content fill.

## Decide first
- **Slug** (kebab business name, e.g. `northside-dental`) — used as the site dir, the pnpm package `name`, and the Storyblok story slug.
- **Vertical** → which demo to copy as a **starting point** (closest hero style + content shape; section set is the same standard build either way): trades→`demo-electrician`, gym/retail→`demo-fitness`, salon/spa→`demo-barber`/`demo-spa`, food→`demo-cafe`.
- **Hero style:** full-bleed photo (`Hero` component) or a bespoke per-vertical `<section>` (see `shop-templates`).

## Reuse the client's existing content & images first
If the client already has a site (most do), **pull their real assets before writing any placeholder** — it's the difference between a "restructure" and obviously-their-brand. Download real product/brand photos and **re-encode to right-sized WebP with `sharp`** (hero ~80–150KB, cards ~25–70KB) into `sites/<slug>/public/img/`; lift real copy/prices/socials; wire image slots so they stay swappable in Storyblok. **Verify each image and reject stock/placeholders.** Full recipe in `site-audit` → "Reuse the prospect's existing content & images". (Proven on Bitcoin Manor, 2026-06-17.)

## Steps

### 1. Scaffold `sites/<slug>/`
Copy the chosen demo's `package.json`, `astro.config.mjs`, `tsconfig.json`. Only `package.json`'s `name` changes (= slug). Standard contents:
- `package.json` deps: `astro ^5`, `@tailwindcss/vite ^4`, `tailwindcss ^4`, `@studio0rbit/shared: workspace:*`; scripts `dev/build/preview`.
- `astro.config.mjs`: `vite: { plugins: [tailwindcss()] }`.
- `tsconfig.json`: `{ "extends": "astro/tsconfigs/base", "include": [".astro/types.d.ts", "**/*"], "exclude": ["dist"] }`.

### 2. Theme tokens — `src/theme.css`
Brainstorm the palette with `frontend-design` (it names the AI-slop clichés to avoid), then express it as OKLCH custom properties in `:root`:
`--background --foreground --primary --primary-foreground --muted --muted-foreground --accent --accent-foreground --border --card --font-sans --font-display --radius`.
Pick a **display + body font pairing**; add the matching Google Fonts `<link>` in `index.astro`'s `<head>`. **Tokens drive the whole brand — never restyle a component per shop.**

### 3. Content — `src/content/shop.ts`
Export a typed `ShopContent` (name, tagline, vertical, phone, address, mapUrl, serviceArea, bookingUrl, hours[], services[], optional heroImage/reviewsBlurb/rating/geo, url). This is the **local fallback**. Keep section arrays (stats/features/testimonials/faqs) and the `h` headings object as inline `let` fallbacks in `index.astro`.

### 4. Compose — `src/pages/index.astro`
Import `@studio0rbit/shared/styles/base.css` then `../theme.css`. Compose the **standard component set** (see "The standard build" above — same sections every time); the per-vertical choices are hero style + the `Services` heading ("Menu"/"Treatments"/"Memberships"/…). Add `LocalBusinessJsonLd`. Only add a section beyond the canonical set if a paid **add-on** calls for it. Then add the **Storyblok fetch + fallback block** (copy from the nearest demo): read `STORYBLOK_TOKEN`/`STORYBLOK_STORY`, fetch the published story, map fields, override only when present. **Every visible string/array must map to a Storyblok field** — including custom-hero `hero_kicker`/`hero_subcopy`/`hero_cta_label`.

### 5. Wire Storyblok
Per `storyblok-shop-cms`: run `setup-shop.mjs` (idempotent — ensures the shared `shop` model exists), create a story of type `shop` with this slug, populate + Publish it, then write `sites/<slug>/.env` (gitignored):
```
STORYBLOK_TOKEN=<delivery/read token>   # same for every story in the space
STORYBLOK_STORY=<this shop's slug>
```
Remember: Storyblok number fields (rating) validate as **strings** on write — send `"4.9"`.

### 6. Verify (do NOT skip)
`pnpm install` then `pnpm --filter <slug> build`. Confirm the build log prints `content source: Storyblok`. Then `pnpm --filter <slug> preview` and **screenshot at mobile (390px) + desktop (1280px)** with Playwright. Confirm in the built HTML: `LocalBusiness` JSON-LD present, phone is `tel:` click-to-call, map link works. A green build can still render unstyled — the screenshot is the real gate.

## File checklist
```
sites/<slug>/
  package.json   astro.config.mjs   tsconfig.json
  .env                     # gitignored: STORYBLOK_TOKEN + STORYBLOK_STORY
  src/theme.css            # OKLCH tokens + fonts + radius
  src/content/shop.ts      # ShopContent local fallback
  src/pages/index.astro    # sections + Storyblok fetch/fallback + JSON-LD
```

## Common mistakes
- New shared component dir without an `@source` in `base.css` → utilities silently missing (see `shop-templates`).
- Hardcoded colors in markup instead of token utilities → breaks re-theming.
- Forgetting the fonts `<link>` → display font falls back to serif/sans default.
- Custom hero text hardcoded → not client-editable.
- `rating` sent as a number to Storyblok → `422`. Send a string; parse with `parseFloat` in Astro.
- Declaring done on a passing build without a screenshot.
