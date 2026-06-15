# Client Handoff & Self-Edit Guide (walk-away model)

**Date:** 2026-06-15 · **Status:** content draft. The build session wires Storyblok; this is the *content* of the kit we hand the client.
**Purpose:** make the "build it, hand it over, never touch it again" model real. After handoff the client **owns every account** and can **edit their own content unaided**. This doc has two parts: (1) the internal handoff checklist we run, (2) the plain-English guide we give the client.

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

## PART 2 — Client-facing guide (plain English, goes in their handoff kit)

### 🎉 Your website is yours — completely

You own everything: your domain, your hosting, your editor, and the site itself. There are **no monthly fees to us**. Your only ongoing cost is your domain renewal (~$15–20/year) and any business tools you already use (like Square or Stripe).

### ✏️ What you can change yourself, anytime

Log in to **Storyblok** (your visual editor) and you can update:
- ✅ Text — descriptions, headings, about, specials
- ✅ Photos — swap, add, remove (drag and drop)
- ✅ Hours, address, phone, email
- ✅ Links — social, booking, ordering
- ✅ Menu items / services / prices

You click the thing on the page, change it, and hit **Publish**. That's it — no code.

### 🔒 What needs a pro (a quick paid job, not self-serve)

- Changing the **layout, design, or navigation**
- Adding **new page types or sections**
- New features (online store, new booking system)

These keep your build affordable by staying out of your monthly life — when you want one, it's a small one-time job.

### 🔑 Your accounts (keep these safe)

| What | Where | Your login |
|---|---|---|
| Domain | [registrar] | __________ |
| Hosting | [host] | __________ |
| Editor | Storyblok | __________ |
| Bookings/Payments | [their tool] | __________ |

*(We fill these in with you at handoff. Store them in a password manager.)*

### 📈 Getting found on Google (do this once)

- Claim/complete your **Google Business Profile**: exact name, address, hours, phone, website, categories, photos. Complete profiles rank better and 4★+ ratings get far more clicks.
- Ask happy customers for reviews — it's the single biggest local-ranking lever you control.

### 🆘 If something breaks

Your site is "static" — there's no server, database, or plugins to maintain, so it's very low-risk. If your domain or hosting ever shows an issue, it's almost always a billing/renewal lapse on one of *your* accounts — check those first. For anything structural, reach out and we'll quote a quick fix.

---

## Open items
- Decide GitHub-transfer vs code-archive default for non-technical clients (most won't want GitHub).
- Build a 2–3 min Storyblok "how to edit your site" screen-recording to include in the kit.
- One-page printable "your accounts + how to edit" leave-behind.
