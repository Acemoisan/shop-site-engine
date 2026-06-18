# Design — Codify the autonomous client pipeline (`client-pipeline`)

**Date:** 2026-06-17
**Status:** Approved (brainstorm), pending spec review
**Branch:** feat/maw-alcurio-sites

## Problem

Studio0rbit is committing to a **fully autonomous AI delivery pipeline**: the operator does **outreach + final validation only**; the agent runs everything in between. Today that flow exists only as a paste-in prompt (`docs/onboarding/autonomous-build-prompt.md`) — not discoverable, not grounded in the real skills, and prone to drift. The six building-block skills exist (`create-shop-site`, `deploy-shop-site`, `site-audit`, `triage-prospects`, `storyblok-shop-cms`, `shop-templates`) but nothing **orchestrates** them end-to-end, and `CLAUDE.md` never states the operator-role boundary or the autonomy contract.

This work codifies the pipeline as a first-class, maintained capability so the operator can "outreach, and validate the output state" while the agent owns the rest.

## Goals

- A single discoverable **orchestrator skill** that owns the end-to-end flow and the autonomy contract, delegating to (never duplicating) the six existing skills.
- Encode the **two-mode fork**: Audit (outreach) vs Deliver (build), with the right terminal state for each.
- Encode the **operator role boundary**: outreach + validation only; no mid-build review gates; exactly two operator-validation gates (audit-before-send, site-before-handoff).
- Templates and a checklist so every run produces a forwardable output the operator validates.
- `CLAUDE.md` documents the model and points at the skill.

## Non-goals

- Running maw/alcurio to completion (handled in a separate session).
- Changing the build/deploy/CMS mechanics themselves — those skills stay as-is.
- Automating the operator's outreach (sending emails, scraping) — out of scope; operator-owned.
- Removing the paste-in kickoff convenience — it stays, but becomes a thin pointer to the skill.

## The pipeline model

```
OUTREACH (operator)                AUTONOMOUS (agent)                    VALIDATE (operator)
─────────────────                  ──────────────────                    ───────────────────
find prospect ──▶ [client-pipeline: AUDIT mode] ─▶ branded audit + note ─▶ GATE 1 ─▶ operator sends audit
                                                                                         │
                                                                          prospect converts
                                                                                         │
client says yes ─▶ [client-pipeline: DELIVER mode] ─▶ live site(s)+handoff ─▶ GATE 2 ─▶ operator forwards links
```

- **Two modes, one skill.** `client-pipeline` decides Audit vs Deliver from the kickoff input; if ambiguous, it asks once. (Bulk prospect lists are handled upstream by `triage-prospects` → then an Audit run per prospect; a single Audit run takes one prospect URL.)
- **Audit run (outreach):** prospect URL → `site-audit` → it emits `packages/audit/audit-<host>.html` (the **client-facing** sendable 1-page report) plus an **internal scoping note** (template + content plan + gap list + package/price). The Gate-1 package handed to the operator = the HTML report path + a short forwardable cover note. **Stop at Gate 1.** No intake, no build. The internal scoping note is retained; if the prospect later converts it **seeds the Deliver spec** (no re-audit).
- **Deliver run (post-conversion):** intake → spec → build → Storyblok → screenshot-verify → deploy → handoff → commit → **stop at Gate 2**.
- **No mid-build review gates.** The agent never asks the operator to approve specs/designs/plans. It documents decisions instead.
- **Two operator-validation gates** (both are "validate the output state"): Gate 1 = audit before it reaches a prospect; Gate 2 = live site before links reach a client.
- **Interrupt rules** (the only times the agent stops to ask): a missing `[BLOCKER]` intake field, or an irreversible external action requiring the operator's credentials/money/auth (real domain purchase, paid-plan upgrade, an unauthenticated required CLI/API). Batch all such asks into one message; otherwise run to completion.

## Components

