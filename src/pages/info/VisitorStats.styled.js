import styled from "styled-components";

export const StatsWrapper = styled.div`
  padding: 3rem 1rem;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  max-width: 1200px;
  margin: 0 auto;
`;

export const SectionGrid = styled.div`
  display: grid;
  /* Fleksible kolonner som bryter pent */
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;

  /* Viktig: sentrer kortet inni cellen på hver kolonne */
  justify-items: center;

  margin-bottom: 2rem;
`;

export const StatBox = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.boxShadow};
  padding: 1rem 2rem;
  transition: transform 0.15s ease;
  width: 100%;
  max-width: 360px;

  display: flex;
  flex-direction: column;
  min-height: clamp(220px, 35vh, 340px);
  max-height: clamp(220px, 40vh, 380px);

  &:hover {
    transform: translateY(-1px);
  }

  .nav {
    display: grid;
    grid-template-columns: 2rem 1fr 2rem;
    align-items: center;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
  }

  h3 {
    margin: 0;
    text-align: center;
    font-size: 1.3rem;
    color: ${({ theme }) => theme.colors.title};
  }

  p {
    margin: 0.25rem 0;
  }
  strong {
    color: ${({ theme }) => theme.colors.primary};
  }

  /* Scroll-område: tar alltid “resten” av plassen */
  .scroll {
    margin-top: 0.25rem;
    overflow-y: auto;
    flex: 1;
    padding-right: 0.25rem;
    -webkit-overflow-scrolling: touch;
  }

  /* Valgfritt: litt penere scrollbar */
  .scroll::-webkit-scrollbar {
    width: 8px;
  }
  .scroll::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 6px;
  }
`;

export const StatBoxCentered = styled(StatBox)`
  max-width: 640px;
  margin: 0 auto 2rem;
  text-align: center;

  min-height: auto;
  max-height: none;

  .scroll {
    flex: unset;
    overflow: visible;
  }
`;

export const SmallText = styled.div`
  font-size: 0.85rem;
  margin-top: 0.3rem;
  opacity: 0.85;

  .text-accent {
    color: ${({ theme }) => theme.colors.title};
  }
`;

export const Arrow = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  font-size: 1.2rem;
  color: ${({ theme, disabled }) =>
    disabled ? theme.colors.secondary : theme.colors.accent};
  background: transparent;
  border: none;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  transition: color 0.2s ease;
`;
