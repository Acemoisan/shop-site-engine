# sites/ Reorganization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the flat `sites/` directory into purpose-namespaced buckets (`clients/`, `clients/_delivered/`, `demos/`, `templates/`, `landing`) so the monorepo stays navigable toward 20+ clients, and update the template tooling scripts to match — with zero change to any site's build output.

**Architecture:** A one-time `git mv` of every `sites/<slug>` into its bucket, driven by pnpm-workspace globs (pnpm resolves packages by glob, so workspace membership and `pnpm --filter <name>` are path-independent). The only real breakage is Node scripts that build a filesystem path from a bare slug via `join(ROOT, "sites", slug)`; those are fixed by a single shared `siteDir()` helper. This is Phase 1, step 1 of the client-site storage strategy spec — deliberately decoupled and shipped before any eject/registry machinery.

**Tech Stack:** pnpm workspaces, Astro 5 (static), Tailwind v4, Node ESM scripts, git (Git Bash on Windows).

## Global Constraints

- **`sites/landing` MUST stay at exactly `sites/landing`** — its path is hardcoded in `shoot-gallery.mjs`, `serve-gallery.mjs`, `build-templates-into-landing.mjs`, `make-og-images.mjs`, `check-overflow.mjs`. Do not move it into a bucket.
- **`pnpm --filter <slug>` matches the package `name`, not the directory** — the reorg renames no packages, so every `--filter` exec line keeps working untouched. Do not rewrite them.
- **Tailwind v4 `@source` gotcha:** components render only because `packages/shared/src/styles/base.css` declares `@source "../components"` / `@source "../seo"`. The reorg does not touch `packages/shared`, so this is unaffected — but any "site renders unstyled" symptom during verification points here, not at the move.
- **Bucket mapping is fixed (verbatim):**
  - `sites/templates/` ← all 60 `tmpl-*`
  - `sites/demos/` ← `demo-barber demo-cafe demo-electrician demo-fitness demo-spa chopchop-preview artistic-salon gallery-t lavish-salon restyle-salon urban-texture maw alcurio`
  - `sites/clients/_delivered/` ← `bitcoin-manor eye-candy-optical astro-systems` (the 3 real paid clients)
  - `sites/clients/` ← empty for now (in-progress builds land here; a `.gitkeep` documents it)
  - `sites/landing` ← unchanged
- **Windows/Git Bash:** use forward slashes; `git mv` (not `mv`) so history follows.
- **Verification is build-based, not unit-test-based** (this is an infra reorg): a task's "test" is running the affected script/build and confirming the stated output.

## Precondition (do before Task 1)

The working tree is currently dirty (many modified/untracked files from prior client work). A `git mv` sweep on a dirty tree is error-prone.

- [ ] **Step 0a: Confirm a clean, intentional base.**

Run: `git status --short`
Expected: review the output. If there is uncommitted work that belongs to other branches, commit or stash it first. Do **not** start the reorg with unrelated staged changes.

- [ ] **Step 0b: Create the reorg branch off the current stable base.**

```bash
git checkout develop && git pull
git checkout -b chore/sites-reorg
```
Expected: now on `chore/sites-reorg` with a clean tree.

---

### Task 1: The `siteDir()` path helper

**Files:**
- Create: `scripts/lib/site-dir.mjs`
- Test: `scripts/lib/site-dir.test.mjs`

**Interfaces:**
- Produces: `siteDir(root: string, slug: string): string` — returns the absolute path to a site's directory under the new bucket layout. For an existing site it returns the bucket where the directory actually lives; for a not-yet-created `tmpl-*` slug (scaffolding case) it returns the conventional `sites/templates/<slug>` path even though it doesn't exist yet. Throws if a non-template slug can't be located.

- [ ] **Step 1: Write the failing test**

