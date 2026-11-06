import { useEffect, useState } from "react";
import {
  Wrap,
  Title,
  Sub,
  KPIGrid,
  KPICard,
  KPIName,
  KPIValue,
  TableWrap,
  RangeGrid,
  SectionTitle,
  Btn,
  ScrollTopButton,
} from "./Admin.styled";

import TrafficOverview from "../../counter/components/TrafficOverview";
import StatsTable from "../../counter/components/StatsTable";
import RollingPanels from "../../counter/components/RollingPanels";

import { MiniPawSpinner } from "../../utils/LoadingSpinner";
import useAdminData from "../../counter/hooks/useAdminData";

const nf = new Intl.NumberFormat("no-NO");

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > Math.max(1200, window.innerHeight * 1.5));
    update();
    window.addEventListener("scroll", update, {passive: true});
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  if (!visible) return null;
  return (
    <ScrollTopButton type="button" aria-label="Hopp til toppen" title="Hopp til toppen"
      onClick={() => window.scrollTo({top: 0, behavior:
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ? "auto" : "smooth"})}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m5 15 7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </ScrollTopButton>
  );
}

export default function Admin() {
  const {
    rows,
    totalRow,
    childrenByGroup,
    expanded,
    setExpanded,
    loading,
    reloading,
    refTs,
    reloadAll,
    dailyToday,
    lifetime,
    global,
  } = useAdminData();
  const [justUpdated, setJustUpdated] = useState(false);

  async function handleReload() {
    setJustUpdated(false);

    await reloadAll();

    setJustUpdated(true);

    setTimeout(() => {
      setJustUpdated(false);
    }, 20000);
  }
  if (loading) {
    return (
      <Wrap>
        <Title>Kontrollpanel</Title>
        <MiniPawSpinner />
      </Wrap>
    );
  }

  return (
    <Wrap>
      <Title>Kontrollpanel</Title>

      <Sub>besøkstall f.o.m. 17.12.2025</Sub>

      <Sub>
        <Btn
          type="button"
          onClick={handleReload}
          disabled={reloading}
          aria-busy={reloading}
        >
          {reloading ? (
            <>
              <MiniPawSpinner style={{ marginRight: 8 }} />
              Oppdaterer…
            </>
          ) : justUpdated ? (
            "Oppdatert ✓"
          ) : (
            "Oppdater"
          )}
        </Btn>
      </Sub>

      <KPIGrid>
        <KPICard>
          <KPIName>Besøk i dag</KPIName>
          <KPIValue>
            {nf.format(Number(dailyToday.sessionsTotal || 0))}
          </KPIValue>
        </KPICard>

        <KPICard>
          <KPIName>Besøk totalt</KPIName>
          <KPIValue>{nf.format(Number(lifetime.sessionsTotal || 0))}</KPIValue>
        </KPICard>

        <KPICard>
          <KPIName>Unike besøkere (alle tider)</KPIName>
          <KPIValue>{nf.format(Number(global.uniquesGlobal || 0))}</KPIValue>
        </KPICard>
      </KPIGrid>

      <TableWrap>
        <StatsTable
          totalRow={totalRow}
          rows={rows}
          childrenByGroup={childrenByGroup}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      </TableWrap>

      <SectionTitle>Rullerende oversikt</SectionTitle>

      <RangeGrid>
        <RollingPanels refreshKey={refTs} />
      </RangeGrid>
      <TrafficOverview refreshKey={refTs} />
      <BackToTop />
    </Wrap>
  );
}
