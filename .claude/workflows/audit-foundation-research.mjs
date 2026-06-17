export const meta = {
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
