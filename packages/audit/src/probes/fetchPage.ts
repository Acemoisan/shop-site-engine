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
  /** Number of fetch attempts made (1 = succeeded first try). */
  attempts?: number
  /** True if the result came from an http:// fallback after https:// failed. */
  httpFallback?: boolean
}

// Realistic desktop-Chrome UA. The previous custom UA tripped bot protection
// (e.g. Cloudflare 403), which made real businesses look unreachable.
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

export interface FetchOpts {
  /** Total attempts before giving up. Default 3. */
  attempts?: number
  /** Delay between attempts, ms. Default 400. */
  retryDelayMs?: number
  /** Injectable fetch (for tests). Defaults to global fetch. */
  fetchImpl?: typeof fetch
  /** Injectable sleep (for tests). */
  sleep?: (ms: number) => Promise<void>
  /** If an https:// URL is unreachable, retry once over http://. Default true. */
  httpFallback?: boolean
}

const defaultSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

/** One URL, with transient-failure retry. No protocol fallback (see fetchHtml). */
async function attemptFetch(url: string, timeoutMs: number, opts: FetchOpts): Promise<PageResult> {
  const attempts = Math.max(1, opts.attempts ?? 3)
  const retryDelayMs = opts.retryDelayMs ?? 400
  const doFetch = opts.fetchImpl ?? fetch
  const sleep = opts.sleep ?? defaultSleep

  let lastError = "fetch failed"
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await doFetch(url, {
        signal: controller.signal,
        redirect: "follow",
        headers: { "user-agent": BROWSER_UA, accept: "text/html,application/xhtml+xml" },
      })
      const html = await res.text()
      // We received a response, so the site exists — reachable is true even for a
      // 403/blocked or 5xx page. `ok` distinguishes a usable 2xx page. This keeps a
      // blocked-but-real business from being misclassified as "no website".
      return { reachable: true, ok: res.ok, status: res.status, finalUrl: res.url || url, html, attempts: attempt }
    } catch (e) {
      // No response at all (DNS failure, connection refused, reset, timeout).
      // Could be transient — retry the remaining attempts before giving up.
      lastError = (e as Error).message
      if (attempt < attempts) await sleep(retryDelayMs)
    } finally {
      clearTimeout(timer)
    }
  }
  // Exhausted all attempts with no response → truly unreachable.
  return { reachable: false, ok: false, status: null, finalUrl: url, html: "", error: lastError, attempts }
}

/**
 * Fetch a page's HTML with reachability semantics, transient-failure retry, and
 * an https→http fallback.
 *
 * A RECEIVED HTTP response (even 403/5xx) is a real, terminal state — the site
 * exists, so we return immediately without retrying. We only retry when fetch
 * THROWS (no response at all): cold-connection resets and transient DNS/network
 * blips. Observed in the wild: some CDNs (e.g. gymshark) reset the very first
 * undici handshake (~70ms "fetch failed") then serve 200 on the next attempt.
 * Without a retry, a healthy site is misclassified as "no website" (new-build).
 *
 * If an https:// URL is unreachable after all retries, we try http:// once.
 * Many of our target prospects (older local shops) have NO SSL — requesting
 * https:// fails outright, which would falsely flag them as "no website". The
 * fallback audits the real (http) site; HTTPS-missing is then correctly recorded
 * as a fix (finalUrl is http://, so the inventory's https check reads false).
 */
export async function fetchHtml(url: string, timeoutMs = 15000, opts: FetchOpts = {}): Promise<PageResult> {
  const primary = await attemptFetch(url, timeoutMs, opts)
  if (primary.reachable || opts.httpFallback === false) return primary
  if (!/^https:\/\//i.test(url)) return primary

  const httpUrl = url.replace(/^https:\/\//i, "http://")
  const fallback = await attemptFetch(httpUrl, timeoutMs, opts)
  if (fallback.reachable) return { ...fallback, httpFallback: true }
  // Both protocols failed → genuinely unreachable; keep the original (https) error.
  return primary
}
