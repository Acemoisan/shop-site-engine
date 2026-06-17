# Client Intake — Bitcoin Manor

> Filled autonomously by the delivery agent from the client URL + a live audit (2026-06-17). No operator interview was available; gaps are marked and handled with documented, swappable defaults rather than blocking the build. See the **Decision log** at the bottom for every agency default chosen.

## Business
- **Client / business name:** Bitcoin Manor
- **Slug:** `bitcoin-manor`
- **What they do:** A Bitcoin-focused **merchandise & maker brand** — in-house designed, hand-built Bitcoin gear. Product lines: the **Stacksworth** hardware line (Matrix / Spark Bitcoin LED data displays), 3D-printed solutions, laser-crafted collectibles, "Laser Layers: Proof of Work" laser art, Special-Edition COLDbox cases (for Coinkite/Coldcard gear), Bitcoin-for-Kids, and sublimation art. They accept **Lightning** payments and appear at local Bitcoin events.
- **Vertical (engine):** `retail` (brand/catalog marketing site, not a NAP local shop).
- **Existing site:** https://bitcoinmanor.com/ — legacy WordPress + Kubio, WooCommerce store. © 2020.
- **Region:** Alberta, Canada (Stacksworth Matrix is "hand-assembled in Alberta"). Ships across Canada. *(No public street address — online brand.)*

## Audit seed (from the live audit, 2026-06-17)
- **Grade D → rebuild.** Legacy WordPress, `performance: D`, **LCP ≈ 38.8s** (catastrophic), missing click-to-call, hours, address/map, LocalBusiness JSON-LD, contact form. `seo: A`, has booking/shop link, reviews, HTTPS, OG tags. Rating **4.8★**.
- Report: `packages/audit/audit-bitcoinmanor.com.html` + `.json`.

## Scope decision (important)
We are **not** replacing their WooCommerce store. We deliver a **fast, striking brand/landing site** that fixes the performance + conversion + structured-data gaps and **deep-links into their existing store and product/category pages** for all transactions. This keeps their cart/checkout intact and fits our static, one-time-fee model.

## Contact & assets (verified from site)
- **Public email:** support@bitcoinmanor.com
- **Contact form fields (existing):** Name, Email, Message.
- **Socials:** Instagram https://www.instagram.com/bitcoinmanor/ · X https://x.com/BitcoinManor
- **Store / CTAs (deep-link targets):**
  - Store: https://bitcoinmanor.com/bitcoin-merchandise-store/
  - Stacksworth lineup: https://bitcoinmanor.com/stacksworth/ · Matrix product: https://bitcoinmanor.com/product/stacksworth-matrix-bitcoin-led-display/
  - 3D Printed: https://bitcoinmanor.com/3d-printed-solutions-and-designs/
  - Laser Collectibles: https://bitcoinmanor.com/laser-crafted-collectibles/
  - Laser Layers / Proof of Work: https://bitcoinmanor.com/bitcoin-art-laser-layers/
  - Special-Edition COLDbox: https://bitcoinmanor.com/product/special-edition-coldbox/
  - Bitcoin For Kids: https://bitcoinmanor.com/bitcoin-for-kids/
  - Sublimation Art: https://bitcoinmanor.com/sublimation-art/
  - Lightning Projects: https://bitcoinmanor.com/lightning-projects/
  - Local Events: https://bitcoinmanor.com/local-bitcoin-events/
- **Flagship product (verified):** Stacksworth **Matrix** — Bitcoin LED display, ESP32, shows block height / live price / fees (sat/vB) / mining pool / local time; red LEDs; auto Wi-Fi updates; hand-assembled in Alberta. **$169.00 CAD.** Spark = "coming soon".

## [BLOCKER] fields — status (none block the build; handled per Decision log)
- **Owner email (all accounts under this):** `[UNKNOWN]` → using operator email `aidan.c.moisan@gmail.com` to stand up Storyblok/Netlify; handoff documents transfer to the client's owner email. **Manual step in handoff.**
- **Public contact email / form inbox:** `support@bitcoinmanor.com` (verified) — form delivery wired here (see Decision log).
- **Domain ownership:** they own `bitcoinmanor.com` (live WordPress store on it). New site deploys to a **Netlify subdomain** as the review/spec build; domain cutover is the client's call — documented in handoff.
- **Privacy-note decision:** form ships with a short privacy line (Alberta PIPA) → swappable in CMS.

## Decision log (agency defaults — documented, not approved)
- **Client selection:** operator initially didn't name the client; agent had begun selecting a salon prospect, then operator supplied bitcoinmanor.com — pivoted fully. No salon work shipped.
- **Scope:** marketing/brand landing site that deep-links to the existing WooCommerce store (no store replacement). Rationale above.
- **Design direction:** dark "crypto-maker" aesthetic — near-black canvas, **Bitcoin-orange** primary, **electric-purple** accent, geometric display type (Space Grotesk) + Inter body + system mono for data readouts. Captures their street-art Bitcoin brand without the cluttered WordPress look. (Token system per `frontend-design`.)
- **Schema:** ship **Organization + Store + Product** JSON-LD (correct for an online brand) rather than `LocalBusiness` (no physical storefront/address).
- **Social proof:** show the real **4.8★** rating + a truthful community blurb. **No fabricated named testimonials** on a live client site; handoff explains adding real ones in the CMS.
- **Imagery:** brand uses a CSS-driven dark/orange hero (no external photos we lack rights to); all image slots are swappable in Storyblok so the client drops in their real product photography.
- **Form delivery:** Web3Forms (same as our landing site) → support@bitcoinmanor.com; access key is a swappable placeholder until the client confirms their own key.
