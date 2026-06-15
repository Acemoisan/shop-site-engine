import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { parseSeomator } from "../src/probes/seomator.js"

describe("parseSeomator", () => {
  it("extracts score and grade", () => {
    const json = JSON.parse(readFileSync(new URL("./fixtures/seomator-sample.json", import.meta.url), "utf8"))
    const r = parseSeomator(json)
    expect(r.score).toBeGreaterThanOrEqual(0)
    expect(r.score).toBeLessThanOrEqual(100)
    expect(["A", "B", "C", "D", "F"]).toContain(r.grade)
  })
})
