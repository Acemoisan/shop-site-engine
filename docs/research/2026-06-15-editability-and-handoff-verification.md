# Verification: Client Editability & Walk-Away Handoff (one-time-fee, zero-maintenance model)

**Date:** 2026-06-15
**Method:** 3 parallel web-research agents, current 2025–2026 sources, one tooling path each.
**Trigger:** Owner set a firm business model — **one-time build fee, NO maintenance contract** — and a hard requirement that the **non-technical client edits everything themselves (text, images, hours, contacts, links, menus) after we fully walk away, owning all their own accounts.** This reopens the "code-first default / no-code fallback" framing, which was originally argued on *our* build efficiency (and an implicit recurring-care model), not on client handoff.

> **Why this matters:** "No maintenance contract" means we must hand over every account (domain, hosting, CMS/editor) and never touch it again. That requirement, not our build speed, is now the deciding lens.

---

## Bottom line

The one-time-fee + zero-maintenance + client-self-edit model creates a real trade-off, now evidence-backed:

- **No-code (Framer / Wix Studio)** gives the **cleanest walk-away** for a non-technical owner: one bundled account they own, a safe "edit content but can't break layout" mode, platform-managed hosting/security, and a literal one-click ownership transfer. Cost is the client's own subscription (~$10–29/mo) — acceptable because it's *theirs*, not ours. Weakness: lowest AI/Claude leverage and no one-codebase-many-shops reuse for *our* production.
- **Astro + Storyblok (code-first + CMS)** is viable and keeps our advantages (AI build leverage, component reuse, near-$0 client cost), but the handoff is heavier: the owner ends up owning **3–4 accounts** (CMS, hosting, GitHub, domain) and the build/auth pipeline is a "dead-man's switch" a non-technical owner can't self-repair if it breaks years later — a real risk with no maintenance contract.
- **Lovable** is a **build accelerator, not a handoff/self-edit solution.** It does not satisfy the model on its own.

**Implication for the decision:** which path wins depends on positioning and volume (resolve in the interview). High-volume/low-touch and truly non-technical owners lean **no-code (Framer for brochure, Wix for e-commerce/SEO)**; a more design-differentiated / higher-margin play where we want reuse and AI leverage leans **Astro + Storyblok**, accepting a more guided handoff.

---

## 1. Lovable (lovable.dev)

**Verdict: Does NOT fit one-time-fee / no-maintenance / self-edit on its own — only with a CMS bolted on.**

- Produces a real **Vite + React + TypeScript + Tailwind** app (optional Supabase backend), open-source stack, full code ownership, two-way GitHub sync, self-hostable on Vercel/Netlify/Cloudflare. — docs.lovable.dev/tips-tricks/deployment-hosting-ownership
- Its no-code editor ("**Visual Edits**" — click element, edit text, swap/AI-generate images) lives **inside the Lovable workspace, not on the published site.** It is a builder tool, not an end-user CMS. — lovable.dev/blog/introducing-visual-edits
- **Two mutually exclusive handoff paths, neither clean:**
  1. *Client stays on Lovable* (owns the account): genuinely non-technical editing, **but a custom domain requires a paid plan (~$25/mo)** — breaks "no ongoing cost," and structured content (hours/menus) is clumsy without a real CMS. — docs.lovable.dev/features/custom-domain · superblocks.com/blog/lovable-dev-pricing
  2. *Export + host elsewhere*: client truly owns code + hosting with no Lovable dependency, **but the Visual Edits editor does not come with the exported site** — it's just a React codebase a non-technical owner can't edit. — rapidevelopers.com/blog/can-i-export-lovable
- No one-click "transfer to client" exists; recommended handoff is client-owns-account from day one, or export→Vercel. — arsturn.com/blog/how-to-transfer-loveable-site-to-client-guide
- **Confidence:** High on stack/export/ownership and the in-workspace-editor limitation. Medium on what happens to a Lovable-hosted custom-domain site if the subscription lapses (likely goes dark — unconfirmed on official docs).
- **Role for us:** possible *build accelerator* only; still needs a CMS layer before any handoff.

## 2. Astro + CMS (code-first)

**Verdict: Yes, can deliver a true walk-away. Best fit = Storyblok (free Starter plan).**

| CMS | Editing for a shop owner | Ongoing client cost | Walk-away catch |
|---|---|---|---|
| **Storyblok** (best) | True visual editor + live preview; hosted Digital Asset Manager (upload/crop/organize images). "Squarespace feeling." | **Free Starter forever** (1 seat, 1 space, 100GB/mo). 2nd seat $15/mo; Growth $99/mo (not needed for one shop). | Content/images live in Storyblok, so GitHub/hosting stay "set and forget" — lowest effective sprawl. |
| **Decap** (cheapest) | Web `/admin` editor, commits Markdown to repo; basic media. | **$0** (MIT). Auth via DecapBridge free tier. | **Auth is the weak link** — Netlify Identity/Git Gateway **deprecated**; DecapBridge (3rd-party) now the recommended login path. Vendor/auth risk. |
| **TinaCMS** | Native in-context visual editing on Astro (best editing feel). | Free tier ($0) but tight: 2 users, **100MB asset cap**; paid $24–41/mo. | Free/self-host ties login to a GitHub OAuth app you configure; self-hosting is "a meaningful infrastructure undertaking." |

