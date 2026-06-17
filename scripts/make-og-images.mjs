// Generate the social share image (og.png, 1200x630) and the apple-touch-icon
// (180x180) for the landing site, rendered from on-brand HTML via headless
// Chromium. Re-run after brand/copy changes:  node scripts/make-og-images.mjs
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve, join } from "node:path";
import { readdirSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));

// playwright is installed via the Claude Code plugin into pnpm's store, not
// hoisted to root node_modules — resolve it straight out of .pnpm.
function loadPlaywright() {
  const pnpm = resolve(here, "../node_modules/.pnpm");
  const dir = readdirSync(pnpm).find((d) => d.startsWith("playwright@"));
  if (!dir) throw new Error("playwright not found in node_modules/.pnpm");
  return import(pathToFileURL(join(pnpm, dir, "node_modules/playwright/index.mjs")).href);
}
const { chromium } = await loadPlaywright();
const pub = resolve(here, "../sites/landing/public");

const icon = `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:180px;height:180px}
  body{background:#5b4fe6;display:grid;place-items:center;border-radius:40px}
  .dot{width:64px;height:64px;border-radius:50%;background:#6fe0ee;box-shadow:0 0 0 10px rgba(255,255,255,.45)}
</style></head><body><div class="dot"></div></body></html>`;

const browser = await chromium.launch();
try {
  // OG image from the shared template file.
  const og = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await og.goto(pathToFileURL(resolve(here, "og-template.html")).href, { waitUntil: "networkidle" });
  await og.waitForTimeout(400);
  await og.screenshot({ path: resolve(pub, "og.png"), type: "png" });
  console.log("✓ og.png");

  // Apple touch icon from inline HTML.
  const ic = await browser.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 1 });
  await ic.setContent(icon, { waitUntil: "load" });
  await ic.screenshot({ path: resolve(pub, "apple-touch-icon.png"), type: "png" });
  console.log("✓ apple-touch-icon.png");
} finally {
  await browser.close();
}
