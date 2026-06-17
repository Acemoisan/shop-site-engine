// Emit per-dimension claim files (with global index) for the rubric builders.
import { readFile, writeFile, mkdir, rm } from "node:fs/promises"

const CLAIMS = "../../docs/research/audit-foundation/claims.json"
const DIR = ".rubric"
const DIMENSIONS = ["perf", "localSeo", "visual", "content", "conversion", "trust", "a11y", "vertical"]

const claims = JSON.parse(await readFile(CLAIMS, "utf8"))
await rm(DIR, { recursive: true, force: true })
await mkdir(DIR, { recursive: true })

const counts = {}
for (const d of DIMENSIONS) {
  const rows = claims
    .map((c, idx) => ({ idx, ...c }))
    .filter((c) => c.dimension === d)
    .map((c) => ({
      idx: c.idx,
      claim: c.claim,
      necessity: c.necessity,
      prevalence: c.prevalence,
      impact: c.impact,
      verticals: c.verticals,
      confidence: c.confidence,
    }))
  await writeFile(`${DIR}/claims-${d}.json`, JSON.stringify(rows, null, 2))
  counts[d] = rows.length
}
console.log(JSON.stringify({ dir: DIR, counts }, null, 2))
