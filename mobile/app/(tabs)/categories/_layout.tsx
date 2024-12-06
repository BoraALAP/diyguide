import { Slot, Stack } from "expo-router";
import React from "react";
import Colors from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Text } from "@/components/Themed";

const _layout = () => {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Categories",
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
        name="[id]"
        options={({ route }) => ({
          title: (route.params as { title?: string })?.title || "Category",
          headerBlurEffect: "systemUltraThinMaterialLight",
          headerShadowVisible: false,
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "rgba(238, 238, 238, 0.15)",
          },
          contentStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
        })}
      />
    </Stack>
  );
};

export default _layout;
