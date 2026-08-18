// code to get visitor numbers from sanity counter into new counter - completely chatgpt code
import fs from "node:fs";

const INPUT = "./legacy-stats-raw-2026-08-17.json";
const OUTPUT = "./src/data/legacyStats.json";

const CUTOFF_DATE = "2026-08-17";

const GAP_START = "2026-07-06";
const GAP_END = "2026-08-16";

const CALIBRATION_START = "2026-06-06";
const CALIBRATION_END = "2026-07-05";

const raw = JSON.parse(
  fs.readFileSync(INPUT, "utf8")
);

const source = raw.data;
const globalSource = source.global || {};
const pageSource = source.pageStats || [];


/* -------------------------
   Små hjelpefunksjoner
------------------------- */

function median(numbers) {
  if (!numbers.length) {
    return 1;
  }

  const sorted = [...numbers].sort(
    (a, b) => a - b
  );

  const middle = Math.floor(
    sorted.length / 2
  );

  if (sorted.length % 2 === 0) {
    return (
      sorted[middle - 1] +
      sorted[middle]
    ) / 2;
  }

  return sorted[middle];
}


function parseYmd(dateStr) {
  const [year, month, day] =
    dateStr.split("-").map(Number);

  return new Date(
    Date.UTC(year, month - 1, day)
  );
}


function getISOWeekKey(dateStr) {
  const date = parseYmd(dateStr);

  const d = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    )
  );

  const dayNum =
    (d.getUTCDay() + 6) % 7;

  d.setUTCDate(
    d.getUTCDate() - dayNum + 3
  );

  const isoYear =
    d.getUTCFullYear();

  const firstThursday =
    new Date(
      Date.UTC(isoYear, 0, 4)
    );

  const firstDayNum =
    (firstThursday.getUTCDay() + 6) % 7;

  firstThursday.setUTCDate(
    firstThursday.getUTCDate() -
      firstDayNum +
      3
  );

  const diff =
    d.getTime() -
    firstThursday.getTime();

  const week =
    1 +
    Math.round(
      diff /
        (7 * 24 * 60 * 60 * 1000)
    );

  return `${isoYear}-W${String(
    week
  ).padStart(2, "0")}`;
}


function getMonthKey(dateStr) {
  return dateStr.slice(0, 7);
}


function getYearKey(dateStr) {
  return dateStr.slice(0, 4);
}


/* -------------------------
   Rekonstruer data per dag
   fra alle pageStats
------------------------- */

const reconstructedDays = {};

for (const page of pageSource) {
  for (const [date, values]
    of Object.entries(page.days || {})) {

    if (date > CUTOFF_DATE) {
      continue;
    }

    if (!reconstructedDays[date]) {
      reconstructedDays[date] = {
        pageSessions: 0,
        hashes: new Set(),
      };
    }

    reconstructedDays[date]
      .pageSessions +=
      Number(values.sessions || 0);

    for (const hash
      of values.hashes || []) {

      reconstructedDays[
        date
      ].hashes.add(hash);
    }
  }
}


/* -------------------------
   Kalibrer sessions-estimat
------------------------- */

const calibrationRatios = [];

for (const [date, globalDay]
  of Object.entries(
    globalSource.days || {}
  )) {

  if (
    date < CALIBRATION_START ||
    date > CALIBRATION_END
  ) {
    continue;
  }

  const reconstructed =
    reconstructedDays[date];

  const globalSessions =
    Number(
      globalDay.sessions || 0
    );

  const pageSessions =
    Number(
      reconstructed?.pageSessions || 0
    );

  if (
    globalSessions > 0 &&
    pageSessions > 0
  ) {
    calibrationRatios.push(
      pageSessions / globalSessions
    );
  }
}

const sessionRatio =
  median(calibrationRatios);


/* -------------------------
   Bygg globale dagstall
------------------------- */

const globalDays = {};
const effectiveHashesByDate = {};

const allDates = new Set([
  ...Object.keys(globalSource.days || {}),
  ...Object.keys(reconstructedDays),
]);

