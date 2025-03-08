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
  font-size: 2.6rem;
  background: ${(props) => props.theme.colors.accentTransparent};

  color: ${(props) => props.theme.colors.white};
  text-shadow: ${(props) => props.theme.shadows.textShadow};
  @media (max-width: 992px) {
    position: relative;
    bottom: 0%;
    font-size: 3rem;
    background: transparent;
    display: flex;
    color: ${(props) => props.theme.colors.white};
    text-shadow: ${(props) => props.theme.shadows.textShadow};
  }
  @media (max-width: 600px) {
    font-size: 2.4rem;
  }
  @media (max-width: 350px) {
    font-size: 2rem;
  }
`;

export const NavContainer = styled.nav`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  background: ${(props) => props.theme.colors.accent};
  z-index: 1000;
  transition: all 0.3s ease-in-out;

  .navbar {
    a {
      color: ${(props) => props.theme.colors.text};
      font-family: ${(props) => props.theme.fonts.heading};
      text-decoration: none;
      padding: 1rem;
      transition: all 0.3s ease;
      display: inline-block;
      position: relative;

      &:hover {
        color: ${(props) => props.theme.colors.accent};
      }

      span {
        position: relative;
      }

      &.active {
        color: black;

        span::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: ${(props) => props.theme.colors.white};
        }
        @media (min-width: 992px) {
          span::after {
            background-color: ${(props) => props.theme.colors.accent};
          }
        }
      }
    }
  }

  @media (min-width: 992px) {
    position: static;
    padding: 0;
    width: 100%;
    background: ${(props) => props.theme.colors.background};
  }
`;
