# Template Gallery — 60 templates (20 industries × 3 variants)

A research-driven set of **60 standalone Astro sites** under `sites/tmpl-*`, each fully
self-contained (bespoke layout + scoped CSS, no shared components) so every one looks
genuinely different. Built as a visual front-end exploration to harvest new components.

## View them

### Option A — all at once (best for browsing/testing)
```bash
node scripts/serve-gallery.mjs   # dependency-free static server, no SPA fallback
# open http://localhost:4300     → card grid of all 60, click any to open full-screen
```
> Use this server, **not** `npx serve -s` — the `-s` (SPA) flag rewrites every
> sub-path back to the gallery index, so every template would just reload the gallery.
The `gallery/` folder is already built. To rebuild after edits:
```bash
node scripts/build-gallery.mjs            # recompile all 60 into gallery/
node scripts/build-gallery.mjs --index-only   # just regenerate the index page
```

### Option B — one at a time (live dev server, for editing a template)
Each template has a fixed port. Start any single one:
```bash
pnpm --filter tmpl-barber-vintage dev     # → http://localhost:4301
```
Full port map: `docs/templates-localhost-list.md`. Rich catalogue (palette, signature
components, copy) per template: `docs/templates-catalogue.md`.

## How it was made
- `scripts/scaffold-templates.mjs` — generated the 60 site scaffolds + manifest.
- `scripts/assign-ports.mjs` — fixed dev ports 4301–4360 (+ env-driven base/outDir for the gallery).
- `scripts/design-templates.workflow.mjs` — the design workflow: 20 researcher agents
  scoured real sites per industry and specced a 3-variant design system, then 60 builder
  agents each authored a complete `index.astro`.
- `scripts/make-catalogue.mjs` — merged results → catalogue + localhost list.
- `scripts/audit-rendered.mjs` — content audit of the built pages (60/60 pass).

## Notes / next steps
- Imagery uses Lorem Picsum seeds so every image always loads (swap for real/Unsplash later).
- These are **prototypes** intentionally outside the production "one engine" token rule —
  mine them for components to fold back into `packages/shared`.
- Backend/CMS wiring (Storyblok, booking, forms) deliberately deferred — front-end visual only.
