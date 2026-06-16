# 60 Website Templates — Catalogue

20 industries × 3 divergent variants. Every template is a **standalone Astro site** under `sites/`, fully self-contained (scoped CSS, no shared components), each on a fixed localhost port.

## How to view

**All at once (recommended):**

```
node scripts/build-gallery.mjs   # compile all 60 (already run)
node scripts/serve-gallery.mjs   # then open http://localhost:4300 (use this, not `npx serve -s`)
```

**One at a time** (live dev server for editing): `pnpm --filter <slug> dev` → opens at its fixed port below.

---

## Barbershop

### Ironclad Barber Co. — *vintage*  ·  [`http://localhost:4301`](http://localhost:4301)

- **Slug / port:** `tmpl-barber-vintage` · port `4301` · `pnpm --filter tmpl-barber-vintage dev`
- **Direction:** Vintage industrial — dark walnut & brass, Americana heritage, leather textures
- **Tagline:** “Old-school craft, dialed in. Est. 2014.”
- **Summary:** A vintage-industrial barbershop template for Ironclad Barber Co. — dark walnut and brass with Oswald display type, sepia-graded documentary photography, an animated rotating heritage seal, and a conversion-first single-page flow.
- **Palette:** bg `#1c1714` · primary `#b8893f` · accent `#8c3b2e`
- **Signature components:** Animated SVG heritage seal with circular textPath wordmark that slowly rotates; Dotted-leader service menu rows pairing price and duration with hover slide-in; Bento gallery using tall/wide grid spans and sepia duotone filters; Oxblood CSS marquee ticker section divider; Sepia-graded hero with SVG fractal-noise grain overlay and parallax-style band; Barber roster cards with specialty tags and per-barber booking actions

### Ironclad Barber Co. — *modern*  ·  [`http://localhost:4302`](http://localhost:4302)

- **Slug / port:** `tmpl-barber-modern` · port `4302` · `pnpm --filter tmpl-barber-modern dev`
- **Direction:** Modern minimal — light editorial, generous whitespace, refined sans
- **Tagline:** “Calgary's chair for the classic cut and the modern fade.”
- **Summary:** A light editorial, whitespace-generous barbershop template with Fraunces/Inter type pairing, brass accents, and a conversion-first single-page flow.
- **Palette:** bg `#faf8f4` · primary `#1a1a1a` · accent `#9a7b4f`
- **Signature components:** Animated italic Fraunces marquee/ticker section divider; Bento gallery grid with dense auto-flow and span-2 tall tiles; Floating 'open today' status card overlapping the hero photo; Service menu rows with a gradient connector rule revealing price + duration at desktop width; Animated bobbing accent map pin over a graded location image; IntersectionObserver scroll-reveal with prefers-reduced-motion fallback

### Ironclad Barber Co. — *street*  ·  [`http://localhost:4303`](http://localhost:4303)

- **Slug / port:** `tmpl-barber-street` · port `4303` · `pnpm --filter tmpl-barber-street dev`
- **Direction:** Bold retro-streetwear — high-contrast graphic, halftone, energetic
- **Tagline:** “Sharp cuts. Straight talk. No appointments wasted.”
- **Summary:** A bold retro-streetwear barbershop template for Ironclad Barber Co. — high-contrast halftone, screen-print poster type (Anton/Archivo), and neo-brutalist hard shadows, fully self-contained with a conversion-first booking flow.
- **Palette:** bg `#f4f1e9` · primary `#e2231a` · accent `#1f4ed8`
- **Signature components:** Animated rotating SVG razor-crest seal in hero; CSS infinite marquee ticker of shop slogans; Bento-style gallery grid with mix-blend-mode halftone hover wash; Hard-shadow neo-brutalist buttons/cards with press-down active state; Barber roster cards with grayscale-to-color reveal and per-barber CTA; Poster headline with primary-red text-shadow + outlined accent word

## Specialty Coffee & Cafe

### Northpoint Coffee Co. — *artisan*  ·  [`http://localhost:4304`](http://localhost:4304)

- **Slug / port:** `tmpl-coffee-artisan` · port `4304` · `pnpm --filter tmpl-coffee-artisan dev`
- **Direction:** Warm artisanal — kraft & earth tones, hand-drawn marks, tactile
- **Tagline:** “Small-batch coffee, roasted in Calgary.”
- **Summary:** A warm, kraft-and-earth artisan template for a specialty coffee roaster, built as a single self-contained Astro page with sepia-washed photography, hand-craft flourishes, and full local-business conversion content.
- **Palette:** bg `#F3EAD7` · primary `#9B4A1F` · accent `#C8832B`
- **Signature components:** Rotating circular wax-seal stamp built with SVG textPath; Italic Fraunces display marquee ticker; Tasting-note tag-pill system reused across bean cards; Dotted-leader menu rows (drink name … price); Taped/rotated craft photo with animated count stats; Asymmetric bento gallery grid with sepia-duotone hover zoom; Open-now status pill + editorial hours table; Faux map with animated bobbing location pin; Sticky mobile booking bar (call + order)

### Northpoint Coffee Roasters — *editorial*  ·  [`http://localhost:4305`](http://localhost:4305)

- **Slug / port:** `tmpl-coffee-editorial` · port `4305` · `pnpm --filter tmpl-coffee-editorial dev`
- **Direction:** Editorial magazine — big serif headlines, large imagery, columns
- **Tagline:** “Slow coffee for a fast city.”
- **Summary:** An editorial, magazine-style landing page for a Calgary specialty coffee roaster — big Playfair serif headlines, full-bleed parallax hero, numbered story bands, and a tasting-note bean grid on a warm cream palette.
- **Palette:** bg `#F7F5F1` · primary `#1A1A1A` · accent `#B5462E`
- **Signature components:** Live 'Open now / Closed' status pill computed from real time against the hours schedule; CSS testimonial slider with autoplay, hover-pause, and dot controls; Editorial bean cards with origin, process, and rounded tasting-note tag pills; Full-bleed hero with JS scroll-parallax on the photography; Italic-serif marquee ticker; Asymmetric gallery bento grid with hover zoom; Numbered editorial section heads (01–04) with drop-cap story band; Sticky mobile click-to-call + get-directions booking bar

### northpoint — *nordic*  ·  [`http://localhost:4306`](http://localhost:4306)

- **Slug / port:** `tmpl-coffee-nordic` · port `4306` · `pnpm --filter tmpl-coffee-nordic dev`
- **Direction:** Nordic minimal — pastel, airy, soft grid, calm
- **Tagline:** “Small-batch coffee, roasted in Calgary.”
- **Summary:** An airy, pastel Nordic-minimal landing page for Northpoint Coffee Roasters — sage-and-terracotta on warm off-white, Cormorant Garamond display over Nunito Sans, with a soft editorial grid, tasting-note marquee, snap-scroll gallery, and a live open/closed hours pill.
- **Palette:** bg `#FBFAF8` · primary `#7C8C74` · accent `#D9A38C`
- **Signature components:** Live Open now / Closed status pill computed from real opening hours in JS; Italic Cormorant tasting-note marquee ticker (CSS keyframe scroll); Horizontal snap-scroll gallery rail with alternating tall crops and hover zoom; Bean cards with roast-level + process chips and reusable tasting-note tag pills; Overlapping hero photo collage with floating circular animated badge; Pure-CSS Inglewood map module built from layered gradients + repeating grid lines; Sticky bottom mobile booking bar (call / directions / order); Dotted-leader editorial drink price list

## Fine-Dining Restaurant

### Maison Lumiere — *luxe*  ·  [`http://localhost:4307`](http://localhost:4307)

- **Slug / port:** `tmpl-dining-luxe` · port `4307` · `pnpm --filter tmpl-dining-luxe dev`
- **Direction:** Dark luxe — gold on charcoal, elegant serif, moody plated photography
- **Tagline:** “A quiet room, a long table, an evening you'll remember.”
- **Summary:** A dark-luxe, gold-on-charcoal fine-dining template for Maison Lumiere — candlelit cinematic hero, editorially typeset tasting menu, press marquee, and a persistent Reserve CTA, fully self-contained in one Astro file.
- **Palette:** bg `#0E0E10` · primary `#C9A35B` · accent `#B8863B`
- **Signature components:** CSS-only press marquee ticker with Michelin star glyphs and masked edges; Editorially typeset menu with dotted leader lines and baseline-aligned gold prices under small-caps course headers; Full-bleed hero with infinite Ken Burns scale animation + radial/linear vignette + gold grain overlay; Asymmetric responsive image grid using grid-row/column spans that collapse gracefully; IntersectionObserver scroll-reveal honoring prefers-reduced-motion; Sticky nav that gains opaque background on scroll, with animated hamburger to slide-down mobile menu; Site-wide duotone/sepia photographic grade on all Picsum images for cohesion

### Maison Lumiere — *rustic*  ·  [`http://localhost:4308`](http://localhost:4308)

