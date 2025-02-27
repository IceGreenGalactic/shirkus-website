import styled from "styled-components";

export const HeaderContainer = styled.header`
  position: relative;
  height: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    object-position: 50% 50%;
  }
`;

export const HeroText = styled.h1`
  position: absolute;
  bottom: 0%;
  font-size: 3rem;
  color: ${(props) => props.theme.colors.white};
  text-shadow: ${(props) => props.theme.shadows.textShadow};
  background: ${(props) => props.theme.colors.accentTransparent};
  @media (max-width: 500px) {
    font-size: 2.8rem;
  }
    @media (max-width: 330px) {
    font-size: 2.3rem;
  }
`;

export const NavContainer = styled.nav`
  background: ${(props) => props.theme.colors.accent};
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 1000;
  display: flex;
  padding: 10px 0px;

  a {
    color: #F2E6D0;
    font-family: ${(props) => props.theme.fonts.heading};
    @media (min-width: 992px) {
      color: ${(props) => props.theme.colors.primary};
    }
  }
  .bottom-border {
    border-bottom: 1px solid ${(props) => props.theme.colors.primary};

    @media (min-width: 992px) {
      border-bottom: transparent;
    }
  }

  .nav-icon {
    color: ${(props) => props.theme.colors.primary};
    width: 30px;
    height: 30px;
    margin: 0 5px;
  }

  @media (min-width: 992px) {
    position: static;
    padding: 0;
    width: 100%;
    background: ${(props) => props.theme.colors.background};
  }
`;

export const MenueLineBottom = styled.div`
  background: ${(props) => props.theme.colors.accent};
`;
