import assert from 'node:assert/strict';
import {trafficWeek} from '../src/counter/utils/trafficWeeks.js';
import {fetchPeriodTraffic, fetchAllTimeTraffic} from '../src/counter/utils/trafficStats.js';
import handler from '../netlify/functions/getPosthogStats.mjs';
import {trafficRollingDays} from '../src/counter/utils/trafficRollingDays.js';
import {compareTraffic, countryFlag, trafficPeriodRows} from '../src/counter/utils/trafficComparison.js';

assert.deepEqual(trafficRollingDays(0, '2026-12-01'), {start: '2026-11-02', end: '2026-12-01'});
assert.deepEqual(trafficRollingDays(1, '2026-12-01'), {start: '2026-10-03', end: '2026-11-01'});
for (const today of ['2026-01-01', '2024-03-10', '2026-03-30', '2026-10-26']) {
  let previous;
  for (let offset = 0; offset < 4; offset++) {
    const range = trafficRollingDays(offset, today);
    assert.equal((Date.parse(range.end) - Date.parse(range.start)) / 86400000 + 1, 30);
    if (previous) assert.equal(Date.parse(previous.start) - Date.parse(range.end), 86400000);
    previous = range;
  }
}

assert.deepEqual(trafficWeek(0, '2026-11-06'), {
  start: '2026-11-02', end: '2026-11-08', number: 45, year: 2026,
});
assert.deepEqual(trafficWeek(1, '2026-11-06'), {
  start: '2026-10-26', end: '2026-11-01', number: 44, year: 2026,
});
assert.deepEqual(trafficWeek(0, '2027-01-01'), {
  start: '2026-12-28', end: '2027-01-03', number: 53, year: 2026,
});
assert.equal(trafficWeek(0, '2026-03-29').start, '2026-03-23');
assert.equal(trafficWeek(0, '2026-03-30').start, '2026-03-30');

// Mock PostHog: verify the actual handler's queries without external requests or credentials.
process.env.POSTHOG_PROJECT_ID = 'test';
process.env.POSTHOG_PERSONAL_API_KEY = 'test';
let queries = [];
globalThis.fetch = async (_url, options) => {
  const query = JSON.parse(options.body).query.query;
  queries.push(query);
  const results = query.includes('GROUP BY country') ? [['Norway', 7]]
    : query.includes('GROUP BY source') ? [['Google', 3]] : [];
  return Response.json({results});
};
const request = (query) => new Request(`https://example.test/.netlify/functions/getPosthogStats?${query}`);
let response = await handler(request('start=2026-10-26&end=2026-11-01&traffic=1'));
assert.equal(response.status, 200);
assert.equal(queries.length, 2);
for (const query of queries) {
  assert.ok(query.includes("toDateTime('2026-10-26 00:00:00', 'Europe/Oslo')"));
  assert.ok(query.includes("toDateTime('2026-11-01 00:00:00', 'Europe/Oslo')"));
  assert.ok(!query.includes('INTERVAL 30 DAY'));
}
assert.ok(queries.some((query) => query.includes('LIMIT 1000')));
const weekly = await response.json();
assert.deepEqual(weekly.traffic.countries, [{country: 'Norway', visitors: 7}]);
assert.equal(weekly.traffic.periodDays, 7);
queries = [];
response = await handler(request('start=2026-10-01&end=2026-10-31&traffic=1'));
assert.equal(response.status, 200);
assert.equal((await response.json()).traffic.periodDays, 31);
assert.equal(queries.length, 2);
for (const query of queries) assert.ok(query.includes("toDateTime('2026-10-01 00:00:00', 'Europe/Oslo')"));
queries = [];
response = await handler(request('range=today&includeTraffic=true'));
assert.equal(response.status, 200);
assert.equal((await response.json()).traffic.periodDays, 30);
assert.equal(queries.length, 4);
assert.equal(queries.filter((query) => query.includes('INTERVAL 30 DAY')).length, 2);
queries = [];
response = await handler(request('range=all&traffic=1'));
assert.equal(response.status, 200);
assert.equal(queries.length, 2);
assert.equal((await response.json()).traffic.periodDays, null);
for (const query of queries) {
  assert.ok(query.includes('AND 1 = 1'));
  assert.ok(!query.includes('INTERVAL 30 DAY'));
  assert.ok(!query.includes('toDateTime('));
}
queries = [];
await handler(request('range=today'));
assert.equal(queries.length, 2);
queries = [];
assert.equal((await handler(request('start=2026-11-08&end=2026-11-02&traffic=1'))).status, 400);
assert.equal((await handler(request("start=bad&end=2026-11-02&traffic=1"))).status, 400);
assert.equal(queries.length, 0);

