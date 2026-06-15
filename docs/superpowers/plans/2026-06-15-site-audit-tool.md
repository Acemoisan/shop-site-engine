# Site-Audit Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deterministic `packages/audit` collector that scans any URL into a typed `AuditData` (scores, feature inventory, computed A–F grade, engagement tier), plus a `site-audit` skill that turns that data into a branded 1-page HTML audit.

**Architecture:** Code owns the facts — a pure-TypeScript collector runs four probes (PSI API, SEOmator CLI, DOM feature inventory, tech-stack heuristic), degrades gracefully on any probe failure, and computes the grade/tier from a versioned rubric. Claude (the skill) only ranks issues, writes prose, and renders the HTML — it never re-derives scores.

**Tech Stack:** TypeScript (ESM), Node 24, `tsx` (run TS directly), Vitest (tests), PageSpeed Insights REST API, `@seomator/seo-audit` CLI, Astro (HTML render). Per spec `docs/superpowers/specs/2026-06-15-site-audit-tool-design.md`.

---

## File structure

```
packages/audit/
  package.json            # @studio0rbit/audit, bin: site-audit, deps
  tsconfig.json
  vitest.config.ts
  src/
    types.ts              # AuditData + all sub-types (single source of truth)
    inventory.ts          # inventoryFromHtml(html,url) — pure presence map
    stack.ts              # detectStack(html) — pure platform heuristic
    rubric.ts             # scoreToGrade, computeGrade, mapTier (versioned)
    probes/
      psi.ts              # parsePsi (pure) + fetchPsi (network)
      seomator.ts         # parseSeomator (pure) + runSeomator (CLI)
      fetchPage.ts        # fetchHtml(url) — reachability + HTML
    collect.ts            # orchestrate probes → AuditData (graceful)
    cli.ts                # argv → collect → write JSON
  test/
    fixtures/             # saved HTML + PSI/SEOmator JSON
    inventory.test.ts
    stack.test.ts
    rubric.test.ts
    psi.test.ts
    seomator.test.ts
    collect.test.ts
.claude/skills/site-audit/
    SKILL.md              # the judgment + writeup skill
sites/audit-report/        # Astro app that renders AuditData → branded 1-page HTML
```

**Boundaries:** pure logic (`inventory`, `stack`, `rubric`, the `parse*` halves of probes) is unit-tested with fixtures — no network. Network halves (`fetch*`, `run*`) get one real-URL smoke test. `collect` is tested for graceful degradation with stubbed probes.

---

## Task 1: Scaffold `packages/audit`

**Files:**
- Create: `packages/audit/package.json`
- Create: `packages/audit/tsconfig.json`
- Create: `packages/audit/vitest.config.ts`
- Create: `packages/audit/src/types.ts`

- [ ] **Step 1: Create `packages/audit/package.json`**

```json
{
  "name": "@studio0rbit/audit",
  "version": "0.0.0",
  "type": "module",
  "bin": { "site-audit": "./src/cli.ts" },
  "scripts": {
    "test": "vitest run",
    "site-audit": "tsx src/cli.ts"
  },
  "dependencies": {
    "tsx": "^4.19.0"
  },
  "devDependencies": {
    "vitest": "^2.1.0",
    "typescript": "^5.9.0"
  }
}
```

- [ ] **Step 2: Create `packages/audit/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["src", "test"]
}
```

- [ ] **Step 3: Create `packages/audit/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: { environment: "node", include: ["test/**/*.test.ts"] },
})
```

- [ ] **Step 4: Create `packages/audit/src/types.ts`**

```ts
export type Grade = "A" | "B" | "C" | "D" | "F"
export type ProbeStatus = "ok" | "error"
export type Tier = "new-build" | "rebuild" | "tune-up" | "care-or-decline"

export interface ScoreSet {
  performance: number
  seo: number
  accessibility: number
  bestPractices: number
}

export interface CwvResult {
  lcpMs: number | null
  inpMs: number | null
  cls: number | null
  pass: boolean
}

export interface PsiProbe {
  status: ProbeStatus
  error?: string
  mobile?: ScoreSet
  desktop?: ScoreSet
  cwv?: CwvResult
  failedAudits?: string[]
}

export interface SeomatorProbe {
  status: ProbeStatus
  error?: string
  score?: number
  grade?: Grade
  categories?: Record<string, number>
}

export type FeatureKey =
  | "mobileViewport" | "clickToCall" | "bookingLink" | "hours"
  | "addressOrMap" | "reviews" | "localBusinessJsonLd" | "menuSchema"
  | "https" | "ogTags" | "contactForm" | "favicon"

export interface StackProbe {
  status: ProbeStatus
  error?: string
  platform?: string
  legacy?: boolean
}

export interface GradeResult {
  overall: Grade
  byCategory: Record<string, Grade>
  confidence: "high" | "partial"
}

export interface AuditData {
  url: string
  fetchedAt: string
  reachable: boolean
  vertical?: string
  psi: PsiProbe
  seomator: SeomatorProbe
  inventory: Record<FeatureKey, boolean | "error">
  stack: StackProbe
  grade: GradeResult
  tier: Tier
  fixes: { targeted: string[]; general: string[] }
}
```

