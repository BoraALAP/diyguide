import { Stack } from "expo-router";
import React from "react";

export default function _layout() {

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          headerBlurEffect: "regular",
          headerShadowVisible: false,
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="generate"
        options={{
          title: "Generate",
          headerBlurEffect: "regular",
          headerShadowVisible: false,
          headerTransparent: true,
        }}
      />
    </Stack>
  );
}
