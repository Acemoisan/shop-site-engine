export interface PageResult {
  /** True if the server returned an HTTP response at all (the site EXISTS). */
  reachable: boolean
  /** True only for a 2xx response — the HTML is the real page, not an error/challenge page. */
  ok: boolean
  /** HTTP status code, or null if no response was received (network/DNS failure). */
  status: number | null
  finalUrl: string
  html: string
  error?: string
}

// Realistic desktop-Chrome UA. The previous custom UA tripped bot protection
// (e.g. Cloudflare 403), which made real businesses look unreachable.
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

export async function fetchHtml(url: string, timeoutMs = 15000): Promise<PageResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "user-agent": BROWSER_UA, accept: "text/html,application/xhtml+xml" },
    })
    const html = await res.text()
    // We received a response, so the site exists — reachable is true even for a
    // 403/blocked or 5xx page. `ok` distinguishes a usable 2xx page. This keeps a
    // blocked-but-real business from being misclassified as "no website".
    return { reachable: true, ok: res.ok, status: res.status, finalUrl: res.url || url, html }
  } catch (e) {
    // No response at all (DNS failure, connection refused, timeout) → truly unreachable.
    return { reachable: false, ok: false, status: null, finalUrl: url, html: "", error: (e as Error).message }
  } finally {
    clearTimeout(timer)
  }
}