- **Account sprawl floor = 3–4 logins** the client must own: CMS, hosting (Netlify/Vercel/Cloudflare Pages free tier), GitHub repo, domain registrar. Storyblok keeps the last three near-untouched.
- **Maintenance reality:** static output = **no WordPress treadmill** (no server/db/plugins/security updates). "Build once, hand off, never touch again" is realistic *for the running site*. Long-tail risk = a free-tier or auth-provider policy change the owner can't self-fix.
- **Hardest handoff breakers:** (1) auth/login ownership (esp. Decap), (2) the repo/hosting "dead-man's switch" if a build fails and we've walked away, (3) structural/layout/nav edits still need a developer — the self-edit promise holds for *content*, not *design*, and that boundary must be set with the client, (4) media discipline on repo-backed CMSs.
- **Sources:** storyblok.com/pricing · storyblok.com/lp/visual-editor · docs.astro.build/en/guides/cms/storyblok · decapcms.org · github.com/decaporg/decap-cms/discussions/7419 (Git Gateway deprecation) · decapbridge.com · tina.io/pricing · tina.io/astro
- **Confidence:** High on Storyblok/Tina pricing and the Decap auth deprecation; pricing is time-sensitive — reconfirm at quote time.

## 3. No-code builders (Framer / Wix Studio / Webflow)

**Verdict: Framer best for one-time-fee walk-away; Wix Studio close runner-up and best when e-commerce or local SEO matters; avoid Webflow for this model.**

| Builder | Self-edit after handoff | Ownership transfer | Ongoing client cost (annual billing) | Zero-maintenance? |
|---|---|---|---|---|
| **Framer** | **Live Content Editing** — edit text/images/CMS on the live site; design canvas stays locked unless deliberately opened. Cleanest "won't break it." | **File → Transfer Project** moves project + domain to client's workspace; you uncheck "remain as editor" and your sub is canceled/credited. Billing cleanly becomes theirs. | **Basic $10/mo, Pro $30/mo, Scale $100/mo** (per-site, incl. hosting + custom domain). Repriced Oct 9 2025. | Yes — fully managed. |
| **Wix Studio** | Strong, approachable dashboard editor; can grant restricted permissions. Slightly less "locked" than Framer. Client Kit packages handoff/training. | **Site Actions → Transfer site** to client's Wix account (optionally transfer plan + domain); client confirms within 3 days. | **Light $17 / Core $29 / Business $39 / Business Elite $159** per month; free domain year one. Core = entry for payments/e-commerce. | Yes — fully managed. |
| **Webflow** | Edit Mode + Client Seats (safe, content-only) — **but Legacy Editor deprecates Aug 4 2026** (forced migration from May 4 2026). | **Weakest** — splits Workspace (build) from Site plan (hosting); no tidy single-account transfer. | Pays **both** a Site plan (~$14/mo+) and possibly a Workspace plan — most expensive/confusing. | Technically yes, but the 2026 editor migration hits a walked-away client. |

- **Best-fit by scenario:** cheap brochure → **Framer Basic ($10/mo)**; needs e-commerce → **Wix Core ($29/mo+)**; needs strong guided local SEO → **Wix**. Webflow only for deep technical-SEO content sites (contradicts hands-off model).
- **Sources:** framer.com/help/articles/how-to-transfer-your-site-to-someone-else · framer.com/blog/pricing-update · support.wix.com/en/article/transferring-a-premium-site-to-another-wix-account · support.wix.com/en/article/wix-studio-creating-a-client-kit-5293562 · help.webflow.com/hc/en-us/articles/48412420902675-Legacy-Editor-deprecation-FAQ · webflow.com/updates/client-seats
- **Confidence:** High on transfer mechanics and directional pricing; verify exact Webflow Site/Workspace prices and Framer editor-seat rules at quote time.

---

## What this changes for our plan

1. **The recurring-care/WaaS recommendation is off** (owner decision) — so the handoff must be genuinely self-sufficient, which *raises the bar on editability* and *favors single-account ownership.*
2. **"No-code = fallback" is no longer obviously right.** For a non-technical, zero-maintenance, one-time-fee client, **Framer/Wix may be the primary recommendation**, with Astro+Storyblok reserved for clients/jobs where our reuse + AI leverage + near-zero client cost outweigh the heavier handoff.
3. **Decision input needed (interview):** positioning, target vertical, and expected volume determine which path leads. The capability we build today should validate whichever path we pick first.
4. **Lovable** is at most a build accelerator; it is not a client-handoff product.
