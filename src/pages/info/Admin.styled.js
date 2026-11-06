import styled from "styled-components";

const pawPattern = (color) => `url("data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="520" height="560" viewBox="0 0 520 560">
    <defs>
      <g id="paw" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="18" cy="27" rx="6" ry="9" transform="rotate(-28 18 27)"/>
        <ellipse cx="32" cy="16" rx="6" ry="9" transform="rotate(-10 32 16)"/>
        <ellipse cx="48" cy="16" rx="6" ry="9" transform="rotate(10 48 16)"/>
        <ellipse cx="62" cy="27" rx="6" ry="9" transform="rotate(28 62 27)"/>
        <path d="M40 33C32 33 29 42 23 47C17 52 18 63 26 65C31 67 35 62 40 62C45 62 49 67 54 65C62 63 63 52 57 47C51 42 48 33 40 33Z"/>
      </g>
    </defs>
    <use href="#paw" transform="translate(24 36) rotate(-22 40 36) scale(1.15)"/>
    <use href="#paw" transform="translate(332 20) rotate(24 40 36) scale(.6)"/>
    <use href="#paw" transform="translate(198 180) rotate(16 40 36) scale(.8)"/>
    <use href="#paw" transform="translate(406 260) rotate(-18 40 36) scale(1.05)"/>
    <use href="#paw" transform="translate(18 358) rotate(28 40 36) scale(.55)"/>
    <use href="#paw" transform="translate(234 414) rotate(-24 40 36) scale(1.35)"/>
  </svg>
`)}")`;

export const Wrap = styled.div`
  position: relative;
  isolation: isolate;
  padding: 32px 24px;
  max-width: 1100px;
  margin: 0 auto;

  &::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background-image: ${({ theme }) => pawPattern(theme.colors.primary)};
    background-repeat: repeat;
    opacity: 0.12;
  }
`;

export const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.title};
  margin: 0 0 12px;
`;

export const Sub = styled.p`
  margin: 0 0 24px;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.8;
`;
export const Sub2 = styled.p`
  margin: 0 0 18px;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.8;
  fontsize: 8px;
`;

export const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const KPICard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.boxShadow};
  padding: 20px;
  border: 1px solid #eee;
`;

export const KPIName = styled.div`
  font-size: 13px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 8px;
`;

export const KPIValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const TableWrap = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.boxShadow};
  border: 1px solid #eee;
  overflow: hidden;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

export const Th = styled.th`
  text-align: left;
  padding: 14px 16px;
  background: ${({ theme }) => theme.colors.accentTransparent};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;

  &:not(:first-child) {
    text-align: right;
  }
  @media (max-width: 400px) {
    padding: 14px 10px;
  }
`;

export const Td = styled.td`
  padding: 14px 16px;
  border-top: 1px solid #f1f1f1;
  color: ${({ theme }) => theme.colors.text};
  &:not(:first-child) {
    text-align: right;
  }
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid #eee;
  font-size: 12px;
  margin: 0px 0px 10px 1px;
`;

export const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  margin: 28px 0 12px;
  font-size: 22px;
`;

export const Btn = styled.button`
  border: 1px solid #e6e6e6;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

/* ====== Rotating cards grid and styles====== */

export const RangeGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 8px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const RangeSection = styled.div`
  display: grid;
  text-align: center;
`;

export const RangeCardWrap = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.boxShadow};
  border: 1px solid #eee;
  padding: 16px;
  display: grid;
  gap: 10px;
`;

export const RangeTop = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  gap: 8px;
`;

