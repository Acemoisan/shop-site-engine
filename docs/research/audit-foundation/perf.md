# Performance & Core Web Vitals — Audit Briefing

How to measure, grade, and pitch site speed for low-traffic single-location Calgary shop sites, synthesized from the performance claim base.

## Necessary (must / should-have)

**Grading rule — field first, lab as fallback (verified).** Prefer real-user CrUX field data when present, falling back URL-level → origin-level → none. CrUX is the authoritative pass/fail signal Google ranks on, reported at the 75th percentile over a rolling 28-day window; a single synthetic lab run is not a p75 and must never be reported as a CrUX pass/fail. When field data is absent, Lighthouse remains the recommended tool but must be labeled "lab-only / no real-user data."

**The "good" thresholds are settled (verified for values; framing provisional).** p75 targets: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. INP replaced FID as a stable CWV in March 2024; FID is retired and must not appear in the audit. _(provisional)_

**Lab cannot measure INP at all (verified).** A synthetic run never interacts with the page. TBT is the only lab proxy, and it captures only main-thread blocking during initial load — a page can score 0ms TBT and still fail field INP. Never report a hard INP pass/fail from Lighthouse; for brochure-style shop sites treat INP as low-signal in lab mode and near-pass-by-default. _(provisional)_

**Lab LCP/CLS diverge from field (verified).** Documented PSI example: lab LCP 8.2s vs field LCP 1.9s on the same page; lab CLS 0.04 vs field CLS 0.12 — divergence is bidirectional and metric-dependent. Lab LCP is systematically pessimistic (Lighthouse throttles to ~1.6 Mbps / 150ms / 4x CPU, cold cache — "the slowest 5–10%"); treat it as a conservative worst-case floor, not the median, and never hard-fail a page on lab LCP alone when no field data exists. Lab CLS is "load-time only" (above-the-fold during initial load), so a clean lab CLS can coexist with a poor field CLS. _(should-have / verified)_

**The CrUX threshold is undisclosed (verified).** Google only states a URL/origin must be publicly discoverable (HTTP 200, not noindex) with "a sufficient number of distinct visitors." Any specific number the audit cites must be flagged as an estimate. Best third-party estimates: origin-level field data may appear ~400 pageviews/month/device (Erwin Hofman); URL-level data ~1,000 views/month/device (DebugBear). Mobile and desktop are counted separately, so a shop's mobile traffic must independently clear the bar.

**Hero image is the single highest-leverage task (verified).** The LCP element is an image on ~76% of mobile / ~85% of desktop pages, so on a shop site the hero is almost certainly the LCP element. On mobile, LCP is the CWV that local-shop sites fail most (~59% good mobile vs ~72% desktop); INP (~74%) and CLS (~79%) pass far more often. Prioritize LCP first.

**Hero must load eagerly, never lazy (verified).** ~16–17% of mobile pages lazy-load their LCP image, adding 200–800ms to LCP — an easy own-goal from blanket `loading="lazy"`. The hero gets `loading="eager"` (ideally `fetchpriority="high"`); only below-the-fold images get `loading="lazy"`. Resource load delay ("hero discovered late" — lazy, JS-inserted, or CSS-background) is the second-largest poor-LCP subpart (~1,290ms p75) after TTFB (~2,270ms); image download duration is the smallest (~350ms). So an eager foreground `<img>` beats compression alone.

**Modern formats + responsive sizing for the hero (verified).** AVIF (~50% smaller than JPEG) with WebP fallback (~25–35% smaller) plus `srcset`. Astro's Image component does format conversion, responsive sizing, and dimension-setting automatically — the checklist item is "use the Image component for the hero," not hand-roll `<img>`. A raw multi-MB JPEG hero is the classic way a static site still fails LCP.

**Explicit dimensions on every image/iframe (verified).** Width/height (or CSS aspect-ratio) is the canonical CLS fix; missing dimensions force reflow on load. Astro's Image component sets these automatically, so CLS-from-images is effectively solved when used consistently.

**Pin one tool/throttling config (verified).** PSI reduced mobile lab CPU throttling from 4x to ~1.2x in Dec 2024; locally-run Lighthouse CLI still defaults to 4x, so PSI-web and `pnpm lighthouse` report materially different scores for the same site. The collector must standardize on one config (recommend pinning the PSI API: CrUX + 1.2x lab) or scores are non-comparable across prospects and over time.

**Store the three CWV individually, not the composite (verified value, provisional framing).** The Lighthouse 0–100 score is a weighted average: LCP 25%, TBT 30%, CLS 25%, FCP 10%, Speed Index 10%. Grading off the composite blends 20% non-CWV proxies (FCP, SI) and a 30% INP-proxy (TBT, barely applicable to static brochure sites) into one number that hides which metric is actually failing. Store LCP, CLS, and the TBT proxy separately. _(provisional)_

