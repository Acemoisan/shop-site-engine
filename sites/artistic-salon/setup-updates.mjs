/**
 * One-shot Storyblok setup for the Artistic Salon "Updates" carousel.
 *
 * Creates (idempotently) in the shared space:
 *   - a nestable `shop_update` block  { heading, body, image(asset) }
 *   - a root content type `updates_page` with a repeatable `updates` bloks field
 *   - the `artistic-salon` story, seeded + published with sample updates
 *
 * The Astro build (src/pages/index.astro) reads story.content.updates and maps
 * each item to a carousel card, with a local seed fallback if the CMS is down.
 *
 * Run from repo root (token is read from env — never hard-code it):
 *   SB_PAT=sb_pat_xxx SB_SPACE=293216603859160 node sites/artistic-salon/setup-updates.mjs
 *
 * SB_PAT  = Storyblok Management / Personal Access token (write).
 * SB_SPACE defaults to the shared demos space 293216603859160.
 */
const PAT = process.env.SB_PAT;
const SPACE = process.env.SB_SPACE || "293216603859160";
const SLUG = "artistic-salon";
// Distinct images for the seed point at the live site; the client replaces
// these by uploading their own from desktop in Storyblok (the field is an asset).
const BASE = "https://artistic-salon.pages.dev";

if (!PAT) {
  console.error("Missing SB_PAT (Storyblok Management token). Aborting.");
  process.exit(1);
}

const API = `https://mapi.storyblok.com/v1/spaces/${SPACE}`;
const headers = { Authorization: PAT, "Content-Type": "application/json" };

async function api(path, init = {}) {
  const res = await fetch(API + path, { ...init, headers });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
  if (!res.ok) throw new Error(`${init.method || "GET"} ${path} → ${res.status}: ${text}`);
  return json;
}

async function ensureComponent(def) {
  const { components } = await api("/components/");
  const existing = components.find((c) => c.name === def.name);
  if (existing) {
    console.log(`✓ component '${def.name}' already exists (#${existing.id})`);
    return existing;
  }
  const { component } = await api("/components/", { method: "POST", body: JSON.stringify({ component: def }) });
  console.log(`+ created component '${def.name}' (#${component.id})`);
  return component;
}

function uid(n) { return `seed-update-${n}`; }

const seed = [
  { heading: "Summer glow season", body: "This June we're all about that effortless, sun-kissed glow — the kind that looks like you just got back from somewhere wonderful. Ask your stylist about a balayage or a gloss refresh to brighten up for the season.", img: "/img/work-4.webp" },
  { heading: "Grad & wedding season is here", body: "Updos, blowouts and special-occasion styling are booking up fast. Reserve your chair early so you're picture-perfect for the big day — and bring a photo of the look you're after.", img: "/img/work-5.webp" },
  { heading: "Fresh looks for the guys", body: "From sharp scissor cuts to beard tidy-ups and men's colour, our barbering side is busier than ever. Walk in when a chair's free or call ahead to book your spot.", img: "/img/work-6.webp" },
  { heading: "Welcome our newest apprentices", body: "MJ and Danielle are now taking guests at friendly apprentice rates — a great way to try the salon and a fresh look while supporting up-and-coming talent.", img: "/img/work-1.webp" },
];

async function main() {
  // 1) blocks
  await ensureComponent({
    name: "shop_update",
    display_name: "Update",
    is_nestable: true,
    is_root: false,
    schema: {
      heading: { type: "text", pos: 0 },
      body: { type: "textarea", pos: 1 },
      image: { type: "asset", filetypes: ["images"], pos: 2 },
    },
  });
  await ensureComponent({
    name: "updates_page",
    display_name: "Updates Page",
    is_nestable: false,
    is_root: true,
    schema: {
      updates: { type: "bloks", restrict_components: true, component_whitelist: ["shop_update"], pos: 0 },
    },
  });

  // 2) story (create or update-in-place without clobbering)
  const found = await api(`/stories/?with_slug=${SLUG}`);
  const content = {
    component: "updates_page",
    updates: seed.map((u, n) => ({
      component: "shop_update",
      _uid: uid(n),
      heading: u.heading,
      body: u.body,
      image: { fieldtype: "asset", filename: BASE + u.img, alt: u.heading },
    })),
  };

  if (found.stories && found.stories.length) {
    const id = found.stories[0].id;
    // Don't clobber client edits: only seed updates if the story has none yet.
    const { story } = await api(`/stories/${id}`);
    if (Array.isArray(story.content.updates) && story.content.updates.length) {
      console.log(`✓ story '${SLUG}' already has ${story.content.updates.length} update(s) — leaving as-is`);
    } else {
      story.content = content;
      await api(`/stories/${id}`, { method: "PUT", body: JSON.stringify({ story, publish: 1 }) });
      console.log(`+ seeded existing story '${SLUG}' (#${id}) with ${seed.length} updates + published`);
    }
  } else {
    const { story } = await api("/stories/", { method: "POST", body: JSON.stringify({ story: { name: "Artistic Salon — Updates", slug: SLUG, content }, publish: 1 }) });
    console.log(`+ created + published story '${SLUG}' (#${story.id}) with ${seed.length} updates`);
  }

  console.log("\nDone. Rebuild the site and the carousel reads from Storyblok:");
  console.log("  pnpm --filter artistic-salon build   (look for 'content source: Storyblok')");
}

main().catch((e) => { console.error("\n✗ Setup failed:\n" + e.message); process.exit(1); });
