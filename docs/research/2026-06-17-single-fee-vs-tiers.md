# Single Flat Fee vs Tiers — Studio0rbit

**Date:** 2026-06-17 · **Method:** deep-research harness, 5 angles → 19 sources → 85 claims → 25 verified (**12 confirmed, 13 killed**). Question: should we drop tiers for one flat fee + optional pay-as-you-go touch-ups?

> **Verdict: CONFIRM (with one structural caveat).** For our specific profile — solo operator, one-time fee, AI pipeline whose moat is speed + consistency — the evidence favors a **single flat-fee core offer + a small fixed add-on menu**, not good-better-best tiers. The caveat: keep a published **add-on list + a "custom quote" escape hatch** so the flat fee isn't a revenue ceiling.

---

## What the evidence actually showed

### The case AGAINST tiers held up; the case FOR tiers mostly collapsed
The striking result: **almost every pro-tier *number* was refuted** under adversarial verification (13 of 25 claims killed). Specifically refuted (do NOT cite):
- "Tiers create an upsell/migration path a flat fee lacks" — **0-3**
- "Good-better-best yields ~30% higher conversion, middle tier captures 60-70%" — **0-3**
- "A-la-carte converts 15-20% lower than tiers" — **0-3**
- "Tiered produces 43% higher ARPU / 20-50% revenue lift" — **0-3**
- "Three-tier converts 1.4x vs two-tier" — **0-3**
- "Tiers capture multiple willingness-to-pay segments" — **1-2**

The anchor/decoy and segment-capture *theories* are real, but the **empirical evidence that tiers make more money was not substantiated.** So "a flat fee leaves money on the table" is theoretically plausible but **empirically weak** in this dataset. The one durable pro-tier point is purely qualitative: a single price has **no built-in upward-migration path** — which **add-ons solve.**

### Fewer options reduce buyer friction (directional, not a law) · `high`
Iyengar & Lepper (2000) jam study (primary source): 6 options converted ~30% vs 24 options ~3% (~10x), effect replicated across jams/chocolates/essays. **Qualification:** the winning condition was **6, not 1**, and the broader choice-overload effect has documented replication failures (Scheibehenne et al. 2010 meta-analysis ≈ zero). → Supports **few** options; does **not** prove one beats a lean three. So this is permission for a single offer, not a mandate.

### Flat-fee productized models proven to scale solo · `medium`
- **Designjoy** — ~$1M+/yr run **entirely solo** on one flat plan ($4,995/mo). *(Caveat: recurring subscription, not one-time — the single-SKU/no-scoping mechanism transfers; the revenue magnitude is driven by recurring billing, not by flat-vs-tiered.)*
- **Restaurant Engine** — standardized fixed-scope intake: *"just send us your food menu… live in 3-5 days."*
- **Brian Casel (Double Your Freelancing)** — *"Here's the price… not a bunch of meetings,"* which **"eliminates the entire discovery process."**
The operational win the owner wants — no per-order scoping, fast/consistent delivery — is exactly what the single-SKU model delivers.

### Divergent needs (e-commerce vs brochure) are handled by add-ons, NOT tiers · `high`
- **ManyRequests** 3-way framework: accommodate in-scope / **price adjacent asks as a one-off add-on** / decline out-of-model.
- **Assembly:** *"Keep your baseline package, then create mini-upsells for clients who want more custom features"*; out-of-scope → add-on or a custom scope that "costs more."
This is precisely the recommended structure for us.

### Devil's advocate — where a single flat price genuinely fails · `medium`
- Can **underprice complex jobs**, **cap the ceiling** on bigger clients, and offers **no anchor/upsell**.
- **Mitigation (used by the same playbooks):** a published **fixed-price add-on menu** (e-commerce/booking, extra pages, copywriting) + an explicit **scope cap** + a **"custom quote" line** for true outliers. Practitioners do NOT serve every job at the flat price — they cap scope and route outliers out.

---

## The development/ops half (answered from our own architecture — CONFIRM)

The owner's "tiers bloat development" claim, assessed against our codebase:
- **Today, tiers add zero build complexity** — they aren't in the build flow at all; `create-shop-site` is a single generic recipe. Tiers exist only as a landing-page pricing construct.
- **Bloat would START if we map per-tier scope** (branching: which sections/features per tier = a decision on every build = variance), which is *against* the pipeline's consistency advantage.
- **A single fixed scope = one recipe, every site = maximum consistency + speed** — the most pipeline-friendly model, directly aligned with CLAUDE.md ("one engine, fast, consistent, a quick tweak not a rebuild").
→ On ops grounds the claim is **CONFIRMED**: one standard scope is simpler and more on-brand than tiers.

---

## Recommendation

**Adopt a single flat-fee core offer + a small fixed add-on menu + a custom-quote escape hatch.** Drop good-better-best tiers.

- **One core build** = every local-business site ships the same essential components (the owner's correct observation): nav, hero, services/menu, hours, map, click-to-call, reviews, booking/CTA, LocalBusiness JSON-LD, self-edit CMS, full ownership. One price, one recipe.
- **Fixed-price add-ons** (à la carte, published): e-commerce / online ordering, online-booking integration, extra pages/sections, full copywriting, multi-location, photo sourcing. Preserves the upsell path a pure flat fee lacks — without tier branching.
- **Optional touch-ups:** per-change, pay-as-you-go (already decided; no subscription).
- **"Custom quote" line** for jobs outside the model (the scope cap / decline-or-bespoke outlet).
- **Optional conversion test (no tier complexity):** a strikethrough anchor on the single price (Designjoy-style "$X̶ → $Y") may lift conversion without reintroducing tiers.

## Open questions (validate before locking the number)
- The proven flat-fee scalers (Designjoy, Restaurant Engine) are **recurring** — no verified **one-time-fee** solo web shop surfaced. Does the advantage hold for one-time builds, or is it inseparable from recurring billing?
- **What single flat price** maximizes solo throughput vs revenue for Calgary shops? (Pricing-band evidence was refuted in the prior study too — needs live competitor quotes.)
- **Add-on catalog + price points**, and **where the scope cap sits** before "custom quote."
- Can we **instrument the pipeline** to prove removing tiers actually reduces build time/variance (the ops thesis)?

## Refuted — do not cite
All the pro-tier conversion/revenue multipliers above (30% / 43% / 1.4x / 15-20% / 20-50%); "41% of startups run 3 plans"; "too many options cause paralysis" (0-3 here, though directionally supported by the jam study). Sources skew vendor/niche blogs (ManyRequests, Assembly, Simon-Kucher, getmonetizely) — corroborated, not independently audited. Pricing figures are 2026-current.
