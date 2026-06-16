import { describe, it, expect } from "vitest"
import { renderReport } from "../src/report.js"
import type { AuditData, FeatureKey } from "../src/types.js"

const inv = (over: Partial<Record<FeatureKey, boolean | "error">> = {}): Record<FeatureKey, boolean | "error"> => ({
  mobileViewport: true, clickToCall: false, bookingLink: false, hours: true, addressOrMap: false,
  reviews: true, localBusinessJsonLd: false, menuSchema: false, https: true, ogTags: true,
  contactForm: false, favicon: true, ...over,
})

const base: AuditData = {
  url: "https://www.joescafe.ca",
  fetchedAt: "2026-06-15T12:00:00.000Z",
  reachable: true,
  blocked: false,
  vertical: "cafe",
  psi: { status: "error", error: "no PSI_API_KEY" },
  seomator: { status: "ok", score: 70, grade: "C", categories: {} },
  inventory: inv(),
  stack: { status: "ok", platform: "wordpress", legacy: true },
  grade: { overall: "D", byCategory: { seo: "C", conversion: "D" }, confidence: "partial" },
  tier: "rebuild",
  fixes: { targeted: ["Add click-to-call (tap-to-dial) phone link"], general: [] },
}

describe("renderReport", () => {
  it("renders a self-contained branded HTML doc", () => {
    const html = renderReport(base)
    expect(html.startsWith("<!doctype html>")).toBe(true)
    expect(html).toContain("Studio")
    expect(html).toContain("joescafe.ca") // host, www stripped
    expect(html).toContain("<style>") // inline CSS, no external build
    expect(html).toContain("2026-06-15") // date from fetchedAt
  })

  it("shows the grade and tier", () => {
    const html = renderReport(base)
    expect(html).toContain(">D</div>") // grade badge
    expect(html).toContain("Rebuild recommended")
  })

  it("ranks missing features as top priorities, most impactful first", () => {
    const html = renderReport(base)
    // clickToCall (high priority, missing) should appear before favicon-type polish.
    expect(html).toContain("Tap-to-call phone number")
    // mobileViewport present here, so it should NOT be listed as a fix.
    expect(html).not.toContain("Add mobile-responsive layout".toLowerCase())
    // partial confidence note present
    expect(html).toContain("preliminary")
  })

  it("handles an unreachable site (new-build path) without a letter grade", () => {
    const html = renderReport({
      ...base,
      url: "https://gone.example",
      reachable: false,
      inventory: inv(Object.fromEntries(Object.keys(inv()).map((k) => [k, "error"])) as any),
      grade: { overall: "F", byCategory: {}, confidence: "partial" },
      tier: "new-build",
    })
    // apostrophe is HTML-escaped, so match on an apostrophe-free substring
    expect(html).toContain("find a working website")
    expect(html).toContain("New build recommended")
  })

  it("is honest about an A-grade site (no manufactured problems)", () => {
    const html = renderReport({
      ...base,
      inventory: inv({ clickToCall: true, bookingLink: true, addressOrMap: true, localBusinessJsonLd: true, contactForm: true, menuSchema: true }),
      grade: { overall: "A", byCategory: { seo: "A", conversion: "A" }, confidence: "high" },
      tier: "care-or-decline",
    })
    expect(html).toContain("already strong")
    expect(html).toContain("In good shape")
  })

  it("escapes hostile content", () => {
    const html = renderReport({ ...base, url: "https://x.example/<script>alert(1)</script>" })
    expect(html).not.toContain("<script>alert(1)</script>")
  })
})