- [ ] **Step 5: Install and verify tooling**

Run: `cd packages/audit && pnpm install`
Then: `cd packages/audit && pnpm vitest run`
Expected: vitest runs, reports "No test files found" (exit 0 or "no tests" — acceptable at this stage).

- [ ] **Step 6: Commit**

```bash
git add packages/audit/package.json packages/audit/tsconfig.json packages/audit/vitest.config.ts packages/audit/src/types.ts pnpm-lock.yaml
git commit -m "feat(audit): scaffold collector package + AuditData types"
```

---

## Task 2: Feature inventory (pure)

**Files:**
- Create: `packages/audit/src/inventory.ts`
- Test: `packages/audit/test/inventory.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest"
import { inventoryFromHtml } from "../src/inventory.js"

describe("inventoryFromHtml", () => {
  it("detects present features", () => {
    const html = `
      <html><head>
        <meta name="viewport" content="width=device-width">
        <meta property="og:title" content="Joe's">
        <link rel="icon" href="/fav.ico">
        <script type="application/ld+json">{"@type":"BarberShop"}</script>
      </head><body>
        <a href="tel:+14035551234">Call</a>
        <a href="https://fresha.com/joe">Book</a>
        <p>Hours: Monday 9-5</p>
        <a href="https://google.com/maps/joe">Find us</a>
        <div class="reviews">★★★★★ testimonial</div>
        <form action="/contact"></form>
      </body></html>`
    const inv = inventoryFromHtml(html, "https://joe.example")
    expect(inv.mobileViewport).toBe(true)
    expect(inv.clickToCall).toBe(true)
    expect(inv.bookingLink).toBe(true)
    expect(inv.hours).toBe(true)
    expect(inv.addressOrMap).toBe(true)
    expect(inv.reviews).toBe(true)
    expect(inv.localBusinessJsonLd).toBe(true)
    expect(inv.https).toBe(true)
    expect(inv.ogTags).toBe(true)
    expect(inv.contactForm).toBe(true)
    expect(inv.favicon).toBe(true)
  })

  it("detects absent features and http", () => {
    const inv = inventoryFromHtml("<html><body>nothing</body></html>", "http://bare.example")
    expect(inv.mobileViewport).toBe(false)
    expect(inv.clickToCall).toBe(false)
    expect(inv.bookingLink).toBe(false)
    expect(inv.https).toBe(false)
    expect(inv.localBusinessJsonLd).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/audit && pnpm vitest run test/inventory.test.ts`
Expected: FAIL — cannot find module `../src/inventory.js`.

- [ ] **Step 3: Write minimal implementation**

```ts
import type { FeatureKey } from "./types.js"

export function inventoryFromHtml(html: string, url: string): Record<FeatureKey, boolean> {
  const lower = html.toLowerCase()
  return {
    mobileViewport: /<meta[^>]+name=["']viewport["']/i.test(html),
    clickToCall: /href=["']tel:/i.test(html),
    bookingLink: /(book|appointment|reserve|schedule|fresha|calendly|squareup|opentable|booksy|setmore)/i.test(lower),
    hours: /(hours|monday|tuesday|open today|opening times|mon[\s\-–:])/i.test(lower),
    addressOrMap: /(google\.[a-z.]+\/maps|maps\.app|<address|street|avenue|\bave\b|\bst\b\s)/i.test(lower),
    reviews: /(review|testimonial|★|rating|\bstars?\b|google reviews)/i.test(lower),
    localBusinessJsonLd: /"@type"\s*:\s*"[a-z]*(business|restaurant|salon|barber|cafe|store|shop)"/i.test(html),
    menuSchema: /"@type"\s*:\s*"menu"/i.test(html),
    https: url.startsWith("https://"),
    ogTags: /<meta[^>]+property=["']og:/i.test(html),
    contactForm: /<form/i.test(html),
    favicon: /<link[^>]+rel=["'][^"']*icon/i.test(html),
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/audit && pnpm vitest run test/inventory.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/audit/src/inventory.ts packages/audit/test/inventory.test.ts
git commit -m "feat(audit): feature inventory probe (pure HTML scan)"
```

