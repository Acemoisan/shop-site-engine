// Merges the design-workflow result with the port map to emit:
//   docs/templates-catalogue.md       — full catalogue grouped by industry
//   docs/templates-localhost-list.md  — quick list of all 60 localhost URLs
//   docs/templates-built.json         — machine-readable merge
// Usage: node scripts/make-catalogue.mjs <workflow-output-file>
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = process.argv[2];
const wf = JSON.parse(readFileSync(outFile, "utf8"));
const built = wf.result.built;
const ports = JSON.parse(readFileSync(join(ROOT, "docs", "templates-ports.json"), "utf8"));
const portBy = Object.fromEntries(ports.map(p => [p.slug, p]));

const merged = built.map(b => ({ ...b, ...portBy[b.slug] }));
const byPort = (a, z) => (a.port ?? 0) - (z.port ?? 0);
merged.sort(byPort);

writeFileSync(join(ROOT, "docs", "templates-built.json"), JSON.stringify(merged, null, 2) + "\n");

// ---- group by category in port order ----
const cats = [];
for (const m of merged) {
  let c = cats.find(x => x.key === m.category);
  if (!c) { c = { key: m.category, title: m.categoryTitle, items: [] }; cats.push(c); }
  c.items.push(m);
}

// ---- full catalogue ----
let md = `# 60 Website Templates — Catalogue\n\n`;
md += `20 industries × 3 divergent variants. Every template is a **standalone Astro site** under \`sites/\`, fully self-contained (scoped CSS, no shared components), each on a fixed localhost port.\n\n`;
md += `## How to view\n\n`;
md += `**All at once (recommended):**\n\n\`\`\`\nnode scripts/build-gallery.mjs   # compile all 60 (already run)\nnpx serve gallery -l 4300        # then open http://localhost:4300\n\`\`\`\n\n`;
md += `**One at a time** (live dev server for editing): \`pnpm --filter <slug> dev\` → opens at its fixed port below.\n\n`;
md += `---\n\n`;
for (const c of cats) {
  md += `## ${c.title}\n\n`;
  for (const m of c.items) {
    md += `### ${m.brandName} — *${m.variant}*  ·  [\`${m.url}\`](${m.url})\n\n`;
    md += `- **Slug / port:** \`${m.slug}\` · port \`${m.port}\` · \`pnpm --filter ${m.slug} dev\`\n`;
    md += `- **Direction:** ${m.direction}\n`;
    if (m.tagline) md += `- **Tagline:** “${m.tagline}”\n`;
    if (m.oneLineDescription) md += `- **Summary:** ${m.oneLineDescription}\n`;
    if (m.paletteHex) md += `- **Palette:** bg \`${m.paletteHex.bg}\` · primary \`${m.paletteHex.primary}\` · accent \`${m.paletteHex.accent}\`\n`;
    if (Array.isArray(m.signatureComponents) && m.signatureComponents.length)
      md += `- **Signature components:** ${m.signatureComponents.join("; ")}\n`;
    md += `\n`;
  }
}
writeFileSync(join(ROOT, "docs", "templates-catalogue.md"), md);

// ---- quick localhost list ----
let list = `# Template localhost URLs (60)\n\nRun \`pnpm --filter <slug> dev\` to start one, then open its URL.\nOr view all at once: \`npx serve gallery -l 4300\` → http://localhost:4300\n\n`;
list += `| # | URL | Industry | Variant | Brand | Start command |\n|---|-----|----------|---------|-------|---------------|\n`;
merged.forEach((m, i) => {
  list += `| ${i + 1} | ${m.url} | ${m.categoryTitle} | ${m.variant} | ${m.brandName} | \`pnpm --filter ${m.slug} dev\` |\n`;
});
writeFileSync(join(ROOT, "docs", "templates-localhost-list.md"), list);

console.log(`Wrote docs/templates-catalogue.md, docs/templates-localhost-list.md, docs/templates-built.json (${merged.length} templates).`);
