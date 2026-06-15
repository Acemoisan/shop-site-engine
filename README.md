# Calgary Local-Shop Website Service

A productized service that builds custom websites for local shops in Calgary, Alberta — fast to propose, quick turnaround, low development and maintenance cost.

**This repo's purpose is to assemble the architecture and resources — the toolchain, design system, AI pipeline, and accounts/access — to *create* these websites quickly.** It is the means of production, not a catalogue of finished sites or pre-built templates. The deliverable here is a repeatable capability: the stack, conventions, and tooling that let us (with Claude / AI) plan, spec, and ship a custom shop site fast. Reusable components and a design system are part of that capability, but the goal is the pipeline that produces sites — not an internal library of templates to pick from.

## Project constraints (decided)

- **Business model:** **One-time build fee, NO maintenance contracts.** Margin comes from build efficiency (AI pipeline + design system), not recurring revenue. (Supersedes the earlier recurring-care/WaaS recommendation — see [decisions](docs/decisions.md).)
- **Walk-away handoff:** The client **owns all accounts** (domain, hosting, CMS/editor) so we have zero ongoing obligation — "build it, hand it over, never touch it again."
- **Content editing (hard requirement):** Shop owners self-edit everything (hours, menu, photos, text, contacts, links) **unaided** after handoff → editability gates every tooling choice.
- **Stack approach:** Hybrid. Code-based vs no-code is being re-decided under the one-time-fee/zero-maintenance lens — no-code (Framer/Wix) may now be the *primary* path for a clean walk-away, not the fallback. See [editability & handoff verification](docs/research/2026-06-15-editability-and-handoff-verification.md).
- **Feature range:** Brochure/contact, bookings/reservations, e-commerce/online ordering, local SEO / Google Business discovery.
- **Goal:** Stand up the architecture and tooling so each new shop site is a fast, repeatable build — not a from-scratch project each time, and not a pick-from-a-shelf template either.

## Documentation

| Doc | Purpose |
|---|---|
| [docs/research/foundational-questions.md](docs/research/foundational-questions.md) | **Start here** — the 10-domain question framework with status of every question. |
| [docs/research/2026-06-15-stack-and-tooling-research.md](docs/research/2026-06-15-stack-and-tooling-research.md) | Stack comparison, CMS, template architecture, AI leverage. Verified & cited. |
| [docs/research/2026-06-15-go-to-market-and-service-model.md](docs/research/2026-06-15-go-to-market-and-service-model.md) | Finding shops, offering, pricing, sales — re-verified. |
| [docs/research/2026-06-15-product-delivery-and-tooling.md](docs/research/2026-06-15-product-delivery-and-tooling.md) | Per-vertical anatomy (salons/trades), bookings/payments, local SEO, CMS, AI pipeline, Canada/Alberta legal. |
| [docs/research/2026-06-15-engagement-scoping-rubric.md](docs/research/2026-06-15-engagement-scoping-rubric.md) | New build vs rebuild vs targeted fixes vs care — decision tree + automatable audit. |
| [docs/research/2026-06-15-vertical-anatomy-restaurant-retail.md](docs/research/2026-06-15-vertical-anatomy-restaurant-retail.md) | Restaurant/café + retail website anatomy & integrations. |
| [docs/research/open-questions.md](docs/research/open-questions.md) | Remaining gaps + next steps. |
| [docs/decisions.md](docs/decisions.md) | Running log of decisions and the recommended toolchain. |

## What "architecture and resources" means here

The capability we're standing up has four parts:

1. **The stack/architecture** — a code-based foundation (Astro / Next.js + Tailwind v4 + shadcn/ui) with CSS-variable design tokens and a multi-tenant / shared-component layout, so a new shop site is a fast build on a known structure.
2. **The AI pipeline** — Claude Code + the Astro Docs MCP server + a `CLAUDE.md` design system, so generation is repeatable and on-brand.
3. **The design system** — a strong, structured component library: the defense against generic "AI slop" and the thing that makes each build fast.
4. **The access** — the accounts, services, and credentials (hosting, CMS, domains, payments, Google Business) needed to actually deliver and run sites.

## Quick recommendation (TL;DR)

- **Code path (default):** Astro / Next.js + Tailwind v4 + shadcn/ui, themed via CSS-variable design tokens, on a shared-component / multi-tenant architecture, built with Claude Code + the Astro Docs MCP server.
- **No-code fallback:** Framer (fastest/cheapest brochure sites), Wix Studio (when native e-commerce is needed), Webflow (when local/technical SEO is the priority).
- **CMS for self-editing:** Storyblok (non-technical owners) or Decap (budget/technical owners).
- **Critical success factor:** A strong, structured design system / component library — the defense against generic "AI slop."
