import styled from "styled-components";

export const LitterContainer = styled.div`
  max-width: 900px;
  margin: auto;
  padding: 2rem;
`;

export const ParentInfo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const ParentImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
`;

export const PuppyGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`;

export const PuppyImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
`;
