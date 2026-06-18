import type { AuditData, FeatureKey } from "./types.js"

/** HTML-escape helper: escapes & < > " in any dynamic text. */
function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/** Prettify a hostname into a shop name.
 *  e.g. www.calgary-barber.com → "Calgary Barber"
 */
function prettifyHostname(hostname: string): string {
  let host = hostname.toLowerCase()
  // Strip leading www.
  if (host.startsWith("www.")) host = host.slice(4)
  // Drop the TLD (last segment after final dot)
  const parts = host.split(".")
  if (parts.length > 1) parts.pop()
  const base = parts.join(" ")
  // Replace hyphens and dots with spaces, then Title-Case
  const spaced = base.replace(/[-_.]+/g, " ").trim()
  if (!spaced) return hostname
  return spaced.replace(/\b\w/g, (c) => c.toUpperCase())
}

interface FeatureCopy {
  problem: string
  cost: string
  fix: string
}

const FEATURE_COPY: Record<FeatureKey, FeatureCopy & { rank: number }> = {
  mobileViewport:       { rank: 1,  problem: "The site isn't built to fit phone screens.",         cost: "Most people find a local shop on their phone — a desktop-only layout makes them pinch, zoom, and leave.",                                               fix: "Rebuild the layout mobile-first." },
  clickToCall:          { rank: 2,  problem: "The phone number isn't tap-to-call.",                 cost: "On a phone, customers expect to tap the number and call — anything more loses the impatient ones.",                                                   fix: "Make the phone number a tap-to-call link." },
  bookingLink:          { rank: 3,  problem: "There's no obvious way to book online.",              cost: "Customers who'd rather book than call have nowhere to go, so they book a competitor who offers it.",                                                  fix: "Add a clear booking button (Square/Fresha/etc.)." },
  hours:                { rank: 4,  problem: "Opening hours aren't shown on the site.",             cost: "People call just to ask if you're open — or assume you're closed and move on.",                                                                        fix: "Publish current opening hours prominently." },
  addressOrMap:         { rank: 5,  problem: "No address or map on the page.",                      cost: "Customers can't see where you are or get directions, and it weakens your local search presence.",                                                     fix: "Add the address and an embedded map." },
  localBusinessJsonLd:  { rank: 6,  problem: "No LocalBusiness structured data.",                   cost: "Google can't cleanly read your name, address, and hours, which lowers your rank in the local/Maps results where nearby customers look.",              fix: "Add LocalBusiness JSON-LD." },
  menuSchema:           { rank: 7,  problem: "Your services/menu aren't marked up for search.",     cost: "Your services and prices don't show up directly in Google, so you lose searchers comparing options.",                                                 fix: "Add service/menu structured data." },
  https:                { rank: 8,  problem: "The site isn't served over HTTPS.",                   cost: "Browsers show a 'Not secure' warning that scares customers off, and it hurts search ranking.",                                                        fix: "Install an SSL certificate and force HTTPS." },
  reviews:              { rank: 9,  problem: "No reviews or testimonials on the site.",             cost: "New customers look for proof others trust you before booking — without it, they hesitate.",                                                           fix: "Surface your best reviews / a star rating." },
  contactForm:          { rank: 10, problem: "There's no contact form.",                            cost: "People who won't call have no easy way to reach you, so some inquiries never happen.",                                                               fix: "Add a simple contact form." },
  ogTags:               { rank: 11, problem: "No social link-preview tags.",                        cost: "When the site is shared on Facebook/Instagram/texts it shows a blank, unappealing preview that gets fewer clicks.",                                   fix: "Add Open Graph tags." },
  favicon:              { rank: 12, problem: "No favicon (browser-tab icon).",                      cost: "Minor, but a missing tab icon reads as unpolished.",                                                                                                 fix: "Add a favicon." },
}

function gradeColor(grade: string): string {
  if (grade === "A" || grade === "B") return "#0f9d63"
  if (grade === "C") return "#d97706"
  return "#dc2626"
}

function gradeVerdict(grade: string): string {
  switch (grade) {
    case "A": return "Your site is in great shape — only minor polish left."
    case "B": return "Solid foundation with a few high-impact gaps worth fixing."
    case "C": return "A workable base, but several fixes are costing you customers."
    case "D": return "Significant issues are holding the site back."
    default:  return "Critical problems — or no working site yet."
  }
}

/** Return missing feature keys sorted by impact rank. */
function missingFeatures(inventory: AuditData["inventory"]): FeatureKey[] {
  return (Object.keys(FEATURE_COPY) as FeatureKey[])
    .filter((k) => inventory[k] === false)
    .sort((a, b) => FEATURE_COPY[a].rank - FEATURE_COPY[b].rank)
}

