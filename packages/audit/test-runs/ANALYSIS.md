# Site-Audit Unattended Test — Analysis

Living log of what the unattended trials revealed and what was fixed. Raw data: `results/results.jsonl` + `results/summary.log`.

---

## 2026-06-15 ~22:51Z — First oversight pass (6 trials in)

### What works well (no changes needed)
- **Graceful degradation is solid.** Across every site, no crashes. Failed probes (PSI 429, SEOmator timeout, dead URL) were recorded as `status:"error"` and the audit still produced a grade/tier. This is the core reliability goal — confirmed.
- **Feature inventory + stack detection are fast and accurate on ALL sites** (including heavy ones):
  - techcrunch → `wordpress(legacy)`, 9/12 features. Correct.
  - squarespace → `squarespace`, 9/12. Correct.
  - stripe → 8/12 features. example.com → 3/12. dead URL → 0/12.
  - These answer the user's core ask ("what the site has / doesn't have / condition") reliably, even when the scoring probes fail.
- **Edge cases correct:** dead URL → F / new-build in 11ms; example.com → C / tune-up with SEOmator ok (94).

### Problems found
1. **SEOmator timed out (120s) on every heavy site** (stripe/techcrunch/squarespace all hit exactly the timeout → `sxo=error`). Confirmed empirically that even single-page + `--no-cwv` exceeds 70s on stripe/techcrunch — SEOmator link-checks every link, which scales with page size. It is fast (~5s) on small/simple pages.
2. **When BOTH score probes fail, grades are misleading.** With PSI 429 + SEOmator timeout, only the 12-point inventory drives the grade → **stripe.com graded D / rebuild** (absurd for a world-class site). The logic is correct given degraded inputs; the inputs were degraded. `confidence:"partial"` already flags this.
3. **gymshark → false "new-build"** (74ms, reachable:false). Bot protection (Cloudflare 403) blocked our fetch; a real business was misread as "no website."
4. **Keyless PSI = HTTP 429** on every call. Performance/CWV grading needs an API key.

### Root cause
The first test list (stripe, techcrunch, gymshark, squarespace, wix) was **not representative** — heavy modern SPAs, nothing like the lightweight Calgary local-shop sites this tool targets. The tool was being tested against the wrong profile.

### Fixes applied — commit `261d573`
- **SEOmator probe:** dropped `--crawl -m 25` → single-page audit (right scope for triage, faster on all sites); added `--no-cwv` (CWV comes from PSI; it's SEOmator's biggest time sink); timeout 120s → 90s.
- **Page fetch:** realistic Chrome User-Agent (the custom UA tripped bot protection); and a received HTTP response now means `reachable:true` (site exists) with a separate `ok` flag — a blocked/4xx/5xx page is no longer misclassified as new-build. True network/DNS failure still → unreachable → new-build.
- **Representative test list:** light real sites (berkshirehathaway, info.cern.ch, motherfuckingwebsite, neverssl) where SEOmator succeeds → meaningful full grades; kept techcrunch (heavy-site timeout edge + legacy detection), gymshark (bot-block fix test), and the dead URL.
- Unit suite still 23/23 green after the changes.

### Validation of the fixes
_(in progress — results appended on next pass; expected: berkshirehathaway SEOmator `ok` with a real grade; neverssl `https:false`; gymshark now `reachable:true` rather than new-build)_

### Open items (for the user, not blocking)
- **Add `PSI_API_KEY`** for full performance/CWV grades + "high" confidence. The runner reads it from the environment automatically.
- **Heavy-SPA SEOmator timeout is inherent** and acceptable — the target audience (small local sites) audits fine. Sites like stripe will show `seomator:error` and grade on inventory only (flagged partial).
- **Task 11 remaining:** the `site-audit` skill + branded 1-page HTML report (presentation layer). Core collector mechanics are done + reviewed.
