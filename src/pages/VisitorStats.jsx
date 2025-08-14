import { useEffect, useState } from "react";
import sanityClient from "../sanityClient";
import {
  StatsWrapper,
  Title,
  SectionGrid,
  StatBox,
  StatBoxCentered,
  SmallText,
} from "./VisitorStats.styled";

const pageNameMap = {
  "/litters": "Valpekull",
  "/dogs": "Våre hunder",
  "/gallery": "Galleri",
  "/about": "Om oss",
  "/contact": "Kontakt",
  "/": "Hjem",
  "/besokstall": "Besøkstall",
};

const VisitorStats = () => {
  const [totalVisits, setTotalVisits] = useState(null);
  const [uniqueIps, setUniqueIps] = useState(new Set());
  const [periodStats, setPeriodStats] = useState({
    today: { count: 0, ips: new Set(), perPage: {} },
    thisWeek: { count: 0, ips: new Set(), perPage: {} },
    lastWeek: { count: 0, ips: new Set(), perPage: {} },
    thisMonth: { count: 0, ips: new Set(), perPage: {} },
    lastMonth: { count: 0, ips: new Set(), perPage: {} },
  });

  const [litterNameMap, setLitterNameMap] = useState({});
  const [dogNameMap, setDogNameMap] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];

      // Ukestart = mandag
      const getMonday = (date) => {
        const d = new Date(date);
        const day = d.getDay(); // 0 = søndag
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
      };

      const today = new Date(todayStr);
      const thisWeekStart = getMonday(today);
      const lastWeekStart = new Date(thisWeekStart);
      lastWeekStart.setDate(thisWeekStart.getDate() - 7);
      const lastWeekEnd = new Date(thisWeekStart);
      lastWeekEnd.setDate(thisWeekStart.getDate() - 1);

      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0); // siste dag i forrige måned

      const visitorStats = await sanityClient.fetch(
        `*[_type == "siteStats"][0]{visitors}`
      );
      setTotalVisits(visitorStats.visitors);

      const logs = await sanityClient.fetch(
        `*[_type == "visitorLog"]{ip, visits}`
      );
      const uniqueIpsTotal = new Set();

      const initStats = {
        today: { count: 0, ips: new Set(), perPage: {} },
        thisWeek: { count: 0, ips: new Set(), perPage: {} },
        lastWeek: { count: 0, ips: new Set(), perPage: {} },
        thisMonth: { count: 0, ips: new Set(), perPage: {} },
        lastMonth: { count: 0, ips: new Set(), perPage: {} },
      };

      const litterIds = new Set();
      const dogIds = new Set();

      const addVisit = (statType, log, page, count) => {
        statType.count += 1;
        statType.ips.add(log.ip);
        if (!statType.perPage[page]) {
          statType.perPage[page] = { count: 0, ips: new Set() };
        }
        statType.perPage[page].count += count;
        statType.perPage[page].ips.add(log.ip);
      };

      logs.forEach((log) => {
        uniqueIpsTotal.add(log.ip);

        log.visits.forEach((visit) => {
          const date = new Date(visit.date);
          const page = visit.page;

          if (page.startsWith("/litters/")) {
            litterIds.add(page.split("/")[2]);
          } else if (page.startsWith("/dogs/")) {
            dogIds.add(page.split("/")[2]);
          }

          if (visit.date === todayStr) {
            addVisit(initStats.today, log, page, visit.count);
          }

          if (date >= thisWeekStart && date <= today) {
            addVisit(initStats.thisWeek, log, page, visit.count);
          }

          if (date >= lastWeekStart && date <= lastWeekEnd) {
            addVisit(initStats.lastWeek, log, page, visit.count);
          }

          if (date >= thisMonthStart && date <= today) {
            addVisit(initStats.thisMonth, log, page, visit.count);
          }

          if (date >= lastMonthStart && date <= lastMonthEnd) {
            addVisit(initStats.lastMonth, log, page, visit.count);
          }
        });
      });

      setUniqueIps(uniqueIpsTotal);
      setPeriodStats(initStats);

      // Fetch names for kull
      if (litterIds.size > 0) {
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

      // Fetch names for dogs
      if (dogIds.size > 0) {
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
    };

    fetchStats().catch(console.error);
  }, []);

  const renderPerPageStats = (perPageObj) => {
    return Object.entries(perPageObj)
      .filter(([page]) => page !== "/besokstall")
      .map(([page, { count, ips }]) => {
        let label = pageNameMap[page];

        if (!label && page.startsWith("/litters/")) {
          const id = page.split("/")[2];
          label = litterNameMap[id] || `Kull (${id.slice(0, 5)})`;
        }

        if (!label && page.startsWith("/dogs/")) {
          const id = page.split("/")[2];
          label = dogNameMap[id] || `Hund (${id.slice(0, 5)})`;
        }

        return (
          <SmallText key={page}>
            – <strong>{label || page}</strong>: {count} besøk ({ips.size} IP-er)
          </SmallText>
        );
      });
  };

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
        <StatBox>
          <h3>I dag</h3>
          <p>
            <strong>Besøk:</strong> {periodStats.today.count}
          </p>
          <p>
            <strong>Unike IP-er:</strong> {periodStats.today.ips.size}
          </p>
          {renderPerPageStats(periodStats.today.perPage)}
        </StatBox>

        <StatBox>
          <h3>Denne uken</h3>
          <p>
            <strong>Besøk:</strong> {periodStats.thisWeek.count}
          </p>
          <p>
            <strong>Unike IP-er:</strong> {periodStats.thisWeek.ips.size}
          </p>
          {renderPerPageStats(periodStats.thisWeek.perPage)}
        </StatBox>

        <StatBox>
          <h3>Sist uke</h3>
          <p>
            <strong>Besøk:</strong> {periodStats.lastWeek.count}
          </p>
          <p>
            <strong>Unike IP-er:</strong> {periodStats.lastWeek.ips.size}
          </p>
          {renderPerPageStats(periodStats.lastWeek.perPage)}
        </StatBox>

        <StatBox>
          <h3>Denne måneden</h3>
          <p>
            <strong>Besøk:</strong> {periodStats.thisMonth.count}
          </p>
          <p>
            <strong>Unike IP-er:</strong> {periodStats.thisMonth.ips.size}
          </p>
          {renderPerPageStats(periodStats.thisMonth.perPage)}
        </StatBox>

        <StatBox>
          <h3>Sist måned</h3>
          <p>
            <strong>Besøk:</strong> {periodStats.lastMonth.count}
          </p>
          <p>
            <strong>Unike IP-er:</strong> {periodStats.lastMonth.ips.size}
          </p>
          {renderPerPageStats(periodStats.lastMonth.perPage)}
        </StatBox>
      </SectionGrid>
    </StatsWrapper>
  );
};

export default VisitorStats;
