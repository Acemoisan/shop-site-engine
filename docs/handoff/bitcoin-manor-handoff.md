# Handoff — Bitcoin Manor

> Gate 2 document. The new marketing/brand site is **live** and reviewable. Studio0rbit charges one-time, no retainer — **the client owns every account.** A few items need the client's own email/domain to finalize; each is a short, explicit step below (none block reviewing the live site).

**Live site:** <https://bitcoin-manor-yyc.netlify.app>
**Slug:** `bitcoin-manor`  ·  **Delivered:** 2026-06-17  ·  **Branch:** `feat/bitcoin-manor`
**Existing store (unchanged):** <https://bitcoinmanor.com/> (WordPress + WooCommerce). The new site **deep-links into this store** for all purchases — we did not touch their cart/checkout.

## What was delivered
A fast, distinctive **brand/landing site** that replaces a heavy legacy-WordPress + page-builder homepage. Built on static Astro using the client's own product photography (pulled from their existing site), dark "laser/forge" crypto-maker design, the Stacksworth Matrix as the hero product, a collections grid deep-linking into the store, a working contact form, real 4.8★ social proof, and **Organization + Store + Product** structured data. See the audit (`packages/audit/audit-bitcoinmanor.com.html`) and spec (`docs/superpowers/specs/2026-06-17-bitcoin-manor-design.md`).

**Measured improvement (stated honestly):** mobile **PageSpeed performance 67 → 85** (same throttled lab test). *We do not quote a "Xs → Ys" load-time multiplier:* the old site's ~40s lab LCP is Google's **throttled worst-case lab figure, not real-user data** (the site has no CrUX field data), and our audit report itself labels CWV as "indicative lab measurements, not Google's official field verdict." The real wins are the PageSpeed score, accessibility (A), structured data, a working contact form, and the client's real imagery on a fast static stack.

## 1. Accounts & ownership
The client owns everything. Transfer by **invite / password reset to the owner email** — never plaintext passwords. **Currently both Netlify and Storyblok sit under the operator account `aidan.c.moisan@gmail.com`** (used to stand the site up autonomously). Transfer steps below.

