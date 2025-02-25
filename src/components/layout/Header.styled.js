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
  bottom: 2%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
`;

export const NavContainer = styled.nav`
  background: rgba(255, 255, 255, 0.9);
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 1000;
  display: flex;

  a {
    color: black;
  }
    .nav-icon {
    color:rgb(8, 137, 135); 
    width: 30px; 
    height: 30px;
    margin: 0 5px; 
  }
  @media (min-width: 769px) {
    position: static;
    padding: 0;
    width: 100%;
  }
`;
