// src/components/Footer.styled.js
import styled from "styled-components";

export const FooterContainer = styled.footer`
  background: ${(props) => props.theme.colors.accentTransparent};
  color: ${(props) => props.theme.colors.white};
  padding: 1rem;
  text-align: center;
  margin-top: 20px;

  .footer-content {
    font-size: 0.9rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;

    @media (min-width: 992px) {
      flex-direction: row;
      justify-content: space-evenly;
      gap: 1.5rem;
      align-items: flex-start;
    }

    a {
      color: ${(props) => props.theme.colors.white};
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  }

  .made-by {
    font-size: 0.8rem;
    margin-bottom: 0px;
  }
`;
