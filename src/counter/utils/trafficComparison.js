export function trafficPeriodRows(period, kind) {
  const labelKey = kind === "countries" ? "country" : "source";
  const valueKey = kind === "countries" ? "visitors" : "sessions";
  return (period?.[kind] || [])
    .map((row) => ({label: row[labelKey], value: Number(row[valueKey]) || 0}))
    .filter((row) => row.value > 0)
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "nb"));
}

export function compareTraffic(periods, kind) {
  const labelKey = kind === "countries" ? "country" : "source";
  const valueKey = kind === "countries" ? "visitors" : "sessions";
  const maps = periods.map((period) => new Map(
    (period?.[kind] || []).map((row) => [row[labelKey], Number(row[valueKey]) || 0]),
  ));
  const labels = new Set(maps.flatMap((map) => [...map.keys()]));
  const rows = [...labels].map((label) => ({label, values: maps.map((map) => map.get(label) || 0)}));
  rows.sort((a, b) => b.values[0] - a.values[0] || b.values[1] - a.values[1]
    || b.values[2] - a.values[2] || a.label.localeCompare(b.label, "nb"));
  return {
    rows,
    totals: maps.map((map) => [...map.values()].reduce((sum, count) => sum + count, 0)),
    maxima: maps.map((map) => Math.max(0, ...map.values())),
  };
}

const regionNames = new Intl.DisplayNames(["en"], {type: "region"});
const regionCodes = new Map();
for (let a = 65; a <= 90; a++) for (let b = 65; b <= 90; b++) {
  const code = String.fromCharCode(a, b);
  const name = regionNames.of(code);
  if (name !== code) regionCodes.set(name, code);
}
regionCodes.set("The Netherlands", "NL");
regionCodes.set("Czech Republic", "CZ");
regionCodes.set("United Kingdom", "GB");
export function countryFlag(name) {
  const code = regionCodes.get(name);
  return code ? [...code].map((char) => String.fromCodePoint(127397 + char.charCodeAt(0))).join("") : null;
}
