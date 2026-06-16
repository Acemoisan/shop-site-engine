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
    expect(data.blocked).toBe(false)
  })

  it("blocked site (reachable but no usable page) → blocked-unknown tier", () => {
    const data = assembleAudit({
      url: "https://blocked.example",
      fetchedAt: "2026-06-15T00:00:00Z",
      reachable: true,
      blocked: true,
      psi: { status: "error", error: "blocked (HTTP 403)" },
      seomator: { status: "error", error: "blocked (HTTP 403)" },
      inventory: inv(false), // not inspected — caller passes all-error inventory
      stack: { status: "error", error: "blocked (HTTP 403)" },
    })
    // A blocked, reachable site must NOT be graded as a real site or called a
    // new build — it's flagged for manual review.
    expect(data.blocked).toBe(true)
    expect(data.tier).toBe("blocked-unknown")
  })

  it("defaults blocked to false when omitted (back-compat)", () => {
    const data = assembleAudit({
      url: "https://x.example",
      fetchedAt: "2026-06-15T00:00:00Z",
      reachable: true,
      psi: { status: "error" }, seomator: { status: "error" },
      inventory: inv(true), stack: { status: "ok", platform: "astro", legacy: false },
    })
    expect(data.blocked).toBe(false)
    expect(data.tier).not.toBe("blocked-unknown")
  })
})
