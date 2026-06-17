import { describe, it, expect } from "vitest"
import { validateFinding, toCriterionResults, type SpecialistFinding } from "../../src/specialists/contract.js"

const good = (over: Partial<SpecialistFinding> = {}): SpecialistFinding => ({
  id: "conv-click-to-call-tel-link",
  dimension: "conversion",
  result: "pass",
  confidence: "high",
  rationale: "tel: anchor present in header",
  evidence: ["inventory.clickToCall=true"],
  source: "deterministic",
  ...over,
})

describe("validateFinding", () => {
  it("accepts a well-formed finding", () => {
    expect(validateFinding(good()).ok).toBe(true)
  })
  it("rejects an unknown result", () => {
    const r = validateFinding(good({ result: "maybe" as SpecialistFinding["result"] }))
    expect(r.ok).toBe(false)
    expect(r.errors.some((e) => e.startsWith("result"))).toBe(true)
  })
  it("rejects an unknown dimension", () => {
    expect(validateFinding(good({ dimension: "vibes" as SpecialistFinding["dimension"] })).ok).toBe(false)
  })
  it("requires a non-empty rationale", () => {
    expect(validateFinding(good({ rationale: "" })).ok).toBe(false)
  })
  it("requires evidence on a non-na judgment finding (traceability gate)", () => {
    const r = validateFinding(good({ source: "judgment", result: "fail", evidence: [] }))
    expect(r.ok).toBe(false)
    expect(r.errors.some((e) => e.startsWith("evidence"))).toBe(true)
  })
  it("allows an na judgment finding with no evidence", () => {
    expect(validateFinding(good({ source: "judgment", result: "na", evidence: [] })).ok).toBe(true)
  })
})

describe("toCriterionResults", () => {
  it("strips findings to {id,result}", () => {
    expect(toCriterionResults([good(), good({ id: "trust-https", result: "fail" })])).toEqual([
      { id: "conv-click-to-call-tel-link", result: "pass" },
      { id: "trust-https", result: "fail" },
    ])
  })
})
