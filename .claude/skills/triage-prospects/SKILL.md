---
name: triage-prospects
description: Use when you have an Outscraper Google Maps export (or any local-shop CSV) to filter, dedupe, classify website-presence, and rank into a consistent audit queue before running site-audit. Triggers on "triage the prospects", "process the Outscraper export", "who do we audit", "build the audit queue", or a CSV dropped in leads/inbox/.
---

# Triage Prospects

Turn a raw Outscraper Google Maps export into a **consistent, deduped, ranked audit queue** — the same way every time. This is the step between the scrape and `site-audit`.

**Two-layer rule (same as the audit tool): `scripts/triage-prospects.mjs` owns the facts (dedup, website classification, scoring, top-20 selection — deterministic, same input → same output); you only read the result, run the audits, and re-rank with judgment AFTER auditing.** Never hand-filter the CSV or eyeball the top 20 — that reintroduces the drift this skill exists to kill.

## Where files live (every time)
- **Input:** drop the Outscraper CSV in `leads/inbox/` (gitignored — prospect PII / Alberta PIPA).
- **Output:** `leads/triaged/<base>-ranked.csv`, `<base>-top20.csv`, `<base>-log.md`.

## Procedure

1. **Run the triage engine** (auto-picks the newest CSV in `leads/inbox/`, or pass a path):
   ```bash
   node scripts/triage-prospects.mjs              # newest in leads/inbox/
   node scripts/triage-prospects.mjs <path.csv>   # explicit
   ```
2. **Read `<base>-log.md` first.** Confirm the disposition check line ends in ✅ (`kept + dropped = input`). That proves **no site was missed or silently disregarded**. Skim the dropped list for any wrongly-dropped shop (e.g. a local gem mis-flagged as a chain) → fix CONFIG and re-run.
3. **Audit the top 20.** The `<base>-top20.csv` is the queue. For each row:
   - `audit_path = collector` → run the **`site-audit`** skill / `packages/audit` collector on its `url`.
   - `audit_path = new-build (no real site)` → no URL to scan; it's the new-build path (social-only / booking-only / no site). Do **not** run the collector.
4. **Post-audit re-rank (the judgment layer).** Triage scored only objective fields; it could NOT see site quality. After auditing, add the playbook's subjective points (`+3` weak/dated site from the audit grade + visual review, `−2` already-excellent site) and resort if needed. This is the only place human/AI judgment enters.

## Iterating the procedure (the whole point)
Edit the **CONFIG block** at the top of `scripts/triage-prospects.mjs`, then re-run — the rules are versioned and explicit, so a change is a diff, not a vibe:
- `chains` — drop more franchises / non-fits
- `socialDomains` / `bookingDomains` — what counts as "not a real website"
- `cityMustMatch` / `postalPrefixes` — the area gate
- `verticalMap` — category → our vertical kits
- `weights` / `activeReviewsThreshold` / `keepScore` / `topN` — scoring + selection

## What the engine guarantees (so you don't re-check by hand)
| Concern | How it's handled |
|---|---|
| Duplicate sites audited twice | Dedup by `place_id` → name+address → phone → domain |
| Sites missed / disregarded | Every input row gets one disposition; log asserts `kept + dropped = input` |
| Inconsistent top 20 | Deterministic sort: score ↓, reviews ↓, name ↑, place_id ↑ |
| Social/booking link counted as a website | Classified as `social_only` / `booking_only` → no real site → new-build path |

## Common mistakes
- **Hand-editing the CSV before running.** Don't — change CONFIG instead, so it's reproducible next pull.
- **Skipping the log's ✅ check.** That line is the proof nothing was dropped silently.
- **Adding "weak site" points during triage.** That's post-audit only; triage stays objective and reproducible.
- **Committing the data.** `leads/` is gitignored on purpose. Keep it that way.

## When this graduates to a tool
This skill + script IS the manual-first lead pipeline. Build the fuller `packages/leads` only on the trigger in `docs/gtm/prospecting-playbook.md` ("Build trigger"). Until then, this is the established procedure.
