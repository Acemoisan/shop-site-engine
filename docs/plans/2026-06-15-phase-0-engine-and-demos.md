# Phase 0: Engine + Demos Implementation Plan

> **✅ STATUS: COMPLETE (2026-06-15).** Every deliverable shipped — engine, `packages/shared`, the demos (now 5: barber, café, spa, electrician, fitness), and the Storyblok edit→publish→rebuild loop verified. Kept as the worked record of the engine build; unchecked boxes below are historical, not outstanding. Live status: [roadmap.md](../roadmap.md).

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the code-first production engine (Astro + Tailwind v4 + shadcn token theming + OKLCH design tokens, pnpm monorepo) and ship two themed demo shop sites (barber/salon + restaurant/café) from one shared component set — proving the "new shop = token swap + content fill" thesis.

**Architecture:** pnpm-workspace monorepo. A `packages/shared` package holds reusable Astro section components, base Tailwind/token CSS, content TypeScript types, and SEO (LocalBusiness JSON-LD). Each shop is a thin Astro app under `sites/<slug>/` that imports shared components, supplies its own OKLCH token file (the per-shop theme) and a typed content object. Static output (SSG) for Core Web Vitals. Storyblok visual editing is wired last (owner-gated on a free account) so demos render even if that step slips.

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@theme inline`), TypeScript, pnpm (via Corepack), shadcn-style CSS-variable theming in OKLCH. React islands only where interactivity is needed (none required for Phase 0).

**Owner action required (parallel, non-blocking):** create a free Storyblok account + a "Space", get the Preview API token — needed only for Task 8. Everything before that runs without it.

---

## File structure

```
Websites/
├─ package.json                     # root, workspace scripts, packageManager: pnpm
├─ pnpm-workspace.yaml              # workspaces: packages/*, sites/*
├─ .gitignore
├─ CLAUDE.md                        # design-system guardrail (Task 7)
├─ packages/
│  └─ shared/
│     ├─ package.json               # name: @studio0rbit/shared
│     ├─ src/
│     │  ├─ styles/base.css         # Tailwind v4 import + @theme inline token→utility mapping
│     │  ├─ types/shop.ts           # ShopContent type (NAP, hours, services, menu, etc.)
│     │  ├─ components/
│     │  │  ├─ Hero.astro
│     │  │  ├─ ContactNAP.astro     # name/address/phone + click-to-call + map link
│     │  │  ├─ Hours.astro
│     │  │  ├─ Services.astro       # services OR menu (vertical-aware)
│     │  │  ├─ Reviews.astro
│     │  │  ├─ CTA.astro
│     │  │  └─ SiteFooter.astro
│     │  └─ seo/LocalBusinessJsonLd.astro
│     └─ index.ts                   # re-exports
└─ sites/
   ├─ demo-barber/
   │  ├─ package.json
   │  ├─ astro.config.mjs
   │  ├─ tsconfig.json
   │  └─ src/
   │     ├─ theme.css               # OKLCH token values for THIS shop (the theme)
   │     ├─ content/shop.ts         # typed ShopContent for the barber
   │     └─ pages/index.astro       # composes shared sections
   └─ demo-cafe/                    # same shape, different theme.css + shop.ts (+ menu)
```

---

## Task 1: Initialize monorepo + tooling

**Files:**
- Create: `package.json`, `pnpm-workspace.yaml`, `.gitignore`

- [ ] **Step 1: Init git + enable pnpm**

Run:
```bash
cd "C:/Users/aidan/Space/Studio0rbit/Websites"
git init
corepack enable pnpm
corepack prepare pnpm@latest --activate
pnpm --version
```
Expected: a pnpm version prints (e.g. `9.x`).

- [ ] **Step 2: Create `.gitignore`**

```
node_modules/
dist/
.astro/
.env
.DS_Store
*.log
.vercel/
.netlify/
```

- [ ] **Step 3: Create `pnpm-workspace.yaml`**

```yaml
packages:
  - "packages/*"
  - "sites/*"