- **Slug / port:** `tmpl-dining-rustic` · port `4308` · `pnpm --filter tmpl-dining-rustic dev`
- **Direction:** Rustic farm-to-table — textured earthy palette, warm, handcrafted
- **Tagline:** “A quiet room, a long table, an evening you'll remember.”
- **Summary:** A rustic farm-to-table fine-dining template for Maison Lumiere — earthy Fraunces/Source Serif typography over a warm cream-and-walnut palette, with a cinematic Ken Burns hero, sepia-graded imagery, an editorially typeset leader-dot menu, and a persistent Reserve flow.
- **Palette:** bg `#F3EAD9` · primary `#7A5230` · accent `#9A6B3F`
- **Signature components:** Full-bleed cinematic hero with CSS Ken Burns scale animation and warm directional gradient grade; Editorially typeset menu with dotted leader lines and right-aligned prices under small-caps course headers; Autoplaying CSS/JS testimonial slider with pause-on-hover and clickable dot pagination; Asymmetric mixed-aspect gallery grid with site-wide sepia duotone filter and hover zoom for photographic cohesion; Infinite provenance marquee ticker in the brand walnut color; Inline booking affordance (date + party-size) wired to the Reserve CTA; Mobile-only sticky click-to-call strip plus scroll-reveal IntersectionObserver with reduced-motion support

### Maison Lumiere — *contemporary*  ·  [`http://localhost:4309`](http://localhost:4309)

- **Slug / port:** `tmpl-dining-contemporary` · port `4309` · `pnpm --filter tmpl-dining-contemporary dev`
- **Direction:** Contemporary chic — light, refined asymmetric grid, minimal
- **Tagline:** “A quiet room, a long table, an evening you'll remember.”
- **Summary:** A light, airy, contemporary-chic fine-dining template for Maison Lumiere — restrained sage/charcoal palette, Cormorant + Inter pairing, asymmetric editorial grids, dotted-leader menu, and a persistent Resy reservation flow, fully self-contained and building cleanly under Astro.
- **Palette:** bg `#FAFAF8` · primary `#2F3A33` · accent `#8A9A86`
- **Signature components:** Editorially typeset menu with dotted leaders and small-caps italic course headers; Asymmetric mixed-aspect-ratio gallery grid with grayscale-to-color hover; Full-bleed hero with CSS Ken Burns animation and diagonal bg-color overlay for legible type; Italic Cormorant marquee ticker on the primary green band; Overlapping private-dining inquiry card breaking the image edge; Press marquee bar with Michelin star glyph plus IntersectionObserver scroll-reveal quote cards; Mobile-only fixed Call/Reserve action strip

## Fitness & Gym

### IRONGRID Strength Co. — *hardcore*  ·  [`http://localhost:4310`](http://localhost:4310)

- **Slug / port:** `tmpl-fitness-hardcore` · port `4310` · `pnpm --filter tmpl-fitness-hardcore dev`
- **Direction:** Dark high-energy — neon accent, oversized condensed type, aggressive
- **Tagline:** “Coached strength training for every body — no egos, just progress.”
- **Summary:** A dark, high-energy hardcore-gym landing page for IRONGRID Strength Co. with oversized Anton condensed caps, a neon-lime accent on near-black, full-bleed gritty hero, and the full fitness conversion stack (programs, pricing, coaches, results slider, schedule, NAP).
- **Palette:** bg `#0A0B0D` · primary `#C6F800` · accent `#FF3B30`
- **Signature components:** Animated count-up stat strip driven by IntersectionObserver (reduced-motion aware); Neon-lime auto-scrolling marquee ticker under the hero; Auto-rotating CSS testimonial slider with bar-style dot tabs and pause-on-hover; Membership pricing tiers with a glowing neon 'Most Popular' card; Schedule timetable rows with hover slide and per-slot Reserve buttons; Sticky thumb-zone 'Book a Free Intro Class' booking bar on mobile; Duotone hover-reveal program/coach photo cards (grayscale-to-color, scale on hover); CSS-only diamond brand mark with offset red shadow

### Irongrid Studio — *boutique*  ·  [`http://localhost:4311`](http://localhost:4311)

- **Slug / port:** `tmpl-fitness-boutique` · port `4311` · `pnpm --filter tmpl-fitness-boutique dev`
- **Direction:** Boutique studio — bright, friendly, rounded shapes, welcoming
- **Tagline:** “Coached strength training for every body — no egos, just progress.”
- **Summary:** A bright, welcoming boutique strength-studio template with rounded shapes, warm coral-and-honey palette, and a Fraunces/Nunito Sans pairing — full of friendly polish and conversion-complete sections.
- **Palette:** bg `#FFF8F2` · primary `#FF6B5C` · accent `#FFC857`
- **Signature components:** Animated stat counters that ease-count up on scroll into view; Italic Fraunces marquee ticker with accent dividers; Auto-rotating CSS/JS testimonial slider with accessible dot tablist; Weekly schedule grid with per-slot Reserve pills sized for thumb taps; Pricing tier cards with featured ribbon and CSS checkmark feature list; Tilted hero photo card framed in white with floating animated blobs and a hand-drawn-style highlight underline; Sticky bottom mobile booking bar (Call + Book) in the thumb zone

### IRONGRID / Performance Lab — *performance*  ·  [`http://localhost:4312`](http://localhost:4312)

- **Slug / port:** `tmpl-fitness-performance` · port `4312` · `pnpm --filter tmpl-fitness-performance dev`
- **Direction:** Athletic performance-tech — sleek data-driven, sharp, modern
- **Tagline:** “Train Like It Matters.”
- **Summary:** A sleek, data-driven strength-gym landing page in a monochrome athletic-tech style with a blue/teal data accent, animated metric counters, an intensity-graded program grid, a color-coded weekly schedule, and full NAP + JSON-LD conversion essentials.
- **Palette:** bg `#0E1217` · primary `#3B82F6` · accent `#22D3A8`
- **Signature components:** Animated stat counters with requestAnimationFrame easing, locale formatting, decimals support and prefers-reduced-motion fallback; Program cards with a gradient intensity meter (INTENSITY 92) driven by a CSS custom property; Color-coded weekly schedule timetable grid with per-slot Reserve buttons and a class-type legend; CSS/JS testimonial slider with transform-based track, autoplay, and tab-role dot controls; Sticky thumb-zone mobile booking bar (Book + Call) with safe-area inset padding; Engineered grid-line overlays masked with radial gradients on hero and CTA for an athletic-tech data feel; CSS-only brand mark built from a conic-gradient square (no external assets)

## Yoga & Wellness Studio

### Lumen & Lotus Yoga — *serene*  ·  [`http://localhost:4313`](http://localhost:4313)

- **Slug / port:** `tmpl-yoga-serene` · port `4313` · `pnpm --filter tmpl-yoga-serene dev`
- **Direction:** Serene minimal — soft neutrals, organic blob shapes, breathing space
- **Tagline:** “Move slow. Breathe deep. Begin again.”
- **Summary:** A serene, minimal yoga studio landing page for Lumen & Lotus — soft oat neutrals, sage and clay accents, Fraunces/Mulish pairing, organic blob-arch photo masks, a filterable class schedule, testimonial slider, and a sticky book-a-class bar.
- **Palette:** bg `#F6F2EC` · primary `#8A9A7B` · accent `#C9A98C`
- **Signature components:** Filterable schedule timetable that hides rows by teacher chip; CSS/JS testimonial slider with dots and reduced-motion-aware auto-advance; Fixed sticky book-a-class bar revealed via IntersectionObserver on the hero; Highlighted recommended pricing tier with accent ribbon; Organic blob/arch image masks with a slow 'breathe' keyframe on the hero; Teacher profile cards with circular portraits and specialty tags; Oversized numeric '7 days free' intro-offer figure on a gradient banner

### Lumen & Lotus Yoga — *earthy*  ·  [`http://localhost:4314`](http://localhost:4314)

- **Slug / port:** `tmpl-yoga-earthy` · port `4314` · `pnpm --filter tmpl-yoga-earthy dev`
- **Direction:** Earthy botanical — terracotta & sage, natural textures
- **Tagline:** “Move slow. Breathe deep. Begin again.”
- **Summary:** An earthy, botanical yoga studio landing page in terracotta and sage with natural-texture imagery, a sticky booking CTA, a weekly schedule grid, and a warm Spectral/Hanken Grotesk type pairing.
- **Palette:** bg `#F4ECE1` · primary `#B5663F` · accent `#7A8466`
- **Signature components:** Stacked arch/cathedral-shaped photo blocks with terracotta sepia grade; Weekly class schedule grid that collapses gracefully to a compact mobile table; Pricing tier cards with a dark inverted 'Most loved' featured card; Pure-CSS testimonial slider with auto-advance, dots, and hover-pause; Persistent floating 'Book a class' sticky button; Breathing micro-interaction on the intro ribbon dot + slow swaying leaf SVG; Curved SVG section divider transitioning hero into the page; Duotone map card with a CSS teardrop location pin

### Lumen & Lotus Yoga — *spirit*  ·  [`http://localhost:4315`](http://localhost:4315)

- **Slug / port:** `tmpl-yoga-spirit` · port `4315` · `pnpm --filter tmpl-yoga-spirit dev`
- **Direction:** Modern spiritual — gentle gradients, calm motion, ethereal
- **Tagline:** “Move slow. Breathe deep. Begin again.”
- **Summary:** An ethereal, gradient-lit yoga studio template with floating orbs, a blob-masked duotone hero, an auto-playing testimonial slider, and a scroll-triggered sticky booking bar — the "spirit" variant of Lumen & Lotus.
- **Palette:** bg `#F7F4FA` · primary `#9B7FC4` · accent `#E7A98E`
- **Signature components:** Floating blurred gradient orbs with slow ease-in-out parallax drift on the hero; Blob/arch-masked duotone hero photo using clip-path + mask-image + mix-blend-mode luminosity; Curved SVG wave section divider into the muted band; Italic Cormorant serif marquee ticker with pause-on-hover; Auto-advancing testimonial slider (vanilla JS, dot tablist, reduced-motion aware); Class cards with cursor-positioned radial hover aura via per-card --g custom property; Pricing tier set with elevated featured card and accent ribbon; Duotone map panel with an animated pulsing location pin; Scroll-triggered sticky floating booking bar revealed via IntersectionObserver on the hero; IntersectionObserver scroll-reveal across all sections, respecting prefers-reduced-motion

