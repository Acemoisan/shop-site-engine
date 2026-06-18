# Studio0rbit Shop-Site Engine — Integrity Report

*Generated 2026-06-17 by a 28-agent multi-angle verification sweep (12 units × verify+adversarial pass, + 3-lens missing-components analysis, + synthesis). Two highest-stakes claims independently re-verified by hand.*

## 1. VERDICT

**Not ready to "fully take off."** The middle of the pipeline is genuinely good: the audit collector runs live and is honest about speed claims, the shared component engine and OKLCH token system work as documented for the primary path, and Bitcoin Manor proves the agent can produce one real, styled, JSON-LD-correct, form-bearing site. But every part of the model that makes this an *autonomous, productized, no-maintenance agency* — rather than a one-off site builder — is either unproven, contradicted by its own code, or missing. The headline "client edits in Storyblok → site auto-rebuilds, nobody in the loop" loop has executed **zero times** on a real client (both real runs are frozen pre-built deploys with accounts still under the operator's personal email). The flagship landing site currently carries (in the working tree slated for deploy) fabricated "Real results from real local businesses" testimonials that the code itself flags `placeholder: true / Do NOT deploy`. Pricing is incoherent across three live numbers. There is no CRM, no invoicing, no signed-contract gate, no CI, and no per-client SEO baseline. The product is a strong *demo and a strong build agent*, not yet a *repeatable, money-collecting, hands-off business*. n=1, and even that one is incomplete at the last mile.

---

## 2. CRITICAL & HIGH ISSUES (survived adversarial review)

### Truthfulness / consumer-facing (highest priority)

| # | Sev | Issue | Location | Fix |
|---|-----|-------|----------|-----|
| T1 | CRITICAL | Fabricated 5-star testimonials ("Sample Café/Barbershop/Studio", "paid for itself in the first month") under heading "Real results from real local businesses" — business has **zero** real clients. File self-flags `placeholder:true` + "Do NOT deploy these as-is" but `Testimonials.astro` renders unconditionally. Currently in the uncommitted working tree of `feat/bitcoin-manor`, NOT yet on deployed `origin/main`. | `sites/landing/src/content/site.ts:156-159`; `sites/landing/src/components/Testimonials.astro`; `index.astro:53` | Make `Testimonials.astro` skip `placeholder:true` items (or the whole section) before this branch merges/deploys. Replace with real Bitcoin Manor proof only with client consent. |
| T2 | HIGH | Fabricated "Calgary" geographic claim in live client hero alt text — intake names only Alberta, explicitly "no public address, online brand". | `sites/bitcoin-manor/src/pages/index.astro:210` | Remove "Calgary"; use "Alberta" or drop the locality. |
| T3 | HIGH | Forbidden lab-as-felt-time speed framing ("LCP 38.8s → 3.1s") permanently in git history + stale `.txt` handoff — the exact framing commit `bd57a7a` declared forbidden. Numbers disagree across artifacts (64→89 vs 67→85). | commit `4aed1ac` message; `docs/handoff/bitcoin-manor-handoff.txt:10` | Delete/supersede the stale `.txt`, mark canonical handoff, never quote lab LCP as felt time. |

### Autonomy / deploy last-mile (the core product promise)

| # | Sev | Issue | Location | Fix |
|---|-----|-------|----------|-----|
| A1 | HIGH | **Auto-rebuild loop (Storyblok Publish→webhook→host rebuild) has executed zero times** on any client. Both real runs are pre-built manual deploys. A client who edits and Publishes today sees **no change**. `roadmap.md:108` "Edit→publish→rebuild loop verified" describes only a *local build-time fetch*, NOT the host webhook path. | `deploy-shop-site/SKILL.md:61`; `docs/deployment.md:3`; bitcoin-manor handoff §5 | Wire + execute the loop end-to-end on one real client; only then list it as a routine Deliver step. |
| A2 | HIGH | "One standalone repo per client" production model never performed. Bitcoin Manor lives only in the dev monorepo on unmerged `feat/bitcoin-manor`; `package.json` still has `@studio0rbit/shared: workspace:*`. `deploy-shop-site` has no runnable script. | `sites/bitcoin-manor/package.json`; `deploy-shop-site/SKILL.md:20-23` | Actually perform a standalone-repo launch once; convert the runbook into a script. |
| A3 | HIGH | Contact form built on a deploy-incompatible path. `data-netlify="true"` form, but Netlify Forms only register on Git/CLI builds — the live site is a digest-upload deploy where detection does **not** run → silent lead-loss risk. Later maw/alcurio run switched to Web3Forms, confirming the incompatibility. | `sites/bitcoin-manor/src/pages/index.astro:357`; `deploy-shop-site/SKILL.md:47,68` | Bake one deploy-agnostic form path (Web3Forms) into the engine; re-verify the live form actually POSTs. |
| A4 | HIGH | Account-ownership transfer never completed. Netlify + Storyblok still under `aidan.c.moisan@gmail.com`; domain `bitcoinmanor.com` not pointed; Gate-2 sign-off unchecked. "Walk-away, client owns everything" unrealized. | bitcoin-manor handoff §1,§4,§9; `intake.md:39` owner email `[UNKNOWN]` | Complete + verify transfer; add a transfer-confirmation step the pipeline can check. |

### Audit artifact / verifiability

| # | Sev | Issue | Location | Fix |
|---|-----|-------|----------|-----|
| Q1 | HIGH | "Collector's 38 tests stay green" is **FALSE** — suite is 37 passed / 1 FAILED. Failing test guards report self-containment; `report.ts` added an external Google Fonts `<link rel=stylesheet>` — degrades the branded report in email clients (the channel it's used in). **[Re-verified by hand.]** | `packages/audit/src/report.test.ts:54`; `packages/audit/src/report.ts:354`; asserted green at `roadmap.md:105`, `decisions.md:11` | Inline/embed the font or self-host; re-run suite; correct both docs. |
| G2 | HIGH (a11y) | Engine cannot substantiate "WCAG AA / mobile-first." Zero ARIA/role/skip-link/sr-only across `packages/shared/src/components`; `SiteNav` hides all section links below `sm:` with **no hamburger fallback**. | `packages/shared/src/components/SiteNav.astro:20` (+ library-wide) | Add a mobile disclosure nav, skip-link, aria-labels; or soften the WCAG AA claim. |

### Pricing coherence (blocks unattended runs)

| # | Sev | Issue | Location | Fix |
|---|-----|-------|----------|-----|
| P1 | HIGH | Audit pipeline points at deleted pricing structure. `site-audit` instructs "Map tier → Starter/Growth/Pro using packaging.md," but `packaging.md` retired tiers for a single $1,500 flat fee. Autonomous Audit runs emit scoping notes citing tiers that no longer exist. | `.claude/skills/site-audit/SKILL.md:43,48` vs `packaging.md:11-20` | Rewrite the site-audit scoping step to the flat-fee + add-on model. |
| P2 | HIGH | The pricing authority doc contradicts itself within 6 lines, same date: "Kept 3 tiers" directly above "One flat fee — no tiers ($1,500)." | `docs/gtm/packaging.md:7` vs `:11-20` | Delete the stale 3-tier rationale block. |
| P3 | HIGH | Two same-day research docs reach **opposite verdicts** with no superseded marker: `single-fee-vs-tiers.md` ("drop tiers") vs `pricing-strategy.md` ("Keep 3 tiers $1,800/$3,500/$6,000"). | `docs/research/2026-06-17-single-fee-vs-tiers.md:5` vs `pricing-strategy.md:5` | Mark the loser superseded; log the decision in `decisions.md` (currently unrecorded). |

### Engine-reuse thesis

| # | Sev | Issue | Location | Fix |
|---|-----|-------|----------|-----|
| E1 | HIGH | The marquee real client is ~416 lines, **7 of 8 sections hand-built bespoke**; only 4 trivial shared components reused. The rich design lives in per-client markup, not the engine — undercutting "new shop = theme.css + content," the margin thesis. | `sites/bitcoin-manor/src/pages/index.astro` | Harvest the bespoke hero/showcase/grid patterns into shared as parameterized components. |
| E2 | HIGH | The 60-template "design-harvesting library" produced **zero harvest** — provable by timestamp: shared components frozen `2026-06-15 15:56`, tmpls first committed `17:08`. | `packages/shared/src/components` (frozen); `docs/roadmap.md:110` | Either run the harvest or retire the claim. |

---

## 3. MISSING COMPONENTS (deduped, ranked by severity × low effort)

**→ HIGHEST-LEVERAGE NEXT BUILD: a per-client SEO baseline folded into `packages/shared`** (canonical, sitemap.xml, robots.txt, absolute OG/Twitter tags). Blocker severity, medium effort, and it's the single thing that most directly contradicts the product's own sales pitch: the agency sells "we fix your SEO," yet the first real client ships **no sitemap, no robots, no canonical, and a broken relative `og:image`**. The full implementation already exists in `sites/landing` (`@astrojs/sitemap` + `Head.astro`) — a *fold-into-engine*, not a from-scratch build.

### Blockers
| Component | Effort | Lens | Note |
|---|---|---|---|
| Per-client SEO baseline in engine | medium | technical | Fix exists in landing; fold in + fix `og:image` to absolute URL. |
| Deploy-agnostic, browser-verified contact-form path in engine | small | technical/agency | = A3. Pick Web3Forms, bake once, test. |
| Invoicing & payment collection (no Stripe/invoice anywhere) | medium | agency | Bitcoin Manor shipped with **zero** payment step. |
| Proposal → contract → e-signature gate before autonomous build | medium | agency | No signed scope gates Deliver mode; liability uncapped. |
| CRM / lead lifecycle system of record | medium | agency/GTM | Status is notional spreadsheet text; no sheet/DB. #1 *scale* blocker. |
| Real social proof (remove fabricated testimonials) | small | GTM | = T1. |
| Outbound volume tooling + actual sent batch + CASL-compliant footer | medium | GTM | Phase-4 "send first batch" unmet. |
| Close + validate first real client end-to-end (payment, transfer, domain) | medium | GTM | Keystone proof rests on an unclosed deal. |

### High
| Component | Effort | Lens |
|---|---|---|
| Multi-client / concurrent project board | small | agency |
| Account-transfer verification mechanism (= A4) | small | agency |
| CI pipeline (build + JSON-LD/click-to-call/SEO assertions) | medium | technical |
| Analytics on landing **and** per-client site | small | technical/GTM |
| Performance budget / Lighthouse-CI (CWV promised, never measured per deploy) | medium | technical |
| Verified deploy + auto-rebuild loop + DNS/SSL/301 automation (= A1) | medium | technical |
| Visual-regression/render test suite (green build ≠ correct render) | large | technical |
| Follow-up / nurture sequencing | medium | agency |
| Real case-study / portfolio of a shipped client | medium | GTM |

### Medium / nice-to-have (condensed)
Robust image pipeline (`astro:assets`/srcset — none used; hurts the LCP they sell); form spam protection (Cloudflare Turnstile, free); error/uptime monitoring; automated a11y (axe/pa11y); GBP/Search Console handoff wiring; canonical quote source of truth; missing intake template; discovery-call scheduling link; refund/dispute process; referral mechanism; client status-update comms; Storyblok content backup/export.

---

## 4. CONTRADICTIONS (cross-cutting)

1. **Three live prices simultaneously.** Live `origin/main` + `roadmap.md` + `decisions.md` say **tiered $1,800/$3,500/$6,000**; `roadmap.md:18` says **~$3k–$8k**; `packaging.md`/`create-shop-site`/uncommitted landing say **$1,500 flat**. `CLAUDE.md` itself is model-agnostic ("one-time fee") and carries no stale numbers. The $1,500 decision is **unrecorded in `decisions.md`**.
2. **"Delivered end-to-end" vs handoff reality.** Marketing/memory say Bitcoin Manor is delivered; the handoff says pre-built deploy, accounts under operator, auto-rebuild unwired, Gate-2 unsigned, form inbox unset.
3. **Doc-vs-code drift on the flagship.** Intake/spec describe CSS-only hero + Web3Forms; shipped site uses real photos + Netlify Forms. Three handoff files disagree; none marked canonical.
4. **"Field-by-field override only when present" vs code.** `storyblok-shop-cms` claims override-only-if-empty; all 5 demos assign flat fields **unconditionally** (`name: c.name`), so a blanked field renders `undefined` into `<title>` and drops `name` from JSON-LD. (Array-section contract IS honored; real client uses `|| fallback` correctly — demos are the copy-template that propagates the anti-pattern.)
5. **"Components use ONLY semantic tokens" vs Hero.** `Hero.astro:9-12` hardcodes `from-black/45 … text-white` (defensible as a scrim, but it is the rule the engine is sold on).
6. **Token contract vs code.** `CLAUDE.md` token list omits `--card` (consumed by Features/Testimonials with no fallback → transparent cards if a theme omits it; `demo-cafe` omits it — latent). `--accent-foreground` is mapped but consumed by zero components (dead).
7. **Free-tier ownership story vs reality.** Skill says "Starter free = 1 space," yet operator runs a shared demo space **plus** a dedicated client space under one account — the free cap can't hold both.
8. **Skill self-contradiction.** `client-pipeline` lists the publish-webhook as a routine Deliver step; its own `deploy-shop-site` says that loop is "still not executed end-to-end." It also cites intake template `docs/onboarding/client-intake.md` that **does not exist**.

---

## 5. ONE-BY-ONE VERIFICATION CHECKLIST (ordered by risk)

1. **Landing testimonials** — Before any merge/deploy of `feat/bitcoin-manor`: confirm `Testimonials.astro` filters `placeholder:true`. If "Sample Café" appears, **do not deploy.** (`site.ts:156`, `Testimonials.astro`, `index.astro:53`) ✅ *confirmed unfiltered*
2. **Live Bitcoin Manor contact form** — Submit a real test on the live site; confirm capture + email. If 404/no capture, "verified end-to-end" is false. (`index.astro:357`)
3. **Auto-rebuild loop** — Edit a field in the Bitcoin Manor Storyblok story, Publish, reload the live URL. If nothing changes, the headline promise is unwired (expected, per handoff §5).
4. **Account ownership** — Log into Netlify + Storyblok; confirm which email owns them. Today: operator's. (handoff §1)
5. **Audit test suite** — `pnpm --filter @studio0rbit/audit test`. Expect **37/38, 1 fail** (`report.test.ts:54`). ✅ *confirmed*
6. **Pricing single-source** — Open `packaging.md`, `roadmap.md`, `decisions.md`, `site-audit/SKILL.md`, live site. Pick one truth, sweep all five, log it in `decisions.md`.
7. **site-audit scoping output** — Run an audit; if the scoping note names "Starter/Growth/Pro," it's quoting a deleted structure. (`SKILL.md:43`)
8. **Hero alt text / fabricated geography** — Grep `Calgary` in `sites/bitcoin-manor`. The single hit at `index.astro:210` is invented.
9. **CMS flat-field fallback** — In any demo `index.astro`, confirm flat fields assign `c.name` (not `c.name || fallback`). Blank that field in Storyblok, build, check `<title>` and JSON-LD.
10. **Token completeness** — Confirm every `theme.css` defines `--card`. `demo-cafe` does not. Add `--card` to the CLAUDE.md contract.
11. **Mobile nav / a11y** — Open any site at <640px; confirm section links vanish with no hamburger. Grep for `aria`/`role`/`sr-only` — expect zero.
12. **Per-client SEO** — In built Bitcoin Manor HTML, confirm absence of canonical, sitemap.xml, robots.txt, twitter:card, and relative `og:image`. Compare to `sites/landing/src/components/Head.astro`.
13. **Standalone-repo / mini-workspace** — Confirm Bitcoin Manor exists only in the monorepo on `feat/bitcoin-manor` with `workspace:*`. The documented recipe is untested.
14. **Handoff canonicality** — Open all three `bitcoin-manor-handoff.{txt,md,html}`; confirm they disagree and none is marked canonical. The `.txt` still has the forbidden "38.8s" framing.
15. **Intake template** — `ls docs/onboarding/`; confirm `client-intake.md` (cited by `client-pipeline/SKILL.md:47`) is absent.
16. **CMS schema provenance** — Grep for `hardware_name`, `pow_quote`, `collections`, `readout`. They appear only in `bitcoin-manor/index.astro` — the live content model is in **no** committed script; if the space is lost, the schema is unrecoverable.
17. **Design harvest claim** — Confirm last `packages/shared/src/components` commit predates the first tmpl commit; grep log for "harvest/promote/extract → shared" (none).
18. **Operations gaps (existence checks)** — Confirm there is no CRM/sheet, no invoicing/Stripe, no signed-contract gate, no `.github/workflows`, no analytics in any `sites/*/src`, no Lighthouse/perf config.
