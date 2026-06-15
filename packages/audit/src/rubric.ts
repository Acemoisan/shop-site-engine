import type { Grade, GradeResult, Tier, FeatureKey } from "./types.js"

export const RUBRIC_VERSION = "1.0.0"

const GRADE_POINTS: Record<Grade, number> = { A: 4, B: 3, C: 2, D: 1, F: 0 }
const POINTS_GRADE: Grade[] = ["F", "D", "C", "B", "A"]

export function scoreToGrade(score: number): Grade {
  if (score >= 90) return "A"
  if (score >= 80) return "B"
  if (score >= 70) return "C"
  if (score >= 50) return "D"
  return "F"
}

export interface GradeInputs {
  psiMobilePerf?: number
  psiSeo?: number
  psiA11y?: number
  cwvPass?: boolean
  seomatorScore?: number
  inventory: Record<FeatureKey, boolean | "error">
  structuralFlags: { notMobile: boolean; deadPlatform: boolean; brokenIa: boolean }
}

const avg = (ns: number[]) => ns.reduce((a, b) => a + b, 0) / ns.length

export function computeGrade(inp: GradeInputs): GradeResult {
  const byCategory: Record<string, Grade> = {}
  let available = 0

  if (inp.psiMobilePerf != null) { byCategory.performance = scoreToGrade(inp.psiMobilePerf); available++ }

  const seoScores = [inp.psiSeo, inp.seomatorScore].filter((n): n is number => n != null)
  if (seoScores.length) { byCategory.seo = scoreToGrade(avg(seoScores)); available++ }

  if (inp.psiA11y != null) { byCategory.accessibility = scoreToGrade(inp.psiA11y); available++ }

  const present = Object.values(inp.inventory).filter((v) => v === true).length
  const counted = Object.values(inp.inventory).filter((v) => v !== "error").length
  if (counted) { byCategory.conversion = scoreToGrade(Math.round((present / counted) * 100)); available++ }

  const cats = Object.values(byCategory)
  const overallPoints = cats.length ? cats.reduce((s, g) => s + GRADE_POINTS[g], 0) / cats.length : 0
  let overall = POINTS_GRADE[Math.round(overallPoints)]

  if (inp.cwvPass === false && GRADE_POINTS[overall] > GRADE_POINTS["C"]) overall = "C"

  const structural = inp.structuralFlags.notMobile || inp.structuralFlags.deadPlatform || inp.structuralFlags.brokenIa
  if (structural && GRADE_POINTS[overall] > GRADE_POINTS["D"]) overall = "D"

  const confidence: "high" | "partial" = available >= 3 ? "high" : "partial"
  return { overall, byCategory, confidence }
}

export function mapTier(grade: GradeResult, reachable: boolean, structural: boolean, blocked = false): Tier {
  if (!reachable) return "new-build"
  // Reachable but no usable page (403 bot-challenge / 5xx): the site exists but
  // we couldn't inspect it, so we can't honestly grade it — flag for manual review.
  if (blocked) return "blocked-unknown"
  if (structural) return "rebuild"
  switch (grade.overall) {
    case "A": return "care-or-decline"
    case "B":
    case "C": return "tune-up"
    default: return "rebuild"
  }
}
