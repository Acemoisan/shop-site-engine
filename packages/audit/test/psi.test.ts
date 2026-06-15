import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { parsePsi } from "../src/probes/psi.js"

describe("parsePsi", () => {
  it("extracts scores and CWV from a PSI response", () => {
    const json = JSON.parse(readFileSync(new URL("./fixtures/psi-sample.json", import.meta.url), "utf8"))
    const r = parsePsi(json)
    expect(r.performance).toBeGreaterThanOrEqual(0)
    expect(r.performance).toBeLessThanOrEqual(100)
    expect(typeof r.cls === "number" || r.cls === null).toBe(true)
    expect(Array.isArray(r.failedAudits)).toBe(true)
  })
})