for (const date of [...allDates].sort()) {
  if (date > CUTOFF_DATE) {
    continue;
  }

  const originalGlobal =
    globalSource.days?.[date];

  const reconstructed =
    reconstructedDays[date];

  /*
   * Hvis global-data finnes, bruker vi dem som fasit.
   */
  if (originalGlobal) {
    const hashes = new Set(
      originalGlobal.hashes || []
    );

    effectiveHashesByDate[date] = hashes;

    globalDays[date] = {
      sessions: Number(
        originalGlobal.sessions || 0
      ),

      uniqueVisitors: Number(
        originalGlobal.uniques || 0
      ),

      sessionsEstimated: false,
    };

    continue;
  }

  /*
   * Global mangler:
   * rekonstruer fra pageStats.
   */
  const hashes =
    reconstructed?.hashes ||
    new Set();

  const uniqueVisitors =
    hashes.size;

  const pageSessions =
    Number(
      reconstructed?.pageSessions || 0
    );

  if (
    pageSessions === 0 &&
    uniqueVisitors === 0
  ) {
    continue;
  }

  const estimatedSessions =
    Math.max(
      uniqueVisitors,
      Math.round(
        pageSessions / sessionRatio
      )
    );

  effectiveHashesByDate[date] =
    new Set(hashes);

  globalDays[date] = {
    sessions: estimatedSessions,
    uniqueVisitors,
    sessionsEstimated: true,
  };
}


/* -------------------------
   Eksakte unike per
   uke / måned / år
------------------------- */

const weeklyHashes = {};
const monthlyHashes = {};
const yearlyHashes = {};

for (const [date, hashes]
  of Object.entries(
    effectiveHashesByDate
  )) {

  if (date > CUTOFF_DATE) {
    continue;
  }

  const weekKey =
    getISOWeekKey(date);

  const monthKey =
    getMonthKey(date);

  const yearKey =
    getYearKey(date);

  if (!weeklyHashes[weekKey]) {
    weeklyHashes[weekKey] =
      new Set();
  }

  if (!monthlyHashes[monthKey]) {
    monthlyHashes[monthKey] =
      new Set();
  }

  if (!yearlyHashes[yearKey]) {
    yearlyHashes[yearKey] =
      new Set();
  }

  for (const hash of hashes) {
    weeklyHashes[
      weekKey
    ].add(hash);

    monthlyHashes[
      monthKey
    ].add(hash);

    yearlyHashes[
      yearKey
    ].add(hash);
  }
}


/* -------------------------
   Sessions per periode
------------------------- */

const weekly = {};
const monthly = {};
const yearly = {};

for (const [date, day]
  of Object.entries(globalDays)) {

  const weekKey =
    getISOWeekKey(date);

  const monthKey =
    getMonthKey(date);

  const yearKey =
    getYearKey(date);

  if (!weekly[weekKey]) {
    weekly[weekKey] = {
      sessions: 0,
      uniqueVisitors: 0,
      hasEstimatedSessions: false,
    };
  }

  if (!monthly[monthKey]) {
    monthly[monthKey] = {
      sessions: 0,
      uniqueVisitors: 0,
      hasEstimatedSessions: false,
    };
  }

  if (!yearly[yearKey]) {
    yearly[yearKey] = {
      sessions: 0,
      uniqueVisitors: 0,
      hasEstimatedSessions: false,
    };
  }

  weekly[
    weekKey
  ].sessions +=
    Number(day.sessions || 0);

  monthly[
    monthKey
  ].sessions +=
    Number(day.sessions || 0);

  yearly[
    yearKey
  ].sessions +=
    Number(day.sessions || 0);

  if (day.sessionsEstimated) {
    weekly[
      weekKey
    ].hasEstimatedSessions = true;

    monthly[
      monthKey
    ].hasEstimatedSessions = true;

    yearly[
      yearKey
    ].hasEstimatedSessions = true;
  }
}


/* -------------------------
   Sett inn eksakte uniques
------------------------- */

for (const key
  of Object.keys(weekly)) {

  weekly[
    key
  ].uniqueVisitors =
    weeklyHashes[
      key
    ]?.size || 0;
}

for (const key
  of Object.keys(monthly)) {

  monthly[
    key
  ].uniqueVisitors =
    monthlyHashes[
      key
    ]?.size || 0;
}

