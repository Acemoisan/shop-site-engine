#!/usr/bin/env node
// Render a Studio0rbit client handoff as a receipt-styled HTML page from a data file.
// The handoff twin of packages/audit/src/report.ts (which does the same for audits).
//
// Usage:
//   node scripts/render-handoff.mjs <data.json> [out.html]
//   (out defaults to docs/handoff/<slug>-handoff.html)
//
// Data shape (all fields optional except client): see docs/handoff/_handoff.example.json
// and the JSDoc on renderHandoff() below.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Tiny inline formatter: escapes HTML, then renders **bold**, [text](url), and `code`. */
function inline(s) {
  let t = esc(s);
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, txt, url) => `<a href="${url}">${txt}</a>`);
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/`([^`]+)`/g, '<span class="note">$1</span>');
  return t;
}

const RECEIPT_CSS = `
  :root {
    --ink:#14111f; --paper:#ffffff; --text:#1b1730; --muted:#726e89;
    --indigo:#5b4de3; --cyan:#1fbed4; --dash:#cdc9dd; --page:#0e0b16; --good:#0f9d63;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', system-ui, sans-serif; color: var(--text);
    background: var(--page);
    background-image: radial-gradient(72% 48% at 50% -8%, rgba(91,77,227,.45), transparent 70%);
    min-height: 100vh; padding: 40px 16px; font-size: 15px; line-height: 1.62;
    -webkit-font-smoothing: antialiased;
  }
  .receipt { position: relative; max-width: 640px; margin: 0 auto; background: var(--paper);
    box-shadow: 0 40px 90px -34px rgba(0,0,0,.75), 0 0 0 1px rgba(255,255,255,.05); }
  .receipt::before, .receipt::after { content: ""; position: absolute; left: 0; right: 0; height: 12px;
    background: radial-gradient(circle 7px at 11px 0, var(--page) 7px, transparent 8px) repeat-x; background-size: 22px 12px; }
  .receipt::before { top: 0; transform: rotate(180deg); }
  .receipt::after { bottom: 0; }
  .rcpt-head { text-align: center; padding: 42px 36px 10px; }
  .wordmark { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 1.05rem; letter-spacing: .3em; text-transform: uppercase; color: var(--ink); }
  .wordmark .dot { color: var(--indigo); }
  .doc-type { margin-top: 10px; font-family: 'Space Mono', monospace; font-size: .68rem; letter-spacing: .34em; text-transform: uppercase; color: var(--muted); }
  .meta { margin-top: 14px; font-family: 'Space Mono', monospace; font-size: .72rem; color: var(--muted); }
  .meta b { color: var(--ink); font-weight: 700; }
  .sec { padding: 24px 36px; }
  .sec + .sec { border-top: 1.5px dashed var(--dash); }
  h2 { font-family: 'Space Grotesk', sans-serif; font-size: .76rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--indigo); margin-bottom: 14px; }
  h3 { font-family: 'Space Grotesk', sans-serif; font-size: .95rem; font-weight: 600; color: var(--ink); margin-bottom: 3px; }
  p { margin-bottom: 10px; }
  p:last-child { margin-bottom: 0; }
  a { color: var(--indigo); }
  .lead { font-size: 1.02rem; line-height: 1.7; color: #2a2640; }
  .lead strong { color: var(--ink); }
  .stat-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
  .stat { flex: 1; min-width: 120px; border: 1.5px solid var(--dash); border-radius: 12px; padding: 12px 14px; text-align: center; }
  .stat .n { font-family: 'Space Grotesk', sans-serif; font-size: 1.3rem; font-weight: 700; color: var(--indigo); }
  .stat .l { font-family: 'Space Mono', monospace; font-size: .62rem; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin-top: 2px; }
  .line { display: flex; align-items: baseline; gap: 8px; padding: 7px 0; }
  .line + .line { border-top: 1px dotted var(--dash); }
  .line .k { font-family: 'Space Mono', monospace; font-size: .74rem; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); white-space: nowrap; }
  .line .leader { flex: 1; border-bottom: 1px dotted var(--dash); transform: translateY(-3px); }
  .line .v { text-align: right; word-break: break-word; }
  .line .v a { text-decoration: none; }
  .acct { padding: 12px 0; }
  .acct + .acct { border-top: 1px dotted var(--dash); }
  .acct .own { font-family: 'Space Mono', monospace; font-size: .72rem; color: var(--good); margin-top: 3px; }
  .acct .ref { font-family: 'Space Mono', monospace; font-size: .68rem; color: var(--muted); margin-top: 2px; }
  ol.steps { list-style: none; counter-reset: s; }
  ol.steps li { counter-increment: s; position: relative; padding-left: 30px; margin-bottom: 9px; }
  ol.steps li:last-child { margin-bottom: 0; }
  ol.steps li::before { content: counter(s); position: absolute; left: 0; top: 0; width: 20px; height: 20px; border-radius: 6px; background: rgba(91,77,227,.1); color: var(--indigo); font-family: 'Space Mono', monospace; font-size: .72rem; font-weight: 700; display: flex; align-items: center; justify-content: center; }
  ul.ticks { list-style: none; }
  ul.ticks li { display: flex; gap: 10px; margin-bottom: 8px; }
  ul.ticks li:last-child { margin-bottom: 0; }
  ul.ticks li::before { content: "✓"; color: var(--cyan); font-weight: 700; }
  .callout { background: rgba(91,77,227,.06); border: 1.5px solid rgba(91,77,227,.22); border-radius: 14px; padding: 18px 20px; }
  .callout + .callout { margin-top: 14px; }
  .callout h3 { color: var(--ink); }
  .note { font-family: 'Space Mono', monospace; font-size: .72rem; color: var(--muted); }
  .tag { display: inline-block; font-family: 'Space Mono', monospace; font-size: .62rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: 3px 10px; border-radius: 999px; background: rgba(31,190,212,.14); color: #0b7c8c; }
  .rcpt-foot { padding: 24px 36px 34px; border-top: 1.5px dashed var(--dash); text-align: center; }
  .barcode { height: 40px; max-width: 230px; margin: 6px auto 14px; background: repeating-linear-gradient(90deg, var(--ink) 0 2px, #fff 2px 4px, var(--ink) 4px 5px, #fff 5px 9px, var(--ink) 9px 11px, #fff 11px 14px); }
  .thanks { font-family: 'Space Mono', monospace; font-size: .7rem; letter-spacing: .2em; text-transform: uppercase; color: var(--ink); }
`;

/**
 * @param {object} d Handoff data:
 *   client (req), slug, brand="studio0rbit", docType, date, statusTag,
 *   lead: string[]  — results paragraphs (inline markdown ok)
 *   stats: {n,l}[]
 *   linksTitle, links: {k,label,href?}[]
 *   ownershipTitle, ownershipIntro, accounts: {name,ref?,own?}[]
 *   editTitle, editSteps: string[]
 *   finishingTitle, finishingSteps: {title,body}[]
 *   goingLiveTitle, goingLive: {intro?, options?: string[], note?}
 *   notesTitle, notes: string[]
 *   footer
 */
export function renderHandoff(d) {
  if (!d || !d.client) throw new Error("handoff data needs at least { client }");
  const sections = [];
  const sec = (html) => sections.push(`<section class="sec">${html}</section>`);

  if (d.lead?.length || d.stats?.length) {
    let h = `<h2>${esc(d.leadTitle || "The Short Version")}</h2>`;
    h += (d.lead || []).map((p) => `<p class="lead">${inline(p)}</p>`).join("");
    if (d.stats?.length) {
      h += `<div class="stat-row">${d.stats
        .map((s) => `<div class="stat"><div class="n">${esc(s.n)}</div><div class="l">${esc(s.l)}</div></div>`)
        .join("")}</div>`;
    }
    sec(h);
  }

  if (d.links?.length) {
    const rows = d.links
      .map((l) => {
        const v = l.href ? `<a href="${esc(l.href)}">${inline(l.label)}</a>` : inline(l.label);
        return `<div class="line"><span class="k">${esc(l.k)}</span><span class="leader"></span><span class="v">${v}</span></div>`;
      })
      .join("");
    sec(`<h2>${esc(d.linksTitle || "Your Site & Edit Links")}</h2>${rows}`);
  }

  if (d.accounts?.length) {
    const intro = d.ownershipIntro ? `<p class="note" style="margin-bottom:12px;">${inline(d.ownershipIntro)}</p>` : "";
    const blocks = d.accounts
      .map(
        (a) =>
          `<div class="acct"><h3>${inline(a.name)}</h3>${a.ref ? `<div class="ref">${esc(a.ref)}</div>` : ""}${
            a.own ? `<div class="own">${inline(a.own)}</div>` : ""
          }</div>`
      )
      .join("");
    sec(`<h2>${esc(d.ownershipTitle || "What You Own & How To Take It")}</h2>${intro}${blocks}`);
  }

  if (d.editSteps?.length) {
    const lis = d.editSteps.map((s) => `<li>${inline(s)}</li>`).join("");
    sec(`<h2>${esc(d.editTitle || "Editing Your Site")}</h2><ol class="steps">${lis}</ol>`);
  }

  if (d.finishingSteps?.length) {
    const boxes = d.finishingSteps
      .map((f) => `<div class="callout"><h3>${inline(f.title)}</h3><p class="note" style="margin-top:6px;">${inline(f.body)}</p></div>`)
      .join("");
    sec(`<h2>${esc(d.finishingTitle || "One-Time Finishing Steps")}</h2>${boxes}`);
  }

  if (d.goingLive && (d.goingLive.intro || d.goingLive.options?.length || d.goingLive.note)) {
    let h = `<h2>${esc(d.goingLiveTitle || "Going Live On Your Domain")}</h2>`;
    if (d.goingLive.intro) h += `<p>${inline(d.goingLive.intro)}</p>`;
    if (d.goingLive.options?.length) h += `<ul class="ticks">${d.goingLive.options.map((o) => `<li>${inline(o)}</li>`).join("")}</ul>`;
    if (d.goingLive.note) h += `<p class="note" style="margin-top:8px;">${inline(d.goingLive.note)}</p>`;
    sec(h);
  }

  if (d.notes?.length) {
    const lis = d.notes.map((n) => `<li>${inline(n)}</li>`).join("");
    sec(`<h2>${esc(d.notesTitle || "Good To Know")}</h2><ul class="ticks">${lis}</ul>`);
  }

  const brand = esc(d.brand || "studio0rbit");
  const metaBits = [d.client ? `<b>${esc(d.client)}</b>` : "", d.date ? esc(d.date) : "", d.statusTag ? `<span class="tag">${esc(d.statusTag)}</span>` : ""]
    .filter(Boolean)
    .join(" &nbsp;·&nbsp; ");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(d.client)} — Project Handoff · Studio0rbit</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>${RECEIPT_CSS}</style>
</head>
<body>
<div class="receipt">
<div class="rcpt-head">
<div class="wordmark">${brand}<span class="dot">.</span></div>
<div class="doc-type">${esc(d.docType || "Project Handoff & Ownership")}</div>
${metaBits ? `<div class="meta">${metaBits}</div>` : ""}
</div>
${sections.join("\n")}
<div class="rcpt-foot">
<div class="barcode"></div>
<div class="thanks">${esc(d.footer || "— Studio0rbit · Calgary · Built for you —")}</div>
</div>
</div>
</body>
</html>`;
}

// --- CLI ---------------------------------------------------------------------
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const dataPath = process.argv[2];
  if (!dataPath) {
    console.error("Usage: node scripts/render-handoff.mjs <data.json> [out.html]");
    process.exit(1);
  }
  const data = JSON.parse(readFileSync(dataPath, "utf8"));
  const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
  const out = process.argv[3] || join(repoRoot, "docs", "handoff", `${data.slug || "client"}-handoff.html`);
  writeFileSync(out, renderHandoff(data));
  console.log(`wrote ${out}`);
}
