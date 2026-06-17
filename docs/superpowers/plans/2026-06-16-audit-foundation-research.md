# Audit Foundation (Research Knowledge Base) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build sub-project #1 of the audit-suite upgrade — a verified, tagged claim base (`claims.json`) plus per-dimension briefings and a master summary describing what makes a local-shop website good or bad, produced by a multi-agent research workflow and guarded by a deterministic validator.

**Architecture:** A small deterministic validator package (`packages/audit/src/foundation/`) defines the claim-record schema and enforces coverage/citation rules — it is the *test harness for the research output*. A reusable Workflow (`.claude/workflows/audit-foundation-research.mjs`) runs the 4-layer hierarchy (plan → wide parallel research → adversarial verify → synthesize) and returns `{ dimensionDocs, claims, summary }`. The main loop persists those to `docs/research/audit-foundation/` and validates `claims.json` with the validator.

**Tech Stack:** TypeScript (ESM, `.js` import specifiers), vitest, `tsx` CLIs (matches existing `packages/audit`); Claude Code `Workflow` orchestration with structured-output JSON Schemas.

**Spec:** `docs/superpowers/specs/2026-06-16-audit-suite-research-foundation-design.md`

---

### Task 1: Claim-record schema + single-claim validator

**Files:**
- Create: `packages/audit/src/foundation/claims.ts`
- Test: `packages/audit/test/foundation/claims.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// packages/audit/test/foundation/claims.test.ts
import { describe, it, expect } from "vitest"
import { validateClaim, type Claim } from "../../src/foundation/claims.js"

const good = (over: Partial<Claim> = {}): Claim => ({
  claim: "Click-to-call in the sticky mobile header lifts local-shop call conversion",
  dimension: "conversion",
  necessity: "must-have",
  prevalence: "common-but-missing",
  verticals: ["barber", "cafe", "*"],
  impact: "high",
  evidence: ["https://example.com/study"],
  confidence: "verified",
  ...over,
})

describe("validateClaim", () => {
  it("accepts a well-formed claim", () => {
    expect(validateClaim(good()).ok).toBe(true)
  })
  it("rejects an unknown dimension", () => {
    const r = validateClaim(good({ dimension: "vibes" as Claim["dimension"] }))
    expect(r.ok).toBe(false)
    expect(r.errors.some((e) => e.startsWith("dimension"))).toBe(true)
  })
  it("rejects a trivial claim string", () => {
    expect(validateClaim(good({ claim: "ok" })).ok).toBe(false)
  })
  it("rejects an empty verticals array", () => {
    expect(validateClaim(good({ verticals: [] })).ok).toBe(false)
  })
  it("requires evidence on a verified claim", () => {
    const r = validateClaim(good({ confidence: "verified", evidence: [] }))
    expect(r.ok).toBe(false)
    expect(r.errors.some((e) => e.startsWith("evidence"))).toBe(true)
  })
  it("allows a provisional claim with no evidence", () => {
    expect(validateClaim(good({ confidence: "provisional", evidence: [] })).ok).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/audit && pnpm vitest run test/foundation/claims.test.ts`
Expected: FAIL — cannot find module `../../src/foundation/claims.js`.

- [ ] **Step 3: Write minimal implementation**

