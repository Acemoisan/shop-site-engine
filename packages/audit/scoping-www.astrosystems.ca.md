# Internal Scoping Note — Astro Systems (www.astrosystems.ca)

**Date:** 2026-06-18 · **Vertical:** structured home wiring / smart-home / low-voltage contractor · **Platform:** unknown (hand-coded late-1990s HTML — splash "click logo to enter" gateway + sub-pages, no doctype/quirks-mode, no mobile viewport)
**Grade:** D (high confidence) · **Tier:** rebuild (collector AND visual agree — unambiguous rebuild)
**Footprint:** No verifiable Google Business Profile rating/review count found. No real/active social profiles found (the "Astro Amps" Facebook is an unrelated Calgary guitar-amp maker; Sacramento/UK/US "Astro" hits are different companies). **Established 1974.**

## Verdict
This is one of the strongest rebuild cases in the queue, but **the headline is NOT speed.** The current site scores PSI performance **100 / CWV pass** purely because it's a near-empty ~1998-era HTML page — a static rebuild will *not* beat that, so do **not** sell a "Xs → Ys" load-time win here (honesty rule). The pitch is **trust, credibility, mobile, and conversion**:
1. **No HTTPS** — the site runs on plain HTTP, so every browser shows "Not Secure." For a contractor asking homeowners to spend thousands wiring a new build, that's a screenshot-able trust killer and the single most defensible finding.
2. **A 1990s splash-page design** ("get connected — click logo enter", animated clip-art, frameset-era sub-pages) with **no mobile layout**. A company selling *modern smart-home wiring* has a website that actively contradicts the pitch. This is the credibility mismatch to lead the prose with.
3. **No conversion path** — phone number is plain text (not tap-to-call), no quote/contact form, no structured data, no map. A ready buyer has to manually copy a number or dig for the `mailto:` link.

Conversion grade **F**, accessibility **D**. SEOmator scores 92 (footer fine print) — do **not** claim an SEO/ranking improvement; their on-page hygiene heuristic is already high and rankings aren't what we measure.

## Business facts (verified from their site + search)
- **What they do:** fully integrated home wiring / structured cabling for new homes — multi-room audio & video distribution, home networking (voice/data, up to 4 phone lines per plate), home theatre, security (cameras, motion + smoke/burglar detectors, intercom, scheduled security lighting), and home automation (lighting/thermostat/appliance control). Sell via pre-configured panels or custom module sets; mention "wired show homes" → they work through/with home builders.
- **Contact:** PH **(403) 243-8800** · Toll-free **(888) 662-5727** · Fax (403) 243-8504 · **info@astrosystems.ca**
- **Address:** none published on site or in search — likely by-appointment / builder-channel. Treat as **service-area (Calgary)**, not a storefront pin. **Confirm in intake.**
- **Sister business:** central-vacuum cross-link to `vacuumwholesalers.com` — keep a cross-promo link if they want it.

## Chosen template direction
- Production build = new `sites/astro-systems` on `packages/shared` via the **create-shop-site** skill (one engine, themed per shop). No `tmpl-*` exists for this exact vertical — mine `tmpl-*` trades/tech-leaning variants for layout/token ideas only; mostly a fresh token set.
- **Tokens / feel:** modern, techy, trustworthy — deep navy/charcoal foreground, a confident electric-blue or cyan accent (echoes their existing blue ASTRO wordmark, which is the one salvageable brand asset), clean light background, generous whitespace, real display+body type pairing. The look must say "current smart-home pro," the exact opposite of the clip-art splash.
- Hero: full-bleed modern smart-home / wired-home interior image + tagline ("Fully integrated home wiring, since 1974") + dominant **"Request a Quote"** CTA + tap-to-call. Eager `fetchpriority="high"`.
- **CTA model:** this is a high-consideration quote business, **not** online booking. Primary CTA = "Request a Quote / Book a Consultation" form; secondary = tap-to-call. Do **not** introduce a Square/Fresha-style booking tool (none exists to mirror).

