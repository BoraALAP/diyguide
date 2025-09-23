import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import {
  useFonts as useLexend,
  Lexend_100Thin,
  Lexend_200ExtraLight,
  Lexend_300Light,
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
  Lexend_800ExtraBold,
  Lexend_900Black,
} from "@expo-google-fonts/lexend";
import {
  useFonts as useLiterata,
  Literata_200ExtraLight,
  Literata_300Light,
  Literata_400Regular,
  Literata_500Medium,
  Literata_600SemiBold,
  Literata_700Bold,
  Literata_800ExtraBold,
  Literata_900Black,
  Literata_200ExtraLight_Italic,
  Literata_300Light_Italic,
  Literata_400Regular_Italic,
  Literata_500Medium_Italic,
  Literata_600SemiBold_Italic,
  Literata_700Bold_Italic,
  Literata_800ExtraBold_Italic,
  Literata_900Black_Italic,
} from "@expo-google-fonts/literata";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
// import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import { SupabaseProvider } from "@/utils/SupabaseProvider";
import { RevenueProvider } from "@/utils/RevenueProvider";
import { getDefaultStackOptions } from "@/utils/navigationOptions";


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    ...FontAwesome.font,
  });

  const [lexendLoaded] = useLexend({
    Lexend_100Thin,
    Lexend_200ExtraLight,
    Lexend_300Light,
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
    Lexend_800ExtraBold,
    Lexend_900Black,
  });

  const [literataLoaded] = useLiterata({
    Literata_200ExtraLight,
    Literata_300Light,
    Literata_400Regular,
    Literata_500Medium,
    Literata_600SemiBold,
    Literata_700Bold,
    Literata_800ExtraBold,
    Literata_900Black,
    Literata_200ExtraLight_Italic,
    Literata_300Light_Italic,
    Literata_400Regular_Italic,
    Literata_500Medium_Italic,
    Literata_600SemiBold_Italic,
    Literata_700Bold_Italic,
    Literata_800ExtraBold_Italic,
    Literata_900Black_Italic,
  });

  const loaded = fontsLoaded && lexendLoaded && literataLoaded;
  const error = fontError;

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const baseStackOptions = getDefaultStackOptions(colorScheme);
  const stackScreenOptions = {
    ...baseStackOptions,
    headerBackButtonMenuEnabled: true,
  };

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SupabaseProvider>
        <RevenueProvider>
          <Stack screenOptions={stackScreenOptions}>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                title: "",
              }}
            />
            <Stack.Screen
              name="[guide]"
              options={({ route }) => ({
                title: (route.params as { title?: string })?.title || "Guide",
              })}
            />
          </Stack>
        </RevenueProvider>
      </SupabaseProvider>
    </ThemeProvider>
  );
}
