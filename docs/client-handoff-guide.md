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
| **Hosting** (Cloudflare Pages / Netlify) | Where your site lives on the internet | Almost never |
| **Domain registrar** | Your web address (e.g. yourshop.ca) | Once a year (renewal) |

> At handoff we transfer each of these into your name/email so you're the owner, not us.

---

## 2. Editing your content in Storyblok — the complete guide

Storyblok is your **content editor** — the dashboard where you change everything on your site: words, numbers, photos, hours, prices, reviews, FAQs. No code, ever. This section covers everything you can do.

> ✅ **Status (all demos connected):** fully connected and verified end-to-end. The barber (Ironside) plus the café (Maple & Steam), spa (Stillwater), electrician (Voltline), and fitness (Forge) demos all read *every* section — hero text, stats, "Why us"/feature cards, services/menu/treatments, hours, testimonials, FAQs, contact, and section headings — from Storyblok, with a local fallback so a site never breaks if the CMS is briefly unavailable. Each shop is its own **story** in one shared Storyblok space; the client edits only their own story. (Verified 2026-06-15.)

### 2.1 — Logging in & opening your site
1. Go to **app.storyblok.com** and log in with your account.
2. Click your **Space** (your shop) on the dashboard.
3. In the left sidebar, click **Content**.
4. Click your site's story (e.g. **Ironside Barber Co.**) to open the editor.

### 2.2 — What you'll see (the editor layout)
The screen has two parts:
- **Left = a preview area.** It may show your site, a "set up preview" message, or look empty. **Until your site is deployed, this preview may not display — that's normal.** Ignore it and use the panel on the right.
- **Right = the fields panel.** This is where you make every change. Everything below happens here.

### 2.3 — Editing plain text & numbers
Most fields are simple boxes: **Name, Tagline, Phone, Address, Map URL, Service area, Booking URL, Reviews blurb, Rating,** and the **section headings** ("Why us" label/heading, Testimonials heading, FAQ heading, CTA heading). Sites with a custom banner (spa, electrician, gym styles) also expose the **hero kicker** (the small line above the headline), **hero subcopy** (the sentence under it), and the **hero button label** — all editable text boxes.
- Click the box and type. That's it.
- **Rating** takes a number like `4.9`.
- **Map URL / Booking URL** take a web link (paste the full `https://…`).

### 2.4 — Editing repeating sections ("blocks")
Sections that repeat — **Hours, Services, Stats, Why-us cards, Testimonials, FAQs** — are made of **blocks** (one block = one row/card). For any of them:
- **Edit:** click a block to expand it, then edit its fields (e.g. a Service's *name* and *price*; an FAQ's *question* and *answer*).
- **Add:** click the **＋ Add** button at the bottom of that section to add a new block.
- **Remove:** click the **⋯** (or trash) icon on a block and choose remove.
- **Reorder:** **drag** a block by its handle to move it up or down — the order on your site matches the order here.

### 2.5 — The icon picker (Why-us cards)
Each "Why us" card has an **Icon** field that's a **dropdown** — click it and choose from the available icons (scissors, star, clock, calendar, coffee, map-pin, shield, and more). Pick the one that fits the card; it appears automatically on your site. (Type a letter to filter the list.)

### 2.6 — Adding & changing images ⭐
Image fields (like your **Hero image**) have an **upload box**. Two ways to add an image:

**A. Upload from your computer (most common)**
1. Click the image field (or the **Add asset / +** button inside it).
2. The **Asset browser** opens. Either **drag a file** from your desktop onto it, or click **Upload** and pick a file.
3. Select the uploaded image — it's now set. Click **Publish** when done.

**B. Reuse an image you already uploaded**
- The same Asset browser shows your **media library** — click any image you've uploaded before to reuse it (no need to upload twice).

**The Assets manager (bulk):** the **Assets** item in the left sidebar is your whole media library. Upload many photos at once there, organize them in folders, rename, or crop — then pick them from any image field later.

**About image *links*:** image fields take **uploads**, not web URLs — so if you found a photo online, **download it first, then upload it.** ⚠️ Only use photos you own or have a licence to use (your own shop photos are perfect). Big files are fine — Storyblok optimizes them for the web automatically.

**Tip:** landscape photos around **1600px wide** look best for the hero. Use a real photo of *your* space — it's the single biggest upgrade to a shop site.

### 2.7 — Save vs Publish (important!)
- **Save** = stores your work as a *draft* (not live yet).
- **Publish** (green button, top-right) = makes it **live**. **Your website only shows the *published* version.**
- 👉 Always click **Publish** when you want a change to appear on your site. If you only Save, visitors won't see it.

### 2.8 — Undo & version history (you can't permanently break anything)
- Made a mistake? Storyblok keeps a **History** of every version.
- Open the story's **History / Versions** (top toolbar or the **⋯** menu), pick an earlier version, and **restore** it.
- So edit freely — you can always roll back.

### 2.9 — When does my change go live?
- After you **Publish**, your site rebuilds to pull the new content.
- **Today:** tell us you published and we rebuild (about a minute).
- **Once your hosting is connected for auto-deploy:** hitting **Publish** rebuilds and updates your live site **automatically in ~1 minute — with no one's help.** (That's the end state for every client site.)

### 2.10 — What you can change vs what needs a designer
- ✅ **You control all content:** text, headings, prices, hours, photos, stats, cards, testimonials, FAQs, phone, address, booking link.
- 🔒 **Leave to a designer (us):** the page **layout, section order, colours/fonts, and adding brand-new page types or sections.** Those live in the site's design, not the content editor. Want one changed? It's a quick paid task — just ask.

> **Coming later:** *visual* editing — clicking directly on your live page preview inside Storyblok to edit in place. It needs the site deployed plus a small add-on; we'll switch it on when your site goes live.

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
- [ ] I can log into Storyblok and open my site's story.
- [ ] I can change a piece of text (e.g. the tagline) and **Publish**.
- [ ] I can **upload a photo from my desktop** into the Hero image field.
- [ ] I can edit a **price** in Services and a day in **Hours**.
- [ ] I can edit a **"Why us" card** (text + pick an icon from the dropdown).
- [ ] I can **add and remove** a block (e.g. an FAQ) and **drag** to reorder.
- [ ] I understand **Save vs Publish** (only Publish goes live).
- [ ] I know I can **restore an earlier version** from History if I make a mistake.
- [ ] My "Book now" button opens *my* booking page.
- [ ] My phone number is click-to-call on mobile; my address opens the right map.
- [ ] I know where my domain and hosting logins are.
