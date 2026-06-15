# Per-Vertical Content Kits (copy & content blueprints)

**Date:** 2026-06-15 · **Status:** content blueprints — the "content fill" half of *token-swap + content fill*.
**Scope:** This is **content** (sections, sample copy, what to collect from the client, which embed). It **complements** the build session's engine *component* section kits — it does not define components. Use it to fill a new shop site fast and to drive the intake content checklist.
**Grounded in:** verified per-vertical research ([product](../research/2026-06-15-product-delivery-and-tooling.md), [vertical anatomy](../research/2026-06-15-vertical-anatomy-restaurant-retail.md)).

---

## Universal baseline (every vertical)
**Sections:** hero (name + what you do + location + primary CTA) · services/offer · hours · location + map + directions · contact (click-to-call, email) · reviews/testimonials · footer with NAP.
**Conversion non-negotiables:** consistent **NAP**, **click-to-call** on mobile, hours, map, explicit **service area**, social proof.
**Technical (build handles):** `LocalBusiness` JSON-LD, mobile-first, CWV pass (LCP<2.5s/INP<200ms/CLS<0.1), Alberta PIPA privacy note if forms collect data.
**Always pair with:** a complete Google Business Profile (drives Maps rank; 4★+ gets far more clicks).

---

## 1. Barber / Salon / Spa
**Primary CTA:** Book now. **Best embed:** Square Appointments (free single-location, works in Canada) — or Fresha/Booksy.
**Sections:** hero w/ Book CTA · services + prices · **online booking** · gallery (cuts/styles/space) · team/stylists · reviews · hours/location · contact.
**Conversion drivers:** prominent booking button (sticky on mobile), price transparency, strong photos, reviews.
**Collect from client:** service + price list, staff names/bios/photos, gallery photos, booking-tool account (or set up Square), hours, social links.
**Sample copy:**
- Hero: "[Name] — [neighbourhood]'s [barbershop/salon]. Fresh cuts, easy booking." → *Book your spot*
- Service line: "Skin fade — 30 min — $XX"
- CTA: "Book online in 30 seconds — no phone tag."

## 2. Restaurant / Café
**Primary CTAs:** See menu · Reserve · Order. **Best embeds:** HTML menu + `schema.org/Menu`; reservations via OpenTable/Resy (or free Google Reserve for low volume); first-party ordering via **ChowNow** (commission-free) vs DoorDash (15–30%/order).
**Sections:** hero (vibe photo + CTA) · **menu (HTML, never PDF)** · reservations · online ordering / delivery links · gallery · about/story · hours/location/map · events/specials · reviews.
**Conversion drivers:** menu is the most-visited page — make it fast, in-page, mobile-readable; reservations + ordering are what separate a converting site from a brochure; mobile sub-2s.
**Collect from client:** full menu (items, descriptions, prices), food photos, reservation/ordering accounts, hours, story, events.
**Sample copy:**
- Hero: "[Name] — [cuisine] in [neighbourhood]. Dine in, take out, or order online." → *View menu*
- CTA: "Reserve a table" / "Order for pickup"
**Note:** mark menu up with `Menu → MenuSection → MenuItem` (machine-readable; not a guaranteed rich result).

## 3. Trades / Home Services (plumber, electrician, contractor)
**Primary CTA:** Call now / Request a quote. **Embed:** quote/contact form + click-to-call; optional booking (Calendly/Jobber/Housecall Pro).
**Sections:** hero (service + area + Call CTA) · services · **service area** · **trust signals** (licensed, insured, certifications, warranties) · reviews/testimonials · before/after gallery · about · contact/quote form.
**Conversion drivers (verified):** prominent **trust signals** (licenses/certs/insurance/testimonials) and **mobile speed** — customers search on phones during urgent need; click-to-call above the fold.
**Collect from client:** services, license #/certs/insurance details, service-area list, project photos, reviews, emergency availability.
**Sample copy:**
- Hero: "[Name] — Licensed & insured [trade] serving [Calgary + areas]. Same-day service." → *Call now* / *Get a free quote*
- Trust line: "Licensed • Insured • [X] years in Calgary • [rating]★ on Google"

## 4. Retail / Boutique
**Primary CTA:** Shop / Visit us. **Decision:** few products or foot-traffic focus → **catalog + "visit us" + Shopify Buy Button**; real online volume → full Shopify/Square Online. (Astro supports the whole spectrum.)
**Sections:** hero · product/collection showcase · **shop online vs visit in store** · in-store pickup / local delivery · brand story · hours/location/map · reviews · contact.
**Conversion drivers:** clear product photos, obvious "buy online or visit," pickup/delivery clarity, brand story, reviews.
**Collect from client:** product list + photos + prices, store account (Shopify/Square) if selling online, pickup/delivery policy, brand story, hours.
**Discovery (verified):** use **Google free local listings + free local inventory app (CA-eligible)**; mark products with `Product` + nested `Offer` (price, priceCurrency, availability, condition required for Google auto-updates).
**Sample copy:**
- Hero: "[Name] — [what you sell] in [neighbourhood]. Shop online or visit us." → *Shop now* / *Visit the store*
- CTA: "Buy online, pick up in store"

---

## How to use this (per new shop)
1. Pick the vertical kit → it's the section + content checklist.
2. Send the **collect from client** list as the intake content request.
3. Fill the engine's section kit with this content + AI-assisted copy (owner-reviewed).
4. Wire the recommended embed (client's own account).
5. Swap the design tokens for their brand → done.

> Keeps each new build a token-swap + content fill, not a rebuild (roadmap Phase 1 success criterion).
