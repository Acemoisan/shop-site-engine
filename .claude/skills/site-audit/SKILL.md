---
name: site-audit
description: Use when auditing a prospect's website for outreach or scoping. Given a URL, runs the deterministic collector, reviews the site visually from screenshots, writes the branded 1-page audit, and drafts how we'd implement the fixes. Triggers on "audit this site", "run a site audit", "scope this prospect".
---

# Site Audit

Two-layer rule: **the collector computes the facts (grade, tier, inventory); you only rank, write, and explain.** Never invent or re-derive scores. But the collector is blind to *how the site looks* — that's what the visual-review step is for, and it can change the recommendation.

## Steps

1. **Run the collector** from `packages/audit`:
   ```bash
   cd packages/audit && PSI_API_KEY=$PSI_API_KEY pnpm tsx src/cli.ts <url> <vertical>
   ```
   - `<vertical>` is optional (e.g. `barber`, `cafe`, `dental`). `PSI_API_KEY` is a persistent user env var on this machine — without it the grade is `confidence: "partial"` (no performance/CWV data, `PSI 429`). A free key gives 25k queries/day (see `docs/research/2026-06-15-pricing-tools-and-compliance.md`).
   - The CLI writes `audit-<host>.json` (data) and `audit-<host>.html` (branded, sendable 1-page report), and prints the JSON to stdout.

2. **Read the emitted `AuditData` JSON.** Take `grade.overall`, `tier`, `fixes.targeted`, `fixes.general`, `inventory`, `stack`, and `psi` as **authoritative**. Note `grade.confidence` and `reachable`/`blocked`.

3. **Handle the special states first:**
   - `reachable: false` → the **new-build** path. No working site; write a short "no real website" note (the report renders this) and **skip the visual review**. Don't fabricate page-level issues.
   - `blocked: true` (tier `blocked-unknown`) → site exists but our check was blocked (e.g. 403 challenge). Don't grade the challenge page; flag for a manual look. Screenshots may still work — try them.

