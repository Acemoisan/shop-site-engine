import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { parseSeomator, seomatorErrorMessage } from "../src/probes/seomator.js"

describe("parseSeomator", () => {
  it("extracts score and grade", () => {
    const json = JSON.parse(readFileSync(new URL("./fixtures/seomator-sample.json", import.meta.url), "utf8"))
    const r = parseSeomator(json)
    expect(r.score).toBeGreaterThanOrEqual(0)
    expect(r.score).toBeLessThanOrEqual(100)
    expect(["A", "B", "C", "D", "F"]).toContain(r.grade)
  })
})

describe("seomatorErrorMessage", () => {
  it("labels an execFile timeout-kill distinctly", () => {
    // execFile reports a timeout via killed:true + SIGTERM, not a message.
    expect(seomatorErrorMessage({ killed: true, signal: "SIGTERM" }, 45000)).toBe("seomator timeout after 45000ms")
    expect(seomatorErrorMessage({ signal: "SIGTERM" }, 45000)).toBe("seomator timeout after 45000ms")
  })

  it("passes through a normal error message", () => {
    expect(seomatorErrorMessage(new Error("boom"), 45000)).toBe("boom")
    expect(seomatorErrorMessage("weird", 45000)).toBe("weird")
  })
})
