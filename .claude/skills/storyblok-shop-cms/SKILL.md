---
name: storyblok-shop-cms
description: Use when wiring Storyblok into an Astro shop site, defining or extending a shop content model, creating/populating/editing Storyblok content via the Management API, or answering how a non-technical client edits, uploads images, or publishes in Storyblok. Calgary shop-site engine specific.
---

# Storyblok Shop CMS

How we make Studio0rbit shop sites client-editable: a Storyblok "shop" content type feeding an Astro site at build time, set up and managed via the Management API. Verified end-to-end on a live space (2026-06-15) — see `sites/demo-barber` and `docs/client-handoff-guide.md`.

## Core model
- One **`shop` root content type** holds a single shop's content, with **nested block types** for repeating sections: `shop_hours`, `shop_service`, `shop_stat`, `shop_feature` (icon = `option` field), `shop_testimonial`, `shop_faq`. Plus flat fields (name, tagline, phone, address, map_url, booking_url, rating, section-heading texts) and `hero_image` as an **`asset`** field (so clients upload from desktop).
- The Astro page **fetches the published story at build time** and maps it to the `ShopContent` shape, **with local-file fallbacks** so the build never breaks. Each section: `if (c.x?.length) use Storyblok else keep default`.

## Tokens & region (critical)
- **Two different tokens.** Content **Delivery** token (read, used by the site: `api.storyblok.com/v2/cdn/...?token=`) vs **Management/Personal-Access** token `sb_pat_…` (write, used for setup: `mapi.storyblok.com/v1/spaces/{id}/...`, header `Authorization: <token>`).
- Region: app.storyblok.com spaces are **EU** → `mapi.storyblok.com`. Probe a token: `GET cdn/spaces/me` (200 = valid CD token); `GET mapi…/spaces/{id}` (200 = valid management token).
- Client cost: **Starter plan is free forever** (1 space, 1 seat, visual editor). The 45-day trial is of Growth Plus; you downgrade to free, never forced to pay.

## Management API recipes
Run via a throwaway `node` script (global `fetch`), **outside the repo**, and delete it after — never commit the token. Reusable template: `setup-shop.mjs` (reads `SB_PAT`/`SB_SPACE` from env).
- **Create a block:** `POST mapi…/components/` with `{component:{name, is_nestable:true, schema:{...}}}`.
- **Extend the root type:** `GET` the component, **merge** new fields into `schema` (don't rebuild — you'll drop fields), `PUT` it back. Bloks field: `{type:"bloks", restrict_components:true, component_whitelist:["shop_stat"]}`.
- **Populate without clobbering client edits:** `GET` the story, set fields **only if empty** (`c.x = c.x || default` / `if(!c.x?.length)`), `PUT {story:{content}, publish:1}`. Each blok needs `component` + a unique `_uid`.
- **Image upload field:** make `hero_image` `{type:"asset", filetypes:["images"]}`; in Astro read `c.hero_image?.filename` (asset object) `|| c.hero_image` (legacy URL string) `|| fallback`.

## Gotchas (all hit and fixed)
| Symptom | Cause / fix |
|---|---|
| `422 ... rating must be a string` on story PUT | Storyblok number fields validate as **string** on update — send `"4.9"`, parse with `parseFloat` in Astro. |
| CDN `curl` returns `301`/empty | Delivery API redirects — use `curl -L`. Browser/Node `fetch` follows automatically. |
| Component utilities don't render in monorepo | Tailwind v4 only scans the site dir — add `@source "../components"` in shared `base.css` (separate concern, see CLAUDE.md). |
| Edits don't appear on site | Client clicked **Save** not **Publish**; site reads `version=published`. |

## Client editing (for handoff docs)
Clients edit in `app.storyblok.com` → Content → their story. Text fields = type; sections = blocks (expand / **＋ add** / trash / drag-reorder); feature icon = dropdown; **Hero image = upload from desktop** via the asset field or the Assets manager (uploads, not web URLs). **Publish** (not Save) goes live. History → restore to undo. Full client-facing version: `docs/client-handoff-guide.md` §2.

## Verify
After any setup: `GET cdn/stories/<slug>?token=<CD>&version=published` (with `-L`) and grep for the new `"component":"shop_*"` blocks; rebuild the site and confirm `content source: Storyblok` in the build log; screenshot the page.
