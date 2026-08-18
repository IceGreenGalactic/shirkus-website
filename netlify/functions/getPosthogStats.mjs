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
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const url = new URL(request.url);

    const range = url.searchParams.get("range");
    const start = url.searchParams.get("start");
    const end = url.searchParams.get("end");

    const includeTraffic = url.searchParams.get("includeTraffic") === "true";

    let dateFilter;

    if (start && end) {
      dateFilter = `
        timestamp >= toDateTime('${start} 00:00:00', 'Europe/Oslo')
        AND timestamp <
          toDateTime('${end} 00:00:00', 'Europe/Oslo')
          + INTERVAL 1 DAY
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
              headers: {
                "Content-Type": "application/json",
              },
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

    const baseQueries = await Promise.all([
      runQuery(totalsQuery, projectId, apiKey),
      runQuery(pagesQuery, projectId, apiKey),
    ]);

    const [totalsData, pagesData] = baseQueries;

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

    /*
     * Trafikkdata brukes bare når
     * includeTraffic=true.
     *
     * Dette er alltid siste 30 dager,
     * uavhengig av range over.
     */
    let countries = [];
    let sources = [];

    if (includeTraffic) {
      /*
       * Ett land per session.
       *
       * Vi bruker første registrerte
       * land i sessionen og teller
       * deretter sessions per land.
       */
      const countriesQuery = `
  SELECT
    country,
    count() AS visitors
  FROM (
    SELECT
      distinct_id,

      argMin(
        properties.$geoip_country_name,
        timestamp
      ) AS country

    FROM events
    WHERE
      event = '$pageview'
      AND timestamp >= now() - INTERVAL 30 DAY

    GROUP BY distinct_id
  )

  WHERE
    country IS NOT NULL
    AND country != ''

  GROUP BY country
  ORDER BY visitors DESC
  LIMIT 10
`;

      /*
       * Første referrer i hver session
       * brukes som trafikkilden.
       *
       * Dette unngår å telle samme
       * person mange ganger bare fordi
       * vedkommende åpner flere sider.
       */
      const sourcesQuery = `
  SELECT
    source,
    count() AS sessions
  FROM (
    SELECT
      sessionId,

      CASE
        WHEN
          referrer IS NULL
          OR referrer = ''
          OR referrer = '$direct'
        THEN 'Direkte'

        WHEN
          positionCaseInsensitive(
            referrer,
            'google.'
          ) > 0
        THEN 'Google'

        WHEN
          positionCaseInsensitive(
            referrer,
            'facebook.com'
          ) > 0
          OR positionCaseInsensitive(
            referrer,
            'fb.com'
          ) > 0
        THEN 'Facebook'

        WHEN
          positionCaseInsensitive(
            referrer,
            'instagram.com'
          ) > 0
        THEN 'Instagram'

        WHEN
          positionCaseInsensitive(
            referrer,
            'bing.com'
          ) > 0
        THEN 'Bing'

        ELSE 'Andre'
      END AS source

    FROM (
      SELECT
        $session_id AS sessionId,

        argMin(
          properties.$referrer,
          timestamp
        ) AS referrer

      FROM events
      WHERE
        event = '$pageview'
        AND timestamp >= now() - INTERVAL 30 DAY
        AND $session_id IS NOT NULL

      GROUP BY sessionId
    )
  )

  GROUP BY source
  ORDER BY sessions DESC
`;

      const [countriesData, sourcesData] = await Promise.all([
        runQuery(countriesQuery, projectId, apiKey),

        runQuery(sourcesQuery, projectId, apiKey),
      ]);

      countries = (countriesData?.results || []).map((row) => ({
        country: row[0] || "Ukjent",
        visitors: Number(row[1] || 0),
      }));

      sources = (sourcesData?.results || []).map((row) => ({
        source: row[0] || "Andre",
        sessions: Number(row[1] || 0),
      }));
    }

    return new Response(
      JSON.stringify({
        range,

        totals,

        pages,

        traffic: {
          periodDays: 30,
          countries,
          sources,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",

          "Cache-Control": "no-store",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
