# Privacy notice — standard text for every client site

> **Why this is mandatory.** Our stack uses US-based **Web3Forms** (contact form) and a US-based static host — **Cloudflare Pages** (standard, since 2026-06-18; legacy sites are on **Netlify**) — so Alberta **PIPA s.13.1/13.2** require every client site to disclose cross-border data handling. This is the **one** legal must in our stack (no credit/badge is ever required — see `docs/research/2026-06-17-attribution-and-disclosure-review.md`). Ship this on **every** client site. **Always name the host the site is actually deployed on.**

## How to ship it (every site)
1. **Footer link** — add a "Privacy" link in `SiteFooter` pointing to the privacy page/section.
2. **Privacy page or section** — render the full notice below (a simple `/privacy` page, or an expandable section).
3. **Form line** — a one-line purpose + cross-border note next to the contact form (see the short version below). Keep it editable in Storyblok (a `privacy_note` field) so the client can adjust wording.

Fill every `____` at intake. The **privacy contact** (item 6) is a `[BLOCKER]`-adjacent intake field — get a name + email from the client.

---

## Full notice (privacy page / section)

**Privacy notice — ____ (business name)**

We respect your privacy and handle personal information in line with Alberta's *Personal Information Protection Act* (PIPA).

1. **What we collect.** When you use our contact form we collect the information you submit — typically your name, email, phone (if provided), and message. Our host may also log standard technical data (e.g. IP address) to serve the site.
2. **Why.** We use it only to receive and respond to your enquiry. We do not sell it or use it for unrelated purposes without your consent.
3. **Consent.** Submitting the form means you consent to this use.
4. **Service providers outside Canada.** Our contact form is processed by **Web3Forms** and our website is hosted on **Cloudflare Pages** *(name the actual host — Netlify for legacy sites)*, both based in the **United States**. As a result, your information may be **stored, processed, or accessed outside Canada** and may be subject to the laws of that country.
5. **Access to our policies.** To learn more about how we use these service providers, contact us using the details below.
6. **Privacy contact.** Questions, or to access or correct your information: **____ (name / position)**, **____ (email)**.
7. **Retention.** We keep enquiry messages only as long as needed to respond and for reasonable follow-up, then delete them.

*Last updated: ____*

---

## Short version (next to the contact form)
> We use your details only to respond to your enquiry, per Alberta's PIPA. This form is processed by Web3Forms and the site is hosted on Cloudflare Pages (both US-based), so your information may be stored or accessed outside Canada. See our [Privacy notice](/privacy) or contact ____.

*(The two live sites currently use a condensed inline form of this — landing `site.ts` `pipaNote` and Bitcoin Manor's contact note. A full `/privacy` page + footer link is the complete implementation for new builds.)*
