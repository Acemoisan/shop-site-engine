import { describe, it, expect } from "vitest"
import { detectStack } from "../src/stack.js"

describe("detectStack", () => {
  it("detects WordPress and flags bloat", () => {
    const links = Array.from({ length: 15 }, (_, i) => `<link rel="stylesheet" href="/wp-content/p${i}.css">`).join("")
    const r = detectStack(`<html><head>${links}</head><body>/wp-includes/</body></html>`)
    expect(r.platform).toBe("wordpress")
    expect(r.legacy).toBe(true)
  })

  it("detects Wix", () => {
    expect(detectStack(`<html><body>static.wixstatic.com</body></html>`).platform).toBe("wix")
  })

  it("detects Astro", () => {
    expect(detectStack(`<html><head><link href="/_astro/x.css"></head></html>`).platform).toBe("astro")
  })

  it("falls back to unknown", () => {
    expect(detectStack(`<html><body>hi</body></html>`).platform).toBe("unknown")
  })
})
