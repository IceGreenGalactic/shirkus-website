import legacyStats from "../../data/legacyStats.json";

export function getLegacyToday(date) {
  const globalDay = legacyStats.global?.days?.[date];

  const pages = (legacyStats.pages || [])
    .map((page) => {
      const day = page.days?.[date];

      if (!day) return null;

      return {
        page: page.page,
        sessions: Number(day.sessions || 0),
        uniqueVisitors: Number(day.uniqueVisitors || 0),
        pageviews: 0,
      };
    })
    .filter(Boolean);

  return {
    totals: {
      sessions: Number(globalDay?.sessions || 0),

      uniqueVisitors: Number(globalDay?.uniqueVisitors || 0),

      pageviews: 0,
    },

    pages,
  };
}

export function getLegacyTotals() {
  return {
    sessions: Number(legacyStats.global?.sessionsTotal || 0),

    uniqueVisitors: Number(legacyStats.global?.uniqueVisitorsTotal || 0),
  };
}

export function getLegacyPages() {
  return legacyStats.pages || [];
}
