const tintColorLight = "rgba(204, 36, 0, 1)";
const tintColorDark = "rgba(255, 87, 51, 1)";

export default {
  light: {
    text: "rgba(0, 0, 0, 1)",
    secondaryText: "rgba(48, 48, 48, 1)",
    background: "rgba(253, 253, 253, 1)",
    tint: tintColorLight,
    tabIconDefault: "rgba(180, 180, 180, 1)",
    tabIconSelected: tintColorLight,
    cardBackground: "rgba(255, 255, 255, 1)",
    sectionBackground: "rgba(243, 235, 233, 1)",
    inputBackground: "rgba(255, 255, 255, 0.75)",
    border: "rgba(200, 200, 200, 1)",
    headerBackground: "rgba(255, 255, 255, 0.55)",
    error: "rgba(255, 0, 0, 1)",
    selectedPackage: "rgba(255, 184, 168, 1)",
    selectedPackageBorder: tintColorLight,
    disabledBackground: "rgba(224, 224, 224,1)",
    disabledText: "rgba(160, 160, 160,1)",
  },
  dark: {
    text: "rgba(255, 255, 255, 1)",
    secondaryText: "rgba(200, 200, 200, 1)",
    background: "rgba(24,24,24,1)",
    tint: tintColorDark,
    tabIconDefault: "rgba(200, 200, 200, 1)",
    tabIconSelected: tintColorDark,
    cardBackground: "rgba(48,48,48,1)",
    sectionBackground: "rgba(43,28,25,1)",
    inputBackground: "rgba(24, 24, 24, 0.75)",
    border: "rgba(100, 100, 100, 1)",
    headerBackground: "rgba(0, 0, 0, 0.55)",
    error: "rgba(255, 100, 100, 1)",
    selectedPackage: "rgba(78, 14, 0, 1)",
    selectedPackageBorder: tintColorDark,
    disabledBackground: "rgba(74, 74, 74,1)",
    disabledText: "rgba(122, 122, 122,1)",
  },
};
