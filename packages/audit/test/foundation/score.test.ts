import { describe, it, expect } from "vitest"
import { scoreRubric, type CriterionResult } from "../../src/foundation/score.js"
import type { Criterion } from "../../src/foundation/criteria.js"

const crit = (over: Partial<Criterion> = {}): Criterion => ({
  id: "c1",
  dimension: "conversion",
  title: "t",
  check: "c",
  necessity: "must-have",
  weight: 5,
  verticals: ["*"],
  detection: "judgment",
  claimRefs: [0],
  ...over,
})

const res = (id: string, result: CriterionResult["result"]): CriterionResult => ({ id, result })

describe("scoreRubric", () => {
  it("scores an all-pass rubric as grade A / 100", () => {
    const rubric = [crit({ id: "a", dimension: "conversion" }), crit({ id: "b", dimension: "perf" })]
    const out = scoreRubric(rubric, [res("a", "pass"), res("b", "pass")], { vertical: "barber", reachable: true })
    expect(out.overall).toBe(100)
    expect(out.grade).toBe("A")
    expect(out.dimensionScores.conversion).toBe(100)
  })

  it("masks non-applicable verticals out of the denominator", () => {
    const rubric = [
      crit({ id: "a", dimension: "conversion", verticals: ["*"], weight: 5 }),
      crit({ id: "b", dimension: "conversion", verticals: ["cafe"], weight: 5 }),
    ]
    const results = [res("a", "pass"), res("b", "fail")]
    const barber = scoreRubric(rubric, results, { vertical: "barber", reachable: true })
    const cafe = scoreRubric(rubric, results, { vertical: "cafe", reachable: true })
    expect(barber.dimensionScores.conversion).toBe(100) // b (cafe-only) excluded for barber
    expect(cafe.dimensionScores.conversion).toBe(50) // a pass + b fail, equal weight
  })

  it("treats partial as half credit", () => {
    const rubric = [crit({ id: "a", dimension: "perf", weight: 10 })]
    const out = scoreRubric(rubric, [res("a", "partial")], { vertical: "barber", reachable: true })
    expect(out.dimensionScores.perf).toBe(50)
  })

  it("caps overall at C when cwvPass is false", () => {
    const rubric = [crit({ id: "a", dimension: "perf" })]
    const out = scoreRubric(rubric, [res("a", "pass")], { vertical: "barber", reachable: true, cwvPass: false })
    expect(out.grade).toBe("C")
  })

  it("caps overall at D on a structural flag", () => {
    const rubric = [crit({ id: "a", dimension: "perf" })]
    const out = scoreRubric(rubric, [res("a", "pass")], {
      vertical: "barber",
      reachable: true,
      structuralFlags: { notMobile: true, deadPlatform: false, brokenIa: false },
    })
    expect(out.grade).toBe("D")
  })

  it("maps an A grade to the care-or-decline tier", () => {
    const rubric = [crit({ id: "a", dimension: "conversion" })]
    const out = scoreRubric(rubric, [res("a", "pass")], { vertical: "barber", reachable: true })
    expect(out.tier).toBe("care-or-decline")
  })

  it("returns new-build tier when the site is unreachable", () => {
    const rubric = [crit({ id: "a", dimension: "conversion" })]
    const out = scoreRubric(rubric, [res("a", "fail")], { vertical: "barber", reachable: false })
    expect(out.tier).toBe("new-build")
  })
})
