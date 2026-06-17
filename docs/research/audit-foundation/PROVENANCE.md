# Audit Foundation — Provenance

How this knowledge base was produced, and what to trust.

## Run

- **Date:** 2026-06-16
- **Producer:** `.claude/workflows/audit-foundation-research.mjs` (4-layer hierarchy: plan → wide parallel cited research → adversarial verify → synthesize), run via the Workflow tool.
- **Scale:** 700 subagents, ~8.1M subagent tokens, ~20 min wall-clock.
- **Spec / plan:** `docs/superpowers/specs/2026-06-16-audit-suite-research-foundation-design.md` · `docs/superpowers/plans/2026-06-16-audit-foundation-research.md`

## What's here

- `claims.json` — **620 claims** across all 8 dimensions (perf 61, localSeo 89, visual 81, content 86, conversion 85, trust 64, a11y 70, vertical 84). Passes `pnpm --filter @studio0rbit/audit validate-claims`.
- `<dimension>.md` × 8 — per-dimension briefings synthesized from the claims.
- `SUMMARY.md` — cross-dimension master synthesis (the headline output).

## Confidence

The research run (700 agents) produced 621 claims, but its **adversarial-verify and synthesis layers were degraded by transient server-side rate-limiting** ("Server is temporarily limiting requests", not a usage-limit issue) from the 700-agent burst — leaving only 85 verified / 536 provisional and empty briefings.

A **verification top-up** then re-ran adversarial verification over all 536 provisional claims in 27 batches across 3 small waves (≈20 claims/agent — no thundering herd, no throttling). Result:

- **556 claims `verified`** (471 upgraded by the top-up + the original 85) — independent adversarial check passed, ≥1 cited source each.
- **64 claims `provisional`** — second-pass could not substantiate a specific statistic/number; structural principle usually sound, magnitude directional. Flagged inline in the dimension briefings with _(provisional)_.
- **1 claim `refuted` and dropped** (Reserve-with-Google for beauty/wellness IS available in Canada via Fresha/Booksy — the original "US-only / 2026 roadmap" claim was wrong).
- The 8 dimension briefings + `SUMMARY.md` were regenerated from the re-verified base so confidence tags are accurate.

**Net: ~90% of the base is now independently verified.** Tooling: `topup-prep.mjs` (split provisional → batches), batch verifier subagents (→ `.topup/verdict-*.json`), `topup-merge.mjs` (merge verdicts → claims.json). The `.topup/` working dir is not committed.

## Open follow-up

- The remaining 64 provisional claims are mostly unsubstantiated specific statistics — fine to keep as directional, or chase exact sources later. They should be **down-weighted (not excluded)** when the rubric (sub-project #2) assigns weights.
