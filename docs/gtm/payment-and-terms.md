# Payment & Terms Policy — Studio0rbit

**Date:** 2026-06-17 · **Status:** v1 policy (research-grounded). **Model:** $1,500 CAD flat one-time build fee + one-time add-ons, no maintenance contract, client owns all accounts after handoff.

> ⚠️ **NOT legal or tax advice.** This policy is grounded in primary sources (CRA, Interac, Alberta consumer-law references) where cited, plus industry practice where noted as lower-confidence. Before you rely on the client-facing contract clauses below as a binding agreement, have them reviewed by an **Alberta-licensed lawyer**, and confirm the GST handling with a **CPA**. The whole point of §4 is to limit liability — a template I generated is a starting draft, not a vetted contract. Sources are listed at the bottom.

---

## 0. The one finding that changes the recommendation

You chose **100% on delivery** (build first, invoice at handoff) with **no deposit**. The research is honest about this: **the actual industry norm for sub-$5,000 web builds is deposit-first (25–50% upfront), with the balance — and the deliverables/ownership — withheld until paid in full.** Pure deliver-first is *not* the norm and carries more non-payment risk for a solo operator (you've done all the work before any money moves). *(Lower-confidence: practitioner blogs, not primary sources — but the direction was consistent across every source.)*

**BUT** — the same research confirms the mechanism that makes deliver-first *safe enough* without a deposit: **conditional ownership transfer.** It is standard, widely-used, and enforceable to write that **all IP and account/domain ownership transfers to the client only upon payment in full**, and to hold the deliverables (live site on *our* hosting, accounts in *our* control) until then. That is your leverage. So:

**→ Recommended structure: deliver-first (honors your choice, zero deposit friction) + payment-gated ownership transfer (the protection).** This threads the needle. If you ever get burned, add a 50% deposit — but you can launch on deliver-first because the handoff gate, not a deposit, is what protects you.

---

## 1. Payment structure

| | |
|---|---|
| **When** | Invoice the full **$1,500** (+ any agreed add-ons) at **delivery** — when the finished site is built and viewable. No deposit by default. |
| **What the client sees before paying** | The completed site **live on OUR hosting** (a `*.netlify.app` preview/live URL under our account). They can see exactly what they're buying. They cannot lose it or take it. |
| **What unlocks on payment** | Account/domain ownership transfer + final edit links + the handoff guide. **Nothing transfers until the invoice clears** (see §4 clause C and the pipeline gate). |
| **Terms** | Net 7 from invoice date (short, because the work is done and the site is waiting). Late interest per §4. |
| **Escalation if unpaid** | After net-7 + one reminder: the site stays on our hosting, unindexed, ownership untransferred. Alberta non-payment recourse for $1,500 is small claims (Alberta Civil Claims, up to $100,000) — but the practical recourse is simply that **they don't get the keys until they pay.** |
| **Optional hardening** | If a client feels high-risk, switch that one engagement to **50% deposit / 50% on delivery**. The pipeline supports both; deliver-first is the default. |

---

## 2. Payment rails — default + fallbacks

Goal: **mimic what the client already uses; never make them sign up for anything.**

| Rail | Fee | Client needs | Limit vs $1,500 | Use as |
|---|---|---|---|---|
| **Interac e-Transfer** | **$0** (most business chequing) | Just online banking — every Canadian shop owner has it | e-Transfer **for Business** supports up to **$25,000/transfer** (institution-dependent); personal varies but easily covers $1,500 in 1–2 sends | **DEFAULT.** Free, no signup, instant, familiar. Send to our business email/registered recipient. |
| **Credit/debit card link** (Stripe Payment Link or Square) | ~2.9% + 30¢ (~$45 on $1,500) | Nothing — just click a hosted link | No practical limit | **Fallback #1** — for clients who want to pay by card or already run **Square/Stripe** for their own business (mimics their tooling). We absorb/quote the fee. |
| **Cheque** | $0 | A chequebook | n/a | **Fallback #2** — older/traditional clients. Slower to clear; transfer keys only after it clears. |
| **PayPal** | ~2.9% + fixed | PayPal account | n/a | Only if the client specifically prefers it. |

**Rule of thumb:** ask in intake how they prefer to pay; **default to e-Transfer** unless they already use Square/Stripe or ask for card. Always confirm a payment is *received and cleared* before transferring ownership.

---

## 3. Tax (GST/HST) — Alberta/Canada

**You are a "small supplier" and do NOT register for or charge GST/HST until your worldwide taxable revenue exceeds $30,000** — measured over **four consecutive calendar quarters** *and* in **any single calendar quarter** (CRA, primary, high confidence). At $1,500/build that's ~20 builds in one quarter, or >$30k cumulative over a year. Until then:

- **Don't charge GST.** Invoices are GST-free; no GST line, no registration number (you have none yet).
- **Registration is voluntary** below the threshold (lets you claim input tax credits — usually not worth it at near-zero costs).
- **Track revenue every quarter.** The single-quarter test bites *immediately* on the sale that crosses $30k (no grace period). The four-quarter test gives ~1 month + 29 days to register. **Confirm timing with a CPA as you approach the threshold.**
- **Alberta has no provincial sales tax** — so once registered you'd charge **5% GST** only, nothing else.

**Compliant invoice fields** (CRA, thresholds updated 2021 to $100/$500). At $1,500 you're in the **$500+** tier, so every invoice should carry:
1. Your business / trade name **and address**
2. Invoice **date** + a unique invoice number
3. The **client's** name and address
4. A brief **description** of the service (e.g., "Website design & build — flat fee")
5. **Total amount** payable
6. **Terms of payment** (net 7, method)
7. **GST**: only once registered — then show your GST/HST registration number and the 5% GST amount separately. While a small supplier: no GST line.

Keep all invoices + records **6 years** (CRA record-keeping).

**Sole proprietor vs incorporation:** a sole proprietorship is the simplest way to start taking payments (no setup), but carries **unlimited personal liability** — business debts/claims can reach personal assets. Incorporating (Alberta) adds limited-liability protection at the cost of setup + annual filings. *(This is the standard trade-off; confirm with a lawyer/accountant — relevant because §4's liability caps matter more under a sole prop.)* For now: a sole prop + the §4 contract caps is a reasonable start; revisit incorporation as volume grows.

---

## 4. Client-facing contract / terms clauses (DRAFT — lawyer-review before use)

Minimum clauses to protect a one-time, deliver-first, no-maintenance build. **Have an Alberta lawyer review before this is your binding agreement.**

- **A. Scope & flat fee.** The Service is the fixed-scope build defined in `docs/gtm/packaging.md` for **$1,500 CAD one-time**, plus any add-ons agreed in writing. Anything outside scope is a separate quote.
- **B. Payment.** Full fee due on delivery, **net 7 days** from invoice. Accepted methods: e-Transfer (preferred), card link, or cheque.
- **C. Ownership transfers on payment in full (the key clause).** *"All intellectual property rights in the deliverables, and ownership/control of all associated accounts (domain registrar, hosting, CMS), transfer to the Client only upon receipt of payment in full. Until payment is received in full, Studio0rbit retains all such rights and control, and the site remains hosted under Studio0rbit's account."* — standard, enforceable, and the mechanism that makes deliver-first safe.
- **D. Late payment.** Interest of **[1.5% per month / 18% per annum]** on overdue amounts (set the rate, state it up front).
- **E. Limitation of liability.** Total liability capped at the **fees paid** ($1,500); no liability for indirect/consequential/lost-profit damages.
- **F. As-is / no warranty after handoff.** The site is delivered as-is; **no maintenance, hosting management, updates, uptime, SEO-ranking, or support obligation after handoff** (this is the whole no-maintenance model). The client owns and operates everything post-transfer.
- **G. Client responsibilities.** Client owns and is responsible for content accuracy, licensing of any content they supply, their domain/hosting/CMS accounts post-transfer, and their own booking/payment tools.
- **H. Cancellation / kill fee.** If the client cancels after the build starts, work completed is billable (e.g., a stated kill fee or pro-rata) — protects against build-then-walk.
- **I. Privacy.** Any site collecting form/booking data references **Alberta PIPA** (already in the packaging baseline).
- **J. Governing law.** Alberta.

**Alberta Consumer Protection Act note:** the Act protects **consumers** (an *individual* receiving goods/services, not for resale) in **consumer transactions**. A business buying a website for its own commercial use generally falls **outside** the Act — *but the boundary is gray for sole-proprietor clients, and it is not safe to assume the Act never applies.* Write fair, clear terms (no unfair-practice exposure) regardless, and have a lawyer confirm scope. *(Primary: Alberta Canadian Legal FAQs; SB LLP primer.)*

---

## 5. How this is codified in the pipeline

- **Intake** captures the client's **preferred payment method** (default e-Transfer) — a non-blocking field.
- **Deliver mode** builds and verifies with the site **live on our hosting** (not yet the client's).
- **Gate 2 (payment-gated handoff):** the agent stops and produces (a) the live preview URL the operator forwards so the client can see it, and (b) a drafted **invoice** (fields per §3, amount = $1,500 + add-ons). **The operator confirms payment cleared. Only then** does the agent/operator perform the account/domain ownership transfer + send final edit links + the handoff guide. Ownership transfer is the *last* step, after money.
- **Handoff doc** records the payment method used, invoice reference, and that ownership transferred post-payment.

This makes "the client owns everything / we walk away" true **after** payment, and gives the operator a clean stop-point if payment stalls.

---

## Sources
- **GST/HST small supplier + when to register:** CRA — [When to register for and start charging the GST/HST](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/when-register-charge.html); [RC4022 General Information for GST/HST Registrants](https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/rc4022/general-information-gst-hst-registrants.html). *(Verified 3-0 in deep-research.)*
- **Invoice content tiers ($100/$500, updated 2021):** CRA — [Charge and collect the GST/HST: Receipts and invoices](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-receipts-invoices.html); RC4022 "Input tax credit information requirements" chart.
- **Interac e-Transfer for Business limit ($25k/transfer):** [Interac — e-Transfer for Business](https://www.interac.ca/en/payments/business/send-receive-money-with-interac-e-transfer-for-business/). *(Verified 3-0.)*
- **Alberta Consumer Protection Act scope / "consumer" definition:** [Canadian Legal FAQs — The Consumer Protection Act](https://www.law-faqs.org/alberta-faqs/consumer-law/the-consumer-protection-act/); [SB LLP — A Primer on Alberta's Consumer Protection Act](https://sb-llp.com/knowledge-bank/a-primer-on-albertas-consumer-protection-act-and-the-litigation-of-consumer-contracts).
- **IP-transfer-on-payment clause (standard/enforceable):** industry references incl. LegalGPS creative-services IP, web-design contract guides. *(Lower confidence — principle is general contract law; confirm wording with a lawyer.)*
- **Payment structure norm (deposit-first leans against pure deliver-first):** practitioner sources (Contra, Sazzy, Geary). *(Lower confidence — blogs, not primary; direction was consistent.)*
- **Full research artifact + adversarial verification:** deep-research run 2026-06-17 (rate-limited mid-verification; 2 claims survived at high confidence, the rest filled here via direct primary-source checks).