```

- [ ] **Step 4: Create root `package.json`**

```json
{
  "name": "studio0rbit-websites",
  "private": true,
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "dev:barber": "pnpm --filter demo-barber dev",
    "dev:cafe": "pnpm --filter demo-cafe dev",
    "build": "pnpm -r build"
  }
}
```
(Set the `packageManager` version to match the `pnpm --version` output from Step 1.)

- [ ] **Step 5: Verify**

Run: `pnpm install`
Expected: completes with no packages yet (just sets up the workspace lockfile).

- [ ] **Step 6: Commit** (pending owner approval on commit cadence — see handoff)

```bash
git add -A && git commit -m "chore: init pnpm monorepo workspace"
```

---

## Task 2: Shared package — tokens, types, base styles

**Files:**
- Create: `packages/shared/package.json`, `packages/shared/src/styles/base.css`, `packages/shared/src/types/shop.ts`, `packages/shared/index.ts`

- [ ] **Step 1: `packages/shared/package.json`**

```json
{
  "name": "@studio0rbit/shared",
  "version": "0.0.0",
  "type": "module",
  "exports": {
    ".": "./index.ts",
    "./components/*": "./src/components/*",
    "./seo/*": "./src/seo/*",
    "./styles/base.css": "./src/styles/base.css",
    "./types/shop": "./src/types/shop.ts"
  },
  "peerDependencies": { "astro": "^5.0.0" }
}
```

- [ ] **Step 2: `packages/shared/src/types/shop.ts`** — the content contract every shop fills

```ts
export interface ShopHours { day: string; open: string; close: string; closed?: boolean }
export interface ShopService { name: string; price?: string; description?: string }
export interface ShopContent {
  name: string;
  tagline: string;
  vertical: "salon" | "cafe" | "trades" | "retail";
  phone: string;
  address: string;
  mapUrl: string;          // Google Maps link
  serviceArea?: string;
  bookingUrl?: string;     // third-party embed/link (Square, Fresha, OpenTable...)
  hours: ShopHours[];
  services: ShopService[]; // doubles as menu for cafe/restaurant
  reviewsBlurb?: string;
  rating?: number;
  geo?: { lat: number; lng: number };
  url: string;
}
```

- [ ] **Step 3: `packages/shared/src/styles/base.css`** — Tailwind v4 + token→utility mapping (theme values come from each site's `theme.css`)

```css
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-border: var(--border);
  --font-sans: var(--font-sans);
  --font-display: var(--font-display);
  --radius: var(--radius);
}
```

- [ ] **Step 4: `packages/shared/index.ts`**

```ts
export type { ShopContent, ShopHours, ShopService } from "./src/types/shop";
```

- [ ] **Step 5: Verify** — `pnpm install` re-run resolves the workspace package with no errors.

- [ ] **Step 6: Commit** — `chore: add shared package (tokens, types, base styles)`

---

## Task 3: First site renders (demo-barber) — wiring before components

**Files:**
- Create: `sites/demo-barber/package.json`, `astro.config.mjs`, `tsconfig.json`, `src/theme.css`, `src/content/shop.ts`, `src/pages/index.astro`

- [ ] **Step 1: Scaffold the Astro app**

Run:
```bash
cd "C:/Users/aidan/Space/Studio0rbit/Websites/sites"
pnpm create astro@latest demo-barber --template minimal --no-install --no-git --skip-houston
```
Then set `sites/demo-barber/package.json` to add deps:
```json
{
  "name": "demo-barber",
  "type": "module",
  "scripts": { "dev": "astro dev", "build": "astro build", "preview": "astro preview" },
  "dependencies": {
    "astro": "^5.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "@studio0rbit/shared": "workspace:*"
  }
}
```

- [ ] **Step 2: `astro.config.mjs`** — wire Tailwind v4 via Vite plugin

```js
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 3: `src/theme.css`** — the barber's OKLCH theme (this file IS the per-shop brand)

```css
:root {
  --background: oklch(0.98 0.005 90);
  --foreground: oklch(0.18 0.01 60);
  --primary: oklch(0.45 0.08 40);          /* warm barber brown */
  --primary-foreground: oklch(0.98 0.005 90);
  --muted: oklch(0.94 0.008 80);
  --muted-foreground: oklch(0.45 0.01 60);
  --accent: oklch(0.7 0.12 70);
  --border: oklch(0.88 0.008 80);
  --font-sans: "Inter", system-ui, sans-serif;
  --font-display: "Inter", system-ui, sans-serif;
  --radius: 0.5rem;
}
```