## Med Spa & Beauty

### Lumière Aesthetics — *clinical*  ·  [`http://localhost:4316`](http://localhost:4316)

- **Slug / port:** `tmpl-medspa-clinical` · port `4316` · `pnpm --filter tmpl-medspa-clinical dev`
- **Direction:** Luxe clinical — blush & cream, elegant serif, trustworthy
- **Tagline:** “Confidence, refined.”
- **Summary:** A luxe-clinical med spa template for Lumière Aesthetics in blush, cream and gold with Playfair Display over Montserrat, featuring a before/after drag slider, transparent treatment menu, provider credential cards, membership tiers, accordion FAQ and full NAP/booking conversion blocks — fully self-contained, responsive and accessible.
- **Palette:** bg `#FBF7F3` · primary `#A8736B` · accent `#C9A227`
- **Signature components:** Before/after drag slider built on a range input with synced reveal handle; Treatment menu rows with thumbnail, category tag, starting price, duration and per-service Book link; Provider credential cards (portrait + license/title + specialties); Membership tier cards with a highlighted 'Most loved' gradient tier and badge; Floating sticky 'Book a Consultation' bar on mobile; As-seen-in press logo strip rendered purely in serif typography; Floating glass treatment-highlight card layered over the arched hero photo

### Lumière Aesthetics — *glow*  ·  [`http://localhost:4317`](http://localhost:4317)

- **Slug / port:** `tmpl-medspa-glow` · port `4317` · `pnpm --filter tmpl-medspa-glow dev`
- **Direction:** Glowy gradient — dewy pastel, soft glassy cards, radiant
- **Tagline:** “Your glow, restored.”
- **Summary:** A dewy, glassmorphic med-spa landing page for Lumière Aesthetics in the "glow" variant — pastel gradient mesh background, frosted floating cards, and a draggable before/after reveal, all self-contained in one Astro file.
- **Palette:** bg `#FDF4F8` · primary `#E59AAC` · accent `#9FD8E0`
- **Signature components:** Draggable before/after slider using a range input over clip-path with a frosted grip handle; Glassmorphic floating stat cards layered over a soft pastel gradient hero photo; Gradient-mesh radial background built purely in CSS; Treatment menu cards with duration pill, starting price and per-service Book link; Membership pricing tier card with SVG-check perk list and highlighted recommended badge; Horizontal scroll-snap testimonial slider; Sticky mobile floating Book-Consultation bar that follows scroll; Soft-light photo overlays + grayscale picsum seeds tinted to read on-brand; IntersectionObserver scroll-reveal respecting prefers-reduced-motion

### Lumière Aesthetics — *editorial*  ·  [`http://localhost:4318`](http://localhost:4318)

- **Slug / port:** `tmpl-medspa-editorial` · port `4318` · `pnpm --filter tmpl-medspa-editorial dev`
- **Direction:** Editorial beauty — high-fashion black & white, bold
- **Tagline:** “Beauty, on the record.”
- **Summary:** A high-fashion, black-and-white editorial med spa template styled like a print magazine spread, with a draggable before/after reveal, an oversized serif menu, and a press marquee.
- **Palette:** bg `#F4F2EE` · primary `#111111` · accent `#B08D57`
- **Signature components:** Draggable before/after reveal slider (range-input driven, accessible, with handle); Press marquee / ticker animated strip on inverted bar; Editorial split-screen hero pairing oversized serif headline with full-bleed duotone imagery and 'Issue 07' masthead meta; Leader-dot treatment menu rows with per-service Book CTA and hover indent; Inverted membership pricing card; Accordion FAQ with animated plus/minus mark; Floating mobile sticky booking dock

## Dental & Medical Clinic

### Brightwater Dental & Wellness — *friendly*  ·  [`http://localhost:4319`](http://localhost:4319)

- **Slug / port:** `tmpl-dental-friendly` · port `4319` · `pnpm --filter tmpl-dental-friendly dev`
- **Direction:** Friendly clean — bright teal/blue, rounded, reassuring trust signals
- **Tagline:** “Dentistry that puts you at ease.”
- **Summary:** A bright, rounded, teal-and-seafoam dental clinic template built around anxiety-reducing trust signals, transparent pricing, and an above-the-fold booking path — fully self-contained Astro with no external CSS/JS libraries.
- **Palette:** bg `#f5fbfd` · primary `#0aa6c2` · accent `#16c79a`
- **Signature components:** Draggable before/after smile slider built from a styled range input clipping a grayscale 'before' over a color 'after' with a custom circular chevron handle; Animated insurance-logo marquee ticker with edge mask-fade and reduced-motion guard; Sticky scroll-aware header that collapses into a blurred mobile drawer, paired with a fixed bottom Call/Book bar on phones; Soft organic blob photo mask + floating 'Same week' availability badge in the hero; Service cards with inline SVG icon sprite, dashed price footer, and lift-on-hover; Membership-plan gradient offer banner and numbered first-visit reassurance steps; Appointment request form with preferred-time selector and inline success confirmation (no backend, prefers-reduced-motion respected)

### Brightwater Dental & Wellness — *premium*  ·  [`http://localhost:4320`](http://localhost:4320)

- **Slug / port:** `tmpl-dental-premium` · port `4320` · `pnpm --filter tmpl-dental-premium dev`
- **Direction:** Premium calm — muted sage, spacious, refined
- **Tagline:** “Dentistry that puts you at ease.”
- **Summary:** A premium, calm-sage editorial landing page for a Calgary dental clinic, with a draggable before/after smile slider, transparent service pricing, and an above-the-fold booking path.
- **Palette:** bg `#f6f5ef` · primary `#6f8b73` · accent `#a8927a`
- **Signature components:** Draggable before/after smile slider (range input + keyboard-accessible handle, sepia vs brightened duotone); Trust credibility marquee ticker (CSS infinite scroll, reduced-motion aware); Organic-blob masked hero photo with floating 'same week' chip and soft gradient blob backdrop; Service cards with transparent from-pricing and animated arrow links; Meet-the-dentist credential card overlay with qualifications; New-patient offer callout banner in primary sage; First-visit numbered reassurance steps; Appointment request form with preferred-time selector and inline success state; Mobile sticky 'Book a visit' dock + click-to-call header bar; Dentist JSON-LD with aggregateRating and opening hours

### Brightwater Dental & Wellness — *modern*  ·  [`http://localhost:4321`](http://localhost:4321)

- **Slug / port:** `tmpl-dental-modern` · port `4321` · `pnpm --filter tmpl-dental-modern dev`
- **Direction:** Modern care — fresh, light illustration, approachable
- **Tagline:** “Dentistry that puts you at ease.”
- **Summary:** A fresh, light, illustration-leaning dental clinic template with blue/coral accents, organic blob photo masks, and a full conversion path (booking form, click-to-call, before/after slider, NAP, hours, and Dentist JSON-LD).
- **Palette:** bg `#ffffff` · primary `#4f6ef7` · accent `#ff9a76`
- **Signature components:** Draggable before/after smile slider built from a range input + clip-width handle; Insurance logo marquee ticker (CSS keyframe scroll, pauses for reduced-motion); Organic blob photo masks and soft decorative blur blobs in the hero; Service cards with image zoom-on-hover and from-pricing footer; Meet-the-dentist credential cards with rounded-organic headshots; Appointment request form with preferred-time selector and inline success status; Floating glass 'same-day relief' hero card over the patient photo; IntersectionObserver scroll-reveal with prefers-reduced-motion fallback

## Law Firm

### Halloran & Vance LLP — *classic*  ·  [`http://localhost:4322`](http://localhost:4322)

- **Slug / port:** `tmpl-law-classic` · port `4322` · `pnpm --filter tmpl-law-classic dev`
- **Direction:** Classic authoritative — navy & gold, serif, gravitas
- **Tagline:** “When the stakes are high, experience matters.”
- **Summary:** A classic, navy-and-gold law firm template with Didone serif display type, courtroom gravitas, and a full conversion path from value-prop hero to consultation form.
- **Palette:** bg `#fbfaf6` · primary `#152844` · accent `#b08a48`
- **Signature components:** CSS-only H&V monogram mark built from typography and a beveled accent border; Infinite-marquee credentials strip with diamond seal glyphs that pauses on hover; IntersectionObserver animated stat counters with cubic ease-out and locale formatting; Auto-advancing testimonial slider with serif pull-quotes, dot tablist, and reduced-motion guard; Duotone image treatment (sepia/contrast filters + multiply primary overlay) so random Picsum photos read as a unified navy gallery grade; Numbered process timeline cards with gold top-rule accents

### Halloran & Vance LLP — *modern*  ·  [`http://localhost:4323`](http://localhost:4323)

