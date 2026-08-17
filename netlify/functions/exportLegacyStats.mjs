export default async () => {
  try {
    const projectId = process.env.SANITY_PROJECT_ID;
    const dataset = process.env.SANITY_DATASET || "production";
    const apiVersion = process.env.SANITY_API_VERSION || "2024-02-25";
    const token = process.env.SANITY_TOKEN;

    if (!projectId) {
      return new Response(
        JSON.stringify({
          error: "Mangler SANITY_PROJECT_ID",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        },
      );
    }

    const query = `{
      "global": *[_id == "stats.global"][0]{
        _id,
        _type,
        sessionsTotal,
        sessionsToday,
        sessionsTodayDate,
        uniquesTotal,
        uniqueHashes,
        sessions,
        days
      },

      "pageStats": *[_type == "pageStats"]{
        _id,
        _type,
        page,
        sessionsTotal,
        sessionsToday,
        sessionsTodayDate,
        uniquesTotal,
        uniqueHashes,
        sessions,
        days
      }
    }`;

    const url =
      `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}` +
      `?query=${encodeURIComponent(query)}`;

    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Sanity error:", result);

      return new Response(JSON.stringify(result), {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }

    return new Response(
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          dataset,
          data: result.result,
        },
        null,
        2,
      ),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    );
  } catch (error) {
    console.error("Legacy export error:", error);

    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    );
  }
};
