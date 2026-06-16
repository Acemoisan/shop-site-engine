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

### Validation of the fixes — all confirmed (commit `261d573`)
- **berkshirehathaway.com** → SEOmator now `ok/92` in **12.4s** (was timing out). The single-page + `--no-cwv` config makes SEOmator usable on real light sites. Graded **D / rebuild** — *correct*: the site has no mobile viewport, so the foundation-strength override fires (no-mobile = structural → rebuild). Rubric working as designed.
- **gymshark.com** → now `reachable:true`, stack correctly = **shopify**, 7/12 features (was a false **new-build**). The browser-UA + blocked≠newbuild fix works. SEOmator still times out (heavy SPA, documented edge) but the site is no longer misclassified.
- **neverssl.com** → `https:false` correctly detected (HTTP-only). Its SEOmator `error` at 8.8s was the **temp-file concurrency collision** (my manual validation overlapped the loop's batch on the same URL) — see fix below.

### Round 2 fix — commit `7527a9c`
_(see also Round 3 below)_
- **SEOmator temp filename made unique** (`seomator-<pid>-<seq>-<hash>.json`). Two concurrent audits of the same URL previously shared a temp file and clobbered each other. Now concurrency-safe (matters for future batch runs). Unit suite still 23/23.

### Open items (for the user, not blocking)
- **Add `PSI_API_KEY`** for full performance/CWV grades + "high" confidence. The runner reads it from the environment automatically.
- **Heavy-SPA SEOmator timeout is inherent** and acceptable — the target audience (small local sites) audits fine. Sites like stripe will show `seomator:error` and grade on inventory only (flagged partial).
- **Task 11 remaining:** the `site-audit` skill + branded 1-page HTML report (presentation layer). Core collector mechanics are done + reviewed.

---

## 2026-06-16 ~00:24Z — Round 3 oversight (consistency check; 16→26 trials)

### Code evolved since round 2 — commit `f441e14` (by the active dev session)
- SEOmator timeout tightened to **45s** (secondary signal — degrade rather than hang); a `seomatorErrorMessage()` helper now surfaces "seomator timeout after Nms" distinctly from opaque failures.
- **fetchHtml gained transient-failure retry** (3 attempts, injectable fetch/sleep for tests): a received HTTP response is terminal (no retry), but a thrown fetch (connection reset / DNS blip) retries — motivated by gymshark's CDN resetting the first handshake.
- New tier **`blocked-unknown`**: a reachable-but-non-2xx page (blocked/challenge) is no longer graded as if trustworthy.
- Unit suite grew **23 → 30** (added `fetchPage.test.ts` for retry; new collect/seomator cases). All green.

### Loop health
- The trial loop had **died** (~71 min gap, last batch 23:12 → relaunched 00:24, pid 22059). Relaunched per oversight protocol; first batch confirmed healthy (example C/tune-up, berkshire D/rebuild — matching priors). Another session is also running ad-hoc trials; append-only logs + per-invocation temp files keep data intact.

### Consistency check (the headline) — rubric is deterministic ✓
Repeat audits of the same site with stable probe inputs gave **identical grades/tiers**:
- example.com ×3 → C/tune-up (SEOmator 94/93/93, ±1 jitter, grade stable)
- berkshirehathaway ×2 → D/rebuild · info.cern.ch ×2 → D/rebuild · techcrunch ×2 → D/rebuild (wordpress legacy) · dead URL ×2 → F/new-build
- Conclusion: the grade is a pure function of probe outputs — no rubric instability.

### Two instabilities found — BOTH probe-level, already fixed/explained (not the rubric)
1. **gymshark swung F/new-build ↔ D/rebuild across 5 runs.** Cause: its CDN intermittently resets the cold connection → "unreachable." Isolated fetch test with the new retry: **4/5 cold starts now succeed first try; 1/5 failed all 3 retries** (a full burst-block). So retry materially reduces flakiness but cannot fully beat an adversarial bot-protecting CDN. **Inherent to scraping such sites; outside the target profile** (small local shops don't run burst bot-blocking). Documented limitation — no further action.
2. **neverssl flipped F↔D.** Cause: the temp-file collision (now fixed, `7527a9c`). With unique temp names it consistently gets SEOmator ok → D.

### Verdict
Core mechanics are sound and consistent. The grade is deterministic; observed variance was entirely network/concurrency flakiness, both addressed. No new failure modes (no crashes across 26 trials). PSI still needs a key (psi:error expected). Task 11 (skill + HTML report) remains the only unbuilt piece.
