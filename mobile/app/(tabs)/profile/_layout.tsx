import { router, Slot, Stack } from "expo-router";
import React from "react";
import Colors from "@/constants/Colors";
import { Pressable, useColorScheme } from "react-native";
import { TextT } from "@/components/Themed";

export default function _layout() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
          headerShown: false,
          headerBlurEffect: "systemUltraThinMaterialLight",
          headerShadowVisible: false,
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "rgba(238, 238, 238, 0.15)",
          },
          contentStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
        }}
      />
      <Stack.Screen
        name="editmodal"
        options={{
          presentation: "modal",
          title: "",
          headerLeft: () => null,
          headerRight: () => (
            <Pressable onPress={() => router.back()} style={{ padding: 10 }}>
              <TextT>✕</TextT>
            </Pressable>
          ),
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="paywall"
        options={{
          presentation: "modal",
          title: "",
          headerLeft: () => null,
          headerRight: () => (
            <Pressable onPress={() => router.back()} style={{ padding: 10 }}>
              <TextT>✕</TextT>
            </Pressable>
          ),
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}