- **Slug / port:** `tmpl-law-modern` · port `4323` · `pnpm --filter tmpl-law-modern dev`
- **Direction:** Modern firm — slate & sans, confident, structured
- **Tagline:** “Decades in the courtroom. On your side.”
- **Summary:** A confident, structured modern law-firm template in slate and steel-teal with Fraunces/Inter pairing, featuring animated result counters, a testimonial slider, and a numbered process timeline.
- **Palette:** bg `#f4f5f7` · primary `#2c3a4b` · accent `#3f7d8c`
- **Signature components:** Animated count-up stat band using IntersectionObserver with cubic ease-out easing; Auto-rotating CSS testimonial slider with pill-expanding dot indicators; Numbered horizontal process timeline that collapses to a stacked ruled list on mobile; Practice-area cards with pricing pills, accent rule, and hover arrow-slide reveal; Duotone grayscale attorney portrait cards with multiply gradient overlay and hover desaturation; Scroll-reveal system with prefers-reduced-motion fallback and reduced-motion-aware slider

### Halloran & Vance LLP — *boutique*  ·  [`http://localhost:4324`](http://localhost:4324)

- **Slug / port:** `tmpl-law-boutique` · port `4324` · `pnpm --filter tmpl-law-boutique dev`
- **Direction:** Boutique legal — warm, human, approachable
- **Tagline:** “When the stakes are high, experience matters.”
- **Summary:** A warm, human boutique law-firm landing page for Halloran & Vance LLP — burgundy-and-taupe palette, Libre Caslon Display over Mulish, golden-hour imagery, with a credentials marquee, photo practice cards, stat band, duotone attorney bios, process timeline, and an autoplay testimonial slider.
- **Palette:** bg `#faf5ef` · primary `#5a2a2c` · accent `#b08968`
- **Signature components:** CSS testimonial slider with dot navigation, autoplay, and hover-pause on a burgundy field; Infinite burgundy credentials marquee built purely in CSS keyframes; Practice-area photo cards with sepia/multiply-blend image treatment and staggered scroll-reveal; Numbered process timeline with accent top-rule cards; Attorney bio cards with warm duotone portraits and credential lists; Consultation request form paired with a structured NAP definition list and map link

## Real Estate & Property

### Meridian & Vale | Private Brokerage — *luxury*  ·  [`http://localhost:4325`](http://localhost:4325)

- **Slug / port:** `tmpl-realestate-luxury` · port `4325` · `pnpm --filter tmpl-realestate-luxury dev`
- **Direction:** Luxury property — dark & gold, full-bleed architectural photography
- **Tagline:** “Live exceptionally.”
- **Summary:** A dark, cinematic luxury real estate template with full-bleed twilight architectural photography, champagne-gold accents, and editorial Cormorant Garamond + Jost typography for a private Calgary brokerage.
- **Palette:** bg `#0E0D0B` · primary `#C2A66A` · accent `#8C7848`
- **Signature components:** Cinematic Ken Burns hero with layered dark + gold radial gradient overlay; Animated stat counters (cubic ease-out, decimal-aware, IntersectionObserver-triggered); Hover-zoom listing cards with duotone filter that resolves to full saturation on hover; Home-valuation lead-capture band over a darkened/grayscale photo; Pure-CSS testimonial slider with auto-advance and dot tablist controls; Editorial split feature block with overlapping floating gold-bordered stat badge; Grayscale 'As Seen In' serif press logo row built entirely from typography; Neighborhood tiles with grayscale photos and gradient overlays that warm to gold on hover

### Vale Residential — *bright*  ·  [`http://localhost:4326`](http://localhost:4326)

- **Slug / port:** `tmpl-realestate-bright` · port `4326` · `pnpm --filter tmpl-realestate-bright dev`
- **Direction:** Bright modern — clean listings grid, light, crisp
- **Tagline:** “Find the address that fits your life.”
- **Summary:** A bright, crisp Calgary real-estate template with a clean listings grid, teal accent, and Playfair/Inter pairing — full-bleed Ken Burns hero, sticky search bar, valuation lead band, animated stats, and a CSS testimonial slider.
- **Palette:** bg `#FBFBF9` · primary `#0F5C5A` · accent `#C2683E`
- **Signature components:** Ken Burns full-bleed hero with embedded multi-field search/booking bar; Hover-zoom listing cards with floating status tags and minimal data labels; Home-valuation lead-capture band with two-up form on primary teal ground; IntersectionObserver animated stat counters (supports decimals, prefix/suffix); Infinite CSS press marquee with edge mask fade; Autoplaying CSS testimonial slider with clickable dot navigation; Neighborhood area tiles with reveal-on-hover blurb overlays

### Eleanor Vale, Realtor — Meridian & Vale — *agent*  ·  [`http://localhost:4327`](http://localhost:4327)

- **Slug / port:** `tmpl-realestate-agent` · port `4327` · `pnpm --filter tmpl-realestate-agent dev`
- **Direction:** Boutique personal-brand agent — editorial, story-led
- **Tagline:** “Your move, handled personally.”
- **Summary:** A warm, editorial, story-led personal-brand landing page for a boutique Calgary real estate agent — paper-toned palette, Fraunces serif display, clay accent, and magazine-style asymmetric layout.
- **Palette:** bg `#F4EFE6` · primary `#9A4E33` · accent `#6E7150`
- **Signature components:** IntersectionObserver animated stat counters with cubic ease-out and reduced-motion fallback; Autoplaying CSS-transform testimonial slider with tablist dot controls; Home-valuation lead-capture band with inline address form; Asymmetric agent-portrait hero card with floating caption chip and editorial rounded crop; Hover-zoom listing cards with multiply-blend duotone neighborhood tiles; Fade-up scroll-reveal story split block

## Auto Detailing & Garage

### APEX // IRON GARAGE — *rugged*  ·  [`http://localhost:4328`](http://localhost:4328)

- **Slug / port:** `tmpl-auto-rugged` · port `4328` · `pnpm --filter tmpl-auto-rugged dev`
- **Direction:** Rugged industrial — carbon & safety-orange, aggressive angles
- **Tagline:** “Showroom Finish. Street-Tough Protection.”
- **Summary:** A rugged, carbon-and-safety-orange auto detailing and performance-garage template with aggressive Oswald display type, hazard-stripe graphics, a drag before/after slider, animated stat counters, tiered pricing, and a sticky mobile booking bar.
- **Palette:** bg `#0e0f11` · primary `#ff5a1f` · accent `#ffb300`
- **Signature components:** Drag-to-reveal before/after correction slider built from a range input + clipped width and an orange handle; Animated count-up stat band via IntersectionObserver (reduced-motion aware); Tiered pricing cards with clip-path angled CTAs and a Most Popular glow; Bento gallery grid with shine-sweep + duotone-to-color hover treatment; Hazard-stripe (safety-orange/black diagonal) graphic flourishes as section dividers; Mobile sticky Book Now / Call booking bar

### Apex Iron Auto Studio — *premium*  ·  [`http://localhost:4329`](http://localhost:4329)

- **Slug / port:** `tmpl-auto-premium` · port `4329` · `pnpm --filter tmpl-auto-premium dev`
- **Direction:** Premium detailing — black & chrome, sleek, glossy
- **Tagline:** “Showroom Finish. Street-Tough Protection.”
- **Summary:** A black-and-chrome premium auto-detailing template for Apex Iron Auto Studio, pairing cinematic low-key imagery with a drag-reveal before/after slider, glossy hover-sheen pricing tiers, and a full conversion path (quote form, NAP, sticky mobile book bar).
- **Palette:** bg `#0a0a0b` · primary `#c9ccd1` · accent `#7d8a9c`
- **Signature components:** Drag-to-reveal before/after slider built with a transparent range input, clipped before-layer and a chrome circular handle; Glossy 'shine sweep' sheen that animates diagonally across package cards on hover; Chrome text-gradient treatment on hero headline, stat numbers and brand accents; Mobile-only sticky booking bar (Call + Book Now) that hides on desktop; CSS-only conic-gradient brand mark and SVG check/phone icons (no icon libraries); Duotone/grain photographic treatment via CSS filters and mix-blend-mode so random Picsum photos read as a cohesive low-key studio shoot

### Apex & Iron Motor Co. — *retro*  ·  [`http://localhost:4330`](http://localhost:4330)

- **Slug / port:** `tmpl-auto-retro` · port `4330` · `pnpm --filter tmpl-auto-retro dev`
- **Direction:** Retro garage — vintage signage, warm, route-66 nostalgia
- **Tagline:** “Showroom Finish. Street-Tough Protection.”
- **Summary:** A retro route-66 garage template for an auto detailing & ceramic-coating studio — cream-and-oxblood americana with Alfa Slab One signage, hard-edged neo-brutalist shadows, a drag before/after slider, and a sticky booking bar.
- **Palette:** bg `#f4ead5` · primary `#a8331f` · accent `#1f6f6b`
- **Signature components:** Drag-to-reveal before/after slider built with a transparent range input over clipped duotone images; Glossy shine-sweep hover on service cards (skewed gradient swipe); Tilted enamel-sign hero license plate + circular brand badge built purely in CSS; Scrolling uppercase service marquee with pause-on-hover; Neo-brutalist hard offset shadows (no blur) tying the whole retro system together; Horizontal scroll-snap gallery with sepia-to-color hover treatment; Sticky bottom booking bar that slides up after the hero; SVG fractal-noise film-grain overlay + duotone gradient scrims on Picsum photos for the sun-faded americana look

## SaaS / Tech Product

### Driftwork — *gradient*  ·  [`http://localhost:4331`](http://localhost:4331)

