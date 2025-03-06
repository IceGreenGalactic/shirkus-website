import styled from "styled-components";

export const HeaderImg = styled.div`
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

export const HeaderContainer = styled.header`
  display: table;
  position: sticky;
  top: 0;
  background: ${(props) => props.theme.colors.accentTransparent};
  align-items: center;

  @media (min-width: 992px) {
    padding: 0px;
    position: static;
  }
`;

export const HeroText = styled.h1`
  position: relative;
  font-size: 2.5rem;
  color: ${(props) => props.theme.colors.white};
  text-shadow: ${(props) => props.theme.shadows.textShadow};
  @media (max-width: 500px) {
    font-size: 2.3rem;
  }
  @media (max-width: 330px) {
    font-size: 2.3rem;
  }
`;

export const NavContainer = styled.nav`
  flex-grow: 0;
  width: auto;
  z-index: 1000;

  .navbar-collapse {
    background: transparent;
    @media (min-width: 992px) {
      background: transparent;
    }
  }
  .navbar-toggler {
    position: relative;
    
  }

  a {
    color: ${(props) => props.theme.colors.primary};
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
  .bottom-border.active {
    border-bottom: 2px solid ${(props) => props.theme.colors.accentTransparent};
    @media (max-width: 992px) {
      border-bottom: 2px solid ${(props) => props.theme.colors.white};
    }
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
