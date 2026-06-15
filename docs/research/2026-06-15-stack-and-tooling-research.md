# Deep Research: Tools, Architecture & AI Leverage for a Calgary Local-Shop Website Service

**Date:** 2026-06-15
**Method:** Deep-research workflow — 111 agents, 28 sources fetched, 134 claims extracted, 25 adversarially verified (20 confirmed, 5 refuted), 3-vote verification per claim.
**Status:** Stack / CMS / template-architecture well covered. Bookings, full Claude pipeline, and Calgary/Canada specifics under-researched (see [open-questions.md](open-questions.md)).

> **Scope note (point-in-time artifact):** This report evaluates tools and architecture. Read "template library / reusable templates" below as a property of the *production capability* we're building — the shared-component architecture, design system, and AI pipeline that let us create sites fast — not as a goal of stockpiling finished sites or templates. See the [README](../../README.md) for the project's purpose framing.

---

## Bottom line / recommendation

Go **hybrid**, with a code-based path as the default and a no-code path as a fallback:

- **Code path (main offering):** **Astro** (or Next.js for app-like sites) + **Tailwind v4** + **shadcn/ui**, themed per client via CSS-variable design tokens, organized as a monorepo template library, built and maintained with **Claude Code** + the **Astro Docs MCP server**. Lowest recurring cost ($0–20/mo), best AI leverage, best template reuse.
- **No-code fallback:** **Framer** for the fastest/cheapest brochure sites, **Wix Studio** when the shop needs native e-commerce, **Webflow** when local/technical SEO is the top priority.

> **Single most important success factor:** a strong, structured **design system / component library**. It is what stops Claude from generating generic "AI slop" and what makes each new shop a quick tweak instead of a rebuild.

---

## 1. Stack comparison (verified)

