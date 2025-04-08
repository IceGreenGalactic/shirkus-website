import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=Roboto:wght@400;700&family=Tangerine&display=swap');
    
root:
*{
  background: ${(props) => props.theme.colors.background};
}
  body {
    font-family: ${(props) => props.theme?.fonts?.body || "sans-serif"}; 
    color: ${(props) => props.theme?.colors?.text || "#333"};
  background: ${(props) => props.theme.colors.background};
    padding: 0;
    height: 100vh; 
  }

  h1, h2, h3 {
    font-family: ${(props) => props.theme?.fonts?.heading || "serif"}; 
  }

  a {
    text-decoration: none;
  }

  p, h1, h2, h3, li, span, div {
    white-space: pre-line;
  }

    img:not(.hero-image, .gallery-image, .no-theme) {
    border-radius: ${(props) => props.theme?.imageStyles?.borderRadius || "0"};
    border: ${(props) => props.theme?.imageStyles?.border || "none"};
    box-shadow: ${(props) => props.theme?.imageStyles?.boxShadow || "none"};
    object-fit: cover;
  }
`;
