#!/usr/bin/env node
// triage-prospects.mjs — deterministic triage of an Outscraper Google Maps export.
//
// WHAT IT DOES (same input -> same output, every run):
//   1. Parse the Outscraper CSV (tolerant of column-name variations).
//   2. Dedupe by a fixed key precedence (place_id -> name+address -> phone -> domain).
//   3. Classify has_website (social-only / booking-only links are NOT a real site).
//   4. Score each kept row from OBJECTIVE fields only (no "weak site" judgment — that
//      happens AFTER the audit, so triage stays reproducible).
//   5. Select the top-N audit queue by a deterministic sort.
//   6. Account for EVERY input row in a triage log (kept / dropped-by-reason / duplicate).
//
// USAGE:
//   node scripts/triage-prospects.mjs [path/to/export.csv]
//   (no arg -> picks the most recently modified .csv in leads/inbox/)
//
// OUTPUTS (in leads/triaged/):
//   <base>-ranked.csv   all kept prospects, scored + ranked
//   <base>-top20.csv    the audit queue (what the site-audit skill runs)
//   <base>-log.md       full disposition of every input row + config snapshot
//
// ITERATE THE PROCEDURE by editing the CONFIG block below, then re-running.

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'node:fs'
import { join, basename, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const INBOX = join(ROOT, 'leads', 'inbox')
const OUTDIR = join(ROOT, 'leads', 'triaged')

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — edit these to iterate the procedure. Versioned so changes are explicit.
// ─────────────────────────────────────────────────────────────────────────────
const CONFIG = {
  version: 1,
  topN: 20,

  // Area gate: drop rows whose city doesn't match (case-insensitive substring).
  // Empty array = no city gate. Postal prefixes, if set, also gate (e.g. ['T3C']).
  cityMustMatch: ['calgary'],
  postalPrefixes: [], // e.g. ['T3C','T2T'] to restrict tightly; [] = any

  // A "website" that is really just a social or booking profile = NO real site.
  socialDomains: ['facebook.com', 'instagram.com', 'linktr.ee', 'tiktok.com', 'twitter.com', 'x.com', 'yelp.com', 'linkedin.com'],
  bookingDomains: ['fresha.com', 'booksy.com', 'setmore.com', 'square.site', 'squareup.com', 'getsquire.com', 'vagaro.com', 'schedulicity.com', 'opentable.com', 'janeapp.com', 'mindbodyonline.com'],

  // Chains / franchises / non-fits — dropped (substring match on lowercased name).
  chains: [
    'starbucks', 'tim hortons', 'tims', "mcdonald", 'subway', 'great clips', 'supercuts',
    'first choice haircutters', 'dairy queen', 'a&w', "domino", 'pizza hut', 'pizza 73',
    'booster juice', 'second cup', 'jiffy lube', 'mr. lube', 'walmart', 'shoppers drug mart',
    'kfc', "wendy's", 'burger king', 'taco bell', 'panago', "denny's", 'orange theory', 'orangetheory',
    'gnc', 'sport clips', 'cost cutters', 'tcommunity natural', 'sephora', 'browns socialhouse',
  ],

  // category/type keyword -> our vertical (first match wins; order matters)
  verticalMap: [
    ['barber', 'barber'],
    ['nail', 'salon'],
    ['hair', 'salon'],
    ['salon', 'salon'],
    ['med spa', 'spa'], ['medspa', 'spa'], ['spa', 'spa'], ['beauty', 'spa'], ['esthetic', 'spa'], ['lash', 'spa'], ['massage', 'spa'],
    ['coffee', 'cafe'], ['cafe', 'cafe'], ['café', 'cafe'], ['espresso', 'cafe'], ['bakery', 'cafe'],
    ['dent', 'dental'], ['orthodont', 'dental'],
    ['gym', 'fitness'], ['fitness', 'fitness'], ['yoga', 'fitness'], ['pilates', 'fitness'], ['crossfit', 'fitness'], ['martial', 'fitness'],
    ['tattoo', 'tattoo'],
    ['plumb', 'plumber'],
    ['electric', 'electrician'],
    ['restaurant', 'restaurant'], ['dining', 'restaurant'], ['bistro', 'restaurant'], ['eatery', 'restaurant'],
    ['pizz', 'restaurant'], ['sushi', 'restaurant'], ['grill', 'restaurant'], ['pub', 'restaurant'], ['bar ', 'restaurant'],
    ['burger', 'restaurant'], ['taco', 'restaurant'], ['thai', 'restaurant'], ['ramen', 'restaurant'], ['pho', 'restaurant'],
  ],

  // Score weights (objective, pre-audit only).
  activeReviewsThreshold: 5, // reviews >= this => "active business"
  weights: {
    noRealWebsite: 3,   // has_website === false
    inVertical: 2,      // mapped to one of our verticals (proxy for local brick-and-mortar fit)
    active: 2,          // reviews >= activeReviewsThreshold
    lowRating: 1,       // rating present AND < 4.0
    reachable: 1,       // phone or email present
  },
  keepScore: 5, // rows scoring >= this are flagged "qualified" (per the playbook)
}

// ─────────────────────────────────────────────────────────────────────────────
// CSV parsing (dependency-free; handles quotes, escaped quotes, commas/newlines)
// ─────────────────────────────────────────────────────────────────────────────
function parseCsv(text) {
  const rows = []
  let row = [], field = '', i = 0, inQuotes = false
  // strip BOM
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1)
  while (i < text.length) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue }
        inQuotes = false; i++; continue
      }
      field += c; i++; continue
    }
    if (c === '"') { inQuotes = true; i++; continue }
    if (c === ',') { row.push(field); field = ''; i++; continue }
    if (c === '\r') { i++; continue }
    if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue }
    field += c; i++
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  if (!rows.length) return []
  const header = rows[0].map((h) => h.trim())
  return rows.slice(1)
    .filter((r) => r.some((v) => v && v.trim() !== ''))
    .map((r) => Object.fromEntries(header.map((h, idx) => [h, (r[idx] ?? '').trim()])))
}

