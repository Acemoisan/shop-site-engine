// MacroFactor clone — client controller.
// Renders the daily summary, timeline log, calendar heatmap and monthly chart,
// and wires the add-food / qty / goals modals. All state via macro-store.ts
// (localStorage). No framework — plain DOM + event delegation.

import {
  loadState,
  saveState,
  todayKey,
  dateKey,
  parseKey,
  totalsFor,
  round,
  uid,
  type State,
  type Food,
  type Entry,
} from "../lib/macro-store";

// Only run on the app page.
if (document.getElementById("cal-ring")) {
  let state: State = loadState();
  let selected = todayKey();
  const initial = new Date();
  let calYear = initial.getFullYear();
  let calMonth = initial.getMonth(); // 0-11
  let pendingFood: Food | null = null;

  const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T | null;
  const RING_C = 2 * Math.PI * 52;
  const MACROS = [
    { key: "protein", label: "Protein", color: "var(--protein)" },
    { key: "carbs", label: "Carbs", color: "var(--carbs)" },
    { key: "fat", label: "Fat", color: "var(--fat)" },
  ] as const;

  const commit = () => saveState(state);

  function toast(msg: string) {
    const t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.style.opacity = "1";
    window.clearTimeout((t as any)._h);
    (t as any)._h = window.setTimeout(() => (t.style.opacity = "0"), 1800);
  }

  function fmtDayShort(key: string) {
    return parseKey(key).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }

  // ---------- Summary ----------
  function renderSummary() {
    const t = totalsFor(state.log[selected]);
    const g = state.goals;

    const ring = $<HTMLElement>("cal-ring");
    if (ring) {
      const pct = g.calories > 0 ? Math.min(1, t.calories / g.calories) : 0;
      ring.style.strokeDashoffset = String(RING_C * (1 - pct));
      ring.setAttribute("stroke", t.calories > g.calories ? "var(--warn)" : "var(--cal)");
    }
    $("cal-value")!.textContent = String(round(t.calories));
    $("cal-goal")!.textContent = String(round(g.calories));
    const remaining = g.calories - t.calories;
    const rem = $("cal-remaining")!;
    if (remaining >= 0) {
      rem.textContent = `${round(remaining)} left`;
      rem.style.color = "var(--cal)";
    } else {
      rem.textContent = `${round(-remaining)} over`;
      rem.style.color = "var(--warn)";
    }

    const status = $("summary-status")!;
    const entries = state.log[selected]?.length ?? 0;
    status.textContent = entries ? `${entries} item${entries === 1 ? "" : "s"} logged` : "nothing logged";

    $("macro-bars")!.innerHTML = MACROS.map((m) => {
      const val = (t as any)[m.key] as number;
      const goal = (g as any)[m.key] as number;
      const pct = goal > 0 ? Math.min(100, (val / goal) * 100) : 0;
      const over = val > goal;
      const left = goal - val;
      return `<div>
        <div class="flex items-baseline justify-between">
          <span class="font-mono text-xs" style="color:${m.color}">${m.label}</span>
          <span class="font-mono text-xs tabular-nums text-foreground">${round(val)}<span class="text-muted-foreground"> / ${round(goal)}g</span></span>
        </div>
        <div class="mt-1.5 h-2 overflow-hidden rounded-full bg-border">
          <div class="h-full rounded-full transition-[width] duration-500" style="width:${pct}%;background:${over ? "var(--warn)" : m.color}"></div>
        </div>
        <p class="mt-1 font-mono text-[10px] ${over ? "text-warn" : "text-muted-foreground"}">${over ? `${round(-left)}g over` : `${round(left)}g to go`}</p>
      </div>`;
    }).join("");
  }

  // ---------- Quick add ----------
  function recentFoods(limit = 6): Food[] {
    const seen = new Set<string>();
    const out: Food[] = [];
    const allEntries = Object.values(state.log).flat().sort((a, b) => b.ts - a.ts);
    for (const e of allEntries) {
      if (!e.foodId || seen.has(e.foodId)) continue;
      const f = state.foods.find((x) => x.id === e.foodId);
      if (f) {
        seen.add(f.id);
        out.push(f);
      }
      if (out.length >= limit) break;
    }
    return out;
  }

  function renderQuickAdd() {
    const wrap = $("quick-add-wrap")!;
    const box = $("quick-add")!;
    const recents = recentFoods();
    if (!recents.length) {
      wrap.classList.add("hidden");
      return;
    }
    wrap.classList.remove("hidden");
    box.innerHTML = recents
      .map(
        (f) =>
          `<button data-quick="${f.id}" class="inline-flex items-center gap-1.5 rounded-full border border-border bg-card-2 px-3 py-1.5 font-mono text-xs text-foreground transition hover:border-primary hover:text-primary">
            <span class="text-primary">+</span> ${escapeHtml(f.name)}
          </button>`
      )
      .join("");
  }

  // ---------- Log ----------
  function renderLog() {
    const list = $("log-list")!;
    const entries = (state.log[selected] ?? []).slice().sort((a, b) => a.ts - b.ts);
    if (!entries.length) {
      list.innerHTML = `<div class="rounded-xl border border-dashed border-border/70 px-4 py-10 text-center">
        <p class="font-mono text-sm text-muted-foreground">No food logged for ${selected === todayKey() ? "today" : fmtDayShort(selected)}.</p>
        <button data-open="add" class="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-110">+ Add your first food</button>
      </div>`;
      return;
    }
    list.innerHTML = entries
      .map(
        (e) => `<div class="group flex items-center gap-3 rounded-xl border border-border bg-background/40 px-3.5 py-2.5">
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-foreground">${escapeHtml(e.name)}</p>
            <p class="font-mono text-[11px] text-muted-foreground">${e.serving ? `${trim(e.qty)} × ${trim(e.serving)} ${escapeHtml(e.unit)}` : `${trim(e.qty)} serving${e.qty === 1 ? "" : "s"}`}</p>
          </div>
          <div class="flex items-center gap-3 text-right">
            <div>
              <p class="font-mono text-sm font-semibold tabular-nums text-foreground">${round(e.kcal)}<span class="text-[10px] text-muted-foreground"> kcal</span></p>
              <p class="font-mono text-[10px] tabular-nums text-muted-foreground">
                <span style="color:var(--protein)">${round(e.protein)}</span> ·
                <span style="color:var(--carbs)">${round(e.carbs)}</span> ·
                <span style="color:var(--fat)">${round(e.fat)}</span>
              </p>
            </div>
            <button data-remove="${e.id}" class="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-warn/15 hover:text-warn" aria-label="Remove ${escapeHtml(e.name)}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>
            </button>
          </div>
        </div>`
      )
      .join("");
  }

  // ---------- Calendar ----------
  function renderCalendar() {
    $("cal-month")!.textContent = new Date(calYear, calMonth, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
    const first = new Date(calYear, calMonth, 1);
    const startDow = first.getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const tk = todayKey();
    const goal = state.goals.calories || 1;

    const cells: string[] = [];
    for (let i = 0; i < startDow; i++) cells.push(`<span></span>`);
    for (let d = 1; d <= daysInMonth; d++) {
      const key = dateKey(new Date(calYear, calMonth, d));
      const cal = totalsFor(state.log[key]).calories;
      const pct = cal / goal;
      const isToday = key === tk;
      const isSel = key === selected;
      let bg = "transparent";
      if (cal > 0) {
        const over = pct > 1.05;
        const strength = Math.min(0.7, 0.18 + Math.min(pct, 1) * 0.55);
        bg = `color-mix(in oklab, var(${over ? "--warn" : "--cal"}) ${Math.round(strength * 100)}%, var(--card))`;
      }
      const ringCls = isSel ? "ring-2 ring-primary" : isToday ? "ring-1 ring-primary/70" : "ring-1 ring-inset ring-border/60";
      cells.push(
        `<button data-day="${key}" title="${fmtDayShort(key)}${cal ? " · " + round(cal) + " kcal" : ""}"
          class="relative aspect-square rounded-md ${ringCls} transition hover:ring-primary"
          style="background:${bg}">
          <span class="absolute inset-0 grid place-content-center font-mono text-[11px] ${cal > 0 ? "font-semibold text-foreground" : "text-muted-foreground"}">${d}</span>
        </button>`
      );
    }
    $("cal-grid")!.innerHTML = cells.join("");
  }

  // ---------- Monthly chart ----------
  function renderMonthly() {
    const host = $("chart")!;
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const goal = state.goals.calories || 0;
    const data: number[] = [];
    for (let d = 1; d <= daysInMonth; d++) data.push(totalsFor(state.log[dateKey(new Date(calYear, calMonth, d))]).calories);

    const W = Math.max(280, Math.floor(host.clientWidth || 320));
    const H = 168;
    const padB = 20, padT = 10;
    const areaH = H - padB - padT;
    const maxCal = Math.max(...data, 0);
    const scale = Math.max(goal * 1.3, maxCal * 1.12, 1);
    const slot = W / daysInMonth;
    const barW = Math.max(3, slot * 0.6);
    const y = (v: number) => padT + areaH - (v / scale) * areaH;

    const loggedVals = data.filter((v) => v > 0);
    const avg = loggedVals.length ? loggedVals.reduce((a, b) => a + b, 0) / loggedVals.length : 0;

    let bars = "";
    let hits = "";
    for (let i = 0; i < daysInMonth; i++) {
      const v = data[i];
      const cx = i * slot + slot / 2;
      if (v > 0) {
        const barH = Math.max(2, (v / scale) * areaH);
        const yy = padT + areaH - barH;
        const col = goal && v > goal ? "var(--warn)" : "var(--cal)";
        bars += `<rect x="${(cx - barW / 2).toFixed(1)}" y="${yy.toFixed(1)}" width="${barW.toFixed(1)}" height="${barH.toFixed(1)}" rx="3" fill="${col}" />`;
      }
      // full-height invisible hit target for hover
      hits += `<rect data-i="${i}" x="${(i * slot).toFixed(1)}" y="0" width="${slot.toFixed(1)}" height="${H}" fill="transparent" />`;
    }

    // goal line + label
    let goalLine = "";
    if (goal > 0 && goal < scale) {
      const gy = y(goal);
      goalLine = `<line x1="0" y1="${gy.toFixed(1)}" x2="${W}" y2="${gy.toFixed(1)}" stroke="var(--border-strong)" stroke-width="1.5" stroke-dasharray="4 4" />
        <text x="${W - 4}" y="${(gy - 4).toFixed(1)}" text-anchor="end" fill="var(--muted-foreground)" font-family="var(--font-mono)" font-size="10">goal ${round(goal)}</text>`;
    }

    // avg line
    let avgLine = "";
    if (avg > 0 && avg < scale) {
      const ay = y(avg);
      avgLine = `<line x1="0" y1="${ay.toFixed(1)}" x2="${W}" y2="${ay.toFixed(1)}" stroke="var(--accent)" stroke-width="1.25" stroke-dasharray="1 3" opacity="0.7" />`;
    }

    // x ticks (1, and every ~7 days, and last)
    let ticks = "";
    const tickDays = new Set([1, 8, 15, 22, daysInMonth]);
    tickDays.forEach((d) => {
      const cx = (d - 1) * slot + slot / 2;
      ticks += `<text x="${cx.toFixed(1)}" y="${H - 6}" text-anchor="middle" fill="var(--muted-foreground)" font-family="var(--font-mono)" font-size="9">${d}</text>`;
    });

    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" role="img" aria-label="Daily calories for the month; goal ${round(goal)} kcal; average ${round(avg)} kcal on ${loggedVals.length} logged days.">
      <line x1="0" y1="${padT + areaH}" x2="${W}" y2="${padT + areaH}" stroke="var(--border)" stroke-width="1" />
      ${goalLine}${avgLine}${bars}${ticks}${hits}
    </svg>`;

    // hover
    const tip = $("chart-tip")!;
    host.querySelectorAll<SVGRectElement>("rect[data-i]").forEach((r) => {
      r.style.cursor = "default";
      r.addEventListener("mouseenter", () => {
        const i = Number(r.dataset.i);
        const v = data[i];
        const key = dateKey(new Date(calYear, calMonth, i + 1));
        tip.textContent = `${fmtDayShort(key)} · ${v > 0 ? round(v) + " kcal" : "—"}`;
        tip.classList.remove("hidden");
      });
      r.addEventListener("mousemove", (ev) => {
        const rect = host.getBoundingClientRect();
        const mx = (ev as MouseEvent).clientX - rect.left;
        tip.style.left = Math.min(rect.width - 8, Math.max(8, mx)) + "px";
        tip.style.top = "0px";
        tip.style.transform = "translate(-50%, -110%)";
      });
      r.addEventListener("mouseleave", () => tip.classList.add("hidden"));
    });

    // stats
    $("month-stats")!.innerHTML = [
      { label: "Avg / day", value: avg ? round(avg) : "—", sub: "kcal", color: "var(--cal)" },
      { label: "Days logged", value: loggedVals.length, sub: `of ${daysInMonth}`, color: "var(--foreground)" },
      {
        label: "Avg protein",
        value: loggedVals.length ? round(Object.keys(state.log).filter((k) => k.startsWith(`${calYear}-${String(calMonth + 1).padStart(2, "0")}`)).reduce((a, k) => a + totalsFor(state.log[k]).protein, 0) / loggedVals.length) : "—",
        sub: "g",
        color: "var(--protein)",
      },
    ]
      .map(
        (s) => `<div class="rounded-xl border border-border bg-background/40 p-3 text-center">
          <p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">${s.label}</p>
          <p class="mt-1 font-mono text-lg font-bold tabular-nums" style="color:${s.color}">${s.value}</p>
          <p class="font-mono text-[10px] text-muted-foreground">${s.sub}</p>
        </div>`
      )
      .join("");
  }

  // ---------- Catalog ----------
  function renderCatalog(filter = "") {
    const list = $("catalog-list")!;
    const q = filter.trim().toLowerCase();
    const foods = state.foods
      .filter((f) => !q || f.name.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
    if (!foods.length) {
      list.innerHTML = `<p class="px-1 py-6 text-center font-mono text-xs text-muted-foreground">No matches. Try the “New food” tab.</p>`;
      return;
    }
    list.innerHTML = foods
      .map(
        (f) => `<div class="flex items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2">
          <button data-add-food="${f.id}" class="min-w-0 flex-1 text-left">
            <p class="truncate text-sm font-medium text-foreground">${escapeHtml(f.name)}</p>
            <p class="font-mono text-[11px] text-muted-foreground">${trim(f.serving)}${escapeHtml(f.unit)} · ${round(f.kcal)} kcal ·
              <span style="color:var(--protein)">${round(f.protein)}p</span>
              <span style="color:var(--carbs)">${round(f.carbs)}c</span>
              <span style="color:var(--fat)">${round(f.fat)}f</span></p>
          </button>
          ${f.custom ? `<button data-del-food="${f.id}" class="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground transition hover:bg-warn/15 hover:text-warn" aria-label="Delete ${escapeHtml(f.name)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg></button>` : ""}
          <button data-add-food="${f.id}" class="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/15 text-primary transition hover:bg-primary/25" aria-label="Log ${escapeHtml(f.name)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-4 w-4"><path d="M12 5v14M5 12h14"/></svg></button>
        </div>`
      )
      .join("");
  }

  // ---------- Mutations ----------
  function logFood(food: Food, qty: number, dayKey: string) {
    const entry: Entry = {
      id: uid("e"),
      foodId: food.id,
      name: food.name,
      qty,
      serving: food.serving,
      unit: food.unit,
      kcal: food.kcal * qty,
      protein: food.protein * qty,
      carbs: food.carbs * qty,
      fat: food.fat * qty,
      ts: Date.now(),
    };
    (state.log[dayKey] ||= []).push(entry);
    commit();
    renderAll();
    toast(`Logged ${food.name}`);
  }

  function removeEntry(dayKey: string, id: string) {
    const arr = state.log[dayKey];
    if (!arr) return;
    state.log[dayKey] = arr.filter((e) => e.id !== id);
    if (!state.log[dayKey].length) delete state.log[dayKey];
    commit();
    renderAll();
  }

  // ---------- Modals ----------
  function openModal(id: string) {
    const m = $(id);
    if (!m) return;
    m.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    const focusEl = m.querySelector<HTMLElement>("input, button:not([data-close])");
    if (id !== "modal-add") focusEl?.focus();
  }
  function closeModal(id: string) {
    $(id)?.classList.add("hidden");
    if (!document.querySelector('[role="dialog"]:not(.hidden)')) document.body.style.overflow = "";
  }
  function closeAllModals() {
    document.querySelectorAll<HTMLElement>('[role="dialog"]').forEach((m) => m.classList.add("hidden"));
    document.body.style.overflow = "";
  }

  function openQty(food: Food) {
    pendingFood = food;
    $("qty-food")!.textContent = food.name;
    $("qty-per")!.textContent = `per ${trim(food.serving)} ${food.unit} · ${round(food.kcal)} kcal`;
    $("qty-day")!.textContent = selected === todayKey() ? "today" : fmtDayShort(selected);
    const input = $<HTMLInputElement>("qty-input")!;
    input.value = "1";
    renderQtyPreview();
    openModal("modal-qty");
    setTimeout(() => input.select(), 30);
  }

  function renderQtyPreview() {
    if (!pendingFood) return;
    const qty = Math.max(0, Number($<HTMLInputElement>("qty-input")!.value) || 0);
    const cells = [
      { v: pendingFood.kcal * qty, label: "kcal", color: "var(--cal)" },
      { v: pendingFood.protein * qty, label: "P", color: "var(--protein)" },
      { v: pendingFood.carbs * qty, label: "C", color: "var(--carbs)" },
      { v: pendingFood.fat * qty, label: "F", color: "var(--fat)" },
    ];
    $("qty-preview")!.innerHTML = cells
      .map(
        (c) => `<div class="rounded-lg border border-border bg-background/50 py-2">
          <p class="font-mono text-sm font-bold tabular-nums" style="color:${c.color}">${round(c.v)}</p>
          <p class="font-mono text-[10px] text-muted-foreground">${c.label}</p>
        </div>`
      )
      .join("");
  }

  function switchTab(tab: string) {
    document.querySelectorAll<HTMLElement>(".tab-btn").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === tab)));
    document.querySelectorAll<HTMLElement>("[data-panel]").forEach((p) => p.classList.toggle("hidden", p.dataset.panel !== tab));
  }

  // ---------- Goals ----------
  function fillGoalsForm() {
    $<HTMLInputElement>("g-cal")!.value = String(state.goals.calories);
    $<HTMLInputElement>("g-protein")!.value = String(state.goals.protein);
    $<HTMLInputElement>("g-carbs")!.value = String(state.goals.carbs);
    $<HTMLInputElement>("g-fat")!.value = String(state.goals.fat);
    updateGoalsHint();
  }
  function updateGoalsHint() {
    const p = Number($<HTMLInputElement>("g-protein")!.value) || 0;
    const c = Number($<HTMLInputElement>("g-carbs")!.value) || 0;
    const f = Number($<HTMLInputElement>("g-fat")!.value) || 0;
    const kcal = p * 4 + c * 4 + f * 9;
    $("goals-hint")!.textContent = `Macros add up to ~${round(kcal)} kcal (4/4/9).`;
  }

  // ---------- Render all ----------
  function renderDateLabel() {
    $("date-label")!.textContent = selected === todayKey() ? "Today" : fmtDayShort(selected);
  }
  function renderAll() {
    renderDateLabel();
    renderSummary();
    renderQuickAdd();
    renderLog();
    renderCalendar();
    renderMonthly();
  }

  // ---------- Helpers ----------
  function escapeHtml(s: string) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
  }
  function trim(n: number) {
    return String(round(n, 2));
  }
  function shiftDay(delta: number) {
    const d = parseKey(selected);
    d.setDate(d.getDate() + delta);
    selected = dateKey(d);
    // keep the calendar month in view with the selected day
    calYear = d.getFullYear();
    calMonth = d.getMonth();
    renderAll();
  }

  // ---------- Events (delegated) ----------
  document.addEventListener("click", (ev) => {
    const el = (ev.target as HTMLElement).closest<HTMLElement>("[data-nav],[data-open],[data-close],[data-day],[data-remove],[data-add-food],[data-del-food],[data-quick],[data-tab],[data-qty-step]");
    if (!el) return;

    if (el.dataset.nav) {
      const n = el.dataset.nav;
      if (n === "prev-day") shiftDay(-1);
      else if (n === "next-day") shiftDay(1);
      else if (n === "today") {
        selected = todayKey();
        const t = new Date();
        calYear = t.getFullYear();
        calMonth = t.getMonth();
        renderAll();
      } else if (n === "prev-month") {
        calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; }
        renderCalendar(); renderMonthly();
      } else if (n === "next-month") {
        calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; }
        renderCalendar(); renderMonthly();
      }
      return;
    }
    if (el.dataset.open) {
      const which = el.dataset.open;
      if (which === "add") { switchTab("catalog"); renderCatalog(($<HTMLInputElement>("food-search")?.value) || ""); openModal("modal-add"); }
      else if (which === "goals") { fillGoalsForm(); openModal("modal-goals"); }
      return;
    }
    if (el.hasAttribute("data-close")) { closeAllModals(); return; }
    if (el.dataset.day) { selected = el.dataset.day; renderAll(); return; }
    if (el.dataset.remove) { removeEntry(selected, el.dataset.remove); return; }
    if (el.dataset.quick) {
      const f = state.foods.find((x) => x.id === el.dataset.quick);
      if (f) logFood(f, 1, selected);
      return;
    }
    if (el.dataset.addFood) {
      const f = state.foods.find((x) => x.id === el.dataset.addFood);
      if (f) openQty(f);
      return;
    }
    if (el.dataset.delFood) {
      state.foods = state.foods.filter((x) => x.id !== el.dataset.delFood);
      commit();
      renderCatalog(($<HTMLInputElement>("food-search")?.value) || "");
      toast("Food removed");
      return;
    }
    if (el.dataset.tab) { switchTab(el.dataset.tab); return; }
    if (el.dataset.qtyStep) {
      const input = $<HTMLInputElement>("qty-input")!;
      const step = Number(el.dataset.qtyStep);
      input.value = String(Math.max(0, round((Number(input.value) || 0) + step * 0.5, 2)));
      renderQtyPreview();
      return;
    }
  });

  // qty input live preview
  $("qty-input")?.addEventListener("input", renderQtyPreview);

  // qty confirm
  $("qty-confirm")?.addEventListener("click", () => {
    if (!pendingFood) return;
    const qty = Math.max(0, Number($<HTMLInputElement>("qty-input")!.value) || 0);
    if (qty <= 0) { toast("Enter a quantity"); return; }
    logFood(pendingFood, qty, selected);
    pendingFood = null;
    closeAllModals();
  });

  // search
  $("food-search")?.addEventListener("input", (e) => renderCatalog((e.target as HTMLInputElement).value));

  // new food form
  $("nf-kcal")?.addEventListener("input", () => {});
  ["nf-protein", "nf-carbs", "nf-fat"].forEach((id) =>
    $(id)?.addEventListener("input", () => {
      const p = Number($<HTMLInputElement>("nf-protein")!.value) || 0;
      const c = Number($<HTMLInputElement>("nf-carbs")!.value) || 0;
      const f = Number($<HTMLInputElement>("nf-fat")!.value) || 0;
      $("nf-kcal-hint")!.textContent = `≈ ${round(p * 4 + c * 4 + f * 9)} kcal from macros`;
    })
  );

  $<HTMLFormElement>("new-food-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const num = (k: string) => Math.max(0, Number(fd.get(k)) || 0);
    const name = String(fd.get("name") || "").trim();
    if (!name) return;
    const food: Food = {
      id: uid("f"),
      name,
      serving: num("serving") || 1,
      unit: String(fd.get("unit") || "g").trim() || "g",
      kcal: num("kcal"),
      protein: num("protein"),
      carbs: num("carbs"),
      fat: num("fat"),
      custom: true,
    };
    state.foods.push(food);
    commit();
    (e.target as HTMLFormElement).reset();
    $("nf-kcal-hint")!.textContent = "";
    openQty(food); // straight into logging it
  });

  // goals form
  ["g-protein", "g-carbs", "g-fat"].forEach((id) => $(id)?.addEventListener("input", updateGoalsHint));
  $<HTMLFormElement>("goals-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const num = (k: string, d: number) => { const v = Number(fd.get(k)); return v > 0 ? v : d; };
    state.goals = {
      calories: num("calories", state.goals.calories),
      protein: num("protein", state.goals.protein),
      carbs: num("carbs", state.goals.carbs),
      fat: num("fat", state.goals.fat),
    };
    commit();
    closeAllModals();
    renderAll();
    toast("Goals updated");
  });

  // esc closes modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
  });

  // responsive chart
  let rt: number | undefined;
  window.addEventListener("resize", () => {
    window.clearTimeout(rt);
    rt = window.setTimeout(renderMonthly, 150);
  });

  renderAll();
}