---

## Task 3: Tech-stack detection (pure)

**Files:**
- Create: `packages/audit/src/stack.ts`
- Test: `packages/audit/test/stack.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest"
import { detectStack } from "../src/stack.js"

describe("detectStack", () => {
  it("detects WordPress and flags bloat", () => {
    const links = Array.from({ length: 15 }, (_, i) => `<link rel="stylesheet" href="/wp-content/p${i}.css">`).join("")
    const r = detectStack(`<html><head>${links}</head><body>/wp-includes/</body></html>`)
    expect(r.platform).toBe("wordpress")
    expect(r.legacy).toBe(true)
  })

  it("detects Wix", () => {
    expect(detectStack(`<html><body>static.wixstatic.com</body></html>`).platform).toBe("wix")
  })

  it("detects Astro", () => {
    expect(detectStack(`<html><head><link href="/_astro/x.css"></head></html>`).platform).toBe("astro")
  })

  it("falls back to unknown", () => {
    expect(detectStack(`<html><body>hi</body></html>`).platform).toBe("unknown")
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/audit && pnpm vitest run test/stack.test.ts`
Expected: FAIL — cannot find module `../src/stack.js`.

- [ ] **Step 3: Write minimal implementation**

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/audit && pnpm vitest run test/stack.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/audit/src/stack.ts packages/audit/test/stack.test.ts
git commit -m "feat(audit): tech-stack detection heuristic"
```

---

## Task 4: Grading rubric (pure, versioned)

**Files:**
- Create: `packages/audit/src/rubric.ts`
- Test: `packages/audit/test/rubric.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest"
import { scoreToGrade, computeGrade, mapTier, type GradeInputs } from "../src/rubric.js"
import type { FeatureKey } from "../src/types.js"

const fullInventory = (val: boolean): Record<FeatureKey, boolean | "error"> => ({
  mobileViewport: val, clickToCall: val, bookingLink: val, hours: val,
  addressOrMap: val, reviews: val, localBusinessJsonLd: val, menuSchema: val,
  https: val, ogTags: val, contactForm: val, favicon: val,
})

const base = (over: Partial<GradeInputs> = {}): GradeInputs => ({
  psiMobilePerf: 95, psiSeo: 95, psiA11y: 95, cwvPass: true,
  seomatorScore: 95, inventory: fullInventory(true),
  structuralFlags: { notMobile: false, deadPlatform: false, brokenIa: false },
  ...over,
})

describe("scoreToGrade", () => {
  it("maps bands", () => {
    expect(scoreToGrade(95)).toBe("A")
    expect(scoreToGrade(82)).toBe("B")
    expect(scoreToGrade(72)).toBe("C")
    expect(scoreToGrade(55)).toBe("D")
    expect(scoreToGrade(20)).toBe("F")
  })
})

describe("computeGrade", () => {
  it("grades a strong site A", () => {
    expect(computeGrade(base()).overall).toBe("A")
  })

  it("CWV failure caps overall at C", () => {
    expect(computeGrade(base({ cwvPass: false })).overall).toBe("C")
  })

  it("structural flag forces at most D (foundation-strength override)", () => {
    const g = computeGrade(base({ structuralFlags: { notMobile: true, deadPlatform: false, brokenIa: false } }))
    expect(g.overall).toBe("D")
  })

  it("marks partial confidence when few probes present", () => {
    const g = computeGrade({
      inventory: fullInventory(true),
      structuralFlags: { notMobile: false, deadPlatform: false, brokenIa: false },
    })
    expect(g.confidence).toBe("partial")
  })
})