| Dimension | Framer | Webflow | Wix Studio | Astro / Next.js |
|---|---|---|---|---|
| First page live | **Hours** | Days (weeks to learn) | Hours–days | Days |
| Learning curve | Low | Medium (weeks) | Low–medium | Needs HTML/CSS/JS (AI mitigates) |
| Recurring cost | ~$10–20/mo | ~$18–29/mo | entry tier ~$14/mo | **$0–20/mo** |
| Native e-commerce | ❌ (3rd-party Shopify/Stripe) | ✅ | ✅ **best** | Via Stripe/Shopify |
| Technical/local SEO | Weak (can't translate URL slugs) | ✅ **strongest** | Good | Full control |
| AI/Claude leverage | Low | Low | Low | ✅ **highest** |
| Template reuse across shops | Per-template | Per-template | Per-template | ✅ **one codebase → many shops** |

**Verified facts:**

- **Framer** — first page live in *hours*, no code, lowest learning curve. But it's a website builder first: **no native cart/inventory**; "Framer Commerce" is a third-party Shopify plugin. Weak multilingual SEO (cannot translate URL slugs).
- **Webflow** — full control over structured data, redirects, hreflang → **strongest no-code option for local/technical SEO**. Learning curve measured in weeks.
- **Wix Studio** — native Stores (checkout, 100+ payment providers, POS, inventory) → best no-code pick **when e-commerce is required**.
- **Astro / Next.js** — lowest recurring cost (free/open-source; $0 on Cloudflare Pages / Netlify / Vercel Hobby; Next.js ~$20/mo on Vercel Pro). The **only path where AI tooling and one-codebase-many-tenants reuse really pay off**.

**Turnaround/learning-curve ordering (verified 3-0):** Framer (hours, low) < Webflow (days, weeks to learn) ≈ Astro/Next.js (days, needs HTML/CSS/JS, mitigated by AI).

> ⚠️ **Pricing caveat:** Framer **repriced Oct 2025** — Basic $10/yr or $15/mo; Pro $30/yr or $45/mo — and discontinued the "Mini" tier some sources reference. Webflow: Basic $18 / CMS $29 monthly. Vercel Pro $20/seat (annual). Astro free with $0 static hosting tiers. **Verify all pricing before quoting clients.**

---

## 2. Content self-editing (shop owners edit hours / menu / photos)

Decision: shop owners self-edit → CMS choice is critical.

- **Storyblok** — consensus **most editor-friendly headless CMS**. Visual block editor with click-to-edit **live preview** (iframe). Best for non-technical Calgary shop owners. Pair with Astro/Next.js. *(Verified 3-0 / 2-1 on the live-preview specifics.)*
- **Decap CMS** — free, open-source, Git/Markdown-native, the **simplest Astro pairing**. Dated UI and weak visual preview (GitHub issue #7660) → best for budget jobs or technically comfortable owners. *(Verified 3-0.)*
- **Avoid Sanity for self-editors** — its editing UX "depends heavily on implementation quality" and "works best for technically mature teams"; the Studio can overwhelm shop owners without heavy custom configuration. *(Verified 3-0.)*

> ⚠️ Specific CMS pricing claims (TinaCMS $29/mo, Sanity Growth $99/mo, Storyblok €99+/mo) were **REFUTED** in verification and excluded — confirm current pricing directly with vendors. See [Refuted claims](#refuted-claims).

---

## 3. Template library architecture (one library → many shops)

Two **primary-source reference architectures** were verified — use these as blueprints:

### Vercel Platforms starter kit (open-source)
- Next.js 15 App Router + React 19 + Tailwind 4 + shadcn/ui.
- Production **multi-tenant**: one codebase serves many shops via **subdomain isolation** (`shop.yourdomain.com`) using Next.js middleware routing + Redis tenant storage (`subdomain:{name}` key pattern).
- Shares components/layouts across tenants; each tenant has its own content/pages.
- **Caveat:** isolates tenants by *data/content*, not by divergent per-tenant component code. Heavily bespoke per-shop layouts still require real engineering.
- Source: https://github.com/vercel/platforms · https://vercel.com/templates/next.js/platforms-starter-kit

### casoon/astro-v6-template (pnpm-workspace monorepo)
- Multiple independently deployable apps share one `shared/` package: **OKLCH design tokens (in a shared global.css)**, UI components, layouts, SEO, utilities.
- Per-app deploy targets (Cloudflare / Node / Vercel / Netlify).
- "Consistent look and feel while keeping each app independently deployable."
- Source: https://github.com/casoon/astro-v6-template/blob/master/README.md

### Theming mechanism (verified 3-0)
**shadcn/ui re-themes per client purely via CSS variables:** override semantic design tokens (`background`, `foreground`, `primary`, etc.) in CSS **without touching component classes**. Tailwind v4 `@theme inline` directives expose those tokens as utilities (`bg-primary`, `text-foreground`, `border-border`).

→ One component set serves unlimited per-shop brand/color variations by swapping a token file. This *is* the "reusable database of templates, quickly tweaked per shop" model.

- Source: https://ui.shadcn.com/docs/theming · https://ui.shadcn.com/docs/tailwind-v4

---

## 4. AI / Claude leverage (verified parts)

- **Astro Docs MCP server** (official, verified 3-0):
  ```
  claude mcp add --transport http astro-docs https://mcp.docs.astro.build/mcp
  ```
  Gives Claude Code real-time access to current Astro docs (Streamable HTTP transport). Astro also documents first-class Claude Code integration (CLI + GitHub Action with a YAML example), Cursor, and VS Code/Copilot.
  - Source: https://docs.astro.build/en/guides/build-with-ai/ · https://github.com/withastro/docs-mcp

- **Design system as Claude's guardrail** (verified 3-0): feed Claude a structured design-system reference via `CLAUDE.md` or a markdown design doc. *"Claude Code will happily generate generic-looking components if you let it. The design system is your defense against mediocrity."* Corroborated by Anthropic's "Set up your design system in Claude Design" article.
  - Source: https://dev.to/aimiten/i-rebuilt-our-company-website-with-astro-and-claude-code-heres-what-actually-worked-4c3o

- **"A designer can build AND maintain a production site"** (verified only **2-1** — medium confidence): AI tools (Claude Code, Cursor, Copilot) make it feasible for a designer/motivated owner to maintain an Astro/Next.js site that previously needed a developer. **Heavily qualified:** independent sources note AI still needs human oversight, has stumbled on Next.js-specific issues, and the "update any page in minutes" speed **depends on heavy upfront setup** (design system, component library, centralized data layer, detailed `CLAUDE.md`).

---

## Refuted claims

These were extracted from sources but **killed during verification** — do not rely on them:

| Refuted claim | Vote | Source |
|---|---|---|
| Wix Studio includes a built-in CMS at its ~$14/mo entry (Core) tier; Framer ~$12/mo Basic has domain/SEO/AI but no CMS | 0-3 | tweakdesigns.in |
| Framer is *the fastest* no-code builder via AI-assisted instant layout generation | 0-3 | wings.design |
| TinaCMS: self-hosted free, Tina Cloud from $29/mo, suitable for non-technical editors | 1-2 | webuildstores.co.uk |
| Sanity: free tier 3 users, Growth tier $99/mo | 0-3 | webuildstores.co.uk |
| Storyblok: priced from €99/mo up to €4,500+/mo | 0-3 | webuildstores.co.uk |

---

## Caveats (from the research synthesis)

- **Pricing is time-sensitive** — Framer repriced Oct 2025; several sources conflate annual vs monthly billing. Re-verify before quoting.
- **Several comparison/capability claims rest on agency/practitioner blogs** rather than primary sources; substance is corroborated but the strongest framings carry self-promotional bias and depend on heavy upfront setup.
- The **"designer can maintain production" claim survived only 2-1** and is heavily qualified.
- The **Vercel Platforms kit isolates tenants by data/content, not divergent per-tenant component code** — bespoke per-shop layouts still need real engineering.
- **No claim addressed Calgary/Alberta or Canadian specifics** (payment/tax/GST, Google Business Profile for Alberta, `.ca` domains, PIPEDA), bookings/reservations tools, or image-generation tooling — these were under-researched.

---

## Sources

### Primary (highest trust)
- https://docs.astro.build/en/guides/build-with-ai/ — Astro AI integration + Docs MCP
- https://github.com/withastro/docs-mcp — Astro Docs MCP repo
- https://github.com/vercel/platforms — Vercel multi-tenant Platforms starter kit
- https://vercel.com/templates/next.js/platforms-starter-kit
- https://ui.shadcn.com/docs/theming — CSS-variable theming
- https://ui.shadcn.com/docs/tailwind-v4 — `@theme inline` token mapping
- https://github.com/casoon/astro-v6-template/blob/master/README.md — monorepo template library
- https://www.storyblok.com/docs/concepts/visual-editor — Storyblok visual editor
- https://docs.astro.build/en/guides/cms/decap-cms/ — Astro + Decap
- https://www.sanity.io/docs/studio/studio-customization

### Blogs / secondary (corroborating)
- https://www.naypache-studio.com/insights/webflow-vs-framer-vs-astro-vs-nextjs — stack comparison
- https://www.tweakdesigns.in/blog/wix-studio-vs-framer-website-comparison
- https://wings.design/webflow-vs-framer-vs-wix-which-no-code-builder-wins-in-2025/
- https://dev.to/aimiten/i-rebuilt-our-company-website-with-astro-and-claude-code-heres-what-actually-worked-4c3o — Astro + Claude Code practitioner report
- https://www.monterail.com/blog/which-cms-to-choose — CMS comparison
- https://www.luckymedia.dev/insights/headless-cms — headless CMS comparison
- https://webuildstores.co.uk/insights/best-cms-for-astro/ — Astro CMS pairings (pricing refuted)

### Leads for under-researched areas (not yet verified)
- https://elevatewebdesign.ca/blog/best-online-booking-tools-canadian-small-business — Canadian booking tools
- https://whitespark.ca/google-business-profile-guide/bookings/ — GBP bookings
- https://reputationarm.com/add-remove-edit-booking-or-ordering-links-on-google-business-profile-2025-guide/
- https://www.vibecodingacademy.ai/blog/figma-mcp-claude-code-complete-guide — Figma MCP → Claude Code
- https://codersera.com/blog/claude-skills-mcp-servers-practitioner-guide-2026/
- https://dorik.com/blog/how-to-start-productized-web-design-business — productized service economics

### Research stats
6 angles · 28 sources fetched · 134 claims extracted · 25 verified · 20 confirmed · 5 killed · 12 after synthesis · 111 agent calls.
