# Deep Research: Engagement Scoping Rubric (which engagement to propose per prospect)

**Date:** 2026-06-15
**Method:** Deep-research workflow — 110 agents, 6 angles, 27 sources, 134 claims, top 25 verified. **Result: 25/25 confirmed, 0 refuted.** Tooling + Core Web Vitals claims rest on PRIMARY sources (Google docs, npm, GitHub); the redesign-vs-refresh decision rules rest on corroborated agency-blog consensus (conventional practice, not empirical studies).

> Answers your core question: *does the shop have no site / do we rebuild the whole thing / or do targeted fixes?* — plus how to assess a site fast and scope each path.

---

## A. The decision tree (observed condition → engagement type)

```
Does the prospect have a real website?
│
├─ NO (no site, or only a social/Google Business page)        → ENGAGEMENT 1: BRAND-NEW SITE
│
└─ YES → run the rapid audit (Section B) → grade A–F + foundation check
         │
         ├─ Systemic failure / audit grade D–F                → ENGAGEMENT 2: FULL REBUILD/REDESIGN
         │    Triggers: unsupported/insecure platform or tech; theme/plugin bloat & conflicts;
         │    security debt; broken information architecture (users can't find info/complete tasks);
         │    not mobile-friendly; conversion failure; dated look hurting credibility;
         │    business pivot/rebrand or major new functionality (e-commerce, CRM, multilingual);
         │    site 3–5+ yrs old WITH structural problems.
         │
         ├─ Solid foundation, surface-level issues / grade B–C → ENGAGEMENT 3: TARGETED FIXES
         │    Triggers: modern/responsive/secure base but needs mobile fix, add booking,
         │    speed/SEO fixes, refresh a few sections, broken links, outdated CTAs,
         │    on-page SEO/WCAG tweaks. Also when deadline is urgent or budget can't fund a rebuild.
         │
         └─ Already aligned, only needs upkeep / grade A–B       → ENGAGEMENT 4: CARE RETAINER
              Ongoing minor updates, security, content, monitoring.
```

**The core heuristic = "foundation-strength test"** (verified 3-0 across Reaktiv, MediaForce, Unleashed-Technologies, IntactDIA):
- **Rebuild** = systemic/structural failure or a base that can't safely/affordably be brought to modern security, accessibility, and functionality standards.
- **Incremental/refresh** = the base architecture is modern, responsive, secure, brand-aligned and the problems are surface-level.

> Conditional heuristics (verified but weaker, 2-1): the "3–5 years old" age threshold and "urgency favors incremental fixes" are valid **only combined** with a structural/business-goal assessment — never as standalone triggers.

---

## B. Rapid audit checklist (minutes, automatable, AI-agent-friendly)

This is the per-prospect classifier. It doubles as the **lead-gen "free audit"** hook (the verified winning outreach angle from the GTM pass).

| Check | Tool | Automatable? |
|---|---|---|
| Performance + **Core Web Vitals** (LCP, INP, CLS), SEO, Accessibility, Best-Practices scores | **PageSpeed Insights API** (runs Lighthouse on Google infra, REST→JSON, free ~25,000 req/day) | ✅ REST, ideal for an AI agent |
| Same, run hands-off in CI | **Lighthouse CI** (`npm i -g @lhci/cli`, `lhci autorun`, Apache-2.0, Google) | ✅ CLI |
| 251 rules / 20 categories → **0–100 score + A–F grade** (perf/CWV, security/SSL/HSTS/CSP, broken links/redirect chains/orphans, meta, structured data, accessibility/ARIA/contrast, JS rendering via Playwright) | **SEOmator CLI** (`npm @seomator/seo-audit` v3.0.1, MIT) — e.g. `seomator audit https://site.com --crawl -m 50 --format json -o out.json` | ✅ CLI, JSON/HTML/MD/LLM-XML output |
| Tech-stack detection (legacy CMS / plugin bloat) | Wappalyzer / BuiltWith | ✅ (API) — *open question on which API + weighting* |
| Mobile-friendliness | Lighthouse / PSI mobile run | ✅ |
| Google Business Profile completeness | manual / GBP checks | partly |
| End-to-end orchestration: pull prospects from a sheet → run Lighthouse → GPT/Claude writes the audit summary + outreach email referencing real scores | **n8n** workflow (+ LLM) | ✅ (no first-party Lighthouse node — via HTTP Request/community node) |