```js
// scripts/lib/site-dir.test.mjs
// Run with: node scripts/lib/site-dir.test.mjs   (exit 0 = pass)
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { siteDir } from "./site-dir.mjs";

const root = mkdtempSync(join(tmpdir(), "sitedir-"));
try {
  // existing dirs across buckets
  mkdirSync(join(root, "sites", "templates", "tmpl-foo"), { recursive: true });
  mkdirSync(join(root, "sites", "demos", "demo-bar"), { recursive: true });
  mkdirSync(join(root, "sites", "clients", "_delivered", "real-co"), { recursive: true });
  mkdirSync(join(root, "sites", "landing"), { recursive: true });

  assert.equal(siteDir(root, "tmpl-foo"), join(root, "sites", "templates", "tmpl-foo"));
  assert.equal(siteDir(root, "demo-bar"), join(root, "sites", "demos", "demo-bar"));
  assert.equal(siteDir(root, "real-co"), join(root, "sites", "clients", "_delivered", "real-co"));
  assert.equal(siteDir(root, "landing"), join(root, "sites", "landing"));

  // not-yet-created template (scaffold case) -> convention path, no throw
  assert.equal(siteDir(root, "tmpl-new"), join(root, "sites", "templates", "tmpl-new"));

  // unknown non-template -> throws
  assert.throws(() => siteDir(root, "mystery"), /cannot locate/);

  console.log("site-dir.test.mjs: PASS");
} finally {
  rmSync(root, { recursive: true, force: true });
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/lib/site-dir.test.mjs`
Expected: FAIL — `Cannot find module .../scripts/lib/site-dir.mjs`.

- [ ] **Step 3: Write minimal implementation**

```js
// scripts/lib/site-dir.mjs
// Resolves a site slug to its directory under the bucketed sites/ layout
// (2026-06 reorg). Buckets searched in order; landing is special-cased; a
// not-yet-created tmpl-* slug falls back to the templates/ convention so
// scaffolding can compute its target path before the dir exists.
import { existsSync } from "node:fs";
import { join } from "node:path";

const BUCKETS = [
  ["clients"],
  ["clients", "_delivered"],
  ["demos"],
  ["templates"],
];

export function siteDir(root, slug) {
  if (slug === "landing") return join(root, "sites", "landing");
  for (const parts of BUCKETS) {
    const p = join(root, "sites", ...parts, slug);
    if (existsSync(p)) return p;
  }
  if (slug.startsWith("tmpl-")) return join(root, "sites", "templates", slug);
  throw new Error(`siteDir: cannot locate sites/**/${slug} (no matching bucket, no convention)`);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/lib/site-dir.test.mjs`
Expected: `site-dir.test.mjs: PASS` and exit code 0.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/site-dir.mjs scripts/lib/site-dir.test.mjs
git commit -m "feat(scripts): add siteDir() helper for bucketed sites/ layout"
```

---

### Task 2: Move sites into buckets + update workspace globs

**Files:**
- Modify: `pnpm-workspace.yaml:1-3`
- Move: all `sites/<slug>` per the fixed bucket mapping (Global Constraints)
- Create: `sites/clients/.gitkeep`

**Interfaces:**
- Consumes: nothing (pure relocation)
- Produces: the bucketed directory layout that Task 3's script edits and all verification depend on.

- [ ] **Step 1: Update the workspace globs**

Replace `pnpm-workspace.yaml` lines 1-3:

```yaml
packages:
  - "packages/*"
  - "sites/*"
```

with:

```yaml
packages:
  - "packages/*"
  - "sites/clients/*"
  - "sites/clients/_delivered/*"
  - "sites/demos/*"
  - "sites/templates/*"
  - "sites/landing"
