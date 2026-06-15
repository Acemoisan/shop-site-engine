# Deep Research: Website Anatomy — Restaurants/Cafés & Retail Shops

**Date:** 2026-06-15
**Method:** Deep-research workflow — 106 agents, 5 angles, 24 sources, 101 claims, top 25 verified. **19 confirmed, 6 refuted.** Integration/schema/tooling claims rest on PRIMARY sources (schema.org, Shopify dev docs, Astro docs, Google Merchant Center, ChowNow); conversion statistics mostly on vendor blogs (treat exact percentages as illustrative).

> Completes the per-vertical picture. Salons/barbers and trades/home-services were covered in the [product/tooling report](2026-06-15-product-delivery-and-tooling.md); this adds **restaurants/cafés** and **retail**.

---

## RESTAURANTS / CAFÉS

### Essential sections + conversion elements
- **Menu — as HTML, never PDF** ✅. HTML menus load fast, stay in-experience (the menu is the most-visited page; PDFs open in a separate reader and pull visitors away), serve mobile diners checking before they visit, and are indexable. *(Use the load-speed / in-experience / indexability reasoning — a specific "58% more orders" and "PDFs hurt SEO alone justifies HTML" were **refuted**; don't cite them.)*
- **Reservations + online ordering are what separate a converting site from a brochure** ✅ — nearly half of restaurant reservations are made online; ordering must be mobile-responsive and take major payments.
- Hours, location/map/directions, click-to-call, food gallery, reviews, events/specials.
- **Mobile-first, sub-2s loads** ⚠️ — the "68% of restaurant traffic is mobile" figure is a single vendor stat (directionally right; global mobile ~64%), but mobile-first + fast is mainstream best practice. Astro static output is well-suited.

### Menu structured data ✅ (primary: schema.org)
Mark the HTML menu up with **`schema.org/Menu` → `hasMenuSection` (MenuSection) → `hasMenuItem` (MenuItem)** for a hierarchical, machine-readable menu a PDF can't carry. Note: `Menu` is **not** itself a guaranteed rich-result type — it's machine-readability, not a snippet guarantee.

### Ordering & reservations integrations (embed into Astro/Next.js via script tags)
- **First-party / commission-free ordering — best-of-breed: ChowNow** ✅ (primary). Flat **monthly subscription (~$99–$149/mo) + standard card processing (~2.95%+$0.29), no per-order commission**. Embeds via a raw `<script>` before `</head>` — drops into a code-based/headless site as easily as a no-code builder. (Ancillary: ~$199–$399 setup, optional ~$99/mo placement, ~$199 tablet; hard to justify at very low volume.)
- **Third-party marketplaces — DoorDash** ✅: **15% (Basic) / 25% (Plus) / 30% (Premier)** charged on *every* order, even from customers who already knew the restaurant. Direct ordering "avoids" these commissions (true — though direct still pays processing + self-managed delivery; marketplaces also bring demand).
- **Cost case** ⚠️ (single blog, math checks): a custom commission-free setup ~$2,000–$8,000 to build + 2.6–2.9% processing can beat **$525–$1,050/mo** in DoorDash commissions at 100 orders × $35.
- **Hybrid is common** (open question): first-party ordering (ChowNow/Toast) **plus** a DoorDash marketplace listing for reach.
- **Reservations** (open question — not embedded-verified here): OpenTable / Resy widgets (pricing in [product report](2026-06-15-product-delivery-and-tooling.md)), vs a **free Google Reserve / Google Business Profile booking link** for low-volume cafés.

### Restaurant local SEO
Google Business Profile completeness (verified in re-verification pass), `Menu` schema, "near me" optimization, reviews. (A "63% of local searches on mobile" stat was **refuted** — click-to-call is still standard good practice regardless.)

---

## RETAIL SHOPS

### Essential sections + conversion elements
- Product showcase, hours, location/map, contact, brand story, reviews.
- **The key decision: "buy online" vs "visit in store" vs both** — with in-store pickup / local delivery and (if selling online) inventory.
- *(Conversion-element specifics beyond integrations — review widgets, gallery best practices, pickup-vs-delivery UX — were under-covered; see open questions.)*

### The e-commerce decision + integrations (all fit a code-based Astro build)
- **Astro supports the full spectrum** ✅ (primary): "checkout links → hosted payment pages → full custom storefront via a payment API." So one stack serves **catalog + "visit us"**, **buy-buttons**, or **full e-commerce**. Named integrations: Lemon Squeezy, Paddle (links/hosted), Snipcart (full storefront), Stripe.
- **Best-of-breed embed: Shopify Buy Button JS (BuyButton.js)** ✅ (primary). Drops product listings, buy buttons, collections, and a cart into any non-Shopify/headless site via NPM `@shopify/buy-button-js` or CDN `sdks.shopifycdn.com/buy-button/latest/`, connecting to Shopify's secure checkout. Ideal when a local retailer wants to sell a handful of products without a full storefront. (Shopify positions it to *augment* a site, not build a bespoke headless store.)
- **Decision rule (working):** few products / mostly drives foot traffic → **catalog + "visit us" + buy-buttons**; real online sales volume / inventory / shipping → **full Shopify (or Square Online)**.
- ⚠️ Canadian specifics (CAD pricing, GST/PST setup, Square Online vs Shopify Lite vs Stripe fees for Alberta) were **not** researched — open question.

### Product structured data ✅ (primary: Google Merchant Center)
Product pages need **`schema.org/Product` + a nested `Offer`**. For Google Merchant **automatic item updates**, four values are **required**: `price`, `priceCurrency`, `availability`, `condition`. *(A claim that structured data must be server-rendered HTML and can't be JS-generated was **refuted** — Google processes JS-rendered structured data.)*

### Retail local discovery ✅
**Google free local listings + local inventory ads** showcase in-store products to nearby shoppers at no cost — and the **free local inventory app is available in Canada**, so **Calgary retailers can use it.** Plus GBP completeness and Product schema.

---

## Per-vertical checklists (build defaults)

**Restaurant/café template ships with:** HTML menu (Menu schema) · hours · map/directions · click-to-call · gallery · reviews · ChowNow ordering embed slot · reservation link (OpenTable/Resy/Google Reserve) · events/specials · LocalBusiness/Restaurant schema · mobile-first sub-2s.

**Retail template ships with:** product showcase (Product+Offer schema) · hours · map · contact · brand story · reviews · e-commerce slot (buy-buttons → Shopify) · in-store pickup/local-delivery messaging · Google free local listings setup · LocalBusiness schema · mobile-first.

---

## Refuted claims (do NOT reuse)
1. Structured data must be server-HTML and can't be JS-generated. *(False — Google processes JS-rendered.)*
2. "88% of Gen Z always check menus online" (as phrased — overstated).
3. "63% of local searches on mobile + click-to-call" framing.
4. "58% more orders" from PDF→HTML switch.
5. "PDF SEO drawback alone justifies HTML."
6. Specific Toast pricing ($69/mo + 3.50%+15¢).

## Open questions
1. Canadian pricing + CAD/GST-PST tax handling; Square Online vs Shopify Lite vs Stripe fees for Calgary/Alberta merchants.
2. How OpenTable/Resy widgets embed into Astro/Next.js (iframe vs script vs API) + 2025-2026 fees vs free Google Reserve.
3. Best first-party-ordering + delivery-reach hybrid and combined economics.
4. Retail conversion specifics (review widgets, gallery, pickup vs delivery UX).

## Sources
**Primary:** schema.org/Menu · shopify.dev (Buy Button) · docs.astro.build/ecommerce · support.google.com/merchants (local listings; product structured data) · get.chownow.com
**Secondary/blog:** qsrmagazine.com · chowly.com · siteseeingmedia.com · monirtechsolutions.com · richmenu.io · onthemap.agency · mccarygroup.com (Shopify vs WooCommerce vs Square 2026) · zigpoll.com · yotpo.com (ecommerce schema)
