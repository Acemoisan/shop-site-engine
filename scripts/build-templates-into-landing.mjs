// Builds all 60 template sites into the LANDING site's public/ folder so they
// deploy together with the marketing site and are browsable at
// /templates/g/<slug>/ on the live domain. Run via node (never the Bash MSYS
// trap that mangles /g/... bases).
//   node scripts/build-templates-into-landing.mjs [tmpl-slug ...]
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "sites", "landing", "public", "templates", "g");
const sites = JSON.parse(readFileSync(join(ROOT, "docs", "templates-ports.json"), "utf8"));
const only = process.argv.slice(2).filter(a => a.startsWith("tmpl-"));
const list = only.length ? sites.filter(s => only.includes(s.slug)) : sites;

// keep the landing's template manifest in sync for the gallery pages
mkdirSync(join(ROOT, "sites", "landing", "src", "data"), { recursive: true });
copyFileSync(join(ROOT, "docs", "templates-built.json"), join(ROOT, "sites", "landing", "src", "data", "templates.json"));

mkdirSync(PUBLIC, { recursive: true });
const fails = [];
let i = 0;
for (const s of list) {
  i++;
  const out = join(PUBLIC, s.slug);
  try {
    execSync(`pnpm --filter ${s.slug} build`, {
      cwd: ROOT, stdio: "pipe",
      env: { ...process.env, SITE_BASE: `/templates/g/${s.slug}/`, OUT_DIR: out },
    });
    const ok = existsSync(join(out, "index.html"));
    if (!ok) fails.push(s.slug);
    process.stdout.write(`[${i}/${list.length}] ${s.slug} ${ok ? "ok" : "FAIL"}\n`);
  } catch (e) {
    fails.push(s.slug);
    process.stdout.write(`[${i}/${list.length}] ${s.slug} FAIL\n`);
  }
}
console.log(`\nBuilt ${list.length - fails.length}/${list.length} into sites/landing/public/templates/g/`);
if (fails.length) console.log("FAILURES:", fails.join(", "));
