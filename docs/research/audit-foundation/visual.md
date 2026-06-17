# Visual & Brand Quality — Audit Knowledge Base

Synthesis of the 81 `dimension: "visual"` claims covering credibility, dated-vs-premium, typography, hierarchy, whitespace, imagery, and price-point fit. _(provisional)_ marks only points resting on a still-provisional claim.

## Necessary (must / should-have)

**Why visual is weighted at all (foundational, must-have):** Visual appeal is judged in ~50ms (as fast as 17ms) and that snap verdict correlates strongly with longer-exposure judgments, so design — not copy — sets the first impression. In Stanford's web-credibility research, "design look" was the single most-cited credibility factor (~46.1%), above every content factor. "Professional design" is one of the ten Stanford Guidelines and a credibility lever independent of content quality — a dated site loses trust even when its information is accurate. The mechanism is a **halo effect**: a good-looking site is inferred to be more usable, trustworthy, and competent ("looking good is being good"). This is the validated basis for a visual-only screenshot-scoring rubric.

**Hard, checkable must-haves:**
- **Real, authentic photography** of the actual business over stock/clip-art — the single highest-leverage screenshot tell (real-photo swaps ~35% conversion lift; users' eyes skip obvious stock filler); a real **hero masthead** above the fold carries the 50ms impression.
- **Body contrast ≥ 4.5:1** (3:1 for large text); low-contrast grey-on-white body copy is both a top amateur tell and an AA failure. Low contrast is the single most common web visual defect — ~79% of homepages, ~30 instances/page — and ~96% of all WCAG errors fall in six scriptable categories led by contrast.
- **Body text ≥ 16px** (18px for long-form); below 16px reads amateur and hurts mobile readability.
- **Body line-height ≥ 1.5** unitless — readability fundamental and the WCAG 1.4.12 reference value.
- **No low-res/blurry/dark/stretched/pixelated images** — instantly degrades perceived quality.
- **"Wall of text"** — long unbroken, unscannable paragraphs — is a top dated tell; pair with cramped, low-whitespace layouts and no clear hierarchy, also credibility failures.
- **Responsive / mobile-legible layout** (no horizontal scroll, readable text, ≥44px-ish tap targets on click-to-call and booking CTAs) — ~57% of local and up to ~88% of "near me" searches are mobile. Audit the *rendered* mobile screenshot, not just the viewport meta tag.
- **Modern, non-dated aesthetic that fits the price point**; outdated type, low-quality images, cramped layouts, and weak CTAs make a business look smaller/less credible than it is.
- **No broken/default-template chrome** — placeholder text, demo nav, builder watermarks, untouched theme fonts/colors, lorem/dead links are explicit amateur tells.
- **No visible typos/broken/placeholder elements** (broken-image glyphs, "image coming soon") — quickly destroys credibility.
- **Favicon + present logo**; a missing favicon makes users question credibility and affects search CTR.
- **One consistent brand color + disciplined type** (2–3 typefaces max) — too many fonts/colors reads chaotic; visual cohesion across the site is itself a premium signal.

**Should-have (strong polish levers):**
- **Display + body type pairing** rather than the UA default serif/sans; the bare default font is the hard amateur signal.
- **Modular type scale** (≥1.2 ratio, e.g. 16→20→25→31→39px) so headings are unmistakably larger than body; flat hierarchy is the dated tell.
- **Line length ~45–75 cpl** (target ~66), enforced via a text max-width (~60–75ch); full-bleed body text reads amateur.
- **Restrained palette** (~2 neutrals + 1 accent); clashing/over-bright colors cheapen instantly.
- **Generous whitespace** — the most reliable, cheapest premium-vs-budget lever.
- **Lower visual complexity / familiar (prototypical) layout** — cluttered pages rate worse within 17–50ms; conventional section order (hero → services/menu → reviews → hours/NAP → CTA) reads as quality.
- **Skeuomorphic styling** (beveled/glossy buttons, heavy shadows, faux textures) is a ~2008–2012 era-marker.
- **Subtle motion** (hover, sticky nav, gentle transitions) as a polish layer that MUST respect `prefers-reduced-motion` (the accessibility clause is the only hard part).

## Niche / situational

- **Dark themes** — brand-driven, not a quality bar; fit nightlife and some fitness/auto/barber brands, fail most cafe/dental/law/spa (light/airy). Must still pass AA contrast; implemented purely via `theme.css` tokens.
- **Custom illustration / bespoke iconography / elaborate art-direction** — nice-to-have polish, not table-stakes; a consistent built-in icon set + real photos clears the bar.
- **Excessive parallax / scroll-jacking / heavy decorative animation** — gimmicky and dated, hard to screenshot-score; weight low.
- **Over-design risk (reverse mismatch)** — a budget, high-volume shop adopting heavy luxury cues (deep minimalism, exclusivity, slow reveals) can misprice itself; goal is "professionally made," not "expensive/exclusive." Lower-frequency than under-design.
- **Per-vertical register-fit as an explicit scored dimension** — almost no audit tool checks it today, so it reads "rare" in practice though it should be standard.

## Always reused vs rare

**Always present / reused on every site (the universal floor):** the 50ms-first-impression and credibility-halo justification; clean professional look; legible mobile-first hierarchy; AA contrast; consistent single brand color + disciplined type. Per-vertical differentiation is *mechanically* always present (every shop gets a tailored theme) but its *expression* is vertical-specific.

**Commonly present but frequently missing (`common-but-missing` — the differentiator gap):** real authentic photography, generous intentional whitespace, body size ≥16px, line-height ≥1.5, adequate contrast, a custom favicon, and a real display+body type pairing. These are cheap to ship and frequently absent on prospect sites — the core value wedge.

**Rare:** visible builder/template watermarks, visible typos/broken/placeholder elements, custom illustration, and dark themes. Rare but often hard binary signals when present.

## Most vs least common

**Most common defects to detect (high prevalence):** low-contrast text (~79% of homepages), wall-of-text, cramped/no-hierarchy layouts, generic stock imagery, default-template chrome, poor mobile rendering, dated overall aesthetic, autoplay hero carousels, intrusive pop-ups, and stale visible content (old footer year, off-season banners).

**Least common (rare):** builder watermarks, visible typos/broken-image glyphs/lorem, custom illustration, dark themes, the budget-shop-over-designing mismatch.

**Measurability note:** roughly half of human aesthetics variance is computable from a single screenshot — colourfulness, visual clutter/edge density, figure-ground contrast, whitespace, dominant-color count (Miniukovich/Oulasvirta; AIM toolkit explains ~36–51%). No single proxy exceeds ~50%, so the subjective half needs a vision-LLM.

## What works vs what doesn't

**Works (premium / trust signals):**
- Real photos of the actual shop/staff/work; a strong hero masthead.
- Generous whitespace — the most reliable, cheapest premium-vs-budget lever.
- Restrained palette + intentional display/body type pairing.
- Clear modular hierarchy, AA contrast, ≥16px body.
- Visual cohesion across the site (single-theme consistency reads premium).
- Familiar, category-prototypical layout order (hero → services/menu → reviews → hours/NAP → CTA) — familiarity reads as quality and registers within 50ms.
- Lower visual complexity → better first impression than cluttered pages.

**Doesn't work (dated / cheap tells):** stock/staged photography; low-res/blurry/stretched images; default/novelty fonts and centered Times/Arial body; wall-of-text; cramped, no-whitespace, no-hierarchy layouts; clashing/washed-out palettes; skeuomorphic buttons; autoplay hero sliders (Notre Dame: ~1% clicked, ~84–89% on slide one); builder watermarks; typos/broken/placeholder elements; intrusive pop-ups + autoplay media; stale visible content; scroll-jacking/parallax overload (low impact, hard to screenshot).

**Per-vertical notes (price-point / register fit):**
- **Premium / commerce-leaning verticals carry the most visual weight** — finance/transaction sites lean hardest on design (~46–55%), health/professional ~42%; all shop verticals are transactional, so visual quality matters most where money/booking changes hands.
- **Aesthetic / high-touch (spa, dental, law, fine cafe):** judged on sophisticated polish and warmth; under-polishing is *disqualifying*; serif/legacy type and a calm/premium register are expected.
- **Trades / auto:** judged on clarity, trust signals (real technicians, vehicles, job photos, reviews), and fast problem-solution matching; over-polishing adds little — spend the "visual budget" on a sturdy legible sans and trust cues, not decorative gloss.
- **See-the-craft / photography-led (barber, cafe, spa, fitness, auto, retail, dental):** image quality is a top differentiator; real photos drive the trust lift, stock filler is skipped by users' eyes.
- **Highest-value prospect flag:** a premium/established business on a visibly cheap, generic, or dated template — the design-price mismatch caps believable pricing and is the strongest "flag this prospect" signal.

## Audit takeaways

- **Anchor the deterministic floor on contrast.** AA contrast is the one visual metric automated tools (axe-core/Lighthouse) score reliably; make it a hard sub-check and hard-fail the visual category to D on AA-contrast failure or non-mobile layout.
- **Encode the cheap, exact guardrails:** body ≥16px, line-height ≥1.5, line length ~45–75ch, modular type scale ≥1.2 with headings clearly larger than body. These are computable and high-confidence.
- **Add screenshot-derived proxies for the visible tells:** stock/blurry/stretched imagery, cramped whitespace/edge density, dominant-color count (band ~2–5), web-font/type-pairing presence (absence is ambiguous — deliberate system stacks are invisible to crawlers), autoplay slider chrome, builder watermarks, stale footer year, pop-up overlays. Colourfulness + clutter + whitespace explain ~half of aesthetics variance.
- **Make a vision-LLM the primary scorer for the subjective half**, on mobile+desktop screenshots with a fixed 6-dimension rubric (palette discipline, type pairing/hierarchy, whitespace/balance, imagery quality, depth/polish, dated-vs-premium + price-point fit), 1–5 sub-scores with one-line justifications averaged to the grade. Pass the vertical in and score register-fit ("design appropriate for purpose," not maximal polish).
- **Treat LLM design scores as noisy** _(provisional)_: zero-shot validity ~13%, best few-shot ~0.48 vs ~0.75 human — fix low temperature, average runs, anchor with calibrated good/bad exemplars (or pairwise vs a reference), randomize order, and flag the visual category `partial / lower-confidence`.
- **Prioritize the highest-conversion outreach targets:** premium/established businesses stuck on cheap or dated sites, where the business-tier-vs-site-tier gap makes the value proposition self-evident. Tuning visual richness *up* for premium-positioned shops raises perceived value _(provisional)_, and account for hero-image weight as both an aesthetic and an LCP factor _(provisional)_.
