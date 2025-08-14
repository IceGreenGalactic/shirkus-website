import { useEffect, useState } from "react";
import sanityClient from "../../sanityClient";
import {
  StatsWrapper,
  Title,
  SectionGrid,
  StatBox,
  StatBoxCentered,
  SmallText,
  Arrow,
} from "./VisitorStats.styled";
import {
  getDateRange,
  formatDateKey,
} from "../../components/VisitorStats/utils/dateUtils";
import { getPageLabel } from "../../components/VisitorStats/utils/labelUtils";

const PERIODS = ["day", "week", "month"];
const MAX_OFFSETS = { day: 6, week: 3, month: 12 };

const VisitorStats = () => {
  const [totalVisits, setTotalVisits] = useState(null);
  const [rawLogs, setRawLogs] = useState([]);
  const [uniqueIps, setUniqueIps] = useState(new Set());
  const [dogNameMap, setDogNameMap] = useState({});
  const [litterNameMap, setLitterNameMap] = useState({});
  const [periodOffsets, setPeriodOffsets] = useState({
    day: 0,
    week: 0,
    month: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const visitors = await sanityClient.fetch(
        `*[_type == "siteStats"][0]{visitors}`
      );
      setTotalVisits(visitors.visitors);

      const logs = await sanityClient.fetch(
        `*[_type == "visitorLog"]{ip, visits}`
      );
      setRawLogs(logs);

      const dogIds = new Set();
      const litterIds = new Set();
      logs.forEach((log) => {
        log.visits.forEach((visit) => {
          if (visit.page.startsWith("/dogs/"))
            dogIds.add(visit.page.split("/")[2]);
          if (visit.page.startsWith("/litters/"))
            litterIds.add(visit.page.split("/")[2]);
        });
      });

      if (dogIds.size) {
        const dogData = await sanityClient.fetch(
          `*[_type == "dog" && _id in $ids]{ _id, name, nickname }`,
          { ids: [...dogIds] }
        );
        const map = {};
        dogData.forEach((dog) => {
          map[dog._id] = dog.nickname || dog.name || "Hund";
        });
        setDogNameMap(map);
      }

      if (litterIds.size) {
        const litterData = await sanityClient.fetch(
          `*[_type == "litter" && _id in $ids]{
            _id,
            mother { name, nickname, dogReference->{name, nickname} },
            father { name, nickname, dogReference->{name, nickname} }
          }`,
          { ids: [...litterIds] }
        );
        const map = {};
        litterData.forEach((litter) => {
          const mother =
            litter.mother.dogReference?.nickname ||
            litter.mother.dogReference?.name ||
            litter.mother.nickname ||
            litter.mother.name ||
            "Mor";
          const father =
            litter.father.dogReference?.nickname ||
            litter.father.dogReference?.name ||
            litter.father.nickname ||
            litter.father.name ||
            "Far";
          map[litter._id] = `${mother} & ${father}`;
        });
        setLitterNameMap(map);
      }

      const ips = new Set();
      logs.forEach((log) => ips.add(log.ip));
      setUniqueIps(ips);
    };

    fetchData().catch(console.error);
  }, []);

  const computeStats = (range) => {
    const stats = { count: 0, ips: new Set(), perPage: {} };
    const sessionWindow = 1000 * 60 * 60 * 5;

    rawLogs.forEach((log) => {
      let lastVisit = null;
      log.visits
        .filter((v) => {
          const d = new Date(v.lastVisit || v.date);
          return d >= range.start && d <= range.end;
        })
        .sort(
          (a, b) =>
            new Date(a.lastVisit || a.date) - new Date(b.lastVisit || b.date)
        )
        .forEach((visit) => {
          const ts = new Date(visit.lastVisit || visit.date).getTime();
          const isNewSession = !lastVisit || ts - lastVisit > sessionWindow;

          if (isNewSession) {
            stats.count += 1;
            stats.ips.add(log.ip);
            lastVisit = ts;
          }

          if (!stats.perPage[visit.page]) {
            stats.perPage[visit.page] = { count: 0, ips: new Set() };
          }
          stats.perPage[visit.page].count += visit.count;
          stats.perPage[visit.page].ips.add(log.ip);
        });
    });

    return stats;
  };

  const renderPerPageStats = (perPage) => {
    return Object.entries(perPage)
      .filter(([page]) => page !== "/besokstall")
      .sort(([pageA], [pageB]) => {
        if (pageA === "/") return -1;
        if (pageB === "/") return 1;

        const labelA = getPageLabel(
          pageA,
          litterNameMap,
          dogNameMap
        ).toLowerCase();
        const labelB = getPageLabel(
          pageB,
          litterNameMap,
          dogNameMap
        ).toLowerCase();
        return labelA.localeCompare(labelB, "no");
      })
      .map(([page, { count, ips }]) => {
        const label = getPageLabel(page, litterNameMap, dogNameMap);
        return (
          <SmallText key={page}>
            – <strong>{label}</strong>: {count} besøk ({ips.size} IP-er)
          </SmallText>
        );
      });
  };

  const goBack = (type) =>
    setPeriodOffsets((prev) => {
      const next = prev[type] + 1;
      return {
        ...prev,
        [type]: next > MAX_OFFSETS[type] ? 0 : next,
      };
    });

  const goForward = (type) =>
    setPeriodOffsets((prev) => ({
      ...prev,
      [type]: prev[type] > 0 ? prev[type] - 1 : 0,
    }));

  return (
    <StatsWrapper>
      <Title>📊 Besøksstatistikk</Title>

      <StatBoxCentered>
        <h3>Totalt</h3>
        <p>
          <strong>Besøk:</strong> {totalVisits ?? "Laster..."}
        </p>
        <p>
          <strong>Unike IP-er:</strong> {uniqueIps.size}
        </p>
      </StatBoxCentered>

      <SectionGrid>
        {PERIODS.map((periodKey) => {
          const offset = periodOffsets[periodKey];
          const range = getDateRange(periodKey, offset);
          const stats = computeStats(range);
          const label = formatDateKey(periodKey, offset);

          return (
            <StatBox key={periodKey}>
              <div className="d-flex align-items-center gap-3 justify-content-center">
                <Arrow onClick={() => goBack(periodKey)}>←</Arrow>{" "}
                <h3>{label}</h3>
                <Arrow onClick={() => goForward(periodKey)}>→</Arrow>
              </div>
              <p>
                <strong>Besøk:</strong> {stats.count}
              </p>
              <p>
                <strong>Unike IP-er:</strong> {stats.ips.size}
              </p>
              {renderPerPageStats(stats.perPage)}
            </StatBox>
          );
        })}
      </SectionGrid>
    </StatsWrapper>
  );
};

export default VisitorStats;