- **Slug / port:** `tmpl-saas-gradient` · port `4331` · `pnpm --filter tmpl-saas-gradient dev`
- **Direction:** Modern gradient — glassmorphism, floating product UI mockups
- **Tagline:** “Ship faster. Drift less.”
- **Summary:** A luminous, glassmorphic B2B SaaS landing page for Driftwork — floating product UI panels and a terminal hovering over an animated indigo→violet→pink mesh, with a bento feature grid, tabbed product tour, animated metrics, integrations marquee, and toggleable 3-tier pricing.
- **Palette:** bg `#0B0A1A` · primary `#7C5CFF` · accent `#FF6FD8`
- **Signature components:** Floating glassmorphic product UI panels (backdrop-blur, 1px light borders, layered shadows) with a bobbing stat card and live terminal snippet over an animated indigo→violet→pink mesh with drifting glow orbs; Asymmetric bento grid with wide/tall cells, screen-blended photo washes and gradient overlays; Tabbed product tour that swaps panels on click with fade-in; 3-tier pricing table with highlighted 'Most popular' plan and a JS monthly/annual toggle that rewrites prices via data-attributes; CSS infinite integrations marquee with edge mask and pause-on-hover; Window-chrome terminal block with traffic-light dots and mono syntax coloring; Announcement pill with pulsing status dot and arrow; Big-number metric counters with gradient-text numerals and mono labels; IntersectionObserver scroll-reveal honoring prefers-reduced-motion

### driftwork — *dark*  ·  [`http://localhost:4332`](http://localhost:4332)

- **Slug / port:** `tmpl-saas-dark` · port `4332` · `pnpm --filter tmpl-saas-dark dev`
- **Direction:** Dark developer tool — mono accents, terminal/code motifs
- **Tagline:** “Ship faster. Drift less.”
- **Summary:** A dark, developer-first SaaS landing page for driftwork — a workflow automation platform — built around terminal/code motifs, a mono wordmark, and a single green accent.
- **Palette:** bg `#0A0B0D` · primary `#4ADE80` · accent `#38BDF8`
- **Signature components:** Terminal window components with traffic-light chrome, syntax-tinted output, and a blinking caret; Tabbed product tour that swaps full terminal panels on click (vanilla JS, no libs); Dot-matrix blueprint grid backdrops with radial mask that 'breathe' behind hero, tour, and CTA; Announcement pill with a pulsing status dot and cyan arrow; Asymmetric bento grid with duotone (luminosity-blend, desaturated) Picsum screenshots; Gradient-clipped metric counters with mono labels in a hairline-divided grid; Pause-on-hover integrations marquee with edge fade mask; 3-tier pricing with elevated/glowing 'most popular' middle plan

### Driftwork — *clean*  ·  [`http://localhost:4333`](http://localhost:4333)

- **Slug / port:** `tmpl-saas-clean` · port `4333` · `pnpm --filter tmpl-saas-clean dev`
- **Direction:** Clean startup — bright, friendly spot illustration, simple
- **Tagline:** “Ship faster. Drift less.”
- **Summary:** A bright, friendly clean-startup SaaS landing page for Driftwork (workflow automation for product teams), built as one fully self-contained Astro file with a light-mode product mockup, bento feature grid, tabbed product tour, pricing tiers, and scroll-reveal motion.
- **Palette:** bg `#FFFFFF` · primary `#2563EB` · accent `#F59E0B`
- **Signature components:** Tabbed interactive product tour that swaps screenshots and copy on click (vanilla JS, ARIA tablist); Asymmetric bento feature grid mixing a filled-primary accent card with inline SVG spot illustrations; Browser-chrome product screenshot frame with traffic-light dots, floating 'Workflow ran 0.4s' status card, and floating glow blobs; Kicker/announcement pill with status dot and arrow ('New v2 just launched'); Three-tier pricing table with a highlighted 'Most popular' plan and accent badge; Infinite scrolling logo marquee with edge mask fade; Animated metric counters in muted cards with mono-style labels; Faint blueprint-grid section backgrounds with radial vignette mask that 'breathe' behind content; IntersectionObserver scroll-reveal on cards, plans, and metrics (respects prefers-reduced-motion)

## Creative Agency

### Northsignal Studio — *brutalist*  ·  [`http://localhost:4334`](http://localhost:4334)

- **Slug / port:** `tmpl-agency-brutalist` · port `4334` · `pnpm --filter tmpl-agency-brutalist dev`
- **Direction:** Brutalist bold — oversized raw type, hard borders, marquee
- **Tagline:** “We build brands people don't forget.”
- **Summary:** A brutalist creative-agency template for Northsignal Studio — oversized Archivo Black type, hard ink-on-paper borders, dual scrolling marquees, and an ink-red accent, fully self-contained in one Astro file.
- **Palette:** bg `#F4F2EC` · primary `#0A0A0A` · accent `#FF3B00`
- **Signature components:** Word-by-word rise-reveal kinetic hero headline with staggered animation delays; Dual horizontal marquees scrolling opposite directions (services ticker + client logos); Work index tiles with grayscale duotone image-reveal on hover using mix-blend-mode multiply/screen and full color inversion; Auto-rotating CSS/JS testimonial slider with oversized quotation mark and square brutalist dot controls; Numbered process grid with hover invert-to-black cards; Outlined (text-stroke) giant wordmark footer; Hard offset box-shadow brutalist buttons and floating mobile START CTA

### Northsignal Studio — *sleek*  ·  [`http://localhost:4335`](http://localhost:4335)

- **Slug / port:** `tmpl-agency-sleek` · port `4335` · `pnpm --filter tmpl-agency-sleek dev`
- **Direction:** Sleek studio — refined, motion-forward, sophisticated
- **Tagline:** “We build brands people don't forget.”
- **Summary:** A sleek, motion-forward creative agency template for Northsignal Studio — cinematic dark editorial luxury with Fraunces display type, a warm gold accent, kinetic hero reveal, and a portfolio-first layout.
- **Palette:** bg `#0E0E10` · primary `#F2F1EE` · accent `#C8A86B`
- **Signature components:** Kinetic hero headline: per-word translateY rise animation staggered by nth-child delays, with reduced-motion fallback; Infinite-scroll marquee ticker of service keywords that pauses on hover; Work index tiles with grayscale->color + scale image reveal and overlay gradient on hover, plus tabular metadata row; IntersectionObserver-driven animated stat counters (Brands shipped / Awards / Years) counting up on scroll; Auto-rotating testimonial slider with large quotation mark, absolutely-stacked figures, and clickable progress dots; Mobile-only floating Start-a-project button fixed bottom-right

### Northsignal Studio — *playful*  ·  [`http://localhost:4336`](http://localhost:4336)

- **Slug / port:** `tmpl-agency-playful` · port `4336` · `pnpm --filter tmpl-agency-playful dev`
- **Direction:** Playful colorful — experimental grid, sticker shapes, fun
- **Tagline:** “We build brands people don't forget.”
- **Summary:** A bright, sticker-pop neobrutalist creative-agency template for Northsignal Studio: kinetic hero, marquee ticker, rotated duotone work cards, process accordion, and a CSS testimonial slider — all self-contained in one scoped-style Astro file.
- **Palette:** bg `#FFF8E7` · primary `#7C3AED` · accent `#FF5CA8`
- **Signature components:** Word-by-word kinetic hero headline reveal with squiggle/dotted underline accents; Horizontal scrolling service-keyword ticker marquee (pauses on hover); Sticker-style work cards: rotated, hard-shadowed, picsum photos with mix-blend-mode duotone color overlays that clear on hover; Numbered process accordion using native <details> with rotating plus icon; Auto-advancing CSS/JS testimonial slider with clickable dots and oversized quote mark; Floating sticky 'Start a project' CTA that slides in after the hero scrolls out; Tactile collage flourishes built in pure CSS/SVG: blobs, tape strips, sticker pills, neobrutalist hard shadows

## Photographer Portfolio

### Northlight — *gallery*  ·  [`http://localhost:4337`](http://localhost:4337)

- **Slug / port:** `tmpl-photography-gallery` · port `4337` · `pnpm --filter tmpl-photography-gallery dev`
- **Direction:** Minimal gallery — image-first, tiny type, masonry
- **Tagline:** “Light, held still.”
- **Summary:** A minimal, image-first gallery portfolio for a Calgary photographer — near-monochrome neutral palette, oversized Archivo display type, desaturate-to-color masonry, and quiet conversion chrome.
- **Palette:** bg `#FAFAF8` · primary `#1A1A1A` · accent `#6B6B6B`
- **Signature components:** Filterable masonry grid (CSS columns) with desaturate→full-color zoom reveal, cursor 'View' chip, and category tabs wired by vanilla JS; Numbered Series Index rows that slide/indent and reveal an arrow on hover; Dual CSS marquees (disciplines ticker + press logo strip) built purely from typography; Inverted dark testimonial band using the primary token as background for tonal contrast; Bordered investment cards with 'starting at' price treatment and 1px hairline grid; IntersectionObserver scroll-reveal with prefers-reduced-motion fallback

### Northlight Studio — *folio*  ·  [`http://localhost:4338`](http://localhost:4338)

