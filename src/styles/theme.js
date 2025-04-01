import { hexToRgba } from "../utils/hexToRgba";

const extractHex = (val, fallback) => {
  if (!val) return fallback;
  if (typeof val === "string") return val;
  if (typeof val.hex === "string") return val.hex;
  if (val.hex?.value) return val.hex.value;
  return fallback;
};

export const getTheme = (settings) => {
  settings = settings || {};
  const accent = extractHex(settings.accentColor, "#5F9EA0");

  return {
    colors: {
      primary: extractHex(settings.primaryColor, "#2C3E50"),
      secondary: extractHex(settings.secondaryColor, "#60635f"),
      accent,
      accentTransparent: hexToRgba(accent, 0.8),
      white: "#FFFFFF",
      background: extractHex(settings.backgroundColor, "#F8F9FA"),
      text: extractHex(settings.textColor, "#333333"),
      title: extractHex(settings.titleColor, "#1C7C7F"),
    },
    fonts: {
      body: settings.bodyFont || "Roboto, sans-serif",
      heading: settings.headingFont || "Cormorant Garamond, serif",
      accent: settings.accentFont || "'Tangerine', cursive, sans-serif",
    },
    shadows: {
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
    },
  };
};
