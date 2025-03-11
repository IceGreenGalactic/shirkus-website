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
    border-bottom: 1px solid ${(props) => props.theme.colors.accent};

    border-top: 1px solid ${(props) => props.theme.colors.accent};
    padding: 20px 0px;
  }
`;

export const ParentInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  h3 {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    text-align: center;
  }
`;

export const ParentInfo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 0.1rem;
`;

export const ParentImage = styled.img`
  width: 100%;
  height: auto;
  max-width: 100%;
  border-radius: 10px;
  object-fit: contain;
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
