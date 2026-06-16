// Rewrites invalid standalone `<set:html ...>` JSON-LD injectors to the idiomatic
// Astro form `<script type="application/ld+json" set:html={EXPR}></script>`.
// `<set:html>` is a directive, not an element — used standalone it renders the
// JSON-LD as a stray element (reparented to <body> as visible text) or drops it.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const sitesDir = join(ROOT, "sites");
const slugs = readdirSync(sitesDir).filter(d => d.startsWith("tmpl-"));

// matches the whole <set:html ...>...</set:html> OR self-closing <set:html ... />
const blockRe = /<set:html\b[\s\S]*?(?:<\/set:html>|\/>)/;
// extracts the expression inside `>${ ... }</script>`
const exprRe = /application\/ld\+json"\s*>\s*\$\{([\s\S]*?)\}\s*<\/script>/;

let changed = [];
for (const slug of slugs) {
  const fp = join(sitesDir, slug, "src", "pages", "index.astro");
  let src = readFileSync(fp, "utf8");
  const block = src.match(blockRe);
  if (!block) continue;
  const expr = block[0].match(exprRe);
  if (!expr) { console.log(`WARN ${slug}: <set:html> found but no ld+json expression — skipped`); continue; }
  const replacement = `<script type="application/ld+json" set:html={${expr[1].trim()}}></script>`;
  src = src.replace(blockRe, replacement);
  writeFileSync(fp, src);
  changed.push(slug);
  console.log(`fixed: ${slug}`);
}
console.log(`\n${changed.length} files fixed: ${changed.join(", ")}`);
