const tintColorDark = "rgba(255, 87, 51, 1)";
const tintColorLight = "rgba(204, 36, 0, 1)";

export default {
  light: {
    text: "rgba(0, 0, 0, 1)",
    secondaryText: "rgba(48, 48, 48, 1)",
    background: "rgba(253, 253, 253, 1)",
    tint: tintColorLight,
    tabIconDefault: "rgba(180, 180, 180, 1)",
    tabIconSelected: tintColorLight,
    cardBackground: "rgba(255, 255, 255, 1)",
    inputBackground: "rgba(255, 255, 255, 0.75)",
    border: "rgba(200, 200, 200, 1)",
    headerBackground: "rgba(255, 255, 255, 0.55)",
    error: "rgba(255, 0, 0, 1)",
  },
  dark: {
    text: "rgba(255, 255, 255, 1)",
    secondaryText: "rgba(200, 200, 200, 1)",
    background: "rgba(24,24,24,1)",
    tint: tintColorDark,
    tabIconDefault: "rgba(200, 200, 200, 1)",
    tabIconSelected: tintColorDark,
    cardBackground: "rgba(48,48,48,1)",
    inputBackground: "rgba(24, 24, 24, 0.75)",
    border: "rgba(100, 100, 100, 1)",
    headerBackground: "rgba(0, 0, 0, 0.55)",
    error: "rgba(255, 100, 100, 1)",
  },
};
