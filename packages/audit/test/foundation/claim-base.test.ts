import { describe, it, expect } from "vitest"
import { validateClaimBase, DIMENSIONS, type Claim } from "../../src/foundation/claims.js"

const claim = (over: Partial<Claim> = {}): Claim => ({
  claim: "A representative, sufficiently-long claim about local-shop sites",
  dimension: "perf",
  necessity: "must-have",
  prevalence: "common",
  verticals: ["*"],
  impact: "high",
  evidence: ["https://example.com/a"],
  confidence: "verified",
  ...over,
})

// One verified, cited claim per dimension => a fully-covered valid base.
const fullBase = (): Claim[] => DIMENSIONS.map((d) => claim({ dimension: d }))

describe("validateClaimBase", () => {
  it("accepts a base covering every dimension with cited verified claims", () => {
    const r = validateClaimBase(fullBase())
    expect(r.ok).toBe(true)
    expect(r.missingDimensions).toEqual([])
    expect(r.total).toBe(DIMENSIONS.length)
  })
  it("flags missing dimensions", () => {
    const base = fullBase().filter((c) => c.dimension !== "a11y")
    const r = validateClaimBase(base)
    expect(r.ok).toBe(false)
    expect(r.missingDimensions).toContain("a11y")
  })
  it("flags an uncited verified claim", () => {
    const base = fullBase()
    base[0] = claim({ dimension: "perf", evidence: [] })
    const r = validateClaimBase(base)
    expect(r.ok).toBe(false)
    expect(r.uncitedVerified).toBe(1)
  })
  it("flags a refuted claim that leaked into the base", () => {
    const base = [...fullBase(), claim({ dimension: "perf", confidence: "refuted" })]
    const r = validateClaimBase(base)
    expect(r.ok).toBe(false)
    expect(r.refutedIncluded).toBe(1)
  })
  it("reports invalid records by index", () => {
    const base = fullBase()
    ;(base[1] as unknown as Record<string, unknown>).dimension = "bogus"
    const r = validateClaimBase(base)
    expect(r.ok).toBe(false)
    expect(r.invalid[0].index).toBe(1)
  })
})