- [ ] **Step 4: `src/content/shop.ts`** — typed content for the barber

```ts
import type { ShopContent } from "@studio0rbit/shared";
export const shop: ShopContent = {
  name: "Ironside Barber Co.",
  tagline: "Classic cuts, Calgary craft.",
  vertical: "salon",
  phone: "+1-403-555-0142",
  address: "112 17th Ave SW, Calgary, AB",
  mapUrl: "https://maps.google.com/?q=112+17th+Ave+SW+Calgary",
  serviceArea: "Beltline & inner-city Calgary",
  bookingUrl: "https://squareup.com/appointments",
  hours: [
    { day: "Tue–Fri", open: "9:00", close: "19:00" },
    { day: "Sat", open: "9:00", close: "17:00" },
    { day: "Sun–Mon", open: "", close: "", closed: true },
  ],
  services: [
    { name: "Classic Cut", price: "$40" },
    { name: "Cut + Beard", price: "$55" },
    { name: "Hot Towel Shave", price: "$45" },
  ],
  reviewsBlurb: "Rated 4.9★ by 200+ Calgary clients.",
  rating: 4.9,
  geo: { lat: 51.0392, lng: -114.0731 },
  url: "https://ironside.example.com",
};
```

- [ ] **Step 5: Temporary `src/pages/index.astro`** (renders before components exist)

```astro
---
import "@studio0rbit/shared/styles/base.css";
import "../theme.css";
import { shop } from "../content/shop";
---
<html lang="en">
  <head><meta charset="utf-8" /><title>{shop.name}</title></head>
  <body class="bg-background text-foreground font-sans">
    <main class="mx-auto max-w-3xl p-8">
      <h1 class="text-4xl font-display text-primary">{shop.name}</h1>
      <p class="text-muted-foreground">{shop.tagline}</p>
    </main>
  </body>
</html>
```

- [ ] **Step 6: Install + run dev to verify it renders themed**

Run:
```bash
cd "C:/Users/aidan/Space/Studio0rbit/Websites"
pnpm install
pnpm dev:barber
```
Expected: dev server starts; opening the local URL shows "Ironside Barber Co." in the warm-brown primary color (proves base.css + theme.css + token mapping work). Stop the server after confirming.

- [ ] **Step 7: Commit** — `feat: demo-barber renders with token theming`

---

## Task 4: Build the reusable section components

**Files:**
- Create each in `packages/shared/src/components/`: `Hero.astro`, `ContactNAP.astro`, `Hours.astro`, `Services.astro`, `Reviews.astro`, `CTA.astro`, `SiteFooter.astro`; and `packages/shared/src/seo/LocalBusinessJsonLd.astro`

Each component takes a typed prop and uses ONLY token utilities (`bg-primary`, `text-foreground`, etc.) so themes drive appearance. Build them one at a time, re-running `pnpm dev:barber` after each to confirm it renders.

- [ ] **Step 1: `Hero.astro`**

```astro
---
interface Props { name: string; tagline: string; bookingUrl?: string }
const { name, tagline, bookingUrl } = Astro.props;
---
<section class="bg-primary text-primary-foreground px-6 py-20 text-center">
  <h1 class="font-display text-5xl font-bold">{name}</h1>
  <p class="mt-4 text-lg opacity-90">{tagline}</p>
  {bookingUrl && <a href={bookingUrl} class="mt-8 inline-block rounded-[var(--radius)] bg-accent px-6 py-3 font-semibold text-foreground">Book now</a>}
</section>
```

- [ ] **Step 2: `ContactNAP.astro`** (click-to-call + map)

