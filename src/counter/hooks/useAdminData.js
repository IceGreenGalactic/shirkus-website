import { useEffect, useMemo, useState } from "react";

import {
  POSTHOG_START,
  LEGACY_END,
  EMPTY_STATS,
  ymdOslo,
  fetchPosthogToday,
  fetchPosthogRange,
} from "../utils/adminStats";

import {
  getLegacyToday,
  getLegacyTotals,
  getLegacyPages,
} from "../utils/legacyStats";

import {
  buildAllPageRows,
  buildTopRows,
  buildChildrenByGroup,
} from "../utils/groupStats";

export default function useAdminData() {
  const [today, setToday] = useState(EMPTY_STATS);

  const [sincePosthogStart, setSincePosthogStart] = useState(EMPTY_STATS);

  const [loading, setLoading] = useState(true);

  const [reloading, setReloading] = useState(false);

  const [refTs, setRefTs] = useState(Date.now());

  const [expanded, setExpanded] = useState({
    "/dogs": false,
    "/litters": false,
    "/gallery": false,
  });

  async function fetchAllStats() {
    const todayYmd = ymdOslo();

    if (todayYmd <= LEGACY_END) {
      return {
        today: getLegacyToday(todayYmd),
        sincePosthogStart: EMPTY_STATS,
      };
    }

    const [todayResult, posthogResult] = await Promise.all([
      fetchPosthogToday(),

      fetchPosthogRange(POSTHOG_START, todayYmd),
    ]);

    return {
      today: todayResult,
      sincePosthogStart: posthogResult,
    };
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await fetchAllStats();

        if (!cancelled) {
          setToday(result.today);

          setSincePosthogStart(result.sincePosthogStart);
        }
      } catch (error) {
        console.error("Kunne ikke laste admin-statistikk:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setRefTs(Date.now());
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  async function reloadAll() {
    setReloading(true);

    try {
      const result = await fetchAllStats();

      setToday(result.today);

      setSincePosthogStart(result.sincePosthogStart);

      setRefTs(Date.now());
    } catch (error) {
      console.error("Kunne ikke oppdatere admin-statistikk:", error);
    } finally {
      setReloading(false);
    }
  }

  const allPageRows = useMemo(
    () =>
      buildAllPageRows({
        legacyPages: getLegacyPages(),

        posthogPages: sincePosthogStart.pages,

        todayPages: today.pages,
      }),
    [sincePosthogStart.pages, today.pages],
  );

  const rows = useMemo(() => buildTopRows(allPageRows), [allPageRows]);

  const childrenByGroup = useMemo(
    () => buildChildrenByGroup(allPageRows),
    [allPageRows],
  );

  const legacy = getLegacyTotals();

  const posthogSessions = Number(sincePosthogStart.totals?.sessions || 0);

  const posthogUniqueVisitors = Number(
    sincePosthogStart.totals?.uniqueVisitors || 0,
  );

  const totalRow = {
    sessionsToday: Number(today.totals?.sessions || 0),

    uniquesToday: Number(today.totals?.uniqueVisitors || 0),

    sessionsTotal: legacy.sessions + posthogSessions,

    uniquesTotal: legacy.uniqueVisitors + posthogUniqueVisitors,
  };
  return {
    rows,
    totalRow,
    childrenByGroup,

    expanded,
    setExpanded,

    loading,
    reloading,
    refTs,
    reloadAll,

    dailyToday: {
      sessionsTotal: totalRow.sessionsToday,
    },

    lifetime: {
      sessionsTotal: totalRow.sessionsTotal,
    },

    global: {
      uniquesGlobal: totalRow.uniquesTotal,
    },

    today,
    sincePosthogStart,
  };
}
