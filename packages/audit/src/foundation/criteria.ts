// Rubric criterion schema for the audit. Criteria are the consolidated,
// weighted, vertical-aware things we score a site on — built from the claim
// base (claims.json) and consumed by the specialist auditors + scorer.

import { DIMENSIONS, NECESSITY, VERTICALS, type Dimension, type Necessity, type Vertical } from "./claims.js"

// Re-export so rubric consumers get the dimension/vertical vocabulary from one place.
export { DIMENSIONS, VERTICALS } from "./claims.js"
export type { Dimension, Vertical } from "./claims.js"

export const DETECTION = ["deterministic", "judgment", "hybrid"] as const
export type Detection = (typeof DETECTION)[number]

export interface Criterion {
  id: string
  dimension: Dimension
  title: string
  check: string
  necessity: Necessity
  /** Positive relative weight WITHIN the dimension. */
  weight: number
  verticals: Vertical[]
  detection: Detection
  /** Required when detection is "deterministic": the inventory key / grep hint. */
  signal?: string
  /** Indices into claims.json (provenance). */
  claimRefs: number[]
}

export interface ValidationResult {
  ok: boolean
  errors: string[]
}

const inSet = <T extends string>(set: readonly T[], v: unknown): v is T =>
  typeof v === "string" && (set as readonly string[]).includes(v)

export function validateCriterion(obj: unknown): ValidationResult {
  const errors: string[] = []
  if (!obj || typeof obj !== "object") return { ok: false, errors: ["criterion is not an object"] }
  const c = obj as Record<string, unknown>

  if (typeof c.id !== "string" || c.id.trim().length < 2) errors.push("id: must be a non-trivial string")
  if (!inSet(DIMENSIONS, c.dimension)) errors.push(`dimension: invalid (${String(c.dimension)})`)
  if (typeof c.title !== "string" || c.title.trim().length === 0) errors.push("title: required")
  if (typeof c.check !== "string" || c.check.trim().length === 0) errors.push("check: required")
  if (!inSet(NECESSITY, c.necessity)) errors.push(`necessity: invalid (${String(c.necessity)})`)
  if (typeof c.weight !== "number" || !(c.weight > 0)) errors.push("weight: must be a positive number")
  if (!inSet(DETECTION, c.detection)) errors.push(`detection: invalid (${String(c.detection)})`)

  if (!Array.isArray(c.verticals) || c.verticals.length === 0) errors.push("verticals: must be a non-empty array")
  else if (!c.verticals.every((v) => inSet(VERTICALS, v))) errors.push("verticals: contains an unknown vertical")

  if (!Array.isArray(c.claimRefs) || c.claimRefs.length === 0 || !c.claimRefs.every((n) => typeof n === "number"))
    errors.push("claimRefs: must be a non-empty array of numbers")

  // A deterministic criterion must name the signal that settles it.
  if (c.detection === "deterministic" && (typeof c.signal !== "string" || c.signal.trim().length === 0))
    errors.push("signal: required when detection is deterministic")

  return { ok: errors.length === 0, errors }
}

export interface RubricReport {
  ok: boolean
  total: number
  byDimension: Record<string, number>
  missingDimensions: Dimension[]
  duplicateIds: string[]
  badClaimRefs: { id: string; ref: number }[]
  invalid: { index: number; id?: string; errors: string[] }[]
}

export function validateRubric(criteria: unknown, claimsCount?: number): RubricReport {
  const arr = Array.isArray(criteria) ? criteria : []
  const invalid: { index: number; id?: string; errors: string[] }[] = []
  const byDimension: Record<string, number> = {}
  const seen = new Set<string>()
  const duplicateIds: string[] = []
  const badClaimRefs: { id: string; ref: number }[] = []

  arr.forEach((c, i) => {
    const res = validateCriterion(c)
    const rec = c as Partial<Criterion>
    if (!res.ok) invalid.push({ index: i, id: rec?.id, errors: res.errors })
    if (inSet(DIMENSIONS, rec?.dimension)) byDimension[rec.dimension] = (byDimension[rec.dimension] ?? 0) + 1
    if (typeof rec?.id === "string") {
      if (seen.has(rec.id)) duplicateIds.push(rec.id)
      seen.add(rec.id)
    }
    if (claimsCount != null && Array.isArray(rec?.claimRefs)) {
      for (const ref of rec.claimRefs) {
        if (typeof ref === "number" && (ref < 0 || ref >= claimsCount)) badClaimRefs.push({ id: rec.id ?? `#${i}`, ref })
      }
    }
  })

  const missingDimensions = DIMENSIONS.filter((d) => !byDimension[d])
  const ok =
    invalid.length === 0 && missingDimensions.length === 0 && duplicateIds.length === 0 && badClaimRefs.length === 0
  return { ok, total: arr.length, byDimension, missingDimensions, duplicateIds, badClaimRefs, invalid }
}
