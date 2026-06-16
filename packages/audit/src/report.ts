import type { AuditData, FeatureKey, Grade, Tier } from "./types.js"

/**
 * Pure renderer: AuditData -> a self-contained, branded, mobile-first HTML
 * audit report (inline CSS, no build step). The collector owns every fact on
 * the page; this module only presents them. One command produces a sendable
 * .html — no per-prospect rebuild.
 */

const BRAND = {
  name: "Studio0rbit",
  tagline: "Calgary websites for local shops",
  contactEmail: "hello@studio0rbit.ca",
}

const GRADE_COLOR: Record<Grade, string> = {
  A: "#34d399", // emerald
  B: "#5eead4", // teal
  C: "#fbbf24", // amber
  D: "#fb923c", // orange
  F: "#f87171", // red
}

const TIER_LABEL: Record<Tier, string> = {
  "new-build": "New build recommended",
  rebuild: "Rebuild recommended",
  "tune-up": "Targeted tune-up",
  "care-or-decline": "In good shape",
  "blocked-unknown": "Needs manual review",
}

const GRADE_VERDICT: Record<Grade, string> = {
  A: "This site is already doing the fundamentals well.",
  B: "A solid site with a few worthwhile improvements.",
  C: "A working site that's leaving customers on the table.",
  D: "This site is actively costing you calls and customers.",
  F: "This site is failing the basics customers expect.",
}

/** Per-feature: the human label, and *why a missing one costs a local shop*. */
const FIX_DETAIL: Record<FeatureKey, { label: string; why: string }> = {
  clickToCall: {
    label: "Tap-to-call phone number",
    why: "Most visitors are on a phone. Without a tappable number, a ready-to-book customer has to copy-paste digits — many just leave.",
  },
  bookingLink: {
    label: "Online booking / appointment link",
    why: "Customers increasingly expect to book without calling. No booking link means lost after-hours bookings.",
  },
  addressOrMap: {
    label: "Address + map",
    why: "A clear address and map drives walk-ins and is a core local-SEO ranking signal for 'near me' searches.",
  },
  hours: {
    label: "Opening hours",
    why: "'Are they open right now?' is the #1 question. Missing hours sends people to a competitor who lists them.",
  },
  mobileViewport: {
    label: "Mobile-responsive layout",
    why: "The majority of local searches are on mobile. A non-responsive site looks broken and bleeds trust instantly.",
  },
  https: {
    label: "HTTPS / SSL security",
    why: "Browsers flag non-HTTPS sites as 'Not secure'. That warning scares off customers and hurts Google ranking.",
  },
  reviews: {
    label: "Reviews / social proof",
    why: "Star ratings and testimonials are what convince a first-time customer to choose you over the shop next door.",
  },
  contactForm: {
    label: "Contact form",
    why: "Not everyone wants to call. A simple form captures enquiries you'd otherwise never hear about.",
  },
  localBusinessJsonLd: {
    label: "LocalBusiness structured data",
    why: "Structured data helps Google show your name, hours, and rating directly in search — more clicks, free.",
  },
  ogTags: {
    label: "Link-preview (Open Graph) tags",
    why: "When someone shares your site on social or text, these make it show a proper title and image instead of a bare link.",
  },
  favicon: {
    label: "Favicon",
    why: "The little tab icon is a small polish signal — its absence quietly reads as 'unfinished'.",
  },
  menuSchema: {
    label: "Menu structured data",
    why: "Lets Google surface your menu items directly in search — valuable for cafes and restaurants.",
  },
}

/** Customer-impact priority: lost calls/bookings > local SEO > trust > polish. */
const FIX_PRIORITY: FeatureKey[] = [
  "mobileViewport", "clickToCall", "https", "bookingLink", "hours",
  "addressOrMap", "reviews", "contactForm", "localBusinessJsonLd",
  "menuSchema", "ogTags", "favicon",
]

const CATEGORY_LABEL: Record<string, string> = {
  performance: "Performance",
  seo: "SEO",
  accessibility: "Accessibility",
  conversion: "Conversion basics",
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string
  ))
}

function hostOf(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, "") } catch { return url }
}

function formatDate(iso: string): string {
  // Keep it deterministic + locale-free: YYYY-MM-DD.
  return iso.slice(0, 10)
}

/** Ranked list of missing features (targeted fixes), highest impact first. */
function rankedMissing(inv: Record<FeatureKey, boolean | "error">): FeatureKey[] {
  return FIX_PRIORITY.filter((k) => inv[k] === false)
}

function presentFeatures(inv: Record<FeatureKey, boolean | "error">): FeatureKey[] {
  return FIX_PRIORITY.filter((k) => inv[k] === true)
}

