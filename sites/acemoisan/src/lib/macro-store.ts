// MacroFactor clone — local-first data store.
// Everything lives in the browser's localStorage under one namespaced key.
// No backend, no accounts. Shared by the app page and the home "today" widget,
// so the schema lives here once.

export interface Goals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// A named group of foods. Foods can be moved between catalogs freely.
export interface Catalog {
  id: string;
  name: string;
}

// A catalogued food, macros stated per ONE serving.
export interface Food {
  id: string;
  name: string;
  brand?: string;
  serving: number; // size of one serving in `unit`
  unit: string; // "g", "ml", "item", "scoop", …
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  catalogId: string; // which catalog it lives in
  icon?: string; // optional emoji shown on the entry
  custom?: boolean; // user-created (vs seed)
}

// A logged entry on a given day. Macros are the resolved totals for `qty`.
export interface Entry {
  id: string;
  foodId?: string;
  name: string;
  qty: number; // number of servings
  serving: number; // size of one serving (in `unit`) at log time
  unit: string;
  icon?: string; // snapshot of the food's icon at log time
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  ts: number; // logged-at (ms) — used to order the timeline
}

export interface State {
  goals: Goals;
  catalogs: Catalog[];
  foods: Food[];
  log: Record<string, Entry[]>; // dateKey -> entries
}

export const STORE_KEY = "acemf:v1";

export const DEFAULT_GOALS: Goals = { calories: 2400, protein: 180, carbs: 250, fat: 70 };

export const DEFAULT_CATALOGS: Catalog[] = [
  { id: "basics", name: "Basics" },
  { id: "mine", name: "My Foods" },
];

// A small starter catalogue so the app is usable on first open. Macros are
// per-serving, rounded to realistic reference values.
export const SEED_FOODS: Food[] = [
  { id: "seed-chicken", name: "Chicken breast", serving: 100, unit: "g", kcal: 165, protein: 31, carbs: 0, fat: 3.6, catalogId: "basics", icon: "🍗" },
  { id: "seed-rice", name: "White rice, cooked", serving: 100, unit: "g", kcal: 130, protein: 2.7, carbs: 28, fat: 0.3, catalogId: "basics", icon: "🍚" },
  { id: "seed-egg", name: "Egg, large", serving: 1, unit: "item", kcal: 72, protein: 6.3, carbs: 0.4, fat: 4.8, catalogId: "basics", icon: "🥚" },
  { id: "seed-oats", name: "Rolled oats, dry", serving: 40, unit: "g", kcal: 150, protein: 5, carbs: 27, fat: 3, catalogId: "basics", icon: "🥣" },
  { id: "seed-banana", name: "Banana, medium", serving: 1, unit: "item", kcal: 105, protein: 1.3, carbs: 27, fat: 0.4, catalogId: "basics", icon: "🍌" },
  { id: "seed-yogurt", name: "Greek yogurt, 2%", serving: 170, unit: "g", kcal: 145, protein: 20, carbs: 8, fat: 4, catalogId: "basics", icon: "🥛" },
  { id: "seed-whey", name: "Whey protein", serving: 1, unit: "scoop", kcal: 120, protein: 24, carbs: 3, fat: 1.5, catalogId: "basics", icon: "🥤" },
  { id: "seed-oliveoil", name: "Olive oil", serving: 1, unit: "tbsp", kcal: 119, protein: 0, carbs: 0, fat: 13.5, catalogId: "basics", icon: "🫒" },
  { id: "seed-almonds", name: "Almonds", serving: 28, unit: "g", kcal: 164, protein: 6, carbs: 6, fat: 14, catalogId: "basics", icon: "🥜" },
  { id: "seed-bread", name: "Bread, whole wheat", serving: 1, unit: "slice", kcal: 80, protein: 4, carbs: 14, fat: 1, catalogId: "basics", icon: "🍞" },
];

export function defaultState(): State {
  return {
    goals: { ...DEFAULT_GOALS },
    catalogs: DEFAULT_CATALOGS.map((c) => ({ ...c })),
    foods: SEED_FOODS.map((f) => ({ ...f })),
    log: {},
  };
}

export function loadState(): State {
  if (typeof localStorage === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<State>;

    const catalogs =
      Array.isArray(parsed.catalogs) && parsed.catalogs.length
        ? parsed.catalogs
        : DEFAULT_CATALOGS.map((c) => ({ ...c }));
    const catalogIds = new Set(catalogs.map((c) => c.id));
    const fallbackCatalog = catalogs[0]?.id ?? "basics";
    const seedIcon = new Map(SEED_FOODS.map((f) => [f.id, f.icon] as const));

    const foods: Food[] =
      Array.isArray(parsed.foods) && parsed.foods.length
        ? parsed.foods.map((f) => {
            // Backfill catalog + icon for data saved before catalogs existed.
            let catalogId = (f as Food).catalogId;
            if (!catalogId || !catalogIds.has(catalogId)) {
              catalogId = f.id?.startsWith("seed-") ? (catalogIds.has("basics") ? "basics" : fallbackCatalog) : f.custom ? (catalogIds.has("mine") ? "mine" : fallbackCatalog) : fallbackCatalog;
            }
            const icon = (f as Food).icon ?? (f.id ? seedIcon.get(f.id) : undefined);
            return { ...(f as Food), catalogId, icon };
          })
        : defaultState().foods;

    return {
      goals: { ...DEFAULT_GOALS, ...(parsed.goals ?? {}) },
      catalogs,
      foods,
      log: parsed.log ?? {},
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state: State): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    /* storage full / disabled — app still works for the session */
  }
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Local date key YYYY-MM-DD (never UTC — days are local to the user). */
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

export interface Totals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function totalsFor(entries: Entry[] | undefined): Totals {
  const t: Totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  if (!entries) return t;
  for (const e of entries) {
    t.calories += e.kcal;
    t.protein += e.protein;
    t.carbs += e.carbs;
    t.fat += e.fat;
  }
  return t;
}

export function round(n: number, dp = 0): number {
  const f = Math.pow(10, dp);
  return Math.round(n * f) / f;
}

export function uid(prefix = "id"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
