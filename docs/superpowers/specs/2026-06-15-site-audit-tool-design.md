# Site-Audit Tool — Design Spec

**Date:** 2026-06-15 · **Status:** approved design, pre-plan
**Roadmap:** Phase 2 — Audit + scoping engine ([roadmap.md](../../roadmap.md))
**Source research:** [engagement-scoping-rubric](../../research/2026-06-15-engagement-scoping-rubric.md) (25/25 verified) · [outreach.md](../../gtm/outreach.md) · [packaging.md](../../gtm/packaging.md)

---

## 1. Purpose

One tool, two jobs:

1. **Outreach hook (external):** point it at a prospect URL → produce a credible, skimmable **1-page audit** (overall grade + top-3 specific fixes). This *is* the value-first cold-outreach message — the verified winning angle.
2. **Scoping classifier (internal):** the same scan grades the site **A–F** and maps it to an **engagement type → package** (new build / full rebuild / targeted tune-up / care-or-decline), so we know what to sell before the first conversation.

**Settled upstream (not re-litigated here):** the checks are PageSpeed Insights API + SEOmator CLI + a feature inventory; CWV thresholds LCP<2.5s / INP≤200ms / CLS<0.1; the grade→tier mapping; the 1-page audit structure in `outreach.md`.

**Form factor (decided):** Claude-driven — a deterministic collector script plus a `site-audit` skill. Single-URL first; batch (Phase 3) is a later loop over the same collector.

---

## 2. Core principle — code owns the facts, Claude owns the story

> The grade and the has/doesn't-have inventory are **computed by code** (same input → same grade, every time). Claude only **ranks, writes, and renders** — it never re-derives scores.

This is what makes the tool a trustworthy classifier rather than a vibe. It is the non-negotiable design constraint.

---

## 3. Architecture — two layers

```
packages/audit/                  ← deterministic collector (NO LLM)
  CLI: `pnpm site-audit <url>`  →  emits AuditData JSON (stdout + file)
  (NOT `pnpm audit` — that's pnpm's built-in dependency-security audit)

site-audit  (Claude Code skill)  ← judgment + writeup
  calls collector → ranks issues → maps grade→tier → renders branded HTML audit
```

- **Collector** = a small typed (TypeScript) workspace package. Pure data-gathering and grade computation. No judgment, no prose. Reproducible and independently testable.
- **Skill** = `SKILL.md` + references. Calls the collector, reads `AuditData`, applies the judgment layer, renders outputs.

Rationale for a workspace package (not a loose script): typed, can share types with `packages/shared`, versionable, and trivially wrapped in a batch loop later.

---

## 4. The collector — probes & `AuditData`

Four probe groups. **Each probe degrades gracefully:** on failure it records `status: "error"` (with the reason) and is excluded from the grade, and the run emits a **confidence note** rather than crashing. Every probe has a timeout.

| Probe | Tool | Produces |
|---|---|---|
| **Performance + CWV** | **PSI API** (mobile + desktop runs) | Performance / SEO / Accessibility / Best-Practices 0–100; LCP / INP / CLS with pass-fail; list of top failed Lighthouse audits |
| **Deep SEO / security** | **SEOmator CLI** (`@seomator/seo-audit` v3.0.1, `audit <url> --crawl -m N --format json`) | 0–100 + A–F across 251 rules: SSL/HSTS/CSP, broken links / redirect chains / orphans, structured data, meta, ARIA/contrast |
| **Feature inventory** ⭐ | DOM parse (fetch; Playwright fallback for JS-rendered sites) | present/absent vs **our own conversion-complete bar**: mobile viewport, `tel:` click-to-call, booking link, hours, address/map, reviews, `LocalBusiness` JSON-LD, menu schema (food verticals), HTTPS, OG/meta tags, contact form, favicon |
| **Tech stack** | lightweight HTML-signature heuristic | platform (WordPress / Wix / Squarespace / Shopify / custom / unknown) + a `legacy/bloat` flag |

**Tool reality (verified 2026-06-15):** SEOmator `@seomator/seo-audit` v3.0.1, Lighthouse 13.4.0, Node 24 all present. We prefer the **PSI API over local Lighthouse** specifically to avoid a local-Chrome dependency → "works every time."

**Why the feature inventory matters most:** it directly answers "what the site *has* and *doesn't have*," and it is on-brand — we grade prospects against the exact checklist our own sites ship with. The absent items become the targeted-fix list.

