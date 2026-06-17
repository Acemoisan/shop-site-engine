# CLAUDE.md — Studio0rbit Shop-Site Engine

This file is the design-system + build guardrail for the Calgary local-shop website service. Read it before generating or editing any shop site. Its job is to keep every build **fast, consistent, and genuinely well-designed** — the design system is our defense against generic "AI slop", and it's what makes each new shop a quick tweak instead of a rebuild.

## What this repo is

A pnpm-workspace monorepo that produces custom shop sites from one shared engine:
- `packages/shared` — the reusable engine: section components, design tokens, content types, SEO.
- `sites/<slug>` — one thin Astro app per shop. It supplies a **theme** (`src/theme.css`) and **content** (`src/content/shop.ts`), and composes shared components in `src/pages/index.astro`.

**Business model context:** one-time fee, NO maintenance contract. The client owns all accounts and self-edits content. Build accordingly — nothing that requires us long-term. See `docs/roadmap.md` and `docs/decisions.md`.

## AI-heavy architecture: always be building skills

This project is a **production capability**, not a pile of one-off sites. The pipeline itself is the product, so **codify every repeatable workflow as a skill** in `.claude/skills/` rather than re-deriving it each build. When you solve something non-obvious (a CMS wiring, an API quirk, a per-vertical pattern, a deploy recipe), the default reflex is: *should this be a skill?* If we'd do it again for the next shop, yes — write or update one.

- **Prefer skills + scripts over manual steps.** A skill with a runnable script (see `storyblok-shop-cms/setup-shop.mjs`) turns a 30-minute manual setup into one command.
- **Existing skills:**
  - `storyblok-shop-cms` — wiring Storyblok into a shop site, content model, Management API recipes, and the client editing/upload/publish model. Use it before hand-rolling CMS work.
  - `shop-templates` — how templates are structured, the shared section-component library + props, the token theming system, the shared-vs-custom hero patterns, and how to add a new vertical.
  - `create-shop-site` — end-to-end runbook to build a new client shop from scratch (scaffold → theme tokens → content → Storyblok wiring → verify).
  - `deploy-shop-site` — the auto-deploy runbook (per-client standalone repo + host build hook + Storyblok publish webhook; clients need no GitHub).
  - `site-audit` — given a prospect URL, run the deterministic collector + visual review → branded 1-page audit + scoping note.
  - `triage-prospects` — turn an Outscraper Google Maps export into a deduped, ranked, consistent audit queue (deterministic `scripts/triage-prospects.mjs`); the step between the scrape and `site-audit`.
- Keep skills grounded in verified, working implementations (point at the real files), and update them when the pattern evolves.

## The token system (how theming works)

Each shop's brand lives entirely in `sites/<slug>/src/theme.css` as CSS custom properties in **OKLCH**:

```
--background, --foreground, --primary, --primary-foreground,
--muted, --muted-foreground, --accent, --border,
--font-sans, --font-display, --radius
```

`packages/shared/src/styles/base.css` maps those to Tailwind utilities via `@theme inline` (e.g. `--color-primary: var(--primary)` → `bg-primary`, `text-primary`). **A new shop = a new `theme.css` + content. Never restyle components per shop.**

### Hard rule: components use ONLY semantic token utilities
Components must use `bg-primary`, `text-foreground`, `border-border`, `bg-muted`, etc. — **never** hardcoded colors (`bg-blue-500`, `#fff`) or arbitrary hex. This is what lets one token file re-theme everything. Spacing/typography Tailwind utilities (`px-6`, `text-5xl`) are fine.

### ⚠️ Tailwind v4 + monorepo gotcha (already handled)
Tailwind v4 auto-scans only the importing site's directory. Classes used **only inside `packages/shared` components** won't be generated unless declared. `base.css` therefore has `@source "../components"` and `@source "../seo"`. **If you add a new shared component directory, add an `@source` for it** or its utilities silently won't render.

## Component catalogue (`packages/shared/src/components`)

| Component | Props | Purpose |
|---|---|---|
| `SiteNav.astro` | `name, bookingUrl?, links?, bookLabel?` | Sticky blurred nav + booking CTA |
| `Hero.astro` | `name, tagline, bookingUrl?, heroImage?` | Full-bleed image masthead + booking CTA |
| `Stats.astro` | `items[{value,label}]` | 3-up stat band on muted bg |
| `Features.astro` | `label?, heading, items[{icon,title,body}]` | Icon feature cards (icon = `Icon.astro` name) |
| `Services.astro` | `services, heading?` | Service/menu list with prices (heading "Menu" for cafe/restaurant) |
| `Hours.astro` | `hours` | Opening hours table on muted bg |
| `Reviews.astro` | `blurb?, rating?` | Star rating + social proof |
| `Testimonials.astro` | `label?, heading?, items[{quote,name}]` | Quote cards |
| `Faq.astro` | `heading?, items[{q,a}]` | `<details>` accordion |
| `ContactNAP.astro` | `name, phone, address, mapUrl, serviceArea?` | NAP, click-to-call, map link |
| `CTA.astro` | `phone, bookingUrl?, heading?` | Closing call/book CTA |
| `SiteFooter.astro` | `name, address, phone` | Footer |
| `Icon.astro` | `name, class?` | Inline-SVG icon set (no dependency) |
| `seo/LocalBusinessJsonLd.astro` | `shop` | `LocalBusiness` JSON-LD (name+address required) |