4. **Visual review (the collector can't see this).** Capture and look at the real site:
   ```bash
   cd packages/audit && node screenshot.mjs <url>
   ```
   This writes `shot-<host>-mobile.png` and `shot-<host>-desktop.png` (full-page). **Read both images** and assess what an HTML scan misses:
   - Dated/templated aesthetic ("AI slop" or a 2010s theme), harsh or off-brand colour, weak type.
   - Poor hierarchy / walls of text / low-contrast hero / cramped or sparse sections.
   - Mobile experience specifically (most local traffic) — overly long, unreadable, broken layout.
   - Whether the look matches the business's price point (a premium shop with a cheap-looking site is a strong pitch).
   - **This can elevate the recommendation:** a site that's feature-complete (rubric says `tune-up`) but visibly dated/slow is really a **rebuild** opportunity. Say so, and base it on the screenshots + a failing `cwv.pass`/low `psi.performance`.

5. **Rank the top 3 issues** by **customer impact**, drawing on both layers: failing Core Web Vitals / slow `performance` and lost calls/bookings (click-to-call, booking, hours) > local SEO (address/map, LocalBusiness JSON-LD) > trust (HTTPS, reviews) > dated visuals/polish. The HTML report ranks the *feature* gaps; you add the perf + visual findings and adjust the prose for the vertical.

6. **For each issue, write:** the problem, *why it costs them customers*, and the fix — per `docs/gtm/outreach.md` structure. Plain-spoken, non-condescending.

7. **The HTML report is the artifact.** `audit-<host>.html` is self-contained — email, host, or screenshot it. Open the `file://` path to preview.

8. **Post-audit: how we'd implement it (scoping → plan).** Turn findings into our build plan:
   - **Scope → flat fee + add-ons → effort → price.** We sell **one $1,500 flat-fee build** (no tiers) — the standard core component set is the same every site. So scoping is *not* "which tier"; it's "the $1,500 flat fee + which add-ons." Map `tier`/grade (and any visual-review upgrade) to the engagement type in `docs/gtm/packaging.md`: no site or grade D–F → the **$1,500 flat-fee build/rebuild** (+ the **content-migration / 301-redirect add-on** on any rebuild); grade B–C → a **targeted "tune-up" mini-engagement**, not the full build; grade A → be honest, decline or offer a small specific fix. Then list any **add-ons** the findings justify (e-commerce / online ordering, booking beyond the one included, extra pages/sections, full copywriting, multi-location, photo sourcing, GBP optimization) — each one-time, quoted up front; anything outside the menu → **custom quote**. Don't quote tier prices ($1,800/$3,500/$6,000 are superseded).
   - **Pick the design direction, then build on the shared engine.** Browse `sites/tmpl-<vertical>-<variant>` (see `docs/templates-catalogue.md`) as *visual reference only* — the `tmpl-*` sites are standalone explorations with no shared components. The actual client build follows the **`create-shop-site` skill**: a new `sites/<slug>` on `packages/shared` with its own `theme.css` + content (the production "one engine, themed per shop" rule). Mine the chosen `tmpl-*` for layout/token ideas; don't ship it as-is.
   - **Content migration.** List what ports straight over from their current site (services + prices, hours, reviews, address/map, booking link, phone) into our content model / Storyblok (use the `storyblok-shop-cms` skill). **Account for the detected stack** (`stack.platform`/`builder`/`booking`/`payments`/`embeds`) per the *Platform & embedded-tool intelligence* table: state which platform we're migrating off of and — per the hard rule — whether each detected booking/payment/chat/form tool is **preserved (re-embedded)** or **deliberately replaced**. A site that loses a working Booksy/Square/Calendly at handoff is a regression, not a launch.
   - **Close the gaps.** The missing `fixes.targeted` items (e.g. contact form, Menu/service structured data) become build tasks; we ship LocalBusiness JSON-LD by default.
   - **The performance win is the headline.** A static Astro build gets LCP < 2.5s / CWV pass — name the concrete before→after (e.g. "LCP 4.2s → under 2.5s").
   - **Output:** a short internal scoping note (template + content plan + gap list + package/price/effort) AND the client-facing next step (send the 1-page report; offer a quick before/after using the chosen template).

## Verified priorities & honesty rules (knowledge base)

The research knowledge base (`docs/research/audit-foundation/SUMMARY.md`, 556 verified claims) distils to these. Use the ranking in step 5 and the honesty rules in step 6 — they make audits sharper and defensible. Read `SUMMARY.md` for depth/citations.

**Rank findings by this verified customer-impact order:**
1. **Real, prominent `tel:` anchor** (E.164, above fold + sticky mobile header) — highest-ROI single defect for call-driven verticals (trades/auto/dental/law).
2. **One dominant, vertical-correct above-fold CTA** (book / quote / request / order / visit), secondaries de-emphasized, repeated nav→hero→closing + sticky. ~70% of SMB homepages lack a clear one.
3. **Social proof at the decision point** — star rating + *specific recent count* + a named testimonial near the CTA/hero, not the footer.
4. **HTTPS + a form-gated privacy policy (Alberta PIPA)** — "form present + privacy policy absent" is the single most defensible compliance finding; visible "Not Secure" is screenshot-able harm.
5. **Mobile speed via static architecture, centred on the hero image** — eager hero `fetchpriority="high"`, modern format + dimensions, self-hosted fonts, facade embeds. WordPress + page-builder detection is the strongest prospecting signal.
6. **AA contrast** (the #1 web defect; the one visual metric tools score reliably).
7. **Quality `LocalBusiness` JSON-LD** — correct per-vertical `@type`, structured address/`geo`/hours; grade quality not mere presence; **never self-`aggregateRating`**.
8. **Real photography + About/owner story + quoted testimonials** — the biggest content gaps vs a bare inventory.
9. **Per-vertical correctness** — mask non-applicable schema/items (e.g. `menuSchema` cafe-only), per-vertical pricing + the two-layer trust model.

**Honesty rules (never violate — these are how we stay defensible):**
- Never claim "AA compliant" off a Lighthouse score (engines cover only ~30–40% of criteria); say "WCAG 2.2 AA best-practices at handoff".
- Never hard-fail an image-optimized static site on **lab LCP alone**, and never report a lab INP pass/fail as field truth. Describe CWV as *indicative lab data*, never "Google's verdict".
- Never report a **blank CWV section** (no CrUX field data) as a failure — it's the expected default for a single-location shop.
- Sell **local-organic / "near me"** gains (not 3-pack jumps) and **conversion** lifts (not ranking guarantees).

## Audit toolchain (the exact tools we run)
Every grade traces to these — all orchestrated by `packages/audit` (`src/cli.ts` → `collect.ts`):

| Layer | Tool | What it gives us |
|---|---|---|
| Performance + Core Web Vitals | **Google PageSpeed Insights API** (`googleapis.com/pagespeedonline/v5/runPagespeed`, runs **Lighthouse** server-side) — `probes/psi.ts` | mobile/desktop performance score, LCP/CLS (**lab**), failed-audit list. Needs `PSI_API_KEY` (free, 25k/day). |
| SEO | **`@seomator/seo-audit` CLI** (local npm package) — `probes/seomator.ts` | SEO score + grade + category breakdown |
| On-page feature inventory | **direct HTML fetch** (`probes/fetchPage.ts`, browser UA, https→http fallback) + `inventory.ts` | presence of click-to-call, hours, address/map, LocalBusiness JSON-LD, contact form, OG tags, favicon, HTTPS, reviews, booking |
| Platform / stack | `stack.ts` (HTML fingerprints) | `platform` (WordPress/Shopify/Wix/Squarespace/Webflow/GoDaddy/Weebly/Duda/Joomla/Drupal), `builder` (WP page-builder: Elementor/Divi/WPBakery/Beaver/Gutenberg), the **embedded tools** they actually run — `booking[]`, `payments[]`, `embeds[]` (chat/forms) — `socials` (`real` owned profiles + discarded `placeholders`, via `footprint.ts`), plus a `legacy` flag. The strongest prospecting signal *and* the map of what migrates. See **Platform & embedded-tool intelligence** and **Footprint discovery** below. |
| Visual review | **Playwright** (Chromium) — `screenshot.mjs` | full-page mobile + desktop screenshots for the look the collector can't see |
| Report | `report.ts` → `audit-<host>.html` | branded, **receipt-styled** (Studio0rbit palette) 1-page report you can send as-is |

**Trust:** PageSpeed Insights / Lighthouse is Google's own, industry-standard tool — legitimate and well-known. **But lab ≠ field:** quote the **PageSpeed score + architecture**, never a lab LCP as a felt "Xs load time." Small sites usually have **no CrUX real-user data at all** (the report footnotes CWV as "indicative lab measurements, not Google's official field verdict"). Reconciliation in `docs/research/audit-foundation/claims.json` + `docs/research/2026-06-15-engagement-scoping-rubric.md`.

> **What the scores are (and aren't).** Two SEO signals: **Lighthouse "SEO"** (Google; a ~14-point *technical hygiene* checklist — authoritative but basic) and **`@seomator/seo-audit`** (third-party npm; a broader on-page *heuristic* — treat as secondary, not gospel; it can misjudge valid schema). We do **not** use Search Console, rank tracking, backlinks, or GBP — so we measure the *site*, not its *rankings/traffic*. Sell speed + conversion + "near me" findability, never a ranking jump. A clean SEO score that was *already* high (common) is **not** an improvement to claim — say so.

## Platform & embedded-tool intelligence (deeply account for what they run)

**Why this matters:** the platform and its embedded tools tell us *what migrates*, *what the client depends on day-to-day*, and *the most honest pitch*. The collector now reports `stack.platform`, `stack.builder`, `stack.booking[]`, `stack.payments[]`, and `stack.embeds[]` — **read all of them every audit** and fold them into both the scoping note and the pitch.

**The two-layer rule still holds: detection is INFORMATIONAL, not a grade.** A clean Wix or Squarespace site can be genuinely good — never penalize the grade for the platform alone. The *only* place platform touches the automated verdict is the `legacy` flag (WordPress + a heavy page-builder OR many stylesheets → `deadPlatform` → can bump the tier toward rebuild). Everything else is reasoning *you* do from the table below.

**Hard rule — never silently drop a working tool.** If `booking[]` or `payments[]` is non-empty, the prospect *relies* on that tool (a salon's Booksy, a clinic's JaneApp, a shop's Square checkout). In the scoping note you MUST say, per tool, whether we **preserve it** (re-embed the same widget — almost always the answer; it keeps their data, staff logins, and payouts) or **deliberately replace it** (only with a reason). Re-embedding third-party booking/payment widgets into our static Astro build is a standard, included step — not an add-on. Migrating *off* a tool (e.g. Wix Bookings, which can't be re-embedded elsewhere) to a new provider IS scoped work — flag it.

| Platform | SEO/perf reality | What migrates cleanly | Likely booking / payment | Lock-in & gotchas | Our honest pitch |
|---|---|---|---|---|---|
| **WordPress + page-builder** (Elementor/Divi/WPBakery) | Heavy DOM/CSS, slow LCP, plugin bloat — our strongest perf case | Copy, images (`/wp-content/uploads`), services/prices, reviews | WooCommerce, Stripe/Square; bookings via plugin (Amelia/Bookly) or embedded Calendly/Acuity | Builder shortcodes are non-portable (rebuild layout, not paste); plugins ≠ portable | "Same content, a fraction of the weight" — speed + the page-builder bloat story |
| **WordPress (Gutenberg/light)** | Often fine; judge on measured perf, not platform | Same as above; cleaner export | WooCommerce / Stripe; embedded scheduler | Lighter than page-builder; don't overclaim bloat | Speed + conversion gaps only if measured |
| **Wix** | Real SEO/perf ceiling (slow, limited control); legit talking point | Copy + images (manual pull — no clean export); reviews | **Wix Bookings / Wix Payments** = platform-locked, cannot re-embed | Total lock-in; leaving Wix means re-creating booking/checkout on a new provider — **scope it** | "You don't own or control it; here's the speed + ownership upgrade" — but be honest if it looks fine |
| **Squarespace** | Decent design, middling mobile perf | Copy, images, blog | **Squarespace Scheduling (Acuity)** — Acuity *can* re-embed elsewhere; commerce is locked | Scheduling portable; store/checkout is not | Speed + ownership + cost; gentler than the Wix pitch |
| **Shopify** | Commerce-grade; usually NOT a rebuild target | Product data via export | Shopify checkout (don't touch a working store) | Replatforming commerce is a big, risky scope — usually decline | Offer a marketing/landing layer, not a store rebuild |
| **GoDaddy / Weebly / Duda** | Cheap-builder ceiling; often weak SEO + dated | Copy + images (manual) | Builder-native booking/payment, often platform-locked | Low ownership, hard to extend | Strong rebuild + ownership case |
| **Webflow** | Usually fast + modern | Copy, images, structure | Embedded Calendly/Stripe typically | Often already good — judge on measured quality | Be honest; may be care/decline |

**Embedded-tool quick reference** (what a detected value implies):
- **Booking** — `calendly`/`acuity`/`setmore`/`janeapp` = portable, re-embed as-is. `booksy`/`fresha`/`vagaro`/`mindbody` = vertical SaaS the client lives in (salon/spa/wellness) — **always preserve**, never propose replacing. `square-appointments` = tied to their Square account/payouts — preserve. `wix bookings` (Wix only) = locked, replacing it is scoped work.
- **Payments** — `stripe`/`square`/`paypal` = re-embed against their existing account (their money — never reroute). `shopify-checkout`/`woocommerce` = a real store; usually out of scope to replatform.
- **Embeds** — `tawk`/`intercom`/`messenger` (chat) and `jotform`/`typeform`/`hubspot`/`mailchimp` (forms/email) = re-embed if they want them; note them so we don't ship a site that quietly loses their lead capture.

**If `platform` is `unknown`** (custom/hand-coded or unrecognized): don't guess. Say "custom/undetected" and lean harder on the *measured* findings (perf, inventory, visual). Absence of a detected booking/payment tool ≠ they have none — check the screenshots and their booking link before claiming it.

## Footprint discovery — real socials, reviews, booking (MANDATORY, never skip)

**Why this is its own step:** the collector scrapes the prospect's *current* site, but the assets that matter most for the rebuild — real reviews, an active social profile, the booking tool they live in — often live in the business's **wider web presence**, not on the sad old site we're replacing. They're invisible to an HTML scan, so they get missed unless we go look *on purpose*. This step is data collection, not judgment — **run it every audit** and record the result; it flows straight into the intake's *Existing footprint* block and is diffed at Gate 2. Decide what to ship per `docs/onboarding/component-taxonomy.md`.

1. **Socials — read `stack.socials`, don't eyeball the icons.** The collector returns `stack.socials.real` (one owned profile per platform) and `stack.socials.placeholders` (links discarded). **The placeholder trap is the whole reason this exists:** builder themes (Wix/Squarespace/GoDaddy) ship footer icons wired to the BUILDER's own accounts — `twitter.com/wix`, `@wix`, `linkedin.com/company/wix-com`, `youtube.com/user/Wix`. A naive "do they have socials?" reads those as real *and* buries the one or two genuine profiles. (This is exactly how Eye Candy Optical's audit said "no socials" when they had an owned Facebook + Instagram.) Take `stack.socials.real` as the carry-over set; ignore `placeholders`.
2. **Confirm each real social is ACTIVE.** A dead profile is worse than none (Tier-1 rule). Open it / web-search the handle — posted within ~6 months? If stale or unverifiable, note it and don't carry it over.
3. **Reviews — capture the real rating + count.** `inventory.reviews` is keyword-only; it does NOT tell you their Google rating. Web-search the business (or their Google Business Profile) for the **star rating + review count** across all locations. This is the headline social-proof asset to feature (≥~5 reviews → ship per the taxonomy). Never fabricate; quote what's verifiable and link the source.
4. **Booking — what tool do they already use?** From `stack.booking[]` and their on-page "Book"/"Order" button href, identify the existing tool (Fresha/Square/Booksy/Jane/OpenTable…). The rebuild **mirrors** it (Tier 2) — never introduce a new one. An empty/placeholder booking page (Eye Candy's dead Wix `/book-online`) means there's nothing to mirror → CTA is click-to-call; say so explicitly.
5. **Record the footprint** in the intake's *Existing footprint* block: Google rating+count + GBP, real+active socials, booking tool, payment/email tools, photos to reuse. Whatever you find here is what Gate 2 checks the built site against.

## Before→after: proving the rebuild (`src/diff.ts`)
After a rebuild, run the **diff tool** instead of eyeballing two JSON files:
```bash
cd packages/audit
# fresh (default) — RE-RUNS both URLs so you never compare stale artifacts:
PSI_API_KEY=$PSI_API_KEY node --import tsx src/diff.ts <oldUrl> <newUrl> [vertical]
# or diff already-saved audits (warns if their rubric versions differ):
node --import tsx src/diff.ts --saved <oldHost> <newHost>
```
Fresh diffs **median 3 PageSpeed runs** (lab scores swing run-to-run — a single run is a fluke; quote the median). The collector itself defaults to 1 run; set `PSI_SAMPLES=3` to median any audit (worth it for a site near a grade boundary). It writes `audit-diff-<old>-vs-<new>.md` with: grade + per-category deltas, the measured metric table (perf/LCP/a11y/SEO/seomator with ▲▼), and conversion features split into **Gained / Dropped / Unchanged** — drops are flagged 🟡 *intentional* (e.g. removed fabricated reviews, vertical-irrelevant) vs 🔴 *likely regression*. Use its table to populate the handoff scorecard (`stats`/`notes` in the FACTS file).

**Rubric honesty (v1.1.0, `rubric.ts`).** Two fixes so the grade reflects real quality: (1) a **lab CWV "fail" no longer hard-caps** a site that's actually fast (perf grade A/B) — it only caps when the site is *also* slow (perf C/D/F + CWV fail); (2) **conversion ignores vertical-irrelevant features** (e.g. Menu schema off a non-cafe). Audits now stamp `rubricVersion` so the diff tool can warn on version skew.

## Reuse the prospect's existing content & images (automation)
A live prospect site **is a content source** — pull their real assets instead of shipping placeholders (the single biggest lift from "fast restructure" to "obviously their brand"):
- **Images:** extract `<img>`/`wp-content` URLs from the homepage + key product/category pages (`curl -sL <url> | grep -oE 'https://host/wp-content/uploads/[^"]+\.(jpg|png|webp)'`), download the full-res ones, then **re-encode to right-sized WebP with `sharp`** (hero ~80–150KB, cards ~25–70KB) so the speed win survives. **Verify each picture and reject stock/placeholder images** (don't trust the filename).
- **Copy:** lift real product names, descriptions, prices, taglines, contact, and socials via `WebFetch` on their pages.
- **Proven on Bitcoin Manor (2026-06-17):** the hero, the Stacksworth Matrix product shot, and every collection card use the client's own photos pulled from their WordPress media. Worth codifying as a reusable content-importer.

## Rules

- **Honesty:** if `grade.overall` is `A` *and* the site looks good, say so and recommend care/decline — do **not** manufacture problems.
- **CWV caveat:** describe Core Web Vitals as *indicative lab data*, never "Google's official verdict".
- **Confidence:** if `confidence: "partial"`, frame the grade as a *preliminary read* and note a full audit (with a PSI key) sharpens it.
- **Stay within facts:** every data claim traces to an `AuditData` field; every visual claim traces to something visible in the screenshots. If you didn't measure or see it, don't assert it.
