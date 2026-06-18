# Attribution, credit & privacy-disclosure review

**Date:** 2026-06-17 · **Scope:** every third-party tool/asset in the Studio0rbit stack — where we *must* give credit, and where we *must* disclose.
**Headline:** We are **not legally required to display any credit/badge anywhere.** The one genuine, mandatory obligation is a **privacy disclosure** (Alberta PIPA cross-border notice), triggered because we use US-based providers (Web3Forms + Netlify).
*Items 1–7 are licensing/contract findings verified against primary sources. Item 8 is general information, not legal advice — for a binding opinion consult an Alberta privacy lawyer or the OIPC.*

## Verdict table

| Tool / asset | Visible credit/badge required? | Notes |
|---|---|---|
| **Web3Forms** (free) | ❌ No | Terms/pricing silent. Only branding is a small credit in the notification *emails* (invisible to visitors; removable on paid). |
| **Storyblok** (free) | ❌ No | Terms silent on attribution. "Made with Storyblok" gallery is opt-in marketing, not a condition. |
| **Netlify** (free/Starter) | ❌ No | Self-serve agreement silent. ⚠️ A "powered by Netlify" link IS required — but **only** on the separate **Open Source Plan**. Never enroll commercial client sites in that plan. |
| **Google Fonts** | ❌ No | OFL/Apache trigger on *redistributing font files*, not on rendering text. No footer credit needed. |
| **Our icons** (`Icon.astro`) | ❌ No | Custom hand-drawn inline SVGs — no external library, no license obligation. |
| **Astro / Tailwind** (MIT) | ❌ No | A compiled static site redistributes no framework source, so no MIT notice on the site. |
| **Unsplash / Pexels photos** | ❌ No | Both licenses: attribution "appreciated" but not required. (Mind the non-license rules: no reselling unaltered, no implied endorsement by people shown.) |
| **CC BY images** | ✅ **Yes** | If we ever use a CC BY-licensed image, attribution is mandatory. **Avoid CC BY; prefer client-supplied, CC0, Unsplash, or Pexels.** |
| **Font Awesome Free icons** | ✅ Yes (auto-satisfied) | Icons are CC BY 4.0. If ever used, keep the embedded attribution comments in the CSS/JS/SVG (don't strip in minify). We use our own icons, so N/A today. |

## The one MUST: PIPA privacy disclosure (Item 8)

Alberta **PIPA applies** to any Alberta business collecting personal info commercially — no small-business exemption. A contact form collecting name/email/message is in scope. Because the engine uses **US-based Web3Forms + US-based Netlify**, PIPA **s.13.1 / s.13.2** make a cross-border notice **mandatory** (not just recommended as under federal PIPEDA).

**Every client site must carry a privacy notice** — a published page + footer link, plus a short purpose line near the contact form — disclosing:
1. What's collected (name, email, message; plus any logs)
2. Purpose (to receive and respond to the enquiry, only)
3. Consent (submitting the form constitutes consent)
4. **Use of US/foreign service providers — info may be stored/processed/accessed outside Canada** ← the mandatory cross-border element
5. How to access the org's policies on its use of those providers
6. A named privacy contact (name/position + contact) for questions and access/correction requests

Standard reusable text with per-client blanks: **`docs/onboarding/privacy-notice-template.md`**.

## What we changed on 2026-06-17 (current status)
- **Live sites fixed:** the landing site (`site.ts` → `pipaNote`) and Bitcoin Manor (`index.astro` contact note) now include the cross-border (US providers) sentence. Previously both only said "PIPA respected" without the mandatory cross-border element.
- **Baked into the engine** so every future client ships it: `CLAUDE.md` conversion-complete bar, `create-shop-site` skill, `docs/onboarding/client-intake.md` (privacy-contact field), and `docs/handoff/_handoff-template.md` (privacy-notice check).
- **Image discipline reaffirmed:** use client-supplied or CC0/Unsplash/Pexels imagery; never CC BY without credit. Demo/template sites that reuse a real shop's photos are internal-only and must not ship as a *different* client's live site.

## What is explicitly NOT required (don't add noise)
Web3Forms badge, Storyblok badge, Netlify badge, Google Fonts credit, Astro/Tailwind MIT notice on the compiled site, Unsplash/Pexels photo credit — all optional/appreciated at most. Adding unnecessary "powered by" lines is clutter, not compliance.

## Sources
- Web3Forms [terms](https://web3forms.com/terms) · [pricing](https://web3forms.com/pricing)
- Storyblok [terms](https://www.storyblok.com/legal/terms)
- Netlify [self-serve agreement](https://www.netlify.com/legal/self-serve-subscription-agreement/) · [OSS policy (badge, OSS-plan only)](https://www.netlify.com/legal/open-source-policy/)
- Google Fonts [FAQ](https://developers.google.com/fonts/faq) · [OFL](https://openfontlicense.org/open-font-license-official-text/)
- Icon licenses: [Lucide](https://github.com/lucide-icons/lucide/blob/main/LICENSE) · [Heroicons](https://github.com/tailwindlabs/heroicons/blob/master/LICENSE) · [Font Awesome Free](https://fontawesome.com/license/free)
- [Unsplash License](https://unsplash.com/license) · [Pexels License](https://www.pexels.com/license/) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) · [CC0](https://creativecommons.org/publicdomain/zero/1.0/)
- Alberta PIPA: [OIPC](https://oipc.ab.ca/legislation/pipa/) · [Alberta.ca overview](https://www.alberta.ca/personal-information-protection-act-overview) · [statute (CanLII)](https://www.canlii.org/en/ab/laws/stat/sa-2003-c-p-6.5/latest/sa-2003-c-p-6.5.html)
