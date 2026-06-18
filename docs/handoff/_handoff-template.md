# Handoff — <Client / Business Name>

> Template for `docs/handoff/<slug>-handoff.md`. Fill every `____`/`<slug>`. This is the document the operator validates at **Gate 2** and forwards to the client. Studio0rbit charges one-time, no retainer — **the client owns every account.**

**Live site:** <https://____>
**Slug:** `<slug>`  ·  **Delivered:** YYYY-MM-DD  ·  **Branch:** `feat/<slug>`

## 0. Payment — ownership transfers only after payment in full
Per `docs/gtm/payment-and-terms.md`: the build is **delivered first** (site live on **our** hosting so the client can see it), the full fee is **invoiced at delivery**, and **§1 ownership transfer happens only once payment clears.** Until then the site stays under our accounts.

| | |
|---|---|
| Amount invoiced | **$1,500** (+ add-ons: ____) |
| Method used | ____ (e-Transfer default / card link / cheque) |
| Invoice ref / date | ____ |
| **Payment received & cleared?** | ☐ — **do not transfer accounts (§1) until this is checked** |

## 1. Accounts & ownership
The client owns everything **once payment has cleared (§0).** Transfer by **password reset or invite to the owner email** — **never share plaintext passwords.**

| Service | Account / login | Owner | How the client takes ownership |
|---|---|---|---|
| Domain registrar | ____ | client owner email | ____ (transfer / already theirs) |
| Hosting (Cloudflare Pages / Netlify) | ____ | client owner email | Invite owner email as admin, then we remove ourselves |
| Storyblok (CMS) | ____ | client owner email | Invite owner email to the space; they reset password and take the seat |
| Form service (Web3Forms / other) | ____ | client owner email | ____ |
| Analytics (optional) | ____ | client owner email | ____ |
| Platform-specific (Steam / Square / etc.) | ____ | client owner email | ____ |

## 2. Live URLs & edit links
- **Live site:** <https://____>
- **Storyblok edit (where you change content):** <https://app.storyblok.com/#/me/spaces/____>
- **Host dashboard (deploys):** <https://____>
- **Form submissions inbox:** ____

## 3. How to edit & publish in Storyblok (plain language)
1. Log in at app.storyblok.com with your owner email.
2. Open your space → the story for your site.
3. Click any text or image block, edit it, then click **Publish** (top right).
4. The site rebuilds automatically within a couple of minutes — refresh to see changes.
5. If something looks wrong, your previous version is saved — use **History** to revert.

## 4. Swapping placeholders
Anything shipped as a placeholder is editable in Storyblok (no code):
- **Logo / wordmark:** ____ (field: ____)
- **Hero / key art:** ____ (field: ____)
- **Trailer / video:** ____ (field: ____)
- **Gallery images:** ____ (field: ____)
- **Domain:** currently `<slug>.____` — see §5 to point your custom domain.
- **Platform links (Steam / Discord / socials):** ____ (fields: ____)

## 5. Domain cutover — pointing your existing web address at the new site
*(Skip if this is a brand-new domain with no prior site.)*

**Your web address stays exactly the same.** A domain (e.g. `yourshop.ca`) is separate from the site behind it — like a phone number that we re-route to a new line. We don't change your address; we just aim it at the new site. **You don't touch anything technical — we do the cutover.**

**No downtime, no risk to email:**
- Your old site stays live until the moment we flip the switch — visitors never see a gap.
- We verify the new site on a temporary link (above) and you approve it **before** we cut over.
- Your email keeps working untouched.
- **Only after** the new site is confirmed live on your domain do you cancel your old Wix/Squarespace/WordPress subscription — and stop paying that monthly fee for good.

**Operator cutover checklist** — *full step-by-step (per host + per registrar) lives in `deploy-shop-site` skill → "Domain cutover"; keep this checklist short:*
- [ ] Where is the domain registered? ____  · Where is email hosted? ____ *(captured at intake)*
- [ ] Client approved the site on the temporary host link (`*.netlify.app` / `*.pages.dev`)
- [ ] Custom domain added in the host (Netlify / Cloudflare Pages)
- [ ] DNS updated to the records **the host shows you** (a `www` CNAME + the host's root record, or the host's nameservers)
- [ ] **MX (email) records left untouched** — confirmed mail still flows
- [ ] HTTPS certificate auto-issued by the host (padlock shows on the live domain)
- [ ] Client told it's safe to cancel the old host/site subscription

## 6. Operator sign-off (Gate 2)
- [ ] **Payment received & cleared (§0)** — accounts/ownership (§1) transferred ONLY after this
- [ ] Ran `docs/onboarding/operator-validation-checklist.md` → Delivery section
- [ ] **PIPA privacy notice present** — footer "Privacy" link + page/section + form purpose line, **with the cross-border (US: Web3Forms + Cloudflare Pages — name the actual host) disclosure** and a named privacy contact (template: `docs/onboarding/privacy-notice-template.md`). The one legal must.
- Validated by: ____  ·  Date: ____
- Notes / known follow-ups: ____
