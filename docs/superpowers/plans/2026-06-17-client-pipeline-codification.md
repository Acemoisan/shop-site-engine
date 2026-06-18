# Client Pipeline Codification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Codify Studio0rbit's autonomous client pipeline as a first-class, maintained capability — a `client-pipeline` orchestrator skill plus supporting templates, checklist, and CLAUDE.md updates — so the operator does only outreach + final validation while the agent runs everything between.

**Architecture:** One orchestrator skill owns the end-to-end flow and the autonomy contract, with a two-mode fork (Audit/outreach vs Deliver/build) and two operator-validation gates. It *delegates* to the six existing building-block skills (never duplicating their mechanics). Templates and a checklist make every run hand back a forwardable, validatable output.

**Tech Stack:** Markdown skills (`.claude/skills/<name>/SKILL.md`), Markdown docs, the existing pnpm/Astro shop-site engine (referenced, not modified).

## Global Constraints

- Operator role boundary: **outreach + validation only**; agent runs the full pipeline between gates.
- **No mid-build review gates.** Agent documents decisions; never asks the operator to approve specs/designs/plans.
- Exactly **two operator-validation gates**: Gate 1 = audit before it reaches a prospect; Gate 2 = live site before links reach a client.
- **Interrupt rules** (only times the agent stops to ask): missing `[BLOCKER]` intake field, or irreversible money/credential/auth action. Batch into one message.
- **Delegate, don't duplicate:** the orchestrator names each step + its owning skill; mechanics live in the building-block skill (one source of truth per concern).
- Site-audit artifacts live in `packages/audit/` (`audit-<host>.html` = client-facing; internal scoping note seeds a later Deliver run).
- Account-ownership rule: all client accounts under the owner email; **never plaintext passwords** (reset/invite to owner email).
- Existing skill naming convention: lowercase verb/noun-kebab (`create-shop-site`).

---

### Task 1: Create the `client-pipeline` orchestrator skill

**Files:**
- Create: `.claude/skills/client-pipeline/SKILL.md`

**Interfaces:**
- Consumes: the six existing skills (`create-shop-site`, `deploy-shop-site`, `site-audit`, `triage-prospects`, `storyblok-shop-cms`, `shop-templates`), `frontend-design`, `playwright`.
- Produces: a discoverable skill whose triggers include "run the pipeline", "audit this prospect", "deliver this client", "take this client to handoff", "run the autonomous build". Referenced by name from CLAUDE.md, the slimmed kickoff prompt, and memory.

- [ ] **Step 1: Write the SKILL.md** with frontmatter (`name: client-pipeline`, description covering both audit + deliver triggers) and these sections, in order:
  - **When to use / triggers.**
  - **Read first:** `CLAUDE.md` + the six skills + `frontend-design` + `playwright`.
  - **The pipeline model + operator boundary** (outreach + validation only; no mid-build gates; the two gates).
  - **Mode decision:** Audit vs Deliver — decide from kickoff input; ask once if unclear.
  - **Audit-mode runbook:** single prospect (batch → `triage-prospects` first) → `site-audit` → hand back `packages/audit/audit-<host>.html` path + short forwardable cover note → retain internal scoping note → **stop at Gate 1**.
  - **Deliver-mode runbook:** the 9 steps, each one line naming the owning skill — (1) audit-if-existing/seed-from-prior-audit → `site-audit`; (2) fill `docs/onboarding/<slug>-intake.md` (batch blocker asks once); (3) write spec to `docs/superpowers/specs/YYYY-MM-DD-<slug>-design.md`, no review; (4) build → `create-shop-site` + `shop-templates` + `frontend-design`; (5) CMS → `storyblok-shop-cms` (separate space per client, all fields editable, build survives Storyblok down); (6) screenshot-verify mobile+desktop → `playwright`, clear the CLAUDE.md design bar, confirm JSON-LD + forms in HTML; (7) deploy → `deploy-shop-site` (standalone repo + build hook + publish webhook, all accounts under owner email); (8) write `docs/handoff/<slug>-handoff.md` from the template; (9) commit on `feat/<slug>` → **stop at Gate 2**.
  - **Autonomy contract + interrupt rules** (verbatim from Global Constraints).
  - **Operator-validation gates:** what each gate hands back and that the run stops there; point to `docs/onboarding/operator-validation-checklist.md`.
  - **Decision-log expectation:** agency defaults recorded in intake/spec/handoff, not asked.

