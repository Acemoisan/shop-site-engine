#!/usr/bin/env node
// Idempotently create the Studio0rbit "shop" content model in a Storyblok space.
// Usage:  SB_PAT=sb_pat_xxx SB_SPACE=1234567 node setup-shop.mjs
//   SB_PAT   = Management / Personal Access token (sb_pat_...)  — write access
//   SB_SPACE = numeric space id (from the space URL)
// Safe to re-run: existing components are skipped, the shop type is merged not rebuilt.
// NOTE: never hardcode the token; pass it via env and don't commit it.

const PAT = process.env.SB_PAT;
const SPACE = process.env.SB_SPACE;
if (!PAT || !SPACE) { console.error("Set SB_PAT and SB_SPACE env vars."); process.exit(1); }
const base = `https://mapi.storyblok.com/v1/spaces/${SPACE}`; // EU region (app.storyblok.com)
const H = { Authorization: PAT, "Content-Type": "application/json" };
const api = async (url, opts) => { const r = await fetch(url, opts); let b; const t = await r.text(); try { b = JSON.parse(t); } catch { b = t; } return { status: r.status, body: b }; };

const ICONS = ["scissors","star","clock","calendar","coffee","mapPin","leaf","sparkles","heart","bolt","dumbbell","shield","target","award","wrench","phone","truck","key","pencil","search","check"].map((v) => ({ name: v, value: v }));
const NESTED = {
  shop_hours: { day: { type: "text", pos: 0 }, open: { type: "text", pos: 1 }, close: { type: "text", pos: 2 }, closed: { type: "boolean", pos: 3 } },
  shop_service: { name: { type: "text", pos: 0 }, price: { type: "text", pos: 1 }, description: { type: "textarea", pos: 2 } },
  shop_stat: { value: { type: "text", pos: 0 }, label: { type: "text", pos: 1 } },
  shop_feature: { icon: { type: "option", options: ICONS, pos: 0 }, title: { type: "text", pos: 1 }, body: { type: "textarea", pos: 2 } },
  shop_testimonial: { quote: { type: "textarea", pos: 0 }, name: { type: "text", pos: 1 } },
  shop_faq: { question: { type: "text", pos: 0 }, answer: { type: "textarea", pos: 1 } },
};
const blok = (white) => ({ type: "bloks", restrict_components: true, component_whitelist: white });
const SHOP_FIELDS = {
  name: { type: "text" }, tagline: { type: "text" }, hero_image: { type: "asset", filetypes: ["images"] },
  phone: { type: "text" }, address: { type: "text" }, map_url: { type: "text" }, service_area: { type: "text" },
  booking_url: { type: "text" }, reviews_blurb: { type: "text" }, rating: { type: "number" },
  hours: blok(["shop_hours"]), services: blok(["shop_service"]), stats: blok(["shop_stat"]),
  features_label: { type: "text" }, features_heading: { type: "text" }, features: blok(["shop_feature"]),
  testimonials_label: { type: "text" }, testimonials_heading: { type: "text" }, testimonials: blok(["shop_testimonial"]),
  faq_heading: { type: "text" }, faqs: blok(["shop_faq"]), cta_heading: { type: "text" },
};

const comps = (await api(`${base}/components/?per_page=100`, { headers: H })).body.components || [];
const byName = new Map(comps.map((c) => [c.name, c]));

for (const [name, schema] of Object.entries(NESTED)) {
  if (byName.has(name)) { console.log(`exists: ${name}`); continue; }
  const r = await api(`${base}/components/`, { method: "POST", headers: H, body: JSON.stringify({ component: { name, display_name: name.replace("shop_", "").replace(/^./, (c) => c.toUpperCase()), is_root: false, is_nestable: true, schema } }) });
  console.log(`create ${name}: ${r.status}`);
}

// shop root: create or merge-extend
let shopSchema = {}, shopId = null;
if (byName.has("shop")) { shopId = byName.get("shop").id; shopSchema = (await api(`${base}/components/${shopId}`, { headers: H })).body.component.schema; }
let pos = Object.keys(shopSchema).length;
for (const [k, def] of Object.entries(SHOP_FIELDS)) if (!shopSchema[k]) shopSchema[k] = { ...def, pos: pos++ };
const shopBody = { component: { name: "shop", display_name: "Shop", is_root: true, is_nestable: false, schema: shopSchema } };
const res = shopId
  ? await api(`${base}/components/${shopId}`, { method: "PUT", headers: H, body: JSON.stringify(shopBody) })
  : await api(`${base}/components/`, { method: "POST", headers: H, body: JSON.stringify(shopBody) });
console.log(`shop root: ${res.status}`);
console.log("Done. Create a story of type 'shop', fill it, Publish, then point the Astro site's STORYBLOK_TOKEN/STORYBLOK_STORY at it.");
