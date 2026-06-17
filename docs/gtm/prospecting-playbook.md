# Prospecting Playbook (Phase 3: build the Calgary lead list)

**Date:** 2026-06-15 · **Status:** operational how-to for generating + qualifying a prospect list. Feeds the [audit tool](../research/2026-06-15-engagement-scoping-rubric.md) (other session) and [outreach](outreach.md).
**Verified basis:** ~1 in 5 to 1 in 3 small businesses still have no website; **Outscraper** can scrape Google Maps and filter to "businesses without websites" (verified); value-first/free-audit outreach converts best (verified).

---

## The flow

```
SCRAPE → DEDUPE/CLEAN → QUALIFY (score) → PRIORITIZE → hand to AUDIT tool → OUTREACH
         └────────── the `triage-prospects` skill + script ──────────┘
```

> **Steps 2–4 (dedupe/clean/qualify/prioritize) are now run by the `triage-prospects` skill**, backed by the deterministic `scripts/triage-prospects.mjs`. Drop the Outscraper CSV in `leads/inbox/`, run the script, read `leads/triaged/<base>-log.md`. This guarantees the same input → same ranked top-20 every pull (no drift, no duplicates, every row accounted for). The manual table below documents the *rules the script encodes* — edit the script's CONFIG to change them.

## Step 1 — Scrape

> **v1 (manual, free-tier) — grab ALL, not no-website-only.** Do **NOT** apply the "no-website" filter. Capture website-presence as the `Has website?` column instead. Rationale: ~75% of Calgary shops have a (usually weak/dated) site, which the audit tool monetizes as a rebuild/tune-up — filtering to no-website-only throws away most of the market. See [specs/2026-06-16-prospect-pull-manual-design.md](../superpowers/specs/2026-06-16-prospect-pull-manual-design.md).
>
> **Free-tier budget:** v1 runs entirely inside Outscraper's free tier — **500 Maps records/month**. One pull = ≤500 places; scope your vertical×area count to fit (e.g. 3 verticals × 1–2 quadrants).

**Tools:** Outscraper (Google Maps export — use it as the workhorse; it absorbs the Google-ToS scraping risk) or Targetron (true "≤ rating" filter, paid only — not needed for v1). ⚠️ Reconfirm current pricing before any paid use (PAYG vs subscription).

**Search by vertical × Calgary area.** Run one export per vertical so the list maps to our section kits:
- `barber shops Calgary`, `hair salons Calgary`, `nail salons Calgary`
- `restaurants Calgary [neighbourhood]`, `cafes Calgary`, `coffee shops Calgary`
- `plumbers Calgary`, `electricians Calgary`, `contractors Calgary`
- `boutiques Calgary`, `[retail category] Calgary`

Repeat across Calgary quadrants/neighbourhoods (Kensington, Inglewood, Marda Loop, Bridgeland, etc.) to widen the net.

## Step 2 — Capture these fields (spreadsheet schema)

| Field | Why |
|---|---|
| Business name | identity |
| Vertical | maps to section kit |
| Address / neighbourhood | local fit + outreach |
| Phone | contact + click-to-call proof |
| Email / IG / FB | outreach channel |
| Website URL (or "none") | core qualifier |
| Has website? (Y/N) | core qualifier |
| Google rating | pain signal |
| Review count | activity/legitimacy signal |
| Mobile-friendly? (Y/N) | pain signal (quick manual or audit tool) |
| Audit grade (A–F) | filled by audit tool |
| Qualified? (score) | from Step 3 |
| Priority (1–3) | from Step 4 |
| Status | new / audited / contacted / replied / quoted / won / lost |

## Step 3 — Qualify (simple score, keep or drop)

Award points; keep prospects scoring well, drop the rest.

> **Review-*response* analysis is v2/deferred.** Whether the owner *replies* to reviews (a strong qualify + outreach signal) is **not** part of v1 — prove scrape+audit first. See [specs/2026-06-16-prospect-pull-manual-design.md](../superpowers/specs/2026-06-16-prospect-pull-manual-design.md) §7. v1 keeps the "+2 active business" line below as-is.

- **+3** No website, or a clearly weak one (not mobile / slow / dated / broken).
- **+2** Brick-and-mortar local Calgary shop in a target vertical.
- **+2** Active business (recent reviews, posts, responds to reviews).
- **+1** Sub-4★ rating *or* visibly behind competitors (room to improve = clearer pitch).
- **+1** Reachable (email/DM/phone present).
- **−3** Chain, franchise, or online-only (not our fit).
- **−2** Already has a strong, modern, mobile-fast site (audit grade A — low need).

Keep prospects scoring **≥ 5**.

## Step 4 — Prioritize

- **P1 — hot:** no website + active + reachable. Fastest "yes" (nothing to migrate, clear gap).
- **P2 — warm:** weak/dated site (audit grade D–F) → rebuild pitch + migration add-on.
- **P3 — nurture:** decent site, grade B–C → targeted "tune-up" angle.

## Step 5 — Hand to the audit tool

Run the [audit tool](../research/2026-06-15-engagement-scoping-rubric.md) (other session) across P1/P2 with existing sites; for no-site P1s the "audit" is the GBP-completeness + "you're invisible in search" angle. Each produces the 1-page audit that powers outreach.

## Step 6 — Outreach

Use the [templates](outreach.md#templates). Lead with one specific finding + the free audit. Log status in the sheet. Light follow-up after 3–4 days with a second finding.

---

## Cadence & targets (solo, week 1)

- Build an initial list of **~50–100 qualified Calgary prospects** across the demo verticals.
- Audit the top **~20** (P1/P2).
- Send the **first outreach batch** by end of week (roadmap Phase 4 goal).
- Track reply rate by channel (email vs DM vs walk-in) and double down on what works.

## Compliance note
Cold outreach to businesses: keep it relevant, honest, and easy to opt out. Canada's anti-spam law (CASL) applies to commercial electronic messages — include identification and an unsubscribe option in emails. *(Confirm specifics; this is operational, not legal advice.)*

## Open items
- ⚠️ Reconfirm Outscraper/Targetron pricing + pick PAYG vs subscription.
- Decide primary outreach channel to test first.
- CASL-compliant email footer (identification + opt-out).

## Build trigger — when manual graduates to a tool
Stay **manual-first** (free-tier Outscraper export → spreadsheet → audit top ~20) until **any** of:
- ≥3 pulls run AND the qualify + audit-loop step takes **>30 min/pull**, or
- You're paying past the free tier and want the audit **batch-loop** automated, or
- Re-pulling areas over time makes **dedupe-against-last-pull** painful.

Then build the thin `packages/leads` tool: ingest Outscraper CSV → apply this rubric → emit ranked CSV → batch-loop the existing `packages/audit` collector. No DB, no CRM, no UI. Full design: [specs/2026-06-16-prospect-pull-manual-design.md](../superpowers/specs/2026-06-16-prospect-pull-manual-design.md).