- [ ] **Step 2: Verify no duplicated mechanics.** Confirm each Deliver step references an owning skill rather than restating how-to.
Run: `grep -nE 'create-shop-site|deploy-shop-site|site-audit|triage-prospects|storyblok-shop-cms|shop-templates' .claude/skills/client-pipeline/SKILL.md`
Expected: each of the build/deploy/CMS/audit steps matches at least one skill name; no step contains scaffolding/theme/deploy command detail copied from those skills.

- [ ] **Step 3: Verify frontmatter + triggers.**
Run: `sed -n '1,5p' .claude/skills/client-pipeline/SKILL.md`
Expected: valid `--- name: client-pipeline / description: ... ---` block; description mentions both audit and deliver.

---

### Task 2: Create the handoff template + `docs/handoff/` directory

**Files:**
- Create: `docs/handoff/_handoff-template.md`

**Interfaces:**
- Consumes: nothing.
- Produces: the structure every `docs/handoff/<slug>-handoff.md` follows; referenced by client-pipeline Deliver step 8.

- [ ] **Step 1: Write `_handoff-template.md`** with these sections: title + one-line summary; **Accounts table** (service | account/login | owner | how the client takes ownership — reset/invite to owner email, never plaintext passwords); **Live URLs + edit links** (site, Storyblok edit, host dashboard, form service); **How to edit & publish in Storyblok** (plain client language); **Placeholder-swap guide** (logo / key art / trailer / domain / platform links); **Operator sign-off** block (Gate-2 checklist outcome + validator + date). Use `____`/`<slug>` fill-ins where per-client values go.

- [ ] **Step 2: Verify the directory + file exist and the ownership rule is present.**
Run: `ls docs/handoff/ && grep -n 'never plaintext\|owner email\|Operator sign-off' docs/handoff/_handoff-template.md`
Expected: file listed; all three matches present.

---

### Task 3: Create the operator-validation checklist

**Files:**
- Create: `docs/onboarding/operator-validation-checklist.md`

**Interfaces:**
- Consumes: nothing.
- Produces: the Gate-1/Gate-2 checklist referenced by `client-pipeline` and `_handoff-template.md`.

- [ ] **Step 1: Write the checklist** with two sections:
  - **Gate 1 — Audit (before sending to a prospect):** audit HTML renders/opens; data claims trace to AuditData; CWV framed as indicative (not "Google's verdict"); branding correct; forwardable cover note reads well; no internal scoping notes leaking.
  - **Gate 2 — Delivery (before forwarding live links to a client):** site loads at live URL; mobile + desktop clear the design bar; contact form delivers to the right inbox; correct JSON-LD for the vertical present in HTML; click-to-call works; no unintended placeholder text/art leaking; all accounts under owner email; handoff doc complete.

- [ ] **Step 2: Verify both gates present.**
Run: `grep -n 'Gate 1\|Gate 2' docs/onboarding/operator-validation-checklist.md`
Expected: both headings present.

---

### Task 4: Slim the kickoff prompt to a pointer

**Files:**
- Modify: `docs/onboarding/autonomous-build-prompt.md`

**Interfaces:**
- Consumes: the `client-pipeline` skill (Task 1).
- Produces: a thin entry point that defers to the skill + keeps the paste-in INPUT block.

- [ ] **Step 1: Replace the duplicated 9-step body** with: a one-paragraph note that the run is governed by the `client-pipeline` skill (invoke it; it covers Audit and Deliver modes, the autonomy contract, and the two gates), then keep the existing `### INPUT FOR THIS RUN` block verbatim. Remove the inline step list and constraints so they can't drift from the skill.

