/**
 * Button is the shared pressable CTA with theme-aware variants, sizes, and
 * loading state. Use wherever a consistent app button is needed.
 */
import React from "react";
import { Pressable, PressableProps, StyleSheet, ActivityIndicator } from "react-native";
import Typography from "./Typography";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

interface ButtonProps extends Omit<PressableProps, "style"> {
  title?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "tertiary" | "destructive";
  size?: "small" | "medium" | "large";
  style?: any;
}

const Button: React.FC<ButtonProps> = ({
  title = "Generate",
  loading = false,
  disabled = false,
  variant = "primary",
  size = "medium",
  style,
  onPress,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const getBackgroundColor = () => {
    if (disabled) return colors.disabledBackground;

    switch (variant) {
      case "primary":
        return colors.primary;
      case "secondary":
        return "transparent";
      case "tertiary":
        return "transparent";
      case "destructive":
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const getBorderStyle = () => {
    if (variant === "secondary") {
      return {
        borderWidth: 1,
        borderColor: disabled ? colors.disabledText : colors.primary,
      };
    }
    return {};
  };

  const getTextColor = () => {
    if (disabled) return colors.disabledText;

    switch (variant) {
      case "primary":
        return colors.invertText;
      case "secondary":
        return colors.primary;
      case "tertiary":
        return colors.primary;
      case "destructive":
        return colors.invertText;
      default:
        return colors.invertText;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          paddingHorizontal: 8,
          paddingVertical: 4,
          minHeight: 28,
        };
      case "medium":
        return {
          paddingHorizontal: 8,
          paddingVertical: 6,
          minHeight: 34,
        };
      case "large":
        return {
          paddingHorizontal: 24,
          paddingVertical: 12,
          minHeight: 48,
        };
      default:
        return {
          paddingHorizontal: 8,
          paddingVertical: 6,
          minHeight: 34,
        };
    }
  };

  return (
    <Pressable
      {...props}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          ...getBorderStyle(),
          ...getSizeStyles(),
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <Typography
          variant="body"
          weight="regular"
          color={getTextColor()}
          font="lexend"
        >
          {title}
        </Typography>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    gap: 8,
  },
  pressed: {
    opacity: 0.8,
  },
});

export default Button;