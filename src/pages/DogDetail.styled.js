import styled from "styled-components";

export const DetailContainer = styled.div`
  padding: 2rem;
  margin: auto;
`;

export const DogImage = styled.img`

  box-shadow: ${(props) => props.theme.shadows.boxShadow};
`;

export const DogName = styled.h2`
  font-size: 3rem;
  margin: 1rem 0;
  color: ${(props) => props.theme.colors.accent};
  font-family: ${(props) => props.theme.fonts.heading};
  text-shadow: ${(props) => props.theme.shadows.textShadow};
`;

export const DogInfo = styled.p`
  font-size: 1.2rem;
  margin: 0.5rem 0;
  color: ${(props) => props.theme.colors.text};
  font-weight: normal;
`;

export const InfoTitle = styled.span`
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
`;

export const HealthResults = styled.div`
  border-radius: 8px;
`;

export const HealthResultItem = styled.li`
  font-size: 1rem;
  margin: 0.5rem 0;
  color: ${(props) => props.theme.colors.text};
`;
