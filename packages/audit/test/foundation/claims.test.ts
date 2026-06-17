import { describe, it, expect } from "vitest"
import { validateClaim, type Claim } from "../../src/foundation/claims.js"

const good = (over: Partial<Claim> = {}): Claim => ({
  claim: "Click-to-call in the sticky mobile header lifts local-shop call conversion",
  dimension: "conversion",
  necessity: "must-have",
  prevalence: "common-but-missing",
  verticals: ["barber", "cafe", "*"],
  impact: "high",
  evidence: ["https://example.com/study"],
  confidence: "verified",
  ...over,
})

describe("validateClaim", () => {
  it("accepts a well-formed claim", () => {
    expect(validateClaim(good()).ok).toBe(true)
  })
  it("rejects an unknown dimension", () => {
    const r = validateClaim(good({ dimension: "vibes" as Claim["dimension"] }))
    expect(r.ok).toBe(false)
    expect(r.errors.some((e) => e.startsWith("dimension"))).toBe(true)
  })
  it("rejects a trivial claim string", () => {
    expect(validateClaim(good({ claim: "ok" })).ok).toBe(false)
  })
  it("rejects an empty verticals array", () => {
    expect(validateClaim(good({ verticals: [] })).ok).toBe(false)
  })
  it("requires evidence on a verified claim", () => {
    const r = validateClaim(good({ confidence: "verified", evidence: [] }))
    expect(r.ok).toBe(false)
    expect(r.errors.some((e) => e.startsWith("evidence"))).toBe(true)
  })
  it("allows a provisional claim with no evidence", () => {
    expect(validateClaim(good({ confidence: "provisional", evidence: [] })).ok).toBe(true)
  })
})
