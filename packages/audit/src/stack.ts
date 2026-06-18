// Platform + embedded-tool fingerprinting from a prospect's HTML.
// Deterministic only — every signal is a string/regex match against the fetched
// markup (script src domains, class prefixes, generator meta). This is what tells
// scoping what the client actually uses for booking, payment, forms and chat, so
// we preserve or deliberately replace it instead of guessing. See the site-audit
// skill's "Platform & embedded-tool intelligence" table for how to JUDGE these.

import { detectSocials, type SocialsResult } from "./footprint.js"

export interface StackResult {
  platform: string
  /** WordPress page-builder, when platform is wordpress (the real bloat signal). */
  builder?: string
  /** Online-booking/scheduling tools embedded on the page. */
  booking: string[]
  /** Payment / checkout tools embedded on the page. */
  payments: string[]
  /** Chat widgets + third-party form/email-capture embeds. */
  embeds: string[]
  /** Real owned social profiles (placeholder/template handles discarded). The
   *  on-page half of footprint discovery — see `footprint.ts`. */
  socials: SocialsResult
  /** WordPress + heavy page-builder OR many stylesheets → page-builder bloat. */
  legacy: boolean
}

/** [label, ...needles] — first table whose any needle is found in lowercased HTML wins.
 *  Order matters for `platform` (most specific first). */
type Sig = [string, ...string[]]

// Heavy page-builders that, on WordPress, reliably mean a bloated DOM/CSS payload.
const HEAVY_BUILDERS = new Set(["elementor", "divi", "wpbakery", "beaver"])

const BUILDER_SIGS: Sig[] = [
  ["elementor", "elementor-", "/elementor/", "elementor-frontend"],
  ["divi", "et_pb_", "et-pb-", "divi-"],
  ["wpbakery", "js_composer", "wpb_", "vc_row"],
  ["beaver", "fl-builder", "fl-module"],
  ["gutenberg", "wp-block-"], // native blocks — light; not a "heavy" builder
]

const BOOKING_SIGS: Sig[] = [
  ["calendly", "calendly.com"],
  ["acuity", "acuityscheduling.com", "squarespacescheduling", "squarespace-scheduling"],
  ["square-appointments", "squareup.com/appointments", "book.squareup", "squareup.com/book"],
  ["booksy", "booksy.com"],
  ["fresha", "fresha.com"],
  ["vagaro", "vagaro.com"],
  ["setmore", "setmore.com", "my.setmore"],
  ["mindbody", "mindbodyonline.com", "mindbody"],
  ["janeapp", "janeapp.com", ".janeapp"],
  ["opentable", "opentable.com"],
  ["resy", "resy.com"],
]

const PAYMENT_SIGS: Sig[] = [
  ["stripe", "js.stripe.com", "checkout.stripe.com"],
  ["square", "squarecdn.com", "web.squarecdn", "squareup.com/payments"],
  ["paypal", "paypal.com/sdk", "paypalobjects.com", "paypal-button"],
  ["shopify-checkout", "cdn.shopify.com", "shopify.com/checkout"],
  ["woocommerce", "woocommerce", "wc-block", "/wc-ajax/"],
  ["clover", "clover.com"],
]

const EMBED_SIGS: Sig[] = [
  ["tawk", "tawk.to"],
  ["intercom", "intercom.io", "widget.intercom"],
  ["messenger-chat", "connect.facebook.net/en_us/sdk/xfbml.customerchat", "fb-customerchat"],
  ["jotform", "jotform.com", "form.jotform"],
  ["typeform", "typeform.com"],
  ["wufoo", "wufoo.com"],
  ["hubspot", "js.hsforms.net", "hs-scripts.com", "hsforms.com"],
  ["mailchimp", "list-manage.com", "chimpstatic.com"],
]

/** Collect every label whose any needle appears in the lowercased HTML. */
function matchAll(h: string, sigs: Sig[]): string[] {
  return sigs.filter(([, ...needles]) => needles.some((n) => h.includes(n))).map(([label]) => label)
}

export function detectStack(html: string): StackResult {
  const h = html.toLowerCase()
  const gen = (html.match(/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)/i)?.[1] || "").toLowerCase()

  let platform = "unknown"
  if (gen.includes("wordpress") || h.includes("/wp-content/") || h.includes("/wp-includes/")) platform = "wordpress"
  else if (h.includes("wixstatic.com") || h.includes("_wixcss") || h.includes("wix.com")) platform = "wix"
  else if (gen.includes("squarespace") || h.includes("squarespace.com")) platform = "squarespace"
  else if (h.includes("cdn.shopify.com") || h.includes("shopify.com")) platform = "shopify"
  else if (gen.includes("webflow") || h.includes(".webflow.io")) platform = "webflow"
  else if (gen.includes("duda") || h.includes("dudamobile.com") || h.includes("d1.dudaone")) platform = "duda"
  else if (h.includes("godaddysites.com") || h.includes("_pomt_") || gen.includes("website builder")) platform = "godaddy"
  else if (gen.includes("weebly") || h.includes("weebly.com") || h.includes("editmysite.com")) platform = "weebly"
  else if (gen.includes("joomla")) platform = "joomla"
  else if (gen.includes("drupal") || h.includes("/sites/default/files/")) platform = "drupal"
  else if (gen.includes("astro") || h.includes("/_astro/")) platform = "astro"

  // Page-builder only meaningful on WordPress; first match wins (most-specific order).
  const builder = platform === "wordpress" ? matchAll(h, BUILDER_SIGS)[0] : undefined

  const booking = matchAll(h, BOOKING_SIGS)
  const payments = matchAll(h, PAYMENT_SIGS)
  const embeds = matchAll(h, EMBED_SIGS)
  const socials = detectSocials(html)

  const stylesheetCount = (html.match(/<link[^>]+stylesheet/gi) || []).length
  const legacy =
    platform === "wordpress" && ((builder !== undefined && HEAVY_BUILDERS.has(builder)) || stylesheetCount > 12)

  return { platform, builder, booking, payments, embeds, socials, legacy }
}
