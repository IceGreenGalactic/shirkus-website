import { useEffect, useState } from "react";
import { FaGlobeEurope, FaChartBar, FaLink, FaGoogle, FaFacebookF, FaInstagram, FaMicrosoft, FaEllipsisH } from "react-icons/fa";
import { trafficWeek } from "../utils/trafficWeeks";
import { trafficRollingDays } from "../utils/trafficRollingDays";
import { compareTraffic, countryFlag, trafficPeriodRows } from "../utils/trafficComparison";
import { fetchPeriodTraffic, fetchAllTimeTraffic } from "../utils/trafficStats";
import { POSTHOG_START } from "../utils/adminStats";
import {
  SectionTitle, TrafficGrid, RangeLabel, BtnIcon, TrafficSection, TrafficHeading,
  TrafficCardHeader, TrafficColumnHeader, TrafficLabel, TrafficOverviewWrap,
  TrafficPeriodGrid, TrafficPeriodColumn, TrafficPeriodList, TrafficPeriodRow, TrafficPeriodTotal,
} from "../../pages/info/Admin.styled";

const nf = new Intl.NumberFormat("nb-NO");
const dateLabel = (date) => new Intl.DateTimeFormat("nb-NO", {timeZone: "UTC"})
  .format(new Date(`${date}T12:00:00Z`));
const sourceIcons = {Direkte: FaLink, Google: FaGoogle, Facebook: FaFacebookF,
  Instagram: FaInstagram, Bing: FaMicrosoft, Andre: FaEllipsisH};

function useTraffic(start, end, refreshKey) {
  const [state, setState] = useState({loading: true, data: null, error: ""});
  useEffect(() => {
    let cancelled = false;
    setState({loading: true, data: null, error: ""});
    const request = start ? fetchPeriodTraffic(start, end) : fetchAllTimeTraffic();
    request.then(
      (data) => { if (!cancelled) setState({loading: false, data, error: ""}); },
      (error) => { if (!cancelled) setState({loading: false, data: null, error: error.message}); },
    );
    return () => { cancelled = true; };
  }, [start, end, refreshKey]);
  return state;
}

function PeriodList({ state, kind, total, title }) {
  const [expanded, setExpanded] = useState(false);
  const rows = trafficPeriodRows(state.data, kind);
  const countries = kind === "countries";
  return <>
    {state.loading ? <RangeLabel role="status">Henter tall…</RangeLabel>
      : state.error ? <RangeLabel role="alert">{state.error}</RangeLabel>
      : !rows.length ? <RangeLabel>Ingen registrerte besøk.</RangeLabel>
      : <TrafficPeriodList aria-label={`${title} – ${countries ? "land" : "trafikkilder"}`}>
        {(expanded ? rows : rows.slice(0, 10)).map((row) => {
          const Icon = countries ? FaGlobeEurope : sourceIcons[row.label] || FaEllipsisH;
          const flag = countries ? countryFlag(row.label) : null;
          return <TrafficPeriodRow key={row.label}><TrafficLabel>
            <span aria-hidden="true">{flag || <Icon />}</span><span>{row.label}</span>
          </TrafficLabel><strong>{nf.format(row.value)}</strong></TrafficPeriodRow>;
        })}
      </TrafficPeriodList>}
    {!state.loading && !state.error && rows.length > 10 && <BtnIcon type="button" aria-expanded={expanded}
      aria-label={`${expanded ? "Vis færre" : "Vis flere"} ${countries ? "land" : "trafikkilder"} – ${title}`}
      onClick={() => setExpanded((value) => !value)}>
      {expanded ? "Vis færre ‹" : `+ ${nf.format(rows.length - 10)} til ›`}
    </BtnIcon>}
    <TrafficPeriodTotal title="Summen av alle registrerte rader, også de som er skjult">
      <span>Totalt</span><strong>{state.loading ? "…" : state.error ? "—" : nf.format(total)}</strong>
    </TrafficPeriodTotal>
  </>;
}

function ComparisonCard({ kind, refreshKey }) {
  const [daysOffset, setDaysOffset] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);
  const days = trafficRollingDays(daysOffset);
  const week = trafficWeek(weekOffset);
  const daysStart = days.start < POSTHOG_START ? POSTHOG_START : days.start;
  const weekStart = week.start < POSTHOG_START ? POSTHOG_START : week.start;
  const all = useTraffic(null, null, refreshKey);
  const recent = useTraffic(daysStart, days.end, refreshKey);
  const weekly = useTraffic(weekStart, week.end, refreshKey);
  const states = [all, recent, weekly];
  const {totals} = compareTraffic(states.map((state) => state.data), kind);
  const countries = kind === "countries";
  const subject = countries ? "land" : "trafikkilder";
  const title = countries ? "Hvor kommer de fra?" : "Hvordan fant de oss?";
  const MainIcon = countries ? FaGlobeEurope : FaChartBar;
  const columns = [
    {title: "All tid"},
    {title: daysOffset === 0 ? "Siste 30 dager" : "30 dager", start: daysStart, end: days.end,
      offset: daysOffset, setOffset: setDaysOffset, canOlder: days.start > POSTHOG_START, unit: "30-dagersperiode"},
    {title: weekOffset === 0 ? "Denne uken" : `Uke ${week.number}`, start: weekStart, end: week.end,
      offset: weekOffset, setOffset: setWeekOffset, canOlder: week.start > POSTHOG_START, unit: "uke"},
  ];
  return (
    <TrafficSection aria-label={title}>
      <TrafficCardHeader><MainIcon aria-hidden="true" /><div><TrafficHeading>{title}</TrafficHeading>
        <RangeLabel>{countries ? "Unike besøkende per land" : "Økter per trafikkilde"}</RangeLabel></div></TrafficCardHeader>
      <TrafficPeriodGrid>
            {columns.map((column, index) => <TrafficPeriodColumn key={index} aria-label={column.title}>
              <TrafficColumnHeader><div>
                {column.setOffset && <BtnIcon type="button" disabled={!column.canOlder}
                  aria-label={`Forrige ${column.unit} – ${subject}`}
                  onClick={() => column.setOffset((n) => n + 1)}>‹</BtnIcon>}
                <span>{column.title}</span>
                {column.setOffset && <BtnIcon type="button" disabled={column.offset === 0}
                  aria-label={`Neste ${column.unit} – ${subject}`}
                  onClick={() => column.setOffset((n) => n - 1)}>›</BtnIcon>}
              </div>{column.start && <small>{dateLabel(column.start)}–{dateLabel(column.end)}</small>}</TrafficColumnHeader>
              <PeriodList key={`${kind}-${column.start || "all"}-${column.end || ""}`}
                state={states[index]} kind={kind} total={totals[index]} title={column.title} />
            </TrafficPeriodColumn>)}
      </TrafficPeriodGrid>
    </TrafficSection>
  );
}

export default function TrafficOverview({ refreshKey = 0 }) {
  return <TrafficOverviewWrap aria-label="Trafikkoversikt"><SectionTitle>Trafikk</SectionTitle>
    <TrafficGrid><ComparisonCard kind="countries" refreshKey={refreshKey} />
      <ComparisonCard kind="sources" refreshKey={refreshKey} /></TrafficGrid>
  </TrafficOverviewWrap>;
}
