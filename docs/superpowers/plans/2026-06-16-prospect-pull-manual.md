# Prospect Pull (Manual, Free-Tier) Implementation Plan

> **For agentic workers:** This v1 is no-code. "Implementation" = targeted doc edits (Part A, done in-repo) + an operator runbook (Part B, run by hand against Outscraper). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Prove the scrape → website-presence → audit loop end-to-end for $0, and leave the repo's prospecting docs accurate.

**Architecture:** Outscraper free-tier Google Maps export (grab-all, no no-website filter) → qualify in a spreadsheet with the v1 rubric → audit the top ~20 with the EXISTING `packages/audit` tool. Review-response analysis is deferred to v2. No new code.

**Tech Stack:** Outscraper (free tier, Maps export) · existing `packages/audit` CLI · a spreadsheet.

**Spec:** [docs/superpowers/specs/2026-06-16-prospect-pull-manual-design.md](../specs/2026-06-16-prospect-pull-manual-design.md)

## Global Constraints

- **$0 spend** — stay inside Outscraper's 500 Maps records/month free tier.
- **Grab ALL shops** — do NOT apply the "no-website" filter; `has_website` is a column.
- **No new code** — use `packages/audit` and the `site-audit` skill as-is.
- **Review-response is OUT of v1** — defer to v2; do not capture/analyze owner replies.
- **First-pull scope:** verticals barber/salon, café/coffee, dental × areas Kensington + Inglewood/Bridgeland (≤500 records).

---

## Part A — Repo doc edits (done now, in-repo)

### Task A1: Correct the prospecting playbook for "grab all" + free tier

**Files:**
- Modify: `docs/gtm/prospecting-playbook.md`

- [ ] **Step 1:** In Step 1 (Scrape), change the no-website-filter guidance to "grab ALL shops in the vertical×area; do NOT apply the no-website filter — capture website-presence as the `Has website?` column. Rationale: ~75% of shops have a (usually weak) site that the audit tool monetizes as rebuild/tune-up."
- [ ] **Step 2:** Add a free-tier budget note: "v1 runs entirely in Outscraper's free tier — 500 Maps records/month. One pull = ≤500 places; scope vertical×area counts to fit."
- [ ] **Step 3:** In Step 3 (Qualify), mark the review-response consideration as deferred: "(Review-*response* analysis — does the owner reply? — is **v2/deferred**; see specs/2026-06-16-prospect-pull-manual-design.md §7. v1 keeps the +2 active-business line as-is.)"
- [ ] **Step 4:** In "Open items", add the build trigger: "Stay manual until any of: ≥3 pulls AND qualify+audit-loop >30 min/pull; OR paying past the free tier and want the audit batch-loop automated; OR re-pull dedupe gets painful. Then build the thin `packages/leads` tool (ingest CSV → rubric → ranked CSV → batch-loop the collector)."
- [ ] **Step 5:** Commit.

### Task A2: Log the approach + status in the roadmap

**Files:**
- Modify: `docs/roadmap.md`

- [ ] **Step 1:** Add a Progress-log entry dated 2026-06-16 noting the manual-first, free-tier prospect-pull approach is designed (spec + plan linked) and pending execution; review-response deferred to v2.
- [ ] **Step 2:** Update the Phase 3 "Open items"/status line to reference the manual-first decision and the build trigger.
- [ ] **Step 3:** Commit.

### Task A3: Record the locked decision

**Files:**
- Modify: `docs/decisions.md`

- [ ] **Step 1:** Add a dated decision: "Lead pipeline starts **manual-first** — Outscraper free-tier Maps export, grab-all (not no-website-only), audit top ~20 with the existing tool. Build the thin `packages/leads` tool only on the trigger. Review-response analysis deferred to v2. Rationale: validate scrape+audit and demand before writing code; Outscraper absorbs the Google-ToS scraping risk."
- [ ] **Step 2:** Commit.

---

## Part B — Operator runbook (run by hand; not in-repo)

### Task B1: Set up Outscraper free account

- [ ] Create an Outscraper account; confirm the free tier shows **500 Maps records/month**. No card needed for the free tier.
- [ ] (Optional) Note the API token if you later want to script it — not needed for the dashboard export.

### Task B2: Run the grab-all Maps export

- [ ] In Outscraper's Google Maps scraper, run one query per slice (stay ≤500 places total):
  - `barber shops Kensington Calgary`, `hair salons Kensington Calgary`
  - `cafes Kensington Calgary`, `coffee shops Inglewood Calgary`
  - `dentists Inglewood Calgary` / `dental Bridgeland Calgary`
- [ ] Do **not** enable the "businesses without websites only" toggle/filter.
- [ ] Export CSV. Confirm these columns are present: name, full address/neighbourhood, phone, **site** (URL or blank), **rating**, **reviews/review_count**, category.

### Task B3: Clean + qualify into the sheet

- [ ] Open the prospecting-playbook sheet schema. Import the CSV.
- [ ] Dedupe; drop chains/franchises/online-only.
- [ ] Set `Has website? = (site non-blank)`.
- [ ] Apply the v1 rubric (spec §4). Keep prospects scoring ≥5. Tag P1/P2/P3.
- [ ] Confirm the kept list is ~50–100.

### Task B4: Audit the top ~20

- [ ] Pick the top ~20 prospects overall (P1/P2).
- [ ] For each that HAS a URL, run the existing collector one at a time:
  ```bash
  cd packages/audit && PSI_API_KEY=$PSI_API_KEY pnpm tsx src/cli.ts <url> <vertical>
  ```
  (Or invoke the `site-audit` skill per URL — it also does the visual review + report.)
- [ ] For no-site prospects in the top 20: note "no real website" → new-build path; do NOT run the collector.
- [ ] Save each `audit-<host>.html` / `.json`.

### Task B5: Validate + decide

- [ ] Spot-check ~5 rows: did Outscraper's coverage and `site` field match what you'd find by hand on Maps?
- [ ] Confirm success criteria (spec §8): ~50–100 qualified sheet, top ~20 audited, $0 spent.
- [ ] Go/no-go: is the loop worth repeating? Does it hit the §6 build trigger yet?

---

## Self-Review

- **Spec coverage:** §1 purpose → B1–B5. §3 workflow → B2–B5. §4 rubric → B3 + A1 Step 3. §5 doc edits → A1–A3. §6 build trigger → A1 Step 4, A3, B5. §7 deferred → A1 Step 3 (explicitly out of B). §8 success → B5. §9 scope → Global Constraints + B2. All covered.
- **Placeholder scan:** none — every step states the concrete action; `<url>`/`<vertical>` are real CLI args, not placeholders.
- **Consistency:** `has_website`/`Has website?` column, `packages/audit` CLI path, and the rubric reference match the spec throughout.
</content>
