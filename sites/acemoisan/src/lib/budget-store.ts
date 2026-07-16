// Ace-Budget — local-first budget tracker.
// Same local-first model as Ace-Macros: everything in localStorage under one
// key, no backend. Covered by the hub's shared backup (backup.ts exports all keys).

export type EntryType = "income" | "expense";

export interface BudgetEntry {
  id: string;
  date: string; // YYYY-MM-DD (local)
  type: EntryType;
  amount: number; // always positive; `type` gives the sign
  category: string;
  label?: string;
  note?: string;
  ts: number;
}

export interface BudgetState {
  currency: string; // symbol, e.g. "$"
  monthlyBudget: number; // 0 = no target
  categories: { income: string[]; expense: string[] };
  entries: BudgetEntry[];
}

export const BUDGET_KEY = "acebudget:v1";

export const DEFAULT_CATEGORIES = {
  income: ["Paycheck", "Freelance", "Gift", "Refund", "Other"],
  expense: ["Groceries", "Rent", "Dining", "Transport", "Bills", "Shopping", "Health", "Fun", "Other"],
};

export function defaultBudgetState(): BudgetState {
  return {
    currency: "$",
    monthlyBudget: 0,
    categories: { income: [...DEFAULT_CATEGORIES.income], expense: [...DEFAULT_CATEGORIES.expense] },
    entries: [],
  };
}

export function loadBudget(): BudgetState {
  if (typeof localStorage === "undefined") return defaultBudgetState();
  try {
    const raw = localStorage.getItem(BUDGET_KEY);
    if (!raw) return defaultBudgetState();
    const p = JSON.parse(raw) as Partial<BudgetState>;
    const d = defaultBudgetState();
    return {
      currency: p.currency || d.currency,
      monthlyBudget: typeof p.monthlyBudget === "number" ? p.monthlyBudget : 0,
      categories: {
        income: p.categories?.income?.length ? p.categories.income : d.categories.income,
        expense: p.categories?.expense?.length ? p.categories.expense : d.categories.expense,
      },
      entries: Array.isArray(p.entries) ? p.entries : [],
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

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
export function uid(prefix = "b"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
