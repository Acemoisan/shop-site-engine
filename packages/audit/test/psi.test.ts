import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { parsePsi, cwvFrom } from "../src/probes/psi.js"

describe("parsePsi", () => {
  const json = JSON.parse(readFileSync(new URL("./fixtures/psi-sample.json", import.meta.url), "utf8"))

  it("extracts category scores as 0-100 ints", () => {
    const r = parsePsi(json)
    expect(r.performance).toBe(45)
    expect(r.seo).toBe(82)
    expect(r.accessibility).toBe(76)
    expect(r.bestPractices).toBe(67)
  })

  it("extracts CWV numeric values", () => {
    const r = parsePsi(json)
    expect(r.lcpMs).toBe(4200)
    expect(r.inpMs).toBe(260)
    expect(r.cls).toBe(0.21)
  })

  it("lists failed audits and excludes passing ones", () => {
    const r = parsePsi(json)
    expect(r.failedAudits).toContain("Largest Contentful Paint")
    expect(r.failedAudits).toContain("Properly size images")
    expect(r.failedAudits).not.toContain("Minify CSS")
    expect(r.failedAudits).toHaveLength(4)
  })

  it("computes CWV pass=false when LCP/CLS exceed thresholds", () => {
    expect(cwvFrom(parsePsi(json)).pass).toBe(false)
  })
})