**Multi-run / median, no knife-edge fails (verified value, provisional framing).** A single mobile Lighthouse run swings ±5–10 points; Google states the median of 5 runs is twice as stable as 1. Run multiple passes (or use PSI, which medians internally) and treat any grade within ~5 points of a boundary as a tie, not a fail. _(provisional)_

## Niche / situational

- **Embeds are the per-shop judgment call (verified).** Third-party booking widgets, map iframes, and chat widgets are the primary way a static site still fails CWV — often 20–40 extra requests and 100KB–2MB of JS, competing for early bandwidth (LCP/FCP) and blocking the main thread (INP). Most relevant to verticals that book online (barber, spa, fitness, dental) or embed a map; law/retail/trades/cafe may only have a map.
- **Facade pattern for heavy embeds (verified, rare in the wild).** Static stand-in + load-on-interaction: map = static image linking out to Google Maps; booking = link/button to the host, not an inlined widget; chat = load on click. YouTube-facade pages average ~800ms faster LCP. When a true facade isn't built, the fallback rule is: reserve space (width/height or aspect-ratio) + `loading="lazy"` on any inline iframe.
- **Preload / fetchpriority on the hero (provisional).** Only ~2.1% of pages preload their LCP image, yet preloaded LCP images score "good" 98% vs 88% of the time. For a plain foreground `<img>` the preload scanner usually finds it, so `fetchpriority="high"` is the main lever; explicit `<link rel=preload>` matters most for CSS-background or JS/slider heroes. _(provisional)_
- **Web fonts are a residual CLS/LCP risk static architecture does NOT auto-solve (verified).** Font swaps contribute ~15–20% of median-page CLS and FOIT delays text-LCP. Mitigations: self-host (removes a third-party origin, enables preload/caching), `font-display: swap` (or `optional`), preload 1–2 critical fonts with crossorigin, size-adjusted fallback metrics. One case cut CLS 0.18 → 0.03. The engine pairs a display + body font, so two webfonts is the typical surface.

## Always reused vs rare

**Always reused — the per-build perf checklist (provisional synthesis).** A fixed checklist ships with every shop because the guaranteed-by-architecture items (static HTML, edge CDN, zero JS) are constant and residual failure modes are a small fixed set: (1) hero image weight/format/responsive; (2) hero eager + fetchpriority high, never lazy; (3) explicit width/height on all images/iframes; (4) self-hosted, preloaded fonts with swap + sized fallbacks; (5) third-party booking/map/chat via link-out or facade/lazy. Items 1–3 are auto-handled when the hero uses Astro's Image component, collapsing the list to: use Image for hero + set priority, self-host fonts, link-out/facade embeds. _(provisional)_

**Always present, non-actionable caveats.** CrUX threshold undisclosed; lab can't measure INP; CrUX is p75/28-day; lab is a worst-case floor — these are constant framing rules every audit must restate.

**Rare:** the facade pattern itself is rare in the wild (a differentiator, not a baseline), and explicit `<link rel=preload>` is only needed for non-standard heroes.

## Most vs least common

**Most common failure drivers (provisional ranking).** By frequency-as-primary-cause of a failing mobile PSI score: (1) platform/page-builder bloat — WordPress passes CWV only ~43% vs Squarespace ~68%, Wix ~71–75%, Shopify ~75%, Duda ~84%; WordPress+Elementor/Divi routinely ships 3–5MB pages; (2) unoptimized/late hero image; (3) render-blocking third-party scripts/embeds; (4) slow origin / no CDN (high TTFB); (5) web-font + embed layout shift. INP is rarely the primary mobile failure for brochure sites. A prospect on WordPress+page-builder is the strongest single predictor of a failing score and the best outreach target. _(provisional)_

**Common-but-missing (the cheap wins prospects skip).** Modern image formats (WebP only ~7–12%, AVIF ~0.3% of images vs JPEG/PNG ~32%/28%); LCP-image preload (~2.1% of pages); CrUX field data itself (most single-location shops fall below the threshold — expected default, not anomaly). Mobile is slow in the wild (Google measured ~15s average mobile landing-page load, 70%+ taking >5s above-the-fold), so "fast by default" is a real differentiator.

**Near-universal but low-value (do NOT deduct).** "Remove unused CSS" trips almost every site (2024 median page ships ~79KB CSS, ~52KB unused) and is a non-scored opportunity. "Efficient cache policy" frequently fires on uncontrollable third-party assets (Google Fonts, GA, Pixel) and only helps repeat visits, not first paint. Google states explicitly that Opportunities/Diagnostics do NOT contribute to the performance score — treat as advisory, never grade deductions. _(provisional)_

