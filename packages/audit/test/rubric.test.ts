import { describe, it, expect } from "vitest"
import { scoreToGrade, computeGrade, mapTier, type GradeInputs } from "../src/rubric.js"
import type { FeatureKey } from "../src/types.js"

const fullInventory = (val: boolean): Record<FeatureKey, boolean | "error"> => ({
  mobileViewport: val, clickToCall: val, bookingLink: val, hours: val,
  addressOrMap: val, reviews: val, localBusinessJsonLd: val, menuSchema: val,
  https: val, ogTags: val, contactForm: val, favicon: val,
})

const base = (over: Partial<GradeInputs> = {}): GradeInputs => ({
  psiMobilePerf: 95, psiSeo: 95, psiA11y: 95, cwvPass: true,
  seomatorScore: 95, inventory: fullInventory(true),
  structuralFlags: { notMobile: false, deadPlatform: false, brokenIa: false },
  ...over,
})

describe("scoreToGrade", () => {
  it("maps bands", () => {
    expect(scoreToGrade(95)).toBe("A")
    expect(scoreToGrade(82)).toBe("B")
    expect(scoreToGrade(72)).toBe("C")
    expect(scoreToGrade(55)).toBe("D")
    expect(scoreToGrade(20)).toBe("F")
  })
})

describe("computeGrade", () => {
  it("grades a strong site A", () => {
    expect(computeGrade(base()).overall).toBe("A")
  })

  it("CWV failure caps overall at C", () => {
    expect(computeGrade(base({ cwvPass: false })).overall).toBe("C")
  })

  it("structural flag forces at most D (foundation-strength override)", () => {
    const g = computeGrade(base({ structuralFlags: { notMobile: true, deadPlatform: false, brokenIa: false } }))
    expect(g.overall).toBe("D")
  })

  it("marks partial confidence when few probes present", () => {
    const g = computeGrade({
      inventory: fullInventory(true),
      structuralFlags: { notMobile: false, deadPlatform: false, brokenIa: false },
    })
    expect(g.confidence).toBe("partial")
  })
})

describe("mapTier", () => {
  it("unreachable → new-build", () => {
    expect(mapTier({ overall: "F", byCategory: {}, confidence: "partial" }, false, false)).toBe("new-build")
  })
  it("structural → rebuild", () => {
    expect(mapTier({ overall: "C", byCategory: {}, confidence: "high" }, true, true)).toBe("rebuild")
  })
  it("A → care-or-decline", () => {
    expect(mapTier({ overall: "A", byCategory: {}, confidence: "high" }, true, false)).toBe("care-or-decline")
  })
  it("B/C → tune-up", () => {
    expect(mapTier({ overall: "B", byCategory: {}, confidence: "high" }, true, false)).toBe("tune-up")
  })
  it("D/F → rebuild", () => {
    expect(mapTier({ overall: "D", byCategory: {}, confidence: "high" }, true, false)).toBe("rebuild")
  })
})
