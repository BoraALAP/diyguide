import { router, Slot, Stack } from "expo-router";
import React from "react";
import Colors from "@/constants/Colors";
import { Pressable, Text, useColorScheme } from "react-native";
import { getDefaultStackOptions } from "@/utils/navigationOptions";


export default function _layout() {
  const colorScheme = useColorScheme();
  const baseStackOptions = getDefaultStackOptions(colorScheme);
  const stackScreenOptions = {
    ...baseStackOptions,
    headerBackButtonMenuEnabled: true,
  };

  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
          headerShown: false,


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
              <Text>✕</Text>
            </Pressable>
          ),
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}