```ts
// packages/audit/src/foundation/claims.ts
// Claim record schema for the audit knowledge foundation. Each record is one
// verified finding about what makes a local-shop website good or bad. The full
// set (claims.json) is the spine of the audit rubric (sub-project #2).

export const DIMENSIONS = [
  "perf", "localSeo", "visual", "content", "conversion", "trust", "a11y", "vertical",
] as const
export type Dimension = (typeof DIMENSIONS)[number]

export const NECESSITY = ["must-have", "should-have", "nice-to-have", "niche"] as const
export type Necessity = (typeof NECESSITY)[number]

export const PREVALENCE = ["always-present", "common", "rare", "common-but-missing"] as const
export type Prevalence = (typeof PREVALENCE)[number]

export const IMPACT = ["high", "medium", "low"] as const
export type Impact = (typeof IMPACT)[number]

export const CONFIDENCE = ["verified", "provisional", "refuted"] as const
export type Confidence = (typeof CONFIDENCE)[number]

// Verticals we audit. "*" = applies to all local-shop verticals.
export const VERTICALS = [
  "*", "barber", "cafe", "spa", "trades", "fitness", "dental", "law", "auto", "retail",
] as const
export type Vertical = (typeof VERTICALS)[number]

// Dimensions where per-vertical depth matters (planner must cover verticals here).
export const VERTICAL_SENSITIVE: Dimension[] = ["vertical", "content", "conversion", "localSeo"]

export interface Claim {
  claim: string
  dimension: Dimension
  necessity: Necessity
  prevalence: Prevalence
  verticals: Vertical[]
  impact: Impact
  evidence: string[]
  confidence: Confidence
  notes?: string
}

export interface ValidationResult {
  ok: boolean
  errors: string[]
}

const inSet = <T extends string>(set: readonly T[], v: unknown): v is T =>
  typeof v === "string" && (set as readonly string[]).includes(v)

export function validateClaim(obj: unknown): ValidationResult {
  const errors: string[] = []
  if (!obj || typeof obj !== "object") return { ok: false, errors: ["claim is not an object"] }
  const c = obj as Record<string, unknown>

  if (typeof c.claim !== "string" || c.claim.trim().length < 8)
    errors.push("claim: must be a non-trivial string (>= 8 chars)")
  if (!inSet(DIMENSIONS, c.dimension)) errors.push(`dimension: invalid (${String(c.dimension)})`)
  if (!inSet(NECESSITY, c.necessity)) errors.push(`necessity: invalid (${String(c.necessity)})`)
  if (!inSet(PREVALENCE, c.prevalence)) errors.push(`prevalence: invalid (${String(c.prevalence)})`)
  if (!inSet(IMPACT, c.impact)) errors.push(`impact: invalid (${String(c.impact)})`)
  if (!inSet(CONFIDENCE, c.confidence)) errors.push(`confidence: invalid (${String(c.confidence)})`)

  if (!Array.isArray(c.verticals) || c.verticals.length === 0)
    errors.push("verticals: must be a non-empty array")
  else if (!c.verticals.every((v) => inSet(VERTICALS, v)))
    errors.push("verticals: contains an unknown vertical")

  if (!Array.isArray(c.evidence)) errors.push("evidence: must be an array")

  // A verified claim must cite at least one source.
  if (c.confidence === "verified" && (!Array.isArray(c.evidence) || c.evidence.length === 0))
    errors.push("evidence: a verified claim must cite at least one source")

  return { ok: errors.length === 0, errors }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/audit && pnpm vitest run test/foundation/claims.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/audit/src/foundation/claims.ts packages/audit/test/foundation/claims.test.ts
git commit -m "feat(audit): claim-record schema + single-claim validator for knowledge foundation"
```

---

### Task 2: Claim-base validator (coverage + citation rules)

