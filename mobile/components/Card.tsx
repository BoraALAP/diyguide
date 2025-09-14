import React from "react";
import {
  View,
  ViewProps,
  StyleSheet,
  Pressable,
  PressableProps,
} from "react-native";
import { useColorScheme } from "./useColorScheme";
import Colors from "@/constants/Colors";

interface CardProps extends ViewProps {
  variant?: "elevated" | "outlined" | "filled";
  padding?: "none" | "small" | "medium" | "large";
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = "elevated",
  padding = "medium",
  style,
  children,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const getVariantStyle = () => {
    switch (variant) {
      case "elevated":
        return {
          backgroundColor: colors.cardBackground || colors.background,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        };
      case "outlined":
        return {
          backgroundColor: colors.cardBackground || colors.background,
          borderWidth: 1,
          borderColor: colors.border || colors.icon,
        };
      case "filled":
        return {
          backgroundColor: colors.cardBackground || colors.background,
        };
      default:
        return {};
    }
  };

  const getPaddingStyle = () => {
    switch (padding) {
      case "none":
        return { padding: 0 };
      case "small":
        return { padding: 8 };
      case "medium":
        return { padding: 16 };
      case "large":
        return { padding: 24 };
      default:
        return { padding: 16 };
    }
  };

  return (
    <View
      {...props}
      style={[
        styles.base,
        getVariantStyle(),
        getPaddingStyle(),
        style,
      ]}
    >
      {children}
    </View>
  );
};

interface PressableCardProps extends PressableProps {
  variant?: "elevated" | "outlined" | "filled";
  padding?: "none" | "small" | "medium" | "large";
  children: React.ReactNode;
}

export const PressableCard: React.FC<PressableCardProps> = ({
  variant = "elevated",
  padding = "medium",
  style,
  children,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const getVariantStyle = () => {
    switch (variant) {
      case "elevated":
        return {
          backgroundColor: colors.cardBackground || colors.background,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        };
      case "outlined":
        return {
          backgroundColor: colors.cardBackground || colors.background,
          borderWidth: 1,
          borderColor: colors.border || colors.icon,
        };
      case "filled":
        return {
          backgroundColor: colors.cardBackground || colors.background,
        };
      default:
        return {};
    }
  };

  const getPaddingStyle = () => {
    switch (padding) {
      case "none":
        return { padding: 0 };
      case "small":
        return { padding: 8 };
      case "medium":
        return { padding: 16 };
      case "large":
        return { padding: 24 };
      default:
        return { padding: 16 };
    }
  };

  return (
    <Pressable
      {...props}
    // style={({ pressed }) => [
    //   styles.base,
    //   getVariantStyle(),
    //   getPaddingStyle(),
    //   pressed && styles.pressed,
    //   style,
    // ]}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    overflow: "hidden",
  },
  pressed: {
    opacity: 0.8,
  },
});