#!/usr/bin/env tsx
// Before→after audit diff. Solves two real problems with eyeballing two audits:
//  1) Stale comparisons — by default it RE-RUNS both URLs fresh, so you never
//     compare against an artifact produced by an older detector/rubric.
//  2) "Did it get worse?" ambiguity — it separates genuine GAINS from DROPS,
//     and flags drops that are usually intentional (e.g. removing fabricated
//     reviews, or a vertical-irrelevant feature) vs. likely regressions.
//
// Usage:
//   node --import tsx src/diff.ts <beforeUrl> <afterUrl> [vertical]   (fresh, default)
//   node --import tsx src/diff.ts --saved <beforeHost> <afterHost>    (diff saved JSONs)
//
// Writes audit-diff-<beforeHost>-vs-<afterHost>.md and prints a summary.
import { readFile, writeFile } from "node:fs/promises"
import { runAudit, ALL_FEATURE_KEYS } from "./run.js"
import type { AuditData, FeatureKey } from "./types.js"

const FEATURE_LABELS: Record<FeatureKey, string> = {
  mobileViewport: "Mobile-responsive", clickToCall: "Click-to-call", bookingLink: "Booking/appointment link",
  hours: "Opening hours", addressOrMap: "Address / map", reviews: "Reviews / social proof",
  localBusinessJsonLd: "LocalBusiness schema", menuSchema: "Menu schema", https: "HTTPS",
  ogTags: "Open Graph tags", contactForm: "Contact form", favicon: "Favicon",
}

// Keys where a true→false is commonly a deliberate, honest choice rather than a
// regression — surfaced separately so a human can confirm, not auto-blamed.
const SOFT_DROP: Partial<Record<FeatureKey, string>> = {
  reviews: "often intentional — e.g. we removed fabricated/widget reviews; re-add real ones",
  menuSchema: "n/a for non-cafe verticals",
  bookingLink: "fine if bookings now go to call/contact instead of a 3rd-party embed",
}

