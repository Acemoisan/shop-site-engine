export interface StackResult { platform: string; legacy: boolean }

export function detectStack(html: string): StackResult {
  const h = html.toLowerCase()
  const gen = (html.match(/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)/i)?.[1] || "").toLowerCase()

  let platform = "unknown"
  if (gen.includes("wordpress") || h.includes("/wp-content/") || h.includes("/wp-includes/")) platform = "wordpress"
  else if (h.includes("wixstatic.com") || h.includes("_wixcss") || h.includes("wix.com")) platform = "wix"
  else if (gen.includes("squarespace") || h.includes("squarespace.com")) platform = "squarespace"
  else if (h.includes("cdn.shopify.com") || h.includes("shopify.com")) platform = "shopify"
  else if (gen.includes("webflow") || h.includes(".webflow.io")) platform = "webflow"
  else if (gen.includes("astro") || h.includes("/_astro/")) platform = "astro"

  const stylesheetCount = (html.match(/<link[^>]+stylesheet/gi) || []).length
  const legacy = platform === "wordpress" && stylesheetCount > 12

  return { platform, legacy }
}
