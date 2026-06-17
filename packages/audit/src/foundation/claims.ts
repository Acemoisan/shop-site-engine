// Claim record schema for the audit knowledge foundation. Each record is one
// verified finding about what makes a local-shop website good or bad. The full
// set (claims.json) is the spine of the audit rubric (sub-project #2).

export const DIMENSIONS = [
  "perf", "localSeo", "visual", "content", "conversion", "trust", "a11y", "vertical",
] as const
export type Dimension = (typeof DIMENSIONS)[number]

export const NECESSITY = ["must-have", "should-have", "nice-to-have", "niche"] as const
export type Necessity = (typeof NECESSITY)[number]

export const PREVALENCE = ["always-present", "common", "rare", "common-but-missing"] as const
export type Prevalence = (typeof PREVALENCE)[number]

export const IMPACT = ["high", "medium", "low"] as const
export type Impact = (typeof IMPACT)[number]

export const CONFIDENCE = ["verified", "provisional", "refuted"] as const
export type Confidence = (typeof CONFIDENCE)[number]

// Verticals we audit. "*" = applies to all local-shop verticals.
export const VERTICALS = [
  "*", "barber", "cafe", "spa", "trades", "fitness", "dental", "law", "auto", "retail",
] as const
export type Vertical = (typeof VERTICALS)[number]

// Dimensions where per-vertical depth matters (planner must cover verticals here).
export const VERTICAL_SENSITIVE: Dimension[] = ["vertical", "content", "conversion", "localSeo"]

export interface Claim {
  claim: string
  dimension: Dimension
  necessity: Necessity
  prevalence: Prevalence
  verticals: Vertical[]
  impact: Impact
  evidence: string[]
  confidence: Confidence
  notes?: string
}

export interface ValidationResult {
  ok: boolean
  errors: string[]
}

const inSet = <T extends string>(set: readonly T[], v: unknown): v is T =>
  typeof v === "string" && (set as readonly string[]).includes(v)

export function validateClaim(obj: unknown): ValidationResult {
  const errors: string[] = []
  if (!obj || typeof obj !== "object") return { ok: false, errors: ["claim is not an object"] }
  const c = obj as Record<string, unknown>

  if (typeof c.claim !== "string" || c.claim.trim().length < 8)
    errors.push("claim: must be a non-trivial string (>= 8 chars)")
  if (!inSet(DIMENSIONS, c.dimension)) errors.push(`dimension: invalid (${String(c.dimension)})`)
  if (!inSet(NECESSITY, c.necessity)) errors.push(`necessity: invalid (${String(c.necessity)})`)
  if (!inSet(PREVALENCE, c.prevalence)) errors.push(`prevalence: invalid (${String(c.prevalence)})`)
  if (!inSet(IMPACT, c.impact)) errors.push(`impact: invalid (${String(c.impact)})`)
  if (!inSet(CONFIDENCE, c.confidence)) errors.push(`confidence: invalid (${String(c.confidence)})`)

  if (!Array.isArray(c.verticals) || c.verticals.length === 0)
    errors.push("verticals: must be a non-empty array")
  else if (!c.verticals.every((v) => inSet(VERTICALS, v)))
    errors.push("verticals: contains an unknown vertical")

  if (!Array.isArray(c.evidence)) errors.push("evidence: must be an array")

  // A verified claim must cite at least one source.
  if (c.confidence === "verified" && (!Array.isArray(c.evidence) || c.evidence.length === 0))
    errors.push("evidence: a verified claim must cite at least one source")

  return { ok: errors.length === 0, errors }
}