**Files:**
- Modify: `packages/audit/src/foundation/claims.ts` (append `validateClaimBase`)
- Test: `packages/audit/test/foundation/claim-base.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// packages/audit/test/foundation/claim-base.test.ts
import { describe, it, expect } from "vitest"
import { validateClaimBase, DIMENSIONS, type Claim } from "../../src/foundation/claims.js"

const claim = (over: Partial<Claim> = {}): Claim => ({
  claim: "A representative, sufficiently-long claim about local-shop sites",
  dimension: "perf",
  necessity: "must-have",
  prevalence: "common",
  verticals: ["*"],
  impact: "high",
  evidence: ["https://example.com/a"],
  confidence: "verified",
  ...over,
})

// One verified, cited claim per dimension => a fully-covered valid base.
const fullBase = (): Claim[] => DIMENSIONS.map((d) => claim({ dimension: d }))

describe("validateClaimBase", () => {
  it("accepts a base covering every dimension with cited verified claims", () => {
    const r = validateClaimBase(fullBase())
    expect(r.ok).toBe(true)
    expect(r.missingDimensions).toEqual([])
    expect(r.total).toBe(DIMENSIONS.length)
  })
  it("flags missing dimensions", () => {
    const base = fullBase().filter((c) => c.dimension !== "a11y")
    const r = validateClaimBase(base)
    expect(r.ok).toBe(false)
    expect(r.missingDimensions).toContain("a11y")
  })
  it("flags an uncited verified claim", () => {
    const base = fullBase()
    base[0] = claim({ dimension: "perf", evidence: [] })
    const r = validateClaimBase(base)
    expect(r.ok).toBe(false)
    expect(r.uncitedVerified).toBe(1)
  })
  it("flags a refuted claim that leaked into the base", () => {
    const base = [...fullBase(), claim({ dimension: "perf", confidence: "refuted" })]
    const r = validateClaimBase(base)
    expect(r.ok).toBe(false)
    expect(r.refutedIncluded).toBe(1)
  })
  it("reports invalid records by index", () => {
    const base = fullBase()
    ;(base[1] as unknown as Record<string, unknown>).dimension = "bogus"
    const r = validateClaimBase(base)
    expect(r.ok).toBe(false)
    expect(r.invalid[0].index).toBe(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/audit && pnpm vitest run test/foundation/claim-base.test.ts`
Expected: FAIL — `validateClaimBase` is not exported.

- [ ] **Step 3: Append the implementation to `claims.ts`**

```ts
// --- append to packages/audit/src/foundation/claims.ts ---

export interface ClaimBaseReport {
  ok: boolean
  total: number
  byDimension: Record<string, number>
  missingDimensions: Dimension[]
  uncitedVerified: number
  refutedIncluded: number
  invalid: { index: number; errors: string[] }[]
}

export function validateClaimBase(claims: unknown): ClaimBaseReport {
  const arr = Array.isArray(claims) ? claims : []
  const invalid: { index: number; errors: string[] }[] = []
  const byDimension: Record<string, number> = {}
  let uncitedVerified = 0
  let refutedIncluded = 0

  arr.forEach((c, i) => {
    const res = validateClaim(c)
    if (!res.ok) invalid.push({ index: i, errors: res.errors })
    const rec = c as Partial<Claim>
    if (inSet(DIMENSIONS, rec?.dimension)) byDimension[rec.dimension] = (byDimension[rec.dimension] ?? 0) + 1
    if (rec?.confidence === "verified" && (!Array.isArray(rec.evidence) || rec.evidence.length === 0)) uncitedVerified++
    if (rec?.confidence === "refuted") refutedIncluded++
  })

  const missingDimensions = DIMENSIONS.filter((d) => !byDimension[d])
  const ok =
    invalid.length === 0 && missingDimensions.length === 0 && uncitedVerified === 0 && refutedIncluded === 0
  return { ok, total: arr.length, byDimension, missingDimensions, uncitedVerified, refutedIncluded, invalid }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/audit && pnpm vitest run test/foundation/claim-base.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/audit/src/foundation/claims.ts packages/audit/test/foundation/claim-base.test.ts
git commit -m "feat(audit): claim-base validator with coverage + citation rules"
```

---

### Task 3: Validator CLI

**Files:**
- Create: `packages/audit/src/foundation/validate-cli.ts`
- Modify: `packages/audit/package.json` (add a `validate-claims` script)

- [ ] **Step 1: Write the CLI**

```ts
#!/usr/bin/env tsx
// packages/audit/src/foundation/validate-cli.ts  (shebang MUST be line 1)
import { readFile } from "node:fs/promises"
import { validateClaimBase } from "./claims.js"

async function main() {
  const path = process.argv[2]
  if (!path) {
    console.error("Usage: validate-claims <claims.json>")
    process.exit(1)
  }
  const report = validateClaimBase(JSON.parse(await readFile(path, "utf8")))
  console.log(JSON.stringify(report, null, 2))
  console.error(
    report.ok
      ? `✔ claim base valid — ${report.total} claims across ${Object.keys(report.byDimension).length} dimensions`
      : `✘ claim base INVALID — ${report.invalid.length} bad records · missing dims: ${report.missingDimensions.join(", ") || "none"} · uncited verified: ${report.uncitedVerified} · refuted included: ${report.refutedIncluded}`,
  )
  process.exit(report.ok ? 0 : 1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
```

