// Capture a static poster screenshot of every template gallery page so the
// landing site can show <img> thumbnails instead of 60 (and 6) live <iframe>s.
// Live iframes meant the homepage spawned 6 full documents and /templates spawned
// 60 — duplicate fonts, picsum image storms, jank. Posters are cached images.
//
// Usage (orchestrated by scripts/refresh-gallery.sh, but runnable directly):
//   1. pnpm --filter landing build
//   2. pnpm --filter landing preview   (serves dist on http://localhost:4321)
//   3. BASE_URL=http://localhost:4321 node scripts/shoot-gallery.mjs
//
// Output: sites/landing/public/templates/shots/<slug>.jpg (16:10, ~1440x900).
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve, join } from "node:path";
import { readdirSync, mkdirSync, readFileSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE_URL || "http://localhost:4321";
const CONCURRENCY = Number(process.env.CONCURRENCY || 4);

function loadPlaywright() {
  const pnpm = resolve(here, "../node_modules/.pnpm");
  const dir = readdirSync(pnpm).find((d) => d.startsWith("playwright@"));
  if (!dir) throw new Error("playwright not found in node_modules/.pnpm");
  return import(pathToFileURL(join(pnpm, dir, "node_modules/playwright/index.mjs")).href);
}

const templates = JSON.parse(
  readFileSync(resolve(here, "../sites/landing/src/data/templates.json"), "utf8")
);
const slugs = templates.map((t) => t.slug);
const outDir = resolve(here, "../sites/landing/public/templates/shots");
mkdirSync(outDir, { recursive: true });

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
let done = 0;
const failures = [];

async function shoot(slug) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  try {
    const url = `${BASE}/templates/g/${slug}/`;
    await page.goto(url, { waitUntil: "load", timeout: 30000 });
    // Let fonts + above-the-fold imagery settle; don't block forever on picsum.
    await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(600);
    await page.screenshot({
      path: join(outDir, `${slug}.jpg`),
      type: "jpeg",
      quality: 72,
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    });
  } catch (e) {
    failures.push(`${slug}: ${e.message}`);
  } finally {
    await page.close();
    process.stdout.write(`\r  shot ${++done}/${slugs.length}`);
  }
}

// Simple concurrency pool.
const queue = [...slugs];
const workers = Array.from({ length: CONCURRENCY }, async () => {
  while (queue.length) await shoot(queue.shift());
});
await Promise.all(workers);
await browser.close();

console.log(`\n✓ ${done - failures.length}/${slugs.length} posters → ${outDir}`);
if (failures.length) {
  console.error(`✗ ${failures.length} failed:\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