- **Slug / port:** `tmpl-photography-folio` · port `4338` · `pnpm --filter tmpl-photography-folio dev`
- **Direction:** Editorial folio — serif, storytelling, large captions
- **Tagline:** “Pictures that remember how it felt.”
- **Summary:** An editorial, art-book-style photographer portfolio for Northlight Studio in warm film-toned neutrals, pairing Fraunces display serif with Newsreader body, built around large storytelling captions, a numbered masonry folio, and an understated inquiry-driven conversion path.
- **Palette:** bg `#F6F1E9` · primary `#7A3B2E` · accent `#A8714B`
- **Signature components:** Pausable press marquee ticker built with CSS keyframes and duplicated track; Masonry folio grid with dense auto-flow, tall/wide tile spans, and sepia desaturate-to-full-color zoom hover with numbered captions; Editorial large-caption story block pairing an inset image with a pull-quote-scale serif blockquote; Scroll-snap CSS testimonial slider with JS-synced dot indicators (scroll position drives active dot); Numbered investment list rows that slide on hover and reveal a per-service inquire link; Vertical small-caps writing-mode location tag layered on the self-portrait

### NORTHLIGHT — *cinematic*  ·  [`http://localhost:4339`](http://localhost:4339)

- **Slug / port:** `tmpl-photography-cinematic` · port `4339` · `pnpm --filter tmpl-photography-cinematic dev`
- **Direction:** Dark cinematic — full-screen imagery, dramatic, moody
- **Tagline:** “Stories told in shadow and light.”
- **Summary:** A dark, cinematic photographer-portfolio template for NORTHLIGHT (Elise Roy, Calgary) — full-bleed moody imagery, oversized Cormorant Garamond display type, surgical gold accent, and image-first conversion flow.
- **Palette:** bg `#0C0C0E` · primary `#EDEDED` · accent `#C2A26B`
- **Signature components:** Asymmetric masonry work grid with JS category filter tabs (All/Editorial/Weddings/Brand) and grayscale-to-light hover zoom with revealed 'View series' label; Horizontal scroll-snap 'Nocturne' series rail with numbered editorial captions and gold progress scrollbar; CSS press marquee ticker with mask-fade edges; Pricing/investment tier cards with 'starting at' prices and a featured flagged card; Cinematic hero with CSS keyframe slow-zoom, SVG fractal-noise film grain overlay and layered dual gradient vignette; IntersectionObserver scroll-reveal with staggered delays, respecting prefers-reduced-motion; Vertical small-caps label on the self-portrait and NAP contact grid with click-to-call / mailto links

## Architecture & Interiors

### Meridian & Co. — Architecture + Interiors — *swiss*  ·  [`http://localhost:4340`](http://localhost:4340)

- **Slug / port:** `tmpl-architecture-swiss` · port `4340` · `pnpm --filter tmpl-architecture-swiss dev`
- **Direction:** Monochrome Swiss grid — precise, restrained, typographic
- **Tagline:** “Spaces composed with light and restraint.”
- **Summary:** A monochrome Swiss-grid template for Meridian & Co., a Calgary architecture and interiors studio — strict hairline grid, oversized Archivo display type, restrained near-monochrome palette with a single terracotta accent, and a numbered hover-preview project index that lets the work carry the page.
- **Palette:** bg `#F4F4F2` · primary `#161616` · accent `#C8462E`
- **Signature components:** Numbered project index (01–05) that swaps a sticky preview image on hover/focus, with the row tracking to the accent terracotta; Inverted ink-panel contact section with a duotone (invert+grayscale) map tile and oversized enquiry CTA; Monochrome International-Style marquee ticker bounded by hairline rules; Hover-to-invert process cards on a 1px hairline grid; Pure-CSS testimonial slider with tabular caption and auto-advance (reduced-motion aware)

### Meridian & Co. — Architecture + Interiors — *warm*  ·  [`http://localhost:4341`](http://localhost:4341)

- **Slug / port:** `tmpl-architecture-warm` · port `4341` · `pnpm --filter tmpl-architecture-warm dev`
- **Direction:** Warm interior — editorial, tactile materials, inviting
- **Tagline:** “Buildings that hold their quiet.”
- **Summary:** A warm, editorial architecture-and-interiors studio template — tactile materials, golden-hour photography treated like magazine plates, and a Cormorant Garamond / Hanken Grotesk pairing on a paper-and-clay palette.
- **Palette:** bg `#F3EDE3` · primary `#5A4632` · accent `#B07A4A`
- **Signature components:** Numbered project index that swaps a sticky preview image on hover and keyboard focus; Magazine-spread featured case study with a sticky large plate, two-column brief facts, and nested detail crop; Materials/finishes swatch strip rendered as CSS chips with lift-on-hover; Press marquee ticker (pause-on-hover) in primary-on-clay; Autoplaying CSS testimonial slider with progress-bar dots and pointer pause; Warm duotone photo treatment via multiply gradient overlays and saturation/brightness filters

### Meridian & Co. — *dramatic*  ·  [`http://localhost:4342`](http://localhost:4342)

- **Slug / port:** `tmpl-architecture-dramatic` · port `4342` · `pnpm --filter tmpl-architecture-dramatic dev`
- **Direction:** Bold architectural — dramatic scale, full-bleed structure
- **Tagline:** “Buildings that hold their quiet.”
- **Summary:** A cinematic, high-contrast architecture-studio template with full-bleed structural photography, oversized Anton display type, and a monochrome ink palette accented by warm brass.
- **Palette:** bg `#111214` · primary `#ECEAE6` · accent `#C99A4B`
- **Signature components:** Numbered typographic project index (01/02/03) that swaps a cursor-tracking floating preview image on hover; Dual CSS-only infinite marquees (capabilities ticker + press logo row); Full-bleed cinematic hero with SVG-noise grain, gradient scrim, and keyframed slow zoom; Magazine-spread featured case study with side-gradient masked photo and meta grid; Materials & palette swatch strip built from pure CSS color chips; IntersectionObserver scroll-reveal across all sections with prefers-reduced-motion fallback

## Tattoo Studio

### Ironwood Tattoo Co. — *ornate*  ·  [`http://localhost:4343`](http://localhost:4343)

- **Slug / port:** `tmpl-tattoo-ornate` · port `4343` · `pnpm --filter tmpl-tattoo-ornate dev`
- **Direction:** Dark ornamental — gothic, gold filigree, engraved
- **Tagline:** “Permanent Art, Made to Last.”
- **Summary:** A dark ornamental, gold-filigree tattoo studio template for Ironwood Tattoo Co. with a blackletter masthead, engraved-plate gallery, and reverent occult-luxe styling.
- **Palette:** bg `#0d0b0c` · primary `#c9a24b` · accent `#7c1f2b`
- **Signature components:** Gold-filigree blackletter marquee ticker on oxblood band; Engraved-frame masonry portfolio grid with hover saturation and style chips; Floating pill-shaped sticky booking dock that follows scroll; Leader-dot pricing rows with display-font gold prices; Duotone artist roster cards with hover-reveal color and per-artist CTA; Accordion FAQ with rotating gold plus-to-cross chevrons

### Ironwood Tattoo Co. — *traditional*  ·  [`http://localhost:4344`](http://localhost:4344)

- **Slug / port:** `tmpl-tattoo-traditional` · port `4344` · `pnpm --filter tmpl-tattoo-traditional dev`
- **Direction:** American traditional — bold red/black, flash sheets
- **Tagline:** “Bold Lines. No Regrets.”
- **Summary:** An American-traditional tattoo studio template for Ironwood Tattoo Co. in cream/oxblood/forest-green with Rye woodtype display and Oswald body, featuring a claimable flash board, letterpress hard-shadow UI, a healed-work bento gallery, and a scroll-triggered sticky booking bar.
- **Palette:** bg `#f4ead6` · primary `#b22222` · accent `#1f4e3d`
- **Signature components:** Flash-sheet claim board — grid of pre-drawn designs with style tag chips, price tags and 'claim this flash' actions; Old-school horizontal marquee ticker with star separators; Healed-work masonry gallery with wide-spanning bento tiles and style captions; Letterpress hard-shadow button system (offset block shadows that press on click); Leader-dotted pricing list (classic menu-style dotted rule between name and price); Sticky booking/deposit bar that reveals on scroll past hero via IntersectionObserver; Accordion FAQ with CSS plus/minus morph icon; Scroll-reveal section heads respecting prefers-reduced-motion

### Ironwood Tattoo Co. — *fineline*  ·  [`http://localhost:4345`](http://localhost:4345)

- **Slug / port:** `tmpl-tattoo-fineline` · port `4345` · `pnpm --filter tmpl-tattoo-fineline dev`
- **Direction:** Fine-line minimal — light, delicate, airy
- **Tagline:** “Delicate work. Considered lines.”
- **Summary:** A light, airy fine-line tattoo studio template for Ironwood Tattoo Co. — high-contrast Cormorant Garamond serif over Jost, a bone/taupe/sage palette, and a gallery-quiet layout featuring a bento portfolio, artist roster, autoplay testimonial slider, FAQ accordion, and full NAP/booking conversion blocks.
- **Palette:** bg `#faf8f5` · primary `#a8907a` · accent `#8d9b88`
- **Signature components:** Bento masonry gallery with tall/wide spans and hover-reveal style captions; Auto-advancing CSS testimonial slider with clickable dot navigation; Italic Cormorant marquee ticker of studio specialties; Accordion FAQ built on native details/summary with animated plus-to-line icon; Sticky deposit/booking bar layered above a blur-backed sticky nav; CSS-built brand mark and map pin (inline SVG / pseudo-elements, no external assets)

## Craft Brewery & Taproom

### Ironwood Brewing Co. — *craft*  ·  [`http://localhost:4346`](http://localhost:4346)

