import { describe, it, expect } from "vitest"
import { renderReport } from "../src/report.js"
import type { AuditData, FeatureKey } from "../src/types.js"

/** Build a minimal valid AuditData fixture with sensible defaults. */
function makeAuditData(overrides: Partial<AuditData> = {}): AuditData {
  const allTrue = (): Record<FeatureKey, boolean | "error"> => ({
    mobileViewport: true, clickToCall: true, bookingLink: true, hours: true,
    addressOrMap: true, reviews: true, localBusinessJsonLd: true, menuSchema: true,
    https: true, ogTags: true, contactForm: true, favicon: true,
  })

  const base: AuditData = {
    url: "https://example.com",
    fetchedAt: "2026-06-15T00:00:00Z",
    reachable: true,
    blocked: false,
    psi: { status: "ok", mobile: { performance: 80, seo: 90, accessibility: 85, bestPractices: 90 } },
    seomator: { status: "ok", score: 75, grade: "B" },
    inventory: allTrue(),
    stack: { status: "ok", platform: "wordpress", legacy: false },
    grade: { overall: "B", byCategory: {}, confidence: "high" },
    tier: "tune-up",
    fixes: { targeted: [], general: [] },
  }

  return { ...base, ...overrides }
}

describe("renderReport", () => {
  it("normal graded report (grade B, some missing features)", () => {
    const data = makeAuditData({
      grade: { overall: "B", byCategory: {}, confidence: "high" },
      inventory: {
        mobileViewport: false,
        clickToCall: false,
        bookingLink: true,
        hours: true,
        addressOrMap: true,
        reviews: true,
        localBusinessJsonLd: true,
        menuSchema: true,
        https: true,
        ogTags: true,
        contactForm: true,
        favicon: true,
      },
    })

    const html = renderReport(data, "Test Shop")

    // Self-contained checks
    expect(html).toContain("<style>")
    expect(html).not.toMatch(/<link[^>]+rel=["']stylesheet["']/i)
    expect(html).not.toContain('http-equiv="refresh"')

    // Structure
    expect(html).toContain("Website &amp; Online Presence Audit")

    // Grade letter appears (in badge)
    expect(html).toContain(">B<")

    // Copy for a missing feature (mobileViewport rank 1)
    expect(html).toContain("The site isn't built to fit phone screens.")

    // Soft CTA
    expect(html).toContain("I build fast, mobile-first sites for Calgary shops")
  })

  it("reachable:false → new-build message, no feature issue copy", () => {
    const data = makeAuditData({
      reachable: false,
      blocked: false,
      grade: { overall: "F", byCategory: {}, confidence: "partial" },
      tier: "new-build",
      inventory: {
        mobileViewport: false, clickToCall: false, bookingLink: false,
        hours: false, addressOrMap: false, reviews: false,
        localBusinessJsonLd: false, menuSchema: false, https: false,
        ogTags: false, contactForm: false, favicon: false,
      },
    })

    const html = renderReport(data)

    expect(html).toContain("couldn't find a working website")

    // Should NOT contain any per-feature issue copy
    expect(html).not.toContain("The site isn't built to fit phone screens.")
    expect(html).not.toContain("The phone number isn't tap-to-call.")
    expect(html).not.toContain("There's no obvious way to book online.")
  })

  it("blocked:true → blocked message, no grade-based issue list", () => {
    const data = makeAuditData({
      reachable: true,
      blocked: true,
      grade: { overall: "F", byCategory: {}, confidence: "partial" },
      tier: "blocked-unknown",
      inventory: {
        mobileViewport: "error", clickToCall: "error", bookingLink: "error",
        hours: "error", addressOrMap: "error", reviews: "error",
        localBusinessJsonLd: "error", menuSchema: "error", https: "error",
        ogTags: "error", contactForm: "error", favicon: "error",
      },
    })

    const html = renderReport(data)

    expect(html).toContain("blocked our automated check")

    // No grade badge rendered for blocked
    expect(html).not.toContain("At a Glance")
    expect(html).not.toContain("Top 3 Issues")

    // No feature issue copy
    expect(html).not.toContain("The site isn't built to fit phone screens.")
  })

  it("grade A with all features present → 'great shape', no manufactured issues", () => {
    const data = makeAuditData({
      grade: { overall: "A", byCategory: {}, confidence: "high" },
      inventory: {
        mobileViewport: true, clickToCall: true, bookingLink: true,
        hours: true, addressOrMap: true, reviews: true,
        localBusinessJsonLd: true, menuSchema: true, https: true,
        ogTags: true, contactForm: true, favicon: true,
      },
    })

    const html = renderReport(data)

    expect(html).toContain("great shape")

    // None of the feature-specific issue copy for features that are true
    expect(html).not.toContain("The site isn't built to fit phone screens.")
    expect(html).not.toContain("The phone number isn't tap-to-call.")
    expect(html).not.toContain("There's no obvious way to book online.")
    expect(html).not.toContain("Opening hours aren't shown on the site.")
    expect(html).not.toContain("No address or map on the page.")
    expect(html).not.toContain("No LocalBusiness structured data.")
  })

  it("esc() escapes XSS — shopName with <script> is not rendered unescaped", () => {
    const data = makeAuditData()
    const html = renderReport(data, "<script>alert('xss')</script>")

    // The raw <script>alert must not appear verbatim
    expect(html).not.toContain("<script>alert")
    // But the escaped version should be present (or at least no raw angle bracket)
    expect(html).not.toMatch(/<script>alert/)
  })
})
