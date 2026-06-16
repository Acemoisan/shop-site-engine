// Gives every template site a fixed, unique dev/preview port (4301..) so the
// owner gets a deterministic "one localhost per page" list. Rewrites each
// astro.config.mjs and emits docs/templates-ports.json.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(ROOT, "docs", "templates-manifest.json"), "utf8"));

const START = 4301;
const ports = [];
manifest.forEach((t, i) => {
  const port = START + i;
  const cfg =
`import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Fixed port so this template always opens at the same localhost URL.
// SITE_BASE / OUT_DIR are set only by scripts/build-gallery.mjs to assemble the
// combined single-server gallery; normal dev/build use the defaults.
export default defineConfig({
  base: process.env.SITE_BASE || "/",
  server: { port: ${port}, host: false },
  ${"outDir"}: process.env.OUT_DIR || undefined,
  vite: { plugins: [tailwindcss()] },
});
`;
  writeFileSync(join(ROOT, "sites", t.slug, "astro.config.mjs"), cfg);
  ports.push({ ...t, port, url: `http://localhost:${port}`, dev: `pnpm --filter ${t.slug} dev` });
});

writeFileSync(join(ROOT, "docs", "templates-ports.json"), JSON.stringify(ports, null, 2) + "\n");
console.log(`Assigned ports ${START}..${START + manifest.length - 1} to ${manifest.length} sites.`);
