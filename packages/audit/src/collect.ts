import type { AuditData, PsiProbe, SeomatorProbe, StackProbe, FeatureKey } from "./types.js"
import { computeGrade, mapTier, RUBRIC_VERSION, type GradeInputs } from "./rubric.js"

export interface AssembleInput {
  url: string
  fetchedAt: string
  reachable: boolean
  /** Reachable but not a usable 2xx page (403 challenge / 5xx). Optional for
   *  back-compat; defaults to false. */
  blocked?: boolean
  vertical?: string
  psi: PsiProbe
  seomator: SeomatorProbe
  inventory: Record<FeatureKey, boolean | "error">
  stack: StackProbe
}

function deriveFixes(inv: Record<FeatureKey, boolean | "error">, psi: PsiProbe): { targeted: string[]; general: string[] } {
  const labels: Record<FeatureKey, string> = {
    mobileViewport: "Add a mobile-responsive layout",
    clickToCall: "Add click-to-call (tap-to-dial) phone link",
    bookingLink: "Add an online booking/appointment link",
    hours: "Publish opening hours",
    addressOrMap: "Add address + map (local SEO)",
    reviews: "Surface reviews / social proof",
    localBusinessJsonLd: "Add LocalBusiness structured data (JSON-LD)",
    menuSchema: "Add Menu structured data",
    https: "Move to HTTPS (SSL)",
    ogTags: "Add Open Graph tags for link previews",
    contactForm: "Add a contact form",
    favicon: "Add a favicon",
  }
  const targeted = (Object.keys(inv) as FeatureKey[]).filter((k) => inv[k] === false).map((k) => labels[k])
  const general = (psi.failedAudits ?? []).slice(0, 5)
  return { targeted, general }
}

export function assembleAudit(input: AssembleInput): AuditData {
  const structuralFlags = {
    notMobile: input.inventory.mobileViewport === false,
    deadPlatform: input.stack.legacy === true,
    brokenIa: false,
  }

  const gradeInputs: GradeInputs = {
    psiMobilePerf: input.psi.status === "ok" ? input.psi.mobile?.performance : undefined,
    psiSeo: input.psi.status === "ok" ? input.psi.mobile?.seo : undefined,
    psiA11y: input.psi.status === "ok" ? input.psi.mobile?.accessibility : undefined,
    cwvPass: input.psi.status === "ok" ? input.psi.cwv?.pass : undefined,
    seomatorScore: input.seomator.status === "ok" ? input.seomator.score : undefined,
    vertical: input.vertical,
    inventory: input.inventory,
    structuralFlags,
  }

  const blocked = input.blocked ?? false
  const grade = computeGrade(gradeInputs)
  const structural = structuralFlags.notMobile || structuralFlags.deadPlatform || structuralFlags.brokenIa
  const tier = mapTier(grade, input.reachable, structural, blocked)

  return {
    url: input.url,
    fetchedAt: input.fetchedAt,
    rubricVersion: RUBRIC_VERSION,
    reachable: input.reachable,
    blocked,
    vertical: input.vertical,
    psi: input.psi,
    seomator: input.seomator,
    inventory: input.inventory,
    stack: input.stack,
    grade,
    tier,
    fixes: deriveFixes(input.inventory, input.psi),
  }
}