- [ ] **Step 2: Add the package script**

In `packages/audit/package.json`, add to `"scripts"` (after the existing `"site-audit"` line):

```json
    "validate-claims": "tsx src/foundation/validate-cli.ts",
```

- [ ] **Step 3: Smoke-test the CLI against a temporary fixture**

```bash
cd packages/audit
cat > /tmp/claims-smoke.json <<'JSON'
[]
JSON
pnpm validate-claims /tmp/claims-smoke.json; echo "exit=$?"
```
Expected: prints a report with `"ok": false` and a non-empty `missingDimensions` list, and `exit=1` (an empty base is correctly rejected — proves the CLI wiring + exit code work).

- [ ] **Step 4: Commit**

```bash
git add packages/audit/src/foundation/validate-cli.ts packages/audit/package.json
git commit -m "feat(audit): validate-claims CLI for the knowledge-foundation claim base"
```

---

### Task 4: Author the research workflow script

**Files:**
- Create: `.claude/workflows/audit-foundation-research.mjs`

- [ ] **Step 1: Write the workflow script**

```js
export const meta = {
  // file: .claude/workflows/audit-foundation-research.mjs
  // NOTE: the script MUST begin with `export const meta` — no code/comment before it.
  name: 'audit-foundation-research',
  description: 'Deep verified research into what makes a local-shop website good/bad; emits a tagged claim base + per-dimension briefings + summary for the audit rubric',
  phases: [
    { title: 'Plan', detail: 'decompose 8 dimensions into research cells' },
    { title: 'Research', detail: 'parallel cited research per cell' },
    { title: 'Verify', detail: 'adversarial refutation per claim' },
    { title: 'Synthesize', detail: 'per-dimension briefings + claim base + summary' },
  ],
}

const DIMENSIONS = [
  { key: 'perf', label: 'Performance / Core Web Vitals / mobile speed', verticalSensitive: false },
  { key: 'localSeo', label: 'Local SEO & discovery (GBP, NAP consistency, local pack, schema, reviews, citations)', verticalSensitive: true },
  { key: 'visual', label: 'Visual & brand quality (credibility, dated vs premium, type, hierarchy, whitespace, price-point fit)', verticalSensitive: false },
  { key: 'content', label: 'Content & information architecture (services+prices, real copy, photos, hours, menu/product detail)', verticalSensitive: true },
  { key: 'conversion', label: 'Conversion & UX (CTA placement, click-to-call, booking/order flows, form friction, trust-cue placement)', verticalSensitive: true },
  { key: 'trust', label: 'Trust & compliance (HTTPS, privacy/Alberta PIPA, social proof)', verticalSensitive: false },
  { key: 'a11y', label: 'Accessibility (WCAG 2.x AA for local-shop sites)', verticalSensitive: false },
  { key: 'vertical', label: 'Per-vertical must-haves and anatomy', verticalSensitive: true },
]

const VERTICALS = ['barber', 'cafe', 'spa', 'trades', 'fitness', 'dental', 'law', 'auto', 'retail']

const SEED = `Seed context (extend & re-verify; do NOT re-derive what is already settled): the repo already has verified research in docs/research/ — vertical anatomy (restaurant/retail), the engagement-scoping rubric (A–F grade → tier), and pricing/tools/compliance (Alberta PIPA not PIPEDA; Core Web Vitals targets LCP<2.5s / INP<200ms / CLS<0.1). The current packages/audit rubric grades perf/seo/a11y plus a 12-item conversion inventory: mobileViewport, clickToCall, bookingLink, hours, addressOrMap, reviews, localBusinessJsonLd, menuSchema, https, ogTags, contactForm, favicon. Context is Calgary local-shop websites.`

const CELLS_SCHEMA = {
  type: 'object', required: ['cells'],
  properties: { cells: { type: 'array', items: {
    type: 'object', required: ['question', 'verticals'],
    properties: {
      question: { type: 'string' },
      verticals: { type: 'array', items: { type: 'string' } },
    },
  } } },
}

const CLAIM_ITEM = {
  type: 'object',
  required: ['claim', 'necessity', 'prevalence', 'verticals', 'impact', 'evidence'],
  properties: {
    claim: { type: 'string' },
    necessity: { enum: ['must-have', 'should-have', 'nice-to-have', 'niche'] },
    prevalence: { enum: ['always-present', 'common', 'rare', 'common-but-missing'] },
    verticals: { type: 'array', items: { type: 'string' } },
    impact: { enum: ['high', 'medium', 'low'] },
    evidence: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
}
const CLAIMS_SCHEMA = { type: 'object', required: ['claims'], properties: { claims: { type: 'array', items: CLAIM_ITEM } } }
const VERDICT_SCHEMA = {
  type: 'object', required: ['refuted', 'confidence', 'reason'],
  properties: {
    refuted: { type: 'boolean' },
    confidence: { enum: ['verified', 'provisional', 'refuted'] },
    reason: { type: 'string' },
  },
}
const DOC_SCHEMA = { type: 'object', required: ['markdown'], properties: { markdown: { type: 'string' } } }

// --- Plan: one planner per dimension -> research questions (cells) ---
phase('Plan')
const plans = await parallel(DIMENSIONS.map((d) => () =>
  agent(
    `You are planning research for the "${d.key}" dimension: ${d.label}.\n${SEED}\n` +
    `Produce 4-7 specific, non-overlapping research questions that, answered with cited evidence, reveal what makes a local-shop website succeed or fail on THIS dimension — covering what is necessary, what is niche, what is always reused, and what is most/least common. ` +
    (d.verticalSensitive
      ? `This dimension is vertical-sensitive: for each question, set verticals to the relevant subset of ${JSON.stringify(VERTICALS)} (or ["*"] for all).`
      : `This dimension is largely vertical-agnostic: set verticals to ["*"] for every question.`),
    { label: `plan:${d.key}`, phase: 'Plan', schema: CELLS_SCHEMA },
  ).then((r) => ({ d, cells: r?.cells ?? [] })),
))

const cells = []
for (const p of plans.filter(Boolean)) {
  for (const cell of p.cells) {
    cells.push({
      dimension: p.d.key,
      dimensionLabel: p.d.label,
      question: cell.question,
      verticals: cell.verticals?.length ? cell.verticals : ['*'],
    })
  }
}
log(`Planned ${cells.length} research cells across ${DIMENSIONS.length} dimensions`)

// --- Research each cell, then adversarially verify each claim (pipelined) ---
phase('Research')
const researched = await pipeline(
  cells,
  (cell) => agent(
    `Research question for the "${cell.dimension}" dimension (${cell.dimensionLabel}), verticals ${JSON.stringify(cell.verticals)}:\n"${cell.question}"\n${SEED}\n` +
    `Use web search and fetch real sources. Return concrete, individually-checkable claims about local-shop websites. For each claim provide: necessity, prevalence, impact, verticals (subset of ${JSON.stringify(VERTICALS)} or ["*"]), and evidence (1+ source URLs you actually consulted). Prefer primary/reputable sources. Never invent URLs.`,
    { label: `research:${cell.dimension}`, phase: 'Research', schema: CLAIMS_SCHEMA },
  ).then((r) => ({ cell, claims: r?.claims ?? [] })),
  (res) => parallel((res.claims).map((cl) => () =>
    agent(
      `Adversarially fact-check this claim about local-shop websites. Try to REFUTE it using web search. Default to refuted/provisional if evidence is weak or the cited sources do not support it.\nClaim: "${cl.claim}"\nClaimed evidence: ${JSON.stringify(cl.evidence ?? [])}\nReturn refuted (bool), confidence (verified|provisional|refuted), and a one-line reason. Mark "verified" ONLY if independent reputable sources support it.`,
      { label: `verify:${res.cell.dimension}`, phase: 'Verify', schema: VERDICT_SCHEMA },
    ).then((v) => ({ ...cl, dimension: res.cell.dimension, confidence: v?.confidence ?? 'provisional', verifyReason: v?.reason ?? '' })),
  )),
)

const allClaims = researched.filter(Boolean).flat().filter((c) => c && c.confidence !== 'refuted')
log(`${allClaims.length} claims survived verification`)

// --- Synthesize per-dimension briefings + master summary ---
phase('Synthesize')
const dimensionDocs = {}
const synthByDim = await parallel(DIMENSIONS.map((d) => () => {
  const claimsForDim = allClaims.filter((c) => c.dimension === d.key)
  return agent(
    `Write a concise, well-structured GitHub-flavored markdown briefing for the "${d.key}" dimension (${d.label}) of a local-shop website audit, using ONLY these verified/provisional claims (add no new facts):\n${JSON.stringify(claimsForDim, null, 2)}\n` +
    `Organize by: what's necessary (must/should), what's niche, what's always reused vs rare, what's most/least common, and the clearest "works vs doesn't" guidance per vertical where relevant. Note confidence where a claim is only provisional.`,
    { label: `synth:${d.key}`, phase: 'Synthesize', schema: DOC_SCHEMA },
  ).then((r) => ({ key: d.key, markdown: r?.markdown ?? '' }))
}))
for (const s of synthByDim.filter(Boolean)) dimensionDocs[s.key] = s.markdown

const summary = await agent(
  `Write the master SUMMARY.md for our local-shop website audit knowledge foundation, synthesizing across all dimensions using these per-dimension briefings:\n${JSON.stringify(dimensionDocs, null, 2)}\n` +
  `Use a section per question: (1) what is necessary on every local-shop site, (2) what is niche/vertical-specific, (3) what is always reused vs rare, (4) what is most and least common, (5) what works and what doesn't. End with the top cross-cutting priorities to audit on. GitHub-flavored markdown.`,
  { label: 'synth:summary', phase: 'Synthesize', schema: DOC_SCHEMA },
).then((r) => r?.markdown ?? '')

