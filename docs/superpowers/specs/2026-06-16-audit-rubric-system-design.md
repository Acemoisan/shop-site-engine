# Audit Rubric System — Design (sub-project #2)

**Date:** 2026-06-16 · **Status:** approved-by-delegation (owner AFK, "continue, trust your process") · **Branch:** `feat/audit-suite`
**Depends on:** sub-project #1 (`docs/research/audit-foundation/claims.json`, 620 verified/provisional claims).

## Why

Sub-project #1 produced 620 tagged, mostly-verified claims about what makes a local-shop website good/bad. That's the evidence base — but it's 620 atomic facts, not something you can score a site against. Sub-project #2 turns it into **the rubric**: a consolidated, weighted, vertical-aware set of audit *criteria* plus the deterministic scoring math that maps per-criterion results → dimension scores → overall grade → tier. This is the "what we judge on", consumed by the specialist auditors (#3) and the orchestrator (#4).

## Approach (mirrors #1: agent synthesis + deterministic guardrail)

1. **Criterion schema + validator** (deterministic, TDD) — the shape every rubric criterion must take, plus coverage/consistency rules.
2. **Scorer** (deterministic, TDD) — pure functions: per-criterion results + rubric + vertical → weighted dimension scores → overall grade → tier. Reuses the existing grade bands (`scoreToGrade`) and `mapTier` semantics from `packages/audit/src/rubric.ts` so the new scoring is consistent with the current tool.
3. **Rubric builder** (agents, grounded) — per dimension, read that dimension's claims + briefing and emit a *consolidated* set of weighted criteria (target ~8–15 per dimension, ~80 total), each tracing back to source claims. Validated by (1), scored by (2).

Rejected: a purely rule-based roll-up (claims have no criterion-grouping tag, so consolidation needs judgment); a hand-written rubric (ungrounded, defeats the whole point of #1).

## The criterion record

```jsonc
{
  "id": "conv-click-to-call-sticky",     // stable kebab id, unique
  "dimension": "conversion",              // one of the 8 from #1
  "title": "Click-to-call in sticky mobile header",
  "check": "A real tel: link (E.164) is present and tappable above the fold on mobile",
  "necessity": "must-have",               // must-have | should-have | nice-to-have | niche
  "weight": 5,                            // positive integer, relative weight WITHIN the dimension
  "verticals": ["*"],                     // applies to all, or a subset (barber, cafe, …)
  "detection": "deterministic",           // deterministic | judgment | hybrid
  "signal": "clickToCall",                // optional: existing inventory key / grep hint for deterministic checks
  "claimRefs": [12, 318]                  // indices into claims.json (provenance)
}
```

- `weight` derives from `necessity` × aggregate `impact` of its source claims (builder assigns; must-have+high ⇒ high weight).
- `detection` tells #3/#4 whether the deterministic collector can settle it (`deterministic`, e.g. maps to an inventory key), needs model judgment (`judgment`, e.g. "does the hero look dated"), or both (`hybrid`).

## Scoring model (pure, vertical-aware)

A per-criterion **result** is one of: `pass` (1.0) · `partial` (0.5) · `fail` (0.0) · `na` (excluded).

1. **Applicability:** a criterion applies to a vertical V if `verticals` includes `"*"` or `V`. Non-applicable criteria are `na` (dropped from the denominator) — this is the per-vertical masking (e.g. `menuSchema` only counts for cafe).
2. **Dimension score** = `100 × Σ(weight × value) / Σ(weight)` over applicable, non-`na` criteria.
3. **Overall** = weighted average of dimension scores using `DIMENSION_WEIGHTS` (default grounded in the SUMMARY's cross-cutting priorities: conversion, localSeo, perf weighted highest; a11y lower). Configurable.
4. **Grade** via the existing bands (`scoreToGrade`: ≥90 A / ≥80 B / ≥70 C / ≥50 D / else F). **Tier** via the existing `mapTier`. A `cwvPass === false` or structural flag still caps the grade exactly as today.

## Artifacts & files

| File | Responsibility |
|---|---|
| `packages/audit/src/foundation/criteria.ts` | criterion type + `validateCriterion` + `validateRubric` (coverage/uniqueness) |
| `packages/audit/src/foundation/score.ts` | `scoreDimension`, `scoreRubric` (→ {dimensionScores, overall, grade, tier}), `DIMENSION_WEIGHTS` |
| `packages/audit/src/foundation/rubric-cli.ts` | validate a `rubric.json` file; `pnpm validate-rubric` |
| `docs/research/audit-foundation/rubric.json` | the built rubric (consumed by #3/#4) |
| tests under `packages/audit/test/foundation/` | TDD for the above |

## Success criteria

- `validate-rubric` passes on the built `rubric.json`: every criterion valid, ids unique, all 8 dimensions covered, every `claimRefs` index in range, every `detection: deterministic` criterion has a `signal`.
- `scoreRubric` is pure and unit-tested: a perfect-result set → grade A; vertical masking drops non-applicable criteria; cwv/structural caps still apply.
- Each criterion traces to ≥1 real claim. ~80 criteria total, all 8 dimensions represented.

## Out of scope (later sub-projects)

Wiring criteria to live site signals / running the specialist auditors (#3); orchestration (#4). #2 delivers the rubric data + the math, not the per-URL execution.
