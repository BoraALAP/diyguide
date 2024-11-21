import { Slot, Stack } from "expo-router";
import React from "react";
import Colors from "@/constants/Colors";
import { useColorScheme } from "react-native";

const _layout = () => {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          headerBlurEffect: "systemUltraThinMaterialLight",
          headerShadowVisible: false,
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "rgba(253, 183, 166, 0.15)",
          },
          contentStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
        }}
      />
    </Stack>
  );
};

export default _layout;
