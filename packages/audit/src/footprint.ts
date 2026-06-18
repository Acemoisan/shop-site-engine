// Discovery layer — pull the prospect's REAL social presence out of their HTML,
// discarding template/placeholder handles.
//
// Why this exists: builder themes (Wix, Squarespace, GoDaddy…) ship footer social
// icons pre-wired to the BUILDER's own accounts (e.g. twitter.com/wix, @wix,
// linkedin.com/company/wix-com, youtube.com/user/Wix). A naive "are there social
// links?" check both (a) reads those as a real presence and (b) hides the one or
// two REAL profiles in the noise. That's exactly how the Eye Candy Optical audit
// concluded "no socials" when the business actually had an owned Facebook + Instagram.
//
// This is the on-page half of discovery. The WIDER footprint (Google rating +
// review count, profile activity / last-post date, GBP) needs external lookups —
// that's the site-audit skill's "Footprint sweep" step, not deterministic code.

export type SocialPlatform =
  | "facebook" | "instagram" | "x" | "tiktok" | "linkedin" | "youtube" | "pinterest"

export interface SocialsResult {
  /** One real, owned profile per platform — these carry over to the new build. */
  real: Partial<Record<SocialPlatform, string>>
  /** Links that look social but are template defaults / share-intents / assets —
   *  surfaced so scoping says "ignore these" instead of treating them as a presence. */
  placeholders: string[]
}

const HOSTS: [SocialPlatform, RegExp][] = [
  ["facebook", /(^|\.)facebook\.com$/i],
  ["instagram", /(^|\.)instagram\.com$/i],
  ["x", /(^|\.)(twitter\.com|x\.com)$/i],
  ["tiktok", /(^|\.)tiktok\.com$/i],
  ["linkedin", /(^|\.)linkedin\.com$/i],
  ["youtube", /(^|\.)(youtube\.com|youtu\.be)$/i],
  ["pinterest", /(^|\.)pinterest\.[a-z.]+$/i],
]

// Builder/template default handles — a link to one of these is the THEME's account,
// not the client's. The single most important signal this module encodes.
const PLACEHOLDER_HANDLE = /^(wix|wix-com|wixsite|squarespace|godaddy|weebly|duda|shopify|wordpress|webflow)$/i
// First path segment that means "this isn't a profile" (share intents, posts, assets).
const NON_PROFILE_SEG = /^(sharer|share|sharer\.php|dialog|intent|home|login|signup|tr|plugins|pin|embed|widgets|watch|p|reel|reels|explore|hashtag|search|policies|help)$/i
// Script/asset subdomains (SDK, pixels, oEmbed) — never a profile link.
const ASSET_HOST = /^(platform|connect|static|assets?|cdn|widgets|embed|graph|api|developers|business|help)\./i

function classify(u: string): { plat?: SocialPlatform; real?: string; placeholder?: boolean } {
  let host: string, pathname: string
  try { const x = new URL(u); host = x.host.toLowerCase(); pathname = x.pathname } catch { return {} }
  if (ASSET_HOST.test(host)) return {}
  const bare = host.replace(/^www\./, "")
  const plat = HOSTS.find(([, re]) => re.test(bare))?.[0]
  if (!plat) return {}

  const segs = pathname.split("/").filter(Boolean)
  if (segs.length === 0) return { plat, placeholder: true }           // bare platform link
  if (NON_PROFILE_SEG.test(segs[0])) return { plat, placeholder: true }

  // The handle isn't always segs[0]: linkedin /company|in|school/<handle>,
  // youtube /user|channel|c/<handle> (or an @handle).
  let handle = segs[0].replace(/^@/, "")
  if (plat === "linkedin" && /^(company|in|school|pub)$/i.test(segs[0]) && segs[1]) handle = segs[1]
  if (plat === "youtube" && /^(user|channel|c)$/i.test(segs[0]) && segs[1]) handle = segs[1]
  if (PLACEHOLDER_HANDLE.test(handle)) return { plat, placeholder: true }

  return { plat, real: `https://${bare}${pathname.replace(/\/$/, "")}` }
}

export function detectSocials(html: string): SocialsResult {
  const real: Partial<Record<SocialPlatform, string>> = {}
  const placeholders: string[] = []
  const seenReal = new Set<SocialPlatform>()
  const seenUrl = new Set<string>()

  const urls = (html.match(/(?:href|src)\s*=\s*["']([^"'\s]+)["']/gi) || [])
    .map((m) => m.replace(/^[^"']*["']([^"']+)["'].*$/, "$1"))
    .filter((u) => /^https?:\/\//i.test(u))

  for (const url of urls) {
    if (seenUrl.has(url)) continue
    seenUrl.add(url)
    const { plat, real: realUrl, placeholder } = classify(url)
    if (!plat) continue
    if (realUrl && !seenReal.has(plat)) { real[plat] = realUrl; seenReal.add(plat) }
    else if (placeholder) placeholders.push(url)
  }
  return { real, placeholders }
}
