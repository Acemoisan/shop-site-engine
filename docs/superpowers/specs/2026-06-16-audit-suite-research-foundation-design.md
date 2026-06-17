# Audit Suite Upgrade — Design

**Date:** 2026-06-16 · **Status:** approved design, pre-implementation
**Author:** brainstormed with owner (Aidan)
**This spec details sub-project #1 (Knowledge Foundation). Sub-projects #2–#6 are recorded as context; each gets its own spec → plan cycle.**

---

## Why

Today's audit is one deterministic tool (`packages/audit`) grading 4 axes (performance, SEO, accessibility, a 12-item conversion inventory) → grade → tier → 1-page report, plus a freeform visual-review step in the `site-audit` skill. It has been run on 2 real Calgary prospects.

The owner wants an **entire upgrade to an audit *capability***: a research-grounded, multi-perspective suite of agents/skills that judges a site from many angles, passes findings up a hierarchy that condenses/verifies/synthesizes, and emits an audit we are **confident enough to spend build-energy on** — which then hands off to the build skills (`create-shop-site`, `deploy-shop-site`). The driving requirement is *confidence*: we need to trust our audits so we know where to spend energy on next steps (prospecting + first client builds).

This connects directly to the roadmap: it deepens Phase 2 (audit/scoping) into a real capability and de-risks Phase 3–4 (prospecting + outreach), and the final roleplay sub-project doubles as an honest roadmap-status audit.

## Approach (chosen: A — research-first, layered hierarchy on top of the deterministic collector)

Keep `packages/audit` as the **facts** layer (deterministic grade/tier/inventory — cheap, reproducible). Build a **knowledge base** from verified research, distill **rubrics** from it, add a hierarchy of specialist **judgment** agents that read those rubrics, and a **synthesis/verifier** layer on top. Facts + research-grounded judgment + verification. This scales up the existing `site-audit` skill's two-layer rule ("collector computes facts; you rank, write, explain").

Rejected: **B (agent-swarm-first, no research)** — no shared ground truth → verdicts drift run-to-run, which defeats the confidence goal. **C (extend the deterministic tool only)** — can't judge subjective/contextual things (visual quality, content quality, competitive fit, vertical nuance) that need model judgment.

## Overall architecture — 6 sub-projects (dependency order)

1. **Knowledge Foundation** *(this spec)* — verified, tagged research into what makes a local-shop website good/bad: necessary vs niche, always-reused vs rare, what converts, per-vertical must-haves. Produces `claims.json` — the spine of everything downstream.
2. **Rubric System** — roll `claims.json` into tiered, prioritized, weighted criteria organized by dimension. The "what we judge on."
3. **Specialist Auditor Team** — one agent/skill per dimension, each owning its rubric slice and angle, independently testable. The "many perspectives."
4. **Orchestration + Synthesis Hierarchy** — a workflow that fans specialists out on a URL, then a verifier/synthesizer layer dedups/cross-checks/condenses into one authoritative audit.
5. **Build Hand-off** — the audit output as a structured artifact that feeds `create-shop-site` / `deploy-shop-site` (audit → develop).
6. **Roleplay Dress-Rehearsal** — run the whole suite on real Calgary prospects, capture every gap, refresh the roadmap with true state.

---

## Sub-project #1 — Knowledge Foundation (detailed design)

### Output: a structured, tagged, verified claim base

The output is not prose — it is a machine-readable claim base that mechanically becomes the rubric. Each finding is one record:

```jsonc
{
  "claim":      "Click-to-call in the sticky mobile header lifts local-shop call conversion",
  "dimension":  "conversion",          // perf | localSeo | visual | content | conversion | trust | a11y | vertical
  "necessity":  "must-have",           // must-have | should-have | nice-to-have | niche
  "prevalence": "common-but-missing",  // always-present | common | rare | common-but-missing
  "verticals":  ["barber","cafe","trades","retail","*"],
  "impact":     "high",                // high | medium | low
  "evidence":   ["<url>", "<url>"],    // cited sources
  "confidence": "verified",            // verified | provisional | refuted
  "notes":      "..."
}
```

The five tags map directly to the owner's asks:
- **tiered + prioritized** → `necessity` × `impact`
- **always-reused vs niche** → `prevalence`
- **per-vertical** → `verticals`
- **trustworthy** → `confidence` (set by an adversarial verify pass)

### Dimensions (8)

