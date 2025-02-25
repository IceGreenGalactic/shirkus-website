import styled from "styled-components";

export const DogsGrid = styled.section`
  display: grid;
  gap: 1rem;
  padding: 2rem;
  
  /* Mobil: 1 per rad */
  grid-template-columns: 1fr;

  @media (min-width: 600px) {
    /* Nettbrett: 2 per rad */
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 900px) {
    /* PC: 3 per rad */
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const DogCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 250px;
    object-fit: cover;
  }

  h3 {
    margin: 10px 0 5px;
    font-size: 1.5rem;
    color: #444;
  }

  h4 {
    margin-bottom: 15px;
    font-size: 1rem;
    color: #777;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;
