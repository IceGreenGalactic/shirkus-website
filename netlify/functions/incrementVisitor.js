import { createClient } from "@sanity/client";
import crypto from "crypto";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: "2023-01-01",
});

function getClientIp(headers) {
  return (
    headers["x-nf-client-connection-ip"] ||
    headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    headers["x-real-ip"] ||
    headers["client-ip"] ||
    ""
  );
}

function normalizeIp(ip) {
  if (!ip) return "unknown";
  if (ip === "127.0.0.1" || ip === "::1" || ip === "localhost")
    return "local-dev";
  

  const parts = ip.split(".");
  if (parts.length === 4) {
    const [a, b] = parts.map(Number);
    if (a === 10) return "local-dev";
    if (a === 192 && b === 168) return "local-dev";
    if (a === 172 && b >= 16 && b <= 31) return "local-dev";
  }
  return ip;
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Only POST method allowed" };
  }

  try {
    const { page = "unknown", deviceId } = JSON.parse(event.body || "{}");

    
    const ipRaw = getClientIp(event.headers);
    const ipNorm = normalizeIp(ipRaw);
    const keySource = deviceId || ipNorm || "unknown";


    const keyHash = crypto.createHash("sha256").update(keySource).digest("hex");
    const docId = `visitor.${keyHash}`;

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);

    await client.createIfNotExists({
      _id: docId,
      _type: "visitorLog",
      ip: keyHash, 
      lastSessionStart: now.toISOString(),
      visits: [], 
    });


    const existing = await client.fetch(`*[_id == $id][0]`, { id: docId });
    const visits = existing?.visits || [];
    const idx = visits.findIndex((v) => v.page === page && v.date === today);

    let shouldCountAsUniqueVisit = false;
    const lastSessionStart = new Date(existing?.lastSessionStart || 0);
    if (lastSessionStart < fiveHoursAgo) shouldCountAsUniqueVisit = true;

    if (idx !== -1) {
      visits[idx].count += 1;
      visits[idx].lastVisit = now.toISOString();
    } else {
      visits.push({
        _key: crypto.randomUUID(),
        page,
        date: today,
        count: 1,
        lastVisit: now.toISOString(),
      });
    }

    const patch = client.patch(docId).set({ visits });
    if (shouldCountAsUniqueVisit)
      patch.set({ lastSessionStart: now.toISOString() });
    await patch.commit();


    if (shouldCountAsUniqueVisit) {
      const stats = await client.fetch(
        `*[_type == "siteStats"][0]{_id, visitors}`
      );
      if (stats?._id)
        await client.patch(stats._id).inc({ visitors: 1 }).commit();
      else await client.create({ _type: "siteStats", visitors: 1 });
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
