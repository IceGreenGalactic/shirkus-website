import {
  SectionTitle,
  Sub,
  KPICard,
  KPIName,
  TrafficGrid,
  Badge,
} from "../../pages/info/Admin.styled";

const nf = new Intl.NumberFormat("no-NO");

function TrafficCard({ title, rows, labelKey }) {
  return (
    <KPICard>
      <KPIName>{title}</KPIName>

      {rows.length === 0 ? (
        <div>Ingen data ennå</div>
      ) : (
        rows.map((row) => (
          <div key={row[labelKey]}>
            <span>{row[labelKey]}</span>
            {" — "}
            <strong>{nf.format(Number(row.sessions || 0))}</strong>
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
          rows={countries}
          labelKey="country"
        />

        <TrafficCard
          title="Hvordan fant de oss?"
          rows={sources}
          labelKey="source"
        />
      </TrafficGrid>
    </>
  );
}
