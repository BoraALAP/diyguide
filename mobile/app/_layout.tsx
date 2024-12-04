import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import RevenueProvider from "@/utils/RevenueProvider";

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
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <RevenueProvider>
        <Stack screenOptions={{ headerBackButtonMenuEnabled: true }}>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              title: "",
              contentStyle: {
                backgroundColor: Colors[colorScheme ?? "light"].background,
              },
            }}
          />
          <Stack.Screen
            name="[guide]"
            options={({ route }) => ({
              title: (route.params as { title?: string })?.title || "Guide",
              headerShadowVisible: false,
              headerTransparent: true,
              headerBlurEffect: "systemUltraThinMaterialLight",

              headerStyle: {
                backgroundColor:
                  Colors[colorScheme ?? "light"].headerBackground,
              },
              contentStyle: {
                backgroundColor: Colors[colorScheme ?? "light"].background,
              },
            })}
          />

          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </RevenueProvider>
    </ThemeProvider>
  );
}
