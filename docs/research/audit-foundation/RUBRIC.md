# Audit Rubric — `rubric.json`

The scoring rubric for the website audit: **130 weighted, vertical-aware criteria** across the 8 dimensions, each traceable to the verified claim base (`claims.json`). This is sub-project #2 of the [audit-suite upgrade](../../superpowers/specs/2026-06-16-audit-rubric-system-design.md).

## What it is

`rubric.json` is an array of criterion records:

```jsonc
{
  "id": "conv-click-to-call",          // unique
  "dimension": "conversion",            // one of the 8
  "title": "...",
  "check": "what the auditor verifies",
  "necessity": "must-have",             // must-have | should-have | nice-to-have | niche
  "weight": 5,                          // positive int, relative WITHIN the dimension
  "verticals": ["*"],                   // or a subset (barber, cafe, …) — drives masking
  "detection": "deterministic",         // deterministic | judgment | hybrid
  "signal": "clickToCall",              // required when deterministic (inventory/PSI/a11y key)
  "claimRefs": [12, 318]                // indices into claims.json (provenance)
}
```

Coverage: a11y 14 · content 17 · conversion 14 · localSeo 17 · perf 16 · trust 19 · vertical 16 · visual 17.

## How scoring works

`packages/audit/src/foundation/score.ts` (`scoreRubric`) is pure:
1. A per-criterion **result** is `pass` (1.0) · `partial` (0.5) · `fail` (0.0) · `na`.
2. Criteria not applicable to the audited vertical are masked out (excluded from the denominator).
3. **Dimension score** = weighted average of applicable results × 100.
4. **Overall** = `DIMENSION_WEIGHTS`-weighted average of dimension scores (conversion/localSeo/perf highest, a11y lowest — grounded in `SUMMARY.md`).
5. **Grade** via existing bands; **tier** via existing `mapTier`; CWV-fail caps at C and a structural flag caps at D, exactly as the legacy `rubric.ts`.

`detection` tells the downstream specialist auditors (#3) whether a criterion is settled by the deterministic collector, needs model judgment, or both.

## Validate

```bash
cd packages/audit
pnpm validate-rubric ../../docs/research/audit-foundation/rubric.json ../../docs/research/audit-foundation/claims.json
```

Checks: every criterion valid, ids unique, all 8 dimensions covered, every `claimRefs` index in range, every `deterministic` criterion has a `signal`.

## How it was built

`rubric-prep.mjs` split `claims.json` into per-dimension claim files (with global indices); one builder agent per dimension consolidated its claims into criteria (`.rubric/criteria-<dim>.json`); `rubric-merge.mjs` concatenated them into `rubric.json`. Built 2026-06-16; validated `ok: true`.

## Next (sub-project #3)

Specialist auditor agents — one per dimension — that take a real URL + the deterministic collector output and produce per-criterion `pass/partial/fail/na` results, which `scoreRubric` turns into the grade/tier.
