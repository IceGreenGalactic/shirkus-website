import styled from "styled-components";

export const LitterContainer = styled.div`
  margin: auto;
  h2 {
    font-size: 3rem;
    font-family: ${(props) => props.theme.fonts.accent};
    color: ${(props) => props.theme.colors.accent};
    font-weight: 900;
  }
  .costum-border {
    border-top: 1px solid ${(props) => props.theme.colors.accent};
    padding: 10px 0px;
  }
`;

export const ParentInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
`;

export const ParentInfo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 0.1rem;
  h3 {
    display: flex;
    align-items: center;
    min-height: 90px;
    font-size: 1.5rem;
  }
`;

export const ParentImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
  object-fit: contain;
`;

export const PuppyGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
  justify-items: center;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }

  @media (max-width: 500px) {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  }

  @media (max-width: 381px) {
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  }
`;

export const PuppyImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
`;

export const PuppiesContainer = styled.div`
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
    cursor: pointer;
  }
`;

export const MainImgContainer = styled.div`
  display: flex;
  margin: auto;
  justify-content: center;
  img {
    width: 100%;

    height: auto;
    border-radius: 8px;
    object-fit: contain;
  }
`;
