// Full-page screenshot of one or more template slugs at a given CSS width using
// the system Chrome (puppeteer-core). Correct deviceScaleFactor=1 mobile viewport.
//   node scripts/shot.mjs 390 tmpl-jewelry-artisan tmpl-realestate-bright
import puppeteer from "puppeteer-core";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const width = Number(process.argv[2] || 390);
const slugs = process.argv.slice(3);

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--user-data-dir=" + join(ROOT, ".chrome-shot2")],
});
for (const slug of slugs) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  try { await page.goto(`http://localhost:4300/g/${slug}/`, { waitUntil: "networkidle2", timeout: 25000 }); } catch {}
  const out = join(ROOT, "gallery-shots", `chk-${width}-${slug}.png`);
  await page.screenshot({ path: out, fullPage: true });
  console.log(`shot ${slug} -> ${out}`);
  await page.close();
}
await browser.close();