Content shape is the `ShopContent` type in `packages/shared/src/types/shop.ts`. Full props + usage live in the `shop-templates` skill.

### CMS-driven content layer (every demo)
Each `sites/<slug>/src/pages/index.astro` declares **local fallbacks** (the `shop` object from `src/content/shop.ts`, plus inline `let` arrays for stats/features/testimonials/faqs and an `h` headings object), then **fetches the published Storyblok story at build time and overrides field-by-field only when present** (`if (c.x?.length) …`, `c.field || h.field`). The build never breaks if Storyblok is down. A site's `.env` (gitignored) holds `STORYBLOK_TOKEN` (delivery/read) + `STORYBLOK_STORY` (the shop's story slug). One shared space, one story per shop. Custom (non-`Hero`) heroes keep their text editable via `hero_kicker`, `hero_subcopy`, `hero_cta_label` fields. See `storyblok-shop-cms`.

## New-shop checklist

1. Create `sites/<slug>/` with `package.json` (name = slug, deps: astro, @tailwindcss/vite, tailwindcss, `@studio0rbit/shared`: workspace:*), `astro.config.mjs` (Tailwind Vite plugin), `tsconfig.json`.
2. Write `src/theme.css` — the shop's OKLCH palette + fonts + radius.
3. Write `src/content/shop.ts` — typed `ShopContent`.
4. Write `src/pages/index.astro` — import `base.css` then `theme.css`, compose sections, set Services heading.
5. `pnpm install` then `pnpm --filter <slug> build`; **view a screenshot** before declaring done.

## Design-quality bar (do NOT ship "plain")

The v0 components are intentionally minimal scaffolding. Real client builds must clear a higher bar — this is the differentiator:

> **Use the `frontend-design` skill (Anthropic plugin) when designing or reshaping any shop's look.** It is the process layer for this section: brainstorm a token system → critique it against generic AI defaults (it names the clichés to avoid) → build → self-critique with screenshots. Whatever palette/type/layout it proposes still ships through *our* token system (`theme.css`) and shared components — the skill informs the tokens; it never restyles components per shop.

- **Visual interest:** hero imagery/photography, real type pairing (display + body fonts), generous whitespace, depth (shadows/borders), and brand-appropriate color — not default system fonts on flat blocks.
- **Per-vertical feeling:** a barber should feel different from a café from a law office — driven by tokens (color, radius, font) AND imagery, not just text.
- **Motion & polish:** subtle transitions, hover states, sticky nav where appropriate.
- **Mobile-first & accessible:** WCAG AA contrast, tap targets, responsive layout. Static output for Core Web Vitals (LCP<2.5s/INP<200ms/CLS<0.1).
- **Conversion-complete:** every site ships NAP, click-to-call, hours, map, reviews, a booking/order CTA, and `LocalBusiness` JSON-LD.

When elevating design, extend the token set (add imagery slots, more semantic tokens) and the component library — keep the "one engine, themed per shop" rule intact.

## Verification discipline
- Always `build` and **look at a screenshot** — the build can pass while the page renders unstyled (see the Tailwind gotcha above). Use the **Playwright** plugin to drive a built site (`pnpm --filter <slug> preview`) and capture screenshots at mobile + desktop widths.
- Confirm JSON-LD and click-to-call render in the output HTML.

## Tooling / plugins for this pipeline
The AI build pipeline is: **design → build → screenshot-verify → deploy.** Plugins that back each stage:
- **`frontend-design`** (Anthropic) — design stage; clears the design-quality bar above. *Install:* `/plugin install frontend-design@claude-plugins-official`.
- **`playwright`** (installed) — verify stage; screenshots + responsive checks per the discipline below.
- **`context7`** (installed) — pull current Astro / Tailwind v4 docs (v4 is recent; training data lags the `@theme`/`@source` API this repo depends on).
- **`cloudflare`** — deploy stage; manages Cloudflare Pages (our recommended host, see `docs/deployment.md`). *Optional:* `/plugin install cloudflare@claude-plugins-official`.
