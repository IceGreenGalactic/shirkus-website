import styled from "styled-components";

export const LittersContainer = styled.section`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1rem;
  text-align: center;

  h2 {
    margin: 1.5rem 0;
    font-size: 2rem;
    color: ${(props) => props.theme.colors.primary};
  }

  .litters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    padding-top: 1rem;
  }
`;

export const UpcomingLitter = styled.div`
  background: ${(props) => props.theme.colors.highlight};
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: ${(props) => props.theme.shadows.boxShadow};
  margin-bottom: 2rem;

  img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 8px;
  }

  h3 {
    font-size: 1.8rem;
    margin: 1rem 0 0.5rem;
    color: ${(props) => props.theme.colors.text};
  }

  p {
    font-size: 1.2rem;
    color: ${(props) => props.theme.colors.secondary};
  }

  a {
    text-decoration: none;
    color: inherit;
    display: block;
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

export const LitterCard = styled.div`
  background: ${(props) => props.theme.colors.white};
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  box-shadow: ${(props) => props.theme.shadows.boxShadow};
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
  }

  h4 {
    margin: 10px 0;
    font-size: 1.5rem;
    color: ${(props) => props.theme.colors.text};
  }

  a {
    text-decoration: none;
    color: inherit;
    display: block;
  }
`;
