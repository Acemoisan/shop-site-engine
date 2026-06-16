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

    const r = await fetchHtml("https://dead.example", 15000, { attempts: 3, httpFallback: false, fetchImpl, sleep: noSleep })
    expect(r.reachable).toBe(false)
    expect(r.error).toBe("ENOTFOUND")
    expect(calls).toBe(3)
  })

  it("falls back to http:// when https:// is unreachable (no-SSL prospects)", async () => {
    const seen: string[] = []
    const fetchImpl = (async (u: string) => {
      seen.push(u)
      if (u.startsWith("https://")) throw new Error("no TLS")
      return res(200, "<html><body>http site</body></html>")
    }) as unknown as typeof fetch

    const r = await fetchHtml("https://oldshop.example", 15000, { attempts: 2, fetchImpl, sleep: noSleep })
    expect(r.reachable).toBe(true)
    expect(r.httpFallback).toBe(true)
    expect(r.finalUrl).toContain("http://oldshop.example")
    expect(seen.some((u) => u.startsWith("https://"))).toBe(true)
    expect(seen.some((u) => u.startsWith("http://"))).toBe(true)
  })

  it("does NOT fall back when httpFallback is disabled", async () => {
    const seen: string[] = []
    const fetchImpl = (async (u: string) => { seen.push(u); throw new Error("no TLS") }) as unknown as typeof fetch

    const r = await fetchHtml("https://oldshop.example", 15000, { attempts: 1, httpFallback: false, fetchImpl, sleep: noSleep })
    expect(r.reachable).toBe(false)
    expect(seen.every((u) => u.startsWith("https://"))).toBe(true)
  })

  it("does not fall back for a non-https URL", async () => {
    const seen: string[] = []
    const fetchImpl = (async (u: string) => { seen.push(u); throw new Error("down") }) as unknown as typeof fetch

    const r = await fetchHtml("http://plain.example", 15000, { attempts: 1, fetchImpl, sleep: noSleep })
    expect(r.reachable).toBe(false)
    expect(seen).toEqual(["http://plain.example"]) // single attempt, no protocol switch
  })
})
