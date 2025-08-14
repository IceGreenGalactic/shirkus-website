import styled from "styled-components";

export const StatsWrapper = styled.div`
  padding: 3rem 1rem;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  max-width: 1200px;
  margin: 0 auto;
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.title};
`;

export const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

export const StatBox = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.boxShadow};
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }

  h3 {
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
    font-family: ${({ theme }) => theme.fonts.heading};
    color: ${({ theme }) => theme.colors.accent};
  }

  p {
    margin: 0.25rem 0;
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 1rem;
  }

  strong {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const StatBoxCentered = styled(StatBox)`
  max-width: 600px;
  margin: 0 auto 3rem;
  text-align: center;
`;

export const Subtitle = styled.h3`
  margin: 2rem 0 1rem;
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.accent};
  font-size: 1.2rem;
`;

export const SmallText = styled.div`
  font-size: 0.85rem;
  margin: 0.2rem 0;
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.fonts.body};
`;

export const Arrow = styled.button`
  font-size: 0.85rem;
  margin: 0.2rem 0;
  color: ${({ theme }) => theme.colors.accent};
  background: transparent;
  font-family: ${({ theme }) => theme.fonts.body};
`;
