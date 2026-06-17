# Audit Foundation — Provenance

How this knowledge base was produced, and what to trust.

## Run

- **Date:** 2026-06-16
- **Producer:** `.claude/workflows/audit-foundation-research.mjs` (4-layer hierarchy: plan → wide parallel cited research → adversarial verify → synthesize), run via the Workflow tool.
- **Scale:** 700 subagents, ~8.1M subagent tokens, ~20 min wall-clock.
- **Spec / plan:** `docs/superpowers/specs/2026-06-16-audit-suite-research-foundation-design.md` · `docs/superpowers/plans/2026-06-16-audit-foundation-research.md`

## What's here

- `claims.json` — **621 claims** across all 8 dimensions (perf 61, localSeo 90, visual 81, content 86, conversion 85, trust 64, a11y 70, vertical 84). Passes `pnpm --filter @studio0rbit/audit validate-claims`.
- `<dimension>.md` × 8 — per-dimension briefings synthesized from the claims.
- `SUMMARY.md` — cross-dimension master synthesis (the headline output).

## Confidence — read this before building on it

The **research layer succeeded**; the **adversarial-verify and synthesis layers were degraded by transient server-side rate-limiting** ("Server is temporarily limiting requests", not a usage-limit issue) caused by the 700-agent burst. Consequences:

- **85 claims are `verified`** (independent adversarial check passed, ≥1 cited source).
- **536 claims are `provisional`** — their verify agent died on the rate limit and defaulted to `provisional`. These are *sourced by research but not yet independently double-checked*. Treat magnitudes/percentages in provisional claims as directional; structural principles are robust.
- Whole dimensions came back **provisional in aggregate** (trust, conversion, content, a11y, vertical) because their verify pass was the most throttled.
- The 8 dimension briefings + `SUMMARY.md` were **regenerated after the run** from the real claims by a small, reliable subagent batch (the workflow's own synth layer had been rate-limited to empty output).

## Open follow-up

- **Verification top-up:** re-run adversarial verification over the 536 `provisional` claims (throttled, in batches, to avoid the rate-limit) to upgrade the ones that hold to `verified` and drop any that fail. This raises audit confidence before the rubric (sub-project #2) weights these claims.
