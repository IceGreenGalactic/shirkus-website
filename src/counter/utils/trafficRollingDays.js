import { ymdOslo } from "./ranges.js";

// Thirty calendar dates, including today. Adjacent pages never overlap.
export function trafficRollingDays(offset = 0, today = ymdOslo()) {
  const end = new Date(`${today}T12:00:00Z`);
  end.setUTCDate(end.getUTCDate() - offset * 30);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 29);
  return {start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10)};
}