export function renderReport(data: AuditData): string {
  const host = hostOf(data.url)
  const date = formatDate(data.fetchedAt)
  const reachable = data.reachable
  const blocked = data.blocked

  // Headline state varies with reachability.
  let badge: string
  let badgeColor: string
  let verdict: string
  if (!reachable) {
    badge = "—"
    badgeColor = GRADE_COLOR.F
    verdict = "We couldn't find a working website at this address."
  } else if (blocked) {
    badge = "?"
    badgeColor = GRADE_COLOR.C
    verdict = "The site exists but blocked our automated check — a quick manual review is needed."
  } else {
    badge = data.grade.overall
    badgeColor = GRADE_COLOR[data.grade.overall]
    verdict = GRADE_VERDICT[data.grade.overall]
  }

  const tierLabel = TIER_LABEL[data.tier]
  const missing = reachable && !blocked ? rankedMissing(data.inventory) : []
  const present = reachable && !blocked ? presentFeatures(data.inventory) : []
  const topIssues = missing.slice(0, 3)
  const moreCount = Math.max(0, missing.length - topIssues.length)

  // Scorecard rows (only categories the collector actually produced).
  const scoreRows = Object.entries(data.grade.byCategory)
    .map(([k, g]) => `
        <div class="score">
          <span class="score-cat">${esc(CATEGORY_LABEL[k] ?? k)}</span>
          <span class="score-grade" style="color:${GRADE_COLOR[g]}">${g}</span>
        </div>`)
    .join("")

  const stackLine = data.stack.status === "ok" && data.stack.platform && data.stack.platform !== "unknown"
    ? `Built on <strong>${esc(data.stack.platform)}</strong>${data.stack.legacy ? " <span class=\"flag\">· ageing setup</span>" : ""}`
    : "Platform: not detected"

  const confidenceNote = data.grade.confidence === "partial"
    ? `<p class="note">Grade is a <strong>preliminary</strong> read. Performance &amp; Core Web Vitals data wasn't available for this scan — a full audit sharpens the score.</p>`
    : ""

  const issuesHtml = topIssues.length
    ? topIssues.map((k, i) => {
        const d = FIX_DETAIL[k]
        return `
        <div class="issue">
          <div class="issue-num">${i + 1}</div>
          <div class="issue-body">
            <h3>${esc(d.label)}</h3>
            <p class="why"><strong>Why it matters:</strong> ${esc(d.why)}</p>
            <p class="fix"><strong>The fix:</strong> Add ${esc(d.label.toLowerCase())} — included in every site we build.</p>
          </div>
        </div>`
      }).join("")
    : reachable && !blocked
      ? `<p class="note">No major conversion gaps found — the fundamentals are in place.</p>`
      : ""

  const presentHtml = present.length
    ? `<div class="chips">${present.map((k) => `<span class="chip ok">✓ ${esc(FIX_DETAIL[k].label)}</span>`).join("")}</div>`
    : ""

  const honesty = reachable && !blocked && data.grade.overall === "A"
    ? `<p class="note">Honest take: this site is already strong. You likely don't need a rebuild — just keep it maintained.</p>`
    : ""

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Website Audit · ${esc(host)} · ${BRAND.name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
<style>
  :root {
    --bg: #0b1020; --panel: #141a2e; --panel-2: #1b2238;
    --fg: #e8ecf6; --muted: #9aa6c4; --line: #283150; --accent: #7c9cff;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--bg); color: var(--fg);
    font-family: "Inter", system-ui, sans-serif; line-height: 1.55;
    -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 720px; margin: 0 auto; padding: 24px 20px 64px; }
  h1, h2, h3, .grade-badge { font-family: "Space Grotesk", "Inter", sans-serif; }
  .topbar { display: flex; align-items: center; justify-content: space-between; padding-bottom: 20px; border-bottom: 1px solid var(--line); }
  .brand { font-family: "Space Grotesk"; font-weight: 700; letter-spacing: -0.02em; font-size: 18px; }
  .brand span { color: var(--accent); }
  .kicker { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; }
  .hero { display: flex; gap: 20px; align-items: center; margin: 28px 0 8px; flex-wrap: wrap; }
  .grade-badge {
    width: 92px; height: 92px; flex: none; border-radius: 20px; display: grid; place-items: center;
    font-size: 48px; font-weight: 700; background: var(--panel-2); border: 2px solid currentColor;
  }
  .hero-text h1 { margin: 0 0 4px; font-size: 24px; letter-spacing: -0.02em; word-break: break-word; }
  .hero-text .verdict { margin: 0; color: var(--fg); font-size: 16px; }
  .pill { display: inline-block; margin-top: 8px; padding: 4px 12px; border-radius: 999px; background: var(--panel-2); border: 1px solid var(--line); color: var(--muted); font-size: 13px; font-weight: 500; }
  .stack { color: var(--muted); font-size: 14px; margin: 10px 0 0; }
  .flag { color: #fb923c; }
  .note { color: var(--muted); font-size: 14px; background: var(--panel); border: 1px solid var(--line); border-left: 3px solid var(--accent); padding: 12px 14px; border-radius: 8px; }
  section { margin-top: 36px; }
  section > h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); margin: 0 0 14px; }
  .scorecard { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .score { display: flex; align-items: center; justify-content: space-between; background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; }
  .score-cat { font-size: 14px; }
  .score-grade { font-size: 26px; font-weight: 700; font-family: "Space Grotesk"; }
  .issue { display: flex; gap: 14px; background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 16px; margin-bottom: 12px; }
  .issue-num { flex: none; width: 28px; height: 28px; border-radius: 8px; background: var(--accent); color: #0b1020; font-weight: 700; display: grid; place-items: center; font-family: "Space Grotesk"; }
  .issue-body h3 { margin: 2px 0 6px; font-size: 17px; }
  .issue-body p { margin: 4px 0; font-size: 14px; color: var(--muted); }
  .issue-body .fix { color: var(--fg); }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .chip { font-size: 13px; padding: 5px 11px; border-radius: 999px; background: var(--panel); border: 1px solid var(--line); color: var(--muted); }
  .chip.ok { color: #7ee2b8; border-color: #1f4a3a; }
  .cta { background: linear-gradient(135deg, #1b2238, #141a2e); border: 1px solid var(--line); border-radius: 16px; padding: 24px; text-align: center; }
  .cta h2 { color: var(--fg); text-transform: none; letter-spacing: -0.01em; font-size: 20px; margin: 0 0 8px; }
  .cta p { color: var(--muted); margin: 0 0 16px; font-size: 15px; }
  .btn { display: inline-block; background: var(--accent); color: #0b1020; font-weight: 600; text-decoration: none; padding: 12px 22px; border-radius: 10px; }
  footer { margin-top: 40px; padding-top: 18px; border-top: 1px solid var(--line); color: var(--muted); font-size: 12px; }
  @media (max-width: 480px) { .scorecard { grid-template-columns: 1fr; } .grade-badge { width: 76px; height: 76px; font-size: 40px; } }
</style>
</head>
<body>
  <div class="wrap">
    <div class="topbar">
      <div class="brand">Studio<span>0rbit</span></div>
      <div class="kicker">Website Audit</div>
    </div>

    <div class="hero">
      <div class="grade-badge" style="color:${badgeColor}">${esc(badge)}</div>
      <div class="hero-text">
        <h1>${esc(host)}</h1>
        <p class="verdict">${esc(verdict)}</p>
        <span class="pill">${esc(tierLabel)}</span>
      </div>
    </div>
    <p class="stack">${stackLine}</p>
    ${confidenceNote}
    ${honesty}

    ${scoreRows ? `<section><h2>Scorecard</h2><div class="scorecard">${scoreRows}</div></section>` : ""}

    ${reachable && !blocked ? `<section><h2>${topIssues.length ? "Top priorities" : "Conversion basics"}</h2>${issuesHtml}${moreCount ? `<p class="note">+ ${moreCount} more improvement${moreCount > 1 ? "s" : ""} identified in the full audit.</p>` : ""}</section>` : ""}

    ${present.length ? `<section><h2>Already in place</h2>${presentHtml}</section>` : ""}

    ${!reachable ? `<section><h2>What this means</h2><p class="note">There's no working website at this address — so every customer who searches for you finds nothing (or a competitor). A clean, fast, mobile-first site is the highest-leverage thing you can add.</p></section>` : ""}

    <section>
      <div class="cta">
        <h2>Want the fixed version?</h2>
        <p>We build fast, mobile-first sites for Calgary local shops — every fix above, done right, one-time fee, you own everything.</p>
        <a class="btn" href="mailto:${esc(BRAND.contactEmail)}?subject=Website%20for%20${esc(host)}">Get a quote</a>
      </div>
    </section>

    <footer>
      Prepared by ${esc(BRAND.name)} · ${esc(BRAND.tagline)} · ${esc(date)}.<br />
      Automated triage of publicly available pages. Performance figures, where shown, are indicative lab data — not Google's official field verdict. Not affiliated with Google.
    </footer>
  </div>
</body>
</html>`
}
