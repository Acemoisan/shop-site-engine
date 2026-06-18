# Handoff — Eye Candy Optical

**Live site (staging):** <https://eye-candy-optical-yyc.netlify.app>
**Slug:** `eye-candy-optical`  ·  **Delivered:** 2026-06-17  ·  **Branch:** `feat/eye-candy-optical`
**Build:** fast static Astro on the Studio0rbit shared engine · **CMS:** none (client request) · **Host:** Netlify · **Form:** Web3Forms

> Receipt-style version to forward to the client: `docs/handoff/eye-candy-optical-handoff.html`. Data twin (for edits): `docs/handoff/eye-candy-optical.handoff.json`.

## The win (honest, with proof)
Measured with Google PageSpeed Insights (Lighthouse) — re-runnable by anyone at pagespeed.web.dev.

| Metric (tool) | Before (Wix) | After (static) |
|---|---|---|
| Mobile PageSpeed — Google | **64** | **90** |
| Desktop PageSpeed — Google | 96 | 99 |
| Largest paint (lab LCP) | ~10.1s | ~2.9s |
| Accessibility — Lighthouse | 89 (B) | 90 (A) |
| Lighthouse SEO | 100 | 100 *(already strong — kept clean)* |
| @seomator on-page audit | 93 / A | 95 / A |
| Published hours (both studios) | ✗ | ✓ |
| Working contact form | ✗ | ✓ (verified — emails on submit) |
| LocalBusiness/Optician schema | partial | ✓ per location |
| Footer map | blank box | real dual-location section |
| Platform | Wix (JS-heavy) | static files on CDN |

**Why it's actually better (not just a number):**
- **Speed by rebuild, not plugin** — static files on a CDN vs Wix's per-visit JS bundle. That's the 64→90 and the ~10s→~3s largest paint.
- **Design that matches $600 frames** — "The Lens" theme (porcelain + AR-coating emerald + cognac, Fraunces/Hanken Grotesk/DM Mono, lens-circle + Snellen signature) vs the generic Wix template.
- **Conversion gaps closed** — hours, contact form, dual-location NAP, structured data.
- **Honesty:** SEO score was *already* 100 — we did **not** improve a ranking; we kept clean SEO while fixing speed/conversion/design. We quote the PageSpeed score + architecture, never a "seconds faster" or "rank #1" claim (no real-user CrUX data; a clean technical score ≠ a ranking).
- Reused the client's **own product photography** (hero portrait + 5 frame shots → WebP).

## 1. Accounts & ownership
Client owns everything. Transfer by **invite / password reset to the owner email — never plaintext passwords.**

| Service | Account | How the client takes ownership |
|---|---|---|
| Hosting — Netlify | site `eye-candy-optical-yyc` (free) | Invite owner email as Admin, then we step off |
| Contact form — Web3Forms | free; emails submissions instantly | Client generates their own key (info@eyecandyeyewear.com) → we paste it in |
| Domain — `eyecandyeyewear.com` | already theirs (currently on Wix) | Stays theirs; we point it at the new site at cutover |
| Site code | standalone repo we maintain | No GitHub needed on their side; one-time build, no retainer |

## 2. Live URLs & links
- **Live (staging):** <https://eye-candy-optical-yyc.netlify.app>
- **Host dashboard:** Netlify → site `eye-candy-optical-yyc`
- **Form submissions:** currently the operator's Web3Forms inbox → **swap to client key** so they land at info@eyecandyeyewear.com.

## 3. Changing content (CMS-less)
All content (frames, prices, hours, studio details, FAQs) lives in **one file**: `sites/eye-candy-optical/src/content/shop.ts`. To change anything, edit that file and redeploy (`node scripts/deploy-netlify.mjs sites/eye-candy-optical/dist <siteId>` after a build). No CMS seat, nothing for the client to learn. If they later want self-serve editing, **Storyblok is a one-time add-on.**

## 4. Swappable placeholders / follow-ups
- **Web3Forms key** (`web3formsKey` in `shop.ts`): currently the operator's working key → swap to the client's own. **[BLOCKER to finalize]**
- **Google reviews:** none shown (we don't fabricate). Drop real quotes/rating in and we'll feature them.
- **Socials:** the old site only had Wix placeholder icons → omitted. Add real handles when provided.
- **Booking:** the old Wix booking page was empty; CTAs drive to call + form. A real booking embed is an add-on.

## 5. Domain cutover (Wix → new site)
**Same web address, zero downtime, email untouched.** Old Wix site stays live until the client approves the staging link; then we re-point DNS, verify, and only then they cancel Wix.

**Operator needs from the client (ASK — captured at intake as `[UNKNOWN]`):**
- [ ] **Where is `eyecandyeyewear.com` registered?** (likely via Wix → may be platform-locked / need DNS changes inside Wix, or transfer-out with a 60-day lock)
- [ ] **Where is their email hosted?** (if `info@eyecandyeyewear.com` is bundled on the domain → **preserve MX**, use the keep-current-DNS method)

**Cutover checklist** (runbook: `deploy-shop-site` → "Domain cutover"):
- [ ] Client approves staging on `*.netlify.app`
- [ ] Custom domain added in Netlify · DNS: A root → `75.2.60.5`, CNAME `www` → `eye-candy-optical-yyc.netlify.app`
- [ ] **MX left untouched** — mail still flows · HTTPS cert issued
- [ ] Set `site:` in `astro.config.mjs` is already the production domain ✓
- [ ] Client told it's safe to cancel Wix

## 6. Operator sign-off (Gate 2)
- [ ] Ran `docs/onboarding/operator-validation-checklist.md` → Delivery section
- [ ] Submitted the contact form from a browser → confirmed it emails
- Validated by: ____  ·  Date: ____
