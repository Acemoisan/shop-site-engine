# Your Website — Owner's Guide

> **Read this as the shop owner.** It explains everything you can do with your site after we hand it over: editing your content, managing your booking link, your accounts, and your domain. It's also our internal checklist for what "client-ready" means — if a step here is confusing or broken, that's a bug to fix before handoff.

## The deal (so there are no surprises)

- You paid a **one-time fee**. There is **no monthly maintenance bill from us.**
- **You own everything** — your domain, your website hosting, and your content editor. We set them up in your name and hand you the logins.
- Your **ongoing cost is tiny**: about **$15–20/year** for the domain. Hosting and the content editor run on free plans for a site your size.
- You can **edit your own content** anytime (text, photos, hours, prices, menu). You don't need us for that.
- **What needs a designer (us or anyone):** changing the layout/structure, adding new page types, or a visual redesign. Day-to-day content is all yours.

---

## 1. Your accounts (what you own and where to log in)

You will have up to **three** logins. Keep them in a password manager. You'll use the first one (the content editor) regularly; the other two are "set and forget."

| Account | What it's for | How often you touch it |
|---|---|---|
| **Storyblok** (content editor) | Edit text, photos, hours, prices, menu | Whenever you want to change something |
| **Hosting** (Netlify / Cloudflare Pages) | Where your site lives on the internet | Almost never |
| **Domain registrar** | Your web address (e.g. yourshop.ca) | Once a year (renewal) |

> At handoff we transfer each of these into your name/email so you're the owner, not us.

---

## 2. Editing your content (Storyblok)

> ✅ **Status (barber demo):** connected. The "Ironside Barber Co." site pulls its content from Storyblok. Editing the story there and rebuilding the site updates the page (verified end-to-end on 2026-06-15). The café demo is not yet connected.

Storyblok is your **content editor**. You edit your shop's fields, publish, and the change flows to your site.

**To make a change:**
1. Go to **app.storyblok.com** and log in.
2. In the left sidebar click **Content**, then open the **Ironside Barber Co.** story.
3. Edit any field:
   - **Headline / tagline / descriptions** — type in the text fields.
   - **Hours** — edit the open/close times or tick "closed" for a day (each day is a row you can add/remove).
   - **Prices / services / menu** — edit name, price, description; add or remove items.
   - **Phone / address / booking link** — update the contact fields.
   - **Photos** — upload/replace via the **Assets** manager (crop there too). *(Image fields are added during the design phase.)*
4. Click **Save**, then **Publish**.

**When does it go live?** Today the site is rebuilt to pick up changes. Once we connect your hosting to auto-rebuild (git-connected deploy — see `deployment.md`), hitting **Publish** will redeploy your site automatically in ~1 minute, no involvement from us.

> **Coming with the design phase:** in-page *visual* editing (click directly on the live site preview inside Storyblok). That needs the site deployed + a small "bridge" added — a polish step we'll do when we elevate the design.

**What you can safely edit:** all the words, numbers, photos, hours, prices, and your phone/address.
**What to leave alone:** the overall layout and section order (that's the design — ask us if you want it changed).

---

## 3. Your booking / reservation link (important)

Your site has a **"Book now" / "Book online"** button. It does **not** process bookings itself — it **links to your own booking account** on a tool built for your type of business. This keeps your costs low and means *you* control your calendar and get paid directly.

**You need your own booking account.** Here's the right tool by business type and what it costs *you* (these are your accounts, not ours):

| Your business | Recommended booking tool | Your cost | Notes |
|---|---|---|---|
| **Barber / salon / spa** | **Square Appointments** | **Free** plan for a single location | Easiest, works in Canada, calendar + reminders. Card fees only when you take payment (2.5% in-person / 2.8%+$0.30 online). |
| **Restaurant / café (reservations)** | **OpenTable** or **Resy** | OpenTable from ~$149/mo; Resy from ~$249/mo | Only if you take reservations. Many cafés skip this. |
| **Restaurant (online ordering)** | Your POS / a Square Online store | Varies | Ask us — we link to whatever you use. |
| **Trades / home services** | Jobber / Housecall Pro, or a contact form | Varies | Often a "Request a quote" form is enough; we can wire that instead. |

**How to connect it (do this once):**
1. Create your booking account (e.g. sign up for **Square Appointments** — free).
2. In that tool, find your **public booking page link** (Square calls it your "Online Booking Site" URL).
3. Send us that link, **or** paste it yourself in Storyblok in the **Booking URL** field.
4. Click your site's "Book now" button to confirm it opens your booking page.

> **Test as the owner:** after connecting, click "Book now" on your live site and make sure it lands on *your* booking page. If it goes to a generic page, the link isn't set yet.

---

## 4. Your domain (web address)

- Your site is registered to a domain like **yourshop.ca** (about $15–20/year).
- We point the domain at your hosting during setup. You generally never touch this except to **renew once a year** — the registrar will email you.
- If you ever change your shop name, ask us before buying a new domain (it affects SEO).

---

## 5. Getting found on Google (your part)

We build the SEO basics in (your business info is embedded for Google). The biggest lever is **yours**:
- Claim and complete your **Google Business Profile** (name, address, hours, photos, categories) — it's free and drives most local clicks.
- Ask happy customers for **Google reviews** — 4★+ listings get the majority of clicks.
- Make sure your name/address/phone match **exactly** between your site and Google.

---

## 6. Privacy note (Alberta)

If your site collects customer info (contact form, bookings), your privacy policy should reference **Alberta's PIPA** (Personal Information Protection Act) — not PIPEDA. We include a basic policy; tell us if you collect anything beyond name/email/phone.

---

## 7. If something breaks

- **A content change looks wrong:** in Storyblok you can revert to a previous version (History).
- **The whole site is down:** check your hosting account status page first; it's rare for static sites.
- **You want a design change or a new page:** that's a paid design task — reach out to us.

---

### Owner test checklist (walk through this as the client)
- [ ] I can log into Storyblok and change a piece of text, save, and see it live.
- [ ] I can replace a photo.
- [ ] I can update my hours and a price.
- [ ] My "Book now" button opens *my* booking page.
- [ ] My phone number is click-to-call on mobile.
- [ ] My address opens the correct map location.
- [ ] I know where my domain and hosting logins are.
