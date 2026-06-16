// Minimal, dependency-free static server for the combined gallery.
// No SPA fallback: /g/<slug>/ resolves to gallery/g/<slug>/index.html, so every
// template serves its OWN page (not the gallery index). Run:
//   node scripts/serve-gallery.mjs            # http://localhost:4300
//   PORT=4300 node scripts/serve-gallery.mjs
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, dirname, normalize, extname } from "node:path";
import { fileURLToPath } from "node:url";

// Serves ./gallery by default; pass a dir (or set DIR) to serve anything else,
// e.g. `node scripts/serve-gallery.mjs sites/landing/dist` with PORT=4400.
const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = process.argv[2] || process.env.DIR
  ? join(REPO, process.argv[2] || process.env.DIR)
  : join(REPO, "gallery");
const PORT = Number(process.env.PORT || 4300);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".gif": "image/gif", ".ico": "image/x-icon",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf",
  ".avif": "image/avif", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml",
};

const server = createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent((req.url || "/").split("?")[0]);
    // resolve to a path inside ROOT (block traversal)
    let rel = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
    let fp = join(ROOT, rel);
    if (!fp.startsWith(ROOT)) { res.writeHead(403).end("Forbidden"); return; }
    let s;
    try { s = await stat(fp); } catch { res.writeHead(404).end("Not found"); return; }
    if (s.isDirectory()) {
      fp = join(fp, "index.html");
      try { await stat(fp); } catch { res.writeHead(404).end("No index in directory"); return; }
    }
    const body = await readFile(fp);
    res.writeHead(200, { "Content-Type": TYPES[extname(fp).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-cache" });
    res.end(body);
  } catch (e) {
    res.writeHead(500).end("Server error: " + (e?.message || e));
  }
});
server.listen(PORT, () => console.log(`Gallery → http://localhost:${PORT}  (root: ${ROOT})`));
