export type Grade = "A" | "B" | "C" | "D" | "F"
export type ProbeStatus = "ok" | "error"
export type Tier = "new-build" | "rebuild" | "tune-up" | "care-or-decline" | "blocked-unknown"

export interface ScoreSet {
  performance: number
  seo: number
  accessibility: number
  bestPractices: number
}

export interface CwvResult {
  lcpMs: number | null
  inpMs: number | null
  cls: number | null
  pass: boolean
}

export interface PsiProbe {
  status: ProbeStatus
  error?: string
  mobile?: ScoreSet
  desktop?: ScoreSet
  cwv?: CwvResult
  failedAudits?: string[]
}

export interface SeomatorProbe {
  status: ProbeStatus
  error?: string
  score?: number
  grade?: Grade
  categories?: Record<string, number>
}

export type FeatureKey =
  | "mobileViewport" | "clickToCall" | "bookingLink" | "hours"
  | "addressOrMap" | "reviews" | "localBusinessJsonLd" | "menuSchema"
  | "https" | "ogTags" | "contactForm" | "favicon"

export interface StackProbe {
  status: ProbeStatus
  error?: string
  platform?: string
  legacy?: boolean
}

export interface GradeResult {
  overall: Grade
  byCategory: Record<string, Grade>
  confidence: "high" | "partial"
}

export interface AuditData {
  url: string
  fetchedAt: string
  /** Rubric version that produced `grade` — lets the diff tool warn when two
   *  audits were graded by different rubric versions (avoids stale comparisons). */
  rubricVersion?: string
  reachable: boolean
  /** True when the server responded but not with a usable 2xx page (e.g. a 403
   *  bot-challenge or 5xx). The site exists, but we could NOT inspect the real
   *  page — its grade/inventory are not trustworthy; tier is "blocked-unknown". */
  blocked: boolean
  vertical?: string
  psi: PsiProbe
  seomator: SeomatorProbe
  inventory: Record<FeatureKey, boolean | "error">
  stack: StackProbe
  grade: GradeResult
  tier: Tier
  fixes: { targeted: string[]; general: string[] }
}