## What works vs what doesn't

**What works**
- **Static HTML on an edge CDN (provisional).** Pre-rendered markup arrives ready-to-paint with no client-side JS; real React-SPA→Astro migrations cut LCP ~4s → ~1.5s. Edge delivery also collapses TTFB — the largest poor-LCP subpart (~2,270ms p75), which is mostly hosting/origin, not content. This structurally fixes CDN + caching + TTFB, a built-in advantage over shared-host WordPress prospects. But LCP is "mostly guaranteed, not free" — the hero image remains the per-build variable. _(provisional on the migration figure)_
- **Hero through Astro Image + eager + priority; explicit dimensions; self-hosted fonts; link-out/facade embeds** — the verified high-yield levers above.

**What doesn't work**
- **Grading on the composite Lighthouse score or on non-scored diagnostics** — hides the failing metric and penalizes noise. _(provisional)_
- **Hard-failing on a single lab LCP** when no field data exists — lab is a worst-case Slow-4G/mid-tier-Android floor.
- **Blanket `loading="lazy"`** — the classic footgun that lazy-loads the hero.

**Honesty on the SEO pitch (verified).** Google uses CWV in core ranking as part of page experience but states "there is no single signal" and that good CWV "doesn't guarantee that your pages will rank at the top" — it's a quality floor / tiebreaker, not a ranking lever. In the **Local Pack**, ranking is dominated by Google Business Profile (~32%), reviews (~20%), on-page (~15%), and proximity (the strongest visibility driver, ~36–55%); recognized Local Search Ranking Factors surveys do NOT list page speed or CWV as a local-pack factor. Sell perf as a **conversion** lever and organic tiebreaker, not local-ranking.

**Conversion is the real pitch (verified).** Google/SOASTA: mobile load 1s→10s raises bounce probability 123%, and 400→6,000 page elements drops conversion probability 95%. Deloitte/Google (30M+ sessions): a 0.1s mobile speed gain correlated with ~8.4% higher retail conversions, ~9.2% higher AOV, ~10.1% higher travel conversions. Portent (~100M page views): B2C ecommerce conversion falls 3.05%→0.67% from 1s→4s load, steepest in the first few seconds — most directly applicable to **retail and cafe** (on-site transactions/orders). For **call/booking-CTA verticals** (barber, spa, etc.) the absolute % won't transfer, but "faster = more conversions" holds directionally; cite conservatively. Roughly half of mobile visitors abandon a site not loading in ~3s, and per-second delay can cut conversions up to ~20% _(provisional)_.

**Per-vertical notes**
- **barber, spa, fitness, dental** — online-booking verticals; embeds (booking widgets + map) are the dominant per-shop perf risk. _(verified)_
- **cafe** — may book/order online; embeds + the Portent conversion curve both apply. _(verified)_
- **auto** — listed among embed-bearing verticals (booking/map). _(verified)_
- **law, retail, trades** — typically only a map embed, so embed risk is lower; retail/cafe see the strongest conversion-speed linkage. _(verified)_
- **All of barber, cafe, spa, trades, fitness, dental, law, auto, retail** — the typical no-CrUX, single-location case: expect origin-level field data at best, often none. _(verified)_

## Audit takeaways

- **Branch the rubric on data availability:** grade on CrUX p75 (LCP<2.5/INP<200/CLS<0.1) when present; else grade on lab with the explicit caveat "worst-case Slow-4G / mid-tier Android — real iOS/4G Calgary visitors will be faster," and never hard-fail an image-optimized static site on lab LCP alone.
- **Store the three CWV individually**, never the composite; show INP only from field data (TBT is a weak proxy for static brochure sites) _(provisional)_.
- **Weight LCP heaviest, then CLS:** LCP is the metric shop sites fail most on mobile and is almost always the hero image; CLS is cheap, deterministic in lab, and maps to a one-line fix (image/iframe dimensions).
- **Pin one tool config (recommend PSI API)** and median multiple runs; treat a grade within ~5 points of a threshold as a tie _(provisional)_.
- **Ignore non-scored noise:** don't deduct for "remove unused CSS" or third-party "efficient cache policy" flags _(provisional)_.
- **Use builder detection as a prospecting signal:** WordPress + page-builder is the strongest single predictor of a failing mobile score and the highest-conversion outreach lead _(provisional)_.
- **Pitch perf as conversion + organic tiebreaker, never as a local-pack ranking driver** (GBP, reviews, proximity dominate the map pack).
