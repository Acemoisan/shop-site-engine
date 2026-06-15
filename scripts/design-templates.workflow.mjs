export const meta = {
  name: 'design-60-templates',
  description: 'Research web-design conventions for 20 industries, then author 60 bespoke self-contained Astro template pages (3 divergent variants each)',
  phases: [
    { title: 'Research', detail: 'one designer-researcher per category scours real sites and specs a 3-variant design system' },
    { title: 'Build', detail: 'one builder per variant authors a complete self-contained index.astro' },
  ],
}

// ---- Category / variant catalogue (mirrors scripts/scaffold-templates.mjs) ----
const CATEGORIES = [
  { key: 'barber', title: 'Barbershop', industry: "men's grooming & barbershop", variants: [
    ['vintage', 'Vintage industrial — dark walnut & brass, Americana heritage, leather textures'],
    ['modern', 'Modern minimal — light editorial, generous whitespace, refined sans'],
    ['street', 'Bold retro-streetwear — high-contrast graphic, halftone, energetic'] ] },
  { key: 'coffee', title: 'Specialty Coffee & Cafe', industry: 'specialty coffee roaster / cafe', variants: [
    ['artisan', 'Warm artisanal — kraft & earth tones, hand-drawn marks, tactile'],
    ['editorial', 'Editorial magazine — big serif headlines, large imagery, columns'],
    ['nordic', 'Nordic minimal — pastel, airy, soft grid, calm'] ] },
  { key: 'dining', title: 'Fine-Dining Restaurant', industry: 'fine-dining restaurant', variants: [
    ['luxe', 'Dark luxe — gold on charcoal, elegant serif, moody plated photography'],
    ['rustic', 'Rustic farm-to-table — textured earthy palette, warm, handcrafted'],
    ['contemporary', 'Contemporary chic — light, refined asymmetric grid, minimal'] ] },
  { key: 'fitness', title: 'Fitness & Gym', industry: 'fitness gym / strength studio', variants: [
    ['hardcore', 'Dark high-energy — neon accent, oversized condensed type, aggressive'],
    ['boutique', 'Boutique studio — bright, friendly, rounded shapes, welcoming'],
    ['performance', 'Athletic performance-tech — sleek data-driven, sharp, modern'] ] },
  { key: 'yoga', title: 'Yoga & Wellness Studio', industry: 'yoga & wellness studio', variants: [
    ['serene', 'Serene minimal — soft neutrals, organic blob shapes, breathing space'],
    ['earthy', 'Earthy botanical — terracotta & sage, natural textures'],
    ['spirit', 'Modern spiritual — gentle gradients, calm motion, ethereal'] ] },
  { key: 'medspa', title: 'Med Spa & Beauty', industry: 'med spa / aesthetic beauty clinic', variants: [
    ['clinical', 'Luxe clinical — blush & cream, elegant serif, trustworthy'],
    ['glow', 'Glowy gradient — dewy pastel, soft glassy cards, radiant'],
    ['editorial', 'Editorial beauty — high-fashion black & white, bold'] ] },
  { key: 'dental', title: 'Dental & Medical Clinic', industry: 'dental / medical clinic', variants: [
    ['friendly', 'Friendly clean — bright teal/blue, rounded, reassuring trust signals'],
    ['premium', 'Premium calm — muted sage, spacious, refined'],
    ['modern', 'Modern care — fresh, light illustration, approachable'] ] },
  { key: 'law', title: 'Law Firm', industry: 'law firm / attorneys', variants: [
    ['classic', 'Classic authoritative — navy & gold, serif, gravitas'],
    ['modern', 'Modern firm — slate & sans, confident, structured'],
    ['boutique', 'Boutique legal — warm, human, approachable'] ] },
  { key: 'realestate', title: 'Real Estate & Property', industry: 'luxury real estate agency', variants: [
    ['luxury', 'Luxury property — dark & gold, full-bleed architectural photography'],
    ['bright', 'Bright modern — clean listings grid, light, crisp'],
    ['agent', 'Boutique personal-brand agent — editorial, story-led'] ] },
  { key: 'auto', title: 'Auto Detailing & Garage', industry: 'auto detailing / performance garage', variants: [
    ['rugged', 'Rugged industrial — carbon & safety-orange, aggressive angles'],
    ['premium', 'Premium detailing — black & chrome, sleek, glossy'],
    ['retro', 'Retro garage — vintage signage, warm, route-66 nostalgia'] ] },
  { key: 'saas', title: 'SaaS / Tech Product', industry: 'B2B SaaS software product', variants: [
    ['gradient', 'Modern gradient — glassmorphism, floating product UI mockups'],
    ['dark', 'Dark developer tool — mono accents, terminal/code motifs'],
    ['clean', 'Clean startup — bright, friendly spot illustration, simple'] ] },
  { key: 'agency', title: 'Creative Agency', industry: 'creative / branding agency', variants: [
    ['brutalist', 'Brutalist bold — oversized raw type, hard borders, marquee'],
    ['sleek', 'Sleek studio — refined, motion-forward, sophisticated'],
    ['playful', 'Playful colorful — experimental grid, sticker shapes, fun'] ] },
  { key: 'photography', title: 'Photographer Portfolio', industry: 'professional photographer portfolio', variants: [
    ['gallery', 'Minimal gallery — image-first, tiny type, masonry'],
    ['folio', 'Editorial folio — serif, storytelling, large captions'],
    ['cinematic', 'Dark cinematic — full-screen imagery, dramatic, moody'] ] },
  { key: 'architecture', title: 'Architecture & Interiors', industry: 'architecture / interior-design studio', variants: [
    ['swiss', 'Monochrome Swiss grid — precise, restrained, typographic'],
    ['warm', 'Warm interior — editorial, tactile materials, inviting'],
    ['dramatic', 'Bold architectural — dramatic scale, full-bleed structure'] ] },
  { key: 'tattoo', title: 'Tattoo Studio', industry: 'tattoo studio', variants: [
    ['ornate', 'Dark ornamental — gothic, gold filigree, engraved'],
    ['traditional', 'American traditional — bold red/black, flash sheets'],
    ['fineline', 'Fine-line minimal — light, delicate, airy'] ] },
  { key: 'brewery', title: 'Craft Brewery & Taproom', industry: 'craft brewery / taproom', variants: [
    ['craft', 'Craft bold — badge logos, kraft texture, hand-lettering'],
    ['industrial', 'Industrial taproom — dark, copper, raw concrete'],
    ['hazy', 'Hazy modern IPA — vibrant gradient, playful, juicy'] ] },
  { key: 'fashion', title: 'Fashion & Apparel', industry: 'fashion / apparel e-commerce', variants: [
    ['luxe', 'Luxe fashion — editorial black & white, oversized imagery'],
    ['streetwear', 'Streetwear drop — bold, energetic, countdown hype'],
    ['minimal', 'Minimal store — clean neutral product grid, quiet'] ] },
  { key: 'jewelry', title: 'Jewelry Brand', industry: 'fine jewelry brand', variants: [
    ['elegant', 'Elegant timeless — cream & gold, delicate serif'],
    ['modernlux', 'Modern lux — dark, sparkling highlights, refined'],
    ['artisan', 'Artisan handcrafted — warm, organic, maker story'] ] },
  { key: 'hotel', title: 'Boutique Hotel & Resort', industry: 'boutique hotel / resort', variants: [
    ['coastal', 'Coastal serene — sand & sea-blue, airy, breezy'],
    ['urban', 'Urban luxe — dark, sophisticated, city sophistication'],
    ['lodge', 'Mountain lodge — rustic warm wood, cozy, fireside'] ] },
  { key: 'music', title: 'Music Artist & Band', industry: 'music artist / band', variants: [
    ['electric', 'Dark electric — neon, kinetic, high-energy'],
    ['indie', 'Indie warm — vintage film grain, analog, intimate'],
    ['poster', 'Bold gig-poster — oversized type, graphic, riso-print'] ] },
]