for (const key
  of Object.keys(yearly)) {

  yearly[
    key
  ].uniqueVisitors =
    yearlyHashes[
      key
    ]?.size || 0;
}


/* -------------------------
   Lifetime uniques
------------------------- */

const allVisitorHashes =
  new Set();

for (const hashes of Object.values(
  effectiveHashesByDate
)) {
  for (const hash of hashes) {
    allVisitorHashes.add(hash);
  }
}


/* -------------------------
   Totals
------------------------- */

const sessionsTotal =
  Object.values(globalDays)
    .reduce(
      (sum, day) =>
        sum +
        Number(
          day.sessions || 0
        ),
      0
    );

const exactSessionsTotal =
  Object.values(globalDays)
    .filter(
      (day) =>
        !day.sessionsEstimated
    )
    .reduce(
      (sum, day) =>
        sum +
        Number(
          day.sessions || 0
        ),
      0
    );

const estimatedSessionsTotal =
  sessionsTotal -
  exactSessionsTotal;


/* -------------------------
   Rens pageStats
------------------------- */

const cleanedPages =
  pageSource.map((page) => {

    const days = {};

    const pageVisitorHashes =
      new Set();

    for (const [date, values]
      of Object.entries(
        page.days || {}
      )) {

      if (date > CUTOFF_DATE) {
        continue;
      }

      const hashes =
        Array.isArray(
          values.hashes
        )
          ? values.hashes
          : [];

      for (const hash
        of hashes) {

        pageVisitorHashes.add(
          hash
        );
      }

      days[date] = {
        sessions: Number(
          values.sessions || 0
        ),

        uniqueVisitors:
          new Set(
            hashes
          ).size,
      };
    }

    return {
      page: page.page,

      sessionsTotal:
        Object.values(days)
          .reduce(
            (sum, day) =>
              sum +
              Number(
                day.sessions || 0
              ),
            0
          ),

      uniqueVisitorsTotal:
        pageVisitorHashes.size,

      days,
    };
  });


/* -------------------------
   Ferdig fil
------------------------- */

const cleaned = {
  cutoffDate: CUTOFF_DATE,

  metadata: {
    posthogStart:
      "2026-08-18",

    sessionGap: {
      start: GAP_START,
      end: GAP_END,
    },

    sessionEstimate: {
      calibrationStart:
        CALIBRATION_START,

      calibrationEnd:
        CALIBRATION_END,

      pageSessionsPerGlobalSession:
        sessionRatio,
    },
  },

  global: {
    sessionsTotal,

    exactSessionsTotal,

    estimatedSessionsTotal,

    uniqueVisitorsTotal:
      allVisitorHashes.size,

    days: globalDays,

    weeks: weekly,

    months: monthly,

    years: yearly,
  },

  pages: cleanedPages,
};


/* -------------------------
   Skriv fil
------------------------- */

fs.mkdirSync(
  "./src/data",
  { recursive: true }
);

fs.writeFileSync(
  OUTPUT,
  JSON.stringify(
    cleaned,
    null,
    2
  ),
  "utf8"
);


/* -------------------------
   Terminal-output
------------------------- */

const estimatedDays =
  Object.entries(globalDays)
    .filter(
      ([, value]) =>
        value.sessionsEstimated
    );

console.log(
  `Lagret ${OUTPUT}`
);

console.log(
  `Cutoff: ${CUTOFF_DATE}`
);

console.log(
  `Legacy sessions totalt: ${sessionsTotal}`
);

console.log(
  `  Eksakte sessions: ${exactSessionsTotal}`
);

console.log(
  `  Estimerte sessions: ${estimatedSessionsTotal}`
);

console.log(
  `Legacy unike: ${allVisitorHashes.size}`
);

console.log(
  `Estimerte dager: ${estimatedDays.length}`
);

console.log(
  `Kalibreringsratio: ${sessionRatio.toFixed(3)}`
);

console.log(
  `Uker: ${Object.keys(weekly).length}`
);

console.log(
  `Måneder: ${Object.keys(monthly).length}`
);

console.log(
  `År: ${Object.keys(yearly).length}`
);

console.log(
  `Antall sider: ${cleanedPages.length}`
);