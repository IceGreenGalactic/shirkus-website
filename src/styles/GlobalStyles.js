// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${(props) => props.theme.fonts.main};
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
    line-height: 1.6;
    min-height: 100vh;
  }

  a {
    text-decoration: none;
    color: ${(props) => props.theme.colors.primary};
  }

  header, footer {
    background-color: ${(props) => props.theme.colors.footer};
    color: white;
  }
`;