// Tolerant column lookup: try a list of aliases, case-insensitive.
function pick(obj, aliases) {
  const keys = Object.keys(obj)
  for (const a of aliases) {
    const k = keys.find((k) => k.toLowerCase() === a.toLowerCase())
    if (k && obj[k] !== '') return obj[k]
  }
  return ''
}

const COLS = {
  name: ['name', 'title', 'business_name'],
  site: ['site', 'website', 'url'],
  phone: ['phone', 'phone_1', 'telephone', 'international_phone'],
  email: ['email', 'email_1'],
  rating: ['rating', 'reviews_average', 'average_rating'],
  reviews: ['reviews', 'reviews_count', 'review_count', 'user_ratings_total'],
  type: ['type', 'category', 'categories', 'subtypes', 'main_category'],
  address: ['full_address', 'address', 'formatted_address'],
  city: ['city', 'locality'],
  postal: ['postal_code', 'postal', 'zip'],
  placeId: ['place_id', 'google_id', 'cid', 'place_id_google'],
}

// ─────────────────────────────────────────────────────────────────────────────
// Classification helpers
// ─────────────────────────────────────────────────────────────────────────────
function hostnameOf(url) {
  if (!url) return ''
  let u = url.trim()
  if (!/^https?:\/\//i.test(u)) u = 'http://' + u
  try { return new URL(u).hostname.replace(/^www\./i, '').toLowerCase() } catch { return '' }
}

function classifyWebsite(site) {
  const host = hostnameOf(site)
  if (!host) return { hasWebsite: false, kind: 'none' }
  if (CONFIG.socialDomains.some((d) => host === d || host.endsWith('.' + d) || host.includes(d))) return { hasWebsite: false, kind: 'social_only' }
  if (CONFIG.bookingDomains.some((d) => host === d || host.endsWith('.' + d) || host.includes(d))) return { hasWebsite: false, kind: 'booking_only' }
  return { hasWebsite: true, kind: 'site', host }
}

function classifyVertical(typeStr) {
  const t = (typeStr || '').toLowerCase()
  for (const [kw, v] of CONFIG.verticalMap) if (t.includes(kw)) return v
  return 'unknown'
}

function isChain(name) {
  const n = (name || '').toLowerCase()
  return CONFIG.chains.find((c) => n.includes(c)) || null
}

function normName(s) { return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() }
function normPhone(s) { return (s || '').replace(/\D+/g, '') }

function dedupeKey(r) {
  if (r.placeId) return 'pid:' + r.placeId
  const na = normName(r.name) + '|' + normName(r.address)
  if (na.trim() !== '|') return 'na:' + na
  if (normPhone(r.phone)) return 'ph:' + normPhone(r.phone)
  if (r.web.host) return 'dom:' + r.web.host
  return 'name:' + normName(r.name)
}

function inArea(r) {
  if (CONFIG.cityMustMatch.length) {
    const city = (r.city || r.address || '').toLowerCase()
    if (!CONFIG.cityMustMatch.some((c) => city.includes(c))) return false
  }
  if (CONFIG.postalPrefixes.length) {
    const pc = (r.postal || '').toUpperCase().replace(/\s+/g, '')
    if (!CONFIG.postalPrefixes.some((p) => pc.startsWith(p.toUpperCase()))) return false
  }
  return true
}

function score(r) {
  const w = CONFIG.weights
  let s = 0
  const reasons = []
  if (!r.web.hasWebsite) { s += w.noRealWebsite; reasons.push(`+${w.noRealWebsite} no real website (${r.web.kind})`) }
  if (r.vertical !== 'unknown') { s += w.inVertical; reasons.push(`+${w.inVertical} in-vertical (${r.vertical})`) }
  if (r.reviewsNum >= CONFIG.activeReviewsThreshold) { s += w.active; reasons.push(`+${w.active} active (${r.reviewsNum} reviews)`) }
  if (r.ratingNum > 0 && r.ratingNum < 4) { s += w.lowRating; reasons.push(`+${w.lowRating} rating ${r.ratingNum}`) }
  if (normPhone(r.phone) || r.email) { s += w.reachable; reasons.push(`+${w.reachable} reachable`) }
  return { s, reasons }
}

// ─────────────────────────────────────────────────────────────────────────────
// CSV writing
// ─────────────────────────────────────────────────────────────────────────────
function csvCell(v) {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
}
function toCsv(headers, rows) {
  return [headers.join(','), ...rows.map((r) => headers.map((h) => csvCell(r[h])).join(','))].join('\n') + '\n'
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
function pickInput() {
  const arg = process.argv[2]
  if (arg) return arg
  if (!existsSync(INBOX)) throw new Error(`No input given and ${INBOX} does not exist. Drop the Outscraper CSV there.`)
  const csvs = readdirSync(INBOX).filter((f) => extname(f).toLowerCase() === '.csv').map((f) => join(INBOX, f))
  if (!csvs.length) throw new Error(`No .csv found in ${INBOX}. Drop the Outscraper export there.`)
  return csvs.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0]
}

function main() {
  const inputPath = pickInput()
  const raw = parseCsv(readFileSync(inputPath, 'utf8'))
  if (!raw.length) throw new Error(`Parsed 0 rows from ${inputPath}. Is it a valid CSV with a header row?`)

  // Normalize every row.
  const all = raw.map((o, idx) => {
    const r = {
      _idx: idx,
      name: pick(o, COLS.name),
      site: pick(o, COLS.site),
      phone: pick(o, COLS.phone),
      email: pick(o, COLS.email),
      rating: pick(o, COLS.rating),
      reviews: pick(o, COLS.reviews),
      type: pick(o, COLS.type),
      address: pick(o, COLS.address),
      city: pick(o, COLS.city),
      postal: pick(o, COLS.postal),
      placeId: pick(o, COLS.placeId),
    }
    r.ratingNum = parseFloat(r.rating) || 0
    r.reviewsNum = parseInt((r.reviews || '').replace(/[^\d]/g, ''), 10) || 0
    r.web = classifyWebsite(r.site)
    r.vertical = classifyVertical(r.type)
    return r
  })

  // Disposition pass — every row gets exactly one outcome.
  const seen = new Map()
  const kept = []
  const dropped = [] // {name, reason}
  for (const r of all) {
    const chain = isChain(r.name)
    if (chain) { dropped.push({ ...r, reason: `chain/franchise (${chain})` }); continue }
    if (!inArea(r)) { dropped.push({ ...r, reason: `out-of-area (${r.city || r.postal || '?'})` }); continue }
    const key = dedupeKey(r)
    if (seen.has(key)) { dropped.push({ ...r, reason: `duplicate of "${seen.get(key)}"` }); continue }
    seen.set(key, r.name)
    const { s, reasons } = score(r)
    kept.push({ ...r, score: s, scoreReasons: reasons, qualified: s >= CONFIG.keepScore })
  }

  // Deterministic ranking: score desc, reviews desc, name asc, placeId asc.
  kept.sort((a, b) =>
    b.score - a.score ||
    b.reviewsNum - a.reviewsNum ||
    a.name.localeCompare(b.name) ||
    a.placeId.localeCompare(b.placeId)
  )
  kept.forEach((r, i) => { r.rank = i + 1 })
  const top = kept.slice(0, CONFIG.topN)

  // Outputs
  if (!existsSync(OUTDIR)) mkdirSync(OUTDIR, { recursive: true })
  const base = basename(inputPath, extname(inputPath))

  const rankedHeaders = ['rank', 'name', 'vertical', 'has_website', 'website_kind', 'url', 'rating', 'reviews', 'phone', 'email', 'city', 'postal', 'score', 'qualified', 'place_id']
  const rankedRows = kept.map((r) => ({
    rank: r.rank, name: r.name, vertical: r.vertical, has_website: r.web.hasWebsite ? 'Y' : 'N', website_kind: r.web.kind,
    url: r.site, rating: r.rating, reviews: r.reviewsNum, phone: r.phone, email: r.email, city: r.city, postal: r.postal,
    score: r.score, qualified: r.qualified ? 'Y' : 'N', place_id: r.placeId,
  }))
  writeFileSync(join(OUTDIR, `${base}-ranked.csv`), toCsv(rankedHeaders, rankedRows))

  const auditHeaders = ['rank', 'name', 'vertical', 'audit_path', 'url', 'phone', 'score']
  const auditRows = top.map((r) => ({
    rank: r.rank, name: r.name, vertical: r.vertical,
    audit_path: r.web.hasWebsite ? 'collector' : 'new-build (no real site)',
    url: r.web.hasWebsite ? r.site : '', phone: r.phone, score: r.score,
  }))
  writeFileSync(join(OUTDIR, `${base}-top20.csv`), toCsv(auditHeaders, auditRows))

  // Triage log — accounts for every input row.
  const byReason = {}
  for (const d of dropped) { const k = d.reason.replace(/\(.*\)/, '').trim(); byReason[k] = (byReason[k] || 0) + 1 }
  const noSite = kept.filter((r) => !r.web.hasWebsite).length
  const qualified = kept.filter((r) => r.qualified).length
  const log = [
    `# Triage log — ${base}`,
    ``,
    `Source: \`${inputPath}\``,
    `Config version: ${CONFIG.version} · keepScore ≥ ${CONFIG.keepScore} · topN ${CONFIG.topN}`,
    ``,
    `## Disposition (every input row accounted for)`,
    `- Input rows: **${all.length}**`,
    `- Kept (deduped, in-area, not chain): **${kept.length}**`,
    `  - Qualified (score ≥ ${CONFIG.keepScore}): **${qualified}**`,
    `  - No real website (new-build path): **${noSite}**`,
    `- Dropped: **${dropped.length}**`,
    ...Object.entries(byReason).map(([k, n]) => `  - ${k}: ${n}`),
    `- Check: ${kept.length} kept + ${dropped.length} dropped = ${kept.length + dropped.length} (input ${all.length}) ${kept.length + dropped.length === all.length ? '✅' : '❌ MISMATCH'}`,
    ``,
    `## Audit queue (top ${CONFIG.topN})`,
    ...top.map((r) => `${r.rank}. **${r.name}** — ${r.vertical} — score ${r.score} — ${r.web.hasWebsite ? r.site : 'NO real site → new-build'} — _${r.scoreReasons.join(', ')}_`),
    ``,
    `## Dropped detail`,
    ...dropped.map((d) => `- ${d.name || '(no name)'} — ${d.reason}`),
    ``,
  ].join('\n')
  writeFileSync(join(OUTDIR, `${base}-log.md`), log)

  // Console summary
  console.log(`Triage: ${all.length} in → ${kept.length} kept (${qualified} qualified, ${noSite} no-site) → top ${top.length} queued.`)
  console.log(`Dropped ${dropped.length}: ${Object.entries(byReason).map(([k, n]) => `${k} ${n}`).join(', ') || '—'}`)
  console.log(`Wrote: ${base}-ranked.csv, ${base}-top20.csv, ${base}-log.md → ${OUTDIR}`)
  if (kept.length + dropped.length !== all.length) { console.error('WARNING: disposition mismatch — some rows unaccounted for.'); process.exit(1) }
}

main()