```

Leave the rest of the file (`allowBuilds`, `onlyBuiltDependencies`) unchanged.

- [ ] **Step 2: Create the bucket directories**

```bash
mkdir -p sites/clients/_delivered sites/demos sites/templates
touch sites/clients/.gitkeep
```

- [ ] **Step 3: Move the 60 templates (glob loop)**

```bash
for d in sites/tmpl-*; do git mv "$d" "sites/templates/$(basename "$d")"; done
```
Expected: 60 moves, no errors.

- [ ] **Step 4: Move the demos (explicit list)**

```bash
for s in demo-barber demo-cafe demo-electrician demo-fitness demo-spa \
         chopchop-preview artistic-salon gallery-t lavish-salon restyle-salon \
         urban-texture maw alcurio; do
  git mv "sites/$s" "sites/demos/$s"
done
```
Expected: 13 moves, no errors. (If `maw`/`alcurio` error as "not under version control," they're untracked — `mv sites/$s sites/demos/$s` them instead, then `git add`.)

- [ ] **Step 5: Move the 3 delivered clients**

```bash
for s in bitcoin-manor eye-candy-optical astro-systems; do
  git mv "sites/$s" "sites/clients/_delivered/$s"
done
```
Expected: 3 moves, no errors.

- [ ] **Step 6: Confirm nothing is left stranded in the flat root**

Run: `ls sites`
Expected: exactly `clients  demos  landing  templates` (plus `.gitkeep` is inside `clients/`). No `tmpl-*`, no `demo-*`, no client slugs directly under `sites/`.

- [ ] **Step 7: Re-link the workspace**

Run: `pnpm install`
Expected: completes without "package not found" errors; lockfile may update for path changes. (Pre-existing warnings about `maw`/`alcurio` lacking a package `name` are unrelated to this move — note but do not fix here.)

- [ ] **Step 8: Verify a sample build is path-independent (the core safety check)**

Run: `pnpm --filter eye-candy-optical build`
Expected: SUCCESS, `dist/` produced. This proves `--filter` (package-name based) survives the move. Then spot-check it rendered styled:

Run: `pnpm --filter bitcoin-manor build`
Expected: SUCCESS (confirms the workspace `@studio0rbit/shared` link still resolves from the new bucket depth).

- [ ] **Step 9: Commit the move**

```bash
git add -A
git commit -m "refactor(sites): bucket sites/ into clients|demos|templates|landing

Relocate all sites into purpose-namespaced buckets via git mv; widen
pnpm-workspace globs. Builds are package-name/--filter based so output is
unchanged. Template tooling scripts fixed in the next commit."
```

---

### Task 3: Point the 5 template scripts at the templates/ bucket

**Files:**
- Modify: `scripts/assign-ports.mjs:29`
- Modify: `scripts/build-gallery.mjs:10-13,28`
- Modify: `scripts/scaffold-templates.mjs:220` (+ import)
- Modify: `scripts/fix-jsonld.mjs:10-11,20`
- Modify: `scripts/design-templates.workflow.mjs:160`
- Modify: `scripts/make-catalogue.mjs:33` (doc text only)

**Interfaces:**
- Consumes: `siteDir(root, slug)` from `scripts/lib/site-dir.mjs` (Task 1).
- Produces: template tooling that reads/writes under `sites/templates/`. (`build-templates-into-landing.mjs` and `check-overflow.mjs` need NO edits — they operate via `pnpm --filter` + `docs/templates-ports.json`, both path-independent.)

- [ ] **Step 1: Fix `assign-ports.mjs`** — it writes each template's `astro.config.mjs`.

Add after the existing imports (top of file, after line 6):

```js
import { siteDir } from "./lib/site-dir.mjs";
```

Replace line 29:

```js
  writeFileSync(join(ROOT, "sites", t.slug, "astro.config.mjs"), cfg);
```

with:

```js
  writeFileSync(join(siteDir(ROOT, t.slug), "astro.config.mjs"), cfg);
