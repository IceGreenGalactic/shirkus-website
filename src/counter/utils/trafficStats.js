const pending = new Map();

export function fetchPeriodTraffic(start, end) {
  return fetchTraffic({start, end});
}

export function fetchAllTimeTraffic() {
  return fetchTraffic({range: "all"});
}

function fetchTraffic(params) {
  const query = new URLSearchParams({...params, traffic: "1"});
  const url = `/.netlify/functions/getPosthogStats?${query}`;
  // Both cards share a request, including repeated effects in StrictMode.
  if (!pending.has(url)) {
    pending.set(url, requestTraffic(url).finally(() => pending.delete(url)));
  }
  return pending.get(url);
}

async function requestTraffic(url) {
  const response = await fetch(url);
  if (!(response.headers.get("content-type") || "").includes("application/json")) {
    throw new Error("Kunne ikke hente trafikkstatistikk");
  }
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Kunne ikke hente trafikkstatistikk");
  return data.traffic;
}
