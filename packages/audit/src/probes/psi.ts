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

export async function fetchPsi(url: string, strategy: "mobile" | "desktop", key: string, timeoutMs = 30000): Promise<ParsedPsi> {
  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed")
  api.searchParams.set("url", url)
  api.searchParams.set("strategy", strategy)
  for (const c of ["performance", "seo", "accessibility", "best-practices"]) api.searchParams.append("category", c)
  if (key) api.searchParams.set("key", key)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(api, { signal: controller.signal })
    if (!res.ok) throw new Error(`PSI ${res.status}`)
    return parsePsi(await res.json())
  } finally {
    clearTimeout(timer)
  }
}

export async function runPsiProbe(url: string, key: string): Promise<PsiProbe> {
  try {
    const [mobile, desktop] = await Promise.all([
      fetchPsi(url, "mobile", key),
      fetchPsi(url, "desktop", key),
    ])
    const toScores = (p: ParsedPsi): ScoreSet => ({
      performance: p.performance, seo: p.seo, accessibility: p.accessibility, bestPractices: p.bestPractices,
    })
    return { status: "ok", mobile: toScores(mobile), desktop: toScores(desktop), cwv: cwvFrom(mobile), failedAudits: mobile.failedAudits }
  } catch (e) {
    return { status: "error", error: (e as Error).message }
  }
}