```astro
---
interface Props { name: string; phone: string; address: string; mapUrl: string; serviceArea?: string }
const { name, phone, address, mapUrl, serviceArea } = Astro.props;
---
<section class="px-6 py-12">
  <div class="mx-auto max-w-3xl space-y-2">
    <h2 class="font-display text-2xl text-primary">Visit {name}</h2>
    <p><a href={`tel:${phone}`} class="font-semibold underline">{phone}</a></p>
    <p><a href={mapUrl} class="underline">{address}</a></p>
    {serviceArea && <p class="text-muted-foreground">Serving {serviceArea}</p>}
  </div>
</section>
```

- [ ] **Step 3: `Hours.astro`**

```astro
---
import type { ShopHours } from "../types/shop";
interface Props { hours: ShopHours[] }
const { hours } = Astro.props;
---
<section class="bg-muted px-6 py-12">
  <div class="mx-auto max-w-3xl">
    <h2 class="font-display text-2xl text-primary">Hours</h2>
    <ul class="mt-4 divide-y divide-border">
      {hours.map((h) => (
        <li class="flex justify-between py-2">
          <span>{h.day}</span>
          <span class="text-muted-foreground">{h.closed ? "Closed" : `${h.open}–${h.close}`}</span>
        </li>
      ))}
    </ul>
  </div>
</section>
```

- [ ] **Step 4: `Services.astro`** (label adapts to vertical: "Menu" for cafe/restaurant else "Services")

```astro
---
import type { ShopService } from "../types/shop";
interface Props { services: ShopService[]; heading?: string }
const { services, heading = "Services" } = Astro.props;
---
<section class="px-6 py-12">
  <div class="mx-auto max-w-3xl">
    <h2 class="font-display text-2xl text-primary">{heading}</h2>
    <ul class="mt-4 space-y-3">
      {services.map((s) => (
        <li class="flex justify-between border-b border-border pb-2">
          <span>{s.name}{s.description && <span class="block text-sm text-muted-foreground">{s.description}</span>}</span>
          {s.price && <span class="font-semibold">{s.price}</span>}
        </li>
      ))}
    </ul>
  </div>
</section>
```

- [ ] **Step 5: `Reviews.astro`**

```astro
---
interface Props { blurb?: string; rating?: number }
const { blurb, rating } = Astro.props;
---
{blurb && (
  <section class="bg-muted px-6 py-12 text-center">
    {rating && <p class="text-3xl text-accent">{"★".repeat(Math.round(rating))}</p>}
    <p class="mt-2 text-muted-foreground">{blurb}</p>
  </section>
)}
```

- [ ] **Step 6: `CTA.astro`**

```astro
---
interface Props { phone: string; bookingUrl?: string }
const { phone, bookingUrl } = Astro.props;
---
<section class="bg-primary text-primary-foreground px-6 py-16 text-center">
  <h2 class="font-display text-3xl">Ready when you are.</h2>
  <div class="mt-6 flex justify-center gap-4">
    <a href={`tel:${phone}`} class="rounded-[var(--radius)] bg-accent px-6 py-3 font-semibold text-foreground">Call</a>
    {bookingUrl && <a href={bookingUrl} class="rounded-[var(--radius)] border border-primary-foreground px-6 py-3 font-semibold">Book online</a>}
  </div>
</section>
```

- [ ] **Step 7: `SiteFooter.astro`**

```astro
---
interface Props { name: string; address: string; phone: string }
const { name, address, phone } = Astro.props;
---
<footer class="px-6 py-10 text-center text-sm text-muted-foreground">
  <p>{name} · {address} · <a href={`tel:${phone}`} class="underline">{phone}</a></p>
  <p class="mt-2">© {new Date().getFullYear()} {name}</p>
</footer>
```

- [ ] **Step 8: `seo/LocalBusinessJsonLd.astro`** (verified: name+address required; add recommended)

```astro
---
import type { ShopContent } from "../types/shop";
interface Props { shop: ShopContent }
const { shop } = Astro.props;
const data = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: shop.name,
  address: shop.address,
  telephone: shop.phone,
  url: shop.url,
  ...(shop.geo && { geo: { "@type": "GeoCoordinates", latitude: shop.geo.lat, longitude: shop.geo.lng } }),
};
---
<script type="application/ld+json" set:html={JSON.stringify(data)} />
```

- [ ] **Step 9: Compose them in `sites/demo-barber/src/pages/index.astro`** (replace the temporary body)