// --- Final canonical claim base ---
const claims = allClaims.map((c) => ({
  claim: c.claim,
  dimension: c.dimension,
  necessity: c.necessity,
  prevalence: c.prevalence,
  verticals: c.verticals?.length ? c.verticals : ['*'],
  impact: c.impact,
  evidence: c.evidence ?? [],
  confidence: c.confidence,
  notes: c.notes ?? c.verifyReason ?? '',
}))

return { dimensionDocs, claims, summary }
```

- [ ] **Step 2: Syntax-check the script**

Run: `node --check .claude/workflows/audit-foundation-research.mjs`
Expected: no output, exit 0 (valid ESM syntax). The workflow globals (`agent`, `parallel`, `pipeline`, `phase`, `log`) are provided by the Workflow runtime at run time; `--check` only parses, so undefined globals are fine here.

- [ ] **Step 3: Commit**

```bash
git add .claude/workflows/audit-foundation-research.mjs
git commit -m "feat(audit): research workflow that produces the knowledge-foundation claim base"
```

---

### Task 5: Run the workflow and persist the artifacts

> This task executes the workflow and writes its output. It is run by the main loop (the Workflow tool is not available to subagents). If executing via subagents, surface this task to the human/orchestrator to run.

**Files (created by this task, as output):**
- Create: `docs/research/audit-foundation/<dimension>.md` (one per dimension key returned)
- Create: `docs/research/audit-foundation/claims.json`
- Create: `docs/research/audit-foundation/SUMMARY.md`

- [ ] **Step 1: Run the workflow**

Invoke the `Workflow` tool with `{ name: "audit-foundation-research" }`. Wait for the `<task-notification>`. The result is `{ dimensionDocs: { <dimension>: "<markdown>" }, claims: [ <claim records> ], summary: "<markdown>" }`.

- [ ] **Step 2: Persist the artifacts**

For each key/value in `dimensionDocs`, write `docs/research/audit-foundation/<key>.md` with the markdown value.
Write `docs/research/audit-foundation/claims.json` = `JSON.stringify(result.claims, null, 2)`.
Write `docs/research/audit-foundation/SUMMARY.md` = `result.summary`.

- [ ] **Step 3: Sanity-check the output exists**

Run: `ls docs/research/audit-foundation/ && head -c 400 docs/research/audit-foundation/claims.json`
Expected: the 8 dimension `.md` files, `claims.json`, and `SUMMARY.md` are present; `claims.json` begins with a JSON array of claim records.

---

### Task 6: Validate the generated claim base (the guardrail), repair gaps, commit

**Files:**
- Possibly modify: `docs/research/audit-foundation/claims.json` (only if validation finds gaps)

- [ ] **Step 1: Run the validator on the real output**

Run: `cd packages/audit && pnpm validate-claims ../../docs/research/audit-foundation/claims.json; echo "exit=$?"`
Expected (success): `"ok": true`, `missingDimensions: []`, `uncitedVerified: 0`, `refutedIncluded: 0`, and `exit=0`.

- [ ] **Step 2: If validation fails, repair targeted gaps**

- **Missing dimension(s):** re-run research for only those dimensions by invoking the `Workflow` tool again (it caches unchanged agent calls on resume) OR dispatch a single `Agent` (general-purpose) with the same research+verify prompt scoped to the missing dimension, then merge its verified claims into `claims.json`.
- **Uncited verified claim(s):** for each flagged index, either add the real source URL the claim came from, or downgrade `confidence` to `"provisional"`. Never fabricate a URL.
- **Refuted claim included:** remove that record (it should have been filtered; this is a safety catch).
- Re-run Step 1 until `exit=0`.

- [ ] **Step 3: Commit the validated foundation**

```bash
git add docs/research/audit-foundation/
git commit -m "feat(audit): verified knowledge-foundation claim base + per-dimension briefings + summary"
```

---

### Task 7: Verify the summary answers the brief, and record the seam

**Files:**
- Modify: `docs/research/audit-foundation/SUMMARY.md` (only if a section is missing)

- [ ] **Step 1: Read `SUMMARY.md` and confirm it answers all five questions**

Open `docs/research/audit-foundation/SUMMARY.md`. Confirm there is a clear section for each: (1) necessary-on-every-site, (2) niche/vertical-specific, (3) always-reused vs rare, (4) most/least common, (5) works vs doesn't — plus the cross-cutting priorities. If any is thin or missing, dispatch one `Agent` (general-purpose) to expand only that section from `claims.json` and patch it in.

- [ ] **Step 2: Confirm the seam to sub-project #2 is real**

Run: `cd packages/audit && pnpm validate-claims ../../docs/research/audit-foundation/claims.json`
Expected: `"ok": true`. Confirm by eye that `byDimension` has a sensible spread (no dimension with a single token claim) — this is the data the rubric will weight. If a dimension is suspiciously thin, note it as a follow-up for a deeper research pass (do not block on it).

- [ ] **Step 3: Final commit (if any edits were made)**

```bash
git add docs/research/audit-foundation/SUMMARY.md
git commit -m "docs(audit): round out knowledge-foundation summary"
```

---

## Definition of done (sub-project #1)

- `packages/audit/src/foundation/claims.ts` + validator CLI exist with passing tests (`pnpm vitest run test/foundation`).
- `.claude/workflows/audit-foundation-research.mjs` exists and parses.
- `docs/research/audit-foundation/` holds 8 dimension briefings, `claims.json`, and `SUMMARY.md`.
- `pnpm validate-claims` reports `ok: true` on the real `claims.json`.
- All committed on `feat/audit-suite`.

**Next sub-project:** #2 Rubric System — roll `claims.json` into weighted, tiered scoring criteria. Gets its own spec → plan cycle.
