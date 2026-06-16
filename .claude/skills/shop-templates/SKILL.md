---
name: shop-templates
description: Use when working on a Studio0rbit shop site's structure or look — composing/editing sections, theming with tokens, the shared section-component library and their props, the shared-vs-custom hero patterns, or adding a new vertical/template. Calgary shop-site engine specific.
---

# Shop Templates

How Studio0rbit shop sites are built: **one shared engine, themed per shop.** A site is a thin Astro app that supplies a *theme* and *content* and composes shared section components. A new shop is a token-swap + content fill, never a rebuild. Grounded in `packages/shared` and `sites/demo-*` (barber, cafe, spa, electrician, fitness).

## Where everything lives

| Path | Role |
|---|---|
| `packages/shared/src/components/*.astro` | Reusable section components (the library below) |
| `packages/shared/src/seo/LocalBusinessJsonLd.astro` | `LocalBusiness` JSON-LD (name+address+phone) |
| `packages/shared/src/types/shop.ts` | `ShopContent`, `ShopService`, `ShopHours` types |
| `packages/shared/src/styles/base.css` | Tailwind import + `@theme inline` token→utility map + `@source` |
| `sites/<slug>/src/theme.css` | The shop's brand: OKLCH tokens + fonts + radius |
| `sites/<slug>/src/content/shop.ts` | Typed `ShopContent` — the local-fallback content |
| `sites/<slug>/src/pages/index.astro` | Composes sections; fetches Storyblok with fallback |

A site `package.json` deps: `astro`, `@tailwindcss/vite`, `tailwindcss`, `@studio0rbit/shared: workspace:*`. `astro.config.mjs` just registers the Tailwind Vite plugin.

## Theming = tokens only

Each shop's brand is **`sites/<slug>/src/theme.css`** — CSS custom properties in **OKLCH**:
`--background --foreground --primary --primary-foreground --muted --muted-foreground --accent --accent-foreground --border --card --font-sans --font-display --radius`.
`base.css` maps them to utilities via `@theme inline` (`--color-primary: var(--primary)` → `bg-primary`, `text-primary`).

**Hard rule: components use ONLY semantic token utilities** (`bg-primary`, `text-foreground`, `border-border`, `bg-muted`, `bg-card`) — never hardcoded colors (`bg-blue-500`, `#fff`, arbitrary hex). This is what lets one token file re-theme everything. Spacing/type utilities (`px-6`, `text-5xl`) are fine. **Re-theme a shop by editing only `theme.css`. Never restyle a component per shop.**

## ⚠️ Tailwind v4 + monorepo gotcha
Tailwind v4 only auto-scans the importing *site*. Classes used solely inside `packages/shared` are missed unless declared. `base.css` has `@source "../components"` and `@source "../seo"`. **Add a new shared component directory → add its `@source`** or its utilities silently won't render. The build passes but the page renders unstyled — always screenshot-verify.

## Component library (real props)

| Component | Props |
|---|---|
| `SiteNav` | `name, bookingUrl?, links?[{label,href}], bookLabel?="Book"` — sticky, blurred |
| `Hero` | `name, tagline, bookingUrl?, heroImage?` — full-bleed image masthead |
| `Stats` | `items[{value,label}]` — 3-up band on muted bg |
| `Features` | `label?, heading, items[{icon,title,body}]` — icon cards (icon = `Icon` name) |
| `Services` | `services: ShopService[], heading?="Services"` — name/price/description list (heading "Menu" for cafe) |
| `Hours` | `hours: ShopHours[]` |
| `Reviews` | `blurb?, rating?` — star band; renders only if `blurb` set |
| `Testimonials` | `label?, heading?, items[{quote,name}]` — 3 quote cards |
| `Faq` | `heading?="Questions, answered", items[{q,a}]` — `<details>` accordion |
| `ContactNAP` | `name, phone, address, mapUrl, serviceArea?` — NAP + click-to-call + map |
| `CTA` | `phone, bookingUrl?, heading?` — closing call/book band |
| `SiteFooter` | `name, address, phone` |

Icons: `Icon.astro` is a fixed inline-SVG set (scissors, star, clock, calendar, coffee, mapPin, leaf, sparkles, heart, bolt, dumbbell, shield, target, award, wrench, phone, truck, key, pencil, search, check, arrow). A `Features` icon must be one of these names. The CMS feature-icon dropdown (the `ICONS` list in `setup-shop.mjs`) exposes the same set except `arrow`; keep the two in sync if you add an icon.

## Two hero patterns
- **Shared `Hero`** (barber, cafe): full-bleed `heroImage` + name/tagline/CTA. Use when a photo masthead fits.
- **Custom inline `<section>` hero** (spa, electrician, fitness): bespoke markup in `index.astro` for a distinct per-vertical feeling. **Still tokens-only**, and its text must stay client-editable — drive kicker/subcopy/CTA-label from variables (`h.heroKicker`, `h.heroSubcopy`, `h.heroCtaLabel`), not hardcoded strings.

Per-vertical identity comes from tokens (color/radius/font) + imagery + which sections you compose + hero choice — not from restyling components.

## Content + CMS layering
`index.astro` declares local fallbacks (the `shop` object from `content/shop.ts`, plus inline `let` arrays for stats/features/testimonials/faqs and an `h` headings object), then **fetches the published Storyblok story at build time and overrides field-by-field**: core `shop` fields map directly, while optional arrays guard with `if (c.x?.length) …` and headings with `c.field || h.field`. The build never breaks if Storyblok is down. Full CMS model + wiring: **see the `storyblok-shop-cms` skill** (it owns the content model, Management API, and client editing). Every editable string/array in a template must map to a Storyblok field.

## Add a new vertical/template
1. Copy an existing `sites/demo-*` whose section mix is closest (trades→electrician, gym/retail→fitness, salon/spa→barber/spa, food→cafe).
2. Rewrite `src/theme.css` — new OKLCH palette + font pairing (display + body) + radius. Add the Google Fonts `<link>` in `index.astro`'s `<head>`.
3. Rewrite `src/content/shop.ts` (`ShopContent`) and the inline fallback arrays.
4. Compose sections in `index.astro` for the vertical; set `Services` heading ("Menu"/"Treatments"/"Memberships"…); keep the Storyblok fetch+fallback block and point `STORYBLOK_STORY` at the new slug.
5. Keep every section client-editable (map all text to Storyblok fields).
6. `pnpm install` → `pnpm --filter <slug> build` → **screenshot at mobile + desktop** before declaring done. Confirm JSON-LD + click-to-call in the HTML.

Need a *brand-new* section type? Add it to `packages/shared/src/components`, ensure its dir is `@source`-d, add a matching Storyblok block to the model. Keep the "one engine, themed per shop" rule intact. For design elevation use the `frontend-design` skill; for a full new-site runbook use `create-shop-site`; to deploy use `deploy-shop-site`.

## Common mistakes
- Hardcoding a color in a component instead of using a token utility → breaks re-theming.
- Adding a shared component dir without an `@source` → utilities silently missing.
- Hardcoding hero/section text in a custom hero → not client-editable.
- Declaring "done" on a green build without a screenshot → unstyled pages still build green.
