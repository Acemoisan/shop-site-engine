# Component taxonomy — what every shop site ships, and how we decide

> **Why this exists.** Component coverage used to depend on the builder *remembering* to look — so real reviews and an active Facebook were shipped with neither on a real client (Eye Candy Optical, 2026-06-18). The fix isn't a longer "always ship" list; it's a clear rule per component **plus** a mandatory discovery step that feeds it. The key distinction: most components are not "always ship" — they're **"always CHECK FOR, ship if the asset is real."** Silence can no longer omit.
>
> This is the single source of truth for the rule per component. The `site-audit` skill captures the footprint, the intake records it, the build applies these rules, and Gate 2 diffs found-vs-shipped against this table.

## The tiers

**Tier 0 — DEFAULT, no exceptions.** Every site, every vertical. Omitting one is a bug.
`hero · services/menu · opening hours · click-to-call (tel:) · contact form · Google map link · LocalBusiness JSON-LD · SEO baseline (canonical + absolute OG/Twitter + sitemap + robots) · PIPA privacy notice (footer link + /privacy page + form line)`

**Tier 1 — DEFAULT-IF-EXISTS.** The asset is *checked for every time* (discovery is mandatory) and shipped whenever it's real. **Omission requires a recorded reason in the intake** ("0 reviews", "no active socials") — silence is not a valid omission.

| Component | Decision rule | Source signal |
|---|---|---|
| **Reviews / social proof** | Ship the real rating + count + 2–4 attributed quotes if the business has reviews (~5+). Never fabricate, never empty stars, never self-`aggregateRating`. Omit only if genuinely none — and record that. | Google rating+count (footprint sweep); `inventory.reviews` is keyword-only and not sufficient. |
| **Social links** | Link only **owned + active** profiles (posted within ~6 months) — the ones the business endorses on its own site. A dead/placeholder profile is worse than none. Add to footer + JSON-LD `sameAs`. | `stack.socials.real` (placeholders auto-discarded); confirm active in the sweep. |
| **SMS / WhatsApp** | If the business texts customers, ship an `sms:`/`wa.me` deep-link beside click-to-call. ~zero cost; the only gate is "do they use it." | Footprint sweep / intake. |

**Tier 2 — CONDITIONAL (vertical- or tool-driven).** Include based on the vertical or what the client already runs. **Mirror their existing tool — never introduce or host one.**

| Component | Decision rule | Source signal |
|---|---|---|
| **Online booking** | Mirror the client's existing tool (Fresha/Square/Booksy/Jane/Calendly…) as the primary CTA — re-embed/link it (a standard, included step). If they have none, the CTA is click-to-call. A *new* booking system is a paid add-on where we configure THEIR account; we never host/maintain one. | `stack.booking[]` + their "Book" button href. |
| **Photo gallery** | Default for visual verticals (salon/optical/café/retail) **if real photos exist**; omit for professional services. | Reused client photography (see `site-audit` content-reuse). |
| **Map embed** | Default = static map + directions link (Tier 0). Full interactive embed only for walk-in verticals on request (CWV + privacy cost). | Vertical + request. |
| **Online ordering / reservations** | Food-service only; link the client's existing tool (Square/Toast/Skip/DoorDash/OpenTable). Static menu page is the website artifact. | `stack.booking[]`/`payments[]` + intake. |

**Tier 3 — OPTIONAL / paid add-on / default OFF.** Never built into the flat scope; link the client's own hosted tool if they have one and ask.

| Component | Decision rule |
|---|---|
| **Payments / deposits** | Never custody payments. Link their own hosted processor (Square/Stripe link, booking-tool deposit) as a paid add-on. |
| **Newsletter** | Only if the client already runs an email tool AND asks. Default OFF (CASL liability otherwise). |
| **Live chat** | Default OFF. Click-to-call + form + SMS cover it without the CWV/staffing cost. If wanted, prefer a WhatsApp/SMS deep-link over a heavy JS widget. |
| **Gift cards / loyalty** | Link the client's existing product (Square/Toast/Vagaro) as an add-on; never build. |
| **E-commerce store** | Essential only for retail boutiques; optional for café/salon; bloat elsewhere. Replatforming a working store is usually out of scope. |

## The one rule that makes this consistent
**Discovery is mandatory; inclusion is data-driven.** Tier 1 is *present-by-default, omit-by-exception* — the build expects reviews/active socials, and leaving one out requires a recorded reason. That's the difference between a "default component" and "default to CHECK FOR, then include if present" — and it's what stops the next component slipping the way reviews and socials did.

Related: `site-audit` (footprint sweep), `client-intake.md` (Existing footprint block), `operator-validation-checklist.md` (Gate 2 coverage diff), `privacy-notice-template.md`.
