#!/usr/bin/env node
// Assemble a client handoff (data JSON + receipt HTML) from a tiny FACTS file —
// the values a Deliver run already produces (live URL, host site, Storyblok
// space, store URL) — and auto-derive the honest before→after PageSpeed numbers
// from the saved audit JSONs. Zero hand-typed prose per client.
//
// Usage:
//   node scripts/build-handoff.mjs docs/handoff/<slug>.facts.json
// Writes:
//   docs/handoff/<slug>.handoff.json   (the data, for review/edits)
//   docs/handoff/<slug>-handoff.html   (the receipt page, via render-handoff)
//
// FACTS shape (only `client` + `slug` required; everything else optional):
//   client, slug, date, statusTag, liveUrl, hostSite, hostDashboard, storyblokSpace,
//   storySlug, storeUrl, storeLabel, oldAuditHost, newAuditHost, beforeScore,
//   afterScore, a11yGrade, rating, formInbox, host="Cloudflare Pages", cms="Storyblok",
//   usedClientImagery=true, footer, lead/notes/links/... (any handoff field
//   present in FACTS overrides the generated default).

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderHandoff } from "./render-handoff.mjs";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Read a saved audit JSON by host if present; else null. */
function readAudit(host) {
  if (!host) return null;
  const p = join(REPO, "packages", "audit", `audit-${host}.json`);
  if (!existsSync(p)) return null;
  try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; }
}

