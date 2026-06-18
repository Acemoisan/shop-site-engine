# Client Intake — Eye Candy Optical

> Filled autonomously from the kickoff input + the just-run audit. `[BLOCKER]` gaps are batched for the operator at Gate 2 (none block the build). Delivered **CMS-less** at the client's request (no Storyblok).

## Business
- **Client / business name:** Eye Candy Optical (Oakridge studio also operates as *Oakridge Optical*)
- **Slug:** `eye-candy-optical`
- **What they do:** Independent optical boutique — designer eyewear, sunglasses, and on-site eye exams across two Calgary studios.
- **Vertical (engine):** retail (optical) — JSON-LD uses `Optician` per location.
- **Existing site:** https://www.eyecandyeyewear.com — **Wix**
- **Region:** Calgary, Alberta. Two locations:
  - **17th Ave · Beltline** — 1301 17 Avenue SW, Calgary AB T2T 0C4 · 403-245-1525
  - **Oakridge · Oakbay Plaza** — 2515 90 Avenue SW, Suite 139, Calgary AB T2V 0L8 · 403-281-6099

## Audit seed (just-run)
- **Grade → action:** **C (high confidence)** → rubric says *tune-up*, but the client wants a new site and the **mobile performance is the real story**: PageSpeed **mobile 64 / desktop 96**, lab LCP ~10.1s on mobile, CWV `pass:false` (indicative lab data, no CrUX field data). Wix + heavy JS. SEO already strong (A).
- **Key gaps closed by the rebuild:** no published hours, no contact form, no product/Menu structured data, a broken/blank footer map, sparse templated Wix layout.
- **Report:** `packages/audit/audit-www.eyecandyeyewear.com.html` + `.json`
- **Honesty note:** quote the PageSpeed score + static architecture — never a lab LCP as a felt "Xs load time" (no field data).

## Scope decision
- Delivering a **$1,500 flat-fee rebrand/rebuild** — a fast static Astro site on our shared engine, themed for a premium optical boutique, reusing the client's own product photography.
- **CMS-less** (client request): content lives in `src/content/shop.ts`; edits are a code change + redeploy by the operator, **not** a Storyblok seat. (If the client later wants self-serve editing, Storyblok is a paid add-on.)
- **Not** in scope: e-commerce / online store, a real booking-system embed (current site's booking is empty). Bookings are driven to **click-to-call + contact form**; a booking embed is a future add-on.

## Contact & assets
- **Public email:** info@eyecandyeyewear.com (Oakridge also uses info@oakridgeoptical.ca)
- **Phone / click-to-call:** 403-245-1525 (Beltline) · 403-281-6099 (Oakridge) — both render as `tel:` links
- **Address / map:** both, linked to Google Maps search
- **Hours:** Beltline Tue–Fri 10–6, Sat 11–5 · Oakridge Tue–Fri 10–6, Sat 10–2 (both closed Sun–Mon)
- **Socials:** current site shows only Wix placeholder social icons — **omitted** (no real handles found). Add later if the client provides them.
- **Booking target:** none live (Wix booking page is empty) → CTAs go to call + form.
- **Logo / imagery:** no clean logo asset — wordmark set in type (Fraunces). Hero portrait + 5 product shots reused from the client's own Wix media, re-encoded to WebP.

## [BLOCKER] fields — batched for the operator at Gate 2
*(None blocked the build; documented defaults below.)*
- **Owner email (all accounts under this):** `[UNKNOWN]` — staging site stood up under the operator's Netlify (acemoisan). Transfer to the client's owner email is a manual handoff step.
- **Form-destination inbox:** defaulted to the operator's working Web3Forms key so the form is **live now**; **swap to the client's own key** (generated with info@eyecandyeyewear.com) at handoff so enquiries reach them directly.
- **Privacy-note decision:** ships with a short Alberta PIPA + cross-border (US Web3Forms/Netlify) line by default.

### Domain & email — for a clean cutover
- **Do they own a domain?** Yes — `eyecandyeyewear.com` (currently pointed at Wix).
- **Where is the domain registered?** `[UNKNOWN — ASK]` — likely registered through **Wix** (⚠️ may be platform-locked; may need DNS changes inside Wix's panel or a transfer-out).
- **Where is their email hosted?** `[UNKNOWN — ASK]` — `info@eyecandyeyewear.com` exists; ⚠️ if email is bundled on the domain, **preserve MX** and use the keep-current-DNS cutover (Method B).
- **Replacing an existing live site?** **Yes** (Wix). Plan zero-downtime cutover: approve on `*.netlify.app` → re-point DNS → verify → client cancels Wix.

## Decision log (agency defaults — documented, not approved)
- **Design direction:** "The Lens" — light editorial gallery. Cool **porcelain** canvas (deliberately not the AI-default warm cream), slate ink, single brand colour = **anti-reflective-coating emerald**, restrained **cognac/acetate** accent for prices & the sale strip. Type: **Fraunces** display (optical-size axis — on-subject), **Hanken Grotesk** body, **DM Mono** for eyebrows/prices/NAP. Signature = the **lens-circle** (images ringed like a coated lens) + a quiet **Snellen eye-chart** rule.
- **Content/copy:** drawn entirely from their real site + audit. No invented prices or policies — the one promo shown ("Oakley Meta from $611, reg. $679") is their own homepage pricing. FAQs kept general/true (no direct-billing claim made).
- **Dual-location** treated as the centrepiece (replaces the broken Wix map) with per-location hours, maps, and click-to-call.
- **Package/price:** $1,500 flat rebuild. Potential add-ons to quote later: Storyblok self-editing, a real booking embed, e-commerce, extra socials/photography.
- **Imagery:** reused the client's own hero portrait + 5 product shots → WebP. Rejected the Oakley campaign image (baked-in text + manufacturer logos) and three awkward-angle product shots.
