// Shared audit runner — one collection path used by both the CLI (`cli.ts`)
// and the before→after diff (`diff.ts`), so the two never drift.
import { fetchHtml } from "./probes/fetchPage.js"
import { runPsiProbe } from "./probes/psi.js"
import { runSeomatorProbe } from "./probes/seomator.js"
import { inventoryFromHtml } from "./inventory.js"
import { detectStack } from "./stack.js"
import { assembleAudit } from "./collect.js"
import type { AuditData, FeatureKey, StackProbe } from "./types.js"

export const ALL_FEATURE_KEYS: FeatureKey[] = [
  "mobileViewport", "clickToCall", "bookingLink", "hours", "addressOrMap",
  "reviews", "localBusinessJsonLd", "menuSchema", "https", "ogTags",
  "contactForm", "favicon",
]

/** Collect a full audit for one URL. `key` defaults to PSI_API_KEY from env.
 *  `samples` = how many PSI runs to median (defaults to PSI_SAMPLES env or 1);
 *  bump it (e.g. 3) where you make before/after claims, since lab scores vary. */
export async function runAudit(
  url: string,
  vertical?: string,
  key: string = process.env.PSI_API_KEY ?? "",
  samples: number = Number(process.env.PSI_SAMPLES) || 1,
): Promise<AuditData> {
  const fetchedAt = new Date().toISOString()
  const page = await fetchHtml(url)
  // blocked = server responded but not a usable 2xx page (e.g. 403 challenge).
  const blocked = page.reachable && !page.ok
  const inspectable = page.reachable && page.ok
  const unavailable = blocked ? `blocked (HTTP ${page.status})` : page.error ?? "unreachable"

  const inventory: Record<FeatureKey, boolean | "error"> = inspectable
    ? inventoryFromHtml(page.html, page.finalUrl)
    : (Object.fromEntries(ALL_FEATURE_KEYS.map((k) => [k, "error"])) as Record<FeatureKey, boolean | "error">)

  const stack: StackProbe = inspectable
    ? { status: "ok", ...detectStack(page.html) }
    : { status: "error", error: unavailable }

  const [psi, seomator] = await Promise.all([
    inspectable && key ? runPsiProbe(url, key, samples) : Promise.resolve({ status: "error" as const, error: inspectable ? "no PSI_API_KEY" : unavailable }),
    inspectable ? runSeomatorProbe(url) : Promise.resolve({ status: "error" as const, error: unavailable }),
  ])

  return assembleAudit({ url, fetchedAt, reachable: page.reachable, blocked, vertical, psi, seomator, inventory, stack })
}
