# Form-service comparison — settling the contact-form backend

**Date:** 2026-06-17 · **Verdict: lock in Web3Forms** as the standard. Revisit if our volume profile changes (see "When to revisit").

## Why this exists
Static sites have no backend, so a contact form needs a third-party endpoint to deliver submissions as email. We'd been using **Web3Forms** but hadn't formally settled whether it's the right tool. This compares it against the realistic alternatives for our use case: **low-volume local-shop contact forms** (a barber/café/retail brand gets a handful of form messages a month, not hundreds).

## The comparison (verified 2026-06-17)

| Service | Free limit/mo | Over-limit behavior | Account needed | Host lock-in | File uploads |
|---|---|---|---|---|---|
| **Web3Forms** ✅ | **250** | Stops accepting until next month | **No** | None — works on any static host | No (free) |
| Formspree | 50 | Stops accepting | Yes | None | No (free) |
| Netlify Forms | 100 | **Whole site paused** until next cycle | Yes | Netlify-only + drag-drop detection gotcha | Paid |
| Cloudflare Worker + email | ~unlimited | n/a | — | **Ties the client to us** (we'd maintain the worker) | Custom |

**Paid tiers, for reference:** Web3Forms Pro $12/mo (yearly) → 10,000/mo + attachments/webhooks/autoresponder. Formspree Personal $15/mo → 200/mo. Netlify Forms is credit-based and getting more expensive in 2026.

## Why Web3Forms wins for us
1. **Highest free limit** — 250/mo is 5× Formspree and 2.5× Netlify Forms. A local shop won't approach it.
2. **No account friction** — owner enters their email, gets a public access key instantly; the key is safe to commit in client-side HTML. Nothing for the client to manage.
3. **Host-agnostic** — works on any static deploy. Critical because it decouples the form from the host (we can move hosts without re-wiring forms).
4. **Avoids Netlify Forms' traps** — Netlify Forms (a) only registers on Git/CLI builds, **not drag-drop deploys** (POST → 404; see `deploy-shop-site`), and (b) **pauses the entire site** when the free cap is hit. Unacceptable for a hands-off client site.
5. **Keeps the model hands-off** — a Cloudflare Worker would be more powerful but would make us the long-term maintainer of each client's form backend, which contradicts our one-time-fee, client-owns-everything model.

## The limit + escape hatch (document for clients)
- Free: **250 submissions/mo**, 30-day storage, up to 3 notification emails, no file uploads.
- If a client ever exceeds 250/mo: upgrade to Web3Forms Pro ($12/mo) **or** switch services — because the form is host-agnostic and the key lives in editable content, switching is a small change, not a rebuild.

## Known operational gotcha (already in `deploy-shop-site`)
You **cannot** verify a Web3Forms key with curl/server requests — the free tier rejects non-browser calls with a "Pro plan required" message. That error means the key is *fine*. Verify by submitting from a **real browser** on the deployed/served site.

## When to revisit
- If a client profile emerges that genuinely needs >250 submissions/mo on the free tier.
- If we need file uploads or webhooks on the free tier (we don't today).
- If Web3Forms changes its free limit or its no-account model.

## Sources
- [Web3Forms pricing](https://web3forms.com/pricing)
- [Formspree plans](https://formspree.io/plans) · [Formspree account limits](https://help.formspree.io/hc/en-us/articles/47605896654227-Account-limits)
- [Netlify Forms usage & billing](https://docs.netlify.com/manage/forms/usage-and-billing/)
