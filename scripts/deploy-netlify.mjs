// Headless Netlify deploy via the file-digest Deploy API (bypasses the CLI's
// monorepo auto-build). Usage: node scripts/deploy-netlify.mjs <distDir> <siteId>
// Requires NETLIFY_AUTH_TOKEN in env. Deploys to PRODUCTION.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, posix } from "node:path";

const [, , distDir, siteId] = process.argv;
const TOKEN = process.env.NETLIFY_AUTH_TOKEN;
if (!distDir || !siteId || !TOKEN) {
  console.error("need <distDir> <siteId> and NETLIFY_AUTH_TOKEN");
  process.exit(1);
}
const API = "https://api.netlify.com/api/v1";
const H = { Authorization: `Bearer ${TOKEN}` };

function walk(dir, base = dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, base, out);
    else out.push(full);
  }
  return out;
}

const files = walk(distDir);
const digests = {};       // "/path" -> sha1
const byDigest = {};      // sha1 -> absolute path
for (const f of files) {
  const rel = "/" + posix.normalize(f.slice(distDir.length + 1).split("\\").join("/"));
  const buf = readFileSync(f);
  const sha1 = createHash("sha1").update(buf).digest("hex");
  digests[rel] = sha1;
  byDigest[sha1] = f;
}

const res = await fetch(`${API}/sites/${siteId}/deploys`, {
  method: "POST",
  headers: { ...H, "Content-Type": "application/json" },
  body: JSON.stringify({ files: digests, async: false }),
});
if (!res.ok) { console.error("create deploy failed", res.status, await res.text()); process.exit(1); }
const deploy = await res.json();
const required = deploy.required || [];
console.log(`deploy ${deploy.id} — ${files.length} files, ${required.length} to upload`);

for (const sha1 of required) {
  const f = byDigest[sha1];
  if (!f) continue;
  const rel = Object.keys(digests).find((k) => digests[k] === sha1);
  const up = await fetch(`${API}/deploys/${deploy.id}/files${rel}`, {
    method: "PUT",
    headers: { ...H, "Content-Type": "application/octet-stream" },
    body: readFileSync(f),
  });
  if (!up.ok) { console.error("upload failed", rel, up.status, await up.text()); process.exit(1); }
}

// poll until ready
let state = deploy.state;
for (let i = 0; i < 60 && state !== "ready"; i++) {
  await new Promise((r) => setTimeout(r, 2000));
  const s = await fetch(`${API}/deploys/${deploy.id}`, { headers: H });
  const d = await s.json();
  state = d.state;
  if (state === "error") { console.error("deploy errored", d.error_message); process.exit(1); }
}
console.log(`state: ${state} | url: ${deploy.ssl_url || deploy.url}`);
