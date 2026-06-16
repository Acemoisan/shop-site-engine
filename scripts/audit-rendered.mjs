// Content-level audit of every built template (gallery/g/<slug>/index.html):
// confirms each rendered page has real substance, not an empty/broken shell.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const G = join(ROOT, "gallery", "g");
const slugs = readdirSync(G).filter(d => { try { return statSync(join(G, d)).isDirectory(); } catch { return false; } });

const rows = [];
for (const slug of slugs) {
  let html = "";
  try { html = readFileSync(join(G, slug, "index.html"), "utf8"); } catch { rows.push({ slug, ok: false, note: "no html" }); continue; }
  const kb = Math.round(html.length / 1024);
  const sections = (html.match(/<section/gi) || []).length;
  const imgs = (html.match(/picsum\.photos/gi) || []).length;
  const hasFont = /fonts\.googleapis\.com/i.test(html);
  const hasH1 = /<h1[\s>]/i.test(html);
  // Astro hoists scoped <style> into an external stylesheet at build time, so
  // accept either an inline <style> or a non-font <link rel="stylesheet">.
  const linkedCss = /<link[^>]+rel=["']?stylesheet["']?[^>]*>/i.test(html.replace(/fonts\.googleapis[^"']*/gi, ""));
  const hasStyle = /<style/i.test(html) || linkedCss;
  const title = (html.match(/<title>([^<]*)<\/title>/i) || [, ""])[1].trim();
  // "substance" heuristic: real page weight + multiple sections + styling + a heading
  const ok = kb >= 8 && sections >= 3 && hasStyle && hasH1;
  rows.push({ slug, ok, kb, sections, imgs, hasFont, hasH1, hasStyle, title });
}

rows.sort((a, z) => a.slug.localeCompare(z.slug));
const pad = (s, n) => String(s).padEnd(n);
console.log(pad("slug", 28), pad("ok", 4), pad("kb", 5), pad("sec", 4), pad("img", 4), pad("font", 5), "title");
for (const r of rows) {
  console.log(pad(r.slug, 28), pad(r.ok ? "OK" : "WARN", 4), pad(r.kb ?? "-", 5), pad(r.sections ?? "-", 4), pad(r.imgs ?? "-", 4), pad(r.hasFont ? "y" : "n", 5), (r.title ?? "").slice(0, 40));
}
const warn = rows.filter(r => !r.ok);
console.log(`\n${rows.length} pages · ${rows.length - warn.length} OK · ${warn.length} WARN`);
if (warn.length) console.log("WARN:", warn.map(w => w.slug).join(", "));
const noFont = rows.filter(r => r.ok && !r.hasFont);
if (noFont.length) console.log("no google font link:", noFont.map(w => w.slug).join(", "));
const noImg = rows.filter(r => r.ok && r.imgs === 0);
if (noImg.length) console.log("no picsum images:", noImg.map(w => w.slug).join(", "));
