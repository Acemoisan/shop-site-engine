import { execFile } from "node:child_process"
import { readFile, unlink } from "node:fs/promises"
import { promisify } from "node:util"
import type { Grade, SeomatorProbe } from "../types.js"
import { scoreToGrade } from "../rubric.js"

const exec = promisify(execFile)

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
  maxPages = 25,
  timeoutMs = 120000,
): Promise<SeomatorProbe> {
  const out = `seomator-${Buffer.from(url).toString("hex").slice(0, 12)}.json`
  try {
    await exec(
      "npx",
      ["@seomator/seo-audit", "audit", url, "--crawl", "-m", String(maxPages), "--format", "json", "-o", out],
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
