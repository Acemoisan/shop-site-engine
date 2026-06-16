---
name: site-audit
description: Use when auditing a prospect's website for outreach or scoping. Given a URL, runs the deterministic collector, reviews the site visually from screenshots, writes the branded 1-page audit, and drafts how we'd implement the fixes. Triggers on "audit this site", "run a site audit", "scope this prospect".
---

# Site Audit

Two-layer rule: **the collector computes the facts (grade, tier, inventory); you only rank, write, and explain.** Never invent or re-derive scores. But the collector is blind to *how the site looks* — that's what the visual-review step is for, and it can change the recommendation.

## Steps

1. **Run the collector** from `packages/audit`:
   ```bash
   cd packages/audit && PSI_API_KEY=$PSI_API_KEY pnpm tsx src/cli.ts <url> <vertical>
   ```
   - `<vertical>` is optional (e.g. `barber`, `cafe`, `dental`). `PSI_API_KEY` is a persistent user env var on this machine — without it the grade is `confidence: "partial"` (no performance/CWV data, `PSI 429`). A free key gives 25k queries/day (see `docs/research/2026-06-15-pricing-tools-and-compliance.md`).
   - The CLI writes `audit-<host>.json` (data) and `audit-<host>.html` (branded, sendable 1-page report), and prints the JSON to stdout.

2. **Read the emitted `AuditData` JSON.** Take `grade.overall`, `tier`, `fixes.targeted`, `fixes.general`, `inventory`, `stack`, and `psi` as **authoritative**. Note `grade.confidence` and `reachable`/`blocked`.

3. **Handle the special states first:**
   - `reachable: false` → the **new-build** path. No working site; write a short "no real website" note (the report renders this) and **skip the visual review**. Don't fabricate page-level issues.
   - `blocked: true` (tier `blocked-unknown`) → site exists but our check was blocked (e.g. 403 challenge). Don't grade the challenge page; flag for a manual look. Screenshots may still work — try them.

4. **Visual review (the collector can't see this).** Capture and look at the real site:
   ```bash
   cd packages/audit && node screenshot.mjs <url>
   ```
   This writes `shot-<host>-mobile.png` and `shot-<host>-desktop.png` (full-page). **Read both images** and assess what an HTML scan misses:
   - Dated/templated aesthetic ("AI slop" or a 2010s theme), harsh or off-brand colour, weak type.
   - Poor hierarchy / walls of text / low-contrast hero / cramped or sparse sections.
   - Mobile experience specifically (most local traffic) — overly long, unreadable, broken layout.
   - Whether the look matches the business's price point (a premium shop with a cheap-looking site is a strong pitch).
   - **This can elevate the recommendation:** a site that's feature-complete (rubric says `tune-up`) but visibly dated/slow is really a **rebuild** opportunity. Say so, and base it on the screenshots + a failing `cwv.pass`/low `psi.performance`.

5. **Rank the top 3 issues** by **customer impact**, drawing on both layers: failing Core Web Vitals / slow `performance` and lost calls/bookings (click-to-call, booking, hours) > local SEO (address/map, LocalBusiness JSON-LD) > trust (HTTPS, reviews) > dated visuals/polish. The HTML report ranks the *feature* gaps; you add the perf + visual findings and adjust the prose for the vertical.

6. **For each issue, write:** the problem, *why it costs them customers*, and the fix — per `docs/gtm/outreach.md` structure. Plain-spoken, non-condescending.

7. **The HTML report is the artifact.** `audit-<host>.html` is self-contained — email, host, or screenshot it. Open the `file://` path to preview.

8. **Post-audit: how we'd implement it (scoping → plan).** Turn findings into our build plan:
   - **Tier → package → effort → price.** Map `tier` (and any visual-review upgrade) to Starter/Growth/Pro using `docs/gtm/packaging.md` and the Calgary anchors in the research doc.
   - **Pick the engine template.** Choose the closest `sites/tmpl-<vertical>-<variant>` (see `docs/templates-catalogue.md`) as the design starting point.
   - **Content migration.** List what ports straight over from their current site (services + prices, hours, reviews, address/map, booking link, phone) into our content model / Storyblok (use the `storyblok-shop-cms` skill).
   - **Close the gaps.** The missing `fixes.targeted` items (e.g. contact form, Menu/service structured data) become build tasks; we ship LocalBusiness JSON-LD by default.
   - **The performance win is the headline.** A static Astro build gets LCP < 2.5s / CWV pass — name the concrete before→after (e.g. "LCP 4.2s → under 2.5s").
   - **Output:** a short internal scoping note (template + content plan + gap list + package/price/effort) AND the client-facing next step (send the 1-page report; offer a quick before/after using the chosen template).

## Rules

- **Honesty:** if `grade.overall` is `A` *and* the site looks good, say so and recommend care/decline — do **not** manufacture problems.
- **CWV caveat:** describe Core Web Vitals as *indicative lab data*, never "Google's official verdict".
- **Confidence:** if `confidence: "partial"`, frame the grade as a *preliminary read* and note a full audit (with a PSI key) sharpens it.
- **Stay within facts:** every data claim traces to an `AuditData` field; every visual claim traces to something visible in the screenshots. If you didn't measure or see it, don't assert it.
