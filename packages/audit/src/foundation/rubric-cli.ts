#!/usr/bin/env tsx
// validate-rubric.ts — validate a built rubric.json against the criterion schema
// and coverage rules. Optionally pass claims.json to range-check claimRefs.
import { readFile } from "node:fs/promises"
import { validateRubric } from "./criteria.js"

async function main() {
  const rubricPath = process.argv[2]
  const claimsPath = process.argv[3]
  if (!rubricPath) {
    console.error("Usage: validate-rubric <rubric.json> [claims.json]")
    process.exit(1)
  }
  const rubric = JSON.parse(await readFile(rubricPath, "utf8"))
  let claimsCount: number | undefined
  if (claimsPath) {
    const claims = JSON.parse(await readFile(claimsPath, "utf8"))
    claimsCount = Array.isArray(claims) ? claims.length : undefined
  }
  const report = validateRubric(rubric, claimsCount)
  console.log(JSON.stringify(report, null, 2))
  console.error(
    report.ok
      ? `✔ rubric valid — ${report.total} criteria across ${Object.keys(report.byDimension).length} dimensions`
      : `✘ rubric INVALID — ${report.invalid.length} bad criteria · missing dims: ${report.missingDimensions.join(", ") || "none"} · dup ids: ${report.duplicateIds.length} · bad claimRefs: ${report.badClaimRefs.length}`,
  )
  process.exit(report.ok ? 0 : 1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
