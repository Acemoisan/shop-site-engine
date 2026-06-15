# Prospecting Playbook (Phase 3: build the Calgary lead list)

**Date:** 2026-06-15 · **Status:** operational how-to for generating + qualifying a prospect list. Feeds the [audit tool](../research/2026-06-15-engagement-scoping-rubric.md) (other session) and [outreach](outreach.md).
**Verified basis:** ~1 in 5 to 1 in 3 small businesses still have no website; **Outscraper** can scrape Google Maps and filter to "businesses without websites" (verified); value-first/free-audit outreach converts best (verified).

---

## The flow

```
SCRAPE → DEDUPE/CLEAN → QUALIFY (score) → PRIORITIZE → hand to AUDIT tool → OUTREACH
```

## Step 1 — Scrape

**Tools:** Outscraper (Google Maps export + "no website" filter) or Targetron (filters GBP listings showing an "Add Website" link). ⚠️ Reconfirm current pricing before buying (PAYG vs subscription).

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
