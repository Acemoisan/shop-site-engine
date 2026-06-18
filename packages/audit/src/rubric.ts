import type { Grade, GradeResult, Tier, FeatureKey } from "./types.js"

// 1.1.0 — two honesty/accuracy fixes:
//  • lab CWV no longer hard-caps a site that's actually fast (perf grade A/B).
//    A throttled-lab LCP just over 2.5s on an image-optimized static site is
//    noise, not a verdict (see site-audit honesty rules). It still caps a site
//    that is ALSO slow (perf C/D/F + CWV fail = a consistent, real signal).
//  • conversion ignores vertical-irrelevant features (e.g. Menu schema off a
//    non-cafe), so an optician isn't docked for lacking a restaurant feature.
export const RUBRIC_VERSION = "1.1.0"

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
  vertical?: string
  inventory: Record<FeatureKey, boolean | "error">
  structuralFlags: { notMobile: boolean; deadPlatform: boolean; brokenIa: boolean }
}

// Features that only make sense for some verticals — excluded from the
// conversion score elsewhere so a shop isn't penalised for a feature it
// would never have.
const VERTICAL_ONLY: Partial<Record<FeatureKey, (v?: string) => boolean>> = {
  menuSchema: (v) => v === "cafe" || v === "restaurant",
}

const avg = (ns: number[]) => ns.reduce((a, b) => a + b, 0) / ns.length

export function computeGrade(inp: GradeInputs): GradeResult {
  const byCategory: Record<string, Grade> = {}
  let available = 0

  if (inp.psiMobilePerf != null) { byCategory.performance = scoreToGrade(inp.psiMobilePerf); available++ }

  const seoScores = [inp.psiSeo, inp.seomatorScore].filter((n): n is number => n != null)
  if (seoScores.length) { byCategory.seo = scoreToGrade(avg(seoScores)); available++ }

  if (inp.psiA11y != null) { byCategory.accessibility = scoreToGrade(inp.psiA11y); available++ }

  // Only count features relevant to this vertical (e.g. Menu schema is cafe-only).
  const relevant = (Object.keys(inp.inventory) as FeatureKey[]).filter(
    (k) => !VERTICAL_ONLY[k] || VERTICAL_ONLY[k]!(inp.vertical),
  )
  const present = relevant.filter((k) => inp.inventory[k] === true).length
  const counted = relevant.filter((k) => inp.inventory[k] !== "error").length
  if (counted) { byCategory.conversion = scoreToGrade(Math.round((present / counted) * 100)); available++ }

  const cats = Object.values(byCategory)
  const overallPoints = cats.length ? cats.reduce((s, g) => s + GRADE_POINTS[g], 0) / cats.length : 0
  let overall = POINTS_GRADE[Math.round(overallPoints)]

  // Lab CWV "fail" only caps the grade when the site is ALSO slow on the
  // performance score (grade C/D/F). A fast site (perf A/B) is never hard-failed
  // on lab LCP alone — that lab number isn't Google's real-user verdict.
  const perfFastEnough = byCategory.performance === "A" || byCategory.performance === "B"
  if (inp.cwvPass === false && !perfFastEnough && GRADE_POINTS[overall] > GRADE_POINTS["C"]) overall = "C"

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
