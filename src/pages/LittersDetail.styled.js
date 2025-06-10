import styled from "styled-components";

export const LitterContainer = styled.div`
  margin: auto;
    justify-content: space-between;

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
  margin: 20px 0px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto auto;
  text-align: center;
  h3 {
    font-size: 1.8rem;
    color: ${(props) => props.theme.colors.title};
  }
`;

export const TitleRow = styled.div`
  font-weight: 600;
  font-size: 1rem;

  color: ${(props) => props.theme.colors.secondary};

  @media (max-width: 600px) {
    font-size: 0.9rem;
  }
  @media (max-width: 400px) {
    font-size: 0.8rem;
  }
`;

export const NameRow = styled.div`
  font-size: 1.3rem;
  font-weight: 500;
  min-height: 2rem;
  @media (max-width: 600px) {
    font-size: 1.1rem;
  }
`;

export const ImageRow = styled.div`
  img {
    width: 100%;
    height: auto;
    max-width: 100%;
    border-radius: 10px;
    object-fit: cover;
    object-position: top;
    min-height: 200px;
    max-height: 500px;
    aspect-ratio: 1 / 1;
  }
`;
export const NickNameRow = styled.div`
  .nickname {
    font-size: 2rem;
    color: ${(props) => props.theme.colors.title};
    font-family: ${(props) => props.theme.fonts.heading};
  }
`;

export const InfoRow = styled.div`
  line-height: 1.7rem;
  text-align: left;
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
