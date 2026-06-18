#!/usr/bin/env tsx
import { writeFile } from "node:fs/promises"
import { runAudit } from "./run.js"
import { renderReport } from "./report.js"

function prettifyHostname(hostname: string): string {
  let host = hostname.toLowerCase()
  if (host.startsWith("www.")) host = host.slice(4)
  const parts = host.split(".")
  if (parts.length > 1) parts.pop()
  const base = parts.join(" ")
  const spaced = base.replace(/[-_.]+/g, " ").trim()
  if (!spaced) return hostname
  return spaced.replace(/\b\w/g, (c) => c.toUpperCase())
}

async function main() {
  const url = process.argv[2]
  const vertical = process.argv[3]
  if (!url) {
    console.error("Usage: site-audit <url> [vertical]")
    process.exit(1)
  }
  const data = await runAudit(url, vertical)

  const hostname = new URL(url).hostname
  const shopName = prettifyHostname(hostname)
  const outFile = `audit-${hostname}.json`
  const htmlFile = `audit-${hostname}.html`
  const html = renderReport(data, shopName)
  await Promise.all([
    writeFile(outFile, JSON.stringify(data, null, 2)),
    writeFile(htmlFile, html),
  ])
  console.log(JSON.stringify(data, null, 2))
  console.error(`\n✔ ${data.grade.overall} (${data.grade.confidence}) → ${data.tier}  ·  written to ${outFile} and ${htmlFile}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