export function buildHandoffData(facts) {
  if (!facts?.client || !facts?.slug) throw new Error("facts need at least { client, slug }");
  const f = facts;
  const client = f.client;
  const host = f.host || "Cloudflare Pages";
  const cms = f.cms || "Storyblok";

  // --- derive honest before→after PageSpeed from saved audits (or FACTS) ---
  const oldA = readAudit(f.oldAuditHost);
  const newA = readAudit(f.newAuditHost);
  const before = f.beforeScore ?? oldA?.psi?.mobile?.performance ?? null;
  const after = f.afterScore ?? newA?.psi?.mobile?.performance ?? null;
  const a11y = f.a11yGrade ?? newA?.grade?.byCategory?.accessibility ?? null;
  const scoreStr = before != null && after != null ? `${before}→${after}` : null;

  // --- stats (only the ones we can stand behind) ---
  // FACTS `stats` wins when present (e.g. median-of-3 PageSpeed, a grade jump);
  // otherwise derive a sensible default from the saved audits.
  const stats = f.stats ?? (() => {
    const s = [];
    if (scoreStr) s.push({ n: scoreStr, l: "PageSpeed (mobile)" });
    if (a11y) s.push({ n: a11y, l: "Accessibility" });
    if (f.rating) s.push({ n: `${f.rating}★`, l: "Reviews shown" });
    return s;
  })();

  // --- lead / results paragraphs ---
  const imagery = f.usedClientImagery === false ? "" : " — using **your own product photography**";
  const storeClause = f.storeUrl ? ", and it links directly into your shop for every purchase, so **nothing about your checkout changes.**" : ".";
  const speedClause = scoreStr ? `On Google's PageSpeed test it went from **${scoreStr}** on mobile` : "It's now a fast, static site";
  const a11yClause = a11y ? `, earned **${a11y} for accessibility**,` : ",";
  const lead = f.lead ?? [
    `Your new **${client}** site is **live**. We rebuilt your homepage as a fast, static site${imagery}${storeClause}`,
    `${speedClause}${a11yClause} added proper search structured data, and now has a working contact form. It's a one-time build — **you own every account.** Everything you need is below.`,
  ];

  // --- links ---
  const sb = f.storyblokSpace ? `https://app.storyblok.com/#/me/spaces/${f.storyblokSpace}` : null;
  // Host dashboard: explicit override wins; else derive a deep link only for Netlify
  // (Cloudflare project URLs need an account id we don't keep in FACTS — omit the link).
  const hostDash = f.hostDashboard ?? (f.hostSite && /netlify/i.test(host) ? `https://app.netlify.com/projects/${f.hostSite}` : null);
  const links = f.links ?? [
    f.liveUrl && { k: "Live site", label: (f.liveUrl || "").replace(/^https?:\/\//, ""), href: f.liveUrl },
    sb && { k: "Edit content", label: `${cms} → “${f.storySlug || f.slug}”`, href: sb },
    hostDash && { k: "Hosting / deploys", label: `${host} dashboard`, href: hostDash },
    { k: "Form messages", label: f.formInbox ? `emailed to ${f.formInbox} (Web3Forms)` : "emailed to you via Web3Forms" },
    f.storeUrl && { k: "Your store", label: f.storeLabel || f.storeUrl.replace(/^https?:\/\//, ""), href: f.storeUrl },
  ].filter(Boolean);

  // --- accounts / ownership ---
  const accounts = f.accounts ?? [
    { name: `Hosting — ${host}`, ref: f.hostSite ? `site “${f.hostSite}”` : undefined, own: "→ invite your email as Admin, we step off" },
    { name: `CMS — ${cms} (free Starter plan)`, ref: f.storyblokSpace ? `space #${f.storyblokSpace}` : undefined, own: "→ invite your email as collaborator, reset password" },
    { name: "Contact form — Web3Forms", ref: f.formInbox ? `free; emails submissions to ${f.formInbox}` : "free; emails submissions instantly", own: "→ already capturing messages, verified working" },
    f.storeUrl
      ? { name: "Domain & store", ref: "already yours (existing site)", own: "→ unchanged; point it at the new site when ready (below)" }
      : { name: "Domain", ref: "yours at your registrar", own: "→ point it at the new site when ready (below)" },
  ];

  // --- edit steps ---
  const editSteps = f.editSteps ?? [
    `Sign in to [app.storyblok.com](https://app.storyblok.com) with your email (after the invite above).`,
    `Open your space → the **${f.storySlug || f.slug}** story.`,
    `Edit any text, price, link, or image — sections can be added, reordered, or removed.`,
    `Click **Publish** (not just Save). See the next box about edits going live.`,
    `Use **History** to restore any earlier version.`,
  ];

  // --- finishing steps (host-agnostic; domain cutover is one step, not a duplicate
  //     "Going Live" section — keeps the handoff short). Forms are Web3Forms, which
  //     already emails on submit, so there is no host-native "Forms" inbox step. ---
  const storeClauseFin = f.storeUrl
    ? " Your existing store stays where it is — the “Shop” buttons keep linking to it, so checkout is unchanged."
    : "";
  const finishingSteps = f.finishingSteps ?? [
    { title: "1 · Point your domain at the new site", body: `Your web address stays exactly the same — we just aim it at the new site. **Zero downtime:** the old site stays live until you approve, then we cut over and your email keeps working untouched. The move is two small DNS records at your registrar — **we do it for you in ~5 minutes** once you tell us where the domain is registered and where email is hosted.${storeClauseFin}` },
    { title: "2 · Make edits go live automatically", body: `Today an edit shows up after a quick redeploy. To make ${cms} Publish auto-update the site in ~1 minute, we connect the site’s repo + a build hook + a ${cms} webhook — ~10 minutes, then it’s hands-off.` },
  ];

  // --- going live: only when a FACTS file explicitly provides it (no auto-default —
  //     domain cutover already lives in finishingSteps above). ---
  const goingLive = f.goingLive ?? null;

  // --- good-to-know notes ---
  const speedNote = scoreStr
    ? `**Honest on speed.** We quote the PageSpeed score (${scoreStr}) and the move to a fast static stack — not a “seconds” figure, since Google’s lab numbers aren’t real-user data.`
    : `**Honest on speed.** We quote the PageSpeed score and the move to a fast static stack — not a lab “seconds” figure.`;
  const notes = f.notes ?? [
    f.usedClientImagery === false ? null : "**Real photos, your own.** The images come from your existing site — swap any of them in your CMS.",
    "**No fake details.** We didn’t invent contact info you don’t publish; the trust signals are real photos, reviews, and your socials.",
    speedNote,
  ].filter(Boolean);

  return {
    client,
    slug: f.slug,
    date: f.date,
    statusTag: f.statusTag || "LIVE",
    lead, stats, links,
    ownershipIntro: f.ownershipIntro || "Right now both accounts sit under our setup email so we could build it for you. Transfer is by invite — never a shared password.",
    accounts, editSteps, finishingSteps, goingLive, notes,
    footer: f.footer || "— Studio0rbit · Calgary · Built for you —",
  };
}

// --- CLI ---------------------------------------------------------------------
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const factsPath = process.argv[2];
  if (!factsPath) {
    console.error("Usage: node scripts/build-handoff.mjs docs/handoff/<slug>.facts.json");
    process.exit(1);
  }
  const facts = JSON.parse(readFileSync(factsPath, "utf8"));
  const data = buildHandoffData(facts);
  const dataOut = join(REPO, "docs", "handoff", `${data.slug}.handoff.json`);
  const htmlOut = join(REPO, "docs", "handoff", `${data.slug}-handoff.html`);
  writeFileSync(dataOut, JSON.stringify(data, null, 2) + "\n");
  writeFileSync(htmlOut, renderHandoff(data));
  console.log(`wrote ${dataOut}`);
  console.log(`wrote ${htmlOut}`);
}
