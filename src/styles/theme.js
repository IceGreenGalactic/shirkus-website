export const getTheme = (settings = {}) => ({
  colors: {
    primary: settings.primaryColor || "#725A7A",
    secondary: settings.secondaryColor || "#9F7D94",
    accent: settings.accentColor || "#cc9fbd",
    accentTransparent: settings.accentTransparent || "rgba(176, 136, 163, 0.8)",
    white: "#FFFFFF", // Skal alltid være hvit
    background: settings.backgroundColor || "#F9F9F9",
    text: settings.textColor || "#343434",
    title: settings.titleColor || "#DA627D",
  },
  fonts: {
    body: settings.bodyFont || "Raleway, sans-serif",
    heading: settings.headingFont || "Quicksand, sans-serif",
    accent: settings.accentFont || "'Great Vibes', cursive",
  },
  shadows: {
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    textShadow: "0px 0px 1px rgba(0, 0, 0, 0.8)",
  },
});
