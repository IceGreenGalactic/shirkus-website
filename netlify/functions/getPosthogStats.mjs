async function runQuery(query, projectId, apiKey) {
  const response = await fetch(
    `https://eu.posthog.com/api/projects/${projectId}/query/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          kind: "HogQLQuery",
          query,
        },
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("PostHog error:", data);
    throw new Error(data?.detail || "PostHog query feilet");
  }

  return data;
}

export default async (request) => {
  try {
    const projectId = process.env.POSTHOG_PROJECT_ID;
    const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;

    if (!projectId || !apiKey) {
      return new Response(
        JSON.stringify({
          error: "Mangler PostHog miljøvariabler",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const url = new URL(request.url);
    const range = url.searchParams.get("range");
    const start = url.searchParams.get("start");
    const end = url.searchParams.get("end");

    let dateFilter;

    if (start && end) {
      dateFilter = `
    timestamp >= toDateTime('${start} 00:00:00', 'Europe/Oslo')
    AND timestamp < toDateTime('${end} 00:00:00', 'Europe/Oslo') + INTERVAL 1 DAY
  `;
    } else {
      switch (range || "today") {
        case "today":
          dateFilter = "timestamp >= toStartOfDay(now(), 'Europe/Oslo')";
          break;

        case "week":
          dateFilter = "timestamp >= toStartOfWeek(now(), 1, 'Europe/Oslo')";
          break;

        case "month":
          dateFilter = "timestamp >= toStartOfMonth(now(), 'Europe/Oslo')";
          break;

        case "year":
          dateFilter = "timestamp >= toStartOfYear(now(), 'Europe/Oslo')";
          break;

        case "all":
          dateFilter = "1 = 1";
          break;

        default:
          return new Response(
            JSON.stringify({
              error: "Ugyldig range",
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
      }
    }

    const totalsQuery = `
      SELECT
        count() AS pageviews,
        uniq(distinct_id) AS uniqueVisitors,
        uniq($session_id) AS sessions
      FROM events
      WHERE
        event = '$pageview'
        AND ${dateFilter}
    `;

    const pagesQuery = `
      SELECT
        properties.pathname AS page,
        count() AS pageviews,
        uniq(distinct_id) AS uniqueVisitors,
        uniq($session_id) AS sessions
      FROM events
      WHERE
        event = '$pageview'
        AND ${dateFilter}
        AND properties.pathname IS NOT NULL
      GROUP BY page
      ORDER BY pageviews DESC
    `;

    const [totalsData, pagesData] = await Promise.all([
      runQuery(totalsQuery, projectId, apiKey),
      runQuery(pagesQuery, projectId, apiKey),
    ]);

    const totalsRow = totalsData?.results?.[0] || [];

    const totals = {
      pageviews: Number(totalsRow[0] || 0),
      uniqueVisitors: Number(totalsRow[1] || 0),
      sessions: Number(totalsRow[2] || 0),
    };

    const pages = (pagesData?.results || []).map((row) => ({
      page: row[0],
      pageviews: Number(row[1] || 0),
      uniqueVisitors: Number(row[2] || 0),
      sessions: Number(row[3] || 0),
    }));

    return new Response(
      JSON.stringify({
        range,
        totals,
        pages,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
