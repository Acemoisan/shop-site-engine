// Ace-Budget — client controller. Calendar-driven income/expense tracking.
// Local-first via budget-store.ts. Plain DOM + delegated events. Shares the
// hub's backup module (exports all localStorage keys, budget included).

import {
  loadBudget,
  saveBudget,
  todayKey,
  dateKey,
  parseKey,
  sumEntries,
  entriesForDay,
  entriesForMonth,
  round2,
  uid,
  type BudgetState,
  type BudgetEntry,
  type EntryType,
} from "../lib/budget-store";
import { downloadBackup } from "../lib/backup";

if (document.getElementById("cal-grid") && document.getElementById("sum-net")) {
  let state: BudgetState = loadBudget();
  let selected = todayKey();
  const t0 = new Date();
  let calYear = t0.getFullYear();
  let calMonth = t0.getMonth();
  let editingId: string | null = null;
  let entryType: EntryType = "expense";

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
  const signed = (n: number) => `${n < 0 ? "−" : n > 0 ? "+" : ""}${money(n)}`;
  function fmtDayShort(key: string) {
    return parseKey(key).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }

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

    const wrap = $("budget-bar-wrap")!;
    if (state.monthlyBudget > 0) {
      wrap.classList.remove("hidden");
      const pct = Math.min(100, (s.expense / state.monthlyBudget) * 100);
      const over = s.expense > state.monthlyBudget;
      $("budget-bar")!.style.width = `${pct}%`;
      $("budget-bar")!.style.background = over ? "var(--protein)" : s.expense / state.monthlyBudget > 0.85 ? "var(--warn)" : "var(--good)";
      $("budget-bar-text")!.textContent = `${money(s.expense)} / ${money(state.monthlyBudget)}`;
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
    list.innerHTML = entries
      .map((e) => {
        const income = e.type === "income";
        const col = income ? "var(--good)" : "var(--protein)";
        return `<div class="group flex items-center gap-3 rounded-xl border border-border bg-background/40 px-3.5 py-2.5">
          <span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style="background:color-mix(in oklab, ${col} 15%, transparent); color:${col}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">${income ? '<path d="M12 5v14M6 13l6 6 6-6"/>' : '<path d="M12 19V5M6 11l6-6 6 6"/>'}</svg>
          </span>
          <button data-edit-entry="${e.id}" class="min-w-0 flex-1 text-left">
            <p class="truncate text-sm font-medium text-foreground">${escapeHtml(e.label || e.category)}</p>
            <p class="font-mono text-[11px] text-muted-foreground">${escapeHtml(e.category)}</p>
          </button>
          <span class="font-mono text-sm font-semibold tabular-nums" style="color:${col}">${income ? "+" : "−"}${money(e.amount)}</span>
          <button data-del-entry="${e.id}" class="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-warn/15 hover:text-warn" aria-label="Delete entry">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>
          </button>
        </div>`;
      })
      .join("");
  }

  // ---------- Calendar ----------
  function renderCalendar() {
    const first = new Date(calYear, calMonth, 1);
    const startDow = first.getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const tk = todayKey();

    // per-day net + scale for tint strength
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

  // ---------- Category breakdown ----------
  function renderBreakdown() {
    const box = $("cat-breakdown")!;
    const expenses = entriesForMonth(state, calYear, calMonth).filter((e) => e.type === "expense");
    if (!expenses.length) {
      box.innerHTML = `<p class="py-4 text-center font-mono text-xs text-muted-foreground">No expenses yet this month.</p>`;
      return;
    }
    const byCat: Record<string, number> = {};
    for (const e of expenses) byCat[e.category] = (byCat[e.category] || 0) + e.amount;
    const rows = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
    const max = rows[0][1] || 1;
    box.innerHTML = rows
      .map(([cat, amt]) => {
        const pct = Math.round((amt / max) * 100);
        return `<div>
          <div class="flex items-baseline justify-between font-mono text-[11px]">
            <span class="text-foreground">${escapeHtml(cat)}</span>
            <span class="tabular-nums text-muted-foreground">${money(amt)}</span>
          </div>
          <div class="mt-1 h-2 overflow-hidden rounded-full bg-border">
            <div class="h-full rounded-full" style="width:${pct}%;background:var(--protein)"></div>
          </div>
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
  function closeTop() { for (const id of ["modal-entry", "modal-settings"]) if (!$(id)?.classList.contains("hidden")) { closeModal(id); return; } }

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
    setEntryType(entry?.type ?? "expense", entry?.category);
    const del = $("e-delete")!;
    del.classList.toggle("hidden", !entry);
    del.classList.toggle("flex", !!entry);
    openModal("modal-entry");
    if (!entry) setTimeout(() => $<HTMLInputElement>("e-amount")!.focus(), 30);
  }

  // ---------- Settings ----------
  function openSettings() {
    ($<HTMLInputElement>("s-currency")!).value = state.currency;
    ($<HTMLInputElement>("s-budget")!).value = state.monthlyBudget ? String(state.monthlyBudget) : "";
    openModal("modal-settings");
  }

  // ---------- Events ----------
  document.addEventListener("click", (ev) => {
    const el = (ev.target as HTMLElement).closest<HTMLElement>("[data-nav],[data-open],[data-close],[data-day],[data-action],[data-etype],[data-edit-entry],[data-del-entry]");
    if (!el) return;

    if (el.dataset.nav) {
      const n = el.dataset.nav;
      if (n === "prev-month") { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } }
      else if (n === "next-month") { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } }
      else if (n === "this-month") { const t = new Date(); calYear = t.getFullYear(); calMonth = t.getMonth(); selected = todayKey(); }
      renderAll();
      return;
    }
    if (el.dataset.open) { if (el.dataset.open === "entry") openEntry(null); else if (el.dataset.open === "settings") openSettings(); return; }
    if (el.hasAttribute("data-close")) { closeTop(); return; }
    if (el.dataset.day) { selected = el.dataset.day; renderDay(); renderCalendar(); return; }
    if (el.dataset.action === "backup") { downloadBackup(); toast("Backup downloaded"); return; }
    if (el.dataset.etype) { setEntryType(el.dataset.etype as EntryType); return; }
    if (el.dataset.editEntry) { const e = state.entries.find((x) => x.id === el.dataset.editEntry); if (e) openEntry(e); return; }
    if (el.dataset.delEntry) {
      state.entries = state.entries.filter((x) => x.id !== el.dataset.delEntry);
      commit(); renderAll(); toast("Entry deleted");
      return;
    }
  });

  // new-category via the select
  $<HTMLSelectElement>("e-category")?.addEventListener("change", (e) => {
    const sel = e.target as HTMLSelectElement;
    if (sel.value !== NEW_CAT) return;
    const name = (window.prompt("New category name") || "").trim();
    if (name) {
      if (!state.categories[entryType].includes(name)) { state.categories[entryType].push(name); commit(); }
      renderCategoryOptions(entryType, name);
    } else {
      renderCategoryOptions(entryType, state.categories[entryType][0]);
    }
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

    if (editingId) {
      const en = state.entries.find((x) => x.id === editingId);
      if (en) { en.type = entryType; en.amount = amount; en.date = date; en.category = category; en.label = label || undefined; }
      toast("Entry updated");
    } else {
      state.entries.push({ id: uid(), date, type: entryType, amount, category, label: label || undefined, ts: Date.now() });
      toast("Entry added");
    }
    commit();
    selected = date; // jump to the day we just touched
    const dd = parseKey(date); calYear = dd.getFullYear(); calMonth = dd.getMonth();
    editingId = null;
    closeModal("modal-entry");
    renderAll();
  });

  // delete from edit modal
  $("e-delete")?.addEventListener("click", () => {
    if (!editingId) return;
    state.entries = state.entries.filter((x) => x.id !== editingId);
    editingId = null;
    commit();
    closeModal("modal-entry");
    renderAll();
    toast("Entry deleted");
  });

  // settings submit
  $<HTMLFormElement>("settings-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const cur = $<HTMLInputElement>("s-currency")!.value.trim() || "$";
    const budget = Math.max(0, Number($<HTMLInputElement>("s-budget")!.value) || 0);
    state.currency = cur.slice(0, 3);
    state.monthlyBudget = round2(budget);
    commit();
    closeModal("modal-settings");
    renderAll();
    toast("Settings saved");
  });

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeTop(); });

  renderAll();
}
