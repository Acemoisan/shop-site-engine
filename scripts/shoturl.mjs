import puppeteer from "puppeteer-core";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const width = Number(process.argv[2] || 1440);
const jobs = process.argv.slice(3); // name=url pairs
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox","--user-data-dir="+join(ROOT,".chrome-url")] });
for (const j of jobs) {
  const [name, url] = j.split("=");
  const p = await b.newPage();
  await p.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  try { await p.goto(url, { waitUntil: "networkidle2", timeout: 30000 }); } catch {}
  await new Promise(r=>setTimeout(r,1200));
  const out = join(ROOT, "gallery-shots", name + ".png");
  await p.screenshot({ path: out, fullPage: true });
  console.log("shot", name, "->", out);
  await p.close();
}
await b.close();
