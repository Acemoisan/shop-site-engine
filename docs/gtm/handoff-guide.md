# Internal Handoff Checklist (walk-away model)

**Date:** 2026-06-15 · **Scope:** the *internal* steps we run before walking away.
**Canonical client-facing guide:** [`../client-handoff-guide.md`](../client-handoff-guide.md) — the complete, current plain-English manual we hand the client (Storyblok step-by-step, booking tools, owner test checklist). This file holds only the **internal** checklist + caveat that isn't in the client doc, so they don't drift.
**Purpose:** make the "build it, hand it over, never touch it again" model real. After handoff the client **owns every account** and can **edit their own content unaided**.

> Why this matters (verified): no maintenance contract means the handoff must be genuinely self-sufficient. The [editability verification](../research/2026-06-15-editability-and-handoff-verification.md) confirms Storyblok's free visual editor closes the self-edit gap, and the hardest breakers are **account ownership** and the **content-vs-structure boundary** — both addressed below.

---

## PART 1 — Internal handoff checklist (we complete before walking away)

**Principle: the client owns 100% of the accounts. We retain nothing and have no ongoing obligation.**

| Account | Action | Owner = client |
|---|---|---|
| **Domain registrar** | Registered in the client's own account (or transferred to them). Confirm they can log in. | ✅ |
| **Hosting** (Cloudflare Pages / Netlify / Vercel free tier) | Connected under the client's own account; deploy works. | ✅ |
| **Storyblok** (free Starter) | Space owned by the client's login; we're removed as collaborator after training. | ✅ |
| **Code repo** (GitHub) | Transferred to the client's account (or handed as a downloadable archive if they prefer no GitHub). | ✅ |
| **Bookings/payments** (Square/Stripe/Shopify/ChowNow) | Their own business accounts — we only configured the embed. | ✅ |
| **Google Business Profile** | Theirs; we assisted with completeness only. | ✅ |

**Pre-handoff verification (evidence, not assumption):**
- [ ] A non-technical test edit in Storyblok (change text + swap an image) **publishes to the live site** successfully.
- [ ] Site passes mobile + Core Web Vitals (LCP<2.5s / INP<200ms / CLS<0.1).
- [ ] `LocalBusiness` JSON-LD present; vertical schema (Menu/Product) where relevant.
- [ ] All logins handed over and tested by the client in front of us.
- [ ] Privacy note referencing **Alberta PIPA** present if the site collects form/booking data.
- [ ] Handoff session done; client successfully made one edit themselves.

**The dead-man's-switch caveat (be honest with the client):** because there's no maintenance contract, if a free-tier provider changes its policy years out, or a rebuild is needed, that's a new paid engagement — not something we monitor. Set this expectation in writing.

---

## PART 2 — Client-facing guide

➡️ Lives in **[`../client-handoff-guide.md`](../client-handoff-guide.md)** (canonical). It covers, in plain English: what the client owns, what they can self-edit in Storyblok vs what needs a pro, their accounts table, Google Business Profile setup, and what to do if something breaks. Don't duplicate it here — edit it there.

---

## Open items
- Decide GitHub-transfer vs code-archive default for non-technical clients (most won't want GitHub).
- Build a 2–3 min Storyblok "how to edit your site" screen-recording to include in the kit.
- One-page printable "your accounts + how to edit" leave-behind.
