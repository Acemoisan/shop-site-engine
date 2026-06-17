// Deterministic scorer for the audit rubric. Pure functions: per-criterion
// results + rubric + vertical -> weighted dimension scores -> overall grade ->
// tier. Reuses the existing grade bands + tier mapping so the new scoring stays
// consistent with packages/audit/src/rubric.ts.

import type { Criterion } from "./criteria.js"
import type { Dimension, Vertical } from "./claims.js"
import { DIMENSIONS } from "./claims.js"
import { scoreToGrade, mapTier } from "../rubric.js"
import type { Grade, Tier } from "../types.js"

export interface CriterionResult {
  id: string
  result: "pass" | "partial" | "fail" | "na"
}

const RESULT_VALUE: Record<CriterionResult["result"], number> = { pass: 1, partial: 0.5, fail: 0, na: 0 }

// Default dimension weights, grounded in SUMMARY.md's cross-cutting priorities:
// conversion / local SEO / performance drive customer outcomes most; a11y lowest.
export const DIMENSION_WEIGHTS: Record<Dimension, number> = {
  conversion: 3, localSeo: 3, perf: 3, content: 2, vertical: 2, trust: 2, visual: 2, a11y: 1,
}

const GRADE_ORDER: Grade[] = ["F", "D", "C", "B", "A"]
const rank = (g: Grade) => GRADE_ORDER.indexOf(g)

export interface ScoreOptions {
  vertical: Vertical
  reachable?: boolean
  blocked?: boolean
  cwvPass?: boolean
  structuralFlags?: { notMobile: boolean; deadPlatform: boolean; brokenIa: boolean }
  dimensionWeights?: Partial<Record<Dimension, number>>
}

export interface ScoreResult {
  dimensionScores: Partial<Record<Dimension, number>>
  overall: number
  grade: Grade
  tier: Tier
  /** Count of criteria that actually applied (non-na, had a result) per dimension. */
  applicableCounts: Partial<Record<Dimension, number>>
}

const applies = (c: Criterion, vertical: Vertical) =>
  c.verticals.includes("*") || c.verticals.includes(vertical)

/** Score one dimension. Returns null if no criteria applied (so it's excluded from the overall). */
export function scoreDimension(
  criteria: Criterion[],
  results: Map<string, CriterionResult["result"]>,
  vertical: Vertical,
): { score: number; applied: number } | null {
  let weighted = 0
  let totalWeight = 0
  let applied = 0
  for (const c of criteria) {
    if (!applies(c, vertical)) continue
    const r = results.get(c.id)
    if (!r || r === "na") continue
    weighted += c.weight * RESULT_VALUE[r]
    totalWeight += c.weight
    applied++
  }
  if (totalWeight === 0) return null
  return { score: Math.round((weighted / totalWeight) * 100), applied }
}

export function scoreRubric(rubric: Criterion[], results: CriterionResult[], opts: ScoreOptions): ScoreResult {
  const resultMap = new Map(results.map((r) => [r.id, r.result]))
  const weights = { ...DIMENSION_WEIGHTS, ...(opts.dimensionWeights ?? {}) }

  const dimensionScores: Partial<Record<Dimension, number>> = {}
  const applicableCounts: Partial<Record<Dimension, number>> = {}
  let overallWeighted = 0
  let overallWeight = 0

  for (const d of DIMENSIONS) {
    const dimCriteria = rubric.filter((c) => c.dimension === d)
    if (dimCriteria.length === 0) continue
    const scored = scoreDimension(dimCriteria, resultMap, opts.vertical)
    if (!scored) continue
    dimensionScores[d] = scored.score
    applicableCounts[d] = scored.applied
    const w = weights[d] ?? 1
    overallWeighted += scored.score * w
    overallWeight += w
  }

  const overall = overallWeight === 0 ? 0 : Math.round(overallWeighted / overallWeight)

  let grade = scoreToGrade(overall)
  // Same caps as the existing computeGrade: failing CWV can't exceed C; a
  // structural defect can't exceed D (foundation-strength override).
  if (opts.cwvPass === false && rank(grade) > rank("C")) grade = "C"
  const structural = !!(opts.structuralFlags &&
    (opts.structuralFlags.notMobile || opts.structuralFlags.deadPlatform || opts.structuralFlags.brokenIa))
  if (structural && rank(grade) > rank("D")) grade = "D"

  const tier = mapTier(
    { overall: grade, byCategory: {}, confidence: "high" },
    opts.reachable ?? true,
    structural,
    opts.blocked ?? false,
  )

  return { dimensionScores, overall, grade, tier, applicableCounts }
}
