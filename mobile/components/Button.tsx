import Colors from "@/constants/Colors";
import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  PressableProps,
  StyleProp,
  ViewStyle,
  useColorScheme,
} from "react-native";

interface ButtonProps extends PressableProps {
  title: string;
  variant?: "primary" | "secondary" | "tertiary" | "destructive";
  size?: "small" | "medium" | "large";
}

export const Button = ({
  title,
  variant = "primary",
  size = "large",
  style,
  ...props
}: ButtonProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const styles = StyleSheet.create({
    button: {
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    primary: {
      backgroundColor: theme.tint,
    },
    secondary: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.tint,
    },
    tertiary: {
      backgroundColor: "transparent",
    },
    small: {
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    medium: {
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    large: {
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    text: {
      fontSize: 14,
      fontWeight: "600",
    },
    primaryText: {
      color: theme.background,
    },
    secondaryText: {
      color: theme.tint,
    },
    tertiaryText: {
      color: theme.tint,
    },
    disabledPrimary: {
      backgroundColor: theme.disabledBackground,
    },
    disabledSecondary: {
      borderColor: theme.disabledText,
    },
    disabledTertiary: {
      // No background, only text color change
    },
    destructive: {
      backgroundColor: theme.error,
    },
    disabledText: {
      color: theme.disabledText,
    },
    destructiveText: {
      color: theme.background,
    },
  });

  return (
    <Pressable
      style={[
        styles.button,
        styles[variant],
        props.disabled &&
          styles[
            `disabled${variant.charAt(0).toUpperCase() + variant.slice(1)}` as
              | "disabledPrimary"
              | "disabledSecondary"
              | "disabledTertiary"
          ],
        styles[size],
        style as StyleProp<ViewStyle>,
      ]}
      {...props}
    >
      <Text
        style={[
          styles.text,
          styles[`${variant}Text`],
          props.disabled && styles.disabledText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

interface InlineButtonProps extends PressableProps {
  title: string;
  color?: "primary" | "error";
}

export const InlineButton = ({
  title,
  color = "primary",
  style,
  ...props
}: InlineButtonProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const styles = StyleSheet.create({
    button: {
      flexDirection: "row",
      alignItems: "center",
    },
    text: {
      fontSize: 13,
      fontWeight: "600",
    },
    primary: {
      color: theme.tint,
    },
    error: {
      color: theme.error,
    },
  });

  return (
    <Pressable
      style={[styles.button, style as StyleProp<ViewStyle>]}
      {...props}
    >
      <Text style={[styles.text, styles[color]]}>{title}</Text>
    </Pressable>
  );
};