- **Slug / port:** `tmpl-brewery-craft` · port `4346` · `pnpm --filter tmpl-brewery-craft dev`
- **Direction:** Craft bold — badge logos, kraft texture, hand-lettering
- **Tagline:** “Honest beer for the neighborhood.”
- **Summary:** A bold, kraft-paper craft-brewery taproom template for Ironwood Brewing Co. — badge crest lockups, woodtype-style Alfa Slab One display, a sepia-duotone tap list with ABV/IBU chips, live Open-Now hours, an 18+ age gate, and full NAP + LocalBusiness JSON-LD.
- **Palette:** bg `#F4ECD8` · primary `#9E3B25` · accent `#D99A2B`
- **Signature components:** Circular badge/crest brand lockup built entirely in CSS (EST 2014, hops-gold ring) reused at sm/md/lg sizes; Age-gate 21+/18+ splash overlay with localStorage persistence over duotone photo; On-Tap beer cards with sepia mix-blend-multiply can images, numbered tabs, and ABV/IBU stat-pill chips; Live 'Open Now / Closed Now' indicator computed from real opening hours in vanilla JS; Hand-lettered display-font marquee ticker with reduced-motion fallback; Kraft-paper dot-grid body texture and dashed-rule price tickets for tactile craft feel

### Ironwood Brewing Co. — *industrial*  ·  [`http://localhost:4347`](http://localhost:4347)

- **Slug / port:** `tmpl-brewery-industrial` · port `4347` · `pnpm --filter tmpl-brewery-industrial dev`
- **Direction:** Industrial taproom — dark, copper, raw concrete
- **Tagline:** “Honest beer for the neighborhood.”
- **Summary:** A dark, copper-and-concrete industrial taproom landing page for a craft brewery, built as one self-contained Astro file with an age gate, live tap board, and warehouse-grit aesthetic.
- **Palette:** bg `#16140F` · primary `#B5793A` · accent `#C98A4B`
- **Signature components:** Live tap board: beer cards with sepia-treated can art, ABV/IBU/style meta-chips, tasting note, and pour/pack pricing; Age-gate splash overlay with sessionStorage persistence and fade-out; Copper enamel marquee ticker (CSS keyframe scroll, paused on reduced-motion); Hours table with pulsing 'Open Now' live indicator; Circular hop/barley crest brand lockup built as inline SVG; Map card with directions pin and duotone photo treatment; Staggered IntersectionObserver scroll-reveal across all sections

### Ironwood Brewing Co. — *hazy*  ·  [`http://localhost:4348`](http://localhost:4348)

- **Slug / port:** `tmpl-brewery-hazy` · port `4348` · `pnpm --filter tmpl-brewery-hazy dev`
- **Direction:** Hazy modern IPA — vibrant gradient, playful, juicy
- **Tagline:** “Honest beer for the neighborhood.”
- **Summary:** A vibrant, juicy hazy-IPA taproom template for Ironwood Brewing Co. featuring a gradient pop-art hero, a live "On Tap" board, events strip, to-go cans grid, and a CSS testimonial slider — all self-contained in one Astro file.
- **Palette:** bg `#FFF8EC` · primary `#FF5C2E` · accent `#FFC23C`
- **Signature components:** Tilted can hero with juice-gradient splash and multiply photo overlay; Ingredient marquee ticker (CSS keyframe scroll); Tap-list cards with ABV/IBU meta-pills and flagship ribbon; Autoplaying CSS testimonial slider with accessible tab dots; Age-gate overlay using sessionStorage; Hours table with live 'Open Now' pulsing indicator and map pin card

## Fashion & Apparel

### Meridian Atelier — *luxe*  ·  [`http://localhost:4349`](http://localhost:4349)

- **Slug / port:** `tmpl-fashion-luxe` · port `4349` · `pnpm --filter tmpl-fashion-luxe dev`
- **Direction:** Luxe fashion — editorial black & white, oversized imagery
- **Tagline:** “Modern wardrobe, made to last.”
- **Summary:** A gallery-quiet, editorial black-and-white luxe fashion landing page for Meridian Atelier with oversized full-bleed campaign imagery, a high-contrast Playfair Display / Inter type pairing, and a full apparel-commerce section set.
- **Palette:** bg `#f6f4f1` · primary `#111111` · accent `#8a7355`
- **Signature components:** Hover-swap product card (front image cross-fades to back shot) with inline colour swatch dots, full size selector, and a slide-up quick-add bar; CSS scroll-snap testimonial slider with JS-generated navigation dots that auto-sync to the nearest card on scroll; Alternating editorial 2-up lookbook splits where every other panel inverts to a dark gallery treatment; CSS marquee ticker bar with duplicated track for seamless looping (paused under prefers-reduced-motion); Asymmetric Instagram/UGC mosaic with a featured 2x2 hero cell and span-2 rows; IntersectionObserver scroll-reveal with staggered per-tile delays, gracefully degrading for reduced-motion

### MERIDIAN / OFF-GRID — *streetwear*  ·  [`http://localhost:4350`](http://localhost:4350)

- **Slug / port:** `tmpl-fashion-streetwear` · port `4350` · `pnpm --filter tmpl-fashion-streetwear dev`
- **Direction:** Streetwear drop — bold, energetic, countdown hype
- **Tagline:** “DROP 04 — OFF-GRID. 200 Made. Once. Get it or regret it.”
- **Summary:** A bold, high-saturation streetwear drop landing page for MERIDIAN / OFF-GRID with a live countdown, hover-swap product grid, sold-out theater, and FOMO-driven hype copy on an acid-yellow/black/red palette.
- **Palette:** bg `#0d0d0d` · primary `#e7ff00` · accent `#ff3b1f`
- **Signature components:** Live drop countdown timer (days:hrs:min:sec) with pulsing live dot and 78%-claimed progress bar; Hover-swap product card (front flips to detail) with sold-out theater, color swatches, and slide-up quick-add size selector; Infinite CSS marquee hype ticker; Auto-advancing CSS/JS testimonial slider with clickable dots; Bento-style shoppable UGC mosaic with spanning big cells and on-hover Shop-the-Fit overlay; Outline-stroke display headlines + accent slash brand mark built purely in CSS/type; Neo-brutalist offset box-shadow buttons (translate + colored hard shadow on hover)

### Meridian Atelier — *minimal*  ·  [`http://localhost:4351`](http://localhost:4351)

- **Slug / port:** `tmpl-fashion-minimal` · port `4351` · `pnpm --filter tmpl-fashion-minimal dev`
- **Direction:** Minimal store — clean neutral product grid, quiet
- **Tagline:** “Quietly considered essentials — modern wardrobe, made to last.”
- **Summary:** A quiet, warm-neutral minimal fashion storefront for Meridian Atelier built as a single self-contained Astro page — Fraunces display serif over Inter, a full-bleed Fall Edit hero, hover-swap product grid with quick-add, a slide-in mini-cart, lookbook bento, UGC mosaic, and newsletter + Calgary NAP, all responsive at 390px and 1440px with tasteful, reduced-motion-aware animation.
- **Palette:** bg `#fbfaf7` · primary `#2b2926` · accent `#9a8f7d`
- **Signature components:** Hover-swap product card (front image flips to back/detail shot) with inline color swatches and a slide-up quick-add overlay; Slide-in mini-cart drawer with scrim, line items, subtotal and Escape/scrim-click close (vanilla JS); Infinite CSS marquee announcement ticker (paused under prefers-reduced-motion); Swatch-based filter chip toolbar with active-state toggling; Asymmetric lookbook bento grid (one tall image spanning two rows beside detail tiles + a serif manifesto note); Shoppable UGC mosaic with hover 'Shop the look' overlay; IntersectionObserver scroll-reveal with reduced-motion fallback

## Jewelry Brand

### Aurelle & Vale — Fine Jewelry Atelier — *elegant*  ·  [`http://localhost:4352`](http://localhost:4352)

- **Slug / port:** `tmpl-jewelry-elegant` · port `4352` · `pnpm --filter tmpl-jewelry-elegant dev`
- **Direction:** Elegant timeless — cream & gold, delicate serif
- **Tagline:** “Heirlooms for the everyday.”
- **Summary:** An elegant, heritage-toned fine-jewelry landing page in cream and gold with delicate Cormorant Garamond serif display, an editorial split-screen hero, an asymmetric bento product grid, and a full trust/booking conversion path.
- **Palette:** bg `#FBF7F0` · primary `#9C7A3C` · accent `#C9A86A`
- **Signature components:** Asymmetric bento product grid where the Solène solitaire spans two rows, with hover image-zoom and price + Affirm financing chips; Full-bleed macro 'detail close-up' band with gradient overlay and a single italic-accented line of craft copy; Editorial split-screen hero pairing an oversized serif headline with a shadow-floated, gold-cast framed product photo and overlaid caption tag; Provenance card row with oversized serif index numerals (01–03) for recycled gold / GIA / ethical sourcing; CSS-only A&V circular monogram mark used in nav and footer, plus inline SVG check and star icons (no icon CDN); IntersectionObserver scroll-reveal and scroll-aware sticky nav, both respecting prefers-reduced-motion

### Aurelle & Vale — Fine Jewelry Atelier — *modernlux*  ·  [`http://localhost:4353`](http://localhost:4353)

