#!/usr/bin/env tsx
import { writeFile } from "node:fs/promises"
import { fetchHtml } from "./probes/fetchPage.js"
import { runPsiProbe } from "./probes/psi.js"
import { runSeomatorProbe } from "./probes/seomator.js"
import { inventoryFromHtml } from "./inventory.js"
import { detectStack } from "./stack.js"
import { assembleAudit } from "./collect.js"
import type { FeatureKey, StackProbe } from "./types.js"

async function main() {
  const url = process.argv[2]
  const vertical = process.argv[3]
  if (!url) {
    console.error("Usage: site-audit <url> [vertical]")
    process.exit(1)
  }
  const key = process.env.PSI_API_KEY ?? ""
  const fetchedAt = new Date().toISOString()

  const page = await fetchHtml(url)
  const inventory: Record<FeatureKey, boolean | "error"> = page.reachable
    ? inventoryFromHtml(page.html, page.finalUrl)
    : (Object.fromEntries((["mobileViewport","clickToCall","bookingLink","hours","addressOrMap","reviews","localBusinessJsonLd","menuSchema","https","ogTags","contactForm","favicon"] as FeatureKey[]).map(k => [k, "error"])) as Record<FeatureKey, boolean | "error">)

  const stack: StackProbe = page.reachable
    ? { status: "ok", ...detectStack(page.html) }
    : { status: "error", error: page.error }

  const [psi, seomator] = await Promise.all([
    page.reachable && key ? runPsiProbe(url, key) : Promise.resolve({ status: "error" as const, error: key ? "unreachable" : "no PSI_API_KEY" }),
    page.reachable ? runSeomatorProbe(url) : Promise.resolve({ status: "error" as const, error: "unreachable" }),
  ])

  const data = assembleAudit({ url, fetchedAt, reachable: page.reachable, vertical, psi, seomator, inventory, stack })

  const outFile = `audit-${new URL(url).hostname}.json`
  await writeFile(outFile, JSON.stringify(data, null, 2))
  console.log(JSON.stringify(data, null, 2))
  console.error(`\n✔ ${data.grade.overall} (${data.grade.confidence}) → ${data.tier}  ·  written to ${outFile}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
