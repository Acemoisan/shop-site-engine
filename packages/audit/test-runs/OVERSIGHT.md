# Site-Audit Unattended Test — Oversight Notes

**Context for any future wake (user is away; keep running, don't interrupt them).**

## What's running
- Background bash loop `test-runs/loop.sh` (launched via Bash `run_in_background`, task id `b56blnzgw`).
- Every 10 min it audits the next 2 sites (rotating through `sites.json`, 8 sites) using the REAL collector pipeline (`runner.ts` → same probes the CLI uses).
- Outputs (all under `test-runs/results/`, gitignored):
  - `results.jsonl` — one structured JSON record per audit.
  - `summary.log` — one human-readable line per audit.
  - `loop.log` — raw loop/batch stdout + batch start/done timestamps + heartbeat.

## Working dir / branch
- Worktree: `C:\Users\aidan\Space\Studio0rbit\Websites\.claude\worktrees\site-audit-build`, branch `worktree-site-audit-build`.
- Do NOT touch the main checkout (another session works there).

## On each wake — do this
1. `tail test-runs/results/loop.log` — confirm a batch ran within the last ~10–11 min (heartbeat alive). If the loop died, relaunch `bash test-runs/loop.sh` in the background.
2. Read new `results.jsonl` lines. Check for: `crashed:true` records, unexpected `seomatorError`, hangs (durationMs near the 120s SEOmator timeout), or nonsensical grades/tiers.
3. **Consistency check:** grades are deterministic given probe outputs. For sites audited more than once, the grade/tier should be stable (SEOmator score may vary slightly; large swings = investigate). Flag any instability.
4. Append findings to `test-runs/results/ANALYSIS.md` (create if missing) with a timestamp.
5. Reschedule the next wake.

## Known state / caveats
- **PSI keyless = HTTP 429** (rate-limited). So `psiStatus:error` on every record and grades are `confidence:"partial"` (SEOmator + inventory driven). This is correct graceful degradation. To get full performance/CWV grades + "high" confidence, set `PSI_API_KEY` in the environment before the loop runs — `runner.ts` reads it automatically.
- Expected sanity: stripe/smashingmagazine → high SEOmator + B/A; techcrunch → WordPress stack, possibly legacy flag; wix/squarespace → platform detected; example.com → C, tune-up; dead URL → F, new-build.

## Remaining build work (deferred, not blocking trials)
- **Task 11** of `docs/superpowers/plans/2026-06-15-site-audit-tool.md`: the `site-audit` skill + branded 1-page HTML report (presentation layer). The core collector mechanics (Tasks 1–9 + Windows SEOmator fix) are DONE and reviewed.
- A final full code review across the whole audit package once Task 11 is in.

## Collector status: DONE + reviewed
Tasks 1–9 complete, 23 unit tests green, end-to-end CLI works on Windows. `pnpm tsx src/cli.ts <url> [vertical]` produces AuditData JSON.
