import { describe, it, expect } from "vitest"
import { validateCriterion, validateRubric, DIMENSIONS, type Criterion } from "../../src/foundation/criteria.js"

const good = (over: Partial<Criterion> = {}): Criterion => ({
  id: "conv-click-to-call-sticky",
  dimension: "conversion",
  title: "Click-to-call in sticky mobile header",
  check: "A real tel: link (E.164) is present and tappable above the fold on mobile",
  necessity: "must-have",
  weight: 5,
  verticals: ["*"],
  detection: "deterministic",
  signal: "clickToCall",
  claimRefs: [12, 318],
  ...over,
})

describe("validateCriterion", () => {
  it("accepts a well-formed criterion", () => {
    expect(validateCriterion(good()).ok).toBe(true)
  })
  it("rejects an unknown dimension", () => {
    expect(validateCriterion(good({ dimension: "vibes" as Criterion["dimension"] })).ok).toBe(false)
  })
  it("rejects a non-positive weight", () => {
    expect(validateCriterion(good({ weight: 0 })).ok).toBe(false)
    expect(validateCriterion(good({ weight: -3 })).ok).toBe(false)
  })
  it("rejects an empty title or check", () => {
    expect(validateCriterion(good({ title: "" })).ok).toBe(false)
    expect(validateCriterion(good({ check: "" })).ok).toBe(false)
  })
  it("rejects empty verticals", () => {
    expect(validateCriterion(good({ verticals: [] })).ok).toBe(false)
  })
  it("rejects an invalid detection mode", () => {
    expect(validateCriterion(good({ detection: "vibes" as Criterion["detection"] })).ok).toBe(false)
  })
  it("requires a signal when detection is deterministic", () => {
    const r = validateCriterion(good({ detection: "deterministic", signal: undefined }))
    expect(r.ok).toBe(false)
    expect(r.errors.some((e) => e.startsWith("signal"))).toBe(true)
  })
  it("allows no signal when detection is judgment", () => {
    expect(validateCriterion(good({ detection: "judgment", signal: undefined })).ok).toBe(true)
  })
  it("requires claimRefs to be a non-empty number array", () => {
    expect(validateCriterion(good({ claimRefs: [] })).ok).toBe(false)
  })
})

// One valid criterion per dimension => a fully-covered rubric.
const fullRubric = (): Criterion[] =>
  DIMENSIONS.map((d, i) => good({ id: `crit-${d}-${i}`, dimension: d, detection: "judgment", signal: undefined }))

describe("validateRubric", () => {
  it("accepts a rubric covering every dimension with unique ids", () => {
    const r = validateRubric(fullRubric(), 620)
    expect(r.ok).toBe(true)
    expect(r.missingDimensions).toEqual([])
  })
  it("flags duplicate ids", () => {
    const rubric = fullRubric()
    rubric[1].id = rubric[0].id
    const r = validateRubric(rubric, 620)
    expect(r.ok).toBe(false)
    expect(r.duplicateIds.length).toBeGreaterThan(0)
  })
  it("flags missing dimensions", () => {
    const rubric = fullRubric().filter((c) => c.dimension !== "a11y")
    const r = validateRubric(rubric, 620)
    expect(r.ok).toBe(false)
    expect(r.missingDimensions).toContain("a11y")
  })
  it("flags out-of-range claimRefs against the claim count", () => {
    const rubric = fullRubric()
    rubric[0].claimRefs = [99999]
    const r = validateRubric(rubric, 620)
    expect(r.ok).toBe(false)
    expect(r.badClaimRefs.length).toBeGreaterThan(0)
  })
})
