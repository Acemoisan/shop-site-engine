# Pricing, Tooling & Compliance Research — Studio0rbit Shop-Site Service

**Date:** 2026-06-15
**Scope:** Four open items for the Calgary local-shop website service (productized, one-time build fee, mid-market ~$3k–$8k CAD): (1) Calgary/Alberta build-price anchors, (2) lead-scraping tool pricing, (3) PageSpeed Insights API key, (4) Alberta PIPA compliance.
**Currency:** CAD unless noted. All figures one-time build cost unless flagged recurring.
**Disclaimer:** Section 4 is product/design guidance, not legal advice.

---

## TL;DR — key numbers

- **Build pricing:** Calgary "real small-business site" consensus is **$3,000–$6,000**. Templates/DIY sit below ($0 + $25–60/mo, or $500–$2,995 budget freelancers); Calgary agencies sit above (GrowME's *average* is ~$15,000). Our **$3k–$8k one-time is the value end of true custom design** — above every template shop on quality, ~2x cheaper than the local agency norm. ([CodeWeb](https://codeweb.ca/calgary-web-design-prices/), [Hexagon](https://hexagonmedia.ca/pricing.html), [GrowME](https://growmemarketing.ca/website-design-calgary/), [Elevate](https://elevatewebdesign.ca/blog/small-business-website-cost-canada))
- **Lead scraping:** **Outscraper** is cheapest reliable — **500 free records/month**, then **$3 / 1,000** ($0.003/record), native "no website" filter. **Targetron** is pricier ($15/1k at small volume) but has the only true **"≤ rating"** low-rating filter. ([Outscraper](https://outscraper.com/pricing/), [Targetron](https://targetron.com/pricing/))
- **PageSpeed Insights API:** Free, no paid tier. Keyless = tiny anonymous IP pool → **HTTP 429**. With a free key: **25,000 queries/day, ~400/100s (~4 req/s)**. Fix = add a key. ([Google get-started](https://developers.google.com/speed/docs/insights/v5/get-started))
- **Alberta PIPA:** Applies to any Alberta shop collecting form/booking data. Need a **privacy policy**, a **named privacy officer**, **purpose notice at collection**, appropriate **consent**, and (commonly missed) **named disclosure of US/offshore service providers**. PIPEDA layers on for the cross-border transfer leg. ([OIPC](https://oipc.ab.ca/legislation/pipa/), [OIPC 10 steps](https://oipc.ab.ca/resource/pipa-implementation/))

---

## 1. Calgary / Alberta build-price anchors

### Calgary brochure / small-business sites (5–10 pages)

The dominant Calgary consensus is **~$3,000–$6,000**, with budget/template work below and custom work above.

| Source (year) | Quoted range | Notes |
|---|---|---|
| [CodeWeb](https://codeweb.ca/calgary-web-design-prices/) (2026) | Basic $1,000–2,000 · Avg $2,000–3,000 · Premium $3,000–4,000 · Enterprise $4,000–20,000 | Avg tier = custom theme + technical SEO |
| [Clio Websites](https://cliowebsites.com/calgary-web-design-prices/) (2025) | 5-page site $2,000–5,000 (~$3,000 avg); "$3,000 and up" | Budget independents from $1,500 |
| [Minerva Marketing](https://www.minervamktg.com/post/how-much-does-a-website-cost-in-calgary) (2025) | $3,000–5,000 (5–10 pages) | Custom design, branding, forms, basic SEO |
| [Calgary App Developer](https://calgaryappdeveloper.ca/blog/calgary-web-design-prices/) (2025) | Small biz $3,000–6,000; basic 1–5 pp $1,500–3,000 | E-comm $5,000–20,000+ |
| [topcalgarywebdesign.ca](https://www.topcalgarywebdesign.ca/web-design-prices.php) | Templates $500–650; 10-pp templated $750–850 | Budget floor, not typical |

**Hourly rates (Calgary):** freelancers $40–100/hr; boutique agencies $100–125/hr; full-service $150–200+/hr. ([Clio](https://cliowebsites.com/calgary-web-design-prices/), [CodeWeb](https://codeweb.ca/calgary-web-design-prices/))

### Calgary custom-design packages (most concrete published cards)

**[Hexagon Media](https://hexagonmedia.ca/pricing.html):**
- Essential **$2,500+** — 5 pages, mobile-first, basic on-page SEO, GA, contact form, SSL, 2 revisions.
- Professional **$4,950+** — up to 10 pages, advanced UI/UX, WordPress CMS, keyword research + local SEO, GBP, blog, maps, 30-day support.
- Premium **$9,000+** — unlimited pages, custom apps / e-commerce, technical SEO + content strategy, CRM/email integrations, dedicated PM, 60-day support.

**[GrowME Marketing](https://growmemarketing.ca/website-design-calgary/)** (high/agency end): landing pages from $5,000, custom site from $15,000, e-commerce from $25,000; **average small-business site $15,000**; 30+ page sites $30,000–50,000. Frames Calgary as "$5,000 to $50,000."

### National Canadian context (tier ladder)

[Elevate Web Design](https://elevatewebdesign.ca/blog/small-business-website-cost-canada) (2026) maps the whole ladder:

| Tier | Build (one-time) | Recurring | Pages | Timeline |
|---|---|---|---|---|
| DIY builder (Wix/Squarespace) | $0 setup | $25–60/mo | — | 1–4 weekends |
| Freelancer / boutique | $599–2,995+ | $69–199/mo | 3–5 | 1–4 wks |
| **Mid-market studio / small agency** | **$5,000–15,000** | $200–600/mo | 5–10 | 6–12 wks |
| Full-service agency | $20,000–80,000+ | $1,000+/mo | — | 3–6 mo |

Corroborated by [Canada Web Pro](https://canadawebpro.ca/small-business-website-cost-in-canada-2026/) (2026): Basic $1,500 · Standard business $3,500–5,000 · Advanced/custom $6,000–10,000+ · e-commerce $15,000+; recurring hosting/SSL $20–60/mo, optional maintenance $50–150/mo.

### Where our $3k–$8k one-time sits

- **Below us — DIY builders:** $0 build + **$15–60/mo** ($300–1,200/yr all-in). No design service. ([Shopify cost guide](https://www.shopify.com/ca/blog/how-much-does-a-website-cost), [Squarespace pricing](https://www.websitebuilderexpert.com/website-builders/squarespace-pricing/))
- **Below us — budget freelancers / template shops:** **$500–2,995**, template-based, 3–5 pages. ([Elevate](https://elevatewebdesign.ca/blog/small-business-website-cost-canada), [topcalgary](https://www.topcalgarywebdesign.ca/web-design-prices.php))
- **Our band ($3k–$8k):** straddles the top of "Standard business" ($3,500–5,000) and the bottom of "mid-market studio" ($5,000–15,000); squarely the Calgary "real small-business site" consensus. Competes directly with Hexagon Essential→Professional ($2,500–4,950); **undercuts GrowME's $15k average by ~half.**
- **Above us — full-service agencies:** **$15,000–80,000+** with $1,000+/mo retainers, 3–6 mo timelines.

**Positioning insight:** $3k–$8k is a genuine market *gap*. Below it = templates/DIY; the next real step up jumps to ~$15k agency work. The lower end ($3k–$5k) reads as aggressive value pricing for true custom design; $5k–$8k lands comfortably mid-market. Our **no-retainer / client-owns-everything model** also removes the **$200–600/mo recurring cost** the entire mid-market+agency tier assumes — a real differentiator, not just a price point. ([Elevate](https://elevatewebdesign.ca/blog/small-business-website-cost-canada))

### What's typically included per tier

| Tier (CAD) | Pages | Design | SEO | Copy | CMS | Maintenance |
|---|---|---|---|---|---|---|
| DIY $0+$25–60/mo | DIY | Templates | DIY | DIY | Built-in | DIY |
| Freelancer $599–2,995 | 3–5 | Template, responsive, SSL, contact form | Basic on-page | Light/excluded | Sometimes | $69–199/mo opt. |
| Standard $3,500–5,000 | 5–10 | Custom theme | SEO-ready + technical | Sometimes | WordPress | $50–150/mo opt. |
| Mid-market $5,000–15,000 | 5–10 | **Custom design system, real photography** | Local SEO, schema, GBP | Copy collaboration | Owner-editable | 1–3 mo incl., then $200–600/mo |
| Full-service $20k–80k+ | many | Bespoke + competitor analysis, PM | Full audits + content strategy | Full | Custom | $1,000+/mo retainer |

Common mid-market integrations: Jane App, Boulevard, Vagaro, Stripe, Mailchimp/Klaviyo, GA4. ([Elevate](https://elevatewebdesign.ca/blog/small-business-website-cost-canada))

**Freshness:** CodeWeb, Canada Web Pro, Elevate, Hexagon (live page) are 2026/current. Clio, Minerva, Calgary App Developer are 2025 (~1 yr old). topcalgary figures are search-snippet aggregation — treat as budget floor. Oxone's 2026 guide returned HTTP 403 and could not be verified.

---

## 2. Lead-scraping tool pricing

**Bottom line:** For Calgary shops filtered by **no-website / low-rating**, the practical contenders are **Outscraper** (cheapest + best free tier + native no-website filter) and **Targetron** (best low-rating filter). Apify and PhantomBuster are more general/expensive for this job.

| Tool | Effective cost | Free tier | "No website" filter | Low-rating filter |
|---|---|---|---|---|
| **Outscraper** | **$3/1,000** (501–100k) | **500 records/mo** | Yes (native) | Field filter (manual) |
| **Targetron** | $15/1k (1–5k tier) | 50 records (one-time) | Yes | **Yes — true "≤ rating"** |
| **Apify GMaps (Compass)** | $4/1,000 ($2.10 on $49/mo plan) | ~$5/mo platform credit | Post-scrape filter | Post-scrape only |
| **PhantomBuster** | $69+/mo subscription | 14-day trial | No native GMaps toggle | No |

### Outscraper — recommended primary

Pure pay-as-you-go, no monthly fee, prepaid credits never expire. ([pricing](https://outscraper.com/pricing/))
- **Free:** first **500 places/month**, resets every 30 days.
- **$3 per 1,000** records for 501–100,000; **$1 per 1,000** above 100,000.
- Reviews scraper and Emails & Contacts scraper are **separate meters** (each with own 500 free, then $3/1k) — contact/email enrichment adds cost on top of the base scrape. ([pricing](https://outscraper.com/pricing/), [igleads review](https://igleads.io/resources/outscraper-review/))
- **No-website filter is native:** "site" field + "is blank" operator, or the **"Businesses Without Websites Only"** advanced toggle. ([no-website scrape](https://outscraper.com/google-maps-scrape-businesses-without-websites/), [filters](https://outscraper.com/google-maps-data-scraper-filters/))
- **Rating** is a filterable field (manual field filter, not a one-click low-rating preset). ([filters](https://outscraper.com/google-maps-data-scraper-filters/))

### Targetron — add if you need clean low-rating filtering

No subscription; pay per data used, tiers reset every 30 days. ([pricing](https://targetron.com/pricing/))
- **$15/1k** (1–5k) · $10/1k (5k–50k, adds API) · $5/1k (50k–500k) · $1/1k (500k–5M).
- **Free:** first **50 businesses**, one-time; plus 3-day full refund. ([free tier](https://targetron.com/targetron-pricing-updated-free-tier-try-today/))
- **Standout: true "≤ rating" filter** ("3.0-"), solving Google Maps' "at least X stars" limitation. ([bad ratings](https://targetron.com/finding-companies-with-bad-ratings/))
- Filters include name, status, email, phone, website, price, ratings, review count, postal code, map-area/radius. ([advanced filters](https://targetron.com/how-to-use-targetron-advanced-filters/))
- **Caveat:** Targetron is a **stored pre-built DB** (no published refresh cadence), not a live Maps scrape — freshness matters for "newly opened / no website yet" prospects. Use the 50-record free tier to spot-check Calgary coverage first. ([getting started](https://targetron.com/getting-started-local-businesses-directory/))

### Alternatives

- **Apify Google Maps Scraper (Compass)** — pay-per-event since Mar 2025: **$0.004/place ($4/1k)**, +$0.002/place for contact enrichment; ~$2.10/1k with Gold discount but requires the **$49/mo** plan; ~$5/mo free platform credit. No clean native no-website/low-rating pre-filter — scrape then filter the `website`/`rating` fields. Cheaper third-party actors exist (Scraperlink $0.50/1k, Solidcode $2.50/1k) with variable reliability. ([pay-per-event](https://help.apify.com/en/articles/10774732-google-maps-scraper-is-going-to-pay-per-event-pricing), [leadscrape](https://www.leadscrape.com/apify-google-maps-scraper-vs-lead-scrape.html))
- **PhantomBuster** — subscription, not per-record: Starter $69/mo, Pro $159/mo. No native GMaps no-website/low-rating filter; built for LinkedIn/social automation. **Weakest fit** for a one-off Calgary lead pull. ([pricing](https://igleads.io/resources/phantombuster-pricing/), [plans](https://support.phantombuster.com/hc/en-us/articles/4494623647250-What-Each-PhantomBuster-Plan-Includes-Features-Limits-and-Pricing))

### Calgary gotchas

- **Coverage:** No vendor publishes Canada-specific stats. Outscraper/Apify scrape **live Google Maps**, so Calgary coverage ≈ complete. Targetron is a stored DB — verify with the free tier.
- **Freshness:** Live scrapers (Outscraper/Apify) are freshest — important since "no website yet" shops are the target. Targetron's "constantly updated" claim has no published cadence; stale data could mis-flag a shop that recently added a site.
- **Cheapest reliable path:** **Outscraper** (500 free/mo + $3/1k + native no-website filter) covers most of the job. Add small **Targetron** spend only when you specifically want the clean **≤rating** pre-filter.

**Freshness:** Outscraper/Targetron/Apify base prices are from live vendor pages (current). Apify's "$2.10/Gold discount" and third-party actor prices are blog-sourced — verify on the actor page. PhantomBuster Team plan was EUR/annual via aggregator — confirm on its own pricing page.

---

## 3. Google PageSpeed Insights (PSI) API key

### Is it free / cost

**Yes, completely free — no paid tier, no billing.** Google does not charge for the PSI API, and there is **no program to pay for increased quota** (so the free quota is a hard ceiling — shard across projects/keys or throttle if you exceed it). ([DebugBear](https://www.debugbear.com/blog/pagespeed-insights-api), [Google Group — staff](https://groups.google.com/g/pagespeed-insights-discuss/c/dB7hWmGAGsw))

### Rate limits: without vs with a key

- **Without a key (our current 429):** Google doesn't publish a keyless number; keyless requests share a tiny anonymous IP-based pool, which trips **HTTP 429 "Too Many Requests"** almost immediately for automated/batch use. The 429 includes a `Retry-After` header. Keyless is only fine for occasional manual checks. ([get-started](https://developers.google.com/speed/docs/insights/v5/get-started), [DebugBear](https://www.debugbear.com/blog/pagespeed-insights-api))
- **With a free key (default quota):** **25,000 queries/day** AND **400 queries/100 seconds (~4 req/s)**. The daily 25k cap is consistent across all sources; the short-window number can vary — **trust the live value in your project's Cloud Console → APIs & Services → Quotas**. ([Jasmine guide](https://www.jasminedirectory.com/blog/pagespeed-insights-api-integration-guide/))

> Stale-figure caution: blogs cite conflicting short-window numbers (240/min, 100/100s, "1,500/min bursty" from a 2016 thread). Treat the **25,000/day** as stable and read the live Console quota for the per-window limit.

### Steps to create the key (Google Cloud Console)

1. Open **Credentials**: https://console.cloud.google.com/apis/credentials (sign in).
2. **Create or select a project** (e.g., `studio0rbit-audit`).
3. **Enable the PageSpeed Insights API**: https://console.cloud.google.com/apis/library/pagespeedonline.googleapis.com → **Enable**. (Required — unenabled API returns 403 even with a valid key.)
4. **Create the key:** APIs & Services → Credentials → **+ Create Credentials → API key**.
5. **Store it as a secret / env var** (do not commit).
6. **Use it** by appending `key=YOUR_API_KEY`:
   ```
   curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://web.dev/&key=YOUR_API_KEY"
   ```

No billing account or credit card required. ([get-started](https://developers.google.com/speed/docs/insights/v5/get-started))

### Restricting the key (recommended)

In **Credentials → click the key**:
- **API restrictions (always):** choose **Restrict key** → select **PageSpeed Insights API**. A leaked key can then only call PSI.
- **Application restrictions (match how you call it):**
  - **IP addresses** — best for our **server-side audit collector**: restrict to the runner's static egress IP(s).
  - **HTTP referrers** — only for browser-side JS (spoofable; absent on server calls) — not appropriate here.
  - If running from dynamic/serverless IPs you can't pin, keep application restriction "None" but still apply the **API restriction** and keep the key secret.

**Recommended for `packages/audit`:** API restriction = PageSpeed Insights API + IP restriction (runner IPs), key from env var. ([Console credentials](https://console.cloud.google.com/apis/credentials))

---

## 4. Alberta PIPA compliance for small-business sites

*(Product/design guidance, not legal advice. Re-verify statute citations before any client-facing legal statement.)*

Alberta's **Personal Information Protection Act (PIPA, SA 2003)** is the private-sector law in force. A Calgary shop collecting names/phones/emails via contact form or booking widget is squarely covered. The OIPC enforces it and can issue **binding orders**. ([OIPC PIPA](https://oipc.ab.ca/legislation/pipa/), [OIPC overview](https://oipc.ab.ca/overview-privacy-laws/))

### Core obligations

- **Consent + reasonable purpose** — must have consent to collect/use/disclose, and the purpose must be what "a reasonable person would consider appropriate." ([OIPC overview](https://oipc.ab.ca/overview-privacy-laws/))
- **Purpose notice at collection** (PIPA s.13) — before collecting, notify the purpose and who can answer questions about it. ([Alberta.ca overview](https://www.alberta.ca/personal-information-protection-act-overview))
- **Designate a privacy officer** (s.5) — someone responsible for compliance, identifiable to the public. ([OIPC 10 steps](https://oipc.ab.ca/resource/pipa-implementation/))
- **Written policies available on request** describing how info is handled and how access requests are processed. ([Alberta.ca responsibilities](https://www.alberta.ca/organization-responsibilities-for-protecting-personal-information))
- **Access & correction rights** with a response process. ([OIPC overview](https://oipc.ab.ca/overview-privacy-laws/), [OIPC 10 steps](https://oipc.ab.ca/resource/pipa-implementation/))
- **Safeguards** against loss / unauthorized access. ([OIPC overview](https://oipc.ab.ca/overview-privacy-laws/))
- **Mandatory breach notification** to OIPC "without unreasonable delay" where there is a **real risk of significant harm (RROSH)**. Penalties run up to ~$100,000 for organizations (secondary source — verify s.59). ([OIPC breach](https://oipc.ab.ca/breach-notification/), [Blakes](https://www.blakes.com/doing-business-in-canada-guide/section-ix-privacy-law/))

### What a compliant privacy notice should contain

- **What** PI is collected (name, phone, email, booking details).
- **Why** (purposes) and **how** it's used.
- **To whom** it's disclosed and why.
- **The privacy officer contact** (name/role + email/phone).
- **How to access/correct** information.
- **Offshore service providers — critical and often missed:** PIPA requires naming the **countries outside Canada** where collection/use/disclosure may occur and the purposes. This covers Google reCAPTCHA, US email/CRM (Mailchimp, HubSpot), US booking tools (Calendly, Square), Cloudflare/US hosting. ([OIPC 10 steps](https://oipc.ab.ca/resource/pipa-implementation/), [Captain Compliance](https://captaincompliance.com/education/alberta-pipa/), [Blakes](https://www.blakes.com/doing-business-in-canada-guide/section-ix-privacy-law/))

### Consent

PIPA recognizes three forms ([OIPC/Service Alberta guide PDF](https://www.oipc.ab.ca/wp-content/uploads/2022/02/PIPA-Guide-2008.pdf)):
- **Express** — willing agreement knowing what/why; use for sensitive info.
- **Implied** — inferred (e.g., a booking form impliedly consents to contact about that booking).
- **Opt-out / deemed** — permissible for non-sensitive secondary uses (e.g., marketing) with clear notice + chance to decline.

Practical: primary-purpose (respond to enquiry / manage booking) relies on express/implied consent; any **marketing/newsletter** needs its own clear consent — best practice an **unchecked opt-in checkbox**. (Note: Captain Compliance frames PIPA as requiring broad "explicit" consent; the official OIPC guide is more nuanced — trust the OIPC guide.)

### When PIPEDA applies instead/also

Alberta PIPA is "substantially similar" to PIPEDA, so PIPEDA does not apply to commercial activity **wholly within Alberta**. PIPEDA applies for: **federally regulated businesses** (banks, telecom, transport/airlines), and **interprovincial/international transfers** of PI. ([OPC provincial laws](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/r_o_p/prov-pipeda/), [OPC cross-border Q&A](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/r_o_p/02_05_d_26/))

**Practical:** A purely local Alberta shop is governed by **PIPA**. But because nearly every site sends form/booking data to **US service providers**, that cross-border leg can also engage **PIPEDA**. The fix is the same either way — name cross-border transfers and ensure comparable protection (which PIPA's offshore rule already requires). Treat PIPA as baseline, PIPEDA as additional on the transfer leg.

### Practical checklist (apply to every client site)

1. **Publish a privacy policy** — footer-linked and near every form; covers what/why/use/disclosure/access/correction/offshore providers.
2. **Name a privacy officer** (name or role + contact) in the policy and at point of collection.
3. **State the purpose at the form** — short notice (e.g., "We use your contact details only to respond to your enquiry / manage your booking").
4. **Appropriate consent** — implied/express for primary purpose; separate **unchecked opt-in** for marketing.
5. **Disclose US/offshore providers by name + country** (host, email, booking, reCAPTCHA/analytics).
6. **Data minimization** — only form fields you'll actually use.
7. **Safeguard** — HTTPS, bot/spam protection, limited access to submissions, secure email/CRM.
8. **Access/correction + complaint process.**
9. **Breach-response plan** — notify OIPC without unreasonable delay where RROSH exists.
10. **Processor clause** in any data-processing arrangement.

([OIPC 10 steps](https://oipc.ab.ca/resource/pipa-implementation/), [OIPC breach](https://oipc.ab.ca/breach-notification/))

### Reform status (staleness note)

PIPA is **in force unchanged** as of June 2026, but reform is active: the statutory review produced 12 recommendations (Feb 2025), and Alberta ran a modernization survey (Feb 2026). The public-sector **POPA** came into force June 11, 2025 (does **not** govern private business) and signals the likely direction of future PIPA amendments. **Re-verify before any client legal statement** — amendments could land within a year. ([Alberta.ca engagement](https://www.alberta.ca/personal-information-protection-act-engagement), [OIPC POPA](https://oipc.ab.ca/legislation/popa/))

---

## Action items for the roadmap (Phase 2/3)

| # | Finding | Decision / action | Phase |
|---|---|---|---|
| 1 | $3k–$8k = value end of true custom design; agency norm ~$15k; market gap below | Anchor **Starter / Growth / Pro** in the $3k–$8k band; lead with "custom design system, not template" + **no monthly retainer** as the wedge vs both DIY and agencies | 2 (pricing) |
| 2 | Mid-market norm assumes $200–600/mo retainer | Make **one-time fee + client owns all accounts** an explicit, marketed differentiator in proposal/terms | 2 (GTM) |
| 3 | Outscraper = cheapest reliable + native no-website filter; 500 free/mo, $3/1k | Adopt **Outscraper as default lead source**; budget ~$3/1,000 beyond free tier | 2 (prospecting) |
| 4 | Targetron has the only clean "≤ rating" filter, but stored DB / unknown freshness | Use Targetron **selectively** for low-rating pulls; validate Calgary coverage on its 50-record free tier first | 2 (prospecting) |
| 5 | Audit tool 429 = keyless PSI | **Create a free PSI API key**, store as env var, restrict to PageSpeed Insights API (+ IP for server runs); throttle to ~4 req/s, cap at 25k/day | 2 (audit tool) |
| 6 | PSI free quota is a hard ceiling (no paid tier) | If audit volume > 25k/day, **shard across projects/keys** or queue/throttle | 3 (audit scale) |
| 7 | PIPA requires privacy policy + named officer + offshore-provider disclosure on every site | Build a **reusable PIPA-compliant privacy policy template** (client fills officer + provider list) as a standard shippable component | 2/3 (engine) |
| 8 | Cross-border transfers (US tools) engage PIPEDA + PIPA offshore rule | Maintain a **standard list of US service providers** (host, reCAPTCHA, booking, email) to drop into each client's policy | 2/3 (engine) |
| 9 | PIPA reform pending | **Re-check PIPA status** before publishing any client legal copy; revisit ~early 2027 | ongoing |
