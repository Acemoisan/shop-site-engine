// Scaffolds 60 standalone Astro template sites (20 categories x 3 variants).
// Writes identical, robust boilerplate per site; the bespoke src/pages/index.astro
// is authored later by the design workflow. Also emits docs/templates-manifest.json.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** 20 diverse categories, each with 3 deliberately divergent design directions. */
const CATEGORIES = [
  {
    key: "barber", title: "Barbershop", industry: "men's grooming & barbershop",
    variants: [
      ["vintage", "Vintage industrial — dark walnut & brass, Americana heritage, leather textures"],
      ["modern", "Modern minimal — light editorial, generous whitespace, refined sans"],
      ["street", "Bold retro-streetwear — high-contrast graphic, halftone, energetic"],
    ],
  },
  {
    key: "coffee", title: "Specialty Coffee & Cafe", industry: "specialty coffee roaster / cafe",
    variants: [
      ["artisan", "Warm artisanal — kraft & earth tones, hand-drawn marks, tactile"],
      ["editorial", "Editorial magazine — big serif headlines, large imagery, columns"],
      ["nordic", "Nordic minimal — pastel, airy, soft grid, calm"],
    ],
  },
  {
    key: "dining", title: "Fine-Dining Restaurant", industry: "fine-dining restaurant",
    variants: [
      ["luxe", "Dark luxe — gold on charcoal, elegant serif, moody plated photography"],
      ["rustic", "Rustic farm-to-table — textured earthy palette, warm, handcrafted"],
      ["contemporary", "Contemporary chic — light, refined asymmetric grid, minimal"],
    ],
  },
  {
    key: "fitness", title: "Fitness & Gym", industry: "fitness gym / strength studio",
    variants: [
      ["hardcore", "Dark high-energy — neon accent, oversized condensed type, aggressive"],
      ["boutique", "Boutique studio — bright, friendly, rounded shapes, welcoming"],
      ["performance", "Athletic performance-tech — sleek data-driven, sharp, modern"],
    ],
  },
  {
    key: "yoga", title: "Yoga & Wellness Studio", industry: "yoga & wellness studio",
    variants: [
      ["serene", "Serene minimal — soft neutrals, organic blob shapes, breathing space"],
      ["earthy", "Earthy botanical — terracotta & sage, natural textures"],
      ["spirit", "Modern spiritual — gentle gradients, calm motion, ethereal"],
    ],
  },
  {
    key: "medspa", title: "Med Spa & Beauty", industry: "med spa / aesthetic beauty clinic",
    variants: [
      ["clinical", "Luxe clinical — blush & cream, elegant serif, trustworthy"],
      ["glow", "Glowy gradient — dewy pastel, soft glassy cards, radiant"],
      ["editorial", "Editorial beauty — high-fashion black & white, bold"],
    ],
  },
  {
    key: "dental", title: "Dental & Medical Clinic", industry: "dental / medical clinic",
    variants: [
      ["friendly", "Friendly clean — bright teal/blue, rounded, reassuring trust signals"],
      ["premium", "Premium calm — muted sage, spacious, refined"],
      ["modern", "Modern care — fresh, light illustration, approachable"],
    ],
  },
  {
    key: "law", title: "Law Firm", industry: "law firm / attorneys",
    variants: [
      ["classic", "Classic authoritative — navy & gold, serif, gravitas"],
      ["modern", "Modern firm — slate & sans, confident, structured"],
      ["boutique", "Boutique legal — warm, human, approachable"],
    ],
  },
  {
    key: "realestate", title: "Real Estate & Property", industry: "luxury real estate agency",
    variants: [
      ["luxury", "Luxury property — dark & gold, full-bleed architectural photography"],
      ["bright", "Bright modern — clean listings grid, light, crisp"],
      ["agent", "Boutique personal-brand agent — editorial, story-led"],
    ],
  },
  {
    key: "auto", title: "Auto Detailing & Garage", industry: "auto detailing / performance garage",
    variants: [
      ["rugged", "Rugged industrial — carbon & safety-orange, aggressive angles"],
      ["premium", "Premium detailing — black & chrome, sleek, glossy"],
      ["retro", "Retro garage — vintage signage, warm, route-66 nostalgia"],
    ],
  },
  {
    key: "saas", title: "SaaS / Tech Product", industry: "B2B SaaS software product",
    variants: [
      ["gradient", "Modern gradient — glassmorphism, floating product UI mockups"],
      ["dark", "Dark developer tool — mono accents, terminal/code motifs"],
      ["clean", "Clean startup — bright, friendly spot illustration, simple"],
    ],
  },
  {
    key: "agency", title: "Creative Agency", industry: "creative / branding agency",
    variants: [
      ["brutalist", "Brutalist bold — oversized raw type, hard borders, marquee"],
      ["sleek", "Sleek studio — refined, motion-forward, sophisticated"],
      ["playful", "Playful colorful — experimental grid, sticker shapes, fun"],
    ],
  },
  {
    key: "photography", title: "Photographer Portfolio", industry: "professional photographer portfolio",
    variants: [
      ["gallery", "Minimal gallery — image-first, tiny type, masonry"],
      ["folio", "Editorial folio — serif, storytelling, large captions"],
      ["cinematic", "Dark cinematic — full-screen imagery, dramatic, moody"],
    ],
  },
  {
    key: "architecture", title: "Architecture & Interiors", industry: "architecture / interior-design studio",
    variants: [
      ["swiss", "Monochrome Swiss grid — precise, restrained, typographic"],
      ["warm", "Warm interior — editorial, tactile materials, inviting"],
      ["dramatic", "Bold architectural — dramatic scale, full-bleed structure"],
    ],
  },
  {
    key: "tattoo", title: "Tattoo Studio", industry: "tattoo studio",
    variants: [
      ["ornate", "Dark ornamental — gothic, gold filigree, engraved"],
      ["traditional", "American traditional — bold red/black, flash sheets"],
      ["fineline", "Fine-line minimal — light, delicate, airy"],
    ],
  },
  {
    key: "brewery", title: "Craft Brewery & Taproom", industry: "craft brewery / taproom",
    variants: [
      ["craft", "Craft bold — badge logos, kraft texture, hand-lettering"],
      ["industrial", "Industrial taproom — dark, copper, raw concrete"],
      ["hazy", "Hazy modern IPA — vibrant gradient, playful, juicy"],
    ],
  },
  {
    key: "fashion", title: "Fashion & Apparel", industry: "fashion / apparel e-commerce",
    variants: [
      ["luxe", "Luxe fashion — editorial black & white, oversized imagery"],
      ["streetwear", "Streetwear drop — bold, energetic, countdown hype"],
      ["minimal", "Minimal store — clean neutral product grid, quiet"],
    ],
  },
  {
    key: "jewelry", title: "Jewelry Brand", industry: "fine jewelry brand",
    variants: [
      ["elegant", "Elegant timeless — cream & gold, delicate serif"],
      ["modernlux", "Modern lux — dark, sparkling highlights, refined"],
      ["artisan", "Artisan handcrafted — warm, organic, maker story"],
    ],
  },
  {
    key: "hotel", title: "Boutique Hotel & Resort", industry: "boutique hotel / resort",
    variants: [
      ["coastal", "Coastal serene — sand & sea-blue, airy, breezy"],
      ["urban", "Urban luxe — dark, sophisticated, city sophistication"],
      ["lodge", "Mountain lodge — rustic warm wood, cozy, fireside"],
    ],
  },
  {
    key: "music", title: "Music Artist & Band", industry: "music artist / band",
    variants: [
      ["electric", "Dark electric — neon, kinetic, high-energy"],
      ["indie", "Indie warm — vintage film grain, analog, intimate"],
      ["poster", "Bold gig-poster — oversized type, graphic, riso-print"],
    ],
  },
];

