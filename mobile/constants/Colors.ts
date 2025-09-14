// Primary colors from Figma variables
const primaryColor = "hsl(193, 100%, 30%)"; // #007399
const primaryDarkColor = "hsl(200, 100%, 20%)"; // #004c66
const tintColorLight = primaryColor;
const tintColorDark = "hsl(193, 100%, 68%)"; // lighter version for dark mode

export default {
  light: {
    // Text colors from Figma
    text: "hsl(0, 0%, 12%)", // #1f1f1f - Text/Header
    secondaryText: "hsl(0, 0%, 35%)", // #595959 - Text/Medium
    lightText: "hsl(0, 0%, 40%)", // #666666 - Text/Light
    invertText: "hsl(0, 0%, 100%)", // #ffffff - Text/Invert

    // Background colors from Figma
    background: "hsl(0, 0%, 100%)", // white
    topBarBackground: "hsla(0, 0%, 100%, 0.8)", // #ffffffcc - BG/TopBar
    searchBarBackground: "hsla(0, 0%, 94%, 0.7)", // #efefefb2 - BG/SearchBar
    bottomNavBackground: "hsla(0, 0%, 100%, 0.5)", // #ffffff80 - BG/BottomNav
    badgeBackground: "hsl(0, 0%, 100%)", // #ffffff - BG/Badge
    pageBackground: "hsl(0, 0%, 97%)",

    // Input backgrounds from Figma
    inputBackground: "hsl(0, 0%, 100%)", // #ffffff - BG/Input/Default
    inputBackgroundDisabled: "hsl(0, 0%, 94%)", // #f0f0f0 - BG/Input/Disabled

    // Border colors from Figma
    border: "hsl(0, 0%, 85%)", // #d9d9d9 - Border/Input
    borderInputFilled: "hsl(0, 0%, 80%)", // #cccccc - Border/Input/Filled

    // Icon colors from Figma
    icon: "hsl(0, 0%, 40%)", // #666666 - Icon/Medium

    // Theme colors
    tint: tintColorLight,
    primary: primaryColor,
    primaryDark: primaryDarkColor,

    // Legacy colors (keeping for compatibility)
    tabIconDefault: "hsl(0, 0%, 40%)",
    tabIconSelected: tintColorLight,
    cardBackground: "hsl(0, 0%, 100%)",
    sectionBackground: "hsl(193, 100%, 85%)",
    headerBackground: "hsla(0, 0%, 100%, 0.25)",
    error: "hsl(0, 100%, 50%)",
    selectedPackage: "hsl(193, 100%, 85%)",
    selectedPackageBorder: tintColorLight,
    disabledBackground: "hsl(0, 0%, 88%)",
    disabledText: "hsl(0, 0%, 63%)",
  },
  dark: {
    // Text colors (dark mode variations)
    text: "hsl(0, 0%, 95%)",
    secondaryText: "hsl(0, 0%, 75%)",
    lightText: "hsl(0, 0%, 65%)",
    invertText: "hsl(0, 0%, 12%)",

    // Background colors (dark mode)
    background: "hsl(0, 0%, 9%)",
    topBarBackground: "hsla(0, 0%, 0%, 0.8)",
    searchBarBackground: "hsla(0, 0%, 15%, 0.7)",
    bottomNavBackground: "hsla(0, 0%, 0%, 0.5)",
    badgeBackground: "hsl(0, 0%, 20%)",
    pageBackground: "hsl(0, 0%, 20%)",

    // Input backgrounds (dark mode)
    inputBackground: "hsl(0, 0%, 15%)",
    inputBackgroundDisabled: "hsl(0, 0%, 10%)",

    // Border colors (dark mode)
    border: "hsl(0, 0%, 25%)",
    borderInputFilled: "hsl(0, 0%, 30%)",

    // Icon colors (dark mode)
    icon: "hsl(0, 0%, 60%)",

    // Theme colors
    tint: tintColorDark,
    primary: tintColorDark,
    primaryDark: primaryDarkColor,

    // Legacy colors (dark mode)
    tabIconDefault: "hsl(0, 0%, 70%)",
    tabIconSelected: tintColorDark,
    cardBackground: "hsl(0, 0%, 19%)",
    sectionBackground: "hsl(193, 100%, 17%)",
    headerBackground: "hsla(0, 0%, 0%, 0.25)",
    error: "hsl(0, 100%, 70%)",
    selectedPackage: "hsl(193, 100%, 25%)",
    selectedPackageBorder: tintColorDark,
    disabledBackground: "hsl(0, 0%, 29%)",
    disabledText: "hsl(0, 0%, 48%)",
  },
};