const categories = CATEGORIES.map(c => ({
  key: c.key, title: c.title, industry: c.industry,
  items: c.variants.map(([variant, direction]) => ({ slug: `tmpl-${c.key}-${variant}`, variant, direction })),
}))

// ---------------------------- Schemas ----------------------------
const HEX = { type: 'string', description: 'CSS hex color like #1a2b3c' }
const BRIEF_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['overview', 'recommendedSections', 'signatureComponents', 'sampleBrand', 'sampleContent', 'imageryDirection', 'variantSpecs'],
  properties: {
    overview: { type: 'string', description: 'What design language this industry consistently uses (color, type, layout, tone) — grounded in real sites you reviewed.' },
    recommendedSections: { type: 'array', minItems: 6, maxItems: 9, items: {
      type: 'object', additionalProperties: false, required: ['name', 'purpose'],
      properties: { name: { type: 'string' }, purpose: { type: 'string' } } } },
    signatureComponents: { type: 'array', minItems: 4, items: { type: 'string' }, description: 'Distinctive UI components/patterns worth showcasing for this industry (e.g. menu cards, before/after slider, booking bar, bento grid).' },
    sampleBrand: { type: 'string', description: 'An invented brand name to use across all 3 variants (or note that each variant should differ).' },
    sampleContent: { type: 'string', description: 'Realistic copy to populate pages: headline options, taglines, 4-6 services/menu items/products WITH prices, 2-3 short testimonials with names, hours, address/phone. Plain text/markdown.' },
    imageryDirection: { type: 'string', description: 'What the imagery should depict and how to treat it (duotone, grayscale, warm, etc.).' },
    variantSpecs: { type: 'array', minItems: 3, maxItems: 3, items: {
      type: 'object', additionalProperties: false,
      required: ['variant', 'moodKeywords', 'palette', 'fonts'],
      properties: {
        variant: { type: 'string', description: 'the variant key this spec is for' },
        moodKeywords: { type: 'string' },
        palette: { type: 'object', additionalProperties: false, required: ['bg', 'fg', 'primary', 'primaryFg', 'accent', 'muted', 'border'],
          properties: { bg: HEX, fg: HEX, primary: HEX, primaryFg: HEX, accent: HEX, muted: HEX, border: HEX } },
        fonts: { type: 'object', additionalProperties: false, required: ['displayFamily', 'bodyFamily', 'googleFontsHref'],
          properties: { displayFamily: { type: 'string' }, bodyFamily: { type: 'string' },
            googleFontsHref: { type: 'string', description: 'A working https://fonts.googleapis.com/css2?... href loading both families.' } } },
      } } },
    realWorldReferences: { type: 'array', items: { type: 'object', additionalProperties: false,
      required: ['name', 'whatToSteal'], properties: { name: { type: 'string' }, url: { type: 'string' }, whatToSteal: { type: 'string' } } } },
  },
}
const BUILD_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['slug', 'brandName', 'tagline', 'sections', 'signatureComponents', 'paletteHex', 'oneLineDescription'],
  properties: {
    slug: { type: 'string' }, brandName: { type: 'string' }, tagline: { type: 'string' },
    sections: { type: 'array', items: { type: 'string' } },
    signatureComponents: { type: 'array', items: { type: 'string' }, description: 'The notable/novel components you actually built into this page.' },
    paletteHex: { type: 'object', additionalProperties: false, required: ['bg', 'primary', 'accent'],
      properties: { bg: HEX, primary: HEX, accent: HEX } },
    oneLineDescription: { type: 'string' },
  },
}

