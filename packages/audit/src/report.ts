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
  if (grade === "A" || grade === "B") return "#16a34a"
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

  // --- CSS ---
  const css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f3f4f6;
      color: #111827;
      padding: 32px 16px;
      font-size: 15px;
      line-height: 1.6;
    }
    .card {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 2px 16px rgba(0,0,0,.08);
      max-width: 680px;
      margin: 0 auto 24px;
      padding: 36px 40px;
    }
    h1 { font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 4px; }
    h2 { font-size: 1.15rem; font-weight: 700; color: #111827; margin-bottom: 12px; }
    h3 { font-size: 1rem; font-weight: 700; color: #111827; margin-bottom: 4px; }
    .subtitle { color: #6b7280; font-size: 0.875rem; }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
    /* Snapshot */
    .snapshot { display: flex; align-items: flex-start; gap: 20px; }
    .grade-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      border-radius: 12px;
      font-size: 2.25rem;
      font-weight: 900;
      color: #ffffff;
      flex-shrink: 0;
    }
    .snapshot-body { flex: 1; }
    .tier-pill {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 2px 10px;
      border-radius: 999px;
      background: #f3f4f6;
      color: #374151;
      margin-bottom: 6px;
    }
    .verdict { font-size: 1rem; font-weight: 600; color: #111827; margin-bottom: 4px; }
    .confidence { font-size: 0.8125rem; color: #6b7280; }
    /* Issues */
    .issue { border-left: 4px solid #dc2626; padding-left: 16px; margin-bottom: 20px; }
    .issue-problem { font-weight: 700; color: #111827; margin-bottom: 2px; }
    .issue-cost { color: #374151; margin-bottom: 4px; font-size: 0.9375rem; }
    .issue-fix { font-size: 0.875rem; color: #16a34a; font-weight: 600; }
    /* Bullets */
    .bullet-list { list-style: none; padding: 0; }
    .bullet-list li { display: flex; gap: 10px; margin-bottom: 10px; align-items: flex-start; }
    .bullet-list li::before { content: "✓"; color: #16a34a; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
    /* CTA */
    .cta-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 20px 24px;
    }
    .cta-box p { color: #166534; }
    /* Status boxes */
    .info-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      padding: 20px 24px;
      color: #1e3a5f;
    }
    .warn-box {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 8px;
      padding: 20px 24px;
      color: #78350f;
    }
    /* Footer */
    .footer-note { font-size: 0.8125rem; color: #6b7280; line-height: 1.5; }
    .footer-note + .footer-note { margin-top: 8px; }
    a { color: #2563eb; }
  `

  // Helper for section card
  function card(content: string): string {
    return `<div class="card">${content}</div>`
  }

  // --- Header card ---
  const headerCard = card(`
    <h1>${title}</h1>
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
  footerNotes.push(`<p class="footer-note">Performance/Core Web Vitals figures are indicative lab measurements, not Google's official field verdict.</p>`)

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
<style>${css}</style>
</head>
<body>
${cards.join("\n")}
</body>
</html>`
}