```astro
---
import "@studio0rbit/shared/styles/base.css";
import "../theme.css";
import { shop } from "../content/shop";
import Hero from "@studio0rbit/shared/components/Hero.astro";
import ContactNAP from "@studio0rbit/shared/components/ContactNAP.astro";
import Hours from "@studio0rbit/shared/components/Hours.astro";
import Services from "@studio0rbit/shared/components/Services.astro";
import Reviews from "@studio0rbit/shared/components/Reviews.astro";
import CTA from "@studio0rbit/shared/components/CTA.astro";
import SiteFooter from "@studio0rbit/shared/components/SiteFooter.astro";
import LocalBusinessJsonLd from "@studio0rbit/shared/seo/LocalBusinessJsonLd.astro";
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{shop.name} — {shop.tagline}</title>
    <LocalBusinessJsonLd shop={shop} />
  </head>
  <body class="bg-background text-foreground font-sans">
    <Hero name={shop.name} tagline={shop.tagline} bookingUrl={shop.bookingUrl} />
    <Services services={shop.services} heading="Services" />
    <Hours hours={shop.hours} />
    <Reviews blurb={shop.reviewsBlurb} rating={shop.rating} />
    <ContactNAP name={shop.name} phone={shop.phone} address={shop.address} mapUrl={shop.mapUrl} serviceArea={shop.serviceArea} />
    <CTA phone={shop.phone} bookingUrl={shop.bookingUrl} />
    <SiteFooter name={shop.name} address={shop.address} phone={shop.phone} />
  </body>
</html>
```

- [ ] **Step 10: Verify** — `pnpm dev:barber`, confirm a full themed barber homepage renders with all sections and view-source shows the LocalBusiness JSON-LD. Then `pnpm --filter demo-barber build` → expect a successful static build in `dist/`.

- [ ] **Step 11: Commit** — `feat: reusable section components + barber homepage`

---

## Task 5: Second site (demo-cafe) — prove multi-vertical via token swap

**Files:**
- Create: `sites/demo-cafe/` mirroring demo-barber, with a different `theme.css` and `content/shop.ts` (vertical "cafe", a menu, reservation booking link), and `index.astro` using `heading="Menu"`.

- [ ] **Step 1: Copy the barber site as the starting point**

Run:
```bash
cd "C:/Users/aidan/Space/Studio0rbit/Websites/sites"
cp -r demo-barber demo-cafe
```
Then edit `demo-cafe/package.json` `name` → `"demo-cafe"`.

- [ ] **Step 2: New `demo-cafe/src/theme.css`** — distinct café brand (greens/creams)

```css
:root {
  --background: oklch(0.98 0.01 120);
  --foreground: oklch(0.22 0.02 150);
  --primary: oklch(0.48 0.09 150);          /* café green */
  --primary-foreground: oklch(0.98 0.01 120);
  --muted: oklch(0.95 0.015 120);
  --muted-foreground: oklch(0.45 0.02 150);
  --accent: oklch(0.75 0.13 70);            /* warm crema */
  --border: oklch(0.89 0.01 120);
  --font-sans: "Inter", system-ui, sans-serif;
  --font-display: "Inter", system-ui, sans-serif;
  --radius: 0.75rem;
}
```

- [ ] **Step 3: New `demo-cafe/src/content/shop.ts`** — café content + menu

```ts
import type { ShopContent } from "@studio0rbit/shared";
export const shop: ShopContent = {
  name: "Maple & Steam Café",
  tagline: "Calgary's neighbourhood roastery.",
  vertical: "cafe",
  phone: "+1-403-555-0188",
  address: "455 Kensington Rd NW, Calgary, AB",
  mapUrl: "https://maps.google.com/?q=455+Kensington+Rd+NW+Calgary",
  serviceArea: "Kensington",
  bookingUrl: "https://www.opentable.com",
  hours: [
    { day: "Mon–Fri", open: "7:00", close: "18:00" },
    { day: "Sat–Sun", open: "8:00", close: "17:00" },
  ],
  services: [
    { name: "Flat White", price: "$5", description: "House espresso, microfoam" },
    { name: "Maple Latte", price: "$6", description: "Local maple, double shot" },
    { name: "Sourdough Avocado", price: "$14" },
  ],
  reviewsBlurb: "Loved by Kensington regulars — 4.8★.",
  rating: 4.8,
  geo: { lat: 51.0535, lng: -114.0915 },
  url: "https://maplesteam.example.com",
};
```