// ---------------------------- Prompts ----------------------------
function researchPrompt(c) {
  const vs = c.items.map(it => `  - "${it.variant}": ${it.direction}`).join('\n')
  return `You are a senior brand & web designer producing a design brief for the **${c.title}** category (${c.industry}).

SCOUR THE REAL WEB FIRST. Use WebSearch and WebFetch to look at actual current websites in this space and design-award galleries (Awwwards, Land-book, SiteInspire, Godly, Dribbble). Catalogue the *consistent, recognizable* design language these sites share: color tendencies, typography (typeface styles, pairings), layout conventions, signature components, imagery style, tone of voice, and which conversion sections they always include. If web tools are unavailable, fall back to your expert knowledge — but try the web first.

We will build THREE deliberately DIVERGENT template variants for this category. Each must look like a different studio made it:
${vs}

Deliver a single design brief that (a) captures the category's shared conventions and (b) gives each of the 3 variants a concrete, distinct design system: a 7-color HEX palette (bg, fg, primary, primaryFg, accent, muted, border) that fits its direction, a real Google Font pairing (display + body) with a WORKING Google Fonts css2 href that loads BOTH families, and mood keywords. The three palettes/type systems must be clearly different from each other.

Also provide: 6–9 recommended page sections (name + purpose) suited to this industry's conversion needs; a list of signature/unique components worth showcasing; an invented sample brand name; and realistic sample copy (headlines, tagline, 4–6 services/menu/products WITH prices, 2–3 short named testimonials, hours, a plausible address + phone) so builders never use lorem ipsum.

Return ONLY the structured object.`
}

