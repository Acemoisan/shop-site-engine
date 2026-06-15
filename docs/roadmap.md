# Roadmap — Calgary Local-Shop Website Service

**Created:** 2026-06-15 · **Mode:** Solo, full-time · **Sprint:** 5 days
**Goal of week 1:** working website *variations* by end of day 2026-06-15; **actively prospecting clients by end of week.**

This is the living plan we track against. Phases are sequenced but the capability track (Phases 0–2) and go-to-market track (Phases 3–4) interleave. Check tasks off as completed; each phase has explicit success criteria that must be *verified*, not assumed.

---

## Locked decisions (2026-06-15)

| Decision | Call |
|---|---|
| **Business model** | One-time build fee, **NO maintenance contracts**. Margin from build efficiency, not recurring revenue. |
| **Production capability** | **Code-first: Astro + Tailwind v4 + shadcn/ui + Storyblok**, OKLCH design tokens, monorepo, `CLAUDE.md` design system. This is what AI accelerates and what we can multiply. |
| **Client self-edit** | Hard requirement. Storyblok free visual editor closes the gap (verified). Client owns all accounts → clean walk-away. |
| **No-code** | Deliberate per-client **handoff fallback** (Framer brochure / Wix e-comm / Webflow SEO), hand-built when dead-simple single-account self-edit beats our reuse. Not part of the automated pipeline (can't drive GUIs). |
| **Positioning** | **Mid-market productized** (~$3k–$8k one-time, tiered). Design system is the differentiator. |
| **Verticals** | Architecture supports **all** (token theming + per-vertical component kits). Demo order: barber/salon + restaurant/café first, then trades, then retail. |

See [decisions.md](decisions.md) and the [editability & handoff verification](research/2026-06-15-editability-and-handoff-verification.md) for the evidence.

---

## Cost model

**Our costs:** Claude plan (existing) · Astro/Tailwind/shadcn $0 · Storyblok $0 · demo+landing hosting $0 · our domain ~$15/yr · Figma+MCP ~$12–16/editor/mo ⚠️ (optional/deferrable) · scraping (Outscraper/Targetron) ~$20–50/mo or PAYG ⚠️ (Phase 3). **Hard floor to start: ~$0–15.**

**Client recurring (excl. our fee):** code-first ≈ **~$15 CAD/yr** (domain only; hosting + Storyblok on free tiers) — *the differentiator*. No-code fallback: Framer ~$10–30/mo or Wix ~$17–39/mo (their account). Bookings/payments are their own business tools (Square free / Stripe per-txn).

⚠️ = reconfirm current pricing in the relevant phase.

---

## Execution approach

- **This roadmap** is the spec. Each phase gets a **short plan → build → verify** loop (superpowers writing-plans → execute). No heavyweight ceremony for a solo sprint.
- **Verification before "done":** every completed task carries evidence (builds, renders, an edit actually works), not an assertion.
- **No-code comparison** runs in parallel by hand (owner), since GUIs can't be automated.

---

## Phase 0 — TODAY: Stand up the engine + ship multiple demos
**Outcome:** real demo sites live; the "fast tweak per shop" claim tested with a measured turnaround.

- [ ] Scaffold Astro monorepo (pnpm workspaces): shared `ui` + `tokens` packages, per-shop site apps.
- [ ] Tailwind v4 with `@theme inline`; shadcn/ui installed.
- [ ] OKLCH design-token layer — one token file per shop drives full re-theme.
- [ ] `CLAUDE.md` design system (the anti–"AI slop" guardrail) — even a v0.
- [ ] Wire Storyblok (free Starter) for visual self-editing of content.
- [ ] Build **demo 1** (barber/salon) — swap tokens + content.
- [ ] Build **demo 2** (restaurant/café) — reuse engine, prove multi-vertical.
- [ ] Deploy demos to a free host; record actual per-shop turnaround time.

**Success criteria:** 2+ themed demos live from one codebase; content editable in Storyblok by a non-technical flow; turnaround measured.

## Phase 1 — Day 1–2: Productize the capability
**Outcome:** a real component library + per-vertical kits + a handoff kit.

- [ ] Lock the design system / component library (typography, spacing, color system, core sections).
- [ ] Per-vertical **section kits** with conversion elements baked in: NAP + map, click-to-call, hours, reviews/GBP linkage, booking embeds (Square/Fresha/OpenTable), menus, trust signals (trades), `LocalBusiness` JSON-LD on every site.
- [ ] Mobile-first + Core Web Vitals pass (LCP<2.5s / INP<200ms / CLS<0.1).
- [ ] **Handoff kit:** client-owns-all-accounts checklist (domain/host/Storyblok/GitHub) + a non-technical self-edit guide.

**Success criteria:** a new shop site is a token-swap + content fill, not a rebuild; handoff doc lets a non-technical owner edit unaided.

## Phase 2 — Day 2–3: Audit + scoping engine
**Outcome:** the two capabilities the owner called out, plus packaging.

- [ ] **AI site-audit tool:** fetch a prospect's site → identify improvements → generate a 1-page audit (value-first outreach hook).
- [ ] **Scoping rubric:** new build vs full rebuild vs targeted fix — a decision tree + fast-assessment checklist.
- [ ] **Packaging:** mid-market tiers (Starter / Growth / Pro), one-time prices, defined deliverables per tier. Reconfirm Calgary price anchors.

**Success criteria:** can audit any URL and produce a credible improvement list; can scope+quote a prospect fast and consistently.

## Phase 3 — Day 3–4: Lead pipeline
**Outcome:** a real Calgary prospect list with audits ready.

- [ ] Scrape Calgary shops (Outscraper/Targetron) → filter no-website / low-rating (<4★). Reconfirm tool pricing first.
- [ ] Extract NAP, qualify brick-and-mortar fit, prioritize.
- [ ] Run the audit tool across the list; draft value-first outreach (free-audit angle).

**Success criteria:** a qualified prospect list with per-prospect audits and a ready outreach message.

## Phase 4 — Day 4–5: Go to market
**Outcome:** "looking for clients" achieved.

- [ ] Service landing page (built on our own engine — itself a demo).
- [ ] Send first outreach batch.
- [ ] Track responses; set up a simple intake flow.

**Success criteria:** outreach sent to real Calgary prospects; intake path exists for replies.

---

## Progress log
- **2026-06-15:** Phase 0 engine built and verified — pnpm monorepo, Astro + Tailwind v4 + OKLCH token theming, 7 shared section components + LocalBusiness JSON-LD. **Two demos live & screenshotted** (barber, café) proving new shop = `theme.css` + `content.ts` only. CLAUDE.md + client handoff guide written. Fixed a Tailwind v4 monorepo `@source` bug.
- **2026-06-15:** ✅ **Storyblok wired (barber).** Created `shop`/`shop_hours`/`shop_service` content types via Management API, pre-filled the barber story, connected the site to fetch from Storyblok CDN (read token in `.env`, local fallback). **Edit→publish→rebuild loop verified** (changed tagline in Storyblok → appeared in build). Client self-edit requirement proven. In-iframe visual editing deferred to the design phase (needs deploy + bridge).
- **2026-06-15 pending:** live deploy (needs owner hosting login / Netlify Drop).
- **Owner feedback:** demos are too plain/basic — **design elevation is the next priority** (see below). Booking-link → client-account flow now documented in the handoff guide.

## ⭐ Next focus (roadmap revisit): make sites genuinely impressive
The v0 components prove the engine but look plain. The design system is *the* differentiator (anti–"AI slop"). Before/alongside go-to-market, elevate to client-grade design:
- Real type pairing (display + body fonts), hero imagery/photography slots, depth, whitespace, motion/hover, sticky nav.
- Per-vertical visual identity driven by tokens + imagery (barber ≠ café ≠ trades).
- Extend the token set + component library while keeping "one engine, themed per shop."
- **To revisit together:** how we generate exciting designs fast (Figma + Figma MCP, design references, component variants).

## Open items to resolve along the way
- 🧭 Final price points within mid-market (Phase 2).
- ⚠️ Reconfirm: Figma MCP seat rules, Outscraper/Targetron pricing, Calgary build-price anchors.
- Privacy: reference **Alberta PIPA** (not PIPEDA) on any site collecting form/booking data.
- Test a no-code (Framer) build by hand for comparison (owner, parallel).
