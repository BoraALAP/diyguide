import { Stack } from "expo-router";
import React from "react";
import Colors from "@/constants/Colors";
import { useColorScheme } from "react-native";
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
          title: "Home",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="generate"
        options={{
          title: "Generate",
        }}
      />
    </Stack>
  );
}
