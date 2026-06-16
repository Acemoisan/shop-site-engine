// Builds all 60 template sites into a single combined static gallery so the
// owner can browse every template from ONE server. Each site is built with a
// /g/<slug>/ base into gallery/g/<slug>, then a card-grid index.html is emitted.
//
//   node scripts/build-gallery.mjs      # build all (slow: 60 astro builds)
//   node scripts/build-gallery.mjs --index-only   # just regenerate index.html
//   npx serve gallery -l 4300           # then open http://localhost:4300
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GALLERY = join(ROOT, "gallery");
let sites = JSON.parse(readFileSync(join(ROOT, "docs", "templates-ports.json"), "utf8"));
const indexOnly = process.argv.includes("--index-only");
// Optional: pass one or more slugs to rebuild only those (index still covers all).
const only = process.argv.slice(2).filter(a => a.startsWith("tmpl-"));
const buildList = only.length ? sites.filter(s => only.includes(s.slug)) : sites;

const results = [];
if (!indexOnly) {
  mkdirSync(GALLERY, { recursive: true });
  let i = 0;
  for (const s of buildList) {
    i++;
    const out = join(GALLERY, "g", s.slug);
    const hasPage = existsSync(join(ROOT, "sites", s.slug, "src", "pages", "index.astro"));
    if (!hasPage) { results.push({ slug: s.slug, ok: false, reason: "no index.astro" }); continue; }
    try {
      execSync(`pnpm --filter ${s.slug} build`, {
        cwd: ROOT, stdio: "pipe",
        env: { ...process.env, SITE_BASE: `/g/${s.slug}/`, OUT_DIR: out },
      });
      results.push({ slug: s.slug, ok: existsSync(join(out, "index.html")) });
    } catch (e) {
      const msg = (e.stdout?.toString() || "") + (e.stderr?.toString() || e.message || "");
      results.push({ slug: s.slug, ok: false, reason: msg.split("\n").slice(-6).join("\n").slice(0, 600) });
    }
    process.stdout.write(`[${i}/${buildList.length}] ${s.slug} ${results.at(-1).ok ? "ok" : "FAIL"}\n`);
  }
}

// ---- index.html: card grid grouped by category ----
const cats = [];
for (const s of sites) {
  let c = cats.find(x => x.key === s.category);
  if (!c) { c = { key: s.category, title: s.categoryTitle, items: [] }; cats.push(c); }
  c.items.push(s);
}
const esc = (x) => String(x ?? "").replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
const card = (s) => `
      <a class="card" href="./g/${esc(s.slug)}/" target="_blank" rel="noopener">
        <div class="thumb"><iframe loading="lazy" src="./g/${esc(s.slug)}/" tabindex="-1" title="${esc(s.slug)} preview"></iframe></div>
        <div class="meta">
          <strong>${esc(s.variant)}</strong>
          <span class="port">:${esc(s.port)}</span>
          <p>${esc(s.direction)}</p>
        </div>
      </a>`;
const section = (c) => `
    <section>
      <h2>${esc(c.title)} <span class="count">${c.items.length}</span></h2>
      <div class="grid">${c.items.map(card).join("")}</div>
    </section>`;
const html = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Studio0rbit — 60 Template Gallery</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; font: 16px/1.5 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background: #0c0d10; color: #e8e9ed; }
  header { padding: 56px 24px 24px; text-align: center; border-bottom: 1px solid #21232b; background: radial-gradient(120% 80% at 50% 0%, #16181f, #0c0d10); }
  header h1 { margin: 0 0 8px; font-size: clamp(28px, 5vw, 44px); letter-spacing: -.02em; }
  header p { margin: 0; color: #9aa0ab; }
  main { max-width: 1320px; margin: 0 auto; padding: 8px 24px 80px; }
  section { margin-top: 48px; }
  h2 { font-size: 18px; letter-spacing: .06em; text-transform: uppercase; color: #c7ccd6; border-bottom: 1px solid #21232b; padding-bottom: 10px; display: flex; align-items: center; gap: 10px; }
  .count { font-size: 12px; background: #21232b; color: #9aa0ab; border-radius: 999px; padding: 2px 9px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; margin-top: 18px; }
  .card { display: block; text-decoration: none; color: inherit; background: #15171d; border: 1px solid #23262f; border-radius: 14px; overflow: hidden; transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease; }
  .card:hover { transform: translateY(-3px); border-color: #3a3f4c; box-shadow: 0 12px 30px rgba(0,0,0,.45); }
  .thumb { position: relative; aspect-ratio: 16 / 10; overflow: hidden; background: #0e0f13; border-bottom: 1px solid #23262f; }
  .thumb iframe { position: absolute; top: 0; left: 0; width: 1440px; height: 900px; border: 0; transform: scale(.1805); transform-origin: top left; pointer-events: none; }
  .meta { padding: 12px 14px 14px; }
  .meta strong { text-transform: capitalize; }
  .meta .port { color: #7b8190; font-variant-numeric: tabular-nums; margin-left: 6px; font-size: 13px; }
  .meta p { margin: 6px 0 0; font-size: 13px; color: #99a0ac; }
</style></head>
<body>
  <header>
    <h1>60 Website Templates</h1>
    <p>20 industries · 3 variants each · click any card to open it full-screen</p>
  </header>
  <main>${cats.map(section).join("")}</main>
</body></html>`;
mkdirSync(GALLERY, { recursive: true });
writeFileSync(join(GALLERY, "index.html"), html);

const ok = results.filter(r => r.ok).length;
if (!indexOnly) {
  console.log(`\nBuilt ${ok}/${buildList.length} into gallery/.`);
  const fails = results.filter(r => !r.ok);
  if (fails.length) { console.log(`\nFAILURES (${fails.length}):`); for (const f of fails) console.log(`- ${f.slug}: ${f.reason ?? "?"}`); }
}
console.log(`\nGallery index -> gallery/index.html`);
console.log(`Serve it:  node scripts/serve-gallery.mjs   ->   http://localhost:4300`);
console.log(`(do NOT use 'npx serve -s' — SPA fallback makes every sub-path reload the index)`);
