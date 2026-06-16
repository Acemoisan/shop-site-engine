---
name: site-audit
description: Use when auditing a prospect's website for outreach or scoping. Given a URL, runs the deterministic collector then writes the branded 1-page audit. Triggers on "audit this site", "run a site audit", "scope this prospect".
---

# Site Audit

Two-layer rule: **the collector computes the facts (grade, tier, inventory); you only rank, write, and explain.** Never invent or re-derive scores.

## Steps

1. **Run the collector** from `packages/audit`:
   ```bash
   cd packages/audit && PSI_API_KEY=$PSI_API_KEY pnpm tsx src/cli.ts <url> <vertical>
   ```
   - `<vertical>` is optional (e.g. `barber`, `cafe`, `dental`). `PSI_API_KEY` is optional but **strongly recommended** — without it the grade is `confidence: "partial"` (no performance/CWV data) and every site shows a `PSI 429` error. A free key gives 25k queries/day (see `docs/research/2026-06-15-pricing-tools-and-compliance.md`).
   - The CLI writes two files in the working dir: `audit-<host>.json` (the data) and `audit-<host>.html` (the branded, sendable 1-page report). It also prints the JSON to stdout.

2. **Read the emitted `AuditData` JSON.** Take `grade.overall`, `tier`, `fixes.targeted`, `fixes.general`, `inventory`, and `stack` as **authoritative**. Note `grade.confidence` and `reachable`/`blocked`.

3. **Handle the special states first:**
   - `reachable: false` → the **new-build** path. There's no working site. Write a short "no real website" note; the report already renders this. Don't fabricate page-level issues.
   - `blocked: true` (tier `blocked-unknown`) → the site exists but our automated check was blocked (e.g. a 403 challenge). **Do not grade the challenge page.** Flag for a quick manual look before outreach.

4. **Rank the top 3 issues** for this vertical from `fixes.targeted` + `psi.failedAudits`, ordered by **customer impact**: lost calls/bookings (click-to-call, booking, hours) > local SEO (address/map, LocalBusiness JSON-LD) > trust (HTTPS, reviews) > polish (OG tags, favicon). The HTML report already ranks by a built-in impact order; your job is to sanity-check that ranking against the specific vertical and adjust the outreach prose.

5. **For each issue, write:** the problem, *why it costs them customers*, and the fix — following the `docs/gtm/outreach.md` structure. Keep it plain-spoken and non-condescending.

6. **The HTML report is the artifact.** `audit-<host>.html` is self-contained (inline CSS, no build) — it can be emailed, hosted, or screenshotted. To preview/screenshot it, open the `file://` path. Then produce the **internal scoping note**: `tier` + the targeted vs general fix split → which package (Starter/Growth/Pro) and rough effort.

## Rules

- **Honesty:** if `grade.overall` is `A`, say so and recommend care/decline — do **not** manufacture problems. The report enforces this; your prose must too.
- **CWV caveat:** describe Core Web Vitals as *indicative lab data*, never "Google's official verdict". (The report footer already says this.)
- **Confidence:** if `confidence: "partial"`, frame the grade as a *preliminary read* and note a full audit (with a PSI key) sharpens it.
- **Stay within facts:** every claim in the writeup must trace to a field in the `AuditData`. If you didn't measure it, don't assert it.