export function renderReport(data: AuditData, shopName?: string): string {
  // Resolve display name
  let displayName = shopName ?? ""
  if (!displayName) {
    try {
      displayName = prettifyHostname(new URL(data.url).hostname)
    } catch {
      displayName = data.url
    }
  }

  const title = `${esc(displayName)} — Website &amp; Online Presence Audit`
  const audUrl = esc(data.url)
  const platform = data.stack.platform ? esc(data.stack.platform) : null

  // --- CSS: receipt aesthetic in the Studio0rbit palette
  //     (deep-space ink page, electric-indigo + orbit-cyan, Space Grotesk/Mono). ---
  const css = `
    :root {
      --ink:#14111f; --paper:#ffffff; --text:#1b1730; --muted:#726e89;
      --indigo:#5b4de3; --cyan:#1fbed4; --dash:#cdc9dd; --page:#0e0b16;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, sans-serif; color: var(--text);
      background: var(--page);
      background-image: radial-gradient(72% 48% at 50% -8%, rgba(91,77,227,.45), transparent 70%);
      min-height: 100vh; padding: 40px 16px; font-size: 15px; line-height: 1.62;
      -webkit-font-smoothing: antialiased;
    }
    .receipt {
      position: relative; max-width: 600px; margin: 0 auto; background: var(--paper);
      box-shadow: 0 40px 90px -34px rgba(0,0,0,.75), 0 0 0 1px rgba(255,255,255,.05);
    }
    .receipt::before, .receipt::after {
      content: ""; position: absolute; left: 0; right: 0; height: 12px;
      background: radial-gradient(circle 7px at 11px 0, var(--page) 7px, transparent 8px) repeat-x;
      background-size: 22px 12px;
    }
    .receipt::before { top: 0; transform: rotate(180deg); }
    .receipt::after { bottom: 0; }
    .rcpt-head { text-align: center; padding: 42px 36px 6px; }
    .wordmark { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 1.05rem; letter-spacing: .3em; text-transform: uppercase; color: var(--ink); }
    .wordmark .dot { color: var(--indigo); }
    .doc-type { margin-top: 10px; font-family: 'Space Mono', monospace; font-size: .68rem; letter-spacing: .34em; text-transform: uppercase; color: var(--muted); }
    .rcpt-sec { padding: 24px 36px; }
    .rcpt-sec + .rcpt-sec { border-top: 1.5px dashed var(--dash); }
    h1 { font-family: 'Space Grotesk', sans-serif; font-size: 1.35rem; font-weight: 700; color: var(--ink); margin-bottom: 6px; letter-spacing: -0.01em; }
    h2 { font-family: 'Space Grotesk', sans-serif; font-size: .76rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--indigo); margin-bottom: 14px; }
    h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 600; color: var(--ink); margin-bottom: 4px; }
    .subtitle { color: var(--muted); font-size: .76rem; font-family: 'Space Mono', monospace; }
    .subtitle a { color: var(--indigo); text-decoration: none; }
    .divider { border: none; border-top: 1.5px dashed var(--dash); margin: 22px 0; }
    /* Snapshot / grade */
    .snapshot { display: flex; align-items: center; gap: 20px; }
    .grade-badge {
      display: flex; align-items: center; justify-content: center;
      width: 78px; height: 78px; border-radius: 16px;
      font-family: 'Space Grotesk', sans-serif; font-size: 2.5rem; font-weight: 700;
      color: #fff; flex-shrink: 0;
    }
    .snapshot-body { flex: 1; }
    .tier-pill {
      display: inline-block; font-family: 'Space Mono', monospace; font-size: .66rem;
      font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
      padding: 3px 11px; border-radius: 999px;
      background: rgba(91,77,227,.1); color: var(--indigo); margin-bottom: 9px;
    }
    .verdict { font-size: 1rem; font-weight: 600; color: var(--ink); margin-bottom: 4px; }
    .confidence { font-size: .8rem; color: var(--muted); }
    /* Issues = receipt line items */
    .issue { position: relative; padding-left: 18px; margin-bottom: 20px; }
    .issue:last-child { margin-bottom: 0; }
    .issue::before { content: ""; position: absolute; left: 0; top: 4px; bottom: 4px; width: 3px; border-radius: 3px; background: var(--indigo); }
    .issue-problem { font-weight: 700; color: var(--ink); margin-bottom: 2px; }
    .issue-cost { color: #423d57; margin-bottom: 5px; font-size: .93rem; }
    .issue-fix { font-family: 'Space Mono', monospace; font-size: .8rem; color: #0f9d63; font-weight: 700; }
    /* Bullets */
    .bullet-list { list-style: none; }
    .bullet-list li { display: flex; gap: 10px; margin-bottom: 10px; align-items: flex-start; }
    .bullet-list li:last-child { margin-bottom: 0; }
    .bullet-list li::before { content: "✓"; color: var(--cyan); font-weight: 700; flex-shrink: 0; }
    /* Boxes */
    .cta-box { background: rgba(91,77,227,.06); border: 1.5px solid rgba(91,77,227,.22); border-radius: 14px; padding: 22px 24px; }
    .cta-box h2 { color: var(--ink); }
    .cta-box p { color: #423d57; }
    .info-box { background: #f2f6ff; border: 1.5px solid #cfdcff; border-radius: 14px; padding: 22px 24px; color: #27345f; }
    .warn-box { background: #fff8ec; border: 1.5px solid #f3dca0; border-radius: 14px; padding: 22px 24px; color: #6b4a12; }
    /* Footer / fine print + faux receipt barcode */
    .footer-note { font-family: 'Space Mono', monospace; font-size: .7rem; color: var(--muted); line-height: 1.6; }
    .footer-note + .footer-note { margin-top: 7px; }
    .rcpt-foot { padding: 24px 36px 34px; border-top: 1.5px dashed var(--dash); text-align: center; }
    .barcode { height: 40px; max-width: 230px; margin: 6px auto 14px; background: repeating-linear-gradient(90deg, var(--ink) 0 2px, #fff 2px 4px, var(--ink) 4px 5px, #fff 5px 9px, var(--ink) 9px 11px, #fff 11px 14px); }
    .thanks { font-family: 'Space Mono', monospace; font-size: .7rem; letter-spacing: .2em; text-transform: uppercase; color: var(--ink); }
    a { color: var(--indigo); }
  `

  // Helper: a receipt section (continuous paper, dashed dividers between).
  function card(content: string): string {
    return `<section class="rcpt-sec">${content}</section>`
  }

  // --- Header section (site name + audited URL; brand wordmark lives in the frame) ---
  const headerCard = card(`
    <h1>${esc(displayName)}</h1>
    <p class="subtitle">Audited: <a href="${audUrl}">${audUrl}</a></p>
  `)

  // ================================================================
  // Special states
  // ================================================================

  // 1. Not reachable → new-build
  if (!data.reachable) {
    const ctaCard = card(`
      <div class="cta-box">
        <h2 style="margin-bottom:8px;">Want this fixed?</h2>
        <p>I build fast, mobile-first sites for Calgary shops as a one-time project — you own everything, no monthly fees. Reply and I'll send a quote.</p>
      </div>
    `)
    const footerCard = card(`
      <p class="footer-note">${esc(displayName)} · Audited URL: <a href="${audUrl}">${audUrl}</a></p>
    `)
    const body = card(`
      <div class="info-box">
        <h2 style="margin-bottom:8px;">No working website found</h2>
        <p>We couldn't find a working website at this address. The biggest opportunity is a simple, mobile-first site that gets you found on Google and lets customers call, book, and find you.</p>
      </div>
    `)
    return buildDoc(title, css, [headerCard, body, ctaCard, footerCard])
  }

  // 2. Blocked
  if (data.blocked) {
    const ctaCard = card(`
      <div class="cta-box">
        <h2 style="margin-bottom:8px;">Want this reviewed?</h2>
        <p>I build fast, mobile-first sites for Calgary shops as a one-time project — you own everything, no monthly fees. Reply and I'll send a quote.</p>
      </div>
    `)
    const footerCard = card(`
      <p class="footer-note">${esc(displayName)} · Audited URL: <a href="${audUrl}">${audUrl}</a></p>
    `)
    const body = card(`
      <div class="warn-box">
        <h2 style="margin-bottom:8px;">Site exists but blocked automated check</h2>
        <p>The site responded but blocked our automated check (a security challenge), so we couldn't fully audit it. It exists — worth a quick manual look.</p>
      </div>
    `)
    return buildDoc(title, css, [headerCard, body, ctaCard, footerCard])
  }

  // ================================================================
  // Normal graded report
  // ================================================================

  const grade = data.grade.overall
  const color = gradeColor(grade)
  const verdict = gradeVerdict(grade)
  const tierLabel = data.tier.replace(/-/g, " ")

  // Snapshot card
  const confidenceNote = data.grade.confidence === "partial"
    ? "Partial confidence — some signals weren't available."
    : "High confidence — full signal set."

  const snapshotCard = card(`
    <h2>At a Glance</h2>
    <div class="snapshot">
      <div class="grade-badge" style="background:${color};">${esc(grade)}</div>
      <div class="snapshot-body">
        <div class="tier-pill">${esc(tierLabel)}</div>
        <div class="verdict">${esc(verdict)}</div>
        <div class="confidence">${esc(confidenceNote)}</div>
      </div>
    </div>
  `)

  // Issues
  const missing = missingFeatures(data.inventory)
  const top3 = missing.slice(0, 3)

  let issuesCard: string
  if (grade === "A" && top3.length === 0) {
    issuesCard = card(`
      <h2>No Major Gaps Found</h2>
      <p>Your site is already in great shape. Only minor polish items remain — no rebuild or major fixes needed.</p>
    `)
  } else if (top3.length === 0) {
    issuesCard = card(`
      <h2>No Major Gaps Found</h2>
      <p>No major missing features detected — your site covers the essential bases. Focus on ongoing performance and content freshness.</p>
    `)
  } else {
    const issuesHtml = top3.map((key) => {
      const c = FEATURE_COPY[key]
      return `
        <div class="issue">
          <div class="issue-problem">${esc(c.problem)}</div>
          <div class="issue-cost">${esc(c.cost)}</div>
          <div class="issue-fix">Fix: ${esc(c.fix)}</div>
        </div>
      `
    }).join("")

    issuesCard = card(`
      <h2>Top ${top3.length === 1 ? "Issue" : top3.length === 2 ? "2 Issues" : "3 Issues"} to Fix</h2>
      ${issuesHtml}
    `)
  }

  // "What a fixed version looks like" card — derive bullets from top fixes
  let whatFixedCard = ""
  if (top3.length > 0) {
    const bullets = top3.map((key) => {
      const c = FEATURE_COPY[key]
      // Turn each fix into a benefit bullet
      const fixBenefits: Record<FeatureKey, string> = {
        mobileViewport:      "A mobile-first layout that looks great on any screen and keeps visitors engaged.",
        clickToCall:         "A tap-to-call phone number so every mobile visitor can reach you in one tap.",
        bookingLink:         "An online booking button that captures customers even while you're busy.",
        hours:               "Clearly published hours so customers know exactly when to visit or call.",
        addressOrMap:        "A prominent address and map that makes you easy to find and strengthens local search.",
        localBusinessJsonLd: "Structured data so Google confidently shows your business in Maps and local results.",
        menuSchema:          "Service and pricing markup that surfaces your offerings directly in search results.",
        https:               "Full HTTPS so browsers show the padlock and customers trust the site.",
        reviews:             "Visible reviews and star ratings that build trust with first-time visitors.",
        contactForm:         "A simple contact form giving customers another low-friction way to reach you.",
        ogTags:              "Rich link previews on social media and texts that drive more click-throughs.",
        favicon:             "A polished favicon that reinforces your brand in every browser tab.",
      }
      return `<li>${esc(fixBenefits[key])}</li>`
    }).join("\n")

    whatFixedCard = card(`
      <h2>What a Fixed Version Looks Like</h2>
      <ul class="bullet-list">${bullets}</ul>
    `)
  }

  // CTA card
  const ctaCard = card(`
    <div class="cta-box">
      <h2 style="margin-bottom:8px;">Want this fixed?</h2>
      <p>I build fast, mobile-first sites for Calgary shops as a one-time project — you own everything, no monthly fees. Reply and I'll send a quote.</p>
    </div>
  `)

  // Footer card
  const footerNotes: string[] = []
  if (data.grade.confidence === "partial") {
    footerNotes.push(`<p class="footer-note">Preliminary read from on-page checks + an SEO scan; a full audit with Google PageSpeed data sharpens the grade.</p>`)
  }
  footerNotes.push(`<p class="footer-note">Performance/Core Web Vitals figures are indicative lab measurements (Google PageSpeed / Lighthouse), not Google's official field verdict.</p>`)

  const smallPrintParts: string[] = []
  if (platform) smallPrintParts.push(`Detected platform: ${platform}`)
  if (data.seomator.status === "ok" && data.seomator.score != null) {
    smallPrintParts.push(`SEOmator score: ${data.seomator.score}`)
  }
  smallPrintParts.push(`Audited URL: ${data.url}`)
  footerNotes.push(`<p class="footer-note">${esc(smallPrintParts.join(" · "))}</p>`)

  const footerCard = card(footerNotes.join("\n"))

  const cards: string[] = [headerCard, snapshotCard, issuesCard]
  if (whatFixedCard) cards.push(whatFixedCard)
  cards.push(ctaCard, footerCard)

  return buildDoc(title, css, cards)
}

function buildDoc(title: string, css: string, cards: string[]): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>${css}</style>
</head>
<body>
<div class="receipt">
<div class="rcpt-head">
<div class="wordmark">studio0rbit<span class="dot">.</span></div>
<div class="doc-type">Website &amp; Online-Presence Audit</div>
</div>
${cards.join("\n")}
<div class="rcpt-foot">
<div class="barcode"></div>
<div class="thanks">— Studio0rbit · Calgary —</div>
</div>
</div>
</body>
</html>`
}
