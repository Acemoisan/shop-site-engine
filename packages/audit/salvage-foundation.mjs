// One-off salvage: parse the workflow output, persist the claim base, report.
import { readFile, writeFile, mkdir } from "node:fs/promises"

const OUT = process.argv[2]
const DEST = process.argv[3] ?? "../../docs/research/audit-foundation"

const raw = await readFile(OUT, "utf8")
const envelope = JSON.parse(raw)
// The workflow's return value is nested under `result` in the task envelope.
const result = envelope.result ?? envelope

const claims = Array.isArray(result.claims) ? result.claims : []

// Normalise into the canonical record shape (defensive: the workflow already
// shaped these, but guard against missing fields).
const norm = claims.map((c) => ({
  claim: c.claim,
  dimension: c.dimension,
  necessity: c.necessity,
  prevalence: c.prevalence,
  verticals: Array.isArray(c.verticals) && c.verticals.length ? c.verticals : ["*"],
  impact: c.impact,
  evidence: Array.isArray(c.evidence) ? c.evidence : [],
  confidence: c.confidence ?? "provisional",
  notes: c.notes ?? "",
}))

await mkdir(DEST, { recursive: true })
await writeFile(`${DEST}/claims.json`, JSON.stringify(norm, null, 2))

// Report.
const byDim = {}
const byConf = {}
let verifiedNoEvidence = 0
for (const c of norm) {
  byDim[c.dimension] = (byDim[c.dimension] ?? 0) + 1
  byConf[c.confidence] = (byConf[c.confidence] ?? 0) + 1
  if (c.confidence === "verified" && c.evidence.length === 0) verifiedNoEvidence++
}
const docsEmpty = Object.entries(result.dimensionDocs ?? {}).filter(([, v]) => !v).map(([k]) => k)
console.log(JSON.stringify({
  totalClaims: norm.length,
  byDimension: byDim,
  byConfidence: byConf,
  verifiedNoEvidence,
  summaryLen: (result.summary ?? "").length,
  emptyDimensionDocs: docsEmpty,
}, null, 2))