const host = (urlOrHost: string) => {
  try { return new URL(urlOrHost).hostname } catch { return urlOrHost.replace(/^https?:\/\//, "").replace(/\/.*$/, "") }
}

async function load(beforeArg: string, afterArg: string, saved: boolean, vertical?: string): Promise<[AuditData, AuditData, string[]]> {
  const warn: string[] = []
  if (saved) {
    const read = async (h: string): Promise<AuditData> => {
      try { return JSON.parse(await readFile(`audit-${h}.json`, "utf8")) }
      catch { throw new Error(`No saved audit-${h}.json — run a fresh diff with URLs instead (omit --saved).`) }
    }
    const [b, a] = await Promise.all([read(host(beforeArg)), read(host(afterArg))])
    if (b.rubricVersion !== a.rubricVersion)
      warn.push(`Rubric mismatch: before=${b.rubricVersion ?? "unknown"} vs after=${a.rubricVersion ?? "unknown"} — grades aren't strictly comparable. Re-run fresh for an apples-to-apples grade.`)
    return [b, a, warn]
  }
  // Fresh: re-run both so the comparison is always same-version, same-day, and
  // median several PSI runs (lab scores swing run-to-run) for a defensible number.
  const key = process.env.PSI_API_KEY ?? ""
  const samples = Number(process.env.PSI_SAMPLES) || 3
  const [b, a] = await Promise.all([runAudit(beforeArg, vertical, key, samples), runAudit(afterArg, vertical, key, samples)])
  return [b, a, warn]
}

const arrow = (d: number) => (d > 0 ? `▲ +${d}` : d < 0 ? `▼ ${d}` : "—")
const mobile = (x: AuditData, k: "performance" | "seo" | "accessibility" | "bestPractices") =>
  x.psi.status === "ok" ? x.psi.mobile?.[k] ?? null : null

function numRow(label: string, b: number | null, a: number | null, lowerBetter = false): string {
  if (b == null && a == null) return ""
  const delta = b != null && a != null ? (lowerBetter ? b - a : a - b) : 0
  const mark = b != null && a != null ? arrow(delta) : "—"
  return `| ${label} | ${b ?? "—"} | ${a ?? "—"} | ${mark} |\n`
}

function build(before: AuditData, after: AuditData, warn: string[]): string {
  const vertical = after.vertical ?? before.vertical
  let md = `# Audit diff — ${host(before.url)} → ${host(after.url)}\n\n`
  md += `**Before:** ${before.url} · graded ${before.fetchedAt?.slice(0, 10) ?? "?"} (rubric ${before.rubricVersion ?? "unknown"})\n`
  md += `**After:** ${after.url} · graded ${after.fetchedAt?.slice(0, 10) ?? "?"} (rubric ${after.rubricVersion ?? "unknown"})\n\n`
  if (warn.length) md += warn.map((w) => `> ⚠️ ${w}`).join("\n") + "\n\n"

  // --- grade ---
  md += `## Grade\n\n| | Before | After |\n|---|---|---|\n`
  md += `| **Overall** | ${before.grade.overall} | ${after.grade.overall} |\n`
  md += `| Tier | ${before.tier} | ${after.tier} |\n`
  for (const cat of new Set([...Object.keys(before.grade.byCategory), ...Object.keys(after.grade.byCategory)]))
    md += `| ${cat} | ${before.grade.byCategory[cat] ?? "—"} | ${after.grade.byCategory[cat] ?? "—"} |\n`
  md += `\n`

  // --- measured metrics (Google Lighthouse via PSI + seomator) ---
  md += `## Measured (Google PageSpeed / Lighthouse + seomator)\n\n| Metric | Before | After | Δ |\n|---|---|---|---|\n`
  md += numRow("Mobile performance", mobile(before, "performance"), mobile(after, "performance"))
  md += numRow("Desktop performance", before.psi.desktop?.performance ?? null, after.psi.desktop?.performance ?? null)
  md += numRow("Mobile accessibility", mobile(before, "accessibility"), mobile(after, "accessibility"))
  md += numRow("Mobile SEO (Lighthouse)", mobile(before, "seo"), mobile(after, "seo"))
  md += numRow("Best practices", mobile(before, "bestPractices"), mobile(after, "bestPractices"))
  md += numRow("Lab LCP (ms, lower better)", before.psi.cwv?.lcpMs != null ? Math.round(before.psi.cwv.lcpMs) : null, after.psi.cwv?.lcpMs != null ? Math.round(after.psi.cwv.lcpMs) : null, true)
  md += numRow("seomator score", before.seomator.score ?? null, after.seomator.score ?? null)
  md += `\n> Speed numbers are PageSpeed **lab** scores (fresh diffs median 3 runs to dampen run-to-run variance), not real-user (CrUX) field data — quote the score + architecture, not a "seconds faster" claim.\n\n`

  // --- inventory: gained / dropped / unchanged ---
  const gained: string[] = [], dropped: string[] = [], same: string[] = []
  for (const k of ALL_FEATURE_KEYS) {
    const b = before.inventory[k], a = after.inventory[k]
    const label = FEATURE_LABELS[k]
    if (b !== true && a === true) gained.push(`- ✅ **${label}** — added`)
    else if (b === true && a !== true) {
      const soft = SOFT_DROP[k]
      dropped.push(`- ${soft ? "🟡" : "🔴"} **${label}** — ${soft ? `dropped (${soft})` : "DROPPED — likely a regression, check"}`)
    } else same.push(label)
  }
  md += `## Conversion features\n\n`
  md += `### Gained\n${gained.length ? gained.join("\n") : "_none_"}\n\n`
  md += `### Dropped (confirm)\n${dropped.length ? dropped.join("\n") + "\n\n_🟡 = usually an intentional/honest choice · 🔴 = check for a regression_" : "_none_"}\n\n`
  md += `### Unchanged\n${same.length ? same.join(" · ") : "_none_"}\n`
  if (vertical) md += `\n_Vertical: ${vertical} — vertical-irrelevant features (e.g. Menu schema off a non-cafe) don't count against the conversion grade._\n`
  return md
}

async function main() {
  const args = process.argv.slice(2)
  const saved = args[0] === "--saved"
  const [beforeArg, afterArg, vertical] = saved ? args.slice(1) : args
  if (!beforeArg || !afterArg) {
    console.error("Usage:\n  node --import tsx src/diff.ts <beforeUrl> <afterUrl> [vertical]\n  node --import tsx src/diff.ts --saved <beforeHost> <afterHost>")
    process.exit(1)
  }
  if (!saved && !process.env.PSI_API_KEY) console.error("⚠ no PSI_API_KEY — performance/CWV will be blank. Set it for the full diff.\n")

  const [before, after, warn] = await load(beforeArg, afterArg, saved, vertical)
  const md = build(before, after, warn)
  const outFile = `audit-diff-${host(beforeArg)}-vs-${host(afterArg)}.md`
  await writeFile(outFile, md)
  console.log(md)
  console.error(`\n✔ ${before.grade.overall} → ${after.grade.overall}  ·  written to ${outFile}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
