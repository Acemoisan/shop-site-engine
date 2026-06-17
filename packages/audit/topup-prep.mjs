// Split provisional claims into batch files for a throttled verification top-up.
import { readFile, writeFile, mkdir, rm } from "node:fs/promises"

const CLAIMS = "../../docs/research/audit-foundation/claims.json"
const DIR = ".topup"
const BATCH = Number(process.argv[2] ?? 20)

const claims = JSON.parse(await readFile(CLAIMS, "utf8"))
const provisional = claims
  .map((c, idx) => ({ idx, ...c }))
  .filter((c) => c.confidence === "provisional")

await rm(DIR, { recursive: true, force: true })
await mkdir(DIR, { recursive: true })

let n = 0
for (let i = 0; i < provisional.length; i += BATCH) {
  const batch = provisional.slice(i, i + BATCH).map((c) => ({
    idx: c.idx,
    claim: c.claim,
    dimension: c.dimension,
    verticals: c.verticals,
    evidence: c.evidence,
  }))
  const name = `${DIR}/batch-${String(n).padStart(2, "0")}.json`
  await writeFile(name, JSON.stringify(batch, null, 2))
  n++
}
console.log(JSON.stringify({ totalClaims: claims.length, provisional: provisional.length, batchSize: BATCH, batches: n }, null, 2))