## Content that ports straight over (their site is the content source)
- **Rich service copy already written** across 5 pages — port and lightly modernize into our sections:
  - *Structured wiring / intro* (page1): the "imagine a home where…" value prop + "established 1974" + "bring your home into the digital age."
  - *Entertainment* (ent): multi-room audio/video, source-to-channel programming, audio zones, in-wall/ceiling speakers, IR keypads.
  - *Networking* (net): home data/voice, up to 4 phone lines/plate, high-speed internet, the feature list (computer & peripherals, voice comms, fax/modem/telephone, cable/satellite/DVD/home theatre, home-wide stereo, multi-room audio, surround).
  - *Security* (sec): cameras (doors/garage/hallways), motion + smoke/burglar detectors, intercom, scheduled security lighting, 24h monitoring integration.
  - *Options/automation* (options): lights/thermostat/appliance control, remote access, "adds value to your home."
  - *Benefits* (benefits): scalable/affordable, safety, resale value, future-proof — good for a Features/Benefits block.
- **Establish-1974 / "company you can trust" / "wired show homes"** → About + trust band.
- Phone / toll-free / fax / email → NAP-style contact + click-to-call.

## Gap list (close on build)
- **Images:** the current site has **only 1990s clip-art GIFs — none reusable.** This is a real content gap → need modern smart-home/AV/wired-home photography. Use tasteful stock placeholders (swappable in CMS) for the demo and **quote photo sourcing as an add-on** if they want bespoke shots.
- **`fixes.targeted` to ship:** HTTPS (host-provided SSL), mobile-responsive layout, tap-to-call, quote/contact form (Web3Forms), `LocalBusiness` JSON-LD (use `ElectricalContractor` / `HomeAndConstructionBusiness` type, structured service-area; **never** self-`aggregateRating`), service structured data, OG tags, opening-hours or "by appointment" line, address/map → **service-area** treatment (no public pin — confirm).
- **General:** add doctype (kills quirks-mode), `<html lang>`, alt text, main landmark — all handled by the engine by default.
- **Reviews / socials:** none found → **omit both, reason recorded** per component-taxonomy Tier-1 "default-if-exists." If the client supplies a GBP or active social at intake, add them then (diff at Gate 2).
- **Privacy:** quote form collects PII → ship the **PIPA privacy notice + cross-border (Web3Forms + Cloudflare Pages, both US) disclosure**, footer Privacy link + purpose line by the form. Mandatory.

## Performance (NOT the headline — read the honesty note)
- PSI performance **100** mobile + desktop, lab **LCP ~0.9s**, CLS 0, CWV `pass:true` — because the page is tiny ancient HTML with almost no content. **There is no speed win to sell.** A richer rebuild (real hero image, sections) should still land an **A/B** perf grade, but quote it as "stays fast while doing far more," never as a load-time improvement. When we run `src/diff.ts` post-build, expect perf to stay ~A — the proof is the **conversion + trust + design transformation and HTTPS**, flagged in the diff as Gained features, not a metric jump.

## Package / price / effort
- **Recommended: $1,500 flat-fee rebuild** (every site = same core components; one engine, themed). Quote/contact form included.
  - **Add-ons to quote up front:** **photo sourcing** (no usable images exist — likely needed), and **content migration + 301 redirect mapping** (they have an established domain since the 90s and indexed `.htm` pages — map `astro_page1/ent/net/sec/options/benefits.htm` → new section anchors to preserve any link equity).
  - Optional: GBP creation/optimization (they appear to have *no* Google Business Profile — a genuine, separate value-add worth flagging).
- **Effort:** standard single-shop build. Copy is rich and already written (mostly migration + light modernization, not authoring); the real lift is the token/design system from scratch + sourcing imagery.
- **Domain/email cutover (flag for Deliver intake):** domain registrar unknown, email host for `@astrosystems.ca` unknown, unknown whether the 90s site/domain is locked to an old provider — these are the Deliver `[BLOCKER]` fields; surface early.

## Client-facing next step
Send `audit-www.astrosystems.ca.html`. Hook (per `docs/gtm/outreach.md`): "You've been wiring Calgary homes since 1974, but the website is stuck in the 90s — it shows a 'Not Secure' warning, doesn't work on phones, and there's no easy way to ask for a quote. Here's what a modern version looks like." Offer a quick before/after using the rebuilt template. **Do not pitch a speed improvement** — lead on trust, credibility, mobile, and conversion.