```

- [ ] **Step 2: Run assign-ports and verify it targets the bucket**

Run: `node scripts/assign-ports.mjs`
Expected: `Assigned ports 4301..4360 to 60 sites.` Then confirm it wrote into the bucket, not the old path:

Run: `git status --short sites/templates | head`
Expected: modified `astro.config.mjs` files appear under `sites/templates/tmpl-*` (proof the write landed in the new location). `docs/templates-ports.json` regenerated.

- [ ] **Step 3: Fix `build-gallery.mjs`** — the `existsSync` gate that decides whether each template builds.

Add after the existing imports (after line 11):

```js
import { siteDir } from "./lib/site-dir.mjs";
```

Replace line 28:

```js
    const hasPage = existsSync(join(ROOT, "sites", s.slug, "src", "pages", "index.astro"));
```

with:

```js
    const hasPage = existsSync(join(siteDir(ROOT, s.slug), "src", "pages", "index.astro"));
```

- [ ] **Step 4: Verify the gallery finds and builds a template**

Run: `node scripts/build-gallery.mjs tmpl-barber-modern`
Expected: `[1/1] tmpl-barber-modern ok` and `Built 1/1 into gallery/.` — NOT `no index.astro` (that string would mean the path fix failed).

- [ ] **Step 5: Fix `fix-jsonld.mjs`** — template discovery + per-file path.

Replace lines 10-11:

```js
const sitesDir = join(ROOT, "sites");
const slugs = readdirSync(sitesDir).filter(d => d.startsWith("tmpl-"));
```

with:

```js
const sitesDir = join(ROOT, "sites", "templates");
const slugs = readdirSync(sitesDir).filter(d => d.startsWith("tmpl-"));
```

(Line 20, `join(sitesDir, slug, "src", "pages", "index.astro")`, now resolves correctly because `sitesDir` points at the bucket — no further change.)

- [ ] **Step 6: Verify fix-jsonld discovers all 60 templates**

Run: `node scripts/fix-jsonld.mjs`
Expected: final line reports a fix count and joined slug list, OR `0 files fixed` if all are already idiomatic — but it must clearly have **scanned 60** templates (no crash, no empty `readdirSync`). Sanity-check discovery directly:

Run: `node -e "import('node:fs').then(fs=>console.log(fs.readdirSync('sites/templates').filter(d=>d.startsWith('tmpl-')).length))"`
Expected: `60`.

- [ ] **Step 7: Fix `scaffold-templates.mjs`** — new-template scaffolding target.

Add to the imports near the top (the file already imports from `node:path`; add the helper import alongside):

```js
import { siteDir } from "./lib/site-dir.mjs";
```

Replace line 220:

```js
  const dir = join(ROOT, "sites", t.slug);
```

with:

```js
  const dir = siteDir(ROOT, t.slug);
```

(For a brand-new `tmpl-*` slug not yet on disk, `siteDir` returns the `sites/templates/<slug>` convention path — exactly where new templates should scaffold.)

- [ ] **Step 8: Verify scaffold dry-run targets the bucket**

Run: `node -e "import('./scripts/lib/site-dir.mjs').then(m=>console.log(m.siteDir(process.cwd(),'tmpl-does-not-exist-yet')))"`
Expected: a path ending in `sites/templates/tmpl-does-not-exist-yet` (confirms new scaffolds land in the bucket). Do not actually scaffold.

- [ ] **Step 9: Fix `design-templates.workflow.mjs`** — per-template page path string.

Replace line 160:

```js
  const path = `sites/${it.slug}/src/pages/index.astro`
```

with:

```js
  const path = `sites/templates/${it.slug}/src/pages/index.astro`
```

(This script handles only `tmpl-*` slugs, so the literal `templates/` segment is correct and avoids importing the helper into a workflow script.)

- [ ] **Step 10: Fix the stale doc text in `make-catalogue.mjs`** (cosmetic, keeps generated docs accurate).

Replace in line 33 the fragment:

```
under \`sites/\`, fully self-contained
```

with:

```
under \`sites/templates/\`, fully self-contained
```

- [ ] **Step 11: Verify the gallery→landing embed pipeline still works end-to-end**

