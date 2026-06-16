import { describe, it, expect } from "vitest"
import { fetchHtml } from "../src/probes/fetchPage.js"

const res = (status: number, body = "<html></html>") =>
  new Response(body, { status })

const noSleep = async () => {}

describe("fetchHtml retry semantics", () => {
  it("retries a thrown network error and succeeds on a later attempt", async () => {
    let calls = 0
    const fetchImpl = (async () => {
      calls++
      if (calls < 2) throw new Error("fetch failed") // cold-connection reset
      return res(200, "<html><body>ok</body></html>")
    }) as unknown as typeof fetch

    const r = await fetchHtml("https://x.example", 15000, { fetchImpl, sleep: noSleep })
    expect(r.reachable).toBe(true)
    expect(r.ok).toBe(true)
    expect(r.attempts).toBe(2)
    expect(calls).toBe(2)
  })

  it("does NOT retry a received HTTP response (403 is terminal)", async () => {
    let calls = 0
    const fetchImpl = (async () => { calls++; return res(403) }) as unknown as typeof fetch

    const r = await fetchHtml("https://blocked.example", 15000, { fetchImpl, sleep: noSleep })
    expect(r.reachable).toBe(true) // server responded → site exists
    expect(r.ok).toBe(false)       // ...but not a usable page → blocked
    expect(r.status).toBe(403)
    expect(calls).toBe(1)          // no retry on a real response
  })

  it("gives up after all attempts on persistent failure → unreachable", async () => {
    let calls = 0
    const fetchImpl = (async () => { calls++; throw new Error("ENOTFOUND") }) as unknown as typeof fetch

    const r = await fetchHtml("https://dead.example", 15000, { attempts: 3, fetchImpl, sleep: noSleep })
    expect(r.reachable).toBe(false)
    expect(r.error).toBe("ENOTFOUND")
    expect(calls).toBe(3)
  })
})
