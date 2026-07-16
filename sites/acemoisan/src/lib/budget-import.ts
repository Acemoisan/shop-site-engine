// Ace-Budget — CSV importer for the user's "Measure of a Plan" Expenses tab.
// Pure functions (no DOM) so they can be unit-tested in node. Expenses only.
//
// The sheet has two row shapes:
//   1. structured: Date | Vendor | $Amount | Category | Note
//   2. informal:   amount left blank, written into the note as "Label - $12.34"
// We handle both, skip the tool's example / "[Placeholder data]" rows, normalize
// categories to the app's canonical strings, and let the caller de-dupe.

export interface ParsedExpense {
  date: string; // YYYY-MM-DD
  amount: number;
  category: string;
  label?: string;
  note?: string;
  amountFromNote: boolean;
}

export interface ImportResult {
  rows: ParsedExpense[];
  total: number;
  minDate: string | null;
  maxDate: string | null;
  skipped: number;
  fromNote: number;
}

// RFC-ish CSV parse (handles quoted fields, embedded commas/quotes/newlines).
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (ch === "\r") { /* ignore */ }
    else field += ch;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function normKey(s: string): string {
  return s.trim().replace(/️/g, "").replace(/\s+/g, " ").toLowerCase();
}

function toISO(mdY: string): string | null {
  const m = mdY.trim().match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!m) return null;
  const [, mm, dd, yyyy] = m;
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

function parseMoney(s: string): number {
  const n = Number(String(s).replace(/[^0-9.]/g, ""));
  return isFinite(n) ? n : 0;
}

// Pull a "$12.34" out of free text; returns {amount, cleaned label}.
function amountFromText(s: string): { amount: number; label: string } {
  const m = s.match(/\$\s?([0-9][0-9,]*(?:\.[0-9]{1,2})?)/);
  if (!m) return { amount: 0, label: s.trim() };
  const amount = parseMoney(m[1]);
  const label = s.replace(m[0], "").replace(/\s*[-–—:]\s*$/, "").replace(/^\s*[-–—:]\s*/, "").trim();
  return { amount, label };
}

export function parseExpenseCsv(text: string, knownCats: string[]): ImportResult {
  const catMap = new Map(knownCats.map((c) => [normKey(c), c]));
  const canon = (raw: string): string => {
    const t = raw.trim();
    if (!t) return "Other 🛠";
    return catMap.get(normKey(t)) ?? t;
  };

  const grid = parseCsv(text);
  // find header row + column indices
  let hIdx = -1, cDate = -1, cVendor = -1, cAmount = -1, cCat = -1, cNote = -1;
  for (let r = 0; r < grid.length; r++) {
    const cells = grid[r];
    const found = cells.findIndex((c) => /date\s*\(mm/i.test(c));
    if (found >= 0) {
      hIdx = r;
      cells.forEach((c, i) => {
        if (/date/i.test(c)) cDate = i;
        else if (/amount/i.test(c)) cAmount = i;
        else if (/category/i.test(c)) cCat = i;
        else if (/vendor|store|source/i.test(c)) cVendor = i;
        else if (/note/i.test(c)) cNote = i;
      });
      break;
    }
  }
  if (hIdx < 0) return { rows: [], total: 0, minDate: null, maxDate: null, skipped: 0, fromNote: 0 };

  const rows: ParsedExpense[] = [];
  let skipped = 0, fromNote = 0;
  for (let r = hIdx + 1; r < grid.length; r++) {
    const cells = grid[r];
    const get = (i: number) => (i >= 0 && cells[i] != null ? String(cells[i]) : "");
    const rawDate = get(cDate).trim();
    const rawNote = get(cNote).trim();
    const rawCat = get(cCat).trim();
    const rawVendor = get(cVendor).trim();
    const rawAmount = get(cAmount).trim();

    if (!rawDate && !rawAmount && !rawNote && !rawCat) continue; // blank spacer row
    if (rawNote === "[Placeholder data]") { skipped++; continue; } // tool's placeholder
    const iso = toISO(rawDate);
    if (!iso) { skipped++; continue; } // example row / bad date

    let amount = parseMoney(rawAmount);
    let label = rawVendor;
    let note = rawNote;
    let viaNote = false;
    if (amount <= 0) {
      // informal row: amount lives in the note, e.g. "Airbnb - $508.38"
      const ext = amountFromText(rawNote);
      if (ext.amount > 0) {
        amount = ext.amount;
        viaNote = true;
        if (!label) { label = ext.label; note = ""; }
        else note = ext.label;
      }
    }
    if (amount <= 0) { skipped++; continue; }

    if (viaNote) fromNote++;
    rows.push({
      date: iso,
      amount: Math.round(amount * 100) / 100,
      category: canon(rawCat),
      label: label || undefined,
      note: note || undefined,
      amountFromNote: viaNote,
    });
  }

  const total = rows.reduce((a, b) => a + b.amount, 0);
  const dates = rows.map((r) => r.date).sort();
  return {
    rows,
    total: Math.round(total * 100) / 100,
    minDate: dates[0] ?? null,
    maxDate: dates[dates.length - 1] ?? null,
    skipped,
    fromNote,
  };
}
