---
name: create-shop-site
description: Use when building a brand-new Studio0rbit client shop site from scratch — scaffolding a new sites/<slug> Astro app, choosing/writing its OKLCH theme tokens, authoring its content, wiring it to Storyblok, and verifying before handoff. Calgary shop-site engine specific.
---

# Create a Shop Site

End-to-end runbook to produce one new client shop site on the shared engine. The whole job is: **scaffold a thin site → theme tokens → content → compose sections → wire Storyblok → verify.** A new shop is a token-swap + content fill on existing components, never a rebuild.

**REQUIRED BACKGROUND:** Read `shop-templates` (structure, component library, props, hero patterns) and `storyblok-shop-cms` (content model + Management API) first. Use `frontend-design` for the look. Deploy with `deploy-shop-site`.

## Decide first
- **Slug** (kebab business name, e.g. `northside-dental`) — used as the site dir, the pnpm package `name`, and the Storyblok story slug.
- **Vertical** → which demo to copy (closest section mix): trades→`demo-electrician`, gym/retail→`demo-fitness`, salon/spa→`demo-barber`/`demo-spa`, food→`demo-cafe`.
- **Hero style:** full-bleed photo (`Hero` component) or a bespoke per-vertical `<section>` (see `shop-templates`).

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
Import `@studio0rbit/shared/styles/base.css` then `../theme.css`. Compose the sections for the vertical; set the `Services` heading ("Menu"/"Treatments"/"Memberships"/…). Add `LocalBusinessJsonLd`. Then add the **Storyblok fetch + fallback block** (copy from the nearest demo): read `STORYBLOK_TOKEN`/`STORYBLOK_STORY`, fetch the published story, map fields, override only when present. **Every visible string/array must map to a Storyblok field** — including custom-hero `hero_kicker`/`hero_subcopy`/`hero_cta_label`.

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
