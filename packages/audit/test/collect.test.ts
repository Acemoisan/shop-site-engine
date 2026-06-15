import { describe, it, expect } from "vitest"
import { assembleAudit } from "../src/collect.js"
import type { FeatureKey } from "../src/types.js"

const inv = (v: boolean): Record<FeatureKey, boolean | "error"> => ({
  mobileViewport: v, clickToCall: v, bookingLink: v, hours: v, addressOrMap: v, reviews: v,
  localBusinessJsonLd: v, menuSchema: v, https: v, ogTags: v, contactForm: v, favicon: v,
})

describe("assembleAudit", () => {
  it("still grades when PSI failed (graceful degradation)", () => {
    const data = assembleAudit({
      url: "https://x.example",
      fetchedAt: "2026-06-15T00:00:00Z",
      reachable: true,
      psi: { status: "error", error: "timeout" },
      seomator: { status: "ok", score: 60, grade: "D", categories: {} },
      inventory: inv(false),
      stack: { status: "ok", platform: "wordpress", legacy: true },
    })
    expect(data.grade.confidence).toBe("partial")
    expect(["D", "F"]).toContain(data.grade.overall)
    expect(data.tier).toBeDefined()
  })

  it("unreachable site → new-build tier", () => {
    const data = assembleAudit({
      url: "https://dead.example",
      fetchedAt: "2026-06-15T00:00:00Z",
      reachable: false,
      psi: { status: "error" }, seomator: { status: "error" },
      inventory: inv(false), stack: { status: "error" },
    })
    expect(data.tier).toBe("new-build")
  })
})
