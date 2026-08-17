import { useEffect, useState, useMemo } from "react";
import legacyStats from "../../data/legacyStats.json";

import {
  RangeCardWrap,
  RangeTop,
  RangeTitleCenter,
  BtnIcon,
  RangeLabel,
  RangeMetrics,
  Metric,
  MetricName,
  MetricValue,
} from "../../pages/info/Admin.styled";

const POSTHOG_START = "2026-08-18";
const LEGACY_END = "2026-08-17";

const nf = new Intl.NumberFormat("no-NO");

function ymdOslo(d = new Date()) {
  const p = new Intl.DateTimeFormat("no-NO", {
    timeZone: "Europe/Oslo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);

  const y = p.find((x) => x.type === "year")?.value;
  const m = p.find((x) => x.type === "month")?.value;
  const day = p.find((x) => x.type === "day")?.value;

  return `${y}-${m}-${day}`;
}

function addDays(dateStr, delta) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));

  dt.setUTCDate(dt.getUTCDate() + delta);

  return ymdOslo(dt);
}

function parseYmd(s) {
  const [y, m, d] = s.split("-").map(Number);

  return new Date(Date.UTC(y, m - 1, d));
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

  const dayNum = (d.getUTCDay() + 6) % 7;

  d.setUTCDate(
    d.getUTCDate() - dayNum + 3
  );

  const isoYear = d.getUTCFullYear();

  const firstThursday = new Date(
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

  return `${isoYear}-W${String(week).padStart(2, "0")}`;
}

function getISOWeek(date) {
  const key = getISOWeekKey(
    ymdOslo(date)
  );

  return Number(key.split("W")[1]);
}

/*
 * Henter ferdigberegnet legacy-statistikk
 * for riktig type RangeCard.
 */
function getLegacyStats(title, start) {
  if (title === "Dag") {
    const day =
      legacyStats.global?.days?.[start];

    return {
      sessions: Number(
        day?.sessions || 0
      ),
      uniques: Number(
        day?.uniqueVisitors || 0
      ),
    };
  }

  if (title === "Uke") {
    const key =
      getISOWeekKey(start);

    const week =
      legacyStats.global?.weeks?.[key];

    return {
      sessions: Number(
        week?.sessions || 0
      ),
      uniques: Number(
        week?.uniqueVisitors || 0
      ),
    };
  }

  if (title === "Måned") {
    const key = start.slice(0, 7);

    const month =
      legacyStats.global?.months?.[key];

    return {
      sessions: Number(
        month?.sessions || 0
      ),
      uniques: Number(
        month?.uniqueVisitors || 0
      ),
    };
  }

  if (title === "År") {
    const key = start.slice(0, 4);

    const year =
      legacyStats.global?.years?.[key];

    return {
      sessions: Number(
        year?.sessions || 0
      ),
      uniques: Number(
        year?.uniqueVisitors || 0
      ),
    };
  }

  return {
    sessions: 0,
    uniques: 0,
  };
}

async function getPosthogRange(
  start,
  end
) {
  const params =
    new URLSearchParams({
      start,
      end,
    });

  const response = await fetch(
    `/.netlify/functions/getPosthogStats?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      "Kunne ikke hente PostHog range-statistikk"
    );
  }

  const json =
    await response.json();

  return {
    sessions: Number(
      json.totals?.sessions || 0
    ),

    uniques: Number(
      json.totals?.uniqueVisitors || 0
    ),
  };
}

export default function RangeCard({
  title,
  items,
  refreshKey = 0,
}) {
  const [idx, setIdx] =
    useState(0);

  const cur = items[idx];

  const [data, setData] =
    useState({
      sessionsTotal: 0,
      uniquesGlobal: 0,
    });

  const [isLoading, setIsLoading] =
    useState(false);

  const todayYmd = useMemo(
    () => ymdOslo(),
    []
  );

  const yesterdayYmd = useMemo(
    () => addDays(ymdOslo(), -1),
    []
  );

  const smartLabel = useMemo(() => {
    const start =
      String(cur.start);

    const end =
      String(cur.end);

    if (title === "Dag") {
      if (
        start === todayYmd &&
        end === todayYmd
      ) {
        return "I dag";
      }

      if (
        start === yesterdayYmd &&
        end === yesterdayYmd
      ) {
        return "I går";
      }

      const startDate =
        parseYmd(start);

      const todayDate =
        parseYmd(todayYmd);

      const diffDays =
        Math.round(
          (
            todayDate.getTime() -
            startDate.getTime()
          ) /
            (24 * 3600 * 1000)
        );

      if (
        diffDays <= 6 &&
        diffDays >= 0
      ) {
        const weekday =
          new Intl.DateTimeFormat(
            "no-NO",
            {
              weekday: "long",
            }
          ).format(startDate);

        return (
          weekday
            .charAt(0)
            .toUpperCase() +
          weekday.slice(1)
        );
      }

      return new Intl.DateTimeFormat(
        "no-NO"
      ).format(startDate);
    }

    if (title === "Uke") {
      const now =
        parseYmd(todayYmd);

      const startDate =
        parseYmd(start);

      const endDate =
        parseYmd(end);

      const inThisWeek =
        +now >= +startDate &&
        +now <= +endDate;

      if (inThisWeek) {
        return "Denne uken";
      }

      const lastWeekDate =
        new Date(now);

      lastWeekDate.setUTCDate(
        lastWeekDate.getUTCDate() -
          7
      );

      const inLastWeek =
        +lastWeekDate >=
          +startDate &&
        +lastWeekDate <= +endDate;

      if (inLastWeek) {
        return "Forrige uke";
      }

      return `Uke ${getISOWeek(
        startDate
      )}`;
    }

    return cur.label;
  }, [
    cur,
    title,
    todayYmd,
    yesterdayYmd,
  ]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);

      try {
        const start =
          String(cur.start);

        const end =
          String(cur.end);

        let sessions = 0;
        let uniques = 0;

        /*
         * LEGACY
         *
         * legacyStats inneholder aldri data
         * etter 17.08, så kalenderbucketene
         * fungerer også for perioden som
         * krysser overgangen.
         */
        if (start <= LEGACY_END) {
          const legacy =
            getLegacyStats(
              title,
              start
            );

          sessions +=
            legacy.sessions;

          uniques +=
            legacy.uniques;
        }

        /*
         * POSTHOG
         *
         * Ingenting før 18.08 teller.
         */
        if (end >= POSTHOG_START) {
          const posthogStart =
            start >= POSTHOG_START
              ? start
              : POSTHOG_START;

          const posthog =
            await getPosthogRange(
              posthogStart,
              end
            );

          sessions +=
            posthog.sessions;

          /*
           * Vi kan ikke deduplisere en
           * legacy visitor mot en PostHog
           * visitor, så perioder som krysser
           * cutover kan være litt høye på
           * unique.
           */
          uniques +=
            posthog.uniques;
        }

        if (!cancelled) {
          setData({
            sessionsTotal:
              sessions,

            uniquesGlobal:
              uniques,
          });
        }
      } catch (error) {
        console.error(
          "Kunne ikke hente range-statistikk:",
          error
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [
    cur.start,
    cur.end,
    title,
    refreshKey,
  ]);

  function prev() {
    setIdx(
      (idx - 1 + items.length) %
        items.length
    );
  }

  function next() {
    setIdx(
      (idx + 1) % items.length
    );
  }

  return (
    <RangeCardWrap>
      <RangeTop>
        <BtnIcon
          onClick={next}
          aria-label="Forrige"
          disabled={isLoading}
        >
          ←
        </BtnIcon>

        <RangeTitleCenter>
          {title}
        </RangeTitleCenter>

        <BtnIcon
          onClick={prev}
          aria-label="Neste"
          disabled={isLoading}
        >
          →
        </BtnIcon>
      </RangeTop>

      <RangeLabel>
        {smartLabel}
      </RangeLabel>

      <RangeMetrics>
        <Metric>
          <MetricName>
            Besøk
          </MetricName>

          <MetricValue>
            {isLoading
              ? "…"
              : nf.format(
                  data.sessionsTotal
                )}
          </MetricValue>
        </Metric>

        <Metric>
          <MetricName>
            Unike
          </MetricName>

          <MetricValue>
            {isLoading
              ? "…"
              : nf.format(
                  data.uniquesGlobal
                )}
          </MetricValue>
        </Metric>
      </RangeMetrics>
    </RangeCardWrap>
  );
}