export const POSTHOG_START = "2026-08-18";
export const LEGACY_END = "2026-08-17";

export const EMPTY_STATS = {
  totals: {
    pageviews: 0,
    uniqueVisitors: 0,
    sessions: 0,
  },
  pages: [],
};

export function ymdOslo(d = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Oslo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);

  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;

  return `${y}-${m}-${day}`;
}

export async function fetchPosthogToday() {
  const response = await fetch(
    "/.netlify/functions/getPosthogStats?range=today",
  );

  if (!response.ok) {
    throw new Error("Kunne ikke hente dagens PostHog-statistikk");
  }

  return response.json();
}

export async function fetchPosthogRange(start, end) {
  const params = new URLSearchParams({
    start,
    end,
  });

  const response = await fetch(
    `/.netlify/functions/getPosthogStats?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(`Kunne ikke hente PostHog-statistikk for ${start}–${end}`);
  }

  return response.json();
}
