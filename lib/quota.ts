// lib/quota.ts
export const FREE_SCANS_PER_DAY = 3;

function todayStamp() {
  const d = new Date();
  // use UTC so it resets consistently for everyone
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
}

export function getTodayKey() {
  return `ca_scans_${todayStamp()}`;
}

export function getRemainingScans(): number {
  if (typeof window === "undefined") return FREE_SCANS_PER_DAY;
  const key = getTodayKey();
  const used = Number(localStorage.getItem(key) || "0");
  return Math.max(0, FREE_SCANS_PER_DAY - used);
}

export function consumeScan(): number {
  const key = getTodayKey();
  const used = Number(localStorage.getItem(key) || "0");
  const next = used + 1;
  localStorage.setItem(key, String(next));
  return Math.max(0, FREE_SCANS_PER_DAY - next);
}