### 1. `.claude/skills/client-pipeline/SKILL.md` (new — orchestrator)
The source of truth for an autonomous run. Sections:
- **When to use / triggers:** "run the pipeline for X", "audit this prospect", "deliver this client", "take this client to handoff", "run the autonomous build".
- **Read-first list:** `CLAUDE.md` + the six skills + `frontend-design` + `playwright`.
- **Mode decision:** Audit vs Deliver (decide from input; ask once if unclear).
- **Audit-mode runbook:** delegate to `site-audit` (single prospect; `triage-prospects` first for a batch); hand back the `audit-<host>.html` path + a short forwardable cover note; retain the internal scoping note for a possible Deliver run; stop at Gate 1.
- **Deliver-mode runbook:** the 9 steps, each step a short instruction that **points at the owning skill** (e.g. "scaffold + theme + content + compose → `create-shop-site`"). No mechanics duplicated.
- **Autonomy contract + interrupt rules** (verbatim discipline).
- **Operator-validation gates:** what the run hands back and where it stops.
- **Decision log expectation:** agency defaults are recorded in the intake/spec/handoff, not asked.

The skill **delegates**; it must not restate how to scaffold, theme, wire Storyblok, or deploy — it links to those skills so there is one source of truth per concern.

### 2. `docs/handoff/_handoff-template.md` (new) + `docs/handoff/` dir
Structure for `docs/handoff/<slug>-handoff.md`:
- Accounts table (service, account, who owns, how the client takes ownership — reset/invite to owner email, **never plaintext passwords**).
- Live URLs + admin/edit links (site, Storyblok edit, host dashboard, form service).
- How to edit & publish in Storyblok (client-facing, plain language).
- Placeholder-swap guide (logo / key art / trailer / domain / platform links).
- **Operator sign-off block** (Gate 2 checklist outcome + who validated + date).

### 3. `docs/onboarding/operator-validation-checklist.md` (new)
The "validate the output state" gate, two sections:
- **Audit (Gate 1):** audit renders, claims accurate/fair, branding correct, forwardable note reads well, no internal notes leaking.
- **Delivery (Gate 2):** site loads at live URL; mobile + desktop pass the design bar; forms deliver to the right inbox; JSON-LD present for the vertical; click-to-call works; no placeholder text/art leaking unintentionally; all accounts under the owner email; handoff doc complete.

### 4. `docs/onboarding/autonomous-build-prompt.md` (edit — slim to pointer)
Reduce to: "This run is governed by the `client-pipeline` skill — invoke it" + keep the paste-in INPUT block for convenience. Remove duplicated step detail so it can't drift from the skill.

### 5. `CLAUDE.md` (edit)
- New section **"Autonomous delivery model"**: operator = outreach + validation only; agent runs the full pipeline; the two-mode fork; no mid-build gates; the two validation gates; interrupt rules; pointer to `client-pipeline`.
- Add `client-pipeline` to the existing-skills bullet list, described as the orchestrator that ties the others together.

### 6. Memory (edit)
Update `automation-first-delivery.md` to name `client-pipeline` as the orchestrator source of truth (kickoff prompt is now a thin pointer). Link `[[calgary-shop-website-service]]`.

## Interfaces / boundaries

- **Orchestrator → building-block skills:** the orchestrator only *names the step and the owning skill*; the building-block skill owns the mechanics. Changing how we deploy means editing `deploy-shop-site`, not the orchestrator.
- **Audit → Deliver handoff:** a converted prospect's internal scoping note (from the Audit run) plus the emitted `packages/audit/audit-<host>.json`/`.html` seed the Deliver spec. The orchestrator references them; it does not re-run the audit.
- **Agent → operator:** the only outputs that cross to the operator are (a) batched blocker questions, (b) the Gate-1 audit package, (c) the Gate-2 handoff package. Everything else is internal/documented.

## Testing / verification

This is a docs+skill capability, so verification is structural, not a test suite:
- Skill frontmatter valid; description triggers on the intended phrases (sanity-check against `writing-skills`).
- Orchestrator contains **no duplicated mechanics** — every step links to an owning skill (grep for the six skill names; each delivery step references one).
- `CLAUDE.md` skills list and the new section reference `client-pipeline` and are internally consistent with the skill.
- Templates have no unfilled `TBD`/placeholder leakage in their *instructions* (the `____` fill-ins in templates are intentional).
- Dry-run readability pass: read the skill as if kicking off a real run; confirm a fresh agent could execute Audit mode and Deliver mode to their gates without the paste-in prompt.

## Risks

- **Drift** between orchestrator and building-block skills → mitigated by the delegate-don't-duplicate rule and the grep check.
- **Over-asking** by a future agent → mitigated by explicit interrupt rules + "document decisions, don't ask."
- **Operator skips a gate** → mitigated by the orchestrator stopping *at* the gate and handing back a checklist, not auto-finalizing.
```