let calls = 0;
globalThis.fetch = async () => {
  calls++;
  return Response.json({traffic: {countries: [], sources: []}});
};
const first = fetchPeriodTraffic('2026-11-02', '2026-11-08');
const second = fetchPeriodTraffic('2026-11-02', '2026-11-08');
assert.equal(first, second);
await Promise.all([first, second]);
assert.equal(calls, 1);
await fetchPeriodTraffic('2026-11-02', '2026-11-08');
assert.equal(calls, 2, 'Refresh must request fresh data');
globalThis.fetch = async (url) => {
  assert.ok(url.includes('range=all'));
  assert.ok(url.includes('traffic=1'));
  return Response.json({traffic: {countries: [{country: 'Norway', visitors: 9}], sources: []}});
};
assert.equal((await fetchAllTimeTraffic()).countries[0].visitors, 9);
globalThis.fetch = async () => Response.json({error: 'Test failure'}, {status: 503});
await assert.rejects(fetchPeriodTraffic('2026-11-02', '2026-11-08'), /Test failure/);

const comparison = compareTraffic([
  {countries: [{country: 'Norway', visitors: 20}, {country: 'Sweden', visitors: 3}]},
  {countries: [{country: 'Sweden', visitors: 2}, {country: 'Norway', visitors: 8}]},
  {countries: [{country: 'Canada', visitors: 1}, {country: 'Norway', visitors: 4}]},
], 'countries');
assert.deepEqual(comparison.rows, [
  {label: 'Norway', values: [20, 8, 4]},
  {label: 'Sweden', values: [3, 2, 0]},
  {label: 'Canada', values: [0, 0, 1]},
]);
assert.deepEqual(comparison.totals, [23, 10, 5]);
assert.deepEqual(comparison.maxima, [20, 8, 4]);
assert.equal(compareTraffic([{countries: Array.from({length: 27}, (_, i) => ({country: `Country ${i}`, visitors: 1}))}, null, null], 'countries').totals[0], 27);
assert.deepEqual(compareTraffic([null, null, null], 'sources').totals, [0, 0, 0]);
assert.deepEqual(compareTraffic([{sources: [{source: 'Google', sessions: 7}]}, null, null], 'sources').rows[0].values, [7, 0, 0]);
assert.equal(countryFlag('Norway'), '\u{1F1F3}\u{1F1F4}');
assert.equal(countryFlag('Unrecognized place'), null);
assert.deepEqual(trafficPeriodRows({countries: [
  {country: 'Zero', visitors: 0}, {country: 'Sweden', visitors: 2},
  {country: 'Norway', visitors: 8}, {country: 'Invalid', visitors: -1},
]}, 'countries'), [{label: 'Norway', value: 8}, {label: 'Sweden', value: 2}]);
assert.deepEqual(trafficPeriodRows({sources: [
  {source: 'Google', sessions: 0}, {source: 'Direkte', sessions: 4}, {source: 'Bing', sessions: 9},
]}, 'sources'), [{label: 'Bing', value: 9}, {label: 'Direkte', value: 4}]);
assert.deepEqual(trafficPeriodRows(null, 'countries'), []);
console.log('PASS: 30-day/ISO periods, DST/leap years, filters, full country query, aligned comparison rows, complete totals, flags, request sharing, refresh and errors. No live PostHog calls.');
