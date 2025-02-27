import styled from "styled-components";

export const HeaderContainer = styled.header`
  position: relative;
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    object-position: 40% 56%;
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
`;

export const NavContainer = styled.nav`
  background: ${(props) => props.theme.colors.accentTransparent};
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 1000;
  display: flex;
  padding: 10px 0px;

  a {
    color: ${(props) => props.theme.colors.primary};
    font-family: ${(props) => props.theme.fonts.heading};
  }
    .bottom-border {
    border-bottom: 1px solid ${(props) => props.theme.colors.primary};
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
