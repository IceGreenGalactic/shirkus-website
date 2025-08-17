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

    // Hash IP før lagring
    const hashedIp = crypto.createHash("sha256").update(ip).digest("hex");

    const now = new Date();
    const today = now.toISOString().split("T")[0];

    // Hent dokument for hashed IP
    const existingDoc = await client.fetch(
      `*[_type == "visitorLog" && ip == $ip][0]`,
      { ip: hashedIp }
    );

    let shouldCountAsUniqueVisit = false;

    if (existingDoc) {
      const visits = existingDoc.visits || [];

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
      await client.create({
        _type: "visitorLog",
        ip: hashedIp,
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
