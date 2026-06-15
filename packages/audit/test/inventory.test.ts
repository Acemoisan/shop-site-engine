import { describe, it, expect } from "vitest"
import { inventoryFromHtml } from "../src/inventory.js"

describe("inventoryFromHtml", () => {
  it("detects present features", () => {
    const html = `
      <html><head>
        <meta name="viewport" content="width=device-width">
        <meta property="og:title" content="Joe's">
        <link rel="icon" href="/fav.ico">
        <script type="application/ld+json">{"@type":"BarberShop"}</script>
      </head><body>
        <a href="tel:+14035551234">Call</a>
        <a href="https://fresha.com/joe">Book</a>
        <p>Hours: Monday 9-5</p>
        <a href="https://google.com/maps/joe">Find us</a>
        <div class="reviews">★★★★★ testimonial</div>
        <form action="/contact"></form>
      </body></html>`
    const inv = inventoryFromHtml(html, "https://joe.example")
    expect(inv.mobileViewport).toBe(true)
    expect(inv.clickToCall).toBe(true)
    expect(inv.bookingLink).toBe(true)
    expect(inv.hours).toBe(true)
    expect(inv.addressOrMap).toBe(true)
    expect(inv.reviews).toBe(true)
    expect(inv.localBusinessJsonLd).toBe(true)
    expect(inv.https).toBe(true)
    expect(inv.ogTags).toBe(true)
    expect(inv.contactForm).toBe(true)
    expect(inv.favicon).toBe(true)
  })

  it("detects absent features and http", () => {
    const inv = inventoryFromHtml("<html><body>nothing</body></html>", "http://bare.example")
    expect(inv.mobileViewport).toBe(false)
    expect(inv.clickToCall).toBe(false)
    expect(inv.bookingLink).toBe(false)
    expect(inv.https).toBe(false)
    expect(inv.localBusinessJsonLd).toBe(false)
  })
})
