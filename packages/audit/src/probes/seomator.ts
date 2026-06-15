import { execFile } from "node:child_process"
import { readFile, unlink } from "node:fs/promises"
import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { promisify } from "node:util"
import type { Grade, SeomatorProbe } from "../types.js"
import { scoreToGrade } from "../rubric.js"

const exec = promisify(execFile)

/**
 * Resolve the seomator CLI JS entry point from the local node_modules.
 * Using process.execPath + the resolved .js bin avoids npx and shell entirely,
 * which is the only cross-platform approach that:
 *   (a) works on Windows (execFile cannot spawn .cmd files without shell:true), AND
 *   (b) is safe against URLs containing & and other shell metacharacters.
 */
function resolveSeomatorBin(): string {
  const pkgJsonPath = resolve(process.cwd(), "node_modules/@seomator/seo-audit/package.json")
  const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8")) as { bin: Record<string, string> }
  return resolve(dirname(pkgJsonPath), pkg.bin["seomator"])
}

const SEOMATOR_BIN = resolveSeomatorBin()

// Monotonic counter so concurrent audits (even of the same URL) never share a
// temp output filename and clobber each other's results.
let seq = 0

interface ParsedSeomator { score: number; grade: Grade; categories: Record<string, number> }

/**
 * Parse the JSON output of @seomator/seo-audit CLI.
 *
 * Real shape (v3.0.0 against example.com):
 *   { url, overallScore: 94, categoryResults: [{ categoryId, score, ... }] }
 *
 * Fallbacks cover possible alternative shapes documented in the plan:
 *   score / summary.score  /  categories / summary.categories
 */
export function parseSeomator(json: any): ParsedSeomator {
  // Overall score — real key is overallScore; fallbacks for alternative shapes
  const score: number =
    json?.overallScore ?? json?.score ?? json?.summary?.score ?? 0

  // Grade — real output has no grade key; derive from score
  const rawGrade: string | undefined = json?.grade ?? json?.summary?.grade
  const grade = (["A", "B", "C", "D", "F"].includes(rawGrade ?? "")
    ? rawGrade
    : scoreToGrade(score)) as Grade

  // Categories — real key is categoryResults (array); fallback to object shapes
  const categories: Record<string, number> = {}
  const catArray: any[] | undefined = json?.categoryResults
  if (Array.isArray(catArray)) {
    for (const cat of catArray) {
      const id: string | undefined = cat?.categoryId
      const n = typeof cat?.score === "number" ? cat.score : undefined
      if (id && typeof n === "number") categories[id] = n
    }
  } else {
    // Fallback: plain object map shape { [name]: number | { score: number } }
    const cats = json?.categories ?? json?.summary?.categories ?? {}
    for (const [k, v] of Object.entries<any>(cats)) {
      const n = typeof v === "number" ? v : v?.score
      if (typeof n === "number") categories[k] = n
    }
  }

  return { score, grade, categories }
}

export async function runSeomatorProbe(
  url: string,
  timeoutMs = 90000,
): Promise<SeomatorProbe> {
  // Single-page audit (no --crawl): right scope for triage and far faster.
  // --no-cwv: we measure Core Web Vitals via the PSI probe, and SEOmator's
  // Playwright-based CWV pass is its biggest time sink. Heavy SPAs can still
  // exceed the timeout (link-checking scales with page size) — that's handled
  // gracefully (status:"error") and is uncommon for small local-shop sites.
  const out = `seomator-${process.pid}-${seq++}-${Buffer.from(url).toString("hex").slice(0, 8)}.json`
  try {
    await exec(
      process.execPath,
      [SEOMATOR_BIN, "audit", url, "--no-cwv", "--format", "json", "-o", out],
      { timeout: timeoutMs },
    )
    const parsed = parseSeomator(JSON.parse(await readFile(out, "utf8")))
    return { status: "ok", ...parsed }
  } catch (e) {
    return { status: "error", error: (e as Error).message }
  } finally {
    await unlink(out).catch(() => {})
  }
}
