import { createClient } from "@sanity/client";
import crypto from "crypto";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: "2023-01-01",
});

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Only POST method allowed",
    };
  }

  try {
    const { page = "unknown" } = JSON.parse(event.body || "{}");

    // Hent IP
    const ipRes = await fetch("https://api.ipify.org?format=json");
    const { ip } = await ipRes.json();

    const now = new Date();
    const today = now.toISOString().split("T")[0];

    // Hent dokument for IP
    const existingDoc = await client.fetch(
      `*[_type == "visitorLog" && ip == $ip][0]`,
      { ip }
    );

    let shouldCountAsUniqueVisit = false;

    if (existingDoc) {
      const visits = existingDoc.visits || [];

      // Finn kun hvis det finnes en linje for denne siden OG denne datoen
      const index = visits.findIndex(
        (v) => v.page === page && v.date === today
      );

      if (index !== -1) {
        const lastVisit = new Date(visits[index].lastVisit || 0);
        const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);

        if (lastVisit < fiveHoursAgo) {
          shouldCountAsUniqueVisit = true;
        }

        visits[index].count += 1;
        visits[index].lastVisit = now.toISOString();

        await client.patch(existingDoc._id).set({ visits }).commit();
      } else {
        // 👇 Ny dag eller ny side – legg til ny entry
        const newVisit = {
          _key: crypto.randomUUID(),
          page,
          date: today,
          count: 1,
          lastVisit: now.toISOString(),
        };

        await client
          .patch(existingDoc._id)
          .setIfMissing({ visits: [] })
          .insert("after", "visits[-1]", [newVisit])
          .commit();

        shouldCountAsUniqueVisit = true;
      }
    } else {
      // Første gang IP-en er sett – opprett ny logg
      await client.create({
        _type: "visitorLog",
        ip,
        visits: [
          {
            _key: crypto.randomUUID(),
            page,
            date: today,
            count: 1,
            lastVisit: now.toISOString(),
          },
        ],
      });

      shouldCountAsUniqueVisit = true;
    }

    // 🟢 Øk global counter hvis ny time har gått
    if (shouldCountAsUniqueVisit) {
      const stats = await client.fetch(
        `*[_type == "siteStats"][0]{_id, visitors}`
      );
      if (stats) {
        await client.patch(stats._id).inc({ visitors: 1 }).commit();
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Visit logged" }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error", error: err.message }),
    };
  }
}
