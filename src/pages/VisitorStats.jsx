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

const VisitorStats = () => {
  const [totalVisits, setTotalVisits] = useState(null);
  const [uniqueIps, setUniqueIps] = useState(new Set());

  const [periodStats, setPeriodStats] = useState({
    today: { count: 0, ips: new Set(), perPage: {} },
    week: { count: 0, ips: new Set(), perPage: {} },
    month: { count: 0, ips: new Set(), perPage: {} },
  });

  useEffect(() => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const today = new Date(todayStr);
    const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    sanityClient
      .fetch(`*[_type == "siteStats"][0]{visitors}`)
      .then((data) => setTotalVisits(data.visitors));

    sanityClient.fetch(`*[_type == "visitorLog"]{ip, visits}`).then((logs) => {
      const uniqueIpsTotal = new Set();

      const initStats = {
        today: { count: 0, ips: new Set(), perPage: {} },
        week: { count: 0, ips: new Set(), perPage: {} },
        month: { count: 0, ips: new Set(), perPage: {} },
      };

      logs.forEach((log) => {
        uniqueIpsTotal.add(log.ip);

        log.visits.forEach((visit) => {
          const date = new Date(visit.date);
          const page = visit.page;

          // I dag
          if (visit.date === todayStr) {
            initStats.today.count += 1;
            initStats.today.ips.add(log.ip);
            if (!initStats.today.perPage[page]) {
              initStats.today.perPage[page] = { count: 0, ips: new Set() };
            }
            initStats.today.perPage[page].count += visit.count;
            initStats.today.perPage[page].ips.add(log.ip);
          }

          // Siste uke
          if (date >= weekStart) {
            initStats.week.count += 1;
            initStats.week.ips.add(log.ip);
            if (!initStats.week.perPage[page]) {
              initStats.week.perPage[page] = { count: 0, ips: new Set() };
            }
            initStats.week.perPage[page].count += visit.count;
            initStats.week.perPage[page].ips.add(log.ip);
          }

          // Siste måned
          if (date >= monthStart) {
            initStats.month.count += 1;
            initStats.month.ips.add(log.ip);
            if (!initStats.month.perPage[page]) {
              initStats.month.perPage[page] = { count: 0, ips: new Set() };
            }
            initStats.month.perPage[page].count += visit.count;
            initStats.month.perPage[page].ips.add(log.ip);
          }
        });
      });

      setUniqueIps(uniqueIpsTotal);
      setPeriodStats(initStats);
    });
  }, []);

  const renderPerPageStats = (perPageObj) => {
    return Object.entries(perPageObj).map(([page, { count, ips }]) => (
      <SmallText key={page}>
        – <strong>{page}</strong>: {count} besøk ({ips.size} IP-er)
      </SmallText>
    ));
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
        <h3>Siste uke</h3>
        <p>
          <strong>Besøk:</strong> {periodStats.week.count}
        </p>
        <p>
          <strong>Unike IP-er:</strong> {periodStats.week.ips.size}
        </p>
        {renderPerPageStats(periodStats.week.perPage)}
      </StatBox>

      <StatBox>
        <h3>Siste måned</h3>
        <p>
          <strong>Besøk:</strong> {periodStats.month.count}
        </p>
        <p>
          <strong>Unike IP-er:</strong> {periodStats.month.ips.size}
        </p>
        {renderPerPageStats(periodStats.month.perPage)}
      </StatBox>
    </SectionGrid>
  </StatsWrapper>
);
};

export default VisitorStats;
