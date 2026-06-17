# Audit Specialist Team — Design (sub-project #3)

**Date:** 2026-06-17 · **Status:** approved design, pre-plan
**Program:** Audit-suite upgrade ([2026-06-16 design](2026-06-16-audit-suite-research-foundation-design.md)) — sub-project #3 of 6.
**Depends on:** #1 Knowledge Foundation (`claims.json`, 620 claims / 556 verified) · #2 Rubric System (`rubric.json`, 130 weighted criteria + `scoreRubric`).
**Feeds:** #4 Orchestration/verify/synthesis, then #5 build hand-off, #6 roleplay.

---

## Why

`rubric.json` and `scoreRubric()` already exist but are **inert** — nothing produces the `CriterionResult[]` the scorer consumes. Sub-projects #1 and #2 do nothing for a real URL until something resolves the 130 criteria against an actual site. **Sub-project #3 is that producer**: per-dimension specialists that take a URL + the deterministic collector output (`AuditData`) + screenshots and emit `pass/partial/fail/na` per criterion, with rationale + evidence. This activates the otherwise-stranded prior investment and is the first time the research-grounded rubric is exercised on a live site.

It deepens roadmap Phase 2 (audit/scoping) and de-risks Phase 3–4 (the live prospect scrape running in parallel).

## Scope decision — 4 specialists now, 4 deferred (verified-grounded)

Build the **highest-impact, most-defensible, most-deterministic** slice first:

**Now: `conversion`, `perf`, `localSeo`, `trust`.**
Grounded in `SUMMARY.md` "Top cross-cutting audit priorities" (ranked by customer impact) and the scorer's `DIMENSION_WEIGHTS`:
- **conversion** — owns verified priorities #1–#3 (real E.164 `tel:` anchor, one dominant above-fold CTA, social proof at the decision point); weight 3.
- **perf** — priority #5; weight 3; competitor mobile loads ~15s + WordPress/page-builder detection is the strongest demonstrable outreach signal.
- **localSeo** — priority #7; weight 3; quality `LocalBusiness` JSON-LD is "common-but-missing — differentiator gold."
- **trust** — priority #4; "form present + privacy-policy absent" is the single most defensible PIPA finding; "Not Secure" is screenshot-able harm.

These four lean hardest on the **deterministic/hybrid** detections (inventory + PSI + a privacy-link grep), so the first audit slice is the **least drift-prone** — directly serving the program's confidence goal.

**Deferred: `visual`, `content`, `vertical`, `a11y`.** Judgment-heavy (visual is almost entirely screenshot judgment); they land alongside #4's adversarial verifier (which tames judgment drift) and/or #5's build-QA, which is where their fine granularity actually pays off. **Interim coverage:** the existing `site-audit` skill's freeform screenshot review continues to cover visual/aesthetic findings for outreach, so nothing is lost in the gap. a11y (scorer weight 1, lowest) is low-leverage for prospect triage; its real home is the build-time per-theme contrast gate (#5), not a prospect specialist.

## Architecture

Facts-vs-judgment stays intact: deterministic work is code; the skills only judge. **No `packages/audit` probe changes** (locked decision) — deterministic gaps the collector can't settle are routed to the owning specialist's judgment.

### Shared TS core — `packages/audit/src/specialists/`

- **`contract.ts`** — the finding type and its reduction to the scorer's input:
  ```ts
  export interface SpecialistFinding {
    id: string                       // criterion id from rubric.json
    dimension: Dimension
    result: "pass" | "partial" | "fail" | "na"
    confidence: "high" | "medium" | "low"
    rationale: string                // one line, plain
    evidence: string[]               // AuditData field refs, HTML quotes, or screenshot observations
    source: "deterministic" | "judgment"
  }
  // toCriterionResults(findings): CriterionResult[]  — strips to {id, result} for scoreRubric
  ```
- **`resolve.ts`** — pure `(dimension, AuditData) => SpecialistFinding[]` for that dimension's `deterministic` criteria, settled from the inventory / PSI / stack signals **plus `psi.failedAudits`** (free Lighthouse audit IDs already in `AuditData`). Marks `source: "deterministic"`.
- **`worklist.ts` + `cli.ts`** — `pnpm tsx src/specialists/cli.ts <dimension> <audit-json> [vertical]` emits a **work order** for the skill:
  ```jsonc
  { "dimension": "...", "vertical": "...", "host": "...",
    "settled":  [ /* SpecialistFinding[] from resolve.ts */ ],
    "toJudge":  [ { "id": "...", "title": "...", "check": "...",
                   "detection": "judgment|hybrid", "signal": "...",
                   "inputs": ["screenshots","html","psi"] } ] }
  ```
  **Vertical-masked** (criteria not applicable to the audited vertical are dropped, never judged). `inputs` tells the skill which artifacts to consult.