const manifest = [];
for (const c of CATEGORIES) {
  for (const [variant, direction] of c.variants) {
    manifest.push({
      slug: `tmpl-${c.key}-${variant}`,
      category: c.key,
      categoryTitle: c.title,
      industry: c.industry,
      variant,
      direction,
    });
  }
}

const pkg = (slug) => JSON.stringify({
  name: slug,
  type: "module",
  version: "0.0.0",
  private: true,
  scripts: { dev: "astro dev", build: "astro build", preview: "astro preview" },
  dependencies: {
    astro: "^5.0.0",
    "@tailwindcss/vite": "^4.0.0",
    tailwindcss: "^4.0.0",
  },
}, null, 2) + "\n";

const astroConfig =
`import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
});
`;

const tsconfig = JSON.stringify({
  extends: "astro/tsconfigs/base",
  include: [".astro/types.d.ts", "**/*"],
  exclude: ["dist"],
}, null, 2) + "\n";

const baseCss = `@import "tailwindcss";\n`;

let made = 0;
for (const t of manifest) {
  const dir = join(ROOT, "sites", t.slug);
  mkdirSync(join(dir, "src", "pages"), { recursive: true });
  mkdirSync(join(dir, "src", "styles"), { recursive: true });
  mkdirSync(join(dir, "public"), { recursive: true });
  writeFileSync(join(dir, "package.json"), pkg(t.slug));
  writeFileSync(join(dir, "astro.config.mjs"), astroConfig);
  writeFileSync(join(dir, "tsconfig.json"), tsconfig);
  writeFileSync(join(dir, "src", "styles", "base.css"), baseCss);
  made++;
}

mkdirSync(join(ROOT, "docs"), { recursive: true });
writeFileSync(join(ROOT, "docs", "templates-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

console.log(`Scaffolded ${made} sites across ${CATEGORIES.length} categories.`);
console.log(`Manifest -> docs/templates-manifest.json (${manifest.length} entries)`);
