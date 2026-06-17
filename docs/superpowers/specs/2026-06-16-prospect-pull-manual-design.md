# Prospect Pull (Manual, Free-Tier) — Design Spec

**Date:** 2026-06-16 · **Status:** approved design, pre-plan
**Roadmap:** Phase 3 — Lead pipeline ([roadmap.md](../../roadmap.md))
**Builds on:** [prospecting-playbook.md](../../gtm/prospecting-playbook.md) · [pricing-tools-and-compliance research §2](../../research/2026-06-15-pricing-tools-and-compliance.md) · the built [site-audit tool](../../../packages/audit) + skill

---

## 1. Purpose

Prove the **scrape → website-presence → audit** loop works, end to end, for **$0**, before writing any lead-pipeline code.

Point a vertical×area at Outscraper's free tier → get every shop in that slice with a website-present field → qualify down to a ranked list → run the **existing** `packages/audit` collector on the top prospects. Output: a ranked Calgary prospect sheet + the audits, and the confidence (or not) to invest in a tool.

**Explicit non-goal for v1:** review-response analysis. Deferred to v2 (see §7). v1 captures `rating` and `review_count` because the Maps export gives them free, but does **not** analyze owner replies.

## 2. Approach decision (why this, settled in brainstorming)

- **Manual-first, build later.** A solo operator needs ~50–100 leads; a custom tool is over-engineering until volume proves it out. Build only on the §6 trigger.
- **Outscraper as the workhorse.** It already does exactly what's needed (Google Maps export with a native `site`/website field) and **absorbs the Google-ToS scraping risk** — scraping public data isn't illegal (hiQ v. LinkedIn / CFAA), but it breaches Google's ToS, so let the vendor own that. DIY Playwright stays a rare per-shop deep-dive tool, not the bulk method.
- **Free tier only for v1.** Outscraper gives **500 Maps records/month** free — enough for the whole first pull at zero spend.
- **Grab ALL, not no-website-only.** ~25% of Canadian small businesses lack a website (shrinking ~1–2pp/yr); the other ~75% mostly have weak/dated sites that the audit tool monetizes as rebuild/tune-up. Website-presence is therefore a **column, not a filter**.

## 3. Workflow (inside the 500-record free tier)

```
1. SCRAPE   Outscraper Maps export, one query per vertical×area.
            Budget: ≤500 places total. NO "no-website" filter.
            Keep fields: name, address/neighbourhood, phone, site (URL|blank),
                         rating, review_count, category.
2. CLEAN  } Run the `triage-prospects` skill (scripts/triage-prospects.mjs):
3. QUALIFY} drop CSV in leads/inbox/ → dedupe (place_id→name+addr→phone→domain),
          } classify has_website (social/booking-only = no real site), score by the
          } v1 rubric (§4), emit a DETERMINISTIC ranked list + a triage log that
          } accounts for every input row. Edit the script CONFIG to iterate the
          } rules. Replaces hand-qualifying in a spreadsheet; keeps ~50–100.
4. AUDIT    Take the top ~20 prospects overall (P1/P2). For each that HAS a URL,
            run the EXISTING collector, one at a time:
              cd packages/audit && PSI_API_KEY=$PSI_API_KEY pnpm tsx src/cli.ts <url> <vertical>
            No-site prospects in the top 20 → the audit tool's new-build path
            (no URL to scan; note "no real website" — do not run the collector).
5. REVIEW   (the work, not Google reviews) Sanity-check coverage and the CSV shape:
            did Outscraper return roughly the shops you'd find by hand on Maps?
            Is website-presence accurate on a spot-check of ~5?
```

## 4. Qualify rubric (v1 — review-response line removed)

Award points; keep prospects scoring **≥ 5**.

- **+3** No website, or a clearly weak one (not mobile / slow / dated / broken).
- **+2** Brick-and-mortar local Calgary shop in a target vertical.
- **+2** Active business (recent reviews, legitimate review_count).
- **+1** Sub-4★ rating *or* visibly behind competitors (clearer pitch).
- **+1** Reachable (email / phone / social present).
- **−3** Chain, franchise, or online-only (not our fit).
- **−2** Already a strong, modern, mobile-fast site (audit grade A — low need).

Priority: **P1** = no website + active + reachable · **P2** = weak/dated site (audit D–F) · **P3** = decent site (B–C), tune-up angle.

> Deferred: the original playbook bundled "responds to reviews" into the +2 active line. v2 splits review-response into its own captured field and angle selector (§7). v1 leaves the +2 line as-is.

## 5. Artifacts / repo changes

- **Update `docs/gtm/prospecting-playbook.md`:**
  - Step 1: "grab ALL — do **not** apply the no-website filter; website-presence is a column."
  - Add the **free-tier budget note** (500 Maps records/mo; one pull = ≤500 places).
  - Mark the review-response capture (current Step rubric language) as **v2 / deferred**, pointing here.
- **No code changes.** The audit tool and `site-audit` skill are used as-is.
- **Record the §6 build trigger** in the playbook's "Open items".

## 6. Build trigger (when manual-first graduates to a thin `packages/leads` tool)

Build only when **any** is true:
- ≥3 manual pulls run AND the qualify+audit-loop step takes **>30 min/pull**, or
- You've moved past the free tier (paying for exports) and want the audit **batch-loop** automated, or
- You re-pull areas over time and **dedupe-against-last-pull** becomes painful.

The thin tool, when triggered, is: ingest Outscraper CSV → apply rubric → emit ranked CSV → batch-loop the existing collector. No DB, no CRM, no UI.

## 7. Deferred to v2 (review-response mechanics)

Once scraping is proven, add owner-reply analysis as a captured signal:
- Source: Outscraper **Reviews** scraper (separate 500-free/mo meter; cap ~10 reviews/place → ~50 places free) **or** manual eyeball of the top prospects' Maps review tab.
- Fields: `responds_to_reviews` (Y/N/some), `~reply_rate`, `last_reply_date`.
- Dual use: **qualify** (owner who replies = engaged/reachable → +1) and **outreach angle** (many reviews + no replies = the hook: "Google ranks repliers higher"). Verified signal: 63% of businesses never reply; 97% of customers read replies; replies are a confirmed Google local-ranking factor.

## 8. Success criteria (how we know v1 worked)

- A ranked sheet of **~50–100 qualified Calgary prospects**, P1/P2/P3 tagged, with an accurate `has_website` column (spot-checked).
- **Top ~20 audited** with the existing tool (HTML report + grade/tier per prospect; no-site prospects on the new-build path).
- **$0 spent** (stayed within the free tier).
- A go/no-go read on Outscraper coverage + CSV shape for the eventual tool.

## 9. First-pull scope (proposed default, adjustable at execution)

- **Verticals:** barber/salon, café/coffee, dental (strongest demo kits).
- **Areas:** Kensington + Inglewood/Bridgeland (keeps the pull under 500 records).
- Repeat across more quadrants in later pulls once the loop is proven.

## 10. Scope boundaries (YAGNI)

**In:** one manual Outscraper free-tier pull, the v1 rubric, the playbook doc updates, auditing the top ~20 with the existing tool, the build trigger.
**Out (deferred):** any new code; review-response analysis (v2); paid exports; Targetron low-rating filter; persisted prospect DB / status tracking; re-pull dedupe automation.
</content>
</invoke>
