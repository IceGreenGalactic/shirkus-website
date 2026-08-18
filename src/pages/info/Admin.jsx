import { useState } from "react";
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
} from "./Admin.styled";

import TrafficOverview from "../../counter/components/TrafficOverview";
import StatsTable from "../../counter/components/StatsTable";
import RollingPanels from "../../counter/components/RollingPanels";

import { MiniPawSpinner } from "../../utils/LoadingSpinner";
import useAdminData from "../../counter/hooks/useAdminData";

const nf = new Intl.NumberFormat("no-NO");

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
    traffic,
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
      <TrafficOverview traffic={traffic} />
    </Wrap>
  );
}
