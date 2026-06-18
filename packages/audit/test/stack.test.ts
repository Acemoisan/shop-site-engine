import { describe, it, expect } from "vitest"
import { detectStack } from "../src/stack.js"

describe("detectStack", () => {
  it("detects WordPress and flags bloat by stylesheet count", () => {
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

  it("detects newer builders (GoDaddy, Weebly, Duda)", () => {
    expect(detectStack(`<html><body>x.godaddysites.com</body></html>`).platform).toBe("godaddy")
    expect(detectStack(`<html><head><meta name="generator" content="Weebly"></head></html>`).platform).toBe("weebly")
    expect(detectStack(`<html><body>d1.dudaone.com</body></html>`).platform).toBe("duda")
  })

  it("falls back to unknown", () => {
    expect(detectStack(`<html><body>hi</body></html>`).platform).toBe("unknown")
  })

  it("identifies the WordPress page-builder and treats heavy builders as legacy", () => {
    const r = detectStack(`<html><head></head><body class="elementor-page">/wp-content/ <div class="elementor-frontend"></div></body></html>`)
    expect(r.platform).toBe("wordpress")
    expect(r.builder).toBe("elementor")
    expect(r.legacy).toBe(true) // heavy builder → bloat even with few stylesheets
  })

  it("does not flag native Gutenberg blocks as legacy", () => {
    const r = detectStack(`<html><body>/wp-content/ <div class="wp-block-group"></div></body></html>`)
    expect(r.builder).toBe("gutenberg")
    expect(r.legacy).toBe(false)
  })

  it("only reports a builder on WordPress", () => {
    const r = detectStack(`<html><body>static.wixstatic.com <div class="elementor-x"></div></body></html>`)
    expect(r.platform).toBe("wix")
    expect(r.builder).toBeUndefined()
  })

  it("detects embedded booking, payment, and chat/form tools", () => {
    const html = `<html><body>
      <iframe src="https://calendly.com/shop/30min"></iframe>
      <a href="https://book.squareup.com/appointments">Book</a>
      <script src="https://js.stripe.com/v3"></script>
      <script src="https://embed.tawk.to/abc/default"></script>
    </body></html>`
    const r = detectStack(html)
    expect(r.booking).toEqual(expect.arrayContaining(["calendly", "square-appointments"]))
    expect(r.payments).toContain("stripe")
    expect(r.embeds).toContain("tawk")
  })

  it("returns empty tool arrays when nothing is embedded", () => {
    const r = detectStack(`<html><body>hi</body></html>`)
    expect(r.booking).toEqual([])
    expect(r.payments).toEqual([])
    expect(r.embeds).toEqual([])
  })
})
