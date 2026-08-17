const TOP_SLUGS = [
  "/",
  "/dogs",
  "/litters",
  "/gallery",
  "/about",
  "/contact",
  "/PrivacyPolicy",
];

export function makeEmptyRow(page) {
  return {
    page,
    sessionsTotal: 0,
    sessionsToday: 0,
    uniquesToday: 0,
    uniquesTotal: 0,
    pageviewsTotal: 0,
    pageviewsToday: 0,
  };
}

export function buildAllPageRows({ legacyPages, posthogPages, todayPages }) {
  const pageMap = new Map();

  for (const page of legacyPages || []) {
    pageMap.set(page.page, {
      ...makeEmptyRow(page.page),

      sessionsTotal: Number(page.sessionsTotal || 0),

      uniquesTotal: Number(page.uniqueVisitorsTotal || 0),
    });
  }

  for (const page of posthogPages || []) {
    const existing = pageMap.get(page.page) || makeEmptyRow(page.page);

    existing.sessionsTotal += Number(page.sessions || 0);

    existing.uniquesTotal += Number(page.uniqueVisitors || 0);

    existing.pageviewsTotal += Number(page.pageviews || 0);

    pageMap.set(page.page, existing);
  }

  for (const page of todayPages || []) {
    const existing = pageMap.get(page.page) || makeEmptyRow(page.page);

    existing.sessionsToday = Number(page.sessions || 0);

    existing.uniquesToday = Number(page.uniqueVisitors || 0);

    existing.pageviewsToday = Number(page.pageviews || 0);

    pageMap.set(page.page, existing);
  }

  return Array.from(pageMap.values());
}

export function buildTopRows(allPageRows) {
  return TOP_SLUGS.map(
    (slug) =>
      allPageRows.find((row) => row.page === slug) || makeEmptyRow(slug),
  );
}

export function buildChildrenByGroup(allPageRows) {
  const groups = {
    "/dogs": [],
    "/litters": [],
    "/gallery": [],
  };

  for (const row of allPageRows) {
    if (row.page.startsWith("/dogs/")) {
      groups["/dogs"].push(row);
    }

    if (row.page.startsWith("/litters/")) {
      groups["/litters"].push(row);
    }

    if (row.page.startsWith("/gallery/")) {
      groups["/gallery"].push(row);
    }
  }

  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => b.sessionsTotal - a.sessionsTotal);
  }

  return groups;
}