Run: `node scripts/build-templates-into-landing.mjs tmpl-barber-modern`
Expected: `[1/1] tmpl-barber-modern ok` and `Built 1/1 into sites/landing/public/templates/g/`. (Confirms the landing-embed path — which needed no edits — still resolves after the move.)

- [ ] **Step 12: Commit the script fixes**

```bash
git add scripts/assign-ports.mjs scripts/build-gallery.mjs scripts/fix-jsonld.mjs \
        scripts/scaffold-templates.mjs scripts/design-templates.workflow.mjs \
        scripts/make-catalogue.mjs docs/templates-ports.json
git commit -m "fix(scripts): resolve template paths under sites/templates after reorg"
```

---

### Task 4: Final whole-pipeline verification + branch wrap-up

**Files:** none (verification only)

**Interfaces:**
- Consumes: everything from Tasks 1–3.
- Produces: confidence that the reorg changed organization only, not output.

- [ ] **Step 1: Confirm the full layout**

Run: `ls sites && echo "---" && ls sites/clients/_delivered && echo "---" && ls sites/demos | wc -l && echo "templates:" && ls sites/templates | wc -l`
Expected: `clients demos landing templates`; delivered = `astro-systems bitcoin-manor eye-candy-optical`; demos count = 13; templates count = 60.

- [ ] **Step 2: Build one site from each bucket to prove all buckets resolve**

```bash
pnpm --filter astro-systems build      # clients/_delivered
pnpm --filter demo-cafe build          # demos
pnpm --filter tmpl-coffee-nordic build # templates
pnpm --filter landing build            # landing
```
Expected: all four SUCCEED with a `dist/`. (Covers each bucket depth + the `@studio0rbit/shared` link + a self-contained template.)

- [ ] **Step 3: Confirm no orphaned references to old flat paths remain**

Run: `grep -rn "sites/tmpl-\|\"sites\", *t\.slug\|\"sites\", *s\.slug" scripts/ || echo "clean"`
Expected: `clean` (no script still builds a path from `sites/<bare-slug>`). If any line appears, it was missed in Task 3 — fix it the same way and amend.

- [ ] **Step 4: Push the branch and open a PR**

```bash
git push -u origin chore/sites-reorg
```
Then open a PR into `develop` titled "refactor(sites): bucket sites/ into clients|demos|templates|landing", body summarizing: move-only reorg, builds verified per bucket, tooling scripts repointed via `siteDir()`, `sites/landing` deliberately unmoved.

---

## Self-Review

**Spec coverage (vs §1 of the storage spec):**
- Bucket layout `clients/ demos/ templates/ landing` — Task 2. ✔
- `clients/_delivered/` for delivered clients — Task 2 (bitcoin-manor, eye-candy-optical, astro-systems). ✔
- Single `siteDir()` helper instead of scattered edits — Task 1, consumed in Task 3. ✔
- All path-constructing scripts fixed (`assign-ports`, `build-gallery`, `scaffold-templates`, `fix-jsonld`, `design-templates.workflow`) — Task 3. ✔
- `sites/landing` stays put + landing-embed re-verified — Global Constraints + Task 3 Step 11. ✔
- Gallery + landing-embed builds re-verified — Tasks 3 (Steps 4, 11) and 4. ✔
- **Out of scope for this plan (separate Phase-1 plans):** registry seeding, source-export step, skill promotion to user-global, contract/change-order prerequisites. Each gets its own plan once this lands.

**Placeholder scan:** no TBD/TODO; every code step shows the exact before/after; every run step states expected output. ✔

**Type/name consistency:** `siteDir(root, slug)` signature defined in Task 1 is used identically in Task 3 (`siteDir(ROOT, t.slug)` / `siteDir(ROOT, s.slug)`). The two scripts that don't import it (`fix-jsonld`, `design-templates.workflow`) use literal `sites/templates` paths intentionally — noted at each. ✔
