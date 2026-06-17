# Performance & Core Web Vitals — Audit Briefing

How we measure, grade, and pitch mobile speed / Core Web Vitals (CWV) for low-traffic Calgary local-shop sites — and where the standard tools mislead.

## Necessary (must / should-have)

The non-negotiable rule first: **prefer real-user field data (CrUX) over lab; when field data is absent, grade on lab but label it "lab-only / no real-user data."** CrUX is reported at the 75th percentile (p75) over a rolling 28-day window, segmented mobile vs desktop, preferring URL-level data and falling back to origin. A page "passes" only when ≥75% of real loads are good: **LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1** (current and correct as of 2026; INP replaced FID in March 2024 — FID is fully retired and must not appear in the audit).

The defensible grading rubric, in order:
- **Field URL-level data = authoritative** pass/fail.
- **Field origin-level data = directional only** (whole-site average, not this page).
- **No field data = lab grade with disclaimer.** Report LCP and CLS as diagnostics; report **TBT as the INP proxy** — never a hard INP pass/fail.

Other must-have measurement caveats:
- **Lab cannot measure INP at all.** Synthetic runs only passively load the page; they never interact. TBT is the only lab proxy, and a page can score 0ms TBT yet fail field INP. PSI itself drops INP from assessment when field INP is thin. Treat INP as low-signal in lab mode for brochure sites and do not penalize on it.
- **Lab and field LCP diverge sharply in both directions.** Documented PSI case: lab LCP 8.2s vs field 1.9s on the same page. Never fail a page on lab LCP alone when field data is absent.
- **A single lab run is unstable** (±5–10 points). Google: "the median Lighthouse score of 5 runs is twice as stable as 1 run." Use a median and never grade pass/fail on a knife-edge — a result within ~5 points of a boundary is a tie, not a fail.
- **Grade the individual CWV, not the composite Lighthouse 0–100 score.** Fixed weights (LH 10–12): LCP 25%, TBT 30%, CLS 25%, FCP 10%, Speed Index 10%. The composite hides which metric fails and folds in 30% TBT (an INP proxy that barely applies to static sites) plus 20% non-CWV proxies.
- **Lighthouse "Opportunities"/"Diagnostics" do not contribute to the score.** "Remove unused CSS" and "efficient cache policy" are advisory — never deduct for them.
- **CrUX's eligibility threshold is undisclosed.** Google only says a URL/origin must be publicly discoverable (HTTP 200, not noindex) with "enough samples." Any specific number we cite must be flagged as an estimate.

The highest-impact fix target, also must-have: **LCP is the metric local-shop sites fail most on mobile** (~59% good mobile vs ~72% desktop; INP and CLS pass far more often). The LCP element is an image on ~76% of mobile pages, so **the hero image is almost certainly the LCP element — making hero-image optimization the single highest-leverage perf task per shop.** For poor-LCP pages, "hero discovered late" (load delay ~1,290ms p75) hurts more than image bytes (download ~350ms), so an eager `<img>` with `fetchpriority="high"` recovers more than compression alone. Conversely, **never lazy-load the hero** — ~16–17% of mobile sites do, adding 200–800ms; only below-the-fold images get `loading="lazy"`.

CLS is the cheap, deterministic, high-signal companion: **every `<img>` and `<iframe>` needs explicit width/height (or aspect-ratio)** so the browser reserves space. Astro's Image component sets dimensions automatically, so image-CLS is effectively solved when used consistently.

## Niche / situational