- [ ] **Step 2: Verify it points at the skill and kept the input block.**
Run: `grep -n 'client-pipeline\|INPUT FOR THIS RUN' docs/onboarding/autonomous-build-prompt.md`
Expected: both matches present; file is materially shorter (no 9-step duplication).

---

### Task 5: Document the autonomous delivery model in CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: the `client-pipeline` skill.
- Produces: an "Autonomous delivery model" section + `client-pipeline` added to the existing-skills bullet list.

- [ ] **Step 1: Add an "Autonomous delivery model" section** (near the top, after "What this repo is"): operator = outreach + validation only; agent runs the full pipeline; the two-mode fork (Audit/Deliver); no mid-build review gates; the two validation gates; interrupt rules; pointer to the `client-pipeline` skill as the orchestrator.

- [ ] **Step 2: Add `client-pipeline` to the existing-skills bullet list** under "AI-heavy architecture", described as the orchestrator that ties the other six together (Audit + Deliver modes).

- [ ] **Step 3: Verify consistency.**
Run: `grep -n 'client-pipeline\|Autonomous delivery model\|outreach + validation\|outreach \+ validation' CLAUDE.md`
Expected: section heading, skill bullet, and operator-boundary phrasing all present.

---

### Task 6: Update memory + commit

**Files:**
- Modify: `C:\Users\aidan\.claude\projects\C--Users-aidan-Space-Studio0rbit-Websites\memory\automation-first-delivery.md`
- Modify: `C:\Users\aidan\.claude\projects\C--Users-aidan-Space-Studio0rbit-Websites\memory\MEMORY.md` (only if the pointer line needs updating)

**Interfaces:**
- Consumes: all prior tasks.
- Produces: memory naming `client-pipeline` as the orchestrator source of truth.

- [ ] **Step 1: Update `automation-first-delivery.md`** to name `.claude/skills/client-pipeline` as the orchestrator/source of truth (the kickoff prompt is now a thin pointer), keep the operator-boundary fact, and link `[[calgary-shop-website-service]]`.

- [ ] **Step 2: Commit the codification** on the current `feat/maw-alcurio-sites` branch, staging ONLY the pipeline-codification files (skill, two templates/dir, slimmed prompt, CLAUDE.md, spec, plan) — not the unrelated maw/alcurio or other in-flight changes.
Run:
```bash
git add .claude/skills/client-pipeline docs/handoff docs/onboarding/operator-validation-checklist.md docs/onboarding/autonomous-build-prompt.md CLAUDE.md docs/superpowers/specs/2026-06-17-client-pipeline-codification-design.md docs/superpowers/plans/2026-06-17-client-pipeline-codification.md
git commit -m "feat(pipeline): codify autonomous client-pipeline orchestrator skill + docs"
```
Expected: commit succeeds with only the intended files staged.

---

## Self-Review

**1. Spec coverage:**
- Orchestrator skill (spec §Components.1) → Task 1. ✓
- Handoff template + dir (§Components.2) → Task 2. ✓
- Operator-validation checklist (§Components.3) → Task 3. ✓
- Slim kickoff prompt (§Components.4) → Task 4. ✓
- CLAUDE.md updates (§Components.5) → Task 5. ✓
- Memory update (§Components.6) → Task 6. ✓
- Two-mode fork + two gates + interrupt rules (§The pipeline model) → Global Constraints + Task 1. ✓
- Delegate-don't-duplicate (§Interfaces) → Global Constraints + Task 1 Step 2 grep. ✓
- Audit artifact paths (§The pipeline model) → Global Constraints + Task 1 Audit-mode. ✓

**2. Placeholder scan:** No TBD/TODO. Template `____`/`<slug>` fill-ins are intentional per-client placeholders, not plan gaps.

**3. Type consistency:** Skill name `client-pipeline` and the six building-block skill names are used identically across all tasks. Gate numbering (Gate 1 = audit, Gate 2 = delivery) consistent across Tasks 1–3.