`perf` (performance/CWV/mobile), `localSeo` (GBP, NAP consistency, local pack, schema, reviews, citations), `visual` (brand credibility, dated/"AI slop" vs premium, type/hierarchy/whitespace, price-point fit), `content` (services + prices, real copy vs thin/lorem, real photos vs stock, hours, menu/product detail, IA), `conversion` (CTA placement, click-to-call, booking/order flows, form friction, trust-cue placement), `trust` (HTTPS, privacy/Alberta PIPA, social proof), `a11y` (WCAG 2.x AA), `vertical` (per-vertical must-haves).

### Verticals covered

The 5 demo verticals (barber/salon, café/restaurant, spa, electrician/trades, fitness) + a generic `*`, plus high-value Calgary verticals: dental, law, auto, retail.

### The agent hierarchy (a `Workflow`)

Four layers, matching "many perspectives → pass up the hierarchy → condense/verify/output":

1. **Planner** — decomposes each dimension into specific research questions/perspectives, producing a deliberate work-list of `dimension × question × vertical` cells (coverage is planned, not random).
2. **Researcher (wide parallel fan-out)** — many researchers, each owning one cell, doing web search + source fetch, returning raw **cited** claim candidates.
3. **Adversarial verifier** — every non-trivial candidate claim gets independent skeptics prompted to *refute* it; it survives by majority and is stamped `verified` / `provisional` / `refuted`.
4. **Synthesizer/condenser** — per-dimension synthesizers dedup + apply the tag schema + write each dimension doc; a master synthesizer emits `SUMMARY.md` + `claims.json`.

### Seed inputs (extend, don't re-derive)

Seed the relevant researchers with existing verified repo research so we re-verify/extend rather than redo:
- `docs/research/2026-06-15-vertical-anatomy-restaurant-retail.md`
- `docs/research/2026-06-15-engagement-scoping-rubric.md`
- `docs/research/` pricing/tools/compliance + editability/handoff docs
- The current `packages/audit` rubric (4 axes, 12-item inventory) and the competitor note (NuTab) in memory.

### Artifacts written

- `docs/research/audit-foundation/<dimension>.md` — one cited findings doc per dimension (8 files).
- `docs/research/audit-foundation/claims.json` — full machine-readable claim base (consumed by sub-project #2).
- `docs/research/audit-foundation/SUMMARY.md` — human synthesis: what's necessary, what's niche, most/least common, what works/doesn't.

### Scope knobs (comprehensive, per owner)

All 8 dimensions; researchers fanned out per dimension, with per-vertical depth where it matters (the planner adds vertical cells for vertical-sensitive dimensions — `vertical`, `content`, `conversion`, `localSeo` — and keeps largely vertical-agnostic ones — `perf`, `a11y` — general); adversarial verify on every non-trivial claim. Token-heavy by design and explicitly okayed ("i dont care how long it takes, or the token cost").

### Success criteria

- `claims.json` exists, validates against the record schema, and every `confidence: "verified"` claim carries ≥1 cited source.
- All 8 dimensions and all listed verticals are represented (no empty cells silently dropped — gaps are logged).
- `SUMMARY.md` answers, in plain language: what's necessary, what's niche, what's most/least common, what works and what doesn't — per dimension and per vertical.
- A human can read `claims.json` and see how it would roll into a weighted rubric (validates the seam to sub-project #2).

### Out of scope for sub-project #1

Building the rubric (sub #2), the specialist agents (sub #3), orchestration (sub #4), build hand-off (sub #5), and the roleplay (sub #6). No changes to `packages/audit` in this sub-project.

---

## Interface with the parallel scraping work

The prospect scraper (built separately, in another context window / on its own branch or worktree) is **scout**; this suite is **audit**. They meet at one contract — the scraper's output record IS the audit suite's input:

```jsonc
{ "businessName": "", "vertical": "", "url": null, "phone": "", "address": "", "rating": 0, "reviewCount": 0, "source": "" }
```

(`url: null` flags a no-website prospect → the new-build path.) Sub-project #4 ingests this shape directly. Keep the two work-streams on isolated branches/worktrees to avoid working-tree conflicts; the only shared files are docs (low merge risk).

## Build order

Sub-project #1 first (this spec) → #2 rubric → #3 specialists → #4 orchestration → #5 hand-off → #6 roleplay. Each gets its own spec → plan → implementation cycle. The roleplay (#6) is where the roadmap-status question gets its definitive answer.
