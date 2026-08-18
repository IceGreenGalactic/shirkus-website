import {
  SectionTitle,
  KPICard,
  KPIName,
  TrafficGrid,
  Badge,
  RangeLabel,
} from "../../pages/info/Admin.styled";

const nf = new Intl.NumberFormat("no-NO");

function TrafficCard({ title, rows, labelKey, valueKey, description }) {
  return (
    <KPICard>
      <KPIName>{title}</KPIName>
      <RangeLabel>{description}</RangeLabel>
      {rows.length === 0 ? (
        <div>Ingen data ennå</div>
      ) : (
        rows.map((row) => (
          <div key={row[labelKey]}>
            <span>{row[labelKey]}</span>
            {" — "}
            <strong>{nf.format(Number(row[valueKey] || 0))}</strong>
          </div>
        ))
      )}
    </KPICard>
  );
}

export default function TrafficOverview({ traffic }) {
  const countries = traffic?.countries || [];

  const sources = traffic?.sources || [];

  return (
    <>
      <SectionTitle>Trafikk</SectionTitle>

      <Badge>Fra 17.08.2026</Badge>

      <TrafficGrid>
        <TrafficCard
          title="Hvor kommer besøkende fra?"
          description="unike totalt"
          rows={countries}
          labelKey="country"
          valueKey="visitors"
        />

        <TrafficCard
          title="Hvordan fant de oss?"
          description="alle sessions"
          rows={sources}
          labelKey="source"
          valueKey="sessions"
        />
      </TrafficGrid>
    </>
  );
}
