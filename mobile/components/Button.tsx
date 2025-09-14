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
  ActivityIndicator,
} from "react-native";
import Typography from "./Typography";

interface ButtonProps extends PressableProps {
  title: string;
  variant?: "primary" | "secondary" | "tertiary" | "destructive";
  size?: "small" | "medium" | "large";
  loading?: boolean;
}

export const Button = ({
  title,
  variant = "primary",
  size = "large",
  loading = false,
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

  const getTextWeight = () => {
    switch (size) {
      case "small":
        return "medium";
      case "medium":
        return "semiBold";
      case "large":
        return "bold";
      default:
        return "semiBold";
    }
  };

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
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" || variant === "destructive" ? theme.background : theme.tint}
        />
      ) : (
        <Typography
          variant="button"
          weight={getTextWeight() as any}
          color={
            props.disabled
              ? theme.disabledText
              : variant === "primary" || variant === "destructive"
              ? theme.background
              : theme.tint
          }
          font="lexend"
        >
          {title}
        </Typography>
      )}
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