**Grade → action mapping** (built into SEOmator's own descriptors):
- **A (90–100)** = minor optimizations only → *Care retainer / leave-as-is*
- **B–C (70–89)** = priority fixes → *Targeted fixes*
- **D–F (0–69)** = multiple/critical issues → *Full rebuild*

**Core Web Vitals pass/fail thresholds** (verified vs Google web.dev): **LCP < 2.5s · INP ≤ 200ms · CLS < 0.1**. (INP replaced FID in March 2024.)

> ⚠️ **Tool-fidelity caveat:** SEOmator/Lighthouse/PSI measure CWV as **lab/synthetic single loads**; Google's official pass/fail is **field data (CrUX) at the 75th percentile**. Small-business sites often lack CrUX data entirely. So automated scores *approximate*, not certify, Google's verdict (and PSI varies ±5 pts run-to-run). Good enough for triage/classification; don't quote them as Google's official verdict.

---

## C. Scoping & quoting each engagement

- **Productize fixed-scope offers per tier.** Control scope creep with one hard boundary: **surface-level = in scope; structural change = a rebuild (re-quote).**
- **Brand-new site & rebuild** → fixed-scope **projects**.
- **Targeted fixes** → fixed-scope **micro-packages** (e.g. "mobile fix," "add booking," "speed+SEO tune-up").
- **Care** → recurring **retainer**.
- Steer **budget-limited / urgent** prospects to incremental fixes now, rebuild later.

> ⚠️ Concrete dollar figures and exact in/out-of-scope line items per package were **not** established here — see pricing in the [GTM report](2026-06-15-go-to-market-and-service-model.md) and the open questions below.

---

## D. Rebuild-as-cheaper (the AI-studio advantage)

Verified (3-0): a from-scratch rebuild is **frequently the lower-cost/faster option** — *especially for an AI/template-leveraged studio* — when a legacy site (old WordPress + theme/plugin bloat, end-of-life CMS, insecure architecture) can no longer be cheaply maintained or brought up to modern security/accessibility/compliance. Unleashed-Technologies: *"starting fresh may actually be more cost-effective than trying to patch together an old system."* Rule of thumb: **when patching cost ≥ rebuild cost, propose the rebuild.** Our fast AI pipeline lowers rebuild cost, so this tips toward rebuild more often than for a traditional agency.

---

## E. Migration (mandatory on any rebuild)

**SEO continuity is the #1 migration priority** (verified 3-0). Redesigns frequently lose Google rankings from **missing/incorrect 301 redirects** — the most common cause of post-launch ranking loss. Before launch, plan:
1. **URL-to-URL 301 redirect mapping** (every old URL → new).
2. **Preserve URL structure** where possible.
3. **Content + metadata migration** (titles, descriptions, schema).
4. **Protect Core Web Vitals** (esp. LCP, CLS) on the new build — Astro static output helps here.
5. **Domain/email continuity** — DNS cutover without downtime, protect email (MX) during registrar/host moves.

---

## Open questions (carry forward)
1. Concrete dollar pricing + in/out-of-scope line items per productized tier (new / rebuild / fix-package / care retainer); hourly vs fixed-scope in practice.
2. Evidence-based structure for the **care/maintenance retainer** specifically (deliverables, SLAs, security/backup/update cadence, price) — no dedicated verified source yet. *(On our static Astro/Git stack the maintenance surface is much smaller than WordPress — define the retainer around content edits, monitoring, and small changes, not plugin patching.)*
3. Best tech-stack-detection + GBP-completeness **APIs** for automation and their scoring weights in the combined rubric.
4. How to reconcile lab CWV scores with Google field/CrUX pass-fail for low-traffic small-business sites.

---

## Sources
**Primary:** github.com/seo-skills/seo-audit-skill (SEOmator) · npm @seomator/seo-audit · Google web.dev/vitals · GoogleChrome/lighthouse-ci · developers.google.com/speed (PSI API)
**Secondary/blog (decision rules & migration):** reaktiv.co (redesign vs incremental, parts 2 & 3) · mediaforce.ca (refresh vs redesign 2025) · unleashed-technologies.com · intactdia.com · debugbear.com (Lighthouse automation; PSI API) · n8n.io (audit+GPT-4 workflow #5940) · prontomarketing.com (technical reasons to rebuild WordPress) · darkstarmedia.net · rapid301.com (SEO migration checklist) · brandvm.com (SEO migration; pricing models) · serverspan.com (domain/email cutover) · bugherd.com (retainers) · assembly.com (productized services) · successknocks.com (scope creep) · oxone.ca / cliowebsites.com (Calgary pricing) · clickworthy.io (Canada maintenance)
