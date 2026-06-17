// Concatenate per-dimension criteria files into the final rubric.json.
import { readFile, writeFile, readdir } from "node:fs/promises"

const DIR = ".rubric"
const OUT = "../../docs/research/audit-foundation/rubric.json"

const files = (await readdir(DIR)).filter((f) => /^criteria-.+\.json$/.test(f)).sort()
const rubric = []
const perFile = {}
for (const f of files) {
  const arr = JSON.parse(await readFile(`${DIR}/${f}`, "utf8"))
  perFile[f] = arr.length
  rubric.push(...arr)
}
await writeFile(OUT, JSON.stringify(rubric, null, 2))
console.log(JSON.stringify({ files: perFile, totalCriteria: rubric.length, out: OUT }, null, 2))