- **`merge.ts`** — concatenates the per-dimension findings files → `toCriterionResults` → `scoreRubric(rubric, results, { vertical, cwvPass, reachable, blocked, structuralFlags })` → `ScoreResult`. Proves the seam end-to-end; #4 reuses it.

### The 4 specialist skills — `.claude/skills/audit-<dimension>/`

`audit-conversion`, `audit-perf`, `audit-localseo`, `audit-trust`. Each follows one thin, identical procedure, differing only in its **lens** (inputs) and its **honesty constraints**:

1. Run the worklist CLI for its dimension → get `settled` + `toJudge`.
2. Gather only its inputs: screenshots via existing `screenshot.mjs` (mobile+desktop); HTML/PSI from `AuditData`.
3. Judge each `toJudge` criterion → `result` + `confidence` + one-line `rationale` + `evidence[]`. Every claim traces to an `AuditData` field, an HTML quote, or a screenshot observation (same honesty rule as `site-audit`).
4. Write `audit-<host>.<dimension>.json` = `settled` ∪ judged findings.

| Dimension | Lens (inputs the skill judges from) | Baked-in honesty constraints (from `SUMMARY.md §5`) |
|---|---|---|
| conversion | inventory (`clickToCall`/`bookingLink`/`contactForm`/`hours`) + screenshots (CTA dominance & placement, sticky/thumb-zone, social-proof position, form friction) | primary conversion action is vertical-specific (book/quote/request/order/visit) — judge against the right macro, not a flat `bookingLink` |
| perf | PSI mobile/desktop, CWV, `failedAudits`, stack (`legacy`/platform) | never hard-fail an image-optimized static site on **lab LCP alone**; never report a **blank CWV** (no CrUX) as a failure; pitch speed as a conversion lever, not a ranking guarantee |
| localSeo | inventory (`addressOrMap`/`localBusinessJsonLd`/`reviews`/`hours`/`menuSchema`) + HTML (NAP as real text, JSON-LD quality/`@type`) | grade JSON-LD **quality**, not mere presence; **never** self-`aggregateRating`; NAP-vs-GBP consistency can't be verified on-page (flag, don't assert) |
| trust | inventory (`https`) + HTML (footer privacy-policy link, social proof) + screenshots ("Not Secure", seal usage) | "form present + privacy absent" = the precise PIPA finding; frame as PIPA **risk-reduction**, never "legally compliant"; BBB/Norton seals are mixed-to-negative |

## Testing strategy

The deterministic core is the testable, high-leverage surface; the contract is machine-enforceable even where the verdict isn't.

- **TS unit tests** (`test/specialists/`) against the **real fixtures already in the repo** (`audit-www.restylesalon.com.json`, `audit-chopchopbarber.com.json`, etc.):
  - `resolve.ts` settles the expected deterministic criteria with correct results.
  - `failedAudits` harvest maps the Lighthouse a11y IDs correctly.
  - worklist is vertical-masked (an inapplicable criterion never appears in `toJudge`).
  - `merge.ts` → `scoreRubric` yields a grade/tier on a fixture.
- **Contract enforcement (machine-checkable, closes the "tests only cover the easy part" gap):** every emitted finding has a valid `result` enum, non-empty `rationale`, and — for any `judgment`/`hybrid` finding — non-empty `evidence[]`. A judgment finding with no evidence fails validation. (The *verdict* isn't unit-testable; its *traceability* is.)
- **Skill verification:** one recorded golden run of one specialist on one fixture site, documented in that skill, to pin the procedure.

## Success criteria

- Running the 4 skills on one real (scraped) site yields 4 findings files whose `merge` feeds `scoreRubric` to a grade + tier — **the rubric is exercised on a live URL for the first time.**
- `resolve.ts` + contract tests pass against fixtures; **no collector probes changed.**
- Every finding is traceable (evidence per judgment finding); deterministic share is reproducible run-to-run.

## Out of scope (deferred)

- The 4 judgment-heavy specialists (`visual`, `content`, `vertical`, `a11y`).
- #4 orchestration Workflow, adversarial verifier, cross-dimension synthesizer.
- #5 build hand-off, #6 roleplay.
- Any `packages/audit` probe/collector changes.

## Interface to #4

The stable seam #4 builds on: each specialist is independently runnable and emits `SpecialistFinding[]`; `merge.ts` reduces + scores. #4 swaps the on-disk findings handoff for in-memory structured output and adds the verify/synthesis layer over the same contract. The file-on-disk handoff in #3 is acceptable throwaway; the `SpecialistFinding → CriterionResult` contract is permanent.
