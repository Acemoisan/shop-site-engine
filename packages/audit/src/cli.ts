#!/usr/bin/env tsx
import { writeFile } from "node:fs/promises"
import { fetchHtml } from "./probes/fetchPage.js"
import { runPsiProbe } from "./probes/psi.js"
import { runSeomatorProbe } from "./probes/seomator.js"
import { inventoryFromHtml } from "./inventory.js"
import { detectStack } from "./stack.js"
import { assembleAudit } from "./collect.js"
import { renderReport } from "./report.js"
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
  // blocked = the server responded but not with a usable 2xx page (e.g. a 403
  // bot-challenge). The site exists, but the HTML we got is not the real page,
  // so inspecting/grading it would be misleading — treat as un-inspectable.
  const blocked = page.reachable && !page.ok
  const inspectable = page.reachable && page.ok
  const unavailable = blocked ? `blocked (HTTP ${page.status})` : page.error ?? "unreachable"

  const inventory: Record<FeatureKey, boolean | "error"> = inspectable
    ? inventoryFromHtml(page.html, page.finalUrl)
    : (Object.fromEntries((["mobileViewport","clickToCall","bookingLink","hours","addressOrMap","reviews","localBusinessJsonLd","menuSchema","https","ogTags","contactForm","favicon"] as FeatureKey[]).map(k => [k, "error"])) as Record<FeatureKey, boolean | "error">)

  const stack: StackProbe = inspectable
    ? { status: "ok", ...detectStack(page.html) }
    : { status: "error", error: unavailable }

  const [psi, seomator] = await Promise.all([
    inspectable && key ? runPsiProbe(url, key) : Promise.resolve({ status: "error" as const, error: inspectable ? "no PSI_API_KEY" : unavailable }),
    inspectable ? runSeomatorProbe(url) : Promise.resolve({ status: "error" as const, error: unavailable }),
  ])

  const data = assembleAudit({ url, fetchedAt, reachable: page.reachable, blocked, vertical, psi, seomator, inventory, stack })

  const host = new URL(url).hostname
  const jsonFile = `audit-${host}.json`
  const htmlFile = `audit-${host}.html`
  await writeFile(jsonFile, JSON.stringify(data, null, 2))
  await writeFile(htmlFile, renderReport(data))
  console.log(JSON.stringify(data, null, 2))
  console.error(`\n✔ ${data.grade.overall} (${data.grade.confidence}) → ${data.tier}\n  JSON   → ${jsonFile}\n  Report → ${htmlFile}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
