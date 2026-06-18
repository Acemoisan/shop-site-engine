# Operator Validation Checklist

> The operator's two gates in the `client-pipeline`. The agent runs fully autonomous between them — the operator's only sign-offs are here. Both gates are the operator "validating the output state" before something leaves the studio.

## Gate 1 — Audit (before sending to a prospect)
Run before forwarding an audit to a prospect as outreach.

- [ ] `packages/audit/audit-<host>.html` opens and renders cleanly (desktop + mobile width).
- [ ] Every data claim traces to the collector's `AuditData` (grade, tier, fixes) — nothing invented.
- [ ] Core Web Vitals framed as **indicative lab data**, never "Google's official verdict".
- [ ] If `confidence: partial`, the grade is framed as a preliminary read.
- [ ] Branding correct; tone is plain-spoken and non-condescending (per `docs/gtm/outreach.md`).
- [ ] Forwardable cover note reads well and matches the report.
- [ ] **No internal material leaking** — the scoping note, package/price, and effort estimate are NOT in the client-facing report.

## Gate 2 — Delivery (payment-gated handoff)
Deliver-first: the client **sees** the finished site, **pays**, and only then **gets the keys.** Work the three stages in order — do not transfer ownership before payment clears (`docs/gtm/payment-and-terms.md`).

**Stage A — validate the finished site (live on OUR hosting, before the client pays):**
- [ ] Site loads at the **live URL** (on our hosting/accounts — not yet transferred).
- [ ] **Mobile + desktop** both clear the `CLAUDE.md` design-quality bar (no AI slop, real type pairing, depth, per-vertical feel).
- [ ] Contact form submits and **delivers to the correct inbox** (send a test).
- [ ] Correct **JSON-LD for the vertical** is present in the page HTML (e.g. `LocalBusiness`).
- [ ] **Click-to-call** and any booking/order CTA work.
- [ ] Per-client **SEO baseline** present (absolute canonical, OG/Twitter with absolute `og:image`, sitemap, robots).
- [ ] **Footprint coverage diff** — compare the intake's *Existing footprint* block against the live site, per `docs/onboarding/component-taxonomy.md`. Every asset DISCOVERY found is on the site, or its omission is a recorded reason (silence ≠ omission):
  - [ ] **Reviews** present if the business has them (real rating + count + attributed quotes; no fabrication / empty stars).
  - [ ] **Active socials** linked (footer + `sameAs`); no dead or placeholder profiles carried over.
  - [ ] **Booking** mirrors their existing tool (or click-to-call if they have none) — a working booking tool was not silently dropped.
  - [ ] **PIPA privacy notice** shipped (footer link + `/privacy` + form line).
- [ ] No unintended **placeholder** text or art is leaking (intentional placeholders are documented in the handoff as swappable).

**Stage B — invoice & collect:**
- [ ] Forward the **preview URL** so the client can see the finished site.
- [ ] Send the **invoice** ($1,500 + add-ons, fields per `docs/gtm/payment-and-terms.md` §3; no GST line while a small supplier).
- [ ] **Payment received & cleared** (method per intake — e-Transfer default).

**Stage C — transfer ownership (ONLY after Stage B clears):**
- [ ] Account/domain ownership transferred to the **client owner email** (domain, host, Storyblok, form, analytics) — reset/invite, never plaintext passwords.
- [ ] `docs/handoff/<slug>-handoff.md` is complete (§0 payment filled, accounts, ownership steps, edit links, placeholder-swap guide).
- [ ] Handoff message is forwardable as-is to the client.
