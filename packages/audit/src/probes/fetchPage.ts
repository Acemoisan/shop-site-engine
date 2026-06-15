export interface PageResult {
  reachable: boolean
  finalUrl: string
  html: string
  error?: string
}

export async function fetchHtml(url: string, timeoutMs = 15000): Promise<PageResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "user-agent": "Studio0rbit-Audit/1.0 (+https://studio0rbit.ca)" },
    })
    const html = await res.text()
    return { reachable: res.ok, finalUrl: res.url || url, html }
  } catch (e) {
    return { reachable: false, finalUrl: url, html: "", error: (e as Error).message }
  } finally {
    clearTimeout(timer)
  }
}
