// Ace-Budget — client controller (v2). Calendar-driven income/expense tracking
// mirroring the user's "Measure of a Plan" sheet: their categories, per-category
// monthly targets, vendor/note per entry, and target-vs-actual variance.
// Local-first via budget-store.ts. Plain DOM + delegated events.

import {
  loadBudget,
  saveBudget,
  todayKey,
  dateKey,
  parseKey,
  sumEntries,
  entriesForDay,
  entriesForMonth,
  totalTarget,
  round2,
  uid,
  type BudgetState,
  type BudgetEntry,
  type EntryType,
} from "../lib/budget-store";
import { parseExpenseCsv, expensesToCsv, type ParsedExpense, type ImportResult } from "../lib/budget-import";

if (document.getElementById("cal-grid") && document.getElementById("sum-net")) {
  let state: BudgetState = loadBudget();
  let selected = todayKey();
  const t0 = new Date();
  let calYear = t0.getFullYear();
  let calMonth = t0.getMonth();
  let editingId: string | null = null;
  let entryType: EntryType = "expense";
  let dayExpanded = false;
  const DAY_CAP = 5;

  const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T | null;
  const commit = () => saveBudget(state);

  function toast(msg: string) {
    const t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.style.opacity = "1";
    window.clearTimeout((t as any)._h);
    (t as any)._h = window.setTimeout(() => (t.style.opacity = "0"), 1800);
  }
  function escapeHtml(s: string) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
  }
  const money = (n: number) => `${state.currency}${Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const money0 = (n: number) => `${state.currency}${Math.round(Math.abs(n)).toLocaleString()}`;
  const signed = (n: number) => `${n < 0 ? "−" : n > 0 ? "+" : ""}${money(n)}`;
  const fmtDayShort = (key: string) => parseKey(key).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

  // ---------- Summary ----------
  function renderMonthLabel() {
    $("month-label")!.textContent = new Date(calYear, calMonth, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
  }
  function renderSummary() {
    const monthEntries = entriesForMonth(state, calYear, calMonth);
    const s = sumEntries(monthEntries);
    $("sum-income")!.textContent = money(s.income);
    $("sum-expense")!.textContent = money(s.expense);
    const net = $("sum-net")!;
    net.textContent = signed(round2(s.net));
    net.style.color = s.net < 0 ? "var(--protein)" : "var(--good)";
    $("summary-count")!.textContent = `${monthEntries.length} ${monthEntries.length === 1 ? "entry" : "entries"}`;

    const budget = totalTarget(state);
    const wrap = $("budget-bar-wrap")!;
    if (budget > 0) {
      wrap.classList.remove("hidden");
      const pct = Math.min(100, (s.expense / budget) * 100);
      const over = s.expense > budget;
      $("budget-bar")!.style.width = `${pct}%`;
      $("budget-bar")!.style.background = over ? "var(--protein)" : s.expense / budget > 0.85 ? "var(--warn)" : "var(--good)";
      $("budget-bar-text")!.textContent = `${money(s.expense)} / ${money(budget)}`;
    } else {
      wrap.classList.add("hidden");
    }
  }

  // ---------- Day list ----------
  function renderDay() {
    $("day-label")!.textContent = selected === todayKey() ? "today" : fmtDayShort(selected);
    const entries = entriesForDay(state, selected).slice().sort((a, b) => b.ts - a.ts);
    const s = sumEntries(entries);
    const dt = $("day-total")!;
    dt.textContent = entries.length ? signed(round2(s.net)) : "—";
    dt.style.color = entries.length ? (s.net < 0 ? "var(--protein)" : "var(--good)") : "var(--muted-foreground)";

    const list = $("day-list")!;
    if (!entries.length) {
      list.innerHTML = `<div class="rounded-xl border border-dashed border-border/70 px-4 py-8 text-center">
        <p class="font-mono text-sm text-muted-foreground">Nothing logged for ${selected === todayKey() ? "today" : fmtDayShort(selected)}.</p>
        <button data-open="entry" class="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-110">+ Add an entry</button>
      </div>`;
      return;
    }
    const shown = dayExpanded ? entries : entries.slice(0, DAY_CAP);
    const hidden = entries.length - shown.length;
    list.innerHTML = shown
      .map((e) => {
        const income = e.type === "income";
        const col = income ? "var(--good)" : "var(--protein)";
        const sub = [e.category, e.note].filter(Boolean).join(" · ");
        return `<div class="group flex items-center gap-3 rounded-xl border border-border bg-background/40 px-3.5 py-2.5">
          <span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style="background:color-mix(in oklab, ${col} 15%, transparent); color:${col}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">${income ? '<path d="M12 5v14M6 13l6 6 6-6"/>' : '<path d="M12 19V5M6 11l6-6 6 6"/>'}</svg>
          </span>
          <button data-edit-entry="${e.id}" class="min-w-0 flex-1 text-left">
            <p class="truncate text-sm font-medium text-foreground">${escapeHtml(e.label || e.category)}</p>
            <p class="truncate font-mono text-[11px] text-muted-foreground">${escapeHtml(sub)}</p>
          </button>
          <span class="font-mono text-sm font-semibold tabular-nums" style="color:${col}">${income ? "+" : "−"}${money(e.amount)}</span>
          <button data-del-entry="${e.id}" class="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-warn/15 hover:text-warn" aria-label="Delete entry">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>
          </button>
        </div>`;
      })
      .join("");
    if (entries.length > DAY_CAP) {
      list.innerHTML += `<button data-action="toggle-day" class="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border/70 py-2 font-mono text-xs text-muted-foreground transition hover:text-foreground">
        ${dayExpanded ? "Show less" : `Show all ${entries.length}`}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5 ${dayExpanded ? "rotate-180" : ""}"><path d="M6 9l6 6 6-6"/></svg>
      </button>`;
    }
  }

  // ---------- Calendar ----------
  function renderCalendar() {
    const first = new Date(calYear, calMonth, 1);
    const startDow = first.getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const tk = todayKey();
    const nets: Record<string, number> = {};
    let maxAbs = 1;
    for (let d = 1; d <= daysInMonth; d++) {
      const key = dateKey(new Date(calYear, calMonth, d));
      const n = sumEntries(entriesForDay(state, key)).net;
      nets[key] = n;
      maxAbs = Math.max(maxAbs, Math.abs(n));
    }
    const cells: string[] = [];
    for (let i = 0; i < startDow; i++) cells.push(`<span></span>`);
    for (let d = 1; d <= daysInMonth; d++) {
      const key = dateKey(new Date(calYear, calMonth, d));
      const n = nets[key];
      const has = entriesForDay(state, key).length > 0;
      const isToday = key === tk;
      const isSel = key === selected;
      let bg = "transparent";
      if (has && n !== 0) {
        const strength = Math.round((0.2 + 0.5 * (Math.abs(n) / maxAbs)) * 100);
        bg = `color-mix(in oklab, var(${n > 0 ? "--good" : "--protein"}) ${strength}%, var(--card))`;
      } else if (has) {
        bg = "color-mix(in oklab, var(--muted-foreground) 22%, var(--card))";
      }
      const ring = isSel ? "ring-2 ring-primary" : isToday ? "ring-1 ring-primary/70" : "ring-1 ring-inset ring-border/60";
      cells.push(
        `<button data-day="${key}" title="${fmtDayShort(key)}${has ? " · " + signed(round2(n)) : ""}"
          class="relative aspect-square rounded-md ${ring} transition hover:ring-primary" style="background:${bg}">
          <span class="absolute inset-0 grid place-content-center font-mono text-[11px] ${has ? "font-semibold text-foreground" : "text-muted-foreground"}">${d}</span>
        </button>`
      );
    }
    $("cal-grid")!.innerHTML = cells.join("");
  }

  // ---------- Category breakdown vs target ----------
  function renderBreakdown() {
    const box = $("cat-breakdown")!;
    const expenses = entriesForMonth(state, calYear, calMonth).filter((e) => e.type === "expense");
    const spend: Record<string, number> = {};
    for (const e of expenses) spend[e.category] = (spend[e.category] || 0) + e.amount;

    // categories with any spend OR a set target
    const cats = new Set<string>([...Object.keys(spend), ...Object.keys(state.targets).filter((c) => state.targets[c] > 0)]);
    if (!cats.size) {
      box.innerHTML = `<p class="py-4 text-center font-mono text-xs text-muted-foreground">No expenses or budgets yet this month.</p>`;
      return;
    }
    const rows = [...cats].map((c) => ({ cat: c, actual: spend[c] || 0, target: state.targets[c] || 0 }));
    rows.sort((a, b) => b.actual - a.actual || b.target - a.target);

    box.innerHTML = rows
      .map(({ cat, actual, target }) => {
        let barPct: number, barCol: string, right: string, variance: string;
        if (target > 0) {
          barPct = Math.min(100, (actual / target) * 100);
          const over = actual > target;
          barCol = over ? "var(--protein)" : actual / target > 0.85 ? "var(--warn)" : "var(--good)";
          right = `${money0(actual)} <span class="text-muted-foreground/70">/ ${money0(target)}</span>`;
          const diff = target - actual;
          variance = diff >= 0 ? `${money0(diff)} left` : `${money0(-diff)} over`;
        } else {
          barPct = actual > 0 ? 100 : 0;
          barCol = "var(--muted-foreground)";
          right = money0(actual);
          variance = "no budget";
        }
        const varCol = target > 0 && actual > target ? "var(--protein)" : "var(--muted-foreground)";
        return `<div>
          <div class="flex items-baseline justify-between gap-2 font-mono text-[11px]">
            <span class="truncate text-foreground">${escapeHtml(cat)}</span>
            <span class="shrink-0 tabular-nums text-foreground">${right}</span>
          </div>
          <div class="mt-1 h-2 overflow-hidden rounded-full bg-border">
            <div class="h-full rounded-full transition-[width] duration-500" style="width:${barPct}%;background:${barCol}"></div>
          </div>
          <p class="mt-0.5 text-right font-mono text-[10px]" style="color:${varCol}">${variance}</p>
        </div>`;
      })
      .join("");
  }

  function renderAll() {
    renderMonthLabel();
    renderSummary();
    renderDay();
    renderCalendar();
    renderBreakdown();
  }

  // ---------- Modals ----------
  function openModal(id: string) { $(id)?.classList.remove("hidden"); document.body.style.overflow = "hidden"; }
  function closeModal(id: string) { $(id)?.classList.add("hidden"); if (!document.querySelector('[role="dialog"]:not(.hidden)')) document.body.style.overflow = ""; }
  function closeTop() { for (const id of ["modal-import", "modal-ledger", "modal-entry", "modal-budgets"]) if (!$(id)?.classList.contains("hidden")) { closeModal(id); return; } }

  // ---------- Entry form ----------
  const NEW_CAT = "__new__";
  function renderCategoryOptions(type: EntryType, selectedCat?: string) {
    const sel = $<HTMLSelectElement>("e-category")!;
    const cats = state.categories[type];
    sel.innerHTML = cats.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("") + `<option value="${NEW_CAT}">＋ New category…</option>`;
    if (selectedCat && cats.includes(selectedCat)) sel.value = selectedCat;
  }
  function setEntryType(type: EntryType, keepCat?: string) {
    entryType = type;
    document.querySelectorAll<HTMLElement>(".etype-btn").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.etype === type)));
    $("e-label-name")!.textContent = type === "income" ? "Source" : "Vendor";
    renderCategoryOptions(type, keepCat);
  }
  function openEntry(entry: BudgetEntry | null) {
    editingId = entry?.id ?? null;
    $("entry-title")!.textContent = entry ? "Edit entry" : "Add entry";
    $("e-submit-label")!.textContent = entry ? "Save changes" : "Add entry";
    $("e-currency")!.textContent = state.currency;
    ($<HTMLInputElement>("e-amount")!).value = entry ? String(entry.amount) : "";
    ($<HTMLInputElement>("e-date")!).value = entry?.date ?? selected;
    ($<HTMLInputElement>("e-label")!).value = entry?.label ?? "";
    ($<HTMLInputElement>("e-note")!).value = entry?.note ?? "";
    setEntryType(entry?.type ?? "expense", entry?.category);
    const del = $("e-delete")!;
    del.classList.toggle("hidden", !entry);
    del.classList.toggle("flex", !!entry);
    openModal("modal-entry");
    if (!entry) setTimeout(() => $<HTMLInputElement>("e-amount")!.focus(), 30);
  }

  // ---------- Budgets modal ----------
  function updateTargetsTotal() {
    let total = 0;
    document.querySelectorAll<HTMLInputElement>("[data-target]").forEach((i) => (total += Number(i.value) || 0));
    $("targets-total")!.textContent = money0(total);
  }
  function openBudgets() {
    ($<HTMLInputElement>("s-currency")!).value = state.currency;
    $("targets-list")!.innerHTML = state.categories.expense
      .map(
        (c) => `<div class="flex items-center gap-2">
          <label class="min-w-0 flex-1 truncate text-sm text-foreground" title="${escapeHtml(c)}">${escapeHtml(c)}</label>
          <div class="flex items-center rounded-lg border border-border bg-background focus-within:border-primary">
            <span class="pl-2.5 pr-1 font-mono text-xs text-muted-foreground">${state.currency}</span>
            <input data-target="${escapeHtml(c)}" type="number" min="0" step="1" value="${state.targets[c] || 0}"
              class="w-20 rounded-r-lg bg-transparent py-2 pr-2 text-right font-mono text-sm text-foreground focus:outline-none" />
          </div>
        </div>`
      )
      .join("");
    updateTargetsTotal();
    openModal("modal-budgets");
  }

  // ---------- Events ----------
  document.addEventListener("click", (ev) => {
    const el = (ev.target as HTMLElement).closest<HTMLElement>("[data-nav],[data-open],[data-close],[data-day],[data-action],[data-etype],[data-edit-entry],[data-del-entry],[data-collapse]");
    if (!el) return;
    if (el.dataset.nav) {
      const n = el.dataset.nav;
      if (n === "prev-month") { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } }
      else if (n === "next-month") { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } }
      else if (n === "this-month") { const t = new Date(); calYear = t.getFullYear(); calMonth = t.getMonth(); selected = todayKey(); dayExpanded = false; }
      renderAll();
      return;
    }
    if (el.dataset.open) { if (el.dataset.open === "entry") openEntry(null); else if (el.dataset.open === "budgets") openBudgets(); else if (el.dataset.open === "ledger") openLedger(); return; }
    if (el.dataset.collapse) { toggleCollapse(el.dataset.collapse); return; }
    if (el.hasAttribute("data-close")) { closeTop(); return; }
    if (el.dataset.day) { selected = el.dataset.day; dayExpanded = false; renderDay(); renderCalendar(); return; }
    if (el.dataset.action === "export") { exportCsv(); return; }
    if (el.dataset.action === "toggle-day") { dayExpanded = !dayExpanded; renderDay(); return; }
    if (el.dataset.etype) { setEntryType(el.dataset.etype as EntryType); return; }
    if (el.dataset.editEntry) { const e = state.entries.find((x) => x.id === el.dataset.editEntry); if (e) openEntry(e); return; }
    if (el.dataset.delEntry) { state.entries = state.entries.filter((x) => x.id !== el.dataset.delEntry); commit(); renderAll(); toast("Entry deleted"); return; }
  });

  // new-category via the select
  $<HTMLSelectElement>("e-category")?.addEventListener("change", (e) => {
    const sel = e.target as HTMLSelectElement;
    if (sel.value !== NEW_CAT) return;
    const name = (window.prompt("New category name") || "").trim();
    if (name) {
      if (!state.categories[entryType].includes(name)) { state.categories[entryType].push(name); commit(); }
      renderCategoryOptions(entryType, name);
    } else renderCategoryOptions(entryType, state.categories[entryType][0]);
  });

  // entry submit
  $<HTMLFormElement>("entry-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = round2(Math.max(0, Number($<HTMLInputElement>("e-amount")!.value) || 0));
    if (amount <= 0) { toast("Enter an amount"); return; }
    const date = $<HTMLInputElement>("e-date")!.value || selected;
    let category = $<HTMLSelectElement>("e-category")!.value;
    if (category === NEW_CAT) category = state.categories[entryType][0] || "Other";
    const label = $<HTMLInputElement>("e-label")!.value.trim();
    const note = $<HTMLInputElement>("e-note")!.value.trim();

    if (editingId) {
      const en = state.entries.find((x) => x.id === editingId);
      if (en) { en.type = entryType; en.amount = amount; en.date = date; en.category = category; en.label = label || undefined; en.note = note || undefined; }
      toast("Entry updated");
    } else {
      state.entries.push({ id: uid(), date, type: entryType, amount, category, label: label || undefined, note: note || undefined, ts: Date.now() });
      toast("Entry added");
    }
    commit();
    selected = date;
    const dd = parseKey(date); calYear = dd.getFullYear(); calMonth = dd.getMonth();
    editingId = null;
    closeModal("modal-entry");
    renderAll();
  });

  $("e-delete")?.addEventListener("click", () => {
    if (!editingId) return;
    state.entries = state.entries.filter((x) => x.id !== editingId);
    editingId = null; commit(); closeModal("modal-entry"); renderAll(); toast("Entry deleted");
  });

  // budgets form: live total + save
  document.addEventListener("input", (e) => { if ((e.target as HTMLElement).matches?.("[data-target]")) updateTargetsTotal(); });
  $<HTMLFormElement>("budgets-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    state.currency = ($<HTMLInputElement>("s-currency")!.value.trim() || "$").slice(0, 3);
    document.querySelectorAll<HTMLInputElement>("[data-target]").forEach((i) => {
      const cat = i.dataset.target!;
      state.targets[cat] = round2(Math.max(0, Number(i.value) || 0));
    });
    commit();
    closeModal("modal-budgets");
    renderAll();
    toast("Budgets saved");
  });

  // ---------- CSV import (expenses) ----------
  let pendingImport: ParsedExpense[] = [];
  const sig = (e: { date: string; amount: number; category: string; label?: string; note?: string }) =>
    `${e.date}|${e.amount}|${e.category}|${e.label ?? ""}|${e.note ?? ""}`;

  $<HTMLInputElement>("csv-import")?.addEventListener("change", async (ev) => {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      const res: ImportResult = parseExpenseCsv(await file.text(), state.categories.expense);
      if (!res.rows.length) { toast("No expenses found in that CSV"); input.value = ""; return; }
      // de-dupe against what's already logged
      const existing = new Set(state.entries.filter((e) => e.type === "expense").map(sig));
      pendingImport = res.rows.filter((r) => !existing.has(sig(r)));
      const dupes = res.rows.length - pendingImport.length;

      $("import-summary")!.innerHTML =
        `<div class="font-semibold">${pendingImport.length} new expense${pendingImport.length === 1 ? "" : "s"} · ${money(pendingImport.reduce((a, b) => a + b.amount, 0))}</div>` +
        `<div class="mt-1 font-mono text-xs text-muted-foreground">${res.minDate ?? "—"} → ${res.maxDate ?? "—"}${dupes ? ` · ${dupes} already imported` : ""}${res.skipped ? ` · ${res.skipped} skipped` : ""}</div>`;

      $("import-preview")!.innerHTML = pendingImport
        .slice(0, 40)
        .map(
          (r) => `<div class="flex items-center justify-between gap-2 rounded-lg border border-border bg-background/30 px-2.5 py-1.5 font-mono text-[11px]">
            <span class="min-w-0 truncate text-foreground">${r.date} · ${escapeHtml(r.label || r.category)}</span>
            <span class="shrink-0 text-muted-foreground">${escapeHtml(r.category)}</span>
            <span class="shrink-0 tabular-nums" style="color:var(--protein)">−${money(r.amount)}</span>
          </div>`
        )
        .join("") + (pendingImport.length > 40 ? `<p class="py-1 text-center font-mono text-[11px] text-muted-foreground">…and ${pendingImport.length - 40} more</p>` : "");

      $("import-note")!.textContent = res.fromNote
        ? `${res.fromNote} had the amount written in the note; any without a category are filed under “Other 🛠”.`
        : "";
      $("import-confirm-label")!.textContent = pendingImport.length ? `Import ${pendingImport.length}` : "Nothing new to import";
      ($("import-confirm") as HTMLButtonElement).disabled = !pendingImport.length;
      openModal("modal-import");
    } catch {
      toast("Couldn't read that CSV");
    } finally {
      input.value = ""; // allow re-selecting the same file
    }
  });

  $("import-confirm")?.addEventListener("click", () => {
    if (!pendingImport.length) return;
    // union any new categories so they show in the breakdown/filters
    for (const r of pendingImport) if (!state.categories.expense.includes(r.category)) state.categories.expense.push(r.category);
    for (const r of pendingImport) {
      state.entries.push({ id: uid(), date: r.date, type: "expense", amount: r.amount, category: r.category, label: r.label, note: r.note, ts: Date.now() });
    }
    commit();
    const n = pendingImport.length;
    pendingImport = [];
    closeModal("modal-import");
    // jump to the latest imported month
    const latest = [...state.entries].sort((a, b) => (a.date < b.date ? 1 : -1))[0];
    if (latest) { const d = parseKey(latest.date); calYear = d.getFullYear(); calMonth = d.getMonth(); selected = latest.date; }
    renderAll();
    toast(`Imported ${n} expense${n === 1 ? "" : "s"}`);
  });

  // ---------- Export CSV ----------
  function exportCsv() {
    const expenses = state.entries.filter((e) => e.type === "expense");
    if (!expenses.length) { toast("No expenses to export yet"); return; }
    const csv = expensesToCsv(expenses, state.currency);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const d = new Date();
    const pad2 = (n: number) => String(n).padStart(2, "0");
    a.href = url;
    a.download = `ace-budget-${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast(`Exported ${expenses.length} expenses`);
  }

  // ---------- Add category (Budgets modal) ----------
  function addCategory() {
    const input = $<HTMLInputElement>("new-cat-name")!;
    const name = input.value.trim();
    if (!name) return;
    if (!state.categories.expense.includes(name)) state.categories.expense.push(name);
    if (state.targets[name] == null) state.targets[name] = 0;
    commit();
    input.value = "";
    openBudgets(); // re-render the list with the new row
    setTimeout(() => { const list = $("targets-list"); if (list) list.scrollTop = list.scrollHeight; }, 20);
  }
  $("add-cat-btn")?.addEventListener("click", addCategory);
  $("new-cat-name")?.addEventListener("keydown", (e) => { if ((e as KeyboardEvent).key === "Enter") { e.preventDefault(); addCategory(); } });

  // ---------- Ledger (all entries this month) ----------
  function openLedger() {
    $("ledger-month")!.textContent = new Date(calYear, calMonth, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
    const rows = entriesForMonth(state, calYear, calMonth).slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.ts - a.ts));
    const s = sumEntries(rows);
    $("ledger-count")!.textContent = String(rows.length);
    const lt = $("ledger-total")!;
    lt.textContent = `net ${signed(round2(s.net))}`;
    lt.style.color = s.net < 0 ? "var(--protein)" : "var(--good)";

    if (!rows.length) {
      $("ledger-body")!.innerHTML = `<p class="px-5 py-10 text-center font-mono text-sm text-muted-foreground">No entries this month.</p>`;
      openModal("modal-ledger");
      return;
    }
    const head = `<div class="sticky top-0 z-10 grid grid-cols-[4.5rem_1fr_5rem] gap-2 border-b border-border bg-card px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
      <span>Date</span><span>Category / detail</span><span class="text-right">Amount</span></div>`;
    const body = rows
      .map((e) => {
        const income = e.type === "income";
        const col = income ? "var(--good)" : "var(--protein)";
        const detail = [e.label, e.note].filter(Boolean).join(" · ");
        return `<button data-edit-entry="${e.id}" data-from-ledger class="grid w-full grid-cols-[4.5rem_1fr_5rem] items-center gap-2 border-b border-border/50 px-4 py-2 text-left transition hover:bg-muted/40">
          <span class="font-mono text-[11px] text-muted-foreground">${e.date.slice(5)}</span>
          <span class="min-w-0"><span class="block truncate text-sm text-foreground">${escapeHtml(e.category)}</span>${detail ? `<span class="block truncate font-mono text-[10px] text-muted-foreground">${escapeHtml(detail)}</span>` : ""}</span>
          <span class="text-right font-mono text-sm font-semibold tabular-nums" style="color:${col}">${income ? "+" : "−"}${money(e.amount)}</span>
        </button>`;
      })
      .join("");
    $("ledger-body")!.innerHTML = head + body;
    openModal("modal-ledger");
  }

  // ---------- Collapse ----------
  function applyCollapsed() {
    document.querySelectorAll<HTMLElement>("[data-section]").forEach((sec) => {
      const key = sec.dataset.section!;
      const on = state.ui.collapsed.includes(key);
      sec.classList.toggle("collapsed", on);
      const body = sec.querySelector<HTMLElement>(".bbody");
      if (body) body.classList.toggle("hidden", on);
    });
  }
  function toggleCollapse(key: string) {
    const i = state.ui.collapsed.indexOf(key);
    if (i >= 0) state.ui.collapsed.splice(i, 1);
    else state.ui.collapsed.push(key);
    commit();
    applyCollapsed();
  }

  // ---------- Reorder (pointer-drag, touch-friendly) ----------
  function applyOrder() {
    const container = $("sections");
    if (!container) return;
    const map = new Map<string, HTMLElement>();
    container.querySelectorAll<HTMLElement>("[data-section]").forEach((s) => map.set(s.dataset.section!, s));
    for (const key of state.ui.order) { const el = map.get(key); if (el) container.appendChild(el); }
  }
  function persistOrder() {
    const container = $("sections");
    if (!container) return;
    state.ui.order = [...container.querySelectorAll<HTMLElement>("[data-section]")].map((s) => s.dataset.section!);
    commit();
  }
  function setupDrag() {
    const container = $("sections")!;
    let dragEl: HTMLElement | null = null;
    container.querySelectorAll<HTMLElement>("[data-drag]").forEach((handle) => {
      handle.addEventListener("pointerdown", (ev) => {
        const pe = ev as PointerEvent;
        ev.preventDefault();
        dragEl = handle.closest<HTMLElement>("[data-section]");
        if (!dragEl) return;
        dragEl.classList.add("dragging");
        const move = (m: PointerEvent) => {
          if (!dragEl) return;
          const y = m.clientY;
          const sibs = [...container.querySelectorAll<HTMLElement>("[data-section]")].filter((s) => s !== dragEl);
          let target: HTMLElement | null = null;
          for (const s of sibs) {
            const r = s.getBoundingClientRect();
            if (y < r.top + r.height / 2) { target = s; break; }
          }
          sibs.forEach((s) => s.classList.remove("drag-over"));
          if (target) { target.classList.add("drag-over"); container.insertBefore(dragEl, target); }
          else { container.appendChild(dragEl); }
        };
        const up = () => {
          document.removeEventListener("pointermove", move);
          document.removeEventListener("pointerup", up);
          if (dragEl) dragEl.classList.remove("dragging");
          container.querySelectorAll<HTMLElement>(".drag-over").forEach((s) => s.classList.remove("drag-over"));
          dragEl = null;
          persistOrder();
        };
        document.addEventListener("pointermove", move);
        document.addEventListener("pointerup", up);
      });
    });
  }

  // when editing from the ledger, close the ledger first so the entry modal is on top
  document.addEventListener("click", (ev) => {
    const el = (ev.target as HTMLElement).closest<HTMLElement>("[data-from-ledger]");
    if (el) closeModal("modal-ledger");
  });

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeTop(); });

  applyOrder();
  applyCollapsed();
  setupDrag();
  renderAll();
}
