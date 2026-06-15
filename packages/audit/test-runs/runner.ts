// Unattended test harness for the site-audit collector.
// Runs the REAL pipeline (the same probes/code the CLI uses) against a list of
// sites and appends structured results to test-runs/results/. Attempts PSI
// keyless (low-volume) so the performance/CWV probe is exercised too; everything
// degrades gracefully and is logged rather than crashing the batch.
import { fetchHtml } from "../src/probes/fetchPage.js"
import { runPsiProbe } from "../src/probes/psi.js"
import { runSeomatorProbe } from "../src/probes/seomator.js"
import { inventoryFromHtml } from "../src/inventory.js"
import { detectStack } from "../src/stack.js"
import { assembleAudit } from "../src/collect.js"
import type { FeatureKey, StackProbe } from "../src/types.js"
import { appendFile, mkdir, readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const here = dirname(fileURLToPath(import.meta.url))
const resultsDir = join(here, "results")
const jsonlPath = join(resultsDir, "results.jsonl")
const summaryPath = join(resultsDir, "summary.log")

const ALL_FEATURES: FeatureKey[] = [
  "mobileViewport", "clickToCall", "bookingLink", "hours", "addressOrMap", "reviews",
  "localBusinessJsonLd", "menuSchema", "https", "ogTags", "contactForm", "favicon",
]

interface Site { url: string; vertical?: string; note?: string }

async function auditOne(site: Site) {
  const started = Date.now()
  const fetchedAt = new Date().toISOString()
  const key = process.env.PSI_API_KEY ?? "" // empty → keyless PSI attempt
  const page = await fetchHtml(site.url)
  const blocked = page.reachable && !page.ok
  const inspectable = page.reachable && page.ok
  const unavailable = blocked ? `blocked (HTTP ${page.status})` : page.error ?? "unreachable"

  const inventory: Record<FeatureKey, boolean | "error"> = inspectable
    ? inventoryFromHtml(page.html, page.finalUrl)
    : (Object.fromEntries(ALL_FEATURES.map((k) => [k, "error"])) as Record<FeatureKey, boolean | "error">)

  const stack: StackProbe = inspectable
    ? { status: "ok", ...detectStack(page.html) }
    : { status: "error", error: unavailable }

  const [psi, seomator] = await Promise.all([
    inspectable ? runPsiProbe(site.url, key) : Promise.resolve({ status: "error" as const, error: unavailable }),
    inspectable ? runSeomatorProbe(site.url) : Promise.resolve({ status: "error" as const, error: unavailable }),
  ])

  const data = assembleAudit({
    url: site.url, fetchedAt, reachable: page.reachable, blocked, vertical: site.vertical, psi, seomator, inventory, stack,
  })

  const present = Object.values(data.inventory).filter((v) => v === true).length
  return { data, present, durationMs: Date.now() - started }
}

function record(site: Site, r: Awaited<ReturnType<typeof auditOne>>) {
  const d = r.data
  return {
    ts: d.fetchedAt,
    url: site.url,
    vertical: site.vertical ?? null,
    note: site.note ?? null,
    reachable: d.reachable,
    blocked: d.blocked,
    grade: d.grade.overall,
    confidence: d.grade.confidence,
    tier: d.tier,
    byCategory: d.grade.byCategory,
    psiStatus: d.psi.status,
    psiPerfMobile: d.psi.status === "ok" ? d.psi.mobile?.performance ?? null : null,
    cwvPass: d.psi.status === "ok" ? d.psi.cwv?.pass ?? null : null,
    seomatorStatus: d.seomator.status,
    seomatorScore: d.seomator.status === "ok" ? d.seomator.score ?? null : null,
    stack: d.stack.status === "ok" ? d.stack.platform ?? null : null,
    legacy: d.stack.status === "ok" ? d.stack.legacy ?? null : null,
    featuresPresent: r.present,
    featuresTotal: 12,
    targetedFixes: d.fixes.targeted.length,
    durationMs: r.durationMs,
    psiError: d.psi.status === "error" ? d.psi.error ?? null : null,
    seomatorError: d.seomator.status === "error" ? d.seomator.error ?? null : null,
  }
}

function line(rec: ReturnType<typeof record>): string {
  return [
    rec.ts,
    String(rec.grade).padEnd(1),
    rec.confidence.padEnd(7),
    String(rec.tier).padEnd(16),
    (rec.blocked ? "BLOCKED" : "").padEnd(7),
    `sxo=${rec.seomatorStatus}/${rec.seomatorScore ?? "-"}`.padEnd(16),
    `psi=${rec.psiStatus}/${rec.psiPerfMobile ?? "-"}`.padEnd(16),
    `stack=${rec.stack ?? "-"}${rec.legacy ? "(legacy)" : ""}`.padEnd(20),
    `feat=${rec.featuresPresent}/12`,
    `fix=${rec.targetedFixes}`,
    `${rec.durationMs}ms`.padEnd(8),
    rec.url,
  ].join("  ")
}

async function main() {
  await mkdir(resultsDir, { recursive: true })
  const sites: Site[] = JSON.parse(await readFile(join(here, "sites.json"), "utf8"))
  const idxArgs = process.argv.slice(2).map(Number).filter((n) => !Number.isNaN(n))
  const selected = idxArgs.length ? idxArgs.map((i) => sites[((i % sites.length) + sites.length) % sites.length]) : sites

  for (const site of selected) {
    try {
      const r = await auditOne(site)
      const rec = record(site, r)
      await appendFile(jsonlPath, JSON.stringify(rec) + "\n")
      const l = line(rec)
      await appendFile(summaryPath, l + "\n")
      console.log(l)
    } catch (e) {
      const crash = { ts: new Date().toISOString(), url: site.url, crashed: true, error: String(e) }
      await appendFile(jsonlPath, JSON.stringify(crash) + "\n")
      const l = `${crash.ts}  CRASH  ${site.url}  ${crash.error}`
      await appendFile(summaryPath, l + "\n")
      console.error(l)
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
