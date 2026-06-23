# Funnel Measurement — the numbers that decide viability

**Why this exists.** We deliberately took a one-time $1,500 fee with no retainer. That means there is no recurring revenue to smooth cash flow — every dollar comes from a *new* close. The 2026-06-22 market research found that **lead flow is the single make-or-break variable** for this model, and that we have **zero measured data** on ours. This doc defines what to track so the next audit batch produces a go/no-go answer instead of a vibe.

> The whole question reduces to one inequality:
> **per-client profit = $1,500 − COGS(delivery) − CAC(acquisition) > a number you'd accept for your time.**
> Everything below exists to fill in those two unknowns.

---

## 1. Run it as a cohort, not a vibe

Pick **one batch of 30–50 prospects** and take it end-to-end through the existing pipeline (triage → audit → outreach → close → deliver). Don't mix batches, don't change the pitch mid-batch, don't cherry-pick warm leads. One clean cohort gives you a conversion rate you can trust and project from. 30 is the floor for the close-rate number to mean anything; below that a single extra close swings the percentage wildly.

---

## 2. The funnel stages (track every prospect through these)

| # | Stage | Definition | Metric it produces |
|---|-------|-----------|--------------------|
| 1 | **Sourced** | In the triage queue, qualified (local shop, weak/no site, $1,500-plausible) | cohort size |
| 2 | **Contacted** | Outreach actually sent (audit + demo link delivered) | sourced→contacted % (drop = disqualified/no contact info) |
| 3 | **Replied** | Any human response, positive or not | **reply rate** = replied ÷ contacted |
| 4 | **Engaged** | Positive reply — a call, a "tell me more," interest | engage rate |
| 5 | **Closed** | Signed/agreed + **payment cleared** (deliver-first) | **close rate** = closed ÷ contacted |
| 6 | **Delivered** | Site live, handoff done, ownership transferred | delivery time |

**Overall conversion = closed ÷ contacted.** This is the headline number. Everything else diagnoses *where* the funnel leaks.

---

## 3. The two cost inputs (the part nobody has measured)

### A. CAC — cost to acquire one client
Track for the whole cohort, then divide by closes:

- **Operator outreach hours** — time triaging, reviewing audits, sending outreach, follow-ups, calls. (This is the big one. Log it honestly, including the ones that went nowhere — CAC includes the misses.)
- **Tool/data cost** — Outscraper credits, any paid lookup, email tools.
- **Pre-build cost for build-first outreach** — if you build a demo *before* they say yes, the compute + operator time for the *losing* demos is pure acquisition cost. (Build-first is powerful but front-loads CAC — measure it.)

**CAC = (total outreach hours × your hourly) + tool cost + losing-demo cost) ÷ closes.**

### B. COGS — cost to deliver one closed client
- **Agent/compute cost per build** — token/agent spend for one full build through the pipeline.
- **Operator delivery hours** — Gate-2 validation, fixes, Storyblok/CMS setup, deploy, handoff, the account/domain transfer.

**COGS = (delivery hours × hourly) + compute per build.**

---

## 4. The scoreboard (fill this in after the cohort)

```
COHORT: __________ (date, batch id)        n sourced: ____  contacted: ____

FUNNEL
  reply rate          ____ %   (replied ÷ contacted)
  engage rate         ____ %   (engaged ÷ contacted)
  close rate          ____ %   (closed ÷ contacted)   ← headline
  closes              ____

ACQUISITION
  total outreach hours        ____ h
  losing-demo build cost      $____
  tool/data cost              $____
  CAC (per close)             $____

DELIVERY (per closed client)
  compute per build           $____
  delivery hours              ____ h
  COGS (per close)            $____

UNIT ECONOMICS (per closed client)
  revenue                     $1,500
  − COGS                      $____
  − CAC                       $____
  = profit per client         $____
  total operator hours/client ____ h   (outreach-share + delivery)
  effective $/hour            $____     (profit ÷ total hours)
```

---

## 5. Go / no-go thresholds

Set these against *your own* acceptable hourly before you run, so you can't rationalize after. Suggested defaults:

| Signal | 🟢 Pursue | 🟡 Fix the funnel | 🔴 Rethink the model |
|--------|----------|-------------------|----------------------|
| **Close rate** (closed ÷ contacted) | ≥ 3% | 1–3% | < 1% |
| **Profit per client** | ≥ $900 | $400–$900 | < $400 |
| **Effective $/hour** (total time) | ≥ your target wage | 50–100% of it | < 50% |
| **CAC** | < $300 | $300–$700 | > $700 (eats half the fee) |

Reasoning behind the bands:
- **Close rate** — cold service outreach commonly converts ~1–3% contacted→close. Build-first (delivering a finished demo, not a pitch) *should* beat cold; if you're under 1% even with a demo in hand, the offer or the targeting is wrong, not the funnel.
- **Profit per client** — at $1,500 revenue, if COGS+CAC eat more than ~$600 you're working for a freelance daily rate with feast-or-famine risk attached. The no-retainer choice only pays off if each build is *clean* margin.
- **Effective $/hour is the real test.** A 5% close rate is worthless if each close costs 25 operator hours across the misses. This number is the one that tells you whether this beats just taking a job.

---

## 6. What each outcome means

- **🟢 across the board** → the funnel works; the no-lock-in positioning is landing. Scale the audit engine, *not* the build engine — the build is already commoditized and good enough. Reinvest in volume of qualified outreach.
- **🟡 funnel** → people reply but don't close, or closes are too costly. Test the *pitch* (lead with "you own everything, no monthly fees, agency-quality" — **drop "AI" and "fast"**, the research showed buyers don't value them), the targeting (replacement demand: shops with a *visibly bad* existing site, not no site), and follow-up cadence. Don't touch the product.
- **🔴 model** → if even a clean cohort can't clear your hourly, the one-time-fee structure is the problem the research flagged. Options short of quitting: (a) raise price to $2,000–$2,500 (still below the agency floor, where the research says you have room), (b) add a *client-owned, optional* annual-refresh or per-change add-on to lift LTV without becoming a retainer, (c) narrow to one vertical where build-first demos convert best.

---

## 7. The four questions this cohort answers

These came straight out of the 2026-06-22 research as the unfilled viability gaps:

1. Real conversion rate + CAC of the audit-as-outreach funnel. *(→ §4 scoreboard)*
2. True per-build COGS under the AI pipeline (compute + operator time). *(→ §3B)*
3. Is the addressable segment — Calgary shops with a bad/no site AND willing to pay $1,500 — big enough to feed the funnel repeatedly? *(→ cohort size vs. how hard sourcing 30–50 qualified prospects was)*
4. Does no-retainer cause post-launch drift that hurts referrals? *(→ track 60/90 days post-delivery: did the client keep the site current; did they refer anyone)*

Track it once, honestly, and you replace the biggest open question in the business with a number.
