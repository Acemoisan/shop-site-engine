// Merge verification verdicts back into the claim base.
import { readFile, writeFile, readdir } from "node:fs/promises"

const CLAIMS = "../../docs/research/audit-foundation/claims.json"
const DIR = ".topup"

const claims = JSON.parse(await readFile(CLAIMS, "utf8"))

// Load all verdict-*.json files.
const files = (await readdir(DIR)).filter((f) => /^verdict-\d+\.json$/.test(f))
const verdict = new Map()
for (const f of files) {
  const arr = JSON.parse(await readFile(`${DIR}/${f}`, "utf8"))
  for (const v of arr) {
    if (typeof v.idx === "number") verdict.set(v.idx, v)
  }
}

let upgraded = 0, stillProvisional = 0, refuted = 0, applied = 0
const kept = []
claims.forEach((c, idx) => {
  const v = verdict.get(idx)
  if (v) {
    applied++
    const conf = v.refuted ? "refuted" : v.confidence
    if (conf === "refuted") { refuted++; return } // drop refuted
    if (conf === "verified" && Array.isArray(c.evidence) && c.evidence.length > 0) {
      c.confidence = "verified"; upgraded++
    } else {
      c.confidence = "provisional"; stillProvisional++
    }
  }
  kept.push(c)
})

await writeFile(CLAIMS, JSON.stringify(kept, null, 2))

const byConf = {}
for (const c of kept) byConf[c.confidence] = (byConf[c.confidence] ?? 0) + 1
console.log(JSON.stringify({
  verdictFiles: files.length,
  verdictsApplied: applied,
  upgradedToVerified: upgraded,
  keptProvisional: stillProvisional,
  refutedDropped: refuted,
  newTotal: kept.length,
  byConfidence: byConf,
}, null, 2))
