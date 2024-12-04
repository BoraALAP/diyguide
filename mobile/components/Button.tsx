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
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
}

const Button = ({
  title,
  variant = "primary",
  size = "medium",
  style,
  ...props
}: ButtonProps) => {
  const colorScheme = useColorScheme();
  const styles = StyleSheet.create({
    button: {
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    primary: {
      backgroundColor: Colors[colorScheme ?? "light"].tint,
    },
    secondary: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: Colors[colorScheme ?? "light"].tint,
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
      color: Colors[colorScheme ?? "light"].background,
    },
    secondaryText: {
      color: Colors[colorScheme ?? "light"].tint,
    },
  });

  return (
    <Pressable
      style={[
        styles.button,
        styles[variant],
        styles[size],
        style as StyleProp<ViewStyle>,
      ]}
      {...props}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
    </Pressable>
  );
};

export default Button;