- [ ] **Step 4: Edit `demo-cafe/src/pages/index.astro`** — change the Services heading to `"Menu"`. (Everything else is unchanged — same shared components.)

- [ ] **Step 5: Verify** — `pnpm install` then `pnpm dev:cafe`. Confirm a fully distinct green/cream café site renders from the SAME components, with a "Menu" section. This is the proof: new vertical = new token file + content only.

- [ ] **Step 6: Build both** — `pnpm build` → expect both sites build to static `dist/` successfully.

- [ ] **Step 7: Commit** — `feat: demo-cafe proves multi-vertical token swap`

---

## Task 6: CLAUDE.md design system v0 (the anti–"AI slop" guardrail)

**Files:**
- Create: `CLAUDE.md` at repo root.

- [ ] **Step 1: Write `CLAUDE.md`** documenting: the token system (semantic OKLCH vars, what each means), the rule that components use ONLY token utilities (never hardcoded colors), the section-component catalogue and their props, the per-shop workflow (copy a site, write `theme.css`, fill `content/shop.ts`), spacing/typography scale, and accessibility/CWV expectations (mobile-first, WCAG AA contrast, static output). Include the "new shop checklist."

- [ ] **Step 2: Verify** — re-read CLAUDE.md; confirm a fresh agent could build a third shop from it alone.

- [ ] **Step 3: Commit** — `docs: add CLAUDE.md design system v0`

---

## Task 7: Deploy demos + measure turnaround

- [ ] **Step 1: Build all** — `pnpm build` (confirm both `dist/` outputs).
- [ ] **Step 2: Deploy** both `dist/` folders to a free host (Cloudflare Pages / Netlify drop / `npx wrangler pages deploy`). If account setup blocks this, fall back to `pnpm --filter demo-barber preview` / `demo-cafe preview` for local shareable verification and note deploy as a follow-up.
- [ ] **Step 3: Measure** — time how long Task 5 (the café, second shop) actually took end-to-end; record it in `docs/roadmap.md` Phase 0 outcome. This is the real-world "fast tweak per shop" number.
- [ ] **Step 4: Commit** — `chore: phase 0 demos built + turnaround recorded`

---

## Task 8: Storyblok self-edit proof (OWNER-GATED — needs free Storyblok account)

**Precondition:** owner has created a free Storyblok account, a Space, and provided the Preview API token.

- [ ] **Step 1: Add integration** — in `demo-barber`: `pnpm add @storyblok/astro @storyblok/js` and configure `astro.config.mjs` with the `storyblok()` integration + token (via `.env`: `STORYBLOK_TOKEN`).
- [ ] **Step 2: Model one block** — create a "shop" content type in Storyblok mirroring a subset of `ShopContent` (name, tagline, phone, hours, services).
- [ ] **Step 3: Source content** — load the shop content from Storyblok instead of the static `shop.ts` for the barber site; keep the static file as fallback.
- [ ] **Step 4: Verify self-edit** — edit a field (e.g., a service price) in the Storyblok Visual Editor, rebuild/preview, confirm the change appears. This proves the non-technical self-edit requirement.
- [ ] **Step 5: Commit** — `feat: wire Storyblok visual editing for demo-barber`

---

## Self-review notes
- **Spec coverage:** maps to roadmap Phase 0 tasks (engine scaffold, token theming, 2 demos across verticals, Storyblok wiring, CLAUDE.md, deploy + measure). ✓
- **Risk management:** demos render with local content (Tasks 3–5) *before* the owner-gated Storyblok step (Task 8), so EOD demos don't depend on an external account.
- **Theming proof** is the load-bearing verification: Task 5 Step 5 (distinct site from same components) validates the whole thesis.
- **Deferred:** booking is a link/embed only (no build); React islands unused in Phase 0 (YAGNI).
