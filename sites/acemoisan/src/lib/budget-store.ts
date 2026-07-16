// Ace-Budget — local-first budget tracker.
// v2 mirrors the user's "The Measure of a Plan" spreadsheet: their exact expense
// + income categories, per-category monthly budget targets, per-transaction
// entries (date / vendor / amount / category / note), and target-vs-actual
// variance. Savings = income − expenses. Everything in localStorage, no backend.

export type EntryType = "income" | "expense";

export interface BudgetEntry {
  id: string;
  date: string; // YYYY-MM-DD (local)
  type: EntryType;
  amount: number; // always positive; `type` gives the sign
  category: string;
  label?: string; // vendor / source
  note?: string;
  ts: number;
}

export interface BudgetUi {
  order: string[]; // section keys, top-to-bottom
  collapsed: string[]; // collapsed section keys
}

export interface BudgetState {
  currency: string; // symbol, e.g. "$"
  monthlyBudget: number; // legacy overall target (0 = derive from category targets)
  categories: { income: string[]; expense: string[] };
  targets: Record<string, number>; // category -> monthly $ target
  entries: BudgetEntry[];
  ui: BudgetUi;
}

export const SECTION_KEYS = ["thismonth", "entries", "calendar", "whereitwent"] as const;

export const BUDGET_KEY = "acebudget:v1";

// The user's categories, straight from their spreadsheet's Category Setup tab.
export const DEFAULT_CATEGORIES = {
  expense: [
    "Dates & Entertainment 🎞📅",
    "Groceries 🛒",
    "Kitties 😸",
    "Gas ⛽️",
    "Home maintenance 🏡",
    "Individual Spending 💰",
    "Debt 🪙",
    "Jaidens Money 💰",
    "Aidans Money 💰",
    "Fast Food 🍔",
    "Liquor 🍷",
    "Parking",
    "Other 🛠",
  ],
  income: ["Job", "Side project", "Other"],
};

// The user's monthly budget targets (Budget Targets tab, column G).
export const DEFAULT_TARGETS: Record<string, number> = {
  "Dates & Entertainment 🎞📅": 600,
  "Groceries 🛒": 600,
  "Kitties 😸": 140,
  "Gas ⛽️": 150,
  "Home maintenance 🏡": 50,
  "Individual Spending 💰": 0,
  "Debt 🪙": 0,
  "Jaidens Money 💰": 100,
  "Aidans Money 💰": 100,
  "Fast Food 🍔": 80,
  "Liquor 🍷": 100,
  "Parking": 0,
  "Other 🛠": 0,
};

// The pre-v2 default expense set — used to detect an untouched v1 state so we can
// upgrade it to the user's real categories without clobbering a customised one.
const V1_DEFAULT_EXPENSE = ["Groceries", "Rent", "Dining", "Transport", "Bills", "Shopping", "Health", "Fun", "Other"];

export function defaultUi(): BudgetUi {
  return { order: [...SECTION_KEYS], collapsed: [] };
}

export function defaultBudgetState(): BudgetState {
  return {
    currency: "$",
    monthlyBudget: 0,
    categories: { income: [...DEFAULT_CATEGORIES.income], expense: [...DEFAULT_CATEGORIES.expense] },
    targets: { ...DEFAULT_TARGETS },
    entries: [],
    ui: defaultUi(),
  };
}

/** Normalise a saved order: keep known keys in saved order, append any missing. */
export function normalizeOrder(order: string[] | undefined): string[] {
  const known = new Set<string>(SECTION_KEYS);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const k of order ?? []) if (known.has(k) && !seen.has(k)) { out.push(k); seen.add(k); }
  for (const k of SECTION_KEYS) if (!seen.has(k)) out.push(k);
  return out;
}

function sameSet(a: string[] | undefined, b: string[]): boolean {
  if (!a || a.length !== b.length) return false;
  return a.every((x, i) => x === b[i]);
}

export function loadBudget(): BudgetState {
  if (typeof localStorage === "undefined") return defaultBudgetState();
  try {
    const raw = localStorage.getItem(BUDGET_KEY);
    if (!raw) return defaultBudgetState();
    const p = JSON.parse(raw) as Partial<BudgetState>;
    const d = defaultBudgetState();

    // Upgrade an untouched v1 state (my old placeholder categories) to the
    // user's real spreadsheet categories + targets.
    const untouched = sameSet(p.categories?.expense, V1_DEFAULT_EXPENSE);
    const categories = !p.categories || untouched
      ? d.categories
      : {
          income: p.categories.income?.length ? p.categories.income : d.categories.income,
          expense: p.categories.expense?.length ? p.categories.expense : d.categories.expense,
        };
    const targets = !p.targets || untouched ? { ...DEFAULT_TARGETS, ...(p.targets ?? {}) } : p.targets;

    return {
      currency: p.currency || d.currency,
      monthlyBudget: typeof p.monthlyBudget === "number" ? p.monthlyBudget : 0,
      categories,
      targets,
      entries: Array.isArray(p.entries) ? p.entries : [],
      ui: { order: normalizeOrder(p.ui?.order), collapsed: Array.isArray(p.ui?.collapsed) ? p.ui!.collapsed : [] },
    };
  } catch {
    return defaultBudgetState();
  }
}

export function saveBudget(state: BudgetState): void {
  try {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(state));
  } catch {
    /* storage full / disabled */
  }
}

const pad = (n: number) => String(n).padStart(2, "0");
export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
export function todayKey(): string {
  return dateKey(new Date());
}
export function parseKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export interface Sums {
  income: number;
  expense: number;
  net: number;
}
export function sumEntries(entries: BudgetEntry[]): Sums {
  let income = 0, expense = 0;
  for (const e of entries) {
    if (e.type === "income") income += e.amount;
    else expense += e.amount;
  }
  return { income, expense, net: income - expense };
}

export function entriesForDay(state: BudgetState, key: string): BudgetEntry[] {
  return state.entries.filter((e) => e.date === key);
}
export function entriesForMonth(state: BudgetState, year: number, month0: number): BudgetEntry[] {
  const prefix = `${year}-${pad(month0 + 1)}`;
  return state.entries.filter((e) => e.date.startsWith(prefix));
}

/** Sum of all per-category monthly targets (the overall monthly budget). */
export function totalTarget(state: BudgetState): number {
  return Object.values(state.targets).reduce((a, b) => a + (b || 0), 0);
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
export function uid(prefix = "b"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
