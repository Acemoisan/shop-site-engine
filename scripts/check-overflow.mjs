// Measures horizontal overflow for every template at mobile width (390px) by
// driving the system Chrome via puppeteer-core. For each page it reports how
// many px the document overflows the viewport and the worst offending elements
// (so fixes can be targeted). Requires the gallery server running on :4300.
//   node scripts/serve-gallery.mjs   # in another shell first
//   node scripts/check-overflow.mjs [width]
import puppeteer from "puppeteer-core";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const WIDTH = Number(process.argv[2] || 390);
const sites = JSON.parse(readFileSync(join(ROOT, "docs", "templates-ports.json"), "utf8"));

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--user-data-dir=" + join(ROOT, ".chrome-overflow")],
});

const measure = async (slug) => {
  const page = await browser.newPage();
  // NOTE: isMobile:true masks horizontal overflow — a too-wide page makes the
  // mobile layout viewport expand (innerWidth grows), hiding the scroll. Use a
  // plain 390px viewport so scrollWidth/scrollLeft report true overflow.
  await page.setViewport({ width: WIDTH, height: 844, deviceScaleFactor: 1, isMobile: false, hasTouch: false });
  try {
    await page.goto(`http://localhost:4300/g/${slug}/`, { waitUntil: "networkidle2", timeout: 25000 });
  } catch { /* still measure what loaded */ }
  const data = await page.evaluate((W) => {
    // Ground truth: can the user actually scroll horizontally? scrollWidth
    // over-counts content clipped by overflow:hidden wrappers and fixed bars;
    // the real symptom is a horizontal scrollbar, which this probes directly.
    const se = document.scrollingElement || document.documentElement;
    se.scrollLeft = 99999;
    const overflow = Math.round(se.scrollLeft); // px the page can scroll right (0 = none)
    se.scrollLeft = 0;
    const docW = document.documentElement.scrollWidth;
    const offenders = [];
    if (overflow > 1) {
      for (const el of document.body.querySelectorAll("*")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right > W + 1) {
          offenders.push({
            sel: el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : ""),
            right: Math.round(r.right), w: Math.round(r.width),
          });
        }
      }
    }
    // keep the widest few, dedup by selector
    const seen = new Map();
    for (const o of offenders.sort((a, z) => z.right - a.right)) {
      if (!seen.has(o.sel)) seen.set(o.sel, o);
      if (seen.size >= 8) break;
    }
    return { docW, overflow, offenders: [...seen.values()] };
  }, WIDTH);
  await page.close();
  return data;
};

const report = [];
for (const s of sites) {
  const r = await measure(s.slug);
  report.push({ slug: s.slug, ...r });
  if (r.overflow > 1) {
    console.log(`OVERFLOW +${r.overflow}px  ${s.slug}`);
    for (const o of r.offenders) console.log(`    ${o.sel}  (right ${o.right}, w ${o.w})`);
  } else {
    console.log(`ok            ${s.slug}`);
  }
}
await browser.close();

writeFileSync(join(ROOT, "docs", "overflow-report.json"), JSON.stringify({ width: WIDTH, report }, null, 2) + "\n");
const bad = report.filter(r => r.overflow > 1);
console.log(`\n${report.length} pages @ ${WIDTH}px · ${bad.length} with overflow`);
if (bad.length) console.log("OVERFLOWING:", bad.map(b => `${b.slug}(+${b.overflow})`).join(", "));