| Service | Account / login | Currently under | How the client takes ownership |
|---|---|---|---|
| Hosting (Netlify) | site `bitcoin-manor-yyc` · id `e4c17792-c1dc-43e5-8f88-33080944b3e7` | operator email | Netlify → Team → **invite client owner email** as Owner/Admin → operator leaves. Or transfer the site to the client's Netlify team. |
| CMS (Storyblok) | space **Bitcoin Manor** · id `293262123963428` | operator email | Storyblok → Settings → Collaborators → **invite client owner email**; they reset password and take the seat. Free Starter plan is enough. |
| Form (Netlify Forms) | form `contact` on the site above | operator email | Comes with the Netlify site transfer (above). |
| Domain registrar | `bitcoinmanor.com` (already the client's, on their WordPress host) | client | Already theirs — see §4 for pointing it at the new site. |
| Existing store (WooCommerce) | bitcoinmanor.com WordPress | client | Unchanged — keep as the shop backend. |

## 2. Live URLs & edit links
- **Live site:** <https://bitcoin-manor-yyc.netlify.app>
- **Storyblok edit (change all text/prices/links):** <https://app.storyblok.com/#/me/spaces/293262123963428> → story **bitcoin-manor**
- **Netlify dashboard (deploys + form submissions):** <https://app.netlify.com/projects/bitcoin-manor-yyc>
- **Form submissions:** Netlify → the site → **Forms → contact**. Verified capturing submissions end-to-end (a test was submitted and then deleted). *Connection (`.env`):* the site's Storyblok **delivery** token + story slug live in `sites/bitcoin-manor/.env` (gitignored; the delivery token is public-read and safe).

## 3. How to edit & publish in Storyblok (plain language)
1. Log in at app.storyblok.com with the owner email (after the invite in §1).
2. Open the **Bitcoin Manor** space → the **bitcoin-manor** story.
3. Edit any field — hero text, the Stacksworth blurb/price, the collection cards (name, description, **link**, icon), the LED readout values, stats, reviews blurb/rating, contact copy. Repeating sections (stats, collections, values, specs) support **＋ add / drag-reorder / trash**.
4. Click **Publish** (not just Save). **See §5** about making the change appear on the live site.
5. **History** restores any previous version.

## 4. Going live on the real domain (client's call)
The new site is on a free `*.netlify.app` subdomain so it's reviewable now. To launch it on the brand domain, you choose one of:
- **Recommended:** point `bitcoinmanor.com` (or `www`) at the new Netlify site, and move the existing WooCommerce store to a subdomain/path (e.g. `shop.bitcoinmanor.com`) that the "Shop" buttons link to. (The store deep-links are editable in Storyblok if the store URL changes.)
- Or keep the store at `bitcoinmanor.com` and launch the new site at a subdomain (e.g. `www.` or `home.bitcoinmanor.com`).
- In Netlify: site → **Domain management → Add a domain** → follow the DNS records. Netlify provisions HTTPS automatically.

## 5. Making Storyblok edits appear live (auto-rebuild — one-time setup)
The current live site is a **pre-built deploy**, so a Storyblok **Publish** won't appear until the site is redeployed. Two ways to finish the "edit → auto-live" loop (the standard Studio0rbit end-state):
1. **Quick:** after publishing in Storyblok, trigger a redeploy (Netlify → Deploys → **Trigger deploy**, or we run one `netlify deploy`).
2. **Hands-off (recommended, ~10 min):** connect the site's Git repo to Netlify with build `pnpm install && pnpm --filter bitcoin-manor build`, publish dir `sites/bitcoin-manor/dist`, env `STORYBLOK_TOKEN` = the delivery token in `.env`; create a Netlify **Build Hook**; paste it into **Storyblok → Settings → Webhooks → Story published**. Then Publish auto-rebuilds in ~1 min. (See `deploy-shop-site` skill, "Per-client launch runbook".)

## 6. Email alerts for form submissions (1 click — client picks the inbox)
Submissions are already captured in **Netlify → Forms → contact**. To also get **emailed** on each one: Netlify → the site → **Forms → Settings & notifications → Add notification → Email notification** → enter the inbox (e.g. `support@bitcoinmanor.com`). *(Left for the client to set so the destination inbox is their explicit choice — the agent intentionally did not create an external forwarding rule.)*

## 7. Placeholders & swappable content (all editable in Storyblok, no code)
Everything below is intentional and documented as swappable:
- **Product photography:** the design uses a clean CSS/typographic treatment (no external photos we lack rights to). A `hero_image` upload field exists; we can add image slots per collection on request so real product shots drop straight in.
- **LED readout values** (BLOCK 871,402 / 6 sat/vB / OCEAN / LIVE ⚡): illustrative of what a Stacksworth Matrix shows — edit in the `readout` blocks, or we can wire it to a live Bitcoin data feed as a future add-on.
- **Collection links / prices / copy:** all editable in Storyblok; the Matrix price ($169 CAD) and the deep-links are real, pulled from the live store on 2026-06-17.
- **Events section:** kept truthful and general (no fabricated dates) — add specific events in Storyblok when scheduled.
- **No fabricated testimonials:** we show the real 4.8★ rating; add named quotes from Google/Instagram in the CMS if desired.

## 8. Decision log (agency defaults — documented, not pre-approved)
See `docs/onboarding/bitcoin-manor-intake.md` for the full log. Headlines: scope = brand/landing site that deep-links to the existing WooCommerce store (no store replacement); dark laser/forge design grounded in their 3D-print/laser/LED world; Organization+Store+Product schema (not LocalBusiness — online brand, no public storefront/address); Netlify Forms (no third-party key needed and verifiable) over Web3Forms.

## 9. Operator sign-off (Gate 2)
- [ ] Run `docs/onboarding/operator-validation-checklist.md` → Delivery section against the live URL.
- [ ] Confirm the design + content read true to the brand; decide the domain plan (§4) and auto-rebuild option (§5).
- [ ] Transfer accounts to the client owner email once confirmed (§1).
- Validated by: ____  ·  Date: ____
