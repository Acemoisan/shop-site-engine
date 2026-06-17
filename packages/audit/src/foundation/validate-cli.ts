#!/usr/bin/env tsx
// validate-cli.ts — validate a generated claims.json against the foundation schema.
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
