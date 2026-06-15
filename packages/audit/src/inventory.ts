import type { FeatureKey } from "./types.js"

export function inventoryFromHtml(html: string, url: string): Record<FeatureKey, boolean> {
  const lower = html.toLowerCase()
  return {
    mobileViewport: /<meta[^>]+name=["']viewport["']/i.test(html),
    clickToCall: /href=["']tel:/i.test(html),
    bookingLink: /(book|appointment|reserve|schedule|fresha|calendly|squareup|opentable|booksy|setmore)/i.test(lower),
    hours: /(hours|monday|tuesday|open today|opening times|mon[\s\-–:])/i.test(lower),
    addressOrMap: /(google\.[a-z.]+\/maps|maps\.app|<address|street|avenue|\bave\b|\bst\b\s)/i.test(lower),
    reviews: /(review|testimonial|★|rating|\bstars?\b|google reviews)/i.test(lower),
    localBusinessJsonLd: /"@type"\s*:\s*"[a-z]*(business|restaurant|salon|barber|cafe|store|shop)"/i.test(html),
    menuSchema: /"@type"\s*:\s*"menu"/i.test(html),
    https: url.startsWith("https://"),
    ogTags: /<meta[^>]+property=["']og:/i.test(html),
    contactForm: /<form/i.test(html),
    favicon: /<link[^>]+rel=["'][^"']*icon/i.test(html),
  }
}
