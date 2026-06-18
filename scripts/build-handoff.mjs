#!/usr/bin/env node
// Assemble a client handoff (data JSON + receipt HTML) from a tiny FACTS file —
// the values a Deliver run already produces (live URL, Netlify site, Storyblok
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
//   client, slug, date, statusTag, liveUrl, netlifySite, storyblokSpace,
//   storySlug, storeUrl, storeLabel, oldAuditHost, newAuditHost, beforeScore,
//   afterScore, a11yGrade, rating, formInbox, host="Netlify", cms="Storyblok",
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
  const host = f.host || "Netlify";
  const cms = f.cms || "Storyblok";

  // --- derive honest before→after PageSpeed from saved audits (or FACTS) ---
  const oldA = readAudit(f.oldAuditHost);
  const newA = readAudit(f.newAuditHost);
  const before = f.beforeScore ?? oldA?.psi?.mobile?.performance ?? null;
  const after = f.afterScore ?? newA?.psi?.mobile?.performance ?? null;
  const a11y = f.a11yGrade ?? newA?.grade?.byCategory?.accessibility ?? null;
  const scoreStr = before != null && after != null ? `${before}→${after}` : null;

  // --- stats (only the ones we can stand behind) ---
  const stats = [];
  if (scoreStr) stats.push({ n: scoreStr, l: "PageSpeed (mobile)" });
  if (a11y) stats.push({ n: a11y, l: "Accessibility" });
  if (f.rating) stats.push({ n: `${f.rating}★`, l: "Reviews shown" });

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
  const ntl = f.netlifySite ? `https://app.netlify.com/projects/${f.netlifySite}` : null;
  const links = f.links ?? [
    f.liveUrl && { k: "Live site", label: (f.liveUrl || "").replace(/^https?:\/\//, ""), href: f.liveUrl },
    sb && { k: "Edit content", label: `${cms} → “${f.storySlug || f.slug}”`, href: sb },
    ntl && { k: "Hosting / deploys", label: `${host} dashboard`, href: ntl },
    { k: "Form messages", label: `${host} → Forms → “contact”` },
    f.storeUrl && { k: "Your store", label: f.storeLabel || f.storeUrl.replace(/^https?:\/\//, ""), href: f.storeUrl },
  ].filter(Boolean);

  // --- accounts / ownership ---
  const accounts = f.accounts ?? [
    { name: `Hosting — ${host}`, ref: f.netlifySite ? `site “${f.netlifySite}”` : undefined, own: "→ invite your email as Admin, we step off" },
    { name: `CMS — ${cms} (free Starter plan)`, ref: f.storyblokSpace ? `space #${f.storyblokSpace}` : undefined, own: "→ invite your email as collaborator, reset password" },
    { name: `Contact form — ${host} Forms`, ref: `transfers with the ${host} site`, own: "→ already capturing messages, verified working" },
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

  // --- finishing steps ---
  const inbox = f.formInbox ? ` (e.g. ${f.formInbox})` : "";
  const finishingSteps = f.finishingSteps ?? [
    { title: "1 · Make edits go live automatically", body: `Today the site is a published build, so an edit shows up after a quick redeploy (${host} → Deploys → “Trigger deploy”). To make Publish auto-update the site in ~1 minute, we connect the site’s repo + a build hook + a ${cms} webhook — ~10 minutes, then it’s hands-off.` },
    { title: "2 · Get emailed when someone uses the form", body: `Messages are already saved in ${host} → Forms. To also be emailed, go to Forms → Settings & notifications → Add notification → Email, and enter the inbox you want${inbox}. We left the destination for you to choose.` },
  ];

  // --- going live ---
  const goingLive = f.goingLive ?? {
    intro: "The site is on a free `*.netlify.app` address so you can review it. When you’re ready to launch on your own domain:",
    options: f.storeUrl
      ? ["Point your domain at the new site, and move your existing store to a subdomain (e.g. **shop.yourdomain.com**) that the “Shop” buttons link to.", "Or keep the store where it is and launch the new site on a subdomain."]
      : ["Point your domain at the new site in your host’s Domain settings."],
    note: `In ${host}: Domain management → Add a domain → follow the DNS steps. HTTPS is automatic.`,
  };

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