**Tech-stack detection** uses a zero-cost built-in heuristic now (research open-question #3), with a clean slot to drop in a Wappalyzer/BuiltWith API later if warranted.

### `AuditData` shape (illustrative)

```ts
interface AuditData {
  url: string
  fetchedAt: string                 // ISO; stamped by caller, not Date.now() in-script
  reachable: boolean                // false → "no site" path
  vertical?: string                 // optional hint passed in (barber, cafe, ...)
  psi?: { mobile: ScoreSet; desktop: ScoreSet; cwv: CwvResult; status: ProbeStatus }
  seomator?: { score: number; grade: Grade; categories: Record<string, number>; status: ProbeStatus }
  inventory: Record<FeatureKey, boolean | "error">   // the has/doesn't-have map
  stack?: { platform: string; legacy: boolean; status: ProbeStatus }
  grade: { overall: Grade; byCategory: Record<string, Grade>; confidence: "high" | "partial" }
  tier: "new-build" | "rebuild" | "tune-up" | "care-or-decline"
  fixes: { targeted: string[]; general: string[] }   // derived from inventory + failed audits
}
```

---

## 5. Grading — one versioned rubric, in code

A single **`rubric.ts` config** combines the probes into one overall **A–F + per-category sub-grades**, deterministically. Versioned so changes are explicit and reproducible.

Grade → tier (locked in docs):

- **no-site / social-only** → **new build**
- **D–F**, *or* a **structural flag** (dead platform, not mobile-friendly, broken IA) → **full rebuild**
  - *Foundation-strength override:* a structural flag forces rebuild even on a borderline numeric score.
- **B–C** → **targeted tune-up** — and the inventory names *which* micro-package ("add booking," "mobile fix," "speed+SEO").
- **A** → be honest: care/decline.

**CWV honesty rule:** lab/synthetic scores are labeled **indicative, not Google's official field (CrUX) verdict** — used for triage, never quoted as Google's verdict.

---

## 6. Outputs — two artifacts + a note

1. **`AuditData` JSON** — the machine record. Reusable, loggable, and the drop-in input for Phase 3 batch.
2. **Branded 1-page HTML audit** — rendered on the Astro engine using the `outreach.md` structure: header → grade snapshot + 1-line verdict → top-3 issues (problem / why it costs them / the fix) → "what a fixed version looks like" (vertical-tied) → soft CTA. Hostable, linkable in outreach, and itself a demo of our work. Claude writes the vertical-specific prose into a **fixed template**.
3. **Internal scoping note** — tier + targeted-vs-general fix list; what we read before quoting.

---

## 7. The `site-audit` skill — steps

1. **Validate URL / detect no-site** → if dead or social-only, short-circuit to new-build path with a minimal audit.
2. **Run the collector** → obtain `AuditData` (does not interpret scores itself).
3. **Judgment:** rank and select the **top-3 issues for the vertical**; confirm grade→tier; assemble targeted vs general fixes.
4. **Render** the branded HTML audit + emit the internal scoping note.
5. *(Phase 3, later)* loop the collector over a prospect list; one audit + outreach draft per row.

---

## 8. Reliability requirements ("works every time")

- Per-probe **timeout + graceful degradation**; partial results still grade, with a confidence flag.
- **PSI API key** via env var; documented setup. Missing key → clear error, not a crash.
- **No local-Chrome hard dependency** (PSI API for Lighthouse; Playwright only as inventory fallback).
- **No-site path** never errors — it's a valid, expected outcome.
- Deterministic grade: same `AuditData` → same grade (no randomness, no model in the grade path).

---

## 9. Verification plan (how we know it works)

- **Collector unit-level:** run against a known-good site and a known-weak Calgary site; assert `AuditData` is well-formed, grades differ sensibly, and a forced-failed probe degrades (not crashes).
- **Tool reality:** confirm PSI API returns scores with a real key; confirm SEOmator JSON parses.
- **Skill end-to-end:** produce a branded HTML audit for one real prospect; eyeball it against the `outreach.md` structure; confirm grade→tier matches the rubric.
- Per repo discipline: **build + screenshot** the HTML audit at mobile + desktop widths (Playwright).

---

## 10. Scope boundaries (YAGNI)

**In:** single-URL collector, grading rubric, feature inventory, branded HTML output, scoping note, the skill.
**Out (deferred):** Phase 3 batch loop (trivial wrapper over the collector); paid tech-stack API; GBP-completeness automation (research open-question — manual for now); self-serve public audit page.

---

## 11. Open items carried in

- Tech-stack-detection API choice + scoring weights → heuristic now, API slot later (research open-question #3).
- GBP completeness → manual check noted in the audit, not automated yet.
- Lab-vs-field CWV reconciliation → handled by the honesty label, not by added tooling.