- **Embed facade pattern** is high-impact but rarely implemented: serve a static stand-in (screenshot/placeholder + button) and load the real third-party resource only on click. Maps → static image linking out to Google Maps; chat/booking → load on interaction. YouTube facades average ~800ms faster LCP. ContactNAP already uses a `mapUrl` link rather than an iframe — the correct facade-equivalent default.
- **Inline-iframe fallback** (when a true facade isn't built): give the iframe explicit dimensions and `loading="lazy"` so it loads only near the viewport — fixes both late-injected CLS and below-fold bandwidth contention.
- **Web-font tuning:** self-host fonts (removes a render-blocking third-party Google Fonts request, enables preload/caching), use `font-display: swap` (or `optional`), preload the 1–2 critical fonts with crossorigin, and set size-adjusted fallback metrics to kill swap shift. One case cut CLS 0.18 → 0.03. Static architecture does **not** solve this automatically. The CLS-share figure (fonts ≈15–20% of median CLS) is _(provisional)_.
- **WebP/AVIF conversion** is common-but-missing: WebP is only ~7–12% of images, AVIF ~0.3%, while JPEG/PNG dominate. Converting hero/gallery to WebP yields ~25–35% smaller files; AVIF first is ~50% smaller than JPEG. Astro's Image component emits these automatically.
- **Hero preload / `fetchpriority="high"`** measurably speeds LCP (CoreDash: 98% of preloaded-LCP loads score good vs 88% without; Google Flights cut LCP 2.6s → 1.9s with fetchpriority alone), yet only ~2.1% of pages do it. _(provisional)_

## Always reused vs rare

**Always reused** — the stable per-build perf checklist, justified because the architecture-guaranteed wins (static HTML, edge CDN, zero JS) are constant and the residual failure modes are a small fixed set across all verticals:
1. Hero image: weight + modern format + responsive variants.
2. Hero set eager + `fetchpriority="high"` (never lazy).
3. Explicit width/height on every image/iframe.
4. Self-hosted, preloaded fonts with `swap` + sized fallbacks.
5. Third-party booking/map/chat via link-out or facade/lazy.

Items 1–3 are auto-handled if the hero goes through Astro's Image component, collapsing the checklist to: **use Image for the hero + set priority, self-host fonts, link-out/facade embeds.** Self-hosting fonts is a one-time engine decision (~10 min) that benefits every shop.

**Rare** — the facade pattern is uncommon in the wild despite applying to nearly every vertical with an embed (booking, map, chat). It is the high-leverage thing most DIY/page-builder sites skip.

## Most vs least common

**Most common failure modes** (ranked as primary cause of a failing mobile PSI score):
1. **Platform/page-builder bloat** — the largest empirical driver. CWV pass rates (June 2025 HTTP Archive CrUX): WordPress 43.4%, Drupal 59.1%, Squarespace 67.7%, Wix 70.8%, Shopify 75.2%, Duda 83.6%. WordPress+Elementor/Divi routinely ships 3–5MB pages. A prospect on WordPress+page-builder is the single strongest predictor of a failing score — and the best outreach target.
2. **Unoptimized/late hero image** (oversized, lazy-loaded, or CSS-background).
3. **Render-blocking third-party scripts/embeds** (booking/chat/analytics/fonts).
4. **Slow origin / no CDN** → high TTFB (the largest poor-LCP subpart, ~2,270ms p75).
5. **Web-font + embed layout shift** (CLS).

**Least common / lowest-priority:** INP is rarely the primary mobile failure for brochure sites. CLS already passes on ~79% of mobile pages — a "finish the job" item, not the main offender. Unused-CSS and cache-policy warnings are near-universal but non-scored and often unfixable (third-party assets), so they carry low diagnostic value. The unused-CSS framing rests on a _(provisional)_ claim.

## What works vs what doesn't

**Works (architecture-guaranteed):** Pre-rendered static HTML from a CDN edge gives fast, predictable LCP and collapses TTFB/caching problems by default — a structural fix, not a per-asset one. CLS is "guaranteed good" for static first-party HTML when dimensions are set, since there's no async-injected content. Our static Astro engine structurally beats every page-builder listed above. The React-SPA→Astro LCP migration figures (~4s → ~1.5s) and the "LCP mostly guaranteed but gated by the hero image" framing are _(provisional)_.

**Doesn't work / residual risk:** The architecture does **not** auto-solve the hero image (weight/format/priority remains a per-build lever), web fonts, or third-party embeds. **Third-party embeds are the primary way a static shop site still fails CWV** — iframe widgets add 20–40 requests and 100KB–2MB of JS, hurting LCP/FCP and inflating INP; each must be deliberately controlled per build.

Per-vertical notes:
- **barber / spa / fitness / dental / cafe / auto** — these book online and/or embed a map, so the embed judgment call (facade vs lazy iframe vs link-out) is the live perf decision for these verticals.
- **law / retail / trades** — typically only a map embed, so the embed surface is smaller; map → static image + link-out covers it.
- **retail / cafe** (on-site ordering/transactions) — conversion-vs-speed curves apply most directly here (Portent: B2C conversion 3.05% at 1s → 0.67% at 4s), justifying a sub-3s mobile load as the highest-leverage target. For call/booking-CTA verticals the absolute % won't transfer, but "faster = more leads reach the CTA" still holds.

## Audit takeaways

- **Branch the rubric on field-data presence:** query CrUX via the PSI API and grade on p75 LCP/INP/CLS if present; else grade on lab with an explicit "worst-case Slow-4G / mid-tier Android — real iOS/4G Calgary visitors will be faster" caveat. **Most single-location shops will have no CrUX data** — this is the expected default, not a defect, so never report a blank CWV section as a failure.
- **Never hard-fail an image-optimized static site on lab LCP alone**, and never report a lab INP pass/fail. PSI's mobile lab is a worst-case relative diagnostic: Slow 4G (1.6 Mbps) is ~40–55x slower than Canada's ~82–92 Mbps median, and the emulated mid-tier Android is slower than the iPhone the median Calgary visitor (Apple ~64% Canadian share) actually carries. Target a "good 4G" profile, not 5G or Slow-4G.
- **Pin one tool/throttling config.** PSI reduced mobile lab CPU throttling from 4x to ~1.2x in Dec 2024; local Lighthouse CLI still defaults to 4x, so scores are non-comparable. Standardize on the PSI API for outreach consistency (or document the local 4x bias).
- **Center the per-shop checklist on the hero image:** Astro Image for the hero (format + srcset + dimensions) set eager with `fetchpriority="high"`, explicit dimensions on all media, self-hosted preloaded fonts, and link-out/facade for every embed.
- **Use builder detection as a prospecting signal:** WordPress+Elementor/Divi = high-conversion audit lead.
- **Pitch perf honestly as a conversion lever, not a ranking guarantee.** Google uses CWV in ranking but says "there is no single signal" and passing thresholds "doesn't guarantee that your pages will rank." Page speed is **not** a documented local-pack factor (GBP ~32%, reviews ~20%, proximity dominates). The real value is conversion: as mobile load goes 1s→10s, bounce probability rises 123% (Google/SOASTA); a 0.1s improvement lifted retail conversions ~8.4% (Deloitte/Google). Most competitor small-shop sites average ~15s mobile loads, so "fast by default" is a credible, demonstrable differentiator.
