---
name: client-pipeline
description: Use to run a Studio0rbit client end-to-end with the operator doing outreach + final validation only. Covers both modes — AUDIT a prospect (outreach hook → branded report) and DELIVER a converted client (intake → build → CMS → deploy → handoff). Triggers on "run the pipeline for X", "audit this prospect", "deliver this client", "take this client to handoff", "run the autonomous build". The orchestrator that ties the six building-block skills together.
---

# Client Pipeline (autonomous orchestrator)

This is the **source of truth** for an autonomous Studio0rbit run. It owns the end-to-end flow and the autonomy contract; it **delegates** every mechanic to a building-block skill — it never restates how to scaffold, theme, wire Storyblok, or deploy.

## When to use / triggers
- "run the pipeline for X", "run the autonomous build"
- "audit this prospect", "scope this prospect for outreach" → **Audit mode**
- "deliver this client", "take this client to handoff", "build and launch X" → **Deliver mode**

## Read first
`CLAUDE.md` (esp. the "Autonomous delivery model" + design-quality bar), then the building-block skills you'll delegate to: `site-audit`, `triage-prospects`, `create-shop-site`, `shop-templates`, `storyblok-shop-cms`, `deploy-shop-site`. Use `frontend-design` for the look and `playwright` to screenshot-verify.

## The pipeline model + operator boundary

```
OUTREACH (operator)          AUTONOMOUS (agent — you)              VALIDATE (operator)
─────────────────            ────────────────────────             ───────────────────
find prospect ─▶ [AUDIT mode] ─▶ branded audit + cover note ─▶ GATE 1 ─▶ operator sends audit
                                                                              │
                                                               prospect converts
                                                                              │
client says yes ─▶ [DELIVER mode] ─▶ live site(s) + handoff ─▶ GATE 2 ─▶ operator forwards links
```

- **The operator does outreach + validation ONLY.** You run everything between the gates.
- **No mid-build review gates.** Never ask the operator to approve specs, designs, or plans. Use sensible agency defaults and **document decisions** (in the intake, spec, and handoff).
- **Two operator-validation gates** (both are the operator "validating the output state"): Gate 1 = audit before it reaches a prospect; Gate 2 = live site before links reach a client. Stop *at* the gate and hand back a validatable package — never auto-finalize past it.

## Mode decision
Decide Audit vs Deliver from the kickoff input. If it's unclear (e.g. a bare URL with no "they said yes"), **ask once** which mode, then run to completion.

## Audit-mode runbook (outreach)
1. Single prospect → go straight to `site-audit`. A **batch/CSV** → run `triage-prospects` first to build the ranked queue, then an Audit run per prospect.
2. Delegate to **`site-audit`**: it emits `packages/audit/audit-<host>.html` (the **client-facing** sendable 1-page report), `audit-<host>.json` (data), screenshots, and an **internal scoping note** (template + content plan + gap list + package/price).
3. **Gate 1 package:** hand the operator the `audit-<host>.html` path + a short forwardable cover note (plain-spoken, per `docs/gtm/outreach.md`). **Stop here.** No intake, no build.
4. **Retain the internal scoping note + JSON.** If the prospect later converts, these *seed the Deliver spec* — do not re-run the audit.

## Deliver-mode runbook (post-conversion)
Each step names the **owning skill** — follow that skill for the mechanics. Do not duplicate them here.

