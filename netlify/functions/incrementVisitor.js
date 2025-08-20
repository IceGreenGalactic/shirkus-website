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

    const ipRes = await fetch("https://api.ipify.org?format=json");
    const { ip } = await ipRes.json();

    const hashedIp = crypto.createHash("sha256").update(ip).digest("hex");

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);

    const existingDoc = await client.fetch(
      `*[_type == "visitorLog" && ip == $ip][0]`,
      { ip: hashedIp }
    );

    let shouldCountAsUniqueVisit = false;

    if (existingDoc) {
      const lastSessionStart = new Date(existingDoc.lastSessionStart || 0);
      shouldCountAsUniqueVisit = lastSessionStart < fiveHoursAgo;

      const visits = existingDoc.visits || [];
      const index = visits.findIndex(
        (v) => v.page === page && v.date === today
      );

      if (index !== -1) {
        visits[index].count += 1;
        visits[index].lastVisit = now.toISOString();
      } else {
        visits.push({
          _key: crypto.randomUUID(),
          page,
          date: today,
          count: 1,
          lastVisit: now.toISOString(),
        });
      }

      const patchData = { visits };
      if (shouldCountAsUniqueVisit) {
        patchData.lastSessionStart = now.toISOString();
      }

      await client.patch(existingDoc._id).set(patchData).commit();
    } else {
      await client.create({
        _type: "visitorLog",
        ip: hashedIp,
        lastSessionStart: now.toISOString(),
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
      } else {
        await client.create({ _type: "siteStats", visitors: 1 });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Visit logged" }),
    };
  } catch (err) {
    console.error("Feil i incrementVisitor:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error", error: err.message }),
    };
  }
}
