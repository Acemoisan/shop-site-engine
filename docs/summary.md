# Studio0rbit — Where We're At

*Last updated: 2026-06-15*

Live landing page → https://studio0rbit-audit.netlify.app

## The short version

We're building a website service for Calgary local shops: one-time fee, no maintenance contracts, the client owns everything and edits their own content. In one sprint we went from nothing to a **live service with a working sales funnel and a real catalogue of designs behind it.** What's left is mostly go-to-market — scraping a prospect list and sending the first outreach.

## The product

- **A live landing page** — https://studio0rbit-audit.netlify.app — that explains the service, shows pricing, takes free-audit requests, and embeds a browsable gallery of our design work. It's the storefront and a proof-of-quality demo in one.
- **60+ designs across 20 industries** — barber, café, spa, dental, law, real estate, fitness, hotel, jewelry, automotive, and more, each in multiple visual styles. A prospect can see something close to their own business before we ever talk price.
- **Every site ships the things a shop actually needs to win customers:** mobile-first and fast, click-to-call, hours, map, reviews, a "Book now" button wired to the client's own booking tool (Square, OpenTable, etc.), and Google-friendly local SEO markup so they show up in search and Maps.

## How the client runs their own site (the key selling point)

The promise is "build it, hand it over, never touch it again" — and the part that makes that real is **Storyblok**, a free, no-code content editor we set up in the client's name. It's a simple dashboard: the client logs in, sees plain boxes for their text, hours, prices, phone, and address, plus drag-to-reorder cards for services, reviews, and FAQs. Changing a photo is a drag-and-drop upload. There's full version history, so they can't permanently break anything — they can always roll back. **No code, ever.** Day-to-day content is entirely theirs; only a redesign or new page type needs a designer.

When they hit **Publish**, the live site updates automatically in about a minute — no developer in the loop. Their setup is just three logins they own: the content editor (Storyblok), the hosting account (which they basically never open), and their domain (~$15–20/year, renewed once a year). At handoff we transfer all of it into their name and watch them make one edit themselves, so we know it works before we walk away. No GitHub, no monthly bill, no dependence on us.

## How a client site goes from build to hands-off

Four phases, each codified as a repeatable workflow so it's the same every time:

1. **Build** — scaffold the site (brand tokens + the client's content + composed sections), then build and screenshot-verify on mobile and desktop. The content also lives in a local file as a safety net, so the site can never break.
2. **Wire the content editor** — create a **free Storyblok space** for that client (free forever — one space, one seat, exactly one client), set up their content model, populate it with their real content, and connect the site to pull from it. *(Note: two separate keys — a public read token lives in hosting; the admin setup key is used once and never stored.)*
3. **Go live with auto-update** — push the site to its own repo (ours), connect it to the client's free hosting account, and wire **Storyblok Publish → webhook → rebuild → live in ~1 minute**, nobody in the loop.
4. **Hand off** — transfer ownership of the three accounts (Storyblok, hosting, domain) into the client's email and walk them through editing. No GitHub for them. Nothing recurring to us.

**What the client owns at the end:** their content editor, their hosting, their domain (~$15/yr). **What they pay us after launch:** nothing.

**Two honest caveats:** (1) we decide up front whose email each account is under, so the walk-away is clean from day one. (2) The full Publish→rebuild→live loop is built but **not yet battle-tested on a real client** — the first launch is where we confirm it end-to-end and mark it verified.

## The flow: scout → audit → communicate → close

1. **Scout** — find Calgary shops with no website or a weak one *(scrape still to run)*.
2. **Audit** — our **AI site-audit tool** turns any URL into a branded 1-page audit with before/after previews. Already run on real Calgary prospects. This is our outreach hook: lead with a useful free audit, not a cold pitch.
3. **Communicate** — the landing page does the explaining and takes the free-audit request; the design gallery does the convincing.
4. **Close** — one simple price (**$1,500 flat one-time + an à-la-carte add-on menu**, no tiers) plus a ready proposal & terms kit.

## The repo

Everything lives in one repo — **github.com/Acemoisan/shop-site-engine** — which we're hoping to move over to Studio0rbit.

## What's left

- Run the Calgary prospect scrape and qualify the list.
- Send the first outreach batch.
- Keep elevating the design — quality is our differentiator.
- Minor: custom domain for the landing page; first real client launch.

**Bottom line:** the catalogue, the storefront, and the hands-off client model are built and live. We're ready to start prospecting this week.
