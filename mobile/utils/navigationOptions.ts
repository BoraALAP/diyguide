import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

import Colors from "@/constants/Colors";

type ColorScheme = "light" | "dark" | null | undefined;

/**
 * Centralizes default stack options so screens share the same header styling.
 */
export const getDefaultStackOptions = (
  colorScheme: ColorScheme,
  overrides: NativeStackNavigationOptions = {},
): NativeStackNavigationOptions => {
  const scheme = (colorScheme ?? "light") as keyof typeof Colors;
  const palette = Colors[scheme];

  return {
    headerShadowVisible: false,
    headerTransparent: true,
    headerBlurEffect: "regular",
    headerBackTitleStyle: {
      fontFamily: "Lexend_500Medium",
    },
    headerBackTitle: "Back",
    headerTitleStyle: {
      fontFamily: "Lexend_700Bold",
    },
    headerStyle: {
      backgroundColor: palette.headerBackground,
    },
    contentStyle: {
      backgroundColor: palette.pageBackground,
    },
    ...overrides,
  };
};
