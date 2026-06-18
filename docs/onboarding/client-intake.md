# Client Intake — <Business Name>

> **Template** for `docs/onboarding/<slug>-intake.md`. The delivery agent fills this autonomously from the kickoff input + any prior audit — **pre-fill everything derivable; mark gaps `[UNKNOWN]`**. Don't block the build on gaps: use documented, swappable defaults and record them in the Decision log. **Only `[BLOCKER]` fields below justify interrupting the operator** — batch all missing blockers into ONE message. Filled example: `docs/onboarding/bitcoin-manor-intake.md`.

## Business
- **Client / business name:** ____
- **Slug:** `____`
- **What they do:** ____
- **Vertical (engine):** ____ (barber / salon / cafe / restaurant / retail / services / …)
- **Existing site:** ____ (URL + platform, e.g. "WordPress + Elementor"; or "none")
- **Region:** ____ (city, province; physical address or online-only)

## Audit seed (if a prior/just-run audit exists)
- **Grade → action:** ____ (e.g. D → rebuild). Key gaps: ____
- **Report:** `packages/audit/audit-<host>.html` + `.json`
- **Honesty note:** quote PageSpeed score + architecture, never a lab LCP as a felt load time (see `site-audit`).

## Scope decision
- ____ (what we're delivering vs. explicitly NOT replacing — e.g. "brand site that deep-links to their existing store, not a store rebuild")

## Contact & assets
- **Public email:** ____
- **Phone / click-to-call:** ____
- **Address / map (if NAP vertical):** ____
- **Hours:** ____
- **Logo / imagery available:** ____ (or "use placeholders, swappable in CMS")

## Existing footprint (DISCOVERY — fill from the `site-audit` footprint sweep)
> The wider web presence the build pulls from. **Mandatory** — fill every row; the build applies `docs/onboarding/component-taxonomy.md` to each, and Gate 2 diffs this block against the live site. An empty row means "checked, none found" — say so explicitly, never leave blank.
- **Reviews — Google rating + count (all locations):** ____ (+ GBP URL) — *Tier 1: feature if ≥~5 real; never fabricate.*
- **Real socials (owned + ACTIVE only):** ____ — from `stack.socials.real`; **discard `stack.socials.placeholders`** (Wix/template handles like `twitter.com/wix`). Confirm last post within ~6 months. *Tier 1: link active, omit dead.*
- **Booking tool they already use:** ____ (Fresha / Square / Booksy / Jane / OpenTable / "none — call to book") — from `stack.booking[]` + their "Book" button. *Tier 2: mirror it, never replace; empty page = call-to-book CTA.*
- **Payments / deposits tool:** ____ (Square / Stripe / none) — *Tier 3: link their own, never custody.*
- **Newsletter / email tool:** ____ (Mailchimp / Square / none) — *Tier 3: only if they run one AND ask.*
- **Texts customers? (SMS / WhatsApp):** ____ — *Tier 1: ship a deep-link if yes.*
- **Photos to reuse from the old site:** ____ (real, non-stock — re-encode to WebP)

## [BLOCKER] fields — interrupt the operator only if these are missing
*(Each is either resolved, or a single batched ask. Document the chosen default if proceeding without it.)*

- **Owner email (ALL accounts go under this):** ____ — Storyblok/Netlify/domain ownership transfer to this email at handoff. If unknown, stand up under operator email and document the transfer as a manual handoff step.
- **Public contact email / form-destination inbox:** ____ — where Web3Forms delivers submissions.
- **Privacy-note decision + privacy contact:** ____ — every site ships a PIPA privacy notice **with the mandatory cross-border (US: Web3Forms + Cloudflare Pages — name the actual host) disclosure** (footer link + page/section + form line; template: `docs/onboarding/privacy-notice-template.md`). Needs a **privacy contact** (name/position + email) from the client for the notice — if unknown, default to the public contact email and flag it in handoff.

### Domain & email — needed for a clean cutover (see `deploy-shop-site` → "Domain cutover")
*Capture these at intake so launch day is frictionless — they decide the DNS method and surface lock-in/email risks early.*
- **Do they own a domain?** ____ (domain name, or "needs to buy one")
- **Where is the domain registered?** ____ (registrar — GoDaddy / Namecheap / etc., **or** "bought through Wix/Squarespace/their old site platform" ⚠️ may be platform-locked / 60-day transfer lock)
- **Where is their email hosted?** ____ (e.g. Google Workspace, the old host's mailbox, none) — ⚠️ if email is on the same domain via the old host, **preserve MX**; prefer the keep-current-DNS cutover method.
- **Replacing an existing live site?** ____ (yes/no) — if yes, plan zero-downtime cutover: build → approve on `*.netlify.app` → re-point DNS → verify → client cancels old subscription.

## Decision log (agency defaults — documented, not approved)
- ____ (palette/mood, template direction, copy choices, schema type, package/price, imagery approach — every default chosen without asking, so the operator sees *what* was decided)
