// Capture mobile + desktop screenshots of a URL for the visual-review stage of
// an audit. Pure tooling — the collector judges HTML facts; this lets a human
// (or Claude) judge the *look* (dated design, clutter, weak hierarchy) that a
// feature inventory can't see.
//
// Usage:  node screenshot.mjs <url> [outDir]
// Writes: <outDir>/shot-<host>-mobile.png and -desktop.png  (full-page)
import { readdirSync } from "node:fs"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(here, "..", "..")
const require = createRequire(import.meta.url)

/** Resolve Playwright whether it's hoisted or only under pnpm's store. */
function loadPlaywright() {
  try { return require("playwright") } catch {}
  const pnpmDir = join(repoRoot, "node_modules", ".pnpm")
  const entry = readdirSync(pnpmDir).find((d) => d.startsWith("playwright@"))
  if (!entry) throw new Error("playwright not installed (npx playwright install chromium)")
  return require(join(pnpmDir, entry, "node_modules", "playwright"))
}

async function main() {
  const url = process.argv[2]
  const outDir = process.argv[3] || "."
  if (!url) {
    console.error("Usage: node screenshot.mjs <url> [outDir]")
    process.exit(1)
  }
  const host = new URL(url).hostname.replace(/^www\./, "")
  const { chromium } = loadPlaywright()
  const browser = await chromium.launch()
  const shots = []
  try {
    for (const [name, viewport, dsf] of [
      ["mobile", { width: 390, height: 844 }, 2],
      ["desktop", { width: 1366, height: 900 }, 1],
    ]) {
      const ctx = await browser.newContext({ viewport, deviceScaleFactor: dsf })
      const page = await ctx.newPage()
      try {
        await page.goto(url, { waitUntil: "load", timeout: 30000 })
      } catch {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 })
      }
      await page.waitForTimeout(1500) // let hero imagery / fonts settle
      const path = join(outDir, `shot-${host}-${name}.png`)
      await page.screenshot({ path, fullPage: true })
      shots.push(path)
      await ctx.close()
    }
  } finally {
    await browser.close()
  }
  console.log(JSON.stringify({ host, shots }))
}

main().catch((e) => { console.error("ERR", e.message); process.exit(1) })
