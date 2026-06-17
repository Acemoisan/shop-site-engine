import type { ScoreSet, CwvResult, PsiProbe } from "../types.js"

interface ParsedPsi extends ScoreSet {
  lcpMs: number | null
  inpMs: number | null
  cls: number | null
  failedAudits: string[]
}

const pct = (v: number | undefined) => (v == null ? 0 : Math.round(v * 100))

export function parsePsi(json: any): ParsedPsi {
  const cats = json?.lighthouseResult?.categories ?? {}
  const audits = json?.lighthouseResult?.audits ?? {}
  const num = (id: string) => {
    const v = audits[id]?.numericValue
    return typeof v === "number" ? v : null
  }
  const failedAudits = Object.values<any>(audits)
    .filter((a) => typeof a?.score === "number" && a.score < 0.9 && a.title)
    .map((a) => a.title as string)
    .slice(0, 10)

  return {
    performance: pct(cats.performance?.score),
    seo: pct(cats.seo?.score),
    accessibility: pct(cats.accessibility?.score),
    bestPractices: pct(cats["best-practices"]?.score),
    lcpMs: num("largest-contentful-paint"),
    inpMs: num("interaction-to-next-paint") ?? num("experimental-interaction-to-next-paint"),
    cls: (() => { const v = audits["cumulative-layout-shift"]?.numericValue; return typeof v === "number" ? v : null })(),
    failedAudits,
  }
}

export function cwvFrom(p: ParsedPsi): CwvResult {
  const pass =
    (p.lcpMs == null || p.lcpMs < 2500) &&
    (p.inpMs == null || p.inpMs <= 200) &&
    (p.cls == null || p.cls < 0.1)
  return { lcpMs: p.lcpMs, inpMs: p.inpMs, cls: p.cls, pass }
}

// PSI runs a full server-side Lighthouse pass; slow sites routinely need 30-60s,
// so the timeout is generous and each strategy retries once before giving up.
export async function fetchPsi(url: string, strategy: "mobile" | "desktop", key: string, timeoutMs = 60000, retries = 1): Promise<ParsedPsi> {
  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed")
  api.searchParams.set("url", url)
  api.searchParams.set("strategy", strategy)
  for (const c of ["performance", "seo", "accessibility", "best-practices"]) api.searchParams.append("category", c)
  if (key) api.searchParams.set("key", key)

  let lastErr: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(api, { signal: controller.signal })
      if (!res.ok) throw new Error(`PSI ${res.status}`)
      return parsePsi(await res.json())
    } catch (e) {
      lastErr = e
    } finally {
      clearTimeout(timer)
    }
  }
  throw lastErr
}

const toScores = (p: ParsedPsi): ScoreSet => ({
  performance: p.performance, seo: p.seo, accessibility: p.accessibility, bestPractices: p.bestPractices,
})

export async function runPsiProbe(url: string, key: string): Promise<PsiProbe> {
  // Mobile and desktop run independently: one strategy timing out must NOT
  // discard a good result from the other (the grade reads mobile primarily).
  const [m, d] = await Promise.allSettled([
    fetchPsi(url, "mobile", key),
    fetchPsi(url, "desktop", key),
  ])
  const mobile = m.status === "fulfilled" ? m.value : null
  const desktop = d.status === "fulfilled" ? d.value : null

  if (!mobile && !desktop) {
    const reason = (m.status === "rejected" && (m.reason as Error)?.message)
      || (d.status === "rejected" && (d.reason as Error)?.message) || "PSI failed"
    return { status: "error", error: String(reason) }
  }

  const primary = mobile ?? desktop! // cwv + failed audits come from mobile when present
  return {
    status: "ok",
    mobile: mobile ? toScores(mobile) : undefined,
    desktop: desktop ? toScores(desktop) : undefined,
    cwv: cwvFrom(primary),
    failedAudits: primary.failedAudits,
  }
}
