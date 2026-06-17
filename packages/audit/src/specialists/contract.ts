// The unit of specialist output. One record per rubric criterion the
// specialist resolved or judged. Reduces to the scorer's CriterionResult.
import { DIMENSIONS, type Dimension } from "../foundation/claims.js"
import type { CriterionResult } from "../foundation/score.js"

export const RESULTS = ["pass", "partial", "fail", "na"] as const
export type Result = (typeof RESULTS)[number]

export const CONFIDENCES = ["high", "medium", "low"] as const
export type FindingConfidence = (typeof CONFIDENCES)[number]

export const SOURCES = ["deterministic", "judgment"] as const
export type FindingSource = (typeof SOURCES)[number]

export interface SpecialistFinding {
  id: string
  dimension: Dimension
  result: Result
  confidence: FindingConfidence
  rationale: string
  /** AuditData field refs, HTML quotes, or screenshot observations. */
  evidence: string[]
  source: FindingSource
}

export interface FindingValidation {
  ok: boolean
  errors: string[]
}

const inSet = <T extends string>(set: readonly T[], v: unknown): v is T =>
  typeof v === "string" && (set as readonly string[]).includes(v)

export function validateFinding(obj: unknown): FindingValidation {
  const errors: string[] = []
  if (!obj || typeof obj !== "object") return { ok: false, errors: ["finding is not an object"] }
  const f = obj as Record<string, unknown>

  if (typeof f.id !== "string" || f.id.trim().length < 2) errors.push("id: must be a non-trivial string")
  if (!inSet(DIMENSIONS, f.dimension)) errors.push(`dimension: invalid (${String(f.dimension)})`)
  if (!inSet(RESULTS, f.result)) errors.push(`result: invalid (${String(f.result)})`)
  if (!inSet(CONFIDENCES, f.confidence)) errors.push(`confidence: invalid (${String(f.confidence)})`)
  if (!inSet(SOURCES, f.source)) errors.push(`source: invalid (${String(f.source)})`)
  if (typeof f.rationale !== "string" || f.rationale.trim().length === 0) errors.push("rationale: required")
  if (!Array.isArray(f.evidence) || !f.evidence.every((e) => typeof e === "string"))
    errors.push("evidence: must be an array of strings")

  // Traceability gate: a judged, non-na verdict must cite what it saw.
  if (f.source === "judgment" && f.result !== "na" && (!Array.isArray(f.evidence) || f.evidence.length === 0))
    errors.push("evidence: required for a non-na judgment finding")

  return { ok: errors.length === 0, errors }
}

export function toCriterionResults(findings: SpecialistFinding[]): CriterionResult[] {
  return findings.map((f) => ({ id: f.id, result: f.result }))
}