- **Slug / port:** `tmpl-jewelry-modernlux` · port `4353` · `pnpm --filter tmpl-jewelry-modernlux dev`
- **Direction:** Modern lux — dark, sparkling highlights, refined
- **Tagline:** “Heirlooms for the everyday.”
- **Summary:** A dark, gallery-grade fine-jewelry template for Aurelle & Vale with cinematic macro imagery, sparkling gold accents, an asymmetric bento collection grid, and trust-led conversion (NAP, booking, financing, JSON-LD).
- **Palette:** bg `#0E0E10` · primary `#D8C49A` · accent `#E8D9B5`
- **Signature components:** Asymmetric bento product grid where the Solène Solitaire spans 2x2 and each card hover-swaps to a worn-on shot; Cinematic split-screen hero with a CSS sweeping specular glint animation across the framed macro photo; Auto-scrolling trust ribbon marquee that pauses on hover; Price + Affirm financing chips on hero and product cards; Pure-CSS/JS testimonial slider with dot tablist, auto-advance, and reduced-motion guard; Full-bleed macro detail band with radial vignette merging into the page background

### Aurelle &amp; Vale — Fine Jewelry Atelier — *artisan*  ·  [`http://localhost:4354`](http://localhost:4354)

- **Slug / port:** `tmpl-jewelry-artisan` · port `4354` · `pnpm --filter tmpl-jewelry-artisan dev`
- **Direction:** Artisan handcrafted — warm, organic, maker story
- **Tagline:** “Crafted to be lived in.”
- **Summary:** A warm, earthy artisan fine-jewelry template for Aurelle & Vale — Fraunces/Work Sans pairing over a clay-and-gold palette, with a hand-made maker story, asymmetric bento product grid, animated trust ribbon, CSS testimonial slider, and full LocalBusiness JSON-LD.
- **Palette:** bg `#F4EDE3` · primary `#8A5A3B` · accent `#A98B5B`
- **Signature components:** Asymmetric bento product grid where the Solène solitaire spans two cells, each card hover-swapping to a worn/glinting shot; Auto-advancing CSS testimonial slider with dot pagination (no library); Animated marquee trust ribbon that collapses to static wrap under prefers-reduced-motion; Layered hero with full-bleed macro image plus border-framed inset atelier shot and floating 'Hand-finished daily' tag; Price + Affirm financing chip on every product; Duotone craftsmanship band with overlaid 3-step process and inline diamond SVG iconography

## Boutique Hotel & Resort

### Marisol Coastal — *coastal*  ·  [`http://localhost:4355`](http://localhost:4355)

- **Slug / port:** `tmpl-hotel-coastal` · port `4355` · `pnpm --filter tmpl-hotel-coastal dev`
- **Direction:** Coastal serene — sand & sea-blue, airy, breezy
- **Tagline:** “Where the tide sets the pace.”
- **Summary:** A serene, sand-and-sea-blue boutique hotel landing page for Marisol Coastal in Tofino, built as one fully self-contained Astro file with a sticky booking bar, bento amenities, masonry gallery, and a CSS testimonial slider.
- **Palette:** bg `#f7f4ee` · primary `#3f7e93` · accent `#d8a47f`
- **Signature components:** Sticky check-in/check-out/guests availability booking bar floating over the hero; Bento amenity grid mixing a tall photo tile with inline-SVG icon cards; CSS-columns masonry gallery with per-image height tokens and hover saturation; Auto-advancing testimonial slider with animated pill dots and reduced-motion guard; Dining split-screen on a primary-blue band with an inline priced menu list; Faux-map location block with a CSS-drawn pin and click-to-call NAP actions; Intersection-Observer scroll-reveal applied across sections, with parallax hero keyframe drift

### The Marisol — *urban*  ·  [`http://localhost:4356`](http://localhost:4356)

- **Slug / port:** `tmpl-hotel-urban` · port `4356` · `pnpm --filter tmpl-hotel-urban dev`
- **Direction:** Urban luxe — dark, sophisticated, city sophistication
- **Tagline:** “Your sanctuary above the city.”
- **Summary:** A dark, brass-on-charcoal boutique urban tower hotel template with a cinematic night hero, floating booking bar, and after-hours editorial feel.
- **Palette:** bg `#16181c` · primary `#c2a36b` · accent `#7e8b94`
- **Signature components:** Floating glass booking/availability bar overlapping the hero that holds check-in, check-out, guests and a Check Availability CTA; Auto-advancing CSS/JS testimonial slider with five-star ratings, clickable dot navigation, and reduced-motion guard; Masonry photo gallery (CSS columns) with grayscale-to-color and scale-on-hover treatment; Room cards with duotone-overlaid photos, amenity feature pills, and large serif 'from $/night' rates; Dotted-leader dining menu treatment pairing dish names with prices; Parallax night hero with slow CSS zoom animation and dual gradient/duotone scrim; Awards/press editorial logo strip in italic display serif; IntersectionObserver scroll-reveal applied across sections plus a stylized SVG map-pin location card

### Marisol Lodge — *lodge*  ·  [`http://localhost:4357`](http://localhost:4357)

- **Slug / port:** `tmpl-hotel-lodge` · port `4357` · `pnpm --filter tmpl-hotel-lodge dev`
- **Direction:** Mountain lodge — rustic warm wood, cozy, fireside
- **Tagline:** “Come in from the cold. A boutique escape, intimately yours.”
- **Summary:** A rustic, fireside boutique mountain-lodge template in warm wood and amber tones, built as a single self-contained Astro page with a parallax hero, floating booking bar, bento amenities, horizontal gallery, and full conversion stack.
- **Palette:** bg `#f3ebdd` · primary `#7a4a2b` · accent `#b07a3c`
- **Signature components:** Floating sticky booking bar (check-in/check-out/guests/Check Availability) overlapping the hero; Parallax hero with CSS drift keyframe and amber sepia scrim; Dark-timber bento amenity grid with hand-inlined line-icon SVGs (fire, spa, trail, bell, star, wifi); Horizontal scroll-snap gallery with alternating tall frames and sepia-to-color hover; Auto-rotating CSS/JS testimonial slider with dot controls; Pricing-tier package cards with a highlighted featured tier; Faux map card with CSS teardrop pin and hover zoom linking to Google Maps

## Music Artist & Band

### Velvet Static — *electric*  ·  [`http://localhost:4358`](http://localhost:4358)

- **Slug / port:** `tmpl-music-electric` · port `4358` · `pnpm --filter tmpl-music-electric dev`
- **Direction:** Dark electric — neon, kinetic, high-energy
- **Tagline:** “Calgary-born. Made for the late shift.”
- **Summary:** A dark, neon synthwave band site for Velvet Static — kinetic glitch hero, marquee ticker, hover-reactive tour list and merch grid, all on a near-black palette with magenta + cyan glow, built as one self-contained Astro file.
- **Palette:** bg `#0a0612` · primary `#ff2d9b` · accent `#22e0ff`
- **Signature components:** Glitch/RGB-split kinetic hero title (CSS pseudo-element offset animation); Infinite neon marquee ticker that pauses on hover; Tour-date rows that expand padding + reveal venue on hover with per-row ticket CTAs; Stacked streaming-platform buttons with sliding hover motion; Merch cards with bottom-sliding quick-add hover reveal; Duotone/luminosity-blended Lorem Picsum imagery tinted to the neon palette; IntersectionObserver scroll-reveal honoring prefers-reduced-motion

### Velvet Static — *indie*  ·  [`http://localhost:4359`](http://localhost:4359)

- **Slug / port:** `tmpl-music-indie` · port `4359` · `pnpm --filter tmpl-music-indie dev`
- **Direction:** Indie warm — vintage film grain, analog, intimate
- **Tagline:** “Loud nights, quiet mornings. Calgary-born, made for the late shift.”
- **Summary:** A warm, analog indie folk-rock band template with vintage film grain, sepia-graded photography, and intimate golden-hour styling for Velvet Static and their record 'Afterglow'.
- **Palette:** bg `#f5ede0` · primary `#b4502d` · accent `#3f6b52`
- **Signature components:** Spinning translucent-red vinyl that slides out from behind the album cover on hover; CSS film-grain + light-leak fixed overlays with mix-blend-mode for analog texture; Kinetic marquee ticker that pauses on hover; Tour-date rows with two-line date stamp, hover background wash, and per-row ticket/sold-out state; Hard-shadow 'sticker' buttons and an angled 'Out Now' badge for hand-made print feel; Merch cards with slide-up quick-add bar and image zoom

### Velvet Static — *poster*  ·  [`http://localhost:4360`](http://localhost:4360)

- **Slug / port:** `tmpl-music-poster` · port `4360` · `pnpm --filter tmpl-music-poster dev`
- **Direction:** Bold gig-poster — oversized type, graphic, riso-print
- **Tagline:** “Calgary-born. Made for the late shift.”
- **Summary:** A raucous gig-poster website for garage-rock band Velvet Static — oversized Anton display type, riso-print red/blue on cream, halftone photo treatments, and a kinetic marquee, built as one self-contained Astro page.
- **Palette:** bg `#f4f1e9` · primary `#e3322a` · accent `#2440d6`
- **Signature components:** Layered oversized hero wordmark (solid + outlined stroke) with hard offset shadow over a duotone halftone photo; CSS-only infinite marquee ticker repeating tour/OUT NOW phrases; Hover-reveal tour-date rows with accent wash, condensed-date column, and Sold Out line-through state; Riso-style neo-brutalist cards with hard offset box-shadows and grayscale-to-color image hover; Stacked streaming-platform buttons with press-down translate hover; Radial-dot CSS grain/halftone overlay and rotated kicker/badge graphic flourishes