1. **Audit / seed.** Existing site and no prior audit? Run `site-audit` to inform the build. Prior audit exists? Seed from its scoping note + JSON. Greenfield? Skip.
2. **Intake.** Fill `docs/onboarding/<slug>-intake.md` from the kickoff input + any prior audit (pre-fill everything derivable; mark gaps). If any `[BLOCKER]` field is missing (owner email, public email, form-destination inbox, domain ownership, privacy-note decision), **batch them into ONE message to the operator**, then continue. (Template: `docs/onboarding/client-intake.md`.)
3. **Spec.** Write a design spec to `docs/superpowers/specs/YYYY-MM-DD-<slug>-design.md`. **Do NOT wait for review.**
4. **Build.** Per **`create-shop-site`** (+ `shop-templates` for section/vertical patterns, `frontend-design` for the look): scaffold `sites/<slug>`, author a per-client OKLCH `theme.css`, write content, compose shared sections in `index.astro`. **Semantic token utilities only** — never hardcoded colors. Add an `@source` for any new shared component dir.
5. **CMS.** Per **`storyblok-shop-cms`**: one Storyblok account; a **separate space per distinct client site**; every text/image field client-editable; the build must survive Storyblok being down (local fallbacks, field-by-field override).
6. **Verify.** Build + **screenshot-verify** at mobile + desktop with `playwright`. Iterate until it clears the `CLAUDE.md` design-quality bar (no AI slop). Confirm correct JSON-LD for the vertical and click-to-call/forms render in the HTML.
7. **Deploy.** Per **`deploy-shop-site`**: standalone repo + host build hook + Storyblok publish webhook. **All accounts under the client owner email** so the client owns everything.
8. **Handoff.** Write `docs/handoff/<slug>-handoff.md` from `docs/handoff/_handoff-template.md`: every account + how the client takes ownership (reset/invite to their email — **never plaintext passwords**), all live URLs + edit links, how to edit/publish in Storyblok, how to swap placeholders.
9. **Commit** on a `feat/<slug>` branch.
10. **Gate 2.** Produce one forwardable handoff message (live URLs, edit links, ownership steps) + run the Delivery section of `docs/onboarding/operator-validation-checklist.md`. **Stop here** for the operator to validate and forward.

## Autonomy contract + interrupt rules
- Never ask the operator to approve specs/designs/plans — document decisions instead.
- **Interrupt the operator ONLY for:** a missing `[BLOCKER]` intake field, or an irreversible external action needing their credentials/money/auth (real domain purchase, paid-plan upgrade, an unauthenticated required CLI/API). Batch all such asks into **one** message; otherwise run to completion. If a required CLI/API isn't authenticated here, do everything you can, then list the exact manual auth steps in the handoff.
- Use **placeholders** for missing assets; make them swappable in Storyblok.

## Decision log
Record agency defaults (palette/mood, template direction, copy choices, package/price) in the intake, spec, and handoff — so the operator can see *what* was decided without having been asked to approve it.

## Final output of a run
- **Audit mode:** the `audit-<host>.html` path + forwardable cover note (Gate 1).
- **Deliver mode:** one forwardable handoff message + the path to `docs/handoff/<slug>-handoff.md` (Gate 2).

## Proven flow + conventions (reference)
- **First real end-to-end run: Bitcoin Manor (2026-06-17)** — audit → fast static brand site (reusing the client's own product imagery) → Storyblok (dedicated space `293262123963428`) → Netlify (live, contact form verified) → handoff. Live: `bitcoin-manor-yyc.netlify.app`. Artifacts: `docs/onboarding/bitcoin-manor-intake.md`, `docs/superpowers/specs/2026-06-17-bitcoin-manor-design.md`, `docs/handoff/bitcoin-manor-handoff.{md,html}`.
- **Deliverables are styled HTML, not just markdown.** Both the audit (`packages/audit/audit-<host>.html`) and the handoff (`docs/handoff/<slug>-handoff.html`) are **receipt-styled, Studio0rbit-branded** pages that open cleanly in a browser and forward as-is. Keep a markdown twin for editing; produce the HTML for the client.
  - Audit HTML ← generated by `packages/audit/src/report.ts`.
  - Handoff HTML ← **generated** by `node scripts/render-handoff.mjs docs/handoff/<slug>.handoff.json`. Author the data JSON (copy `docs/handoff/_handoff.example.json`; real one: `docs/handoff/bitcoin-manor.handoff.json`); the script writes `docs/handoff/<slug>-handoff.html`. Inline text supports `**bold**`, `[label](url)`, `` `code` ``.
- **Grab content from the prospect's existing site** instead of placeholders — real images (→ WebP via `sharp`) and copy. See `site-audit` → "Reuse the prospect's existing content & images".
- **Honesty on speed:** quote PageSpeed score + static-vs-legacy architecture, **never** a lab LCP as a felt "Xs → Ys" load time (no CrUX = no real-user data). Matches the audit report's own lab-data footnote.
