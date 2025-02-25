// src/pages/DogDetail.styled.js
import styled from "styled-components";

export const DetailContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: auto;
`;

export const DogImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const DogName = styled.h2`
  font-size: 2rem;
  margin: 1rem 0;
  color: #333;
`;

export const DogInfo = styled.p`
  font-size: 1.2rem;
  margin: 0.5rem 0;
  color: #555;
`;

export const HealthResults = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const HealthResultItem = styled.li`
  font-size: 1rem;
  margin: 0.5rem 0;
  color: #444;
`;
