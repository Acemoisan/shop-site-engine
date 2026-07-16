// Durability layer for the local-first hub.
// On-device localStorage can be wiped by the browser (clearing site data, iOS's
// 7-day script-storage rule, storage-pressure eviction). This module gives the
// user a real safety net: a full JSON export/import of ALL hub data, plus a
// request for "persistent" storage where the browser supports it.

const LAST_BACKUP_KEY = "acemf:lastBackup";

// Everything the hub stores lives under localStorage on this origin, so a full
// export covers every app (MacroFactor today, future habit/other apps too).
export interface Backup {
  app: "acemoisan-hub";
  version: 1;
  exportedAt: string; // ISO
  data: Record<string, string>;
}

export function exportAll(): Backup {
  const data: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k) continue;
    const v = localStorage.getItem(k);
    if (v != null) data[k] = v;
  }
  return { app: "acemoisan-hub", version: 1, exportedAt: new Date().toISOString(), data };
}

export function downloadBackup(): void {
  const backup = exportAll();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  a.href = url;
  a.download = `acemoisan-backup-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  markBackedUp();
}

export interface ParsedBackup {
  backup: Backup;
  keys: number;
  exportedAt: Date | null;
}

/** Parse + validate a backup file's text. Throws on anything that isn't ours. */
export function parseBackup(text: string): ParsedBackup {
  const obj = JSON.parse(text);
  if (!obj || obj.app !== "acemoisan-hub" || typeof obj.data !== "object" || obj.data == null) {
    throw new Error("Not an acemoisan hub backup file.");
  }
  const exportedAt = obj.exportedAt ? new Date(obj.exportedAt) : null;
  return { backup: obj as Backup, keys: Object.keys(obj.data).length, exportedAt: exportedAt && !isNaN(+exportedAt) ? exportedAt : null };
}

/** Restore: write every key from the backup back into localStorage. */
export function restore(backup: Backup): void {
  for (const [k, v] of Object.entries(backup.data)) {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* one bad key shouldn't abort the whole restore */
    }
  }
}

export function lastBackup(): Date | null {
  const raw = localStorage.getItem(LAST_BACKUP_KEY);
  if (!raw) return null;
  const d = new Date(Number(raw));
  return isNaN(+d) ? null : d;
}

export function markBackedUp(): void {
  try {
    localStorage.setItem(LAST_BACKUP_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

export function daysSinceBackup(): number | null {
  const d = lastBackup();
  if (!d) return null;
  return Math.floor((Date.now() - +d) / 86_400_000);
}

/** Ask the browser to keep this origin's storage (exempt from auto-eviction).
 *  Honoured on Chrome/Firefox; iOS Safari support is limited. Best-effort. */
export async function requestPersistence(): Promise<boolean> {
  try {
    if (navigator.storage?.persisted && (await navigator.storage.persisted())) return true;
    if (navigator.storage?.persist) return await navigator.storage.persist();
  } catch {
    /* not supported */
  }
  return false;
}

export async function isPersisted(): Promise<boolean> {
  try {
    return (await navigator.storage?.persisted?.()) ?? false;
  } catch {
    return false;
  }
}
