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

## Elaborate / cinematic templates (the motion tier)

The default templates are sleek but quiet. **Expressive verticals (game studios, music, nightlife, fashion, agencies) get a motion tier** — cinematic hero, particle/flare ambience, scroll-reveal, hover micro-interactions. Reference build: **`sites/maw`** (MAW Interactive game studio, branch `feat/maw-alcurio-sites`, live `maw-cnt.pages.dev`) — rebuilt from a plain centered-text hero into a cinematic page. Use it as the copy-from source.

**The one rule that keeps the engine intact:** all motion/effects live in the **site's own `index.astro`** — a scoped `<style>` block (keyframes, effects) + one `<script is:inline>` (canvas, observers, parallax). **Never** put per-site motion in `packages/shared` components, and **never** restyle a component. Tokens stay the brand layer.

**Recipe (each piece is optional — compose to taste):**
1. **Optimize the hero art first.** Big PNGs (a 10MB key-art splash) must become WebP, desktop + mobile, into `sites/<slug>/public/`. Use `sharp` (`.resize({width})` → `.webp({quality:80})`); ~2560w desktop lands ~170KB, 1280w mobile ~70KB. ⚠️ In a pnpm worktree `sharp` is often **not hoisted to root** — `require()` it via the absolute `node_modules/.pnpm/sharp@<v>/node_modules/sharp` path from a `.cjs` throwaway, not a bare `import "sharp"`.
2. **Full-bleed parallax hero.** Art in an absolutely-positioned layer behind a **dark scrim gradient** (`linear-gradient(to top, var(--background) …)`) so text stays legible over bright art. Add slow `ken-burns` scale keyframe + JS mouse/scroll parallax (`translate3d`) + an optional cursor-follow radial **flare** div (`mix-blend-mode: screen`). Place hero content in the scrim zone (lower third).
3. **Signature ambience tied to the brand.** A `<canvas>` **particle field** ("motes") drifting upward, colored from the brand — for maw, the game's own Arcana-violet, so the motion *means* the "gather Arcana" mechanic. Cap DPR at 2, ~30 particles, pause via `IntersectionObserver` + `visibilitychange`.
4. **Extra tokens go in shared `base.css` with fallbacks.** Need a third accent or a mono "devkit" register? Add `--color-arcana: var(--arcana, var(--accent))` and `--font-mono: var(--font-mono, var(--font-sans))` to `@theme inline`, then define the real values in the site's `theme.css`. The `var(--x, fallback)` makes every other site **unaffected**. (This is the sanctioned way to extend the token set per CLAUDE.md.)
5. **Energy devices:** a mono **marquee ticker** (two duplicated groups, `translateX(-50%)` keyframe), **scroll-reveal** (`.reveal{opacity:0}` → IntersectionObserver adds `.in`), hover **lift + glow** on cards, a **tilt** spotlight card (pointermove → `rotateX/Y`), and a button **shine sweep** (`::after` gradient on hover).
6. **Real brand art beats text.** A game/product **wordmark** (trimmed WebP) in the spotlight reads far stronger than a styled `<h2>` — keep the name as `alt`.

**Non-negotiable floor (or it reads as AI slop / breaks a11y):**
- `@media (prefers-reduced-motion: reduce)` must disable **every** animation (ken-burns, motes, parallax, marquee, reveals) and the JS must early-return on it. The `.reveal` elements also need a **non-JS fallback** (`if (!IntersectionObserver || reduce) add .in`) or content stays invisible.
- Clamp the hero title (`clamp(2.4rem, 8vw, 6.5rem)`) so long words don't clip on mobile; check `scrollWidth === clientWidth`.
- Keep it **static Astro** (no framework) so CWV survive; dual type pairing + Google Fonts `<link>` as usual.
- **Screenshot-verify per section, not just full-page** — `.reveal` elements are `opacity:0` until scrolled, so a full-page capture shows them blank. Scroll each section into view (`el.scrollIntoView()`) then shoot, at mobile + desktop.

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
- (Motion tier) Scroll-reveal `.reveal{opacity:0}` with no non-JS/reduced-motion fallback → content invisible if JS fails or motion is reduced. Always `add .in` in those cases.
- (Motion tier) Judging a motion build from a full-page screenshot → `.reveal` sections read blank; scroll each into view before shooting. And put motion in the site's `index.astro`, never in a shared component.
