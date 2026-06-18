# Client Intake — Astro Systems

> Filled autonomously from the kickoff input + the just-run audit. The operator handed over **only the URL** ("they'll get back to us"), so every client-supplied detail below is a documented default or marked `[PENDING — ASK]`; none blocked the build. Delivered **CMS-less** (matches the recent Eye Candy / salon pattern) — content lives in `src/content/shop.ts`; Storyblok self-editing is a future paid add-on.

## Business
- **Client / business name:** Astro Systems
- **Slug:** `astro-systems`
- **What they do:** Fully integrated home wiring / **structured cabling** for Calgary homes — multi-room audio & video distribution, home networking (voice/data), home theatre, security & monitoring, and home automation (lighting/thermostat/appliance control). Sell via pre-configured panels or custom module sets; work with new-home builders ("wired show homes").
- **Vertical (engine):** `trades` — JSON-LD uses `ElectricalContractor` / `HomeAndConstructionBusiness`, service-area model (no public storefront).
- **Existing site:** http://www.astrosystems.ca — **custom hand-coded late-1990s HTML** (splash "click logo enter" gateway + frameset-era sub-pages; HTTP-only, no mobile, quirks-mode). Author credited "Digital Welders."
- **Established:** **1974** (stated on their site).
- **Region / service area:** Calgary, Alberta & area. **No public street address** (by-appointment / builder-channel) → treated as a **service-area business**, not a storefront pin.

## Audit seed (just-run)
- **Grade → action:** **D (high confidence) → rebuild** (collector and visual review agree — unambiguous).
- **⚠️ Honesty note (critical, differs from most prospects):** the old site scores **PSI performance 100 / CWV pass** *because it's a near-empty ancient page*. **There is NO speed win to sell** — the pitch is **trust (HTTPS), credibility/design, mobile, and conversion**, never a load-time improvement. Expect the rebuild's perf grade to stay ~A; the proof is the feature/trust/design transformation, not a metric jump.
- **Top issues closed by the rebuild:** no HTTPS ("Not Secure" warning), no mobile layout, 1990s splash design, no tap-to-call, no quote form, no map/structured data/OG.
- **Footprint discovery:** **no verifiable Google rating/reviews** and **no real/active social profiles** found (the "Astro Amps" Facebook is an unrelated Calgary guitar-amp maker). → reviews + socials **omitted with reason** per component-taxonomy Tier-1; add if the client supplies them (diff at Gate 2).
- **Report + scoping:** `packages/audit/audit-www.astrosystems.ca.html` + `.json` · `packages/audit/scoping-www.astrosystems.ca.md`

## Scope decision
- Delivering a **$1,500 flat-fee rebuild** — a fast, secure static Astro site on our shared engine, themed as a premium modern home-technology integrator.
- **CMS-less** (default): edits are a code change + redeploy by the operator, not a Storyblok seat. (Storyblok self-editing = future paid add-on.)
- **CTA model:** quote/consultation business, **not** online booking — primary CTA is a **"Request a quote"** form + tap-to-call. No booking/payment/chat tool detected to preserve (nothing to mirror).
- **Likely add-ons to quote later:** **photo sourcing** (no usable images exist — current site is clip-art only; the build ships a bespoke graphic design instead of stock), **content migration + 301 redirects** (map old `.htm` pages → new sections), and optionally **GBP creation** (they appear to have no Google Business Profile).

## Contact & assets
- **Public email:** info@astrosystems.ca (real — used on site)
- **Phone / click-to-call:** **(403) 243-8800** · **Toll-free (888) 662-5727** · Fax (403) 243-8504 — phone + toll-free render as `tel:` links
- **Address / map:** none public → **service-area (Calgary & area)** treatment, no map pin
- **Hours:** none published → shown as **"By appointment — call or request a quote"** (no fabricated hours)
- **Socials:** none found → omitted (add later if provided)
- **Logo / imagery:** **their real "ASTRO SYSTEMS" oval logo (`head_alt.gif`, 650px) was pulled, cropped to the mark, made transparent, and placed in the nav + footer.** Their real product photos were also reused — `master_panel`, `wall_plate1`, `wall_spkr`, `cpanel` → WebP at native size in a "gear we install" band (small but crisp; **not** upscaled). Cartoon clip-art (CRT TV, camcorder, computer, remote) was rejected. The bespoke copper-on-navy circuit motif **supplements** their real assets (hero diagram + OG card). **Higher-resolution product/project photography** is the remaining photo-sourcing add-on (their originals are ~100px).
- **Sister business:** central-vacuum cross-link to `vacuumwholesalers.com` — preserved as an optional footer cross-promo link.

## [PENDING — ASK] fields — batched for the operator when the client responds
*(None blocked the build; documented defaults below.)*
- **Owner email (all accounts under this):** `[PENDING]` — staging stood up under the operator's host account; transfer to the client's owner email is a manual handoff step (post-payment, Gate 2).
- **Form-destination inbox:** defaulted to the operator's working **Web3Forms** key so the form is **live now**; **swap to the client's own key** (generate with info@astrosystems.ca) at handoff so quote requests reach them directly.
- **Privacy-note decision:** ships with the standard Alberta PIPA + cross-border (US Web3Forms + Cloudflare Pages) line by default.

### Domain & email — for a clean cutover (all PENDING)
- **Do they own a domain?** Yes — `astrosystems.ca` (currently serving the old HTML site over HTTP).
- **Where is the domain registered?** `[PENDING — ASK]` — `.ca` domain; confirm registrar (likely an older Canadian registrar given site age).
- **Where is their email hosted?** `[PENDING — ASK]` — `info@astrosystems.ca` exists; ⚠️ **preserve MX** on cutover so email keeps working.
- **Replacing an existing live site?** **Yes** (old HTML). Plan: approve on `*.pages.dev` → re-point DNS → verify → done. HTTPS is automatic on Cloudflare Pages (closes the biggest current gap).

## Decision log (agency defaults — documented, not approved)
- **Design direction:** "Wired" — a premium home-technology-integrator look that is the deliberate opposite of the clip-art splash. **Deep midnight-navy ink** + **clean warm-white canvas**, **confident electric-blue primary** (echoes their ASTRO wordmark), **copper accent** (literal copper wire → warmth + premium, used for eyebrows/CTAs/highlights). Type: **Sora** display (geometric, precise, contemporary), **Inter** body, **DM Mono** for data/eyebrows/NAP. Signature = a subtle **circuit-trace** motif (a tasteful nod to the old "wires radiating from the house" splash idea).
- **Content/copy:** migrated and lightly modernized from their real 5 service pages (intro/structured wiring, entertainment, networking, security, options/automation, benefits). "Established 1974" used as the central trust anchor. No fabricated numbers, prices, reviews, or hours.
- **Social proof:** no reviews exist → replaced the testimonials slot with an honest **"Calgary homes & builders since 1974"** credibility band (no fake reviews).
- **Imagery:** **their real logo + real product photos first** (logo in nav/footer; media-centre, wall-plate, ceiling-speaker, keypad in a "gear we install" band), with a bespoke circuit-motif hero/OG to supplement. No stock filler. Their product originals are only ~100px, so they're shown small-but-crisp; **higher-resolution photography is the flagged add-on.**
- **Package/price:** $1,500 flat rebuild. Add-ons noted above.