export const RangeTitleCenter = styled.div`
  text-align: center;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const BtnIcon = styled.button`
  border: 1px solid #e6e6e6;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 10px;
  padding: 6px 10px;
  cursor: pointer;
  line-height: 1;
  &:hover {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;

export const RangeLabel = styled.div`
  font-size: 14px;
  opacity: 0.75;
  text-align: center;
`;

export const RangeMetrics = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-items: end;
`;

export const Metric = styled.div``;

export const MetricName = styled.div`
  font-size: 12px;
  opacity: 0.7;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const MetricValue = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

export const ParentRow = styled.tr`
  &.open > td {
    background: ${({ theme }) => theme.colors.background};
  }
`;

export const ChildRow = styled.tr`
  background: ${({ theme }) => theme.colors.background};
  font-size: 12px;
  td {
    border-top: 1px solid #f1f1f1;
  }
`;

export const ChildCellName = styled.td`
  padding: 12px 16px 12px 56px;
  color: ${({ theme }) => theme.colors.text};
  position: relative;

  &::before {
    content: "🐾";
    position: absolute;
    left: 36px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.6;
    font-size: 12px;
  }
`;

export const ChildCell = styled.td`
  padding: 12px 16px;
  text-align: right;
  color: ${({ theme }) => theme.colors.text};
`;

export const Arrow = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  margin-right: 6px;
  font-size: 14px;
  opacity: 0.45;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease,
    color 0.15s ease;
  color: ${({ theme }) => theme.colors.accentTransparent};
  transform-origin: center;

  &.open {
    transform: rotate(40deg);
    color: ${({ theme }) => theme.colors.accent};
    opacity: 0.9;
  }
`;

export const TrafficOverviewWrap = styled.section`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: min(1560px, calc(100vw - 48px));
  @media (max-width: 700px) { width: calc(100vw - 32px); }
`;

export const TrafficGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
  align-items: start;
  margin-top: 20px;
  @media (max-width: 1050px) { grid-template-columns: minmax(0, 1fr); }
`;

export const TrafficSection = styled.section`
  min-width: 0;
  padding: 22px 16px 14px;
  border-radius: 24px;
  background: linear-gradient(150deg,
    color-mix(in srgb, ${({ theme }) => theme.colors.accent} 4%, ${({ theme }) => theme.colors.white}),
    ${({ theme }) => theme.colors.white});
  border: 1px solid color-mix(in srgb, ${({ theme }) => theme.colors.accent} 40%, transparent);
  box-shadow: 0 9px 24px rgba(0, 0, 0, 0.12);
  > ${BtnIcon} { color: ${({ theme }) => theme.colors.title}; border-color: ${({ theme }) => theme.colors.accent}; }
  @media (max-width: 700px) { padding: 18px 10px 12px; border-radius: 18px; }
`;

export const TrafficHeading = styled.h3`
  margin: 0 0 4px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(22px, 2vw, 30px);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.title};
`;

export const TrafficCardHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0 10px 20px;
  > svg { width: 44px; height: 44px; flex-shrink: 0; color: ${({ theme }) => theme.colors.accent}; }
  ${RangeLabel} { text-align: left; font-size: 14px; opacity: 0.85; }
`;

export const TrafficColumnHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 60px;
  padding: 6px 2px;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.title};
  background: color-mix(in srgb, ${({ theme }) => theme.colors.accent} 12%, ${({ theme }) => theme.colors.white});
  > div { display: flex; align-items: center; justify-content: center; gap: 2px; font-weight: 700; font-size: 13px; }
  small { font-weight: 400; font-size: 10px; line-height: 1.4; margin-top: 4px; }
  ${BtnIcon} { border: 0; background: transparent; padding: 3px; color: inherit; }
`;

export const TrafficPeriodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  align-items: start;
  @media (max-width: 500px) { gap: 5px; }
`;

export const TrafficPeriodColumn = styled.section`
  min-width: 0;
  ${TrafficColumnHeader} { margin-bottom: 12px; }
  > ${RangeLabel} { font-size: 12px; }
  > ${BtnIcon} {
    padding: 4px 6px;
    margin-top: 8px;
    font-size: 11px;
    color: ${({ theme }) => theme.colors.title};
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

export const TrafficPeriodList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const TrafficPeriodRow = styled.li`
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 4px 2px;
  font-size: 13px;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.text};
  strong { font-variant-numeric: tabular-nums; color: ${({ theme }) => theme.colors.title}; }
  @media (max-width: 500px) { font-size: 12px; gap: 4px; }
`;

export const TrafficPeriodTotal = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  padding: 9px 8px;
  border-radius: 10px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.title};
  background: color-mix(in srgb, ${({ theme }) => theme.colors.accent} 20%, ${({ theme }) => theme.colors.white});
`;

export const TrafficLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 9px;
  > span:first-child { display: flex; align-items: center; font-size: 18px; color: ${({ theme }) => theme.colors.accent}; }
  > span:last-child { overflow-wrap: anywhere; }
`;

export const ScrollTopButton = styled(BtnIcon)`
  position: fixed;
  right: 20px;
  bottom: max(20px, env(safe-area-inset-bottom));
  z-index: 100;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.primary};
  border-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.16);
`;