describe("mapTier", () => {
  it("unreachable → new-build", () => {
    expect(mapTier({ overall: "F", byCategory: {}, confidence: "partial" }, false, false)).toBe("new-build")
  })
  it("structural → rebuild", () => {
    expect(mapTier({ overall: "C", byCategory: {}, confidence: "high" }, true, true)).toBe("rebuild")
  })
  it("A → care-or-decline", () => {
    expect(mapTier({ overall: "A", byCategory: {}, confidence: "high" }, true, false)).toBe("care-or-decline")
  })
  it("B/C → tune-up", () => {
    expect(mapTier({ overall: "B", byCategory: {}, confidence: "high" }, true, false)).toBe("tune-up")
  })
  it("D/F → rebuild", () => {
    expect(mapTier({ overall: "D", byCategory: {}, confidence: "high" }, true, false)).toBe("rebuild")
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/audit && pnpm vitest run test/rubric.test.ts`
Expected: FAIL — cannot find module `../src/rubric.js`.

- [ ] **Step 3: Write minimal implementation**

```ts
import type { Grade, GradeResult, Tier, FeatureKey } from "./types.js"

export const RUBRIC_VERSION = "1.0.0"

const GRADE_POINTS: Record<Grade, number> = { A: 4, B: 3, C: 2, D: 1, F: 0 }
const POINTS_GRADE: Grade[] = ["F", "D", "C", "B", "A"]

export function scoreToGrade(score: number): Grade {
  if (score >= 90) return "A"
  if (score >= 80) return "B"
  if (score >= 70) return "C"
  if (score >= 50) return "D"
  return "F"
}

export interface GradeInputs {
  psiMobilePerf?: number
  psiSeo?: number
  psiA11y?: number
  cwvPass?: boolean
  seomatorScore?: number
  inventory: Record<FeatureKey, boolean | "error">
  structuralFlags: { notMobile: boolean; deadPlatform: boolean; brokenIa: boolean }
}

const avg = (ns: number[]) => ns.reduce((a, b) => a + b, 0) / ns.length

export function computeGrade(inp: GradeInputs): GradeResult {
  const byCategory: Record<string, Grade> = {}
  let available = 0

  if (inp.psiMobilePerf != null) { byCategory.performance = scoreToGrade(inp.psiMobilePerf); available++ }

  const seoScores = [inp.psiSeo, inp.seomatorScore].filter((n): n is number => n != null)
  if (seoScores.length) { byCategory.seo = scoreToGrade(avg(seoScores)); available++ }

  if (inp.psiA11y != null) { byCategory.accessibility = scoreToGrade(inp.psiA11y); available++ }

  const present = Object.values(inp.inventory).filter((v) => v === true).length
  const counted = Object.values(inp.inventory).filter((v) => v !== "error").length
  if (counted) { byCategory.conversion = scoreToGrade(Math.round((present / counted) * 100)); available++ }

  const cats = Object.values(byCategory)
  const overallPoints = cats.length ? cats.reduce((s, g) => s + GRADE_POINTS[g], 0) / cats.length : 0
  let overall = POINTS_GRADE[Math.round(overallPoints)]

  if (inp.cwvPass === false && GRADE_POINTS[overall] > GRADE_POINTS["C"]) overall = "C"

  const structural = inp.structuralFlags.notMobile || inp.structuralFlags.deadPlatform || inp.structuralFlags.brokenIa
  if (structural && GRADE_POINTS[overall] > GRADE_POINTS["D"]) overall = "D"

  const confidence: "high" | "partial" = available >= 3 ? "high" : "partial"
  return { overall, byCategory, confidence }
}

export function mapTier(grade: GradeResult, reachable: boolean, structural: boolean): Tier {
  if (!reachable) return "new-build"
  if (structural) return "rebuild"
  switch (grade.overall) {
    case "A": return "care-or-decline"
    case "B":
    case "C": return "tune-up"
    default: return "rebuild"
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/audit && pnpm vitest run test/rubric.test.ts`
Expected: PASS (all rubric tests).

- [ ] **Step 5: Commit**

```bash
git add packages/audit/src/rubric.ts packages/audit/test/rubric.test.ts
git commit -m "feat(audit): versioned grading rubric + tier mapping"
```

---

## Task 5: Page fetch (reachability + HTML)

**Files:**
- Create: `packages/audit/src/probes/fetchPage.ts`

- [ ] **Step 1: Write minimal implementation**

```ts
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
```

- [ ] **Step 2: Smoke-test against a real URL**

Run: `cd packages/audit && pnpm tsx -e "import('./src/probes/fetchPage.ts').then(async m => { const r = await m.fetchHtml('https://example.com'); console.log(r.reachable, r.html.length) })"`
Expected: prints `true` and a non-zero length.

- [ ] **Step 3: Commit**

```bash
git add packages/audit/src/probes/fetchPage.ts
git commit -m "feat(audit): page fetch with reachability + timeout"
```

---

## Task 6: PSI probe (parse pure + fetch network)

**Files:**
- Create: `packages/audit/src/probes/psi.ts`
- Create: `packages/audit/test/fixtures/psi-sample.json` (a trimmed real PSI response)
- Test: `packages/audit/test/psi.test.ts`

- [ ] **Step 1: Capture a fixture from the real API**

Run (needs a free key from https://developers.google.com/speed/docs/insights/v5/get-started — set `PSI_API_KEY`):
```bash
cd packages/audit
curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://example.com&strategy=mobile&category=performance&category=seo&category=accessibility&category=best-practices&key=$PSI_API_KEY" -o test/fixtures/psi-sample.json
```
Expected: file written; contains `lighthouseResult.categories`.

- [ ] **Step 2: Write the failing test**

```ts
import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { parsePsi } from "../src/probes/psi.js"

describe("parsePsi", () => {
  it("extracts scores and CWV from a PSI response", () => {
    const json = JSON.parse(readFileSync(new URL("./fixtures/psi-sample.json", import.meta.url), "utf8"))
    const r = parsePsi(json)
    expect(r.performance).toBeGreaterThanOrEqual(0)
    expect(r.performance).toBeLessThanOrEqual(100)
    expect(typeof r.cls === "number" || r.cls === null).toBe(true)
    expect(Array.isArray(r.failedAudits)).toBe(true)
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd packages/audit && pnpm vitest run test/psi.test.ts`
Expected: FAIL — cannot find module `../src/probes/psi.js`.

- [ ] **Step 4: Write minimal implementation**

```ts
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
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd packages/audit && pnpm vitest run test/psi.test.ts`
Expected: PASS (1 test).

- [ ] **Step 6: Commit**

```bash
git add packages/audit/src/probes/psi.ts packages/audit/test/psi.test.ts packages/audit/test/fixtures/psi-sample.json
git commit -m "feat(audit): PSI probe (parse + fetch + CWV)"
```

---

## Task 7: SEOmator probe (parse pure + run CLI)

**Files:**
- Create: `packages/audit/src/probes/seomator.ts`
- Create: `packages/audit/test/fixtures/seomator-sample.json`
- Test: `packages/audit/test/seomator.test.ts`

- [ ] **Step 1: Capture a fixture from the real CLI**

Run:
```bash
cd packages/audit
npx @seomator/seo-audit audit https://example.com --crawl -m 10 --format json -o test/fixtures/seomator-sample.json
```
Expected: file written. Inspect its top-level keys (e.g. `score`, `grade`, `categories`) — if the real shape differs from the assumptions below, adjust `parseSeomator` to match the actual keys before writing the test.

- [ ] **Step 2: Write the failing test**

```ts
import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { parseSeomator } from "../src/probes/seomator.js"

describe("parseSeomator", () => {
  it("extracts score and grade", () => {
    const json = JSON.parse(readFileSync(new URL("./fixtures/seomator-sample.json", import.meta.url), "utf8"))
    const r = parseSeomator(json)
    expect(r.score).toBeGreaterThanOrEqual(0)
    expect(r.score).toBeLessThanOrEqual(100)
    expect(["A", "B", "C", "D", "F"]).toContain(r.grade)
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd packages/audit && pnpm vitest run test/seomator.test.ts`
Expected: FAIL — cannot find module `../src/probes/seomator.js`.

- [ ] **Step 4: Write minimal implementation**

> Note: adjust the key paths in `parseSeomator` to match the real fixture captured in Step 1. The `scoreToGrade` fallback covers the case where the CLI returns a score but no letter grade.

```ts
import { execFile } from "node:child_process"
import { readFile, unlink } from "node:fs/promises"
import { promisify } from "node:util"
import type { Grade, SeomatorProbe } from "../types.js"
import { scoreToGrade } from "../rubric.js"

const exec = promisify(execFile)

interface ParsedSeomator { score: number; grade: Grade; categories: Record<string, number> }

export function parseSeomator(json: any): ParsedSeomator {
  const score: number = json?.score ?? json?.overallScore ?? json?.summary?.score ?? 0
  const rawGrade: string | undefined = json?.grade ?? json?.summary?.grade
  const grade = (["A", "B", "C", "D", "F"].includes(rawGrade ?? "") ? rawGrade : scoreToGrade(score)) as Grade
  const categories: Record<string, number> = {}
  const cats = json?.categories ?? json?.summary?.categories ?? {}
  for (const [k, v] of Object.entries<any>(cats)) {
    const n = typeof v === "number" ? v : v?.score
    if (typeof n === "number") categories[k] = n
  }
  return { score, grade, categories }
}

export async function runSeomatorProbe(url: string, maxPages = 25, timeoutMs = 120000): Promise<SeomatorProbe> {
  const out = `seomator-${Buffer.from(url).toString("hex").slice(0, 12)}.json`
  try {
    await exec("npx", ["@seomator/seo-audit", "audit", url, "--crawl", "-m", String(maxPages), "--format", "json", "-o", out], { timeout: timeoutMs })
    const parsed = parseSeomator(JSON.parse(await readFile(out, "utf8")))
    return { status: "ok", ...parsed }
  } catch (e) {
    return { status: "error", error: (e as Error).message }
  } finally {
    await unlink(out).catch(() => {})
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd packages/audit && pnpm vitest run test/seomator.test.ts`
Expected: PASS (1 test).

- [ ] **Step 6: Commit**

```bash
git add packages/audit/src/probes/seomator.ts packages/audit/test/seomator.test.ts packages/audit/test/fixtures/seomator-sample.json
git commit -m "feat(audit): SEOmator CLI probe (parse + run)"
```

---

## Task 8: Collector orchestration (graceful degradation)

**Files:**
- Create: `packages/audit/src/collect.ts`
- Test: `packages/audit/test/collect.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest"
import { assembleAudit } from "../src/collect.js"
import type { FeatureKey } from "../src/types.js"

const inv = (v: boolean): Record<FeatureKey, boolean | "error"> => ({
  mobileViewport: v, clickToCall: v, bookingLink: v, hours: v, addressOrMap: v, reviews: v,
  localBusinessJsonLd: v, menuSchema: v, https: v, ogTags: v, contactForm: v, favicon: v,
})

describe("assembleAudit", () => {
  it("still grades when PSI failed (graceful degradation)", () => {
    const data = assembleAudit({
      url: "https://x.example",
      fetchedAt: "2026-06-15T00:00:00Z",
      reachable: true,
      psi: { status: "error", error: "timeout" },
      seomator: { status: "ok", score: 60, grade: "D", categories: {} },
      inventory: inv(false),
      stack: { status: "ok", platform: "wordpress", legacy: true },
    })
    expect(data.grade.confidence).toBe("partial")
    expect(["D", "F"]).toContain(data.grade.overall)
    expect(data.tier).toBeDefined()
  })

  it("unreachable site → new-build tier", () => {
    const data = assembleAudit({
      url: "https://dead.example",
      fetchedAt: "2026-06-15T00:00:00Z",
      reachable: false,
      psi: { status: "error" }, seomator: { status: "error" },
      inventory: inv(false), stack: { status: "error" },
    })
    expect(data.tier).toBe("new-build")
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/audit && pnpm vitest run test/collect.test.ts`
Expected: FAIL — cannot find module `../src/collect.js`.

- [ ] **Step 3: Write minimal implementation**

```ts
import type { AuditData, PsiProbe, SeomatorProbe, StackProbe, FeatureKey } from "./types.js"
import { computeGrade, mapTier, type GradeInputs } from "./rubric.js"

export interface AssembleInput {
  url: string
  fetchedAt: string
  reachable: boolean
  vertical?: string
  psi: PsiProbe
  seomator: SeomatorProbe
  inventory: Record<FeatureKey, boolean | "error">
  stack: StackProbe
}

function deriveFixes(inv: Record<FeatureKey, boolean | "error">, psi: PsiProbe): { targeted: string[]; general: string[] } {
  const labels: Record<FeatureKey, string> = {
    mobileViewport: "Add a mobile-responsive layout",
    clickToCall: "Add click-to-call (tap-to-dial) phone link",
    bookingLink: "Add an online booking/appointment link",
    hours: "Publish opening hours",
    addressOrMap: "Add address + map (local SEO)",
    reviews: "Surface reviews / social proof",
    localBusinessJsonLd: "Add LocalBusiness structured data (JSON-LD)",
    menuSchema: "Add Menu structured data",
    https: "Move to HTTPS (SSL)",
    ogTags: "Add Open Graph tags for link previews",
    contactForm: "Add a contact form",
    favicon: "Add a favicon",
  }
  const targeted = (Object.keys(inv) as FeatureKey[]).filter((k) => inv[k] === false).map((k) => labels[k])
  const general = (psi.failedAudits ?? []).slice(0, 5)
  return { targeted, general }
}

export function assembleAudit(input: AssembleInput): AuditData {
  const structuralFlags = {
    notMobile: input.inventory.mobileViewport === false,
    deadPlatform: input.stack.legacy === true,
    brokenIa: false,
  }

  const gradeInputs: GradeInputs = {
    psiMobilePerf: input.psi.status === "ok" ? input.psi.mobile?.performance : undefined,
    psiSeo: input.psi.status === "ok" ? input.psi.mobile?.seo : undefined,
    psiA11y: input.psi.status === "ok" ? input.psi.mobile?.accessibility : undefined,
    cwvPass: input.psi.status === "ok" ? input.psi.cwv?.pass : undefined,
    seomatorScore: input.seomator.status === "ok" ? input.seomator.score : undefined,
    inventory: input.inventory,
    structuralFlags,
  }

  const grade = computeGrade(gradeInputs)
  const structural = structuralFlags.notMobile || structuralFlags.deadPlatform || structuralFlags.brokenIa
  const tier = mapTier(grade, input.reachable, structural)

  return {
    url: input.url,
    fetchedAt: input.fetchedAt,
    reachable: input.reachable,
    vertical: input.vertical,
    psi: input.psi,
    seomator: input.seomator,
    inventory: input.inventory,
    stack: input.stack,
    grade,
    tier,
    fixes: deriveFixes(input.inventory, input.psi),
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/audit && pnpm vitest run test/collect.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/audit/src/collect.ts packages/audit/test/collect.test.ts
git commit -m "feat(audit): assemble AuditData with graceful degradation"
```

---

## Task 9: CLI entrypoint

**Files:**
- Create: `packages/audit/src/cli.ts`

- [ ] **Step 1: Write minimal implementation**

```ts
import { writeFile } from "node:fs/promises"
import { fetchHtml } from "./probes/fetchPage.js"
import { runPsiProbe } from "./probes/psi.js"
import { runSeomatorProbe } from "./probes/seomator.js"
import { inventoryFromHtml } from "./inventory.js"
import { detectStack } from "./stack.js"
import { assembleAudit } from "./collect.js"
import type { FeatureKey, StackProbe } from "./types.js"

async function main() {
  const url = process.argv[2]
  const vertical = process.argv[3]
  if (!url) {
    console.error("Usage: site-audit <url> [vertical]")
    process.exit(1)
  }
  const key = process.env.PSI_API_KEY ?? ""
  const fetchedAt = new Date().toISOString()

  const page = await fetchHtml(url)
  const inventory: Record<FeatureKey, boolean | "error"> = page.reachable
    ? inventoryFromHtml(page.html, page.finalUrl)
    : (Object.fromEntries((["mobileViewport","clickToCall","bookingLink","hours","addressOrMap","reviews","localBusinessJsonLd","menuSchema","https","ogTags","contactForm","favicon"] as FeatureKey[]).map(k => [k, "error"])) as Record<FeatureKey, boolean | "error">)

  const stack: StackProbe = page.reachable
    ? { status: "ok", ...detectStack(page.html) }
    : { status: "error", error: page.error }

  const [psi, seomator] = await Promise.all([
    page.reachable && key ? runPsiProbe(url, key) : Promise.resolve({ status: "error" as const, error: key ? "unreachable" : "no PSI_API_KEY" }),
    page.reachable ? runSeomatorProbe(url) : Promise.resolve({ status: "error" as const, error: "unreachable" }),
  ])

  const data = assembleAudit({ url, fetchedAt, reachable: page.reachable, vertical, psi, seomator, inventory, stack })

  const outFile = `audit-${new URL(url).hostname}.json`
  await writeFile(outFile, JSON.stringify(data, null, 2))
  console.log(JSON.stringify(data, null, 2))
  console.error(`\n✔ ${data.grade.overall} (${data.grade.confidence}) → ${data.tier}  ·  written to ${outFile}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
```

- [ ] **Step 2: Add a root convenience script**

Modify `package.json` (repo root) — add to `scripts`:
```json
"site-audit": "pnpm --filter @studio0rbit/audit site-audit"
```

- [ ] **Step 3: Smoke-test the CLI end-to-end**

Run: `cd packages/audit && PSI_API_KEY=$PSI_API_KEY pnpm tsx src/cli.ts https://example.com`
Expected: prints an `AuditData` JSON with a grade + tier, writes `audit-example.com.json`. (PSI/SEOmator may take ~30–120s.)

- [ ] **Step 4: Commit**

```bash
git add packages/audit/src/cli.ts package.json
git commit -m "feat(audit): CLI entrypoint — url → AuditData JSON"
```

---

## Task 10: Real-Calgary-site verification

**Files:** none (verification task — produces evidence, no code).

- [ ] **Step 1: Run against a known-weak small-business site**

Run: `cd packages/audit && PSI_API_KEY=$PSI_API_KEY pnpm tsx src/cli.ts <real-calgary-shop-url> <vertical>`
Expected: completes; grade D–F or B–C; `fixes.targeted` lists missing features that match a manual look at the site.

- [ ] **Step 2: Run against a known-good site**

Run: `cd packages/audit && PSI_API_KEY=$PSI_API_KEY pnpm tsx src/cli.ts https://stripe.com`
Expected: grade A–B; few targeted fixes. Confirms the rubric discriminates.

- [ ] **Step 3: Confirm graceful degradation on a dead URL**

Run: `cd packages/audit && pnpm tsx src/cli.ts https://this-domain-does-not-exist-12345.example`
Expected: no crash; `reachable: false`, `tier: "new-build"`.

- [ ] **Step 4: Record evidence**

Append a short note (the three results + the two real grades) to the roadmap Progress log under Phase 2, then commit:
```bash
git add docs/roadmap.md
git commit -m "docs: site-audit Phase 2 verification evidence"
```

---

## Task 11: `site-audit` skill + branded HTML render

**Files:**
- Create: `.claude/skills/site-audit/SKILL.md`
- Create: `sites/audit-report/` (Astro app — copy config from `sites/demo-barber`, render `AuditData` → 1-page audit using the `outreach.md` structure on shared components)

- [ ] **Step 1: Write the skill**

Create `.claude/skills/site-audit/SKILL.md`:
```markdown
---
name: site-audit
description: Use when auditing a prospect's website for outreach or scoping. Given a URL, runs the deterministic collector then writes the branded 1-page audit. Triggers on "audit this site", "run a site audit", "scope this prospect".
---

# Site Audit

Two-layer rule: **the collector computes the grade; you only rank, write, and render.** Never invent or re-derive scores.

## Steps
1. Run the collector: `cd packages/audit && PSI_API_KEY=$PSI_API_KEY pnpm tsx src/cli.ts <url> <vertical>`.
   - If `reachable: false`, this is the new-build path — write a short "no real website" audit and stop.
2. Read the emitted `AuditData` JSON. Take `grade.overall`, `tier`, `fixes.targeted`, `fixes.general` as authoritative.
3. **Rank the top 3 issues** for this vertical from `fixes` + `psi.failedAudits`, ordered by customer impact (lost calls/bookings > SEO > polish).
4. For each: state the problem, *why it costs them customers*, and the fix — per `docs/gtm/outreach.md` structure.
5. Render the branded 1-page HTML (Task 11 Astro app) and produce the internal scoping note: `tier` + targeted vs general fixes.
6. **Honesty rule:** if grade A, say so and recommend declining/care — do not manufacture problems.
7. **CWV caveat:** describe CWV as indicative lab data, never "Google's official verdict".
```

- [ ] **Step 2: Build the report Astro app**

Scaffold `sites/audit-report/` mirroring `sites/demo-barber` (package.json, astro.config.mjs, tsconfig.json). Add a page that imports `base.css`, reads an `AuditData` JSON, and renders: header → grade snapshot + 1-line verdict → top-3 issues (problem/cost/fix) → "what a fixed version looks like" → soft CTA. Reuse shared section components and token theming.

- [ ] **Step 3: Build + screenshot (verification discipline)**

Run: `cd sites/audit-report && pnpm install && pnpm build && pnpm preview`
Then capture screenshots at mobile (390px) + desktop (1280px) via the Playwright plugin.
Expected: a styled, branded 1-page audit (not unstyled HTML — watch the Tailwind `@source` gotcha from CLAUDE.md).

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/site-audit/SKILL.md sites/audit-report
git commit -m "feat(audit): site-audit skill + branded 1-page HTML report"
```

---

## Self-review notes

- **Spec coverage:** §3 architecture → Tasks 1,8,9; §4 probes → Tasks 2,3,5,6,7; §5 rubric → Task 4; §6 outputs → Tasks 9,11; §7 skill steps → Task 11; §8 reliability → Tasks 5,6,7,8 (graceful degradation tested in Task 8); §9 verification → Task 10. All covered.
- **Type consistency:** `AuditData`/`PsiProbe`/`SeomatorProbe`/`StackProbe`/`FeatureKey`/`GradeInputs` defined in Task 1 / Task 4 and reused verbatim downstream. `scoreToGrade`, `computeGrade`, `mapTier`, `parsePsi`, `parseSeomator`, `assembleAudit`, `inventoryFromHtml`, `detectStack`, `fetchHtml` names are consistent across tasks.
- **Known adjust-on-contact point:** SEOmator JSON key paths (Task 7) are assumed; Step 1 captures the real fixture first and the impl note says to align keys before the test. This is the one place reality may differ from the plan.
```