function buildPrompt(c, brief, vspec, it) {
  const path = `sites/${it.slug}/src/pages/index.astro`
  const briefJson = JSON.stringify({
    overview: brief && brief.overview, recommendedSections: brief && brief.recommendedSections,
    signatureComponents: brief && brief.signatureComponents, sampleBrand: brief && brief.sampleBrand,
    sampleContent: brief && brief.sampleContent, imageryDirection: brief && brief.imageryDirection,
  }, null, 2)
  const vspecJson = JSON.stringify(vspec, null, 2)
  return `You are an elite front-end designer. Author ONE complete, beautiful, fully self-contained Astro page and WRITE it to: \`${path}\` (path relative to the repository root). Use the Write tool to create that exact file.

CATEGORY: ${c.title} (${c.industry})
THIS VARIANT: "${it.variant}" — ${it.direction}

CATEGORY DESIGN BRIEF (shared research):
${briefJson}

THIS VARIANT'S DESIGN SYSTEM (use these exact colors + fonts):
${vspecJson}
If the variant spec above is null/missing, design a fitting palette + Google Font pairing yourself that matches the variant direction.

HARD REQUIREMENTS — the page MUST:
1. Be a single valid Astro file: optional \`---\` frontmatter holding plain JS data arrays (services, testimonials, nav, etc.), then a full document from \`<html lang="en">\` to \`</html>\`. It must build cleanly with \`astro build\`.
2. Be FULLY SELF-CONTAINED. No imports of components or CSS. Do NOT import Tailwind or rely on Tailwind classes. Style everything inside ONE scoped \`<style>\` block (you may also use \`<style is:global>\` for @font-face/resets). You MAY include up to one small inline vanilla \`<script>\` for nav toggle / scroll-reveal / a slider — no external libraries.
3. \`<head>\`: charset, viewport, a real \`<title>\`, a meta description, and the variant's Google Fonts \`<link>\` (preconnect + the css2 href from the spec).
4. Implement the variant's palette as CSS custom properties on :root and use them throughout. Honor the variant DIRECTION strongly — these three siblings must look unmistakably different.
5. Include 6–9 distinct, well-crafted SECTIONS appropriate to this industry (use the brief's recommendedSections as a guide): e.g. a sticky/responsive nav, a striking hero, and the right mix of story/about, services-or-menu-or-products with prices, gallery, social proof/testimonials, stats, hours/location with NAP, a clear conversion CTA (book/call/order/subscribe), and a footer.
6. Showcase at least 2 NOVEL/interesting components beyond plain stacked sections — e.g. bento grid, marquee/ticker, horizontal-scroll gallery, before/after, sticky-scroll feature, pricing tiers, accordion FAQ, CSS testimonial slider, animated stat counters, image+text split, lookbook, booking bar. Vary these from what a sibling variant would obviously do.
7. Use REAL invented copy from the brief's sampleContent (brand name, headlines, named services/items with prices, named testimonials, hours, address, phone). Never lorem ipsum.
8. IMAGERY: every raster image MUST come from Lorem Picsum so it always loads — \`https://picsum.photos/seed/<unique-seed>/<w>/<h>\` (you may add \`?grayscale\`). Use distinct seeds per image. Apply CSS treatments (gradient/color overlays, mix-blend-mode, filter duotone, object-fit:cover) so the random photos read as intentional and on-brand. Build logos/marks, patterns, and graphic flourishes with CSS/SVG and typography — no external logo/icon files, no icon CDNs (inline simple SVGs if you need icons).
9. Be mobile-first responsive: clamp() type scales, CSS grid/flex, media queries; looks great at 390px and 1440px. Include tasteful motion: transitions, hover states, and at least one scroll-reveal or animated element (respect prefers-reduced-motion).
10. Accessible: semantic landmarks, alt text, visible focus states, WCAG AA contrast, 44px tap targets.

Make it genuinely impressive and distinct — this is a showcase template, not a wireframe. Target roughly 200–480 lines. After writing the file, return ONLY the structured object describing what you built.`
}

// ---------------------------- Run ----------------------------
log(`Designing 60 templates across ${categories.length} categories...`)
const results = await pipeline(
  categories,
  c => agent(researchPrompt(c), { label: `research:${c.key}`, phase: 'Research', schema: BRIEF_SCHEMA }),
  (brief, c) => parallel(c.items.map(it => () => {
    const vspec = brief && Array.isArray(brief.variantSpecs)
      ? brief.variantSpecs.find(s => s && s.variant === it.variant) || null : null
    return agent(buildPrompt(c, brief, vspec, it), { label: `build:${it.slug}`, phase: 'Build', schema: BUILD_SCHEMA })
      .then(r => r ? { ...r, slug: it.slug, category: c.key, categoryTitle: c.title, variant: it.variant, direction: it.direction } : null)
  })),
)

const built = results.flat().filter(Boolean)
const briefsOut = [] // research briefs are embedded per-category result via closure not retained; report counts
log(`Built ${built.length}/60 template pages.`)
return { count: built.length, built }
