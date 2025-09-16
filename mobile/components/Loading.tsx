/**
 * Loading is a centered spinner placeholder for async states or suspense
 * boundaries. Drop in while data is fetching.
 */
import React from "react";
import { View, ActivityIndicator } from "react-native";

const Loading: React.FC = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" />
    </View>
  );
};

export default Loading;
