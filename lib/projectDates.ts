export function toLocalDateString(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
export function parseLocalDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayLocalString() {
  return toLocalDateString(new Date());
}

/**
 * Server-side check for newly created projects. Dates arrive as YYYY-MM-DD (UTC midnight once coerced),
 * so compare against the start of today in UTC. Returns an error message, or null if the dates are fine.
 */
export function validateNewProjectDates(startDate?: Date, endDate?: Date): string | null {
  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  if (startDate && startDate < todayUTC) return "Start date cannot be in the past";
  if (endDate && endDate < todayUTC) return "End date cannot be in the past";
  if (startDate && endDate && startDate > endDate) return "Start date must be before end date";
  return null;
}